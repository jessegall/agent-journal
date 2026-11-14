import { openBlock as r, createElementBlock as d, normalizeStyle as ge, unref as B, renderSlot as re, createElementVNode as h, normalizeClass as Y, Fragment as L, renderList as te, defineComponent as uu, Comment as cu, h as pa, cloneVNode as du, createBlock as j, withCtx as P, createVNode as A, toDisplayString as g, createCommentVNode as k, ref as _, inject as Me, watch as pe, onMounted as Ce, onBeforeUnmount as st, reactive as Kt, shallowRef as nt, onUnmounted as Ne, useAttrs as va, computed as x, resolveDynamicComponent as Qe, mergeProps as Pe, useId as Ps, resolveDirective as fu, withDirectives as _e, createTextVNode as U, Teleport as xn, nextTick as We, Transition as Yt, withModifiers as $e, createApp as mu, shallowReactive as hu, withKeys as At, createSlots as Ul, onScopeDispose as ga, useModel as dn, mergeModels as Ht, toRef as Aa, vModelText as Ke, resolveComponent as pu, provide as js, onErrorCaptured as vu, TransitionGroup as Fs, isRef as Ao, getCurrentInstance as gu, getCurrentScope as Vl, normalizeProps as fs, guardReactiveProps as Gl, vShow as Kl, useSlots as yu, vModelSelect as zt, defineAsyncComponent as bu } from "vue";
function Yl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ku = 1600, wu = {
  __name: "Shimmer",
  setup(e) {
    const t = Yl(ku);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ge(B(t))
    }, null, 4));
  }
}, sn = /* @__PURE__ */ z(wu, [["__scopeId", "data-v-6c018b03"]]), $u = { class: "skeleton-line" }, xu = 2e3, Su = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Yl(xu);
    return (n, a) => (r(), d("span", $u, [
      re(n.$slots, "default", {}, void 0, !0),
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
}, wt = /* @__PURE__ */ z(Su, [["__scopeId", "data-v-484fe8a0"]]), Qt = uu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== cu);
      return a.length !== 1 ? pa(L, { key: n }, a) : a[0].key == null ? du(a[0], { key: n }) : a[0];
    };
  }
}), Mu = ["aria-label"], _u = ["aria-label"], Cu = ["aria-label"], Eu = ["aria-label"], Au = ["aria-label"], Ou = ["aria-label"], Tu = ["aria-label"], Iu = {
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
          (r(), d(L, null, te(t, (f) => A(sn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Mu)
      ]),
      older: P(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(t.slice(0, 3), (f) => (r(), j(sn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, _u)
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
            (r(), d(L, null, te(n, (m) => A(wt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Cu)
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
            A(wt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(L, null, te(s, (m) => A(wt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Eu)
      ]),
      page: P(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(wt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(L, null, te(e.count, (f) => (r(), j(wt, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Au)
      ]),
      text: P(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), j(wt, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ou)
      ]),
      default: P(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), j(wt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Tu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Je = /* @__PURE__ */ z(Iu, [["__scopeId", "data-v-ef519c5f"]]), Bu = {
  key: 1,
  class: "empty-state titled"
}, Ru = { class: "empty-state-title" }, Lu = { class: "empty-state-text" }, Nu = {
  key: 2,
  class: "empty-state"
}, qu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), j(Je, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", Bu, [
      h("p", Ru, g(e.title), 1),
      h("p", Lu, [
        re(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Nu, [
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, fn = /* @__PURE__ */ z(qu, [["__scopeId", "data-v-b27e89b0"]]), Du = { class: "fold-group" }, Pu = ["aria-expanded"], ju = { class: "fold-label" }, Fu = {
  key: 0,
  class: "fold-count"
}, Wu = {
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
    return (a, s) => (r(), d("div", Du, [
      h("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", ju, g(e.label), 1),
        e.count !== "" ? (r(), d("span", Fu, g(e.count), 1)) : k("", !0),
        h("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Pu),
      e.open ? re(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, CM = /* @__PURE__ */ z(Wu, [["__scopeId", "data-v-9ef1865c"]]), Hu = 150, zu = () => Hu;
function Ws(e, t, n = zu(), a = performance.now()) {
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
const Uu = 50, Oo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function EM(e) {
  const t = ot().sources.find((n) => n.key === e);
  return t ? ms(t.read, t.events) : ms("", []);
}
function Xl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), u = _(!1), c = performance.now(), f = _(!1), m = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function M(v) {
    return s() ? (y.add(v), b ?? (b = new Promise(($) => setTimeout(() => $(C()), Uu)))) : S(v);
  }
  async function C() {
    const v = new Set(y);
    y.clear(), b = null;
    const $ = W, O = await t({ ids: [...v].join(","), limit: v.size });
    if ($ !== W) return;
    if (!O.ok) return E();
    const R = new Map(O.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => v.has(F.id) ? R.has(F.id) ? [R.get(F.id)] : [] : [F]);
  }
  async function S(v) {
    const $ = W, O = await t({ "before-id": v + 1, limit: 1 });
    if ($ !== W) return;
    if (!O.ok) return E();
    const R = O.value.rows.find((F) => F.id === v);
    o.value = R ? o.value.map((F) => F.id === v ? R : F) : o.value.filter((F) => F.id !== v);
  }
  async function T(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((J) => J.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((J) => J.id === v.row_id)) return M(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return E();
    const O = Math.max(...o.value.map((J) => J.id)), R = W, F = await t({ "after-id": O });
    if (R !== W) return;
    if (!F.ok) return E();
    const V = new Set(o.value.map((J) => J.id));
    o.value = [...F.value.rows.filter((J) => !V.has(J.id)), ...o.value];
  }
  async function H() {
    if (!f.value || !o.value.length) return !1;
    const v = W, $ = Math.min(...o.value.map((F) => F.id)), O = await t({ "before-id": $ });
    if (v !== W) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Oo(O.value, n());
    const R = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...O.value.rows.filter((F) => !R.has(F.id))], !0;
  }
  let W = 0;
  function I(v, $) {
    var F, V;
    const O = v.ok ? e.shared ? [v.value] : ((F = v.value) == null ? void 0 : F.rows) ?? [] : [];
    v.ok && (o.value = $(O)), l.value = v.ok ? v.value : null;
    const R = O.length ? Math.min(...O.map((J) => J.id)) : 0;
    v.ok && ((V = v.value) != null && V.rows) && !o.value.some((J) => J.id < R) && (f.value = !e.shared && Oo(v.value, n())), i.value = v.ok ? "" : v.error, Ws(c, () => u.value = !0);
  }
  async function G(v) {
    const $ = ++W, O = await t({});
    $ === W && I(O, v);
  }
  const q = (v) => {
    if (!a() || !v.length) return v;
    const $ = Math.min(...v.map((R) => R.id)), O = Math.max(...v.map((R) => R.id));
    return [...o.value.filter((R) => R.id > O), ...v, ...o.value.filter((R) => R.id < $)];
  }, E = () => G(q), N = (v) => I(v, q), D = () => G((v) => v);
  async function w(v, $ = null) {
    const O = await Ql($ && { target: o, fields: { value: $(o.value) } }, v, e.run);
    return m.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await E(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: E, loadLatest: D, older: H, act: w, actionFailure: m, answer: p, context: e, heard: T, showFirst: N, pageSize: n };
}
const Vu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ms(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = ot(), l = Xl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Vu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Gu = 2e3;
function Hs(e, t, n = Gu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Re, null), u = () => {
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
  pe(() => {
    var M;
    return (M = i == null ? void 0 : i.visible) == null ? void 0 : M.value;
  }, b), Ce(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), st(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Jl = typeof document < "u" && document.documentElement.classList.contains("phone"), Zl = 120;
var Hl;
const Oa = globalThis[Hl = Symbol.for("journal.pressed")] ?? (globalThis[Hl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ku(e = 0) {
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
function ei(e = window) {
  if (!hs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    hs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ps = "journal.stale-build-reload", Yu = 'script[type="module"][src*="/assets/index-"]', To = (e) => {
  var t;
  return ((t = e.querySelector(Yu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Qu(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => ei(window)) {
  const a = To(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = To(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ta = "";
function Xu(e, t = () => ei(window)) {
  if (!e) return !1;
  const n = !!Ta && Ta !== e;
  return Ta = e, n && t(), n;
}
const Ju = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Zu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ps) === e.message) return !1;
    t.setItem(ps, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ec(e = window.sessionStorage) {
  try {
    e.removeItem(ps);
  } catch {
    return;
  }
}
const tc = 2e3, nc = 3e4, Ye = Kt({ starting: !1, external: !1, late: !1, offline: !1 }), zs = () => Ye.starting, ac = 3;
let Ln = 0, vs = 0, ti = 0, ni = [];
async function sc() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ye.external };
  }
}
let Io = null;
const oc = () => Io ?? (Io = sc().finally(() => Io = null));
function lc() {
  clearTimeout(vs), clearTimeout(ti), vs = 0, Object.assign(Ye, { starting: !1, external: !1, late: !1, offline: !1 }), ni.splice(0).forEach((e) => e()), Qu();
}
async function ic() {
  Ye.offline = !navigator.onLine;
  const e = await oc();
  if (Ye.external = e.updating, Ln = !e.restarting && !e.updating && e.reachable ? Ln + 1 : 0, Ln < ac) return;
  Ln = 0, (!Xu(e.started_at) || hs()) && lc();
}
function ai() {
  vs = setTimeout(async () => {
    await ic(), Ye.starting && ai();
  }, tc);
}
function Bo() {
  Ye.starting || (Ye.starting = !0, Ye.offline = !navigator.onLine, ai(), ti = setTimeout(() => Ye.late = !0, nc));
}
const si = () => Ye.starting ? new Promise((e) => ni.push(e)) : Promise.resolve();
function Us(e, t, n = 0) {
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
function rc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class uc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Us(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = rc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
function cc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Nn = 2e4, dc = 4, Ro = "/api/read-lines", fc = 5e3, mc = 403, Lo = "/api/repeated-lines", hc = 10, pc = 2e3, vc = 3e5, AM = 6e5, gc = "X-Journal-Window-Hidden", qn = 6, yc = 500, bc = "/journal/summary", No = "/api/server-state", kc = 2e4, Dn = Jl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, wc = (e) => e.split("?")[0].endsWith(bc), gs = (e, t) => Object.assign(new Error(t), { status: e });
async function $c(e, t, n = gs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const xc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Sc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), qo = (e) => e.split(" ").slice(0, 2).join(" "), it = "read", qt = "write", Mc = "stream";
class _c {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = qn;
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < pc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < hc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Lo, { method: "POST", headers: { ...Dn, "Content-Type": "application/json" }, body: i }, [{ window: mt, line: Lo, kind: qt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ku(n ? Zl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [gc]: cc() ? "1" : "0" } }, i = s ? { ...l, signal: Sc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === qt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Nn) {
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
    this.readsFlying >= dc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Ro, { headers: Dn }, [{ window: mt, line: Ro, kind: it }], fc).then(async (t) => {
      if (t.status === mc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw gs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new uc(
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
      this.tries = qn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Dn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: xc(a) }, c = s || (i ? vc : Nn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: mt, line: n, kind: it }], c)) : await this.sent(n, u, [{ window: mt, line: n, kind: qt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, yc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = qn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return $c(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: mt, line: t, kind: it }], Nn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Dn });
    if (!n.ok) throw gs(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, qn, o).then((i) => (this.written(n), i)) : zs() && !wc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: mt, line: t, kind: Mc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(No, { cache: "no-store" }, [{ window: mt, line: No, kind: it }], kc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = mt, line: s = t, limit: o = Nn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? it : qt;
    return l === qt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Ia = Symbol.for("journal.transport"), Ae = globalThis[Ia] ?? (globalThis[Ia] = new _c());
class oi {
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
      n.patterns.some((a) => Vs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Vs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const li = (e, t) => !e.row_id || t.has(e.row_id), Cc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Ec = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Ac = 50, Oc = "refresh", Tc = 1e3, Ic = 3e4, Bc = "requested", Rc = "after_window", Lc = 50, Pn = ".*", Nc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function qc(e) {
  const t = {}, n = Kt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const v = () => p(w), $ = _(void 0), O = Xl(e, async (R) => {
      const F = await C(w, R);
      return F.ok && !Object.keys(R).length && ($.value = F.value), F;
    }, () => v().page_size || Lc, () => !!v().page_size, () => !!v().reads_ids);
    return t[w] = { ...O, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (w, v) => typeof v != "string" || v.startsWith("__v") ? void 0 : t[v] ?? y(v) }), M = (w) => (u[w].loading !== Bc || w.endsWith(Pn)) && (!u[w].tab || u[w].tab === n.tab);
  function C(w, v = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: v, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const w = /* @__PURE__ */ new Map(), v = a.splice(0).filter((R) => {
      const F = JSON.stringify(R.flags);
      return w.has(R.name) || w.set(R.name, F), w.get(R.name) === F ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(v.flatMap(({ name: R, flags: F }) => Object.entries(F).map(([V, J]) => [`${R}.${V}`, J]))), O = await e.readKeys({ only: [...new Set(v.map(({ name: R }) => R))], state: { ...n, ...$ } });
    v.forEach(({ name: R, resolve: F }) => F(O.ok ? O.value.keys[R] : O));
  }
  async function T(w) {
    var R;
    const v = ++f;
    (w.length ? w : Object.keys(u).filter((F) => !F.endsWith(Pn) && u[F].loading === "first" && M(F))).forEach((F) => l[F] = v);
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
    const v = Nc(w);
    return v.length ? (v.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, $(T(O));
    })))) : T([]);
  }
  function W(w) {
    w.forEach((v) => s.add(v)), clearTimeout(c), c = setTimeout(() => {
      const v = [...s];
      s.clear(), v.length && H(v);
    }, Ac);
  }
  const I = (w) => w.endsWith(Pn) ? Object.keys(t).filter((v) => v.startsWith(w.slice(0, -1)) && t[v].readAt) : [w], G = (w, v) => {
    const $ = p(w).event_column;
    return !$ || Ec(v, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, q = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function E(w) {
    const v = Object.keys(u).filter((O) => w.event === Oc || u[O].events.some((R) => Vs(R, w.event)));
    v.filter((O) => u[O].page_size).forEach((O) => b[O].heard(w));
    const $ = v.filter((O) => !u[O].page_size);
    $.filter((O) => !M(O)).forEach((O) => b[O].readAt = 0), W($.filter(M).flatMap(I).filter((O) => G(O, w)));
  }
  function N(w) {
    if (Object.keys(u).length) return;
    u = w;
    const v = [...new Set(Object.values(w).flatMap((O) => O.events))];
    v.length && e.follow(v, E);
    const $ = Object.keys(w).filter((O) => w[O].loading === Rc);
    $.length && T($);
  }
  pe(() => n.tab, () => {
    const w = Object.keys(u).filter((v) => !v.endsWith(Pn) && M(v) && !b[v].readAt);
    w.length && T(w);
  }), Ne(() => {
    m = !0, clearTimeout(c);
  });
  function D() {
    const w = Date.now(), v = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && M($)).flatMap(I).filter(($) => w - b[$].readAt >= (i.has($) ? Math.min(q($) * 1e3, Ic) : q($) * 1e3));
    v.length && W(v);
  }
  return Hs(D, () => e.visible.value, Tc), queueMicrotask(() => T([])), { props: b, state: n, reload: H, readKey: C };
}
const Dc = Symbol("open-view"), Re = Symbol.for("journal.window-context"), ii = Symbol("dock-card"), ri = Symbol.for("journal.inspector-actions");
function Pc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = qc(e));
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
  return Pc(e);
}
const jc = (e, t) => e(ii, t), OM = () => Me(ii), ys = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Do = {
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
}, Fc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
    }, null, 12, Fc));
  }
}, Wc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Hc = /* @__PURE__ */ z(Wc, [["__scopeId", "data-v-eb453d6f"]]), zc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = va(), a = x(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = x(() => t.busy || s.value), l = Me(Re, null), i = x(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, Zl);
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
          re(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), j(Hc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ z(zc, [["__scopeId", "data-v-ededdadf"]]), Uc = ["aria-checked", "aria-haspopup", "onClick"], Vc = {
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
    const n = t, a = Ps();
    return (s, o) => {
      const l = fu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(L, null, te(e.options, (i) => _e((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Vc)) : k("", !0),
          U(" " + g(i.label) + " ", 1),
          i.note ? (r(), d("small", Gc, g(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Kc, g(i.count), 1)) : k("", !0)
        ], 10, Uc)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ut = /* @__PURE__ */ z(Yc, [["__scopeId", "data-v-c89bc92d"]]), Qc = {
  key: 0,
  class: "more-items"
}, Xc = {
  key: 0,
  role: "alert"
}, Jc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Qc, [
      e.failure ? (r(), d("p", Xc, g(e.failure), 1)) : k("", !0),
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
}, Sn = /* @__PURE__ */ z(Jc, [["__scopeId", "data-v-10464014"]]), Zc = { class: "link-group" }, ed = {
  class: "group-label",
  "data-link-kind": ""
}, td = ["disabled", "onClick"], nd = { class: "title" }, ad = { class: "relations" }, sd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = x(() => s.value ? n.rows : n.rows.slice(0, 3)), l = x(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", Zc, [
      h("div", ed, g(l.value), 1),
      (r(!0), d(L, null, te(o.value, (p) => (r(), d("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        h("span", nd, g(p.endpoint.title), 1),
        h("span", ad, [
          U(g(c(p)), 1),
          i(p) ? (r(), d(L, { key: 0 }, [
            U(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, td))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, od = /* @__PURE__ */ z(sd, [["__scopeId", "data-v-be6f079c"]]), ld = ["data-loaded"], id = { class: "rows" }, rd = ["disabled", "onClick"], ud = { class: "title" }, cd = { class: "relations" }, dd = { key: 2 }, fd = {
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
    ]), M = x(() => {
      const E = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((D) => D.endpoint.model))].map((D) => [D, s.value.filter((w) => w.endpoint.model === D).length])), N = { doc: 0, task: 1, message: 2 };
      return Object.entries(E).sort(([D], [w]) => (N[D] ?? 3) - (N[w] ?? 3)).map(([D, w]) => ({ model: D, count: w, rows: s.value.filter((v) => v.endpoint.model === D) }));
    }), C = (E) => E.endpoint.unavailable || !E.endpoint.open_ref, S = (E) => ({ [n.linkAttribute]: !0, "data-link-model": E.endpoint.model, "data-link-id": E.endpoint.id }), T = (E) => `${E.endpoint.model === "doc" && E.endpoint.id === n.documentId ? "Design document" : E.endpoint.model.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())} ${E.endpoint.id}, ${E.relations.map((N) => N.replaceAll("_", " ")).join(", ")}`;
    async function H(E = 1) {
      const N = ++m;
      c.value = !0, f.value = "";
      const D = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(E), "--page-size", String(n.pageSize)];
      n.outsidePlan && D.push("--outside-plan"), n.documentId && D.push("--first-counterpart", `doc:${n.documentId}`), i.value && D.push("--kind", i.value);
      try {
        const w = await n.read(D);
        if (N !== m) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const v = w.value.counterparts ?? [], $ = E === 1 ? v : [...s.value, ...v];
        s.value = [...new Map($.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        N === m && (f.value = w.message);
      } finally {
        N === m && (c.value = !1);
      }
    }
    function W(E) {
      if (C(E)) return;
      const [N, D] = E.endpoint.open_ref.split(":");
      a("open", { table: N, id: Number(D) });
    }
    function I(E) {
      i.value = E, H();
    }
    const G = () => !c.value && u.value && H(u.value), q = x(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", H();
    }, { immediate: !0 }), (E, N) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), j(Ut, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", id, [
        e.grouped ? (r(!0), d(L, { key: 0 }, te(M.value, (D) => (r(), j(od, {
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
        }, { ref_for: !0 }, S(D), {
          disabled: C(D),
          onClick: (w) => W(D)
        }), [
          h("span", ud, g(D.endpoint.title), 1),
          h("span", cd, [
            U(g(T(D)), 1),
            C(D) ? (r(), d(L, { key: 0 }, [
              U(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, rd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", dd, g(e.empty), 1)) : k("", !0),
        A(Sn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: q.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, ld)) : k("", !0);
  }
}, md = /* @__PURE__ */ z(fd, [["__scopeId", "data-v-3b23de37"]]), hd = (e, t, n) => Math.max(t, Math.min(n, e)), pd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ui = /* @__PURE__ */ new WeakMap(), vd = (e, t) => ui.set(e, t);
function gd(e, t) {
  for (let n = t; n; n = ui.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ci(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !gd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ne(() => window.removeEventListener("click", n));
}
const Lt = 8, yd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = (v) => v ? `${v}px` : void 0, l = x(() => ({
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
        below: v.bottom - $.bottom - a.gap - Lt,
        above: $.top - v.top - a.gap - Lt,
        across: v.right - v.left - 2 * Lt
      };
    }
    function b(v) {
      const $ = m(a.anchor), O = y($, v);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? $ : c();
    }
    const M = x(() => {
      if (!u.value) return l.value;
      const v = u.value, $ = b(v), O = y($, v), { w: R, h: F } = i.value, V = a.align === "auto" ? v.left + v.right > $.left + $.right : a.align === "right", J = hd(V ? v.right - R : v.left, $.left + Lt, Math.max($.left + Lt, $.right - R - Lt)), ue = F > O.below && O.above > O.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, O.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, O.below) };
      return { ...l.value, ...ue, left: `${J}px`, maxWidth: p(a.maxWidth, O.across) };
    }), C = n, S = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(v) {
      const $ = S(), O = $.indexOf(document.activeElement);
      $[(O + v + $.length) % $.length].focus();
    }
    const H = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => C("close") }, W = (v) => H[v.key] && (v.preventDefault(), H[v.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const q = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(I);
    });
    ci(s, (v) => a.anchor && !a.anchor.contains(v.target) && C("close"));
    const E = (v, $) => ["top", "left", "right", "bottom"].some((O) => Math.abs(v[O] - $[O]) > 1), N = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let D = 0;
    function w() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || N(v)) return C("close");
        E(v, u.value) && (u.value = v);
      }
      D = requestAnimationFrame(w);
    }
    return Ce(() => {
      a.anchor && s.value && vd(s.value, a.anchor), I(), s.value && q.observe(s.value), !a.plain && S()[0] && S()[0].focus(), w();
    }), Ne(() => {
      q.disconnect(), cancelAnimationFrame(D), cancelAnimationFrame(G);
    }), t({ element: s }), (v, $) => (r(), j(xn, {
      to: "body",
      disabled: !e.anchor
    }, [
      h("div", Pe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: W
      }), [
        re(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ya = /* @__PURE__ */ z(yd, [["__scopeId", "data-v-3d203970"]]), bd = { class: "split-button" }, kd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", bd, [
      A(ve, {
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
          default: P(() => [
            A(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), j(ya, {
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
}, wd = /* @__PURE__ */ z(kd, [["__scopeId", "data-v-c258494d"]]), $d = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, xd = {
  key: 1,
  class: "menu-item-text"
}, Sd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", $d, g(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", xd, [
        h("span", null, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, g(e.description), 1)
      ])) : re(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ve = /* @__PURE__ */ z(Sd, [["__scopeId", "data-v-fec99974"]]), Md = ["aria-expanded"], _d = { class: "drop-label" }, Cd = ["value"], Ed = {
  key: 1,
  class: "drop-lead"
}, Ad = { class: "drop-item-text" }, Od = {
  key: 2,
  class: "drop-note"
}, Td = {
  key: 1,
  class: "drop-none"
}, Id = {
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
        e.icon ? (r(), j(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", _d, g(e.label), 1),
        A(le, {
          name: "down",
          size: 11
        })
      ], 10, Md),
      s.value ? (r(), j(ya, {
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
          }, null, 40, Cd)) : k("", !0),
          (r(!0), d(L, null, te(i.value, (m) => (r(), j(Ve, {
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
              m.lead ? (r(), d("span", Ed, g(m.lead), 1)) : k("", !0),
              h("span", Ad, g(m.label), 1),
              m.note ? (r(), d("span", Od, g(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Td, g(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Gs = /* @__PURE__ */ z(Id, [["__scopeId", "data-v-29dfcce5"]]), Bd = 0, Rd = "/api/lines", Ld = "/api/line", Po = 5e3, jo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Fo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ba = (e) => JSON.stringify(e.line), Wo = () => new DOMException("cancelled", "AbortError");
class Nd {
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
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, qt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), Bd));
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
      const o = await Ae.sent(Rd, jo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Fo(i.body, it)), Po);
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
    await this.alone(t, it), Date.now() - n < Po ? this.slow.delete(Ba(t.body)) : this.slow.add(Ba(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(Ld, jo(t.body, t.signal), [Fo(t.body, n)], n === it ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const di = new Nd(), qd = "/api/window";
function Dd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${qd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ae.whenFree(async () => {
    const f = await Ae.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: it }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ae.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const fi = /* @__PURE__ */ new Map();
class Pd {
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
function TM(e, t) {
  const n = new Pd(e, t);
  return fi.set(e, n), n.load().catch(() => {
  }), n;
}
const Ks = (e) => fi.get(e);
function jd(e, t, n) {
  const a = Ks(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Fd(e, t) {
  if (!e) return !0;
  const n = Ks(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Wd = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let mi = {};
async function IM(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (mi = (await t.json()).states);
}
const Ys = (e, t) => {
  var n;
  return (n = mi[e]) == null ? void 0 : n[t];
}, mn = (e, t) => {
  var n;
  return ((n = Ys(e, t)) == null ? void 0 : n.label) ?? Wd(t);
}, hi = (e, t) => {
  var n;
  return ((n = Ys(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Hd = (e, t) => {
  var n;
  return ((n = Ys(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, zd = Symbol("pane-page"), Qs = Symbol("inspector-host"), pi = { 1: "refused", 2: "usage", 3: "fault" }, Ud = 100, Vd = 50, Gd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Kd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Yd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = _({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: M = {}, search: C = {}, readOnly: S = !1, shared: T = null }) {
  const H = /* @__PURE__ */ new Map(), W = (V, J) => l.follow(e, V, (oe) => {
    H.clear(), J(oe);
  }, a), I = new AbortController(), G = _(!1), q = performance.now();
  let E = 0, N = 0, D = () => {
  };
  const w = new Promise((V) => D = V);
  I.signal.addEventListener("abort", D, { once: !0 });
  const v = () => {
    clearTimeout(N), N = setTimeout(() => {
      E === 0 && Ws(q, () => {
        G.value = !0, D();
      });
    }, Vd);
  }, $ = (V, J) => (E += 1, _t(e, V, t, I.signal, J).finally(() => {
    E -= 1, v();
  })), O = (V, J) => (v(), w.then(() => I.signal.aborted ? dt : _t(e, V, t, I.signal, J))), R = ({ only: V = [], state: J = {} } = {}) => (E += 1, Xd(() => Dd(e, t, V, J, I.signal), I.signal).finally(() => {
    E -= 1, v();
  })), F = (V, { unbatched: J = !1, deferred: oe = !1 } = {}) => {
    const ue = H.get(V);
    if (ue && performance.now() - ue.at < Ud) return ue.answer;
    const ke = oe && !G.value ? O(V, J) : $(V, J);
    return H.set(V, { answer: ke, at: performance.now() }), ke;
  };
  return {
    answered: G,
    settle: v,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: x(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: M,
    search: C,
    readOnly: S,
    shared: T,
    read: F,
    readKeys: R,
    waitForServer: () => zs() ? si() : null,
    run: (V) => _t(e, V, t, I.signal),
    upload: (V) => Zd(V, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (V, J) => W([V].flat().filter((oe) => o.some((ue) => Vs(ue, oe))), J),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => x(() => {
      var J;
      return u.value[V] ?? ((J = c.find((oe) => oe.key === V)) == null ? void 0 : J.default);
    }),
    setting: async (V, J) => {
      const oe = await F(`window setting ${e} ${V}`);
      return oe.ok ? oe.value.value : J;
    },
    setOption: m,
    keep: (V, J) => _t(e, ["window", "save-setting", e, V, JSON.stringify(J)], t, I.signal)
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
const dt = { ok: !1, failure: "cancelled", error: "" }, Xs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function gi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? dt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: pi[n.code] || "fault", error: vi(n.error) };
  } catch {
    return t != null && t.aborted ? dt : { ok: !1, failure: "unreachable", error: Xs };
  }
}
const Qd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: pi[e.code] || "fault", error: vi(e.error) };
async function Xd(e, t) {
  try {
    const n = await e();
    return t.aborted ? dt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Qd(s)])) } };
  } catch {
    return t.aborted ? dt : { ok: !1, failure: "unreachable", error: Xs };
  }
}
async function yi(e, t, n) {
  const a = await gi(() => di.read(e, t, n), t);
  return a.failure !== "unreachable" || !zs() ? a : (await si(), t.aborted ? dt : yi(e, t, n));
}
function _t(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => Jd(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : Js(t)));
}
async function Jd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Js(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, i) => yi({ ...o, attribution: i }, l, s), a, o).catch(() => dt) : gi(() => di.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Zd(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? dt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? dt : { ok: !1, failure: "unreachable", error: Xs };
  }
}
function Js(e) {
  return [...e.matchAll(Gd)].map(([t]) => t.replace(Kd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const ef = (e) => `show-${e}`, BM = (e, t, n) => e.filter((a) => {
  var s;
  return n(ef((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Zs = "messages.chat", Qn = "main", bi = "Main agent", tf = { main: bi, worker: "Worker", helper: "Helper" }, nf = "journal-", eo = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), af = (e) => eo(e.replace(nf, "").replaceAll("-", " ")), sf = (e) => `${e.role} ${e.number}`, of = (e) => e.role === Qn ? bi : `${eo(e.role)} ${e.number}`;
function Vt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === Qn || !n ? tf[e.role] ?? eo(e.role) : af(n), s = e.role === Qn ? "" : sf(e), o = e.role === Qn ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: of(e) };
}
const lf = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, rf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = x(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Vt(c).title, note: Vt(c).subtext }))), i = x(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await _t(Zs, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(L, null, [
      A(Gs, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", lf, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, uf = /* @__PURE__ */ z(rf, [["__scopeId", "data-v-d2ea58f1"]]), cf = {
  key: 0,
  class: "template-brief"
}, df = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, ff = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = x(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = x(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await _t(Zs, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(L, null, [
      A(Ut, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", cf, g(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", df, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, mf = /* @__PURE__ */ z(ff, [["__scopeId", "data-v-14be8a5c"]]), hf = { class: "info-tip" }, pf = ["aria-label"], vf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, gf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", hf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(le, {
          name: "info",
          size: 13
        })
      ], 8, pf),
      h("span", vf, [
        (r(!0), d(L, null, te(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, g(a), 1))), 128))
      ])
    ]));
  }
}, ki = /* @__PURE__ */ z(gf, [["__scopeId", "data-v-a2fe5ff1"]]), yf = { class: "form-field" }, bf = { class: "form-field-head" }, kf = ["for"], wf = {
  key: 1,
  class: "form-field-aside"
}, $f = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", yf, [
      h("div", bf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, g(e.label), 9, kf),
        e.help ? (r(), j(ki, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", wf, [
          re(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, xf = /* @__PURE__ */ z($f, [["__scopeId", "data-v-302c40bf"]]), bs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Sf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = va(), n = x(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => _e((r(), d("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(bs), B(t).value]
    ]);
  }
}), Mf = /* @__PURE__ */ z(Sf, [["__scopeId", "data-v-e130a5b9"]]), _f = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ps(), o = x(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), j(xf, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        A(Qt, { value: o.value }, {
          choice: P(() => [
            A(Ut, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            A(mf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: P(() => [
            A(uf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            A(Mf, {
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
        A(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Cf(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ne(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Ef = (e, t = () => !0) => Cf("keydown", (n) => n.key === "Escape" && t() && e());
function wi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = x(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Ef(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Af = 80, Nt = Kt([]);
function $i(e) {
  const t = Symbol("layer"), n = () => Nt.includes(t) && Nt.splice(Nt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Nt.includes(t) && Nt.push(t), a || n();
    },
    { immediate: !0 }
  ), Ne(n), x(() => Af + Math.max(0, Nt.indexOf(t)));
}
let xi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return xi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Of = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Tf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Of)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : xi, document.addEventListener("keydown", s), We(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ne(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const If = ["aria-modal", "aria-label", "aria-labelledby"], Bf = {
  key: 0,
  class: "dialog-head"
}, Rf = ["id", "tabindex"], Lf = {
  key: 1,
  class: "dialog-foot"
}, Nf = 500, qf = 400, Df = {
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
    n.modal && Tf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, qf);
    }
    function M(T) {
      !n.modal || Date.now() - y >= Nf || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const C = () => u.value && (u.value.scrollTop = u.value.scrollHeight), S = new MutationObserver(C);
    return pe(u, (T) => {
      S.disconnect(), T && n.follow && (S.observe(T, { childList: !0, subtree: !0, characterData: !0 }), C());
    }), Ne(() => S.disconnect()), (T, H) => (r(), j(xn, { to: "body" }, [
      A(Yt, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: P(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: B(i) }),
            onClick: $e(b, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? B(m) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? k("", !0) : (r(), d("header", Bf, [
                h("h3", {
                  id: B(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, g(e.title), 9, Rf),
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
                re(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", Lf, [
                re(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, If)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ka = /* @__PURE__ */ z(Df, [["__scopeId", "data-v-089c42bc"]]), Pf = {
  class: "action-output",
  "data-action-output": ""
}, jf = {
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
        h("pre", Pf, g(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Ff = /* @__PURE__ */ z(jf, [["__scopeId", "data-v-b32f94a4"]]);
function Wf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = mu(Ff, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Hf = (e, t, n = {}) => Js(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Mn(e, t, n, a = {}) {
  var s;
  try {
    if (!await Fd(e.module, n)) return { ok: !1, error: "" };
    const o = await _t(Zs, Hf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Wf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const zf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ra = [
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
}), wa = {
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
    filters: Ra
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ra
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
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Ra }),
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
}, Uf = ["secrets", "plugins"], Si = Object.keys(wa).filter((e) => !(Jl && Uf.includes(e)));
x(() => Si.map((e) => ({ name: e, ...wa[e] })));
const Xt = (e) => wa[e], Mi = new Map(Si.flatMap((e) => [e, e.replace(/s$/, ""), wa[e].title.toLowerCase()].map((t) => [t, e]))), yt = (e) => Mi.get(String(e).toLowerCase()) || "", _i = [...Mi.keys()].sort((e, t) => t.length - e.length).join("|"), Vf = {
  class: "button-form",
  "data-button-form": ""
}, Gf = {
  key: 0,
  class: "button-form-title"
}, Kf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Yf = { class: "button-form-actions" }, Qf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = _(!1), l = _(""), i = x(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = x(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = Xt(yt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await Mn(n.button, n.row, n.environment, s.value);
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
          h("div", Vf, [
            (p = e.row) != null && p.title ? (r(), d("p", Gf, g(e.row.title), 1)) : k("", !0),
            (r(!0), d(L, null, te(e.button.fields, (y) => (r(), j(_f, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", Kf, g(l.value), 1)) : k("", !0),
            h("div", Yf, [
              A(ve, {
                small: "",
                onClick: m[0] || (m[0] = (y) => a("close"))
              }, {
                default: P(() => [...m[2] || (m[2] = [
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
}, Xf = /* @__PURE__ */ z(Qf, [["__scopeId", "data-v-e3f0d786"]]), Jf = ["aria-busy"], Zf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, em = { class: "button-slot-confirm-text" }, tm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, nm = {
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
    const n = e, a = t, s = x(() => Ks(n.environment)), o = x(
      () => {
        var S;
        return !n.readOnly && ((S = s.value) == null ? void 0 : S.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = x(() => {
      var S;
      return !n.readOnly && ((S = s.value) == null ? void 0 : S.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = x(() => n.readOnly ? [] : jd(n.environment, n.name, n.row)), c = _(null), f = _(null), m = _(""), p = _(!1), y = (S) => [S.from ? `From ${S.from}` : "", S.tip, S.warning].filter(Boolean).join(" · "), b = (S) => S.icon || (S.warning ? "dot" : "");
    function M(S) {
      if (!(p.value || n.readOnly)) {
        if (S.fields.length) {
          c.value = S;
          return;
        }
        if (S.confirm) {
          f.value = S;
          return;
        }
        return C(S);
      }
    }
    async function C(S) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const T = await Mn(S, n.row, n.environment);
      p.value = !1, m.value = T.ok ? "" : T.error;
      const H = S.label.toLowerCase() + (n.objectName && !S.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${H}: ${T.error}`), T.ok && a("done");
    }
    return (S, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(L, { key: 0 }, [
        T[5] || (T[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ve, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...T[4] || (T[4] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Zf, [
        h("span", em, g(f.value.confirm), 1),
        A(ve, {
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
        A(ve, {
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
          H.menu.length ? (r(), j(wd, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (W) => M(H)
          }, {
            menu: P(({ close: W }) => [
              (r(!0), d(L, null, te(H.menu, (I) => (r(), j(Ve, {
                key: I.label,
                description: I.description,
                onClick: (G) => (W(), M({ ...H, ...I, menu: [] }))
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
            onClick: (W) => M(H)
          }, {
            default: P(() => [
              U(g(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", tm, g(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), j(Xf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (H) => c.value = null),
          onDone: T[3] || (T[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Jf));
  }
}, to = /* @__PURE__ */ z(nm, [["__scopeId", "data-v-a4b6f174"]]), am = {
  class: "running",
  "data-running-command": ""
}, sm = ["title"], om = {
  key: "idle",
  class: "running-idle"
}, lm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", am, [
      A(Yt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, g(e.text), 9, sm)) : (r(), d("span", om, g(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, RM = /* @__PURE__ */ z(lm, [["__scopeId", "data-v-d3240219"]]), im = ["aria-checked", "disabled", "aria-label", "title"], rm = {
  key: 0,
  class: "switch-inner"
}, um = {
  key: 0,
  class: "switch-word"
}, cm = {
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
        e.labelled ? (r(), d("span", rm, g(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", um, g(e.word), 1)) : k("", !0)
    ], 10, im));
  }
}, LM = /* @__PURE__ */ z(cm, [["__scopeId", "data-v-92ae7767"]]), dm = { class: "notice-text" }, fm = {
  key: 1,
  class: "notice-actions"
}, mm = {
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
      h("span", dm, [
        re(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", fm, [
        re(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, NM = /* @__PURE__ */ z(mm, [["__scopeId", "data-v-445bd8a6"]]);
function Ci(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function aa(e, t) {
  return Ci(() => localStorage, e, t);
}
function Ei(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function no(e, t) {
  return Ei(() => localStorage, e, t);
}
function Ai(e, t) {
  pe(t, (n) => no(e, n), { deep: !0 });
}
function hm(e, t) {
  return Ci(() => sessionStorage, e, t);
}
function pm(e, t) {
  return Ei(() => sessionStorage, e, t);
}
const sa = "journal.environment", Oi = _(hm(sa, aa(sa, "")));
function vm(e) {
  Oi.value = e, pm(sa, e), no(sa, e);
}
const oa = _(location.hash), Ho = nt(null), zo = { integrations: "mcp", library: "team" };
function gm() {
  if (!Ho.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (zo[n]) {
    location.replace(`#/${[zo[n], ...a].join("/")}${t ? `?${t}` : ""}`), oa.value = location.hash;
    return;
  }
  !n || Ho.value(n) || (vm(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), oa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  oa.value = location.hash, gm();
});
const ks = x(() => {
  const [e, t = ""] = oa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
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
}), ao = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${ao.page(e)}?open=${t}`
};
function ym(e = "", t = 0, n = "") {
  location.hash = ao.page(e, t, n);
}
function bm(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const km = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ti(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(km).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const jt = {};
function qM(e, t) {
  return jt[e] = t, () => jt[e] === t && delete jt[e];
}
function kt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = jt[e]) != null && l.call(jt, t))) return;
  const s = ks.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ti([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function wm(e, t, n, a = 0, s = "") {
  if (e === ks.value.env) return kt(t, n, a, s);
  const o = ks.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ti([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? wm(a, s, Number(o), 0, t) : kt(s, Number(o), 0, t);
}
function $m(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Pt(e) {
  const t = $m(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function DM(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const xm = { class: "inspector-part" }, Sm = { class: "inspector-part-title" }, Mm = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", xm, [
      h("h4", Sm, g(e.title), 1),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, PM = /* @__PURE__ */ z(Mm, [["__scopeId", "data-v-5175e4a3"]]), Uo = /* @__PURE__ */ new Map(), _m = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && Uo.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Uo.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Ce(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ne(() => i.disconnect()), (u, c) => (r(), d(L, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ge(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        re(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((f) => o(!s.value), ["stop"]))
      }, g(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Ii = /* @__PURE__ */ z(_m, [["__scopeId", "data-v-4d2235ba"]]), Cm = ["aria-valuenow", "aria-valuemax"], Em = {
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
    ], 10, Cm));
  }
}, Bi = /* @__PURE__ */ z(Em, [["__scopeId", "data-v-9eba6a85"]]), Am = { processes: "process", memories: "memory", replies: "reply" }, la = (e) => (Am[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ws = [], Om = 2e3, pt = /* @__PURE__ */ new Map(), Tm = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Im = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Bt(e, { first: t = !1 } = {}) {
  t ? ws.unshift(e) : ws.push(e), pt.clear();
}
function Ri(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Bm = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Rm = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ct(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Lm(e, t) {
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
function hn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Nm(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Nm(e) {
  return e.split(Im).map((t, n) => n % 2 ? t : t.replace(Tm, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Vo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const qm = 24;
function Dm(e) {
  const [t, , ...n] = e, a = Vo(t), s = n.map(Vo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > qm) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${hn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${hn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Li = /^\s*(?:[-*+]|\d+[.)])\s+/, $s = /^\s*(\d+)[.)]\s/, Go = (e) => e.match(/^\s*/)[0].length;
function Ni(e) {
  const t = e[0].match($s), n = Go(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Go(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${hn(o.text)}${o.nested.length ? Ni(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Pm(e, t) {
  const n = $s.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Li.test(e[s]) && $s.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
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
      n.push(`<h${i}>${hn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Ko(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Dm(t.slice(a, i))), a = i;
      continue;
    }
    if (Li.test(s)) {
      const i = Pm(t, a);
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
    for (; l < t.length && t[l].trim() && !Ko(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${hn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const jm = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Fm = (e) => e.type !== "text" && !jm.test(e.html);
function Wm(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(qi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Fm(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function so(e, t = { env: "" }) {
  const n = Rm(e, t), a = pt.get(n);
  if (pt.delete(n), a && a.source === t.source && a.reads.every((l) => Bm(l, t)))
    return pt.set(n, a), a.html;
  const s = [], o = Wm(Lm(e, { ...t, reads: s }));
  return pt.set(n, { html: o, reads: s, source: t.source }), pt.size > Om && pt.delete(pt.keys().next().value), o;
}
const La = /* @__PURE__ */ new WeakMap();
function Hm(e) {
  if (La.has(e)) return La.get(e);
  const t = hu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${la(c)} show ${f}`);
    n.set(m, p), p.then((y) => {
      n.get(m) === p && (n.delete(m), t.set(m, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${la(c).replace(/-/g, "_")}.*`], (f) => {
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
  const e = Me(Re, null), t = e ? Hm(e) : null;
  return (n, a = {}) => so(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Pi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, _n = (e) => String(e || "").replace(Pi, (t, n, a, s) => s), zm = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), jn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Um = /^Traceback \(most recent call last\):/m, Vm = 8;
function ji(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Vm).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Gm(e) {
  const t = [...e.matchAll(zm)].map((a) => a.index);
  if (jn.lastIndex = 0, !t.length || !jn.test(e)) return null;
  jn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(jn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ji(n), tail: "" } : null;
}
function Km(e) {
  const t = Um.exec(e);
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
Bt((e) => {
  const t = _n(e), n = Km(t) || Gm(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ia = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Fi = (e) => `${e.table}:${e.id}`, xs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Na = 80;
function Yo(e) {
  return e.length <= Na ? e : `${e.slice(0, Na + 1).replace(/\s+\S*$/, "") || e.slice(0, Na)}…`;
}
const Qo = {
  messages: (e) => Yo(xs(e.text)),
  comments: (e) => Yo(xs(e.text)),
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
}, Ym = (e) => (Qo[e.table] ? Qo[e.table](e) : e.title || "") || "", Ot = (e) => ia(e.created_at), Qm = (e) => ia(e.updated_at) || Ot(e), Xm = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Jm = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Zm(e) {
  const t = Xm.exec(e);
  if (t && yt(t[1])) return { at: t.index, length: t[0].length, table: yt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Jm.exec(e), a = n && yt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function eh(e, t, n, a) {
  const s = Ri(a, e, t), o = _n(s ? Ym(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ct(Xt(e).title)} ${t}</span><span class="row-card-title">${ct(o)}</span></a>`;
}
Bt(
  (e, t) => {
    const n = Zm(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: eh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const th = /\.(png|jpe?g|gif|webp|svg)$/i, nh = (e) => th.test(e), ah = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, sh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function oh(e, t) {
  const n = ah.exec(e), [, a, s, o, l, i] = n || [], u = n && yt(a || o), c = u && Ri(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${Xt(u).title} ${c.id} · ${ct(i)}`, p = nh(i) ? `<img class="file-card-image" src="${f}" alt="${ct(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ct(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function lh(e) {
  const t = sh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ct(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Bt(
  (e, t) => {
    if (t.inline) return null;
    const n = oh(e, t) || lh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ih = /`([^`\n]+)`/g;
Bt((e) => e.replace(ih, (t, n) => `<code>${n}</code>`));
const Xo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${ao.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Bt(
  (e, t) => e.replace(Pi, (n, a, s, o) => Xo[a] ? Xo[a](s, o, t) : o)
);
const rh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Wi = new RegExp(`\\b(${_i}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Hi = new RegExp(`\\b(${_i}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), uh = new RegExp(`<code>((?:${Wi.source}|${Hi.source}))</code>`, "gi"), ch = (e) => e.replace(uh, "$1"), dh = (e, t) => `<a class="row-pill" href="#" data-peek="${yt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, fh = (e) => e.replace(Hi, (t, n, a) => a.replace(/\d+/g, (s) => dh(n.replace(/s$/i, ""), s))), mh = (e) => fh(e).replace(
  Wi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${yt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Bt(
  (e, t) => t.rowNames === !1 ? e : ch(e).split(rh).map((n, a) => a % 2 ? n : mh(n)).join("")
);
const hh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, ph = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, vh = /[\w\]]\(/, gh = /^[\w$.[\]'"]+\s*=\s*[^=]/, yh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, bh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, kh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, wh = /[[({,]$/, $h = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, xh = /^(\t|\s{2,})\S/, Sh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Mh = /`[^`]+`/, _h = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Ch = /[{}()[\];=<>$&|*\\@+^~%]/g, zi = /^\s*(?:[-*+]|\d+[.)])\s/, Eh = /^\s*>/, Ah = /^\s*\|/, Oh = 0.6, Th = 0.4, Ih = 5, Bh = 0.03, Ui = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Ih && t.every((n) => _h.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Ch) ?? []).length / e.length < Bh;
}, qa = (e) => {
  const t = e.trim();
  return Mh.test(t) ? !1 : [hh, ph, vh, gh, yh, bh, kh, wh, $h].some((n) => n.test(t)) || /[;{}]$/.test(t) || xh.test(e) && !zi.test(e) && !Ui(e);
};
function Rh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || zi.test(t[0]) || t.every((o) => Eh.test(o) || Ah.test(o))) return "text";
  const n = t.filter((o) => !Sh.test(o.trim()));
  if (t.length === 1) return !n.length || qa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(qa).length, s = n.filter((o) => !qa(o) && Ui(o)).length;
  return a >= n.length * Oh && s <= n.length * Th ? "code" : "text";
}
const Ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Lh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Nh = `${Ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, qh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Dh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Jo = {
  js: { keywords: Ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Lh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Nh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: qh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Dh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Ph = {
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
function jh(e, t) {
  const n = Jo[Ph[t] ?? t] || Jo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function Fh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of jh(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ct(l) : `<span class="tok-${a}">${ct(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Wh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Hh = 1500, el = /* @__PURE__ */ new WeakMap();
async function zh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Wh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(el.get(t)), el.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Hh)
  )));
}
typeof document < "u" && document.addEventListener("click", zh, !0);
const Uh = /\n\s*\n/, Vh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Gh = /^\s*(`{3,}|~{3,})\s*$/, Kh = /^\s{4,}\S/, Yh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ms = /^\s*(?:[-*+]|\d+[.)])\s/, Vi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Qh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function oo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Xh(e) {
  const t = oo(e.join(`
`));
  return (Qh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Jh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Vi.test(t) && !Ms.test(t);
}, Zh = (e, t) => Ms.test(t) || Ms.test([...e].reverse().find((n) => n.trim()) || "");
function lo(e, t) {
  const n = t || Xh(e), a = Fh(oo(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function ep(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Gh.test(s));
  return a < 0 ? e.length : a;
}
function tp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return lo(a.map(_n), n ? n.toLowerCase() : "");
}
function np(e) {
  const t = e.split(Uh).map((l) => ({ paragraph: l, type: Rh(oo(l).split(`
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
      s(), n.push(lo(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(_n), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function ap(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : np(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Vh);
    if (i) {
      const c = ep(n, l, i[2]);
      o(), a.push(tp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Jh(s) ? Yh : Kh;
    if (!t && u.test(n[l]) && !Zh(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Vi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(lo([...f, ...n.slice(l, c)].map(_n), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Bt((e, t) => ap(e, t.document), { first: !0 });
const sp = ["innerHTML"], op = ["innerHTML"], lp = {
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
      onClick: o[0] || (o[0] = (...l) => B(Pt) && B(Pt)(...l)),
      innerHTML: a.value
    }, null, 8, sp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Pt) && B(Pt)(...l)),
      innerHTML: a.value
    }, null, 8, op));
  }
}, rt = /* @__PURE__ */ z(lp, [["__scopeId", "data-v-d8e75741"]]), jM = (e) => [...new Set(e.agents.map((t) => t.name))], Da = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, ip = "main agent", io = (e, t) => t ? ip : e, rp = ["data-agent-main"], up = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, cp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, dp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = x(() => io(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", up, [...s[0] || (s[0] = [
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
      e.iconOnly ? k("", !0) : (r(), d("span", cp, g(n.value), 1))
    ], 10, rp));
  }
}, Ft = /* @__PURE__ */ z(dp, [["__scopeId", "data-v-a4c3d1e5"]]), fp = ["aria-expanded"], mp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, hp = {
  key: 0,
  class: "tip-failure"
}, pp = { key: 1 }, vp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Re, null), a = x(() => Hd(t.type, t.state)), s = _(!1), o = _([]), l = _("");
    async function i() {
      s.value = !0;
      const f = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = f.ok ? "" : f.error, f.ok && (o.value = f.value.lines ?? []);
    }
    const u = () => s.value = !1, c = () => s.value ? u() : i();
    return (f, m) => a.value ? (r(), d("span", {
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
      U(g(B(mn)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", mp, [
        l.value ? (r(), d("span", hp, g(l.value), 1)) : k("", !0),
        (r(!0), d(L, null, te(o.value, (p) => (r(), d("span", {
          key: p,
          class: "tip-line"
        }, g(p), 1))), 128))
      ])) : k("", !0)
    ], 40, fp)) : (r(), d("span", pp, g(B(mn)(e.type, e.state)), 1));
  }
}, gp = /* @__PURE__ */ z(vp, [["__scopeId", "data-v-bf9353d9"]]), yp = {
  class: "plan-details",
  "data-plan-details": ""
}, bp = { class: "state-line" }, kp = {
  key: 0,
  class: "phase-count"
}, wp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, $p = { class: "text" }, xp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, Sp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, Mp = { class: "overall" }, _p = { class: "overall-figure" }, Cp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, Ep = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, Ap = {
  key: 5,
  class: "part"
}, Op = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", yp, [
        h("div", bp, [
          A(gp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", B(hi)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", kp, "Phase " + g(e.plan.current_phase) + " of " + g(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", wp, [
          h("h4", null, g(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", $p, g(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", xp, "Opens by itself when " + g(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + g(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", Sp, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", Mp, [
            A(Bi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", _p, g(e.plan.finished) + " of " + g(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Cp, [
          A(Ft, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", Ep, [
          B(Da)(e.plan) ? (r(), j(Ft, {
            key: 0,
            name: B(Da)(e.plan).name,
            main: B(Da)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(L, { key: 1 }, [
            U(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", Ap, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(Ii, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: P(() => [
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
}, FM = /* @__PURE__ */ z(Op, [["__scopeId", "data-v-8c7a9053"]]), Tp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), j(Qe(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: P(() => [
        re(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          re(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Ip = /* @__PURE__ */ z(Tp, [["__scopeId", "data-v-683e1839"]]), Gi = (e) => `row:${e}`, Bp = 5e3, Rp = "cancelled", Pa = /* @__PURE__ */ new Map();
async function Lp(e, t) {
  const n = `${e.environment}:${t}`, a = Pa.get(n);
  if (a && performance.now() - a.at < Bp) {
    const o = await a.answer;
    if (o.failure !== Rp) return o;
    Pa.delete(n);
  }
  const s = e.read(`agent tip ${Gi(t)}`);
  return Pa.set(n, { answer: s, at: performance.now() }), s;
}
function Np(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Cn(e, t = Date.now()) {
  const n = Np(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const qp = 36e5;
function Dp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / qp;
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
const ja = (e) => String(e).padStart(2, "0");
function Yi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ja(t % 60)}s` : `${Math.floor(t / 3600)}h ${ja(Math.floor(t % 3600 / 60))}m ${ja(t % 60)}s`;
}
const Pp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, jp = { state: "retired", words: "Retired" }, Fp = (e) => e.retired ? jp : Pp[e.activity], Wp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), Hp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${Cn(e, t)}` : "", zp = (e, t) => e ? `Seen: ${Cn(e, t)}` : "", Up = {
  class: "line head",
  "data-agent-tip-head": ""
}, Vp = { key: 0 }, Gp = {
  class: "line",
  "data-agent-tip-identity": ""
}, Kp = {
  class: "line status",
  "data-agent-tip-status": ""
}, Yp = ["data-state"], Qp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, Xp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, Jp = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, Zp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, e1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Me(Re, null), a = _(!1), s = _(null), o = _(""), l = _(Date.now()), i = x(() => Fp(s.value)), u = x(() => Hp(s.value.since, l.value)), c = x(() => zp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await Lp(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), j(Ip, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Ul({
      default: P(() => [
        re(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(L, { key: 0 }, [
            h("span", Up, [
              h("b", null, g(s.value.title), 1),
              p[0] || (p[0] = U()),
              s.value.name ? (r(), d("span", Vp, g(s.value.name), 1)) : k("", !0)
            ]),
            h("span", Gp, g(B(Wp)(s.value)), 1),
            h("span", Kp, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, Yp),
              U(g(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", Qp, g(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", Xp, g(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", Jp, g(e.label), 1)),
          o.value ? (r(), d("span", Zp, g(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, pn = /* @__PURE__ */ z(e1, [["__scopeId", "data-v-71d17663"]]), t1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, n1 = { class: "agent-word" }, a1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", t1, [
      (r(!0), d(L, null, te(s.value, (i) => (r(), j(pn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: B(io)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => B(Fe)(`agents:${i.id}`)
      }, {
        default: P(() => [
          h("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Ft, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", n1, g(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, s1 = /* @__PURE__ */ z(a1, [["__scopeId", "data-v-619caeed"]]), o1 = { class: "phases" }, l1 = { class: "phead" }, i1 = { class: "mark" }, r1 = { class: "ptitle" }, u1 = { class: "phead-end" }, c1 = {
  key: 0,
  class: "checkpoint"
}, d1 = { class: "progress" }, f1 = {
  key: 0,
  class: "when"
}, m1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", o1, [
      (r(!0), d(L, null, te(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", l1, [
          h("span", i1, [
            A(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", r1, g(i + 1) + ". " + g(l.title), 1),
          h("span", u1, [
            l.checkpoint ? (r(), d("span", c1, "checkpoint")) : k("", !0),
            h("span", d1, g(n(l)) + "/" + g(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", f1, g(l.goal), 1)) : k("", !0),
        A(s1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(L, null, te(l.tasks, (u) => re(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, WM = /* @__PURE__ */ z(m1, [["__scopeId", "data-v-05aaa685"]]), h1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, p1 = { ...h1, done: "Completed" }, v1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), g1 = (e) => v1.has(e), vn = (e) => g1(e) ? "done" : e, y1 = { class: "task-status-icon" }, b1 = ["width", "height", "aria-label"], k1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = x(() => hi("task", vn(t.status))), a = x(() => n.value === "testing" ? "started" : n.value), s = x(() => p1[t.status] ?? mn("task", t.status));
    return (o, l) => (r(), d("span", y1, [
      A(Yt, {
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
            A(Qt, { value: a.value }, {
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
          ], 10, b1))
        ]),
        _: 1
      })
    ]));
  }
}, $a = /* @__PURE__ */ z(k1, [["__scopeId", "data-v-ae24a63f"]]), w1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, $1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, x1 = {
  key: 2,
  class: "empty"
}, S1 = { class: "day" }, M1 = { class: "events" }, _1 = { class: "mark" }, C1 = { class: "what" }, E1 = { class: "head" }, A1 = { class: "word" }, O1 = ["title", "onClick"], T1 = { class: "at" }, I1 = {
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
    return pe(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", w1, [
      l.value ? (r(), d("p", $1, g(l.value), 1)) : o.value === null ? (r(), j(Je, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", x1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(L, null, te(i.value, (p) => (r(), d(L, {
        key: p.day
      }, [
        h("h3", S1, g(p.day), 1),
        h("ol", M1, [
          (r(!0), d(L, null, te(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            h("span", _1, [
              n[y.event_type].state ? (r(), j($a, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), j(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", C1, [
              h("div", E1, [
                h("span", A1, g(n[y.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + g(y.task_id) + " " + g(y.title), 9, O1),
                h("span", T1, g(u(y.time)), 1)
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
}, HM = /* @__PURE__ */ z(I1, [["__scopeId", "data-v-9e511133"]]), B1 = 1e3;
function Qi() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), B1);
  return st(() => clearInterval(t)), e;
}
const R1 = Symbol("resource-subscriptions");
function L1() {
  const e = Me(R1, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = Me(Re, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new oi();
  return (a, s) => n.follow("resources", a, s);
}
function En(e, t, n = () => !0) {
  const a = Us(t, 100), s = L1()(e, (o) => {
    n(o) && a();
  });
  ga(() => {
    s(), a.cancel();
  });
}
function N1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Xi = { compact: "Compaction", clear: "Clear" }, q1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, D1 = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function P1(e) {
  return e != null && e.is_open ? `${Xi[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function j1(e) {
  if (!e) return [];
  const t = [["Last context change", `${Xi[e.change]}: ${D1[e.state]}`], ["Asked by", q1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const F1 = "Not known", W1 = 80, H1 = 1e3, z1 = "worker", U1 = "main", V1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), G1 = (e) => e.ok ? e.value.rows : [], K1 = (e, t) => e.ended_at ? "ended" : e.paused_at || V1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ji = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Y1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / H1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Yi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > W1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? F1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === z1 && l.push({ key: "pace", label: "Tasks an hour", value: String(Dp(Ji(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === U1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Q1(e) {
  const t = Ji(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function X1(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", tl(e.created_at)]), e.ended_at && a.push(["Ended", tl(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...j1(n)), a;
}
const J1 = { class: "band" }, Z1 = { key: 0 }, ev = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", J1, [
      A(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      re(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Z1, g(e.count), 1)) : k("", !0)
    ]));
  }
}, Tt = /* @__PURE__ */ z(ev, [["__scopeId", "data-v-1758914f"]]), tv = { class: "number" }, nv = { class: "text" }, av = 150, sv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = x(() => t.text.length > av), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(L, null, [
      e.text ? (r(), d(L, { key: 0 }, [
        A(Tt, { icon: "file" }, {
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
        A(Tt, { icon: "points" }, {
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
            h("span", tv, g(i.id), 1),
            h("span", nv, [
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
}, ov = /* @__PURE__ */ z(sv, [["__scopeId", "data-v-c99de22c"]]), lv = ["aria-expanded"], iv = { class: "count" }, rv = {
  key: 0,
  "data-agent-fold-body": ""
}, uv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Ht({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = dn(e, "open");
    return (n, a) => (r(), d(L, null, [
      h("button", {
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
        U(g(e.label), 1),
        h("span", iv, g(e.count), 1),
        A(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, lv),
      t.value ? (r(), d("div", rv, [
        re(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Fa = /* @__PURE__ */ z(uv, [["__scopeId", "data-v-7f93d8d9"]]), cv = ["onClick"], dv = { class: "text" }, fv = { class: "aside" }, mv = {
  key: 0,
  class: "none"
}, hv = {
  class: "skills",
  "data-agent-skills": ""
}, pv = {
  key: 0,
  class: "none-inline"
}, vv = { class: "label" }, gv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Kt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (l) => G1(await t.read(l));
    return pe(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(L, null, [
      A(Fa, {
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
            onClick: (c) => B(kt)("agents", u.id)
          }, [
            h("span", dv, g(B(Vt)(u).title), 1),
            h("span", fv, g(B(Vt)(u).subtext), 1)
          ], 8, cv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", mv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Fa, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          h("p", hv, [
            (r(!0), d(L, null, te(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, g(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", pv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Fa, {
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
            h("span", vv, g(u) + ":", 1),
            h("span", {
              class: Y(["value", f])
            }, g(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, yv = /* @__PURE__ */ z(gv, [["__scopeId", "data-v-1281605f"]]), bv = ["datetime", "title"], at = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Qi(), a = x(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, g(B(Cn)(e.at, B(n))), 9, bv));
  }
}, kv = {
  class: "now",
  "data-agent-now": ""
}, wv = {
  key: 1,
  class: "muted"
}, $v = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, xv = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, Sv = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Mv = { class: "line" }, _v = { class: "detail" }, Cv = { class: "bar" }, Ev = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = x(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(L, null, [
      A(Tt, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          U("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", kv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(kt)("tasks", e.inspection.task.id))
        }, "Task " + g(e.inspection.task.id) + ": " + g(e.inspection.task.title), 1)) : (r(), d("span", wv, g(e.nothing), 1)),
        n.value ? (r(), d("span", $v, g(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", xv, [
          o[3] || (o[3] = U("Seen: ", -1)),
          A(at, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", Sv, [
        h("div", Mv, [
          h("span", null, "Plan " + g(e.inspection.plan.id) + ", phase " + g(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(kt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", _v, g(e.inspection.plan.done) + " of " + g(e.inspection.plan.total) + " tasks done", 1),
        h("div", Cv, [
          h("i", {
            style: ge({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, Av = /* @__PURE__ */ z(Ev, [["__scopeId", "data-v-ff25c609"]]), Ov = ["onClick"], Tv = { class: "text" }, Iv = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Bv = { class: "text" }, Rv = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Lv = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(L, null, [
      A(Tt, { icon: "clock" }, {
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
          onClick: (s) => B(kt)(a.table, a.id)
        }, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Tv, g(a.text), 1),
          A(at, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Ov)) : (r(), d("div", Iv, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Bv, g(a.text), 1),
          A(at, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", Rv, "Nothing yet."))
    ], 64));
  }
}, Nv = /* @__PURE__ */ z(Lv, [["__scopeId", "data-v-58f0db57"]]), qv = {
  class: "strip",
  "data-agent-strip": ""
}, Dv = ["data-agent-cell"], Pv = {
  key: 0,
  class: "meter"
}, jv = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", qv, [
      (r(!0), d(L, null, te(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, g(a.label), 1),
        h("b", {
          class: Y({ bad: a.bad })
        }, g(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Pv, [
          h("i", {
            class: Y({ high: a.high }),
            style: ge({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, Dv))), 128))
    ]));
  }
}, Fv = /* @__PURE__ */ z(jv, [["__scopeId", "data-v-b6657ab7"]]), Wv = {}, Hv = { class: "menu-label" };
function zv(e, t) {
  return r(), d("span", Hv, [
    re(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Et = /* @__PURE__ */ z(Wv, [["render", zv], ["__scopeId", "data-v-aa955b3e"]]), Uv = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Vv = {
  key: 0,
  class: "skills-none"
}, Gv = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.skills.filter((l) => l.state === "loaded")), o = x(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Uv, [
      A(Et, null, {
        default: P(() => [...i[1] || (i[1] = [
          U("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", Vv, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(L, null, te(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(le, {
          name: "book",
          size: 12
        }),
        U(g(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(L, { key: 1 }, [
        A(Et, null, {
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
          A(le, {
            name: "book",
            size: 12
          }),
          U(g(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(Ve, {
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
}, Kv = /* @__PURE__ */ z(Gv, [["__scopeId", "data-v-be514d47"]]), Yv = ["disabled", "title"], Qv = { class: "gauge usage" }, Xv = {
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
      A(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = U()),
      h("span", Qv, [
        h("span", {
          style: ge({ width: `${o.value}%` })
        }, null, 4)
      ]),
      U(" " + g(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Yv)) : k("", !0);
  }
}, Jv = /* @__PURE__ */ z(Xv, [["__scopeId", "data-v-a36f09dc"]]), Zv = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["badge", e.tone])
    }, g(e.text), 3));
  }
}, ro = /* @__PURE__ */ z(Zv, [["__scopeId", "data-v-9e7e1157"]]);
function eg(e, t, n, { groups: a, programs: s }) {
  const o = _({}), l = _(""), i = _(!1), u = x(() => !!e.value && !e.value.ended_at), c = x(() => u.value && !!e.value.paused_at);
  async function f(b, M = null) {
    l.value = "";
    const C = await Ql(M, b, t);
    return l.value = C.ok ? "" : C.error, n(), C;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, M) => f(["agent", "control", String(e.value.number), b, M.value], { target: o, fields: { value: { ...o.value, [b]: M.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const tg = ["disabled", "title"], ng = ["disabled", "title"], ag = { class: "gauge" }, sg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, og = ["disabled", "title"], lg = ["disabled"], ig = ["disabled"], rg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, ug = ["title"], cg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, dg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, fg = { class: "gauge" }, mg = { class: "context-used" }, hg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, pg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, vg = 75, gg = {
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
    const n = e, a = t, s = eg(Aa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Aa(n, "controlGroups"), programs: Aa(n, "agentPrograms") }), o = _(null), l = _(""), i = x(() => s.groups.value.find((q) => q.key === l.value));
    function u(q, E) {
      o.value = q.currentTarget, l.value = E;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = x(() => n.skills.filter((q) => q.state === "loaded"));
    function m(q) {
      u(q, "skills"), a("skills");
    }
    const p = (q) => s.groups.value.some((E) => E.key === q), y = x(() => {
      var q;
      return s.chosen.value.model ?? ((q = M.value) == null ? void 0 : q.model) ?? "";
    }), b = x(() => {
      var q;
      return s.chosen.value.effort ?? ((q = M.value) == null ? void 0 : q.effort) ?? "";
    });
    x(() => !!n.agent && !n.agent.ended_at);
    const M = x(() => {
      var q;
      return ((q = n.usage.agents) == null ? void 0 : q.find((E) => {
        var N;
        return E.id === ((N = n.agent) == null ? void 0 : N.id);
      })) ?? null;
    }), C = x(() => {
      var q;
      return ((q = M.value) == null ? void 0 : q.context_percent) == null ? null : Math.round(M.value.context_percent);
    }), S = x(() => {
      var q;
      return P1(((q = M.value) == null ? void 0 : q.context_change) ?? null);
    }), T = (q) => `${Math.round(q / 1e3)}k`, H = x(() => {
      var q;
      return !!((q = M.value) != null && q.context_limit_tokens);
    }), W = x(() => {
      var q, E;
      return ((q = M.value) == null ? void 0 : q.context_limit_tokens) || ((E = M.value) == null ? void 0 : E.context_window_tokens) || 0;
    }), I = x(() => W.value ? `${T(M.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), G = x(() => {
      var q;
      return (q = M.value) != null && q.cost_dollars ? `$${M.value.cost_dollars.toFixed(2)}` : "";
    });
    return (q, E) => {
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
            onClick: E[0] || (E[0] = (w) => u(w, "agent"))
          }, [
            A(le, {
              name: "agents",
              size: 12
            }),
            U(" " + g(((N = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : N.title) || e.agent.program), 1)
          ], 8, tg),
          A(Jv, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: E[1] || (E[1] = (w) => a("open", "usage", w))
          }, null, 8, ["windows", "disabled"]),
          C.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${C.value}% full: clear or compact it`,
            onClick: E[2] || (E[2] = (w) => p("context") ? u(w, "context") : a("open", "context", w.currentTarget))
          }, [
            A(le, {
              name: "gauge",
              size: 12
            }),
            E[14] || (E[14] = U()),
            h("span", ag, [
              h("span", {
                style: ge({ width: `${C.value}%` })
              }, null, 4)
            ]),
            U(" " + g(C.value) + "% ", 1)
          ], 8, ng)) : (D = M.value) != null && D.context_unknown ? (r(), d("span", sg, [
            A(le, {
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
            onClick: E[3] || (E[3] = (w) => p("model") ? u(w, "model") : null)
          }, [
            A(le, {
              name: "model",
              size: 12
            }),
            U(" " + g(y.value), 1)
          ], 8, og)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
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
            U(" " + g(b.value), 1)
          ], 8, lg)) : k("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: E[5] || (E[5] = (w) => a("open", "cost", w.currentTarget))
          }, g(G.value), 9, ig)) : k("", !0),
          e.branch ? (r(), d("span", rg, [
            A(le, {
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
            onClick: E[6] || (E[6] = (w) => a("open", "jobs", w.currentTarget))
          }, [
            A(le, {
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
            A(le, {
              name: "book",
              size: 12
            }),
            U(" " + g(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(L, { key: 8 }, [
            h("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < vg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: E[7] || (E[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              A(le, {
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
              onClick: E[8] || (E[8] = (w) => a("open", "load", w.currentTarget))
            }, [
              A(le, {
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
          onClick: E[9] || (E[9] = (w) => u(w, "start"))
        }, [
          A(le, {
            name: "agents",
            size: 12
          }),
          E[16] || (E[16] = U(" Start an agent", -1))
        ])) : k("", !0),
        E[22] || (E[22] = h("span", { class: "space" }, null, -1)),
        B(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: B(s).failure.value
        }, g(B(s).failure.value), 9, ug)) : k("", !0),
        re(q.$slots, "default", {}, void 0, !0),
        o.value ? (r(), j(ya, {
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
                  A(Et, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...E[17] || (E[17] = [
                      U("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ve, {
                    "data-agent-stop-confirm": "",
                    onClick: E[10] || (E[10] = (v) => (c(), B(s).stop()))
                  }, {
                    default: P(() => [...E[18] || (E[18] = [
                      U("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ve, {
                    onClick: E[11] || (E[11] = (v) => B(s).asking.value = !1)
                  }, {
                    default: P(() => [...E[19] || (E[19] = [
                      U("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), j(Ve, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: E[12] || (E[12] = (v) => B(s).asking.value = !0)
                }, {
                  default: P(() => [...E[20] || (E[20] = [
                    U("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(L, { key: 1 }, [
                A(Et, null, {
                  default: P(() => [...E[21] || (E[21] = [
                    U("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(L, null, te(B(s).programs.value, (v) => (r(), j(Ve, {
                  key: v.name,
                  "data-agent-program": v.name,
                  onClick: ($) => (c(), B(s).start(v))
                }, {
                  default: P(() => [
                    U(g(v.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), j(Kv, {
                key: 2,
                skills: e.skills,
                onBrowse: E[13] || (E[13] = (v) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(L, { key: 3 }, [
                A(Et, null, {
                  default: P(() => [
                    U(g(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(L, { key: 0 }, [
                  h("p", cg, g(B(N1)(((w = M.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  h("div", dg, [
                    h("span", fg, [
                      h("span", {
                        style: ge({ width: `${C.value}%` })
                      }, null, 4)
                    ]),
                    h("span", mg, g(C.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", hg, [
                    U(g(I.value) + " ", 1),
                    H.value ? (r(), j(ro, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && S.value ? (r(), d("p", pg, g(S.value), 1)) : (r(!0), d(L, { key: 2 }, te(i.value.choices, (v) => (r(), j(Ve, {
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
}, yg = /* @__PURE__ */ z(gg, [["__scopeId", "data-v-d7113347"]]), bg = {
  class: "who",
  "data-agent-who": ""
}, kg = { class: "name" }, wg = ["data-agent-state"], $g = {
  class: "sub",
  "data-agent-started-by": ""
}, xg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", bg, [
      h("h2", kg, [
        h("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, wg),
        U(g(e.name), 1)
      ]),
      A(yg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", $g, "Started by: " + g(e.startedBy), 1)
    ]));
  }
}, Sg = /* @__PURE__ */ z(xg, [["__scopeId", "data-v-83bd4a9d"]]), Mg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, _g = { class: "scroll" }, Cg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Eg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Ag = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Qi(), a = _(null), s = _(null), o = _(null), l = _(null), i = _({}), u = _({ helpers: 0, skills: 0 }), c = _(0), f = _([]), m = _([]), p = _("");
    let y = 0;
    const b = x(() => {
      var T;
      return a.value.ended_at ? Q1(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function M() {
      const T = ++y, H = await t.read(["usage", "inspector", Gi(t.id), "--environment", t.environment]);
      T === y && (p.value = H.ok ? "" : H.error, H.ok && (a.value = H.value.agent, s.value = H.value.facts, o.value = H.value.inspection, l.value = H.value.compaction ?? null, i.value = H.value.tool, u.value = { helpers: H.value.helpers, skills: H.value.skills }, f.value = H.value.points, m.value = H.value.programs, c.value += 1));
    }
    const C = x(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (T) => li(T, C.value),
      hook_call: (T) => Cc(T, "session_agent_id", C.value)
    };
    return En(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], M, (T) => {
      var H;
      return ((H = S[T.event.split(".")[0]]) == null ? void 0 : H.call(S, T)) ?? !0;
    }), Ce(M), (T, H) => {
      var W, I;
      return r(), d("article", Mg, [
        h("div", _g, [
          p.value ? (r(), d("p", Cg, g(p.value), 1)) : a.value && o.value ? (r(), d(L, { key: 1 }, [
            A(Sg, {
              name: B(Vt)(a.value, s.value).text,
              state: B(K1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(Fv, {
              cells: B(Y1)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            A(Av, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(ov, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((I = s.value) == null ? void 0 : I.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(Nv, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(yv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: B(X1)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Eg, "Ended " + g(B(Cn)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), j(Je, { key: 2 }))
        ])
      ]);
    };
  }
}, zM = /* @__PURE__ */ z(Ag, [["__scopeId", "data-v-b88512f5"]]);
function Og(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ce(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), st(() => n.disconnect()), t;
}
const Tg = ["data-comment-id"], Ig = {
  key: 0,
  class: "comment-top"
}, Bg = { class: "comment-mark" }, Rg = {
  class: "comment-body",
  "data-comment": ""
}, Lg = { class: "comment-foot" }, Ng = {
  key: 1,
  "data-comment-lost": ""
}, qg = {
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
      e.comment.quote ? (r(), d("div", Ig, [
        h("span", Bg, g(e.comment.number), 1),
        h("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, g(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", Rg, g(e.comment.body), 1),
      h("div", Lg, [
        e.comment.created_at ? (r(), j(at, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", Ng, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Tg));
  }
}, Zi = /* @__PURE__ */ z(qg, [["__scopeId", "data-v-a37d4507"]]);
var zl;
/Mac|iPhone|iPad/.test(((zl = navigator.userAgentData) == null ? void 0 : zl.platform) || navigator.platform);
function er(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Dg = {
  class: "comment-box",
  "data-comment-box": ""
}, Pg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, jg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Fg = { class: "comment-row" }, Wg = ["placeholder"], Hg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Ht({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Ht(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = dn(e, "draft"), l = _(""), i = _(!1), u = _(null), c = x(() => {
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
          await a.send(y), o.value = "", await We(), m();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", Dg, [
      e.selection ? (r(), d("div", Pg, [
        b[3] || (b[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, g(e.selection.quote), 3),
        A(ba, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (M) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", jg, g(l.value), 1)) : k("", !0),
      h("div", Fg, [
        _e(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (M) => o.value = M),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: b[2] || (b[2] = At((M) => B(er)(M, p), ["enter"]))
        }, null, 42, Wg), [
          [Ke, o.value]
        ]),
        A(ve, {
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
}, zg = /* @__PURE__ */ z(Hg, [["__scopeId", "data-v-41d2081c"]]), Fn = (e) => e ? e.split(", ") : [];
function Ug({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Vg(e, t) {
  return {
    reads: Fn(e.reads_allowed),
    runs: Fn(e.runs_allowed),
    missing: [...Fn(e.reads_missing), ...Fn(e.runs_missing)],
    ask: t
  };
}
const Gg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = pu("SkeletonParts", !0);
      return r(!0), d(L, null, te(e.parts, (u, c) => (r(), d(L, { key: c }, [
        (r(!0), d(L, null, te(u.count, (f) => (r(), j(Qt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            A(sn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            A(sn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            A(sn, {
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
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            h("div", {
              class: "skeleton-stack",
              style: ge(a(u))
            }, [
              A(i, {
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
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
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
}), Kg = /* @__PURE__ */ z(Gg, [["__scopeId", "data-v-fa8baeaf"]]), Yg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Qg = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Yg, [
      A(Kg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, uo = /* @__PURE__ */ z(Qg, [["__scopeId", "data-v-52f66b64"]]), tr = {
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
}, Xg = { class: "bars" }, Jg = { class: "bar-name" }, Zg = { class: "bar-value" }, ey = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = x(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Xg, [
      (r(!0), d(L, null, te(e.items, (u, c) => (r(), j(Qe(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          h("span", Jg, g(u.label), 1),
          A(Bi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", Zg, g(u.value) + g(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ty = /* @__PURE__ */ z(ey, [["__scopeId", "data-v-663427f4"]]), ny = { class: "bars" }, ay = {
  key: 0,
  class: "bars-title"
}, sy = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", ny, [
      e.node.title ? (r(), d("span", ay, g(e.node.title), 1)) : k("", !0),
      A(ty, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, oy = /* @__PURE__ */ z(sy, [["__scopeId", "data-v-7135bb11"]]), ly = {
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
      (r(!0), d(L, null, te(e.node.children || [], (u, c) => (r(), j(ar, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, nr = /* @__PURE__ */ z(ly, [["__scopeId", "data-v-d142a3f4"]]), iy = {
  key: 0,
  class: "card-head"
}, ry = { class: "card-title" }, uy = {
  key: 0,
  class: "card-note"
}, cy = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", iy, [
        h("span", ry, g(e.node.title), 1),
        e.node.note ? (r(), d("span", uy, g(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A(nr, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, dy = /* @__PURE__ */ z(cy, [["__scopeId", "data-v-67b72d40"]]), fy = { class: "fact" }, my = { class: "fact-label" }, hy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", fy, [
      h("span", my, g(e.label), 1),
      A(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, py = /* @__PURE__ */ z(hy, [["__scopeId", "data-v-3a88ecf8"]]), vy = { class: "list" }, gy = { class: "list-label" }, yy = {
  key: 1,
  class: "list-note"
}, by = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", vy, [
      (r(!0), d(L, null, te(e.items, (o, l) => (r(), j(Qe(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          h("span", gy, g(o.label), 1),
          o.badge ? (r(), j(ro, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", yy, g(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ky = /* @__PURE__ */ z(by, [["__scopeId", "data-v-ebe2ae0a"]]), wy = { class: "table" }, $y = {
  key: 0,
  class: "table-row empty"
}, xy = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", wy, [
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
      !e.rows.length && e.empty ? (r(), d("div", $y, g(e.empty), 1)) : k("", !0)
    ]));
  }
}, Sy = /* @__PURE__ */ z(xy, [["__scopeId", "data-v-9326a52e"]]), My = { class: "stat-value" }, _y = { class: "stat-label" }, Cy = {
  key: 0,
  class: "stat-note"
}, Ey = {
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
        h("span", My, g(e.value), 1),
        h("span", _y, g(e.label), 1),
        e.note ? (r(), d("span", Cy, g(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ay = /* @__PURE__ */ z(Ey, [["__scopeId", "data-v-ad0db6d6"]]), Oy = { class: "code" }, Ty = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = x(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), j(Qt, { value: s.value }, {
      group: P(() => [
        A(nr, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        A(dy, {
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
        A(Ay, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        A(oy, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        A(Sy, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        A(ky, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        A(rt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        A(py, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        A(ro, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        h("pre", Oy, [
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
}), ar = /* @__PURE__ */ z(Ty, [["__scopeId", "data-v-b9156b43"]]), Iy = { class: "dashboard" }, By = { class: "trail" }, Ry = ["onClick"], Ly = {
  key: 0,
  class: "gone",
  role: "status"
}, Ny = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = x(() => l.value.at(-1) || n.document.start), u = x(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", Iy, [
      e.document.broken ? (r(), j(fn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          U(g(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), j(fn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          U(g(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(L, { key: 2 }, [
        h("nav", By, [
          h("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => m(0))
          }, g(c(e.document.start)), 3),
          (r(!0), d(L, null, te(l.value, (b, M) => (r(), d(L, {
            key: `${M}-${b}`
          }, [
            y[2] || (y[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: Y(["step", { current: M === l.value.length - 1 }]),
              onClick: (C) => m(M + 1)
            }, g(c(b)), 11, Ry)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Ly, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(Yt, {
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
}, qy = /* @__PURE__ */ z(Ny, [["__scopeId", "data-v-fbe83734"]]);
function Dy(e, t) {
  const n = ot(), a = Us(e, tr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ce(e), st(() => {
    s(), a.cancel();
  });
}
const Py = {
  key: 0,
  class: "window-failure"
}, jy = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ot(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Dy(l, n.events) : Hs(l, () => !0, tr.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", Py, g(o.value.error), 1)) : o.value ? (r(), j(qy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Fy = 1e4;
class Wy {
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
    return this.heardAt !== null && t - this.heardAt > Fy;
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
const Hy = {
  key: 0,
  class: "frame-note"
}, zy = {
  key: 0,
  class: "frame-note"
}, Uy = ["src", "title"], Vy = 1e3, Gy = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ot(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Ce(() => {
      l = new Wy(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Vy);
    }), Ne(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", Hy, "This window was closed because it stopped answering.")) : (r(), d(L, { key: 1 }, [
      s.value ? (r(), d("div", zy, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(ve, {
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
      }, null, 8, Uy)
    ], 64));
  }
}, Ky = /* @__PURE__ */ z(Gy, [["__scopeId", "data-v-32a49046"]]), Yy = {
  class: "allowance-prompt",
  role: "dialog"
}, Qy = { class: "allowance-prompt-text" }, Xy = { class: "allowance-prompt-buttons" }, Jy = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Yy, [
      h("p", Qy, g(B(Ug)(e.request)), 1),
      h("div", Xy, [
        A(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            U("Allow", -1)
          ])]),
          _: 1
        }),
        A(ve, {
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
}, Zy = /* @__PURE__ */ z(Jy, [["__scopeId", "data-v-cad69fe2"]]), Wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(fn, {
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
}, e0 = ["data-window", "data-agent"], t0 = {
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
    const i = Me(Dc, null), u = Yd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: x(() => n.options),
      declared: n.declared,
      page: Me(zd, null),
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
    js(Re, u), pe(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ce(u.settle), Ne(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), vu((m) => (s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => pa(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), j(Zy, {
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
        e.skeleton.length && !B(u).answered.value ? (r(), j(uo, {
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
    ], 8, e0));
  }
}, on = /* @__PURE__ */ z(t0, [["__scopeId", "data-v-c4443e2b"]]), sr = {
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
    const n = e, a = t, s = { render: () => pa(Ky, { src: n.entry.entry_url }) };
    return (o, l) => (r(), j(on, {
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
}, n0 = ["data-window"], or = {
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
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, ec();
          } catch (i) {
            if (Ju(i) && Zu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(uo, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, n0)) : (r(), j(on, {
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
}, a0 = {
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
    const n = t, a = e, s = x(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = x(() => s.value && { render: () => pa(jy, { line: s.value.line, events: s.value.events }) }), l = _(null), i = x(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = x(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = x(
      () => {
        var p, y;
        return l.value ? Vg(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return pe(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, M;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), j(uo, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((M = s.value) == null ? void 0 : M.shows) === "one-agent" && e.agent === null ? (r(), j(fn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), j(on, {
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
        onOption: y[0] || (y[0] = (C, S) => n("option", C, S))
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
        onOption: y[1] || (y[1] = (C, S) => n("option", C, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), j(on, {
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
        onOption: y[2] || (y[2] = (C, S) => n("option", C, S))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), j(on, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (C) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, s0 = ["data-section"], o0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, l0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Qs, null), a = x(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = x(() => ({ row: t.row }));
    return (o, l) => B(n) ? (r(!0), d(L, { key: 0 }, te(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), j(a0, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", o0, g(i.name) + " is not available", 1))
    ], 8, s0))), 128)) : k("", !0);
  }
}, _s = /* @__PURE__ */ z(l0, [["__scopeId", "data-v-a47d36b7"]]), i0 = { class: "rail-head" }, r0 = { key: 0 }, u0 = {
  key: 1,
  class: "rail-none"
}, c0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", i0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", r0, g(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(L, { key: 0 }, te(e.comments, (a) => (r(), j(Zi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", u0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, d0 = /* @__PURE__ */ z(c0, [["__scopeId", "data-v-4d684649"]]), f0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, m0 = ["aria-pressed"], h0 = ["aria-pressed"], p0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, v0 = {
  key: 0,
  role: "alert"
}, g0 = {
  key: 1,
  class: "sidebar-none"
}, y0 = ["data-question-id"], b0 = { class: "question-state" }, k0 = ["data-question-show", "onClick"], w0 = {
  key: 0,
  class: "sidebar-none"
}, $0 = {
  key: 1,
  class: "question-answer"
}, x0 = {
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
    const t = Me(Qs, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", f0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, m0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, h0)
      ]),
      e.mode === "comments" ? (r(), d(L, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), j(d0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(Sn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", p0, [
        e.failure ? (r(), d("p", v0, g(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", g0, "No questions about this text yet.")),
        (r(!0), d(L, null, te(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", b0, g(B(mn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, g(s.text), 9, k0),
            s.quote ? (r(), d(L, { key: 0 }, [
              h("blockquote", null, g(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", w0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", $0, "Answered: " + g(s.answer), 1)) : k("", !0),
            A(_s, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(to, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, y0);
        }), 128))
      ]))
    ], 2));
  }
}, al = /* @__PURE__ */ z(x0, [["__scopeId", "data-v-660e5c85"]]), S0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, M0 = {
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
        h("span", S0, g(o.value), 1),
        A(ve, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ve, {
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
          onSubmit: $e(l, ["prevent"])
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
}, _0 = /* @__PURE__ */ z(M0, [["__scopeId", "data-v-464d77a8"]]);
function lr(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: M, id: C, title: S } = e(), T = `On ${M} ${C}, ${S}: `;
    return b.text.startsWith(T) ? b.text.slice(T.length) : b.text;
  };
  async function m(b = 1) {
    const { term: M, id: C } = e();
    if (!C) return;
    const S = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([M, "comments", String(C), "--page", String(b), "--page-size", "25"]);
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
  async function p(b) {
    var I;
    const { term: M, id: C } = e(), S = `${M}:${C}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const H = await t([M, "comment", String(C), b]);
    if (S !== `${e().term}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((G) => G.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await m();
    const W = (I = H.value) == null ? void 0 : I.id;
    W && !n.value.some((G) => G.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && m(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function C0(e, t) {
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
const E0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, A0 = ["datetime"], O0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, T0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, I0 = {
  key: 2,
  class: "document-none"
}, B0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = x(() => s.value ? C0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", E0, [
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
            }, g(m.created_at.slice(0, 16).replace("T", " ")), 9, A0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", O0, g(o.value), 1)) : k("", !0),
        s.value ? (r(), d(L, { key: 1 }, [
          A(ve, {
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
          h("div", T0, [
            (r(!0), d(L, null, te(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: Y(["revision-line", m.type])
            }, g(m.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", I0, "No revisions"))
    ]));
  }
}, R0 = /* @__PURE__ */ z(B0, [["__scopeId", "data-v-3a381aa4"]]), L0 = "button, [data-comment-number]", N0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function ir(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(L0) || n.push(t.currentNode);
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
const q0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function D0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = ir(e), s = a.map((c) => c.data).join(""), o = sl(a, n.startContainer, n.startOffset), l = s.slice(o, sl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: q0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function P0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function j0(e, t, n) {
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
function F0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function W0(e, t) {
  const n = ir(e), a = P0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = j0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(F0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ha(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ha(t.number, t.id, t.label)) : l.at(-1).append(Ha(t.number, t.id, t.label))), !0;
}
function H0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !W0(e, a) && a.id && n.push(a.id);
  return n;
}
const z0 = (e) => e.closest(N0) ?? e;
function ol(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const U0 = {
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
      const M = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), C = H0(l.value, a.pending ? [...M, { ...a.pending, pending: !0 }] : M);
      s("lost", C);
      const S = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!S) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", z0(S).after(T), c.value = T;
    }
    function m() {
      if (!l.value) return;
      const M = D0(l.value);
      if (u.value = !!M, !M) {
        i.value = null;
        return;
      }
      const C = window.getSelection().getRangeAt(0).getBoundingClientRect(), S = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(C.left - S.left, 0)}px`, top: `${C.top - S.top + o.value.scrollTop}px` }, s("select", M);
    }
    function p(M) {
      const C = M.target.closest("[data-comment-number]");
      C ? s("number", Number(C.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(M) {
      var C;
      (C = l.value.querySelector(`[data-comment="${M}"]`)) == null || C.scrollIntoView({ block: "center" });
    }
    function b(M) {
      var C;
      (C = l.value.querySelectorAll("h3, h4, h5, h6")[M]) == null || C.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Ce(() => {
      f(), document.addEventListener("selectionchange", m);
    }), st(() => document.removeEventListener("selectionchange", m)), t({ show: y, showHeading: b, nextTick: We }), (M, C) => (r(), d("div", {
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
        onMousedown: C[0] || (C[0] = $e(() => {
        }, ["prevent"])),
        onClick: C[1] || (C[1] = (S) => s("write"))
      }, [
        A(le, {
          name: "chat",
          size: 13
        }),
        C[2] || (C[2] = U("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), j(xn, {
        key: 1,
        to: c.value
      }, [
        re(M.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      re(M.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, V0 = /* @__PURE__ */ z(U0, [["__scopeId", "data-v-a92386e6"]]), G0 = { class: "document-tabs" }, K0 = ["aria-pressed"], Y0 = { class: "document-body" }, Q0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, X0 = {
  key: 1,
  class: "document-loading"
}, J0 = {
  class: "document-details",
  "data-resource-fields": ""
}, Z0 = 760, eb = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Me(ri, _(null)), a = _(null), s = Og(a), o = x(() => s.value !== null && s.value < Z0), l = _(null), i = _(""), u = _([]), c = _([]), f = _(""), m = _("comments"), p = _("text"), y = _(0), b = _(!1), M = _(0), C = _([]), S = _(null), T = _(""), H = _(!1), W = _(null), I = _(null);
    let G = 0;
    const q = lr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (se) => t.read(se)), E = x(() => ol(q.comments.value)), N = x(() => m.value === "questions" ? ol(c.value) : E.value), D = x(() => m.value === "questions" ? N.value.length : q.total.value), w = x(() => {
      var se;
      return (se = l.value) != null && se.body ? so(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), v = x(() => {
      var se;
      return (((se = l.value) == null ? void 0 : se.body) ?? "").split(`
`).filter((Q) => /^#{1,4} /.test(Q)).map((Q, he) => ({ key: String(he), value: he, label: Q.replace(/^#+ /, "") }));
    }), $ = x(() => E.value.find((se) => se.id === M.value)), O = x(() => {
      var se;
      return (se = l.value) != null && se.close_reason ? "Closed" : "Open";
    }), R = x(() => p.value === "comments" && !o.value ? "text" : p.value), F = (se) => se.ok ? se.value.rows ?? [] : [];
    async function V() {
      const se = ++G, Q = await t.read([t.term, "inspect", String(t.id)]);
      if (se !== G) return;
      i.value = Q.ok ? "" : Q.error, l.value = Q.ok ? Q.value : null;
      const he = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Ze = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      se === G && (c.value = F(he), f.value = he.ok ? "" : he.error, u.value = Ze ? F(Ze) : []);
    }
    async function J(se) {
      const Q = S.value ? ["--quote", S.value.quote, "--position", String(S.value.position), "--selection-type", S.value.selection_type] : [], he = await t.read([t.term, "comment", String(t.id), ...Q, "--", se]);
      if (!he.ok) throw new Error(he.error);
      S.value = null, await Promise.all([V(), q.load()]);
    }
    async function oe() {
      const se = await t.read(["doc", "close", String(t.id)]);
      i.value = se.ok ? "" : se.error, se.ok && await V();
    }
    function ue() {
      T.value.trim() || (S.value = null);
    }
    async function ke(se) {
      var Q;
      if (y.value = se, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        M.value = M.value === se ? 0 : se;
        return;
      }
      b.value = !0, await We(), (Q = a.value.querySelector(m.value === "questions" ? `[data-question-id="${se}"]` : `[data-comment-id="${se}"]`)) == null || Q.scrollIntoView({ block: "nearest" });
    }
    async function Oe(se) {
      var Q, he;
      p.value = "text", y.value = se, await ((Q = W.value) == null ? void 0 : Q.nextTick()), (he = W.value) == null || he.show(se);
    }
    function be() {
      H.value = !1, V();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", b.value = !1, y.value = 0, M.value = 0, S.value = null, c.value = [], f.value = "", V();
    }, { immediate: !0 }), pe(m, () => {
      y.value = 0, M.value = 0;
    }), (se, Q) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), j(xn, {
        key: 0,
        to: B(n),
        disabled: !B(n)
      }, [
        h("span", {
          class: Y(["document-actions", { placed: B(n) }]),
          "data-document-actions": ""
        }, [
          A(ve, {
            bordered: "",
            "data-text-edit": "",
            onClick: Q[0] || (Q[0] = (he) => H.value = !0)
          }, {
            default: P(() => [...Q[15] || (Q[15] = [
              U("Edit", -1)
            ])]),
            _: 1
          }),
          R.value === "text" && v.value.length > 1 ? (r(), j(Gs, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: v.value,
            "data-text-chapters": "",
            onPick: Q[1] || (Q[1] = (he) => {
              var Ze;
              return (Ze = W.value) == null ? void 0 : Ze.showHeading(he.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", G0, [
        h("button", {
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "text" }]),
          "data-document-tab": "text",
          onClick: Q[2] || (Q[2] = (he) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Q[3] || (Q[3] = (he) => p.value = "comments")
        }, [
          U(g(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, g(D.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: Q[4] || (Q[4] = (he) => b.value = !b.value)
        }, [
          U(g(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, g(D.value || ""), 1)
        ], 10, K0)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Q[5] || (Q[5] = (he) => p.value = "revisions")
        }, [
          Q[16] || (Q[16] = U("Revisions ", -1)),
          h("em", null, g(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      h("div", Y0, [
        i.value ? (r(), d("p", Q0, g(i.value), 1)) : l.value ? R.value === "revisions" ? (r(), j(R0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: oe,
          onRestored: V
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : R.value === "comments" ? (r(), j(al, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": Q[6] || (Q[6] = (he) => m.value = he),
          tab: "",
          comments: E.value,
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
          A(V0, {
            ref_key: "words",
            ref: W,
            html: w.value,
            comments: N.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: S.value,
            inline: M.value,
            onSelect: Q[8] || (Q[8] = (he) => S.value = he),
            onClear: ue,
            onNumber: ke,
            onWrite: Q[9] || (Q[9] = (he) => {
              var Ze;
              return (Ze = I.value) == null ? void 0 : Ze.focus();
            }),
            onLost: Q[10] || (Q[10] = (he) => C.value = he)
          }, {
            inline: P(() => [
              $.value ? (r(), j(Zi, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Q[7] || (Q[7] = (he) => Oe($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: P(() => [
              h("dl", J0, [
                Q[18] || (Q[18] = h("h4", null, "Details", -1)),
                Q[19] || (Q[19] = h("dt", null, "State", -1)),
                h("dd", null, g(O.value), 1),
                l.value.close_reason ? (r(), d(L, { key: 0 }, [
                  Q[17] || (Q[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, g(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                Q[20] || (Q[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  A(at, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                Q[21] || (Q[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  A(at, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), j(al, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": Q[11] || (Q[11] = (he) => m.value = he),
            comments: E.value,
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
        ], 64)) : (r(), d("div", X0, [
          A(Je)
        ]))
      ]),
      l.value ? (r(), j(zg, {
        key: 1,
        ref_key: "composer",
        ref: I,
        draft: T.value,
        "onUpdate:draft": Q[12] || (Q[12] = (he) => T.value = he),
        selection: S.value,
        send: J,
        narrow: o.value,
        onClear: Q[13] || (Q[13] = (he) => S.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      H.value ? (r(), j(_0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: Q[14] || (Q[14] = (he) => H.value = !1),
        onSaved: be
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, UM = /* @__PURE__ */ z(eb, [["__scopeId", "data-v-f9bd78a7"]]), tb = {
  key: 1,
  class: "row-list-failure"
}, nb = ["data-row"], ab = {
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
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), j(Je, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", tb, g(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), j(fn, {
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
            re(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, nb))), 128))
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
}, sb = /* @__PURE__ */ z(ab, [["__scopeId", "data-v-e9f251f3"]]), ob = {
  class: "agent-rows",
  "data-agent-rows": ""
}, lb = {
  key: 1,
  class: "agent-rows-note"
}, ib = {
  key: 2,
  class: "agent-rows-note"
}, rb = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ub = ["data-agent-row", "onClick"], cb = { class: "agent-row-name" }, db = { class: "agent-row-state" }, fb = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = x(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", ob, [
      e.loaded ? e.failure ? (r(), d("p", lb, g(e.failure), 1)) : e.rows.length ? (r(), d(L, { key: 3 }, [
        h("p", rb, g(a.value) + " running", 1),
        (r(!0), d(L, null, te(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(Fe)(`agents:${l.id}`)
        }, [
          h("span", cb, "#" + g(l.id) + " " + g(l.session), 1),
          h("span", db, g(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, ub))), 128))
      ], 64)) : (r(), d("p", ib, g(e.none), 1)) : (r(), j(Je, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, VM = /* @__PURE__ */ z(fb, [["__scopeId", "data-v-a01e5a17"]]), ht = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ue = { across: 48, down: 110, margin: 32, labelSpace: 14 }, mb = 6;
function co(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const hb = (e) => {
  const t = co(e, ht.lineChars), n = Math.max(ht.minWidth, Math.max(...t.map((a) => a.length)) * ht.charWidth + ht.padX * 2);
  return { name: e, lines: t, line: ht.line, padY: ht.padY, width: n, height: t.length * ht.line + ht.padY * 2 };
};
function pb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function vb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function gb(e, t, n) {
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
  for (let l = 0; l < mb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function yb(e, t) {
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
function bb(e) {
  const t = [...new Set(e.flatMap(([W, I]) => [W, I]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = pb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, I) => !s.has(I)), l = vb(t, o), i = gb(t, o, l), u = new Map(t.map((W) => [W, hb(W)])), c = i.map((W) => W.reduce((I, G) => I + u.get(G).width, 0) + Ue.across * (W.length - 1)), f = Math.max(...c) + Ue.margin * 2, m = wb(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = Ue.margin;
  i.forEach((W, I) => {
    let G = (f - c[I]) / 2;
    const q = Math.max(...W.map((E) => u.get(E).height));
    W.forEach((E) => {
      const N = u.get(E);
      p.set(E, { ...N, x: G, y: y + (q - N.height) / 2 }), G += N.width + Ue.across;
    }), y += q + (m[I] ?? Ue.down);
  });
  const b = e.map(([W, I, G], q) => ({ from: W, to: I, label: G || "", back: s.has(q) || l.get(I) <= l.get(W) }));
  yb(b, p);
  const M = b.map((W) => $b(W, p.get(W.from), p.get(W.to))), C = [...p.values()], S = _b(M, C), T = Math.max(y - Ue.down, ...S.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - Ue.margin, ...S.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Ue.margin, height: T + Ue.margin, nodes: C, arrows: S };
}
const kb = (e) => e ? co(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function wb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ue.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += kb(l) + Ue.labelSpace);
  }), a.map((s) => Math.max(Ue.down, s));
}
function $b(e, t, n) {
  const a = e.label ? co(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const xb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Sb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Mb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function _b(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = xb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Mb.flatMap((u) => Sb.map((c) => s(c, u))).find((u) => !n.some((c) => ll(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => ll(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const ll = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Cb = { class: "flowchart-tools" }, Eb = ["width", "height", "viewBox", "aria-label"], Ab = ["d"], Ob = ["x", "y", "width", "height"], Tb = ["x", "y"], Ib = ["x", "dy"], Bb = {
  key: 0,
  class: "flowchart-label"
}, Rb = ["x", "y", "width", "height"], Lb = ["x", "y"], Nb = ["x", "dy"], qb = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => bb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var S;
      const M = (S = l.value) == null ? void 0 : S.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const C = Math.min(M.width / s.value.width, M.height / s.value.height, 1.5);
      i.value = { zoom: C, x: (M.width - s.value.width * C) / 2, y: (M.height - s.value.height * C) / 2 };
    }
    function f(M, C, S) {
      const { zoom: T, x: H, y: W } = i.value, I = Math.min(o.most, Math.max(o.least, T * M));
      i.value = { zoom: I, x: C - (C - H) * I / T, y: S - (S - W) * I / T };
    }
    function m(M) {
      const C = l.value.getBoundingClientRect();
      f(M, C.width / 2, C.height / 2);
    }
    function p(M) {
      const C = l.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? f(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - C.left, M.clientY - C.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function y(M) {
      var C, S, T;
      M.preventDefault(), (C = window.getSelection()) == null || C.removeAllRanges(), u = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (T = (S = l.value).setPointerCapture) == null || T.call(S, M.pointerId);
    }
    function b(M) {
      u && (i.value = { ...i.value, x: M.clientX - u.x, y: M.clientY - u.y });
    }
    return Ce(c), (M, C) => (r(), j(ka, {
      padded: "",
      title: e.title,
      large: "",
      onClose: C[4] || (C[4] = (S) => a("close"))
    }, {
      default: P(() => [
        h("div", Cb, [
          A(ve, {
            small: "",
            onClick: C[0] || (C[0] = (S) => m(o.step))
          }, {
            default: P(() => [...C[5] || (C[5] = [
              U("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            small: "",
            onClick: C[1] || (C[1] = (S) => m(1 / o.step))
          }, {
            default: P(() => [...C[6] || (C[6] = [
              U("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ve, {
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
          onWheel: $e(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: C[2] || (C[2] = (S) => Ao(u) ? u.value = null : u = null),
          onPointercancel: C[3] || (C[3] = (S) => Ao(u) ? u.value = null : u = null)
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
            (r(!0), d(L, null, te(s.value.arrows, (S, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: S.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Ab))), 128)),
            (r(!0), d(L, null, te(s.value.nodes, (S) => (r(), d("g", {
              key: S.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: S.x,
                y: S.y,
                width: S.width,
                height: S.height,
                rx: "8"
              }, null, 8, Ob),
              h("text", {
                x: S.x + S.width / 2,
                y: S.y + S.padY + S.line / 2
              }, [
                (r(!0), d(L, null, te(S.lines, (T, H) => (r(), d("tspan", {
                  key: H,
                  x: S.x + S.width / 2,
                  dy: H ? S.line : 0
                }, g(T), 9, Ib))), 128))
              ], 8, Tb)
            ]))), 128)),
            (r(!0), d(L, null, te(s.value.arrows, (S, T) => (r(), d(L, {
              key: `label-${T}`
            }, [
              S.label ? (r(), d("g", Bb, [
                h("rect", {
                  x: S.label.x,
                  y: S.label.y,
                  width: S.label.width,
                  height: S.label.height,
                  rx: "4"
                }, null, 8, Rb),
                h("text", {
                  x: S.label.x + S.label.width / 2,
                  y: S.label.y + S.label.pad + S.label.line / 2
                }, [
                  (r(!0), d(L, null, te(S.label.lines, (H, W) => (r(), d("tspan", {
                    key: W,
                    x: S.label.x + S.label.width / 2,
                    dy: W ? S.label.line : 0
                  }, g(H), 9, Nb))), 128))
                ], 8, Lb)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Eb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Db = /* @__PURE__ */ z(qb, [["__scopeId", "data-v-e98799dc"]]), Pb = ["innerHTML"], jb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => Do[t.name] || Do.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Pb));
  }
}, It = /* @__PURE__ */ z(jb, [["__scopeId", "data-v-beb5935c"]]), Fb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(It, { name: "fold" })
    ], 2));
  }
}, Jt = /* @__PURE__ */ z(Fb, [["__scopeId", "data-v-d03899bb"]]), Wb = ["data-tip", "aria-label"], Hb = {
  key: 0,
  class: "mact-word"
}, zb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(It, { name: "open" }),
      e.open ? (r(), d("span", Hb, g(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, Wb));
  }
}, rr = /* @__PURE__ */ z(zb, [["__scopeId", "data-v-3b292e09"]]), ur = 120, Xn = 280, cr = 160, Ub = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Vb = ["leaving", "resizing", "entering"];
function Cs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Gb(e) {
  const t = Vb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Cs(e);
  return e.classList.add(...t), n;
}
function dr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const y = Gb(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${Xn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Xn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, y);
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
    if (!p || !p.offsetWidth || Ub()) {
      a.value = m;
      return;
    }
    const b = Cs(p);
    if (l(p, b), s.value = "leaving", await n(ur), y !== o) return;
    a.value = m, s.value = "resizing", await We(), u(p, b);
    const M = c(p);
    await n(Xn), M == null || M.disconnect(), y === o && (i(p), s.value = "entering", await n(cr), y === o && (s.value = ""));
  }
  return pe(t, (m) => f(m)), st(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Kb = { class: "growing-card-top" }, Yb = ["aria-expanded"], Qb = { class: "growing-card-avatar" }, Xb = { class: "growing-card-title" }, Jb = { class: "growing-card-more" }, Zb = { class: "growing-card-body" }, ek = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = dr(o, () => !s.value), u = x(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = x(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", Kb, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", Qb, [
            e.bad ? (r(), j(It, {
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
          h("span", Xb, g(e.title), 1),
          A(Jt, { open: s.value }, null, 8, ["open"])
        ], 8, Yb),
        e.action ? (r(), j(rr, {
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
          A(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", Jb, [
        h("div", Zb, [
          (r(!0), d(L, null, te(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, g(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, tk = /* @__PURE__ */ z(ek, [["__scopeId", "data-v-f2b4930d"]]), nk = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, ak = { class: "md inline" }, sk = ["disabled", "title", "onClick"], ok = {
  key: 1,
  class: "message-links-many"
}, lk = ["aria-expanded"], ik = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, rk = ["disabled", "onClick"], uk = { class: "row-pill message-links-chip" }, ck = { class: "message-links-title" }, dk = { key: 0 }, za = 3, fk = "task", mk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.total || n.links.length), o = x(() => n.links.every((p) => p.endpoint.model === fk) ? "tasks" : "items"), l = _(!1), i = _(null);
    ci(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Fe(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > za, three: s.value === za, open: l.value }]),
      "data-message-links": ""
    }, [
      A(It, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", nk, [
        h("span", ak, [
          y[1] || (y[1] = U("Linked: ", -1)),
          (r(!0), d(L, null, te(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (M) => m(b)
          }, [
            U(g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
            f(b) ? (r(), d(L, { key: 0 }, [
              U(" (" + g(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(L, { key: 1 }, [
              U(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, sk))), 128))
        ])
      ])) : k("", !0),
      s.value >= za ? (r(), d("span", ok, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          U(g(s.value) + " linked " + g(o.value) + " ", 1),
          A(Jt, { open: l.value }, null, 8, ["open"])
        ], 8, lk)
      ])) : k("", !0),
      l.value ? (r(), d("div", ik, [
        (r(!0), d(L, null, te(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (M) => m(b)
        }, [
          h("span", uk, g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
          h("span", ck, g(b.endpoint.title), 1),
          h("span", null, g(f(b)), 1),
          c(b) ? (r(), d("span", dk, "Unavailable")) : k("", !0)
        ], 8, rk))), 128))
      ])) : k("", !0),
      A(Sn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, hk = /* @__PURE__ */ z(mk, [["__scopeId", "data-v-843fc3bd"]]), pk = ["title", "aria-label"], vk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, gk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, yk = {
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
      (r(), d("svg", vk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", gk)) : k("", !0)
      ]))
    ], 10, pk));
  }
}, bk = /* @__PURE__ */ z(yk, [["__scopeId", "data-v-6dc92808"]]), kk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, wk = (e) => e.worker_id != null ? "report" : "message", $k = (e) => kk[wk(e)], xk = "img,pre,table";
function Sk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Mk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function _k(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(xk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Sk(Mk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Ck(e, t) {
  let n = null;
  const a = () => e.value && _k(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ne(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const Ek = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Ak(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Wn = /* @__PURE__ */ new WeakMap(), qe = "work", tt = "sent", Ok = 50, il = 50, rl = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function Tk(e) {
  var M;
  if (Wn.has(e)) return Wn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (C) => {
    var S;
    return ((S = e.visible) == null ? void 0 : S.value) !== !1 && [...C.views].some((T) => T.visible);
  };
  function o(C, S) {
    const T = C[S], H = ++T.version;
    return T.loading.value = !0, T.failure.value = "", H;
  }
  function l(C, S, T, H, W) {
    const I = C[S];
    if (t.get(C.id) !== C || I.version !== T) return;
    if (I.loading.value = !1, !W.ok) {
      I.failure.value = W.error;
      return;
    }
    const G = S === qe ? W.value.counterparts ?? [] : W.value.rows ?? [], q = H === 1 ? G : [...I.rows.value, ...G], E = S === qe ? (N) => `${N.endpoint.model}:${N.endpoint.id}` : (N) => N.id ?? N.target_id;
    I.rows.value = [...new Map(q.map((N) => [E(N), N])).values()], I.total.value = W.value.total ?? I.rows.value.length, I.next.value = W.value.next_page ?? null;
  }
  function i(C, S, T, H) {
    const W = C[S];
    W.version === T && (W.failure.value = H.message, W.loading.value = !1);
  }
  async function u(C, S, T) {
    const H = o(C, S), W = S === qe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(C, S, H, T, await e.read(`link list --source message:${C.id} ${W} --page ${T} --page-size ${S === qe ? 10 : 25}`));
    } catch (I) {
      i(C, S, H, I);
    }
  }
  async function c(C) {
    const S = C.map((T) => ({ [qe]: o(T, qe), [tt]: o(T, tt) }));
    try {
      const T = await e.read(`link receipts --messages ${C.map((H) => H.id).join(",")}`);
      C.forEach((H, W) => {
        const I = T.ok ? T.value.messages[String(H.id)] : null;
        l(H, qe, S[W][qe], 1, T.ok ? { ok: !0, value: I.named } : T), l(H, tt, S[W][tt], 1, T.ok ? { ok: !0, value: I.sent } : T);
      });
    } catch (T) {
      C.forEach((H, W) => [qe, tt].forEach((I) => i(H, I, S[W][I], T)));
    }
  }
  function f() {
    a = null;
    const C = [...n].map((S) => t.get(S)).filter((S) => S && s(S));
    n.clear(), C.forEach((S) => S.dirty.clear());
    for (let S = 0; S < C.length; S += il) c(C.slice(S, S + il));
  }
  function m(C, S = [qe, tt]) {
    for (const T of S) C.dirty.add(T);
    s(C) && (n.add(C.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(C) {
    const S = C.sources ?? (C.source_model && Number.isInteger(C.source_id) ? [{ model: C.source_model, id: C.source_id }] : []), T = C.link_types ?? (C.link_type ? [C.link_type] : []), H = T.length ? [qe, tt].filter((I) => I === qe ? T.some((G) => ["about", "edited"].includes(G)) : T.includes("sent_to")) : [qe, tt];
    if (!H.length) return;
    const W = S.length ? [...new Set(S.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, Ok);
    for (const I of W) m(I, H);
  }
  const y = (M = e.follow) == null ? void 0 : M.call(e, ["link.*"], p), b = {
    attach(C, S) {
      let T = t.get(C);
      return T || (T = { id: C, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([qe, tt]), work: rl(), sent: rl() }, t.set(C, T)), T.views.add(S), T.dirty.size && m(T, [...T.dirty]), T;
    },
    shown(C) {
      C.dirty.size && m(C, [...C.dirty]);
    },
    detach(C, S) {
      C.views.delete(S), C.views.size || t.delete(C.id), t.size || (clearTimeout(a), y == null || y(), Wn.delete(e));
    },
    more(C, S) {
      const T = C == null ? void 0 : C[S];
      if (T != null && T.next.value && !T.loading.value) return u(C, S, T.next.value);
    }
  };
  return Wn.set(e, b), b;
}
function Ik(e, t, n) {
  const a = nt(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Tk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = pe(n, (y) => {
      m == null || m.disconnect(), y && (m == null || m.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
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
    loadMore: () => s == null ? void 0 : s.more(a.value, qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, tt)
  };
}
const Bk = ["data-incoming", "data-ref"], Rk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Lk = { class: "message-body" }, Nk = ["title"], qk = ["innerHTML"], Dk = ["innerHTML"], Pk = {
  class: "message-faces",
  "data-message-faces": ""
}, jk = ["title", "data-face", "onClick"], Fk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Wk = ["title", "data-reaction", "onClick"], Hk = {
  key: 0,
  class: "message-reaction-count"
}, zk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Uk = ["href", "title"], Vk = ["src", "alt"], Gk = ["href"], Kk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Yk = { class: "message-foot" }, Qk = { class: "message-time" }, Xk = {
  class: "message-id",
  "data-message-id": ""
}, Jk = 1500, Zk = "An earlier message", ew = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = x(() => ["user", "comment"].includes(n.message.type)), i = x(() => {
      const [be, se] = (n.message.commented_row || ":").split(":"), Q = yt(be);
      return Q ? { ref: `${Q}:${se}`, label: `${Xt(Q).title.toLowerCase()} ${se}` } : null;
    }), u = x(() => n.message.worker_id ?? null), c = x(() => $k(n.message)), f = x(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var be;
      await ((be = navigator.clipboard) == null ? void 0 : be.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Jk);
    }
    const p = Di(), y = x(() => p(n.message.text ?? "")), b = x(() => JSON.parse(n.message.flowchart_edges || "[]")), M = _(!1), C = x(() => xs(n.quote)), S = x(() => p(C.value || Zk));
    function T() {
      const be = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      be ? be.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Ck(o, () => `${n.message.text} ${C.value}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (be) => `/api/files/message/${n.message.id}/${encodeURIComponent(be)}`, I = x(() => JSON.parse(n.message.captions || "{}")), G = x(() => (n.message.files ?? []).map((be) => ({ name: be, address: W(be), isImage: H.test(be), title: I.value[be] || be }))), q = x(() => Ki(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Me(Re, null), { links: N, total: D, more: w, loading: v, failure: $, sentTo: O, sentMore: R, sentLoading: F, sentFailure: V, loadMore: J, loadSent: oe } = Ik(E, () => l.value && !n.message.local ? n.message.id : null, o), ue = _(!1), ke = x(() => Ak(n.message.reactions));
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
      A(tk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (Q) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Bk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", Lk, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: se[5] || (se[5] = (...Q) => B(Pt) && B(Pt)(...Q))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: se[1] || (se[1] = $e((Q) => B(Fe)(i.value.ref), ["stop"]))
          }, [
            A(le, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + g(i.value.label), 1)
          ], 8, Nk)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(T, ["stop"]),
            innerHTML: S.value
          }, null, 8, qk)) : k("", !0),
          u.value !== null ? (r(), j(pn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: se[2] || (se[2] = $e((Q) => B(Fe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              U("Worker " + g(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Ii, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Dk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(L, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (Q) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (r(), j(Db, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (Q) => M.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: Y(["message-tools", { picking: ue.value }]),
          "data-message-tools": ""
        }, [
          ue.value ? (r(), d(L, { key: 0 }, [
            h("div", Pk, [
              (r(!0), d(L, null, te(B(Ek), (Q) => (r(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (he) => Oe(Q)
              }, g(Q), 9, jk))), 128))
            ]),
            h("button", {
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
      ke.value.length ? (r(), d("div", Fk, [
        (r(!0), d(L, null, te(ke.value, (Q) => (r(), d("button", {
          key: Q.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (he) => a("react", e.message, Q.emoji)
        }, [
          U(g(Q.emoji) + " ", 1),
          Q.count > 1 ? (r(), d("span", Hk, g(Q.count), 1)) : k("", !0)
        ], 10, Wk))), 128))
      ])) : k("", !0),
      G.value.length ? (r(), d("div", zk, [
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
            }, null, 8, Vk)
          ], 8, Uk)) : (r(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, g(Q.name), 9, Gk))
        ], 64))), 128))
      ])) : k("", !0),
      B(O).length ? (r(), d("div", Kk, [
        A(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(L, null, te(B(O), (Q) => (r(), j(pn, {
          key: Q.id,
          as: "button",
          "agent-id": Q.id,
          label: `Worker ${Q.id}`,
          class: "message-sent-worker",
          disabled: Q.unavailable || !Q.open_ref,
          "data-sent-worker": Q.id,
          onClick: $e((he) => Q.open_ref && B(Fe)(Q.open_ref), ["stop"])
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
      A(Sn, {
        more: B(R),
        loading: B(F),
        failure: B(V),
        label: "More recipients",
        onMore: B(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", Yk, [
        h("time", Qk, g(q.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(L, { key: 0 }, [
          se[10] || (se[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", Xk, "message " + g(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), j(bk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      B(N).length || B($) ? (r(), j(hk, {
        key: 3,
        links: B(N),
        total: B(D),
        more: B(w),
        loading: B(v),
        failure: B($),
        onMore: B(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Rk));
  }
}, GM = /* @__PURE__ */ z(ew, [["__scopeId", "data-v-95d3070e"]]), ra = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ua = 200, fr = (e) => {
  var t;
  return ((t = ra.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ra[0].key;
}, KM = (e) => {
  var t;
  return ((t = ra.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, tw = ["aria-label"], nw = 300, ul = 400, aw = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ua } },
  setup(e) {
    const t = e, n = x(() => fr(t.value)), a = x(() => n.value < Ua ? [1, 0.25, 0.25] : n.value === Ua ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= ul, high: n.value >= nw && n.value < ul }]),
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
    ], 10, tw));
  }
}, YM = /* @__PURE__ */ z(aw, [["__scopeId", "data-v-b10e610f"]]), mr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], QM = (e) => {
  const t = mr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, sw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, cl = (e) => sw[e.card.state] || "idle", ow = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), dl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, fl = (e, t) => dl[cl(e)] - dl[cl(t)], ml = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, XM = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => fl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || ow(a, s)) : [...e].sort((a, s) => fl(a, s) || (ml[t] || ml.state)(a, s)), lw = { class: "list-row" }, iw = {
  key: 0,
  class: "list-row-type"
}, rw = { class: "list-row-main" }, uw = {
  key: 0,
  class: "list-row-title"
}, cw = { class: "list-row-body" }, dw = {
  key: 1,
  class: "list-row-end"
}, fw = {
  key: 1,
  class: "list-row-text"
}, mw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", lw, [
      e.type ? (r(), d("span", iw, g(e.type), 1)) : k("", !0),
      h("div", rw, [
        e.title ? (r(), d("span", uw, g(e.title), 1)) : k("", !0),
        h("div", cw, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", dw, [
          re(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", fw, g(e.text), 1)) : k("", !0)
    ]));
  }
}, JM = /* @__PURE__ */ z(mw, [["__scopeId", "data-v-dfc8c3a7"]]), ZM = {
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
}, hw = {
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
}, Es = /* @__PURE__ */ z(hw, [["__scopeId", "data-v-978e0921"]]), pw = ["aria-label"], vw = { class: "head" }, gw = { class: "names" }, yw = { class: "body" }, bw = {
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
    return (u, c) => (r(), j(xn, { to: "body" }, [
      A(Yt, {
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
            onClick: c[0] || (c[0] = $e((...f) => B(o) && B(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(L, { key: 0 }, [
                h("header", vw, [
                  h("div", gw, [
                    h("h2", null, g(e.title), 1),
                    e.abstract ? (r(), j(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    re(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  re(u.$slots, "actions", {}, void 0, !0),
                  A(ba, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), j(Es, { key: 0 }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", yw, [
                  re(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), j(Es, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : re(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, pw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, e_ = /* @__PURE__ */ z(bw, [["__scopeId", "data-v-d0a677ef"]]), kw = {
  key: 1,
  class: "text-field-label"
}, ww = {
  key: 2,
  class: "text-field-end"
}, $w = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ht({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = dn(e, "modelValue"), a = va(), s = "onUpdate:modelValue" in (((f = gu()) == null ? void 0 : f.vnode.props) || {}), o = x(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = x(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = x(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = _(null);
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
      e.label ? (r(), d("span", kw, g(e.label), 1)) : k("", !0),
      _e(h("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(bs), o.value]
      ]),
      m.$slots.end ? (r(), d("span", ww, [
        re(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : _e((r(), d("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [B(bs), o.value]
    ]);
  }
}), t_ = /* @__PURE__ */ z($w, [["__scopeId", "data-v-d9c38ca8"]]), xw = { class: "title" }, Sw = { class: "state" }, Mw = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ms(t.line, t.events);
    return (o, l) => (r(), j(sb, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        h("span", xw, g(i.title), 1),
        h("span", Sw, g(B(mn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, n_ = /* @__PURE__ */ z(Mw, [["__scopeId", "data-v-6be0c59e"]]);
function _w(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Ne(() => clearInterval(a)), n;
}
const Va = _(Date.now() / 1e3);
let hl = 0, Hn = 0;
function fo() {
  return Hn || (Va.value = Date.now() / 1e3, hl = setInterval(() => Va.value = Date.now() / 1e3, 1e3)), Hn += 1, Vl() && ga(() => {
    Hn -= 1, Hn || clearInterval(hl);
  }), Va;
}
const Cw = 200, Ew = ur + Xn + cr + Cw, Aw = 300, zn = /* @__PURE__ */ new WeakMap();
function Ow(e, t) {
  const n = zn.get(e) ?? [];
  zn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = zn.get(e);
    zn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, Aw);
}
function en(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Tw(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: en(e),
    top: en(e.querySelector(".top")),
    title: en(e.querySelector(".title")),
    contents: en(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: en(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Iw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(Tw(o, l, n.value)), performance.now() - l < Ew) return void requestAnimationFrame(u);
        Ow(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const Bw = ["title", "data-figure-mark", "data-folded", "data-open"], Rw = {
  key: 2,
  class: "worker"
}, Lw = { class: "head" }, Nw = { key: 0 }, qw = {
  key: 3,
  class: "status"
}, Dw = {
  key: 0,
  class: "figure"
}, Pw = {
  key: 1,
  class: "ran-for"
}, jw = { key: 2 }, Fw = {
  key: 3,
  class: "news"
}, Ww = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Hw = {
  key: 6,
  class: "settled"
}, zw = {
  key: 1,
  class: "bar"
}, Uw = {
  key: 3,
  class: "detail body"
}, Vw = {
  key: 0,
  class: "body-label"
}, Gw = ["title"], Kw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = va(), a = ["onClick", "onAct"], s = x(() => Object.fromEntries(Object.entries(n).filter(([ue]) => !a.includes(ue)))), o = _(!1), l = x(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = x(() => t.open !== void 0), u = x(() => i.value || l.value), c = x(() => i.value ? t.open : o.value), f = x(() => i.value ? !t.open : l.value && !o.value), m = x(() => !!(t.mark.action && n.onAct)), p = x(() => u.value || m.value || !!n.onClick), y = _(null), b = _(null), { folded: M, phase: C } = dr(y, () => f.value);
    Iw(y, f, C, Me(Re, null));
    function S(ue) {
      var ke, Oe;
      if (!(ue.target !== y.value && !b.value.contains(ue.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, ue);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ue);
      }
    }
    const T = (ue) => n.onAct(ue), H = ["failed", "unfinished"], W = x(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), I = x(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = x(() => I.value || "var(--tone-work)"), q = x(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), E = fo(), N = x(
      () => t.mark.began_at && q.value && !t.mark.figure && !t.mark.counting ? Yi(E.value - t.mark.began_at) : ""
    ), D = x(() => {
      const { started: ue, ended: ke } = t.mark;
      return ue ? ke ? `ran ${nl(ke - ue, !0)}` : nl(E.value - ue, !0) : N.value;
    }), w = ["bad", "danger", "warn"], v = x(() => w.includes(W.value) || t.mark.asks ? "attention" : q.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], O = x(() => $.includes(W.value)), R = x(() => v.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), F = x(
      () => !!(t.mark.figure || D.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), V = x(() => t.mark.markIcon ? { component: It, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), J = x(() => [t.mark.title, t.mark.time ? Ki(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = x(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ue, ke) => (r(), d("div", Pe(s.value, {
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
      "data-folded": B(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: S
    }), [
      (r(), j(Qe(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), j(pn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), j(Qe(V.value.component), fs(Gl(V.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), j(Qe(V.value.component), fs(Pe({ key: 1 }, V.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", Rw, g(e.mark.worker), 1)) : k("", !0),
          h("span", Lw, [
            A(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", Nw, g(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), j(Jt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          F.value ? (r(), d("span", qw, [
            e.mark.figure ? (r(), d("span", Dw, g(e.mark.figure), 1)) : k("", !0),
            D.value ? (r(), d("span", Pw, g(D.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", jw, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", Fw, g(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (r(), d("span", Ww)) : R.value ? (r(), j(It, {
              key: 5,
              class: Y(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", Hw, g(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), j(rr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && q.value ? (r(), d("span", zw, [
        h("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !B(M) ? (r(), j(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !B(M) ? (r(), d("div", Uw, [
        e.mark.bodyLabel ? (r(), d("p", Vw, g(e.mark.bodyLabel), 1)) : k("", !0),
        A(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !B(M) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, g(e.mark.command), 9, Gw)) : k("", !0),
      e.mark.card ? (r(), j(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      re(ue.$slots, "default", {
        shown: !B(M)
      }, void 0, !0)
    ], 16, Bw));
  }
}), hr = /* @__PURE__ */ z(Kw, [["__scopeId", "data-v-6e839007"]]), Yw = 8, Qw = 40, Xw = [];
class mo {
  constructor(t, n, { top: a = Yw, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Xw.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new mo(t, {
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
    n > Qw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await We(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await We();
  }
}
const Jw = 60, Zw = 300, pr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function vr(e, t) {
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
  const c = new mo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Zw, more: () => a.value > 0, previous: u }, { top: Jw });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const e2 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function gr(e) {
  var n;
  const t = e2[e] || ((n = Xt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const t2 = (e) => gr(String(e).split(":")[0]), n2 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), a2 = "agents", s2 = { passed: "good", failed: "danger", warned: "warn", running: "" }, o2 = { good: "good", warn: "warn", danger: "danger" }, pl = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => ym(e.target_model, e.target_id || 0)
}, l2 = { "open row": (e) => t2(e.target_model), "open page": () => gr("pages") };
function i2(e, t) {
  const n = t || {}, a = pl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? s2[e.outcome] || "" : o2[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === a2 ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? l2[a](e) : "",
    handlers: a ? { onAct: () => pl[a](e) } : {}
  };
}
const r2 = 24, u2 = 1e3, vl = 2e3, c2 = 0.25, d2 = 5e3;
function f2(e, t = r2, n = () => !0) {
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
    const I = Date.now() - u < vl ? vl : u2;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(W = !1) {
    const I = c();
    I && W && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function M() {
    S(), !a.value && (a.value = !0, p(!0));
  }
  const C = () => !!c() && f() <= c().clientHeight * c2;
  function S() {
    clearTimeout(i), C() && (i = setTimeout(() => a.value && C() && n() && b(!0), d2));
  }
  function T() {
    m() ? y() : M();
  }
  function H(W = 1, I = !1) {
    a.value ? s.value += Math.max(0, W) : b(I);
  }
  return Vl() && ga(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: y, toBottom: b, left: M, scrolled: T, arrived: H };
}
const m2 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, h2 = (e) => String(e ?? "").replace(m2, ""), p2 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: u } = f2(s);
    pe(
      () => [n.lines, n.lines.length],
      () => We(() => {
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
      U(g(B(h2)(e.lines.join(`
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
}, v2 = /* @__PURE__ */ z(p2, [["__scopeId", "data-v-89621acd"]]), g2 = "*.*", y2 = {
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
    const t = e, n = Me(Re, null), a = new oi();
    pe(
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
      events: l.value ? [g2] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), j(or, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), j(sr, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, b2 = { class: "mark-more-inner" }, k2 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, w2 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, $2 = {
  key: 3,
  class: "mark-lines"
}, x2 = "process", gl = "task", S2 = {
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
    ), s = x(() => n2.has(t.mark.variant) && t.mark.detail || ""), o = x(() => t.mark.target_model === gl ? t.mark.target_id : 0), l = vr(
      pr(n),
      () => t.mark.target_id
    ), i = l.lines, u = _(!1), c = _(""), f = x(() => !t.declaration.body_url && t.mark.target_model === x2 && !!t.mark.target_id);
    async function m(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = x(() => t.shown && f.value);
    return pe(p, (y) => y && m()), Hs(() => p.value && m(), () => p.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && p.value && m(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
      }, ["stop"]))
    }, [
      h("div", b2, [
        e.declaration.body_url ? (r(), j(y2, {
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
            h("p", k2, g(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", w2, g(c.value), 1)) : f.value && u.value ? (r(), d(L, { key: 2 }, [
            b[3] || (b[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(v2, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", $2, g(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((M) => B(Fe)(`${gl}:${o.value}`), ["stop"]))
          }, " Open task " + g(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, As = /* @__PURE__ */ z(S2, [["__scopeId", "data-v-df71b15a"]]), M2 = ["title", "aria-label", "onClick"], _2 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, C2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = x(() => zf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = Me(Re);
    async function o(l) {
      const i = await Mn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(L, null, [
      (r(!0), d(L, null, te(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: $e((c) => o(u), ["stop"])
      }, [
        A(It, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, M2))), 128)),
      a.value ? (r(), d("span", _2, g(a.value), 1)) : k("", !0)
    ], 64));
  }
}, E2 = /* @__PURE__ */ z(C2, [["__scopeId", "data-v-7a62c88e"]]);
function yr(e, t) {
  const n = nt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const br = yr("/api/marks", "marks"), a_ = br.fetchAll, A2 = br.find, O2 = ["data-ref"], T2 = ["data-ref"], I2 = { class: "mark-row" }, B2 = "dock add", R2 = "questions.answer", L2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = x(() => A2(a.mark.type)), o = x(() => i2(a.mark, s.value)), l = x(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = x(() => l.value || !!o.value.handlers.onAct), u = x(() => a.mark.type === R2), c = _(!1);
    function f() {
      c.value = !c.value;
    }
    const m = x(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(B2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, M;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(As, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, O2)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (M = s.value) == null ? void 0 : M.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", I2, [
          A(hr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Ul({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: C }) => [
                A(As, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(E2, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, T2));
    };
  }
}, N2 = /* @__PURE__ */ z(L2, [["__scopeId", "data-v-424ddb61"]]), q2 = ["data-ref"], D2 = ["inert"], P2 = { class: "group-fold" }, j2 = { class: "thread-group" }, F2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    pe(n, async (i) => {
      var u;
      a.value = !0, await We(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
      A(hr, {
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
        h("div", P2, [
          h("div", j2, [
            (r(!0), d(L, null, te(e.group.marks, (c) => (r(), j(N2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, D2)) : k("", !0)
    ], 8, q2));
  }
}, s_ = /* @__PURE__ */ z(F2, [["__scopeId", "data-v-45b58b9b"]]);
function W2(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), st(() => n.disconnect()), t;
}
const H2 = { class: "chat-dock-fold" }, z2 = ["aria-label"], U2 = { class: "chat-dock-head" }, V2 = { class: "chat-dock-inner" }, G2 = { class: "chat-dock-foot" }, kr = 700, K2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = W2(a), o = _(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, kr)), st(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", H2, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          re(i.$slots, "edge", {}, void 0, !0),
          h("header", U2, [
            re(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", V2, [
              h("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ge(B(s) === null ? null : { height: `${B(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  re(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          re(i.$slots, "still", {}, void 0, !0),
          h("footer", G2, [
            re(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, z2)
      ])
    ], 2));
  }
}, Y2 = /* @__PURE__ */ z(K2, [["__scopeId", "data-v-cc05fdac"]]), Q2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ga = 5, X2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ga, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ga}s`, animationDelay: `${(n - Ga).toFixed(2)}s` };
    return (s, o) => (r(), d("span", Q2, [
      h("i", { style: a })
    ]));
  }
}, J2 = /* @__PURE__ */ z(X2, [["__scopeId", "data-v-2a7bc150"]]), Z2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Os = (e) => e.charAt(0).toUpperCase() + e.slice(1), e$ = (e) => Os(e.replace(/_at$/, "").replaceAll("_", " ")), t$ = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, n$ = (e, t, n) => [Os(`${e} ${n}`), (t == null ? void 0 : t.state) && Os(t.state)].filter(Boolean).join(" · "), wr = (e) => Vt(e).text, a$ = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? wr(t) : (e == null ? void 0 : e.name) ?? "", s$ = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? wr(t) : "", o$ = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Z2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: e$(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], l$ = { reviewing: "Under review" }, i$ = (e, t) => e || l$[t == null ? void 0 : t.state] || "", $r = yr("/api/docks", "docks"), o_ = $r.fetchAll, Dt = $r.find, r$ = 6, Ka = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ho = (e) => Date.parse(e.leaves_at) / 1e3, nn = (e) => !!(e.leaves_at && !e.kept), u$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!nn(e) || t < ho(e) || n.has(e.id)), c$ = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => u$(a, t, n)).sort((a, s) => a.id - s.id);
function d$(e, t, n = r$) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ho(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const f$ = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ts = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), m$ = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), h$ = (e) => ({ ...e.kept ? Ts("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ts("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), p$ = ["keep", "unkeep", "open", "undock"], v$ = (e) => ({ ...e, iconOnly: p$.includes(e.action) });
function g$(e, t) {
  var n;
  return [
    ...m$(e, t) ? [h$(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Xt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Ts("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(v$);
}
function xr(e, t) {
  const n = g$(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: f$(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const y$ = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || xr(e, t).title, b$ = { class: "dock-text" }, k$ = ["title"], w$ = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, $$ = {
  class: "dock-facts",
  "data-dock-facts": ""
}, x$ = {
  key: 1,
  "data-dock-row": ""
}, S$ = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = x(() => Dt(a.item.type)), o = fo(), l = x(() => Cn(a.item.created_at, o.value * 1e3)), i = _(null), u = _(null), c = _(null), f = _(null), m = x(() => xr(a.item, s.value)), p = ot(), y = x(() => `dock.${a.item.id}`), b = x(() => p.props[y.value].data.value), M = x(() => y$(a.item, s.value, b.value)), C = x(() => la(a.item.target_model ?? "")), S = x(() => {
      var v;
      return ((v = s.value) == null ? void 0 : v.word) ?? "";
    }), T = x(() => ({ ...b.value, id: a.item.target_id, term: C.value })), H = () => {
      var v, $;
      return (($ = (v = s.value) == null ? void 0 : v.reads) == null ? void 0 : $.length) && p.reload(y.value);
    };
    jc(js, { data: b, reload: H, readOutput: pr(p) }), pe(
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
      if (v.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      v.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, v.label])), I.value = "";
      const O = await Mn(v, { id: a.item.target_id }, p.environment);
      (O == null ? void 0 : O.ok) === !1 && (W.value = new Set([...W.value].filter((R) => R !== v.label)), I.value = `Could not ${v.label.toLowerCase()}: ${O.error}`);
    }
    const q = x(() => m.value.actions.filter((v) => !W.value.has(v.label))), E = x(() => {
      var v;
      return i$((v = s.value) == null ? void 0 : v.badge, T.value);
    }), N = x(() => m.value.controls), D = x(() => {
      var v;
      return !((v = s.value) != null && v.folds && a.folded);
    }), w = x(() => {
      var v;
      return !!((v = s.value) != null && v.draws_head) && !a.collapsed;
    });
    return (v, $) => {
      var O, R, F, V;
      return r(), j(Y2, {
        label: m.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (R = s.value) != null && R.needs_user ? "waiting" : "",
        folded: !!((F = s.value) != null && F.folds) && e.folded,
        body: !!((V = s.value) != null && V.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (J) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), j(J2, {
            key: 0,
            "ends-at": B(ho)(e.item)
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
              A(le, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", b$, [
                h("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: M.value
                }, g(M.value), 11, k$)
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
              onClick: $[0] || ($[0] = $e(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(L, null, te(N.value, (oe) => {
                var ue, ke;
                return r(), d(L, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ue = oe.variants) != null && ue.length) || !((ke = T.value) != null && ke.state) || oe.variants.includes(T.value.state)) ? (r(), j(ve, {
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
          I.value || e.refusal ? (r(), d("p", w$, g(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: P(() => {
          var J;
          return [
            h("span", $$, [
              E.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, g(E.value), 3)) : k("", !0),
              S.value ? (r(), d("span", x$, g(S.value) + " " + g(e.item.target_id), 1)) : k("", !0),
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
                A(Jt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = $e(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              D.value ? (r(), d(L, { key: 0 }, [
                A(to, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: B(p).environment,
                  "read-only": B(p).readOnly,
                  "object-name": B(la)(e.item.target_model),
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
}, yl = /* @__PURE__ */ z(S$, [["__scopeId", "data-v-4d692a2f"]]), M$ = 24, _$ = 8, l_ = 420;
function i_({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= M$ ? !0 : e < t && s > _$ ? !1 : null;
}
const C$ = (e, t) => e === void 0 ? t : e, E$ = { me: 1, people: [] }, ua = Kt({
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
  people: E$,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: aa("journal.activity", !0),
  wide: !1,
  sideMini: aa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ai("journal.activity", () => ua.activity);
Ai("journal.side.mini", () => ua.sideMini);
const Sr = "journal.viewer.";
function A$(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function O$(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function bl(e, t, n = window.localStorage) {
  const a = _(A$(e, t, n));
  return pe(a, (s) => O$(e, s, n), { deep: !0 }), a;
}
const T$ = {
  key: "dock-all",
  class: "dock-all"
}, I$ = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, v;
    const t = e, n = _w(500), a = _(/* @__PURE__ */ new Set()), s = Me(Re), o = _(/* @__PURE__ */ new Set()), l = _({});
    async function i($, O) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const R = await Mn(O, { id: $.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((F) => F !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = x(
      () => c$(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = x(
      () => d$(
        u.value.filter(($) => Ka($, Dt)),
        n.value
      )
    ), f = x(() => u.value.filter(($) => !c.value.includes($) && !Ka($, Dt))), m = bl(`dock-size:${((w = ua.identity) == null ? void 0 : w.root) || location.host}`, null), p = ($) => {
      var O;
      return !!((O = Dt($.type)) != null && O.needs_user);
    }, y = _(/* @__PURE__ */ new Set()), b = _(/* @__PURE__ */ new Set()), M = x(() => u.value.length === 1), C = ($) => p($) || M.value, S = ($) => C($) ? y.value.has($.id) || b.value.has($.id) : m.value ? m.value.collapsed && !m.value.opened.includes($.id) : t.collapsed, T = x(() => u.value.some(S));
    pe(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []);
    });
    function H() {
      const $ = !T.value;
      m.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var R;
      if (!S($)) return;
      if (C($)) {
        y.value = new Set([...y.value].filter((F) => F !== $.id)), b.value = new Set([...b.value].filter((F) => F !== $.id));
        return;
      }
      const O = (R = m.value) != null && R.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...O, $.id] };
    }
    const I = bl(`dock-folded:${((v = ua.identity) == null ? void 0 : v.root) || location.host}`, {}), G = ($) => {
      var O;
      return !!((O = Dt($.type)) != null && O.folds) && (t.insidesFolded || C$(I.value[$.id], Ka($, Dt) || t.folded));
    };
    function q($) {
      G($) && E($), I.value = { ...I.value, [$.id]: !G($) };
    }
    function E($) {
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
      duration: B(kr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", T$, [
          A(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: P(() => [
              A(Jt, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(L, null, te(f.value, (R) => (r(), j(yl, {
          key: R.id,
          item: R,
          class: Y({ timed: B(nn)(R) }),
          leaving: B(nn)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: S(R),
          refusal: l.value[R.id],
          onOpen: (F) => W(R),
          onFold: (F) => q(R),
          onUndock: (F) => i(R, F),
          onMouseenter: (F) => N(R),
          onMouseleave: (F) => D(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(L, null, te(c.value, (R) => (r(), j(yl, {
          key: R.id,
          item: R,
          class: Y({ timed: B(nn)(R) }),
          leaving: B(nn)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: S(R),
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
}, r_ = /* @__PURE__ */ z(I$, [["__scopeId", "data-v-ab76ae18"]]), Ct = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Jn = (e) => Math.min(Math.max(e, 0), 1), B$ = (e) => {
  const t = Jn(e);
  return t * t * (3 - 2 * t);
}, $t = (e, t, n) => B$((e - t) / (n - t));
function u_(e) {
  const t = Jn(e), n = Jn((t - 0.12) / 0.76) * Ct.shuffles, a = Math.min(Math.floor(n), Ct.shuffles - 1), s = n - a, o = $t(s, 0.26, 0.38) * (1 - $t(s, 0.76, 0.96)), l = $t(s, 0.38, 0.76), i = $t(t, 0, 0.12) * (1 - $t(t, 0.88, 1)), u = $t(s, 0.2, 0.34) * (1 - $t(s, 0.84, 1)), c = Math.sin(Math.PI * Jn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Ct.shuffles, lift: Ct.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function c_(e, t, n, a, s) {
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
}, d_ = (e) => kl[e] ?? kl.butler, po = 2400, R$ = 0.05;
function L$({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, R$), l = Math.min(t + po * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function f_(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function N$(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function m_(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const h_ = (e, t) => ({ ...e, stretch: t.stretch }), p_ = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Mr = (e, t) => t >= (e.least ?? 0);
function v_(e, t, n) {
  if (!Mr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const g_ = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), q$ = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", wl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), D$ = (e) => e.right > e.left && e.bottom > e.top;
function y_(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(q$)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = wl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = wl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), D$(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function _r(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[m] - e[f]) / y, M = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, M)), i = Math.min(i, Math.max(b, M));
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
}, gn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), P$ = (e) => e * e * (3 - 2 * e), Be = (e, [t, n]) => P$(gn(e, t, n)), j$ = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], gt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Un = ([e, t], n) => e + n() * (t - e);
function F$(e) {
  return j$.map(() => {
    const t = Un(gt.speed, e), n = Un(gt.angle, e) * Math.PI / 180, a = Un(gt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Un(gt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const W$ = F$(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function H$(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * gt.gravity * (t[2] - gt.floor))) / gt.gravity;
}
function b_(e, t, n = W$) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = H$(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= gt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const k_ = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function w_(e, t) {
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
const $_ = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Wt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function x_(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Wt.margin * n, t.right - Wt.margin * n], u = Math.min(Math.max(e + o + s * Wt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function S_(e, t, n) {
  const a = Ie.bug_smash, s = Be(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Wt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Wt.tall * n * (1 - Be(t, a.emerge)),
      turn: 90 * (1 - Be(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Be(t, a.gone)
    }
  };
}
function M_(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Wt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = L$({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const je = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function __(e) {
  const t = je.least + Math.floor(e() * (je.most - je.least + 1));
  return Array.from({ length: t }, () => ({
    wall: je.walls[Math.floor(e() * je.walls.length)],
    along: je.margin + e() * (1 - 2 * je.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Is(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * je.margin, l = ((e.along - je.margin + e.way * je.speed * n / a) / s % 2 + 2) % 2, i = je.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + je.inset, turn: 180 } : { x: e.wall === "left" ? t.left + je.inset : t.right - je.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function z$(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = N$(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function C_(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = z$(n, e.length), c = e.map((S, T) => ({ ...Is(S, t, Math.min(n / o.fps, Zn(T).shot)), shot: T < u })), f = Be(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((S, T) => ({ bug: S, index: T, seconds: n / o.fps - Zn(T).shot, spot: Is(S, t, Zn(T).shot) })).filter((S) => S.seconds >= 0), b = y.flatMap((S) => {
    const T = (s == null ? void 0 : s.get(S.index)) ?? Y$(S.bug, t, S.spot, s ? [] : a);
    return s == null || s.set(S.index, T), s && Q$(T, S.seconds, a), X$(T, S.seconds, a);
  }), M = y.filter((S) => G$(S.bug)).map((S) => ({ seconds: S.seconds, from: S.spot })), C = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: C }, slush: b, camera: M };
}
function Zn(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function E_(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = Zn(f), p = Is(c, t, m.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), M = Math.abs(p.x - u) >= y ? u : p.x + b * y, C = b > 0 ? Math.max(u, Math.min(M, i)) : Math.min(u, Math.max(M, l)), S = { from: u, to: C, begin: m.walk, end: m.aim };
    return u = C, S;
  });
}
function A_(e, t, n) {
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
const Ee = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, U$ = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function V$(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const G$ = (e) => e.along * 97 % 1 < Ee.camera, yn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ee.gravity * t * t });
function K$(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ee.gravity * (t.bottom - e.from.y))) / Ee.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ee.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ee.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ee.step) {
    const f = Math.min(c + Ee.step, l.t), m = yn(e, f), p = _r(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = yn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function Y$(e, t, n, a = []) {
  const s = V$(e.along + 1), [o, l] = U$[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ee.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ee.spread * Math.PI / 180), c = Ee.speed[0] + s() * (Ee.speed[1] - Ee.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ee.radius[0] + s() * (Ee.radius[1] - Ee.radius[0]) };
    return { ...f, ...K$(f, t, a) };
  });
}
function Q$(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ee.step) {
      const l = Math.min(o + Ee.step, s), i = _r(yn(a, o), yn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function X$(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...yn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ee.hold) / Ee.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function O_(e, t, n, a) {
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
function T_(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (M) => {
    const [C, S] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + C * c - S * f, y: i.y + C * f + S * c };
  }, [p, y] = [...n].sort((M, C) => M.x - C.x), b = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((M, C) => ({ from: M, to: C < b.length / 2 ? p : y })) };
}
const I_ = (e, t) => Be(t, e.grows) * (1 - Be(t, e.sinks));
function ca(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: gn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: gn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function B_(e, t) {
  const n = Ie[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ca(n, t), l = 1 - (1 - n.small) * Be(a, n.shrinks) * (1 - Be(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ca(n, t), o = n.flat * Be(a, n.squashes) * (1 - Be(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * gn(s, ...n.springs)) * (1 - gn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const R_ = (e) => e === "pack_box";
function L_(e) {
  const { into: t, out: n } = ca(Ie.rope_swing, e);
  return 1 - Be(t, [0, 1]) * (1 - Be(n, [0, 1]));
}
function N_(e) {
  const t = Ie.rope_swing, { into: n, out: a } = ca(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Be(n, [0, 1]) * (1 - Be(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const J$ = { after: 3 }, vo = 10, Z$ = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, e5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, t5 = { weight: 19 }, Cr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, n5 = { every: 120 }, Er = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Ar = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, a5 = {
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
}, An = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: vo }), ie = (e, t, n = {}) => An(e, "clip", t, n), Ya = (e, t, n = {}) => An(e, "look", t, n), $l = (e, t, n = {}) => An(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...An(e, "pick", t, n), ...a }), xe = (e) => An("nothing", "nothing", e, {}), s5 = 120, o5 = 300, Qa = (e, t) => ({ ...ie(e, t), cooldown: o5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), l5 = () => [ie("joy", 2)], xt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), St = (e) => ({ ...e, cooldown: Z$[e.name] }), tn = (e) => ({ ...e, shenanigan: !0, lasts: e5[e.name] }), xa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), xe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...St(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...St(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), xe(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), xe(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [ie("halo", 1), xe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [ie("repent", 1), xe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), xe(7)]),
  ...fe("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), xe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [$l("read", 3), ie("nod", 1), xe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [$l("read", 3), xe(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), xe(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), xe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, l5()),
  ...fe("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), xe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [ie("tumble", 3), xe(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), xe(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), xe(2)]),
  ...fe("refused", { cooldown: 20 }, [ie("shake", 1), xe(1)]),
  ...fe("work_done", { cooldown: 120 }, [ie("stretch", 2), xe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Ya("amused", 3), xe(2)]),
  ...fe("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    xe(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [ie("stumble", 3), xe(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), xe(13)]),
  ...fe("typing", { cooldown: 60 }, [Ya("reading", 1), xe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(a5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Ya(t, 1)])),
  ...Object.entries(Er).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Ar).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [ie(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    xt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    xt("rest", 3, 180, 120),
    xt("yawn", 2, 60, 60),
    xt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    xt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    xt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    xt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...tn(St(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    tn(St(ie("disco", 2, { ball: "bubble" }))),
    xe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: s5 }, [Qa("search", 3), { ...Qa("binoculars", 2), when: { home: !0 } }, { ...Qa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...fe("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), xe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...St(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [ie("eager", 2, { slow: !0 }), xe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [tn(St(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: Cr.build.cooldown }, [ye("unit", t5.weight), xe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: n5.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    tn(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    tn(St(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Or = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Tr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), i5 = (e) => Array.isArray(e) ? e[0] : e, r5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, u5 = (e) => xa.some((t) => t.when.moment === e);
function c5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Tr(f).every(([m, p]) => n(m) >= i5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = xa.filter((f) => Or(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= J$.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Xe(e, t) {
  const n = c5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Tr(t)) (a = e.memory) == null || a.set(s, e.now + r5(o, n));
}
function q_(e, t, n) {
  Ir(e, xa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const D_ = (e) => Object.values(Cr).find((t) => Or(t.when, e)) ?? null, d5 = (e, t, n) => n - t <= (e.lifetime ?? vo), P_ = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Mr(e.clip, t));
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
}, j_ = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Rr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), F_ = {
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
}, W_ = 120, f5 = 20, H_ = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < f5), m5 = (e) => Bs[e] || Bs.idle, z_ = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Lr = "airborne", h5 = "landing", p5 = "travelling", Nr = "grounded", U_ = ({ airborne: e, landing: t, trip: n }) => e ? Lr : t ? h5 : n != null && n.started ? p5 : Nr;
function V_(e, t) {
  var s;
  const n = v5(e, t);
  return e.mode === Nr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function v5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === Lr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...g5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : m5(c), facing: y ? p : i.posture === "sit" ? i.face : m };
}
function g5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Rs = (e) => e.outcome, y5 = /^plugin:[^:]+:sins:/, xl = (e) => e.type === "plugins.card" && y5.test(e.markKey), b5 = [
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
], G_ = (e, t) => e.filter((n) => n.author === "user" && ia(n.read_at) > t).map((n) => ({ beat: "read_message", time: ia(n.read_at), card: Fi(n) })).sort((n, a) => n.time - a.time), Sl = { user: "reacted", agent: "agent_reacted" };
function K_(e, t) {
  return e.filter((n) => Sl[n.author] && Ot(n) > t).map((n) => ({ beat: `${Sl[n.author]}:${n.emoji}`, time: Ot(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const k5 = [.../* @__PURE__ */ new Set([...Object.values(Er).flatMap((e) => Object.keys(e)), ...Object.keys(Ar)])];
function Y_(e, t) {
  return e.filter((n) => n.author === "agent" && Ot(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = k5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ot(n), card: Fi(n) })).sort((n, a) => n.time - a.time);
}
const w5 = (e) => new Br(e).isTest(), da = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Rs(e)] || "";
}, $5 = 1800, x5 = (e, t) => {
  if (da(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && da(n) !== "finished" && Number(e.time) - Number(n.time) <= $5 ? "tests_fixed" : "tests_passed";
};
function Q_(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(w5), s = a.filter((i) => da(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, da(i))), o.map((i) => ({ beat: x5(i, s), time: Number(i.time), card: i.key }));
}
function X_(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Rs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Rs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const J_ = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Ot(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function Z_(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function eC(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function tC(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = b5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function go(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Ml = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function S5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    go(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function nC(e, t, n, a = {}) {
  const s = Xe({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : u5(`held:${e}`) ? "idle" : e;
}
const De = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function aC(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < De.ahead * n ? 180 : Math.sign(a) * De.turn;
}
const _l = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function sC(e, t) {
  const n = Math.min(De.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(De.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(De.lines, Math.floor((e.bottom - e.top - 2 * a) / De.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / De.sweep) % s, i = o % De.sweep, u = De.sweep - De.returnSeconds, c = _l((i - u) / De.returnSeconds), f = i <= u ? _l(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * De.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Cl = 3, qr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, El = 12, oC = (e, t) => ({ mood: e, began: t, seen: 0 });
function lC(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!qr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Cl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * El) / El, lasts: Cl } };
}
const iC = (e) => e.posture === "hang" && !qr(e.face), M5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), _5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function rC(e, t, n) {
  return M5.has(e) ? 1 / 0 : !_5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Dr(n - t.began, t.share) - ut.lead, 0);
}
const C5 = 5;
function uC(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= C5 ? { beat: "long_walk", time: n } : null };
}
const E5 = 30, Vn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function cC(e, t, n, a, s = null) {
  if (t && n < t.until || !Vn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Xe({ moment: "spell", state: e, tally: s }, a), [l, i] = Vn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Vn.every } : { state: e, began: 0, until: 0, next: n + Vn.every };
}
const dC = (e, t, n) => t && n < t.until && Rr.has(e.state) ? { state: t.state, since: t.began } : e, ut = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Dr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function fC(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Dr(o, e.share);
  return s ? { eager: A5(t, l), moment: null } : l > ut.lead ? { eager: t, moment: null } : l < ut.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ut.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ut.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Xe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function A5(e, t) {
  return e.on && t > ut.lead + ut.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ut.lead && t >= ut.least ? { ...e, on: !0, calm: !1 } : e;
}
const O5 = 1, T5 = { look: "look", gaze: "gaze" };
function I5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Xe({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [T5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const B5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Xe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), R5 = (e, t, n, a, s, o = 0) => Xe({ moment: "jump", high: e > O5 * t, memory: a, now: s, room: o }, n).name === "backflip", L5 = { work: ["building"], idle: ["standing"] };
function mC(e, t, n, a) {
  const s = Bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(L5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Rr.has(e) ? { moments: o, began: n || a } : (n && a - n >= E5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function N5(e, t, n) {
  return !Xe({ moment: "pondering", memory: e, now: t }, n) || !Xe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Xe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Al = { pondering: N5 };
function hC(e, t, n, a, s, o) {
  if (Al[e.beat]) {
    const i = Al[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = I5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== vo && { lifetime: l.lifetime } } } : null;
}
function pC(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = B5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const vC = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function gC(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function yC(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const bC = (e, t) => !!(e != null && e.watches) && !t.once, kC = 10, wC = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || d5(a, a.queuedAt, n)), $C = (e, t) => t ? null : e[0] ?? null;
function xC(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const SC = (e, t) => !t.during || !e.some((n) => n.during === t.during), q5 = 2 * Math.PI, D5 = 500;
function MC(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / D5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = q5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? j5(y, t, n, p, s) : W5(y, t, n, p) : t) ?? y, C = M != null && M.behind && M.mood === "reading" ? P5(e.point, M, n, l, s) : M;
  return { point: C ?? null, toward: C ? { x: C.x - n.x, y: C.y - n.y } : null, amount: m, at: a };
}
function P5(e, t, n, a, s) {
  const o = (N) => N * 180 / Math.PI, l = (N) => o(Math.atan2(Math.sin(N * Math.PI / 180), Math.cos(N * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, y = m ? e.readingYaw + p : f, b = y + l(c - y), M = Math.min(Math.max(a / 1e3, 0), 0.1), C = De.turnSpeed * M, S = m ? y + Math.min(Math.max(b - y, -C), C) : b, T = m ? e.readingFollow + p : S, H = T + (S - T) * (1 - Math.exp(-M / De.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(go(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(I, -W.up), W.down), q = De.tipSpeed * M, E = m ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -q), q) : G;
  return { ...t, readingYaw: S, readingFollow: H, readingPitch: E, readingFacing: i };
}
function j5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: H, pitch: W } = go(T.x - n.x, s, n.y - T.y, o);
    return { yaw: H, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Ml(i(e)), Ml(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, y] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [b, M, C] = u.map((T, H) => p * T + y * c[H]), S = s * b / M;
  return { ...t, x: n.x + S, y: n.y - S5(S, s, -Math.asin(Math.min(Math.max(C, -1), 1)), o) };
}
const F5 = 0.15;
function _C(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= F5;
}
function W5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const H5 = (e) => !(e != null && e.on);
function CC(e, t, n) {
  if (H5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const bn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, lt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Xa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ol = (e) => e * e * (3 - 2 * e);
function z5(e) {
  if (e < 0 || e >= lt.seconds) return null;
  const t = Xa(e, ...lt.flicker), n = Math.floor(t * lt.flickers * 2) % 2 === 0, a = e < lt.flicker[1] ? n ? 0.35 + 0.5 * t : lt.dim : 1;
  return { strength: 1 - Ol(Xa(e, ...lt.fade)), lit: a, white: e < lt.flash[0] ? 0 : 1 - Ol(Xa(e, ...lt.flash)) };
}
const EC = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function AC(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = z5(t - e.at);
  return a && { colour: bn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: lt.signs[e.tone], ...a } };
}
function OC(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function TC(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= bn.looks || a === null && n - e.since >= bn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function IC(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const vt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, BC = { behind: 39, figure: 40, ahead: 41 }, U5 = "[data-figure-pile]", V5 = { amber: [1, 0.69, 0.125], good: bn.colours.good, bad: bn.colours.bad }, ea = { phases: 4, ms: 230, dim: 0.25 }, RC = (e, t, n) => e !== "amber" || (t + n) % ea.phases < ea.phases / 2 ? 1 : ea.dim, LC = (e) => e === "amber" ? ea.phases : 1;
function NC(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const qC = Object.keys(V5), et = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, an = ([e, t], n) => e + n() * (t - e);
function DC(e) {
  const t = et.least + Math.floor(e() * (et.most - et.least + 1));
  return Array.from({ length: Math.min(t, et.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * et.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = an(et.start, e), l = an(et.reach, e);
    return {
      text: Xe({ moment: "digit" }, e).name,
      x: a * o,
      y: et.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(an(et.moveMs, e)),
      fadeMs: Math.round(an(et.fadeMs, e))
    };
  });
}
const Ja = { high: 3, gap: 1 };
function PC(e) {
  const t = Math.floor(e / Ja.high);
  return { left: -(vt.inside + vt.width / 2 + t * (vt.width + Ja.gap)), up: e % Ja.high * (vt.height - vt.top) };
}
const G5 = (e, t, n) => Xe({ moment: "unit", memory: e, now: t }, n) !== null, K5 = { after: 5 }, Y5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function jC(e, t, n) {
  const a = Y5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= K5.after ? s : null;
}
function FC(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: G5(n, a, s) } : null;
}
const Tl = { ahead: 140, up: 70 };
function WC(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Tl.ahead, y: a - Tl.up } } : o ? { at: { x: n(o), y: a - o.up - vt.height } } : t ? { at: null } : null;
}
const Za = { least: 4e3, most: 1e4 }, Q5 = (e) => Za.least + e() * (Za.most - Za.least), Mt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function HC(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Q5(t);
    if (n.length >= Mt.most || t() >= Mt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Mt.at[0] + t() * (Mt.at[1] - Mt.at[0]));
    n.push({ from: o, to: o + Mt.ms }), a = o + Mt.ms;
  }
}
const zC = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), UC = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), VC = new Set(xa.filter((e) => Pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), X5 = (e) => e.some((t) => t.state === "built"), GC = (e, t) => X5(t) ? e.filter((n) => !Pr.has(n.beat)) : e, bt = { reach: 40, room: 6 }, J5 = (e, t) => t <= e - bt.reach + 2, KC = (e, t, n) => J5(e, n) ? t - bt.reach : e - bt.reach - bt.room, YC = (e, t, n, a) => a > 0 && t < e && t + bt.reach >= e - 2 ? Math.min(n, Math.max(e, t + bt.reach)) : e, es = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, QC = (e) => an(e() < es.longShare ? es.long : es.short, e), Z5 = 2 * vt.width;
function XC(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Z5 ? o : e + (o - e + s / 2) % s;
}
const e4 = 60, JC = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= e4, Il = "[data-figure-home]", On = () => {
  var t;
  const e = document.querySelector(Il);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Il)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, t4 = "[data-figure-docked-bars]", n4 = "[data-figure-chat-foot]", a4 = [0.85, 0.6, 0.35, 0.15], s4 = ["question", "waiting", "suggestion"], ZC = (e, t) => s4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function eE() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const o4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", l4 = "[data-figure-newest]";
function jr() {
  var a, s;
  const e = (a = On()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(l4), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !yo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function kn(e, t, n = jr()) {
  if (!e || !n) return !0;
  const a = ft(e, t), s = Ma(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Le.top * t.size, bottom: a.top + Le.bottom * t.size }, l = Ct.gap;
  return !Sa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function tE(e, t, n, a = jr()) {
  if (!a || kn(t, e, a)) return null;
  const s = Ma(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Rt(), u = t.posture === "stand" ? ko * e.size : Kr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Ct.gap - l, a.right + Ct.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && kn(p, e, a) && L4(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ts = 0.26, Fr = 0.54, i4 = 1.25 / 5.4, Tn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ts, travels: "stand" },
  lounge: { drop: ts, travels: "stand" },
  composed: { drop: ts, travels: "stand" },
  hang: { drop: Fr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, nE = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * i4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fr
}), ln = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), r4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), aE = (e, t) => (e === "sit" ? r4.has(t) : ln.has(e)) ? e : "stand";
function sE(e, t) {
  return e.facing === t.facing || !ln.has(e.posture) && !ln.has(t.posture) ? t : { posture: "stand", facing: ln.has(e.posture) ? e.facing : t.facing };
}
const oE = 0.25, lE = (e, t) => ln.has(e) && Tn[t].drop === 0, Wr = 2, u4 = 90, c4 = 180, d4 = 140, f4 = 280, m4 = 420, h4 = 0.25, p4 = 290, v4 = 600, g4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", y4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ns = 5;
function fa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ns) return null;
  (l || i) && (o = Math.max(o, Wr));
  const y = o > 1, b = Math.abs(t.x - e.x), M = b < ns ? 0 : b / (u4 * o) * 1e3, C = Math.min(M, y ? d4 : c4), S = Math.abs(t.y - e.y), T = t.y < e.y, H = T && !p && R5(S, n, u, c, f, m), W = T ? m4 + Math.min(S, 400) * h4 : Math.sqrt(2 * S / po) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: S > ns ? H ? v4 : W : 0,
    lead: H ? p4 : T ? f4 : 0,
    easing: T ? g4 : y4,
    hopping: !0,
    clip: H ? "backflip" : T ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: M + C, lead: 0, easing: "linear", ramp: C, ...y ? { clip: "run" } : {} }, q = p ? b4(t, n) : I, E = T && !a ? [{ ...G, y: e.y }, q] : [{ ...I, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: y };
}
const b4 = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), k4 = (e, t) => e.postures.includes(t) ? t : e.postures[0], iE = (e, t, n) => e.posture === "walk" && n ? "walk" : k4(e.clip, t), ft = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Tn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Sa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, yo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Rt() {
  var t;
  const e = (t = On()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Gn = 0.5, Bl = 20;
function rE(e, t, n = Rt()) {
  const a = ft(e, t);
  return a.left >= n.left + Bl && a.right <= n.right - Bl;
}
function bo(e, t, n = Rt()) {
  const a = ft(e, t), s = a.right - a.left, o = Ma(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Gn && i <= n.right + Gn && a.top >= n.top - Gn && u <= n.bottom + Gn;
}
const ma = [0.35, 0.5, 0.65], ha = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Le = { left: ma[0], right: ma.at(-1), top: ha[0], bottom: ha.at(-1) }, w4 = 0.24;
function Ma(e) {
  if (e.posture === "stand") return { left: Le.left, right: Le.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + w4 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Le.left, t), right: Math.max(Le.right, t) };
}
function $4(e, { size: t }, n = Rt()) {
  const a = Ma(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const ko = (Le.right - Le.left) / 2 + 0.08;
function uE(e, t) {
  return e === "hang" ? Le : { ...Le, bottom: Math.min(Le.bottom, 1 - t - Tn[e].drop) };
}
const x4 = "[data-figure-agent]";
function Hr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !yo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => ha.flatMap(
  (t) => ma.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function wo(e, t, n = "") {
  if (!kn(e, t)) return ma.length * ha.length;
  const a = ft(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(o4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Sa(s, u) && yo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return zr(s).filter(([i, u]) => l(i, u) || Hr(i, u, n)).length;
}
function S4(e, t) {
  const n = ft(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Hr(a, s, "", x4)).length;
}
const Rl = 4;
function cE(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Rl; o <= s; o += Rl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!S4(i, e) && kn(i, e)) return i;
    }
  return null;
}
function wn(e, t, n) {
  const a = Rt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => bo(l, t, a) && kn(l, t)).map((l) => ({ spot: l, covered: wo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Ur = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), M4 = [0.5, 0.25, 0.75], _4 = (e) => Ur(e.getBoundingClientRect(), M4), Vr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, C4 = ko, E4 = (e, t, { size: n }, a = C4) => Gr(e, Vr[t], a * n, "stand");
function Gr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const A4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Kr = 0.1, O4 = (e, t, { size: n }) => Gr(e, A4[t], Kr * n, "sit"), T4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, as = 60;
function dE(e, t) {
  const n = T4(t);
  return !e.aside || Math.abs(n) >= as ? t : n < 0 ? 360 - as : as;
}
const rn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, I4 = (e) => [.../* @__PURE__ */ new Set([e, ...rn.turns.map((t) => (t + 360) % 360)])];
function fE(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = I4(t), l = rn.every[0] + a() * (rn.every[1] - rn.every[0]);
  return { face: t, from: s ? B4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function B4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / rn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function mE(e, t) {
  const { element: n, edge: a } = _a(), s = ["left", "right"].map((i) => In(O4(a, i, e), e)).filter((i) => n && bo(i, e) && !wo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function hE(e, t, { size: n }) {
  const a = (Le.right - Le.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Yr } : e;
}
const Yr = 7;
function Qr() {
  const e = [...document.querySelectorAll(U5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function R4(e, t) {
  const n = ft(e, t), a = n.right - n.left;
  return { left: n.left + Le.left * a, right: n.left + Le.right * a, top: n.top + Le.top * a, bottom: n.bottom };
}
function L4(e, t) {
  const n = Qr();
  return !n || !Sa(R4(e, t), n);
}
const N4 = 4;
function _a() {
  const e = Bn(), t = Qr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > N4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yr - n, 0) } };
}
const pE = ({ size: e, below: t }) => (1 - t) * e;
function In(e, t) {
  const n = Rt(), { size: a, below: s } = t, o = Tn[e.posture].drop * a;
  return { ...$4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ls = (e, t) => Object.keys(Vr).map((n) => In(E4(e, n, t), t)), $o = (e, t) => Ur(e, a4).map((n) => In(n, t)), Xr = (e, t, n) => wn(e, t, n) ?? e[0];
function vE(e, t) {
  const { element: n, edge: a } = _a();
  return { ...Xr(Ls(a, e), e, t), view: null, on: n };
}
function gE(e, t, n, a) {
  const { element: s, edge: o } = _a(), l = (a ? Ls(o, t) : [...Ls(o, t), ...$o(o, t)]).filter(
    (c) => !Sa(ft(c, t), e)
  ), i = wn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !wo(i, t) ? i : wn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Bn() {
  var a;
  const e = On(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(t4);
  if (!t) return { ...Ca(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ll = { within: 2 };
function yE(e) {
  const { element: t, docked: n, edge: a } = Bn();
  if (!n || e.on !== t) return !0;
  const s = Ca().edge;
  return a.left > s.left + Ll.within || a.left + a.width < s.left + s.width - Ll.within;
}
const q4 = "[data-figure-closing]";
function bE() {
  var n;
  const { element: e, docked: t } = Bn();
  return t && !!((n = e.firstElementChild) != null && n.matches(q4));
}
const Jr = "[data-figure-progress]";
function kE(e) {
  const t = e.querySelector(Jr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function wE(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const D4 = { across: 300, above: 380, below: 60 };
function $E(e) {
  const { across: t, above: n, below: a } = D4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: P4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const P4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Zr = "[data-figure-bar]", Ns = { back: 144, along: 0.4 };
function xE(e) {
  const { element: t, docked: n, edge: a } = Bn(), s = n ? t.querySelector(Zr) : null;
  if (!(s != null && s.querySelector(Jr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...In({ x: o - Ns.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function SE(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ns.along * a.size ? t.x + Ns.along * a.size : e.x, y: e.y, behind: !0 };
}
function ME(e) {
  const t = e.querySelector(Zr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ca() {
  const e = On();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function _E(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ca(), u = n === null ? j4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : In({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function j4(e, t, n, a, s) {
  const o = $o(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + vt.width < s && u.x + a - bt.reach - bt.room >= l);
  return wn(i.length ? i : o, t, n);
}
const F4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function CE(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Wr));
  const y = (H) => {
    const W = ft(H, n, Tn[H.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return W4(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [M, ...C] = [e, ...u, t].map(y), S = fa(M, C[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), T = C.slice(1).map((H, W) => {
    var I;
    return (I = fa(C[W], H, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : I.legs.find((G) => G.hopping);
  });
  return S && { ...S, legs: [...S.legs, ...T.filter(Boolean)] };
}
function W4(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / F4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? fa(e, n, o.size, { pace: l }) : fa(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function EE(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function AE(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && wn(_4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = _a();
  return { ...Xr($o(s, t), t, n), view: null, on: a };
}
const H4 = "[data-figure-bubble]", z4 = 250;
let un = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), eu = 0;
const Zt = () => un, ss = /* @__PURE__ */ new WeakMap();
let U4 = 0;
function xo(e) {
  return ss.has(e) || ss.set(e, `floor-${++U4}`), ss.get(e);
}
const V4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, G4 = () => {
  var e, t;
  return ((t = (e = On()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function K4(e, t) {
  var a;
  const n = (a = e.querySelector(n4)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Y4(e, t) {
  const n = e && K4(e, t), a = e ? [...e.querySelectorAll(H4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || V4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: xo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Q4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= z4 ? (t.top - a.top) / s * 1e3 : 0;
};
function tu(e = un, t = performance.now()) {
  const n = Rt(), a = G4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Bn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ca();
  return c.element && u.push({ id: xo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...Y4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: Q4(e, f, t) }))) });
}
const qs = /* @__PURE__ */ new Set();
function X4(e) {
  return qs.add(e), () => qs.delete(e);
}
function J4() {
  nu();
  const e = () => {
    eu = requestAnimationFrame(e), !document.hidden && (un = tu(un), qs.forEach((t) => t(un)));
  };
  e();
}
function nu() {
  cancelAnimationFrame(eu);
}
const So = 5, Z4 = 56, ex = { share: 0.6 }, tx = (e) => -Math.sqrt(2 * po * ex.share * e), Gt = (e, t) => e.find((n) => n.id === t) ?? null;
function OE(e, t = tu().floors) {
  const n = Gt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : xo(e.on) : null, o = s && Gt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function au({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Zt().floors) {
  const c = Gt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || nx(c, f, o)) && ax(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Mo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, nx = (e, t, n) => !Mo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function TE(e, t = Zt().floors) {
  if (!Mo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= So && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function ax(e, t, n = Zt().floors) {
  const a = Gt(n, "home");
  return e.posture === "hang" && a && ft(e, t).bottom >= a.top ? !1 : bo(e, t);
}
function IE(e, t, n, a = Zt().floors) {
  const s = au(e, n, a);
  if (!e.home) return sx(e, t, s, a);
  if (!s) return null;
  const o = Gt(a, "home"), l = s.y - t.y, i = l > So ? "dropping" : -l > Z4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function sx(e, t, n, a) {
  const s = n ? Gt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: tx(e.risen) };
  if (!n) return null;
  if (Mo(t) && n.y - t.y > So) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function BE(e, t, n) {
  const a = ko * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function RE(e, t, n, a = Zt().floors) {
  const s = t && au(t, n, a);
  return s ? { ...e, ...s } : e;
}
const ox = ["data-type"], lx = { class: "figure-floor-name" }, ix = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", lx, g(e.floor.type), 1)
    ], 12, ox));
  }
}, rx = /* @__PURE__ */ z(ix, [["__scopeId", "data-v-4e0f1e2e"]]), ux = {
  class: "figure-floors",
  "aria-hidden": "true"
}, cx = {
  __name: "FigureFloors",
  setup(e) {
    const t = nt(Zt().floors);
    let n = () => {
    };
    return Ce(() => {
      n = X4((a) => t.value = a.floors), J4();
    }), Ne(() => {
      n(), nu();
    }), (a, s) => (r(), d("div", ux, [
      (r(!0), d(L, null, te(t.value, (o) => (r(), j(rx, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, LE = /* @__PURE__ */ z(cx, [["__scopeId", "data-v-e519168b"]]), cn = (e) => typeof e == "number" ? e : Date.parse(e);
function NE(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: cn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => cn(s.row.created_at) - cn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Nl = 20;
async function qE(e, t, n) {
  for (let a = 0; a < Nl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || cn(o.created_at) <= cn(s.created_at) || !await n()) return a;
  }
  return Nl;
}
const dx = 3, os = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function fx(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = os[n.grouping]) == null ? void 0 : a.call(os, e.row, n)) || "";
}
function mx(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function DE(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= dx ? [mx(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = fx(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function hx(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const PE = (e) => (t) => t.filter((n) => n.id !== e), jE = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), FE = (e) => (t) => [...t, e], WE = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function HE(e, t = {}) {
  const n = ot(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function zE(e) {
  const t = ot(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Kn = /* @__PURE__ */ new Map();
function px(e, t) {
  if (Kn.has(e)) return Kn.get(e);
  const n = t().finally(() => Kn.delete(e));
  return Kn.set(e, n), n;
}
function UE() {
  const e = ot(), t = _(null), n = _("");
  async function a() {
    const s = await px(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const vx = { class: "cards-page" }, gx = { class: "cards-bar" }, yx = { class: "cards-count" }, bx = { class: "cards" }, kx = {
  key: 1,
  class: "cards-note"
}, wx = {
  key: 2,
  class: "cards-note"
}, $x = ["data-row", "onClick"], xx = { class: "card-head" }, Sx = { class: "card-title" }, Mx = { class: "card-foot" }, _x = {
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
    return (a, s) => (r(), d("div", vx, [
      h("div", gx, [
        h("span", yx, g(e.rows.length) + " " + g(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ve, Pe({
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
            U(" New " + g(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", bx, [
        e.loaded ? e.failure ? (r(), d("p", kx, g(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", wx, "No " + g(e.term) + "s yet", 1)) : (r(), j(Je, {
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
          h("span", xx, [
            A(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            U(" " + g(e.head(o)), 1),
            A(at, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", Sx, g(e.title(o)), 1),
          h("span", Mx, g(e.foot(o)), 1)
        ], 8, $x))), 128))
      ]),
      re(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, VE = /* @__PURE__ */ z(_x, [["__scopeId", "data-v-b39fea5d"]]), ql = "newest";
function GE(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Re, null)) == null ? void 0 : c.search, s = _(""), o = _(ql), l = _("all"), i = x(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => hx(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === ql ? m : [...m].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = x(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const Cx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Ex = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, Ax = 40, Ox = "top", Tx = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Me(Re, null)) == null ? void 0 : p.autoScroll, s = x(() => a === Ox), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= Ax, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    pe(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await We(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Ce(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), st(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", Cx, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        re(y.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", Ex, [
        A(Yt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            _e(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = U(" Newest ", -1))
            ], 512), [
              [Kl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, KE = /* @__PURE__ */ z(Tx, [["__scopeId", "data-v-d704d7e3"]]), Ix = ["aria-selected", "data-tab", "onClick"], Bx = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Rx = {
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
    const f = () => We(() => c(!0));
    let m = null;
    return Ce(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Ne(() => m == null ? void 0 : m.disconnect()), pe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), pe(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(L, null, te(o.value, (b) => {
        var M, C;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((M = e.active) == null ? void 0 : M.key) === b.key }]),
          "aria-selected": ((C = e.active) == null ? void 0 : C.key) === b.key,
          "data-tab": b.key,
          onClick: (S) => a("choose", b)
        }, [
          U(g(b.label) + " ", 1),
          u(b) ? (r(), d("span", Bx, g(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, Ix);
      }), 128)),
      h("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ge({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, YE = /* @__PURE__ */ z(Rx, [["__scopeId", "data-v-63fcd326"]]), Lx = { class: "task-bar" }, Nx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", Lx, [
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
}, QE = /* @__PURE__ */ z(Nx, [["__scopeId", "data-v-eafa73d4"]]), qx = {
  class: "tab-body",
  "data-tab-body": ""
}, Dx = { "data-tab-content": "" }, Px = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = _(!1);
    let a = 0;
    return pe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Ws(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", qx, [
      n.value ? (r(), j(Je, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      _e(h("div", Dx, [
        re(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Kl, !n.value]
      ])
    ]));
  }
}, XE = /* @__PURE__ */ z(Px, [["__scopeId", "data-v-63876533"]]), jx = {
  class: "search-bar",
  "data-search-bar": ""
}, Fx = { class: "search-bar-control" }, Wx = ["value", "placeholder", "aria-label"], Hx = ["aria-expanded"], zx = {
  key: 0,
  "data-menu-count": ""
}, Ux = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var S;
    const a = e, s = n, o = yu(), l = ((S = Me(Re, null)) == null ? void 0 : S.search) ?? {}, i = x(() => l.placeholder || a.placeholder), u = l.context ?? [], c = _(null), f = _(null), m = _([]), p = x(() => m.value.length ? m.value[m.value.length - 1].next : u), y = x(() => !!o.menu || u.length > 0), b = (T) => {
      m.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function M(T) {
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
      return r(), d("div", jx, [
        h("div", Fx, [
          A(le, {
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
          }, null, 40, Wx),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: C
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
            e.menuCount ? (r(), d("span", zx, g(e.menuCount), 1)) : k("", !0),
            A(le, {
              name: "caret",
              size: 12
            })
          ], 8, Hx)) : k("", !0)
        ]),
        (W = B(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (I) => s("pick", B(l).button.click))
        }, g(B(l).button.title), 1)) : k("", !0),
        re(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), j(ya, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = $e(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (I) => f.value = null)
        }, {
          default: P(() => [
            m.value.length ? (r(), j(Ve, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (I) => m.value = m.value.slice(0, -1))
            }, {
              default: P(() => [
                U("‹ " + g(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(L, null, te(p.value, (I) => (r(), j(Ve, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (G) => M(I)
            }, {
              default: P(() => [
                U(g(I.title) + g(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : re(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Vx = /* @__PURE__ */ z(Ux, [["__scopeId", "data-v-45374bed"]]), Gx = {
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
    return (o, l) => (r(), j(Vx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        A(Et, null, {
          default: P(() => [...l[2] || (l[2] = [
            U("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(L, null, te(a, (i) => A(Ve, {
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
          A(Et, null, {
            default: P(() => [...l[3] || (l[3] = [
              U("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(L, null, te(s, (i) => A(Ve, {
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
        re(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, JE = /* @__PURE__ */ z(Gx, [["__scopeId", "data-v-dab0064d"]]);
function ZE() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const eA = (e) => import(
  /* @vite-ignore */
  e
), Kx = 86400, Ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Yx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ds(t) - Ds(e)) / Kx);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function tA(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Yx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ls = 280, is = 240, rs = 120, Qx = 6, Xx = 14, $n = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Jx(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function su(e, t) {
  const n = Math.max(0, Jx(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Zx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Xx}px)` }), e.offsetHeight, e.style.transition = `height ${ls}ms ${$n}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = su(t, e));
    const p = s() - i;
    if (!u && p >= ls && (u = !0, e.style.transition = `opacity ${is}ms ease-out, transform ${is}ms ${$n}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ls + is) return a(m);
    f();
  };
  return a(m), f;
}
function nA(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Qx}px)` }), e.offsetHeight, e.style.transition = `opacity ${rs}ms ease-out, transform ${rs}ms ${$n}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = su(t, e)), s() - l < rs) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const e8 = 140, Yn = 220, Dl = 5;
function aA({ gap: e = e8, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, Dl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, y = Zx) => {
    if (l || !m.pane || !m.follows()) return p();
    const b = { el: f, options: m, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Dl && c.flush();
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
function sA(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Yn}ms ${$n}, opacity ${Yn}ms ease-in, margin ${Yn}ms ${$n}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Yn);
}
const ou = "chat.pins.minimised", ta = _(aa(ou, !1));
function Pl(e) {
  ta.value = e, no(ou, e);
}
function t8(e) {
  const t = x(() => e()), n = x(() => ta.value ? [] : e()), a = () => Pl(!ta.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => Ot(o) > s).length,
    (o, l) => o > l && Pl(!1)
  ), { pins: t, visible: n, minimised: ta, toggle: a };
}
const n8 = ["title"], a8 = {
  key: 0,
  class: "pins-count"
}, s8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = t8(() => t.pinRows);
    return (o, l) => B(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      A(le, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (r(), d("span", a8, g(B(n).length), 1)) : k("", !0)
    ], 10, n8)) : k("", !0);
  }
}, oA = /* @__PURE__ */ z(s8, [["__scopeId", "data-v-d073c504"]]), o8 = ["title"], l8 = ["title"], i8 = { class: "diff-card-dir" }, r8 = { class: "diff-card-name" }, u8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, c8 = ["title"], d8 = ["title"], f8 = {
  key: 0,
  class: "diff-card-note"
}, m8 = ["href"], h8 = ["src", "alt"], p8 = { class: "diff-card-rows" }, v8 = { class: "diff-row-num" }, g8 = { class: "diff-row-sign" }, y8 = { class: "diff-row-code" }, b8 = {
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
    const l = { new: "created", deleted: "deleted", moved: "moved" }, i = { add: "+", del: "−" }, u = x(() => n.path.lastIndexOf("/") + 1), c = x(() => n.path.slice(0, u.value)), f = x(() => n.path.slice(u.value)), m = x(() => n.change === "deleted"), p = x(() => l[n.change]), y = x(() => new Set(n.rows.filter((D) => D.line_type === "add").map((D) => D.line))), b = _("after"), M = x(() => b.value === "before" ? n.whole.old : n.whole.text), C = x(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((D, w) => ({ line_type: b.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: D })) : n.rows.filter(
      (D) => !(n.editsOnly && ["ctx", "fold"].includes(D.line_type)) && !(n.hideRemovals && D.line_type === "del")
    )), S = _(!1), T = x(() => n.lines && !S.value && !n.whole), H = x(() => T.value ? C.value.slice(0, n.lines) : C.value), W = x(() => C.value.length - H.value.length), I = (D) => D.line === null || D.line_type === "del" ? "" : D.line, G = (D) => D.line_type === "fold" ? D.hidden ? `⋯ ${D.hidden} lines` : "⋯" : D.text, q = _(null), E = _(null);
    let N = null;
    return Ce(() => {
      if (!E.value) return;
      let D = !0;
      N = new ResizeObserver(() => {
        !q.value || !E.value || (q.value.style.transition = D ? "none" : "", q.value.style.height = `${E.value.offsetHeight}px`, D = !1);
      }), N.observe(E.value);
    }), Ne(() => N && N.disconnect()), (D, w) => (r(), d("section", {
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
          h("span", i8, g(c.value), 1),
          h("span", r8, g(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, g(p.value), 3)) : k("", !0),
          e.from ? (r(), d("span", u8, "from " + g(e.from), 1)) : k("", !0)
        ], 8, l8),
        h("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + g(e.added), 3),
        h("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + g(e.removed), 3),
        A(at, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, g(b.value === "after" ? "After" : "Before"), 9, c8)) : k("", !0),
        m.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((v) => a("whole"), ["stop"]))
        }, [
          A(le, {
            name: "file",
            size: 12
          })
        ], 10, d8))
      ], 8, o8),
      e.whole && e.whole.error ? (r(), d("p", f8, g(e.whole.error), 1)) : k("", !0),
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
          }, null, 8, h8)
        ], 8, m8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: q,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            h("div", p8, [
              (r(!0), d(L, null, te(H.value, (v, $) => (r(), d("div", {
                key: $,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                h("span", v8, g(I(v)), 1),
                h("span", g8, g(i[v.line_type]), 1),
                h("span", y8, g(G(v)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((v) => S.value = !0, ["stop"]))
              }, g(W.value) + " more " + g(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, lA = /* @__PURE__ */ z(b8, [["__scopeId", "data-v-021c4dbc"]]), k8 = { "data-queue-controls": "" }, w8 = { class: "counts" }, $8 = { "data-queue-spots": "" }, x8 = {
  class: "spots",
  "aria-label": "Slot units in use"
}, S8 = { "data-queue-waiting": "" }, M8 = { key: 0 }, _8 = { class: "control" }, C8 = { class: "stepper" }, E8 = ["disabled"], A8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, O8 = ["disabled"], T8 = ["for"], I8 = ["id", "value", "disabled", "onChange"], B8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, R8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, L8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, N8 = {
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
    return (i, u) => (r(), d("div", k8, [
      A(Tt, { icon: "gauge" }, {
        default: P(() => [...u[2] || (u[2] = [
          U("Now", -1)
        ])]),
        _: 1
      }),
      h("div", w8, [
        h("div", null, [
          h("strong", $8, [
            U(g(e.queue.used_slots) + " ", 1),
            h("span", null, "of " + g(e.queue.parallel_limit), 1)
          ]),
          h("p", null, "Slot units of long runs in use. " + g(e.queue.used_slots >= e.queue.parallel_limit ? "Every unit is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "unit" : "units"} free.`), 1),
          h("div", x8, [
            (r(!0), d(L, null, te(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        h("div", null, [
          h("strong", S8, g(e.queue.waiting_count), 1),
          u[3] || (u[3] = h("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", M8, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      h("div", _8, [
        u[4] || (u[4] = h("div", null, [
          h("label", { id: "queue-limit-label" }, "Long lane capacity"),
          h("p", null, "Slot units of long runs that may run at the same time; a test or a build costs 4. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        h("div", C8, [
          h("button", {
            type: "button",
            "aria-label": "One slot unit fewer",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, E8),
          h("output", A8, g(e.queue.parallel_limit), 1),
          h("button", {
            type: "button",
            "aria-label": "One slot unit more",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, O8)
        ])
      ]),
      (r(!0), d(L, null, te(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, g(c.title), 9, T8),
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
        }, null, 40, I8)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", B8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = U("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", R8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        U("The queue is paused. No waiting command gets a place until it is resumed. " + g(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", L8, g(o.value), 1)) : k("", !0)
    ]));
  }
}, q8 = /* @__PURE__ */ z(N8, [["__scopeId", "data-v-f0a1f7f7"]]), D8 = ["data-queue-row", "data-queue-process"], P8 = ["aria-expanded"], j8 = { class: "run-line" }, F8 = { class: "leading" }, W8 = {
  key: 0,
  "data-queue-position": ""
}, H8 = ["title"], z8 = { class: "command" }, U8 = {
  class: "time",
  "data-queue-time": ""
}, V8 = { class: "details" }, G8 = { "data-queue-type": "" }, K8 = { class: "failed" }, Y8 = { class: "drop-inner" }, Q8 = { class: "output" }, X8 = { class: "output-heading" }, J8 = ["href"], Z8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = vr((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = fo(), u = x(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = x(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await We(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function m() {
      n.expanded && (await o.newest(), await We(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return pe(() => n.expanded, m, { immediate: !0 }), En(["output.*"], f, (p) => li(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
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
          y[3] || (y[3] = At($e((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = At($e((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", j8, [
          h("span", F8, [
            e.run.section === "waiting" ? (r(), d("span", W8, g(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, H8))
          ]),
          h("code", z8, g(e.run.line), 1),
          h("span", U8, g(c.value), 1),
          A(le, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", V8, [
          h("span", G8, g(u.value), 1),
          e.run.owner_agent_id ? (r(), d(L, { key: 0 }, [
            y[6] || (y[6] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((b) => B(kt)("agents", e.run.owner_agent_id), ["stop"]))
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
              onClick: y[1] || (y[1] = $e((b) => B(kt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + g(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(L, { key: 3 }, [
            y[10] || (y[10] = h("span", { class: "separator" }, "·", -1)),
            h("span", K8, "Failed, exit " + g(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, P8),
      h("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        h("div", Y8, [
          h("div", Q8, [
            h("div", X8, [
              h("span", null, "Output " + g(e.run.id), 1),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, J8)
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
    ], 8, D8));
  }
}, e3 = /* @__PURE__ */ z(Z8, [["__scopeId", "data-v-26ce3024"]]), t3 = {
  class: "lanes",
  "data-execution-lanes": ""
}, n3 = { class: "filters" }, a3 = ["value"], s3 = ["value"], o3 = ["data-lane"], l3 = {
  key: 0,
  class: "empty"
}, i3 = { class: "line" }, r3 = { class: "facts" }, u3 = { class: "line" }, c3 = { class: "facts" }, d3 = {
  class: "waits",
  "data-lanes-waits": ""
}, f3 = {
  key: 0,
  class: "empty"
}, m3 = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(""), a = _(""), s = x(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.class)))].sort()), o = x(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.starter)))].sort()), l = (m) => (!n.value || m.class === n.value) && (!a.value || m.starter === a.value), i = x(() => t.execution.lanes.map((m) => ({ ...m, running: m.running.filter(l), waiting: m.waiting.filter(l) }))), u = x(() => t.execution.waits.filter((m) => m.runs)), c = (m) => `${m.lane[0].toUpperCase()}${m.lane.slice(1)} lane`, f = (m) => m < 60 ? `${m} s` : `${Math.round(m / 60)} min`;
    return (m, p) => (r(), d("section", t3, [
      h("div", n3, [
        h("label", null, [
          p[3] || (p[3] = U("Class ", -1)),
          _e(h("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (y) => n.value = y),
            "data-lanes-class": ""
          }, [
            p[2] || (p[2] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(L, null, te(s.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, g(y), 9, a3))), 128))
          ], 512), [
            [zt, n.value]
          ])
        ]),
        h("label", null, [
          p[5] || (p[5] = U("Started by ", -1)),
          _e(h("select", {
            "onUpdate:modelValue": p[1] || (p[1] = (y) => a.value = y),
            "data-lanes-starter": ""
          }, [
            p[4] || (p[4] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(L, null, te(o.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, g(y), 9, s3))), 128))
          ], 512), [
            [zt, a.value]
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
        !y.running.length && !y.waiting.length ? (r(), d("p", l3, "Nothing runs or waits here.")) : k("", !0),
        h("ul", null, [
          (r(!0), d(L, null, te(y.running, (b, M) => (r(), d("li", {
            key: `run:${M}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            h("span", i3, g(b.line), 1),
            h("span", r3, [
              U(g(b.class) + ", " + g(b.priority) + ", " + g(b.starter) + ", running " + g(f(b.seconds)), 1),
              b.parent_line ? (r(), d(L, { key: 0 }, [
                U(", for " + g(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(L, null, te(y.waiting, (b, M) => (r(), d("li", {
            key: `wait:${M}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            h("span", u3, g(b.line), 1),
            h("span", c3, [
              U(g(b.class) + ", " + g(b.priority) + ", " + g(b.starter) + ", waiting " + g(f(b.seconds)) + ": " + g(b.reason), 1),
              b.raised_from ? (r(), d(L, { key: 0 }, [
                U(". Raised from " + g(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, o3))), 128)),
      h("div", d3, [
        p[6] || (p[6] = h("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", f3, "No run started in the last hour.")),
        (r(!0), d(L, null, te(u.value, (y) => (r(), d("p", {
          key: y.priority,
          class: "wait"
        }, g(y.priority) + ": " + g(y.runs) + " started, longest wait " + g(f(y.longest_seconds)) + ", average " + g(f(y.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, h3 = /* @__PURE__ */ z(m3, [["__scopeId", "data-v-4a25d644"]]), lu = ["instant", "short", "long"], iu = ["background", "normal", "agent", "reserved", "immediate"], p3 = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function ru(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const v3 = ["data-class-row"], g3 = { scope: "row" }, y3 = { key: 0 }, b3 = ["value"], k3 = ["value"], w3 = { class: "actions" }, $3 = ["disabled"], x3 = ["disabled"], S3 = { class: "actions" }, M3 = ["disabled"], _3 = ["disabled"], C3 = ["disabled"], E3 = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...ru(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", g3, [
        U(g(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", y3, g(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(L, { key: 0 }, [
        h("td", null, [
          _e(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(L, null, te(B(lu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, g(m), 9, b3))), 128))
          ], 512), [
            [zt, o.value.lane]
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
            (r(!0), d(L, null, te(B(iu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, g(m), 9, k3))), 128))
          ], 512), [
            [zt, o.value.priority]
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
        h("td", w3, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, $3),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, x3)
        ])
      ], 64)) : (r(), d(L, { key: 1 }, [
        h("td", null, g(e.entry.lane), 1),
        h("td", null, g(e.entry.cost), 1),
        h("td", null, g(e.entry.priority), 1),
        h("td", null, g(e.entry.limit || "no limit"), 1),
        h("td", S3, [
          h("span", {
            class: Y(["origin", { own: e.entry.origin !== "built-in" }])
          }, g(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, M3),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, _3)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, C3)) : k("", !0)
        ])
      ], 64))
    ], 8, v3));
  }
}, A3 = /* @__PURE__ */ z(E3, [["__scopeId", "data-v-e51b4825"]]), O3 = { class: "fields" }, T3 = ["disabled"], I3 = ["disabled"], B3 = ["value"], R3 = ["value"], L3 = { class: "buttons" }, N3 = ["disabled"], q3 = ["disabled"], D3 = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, P3 = { key: 1 }, j3 = {
  key: 1,
  class: "hint"
}, F3 = {
  key: 2,
  class: "failure",
  role: "alert"
}, W3 = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = _(null), l = _(""), i = x(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    pe(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...ru(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: $e(c, ["prevent"])
    }, [
      h("div", O3, [
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
          }, null, 8, T3), [
            [Ke, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = U("Or plugin", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, I3), [
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
            (r(!0), d(L, null, te(B(lu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, g(p), 9, B3))), 128))
          ], 512), [
            [zt, s.value.lane]
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
            (r(!0), d(L, null, te(B(iu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, g(p), 9, R3))), 128))
          ], 512), [
            [zt, s.value.priority]
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
      h("div", L3, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, N3),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, q3)
      ]),
      o.value !== null ? (r(), d("div", D3, [
        o.value.length ? (r(), d(L, { key: 0 }, [
          h("p", null, g(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(L, null, te(o.value, (p) => (r(), d("code", { key: p }, g(p), 1))), 128))
        ], 64)) : (r(), d("p", P3, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", j3, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", F3, g(l.value), 1)) : k("", !0)
    ], 32));
  }
}, H3 = /* @__PURE__ */ z(W3, [["__scopeId", "data-v-f15e19ad"]]), z3 = { "data-execution-classes": "" }, U3 = ["for"], V3 = ["id", "value", "disabled", "data-lane-setting", "onChange"], G3 = { class: "control presets" }, K3 = ["disabled", "data-class-preset", "onClick"], Y3 = { class: "scroll" }, Q3 = { "data-class-table": "" }, X3 = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, J3 = {
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
    return Ce(o), (i, u) => (r(), d("section", z3, [
      A(Tt, { icon: "gauge" }, {
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
            }, g(c.title), 9, U3),
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
          }, null, 40, V3)
        ]))), 128)),
        h("div", G3, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(L, null, te(B(p3), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, g(c.title), 9, K3))), 128))
        ]),
        h("div", Y3, [
          h("table", Q3, [
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
              (r(!0), d(L, null, te(n.value.classes, (c) => (r(), j(A3, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(H3, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", X3, g(a.value), 1)) : k("", !0)
    ]));
  }
}, Z3 = /* @__PURE__ */ z(J3, [["__scopeId", "data-v-f6def058"]]), eS = {
  class: "process-queue",
  "data-test-queue": ""
}, tS = {
  key: 0,
  class: "lead"
}, nS = { class: "scroll" }, aS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, sS = ["data-queue-empty"], us = 20, oS = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = x(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = _(null), s = _(""), o = _([]), l = _(us), i = x(() => {
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
      ...b.rows.length ? b.rows.map((M, C) => ({ key: `run:${M.id}`, run: M, position: C + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
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
    return En(["process.*", "setting.*"], m), Ce(m), (y, b) => (r(), d("article", eS, [
      e.agent ? k("", !0) : (r(), d("p", tS, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      h("div", nS, [
        s.value ? (r(), d("p", aS, g(s.value), 1)) : k("", !0),
        a.value ? (r(), d(L, { key: 1 }, [
          e.agent ? k("", !0) : (r(), j(q8, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: m
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), j(h3, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          A(Fs, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(L, null, te(c.value, (M) => (r(), d(L, {
                key: M.key
              }, [
                M.run ? (r(), j(e3, {
                  key: 0,
                  run: M.run,
                  environment: a.value.environment_name,
                  position: M.position,
                  read: e.read,
                  expanded: o.value.includes(M.run.id),
                  onToggle: (C) => f(M.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : M.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": M.section.type
                }, g(M.section.empty), 9, sS)) : (r(), j(Tt, {
                  key: 2,
                  class: "sticky-band",
                  icon: M.section.icon,
                  count: M.section.rows.length,
                  "data-queue-heading": M.section.type
                }, {
                  default: P(() => [
                    U(g(M.section.heading), 1)
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
          e.agent ? k("", !0) : (r(), j(Z3, {
            key: 3,
            read: e.read
          }, null, 8, ["read"]))
        ], 64)) : s.value ? k("", !0) : (r(), j(Je, { key: 2 }))
      ])
    ]));
  }
}, iA = /* @__PURE__ */ z(oS, [["__scopeId", "data-v-a016178b"]]), lS = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, iS = ["aria-expanded"], rS = {
  class: "links-count",
  "data-inspector-links-count": ""
}, uS = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, cS = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, dS = {
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
    return pe(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), En(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(L, null, [
      a.value ? (r(), d("section", lS, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", rS, g(a.value), 1),
          A(Jt, { open: n.value }, null, 8, ["open"])
        ], 8, iS),
        h("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", uS, [
            A(md, {
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
      o.value ? (r(), d("p", cS, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, fS = /* @__PURE__ */ z(dS, [["__scopeId", "data-v-a4550728"]]), mS = ["placeholder"], hS = { class: "actions" }, pS = { class: "error" }, vS = {
  key: 1,
  class: "card closed"
}, gS = { class: "mark" }, yS = { class: "prompt" }, bS = {
  key: 0,
  class: "draft"
}, kS = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ht({
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
  emits: /* @__PURE__ */ Ht(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = dn(e, "draft"), l = dn(e, "error"), i = _(!!l.value), u = _(!1), c = _(!1), f = _(null);
    async function m() {
      var b, M;
      i.value = !0, u.value = !1, await We(), (M = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || M.focus();
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
        } catch (M) {
          o.value = b, l.value = M.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), (b, M) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: At(p, ["esc"])
      }, [
        re(b.$slots, "who", {}, void 0, !0),
        _e(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": M[0] || (M[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = At((C) => B(er)(C, y), ["enter"]))
        }, null, 40, mS), [
          [Ke, o.value]
        ]),
        h("div", hS, [
          h("span", pS, g(l.value), 1),
          A(ve, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...M[3] || (M[3] = [
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
            default: P(() => [...M[4] || (M[4] = [
              U("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", vS, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", gS, [
            A(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", yS, g(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", bS, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (C) => s("show"))
        }, [
          h("span", null, g(B(pd)(e.count, "comment")), 1),
          A(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, wS = /* @__PURE__ */ z(kS, [["__scopeId", "data-v-b68baddd"]]), $S = { wide: 1130 }, xS = /\{([A-Za-z_]\w*)\}/g;
function na(e, t, n = {}) {
  return e.replace(xS, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const SS = (e, t, n, a) => na(e.label, n, { row_id: a, id: a }) || n$(t, n, a), MS = { class: "comment-side-head" }, _S = {
  key: 0,
  class: "comment-none"
}, CS = { key: 0 }, ES = {
  key: 1,
  class: "comment-none"
}, AS = {
  class: "comment",
  "data-comment": ""
}, OS = {
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
      h("header", MS, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(ba, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", _S, "No comments yet")) : k("", !0),
      (r(!0), d(L, null, te(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", CS, g(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", ES, "Revision " + g(a.revision), 1)) : k("", !0),
        h("p", AS, g(e.words(a)), 1)
      ]))), 128)),
      A(Sn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, jl = /* @__PURE__ */ z(OS, [["__scopeId", "data-v-276284a3"]]), TS = { class: "resource-heading" }, IS = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, BS = {
  key: 1,
  class: "resource-abstract"
}, RS = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", TS, [
      e.title ? (r(), d("h2", IS, g(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", BS, g(e.abstract), 1)) : k("", !0)
    ]));
  }
}, LS = /* @__PURE__ */ z(RS, [["__scopeId", "data-v-d65ef53f"]]), NS = {
  class: "inspector-head",
  "data-inspector-head": ""
}, qS = { class: "inspector-icons" }, DS = { class: "inspector-icons-start" }, PS = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, jS = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, FS = { class: "inspector-icons-end" }, WS = ["href"], HS = {
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
    return (u, c) => (r(), d("header", NS, [
      h("div", qS, [
        h("span", DS, [
          e.backed ? (r(), j(ve, {
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
          e.stepped ? (r(), d(L, { key: 1 }, [
            A(ve, {
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
            A(ve, {
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
        l.value ? (r(), d("h2", PS, g(e.title), 1)) : (r(), d("p", jS, g(e.label), 1)),
        h("span", FS, [
          e.embedded ? (r(), j(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => B(Fe)(s.value))
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
            href: B(bm)(s.value)
          }, [
            A(le, {
              name: "share",
              size: 13
            })
          ], 8, WS)) : k("", !0),
          e.embedded ? k("", !0) : (r(), j(ve, {
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
      A(LS, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, zS = /* @__PURE__ */ z(HS, [["__scopeId", "data-v-f7878e15"]]), US = {
  class: "section field-grid",
  "data-resource-fields": ""
}, VS = { class: "field-name" }, GS = {
  key: 1,
  class: "field-value"
}, KS = ["onClick"], YS = {
  key: 2,
  class: "field-value"
}, QS = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", US, [
      (r(!0), d(L, null, te(e.fields, (o) => (r(), d(L, {
        key: o.name
      }, [
        h("p", VS, g(o.label), 1),
        o.isTime ? (r(), j(at, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", GS, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, g(o.value), 9, KS)
        ])) : (r(), d("p", YS, g(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, XS = /* @__PURE__ */ z(QS, [["__scopeId", "data-v-7e45afb5"]]);
async function JS(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: a$(s.value.actor, s.value.creator_agent), owner: a.length ? s$(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const ZS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, e6 = {
  key: 1,
  class: "inspector-wait"
}, t6 = { class: "inspector-main" }, n6 = { class: "inspector-column" }, a6 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, s6 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, o6 = { class: "inspector-text" }, l6 = ["innerHTML"], i6 = {
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
    js(ri, x(() => {
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
    const M = x(() => ({ row_id: n.id, id: n.id })), C = x(() => i.value ? na(l.value.title, i.value, M.value) || t$(n.term, i.value, n.id) : ""), S = x(() => i.value ? SS(l.value, n.term, i.value, n.id) : ""), T = x(() => S.value === C.value ? "" : S.value), H = x(() => i.value ? na(l.value.description, i.value, M.value) : ""), W = x(() => {
      var F, V, J;
      return ((F = i.value) == null ? void 0 : F.body) || ((V = i.value) == null ? void 0 : V.brief) || (o.has(n.term) ? (J = i.value) == null ? void 0 : J.text : "") || "";
    }), I = x(() => W.value ? so(W.value, { env: "", rowNames: !1 }) : ""), G = x(() => o$(i.value, W.value, u.value, c.value)), q = x(() => l.value.comments && y.value >= $S.wide), E = x(() => l.value.comments && !q.value), N = (F) => l.value.components.filter((V) => (V.tab || "") === F).map((V) => V.window), D = x(() => [...new Set(l.value.components.map((F) => F.tab).filter(Boolean))]), w = x(() => D.value.length || E.value ? [{ key: "details", label: "Details" }, ...D.value.map((F) => ({ key: F, label: F })), ...E.value ? [{ key: "comments", label: "Comments" }] : []] : []), v = x(() => {
      const F = l.value.links;
      return F ? { categories: F.categories, open: F.open, outsidePlan: F.excludes_plan, pageSize: F.page_size } : null;
    }), $ = lr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (F) => n.read(F));
    async function O() {
      const F = ++b, V = await n.read(na(l.value.reads, null, M.value).split(/\s+/).filter(Boolean));
      if (F !== b || (f.value = V.ok ? "" : V.error, !V.ok)) return;
      i.value = V.value;
      const J = await JS(n.read, i.value);
      F === b && (u.value = J.creator, c.value = J.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", O();
    }, { immediate: !0 }), En(l.value.events, O), pe($.open, (F) => F && E.value && (m.value = "comments"));
    let R = null;
    return Ce(() => {
      var F;
      y.value = ((F = p.value) == null ? void 0 : F.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (R = new ResizeObserver(() => y.value = p.value.clientWidth), R.observe(p.value));
    }), Ne(() => R == null ? void 0 : R.disconnect()), (F, V) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(zS, {
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
      f.value ? (r(), d("p", ZS, g(f.value), 1)) : i.value ? (r(), d(L, { key: 2 }, [
        A(Es, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: P(() => [
            A(to, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", t6, [
          h("div", n6, [
            w.value.length ? (r(), d("div", a6, [
              A(Ut, {
                options: w.value,
                value: m.value,
                onPick: V[3] || (V[3] = (J) => m.value = J)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", s6, [
              A(Qt, { value: m.value }, {
                details: P(() => [
                  h("div", o6, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, l6)) : k("", !0),
                    l.value.lists_fields ? (r(), j(XS, {
                      key: 1,
                      fields: G.value,
                      onPeek: V[4] || (V[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(_s, {
                    "slot-name": `inspector.${e.term}`,
                    names: N(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  A(jl, {
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
                  A(_s, {
                    names: N(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              v.value ? (r(), j(fS, Pe({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, v.value, {
                onOpen: V[6] || (V[6] = (J) => a("open", J))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), j(wS, {
              key: 1,
              send: B($).send,
              count: B($).total.value,
              onShow: V[7] || (V[7] = (J) => E.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          q.value ? (r(), j(jl, {
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
      ], 64)) : (r(), d("div", e6, [
        A(Je)
      ]))
    ], 512));
  }
}, r6 = /* @__PURE__ */ z(i6, [["__scopeId", "data-v-60363e95"]]), rA = {
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
    const t = Me(Qs);
    return (n, a) => (r(), j(r6, Pe(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, u6 = { class: "facts" }, c6 = { class: "fact wide" }, d6 = ["title"], f6 = {
  key: 1,
  class: "fact-value"
}, m6 = {
  key: 0,
  class: "fact"
}, h6 = { class: "fact-value" }, p6 = { class: "fact" }, v6 = { class: "fact-label" }, g6 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, y6 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, b6 = {
  key: 2,
  class: "fact"
}, k6 = { class: "fact-value" }, w6 = { class: "fact wide" }, $6 = { class: "fact-label" }, x6 = { class: "fact wide" }, S6 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, M6 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ra.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", u6, [
        h("div", c6, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => B(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + g(e.place.plan_id) + ": " + g(e.place.plan_title), 9, d6)) : (r(), d("span", f6, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", m6, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", h6, g(e.place.phase_number) + " of " + g(e.place.phase_total) + ": " + g(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(L, { key: 1 }, [
          h("div", p6, [
            h("span", v6, g(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(pn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: B(io)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => B(Fe)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                A(Ft, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          B(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", g6, [
            A(Ft, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = U(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", y6, [
            A(Ft, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = U(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", b6, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", k6, "Agent " + g(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", w6, [
          h("span", $6, [
            i[9] || (i[9] = U(" Complexity ", -1)),
            A(ki, {
              lines: B(mr).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Ut, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", x6, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(Ut, {
            options: B(n),
            value: String(B(fr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", S6, g(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, _6 = /* @__PURE__ */ z(M6, [["__scopeId", "data-v-4bf27961"]]);
function C6(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const E6 = { class: "number" }, A6 = { class: "title" }, O6 = { class: "word" }, T6 = {
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
        A($a, { status: e.status }, null, 8, ["status"]),
        h("span", E6, g(e.number), 1),
        h("span", A6, g(e.title), 1),
        h("span", O6, g(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, cs = /* @__PURE__ */ z(T6, [["__scopeId", "data-v-f6417ae8"]]), I6 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, B6 = { class: "level" }, R6 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = x(() => C6(n.task.id, n.graph)), l = x(() => s.value ? o.value.above : o.value.above.slice(-1)), i = x(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = x(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: vn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", I6, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(L, null, te(l.value, (y) => (r(), d(L, {
        key: y.map((b) => b.id).join()
      }, [
        h("div", B6, [
          (r(!0), d(L, null, te(y, (b) => (r(), j(cs, Pe({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (M) => a("select", M))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(cs, fs(Gl(f(e.task, !0))), null, 16),
      (r(!0), d(L, null, te(i.value, (y) => (r(), d(L, {
        key: y.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(cs, Pe({ ref_for: !0 }, f(y), {
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
}, L6 = /* @__PURE__ */ z(R6, [["__scopeId", "data-v-79c52417"]]), N6 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, q6 = ["datetime"], D6 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", N6, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(L, null, te(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, g(new Date(a.created_at).toLocaleString()), 9, q6),
        h("p", null, g(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, P6 = /* @__PURE__ */ z(D6, [["__scopeId", "data-v-b41f213b"]]), j6 = {
  class: "part",
  "data-resource-waits": ""
}, F6 = ["onClick"], W6 = { class: "wait-id" }, H6 = { class: "wait-title" }, z6 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", j6, [
      h("h4", null, g(e.title), 1),
      (r(!0), d(L, null, te(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A($a, {
          status: B(vn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", W6, g(o.id), 1),
        h("span", H6, g(o.title), 1)
      ], 8, F6))), 128))
    ]));
  }
}, Fl = /* @__PURE__ */ z(z6, [["__scopeId", "data-v-8fb2e251"]]), U6 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, V6 = { class: "text" }, G6 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, K6 = 180, Y6 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = x(() => a.task.waits.filter((u) => !n.has(u.state))), i = x(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(L, null, [
      l.value.length ? (r(), j(Fl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", U6, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", V6, g(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", G6, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: Y(["text", { clamped: !o.value }])
        }, g(e.task.brief), 3),
        e.task.brief.length > K6 && !o.value ? (r(), d("button", {
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
}, Q6 = /* @__PURE__ */ z(Y6, [["__scopeId", "data-v-4a3f1e79"]]), X6 = {
  class: "task-details",
  "data-task-details": ""
}, J6 = { class: "since" }, Z6 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, eM = { class: "text" }, tM = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, nM = {
  key: 1,
  class: "note"
}, aM = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, sM = { class: "text" }, oM = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", X6, [
        h("div", {
          class: Y(["state-line", B(vn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A($a, {
              status: B(vn)(e.task.state)
            }, null, 8, ["status"]),
            U(" " + g(a(e.task.state)), 1)
          ]),
          h("span", J6, [
            o[5] || (o[5] = U(" since ", -1)),
            A(at, {
              at: B(Qm)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", Z6, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", eM, g(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", tM, "Opens by itself when " + g(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", nM, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", aM, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", sM, g(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), j(L6, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(_6, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(Q6, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(P6, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, uA = /* @__PURE__ */ z(oM, [["__scopeId", "data-v-7e73fa21"]]), lM = 50, iM = { messages: 25 }, rM = (e) => iM[e] || lM, uM = {
  class: "task-log",
  "aria-label": "Task log"
}, cM = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, dM = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, fM = { class: "entries" }, mM = ["data-task-log-important"], hM = ["datetime"], pM = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, vM = {
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
        String(rM("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), st(() => {
      i += 1;
    }), (c, f) => (r(), d("section", uM, [
      o.value ? (r(), j(Je, { key: 0 })) : l.value ? (r(), d(L, { key: 1 }, [
        h("p", cM, g(l.value), 1),
        A(ve, {
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
        n.value.length ? k("", !0) : (r(), d("p", dM, "No log entries yet.")),
        h("ol", fM, [
          (r(!0), d(L, null, te(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: Y(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, g(new Date(m.created_at).toLocaleString()), 9, hM),
            h("p", null, g(m.line), 1)
          ], 10, mM))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", pM, [
          A(ve, {
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
          A(ve, {
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
}, cA = /* @__PURE__ */ z(vM, [["__scopeId", "data-v-cfa43bf1"]]);
function gM(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ds = { exports: {} }, Wl;
function yM() {
  return Wl || (Wl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, G) {
        var q = 236, E = 17, N = I, D = o[G], w = null, v = 0, $ = null, O = [], R = {}, F = function(X, Z) {
          v = N * 4 + 17, w = (function(K) {
            for (var ee = new Array(K), ne = 0; ne < K; ne += 1) {
              ee[ne] = new Array(K);
              for (var ae = 0; ae < K; ae += 1)
                ee[ne][ae] = null;
            }
            return ee;
          })(v), V(0, 0), V(v - 7, 0), V(0, v - 7), ue(), oe(), Oe(X, Z), N >= 7 && ke(X), $ == null && ($ = Q(N, D, O)), be($, Z);
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
        }, ke = function(X) {
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
            var He = i.getErrorCorrectPolynomial(Te), ze = c(ae[ce], He.getLength() - 1), _o = ze.mod(He);
            de[ce] = new Array(He.getLength() - 1);
            for (var me = 0; me < de[ce].length; me += 1) {
              var Co = me + _o.getLength() - de[ce].length;
              de[ce][me] = Co >= 0 ? _o.getAt(Co) : 0;
            }
          }
          for (var Eo = 0, me = 0; me < Z.length; me += 1)
            Eo += Z[me].totalCount;
          for (var Ea = new Array(Eo), Rn = 0, me = 0; me < ee; me += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              me < ae[ce].length && (Ea[Rn] = ae[ce][me], Rn += 1);
          for (var me = 0; me < ne; me += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              me < de[ce].length && (Ea[Rn] = de[ce][me], Rn += 1);
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
            ne.put(E, 8);
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
              K = M(X);
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
          var ae = R.getModuleCount() * X + Z * 2, de, ce, Se, Te, me = "", He;
          for (He = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += ne.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += ee.text || K.text ? ' role="img" aria-labelledby="' + he([ee.id, K.id].join(" ").trim()) + '"' : "", me += ">", me += ee.text ? '<title id="' + he(ee.id) + '">' + he(ee.text) + "</title>" : "", me += K.text ? '<description id="' + he(K.id) + '">' + he(K.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', Se = 0; Se < R.getModuleCount(); Se += 1)
            for (Te = Se * X + Z, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(Se, de) && (ce = de * X + Z, me += "M" + ce + "," + Te + He);
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
          return ne += "<img", ne += ' src="', ne += R.createDataURL(X, Z), ne += '"', ne += ' width="', ne += ee, ne += '"', ne += ' height="', ne += ee, ne += '"', K && (ne += ' alt="', ne += he(K), ne += '"'), ne += "/>", ne;
        };
        var he = function(X) {
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
          }, He = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, ze = "";
          for (ae = 0; ae < K; ae += 2) {
            for (ce = Math.floor((ae - ee) / Z), Se = Math.floor((ae + 1 - ee) / Z), de = 0; de < K; de += 1)
              Te = "█", ee <= de && de < ne && ee <= ae && ae < ne && R.isDark(ce, Math.floor((de - ee) / Z)) && (Te = " "), ee <= de && de < ne && ee <= ae + 1 && ae + 1 < ne && R.isDark(Se, Math.floor((de - ee) / Z)) ? Te += " " : Te += "█", ze += X < 1 && ae + 1 >= ne ? He[Te] : me[Te];
            ze += `
`;
          }
          return K % 2 && X > 0 ? ze.substring(0, ze.length - K - 1) + Array(K + 1).join("▀") : ze.substring(0, ze.length - 1);
        };
        return R.createASCII = function(X, Z) {
          if (X = X || 1, X < 2)
            return Ze(Z);
          X -= 1, Z = typeof Z > "u" ? X * 2 : Z;
          var K = R.getModuleCount() * X + Z * 2, ee = Z, ne = K - Z, ae, de, ce, Se, Te = Array(X + 1).join("██"), me = Array(X + 1).join("  "), He = "", ze = "";
          for (ae = 0; ae < K; ae += 1) {
            for (ce = Math.floor((ae - ee) / X), ze = "", de = 0; de < K; de += 1)
              Se = 1, ee <= de && de < ne && ee <= ae && ae < ne && R.isDark(ce, Math.floor((de - ee) / X)) && (Se = 0), ze += Se ? Te : me;
            for (ce = 0; ce < X; ce += 1)
              He += ze + `
`;
          }
          return He.substring(0, He.length - 1);
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
            var E = I.charCodeAt(q);
            G.push(E & 255);
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
        })(), E = 63;
        return function(N) {
          for (var D = [], w = 0; w < N.length; w += 1) {
            var v = N.charCodeAt(w);
            if (v < 128)
              D.push(v);
            else {
              var $ = q[N.charAt(w)];
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
        ], G = 1335, q = 7973, E = 21522, N = {}, D = function(w) {
          for (var v = 0; w != 0; )
            v += 1, w >>>= 1;
          return v;
        };
        return N.getBCHTypeInfo = function(w) {
          for (var v = w << 10; D(v) - D(G) >= 0; )
            v ^= G << D(v) - D(G);
          return (w << 10 | v) ^ E;
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
          for (var ke = 0, R = 0; R < v; R += 1)
            for (var O = 0; O < v; O += 1)
              w.isDark(O, R) && (ke += 1);
          var Oe = Math.abs(100 * ke / v / v - 50) / 5;
          return $ += Oe * 10, $;
        }, N;
      })(), u = (function() {
        for (var I = new Array(256), G = new Array(256), q = 0; q < 8; q += 1)
          I[q] = 1 << q;
        for (var q = 8; q < 256; q += 1)
          I[q] = I[q - 4] ^ I[q - 5] ^ I[q - 6] ^ I[q - 8];
        for (var q = 0; q < 255; q += 1)
          G[I[q]] = q;
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
          return I[N];
        }, E;
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
        })(), E = {};
        return E.getAt = function(N) {
          return q[N];
        }, E.getLength = function() {
          return q.length;
        }, E.multiply = function(N) {
          for (var D = new Array(E.getLength() + N.getLength() - 1), w = 0; w < E.getLength(); w += 1)
            for (var v = 0; v < N.getLength(); v += 1)
              D[w + v] ^= u.gexp(u.glog(E.getAt(w)) + u.glog(N.getAt(v)));
          return c(D, 0);
        }, E.mod = function(N) {
          if (E.getLength() - N.getLength() < 0)
            return E;
          for (var D = u.glog(E.getAt(0)) - u.glog(N.getAt(0)), w = new Array(E.getLength()), v = 0; v < E.getLength(); v += 1)
            w[v] = E.getAt(v);
          for (var v = 0; v < N.getLength(); v += 1)
            w[v] ^= u.gexp(u.glog(N.getAt(v)) + D);
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
        ], G = function(N, D) {
          var w = {};
          return w.totalCount = N, w.dataCount = D, w;
        }, q = {}, E = function(N, D) {
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
          var w = E(N, D);
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
        }, q.getAt = function(E) {
          var N = Math.floor(E / 8);
          return (I[N] >>> 7 - E % 8 & 1) == 1;
        }, q.put = function(E, N) {
          for (var D = 0; D < N; D += 1)
            q.putBit((E >>> N - D - 1 & 1) == 1);
        }, q.getLengthInBits = function() {
          return G;
        }, q.putBit = function(E) {
          var N = Math.floor(G / 8);
          I.length <= N && I.push(0), E && (I[N] |= 128 >>> G % 8), G += 1;
        }, q;
      }, p = function(I) {
        var G = s.MODE_NUMBER, q = I, E = {};
        E.getMode = function() {
          return G;
        }, E.getLength = function(w) {
          return q.length;
        }, E.write = function(w) {
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
        return E;
      }, y = function(I) {
        var G = s.MODE_ALPHA_NUM, q = I, E = {};
        E.getMode = function() {
          return G;
        }, E.getLength = function(D) {
          return q.length;
        }, E.write = function(D) {
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
        return E;
      }, b = function(I) {
        var G = s.MODE_8BIT_BYTE, q = a.stringToBytes(I), E = {};
        return E.getMode = function() {
          return G;
        }, E.getLength = function(N) {
          return q.length;
        }, E.write = function(N) {
          for (var D = 0; D < q.length; D += 1)
            N.put(q[D], 8);
        }, E;
      }, M = function(I) {
        var G = s.MODE_KANJI, q = a.stringToBytesFuncs.SJIS;
        if (!q)
          throw "sjis not supported.";
        (function(D, w) {
          var v = q(D);
          if (v.length != 2 || (v[0] << 8 | v[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var E = q(I), N = {};
        return N.getMode = function() {
          return G;
        }, N.getLength = function(D) {
          return ~~(E.length / 2);
        }, N.write = function(D) {
          for (var w = E, v = 0; v + 1 < w.length; ) {
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
        }, G.writeBytes = function(q, E, N) {
          E = E || 0, N = N || q.length;
          for (var D = 0; D < N; D += 1)
            G.writeByte(q[D + E]);
        }, G.writeString = function(q) {
          for (var E = 0; E < q.length; E += 1)
            G.writeByte(q.charCodeAt(E));
        }, G.toByteArray = function() {
          return I;
        }, G.toString = function() {
          var q = "";
          q += "[";
          for (var E = 0; E < I.length; E += 1)
            E > 0 && (q += ","), q += I[E];
          return q += "]", q;
        }, G;
      }, S = function() {
        var I = 0, G = 0, q = 0, E = "", N = {}, D = function(v) {
          E += String.fromCharCode(w(v & 63));
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
              E += "=";
        }, N.toString = function() {
          return E;
        }, N;
      }, T = function(I) {
        var G = I, q = 0, E = 0, N = 0, D = {};
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
            E = E << 6 | w(v.charCodeAt(0)), N += 6;
          }
          var $ = E >>> N - 8 & 255;
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
        var q = I, E = G, N = new Array(I * G), D = {};
        D.setPixel = function(O, R, F) {
          N[R * q + O] = F;
        }, D.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(q), O.writeShort(E), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(q), O.writeShort(E), O.writeByte(0);
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
          var ue = C(), ke = w(ue);
          ke.write(R, V);
          var Oe = 0, be = String.fromCharCode(N[Oe]);
          for (Oe += 1; Oe < N.length; ) {
            var se = String.fromCharCode(N[Oe]);
            Oe += 1, J.contains(be + se) ? be = be + se : (ke.write(J.indexOf(be), V), J.size() < 4095 && (J.size() == 1 << V && (V += 1), J.add(be + se)), be = se);
          }
          return ke.write(J.indexOf(be), V), ke.write(F, V), ke.flush(), ue.toByteArray();
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
        for (var E = H(I, G), N = 0; N < G; N += 1)
          for (var D = 0; D < I; D += 1)
            E.setPixel(D, N, q(D, N));
        var w = C();
        E.write(w);
        for (var v = S(), $ = w.toByteArray(), O = 0; O < $.length; O += 1)
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
var bM = yM();
const kM = /* @__PURE__ */ gM(bM), wM = ["width", "height", "viewBox"], $M = ["width", "height"], xM = ["d"], SM = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = x(() => {
      const a = kM(0, "M");
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
      }, null, 8, $M),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, xM)
    ], 8, wM));
  }
}, dA = /* @__PURE__ */ z(SM, [["__scopeId", "data-v-489f0852"]]), MM = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, fA = /* @__PURE__ */ z(MM, [["__scopeId", "data-v-47e67f04"]]);
function mA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const hA = bu(() => import("./VoiceFigure-BFYF8AU-.js").then((e) => e.V)), pA = "1.2.0", vA = "3.5";
export {
  pm as $,
  Ie as A,
  Le as B,
  Sa as C,
  ft as D,
  gE as E,
  E4 as F,
  iC as G,
  mE as H,
  r4 as I,
  L4 as J,
  Rt as K,
  AM as L,
  ko as M,
  F4 as N,
  R4 as O,
  xa as P,
  BC as Q,
  j_ as R,
  ea as S,
  DC as T,
  I_ as U,
  Be as V,
  ca as W,
  T_ as X,
  O_ as Y,
  hm as Z,
  z as _,
  $_ as a,
  tE as a$,
  P4 as a0,
  F_ as a1,
  W_ as a2,
  Re as a3,
  Z_ as a4,
  J_ as a5,
  Ot as a6,
  H_ as a7,
  dC as a8,
  d_ as a9,
  GC as aA,
  OC as aB,
  X5 as aC,
  pC as aD,
  vC as aE,
  yE as aF,
  Wr as aG,
  qC as aH,
  On as aI,
  g_ as aJ,
  h_ as aK,
  iE as aL,
  Tn as aM,
  dE as aN,
  lC as aO,
  TC as aP,
  IC as aQ,
  AC as aR,
  bn as aS,
  Ct as aT,
  f_ as aU,
  F$ as aV,
  CC as aW,
  D_ as aX,
  jr as aY,
  Gt as aZ,
  Zt as a_,
  nE as aa,
  uE as ab,
  k_ as ac,
  B_ as ad,
  R_ as ae,
  Q_ as af,
  X_ as ag,
  eC as ah,
  __ as ai,
  Il as aj,
  z_ as ak,
  cC as al,
  $E as am,
  xC as an,
  wC as ao,
  kC as ap,
  tC as aq,
  K_ as ar,
  G_ as as,
  Y_ as at,
  NC as au,
  uC as av,
  fC as aw,
  ME as ax,
  ln as ay,
  mC as az,
  J4 as b,
  SE as b$,
  S4 as b0,
  cE as b1,
  FC as b2,
  jC as b3,
  d5 as b4,
  Cr as b5,
  JC as b6,
  rC as b7,
  Ca as b8,
  vt as b9,
  HC as bA,
  YC as bB,
  bt as bC,
  PC as bD,
  QC as bE,
  hC as bF,
  SC as bG,
  gC as bH,
  De as bI,
  oC as bJ,
  XC as bK,
  BE as bL,
  RE as bM,
  u_ as bN,
  z$ as bO,
  aC as bP,
  zC as bQ,
  x_ as bR,
  wE as bS,
  WC as bT,
  UC as bU,
  VC as bV,
  nC as bW,
  J5 as bX,
  sC as bY,
  bC as bZ,
  kE as b_,
  KC as ba,
  Ja as bb,
  Fi as bc,
  CE as bd,
  OE as be,
  LC as bf,
  lE as bg,
  c_ as bh,
  $C as bi,
  EE as bj,
  U_ as bk,
  V_ as bl,
  E_ as bm,
  P_ as bn,
  v_ as bo,
  sE as bp,
  S_ as bq,
  M_ as br,
  A_ as bs,
  _C as bt,
  N$ as bu,
  fE as bv,
  B4 as bw,
  C_ as bx,
  y_ as by,
  MC as bz,
  c5 as c,
  v2 as c$,
  p_ as c0,
  m_ as c1,
  yC as c2,
  TE as c3,
  Mo as c4,
  IE as c5,
  au as c6,
  oE as c7,
  N_ as c8,
  L_ as c9,
  h3 as cA,
  mo as cB,
  LE as cC,
  CM as cD,
  Jt as cE,
  xf as cF,
  rA as cG,
  Ip as cH,
  ri as cI,
  le as cJ,
  ki as cK,
  YE as cL,
  PM as cM,
  pA as cN,
  vA as cO,
  JM as cP,
  JE as cQ,
  As as cR,
  s_ as cS,
  N2 as cT,
  Ve as cU,
  Et as cV,
  ya as cW,
  GM as cX,
  ZM as cY,
  NM as cZ,
  Dc as c_,
  j$ as ca,
  b_ as cb,
  T4 as cc,
  EC as cd,
  go as ce,
  V5 as cf,
  RC as cg,
  rn as ch,
  Wt as ci,
  Ft as cj,
  zM as ck,
  VM as cl,
  pn as cm,
  KE as cn,
  ve as co,
  Xf as cp,
  to as cq,
  ba as cr,
  qy as cs,
  ka as ct,
  lA as cu,
  r_ as cv,
  UM as cw,
  jy as cx,
  Gs as cy,
  fn as cz,
  Xe as d,
  DE as d$,
  ra as d0,
  oA as d1,
  FM as d2,
  WM as d3,
  HM as d4,
  YM as d5,
  iA as d6,
  dA as d7,
  tr as d8,
  md as d9,
  hA as dA,
  fA as dB,
  uo as dC,
  FE as dD,
  Ws as dE,
  Np as dF,
  io as dG,
  jM as dH,
  sf as dI,
  Gi as dJ,
  Vt as dK,
  Cn as dL,
  Fd as dM,
  aA as dN,
  nA as dO,
  Ks as dP,
  jd as dQ,
  Us as dR,
  tl as dS,
  sA as dT,
  i_ as dU,
  li as dV,
  Cc as dW,
  Ec as dX,
  Xw as dY,
  o_ as dZ,
  a_ as d_,
  VE as da,
  sb as db,
  RM as dc,
  l_ as dd,
  Vx as de,
  Ut as df,
  e_ as dg,
  Je as dh,
  wt as di,
  Kg as dj,
  wd as dk,
  gp as dl,
  n_ as dm,
  LM as dn,
  Qt as dp,
  XE as dq,
  QE as dr,
  L6 as ds,
  uA as dt,
  cA as du,
  $a as dv,
  Mf as dw,
  rt as dx,
  t_ as dy,
  at as dz,
  q_ as e,
  Fh as e0,
  NE as e1,
  IM as e2,
  eA as e3,
  A2 as e4,
  hx as e5,
  fr as e6,
  qM as e7,
  XM as e8,
  jE as e9,
  ZE as eA,
  vr as eB,
  ci as eC,
  t8 as eD,
  Hs as eE,
  HE as eF,
  ms as eG,
  zE as eH,
  UE as eI,
  ot as eJ,
  tA as eK,
  Wd as eL,
  WE as ea,
  Fe as eb,
  Dp as ec,
  KM as ed,
  jc as ee,
  qE as ef,
  pr as eg,
  PE as eh,
  Ql as ei,
  QM as ej,
  zp as ek,
  BM as el,
  Hp as em,
  Da as en,
  TM as eo,
  mn as ep,
  hi as eq,
  Hd as er,
  DM as es,
  yt as et,
  mA as eu,
  px as ev,
  EM as ew,
  OM as ex,
  GE as ey,
  Qi as ez,
  L$ as f,
  _E as g,
  kn as h,
  hE as i,
  AE as j,
  pE as k,
  aE as l,
  ax as m,
  wo as n,
  rE as o,
  w_ as p,
  vE as q,
  tu as r,
  nu as s,
  Ae as t,
  m5 as u,
  ZC as v,
  xE as w,
  eE as x,
  Bn as y,
  bE as z
};
