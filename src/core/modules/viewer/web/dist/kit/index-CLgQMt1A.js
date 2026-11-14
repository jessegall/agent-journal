import { openBlock as r, createElementBlock as d, normalizeStyle as ge, unref as B, renderSlot as ne, createElementVNode as h, normalizeClass as Y, Fragment as R, renderList as X, defineComponent as Tu, Comment as Iu, h as $a, cloneVNode as Bu, createBlock as P, withCtx as q, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as _, inject as _e, watch as me, onMounted as Ce, onBeforeUnmount as et, reactive as Jt, shallowRef as st, onUnmounted as Ne, useAttrs as xa, computed as S, resolveDynamicComponent as Xe, mergeProps as Fe, useId as Vs, resolveDirective as Ru, withDirectives as we, createTextVNode as V, Teleport as Cn, nextTick as qe, Transition as Zt, withModifiers as be, createApp as Nu, shallowReactive as Lu, withKeys as ot, createSlots as Sa, onScopeDispose as _a, useModel as Gt, mergeModels as Bt, toRef as La, vModelText as Ye, resolveComponent as qu, provide as Gs, onErrorCaptured as Du, TransitionGroup as Ks, isRef as qo, getCurrentInstance as Pu, useSlots as ju, vShow as Ys, getCurrentScope as ei, normalizeProps as ks, guardReactiveProps as ti, vModelSelect as Rt, defineAsyncComponent as Fu } from "vue";
function ni(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const H = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Wu = 1600, Hu = {
  __name: "Shimmer",
  setup(e) {
    const t = ni(Wu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ge(B(t))
    }, null, 4));
  }
}, cn = /* @__PURE__ */ H(Hu, [["__scopeId", "data-v-6c018b03"]]), zu = { class: "skeleton-line" }, Uu = 2e3, Vu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ni(Uu);
    return (n, a) => (r(), d("span", zu, [
      ne(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(R, null, X(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ge({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, _t = /* @__PURE__ */ H(Vu, [["__scopeId", "data-v-484fe8a0"]]), en = Tu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Iu);
      return a.length !== 1 ? $a(R, { key: n }, a) : a[0].key == null ? Bu(a[0], { key: n }) : a[0];
    };
  }
}), Gu = ["aria-label"], Ku = ["aria-label"], Yu = ["aria-label"], Qu = ["aria-label"], Xu = ["aria-label"], Ju = ["aria-label"], Zu = ["aria-label"], ec = {
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
    return (u, c) => (r(), P(en, { value: e.shape }, {
      messages: q(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(R, null, X(t, (f) => A(cn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Gu)
      ]),
      older: q(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(t.slice(0, 3), (f) => (r(), P(cn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ku)
      ]),
      cards: q(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(R, null, X(n, (m) => A(_t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Yu)
      ]),
      file: q(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(_t, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(R, null, X(s, (m) => A(_t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qu)
      ]),
      page: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(_t, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(_t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Xu)
      ]),
      text: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(_t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ju)
      ]),
      default: q(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(_t, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Zu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, tt = /* @__PURE__ */ H(ec, [["__scopeId", "data-v-ef519c5f"]]), tc = {
  key: 1,
  class: "empty-state titled"
}, nc = { class: "empty-state-title" }, ac = { class: "empty-state-text" }, sc = {
  key: 2,
  class: "empty-state"
}, oc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), P(tt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", tc, [
      h("p", nc, v(e.title), 1),
      h("p", ac, [
        ne(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", sc, [
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, xt = /* @__PURE__ */ H(oc, [["__scopeId", "data-v-b27e89b0"]]), lc = { class: "fold-group" }, ic = ["aria-expanded"], rc = { class: "fold-label" }, uc = {
  key: 0,
  class: "fold-count"
}, cc = {
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
    return (a, s) => (r(), d("div", lc, [
      h("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", rc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", uc, v(e.count), 1)) : k("", !0),
        h("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, ic),
      e.open ? ne(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, mC = /* @__PURE__ */ H(cc, [["__scopeId", "data-v-9ef1865c"]]), dc = 150, fc = () => dc;
function Qs(e, t, n = fc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function ai(e, t, n) {
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
const mc = 50, Do = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function hC(e) {
  const t = lt().sources.find((n) => n.key === e);
  return t ? ws(t.read, t.events) : ws("", []);
}
function si(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), u = _(!1), c = performance.now(), f = _(!1), m = _(""), p = _(null), g = /* @__PURE__ */ new Set();
  let b = null;
  function w(y) {
    return s() ? (g.add(y), b ?? (b = new Promise(($) => setTimeout(() => $(M()), mc)))) : C(y);
  }
  async function M() {
    const y = new Set(g);
    g.clear(), b = null;
    const $ = W, E = await t({ ids: [...y].join(","), limit: y.size });
    if ($ !== W) return;
    if (!E.ok) return O();
    const I = new Map(E.value.rows.map((j) => [j.id, j]));
    o.value = o.value.flatMap((j) => y.has(j.id) ? I.has(j.id) ? [I.get(j.id)] : [] : [j]);
  }
  async function C(y) {
    const $ = W, E = await t({ "before-id": y + 1, limit: 1 });
    if ($ !== W) return;
    if (!E.ok) return O();
    const I = E.value.rows.find((j) => j.id === y);
    o.value = I ? o.value.map((j) => j.id === y ? I : j) : o.value.filter((j) => j.id !== y);
  }
  async function T(y) {
    if (a() && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Z) => Z.id !== y.row_id));
    if (a() && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && o.value.some((Z) => Z.id === y.row_id)) return w(y.row_id);
    if (!(a() && o.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return O();
    const E = Math.max(...o.value.map((Z) => Z.id)), I = W, j = await t({ "after-id": E });
    if (I !== W) return;
    if (!j.ok) return O();
    const G = new Set(o.value.map((Z) => Z.id));
    o.value = [...j.value.rows.filter((Z) => !G.has(Z.id)), ...o.value];
  }
  async function U() {
    if (!f.value || !o.value.length) return !1;
    const y = W, $ = Math.min(...o.value.map((j) => j.id)), E = await t({ "before-id": $ });
    if (y !== W) return !1;
    if (!E.ok || !E.value.rows.length) return f.value = !1;
    f.value = Do(E.value, n());
    const I = new Set(o.value.map((j) => j.id));
    return o.value = [...o.value, ...E.value.rows.filter((j) => !I.has(j.id))], !0;
  }
  let W = 0;
  function N(y, $) {
    var j, G;
    const E = y.ok ? e.shared ? [y.value] : ((j = y.value) == null ? void 0 : j.rows) ?? [] : [];
    y.ok && (o.value = $(E)), l.value = y.ok ? y.value : null;
    const I = E.length ? Math.min(...E.map((Z) => Z.id)) : 0;
    y.ok && ((G = y.value) != null && G.rows) && !o.value.some((Z) => Z.id < I) && (f.value = !e.shared && Do(y.value, n())), i.value = y.ok ? "" : y.error, Qs(c, () => u.value = !0);
  }
  async function Q(y) {
    const $ = ++W, E = await t({});
    $ === W && N(E, y);
  }
  const D = (y) => {
    if (!a() || !y.length) return y;
    const $ = Math.min(...y.map((I) => I.id)), E = Math.max(...y.map((I) => I.id));
    return [...o.value.filter((I) => I.id > E), ...y, ...o.value.filter((I) => I.id < $)];
  }, O = () => Q(D), L = (y) => N(y, D), z = () => Q((y) => y);
  async function x(y, $ = null) {
    const E = await ai($ && { target: o, fields: { value: $(o.value) } }, y, e.run);
    return m.value = E.ok ? "" : E.error, p.value = E.ok ? E.value : null, await O(), E;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: O, loadLatest: z, older: U, act: x, actionFailure: m, answer: p, context: e, heard: T, showFirst: L, pageSize: n };
}
const hc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ws(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = lt(), l = si(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${hc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const pc = 2e3;
function Xs(e, t, n = pc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = _e(Re, null), u = () => {
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
  }, g = async () => {
    l = !0, await f(e), p();
  }, b = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return g();
      await m(), p();
    }
  };
  me(() => {
    var w;
    return (w = i == null ? void 0 : i.visible) == null ? void 0 : w.value;
  }, b), Ce(async () => {
    document.addEventListener("visibilitychange", b), u() || await g();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const oi = typeof document < "u" && document.documentElement.classList.contains("phone"), li = 120;
var Jl;
const qa = globalThis[Jl = Symbol.for("journal.pressed")] ?? (globalThis[Jl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function vc(e = 0) {
  const t = qa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, qa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, qa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function $s(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ii(e = window) {
  if (!$s(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    $s(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const xs = "journal.stale-build-reload", gc = 'script[type="module"][src*="/assets/index-"]', Po = (e) => {
  var t;
  return ((t = e.querySelector(gc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function yc(e = document, t = (a, s) => Oe.quietRead(a, s), n = () => ii(window)) {
  const a = Po(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Po(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Da = "";
function bc(e, t = () => ii(window)) {
  if (!e) return !1;
  const n = !!Da && Da !== e;
  return Da = e, n && t(), n;
}
const kc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function wc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(xs) === e.message) return !1;
    t.setItem(xs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function $c(e = window.sessionStorage) {
  try {
    e.removeItem(xs);
  } catch {
    return;
  }
}
const xc = 2e3, Sc = 3e4, Qe = Jt({ starting: !1, external: !1, late: !1, offline: !1 }), Js = () => Qe.starting, _c = 3;
let jn = 0, Ss = 0, ri = 0, ui = [];
async function Mc() {
  try {
    const e = await Oe.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Qe.external };
  }
}
let jo = null;
const Cc = () => jo ?? (jo = Mc().finally(() => jo = null));
function Ac() {
  clearTimeout(Ss), clearTimeout(ri), Ss = 0, Object.assign(Qe, { starting: !1, external: !1, late: !1, offline: !1 }), ui.splice(0).forEach((e) => e()), yc();
}
async function Ec() {
  Qe.offline = !navigator.onLine;
  const e = await Cc();
  if (Qe.external = e.updating, jn = !e.restarting && !e.updating && e.reachable ? jn + 1 : 0, jn < _c) return;
  jn = 0, (!bc(e.started_at) || $s()) && Ac();
}
function ci() {
  Ss = setTimeout(async () => {
    await Ec(), Qe.starting && ci();
  }, xc);
}
function Fo() {
  Qe.starting || (Qe.starting = !0, Qe.offline = !navigator.onLine, ci(), ri = setTimeout(() => Qe.late = !0, Sc));
}
const di = () => Qe.starting ? new Promise((e) => ui.push(e)) : Promise.resolve();
function Zs(e, t, n = 0) {
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
function Oc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Tc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Zs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Oc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const pt = "viewer.shell";
function Ic(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Fn = 2e4, Bc = 4, Wo = "/api/read-lines", Rc = 5e3, Nc = 403, Ho = "/api/repeated-lines", Lc = 10, qc = 2e3, Dc = 3e5, pC = 6e5, Pc = "X-Journal-Window-Hidden", Wn = 6, jc = 500, Fc = "/journal/summary", zo = "/api/server-state", Wc = 2e4, Hn = oi ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Hc = (e) => e.split("?")[0].endsWith(Fc), _s = (e, t) => Object.assign(new Error(t), { status: e });
async function zc(e, t, n = _s) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Uc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Vc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Uo = (e) => e.split(" ").slice(0, 2).join(" "), rt = "read", Ft = "write", Gc = "stream";
class Kc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Wn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Uo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < qc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Lc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ho, { method: "POST", headers: { ...Hn, "Content-Type": "application/json" }, body: i }, [{ window: pt, line: Ho, kind: Ft }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = vc(n ? li : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Pc]: Ic() ? "1" : "0" } }, i = s ? { ...l, signal: Vc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Ft ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Fn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Fo(), l;
        }
      throw Fo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Bc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Wo, { headers: Hn }, [{ window: pt, line: Wo, kind: rt }], Rc).then(async (t) => {
      if (t.status === Nc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw _s(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Tc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Uo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Wn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Hn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: Uc(a) }, c = s || (i ? Dc : Fn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: pt, line: n, kind: rt }], c)) : await this.sent(n, u, [{ window: pt, line: n, kind: Ft }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, jc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Wn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return zc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: pt, line: t, kind: rt }], Fn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Hn });
    if (!n.ok) throw _s(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Wn, o).then((i) => (this.written(n), i)) : Js() && !Hc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: pt, line: t, kind: Gc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(zo, { cache: "no-store" }, [{ window: pt, line: zo, kind: rt }], Wc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = pt, line: s = t, limit: o = Fn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? rt : Ft;
    return l === Ft ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Pa = Symbol.for("journal.transport"), Oe = globalThis[Pa] ?? (globalThis[Pa] = new Kc());
class fi {
  constructor() {
    this.following = st([]), this.held = /* @__PURE__ */ new Set();
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
    Oe.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => eo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function eo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const mi = (e, t) => !e.row_id || t.has(e.row_id), Yc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Qc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Xc = 50, Jc = "refresh", Zc = 1e3, ed = 3e4, td = "requested", nd = "after_window", ad = 50, zn = ".*", sd = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function od(e) {
  const t = {}, n = Jt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (x) => u[x] ?? u[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {};
  function g(x) {
    const y = () => p(x), $ = _(void 0), E = si(e, async (I) => {
      const j = await M(x, I);
      return j.ok && !Object.keys(I).length && ($.value = j.value), j;
    }, () => y().page_size || ad, () => !!y().page_size, () => !!y().reads_ids);
    return t[x] = { ...E, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (x, y) => typeof y != "string" || y.startsWith("__v") ? void 0 : t[y] ?? g(y) }), w = (x) => (u[x].loading !== td || x.endsWith(zn)) && (!u[x].tab || u[x].tab === n.tab);
  function M(x, y = {}) {
    return new Promise(($) => {
      a.push({ name: x, flags: y, resolve: $ }), a.length === 1 && setTimeout(C);
    });
  }
  async function C() {
    const x = /* @__PURE__ */ new Map(), y = a.splice(0).filter((I) => {
      const j = JSON.stringify(I.flags);
      return x.has(I.name) || x.set(I.name, j), x.get(I.name) === j ? !0 : (a.push(I), !1);
    });
    a.length && setTimeout(C);
    const $ = Object.fromEntries(y.flatMap(({ name: I, flags: j }) => Object.entries(j).map(([G, Z]) => [`${I}.${G}`, Z]))), E = await e.readKeys({ only: [...new Set(y.map(({ name: I }) => I))], state: { ...n, ...$ } });
    y.forEach(({ name: I, resolve: j }) => j(E.ok ? E.value.keys[I] : E));
  }
  async function T(x) {
    var I;
    const y = ++f;
    (x.length ? x : Object.keys(u).filter((j) => !j.endsWith(zn) && u[j].loading === "first" && w(j))).forEach((j) => l[j] = y);
    const E = await e.readKeys({ only: x, state: { ...n } });
    if (!E.ok) {
      if (E.failure === "cancelled") return !1;
      const j = (x.length ? x : Object.keys(t)).filter((Z) => (l[Z] ?? 0) <= y);
      j.forEach((Z) => {
        b[Z].readAt = Date.now(), E.failure === "unreachable" ? i.add(Z) : i.delete(Z), b[Z].showFirst(E);
      });
      const G = E.failure === "unreachable" && ((I = e.waitForServer) == null ? void 0 : I.call(e));
      return G && G.then(() => {
        if (m) return;
        const Z = j.filter((oe) => l[oe] === y);
        (Z.length || !x.length && !j.length && f === y) && T(Z);
      }), !1;
    }
    return L(E.value.declared), Object.entries(E.value.keys).forEach(([j, G]) => {
      (l[j] ?? 0) > y || (l[j] = y, b[j].readAt = Date.now(), i.delete(j), G.ok && (b[j].data.value = G.value), b[j].showFirst(G));
    }), !0;
  }
  function U(x) {
    const y = sd(x);
    return y.length ? (y.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const E = [...o.names];
      o.names.clear(), o.answer = null, $(T(E));
    })))) : T([]);
  }
  function W(x) {
    x.forEach((y) => s.add(y)), clearTimeout(c), c = setTimeout(() => {
      const y = [...s];
      s.clear(), y.length && U(y);
    }, Xc);
  }
  const N = (x) => x.endsWith(zn) ? Object.keys(t).filter((y) => y.startsWith(x.slice(0, -1)) && t[y].readAt) : [x], Q = (x, y) => {
    const $ = p(x).event_column;
    return !$ || Qc(y, $, /* @__PURE__ */ new Set([Number(x.slice(x.lastIndexOf(".") + 1))]));
  }, D = (x) => (u[x] ?? u[`${x.split(".")[0]}.*`]).reload_seconds;
  function O(x) {
    const y = Object.keys(u).filter((E) => x.event === Jc || u[E].events.some((I) => eo(I, x.event)));
    y.filter((E) => u[E].page_size).forEach((E) => b[E].heard(x));
    const $ = y.filter((E) => !u[E].page_size);
    $.filter((E) => !w(E)).forEach((E) => b[E].readAt = 0), W($.filter(w).flatMap(N).filter((E) => Q(E, x)));
  }
  function L(x) {
    if (Object.keys(u).length) return;
    u = x;
    const y = [...new Set(Object.values(x).flatMap((E) => E.events))];
    y.length && e.follow(y, O);
    const $ = Object.keys(x).filter((E) => x[E].loading === nd);
    $.length && T($);
  }
  me(() => n.tab, () => {
    const x = Object.keys(u).filter((y) => !y.endsWith(zn) && w(y) && !b[y].readAt);
    x.length && T(x);
  }), Ne(() => {
    m = !0, clearTimeout(c);
  });
  function z() {
    const x = Date.now(), y = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && w($)).flatMap(N).filter(($) => x - b[$].readAt >= (i.has($) ? Math.min(D($) * 1e3, ed) : D($) * 1e3));
    y.length && W(y);
  }
  return Xs(z, () => e.visible.value, Zc), queueMicrotask(() => T([])), { props: b, state: n, reload: U, readKey: M };
}
const ld = Symbol("open-view"), Re = Symbol.for("journal.window-context"), hi = Symbol("dock-card"), pi = Symbol.for("journal.inspector-actions");
function id(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = od(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function lt() {
  const e = _e(Re, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return id(e);
}
const rd = (e, t) => e(hi, t), vC = () => _e(hi), Ms = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Vo = {
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
  agent: Ms,
  worker: Ms,
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
}, ud = ["data-icon", "stroke-width", "innerHTML"], ie = {
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
      agent: Ms,
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
    }, null, 12, ud));
  }
}, cd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, dd = /* @__PURE__ */ H(cd, [["__scopeId", "data-v-eb453d6f"]]), fd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = xa(), a = S(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = S(() => t.busy || s.value), l = _e(Re, null), i = S(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, li);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), P(Xe(e.href ? "a" : "button"), Fe(a.value, {
      type: e.href ? void 0 : B(n).type || "button",
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
          ne(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), P(dd, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ H(fd, [["__scopeId", "data-v-ededdadf"]]), md = ["aria-checked", "aria-haspopup", "onClick"], hd = {
  key: 0,
  class: "segmented-dot"
}, pd = {
  key: 1,
  class: "segmented-note"
}, vd = {
  key: 2,
  class: "segmented-count"
}, gd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Vs();
    return (s, o) => {
      const l = Ru("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(R, null, X(e.options, (i) => we((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", hd)) : k("", !0),
          V(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", pd, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", vd, v(i.count), 1)) : k("", !0)
        ], 10, md)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nt = /* @__PURE__ */ H(gd, [["__scopeId", "data-v-c89bc92d"]]), yd = {
  key: 0,
  class: "more-items"
}, bd = {
  key: 0,
  role: "alert"
}, kd = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", yd, [
      e.failure ? (r(), d("p", bd, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), P(ve, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          V(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, An = /* @__PURE__ */ H(kd, [["__scopeId", "data-v-10464014"]]), wd = { class: "link-group" }, $d = {
  class: "group-label",
  "data-link-kind": ""
}, xd = ["disabled", "onClick"], Sd = { class: "title" }, _d = { class: "relations" }, Md = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = S(() => s.value ? n.rows : n.rows.slice(0, 3)), l = S(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", wd, [
      h("div", $d, v(l.value), 1),
      (r(!0), d(R, null, X(o.value, (p) => (r(), d("button", Fe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (g) => a("open", p)
      }), [
        h("span", Sd, v(p.endpoint.title), 1),
        h("span", _d, [
          V(v(c(p)), 1),
          i(p) ? (r(), d(R, { key: 0 }, [
            V(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, xd))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Cd = /* @__PURE__ */ H(Md, [["__scopeId", "data-v-be6f079c"]]), Ad = ["data-loaded"], Ed = { class: "rows" }, Od = ["disabled", "onClick"], Td = { class: "title" }, Id = { class: "relations" }, Bd = { key: 2 }, Rd = {
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
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (O) => p[O] || `${O.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())}s`, b = S(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((O, L) => O + L, 0) },
      ...Object.entries(o.value).filter(([O]) => !n.onlyKinds.length || n.onlyKinds.includes(O)).map(([O, L]) => ({ key: O, label: g(O), count: L }))
    ]), w = S(() => {
      const O = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((z) => z.endpoint.model))].map((z) => [z, s.value.filter((x) => x.endpoint.model === z).length])), L = { doc: 0, task: 1, message: 2 };
      return Object.entries(O).sort(([z], [x]) => (L[z] ?? 3) - (L[x] ?? 3)).map(([z, x]) => ({ model: z, count: x, rows: s.value.filter((y) => y.endpoint.model === z) }));
    }), M = (O) => O.endpoint.unavailable || !O.endpoint.open_ref, C = (O) => ({ [n.linkAttribute]: !0, "data-link-model": O.endpoint.model, "data-link-id": O.endpoint.id }), T = (O) => `${O.endpoint.model === "doc" && O.endpoint.id === n.documentId ? "Design document" : O.endpoint.model.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())} ${O.endpoint.id}, ${O.relations.map((L) => L.replaceAll("_", " ")).join(", ")}`;
    async function U(O = 1) {
      const L = ++m;
      c.value = !0, f.value = "";
      const z = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(O), "--page-size", String(n.pageSize)];
      n.outsidePlan && z.push("--outside-plan"), n.documentId && z.push("--first-counterpart", `doc:${n.documentId}`), i.value && z.push("--kind", i.value);
      try {
        const x = await n.read(z);
        if (L !== m) return;
        if (!x.ok) {
          f.value = x.error;
          return;
        }
        const y = x.value.counterparts ?? [], $ = O === 1 ? y : [...s.value, ...y];
        s.value = [...new Map($.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = x.value.categories ?? {}, l.value = x.value.total, u.value = x.value.next_page ?? null;
      } catch (x) {
        L === m && (f.value = x.message);
      } finally {
        L === m && (c.value = !1);
      }
    }
    function W(O) {
      if (M(O)) return;
      const [L, z] = O.endpoint.open_ref.split(":");
      a("open", { table: L, id: Number(z) });
    }
    function N(O) {
      i.value = O, U();
    }
    const Q = () => !c.value && u.value && U(u.value), D = S(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", U();
    }, { immediate: !0 }), (O, L) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), P(Nt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: N
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", Ed, [
        e.grouped ? (r(!0), d(R, { key: 0 }, X(w.value, (z) => (r(), P(Cd, {
          key: z.model,
          model: z.model,
          count: z.count,
          rows: z.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(R, { key: 1 }, X(s.value, (z) => (r(), d("button", Fe({
          key: `${z.endpoint.model}:${z.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, C(z), {
          disabled: M(z),
          onClick: (x) => W(z)
        }), [
          h("span", Td, v(z.endpoint.title), 1),
          h("span", Id, [
            V(v(T(z)), 1),
            M(z) ? (r(), d(R, { key: 0 }, [
              V(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Od))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Bd, v(e.empty), 1)) : k("", !0),
        A(An, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: D.value,
          onMore: Q
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Ad)) : k("", !0);
  }
}, Nd = /* @__PURE__ */ H(Rd, [["__scopeId", "data-v-3b23de37"]]), Ld = (e, t, n) => Math.max(t, Math.min(n, e)), qd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, vi = /* @__PURE__ */ new WeakMap(), Dd = (e, t) => vi.set(e, t);
function Pd(e, t) {
  for (let n = t; n; n = vi.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function gi(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Pd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ne(() => window.removeEventListener("click", n));
}
const Mt = 8, jd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = ($) => $ ? `${$}px` : void 0, l = S(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = _({ w: 0, h: 0 }), u = ($) => ({ left: $.x, right: $.flipX ?? $.x, top: $.y, bottom: $.y }), c = _(a.anchor ? a.anchor.getBoundingClientRect() : a.point ? u(a.point) : null), f = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), m = ($) => ({
      left: Math.max(0, $.left),
      top: Math.max(0, $.top),
      right: Math.min(window.innerWidth, $.right),
      bottom: Math.min(window.innerHeight, $.bottom)
    }), p = ($) => {
      const E = $.closest(".pane, .float-window");
      return E ? m(E.getBoundingClientRect()) : f();
    }, g = ($, E) => `${Math.max(0, $ ? Math.min($, E) : E)}px`;
    function b($, E) {
      return {
        below: $.bottom - E.bottom - a.gap - Mt,
        above: E.top - $.top - a.gap - Mt,
        across: $.right - $.left - 2 * Mt
      };
    }
    function w($) {
      if (!a.anchor) return f();
      const E = p(a.anchor), I = b(E, $);
      return i.value.w <= I.across && i.value.h <= Math.max(I.below, I.above) ? E : f();
    }
    const M = S(() => {
      if (!c.value) return l.value;
      const $ = c.value, E = w($), I = b(E, $), { w: j, h: G } = i.value, Z = a.point ? $.left + j > E.right - Mt : a.align === "auto" ? $.left + $.right > E.left + E.right : a.align === "right", oe = Ld(Z ? $.right - j : $.left, E.left + Mt, Math.max(E.left + Mt, E.right - j - Mt)), $e = G > I.below && I.above > I.below ? { bottom: `${window.innerHeight - $.top + a.gap}px`, maxHeight: g(a.maxHeight, I.above) } : { top: `${$.bottom + a.gap}px`, maxHeight: g(a.maxHeight, I.below) };
      return { ...l.value, ...$e, left: `${oe}px`, maxWidth: g(a.maxWidth, I.across) };
    }), C = n, T = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function U($) {
      const E = T(), I = E.indexOf(document.activeElement);
      E[(I + $ + E.length) % E.length].focus();
    }
    const W = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => C("close") }, N = ($) => W[$.key] && ($.preventDefault(), W[$.key]()), Q = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let D = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(D), D = requestAnimationFrame(Q);
    });
    gi(s, ($) => a.anchor && !a.anchor.contains($.target) && C("close"));
    const L = ($, E) => ["top", "left", "right", "bottom"].some((I) => Math.abs($[I] - E[I]) > 1), z = ($) => $.bottom < 0 || $.top > window.innerHeight;
    let x = 0;
    function y() {
      if (a.anchor) {
        const $ = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || z($)) return C("close");
        L($, c.value) && (c.value = $);
      }
      x = requestAnimationFrame(y);
    }
    return Ce(() => {
      a.anchor && s.value && Dd(s.value, a.anchor), Q(), s.value && O.observe(s.value), !a.plain && T()[0] && T()[0].focus(), y();
    }), Ne(() => {
      O.disconnect(), cancelAnimationFrame(x), cancelAnimationFrame(D);
    }), t({ element: s }), ($, E) => (r(), P(Cn, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", Fe({
        ref_key: "panel",
        ref: s
      }, $.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: M.value,
        onKeydown: N
      }), [
        ne($.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), tn = /* @__PURE__ */ H(jd, [["__scopeId", "data-v-8094ec27"]]), Fd = { class: "split-button" }, Wd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Fd, [
      A(ve, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: q(() => [
          ne(l.$slots, "default", {}, void 0, !0)
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
      s.value ? (r(), P(tn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ne(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, Hd = /* @__PURE__ */ H(Wd, [["__scopeId", "data-v-c258494d"]]), zd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ud = {
  key: 1,
  class: "menu-item-text"
}, Vd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", zd, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", Ud, [
        h("span", null, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ne(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ H(Vd, [["__scopeId", "data-v-fec99974"]]), Gd = ["aria-expanded"], Kd = { class: "drop-label" }, Yd = ["value"], Qd = {
  key: 1,
  class: "drop-lead"
}, Xd = { class: "drop-item-text" }, Jd = {
  key: 2,
  class: "drop-note"
}, Zd = {
  key: 1,
  class: "drop-none"
}, ef = {
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
        e.icon ? (r(), P(ie, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", Kd, v(e.label), 1),
        A(ie, {
          name: "down",
          size: 11
        })
      ], 10, Gd),
      s.value ? (r(), P(tn, {
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
          }, null, 40, Yd)) : k("", !0),
          (r(!0), d(R, null, X(i.value, (m) => (r(), P(ze, {
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
              m.lead ? (r(), d("span", Qd, v(m.lead), 1)) : k("", !0),
              h("span", Xd, v(m.label), 1),
              m.note ? (r(), d("span", Jd, v(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Zd, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, to = /* @__PURE__ */ H(ef, [["__scopeId", "data-v-29dfcce5"]]), tf = 0, nf = "/api/lines", af = "/api/line", Go = 5e3, Ko = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Yo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ja = (e) => JSON.stringify(e.line), Qo = () => new DOMException("cancelled", "AbortError");
class sf {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(ja(t))) {
        Oe.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Oe.whenFree(() => this.send()), tf));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Qo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Qo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Oe.sent(nf, Ko({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Yo(i.body, rt)), Go);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Oe.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, rt), Date.now() - n < Go ? this.slow.delete(ja(t.body)) : this.slow.add(ja(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Oe.sent(af, Ko(t.body, t.signal), [Yo(t.body, n)], n === rt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const yi = new sf(), of = "/api/window";
function lf(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${of}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Oe.whenFree(async () => {
    const f = await Oe.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: rt }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Oe.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const bi = /* @__PURE__ */ new Map();
class rf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = st({ buttons: [], missing: {} }), this.loading = st(!1), this.loaded = st(!1), this.failed = st(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Oe.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function gC(e, t) {
  const n = new rf(e, t);
  return bi.set(e, n), n.load().catch(() => {
  }), n;
}
const no = (e) => bi.get(e);
function uf(e, t, n) {
  const a = no(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function cf(e, t) {
  if (!e) return !0;
  const n = no(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const df = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let ki = {};
async function yC(e = (t) => Oe.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (ki = (await t.json()).states);
}
const ao = (e, t) => {
  var n;
  return (n = ki[e]) == null ? void 0 : n[t];
}, vn = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.label) ?? df(t);
}, so = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, ff = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, mf = Symbol("pane-page"), oo = Symbol("inspector-host"), wi = { 1: "refused", 2: "usage", 3: "fault" }, hf = 100, pf = 50, vf = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, gf = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function yf({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = _({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: g = [], sources: b = [], links: w = {}, search: M = {}, readOnly: C = !1, shared: T = null }) {
  const U = /* @__PURE__ */ new Map(), W = (G, Z) => l.follow(e, G, (oe) => {
    U.clear(), Z(oe);
  }, a), N = new AbortController(), Q = _(!1), D = performance.now();
  let O = 0, L = 0, z = () => {
  };
  const x = new Promise((G) => z = G);
  N.signal.addEventListener("abort", z, { once: !0 });
  const y = () => {
    clearTimeout(L), L = setTimeout(() => {
      O === 0 && Qs(D, () => {
        Q.value = !0, z();
      });
    }, pf);
  }, $ = (G, Z) => (O += 1, Tt(e, G, t, N.signal, Z).finally(() => {
    O -= 1, y();
  })), E = (G, Z) => (y(), x.then(() => N.signal.aborted ? mt : Tt(e, G, t, N.signal, Z))), I = ({ only: G = [], state: Z = {} } = {}) => (O += 1, kf(() => lf(e, t, G, Z, N.signal), N.signal).finally(() => {
    O -= 1, y();
  })), j = (G, { unbatched: Z = !1, deferred: oe = !1 } = {}) => {
    const ce = U.get(G);
    if (ce && performance.now() - ce.at < hf) return ce.answer;
    const $e = oe && !Q.value ? E(G, Z) : $(G, Z);
    return U.set(G, { answer: $e, at: performance.now() }), $e;
  };
  return {
    answered: Q,
    settle: y,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: S(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: g,
    sources: b,
    links: w,
    search: M,
    readOnly: C,
    shared: T,
    read: j,
    readKeys: I,
    waitForServer: () => Js() ? di() : null,
    run: (G) => Tt(e, G, t, N.signal),
    upload: (G) => $f(G, e, N.signal),
    cancel: () => N.abort(),
    signal: N.signal,
    subscriptions: l,
    follow: (G, Z) => W([G].flat().filter((oe) => o.some((ce) => eo(ce, oe))), Z),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (G) => S(() => {
      var Z;
      return u.value[G] ?? ((Z = c.find((oe) => oe.key === G)) == null ? void 0 : Z.default);
    }),
    setting: async (G, Z) => {
      const oe = await j(`window setting ${e} ${G}`);
      return oe.ok ? oe.value.value : Z;
    },
    setOption: m,
    keep: (G, Z) => Tt(e, ["window", "save-setting", e, G, JSON.stringify(Z)], t, N.signal)
  };
}
function $i(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const mt = { ok: !1, failure: "cancelled", error: "" }, lo = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function xi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? mt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: wi[n.code] || "fault", error: $i(n.error) };
  } catch {
    return t != null && t.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
const bf = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: wi[e.code] || "fault", error: $i(e.error) };
async function kf(e, t) {
  try {
    const n = await e();
    return t.aborted ? mt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, bf(s)])) } };
  } catch {
    return t.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
async function Si(e, t, n) {
  const a = await xi(() => yi.read(e, t, n), t);
  return a.failure !== "unreachable" || !Js() ? a : (await di(), t.aborted ? mt : Si(e, t, n));
}
function Tt(e, t, n, a = void 0, s = !1) {
  return Oe.held(() => wf(e, t, n, a, s), Oe.knownRead(Array.isArray(t) ? t : io(t)));
}
async function wf(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : io(t), environment: n };
  return await Oe.isRead(o.line) ? Oe.joined(JSON.stringify(o), (l, i) => Si({ ...o, attribution: i }, l, s), a, o).catch(() => mt) : xi(() => yi.write({ ...o, attribution: {
    client_id: Oe.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function $f(e, t, n = void 0) {
  try {
    const a = await Oe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? mt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
function io(e) {
  return [...e.matchAll(vf)].map(([t]) => t.replace(gf, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const xf = (e) => `show-${e}`, bC = (e, t, n) => e.filter((a) => {
  var s;
  return n(xf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ro = "messages.chat", ta = "main", _i = "Main agent", Sf = { main: _i, worker: "Worker", helper: "Helper" }, _f = "journal-", uo = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Mf = (e) => uo(e.replace(_f, "").replaceAll("-", " ")), Cf = (e) => `${e.role} ${e.number}`, Af = (e) => e.role === ta ? _i : `${uo(e.role)} ${e.number}`;
function Kt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === ta || !n ? Sf[e.role] ?? uo(e.role) : Mf(n), s = e.role === ta ? "" : Cf(e), o = e.role === ta ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: Af(e) };
}
const Ef = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Of = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = S(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Kt(c).title, note: Kt(c).subtext }))), i = S(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Tt(ro, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(R, null, [
      A(to, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Ef, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Tf = /* @__PURE__ */ H(Of, [["__scopeId", "data-v-d2ea58f1"]]), If = {
  key: 0,
  class: "template-brief"
}, Bf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Rf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = S(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = S(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Tt(ro, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(R, null, [
      A(Nt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", If, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Bf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Nf = /* @__PURE__ */ H(Rf, [["__scopeId", "data-v-14be8a5c"]]), Lf = { class: "info-tip" }, qf = ["aria-label"], Df = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Pf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Lf, [
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
      ], 8, qf),
      h("span", Df, [
        (r(!0), d(R, null, X(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, Mi = /* @__PURE__ */ H(Pf, [["__scopeId", "data-v-a2fe5ff1"]]), jf = { class: "form-field" }, Ff = { class: "form-field-head" }, Wf = ["for"], Hf = {
  key: 1,
  class: "form-field-aside"
}, zf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", jf, [
      h("div", Ff, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Wf),
        e.help ? (r(), P(Mi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", Hf, [
          ne(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ci = /* @__PURE__ */ H(zf, [["__scopeId", "data-v-302c40bf"]]), Cs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Uf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = xa(), n = S(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => we((r(), d("textarea", Fe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(Cs), B(t).value]
    ]);
  }
}), Ai = /* @__PURE__ */ H(Uf, [["__scopeId", "data-v-e130a5b9"]]), Vf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Vs(), o = S(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), P(Ci, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        A(en, { value: o.value }, {
          choice: q(() => [
            A(Nt, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            A(Nf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: q(() => [
            A(Tf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            A(Ai, {
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
}, Ma = {
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
function Gf(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ne(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Kf = (e, t = () => !0) => Gf("keydown", (n) => n.key === "Escape" && t() && e());
function Ei(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = S(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Kf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Yf = 80, jt = Jt([]);
function Oi(e) {
  const t = Symbol("layer"), n = () => jt.includes(t) && jt.splice(jt.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !jt.includes(t) && jt.push(t), a || n();
    },
    { immediate: !0 }
  ), Ne(n), S(() => Yf + Math.max(0, jt.indexOf(t)));
}
let Ti = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ti = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Xf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Qf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ti, document.addEventListener("keydown", s), qe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ne(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Jf = ["aria-modal", "aria-label", "aria-labelledby"], Zf = {
  key: 0,
  class: "dialog-head"
}, em = ["id", "tabindex"], tm = {
  key: 1,
  class: "dialog-foot"
}, nm = 500, am = 400, sm = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ei(a, n), i = Oi(s), u = _(null), c = _(null), f = _(null), m = Vs(), p = _(!1), g = Date.now();
    n.modal && Xf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, am);
    }
    function w(T) {
      !n.modal || Date.now() - g >= nm || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const M = () => u.value && (u.value.scrollTop = u.value.scrollHeight), C = new MutationObserver(M);
    return me(u, (T) => {
      C.disconnect(), T && n.follow && (C.observe(T, { childList: !0, subtree: !0, characterData: !0 }), M());
    }), Ne(() => C.disconnect()), (T, U) => (r(), P(Cn, { to: "body" }, [
      A(Zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: q(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: B(i) }),
            onClick: be(b, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? B(m) : void 0,
              onKeydownCapture: w
            }, [
              e.bare ? k("", !0) : (r(), d("header", Zf, [
                h("h3", {
                  id: B(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, em),
                e.closable ? (r(), P(Ma, {
                  key: 0,
                  onClick: B(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ne(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", tm, [
                ne(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Jf)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, En = /* @__PURE__ */ H(sm, [["__scopeId", "data-v-089c42bc"]]), om = {
  class: "action-output",
  "data-action-output": ""
}, lm = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(En, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: q(() => [
        h("pre", om, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, im = /* @__PURE__ */ H(lm, [["__scopeId", "data-v-b32f94a4"]]);
function rm(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Nu(im, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const um = (e, t, n = {}) => io(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function On(e, t, n, a = {}) {
  var s;
  try {
    if (!await cf(e.module, n)) return { ok: !1, error: "" };
    const o = await Tt(ro, um(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && rm(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const cm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Fa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], xe = (e, t, n, a = {}) => ({
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
}), Ca = {
  messages: xe("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: xe("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: xe("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Fa
  }),
  tasks: xe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Fa
  }),
  reports: xe("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: xe("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: xe("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: xe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: xe("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: xe("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: xe("Pin", "band", "One line pinned to the chat while it matters", { filters: Fa }),
  reactions: xe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: xe("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: xe("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: xe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: xe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: xe("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: xe("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: xe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: xe("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: xe("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: xe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: xe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: xe("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: xe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: xe("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: xe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: xe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, dm = ["secrets", "plugins"], Ii = Object.keys(Ca).filter((e) => !(oi && dm.includes(e)));
S(() => Ii.map((e) => ({ name: e, ...Ca[e] })));
const nn = (e) => Ca[e], Bi = new Map(Ii.flatMap((e) => [e, e.replace(/s$/, ""), Ca[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Bi.get(String(e).toLowerCase()) || "", Ri = [...Bi.keys()].sort((e, t) => t.length - e.length).join("|"), fm = {
  class: "button-form",
  "data-button-form": ""
}, mm = {
  key: 0,
  class: "button-form-title"
}, hm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, pm = { class: "button-form-actions" }, vm = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = _(!1), l = _(""), i = S(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = S(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = nn(kt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await On(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), P(En, {
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
          h("div", fm, [
            (p = e.row) != null && p.title ? (r(), d("p", mm, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(R, null, X(e.button.fields, (g) => (r(), P(Vf, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (b) => s.value[g.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", hm, v(l.value), 1)) : k("", !0),
            h("div", pm, [
              A(ve, {
                small: "",
                onClick: m[0] || (m[0] = (g) => a("close"))
              }, {
                default: q(() => [...m[2] || (m[2] = [
                  V("Cancel", -1)
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
                  V("Send", -1)
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
}, gm = /* @__PURE__ */ H(vm, [["__scopeId", "data-v-e3f0d786"]]), ym = ["aria-busy"], bm = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, km = { class: "button-slot-confirm-text" }, wm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, $m = {
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
    const n = e, a = t, s = S(() => no(n.environment)), o = S(
      () => {
        var C;
        return !n.readOnly && ((C = s.value) == null ? void 0 : C.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = S(() => {
      var C;
      return !n.readOnly && ((C = s.value) == null ? void 0 : C.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = S(() => n.readOnly ? [] : uf(n.environment, n.name, n.row)), c = _(null), f = _(null), m = _(""), p = _(!1), g = (C) => [C.from ? `From ${C.from}` : "", C.tip, C.warning].filter(Boolean).join(" · "), b = (C) => C.icon || (C.warning ? "dot" : "");
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
      const T = await On(C, n.row, n.environment);
      p.value = !1, m.value = T.ok ? "" : T.error;
      const U = C.label.toLowerCase() + (n.objectName && !C.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${U}: ${T.error}`), T.ok && a("done");
    }
    return (C, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(R, { key: 0 }, [
        T[5] || (T[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ve, {
          small: "",
          onClick: i
        }, {
          default: q(() => [...T[4] || (T[4] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", bm, [
        h("span", km, v(f.value.confirm), 1),
        A(ve, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (U) => M(f.value))
        }, {
          default: q(() => [
            V(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ve, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (U) => f.value = null)
        }, {
          default: q(() => [...T[6] || (T[6] = [
            V("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(R, { key: 2 }, [
        (r(!0), d(R, null, X(u.value, (U) => (r(), d(R, {
          key: U.name
        }, [
          U.menu.length ? (r(), P(Hd, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": U.menu_label || "More ways",
            title: g(U),
            "data-button": U.name,
            onMain: (W) => w(U)
          }, {
            menu: q(({ close: W }) => [
              (r(!0), d(R, null, X(U.menu, (N) => (r(), P(ze, {
                key: N.label,
                description: N.description,
                onClick: (Q) => (W(), w({ ...U, ...N, menu: [] }))
              }, {
                default: q(() => [
                  V(v(N.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              V(v(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), P(ve, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: Y({ danger: U.danger }),
            icon: b(U),
            disabled: p.value,
            title: g(U),
            "data-button": U.name,
            onClick: (W) => w(U)
          }, {
            default: q(() => [
              V(v(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", wm, v(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), P(gm, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (U) => c.value = null),
          onDone: T[3] || (T[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, ym));
  }
}, co = /* @__PURE__ */ H($m, [["__scopeId", "data-v-a4b6f174"]]), xm = {
  class: "running",
  "data-running-command": ""
}, Sm = ["title"], _m = {
  key: "idle",
  class: "running-idle"
}, Mm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", xm, [
      A(Zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Sm)) : (r(), d("span", _m, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, kC = /* @__PURE__ */ H(Mm, [["__scopeId", "data-v-d3240219"]]), Cm = ["aria-checked", "disabled", "aria-label", "title"], Am = {
  key: 0,
  class: "switch-inner"
}, Em = {
  key: 0,
  class: "switch-word"
}, Om = {
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
        e.labelled ? (r(), d("span", Am, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Em, v(e.word), 1)) : k("", !0)
    ], 10, Cm));
  }
}, wC = /* @__PURE__ */ H(Om, [["__scopeId", "data-v-92ae7767"]]), Tm = { class: "notice-text" }, Im = {
  key: 1,
  class: "notice-actions"
}, Bm = {
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
      h("span", Tm, [
        ne(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Im, [
        ne(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, $C = /* @__PURE__ */ H(Bm, [["__scopeId", "data-v-445bd8a6"]]);
function Ni(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function ra(e, t) {
  return Ni(() => localStorage, e, t);
}
function Li(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function fo(e, t) {
  return Li(() => localStorage, e, t);
}
function qi(e, t) {
  me(t, (n) => fo(e, n), { deep: !0 });
}
function Rm(e, t) {
  return Ni(() => sessionStorage, e, t);
}
function Nm(e, t) {
  return Li(() => sessionStorage, e, t);
}
const ua = "journal.environment", Di = _(Rm(ua, ra(ua, "")));
function Lm(e) {
  Di.value = e, Nm(ua, e), fo(ua, e);
}
const ca = _(location.hash), Xo = st(null), Jo = { integrations: "mcp", library: "team" };
function qm() {
  if (!Xo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Jo[n]) {
    location.replace(`#/${[Jo[n], ...a].join("/")}${t ? `?${t}` : ""}`), ca.value = location.hash;
    return;
  }
  !n || Xo.value(n) || (Lm(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ca.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ca.value = location.hash, qm();
});
const da = S(() => {
  const [e, t = ""] = ca.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: Di.value,
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
}), Aa = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Aa.page(e)}?open=${t}`
};
function Dm(e = "", t = 0, n = "") {
  location.hash = Aa.page(e, t, n);
}
function Pm(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const jm = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Pi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(jm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Fm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const zt = {};
function xC(e, t) {
  return zt[e] = t, () => zt[e] === t && delete zt[e];
}
function dt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = zt[e]) != null && l.call(zt, t))) return;
  const s = da.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Pi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Wm(e, t, n, a = 0, s = "") {
  if (e === da.value.env) return dt(t, n, a, s);
  const o = da.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Pi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Wm(a, s, Number(o), 0, t) : dt(s, Number(o), 0, t);
}
function Hm(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ht(e) {
  const t = Hm(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function SC(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const zm = { class: "inspector-part" }, Um = { class: "inspector-part-title" }, Vm = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", zm, [
      h("h4", Um, v(e.title), 1),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, _C = /* @__PURE__ */ H(Vm, [["__scopeId", "data-v-5175e4a3"]]), Zo = /* @__PURE__ */ new Map(), Gm = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && Zo.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Zo.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Ce(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ne(() => i.disconnect()), (u, c) => (r(), d(R, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ge(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ne(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = be((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, ji = /* @__PURE__ */ H(Gm, [["__scopeId", "data-v-4d2235ba"]]), Km = ["aria-valuenow", "aria-valuemax"], Ym = {
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
    ], 10, Km));
  }
}, Fi = /* @__PURE__ */ H(Ym, [["__scopeId", "data-v-9eba6a85"]]), Qm = { processes: "process", memories: "memory", replies: "reply" }, fa = (e) => (Qm[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), As = [], Xm = 2e3, gt = /* @__PURE__ */ new Map(), Jm = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Zm = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Dt(e, { first: t = !1 } = {}) {
  t ? As.unshift(e) : As.push(e), gt.clear();
}
function Wi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const eh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, th = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ft(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nh(e, t) {
  const n = [{ type: "text", text: ft(e).replace(/\r\n/g, `
`) }];
  for (const a of As)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function gn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return ah(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function ah(e) {
  return e.split(Zm).map((t, n) => n % 2 ? t : t.replace(Jm, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function el(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const sh = 24;
function oh(e) {
  const [t, , ...n] = e, a = el(t), s = n.map(el), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > sh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${gn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${gn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Hi = /^\s*(?:[-*+]|\d+[.)])\s+/, Es = /^\s*(\d+)[.)]\s/, tl = (e) => e.match(/^\s*/)[0].length;
function zi(e) {
  const t = e[0].match(Es), n = tl(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && tl(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${gn(o.text)}${o.nested.length ? zi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function lh(e, t) {
  const n = Es.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Hi.test(e[s]) && Es.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const nl = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ui(e) {
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
      n.push(`<h${i}>${gn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (nl(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(oh(t.slice(a, i))), a = i;
      continue;
    }
    if (Hi.test(s)) {
      const i = lh(t, a);
      n.push(zi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Ui(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !nl(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${gn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const ih = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, rh = (e) => e.type !== "text" && !ih.test(e.html);
function uh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ui(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : rh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function mo(e, t = { env: "" }) {
  const n = th(e, t), a = gt.get(n);
  if (gt.delete(n), a && a.source === t.source && a.reads.every((l) => eh(l, t)))
    return gt.set(n, a), a.html;
  const s = [], o = uh(nh(e, { ...t, reads: s }));
  return gt.set(n, { html: o, reads: s, source: t.source }), gt.size > Xm && gt.delete(gt.keys().next().value), o;
}
const Wa = /* @__PURE__ */ new WeakMap();
function ch(e) {
  if (Wa.has(e)) return Wa.get(e);
  const t = Lu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${fa(c)} show ${f}`);
    n.set(m, p), p.then((g) => {
      n.get(m) === p && (n.delete(m), t.set(m, g.ok ? { ...g.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${fa(c).replace(/-/g, "_")}.*`], (f) => {
      const m = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(m)) continue;
        const g = Number(p.slice(m.length));
        (!f.row_id || f.row_id === g) && o(c, g);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const m = s(c, f);
    return !t.has(m) && !n.has(m) && o(c, f), t.get(m);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Wa.set(e, u), u;
}
function Vi() {
  const e = _e(Re, null), t = e ? ch(e) : null;
  return (n, a = {}) => mo(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Gi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Tn = (e) => String(e || "").replace(Gi, (t, n, a, s) => s), dh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Un = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, fh = /^Traceback \(most recent call last\):/m, mh = 8;
function Ki(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, mh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function hh(e) {
  const t = [...e.matchAll(dh)].map((a) => a.index);
  if (Un.lastIndex = 0, !t.length || !Un.test(e)) return null;
  Un.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Un)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Ki(n), tail: "" } : null;
}
function ph(e) {
  const t = fh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ki([o]), tail: n.slice(s).join(`
`) };
}
Dt((e) => {
  const t = Tn(e), n = ph(t) || hh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ma = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Yi = (e) => `${e.table}:${e.id}`, Os = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ha = 80;
function al(e) {
  return e.length <= Ha ? e : `${e.slice(0, Ha + 1).replace(/\s+\S*$/, "") || e.slice(0, Ha)}…`;
}
const sl = {
  messages: (e) => al(Os(e.text)),
  comments: (e) => al(Os(e.text)),
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
}, vh = (e) => (sl[e.table] ? sl[e.table](e) : e.title || "") || "", Lt = (e) => ma(e.created_at), gh = (e) => ma(e.updated_at) || Lt(e), yh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, bh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function kh(e) {
  const t = yh.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = bh.exec(e), a = n && kt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function wh(e, t, n, a) {
  const s = Wi(a, e, t), o = Tn(s ? vh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ft(nn(e).title)} ${t}</span><span class="row-card-title">${ft(o)}</span></a>`;
}
Dt(
  (e, t) => {
    const n = kh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: wh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const $h = /\.(png|jpe?g|gif|webp|svg)$/i, xh = (e) => $h.test(e), Sh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, _h = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Mh(e, t) {
  const n = Sh.exec(e), [, a, s, o, l, i] = n || [], u = n && kt(a || o), c = u && Wi(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${nn(u).title} ${c.id} · ${ft(i)}`, p = xh(i) ? `<img class="file-card-image" src="${f}" alt="${ft(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ft(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function Ch(e) {
  const t = _h.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ft(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Dt(
  (e, t) => {
    if (t.inline) return null;
    const n = Mh(e, t) || Ch(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ah = /`([^`\n]+)`/g;
Dt((e) => e.replace(Ah, (t, n) => `<code>${n}</code>`));
const ol = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Aa.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Dt(
  (e, t) => e.replace(Gi, (n, a, s, o) => ol[a] ? ol[a](s, o, t) : o)
);
const Eh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Qi = new RegExp(`\\b(${Ri}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Xi = new RegExp(`\\b(${Ri}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Oh = new RegExp(`<code>((?:${Qi.source}|${Xi.source}))</code>`, "gi"), Th = (e) => e.replace(Oh, "$1"), Ih = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Bh = (e) => e.replace(Xi, (t, n, a) => a.replace(/\d+/g, (s) => Ih(n.replace(/s$/i, ""), s))), Rh = (e) => Bh(e).replace(
  Qi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Dt(
  (e, t) => t.rowNames === !1 ? e : Th(e).split(Eh).map((n, a) => a % 2 ? n : Rh(n)).join("")
);
const Nh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Lh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, qh = /[\w\]]\(/, Dh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Ph = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, jh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Fh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Wh = /[[({,]$/, Hh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, zh = /^(\t|\s{2,})\S/, Uh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Vh = /`[^`]+`/, Gh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Kh = /[{}()[\];=<>$&|*\\@+^~%]/g, Ji = /^\s*(?:[-*+]|\d+[.)])\s/, Yh = /^\s*>/, Qh = /^\s*\|/, Xh = 0.6, Jh = 0.4, Zh = 5, ep = 0.03, Zi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Zh && t.every((n) => Gh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Kh) ?? []).length / e.length < ep;
}, za = (e) => {
  const t = e.trim();
  return Vh.test(t) ? !1 : [Nh, Lh, qh, Dh, Ph, jh, Fh, Wh, Hh].some((n) => n.test(t)) || /[;{}]$/.test(t) || zh.test(e) && !Ji.test(e) && !Zi(e);
};
function tp(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ji.test(t[0]) || t.every((o) => Yh.test(o) || Qh.test(o))) return "text";
  const n = t.filter((o) => !Uh.test(o.trim()));
  if (t.length === 1) return !n.length || za(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(za).length, s = n.filter((o) => !za(o) && Zi(o)).length;
  return a >= n.length * Xh && s <= n.length * Jh ? "code" : "text";
}
const Ts = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", np = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", ap = `${Ts} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, sp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", op = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ll = {
  js: { keywords: Ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: np, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: ap, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: sp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: op, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, lp = {
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
function il(e, t, n) {
  return n && e.startsWith(n, t);
}
function ip(e, t) {
  const n = ll[lp[t] ?? t] || ll.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (il(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && il(e, o, n.block[0])) {
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
function rp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of ip(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ft(l) : `<span class="tok-${a}">${ft(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function er(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const up = 1500, rl = /* @__PURE__ */ new WeakMap();
async function cp(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await er(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(rl.get(t)), rl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, up)
  )));
}
typeof document < "u" && document.addEventListener("click", cp, !0);
const dp = /\n\s*\n/, fp = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, mp = /^\s*(`{3,}|~{3,})\s*$/, hp = /^\s{4,}\S/, pp = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Is = /^\s*(?:[-*+]|\d+[.)])\s/, tr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, vp = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ho(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function gp(e) {
  const t = ho(e.join(`
`));
  return (vp.find(([, n]) => n.test(t)) || ["text"])[0];
}
const yp = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && tr.test(t) && !Is.test(t);
}, bp = (e, t) => Is.test(t) || Is.test([...e].reverse().find((n) => n.trim()) || "");
function po(e, t) {
  const n = t || gp(e), a = rp(ho(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function kp(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && mp.test(s));
  return a < 0 ? e.length : a;
}
function wp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return po(a.map(Tn), n ? n.toLowerCase() : "");
}
function $p(e) {
  const t = e.split(dp).map((l) => ({ paragraph: l, type: tp(ho(l).split(`
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
      s(), n.push(po(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Tn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function xp(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : $p(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(fp);
    if (i) {
      const c = kp(n, l, i[2]);
      o(), a.push(wp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = yp(s) ? pp : hp;
    if (!t && u.test(n[l]) && !bp(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && tr.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(po([...f, ...n.slice(l, c)].map(Tn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Dt((e, t) => xp(e, t.document), { first: !0 });
const Sp = ["innerHTML"], _p = ["innerHTML"], Mp = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Vi(), a = S(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(Ht) && B(Ht)(...l)),
      innerHTML: a.value
    }, null, 8, Sp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Ht) && B(Ht)(...l)),
      innerHTML: a.value
    }, null, 8, _p));
  }
}, ut = /* @__PURE__ */ H(Mp, [["__scopeId", "data-v-d8e75741"]]), MC = (e) => [...new Set(e.agents.map((t) => t.name))], Ua = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Cp = "main agent", vo = (e, t) => t ? Cp : e, Ap = ["data-agent-main"], Ep = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Op = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Tp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean, chip: Boolean },
  setup(e) {
    const t = e, n = S(() => vo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main, chip: e.chip }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Ep, [...s[0] || (s[0] = [
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
      e.iconOnly ? k("", !0) : (r(), d("span", Op, v(n.value), 1))
    ], 10, Ap));
  }
}, Ut = /* @__PURE__ */ H(Tp, [["__scopeId", "data-v-f8a38025"]]), Ip = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], nr = { danger: "failed", warn: "waiting" }, Bp = (e) => Ip.includes(nr[e] ?? e), ar = (e) => Bp(e) ? ["badge", nr[e] ?? e] : ["badge-quiet"], Rp = ["aria-expanded"], Np = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Lp = {
  key: 0,
  class: "tip-failure"
}, qp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = _e(Re, null), a = S(() => ff(t.type, t.state)), s = S(() => ar(so(t.type, t.state))), o = _(!1), l = _([]), i = _("");
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
      onKeydown: ot(c, ["escape"])
    }, [
      V(v(B(vn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", Np, [
        i.value ? (r(), d("span", Lp, v(i.value), 1)) : k("", !0),
        (r(!0), d(R, null, X(l.value, (g) => (r(), d("span", {
          key: g,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : k("", !0)
    ], 42, Rp)) : (r(), d("span", {
      key: 1,
      class: Y(s.value)
    }, v(B(vn)(e.type, e.state)), 3));
  }
}, Dp = /* @__PURE__ */ H(qp, [["__scopeId", "data-v-d276694c"]]), Pp = {
  class: "plan-details",
  "data-plan-details": ""
}, jp = { class: "state-line" }, Fp = {
  key: 0,
  class: "phase-count"
}, Wp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Hp = { class: "text" }, zp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, Up = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, Vp = { class: "overall" }, Gp = { class: "overall-figure" }, Kp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, Yp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, Qp = {
  key: 5,
  class: "part"
}, Xp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Pp, [
        h("div", jp, [
          A(Dp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", B(so)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Fp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", Wp, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", Hp, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", zp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", Up, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", Vp, [
            A(Fi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", Gp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Kp, [
          A(Ut, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", Yp, [
          B(Ua)(e.plan) ? (r(), P(Ut, {
            key: 0,
            name: B(Ua)(e.plan).name,
            main: B(Ua)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(R, { key: 1 }, [
            V(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", Qp, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(ji, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: q(() => [
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
}, CC = /* @__PURE__ */ H(Xp, [["__scopeId", "data-v-52683b11"]]), Jp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), P(Xe(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: q(() => [
        ne(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          ne(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Zp = /* @__PURE__ */ H(Jp, [["__scopeId", "data-v-683e1839"]]), sr = (e) => `row:${e}`, e1 = 5e3, t1 = "cancelled", Va = /* @__PURE__ */ new Map();
async function n1(e, t) {
  const n = `${e.environment}:${t}`, a = Va.get(n);
  if (a && performance.now() - a.at < e1) {
    const o = await a.answer;
    if (o.failure !== t1) return o;
    Va.delete(n);
  }
  const s = e.read(`agent tip ${sr(t)}`);
  return Va.set(n, { answer: s, at: performance.now() }), s;
}
function a1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function In(e, t = Date.now()) {
  const n = a1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const s1 = 36e5;
function o1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / s1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ul(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function or(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function cl(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ga = (e) => String(e).padStart(2, "0");
function lr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ga(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ga(Math.floor(t % 3600 / 60))}m ${Ga(t % 60)}s`;
}
const l1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, i1 = { state: "retired", words: "Retired" }, r1 = (e) => e.retired ? i1 : l1[e.activity], u1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), c1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${In(e, t)}` : "", d1 = (e, t) => e ? `Seen: ${In(e, t)}` : "", f1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, m1 = { key: 0 }, h1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, p1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, v1 = ["data-state"], g1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, y1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, b1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, k1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, w1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = _e(Re, null), a = _(!1), s = _(null), o = _(""), l = _(Date.now()), i = S(() => r1(s.value)), u = S(() => c1(s.value.since, l.value)), c = S(() => d1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await n1(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), P(Zp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Sa({
      default: q(() => [
        ne(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: q(() => [
          s.value ? (r(), d(R, { key: 0 }, [
            h("span", f1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = V()),
              s.value.name ? (r(), d("span", m1, v(s.value.name), 1)) : k("", !0)
            ]),
            h("span", h1, v(B(u1)(s.value)), 1),
            h("span", p1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, v1),
              V(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", g1, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", y1, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", b1, v(e.label), 1)),
          o.value ? (r(), d("span", k1, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, yn = /* @__PURE__ */ H(w1, [["__scopeId", "data-v-71d17663"]]), $1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, x1 = { class: "agent-word" }, S1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", $1, [
      (r(!0), d(R, null, X(s.value, (i) => (r(), P(yn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: B(vo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => B(je)(`agents:${i.id}`)
      }, {
        default: q(() => [
          h("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Ut, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", x1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, _1 = /* @__PURE__ */ H(S1, [["__scopeId", "data-v-619caeed"]]), M1 = { class: "phases" }, C1 = { class: "phead" }, A1 = { class: "mark" }, E1 = { class: "ptitle" }, O1 = { class: "phead-end" }, T1 = {
  key: 0,
  class: "checkpoint"
}, I1 = { class: "progress" }, B1 = {
  key: 0,
  class: "when"
}, R1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", M1, [
      (r(!0), d(R, null, X(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", C1, [
          h("span", A1, [
            A(ie, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", E1, v(i + 1) + ". " + v(l.title), 1),
          h("span", O1, [
            l.checkpoint ? (r(), d("span", T1, "checkpoint")) : k("", !0),
            h("span", I1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", B1, v(l.goal), 1)) : k("", !0),
        A(_1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(R, null, X(l.tasks, (u) => ne(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, AC = /* @__PURE__ */ H(R1, [["__scopeId", "data-v-05aaa685"]]), N1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, L1 = { ...N1, done: "Completed" }, q1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), D1 = (e) => q1.has(e), bn = (e) => D1(e) ? "done" : e, P1 = { class: "task-status-icon" }, j1 = ["width", "height", "aria-label"], F1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = S(() => so("task", bn(t.status))), a = S(() => n.value === "testing" ? "started" : n.value), s = S(() => L1[t.status] ?? vn("task", t.status));
    return (o, l) => (r(), d("span", P1, [
      A(Zt, {
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
            A(en, { value: a.value }, {
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
          ], 10, j1))
        ]),
        _: 1
      })
    ]));
  }
}, Ea = /* @__PURE__ */ H(F1, [["__scopeId", "data-v-ae24a63f"]]), W1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, H1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, z1 = {
  key: 2,
  class: "empty"
}, U1 = { class: "day" }, V1 = { class: "events" }, G1 = { class: "mark" }, K1 = { class: "what" }, Y1 = { class: "head" }, Q1 = { class: "word" }, X1 = ["title", "onClick"], J1 = { class: "at" }, Z1 = {
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
    return me(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", W1, [
      l.value ? (r(), d("p", H1, v(l.value), 1)) : o.value === null ? (r(), P(tt, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", z1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(R, null, X(i.value, (p) => (r(), d(R, {
        key: p.day
      }, [
        h("h3", U1, v(p.day), 1),
        h("ol", V1, [
          (r(!0), d(R, null, X(p.items, (g) => (r(), d("li", {
            key: `${g.time}-${g.event_type}-${g.task_id}`,
            class: Y(["event", g.event_type]),
            "data-plan-event": ""
          }, [
            h("span", G1, [
              n[g.event_type].state ? (r(), P(Ea, {
                key: 0,
                status: n[g.event_type].state
              }, null, 8, ["status"])) : (r(), P(ie, {
                key: 1,
                name: n[g.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", K1, [
              h("div", Y1, [
                h("span", Q1, v(n[g.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${g.task_id}`,
                  onClick: (b) => s("select", g.task_id)
                }, "#" + v(g.task_id) + " " + v(g.title), 9, X1),
                h("span", J1, v(u(g.time)), 1)
              ]),
              g.text ? (r(), P(ut, {
                key: 0,
                class: "text",
                text: g.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, EC = /* @__PURE__ */ H(Z1, [["__scopeId", "data-v-9e511133"]]), ev = 1e3;
function ir() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), ev);
  return et(() => clearInterval(t)), e;
}
const tv = Symbol("resource-subscriptions");
function nv() {
  const e = _e(tv, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = _e(Re, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new fi();
  return (a, s) => n.follow("resources", a, s);
}
function Bn(e, t, n = () => !0) {
  const a = Zs(t, 100), s = nv()(e, (o) => {
    n(o) && a();
  });
  _a(() => {
    s(), a.cancel();
  });
}
function av(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const rr = { compact: "Compaction", clear: "Clear" }, sv = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, ov = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function lv(e) {
  return e != null && e.is_open ? `${rr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function iv(e) {
  if (!e) return [];
  const t = [["Last context change", `${rr[e.change]}: ${ov[e.state]}`], ["Asked by", sv[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const rv = "Not known", uv = 80, cv = 1e3, dv = "worker", fv = "main", mv = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), hv = (e) => e.ok ? e.value.rows : [], pv = (e, t) => e.ended_at ? "ended" : e.paused_at || mv.has(t == null ? void 0 : t.state) ? "waiting" : "running", ur = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function vv({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / cv, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: lr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > uv }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? rv : `$${t.cost_dollars.toFixed(2)}` }), e.role === dv && l.push({ key: "pace", label: "Tasks an hour", value: String(o1(ur(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === fv && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function gv(e) {
  const t = ur(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function yv(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", ul(e.created_at)]), e.ended_at && a.push(["Ended", ul(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...iv(n)), a;
}
const bv = { class: "band" }, kv = { key: 0 }, wv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", bv, [
      A(ie, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ne(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", kv, v(e.count), 1)) : k("", !0)
    ]));
  }
}, qt = /* @__PURE__ */ H(wv, [["__scopeId", "data-v-1758914f"]]), $v = { class: "number" }, xv = { class: "text" }, Sv = 150, _v = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = S(() => t.text.length > Sv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(R, null, [
      e.text ? (r(), d(R, { key: 0 }, [
        A(qt, { icon: "file" }, {
          default: q(() => [
            V(v(e.label), 1)
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
      e.points.length ? (r(), d(R, { key: 1 }, [
        A(qt, { icon: "points" }, {
          default: q(() => [...l[1] || (l[1] = [
            V("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(R, null, X(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", $v, v(i.id), 1),
            h("span", xv, [
              V(v(i.text), 1),
              h("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Mv = /* @__PURE__ */ H(_v, [["__scopeId", "data-v-c99de22c"]]), Cv = ["aria-expanded"], Av = { class: "count" }, Ev = {
  key: 0,
  "data-agent-fold-body": ""
}, Ov = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Bt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Gt(e, "open");
    return (n, a) => (r(), d(R, null, [
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
        V(v(e.label), 1),
        h("span", Av, v(e.count), 1),
        A(ie, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Cv),
      t.value ? (r(), d("div", Ev, [
        ne(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Ka = /* @__PURE__ */ H(Ov, [["__scopeId", "data-v-7f93d8d9"]]), Tv = ["onClick"], Iv = { class: "text" }, Bv = { class: "aside" }, Rv = {
  key: 0,
  class: "none"
}, Nv = {
  class: "skills",
  "data-agent-skills": ""
}, Lv = {
  key: 0,
  class: "none-inline"
}, qv = { class: "label" }, Dv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Jt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (l) => hv(await t.read(l));
    return me(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), me(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(R, null, [
      A(Ka, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => B(dt)("agents", u.id)
          }, [
            h("span", Iv, v(B(Kt)(u).title), 1),
            h("span", Bv, v(B(Kt)(u).subtext), 1)
          ], 8, Tv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", Rv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Ka, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: q(() => [
          h("p", Nv, [
            (r(!0), d(R, null, X(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Lv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Ka, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", qv, v(u) + ":", 1),
            h("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Pv = /* @__PURE__ */ H(Dv, [["__scopeId", "data-v-1281605f"]]), jv = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = ir(), a = S(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(B(In)(e.at, B(n))), 9, jv));
  }
}, Fv = {
  class: "now",
  "data-agent-now": ""
}, Wv = {
  key: 1,
  class: "muted"
}, Hv = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, zv = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, Uv = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Vv = { class: "line" }, Gv = { class: "detail" }, Kv = { class: "bar" }, Yv = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = S(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(R, null, [
      A(qt, { icon: "play" }, {
        default: q(() => [...o[2] || (o[2] = [
          V("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Fv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(dt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", Wv, v(e.nothing), 1)),
        n.value ? (r(), d("span", Hv, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", zv, [
          o[3] || (o[3] = V("Seen: ", -1)),
          A(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", Uv, [
        h("div", Vv, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(dt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", Gv, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", Kv, [
          h("i", {
            style: ge({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, Qv = /* @__PURE__ */ H(Yv, [["__scopeId", "data-v-ff25c609"]]), Xv = ["onClick"], Jv = { class: "text" }, Zv = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, eg = { class: "text" }, tg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, ng = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(R, null, [
      A(qt, { icon: "clock" }, {
        default: q(() => [...n[0] || (n[0] = [
          V("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(R, null, X(e.moves, (a) => (r(), d(R, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => B(dt)(a.table, a.id)
        }, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Jv, v(a.text), 1),
          A(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Xv)) : (r(), d("div", Zv, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", eg, v(a.text), 1),
          A(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", tg, "Nothing yet."))
    ], 64));
  }
}, ag = /* @__PURE__ */ H(ng, [["__scopeId", "data-v-58f0db57"]]), sg = {
  class: "strip",
  "data-agent-strip": ""
}, og = ["data-agent-cell"], lg = {
  key: 0,
  class: "meter"
}, ig = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", sg, [
      (r(!0), d(R, null, X(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", lg, [
          h("i", {
            class: Y({ high: a.high }),
            style: ge({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, og))), 128))
    ]));
  }
}, rg = /* @__PURE__ */ H(ig, [["__scopeId", "data-v-b6657ab7"]]), ug = {}, cg = { class: "menu-label" };
function dg(e, t) {
  return r(), d("span", cg, [
    ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const wt = /* @__PURE__ */ H(ug, [["render", dg], ["__scopeId", "data-v-aa955b3e"]]), fg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, mg = {
  key: 0,
  class: "skills-none"
}, hg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.skills.filter((l) => l.state === "loaded")), o = S(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", fg, [
      A(wt, null, {
        default: q(() => [...i[1] || (i[1] = [
          V("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", mg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(R, null, X(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(ie, {
          name: "book",
          size: 12
        }),
        V(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(R, { key: 1 }, [
        A(wt, null, {
          default: q(() => [...i[2] || (i[2] = [
            V("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(R, null, X(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(ie, {
            name: "book",
            size: 12
          }),
          V(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(ze, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: q(() => [...i[3] || (i[3] = [
          V("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, pg = /* @__PURE__ */ H(hg, [["__scopeId", "data-v-be514d47"]]), vg = ["disabled", "title"], gg = { class: "gauge usage" }, yg = {
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
      A(ie, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = V()),
      h("span", gg, [
        h("span", {
          style: ge({ width: `${o.value}%` })
        }, null, 4)
      ]),
      V(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, vg)) : k("", !0);
  }
}, bg = /* @__PURE__ */ H(yg, [["__scopeId", "data-v-a36f09dc"]]), kg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(B(ar)(e.tone))
    }, v(e.text), 3));
  }
}, go = /* @__PURE__ */ H(kg, [["__scopeId", "data-v-b7a33f3d"]]);
function wg(e, t, n, { groups: a, programs: s }) {
  const o = _({}), l = _(""), i = _(!1), u = S(() => !!e.value && !e.value.ended_at), c = S(() => u.value && !!e.value.paused_at);
  async function f(b, w = null) {
    l.value = "";
    const M = await ai(w, b, t);
    return l.value = M.ok ? "" : M.error, n(), M;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, w) => f(["agent", "control", String(e.value.number), b, w.value], { target: o, fields: { value: { ...o.value, [b]: w.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const $g = ["disabled", "title"], xg = ["disabled", "title"], Sg = { class: "gauge" }, _g = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Mg = ["disabled", "title"], Cg = ["disabled"], Ag = ["disabled"], Eg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Og = ["title"], Tg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ig = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Bg = { class: "gauge" }, Rg = { class: "context-used" }, Ng = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Lg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, qg = 75, Dg = {
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
    const n = e, a = t, s = wg(La(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: La(n, "controlGroups"), programs: La(n, "agentPrograms") }), o = _(null), l = _(""), i = S(() => s.groups.value.find((D) => D.key === l.value));
    function u(D, O) {
      o.value = D.currentTarget, l.value = O;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = S(() => n.skills.filter((D) => D.state === "loaded"));
    function m(D) {
      u(D, "skills"), a("skills");
    }
    const p = (D) => s.groups.value.some((O) => O.key === D), g = S(() => {
      var D;
      return s.chosen.value.model ?? ((D = w.value) == null ? void 0 : D.model) ?? "";
    }), b = S(() => {
      var D;
      return s.chosen.value.effort ?? ((D = w.value) == null ? void 0 : D.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const w = S(() => {
      var D;
      return ((D = n.usage.agents) == null ? void 0 : D.find((O) => {
        var L;
        return O.id === ((L = n.agent) == null ? void 0 : L.id);
      })) ?? null;
    }), M = S(() => {
      var D;
      return ((D = w.value) == null ? void 0 : D.context_percent) == null ? null : Math.round(w.value.context_percent);
    }), C = S(() => {
      var D;
      return lv(((D = w.value) == null ? void 0 : D.context_change) ?? null);
    }), T = (D) => `${Math.round(D / 1e3)}k`, U = S(() => {
      var D;
      return !!((D = w.value) != null && D.context_limit_tokens);
    }), W = S(() => {
      var D, O;
      return ((D = w.value) == null ? void 0 : D.context_limit_tokens) || ((O = w.value) == null ? void 0 : O.context_window_tokens) || 0;
    }), N = S(() => W.value ? `${T(w.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), Q = S(() => {
      var D;
      return (D = w.value) != null && D.cost_dollars ? `$${w.value.cost_dollars.toFixed(2)}` : "";
    });
    return (D, O) => {
      var L, z;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(R, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: O[0] || (O[0] = (x) => u(x, "agent"))
          }, [
            A(ie, {
              name: "agents",
              size: 12
            }),
            V(" " + v(((L = e.agentPrograms.find((x) => x.name === e.agent.program)) == null ? void 0 : L.title) || e.agent.program), 1)
          ], 8, $g),
          A(bg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: O[1] || (O[1] = (x) => a("open", "usage", x))
          }, null, 8, ["windows", "disabled"]),
          M.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${M.value}% full: clear or compact it`,
            onClick: O[2] || (O[2] = (x) => p("context") ? u(x, "context") : a("open", "context", x.currentTarget))
          }, [
            A(ie, {
              name: "gauge",
              size: 12
            }),
            O[14] || (O[14] = V()),
            h("span", Sg, [
              h("span", {
                style: ge({ width: `${M.value}%` })
              }, null, 4)
            ]),
            V(" " + v(M.value) + "% ", 1)
          ], 8, xg)) : (z = w.value) != null && z.context_unknown ? (r(), d("span", _g, [
            A(ie, {
              name: "gauge",
              size: 12
            }),
            O[15] || (O[15] = V(" Context: unknown", -1))
          ])) : k("", !0),
          g.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${g.value}: change the model`,
            onClick: O[3] || (O[3] = (x) => p("model") ? u(x, "model") : null)
          }, [
            A(ie, {
              name: "model",
              size: 12
            }),
            V(" " + v(g.value), 1)
          ], 8, Mg)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: O[4] || (O[4] = (x) => u(x, "effort"))
          }, [
            A(ie, {
              name: "bolt",
              size: 12
            }),
            V(" " + v(b.value), 1)
          ], 8, Cg)) : k("", !0),
          Q.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: O[5] || (O[5] = (x) => a("open", "cost", x.currentTarget))
          }, v(Q.value), 9, Ag)) : k("", !0),
          e.branch ? (r(), d("span", Eg, [
            A(ie, {
              name: "branch",
              size: 12
            }),
            V(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: O[6] || (O[6] = (x) => a("open", "jobs", x.currentTarget))
          }, [
            A(ie, {
              name: "clock",
              size: 12
            }),
            V(" " + v(e.jobs), 1)
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
            V(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(R, { key: 8 }, [
            h("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < qg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: O[7] || (O[7] = (x) => a("open", "fitness", x.currentTarget))
            }, [
              A(ie, {
                name: "heart",
                size: 12
              }),
              V(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: Y(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: O[8] || (O[8] = (x) => a("open", "load", x.currentTarget))
            }, [
              A(ie, {
                name: "weight",
                size: 12
              }),
              V(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: O[9] || (O[9] = (x) => u(x, "start"))
        }, [
          A(ie, {
            name: "agents",
            size: 12
          }),
          O[16] || (O[16] = V(" Start an agent", -1))
        ])) : k("", !0),
        O[22] || (O[22] = h("span", { class: "space" }, null, -1)),
        B(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: B(s).failure.value
        }, v(B(s).failure.value), 9, Og)) : k("", !0),
        ne(D.$slots, "default", {}, void 0, !0),
        o.value ? (r(), P(tn, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: q(() => {
            var x;
            return [
              l.value === "agent" ? (r(), d(R, { key: 0 }, [
                B(s).asking.value ? (r(), d(R, { key: 0 }, [
                  A(wt, { "data-agent-stop-ask": "" }, {
                    default: q(() => [...O[17] || (O[17] = [
                      V("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: O[10] || (O[10] = (y) => (c(), B(s).stop()))
                  }, {
                    default: q(() => [...O[18] || (O[18] = [
                      V("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(ze, {
                    onClick: O[11] || (O[11] = (y) => B(s).asking.value = !1)
                  }, {
                    default: q(() => [...O[19] || (O[19] = [
                      V("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), P(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: O[12] || (O[12] = (y) => B(s).asking.value = !0)
                }, {
                  default: q(() => [...O[20] || (O[20] = [
                    V("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(R, { key: 1 }, [
                A(wt, null, {
                  default: q(() => [...O[21] || (O[21] = [
                    V("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(R, null, X(B(s).programs.value, (y) => (r(), P(ze, {
                  key: y.name,
                  "data-agent-program": y.name,
                  onClick: ($) => (c(), B(s).start(y))
                }, {
                  default: q(() => [
                    V(v(y.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), P(pg, {
                key: 2,
                skills: e.skills,
                onBrowse: O[13] || (O[13] = (y) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(R, { key: 3 }, [
                A(wt, null, {
                  default: q(() => [
                    V(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(R, { key: 0 }, [
                  h("p", Tg, v(B(av)(((x = w.value) == null ? void 0 : x.last_compaction) ?? null)), 1),
                  h("div", Ig, [
                    h("span", Bg, [
                      h("span", {
                        style: ge({ width: `${M.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Rg, v(M.value) + "%", 1)
                  ]),
                  N.value ? (r(), d("p", Ng, [
                    V(v(N.value) + " ", 1),
                    U.value ? (r(), P(go, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && C.value ? (r(), d("p", Lg, v(C.value), 1)) : (r(!0), d(R, { key: 2 }, X(i.value.choices, (y) => (r(), P(ze, {
                  key: y.value,
                  "data-agent-choice": y.value,
                  onClick: ($) => (B(s).choose(i.value.key, y), c())
                }, {
                  default: q(() => [
                    V(v(y.label), 1)
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
}, Pg = /* @__PURE__ */ H(Dg, [["__scopeId", "data-v-d7113347"]]), jg = {
  class: "who",
  "data-agent-who": ""
}, Fg = { class: "name" }, Wg = ["data-agent-state"], Hg = {
  class: "sub",
  "data-agent-started-by": ""
}, zg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", jg, [
      h("h2", Fg, [
        h("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, Wg),
        V(v(e.name), 1)
      ]),
      A(Pg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", Hg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, Ug = /* @__PURE__ */ H(zg, [["__scopeId", "data-v-83bd4a9d"]]), Vg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Gg = { class: "scroll" }, Kg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Yg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Qg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ir(), a = _(null), s = _(null), o = _(null), l = _(null), i = _({}), u = _({ helpers: 0, skills: 0 }), c = _(0), f = _([]), m = _([]), p = _("");
    let g = 0;
    const b = S(() => {
      var T;
      return a.value.ended_at ? gv(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function w() {
      const T = ++g, U = await t.read(["usage", "inspector", sr(t.id), "--environment", t.environment]);
      T === g && (p.value = U.ok ? "" : U.error, U.ok && (a.value = U.value.agent, s.value = U.value.facts, o.value = U.value.inspection, l.value = U.value.compaction ?? null, i.value = U.value.tool, u.value = { helpers: U.value.helpers, skills: U.value.skills }, f.value = U.value.points, m.value = U.value.programs, c.value += 1));
    }
    const M = S(() => /* @__PURE__ */ new Set([t.id])), C = {
      agent: (T) => mi(T, M.value),
      hook_call: (T) => Yc(T, "session_agent_id", M.value)
    };
    return Bn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], w, (T) => {
      var U;
      return ((U = C[T.event.split(".")[0]]) == null ? void 0 : U.call(C, T)) ?? !0;
    }), Ce(w), (T, U) => {
      var W, N;
      return r(), d("article", Vg, [
        h("div", Gg, [
          p.value ? (r(), d("p", Kg, v(p.value), 1)) : a.value && o.value ? (r(), d(R, { key: 1 }, [
            A(Ug, {
              name: B(Kt)(a.value, s.value).text,
              state: B(pv)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(rg, {
              cells: B(vv)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            A(Qv, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(Mv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(ag, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(Pv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: B(yv)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Yg, "Ended " + v(B(In)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), P(tt, { key: 2 }))
        ])
      ]);
    };
  }
}, OC = /* @__PURE__ */ H(Qg, [["__scopeId", "data-v-b88512f5"]]);
function Xg(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ce(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const Jg = ["data-comment-id"], Zg = {
  key: 0,
  class: "comment-top"
}, ey = { class: "comment-mark" }, ty = {
  class: "comment-body",
  "data-comment": ""
}, ny = { class: "comment-foot" }, ay = {
  key: 1,
  "data-comment-lost": ""
}, sy = {
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
      e.comment.quote ? (r(), d("div", Zg, [
        h("span", ey, v(e.comment.number), 1),
        h("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", ty, v(e.comment.body), 1),
      h("div", ny, [
        e.comment.created_at ? (r(), P(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", ay, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Jg));
  }
}, cr = /* @__PURE__ */ H(sy, [["__scopeId", "data-v-a37d4507"]]);
var Zl;
/Mac|iPhone|iPad/.test(((Zl = navigator.userAgentData) == null ? void 0 : Zl.platform) || navigator.platform);
function dr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const oy = {
  class: "comment-box",
  "data-comment-box": ""
}, ly = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, iy = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, ry = { class: "comment-row" }, uy = ["placeholder"], cy = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Bt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Bt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Gt(e, "draft"), l = _(""), i = _(!1), u = _(null), c = S(() => {
      var g;
      return ((g = a.selection) == null ? void 0 : g.selection_type) === "code";
    }), f = S(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const g = o.value.trim();
      if (!(!g || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(g), o.value = "", await qe(), m();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (g, b) => (r(), d("div", oy, [
      e.selection ? (r(), d("div", ly, [
        b[3] || (b[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(Ma, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (w) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", iy, v(l.value), 1)) : k("", !0),
      h("div", ry, [
        we(h("textarea", {
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
          onKeydown: b[2] || (b[2] = ot((w) => B(dr)(w, p), ["enter"]))
        }, null, 42, uy), [
          [Ye, o.value]
        ]),
        A(ve, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: q(() => [...b[4] || (b[4] = [
            V("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, dy = /* @__PURE__ */ H(cy, [["__scopeId", "data-v-41d2081c"]]), Vn = (e) => e ? e.split(", ") : [];
function fy({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function my(e, t) {
  return {
    reads: Vn(e.reads_allowed),
    runs: Vn(e.runs_allowed),
    missing: [...Vn(e.reads_missing), ...Vn(e.runs_missing)],
    ask: t
  };
}
const hy = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = qu("SkeletonParts", !0);
      return r(!0), d(R, null, X(e.parts, (u, c) => (r(), d(R, { key: c }, [
        (r(!0), d(R, null, X(u.count, (f) => (r(), P(en, {
          key: f,
          value: u.shape
        }, {
          line: q(() => [
            A(cn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            A(cn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            A(cn, {
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
}), py = /* @__PURE__ */ H(hy, [["__scopeId", "data-v-fa8baeaf"]]), vy = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, gy = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", vy, [
      A(py, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, yo = /* @__PURE__ */ H(gy, [["__scopeId", "data-v-52f66b64"]]), fr = {
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
}, yy = { class: "bars" }, by = { class: "bar-name" }, ky = { class: "bar-value" }, wy = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = S(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", yy, [
      (r(!0), d(R, null, X(e.items, (u, c) => (r(), P(Xe(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: q(() => [
          h("span", by, v(u.label), 1),
          A(Fi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", ky, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, $y = /* @__PURE__ */ H(wy, [["__scopeId", "data-v-663427f4"]]), xy = { class: "bars" }, Sy = {
  key: 0,
  class: "bars-title"
}, _y = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", xy, [
      e.node.title ? (r(), d("span", Sy, v(e.node.title), 1)) : k("", !0),
      A($y, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, My = /* @__PURE__ */ H(_y, [["__scopeId", "data-v-7135bb11"]]), Cy = {
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
      (r(!0), d(R, null, X(e.node.children || [], (u, c) => (r(), P(pr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, mr = /* @__PURE__ */ H(Cy, [["__scopeId", "data-v-d142a3f4"]]), Ay = {
  key: 0,
  class: "card-head"
}, Ey = { class: "card-title" }, Oy = {
  key: 0,
  class: "card-note"
}, Ty = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Ay, [
        h("span", Ey, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Oy, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A(mr, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Iy = /* @__PURE__ */ H(Ty, [["__scopeId", "data-v-67b72d40"]]), By = { class: "fact" }, Ry = { class: "fact-label" }, Ny = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", By, [
      h("span", Ry, v(e.label), 1),
      A(ut, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ly = /* @__PURE__ */ H(Ny, [["__scopeId", "data-v-3a88ecf8"]]), qy = { class: "list" }, Dy = { class: "list-label" }, Py = {
  key: 1,
  class: "list-note"
}, jy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", qy, [
      (r(!0), d(R, null, X(e.items, (o, l) => (r(), P(Xe(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          h("span", Dy, v(o.label), 1),
          o.badge ? (r(), P(go, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", Py, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Fy = /* @__PURE__ */ H(jy, [["__scopeId", "data-v-ebe2ae0a"]]), kn = (e, t = 40) => e.length > t ? `${e.slice(0, t - 1)}…` : e;
async function Yt(e, t, n) {
  n(await er(e) ? `Copied ${t || kn(e)}` : "The browser did not allow copying");
}
function TC({ word: e = "Delete", name: t, remove: n, restore: a = null, erase: s = !1 }) {
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
const Ya = Symbol.for("journal.context-place"), Qt = {
  mounted(e, t) {
    e[Ya] = t.value;
  },
  updated(e, t) {
    e[Ya] = t.value;
  },
  unmounted(e) {
    delete e[Ya];
  }
}, Wy = { class: "table" }, Hy = {
  key: 0,
  class: "table-row empty"
}, zy = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` })), o = (l) => {
      const i = l.cells.join(" ").replace(/\s+/g, " ").trim();
      return {
        head: kn(i, 40),
        items: [
          { label: "Open", group: "open", disabled: !l.open, reason: "Nothing to open", run: () => a("open", l.open) },
          { label: "Copy number", group: "copy", run: ({ say: u }) => Yt(String(l.cells[0] ?? ""), "", u) },
          { label: "Copy row", group: "copy", run: ({ say: u }) => Yt(i, "the row", u) }
        ]
      };
    };
    return (l, i) => (r(), d("div", Wy, [
      h("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (r(!0), d(R, null, X(e.columns, (u) => (r(), d("span", {
          key: u,
          class: "cell"
        }, v(u), 1))), 128))
      ], 4),
      (r(!0), d(R, null, X(e.rows, (u, c) => we((r(), P(Xe(u.open ? "button" : "div"), {
        key: c,
        type: u.open ? "button" : void 0,
        class: Y(["table-row", u.tone, { opens: u.open }]),
        style: ge(s.value),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(u.cells, (f, m) => (r(), d("span", {
            key: m,
            class: "cell"
          }, v(f), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"])), [
        [B(Qt), () => o(u)]
      ])), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Hy, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, hr = /* @__PURE__ */ H(zy, [["__scopeId", "data-v-07aa7ad1"]]), Uy = { class: "stat-value" }, Vy = { class: "stat-label" }, Gy = {
  key: 0,
  class: "stat-note"
}, Ky = {
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
    return (a, s) => (r(), P(Xe(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        h("span", Uy, v(e.value), 1),
        h("span", Vy, v(e.label), 1),
        e.note ? (r(), d("span", Gy, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Yy = /* @__PURE__ */ H(Ky, [["__scopeId", "data-v-ad0db6d6"]]), Qy = { class: "code" }, Xy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = S(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), P(en, { value: s.value }, {
      group: q(() => [
        A(mr, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        A(Iy, {
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
        A(Yy, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        A(My, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        A(hr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        A(Fy, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        A(ut, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        A(Ly, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        A(go, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        h("pre", Qy, [
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
}), pr = /* @__PURE__ */ H(Xy, [["__scopeId", "data-v-b9156b43"]]), Jy = { class: "dashboard" }, Zy = { class: "trail" }, e0 = ["onClick"], t0 = {
  key: 0,
  class: "gone",
  role: "status"
}, n0 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = S(() => l.value.at(-1) || n.document.start), u = S(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, g) => (r(), d("div", Jy, [
      e.document.broken ? (r(), P(xt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          V(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), P(xt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          V(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(R, { key: 2 }, [
        h("nav", Zy, [
          h("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (b) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(R, null, X(l.value, (b, w) => (r(), d(R, {
            key: `${w}-${b}`
          }, [
            g[2] || (g[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: Y(["step", { current: w === l.value.length - 1 }]),
              onClick: (M) => m(w + 1)
            }, v(c(b)), 11, e0)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", t0, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(Zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(pr, {
                node: u.value.view,
                onOpen: f,
                onFile: g[1] || (g[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, a0 = /* @__PURE__ */ H(n0, [["__scopeId", "data-v-fbe83734"]]);
function s0(e, t) {
  const n = lt(), a = Zs(e, fr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ce(e), et(() => {
    s(), a.cancel();
  });
}
const o0 = {
  key: 0,
  class: "window-failure"
}, l0 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = lt(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? s0(l, n.events) : Xs(l, () => !0, fr.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", o0, v(o.value.error), 1)) : o.value ? (r(), P(a0, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, i0 = 1e4;
class r0 {
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
    return this.heardAt !== null && t - this.heardAt > i0;
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
const u0 = {
  key: 0,
  class: "frame-note"
}, c0 = {
  key: 0,
  class: "frame-note"
}, d0 = ["src", "title"], f0 = 1e3, m0 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = lt(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Ce(() => {
      l = new r0(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, f0);
    }), Ne(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", u0, "This window was closed because it stopped answering.")) : (r(), d(R, { key: 1 }, [
      s.value ? (r(), d("div", c0, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(ve, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: q(() => [...c[1] || (c[1] = [
            V("Close the window", -1)
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
      }, null, 8, d0)
    ], 64));
  }
}, h0 = /* @__PURE__ */ H(m0, [["__scopeId", "data-v-32a49046"]]), p0 = {
  class: "allowance-prompt",
  role: "dialog"
}, v0 = { class: "allowance-prompt-text" }, g0 = { class: "allowance-prompt-buttons" }, y0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", p0, [
      h("p", v0, v(B(fy)(e.request)), 1),
      h("div", g0, [
        A(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            V("Allow", -1)
          ])]),
          _: 1
        }),
        A(ve, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            V("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, b0 = /* @__PURE__ */ H(y0, [["__scopeId", "data-v-cad69fe2"]]), Qa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(xt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        V(v(e.reason) + " ", 1),
        e.retry ? (r(), P(ve, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            V("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), P(ve, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            V("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, k0 = ["data-window", "data-agent"], w0 = {
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
    const i = _e(ld, null), u = yf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: S(() => n.options),
      declared: n.declared,
      page: _e(mf, null),
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
    Gs(Re, u), me(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ce(u.settle), Ne(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Du((m) => (s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => $a(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), P(b0, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), P(Qa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), P(Qa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(R, { key: 4 }, [
        (r(), P(c, { key: o.value })),
        e.skeleton.length && !B(u).answered.value ? (r(), P(yo, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), P(Qa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, k0));
  }
}, dn = /* @__PURE__ */ H(w0, [["__scopeId", "data-v-c4443e2b"]]), vr = {
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
    const n = e, a = t, s = { render: () => $a(h0, { src: n.entry.entry_url }) };
    return (o, l) => (r(), P(dn, {
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
}, $0 = ["data-window"], gr = {
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
    const n = e, a = t, s = st(null), o = _("");
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, $c();
          } catch (i) {
            if (kc(i) && wc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(yo, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, $0)) : (r(), P(dn, {
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
}, x0 = {
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
    const n = t, a = e, s = S(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = S(() => s.value && { render: () => $a(l0, { line: s.value.line, events: s.value.events }) }), l = _(null), i = S(() => {
      var p, g;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), u = S(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = S(
      () => {
        var p, g;
        return l.value ? my(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
        var p, g;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, g) => {
      var b, w;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), P(yo, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((w = s.value) == null ? void 0 : w.shows) === "one-agent" && e.agent === null ? (r(), P(xt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), P(dn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), P(gr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (M, C) => n("option", M, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), P(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (M, C) => n("option", M, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), P(dn, {
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
        onOption: g[2] || (g[2] = (M, C) => n("option", M, C))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), P(dn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (M) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, S0 = ["data-section"], _0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, M0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _e(oo, null), a = S(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = S(() => ({ row: t.row }));
    return (o, l) => B(n) ? (r(!0), d(R, { key: 0 }, X(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), P(x0, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", _0, v(i.name) + " is not available", 1))
    ], 8, S0))), 128)) : k("", !0);
  }
}, Bs = /* @__PURE__ */ H(M0, [["__scopeId", "data-v-a47d36b7"]]), C0 = { class: "rail-head" }, A0 = { key: 0 }, E0 = {
  key: 1,
  class: "rail-none"
}, O0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", C0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", A0, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(R, { key: 0 }, X(e.comments, (a) => (r(), P(cr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", E0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, T0 = /* @__PURE__ */ H(O0, [["__scopeId", "data-v-4d684649"]]), I0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, B0 = ["aria-pressed"], R0 = ["aria-pressed"], N0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, L0 = {
  key: 0,
  role: "alert"
}, q0 = {
  key: 1,
  class: "sidebar-none"
}, D0 = ["data-question-id"], P0 = { class: "question-state" }, j0 = ["data-question-show", "onClick"], F0 = {
  key: 0,
  class: "sidebar-none"
}, W0 = {
  key: 1,
  class: "question-answer"
}, H0 = {
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
    const t = _e(oo, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", I0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, B0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, R0)
      ]),
      e.mode === "comments" ? (r(), d(R, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), P(T0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(An, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", N0, [
        e.failure ? (r(), d("p", L0, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", q0, "No questions about this text yet.")),
        (r(!0), d(R, null, X(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", P0, v(B(vn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, j0),
            s.quote ? (r(), d(R, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", F0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", W0, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(Bs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(co, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, D0);
        }), 128))
      ]))
    ], 2));
  }
}, dl = /* @__PURE__ */ H(H0, [["__scopeId", "data-v-660e5c85"]]), z0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, U0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Jt({ abstract: n.row.abstract, body: n.row.body }), o = _("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), P(En, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: q(() => [
        h("span", z0, v(o.value), 1),
        A(ve, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: q(() => [...u[6] || (u[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ve, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: q(() => [...u[7] || (u[7] = [
            V("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: q(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: be(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            we(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Ye, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            we(h("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Ye, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, V0 = /* @__PURE__ */ H(U0, [["__scopeId", "data-v-464d77a8"]]);
function yr(e, t) {
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
      const U = T.value.rows ?? [], W = b === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(W.map((N) => [N.id, N])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      C === c && (i.value = T.message);
    } finally {
      C === c && (l.value = !1);
    }
  }
  async function p(b) {
    var N;
    const { term: w, id: M } = e(), C = `${w}:${M}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const U = await t([w, "comment", String(M), b]);
    if (C !== `${e().term}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((Q) => Q.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await m();
    const W = (N = U.value) == null ? void 0 : N.id;
    W && !n.value.some((Q) => Q.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const g = () => !l.value && s.value && m(s.value);
  return me(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: g, nextPage: s, total: o, loading: l, failure: i };
}
function G0(e, t) {
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
const K0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, Y0 = ["datetime"], Q0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, X0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, J0 = {
  key: 2,
  class: "document-none"
}, Z0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = S(() => s.value ? G0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", K0, [
      e.editing ? (r(), P(ve, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (m) => a("close-revision"))
      }, {
        default: q(() => [...f[1] || (f[1] = [
          V("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(R, { key: 1 }, [
        (r(!0), d(R, null, X(e.revisions, (m) => (r(), P(ve, {
          key: m.number,
          variant: "text",
          "data-text-revision": m.number,
          onClick: (p) => i(m)
        }, {
          default: q(() => [
            V("Revision " + v(m.number) + ": " + v(m.change) + " · " + v(m.author_name) + " · ", 1),
            h("time", {
              datetime: m.created_at
            }, v(m.created_at.slice(0, 16).replace("T", " ")), 9, Y0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", Q0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(R, { key: 1 }, [
          A(ve, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: q(() => [...f[2] || (f[2] = [
              V("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", X0, [
            (r(!0), d(R, null, X(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: Y(["revision-line", m.type])
            }, v(m.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", J0, "No revisions"))
    ]));
  }
}, eb = /* @__PURE__ */ H(Z0, [["__scopeId", "data-v-3a381aa4"]]), tb = "button, [data-comment-number]", nb = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function br(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(tb) || n.push(t.currentNode);
  return n;
}
function fl(e, t, n) {
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
const ab = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function sb(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = br(e), s = a.map((c) => c.data).join(""), o = fl(a, n.startContainer, n.startOffset), l = s.slice(o, fl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: ab(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function ob(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function lb(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Xa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function ib({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function rb(e, t) {
  const n = br(e), a = ob(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = lb(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(ib).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Xa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Xa(t.number, t.id, t.label)) : l.at(-1).append(Xa(t.number, t.id, t.label))), !0;
}
function ub(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !rb(e, a) && a.id && n.push(a.id);
  return n;
}
const cb = (e) => e.closest(nb) ?? e;
function ml(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const db = {
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
      const w = a.comments.filter((U) => U.quote).map((U) => ({ ...U, label: a.annotationLabel, hot: U.id === a.hot })), M = ub(l.value, a.pending ? [...w, { ...a.pending, pending: !0 }] : w);
      s("lost", M);
      const C = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!C) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", cb(C).after(T), c.value = T;
    }
    function m() {
      if (!l.value) return;
      const w = sb(l.value);
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
    function g(w) {
      var M;
      (M = l.value.querySelector(`[data-comment="${w}"]`)) == null || M.scrollIntoView({ block: "center" });
    }
    function b(w) {
      var M;
      (M = l.value.querySelectorAll("h3, h4, h5, h6")[w]) == null || M.scrollIntoView({ block: "start" });
    }
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Ce(() => {
      f(), document.addEventListener("selectionchange", m);
    }), et(() => document.removeEventListener("selectionchange", m)), t({ show: g, showHeading: b, nextTick: qe }), (w, M) => (r(), d("div", {
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
        onMousedown: M[0] || (M[0] = be(() => {
        }, ["prevent"])),
        onClick: M[1] || (M[1] = (C) => s("write"))
      }, [
        A(ie, {
          name: "chat",
          size: 13
        }),
        M[2] || (M[2] = V("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), P(Cn, {
        key: 1,
        to: c.value
      }, [
        ne(w.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ne(w.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, fb = /* @__PURE__ */ H(db, [["__scopeId", "data-v-a92386e6"]]), mb = { class: "document-tabs" }, hb = ["aria-pressed"], pb = { class: "document-body" }, vb = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, gb = {
  key: 1,
  class: "document-loading"
}, yb = {
  class: "document-details",
  "data-resource-fields": ""
}, bb = 760, kb = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _e(pi, _(null)), a = _(null), s = Xg(a), o = S(() => s.value !== null && s.value < bb), l = _(null), i = _(""), u = _([]), c = _([]), f = _(""), m = _("comments"), p = _("text"), g = _(0), b = _(!1), w = _(0), M = _([]), C = _(null), T = _(""), U = _(!1), W = _(null), N = _(null);
    let Q = 0;
    const D = yr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (he) => t.read(he)), O = S(() => ml(D.comments.value)), L = S(() => m.value === "questions" ? ml(c.value) : O.value), z = S(() => m.value === "questions" ? L.value.length : D.total.value), x = S(() => {
      var he;
      return (he = l.value) != null && he.body ? mo(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), y = S(() => {
      var he;
      return (((he = l.value) == null ? void 0 : he.body) ?? "").split(`
`).filter((le) => /^#{1,4} /.test(le)).map((le, ae) => ({ key: String(ae), value: ae, label: le.replace(/^#+ /, "") }));
    }), $ = S(() => O.value.find((he) => he.id === w.value)), E = S(() => {
      var he;
      return (he = l.value) != null && he.close_reason ? "Closed" : "Open";
    }), I = S(() => p.value === "comments" && !o.value ? "text" : p.value), j = (he) => he.ok ? he.value.rows ?? [] : [];
    async function G() {
      const he = ++Q, le = await t.read([t.term, "inspect", String(t.id)]);
      if (he !== Q) return;
      i.value = le.ok ? "" : le.error, l.value = le.ok ? le.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), ye = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      he === Q && (c.value = j(ae), f.value = ae.ok ? "" : ae.error, u.value = ye ? j(ye) : []);
    }
    async function Z(he) {
      const le = C.value ? ["--quote", C.value.quote, "--position", String(C.value.position), "--selection-type", C.value.selection_type] : [], ae = await t.read([t.term, "comment", String(t.id), ...le, "--", he]);
      if (!ae.ok) throw new Error(ae.error);
      C.value = null, await Promise.all([G(), D.load()]);
    }
    async function oe() {
      const he = await t.read(["doc", "close", String(t.id)]);
      i.value = he.ok ? "" : he.error, he.ok && await G();
    }
    function ce() {
      T.value.trim() || (C.value = null);
    }
    async function $e(he) {
      var le;
      if (g.value = he, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        w.value = w.value === he ? 0 : he;
        return;
      }
      b.value = !0, await qe(), (le = a.value.querySelector(m.value === "questions" ? `[data-question-id="${he}"]` : `[data-comment-id="${he}"]`)) == null || le.scrollIntoView({ block: "nearest" });
    }
    async function Ae(he) {
      var le, ae;
      p.value = "text", g.value = he, await ((le = W.value) == null ? void 0 : le.nextTick()), (ae = W.value) == null || ae.show(he);
    }
    function He() {
      U.value = !1, G();
    }
    return me(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", b.value = !1, g.value = 0, w.value = 0, C.value = null, c.value = [], f.value = "", G();
    }, { immediate: !0 }), me(m, () => {
      g.value = 0, w.value = 0;
    }), (he, le) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), P(Cn, {
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
            onClick: le[0] || (le[0] = (ae) => U.value = !0)
          }, {
            default: q(() => [...le[15] || (le[15] = [
              V("Edit", -1)
            ])]),
            _: 1
          }),
          I.value === "text" && y.value.length > 1 ? (r(), P(to, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: y.value,
            "data-text-chapters": "",
            onPick: le[1] || (le[1] = (ae) => {
              var ye;
              return (ye = W.value) == null ? void 0 : ye.showHeading(ae.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", mb, [
        h("button", {
          type: "button",
          class: Y(["document-tab-button", { on: I.value === "text" }]),
          "data-document-tab": "text",
          onClick: le[2] || (le[2] = (ae) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: I.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: le[3] || (le[3] = (ae) => p.value = "comments")
        }, [
          V(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(z.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: le[4] || (le[4] = (ae) => b.value = !b.value)
        }, [
          V(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(z.value || ""), 1)
        ], 10, hb)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: I.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: le[5] || (le[5] = (ae) => p.value = "revisions")
        }, [
          le[16] || (le[16] = V("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      h("div", pb, [
        i.value ? (r(), d("p", vb, v(i.value), 1)) : l.value ? I.value === "revisions" ? (r(), P(eb, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: oe,
          onRestored: G
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : I.value === "comments" ? (r(), P(dl, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": le[6] || (le[6] = (ae) => m.value = ae),
          tab: "",
          comments: O.value,
          questions: c.value,
          hot: g.value,
          lost: M.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!B(D).nextPage.value,
          "comment-loading": B(D).loading.value,
          "comment-failure": B(D).failure.value,
          "comment-total": B(D).total.value,
          onMore: B(D).loadMore,
          onShow: Ae,
          onChanged: G
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(R, { key: 4 }, [
          A(fb, {
            ref_key: "words",
            ref: W,
            html: x.value,
            comments: L.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: g.value,
            pending: C.value,
            inline: w.value,
            onSelect: le[8] || (le[8] = (ae) => C.value = ae),
            onClear: ce,
            onNumber: $e,
            onWrite: le[9] || (le[9] = (ae) => {
              var ye;
              return (ye = N.value) == null ? void 0 : ye.focus();
            }),
            onLost: le[10] || (le[10] = (ae) => M.value = ae)
          }, {
            inline: q(() => [
              $.value ? (r(), P(cr, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: le[7] || (le[7] = (ae) => Ae($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: q(() => [
              h("dl", yb, [
                le[18] || (le[18] = h("h4", null, "Details", -1)),
                le[19] || (le[19] = h("dt", null, "State", -1)),
                h("dd", null, v(E.value), 1),
                l.value.close_reason ? (r(), d(R, { key: 0 }, [
                  le[17] || (le[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                le[20] || (le[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  A(Ze, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                le[21] || (le[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  A(Ze, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), P(dl, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": le[11] || (le[11] = (ae) => m.value = ae),
            comments: O.value,
            questions: c.value,
            hot: g.value,
            lost: M.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!B(D).nextPage.value,
            "comment-loading": B(D).loading.value,
            "comment-failure": B(D).failure.value,
            "comment-total": B(D).total.value,
            onMore: B(D).loadMore,
            onShow: Ae,
            onChanged: G
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", gb, [
          A(tt)
        ]))
      ]),
      l.value ? (r(), P(dy, {
        key: 1,
        ref_key: "composer",
        ref: N,
        draft: T.value,
        "onUpdate:draft": le[12] || (le[12] = (ae) => T.value = ae),
        selection: C.value,
        send: Z,
        narrow: o.value,
        onClear: le[13] || (le[13] = (ae) => C.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      U.value ? (r(), P(V0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: le[14] || (le[14] = (ae) => U.value = !1),
        onSaved: He
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, IC = /* @__PURE__ */ H(kb, [["__scopeId", "data-v-f9bd78a7"]]), wb = {
  key: 1,
  class: "row-list-failure"
}, $b = ["data-row"], xb = {
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
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), P(tt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", wb, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), P(xt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        V(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(R, { key: 3 }, [
      (r(), P(Xe(e.arrival || e.moves ? Ks : "ul"), Fe(n.value, { class: "row-list" }), {
        default: q(() => [
          (r(!0), d(R, null, X(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ne(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, $b))), 128))
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
}, Sb = /* @__PURE__ */ H(xb, [["__scopeId", "data-v-e9f251f3"]]), _b = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Mb = {
  key: 1,
  class: "agent-rows-note"
}, Cb = {
  key: 2,
  class: "agent-rows-note"
}, Ab = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Eb = ["data-agent-row", "onClick"], Ob = { class: "agent-row-name" }, Tb = { class: "agent-row-state" }, Ib = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = S(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", _b, [
      e.loaded ? e.failure ? (r(), d("p", Mb, v(e.failure), 1)) : e.rows.length ? (r(), d(R, { key: 3 }, [
        h("p", Ab, v(a.value) + " running", 1),
        (r(!0), d(R, null, X(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(je)(`agents:${l.id}`)
        }, [
          h("span", Ob, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Tb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Eb))), 128))
      ], 64)) : (r(), d("p", Cb, v(e.none), 1)) : (r(), P(tt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, BC = /* @__PURE__ */ H(Ib, [["__scopeId", "data-v-a01e5a17"]]), vt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ke = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ge = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Bb = 6;
function bo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Rb = (e) => {
  const t = bo(e, vt.lineChars), n = Math.max(vt.minWidth, Math.max(...t.map((a) => a.length)) * vt.charWidth + vt.padX * 2);
  return { name: e, lines: t, line: vt.line, padY: vt.padY, width: n, height: t.length * vt.line + vt.padY * 2 };
};
function Nb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Lb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function qb(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const m = i(f).map((p) => u.get(p));
      return m.length ? m.reduce((p, g) => p + g, 0) / m.length : u.get(f);
    };
    return [...l].sort((f, m) => c(f) - c(m));
  };
  for (let l = 0; l < Bb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function Db(e, t) {
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
function Pb(e) {
  const t = [...new Set(e.flatMap(([W, N]) => [W, N]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = Nb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, N) => !s.has(N)), l = Lb(t, o), i = qb(t, o, l), u = new Map(t.map((W) => [W, Rb(W)])), c = i.map((W) => W.reduce((N, Q) => N + u.get(Q).width, 0) + Ge.across * (W.length - 1)), f = Math.max(...c) + Ge.margin * 2, m = Fb(e, l, i.length), p = /* @__PURE__ */ new Map();
  let g = Ge.margin;
  i.forEach((W, N) => {
    let Q = (f - c[N]) / 2;
    const D = Math.max(...W.map((O) => u.get(O).height));
    W.forEach((O) => {
      const L = u.get(O);
      p.set(O, { ...L, x: Q, y: g + (D - L.height) / 2 }), Q += L.width + Ge.across;
    }), g += D + (m[N] ?? Ge.down);
  });
  const b = e.map(([W, N, Q], D) => ({ from: W, to: N, label: Q || "", back: s.has(D) || l.get(N) <= l.get(W) }));
  Db(b, p);
  const w = b.map((W) => Wb(W, p.get(W.from), p.get(W.to))), M = [...p.values()], C = Vb(w, M), T = Math.max(g - Ge.down, ...C.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - Ge.margin, ...C.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Ge.margin, height: T + Ge.margin, nodes: M, arrows: C };
}
const jb = (e) => e ? bo(e, Ke.lineChars).length * Ke.line + Ke.pad * 2 : 0;
function Fb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ge.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += jb(l) + Ge.labelSpace);
  }), a.map((s) => Math.max(Ge.down, s));
}
function Wb(e, t, n) {
  const a = e.label ? bo(e.label, Ke.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ke.charWidth + Ke.pad * 2 : 0, o = a.length * Ke.line + (a.length ? Ke.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Hb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, zb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Ub = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ke.line);
function Vb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Hb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Ub.flatMap((u) => zb.map((c) => s(c, u))).find((u) => !n.some((c) => hl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => hl(i, u)); ) i.y += Ke.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ke.line, pad: Ke.pad } };
  });
}
const hl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Gb = { class: "flowchart-tools" }, Kb = ["width", "height", "viewBox", "aria-label"], Yb = ["d"], Qb = ["x", "y", "width", "height"], Xb = ["x", "y"], Jb = ["x", "dy"], Zb = {
  key: 0,
  class: "flowchart-label"
}, ek = ["x", "y", "width", "height"], tk = ["x", "y"], nk = ["x", "dy"], ak = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Pb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var C;
      const w = (C = l.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(w != null && w.width)) return;
      const M = Math.min(w.width / s.value.width, w.height / s.value.height, 1.5);
      i.value = { zoom: M, x: (w.width - s.value.width * M) / 2, y: (w.height - s.value.height * M) / 2 };
    }
    function f(w, M, C) {
      const { zoom: T, x: U, y: W } = i.value, N = Math.min(o.most, Math.max(o.least, T * w));
      i.value = { zoom: N, x: M - (M - U) * N / T, y: C - (C - W) * N / T };
    }
    function m(w) {
      const M = l.value.getBoundingClientRect();
      f(w, M.width / 2, M.height / 2);
    }
    function p(w) {
      const M = l.value.getBoundingClientRect();
      w.ctrlKey || w.metaKey ? f(w.deltaY < 0 ? o.step : 1 / o.step, w.clientX - M.left, w.clientY - M.top) : i.value = { ...i.value, x: i.value.x - w.deltaX, y: i.value.y - w.deltaY };
    }
    function g(w) {
      var M, C, T;
      w.preventDefault(), (M = window.getSelection()) == null || M.removeAllRanges(), u = { x: w.clientX - i.value.x, y: w.clientY - i.value.y }, (T = (C = l.value).setPointerCapture) == null || T.call(C, w.pointerId);
    }
    function b(w) {
      u && (i.value = { ...i.value, x: w.clientX - u.x, y: w.clientY - u.y });
    }
    return Ce(c), (w, M) => (r(), P(En, {
      padded: "",
      title: e.title,
      large: "",
      onClose: M[4] || (M[4] = (C) => a("close"))
    }, {
      default: q(() => [
        h("div", Gb, [
          A(ve, {
            small: "",
            onClick: M[0] || (M[0] = (C) => m(o.step))
          }, {
            default: q(() => [...M[5] || (M[5] = [
              V("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            small: "",
            onClick: M[1] || (M[1] = (C) => m(1 / o.step))
          }, {
            default: q(() => [...M[6] || (M[6] = [
              V("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            small: "",
            onClick: c
          }, {
            default: q(() => [...M[7] || (M[7] = [
              V("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: be(p, ["prevent"]),
          onPointerdown: g,
          onPointermove: b,
          onPointerup: M[2] || (M[2] = (C) => qo(u) ? u.value = null : u = null),
          onPointercancel: M[3] || (M[3] = (C) => qo(u) ? u.value = null : u = null)
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
            (r(!0), d(R, null, X(s.value.arrows, (C, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Yb))), 128)),
            (r(!0), d(R, null, X(s.value.nodes, (C) => (r(), d("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, Qb),
              h("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (r(!0), d(R, null, X(C.lines, (T, U) => (r(), d("tspan", {
                  key: U,
                  x: C.x + C.width / 2,
                  dy: U ? C.line : 0
                }, v(T), 9, Jb))), 128))
              ], 8, Xb)
            ]))), 128)),
            (r(!0), d(R, null, X(s.value.arrows, (C, T) => (r(), d(R, {
              key: `label-${T}`
            }, [
              C.label ? (r(), d("g", Zb, [
                h("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, ek),
                h("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (r(!0), d(R, null, X(C.label.lines, (U, W) => (r(), d("tspan", {
                    key: W,
                    x: C.label.x + C.label.width / 2,
                    dy: W ? C.label.line : 0
                  }, v(U), 9, nk))), 128))
                ], 8, tk)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Kb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, sk = /* @__PURE__ */ H(ak, [["__scopeId", "data-v-e98799dc"]]), ok = ["innerHTML"], lk = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => Vo[t.name] || Vo.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, ok));
  }
}, St = /* @__PURE__ */ H(lk, [["__scopeId", "data-v-beb5935c"]]), ik = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(St, { name: "fold" })
    ], 2));
  }
}, an = /* @__PURE__ */ H(ik, [["__scopeId", "data-v-d03899bb"]]), rk = ["data-tip", "aria-label"], uk = {
  key: 0,
  class: "mact-word"
}, ck = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(St, { name: "open" }),
      e.open ? (r(), d("span", uk, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, rk));
  }
}, kr = /* @__PURE__ */ H(ck, [["__scopeId", "data-v-3b292e09"]]), wr = 120, na = 280, $r = 160, dk = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, fk = ["leaving", "resizing", "entering"];
function Rs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function mk(e) {
  const t = fk.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Rs(e);
  return e.classList.add(...t), n;
}
function xr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const g = mk(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${na}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${na}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, g);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let g = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== g && (g = p.offsetHeight, u(m, Rs(m)));
    });
    return b.observe(p), b;
  }
  async function f(m) {
    const p = e.value, g = ++o;
    if (!p || !p.offsetWidth || dk()) {
      a.value = m;
      return;
    }
    const b = Rs(p);
    if (l(p, b), s.value = "leaving", await n(wr), g !== o) return;
    a.value = m, s.value = "resizing", await qe(), u(p, b);
    const w = c(p);
    await n(na), w == null || w.disconnect(), g === o && (i(p), s.value = "entering", await n($r), g === o && (s.value = ""));
  }
  return me(t, (m) => f(m)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const hk = { class: "growing-card-top" }, pk = ["aria-expanded"], vk = { class: "growing-card-avatar" }, gk = { class: "growing-card-title" }, yk = { class: "growing-card-more" }, bk = { class: "growing-card-body" }, kk = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = xr(o, () => !s.value), u = S(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = S(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", hk, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", vk, [
            e.bad ? (r(), P(St, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(R, { key: 1 }, [
              V(v(u.value), 1)
            ], 64)) : (r(), P(ie, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", gk, v(e.title), 1),
          A(an, { open: s.value }, null, 8, ["open"])
        ], 8, pk),
        e.action ? (r(), P(kr, {
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
      h("div", yk, [
        h("div", bk, [
          (r(!0), d(R, null, X(c.value, (p, g) => (r(), d("p", {
            key: g,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, wk = /* @__PURE__ */ H(kk, [["__scopeId", "data-v-f2b4930d"]]), $k = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, xk = { class: "md inline" }, Sk = ["disabled", "title", "onClick"], _k = {
  key: 1,
  class: "message-links-many"
}, Mk = ["aria-expanded"], Ck = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Ak = ["disabled", "onClick"], Ek = { class: "row-pill message-links-chip" }, Ok = { class: "message-links-title" }, Tk = { key: 0 }, Ja = 3, Ik = "task", Bk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.total || n.links.length), o = S(() => n.links.every((p) => p.endpoint.model === Ik) ? "tasks" : "items"), l = _(!1), i = _(null);
    gi(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, je(p.endpoint.open_ref));
    }
    return (p, g) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ja, three: s.value === Ja, open: l.value }]),
      "data-message-links": ""
    }, [
      A(St, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", $k, [
        h("span", xk, [
          g[1] || (g[1] = V("Linked: ", -1)),
          (r(!0), d(R, null, X(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (w) => m(b)
          }, [
            V(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(R, { key: 0 }, [
              V(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(R, { key: 1 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, Sk))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ja ? (r(), d("span", _k, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          V(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(an, { open: l.value }, null, 8, ["open"])
        ], 8, Mk)
      ])) : k("", !0),
      l.value ? (r(), d("div", Ck, [
        (r(!0), d(R, null, X(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (w) => m(b)
        }, [
          h("span", Ek, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          h("span", Ok, v(b.endpoint.title), 1),
          h("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", Tk, "Unavailable")) : k("", !0)
        ], 8, Ak))), 128))
      ])) : k("", !0),
      A(An, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Rk = /* @__PURE__ */ H(Bk, [["__scopeId", "data-v-843fc3bd"]]), Nk = ["title", "aria-label"], Lk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, qk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Dk = {
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
      (r(), d("svg", Lk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", qk)) : k("", !0)
      ]))
    ], 10, Nk));
  }
}, Pk = /* @__PURE__ */ H(Dk, [["__scopeId", "data-v-6dc92808"]]), jk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Fk = (e) => e.worker_id != null ? "report" : "message", Wk = (e) => jk[Fk(e)], Hk = "img,pre,table";
function zk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Uk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Vk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Hk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = zk(Uk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Gk(e, t) {
  let n = null;
  const a = () => e.value && Vk(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ne(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const pl = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Kk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Gn = /* @__PURE__ */ new WeakMap(), De = "work", at = "sent", Yk = 50, vl = 50, gl = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function Qk(e) {
  var w;
  if (Gn.has(e)) return Gn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (M) => {
    var C;
    return ((C = e.visible) == null ? void 0 : C.value) !== !1 && [...M.views].some((T) => T.visible);
  };
  function o(M, C) {
    const T = M[C], U = ++T.version;
    return T.loading.value = !0, T.failure.value = "", U;
  }
  function l(M, C, T, U, W) {
    const N = M[C];
    if (t.get(M.id) !== M || N.version !== T) return;
    if (N.loading.value = !1, !W.ok) {
      N.failure.value = W.error;
      return;
    }
    const Q = C === De ? W.value.counterparts ?? [] : W.value.rows ?? [], D = U === 1 ? Q : [...N.rows.value, ...Q], O = C === De ? (L) => `${L.endpoint.model}:${L.endpoint.id}` : (L) => L.id ?? L.target_id;
    N.rows.value = [...new Map(D.map((L) => [O(L), L])).values()], N.total.value = W.value.total ?? N.rows.value.length, N.next.value = W.value.next_page ?? null;
  }
  function i(M, C, T, U) {
    const W = M[C];
    W.version === T && (W.failure.value = U.message, W.loading.value = !1);
  }
  async function u(M, C, T) {
    const U = o(M, C), W = C === De ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(M, C, U, T, await e.read(`link list --source message:${M.id} ${W} --page ${T} --page-size ${C === De ? 10 : 25}`));
    } catch (N) {
      i(M, C, U, N);
    }
  }
  async function c(M) {
    const C = M.map((T) => ({ [De]: o(T, De), [at]: o(T, at) }));
    try {
      const T = await e.read(`link receipts --messages ${M.map((U) => U.id).join(",")}`);
      M.forEach((U, W) => {
        const N = T.ok ? T.value.messages[String(U.id)] : null;
        l(U, De, C[W][De], 1, T.ok ? { ok: !0, value: N.named } : T), l(U, at, C[W][at], 1, T.ok ? { ok: !0, value: N.sent } : T);
      });
    } catch (T) {
      M.forEach((U, W) => [De, at].forEach((N) => i(U, N, C[W][N], T)));
    }
  }
  function f() {
    a = null;
    const M = [...n].map((C) => t.get(C)).filter((C) => C && s(C));
    n.clear(), M.forEach((C) => C.dirty.clear());
    for (let C = 0; C < M.length; C += vl) c(M.slice(C, C + vl));
  }
  function m(M, C = [De, at]) {
    for (const T of C) M.dirty.add(T);
    s(M) && (n.add(M.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(M) {
    const C = M.sources ?? (M.source_model && Number.isInteger(M.source_id) ? [{ model: M.source_model, id: M.source_id }] : []), T = M.link_types ?? (M.link_type ? [M.link_type] : []), U = T.length ? [De, at].filter((N) => N === De ? T.some((Q) => ["about", "edited"].includes(Q)) : T.includes("sent_to")) : [De, at];
    if (!U.length) return;
    const W = C.length ? [...new Set(C.filter((N) => N.model === "message").map((N) => N.id))].map((N) => t.get(N)).filter(Boolean) : [...t.values()].filter(s).slice(0, Yk);
    for (const N of W) m(N, U);
  }
  const g = (w = e.follow) == null ? void 0 : w.call(e, ["link.*"], p), b = {
    attach(M, C) {
      let T = t.get(M);
      return T || (T = { id: M, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([De, at]), work: gl(), sent: gl() }, t.set(M, T)), T.views.add(C), T.dirty.size && m(T, [...T.dirty]), T;
    },
    shown(M) {
      M.dirty.size && m(M, [...M.dirty]);
    },
    detach(M, C) {
      M.views.delete(C), M.views.size || t.delete(M.id), t.size || (clearTimeout(a), g == null || g(), Gn.delete(e));
    },
    more(M, C) {
      const T = M == null ? void 0 : M[C];
      if (T != null && T.next.value && !T.loading.value) return u(M, C, T.next.value);
    }
  };
  return Gn.set(e, b), b;
}
function Xk(e, t, n) {
  const a = st(null);
  let s = null;
  const o = me(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Qk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = me(n, (g) => {
      m == null || m.disconnect(), g && (m == null || m.observe(g));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return _a(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, De),
    loadSent: () => s == null ? void 0 : s.more(a.value, at)
  };
}
const Jk = ["data-incoming", "data-ref"], Zk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], ew = { class: "message-body" }, tw = ["title"], nw = ["innerHTML"], aw = ["innerHTML"], sw = {
  class: "message-faces",
  "data-message-faces": ""
}, ow = ["title", "data-face", "onClick"], lw = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, iw = ["title", "data-reaction", "onClick"], rw = {
  key: 0,
  class: "message-reaction-count"
}, uw = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, cw = ["href", "title"], dw = ["src", "alt"], fw = ["href"], mw = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, hw = { class: "message-foot" }, pw = { class: "message-time" }, vw = {
  class: "message-id",
  "data-message-id": ""
}, gw = 1500, yw = "An earlier message", bw = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = S(() => ["user", "comment"].includes(n.message.type)), i = S(() => {
      const [ae, ye] = (n.message.commented_row || ":").split(":"), F = kt(ae);
      return F ? { ref: `${F}:${ye}`, label: `${nn(F).title.toLowerCase()} ${ye}` } : null;
    }), u = S(() => n.message.worker_id ?? null), c = S(() => Wk(n.message)), f = S(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ae;
      await ((ae = navigator.clipboard) == null ? void 0 : ae.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, gw);
    }
    const p = Vi(), g = S(() => p(n.message.text ?? "")), b = S(() => JSON.parse(n.message.flowchart_edges || "[]")), w = _(!1), M = S(() => Os(n.quote)), C = S(() => p(M.value || yw));
    function T() {
      const ae = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ae ? ae.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    Gk(o, () => `${n.message.text} ${M.value}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (ae) => `/api/files/message/${n.message.id}/${encodeURIComponent(ae)}`, N = S(() => JSON.parse(n.message.captions || "{}")), Q = S(() => (n.message.files ?? []).map((ae) => ({ name: ae, address: W(ae), isImage: U.test(ae), title: N.value[ae] || ae }))), D = S(() => or(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), O = _e(Re, null), { links: L, total: z, more: x, loading: y, failure: $, sentTo: E, sentMore: I, sentLoading: j, sentFailure: G, loadMore: Z, loadSent: oe } = Xk(O, () => l.value && !n.message.local ? n.message.id : null, o), ce = _(!1), $e = S(() => Kk(n.message.reactions)), Ae = S(() => Number.isInteger(n.message.id)), He = () => `${location.href.split("#")[0]}#open=messages:${n.message.id}`, he = () => ({
      head: kn(n.message.text ?? "", 40),
      items: [
        { label: "Reply", group: "open", disabled: !Ae.value, reason: "Not sent yet", run: () => a("reply", n.message) },
        { label: "React", group: "open", disabled: !Ae.value, reason: "Not sent yet", children: pl.map((ae) => ({ label: ae, run: () => a("react", n.message, ae) })) },
        { label: "Copy text", group: "copy", run: ({ say: ae }) => Yt(n.message.text ?? "", "the message", ae) },
        { label: "Copy link", group: "copy", disabled: !Ae.value, reason: "Not sent yet", run: ({ say: ae }) => Yt(He(), "the link", ae) },
        { label: "Pin to the top of the chat", disabled: !Ae.value || !O, reason: "Not sent yet", run: async ({ say: ae }) => {
          const ye = await O.run(["pin", "make", kn(n.message.text ?? "", 60) || `Message ${n.message.id}`, "--link", `messages:${n.message.id}`]);
          ae(ye.ok ? "Pinned" : ye.error);
        } }
      ]
    });
    function le(ae) {
      ce.value = !1, a("react", n.message, ae);
    }
    return (ae, ye) => e.message.peer || e.message.recipient ? we((r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(wk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ye[0] || (ye[0] = (F) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Jk)), [
      [B(Qt), he]
    ]) : we((r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", ew, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: ye[5] || (ye[5] = (...F) => B(Ht) && B(Ht)(...F))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ye[1] || (ye[1] = be((F) => B(je)(i.value.ref), ["stop"]))
          }, [
            A(ie, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, tw)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(T, ["stop"]),
            innerHTML: C.value
          }, null, 8, nw)) : k("", !0),
          u.value !== null ? (r(), P(yn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: ye[2] || (ye[2] = be((F) => B(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: q(() => [
              V("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(ji, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: q(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: g.value
              }, null, 8, aw)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(R, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ye[3] || (ye[3] = (F) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (r(), P(sk, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: ye[4] || (ye[4] = (F) => w.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: Y(["message-tools", { picking: ce.value }]),
          "data-message-tools": ""
        }, [
          ce.value ? (r(), d(R, { key: 0 }, [
            h("div", sw, [
              (r(!0), d(R, null, X(B(pl), (F) => (r(), d("button", {
                key: F,
                type: "button",
                class: "message-face",
                title: `React ${F}`,
                "data-face": F,
                onClick: (J) => le(F)
              }, v(F), 9, ow))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ye[6] || (ye[6] = (F) => ce.value = !1)
            }, [
              A(ie, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(R, { key: 1 }, [
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ye[7] || (ye[7] = (F) => ce.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ye[8] || (ye[8] = (F) => a("reply", e.message))
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
              onClick: ye[9] || (ye[9] = (F) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      $e.value.length ? (r(), d("div", lw, [
        (r(!0), d(R, null, X($e.value, (F) => (r(), d("button", {
          key: F.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: F.mine }]),
          title: F.title,
          "data-reaction": F.emoji,
          onClick: (J) => a("react", e.message, F.emoji)
        }, [
          V(v(F.emoji) + " ", 1),
          F.count > 1 ? (r(), d("span", rw, v(F.count), 1)) : k("", !0)
        ], 10, iw))), 128))
      ])) : k("", !0),
      Q.value.length ? (r(), d("div", uw, [
        (r(!0), d(R, null, X(Q.value, (F) => (r(), d(R, {
          key: F.name
        }, [
          F.isImage ? (r(), d("a", {
            key: 0,
            href: F.address,
            target: "_blank",
            class: "message-image",
            title: F.title
          }, [
            h("img", {
              src: F.address,
              alt: F.name,
              "data-figure-picture": ""
            }, null, 8, dw)
          ], 8, cw)) : (r(), d("a", {
            key: 1,
            href: F.address,
            target: "_blank",
            class: "message-file"
          }, v(F.name), 9, fw))
        ], 64))), 128))
      ])) : k("", !0),
      B(E).length ? (r(), d("div", mw, [
        A(ie, {
          name: "send",
          size: 12
        }),
        (r(!0), d(R, null, X(B(E), (F) => (r(), P(yn, {
          key: F.id,
          as: "button",
          "agent-id": F.id,
          label: `Worker ${F.id}`,
          class: "message-sent-worker",
          disabled: F.unavailable || !F.open_ref,
          "data-sent-worker": F.id,
          onClick: be((J) => F.open_ref && B(je)(F.open_ref), ["stop"])
        }, {
          default: q(() => [
            V("Also sent to worker " + v(F.id), 1),
            F.unavailable ? (r(), d(R, { key: 0 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A(An, {
        more: B(I),
        loading: B(j),
        failure: B(G),
        label: "More recipients",
        onMore: B(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", hw, [
        h("time", pw, v(D.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(R, { key: 0 }, [
          ye[10] || (ye[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", vw, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), P(Pk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      B(L).length || B($) ? (r(), P(Rk, {
        key: 3,
        links: B(L),
        total: B(z),
        more: B(x),
        loading: B(y),
        failure: B($),
        onMore: B(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Zk)), [
      [B(Qt), he]
    ]);
  }
}, RC = /* @__PURE__ */ H(bw, [["__scopeId", "data-v-7241010f"]]), ha = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Za = 200, Sr = (e) => {
  var t;
  return ((t = ha.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ha[0].key;
}, NC = (e) => {
  var t;
  return ((t = ha.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, kw = ["aria-label"], ww = 300, yl = 400, $w = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Za } },
  setup(e) {
    const t = e, n = S(() => Sr(t.value)), a = S(() => n.value < Za ? [1, 0.25, 0.25] : n.value === Za ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= yl, high: n.value >= ww && n.value < yl }]),
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
    ], 10, kw));
  }
}, LC = /* @__PURE__ */ H($w, [["__scopeId", "data-v-b10e610f"]]), _r = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], qC = (e) => {
  const t = _r[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, xw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, bl = (e) => xw[e.card.state] || "idle", Sw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), kl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, wl = (e, t) => kl[bl(e)] - kl[bl(t)], $l = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, DC = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => wl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Sw(a, s)) : [...e].sort((a, s) => wl(a, s) || ($l[t] || $l.state)(a, s)), _w = { class: "list-row" }, Mw = {
  key: 0,
  class: "list-row-type"
}, Cw = { class: "list-row-main" }, Aw = {
  key: 0,
  class: "list-row-title"
}, Ew = { class: "list-row-body" }, Ow = {
  key: 1,
  class: "list-row-end"
}, Tw = {
  key: 1,
  class: "list-row-text"
}, Iw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", _w, [
      e.type ? (r(), d("span", Mw, v(e.type), 1)) : k("", !0),
      h("div", Cw, [
        e.title ? (r(), d("span", Aw, v(e.title), 1)) : k("", !0),
        h("div", Ew, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", Ow, [
          ne(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", Tw, v(e.text), 1)) : k("", !0)
    ]));
  }
}, Bw = /* @__PURE__ */ H(Iw, [["__scopeId", "data-v-dfc8c3a7"]]), PC = {
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
    return (l, i) => (r(), P(to, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Rw = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Ns = /* @__PURE__ */ H(Rw, [["__scopeId", "data-v-978e0921"]]), Nw = ["aria-label"], Lw = { class: "head" }, qw = { class: "names" }, Dw = { class: "body" }, Pw = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ei(a, n), i = Oi(s);
    return (u, c) => (r(), P(Cn, { to: "body" }, [
      A(Zt, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: q(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = be((...f) => B(o) && B(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(R, { key: 0 }, [
                h("header", Lw, [
                  h("div", qw, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), P(ut, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ne(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ne(u.$slots, "actions", {}, void 0, !0),
                  A(Ma, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), P(Ns, { key: 0 }, {
                  default: q(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", Dw, [
                  ne(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), P(Ns, {
                  key: 1,
                  class: "below"
                }, {
                  default: q(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ne(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Nw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, jC = /* @__PURE__ */ H(Pw, [["__scopeId", "data-v-d0a677ef"]]), jw = {
  key: 1,
  class: "text-field-label"
}, Fw = {
  key: 2,
  class: "text-field-end"
}, Ww = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Bt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Gt(e, "modelValue"), a = xa(), s = "onUpdate:modelValue" in (((f = Pu()) == null ? void 0 : f.vnode.props) || {}), o = S(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = S(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = S(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: m.$slots.end }, B(a).class]),
      style: ge(B(a).style)
    }, [
      e.icon ? (r(), P(ie, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", jw, v(e.label), 1)) : k("", !0),
      we(h("input", Fe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(Cs), o.value]
      ]),
      m.$slots.end ? (r(), d("span", Fw, [
        ne(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : we((r(), d("input", Fe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [B(Cs), o.value]
    ]);
  }
}), Hw = /* @__PURE__ */ H(Ww, [["__scopeId", "data-v-d9c38ca8"]]), zw = {
  class: "page-header",
  "data-page-header": ""
}, Uw = { class: "page-title" }, Vw = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, Gw = { class: "page-header-end" }, Kw = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", zw, [
      h("h1", Uw, [
        V(v(e.title), 1),
        e.count !== null ? (r(), d("span", Vw, v(e.count), 1)) : k("", !0)
      ]),
      h("span", Gw, [
        ne(t.$slots, "primary", {}, void 0, !0),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, Yw = /* @__PURE__ */ H(Kw, [["__scopeId", "data-v-78e5d537"]]);
function Mr(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function FC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const WC = () => ({}), pa = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), Cr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, Ar = (e) => !!(e != null && e.values.length), HC = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), Qw = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function Er(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => Xw(o, l, n[l.key])) && (!a.trim() || Mr(o, a, s)));
}
function Xw(e, t, n) {
  if (!Ar(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const Jw = { class: "filter-ways" }, Zw = { class: "filter-count" }, e2 = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(R, null, [
      h("div", Jw, [
        A(Nt, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(R, null, X(e.field.options, ([m, p]) => (r(), P(ze, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (g) => u(m)
      }, {
        default: q(() => [
          V(v(p) + " ", 1),
          h("span", Zw, v(B(Qw)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, Or = /* @__PURE__ */ H(e2, [["__scopeId", "data-v-4e84eb6e"]]), t2 = ["data-filter-chip"], n2 = ["aria-expanded"], a2 = {
  key: 0,
  "data-filter-value": ""
}, s2 = ["aria-label"], o2 = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = S(() => Ar(n.modelValue)), l = S(() => !Cr(n.field, n.modelValue)), i = S(() => n.modelValue.values.map((f) => {
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
        o.value ? (r(), d("b", a2, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : k("", !0),
        A(ie, {
          name: "caret",
          size: 10
        })
      ], 8, n2),
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
      ], 8, s2)) : k("", !0),
      s.value ? (r(), P(tn, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = be(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: q(() => [
          A(Or, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, t2));
  }
}, l2 = /* @__PURE__ */ H(o2, [["__scopeId", "data-v-0cc7efe6"]]), i2 = {
  class: "search-bar",
  "data-search-bar": ""
}, r2 = { class: "search-bar-control" }, u2 = ["value", "placeholder", "aria-label"], c2 = ["aria-expanded"], d2 = {
  key: 0,
  "data-menu-count": ""
}, f2 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const a = e, s = n, o = ju(), l = ((C = _e(Re, null)) == null ? void 0 : C.search) ?? {}, i = S(() => l.placeholder || a.placeholder), u = l.context ?? [], c = _(null), f = _(null), m = _([]), p = S(() => m.value.length ? m.value[m.value.length - 1].next : u), g = S(() => !!o.menu || u.length > 0), b = (T) => {
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
    } }), (T, U) => {
      var W;
      return r(), d("div", i2, [
        h("div", r2, [
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
            onInput: U[0] || (U[0] = (N) => s("update:modelValue", N.target.value)),
            onKeydown: ot(M, ["esc"])
          }, null, 40, u2),
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
          g.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: b
          }, [
            e.menuCount ? (r(), d("span", d2, v(e.menuCount), 1)) : k("", !0),
            A(ie, {
              name: "caret",
              size: 12
            })
          ], 8, c2)) : k("", !0)
        ]),
        (W = B(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (N) => s("pick", B(l).button.click))
        }, v(B(l).button.title), 1)) : k("", !0),
        ne(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), P(tn, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = be(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (N) => f.value = null)
        }, {
          default: q(() => [
            m.value.length ? (r(), P(ze, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (N) => m.value = m.value.slice(0, -1))
            }, {
              default: q(() => [
                V("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(R, null, X(p.value, (N) => (r(), P(ze, {
              key: N.title,
              description: N.subtext,
              "data-search-entry": N.title,
              onClick: (Q) => w(N)
            }, {
              default: q(() => [
                V(v(N.title) + v(N.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ne(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Tr = /* @__PURE__ */ H(f2, [["__scopeId", "data-v-45374bed"]]), m2 = ["aria-expanded"], h2 = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, p2 = 72, v2 = {
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
    const n = e, a = t, s = _(null), o = _(null), l = _([]), i = S(() => n.fields.filter((g) => l.value.includes(g.key))), u = S(() => n.fields.some((g) => !Cr(g, n.modelValue[g.key])) || !!n.words.trim()), c = (g, b) => a("update:modelValue", { ...n.modelValue, [g]: b }), f = () => {
      a("update:modelValue", pa(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await qe();
      const g = s.value.clientWidth;
      g && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter((b) => b.offsetLeft + b.offsetWidth > g - p2).map((b) => b.dataset.filterChip));
    }
    let p = null;
    return Ce(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Ne(() => p == null ? void 0 : p.disconnect()), me(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (g, b) => (r(), P(Tr, {
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
          (r(!0), d(R, null, X(e.fields, (w) => we((r(), P(l2, {
            key: w.key,
            field: w,
            rows: e.rows,
            "model-value": e.modelValue[w.key] ?? null,
            "onUpdate:modelValue": (M) => c(w.key, M)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [Ys, !l.value.includes(w.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(R, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: b[0] || (b[0] = (w) => o.value = o.value ? null : w.currentTarget)
          }, "More", 8, m2),
          o.value ? (r(), P(tn, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: b[1] || (b[1] = be(() => {
            }, ["stop"])),
            onClose: b[2] || (b[2] = (w) => o.value = null)
          }, {
            default: q(() => [
              (r(!0), d(R, null, X(i.value, (w) => (r(), d(R, {
                key: w.key
              }, [
                A(wt, null, {
                  default: q(() => [
                    V(v(w.label), 1)
                  ]),
                  _: 2
                }, 1024),
                A(Or, {
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
        u.value ? (r(), d(R, { key: 1 }, [
          e.shown !== null ? (r(), d("span", h2, v(e.shown) + " of " + v(e.rows.length), 1)) : k("", !0),
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
}, Ir = /* @__PURE__ */ H(v2, [["__scopeId", "data-v-6580d498"]]), g2 = { class: "title" }, y2 = { class: "state" }, b2 = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ws(t.line, t.events);
    return (o, l) => (r(), P(Sb, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: q(({ row: i }) => [
        h("span", g2, v(i.title), 1),
        h("span", y2, v(B(vn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, zC = /* @__PURE__ */ H(b2, [["__scopeId", "data-v-6be0c59e"]]);
function k2(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Ne(() => clearInterval(a)), n;
}
const es = _(Date.now() / 1e3);
let xl = 0, Kn = 0;
function ko() {
  return Kn || (es.value = Date.now() / 1e3, xl = setInterval(() => es.value = Date.now() / 1e3, 1e3)), Kn += 1, ei() && _a(() => {
    Kn -= 1, Kn || clearInterval(xl);
  }), es;
}
const w2 = 200, $2 = wr + na + $r + w2, x2 = 300, Yn = /* @__PURE__ */ new WeakMap();
function S2(e, t) {
  const n = Yn.get(e) ?? [];
  Yn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Yn.get(e);
    Yn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, x2);
}
function on(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function _2(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: on(e),
    top: on(e.querySelector(".top")),
    title: on(e.querySelector(".title")),
    contents: on(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: on(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function M2(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(_2(o, l, n.value)), performance.now() - l < $2) return void requestAnimationFrame(u);
        S2(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const C2 = ["title", "data-figure-mark", "data-folded", "data-open"], A2 = {
  key: 2,
  class: "worker"
}, E2 = { class: "head" }, O2 = { key: 0 }, T2 = {
  key: 3,
  class: "status"
}, I2 = {
  key: 0,
  class: "figure"
}, B2 = {
  key: 1,
  class: "ran-for"
}, R2 = { key: 2 }, N2 = {
  key: 3,
  class: "news"
}, L2 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, q2 = {
  key: 6,
  class: "settled"
}, D2 = {
  key: 1,
  class: "bar"
}, P2 = {
  key: 3,
  class: "detail body"
}, j2 = {
  key: 0,
  class: "body-label"
}, F2 = ["title"], W2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = xa(), a = ["onClick", "onAct"], s = S(() => Object.fromEntries(Object.entries(n).filter(([ce]) => !a.includes(ce)))), o = _(!1), l = S(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = S(() => t.open !== void 0), u = S(() => i.value || l.value), c = S(() => i.value ? t.open : o.value), f = S(() => i.value ? !t.open : l.value && !o.value), m = S(() => !!(t.mark.action && n.onAct)), p = S(() => u.value || m.value || !!n.onClick), g = _(null), b = _(null), { folded: w, phase: M } = xr(g, () => f.value);
    M2(g, f, M, _e(Re, null));
    function C(ce) {
      var $e, Ae;
      if (!(ce.target !== g.value && !b.value.contains(ce.target))) {
        if (i.value) return ($e = n.onClick) == null ? void 0 : $e.call(n, ce);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ce);
      }
    }
    const T = (ce) => n.onAct(ce), U = ["failed", "unfinished"], W = S(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), N = S(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), Q = S(() => N.value || "var(--tone-work)"), D = S(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), O = ko(), L = S(
      () => t.mark.began_at && D.value && !t.mark.figure && !t.mark.counting ? lr(O.value - t.mark.began_at) : ""
    ), z = S(() => {
      const { started: ce, ended: $e } = t.mark;
      return ce ? $e ? `ran ${cl($e - ce, !0)}` : cl(O.value - ce, !0) : L.value;
    }), x = ["bad", "danger", "warn"], y = S(() => x.includes(W.value) || t.mark.asks ? "attention" : D.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], E = S(() => $.includes(W.value)), I = S(() => y.value === "process" ? "running" : E.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), j = S(
      () => !!(t.mark.figure || z.value || t.mark.docked || t.mark.stopping || I.value || t.mark.settled || t.mark.news)
    ), G = S(() => t.mark.markIcon ? { component: St, props: { class: "ico", name: t.mark.markIcon } } : { component: ie, props: { name: t.mark.icon || "dot" } }), Z = S(() => [t.mark.title, t.mark.time ? or(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = S(() => ({
      ...N.value ? { "--mark": N.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ce, $e) => (r(), d("div", Fe(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${y.value}`,
        B(M),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: N.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: oe.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": B(w) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (r(), P(Xe(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: q(() => [
          e.mark.agentId ? (r(), P(yn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: q(() => [
              (r(), P(Xe(G.value.component), ks(ti(G.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), P(Xe(G.value.component), ks(Fe({ key: 1 }, G.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", A2, v(e.mark.worker), 1)) : k("", !0),
          h("span", E2, [
            A(ut, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", O2, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), P(an, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          j.value ? (r(), d("span", T2, [
            e.mark.figure ? (r(), d("span", I2, v(e.mark.figure), 1)) : k("", !0),
            z.value ? (r(), d("span", B2, v(z.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", R2, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", N2, v(e.mark.news), 1)) : k("", !0),
            I.value === "running" ? (r(), d("span", L2)) : I.value ? (r(), P(St, {
              key: 5,
              class: Y(["sign", I.value]),
              name: I.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", q2, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), P(kr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: be(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && D.value ? (r(), d("span", D2, [
        h("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: Q.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !B(w) ? (r(), P(ut, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !B(w) ? (r(), d("div", P2, [
        e.mark.bodyLabel ? (r(), d("p", j2, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(ut, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !B(w) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, F2)) : k("", !0),
      e.mark.card ? (r(), P(ut, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ne(ce.$slots, "default", {
        shown: !B(w)
      }, void 0, !0)
    ], 16, C2));
  }
}), Br = /* @__PURE__ */ H(W2, [["__scopeId", "data-v-6e839007"]]), H2 = 8, z2 = 40, U2 = [];
class wo {
  constructor(t, n, { top: a = H2, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && U2.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new wo(t, {
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
    n > z2 && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await qe(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await qe();
  }
}
const V2 = 60, G2 = 300, Rr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Nr(e, t) {
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
  const c = new wo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => G2, more: () => a.value > 0, previous: u }, { top: V2 });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const K2 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Lr(e) {
  var n;
  const t = K2[e] || ((n = nn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const Y2 = (e) => Lr(String(e).split(":")[0]), Q2 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), X2 = "agents", J2 = { passed: "good", failed: "danger", warned: "warn", running: "" }, Z2 = { good: "good", warn: "warn", danger: "danger" }, Sl = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Dm(e.target_model, e.target_id || 0)
}, e$ = { "open row": (e) => Y2(e.target_model), "open page": () => Lr("pages") };
function t$(e, t) {
  const n = t || {}, a = Sl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? J2[e.outcome] || "" : Z2[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === X2 ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? e$[a](e) : "",
    handlers: a ? { onAct: () => Sl[a](e) } : {}
  };
}
const n$ = 24, a$ = 1e3, _l = 2e3, s$ = 0.25, o$ = 5e3;
function l$(e, t = n$, n = () => !0) {
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
    const N = Date.now() - u < _l ? _l : a$;
    l = setTimeout(() => o.value = a.value, N);
  }
  function g() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(W = !1) {
    const N = c();
    N && W && N.scrollTo ? N.scrollTo({ top: N.scrollHeight, behavior: "smooth" }) : N && (N.scrollTop = N.scrollHeight), g();
  }
  function w() {
    C(), !a.value && (a.value = !0, p(!0));
  }
  const M = () => !!c() && f() <= c().clientHeight * s$;
  function C() {
    clearTimeout(i), M() && (i = setTimeout(() => a.value && M() && n() && b(!0), o$));
  }
  function T() {
    m() ? g() : w();
  }
  function U(W = 1, N = !1) {
    a.value ? s.value += Math.max(0, W) : b(N);
  }
  return ei() && _a(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: g, toBottom: b, left: w, scrolled: T, arrived: U };
}
const i$ = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, r$ = (e) => String(e ?? "").replace(i$, ""), u$ = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: u } = l$(s);
    me(
      () => [n.lines, n.lines.length],
      () => qe(() => {
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
      V(v(B(r$)(e.lines.join(`
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
}, c$ = /* @__PURE__ */ H(u$, [["__scopeId", "data-v-89621acd"]]), d$ = "*.*", f$ = {
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
    const t = e, n = _e(Re, null), a = new fi();
    me(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (g) => a.dispatch(g));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = S(() => !!(t.declaration.shipped || t.declaration.trusted)), i = S(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [d$] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), P(gr, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), P(vr, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, m$ = { class: "mark-more-inner" }, h$ = {
  class: "mark-lines",
  "data-mark-reason": ""
}, p$ = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, v$ = {
  key: 3,
  class: "mark-lines"
}, g$ = "process", Ml = "task", y$ = {
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
    const t = e, n = lt(), a = S(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = S(() => Q2.has(t.mark.variant) && t.mark.detail || ""), o = S(() => t.mark.target_model === Ml ? t.mark.target_id : 0), l = Nr(
      Rr(n),
      () => t.mark.target_id
    ), i = l.lines, u = _(!1), c = _(""), f = S(() => !t.declaration.body_url && t.mark.target_model === g$ && !!t.mark.target_id);
    async function m(g = l.follow) {
      const b = await g();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = S(() => t.shown && f.value);
    return me(p, (g) => g && m()), Xs(() => p.value && m(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (g) => g && p.value && m(l.newest)
    ), (g, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = be(() => {
      }, ["stop"]))
    }, [
      h("div", m$, [
        e.declaration.body_url ? (r(), P(f$, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(R, { key: 1 }, [
          s.value ? (r(), d(R, { key: 0 }, [
            b[2] || (b[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", h$, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", p$, v(c.value), 1)) : f.value && u.value ? (r(), d(R, { key: 2 }, [
            b[3] || (b[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(c$, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", v$, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = be((w) => B(je)(`${Ml}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ls = /* @__PURE__ */ H(y$, [["__scopeId", "data-v-df71b15a"]]), b$ = ["title", "aria-label", "onClick"], k$ = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, w$ = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = S(() => cm(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = _e(Re);
    async function o(l) {
      const i = await On(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(R, null, [
      (r(!0), d(R, null, X(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: be((c) => o(u), ["stop"])
      }, [
        A(St, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, b$))), 128)),
      a.value ? (r(), d("span", k$, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, $$ = /* @__PURE__ */ H(w$, [["__scopeId", "data-v-7a62c88e"]]);
function qr(e, t) {
  const n = st(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Oe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Dr = qr("/api/marks", "marks"), UC = Dr.fetchAll, x$ = Dr.find, S$ = ["data-ref"], _$ = ["data-ref"], M$ = { class: "mark-row" }, C$ = "dock add", A$ = "questions.answer", E$ = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = S(() => x$(a.mark.type)), o = S(() => t$(a.mark, s.value)), l = S(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = S(() => l.value || !!o.value.handlers.onAct), u = S(() => a.mark.type === A$), c = _(!1);
    function f() {
      c.value = !c.value;
    }
    const m = S(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((g) => {
        var b;
        return !a.docked || !((b = g.runs) != null && b.startsWith(C$));
      }).map((g) => ({ ...g, module: s.value.module }));
    });
    return (p, g) => {
      var b, w;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Ls, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, S$)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (w = s.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", M$, [
          A(Br, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Sa({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: M }) => [
                A(Ls, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: M
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A($$, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, _$));
    };
  }
}, O$ = /* @__PURE__ */ H(E$, [["__scopeId", "data-v-424ddb61"]]), T$ = ["data-ref"], I$ = ["inert"], B$ = { class: "group-fold" }, R$ = { class: "thread-group" }, N$ = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    me(n, async (i) => {
      var u;
      a.value = !0, await qe(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
      A(Br, {
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
        h("div", B$, [
          h("div", R$, [
            (r(!0), d(R, null, X(e.group.marks, (c) => (r(), P(O$, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, I$)) : k("", !0)
    ], 8, T$));
  }
}, VC = /* @__PURE__ */ H(N$, [["__scopeId", "data-v-45b58b9b"]]);
function L$(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const q$ = { class: "chat-dock-fold" }, D$ = ["aria-label"], P$ = { class: "chat-dock-head" }, j$ = { class: "chat-dock-inner" }, F$ = { class: "chat-dock-foot" }, Pr = 700, W$ = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = L$(a), o = _(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Pr)), et(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", q$, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ne(i.$slots, "edge", {}, void 0, !0),
          h("header", P$, [
            ne(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", j$, [
              h("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ge(B(s) === null ? null : { height: `${B(s)}px` })
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
          h("footer", F$, [
            ne(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, D$)
      ])
    ], 2));
  }
}, H$ = /* @__PURE__ */ H(W$, [["__scopeId", "data-v-cc05fdac"]]), z$ = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ts = 5, U$ = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ts, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ts}s`, animationDelay: `${(n - ts).toFixed(2)}s` };
    return (s, o) => (r(), d("span", z$, [
      h("i", { style: a })
    ]));
  }
}, V$ = /* @__PURE__ */ H(U$, [["__scopeId", "data-v-2a7bc150"]]), G$ = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), qs = (e) => e.charAt(0).toUpperCase() + e.slice(1), K$ = (e) => qs(e.replace(/_at$/, "").replaceAll("_", " ")), Y$ = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Q$ = (e, t, n) => [qs(`${e} ${n}`), (t == null ? void 0 : t.state) && qs(t.state)].filter(Boolean).join(" · "), jr = (e) => Kt(e).text, X$ = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? jr(t) : (e == null ? void 0 : e.name) ?? "", J$ = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? jr(t) : "", Z$ = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !G$.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: K$(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], e5 = { reviewing: "Under review" }, t5 = (e, t) => e || e5[t == null ? void 0 : t.state] || "", Fr = qr("/api/docks", "docks"), GC = Fr.fetchAll, Wt = Fr.find, n5 = 6, ns = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, $o = (e) => Date.parse(e.leaves_at) / 1e3, rn = (e) => !!(e.leaves_at && !e.kept), a5 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!rn(e) || t < $o(e) || n.has(e.id)), s5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => a5(a, t, n)).sort((a, s) => a.id - s.id);
function o5(e, t, n = n5) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !($o(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const l5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ds = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), i5 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), r5 = (e) => ({ ...e.kept ? Ds("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ds("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), u5 = ["keep", "unkeep", "open", "undock"], c5 = (e) => ({ ...e, iconOnly: u5.includes(e.action) });
function d5(e, t) {
  var n;
  return [
    ...i5(e, t) ? [r5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || nn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Ds("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(c5);
}
function Wr(e, t) {
  const n = d5(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: l5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const f5 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Wr(e, t).title, m5 = { class: "dock-text" }, h5 = ["title"], p5 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, v5 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, g5 = {
  key: 1,
  "data-dock-row": ""
}, y5 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = S(() => Wt(a.item.type)), o = ko(), l = S(() => In(a.item.created_at, o.value * 1e3)), i = _(null), u = _(null), c = _(null), f = _(null), m = S(() => Wr(a.item, s.value)), p = lt(), g = S(() => `dock.${a.item.id}`), b = S(() => p.props[g.value].data.value), w = S(() => f5(a.item, s.value, b.value)), M = S(() => fa(a.item.target_model ?? "")), C = S(() => {
      var y;
      return ((y = s.value) == null ? void 0 : y.word) ?? "";
    }), T = S(() => ({ ...b.value, id: a.item.target_id, term: M.value })), U = () => {
      var y, $;
      return (($ = (y = s.value) == null ? void 0 : y.reads) == null ? void 0 : $.length) && p.reload(g.value);
    };
    rd(Gs, { data: b, reload: U, readOutput: Rr(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (y, $, E) => {
        var j;
        U();
        const I = (j = p.followUndeclared) == null ? void 0 : j.call(p, [`${M.value.replaceAll("-", "_")}.*`], (G) => {
          (!G.row_id || G.row_id === a.item.target_id) && U();
        });
        E(() => I == null ? void 0 : I());
      },
      { immediate: !0 }
    );
    const W = _(/* @__PURE__ */ new Set()), N = _("");
    async function Q(y) {
      if (y.action === "undock") return n("undock", y);
      if (y.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      y.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, y.label])), N.value = "";
      const E = await On(y, { id: a.item.target_id }, p.environment);
      (E == null ? void 0 : E.ok) === !1 && (W.value = new Set([...W.value].filter((I) => I !== y.label)), N.value = `Could not ${y.label.toLowerCase()}: ${E.error}`);
    }
    const D = S(() => m.value.actions.filter((y) => !W.value.has(y.label))), O = S(() => {
      var y;
      return t5((y = s.value) == null ? void 0 : y.badge, T.value);
    }), L = S(() => m.value.controls), z = S(() => {
      var y;
      return !((y = s.value) != null && y.folds && a.folded);
    }), x = S(() => {
      var y;
      return !!((y = s.value) != null && y.draws_head) && !a.collapsed;
    });
    return (y, $) => {
      var E, I, j, G;
      return r(), P(H$, {
        label: m.value.title + ((E = s.value) != null && E.needs_user ? ", waiting for you" : ""),
        type: (I = s.value) != null && I.needs_user ? "waiting" : "",
        folded: !!((j = s.value) != null && j.folds) && e.folded,
        body: !!((G = s.value) != null && G.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (Z) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (r(), P(V$, {
            key: 0,
            "ends-at": B($o)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: q(() => {
          var Z;
          return [
            x.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(R, { key: 1 }, [
              A(ie, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", m5, [
                h("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: w.value
                }, v(w.value), 11, h5)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? k("", !0) : (r(), d(R, { key: 0 }, [
                V(v(l.value), 1)
              ], 64))
            ], 512),
            L.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = be(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(R, null, X(L.value, (oe) => {
                var ce, $e;
                return r(), d(R, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ce = oe.variants) != null && ce.length) || !(($e = T.value) != null && $e.state) || oe.variants.includes(T.value.state)) ? (r(), P(ve, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (Ae) => Q(oe)
                  }, {
                    default: q(() => [
                      A(ie, {
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
        still: q(() => [
          N.value || e.refusal ? (r(), d("p", p5, v(N.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: q(() => {
          var Z;
          return [
            h("span", v5, [
              O.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(O.value), 3)) : k("", !0),
              C.value ? (r(), d("span", g5, v(C.value) + " " + v(e.item.target_id), 1)) : k("", !0),
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
              onClick: $[1] || ($[1] = (oe) => n("fold"))
            }, {
              default: q(() => [
                V(v(s.value.folds) + " ", 1),
                A(an, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = be(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              z.value ? (r(), d(R, { key: 0 }, [
                A(co, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: B(p).environment,
                  "read-only": B(p).readOnly,
                  "object-name": B(fa)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (oe) => N.value = oe),
                  onDone: y.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(R, null, X(D.value, (oe) => (r(), P(ve, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (ce) => Q(oe)
                }, {
                  default: q(() => [
                    V(v(oe.label), 1)
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
            (Z = s.value) != null && Z.body_url ? (r(), P(Ls, {
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
}, Cl = /* @__PURE__ */ H(y5, [["__scopeId", "data-v-4d692a2f"]]), b5 = 24, k5 = 8, KC = 420;
function YC({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= b5 ? !0 : e < t && s > k5 ? !1 : null;
}
const w5 = (e, t) => e === void 0 ? t : e, $5 = { me: 1, people: [] }, va = Jt({
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
  people: $5,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: ra("journal.activity", !0),
  wide: !1,
  sideMini: ra("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
qi("journal.activity", () => va.activity);
qi("journal.side.mini", () => va.sideMini);
const Hr = "journal.viewer.";
function x5(e, t, n) {
  try {
    const a = n.getItem(Hr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function S5(e, t, n) {
  try {
    n.setItem(Hr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Al(e, t, n = window.localStorage) {
  const a = _(x5(e, t, n));
  return me(a, (s) => S5(e, s, n), { deep: !0 }), a;
}
const _5 = {
  key: "dock-all",
  class: "dock-all"
}, M5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var x, y;
    const t = e, n = k2(500), a = _(/* @__PURE__ */ new Set()), s = _e(Re), o = _(/* @__PURE__ */ new Set()), l = _({});
    async function i($, E) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const I = await On(E, { id: $.target_id }, s.environment);
      (I == null ? void 0 : I.ok) === !1 && (o.value = new Set([...o.value].filter((j) => j !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${I.error}` });
    }
    const u = S(
      () => s5(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = S(
      () => o5(
        u.value.filter(($) => ns($, Wt)),
        n.value
      )
    ), f = S(() => u.value.filter(($) => !c.value.includes($) && !ns($, Wt))), m = Al(`dock-size:${((x = va.identity) == null ? void 0 : x.root) || location.host}`, null), p = ($) => {
      var E;
      return !!((E = Wt($.type)) != null && E.needs_user);
    }, g = _(/* @__PURE__ */ new Set()), b = _(/* @__PURE__ */ new Set()), w = S(() => u.value.length === 1), M = ($) => p($) || w.value, C = ($) => M($) ? g.value.has($.id) || b.value.has($.id) : m.value ? m.value.collapsed && !m.value.opened.includes($.id) : t.collapsed, T = S(() => u.value.some(C));
    me(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(p).map((E) => E.id) : []);
    });
    function U() {
      const $ = !T.value;
      m.value = { collapsed: $, opened: [] }, g.value = new Set($ ? u.value.filter(p).map((E) => E.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var I;
      if (!C($)) return;
      if (M($)) {
        g.value = new Set([...g.value].filter((j) => j !== $.id)), b.value = new Set([...b.value].filter((j) => j !== $.id));
        return;
      }
      const E = (I = m.value) != null && I.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...E, $.id] };
    }
    const N = Al(`dock-folded:${((y = va.identity) == null ? void 0 : y.root) || location.host}`, {}), Q = ($) => {
      var E;
      return !!((E = Wt($.type)) != null && E.folds) && (t.insidesFolded || w5(N.value[$.id], ns($, Wt) || t.folded));
    };
    function D($) {
      Q($) && O($), N.value = { ...N.value, [$.id]: !Q($) };
    }
    function O($) {
      var E;
      !((E = m.value) != null && E.collapsed) || m.value.opened.includes($.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, $.id] });
    }
    function L($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function z($) {
      a.value = new Set([...a.value].filter((E) => E !== $.id));
    }
    return ($, E) => (r(), P(Ks, {
      tag: "div",
      name: "dock",
      duration: B(Pr),
      class: "dock-stack"
    }, {
      default: q(() => [
        u.value.length > 1 ? (r(), d("div", _5, [
          A(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: U
          }, {
            default: q(() => [
              A(an, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(R, null, X(f.value, (I) => (r(), P(Cl, {
          key: I.id,
          item: I,
          class: Y({ timed: B(rn)(I) }),
          leaving: B(rn)(I) && !a.value.has(I.id),
          folded: Q(I),
          collapsed: C(I),
          refusal: l.value[I.id],
          onOpen: (j) => W(I),
          onFold: (j) => D(I),
          onUndock: (j) => i(I, j),
          onMouseenter: (j) => L(I),
          onMouseleave: (j) => z(I)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(R, null, X(c.value, (I) => (r(), P(Cl, {
          key: I.id,
          item: I,
          class: Y({ timed: B(rn)(I) }),
          leaving: B(rn)(I) && !a.value.has(I.id),
          folded: Q(I),
          collapsed: C(I),
          refusal: l.value[I.id],
          onOpen: (j) => W(I),
          onFold: (j) => D(I),
          onUndock: (j) => i(I, j),
          onMouseenter: (j) => L(I),
          onMouseleave: (j) => z(I)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, QC = /* @__PURE__ */ H(M5, [["__scopeId", "data-v-ab76ae18"]]), It = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, aa = (e) => Math.min(Math.max(e, 0), 1), C5 = (e) => {
  const t = aa(e);
  return t * t * (3 - 2 * t);
}, Ct = (e, t, n) => C5((e - t) / (n - t));
function XC(e) {
  const t = aa(e), n = aa((t - 0.12) / 0.76) * It.shuffles, a = Math.min(Math.floor(n), It.shuffles - 1), s = n - a, o = Ct(s, 0.26, 0.38) * (1 - Ct(s, 0.76, 0.96)), l = Ct(s, 0.38, 0.76), i = Ct(t, 0, 0.12) * (1 - Ct(t, 0.88, 1)), u = Ct(s, 0.2, 0.34) * (1 - Ct(s, 0.84, 1)), c = Math.sin(Math.PI * aa((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / It.shuffles, lift: It.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function JC(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const El = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, ZC = (e) => El[e] ?? El.butler, xo = 2400, A5 = 0.05;
function E5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, A5), l = Math.min(t + xo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function eA(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function O5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function tA(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const nA = (e, t) => ({ ...e, stretch: t.stretch }), aA = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, zr = (e, t) => t >= (e.least ?? 0);
function sA(e, t, n) {
  if (!zr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const oA = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), T5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ol = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), I5 = (e) => e.right > e.left && e.bottom > e.top;
function lA(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(T5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = Ol(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = Ol(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), I5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Ur(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[f] - e[f];
      if (Math.abs(g) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[m] - e[f]) / g, w = (o[p] - e[f]) / g;
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
}, wn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), B5 = (e) => e * e * (3 - 2 * e), Be = (e, [t, n]) => B5(wn(e, t, n)), R5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], bt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Qn = ([e, t], n) => e + n() * (t - e);
function N5(e) {
  return R5.map(() => {
    const t = Qn(bt.speed, e), n = Qn(bt.angle, e) * Math.PI / 180, a = Qn(bt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Qn(bt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const L5 = N5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function q5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * bt.gravity * (t[2] - bt.floor))) / bt.gravity;
}
function iA(e, t, n = L5) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = q5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= bt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const rA = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function uA(e, t) {
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
const cA = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Vt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function dA(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Vt.margin * n, t.right - Vt.margin * n], u = Math.min(Math.max(e + o + s * Vt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function fA(e, t, n) {
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
function mA(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Vt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = E5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const We = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function hA(e) {
  const t = We.least + Math.floor(e() * (We.most - We.least + 1));
  return Array.from({ length: t }, () => ({
    wall: We.walls[Math.floor(e() * We.walls.length)],
    along: We.margin + e() * (1 - 2 * We.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ps(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * We.margin, l = ((e.along - We.margin + e.way * We.speed * n / a) / s % 2 + 2) % 2, i = We.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + We.inset, turn: 180 } : { x: e.wall === "left" ? t.left + We.inset : t.right - We.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function D5(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = O5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function pA(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = D5(n, e.length), c = e.map((C, T) => ({ ...Ps(C, t, Math.min(n / o.fps, sa(T).shot)), shot: T < u })), f = Be(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], g = e.map((C, T) => ({ bug: C, index: T, seconds: n / o.fps - sa(T).shot, spot: Ps(C, t, sa(T).shot) })).filter((C) => C.seconds >= 0), b = g.flatMap((C) => {
    const T = (s == null ? void 0 : s.get(C.index)) ?? H5(C.bug, t, C.spot, s ? [] : a);
    return s == null || s.set(C.index, T), s && z5(T, C.seconds, a), U5(T, C.seconds, a);
  }), w = g.filter((C) => F5(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), M = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: M }, slush: b, camera: w };
}
function sa(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function vA(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = sa(f), p = Ps(c, t, m.shot), g = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), w = Math.abs(p.x - u) >= g ? u : p.x + b * g, M = b > 0 ? Math.max(u, Math.min(w, i)) : Math.min(u, Math.max(w, l)), C = { from: u, to: M, begin: m.walk, end: m.aim };
    return u = M, C;
  });
}
function gA(e, t, n) {
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
const Ee = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, P5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function j5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const F5 = (e) => e.along * 97 % 1 < Ee.camera, $n = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ee.gravity * t * t });
function W5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ee.gravity * (t.bottom - e.from.y))) / Ee.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ee.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ee.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ee.step) {
    const f = Math.min(c + Ee.step, l.t), m = $n(e, f), p = Ur(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = $n(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function H5(e, t, n, a = []) {
  const s = j5(e.along + 1), [o, l] = P5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ee.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ee.spread * Math.PI / 180), c = Ee.speed[0] + s() * (Ee.speed[1] - Ee.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ee.radius[0] + s() * (Ee.radius[1] - Ee.radius[0]) };
    return { ...f, ...W5(f, t, a) };
  });
}
function z5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ee.step) {
      const l = Math.min(o + Ee.step, s), i = Ur($n(a, o), $n(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function U5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...$n(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ee.hold) / Ee.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function yA(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Ie.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, m = Be(e, [0, c]), p = Be(e, [c, c + f]);
  return l.map((g) => {
    const b = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * m,
      y: n.y + (b.y - n.y) * m,
      r: g.size * t * (0.15 + 0.85 * m * m),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: m >= 1
    };
  });
}
function bA(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (w) => {
    const [M, C] = [w.x - e.at.x, w.y - e.at.y];
    return { x: i.x + M * c - C * f, y: i.y + M * f + C * c };
  }, [p, g] = [...n].sort((w, M) => w.x - M.x), b = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((w, M) => ({ from: w, to: M < b.length / 2 ? p : g })) };
}
const kA = (e, t) => Be(t, e.grows) * (1 - Be(t, e.sinks));
function ga(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: wn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: wn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function wA(e, t) {
  const n = Ie[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ga(n, t), l = 1 - (1 - n.small) * Be(a, n.shrinks) * (1 - Be(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ga(n, t), o = n.flat * Be(a, n.squashes) * (1 - Be(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * wn(s, ...n.springs)) * (1 - wn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const $A = (e) => e === "pack_box";
function xA(e) {
  const { into: t, out: n } = ga(Ie.rope_swing, e);
  return 1 - Be(t, [0, 1]) * (1 - Be(n, [0, 1]));
}
function SA(e) {
  const t = Ie.rope_swing, { into: n, out: a } = ga(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Be(n, [0, 1]) * (1 - Be(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const V5 = { after: 3 }, So = 10, G5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, K5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Y5 = { weight: 19 }, Vr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Q5 = { every: 120 }, Gr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Kr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, X5 = {
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
}, Rn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: So }), re = (e, t, n = {}) => Rn(e, "clip", t, n), as = (e, t, n = {}) => Rn(e, "look", t, n), Tl = (e, t, n = {}) => Rn(e, "gaze", t, n), ke = (e, t, n = {}, a = {}) => ({ ...Rn(e, "pick", t, n), ...a }), Se = (e) => Rn("nothing", "nothing", e, {}), J5 = 120, Z5 = 300, ss = (e, t) => ({ ...re(e, t), cooldown: Z5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), e4 = () => [re("joy", 2)], At = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Et = (e) => ({ ...e, cooldown: G5[e.name] }), ln = (e) => ({ ...e, shenanigan: !0, lasts: K5[e.name] }), Oa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), Se(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Et(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...Et(re("bug_smash", 2)), toward: "", onto: !1 },
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
  ...fe("reported", { cooldown: 90 }, [Tl("read", 3), re("nod", 1), Se(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Tl("read", 3), Se(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), Se(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), Se(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, e4()),
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
  ...fe("pondering", { cooldown: [30, 60] }, [ke("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ke("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ke("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [as("amused", 3), Se(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    Se(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), Se(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), Se(13)]),
  ...fe("typing", { cooldown: 60 }, [as("reading", 1), Se(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(X5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [as(t, 1)])),
  ...Object.entries(Gr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Kr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    At("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    At("rest", 3, 180, 120),
    At("yawn", 2, 60, 60),
    At("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    At("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    At("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    At("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...ln(Et(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    ln(Et(re("disco", 2, { ball: "bubble" }))),
    Se(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: J5 }, [ss("search", 3), { ...ss("binoculars", 2), when: { home: !0 } }, { ...ss("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ke("writing", 12, { state: "writing" }), ke("reading", 12, { state: "reading" }), ke("searching", 12, { state: "searching" }), Se(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...Et(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), Se(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [ln(Et(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ke("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: Vr.build.cooldown }, [ke("unit", Y5.weight), Se(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ke("hang", 1, { hands: !0, free: !0 }), cooldown: Q5.every }, ke("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ke("0", 1), ke("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ke("rest", 35, {}, { stay: [25, 60] }),
    ke("seat", 15, {}, { stay: [15, 40] }),
    ke("edge", 25, {}, { stay: [8, 20] }),
    ln(ke("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ke("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ke("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ke("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ke("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ke("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    ln(Et(ke("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [ke("seat", 6, {}, { stay: [60, 150] }), ke("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [ke("middle", 2, {}, { along: 1 / 2 }), ke("third", 1, {}, { along: 1 / 3 }), ke("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    ke("facing", 4, {}, { turn: 0, leans: 0 }),
    ke("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ke("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ke("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ke("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Yr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Qr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), t4 = (e) => Array.isArray(e) ? e[0] : e, n4 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, a4 = (e) => Oa.some((t) => t.when.moment === e);
function s4(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Qr(f).every(([m, p]) => n(m) >= t4(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Oa.filter((f) => Yr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= V5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Je(e, t) {
  const n = s4(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Xr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Xr(e, t, n) {
  var a;
  for (const [s, o] of Qr(t)) (a = e.memory) == null || a.set(s, e.now + n4(o, n));
}
function _A(e, t, n) {
  Xr(e, Oa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const MA = (e) => Object.values(Vr).find((t) => Yr(t.when, e)) ?? null, o4 = (e, t, n) => n - t <= (e.lifetime ?? So), CA = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || zr(e.clip, t));
class Jr {
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
const js = {
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
}, AA = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Zr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), EA = {
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
}, OA = 120, l4 = 20, TA = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < l4), i4 = (e) => js[e] || js.idle, IA = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, eu = "airborne", r4 = "landing", u4 = "travelling", tu = "grounded", BA = ({ airborne: e, landing: t, trip: n }) => e ? eu : t ? r4 : n != null && n.started ? u4 : tu;
function RA(e, t) {
  var s;
  const n = c4(e, t);
  return e.mode === tu && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function c4(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === eu && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...d4(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const g = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: g ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : i4(c), facing: g ? p : i.posture === "sit" ? i.face : m };
}
function d4(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Fs = (e) => e.outcome, f4 = /^plugin:[^:]+:sins:/, Il = (e) => e.type === "plugins.card" && f4.test(e.markKey), m4 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Il(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Il(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], NA = (e, t) => e.filter((n) => n.author === "user" && ma(n.read_at) > t).map((n) => ({ beat: "read_message", time: ma(n.read_at), card: Yi(n) })).sort((n, a) => n.time - a.time), Bl = { user: "reacted", agent: "agent_reacted" };
function LA(e, t) {
  return e.filter((n) => Bl[n.author] && Lt(n) > t).map((n) => ({ beat: `${Bl[n.author]}:${n.emoji}`, time: Lt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const h4 = [.../* @__PURE__ */ new Set([...Object.values(Gr).flatMap((e) => Object.keys(e)), ...Object.keys(Kr)])];
function qA(e, t) {
  return e.filter((n) => n.author === "agent" && Lt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = h4.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Lt(n), card: Yi(n) })).sort((n, a) => n.time - a.time);
}
const p4 = (e) => new Jr(e).isTest(), ya = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Fs(e)] || "";
}, v4 = 1800, g4 = (e, t) => {
  if (ya(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ya(n) !== "finished" && Number(e.time) - Number(n.time) <= v4 ? "tests_fixed" : "tests_passed";
};
function DA(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(p4), s = a.filter((i) => ya(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ya(i))), o.map((i) => ({ beat: g4(i, s), time: Number(i.time), card: i.key }));
}
function PA(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Fs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Fs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const jA = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Lt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function FA(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function WA(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function HA(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = m4.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function _o(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Rl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function y4(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    _o(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function zA(e, t, n, a = {}) {
  const s = Je({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : a4(`held:${e}`) ? "idle" : e;
}
const Pe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function UA(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Pe.ahead * n ? 180 : Math.sign(a) * Pe.turn;
}
const Nl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function VA(e, t) {
  const n = Math.min(Pe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Pe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Pe.lines, Math.floor((e.bottom - e.top - 2 * a) / Pe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Pe.sweep) % s, i = o % Pe.sweep, u = Pe.sweep - Pe.returnSeconds, c = Nl((i - u) / Pe.returnSeconds), f = i <= u ? Nl(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * Pe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Ll = 3, nu = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, ql = 12, GA = (e, t) => ({ mood: e, began: t, seen: 0 });
function KA(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!nu(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Ll ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * ql) / ql, lasts: Ll } };
}
const YA = (e) => e.posture === "hang" && !nu(e.face), b4 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), k4 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function QA(e, t, n) {
  return b4.has(e) ? 1 / 0 : !k4.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(au(n - t.began, t.share) - ct.lead, 0);
}
const w4 = 5;
function XA(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= w4 ? { beat: "long_walk", time: n } : null };
}
const $4 = 30, Xn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function JA(e, t, n, a, s = null) {
  if (t && n < t.until || !Xn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Je({ moment: "spell", state: e, tally: s }, a), [l, i] = Xn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Xn.every } : { state: e, began: 0, until: 0, next: n + Xn.every };
}
const ZA = (e, t, n) => t && n < t.until && Zr.has(e.state) ? { state: t.state, since: t.began } : e, ct = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, au = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function eE(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = au(o, e.share);
  return s ? { eager: x4(t, l), moment: null } : l > ct.lead ? { eager: t, moment: null } : l < ct.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ct.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ct.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Je({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function x4(e, t) {
  return e.on && t > ct.lead + ct.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ct.lead && t >= ct.least ? { ...e, on: !0, calm: !1 } : e;
}
const S4 = 1, _4 = { look: "look", gaze: "gaze" };
function M4(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Je({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [_4[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const C4 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Je({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), A4 = (e, t, n, a, s, o = 0) => Je({ moment: "jump", high: e > S4 * t, memory: a, now: s, room: o }, n).name === "backflip", E4 = { work: ["building"], idle: ["standing"] };
function tE(e, t, n, a) {
  const s = js[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(E4[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Zr.has(e) ? { moments: o, began: n || a } : (n && a - n >= $4 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function O4(e, t, n) {
  return !Je({ moment: "pondering", memory: e, now: t }, n) || !Je({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Je({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Dl = { pondering: O4 };
function nE(e, t, n, a, s, o) {
  if (Dl[e.beat]) {
    const i = Dl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = M4(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== So && { lifetime: l.lifetime } } } : null;
}
function aE(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = C4(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const sE = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function oE(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function lE(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const iE = (e, t) => !!(e != null && e.watches) && !t.once, rE = 10, uE = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || o4(a, a.queuedAt, n)), cE = (e, t) => t ? null : e[0] ?? null;
function dE(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const fE = (e, t) => !t.during || !e.some((n) => n.during === t.during), T4 = 2 * Math.PI, I4 = 500;
function mE(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / I4, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = T4 * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, w = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !u ? s && !t.behind && !g.behind ? R4(g, t, n, p, s) : L4(g, t, n, p) : t) ?? g, M = w != null && w.behind && w.mood === "reading" ? B4(e.point, w, n, l, s) : w;
  return { point: M ?? null, toward: M ? { x: M.x - n.x, y: M.y - n.y } : null, amount: m, at: a };
}
function B4(e, t, n, a, s) {
  const o = (L) => L * 180 / Math.PI, l = (L) => o(Math.atan2(Math.sin(L * Math.PI / 180), Math.cos(L * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, g = m ? e.readingYaw + p : f, b = g + l(c - g), w = Math.min(Math.max(a / 1e3, 0), 0.1), M = Pe.turnSpeed * w, C = m ? g + Math.min(Math.max(b - g, -M), M) : b, T = m ? e.readingFollow + p : C, U = T + (C - T) * (1 - Math.exp(-w / Pe.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, N = o(_o(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), Q = Math.min(Math.max(N, -W.up), W.down), D = Pe.tipSpeed * w, O = m ? e.readingPitch + Math.min(Math.max(Q - e.readingPitch, -D), D) : Q;
  return { ...t, readingYaw: C, readingFollow: U, readingPitch: O, readingFacing: i };
}
function R4(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: U, pitch: W } = _o(T.x - n.x, s, n.y - T.y, o);
    return { yaw: U, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Rl(i(e)), Rl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, g] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [b, w, M] = u.map((T, U) => p * T + g * c[U]), C = s * b / w;
  return { ...t, x: n.x + C, y: n.y - y4(C, s, -Math.asin(Math.min(Math.max(M, -1), 1)), o) };
}
const N4 = 0.15;
function hE(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= N4;
}
function L4(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const q4 = (e) => !(e != null && e.on);
function pE(e, t, n) {
  if (q4(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const xn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, it = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, os = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Pl = (e) => e * e * (3 - 2 * e);
function D4(e) {
  if (e < 0 || e >= it.seconds) return null;
  const t = os(e, ...it.flicker), n = Math.floor(t * it.flickers * 2) % 2 === 0, a = e < it.flicker[1] ? n ? 0.35 + 0.5 * t : it.dim : 1;
  return { strength: 1 - Pl(os(e, ...it.fade)), lit: a, white: e < it.flash[0] ? 0 : 1 - Pl(os(e, ...it.flash)) };
}
const vE = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function gE(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = D4(t - e.at);
  return a && { colour: xn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: it.signs[e.tone], ...a } };
}
function yE(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function bE(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= xn.looks || a === null && n - e.since >= xn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function kE(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const yt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, wE = { behind: 39, figure: 40, ahead: 41 }, P4 = "[data-figure-pile]", j4 = { amber: [1, 0.69, 0.125], good: xn.colours.good, bad: xn.colours.bad }, oa = { phases: 4, ms: 230, dim: 0.25 }, $E = (e, t, n) => e !== "amber" || (t + n) % oa.phases < oa.phases / 2 ? 1 : oa.dim, xE = (e) => e === "amber" ? oa.phases : 1;
function SE(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const _E = Object.keys(j4), nt = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, un = ([e, t], n) => e + n() * (t - e);
function ME(e) {
  const t = nt.least + Math.floor(e() * (nt.most - nt.least + 1));
  return Array.from({ length: Math.min(t, nt.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * nt.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = un(nt.start, e), l = un(nt.reach, e);
    return {
      text: Je({ moment: "digit" }, e).name,
      x: a * o,
      y: nt.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(un(nt.moveMs, e)),
      fadeMs: Math.round(un(nt.fadeMs, e))
    };
  });
}
const ls = { high: 3, gap: 1 };
function CE(e) {
  const t = Math.floor(e / ls.high);
  return { left: -(yt.inside + yt.width / 2 + t * (yt.width + ls.gap)), up: e % ls.high * (yt.height - yt.top) };
}
const F4 = (e, t, n) => Je({ moment: "unit", memory: e, now: t }, n) !== null, W4 = { after: 5 }, H4 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Jr(t).isBuild());
function AE(e, t, n) {
  const a = H4(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= W4.after ? s : null;
}
function EE(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: F4(n, a, s) } : null;
}
const jl = { ahead: 140, up: 70 };
function OE(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * jl.ahead, y: a - jl.up } } : o ? { at: { x: n(o), y: a - o.up - yt.height } } : t ? { at: null } : null;
}
const is = { least: 4e3, most: 1e4 }, z4 = (e) => is.least + e() * (is.most - is.least), Ot = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function TE(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = z4(t);
    if (n.length >= Ot.most || t() >= Ot.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Ot.at[0] + t() * (Ot.at[1] - Ot.at[0]));
    n.push({ from: o, to: o + Ot.ms }), a = o + Ot.ms;
  }
}
const IE = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), BE = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), su = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), RE = new Set(Oa.filter((e) => su.has(e.when.moment) && e.type === "clip").map((e) => e.name)), U4 = (e) => e.some((t) => t.state === "built"), NE = (e, t) => U4(t) ? e.filter((n) => !su.has(n.beat)) : e, $t = { reach: 40, room: 6 }, V4 = (e, t) => t <= e - $t.reach + 2, LE = (e, t, n) => V4(e, n) ? t - $t.reach : e - $t.reach - $t.room, qE = (e, t, n, a) => a > 0 && t < e && t + $t.reach >= e - 2 ? Math.min(n, Math.max(e, t + $t.reach)) : e, rs = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, DE = (e) => un(e() < rs.longShare ? rs.long : rs.short, e), G4 = 2 * yt.width;
function PE(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= G4 ? o : e + (o - e + s / 2) % s;
}
const K4 = 60, jE = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= K4, Fl = "[data-figure-home]", Nn = () => {
  var t;
  const e = document.querySelector(Fl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Fl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Y4 = "[data-figure-docked-bars]", Q4 = "[data-figure-chat-foot]", X4 = [0.85, 0.6, 0.35, 0.15], J4 = ["question", "waiting", "suggestion"], FE = (e, t) => J4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function WE() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Z4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", ex = "[data-figure-newest]";
function ou() {
  var a, s;
  const e = (a = Nn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(ex), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Mo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function Sn(e, t, n = ou()) {
  if (!e || !n) return !0;
  const a = ht(e, t), s = Ia(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Le.top * t.size, bottom: a.top + Le.bottom * t.size }, l = It.gap;
  return !Ta(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function HE(e, t, n, a = ou()) {
  if (!a || Sn(t, e, a)) return null;
  const s = Ia(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Pt(), u = t.posture === "stand" ? Ao * e.size : mu * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - It.gap - l, a.right + It.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && Sn(p, e, a) && Ex(p, e)).sort((p, g) => Math.abs(p.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const us = 0.26, lu = 0.54, tx = 1.25 / 5.4, Ln = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: us, travels: "stand" },
  lounge: { drop: us, travels: "stand" },
  composed: { drop: us, travels: "stand" },
  hang: { drop: lu, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, zE = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * tx * Math.cos(t * Math.PI / 180),
  y: 1 - n - lu
}), fn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), nx = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), UE = (e, t) => (e === "sit" ? nx.has(t) : fn.has(e)) ? e : "stand";
function VE(e, t) {
  return e.facing === t.facing || !fn.has(e.posture) && !fn.has(t.posture) ? t : { posture: "stand", facing: fn.has(e.posture) ? e.facing : t.facing };
}
const GE = 0.25, KE = (e, t) => fn.has(e) && Ln[t].drop === 0, iu = 2, ax = 90, sx = 180, ox = 140, lx = 280, ix = 420, rx = 0.25, ux = 290, cx = 600, dx = "cubic-bezier(0.2, 0.7, 0.4, 1)", fx = "cubic-bezier(0.55, 0, 0.9, 0.6)", cs = 5;
function ba(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < cs) return null;
  (l || i) && (o = Math.max(o, iu));
  const g = o > 1, b = Math.abs(t.x - e.x), w = b < cs ? 0 : b / (ax * o) * 1e3, M = Math.min(w, g ? ox : sx), C = Math.abs(t.y - e.y), T = t.y < e.y, U = T && !p && A4(C, n, u, c, f, m), W = T ? ix + Math.min(C, 400) * rx : Math.sqrt(2 * C / xo) * 1e3, N = {
    x: t.x,
    y: t.y,
    ms: C > cs ? U ? cx : W : 0,
    lead: U ? ux : T ? lx : 0,
    easing: T ? dx : fx,
    hopping: !0,
    clip: U ? "backflip" : T ? "jump" : "fall"
  }, Q = { x: t.x, y: t.y, ms: w + M, lead: 0, easing: "linear", ramp: M, ...g ? { clip: "run" } : {} }, D = p ? mx(t, n) : N, O = T && !a ? [{ ...Q, y: e.y }, D] : [{ ...N, x: e.x }, Q];
  return { way: Math.sign(t.x - e.x) || 1, legs: O, lands: !s, pace: o, running: g };
}
const mx = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), hx = (e, t) => e.postures.includes(t) ? t : e.postures[0], YE = (e, t, n) => e.posture === "walk" && n ? "walk" : hx(e.clip, t), ht = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Ln[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Ta = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Mo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Pt() {
  var t;
  const e = (t = Nn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jn = 0.5, Wl = 20;
function QE(e, t, n = Pt()) {
  const a = ht(e, t);
  return a.left >= n.left + Wl && a.right <= n.right - Wl;
}
function Co(e, t, n = Pt()) {
  const a = ht(e, t), s = a.right - a.left, o = Ia(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Jn && i <= n.right + Jn && a.top >= n.top - Jn && u <= n.bottom + Jn;
}
const ka = [0.35, 0.5, 0.65], wa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Le = { left: ka[0], right: ka.at(-1), top: wa[0], bottom: wa.at(-1) }, px = 0.24;
function Ia(e) {
  if (e.posture === "stand") return { left: Le.left, right: Le.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + px * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Le.left, t), right: Math.max(Le.right, t) };
}
function vx(e, { size: t }, n = Pt()) {
  const a = Ia(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ao = (Le.right - Le.left) / 2 + 0.08;
function XE(e, t) {
  return e === "hang" ? Le : { ...Le, bottom: Math.min(Le.bottom, 1 - t - Ln[e].drop) };
}
const gx = "[data-figure-agent]";
function ru(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Mo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const uu = (e) => wa.flatMap(
  (t) => ka.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Eo(e, t, n = "") {
  if (!Sn(e, t)) return ka.length * wa.length;
  const a = ht(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Z4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Ta(s, u) && Mo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return uu(s).filter(([i, u]) => l(i, u) || ru(i, u, n)).length;
}
function yx(e, t) {
  const n = ht(e, t);
  return uu({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => ru(a, s, "", gx)).length;
}
const Hl = 4;
function JE(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Hl; o <= s; o += Hl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!yx(i, e) && Sn(i, e)) return i;
    }
  return null;
}
function _n(e, t, n) {
  const a = Pt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Co(l, t, a) && Sn(l, t)).map((l) => ({ spot: l, covered: Eo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const cu = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), bx = [0.5, 0.25, 0.75], kx = (e) => cu(e.getBoundingClientRect(), bx), du = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, wx = Ao, $x = (e, t, { size: n }, a = wx) => fu(e, du[t], a * n, "stand");
function fu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const xx = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, mu = 0.1, Sx = (e, t, { size: n }) => fu(e, xx[t], mu * n, "sit"), _x = (e) => ((e + 180) % 360 + 360) % 360 - 180, ds = 60;
function ZE(e, t) {
  const n = _x(t);
  return !e.aside || Math.abs(n) >= ds ? t : n < 0 ? 360 - ds : ds;
}
const mn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Mx = (e) => [.../* @__PURE__ */ new Set([e, ...mn.turns.map((t) => (t + 360) % 360)])];
function eO(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Mx(t), l = mn.every[0] + a() * (mn.every[1] - mn.every[0]);
  return { face: t, from: s ? Cx(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Cx(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / mn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function tO(e, t) {
  const { element: n, edge: a } = Ba(), s = ["left", "right"].map((i) => qn(Sx(a, i, e), e)).filter((i) => n && Co(i, e) && !Eo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function nO(e, t, { size: n }) {
  const a = (Le.right - Le.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - hu } : e;
}
const hu = 7;
function pu() {
  const e = [...document.querySelectorAll(P4)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Ax(e, t) {
  const n = ht(e, t), a = n.right - n.left;
  return { left: n.left + Le.left * a, right: n.left + Le.right * a, top: n.top + Le.top * a, bottom: n.bottom };
}
function Ex(e, t) {
  const n = pu();
  return !n || !Ta(Ax(e, t), n);
}
const Ox = 4;
function Ba() {
  const e = Dn(), t = pu(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Ox || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - hu - n, 0) } };
}
const aO = ({ size: e, below: t }) => (1 - t) * e;
function qn(e, t) {
  const n = Pt(), { size: a, below: s } = t, o = Ln[e.posture].drop * a;
  return { ...vx(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ws = (e, t) => Object.keys(du).map((n) => qn($x(e, n, t), t)), Oo = (e, t) => cu(e, X4).map((n) => qn(n, t)), vu = (e, t, n) => _n(e, t, n) ?? e[0];
function sO(e, t) {
  const { element: n, edge: a } = Ba();
  return { ...vu(Ws(a, e), e, t), view: null, on: n };
}
function oO(e, t, n, a) {
  const { element: s, edge: o } = Ba(), l = (a ? Ws(o, t) : [...Ws(o, t), ...Oo(o, t)]).filter(
    (c) => !Ta(ht(c, t), e)
  ), i = _n(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !Eo(i, t) ? i : _n(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Dn() {
  var a;
  const e = Nn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Y4);
  if (!t) return { ...Ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const zl = { within: 2 };
function lO(e) {
  const { element: t, docked: n, edge: a } = Dn();
  if (!n || e.on !== t) return !0;
  const s = Ra().edge;
  return a.left > s.left + zl.within || a.left + a.width < s.left + s.width - zl.within;
}
const Tx = "[data-figure-closing]";
function iO() {
  var n;
  const { element: e, docked: t } = Dn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Tx));
}
const gu = "[data-figure-progress]";
function rO(e) {
  const t = e.querySelector(gu);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function uO(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Ix = { across: 300, above: 380, below: 60 };
function cO(e) {
  const { across: t, above: n, below: a } = Ix;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Bx(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Bx = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), yu = "[data-figure-bar]", Hs = { back: 144, along: 0.4 };
function dO(e) {
  const { element: t, docked: n, edge: a } = Dn(), s = n ? t.querySelector(yu) : null;
  if (!(s != null && s.querySelector(gu))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...qn({ x: o - Hs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function fO(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Hs.along * a.size ? t.x + Hs.along * a.size : e.x, y: e.y, behind: !0 };
}
function mO(e) {
  const t = e.querySelector(yu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ra() {
  const e = Nn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function hO(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ra(), u = n === null ? Rx(i, e, o === null ? t : { x: o, y: i.top }, a, s) : qn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function Rx(e, t, n, a, s) {
  const o = Oo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + yt.width < s && u.x + a - $t.reach - $t.room >= l);
  return _n(i.length ? i : o, t, n);
}
const Nx = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function pO(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, iu));
  const g = (U) => {
    const W = ht(U, n, Ln[U.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return Lx(g(e), g(t), g({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [w, ...M] = [e, ...u, t].map(g), C = ba(w, M[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), T = M.slice(1).map((U, W) => {
    var N;
    return (N = ba(M[W], U, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : N.legs.find((Q) => Q.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...T.filter(Boolean)] };
}
function Lx(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / Nx.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ba(e, n, o.size, { pace: l }) : ba(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function vO(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function gO(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && _n(kx(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Ba();
  return { ...vu(Oo(s, t), t, n), view: null, on: a };
}
const qx = "[data-figure-bubble]", Dx = 250;
let hn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), bu = 0;
const sn = () => hn, fs = /* @__PURE__ */ new WeakMap();
let Px = 0;
function To(e) {
  return fs.has(e) || fs.set(e, `floor-${++Px}`), fs.get(e);
}
const jx = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Fx = () => {
  var e, t;
  return ((t = (e = Nn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Wx(e, t) {
  var a;
  const n = (a = e.querySelector(Q4)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Hx(e, t) {
  const n = e && Wx(e, t), a = e ? [...e.querySelectorAll(qx)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || jx(l, n))).map(({ element: o, type: l, box: i }) => ({ id: To(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const zx = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Dx ? (t.top - a.top) / s * 1e3 : 0;
};
function ku(e = hn, t = performance.now()) {
  const n = Pt(), a = Fx(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Dn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ra();
  return c.element && u.push({ id: To(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...Hx(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: zx(e, f, t) }))) });
}
const zs = /* @__PURE__ */ new Set();
function Ux(e) {
  return zs.add(e), () => zs.delete(e);
}
function Vx() {
  wu();
  const e = () => {
    bu = requestAnimationFrame(e), !document.hidden && (hn = ku(hn), zs.forEach((t) => t(hn)));
  };
  e();
}
function wu() {
  cancelAnimationFrame(bu);
}
const Io = 5, Gx = 56, Kx = { share: 0.6 }, Yx = (e) => -Math.sqrt(2 * xo * Kx.share * e), Xt = (e, t) => e.find((n) => n.id === t) ?? null;
function yO(e, t = ku().floors) {
  const n = Xt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : To(e.on) : null, o = s && Xt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function $u({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = sn().floors) {
  const c = Xt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Qx(c, f, o)) && Xx(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Bo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Qx = (e, t, n) => !Bo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function bO(e, t = sn().floors) {
  if (!Bo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Io && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Xx(e, t, n = sn().floors) {
  const a = Xt(n, "home");
  return e.posture === "hang" && a && ht(e, t).bottom >= a.top ? !1 : Co(e, t);
}
function kO(e, t, n, a = sn().floors) {
  const s = $u(e, n, a);
  if (!e.home) return Jx(e, t, s, a);
  if (!s) return null;
  const o = Xt(a, "home"), l = s.y - t.y, i = l > Io ? "dropping" : -l > Gx ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Jx(e, t, n, a) {
  const s = n ? Xt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Yx(e.risen) };
  if (!n) return null;
  if (Bo(t) && n.y - t.y > Io) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function wO(e, t, n) {
  const a = Ao * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function $O(e, t, n, a = sn().floors) {
  const s = t && $u(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Zx = ["data-type"], e8 = { class: "figure-floor-name" }, t8 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", e8, v(e.floor.type), 1)
    ], 12, Zx));
  }
}, n8 = /* @__PURE__ */ H(t8, [["__scopeId", "data-v-4e0f1e2e"]]), a8 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, s8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = st(sn().floors);
    let n = () => {
    };
    return Ce(() => {
      n = Ux((a) => t.value = a.floors), Vx();
    }), Ne(() => {
      n(), wu();
    }), (a, s) => (r(), d("div", a8, [
      (r(!0), d(R, null, X(t.value, (o) => (r(), P(n8, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, xO = /* @__PURE__ */ H(s8, [["__scopeId", "data-v-e519168b"]]), pn = (e) => typeof e == "number" ? e : Date.parse(e);
function SO(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: pn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => pn(s.row.created_at) - pn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ul = 20;
async function _O(e, t, n) {
  for (let a = 0; a < Ul; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || pn(o.created_at) <= pn(s.created_at) || !await n()) return a;
  }
  return Ul;
}
const o8 = 3, ms = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function l8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ms[n.grouping]) == null ? void 0 : a.call(ms, e.row, n)) || "";
}
function i8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function MO(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= o8 ? [i8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = l8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const CO = (e) => (t) => t.filter((n) => n.id !== e), AO = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), EO = (e) => (t) => [...t, e], OO = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function TO(e, t = {}) {
  const n = lt(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function IO(e) {
  const t = lt(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Zn = /* @__PURE__ */ new Map();
function r8(e, t) {
  if (Zn.has(e)) return Zn.get(e);
  const n = t().finally(() => Zn.delete(e));
  return Zn.set(e, n), n;
}
function BO() {
  const e = lt(), t = _(null), n = _("");
  async function a() {
    const s = await r8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const u8 = { class: "cards-page" }, c8 = { class: "cards-bar" }, d8 = { class: "cards-count" }, f8 = { class: "cards" }, m8 = {
  key: 1,
  class: "cards-note"
}, h8 = {
  key: 2,
  class: "cards-note"
}, p8 = ["data-row", "onClick"], v8 = { class: "card-head" }, g8 = { class: "card-title" }, y8 = { class: "card-foot" }, b8 = {
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
    return (a, s) => (r(), d("div", u8, [
      h("div", c8, [
        h("span", d8, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ve, Fe({
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
            V(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", f8, [
        e.loaded ? e.failure ? (r(), d("p", m8, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", h8, "No " + v(e.term) + "s yet", 1)) : (r(), P(tt, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(R, null, X(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", v8, [
            A(ie, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            V(" " + v(e.head(o)), 1),
            A(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", g8, v(e.title(o)), 1),
          h("span", y8, v(e.foot(o)), 1)
        ], 8, p8))), 128))
      ]),
      ne(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, RO = /* @__PURE__ */ H(b8, [["__scopeId", "data-v-b39fea5d"]]), Vl = "newest";
function NO(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = _e(Re, null)) == null ? void 0 : c.search, s = _(""), o = _(Vl), l = _("all"), i = S(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => Mr(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Vl ? m : [...m].sort((p, g) => t(p).localeCompare(t(g)));
  }), u = S(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const k8 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, w8 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, $8 = 40, x8 = "top", S8 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = _e(Re, null)) == null ? void 0 : p.autoScroll, s = S(() => a === x8), o = _(null), l = _(!1), i = (g) => s.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var g;
      l.value = i(o.value) >= $8, s.value || (g = n.feed) == null || g.reachTop(o.value);
    }
    me(() => {
      var g;
      return [n.rowCount, (g = n.feed) == null ? void 0 : g.isLoaded()];
    }, async () => {
      await qe(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Ce(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), et(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (g, b) => (r(), d("div", k8, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ne(g.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", w8, [
        A(Zt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: q(() => [
            we(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(ie, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = V(" Newest ", -1))
            ], 512), [
              [Ys, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, LO = /* @__PURE__ */ H(S8, [["__scopeId", "data-v-d704d7e3"]]), _8 = ["aria-selected", "data-tab", "onClick"], M8 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, C8 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _e(Re, null), o = S(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const g = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!g) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: g.offsetLeft, width: g.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const f = () => qe(() => c(!0));
    let m = null;
    return Ce(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Ne(() => m == null ? void 0 : m.disconnect()), me(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), me(() => n.answer, f, { deep: !0 }), (p, g) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(R, null, X(o.value, (b) => {
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
          V(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", M8, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, _8);
      }), 128)),
      h("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ge({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, A8 = /* @__PURE__ */ H(C8, [["__scopeId", "data-v-63fcd326"]]), E8 = { class: "task-bar" }, O8 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", E8, [
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
}, qO = /* @__PURE__ */ H(O8, [["__scopeId", "data-v-eafa73d4"]]), T8 = {
  class: "tab-body",
  "data-tab-body": ""
}, I8 = { "data-tab-content": "" }, B8 = {
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
      n.value = !0, Qs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", T8, [
      n.value ? (r(), P(tt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      we(h("div", I8, [
        ne(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ys, !n.value]
      ])
    ]));
  }
}, DO = /* @__PURE__ */ H(B8, [["__scopeId", "data-v-63876533"]]), R8 = {
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
    return (o, l) => (r(), P(Tr, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: q(() => [
        A(wt, null, {
          default: q(() => [...l[2] || (l[2] = [
            V("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(R, null, X(a, (i) => A(ze, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: q(() => [
            V(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(R, { key: 0 }, [
          A(wt, null, {
            default: q(() => [...l[3] || (l[3] = [
              V("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(R, null, X(s, (i) => A(ze, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: q(() => [
              V(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: q(() => [
        ne(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, PO = /* @__PURE__ */ H(R8, [["__scopeId", "data-v-dab0064d"]]);
function jO() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const FO = (e) => import(
  /* @vite-ignore */
  e
), N8 = 86400, Us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function L8(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Us(t) - Us(e)) / N8);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function WO(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Us(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: L8(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const hs = 280, ps = 240, vs = 120, q8 = 6, D8 = 14, Mn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function P8(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function xu(e, t) {
  const n = Math.max(0, P8(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function j8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${D8}px)` }), e.offsetHeight, e.style.transition = `height ${hs}ms ${Mn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = xu(t, e));
    const p = s() - i;
    if (!u && p >= hs && (u = !0, e.style.transition = `opacity ${ps}ms ease-out, transform ${ps}ms ${Mn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < hs + ps) return a(m);
    f();
  };
  return a(m), f;
}
function HO(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${q8}px)` }), e.offsetHeight, e.style.transition = `opacity ${vs}ms ease-out, transform ${vs}ms ${Mn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = xu(t, e)), s() - l < vs) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const F8 = 140, ea = 220, Gl = 5;
function zO({ gap: e = F8, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, Gl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, g = j8) => {
    if (l || !m.pane || !m.follows()) return p();
    const b = { el: f, options: m, done: p, arrival: g, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Gl && c.flush();
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
function UO(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${ea}ms ${Mn}, opacity ${ea}ms ease-in, margin ${ea}ms ${Mn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, ea);
}
const Su = "chat.pins.minimised", la = _(ra(Su, !1));
function Kl(e) {
  la.value = e, fo(Su, e);
}
function W8(e) {
  const t = S(() => e()), n = S(() => la.value ? [] : e()), a = () => Kl(!la.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => Lt(o) > s).length,
    (o, l) => o > l && Kl(!1)
  ), { pins: t, visible: n, minimised: la, toggle: a };
}
const H8 = ["title"], z8 = {
  key: 0,
  class: "pins-count"
}, U8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = W8(() => t.pinRows);
    return (o, l) => B(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = be((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      A(ie, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (r(), d("span", z8, v(B(n).length), 1)) : k("", !0)
    ], 10, H8)) : k("", !0);
  }
}, VO = /* @__PURE__ */ H(U8, [["__scopeId", "data-v-d073c504"]]), V8 = ["title"], G8 = ["title"], K8 = { class: "diff-card-dir" }, Y8 = { class: "diff-card-name" }, Q8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, X8 = ["title"], J8 = ["title"], Z8 = {
  key: 0,
  class: "diff-card-note"
}, e3 = ["href"], t3 = ["src", "alt"], n3 = { class: "diff-card-rows" }, a3 = { class: "diff-row-num" }, s3 = { class: "diff-row-sign" }, o3 = { class: "diff-row-code" }, l3 = {
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
    function o(x) {
      (x.metaKey || x.ctrlKey) && (x.stopPropagation(), a("open", n.path));
    }
    const l = () => ({
      head: n.path,
      items: [
        { label: "Open file", group: "open", disabled: p.value, reason: "Deleted", run: () => location.hash = Aa.file(n.path) },
        { label: n.folded ? "Unfold" : "Fold", group: "open", disabled: p.value, reason: "Deleted", run: () => a("fold") },
        { label: "Copy path", group: "copy", run: ({ say: x }) => Yt(n.path, "the path", x) }
      ]
    }), i = { new: "created", deleted: "deleted", moved: "moved" }, u = { add: "+", del: "−" }, c = S(() => n.path.lastIndexOf("/") + 1), f = S(() => n.path.slice(0, c.value)), m = S(() => n.path.slice(c.value)), p = S(() => n.change === "deleted"), g = S(() => i[n.change]), b = S(() => new Set(n.rows.filter((x) => x.line_type === "add").map((x) => x.line))), w = _("after"), M = S(() => w.value === "before" ? n.whole.old : n.whole.text), C = S(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((x, y) => ({ line_type: w.value === "after" && b.value.has(y + 1) ? "add" : "ctx", line: y + 1, text: x })) : n.rows.filter(
      (x) => !(n.editsOnly && ["ctx", "fold"].includes(x.line_type)) && !(n.hideRemovals && x.line_type === "del")
    )), T = _(!1), U = S(() => n.lines && !T.value && !n.whole), W = S(() => U.value ? C.value.slice(0, n.lines) : C.value), N = S(() => C.value.length - W.value.length), Q = (x) => x.line === null || x.line_type === "del" ? "" : x.line, D = (x) => x.line_type === "fold" ? x.hidden ? `⋯ ${x.hidden} lines` : "⋯" : x.text, O = _(null), L = _(null);
    let z = null;
    return Ce(() => {
      if (!L.value) return;
      let x = !0;
      z = new ResizeObserver(() => {
        !O.value || !L.value || (O.value.style.transition = x ? "none" : "", O.value.style.height = `${L.value.offsetHeight}px`, x = !1);
      }), z.observe(L.value);
    }), Ne(() => z && z.disconnect()), (x, y) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: p.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      we((r(), d("header", {
        class: "diff-card-head",
        title: p.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: y[2] || (y[2] = ($) => !p.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${B(s)}-click to open it`,
          onClick: o
        }, [
          h("span", K8, v(f.value), 1),
          h("span", Y8, v(m.value), 1),
          g.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(g.value), 3)) : k("", !0),
          e.from ? (r(), d("span", Q8, "from " + v(e.from), 1)) : k("", !0)
        ], 8, G8),
        h("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: w.value === "after" ? "Show the file before" : "Show the file after",
          onClick: y[0] || (y[0] = be(($) => w.value = w.value === "after" ? "before" : "after", ["stop"]))
        }, v(w.value === "after" ? "After" : "Before"), 9, X8)) : k("", !0),
        p.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: y[1] || (y[1] = be(($) => a("whole"), ["stop"]))
        }, [
          A(ie, {
            name: "file",
            size: 12
          })
        ], 10, J8))
      ], 8, V8)), [
        [B(Qt), l]
      ]),
      e.whole && e.whole.error ? (r(), d("p", Z8, v(e.whole.error), 1)) : k("", !0),
      !p.value && !e.folded ? (r(), d(R, { key: 1 }, [
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
          }, null, 8, t3)
        ], 8, e3)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: L,
            class: "diff-card-diff"
          }, [
            h("div", n3, [
              (r(!0), d(R, null, X(W.value, ($, E) => (r(), d("div", {
                key: E,
                class: Y(["diff-row", $.line_type, { fresh: e.fresh && $.edit === e.fresh }])
              }, [
                h("span", a3, v(Q($)), 1),
                h("span", s3, v(u[$.line_type]), 1),
                h("span", o3, v(D($)), 1)
              ], 2))), 128)),
              N.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: y[3] || (y[3] = be(($) => T.value = !0, ["stop"]))
              }, v(N.value) + " more " + v(N.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, GO = /* @__PURE__ */ H(l3, [["__scopeId", "data-v-d1c7c037"]]), i3 = { "data-queue-controls": "" }, r3 = { class: "counts" }, u3 = { "data-queue-spots": "" }, c3 = {
  class: "spots",
  "aria-label": "Slot units in use"
}, d3 = { "data-queue-waiting": "" }, f3 = { key: 0 }, m3 = { class: "control" }, h3 = { class: "stepper" }, p3 = ["disabled"], v3 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, g3 = ["disabled"], y3 = ["for"], b3 = ["id", "value", "disabled", "onChange"], k3 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, w3 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, $3 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, x3 = {
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
    return (i, u) => (r(), d("div", i3, [
      A(qt, { icon: "gauge" }, {
        default: q(() => [...u[2] || (u[2] = [
          V("Now", -1)
        ])]),
        _: 1
      }),
      h("div", r3, [
        h("div", null, [
          h("strong", u3, [
            V(v(e.queue.used_slots) + " ", 1),
            h("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          h("p", null, "Slot units of long runs in use. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every unit is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "unit" : "units"} free.`), 1),
          h("div", c3, [
            (r(!0), d(R, null, X(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        h("div", null, [
          h("strong", d3, v(e.queue.waiting_count), 1),
          u[3] || (u[3] = h("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", f3, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      h("div", m3, [
        u[4] || (u[4] = h("div", null, [
          h("label", { id: "queue-limit-label" }, "Long lane capacity"),
          h("p", null, "Slot units of long runs that may run at the same time; a test or a build costs 4. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        h("div", h3, [
          h("button", {
            type: "button",
            "aria-label": "One slot unit fewer",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, p3),
          h("output", v3, v(e.queue.parallel_limit), 1),
          h("button", {
            type: "button",
            "aria-label": "One slot unit more",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, g3)
        ])
      ]),
      (r(!0), d(R, null, X(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, y3),
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
        }, null, 40, b3)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", k3, [
        A(ie, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = V("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", w3, [
        A(ie, {
          name: "pause",
          size: 13
        }),
        V("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", $3, v(o.value), 1)) : k("", !0)
    ]));
  }
}, S3 = /* @__PURE__ */ H(x3, [["__scopeId", "data-v-f0a1f7f7"]]), _3 = ["data-queue-row", "data-queue-process"], M3 = ["aria-expanded"], C3 = { class: "run-line" }, A3 = { class: "leading" }, E3 = {
  key: 0,
  "data-queue-position": ""
}, O3 = ["title"], T3 = { class: "command" }, I3 = {
  class: "time",
  "data-queue-time": ""
}, B3 = { class: "details" }, R3 = { "data-queue-type": "" }, N3 = { class: "failed" }, L3 = { class: "drop-inner" }, q3 = { class: "output" }, D3 = { class: "output-heading" }, P3 = ["href"], j3 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = Nr((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = ko(), u = S(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = S(() => {
      const g = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!g) return "";
      const b = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, w = Math.max(0, Math.floor((b - new Date(g).getTime()) / 1e3));
      return w < 60 ? `${w} s` : w < 3600 ? `${Math.floor(w / 60)} m ${w % 60} s` : `${Math.floor(w / 3600)} h ${String(Math.floor(w / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const g = s.value, b = g.scrollHeight - g.scrollTop - g.clientHeight < 2;
      await o.follow(), await qe(), n.expanded && b && (g.scrollTop = g.scrollHeight);
    }
    async function m() {
      n.expanded && (await o.newest(), await qe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    const p = () => ({
      head: kn(n.run.line, 40),
      items: [
        { label: n.expanded ? "Hide output" : "Show output", group: "open", run: () => a("toggle") },
        { label: "Copy command", group: "copy", run: ({ say: g }) => Yt(n.run.line, "the command", g) },
        { label: "Open its task", group: "copy", disabled: !n.run.task_id, reason: "No task", run: () => dt("tasks", n.run.task_id) }
      ]
    });
    return me(() => n.expanded, m, { immediate: !0 }), Bn(["output.*"], f, (g) => mi(g, /* @__PURE__ */ new Set([n.run.id]))), (g, b) => we((r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      h("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: b[2] || (b[2] = (w) => a("toggle")),
        onKeydown: [
          b[3] || (b[3] = ot(be((w) => a("toggle"), ["prevent"]), ["enter"])),
          b[4] || (b[4] = ot(be((w) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", C3, [
          h("span", A3, [
            e.run.section === "waiting" ? (r(), d("span", E3, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, O3))
          ]),
          h("code", T3, v(e.run.line), 1),
          h("span", I3, v(c.value), 1),
          A(ie, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", B3, [
          h("span", R3, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(R, { key: 0 }, [
            b[6] || (b[6] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: b[0] || (b[0] = be((w) => B(dt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(R, { key: 1 }, [
            b[7] || (b[7] = h("span", { class: "separator" }, "·", -1)),
            b[8] || (b[8] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(R, { key: 2 }, [
            b[9] || (b[9] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: b[1] || (b[1] = be((w) => B(dt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(R, { key: 3 }, [
            b[10] || (b[10] = h("span", { class: "separator" }, "·", -1)),
            h("span", N3, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, M3),
      h("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        h("div", L3, [
          h("div", q3, [
            h("div", D3, [
              h("span", null, "Output " + v(e.run.id), 1),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, P3)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: b[5] || (b[5] = (w) => e.expanded && B(o).loadEarlier(w.target))
            }, [
              b[11] || (b[11] = h("span", { class: "prompt" }, "$ ", -1)),
              V(v(e.run.line), 1),
              B(l).length ? (r(), d(R, { key: 0 }, [
                V(v(`
` + B(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, _3)), [
      [B(Qt), p]
    ]);
  }
}, F3 = /* @__PURE__ */ H(j3, [["__scopeId", "data-v-2998dafa"]]), W3 = {
  class: "lanes",
  "data-execution-lanes": ""
}, H3 = { class: "filters" }, z3 = ["value"], U3 = ["value"], V3 = ["data-lane"], G3 = {
  key: 0,
  class: "empty"
}, K3 = { class: "line" }, Y3 = { class: "facts" }, Q3 = { class: "line" }, X3 = { class: "facts" }, J3 = {
  class: "waits",
  "data-lanes-waits": ""
}, Z3 = {
  key: 0,
  class: "empty"
}, eS = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(""), a = _(""), s = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.class)))].sort()), o = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.starter)))].sort()), l = (m) => (!n.value || m.class === n.value) && (!a.value || m.starter === a.value), i = S(() => t.execution.lanes.map((m) => ({ ...m, running: m.running.filter(l), waiting: m.waiting.filter(l) }))), u = S(() => t.execution.waits.filter((m) => m.runs)), c = (m) => `${m.lane[0].toUpperCase()}${m.lane.slice(1)} lane`, f = (m) => m < 60 ? `${m} s` : `${Math.round(m / 60)} min`;
    return (m, p) => (r(), d("section", W3, [
      h("div", H3, [
        h("label", null, [
          p[3] || (p[3] = V("Class ", -1)),
          we(h("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (g) => n.value = g),
            "data-lanes-class": ""
          }, [
            p[2] || (p[2] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(R, null, X(s.value, (g) => (r(), d("option", {
              key: g,
              value: g
            }, v(g), 9, z3))), 128))
          ], 512), [
            [Rt, n.value]
          ])
        ]),
        h("label", null, [
          p[5] || (p[5] = V("Started by ", -1)),
          we(h("select", {
            "onUpdate:modelValue": p[1] || (p[1] = (g) => a.value = g),
            "data-lanes-starter": ""
          }, [
            p[4] || (p[4] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(R, null, X(o.value, (g) => (r(), d("option", {
              key: g,
              value: g
            }, v(g), 9, U3))), 128))
          ], 512), [
            [Rt, a.value]
          ])
        ])
      ]),
      (r(!0), d(R, null, X(i.value, (g) => (r(), d("div", {
        key: g.lane,
        class: "lane",
        "data-lane": g.lane
      }, [
        h("h2", null, [
          V(v(c(g)) + " ", 1),
          h("span", {
            class: Y(["room", { over: g.over_capacity }])
          }, [
            V(v(g.used) + " of " + v(g.capacity) + " in use", 1),
            g.over_capacity ? (r(), d(R, { key: 0 }, [
              V(", over capacity")
            ], 64)) : k("", !0),
            g.halted ? (r(), d(R, { key: 1 }, [
              V(", halted")
            ], 64)) : k("", !0)
          ], 2)
        ]),
        !g.running.length && !g.waiting.length ? (r(), d("p", G3, "Nothing runs or waits here.")) : k("", !0),
        h("ul", null, [
          (r(!0), d(R, null, X(g.running, (b, w) => (r(), d("li", {
            key: `run:${w}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            h("span", K3, v(b.line), 1),
            h("span", Y3, [
              V(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", running " + v(f(b.seconds)), 1),
              b.parent_line ? (r(), d(R, { key: 0 }, [
                V(", for " + v(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(R, null, X(g.waiting, (b, w) => (r(), d("li", {
            key: `wait:${w}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            h("span", Q3, v(b.line), 1),
            h("span", X3, [
              V(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", waiting " + v(f(b.seconds)) + ": " + v(b.reason), 1),
              b.raised_from ? (r(), d(R, { key: 0 }, [
                V(". Raised from " + v(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, V3))), 128)),
      h("div", J3, [
        p[6] || (p[6] = h("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", Z3, "No run started in the last hour.")),
        (r(!0), d(R, null, X(u.value, (g) => (r(), d("p", {
          key: g.priority,
          class: "wait"
        }, v(g.priority) + ": " + v(g.runs) + " started, longest wait " + v(f(g.longest_seconds)) + ", average " + v(f(g.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, tS = /* @__PURE__ */ H(eS, [["__scopeId", "data-v-4a25d644"]]), _u = ["instant", "short", "long"], Mu = ["background", "normal", "agent", "reserved", "immediate"], nS = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function Cu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const aS = ["data-class-row"], sS = { scope: "row" }, oS = { key: 0 }, lS = ["value"], iS = ["value"], rS = { class: "actions" }, uS = ["disabled"], cS = ["disabled"], dS = { class: "actions" }, fS = ["disabled"], mS = ["disabled"], hS = ["disabled"], pS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...Cu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", sS, [
        V(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", oS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(R, { key: 0 }, [
        h("td", null, [
          we(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(R, null, X(B(_u), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, lS))), 128))
          ], 512), [
            [Rt, o.value.lane]
          ])
        ]),
        h("td", null, [
          we(h("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (m) => o.value.cost = m),
            type: "number",
            min: "0",
            "aria-label": "Slot units",
            "data-class-cost": ""
          }, null, 512), [
            [
              Ye,
              o.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", null, [
          we(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(R, null, X(B(Mu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, iS))), 128))
          ], 512), [
            [Rt, o.value.priority]
          ])
        ]),
        h("td", null, [
          we(h("input", {
            "onUpdate:modelValue": f[3] || (f[3] = (m) => o.value.limit = m),
            type: "number",
            min: "0",
            "aria-label": "At once, 0 for no limit",
            "data-class-limit": ""
          }, null, 512), [
            [
              Ye,
              o.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", rS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, uS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, cS)
        ])
      ], 64)) : (r(), d(R, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", dS, [
          h("span", {
            class: Y(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, fS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, mS)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, hS)) : k("", !0)
        ])
      ], 64))
    ], 8, aS));
  }
}, vS = /* @__PURE__ */ H(pS, [["__scopeId", "data-v-e51b4825"]]), gS = { class: "fields" }, yS = ["disabled"], bS = ["disabled"], kS = ["value"], wS = ["value"], $S = { class: "buttons" }, xS = ["disabled"], SS = ["disabled"], _S = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, MS = { key: 1 }, CS = {
  key: 1,
  class: "hint"
}, AS = {
  key: 2,
  class: "failure",
  role: "alert"
}, ES = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = _(null), l = _(""), i = S(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    me(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...Cu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: be(c, ["prevent"])
    }, [
      h("div", gS, [
        h("label", null, [
          m[7] || (m[7] = V("Name", -1)),
          we(h("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value.name = p),
            required: "",
            "data-class-name": ""
          }, null, 512), [
            [
              Ye,
              s.value.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[8] || (m[8] = V("Line pattern", -1)),
          we(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, yS), [
            [Ye, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = V("Or plugin", -1)),
          we(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, bS), [
            [
              Ye,
              s.value.plugin,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[10] || (m[10] = V("Lane", -1)),
          we(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(R, null, X(B(_u), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, kS))), 128))
          ], 512), [
            [Rt, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = V("Slot units", -1)),
          we(h("input", {
            "onUpdate:modelValue": m[4] || (m[4] = (p) => s.value.cost = p),
            type: "number",
            min: "0"
          }, null, 512), [
            [
              Ye,
              s.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[12] || (m[12] = V("Priority", -1)),
          we(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(R, null, X(B(Mu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, wS))), 128))
          ], 512), [
            [Rt, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = V("At once", -1)),
          we(h("input", {
            "onUpdate:modelValue": m[6] || (m[6] = (p) => s.value.limit = p),
            type: "number",
            min: "0",
            title: "0 for no limit"
          }, null, 512), [
            [
              Ye,
              s.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      h("div", $S, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, xS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, SS)
      ]),
      o.value !== null ? (r(), d("div", _S, [
        o.value.length ? (r(), d(R, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(R, null, X(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", MS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", CS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", AS, v(l.value), 1)) : k("", !0)
    ], 32));
  }
}, OS = /* @__PURE__ */ H(ES, [["__scopeId", "data-v-f15e19ad"]]), TS = { "data-execution-classes": "" }, IS = ["for"], BS = ["id", "value", "disabled", "data-lane-setting", "onChange"], RS = { class: "control presets" }, NS = ["disabled", "data-class-preset", "onClick"], LS = { class: "scroll" }, qS = { "data-class-table": "" }, DS = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, PS = {
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
    return Ce(o), (i, u) => (r(), d("section", TS, [
      A(qt, { icon: "gauge" }, {
        default: q(() => [...u[0] || (u[0] = [
          V("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slot units it takes and its priority.", -1)),
      n.value ? (r(), d(R, { key: 0 }, [
        (r(!0), d(R, null, X(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              for: c.key
            }, v(c.title), 9, IS),
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
          }, null, 40, BS)
        ]))), 128)),
        h("div", RS, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(R, null, X(B(nS), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, NS))), 128))
        ]),
        h("div", LS, [
          h("table", qS, [
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
              (r(!0), d(R, null, X(n.value.classes, (c) => (r(), P(vS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(OS, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", DS, v(a.value), 1)) : k("", !0)
    ]));
  }
}, jS = /* @__PURE__ */ H(PS, [["__scopeId", "data-v-f6def058"]]), FS = {
  class: "process-queue",
  "data-test-queue": ""
}, WS = {
  key: 0,
  class: "lead"
}, HS = { class: "scroll" }, zS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, US = ["data-queue-empty"], gs = 20, VS = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = S(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = _(null), s = _(""), o = _([]), l = _(gs), i = S(() => {
      var g, b;
      return (((g = a.value) == null ? void 0 : g.recent_total) ?? 0) > (((b = a.value) == null ? void 0 : b.recent.length) ?? 0);
    });
    let u = 0;
    const c = S(() => a.value ? [
      { type: "running", heading: "Running", icon: "start", rows: a.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: a.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: a.value.recent, empty: "Nothing has run yet." }
    ].flatMap((b) => [
      { key: `band:${b.type}`, section: b },
      ...b.rows.length ? b.rows.map((w, M) => ({ key: `run:${w.id}`, run: w, position: M + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
    ]) : []);
    function f(g) {
      o.value = o.value.includes(g) ? o.value.filter((b) => b !== g) : [...o.value, g];
    }
    async function m() {
      const g = ++u, b = await t.read([...l.value === gs ? ["queue", "list"] : ["queue", "list", "--recent", String(l.value)], ...n.value]);
      g === u && (s.value = b.ok ? "" : b.error, b.ok && (a.value = b.value));
    }
    function p() {
      l.value += gs, m();
    }
    return Bn(["process.*", "setting.*"], m), Ce(m), (g, b) => (r(), d("article", FS, [
      e.agent ? k("", !0) : (r(), d("p", WS, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      h("div", HS, [
        s.value ? (r(), d("p", zS, v(s.value), 1)) : k("", !0),
        a.value ? (r(), d(R, { key: 1 }, [
          e.agent ? k("", !0) : (r(), P(S3, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: m
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), P(tS, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          A(Ks, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: q(() => [
              (r(!0), d(R, null, X(c.value, (w) => (r(), d(R, {
                key: w.key
              }, [
                w.run ? (r(), P(F3, {
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
                }, v(w.section.empty), 9, US)) : (r(), P(qt, {
                  key: 2,
                  class: "sticky-band",
                  icon: w.section.icon,
                  count: w.section.rows.length,
                  "data-queue-heading": w.section.type
                }, {
                  default: q(() => [
                    V(v(w.section.heading), 1)
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
          e.agent ? k("", !0) : (r(), P(jS, {
            key: 3,
            read: e.read
          }, null, 8, ["read"]))
        ], 64)) : s.value ? k("", !0) : (r(), P(tt, { key: 2 }))
      ])
    ]));
  }
}, KO = /* @__PURE__ */ H(VS, [["__scopeId", "data-v-a016178b"]]), GS = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, KS = ["aria-expanded"], YS = {
  class: "links-count",
  "data-inspector-links-count": ""
}, QS = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, XS = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, JS = {
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
    }, { immediate: !0 }), Bn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(R, null, [
      a.value ? (r(), d("section", GS, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", YS, v(a.value), 1),
          A(an, { open: n.value }, null, 8, ["open"])
        ], 8, KS),
        h("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", QS, [
            A(Nd, {
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
      o.value ? (r(), d("p", XS, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Au = /* @__PURE__ */ H(JS, [["__scopeId", "data-v-a4550728"]]), ZS = ["placeholder"], e6 = { class: "actions" }, t6 = { class: "error" }, n6 = {
  key: 1,
  class: "card closed"
}, a6 = { class: "mark" }, s6 = { class: "prompt" }, o6 = {
  key: 0,
  class: "draft"
}, l6 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Bt({
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
  emits: /* @__PURE__ */ Bt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Gt(e, "draft"), l = Gt(e, "error"), i = _(!!l.value), u = _(!1), c = _(!1), f = _(null);
    async function m() {
      var b, w;
      i.value = !0, u.value = !1, await qe(), (w = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || w.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function g() {
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
        onSubmit: be(g, ["prevent"]),
        onKeydown: ot(p, ["esc"])
      }, [
        ne(b.$slots, "who", {}, void 0, !0),
        we(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: w[1] || (w[1] = ot((M) => B(dr)(M, g), ["enter"]))
        }, null, 40, ZS), [
          [Ye, o.value]
        ]),
        h("div", e6, [
          h("span", t6, v(l.value), 1),
          A(ve, {
            small: "",
            onClick: p
          }, {
            default: q(() => [...w[3] || (w[3] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: q(() => [...w[4] || (w[4] = [
              V("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", n6, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", a6, [
            A(ie, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", s6, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", o6, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[2] || (w[2] = (M) => s("show"))
        }, [
          h("span", null, v(B(qd)(e.count, "comment")), 1),
          A(ie, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, i6 = /* @__PURE__ */ H(l6, [["__scopeId", "data-v-b68baddd"]]), r6 = { wide: 1130 }, u6 = /\{([A-Za-z_]\w*)\}/g;
function ia(e, t, n = {}) {
  return e.replace(u6, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const c6 = (e, t, n, a) => ia(e.label, n, { row_id: a, id: a }) || Q$(t, n, a), d6 = { class: "comment-side-head" }, f6 = {
  key: 0,
  class: "comment-none"
}, m6 = { key: 0 }, h6 = {
  key: 1,
  class: "comment-none"
}, p6 = {
  class: "comment",
  "data-comment": ""
}, v6 = {
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
      h("header", d6, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(Ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", f6, "No comments yet")) : k("", !0),
      (r(!0), d(R, null, X(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", m6, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", h6, "Revision " + v(a.revision), 1)) : k("", !0),
        h("p", p6, v(e.words(a)), 1)
      ]))), 128)),
      A(An, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Yl = /* @__PURE__ */ H(v6, [["__scopeId", "data-v-276284a3"]]), g6 = { class: "resource-heading" }, y6 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, b6 = {
  key: 1,
  class: "resource-abstract"
}, k6 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", g6, [
      e.title ? (r(), d("h2", y6, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", b6, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, Eu = /* @__PURE__ */ H(k6, [["__scopeId", "data-v-172f09ac"]]), w6 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, $6 = { class: "inspector-icons" }, x6 = { class: "inspector-icons-start" }, S6 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, _6 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, M6 = { class: "inspector-icons-end" }, C6 = ["href"], A6 = {
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
    return (u, c) => (r(), d("header", w6, [
      h("div", $6, [
        h("span", x6, [
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
          e.stepped ? (r(), d(R, { key: 1 }, [
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
        l.value ? (r(), d("h2", S6, v(e.title), 1)) : (r(), d("p", _6, v(e.label), 1)),
        h("span", M6, [
          e.embedded ? (r(), P(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => B(je)(s.value))
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
            href: B(Pm)(s.value)
          }, [
            A(ie, {
              name: "share",
              size: 13
            })
          ], 8, C6)) : k("", !0),
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
      A(Eu, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, E6 = /* @__PURE__ */ H(A6, [["__scopeId", "data-v-8886850d"]]), O6 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, T6 = { class: "field-name" }, I6 = {
  key: 1,
  class: "field-value"
}, B6 = ["onClick"], R6 = {
  key: 2,
  class: "field-value"
}, N6 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", O6, [
      (r(!0), d(R, null, X(e.fields, (o) => (r(), d(R, {
        key: o.name
      }, [
        h("p", T6, v(o.label), 1),
        o.isTime ? (r(), P(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", I6, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, B6)
        ])) : (r(), d("p", R6, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Ou = /* @__PURE__ */ H(N6, [["__scopeId", "data-v-7e45afb5"]]);
async function L6(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: X$(s.value.actor, s.value.creator_agent), owner: a.length ? J$(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const q6 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, D6 = {
  key: 1,
  class: "inspector-wait"
}, P6 = { class: "inspector-main" }, j6 = { class: "inspector-column" }, F6 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, W6 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, H6 = { class: "inspector-text" }, z6 = ["innerHTML"], U6 = {
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
    Gs(pi, S(() => {
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
    }), i = _(null), u = _(""), c = _(""), f = _(""), m = _("details"), p = _(null), g = _(0);
    let b = 0;
    const w = S(() => ({ row_id: n.id, id: n.id })), M = S(() => i.value ? ia(l.value.title, i.value, w.value) || Y$(n.term, i.value, n.id) : ""), C = S(() => i.value ? c6(l.value, n.term, i.value, n.id) : ""), T = S(() => C.value === M.value ? "" : C.value), U = S(() => i.value ? ia(l.value.description, i.value, w.value) : ""), W = S(() => {
      var j, G, Z;
      return ((j = i.value) == null ? void 0 : j.body) || ((G = i.value) == null ? void 0 : G.brief) || (o.has(n.term) ? (Z = i.value) == null ? void 0 : Z.text : "") || "";
    }), N = S(() => W.value ? mo(W.value, { env: "", rowNames: !1 }) : ""), Q = S(() => Z$(i.value, W.value, u.value, c.value)), D = S(() => l.value.comments && g.value >= r6.wide), O = S(() => l.value.comments && !D.value), L = (j) => l.value.components.filter((G) => (G.tab || "") === j).map((G) => G.window), z = S(() => [...new Set(l.value.components.map((j) => j.tab).filter(Boolean))]), x = S(() => z.value.length || O.value ? [{ key: "details", label: "Details" }, ...z.value.map((j) => ({ key: j, label: j })), ...O.value ? [{ key: "comments", label: "Comments" }] : []] : []), y = S(() => {
      const j = l.value.links;
      return j ? { categories: j.categories, open: j.open, outsidePlan: j.excludes_plan, pageSize: j.page_size } : null;
    }), $ = yr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (j) => n.read(j));
    async function E() {
      const j = ++b, G = await n.read(ia(l.value.reads, null, w.value).split(/\s+/).filter(Boolean));
      if (j !== b || (f.value = G.ok ? "" : G.error, !G.ok)) return;
      i.value = G.value;
      const Z = await L6(n.read, i.value);
      j === b && (u.value = Z.creator, c.value = Z.owner);
    }
    me(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", E();
    }, { immediate: !0 }), Bn(l.value.events, E), me($.open, (j) => j && O.value && (m.value = "comments"));
    let I = null;
    return Ce(() => {
      var j;
      g.value = ((j = p.value) == null ? void 0 : j.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (I = new ResizeObserver(() => g.value = p.value.clientWidth), I.observe(p.value));
    }), Ne(() => I == null ? void 0 : I.disconnect()), (j, G) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(E6, {
        label: T.value,
        title: M.value,
        description: U.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: G[0] || (G[0] = (Z) => a("close")),
        onBack: G[1] || (G[1] = (Z) => a("back")),
        onStep: G[2] || (G[2] = (Z) => a("step", Z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", q6, v(f.value), 1)) : i.value ? (r(), d(R, { key: 2 }, [
        A(Ns, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: q(() => [
            A(co, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: E
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", P6, [
          h("div", j6, [
            x.value.length ? (r(), d("div", F6, [
              A(Nt, {
                options: x.value,
                value: m.value,
                onPick: G[3] || (G[3] = (Z) => m.value = Z)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", W6, [
              A(en, { value: m.value }, {
                details: q(() => [
                  h("div", H6, [
                    N.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, z6)) : k("", !0),
                    l.value.lists_fields ? (r(), P(Ou, {
                      key: 1,
                      fields: Q.value,
                      onPeek: G[4] || (G[4] = (Z) => a("open", Z))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(Bs, {
                    "slot-name": `inspector.${e.term}`,
                    names: L(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: q(() => [
                  A(Yl, {
                    below: "",
                    comments: B($).comments.value,
                    words: B($).words,
                    more: !!B($).nextPage.value,
                    loading: B($).loading.value,
                    failure: B($).failure.value,
                    onMore: B($).loadMore,
                    onClose: G[5] || (G[5] = (Z) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: q(() => [
                  A(Bs, {
                    names: L(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              y.value ? (r(), P(Au, Fe({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, y.value, {
                onOpen: G[6] || (G[6] = (Z) => a("open", Z))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), P(i6, {
              key: 1,
              send: B($).send,
              count: B($).total.value,
              onShow: G[7] || (G[7] = (Z) => O.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          D.value ? (r(), P(Yl, {
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
      ], 64)) : (r(), d("div", D6, [
        A(tt)
      ]))
    ], 512));
  }
}, V6 = /* @__PURE__ */ H(U6, [["__scopeId", "data-v-60363e95"]]), YO = {
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
    const t = _e(oo);
    return (n, a) => (r(), P(V6, Fe(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, G6 = { class: "facts" }, K6 = { class: "fact wide" }, Y6 = ["title"], Q6 = {
  key: 1,
  class: "fact-value"
}, X6 = {
  key: 0,
  class: "fact"
}, J6 = { class: "fact-value" }, Z6 = { class: "fact" }, e_ = { class: "fact-label" }, t_ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, n_ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, a_ = {
  key: 2,
  class: "fact"
}, s_ = { class: "fact-value" }, o_ = { class: "fact wide" }, l_ = { class: "fact-label" }, i_ = { class: "fact wide" }, r_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, u_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ha.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", G6, [
        h("div", K6, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => B(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, Y6)) : (r(), d("span", Q6, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", X6, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", J6, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(R, { key: 1 }, [
          h("div", Z6, [
            h("span", e_, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(yn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: B(vo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => B(je)(`agents:${e.task.helper_id}`))
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
          B(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", t_, [
            A(Ut, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = V(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", n_, [
            A(Ut, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = V(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", a_, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", s_, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", o_, [
          h("span", l_, [
            i[9] || (i[9] = V(" Complexity ", -1)),
            A(Mi, {
              lines: B(_r).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Nt, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", i_, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(Nt, {
            options: B(n),
            value: String(B(Sr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", r_, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, c_ = /* @__PURE__ */ H(u_, [["__scopeId", "data-v-4bf27961"]]);
function d_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const f_ = { class: "number" }, m_ = { class: "title" }, h_ = { class: "word" }, p_ = {
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
    return (a, s) => (r(), P(Xe(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: q(() => [
        A(Ea, { status: e.status }, null, 8, ["status"]),
        h("span", f_, v(e.number), 1),
        h("span", m_, v(e.title), 1),
        h("span", h_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ys = /* @__PURE__ */ H(p_, [["__scopeId", "data-v-f6417ae8"]]), v_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, g_ = { class: "level" }, y_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = S(() => d_(n.task.id, n.graph)), l = S(() => s.value ? o.value.above : o.value.above.slice(-1)), i = S(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = S(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: bn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", v_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(R, null, X(l.value, (g) => (r(), d(R, {
        key: g.map((b) => b.id).join()
      }, [
        h("div", g_, [
          (r(!0), d(R, null, X(g, (b) => (r(), P(ys, Fe({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (w) => a("select", w))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(ys, ks(ti(f(e.task, !0))), null, 16),
      (r(!0), d(R, null, X(i.value, (g) => (r(), d(R, {
        key: g.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(ys, Fe({ ref_for: !0 }, f(g), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (g) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, b_ = /* @__PURE__ */ H(y_, [["__scopeId", "data-v-79c52417"]]), k_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, w_ = ["datetime"], $_ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", k_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(R, null, X(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, w_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, x_ = /* @__PURE__ */ H($_, [["__scopeId", "data-v-b41f213b"]]), S_ = {
  class: "part",
  "data-resource-waits": ""
}, __ = ["onClick"], M_ = { class: "wait-id" }, C_ = { class: "wait-title" }, A_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", S_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(R, null, X(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(Ea, {
          status: B(bn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", M_, v(o.id), 1),
        h("span", C_, v(o.title), 1)
      ], 8, __))), 128))
    ]));
  }
}, Ql = /* @__PURE__ */ H(A_, [["__scopeId", "data-v-8fb2e251"]]), E_ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, O_ = { class: "text" }, T_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, I_ = 180, B_ = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = S(() => a.task.waits.filter((u) => !n.has(u.state))), i = S(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(R, null, [
      l.value.length ? (r(), P(Ql, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", E_, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", O_, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", T_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > I_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), P(Ql, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, R_ = /* @__PURE__ */ H(B_, [["__scopeId", "data-v-4a3f1e79"]]), N_ = {
  class: "task-details",
  "data-task-details": ""
}, L_ = { class: "since" }, q_ = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, D_ = { class: "text" }, P_ = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, j_ = {
  key: 1,
  class: "note"
}, F_ = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, W_ = { class: "text" }, H_ = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", N_, [
        h("div", {
          class: Y(["state-line", B(bn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(Ea, {
              status: B(bn)(e.task.state)
            }, null, 8, ["status"]),
            V(" " + v(a(e.task.state)), 1)
          ]),
          h("span", L_, [
            o[5] || (o[5] = V(" since ", -1)),
            A(Ze, {
              at: B(gh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", q_, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", D_, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", P_, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", j_, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", F_, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", W_, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), P(b_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(c_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(R_, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(x_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, QO = /* @__PURE__ */ H(H_, [["__scopeId", "data-v-7e73fa21"]]), z_ = 50, U_ = { messages: 25 }, V_ = (e) => U_[e] || z_, G_ = {
  class: "task-log",
  "aria-label": "Task log"
}, K_ = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Y_ = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Q_ = { class: "entries" }, X_ = ["data-task-log-important"], J_ = ["datetime"], Z_ = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, eM = {
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
        String(V_("task_logs")),
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
    ), et(() => {
      i += 1;
    }), (c, f) => (r(), d("section", G_, [
      o.value ? (r(), P(tt, { key: 0 })) : l.value ? (r(), d(R, { key: 1 }, [
        h("p", K_, v(l.value), 1),
        A(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: q(() => [...f[3] || (f[3] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(R, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", Y_, "No log entries yet.")),
        h("ol", Q_, [
          (r(!0), d(R, null, X(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: Y(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, J_),
            h("p", null, v(m.line), 1)
          ], 10, X_))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", Z_, [
          A(ve, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: q(() => [...f[4] || (f[4] = [
              V("Newer", -1)
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
              V("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, XO = /* @__PURE__ */ H(eM, [["__scopeId", "data-v-cfa43bf1"]]);
function tM(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var bs = { exports: {} }, Xl;
function nM() {
  return Xl || (Xl = 1, (function(e, t) {
    var n = (function() {
      var a = function(N, Q) {
        var D = 236, O = 17, L = N, z = o[Q], x = null, y = 0, $ = null, E = [], I = {}, j = function(F, J) {
          y = L * 4 + 17, x = (function(K) {
            for (var ee = new Array(K), te = 0; te < K; te += 1) {
              ee[te] = new Array(K);
              for (var se = 0; se < K; se += 1)
                ee[te][se] = null;
            }
            return ee;
          })(y), G(0, 0), G(y - 7, 0), G(0, y - 7), ce(), oe(), Ae(F, J), L >= 7 && $e(F), $ == null && ($ = le(L, z, E)), He($, J);
        }, G = function(F, J) {
          for (var K = -1; K <= 7; K += 1)
            if (!(F + K <= -1 || y <= F + K))
              for (var ee = -1; ee <= 7; ee += 1)
                J + ee <= -1 || y <= J + ee || (0 <= K && K <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (K == 0 || K == 6) || 2 <= K && K <= 4 && 2 <= ee && ee <= 4 ? x[F + K][J + ee] = !0 : x[F + K][J + ee] = !1);
        }, Z = function() {
          for (var F = 0, J = 0, K = 0; K < 8; K += 1) {
            j(!0, K);
            var ee = i.getLostPoint(I);
            (K == 0 || F > ee) && (F = ee, J = K);
          }
          return J;
        }, oe = function() {
          for (var F = 8; F < y - 8; F += 1)
            x[F][6] == null && (x[F][6] = F % 2 == 0);
          for (var J = 8; J < y - 8; J += 1)
            x[6][J] == null && (x[6][J] = J % 2 == 0);
        }, ce = function() {
          for (var F = i.getPatternPosition(L), J = 0; J < F.length; J += 1)
            for (var K = 0; K < F.length; K += 1) {
              var ee = F[J], te = F[K];
              if (x[ee][te] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var de = -2; de <= 2; de += 1)
                    se == -2 || se == 2 || de == -2 || de == 2 || se == 0 && de == 0 ? x[ee + se][te + de] = !0 : x[ee + se][te + de] = !1;
            }
        }, $e = function(F) {
          for (var J = i.getBCHTypeNumber(L), K = 0; K < 18; K += 1) {
            var ee = !F && (J >> K & 1) == 1;
            x[Math.floor(K / 3)][K % 3 + y - 8 - 3] = ee;
          }
          for (var K = 0; K < 18; K += 1) {
            var ee = !F && (J >> K & 1) == 1;
            x[K % 3 + y - 8 - 3][Math.floor(K / 3)] = ee;
          }
        }, Ae = function(F, J) {
          for (var K = z << 3 | J, ee = i.getBCHTypeInfo(K), te = 0; te < 15; te += 1) {
            var se = !F && (ee >> te & 1) == 1;
            te < 6 ? x[te][8] = se : te < 8 ? x[te + 1][8] = se : x[y - 15 + te][8] = se;
          }
          for (var te = 0; te < 15; te += 1) {
            var se = !F && (ee >> te & 1) == 1;
            te < 8 ? x[8][y - te - 1] = se : te < 9 ? x[8][15 - te - 1 + 1] = se : x[8][15 - te - 1] = se;
          }
          x[y - 8][8] = !F;
        }, He = function(F, J) {
          for (var K = -1, ee = y - 1, te = 7, se = 0, de = i.getMaskFunction(J), ue = y - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var Me = 0; Me < 2; Me += 1)
                if (x[ee][ue - Me] == null) {
                  var Te = !1;
                  se < F.length && (Te = (F[se] >>> te & 1) == 1);
                  var pe = de(ee, ue - Me);
                  pe && (Te = !Te), x[ee][ue - Me] = Te, te -= 1, te == -1 && (se += 1, te = 7);
                }
              if (ee += K, ee < 0 || y <= ee) {
                ee -= K, K = -K;
                break;
              }
            }
        }, he = function(F, J) {
          for (var K = 0, ee = 0, te = 0, se = new Array(J.length), de = new Array(J.length), ue = 0; ue < J.length; ue += 1) {
            var Me = J[ue].dataCount, Te = J[ue].totalCount - Me;
            ee = Math.max(ee, Me), te = Math.max(te, Te), se[ue] = new Array(Me);
            for (var pe = 0; pe < se[ue].length; pe += 1)
              se[ue][pe] = 255 & F.getBuffer()[pe + K];
            K += Me;
            var Ue = i.getErrorCorrectPolynomial(Te), Ve = c(se[ue], Ue.getLength() - 1), Ro = Ve.mod(Ue);
            de[ue] = new Array(Ue.getLength() - 1);
            for (var pe = 0; pe < de[ue].length; pe += 1) {
              var No = pe + Ro.getLength() - de[ue].length;
              de[ue][pe] = No >= 0 ? Ro.getAt(No) : 0;
            }
          }
          for (var Lo = 0, pe = 0; pe < J.length; pe += 1)
            Lo += J[pe].totalCount;
          for (var Na = new Array(Lo), Pn = 0, pe = 0; pe < ee; pe += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              pe < se[ue].length && (Na[Pn] = se[ue][pe], Pn += 1);
          for (var pe = 0; pe < te; pe += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              pe < de[ue].length && (Na[Pn] = de[ue][pe], Pn += 1);
          return Na;
        }, le = function(F, J, K) {
          for (var ee = f.getRSBlocks(F, J), te = m(), se = 0; se < K.length; se += 1) {
            var de = K[se];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), F)), de.write(te);
          }
          for (var ue = 0, se = 0; se < ee.length; se += 1)
            ue += ee[se].dataCount;
          if (te.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ue * 8 + ")";
          for (te.getLengthInBits() + 4 <= ue * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ue * 8 || (te.put(D, 8), te.getLengthInBits() >= ue * 8)); )
            te.put(O, 8);
          return he(te, ee);
        };
        I.addData = function(F, J) {
          J = J || "Byte";
          var K = null;
          switch (J) {
            case "Numeric":
              K = p(F);
              break;
            case "Alphanumeric":
              K = g(F);
              break;
            case "Byte":
              K = b(F);
              break;
            case "Kanji":
              K = w(F);
              break;
            default:
              throw "mode:" + J;
          }
          E.push(K), $ = null;
        }, I.isDark = function(F, J) {
          if (F < 0 || y <= F || J < 0 || y <= J)
            throw F + "," + J;
          return x[F][J];
        }, I.getModuleCount = function() {
          return y;
        }, I.make = function() {
          if (L < 1) {
            for (var F = 1; F < 40; F++) {
              for (var J = f.getRSBlocks(F, z), K = m(), ee = 0; ee < E.length; ee++) {
                var te = E[ee];
                K.put(te.getMode(), 4), K.put(te.getLength(), i.getLengthInBits(te.getMode(), F)), te.write(K);
              }
              for (var se = 0, ee = 0; ee < J.length; ee++)
                se += J[ee].dataCount;
              if (K.getLengthInBits() <= se * 8)
                break;
            }
            L = F;
          }
          j(!1, Z());
        }, I.createTableTag = function(F, J) {
          F = F || 2, J = typeof J > "u" ? F * 4 : J;
          var K = "";
          K += '<table style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: " + J + "px;", K += '">', K += "<tbody>";
          for (var ee = 0; ee < I.getModuleCount(); ee += 1) {
            K += "<tr>";
            for (var te = 0; te < I.getModuleCount(); te += 1)
              K += '<td style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: 0px;", K += " width: " + F + "px;", K += " height: " + F + "px;", K += " background-color: ", K += I.isDark(ee, te) ? "#000000" : "#ffffff", K += ";", K += '"/>';
            K += "</tr>";
          }
          return K += "</tbody>", K += "</table>", K;
        }, I.createSvgTag = function(F, J, K, ee) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], F = te.cellSize, J = te.margin, K = te.alt, ee = te.title), F = F || 2, J = typeof J > "u" ? F * 4 : J, K = typeof K == "string" ? { text: K } : K || {}, K.text = K.text || null, K.id = K.text ? K.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var se = I.getModuleCount() * F + J * 2, de, ue, Me, Te, pe = "", Ue;
          for (Ue = "l" + F + ",0 0," + F + " -" + F + ",0 0,-" + F + "z ", pe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', pe += te.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', pe += ' viewBox="0 0 ' + se + " " + se + '" ', pe += ' preserveAspectRatio="xMinYMin meet"', pe += ee.text || K.text ? ' role="img" aria-labelledby="' + ae([ee.id, K.id].join(" ").trim()) + '"' : "", pe += ">", pe += ee.text ? '<title id="' + ae(ee.id) + '">' + ae(ee.text) + "</title>" : "", pe += K.text ? '<description id="' + ae(K.id) + '">' + ae(K.text) + "</description>" : "", pe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', pe += '<path d="', Me = 0; Me < I.getModuleCount(); Me += 1)
            for (Te = Me * F + J, de = 0; de < I.getModuleCount(); de += 1)
              I.isDark(Me, de) && (ue = de * F + J, pe += "M" + ue + "," + Te + Ue);
          return pe += '" stroke="transparent" fill="black"/>', pe += "</svg>", pe;
        }, I.createDataURL = function(F, J) {
          F = F || 2, J = typeof J > "u" ? F * 4 : J;
          var K = I.getModuleCount() * F + J * 2, ee = J, te = K - J;
          return W(K, K, function(se, de) {
            if (ee <= se && se < te && ee <= de && de < te) {
              var ue = Math.floor((se - ee) / F), Me = Math.floor((de - ee) / F);
              return I.isDark(Me, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, I.createImgTag = function(F, J, K) {
          F = F || 2, J = typeof J > "u" ? F * 4 : J;
          var ee = I.getModuleCount() * F + J * 2, te = "";
          return te += "<img", te += ' src="', te += I.createDataURL(F, J), te += '"', te += ' width="', te += ee, te += '"', te += ' height="', te += ee, te += '"', K && (te += ' alt="', te += ae(K), te += '"'), te += "/>", te;
        };
        var ae = function(F) {
          for (var J = "", K = 0; K < F.length; K += 1) {
            var ee = F.charAt(K);
            switch (ee) {
              case "<":
                J += "&lt;";
                break;
              case ">":
                J += "&gt;";
                break;
              case "&":
                J += "&amp;";
                break;
              case '"':
                J += "&quot;";
                break;
              default:
                J += ee;
                break;
            }
          }
          return J;
        }, ye = function(F) {
          var J = 1;
          F = typeof F > "u" ? J * 2 : F;
          var K = I.getModuleCount() * J + F * 2, ee = F, te = K - F, se, de, ue, Me, Te, pe = {
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
          for (se = 0; se < K; se += 2) {
            for (ue = Math.floor((se - ee) / J), Me = Math.floor((se + 1 - ee) / J), de = 0; de < K; de += 1)
              Te = "█", ee <= de && de < te && ee <= se && se < te && I.isDark(ue, Math.floor((de - ee) / J)) && (Te = " "), ee <= de && de < te && ee <= se + 1 && se + 1 < te && I.isDark(Me, Math.floor((de - ee) / J)) ? Te += " " : Te += "█", Ve += F < 1 && se + 1 >= te ? Ue[Te] : pe[Te];
            Ve += `
`;
          }
          return K % 2 && F > 0 ? Ve.substring(0, Ve.length - K - 1) + Array(K + 1).join("▀") : Ve.substring(0, Ve.length - 1);
        };
        return I.createASCII = function(F, J) {
          if (F = F || 1, F < 2)
            return ye(J);
          F -= 1, J = typeof J > "u" ? F * 2 : J;
          var K = I.getModuleCount() * F + J * 2, ee = J, te = K - J, se, de, ue, Me, Te = Array(F + 1).join("██"), pe = Array(F + 1).join("  "), Ue = "", Ve = "";
          for (se = 0; se < K; se += 1) {
            for (ue = Math.floor((se - ee) / F), Ve = "", de = 0; de < K; de += 1)
              Me = 1, ee <= de && de < te && ee <= se && se < te && I.isDark(ue, Math.floor((de - ee) / F)) && (Me = 0), Ve += Me ? Te : pe;
            for (ue = 0; ue < F; ue += 1)
              Ue += Ve + `
`;
          }
          return Ue.substring(0, Ue.length - 1);
        }, I.renderTo2dContext = function(F, J) {
          J = J || 2;
          for (var K = I.getModuleCount(), ee = 0; ee < K; ee++)
            for (var te = 0; te < K; te++)
              F.fillStyle = I.isDark(ee, te) ? "black" : "white", F.fillRect(ee * J, te * J, J, J);
        }, I;
      };
      a.stringToBytesFuncs = {
        default: function(N) {
          for (var Q = [], D = 0; D < N.length; D += 1) {
            var O = N.charCodeAt(D);
            Q.push(O & 255);
          }
          return Q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(N, Q) {
        var D = (function() {
          for (var L = T(N), z = function() {
            var oe = L.read();
            if (oe == -1) throw "eof";
            return oe;
          }, x = 0, y = {}; ; ) {
            var $ = L.read();
            if ($ == -1) break;
            var E = z(), I = z(), j = z(), G = String.fromCharCode($ << 8 | E), Z = I << 8 | j;
            y[G] = Z, x += 1;
          }
          if (x != Q)
            throw x + " != " + Q;
          return y;
        })(), O = 63;
        return function(L) {
          for (var z = [], x = 0; x < L.length; x += 1) {
            var y = L.charCodeAt(x);
            if (y < 128)
              z.push(y);
            else {
              var $ = D[L.charAt(x)];
              typeof $ == "number" ? ($ & 255) == $ ? z.push($) : (z.push($ >>> 8), z.push($ & 255)) : z.push(O);
            }
          }
          return z;
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
        var N = [
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
        ], Q = 1335, D = 7973, O = 21522, L = {}, z = function(x) {
          for (var y = 0; x != 0; )
            y += 1, x >>>= 1;
          return y;
        };
        return L.getBCHTypeInfo = function(x) {
          for (var y = x << 10; z(y) - z(Q) >= 0; )
            y ^= Q << z(y) - z(Q);
          return (x << 10 | y) ^ O;
        }, L.getBCHTypeNumber = function(x) {
          for (var y = x << 12; z(y) - z(D) >= 0; )
            y ^= D << z(y) - z(D);
          return x << 12 | y;
        }, L.getPatternPosition = function(x) {
          return N[x - 1];
        }, L.getMaskFunction = function(x) {
          switch (x) {
            case l.PATTERN000:
              return function(y, $) {
                return (y + $) % 2 == 0;
              };
            case l.PATTERN001:
              return function(y, $) {
                return y % 2 == 0;
              };
            case l.PATTERN010:
              return function(y, $) {
                return $ % 3 == 0;
              };
            case l.PATTERN011:
              return function(y, $) {
                return (y + $) % 3 == 0;
              };
            case l.PATTERN100:
              return function(y, $) {
                return (Math.floor(y / 2) + Math.floor($ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(y, $) {
                return y * $ % 2 + y * $ % 3 == 0;
              };
            case l.PATTERN110:
              return function(y, $) {
                return (y * $ % 2 + y * $ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(y, $) {
                return (y * $ % 3 + (y + $) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + x;
          }
        }, L.getErrorCorrectPolynomial = function(x) {
          for (var y = c([1], 0), $ = 0; $ < x; $ += 1)
            y = y.multiply(c([1, u.gexp($)], 0));
          return y;
        }, L.getLengthInBits = function(x, y) {
          if (1 <= y && y < 10)
            switch (x) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + x;
            }
          else if (y < 27)
            switch (x) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + x;
            }
          else if (y < 41)
            switch (x) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + x;
            }
          else
            throw "type:" + y;
        }, L.getLostPoint = function(x) {
          for (var y = x.getModuleCount(), $ = 0, E = 0; E < y; E += 1)
            for (var I = 0; I < y; I += 1) {
              for (var j = 0, G = x.isDark(E, I), Z = -1; Z <= 1; Z += 1)
                if (!(E + Z < 0 || y <= E + Z))
                  for (var oe = -1; oe <= 1; oe += 1)
                    I + oe < 0 || y <= I + oe || Z == 0 && oe == 0 || G == x.isDark(E + Z, I + oe) && (j += 1);
              j > 5 && ($ += 3 + j - 5);
            }
          for (var E = 0; E < y - 1; E += 1)
            for (var I = 0; I < y - 1; I += 1) {
              var ce = 0;
              x.isDark(E, I) && (ce += 1), x.isDark(E + 1, I) && (ce += 1), x.isDark(E, I + 1) && (ce += 1), x.isDark(E + 1, I + 1) && (ce += 1), (ce == 0 || ce == 4) && ($ += 3);
            }
          for (var E = 0; E < y; E += 1)
            for (var I = 0; I < y - 6; I += 1)
              x.isDark(E, I) && !x.isDark(E, I + 1) && x.isDark(E, I + 2) && x.isDark(E, I + 3) && x.isDark(E, I + 4) && !x.isDark(E, I + 5) && x.isDark(E, I + 6) && ($ += 40);
          for (var I = 0; I < y; I += 1)
            for (var E = 0; E < y - 6; E += 1)
              x.isDark(E, I) && !x.isDark(E + 1, I) && x.isDark(E + 2, I) && x.isDark(E + 3, I) && x.isDark(E + 4, I) && !x.isDark(E + 5, I) && x.isDark(E + 6, I) && ($ += 40);
          for (var $e = 0, I = 0; I < y; I += 1)
            for (var E = 0; E < y; E += 1)
              x.isDark(E, I) && ($e += 1);
          var Ae = Math.abs(100 * $e / y / y - 50) / 5;
          return $ += Ae * 10, $;
        }, L;
      })(), u = (function() {
        for (var N = new Array(256), Q = new Array(256), D = 0; D < 8; D += 1)
          N[D] = 1 << D;
        for (var D = 8; D < 256; D += 1)
          N[D] = N[D - 4] ^ N[D - 5] ^ N[D - 6] ^ N[D - 8];
        for (var D = 0; D < 255; D += 1)
          Q[N[D]] = D;
        var O = {};
        return O.glog = function(L) {
          if (L < 1)
            throw "glog(" + L + ")";
          return Q[L];
        }, O.gexp = function(L) {
          for (; L < 0; )
            L += 255;
          for (; L >= 256; )
            L -= 255;
          return N[L];
        }, O;
      })();
      function c(N, Q) {
        if (typeof N.length > "u")
          throw N.length + "/" + Q;
        var D = (function() {
          for (var L = 0; L < N.length && N[L] == 0; )
            L += 1;
          for (var z = new Array(N.length - L + Q), x = 0; x < N.length - L; x += 1)
            z[x] = N[x + L];
          return z;
        })(), O = {};
        return O.getAt = function(L) {
          return D[L];
        }, O.getLength = function() {
          return D.length;
        }, O.multiply = function(L) {
          for (var z = new Array(O.getLength() + L.getLength() - 1), x = 0; x < O.getLength(); x += 1)
            for (var y = 0; y < L.getLength(); y += 1)
              z[x + y] ^= u.gexp(u.glog(O.getAt(x)) + u.glog(L.getAt(y)));
          return c(z, 0);
        }, O.mod = function(L) {
          if (O.getLength() - L.getLength() < 0)
            return O;
          for (var z = u.glog(O.getAt(0)) - u.glog(L.getAt(0)), x = new Array(O.getLength()), y = 0; y < O.getLength(); y += 1)
            x[y] = O.getAt(y);
          for (var y = 0; y < L.getLength(); y += 1)
            x[y] ^= u.gexp(u.glog(L.getAt(y)) + z);
          return c(x, 0).mod(L);
        }, O;
      }
      var f = (function() {
        var N = [
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
        ], Q = function(L, z) {
          var x = {};
          return x.totalCount = L, x.dataCount = z, x;
        }, D = {}, O = function(L, z) {
          switch (z) {
            case o.L:
              return N[(L - 1) * 4 + 0];
            case o.M:
              return N[(L - 1) * 4 + 1];
            case o.Q:
              return N[(L - 1) * 4 + 2];
            case o.H:
              return N[(L - 1) * 4 + 3];
            default:
              return;
          }
        };
        return D.getRSBlocks = function(L, z) {
          var x = O(L, z);
          if (typeof x > "u")
            throw "bad rs block @ typeNumber:" + L + "/errorCorrectionLevel:" + z;
          for (var y = x.length / 3, $ = [], E = 0; E < y; E += 1)
            for (var I = x[E * 3 + 0], j = x[E * 3 + 1], G = x[E * 3 + 2], Z = 0; Z < I; Z += 1)
              $.push(Q(j, G));
          return $;
        }, D;
      })(), m = function() {
        var N = [], Q = 0, D = {};
        return D.getBuffer = function() {
          return N;
        }, D.getAt = function(O) {
          var L = Math.floor(O / 8);
          return (N[L] >>> 7 - O % 8 & 1) == 1;
        }, D.put = function(O, L) {
          for (var z = 0; z < L; z += 1)
            D.putBit((O >>> L - z - 1 & 1) == 1);
        }, D.getLengthInBits = function() {
          return Q;
        }, D.putBit = function(O) {
          var L = Math.floor(Q / 8);
          N.length <= L && N.push(0), O && (N[L] |= 128 >>> Q % 8), Q += 1;
        }, D;
      }, p = function(N) {
        var Q = s.MODE_NUMBER, D = N, O = {};
        O.getMode = function() {
          return Q;
        }, O.getLength = function(x) {
          return D.length;
        }, O.write = function(x) {
          for (var y = D, $ = 0; $ + 2 < y.length; )
            x.put(L(y.substring($, $ + 3)), 10), $ += 3;
          $ < y.length && (y.length - $ == 1 ? x.put(L(y.substring($, $ + 1)), 4) : y.length - $ == 2 && x.put(L(y.substring($, $ + 2)), 7));
        };
        var L = function(x) {
          for (var y = 0, $ = 0; $ < x.length; $ += 1)
            y = y * 10 + z(x.charAt($));
          return y;
        }, z = function(x) {
          if ("0" <= x && x <= "9")
            return x.charCodeAt(0) - 48;
          throw "illegal char :" + x;
        };
        return O;
      }, g = function(N) {
        var Q = s.MODE_ALPHA_NUM, D = N, O = {};
        O.getMode = function() {
          return Q;
        }, O.getLength = function(z) {
          return D.length;
        }, O.write = function(z) {
          for (var x = D, y = 0; y + 1 < x.length; )
            z.put(
              L(x.charAt(y)) * 45 + L(x.charAt(y + 1)),
              11
            ), y += 2;
          y < x.length && z.put(L(x.charAt(y)), 6);
        };
        var L = function(z) {
          if ("0" <= z && z <= "9")
            return z.charCodeAt(0) - 48;
          if ("A" <= z && z <= "Z")
            return z.charCodeAt(0) - 65 + 10;
          switch (z) {
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
              throw "illegal char :" + z;
          }
        };
        return O;
      }, b = function(N) {
        var Q = s.MODE_8BIT_BYTE, D = a.stringToBytes(N), O = {};
        return O.getMode = function() {
          return Q;
        }, O.getLength = function(L) {
          return D.length;
        }, O.write = function(L) {
          for (var z = 0; z < D.length; z += 1)
            L.put(D[z], 8);
        }, O;
      }, w = function(N) {
        var Q = s.MODE_KANJI, D = a.stringToBytesFuncs.SJIS;
        if (!D)
          throw "sjis not supported.";
        (function(z, x) {
          var y = D(z);
          if (y.length != 2 || (y[0] << 8 | y[1]) != x)
            throw "sjis not supported.";
        })("友", 38726);
        var O = D(N), L = {};
        return L.getMode = function() {
          return Q;
        }, L.getLength = function(z) {
          return ~~(O.length / 2);
        }, L.write = function(z) {
          for (var x = O, y = 0; y + 1 < x.length; ) {
            var $ = (255 & x[y]) << 8 | 255 & x[y + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (y + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), z.put($, 13), y += 2;
          }
          if (y < x.length)
            throw "illegal char at " + (y + 1);
        }, L;
      }, M = function() {
        var N = [], Q = {};
        return Q.writeByte = function(D) {
          N.push(D & 255);
        }, Q.writeShort = function(D) {
          Q.writeByte(D), Q.writeByte(D >>> 8);
        }, Q.writeBytes = function(D, O, L) {
          O = O || 0, L = L || D.length;
          for (var z = 0; z < L; z += 1)
            Q.writeByte(D[z + O]);
        }, Q.writeString = function(D) {
          for (var O = 0; O < D.length; O += 1)
            Q.writeByte(D.charCodeAt(O));
        }, Q.toByteArray = function() {
          return N;
        }, Q.toString = function() {
          var D = "";
          D += "[";
          for (var O = 0; O < N.length; O += 1)
            O > 0 && (D += ","), D += N[O];
          return D += "]", D;
        }, Q;
      }, C = function() {
        var N = 0, Q = 0, D = 0, O = "", L = {}, z = function(y) {
          O += String.fromCharCode(x(y & 63));
        }, x = function(y) {
          if (!(y < 0)) {
            if (y < 26)
              return 65 + y;
            if (y < 52)
              return 97 + (y - 26);
            if (y < 62)
              return 48 + (y - 52);
            if (y == 62)
              return 43;
            if (y == 63)
              return 47;
          }
          throw "n:" + y;
        };
        return L.writeByte = function(y) {
          for (N = N << 8 | y & 255, Q += 8, D += 1; Q >= 6; )
            z(N >>> Q - 6), Q -= 6;
        }, L.flush = function() {
          if (Q > 0 && (z(N << 6 - Q), N = 0, Q = 0), D % 3 != 0)
            for (var y = 3 - D % 3, $ = 0; $ < y; $ += 1)
              O += "=";
        }, L.toString = function() {
          return O;
        }, L;
      }, T = function(N) {
        var Q = N, D = 0, O = 0, L = 0, z = {};
        z.read = function() {
          for (; L < 8; ) {
            if (D >= Q.length) {
              if (L == 0)
                return -1;
              throw "unexpected end of file./" + L;
            }
            var y = Q.charAt(D);
            if (D += 1, y == "=")
              return L = 0, -1;
            if (y.match(/^\s$/))
              continue;
            O = O << 6 | x(y.charCodeAt(0)), L += 6;
          }
          var $ = O >>> L - 8 & 255;
          return L -= 8, $;
        };
        var x = function(y) {
          if (65 <= y && y <= 90)
            return y - 65;
          if (97 <= y && y <= 122)
            return y - 97 + 26;
          if (48 <= y && y <= 57)
            return y - 48 + 52;
          if (y == 43)
            return 62;
          if (y == 47)
            return 63;
          throw "c:" + y;
        };
        return z;
      }, U = function(N, Q) {
        var D = N, O = Q, L = new Array(N * Q), z = {};
        z.setPixel = function(E, I, j) {
          L[I * D + E] = j;
        }, z.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(D), E.writeShort(O), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(D), E.writeShort(O), E.writeByte(0);
          var I = 2, j = y(I);
          E.writeByte(I);
          for (var G = 0; j.length - G > 255; )
            E.writeByte(255), E.writeBytes(j, G, 255), G += 255;
          E.writeByte(j.length - G), E.writeBytes(j, G, j.length - G), E.writeByte(0), E.writeString(";");
        };
        var x = function(E) {
          var I = E, j = 0, G = 0, Z = {};
          return Z.write = function(oe, ce) {
            if (oe >>> ce)
              throw "length over";
            for (; j + ce >= 8; )
              I.writeByte(255 & (oe << j | G)), ce -= 8 - j, oe >>>= 8 - j, G = 0, j = 0;
            G = oe << j | G, j = j + ce;
          }, Z.flush = function() {
            j > 0 && I.writeByte(G);
          }, Z;
        }, y = function(E) {
          for (var I = 1 << E, j = (1 << E) + 1, G = E + 1, Z = $(), oe = 0; oe < I; oe += 1)
            Z.add(String.fromCharCode(oe));
          Z.add(String.fromCharCode(I)), Z.add(String.fromCharCode(j));
          var ce = M(), $e = x(ce);
          $e.write(I, G);
          var Ae = 0, He = String.fromCharCode(L[Ae]);
          for (Ae += 1; Ae < L.length; ) {
            var he = String.fromCharCode(L[Ae]);
            Ae += 1, Z.contains(He + he) ? He = He + he : ($e.write(Z.indexOf(He), G), Z.size() < 4095 && (Z.size() == 1 << G && (G += 1), Z.add(He + he)), He = he);
          }
          return $e.write(Z.indexOf(He), G), $e.write(j, G), $e.flush(), ce.toByteArray();
        }, $ = function() {
          var E = {}, I = 0, j = {};
          return j.add = function(G) {
            if (j.contains(G))
              throw "dup key:" + G;
            E[G] = I, I += 1;
          }, j.size = function() {
            return I;
          }, j.indexOf = function(G) {
            return E[G];
          }, j.contains = function(G) {
            return typeof E[G] < "u";
          }, j;
        };
        return z;
      }, W = function(N, Q, D) {
        for (var O = U(N, Q), L = 0; L < Q; L += 1)
          for (var z = 0; z < N; z += 1)
            O.setPixel(z, L, D(z, L));
        var x = M();
        O.write(x);
        for (var y = C(), $ = x.toByteArray(), E = 0; E < $.length; E += 1)
          y.writeByte($[E]);
        return y.flush(), "data:image/gif;base64," + y;
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
  })(bs)), bs.exports;
}
var aM = nM();
const sM = /* @__PURE__ */ tM(aM), oM = ["width", "height", "viewBox"], lM = ["width", "height"], iM = ["d"], rM = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = S(() => {
      const a = sM(0, "M");
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
      }, null, 8, lM),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, iM)
    ], 8, oM));
  }
}, JO = /* @__PURE__ */ H(rM, [["__scopeId", "data-v-489f0852"]]), uM = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, ZO = /* @__PURE__ */ H(uM, [["__scopeId", "data-v-47e67f04"]]), cM = {
  class: "list-reader",
  "data-list-reader": ""
}, dM = { class: "list-reader-body" }, fM = {
  key: 0,
  class: "list-reader-group"
}, mM = ["title", "aria-current", "data-row", "onClick"], hM = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, pM = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ Bt({
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
    const t = e, n = Gt(e, "chosen"), a = S(() => t.items.find((f) => f.id === n.value) ?? null), s = S(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Fm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((g) => g.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return Ce(() => {
      const f = t.items.find((m) => String(m.id) === da.value.row);
      f && (n.value = f.id);
    }), (f, m) => (r(), d("div", cM, [
      ne(f.$slots, "top", {}, void 0, !0),
      h("div", dM, [
        h("div", {
          class: "list-reader-list",
          style: ge({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? k("", !0) : (r(), P(xt, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: q(() => [
              ne(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(R, null, X(s.value, (p) => (r(), d(R, { key: p }, [
            p ? (r(), d("p", fM, v(p), 1)) : k("", !0),
            (r(!0), d(R, null, X(o(p), (g) => (r(), d("button", {
              key: g.id,
              type: "button",
              class: Y(["list-reader-row", { on: g.id === n.value }]),
              title: g.title,
              "aria-current": g.id === n.value,
              "data-reader-row": "",
              "data-row": g.id,
              onClick: (b) => l(g)
            }, [
              A(Bw, {
                title: g.title,
                text: g.desc || ""
              }, Sa({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: q(() => [
                    ne(f.$slots, "meta", { item: g }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, mM))), 128))
          ], 64))), 128))
        ], 36),
        h("div", hM, [
          a.value ? ne(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), P(xt, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : k("", !0)
        ])
      ])
    ]));
  }
}, eT = /* @__PURE__ */ H(pM, [["__scopeId", "data-v-b6052f67"]]), vM = {
  class: "reader",
  "data-reader": ""
}, gM = {
  class: "reader-head",
  "data-reader-head": ""
}, yM = { class: "reader-meta" }, bM = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, kM = { class: "reader-title-line" }, wM = { class: "reader-buttons" }, $M = { class: "reader-body" }, xM = {
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
    const o = S(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = S(() => o.value.find((c) => c.key === s.value) ?? null), i = S(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", vM, [
      h("header", gM, [
        h("div", yM, [
          e.number ? (r(), d("span", bM, v(e.number), 1)) : k("", !0),
          ne(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", kM, [
          A(Eu, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", wM, [
            ne(c.$slots, "primary", {}, void 0, !0),
            ne(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), P(A8, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : k("", !0),
      h("div", $M, [
        e.facts.length ? (r(), P(Ou, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : k("", !0),
        ne(c.$slots, "default", { tab: s.value }, void 0, !0)
      ])
    ]));
  }
}, tT = /* @__PURE__ */ H(xM, [["__scopeId", "data-v-75e4d6a3"]]), SM = {
  class: "reader-section",
  "data-reader-section": ""
}, _M = { class: "reader-section-title" }, MM = { class: "reader-section-name" }, CM = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", SM, [
      h("h4", _M, [
        h("span", MM, v(e.title), 1),
        ne(t.$slots, "end", {}, void 0, !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nT = /* @__PURE__ */ H(CM, [["__scopeId", "data-v-ab40cbe5"]]), AM = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, EM = { class: "reader-timeline-who" }, OM = { class: "reader-timeline-text" }, TM = {
  key: 0,
  class: "reader-timeline-none"
}, IM = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", AM, [
      (r(!0), d(R, null, X(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", EM, v(a.by), 1),
        A(Ze, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", OM, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? k("", !0) : (r(), d("li", TM, "None"))
    ]));
  }
}, aT = /* @__PURE__ */ H(IM, [["__scopeId", "data-v-312caab5"]]), sT = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = _e(Re);
    return (n, a) => (r(), P(Au, {
      model: e.model,
      id: e.id,
      read: B(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, BM = {
  class: "page-card",
  "data-page-card": ""
}, RM = { class: "page-card-head" }, NM = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, LM = { class: "page-card-names" }, qM = ["title"], DM = {
  class: "page-card-state",
  "data-card-state": ""
}, PM = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, jM = ["title"], FM = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, WM = {
  class: "page-card-foot",
  "data-card-foot": ""
}, HM = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", BM, [
      h("header", RM, [
        e.icon ? (r(), d("span", NM, [
          A(ie, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : k("", !0),
        h("span", LM, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, qM),
          h("p", DM, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", PM, [
          ne(t.$slots, "corner", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, jM),
      ne(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", FM, v(e.fault), 1)) : k("", !0),
      h("footer", WM, [
        ne(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, zM = /* @__PURE__ */ H(HM, [["__scopeId", "data-v-89b55585"]]), UM = {
  class: "card-page",
  "data-card-page": ""
}, VM = { class: "card-page-body" }, GM = {
  key: 0,
  class: "card-page-group"
}, KM = { class: "card-page-grid" }, YM = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" }
  },
  setup(e) {
    const t = e, n = _(pa(t.fields)), a = _(""), s = S(() => Er(t.items, t.fields, n.value, a.value, ["title", "line"])), o = S(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = pa(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", UM, [
      A(Yw, {
        title: e.title,
        count: e.items.length
      }, {
        primary: q(() => [
          ne(u.$slots, "primary", {}, void 0, !0)
        ]),
        actions: q(() => [
          ne(u.$slots, "actions", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["title", "count"]),
      A(Ir, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", VM, [
        s.value.length ? k("", !0) : (r(), P(xt, {
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
                V("Clear", -1)
              ])]),
              _: 1
            })) : ne(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(R, null, X(o.value, (f) => (r(), d(R, { key: f }, [
          f ? (r(), d("p", GM, v(f), 1)) : k("", !0),
          h("div", KM, [
            (r(!0), d(R, null, X(l(f), (m) => (r(), P(zM, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, Sa({
              default: q(() => [
                ne(u.$slots, "card", { item: m }, void 0, !0)
              ]),
              _: 2
            }, [
              u.$slots.corner ? {
                name: "corner",
                fn: q(() => [
                  ne(u.$slots, "corner", { item: m }, void 0, !0)
                ]),
                key: "0"
              } : void 0,
              u.$slots.foot ? {
                name: "foot",
                fn: q(() => [
                  ne(u.$slots, "foot", { item: m }, void 0, !0)
                ]),
                key: "1"
              } : void 0,
              u.$slots["card-actions"] ? {
                name: "actions",
                fn: q(() => [
                  ne(u.$slots, "card-actions", { item: m }, void 0, !0)
                ]),
                key: "2"
              } : void 0
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"]))), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, oT = /* @__PURE__ */ H(YM, [["__scopeId", "data-v-7a1a1305"]]), QM = {
  class: "table-layout",
  "data-table-layout": ""
}, XM = { class: "table-layout-body" }, JM = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" }
  },
  setup(e) {
    const t = e, n = _(pa(t.fields)), a = _(""), s = S(() => Er(t.rows, t.fields, n.value, a.value, t.columns.map((i) => i.key))), o = S(() => t.columns.map((i) => i.label)), l = S(() => s.value.map((i) => ({ cells: t.columns.map((u) => i[u.key] ?? ""), open: i.ref ?? "", tone: i.tone ?? "" })));
    return (i, u) => (r(), d("div", QM, [
      A(Ir, {
        modelValue: n.value,
        "onUpdate:modelValue": u[0] || (u[0] = (c) => n.value = c),
        words: a.value,
        "onUpdate:words": u[1] || (u[1] = (c) => a.value = c),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", XM, [
        A(hr, {
          columns: o.value,
          rows: l.value,
          empty: e.empty,
          onOpen: B(je)
        }, null, 8, ["columns", "rows", "empty", "onOpen"])
      ])
    ]));
  }
}, lT = /* @__PURE__ */ H(JM, [["__scopeId", "data-v-32f1bba5"]]), ZM = ["id", "onUpdate:modelValue", "data-field"], eC = ["value"], tC = ["data-refused"], nC = {
  class: "create-command",
  "data-command-preview": ""
}, aC = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, sC = { class: "create-actions" }, oC = {
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
    const n = e, a = t, s = (g) => g.value ?? (g.kind === "select" ? g.options[0][0] : ""), o = _(Object.fromEntries(n.fields.map((g) => [g.key, s(g)]))), l = _({}), i = _(""), u = _(!1), c = S(() => n.fields.filter((g) => !g.when || g.when(o.value))), f = S(() => c.value.every((g) => !g.required || String(o.value[g.key]).trim())), m = S(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const g = await n.run(o.value);
      u.value = !1, i.value = g.ok ? "" : g.error, g.ok && (a("done", o.value), a("close"));
    }
    return (g, b) => (r(), P(En, {
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
          onSubmit: be(p, ["prevent"])
        }, [
          (r(!0), d(R, null, X(c.value, (w) => (r(), P(Ci, {
            key: w.key,
            label: w.label,
            help: w.help,
            for: `create-${w.key}`
          }, {
            default: q(() => [
              w.kind === "select" ? we((r(), d("select", {
                key: 0,
                id: `create-${w.key}`,
                "onUpdate:modelValue": (M) => o.value[w.key] = M,
                "data-field": w.key
              }, [
                (r(!0), d(R, null, X(w.options, ([M, C]) => (r(), d("option", {
                  key: M,
                  value: M
                }, v(C), 9, eC))), 128))
              ], 8, ZM)), [
                [Rt, o.value[w.key]]
              ]) : w.kind === "area" ? (r(), P(Ai, {
                key: 1,
                id: `create-${w.key}`,
                value: o.value[w.key],
                placeholder: w.placeholder,
                "data-field": w.key,
                onInput: (M) => o.value[w.key] = M.target.value
              }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])) : (r(), P(Hw, {
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
              }, v(l.value[w.key]), 9, tC)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", nC, v(m.value), 1),
          i.value ? (r(), d("p", aC, v(i.value), 1)) : k("", !0),
          h("div", sC, [
            A(ve, {
              small: "",
              onClick: b[0] || (b[0] = (w) => a("close"))
            }, {
              default: q(() => [...b[2] || (b[2] = [
                V("Cancel", -1)
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
                V(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, iT = /* @__PURE__ */ H(oC, [["__scopeId", "data-v-726cedd8"]]), lC = Symbol.for("journal.toast");
function rT() {
  const e = _e(lC, null);
  if (!e) throw new Error("useToast is called only inside a page that shows toasts");
  return e.raise;
}
const iC = ["aria-selected", "data-tab", "onPointerdown", "onAuxclick", "onKeydown"], rC = { class: "pane-tab-label" }, uC = ["aria-label", "onClick"], cC = 1, dC = {
  __name: "EditorTabs",
  props: { tabs: { type: Array, required: !0 }, insertAt: { type: Number, default: -1 }, extra: { type: Function, default: () => [] } },
  emits: ["pick", "close", "grab"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(!1);
    let l = null;
    async function i() {
      o.value = !1, await qe(), s.value && (o.value = s.value.scrollWidth > s.value.clientWidth);
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
    return me(() => n.tabs.map((f) => `${f.title}:${f.count ?? ""}`).join("|"), i), Ce(() => {
      i(), !(typeof ResizeObserver > "u") && (l = new ResizeObserver(i), l.observe(s.value));
    }), et(() => l == null ? void 0 : l.disconnect()), (f, m) => (r(), d("div", {
      class: Y(["pane-tabs", { compact: o.value }])
    }, [
      h("div", {
        ref_key: "row",
        ref: s,
        class: "pane-tabs-row",
        role: "tablist"
      }, [
        (r(!0), d(R, null, X(e.tabs, (p, g) => we((r(), d("div", {
          key: p.key,
          role: "tab",
          tabindex: "0",
          "aria-selected": p.on,
          class: Y([
            "pane-tab",
            {
              on: p.on,
              lifting: p.lifting,
              gone: p.gone,
              "insert-before": e.insertAt === g,
              "insert-after": e.insertAt === e.tabs.length && g === e.tabs.length - 1
            }
          ]),
          "data-tab": p.key,
          onPointerdown: (b) => a("grab", b, p.key),
          onMousedown: m[1] || (m[1] = be(() => {
          }, ["middle", "prevent"])),
          onAuxclick: (b) => b.button === cC && (a("close", p.key), b.preventDefault()),
          onKeydown: [
            ot(be((b) => a("pick", p.key), ["prevent"]), ["enter"]),
            ot(be((b) => a("pick", p.key), ["prevent"]), ["space"]),
            ot(be((b) => a("close", p.key), ["prevent"]), ["delete"])
          ]
        }, [
          A(St, {
            name: p.icon
          }, null, 8, ["name"]),
          h("span", rC, v(p.title), 1),
          p.count !== void 0 ? (r(), d("span", {
            key: 0,
            class: Y(["pane-tab-n", { hot: p.hot }])
          }, v(p.count), 3)) : k("", !0),
          h("button", {
            type: "button",
            class: "pane-tab-x",
            tabindex: "-1",
            "aria-label": `Close ${p.title}`,
            onPointerdown: m[0] || (m[0] = be(() => {
            }, ["stop"])),
            onClick: be((b) => a("close", p.key), ["stop"])
          }, [
            A(ie, {
              name: "x",
              size: 10
            })
          ], 40, uC)
        ], 42, iC)), [
          [B(Qt), () => c(p, g)]
        ])), 128))
      ], 512),
      ne(f.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, uT = /* @__PURE__ */ H(dC, [["__scopeId", "data-v-6b328f63"]]), cT = Fu(() => import("./VoiceFigure-DHAwqaTx.js").then((e) => e.V)), dT = "1.2.0", fT = "3.5";
export {
  Nm as $,
  Ie as A,
  Le as B,
  Ta as C,
  ht as D,
  oO as E,
  $x as F,
  YA as G,
  tO as H,
  nx as I,
  Ex as J,
  Pt as K,
  pC as L,
  Ao as M,
  Nx as N,
  Ax as O,
  Oa as P,
  wE as Q,
  AA as R,
  oa as S,
  ME as T,
  kA as U,
  Be as V,
  ga as W,
  bA as X,
  yA as Y,
  Rm as Z,
  H as _,
  cA as a,
  HE as a$,
  Bx as a0,
  EA as a1,
  OA as a2,
  Re as a3,
  FA as a4,
  jA as a5,
  Lt as a6,
  TA as a7,
  ZA as a8,
  ZC as a9,
  NE as aA,
  yE as aB,
  U4 as aC,
  aE as aD,
  sE as aE,
  lO as aF,
  iu as aG,
  _E as aH,
  Nn as aI,
  oA as aJ,
  nA as aK,
  YE as aL,
  Ln as aM,
  ZE as aN,
  KA as aO,
  bE as aP,
  kE as aQ,
  gE as aR,
  xn as aS,
  It as aT,
  eA as aU,
  N5 as aV,
  pE as aW,
  MA as aX,
  ou as aY,
  Xt as aZ,
  sn as a_,
  zE as aa,
  XE as ab,
  rA as ac,
  wA as ad,
  $A as ae,
  DA as af,
  PA as ag,
  WA as ah,
  hA as ai,
  Fl as aj,
  IA as ak,
  JA as al,
  cO as am,
  dE as an,
  uE as ao,
  rE as ap,
  HA as aq,
  LA as ar,
  NA as as,
  qA as at,
  SE as au,
  XA as av,
  eE as aw,
  mO as ax,
  fn as ay,
  tE as az,
  Vx as b,
  fO as b$,
  yx as b0,
  JE as b1,
  EE as b2,
  AE as b3,
  o4 as b4,
  Vr as b5,
  jE as b6,
  QA as b7,
  Ra as b8,
  yt as b9,
  TE as bA,
  qE as bB,
  $t as bC,
  CE as bD,
  DE as bE,
  nE as bF,
  fE as bG,
  oE as bH,
  Pe as bI,
  GA as bJ,
  PE as bK,
  wO as bL,
  $O as bM,
  XC as bN,
  D5 as bO,
  UA as bP,
  IE as bQ,
  dA as bR,
  uO as bS,
  OE as bT,
  BE as bU,
  RE as bV,
  zA as bW,
  V4 as bX,
  VA as bY,
  iE as bZ,
  rO as b_,
  LE as ba,
  ls as bb,
  Yi as bc,
  pO as bd,
  yO as be,
  xE as bf,
  KE as bg,
  JC as bh,
  cE as bi,
  vO as bj,
  BA as bk,
  RA as bl,
  vA as bm,
  CA as bn,
  sA as bo,
  VE as bp,
  fA as bq,
  mA as br,
  gA as bs,
  hE as bt,
  O5 as bu,
  eO as bv,
  Cx as bw,
  pA as bx,
  lA as by,
  mE as bz,
  s4 as c,
  ze as c$,
  aA as c0,
  tA as c1,
  lE as c2,
  bO as c3,
  Bo as c4,
  kO as c5,
  $u as c6,
  GE as c7,
  SA as c8,
  xA as c9,
  to as cA,
  uT as cB,
  xt as cC,
  tS as cD,
  wo as cE,
  xO as cF,
  Ir as cG,
  l2 as cH,
  mC as cI,
  an as cJ,
  Ci as cK,
  YO as cL,
  Zp as cM,
  pi as cN,
  ie as cO,
  Mi as cP,
  A8 as cQ,
  _C as cR,
  dT as cS,
  fT as cT,
  eT as cU,
  Bw as cV,
  PO as cW,
  Ls as cX,
  VC as cY,
  O$ as cZ,
  ut as c_,
  R5 as ca,
  iA as cb,
  _x as cc,
  vE as cd,
  _o as ce,
  j4 as cf,
  $E as cg,
  mn as ch,
  Vt as ci,
  Ut as cj,
  OC as ck,
  BC as cl,
  yn as cm,
  LO as cn,
  ve as co,
  gm as cp,
  co as cq,
  oT as cr,
  Ma as cs,
  iT as ct,
  a0 as cu,
  En as cv,
  GO as cw,
  QC as cx,
  IC as cy,
  l0 as cz,
  Je as d,
  zO as d$,
  wt as d0,
  tn as d1,
  RC as d2,
  PC as d3,
  $C as d4,
  ld as d5,
  c$ as d6,
  ha as d7,
  zM as d8,
  Yw as d9,
  zC as dA,
  wC as dB,
  en as dC,
  DO as dD,
  lT as dE,
  qO as dF,
  b_ as dG,
  QO as dH,
  XO as dI,
  Ea as dJ,
  Ai as dK,
  Hw as dL,
  Ze as dM,
  cT as dN,
  ZO as dO,
  yo as dP,
  EO as dQ,
  Qs as dR,
  a1 as dS,
  vo as dT,
  MC as dU,
  Cf as dV,
  sr as dW,
  Kt as dX,
  In as dY,
  cf as dZ,
  Er as d_,
  VO as da,
  CC as db,
  AC as dc,
  EC as dd,
  LC as de,
  KO as df,
  JO as dg,
  fr as dh,
  tT as di,
  sT as dj,
  nT as dk,
  aT as dl,
  Nd as dm,
  RO as dn,
  Sb as dp,
  kC as dq,
  KC as dr,
  Tr as ds,
  Nt as dt,
  jC as du,
  tt as dv,
  _t as dw,
  py as dx,
  Hd as dy,
  Dp as dz,
  _A as e,
  IO as e$,
  HO as e0,
  no as e1,
  uf as e2,
  Zs as e3,
  Yt as e4,
  ul as e5,
  pa as e6,
  TC as e7,
  UO as e8,
  YC as e9,
  CO as eA,
  ai as eB,
  qC as eC,
  d1 as eD,
  kn as eE,
  bC as eF,
  c1 as eG,
  Ua as eH,
  gC as eI,
  vn as eJ,
  so as eK,
  ff as eL,
  SC as eM,
  kt as eN,
  FC as eO,
  r8 as eP,
  hC as eQ,
  vC as eR,
  NO as eS,
  ir as eT,
  jO as eU,
  Nr as eV,
  gi as eW,
  W8 as eX,
  Xs as eY,
  TO as eZ,
  ws as e_,
  WC as ea,
  mi as eb,
  Yc as ec,
  Qc as ed,
  U2 as ee,
  GC as ef,
  UC as eg,
  MO as eh,
  rp as ei,
  SO as ej,
  yC as ek,
  FO as el,
  x$ as em,
  Mr as en,
  Sr as eo,
  xC as ep,
  HC as eq,
  DC as er,
  AO as es,
  OO as et,
  je as eu,
  o1 as ev,
  NC as ew,
  rd as ex,
  _O as ey,
  Rr as ez,
  E5 as f,
  rT as f0,
  BO as f1,
  lt as f2,
  Qt as f3,
  WO as f4,
  df as f5,
  hO as g,
  Sn as h,
  nO as i,
  gO as j,
  aO as k,
  UE as l,
  Xx as m,
  Eo as n,
  QE as o,
  uA as p,
  sO as q,
  ku as r,
  wu as s,
  Oe as t,
  i4 as u,
  FE as v,
  dO as w,
  WE as x,
  Dn as y,
  iO as z
};
