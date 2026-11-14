import { openBlock as r, createElementBlock as d, normalizeStyle as ye, unref as B, renderSlot as ne, createElementVNode as h, normalizeClass as Y, Fragment as L, renderList as Q, defineComponent as Bu, Comment as Ru, h as $a, cloneVNode as Lu, createBlock as D, withCtx as N, createVNode as E, toDisplayString as v, createCommentVNode as k, ref as M, inject as _e, watch as he, onMounted as Me, onBeforeUnmount as tt, reactive as Zt, shallowRef as ot, onUnmounted as Re, useAttrs as xa, computed as S, resolveDynamicComponent as Je, mergeProps as De, useId as Vs, resolveDirective as Nu, withDirectives as ke, createTextVNode as V, Teleport as Cn, nextTick as Ne, Transition as en, withModifiers as ge, createApp as qu, shallowReactive as Du, withKeys as Ue, createSlots as Sa, onScopeDispose as _a, useModel as Yt, mergeModels as Bt, toRef as Na, vModelText as Ye, resolveComponent as ti, provide as Gs, onErrorCaptured as Pu, TransitionGroup as Ks, isRef as Do, getCurrentInstance as ju, useSlots as Fu, vShow as Ys, getCurrentScope as ni, normalizeProps as ks, guardReactiveProps as ai, vModelSelect as Rt, defineAsyncComponent as Wu } from "vue";
function si(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Hu = 1600, zu = {
  __name: "Shimmer",
  setup(e) {
    const t = si(Hu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ye(B(t))
    }, null, 4));
  }
}, cn = /* @__PURE__ */ z(zu, [["__scopeId", "data-v-6c018b03"]]), Uu = { class: "skeleton-line" }, Vu = 2e3, Gu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = si(Vu);
    return (n, a) => (r(), d("span", Uu, [
      ne(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(L, null, Q(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ye({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, _t = /* @__PURE__ */ z(Gu, [["__scopeId", "data-v-484fe8a0"]]), tn = Bu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Ru);
      return a.length !== 1 ? $a(L, { key: n }, a) : a[0].key == null ? Lu(a[0], { key: n }) : a[0];
    };
  }
}), Ku = ["aria-label"], Yu = ["aria-label"], Xu = ["aria-label"], Qu = ["aria-label"], Ju = ["aria-label"], Zu = ["aria-label"], ec = ["aria-label"], tc = {
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
    return (u, c) => (r(), D(tn, { value: e.shape }, {
      messages: N(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(L, null, Q(t, (f) => E(cn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Ku)
      ]),
      older: N(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, Q(t.slice(0, 3), (f) => (r(), D(cn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Yu)
      ]),
      cards: N(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, Q(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(L, null, Q(n, (m) => E(_t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Xu)
      ]),
      file: N(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, Q(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            E(_t, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(L, null, Q(s, (m) => E(_t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Qu)
      ]),
      page: N(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          E(_t, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(L, null, Q(e.count, (f) => (r(), D(_t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ju)
      ]),
      text: N(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, Q(e.count, (f) => (r(), D(_t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Zu)
      ]),
      default: N(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, Q(e.count, (f) => (r(), D(_t, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ec)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, nt = /* @__PURE__ */ z(tc, [["__scopeId", "data-v-ef519c5f"]]), nc = {
  key: 1,
  class: "empty-state titled"
}, ac = { class: "empty-state-title" }, sc = { class: "empty-state-text" }, oc = {
  key: 2,
  class: "empty-state"
}, lc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), D(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", nc, [
      h("p", ac, v(e.title), 1),
      h("p", sc, [
        ne(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", oc, [
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, xt = /* @__PURE__ */ z(lc, [["__scopeId", "data-v-b27e89b0"]]), ic = { class: "fold-group" }, rc = ["aria-expanded"], uc = { class: "fold-label" }, cc = {
  key: 0,
  class: "fold-count"
}, dc = {
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
    return (a, s) => (r(), d("div", ic, [
      h("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", uc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", cc, v(e.count), 1)) : k("", !0),
        h("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, rc),
      e.open ? ne(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, JC = /* @__PURE__ */ z(dc, [["__scopeId", "data-v-9ef1865c"]]), fc = 150, mc = () => fc;
function Xs(e, t, n = mc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function oi(e, t, n) {
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
const hc = 50, Po = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function ZC(e) {
  const t = it().sources.find((n) => n.key === e);
  return t ? ws(t.read, t.events) : ws("", []);
}
function li(e, t, n, a, s = () => !1) {
  const o = M([]), l = M(null), i = M(""), u = M(!1), c = performance.now(), f = M(!1), m = M(""), p = M(null), g = /* @__PURE__ */ new Set();
  let b = null;
  function w(y) {
    return s() ? (g.add(y), b ?? (b = new Promise(($) => setTimeout(() => $(C()), hc)))) : A(y);
  }
  async function C() {
    const y = new Set(g);
    g.clear(), b = null;
    const $ = F, O = await t({ ids: [...y].join(","), limit: y.size });
    if ($ !== F) return;
    if (!O.ok) return I();
    const R = new Map(O.value.rows.map((W) => [W.id, W]));
    o.value = o.value.flatMap((W) => y.has(W.id) ? R.has(W.id) ? [R.get(W.id)] : [] : [W]);
  }
  async function A(y) {
    const $ = F, O = await t({ "before-id": y + 1, limit: 1 });
    if ($ !== F) return;
    if (!O.ok) return I();
    const R = O.value.rows.find((W) => W.id === y);
    o.value = R ? o.value.map((W) => W.id === y ? R : W) : o.value.filter((W) => W.id !== y);
  }
  async function _(y) {
    if (a() && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Z) => Z.id !== y.row_id));
    if (a() && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && o.value.some((Z) => Z.id === y.row_id)) return w(y.row_id);
    if (!(a() && o.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return I();
    const O = Math.max(...o.value.map((Z) => Z.id)), R = F, W = await t({ "after-id": O });
    if (R !== F) return;
    if (!W.ok) return I();
    const K = new Set(o.value.map((Z) => Z.id));
    o.value = [...W.value.rows.filter((Z) => !K.has(Z.id)), ...o.value];
  }
  async function j() {
    if (!f.value || !o.value.length) return !1;
    const y = F, $ = Math.min(...o.value.map((W) => W.id)), O = await t({ "before-id": $ });
    if (y !== F) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Po(O.value, n());
    const R = new Set(o.value.map((W) => W.id));
    return o.value = [...o.value, ...O.value.rows.filter((W) => !R.has(W.id))], !0;
  }
  let F = 0;
  function T(y, $) {
    var W, K;
    const O = y.ok ? e.shared ? [y.value] : ((W = y.value) == null ? void 0 : W.rows) ?? [] : [];
    y.ok && (o.value = $(O)), l.value = y.ok ? y.value : null;
    const R = O.length ? Math.min(...O.map((Z) => Z.id)) : 0;
    y.ok && ((K = y.value) != null && K.rows) && !o.value.some((Z) => Z.id < R) && (f.value = !e.shared && Po(y.value, n())), i.value = y.ok ? "" : y.error, Xs(c, () => u.value = !0);
  }
  async function G(y) {
    const $ = ++F, O = await t({});
    $ === F && T(O, y);
  }
  const P = (y) => {
    if (!a() || !y.length) return y;
    const $ = Math.min(...y.map((R) => R.id)), O = Math.max(...y.map((R) => R.id));
    return [...o.value.filter((R) => R.id > O), ...y, ...o.value.filter((R) => R.id < $)];
  }, I = () => G(P), q = (y) => T(y, P), U = () => G((y) => y);
  async function x(y, $ = null) {
    const O = await oi($ && { target: o, fields: { value: $(o.value) } }, y, e.run);
    return m.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await I(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: I, loadLatest: U, older: j, act: x, actionFailure: m, answer: p, context: e, heard: _, showFirst: q, pageSize: n };
}
const pc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ws(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = it(), l = li(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${pc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const vc = 2e3;
function Qs(e, t, n = vc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = _e(Le, null), u = () => {
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
  he(() => {
    var w;
    return (w = i == null ? void 0 : i.visible) == null ? void 0 : w.value;
  }, b), Me(async () => {
    document.addEventListener("visibilitychange", b), u() || await g();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const ii = typeof document < "u" && document.documentElement.classList.contains("phone"), ri = 120;
var Zl;
const qa = globalThis[Zl = Symbol.for("journal.pressed")] ?? (globalThis[Zl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function gc(e = 0) {
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
function ui(e = window) {
  if (!$s(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    $s(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const xs = "journal.stale-build-reload", yc = 'script[type="module"][src*="/assets/index-"]', jo = (e) => {
  var t;
  return ((t = e.querySelector(yc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function bc(e = document, t = (a, s) => Oe.quietRead(a, s), n = () => ui(window)) {
  const a = jo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = jo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Da = "";
function kc(e, t = () => ui(window)) {
  if (!e) return !1;
  const n = !!Da && Da !== e;
  return Da = e, n && t(), n;
}
const wc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function $c(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(xs) === e.message) return !1;
    t.setItem(xs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function xc(e = window.sessionStorage) {
  try {
    e.removeItem(xs);
  } catch {
    return;
  }
}
const Sc = 2e3, _c = 3e4, Qe = Zt({ starting: !1, external: !1, late: !1, offline: !1 }), Js = () => Qe.starting, Mc = 3;
let jn = 0, Ss = 0, ci = 0, di = [];
async function Cc() {
  try {
    const e = await Oe.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Qe.external };
  }
}
let Fo = null;
const Ec = () => Fo ?? (Fo = Cc().finally(() => Fo = null));
function Ac() {
  clearTimeout(Ss), clearTimeout(ci), Ss = 0, Object.assign(Qe, { starting: !1, external: !1, late: !1, offline: !1 }), di.splice(0).forEach((e) => e()), bc();
}
async function Oc() {
  Qe.offline = !navigator.onLine;
  const e = await Ec();
  if (Qe.external = e.updating, jn = !e.restarting && !e.updating && e.reachable ? jn + 1 : 0, jn < Mc) return;
  jn = 0, (!kc(e.started_at) || $s()) && Ac();
}
function fi() {
  Ss = setTimeout(async () => {
    await Oc(), Qe.starting && fi();
  }, Sc);
}
function Wo() {
  Qe.starting || (Qe.starting = !0, Qe.offline = !navigator.onLine, fi(), ci = setTimeout(() => Qe.late = !0, _c));
}
const mi = () => Qe.starting ? new Promise((e) => di.push(e)) : Promise.resolve();
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
function Tc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Ic {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Tc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
function Bc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Fn = 2e4, Rc = 4, Ho = "/api/read-lines", Lc = 5e3, Nc = 403, zo = "/api/repeated-lines", qc = 10, Dc = 2e3, Pc = 3e5, eE = 6e5, jc = "X-Journal-Window-Hidden", Wn = 6, Fc = 500, Wc = "/journal/summary", Uo = "/api/server-state", Hc = 2e4, Hn = ii ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, zc = (e) => e.split("?")[0].endsWith(Wc), _s = (e, t) => Object.assign(new Error(t), { status: e });
async function Uc(e, t, n = _s) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Vc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Gc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Vo = (e) => e.split(" ").slice(0, 2).join(" "), ut = "read", Ht = "write", Kc = "stream";
class Yc {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Vo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < Dc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < qc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(zo, { method: "POST", headers: { ...Hn, "Content-Type": "application/json" }, body: i }, [{ window: pt, line: zo, kind: Ht }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = gc(n ? ri : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [jc]: Bc() ? "1" : "0" } }, i = s ? { ...l, signal: Gc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Ht ? { ...i, priority: "high" } : i);
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
          throw l instanceof TypeError && Wo(), l;
        }
      throw Wo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Rc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Ho, { headers: Hn }, [{ window: pt, line: Ho, kind: ut }], Lc).then(async (t) => {
      if (t.status === Nc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw _s(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Ic(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Vo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Hn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: Vc(a) }, c = s || (i ? Pc : Fn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: pt, line: n, kind: ut }], c)) : await this.sent(n, u, [{ window: pt, line: n, kind: Ht }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Fc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Wn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Uc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: pt, line: t, kind: ut }], Fn)), !0);
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
    return t !== "GET" ? this.send(t, n, a, s, Wn, o).then((i) => (this.written(n), i)) : Js() && !zc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: pt, line: t, kind: Kc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Uo, { cache: "no-store" }, [{ window: pt, line: Uo, kind: ut }], Hc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = pt, line: s = t, limit: o = Fn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ut : Ht;
    return l === Ht ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Pa = Symbol.for("journal.transport"), Oe = globalThis[Pa] ?? (globalThis[Pa] = new Yc());
class hi {
  constructor() {
    this.following = ot([]), this.held = /* @__PURE__ */ new Set();
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
const pi = (e, t) => !e.row_id || t.has(e.row_id), Xc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Qc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Jc = 50, Zc = "refresh", ed = 1e3, td = 3e4, nd = "requested", ad = "after_window", sd = 50, zn = ".*", od = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function ld(e) {
  const t = {}, n = Zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (x) => u[x] ?? u[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {};
  function g(x) {
    const y = () => p(x), $ = M(void 0), O = li(e, async (R) => {
      const W = await C(x, R);
      return W.ok && !Object.keys(R).length && ($.value = W.value), W;
    }, () => y().page_size || sd, () => !!y().page_size, () => !!y().reads_ids);
    return t[x] = { ...O, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (x, y) => typeof y != "string" || y.startsWith("__v") ? void 0 : t[y] ?? g(y) }), w = (x) => (u[x].loading !== nd || x.endsWith(zn)) && (!u[x].tab || u[x].tab === n.tab);
  function C(x, y = {}) {
    return new Promise(($) => {
      a.push({ name: x, flags: y, resolve: $ }), a.length === 1 && setTimeout(A);
    });
  }
  async function A() {
    const x = /* @__PURE__ */ new Map(), y = a.splice(0).filter((R) => {
      const W = JSON.stringify(R.flags);
      return x.has(R.name) || x.set(R.name, W), x.get(R.name) === W ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(A);
    const $ = Object.fromEntries(y.flatMap(({ name: R, flags: W }) => Object.entries(W).map(([K, Z]) => [`${R}.${K}`, Z]))), O = await e.readKeys({ only: [...new Set(y.map(({ name: R }) => R))], state: { ...n, ...$ } });
    y.forEach(({ name: R, resolve: W }) => W(O.ok ? O.value.keys[R] : O));
  }
  async function _(x) {
    var R;
    const y = ++f;
    (x.length ? x : Object.keys(u).filter((W) => !W.endsWith(zn) && u[W].loading === "first" && w(W))).forEach((W) => l[W] = y);
    const O = await e.readKeys({ only: x, state: { ...n } });
    if (!O.ok) {
      if (O.failure === "cancelled") return !1;
      const W = (x.length ? x : Object.keys(t)).filter((Z) => (l[Z] ?? 0) <= y);
      W.forEach((Z) => {
        b[Z].readAt = Date.now(), O.failure === "unreachable" ? i.add(Z) : i.delete(Z), b[Z].showFirst(O);
      });
      const K = O.failure === "unreachable" && ((R = e.waitForServer) == null ? void 0 : R.call(e));
      return K && K.then(() => {
        if (m) return;
        const Z = W.filter((le) => l[le] === y);
        (Z.length || !x.length && !W.length && f === y) && _(Z);
      }), !1;
    }
    return q(O.value.declared), Object.entries(O.value.keys).forEach(([W, K]) => {
      (l[W] ?? 0) > y || (l[W] = y, b[W].readAt = Date.now(), i.delete(W), K.ok && (b[W].data.value = K.value), b[W].showFirst(K));
    }), !0;
  }
  function j(x) {
    const y = od(x);
    return y.length ? (y.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, $(_(O));
    })))) : _([]);
  }
  function F(x) {
    x.forEach((y) => s.add(y)), clearTimeout(c), c = setTimeout(() => {
      const y = [...s];
      s.clear(), y.length && j(y);
    }, Jc);
  }
  const T = (x) => x.endsWith(zn) ? Object.keys(t).filter((y) => y.startsWith(x.slice(0, -1)) && t[y].readAt) : [x], G = (x, y) => {
    const $ = p(x).event_column;
    return !$ || Qc(y, $, /* @__PURE__ */ new Set([Number(x.slice(x.lastIndexOf(".") + 1))]));
  }, P = (x) => (u[x] ?? u[`${x.split(".")[0]}.*`]).reload_seconds;
  function I(x) {
    const y = Object.keys(u).filter((O) => x.event === Zc || u[O].events.some((R) => eo(R, x.event)));
    y.filter((O) => u[O].page_size).forEach((O) => b[O].heard(x));
    const $ = y.filter((O) => !u[O].page_size);
    $.filter((O) => !w(O)).forEach((O) => b[O].readAt = 0), F($.filter(w).flatMap(T).filter((O) => G(O, x)));
  }
  function q(x) {
    if (Object.keys(u).length) return;
    u = x;
    const y = [...new Set(Object.values(x).flatMap((O) => O.events))];
    y.length && e.follow(y, I);
    const $ = Object.keys(x).filter((O) => x[O].loading === ad);
    $.length && _($);
  }
  he(() => n.tab, () => {
    const x = Object.keys(u).filter((y) => !y.endsWith(zn) && w(y) && !b[y].readAt);
    x.length && _(x);
  }), Re(() => {
    m = !0, clearTimeout(c);
  });
  function U() {
    const x = Date.now(), y = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && w($)).flatMap(T).filter(($) => x - b[$].readAt >= (i.has($) ? Math.min(P($) * 1e3, td) : P($) * 1e3));
    y.length && F(y);
  }
  return Qs(U, () => e.visible.value, ed), queueMicrotask(() => _([])), { props: b, state: n, reload: j, readKey: C };
}
const id = Symbol("open-view"), Le = Symbol.for("journal.window-context"), vi = Symbol("dock-card"), gi = Symbol.for("journal.inspector-actions");
function rd(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = ld(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function it() {
  const e = _e(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return rd(e);
}
const ud = (e, t) => e(vi, t), tE = () => _e(vi), Ms = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Go = {
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
}, cd = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
    }, null, 12, cd));
  }
}, dd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, fd = /* @__PURE__ */ z(dd, [["__scopeId", "data-v-eb453d6f"]]), md = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = xa(), a = S(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = M(!1), o = S(() => t.busy || s.value), l = _e(Le, null), i = S(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, ri);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), D(Je(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : B(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: N(() => [
        h("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), D(oe, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          ne(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), D(fd, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), me = /* @__PURE__ */ z(md, [["__scopeId", "data-v-ededdadf"]]), hd = ["aria-checked", "aria-haspopup", "onClick"], pd = {
  key: 0,
  class: "segmented-dot"
}, vd = {
  key: 1,
  class: "segmented-note"
}, gd = {
  key: 2,
  class: "segmented-count"
}, yd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Vs();
    return (s, o) => {
      const l = Nu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(L, null, Q(e.options, (i) => ke((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", pd)) : k("", !0),
          V(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", vd, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", gd, v(i.count), 1)) : k("", !0)
        ], 10, hd)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Lt = /* @__PURE__ */ z(yd, [["__scopeId", "data-v-c89bc92d"]]), bd = {
  key: 0,
  class: "more-items"
}, kd = {
  key: 0,
  role: "alert"
}, wd = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", bd, [
      e.failure ? (r(), d("p", kd, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), D(me, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: N(() => [
          V(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, En = /* @__PURE__ */ z(wd, [["__scopeId", "data-v-10464014"]]), $d = { class: "link-group" }, xd = {
  class: "group-label",
  "data-link-kind": ""
}, Sd = ["disabled", "onClick"], _d = { class: "title" }, Md = { class: "relations" }, Cd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = S(() => s.value ? n.rows : n.rows.slice(0, 3)), l = S(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", $d, [
      h("div", xd, v(l.value), 1),
      (r(!0), d(L, null, Q(o.value, (p) => (r(), d("button", De({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (g) => a("open", p)
      }), [
        h("span", _d, v(p.endpoint.title), 1),
        h("span", Md, [
          V(v(c(p)), 1),
          i(p) ? (r(), d(L, { key: 0 }, [
            V(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Sd))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Ed = /* @__PURE__ */ z(Cd, [["__scopeId", "data-v-be6f079c"]]), Ad = ["data-loaded"], Od = { class: "rows" }, Td = ["disabled", "onClick"], Id = { class: "title" }, Bd = { class: "relations" }, Rd = { key: 2 }, Ld = {
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
    const n = e, a = t, s = M([]), o = M({}), l = M(0), i = M(""), u = M(null), c = M(!1), f = M("");
    let m = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (I) => p[I] || `${I.replaceAll("_", " ").replace(/^./, (q) => q.toUpperCase())}s`, b = S(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((I, q) => I + q, 0) },
      ...Object.entries(o.value).filter(([I]) => !n.onlyKinds.length || n.onlyKinds.includes(I)).map(([I, q]) => ({ key: I, label: g(I), count: q }))
    ]), w = S(() => {
      const I = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((U) => U.endpoint.model))].map((U) => [U, s.value.filter((x) => x.endpoint.model === U).length])), q = { doc: 0, task: 1, message: 2 };
      return Object.entries(I).sort(([U], [x]) => (q[U] ?? 3) - (q[x] ?? 3)).map(([U, x]) => ({ model: U, count: x, rows: s.value.filter((y) => y.endpoint.model === U) }));
    }), C = (I) => I.endpoint.unavailable || !I.endpoint.open_ref, A = (I) => ({ [n.linkAttribute]: !0, "data-link-model": I.endpoint.model, "data-link-id": I.endpoint.id }), _ = (I) => `${I.endpoint.model === "doc" && I.endpoint.id === n.documentId ? "Design document" : I.endpoint.model.replaceAll("_", " ").replace(/^./, (q) => q.toUpperCase())} ${I.endpoint.id}, ${I.relations.map((q) => q.replaceAll("_", " ")).join(", ")}`;
    async function j(I = 1) {
      const q = ++m;
      c.value = !0, f.value = "";
      const U = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(I), "--page-size", String(n.pageSize)];
      n.outsidePlan && U.push("--outside-plan"), n.documentId && U.push("--first-counterpart", `doc:${n.documentId}`), i.value && U.push("--kind", i.value);
      try {
        const x = await n.read(U);
        if (q !== m) return;
        if (!x.ok) {
          f.value = x.error;
          return;
        }
        const y = x.value.counterparts ?? [], $ = I === 1 ? y : [...s.value, ...y];
        s.value = [...new Map($.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = x.value.categories ?? {}, l.value = x.value.total, u.value = x.value.next_page ?? null;
      } catch (x) {
        q === m && (f.value = x.message);
      } finally {
        q === m && (c.value = !1);
      }
    }
    function F(I) {
      if (C(I)) return;
      const [q, U] = I.endpoint.open_ref.split(":");
      a("open", { table: q, id: Number(U) });
    }
    function T(I) {
      i.value = I, j();
    }
    const G = () => !c.value && u.value && j(u.value), P = S(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", j();
    }, { immediate: !0 }), (I, q) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), D(Lt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: T
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", Od, [
        e.grouped ? (r(!0), d(L, { key: 0 }, Q(w.value, (U) => (r(), D(Ed, {
          key: U.model,
          model: U.model,
          count: U.count,
          rows: U.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: F
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(L, { key: 1 }, Q(s.value, (U) => (r(), d("button", De({
          key: `${U.endpoint.model}:${U.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, A(U), {
          disabled: C(U),
          onClick: (x) => F(U)
        }), [
          h("span", Id, v(U.endpoint.title), 1),
          h("span", Bd, [
            V(v(_(U)), 1),
            C(U) ? (r(), d(L, { key: 0 }, [
              V(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Td))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Rd, v(e.empty), 1)) : k("", !0),
        E(En, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: P.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Ad)) : k("", !0);
  }
}, Nd = /* @__PURE__ */ z(Ld, [["__scopeId", "data-v-3b23de37"]]), qd = (e, t, n) => Math.max(t, Math.min(n, e)), Dd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, yi = /* @__PURE__ */ new WeakMap(), Pd = (e, t) => yi.set(e, t);
function jd(e, t) {
  for (let n = t; n; n = yi.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function bi(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !jd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Mt = 8, Fd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = M(null), o = ($) => $ ? `${$}px` : void 0, l = S(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = M({ w: 0, h: 0 }), u = ($) => ({ left: $.x, right: $.flipX ?? $.x, top: $.y, bottom: $.y }), c = M(a.anchor ? a.anchor.getBoundingClientRect() : a.point ? u(a.point) : null), f = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), m = ($) => ({
      left: Math.max(0, $.left),
      top: Math.max(0, $.top),
      right: Math.min(window.innerWidth, $.right),
      bottom: Math.min(window.innerHeight, $.bottom)
    }), p = ($) => {
      const O = $.closest(".pane, .float-window");
      return O ? m(O.getBoundingClientRect()) : f();
    }, g = ($, O) => `${Math.max(0, $ ? Math.min($, O) : O)}px`;
    function b($, O) {
      return {
        below: $.bottom - O.bottom - a.gap - Mt,
        above: O.top - $.top - a.gap - Mt,
        across: $.right - $.left - 2 * Mt
      };
    }
    function w($) {
      if (!a.anchor) return f();
      const O = p(a.anchor), R = b(O, $);
      return i.value.w <= R.across && i.value.h <= Math.max(R.below, R.above) ? O : f();
    }
    const C = S(() => {
      if (!c.value) return l.value;
      const $ = c.value, O = w($), R = b(O, $), { w: W, h: K } = i.value, Z = a.point ? $.left + W > O.right - Mt : a.align === "auto" ? $.left + $.right > O.left + O.right : a.align === "right", le = qd(Z ? $.right - W : $.left, O.left + Mt, Math.max(O.left + Mt, O.right - W - Mt)), $e = K > R.below && R.above > R.below ? { bottom: `${window.innerHeight - $.top + a.gap}px`, maxHeight: g(a.maxHeight, R.above) } : { top: `${$.bottom + a.gap}px`, maxHeight: g(a.maxHeight, R.below) };
      return { ...l.value, ...$e, left: `${le}px`, maxWidth: g(a.maxWidth, R.across) };
    }), A = n, _ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function j($) {
      const O = _(), R = O.indexOf(document.activeElement);
      O[(R + $ + O.length) % O.length].focus();
    }
    const F = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => A("close") }, T = ($) => F[$.key] && ($.preventDefault(), F[$.key]()), G = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let P = 0;
    const I = new ResizeObserver(() => {
      cancelAnimationFrame(P), P = requestAnimationFrame(G);
    });
    bi(s, ($) => a.anchor && !a.anchor.contains($.target) && A("close"));
    const q = ($, O) => ["top", "left", "right", "bottom"].some((R) => Math.abs($[R] - O[R]) > 1), U = ($) => $.bottom < 0 || $.top > window.innerHeight;
    let x = 0;
    function y() {
      if (a.anchor) {
        const $ = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || U($)) return A("close");
        q($, c.value) && (c.value = $);
      }
      x = requestAnimationFrame(y);
    }
    return Me(() => {
      a.anchor && s.value && Pd(s.value, a.anchor), G(), s.value && I.observe(s.value), !a.plain && _()[0] && _()[0].focus(), y();
    }), Re(() => {
      I.disconnect(), cancelAnimationFrame(x), cancelAnimationFrame(P);
    }), t({ element: s }), ($, O) => (r(), D(Cn, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", De({
        ref_key: "panel",
        ref: s
      }, $.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: C.value,
        onKeydown: T
      }), [
        ne($.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Pt = /* @__PURE__ */ z(Fd, [["__scopeId", "data-v-8094ec27"]]), Wd = { class: "split-button" }, Hd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = M(null), s = M(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Wd, [
      E(me, {
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
        E(me, {
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
            E(oe, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), D(Pt, {
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
}, zd = /* @__PURE__ */ z(Hd, [["__scopeId", "data-v-c258494d"]]), Ud = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Vd = {
  key: 1,
  class: "menu-item-text"
}, Gd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", Ud, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", Vd, [
        h("span", null, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ne(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, He = /* @__PURE__ */ z(Gd, [["__scopeId", "data-v-fec99974"]]), Kd = ["aria-expanded"], Yd = { class: "drop-label" }, Xd = ["value"], Qd = {
  key: 1,
  class: "drop-lead"
}, Jd = { class: "drop-item-text" }, Zd = {
  key: 2,
  class: "drop-note"
}, ef = {
  key: 1,
  class: "drop-none"
}, tf = {
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
    const n = e, a = t, s = M(!1), o = M(null), l = M(""), i = S(() => {
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
        e.icon ? (r(), D(oe, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", Yd, v(e.label), 1),
        E(oe, {
          name: "down",
          size: 11
        })
      ], 10, Kd),
      s.value ? (r(), D(Pt, {
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
          }, null, 40, Xd)) : k("", !0),
          (r(!0), d(L, null, Q(i.value, (m) => (r(), D(He, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: N(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: m.running }])
              }, null, 2)) : k("", !0),
              m.lead ? (r(), d("span", Qd, v(m.lead), 1)) : k("", !0),
              h("span", Jd, v(m.label), 1),
              m.note ? (r(), d("span", Zd, v(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", ef, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, to = /* @__PURE__ */ z(tf, [["__scopeId", "data-v-29dfcce5"]]), nf = 0, af = "/api/lines", sf = "/api/line", Ko = 5e3, Yo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Xo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ja = (e) => JSON.stringify(e.line), Qo = () => new DOMException("cancelled", "AbortError");
class of {
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
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Ht));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Oe.whenFree(() => this.send()), nf));
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
      const o = await Oe.sent(af, Yo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Xo(i.body, ut)), Ko);
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
    await this.alone(t, ut), Date.now() - n < Ko ? this.slow.delete(ja(t.body)) : this.slow.add(ja(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Oe.sent(sf, Yo(t.body, t.signal), [Xo(t.body, n)], n === ut ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ki = new of(), lf = "/api/window";
function rf(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${lf}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Oe.whenFree(async () => {
    const f = await Oe.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: ut }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Oe.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const wi = /* @__PURE__ */ new Map();
class uf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = ot({ buttons: [], missing: {} }), this.loading = ot(!1), this.loaded = ot(!1), this.failed = ot(""), this.pending = null;
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
function nE(e, t) {
  const n = new uf(e, t);
  return wi.set(e, n), n.load().catch(() => {
  }), n;
}
const no = (e) => wi.get(e);
function cf(e, t, n) {
  const a = no(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function df(e, t) {
  if (!e) return !0;
  const n = no(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const ff = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let $i = {};
async function aE(e = (t) => Oe.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && ($i = (await t.json()).states);
}
const ao = (e, t) => {
  var n;
  return (n = $i[e]) == null ? void 0 : n[t];
}, vn = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.label) ?? ff(t);
}, so = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, mf = (e, t) => {
  var n;
  return ((n = ao(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, hf = Symbol("pane-page"), oo = Symbol("inspector-host"), xi = { 1: "refused", 2: "usage", 3: "fault" }, pf = 100, vf = 50, gf = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, yf = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function bf({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = M({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: g = [], sources: b = [], links: w = {}, search: C = {}, readOnly: A = !1, shared: _ = null }) {
  const j = /* @__PURE__ */ new Map(), F = (K, Z) => l.follow(e, K, (le) => {
    j.clear(), Z(le);
  }, a), T = new AbortController(), G = M(!1), P = performance.now();
  let I = 0, q = 0, U = () => {
  };
  const x = new Promise((K) => U = K);
  T.signal.addEventListener("abort", U, { once: !0 });
  const y = () => {
    clearTimeout(q), q = setTimeout(() => {
      I === 0 && Xs(P, () => {
        G.value = !0, U();
      });
    }, vf);
  }, $ = (K, Z) => (I += 1, Tt(e, K, t, T.signal, Z).finally(() => {
    I -= 1, y();
  })), O = (K, Z) => (y(), x.then(() => T.signal.aborted ? mt : Tt(e, K, t, T.signal, Z))), R = ({ only: K = [], state: Z = {} } = {}) => (I += 1, wf(() => rf(e, t, K, Z, T.signal), T.signal).finally(() => {
    I -= 1, y();
  })), W = (K, { unbatched: Z = !1, deferred: le = !1 } = {}) => {
    const ce = j.get(K);
    if (ce && performance.now() - ce.at < pf) return ce.answer;
    const $e = le && !G.value ? O(K, Z) : $(K, Z);
    return j.set(K, { answer: $e, at: performance.now() }), $e;
  };
  return {
    answered: G,
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
    search: C,
    readOnly: A,
    shared: _,
    read: W,
    readKeys: R,
    waitForServer: () => Js() ? mi() : null,
    run: (K) => Tt(e, K, t, T.signal),
    upload: (K) => xf(K, e, T.signal),
    cancel: () => T.abort(),
    signal: T.signal,
    subscriptions: l,
    follow: (K, Z) => F([K].flat().filter((le) => o.some((ce) => eo(ce, le))), Z),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: F,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (K) => S(() => {
      var Z;
      return u.value[K] ?? ((Z = c.find((le) => le.key === K)) == null ? void 0 : Z.default);
    }),
    setting: async (K, Z) => {
      const le = await W(`window setting ${e} ${K}`);
      return le.ok ? le.value.value : Z;
    },
    setOption: m,
    keep: (K, Z) => Tt(e, ["window", "save-setting", e, K, JSON.stringify(Z)], t, T.signal)
  };
}
function Si(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const mt = { ok: !1, failure: "cancelled", error: "" }, lo = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function _i(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? mt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: xi[n.code] || "fault", error: Si(n.error) };
  } catch {
    return t != null && t.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
const kf = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: xi[e.code] || "fault", error: Si(e.error) };
async function wf(e, t) {
  try {
    const n = await e();
    return t.aborted ? mt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, kf(s)])) } };
  } catch {
    return t.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
async function Mi(e, t, n) {
  const a = await _i(() => ki.read(e, t, n), t);
  return a.failure !== "unreachable" || !Js() ? a : (await mi(), t.aborted ? mt : Mi(e, t, n));
}
function Tt(e, t, n, a = void 0, s = !1) {
  return Oe.held(() => $f(e, t, n, a, s), Oe.knownRead(Array.isArray(t) ? t : io(t)));
}
async function $f(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : io(t), environment: n };
  return await Oe.isRead(o.line) ? Oe.joined(JSON.stringify(o), (l, i) => Mi({ ...o, attribution: i }, l, s), a, o).catch(() => mt) : _i(() => ki.write({ ...o, attribution: {
    client_id: Oe.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function xf(e, t, n = void 0) {
  try {
    const a = await Oe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? mt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? mt : { ok: !1, failure: "unreachable", error: lo };
  }
}
function io(e) {
  return [...e.matchAll(gf)].map(([t]) => t.replace(yf, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Sf = (e) => `show-${e}`, sE = (e, t, n) => e.filter((a) => {
  var s;
  return n(Sf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ro = "messages.chat", ta = "main", Ci = "Main agent", _f = { main: Ci, worker: "Worker", helper: "Helper" }, Mf = "journal-", uo = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Cf = (e) => uo(e.replace(Mf, "").replaceAll("-", " ")), Ef = (e) => `${e.role} ${e.number}`, Af = (e) => e.role === ta ? Ci : `${uo(e.role)} ${e.number}`;
function Xt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === ta || !n ? _f[e.role] ?? uo(e.role) : Cf(n), s = e.role === ta ? "" : Ef(e), o = e.role === ta ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: Af(e) };
}
const Of = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Tf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M([]), o = M(""), l = S(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Xt(c).title, note: Xt(c).subtext }))), i = S(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Tt(ro, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(L, null, [
      E(to, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Of, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, If = /* @__PURE__ */ z(Tf, [["__scopeId", "data-v-d2ea58f1"]]), Bf = {
  key: 0,
  class: "template-brief"
}, Rf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Lf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M([]), o = M(""), l = S(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = S(() => s.value.find((c) => String(c.id) === n.value));
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
    return u(), (c, f) => (r(), d(L, null, [
      E(Lt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Bf, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Rf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Nf = /* @__PURE__ */ z(Lf, [["__scopeId", "data-v-14be8a5c"]]), qf = { class: "info-tip" }, Df = ["aria-label"], Pf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, jf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", qf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        E(oe, {
          name: "info",
          size: 13
        })
      ], 8, Df),
      h("span", Pf, [
        (r(!0), d(L, null, Q(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, Ei = /* @__PURE__ */ z(jf, [["__scopeId", "data-v-a2fe5ff1"]]), Ff = { class: "form-field" }, Wf = { class: "form-field-head" }, Hf = ["for"], zf = {
  key: 1,
  class: "form-field-aside"
}, Uf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Ff, [
      h("div", Wf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Hf),
        e.help ? (r(), D(Ei, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", zf, [
          ne(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ai = /* @__PURE__ */ z(Uf, [["__scopeId", "data-v-302c40bf"]]), Cs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Vf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = xa(), n = S(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => ke((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(Cs), B(t).value]
    ]);
  }
}), Oi = /* @__PURE__ */ z(Vf, [["__scopeId", "data-v-e130a5b9"]]), Gf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Vs(), o = S(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), D(Ai, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: N(() => [
        E(tn, { value: o.value }, {
          choice: N(() => [
            E(Lt, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: N(() => [
            E(Nf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: N(() => [
            E(If, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: N(() => [
            E(Oi, {
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
    return (t, n) => (r(), D(me, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: N(() => [
        E(oe, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Kf(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Yf = (e, t = () => !0) => Kf("keydown", (n) => n.key === "Escape" && t() && e());
function Ti(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = M(!1), s = S(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Yf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Xf = 80, Wt = Zt([]);
function Ii(e) {
  const t = Symbol("layer"), n = () => Wt.includes(t) && Wt.splice(Wt.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Wt.includes(t) && Wt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), S(() => Xf + Math.max(0, Wt.indexOf(t)));
}
let Bi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Bi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Jf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Qf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Bi, document.addEventListener("keydown", s), Ne(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Zf = ["aria-modal", "aria-label", "aria-labelledby"], em = {
  key: 0,
  class: "dialog-head"
}, tm = ["id", "tabindex"], nm = {
  key: 1,
  class: "dialog-foot"
}, am = 500, sm = 400, om = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ti(a, n), i = Ii(s), u = M(null), c = M(null), f = M(null), m = Vs(), p = M(!1), g = Date.now();
    n.modal && Jf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, sm);
    }
    function w(_) {
      !n.modal || Date.now() - g >= am || ![" ", "Enter"].includes(_.key) || (_.preventDefault(), _.stopPropagation());
    }
    const C = () => u.value && (u.value.scrollTop = u.value.scrollHeight), A = new MutationObserver(C);
    return he(u, (_) => {
      A.disconnect(), _ && n.follow && (A.observe(_, { childList: !0, subtree: !0, characterData: !0 }), C());
    }), Re(() => A.disconnect()), (_, j) => (r(), D(Cn, { to: "body" }, [
      E(en, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: N(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: B(i) }),
            onClick: ge(b, ["self"])
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
              e.bare ? k("", !0) : (r(), d("header", em, [
                h("h3", {
                  id: B(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, tm),
                e.closable ? (r(), D(Ma, {
                  key: 0,
                  onClick: B(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ne(_.$slots, "default", {}, void 0, !0)
              ], 2),
              _.$slots.foot ? (r(), d("footer", nm, [
                ne(_.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Zf)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, An = /* @__PURE__ */ z(om, [["__scopeId", "data-v-089c42bc"]]), lm = {
  class: "action-output",
  "data-action-output": ""
}, im = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), D(An, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: N(() => [
        h("pre", lm, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, rm = /* @__PURE__ */ z(im, [["__scopeId", "data-v-b32f94a4"]]);
function um(e) {
  const t = document.body.appendChild(document.createElement("div")), n = qu(rm, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const cm = (e, t, n = {}) => io(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function On(e, t, n, a = {}) {
  var s;
  try {
    if (!await df(e.module, n)) return { ok: !1, error: "" };
    const o = await Tt(ro, cm(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && um(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const dm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Fa = [
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
}, fm = ["secrets", "plugins"], Ri = Object.keys(Ca).filter((e) => !(ii && fm.includes(e)));
S(() => Ri.map((e) => ({ name: e, ...Ca[e] })));
const nn = (e) => Ca[e], Li = new Map(Ri.flatMap((e) => [e, e.replace(/s$/, ""), Ca[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Li.get(String(e).toLowerCase()) || "", Ni = [...Li.keys()].sort((e, t) => t.length - e.length).join("|"), mm = {
  class: "button-form",
  "data-button-form": ""
}, hm = {
  key: 0,
  class: "button-form-title"
}, pm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, vm = { class: "button-form-actions" }, gm = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = M(!1), l = M(""), i = S(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = S(() => {
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
    return (f, m) => (r(), D(An, {
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
          h("div", mm, [
            (p = e.row) != null && p.title ? (r(), d("p", hm, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(L, null, Q(e.button.fields, (g) => (r(), D(Gf, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (b) => s.value[g.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", pm, v(l.value), 1)) : k("", !0),
            h("div", vm, [
              E(me, {
                small: "",
                onClick: m[0] || (m[0] = (g) => a("close"))
              }, {
                default: N(() => [...m[2] || (m[2] = [
                  V("Cancel", -1)
                ])]),
                _: 1
              }),
              E(me, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: N(() => [...m[3] || (m[3] = [
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
}, ym = /* @__PURE__ */ z(gm, [["__scopeId", "data-v-e3f0d786"]]), bm = ["aria-busy"], km = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, wm = { class: "button-slot-confirm-text" }, $m = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, xm = {
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
        var A;
        return !n.readOnly && ((A = s.value) == null ? void 0 : A.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = S(() => {
      var A;
      return !n.readOnly && ((A = s.value) == null ? void 0 : A.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = S(() => n.readOnly ? [] : cf(n.environment, n.name, n.row)), c = M(null), f = M(null), m = M(""), p = M(!1), g = (A) => [A.from ? `From ${A.from}` : "", A.tip, A.warning].filter(Boolean).join(" · "), b = (A) => A.icon || (A.warning ? "dot" : "");
    function w(A) {
      if (!(p.value || n.readOnly)) {
        if (A.fields.length) {
          c.value = A;
          return;
        }
        if (A.confirm) {
          f.value = A;
          return;
        }
        return C(A);
      }
    }
    async function C(A) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const _ = await On(A, n.row, n.environment);
      p.value = !1, m.value = _.ok ? "" : _.error;
      const j = A.label.toLowerCase() + (n.objectName && !A.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", _.ok ? "" : `Could not ${j}: ${_.error}`), _.ok && a("done");
    }
    return (A, _) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(L, { key: 0 }, [
        _[5] || (_[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        E(me, {
          small: "",
          onClick: i
        }, {
          default: N(() => [..._[4] || (_[4] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", km, [
        h("span", wm, v(f.value.confirm), 1),
        E(me, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: _[0] || (_[0] = (j) => C(f.value))
        }, {
          default: N(() => [
            V(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        E(me, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: _[1] || (_[1] = (j) => f.value = null)
        }, {
          default: N(() => [..._[6] || (_[6] = [
            V("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(L, { key: 2 }, [
        (r(!0), d(L, null, Q(u.value, (j) => (r(), d(L, {
          key: j.name
        }, [
          j.menu.length ? (r(), D(zd, {
            key: 0,
            small: "",
            variant: j.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": j.menu_label || "More ways",
            title: g(j),
            "data-button": j.name,
            onMain: (F) => w(j)
          }, {
            menu: N(({ close: F }) => [
              (r(!0), d(L, null, Q(j.menu, (T) => (r(), D(He, {
                key: T.label,
                description: T.description,
                onClick: (G) => (F(), w({ ...j, ...T, menu: [] }))
              }, {
                default: N(() => [
                  V(v(T.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: N(() => [
              V(v(j.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), D(me, {
            key: 1,
            small: "",
            variant: j.primary ? "primary" : "ghost",
            bordered: !j.primary,
            class: Y({ danger: j.danger }),
            icon: b(j),
            disabled: p.value,
            title: g(j),
            "data-button": j.name,
            onClick: (F) => w(j)
          }, {
            default: N(() => [
              V(v(j.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", $m, v(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), D(ym, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: _[2] || (_[2] = (j) => c.value = null),
          onDone: _[3] || (_[3] = (j) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, bm));
  }
}, co = /* @__PURE__ */ z(xm, [["__scopeId", "data-v-a4b6f174"]]), Sm = {
  class: "running",
  "data-running-command": ""
}, _m = ["title"], Mm = {
  key: "idle",
  class: "running-idle"
}, Cm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Sm, [
      E(en, {
        name: "roll",
        mode: "out-in"
      }, {
        default: N(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, _m)) : (r(), d("span", Mm, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, oE = /* @__PURE__ */ z(Cm, [["__scopeId", "data-v-d3240219"]]), Em = ["aria-checked", "disabled", "aria-label", "title"], Am = {
  key: 0,
  class: "switch-inner"
}, Om = {
  key: 0,
  class: "switch-word"
}, Tm = {
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
      e.word && !e.labelled ? (r(), d("span", Om, v(e.word), 1)) : k("", !0)
    ], 10, Em));
  }
}, lE = /* @__PURE__ */ z(Tm, [["__scopeId", "data-v-92ae7767"]]), Im = { class: "notice-text" }, Bm = {
  key: 1,
  class: "notice-actions"
}, Rm = {
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
      e.icon ? (r(), D(oe, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      h("span", Im, [
        ne(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Bm, [
        ne(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, iE = /* @__PURE__ */ z(Rm, [["__scopeId", "data-v-445bd8a6"]]);
function qi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function ra(e, t) {
  return qi(() => localStorage, e, t);
}
function Di(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function fo(e, t) {
  return Di(() => localStorage, e, t);
}
function Pi(e, t) {
  he(t, (n) => fo(e, n), { deep: !0 });
}
function Lm(e, t) {
  return qi(() => sessionStorage, e, t);
}
function Nm(e, t) {
  return Di(() => sessionStorage, e, t);
}
const ua = "journal.environment", ji = M(Lm(ua, ra(ua, "")));
function qm(e) {
  ji.value = e, Nm(ua, e), fo(ua, e);
}
const ca = M(location.hash), Jo = ot(null), Zo = { integrations: "mcp", library: "team" };
function Dm() {
  if (!Jo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Zo[n]) {
    location.replace(`#/${[Zo[n], ...a].join("/")}${t ? `?${t}` : ""}`), ca.value = location.hash;
    return;
  }
  !n || Jo.value(n) || (qm(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ca.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ca.value = location.hash, Dm();
});
const mo = "file", da = S(() => {
  const [e, t = ""] = ca.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: c === mo ? decodeURIComponent(f) : Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: ji.value,
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
}), Ea = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ea.page(e)}?open=${t}`
};
function Pm(e = "", t = 0, n = "") {
  location.hash = Ea.page(e, t, n);
}
function jm(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Fm = (e) => `${e.table}:${e.table === mo ? encodeURIComponent(e.id) : e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Fi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Fm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Wm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const Vt = {};
function rE(e, t) {
  return Vt[e] = t, () => Vt[e] === t && delete Vt[e];
}
function lt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Vt[e]) != null && l.call(Vt, t))) return;
  const s = da.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Fi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
const Hm = (e = "") => lt(mo, e);
function zm(e, t, n, a = 0, s = "") {
  if (e === da.value.env) return lt(t, n, a, s);
  const o = da.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Fi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? zm(a, s, Number(o), 0, t) : lt(s, Number(o), 0, t);
}
function Um(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ut(e) {
  const t = Um(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function uE(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Vm = { class: "inspector-part" }, Gm = { class: "inspector-part-title" }, Km = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Vm, [
      h("h4", Gm, v(e.title), 1),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, cE = /* @__PURE__ */ z(Km, [["__scopeId", "data-v-5175e4a3"]]), el = /* @__PURE__ */ new Map(), Ym = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = M(null), a = M(!1), s = M(t.name && el.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && el.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(L, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ne(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = ge((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Wi = /* @__PURE__ */ z(Ym, [["__scopeId", "data-v-4d2235ba"]]), Xm = ["aria-valuenow", "aria-valuemax"], Qm = {
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
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, Xm));
  }
}, Hi = /* @__PURE__ */ z(Qm, [["__scopeId", "data-v-9eba6a85"]]), Jm = { processes: "process", memories: "memory", replies: "reply" }, fa = (e) => (Jm[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), Es = [], Zm = 2e3, gt = /* @__PURE__ */ new Map(), eh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, th = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function jt(e, { first: t = !1 } = {}) {
  t ? Es.unshift(e) : Es.push(e), gt.clear();
}
function zi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const nh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, ah = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ft(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function sh(e, t) {
  const n = [{ type: "text", text: ft(e).replace(/\r\n/g, `
`) }];
  for (const a of Es)
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
  return oh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function oh(e) {
  return e.split(th).map((t, n) => n % 2 ? t : t.replace(eh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function tl(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const lh = 24;
function ih(e) {
  const [t, , ...n] = e, a = tl(t), s = n.map(tl), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > lh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${gn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${gn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ui = /^\s*(?:[-*+]|\d+[.)])\s+/, As = /^\s*(\d+)[.)]\s/, nl = (e) => e.match(/^\s*/)[0].length;
function Vi(e) {
  const t = e[0].match(As), n = nl(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && nl(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${gn(o.text)}${o.nested.length ? Vi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function rh(e, t) {
  const n = As.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ui.test(e[s]) && As.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const al = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Gi(e) {
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
    if (al(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(ih(t.slice(a, i))), a = i;
      continue;
    }
    if (Ui.test(s)) {
      const i = rh(t, a);
      n.push(Vi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Gi(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !al(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${gn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const uh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ch = (e) => e.type !== "text" && !uh.test(e.html);
function dh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Gi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ch(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ho(e, t = { env: "" }) {
  const n = ah(e, t), a = gt.get(n);
  if (gt.delete(n), a && a.source === t.source && a.reads.every((l) => nh(l, t)))
    return gt.set(n, a), a.html;
  const s = [], o = dh(sh(e, { ...t, reads: s }));
  return gt.set(n, { html: o, reads: s, source: t.source }), gt.size > Zm && gt.delete(gt.keys().next().value), o;
}
const Wa = /* @__PURE__ */ new WeakMap();
function fh(e) {
  if (Wa.has(e)) return Wa.get(e);
  const t = Du(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
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
function Ki() {
  const e = _e(Le, null), t = e ? fh(e) : null;
  return (n, a = {}) => ho(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Yi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Tn = (e) => String(e || "").replace(Yi, (t, n, a, s) => s), mh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Un = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, hh = /^Traceback \(most recent call last\):/m, ph = 8;
function Xi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ph).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function vh(e) {
  const t = [...e.matchAll(mh)].map((a) => a.index);
  if (Un.lastIndex = 0, !t.length || !Un.test(e)) return null;
  Un.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Un)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Xi(n), tail: "" } : null;
}
function gh(e) {
  const t = hh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Xi([o]), tail: n.slice(s).join(`
`) };
}
jt((e) => {
  const t = Tn(e), n = gh(t) || vh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ma = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Qi = (e) => `${e.table}:${e.id}`, Os = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ha = 80;
function sl(e) {
  return e.length <= Ha ? e : `${e.slice(0, Ha + 1).replace(/\s+\S*$/, "") || e.slice(0, Ha)}…`;
}
const ol = {
  messages: (e) => sl(Os(e.text)),
  comments: (e) => sl(Os(e.text)),
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
}, yh = (e) => (ol[e.table] ? ol[e.table](e) : e.title || "") || "", Nt = (e) => ma(e.created_at), bh = (e) => ma(e.updated_at) || Nt(e), kh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, wh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function $h(e) {
  const t = kh.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = wh.exec(e), a = n && kt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function xh(e, t, n, a) {
  const s = zi(a, e, t), o = Tn(s ? yh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ft(nn(e).title)} ${t}</span><span class="row-card-title">${ft(o)}</span></a>`;
}
jt(
  (e, t) => {
    const n = $h(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: xh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Sh = /\.(png|jpe?g|gif|webp|svg)$/i, _h = (e) => Sh.test(e), Mh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Ch = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Eh(e, t) {
  const n = Mh.exec(e), [, a, s, o, l, i] = n || [], u = n && kt(a || o), c = u && zi(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${nn(u).title} ${c.id} · ${ft(i)}`, p = _h(i) ? `<img class="file-card-image" src="${f}" alt="${ft(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ft(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function Ah(e) {
  const t = Ch.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ft(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
jt(
  (e, t) => {
    if (t.inline) return null;
    const n = Eh(e, t) || Ah(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Oh = /`([^`\n]+)`/g;
jt((e) => e.replace(Oh, (t, n) => `<code>${n}</code>`));
const ll = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ea.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
jt(
  (e, t) => e.replace(Yi, (n, a, s, o) => ll[a] ? ll[a](s, o, t) : o)
);
const Th = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ji = new RegExp(`\\b(${Ni}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Zi = new RegExp(`\\b(${Ni}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ih = new RegExp(`<code>((?:${Ji.source}|${Zi.source}))</code>`, "gi"), Bh = (e) => e.replace(Ih, "$1"), Rh = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Lh = (e) => e.replace(Zi, (t, n, a) => a.replace(/\d+/g, (s) => Rh(n.replace(/s$/i, ""), s))), Nh = (e) => Lh(e).replace(
  Ji,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
jt(
  (e, t) => t.rowNames === !1 ? e : Bh(e).split(Th).map((n, a) => a % 2 ? n : Nh(n)).join("")
);
const qh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Dh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ph = /[\w\]]\(/, jh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Fh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Wh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Hh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, zh = /[[({,]$/, Uh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Vh = /^(\t|\s{2,})\S/, Gh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Kh = /`[^`]+`/, Yh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Xh = /[{}()[\];=<>$&|*\\@+^~%]/g, er = /^\s*(?:[-*+]|\d+[.)])\s/, Qh = /^\s*>/, Jh = /^\s*\|/, Zh = 0.6, ep = 0.4, tp = 5, np = 0.03, tr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= tp && t.every((n) => Yh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Xh) ?? []).length / e.length < np;
}, za = (e) => {
  const t = e.trim();
  return Kh.test(t) ? !1 : [qh, Dh, Ph, jh, Fh, Wh, Hh, zh, Uh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Vh.test(e) && !er.test(e) && !tr(e);
};
function ap(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || er.test(t[0]) || t.every((o) => Qh.test(o) || Jh.test(o))) return "text";
  const n = t.filter((o) => !Gh.test(o.trim()));
  if (t.length === 1) return !n.length || za(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(za).length, s = n.filter((o) => !za(o) && tr(o)).length;
  return a >= n.length * Zh && s <= n.length * ep ? "code" : "text";
}
const Ts = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", sp = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", op = `${Ts} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, lp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", ip = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", il = {
  js: { keywords: Ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: sp, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: op, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: lp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: ip, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, rp = {
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
function rl(e, t, n) {
  return n && e.startsWith(n, t);
}
function up(e, t) {
  const n = il[rp[t] ?? t] || il.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (rl(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && rl(e, o, n.block[0])) {
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
function cp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of up(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ft(l) : `<span class="tok-${a}">${ft(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function nr(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const dp = 1500, ul = /* @__PURE__ */ new WeakMap();
async function fp(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await nr(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(ul.get(t)), ul.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, dp)
  )));
}
typeof document < "u" && document.addEventListener("click", fp, !0);
const mp = /\n\s*\n/, hp = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, pp = /^\s*(`{3,}|~{3,})\s*$/, vp = /^\s{4,}\S/, gp = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Is = /^\s*(?:[-*+]|\d+[.)])\s/, ar = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, yp = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function po(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function bp(e) {
  const t = po(e.join(`
`));
  return (yp.find(([, n]) => n.test(t)) || ["text"])[0];
}
const kp = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ar.test(t) && !Is.test(t);
}, wp = (e, t) => Is.test(t) || Is.test([...e].reverse().find((n) => n.trim()) || "");
function vo(e, t) {
  const n = t || bp(e), a = cp(po(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function $p(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && pp.test(s));
  return a < 0 ? e.length : a;
}
function xp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return vo(a.map(Tn), n ? n.toLowerCase() : "");
}
function Sp(e) {
  const t = e.split(mp).map((l) => ({ paragraph: l, type: ap(po(l).split(`
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
      s(), n.push(vo(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Tn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function _p(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Sp(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(hp);
    if (i) {
      const c = $p(n, l, i[2]);
      o(), a.push(xp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = kp(s) ? gp : vp;
    if (!t && u.test(n[l]) && !wp(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && ar.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(vo([...f, ...n.slice(l, c)].map(Tn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
jt((e, t) => _p(e, t.document), { first: !0 });
const Mp = ["innerHTML"], Cp = ["innerHTML"], Ep = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ki(), a = S(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(Ut) && B(Ut)(...l)),
      innerHTML: a.value
    }, null, 8, Mp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Ut) && B(Ut)(...l)),
      innerHTML: a.value
    }, null, 8, Cp));
  }
}, ct = /* @__PURE__ */ z(Ep, [["__scopeId", "data-v-d8e75741"]]), dE = (e) => [...new Set(e.agents.map((t) => t.name))], Ua = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Ap = "main agent", go = (e, t) => t ? Ap : e, Op = ["data-agent-main"], Tp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Ip = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Bp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean, chip: Boolean },
  setup(e) {
    const t = e, n = S(() => go(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main, chip: e.chip }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Tp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), D(oe, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", Ip, v(n.value), 1))
    ], 10, Op));
  }
}, Gt = /* @__PURE__ */ z(Bp, [["__scopeId", "data-v-f8a38025"]]), Rp = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], sr = { danger: "failed", warn: "waiting" }, Lp = (e) => Rp.includes(sr[e] ?? e), or = (e) => Lp(e) ? ["badge", sr[e] ?? e] : ["badge-quiet"], Np = ["aria-expanded"], qp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Dp = {
  key: 0,
  class: "tip-failure"
}, Pp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = _e(Le, null), a = S(() => mf(t.type, t.state)), s = S(() => or(so(t.type, t.state))), o = M(!1), l = M([]), i = M("");
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
      onKeydown: Ue(c, ["escape"])
    }, [
      V(v(B(vn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", qp, [
        i.value ? (r(), d("span", Dp, v(i.value), 1)) : k("", !0),
        (r(!0), d(L, null, Q(l.value, (g) => (r(), d("span", {
          key: g,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : k("", !0)
    ], 42, Np)) : (r(), d("span", {
      key: 1,
      class: Y(s.value)
    }, v(B(vn)(e.type, e.state)), 3));
  }
}, jp = /* @__PURE__ */ z(Pp, [["__scopeId", "data-v-d276694c"]]), Fp = {
  class: "plan-details",
  "data-plan-details": ""
}, Wp = { class: "state-line" }, Hp = {
  key: 0,
  class: "phase-count"
}, zp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Up = { class: "text" }, Vp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, Gp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, Kp = { class: "overall" }, Yp = { class: "overall-figure" }, Xp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, Qp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, Jp = {
  key: 5,
  class: "part"
}, Zp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Fp, [
        h("div", Wp, [
          E(jp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", B(so)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Hp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", zp, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", Up, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", Vp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", Gp, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", Kp, [
            E(Hi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", Yp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Xp, [
          E(Gt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", Qp, [
          B(Ua)(e.plan) ? (r(), D(Gt, {
            key: 0,
            name: B(Ua)(e.plan).name,
            main: B(Ua)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(L, { key: 1 }, [
            V(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", Jp, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          E(Wi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: N(() => [
              E(ct, {
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
}, fE = /* @__PURE__ */ z(Zp, [["__scopeId", "data-v-52683b11"]]), e1 = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), D(Je(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: N(() => [
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
}, t1 = /* @__PURE__ */ z(e1, [["__scopeId", "data-v-683e1839"]]), lr = (e) => `row:${e}`, n1 = 5e3, a1 = "cancelled", Va = /* @__PURE__ */ new Map();
async function s1(e, t) {
  const n = `${e.environment}:${t}`, a = Va.get(n);
  if (a && performance.now() - a.at < n1) {
    const o = await a.answer;
    if (o.failure !== a1) return o;
    Va.delete(n);
  }
  const s = e.read(`agent tip ${lr(t)}`);
  return Va.set(n, { answer: s, at: performance.now() }), s;
}
function o1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function In(e, t = Date.now()) {
  const n = o1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const l1 = 36e5;
function i1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / l1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function cl(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function ir(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function dl(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ga = (e) => String(e).padStart(2, "0");
function rr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ga(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ga(Math.floor(t % 3600 / 60))}m ${Ga(t % 60)}s`;
}
const r1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, u1 = { state: "retired", words: "Retired" }, c1 = (e) => e.retired ? u1 : r1[e.activity], d1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), f1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${In(e, t)}` : "", m1 = (e, t) => e ? `Seen: ${In(e, t)}` : "", h1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, p1 = { key: 0 }, v1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, g1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, y1 = ["data-state"], b1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, k1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, w1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, $1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, x1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = _e(Le, null), a = M(!1), s = M(null), o = M(""), l = M(Date.now()), i = S(() => c1(s.value)), u = S(() => f1(s.value.since, l.value)), c = S(() => m1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await s1(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), D(t1, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Sa({
      default: N(() => [
        ne(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: N(() => [
          s.value ? (r(), d(L, { key: 0 }, [
            h("span", h1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = V()),
              s.value.name ? (r(), d("span", p1, v(s.value.name), 1)) : k("", !0)
            ]),
            h("span", v1, v(B(d1)(s.value)), 1),
            h("span", g1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, y1),
              V(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", b1, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", k1, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", w1, v(e.label), 1)),
          o.value ? (r(), d("span", $1, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, yn = /* @__PURE__ */ z(x1, [["__scopeId", "data-v-71d17663"]]), S1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, _1 = { class: "agent-word" }, M1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", S1, [
      (r(!0), d(L, null, Q(s.value, (i) => (r(), D(yn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: B(go)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => B(Fe)(`agents:${i.id}`)
      }, {
        default: N(() => [
          h("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          E(Gt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", _1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, C1 = /* @__PURE__ */ z(M1, [["__scopeId", "data-v-619caeed"]]), E1 = { class: "phases" }, A1 = { class: "phead" }, O1 = { class: "mark" }, T1 = { class: "ptitle" }, I1 = { class: "phead-end" }, B1 = {
  key: 0,
  class: "checkpoint"
}, R1 = { class: "progress" }, L1 = {
  key: 0,
  class: "when"
}, N1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", E1, [
      (r(!0), d(L, null, Q(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", A1, [
          h("span", O1, [
            E(oe, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", T1, v(i + 1) + ". " + v(l.title), 1),
          h("span", I1, [
            l.checkpoint ? (r(), d("span", B1, "checkpoint")) : k("", !0),
            h("span", R1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", L1, v(l.goal), 1)) : k("", !0),
        E(C1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(L, null, Q(l.tasks, (u) => ne(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, mE = /* @__PURE__ */ z(N1, [["__scopeId", "data-v-05aaa685"]]), q1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, D1 = { ...q1, done: "Completed" }, P1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), j1 = (e) => P1.has(e), bn = (e) => j1(e) ? "done" : e, F1 = { class: "task-status-icon" }, W1 = ["width", "height", "aria-label"], H1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = S(() => so("task", bn(t.status))), a = S(() => n.value === "testing" ? "started" : n.value), s = S(() => D1[t.status] ?? vn("task", t.status));
    return (o, l) => (r(), d("span", F1, [
      E(en, {
        name: "turn",
        mode: "out-in"
      }, {
        default: N(() => [
          (r(), d("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            E(tn, { value: a.value }, {
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
          ], 10, W1))
        ]),
        _: 1
      })
    ]));
  }
}, Aa = /* @__PURE__ */ z(H1, [["__scopeId", "data-v-ae24a63f"]]), z1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, U1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, V1 = {
  key: 2,
  class: "empty"
}, G1 = { class: "day" }, K1 = { class: "events" }, Y1 = { class: "mark" }, X1 = { class: "what" }, Q1 = { class: "head" }, J1 = { class: "word" }, Z1 = ["title", "onClick"], ev = { class: "at" }, tv = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = M(null), l = M(""), i = S(() => {
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
    return he(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", z1, [
      l.value ? (r(), d("p", U1, v(l.value), 1)) : o.value === null ? (r(), D(nt, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", V1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(L, null, Q(i.value, (p) => (r(), d(L, {
        key: p.day
      }, [
        h("h3", G1, v(p.day), 1),
        h("ol", K1, [
          (r(!0), d(L, null, Q(p.items, (g) => (r(), d("li", {
            key: `${g.time}-${g.event_type}-${g.task_id}`,
            class: Y(["event", g.event_type]),
            "data-plan-event": ""
          }, [
            h("span", Y1, [
              n[g.event_type].state ? (r(), D(Aa, {
                key: 0,
                status: n[g.event_type].state
              }, null, 8, ["status"])) : (r(), D(oe, {
                key: 1,
                name: n[g.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", X1, [
              h("div", Q1, [
                h("span", J1, v(n[g.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${g.task_id}`,
                  onClick: (b) => s("select", g.task_id)
                }, "#" + v(g.task_id) + " " + v(g.title), 9, Z1),
                h("span", ev, v(u(g.time)), 1)
              ]),
              g.text ? (r(), D(ct, {
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
}, hE = /* @__PURE__ */ z(tv, [["__scopeId", "data-v-9e511133"]]), nv = 1e3;
function ur() {
  const e = M(Date.now()), t = setInterval(() => e.value = Date.now(), nv);
  return tt(() => clearInterval(t)), e;
}
const av = Symbol("resource-subscriptions");
function sv() {
  const e = _e(av, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = _e(Le, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new hi();
  return (a, s) => n.follow("resources", a, s);
}
function Bn(e, t, n = () => !0) {
  const a = Zs(t, 100), s = sv()(e, (o) => {
    n(o) && a();
  });
  _a(() => {
    s(), a.cancel();
  });
}
function ov(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const cr = { compact: "Compaction", clear: "Clear" }, lv = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, iv = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function rv(e) {
  return e != null && e.is_open ? `${cr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function uv(e) {
  if (!e) return [];
  const t = [["Last context change", `${cr[e.change]}: ${iv[e.state]}`], ["Asked by", lv[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const cv = "Not known", dv = 80, fv = 1e3, mv = "worker", hv = "main", pv = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), vv = (e) => e.ok ? e.value.rows : [], gv = (e, t) => e.ended_at ? "ended" : e.paused_at || pv.has(t == null ? void 0 : t.state) ? "waiting" : "running", dr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function yv({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / fv, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: rr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > dv }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? cv : `$${t.cost_dollars.toFixed(2)}` }), e.role === mv && l.push({ key: "pace", label: "Tasks an hour", value: String(i1(dr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === hv && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function bv(e) {
  const t = dr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function kv(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", cl(e.created_at)]), e.ended_at && a.push(["Ended", cl(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...uv(n)), a;
}
const wv = { class: "band" }, $v = { key: 0 }, xv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", wv, [
      E(oe, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ne(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", $v, v(e.count), 1)) : k("", !0)
    ]));
  }
}, qt = /* @__PURE__ */ z(xv, [["__scopeId", "data-v-1758914f"]]), Sv = { class: "number" }, _v = { class: "text" }, Mv = 150, Cv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = M(!1), a = S(() => t.text.length > Mv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(L, null, [
      e.text ? (r(), d(L, { key: 0 }, [
        E(qt, { icon: "file" }, {
          default: N(() => [
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
      e.points.length ? (r(), d(L, { key: 1 }, [
        E(qt, { icon: "points" }, {
          default: N(() => [...l[1] || (l[1] = [
            V("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(L, null, Q(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", Sv, v(i.id), 1),
            h("span", _v, [
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
}, Ev = /* @__PURE__ */ z(Cv, [["__scopeId", "data-v-c99de22c"]]), Av = ["aria-expanded"], Ov = { class: "count" }, Tv = {
  key: 0,
  "data-agent-fold-body": ""
}, Iv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Bt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Yt(e, "open");
    return (n, a) => (r(), d(L, null, [
      h("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        E(oe, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        V(v(e.label), 1),
        h("span", Ov, v(e.count), 1),
        E(oe, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Av),
      t.value ? (r(), d("div", Tv, [
        ne(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Ka = /* @__PURE__ */ z(Iv, [["__scopeId", "data-v-7f93d8d9"]]), Bv = ["onClick"], Rv = { class: "text" }, Lv = { class: "aside" }, Nv = {
  key: 0,
  class: "none"
}, qv = {
  class: "skills",
  "data-agent-skills": ""
}, Dv = {
  key: 0,
  class: "none-inline"
}, Pv = { class: "label" }, jv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Zt({ helpers: !1, skills: !1 }), a = M([]), s = M([]), o = async (l) => vv(await t.read(l));
    return he(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), he(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(L, null, [
      E(Ka, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: N(() => [
          (r(!0), d(L, null, Q(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => B(lt)("agents", u.id)
          }, [
            h("span", Rv, v(B(Xt)(u).title), 1),
            h("span", Lv, v(B(Xt)(u).subtext), 1)
          ], 8, Bv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", Nv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Ka, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: N(() => [
          h("p", qv, [
            (r(!0), d(L, null, Q(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Dv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Ka, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: N(() => [
          (r(!0), d(L, null, Q(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Pv, v(u) + ":", 1),
            h("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Fv = /* @__PURE__ */ z(jv, [["__scopeId", "data-v-1281605f"]]), Wv = ["datetime", "title"], et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = ur(), a = S(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(B(In)(e.at, B(n))), 9, Wv));
  }
}, Hv = {
  class: "now",
  "data-agent-now": ""
}, zv = {
  key: 1,
  class: "muted"
}, Uv = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, Vv = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, Gv = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Kv = { class: "line" }, Yv = { class: "detail" }, Xv = { class: "bar" }, Qv = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = S(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(L, null, [
      E(qt, { icon: "play" }, {
        default: N(() => [...o[2] || (o[2] = [
          V("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Hv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(lt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", zv, v(e.nothing), 1)),
        n.value ? (r(), d("span", Uv, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", Vv, [
          o[3] || (o[3] = V("Seen: ", -1)),
          E(et, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", Gv, [
        h("div", Kv, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(lt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", Yv, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", Xv, [
          h("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, Jv = /* @__PURE__ */ z(Qv, [["__scopeId", "data-v-ff25c609"]]), Zv = ["onClick"], eg = { class: "text" }, tg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, ng = { class: "text" }, ag = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, sg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(L, null, [
      E(qt, { icon: "clock" }, {
        default: N(() => [...n[0] || (n[0] = [
          V("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(L, null, Q(e.moves, (a) => (r(), d(L, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => B(lt)(a.table, a.id)
        }, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", eg, v(a.text), 1),
          E(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Zv)) : (r(), d("div", tg, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", ng, v(a.text), 1),
          E(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", ag, "Nothing yet."))
    ], 64));
  }
}, og = /* @__PURE__ */ z(sg, [["__scopeId", "data-v-58f0db57"]]), lg = {
  class: "strip",
  "data-agent-strip": ""
}, ig = ["data-agent-cell"], rg = {
  key: 0,
  class: "meter"
}, ug = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", lg, [
      (r(!0), d(L, null, Q(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", rg, [
          h("i", {
            class: Y({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, ig))), 128))
    ]));
  }
}, cg = /* @__PURE__ */ z(ug, [["__scopeId", "data-v-b6657ab7"]]), dg = {}, fg = { class: "menu-label" };
function mg(e, t) {
  return r(), d("span", fg, [
    ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const wt = /* @__PURE__ */ z(dg, [["render", mg], ["__scopeId", "data-v-aa955b3e"]]), hg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, pg = {
  key: 0,
  class: "skills-none"
}, vg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.skills.filter((l) => l.state === "loaded")), o = S(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", hg, [
      E(wt, null, {
        default: N(() => [...i[1] || (i[1] = [
          V("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", pg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(L, null, Q(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        E(oe, {
          name: "book",
          size: 12
        }),
        V(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(L, { key: 1 }, [
        E(wt, null, {
          default: N(() => [...i[2] || (i[2] = [
            V("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(L, null, Q(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          E(oe, {
            name: "book",
            size: 12
          }),
          V(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      E(He, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: N(() => [...i[3] || (i[3] = [
          V("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, gg = /* @__PURE__ */ z(vg, [["__scopeId", "data-v-be514d47"]]), yg = ["disabled", "title"], bg = { class: "gauge usage" }, kg = {
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
      E(oe, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = V()),
      h("span", bg, [
        h("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      V(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, yg)) : k("", !0);
  }
}, wg = /* @__PURE__ */ z(kg, [["__scopeId", "data-v-a36f09dc"]]), $g = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(B(or)(e.tone))
    }, v(e.text), 3));
  }
}, yo = /* @__PURE__ */ z($g, [["__scopeId", "data-v-b7a33f3d"]]);
function xg(e, t, n, { groups: a, programs: s }) {
  const o = M({}), l = M(""), i = M(!1), u = S(() => !!e.value && !e.value.ended_at), c = S(() => u.value && !!e.value.paused_at);
  async function f(b, w = null) {
    l.value = "";
    const C = await oi(w, b, t);
    return l.value = C.ok ? "" : C.error, n(), C;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, w) => f(["agent", "control", String(e.value.number), b, w.value], { target: o, fields: { value: { ...o.value, [b]: w.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const Sg = ["disabled", "title"], _g = ["disabled", "title"], Mg = { class: "gauge" }, Cg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Eg = ["disabled", "title"], Ag = ["disabled"], Og = ["disabled"], Tg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ig = ["title"], Bg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Rg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Lg = { class: "gauge" }, Ng = { class: "context-used" }, qg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Dg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Pg = 75, jg = {
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
    const n = e, a = t, s = xg(Na(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Na(n, "controlGroups"), programs: Na(n, "agentPrograms") }), o = M(null), l = M(""), i = S(() => s.groups.value.find((P) => P.key === l.value));
    function u(P, I) {
      o.value = P.currentTarget, l.value = I;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = S(() => n.skills.filter((P) => P.state === "loaded"));
    function m(P) {
      u(P, "skills"), a("skills");
    }
    const p = (P) => s.groups.value.some((I) => I.key === P), g = S(() => {
      var P;
      return s.chosen.value.model ?? ((P = w.value) == null ? void 0 : P.model) ?? "";
    }), b = S(() => {
      var P;
      return s.chosen.value.effort ?? ((P = w.value) == null ? void 0 : P.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const w = S(() => {
      var P;
      return ((P = n.usage.agents) == null ? void 0 : P.find((I) => {
        var q;
        return I.id === ((q = n.agent) == null ? void 0 : q.id);
      })) ?? null;
    }), C = S(() => {
      var P;
      return ((P = w.value) == null ? void 0 : P.context_percent) == null ? null : Math.round(w.value.context_percent);
    }), A = S(() => {
      var P;
      return rv(((P = w.value) == null ? void 0 : P.context_change) ?? null);
    }), _ = (P) => `${Math.round(P / 1e3)}k`, j = S(() => {
      var P;
      return !!((P = w.value) != null && P.context_limit_tokens);
    }), F = S(() => {
      var P, I;
      return ((P = w.value) == null ? void 0 : P.context_limit_tokens) || ((I = w.value) == null ? void 0 : I.context_window_tokens) || 0;
    }), T = S(() => F.value ? `${_(w.value.context_tokens ?? 0)} of ${_(F.value)}` : ""), G = S(() => {
      var P;
      return (P = w.value) != null && P.cost_dollars ? `$${w.value.cost_dollars.toFixed(2)}` : "";
    });
    return (P, I) => {
      var q, U;
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
            onClick: I[0] || (I[0] = (x) => u(x, "agent"))
          }, [
            E(oe, {
              name: "agents",
              size: 12
            }),
            V(" " + v(((q = e.agentPrograms.find((x) => x.name === e.agent.program)) == null ? void 0 : q.title) || e.agent.program), 1)
          ], 8, Sg),
          E(wg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: I[1] || (I[1] = (x) => a("open", "usage", x))
          }, null, 8, ["windows", "disabled"]),
          C.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${C.value}% full: clear or compact it`,
            onClick: I[2] || (I[2] = (x) => p("context") ? u(x, "context") : a("open", "context", x.currentTarget))
          }, [
            E(oe, {
              name: "gauge",
              size: 12
            }),
            I[14] || (I[14] = V()),
            h("span", Mg, [
              h("span", {
                style: ye({ width: `${C.value}%` })
              }, null, 4)
            ]),
            V(" " + v(C.value) + "% ", 1)
          ], 8, _g)) : (U = w.value) != null && U.context_unknown ? (r(), d("span", Cg, [
            E(oe, {
              name: "gauge",
              size: 12
            }),
            I[15] || (I[15] = V(" Context: unknown", -1))
          ])) : k("", !0),
          g.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${g.value}: change the model`,
            onClick: I[3] || (I[3] = (x) => p("model") ? u(x, "model") : null)
          }, [
            E(oe, {
              name: "model",
              size: 12
            }),
            V(" " + v(g.value), 1)
          ], 8, Eg)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: I[4] || (I[4] = (x) => u(x, "effort"))
          }, [
            E(oe, {
              name: "bolt",
              size: 12
            }),
            V(" " + v(b.value), 1)
          ], 8, Ag)) : k("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: I[5] || (I[5] = (x) => a("open", "cost", x.currentTarget))
          }, v(G.value), 9, Og)) : k("", !0),
          e.branch ? (r(), d("span", Tg, [
            E(oe, {
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
            onClick: I[6] || (I[6] = (x) => a("open", "jobs", x.currentTarget))
          }, [
            E(oe, {
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
            E(oe, {
              name: "book",
              size: 12
            }),
            V(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(L, { key: 8 }, [
            h("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Pg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: I[7] || (I[7] = (x) => a("open", "fitness", x.currentTarget))
            }, [
              E(oe, {
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
              onClick: I[8] || (I[8] = (x) => a("open", "load", x.currentTarget))
            }, [
              E(oe, {
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
          onClick: I[9] || (I[9] = (x) => u(x, "start"))
        }, [
          E(oe, {
            name: "agents",
            size: 12
          }),
          I[16] || (I[16] = V(" Start an agent", -1))
        ])) : k("", !0),
        I[22] || (I[22] = h("span", { class: "space" }, null, -1)),
        B(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: B(s).failure.value
        }, v(B(s).failure.value), 9, Ig)) : k("", !0),
        ne(P.$slots, "default", {}, void 0, !0),
        o.value ? (r(), D(Pt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: N(() => {
            var x;
            return [
              l.value === "agent" ? (r(), d(L, { key: 0 }, [
                B(s).asking.value ? (r(), d(L, { key: 0 }, [
                  E(wt, { "data-agent-stop-ask": "" }, {
                    default: N(() => [...I[17] || (I[17] = [
                      V("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  E(He, {
                    "data-agent-stop-confirm": "",
                    onClick: I[10] || (I[10] = (y) => (c(), B(s).stop()))
                  }, {
                    default: N(() => [...I[18] || (I[18] = [
                      V("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  E(He, {
                    onClick: I[11] || (I[11] = (y) => B(s).asking.value = !1)
                  }, {
                    default: N(() => [...I[19] || (I[19] = [
                      V("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), D(He, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: I[12] || (I[12] = (y) => B(s).asking.value = !0)
                }, {
                  default: N(() => [...I[20] || (I[20] = [
                    V("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(L, { key: 1 }, [
                E(wt, null, {
                  default: N(() => [...I[21] || (I[21] = [
                    V("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(L, null, Q(B(s).programs.value, (y) => (r(), D(He, {
                  key: y.name,
                  "data-agent-program": y.name,
                  onClick: ($) => (c(), B(s).start(y))
                }, {
                  default: N(() => [
                    V(v(y.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), D(gg, {
                key: 2,
                skills: e.skills,
                onBrowse: I[13] || (I[13] = (y) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(L, { key: 3 }, [
                E(wt, null, {
                  default: N(() => [
                    V(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(L, { key: 0 }, [
                  h("p", Bg, v(B(ov)(((x = w.value) == null ? void 0 : x.last_compaction) ?? null)), 1),
                  h("div", Rg, [
                    h("span", Lg, [
                      h("span", {
                        style: ye({ width: `${C.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Ng, v(C.value) + "%", 1)
                  ]),
                  T.value ? (r(), d("p", qg, [
                    V(v(T.value) + " ", 1),
                    j.value ? (r(), D(yo, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && A.value ? (r(), d("p", Dg, v(A.value), 1)) : (r(!0), d(L, { key: 2 }, Q(i.value.choices, (y) => (r(), D(He, {
                  key: y.value,
                  "data-agent-choice": y.value,
                  onClick: ($) => (B(s).choose(i.value.key, y), c())
                }, {
                  default: N(() => [
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
}, Fg = /* @__PURE__ */ z(jg, [["__scopeId", "data-v-d7113347"]]), Wg = {
  class: "who",
  "data-agent-who": ""
}, Hg = { class: "name" }, zg = ["data-agent-state"], Ug = {
  class: "sub",
  "data-agent-started-by": ""
}, Vg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Wg, [
      h("h2", Hg, [
        h("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, zg),
        V(v(e.name), 1)
      ]),
      E(Fg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", Ug, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, Gg = /* @__PURE__ */ z(Vg, [["__scopeId", "data-v-83bd4a9d"]]), Kg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Yg = { class: "scroll" }, Xg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Qg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Jg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ur(), a = M(null), s = M(null), o = M(null), l = M(null), i = M({}), u = M({ helpers: 0, skills: 0 }), c = M(0), f = M([]), m = M([]), p = M("");
    let g = 0;
    const b = S(() => {
      var _;
      return a.value.ended_at ? bv(s.value) : `It has no task.${(_ = s.value) != null && _.instruction ? " It was given an instruction." : ""}`;
    });
    async function w() {
      const _ = ++g, j = await t.read(["usage", "inspector", lr(t.id), "--environment", t.environment]);
      _ === g && (p.value = j.ok ? "" : j.error, j.ok && (a.value = j.value.agent, s.value = j.value.facts, o.value = j.value.inspection, l.value = j.value.compaction ?? null, i.value = j.value.tool, u.value = { helpers: j.value.helpers, skills: j.value.skills }, f.value = j.value.points, m.value = j.value.programs, c.value += 1));
    }
    const C = S(() => /* @__PURE__ */ new Set([t.id])), A = {
      agent: (_) => pi(_, C.value),
      hook_call: (_) => Xc(_, "session_agent_id", C.value)
    };
    return Bn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], w, (_) => {
      var j;
      return ((j = A[_.event.split(".")[0]]) == null ? void 0 : j.call(A, _)) ?? !0;
    }), Me(w), (_, j) => {
      var F, T;
      return r(), d("article", Kg, [
        h("div", Yg, [
          p.value ? (r(), d("p", Xg, v(p.value), 1)) : a.value && o.value ? (r(), d(L, { key: 1 }, [
            E(Gg, {
              name: B(Xt)(a.value, s.value).text,
              state: B(gv)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((F = s.value) == null ? void 0 : F.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            E(cg, {
              cells: B(yv)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            E(Jv, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            E(Ev, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((T = s.value) == null ? void 0 : T.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            E(og, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            E(Fv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: B(kv)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Qg, "Ended " + v(B(In)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), D(nt, { key: 2 }))
        ])
      ]);
    };
  }
}, pE = /* @__PURE__ */ z(Jg, [["__scopeId", "data-v-b88512f5"]]);
function Zg(e) {
  const t = M(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
}
const ey = ["data-comment-id"], ty = {
  key: 0,
  class: "comment-top"
}, ny = { class: "comment-mark" }, ay = {
  class: "comment-body",
  "data-comment": ""
}, sy = { class: "comment-foot" }, oy = {
  key: 1,
  "data-comment-lost": ""
}, ly = {
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
      e.comment.quote ? (r(), d("div", ty, [
        h("span", ny, v(e.comment.number), 1),
        h("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", ay, v(e.comment.body), 1),
      h("div", sy, [
        e.comment.created_at ? (r(), D(et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", oy, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, ey));
  }
}, fr = /* @__PURE__ */ z(ly, [["__scopeId", "data-v-a37d4507"]]);
var ei;
/Mac|iPhone|iPad/.test(((ei = navigator.userAgentData) == null ? void 0 : ei.platform) || navigator.platform);
function mr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const iy = {
  class: "comment-box",
  "data-comment-box": ""
}, ry = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, uy = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, cy = { class: "comment-row" }, dy = ["placeholder"], fy = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Bt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Bt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Yt(e, "draft"), l = M(""), i = M(!1), u = M(null), c = S(() => {
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
          await a.send(g), o.value = "", await Ne(), m();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (g, b) => (r(), d("div", iy, [
      e.selection ? (r(), d("div", ry, [
        b[3] || (b[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        E(Ma, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (w) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", uy, v(l.value), 1)) : k("", !0),
      h("div", cy, [
        ke(h("textarea", {
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
          onKeydown: b[2] || (b[2] = Ue((w) => B(mr)(w, p), ["enter"]))
        }, null, 42, dy), [
          [Ye, o.value]
        ]),
        E(me, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: N(() => [...b[4] || (b[4] = [
            V("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, my = /* @__PURE__ */ z(fy, [["__scopeId", "data-v-41d2081c"]]), Vn = (e) => e ? e.split(", ") : [];
function hy({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function py(e, t) {
  return {
    reads: Vn(e.reads_allowed),
    runs: Vn(e.runs_allowed),
    missing: [...Vn(e.reads_missing), ...Vn(e.runs_missing)],
    ask: t
  };
}
const vy = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = ti("SkeletonParts", !0);
      return r(!0), d(L, null, Q(e.parts, (u, c) => (r(), d(L, { key: c }, [
        (r(!0), d(L, null, Q(u.count, (f) => (r(), D(tn, {
          key: f,
          value: u.shape
        }, {
          line: N(() => [
            E(cn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: N(() => [
            E(cn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: N(() => [
            E(cn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: N(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: N(() => [
            h("div", {
              class: "skeleton-row",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: N(() => [
            h("div", {
              class: "skeleton-stack",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: N(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: N(() => [
            h("div", {
              class: "skeleton-grid",
              style: ye(s(u))
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
}), gy = /* @__PURE__ */ z(vy, [["__scopeId", "data-v-fa8baeaf"]]), yy = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, by = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", yy, [
      E(gy, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, bo = /* @__PURE__ */ z(by, [["__scopeId", "data-v-52f66b64"]]), hr = {
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
}, ky = { class: "bars" }, wy = { class: "bar-name" }, $y = { class: "bar-value" }, xy = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = S(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", ky, [
      (r(!0), d(L, null, Q(e.items, (u, c) => (r(), D(Je(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: N(() => [
          h("span", wy, v(u.label), 1),
          E(Hi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", $y, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Sy = /* @__PURE__ */ z(xy, [["__scopeId", "data-v-663427f4"]]), _y = { class: "bars" }, My = {
  key: 0,
  class: "bars-title"
}, Cy = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", _y, [
      e.node.title ? (r(), d("span", My, v(e.node.title), 1)) : k("", !0),
      E(Sy, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Ey = /* @__PURE__ */ z(Cy, [["__scopeId", "data-v-7135bb11"]]), Ay = {
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
      style: ye(o.value)
    }, [
      (r(!0), d(L, null, Q(e.node.children || [], (u, c) => (r(), D(gr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, pr = /* @__PURE__ */ z(Ay, [["__scopeId", "data-v-d142a3f4"]]), Oy = {
  key: 0,
  class: "card-head"
}, Ty = { class: "card-title" }, Iy = {
  key: 0,
  class: "card-note"
}, By = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Oy, [
        h("span", Ty, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Iy, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      E(pr, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Ry = /* @__PURE__ */ z(By, [["__scopeId", "data-v-67b72d40"]]), Ly = { class: "fact" }, Ny = { class: "fact-label" }, qy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Ly, [
      h("span", Ny, v(e.label), 1),
      E(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Dy = /* @__PURE__ */ z(qy, [["__scopeId", "data-v-3a88ecf8"]]), Py = { class: "list" }, jy = { class: "list-label" }, Fy = {
  key: 1,
  class: "list-note"
}, Wy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Py, [
      (r(!0), d(L, null, Q(e.items, (o, l) => (r(), D(Je(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: N(() => [
          h("span", jy, v(o.label), 1),
          o.badge ? (r(), D(yo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", Fy, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Hy = /* @__PURE__ */ z(Wy, [["__scopeId", "data-v-ebe2ae0a"]]), kn = (e, t = 40) => e.length > t ? `${e.slice(0, t - 1)}…` : e;
async function Qt(e, t, n) {
  n(await nr(e) ? `Copied ${t || kn(e)}` : "The browser did not allow copying");
}
function vE({ word: e = "Delete", name: t, remove: n, restore: a = null, erase: s = !1 }) {
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
const Ya = Symbol.for("journal.context-place"), Dt = {
  mounted(e, t) {
    e[Ya] = t.value;
  },
  updated(e, t) {
    e[Ya] = t.value;
  },
  unmounted(e) {
    delete e[Ya];
  }
}, zy = { class: "table" }, Uy = {
  key: 0,
  class: "table-row empty"
}, Vy = {
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
          { label: "Copy number", group: "copy", run: ({ say: u }) => Qt(String(l.cells[0] ?? ""), "", u) },
          { label: "Copy row", group: "copy", run: ({ say: u }) => Qt(i, "the row", u) }
        ]
      };
    };
    return (l, i) => (r(), d("div", zy, [
      h("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (r(!0), d(L, null, Q(e.columns, (u) => (r(), d("span", {
          key: u,
          class: "cell"
        }, v(u), 1))), 128))
      ], 4),
      (r(!0), d(L, null, Q(e.rows, (u, c) => ke((r(), D(Je(u.open ? "button" : "div"), {
        key: c,
        type: u.open ? "button" : void 0,
        class: Y(["table-row", u.tone, { opens: u.open }]),
        style: ye(s.value),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: N(() => [
          (r(!0), d(L, null, Q(u.cells, (f, m) => (r(), d("span", {
            key: m,
            class: "cell"
          }, v(f), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"])), [
        [B(Dt), () => o(u)]
      ])), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Uy, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, vr = /* @__PURE__ */ z(Vy, [["__scopeId", "data-v-07aa7ad1"]]), Gy = { class: "stat-value" }, Ky = { class: "stat-label" }, Yy = {
  key: 0,
  class: "stat-note"
}, Xy = {
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
    return (a, s) => (r(), D(Je(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: N(() => [
        h("span", Gy, v(e.value), 1),
        h("span", Ky, v(e.label), 1),
        e.note ? (r(), d("span", Yy, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Qy = /* @__PURE__ */ z(Xy, [["__scopeId", "data-v-ad0db6d6"]]), Jy = { class: "code" }, Zy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = S(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), D(tn, { value: s.value }, {
      group: N(() => [
        E(pr, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: N(() => [
        E(Ry, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: N(() => [
        h("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: N(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: N(() => [
        E(Qy, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: N(() => [
        E(Ey, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: N(() => [
        E(vr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: N(() => [
        E(Hy, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: N(() => [
        E(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: N(() => [
        E(Dy, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: N(() => [
        E(yo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: N(() => [
        h("pre", Jy, [
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
}), gr = /* @__PURE__ */ z(Zy, [["__scopeId", "data-v-b9156b43"]]), e0 = { class: "dashboard" }, t0 = { class: "trail" }, n0 = ["onClick"], a0 = {
  key: 0,
  class: "gone",
  role: "status"
}, s0 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = M(!!n.page && !s(n.page)), l = M(n.page && !o.value ? [n.page] : []), i = S(() => l.value.at(-1) || n.document.start), u = S(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (p, g) => (r(), d("div", e0, [
      e.document.broken ? (r(), D(xt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: N(() => [
          V(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), D(xt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: N(() => [
          V(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(L, { key: 2 }, [
        h("nav", t0, [
          h("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (b) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(L, null, Q(l.value, (b, w) => (r(), d(L, {
            key: `${w}-${b}`
          }, [
            g[2] || (g[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: Y(["step", { current: w === l.value.length - 1 }]),
              onClick: (C) => m(w + 1)
            }, v(c(b)), 11, n0)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", a0, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        E(en, {
          name: "page",
          mode: "out-in"
        }, {
          default: N(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              E(gr, {
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
}, o0 = /* @__PURE__ */ z(s0, [["__scopeId", "data-v-fbe83734"]]);
function l0(e, t) {
  const n = it(), a = Zs(e, hr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), tt(() => {
    s(), a.cancel();
  });
}
const i0 = {
  key: 0,
  class: "window-failure"
}, r0 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = it(), o = M(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? l0(l, n.events) : Qs(l, () => !0, hr.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", i0, v(o.value.error), 1)) : o.value ? (r(), D(o0, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, u0 = 1e4;
class c0 {
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
    return this.heardAt !== null && t - this.heardAt > u0;
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
const d0 = {
  key: 0,
  class: "frame-note"
}, f0 = {
  key: 0,
  class: "frame-note"
}, m0 = ["src", "title"], h0 = 1e3, p0 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = it(), a = M(null), s = M(!1), o = M(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new c0(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, h0);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", d0, "This window was closed because it stopped answering.")) : (r(), d(L, { key: 1 }, [
      s.value ? (r(), d("div", f0, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        E(me, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: N(() => [...c[1] || (c[1] = [
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
      }, null, 8, m0)
    ], 64));
  }
}, v0 = /* @__PURE__ */ z(p0, [["__scopeId", "data-v-32a49046"]]), g0 = {
  class: "allowance-prompt",
  role: "dialog"
}, y0 = { class: "allowance-prompt-text" }, b0 = { class: "allowance-prompt-buttons" }, k0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", g0, [
      h("p", y0, v(B(hy)(e.request)), 1),
      h("div", b0, [
        E(me, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            V("Allow", -1)
          ])]),
          _: 1
        }),
        E(me, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            V("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, w0 = /* @__PURE__ */ z(k0, [["__scopeId", "data-v-cad69fe2"]]), Xa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), D(xt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: N(() => [
        V(v(e.reason) + " ", 1),
        e.retry ? (r(), D(me, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            V("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), D(me, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            V("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, $0 = ["data-window", "data-agent"], x0 = {
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
    const n = e, a = t, s = M(""), o = M(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = _e(id, null), u = bf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: S(() => n.options),
      declared: n.declared,
      page: _e(hf, null),
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
    Gs(Le, u), he(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Me(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Pu((m) => (s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => $a(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), D(w0, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), D(Xa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), D(Xa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(L, { key: 4 }, [
        (r(), D(c, { key: o.value })),
        e.skeleton.length && !B(u).answered.value ? (r(), D(bo, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), D(Xa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, $0));
  }
}, dn = /* @__PURE__ */ z(x0, [["__scopeId", "data-v-c4443e2b"]]), yr = {
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
    const n = e, a = t, s = { render: () => $a(v0, { src: n.entry.entry_url }) };
    return (o, l) => (r(), D(dn, {
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
}, S0 = ["data-window"], br = {
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
    const n = e, a = t, s = ot(null), o = M("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, xc();
          } catch (i) {
            if (wc(i) && $c(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      E(bo, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, S0)) : (r(), D(dn, {
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
}, _0 = {
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
    const n = t, a = e, s = S(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = S(() => s.value && { render: () => $a(r0, { line: s.value.line, events: s.value.events }) }), l = M(null), i = S(() => {
      var p, g;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), u = S(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = S(
      () => {
        var p, g;
        return l.value ? py(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
        var p, g;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, g) => {
      var b, w;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), D(bo, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((w = s.value) == null ? void 0 : w.shows) === "one-agent" && e.agent === null ? (r(), D(xt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), D(dn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), D(br, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (C, A) => n("option", C, A))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), D(yr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (C, A) => n("option", C, A))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), D(dn, {
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
        onOption: g[2] || (g[2] = (C, A) => n("option", C, A))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), D(dn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (C) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, M0 = ["data-section"], C0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, E0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _e(oo, null), a = S(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = S(() => ({ row: t.row }));
    return (o, l) => B(n) ? (r(!0), d(L, { key: 0 }, Q(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), D(_0, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", C0, v(i.name) + " is not available", 1))
    ], 8, M0))), 128)) : k("", !0);
  }
}, Bs = /* @__PURE__ */ z(E0, [["__scopeId", "data-v-a47d36b7"]]), A0 = { class: "rail-head" }, O0 = { key: 0 }, T0 = {
  key: 1,
  class: "rail-none"
}, I0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", A0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", O0, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(L, { key: 0 }, Q(e.comments, (a) => (r(), D(fr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", T0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, B0 = /* @__PURE__ */ z(I0, [["__scopeId", "data-v-4d684649"]]), R0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, L0 = ["aria-pressed"], N0 = ["aria-pressed"], q0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, D0 = {
  key: 0,
  role: "alert"
}, P0 = {
  key: 1,
  class: "sidebar-none"
}, j0 = ["data-question-id"], F0 = { class: "question-state" }, W0 = ["data-question-show", "onClick"], H0 = {
  key: 0,
  class: "sidebar-none"
}, z0 = {
  key: 1,
  class: "question-answer"
}, U0 = {
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
      h("nav", R0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, L0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, N0)
      ]),
      e.mode === "comments" ? (r(), d(L, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), D(B0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        E(En, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", q0, [
        e.failure ? (r(), d("p", D0, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", P0, "No questions about this text yet.")),
        (r(!0), d(L, null, Q(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", F0, v(B(vn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, W0),
            s.quote ? (r(), d(L, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", H0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", z0, "Answered: " + v(s.answer), 1)) : k("", !0),
            E(Bs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            E(co, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, j0);
        }), 128))
      ]))
    ], 2));
  }
}, fl = /* @__PURE__ */ z(U0, [["__scopeId", "data-v-660e5c85"]]), V0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, G0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Zt({ abstract: n.row.abstract, body: n.row.body }), o = M("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), D(An, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: N(() => [
        h("span", V0, v(o.value), 1),
        E(me, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: N(() => [...u[6] || (u[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        E(me, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: N(() => [...u[7] || (u[7] = [
            V("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: N(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: ge(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            ke(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Ye, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            ke(h("textarea", {
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
}, K0 = /* @__PURE__ */ z(G0, [["__scopeId", "data-v-464d77a8"]]);
function kr(e, t) {
  const n = M([]), a = M(!1), s = M(null), o = M(0), l = M(!1), i = M("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: w, id: C, title: A } = e(), _ = `On ${w} ${C}, ${A}: `;
    return b.text.startsWith(_) ? b.text.slice(_.length) : b.text;
  };
  async function m(b = 1) {
    const { term: w, id: C } = e();
    if (!C) return;
    const A = ++c;
    l.value = !0, i.value = "";
    try {
      const _ = await t([w, "comments", String(C), "--page", String(b), "--page-size", "25"]);
      if (A !== c) return;
      if (!_.ok) {
        i.value = _.error;
        return;
      }
      const j = _.value.rows ?? [], F = b === 1 ? j : [...n.value, ...j];
      n.value = [...new Map(F.map((T) => [T.id, T])).values()], o.value = _.value.total ?? n.value.length, s.value = _.value.next_page ?? null;
    } catch (_) {
      A === c && (i.value = _.message);
    } finally {
      A === c && (l.value = !1);
    }
  }
  async function p(b) {
    var T;
    const { term: w, id: C } = e(), A = `${w}:${C}`, _ = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, _], o.value++, a.value = !0;
    const j = await t([w, "comment", String(C), b]);
    if (A !== `${e().term}:${e().id}`) return;
    if (!j.ok)
      throw n.value = n.value.filter((G) => G.id !== _.id), o.value = Math.max(0, o.value - 1), new Error(j.error);
    await m();
    const F = (T = j.value) == null ? void 0 : T.id;
    F && !n.value.some((G) => G.id === F) && (n.value = [...n.value, { ..._, id: F }]);
  }
  const g = () => !l.value && s.value && m(s.value);
  return he(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: g, nextPage: s, total: o, loading: l, failure: i };
}
function Y0(e, t) {
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
const X0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, Q0 = ["datetime"], J0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Z0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, eb = {
  key: 2,
  class: "document-none"
}, tb = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), o = M(""), l = S(() => s.value ? Y0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", X0, [
      e.editing ? (r(), D(me, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (m) => a("close-revision"))
      }, {
        default: N(() => [...f[1] || (f[1] = [
          V("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(L, { key: 1 }, [
        (r(!0), d(L, null, Q(e.revisions, (m) => (r(), D(me, {
          key: m.number,
          variant: "text",
          "data-text-revision": m.number,
          onClick: (p) => i(m)
        }, {
          default: N(() => [
            V("Revision " + v(m.number) + ": " + v(m.change) + " · " + v(m.author_name) + " · ", 1),
            h("time", {
              datetime: m.created_at
            }, v(m.created_at.slice(0, 16).replace("T", " ")), 9, Q0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", J0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(L, { key: 1 }, [
          E(me, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: N(() => [...f[2] || (f[2] = [
              V("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", Z0, [
            (r(!0), d(L, null, Q(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: Y(["revision-line", m.type])
            }, v(m.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", eb, "No revisions"))
    ]));
  }
}, nb = /* @__PURE__ */ z(tb, [["__scopeId", "data-v-3a381aa4"]]), ab = "button, [data-comment-number]", sb = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function wr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(ab) || n.push(t.currentNode);
  return n;
}
function ml(e, t, n) {
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
const ob = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function lb(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = wr(e), s = a.map((c) => c.data).join(""), o = ml(a, n.startContainer, n.startOffset), l = s.slice(o, ml(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: ob(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function ib(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function rb(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Qa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function ub({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function cb(e, t) {
  const n = wr(e), a = ib(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = rb(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(ub).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Qa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Qa(t.number, t.id, t.label)) : l.at(-1).append(Qa(t.number, t.id, t.label))), !0;
}
function db(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !cb(e, a) && a.id && n.push(a.id);
  return n;
}
const fb = (e) => e.closest(sb) ?? e;
function hl(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const mb = {
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
    const a = e, s = n, o = M(null), l = M(null), i = M(null), u = M(!1), c = M(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const w = a.comments.filter((j) => j.quote).map((j) => ({ ...j, label: a.annotationLabel, hot: j.id === a.hot })), C = db(l.value, a.pending ? [...w, { ...a.pending, pending: !0 }] : w);
      s("lost", C);
      const A = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!A) {
        c.value = null;
        return;
      }
      const _ = document.createElement("div");
      _.className = "inline-comment", fb(A).after(_), c.value = _;
    }
    function m() {
      if (!l.value) return;
      const w = lb(l.value);
      if (u.value = !!w, !w) {
        i.value = null;
        return;
      }
      const C = window.getSelection().getRangeAt(0).getBoundingClientRect(), A = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(C.left - A.left, 0)}px`, top: `${C.top - A.top + o.value.scrollTop}px` }, s("select", w);
    }
    function p(w) {
      const C = w.target.closest("[data-comment-number]");
      C ? s("number", Number(C.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function g(w) {
      var C;
      (C = l.value.querySelector(`[data-comment="${w}"]`)) == null || C.scrollIntoView({ block: "center" });
    }
    function b(w) {
      var C;
      (C = l.value.querySelectorAll("h3, h4, h5, h6")[w]) == null || C.scrollIntoView({ block: "start" });
    }
    return he(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Me(() => {
      f(), document.addEventListener("selectionchange", m);
    }), tt(() => document.removeEventListener("selectionchange", m)), t({ show: g, showHeading: b, nextTick: Ne }), (w, C) => (r(), d("div", {
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
        style: ye(i.value),
        "data-comment-pill": "",
        onMousedown: C[0] || (C[0] = ge(() => {
        }, ["prevent"])),
        onClick: C[1] || (C[1] = (A) => s("write"))
      }, [
        E(oe, {
          name: "chat",
          size: 13
        }),
        C[2] || (C[2] = V("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), D(Cn, {
        key: 1,
        to: c.value
      }, [
        ne(w.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ne(w.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, hb = /* @__PURE__ */ z(mb, [["__scopeId", "data-v-a92386e6"]]), pb = { class: "document-tabs" }, vb = ["aria-pressed"], gb = { class: "document-body" }, yb = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, bb = {
  key: 1,
  class: "document-loading"
}, kb = {
  class: "document-details",
  "data-resource-fields": ""
}, wb = 760, $b = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _e(gi, M(null)), a = M(null), s = Zg(a), o = S(() => s.value !== null && s.value < wb), l = M(null), i = M(""), u = M([]), c = M([]), f = M(""), m = M("comments"), p = M("text"), g = M(0), b = M(!1), w = M(0), C = M([]), A = M(null), _ = M(""), j = M(!1), F = M(null), T = M(null);
    let G = 0;
    const P = kr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (pe) => t.read(pe)), I = S(() => hl(P.comments.value)), q = S(() => m.value === "questions" ? hl(c.value) : I.value), U = S(() => m.value === "questions" ? q.value.length : P.total.value), x = S(() => {
      var pe;
      return (pe = l.value) != null && pe.body ? ho(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), y = S(() => {
      var pe;
      return (((pe = l.value) == null ? void 0 : pe.body) ?? "").split(`
`).filter((ie) => /^#{1,4} /.test(ie)).map((ie, ae) => ({ key: String(ae), value: ae, label: ie.replace(/^#+ /, "") }));
    }), $ = S(() => I.value.find((pe) => pe.id === w.value)), O = S(() => {
      var pe;
      return (pe = l.value) != null && pe.close_reason ? "Closed" : "Open";
    }), R = S(() => p.value === "comments" && !o.value ? "text" : p.value), W = (pe) => pe.ok ? pe.value.rows ?? [] : [];
    async function K() {
      const pe = ++G, ie = await t.read([t.term, "inspect", String(t.id)]);
      if (pe !== G) return;
      i.value = ie.ok ? "" : ie.error, l.value = ie.ok ? ie.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), be = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      pe === G && (c.value = W(ae), f.value = ae.ok ? "" : ae.error, u.value = be ? W(be) : []);
    }
    async function Z(pe) {
      const ie = A.value ? ["--quote", A.value.quote, "--position", String(A.value.position), "--selection-type", A.value.selection_type] : [], ae = await t.read([t.term, "comment", String(t.id), ...ie, "--", pe]);
      if (!ae.ok) throw new Error(ae.error);
      A.value = null, await Promise.all([K(), P.load()]);
    }
    async function le() {
      const pe = await t.read(["doc", "close", String(t.id)]);
      i.value = pe.ok ? "" : pe.error, pe.ok && await K();
    }
    function ce() {
      _.value.trim() || (A.value = null);
    }
    async function $e(pe) {
      var ie;
      if (g.value = pe, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        w.value = w.value === pe ? 0 : pe;
        return;
      }
      b.value = !0, await Ne(), (ie = a.value.querySelector(m.value === "questions" ? `[data-question-id="${pe}"]` : `[data-comment-id="${pe}"]`)) == null || ie.scrollIntoView({ block: "nearest" });
    }
    async function Ee(pe) {
      var ie, ae;
      p.value = "text", g.value = pe, await ((ie = F.value) == null ? void 0 : ie.nextTick()), (ae = F.value) == null || ae.show(pe);
    }
    function ze() {
      j.value = !1, K();
    }
    return he(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", b.value = !1, g.value = 0, w.value = 0, A.value = null, c.value = [], f.value = "", K();
    }, { immediate: !0 }), he(m, () => {
      g.value = 0, w.value = 0;
    }), (pe, ie) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), D(Cn, {
        key: 0,
        to: B(n),
        disabled: !B(n)
      }, [
        h("span", {
          class: Y(["document-actions", { placed: B(n) }]),
          "data-document-actions": ""
        }, [
          E(me, {
            bordered: "",
            "data-text-edit": "",
            onClick: ie[0] || (ie[0] = (ae) => j.value = !0)
          }, {
            default: N(() => [...ie[15] || (ie[15] = [
              V("Edit", -1)
            ])]),
            _: 1
          }),
          R.value === "text" && y.value.length > 1 ? (r(), D(to, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: y.value,
            "data-text-chapters": "",
            onPick: ie[1] || (ie[1] = (ae) => {
              var be;
              return (be = F.value) == null ? void 0 : be.showHeading(ae.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", pb, [
        h("button", {
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "text" }]),
          "data-document-tab": "text",
          onClick: ie[2] || (ie[2] = (ae) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ie[3] || (ie[3] = (ae) => p.value = "comments")
        }, [
          V(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(U.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: ie[4] || (ie[4] = (ae) => b.value = !b.value)
        }, [
          V(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(U.value || ""), 1)
        ], 10, vb)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ie[5] || (ie[5] = (ae) => p.value = "revisions")
        }, [
          ie[16] || (ie[16] = V("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      h("div", gb, [
        i.value ? (r(), d("p", yb, v(i.value), 1)) : l.value ? R.value === "revisions" ? (r(), D(nb, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: le,
          onRestored: K
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : R.value === "comments" ? (r(), D(fl, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": ie[6] || (ie[6] = (ae) => m.value = ae),
          tab: "",
          comments: I.value,
          questions: c.value,
          hot: g.value,
          lost: C.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!B(P).nextPage.value,
          "comment-loading": B(P).loading.value,
          "comment-failure": B(P).failure.value,
          "comment-total": B(P).total.value,
          onMore: B(P).loadMore,
          onShow: Ee,
          onChanged: K
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(L, { key: 4 }, [
          E(hb, {
            ref_key: "words",
            ref: F,
            html: x.value,
            comments: q.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: g.value,
            pending: A.value,
            inline: w.value,
            onSelect: ie[8] || (ie[8] = (ae) => A.value = ae),
            onClear: ce,
            onNumber: $e,
            onWrite: ie[9] || (ie[9] = (ae) => {
              var be;
              return (be = T.value) == null ? void 0 : be.focus();
            }),
            onLost: ie[10] || (ie[10] = (ae) => C.value = ae)
          }, {
            inline: N(() => [
              $.value ? (r(), D(fr, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: ie[7] || (ie[7] = (ae) => Ee($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: N(() => [
              h("dl", kb, [
                ie[18] || (ie[18] = h("h4", null, "Details", -1)),
                ie[19] || (ie[19] = h("dt", null, "State", -1)),
                h("dd", null, v(O.value), 1),
                l.value.close_reason ? (r(), d(L, { key: 0 }, [
                  ie[17] || (ie[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                ie[20] || (ie[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  E(et, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                ie[21] || (ie[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  E(et, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), D(fl, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": ie[11] || (ie[11] = (ae) => m.value = ae),
            comments: I.value,
            questions: c.value,
            hot: g.value,
            lost: C.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!B(P).nextPage.value,
            "comment-loading": B(P).loading.value,
            "comment-failure": B(P).failure.value,
            "comment-total": B(P).total.value,
            onMore: B(P).loadMore,
            onShow: Ee,
            onChanged: K
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", bb, [
          E(nt)
        ]))
      ]),
      l.value ? (r(), D(my, {
        key: 1,
        ref_key: "composer",
        ref: T,
        draft: _.value,
        "onUpdate:draft": ie[12] || (ie[12] = (ae) => _.value = ae),
        selection: A.value,
        send: Z,
        narrow: o.value,
        onClear: ie[13] || (ie[13] = (ae) => A.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      j.value ? (r(), D(K0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: ie[14] || (ie[14] = (ae) => j.value = !1),
        onSaved: ze
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, gE = /* @__PURE__ */ z($b, [["__scopeId", "data-v-f9bd78a7"]]), xb = {
  key: 1,
  class: "row-list-failure"
}, Sb = ["data-row"], _b = {
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
    const t = e, n = S(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = M(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), D(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", xb, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), D(xt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: N(() => [
        V(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(L, { key: 3 }, [
      (r(), D(Je(e.arrival || e.moves ? Ks : "ul"), De(n.value, { class: "row-list" }), {
        default: N(() => [
          (r(!0), d(L, null, Q(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ne(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Sb))), 128))
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
}, Mb = /* @__PURE__ */ z(_b, [["__scopeId", "data-v-e9f251f3"]]), Cb = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Eb = {
  key: 1,
  class: "agent-rows-note"
}, Ab = {
  key: 2,
  class: "agent-rows-note"
}, Ob = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Tb = ["data-agent-row", "onClick"], Ib = { class: "agent-row-name" }, Bb = { class: "agent-row-state" }, Rb = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = S(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", Cb, [
      e.loaded ? e.failure ? (r(), d("p", Eb, v(e.failure), 1)) : e.rows.length ? (r(), d(L, { key: 3 }, [
        h("p", Ob, v(a.value) + " running", 1),
        (r(!0), d(L, null, Q(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(Fe)(`agents:${l.id}`)
        }, [
          h("span", Ib, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Bb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Tb))), 128))
      ], 64)) : (r(), d("p", Ab, v(e.none), 1)) : (r(), D(nt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, yE = /* @__PURE__ */ z(Rb, [["__scopeId", "data-v-a01e5a17"]]), vt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Xe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ke = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Lb = 6;
function ko(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Nb = (e) => {
  const t = ko(e, vt.lineChars), n = Math.max(vt.minWidth, Math.max(...t.map((a) => a.length)) * vt.charWidth + vt.padX * 2);
  return { name: e, lines: t, line: vt.line, padY: vt.padY, width: n, height: t.length * vt.line + vt.padY * 2 };
};
function qb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Db(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Pb(e, t, n) {
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
  for (let l = 0; l < Lb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function jb(e, t) {
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
function Fb(e) {
  const t = [...new Set(e.flatMap(([F, T]) => [F, T]))], n = new Set(e.map(([, F]) => F)), a = t.filter((F) => !n.has(F)), s = qb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((F, T) => !s.has(T)), l = Db(t, o), i = Pb(t, o, l), u = new Map(t.map((F) => [F, Nb(F)])), c = i.map((F) => F.reduce((T, G) => T + u.get(G).width, 0) + Ke.across * (F.length - 1)), f = Math.max(...c) + Ke.margin * 2, m = Hb(e, l, i.length), p = /* @__PURE__ */ new Map();
  let g = Ke.margin;
  i.forEach((F, T) => {
    let G = (f - c[T]) / 2;
    const P = Math.max(...F.map((I) => u.get(I).height));
    F.forEach((I) => {
      const q = u.get(I);
      p.set(I, { ...q, x: G, y: g + (P - q.height) / 2 }), G += q.width + Ke.across;
    }), g += P + (m[T] ?? Ke.down);
  });
  const b = e.map(([F, T, G], P) => ({ from: F, to: T, label: G || "", back: s.has(P) || l.get(T) <= l.get(F) }));
  jb(b, p);
  const w = b.map((F) => zb(F, p.get(F.from), p.get(F.to))), C = [...p.values()], A = Kb(w, C), _ = Math.max(g - Ke.down, ...A.filter((F) => F.label).map((F) => F.label.y + F.label.height));
  return { width: Math.max(f - Ke.margin, ...A.filter((F) => F.label).map((F) => F.label.x + F.label.width)) + Ke.margin, height: _ + Ke.margin, nodes: C, arrows: A };
}
const Wb = (e) => e ? ko(e, Xe.lineChars).length * Xe.line + Xe.pad * 2 : 0;
function Hb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ke.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += Wb(l) + Ke.labelSpace);
  }), a.map((s) => Math.max(Ke.down, s));
}
function zb(e, t, n) {
  const a = e.label ? ko(e.label, Xe.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Xe.charWidth + Xe.pad * 2 : 0, o = a.length * Xe.line + (a.length ? Xe.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Ub = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Vb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Gb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Xe.line);
function Kb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Ub(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Gb.flatMap((u) => Vb.map((c) => s(c, u))).find((u) => !n.some((c) => pl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => pl(i, u)); ) i.y += Xe.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Xe.line, pad: Xe.pad } };
  });
}
const pl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Yb = { class: "flowchart-tools" }, Xb = ["width", "height", "viewBox", "aria-label"], Qb = ["d"], Jb = ["x", "y", "width", "height"], Zb = ["x", "y"], ek = ["x", "dy"], tk = {
  key: 0,
  class: "flowchart-label"
}, nk = ["x", "y", "width", "height"], ak = ["x", "y"], sk = ["x", "dy"], ok = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Fb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = M(null), i = M({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var A;
      const w = (A = l.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(w != null && w.width)) return;
      const C = Math.min(w.width / s.value.width, w.height / s.value.height, 1.5);
      i.value = { zoom: C, x: (w.width - s.value.width * C) / 2, y: (w.height - s.value.height * C) / 2 };
    }
    function f(w, C, A) {
      const { zoom: _, x: j, y: F } = i.value, T = Math.min(o.most, Math.max(o.least, _ * w));
      i.value = { zoom: T, x: C - (C - j) * T / _, y: A - (A - F) * T / _ };
    }
    function m(w) {
      const C = l.value.getBoundingClientRect();
      f(w, C.width / 2, C.height / 2);
    }
    function p(w) {
      const C = l.value.getBoundingClientRect();
      w.ctrlKey || w.metaKey ? f(w.deltaY < 0 ? o.step : 1 / o.step, w.clientX - C.left, w.clientY - C.top) : i.value = { ...i.value, x: i.value.x - w.deltaX, y: i.value.y - w.deltaY };
    }
    function g(w) {
      var C, A, _;
      w.preventDefault(), (C = window.getSelection()) == null || C.removeAllRanges(), u = { x: w.clientX - i.value.x, y: w.clientY - i.value.y }, (_ = (A = l.value).setPointerCapture) == null || _.call(A, w.pointerId);
    }
    function b(w) {
      u && (i.value = { ...i.value, x: w.clientX - u.x, y: w.clientY - u.y });
    }
    return Me(c), (w, C) => (r(), D(An, {
      padded: "",
      title: e.title,
      large: "",
      onClose: C[4] || (C[4] = (A) => a("close"))
    }, {
      default: N(() => [
        h("div", Yb, [
          E(me, {
            small: "",
            onClick: C[0] || (C[0] = (A) => m(o.step))
          }, {
            default: N(() => [...C[5] || (C[5] = [
              V("Zoom in", -1)
            ])]),
            _: 1
          }),
          E(me, {
            small: "",
            onClick: C[1] || (C[1] = (A) => m(1 / o.step))
          }, {
            default: N(() => [...C[6] || (C[6] = [
              V("Zoom out", -1)
            ])]),
            _: 1
          }),
          E(me, {
            small: "",
            onClick: c
          }, {
            default: N(() => [...C[7] || (C[7] = [
              V("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: ge(p, ["prevent"]),
          onPointerdown: g,
          onPointermove: b,
          onPointerup: C[2] || (C[2] = (A) => Do(u) ? u.value = null : u = null),
          onPointercancel: C[3] || (C[3] = (A) => Do(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (r(!0), d(L, null, Q(s.value.arrows, (A, _) => (r(), d("path", {
              key: `arrow-${_}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Qb))), 128)),
            (r(!0), d(L, null, Q(s.value.nodes, (A) => (r(), d("g", {
              key: A.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: A.x,
                y: A.y,
                width: A.width,
                height: A.height,
                rx: "8"
              }, null, 8, Jb),
              h("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (r(!0), d(L, null, Q(A.lines, (_, j) => (r(), d("tspan", {
                  key: j,
                  x: A.x + A.width / 2,
                  dy: j ? A.line : 0
                }, v(_), 9, ek))), 128))
              ], 8, Zb)
            ]))), 128)),
            (r(!0), d(L, null, Q(s.value.arrows, (A, _) => (r(), d(L, {
              key: `label-${_}`
            }, [
              A.label ? (r(), d("g", tk, [
                h("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, nk),
                h("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (r(!0), d(L, null, Q(A.label.lines, (j, F) => (r(), d("tspan", {
                    key: F,
                    x: A.label.x + A.label.width / 2,
                    dy: F ? A.label.line : 0
                  }, v(j), 9, sk))), 128))
                ], 8, ak)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Xb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lk = /* @__PURE__ */ z(ok, [["__scopeId", "data-v-e98799dc"]]), ik = ["innerHTML"], rk = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => Go[t.name] || Go.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, ik));
  }
}, St = /* @__PURE__ */ z(rk, [["__scopeId", "data-v-beb5935c"]]), uk = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      E(St, { name: "fold" })
    ], 2));
  }
}, an = /* @__PURE__ */ z(uk, [["__scopeId", "data-v-d03899bb"]]), ck = ["data-tip", "aria-label"], dk = {
  key: 0,
  class: "mact-word"
}, fk = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      E(St, { name: "open" }),
      e.open ? (r(), d("span", dk, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, ck));
  }
}, $r = /* @__PURE__ */ z(fk, [["__scopeId", "data-v-3b292e09"]]), xr = 120, na = 280, Sr = 160, mk = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, hk = ["leaving", "resizing", "entering"];
function Rs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function pk(e) {
  const t = hk.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Rs(e);
  return e.classList.add(...t), n;
}
function _r(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = M(t()), s = M("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const g = pk(m);
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
    if (!p || !p.offsetWidth || mk()) {
      a.value = m;
      return;
    }
    const b = Rs(p);
    if (l(p, b), s.value = "leaving", await n(xr), g !== o) return;
    a.value = m, s.value = "resizing", await Ne(), u(p, b);
    const w = c(p);
    await n(na), w == null || w.disconnect(), g === o && (i(p), s.value = "entering", await n(Sr), g === o && (s.value = ""));
  }
  return he(t, (m) => f(m)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const vk = { class: "growing-card-top" }, gk = ["aria-expanded"], yk = { class: "growing-card-avatar" }, bk = { class: "growing-card-title" }, kk = { class: "growing-card-more" }, wk = { class: "growing-card-body" }, $k = {
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
    const n = e, a = t, s = M(!1), o = M(null), { folded: l, phase: i } = _r(o, () => !s.value), u = S(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = S(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", vk, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", yk, [
            e.bad ? (r(), D(St, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(L, { key: 1 }, [
              V(v(u.value), 1)
            ], 64)) : (r(), D(oe, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", bk, v(e.title), 1),
          E(an, { open: s.value }, null, 8, ["open"])
        ], 8, gk),
        e.action ? (r(), D($r, {
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
          E(oe, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", kk, [
        h("div", wk, [
          (r(!0), d(L, null, Q(c.value, (p, g) => (r(), d("p", {
            key: g,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, xk = /* @__PURE__ */ z($k, [["__scopeId", "data-v-f2b4930d"]]), Sk = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, _k = { class: "md inline" }, Mk = ["disabled", "title", "onClick"], Ck = {
  key: 1,
  class: "message-links-many"
}, Ek = ["aria-expanded"], Ak = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Ok = ["disabled", "onClick"], Tk = { class: "row-pill message-links-chip" }, Ik = { class: "message-links-title" }, Bk = { key: 0 }, Ja = 3, Rk = "task", Lk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.total || n.links.length), o = S(() => n.links.every((p) => p.endpoint.model === Rk) ? "tasks" : "items"), l = M(!1), i = M(null);
    bi(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Fe(p.endpoint.open_ref));
    }
    return (p, g) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ja, three: s.value === Ja, open: l.value }]),
      "data-message-links": ""
    }, [
      E(St, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Sk, [
        h("span", _k, [
          g[1] || (g[1] = V("Linked: ", -1)),
          (r(!0), d(L, null, Q(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (w) => m(b)
          }, [
            V(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(L, { key: 0 }, [
              V(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(L, { key: 1 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, Mk))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ja ? (r(), d("span", Ck, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          V(v(s.value) + " linked " + v(o.value) + " ", 1),
          E(an, { open: l.value }, null, 8, ["open"])
        ], 8, Ek)
      ])) : k("", !0),
      l.value ? (r(), d("div", Ak, [
        (r(!0), d(L, null, Q(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (w) => m(b)
        }, [
          h("span", Tk, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          h("span", Ik, v(b.endpoint.title), 1),
          h("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", Bk, "Unavailable")) : k("", !0)
        ], 8, Ok))), 128))
      ])) : k("", !0),
      E(En, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Nk = /* @__PURE__ */ z(Lk, [["__scopeId", "data-v-843fc3bd"]]), qk = ["title", "aria-label"], Dk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Pk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, jk = {
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
      (r(), d("svg", Dk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Pk)) : k("", !0)
      ]))
    ], 10, qk));
  }
}, Fk = /* @__PURE__ */ z(jk, [["__scopeId", "data-v-6dc92808"]]), Wk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Hk = (e) => e.worker_id != null ? "report" : "message", zk = (e) => Wk[Hk(e)], Uk = "img,pre,table";
function Vk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Gk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Kk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Uk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Vk(Gk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Yk(e, t) {
  let n = null;
  const a = () => e.value && Kk(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const vl = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Xk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Gn = /* @__PURE__ */ new WeakMap(), Pe = "work", st = "sent", Qk = 50, gl = 50, yl = () => ({ rows: M([]), total: M(0), next: M(null), loading: M(!1), failure: M(""), version: 0 });
function Jk(e) {
  var w;
  if (Gn.has(e)) return Gn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (C) => {
    var A;
    return ((A = e.visible) == null ? void 0 : A.value) !== !1 && [...C.views].some((_) => _.visible);
  };
  function o(C, A) {
    const _ = C[A], j = ++_.version;
    return _.loading.value = !0, _.failure.value = "", j;
  }
  function l(C, A, _, j, F) {
    const T = C[A];
    if (t.get(C.id) !== C || T.version !== _) return;
    if (T.loading.value = !1, !F.ok) {
      T.failure.value = F.error;
      return;
    }
    const G = A === Pe ? F.value.counterparts ?? [] : F.value.rows ?? [], P = j === 1 ? G : [...T.rows.value, ...G], I = A === Pe ? (q) => `${q.endpoint.model}:${q.endpoint.id}` : (q) => q.id ?? q.target_id;
    T.rows.value = [...new Map(P.map((q) => [I(q), q])).values()], T.total.value = F.value.total ?? T.rows.value.length, T.next.value = F.value.next_page ?? null;
  }
  function i(C, A, _, j) {
    const F = C[A];
    F.version === _ && (F.failure.value = j.message, F.loading.value = !1);
  }
  async function u(C, A, _) {
    const j = o(C, A), F = A === Pe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(C, A, j, _, await e.read(`link list --source message:${C.id} ${F} --page ${_} --page-size ${A === Pe ? 10 : 25}`));
    } catch (T) {
      i(C, A, j, T);
    }
  }
  async function c(C) {
    const A = C.map((_) => ({ [Pe]: o(_, Pe), [st]: o(_, st) }));
    try {
      const _ = await e.read(`link receipts --messages ${C.map((j) => j.id).join(",")}`);
      C.forEach((j, F) => {
        const T = _.ok ? _.value.messages[String(j.id)] : null;
        l(j, Pe, A[F][Pe], 1, _.ok ? { ok: !0, value: T.named } : _), l(j, st, A[F][st], 1, _.ok ? { ok: !0, value: T.sent } : _);
      });
    } catch (_) {
      C.forEach((j, F) => [Pe, st].forEach((T) => i(j, T, A[F][T], _)));
    }
  }
  function f() {
    a = null;
    const C = [...n].map((A) => t.get(A)).filter((A) => A && s(A));
    n.clear(), C.forEach((A) => A.dirty.clear());
    for (let A = 0; A < C.length; A += gl) c(C.slice(A, A + gl));
  }
  function m(C, A = [Pe, st]) {
    for (const _ of A) C.dirty.add(_);
    s(C) && (n.add(C.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(C) {
    const A = C.sources ?? (C.source_model && Number.isInteger(C.source_id) ? [{ model: C.source_model, id: C.source_id }] : []), _ = C.link_types ?? (C.link_type ? [C.link_type] : []), j = _.length ? [Pe, st].filter((T) => T === Pe ? _.some((G) => ["about", "edited"].includes(G)) : _.includes("sent_to")) : [Pe, st];
    if (!j.length) return;
    const F = A.length ? [...new Set(A.filter((T) => T.model === "message").map((T) => T.id))].map((T) => t.get(T)).filter(Boolean) : [...t.values()].filter(s).slice(0, Qk);
    for (const T of F) m(T, j);
  }
  const g = (w = e.follow) == null ? void 0 : w.call(e, ["link.*"], p), b = {
    attach(C, A) {
      let _ = t.get(C);
      return _ || (_ = { id: C, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Pe, st]), work: yl(), sent: yl() }, t.set(C, _)), _.views.add(A), _.dirty.size && m(_, [..._.dirty]), _;
    },
    shown(C) {
      C.dirty.size && m(C, [...C.dirty]);
    },
    detach(C, A) {
      C.views.delete(A), C.views.size || t.delete(C.id), t.size || (clearTimeout(a), g == null || g(), Gn.delete(e));
    },
    more(C, A) {
      const _ = C == null ? void 0 : C[A];
      if (_ != null && _.next.value && !_.loading.value) return u(C, A, _.next.value);
    }
  };
  return Gn.set(e, b), b;
}
function Zk(e, t, n) {
  const a = ot(null);
  let s = null;
  const o = he(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Jk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = he(n, (g) => {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Pe),
    loadSent: () => s == null ? void 0 : s.more(a.value, st)
  };
}
const ew = ["data-incoming", "data-ref"], tw = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], nw = { class: "message-body" }, aw = ["title"], sw = ["innerHTML"], ow = ["innerHTML"], lw = {
  class: "message-faces",
  "data-message-faces": ""
}, iw = ["title", "data-face", "onClick"], rw = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, uw = ["title", "data-reaction", "onClick"], cw = {
  key: 0,
  class: "message-reaction-count"
}, dw = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, fw = ["href", "title"], mw = ["src", "alt"], hw = ["href"], pw = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, vw = { class: "message-foot" }, gw = { class: "message-time" }, yw = {
  class: "message-id",
  "data-message-id": ""
}, bw = 1500, kw = "An earlier message", ww = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = M(null), l = S(() => ["user", "comment"].includes(n.message.type)), i = S(() => {
      const [ae, be] = (n.message.commented_row || ":").split(":"), H = kt(ae);
      return H ? { ref: `${H}:${be}`, label: `${nn(H).title.toLowerCase()} ${be}` } : null;
    }), u = S(() => n.message.worker_id ?? null), c = S(() => zk(n.message)), f = S(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ae;
      await ((ae = navigator.clipboard) == null ? void 0 : ae.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, bw);
    }
    const p = Ki(), g = S(() => p(n.message.text ?? "")), b = S(() => JSON.parse(n.message.flowchart_edges || "[]")), w = M(!1), C = S(() => Os(n.quote)), A = S(() => p(C.value || kw));
    function _() {
      const ae = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ae ? ae.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Yk(o, () => `${n.message.text} ${C.value}`);
    const j = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, F = (ae) => `/api/files/message/${n.message.id}/${encodeURIComponent(ae)}`, T = S(() => JSON.parse(n.message.captions || "{}")), G = S(() => (n.message.files ?? []).map((ae) => ({ name: ae, address: F(ae), isImage: j.test(ae), title: T.value[ae] || ae }))), P = S(() => ir(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), I = _e(Le, null), { links: q, total: U, more: x, loading: y, failure: $, sentTo: O, sentMore: R, sentLoading: W, sentFailure: K, loadMore: Z, loadSent: le } = Zk(I, () => l.value && !n.message.local ? n.message.id : null, o), ce = M(!1), $e = S(() => Xk(n.message.reactions)), Ee = S(() => Number.isInteger(n.message.id)), ze = () => `${location.href.split("#")[0]}#open=messages:${n.message.id}`, pe = () => ({
      head: kn(n.message.text ?? "", 40),
      items: [
        { label: "Reply", group: "open", disabled: !Ee.value, reason: "Not sent yet", run: () => a("reply", n.message) },
        { label: "React", group: "open", disabled: !Ee.value, reason: "Not sent yet", children: vl.map((ae) => ({ label: ae, run: () => a("react", n.message, ae) })) },
        { label: "Copy text", group: "copy", run: ({ say: ae }) => Qt(n.message.text ?? "", "the message", ae) },
        { label: "Copy link", group: "copy", disabled: !Ee.value, reason: "Not sent yet", run: ({ say: ae }) => Qt(ze(), "the link", ae) },
        { label: "Pin to the top of the chat", disabled: !Ee.value || !I, reason: "Not sent yet", run: async ({ say: ae }) => {
          const be = await I.run(["pin", "make", kn(n.message.text ?? "", 60) || `Message ${n.message.id}`, "--link", `messages:${n.message.id}`]);
          ae(be.ok ? "Pinned" : be.error);
        } }
      ]
    });
    function ie(ae) {
      ce.value = !1, a("react", n.message, ae);
    }
    return (ae, be) => e.message.peer || e.message.recipient ? ke((r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      E(xk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: be[0] || (be[0] = (H) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ew)), [
      [B(Dt), pe]
    ]) : ke((r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", nw, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: be[5] || (be[5] = (...H) => B(Ut) && B(Ut)(...H))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: be[1] || (be[1] = ge((H) => B(Fe)(i.value.ref), ["stop"]))
          }, [
            E(oe, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, aw)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ge(_, ["stop"]),
            innerHTML: A.value
          }, null, 8, sw)) : k("", !0),
          u.value !== null ? (r(), D(yn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: be[2] || (be[2] = ge((H) => B(Fe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: N(() => [
              V("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          E(Wi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: N(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: g.value
              }, null, 8, ow)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(L, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: be[3] || (be[3] = (H) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (r(), D(lk, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: be[4] || (be[4] = (H) => w.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: Y(["message-tools", { picking: ce.value }]),
          "data-message-tools": ""
        }, [
          ce.value ? (r(), d(L, { key: 0 }, [
            h("div", lw, [
              (r(!0), d(L, null, Q(B(vl), (H) => (r(), d("button", {
                key: H,
                type: "button",
                class: "message-face",
                title: `React ${H}`,
                "data-face": H,
                onClick: (J) => ie(H)
              }, v(H), 9, iw))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: be[6] || (be[6] = (H) => ce.value = !1)
            }, [
              E(oe, {
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
              onClick: be[7] || (be[7] = (H) => ce.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: be[8] || (be[8] = (H) => a("reply", e.message))
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
              onClick: be[9] || (be[9] = (H) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      $e.value.length ? (r(), d("div", rw, [
        (r(!0), d(L, null, Q($e.value, (H) => (r(), d("button", {
          key: H.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: H.mine }]),
          title: H.title,
          "data-reaction": H.emoji,
          onClick: (J) => a("react", e.message, H.emoji)
        }, [
          V(v(H.emoji) + " ", 1),
          H.count > 1 ? (r(), d("span", cw, v(H.count), 1)) : k("", !0)
        ], 10, uw))), 128))
      ])) : k("", !0),
      G.value.length ? (r(), d("div", dw, [
        (r(!0), d(L, null, Q(G.value, (H) => (r(), d(L, {
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
            }, null, 8, mw)
          ], 8, fw)) : (r(), d("a", {
            key: 1,
            href: H.address,
            target: "_blank",
            class: "message-file"
          }, v(H.name), 9, hw))
        ], 64))), 128))
      ])) : k("", !0),
      B(O).length ? (r(), d("div", pw, [
        E(oe, {
          name: "send",
          size: 12
        }),
        (r(!0), d(L, null, Q(B(O), (H) => (r(), D(yn, {
          key: H.id,
          as: "button",
          "agent-id": H.id,
          label: `Worker ${H.id}`,
          class: "message-sent-worker",
          disabled: H.unavailable || !H.open_ref,
          "data-sent-worker": H.id,
          onClick: ge((J) => H.open_ref && B(Fe)(H.open_ref), ["stop"])
        }, {
          default: N(() => [
            V("Also sent to worker " + v(H.id), 1),
            H.unavailable ? (r(), d(L, { key: 0 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      E(En, {
        more: B(R),
        loading: B(W),
        failure: B(K),
        label: "More recipients",
        onMore: B(le)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", vw, [
        h("time", gw, v(P.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(L, { key: 0 }, [
          be[10] || (be[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", yw, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), D(Fk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      B(q).length || B($) ? (r(), D(Nk, {
        key: 3,
        links: B(q),
        total: B(U),
        more: B(x),
        loading: B(y),
        failure: B($),
        onMore: B(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, tw)), [
      [B(Dt), pe]
    ]);
  }
}, bE = /* @__PURE__ */ z(ww, [["__scopeId", "data-v-7241010f"]]), ha = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Za = 200, Mr = (e) => {
  var t;
  return ((t = ha.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ha[0].key;
}, kE = (e) => {
  var t;
  return ((t = ha.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, $w = ["aria-label"], xw = 300, bl = 400, Sw = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Za } },
  setup(e) {
    const t = e, n = S(() => Mr(t.value)), a = S(() => n.value < Za ? [1, 0.25, 0.25] : n.value === Za ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= bl, high: n.value >= xw && n.value < bl }]),
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
        style: ye({ opacity: a.value[0] })
      }, null, 4),
      h("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ye({ opacity: a.value[1] })
      }, null, 4),
      h("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ye({ opacity: a.value[2] })
      }, null, 4)
    ], 10, $w));
  }
}, wE = /* @__PURE__ */ z(Sw, [["__scopeId", "data-v-b10e610f"]]), Cr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], $E = (e) => {
  const t = Cr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, _w = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, kl = (e) => _w[e.card.state] || "idle", Mw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), wl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, $l = (e, t) => wl[kl(e)] - wl[kl(t)], xl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, xE = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => $l(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Mw(a, s)) : [...e].sort((a, s) => $l(a, s) || (xl[t] || xl.state)(a, s)), Cw = { class: "list-row" }, Ew = {
  key: 0,
  class: "list-row-type"
}, Aw = { class: "list-row-main" }, Ow = {
  key: 0,
  class: "list-row-title"
}, Tw = { class: "list-row-body" }, Iw = {
  key: 1,
  class: "list-row-end"
}, Bw = {
  key: 1,
  class: "list-row-line"
}, Rw = {
  key: 2,
  class: "list-row-text"
}, Lw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Cw, [
      e.type ? (r(), d("span", Ew, v(e.type), 1)) : k("", !0),
      h("div", Aw, [
        e.title ? (r(), d("span", Ow, v(e.title), 1)) : k("", !0),
        h("div", Tw, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", Iw, [
          ne(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      t.$slots.text ? (r(), d("div", Bw, [
        ne(t.$slots, "text", {}, void 0, !0)
      ])) : e.text ? (r(), d("span", Rw, v(e.text), 1)) : k("", !0)
    ]));
  }
}, Nw = /* @__PURE__ */ z(Lw, [["__scopeId", "data-v-f1b2d4cf"]]), SE = {
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
    return (l, i) => (r(), D(to, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, qw = {
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
}, Ls = /* @__PURE__ */ z(qw, [["__scopeId", "data-v-978e0921"]]), Dw = ["aria-label"], Pw = { class: "head" }, jw = { class: "names" }, Fw = { class: "body" }, Ww = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ti(a, n), i = Ii(s);
    return (u, c) => (r(), D(Cn, { to: "body" }, [
      E(en, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: N(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = ge((...f) => B(o) && B(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(L, { key: 0 }, [
                h("header", Pw, [
                  h("div", jw, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), D(ct, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ne(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ne(u.$slots, "actions", {}, void 0, !0),
                  E(Ma, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), D(Ls, { key: 0 }, {
                  default: N(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", Fw, [
                  ne(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), D(Ls, {
                  key: 1,
                  class: "below"
                }, {
                  default: N(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ne(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Dw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, _E = /* @__PURE__ */ z(Ww, [["__scopeId", "data-v-d0a677ef"]]), Hw = {
  key: 1,
  class: "text-field-label"
}, zw = {
  key: 2,
  class: "text-field-end"
}, Uw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Bt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Yt(e, "modelValue"), a = xa(), s = "onUpdate:modelValue" in (((f = ju()) == null ? void 0 : f.vnode.props) || {}), o = S(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = S(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = S(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = M(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: m.$slots.end }, B(a).class]),
      style: ye(B(a).style)
    }, [
      e.icon ? (r(), D(oe, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", Hw, v(e.label), 1)) : k("", !0),
      ke(h("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(Cs), o.value]
      ]),
      m.$slots.end ? (r(), d("span", zw, [
        ne(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : ke((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [B(Cs), o.value]
    ]);
  }
}), Vw = /* @__PURE__ */ z(Uw, [["__scopeId", "data-v-d9c38ca8"]]), Gw = {
  class: "page-header",
  "data-page-header": ""
}, Kw = { class: "page-title" }, Yw = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, Xw = { class: "page-header-end" }, Qw = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", Gw, [
      h("h1", Kw, [
        V(v(e.title), 1),
        e.count !== null ? (r(), d("span", Yw, v(e.count), 1)) : k("", !0)
      ]),
      h("span", Xw, [
        ne(t.$slots, "primary", {}, void 0, !0),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, Jw = /* @__PURE__ */ z(Qw, [["__scopeId", "data-v-78e5d537"]]);
function Er(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function ME(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const CE = () => ({}), pa = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), Ar = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, Or = (e) => !!(e != null && e.values.length), EE = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), Zw = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function Tr(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => e2(o, l, n[l.key])) && (!a.trim() || Er(o, a, s)));
}
function e2(e, t, n) {
  if (!Or(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const t2 = { class: "filter-ways" }, n2 = { class: "filter-count" }, a2 = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(L, null, [
      h("div", t2, [
        E(Lt, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(L, null, Q(e.field.options, ([m, p]) => (r(), D(He, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (g) => u(m)
      }, {
        default: N(() => [
          V(v(p) + " ", 1),
          h("span", n2, v(B(Zw)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, Ir = /* @__PURE__ */ z(a2, [["__scopeId", "data-v-4e84eb6e"]]), s2 = ["data-filter-chip"], o2 = ["aria-expanded"], l2 = {
  key: 0,
  "data-filter-value": ""
}, i2 = ["aria-label"], r2 = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), o = S(() => Or(n.modelValue)), l = S(() => !Ar(n.field, n.modelValue)), i = S(() => n.modelValue.values.map((f) => {
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
        o.value ? (r(), d("b", l2, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : k("", !0),
        E(oe, {
          name: "caret",
          size: 10
        })
      ], 8, o2),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        E(oe, {
          name: "close",
          size: 9
        })
      ], 8, i2)) : k("", !0),
      s.value ? (r(), D(Pt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = ge(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: N(() => [
          E(Ir, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, s2));
  }
}, u2 = /* @__PURE__ */ z(r2, [["__scopeId", "data-v-0cc7efe6"]]), c2 = {
  class: "search-bar",
  "data-search-bar": ""
}, d2 = { class: "search-bar-control" }, f2 = ["value", "placeholder", "aria-label"], m2 = ["aria-expanded"], h2 = {
  key: 0,
  "data-menu-count": ""
}, p2 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var A;
    const a = e, s = n, o = Fu(), l = ((A = _e(Le, null)) == null ? void 0 : A.search) ?? {}, i = S(() => l.placeholder || a.placeholder), u = l.context ?? [], c = M(null), f = M(null), m = M([]), p = S(() => m.value.length ? m.value[m.value.length - 1].next : u), g = S(() => !!o.menu || u.length > 0), b = (_) => {
      m.value = [], f.value = f.value ? null : _.currentTarget;
    };
    function w(_) {
      if (_.next.length) {
        m.value = [...m.value, _];
        return;
      }
      f.value = null, s("pick", _.click);
    }
    function C() {
      var _;
      s("update:modelValue", ""), (_ = c.value) == null || _.focus();
    }
    return t({ focus: () => {
      var _;
      return (_ = c.value) == null ? void 0 : _.focus();
    } }), (_, j) => {
      var F;
      return r(), d("div", c2, [
        h("div", d2, [
          E(oe, {
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
            onInput: j[0] || (j[0] = (T) => s("update:modelValue", T.target.value)),
            onKeydown: Ue(C, ["esc"])
          }, null, 40, f2),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: C
          }, [
            E(oe, {
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
            e.menuCount ? (r(), d("span", h2, v(e.menuCount), 1)) : k("", !0),
            E(oe, {
              name: "caret",
              size: 12
            })
          ], 8, m2)) : k("", !0)
        ]),
        (F = B(l).button) != null && F.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: j[1] || (j[1] = (T) => s("pick", B(l).button.click))
        }, v(B(l).button.title), 1)) : k("", !0),
        ne(_.$slots, "default", {}, void 0, !0),
        f.value ? (r(), D(Pt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: j[3] || (j[3] = ge(() => {
          }, ["stop"])),
          onClose: j[4] || (j[4] = (T) => f.value = null)
        }, {
          default: N(() => [
            m.value.length ? (r(), D(He, {
              key: 0,
              "data-search-back": "",
              onClick: j[2] || (j[2] = (T) => m.value = m.value.slice(0, -1))
            }, {
              default: N(() => [
                V("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(L, null, Q(p.value, (T) => (r(), D(He, {
              key: T.title,
              description: T.subtext,
              "data-search-entry": T.title,
              onClick: (G) => w(T)
            }, {
              default: N(() => [
                V(v(T.title) + v(T.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ne(_.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Br = /* @__PURE__ */ z(p2, [["__scopeId", "data-v-45374bed"]]), v2 = ["aria-expanded"], g2 = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, y2 = 72, b2 = {
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
    const n = e, a = t, s = M(null), o = M(null), l = M([]), i = S(() => n.fields.filter((g) => l.value.includes(g.key))), u = S(() => n.fields.some((g) => !Ar(g, n.modelValue[g.key])) || !!n.words.trim()), c = (g, b) => a("update:modelValue", { ...n.modelValue, [g]: b }), f = () => {
      a("update:modelValue", pa(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await Ne();
      const g = s.value.clientWidth;
      g && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter((b) => b.offsetLeft + b.offsetWidth > g - y2).map((b) => b.dataset.filterChip));
    }
    let p = null;
    return Me(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Re(() => p == null ? void 0 : p.disconnect()), he(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (g, b) => (r(), D(Br, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": b[3] || (b[3] = (w) => a("update:words", w))
    }, {
      default: N(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(L, null, Q(e.fields, (w) => ke((r(), D(u2, {
            key: w.key,
            field: w,
            rows: e.rows,
            "model-value": e.modelValue[w.key] ?? null,
            "onUpdate:modelValue": (C) => c(w.key, C)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [Ys, !l.value.includes(w.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(L, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: b[0] || (b[0] = (w) => o.value = o.value ? null : w.currentTarget)
          }, "More", 8, v2),
          o.value ? (r(), D(Pt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: b[1] || (b[1] = ge(() => {
            }, ["stop"])),
            onClose: b[2] || (b[2] = (w) => o.value = null)
          }, {
            default: N(() => [
              (r(!0), d(L, null, Q(i.value, (w) => (r(), d(L, {
                key: w.key
              }, [
                E(wt, null, {
                  default: N(() => [
                    V(v(w.label), 1)
                  ]),
                  _: 2
                }, 1024),
                E(Ir, {
                  field: w,
                  rows: e.rows,
                  "model-value": e.modelValue[w.key] ?? null,
                  "onUpdate:modelValue": (C) => c(w.key, C)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : k("", !0)
        ], 64)) : k("", !0),
        u.value ? (r(), d(L, { key: 1 }, [
          e.shown !== null ? (r(), d("span", g2, v(e.shown) + " of " + v(e.rows.length), 1)) : k("", !0),
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
}, Rr = /* @__PURE__ */ z(b2, [["__scopeId", "data-v-6580d498"]]), k2 = { class: "title" }, w2 = { class: "state" }, $2 = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ws(t.line, t.events);
    return (o, l) => (r(), D(Mb, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: N(({ row: i }) => [
        h("span", k2, v(i.title), 1),
        h("span", w2, v(B(vn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, AE = /* @__PURE__ */ z($2, [["__scopeId", "data-v-6be0c59e"]]);
function x2(e = 1e3, t = null) {
  const n = M(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const es = M(Date.now() / 1e3);
let Sl = 0, Kn = 0;
function wo() {
  return Kn || (es.value = Date.now() / 1e3, Sl = setInterval(() => es.value = Date.now() / 1e3, 1e3)), Kn += 1, ni() && _a(() => {
    Kn -= 1, Kn || clearInterval(Sl);
  }), es;
}
const S2 = 200, _2 = xr + na + Sr + S2, M2 = 300, Yn = /* @__PURE__ */ new WeakMap();
function C2(e, t) {
  const n = Yn.get(e) ?? [];
  Yn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Yn.get(e);
    Yn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, M2);
}
function on(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function E2(e, t, n) {
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
function A2(e, t, n, a) {
  he(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(E2(o, l, n.value)), performance.now() - l < _2) return void requestAnimationFrame(u);
        C2(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const O2 = ["title", "data-figure-mark", "data-folded", "data-open"], T2 = {
  key: 2,
  class: "worker"
}, I2 = { class: "head" }, B2 = { key: 0 }, R2 = {
  key: 3,
  class: "status"
}, L2 = {
  key: 0,
  class: "figure"
}, N2 = {
  key: 1,
  class: "ran-for"
}, q2 = { key: 2 }, D2 = {
  key: 3,
  class: "news"
}, P2 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, j2 = {
  key: 6,
  class: "settled"
}, F2 = {
  key: 1,
  class: "bar"
}, W2 = {
  key: 3,
  class: "detail body"
}, H2 = {
  key: 0,
  class: "body-label"
}, z2 = ["title"], U2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = xa(), a = ["onClick", "onAct"], s = S(() => Object.fromEntries(Object.entries(n).filter(([ce]) => !a.includes(ce)))), o = M(!1), l = S(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = S(() => t.open !== void 0), u = S(() => i.value || l.value), c = S(() => i.value ? t.open : o.value), f = S(() => i.value ? !t.open : l.value && !o.value), m = S(() => !!(t.mark.action && n.onAct)), p = S(() => u.value || m.value || !!n.onClick), g = M(null), b = M(null), { folded: w, phase: C } = _r(g, () => f.value);
    A2(g, f, C, _e(Le, null));
    function A(ce) {
      var $e, Ee;
      if (!(ce.target !== g.value && !b.value.contains(ce.target))) {
        if (i.value) return ($e = n.onClick) == null ? void 0 : $e.call(n, ce);
        if (l.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(ce);
      }
    }
    const _ = (ce) => n.onAct(ce), j = ["failed", "unfinished"], F = S(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? j.includes(t.mark.state) ? "danger" : "good" : ""), T = S(() => t.mark.color ? t.mark.color : F.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : F.value ? `var(--tone-${F.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = S(() => T.value || "var(--tone-work)"), P = S(() => !t.mark.ending && !t.mark.ended && F.value !== "stopped"), I = wo(), q = S(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? rr(I.value - t.mark.began_at) : ""
    ), U = S(() => {
      const { started: ce, ended: $e } = t.mark;
      return ce ? $e ? `ran ${dl($e - ce, !0)}` : dl(I.value - ce, !0) : q.value;
    }), x = ["bad", "danger", "warn"], y = S(() => x.includes(F.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], O = S(() => $.includes(F.value)), R = S(() => y.value === "process" ? "running" : O.value ? "cross" : F.value === "stopped" ? "stopped" : F.value === "good" ? "tick" : ""), W = S(
      () => !!(t.mark.figure || U.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), K = S(() => t.mark.markIcon ? { component: St, props: { class: "ico", name: t.mark.markIcon } } : { component: oe, props: { name: t.mark.icon || "dot" } }), Z = S(() => [t.mark.title, t.mark.time ? ir(t.mark.time) : ""].filter(Boolean).join(" · ")), le = S(() => ({
      ...T.value ? { "--mark": T.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ce, $e) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${y.value}`,
        B(C),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: T.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: le.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": B(w) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: A
    }), [
      (r(), D(Je(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: N(() => [
          e.mark.agentId ? (r(), D(yn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: N(() => [
              (r(), D(Je(K.value.component), ks(ai(K.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), D(Je(K.value.component), ks(De({ key: 1 }, K.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", T2, v(e.mark.worker), 1)) : k("", !0),
          h("span", I2, [
            E(ct, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", B2, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), D(an, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          W.value ? (r(), d("span", R2, [
            e.mark.figure ? (r(), d("span", L2, v(e.mark.figure), 1)) : k("", !0),
            U.value ? (r(), d("span", N2, v(U.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", q2, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", D2, v(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (r(), d("span", P2)) : R.value ? (r(), D(St, {
              key: 5,
              class: Y(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", j2, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), D($r, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: ge(_, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (r(), d("span", F2, [
        h("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !B(w) ? (r(), D(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !B(w) ? (r(), d("div", W2, [
        e.mark.bodyLabel ? (r(), d("p", H2, v(e.mark.bodyLabel), 1)) : k("", !0),
        E(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !B(w) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, z2)) : k("", !0),
      e.mark.card ? (r(), D(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ne(ce.$slots, "default", {
        shown: !B(w)
      }, void 0, !0)
    ], 16, O2));
  }
}), Lr = /* @__PURE__ */ z(U2, [["__scopeId", "data-v-6e839007"]]), V2 = 8, G2 = 40, K2 = [];
class $o {
  constructor(t, n, { top: a = V2, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && K2.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new $o(t, {
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
    n > G2 && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Ne(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Ne();
  }
}
const Y2 = 60, X2 = 300, Nr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function qr(e, t) {
  const n = M([]), a = M(0);
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
  const c = new $o("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => X2, more: () => a.value > 0, previous: u }, { top: Y2 });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const Q2 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Dr(e) {
  var n;
  const t = Q2[e] || ((n = nn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const J2 = (e) => Dr(String(e).split(":")[0]), Z2 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), e$ = "agents", t$ = { passed: "good", failed: "danger", warned: "warn", running: "" }, n$ = { good: "good", warn: "warn", danger: "danger" }, _l = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Pm(e.target_model, e.target_id || 0)
}, a$ = { "open row": (e) => J2(e.target_model), "open page": () => Dr("pages") };
function s$(e, t) {
  const n = t || {}, a = _l[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? t$[e.outcome] || "" : n$[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === e$ ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? a$[a](e) : "",
    handlers: a ? { onAct: () => _l[a](e) } : {}
  };
}
const o$ = 24, l$ = 1e3, Ml = 2e3, i$ = 0.25, r$ = 5e3;
function u$(e, t = o$, n = () => !0) {
  const a = M(!1), s = M(0), o = M(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const F = c();
    return F ? F.scrollHeight - F.scrollTop - F.clientHeight : 0;
  }, m = () => !c() || f() <= t;
  function p(F) {
    if (clearTimeout(l), !F) {
      o.value = !1, u = Date.now();
      return;
    }
    const T = Date.now() - u < Ml ? Ml : l$;
    l = setTimeout(() => o.value = a.value, T);
  }
  function g() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(F = !1) {
    const T = c();
    T && F && T.scrollTo ? T.scrollTo({ top: T.scrollHeight, behavior: "smooth" }) : T && (T.scrollTop = T.scrollHeight), g();
  }
  function w() {
    A(), !a.value && (a.value = !0, p(!0));
  }
  const C = () => !!c() && f() <= c().clientHeight * i$;
  function A() {
    clearTimeout(i), C() && (i = setTimeout(() => a.value && C() && n() && b(!0), r$));
  }
  function _() {
    m() ? g() : w();
  }
  function j(F = 1, T = !1) {
    a.value ? s.value += Math.max(0, F) : b(T);
  }
  return ni() && _a(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: g, toBottom: b, left: w, scrolled: _, arrived: j };
}
const c$ = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, d$ = (e) => String(e ?? "").replace(c$, ""), f$ = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), { away: o, scrolled: l, arrived: i, toBottom: u } = u$(s);
    he(
      () => [n.lines, n.lines.length],
      () => Ne(() => {
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
      V(v(B(d$)(e.lines.join(`
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
}, m$ = /* @__PURE__ */ z(f$, [["__scopeId", "data-v-89621acd"]]), h$ = "*.*", p$ = {
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
    const t = e, n = _e(Le, null), a = new hi();
    he(
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
      events: l.value ? [h$] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), D(br, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), D(yr, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, v$ = { class: "mark-more-inner" }, g$ = {
  class: "mark-lines",
  "data-mark-reason": ""
}, y$ = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, b$ = {
  key: 3,
  class: "mark-lines"
}, k$ = "process", Cl = "task", w$ = {
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
    const t = e, n = it(), a = S(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = S(() => Z2.has(t.mark.variant) && t.mark.detail || ""), o = S(() => t.mark.target_model === Cl ? t.mark.target_id : 0), l = qr(
      Nr(n),
      () => t.mark.target_id
    ), i = l.lines, u = M(!1), c = M(""), f = S(() => !t.declaration.body_url && t.mark.target_model === k$ && !!t.mark.target_id);
    async function m(g = l.follow) {
      const b = await g();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = S(() => t.shown && f.value);
    return he(p, (g) => g && m()), Qs(() => p.value && m(), () => p.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (g) => g && p.value && m(l.newest)
    ), (g, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = ge(() => {
      }, ["stop"]))
    }, [
      h("div", v$, [
        e.declaration.body_url ? (r(), D(p$, {
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
            h("p", g$, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", y$, v(c.value), 1)) : f.value && u.value ? (r(), d(L, { key: 2 }, [
            b[3] || (b[3] = h("p", { class: "mark-label" }, "Output", -1)),
            E(m$, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", b$, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = ge((w) => B(Fe)(`${Cl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ns = /* @__PURE__ */ z(w$, [["__scopeId", "data-v-df71b15a"]]), $$ = ["title", "aria-label", "onClick"], x$ = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, S$ = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = S(() => dm(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = M(""), s = _e(Le);
    async function o(l) {
      const i = await On(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(L, null, [
      (r(!0), d(L, null, Q(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: ge((c) => o(u), ["stop"])
      }, [
        E(St, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, $$))), 128)),
      a.value ? (r(), d("span", x$, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, _$ = /* @__PURE__ */ z(S$, [["__scopeId", "data-v-7a62c88e"]]);
function Pr(e, t) {
  const n = ot(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Oe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const jr = Pr("/api/marks", "marks"), OE = jr.fetchAll, M$ = jr.find, C$ = ["data-ref"], E$ = ["data-ref"], A$ = { class: "mark-row" }, O$ = "dock add", T$ = "questions.answer", I$ = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = S(() => M$(a.mark.type)), o = S(() => s$(a.mark, s.value)), l = S(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = S(() => l.value || !!o.value.handlers.onAct), u = S(() => a.mark.type === T$), c = M(!1);
    function f() {
      c.value = !c.value;
    }
    const m = S(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((g) => {
        var b;
        return !a.docked || !((b = g.runs) != null && b.startsWith(O$));
      }).map((g) => ({ ...g, module: s.value.module }));
    });
    return (p, g) => {
      var b, w;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        E(Ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, C$)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (w = s.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", A$, [
          E(Lr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Sa({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: N(({ shown: C }) => [
                E(Ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          E(_$, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, E$));
    };
  }
}, B$ = /* @__PURE__ */ z(I$, [["__scopeId", "data-v-424ddb61"]]), R$ = ["data-ref"], L$ = ["inert"], N$ = { class: "group-fold" }, q$ = { class: "thread-group" }, D$ = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = M(!1), a = M(!1), s = M(!1), o = M(null);
    he(n, async (i) => {
      var u;
      a.value = !0, await Ne(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
      E(Lr, {
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
        h("div", N$, [
          h("div", q$, [
            (r(!0), d(L, null, Q(e.group.marks, (c) => (r(), D(B$, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, L$)) : k("", !0)
    ], 8, R$));
  }
}, TE = /* @__PURE__ */ z(D$, [["__scopeId", "data-v-45b58b9b"]]);
function P$(e) {
  const t = M(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const j$ = { class: "chat-dock-fold" }, F$ = ["aria-label"], W$ = { class: "chat-dock-head" }, H$ = { class: "chat-dock-inner" }, z$ = { class: "chat-dock-foot" }, Fr = 700, U$ = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = M(null), a = M(null), s = P$(a), o = M(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, Fr)), tt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", j$, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ne(i.$slots, "edge", {}, void 0, !0),
          h("header", W$, [
            ne(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", H$, [
              h("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ye(B(s) === null ? null : { height: `${B(s)}px` })
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
          h("footer", z$, [
            ne(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, F$)
      ])
    ], 2));
  }
}, V$ = /* @__PURE__ */ z(U$, [["__scopeId", "data-v-cc05fdac"]]), G$ = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ts = 5, K$ = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ts, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ts}s`, animationDelay: `${(n - ts).toFixed(2)}s` };
    return (s, o) => (r(), d("span", G$, [
      h("i", { style: a })
    ]));
  }
}, Y$ = /* @__PURE__ */ z(K$, [["__scopeId", "data-v-2a7bc150"]]), X$ = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), qs = (e) => e.charAt(0).toUpperCase() + e.slice(1), Q$ = (e) => qs(e.replace(/_at$/, "").replaceAll("_", " ")), J$ = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Z$ = (e, t, n) => [qs(`${e} ${n}`), (t == null ? void 0 : t.state) && qs(t.state)].filter(Boolean).join(" · "), Wr = (e) => Xt(e).text, e5 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? Wr(t) : (e == null ? void 0 : e.name) ?? "", t5 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? Wr(t) : "", n5 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !X$.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Q$(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], a5 = { reviewing: "Under review" }, s5 = (e, t) => e || a5[t == null ? void 0 : t.state] || "", Hr = Pr("/api/docks", "docks"), IE = Hr.fetchAll, zt = Hr.find, o5 = 6, ns = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, xo = (e) => Date.parse(e.leaves_at) / 1e3, rn = (e) => !!(e.leaves_at && !e.kept), l5 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!rn(e) || t < xo(e) || n.has(e.id)), i5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => l5(a, t, n)).sort((a, s) => a.id - s.id);
function r5(e, t, n = o5) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(xo(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const u5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ds = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), c5 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), d5 = (e) => ({ ...e.kept ? Ds("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ds("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), f5 = ["keep", "unkeep", "open", "undock"], m5 = (e) => ({ ...e, iconOnly: f5.includes(e.action) });
function h5(e, t) {
  var n;
  return [
    ...c5(e, t) ? [d5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || nn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Ds("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(m5);
}
function zr(e, t) {
  const n = h5(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: u5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const p5 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || zr(e, t).title, v5 = { class: "dock-text" }, g5 = ["title"], y5 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, b5 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, k5 = {
  key: 1,
  "data-dock-row": ""
}, w5 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = S(() => zt(a.item.type)), o = wo(), l = S(() => In(a.item.created_at, o.value * 1e3)), i = M(null), u = M(null), c = M(null), f = M(null), m = S(() => zr(a.item, s.value)), p = it(), g = S(() => `dock.${a.item.id}`), b = S(() => p.props[g.value].data.value), w = S(() => p5(a.item, s.value, b.value)), C = S(() => fa(a.item.target_model ?? "")), A = S(() => {
      var y;
      return ((y = s.value) == null ? void 0 : y.word) ?? "";
    }), _ = S(() => ({ ...b.value, id: a.item.target_id, term: C.value })), j = () => {
      var y, $;
      return (($ = (y = s.value) == null ? void 0 : y.reads) == null ? void 0 : $.length) && p.reload(g.value);
    };
    ud(Gs, { data: b, reload: j, readOutput: Nr(p) }), he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (y, $, O) => {
        var W;
        j();
        const R = (W = p.followUndeclared) == null ? void 0 : W.call(p, [`${C.value.replaceAll("-", "_")}.*`], (K) => {
          (!K.row_id || K.row_id === a.item.target_id) && j();
        });
        O(() => R == null ? void 0 : R());
      },
      { immediate: !0 }
    );
    const F = M(/* @__PURE__ */ new Set()), T = M("");
    async function G(y) {
      if (y.action === "undock") return n("undock", y);
      if (y.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      y.action === "declared" && (F.value = /* @__PURE__ */ new Set([...F.value, y.label])), T.value = "";
      const O = await On(y, { id: a.item.target_id }, p.environment);
      (O == null ? void 0 : O.ok) === !1 && (F.value = new Set([...F.value].filter((R) => R !== y.label)), T.value = `Could not ${y.label.toLowerCase()}: ${O.error}`);
    }
    const P = S(() => m.value.actions.filter((y) => !F.value.has(y.label))), I = S(() => {
      var y;
      return s5((y = s.value) == null ? void 0 : y.badge, _.value);
    }), q = S(() => m.value.controls), U = S(() => {
      var y;
      return !((y = s.value) != null && y.folds && a.folded);
    }), x = S(() => {
      var y;
      return !!((y = s.value) != null && y.draws_head) && !a.collapsed;
    });
    return (y, $) => {
      var O, R, W, K;
      return r(), D(V$, {
        label: m.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (R = s.value) != null && R.needs_user ? "waiting" : "",
        folded: !!((W = s.value) != null && W.folds) && e.folded,
        body: !!((K = s.value) != null && K.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (Z) => e.collapsed && n("open"))
      }, {
        edge: N(() => [
          e.leaving && !e.item.kept ? (r(), D(Y$, {
            key: 0,
            "ends-at": B(xo)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: N(() => {
          var Z;
          return [
            x.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(L, { key: 1 }, [
              E(oe, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", v5, [
                h("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: w.value
                }, v(w.value), 11, g5)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? k("", !0) : (r(), d(L, { key: 0 }, [
                V(v(l.value), 1)
              ], 64))
            ], 512),
            q.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = ge(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(L, null, Q(q.value, (le) => {
                var ce, $e;
                return r(), d(L, {
                  key: le.action + le.runs
                }, [
                  !F.value.has(le.label) && (!((ce = le.variants) != null && ce.length) || !(($e = _.value) != null && $e.state) || le.variants.includes(_.value.state)) ? (r(), D(me, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: le.pressed }),
                    "aria-pressed": le.pressed,
                    "aria-label": le.label,
                    title: le.label,
                    "data-dock-action": le.action,
                    onClick: (Ee) => G(le)
                  }, {
                    default: N(() => [
                      E(oe, {
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
        still: N(() => [
          T.value || e.refusal ? (r(), d("p", y5, v(T.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: N(() => {
          var Z;
          return [
            h("span", b5, [
              I.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(I.value), 3)) : k("", !0),
              A.value ? (r(), d("span", k5, v(A.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (r(), D(me, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[1] || ($[1] = (le) => n("fold"))
            }, {
              default: N(() => [
                V(v(s.value.folds) + " ", 1),
                E(an, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = ge(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              U.value ? (r(), d(L, { key: 0 }, [
                E(co, {
                  name: `dock.${e.item.type}`,
                  row: _.value,
                  environment: B(p).environment,
                  "read-only": B(p).readOnly,
                  "object-name": B(fa)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (le) => T.value = le),
                  onDone: y.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(L, null, Q(P.value, (le) => (r(), D(me, {
                  key: le.action + le.runs,
                  small: "",
                  variant: le.primary ? "primary" : "ghost",
                  bordered: !le.primary,
                  "data-dock-action": le.action,
                  onClick: (ce) => G(le)
                }, {
                  default: N(() => [
                    V(v(le.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ])
          ];
        }),
        default: N(() => {
          var Z;
          return [
            (Z = s.value) != null && Z.body_url ? (r(), D(Ns, {
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
}, El = /* @__PURE__ */ z(w5, [["__scopeId", "data-v-4d692a2f"]]), $5 = 24, x5 = 8, BE = 420;
function RE({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= $5 ? !0 : e < t && s > x5 ? !1 : null;
}
const S5 = (e, t) => e === void 0 ? t : e, _5 = { me: 1, people: [] }, va = Zt({
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
  people: _5,
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
Pi("journal.activity", () => va.activity);
Pi("journal.side.mini", () => va.sideMini);
const Ur = "journal.viewer.";
function M5(e, t, n) {
  try {
    const a = n.getItem(Ur + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function C5(e, t, n) {
  try {
    n.setItem(Ur + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Al(e, t, n = window.localStorage) {
  const a = M(M5(e, t, n));
  return he(a, (s) => C5(e, s, n), { deep: !0 }), a;
}
const E5 = {
  key: "dock-all",
  class: "dock-all"
}, A5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var x, y;
    const t = e, n = x2(500), a = M(/* @__PURE__ */ new Set()), s = _e(Le), o = M(/* @__PURE__ */ new Set()), l = M({});
    async function i($, O) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const R = await On(O, { id: $.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((W) => W !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = S(
      () => i5(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = S(
      () => r5(
        u.value.filter(($) => ns($, zt)),
        n.value
      )
    ), f = S(() => u.value.filter(($) => !c.value.includes($) && !ns($, zt))), m = Al(`dock-size:${((x = va.identity) == null ? void 0 : x.root) || location.host}`, null), p = ($) => {
      var O;
      return !!((O = zt($.type)) != null && O.needs_user);
    }, g = M(/* @__PURE__ */ new Set()), b = M(/* @__PURE__ */ new Set()), w = S(() => u.value.length === 1), C = ($) => p($) || w.value, A = ($) => C($) ? g.value.has($.id) || b.value.has($.id) : m.value ? m.value.collapsed && !m.value.opened.includes($.id) : t.collapsed, _ = S(() => u.value.some(A));
    he(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []);
    });
    function j() {
      const $ = !_.value;
      m.value = { collapsed: $, opened: [] }, g.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function F($) {
      var R;
      if (!A($)) return;
      if (C($)) {
        g.value = new Set([...g.value].filter((W) => W !== $.id)), b.value = new Set([...b.value].filter((W) => W !== $.id));
        return;
      }
      const O = (R = m.value) != null && R.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...O, $.id] };
    }
    const T = Al(`dock-folded:${((y = va.identity) == null ? void 0 : y.root) || location.host}`, {}), G = ($) => {
      var O;
      return !!((O = zt($.type)) != null && O.folds) && (t.insidesFolded || S5(T.value[$.id], ns($, zt) || t.folded));
    };
    function P($) {
      G($) && I($), T.value = { ...T.value, [$.id]: !G($) };
    }
    function I($) {
      var O;
      !((O = m.value) != null && O.collapsed) || m.value.opened.includes($.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, $.id] });
    }
    function q($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function U($) {
      a.value = new Set([...a.value].filter((O) => O !== $.id));
    }
    return ($, O) => (r(), D(Ks, {
      tag: "div",
      name: "dock",
      duration: B(Fr),
      class: "dock-stack"
    }, {
      default: N(() => [
        u.value.length > 1 ? (r(), d("div", E5, [
          E(me, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": _.value ? "Open all" : "Collapse all",
            onClick: j
          }, {
            default: N(() => [
              E(an, {
                open: !_.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(L, null, Q(f.value, (R) => (r(), D(El, {
          key: R.id,
          item: R,
          class: Y({ timed: B(rn)(R) }),
          leaving: B(rn)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: A(R),
          refusal: l.value[R.id],
          onOpen: (W) => F(R),
          onFold: (W) => P(R),
          onUndock: (W) => i(R, W),
          onMouseenter: (W) => q(R),
          onMouseleave: (W) => U(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(L, null, Q(c.value, (R) => (r(), D(El, {
          key: R.id,
          item: R,
          class: Y({ timed: B(rn)(R) }),
          leaving: B(rn)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: A(R),
          refusal: l.value[R.id],
          onOpen: (W) => F(R),
          onFold: (W) => P(R),
          onUndock: (W) => i(R, W),
          onMouseenter: (W) => q(R),
          onMouseleave: (W) => U(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, LE = /* @__PURE__ */ z(A5, [["__scopeId", "data-v-ab76ae18"]]), It = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, aa = (e) => Math.min(Math.max(e, 0), 1), O5 = (e) => {
  const t = aa(e);
  return t * t * (3 - 2 * t);
}, Ct = (e, t, n) => O5((e - t) / (n - t));
function NE(e) {
  const t = aa(e), n = aa((t - 0.12) / 0.76) * It.shuffles, a = Math.min(Math.floor(n), It.shuffles - 1), s = n - a, o = Ct(s, 0.26, 0.38) * (1 - Ct(s, 0.76, 0.96)), l = Ct(s, 0.38, 0.76), i = Ct(t, 0, 0.12) * (1 - Ct(t, 0.88, 1)), u = Ct(s, 0.2, 0.34) * (1 - Ct(s, 0.84, 1)), c = Math.sin(Math.PI * aa((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / It.shuffles, lift: It.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function qE(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Ol = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, DE = (e) => Ol[e] ?? Ol.butler, So = 2400, T5 = 0.05;
function I5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, T5), l = Math.min(t + So * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function PE(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function B5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function jE(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const FE = (e, t) => ({ ...e, stretch: t.stretch }), WE = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Vr = (e, t) => t >= (e.least ?? 0);
function HE(e, t, n) {
  if (!Vr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const zE = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), R5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Tl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), L5 = (e) => e.right > e.left && e.bottom > e.top;
function UE(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(R5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = Tl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = Tl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), L5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Gr(e, t, n) {
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
}, wn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), N5 = (e) => e * e * (3 - 2 * e), Be = (e, [t, n]) => N5(wn(e, t, n)), q5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], bt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Xn = ([e, t], n) => e + n() * (t - e);
function D5(e) {
  return q5.map(() => {
    const t = Xn(bt.speed, e), n = Xn(bt.angle, e) * Math.PI / 180, a = Xn(bt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Xn(bt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const P5 = D5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function j5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * bt.gravity * (t[2] - bt.floor))) / bt.gravity;
}
function VE(e, t, n = P5) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = j5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= bt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const GE = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function KE(e, t) {
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
const YE = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Kt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function XE(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Kt.margin * n, t.right - Kt.margin * n], u = Math.min(Math.max(e + o + s * Kt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function QE(e, t, n) {
  const a = Ie.bug_smash, s = Be(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Kt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Kt.tall * n * (1 - Be(t, a.emerge)),
      turn: 90 * (1 - Be(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Be(t, a.gone)
    }
  };
}
function JE(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Kt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = I5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const We = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function ZE(e) {
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
function F5(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = B5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function eA(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = F5(n, e.length), c = e.map((A, _) => ({ ...Ps(A, t, Math.min(n / o.fps, sa(_).shot)), shot: _ < u })), f = Be(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], g = e.map((A, _) => ({ bug: A, index: _, seconds: n / o.fps - sa(_).shot, spot: Ps(A, t, sa(_).shot) })).filter((A) => A.seconds >= 0), b = g.flatMap((A) => {
    const _ = (s == null ? void 0 : s.get(A.index)) ?? V5(A.bug, t, A.spot, s ? [] : a);
    return s == null || s.set(A.index, _), s && G5(_, A.seconds, a), K5(_, A.seconds, a);
  }), w = g.filter((A) => z5(A.bug)).map((A) => ({ seconds: A.seconds, from: A.spot })), C = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: C }, slush: b, camera: w };
}
function sa(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function tA(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = sa(f), p = Ps(c, t, m.shot), g = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), w = Math.abs(p.x - u) >= g ? u : p.x + b * g, C = b > 0 ? Math.max(u, Math.min(w, i)) : Math.min(u, Math.max(w, l)), A = { from: u, to: C, begin: m.walk, end: m.aim };
    return u = C, A;
  });
}
function nA(e, t, n) {
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
const Ae = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, W5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function H5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const z5 = (e) => e.along * 97 % 1 < Ae.camera, $n = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ae.gravity * t * t });
function U5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ae.gravity * (t.bottom - e.from.y))) / Ae.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ae.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ae.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ae.step) {
    const f = Math.min(c + Ae.step, l.t), m = $n(e, f), p = Gr(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = $n(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function V5(e, t, n, a = []) {
  const s = H5(e.along + 1), [o, l] = W5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ae.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ae.spread * Math.PI / 180), c = Ae.speed[0] + s() * (Ae.speed[1] - Ae.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ae.radius[0] + s() * (Ae.radius[1] - Ae.radius[0]) };
    return { ...f, ...U5(f, t, a) };
  });
}
function G5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ae.step) {
      const l = Math.min(o + Ae.step, s), i = Gr($n(a, o), $n(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function K5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...$n(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ae.hold) / Ae.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function aA(e, t, n, a) {
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
function sA(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (w) => {
    const [C, A] = [w.x - e.at.x, w.y - e.at.y];
    return { x: i.x + C * c - A * f, y: i.y + C * f + A * c };
  }, [p, g] = [...n].sort((w, C) => w.x - C.x), b = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((w, C) => ({ from: w, to: C < b.length / 2 ? p : g })) };
}
const oA = (e, t) => Be(t, e.grows) * (1 - Be(t, e.sinks));
function ga(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: wn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: wn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function lA(e, t) {
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
const iA = (e) => e === "pack_box";
function rA(e) {
  const { into: t, out: n } = ga(Ie.rope_swing, e);
  return 1 - Be(t, [0, 1]) * (1 - Be(n, [0, 1]));
}
function uA(e) {
  const t = Ie.rope_swing, { into: n, out: a } = ga(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Be(n, [0, 1]) * (1 - Be(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Y5 = { after: 3 }, _o = 10, X5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Q5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, J5 = { weight: 19 }, Kr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Z5 = { every: 120 }, Yr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Xr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, ex = {
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
}, Rn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: _o }), re = (e, t, n = {}) => Rn(e, "clip", t, n), as = (e, t, n = {}) => Rn(e, "look", t, n), Il = (e, t, n = {}) => Rn(e, "gaze", t, n), we = (e, t, n = {}, a = {}) => ({ ...Rn(e, "pick", t, n), ...a }), Se = (e) => Rn("nothing", "nothing", e, {}), tx = 120, nx = 300, ss = (e, t) => ({ ...re(e, t), cooldown: nx }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), ax = () => [re("joy", 2)], Et = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), At = (e) => ({ ...e, cooldown: X5[e.name] }), ln = (e) => ({ ...e, shenanigan: !0, lasts: Q5[e.name] }), Oa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), Se(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...At(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...At(re("bug_smash", 2)), toward: "", onto: !1 },
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
  ...fe("reported", { cooldown: 90 }, [Il("read", 3), re("nod", 1), Se(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Il("read", 3), Se(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), Se(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), Se(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, ax()),
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
  ...fe("pondering", { cooldown: [30, 60] }, [we("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [we("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [we("bulb", 1)]),
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
  ...Object.entries(ex).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [as(t, 1)])),
  ...Object.entries(Yr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Xr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    Et("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Et("rest", 3, 180, 120),
    Et("yawn", 2, 60, 60),
    Et("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Et("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Et("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Et("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...ln(At(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    ln(At(re("disco", 2, { ball: "bubble" }))),
    Se(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: tx }, [ss("search", 3), { ...ss("binoculars", 2), when: { home: !0 } }, { ...ss("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [we("writing", 12, { state: "writing" }), we("reading", 12, { state: "reading" }), we("searching", 12, { state: "searching" }), Se(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...At(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), Se(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [ln(At(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [we("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: Kr.build.cooldown }, [we("unit", J5.weight), Se(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...we("hang", 1, { hands: !0, free: !0 }), cooldown: Z5.every }, we("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [we("0", 1), we("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    we("rest", 35, {}, { stay: [25, 60] }),
    we("seat", 15, {}, { stay: [15, 40] }),
    we("edge", 25, {}, { stay: [8, 20] }),
    ln(we("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    we("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    we("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    we("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    we("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    we("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    ln(At(we("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [we("seat", 6, {}, { stay: [60, 150] }), we("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [we("middle", 2, {}, { along: 1 / 2 }), we("third", 1, {}, { along: 1 / 3 }), we("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    we("facing", 4, {}, { turn: 0, leans: 0 }),
    we("turned_left", 1, {}, { turn: 335, leans: 0 }),
    we("turned_right", 1, {}, { turn: 25, leans: 0 }),
    we("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    we("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Qr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Jr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), sx = (e) => Array.isArray(e) ? e[0] : e, ox = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, lx = (e) => Oa.some((t) => t.when.moment === e);
function ix(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Jr(f).every(([m, p]) => n(m) >= sx(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Oa.filter((f) => Qr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= Y5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ze(e, t) {
  const n = ix(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Zr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Zr(e, t, n) {
  var a;
  for (const [s, o] of Jr(t)) (a = e.memory) == null || a.set(s, e.now + ox(o, n));
}
function cA(e, t, n) {
  Zr(e, Oa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const dA = (e) => Object.values(Kr).find((t) => Qr(t.when, e)) ?? null, rx = (e, t, n) => n - t <= (e.lifetime ?? _o), fA = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Vr(e.clip, t));
class eu {
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
}, mA = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), tu = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), hA = {
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
}, pA = 120, ux = 20, vA = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < ux), cx = (e) => js[e] || js.idle, gA = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, nu = "airborne", dx = "landing", fx = "travelling", au = "grounded", yA = ({ airborne: e, landing: t, trip: n }) => e ? nu : t ? dx : n != null && n.started ? fx : au;
function bA(e, t) {
  var s;
  const n = mx(e, t);
  return e.mode === au && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function mx(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === nu && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...hx(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const g = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: g ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : cx(c), facing: g ? p : i.posture === "sit" ? i.face : m };
}
function hx(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Fs = (e) => e.outcome, px = /^plugin:[^:]+:sins:/, Bl = (e) => e.type === "plugins.card" && px.test(e.markKey), vx = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Bl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Bl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], kA = (e, t) => e.filter((n) => n.author === "user" && ma(n.read_at) > t).map((n) => ({ beat: "read_message", time: ma(n.read_at), card: Qi(n) })).sort((n, a) => n.time - a.time), Rl = { user: "reacted", agent: "agent_reacted" };
function wA(e, t) {
  return e.filter((n) => Rl[n.author] && Nt(n) > t).map((n) => ({ beat: `${Rl[n.author]}:${n.emoji}`, time: Nt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const gx = [.../* @__PURE__ */ new Set([...Object.values(Yr).flatMap((e) => Object.keys(e)), ...Object.keys(Xr)])];
function $A(e, t) {
  return e.filter((n) => n.author === "agent" && Nt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = gx.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Nt(n), card: Qi(n) })).sort((n, a) => n.time - a.time);
}
const yx = (e) => new eu(e).isTest(), ya = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Fs(e)] || "";
}, bx = 1800, kx = (e, t) => {
  if (ya(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ya(n) !== "finished" && Number(e.time) - Number(n.time) <= bx ? "tests_fixed" : "tests_passed";
};
function xA(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(yx), s = a.filter((i) => ya(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ya(i))), o.map((i) => ({ beat: kx(i, s), time: Number(i.time), card: i.key }));
}
function SA(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Fs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Fs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const _A = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Nt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function MA(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function CA(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function EA(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = vx.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function Mo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Ll = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function wx(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Mo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function AA(e, t, n, a = {}) {
  const s = Ze({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : lx(`held:${e}`) ? "idle" : e;
}
const je = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function OA(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < je.ahead * n ? 180 : Math.sign(a) * je.turn;
}
const Nl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function TA(e, t) {
  const n = Math.min(je.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(je.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(je.lines, Math.floor((e.bottom - e.top - 2 * a) / je.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / je.sweep) % s, i = o % je.sweep, u = je.sweep - je.returnSeconds, c = Nl((i - u) / je.returnSeconds), f = i <= u ? Nl(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * je.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ql = 3, su = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Dl = 12, IA = (e, t) => ({ mood: e, began: t, seen: 0 });
function BA(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!su(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= ql ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Dl) / Dl, lasts: ql } };
}
const RA = (e) => e.posture === "hang" && !su(e.face), $x = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), xx = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function LA(e, t, n) {
  return $x.has(e) ? 1 / 0 : !xx.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(ou(n - t.began, t.share) - dt.lead, 0);
}
const Sx = 5;
function NA(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Sx ? { beat: "long_walk", time: n } : null };
}
const _x = 30, Qn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function qA(e, t, n, a, s = null) {
  if (t && n < t.until || !Qn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ze({ moment: "spell", state: e, tally: s }, a), [l, i] = Qn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Qn.every } : { state: e, began: 0, until: 0, next: n + Qn.every };
}
const DA = (e, t, n) => t && n < t.until && tu.has(e.state) ? { state: t.state, since: t.began } : e, dt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, ou = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function PA(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = ou(o, e.share);
  return s ? { eager: Mx(t, l), moment: null } : l > dt.lead ? { eager: t, moment: null } : l < dt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > dt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < dt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ze({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function Mx(e, t) {
  return e.on && t > dt.lead + dt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= dt.lead && t >= dt.least ? { ...e, on: !0, calm: !1 } : e;
}
const Cx = 1, Ex = { look: "look", gaze: "gaze" };
function Ax(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ze({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [Ex[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const Ox = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ze({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), Tx = (e, t, n, a, s, o = 0) => Ze({ moment: "jump", high: e > Cx * t, memory: a, now: s, room: o }, n).name === "backflip", Ix = { work: ["building"], idle: ["standing"] };
function jA(e, t, n, a) {
  const s = js[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Ix[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), tu.has(e) ? { moments: o, began: n || a } : (n && a - n >= _x && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Bx(e, t, n) {
  return !Ze({ moment: "pondering", memory: e, now: t }, n) || !Ze({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ze({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Pl = { pondering: Bx };
function FA(e, t, n, a, s, o) {
  if (Pl[e.beat]) {
    const i = Pl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Ax(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== _o && { lifetime: l.lifetime } } } : null;
}
function WA(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = Ox(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const HA = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function zA(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function UA(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const VA = (e, t) => !!(e != null && e.watches) && !t.once, GA = 10, KA = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || rx(a, a.queuedAt, n)), YA = (e, t) => t ? null : e[0] ?? null;
function XA(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const QA = (e, t) => !t.during || !e.some((n) => n.during === t.during), Rx = 2 * Math.PI, Lx = 500;
function JA(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / Lx, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = Rx * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, w = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !u ? s && !t.behind && !g.behind ? qx(g, t, n, p, s) : Px(g, t, n, p) : t) ?? g, C = w != null && w.behind && w.mood === "reading" ? Nx(e.point, w, n, l, s) : w;
  return { point: C ?? null, toward: C ? { x: C.x - n.x, y: C.y - n.y } : null, amount: m, at: a };
}
function Nx(e, t, n, a, s) {
  const o = (q) => q * 180 / Math.PI, l = (q) => o(Math.atan2(Math.sin(q * Math.PI / 180), Math.cos(q * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, g = m ? e.readingYaw + p : f, b = g + l(c - g), w = Math.min(Math.max(a / 1e3, 0), 0.1), C = je.turnSpeed * w, A = m ? g + Math.min(Math.max(b - g, -C), C) : b, _ = m ? e.readingFollow + p : A, j = _ + (A - _) * (1 - Math.exp(-w / je.followSeconds)), F = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, T = o(Mo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(T, -F.up), F.down), P = je.tipSpeed * w, I = m ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -P), P) : G;
  return { ...t, readingYaw: A, readingFollow: j, readingPitch: I, readingFacing: i };
}
function qx(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (_) => {
    const { yaw: j, pitch: F } = Mo(_.x - n.x, s, n.y - _.y, o);
    return { yaw: j, pitch: Math.min(Math.max(F, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Ll(i(e)), Ll(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, g] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [b, w, C] = u.map((_, j) => p * _ + g * c[j]), A = s * b / w;
  return { ...t, x: n.x + A, y: n.y - wx(A, s, -Math.asin(Math.min(Math.max(C, -1), 1)), o) };
}
const Dx = 0.15;
function ZA(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Dx;
}
function Px(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const jx = (e) => !(e != null && e.on);
function eO(e, t, n) {
  if (jx(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const xn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, rt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, os = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), jl = (e) => e * e * (3 - 2 * e);
function Fx(e) {
  if (e < 0 || e >= rt.seconds) return null;
  const t = os(e, ...rt.flicker), n = Math.floor(t * rt.flickers * 2) % 2 === 0, a = e < rt.flicker[1] ? n ? 0.35 + 0.5 * t : rt.dim : 1;
  return { strength: 1 - jl(os(e, ...rt.fade)), lit: a, white: e < rt.flash[0] ? 0 : 1 - jl(os(e, ...rt.flash)) };
}
const tO = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function nO(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Fx(t - e.at);
  return a && { colour: xn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: rt.signs[e.tone], ...a } };
}
function aO(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function sO(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= xn.looks || a === null && n - e.since >= xn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function oO(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const yt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, lO = { behind: 39, figure: 40, ahead: 41 }, Wx = "[data-figure-pile]", Hx = { amber: [1, 0.69, 0.125], good: xn.colours.good, bad: xn.colours.bad }, oa = { phases: 4, ms: 230, dim: 0.25 }, iO = (e, t, n) => e !== "amber" || (t + n) % oa.phases < oa.phases / 2 ? 1 : oa.dim, rO = (e) => e === "amber" ? oa.phases : 1;
function uO(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const cO = Object.keys(Hx), at = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, un = ([e, t], n) => e + n() * (t - e);
function dO(e) {
  const t = at.least + Math.floor(e() * (at.most - at.least + 1));
  return Array.from({ length: Math.min(t, at.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * at.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = un(at.start, e), l = un(at.reach, e);
    return {
      text: Ze({ moment: "digit" }, e).name,
      x: a * o,
      y: at.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(un(at.moveMs, e)),
      fadeMs: Math.round(un(at.fadeMs, e))
    };
  });
}
const ls = { high: 3, gap: 1 };
function fO(e) {
  const t = Math.floor(e / ls.high);
  return { left: -(yt.inside + yt.width / 2 + t * (yt.width + ls.gap)), up: e % ls.high * (yt.height - yt.top) };
}
const zx = (e, t, n) => Ze({ moment: "unit", memory: e, now: t }, n) !== null, Ux = { after: 5 }, Vx = (e) => e.filter((t) => t.active && (t.process || t.watch) && new eu(t).isBuild());
function mO(e, t, n) {
  const a = Vx(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Ux.after ? s : null;
}
function hO(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: zx(n, a, s) } : null;
}
const Fl = { ahead: 140, up: 70 };
function pO(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Fl.ahead, y: a - Fl.up } } : o ? { at: { x: n(o), y: a - o.up - yt.height } } : t ? { at: null } : null;
}
const is = { least: 4e3, most: 1e4 }, Gx = (e) => is.least + e() * (is.most - is.least), Ot = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function vO(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Gx(t);
    if (n.length >= Ot.most || t() >= Ot.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Ot.at[0] + t() * (Ot.at[1] - Ot.at[0]));
    n.push({ from: o, to: o + Ot.ms }), a = o + Ot.ms;
  }
}
const gO = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), yO = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), lu = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), bO = new Set(Oa.filter((e) => lu.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Kx = (e) => e.some((t) => t.state === "built"), kO = (e, t) => Kx(t) ? e.filter((n) => !lu.has(n.beat)) : e, $t = { reach: 40, room: 6 }, Yx = (e, t) => t <= e - $t.reach + 2, wO = (e, t, n) => Yx(e, n) ? t - $t.reach : e - $t.reach - $t.room, $O = (e, t, n, a) => a > 0 && t < e && t + $t.reach >= e - 2 ? Math.min(n, Math.max(e, t + $t.reach)) : e, rs = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, xO = (e) => un(e() < rs.longShare ? rs.long : rs.short, e), Xx = 2 * yt.width;
function SO(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Xx ? o : e + (o - e + s / 2) % s;
}
const Qx = 60, _O = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Qx, Wl = "[data-figure-home]", Ln = () => {
  var t;
  const e = document.querySelector(Wl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Wl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Jx = "[data-figure-docked-bars]", Zx = "[data-figure-chat-foot]", e4 = [0.85, 0.6, 0.35, 0.15], t4 = ["question", "waiting", "suggestion"], MO = (e, t) => t4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function CO() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const n4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", a4 = "[data-figure-newest]";
function iu() {
  var a, s;
  const e = (a = Ln()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(a4), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Co(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function Sn(e, t, n = iu()) {
  if (!e || !n) return !0;
  const a = ht(e, t), s = Ia(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + qe.top * t.size, bottom: a.top + qe.bottom * t.size }, l = It.gap;
  return !Ta(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function EO(e, t, n, a = iu()) {
  if (!a || Sn(t, e, a)) return null;
  const s = Ia(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ft(), u = t.posture === "stand" ? Ao * e.size : pu * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - It.gap - l, a.right + It.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && Sn(p, e, a) && I4(p, e)).sort((p, g) => Math.abs(p.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const us = 0.26, ru = 0.54, s4 = 1.25 / 5.4, Nn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: us, travels: "stand" },
  lounge: { drop: us, travels: "stand" },
  composed: { drop: us, travels: "stand" },
  hang: { drop: ru, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, AO = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * s4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - ru
}), fn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), o4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), OO = (e, t) => (e === "sit" ? o4.has(t) : fn.has(e)) ? e : "stand";
function TO(e, t) {
  return e.facing === t.facing || !fn.has(e.posture) && !fn.has(t.posture) ? t : { posture: "stand", facing: fn.has(e.posture) ? e.facing : t.facing };
}
const IO = 0.25, BO = (e, t) => fn.has(e) && Nn[t].drop === 0, uu = 2, l4 = 90, i4 = 180, r4 = 140, u4 = 280, c4 = 420, d4 = 0.25, f4 = 290, m4 = 600, h4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", p4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", cs = 5;
function ba(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < cs) return null;
  (l || i) && (o = Math.max(o, uu));
  const g = o > 1, b = Math.abs(t.x - e.x), w = b < cs ? 0 : b / (l4 * o) * 1e3, C = Math.min(w, g ? r4 : i4), A = Math.abs(t.y - e.y), _ = t.y < e.y, j = _ && !p && Tx(A, n, u, c, f, m), F = _ ? c4 + Math.min(A, 400) * d4 : Math.sqrt(2 * A / So) * 1e3, T = {
    x: t.x,
    y: t.y,
    ms: A > cs ? j ? m4 : F : 0,
    lead: j ? f4 : _ ? u4 : 0,
    easing: _ ? h4 : p4,
    hopping: !0,
    clip: j ? "backflip" : _ ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: w + C, lead: 0, easing: "linear", ramp: C, ...g ? { clip: "run" } : {} }, P = p ? v4(t, n) : T, I = _ && !a ? [{ ...G, y: e.y }, P] : [{ ...T, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !s, pace: o, running: g };
}
const v4 = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), g4 = (e, t) => e.postures.includes(t) ? t : e.postures[0], RO = (e, t, n) => e.posture === "walk" && n ? "walk" : g4(e.clip, t), ht = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Nn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Ta = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Co = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ft() {
  var t;
  const e = (t = Ln()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jn = 0.5, Hl = 20;
function LO(e, t, n = Ft()) {
  const a = ht(e, t);
  return a.left >= n.left + Hl && a.right <= n.right - Hl;
}
function Eo(e, t, n = Ft()) {
  const a = ht(e, t), s = a.right - a.left, o = Ia(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Jn && i <= n.right + Jn && a.top >= n.top - Jn && u <= n.bottom + Jn;
}
const ka = [0.35, 0.5, 0.65], wa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], qe = { left: ka[0], right: ka.at(-1), top: wa[0], bottom: wa.at(-1) }, y4 = 0.24;
function Ia(e) {
  if (e.posture === "stand") return { left: qe.left, right: qe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + y4 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(qe.left, t), right: Math.max(qe.right, t) };
}
function b4(e, { size: t }, n = Ft()) {
  const a = Ia(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ao = (qe.right - qe.left) / 2 + 0.08;
function NO(e, t) {
  return e === "hang" ? qe : { ...qe, bottom: Math.min(qe.bottom, 1 - t - Nn[e].drop) };
}
const k4 = "[data-figure-agent]";
function cu(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Co(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const du = (e) => wa.flatMap(
  (t) => ka.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Oo(e, t, n = "") {
  if (!Sn(e, t)) return ka.length * wa.length;
  const a = ht(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(n4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Ta(s, u) && Co(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return du(s).filter(([i, u]) => l(i, u) || cu(i, u, n)).length;
}
function w4(e, t) {
  const n = ht(e, t);
  return du({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => cu(a, s, "", k4)).length;
}
const zl = 4;
function qO(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = zl; o <= s; o += zl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!w4(i, e) && Sn(i, e)) return i;
    }
  return null;
}
function _n(e, t, n) {
  const a = Ft(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Eo(l, t, a) && Sn(l, t)).map((l) => ({ spot: l, covered: Oo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const fu = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), $4 = [0.5, 0.25, 0.75], x4 = (e) => fu(e.getBoundingClientRect(), $4), mu = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, S4 = Ao, _4 = (e, t, { size: n }, a = S4) => hu(e, mu[t], a * n, "stand");
function hu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const M4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, pu = 0.1, C4 = (e, t, { size: n }) => hu(e, M4[t], pu * n, "sit"), E4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ds = 60;
function DO(e, t) {
  const n = E4(t);
  return !e.aside || Math.abs(n) >= ds ? t : n < 0 ? 360 - ds : ds;
}
const mn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, A4 = (e) => [.../* @__PURE__ */ new Set([e, ...mn.turns.map((t) => (t + 360) % 360)])];
function PO(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = A4(t), l = mn.every[0] + a() * (mn.every[1] - mn.every[0]);
  return { face: t, from: s ? O4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function O4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / mn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function jO(e, t) {
  const { element: n, edge: a } = Ba(), s = ["left", "right"].map((i) => qn(C4(a, i, e), e)).filter((i) => n && Eo(i, e) && !Oo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function FO(e, t, { size: n }) {
  const a = (qe.right - qe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - vu } : e;
}
const vu = 7;
function gu() {
  const e = [...document.querySelectorAll(Wx)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function T4(e, t) {
  const n = ht(e, t), a = n.right - n.left;
  return { left: n.left + qe.left * a, right: n.left + qe.right * a, top: n.top + qe.top * a, bottom: n.bottom };
}
function I4(e, t) {
  const n = gu();
  return !n || !Ta(T4(e, t), n);
}
const B4 = 4;
function Ba() {
  const e = Dn(), t = gu(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > B4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - vu - n, 0) } };
}
const WO = ({ size: e, below: t }) => (1 - t) * e;
function qn(e, t) {
  const n = Ft(), { size: a, below: s } = t, o = Nn[e.posture].drop * a;
  return { ...b4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ws = (e, t) => Object.keys(mu).map((n) => qn(_4(e, n, t), t)), To = (e, t) => fu(e, e4).map((n) => qn(n, t)), yu = (e, t, n) => _n(e, t, n) ?? e[0];
function HO(e, t) {
  const { element: n, edge: a } = Ba();
  return { ...yu(Ws(a, e), e, t), view: null, on: n };
}
function zO(e, t, n, a) {
  const { element: s, edge: o } = Ba(), l = (a ? Ws(o, t) : [...Ws(o, t), ...To(o, t)]).filter(
    (c) => !Ta(ht(c, t), e)
  ), i = _n(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !Oo(i, t) ? i : _n(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Dn() {
  var a;
  const e = Ln(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Jx);
  if (!t) return { ...Ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ul = { within: 2 };
function UO(e) {
  const { element: t, docked: n, edge: a } = Dn();
  if (!n || e.on !== t) return !0;
  const s = Ra().edge;
  return a.left > s.left + Ul.within || a.left + a.width < s.left + s.width - Ul.within;
}
const R4 = "[data-figure-closing]";
function VO() {
  var n;
  const { element: e, docked: t } = Dn();
  return t && !!((n = e.firstElementChild) != null && n.matches(R4));
}
const bu = "[data-figure-progress]";
function GO(e) {
  const t = e.querySelector(bu);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function KO(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const L4 = { across: 300, above: 380, below: 60 };
function YO(e) {
  const { across: t, above: n, below: a } = L4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: N4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const N4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ku = "[data-figure-bar]", Hs = { back: 144, along: 0.4 };
function XO(e) {
  const { element: t, docked: n, edge: a } = Dn(), s = n ? t.querySelector(ku) : null;
  if (!(s != null && s.querySelector(bu))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...qn({ x: o - Hs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function QO(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Hs.along * a.size ? t.x + Hs.along * a.size : e.x, y: e.y, behind: !0 };
}
function JO(e) {
  const t = e.querySelector(ku), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ra() {
  const e = Ln();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function ZO(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ra(), u = n === null ? q4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : qn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function q4(e, t, n, a, s) {
  const o = To(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + yt.width < s && u.x + a - $t.reach - $t.room >= l);
  return _n(i.length ? i : o, t, n);
}
const D4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function eT(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, uu));
  const g = (j) => {
    const F = ht(j, n, Nn[j.posture].travels);
    return { x: F.left, y: F.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return P4(g(e), g(t), g({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [w, ...C] = [e, ...u, t].map(g), A = ba(w, C[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), _ = C.slice(1).map((j, F) => {
    var T;
    return (T = ba(C[F], j, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : T.legs.find((G) => G.hopping);
  });
  return A && { ...A, legs: [...A.legs, ..._.filter(Boolean)] };
}
function P4(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / D4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ba(e, n, o.size, { pace: l }) : ba(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function tT(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function nT(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && _n(x4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Ba();
  return { ...yu(To(s, t), t, n), view: null, on: a };
}
const j4 = "[data-figure-bubble]", F4 = 250;
let hn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), wu = 0;
const sn = () => hn, fs = /* @__PURE__ */ new WeakMap();
let W4 = 0;
function Io(e) {
  return fs.has(e) || fs.set(e, `floor-${++W4}`), fs.get(e);
}
const H4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, z4 = () => {
  var e, t;
  return ((t = (e = Ln()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function U4(e, t) {
  var a;
  const n = (a = e.querySelector(Zx)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function V4(e, t) {
  const n = e && U4(e, t), a = e ? [...e.querySelectorAll(j4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || H4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: Io(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const G4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= F4 ? (t.top - a.top) / s * 1e3 : 0;
};
function $u(e = hn, t = performance.now()) {
  const n = Ft(), a = z4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Dn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ra();
  return c.element && u.push({ id: Io(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...V4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: G4(e, f, t) }))) });
}
const zs = /* @__PURE__ */ new Set();
function K4(e) {
  return zs.add(e), () => zs.delete(e);
}
function Y4() {
  xu();
  const e = () => {
    wu = requestAnimationFrame(e), !document.hidden && (hn = $u(hn), zs.forEach((t) => t(hn)));
  };
  e();
}
function xu() {
  cancelAnimationFrame(wu);
}
const Bo = 5, X4 = 56, Q4 = { share: 0.6 }, J4 = (e) => -Math.sqrt(2 * So * Q4.share * e), Jt = (e, t) => e.find((n) => n.id === t) ?? null;
function aT(e, t = $u().floors) {
  const n = Jt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Io(e.on) : null, o = s && Jt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Su({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = sn().floors) {
  const c = Jt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Z4(c, f, o)) && e8(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Ro = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Z4 = (e, t, n) => !Ro({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function sT(e, t = sn().floors) {
  if (!Ro(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Bo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function e8(e, t, n = sn().floors) {
  const a = Jt(n, "home");
  return e.posture === "hang" && a && ht(e, t).bottom >= a.top ? !1 : Eo(e, t);
}
function oT(e, t, n, a = sn().floors) {
  const s = Su(e, n, a);
  if (!e.home) return t8(e, t, s, a);
  if (!s) return null;
  const o = Jt(a, "home"), l = s.y - t.y, i = l > Bo ? "dropping" : -l > X4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function t8(e, t, n, a) {
  const s = n ? Jt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: J4(e.risen) };
  if (!n) return null;
  if (Ro(t) && n.y - t.y > Bo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function lT(e, t, n) {
  const a = Ao * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function iT(e, t, n, a = sn().floors) {
  const s = t && Su(t, n, a);
  return s ? { ...e, ...s } : e;
}
const n8 = ["data-type"], a8 = { class: "figure-floor-name" }, s8 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", a8, v(e.floor.type), 1)
    ], 12, n8));
  }
}, o8 = /* @__PURE__ */ z(s8, [["__scopeId", "data-v-4e0f1e2e"]]), l8 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, i8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = ot(sn().floors);
    let n = () => {
    };
    return Me(() => {
      n = K4((a) => t.value = a.floors), Y4();
    }), Re(() => {
      n(), xu();
    }), (a, s) => (r(), d("div", l8, [
      (r(!0), d(L, null, Q(t.value, (o) => (r(), D(o8, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, rT = /* @__PURE__ */ z(i8, [["__scopeId", "data-v-e519168b"]]), pn = (e) => typeof e == "number" ? e : Date.parse(e);
function uT(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: pn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => pn(s.row.created_at) - pn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Vl = 20;
async function cT(e, t, n) {
  for (let a = 0; a < Vl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || pn(o.created_at) <= pn(s.created_at) || !await n()) return a;
  }
  return Vl;
}
const r8 = 3, ms = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function u8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ms[n.grouping]) == null ? void 0 : a.call(ms, e.row, n)) || "";
}
function c8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function dT(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= r8 ? [c8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = u8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const fT = (e) => (t) => t.filter((n) => n.id !== e), mT = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), hT = (e) => (t) => [...t, e], pT = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function vT(e, t = {}) {
  const n = it(), a = M(null), s = M("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function gT(e) {
  const t = it(), n = M("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Zn = /* @__PURE__ */ new Map();
function d8(e, t) {
  if (Zn.has(e)) return Zn.get(e);
  const n = t().finally(() => Zn.delete(e));
  return Zn.set(e, n), n;
}
function yT() {
  const e = it(), t = M(null), n = M("");
  async function a() {
    const s = await d8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const f8 = { class: "cards-page" }, m8 = { class: "cards-bar" }, h8 = { class: "cards-count" }, p8 = { class: "cards" }, v8 = {
  key: 1,
  class: "cards-note"
}, g8 = {
  key: 2,
  class: "cards-note"
}, y8 = ["data-row", "onClick"], b8 = { class: "card-head" }, k8 = { class: "card-title" }, w8 = { class: "card-foot" }, $8 = {
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
    return (a, s) => (r(), d("div", f8, [
      h("div", m8, [
        h("span", h8, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        E(me, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: N(() => [
            E(oe, {
              name: "plus",
              size: 12
            }),
            V(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", p8, [
        e.loaded ? e.failure ? (r(), d("p", v8, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", g8, "No " + v(e.term) + "s yet", 1)) : (r(), D(nt, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(L, null, Q(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", b8, [
            E(oe, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            V(" " + v(e.head(o)), 1),
            E(et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", k8, v(e.title(o)), 1),
          h("span", w8, v(e.foot(o)), 1)
        ], 8, y8))), 128))
      ]),
      ne(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, bT = /* @__PURE__ */ z($8, [["__scopeId", "data-v-b39fea5d"]]), Gl = "newest";
function kT(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = _e(Le, null)) == null ? void 0 : c.search, s = M(""), o = M(Gl), l = M("all"), i = S(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => Er(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Gl ? m : [...m].sort((p, g) => t(p).localeCompare(t(g)));
  }), u = S(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const x8 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, S8 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, _8 = 40, M8 = "top", C8 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = _e(Le, null)) == null ? void 0 : p.autoScroll, s = S(() => a === M8), o = M(null), l = M(!1), i = (g) => s.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var g;
      l.value = i(o.value) >= _8, s.value || (g = n.feed) == null || g.reachTop(o.value);
    }
    he(() => {
      var g;
      return [n.rowCount, (g = n.feed) == null ? void 0 : g.isLoaded()];
    }, async () => {
      await Ne(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Me(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (g, b) => (r(), d("div", x8, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ne(g.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", S8, [
        E(en, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: N(() => [
            ke(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              E(oe, {
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
}, wT = /* @__PURE__ */ z(C8, [["__scopeId", "data-v-d704d7e3"]]), E8 = ["aria-selected", "data-tab", "onClick"], A8 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, O8 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _e(Le, null), o = S(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = M(null), i = M({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const g = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!g) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: g.offsetLeft, width: g.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const f = () => Ne(() => c(!0));
    let m = null;
    return Me(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => m == null ? void 0 : m.disconnect()), he(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), he(() => n.answer, f, { deep: !0 }), (p, g) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(L, null, Q(o.value, (b) => {
        var w, C;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((w = e.active) == null ? void 0 : w.key) === b.key }]),
          "aria-selected": ((C = e.active) == null ? void 0 : C.key) === b.key,
          "data-tab": b.key,
          onClick: (A) => a("choose", b)
        }, [
          V(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", A8, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, E8);
      }), 128)),
      h("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, T8 = /* @__PURE__ */ z(O8, [["__scopeId", "data-v-63fcd326"]]), I8 = { class: "task-bar" }, B8 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", I8, [
      h("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ye({ width: `${n(e.done)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ye({ width: `${n(e.testing)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: ye({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, $T = /* @__PURE__ */ z(B8, [["__scopeId", "data-v-eafa73d4"]]), R8 = {
  class: "tab-body",
  "data-tab-body": ""
}, L8 = { "data-tab-content": "" }, N8 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = M(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Xs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", R8, [
      n.value ? (r(), D(nt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      ke(h("div", L8, [
        ne(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ys, !n.value]
      ])
    ]));
  }
}, xT = /* @__PURE__ */ z(N8, [["__scopeId", "data-v-63876533"]]), q8 = {
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
    return (o, l) => (r(), D(Br, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: N(() => [
        E(wt, null, {
          default: N(() => [...l[2] || (l[2] = [
            V("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(L, null, Q(a, (i) => E(He, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: N(() => [
            V(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(L, { key: 0 }, [
          E(wt, null, {
            default: N(() => [...l[3] || (l[3] = [
              V("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(L, null, Q(s, (i) => E(He, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: N(() => [
              V(v(i.label), 1)
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
}, ST = /* @__PURE__ */ z(q8, [["__scopeId", "data-v-dab0064d"]]);
function _T() {
  const e = M(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const MT = (e) => import(
  /* @vite-ignore */
  e
), D8 = 86400, Us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function P8(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Us(t) - Us(e)) / D8);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function CT(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Us(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: P8(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const hs = 280, ps = 240, vs = 120, j8 = 6, F8 = 14, Mn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function W8(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function _u(e, t) {
  const n = Math.max(0, W8(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function H8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${F8}px)` }), e.offsetHeight, e.style.transition = `height ${hs}ms ${Mn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = _u(t, e));
    const p = s() - i;
    if (!u && p >= hs && (u = !0, e.style.transition = `opacity ${ps}ms ease-out, transform ${ps}ms ${Mn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < hs + ps) return a(m);
    f();
  };
  return a(m), f;
}
function ET(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${j8}px)` }), e.offsetHeight, e.style.transition = `opacity ${vs}ms ease-out, transform ${vs}ms ${Mn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = _u(t, e)), s() - l < vs) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const z8 = 140, ea = 220, Kl = 5;
function AT({ gap: e = z8, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, Kl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, g = H8) => {
    if (l || !m.pane || !m.follows()) return p();
    const b = { el: f, options: m, done: p, arrival: g, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Kl && c.flush();
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
function OT(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${ea}ms ${Mn}, opacity ${ea}ms ease-in, margin ${ea}ms ${Mn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, ea);
}
const Mu = "chat.pins.minimised", la = M(ra(Mu, !1));
function Yl(e) {
  la.value = e, fo(Mu, e);
}
function U8(e) {
  const t = S(() => e()), n = S(() => la.value ? [] : e()), a = () => Yl(!la.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => Nt(o) > s).length,
    (o, l) => o > l && Yl(!1)
  ), { pins: t, visible: n, minimised: la, toggle: a };
}
const V8 = ["title"], G8 = {
  key: 0,
  class: "pins-count"
}, K8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = U8(() => t.pinRows);
    return (o, l) => B(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = ge((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      E(oe, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (r(), d("span", G8, v(B(n).length), 1)) : k("", !0)
    ], 10, V8)) : k("", !0);
  }
}, TT = /* @__PURE__ */ z(K8, [["__scopeId", "data-v-d073c504"]]), Y8 = ["title"], X8 = ["title"], Q8 = { class: "diff-card-dir" }, J8 = { class: "diff-card-name" }, Z8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, e3 = ["title"], t3 = ["title"], n3 = {
  key: 0,
  class: "diff-card-note"
}, a3 = ["href"], s3 = ["src", "alt"], o3 = { class: "diff-card-rows" }, l3 = { class: "diff-row-num" }, i3 = { class: "diff-row-sign" }, r3 = { class: "diff-row-code" }, u3 = {
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
        { label: "Open file", group: "open", disabled: p.value, reason: "Deleted", run: () => location.hash = Ea.file(n.path) },
        { label: n.folded ? "Unfold" : "Fold", group: "open", disabled: p.value, reason: "Deleted", run: () => a("fold") },
        { label: "Copy path", group: "copy", run: ({ say: x }) => Qt(n.path, "the path", x) }
      ]
    }), i = { new: "created", deleted: "deleted", moved: "moved" }, u = { add: "+", del: "−" }, c = S(() => n.path.lastIndexOf("/") + 1), f = S(() => n.path.slice(0, c.value)), m = S(() => n.path.slice(c.value)), p = S(() => n.change === "deleted"), g = S(() => i[n.change]), b = S(() => new Set(n.rows.filter((x) => x.line_type === "add").map((x) => x.line))), w = M("after"), C = S(() => w.value === "before" ? n.whole.old : n.whole.text), A = S(() => n.whole && n.whole.text !== void 0 ? C.value.split(`
`).map((x, y) => ({ line_type: w.value === "after" && b.value.has(y + 1) ? "add" : "ctx", line: y + 1, text: x })) : n.rows.filter(
      (x) => !(n.editsOnly && ["ctx", "fold"].includes(x.line_type)) && !(n.hideRemovals && x.line_type === "del")
    )), _ = M(!1), j = S(() => n.lines && !_.value && !n.whole), F = S(() => j.value ? A.value.slice(0, n.lines) : A.value), T = S(() => A.value.length - F.value.length), G = (x) => x.line === null || x.line_type === "del" ? "" : x.line, P = (x) => x.line_type === "fold" ? x.hidden ? `⋯ ${x.hidden} lines` : "⋯" : x.text, I = M(null), q = M(null);
    let U = null;
    return Me(() => {
      if (!q.value) return;
      let x = !0;
      U = new ResizeObserver(() => {
        !I.value || !q.value || (I.value.style.transition = x ? "none" : "", I.value.style.height = `${q.value.offsetHeight}px`, x = !1);
      }), U.observe(q.value);
    }), Re(() => U && U.disconnect()), (x, y) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: p.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      ke((r(), d("header", {
        class: "diff-card-head",
        title: p.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: y[3] || (y[3] = ($) => !p.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${B(s)}-click to open it`,
          onClick: o
        }, [
          h("span", Q8, v(f.value), 1),
          h("span", J8, v(m.value), 1),
          g.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(g.value), 3)) : k("", !0),
          e.from ? (r(), d("span", Z8, "from " + v(e.from), 1)) : k("", !0)
        ], 8, X8),
        h("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        E(et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        h("button", {
          type: "button",
          class: "diff-card-open",
          title: "Open in the inspector",
          "aria-label": "Open in the inspector",
          "data-diff-open": "",
          onClick: y[0] || (y[0] = ge(($) => B(Hm)(e.path), ["stop"]))
        }, [
          E(oe, {
            name: "open",
            size: 13
          })
        ]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: w.value === "after" ? "Show the file before" : "Show the file after",
          onClick: y[1] || (y[1] = ge(($) => w.value = w.value === "after" ? "before" : "after", ["stop"]))
        }, v(w.value === "after" ? "After" : "Before"), 9, e3)) : k("", !0),
        p.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: y[2] || (y[2] = ge(($) => a("whole"), ["stop"]))
        }, [
          E(oe, {
            name: "file",
            size: 12
          })
        ], 10, t3))
      ], 8, Y8)), [
        [B(Dt), l]
      ]),
      e.whole && e.whole.error ? (r(), d("p", n3, v(e.whole.error), 1)) : k("", !0),
      !p.value && !e.folded ? (r(), d(L, { key: 1 }, [
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
          }, null, 8, s3)
        ], 8, a3)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: I,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            h("div", o3, [
              (r(!0), d(L, null, Q(F.value, ($, O) => (r(), d("div", {
                key: O,
                class: Y(["diff-row", $.line_type, { fresh: e.fresh && $.edit === e.fresh }])
              }, [
                h("span", l3, v(G($)), 1),
                h("span", i3, v(u[$.line_type]), 1),
                h("span", r3, v(P($)), 1)
              ], 2))), 128)),
              T.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: y[4] || (y[4] = ge(($) => _.value = !0, ["stop"]))
              }, v(T.value) + " more " + v(T.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, IT = /* @__PURE__ */ z(u3, [["__scopeId", "data-v-543e1e74"]]), c3 = { "data-queue-controls": "" }, d3 = { class: "counts" }, f3 = { "data-queue-spots": "" }, m3 = {
  class: "spots",
  "aria-label": "Slot units in use"
}, h3 = { "data-queue-waiting": "" }, p3 = { key: 0 }, v3 = { class: "control" }, g3 = { class: "stepper" }, y3 = ["disabled"], b3 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, k3 = ["disabled"], w3 = ["for"], $3 = ["id", "value", "disabled", "onChange"], x3 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, S3 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, _3 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, M3 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = M("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", c3, [
      E(qt, { icon: "gauge" }, {
        default: N(() => [...u[2] || (u[2] = [
          V("Now", -1)
        ])]),
        _: 1
      }),
      h("div", d3, [
        h("div", null, [
          h("strong", f3, [
            V(v(e.queue.used_slots) + " ", 1),
            h("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          h("p", null, "Slot units of long runs in use. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every unit is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "unit" : "units"} free.`), 1),
          h("div", m3, [
            (r(!0), d(L, null, Q(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        h("div", null, [
          h("strong", h3, v(e.queue.waiting_count), 1),
          u[3] || (u[3] = h("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", p3, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      h("div", v3, [
        u[4] || (u[4] = h("div", null, [
          h("label", { id: "queue-limit-label" }, "Long lane capacity"),
          h("p", null, "Slot units of long runs that may run at the same time; a test or a build costs 4. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        h("div", g3, [
          h("button", {
            type: "button",
            "aria-label": "One slot unit fewer",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, y3),
          h("output", b3, v(e.queue.parallel_limit), 1),
          h("button", {
            type: "button",
            "aria-label": "One slot unit more",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, k3)
        ])
      ]),
      (r(!0), d(L, null, Q(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, w3),
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
        }, null, 40, $3)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", x3, [
        E(oe, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = V("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", S3, [
        E(oe, {
          name: "pause",
          size: 13
        }),
        V("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", _3, v(o.value), 1)) : k("", !0)
    ]));
  }
}, C3 = /* @__PURE__ */ z(M3, [["__scopeId", "data-v-f0a1f7f7"]]), E3 = ["data-queue-row", "data-queue-process"], A3 = ["aria-expanded"], O3 = { class: "run-line" }, T3 = { class: "leading" }, I3 = {
  key: 0,
  "data-queue-position": ""
}, B3 = ["title"], R3 = { class: "command" }, L3 = {
  class: "time",
  "data-queue-time": ""
}, N3 = { class: "details" }, q3 = { "data-queue-type": "" }, D3 = { class: "failed" }, P3 = { class: "drop-inner" }, j3 = { class: "output" }, F3 = { class: "output-heading" }, W3 = ["href"], H3 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(), o = qr((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = wo(), u = S(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = S(() => {
      const g = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!g) return "";
      const b = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, w = Math.max(0, Math.floor((b - new Date(g).getTime()) / 1e3));
      return w < 60 ? `${w} s` : w < 3600 ? `${Math.floor(w / 60)} m ${w % 60} s` : `${Math.floor(w / 3600)} h ${String(Math.floor(w / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const g = s.value, b = g.scrollHeight - g.scrollTop - g.clientHeight < 2;
      await o.follow(), await Ne(), n.expanded && b && (g.scrollTop = g.scrollHeight);
    }
    async function m() {
      n.expanded && (await o.newest(), await Ne(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    const p = () => ({
      head: kn(n.run.line, 40),
      items: [
        { label: n.expanded ? "Hide output" : "Show output", group: "open", run: () => a("toggle") },
        { label: "Copy command", group: "copy", run: ({ say: g }) => Qt(n.run.line, "the command", g) },
        { label: "Open its task", group: "copy", disabled: !n.run.task_id, reason: "No task", run: () => lt("tasks", n.run.task_id) }
      ]
    });
    return he(() => n.expanded, m, { immediate: !0 }), Bn(["output.*"], f, (g) => pi(g, /* @__PURE__ */ new Set([n.run.id]))), (g, b) => ke((r(), d("div", {
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
          b[3] || (b[3] = Ue(ge((w) => a("toggle"), ["prevent"]), ["enter"])),
          b[4] || (b[4] = Ue(ge((w) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", O3, [
          h("span", T3, [
            e.run.section === "waiting" ? (r(), d("span", I3, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, B3))
          ]),
          h("code", R3, v(e.run.line), 1),
          h("span", L3, v(c.value), 1),
          E(oe, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", N3, [
          h("span", q3, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(L, { key: 0 }, [
            b[6] || (b[6] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: b[0] || (b[0] = ge((w) => B(lt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(L, { key: 1 }, [
            b[7] || (b[7] = h("span", { class: "separator" }, "·", -1)),
            b[8] || (b[8] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(L, { key: 2 }, [
            b[9] || (b[9] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: b[1] || (b[1] = ge((w) => B(lt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(L, { key: 3 }, [
            b[10] || (b[10] = h("span", { class: "separator" }, "·", -1)),
            h("span", D3, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, A3),
      h("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        h("div", P3, [
          h("div", j3, [
            h("div", F3, [
              h("span", null, "Output " + v(e.run.id), 1),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, W3)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: b[5] || (b[5] = (w) => e.expanded && B(o).loadEarlier(w.target))
            }, [
              b[11] || (b[11] = h("span", { class: "prompt" }, "$ ", -1)),
              V(v(e.run.line), 1),
              B(l).length ? (r(), d(L, { key: 0 }, [
                V(v(`
` + B(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, E3)), [
      [B(Dt), p]
    ]);
  }
}, z3 = /* @__PURE__ */ z(H3, [["__scopeId", "data-v-2998dafa"]]), U3 = {
  class: "lanes",
  "data-execution-lanes": ""
}, V3 = { class: "filters" }, G3 = ["value"], K3 = ["value"], Y3 = ["data-lane"], X3 = {
  key: 0,
  class: "empty"
}, Q3 = { class: "line" }, J3 = { class: "facts" }, Z3 = { class: "line" }, eS = { class: "facts" }, tS = {
  class: "waits",
  "data-lanes-waits": ""
}, nS = {
  key: 0,
  class: "empty"
}, aS = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = M(""), a = M(""), s = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.class)))].sort()), o = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.starter)))].sort()), l = (m) => (!n.value || m.class === n.value) && (!a.value || m.starter === a.value), i = S(() => t.execution.lanes.map((m) => ({ ...m, running: m.running.filter(l), waiting: m.waiting.filter(l) }))), u = S(() => t.execution.waits.filter((m) => m.runs)), c = (m) => `${m.lane[0].toUpperCase()}${m.lane.slice(1)} lane`, f = (m) => m < 60 ? `${m} s` : `${Math.round(m / 60)} min`;
    return (m, p) => (r(), d("section", U3, [
      h("div", V3, [
        h("label", null, [
          p[3] || (p[3] = V("Class ", -1)),
          ke(h("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (g) => n.value = g),
            "data-lanes-class": ""
          }, [
            p[2] || (p[2] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(L, null, Q(s.value, (g) => (r(), d("option", {
              key: g,
              value: g
            }, v(g), 9, G3))), 128))
          ], 512), [
            [Rt, n.value]
          ])
        ]),
        h("label", null, [
          p[5] || (p[5] = V("Started by ", -1)),
          ke(h("select", {
            "onUpdate:modelValue": p[1] || (p[1] = (g) => a.value = g),
            "data-lanes-starter": ""
          }, [
            p[4] || (p[4] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(L, null, Q(o.value, (g) => (r(), d("option", {
              key: g,
              value: g
            }, v(g), 9, K3))), 128))
          ], 512), [
            [Rt, a.value]
          ])
        ])
      ]),
      (r(!0), d(L, null, Q(i.value, (g) => (r(), d("div", {
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
            g.over_capacity ? (r(), d(L, { key: 0 }, [
              V(", over capacity")
            ], 64)) : k("", !0),
            g.halted ? (r(), d(L, { key: 1 }, [
              V(", halted")
            ], 64)) : k("", !0)
          ], 2)
        ]),
        !g.running.length && !g.waiting.length ? (r(), d("p", X3, "Nothing runs or waits here.")) : k("", !0),
        h("ul", null, [
          (r(!0), d(L, null, Q(g.running, (b, w) => (r(), d("li", {
            key: `run:${w}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            h("span", Q3, v(b.line), 1),
            h("span", J3, [
              V(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", running " + v(f(b.seconds)), 1),
              b.parent_line ? (r(), d(L, { key: 0 }, [
                V(", for " + v(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(L, null, Q(g.waiting, (b, w) => (r(), d("li", {
            key: `wait:${w}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            h("span", Z3, v(b.line), 1),
            h("span", eS, [
              V(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", waiting " + v(f(b.seconds)) + ": " + v(b.reason), 1),
              b.raised_from ? (r(), d(L, { key: 0 }, [
                V(". Raised from " + v(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, Y3))), 128)),
      h("div", tS, [
        p[6] || (p[6] = h("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", nS, "No run started in the last hour.")),
        (r(!0), d(L, null, Q(u.value, (g) => (r(), d("p", {
          key: g.priority,
          class: "wait"
        }, v(g.priority) + ": " + v(g.runs) + " started, longest wait " + v(f(g.longest_seconds)) + ", average " + v(f(g.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, sS = /* @__PURE__ */ z(aS, [["__scopeId", "data-v-4a25d644"]]), Cu = ["instant", "short", "long"], Eu = ["background", "normal", "agent", "reserved", "immediate"], oS = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function Au(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const lS = ["data-class-row"], iS = { scope: "row" }, rS = { key: 0 }, uS = ["value"], cS = ["value"], dS = { class: "actions" }, fS = ["disabled"], mS = ["disabled"], hS = { class: "actions" }, pS = ["disabled"], vS = ["disabled"], gS = ["disabled"], yS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = M({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...Au(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", iS, [
        V(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", rS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(L, { key: 0 }, [
        h("td", null, [
          ke(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(L, null, Q(B(Cu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, uS))), 128))
          ], 512), [
            [Rt, o.value.lane]
          ])
        ]),
        h("td", null, [
          ke(h("input", {
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
          ke(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(L, null, Q(B(Eu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, cS))), 128))
          ], 512), [
            [Rt, o.value.priority]
          ])
        ]),
        h("td", null, [
          ke(h("input", {
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
        h("td", dS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, fS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, mS)
        ])
      ], 64)) : (r(), d(L, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", hS, [
          h("span", {
            class: Y(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, pS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, vS)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, gS)) : k("", !0)
        ])
      ], 64))
    ], 8, lS));
  }
}, bS = /* @__PURE__ */ z(yS, [["__scopeId", "data-v-e51b4825"]]), kS = { class: "fields" }, wS = ["disabled"], $S = ["disabled"], xS = ["value"], SS = ["value"], _S = { class: "buttons" }, MS = ["disabled"], CS = ["disabled"], ES = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, AS = { key: 1 }, OS = {
  key: 1,
  class: "hint"
}, TS = {
  key: 2,
  class: "failure",
  role: "alert"
}, IS = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = M(null), l = M(""), i = S(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    he(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...Au(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: ge(c, ["prevent"])
    }, [
      h("div", kS, [
        h("label", null, [
          m[7] || (m[7] = V("Name", -1)),
          ke(h("input", {
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
          ke(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, wS), [
            [Ye, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = V("Or plugin", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, $S), [
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
          ke(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(L, null, Q(B(Cu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, xS))), 128))
          ], 512), [
            [Rt, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = V("Slot units", -1)),
          ke(h("input", {
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
          ke(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(L, null, Q(B(Eu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, SS))), 128))
          ], 512), [
            [Rt, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = V("At once", -1)),
          ke(h("input", {
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
      h("div", _S, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, MS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, CS)
      ]),
      o.value !== null ? (r(), d("div", ES, [
        o.value.length ? (r(), d(L, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(L, null, Q(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", AS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", OS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", TS, v(l.value), 1)) : k("", !0)
    ], 32));
  }
}, BS = /* @__PURE__ */ z(IS, [["__scopeId", "data-v-f15e19ad"]]), RS = { "data-execution-classes": "" }, LS = ["for"], NS = ["id", "value", "disabled", "data-lane-setting", "onChange"], qS = { class: "control presets" }, DS = ["disabled", "data-class-preset", "onClick"], PS = { class: "scroll" }, jS = { "data-class-table": "" }, FS = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, WS = {
  __name: "ExecutionClasses",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = M(null), a = M(""), s = M(!1);
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
    return Me(o), (i, u) => (r(), d("section", RS, [
      E(qt, { icon: "gauge" }, {
        default: N(() => [...u[0] || (u[0] = [
          V("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slot units it takes and its priority.", -1)),
      n.value ? (r(), d(L, { key: 0 }, [
        (r(!0), d(L, null, Q(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              for: c.key
            }, v(c.title), 9, LS),
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
          }, null, 40, NS)
        ]))), 128)),
        h("div", qS, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(L, null, Q(B(oS), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, DS))), 128))
        ]),
        h("div", PS, [
          h("table", jS, [
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
              (r(!0), d(L, null, Q(n.value.classes, (c) => (r(), D(bS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        E(BS, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", FS, v(a.value), 1)) : k("", !0)
    ]));
  }
}, HS = /* @__PURE__ */ z(WS, [["__scopeId", "data-v-f6def058"]]), zS = {
  class: "process-queue",
  "data-test-queue": ""
}, US = {
  key: 0,
  class: "lead"
}, VS = { class: "scroll" }, GS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, KS = ["data-queue-empty"], gs = 20, YS = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = S(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = M(null), s = M(""), o = M([]), l = M(gs), i = S(() => {
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
      ...b.rows.length ? b.rows.map((w, C) => ({ key: `run:${w.id}`, run: w, position: C + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
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
    return Bn(["process.*", "setting.*"], m), Me(m), (g, b) => (r(), d("article", zS, [
      e.agent ? k("", !0) : (r(), d("p", US, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      h("div", VS, [
        s.value ? (r(), d("p", GS, v(s.value), 1)) : k("", !0),
        a.value ? (r(), d(L, { key: 1 }, [
          e.agent ? k("", !0) : (r(), D(C3, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: m
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), D(sS, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          E(Ks, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: N(() => [
              (r(!0), d(L, null, Q(c.value, (w) => (r(), d(L, {
                key: w.key
              }, [
                w.run ? (r(), D(z3, {
                  key: 0,
                  run: w.run,
                  environment: a.value.environment_name,
                  position: w.position,
                  read: e.read,
                  expanded: o.value.includes(w.run.id),
                  onToggle: (C) => f(w.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : w.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": w.section.type
                }, v(w.section.empty), 9, KS)) : (r(), D(qt, {
                  key: 2,
                  class: "sticky-band",
                  icon: w.section.icon,
                  count: w.section.rows.length,
                  "data-queue-heading": w.section.type
                }, {
                  default: N(() => [
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
          e.agent ? k("", !0) : (r(), D(HS, {
            key: 3,
            read: e.read
          }, null, 8, ["read"]))
        ], 64)) : s.value ? k("", !0) : (r(), D(nt, { key: 2 }))
      ])
    ]));
  }
}, BT = /* @__PURE__ */ z(YS, [["__scopeId", "data-v-a016178b"]]), XS = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, QS = ["aria-expanded"], JS = {
  class: "links-count",
  "data-inspector-links-count": ""
}, ZS = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, e6 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, t6 = {
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
    const t = e, n = M(t.open), a = M(0), s = M(0), o = M("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return he(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), Bn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(L, null, [
      a.value ? (r(), d("section", XS, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", JS, v(a.value), 1),
          E(an, { open: n.value }, null, 8, ["open"])
        ], 8, QS),
        h("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", ZS, [
            E(Nd, {
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
      o.value ? (r(), d("p", e6, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Ou = /* @__PURE__ */ z(t6, [["__scopeId", "data-v-a4550728"]]), n6 = ["placeholder"], a6 = { class: "actions" }, s6 = { class: "error" }, o6 = {
  key: 1,
  class: "card closed"
}, l6 = { class: "mark" }, i6 = { class: "prompt" }, r6 = {
  key: 0,
  class: "draft"
}, u6 = {
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
    const a = e, s = n, o = Yt(e, "draft"), l = Yt(e, "error"), i = M(!!l.value), u = M(!1), c = M(!1), f = M(null);
    async function m() {
      var b, w;
      i.value = !0, u.value = !1, await Ne(), (w = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || w.focus();
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
        onSubmit: ge(g, ["prevent"]),
        onKeydown: Ue(p, ["esc"])
      }, [
        ne(b.$slots, "who", {}, void 0, !0),
        ke(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: w[1] || (w[1] = Ue((C) => B(mr)(C, g), ["enter"]))
        }, null, 40, n6), [
          [Ye, o.value]
        ]),
        h("div", a6, [
          h("span", s6, v(l.value), 1),
          E(me, {
            small: "",
            onClick: p
          }, {
            default: N(() => [...w[3] || (w[3] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          E(me, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: N(() => [...w[4] || (w[4] = [
              V("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", o6, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", l6, [
            E(oe, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", i6, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", r6, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[2] || (w[2] = (C) => s("show"))
        }, [
          h("span", null, v(B(Dd)(e.count, "comment")), 1),
          E(oe, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, c6 = /* @__PURE__ */ z(u6, [["__scopeId", "data-v-b68baddd"]]), d6 = { wide: 1120 }, f6 = /\{([A-Za-z_]\w*)\}/g;
function ia(e, t, n = {}) {
  return e.replace(f6, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const m6 = (e, t, n, a) => ia(e.label, n, { row_id: a, id: a }) || Z$(t, n, a), h6 = { class: "comment-side-head" }, p6 = {
  key: 0,
  class: "comment-none"
}, v6 = { key: 0 }, g6 = {
  key: 1,
  class: "comment-none"
}, y6 = {
  class: "comment",
  "data-comment": ""
}, b6 = {
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
      h("header", h6, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        E(Ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", p6, "No comments yet")) : k("", !0),
      (r(!0), d(L, null, Q(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", v6, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", g6, "Revision " + v(a.revision), 1)) : k("", !0),
        h("p", y6, v(e.words(a)), 1)
      ]))), 128)),
      E(En, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Xl = /* @__PURE__ */ z(b6, [["__scopeId", "data-v-276284a3"]]), k6 = { class: "resource-heading" }, w6 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, $6 = {
  key: 1,
  class: "resource-abstract"
}, x6 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", k6, [
      e.title ? (r(), d("h2", w6, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", $6, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, Tu = /* @__PURE__ */ z(x6, [["__scopeId", "data-v-172f09ac"]]), S6 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, _6 = { class: "inspector-icons" }, M6 = { class: "inspector-icons-start" }, C6 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, E6 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, A6 = { class: "inspector-icons-end" }, O6 = ["href"], T6 = {
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
    return (u, c) => (r(), d("header", S6, [
      h("div", _6, [
        h("span", M6, [
          e.backed ? (r(), D(me, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: N(() => [
              E(oe, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(L, { key: 1 }, [
            E(me, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: N(() => [
                E(oe, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            E(me, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: N(() => [
                E(oe, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", C6, v(e.title), 1)) : (r(), d("p", E6, v(e.label), 1)),
        h("span", A6, [
          e.embedded ? (r(), D(me, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => B(Fe)(s.value))
          }, {
            default: N(() => [
              E(oe, {
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
            href: B(jm)(s.value)
          }, [
            E(oe, {
              name: "share",
              size: 13
            })
          ], 8, O6)) : k("", !0),
          e.embedded ? k("", !0) : (r(), D(me, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: N(() => [
              E(oe, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      E(Tu, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, I6 = /* @__PURE__ */ z(T6, [["__scopeId", "data-v-8886850d"]]), B6 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, R6 = { class: "field-name" }, L6 = {
  key: 1,
  class: "field-value"
}, N6 = ["onClick"], q6 = {
  key: 2,
  class: "field-value"
}, D6 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", B6, [
      (r(!0), d(L, null, Q(e.fields, (o) => (r(), d(L, {
        key: o.name
      }, [
        h("p", R6, v(o.label), 1),
        o.isTime ? (r(), D(et, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", L6, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, N6)
        ])) : (r(), d("p", q6, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Iu = /* @__PURE__ */ z(D6, [["__scopeId", "data-v-7e45afb5"]]);
async function P6(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: e5(s.value.actor, s.value.creator_agent), owner: a.length ? t5(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const j6 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, F6 = {
  key: 1,
  class: "inspector-wait"
}, W6 = { class: "inspector-main" }, H6 = { class: "inspector-column" }, z6 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, U6 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, V6 = { class: "inspector-text" }, G6 = ["innerHTML"], K6 = {
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
    const n = e, a = t, s = M(null);
    Gs(gi, S(() => {
      var W;
      return ((W = s.value) == null ? void 0 : W.$el) ?? null;
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
    }), i = M(null), u = M(""), c = M(""), f = M(""), m = M("details"), p = M(null), g = M(0);
    let b = 0;
    const w = S(() => ({ row_id: n.id, id: n.id })), C = S(() => i.value ? ia(l.value.title, i.value, w.value) || J$(n.term, i.value, n.id) : ""), A = S(() => i.value ? m6(l.value, n.term, i.value, n.id) : ""), _ = S(() => A.value === C.value ? "" : A.value), j = S(() => i.value ? ia(l.value.description, i.value, w.value) : ""), F = S(() => {
      var W, K, Z;
      return ((W = i.value) == null ? void 0 : W.body) || ((K = i.value) == null ? void 0 : K.brief) || (o.has(n.term) ? (Z = i.value) == null ? void 0 : Z.text : "") || "";
    }), T = S(() => F.value ? ho(F.value, { env: "", rowNames: !1 }) : ""), G = S(() => n5(i.value, F.value, u.value, c.value)), P = S(() => l.value.comments && g.value >= d6.wide), I = S(() => l.value.comments && !P.value), q = (W) => l.value.components.filter((K) => (K.tab || "") === W).map((K) => K.window), U = S(() => [...new Set(l.value.components.map((W) => W.tab).filter(Boolean))]), x = S(() => U.value.length || I.value ? [{ key: "details", label: "Details" }, ...U.value.map((W) => ({ key: W, label: W })), ...I.value ? [{ key: "comments", label: "Comments" }] : []] : []), y = S(() => {
      const W = l.value.links;
      return W ? { categories: W.categories, open: W.open, outsidePlan: W.excludes_plan, pageSize: W.page_size } : null;
    }), $ = kr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (W) => n.read(W));
    async function O() {
      const W = ++b, K = await n.read(ia(l.value.reads, null, w.value).split(/\s+/).filter(Boolean));
      if (W !== b || (f.value = K.ok ? "" : K.error, !K.ok)) return;
      i.value = K.value;
      const Z = await P6(n.read, i.value);
      W === b && (u.value = Z.creator, c.value = Z.owner);
    }
    he(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", O();
    }, { immediate: !0 }), Bn(l.value.events, O), he($.open, (W) => W && I.value && (m.value = "comments"));
    let R = null;
    return Me(() => {
      var W;
      g.value = ((W = p.value) == null ? void 0 : W.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (R = new ResizeObserver(() => g.value = p.value.clientWidth), R.observe(p.value));
    }), Re(() => R == null ? void 0 : R.disconnect()), (W, K) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      E(I6, {
        label: _.value,
        title: C.value,
        description: j.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: K[0] || (K[0] = (Z) => a("close")),
        onBack: K[1] || (K[1] = (Z) => a("back")),
        onStep: K[2] || (K[2] = (Z) => a("step", Z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", j6, v(f.value), 1)) : i.value ? (r(), d(L, { key: 2 }, [
        E(Ls, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: N(() => [
            E(co, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", W6, [
          h("div", H6, [
            x.value.length ? (r(), d("div", z6, [
              E(Lt, {
                options: x.value,
                value: m.value,
                onPick: K[3] || (K[3] = (Z) => m.value = Z)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", U6, [
              E(tn, { value: m.value }, {
                details: N(() => [
                  h("div", V6, [
                    T.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: T.value
                    }, null, 8, G6)) : k("", !0),
                    l.value.lists_fields ? (r(), D(Iu, {
                      key: 1,
                      fields: G.value,
                      onPeek: K[4] || (K[4] = (Z) => a("open", Z))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  E(Bs, {
                    "slot-name": `inspector.${e.term}`,
                    names: q(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: N(() => [
                  E(Xl, {
                    below: "",
                    comments: B($).comments.value,
                    words: B($).words,
                    more: !!B($).nextPage.value,
                    loading: B($).loading.value,
                    failure: B($).failure.value,
                    onMore: B($).loadMore,
                    onClose: K[5] || (K[5] = (Z) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: N(() => [
                  E(Bs, {
                    names: q(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              y.value ? (r(), D(Ou, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, y.value, {
                onOpen: K[6] || (K[6] = (Z) => a("open", Z))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), D(c6, {
              key: 1,
              send: B($).send,
              count: B($).total.value,
              onShow: K[7] || (K[7] = (Z) => I.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          P.value ? (r(), D(Xl, {
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
      ], 64)) : (r(), d("div", F6, [
        E(nt)
      ]))
    ], 512));
  }
}, Y6 = /* @__PURE__ */ z(K6, [["__scopeId", "data-v-60363e95"]]), RT = {
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
    return (n, a) => (r(), D(Y6, De(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, X6 = { class: "facts" }, Q6 = { class: "fact wide" }, J6 = ["title"], Z6 = {
  key: 1,
  class: "fact-value"
}, e_ = {
  key: 0,
  class: "fact"
}, t_ = { class: "fact-value" }, n_ = { class: "fact" }, a_ = { class: "fact-label" }, s_ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, o_ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, l_ = {
  key: 2,
  class: "fact"
}, i_ = { class: "fact-value" }, r_ = { class: "fact wide" }, u_ = { class: "fact-label" }, c_ = { class: "fact wide" }, d_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, f_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ha.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", X6, [
        h("div", Q6, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => B(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, J6)) : (r(), d("span", Z6, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", e_, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", t_, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(L, { key: 1 }, [
          h("div", n_, [
            h("span", a_, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            E(yn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: B(go)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => B(Fe)(`agents:${e.task.helper_id}`))
            }, {
              default: N(() => [
                E(Gt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          B(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", s_, [
            E(Gt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = V(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", o_, [
            E(Gt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = V(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", l_, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", i_, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", r_, [
          h("span", u_, [
            i[9] || (i[9] = V(" Complexity ", -1)),
            E(Ei, {
              lines: B(Cr).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          E(Lt, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", c_, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          E(Lt, {
            options: B(n),
            value: String(B(Mr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", d_, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, m_ = /* @__PURE__ */ z(f_, [["__scopeId", "data-v-4bf27961"]]);
function h_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const p_ = { class: "number" }, v_ = { class: "title" }, g_ = { class: "word" }, y_ = {
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
    return (a, s) => (r(), D(Je(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: N(() => [
        E(Aa, { status: e.status }, null, 8, ["status"]),
        h("span", p_, v(e.number), 1),
        h("span", v_, v(e.title), 1),
        h("span", g_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ys = /* @__PURE__ */ z(y_, [["__scopeId", "data-v-f6417ae8"]]), b_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, k_ = { class: "level" }, w_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1);
    he(() => n.task.id, () => s.value = !1);
    const o = S(() => h_(n.task.id, n.graph)), l = S(() => s.value ? o.value.above : o.value.above.slice(-1)), i = S(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = S(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: bn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", b_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(L, null, Q(l.value, (g) => (r(), d(L, {
        key: g.map((b) => b.id).join()
      }, [
        h("div", k_, [
          (r(!0), d(L, null, Q(g, (b) => (r(), D(ys, De({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (w) => a("select", w))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      E(ys, ks(ai(f(e.task, !0))), null, 16),
      (r(!0), d(L, null, Q(i.value, (g) => (r(), d(L, {
        key: g.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        E(ys, De({ ref_for: !0 }, f(g), {
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
}, $_ = /* @__PURE__ */ z(w_, [["__scopeId", "data-v-79c52417"]]), x_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, S_ = ["datetime"], __ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", x_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(L, null, Q(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, S_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, M_ = /* @__PURE__ */ z(__, [["__scopeId", "data-v-b41f213b"]]), C_ = {
  class: "part",
  "data-resource-waits": ""
}, E_ = ["onClick"], A_ = { class: "wait-id" }, O_ = { class: "wait-title" }, T_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", C_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(L, null, Q(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        E(Aa, {
          status: B(bn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", A_, v(o.id), 1),
        h("span", O_, v(o.title), 1)
      ], 8, E_))), 128))
    ]));
  }
}, Ql = /* @__PURE__ */ z(T_, [["__scopeId", "data-v-8fb2e251"]]), I_ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, B_ = { class: "text" }, R_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, L_ = 180, N_ = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = M(!1), l = S(() => a.task.waits.filter((u) => !n.has(u.state))), i = S(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(L, null, [
      l.value.length ? (r(), D(Ql, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", I_, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", B_, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", R_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > L_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), D(Ql, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, q_ = /* @__PURE__ */ z(N_, [["__scopeId", "data-v-4a3f1e79"]]), D_ = {
  class: "task-details",
  "data-task-details": ""
}, P_ = { class: "since" }, j_ = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, F_ = { class: "text" }, W_ = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, H_ = {
  key: 1,
  class: "note"
}, z_ = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, U_ = { class: "text" }, V_ = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", D_, [
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
            E(Aa, {
              status: B(bn)(e.task.state)
            }, null, 8, ["status"]),
            V(" " + v(a(e.task.state)), 1)
          ]),
          h("span", P_, [
            o[5] || (o[5] = V(" since ", -1)),
            E(et, {
              at: B(bh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", j_, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", F_, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", W_, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", H_, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", z_, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", U_, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), D($_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        E(m_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        E(q_, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        E(M_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, LT = /* @__PURE__ */ z(V_, [["__scopeId", "data-v-7e73fa21"]]), G_ = 50, K_ = { messages: 25 }, Y_ = (e) => K_[e] || G_, X_ = {
  class: "task-log",
  "aria-label": "Task log"
}, Q_ = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, J_ = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Z_ = { class: "entries" }, eM = ["data-task-log-important"], tM = ["datetime"], nM = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, aM = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = M([]), a = M(1), s = M(!0), o = M(!0), l = M("");
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
        String(Y_("task_logs")),
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
    ), tt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", X_, [
      o.value ? (r(), D(nt, { key: 0 })) : l.value ? (r(), d(L, { key: 1 }, [
        h("p", Q_, v(l.value), 1),
        E(me, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: N(() => [...f[3] || (f[3] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(L, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", J_, "No log entries yet.")),
        h("ol", Z_, [
          (r(!0), d(L, null, Q(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: Y(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, tM),
            h("p", null, v(m.line), 1)
          ], 10, eM))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", nM, [
          E(me, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: N(() => [...f[4] || (f[4] = [
              V("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + v(a.value), 1),
          E(me, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: N(() => [...f[5] || (f[5] = [
              V("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, NT = /* @__PURE__ */ z(aM, [["__scopeId", "data-v-cfa43bf1"]]);
function sM(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var bs = { exports: {} }, Jl;
function oM() {
  return Jl || (Jl = 1, (function(e, t) {
    var n = (function() {
      var a = function(T, G) {
        var P = 236, I = 17, q = T, U = o[G], x = null, y = 0, $ = null, O = [], R = {}, W = function(H, J) {
          y = q * 4 + 17, x = (function(X) {
            for (var ee = new Array(X), te = 0; te < X; te += 1) {
              ee[te] = new Array(X);
              for (var se = 0; se < X; se += 1)
                ee[te][se] = null;
            }
            return ee;
          })(y), K(0, 0), K(y - 7, 0), K(0, y - 7), ce(), le(), Ee(H, J), q >= 7 && $e(H), $ == null && ($ = ie(q, U, O)), ze($, J);
        }, K = function(H, J) {
          for (var X = -1; X <= 7; X += 1)
            if (!(H + X <= -1 || y <= H + X))
              for (var ee = -1; ee <= 7; ee += 1)
                J + ee <= -1 || y <= J + ee || (0 <= X && X <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (X == 0 || X == 6) || 2 <= X && X <= 4 && 2 <= ee && ee <= 4 ? x[H + X][J + ee] = !0 : x[H + X][J + ee] = !1);
        }, Z = function() {
          for (var H = 0, J = 0, X = 0; X < 8; X += 1) {
            W(!0, X);
            var ee = i.getLostPoint(R);
            (X == 0 || H > ee) && (H = ee, J = X);
          }
          return J;
        }, le = function() {
          for (var H = 8; H < y - 8; H += 1)
            x[H][6] == null && (x[H][6] = H % 2 == 0);
          for (var J = 8; J < y - 8; J += 1)
            x[6][J] == null && (x[6][J] = J % 2 == 0);
        }, ce = function() {
          for (var H = i.getPatternPosition(q), J = 0; J < H.length; J += 1)
            for (var X = 0; X < H.length; X += 1) {
              var ee = H[J], te = H[X];
              if (x[ee][te] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var de = -2; de <= 2; de += 1)
                    se == -2 || se == 2 || de == -2 || de == 2 || se == 0 && de == 0 ? x[ee + se][te + de] = !0 : x[ee + se][te + de] = !1;
            }
        }, $e = function(H) {
          for (var J = i.getBCHTypeNumber(q), X = 0; X < 18; X += 1) {
            var ee = !H && (J >> X & 1) == 1;
            x[Math.floor(X / 3)][X % 3 + y - 8 - 3] = ee;
          }
          for (var X = 0; X < 18; X += 1) {
            var ee = !H && (J >> X & 1) == 1;
            x[X % 3 + y - 8 - 3][Math.floor(X / 3)] = ee;
          }
        }, Ee = function(H, J) {
          for (var X = U << 3 | J, ee = i.getBCHTypeInfo(X), te = 0; te < 15; te += 1) {
            var se = !H && (ee >> te & 1) == 1;
            te < 6 ? x[te][8] = se : te < 8 ? x[te + 1][8] = se : x[y - 15 + te][8] = se;
          }
          for (var te = 0; te < 15; te += 1) {
            var se = !H && (ee >> te & 1) == 1;
            te < 8 ? x[8][y - te - 1] = se : te < 9 ? x[8][15 - te - 1 + 1] = se : x[8][15 - te - 1] = se;
          }
          x[y - 8][8] = !H;
        }, ze = function(H, J) {
          for (var X = -1, ee = y - 1, te = 7, se = 0, de = i.getMaskFunction(J), ue = y - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var Ce = 0; Ce < 2; Ce += 1)
                if (x[ee][ue - Ce] == null) {
                  var Te = !1;
                  se < H.length && (Te = (H[se] >>> te & 1) == 1);
                  var ve = de(ee, ue - Ce);
                  ve && (Te = !Te), x[ee][ue - Ce] = Te, te -= 1, te == -1 && (se += 1, te = 7);
                }
              if (ee += X, ee < 0 || y <= ee) {
                ee -= X, X = -X;
                break;
              }
            }
        }, pe = function(H, J) {
          for (var X = 0, ee = 0, te = 0, se = new Array(J.length), de = new Array(J.length), ue = 0; ue < J.length; ue += 1) {
            var Ce = J[ue].dataCount, Te = J[ue].totalCount - Ce;
            ee = Math.max(ee, Ce), te = Math.max(te, Te), se[ue] = new Array(Ce);
            for (var ve = 0; ve < se[ue].length; ve += 1)
              se[ue][ve] = 255 & H.getBuffer()[ve + X];
            X += Ce;
            var Ve = i.getErrorCorrectPolynomial(Te), Ge = c(se[ue], Ve.getLength() - 1), Lo = Ge.mod(Ve);
            de[ue] = new Array(Ve.getLength() - 1);
            for (var ve = 0; ve < de[ue].length; ve += 1) {
              var No = ve + Lo.getLength() - de[ue].length;
              de[ue][ve] = No >= 0 ? Lo.getAt(No) : 0;
            }
          }
          for (var qo = 0, ve = 0; ve < J.length; ve += 1)
            qo += J[ve].totalCount;
          for (var La = new Array(qo), Pn = 0, ve = 0; ve < ee; ve += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              ve < se[ue].length && (La[Pn] = se[ue][ve], Pn += 1);
          for (var ve = 0; ve < te; ve += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              ve < de[ue].length && (La[Pn] = de[ue][ve], Pn += 1);
          return La;
        }, ie = function(H, J, X) {
          for (var ee = f.getRSBlocks(H, J), te = m(), se = 0; se < X.length; se += 1) {
            var de = X[se];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), H)), de.write(te);
          }
          for (var ue = 0, se = 0; se < ee.length; se += 1)
            ue += ee[se].dataCount;
          if (te.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ue * 8 + ")";
          for (te.getLengthInBits() + 4 <= ue * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ue * 8 || (te.put(P, 8), te.getLengthInBits() >= ue * 8)); )
            te.put(I, 8);
          return pe(te, ee);
        };
        R.addData = function(H, J) {
          J = J || "Byte";
          var X = null;
          switch (J) {
            case "Numeric":
              X = p(H);
              break;
            case "Alphanumeric":
              X = g(H);
              break;
            case "Byte":
              X = b(H);
              break;
            case "Kanji":
              X = w(H);
              break;
            default:
              throw "mode:" + J;
          }
          O.push(X), $ = null;
        }, R.isDark = function(H, J) {
          if (H < 0 || y <= H || J < 0 || y <= J)
            throw H + "," + J;
          return x[H][J];
        }, R.getModuleCount = function() {
          return y;
        }, R.make = function() {
          if (q < 1) {
            for (var H = 1; H < 40; H++) {
              for (var J = f.getRSBlocks(H, U), X = m(), ee = 0; ee < O.length; ee++) {
                var te = O[ee];
                X.put(te.getMode(), 4), X.put(te.getLength(), i.getLengthInBits(te.getMode(), H)), te.write(X);
              }
              for (var se = 0, ee = 0; ee < J.length; ee++)
                se += J[ee].dataCount;
              if (X.getLengthInBits() <= se * 8)
                break;
            }
            q = H;
          }
          W(!1, Z());
        }, R.createTableTag = function(H, J) {
          H = H || 2, J = typeof J > "u" ? H * 4 : J;
          var X = "";
          X += '<table style="', X += " border-width: 0px; border-style: none;", X += " border-collapse: collapse;", X += " padding: 0px; margin: " + J + "px;", X += '">', X += "<tbody>";
          for (var ee = 0; ee < R.getModuleCount(); ee += 1) {
            X += "<tr>";
            for (var te = 0; te < R.getModuleCount(); te += 1)
              X += '<td style="', X += " border-width: 0px; border-style: none;", X += " border-collapse: collapse;", X += " padding: 0px; margin: 0px;", X += " width: " + H + "px;", X += " height: " + H + "px;", X += " background-color: ", X += R.isDark(ee, te) ? "#000000" : "#ffffff", X += ";", X += '"/>';
            X += "</tr>";
          }
          return X += "</tbody>", X += "</table>", X;
        }, R.createSvgTag = function(H, J, X, ee) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], H = te.cellSize, J = te.margin, X = te.alt, ee = te.title), H = H || 2, J = typeof J > "u" ? H * 4 : J, X = typeof X == "string" ? { text: X } : X || {}, X.text = X.text || null, X.id = X.text ? X.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var se = R.getModuleCount() * H + J * 2, de, ue, Ce, Te, ve = "", Ve;
          for (Ve = "l" + H + ",0 0," + H + " -" + H + ",0 0,-" + H + "z ", ve += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ve += te.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', ve += ' viewBox="0 0 ' + se + " " + se + '" ', ve += ' preserveAspectRatio="xMinYMin meet"', ve += ee.text || X.text ? ' role="img" aria-labelledby="' + ae([ee.id, X.id].join(" ").trim()) + '"' : "", ve += ">", ve += ee.text ? '<title id="' + ae(ee.id) + '">' + ae(ee.text) + "</title>" : "", ve += X.text ? '<description id="' + ae(X.id) + '">' + ae(X.text) + "</description>" : "", ve += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ve += '<path d="', Ce = 0; Ce < R.getModuleCount(); Ce += 1)
            for (Te = Ce * H + J, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(Ce, de) && (ue = de * H + J, ve += "M" + ue + "," + Te + Ve);
          return ve += '" stroke="transparent" fill="black"/>', ve += "</svg>", ve;
        }, R.createDataURL = function(H, J) {
          H = H || 2, J = typeof J > "u" ? H * 4 : J;
          var X = R.getModuleCount() * H + J * 2, ee = J, te = X - J;
          return F(X, X, function(se, de) {
            if (ee <= se && se < te && ee <= de && de < te) {
              var ue = Math.floor((se - ee) / H), Ce = Math.floor((de - ee) / H);
              return R.isDark(Ce, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(H, J, X) {
          H = H || 2, J = typeof J > "u" ? H * 4 : J;
          var ee = R.getModuleCount() * H + J * 2, te = "";
          return te += "<img", te += ' src="', te += R.createDataURL(H, J), te += '"', te += ' width="', te += ee, te += '"', te += ' height="', te += ee, te += '"', X && (te += ' alt="', te += ae(X), te += '"'), te += "/>", te;
        };
        var ae = function(H) {
          for (var J = "", X = 0; X < H.length; X += 1) {
            var ee = H.charAt(X);
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
        }, be = function(H) {
          var J = 1;
          H = typeof H > "u" ? J * 2 : H;
          var X = R.getModuleCount() * J + H * 2, ee = H, te = X - H, se, de, ue, Ce, Te, ve = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ve = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ge = "";
          for (se = 0; se < X; se += 2) {
            for (ue = Math.floor((se - ee) / J), Ce = Math.floor((se + 1 - ee) / J), de = 0; de < X; de += 1)
              Te = "█", ee <= de && de < te && ee <= se && se < te && R.isDark(ue, Math.floor((de - ee) / J)) && (Te = " "), ee <= de && de < te && ee <= se + 1 && se + 1 < te && R.isDark(Ce, Math.floor((de - ee) / J)) ? Te += " " : Te += "█", Ge += H < 1 && se + 1 >= te ? Ve[Te] : ve[Te];
            Ge += `
`;
          }
          return X % 2 && H > 0 ? Ge.substring(0, Ge.length - X - 1) + Array(X + 1).join("▀") : Ge.substring(0, Ge.length - 1);
        };
        return R.createASCII = function(H, J) {
          if (H = H || 1, H < 2)
            return be(J);
          H -= 1, J = typeof J > "u" ? H * 2 : J;
          var X = R.getModuleCount() * H + J * 2, ee = J, te = X - J, se, de, ue, Ce, Te = Array(H + 1).join("██"), ve = Array(H + 1).join("  "), Ve = "", Ge = "";
          for (se = 0; se < X; se += 1) {
            for (ue = Math.floor((se - ee) / H), Ge = "", de = 0; de < X; de += 1)
              Ce = 1, ee <= de && de < te && ee <= se && se < te && R.isDark(ue, Math.floor((de - ee) / H)) && (Ce = 0), Ge += Ce ? Te : ve;
            for (ue = 0; ue < H; ue += 1)
              Ve += Ge + `
`;
          }
          return Ve.substring(0, Ve.length - 1);
        }, R.renderTo2dContext = function(H, J) {
          J = J || 2;
          for (var X = R.getModuleCount(), ee = 0; ee < X; ee++)
            for (var te = 0; te < X; te++)
              H.fillStyle = R.isDark(ee, te) ? "black" : "white", H.fillRect(ee * J, te * J, J, J);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(T) {
          for (var G = [], P = 0; P < T.length; P += 1) {
            var I = T.charCodeAt(P);
            G.push(I & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(T, G) {
        var P = (function() {
          for (var q = _(T), U = function() {
            var le = q.read();
            if (le == -1) throw "eof";
            return le;
          }, x = 0, y = {}; ; ) {
            var $ = q.read();
            if ($ == -1) break;
            var O = U(), R = U(), W = U(), K = String.fromCharCode($ << 8 | O), Z = R << 8 | W;
            y[K] = Z, x += 1;
          }
          if (x != G)
            throw x + " != " + G;
          return y;
        })(), I = 63;
        return function(q) {
          for (var U = [], x = 0; x < q.length; x += 1) {
            var y = q.charCodeAt(x);
            if (y < 128)
              U.push(y);
            else {
              var $ = P[q.charAt(x)];
              typeof $ == "number" ? ($ & 255) == $ ? U.push($) : (U.push($ >>> 8), U.push($ & 255)) : U.push(I);
            }
          }
          return U;
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
        var T = [
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
        ], G = 1335, P = 7973, I = 21522, q = {}, U = function(x) {
          for (var y = 0; x != 0; )
            y += 1, x >>>= 1;
          return y;
        };
        return q.getBCHTypeInfo = function(x) {
          for (var y = x << 10; U(y) - U(G) >= 0; )
            y ^= G << U(y) - U(G);
          return (x << 10 | y) ^ I;
        }, q.getBCHTypeNumber = function(x) {
          for (var y = x << 12; U(y) - U(P) >= 0; )
            y ^= P << U(y) - U(P);
          return x << 12 | y;
        }, q.getPatternPosition = function(x) {
          return T[x - 1];
        }, q.getMaskFunction = function(x) {
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
        }, q.getErrorCorrectPolynomial = function(x) {
          for (var y = c([1], 0), $ = 0; $ < x; $ += 1)
            y = y.multiply(c([1, u.gexp($)], 0));
          return y;
        }, q.getLengthInBits = function(x, y) {
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
        }, q.getLostPoint = function(x) {
          for (var y = x.getModuleCount(), $ = 0, O = 0; O < y; O += 1)
            for (var R = 0; R < y; R += 1) {
              for (var W = 0, K = x.isDark(O, R), Z = -1; Z <= 1; Z += 1)
                if (!(O + Z < 0 || y <= O + Z))
                  for (var le = -1; le <= 1; le += 1)
                    R + le < 0 || y <= R + le || Z == 0 && le == 0 || K == x.isDark(O + Z, R + le) && (W += 1);
              W > 5 && ($ += 3 + W - 5);
            }
          for (var O = 0; O < y - 1; O += 1)
            for (var R = 0; R < y - 1; R += 1) {
              var ce = 0;
              x.isDark(O, R) && (ce += 1), x.isDark(O + 1, R) && (ce += 1), x.isDark(O, R + 1) && (ce += 1), x.isDark(O + 1, R + 1) && (ce += 1), (ce == 0 || ce == 4) && ($ += 3);
            }
          for (var O = 0; O < y; O += 1)
            for (var R = 0; R < y - 6; R += 1)
              x.isDark(O, R) && !x.isDark(O, R + 1) && x.isDark(O, R + 2) && x.isDark(O, R + 3) && x.isDark(O, R + 4) && !x.isDark(O, R + 5) && x.isDark(O, R + 6) && ($ += 40);
          for (var R = 0; R < y; R += 1)
            for (var O = 0; O < y - 6; O += 1)
              x.isDark(O, R) && !x.isDark(O + 1, R) && x.isDark(O + 2, R) && x.isDark(O + 3, R) && x.isDark(O + 4, R) && !x.isDark(O + 5, R) && x.isDark(O + 6, R) && ($ += 40);
          for (var $e = 0, R = 0; R < y; R += 1)
            for (var O = 0; O < y; O += 1)
              x.isDark(O, R) && ($e += 1);
          var Ee = Math.abs(100 * $e / y / y - 50) / 5;
          return $ += Ee * 10, $;
        }, q;
      })(), u = (function() {
        for (var T = new Array(256), G = new Array(256), P = 0; P < 8; P += 1)
          T[P] = 1 << P;
        for (var P = 8; P < 256; P += 1)
          T[P] = T[P - 4] ^ T[P - 5] ^ T[P - 6] ^ T[P - 8];
        for (var P = 0; P < 255; P += 1)
          G[T[P]] = P;
        var I = {};
        return I.glog = function(q) {
          if (q < 1)
            throw "glog(" + q + ")";
          return G[q];
        }, I.gexp = function(q) {
          for (; q < 0; )
            q += 255;
          for (; q >= 256; )
            q -= 255;
          return T[q];
        }, I;
      })();
      function c(T, G) {
        if (typeof T.length > "u")
          throw T.length + "/" + G;
        var P = (function() {
          for (var q = 0; q < T.length && T[q] == 0; )
            q += 1;
          for (var U = new Array(T.length - q + G), x = 0; x < T.length - q; x += 1)
            U[x] = T[x + q];
          return U;
        })(), I = {};
        return I.getAt = function(q) {
          return P[q];
        }, I.getLength = function() {
          return P.length;
        }, I.multiply = function(q) {
          for (var U = new Array(I.getLength() + q.getLength() - 1), x = 0; x < I.getLength(); x += 1)
            for (var y = 0; y < q.getLength(); y += 1)
              U[x + y] ^= u.gexp(u.glog(I.getAt(x)) + u.glog(q.getAt(y)));
          return c(U, 0);
        }, I.mod = function(q) {
          if (I.getLength() - q.getLength() < 0)
            return I;
          for (var U = u.glog(I.getAt(0)) - u.glog(q.getAt(0)), x = new Array(I.getLength()), y = 0; y < I.getLength(); y += 1)
            x[y] = I.getAt(y);
          for (var y = 0; y < q.getLength(); y += 1)
            x[y] ^= u.gexp(u.glog(q.getAt(y)) + U);
          return c(x, 0).mod(q);
        }, I;
      }
      var f = (function() {
        var T = [
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
        ], G = function(q, U) {
          var x = {};
          return x.totalCount = q, x.dataCount = U, x;
        }, P = {}, I = function(q, U) {
          switch (U) {
            case o.L:
              return T[(q - 1) * 4 + 0];
            case o.M:
              return T[(q - 1) * 4 + 1];
            case o.Q:
              return T[(q - 1) * 4 + 2];
            case o.H:
              return T[(q - 1) * 4 + 3];
            default:
              return;
          }
        };
        return P.getRSBlocks = function(q, U) {
          var x = I(q, U);
          if (typeof x > "u")
            throw "bad rs block @ typeNumber:" + q + "/errorCorrectionLevel:" + U;
          for (var y = x.length / 3, $ = [], O = 0; O < y; O += 1)
            for (var R = x[O * 3 + 0], W = x[O * 3 + 1], K = x[O * 3 + 2], Z = 0; Z < R; Z += 1)
              $.push(G(W, K));
          return $;
        }, P;
      })(), m = function() {
        var T = [], G = 0, P = {};
        return P.getBuffer = function() {
          return T;
        }, P.getAt = function(I) {
          var q = Math.floor(I / 8);
          return (T[q] >>> 7 - I % 8 & 1) == 1;
        }, P.put = function(I, q) {
          for (var U = 0; U < q; U += 1)
            P.putBit((I >>> q - U - 1 & 1) == 1);
        }, P.getLengthInBits = function() {
          return G;
        }, P.putBit = function(I) {
          var q = Math.floor(G / 8);
          T.length <= q && T.push(0), I && (T[q] |= 128 >>> G % 8), G += 1;
        }, P;
      }, p = function(T) {
        var G = s.MODE_NUMBER, P = T, I = {};
        I.getMode = function() {
          return G;
        }, I.getLength = function(x) {
          return P.length;
        }, I.write = function(x) {
          for (var y = P, $ = 0; $ + 2 < y.length; )
            x.put(q(y.substring($, $ + 3)), 10), $ += 3;
          $ < y.length && (y.length - $ == 1 ? x.put(q(y.substring($, $ + 1)), 4) : y.length - $ == 2 && x.put(q(y.substring($, $ + 2)), 7));
        };
        var q = function(x) {
          for (var y = 0, $ = 0; $ < x.length; $ += 1)
            y = y * 10 + U(x.charAt($));
          return y;
        }, U = function(x) {
          if ("0" <= x && x <= "9")
            return x.charCodeAt(0) - 48;
          throw "illegal char :" + x;
        };
        return I;
      }, g = function(T) {
        var G = s.MODE_ALPHA_NUM, P = T, I = {};
        I.getMode = function() {
          return G;
        }, I.getLength = function(U) {
          return P.length;
        }, I.write = function(U) {
          for (var x = P, y = 0; y + 1 < x.length; )
            U.put(
              q(x.charAt(y)) * 45 + q(x.charAt(y + 1)),
              11
            ), y += 2;
          y < x.length && U.put(q(x.charAt(y)), 6);
        };
        var q = function(U) {
          if ("0" <= U && U <= "9")
            return U.charCodeAt(0) - 48;
          if ("A" <= U && U <= "Z")
            return U.charCodeAt(0) - 65 + 10;
          switch (U) {
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
              throw "illegal char :" + U;
          }
        };
        return I;
      }, b = function(T) {
        var G = s.MODE_8BIT_BYTE, P = a.stringToBytes(T), I = {};
        return I.getMode = function() {
          return G;
        }, I.getLength = function(q) {
          return P.length;
        }, I.write = function(q) {
          for (var U = 0; U < P.length; U += 1)
            q.put(P[U], 8);
        }, I;
      }, w = function(T) {
        var G = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function(U, x) {
          var y = P(U);
          if (y.length != 2 || (y[0] << 8 | y[1]) != x)
            throw "sjis not supported.";
        })("友", 38726);
        var I = P(T), q = {};
        return q.getMode = function() {
          return G;
        }, q.getLength = function(U) {
          return ~~(I.length / 2);
        }, q.write = function(U) {
          for (var x = I, y = 0; y + 1 < x.length; ) {
            var $ = (255 & x[y]) << 8 | 255 & x[y + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (y + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), U.put($, 13), y += 2;
          }
          if (y < x.length)
            throw "illegal char at " + (y + 1);
        }, q;
      }, C = function() {
        var T = [], G = {};
        return G.writeByte = function(P) {
          T.push(P & 255);
        }, G.writeShort = function(P) {
          G.writeByte(P), G.writeByte(P >>> 8);
        }, G.writeBytes = function(P, I, q) {
          I = I || 0, q = q || P.length;
          for (var U = 0; U < q; U += 1)
            G.writeByte(P[U + I]);
        }, G.writeString = function(P) {
          for (var I = 0; I < P.length; I += 1)
            G.writeByte(P.charCodeAt(I));
        }, G.toByteArray = function() {
          return T;
        }, G.toString = function() {
          var P = "";
          P += "[";
          for (var I = 0; I < T.length; I += 1)
            I > 0 && (P += ","), P += T[I];
          return P += "]", P;
        }, G;
      }, A = function() {
        var T = 0, G = 0, P = 0, I = "", q = {}, U = function(y) {
          I += String.fromCharCode(x(y & 63));
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
        return q.writeByte = function(y) {
          for (T = T << 8 | y & 255, G += 8, P += 1; G >= 6; )
            U(T >>> G - 6), G -= 6;
        }, q.flush = function() {
          if (G > 0 && (U(T << 6 - G), T = 0, G = 0), P % 3 != 0)
            for (var y = 3 - P % 3, $ = 0; $ < y; $ += 1)
              I += "=";
        }, q.toString = function() {
          return I;
        }, q;
      }, _ = function(T) {
        var G = T, P = 0, I = 0, q = 0, U = {};
        U.read = function() {
          for (; q < 8; ) {
            if (P >= G.length) {
              if (q == 0)
                return -1;
              throw "unexpected end of file./" + q;
            }
            var y = G.charAt(P);
            if (P += 1, y == "=")
              return q = 0, -1;
            if (y.match(/^\s$/))
              continue;
            I = I << 6 | x(y.charCodeAt(0)), q += 6;
          }
          var $ = I >>> q - 8 & 255;
          return q -= 8, $;
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
        return U;
      }, j = function(T, G) {
        var P = T, I = G, q = new Array(T * G), U = {};
        U.setPixel = function(O, R, W) {
          q[R * P + O] = W;
        }, U.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(P), O.writeShort(I), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(P), O.writeShort(I), O.writeByte(0);
          var R = 2, W = y(R);
          O.writeByte(R);
          for (var K = 0; W.length - K > 255; )
            O.writeByte(255), O.writeBytes(W, K, 255), K += 255;
          O.writeByte(W.length - K), O.writeBytes(W, K, W.length - K), O.writeByte(0), O.writeString(";");
        };
        var x = function(O) {
          var R = O, W = 0, K = 0, Z = {};
          return Z.write = function(le, ce) {
            if (le >>> ce)
              throw "length over";
            for (; W + ce >= 8; )
              R.writeByte(255 & (le << W | K)), ce -= 8 - W, le >>>= 8 - W, K = 0, W = 0;
            K = le << W | K, W = W + ce;
          }, Z.flush = function() {
            W > 0 && R.writeByte(K);
          }, Z;
        }, y = function(O) {
          for (var R = 1 << O, W = (1 << O) + 1, K = O + 1, Z = $(), le = 0; le < R; le += 1)
            Z.add(String.fromCharCode(le));
          Z.add(String.fromCharCode(R)), Z.add(String.fromCharCode(W));
          var ce = C(), $e = x(ce);
          $e.write(R, K);
          var Ee = 0, ze = String.fromCharCode(q[Ee]);
          for (Ee += 1; Ee < q.length; ) {
            var pe = String.fromCharCode(q[Ee]);
            Ee += 1, Z.contains(ze + pe) ? ze = ze + pe : ($e.write(Z.indexOf(ze), K), Z.size() < 4095 && (Z.size() == 1 << K && (K += 1), Z.add(ze + pe)), ze = pe);
          }
          return $e.write(Z.indexOf(ze), K), $e.write(W, K), $e.flush(), ce.toByteArray();
        }, $ = function() {
          var O = {}, R = 0, W = {};
          return W.add = function(K) {
            if (W.contains(K))
              throw "dup key:" + K;
            O[K] = R, R += 1;
          }, W.size = function() {
            return R;
          }, W.indexOf = function(K) {
            return O[K];
          }, W.contains = function(K) {
            return typeof O[K] < "u";
          }, W;
        };
        return U;
      }, F = function(T, G, P) {
        for (var I = j(T, G), q = 0; q < G; q += 1)
          for (var U = 0; U < T; U += 1)
            I.setPixel(U, q, P(U, q));
        var x = C();
        I.write(x);
        for (var y = A(), $ = x.toByteArray(), O = 0; O < $.length; O += 1)
          y.writeByte($[O]);
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
var lM = oM();
const iM = /* @__PURE__ */ sM(lM), rM = ["width", "height", "viewBox"], uM = ["width", "height"], cM = ["d"], dM = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = S(() => {
      const a = iM(0, "M");
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
      }, null, 8, uM),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, cM)
    ], 8, rM));
  }
}, qT = /* @__PURE__ */ z(dM, [["__scopeId", "data-v-489f0852"]]), fM = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, DT = /* @__PURE__ */ z(fM, [["__scopeId", "data-v-47e67f04"]]), mM = {
  class: "list-reader",
  "data-list-reader": ""
}, hM = { class: "list-reader-body" }, pM = {
  key: 0,
  class: "list-reader-group"
}, vM = ["title", "aria-current", "data-row", "onClick"], gM = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, yM = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ Bt({
    items: { type: Array, required: !0 },
    listWidth: { type: Number, default: 360 },
    emptyTitle: { type: String, default: "Nothing here yet" },
    pickLine: { type: String, default: "No row chosen" },
    place: { type: Function, default: null }
  }, {
    chosen: { type: [String, Number], default: null },
    chosenModifiers: {}
  }),
  emits: ["update:chosen"],
  setup(e) {
    const t = e, n = Yt(e, "chosen"), a = S(() => t.items.find((f) => f.id === n.value) ?? null), s = S(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Wm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((g) => g.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return Me(() => {
      const f = t.items.find((m) => String(m.id) === da.value.row);
      f && (n.value = f.id);
    }), (f, m) => (r(), d("div", mM, [
      ne(f.$slots, "top", {}, void 0, !0),
      h("div", hM, [
        h("div", {
          class: "list-reader-list",
          style: ye({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? k("", !0) : (r(), D(xt, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: N(() => [
              ne(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(L, null, Q(s.value, (p) => (r(), d(L, { key: p }, [
            p ? (r(), d("p", pM, v(p), 1)) : k("", !0),
            (r(!0), d(L, null, Q(o(p), (g) => ke((r(), d("button", {
              key: g.id,
              type: "button",
              class: Y(["list-reader-row", { on: g.id === n.value }]),
              title: g.title,
              "aria-current": g.id === n.value,
              "data-reader-row": "",
              "data-row": g.id,
              onClick: (b) => l(g)
            }, [
              E(Nw, {
                title: g.title,
                text: g.desc || ""
              }, Sa({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: N(() => [
                    ne(f.$slots, "meta", { item: g }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0,
                f.$slots.line ? {
                  name: "text",
                  fn: N(() => [
                    ne(f.$slots, "line", { item: g }, void 0, !0)
                  ]),
                  key: "1"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, vM)), [
              [B(Dt), e.place ? () => e.place(g) : null]
            ])), 128))
          ], 64))), 128))
        ], 36),
        h("div", gM, [
          a.value ? ne(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), D(xt, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : k("", !0)
        ])
      ])
    ]));
  }
}, PT = /* @__PURE__ */ z(yM, [["__scopeId", "data-v-9ed2647b"]]), bM = {
  class: "reader",
  "data-reader": ""
}, kM = {
  class: "reader-head",
  "data-reader-head": ""
}, wM = { class: "reader-meta" }, $M = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, xM = { class: "reader-title-line" }, SM = { class: "reader-buttons" }, _M = { class: "reader-body" }, MM = {
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
    const n = e, a = t, s = M(((u = n.tabs[0]) == null ? void 0 : u.key) ?? "");
    he(() => n.tabs.map((c) => c.key).join(), () => {
      var c;
      n.tabs.some((f) => f.key === s.value) || (s.value = ((c = n.tabs[0]) == null ? void 0 : c.key) ?? "");
    });
    const o = S(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = S(() => o.value.find((c) => c.key === s.value) ?? null), i = S(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", bM, [
      h("header", kM, [
        h("div", wM, [
          e.number ? (r(), d("span", $M, v(e.number), 1)) : k("", !0),
          ne(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", xM, [
          E(Tu, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", SM, [
            ne(c.$slots, "primary", {}, void 0, !0),
            ne(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), D(T8, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : k("", !0),
      h("div", _M, [
        e.facts.length ? (r(), D(Iu, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : k("", !0),
        ne(c.$slots, "default", { tab: s.value }, void 0, !0)
      ])
    ]));
  }
}, jT = /* @__PURE__ */ z(MM, [["__scopeId", "data-v-75e4d6a3"]]), CM = {
  class: "reader-section",
  "data-reader-section": ""
}, EM = { class: "reader-section-title" }, AM = { class: "reader-section-name" }, OM = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", CM, [
      h("h4", EM, [
        h("span", AM, v(e.title), 1),
        ne(t.$slots, "end", {}, void 0, !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, FT = /* @__PURE__ */ z(OM, [["__scopeId", "data-v-ab40cbe5"]]), TM = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, IM = { class: "reader-timeline-who" }, BM = { class: "reader-timeline-text" }, RM = {
  key: 0,
  class: "reader-timeline-none"
}, LM = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", TM, [
      (r(!0), d(L, null, Q(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", IM, v(a.by), 1),
        E(et, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", BM, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? k("", !0) : (r(), d("li", RM, "None"))
    ]));
  }
}, WT = /* @__PURE__ */ z(LM, [["__scopeId", "data-v-312caab5"]]), HT = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = _e(Le);
    return (n, a) => (r(), D(Ou, {
      model: e.model,
      id: e.id,
      read: B(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, NM = {
  class: "page-card",
  "data-page-card": ""
}, qM = { class: "page-card-head" }, DM = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, PM = { class: "page-card-names" }, jM = ["title"], FM = {
  class: "page-card-state",
  "data-card-state": ""
}, WM = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, HM = ["title"], zM = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, UM = {
  class: "page-card-foot",
  "data-card-foot": ""
}, VM = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", NM, [
      h("header", qM, [
        e.icon ? (r(), d("span", DM, [
          E(oe, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : k("", !0),
        h("span", PM, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, jM),
          h("p", FM, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", WM, [
          ne(t.$slots, "corner", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, HM),
      ne(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", zM, v(e.fault), 1)) : k("", !0),
      h("footer", UM, [
        ne(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, GM = /* @__PURE__ */ z(VM, [["__scopeId", "data-v-89b55585"]]), KM = {
  class: "card-page",
  "data-card-page": ""
}, YM = { class: "card-page-body" }, XM = {
  key: 0,
  class: "card-page-group"
}, QM = { class: "card-page-grid" }, JM = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" }
  },
  setup(e) {
    const t = e, n = M(pa(t.fields)), a = M(""), s = S(() => Tr(t.items, t.fields, n.value, a.value, ["title", "line"])), o = S(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = pa(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", KM, [
      E(Jw, {
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
      E(Rr, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", YM, [
        s.value.length ? k("", !0) : (r(), D(xt, {
          key: 0,
          title: e.items.length ? "No match" : e.emptyTitle
        }, {
          default: N(() => [
            e.items.length ? (r(), D(me, {
              key: 0,
              small: "",
              onClick: i
            }, {
              default: N(() => [...c[2] || (c[2] = [
                V("Clear", -1)
              ])]),
              _: 1
            })) : ne(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(L, null, Q(o.value, (f) => (r(), d(L, { key: f }, [
          f ? (r(), d("p", XM, v(f), 1)) : k("", !0),
          h("div", QM, [
            (r(!0), d(L, null, Q(l(f), (m) => (r(), D(GM, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, Sa({
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
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"]))), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, zT = /* @__PURE__ */ z(JM, [["__scopeId", "data-v-7a1a1305"]]), ZM = {
  class: "table-layout",
  "data-table-layout": ""
}, eC = { class: "table-layout-body" }, tC = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" }
  },
  setup(e) {
    const t = e, n = M(pa(t.fields)), a = M(""), s = S(() => Tr(t.rows, t.fields, n.value, a.value, t.columns.map((i) => i.key))), o = S(() => t.columns.map((i) => i.label)), l = S(() => s.value.map((i) => ({ cells: t.columns.map((u) => i[u.key] ?? ""), open: i.ref ?? "", tone: i.tone ?? "" })));
    return (i, u) => (r(), d("div", ZM, [
      E(Rr, {
        modelValue: n.value,
        "onUpdate:modelValue": u[0] || (u[0] = (c) => n.value = c),
        words: a.value,
        "onUpdate:words": u[1] || (u[1] = (c) => a.value = c),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", eC, [
        E(vr, {
          columns: o.value,
          rows: l.value,
          empty: e.empty,
          onOpen: B(Fe)
        }, null, 8, ["columns", "rows", "empty", "onOpen"])
      ])
    ]));
  }
}, UT = /* @__PURE__ */ z(tC, [["__scopeId", "data-v-32f1bba5"]]), nC = ["id", "onUpdate:modelValue", "data-field"], aC = ["value"], sC = ["data-refused"], oC = {
  class: "create-command",
  "data-command-preview": ""
}, lC = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, iC = { class: "create-actions" }, rC = {
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
    const n = e, a = t, s = (g) => g.value ?? (g.kind === "select" ? g.options[0][0] : ""), o = M(Object.fromEntries(n.fields.map((g) => [g.key, s(g)]))), l = M({}), i = M(""), u = M(!1), c = S(() => n.fields.filter((g) => !g.when || g.when(o.value))), f = S(() => c.value.every((g) => !g.required || String(o.value[g.key]).trim())), m = S(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const g = await n.run(o.value);
      u.value = !1, i.value = g.ok ? "" : g.error, g.ok && (a("done", o.value), a("close"));
    }
    return (g, b) => (r(), D(An, {
      padded: "",
      title: e.title,
      fits: "",
      small: "",
      sheet: "",
      onClose: b[1] || (b[1] = (w) => a("close"))
    }, {
      default: N(() => [
        h("form", {
          class: "create-dialog",
          "data-create-dialog": "",
          onSubmit: ge(p, ["prevent"])
        }, [
          (r(!0), d(L, null, Q(c.value, (w) => (r(), D(Ai, {
            key: w.key,
            label: w.label,
            help: w.help,
            for: `create-${w.key}`
          }, {
            default: N(() => [
              w.kind === "select" ? ke((r(), d("select", {
                key: 0,
                id: `create-${w.key}`,
                "onUpdate:modelValue": (C) => o.value[w.key] = C,
                "data-field": w.key
              }, [
                (r(!0), d(L, null, Q(w.options, ([C, A]) => (r(), d("option", {
                  key: C,
                  value: C
                }, v(A), 9, aC))), 128))
              ], 8, nC)), [
                [Rt, o.value[w.key]]
              ]) : w.kind === "slot" ? ne(g.$slots, w.key, {
                value: o.value[w.key],
                values: o.value,
                set: (C) => o.value[w.key] = C
              }, void 0, !0, 1) : w.kind === "area" ? (r(), D(Oi, {
                key: 2,
                id: `create-${w.key}`,
                value: o.value[w.key],
                placeholder: w.placeholder,
                "data-field": w.key,
                onInput: (C) => o.value[w.key] = C.target.value
              }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])) : (r(), D(Vw, {
                key: 3,
                id: `create-${w.key}`,
                type: w.kind === "password" ? "password" : w.kind === "number" ? "number" : "text",
                "model-value": String(o.value[w.key]),
                placeholder: w.placeholder,
                "data-field": w.key,
                "onUpdate:modelValue": (C) => o.value[w.key] = C
              }, null, 8, ["id", "type", "model-value", "placeholder", "data-field", "onUpdate:modelValue"])),
              l.value[w.key] ? (r(), d("p", {
                key: 4,
                class: "create-refusal",
                role: "alert",
                "data-refused": w.key
              }, v(l.value[w.key]), 9, sC)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", oC, v(m.value), 1),
          i.value ? (r(), d("p", lC, v(i.value), 1)) : k("", !0),
          h("div", iC, [
            E(me, {
              small: "",
              onClick: b[0] || (b[0] = (w) => a("close"))
            }, {
              default: N(() => [...b[2] || (b[2] = [
                V("Cancel", -1)
              ])]),
              _: 1
            }),
            E(me, {
              variant: "primary",
              small: "",
              type: "submit",
              disabled: !f.value || u.value,
              busy: u.value,
              "data-create-send": ""
            }, {
              default: N(() => [
                V(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 3
    }, 8, ["title"]));
  }
}, VT = /* @__PURE__ */ z(rC, [["__scopeId", "data-v-550764d3"]]), uC = Symbol.for("journal.toast"), cC = Symbol.for("journal.page-toasts");
function GT() {
  const e = _e(uC, null);
  if (!e) throw new Error("useToast is called only inside a page that shows toasts");
  return e.raise;
}
const dC = ["aria-selected", "data-tab", "onPointerdown", "onAuxclick", "onKeydown"], fC = { class: "pane-tab-label" }, mC = ["aria-label", "onClick"], hC = 1, pC = {
  __name: "EditorTabs",
  props: { tabs: { type: Array, required: !0 }, insertAt: { type: Number, default: -1 }, extra: { type: Function, default: () => [] } },
  emits: ["pick", "close", "grab"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), o = M(!1);
    let l = null;
    async function i() {
      o.value = !1, await Ne(), s.value && (o.value = s.value.scrollWidth > s.value.clientWidth);
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
    return he(() => n.tabs.map((f) => `${f.title}:${f.count ?? ""}`).join("|"), i), Me(() => {
      i(), !(typeof ResizeObserver > "u") && (l = new ResizeObserver(i), l.observe(s.value));
    }), tt(() => l == null ? void 0 : l.disconnect()), (f, m) => (r(), d("div", {
      class: Y(["pane-tabs", { compact: o.value }])
    }, [
      h("div", {
        ref_key: "row",
        ref: s,
        class: "pane-tabs-row",
        role: "tablist"
      }, [
        (r(!0), d(L, null, Q(e.tabs, (p, g) => ke((r(), d("div", {
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
          onMousedown: m[1] || (m[1] = ge(() => {
          }, ["middle", "prevent"])),
          onAuxclick: (b) => b.button === hC && (a("close", p.key), b.preventDefault()),
          onKeydown: [
            Ue(ge((b) => a("pick", p.key), ["prevent"]), ["enter"]),
            Ue(ge((b) => a("pick", p.key), ["prevent"]), ["space"]),
            Ue(ge((b) => a("close", p.key), ["prevent"]), ["delete"])
          ]
        }, [
          E(St, {
            name: p.icon
          }, null, 8, ["name"]),
          h("span", fC, v(p.title), 1),
          p.count !== void 0 ? (r(), d("span", {
            key: 0,
            class: Y(["pane-tab-n", { hot: p.hot }])
          }, v(p.count), 3)) : k("", !0),
          h("button", {
            type: "button",
            class: "pane-tab-x",
            tabindex: "-1",
            "aria-label": `Close ${p.title}`,
            onPointerdown: m[0] || (m[0] = ge(() => {
            }, ["stop"])),
            onClick: ge((b) => a("close", p.key), ["stop"])
          }, [
            E(oe, {
              name: "x",
              size: 10
            })
          ], 40, mC)
        ], 42, dC)), [
          [B(Dt), () => c(p, g)]
        ])), 128))
      ], 512),
      ne(f.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, KT = /* @__PURE__ */ z(pC, [["__scopeId", "data-v-6b328f63"]]), vC = ["open", "copy", "own", "delete"], gC = (e) => e.danger ? "delete" : e.group ?? "own";
function yC(e) {
  return vC.map((n) => e.filter((a) => gC(a) === n)).filter((n) => n.length).flatMap((n, a) => [
    ...a ? [{ separator: !0, key: `separator-${a}` }] : [],
    ...n.map((s, o) => ({ ...s, key: `${a}-${o}` }))
  ]);
}
function bC() {
  const e = M(null);
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
const kC = {
  key: 0,
  class: "context-head",
  "data-context-head": ""
}, wC = {
  key: 0,
  class: "context-separator",
  role: "separator",
  "data-context-separator": ""
}, $C = { class: "context-label" }, xC = {
  key: 0,
  class: "context-note",
  "data-context-reason": ""
}, SC = {
  key: 1,
  class: "context-note",
  "aria-hidden": "true"
}, _C = {
  key: 2,
  class: "context-note"
}, MC = ".context-menu", CC = {
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
    const n = e, a = t, s = S(() => yC(n.items)), o = M(null), l = M(""), i = (_) => [..._.querySelectorAll("[data-menu-item]:not(:disabled)")], u = (_, j) => {
      var F;
      return (F = j(i(_))) == null ? void 0 : F.focus();
    }, c = (_) => s.value.find((j) => j.key === (_ == null ? void 0 : _.dataset.menuItem));
    function f(_, j) {
      if (!_.disabled) {
        if (_.children) {
          const F = j.getBoundingClientRect();
          o.value = { items: _.children, at: { x: F.right + 2, y: F.top - 4, flipX: F.left - 2 }, opener: j };
          return;
        }
        if (_.danger && l.value !== _.key) {
          l.value = _.key;
          return;
        }
        a("close", !0), _.run && setTimeout(_.run, 0);
      }
    }
    function m(_, j) {
      if (j.focus(), _.children && !_.disabled) return f(_, j);
      o.value = null;
    }
    function p(_, j) {
      var G;
      const F = i(_);
      (G = F.slice(F.indexOf(document.activeElement) + 1).concat(F).find((P) => c(P).label.toLowerCase().startsWith(j.toLowerCase()))) == null || G.focus();
    }
    const g = {
      Home: (_) => u(_, (j) => j[0]),
      End: (_) => u(_, (j) => j[j.length - 1]),
      Enter: () => document.activeElement.click(),
      " ": () => document.activeElement.click(),
      ArrowRight: (_) => {
        var j;
        return ((j = c(document.activeElement)) == null ? void 0 : j.children) && document.activeElement.click();
      },
      ArrowLeft: () => n.depth && a("close", !1),
      Tab: () => a("close", !1)
    };
    function b(_) {
      const j = _.currentTarget, F = j.contains(document.activeElement) && document.activeElement.dataset.menuItem !== void 0;
      g[_.key] && (F || !["Enter", " ", "ArrowRight"].includes(_.key)) ? (_.preventDefault(), g[_.key](j)) : _.key.length === 1 && !_.ctrlKey && !_.metaKey && !_.altKey && p(j, _.key);
    }
    function w(_) {
      var j, F;
      (F = (j = _.target).closest) != null && F.call(j, MC) || a("close", !1);
    }
    const C = () => a("close", !1), A = (_) => {
      const j = o.value.opener;
      o.value = null, _ ? a("close", !0) : j.focus();
    };
    return Me(() => {
      var _;
      (_ = n.target) == null || _.classList.add("menu-target"), !n.depth && (window.addEventListener("pointerdown", w, !0), window.addEventListener("scroll", w, !0), window.addEventListener("blur", C), window.addEventListener("resize", C));
    }), Re(() => {
      var _;
      (_ = n.target) == null || _.classList.remove("menu-target"), window.removeEventListener("pointerdown", w, !0), window.removeEventListener("scroll", w, !0), window.removeEventListener("blur", C), window.removeEventListener("resize", C);
    }), (_, j) => {
      const F = ti("ContextMenu", !0);
      return r(), D(Pt, {
        class: "context-menu",
        role: "menu",
        "data-context-menu": "",
        point: e.at,
        gap: 0,
        "min-width": 196,
        "max-width": 320,
        "aria-label": e.head,
        onClose: j[0] || (j[0] = (T) => a("close", !1)),
        onKeydown: b,
        onContextmenu: j[1] || (j[1] = ge(() => {
        }, ["prevent"]))
      }, {
        default: N(() => [
          e.head && !e.depth ? (r(), d("p", kC, v(e.head), 1)) : k("", !0),
          (r(!0), d(L, null, Q(s.value, (T) => (r(), d(L, {
            key: T.key
          }, [
            T.separator ? (r(), d("hr", wC)) : (r(), D(He, {
              key: 1,
              role: "menuitem",
              class: Y({ "context-danger": T.danger, "context-armed": l.value === T.key }),
              disabled: T.disabled,
              "aria-haspopup": T.children ? "menu" : void 0,
              title: T.disabled ? T.reason : void 0,
              "data-menu-item": T.key,
              onClick: (G) => f(T, G.currentTarget),
              onMouseenter: (G) => m(T, G.currentTarget)
            }, {
              default: N(() => [
                h("span", $C, v(l.value === T.key ? T.armedLabel ?? `${T.label}: click again` : T.label), 1),
                T.disabled ? (r(), d("span", xC, v(T.reason), 1)) : T.children ? (r(), d("span", SC, "›")) : T.keys ? (r(), d("kbd", _C, v(T.keys), 1)) : k("", !0)
              ]),
              _: 2
            }, 1032, ["class", "disabled", "aria-haspopup", "title", "data-menu-item", "onClick", "onMouseenter"]))
          ], 64))), 128)),
          o.value ? (r(), D(F, {
            key: 1,
            depth: e.depth + 1,
            at: o.value.at,
            items: o.value.items,
            onClose: A
          }, null, 8, ["depth", "at", "items"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["point", "aria-label"]);
    };
  }
}, EC = /* @__PURE__ */ z(CC, [["__scopeId", "data-v-62125456"]]), YT = {
  __name: "ActionsMenu",
  props: { items: { type: Array, required: !0 }, head: { type: String, default: "" }, label: { type: String, default: "Actions" } },
  setup(e) {
    const t = e, { menu: n, show: a, close: s } = bC(), o = (u, c = null) => {
      var f;
      return (f = globalThis[cC]) == null ? void 0 : f.raise(u, c);
    }, l = (u) => u.map((c) => ({ ...c, run: c.run && (() => c.run({ say: o })), children: c.children && l(c.children) }));
    function i(u) {
      const c = u.currentTarget.getBoundingClientRect();
      a({ x: c.left, y: c.bottom + 2, flipX: c.right }, t.head, l(t.items), u.currentTarget);
    }
    return (u, c) => (r(), d(L, null, [
      E(me, {
        small: "",
        "aria-haspopup": "menu",
        "aria-expanded": !!B(n),
        "data-actions-menu": "",
        onClick: i
      }, {
        default: N(() => [
          V(v(e.label), 1),
          E(oe, {
            name: "chevronRight",
            size: 11,
            facing: "down"
          })
        ]),
        _: 1
      }, 8, ["aria-expanded"]),
      B(n) ? (r(), D(EC, De({ key: 0 }, B(n), { onClose: B(s) }), null, 16, ["onClose"])) : k("", !0)
    ], 64));
  }
}, AC = ["data-comment"], OC = { class: "comment-who" }, TC = { key: 0 }, IC = {
  key: 1,
  class: "badge-quiet",
  "data-comment-outdated": ""
}, BC = { key: 0 }, RC = { class: "comment-text" }, LC = {
  key: 1,
  class: "comment-who comment-reply"
}, NC = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment": e.comment.id,
      onClick: n[0] || (n[0] = (a) => t.$emit("show"))
    }, [
      h("div", OC, [
        h("span", {
          class: Y(["comment-by", { agent: e.comment.agent }])
        }, v(e.comment.by), 3),
        e.comment.at ? (r(), d("span", TC, v(e.comment.at), 1)) : k("", !0),
        e.comment.outdated ? (r(), d("span", IC, "Lines changed")) : k("", !0)
      ]),
      e.comment.quote ? (r(), d("blockquote", BC, v(e.comment.quote), 1)) : k("", !0),
      h("p", RC, v(e.comment.text), 1),
      e.comment.reply ? (r(), d("div", LC, [
        h("span", null, [
          h("b", null, v(e.comment.reply.by), 1),
          V(": " + v(e.comment.reply.text), 1)
        ])
      ])) : k("", !0)
    ], 10, AC));
  }
}, qC = /* @__PURE__ */ z(NC, [["__scopeId", "data-v-390d0c5e"]]), DC = { class: "rail-head" }, PC = { class: "rail-count" }, jC = { class: "rail-list" }, FC = {
  key: 0,
  class: "rail-empty"
}, WC = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, floating: Boolean, empty: { type: String, default: "No comments" } },
  emits: ["show", "close"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { floating: e.floating }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", DC, [
        n[1] || (n[1] = h("h3", null, "Comments", -1)),
        h("span", PC, v(e.comments.length), 1),
        n[2] || (n[2] = h("span", { class: "rail-grow" }, null, -1)),
        E(me, {
          small: "",
          title: "Hide",
          "aria-label": "Hide the comments",
          "data-rail-close": "",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        }, {
          default: N(() => [
            E(oe, {
              name: "close",
              size: 12
            })
          ]),
          _: 1
        })
      ]),
      h("div", jC, [
        e.comments.length ? k("", !0) : (r(), d("p", FC, v(e.empty), 1)),
        (r(!0), d(L, null, Q(e.comments, (a) => (r(), D(qC, {
          key: a.id,
          comment: a,
          hot: e.hot === a.id,
          onShow: (s) => t.$emit("show", a.id)
        }, null, 8, ["comment", "hot", "onShow"]))), 128))
      ])
    ], 2));
  }
}, XT = /* @__PURE__ */ z(WC, [["__scopeId", "data-v-1c625f14"]]), HC = {
  class: "comment-dock",
  "data-comment-box": ""
}, zC = { class: "comment-box" }, UC = ["onKeydown"], VC = {
  key: 0,
  class: "box-quote",
  "data-box-quote": ""
}, GC = { class: "box-quote-words" }, KC = { class: "box-actions" }, YC = {
  key: 1,
  class: "box-closed"
}, XC = {
  __name: "CommentBox",
  props: { count: { type: Number, default: 0 }, quote: { type: String, default: "" }, placeholder: { type: String, default: "Comment on this file, or pick lines first" }, sending: Boolean },
  emits: ["send", "show", "clear-quote"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = M(!1), l = M(""), i = M(null);
    he(() => a.quote, (f) => f && u());
    async function u() {
      var f;
      o.value = !0, await Ne(), (f = i.value) == null || f.focus();
    }
    t({ openBox: u });
    function c() {
      const f = l.value.trim();
      !f || a.sending || (s("send", f), l.value = "", o.value = !1);
    }
    return (f, m) => (r(), d("div", HC, [
      h("div", zC, [
        o.value ? (r(), d("form", {
          key: 0,
          class: "box-form",
          onSubmit: ge(c, ["prevent"]),
          onKeydown: [
            m[3] || (m[3] = Ue(ge((p) => o.value = !1, ["stop"]), ["esc"])),
            Ue(ge(c, ["meta", "prevent"]), ["enter"]),
            Ue(ge(c, ["ctrl", "prevent"]), ["enter"])
          ]
        }, [
          e.quote ? (r(), d("div", VC, [
            m[5] || (m[5] = h("b", null, "On", -1)),
            h("span", GC, v(e.quote), 1),
            h("button", {
              type: "button",
              class: "box-quote-clear",
              title: "Whole file",
              "aria-label": "Whole file",
              onClick: m[0] || (m[0] = (p) => s("clear-quote"))
            }, [
              E(oe, {
                name: "close",
                size: 10
              })
            ])
          ])) : k("", !0),
          ke(h("textarea", {
            ref_key: "field",
            ref: i,
            "onUpdate:modelValue": m[1] || (m[1] = (p) => l.value = p),
            placeholder: "Comment",
            "aria-label": "Comment",
            "data-box-field": ""
          }, null, 512), [
            [Ye, l.value]
          ]),
          h("div", KC, [
            E(me, {
              small: "",
              onClick: m[2] || (m[2] = (p) => o.value = !1)
            }, {
              default: N(() => [...m[6] || (m[6] = [
                V("Cancel", -1)
              ])]),
              _: 1
            }),
            E(me, {
              small: "",
              variant: "primary",
              disabled: !l.value.trim() || e.sending,
              "data-box-send": "",
              onClick: c
            }, {
              default: N(() => [...m[7] || (m[7] = [
                V("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ], 40, UC)) : (r(), d("div", YC, [
          h("button", {
            type: "button",
            class: "box-open",
            "data-box-open": "",
            onClick: u
          }, [
            E(oe, {
              name: "chat",
              size: 13
            }),
            h("span", null, v(e.placeholder), 1)
          ]),
          e.count > 0 ? (r(), D(me, {
            key: 0,
            small: "",
            title: "Comments",
            "aria-label": "Show the comments",
            "data-box-count": "",
            onClick: m[4] || (m[4] = (p) => s("show"))
          }, {
            default: N(() => [
              E(oe, {
                name: "chat",
                size: 13
              }),
              V(v(e.count), 1)
            ]),
            _: 1
          })) : k("", !0)
        ]))
      ])
    ]));
  }
}, QT = /* @__PURE__ */ z(XC, [["__scopeId", "data-v-b494c444"]]), JT = Wu(() => import("./VoiceFigure-lt-truzu.js").then((e) => e.V)), ZT = "1.2.0", eI = "3.5";
export {
  Nm as $,
  Ie as A,
  qe as B,
  Ta as C,
  ht as D,
  zO as E,
  _4 as F,
  RA as G,
  jO as H,
  o4 as I,
  I4 as J,
  Ft as K,
  eE as L,
  Ao as M,
  D4 as N,
  T4 as O,
  Oa as P,
  lO as Q,
  mA as R,
  oa as S,
  dO as T,
  oA as U,
  Be as V,
  ga as W,
  sA as X,
  aA as Y,
  Lm as Z,
  z as _,
  YE as a,
  EO as a$,
  N4 as a0,
  hA as a1,
  pA as a2,
  Le as a3,
  MA as a4,
  _A as a5,
  Nt as a6,
  vA as a7,
  DA as a8,
  DE as a9,
  kO as aA,
  aO as aB,
  Kx as aC,
  WA as aD,
  HA as aE,
  UO as aF,
  uu as aG,
  cO as aH,
  Ln as aI,
  zE as aJ,
  FE as aK,
  RO as aL,
  Nn as aM,
  DO as aN,
  BA as aO,
  sO as aP,
  oO as aQ,
  nO as aR,
  xn as aS,
  It as aT,
  PE as aU,
  D5 as aV,
  eO as aW,
  dA as aX,
  iu as aY,
  Jt as aZ,
  sn as a_,
  AO as aa,
  NO as ab,
  GE as ac,
  lA as ad,
  iA as ae,
  xA as af,
  SA as ag,
  CA as ah,
  ZE as ai,
  Wl as aj,
  gA as ak,
  qA as al,
  YO as am,
  XA as an,
  KA as ao,
  GA as ap,
  EA as aq,
  wA as ar,
  kA as as,
  $A as at,
  uO as au,
  NA as av,
  PA as aw,
  JO as ax,
  fn as ay,
  jA as az,
  Y4 as b,
  QO as b$,
  w4 as b0,
  qO as b1,
  hO as b2,
  mO as b3,
  rx as b4,
  Kr as b5,
  _O as b6,
  LA as b7,
  Ra as b8,
  yt as b9,
  vO as bA,
  $O as bB,
  $t as bC,
  fO as bD,
  xO as bE,
  FA as bF,
  QA as bG,
  zA as bH,
  je as bI,
  IA as bJ,
  SO as bK,
  lT as bL,
  iT as bM,
  NE as bN,
  F5 as bO,
  OA as bP,
  gO as bQ,
  XE as bR,
  KO as bS,
  pO as bT,
  yO as bU,
  bO as bV,
  AA as bW,
  Yx as bX,
  TA as bY,
  VA as bZ,
  GO as b_,
  wO as ba,
  ls as bb,
  Qi as bc,
  eT as bd,
  aT as be,
  rO as bf,
  BO as bg,
  qE as bh,
  YA as bi,
  tT as bj,
  yA as bk,
  bA as bl,
  tA as bm,
  fA as bn,
  HE as bo,
  TO as bp,
  QE as bq,
  JE as br,
  nA as bs,
  ZA as bt,
  B5 as bu,
  PO as bv,
  O4 as bw,
  eA as bx,
  UE as by,
  JA as bz,
  ix as c,
  Ns as c$,
  WE as c0,
  jE as c1,
  UA as c2,
  sT as c3,
  Ro as c4,
  oT as c5,
  Su as c6,
  IO as c7,
  uA as c8,
  rA as c9,
  IT as cA,
  LE as cB,
  gE as cC,
  r0 as cD,
  to as cE,
  KT as cF,
  xt as cG,
  sS as cH,
  $o as cI,
  rT as cJ,
  Rr as cK,
  u2 as cL,
  JC as cM,
  an as cN,
  Ai as cO,
  RT as cP,
  t1 as cQ,
  gi as cR,
  oe as cS,
  Ei as cT,
  T8 as cU,
  cE as cV,
  ZT as cW,
  eI as cX,
  PT as cY,
  Nw as cZ,
  ST as c_,
  q5 as ca,
  VE as cb,
  E4 as cc,
  tO as cd,
  Mo as ce,
  Hx as cf,
  iO as cg,
  mn as ch,
  Kt as ci,
  YT as cj,
  Gt as ck,
  pE as cl,
  yE as cm,
  yn as cn,
  wT as co,
  me as cp,
  ym as cq,
  co as cr,
  zT as cs,
  Ma as ct,
  QT as cu,
  qC as cv,
  XT as cw,
  VT as cx,
  o0 as cy,
  An as cz,
  Ze as d,
  Xt as d$,
  TE as d0,
  B$ as d1,
  ct as d2,
  He as d3,
  wt as d4,
  Pt as d5,
  bE as d6,
  SE as d7,
  iE as d8,
  id as d9,
  _t as dA,
  gy as dB,
  zd as dC,
  jp as dD,
  AE as dE,
  lE as dF,
  tn as dG,
  xT as dH,
  UT as dI,
  $T as dJ,
  $_ as dK,
  LT as dL,
  NT as dM,
  Aa as dN,
  Oi as dO,
  Vw as dP,
  et as dQ,
  JT as dR,
  DT as dS,
  bo as dT,
  hT as dU,
  Xs as dV,
  o1 as dW,
  go as dX,
  dE as dY,
  Ef as dZ,
  lr as d_,
  m$ as da,
  ha as db,
  GM as dc,
  Jw as dd,
  TT as de,
  fE as df,
  mE as dg,
  hE as dh,
  wE as di,
  BT as dj,
  qT as dk,
  hr as dl,
  jT as dm,
  HT as dn,
  FT as dp,
  WT as dq,
  Nd as dr,
  bT as ds,
  Mb as dt,
  oE as du,
  BE as dv,
  Br as dw,
  Lt as dx,
  _E as dy,
  nt as dz,
  cA as e,
  U8 as e$,
  In as e0,
  df as e1,
  Tr as e2,
  AT as e3,
  ET as e4,
  no as e5,
  cf as e6,
  Zs as e7,
  Qt as e8,
  cl as e9,
  kE as eA,
  ud as eB,
  cT as eC,
  Nr as eD,
  fT as eE,
  oi as eF,
  $E as eG,
  m1 as eH,
  kn as eI,
  sE as eJ,
  f1 as eK,
  Ua as eL,
  nE as eM,
  vn as eN,
  so as eO,
  mf as eP,
  uE as eQ,
  kt as eR,
  ME as eS,
  d8 as eT,
  ZC as eU,
  tE as eV,
  kT as eW,
  ur as eX,
  _T as eY,
  qr as eZ,
  bi as e_,
  pa as ea,
  vE as eb,
  OT as ec,
  RE as ed,
  CE as ee,
  pi as ef,
  Xc as eg,
  Qc as eh,
  K2 as ei,
  IE as ej,
  OE as ek,
  dT as el,
  cp as em,
  uT as en,
  aE as eo,
  MT as ep,
  M$ as eq,
  Er as er,
  Mr as es,
  rE as et,
  EE as eu,
  xE as ev,
  mT as ew,
  pT as ex,
  Fe as ey,
  i1 as ez,
  I5 as f,
  Qs as f0,
  vT as f1,
  ws as f2,
  gT as f3,
  GT as f4,
  yT as f5,
  it as f6,
  Dt as f7,
  CT as f8,
  ff as f9,
  ZO as g,
  Sn as h,
  FO as i,
  nT as j,
  WO as k,
  OO as l,
  e8 as m,
  Oo as n,
  LO as o,
  KE as p,
  HO as q,
  $u as r,
  xu as s,
  Oe as t,
  cx as u,
  MO as v,
  XO as w,
  CO as x,
  Dn as y,
  VO as z
};
