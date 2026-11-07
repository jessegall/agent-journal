/* @code-commandments-generated */
import { openBlock as c, createElementBlock as f, normalizeStyle as ve, unref as N, renderSlot as me, createElementVNode as p, normalizeClass as Y, Fragment as j, renderList as te, defineComponent as Bi, Comment as Li, h as sa, cloneVNode as Ni, createBlock as F, withCtx as D, createVNode as T, toDisplayString as v, createCommentVNode as w, ref as C, onMounted as Ee, onBeforeUnmount as Qe, reactive as Wt, shallowRef as Ye, watch as pe, onUnmounted as Be, inject as Te, useAttrs as oa, computed as R, resolveDynamicComponent as gt, mergeProps as De, useId as xs, resolveDirective as Di, withDirectives as qe, createTextVNode as ee, Teleport as la, nextTick as Xe, Transition as Ht, withModifiers as $e, createApp as qi, shallowReactive as Pi, onScopeDispose as ra, useModel as an, mergeModels as Dt, withKeys as qt, vModelText as _t, resolveComponent as ji, provide as yl, onErrorCaptured as Fi, TransitionGroup as bl, isRef as to, getCurrentInstance as Wi, getCurrentScope as kl, toHandlers as Hi, createSlots as Ui, vShow as wl, useSlots as zi, normalizeProps as Vi, guardReactiveProps as Gi, defineAsyncComponent as Ki } from "vue";
function $l(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const V = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Yi = 1600, Ji = {
  __name: "Shimmer",
  setup(e) {
    const t = $l(Yi);
    return (n, a) => (c(), f("span", {
      class: "shimmer",
      style: ve(N(t))
    }, null, 4));
  }
}, Xt = /* @__PURE__ */ V(Ji, [["__scopeId", "data-v-6c018b03"]]), Qi = { class: "skeleton-line" }, Xi = 2e3, Zi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = $l(Xi);
    return (n, a) => (c(), f("span", Qi, [
      me(n.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (c(!0), f(j, null, te(e.bars, (s) => (c(), f("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ve({ ...N(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, vt = /* @__PURE__ */ V(Zi, [["__scopeId", "data-v-484fe8a0"]]), Ut = Bi({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Li);
      return a.length !== 1 ? sa(j, { key: n }, a) : a[0].key == null ? Ni(a[0], { key: n }) : a[0];
    };
  }
}), ec = ["aria-label"], tc = ["aria-label"], nc = ["aria-label"], ac = ["aria-label"], sc = ["aria-label"], oc = ["aria-label"], lc = ["aria-label"], rc = {
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
    return (i, d) => (c(), F(Ut, { value: e.shape }, {
      messages: D(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), f(j, null, te(t, (u) => T(Xt, {
            key: u.id,
            class: Y(["skeleton-message", { mine: u.mine }]),
            style: ve({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ec)
      ]),
      older: D(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(j, null, te(t.slice(0, 3), (u) => (c(), F(Xt, {
            key: u.id,
            class: Y(["skeleton-message", { mine: u.mine }]),
            style: ve({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, tc)
      ]),
      cards: D(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(j, null, te(e.count, (u) => (c(), f("div", {
            key: u,
            class: "skeleton-card"
          }, [
            (c(), f(j, null, te(n, (h) => T(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, nc)
      ]),
      file: D(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(j, null, te(e.count, (u) => (c(), f("div", {
            key: u,
            class: "skeleton-file"
          }, [
            T(vt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), f(j, null, te(s, (h) => T(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ac)
      ]),
      page: D(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          T(vt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), f(j, null, te(e.count, (u) => (c(), F(vt, {
            key: u,
            bars: N(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, sc)
      ]),
      text: D(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(j, null, te(e.count, (u) => (c(), F(vt, {
            key: u,
            bars: N(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, oc)
      ]),
      default: D(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(j, null, te(e.count, (u) => (c(), F(vt, {
            key: u,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, lc)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ze = /* @__PURE__ */ V(rc, [["__scopeId", "data-v-ef519c5f"]]), ic = {
  key: 1,
  class: "empty-state titled"
}, cc = { class: "empty-state-title" }, uc = { class: "empty-state-text" }, dc = {
  key: 2,
  class: "empty-state"
}, fc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), F(Ze, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), f("div", ic, [
      p("p", cc, v(e.title), 1),
      p("p", uc, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), f("p", dc, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, sn = /* @__PURE__ */ V(fc, [["__scopeId", "data-v-b27e89b0"]]), hc = { class: "fold-group" }, mc = ["aria-expanded"], pc = { class: "fold-label" }, gc = {
  key: 0,
  class: "fold-count"
}, vc = {
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
    return (a, s) => (c(), f("div", hc, [
      p("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        p("span", pc, v(e.label), 1),
        e.count !== "" ? (c(), f("span", gc, v(e.count), 1)) : w("", !0),
        p("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, mc),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, L8 = /* @__PURE__ */ V(vc, [["__scopeId", "data-v-9ef1865c"]]), yc = 150, bc = () => yc;
function Ss(e, t, n = bc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function kc(e, t, n) {
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
const wc = 50, no = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function N8(e) {
  const t = Ue().sources.find((n) => n.key === e);
  return t ? es(t.read, t.events) : es("", []);
}
function xl(e, t, n, a, s = () => !1) {
  const o = C([]), l = C(null), r = C(""), i = C(!1), d = performance.now(), u = C(!1), h = C(""), m = C(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function S(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((_) => setTimeout(() => _(A()), wc)))) : M(g);
  }
  async function A() {
    const g = new Set(y);
    y.clear(), b = null;
    const _ = P, E = await t({ ids: [...g].join(","), limit: g.size });
    if (_ !== P) return;
    if (!E.ok) return I();
    const B = new Map(E.value.rows.map((H) => [H.id, H]));
    o.value = o.value.flatMap((H) => g.has(H.id) ? B.has(H.id) ? [B.get(H.id)] : [] : [H]);
  }
  async function M(g) {
    const _ = P, E = await t({ "before-id": g + 1, limit: 1 });
    if (_ !== P) return;
    if (!E.ok) return I();
    const B = E.value.rows.find((H) => H.id === g);
    o.value = B ? o.value.map((H) => H.id === g ? B : H) : o.value.filter((H) => H.id !== g);
  }
  async function q(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((se) => se.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((se) => se.id === g.row_id)) return S(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return I();
    const E = Math.max(...o.value.map((se) => se.id)), B = P, H = await t({ "after-id": E });
    if (B !== P) return;
    if (!H.ok) return I();
    const X = new Set(o.value.map((se) => se.id));
    o.value = [...H.value.rows.filter((se) => !X.has(se.id)), ...o.value];
  }
  async function U() {
    if (!u.value || !o.value.length) return !1;
    const g = P, _ = Math.min(...o.value.map((H) => H.id)), E = await t({ "before-id": _ });
    if (g !== P) return !1;
    if (!E.ok || !E.value.rows.length) return u.value = !1;
    u.value = no(E.value, n());
    const B = new Set(o.value.map((H) => H.id));
    return o.value = [...o.value, ...E.value.rows.filter((H) => !B.has(H.id))], !0;
  }
  let P = 0;
  function L(g, _) {
    var H, X;
    const E = g.ok ? e.shared ? [g.value] : ((H = g.value) == null ? void 0 : H.rows) ?? [] : [];
    g.ok && (o.value = _(E)), l.value = g.ok ? g.value : null;
    const B = E.length ? Math.min(...E.map((se) => se.id)) : 0;
    g.ok && ((X = g.value) != null && X.rows) && !o.value.some((se) => se.id < B) && (u.value = !e.shared && no(g.value, n())), r.value = g.ok ? "" : g.error, Ss(d, () => i.value = !0);
  }
  async function W(g) {
    const _ = ++P, E = await t({});
    _ === P && L(E, g);
  }
  const O = (g) => {
    if (!a() || !g.length) return g;
    const _ = Math.min(...g.map((B) => B.id)), E = Math.max(...g.map((B) => B.id));
    return [...o.value.filter((B) => B.id > E), ...g, ...o.value.filter((B) => B.id < _)];
  }, I = () => W(O), x = (g) => L(g, O), k = () => W((g) => g);
  async function $(g, _ = null) {
    const E = await kc(_ && { target: o, fields: { value: _(o.value) } }, g, e.run);
    return h.value = E.ok ? "" : E.error, m.value = E.ok ? E.value : null, await I(), E;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: u, load: I, loadLatest: k, older: U, act: $, actionFailure: h, answer: m, context: e, heard: q, showFirst: x };
}
const $c = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function es(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = Ue(), l = xl(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${$c(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const xc = 2e3;
function _s(e, t, n = xc) {
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
  Ee(async () => {
    document.addEventListener("visibilitychange", d), await l(e), i();
  }), Qe(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", d);
  });
}
const Sl = typeof document < "u" && document.documentElement.classList.contains("phone"), _l = 120;
var gl;
const ka = globalThis[gl = Symbol.for("journal.pressed")] ?? (globalThis[gl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Sc(e = 0) {
  const t = ka.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ka.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ka.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function ts(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ml(e = window) {
  if (!ts(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    ts(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ns = "journal.stale-build-reload", _c = 'script[type="module"][src*="/assets/index-"]', ao = (e) => {
  var t;
  return ((t = e.querySelector(_c)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Mc(e = document, t = (a, s) => _e.quietRead(a, s), n = () => Ml(window)) {
  const a = ao(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = ao(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let wa = "";
function Cc(e, t = () => Ml(window)) {
  if (!e) return !1;
  const n = !!wa && wa !== e;
  return wa = e, n && t(), n;
}
const Ec = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ac(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ns) === e.message) return !1;
    t.setItem(ns, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Oc(e = window.sessionStorage) {
  try {
    e.removeItem(ns);
  } catch {
    return;
  }
}
const Tc = 2e3, Ic = 3e4, ze = Wt({ starting: !1, external: !1, late: !1, offline: !1 }), Ms = () => ze.starting, Rc = 3;
let Sn = 0, as = 0, Cl = 0, El = [];
async function Bc() {
  try {
    const e = await _e.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let so = null;
const Lc = () => so ?? (so = Bc().finally(() => so = null));
function Nc() {
  clearTimeout(as), clearTimeout(Cl), as = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), El.splice(0).forEach((e) => e()), Mc();
}
async function Dc() {
  ze.offline = !navigator.onLine;
  const e = await Lc();
  if (ze.external = e.updating, Sn = !e.restarting && !e.updating && e.reachable ? Sn + 1 : 0, Sn < Rc) return;
  Sn = 0, (!Cc(e.started_at) || ts()) && Nc();
}
function Al() {
  as = setTimeout(async () => {
    await Dc(), ze.starting && Al();
  }, Tc);
}
function qc() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Al(), Cl = setTimeout(() => ze.late = !0, Ic));
}
const Ol = () => ze.starting ? new Promise((e) => El.push(e)) : Promise.resolve();
function Cs(e, t, n = 0) {
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
function Pc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class jc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Cs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Pc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const it = "viewer.shell", _n = 2e4, Fc = 4, oo = "/api/read-lines", Wc = 5e3, Hc = 403, lo = "/api/repeated-lines", Uc = 10, zc = 2e3, Vc = 3e5, D8 = 6e5, Mn = 6, Gc = 500, Kc = "/journal/summary", ro = "/api/server-state", Yc = 2e4, Cn = Sl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Jc = (e) => e.split("?")[0].endsWith(Kc), ss = (e, t) => Object.assign(new Error(t), { status: e });
async function Qc(e, t, n = ss) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Xc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Zc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), io = (e) => e.split(" ").slice(0, 2).join(" "), nt = "read", It = "write", eu = "stream";
class tu {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = io(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < zc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Uc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(lo, { method: "POST", headers: { ...Cn, "Content-Type": "application/json" }, body: r }, [{ window: it, line: lo, kind: It }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Sc(n ? _l : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Zc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === It ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = _n) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && qc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Fc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(oo, { headers: Cn }, [{ window: it, line: oo, kind: nt }], Wc).then(async (t) => {
      if (t.status === Hc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ss(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new jc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = io(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const r = a instanceof FormData, i = { method: t, headers: { ...Cn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Xc(a) }, d = s || (r ? Vc : _n);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: it, line: n, kind: nt }], d)) : await this.sent(n, i, [{ window: it, line: n, kind: It }], d);
    } catch (u) {
      if (t !== "GET" || !(u instanceof TypeError) || o <= 1) throw u;
      return await new Promise((h) => setTimeout(h, Gc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Mn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Qc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: it, line: t, kind: nt }], _n)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Cn });
    if (!n.ok) throw ss(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Mn, o).then((r) => (this.written(n), r)) : Ms() && !Jc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: it, line: t, kind: eu }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(ro, { cache: "no-store" }, [{ window: it, line: ro, kind: nt }], Yc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = it, line: s = t, limit: o = _n } = {}) {
    const l = (n.method ?? "GET") === "GET" ? nt : It;
    return l === It ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const $a = Symbol.for("journal.transport"), _e = globalThis[$a] ?? (globalThis[$a] = new tu());
class Tl {
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
    _e.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Es(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Es(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const nu = 50, au = "refresh", su = 1e3, ou = 3e4, lu = "requested", ru = "after_window", iu = 50, En = ".*", cu = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function uu(e) {
  const t = {}, n = Wt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, d = 0, u = 0, h = !1;
  function m(x) {
    const k = () => i[x] ?? i[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {}, $ = C(void 0), g = xl(e, async (_) => {
      const E = await S(x, _);
      return E.ok && !Object.keys(_).length && ($.value = E.value), E;
    }, () => k().page_size || iu, () => !!k().page_size, () => !!k().reads_ids);
    return t[x] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (x, k) => typeof k != "string" || k.startsWith("__v") ? void 0 : t[k] ?? m(k) }), b = (x) => (i[x].loading !== lu || x.endsWith(En)) && (!i[x].tab || i[x].tab === n.tab);
  function S(x, k = {}) {
    return new Promise(($) => {
      a.push({ name: x, flags: k, resolve: $ }), a.length === 1 && setTimeout(A);
    });
  }
  async function A() {
    const x = /* @__PURE__ */ new Map(), k = a.splice(0).filter((_) => {
      const E = JSON.stringify(_.flags);
      return x.has(_.name) || x.set(_.name, E), x.get(_.name) === E ? !0 : (a.push(_), !1);
    });
    a.length && setTimeout(A);
    const $ = Object.fromEntries(k.flatMap(({ name: _, flags: E }) => Object.entries(E).map(([B, H]) => [`${_}.${B}`, H]))), g = await e.readKeys({ only: [...new Set(k.map(({ name: _ }) => _))], state: { ...n, ...$ } });
    k.forEach(({ name: _, resolve: E }) => E(g.ok ? g.value.keys[_] : g));
  }
  async function M(x) {
    var _;
    const k = ++u;
    (x.length ? x : Object.keys(i).filter((E) => !E.endsWith(En) && i[E].loading === "first" && b(E))).forEach((E) => l[E] = k);
    const g = await e.readKeys({ only: x, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const E = (x.length ? x : Object.keys(t)).filter((H) => (l[H] ?? 0) <= k);
      E.forEach((H) => {
        y[H].readAt = Date.now(), g.failure === "unreachable" ? r.add(H) : r.delete(H), y[H].showFirst(g);
      });
      const B = g.failure === "unreachable" && ((_ = e.waitForServer) == null ? void 0 : _.call(e));
      return B && B.then(() => {
        if (h) return;
        const H = E.filter((X) => l[X] === k);
        (H.length || !x.length && !E.length && u === k) && M(H);
      }), !1;
    }
    return O(g.value.declared), Object.entries(g.value.keys).forEach(([E, B]) => {
      (l[E] ?? 0) > k || (l[E] = k, y[E].readAt = Date.now(), r.delete(E), B.ok && (y[E].data.value = B.value), y[E].showFirst(B));
    }), !0;
  }
  function q(x) {
    const k = cu(x);
    return k.length ? (k.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(M(g));
    })))) : M([]);
  }
  function U(x) {
    x.forEach((k) => s.add(k)), clearTimeout(d), d = setTimeout(() => {
      const k = [...s];
      s.clear(), k.length && M(k);
    }, nu);
  }
  const P = (x) => x.endsWith(En) ? Object.keys(t).filter((k) => k.startsWith(x.slice(0, -1)) && t[k].readAt) : [x], L = (x) => (i[x] ?? i[`${x.split(".")[0]}.*`]).reload_seconds;
  function W(x) {
    const k = Object.keys(i).filter((g) => x.event === au || i[g].events.some((_) => Es(_, x.event)));
    k.filter((g) => i[g].page_size).forEach((g) => y[g].heard(x));
    const $ = k.filter((g) => !i[g].page_size);
    $.filter((g) => !b(g)).forEach((g) => y[g].readAt = 0), U($.filter(b).flatMap(P));
  }
  function O(x) {
    if (Object.keys(i).length) return;
    i = x;
    const k = [...new Set(Object.values(x).flatMap((g) => g.events))];
    k.length && e.follow(k, W);
    const $ = Object.keys(x).filter((g) => x[g].loading === ru);
    $.length && M($);
  }
  pe(() => n.tab, () => {
    const x = Object.keys(i).filter((k) => !k.endsWith(En) && b(k) && !y[k].readAt);
    x.length && M(x);
  }), Be(() => {
    h = !0, clearTimeout(d);
  });
  function I() {
    const x = Date.now(), k = Object.keys(i).filter(($) => i[$].reload_seconds > 0 && b($)).flatMap(P).filter(($) => x - y[$].readAt >= (r.has($) ? Math.min(L($) * 1e3, ou) : L($) * 1e3));
    k.length && U(k);
  }
  return _s(I, () => e.visible.value, su), queueMicrotask(() => M([])), { props: y, state: n, reload: q, readKey: S };
}
const du = Symbol("open-view"), Pe = Symbol.for("journal.window-context"), Il = Symbol("dock-card");
function fu(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = uu(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function Ue() {
  const e = Te(Pe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return fu(e);
}
const hu = (e, t) => e(Il, t), q8 = () => Te(Il), mu = ["data-icon", "stroke-width", "innerHTML"], ye = {
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
    return (o, l) => (c(), f("svg", {
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
    }, null, 12, mu));
  }
}, pu = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, gu = /* @__PURE__ */ V(pu, [["__scopeId", "data-v-eb453d6f"]]), vu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = oa(), a = R(() => Object.fromEntries(Object.entries(n).filter(([d]) => d !== "onClick"))), s = C(!1), o = R(() => t.busy || s.value), l = Te(Pe, null), r = R(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(d) {
      const u = [n.onClick].flat().filter(Boolean).map((m) => m(d)).filter((m) => m instanceof Promise);
      if (!u.length) return;
      const h = setTimeout(() => s.value = !0, _l);
      try {
        await Promise.all(u);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (d, u) => (c(), F(gt(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : N(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: D(() => [
        p("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), F(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : w("", !0),
          me(d.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), F(gu, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ V(vu, [["__scopeId", "data-v-ededdadf"]]), yu = ["aria-checked", "aria-haspopup", "onClick"], bu = {
  key: 0,
  class: "segmented-dot"
}, ku = {
  key: 1,
  class: "segmented-note"
}, wu = {
  key: 2,
  class: "segmented-count"
}, $u = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = xs();
    return (s, o) => {
      const l = Di("tip");
      return c(), f("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), f(j, null, te(e.options, (r) => qe((c(), f("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Y(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), f("span", bu)) : w("", !0),
          ee(" " + v(r.label) + " ", 1),
          r.note ? (c(), f("small", ku, v(r.note), 1)) : w("", !0),
          r.count !== void 0 ? (c(), f("em", wu, v(r.count), 1)) : w("", !0)
        ], 10, yu)), [
          [l, r.tip || r.title, `${N(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Pt = /* @__PURE__ */ V($u, [["__scopeId", "data-v-c89bc92d"]]), xu = {
  key: 0,
  class: "more-items"
}, Su = {
  key: 0,
  role: "alert"
}, _u = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), f("div", xu, [
      e.failure ? (c(), f("p", Su, v(e.failure), 1)) : w("", !0),
      e.more ? (c(), F(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: D(() => [
          ee(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, mn = /* @__PURE__ */ V(_u, [["__scopeId", "data-v-10464014"]]), Mu = { class: "link-group" }, Cu = {
  class: "group-label",
  "data-link-kind": ""
}, Eu = ["disabled", "onClick"], Au = { class: "title" }, Ou = { class: "relations" }, Tu = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = R(() => s.value ? n.rows : n.rows.slice(0, 3)), l = R(() => `${n.model.replaceAll("_", " ").replace(/^./, (u) => u.toUpperCase())} ${n.count}`), r = (u) => u.endpoint.unavailable || !u.endpoint.open_ref, i = (u) => ({ [n.linkAttribute]: !0, "data-link-model": u.endpoint.model, "data-link-id": u.endpoint.id }), d = (u) => `${u.endpoint.model === "doc" && u.endpoint.id === n.documentId ? "Design document" : u.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${u.endpoint.id}, ${u.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (u, h) => (c(), f("div", Mu, [
      p("div", Cu, v(l.value), 1),
      (c(!0), f(j, null, te(o.value, (m) => (c(), f("button", De({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (y) => a("open", m)
      }), [
        p("span", Au, v(m.endpoint.title), 1),
        p("span", Ou, [
          ee(v(d(m)), 1),
          r(m) ? (c(), f(j, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : w("", !0)
        ])
      ], 16, Eu))), 128)),
      e.rows.length > 3 && !s.value ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (m) => s.value = !0)
      }, "Show more")) : w("", !0)
    ]));
  }
}, Iu = /* @__PURE__ */ V(Tu, [["__scopeId", "data-v-be6f079c"]]), Ru = ["data-loaded"], Bu = { class: "rows" }, Lu = ["disabled", "onClick"], Nu = { class: "title" }, Du = { class: "relations" }, qu = { key: 2 }, Pu = {
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
    const n = e, a = t, s = C([]), o = C({}), l = C(0), r = C(""), i = C(null), d = C(!1), u = C("");
    let h = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (I) => m[I] || `${I.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())}s`, b = R(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((I, x) => I + x, 0) },
      ...Object.entries(o.value).filter(([I]) => !n.onlyKinds.length || n.onlyKinds.includes(I)).map(([I, x]) => ({ key: I, label: y(I), count: x }))
    ]), S = R(() => {
      const I = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((k) => k.endpoint.model))].map((k) => [k, s.value.filter(($) => $.endpoint.model === k).length])), x = { doc: 0, task: 1, message: 2 };
      return Object.entries(I).sort(([k], [$]) => (x[k] ?? 3) - (x[$] ?? 3)).map(([k, $]) => ({ model: k, count: $, rows: s.value.filter((g) => g.endpoint.model === k) }));
    }), A = (I) => I.endpoint.unavailable || !I.endpoint.open_ref, M = (I) => ({ [n.linkAttribute]: !0, "data-link-model": I.endpoint.model, "data-link-id": I.endpoint.id }), q = (I) => `${I.endpoint.model === "doc" && I.endpoint.id === n.documentId ? "Design document" : I.endpoint.model.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())} ${I.endpoint.id}, ${I.relations.map((x) => x.replaceAll("_", " ")).join(", ")}`;
    async function U(I = 1) {
      const x = ++h;
      d.value = !0, u.value = "";
      const k = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(I), "--page-size", String(n.pageSize)];
      n.outsidePlan && k.push("--outside-plan"), n.documentId && k.push("--first-counterpart", `doc:${n.documentId}`), r.value && k.push("--kind", r.value);
      try {
        const $ = await n.read(k);
        if (x !== h) return;
        if (!$.ok) {
          u.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], _ = I === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(_.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = $.value.kinds ?? {}, l.value = $.value.total, i.value = $.value.next_page ?? null;
      } catch ($) {
        x === h && (u.value = $.message);
      } finally {
        x === h && (d.value = !1);
      }
    }
    function P(I) {
      if (A(I)) return;
      const [x, k] = I.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number(k) });
    }
    function L(I) {
      r.value = I, U();
    }
    const W = () => !d.value && i.value && U(i.value), O = R(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", U();
    }, { immediate: !0 }), (I, x) => s.value.length || d.value || u.value || e.empty ? (c(), f("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (c(), F(Pt, {
        key: 0,
        options: b.value,
        value: r.value,
        wrap: "",
        onPick: L
      }, null, 8, ["options", "value"])) : w("", !0),
      p("div", Bu, [
        e.grouped ? (c(!0), f(j, { key: 0 }, te(S.value, (k) => (c(), F(Iu, {
          key: k.model,
          model: k.model,
          count: k.count,
          rows: k.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: P
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), f(j, { key: 1 }, te(s.value, (k) => (c(), f("button", De({
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, M(k), {
          disabled: A(k),
          onClick: ($) => P(k)
        }), [
          p("span", Nu, v(k.endpoint.title), 1),
          p("span", Du, [
            ee(v(q(k)), 1),
            A(k) ? (c(), f(j, { key: 0 }, [
              ee(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, Lu))), 128)),
        !s.value.length && !d.value && !u.value && e.empty ? (c(), f("p", qu, v(e.empty), 1)) : w("", !0),
        T(mn, {
          more: !!i.value,
          loading: d.value,
          failure: u.value,
          label: O.value,
          onMore: W
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Ru)) : w("", !0);
  }
}, ju = /* @__PURE__ */ V(Pu, [["__scopeId", "data-v-29b9c31b"]]), Fu = (e, t, n) => Math.max(t, Math.min(n, e)), Wu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Rl = /* @__PURE__ */ new WeakMap(), Hu = (e, t) => Rl.set(e, t);
function Uu(e, t) {
  for (let n = t; n; n = Rl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Bl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Uu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ot = 8, zu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = C(null), o = (g) => g ? `${g}px` : void 0, l = R(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = C({ w: 0, h: 0 }), i = C(a.anchor ? a.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), u = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const _ = g.closest(".pane, .float-window");
      return _ ? u(_.getBoundingClientRect()) : d();
    }, m = (g, _) => `${Math.max(0, g ? Math.min(g, _) : _)}px`;
    function y(g, _) {
      return {
        below: g.bottom - _.bottom - a.gap - Ot,
        above: _.top - g.top - a.gap - Ot,
        across: g.right - g.left - 2 * Ot
      };
    }
    function b(g) {
      const _ = h(a.anchor), E = y(_, g);
      return r.value.w <= E.across && r.value.h <= Math.max(E.below, E.above) ? _ : d();
    }
    const S = R(() => {
      if (!i.value) return l.value;
      const g = i.value, _ = b(g), E = y(_, g), { w: B, h: H } = r.value, X = a.align === "auto" ? g.left + g.right > _.left + _.right : a.align === "right", se = Fu(X ? g.right - B : g.left, _.left + Ot, Math.max(_.left + Ot, _.right - B - Ot)), ge = H > E.below && E.above > E.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...l.value, ...ge, left: `${se}px`, maxWidth: m(a.maxWidth, E.across) };
    }), A = n, M = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(g) {
      const _ = M(), E = _.indexOf(document.activeElement);
      _[(E + g + _.length) % _.length].focus();
    }
    const U = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => A("close") }, P = (g) => U[g.key] && (g.preventDefault(), U[g.key]()), L = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let W = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(W), W = requestAnimationFrame(L);
    });
    Bl(s, (g) => a.anchor && !a.anchor.contains(g.target) && A("close"));
    const I = (g, _) => ["top", "left", "right", "bottom"].some((E) => Math.abs(g[E] - _[E]) > 1), x = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let k = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(g)) return A("close");
        I(g, i.value) && (i.value = g);
      }
      k = requestAnimationFrame($);
    }
    return Ee(() => {
      a.anchor && s.value && Hu(s.value, a.anchor), L(), s.value && O.observe(s.value), !a.plain && M()[0] && M()[0].focus(), $();
    }), Be(() => {
      O.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(W);
    }), t({ element: s }), (g, _) => (c(), F(la, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", De({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: P
      }), [
        me(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ia = /* @__PURE__ */ V(zu, [["__scopeId", "data-v-3d203970"]]), Vu = { class: "split-button" }, Gu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = C(null), s = C(!1), o = () => s.value = !1;
    return (l, r) => (c(), f("span", Vu, [
      T(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: D(() => [
          me(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      p("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        T(de, {
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
            T(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), F(ia, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: D(() => [
          me(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : w("", !0)
    ]));
  }
}, Ku = /* @__PURE__ */ V(Gu, [["__scopeId", "data-v-c258494d"]]), Yu = 0, Ju = "/api/lines", Qu = "/api/line", co = 5e3, uo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), fo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), xa = (e) => JSON.stringify(e.line), ho = () => new DOMException("cancelled", "AbortError");
class Xu {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(xa(t))) {
        _e.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => _e.whenFree(() => this.send()), Yu));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(ho())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(ho()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await _e.sent(Ju, uo({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => fo(r.body, nt)), co);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => _e.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, nt), Date.now() - n < co ? this.slow.delete(xa(t.body)) : this.slow.add(xa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await _e.sent(Qu, uo(t.body, t.signal), [fo(t.body, n)], n === nt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Ll = new Xu(), Zu = "/api/window";
function ed(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Zu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (d) => _e.whenFree(async () => {
    const u = await _e.sent(l, { signal: d, headers: r }, [{ window: e, line: l, kind: nt }]);
    if (!u.ok) throw new Error((await u.json()).error);
    return u.json();
  });
  return _e.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const Nl = /* @__PURE__ */ new Map();
class td {
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
    const t = await _e.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function P8(e, t) {
  const n = new td(e, t);
  return Nl.set(e, n), n.load().catch(() => {
  }), n;
}
const As = (e) => Nl.get(e);
function nd(e, t, n) {
  const a = As(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function ad(e, t) {
  if (!e) return !0;
  const n = As(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const os = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Dl = {};
async function j8(e = (t) => _e.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Dl = (await t.json()).states);
}
const Os = (e, t) => {
  var n;
  return (n = Dl[e]) == null ? void 0 : n[t];
}, ca = (e, t) => {
  var n;
  return ((n = Os(e, t)) == null ? void 0 : n.label) ?? os(t);
}, Ts = (e, t) => {
  var n;
  return ((n = Os(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, sd = (e, t) => {
  var n;
  return ((n = Os(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, od = Symbol("pane-page"), ql = Symbol("inspector-host"), Pl = { 1: "refused", 2: "usage", 3: "fault" }, ld = 100, rd = 50, id = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, cd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function ud({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = C({}), declared: d = [], page: u = null, setOption: h = () => {
}, autoScroll: m = "", tabs: y = [], sources: b = [], links: S = {}, search: A = {}, readOnly: M = !1, shared: q = null }) {
  const U = /* @__PURE__ */ new Map(), P = new AbortController(), L = C(!1), W = performance.now();
  let O = 0, I = 0, x = () => {
  };
  const k = new Promise((H) => x = H);
  P.signal.addEventListener("abort", x, { once: !0 });
  const $ = () => {
    clearTimeout(I), I = setTimeout(() => {
      O === 0 && Ss(W, () => {
        L.value = !0, x();
      });
    }, rd);
  }, g = (H, X) => (O += 1, Rt(e, H, t, P.signal, X).finally(() => {
    O -= 1, $();
  })), _ = (H, X) => ($(), k.then(() => P.signal.aborted ? lt : Rt(e, H, t, P.signal, X))), E = ({ only: H = [], state: X = {} } = {}) => (O += 1, fd(() => ed(e, t, H, X, P.signal), P.signal).finally(() => {
    O -= 1, $();
  })), B = (H, { unbatched: X = !1, deferred: se = !1 } = {}) => {
    const ie = U.get(H);
    if (ie && performance.now() - ie.at < ld) return ie.answer;
    const ge = se && !L.value ? _(H, X) : g(H, X);
    return U.set(H, { answer: ge, at: performance.now() }), ge;
  };
  return {
    answered: L,
    settle: $,
    window: e,
    environment: t,
    agent: n,
    page: u,
    visible: R(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: y,
    sources: b,
    links: S,
    search: A,
    readOnly: M,
    shared: q,
    read: B,
    readKeys: E,
    waitForServer: () => Ms() ? Ol() : null,
    run: (H) => Rt(e, H, t, P.signal),
    upload: (H) => md(H, e, P.signal),
    cancel: () => P.abort(),
    signal: P.signal,
    subscriptions: l,
    follow: (H, X) => l.follow(e, [H].flat().filter((se) => o.some((ie) => Es(ie, se))), (se) => {
      U.clear(), X(se);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (H) => R(() => {
      var X;
      return i.value[H] ?? ((X = d.find((se) => se.key === H)) == null ? void 0 : X.default);
    }),
    setting: async (H, X) => {
      const se = await B(`window setting ${e} ${H}`);
      return se.ok ? se.value.value : X;
    },
    setOption: h,
    keep: (H, X) => Rt(e, ["window", "save-setting", e, H, JSON.stringify(X)], t, P.signal)
  };
}
function jl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const lt = { ok: !1, failure: "cancelled", error: "" }, Is = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Fl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? lt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Pl[n.code] || "fault", error: jl(n.error) };
  } catch {
    return t != null && t.aborted ? lt : { ok: !1, failure: "unreachable", error: Is };
  }
}
const dd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Pl[e.code] || "fault", error: jl(e.error) };
async function fd(e, t) {
  try {
    const n = await e();
    return t.aborted ? lt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, dd(s)])) } };
  } catch {
    return t.aborted ? lt : { ok: !1, failure: "unreachable", error: Is };
  }
}
async function Wl(e, t, n) {
  const a = await Fl(() => Ll.read(e, t, n), t);
  return a.failure !== "unreachable" || !Ms() ? a : (await Ol(), t.aborted ? lt : Wl(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return _e.held(() => hd(e, t, n, a, s), _e.knownRead(Array.isArray(t) ? t : Rs(t)));
}
async function hd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Rs(t), environment: n };
  return await _e.isRead(o.line) ? _e.joined(JSON.stringify(o), (l, r) => Wl({ ...o, attribution: r }, l, s), a, o).catch(() => lt) : Fl(() => Ll.write({ ...o, attribution: {
    client_id: _e.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function md(e, t, n = void 0) {
  try {
    const a = await _e.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? lt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? lt : { ok: !1, failure: "unreachable", error: Is };
  }
}
function Rs(e) {
  return [...e.matchAll(id)].map(([t]) => t.replace(cd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const pd = (e) => `show-${e}`, F8 = (e, t, n) => e.filter((a) => {
  var s;
  return n(pd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Hl = "messages.chat", gd = {
  key: 0,
  class: "template-brief"
}, vd = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, yd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = R(() => s.value.map((d) => ({ key: String(d.id), label: d.title, note: d.module }))), r = R(() => s.value.find((d) => String(d.id) === n.value));
    async function i() {
      const d = await Rt(Hl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!d.ok) {
        o.value = d.error;
        return;
      }
      s.value = d.value.rows;
      const u = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((m) => m.title === u);
      h && a("pick", String(h.id));
    }
    return i(), (d, u) => (c(), f(j, null, [
      T(Pt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: u[0] || (u[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), f("p", gd, v(r.value.brief), 1)) : w("", !0),
      o.value ? (c(), f("p", vd, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, bd = /* @__PURE__ */ V(yd, [["__scopeId", "data-v-14be8a5c"]]), kd = { class: "form-field" }, wd = { class: "form-field-head" }, $d = ["for"], xd = {
  key: 0,
  class: "form-field-aside"
}, Sd = {
  key: 0,
  class: "form-field-help"
}, _d = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), f("div", kd, [
      p("div", wd, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, $d),
        t.$slots.aside ? (c(), f("span", xd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), f("p", Sd, v(e.help), 1)) : w("", !0)
    ]));
  }
}, Md = /* @__PURE__ */ V(_d, [["__scopeId", "data-v-dd7cdcff"]]), ls = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Cd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = oa(), n = R(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => qe((c(), f("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [N(ls), N(t).value]
    ]);
  }
}), Ed = /* @__PURE__ */ V(Cd, [["__scopeId", "data-v-e130a5b9"]]), Ad = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = xs(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), F(Md, {
      label: e.field.label,
      for: N(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        T(Ut, { value: o.value }, {
          choice: D(() => [
            T(Pt, {
              id: N(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            T(bd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            T(Ed, {
              id: N(s),
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
}, ua = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), F(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        T(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Od(e, t, n, a = () => window) {
  Ee(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Td = (e, t = () => !0) => Od("keydown", (n) => n.key === "Escape" && t() && e());
function Ul(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = C(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Td(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Id = 80, Tt = Wt([]);
function zl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), R(() => Id + Math.max(0, Tt.indexOf(t)));
}
let Vl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Vl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Rd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Bd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Rd)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Ee(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Vl, document.addEventListener("keydown", s), Xe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Ld = ["aria-modal", "aria-label", "aria-labelledby"], Nd = {
  key: 0,
  class: "dialog-head"
}, Dd = ["id", "tabindex"], qd = {
  key: 1,
  class: "dialog-foot"
}, Pd = 500, jd = 400, Fd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ul(a, n), r = zl(s), i = C(null), d = C(null), u = C(null), h = xs(), m = C(!1), y = Date.now();
    n.modal && Bd(d, () => a("escape"), u);
    function b() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, jd);
    }
    function S(q) {
      !n.modal || Date.now() - y >= Pd || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const A = () => i.value && (i.value.scrollTop = i.value.scrollHeight), M = new MutationObserver(A);
    return pe(i, (q) => {
      M.disconnect(), q && n.follow && (M.observe(q, { childList: !0, subtree: !0, characterData: !0 }), A());
    }), Be(() => M.disconnect()), (q, U) => (c(), F(la, { to: "body" }, [
      T(Ht, {
        name: "dialog",
        appear: "",
        onAfterLeave: N(l)
      }, {
        default: D(() => [
          N(s) ? (c(), f("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: N(r) }),
            onClick: $e(b, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: d,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? N(h) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? w("", !0) : (c(), f("header", Nd, [
                p("h3", {
                  id: N(h),
                  ref_key: "heading",
                  ref: u,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Dd),
                e.closable ? (c(), F(ua, {
                  key: 0,
                  onClick: N(o)
                }, null, 8, ["onClick"])) : w("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: i,
                class: Y(["dialog-body", { bare: e.bare }])
              }, [
                me(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (c(), f("footer", qd, [
                me(q.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, Ld)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, da = /* @__PURE__ */ V(Fd, [["__scopeId", "data-v-6d1ecd98"]]), Wd = {
  class: "action-output",
  "data-action-output": ""
}, Hd = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), F(da, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: D(() => [
        p("pre", Wd, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Ud = /* @__PURE__ */ V(Hd, [["__scopeId", "data-v-423a045c"]]);
function zd(e) {
  const t = document.body.appendChild(document.createElement("div")), n = qi(Ud, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Vd = (e, t, n = {}) => Rs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function pn(e, t, n, a = {}) {
  var s;
  try {
    if (!await ad(e.module, n)) return { ok: !1, error: "" };
    const o = await Rt(Hl, Vd(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && zd(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Gd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Sa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], ke = (e, t, n, a = {}) => ({
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
}), fa = {
  messages: ke("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: ke("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: ke("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Sa
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Sa
  }),
  reports: ke("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: ke("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: ke("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: ke("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: ke("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: ke("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Sa }),
  reactions: ke("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: ke("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: ke("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: ke("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: ke("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: ke("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: ke("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: ke("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: ke("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: ke("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: ke("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: ke("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: ke("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: ke("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: ke("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: ke("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: ke("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Kd = ["secrets", "plugins"], Gl = Object.keys(fa).filter((e) => !(Sl && Kd.includes(e)));
R(() => Gl.map((e) => ({ name: e, ...fa[e] })));
const zt = (e) => fa[e], Kl = new Map(Gl.flatMap((e) => [e, e.replace(/s$/, ""), fa[e].title.toLowerCase()].map((t) => [t, e]))), ht = (e) => Kl.get(String(e).toLowerCase()) || "", Yl = [...Kl.keys()].sort((e, t) => t.length - e.length).join("|"), Yd = {
  class: "button-form",
  "data-button-form": ""
}, Jd = {
  key: 0,
  class: "button-form-title"
}, Qd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Xd = { class: "button-form-actions" }, Zd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(Object.fromEntries(n.button.fields.map((u) => [u.name, u.default || ""]))), o = C(!1), l = C(""), r = R(() => n.button.fields.every((u) => s.value[u.name].trim().length > 0)), i = R(() => {
      var h;
      if (!n.row) return n.button.label;
      const u = ((h = zt(ht(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${u} ${n.row.id}`;
    });
    async function d() {
      if (o.value || !r.value) return;
      o.value = !0;
      const u = await pn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = u.ok ? "" : u.error, u.ok && (a("done"), a("close"));
    }
    return (u, h) => (c(), F(da, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          p("div", Yd, [
            (m = e.row) != null && m.title ? (c(), f("p", Jd, v(e.row.title), 1)) : w("", !0),
            (c(!0), f(j, null, te(e.button.fields, (y) => (c(), F(Ad, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), f("p", Qd, v(l.value), 1)) : w("", !0),
            p("div", Xd, [
              T(de, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: D(() => [...h[2] || (h[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              T(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: d
              }, {
                default: D(() => [...h[3] || (h[3] = [
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
}, ef = /* @__PURE__ */ V(Zd, [["__scopeId", "data-v-f26c27a7"]]), tf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, nf = {
  key: 1,
  class: "menu-item-text"
}, af = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), f("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), f("span", tf, v(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (c(), f("span", nf, [
        p("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ V(af, [["__scopeId", "data-v-fec99974"]]), sf = ["aria-busy"], of = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, lf = { class: "button-slot-confirm-text" }, rf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, cf = {
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
    const n = e, a = t, s = R(() => As(n.environment)), o = R(
      () => {
        var M;
        return !n.readOnly && ((M = s.value) == null ? void 0 : M.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = R(() => {
      var M;
      return !n.readOnly && ((M = s.value) == null ? void 0 : M.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = R(() => n.readOnly ? [] : nd(n.environment, n.name, n.row)), d = C(null), u = C(null), h = C(""), m = C(!1), y = (M) => [M.from ? `From ${M.from}` : "", M.tip, M.warning].filter(Boolean).join(" · "), b = (M) => M.icon || (M.warning ? "dot" : "");
    function S(M) {
      if (!(m.value || n.readOnly)) {
        if (M.fields.length) {
          d.value = M;
          return;
        }
        if (M.confirm) {
          u.value = M;
          return;
        }
        return A(M);
      }
    }
    async function A(M) {
      u.value = null, h.value = "", a("failure", ""), m.value = !0;
      const q = await pn(M, n.row, n.environment);
      m.value = !1, h.value = q.ok ? "" : q.error;
      const U = M.label.toLowerCase() + (n.objectName && !M.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", q.ok ? "" : `Could not ${U}: ${q.error}`), q.ok && a("done");
    }
    return (M, q) => (c(), f("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), f(j, { key: 0 }, [
        q[5] || (q[5] = p("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        T(de, {
          small: "",
          onClick: r
        }, {
          default: D(() => [...q[4] || (q[4] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && u.value ? (c(), f("span", of, [
        p("span", lf, v(u.value.confirm), 1),
        T(de, {
          small: "",
          variant: u.value.danger ? "ghost" : "primary",
          bordered: u.value.danger,
          class: Y({ danger: u.value.danger }),
          "data-button-confirm-yes": "",
          onClick: q[0] || (q[0] = (U) => A(u.value))
        }, {
          default: D(() => [
            ee(v(u.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        T(de, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: q[1] || (q[1] = (U) => u.value = null)
        }, {
          default: D(() => [...q[6] || (q[6] = [
            ee("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? w("", !0) : (c(), f(j, { key: 2 }, [
        (c(!0), f(j, null, te(i.value, (U) => (c(), f(j, {
          key: U.name
        }, [
          U.menu.length ? (c(), F(Ku, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: m.value,
            "menu-label": U.menu_label || "More ways",
            title: y(U),
            "data-button": U.name,
            onMain: (P) => S(U)
          }, {
            menu: D(({ close: P }) => [
              (c(!0), f(j, null, te(U.menu, (L) => (c(), F(Mt, {
                key: L.label,
                description: L.description,
                onClick: (W) => (P(), S({ ...U, ...L, menu: [] }))
              }, {
                default: D(() => [
                  ee(v(L.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              ee(v(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), F(de, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: Y({ danger: U.danger }),
            icon: b(U),
            disabled: m.value,
            title: y(U),
            "data-button": U.name,
            onClick: (P) => S(U)
          }, {
            default: D(() => [
              ee(v(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (c(), f("span", rf, v(h.value), 1)) : w("", !0),
        d.value && !e.readOnly ? (c(), F(ef, {
          key: d.value.runs,
          button: d.value,
          row: e.row,
          environment: e.environment,
          onClose: q[2] || (q[2] = (U) => d.value = null),
          onDone: q[3] || (q[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, sf));
  }
}, Jl = /* @__PURE__ */ V(cf, [["__scopeId", "data-v-a4b6f174"]]), uf = {
  class: "running",
  "data-running-command": ""
}, df = ["title"], ff = {
  key: "idle",
  class: "running-idle"
}, hf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), f("span", uf, [
      T(Ht, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, df)) : (c(), f("span", ff, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, W8 = /* @__PURE__ */ V(hf, [["__scopeId", "data-v-d3240219"]]), mf = ["aria-checked", "aria-label", "title"], pf = {
  key: 0,
  class: "switch-inner"
}, gf = {
  key: 0,
  class: "switch-word"
}, vf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("button", {
      type: "button",
      class: Y(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: Y(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), f("span", pf, v(e.word), 1)) : w("", !0),
        s[1] || (s[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), f("span", gf, v(e.word), 1)) : w("", !0)
    ], 10, mf));
  }
}, H8 = /* @__PURE__ */ V(vf, [["__scopeId", "data-v-1bfb90f3"]]);
function Ql(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function zn(e, t) {
  return Ql(() => localStorage, e, t);
}
function Xl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Bs(e, t) {
  return Xl(() => localStorage, e, t);
}
function Zl(e, t) {
  pe(t, (n) => Bs(e, n), { deep: !0 });
}
function yf(e, t) {
  return Ql(() => sessionStorage, e, t);
}
function bf(e, t) {
  return Xl(() => sessionStorage, e, t);
}
const Vn = "journal.environment", er = C(yf(Vn, zn(Vn, "")));
function kf(e) {
  er.value = e, bf(Vn, e), Bs(Vn, e);
}
const Gn = C(location.hash), mo = Ye(null), po = { integrations: "mcp", library: "team" };
function wf() {
  if (!mo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (po[n]) {
    location.replace(`#/${[po[n], ...a].join("/")}${t ? `?${t}` : ""}`), Gn.value = location.hash;
    return;
  }
  !n || mo.value(n) || (kf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Gn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Gn.value = location.hash, wf();
});
const rs = R(() => {
  const [e, t = ""] = Gn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [d = "", u = "", h = ""] = r.split(":");
    return { table: d, id: Number(u), comment: Number(h) || 0, env: i };
  });
  return {
    env: er.value,
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
}), Ls = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ls.page(e)}?open=${t}`
};
function $f(e = "", t = 0, n = "") {
  location.hash = Ls.page(e, t, n);
}
const xf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function tr(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(xf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Lt = {};
function U8(e, t) {
  return Lt[e] = t, () => Lt[e] === t && delete Lt[e];
}
function jt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Lt[e]) != null && l.call(Lt, t))) return;
  const s = rs.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  tr([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Sf(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return jt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  tr([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Sf(a, s, Number(o), 0, t) : jt(s, Number(o), 0, t);
}
function _f(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Bt(e) {
  const t = _f(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function z8(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Mf = { class: "inspector-part" }, Cf = { class: "inspector-part-title" }, Ef = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("section", Mf, [
      p("h4", Cf, v(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, V8 = /* @__PURE__ */ V(Ef, [["__scopeId", "data-v-0da7fa52"]]), go = /* @__PURE__ */ new Map(), Af = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = C(null), a = C(!1), s = C(t.name && go.get(t.name) || !1);
    function o(i) {
      s.value = i, t.name && go.set(t.name, i);
    }
    const l = () => {
      const i = !!n.value && n.value.scrollHeight > t.at;
      i !== a.value && (a.value = i);
    }, r = new ResizeObserver(() => requestAnimationFrame(l));
    return Ee(() => n.value && r.observe(n.value.firstElementChild || n.value)), Be(() => r.disconnect()), (i, d) => (c(), f(j, null, [
      p("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: d[0] || (d[0] = (u) => o(!0))
      }, [
        me(i.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: d[1] || (d[1] = $e((u) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, Of = /* @__PURE__ */ V(Af, [["__scopeId", "data-v-4d2235ba"]]), Tf = ["aria-valuenow", "aria-valuemax"], If = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), f("span", {
      class: Y(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, Tf));
  }
}, nr = /* @__PURE__ */ V(If, [["__scopeId", "data-v-9eba6a85"]]), Rf = { processes: "process", memories: "memory", replies: "reply" }, Kn = (e) => (Rf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), is = [], Bf = 2e3, ut = /* @__PURE__ */ new Map(), Lf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Nf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? is.unshift(e) : is.push(e), ut.clear();
}
function ar(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Df = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, qf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ot(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Pf(e, t) {
  const n = [{ type: "text", text: ot(e).replace(/\r\n/g, `
`) }];
  for (const a of is)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function on(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return jf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function jf(e) {
  return e.split(Nf).map((t, n) => n % 2 ? t : t.replace(Lf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function vo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Ff = 24;
function Wf(e) {
  const [t, , ...n] = e, a = vo(t), s = n.map(vo), o = (i) => [a, ...s].some((d) => (d[i] ?? "").length > Ff) ? ' class="text-column"' : "", l = a.map((i, d) => `<th${o(d)}>${on(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((d, u) => `<td${o(u)}>${on(d)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const sr = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, yo = (e) => e.match(/^\s*/)[0].length;
function or(e) {
  const t = e[0].match(cs), n = yo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && yo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${on(o.text)}${o.nested.length ? or(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Hf(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (sr.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const bo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function lr(e) {
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
      n.push(`<h${r}>${on(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (bo(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Wf(t.slice(a, r))), a = r;
      continue;
    }
    if (sr.test(s)) {
      const r = Hf(t, a);
      n.push(or(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${lr(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !bo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${on(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Uf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, zf = (e) => e.type !== "text" && !Uf.test(e.html);
function Vf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(lr(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : zf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function rr(e, t = { env: "" }) {
  const n = qf(e, t), a = ut.get(n);
  if (ut.delete(n), a && a.source === t.source && a.reads.every((l) => Df(l, t)))
    return ut.set(n, a), a.html;
  const s = [], o = Vf(Pf(e, { ...t, reads: s }));
  return ut.set(n, { html: o, reads: s, source: t.source }), ut.size > Bf && ut.delete(ut.keys().next().value), o;
}
const _a = /* @__PURE__ */ new WeakMap();
function Gf(e) {
  if (_a.has(e)) return _a.get(e);
  const t = Pi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d, u) => `${d}:${u}`;
  function o(d, u) {
    const h = s(d, u), m = e.read(`${Kn(d)} show ${u}`);
    n.set(h, m), m.then((y) => {
      n.get(h) === m && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: d } : null));
    });
  }
  function l(d) {
    a.has(d) || (a.add(d), e.follow([`${Kn(d).replace(/-/g, "_")}.*`], (u) => {
      const h = `${d}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(h)) continue;
        const y = Number(m.slice(h.length));
        (!u.row_id || u.row_id === y) && o(d, y);
      }
    }));
  }
  function r(d, u) {
    l(d);
    const h = s(d, u);
    return !t.has(h) && !n.has(h) && o(d, u), t.get(h);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return _a.set(e, i), i;
}
function ir() {
  const e = Te(Pe, null), t = e ? Gf(e) : null;
  return (n, a = {}) => rr(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const cr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, gn = (e) => String(e || "").replace(cr, (t, n, a, s) => s), Kf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), An = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Yf = /^Traceback \(most recent call last\):/m, Jf = 8;
function ur(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Jf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Qf(e) {
  const t = [...e.matchAll(Kf)].map((a) => a.index);
  if (An.lastIndex = 0, !t.length || !An.test(e)) return null;
  An.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(An)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ur(n), tail: "" } : null;
}
function Xf(e) {
  const t = Yf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ur([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = gn(e), n = Xf(t) || Qf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Yn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, dr = (e) => `${e.table}:${e.id}`, ko = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ma = 80;
function wo(e) {
  return e.length <= Ma ? e : `${e.slice(0, Ma + 1).replace(/\s+\S*$/, "") || e.slice(0, Ma)}…`;
}
const $o = {
  messages: (e) => wo(ko(e.text)),
  comments: (e) => wo(ko(e.text)),
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
}, Zf = (e) => ($o[e.table] ? $o[e.table](e) : e.title || "") || "", Ct = (e) => Yn(e.created_at), fr = (e) => Yn(e.updated_at) || Ct(e), eh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, th = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function nh(e) {
  const t = eh.exec(e);
  if (t && ht(t[1])) return { at: t.index, length: t[0].length, table: ht(t[1]), id: Number(t[2]), label: t[3] };
  const n = th.exec(e), a = n && ht(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ah(e, t, n, a) {
  const s = ar(a, e, t), o = gn(s ? Zf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ot(zt(e).title)} ${t}</span><span class="row-card-title">${ot(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = nh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ah(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const sh = /\.(png|jpe?g|gif|webp|svg)$/i, oh = (e) => sh.test(e), lh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, rh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function ih(e, t) {
  const n = lh.exec(e), [, a, s, o, l, r] = n || [], i = n && ht(a || o), d = i && ar(t, i, Number(s || l));
  if (i !== "messages" || !d || !(d.files || []).includes(r)) return null;
  const u = `/api/files/message/${d.id}/${encodeURIComponent(r)}`, h = `${zt(i).title} ${d.id} · ${ot(r)}`, m = oh(r) ? `<img class="file-card-image" src="${u}" alt="${ot(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${u}" data-attached="${ot(r)}">${m}<span class="file-card-name">${h}</span></a>` };
}
function ch(e) {
  const t = rh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ot(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = ih(e, t) || ch(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const uh = /`([^`\n]+)`/g;
Et((e) => e.replace(uh, (t, n) => `<code>${n}</code>`));
const xo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ls.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(cr, (n, a, s, o) => xo[a] ? xo[a](s, o, t) : o)
);
const dh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, hr = new RegExp(`\\b(${Yl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), mr = new RegExp(`\\b(${Yl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), fh = new RegExp(`<code>((?:${hr.source}|${mr.source}))</code>`, "gi"), hh = (e) => e.replace(fh, "$1"), mh = (e, t) => `<a class="row-pill" href="#" data-peek="${ht(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, ph = (e) => e.replace(mr, (t, n, a) => a.replace(/\d+/g, (s) => mh(n.replace(/s$/i, ""), s))), gh = (e) => ph(e).replace(
  hr,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ht(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : hh(e).split(dh).map((n, a) => a % 2 ? n : gh(n)).join("")
);
const vh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, yh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, bh = /[\w\]]\(/, kh = /^[\w$.[\]'"]+\s*=\s*[^=]/, wh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, $h = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, xh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Sh = /[[({,]$/, _h = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Mh = /^(\t|\s{2,})\S/, Ch = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Eh = /`[^`]+`/, Ah = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Oh = /[{}()[\];=<>$&|*\\@+^~%]/g, pr = /^\s*(?:[-*+]|\d+[.)])\s/, Th = /^\s*>/, Ih = /^\s*\|/, Rh = 0.6, Bh = 0.4, Lh = 5, Nh = 0.03, gr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Lh && t.every((n) => Ah.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Oh) ?? []).length / e.length < Nh;
}, Ca = (e) => {
  const t = e.trim();
  return Eh.test(t) ? !1 : [vh, yh, bh, kh, wh, $h, xh, Sh, _h].some((n) => n.test(t)) || /[;{}]$/.test(t) || Mh.test(e) && !pr.test(e) && !gr(e);
};
function Dh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || pr.test(t[0]) || t.every((o) => Th.test(o) || Ih.test(o))) return "text";
  const n = t.filter((o) => !Ch.test(o.trim()));
  if (t.length === 1) return !n.length || Ca(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ca).length, s = n.filter((o) => !Ca(o) && gr(o)).length;
  return a >= n.length * Rh && s <= n.length * Bh ? "code" : "text";
}
const us = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", qh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Ph = `${us} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, jh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Fh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", So = {
  js: { keywords: us, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: qh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Ph, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: us, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: jh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Fh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Wh = {
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
function _o(e, t, n) {
  return n && e.startsWith(n, t);
}
function Hh(e, t) {
  const n = So[Wh[t] ?? t] || So.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (_o(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      l("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && _o(e, o, n.block[0])) {
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
      const u = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? u.toLowerCase() : u, m = n.property && /^\s*:/.test(e.slice(o + u.length));
      l(a.has(h) ? "keyword" : m ? "property" : /^[A-Z]/.test(u) && t !== "text" ? "type" : "plain", u), o += u.length;
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
function Uh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Hh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? ot(l) : `<span class="tok-${a}">${ot(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function zh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Vh = 1500, Mo = /* @__PURE__ */ new WeakMap();
async function Gh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await zh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Mo.get(t)), Mo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Vh)
  )));
}
typeof document < "u" && document.addEventListener("click", Gh, !0);
const Kh = /\n\s*\n/, Yh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Jh = /^\s*(`{3,}|~{3,})\s*$/, Qh = /^\s{4,}\S/, Xh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ds = /^\s*(?:[-*+]|\d+[.)])\s/, vr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Zh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ns(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function em(e) {
  const t = Ns(e.join(`
`));
  return (Zh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const tm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && vr.test(t) && !ds.test(t);
}, nm = (e, t) => ds.test(t) || ds.test([...e].reverse().find((n) => n.trim()) || "");
function Ds(e, t) {
  const n = t || em(e), a = Uh(Ns(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function am(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Jh.test(s));
  return a < 0 ? e.length : a;
}
function sm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ds(a.map(gn), n ? n.toLowerCase() : "");
}
function om(e) {
  const t = e.split(Kh).map((l) => ({ paragraph: l, type: Dh(Ns(l).split(`
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
      s(), n.push(Ds(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(gn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function lm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : om(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Yh);
    if (r) {
      const d = am(n, l, r[2]);
      o(), a.push(sm(n.slice(l + 1, d), r[1], r[3])), l = d + 1;
      continue;
    }
    const i = tm(s) ? Xh : Qh;
    if (!t && i.test(n[l]) && !nm(s, n[l])) {
      let d = l;
      for (; d < n.length && (i.test(n[d]) || !n[d].trim()); ) d += 1;
      for (; d > l && !n[d - 1].trim(); ) d -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && vr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (d - l + u.length >= 2) {
        o(), a.push(Ds([...u, ...n.slice(l, d)].map(gn), "")), l = d;
        continue;
      }
      s.push(...u);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => lm(e, t.document), { first: !0 });
const rm = ["innerHTML"], im = ["innerHTML"], cm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = ir(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => N(Bt) && N(Bt)(...l)),
      innerHTML: a.value
    }, null, 8, rm)) : (c(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => N(Bt) && N(Bt)(...l)),
      innerHTML: a.value
    }, null, 8, im));
  }
}, at = /* @__PURE__ */ V(cm, [["__scopeId", "data-v-d8e75741"]]), Co = (e) => [...new Set(e.agents.map((t) => t.name))], um = (e) => Co(e).length === 1 ? `Worker: ${Co(e)[0]}` : "Delegated", dm = {
  class: "plan-details",
  "data-plan-details": ""
}, fm = { class: "state-line" }, hm = {
  key: 0,
  class: "phase-count"
}, mm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, pm = { class: "text" }, gm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, vm = { class: "overall" }, ym = { class: "overall-figure" }, bm = {
  key: 2,
  class: "delegation",
  "data-plan-delegated": ""
}, km = {
  key: 3,
  class: "part"
}, wm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", dm, [
      p("div", fm, [
        p("span", {
          class: Y(["status", N(Ts)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, v(N(ca)("plan", e.plan.state)), 3),
        e.plan.current_phase ? (c(), f("span", hm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : w("", !0)
      ]),
      e.plan.reason ? (c(), f("section", mm, [
        p("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        p("p", pm, v(e.plan.reason), 1)
      ])) : w("", !0),
      e.plan.total ? (c(), f("section", gm, [
        n[0] || (n[0] = p("h4", null, "Progress", -1)),
        p("div", vm, [
          T(nr, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          p("span", ym, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : w("", !0),
      e.plan.delegated ? (c(), f("p", bm, v(N(um)(e.plan)), 1)) : w("", !0),
      e.plan.brief ? (c(), f("section", km, [
        n[1] || (n[1] = p("h4", null, "The brief", -1)),
        T(Of, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: D(() => [
            T(at, {
              class: "text",
              "data-resource-text": "",
              text: e.plan.brief
            }, null, 8, ["text"])
          ]),
          _: 1
        }, 8, ["name"])
      ])) : w("", !0)
    ]));
  }
}, G8 = /* @__PURE__ */ V(wm, [["__scopeId", "data-v-1b6b2000"]]), $m = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, xm = { ...$m, done: "Completed" }, Sm = /* @__PURE__ */ new Set(["completed", "cancelled"]), _m = (e) => Sm.has(e), ln = (e) => _m(e) ? "done" : e, Mm = { class: "task-status-icon" }, Cm = ["width", "height", "aria-label"], Em = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => Ts("task", ln(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => xm[t.status] ?? ca("task", t.status));
    return (o, l) => (c(), f("span", Mm, [
      T(Ht, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (c(), f("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            T(Ut, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
                p("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: D(() => [...l[1] || (l[1] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                p("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: D(() => [...l[2] || (l[2] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: D(() => [...l[3] || (l[3] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: D(() => [...l[4] || (l[4] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                p("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: D(() => [...l[5] || (l[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Cm))
        ]),
        _: 1
      })
    ]));
  }
}, vn = /* @__PURE__ */ V(Em, [["__scopeId", "data-v-ae24a63f"]]), Am = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Om = ["title", "onClick"], Tm = { class: "agent-word" }, Im = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = R(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const r of a.tasks.filter((i) => i.helper_id && !n.has(i.state))) {
        const i = ((l = o.get(r.helper_id)) == null ? void 0 : l.held) || t.has(r.state);
        o.set(r.helper_id, { id: r.helper_id, name: r.helper_name, held: i });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (c(), f("div", Am, [
      (c(!0), f(j, null, te(s.value, (r) => (c(), f("button", {
        key: r.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${r.name}`,
        "data-plan-phase-agent": "",
        onClick: (i) => N(Ne)(`agents:${r.id}`)
      }, [
        p("span", {
          class: Y(["agent-dot", { held: r.held }])
        }, null, 2),
        ee(" " + v(r.name) + " ", 1),
        p("span", Tm, v(r.held ? "Working" : "Queued"), 1)
      ], 8, Om))), 128))
    ])) : w("", !0);
  }
}, Rm = /* @__PURE__ */ V(Im, [["__scopeId", "data-v-0c589695"]]), Bm = { class: "phases" }, Lm = { class: "phead" }, Nm = { class: "mark" }, Dm = { class: "ptitle" }, qm = { class: "phead-end" }, Pm = {
  key: 0,
  class: "checkpoint"
}, jm = { class: "progress" }, Fm = {
  key: 0,
  class: "when"
}, Wm = ["onClick"], Hm = { class: "row-id" }, Um = { class: "row-title" }, zm = ["title"], Vm = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((r) => n.has(r.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, r) => (c(), f("ol", Bm, [
      (c(!0), f(j, null, te(e.phases, (i, d) => (c(), f("li", {
        key: i.id,
        class: Y(["phase", { current: d + 1 === e.currentPhase, done: o(i) }]),
        "data-resource-phase": ""
      }, [
        p("div", Lm, [
          p("span", Nm, [
            T(ye, {
              name: o(i) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", Dm, v(d + 1) + ". " + v(i.title), 1),
          p("span", qm, [
            i.checkpoint ? (c(), f("span", Pm, "checkpoint")) : w("", !0),
            p("span", jm, v(s(i)) + "/" + v(i.tasks.length), 1)
          ])
        ]),
        i.goal ? (c(), f("div", Fm, v(i.goal), 1)) : w("", !0),
        T(Rm, {
          tasks: i.tasks
        }, null, 8, ["tasks"]),
        (c(!0), f(j, null, te(i.tasks, (u) => (c(), f("button", {
          key: u.id,
          type: "button",
          class: Y(["row", u.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", u.id)
        }, [
          T(vn, {
            status: u.state
          }, null, 8, ["status"]),
          p("span", Hm, "#" + v(u.id), 1),
          p("span", Um, v(u.title), 1),
          u.helper_id ? (c(), f("span", {
            key: 0,
            class: "holder",
            title: u.state === "open" ? `Queued for ${u.helper_name}` : `Held by ${u.helper_name}`,
            "data-plan-agent": ""
          }, v(u.helper_name), 9, zm)) : w("", !0)
        ], 10, Wm))), 128))
      ], 2))), 128))
    ]));
  }
}, K8 = /* @__PURE__ */ V(Vm, [["__scopeId", "data-v-6a600744"]]), Gm = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, Km = {
  key: 0,
  class: "empty",
  role: "alert"
}, Ym = {
  key: 2,
  class: "empty"
}, Jm = { class: "day" }, Qm = { class: "events" }, Xm = { class: "mark" }, Zm = { class: "what" }, ep = { class: "head" }, tp = { class: "word" }, np = ["title", "onClick"], ap = { class: "at" }, sp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = C(null), l = C(""), r = R(() => {
      const u = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const m = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        u.set(m, [...u.get(m) ?? [], h]);
      }
      return [...u].map(([h, m]) => ({ day: h, items: m }));
    }), i = (u) => new Date(u).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function d() {
      const u = await a.read(["plan", "timeline", String(a.id)]);
      l.value = u.ok ? "" : u.error, o.value = u.ok ? u.value.events : [];
    }
    return pe(() => a.id, d, { immediate: !0 }), (u, h) => (c(), f("section", Gm, [
      l.value ? (c(), f("p", Km, v(l.value), 1)) : o.value === null ? (c(), F(Ze, { key: 1 })) : o.value.length ? w("", !0) : (c(), f("p", Ym, "Nothing has happened on this plan's tasks yet.")),
      (c(!0), f(j, null, te(r.value, (m) => (c(), f(j, {
        key: m.day
      }, [
        p("h3", Jm, v(m.day), 1),
        p("ol", Qm, [
          (c(!0), f(j, null, te(m.items, (y) => (c(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            p("span", Xm, [
              n[y.event_type].state ? (c(), F(vn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (c(), F(ye, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            p("div", Zm, [
              p("div", ep, [
                p("span", tp, v(n[y.event_type].word), 1),
                p("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, np),
                p("span", ap, v(i(y.time)), 1)
              ]),
              y.text ? (c(), F(at, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : w("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, Y8 = /* @__PURE__ */ V(sp, [["__scopeId", "data-v-2a782d79"]]);
function op(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function qs(e, t = Date.now()) {
  const n = op(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const lp = 36e5;
function rp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / lp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Eo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function yr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Ao(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ea = (e) => String(e).padStart(2, "0");
function br(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ea(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ea(Math.floor(t % 3600 / 60))}m ${Ea(t % 60)}s`;
}
const ip = 1e3;
function kr() {
  const e = C(Date.now()), t = setInterval(() => e.value = Date.now(), ip);
  return Qe(() => clearInterval(t)), e;
}
const cp = Symbol("resource-subscriptions");
function up(e, t) {
  const n = Te(cp, () => new Tl(), !0), a = Cs(t, 100), s = n.follow("resources", e, a);
  ra(() => {
    s(), a.cancel();
  });
}
const dp = "Not known", fp = 80, hp = 1e3, mp = "worker", pp = "main", gp = /* @__PURE__ */ new Set(["waiting", "blocked"]), wr = (e) => e.ok ? e.value.rows : [], Oo = (e) => e.ok ? e.value.total : 0, $r = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), vp = (e, t) => (t == null ? void 0 : t.given_name) || $r((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), yp = (e, t) => e.ended_at ? "ended" : e.paused_at || gp.has(t == null ? void 0 : t.state) ? "waiting" : "running", bp = (e, t) => [(t == null ? void 0 : t.profile) && $r(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), xr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function kp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / hp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: br(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > fp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? dp : `$${t.cost_dollars.toFixed(2)}` }), e.role === mp && l.push({ key: "pace", label: "Tasks an hour", value: String(rp(xr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === pp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function wp(e) {
  const t = xr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function $p(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Eo(e.created_at)]), e.ended_at && n.push(["Ended", Eo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const xp = { class: "band" }, Sp = { key: 0 }, _p = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (c(), f("h2", xp, [
      T(ye, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      me(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (c(), f("span", Sp, v(e.count), 1)) : w("", !0)
    ]));
  }
}, Jn = /* @__PURE__ */ V(_p, [["__scopeId", "data-v-1758914f"]]), Mp = { class: "number" }, Cp = { class: "text" }, Ep = 150, Ap = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = C(!1), a = R(() => t.text.length > Ep), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (c(), f(j, null, [
      e.text ? (c(), f(j, { key: 0 }, [
        T(Jn, { icon: "file" }, {
          default: D(() => [
            ee(v(e.label), 1)
          ]),
          _: 1
        }),
        p("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (r) => n.value = !0)
        }, "Show all")) : w("", !0)
      ], 64)) : w("", !0),
      e.points.length ? (c(), f(j, { key: 1 }, [
        T(Jn, { icon: "points" }, {
          default: D(() => [...l[1] || (l[1] = [
            ee("Points to prove", -1)
          ])]),
          _: 1
        }),
        (c(!0), f(j, null, te(e.points, (r) => {
          var i;
          return c(), f("p", {
            key: r.id,
            class: "point",
            "data-agent-point": ""
          }, [
            p("span", Mp, v(r.id), 1),
            p("span", Cp, [
              ee(v(r.text), 1),
              p("span", {
                class: Y(["proof", { checked: ((i = r.proof) == null ? void 0 : i.state) === "checked" }])
              }, v(s(r)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Op = /* @__PURE__ */ V(Ap, [["__scopeId", "data-v-c99de22c"]]), Tp = ["aria-expanded"], Ip = { class: "count" }, Rp = {
  key: 0,
  "data-agent-fold-body": ""
}, Bp = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Dt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = an(e, "open");
    return (n, a) => (c(), f(j, null, [
      p("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        T(ye, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        ee(v(e.label), 1),
        p("span", Ip, v(e.count), 1),
        T(ye, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Tp),
      t.value ? (c(), f("div", Rp, [
        me(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Aa = /* @__PURE__ */ V(Bp, [["__scopeId", "data-v-7f93d8d9"]]), Lp = ["onClick"], Np = { class: "text" }, Dp = { class: "aside" }, qp = {
  key: 0,
  class: "none"
}, Pp = {
  class: "skills",
  "data-agent-skills": ""
}, jp = {
  key: 0,
  class: "none-inline"
}, Fp = { class: "label" }, Wp = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Wt({ helpers: !1, skills: !1 }), a = C([]), s = C([]), o = async (r) => wr(await t.read(r));
    pe(() => [n.helpers, t.loads], async ([r]) => {
      r && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([r]) => {
      r && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (r) => r.given_name || `${os(r.role)} ${r.id}`;
    return (r, i) => (c(), f(j, null, [
      T(Aa, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (d) => n.helpers = d),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: D(() => [
          (c(!0), f(j, null, te(a.value, (d) => (c(), f("button", {
            key: d.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (u) => N(jt)("agents", d.id)
          }, [
            p("span", Np, v(l(d)), 1),
            p("span", Dp, v(N(os)(d.role)) + " " + v(d.id), 1)
          ], 8, Lp))), 128)),
          a.value.length ? w("", !0) : (c(), f("p", qp, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Aa, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (d) => n.skills = d),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: D(() => [
          p("p", Pp, [
            (c(!0), f(j, null, te(s.value, (d) => (c(), f("span", {
              key: d.id,
              "data-agent-skill": ""
            }, v(d.skill), 1))), 128)),
            s.value.length ? w("", !0) : (c(), f("span", jp, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Aa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: D(() => [
          (c(!0), f(j, null, te(e.details, ([d, u, h]) => (c(), f("div", {
            key: d,
            class: "detail",
            "data-agent-detail": ""
          }, [
            p("span", Fp, v(d) + ":", 1),
            p("span", {
              class: Y(["value", h])
            }, v(u), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Hp = /* @__PURE__ */ V(Wp, [["__scopeId", "data-v-358a0300"]]), Up = ["datetime", "title"], Je = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = kr(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(N(qs)(e.at, N(n))), 9, Up));
  }
}, zp = {
  class: "now",
  "data-agent-now": ""
}, Vp = {
  key: 1,
  class: "muted"
}, Gp = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, Kp = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, Yp = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Jp = { class: "line" }, Qp = { class: "detail" }, Xp = { class: "bar" }, Zp = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = R(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (c(), f(j, null, [
      T(Jn, { icon: "play" }, {
        default: D(() => [...o[2] || (o[2] = [
          ee("Doing now", -1)
        ])]),
        _: 1
      }),
      p("div", zp, [
        e.inspection.task ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => N(jt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (c(), f("span", Vp, v(e.nothing), 1)),
        n.value ? (c(), f("span", Gp, v(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (c(), f("span", Kp, [
          o[3] || (o[3] = ee("Last heard: ", -1)),
          T(Je, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (c(), f("div", Yp, [
        p("div", Jp, [
          p("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          p("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => N(jt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        p("span", Qp, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        p("div", Xp, [
          p("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, e1 = /* @__PURE__ */ V(Zp, [["__scopeId", "data-v-cbe6a9f7"]]), t1 = ["onClick"], n1 = { class: "text" }, a1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, s1 = { class: "text" }, o1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, l1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f(j, null, [
      T(Jn, { icon: "clock" }, {
        default: D(() => [...n[0] || (n[0] = [
          ee("Recent", -1)
        ])]),
        _: 1
      }),
      (c(!0), f(j, null, te(e.moves, (a) => (c(), f(j, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => N(jt)(a.table, a.id)
        }, [
          p("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          p("span", n1, v(a.text), 1),
          T(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, t1)) : (c(), f("div", a1, [
          p("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          p("span", s1, v(a.text), 1),
          T(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (c(), f("p", o1, "Nothing yet."))
    ], 64));
  }
}, r1 = /* @__PURE__ */ V(l1, [["__scopeId", "data-v-58f0db57"]]), i1 = {
  class: "strip",
  "data-agent-strip": ""
}, c1 = ["data-agent-cell"], u1 = {
  key: 0,
  class: "meter"
}, d1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", i1, [
      (c(!0), f(j, null, te(e.cells, (a) => (c(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        p("small", null, v(a.label), 1),
        p("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (c(), f("div", u1, [
          p("i", {
            class: Y({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, c1))), 128))
    ]));
  }
}, f1 = /* @__PURE__ */ V(d1, [["__scopeId", "data-v-b6657ab7"]]), h1 = {
  class: "who",
  "data-agent-who": ""
}, m1 = { class: "name" }, p1 = ["data-agent-state"], g1 = {
  class: "sub",
  "data-agent-identity": ""
}, v1 = {
  class: "sub",
  "data-agent-started-by": ""
}, y1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", h1, [
      p("h2", m1, [
        p("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, p1),
        ee(v(e.name), 1)
      ]),
      p("p", g1, v(e.parts.join(" · ")), 1),
      p("p", v1, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, b1 = /* @__PURE__ */ V(y1, [["__scopeId", "data-v-cf32a62c"]]), k1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, w1 = { class: "scroll" }, $1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, x1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, S1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = kr(), a = C(null), s = C(null), o = C(null), l = C({}), r = C({ helpers: 0, skills: 0 }), i = C(0), d = C([]), u = C("");
    let h = 0;
    const m = R(() => {
      var b;
      return a.value.ended_at ? wp(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function y() {
      const b = ++h, S = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!S.ok) return void (u.value = S.error);
      const A = String(t.id), M = S.value.role === "worker", [q, U, P, L, W, O] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", A, "--environment", t.environment]),
        t.read(["usage", "agent", A]),
        S.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", A]),
        t.read(["agent", "list", "--parent", A, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", A, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        M ? t.read(["worker-worktree", "points", "--agent", A]) : { ok: !1 }
      ]);
      b === h && (u.value = U.ok ? "" : U.error, a.value = S.value, s.value = wr(q).find((I) => I.id === t.id) ?? null, o.value = U.ok ? U.value : null, l.value = P.ok ? P.value : {}, r.value = { helpers: Oo(L), skills: Oo(W) }, d.value = O.ok ? O.value.points : [], i.value += 1);
    }
    return up(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], y), Ee(y), (b, S) => {
      var A;
      return c(), f("article", k1, [
        p("div", w1, [
          u.value ? (c(), f("p", $1, v(u.value), 1)) : a.value && o.value ? (c(), f(j, { key: 1 }, [
            T(b1, {
              name: N(vp)(a.value, s.value),
              state: N(yp)(a.value, s.value),
              parts: N(bp)(a.value, s.value),
              "started-by": o.value.started_by
            }, null, 8, ["name", "state", "parts", "started-by"]),
            T(f1, {
              cells: N(kp)({ row: a.value, facts: s.value, inspection: o.value, now: N(n) })
            }, null, 8, ["cells"]),
            T(e1, {
              inspection: o.value,
              tool: l.value,
              nothing: m.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            T(Op, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((A = s.value) == null ? void 0 : A.instruction) ?? "",
              points: d.value
            }, null, 8, ["label", "text", "points"]),
            T(r1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            T(Hp, {
              id: e.id,
              read: e.read,
              counts: r.value,
              loads: i.value,
              details: N($p)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (c(), f("p", x1, "Ended " + v(N(qs)(a.value.ended_at, N(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (c(), F(Ze, { key: 2 }))
        ])
      ]);
    };
  }
}, J8 = /* @__PURE__ */ V(S1, [["__scopeId", "data-v-40345b29"]]), _1 = ["aria-expanded"], M1 = { class: "drop-label" }, C1 = ["value"], E1 = {
  key: 1,
  class: "drop-lead"
}, A1 = { class: "drop-item-text" }, O1 = {
  key: 2,
  class: "drop-note"
}, T1 = {
  key: 1,
  class: "drop-none"
}, I1 = {
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
    const n = e, a = t, s = C(!1), o = C(null), l = C(""), r = R(() => {
      const d = l.value.trim().toLowerCase();
      return d ? n.items.filter((u) => `${u.label} ${u.note || ""}`.toLowerCase().includes(d)) : n.items;
    });
    function i(d) {
      s.value = !1, a("pick", d);
    }
    return (d, u) => (c(), f("div", {
      class: Y(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      p("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Y(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: u[0] || (u[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (c(), F(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : w("", !0),
        p("span", M1, v(e.label), 1),
        T(ye, {
          name: "down",
          size: 11
        })
      ], 10, _1),
      s.value ? (c(), F(ia, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: u[2] || (u[2] = (h) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (c(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: u[1] || (u[1] = (h) => l.value = h.target.value)
          }, null, 40, C1)) : w("", !0),
          (c(!0), f(j, null, te(r.value, (h) => (c(), F(Mt, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (m) => i(h)
          }, {
            default: D(() => [
              h.running !== void 0 ? (c(), f("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : w("", !0),
              h.lead ? (c(), f("span", E1, v(h.lead), 1)) : w("", !0),
              p("span", A1, v(h.label), 1),
              h.note ? (c(), f("span", O1, v(h.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? w("", !0) : (c(), f("p", T1, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, Sr = /* @__PURE__ */ V(I1, [["__scopeId", "data-v-29dfcce5"]]);
function R1(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ee(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Qe(() => n.disconnect()), t;
}
const B1 = ["data-comment-id"], L1 = {
  key: 0,
  class: "comment-top"
}, N1 = { class: "comment-mark" }, D1 = {
  class: "comment-body",
  "data-comment": ""
}, q1 = { class: "comment-foot" }, P1 = {
  key: 1,
  "data-comment-lost": ""
}, j1 = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (c(), f("article", {
      class: Y(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (c(), f("div", L1, [
        p("span", N1, v(e.comment.number), 1),
        p("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : w("", !0),
      p("p", D1, v(e.comment.body), 1),
      p("div", q1, [
        e.comment.created_at ? (c(), F(Je, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (c(), f("span", P1, "The text has changed here")) : e.comment.quote ? (c(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, B1));
  }
}, _r = /* @__PURE__ */ V(j1, [["__scopeId", "data-v-a37d4507"]]);
var vl;
/Mac|iPhone|iPad/.test(((vl = navigator.userAgentData) == null ? void 0 : vl.platform) || navigator.platform);
function Mr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const F1 = {
  class: "comment-box",
  "data-comment-box": ""
}, W1 = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, H1 = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, U1 = { class: "comment-row" }, z1 = ["placeholder"], V1 = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Dt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Dt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = an(e, "draft"), l = C(""), r = C(!1), i = C(null), d = R(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), u = R(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      i.value.style.height = "auto", i.value.style.height = `${i.value.scrollHeight + 2}px`;
    }
    async function m() {
      const y = o.value.trim();
      if (!(!y || r.value)) {
        l.value = "", r.value = !0;
        try {
          await a.send(y), o.value = "", await Xe(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          r.value = !1;
        }
      }
    }
    return t({ focus: () => i.value.focus() }), (y, b) => (c(), f("div", F1, [
      e.selection ? (c(), f("div", W1, [
        b[3] || (b[3] = p("span", { class: "comment-on-label" }, "On this selection", -1)),
        p("span", {
          class: Y(["comment-on-words", { mono: d.value }])
        }, v(e.selection.quote), 3),
        T(ua, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (S) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (c(), f("p", H1, v(l.value), 1)) : w("", !0),
      p("div", U1, [
        qe(p("textarea", {
          ref_key: "box",
          ref: i,
          "onUpdate:modelValue": b[1] || (b[1] = (S) => o.value = S),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: u.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = qt((S) => N(Mr)(S, m), ["enter"]))
        }, null, 42, z1), [
          [_t, o.value]
        ]),
        T(de, {
          variant: "primary",
          busy: r.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: m
        }, {
          default: D(() => [...b[4] || (b[4] = [
            ee("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, G1 = /* @__PURE__ */ V(V1, [["__scopeId", "data-v-41d2081c"]]), On = (e) => e ? e.split(", ") : [];
function K1({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Y1(e, t) {
  return {
    reads: On(e.reads_allowed),
    runs: On(e.runs_allowed),
    missing: [...On(e.reads_missing), ...On(e.runs_missing)],
    ask: t
  };
}
const J1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = ji("SkeletonParts", !0);
      return c(!0), f(j, null, te(e.parts, (i, d) => (c(), f(j, { key: d }, [
        (c(!0), f(j, null, te(i.count, (u) => (c(), F(Ut, {
          key: u,
          value: i.shape
        }, {
          line: D(() => [
            T(Xt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            T(Xt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            T(Xt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            p("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            p("div", {
              class: "skeleton-row",
              style: ve(a(i))
            }, [
              T(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            p("div", {
              class: "skeleton-stack",
              style: ve(a(i))
            }, [
              T(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            p("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(i))
            }, [
              T(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            p("div", {
              class: "skeleton-grid",
              style: ve(s(i))
            }, [
              T(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Q1 = /* @__PURE__ */ V(J1, [["__scopeId", "data-v-fa8baeaf"]]), X1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Z1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), f("div", X1, [
      T(Q1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ps = /* @__PURE__ */ V(Z1, [["__scopeId", "data-v-52f66b64"]]), Cr = {
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
}, eg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: Y(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Er = /* @__PURE__ */ V(eg, [["__scopeId", "data-v-9e7e1157"]]), tg = { class: "bars" }, ng = { class: "bar-name" }, ag = { class: "bar-value" }, sg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), f("div", tg, [
      (c(!0), f(j, null, te(e.items, (i, d) => (c(), F(gt(i.open ? "button" : "div"), {
        key: `${d}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Y(["bar-row", i.tone, { opens: i.open }]),
        onClick: (u) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          p("span", ng, v(i.label), 1),
          T(nr, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", ag, v(i.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, og = /* @__PURE__ */ V(sg, [["__scopeId", "data-v-663427f4"]]), lg = { class: "bars" }, rg = {
  key: 0,
  class: "bars-title"
}, ig = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("div", lg, [
      e.node.title ? (c(), f("span", rg, v(e.node.title), 1)) : w("", !0),
      T(og, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, cg = /* @__PURE__ */ V(ig, [["__scopeId", "data-v-7135bb11"]]), ug = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = R(() => n[a.node.type](a.node));
    return (l, r) => (c(), f("div", {
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (c(!0), f(j, null, te(e.node.children || [], (i, d) => (c(), F(Ar, {
        key: d,
        node: i,
        onOpen: r[0] || (r[0] = (u) => s("open", u)),
        onFile: r[1] || (r[1] = (u) => s("file", u))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Pn = /* @__PURE__ */ V(ug, [["__scopeId", "data-v-d142a3f4"]]), dg = {
  key: 0,
  class: "card-head"
}, fg = { class: "card-title" }, hg = {
  key: 0,
  class: "card-note"
}, mg = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), f("header", dg, [
        p("span", fg, v(e.node.title), 1),
        e.node.note ? (c(), f("span", hg, v(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      T(Pn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, pg = /* @__PURE__ */ V(mg, [["__scopeId", "data-v-67b72d40"]]), gg = { class: "fact" }, vg = { class: "fact-label" }, yg = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", gg, [
      p("span", vg, v(e.label), 1),
      T(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, bg = /* @__PURE__ */ V(yg, [["__scopeId", "data-v-3a88ecf8"]]), kg = { class: "list" }, wg = { class: "list-label" }, $g = {
  key: 1,
  class: "list-note"
}, xg = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("div", kg, [
      (c(!0), f(j, null, te(e.items, (o, l) => (c(), F(gt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          p("span", wg, v(o.label), 1),
          o.badge ? (c(), F(Er, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (c(), f("span", $g, v(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Sg = /* @__PURE__ */ V(xg, [["__scopeId", "data-v-ebe2ae0a"]]), _g = { class: "table" }, Mg = {
  key: 0,
  class: "table-row empty"
}, Cg = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), f("div", _g, [
      p("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (c(!0), f(j, null, te(e.columns, (r) => (c(), f("span", {
          key: r,
          class: "cell"
        }, v(r), 1))), 128))
      ], 4),
      (c(!0), f(j, null, te(e.rows, (r, i) => (c(), F(gt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Y(["table-row", r.tone, { opens: r.open }]),
        style: ve(s.value),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: D(() => [
          (c(!0), f(j, null, te(r.cells, (d, u) => (c(), f("span", {
            key: u,
            class: "cell"
          }, v(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), f("div", Mg, v(e.empty), 1)) : w("", !0)
    ]));
  }
}, Eg = /* @__PURE__ */ V(Cg, [["__scopeId", "data-v-9326a52e"]]), Ag = { class: "stat-value" }, Og = { class: "stat-label" }, Tg = {
  key: 0,
  class: "stat-note"
}, Ig = {
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
    return (a, s) => (c(), F(gt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        p("span", Ag, v(e.value), 1),
        p("span", Og, v(e.label), 1),
        e.note ? (c(), f("span", Tg, v(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Rg = /* @__PURE__ */ V(Ig, [["__scopeId", "data-v-ad0db6d6"]]), Bg = { class: "code" }, Lg = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), F(Ut, {
      value: e.node.type
    }, {
      stack: D(() => [
        T(Pn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        T(Pn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        T(Pn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        T(pg, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        p("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        T(Rg, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        T(cg, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        T(Eg, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        T(Sg, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        T(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        T(bg, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        T(Er, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        p("pre", Bg, [
          p("code", null, v(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Ar = /* @__PURE__ */ V(Lg, [["__scopeId", "data-v-cbdcf540"]]), Ng = { class: "dashboard" }, Dg = { class: "trail" }, qg = ["onClick"], Pg = {
  key: 0,
  class: "gone",
  role: "status"
}, jg = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = C(!!n.page && !s(n.page)), l = C(n.page && !o.value ? [n.page] : []), r = R(() => l.value.at(-1) || n.document.start), i = R(() => (n.document.pages || {})[r.value] || null), d = (m) => ((n.document.pages || {})[m] || {}).title || m, u = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, h = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (m, y) => (c(), f("div", Ng, [
      e.document.broken ? (c(), F(sn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ee(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), F(sn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ee(v(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), f(j, { key: 2 }, [
        p("nav", Dg, [
          p("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(d(e.document.start)), 3),
          (c(!0), f(j, null, te(l.value, (b, S) => (c(), f(j, {
            key: `${S}-${b}`
          }, [
            y[2] || (y[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Y(["step", { current: S === l.value.length - 1 }]),
              onClick: (A) => h(S + 1)
            }, v(d(b)), 11, qg)
          ], 64))), 128))
        ]),
        o.value ? (c(), f("p", Pg, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        T(Ht, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), f("div", {
              key: r.value,
              class: "page"
            }, [
              T(Ar, {
                node: i.value.view,
                onOpen: u,
                onFile: y[1] || (y[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : w("", !0)
    ]));
  }
}, Fg = /* @__PURE__ */ V(jg, [["__scopeId", "data-v-fbe83734"]]);
function Wg(e, t) {
  const n = Ue(), a = Cs(e, Cr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ee(e), Qe(() => {
    s(), a.cancel();
  });
}
const Hg = {
  key: 0,
  class: "window-failure"
}, Ug = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ue(), o = C(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Wg(l, n.events) : _s(l, () => !0, Cr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), f("p", Hg, v(o.value.error), 1)) : o.value ? (c(), F(Fg, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (d) => a("file", d))
    }, null, 8, ["document"])) : w("", !0);
  }
}, zg = 1e4;
class Vg {
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
    return this.heardAt !== null && t - this.heardAt > zg;
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
const Gg = {
  key: 0,
  class: "frame-note"
}, Kg = {
  key: 0,
  class: "frame-note"
}, Yg = ["src", "title"], Jg = 1e3, Qg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ue(), a = C(null), s = C(!1), o = C(!1);
    let l = null, r = 0;
    return Ee(() => {
      l = new Vg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Jg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, d) => o.value ? (c(), f("p", Gg, "This window was closed because it stopped answering.")) : (c(), f(j, { key: 1 }, [
      s.value ? (c(), f("div", Kg, [
        d[2] || (d[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        T(de, {
          onClick: d[0] || (d[0] = (u) => o.value = !0)
        }, {
          default: D(() => [...d[1] || (d[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: N(n).window
      }, null, 8, Yg)
    ], 64));
  }
}, Xg = /* @__PURE__ */ V(Qg, [["__scopeId", "data-v-32a49046"]]), Zg = {
  class: "allowance-prompt",
  role: "dialog"
}, ev = { class: "allowance-prompt-text" }, tv = { class: "allowance-prompt-buttons" }, nv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("div", Zg, [
      p("p", ev, v(N(K1)(e.request)), 1),
      p("div", tv, [
        T(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        T(de, {
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
}, av = /* @__PURE__ */ V(nv, [["__scopeId", "data-v-cad69fe2"]]), Oa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), F(sn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        ee(v(e.reason) + " ", 1),
        e.retry ? (c(), F(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.removable ? (c(), F(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, sv = ["data-window", "data-agent"], ov = {
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
    const r = Te(du, null), i = ud({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Te(od, null),
      setOption: (h, m) => a("option", h, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (h, m) => {
        a("open", h, m), r == null || r(h, m);
      }
    });
    yl(Pe, i), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Ee(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Fi((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const d = () => sa(n.component), u = () => {
      var h, m;
      return ((m = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, m) => (c(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), F(av, {
        key: 0,
        request: u(),
        onAnswer: m[0] || (m[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : w("", !0),
      e.unavailableReason ? (c(), F(Oa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), F(Oa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), f(j, { key: 4 }, [
        (c(), F(d, { key: o.value })),
        e.skeleton.length && !N(i).answered.value ? (c(), F(Ps, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : w("", !0)
      ], 64)) : (c(), F(Oa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, sv));
  }
}, Zt = /* @__PURE__ */ V(ov, [["__scopeId", "data-v-c4443e2b"]]), Or = {
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
    const n = e, a = t, s = { render: () => sa(Xg, { src: n.entry.entry_url }) };
    return (o, l) => (c(), F(Zt, {
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
}, lv = ["data-window"], Tr = {
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
    const n = e, a = t, s = Ye(null), o = C("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Oc();
          } catch (r) {
            if (Ec(r) && Ac(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      T(Ps, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, lv)) : (c(), F(Zt, {
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
}, rv = {
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
    const n = t, a = e, s = R(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = R(() => s.value && { render: () => sa(Ug, { line: s.value.line, events: s.value.events }) }), l = C(null), r = R(() => {
      var m, y;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), i = R(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), d = R(
      () => {
        var m, y;
        return l.value ? Y1(l.value, h) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function u() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function h() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await u(), m;
    }
    return pe(
      () => {
        var m, y;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await u(), d.value.missing.length && !r.value && h();
      },
      { immediate: !0 }
    ), (m, y) => {
      var b, S;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (c(), F(Ps, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((S = s.value) == null ? void 0 : S.shows) === "one-agent" && e.agent === null ? (c(), F(sn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), F(Zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), F(Tr, {
        key: d.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (A, M) => n("option", A, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), F(Or, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (A, M) => n("option", A, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), F(Zt, {
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
        onOption: y[2] || (y[2] = (A, M) => n("option", A, M))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), F(Zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (A) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, iv = ["data-section"], cv = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, uv = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Te(ql, null), a = R(() => {
      const o = t.names.map((r) => ({ name: r, offered: !!(n != null && n.catalogue.window(r)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((r) => !t.names.includes(r.name));
      return [...o, ...l.map((r) => ({ name: r.name, offered: !0 }))];
    }), s = R(() => ({ row: t.row }));
    return (o, l) => N(n) ? (c(!0), f(j, { key: 0 }, te(a.value, (r) => (c(), f("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      r.offered ? (c(), F(rv, {
        key: 0,
        name: r.name,
        catalogue: N(n).catalogue,
        subscriptions: N(n).subscriptions,
        environment: N(n).environment,
        prompts: N(n).prompts,
        "shell-read": N(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (c(), f("p", cv, v(r.name) + " is not available", 1))
    ], 8, iv))), 128)) : w("", !0);
  }
}, Ir = /* @__PURE__ */ V(uv, [["__scopeId", "data-v-a47d36b7"]]), dv = { class: "rail-head" }, fv = { key: 0 }, hv = {
  key: 1,
  class: "rail-none"
}, mv = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (c(), f("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      p("div", dv, [
        n[0] || (n[0] = p("h3", null, "Comments", -1)),
        e.comments.length ? (c(), f("span", fv, v(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (c(!0), f(j, { key: 0 }, te(e.comments, (a) => (c(), F(_r, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (c(), f("p", hv, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, pv = /* @__PURE__ */ V(mv, [["__scopeId", "data-v-4d684649"]]), gv = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, vv = ["aria-pressed"], yv = ["aria-pressed"], bv = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, kv = {
  key: 0,
  role: "alert"
}, wv = {
  key: 1,
  class: "sidebar-none"
}, $v = ["data-question-id"], xv = { class: "question-state" }, Sv = ["data-question-show", "onClick"], _v = {
  key: 0,
  class: "sidebar-none"
}, Mv = {
  key: 1,
  class: "question-answer"
}, Cv = {
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
    const t = Te(ql, null);
    return (n, a) => (c(), f("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      p("nav", gv, [
        p("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, vv),
        p("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, yv)
      ]),
      e.mode === "comments" ? (c(), f(j, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (c(), F(pv, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : w("", !0),
        T(mn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (c(), f("aside", bv, [
        e.failure ? (c(), f("p", kv, v(e.failure), 1)) : e.questions.length ? w("", !0) : (c(), f("p", wv, "No questions about this text yet.")),
        (c(!0), f(j, null, te(e.questions, (s) => {
          var o;
          return c(), f("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            p("span", xv, v(N(ca)("question", s.state)), 1),
            p("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Sv),
            s.quote ? (c(), f(j, { key: 0 }, [
              p("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (c(), f("p", _v, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (c(), f("p", Mv, "Answered: " + v(s.answer), 1)) : w("", !0),
            T(Ir, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            T(Jl, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = N(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, $v);
        }), 128))
      ]))
    ], 2));
  }
}, To = /* @__PURE__ */ V(Cv, [["__scopeId", "data-v-2718a08d"]]), Ev = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Av = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Wt({ abstract: n.row.abstract, body: n.row.body }), o = C("");
    async function l() {
      const r = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = r.ok ? "" : r.error, r.ok && a("saved");
    }
    return (r, i) => (c(), F(da, {
      title: "Edit the document",
      wide: "",
      onClose: i[3] || (i[3] = (d) => a("close"))
    }, {
      foot: D(() => [
        p("span", Ev, v(o.value), 1),
        T(de, {
          onClick: i[2] || (i[2] = (d) => a("close"))
        }, {
          default: D(() => [...i[6] || (i[6] = [
            ee("Cancel", -1)
          ])]),
          _: 1
        }),
        T(de, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: D(() => [...i[7] || (i[7] = [
            ee("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: D(() => [
        p("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: $e(l, ["prevent"])
        }, [
          p("label", null, [
            i[4] || (i[4] = p("span", null, "Abstract", -1)),
            qe(p("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (d) => s.abstract = d)
            }, null, 512), [
              [_t, s.abstract]
            ])
          ]),
          p("label", null, [
            i[5] || (i[5] = p("span", null, "Text", -1)),
            qe(p("textarea", {
              "onUpdate:modelValue": i[1] || (i[1] = (d) => s.body = d),
              rows: "20"
            }, null, 512), [
              [_t, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Ov = /* @__PURE__ */ V(Av, [["__scopeId", "data-v-e99f14e0"]]);
function Rr(e, t) {
  const n = C([]), a = C(!1), s = C(null), o = C(0), l = C(!1), r = C("");
  let i = 0, d = 0;
  const u = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: S, id: A, title: M } = e(), q = `On ${S} ${A}, ${M}: `;
    return b.text.startsWith(q) ? b.text.slice(q.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: S, id: A } = e();
    if (!A) return;
    const M = ++d;
    l.value = !0, r.value = "";
    try {
      const q = await t([S, "comments", String(A), "--page", String(b), "--page-size", "25"]);
      if (M !== d) return;
      if (!q.ok) {
        r.value = q.error;
        return;
      }
      const U = q.value.rows ?? [], P = b === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(P.map((L) => [L.id, L])).values()], o.value = q.value.total ?? n.value.length, s.value = q.value.next_page ?? null;
    } catch (q) {
      M === d && (r.value = q.message);
    } finally {
      M === d && (l.value = !1);
    }
  }
  async function m(b) {
    var L;
    const { noun: S, id: A } = e(), M = `${S}:${A}`, q = { id: `sending-${++i}`, text: b };
    n.value = [...n.value, q], o.value++, a.value = !0;
    const U = await t([S, "comment", String(A), b]);
    if (M !== `${e().noun}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((W) => W.id !== q.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await h();
    const P = (L = U.value) == null ? void 0 : L.id;
    P && !n.value.some((W) => W.id === P) && (n.value = [...n.value, { ...q, id: P }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", d++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: u, send: m, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: r };
}
function Tv(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let i = n.length - 1; i >= 0; i -= 1)
    for (let d = a.length - 1; d >= 0; d -= 1)
      s[i][d] = n[i] === a[d] ? s[i + 1][d + 1] + 1 : Math.max(s[i + 1][d], s[i][d + 1]);
  const o = [];
  let l = 0, r = 0;
  for (; l < n.length || r < a.length; )
    l < n.length && r < a.length && n[l] === a[r] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, r += 1) : r < a.length && (l === n.length || s[l][r + 1] >= s[l + 1][r]) ? (o.push({ key: `new:${r}`, type: "added", text: a[r] }), r += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const Iv = {
  class: "document-tab",
  "data-document-revisions": ""
}, Rv = ["datetime"], Bv = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Lv = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Nv = {
  key: 2,
  class: "document-none"
}, Dv = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), o = C(""), l = R(() => s.value ? Tv(s.value.body, n.text) : []);
    async function r(d) {
      const u = await n.read(["doc", "revision", String(n.id), String(d.number)]);
      s.value = u.ok ? u.value : null, o.value = u.ok ? "" : u.error;
    }
    async function i() {
      const d = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = d.ok ? "" : d.error, d.ok && a("restored");
    }
    return (d, u) => (c(), f("div", Iv, [
      e.editing ? (c(), F(de, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: u[0] || (u[0] = (h) => a("close-revision"))
      }, {
        default: D(() => [...u[1] || (u[1] = [
          ee("Close the open revision", -1)
        ])]),
        _: 1
      })) : w("", !0),
      e.revisions.length ? (c(), f(j, { key: 1 }, [
        (c(!0), f(j, null, te(e.revisions, (h) => (c(), F(de, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (m) => r(h)
        }, {
          default: D(() => [
            ee("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            p("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, Rv)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (c(), f("p", Bv, v(o.value), 1)) : w("", !0),
        s.value ? (c(), f(j, { key: 1 }, [
          T(de, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: i
          }, {
            default: D(() => [...u[2] || (u[2] = [
              ee("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          p("div", Lv, [
            (c(!0), f(j, null, te(l.value, (h) => (c(), f("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (c(), f("p", Nv, "No revisions"))
    ]));
  }
}, qv = /* @__PURE__ */ V(Dv, [["__scopeId", "data-v-3a381aa4"]]), Pv = "button, [data-comment-number]", jv = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Br(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Pv) || n.push(t.currentNode);
  return n;
}
function Io(e, t, n) {
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
const Fv = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Wv(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Br(e), s = a.map((d) => d.data).join(""), o = Io(a, n.startContainer, n.startOffset), l = s.slice(o, Io(a, n.endContainer, n.endOffset)), r = l.trim();
  if (!r) return null;
  const i = n.commonAncestorContainer;
  return { quote: r, position: o + l.indexOf(r), selection_type: Fv(i.nodeType === Node.TEXT_NODE ? i.parentElement : i) };
}
function Hv(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Uv(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), r = Math.min(n - s, o.data.length);
    l < r && a.push({ node: o, from: l, to: r }), s += o.data.length;
  }
  return a;
}
function Ta(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function zv({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Vv(e, t) {
  const n = Br(e), a = Hv(n.map((r) => r.data).join(""), t);
  if (a < 0) return !1;
  const s = Uv(n, a, a + t.quote.length), o = (r) => r.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(zv).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const r of l)
    r.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && r.classList.add("hot"), t.id && (r.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ta(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ta(t.number, t.id, t.label)) : l.at(-1).append(Ta(t.number, t.id, t.label))), !0;
}
function Gv(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Vv(e, a) && a.id && n.push(a.id);
  return n;
}
const Kv = (e) => e.closest(jv) ?? e;
function Ro(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Yv = {
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
    const a = e, s = n, o = C(null), l = C(null), r = C(null), i = C(!1), d = C(null);
    function u() {
      if (!l.value || i.value) return;
      l.value.innerHTML = a.html;
      const S = a.comments.filter((U) => U.quote).map((U) => ({ ...U, label: a.annotationLabel, hot: U.id === a.hot })), A = Gv(l.value, a.pending ? [...S, { ...a.pending, pending: !0 }] : S);
      s("lost", A);
      const M = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!M) {
        d.value = null;
        return;
      }
      const q = document.createElement("div");
      q.className = "inline-comment", Kv(M).after(q), d.value = q;
    }
    function h() {
      if (!l.value) return;
      const S = Wv(l.value);
      if (i.value = !!S, !S) {
        r.value = null;
        return;
      }
      const A = window.getSelection().getRangeAt(0).getBoundingClientRect(), M = o.value.getBoundingClientRect();
      r.value = { left: `${Math.max(A.left - M.left, 0)}px`, top: `${A.top - M.top + o.value.scrollTop}px` }, s("select", S);
    }
    function m(S) {
      const A = S.target.closest("[data-comment-number]");
      A ? s("number", Number(A.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(S) {
      var A;
      (A = l.value.querySelector(`[data-comment="${S}"]`)) == null || A.scrollIntoView({ block: "center" });
    }
    function b(S) {
      var A;
      (A = l.value.querySelectorAll("h3, h4, h5, h6")[S]) == null || A.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, i.value, a.pending], u, { flush: "post" }), Ee(() => {
      u(), document.addEventListener("selectionchange", h);
    }), Qe(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: Xe }), (S, A) => (c(), f("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      p("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: m
      }, null, 512),
      r.value ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ve(r.value),
        "data-comment-pill": "",
        onMousedown: A[0] || (A[0] = $e(() => {
        }, ["prevent"])),
        onClick: A[1] || (A[1] = (M) => s("write"))
      }, [
        T(ye, {
          name: "chat",
          size: 13
        }),
        A[2] || (A[2] = ee("Comment on this", -1))
      ], 36)) : w("", !0),
      d.value ? (c(), F(la, {
        key: 1,
        to: d.value
      }, [
        me(S.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      me(S.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Jv = /* @__PURE__ */ V(Yv, [["__scopeId", "data-v-548d0aaa"]]), Qv = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Xv = { class: "document-tabs" }, Zv = { class: "document-body" }, e0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, t0 = {
  key: 1,
  class: "document-loading"
}, n0 = {
  class: "document-details",
  "data-resource-fields": ""
}, a0 = 760, s0 = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = C(null), a = R1(n), s = R(() => a.value !== null && a.value < a0), o = C(null), l = C(""), r = C([]), i = C([]), d = C(""), u = C("comments"), h = C("text"), m = C(0), y = C(0), b = C([]), S = C(null), A = C(""), M = C(!1), q = C(null), U = C(null);
    let P = 0;
    const L = Rr(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), W = R(() => Ro(L.comments.value)), O = R(() => u.value === "questions" ? Ro(i.value) : W.value), I = R(() => u.value === "questions" ? O.value.length : L.total.value), x = R(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? rr(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), k = R(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, ae) => ({ key: String(ae), value: ae, label: Z.replace(/^#+ /, "") }));
    }), $ = R(() => W.value.find((fe) => fe.id === y.value)), g = R(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), _ = R(() => h.value === "comments" && !s.value ? "text" : h.value), E = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function B() {
      const fe = ++P, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== P) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), oe = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === P && (i.value = E(ae), d.value = ae.ok ? "" : ae.error, r.value = oe ? E(oe) : []);
    }
    async function H(fe) {
      const Z = S.value ? ["--quote", S.value.quote, "--position", String(S.value.position), "--selection-type", S.value.selection_type] : [], ae = await t.read([t.noun, "comment", String(t.id), ...Z, "--", fe]);
      if (!ae.ok) throw new Error(ae.error);
      S.value = null, await Promise.all([B(), L.load()]);
    }
    async function X() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await B();
    }
    function se() {
      A.value.trim() || (S.value = null);
    }
    function ie(fe) {
      var Z;
      if (m.value = fe, s.value && u.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === fe ? 0 : fe : (Z = n.value.querySelector(u.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function ge(fe) {
      var Z, ae;
      h.value = "text", m.value = fe, await ((Z = q.value) == null ? void 0 : Z.nextTick()), (ae = q.value) == null || ae.show(fe);
    }
    function Ae() {
      M.value = !1, B();
    }
    return pe(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", m.value = 0, y.value = 0, S.value = null, i.value = [], d.value = "", B();
    }, { immediate: !0 }), pe(u, () => {
      m.value = 0, y.value = 0;
    }), (fe, Z) => (c(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (c(), f("div", Qv, [
        T(de, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (ae) => M.value = !0)
        }, {
          default: D(() => [...Z[14] || (Z[14] = [
            ee("Edit", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      p("nav", Xv, [
        p("button", {
          type: "button",
          class: Y(["document-tab-button", { on: _.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (ae) => h.value = "text")
        }, "Text", 2),
        s.value ? (c(), f("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: _.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (ae) => h.value = "comments")
        }, [
          ee(v(u.value === "questions" ? "Questions" : "Comments") + " ", 1),
          p("em", null, v(I.value || ""), 1)
        ], 2)) : w("", !0),
        e.noun === "doc" ? (c(), f("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: _.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (ae) => h.value = "revisions")
        }, [
          Z[15] || (Z[15] = ee("Revisions ", -1)),
          p("em", null, v(r.value.length || ""), 1)
        ], 2)) : w("", !0),
        Z[16] || (Z[16] = p("span", { class: "document-tabs-space" }, null, -1)),
        _.value === "text" && k.value.length > 1 ? (c(), F(Sr, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: k.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (ae) => {
            var oe;
            return (oe = q.value) == null ? void 0 : oe.showHeading(ae.value);
          })
        }, null, 8, ["label", "items"])) : w("", !0)
      ]),
      p("div", Zv, [
        l.value ? (c(), f("p", e0, v(l.value), 1)) : o.value ? _.value === "revisions" ? (c(), F(qv, {
          key: 2,
          id: e.id,
          revisions: r.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: X,
          onRestored: B
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : _.value === "comments" ? (c(), F(To, {
          key: 3,
          mode: u.value,
          "onUpdate:mode": Z[5] || (Z[5] = (ae) => u.value = ae),
          tab: "",
          comments: W.value,
          questions: i.value,
          hot: m.value,
          lost: b.value,
          failure: d.value,
          read: e.read,
          "comment-more": !!N(L).nextPage.value,
          "comment-loading": N(L).loading.value,
          "comment-failure": N(L).failure.value,
          "comment-total": N(L).total.value,
          onMore: N(L).loadMore,
          onShow: ge,
          onChanged: B
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (c(), f(j, { key: 4 }, [
          T(Jv, {
            ref_key: "words",
            ref: q,
            html: x.value,
            comments: O.value,
            "annotation-label": u.value === "questions" ? "Question" : "Comment",
            hot: m.value,
            pending: S.value,
            inline: y.value,
            onSelect: Z[7] || (Z[7] = (ae) => S.value = ae),
            onClear: se,
            onNumber: ie,
            onWrite: Z[8] || (Z[8] = (ae) => {
              var oe;
              return (oe = U.value) == null ? void 0 : oe.focus();
            }),
            onLost: Z[9] || (Z[9] = (ae) => b.value = ae)
          }, {
            inline: D(() => [
              $.value ? (c(), F(_r, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (ae) => ge($.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: D(() => [
              p("dl", n0, [
                Z[18] || (Z[18] = p("h4", null, "Details", -1)),
                Z[19] || (Z[19] = p("dt", null, "State", -1)),
                p("dd", null, v(g.value), 1),
                o.value.close_reason ? (c(), f(j, { key: 0 }, [
                  Z[17] || (Z[17] = p("dt", null, "Why closed", -1)),
                  p("dd", null, v(o.value.close_reason), 1)
                ], 64)) : w("", !0),
                Z[20] || (Z[20] = p("dt", null, "Created", -1)),
                p("dd", null, [
                  T(Je, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = p("dt", null, "Updated", -1)),
                p("dd", null, [
                  T(Je, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? w("", !0) : (c(), F(To, {
            key: 0,
            mode: u.value,
            "onUpdate:mode": Z[10] || (Z[10] = (ae) => u.value = ae),
            comments: W.value,
            questions: i.value,
            hot: m.value,
            lost: b.value,
            failure: d.value,
            read: e.read,
            "comment-more": !!N(L).nextPage.value,
            "comment-loading": N(L).loading.value,
            "comment-failure": N(L).failure.value,
            "comment-total": N(L).total.value,
            onMore: N(L).loadMore,
            onShow: ge,
            onChanged: B
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (c(), f("div", t0, [
          T(Ze)
        ]))
      ]),
      o.value ? (c(), F(G1, {
        key: 1,
        ref_key: "composer",
        ref: U,
        draft: A.value,
        "onUpdate:draft": Z[11] || (Z[11] = (ae) => A.value = ae),
        selection: S.value,
        send: H,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (ae) => S.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      M.value ? (c(), F(Ov, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (ae) => M.value = !1),
        onSaved: Ae
      }, null, 8, ["noun", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, Q8 = /* @__PURE__ */ V(s0, [["__scopeId", "data-v-784faf41"]]), o0 = {
  key: 1,
  class: "row-list-failure"
}, l0 = ["data-row"], r0 = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = C(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), F(Ze, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), f("p", o0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), F(sn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        ee(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), f(j, { key: 3 }, [
      (c(), F(gt(e.arrival ? bl : "ul"), De(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), f(j, null, te(e.rows, (r) => (c(), f("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            me(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, l0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : w("", !0)
    ], 64));
  }
}, i0 = /* @__PURE__ */ V(r0, [["__scopeId", "data-v-6c7ba696"]]), c0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, u0 = {
  key: 1,
  class: "agent-rows-note"
}, d0 = {
  key: 2,
  class: "agent-rows-note"
}, f0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, h0 = ["data-agent-row", "onClick"], m0 = { class: "agent-row-name" }, p0 = { class: "agent-row-state" }, g0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), f("div", c0, [
      e.loaded ? e.failure ? (c(), f("p", u0, v(e.failure), 1)) : e.rows.length ? (c(), f(j, { key: 3 }, [
        p("p", f0, v(a.value) + " running", 1),
        (c(!0), f(j, null, te(n.value, (l) => (c(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => N(Ne)(`agents:${l.id}`)
        }, [
          p("span", m0, "#" + v(l.id) + " " + v(l.session), 1),
          p("span", p0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, h0))), 128))
      ], 64)) : (c(), f("p", d0, v(e.none), 1)) : (c(), F(Ze, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, X8 = /* @__PURE__ */ V(g0, [["__scopeId", "data-v-a01e5a17"]]), ct = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, He = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, We = { across: 48, down: 110, margin: 32, labelSpace: 14 }, v0 = 6;
function js(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const y0 = (e) => {
  const t = js(e, ct.lineChars), n = Math.max(ct.minWidth, Math.max(...t.map((a) => a.length)) * ct.charWidth + ct.padX * 2);
  return { name: e, lines: t, line: ct.line, padY: ct.padY, width: n, height: t.length * ct.line + ct.padY * 2 };
};
function b0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const d = s.get(r[1]);
      d === "open" ? a.add(i) : d || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function k0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function w0(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), d = (u) => {
      const h = r(u).map((m) => i.get(m));
      return h.length ? h.reduce((m, y) => m + y, 0) / h.length : i.get(u);
    };
    return [...l].sort((u, h) => d(u) - d(h));
  };
  for (let l = 0; l < v0; l++) {
    const r = l % 2 === 0, i = a.map((d, u) => u);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((d) => {
      const u = (h) => t.filter((m) => m[r ? 1 : 0] === h).map((m) => m[r ? 0 : 1]);
      a[d] = o(a[d], u);
    });
  }
  return a;
}
function $0(e, t) {
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
function x0(e) {
  const t = [...new Set(e.flatMap(([P, L]) => [P, L]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = b0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, L) => !s.has(L)), l = k0(t, o), r = w0(t, o, l), i = new Map(t.map((P) => [P, y0(P)])), d = r.map((P) => P.reduce((L, W) => L + i.get(W).width, 0) + We.across * (P.length - 1)), u = Math.max(...d) + We.margin * 2, h = _0(e, l, r.length), m = /* @__PURE__ */ new Map();
  let y = We.margin;
  r.forEach((P, L) => {
    let W = (u - d[L]) / 2;
    const O = Math.max(...P.map((I) => i.get(I).height));
    P.forEach((I) => {
      const x = i.get(I);
      m.set(I, { ...x, x: W, y: y + (O - x.height) / 2 }), W += x.width + We.across;
    }), y += O + (h[L] ?? We.down);
  });
  const b = e.map(([P, L, W], O) => ({ from: P, to: L, label: W || "", back: s.has(O) || l.get(L) <= l.get(P) }));
  $0(b, m);
  const S = b.map((P) => M0(P, m.get(P.from), m.get(P.to))), A = [...m.values()], M = O0(S, A), q = Math.max(y - We.down, ...M.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(u - We.margin, ...M.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + We.margin, height: q + We.margin, nodes: A, arrows: M };
}
const S0 = (e) => e ? js(e, He.lineChars).length * He.line + He.pad * 2 : 0;
function _0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => We.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((d, u) => d - u);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += S0(l) + We.labelSpace);
  }), a.map((s) => Math.max(We.down, s));
}
function M0(e, t, n) {
  const a = e.label ? js(e.label, He.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * He.charWidth + He.pad * 2 : 0, o = a.length * He.line + (a.length ? He.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, u = (d - r) / 2, h = [{ x: l, y: r }, { x: l, y: r + u }, { x: i, y: d - u }, { x: i, y: d }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${r} C${l} ${r + u} ${i} ${d - u} ${i} ${d}` };
}
const C0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, E0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], A0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * He.line);
function O0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, d) => {
      const u = C0(a.curve, i);
      return { x: u.x - a.labelWidth / 2, y: u.y - a.labelHeight / 2 + d, width: a.labelWidth, height: a.labelHeight };
    }, r = A0.flatMap((i) => E0.map((d) => s(d, i))).find((i) => !n.some((d) => Bo(i, d))) ?? s(0.5, 0);
    for (; n.some((i) => Bo(r, i)); ) r.y += He.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: He.line, pad: He.pad } };
  });
}
const Bo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, T0 = { class: "flowchart-tools" }, I0 = ["width", "height", "viewBox", "aria-label"], R0 = ["d"], B0 = ["x", "y", "width", "height"], L0 = ["x", "y"], N0 = ["x", "dy"], D0 = {
  key: 0,
  class: "flowchart-label"
}, q0 = ["x", "y", "width", "height"], P0 = ["x", "y"], j0 = ["x", "dy"], F0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => x0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = C(null), r = C({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function d() {
      var M;
      const S = (M = l.value) == null ? void 0 : M.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const A = Math.min(S.width / s.value.width, S.height / s.value.height, 1.5);
      r.value = { zoom: A, x: (S.width - s.value.width * A) / 2, y: (S.height - s.value.height * A) / 2 };
    }
    function u(S, A, M) {
      const { zoom: q, x: U, y: P } = r.value, L = Math.min(o.most, Math.max(o.least, q * S));
      r.value = { zoom: L, x: A - (A - U) * L / q, y: M - (M - P) * L / q };
    }
    function h(S) {
      const A = l.value.getBoundingClientRect();
      u(S, A.width / 2, A.height / 2);
    }
    function m(S) {
      const A = l.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? u(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - A.left, S.clientY - A.top) : r.value = { ...r.value, x: r.value.x - S.deltaX, y: r.value.y - S.deltaY };
    }
    function y(S) {
      var A, M, q;
      S.preventDefault(), (A = window.getSelection()) == null || A.removeAllRanges(), i = { x: S.clientX - r.value.x, y: S.clientY - r.value.y }, (q = (M = l.value).setPointerCapture) == null || q.call(M, S.pointerId);
    }
    function b(S) {
      i && (r.value = { ...r.value, x: S.clientX - i.x, y: S.clientY - i.y });
    }
    return Ee(d), (S, A) => (c(), F(da, {
      title: e.title,
      large: "",
      onClose: A[4] || (A[4] = (M) => a("close"))
    }, {
      default: D(() => [
        p("div", T0, [
          T(de, {
            small: "",
            onClick: A[0] || (A[0] = (M) => h(o.step))
          }, {
            default: D(() => [...A[5] || (A[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          T(de, {
            small: "",
            onClick: A[1] || (A[1] = (M) => h(1 / o.step))
          }, {
            default: D(() => [...A[6] || (A[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          T(de, {
            small: "",
            onClick: d
          }, {
            default: D(() => [...A[7] || (A[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(m, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: A[2] || (A[2] = (M) => to(i) ? i.value = null : i = null),
          onPointercancel: A[3] || (A[3] = (M) => to(i) ? i.value = null : i = null)
        }, [
          (c(), f("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ve({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            A[8] || (A[8] = p("defs", null, [
              p("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                p("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), f(j, null, te(s.value.arrows, (M, q) => (c(), f("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: M.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, R0))), 128)),
            (c(!0), f(j, null, te(s.value.nodes, (M) => (c(), f("g", {
              key: M.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: M.x,
                y: M.y,
                width: M.width,
                height: M.height,
                rx: "8"
              }, null, 8, B0),
              p("text", {
                x: M.x + M.width / 2,
                y: M.y + M.padY + M.line / 2
              }, [
                (c(!0), f(j, null, te(M.lines, (q, U) => (c(), f("tspan", {
                  key: U,
                  x: M.x + M.width / 2,
                  dy: U ? M.line : 0
                }, v(q), 9, N0))), 128))
              ], 8, L0)
            ]))), 128)),
            (c(!0), f(j, null, te(s.value.arrows, (M, q) => (c(), f(j, {
              key: `label-${q}`
            }, [
              M.label ? (c(), f("g", D0, [
                p("rect", {
                  x: M.label.x,
                  y: M.label.y,
                  width: M.label.width,
                  height: M.label.height,
                  rx: "4"
                }, null, 8, q0),
                p("text", {
                  x: M.label.x + M.label.width / 2,
                  y: M.label.y + M.label.pad + M.label.line / 2
                }, [
                  (c(!0), f(j, null, te(M.label.lines, (U, P) => (c(), f("tspan", {
                    key: P,
                    x: M.label.x + M.label.width / 2,
                    dy: P ? M.label.line : 0
                  }, v(U), 9, j0))), 128))
                ], 8, P0)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, I0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, W0 = /* @__PURE__ */ V(F0, [["__scopeId", "data-v-51d24cfe"]]), Lo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', No = {
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
  agent: Lo,
  worker: Lo,
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
}, H0 = ["innerHTML"], U0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => No[t.name] || No.dot);
    return (a, s) => (c(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, H0));
  }
}, pt = /* @__PURE__ */ V(U0, [["__scopeId", "data-v-beb5935c"]]), z0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      T(pt, { name: "fold" })
    ], 2));
  }
}, St = /* @__PURE__ */ V(z0, [["__scopeId", "data-v-d03899bb"]]), V0 = ["data-tip", "aria-label"], G0 = {
  key: 0,
  class: "mact-word"
}, K0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), f("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      T(pt, { name: "open" }),
      e.open ? (c(), f("span", G0, v(e.label), 1)) : w("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, V0));
  }
}, Lr = /* @__PURE__ */ V(K0, [["__scopeId", "data-v-3b292e09"]]), Nr = 120, jn = 280, Dr = 160, Y0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, J0 = ["leaving", "resizing", "entering"];
function fs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Q0(e) {
  const t = J0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = fs(e);
  return e.classList.add(...t), n;
}
function qr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = C(t()), s = C("");
  let o = 0;
  const l = (h, m) => Object.assign(h.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function i(h, m) {
    r(h);
    const y = Q0(h);
    l(h, m), h.offsetWidth, h.style.transition = `width ${jn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${jn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function d(h) {
    const m = h.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let y = m.offsetHeight;
    const b = new ResizeObserver(() => {
      m.offsetHeight !== y && (y = m.offsetHeight, i(h, fs(h)));
    });
    return b.observe(m), b;
  }
  async function u(h) {
    const m = e.value, y = ++o;
    if (!m || !m.offsetWidth || Y0()) {
      a.value = h;
      return;
    }
    const b = fs(m);
    if (l(m, b), s.value = "leaving", await n(Nr), y !== o) return;
    a.value = h, s.value = "resizing", await Xe(), i(m, b);
    const S = d(m);
    await n(jn), S == null || S.disconnect(), y === o && (r(m), s.value = "entering", await n(Dr), y === o && (s.value = ""));
  }
  return pe(t, (h) => u(h)), Qe(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const X0 = { class: "growing-card-top" }, Z0 = ["aria-expanded"], ey = { class: "growing-card-avatar" }, ty = { class: "growing-card-title" }, ny = { class: "growing-card-more" }, ay = { class: "growing-card-body" }, sy = {
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
    const n = e, a = t, s = C(!1), o = C(null), { folded: l, phase: r } = qr(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = R(() => n.text.split(/\n\s*\n/).filter((u) => u.trim()));
    return (u, h) => (c(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", N(r), { open: !N(l), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", X0, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (m) => s.value = !s.value)
        }, [
          p("span", ey, [
            e.bad ? (c(), F(pt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), f(j, { key: 1 }, [
              ee(v(i.value), 1)
            ], 64)) : (c(), F(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", ty, v(e.title), 1),
          T(St, { open: s.value }, null, 8, ["open"])
        ], 8, Z0),
        e.action ? (c(), F(Lr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : w("", !0),
        e.commentable ? (c(), f("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (m) => a("comment"))
        }, [
          T(ye, {
            name: "bubble",
            size: 13
          })
        ])) : w("", !0)
      ]),
      p("div", ny, [
        p("div", ay, [
          (c(!0), f(j, null, te(d.value, (m, y) => (c(), f("p", {
            key: y,
            class: "growing-card-text"
          }, v(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, oy = /* @__PURE__ */ V(sy, [["__scopeId", "data-v-f2b4930d"]]), ly = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, ry = { class: "md inline" }, iy = ["disabled", "title", "onClick"], cy = {
  key: 1,
  class: "message-links-many"
}, uy = ["aria-expanded"], dy = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, fy = ["disabled", "onClick"], hy = { class: "row-pill message-links-chip" }, my = { class: "message-links-title" }, py = { key: 0 }, Ia = 3, gy = "task", vy = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => n.total || n.links.length), o = R(() => n.links.every((m) => m.endpoint.model === gy) ? "tasks" : "items"), l = C(!1), r = C(null);
    Bl(r, () => l.value = !1);
    const i = () => l.value = !l.value, d = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, u = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(m) {
      d(m) || (l.value = !1, Ne(m.endpoint.open_ref));
    }
    return (m, y) => (c(), f("div", {
      ref_key: "line",
      ref: r,
      class: Y(["message-links", { many: s.value > Ia, three: s.value === Ia, open: l.value }]),
      "data-message-links": ""
    }, [
      T(pt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), f("span", ly, [
        p("span", ry, [
          y[1] || (y[1] = ee("Linked: ", -1)),
          (c(!0), f(j, null, te(e.links, (b) => (c(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: d(b),
            title: b.endpoint.title,
            onClick: (S) => h(b)
          }, [
            ee(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            u(b) ? (c(), f(j, { key: 0 }, [
              ee(" (" + v(u(b)) + ")", 1)
            ], 64)) : w("", !0),
            d(b) ? (c(), f(j, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, iy))), 128))
        ])
      ])) : w("", !0),
      s.value >= Ia ? (c(), f("span", cy, [
        p("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee(v(s.value) + " linked " + v(o.value) + " ", 1),
          T(St, { open: l.value }, null, 8, ["open"])
        ], 8, uy)
      ])) : w("", !0),
      l.value ? (c(), f("div", dy, [
        (c(!0), f(j, null, te(e.links, (b) => (c(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: d(b),
          onClick: (S) => h(b)
        }, [
          p("span", hy, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          p("span", my, v(b.endpoint.title), 1),
          p("span", null, v(u(b)), 1),
          d(b) ? (c(), f("span", py, "Unavailable")) : w("", !0)
        ], 8, fy))), 128))
      ])) : w("", !0),
      T(mn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, yy = /* @__PURE__ */ V(vy, [["__scopeId", "data-v-e9bc783c"]]), by = ["title", "aria-label"], ky = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, wy = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, $y = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), f("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), f("svg", ky, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), f("path", wy)) : w("", !0)
      ]))
    ], 10, by));
  }
}, xy = /* @__PURE__ */ V($y, [["__scopeId", "data-v-6dc92808"]]), Sy = "img,pre,table";
function _y(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function My(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Cy(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Sy)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = _y(My(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Ey(e, t) {
  let n = null;
  const a = () => e.value && Cy(e.value);
  Ee(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const Ay = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Oy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Tn = /* @__PURE__ */ new WeakMap(), Ke = "work", Yt = "sent", Ty = 50, Do = () => ({ rows: C([]), total: C(0), next: C(null), loading: C(!1), failure: C(""), version: 0 });
function Iy(e) {
  var h;
  if (Tn.has(e)) return Tn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var y;
    return ((y = e.visible) == null ? void 0 : y.value) !== !1 && [...m.views].some((b) => b.visible);
  };
  async function o(m, y, b = 1) {
    const S = m[y], A = ++S.version;
    S.loading.value = !0, S.failure.value = "";
    const M = y === Ke ? "--type about --type edited --group-counterparts" : "--type sent_to", q = `link list --source message:${m.id} ${M} --page ${b} --page-size ${y === Ke ? 10 : 25}`;
    try {
      const U = await e.read(q);
      if (t.get(m.id) !== m || S.version !== A) return;
      if (!U.ok) {
        S.failure.value = U.error;
        return;
      }
      const P = y === Ke ? U.value.counterparts ?? [] : U.value.rows ?? [], L = b === 1 ? P : [...S.rows.value, ...P], W = y === Ke ? (O) => `${O.endpoint.model}:${O.endpoint.id}` : (O) => O.id ?? O.target_id;
      S.rows.value = [...new Map(L.map((O) => [W(O), O])).values()], S.total.value = U.value.total ?? S.rows.value.length, S.next.value = U.value.next_page ?? null;
    } catch (U) {
      S.version === A && (S.failure.value = U.message);
    } finally {
      S.version === A && (S.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((y) => t.get(y)).filter((y) => y && s(y));
    n.clear();
    for (const y of m) {
      const b = [...y.dirty];
      y.dirty.clear();
      for (const S of b) o(y, S);
    }
  }
  function r(m, y = [Ke, Yt]) {
    for (const b of y) m.dirty.add(b);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const y = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), b = m.link_types ?? (m.link_type ? [m.link_type] : []), S = b.length ? [Ke, Yt].filter((M) => M === Ke ? b.some((q) => ["about", "edited"].includes(q)) : b.includes("sent_to")) : [Ke, Yt];
    if (!S.length) return;
    const A = y.length ? [...new Set(y.filter((M) => M.model === "message").map((M) => M.id))].map((M) => t.get(M)).filter(Boolean) : [...t.values()].filter(s).slice(0, Ty);
    for (const M of A) r(M, S);
  }
  const d = (h = e.follow) == null ? void 0 : h.call(e, ["link.*"], i), u = {
    attach(m, y) {
      let b = t.get(m);
      return b || (b = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ke, Yt]), work: Do(), sent: Do() }, t.set(m, b)), b.views.add(y), b.dirty.size && r(b, [...b.dirty]), b;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, y) {
      m.views.delete(y), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), d == null || d(), Tn.delete(e));
    },
    more(m, y) {
      const b = m == null ? void 0 : m[y];
      if (b != null && b.next.value && !b.loading.value) return o(m, y, b.next.value);
    }
  };
  return Tn.set(e, u), u;
}
function Ry(e, t, n) {
  const a = Ye(null);
  let s = null;
  const o = pe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Iy(e);
    const d = { visible: typeof IntersectionObserver > "u" }, u = s.attach(l, d);
    a.value = u;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      d.visible = y.some((b) => b.isIntersecting), d.visible && s.shown(u);
    }, { rootMargin: "100px" }), m = pe(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), h == null || h.disconnect(), s.detach(u, d), a.value = null;
    });
  }, { immediate: !0 });
  return ra(o), {
    links: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: R(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: R(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: R(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ke),
    loadSent: () => s == null ? void 0 : s.more(a.value, Yt)
  };
}
const By = ["data-incoming", "data-ref"], Ly = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Ny = { class: "message-body" }, Dy = ["title"], qy = ["innerHTML"], Py = ["title"], jy = ["innerHTML"], Fy = {
  class: "message-faces",
  "data-message-faces": ""
}, Wy = ["title", "data-face", "onClick"], Hy = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Uy = ["title", "data-reaction", "onClick"], zy = {
  key: 0,
  class: "message-reaction-count"
}, Vy = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Gy = ["href", "title"], Ky = ["src", "alt"], Yy = ["href"], Jy = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Qy = ["disabled", "data-sent-worker", "title", "onClick"], Xy = { class: "message-foot" }, Zy = { class: "message-time" }, eb = {
  class: "message-id",
  "data-message-id": ""
}, tb = 140, nb = 2, ab = 1500, sb = "An earlier message", ob = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = C(null), l = R(() => ["user", "comment"].includes(n.message.type)), r = R(() => {
      const [Z, ae] = (n.message.commented_row || ":").split(":"), oe = ht(Z);
      return oe ? { ref: `${oe}:${ae}`, label: `${zt(oe).title.toLowerCase()} ${ae}` } : null;
    }), i = R(() => n.message.worker_id ?? null), d = C(!1), u = R(() => i.value !== null && ((n.message.text ?? "").length > tb || (n.message.text ?? "").split(`
`).filter((Z) => Z.trim()).length > nb)), h = R(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, ab);
    }
    const y = ir(), b = R(() => y(n.message.text ?? "")), S = R(() => JSON.parse(n.message.flowchart_edges || "[]")), A = C(!1), M = R(() => y(n.quote || sb));
    function q() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    Ey(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, L = R(() => JSON.parse(n.message.captions || "{}")), W = R(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: P(Z), isImage: U.test(Z), title: L.value[Z] || Z }))), O = R(() => yr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), I = Te(Pe, null), { links: x, total: k, more: $, loading: g, failure: _, sentTo: E, sentMore: B, sentLoading: H, sentFailure: X, loadMore: se, loadSent: ie } = Ry(I, () => l.value && !n.message.local ? n.message.id : null, o), ge = C(!1), Ae = R(() => Oy(n.message.reactions));
    function fe(Z) {
      ge.value = !1, a("react", n.message, Z);
    }
    return (Z, ae) => e.message.peer || e.message.recipient ? (c(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      T(oy, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ae[0] || (ae[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, By)) : (c(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Ny, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: r.value }]),
          onClick: ae[6] || (ae[6] = (...oe) => N(Bt) && N(Bt)(...oe))
        }, [
          r.value ? (c(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: ae[1] || (ae[1] = $e((oe) => N(Ne)(r.value.ref), ["stop"]))
          }, [
            T(ye, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + v(r.value.label), 1)
          ], 8, Dy)) : w("", !0),
          e.message.parent_id ? (c(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(q, ["stop"]),
            innerHTML: M.value
          }, null, 8, qy)) : w("", !0),
          i.value !== null ? (c(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: ae[2] || (ae[2] = $e((oe) => N(Ne)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + v(i.value), 9, Py)) : w("", !0),
          p("div", {
            class: Y({ "message-folded": u.value && !d.value }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 10, jy),
          u.value ? (c(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ae[3] || (ae[3] = $e((oe) => d.value = !d.value, ["stop"]))
          }, v(d.value ? "Show less" : "Show more"), 1)) : w("", !0),
          S.value.length ? (c(), f(j, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ae[4] || (ae[4] = (oe) => A.value = !0)
            }, "Open the flowchart"),
            A.value ? (c(), F(W0, {
              key: 0,
              title: e.message.text,
              edges: S.value,
              onClose: ae[5] || (ae[5] = (oe) => A.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        p("div", {
          class: Y(["message-tools", { picking: ge.value }]),
          "data-message-tools": ""
        }, [
          ge.value ? (c(), f(j, { key: 0 }, [
            p("div", Fy, [
              (c(!0), f(j, null, te(N(Ay), (oe) => (c(), f("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (et) => fe(oe)
              }, v(oe), 9, Wy))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ae[7] || (ae[7] = (oe) => ge.value = !1)
            }, [
              T(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), f(j, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ae[8] || (ae[8] = (oe) => ge.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ae[9] || (ae[9] = (oe) => a("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, v(s.value ? "Copied" : "Copy"), 1),
            h.value ? (c(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ae[10] || (ae[10] = (oe) => a("delete", e.message))
            }, "Delete")) : w("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (c(), f("div", Hy, [
        (c(!0), f(j, null, te(Ae.value, (oe) => (c(), f("button", {
          key: oe.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (et) => a("react", e.message, oe.emoji)
        }, [
          ee(v(oe.emoji) + " ", 1),
          oe.count > 1 ? (c(), f("span", zy, v(oe.count), 1)) : w("", !0)
        ], 10, Uy))), 128))
      ])) : w("", !0),
      W.value.length ? (c(), f("div", Vy, [
        (c(!0), f(j, null, te(W.value, (oe) => (c(), f(j, {
          key: oe.name
        }, [
          oe.isImage ? (c(), f("a", {
            key: 0,
            href: oe.address,
            target: "_blank",
            class: "message-image",
            title: oe.title
          }, [
            p("img", {
              src: oe.address,
              alt: oe.name,
              "data-figure-picture": ""
            }, null, 8, Ky)
          ], 8, Gy)) : (c(), f("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, v(oe.name), 9, Yy))
        ], 64))), 128))
      ])) : w("", !0),
      N(E).length ? (c(), f("div", Jy, [
        T(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), f(j, null, te(N(E), (oe) => (c(), f("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: $e((et) => oe.open_ref && N(Ne)(oe.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + v(oe.id), 1),
          oe.unavailable ? (c(), f(j, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : w("", !0)
        ], 8, Qy))), 128))
      ])) : w("", !0),
      T(mn, {
        more: N(B),
        loading: N(H),
        failure: N(X),
        label: "More recipients",
        onMore: N(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      p("div", Xy, [
        p("time", Zy, v(O.value), 1),
        Number.isInteger(e.message.id) ? (c(), f(j, { key: 0 }, [
          ae[11] || (ae[11] = p("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          p("span", eb, "message " + v(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (c(), F(xy, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      N(x).length || N(_) ? (c(), F(yy, {
        key: 3,
        links: N(x),
        total: N(k),
        more: N($),
        loading: N(g),
        failure: N(_),
        onMore: N(se)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, Ly));
  }
}, Z8 = /* @__PURE__ */ V(ob, [["__scopeId", "data-v-0be1107c"]]), Qn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ra = 200, Pr = (e) => {
  var t;
  return ((t = Qn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Qn[0].key;
}, e3 = (e) => {
  var t;
  return ((t = Qn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, lb = ["aria-label"], rb = 300, qo = 400, ib = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ra } },
  setup(e) {
    const t = e, n = R(() => Pr(t.value)), a = R(() => n.value < Ra ? [1, 0.25, 0.25] : n.value === Ra ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), f("svg", {
      class: Y(["ico", "prio", { hot: n.value >= qo, high: n.value >= rb && n.value < qo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      p("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ve({ opacity: a.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ve({ opacity: a.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ve({ opacity: a.value[2] })
      }, null, 4)
    ], 10, lb));
  }
}, t3 = /* @__PURE__ */ V(ib, [["__scopeId", "data-v-b10e610f"]]), cb = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Po = (e) => cb[e.card.state] || "idle", ub = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), jo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Fo = (e, t) => jo[Po(e)] - jo[Po(t)], Wo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, n3 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Fo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || ub(a, s)) : [...e].sort((a, s) => Fo(a, s) || (Wo[t] || Wo.state)(a, s)), db = { class: "list-row" }, fb = {
  key: 0,
  class: "list-row-type"
}, hb = { class: "list-row-main" }, mb = {
  key: 0,
  class: "list-row-title"
}, pb = { class: "list-row-body" }, gb = {
  key: 1,
  class: "list-row-end"
}, vb = {
  key: 1,
  class: "list-row-text"
}, yb = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), f("div", db, [
      e.type ? (c(), f("span", fb, v(e.type), 1)) : w("", !0),
      p("div", hb, [
        e.title ? (c(), f("span", mb, v(e.title), 1)) : w("", !0),
        p("div", pb, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), f("div", gb, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      e.text ? (c(), f("span", vb, v(e.text), 1)) : w("", !0)
    ]));
  }
}, a3 = /* @__PURE__ */ V(yb, [["__scopeId", "data-v-dfc8c3a7"]]), s3 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), F(Sr, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, bb = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), f("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, jr = /* @__PURE__ */ V(bb, [["__scopeId", "data-v-978e0921"]]), kb = ["aria-label"], wb = { class: "head" }, $b = { class: "names" }, xb = { class: "body" }, Sb = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ul(a, n), r = zl(s);
    return (i, d) => (c(), F(la, { to: "body" }, [
      T(Ht, {
        name: "side",
        appear: "",
        onAfterLeave: N(l)
      }, {
        default: D(() => [
          N(s) ? (c(), f("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: N(r) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = $e((...u) => N(o) && N(o)(...u), ["self"]))
          }, [
            p("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), f(j, { key: 0 }, [
                p("header", wb, [
                  p("div", $b, [
                    p("h2", null, v(e.title), 1),
                    e.abstract ? (c(), F(at, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0)
                  ]),
                  me(i.$slots, "actions", {}, void 0, !0),
                  T(ua, {
                    title: e.closeLabel,
                    onClick: N(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), F(jr, { key: 0 }, {
                  default: D(() => [
                    me(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                p("div", xb, [
                  me(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, kb)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, o3 = /* @__PURE__ */ V(Sb, [["__scopeId", "data-v-f276f055"]]), _b = {
  key: 1,
  class: "text-field-label"
}, Mb = {
  key: 2,
  class: "text-field-end"
}, Cb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Dt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var u;
    const n = an(e, "modelValue"), a = oa(), s = "onUpdate:modelValue" in (((u = Wi()) == null ? void 0 : u.vnode.props) || {}), o = R(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), r = R(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), d = C(null);
    return t({ focus: () => d.value && d.value.focus() }), (h, m) => e.label || e.icon || h.$slots.end ? (c(), f("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, N(a).class]),
      style: ve(N(a).style)
    }, [
      e.icon ? (c(), F(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (c(), f("span", _b, v(e.label), 1)) : w("", !0),
      qe(p("input", De({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [N(ls), o.value]
      ]),
      h.$slots.end ? (c(), f("span", Mb, [
        me(h.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
    ], 6)) : qe((c(), f("input", De({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [N(ls), o.value]
    ]);
  }
}), l3 = /* @__PURE__ */ V(Cb, [["__scopeId", "data-v-d9c38ca8"]]), Eb = { class: "title" }, Ab = { class: "state" }, Ob = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = es(t.line, t.events);
    return (o, l) => (c(), F(i0, {
      rows: N(n),
      failure: N(a),
      loaded: N(s),
      empty: e.empty
    }, {
      default: D(({ row: r }) => [
        p("span", Eb, v(r.title), 1),
        p("span", Ab, v(N(ca)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, r3 = /* @__PURE__ */ V(Ob, [["__scopeId", "data-v-9191a6f0"]]);
function Tb(e = 1e3, t = null) {
  const n = C(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const Ba = C(Date.now() / 1e3);
let Ho = 0, In = 0;
function Fr() {
  return In || (Ba.value = Date.now() / 1e3, Ho = setInterval(() => Ba.value = Date.now() / 1e3, 1e3)), In += 1, kl() && ra(() => {
    In -= 1, In || clearInterval(Ho);
  }), Ba;
}
const Ib = 200, Rb = Nr + jn + Dr + Ib;
function Gt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Bb(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Gt(e),
    top: Gt(e.querySelector(".top")),
    title: Gt(e.querySelector(".title")),
    contents: Gt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, d;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((d = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : d.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: d, display: u }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: d, display: u }))(getComputedStyle(e)),
    parent: Gt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Lb(e, t, n, a) {
  pe(t, (s) => {
    var d;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((d = a.markMotion) != null && d.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Bb(o, l, n.value)), performance.now() - l < Rb) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Nb = ["title", "data-figure-mark", "data-folded", "data-open"], Db = {
  key: 2,
  class: "worker"
}, qb = { class: "head" }, Pb = { key: 0 }, jb = {
  key: 3,
  class: "status"
}, Fb = {
  key: 0,
  class: "figure"
}, Wb = {
  key: 1,
  class: "ran-for"
}, Hb = { key: 2 }, Ub = {
  key: 3,
  class: "news"
}, zb = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Vb = {
  key: 6,
  class: "settled"
}, Gb = {
  key: 1,
  class: "bar"
}, Kb = {
  key: 3,
  class: "detail body"
}, Yb = {
  key: 0,
  class: "body-label"
}, Jb = ["title"], Qb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = oa(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = C(!1), l = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = R(() => t.open !== void 0), i = R(() => r.value || l.value), d = R(() => r.value ? t.open : o.value), u = R(() => r.value ? !t.open : l.value && !o.value), h = R(() => !!(t.mark.action && n.onAct)), m = R(() => i.value || h.value || !!n.onClick), y = C(null), b = C(null), { folded: S, phase: A } = qr(y, () => u.value);
    Lb(y, u, A, Te(Pe, null));
    function M(ie) {
      var ge, Ae;
      if (!(ie.target !== y.value && !b.value.contains(ie.target))) {
        if (r.value) return (ge = n.onClick) == null ? void 0 : ge.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const q = (ie) => n.onAct(ie), U = ["failed", "unfinished"], P = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), L = R(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), W = R(() => L.value || "var(--tone-work)"), O = R(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), I = Fr(), x = R(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? br(I.value - t.mark.began_at) : ""
    ), k = R(() => {
      const { started: ie, ended: ge } = t.mark;
      return ie ? ge ? `ran ${Ao(ge - ie, !0)}` : Ao(I.value - ie, !0) : x.value;
    }), $ = ["bad", "danger", "warn"], g = R(() => $.includes(P.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], E = R(() => _.includes(P.value)), B = R(() => g.value === "process" ? "running" : E.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), H = R(
      () => !!(t.mark.figure || k.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), X = R(() => [t.mark.title, t.mark.time ? yr(t.mark.time) : ""].filter(Boolean).join(" · ")), se = R(() => ({
      ...L.value ? { "--mark": L.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ge) => (c(), f("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        N(A),
        {
          open: d.value,
          folding: r.value && u.value,
          live: m.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: L.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: se.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": N(S) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: M
    }), [
      (c(), F(gt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!d.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (c(), F(pt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), F(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), f("span", Db, v(e.mark.worker), 1)) : w("", !0),
          p("span", qb, [
            T(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), f("strong", Pb, v(e.mark.name), 1)) : w("", !0),
            i.value ? (c(), F(St, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          H.value ? (c(), f("span", jb, [
            e.mark.figure ? (c(), f("span", Fb, v(e.mark.figure), 1)) : w("", !0),
            k.value ? (c(), f("span", Wb, v(k.value), 1)) : w("", !0),
            e.mark.stopping ? (c(), f("span", Hb, "Stopping")) : w("", !0),
            e.mark.news ? (c(), f("span", Ub, v(e.mark.news), 1)) : w("", !0),
            B.value === "running" ? (c(), f("span", zb)) : B.value ? (c(), F(pt, {
              key: 5,
              class: Y(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (c(), f("span", Vb, v(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (c(), F(Lr, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: $e(q, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (c(), f("span", Gb, [
        p("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: W.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !N(S) ? (c(), F(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !N(S) ? (c(), f("div", Kb, [
        e.mark.bodyLabel ? (c(), f("p", Yb, v(e.mark.bodyLabel), 1)) : w("", !0),
        T(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !N(S) ? (c(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Jb)) : w("", !0),
      e.mark.card ? (c(), F(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      me(ie.$slots, "default", {
        shown: !N(S)
      }, void 0, !0)
    ], 16, Nb));
  }
}), Wr = /* @__PURE__ */ V(Qb, [["__scopeId", "data-v-2aa9c496"]]), Xb = 60, Hr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Zb(e, t) {
  const n = C([]), a = C(0);
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
    if (l || a.value <= 0 || u.scrollTop > Xb) return;
    l = !0;
    const h = u.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await Xe(), u.scrollTop += u.scrollHeight - h);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: d };
}
const ek = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Ur(e) {
  var n;
  const t = ek[e] || ((n = zt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const tk = (e) => Ur(String(e).split(":")[0]), nk = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), ak = { passed: "good", failed: "danger", warned: "warn", running: "" }, sk = { good: "good", warn: "warn", danger: "danger" }, Uo = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => $f(e.target_model, e.target_id || 0)
}, ok = { "open row": (e) => tk(e.target_model), "open page": () => Ur("pages") };
function lk(e, t) {
  const n = t || {}, a = Uo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? ak[e.outcome] || "" : sk[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? ok[a](e) : "",
    handlers: a ? { onAct: () => Uo[a](e) } : {}
  };
}
const rk = 24, ik = 1e3, zo = 2e3, ck = 0.25, uk = 5e3;
function dk(e, t = rk, n = () => !0) {
  const a = C(!1), s = C(0), o = C(!1);
  let l = 0, r = 0, i = 0;
  const d = () => e && "value" in e ? e.value : e, u = () => {
    const P = d();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, h = () => !d() || u() <= t;
  function m(P) {
    if (clearTimeout(l), !P) {
      o.value = !1, i = Date.now();
      return;
    }
    const L = Date.now() - i < zo ? zo : ik;
    l = setTimeout(() => o.value = a.value, L);
  }
  function y() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function b(P = !1) {
    const L = d();
    L && P && L.scrollTo ? L.scrollTo({ top: L.scrollHeight, behavior: "smooth" }) : L && (L.scrollTop = L.scrollHeight), y();
  }
  function S() {
    M(), !a.value && (a.value = !0, m(!0));
  }
  const A = () => !!d() && u() <= d().clientHeight * ck;
  function M() {
    clearTimeout(r), A() && (r = setTimeout(() => a.value && A() && n() && b(!0), uk));
  }
  function q() {
    h() ? y() : S();
  }
  function U(P = 1, L = !1) {
    a.value ? s.value += Math.max(0, P) : b(L);
  }
  return kl() && ra(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: u, atBottom: h, follow: y, toBottom: b, left: S, scrolled: q, arrived: U };
}
const fk = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, hk = (e) => String(e ?? "").replace(fk, ""), mk = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), { away: o, scrolled: l, arrived: r, toBottom: i } = dk(s);
    pe(
      () => n.lines.length,
      () => Xe(() => r()),
      { immediate: !0 }
    );
    function d(u) {
      l(), a("older", u.target);
    }
    return (u, h) => (c(), f("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: d
    }, [
      ee(v(N(hk)(e.lines.join(`
`)) || e.empty), 1),
      N(o) ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (m) => N(i)(!0))
      }, "Follow")) : w("", !0)
    ], 544));
  }
}, pk = /* @__PURE__ */ V(mk, [["__scopeId", "data-v-c2fb1783"]]), gk = "*.*", vk = {
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
    const t = e, n = Te(Pe, null), a = new Tl();
    pe(
      () => a.patterns,
      (i, d, u) => {
        var m;
        const h = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (y) => a.dispatch(y));
        u(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = R(() => !!(t.declaration.shipped || t.declaration.trusted)), r = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [gk] : t.declaration.events ?? [],
      options: []
    }));
    return (i, d) => l.value ? (c(), F(Tr, {
      key: 0,
      entry: r.value,
      subscriptions: N(a),
      environment: N(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), F(Or, {
      key: 1,
      entry: r.value,
      subscriptions: N(a),
      environment: N(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, yk = { class: "mark-more-inner" }, bk = {
  class: "mark-lines",
  "data-mark-reason": ""
}, kk = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, wk = {
  key: 3,
  class: "mark-lines"
}, $k = "process", Vo = "task", xk = {
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
    const t = e, n = Ue(), a = R(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = R(() => nk.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === Vo ? t.mark.target_id : 0), l = Zb(
      Hr(n),
      () => t.mark.target_id
    ), r = l.lines, i = C(!1), d = C(""), u = R(() => !t.declaration.body_url && t.mark.target_model === $k && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      i.value = !0, d.value = b.ok ? "" : b.error;
    }
    const m = R(() => t.shown && u.value);
    return pe(m, (y) => y && h()), _s(() => m.value && h(), () => m.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && m.value && h(l.newest)
    ), (y, b) => (c(), f("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
      }, ["stop"]))
    }, [
      p("div", yk, [
        e.declaration.body_url ? (c(), F(vk, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), f(j, { key: 1 }, [
          s.value ? (c(), f(j, { key: 0 }, [
            b[2] || (b[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", bk, v(s.value), 1)
          ], 64)) : w("", !0),
          u.value && d.value ? (c(), f("p", kk, v(d.value), 1)) : u.value && i.value ? (c(), f(j, { key: 2 }, [
            b[3] || (b[3] = p("p", { class: "mark-label" }, "Output", -1)),
            T(pk, {
              class: "mark-terminal",
              lines: N(r),
              onOlder: N(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), f("p", wk, v(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (c(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((S) => N(Ne)(`${Vo}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, hs = /* @__PURE__ */ V(xk, [["__scopeId", "data-v-2f996108"]]), Sk = ["title", "aria-label", "onClick"], _k = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Mk = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => Gd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = C(""), s = Te(Pe);
    async function o(l) {
      const r = await pn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), f(j, null, [
      (c(!0), f(j, null, te(n.value, (i) => (c(), f("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: $e((d) => o(i), ["stop"])
      }, [
        T(pt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Sk))), 128)),
      a.value ? (c(), f("span", _k, v(a.value), 1)) : w("", !0)
    ], 64));
  }
}, Ck = /* @__PURE__ */ V(Mk, [["__scopeId", "data-v-7a62c88e"]]);
function zr(e, t) {
  const n = Ye(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await _e.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Vr = zr("/api/marks", "marks"), i3 = Vr.fetchAll, Ek = Vr.find, Ak = ["data-ref"], Ok = ["data-ref"], Tk = { class: "mark-row" }, Ik = "dock add", Rk = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => Ek(a.mark.type)), o = R(() => lk(a.mark, s.value)), l = R(() => {
      var u;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (u = s.value) != null && u.body_url);
    }), r = C(!1);
    function i(u) {
      if (o.value.handlers.onAct && !u.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const d = R(() => {
      var u;
      return (((u = s.value) == null ? void 0 : u.buttons) || []).filter((h) => {
        var m;
        return !a.docked || !((m = h.runs) != null && m.startsWith(Ik));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (u, h) => {
      var m, y;
      return (m = s.value) != null && m.card ? (c(), f("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": N(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        T(hs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Ak)) : (c(), f("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": N(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", Tk, [
          T(Wr, De({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Hi(o.value.handlers), { onClick: i }), Ui({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: b }) => [
                T(hs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          T(Ck, {
            buttons: d.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ok));
    };
  }
}, Bk = /* @__PURE__ */ V(Rk, [["__scopeId", "data-v-afd7d6b1"]]), Lk = ["data-ref"], Nk = ["inert"], Dk = { class: "group-fold" }, qk = { class: "thread-group" }, Pk = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = C(!1), a = C(!1), s = C(!1), o = C(null);
    pe(n, async (r) => {
      var i;
      a.value = !0, await Xe(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = R(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (c(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      T(Wr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (d) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Y(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", Dk, [
          p("div", qk, [
            (c(!0), f(j, null, te(e.group.marks, (d) => (c(), F(Bk, {
              key: d.id,
              mark: d
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Nk)) : w("", !0)
    ], 8, Lk));
  }
}, c3 = /* @__PURE__ */ V(Pk, [["__scopeId", "data-v-45b58b9b"]]);
function jk(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ee(() => n.observe(e.value)), Qe(() => n.disconnect()), t;
}
const Fk = { class: "chat-dock-fold" }, Wk = ["aria-label"], Hk = { class: "chat-dock-head" }, Uk = { class: "chat-dock-inner" }, zk = { class: "chat-dock-foot" }, Gr = 700, Vk = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = C(null), a = C(null), s = jk(a), o = C(!1);
    let l = 0;
    return Ee(() => l = setTimeout(() => o.value = !0, Gr)), Qe(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), f("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      p("div", Fk, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(r.$slots, "edge", {}, void 0, !0),
          p("header", Hk, [
            me(r.$slots, "head", {}, void 0, !0)
          ]),
          p("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            p("div", Uk, [
              p("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ve(N(s) === null ? null : { height: `${N(s)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  me(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          me(r.$slots, "still", {}, void 0, !0),
          p("footer", zk, [
            me(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Wk)
      ])
    ], 2));
  }
}, Kr = /* @__PURE__ */ V(Vk, [["__scopeId", "data-v-74d44b19"]]), Gk = {
  class: "dock-leave",
  "aria-hidden": "true"
}, La = 5, Kk = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(La, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${La}s`, animationDelay: `${(n - La).toFixed(2)}s` };
    return (s, o) => (c(), f("span", Gk, [
      p("i", { style: a })
    ]));
  }
}, Yr = /* @__PURE__ */ V(Kk, [["__scopeId", "data-v-2a7bc150"]]), Yk = { reviewing: "Under review" }, Jk = (e, t) => e || Yk[t == null ? void 0 : t.state] || "", Rn = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Qk = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Rn],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Rn],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Rn],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Rn],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Xk = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Zk(e, t) {
  const n = { task: Qk }[e], a = t != null && t.state ? sd(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Ts(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const ew = (e, t) => e === "doc" || e === "report" ? Xk(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : Zk(e, t), Jr = zr("/api/docks", "docks"), u3 = Jr.fetchAll, Jt = Jr.find, tw = 6, nw = 3, Na = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ha = (e) => Date.parse(e.leaves_at) / 1e3, $t = (e) => !!(e.leaves_at && !e.kept), aw = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!$t(e) || t < ha(e) || n.has(e.id)), sw = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => aw(a, t, n)).sort((a, s) => a.id - s.id);
function ow(e, t, n = tw) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ha(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const lw = (e, t, n = e) => n < 2 ? !1 : e >= nw ? !0 : t, rw = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ms = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), iw = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), cw = (e) => ({ ...e.kept ? ms("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ms("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), uw = ["keep", "unkeep", "open", "undock"], dw = (e) => ({ ...e, iconOnly: uw.includes(e.action) });
function fw(e, t) {
  var n;
  return [
    ...iw(e, t) ? [cw(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || zt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    ms("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(dw);
}
function hw(e, t) {
  const n = fw(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: rw(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const mw = { class: "dock-text" }, pw = ["title"], gw = {
  class: "dock-facts",
  "data-dock-facts": ""
}, vw = { "data-dock-row": "" }, yw = {
  key: 1,
  class: "dock-kept"
}, bw = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, kw = { class: "dock-facts" }, ww = { "data-dock-row": "" }, $w = {
  key: 1,
  class: "dock-kept"
}, xw = { class: "dock-acts" }, Sw = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => Jt(a.item.type)), o = Fr(), l = R(() => qs(a.item.created_at, o.value * 1e3)), r = C(null), i = C(null), d = C(null), u = C(null), h = R(() => hw(a.item, s.value)), m = Ue(), y = R(() => `dock.${a.item.id}`), b = R(() => m.props[y.value].data.value), S = R(() => Kn(a.item.target_model ?? "")), A = R(() => {
      var k;
      return (((k = s.value) == null ? void 0 : k.word) || S.value.replaceAll("-", " ")).replace(/^./, ($) => $.toUpperCase());
    }), M = R(() => ({ ...b.value, id: a.item.target_id, noun: S.value })), q = () => {
      var k, $;
      return (($ = (k = s.value) == null ? void 0 : k.reads) == null ? void 0 : $.length) && m.reload(y.value);
    };
    hu(yl, { data: b, reload: q, readOutput: Hr(m) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (k, $, g) => {
        var E;
        q();
        const _ = (E = m.subscriptions) == null ? void 0 : E.follow(`dock ${a.item.id}`, [`${S.value.replaceAll("-", "_")}.*`], (B) => {
          (!B.row_id || B.row_id === a.item.target_id) && q();
        });
        g(() => _ == null ? void 0 : _());
      },
      { immediate: !0 }
    );
    const U = C(/* @__PURE__ */ new Set()), P = C("");
    async function L(k) {
      if (k.action === "undock") return n("undock", k);
      if (k.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      k.action === "declared" && (U.value = /* @__PURE__ */ new Set([...U.value, k.label])), P.value = "";
      const g = await pn(k, { id: a.item.target_id }, m.environment);
      (g == null ? void 0 : g.ok) === !1 && (U.value = new Set([...U.value].filter((_) => _ !== k.label)), P.value = `Could not ${k.label.toLowerCase()}: ${g.error}`);
    }
    const W = R(() => h.value.actions.filter((k) => !U.value.has(k.label))), O = R(() => {
      var k;
      return Jk((k = s.value) == null ? void 0 : k.badge, M.value);
    }), I = R(() => h.value.controls.filter((k) => !(a.collapsed && ["keep", "unkeep"].includes(k.action)))), x = R(() => {
      var k;
      return !!((k = s.value) != null && k.draws_head) && !a.collapsed;
    });
    return (k, $) => {
      var g, _, E, B;
      return c(), F(Kr, {
        label: h.value.title + ((g = s.value) != null && g.needs_user ? ", waiting for you" : ""),
        type: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((E = s.value) != null && E.folds) && e.folded,
        body: !!((B = s.value) != null && B.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[3] || ($[3] = (H) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), F(Yr, {
            key: 0,
            "ends-at": N(ha)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: D(() => {
          var H;
          return [
            x.value ? (c(), f("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), f(j, { key: 1 }, [
              T(ye, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              p("span", mw, [
                p("span", {
                  class: "dock-title",
                  title: h.value.title
                }, v(h.value.title), 9, pw),
                p("span", gw, [
                  O.value ? (c(), f("span", {
                    key: 0,
                    class: Y(["dock-badge", e.item.type.split(".")[1]]),
                    "data-dock-badge": ""
                  }, v(O.value), 3)) : w("", !0),
                  p("span", vw, v(A.value) + " " + v(e.item.target_id), 1),
                  e.item.kept ? (c(), f("span", yw, "Kept")) : w("", !0)
                ])
              ])
            ], 64)),
            I.value.length ? (c(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = $e(() => {
              }, ["stop"]))
            }, [
              (c(!0), f(j, null, te(I.value, (X) => {
                var se, ie;
                return c(), f(j, {
                  key: X.action + X.runs
                }, [
                  !U.value.has(X.label) && (!((se = X.variants) != null && se.length) || !((ie = M.value) != null && ie.state) || X.variants.includes(M.value.state)) ? (c(), F(de, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: X.pressed }),
                    "aria-pressed": X.pressed,
                    "aria-label": X.label,
                    title: X.label,
                    "data-dock-action": X.action,
                    onClick: (ge) => L(X)
                  }, {
                    default: D(() => [
                      T(ye, {
                        name: X.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : w("", !0)
                ], 64);
              }), 128))
            ])) : w("", !0),
            p("span", {
              ref_key: "time",
              ref: u,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (H = s.value) != null && H.leaves_after_seconds ? w("", !0) : (c(), f(j, { key: 0 }, [
                ee(v(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: D(() => [
          P.value || e.refusal ? (c(), f("p", bw, v(P.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: D(() => {
          var H;
          return [
            p("span", kw, [
              x.value ? (c(), f(j, { key: 0 }, [
                O.value ? (c(), f("span", {
                  key: 0,
                  class: Y(["dock-badge", e.item.type.split(".")[1]]),
                  "data-dock-badge": ""
                }, v(O.value), 3)) : w("", !0),
                p("span", ww, v(A.value) + " " + v(e.item.target_id), 1),
                e.item.kept ? (c(), f("span", $w, "Kept")) : w("", !0)
              ], 64)) : w("", !0),
              p("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (H = s.value) != null && H.folds ? (c(), F(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[1] || ($[1] = (X) => n("fold"))
            }, {
              default: D(() => [
                ee(v(s.value.folds) + " ", 1),
                T(St, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            p("span", xw, [
              p("span", {
                ref_key: "actions",
                ref: d,
                class: "dock-module-actions"
              }, null, 512),
              T(Jl, {
                name: `dock.${e.item.type}`,
                row: M.value,
                environment: N(m).environment,
                "read-only": N(m).readOnly,
                "object-name": N(Kn)(e.item.target_model),
                "external-failure": "",
                onFailure: $[2] || ($[2] = (X) => P.value = X),
                onDone: k.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), f(j, null, te(W.value, (X) => (c(), F(de, {
                key: X.action + X.runs,
                small: "",
                variant: X.primary ? "primary" : "ghost",
                bordered: !X.primary,
                "data-dock-action": X.action,
                onClick: (se) => L(X)
              }, {
                default: D(() => [
                  ee(v(X.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: D(() => {
          var H;
          return [
            (H = s.value) != null && H.body_url ? (c(), F(hs, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: d.value,
              time: u.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : w("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Go = /* @__PURE__ */ V(Sw, [["__scopeId", "data-v-973f5d66"]]), _w = ["title", "aria-label"], Mw = { class: "run-chip-in" }, Cw = {
  key: 0,
  class: "run-chip-ring"
}, Ew = { class: "run-chip-name" }, Aw = { class: "run-chip-bar" }, Ow = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ue(), o = R(() => `run.${a.item.target_id}`), l = R(() => s.props[o.value].data.value), r = R(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = R(() => {
      var m, y;
      return ((m = l.value) == null ? void 0 : m.title) || ((y = l.value) == null ? void 0 : y.line) || a.item.title || "";
    }), d = R(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), u = () => s.reload(o.value);
    let h = null;
    return Ee(() => {
      var m;
      u(), h = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (y) => {
        (!y.row_id || y.row_id === a.item.target_id) && u();
      });
    }), Qe(() => h == null ? void 0 : h()), (m, y) => {
      var b;
      return c(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ve({ "--tone": d.value })
      }, [
        N($t)(e.item) ? (c(), F(Yr, {
          key: 0,
          "ends-at": N(ha)(e.item)
        }, null, 8, ["ends-at"])) : w("", !0),
        p("span", Mw, [
          r.value ? (c(), f("span", Cw)) : (c(), F(pt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", Ew, v(i.value), 1)
        ]),
        p("span", Aw, [
          p("i", {
            style: ve({ width: r.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: d.value })
          }, null, 4)
        ])
      ], 12, _w);
    };
  }
}, Tw = /* @__PURE__ */ V(Ow, [["__scopeId", "data-v-226ac6c8"]]), Iw = 24, Rw = 8, d3 = 420;
function f3({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Iw ? !0 : e < t && s > Rw ? !1 : null;
}
const Bw = (e, t) => e === void 0 ? t : e, Lw = { me: 1, people: [] }, Xn = Wt({
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
  people: Lw,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: zn("journal.activity", !0),
  wide: !1,
  sideMini: zn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Zl("journal.activity", () => Xn.activity);
Zl("journal.side.mini", () => Xn.sideMini);
const Qr = "journal.viewer.";
function Nw(e, t, n) {
  try {
    const a = n.getItem(Qr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Dw(e, t, n) {
  try {
    n.setItem(Qr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Ko(e, t, n = window.localStorage) {
  const a = C(Nw(e, t, n));
  return pe(a, (s) => Dw(e, s, n), { deep: !0 }), a;
}
const qw = {
  key: "dock-all",
  class: "dock-all"
}, Pw = {
  key: "runs-head",
  class: "dock-runs-head"
}, jw = { class: "dock-runs-title" }, Fw = { class: "dock-runs-chips" }, Ww = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = Tb(500), a = C(/* @__PURE__ */ new Set()), s = C(!1), o = C(!1), l = Te(Pe), r = C(/* @__PURE__ */ new Set()), i = C({});
    async function d(_, E) {
      i.value = { ...i.value, [_.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, _.id]);
      const B = await pn(E, { id: _.target_id }, l.environment);
      (B == null ? void 0 : B.ok) === !1 && (r.value = new Set([...r.value].filter((H) => H !== _.id)), i.value = { ...i.value, [_.id]: `Could not dismiss this card: ${B.error}` });
    }
    const u = R(
      () => sw(
        t.items.filter((_) => !r.value.has(_.id)),
        n.value,
        a.value
      )
    ), h = R(
      () => ow(
        u.value.filter((_) => Na(_, Jt)),
        n.value
      )
    ), m = R(() => u.value.filter((_) => !h.value.includes(_) && !Na(_, Jt))), y = R(() => h.value.filter((_) => !$t(_))), b = Ko(`dock-size:${(($ = Xn.identity) == null ? void 0 : $.root) || location.host}`, null), S = (_) => b.value ? b.value.collapsed && !b.value.opened.includes(_.id) : t.collapsed, A = R(() => u.value.some(S)), M = R(() => (s.value = lw(h.value.length, s.value, y.value.length)) && !o.value && !u.value.some(S));
    function q() {
      b.value = { collapsed: !A.value, opened: [] };
    }
    function U(_) {
      var B;
      if (!S(_)) return;
      const E = (B = b.value) != null && B.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...E, _.id] };
    }
    const P = Ko(`dock-folded:${((g = Xn.identity) == null ? void 0 : g.root) || location.host}`, {}), L = (_) => {
      var E;
      return !!((E = Jt(_.type)) != null && E.folds) && Bw(P.value[_.id], Na(_, Jt) || t.folded);
    };
    function W(_) {
      P.value = { ...P.value, [_.id]: !L(_) };
    }
    function O(_) {
      P.value = { ...P.value, ...Object.fromEntries(h.value.map((E) => [E.id, E.id !== _.id])) }, o.value = !0;
    }
    function I() {
      P.value = Object.fromEntries(Object.entries(P.value).filter(([_]) => !h.value.some((E) => String(E.id) === _))), o.value = !1;
    }
    function x(_) {
      a.value = /* @__PURE__ */ new Set([...a.value, _.id]);
    }
    function k(_) {
      a.value = new Set([...a.value].filter((E) => E !== _.id));
    }
    return (_, E) => (c(), F(bl, {
      tag: "div",
      name: "dock",
      duration: N(Gr),
      class: "dock-stack"
    }, {
      default: D(() => [
        u.value.length > 1 ? (c(), f("div", qw, [
          T(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": A.value ? "Open all" : "Collapse all",
            onClick: q
          }, {
            default: D(() => [
              T(St, {
                open: !A.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : w("", !0),
        (c(!0), f(j, null, te(m.value, (B) => (c(), F(Go, {
          key: B.id,
          item: B,
          class: Y({ timed: N($t)(B) }),
          leaving: N($t)(B) && !a.value.has(B.id),
          folded: L(B),
          collapsed: S(B),
          refusal: i.value[B.id],
          onOpen: (H) => U(B),
          onFold: (H) => W(B),
          onUndock: (H) => d(B, H),
          onMouseenter: (H) => x(B),
          onMouseleave: (H) => k(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !A.value ? (c(), f("div", Pw, [
          p("span", null, v(h.value.length) + " runs", 1),
          T(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: I
          }, {
            default: D(() => [
              E[1] || (E[1] = ee(" Runs ", -1)),
              T(St, { open: "" })
            ]),
            _: 1
          })
        ])) : w("", !0),
        (c(!0), f(j, null, te(M.value ? [] : h.value, (B) => (c(), F(Go, {
          key: B.id,
          item: B,
          class: Y({ timed: N($t)(B) }),
          leaving: N($t)(B) && !a.value.has(B.id),
          folded: L(B),
          collapsed: S(B),
          refusal: i.value[B.id],
          onOpen: (H) => U(B),
          onFold: (H) => W(B),
          onUndock: (H) => d(B, H),
          onMouseenter: (H) => x(B),
          onMouseleave: (H) => k(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        M.value ? (c(), F(Kr, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            T(ye, {
              name: "runs",
              size: 14
            }),
            p("span", jw, v(h.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            p("span", Fw, [
              (c(!0), f(j, null, te(h.value, (B) => (c(), F(Tw, {
                key: B.id,
                item: B,
                onClick: (H) => O(B)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            T(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: E[0] || (E[0] = (B) => o.value = !0)
            }, {
              default: D(() => [
                E[2] || (E[2] = ee(" Runs ", -1)),
                T(St)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : w("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, h3 = /* @__PURE__ */ V(Ww, [["__scopeId", "data-v-990baf5f"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Fn = (e) => Math.min(Math.max(e, 0), 1), Hw = (e) => {
  const t = Fn(e);
  return t * t * (3 - 2 * t);
}, yt = (e, t, n) => Hw((e - t) / (n - t));
function m3(e) {
  const t = Fn(e), n = Fn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = yt(s, 0.26, 0.38) * (1 - yt(s, 0.76, 0.96)), l = yt(s, 0.38, 0.76), r = yt(t, 0, 0.12) * (1 - yt(t, 0.88, 1)), i = yt(s, 0.2, 0.34) * (1 - yt(s, 0.84, 1)), d = Math.sin(Math.PI * Fn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: d, shuffle: a, phase: s };
}
function p3(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Yo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, g3 = (e) => Yo[e] ?? Yo.butler, Fs = 2400, Uw = 0.05;
function zw({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, Uw), l = Math.min(t + Fs * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function v3(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Vw(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function y3(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const b3 = (e, t) => ({ ...e, stretch: t.stretch }), k3 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Xr = (e, t) => t >= (e.least ?? 0);
function w3(e, t, n) {
  if (!Xr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const $3 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Gw = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Jo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Kw = (e) => e.right > e.left && e.bottom > e.top;
function x3(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Gw)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Jo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Jo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Kw(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Zr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [u, h, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[u] - e[u];
      if (Math.abs(y) < 1e-9)
        (e[u] < o[h] || e[u] > o[m]) && (r = -1);
      else {
        const b = (o[h] - e[u]) / y, S = (o[m] - e[u]) / y;
        l = Math.max(l, Math.min(b, S)), r = Math.min(r, Math.max(b, S));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, d = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: d, on: "surface", surface: s.id, dx: i - s.left, dy: d - s.top };
  }
  return a;
}
const Ce = {
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
}, rn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Yw = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => Yw(rn(e, t, n)), Jw = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Bn = ([e, t], n) => e + n() * (t - e);
function Qw(e) {
  return Jw.map(() => {
    const t = Bn(ft.speed, e), n = Bn(ft.angle, e) * Math.PI / 180, a = Bn(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Bn(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Xw = Qw(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Zw(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function S3(e, t, n = Xw) {
  const a = Ce.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Zw(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), d = a.from.map((u, h) => u + o.velocity[h] * i);
  return d[2] -= ft.gravity * i * i / 2, { at: d, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const _3 = (e, t) => e && Ce[e.name] ? { name: e.name, u: t / e.frames } : null;
function M3(e, t) {
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
const C3 = () => Array.from({ length: Ce.pogo.count }, (e, t) => Ce.pogo.bounce * (t + 1) / Ce.pogo.count), Nt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function E3(e, t, n) {
  const { away: a, side: s } = Ce.bug_smash, o = s * a * n, [l, r] = [t.left + Nt.margin * n, t.right - Nt.margin * n], i = Math.min(Math.max(e + o + s * Nt.reach * n, l), r), d = i - o - e, u = i - (s * d > 0 ? d / 2 : 0);
  return { figure: [e - t.left, u - o - t.left], bug: [i - t.left, u - t.left] };
}
function A3(e, t, n) {
  const a = Ce.bug_smash, s = Oe(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Nt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Nt.tall * n * (1 - Oe(t, a.emerge)),
      turn: 90 * (1 - Oe(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Oe(t, a.gone)
    }
  };
}
function O3(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Nt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = zw({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function T3(e) {
  const t = Le.least + Math.floor(e() * (Le.most - Le.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Le.walls[Math.floor(e() * Le.walls.length)],
    along: Le.margin + e() * (1 - 2 * Le.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ps(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Le.margin, l = ((e.along - Le.margin + e.way * Le.speed * n / a) / s % 2 + 2) % 2, r = Le.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Le.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Le.inset : t.right - Le.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function e2(e, t) {
  const n = Ce.bug_shot, [a, s] = n.turn.map((u) => u * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Vw(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), d = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: d };
}
function I3(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ce.bug_shot, { frame: l, bug: r, shot: i } = e2(n, e.length), d = e.map((M, q) => ({ ...ps(M, t, Math.min(n / o.fps, Wn(q).shot)), shot: q < i })), u = Oe(l / o.frames, o.aim), [h, m] = [d[Math.max(r - 1, 0)], d[r]], y = e.map((M, q) => ({ bug: M, index: q, seconds: n / o.fps - Wn(q).shot, spot: ps(M, t, Wn(q).shot) })).filter((M) => M.seconds >= 0), b = y.flatMap((M) => {
    const q = (s == null ? void 0 : s.get(M.index)) ?? o2(M.bug, t, M.spot, s ? [] : a);
    return s == null || s.set(M.index, q), s && l2(q, M.seconds, a), r2(q, M.seconds, a);
  }), S = y.filter((M) => a2(M.bug)).map((M) => ({ seconds: M.seconds, from: M.spot })), A = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - u) + +(e[r].wall === "top") * u;
  return { bugs: d, frame: l, target: { x: h.x + (m.x - h.x) * u, y: h.y + (m.y - h.y) * u, back: A }, slush: b, camera: S };
}
function Wn(e) {
  const t = Ce.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function R3(e, t, n, a) {
  const { limit: s, margin: o } = Ce.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((d, u) => {
    const h = Wn(u), m = ps(d, t, h.shot), y = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), b = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), S = Math.abs(m.x - i) >= y ? i : m.x + b * y, A = b > 0 ? Math.max(i, Math.min(S, r)) : Math.min(i, Math.max(S, l)), M = { from: i, to: A, begin: h.walk, end: h.aim };
    return i = A, M;
  });
}
function B3(e, t, n) {
  var o;
  const a = Ce.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Oe(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Se = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, t2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function n2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const a2 = (e) => e.along * 97 % 1 < Se.camera, cn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Se.gravity * t * t });
function s2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Se.gravity * (t.bottom - e.from.y))) / Se.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Se.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Se.gravity, on: "top" });
  const l = s.filter((d) => d.t >= 0).sort((d, u) => d.t - u.t)[0];
  let r = e.from;
  for (let d = 0; d < l.t; d += Se.step) {
    const u = Math.min(d + Se.step, l.t), h = cn(e, u), m = Zr(r, h, n);
    if (m) return { ...m, t: d + (u - d) * m.share };
    r = h;
  }
  const i = cn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function o2(e, t, n, a = []) {
  const s = n2(e.along + 1), [o, l] = t2[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: Se.count }, () => {
    const i = r + (s() - 0.5) * 2 * (Se.spread * Math.PI / 180), d = Se.speed[0] + s() * (Se.speed[1] - Se.speed[0]), u = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * d, vy: Math.sin(i) * d, r: Se.radius[0] + s() * (Se.radius[1] - Se.radius[0]) };
    return { ...u, ...s2(u, t, a) };
  });
}
function l2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Se.step) {
      const l = Math.min(o + Se.step, s), r = Zr(cn(a, o), cn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function r2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...cn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Se.hold) / Se.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((u) => u.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, d = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: d, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function L3(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = Ce.bug_shot;
  if (e < 0) return [];
  const d = (s[1] - s[0]) * r / i, u = (o[1] - o[0]) * r / i, h = Oe(e, [0, d]), m = Oe(e, [d, d + u]);
  return l.map((y) => {
    const b = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * h,
      y: n.y + (b.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: h >= 1
    };
  });
}
function N3(e, t, n, a, s) {
  const { sway: o, above: l } = Ce.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [d, u] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], h = (S) => {
    const [A, M] = [S.x - e.at.x, S.y - e.at.y];
    return { x: r.x + A * d - M * u, y: r.y + A * u + M * d };
  }, [m, y] = [...n].sort((S, A) => S.x - A.x), b = e.ends.map(h);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: b.map((S, A) => ({ from: S, to: A < b.length / 2 ? m : y })) };
}
const D3 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function Zn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: rn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: rn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function q3(e, t) {
  const n = Ce[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Zn(n, t), l = 1 - (1 - n.small) * Oe(a, n.shrinks) * (1 - Oe(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Zn(n, t), o = n.flat * Oe(a, n.squashes) * (1 - Oe(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * rn(s, ...n.springs)) * (1 - rn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const P3 = (e) => e === "pack_box";
function j3(e) {
  const { into: t, out: n } = Zn(Ce.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function F3(e) {
  const t = Ce.rope_swing, { into: n, out: a } = Zn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const i2 = { after: 3 }, Ws = 10, c2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, u2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, d2 = { weight: 19 }, ei = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, f2 = { every: 120 }, ti = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ni = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, h2 = {
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
}, yn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ws }), le = (e, t, n = {}) => yn(e, "clip", t, n), Da = (e, t, n = {}) => yn(e, "look", t, n), Qo = (e, t, n = {}) => yn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...yn(e, "pick", t, n), ...a }), we = (e) => yn("nothing", "nothing", e, {}), m2 = 120, p2 = 300, qa = (e, t) => ({ ...le(e, t), cooldown: p2 }), ue = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), g2 = () => [le("joy", 2)], bt = (e, t, n, a, s = {}) => ({ ...le(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), kt = (e) => ({ ...e, cooldown: c2[e.name] }), Kt = (e) => ({ ...e, shenanigan: !0, lasts: u2[e.name] }), ma = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ue("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [le("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ue("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...kt(le("bug_shot", 3)), toward: "", onto: !1 },
    { ...kt(le("bug_smash", 2)), toward: "", onto: !1 },
    le("nod", 2)
  ]),
  ...ue("tests_failed", { cooldown: 20, toward: "card" }, [le("startled", 2), le("dismay", 1), le("tantrum", 3), we(1)]),
  ...ue("committed", { cooldown: 30, toward: "card", onto: !0 }, [le("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ue("sin_fixed", { cooldown: 300 }, [le("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ue("sin_committed", { cooldown: 300 }, [le("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...ue("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [le("nod", 4), le("hand_rub", 4), we(7)]),
  ...ue("question_asked", { cooldown: 60 }, [le("ask_sign", 9), le("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ue("reported", { cooldown: 90 }, [Qo("read", 3), le("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ue("read_message", { cooldown: 30 }, [Qo("read", 3), we(1)]),
  ...ue("fact_filed", { cooldown: 120 }, [le("file_card", 3), le("nod", 1), we(6)]),
  ...ue("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [le("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ue("bar_done", { holds: !0 }, g2()),
  ...ue("bar_failed", { holds: !0 }, [le("fume", 1), le("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ue("standing", { cooldown: 12 }, [le("look_left", 2), le("look_right", 2), le("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ue("launched", { cooldown: 300 }, [le("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...ue("building", { cooldown: 30 }, [le("wipe_brow", 4), le("look_left", 1), le("look_right", 1), we(69)]),
  ...ue("failed", { cooldown: 20, toward: "card" }, [le("shake", 3), le("tantrum", 2), we(2)]),
  ...ue("refused", { cooldown: 20 }, [le("shake", 1), we(1)]),
  ...ue("work_done", { cooldown: 120 }, [le("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ue("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...ue("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...ue("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...ue("answered", { cooldown: 15 }, [Da("amused", 3), we(2)]),
  ...ue("heard", { cooldown: 30 }, [
    le("bow", 1, { voices: ["butler"] }),
    le("salute", 1, { voices: ["squire"] }),
    le("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...ue("long_walk", { cooldown: 90 }, [le("stumble", 3), we(22)]),
  ...ue("card_arrived", { cooldown: 20, toward: "card" }, [le("glance", 7), we(13)]),
  ...ue("typing", { cooldown: 60 }, [Da("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(h2).flatMap(([e, t]) => ue(`reacted:${e}`, {}, [Da(t, 1)])),
  ...Object.entries(ti).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => ue(`agent_reacted:${n}`, {}, [le(a, 1, { voices: [e] })])[0])),
  ...Object.entries(ni).flatMap(([e, t]) => ue(`agent_reacted:${e}`, {}, [le(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ue("pastime", {}, [
    bt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    bt("rest", 3, 180, 120),
    bt("yawn", 2, 60, 60),
    bt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    bt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    bt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    bt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Kt(kt(le("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Kt(kt(le("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ue("held:search", { cooldown: m2 }, [qa("search", 3), { ...qa("binoculars", 2), when: { home: !0 } }, { ...qa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ue("held:type", {}, [le("type", 3), le("type_ponder", 1)]),
  ...ue("held:compacting", {}, [le("pack_box", 3), le("vacuum", 2), le("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ue("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ue("tickled", {}, [{ ...kt(le("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ue("eager", {}, [le("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ue("jump", {}, [Kt(kt(le("backflip", 7, { high: !0 }))), le("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ue("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ue("unit", { cooldown: ei.build.cooldown }, [be("unit", d2.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ue("progress_jump", { cooldown: 6 }, [le("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ue("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: f2.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...ue("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ue("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    Kt(be("bubble", 15, {}, { stay: [30, 80] })),
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
    Kt(kt(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ue("laptop", {}, [be("seat", 6, {}, { stay: [60, 150] }), be("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ue("ledge_at", {}, [be("middle", 2, {}, { along: 1 / 2 }), be("third", 1, {}, { along: 1 / 3 }), be("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ue("composed_as", {}, [
    be("facing", 4, {}, { turn: 0, leans: 0 }),
    be("turned_left", 1, {}, { turn: 335, leans: 0 }),
    be("turned_right", 1, {}, { turn: 25, leans: 0 }),
    be("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    be("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], ai = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), si = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), v2 = (e) => Array.isArray(e) ? e[0] : e, y2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, b2 = (e) => ma.some((t) => t.when.moment === e);
function k2(e) {
  var d;
  const t = e.has ?? (() => !0), n = (u) => e.now - (e.memory.get(u) ?? -1 / 0), a = (u) => !e.memory || si(u).every(([h, m]) => n(h) >= v2(m)), s = (u) => !u.shenanigan || u.lasts <= (e.room ?? 0), o = ma.filter((u) => ai(u.when, e) && (u.type !== "clip" || t(u.name)) && a(u) && s(u)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= i2.after && o.some((u) => u.shenanigan) ? o.filter((u) => u.shenanigan) : o, i = r.filter((u) => {
    var h;
    return u.type === "nothing" || u.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return i.some((u) => u.type !== "nothing") ? i : r;
}
function Ve(e, t) {
  const n = k2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (oi(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function oi(e, t, n) {
  var a;
  for (const [s, o] of si(t)) (a = e.memory) == null || a.set(s, e.now + y2(o, n));
}
function W3(e, t, n) {
  oi(e, ma.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const H3 = (e) => Object.values(ei).find((t) => ai(t.when, e)) ?? null, w2 = (e, t, n) => n - t <= (e.lifetime ?? Ws), U3 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Xr(e.clip, t));
class li {
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
const gs = {
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
}, z3 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ri = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), V3 = {
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
}, G3 = 120, $2 = 20, K3 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < $2), x2 = (e) => gs[e] || gs.idle, Y3 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, ii = "airborne", S2 = "landing", _2 = "travelling", ci = "grounded", J3 = ({ airborne: e, landing: t, trip: n }) => e ? ii : t ? S2 : n != null && n.started ? _2 : ci;
function Q3(e, t) {
  var s;
  const n = M2(e, t);
  return e.mode === ci && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function M2(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: d, doing: u, doingFacing: h = 0, readingFacing: m = null } = e;
  if (n === ii && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...C2(o, u, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && d === "asking") return { clip: "point", facing: 0 };
  const y = m !== null && r.posture === "stand" && u !== "push";
  return ["asking", "waiting"].includes(d) && !["work", "push"].includes(u) ? { clip: "waiting", facing: y ? m : e.composeFacing ?? 0 } : { clip: t(u, r.posture) ? u : x2(d), facing: y ? m : r.posture === "sit" ? r.face : h };
}
function C2(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const vs = (e) => e.outcome, E2 = "plugin:code-commandments:sins:", Xo = (e) => e.type === "plugins.card" && e.markKey.startsWith(E2), A2 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Xo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Xo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], X3 = (e, t) => e.filter((n) => n.author === "user" && Yn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Yn(n.read_at), card: dr(n) })).sort((n, a) => n.time - a.time), Zo = { user: "reacted", agent: "agent_reacted" };
function Z3(e, t) {
  return e.filter((n) => Zo[n.author] && Ct(n) > t).map((n) => ({ beat: `${Zo[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const O2 = [.../* @__PURE__ */ new Set([...Object.values(ti).flatMap((e) => Object.keys(e)), ...Object.keys(ni)])];
function eS(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = O2.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: dr(n) })).sort((n, a) => n.time - a.time);
}
const T2 = (e) => new li(e).isTest(), ea = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[vs(e)] || "";
}, I2 = 1800, R2 = (e, t) => {
  if (ea(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ea(n) !== "finished" && Number(e.time) - Number(n.time) <= I2 ? "tests_fixed" : "tests_passed";
};
function tS(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(T2), s = a.filter((r) => ea(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, ea(r))), o.map((r) => ({ beat: R2(r, s), time: Number(r.time), card: r.key }));
}
function nS(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(vs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: vs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const aS = (e) => e.map((t) => {
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
function sS(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function oS(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function lS(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = A2.find((d) => d.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Hs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const el = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function B2(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Hs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function rS(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : b2(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function iS(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const tl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function cS(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, d = tl((r - i) / Re.returnSeconds), u = r <= i ? tl(r / i) : 1 - d, h = l + ((l + 1) % s - l) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * u, y: e.top + a + h * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const nl = 3, ui = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, al = 12, uS = (e, t) => ({ mood: e, began: t, seen: 0 });
function dS(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ui(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= nl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * al) / al, lasts: nl } };
}
const fS = (e) => e.posture === "hang" && !ui(e.face), L2 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), N2 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function hS(e, t, n) {
  return L2.has(e) ? 1 / 0 : !N2.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(di(n - t.began, t.share) - st.lead, 0);
}
const D2 = 5;
function mS(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= D2 ? { beat: "long_walk", time: n } : null };
}
const q2 = 30, Ln = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function pS(e, t, n, a, s = null) {
  if (t && n < t.until || !Ln.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, r] = Ln.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Ln.every } : { state: e, began: 0, until: 0, next: n + Ln.every };
}
const gS = (e, t, n) => t && n < t.until && ri.has(e.state) ? { state: t.state, since: t.began } : e, st = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, di = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function vS(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = di(o, e.share);
  return s ? { eager: P2(t, l), moment: null } : l > st.lead ? { eager: t, moment: null } : l < st.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > st.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < st.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function P2(e, t) {
  return e.on && t > st.lead + st.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= st.lead && t >= st.least ? { ...e, on: !0, calm: !1 } : e;
}
const j2 = 1, F2 = { look: "look", gaze: "gaze" };
function W2(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [F2[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const H2 = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), U2 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > j2 * t, memory: a, now: s, room: o }, n).name === "backflip", z2 = { work: ["building"], idle: ["standing"] };
function yS(e, t, n, a) {
  const s = gs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(z2[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), ri.has(e) ? { moments: o, began: n || a } : (n && a - n >= q2 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function V2(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const sl = { pondering: V2 };
function bS(e, t, n, a, s, o) {
  if (sl[e.beat]) {
    const r = sl[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = W2(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ws && { lifetime: l.lifetime } } } : null;
}
function kS(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = H2(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const wS = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function $S(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function xS(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const SS = (e, t) => !!(e != null && e.watches) && !t.once, _S = 10, MS = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || w2(a, a.queuedAt, n)), CS = (e, t) => t ? null : e[0] ?? null;
function ES(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const AS = (e, t) => !t.during || !e.some((n) => n.during === t.during), G2 = 2 * Math.PI, K2 = 500;
function OS(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / K2, i = t && e.point && !!t.behind != !!e.point.behind, d = i && e.amount > 0, u = t && !d ? o : 0, h = e.amount < u ? Math.min(e.amount + r, u) : Math.max(e.amount - r, u), m = G2 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (d ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !i ? s && !t.behind && !y.behind ? J2(y, t, n, m, s) : X2(y, t, n, m) : t) ?? y, A = S != null && S.behind && S.mood === "reading" ? Y2(e.point, S, n, l, s) : S;
  return { point: A ?? null, toward: A ? { x: A.x - n.x, y: A.y - n.y } : null, amount: h, at: a };
}
function Y2(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, d = l(o(Math.atan2(t.x - n.x, -i)) - r), u = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = h ? l(e.readingFacing - r) : 0, y = h ? e.readingYaw + m : u, b = y + l(d - y), S = Math.min(Math.max(a / 1e3, 0), 0.1), A = Re.turnSpeed * S, M = h ? y + Math.min(Math.max(b - y, -A), A) : b, q = h ? e.readingFollow + m : M, U = q + (M - q) * (1 - Math.exp(-S / Re.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, L = o(Hs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), W = Math.min(Math.max(L, -P.up), P.down), O = Re.tipSpeed * S, I = h ? e.readingPitch + Math.min(Math.max(W - e.readingPitch, -O), O) : W;
  return { ...t, readingYaw: M, readingFollow: U, readingPitch: I, readingFacing: r };
}
function J2(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (q) => {
    const { yaw: U, pitch: P } = Hs(q.x - n.x, s, n.y - q.y, o);
    return { yaw: U, pitch: Math.min(Math.max(P, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, d] = [el(r(e)), el(r(t))], u = Math.acos(Math.min(Math.max(i[0] * d[0] + i[1] * d[1] + i[2] * d[2], -1), 1));
  if (u <= a) return { ...t };
  const h = a / u, [m, y] = [Math.sin((1 - h) * u) / Math.sin(u), Math.sin(h * u) / Math.sin(u)], [b, S, A] = i.map((q, U) => m * q + y * d[U]), M = s * b / S;
  return { ...t, x: n.x + M, y: n.y - B2(M, s, -Math.asin(Math.min(Math.max(A, -1), 1)), o) };
}
const Q2 = 0.15;
function TS(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Q2;
}
function X2(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Z2 = (e) => !(e != null && e.on);
function IS(e, t, n) {
  if (Z2(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const un = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, tt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Pa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ol = (e) => e * e * (3 - 2 * e);
function e5(e) {
  if (e < 0 || e >= tt.seconds) return null;
  const t = Pa(e, ...tt.flicker), n = Math.floor(t * tt.flickers * 2) % 2 === 0, a = e < tt.flicker[1] ? n ? 0.35 + 0.5 * t : tt.dim : 1;
  return { strength: 1 - ol(Pa(e, ...tt.fade)), lit: a, white: e < tt.flash[0] ? 0 : 1 - ol(Pa(e, ...tt.flash)) };
}
const RS = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function BS(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = e5(t - e.at);
  return a && { colour: un.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: tt.signs[e.tone], ...a } };
}
function LS(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function NS(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= un.looks || a === null && n - e.since >= un.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function DS(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const dt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, qS = { behind: 39, figure: 40, ahead: 41 }, t5 = "[data-figure-pile]", n5 = { amber: [1, 0.69, 0.125], good: un.colours.good, bad: un.colours.bad }, Hn = { phases: 4, ms: 230, dim: 0.25 }, PS = (e, t, n) => e !== "amber" || (t + n) % Hn.phases < Hn.phases / 2 ? 1 : Hn.dim, jS = (e) => e === "amber" ? Hn.phases : 1;
function FS(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const WS = Object.keys(n5), Ge = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Qt = ([e, t], n) => e + n() * (t - e);
function HS(e) {
  const t = Ge.least + Math.floor(e() * (Ge.most - Ge.least + 1));
  return Array.from({ length: Math.min(t, Ge.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ge.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Qt(Ge.start, e), l = Qt(Ge.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Ge.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Qt(Ge.moveMs, e)),
      fadeMs: Math.round(Qt(Ge.fadeMs, e))
    };
  });
}
const ja = { high: 3, gap: 1 };
function US(e) {
  const t = Math.floor(e / ja.high);
  return { left: -(dt.inside + dt.width / 2 + t * (dt.width + ja.gap)), up: e % ja.high * (dt.height - dt.top) };
}
const a5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, s5 = { after: 5 }, o5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new li(t).isBuild());
function zS(e, t, n) {
  const a = o5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= s5.after ? s : null;
}
function VS(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: a5(n, a, s) } : null;
}
const ll = { ahead: 140, up: 70 };
function GS(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * ll.ahead, y: a - ll.up } } : o ? { at: { x: n(o), y: a - o.up - dt.height } } : t ? { at: null } : null;
}
const Fa = { least: 4e3, most: 1e4 }, l5 = (e) => Fa.least + e() * (Fa.most - Fa.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function KS(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = l5(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), a = o + wt.ms;
  }
}
const YS = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), JS = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), fi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), QS = new Set(ma.filter((e) => fi.has(e.when.moment) && e.type === "clip").map((e) => e.name)), r5 = (e) => e.some((t) => t.state === "built"), XS = (e, t) => r5(t) ? e.filter((n) => !fi.has(n.beat)) : e, mt = { reach: 40, room: 6 }, i5 = (e, t) => t <= e - mt.reach + 2, ZS = (e, t, n) => i5(e, n) ? t - mt.reach : e - mt.reach - mt.room, e6 = (e, t, n, a) => a > 0 && t < e && t + mt.reach >= e - 2 ? Math.min(n, Math.max(e, t + mt.reach)) : e, Wa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, t6 = (e) => Qt(e() < Wa.longShare ? Wa.long : Wa.short, e), c5 = 2 * dt.width;
function n6(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= c5 ? o : e + (o - e + s / 2) % s;
}
const u5 = 60, a6 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= u5, rl = "[data-figure-home]", bn = () => {
  var t;
  const e = document.querySelector(rl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(rl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, d5 = "[data-figure-docked-bars]", f5 = "[data-figure-chat-foot]", h5 = [0.85, 0.6, 0.35, 0.15], m5 = ["question", "waiting", "suggestion"], s6 = (e, t) => m5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function o6() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const p5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", g5 = "[data-figure-newest]";
function hi() {
  var a, s;
  const e = (a = bn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(g5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Us(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function dn(e, t, n = hi()) {
  if (!e || !n) return !0;
  const a = rt(e, t), s = ga(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = xt.gap;
  return !pa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function l6(e, t, n, a = hi()) {
  if (!a || dn(t, e, a)) return null;
  const s = ga(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Vs * e.size : wi * e.size, d = Math.max(n.left + i, r.left + o), u = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= d && m.x <= u && dn(m, e, a) && z5(m, e)).sort((m, y) => Math.abs(m.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Ha = 0.26, mi = 0.54, v5 = 1.25 / 5.4, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ha, travels: "stand" },
  lounge: { drop: Ha, travels: "stand" },
  composed: { drop: Ha, travels: "stand" },
  hang: { drop: mi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, r6 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * v5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - mi
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), y5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), i6 = (e, t) => (e === "sit" ? y5.has(t) : en.has(e)) ? e : "stand";
function c6(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const u6 = 0.25, d6 = (e, t) => en.has(e) && kn[t].drop === 0, pi = 2, b5 = 90, k5 = 180, w5 = 140, $5 = 280, x5 = 420, S5 = 0.25, _5 = 290, M5 = 600, C5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", E5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ua = 5;
function ta(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: d = null, now: u = 0, room: h = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ua) return null;
  (l || r) && (o = Math.max(o, pi));
  const y = o > 1, b = Math.abs(t.x - e.x), S = b < Ua ? 0 : b / (b5 * o) * 1e3, A = Math.min(S, y ? w5 : k5), M = Math.abs(t.y - e.y), q = t.y < e.y, U = q && !m && U2(M, n, i, d, u, h), P = q ? x5 + Math.min(M, 400) * S5 : Math.sqrt(2 * M / Fs) * 1e3, L = {
    x: t.x,
    y: t.y,
    ms: M > Ua ? U ? M5 : P : 0,
    lead: U ? _5 : q ? $5 : 0,
    easing: q ? C5 : E5,
    hopping: !0,
    clip: U ? "backflip" : q ? "jump" : "fall"
  }, W = { x: t.x, y: t.y, ms: S + A, lead: 0, easing: "linear", ramp: A, ...y ? { clip: "run" } : {} }, O = m ? A5(t, n) : L, I = q && !a ? [{ ...W, y: e.y }, O] : [{ ...L, x: e.x }, W];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !s, pace: o, running: y };
}
const A5 = (e, t) => ({ x: e.x, y: e.y, ms: Ce.pogo.frames / Ce.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), O5 = (e, t) => e.postures.includes(t) ? t : e.postures[0], f6 = (e, t, n) => e.posture === "walk" && n ? "walk" : O5(e.clip, t), rt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - kn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, pa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Us = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = bn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Nn = 0.5, il = 20;
function h6(e, t, n = At()) {
  const a = rt(e, t);
  return a.left >= n.left + il && a.right <= n.right - il;
}
function zs(e, t, n = At()) {
  const a = rt(e, t), s = a.right - a.left, o = ga(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Nn && r <= n.right + Nn && a.top >= n.top - Nn && i <= n.bottom + Nn;
}
const na = [0.35, 0.5, 0.65], aa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: na[0], right: na.at(-1), top: aa[0], bottom: aa.at(-1) }, T5 = 0.24;
function ga(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + T5 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function I5(e, { size: t }, n = At()) {
  const a = ga(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Vs = (Ie.right - Ie.left) / 2 + 0.08;
function m6(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - kn[e].drop) };
}
const R5 = "[data-figure-agent]";
function gi(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Us(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((d) => d >= 0)) {
    if (!o.data[i].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, i), d.setEnd(o, i + 1), [...d.getClientRects()].some((u) => e >= u.left && e <= u.right && t >= u.top && t <= u.bottom)) return !0;
  }
  return !1;
}
const vi = (e) => aa.flatMap(
  (t) => na.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Gs(e, t, n = "") {
  if (!dn(e, t)) return na.length * aa.length;
  const a = rt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(p5)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && pa(s, i) && Us(r)).map(({ rect: r }) => r), l = (r, i) => o.some((d) => r >= d.left && r <= d.right && i >= d.top && i <= d.bottom);
  return vi(s).filter(([r, i]) => l(r, i) || gi(r, i, n)).length;
}
function B5(e, t) {
  const n = rt(e, t);
  return vi({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => gi(a, s, "", R5)).length;
}
const cl = 4;
function p6(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = cl; o <= s; o += cl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!B5(r, e) && dn(r, e)) return r;
    }
  return null;
}
function fn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => zs(l, t, a) && dn(l, t)).map((l) => ({ spot: l, covered: Gs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const yi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), L5 = [0.5, 0.25, 0.75], N5 = (e) => yi(e.getBoundingClientRect(), L5), bi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, D5 = Vs, q5 = (e, t, { size: n }, a = D5) => ki(e, bi[t], a * n, "stand");
function ki(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const P5 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, wi = 0.1, j5 = (e, t, { size: n }) => ki(e, P5[t], wi * n, "sit"), F5 = (e) => ((e + 180) % 360 + 360) % 360 - 180, za = 60;
function g6(e, t) {
  const n = F5(t);
  return !e.aside || Math.abs(n) >= za ? t : n < 0 ? 360 - za : za;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, W5 = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function v6(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = W5(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? H5(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function H5(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function y6(e, t) {
  const { element: n, edge: a } = va(), s = ["left", "right"].map((r) => wn(j5(a, r, e), e)).filter((r) => n && zs(r, e) && !Gs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function b6(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - $i } : e;
}
const $i = 7;
function xi() {
  const e = [...document.querySelectorAll(t5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function U5(e, t) {
  const n = rt(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function z5(e, t) {
  const n = xi();
  return !n || !pa(U5(e, t), n);
}
const V5 = 4;
function va() {
  const e = $n(), t = xi(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > V5 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - $i - n, 0) } };
}
const k6 = ({ size: e, below: t }) => (1 - t) * e;
function wn(e, t) {
  const n = At(), { size: a, below: s } = t, o = kn[e.posture].drop * a;
  return { ...I5(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ys = (e, t) => Object.keys(bi).map((n) => wn(q5(e, n, t), t)), Ks = (e, t) => yi(e, h5).map((n) => wn(n, t)), Si = (e, t, n) => fn(e, t, n) ?? e[0];
function w6(e, t) {
  const { element: n, edge: a } = va();
  return { ...Si(ys(a, e), e, t), view: null, on: n };
}
function $6(e, t, n, a) {
  const { element: s, edge: o } = va(), l = (a ? ys(o, t) : [...ys(o, t), ...Ks(o, t)]).filter(
    (d) => !pa(rt(d, t), e)
  ), r = fn(
    l.filter((d) => d.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Gs(r, t) ? r : fn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function $n() {
  var a;
  const e = bn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(d5);
  if (!t) return { ...ya(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const ul = { within: 2 };
function x6(e) {
  const { element: t, docked: n, edge: a } = $n();
  if (!n || e.on !== t) return !0;
  const s = ya().edge;
  return a.left > s.left + ul.within || a.left + a.width < s.left + s.width - ul.within;
}
const G5 = "[data-figure-closing]";
function S6() {
  var n;
  const { element: e, docked: t } = $n();
  return t && !!((n = e.firstElementChild) != null && n.matches(G5));
}
const _i = "[data-figure-progress]";
function _6(e) {
  const t = e.querySelector(_i);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function M6(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const K5 = { across: 300, above: 380, below: 60 };
function C6(e) {
  const { across: t, above: n, below: a } = K5;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Y5(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Y5 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Mi = "[data-figure-bar]", bs = { back: 144, along: 0.4 };
function E6(e) {
  const { element: t, docked: n, edge: a } = $n(), s = n ? t.querySelector(Mi) : null;
  if (!(s != null && s.querySelector(_i))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...wn({ x: o - bs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function A6(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < bs.along * a.size ? t.x + bs.along * a.size : e.x, y: e.y, behind: !0 };
}
function O6(e) {
  const t = e.querySelector(Mi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ya() {
  const e = bn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function T6(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ya(), i = n === null ? J5(r, e, o === null ? t : { x: o, y: r.top }, a, s) : wn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function J5(e, t, n, a, s) {
  const o = Ks(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + dt.width < s && i.x + a - mt.reach - mt.room >= l);
  return fn(r.length ? r : o, t, n);
}
const Q5 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function I6(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: d = null, now: u = 0, room: h = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, pi));
  const y = (U) => {
    const P = rt(U, n, kn[U.posture].travels);
    return { x: P.left, y: P.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return X5(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [S, ...A] = [e, ...i, t].map(y), M = ta(S, A[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: d, now: u, room: h, pogo: m }), q = A.slice(1).map((U, P) => {
    var L;
    return (L = ta(A[P], U, n.size, { random: r, memory: d, now: u, room: h })) == null ? void 0 : L.legs.find((W) => W.hopping);
  });
  return M && { ...M, legs: [...M.legs, ...q.filter(Boolean)] };
}
function X5(e, t, n, a, s, o, l) {
  const r = (u, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - u.x, h.y - u.y) / Q5.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? ta(e, n, o.size, { pace: l }) : ta(n, t, o.size, { pace: l }), d = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: l, running: l > 1 };
}
function R6(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function B6(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && fn(N5(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = va();
  return { ...Si(Ks(s, t), t, n), view: null, on: a };
}
const Z5 = "[data-figure-bubble]", e$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ci = 0;
const Vt = () => nn, Va = /* @__PURE__ */ new WeakMap();
let t$ = 0;
function Ys(e) {
  return Va.has(e) || Va.set(e, `floor-${++t$}`), Va.get(e);
}
const n$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, a$ = () => {
  var e, t;
  return ((t = (e = bn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function s$(e, t) {
  var a;
  const n = (a = e.querySelector(f5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function o$(e, t) {
  const n = e && s$(e, t), a = e ? [...e.querySelectorAll(Z5)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || n$(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ys(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const l$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= e$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Ei(e = nn, t = performance.now()) {
  const n = At(), a = a$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = $n(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = ya();
  return d.element && i.push({ id: Ys(d.element), type: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), i.push(...o$(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((u) => Object.freeze({ ...u, vy: l$(e, u, t) }))) });
}
const ks = /* @__PURE__ */ new Set();
function r$(e) {
  return ks.add(e), () => ks.delete(e);
}
function i$() {
  Ai();
  const e = () => {
    Ci = requestAnimationFrame(e), !document.hidden && (nn = Ei(nn), ks.forEach((t) => t(nn)));
  };
  e();
}
function Ai() {
  cancelAnimationFrame(Ci);
}
const Js = 5, c$ = 56, u$ = { share: 0.6 }, d$ = (e) => -Math.sqrt(2 * Fs * u$.share * e), Ft = (e, t) => e.find((n) => n.id === t) ?? null;
function L6(e, t = Ei().floors) {
  const n = Ft(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ys(e.on) : null, o = s && Ft(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Oi({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Vt().floors) {
  const d = Ft(i, e);
  if (!d) return null;
  const u = { x: d.left + t, y: d.top + n, posture: a, face: s };
  return (l || f$(d, u, o)) && h$(u, r, i) ? { x: u.x, y: u.y } : null;
}
const Qs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, f$ = (e, t, n) => !Qs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function N6(e, t = Vt().floors) {
  if (!Qs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Js && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function h$(e, t, n = Vt().floors) {
  const a = Ft(n, "home");
  return e.posture === "hang" && a && rt(e, t).bottom >= a.top ? !1 : zs(e, t);
}
function D6(e, t, n, a = Vt().floors) {
  const s = Oi(e, n, a);
  if (!e.home) return m$(e, t, s, a);
  if (!s) return null;
  const o = Ft(a, "home"), l = s.y - t.y, r = l > Js ? "dropping" : -l > c$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function m$(e, t, n, a) {
  const s = n ? Ft(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: d$(e.risen) };
  if (!n) return null;
  if (Qs(t) && n.y - t.y > Js) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function q6(e, t, n) {
  const a = Vs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function P6(e, t, n, a = Vt().floors) {
  const s = t && Oi(t, n, a);
  return s ? { ...e, ...s } : e;
}
const p$ = ["data-type"], g$ = { class: "figure-floor-name" }, v$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", g$, v(e.floor.type), 1)
    ], 12, p$));
  }
}, y$ = /* @__PURE__ */ V(v$, [["__scopeId", "data-v-4e0f1e2e"]]), b$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, k$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ye(Vt().floors);
    let n = () => {
    };
    return Ee(() => {
      n = r$((a) => t.value = a.floors), i$();
    }), Be(() => {
      n(), Ai();
    }), (a, s) => (c(), f("div", b$, [
      (c(!0), f(j, null, te(t.value, (o) => (c(), F(y$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, j6 = /* @__PURE__ */ V(k$, [["__scopeId", "data-v-e519168b"]]), Ga = (e) => typeof e == "number" ? e : Date.parse(e);
function F6(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ga(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ga(s.row.created_at) - Ga(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const w$ = 3, Ka = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function $$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ka[n.grouping]) == null ? void 0 : a.call(Ka, e.row, n)) || "";
}
function x$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function W6(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= w$ ? [x$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = $$(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function H6(e) {
  const t = Ue(), n = t.option("row"), a = C(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), pe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function S$(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const U6 = (e) => (t) => t.filter((n) => n.id !== e), z6 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), V6 = (e) => (t) => [...t, e], G6 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function K6(e, t = {}) {
  const n = Ue(), a = C(null), s = C("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function Y6(e) {
  const t = Ue(), n = C("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Dn = /* @__PURE__ */ new Map();
function _$(e, t) {
  if (Dn.has(e)) return Dn.get(e);
  const n = t().finally(() => Dn.delete(e));
  return Dn.set(e, n), n;
}
function J6() {
  const e = Ue(), t = C(null), n = C("");
  async function a() {
    const s = await _$(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const M$ = { class: "cards-page" }, C$ = { class: "cards-bar" }, E$ = { class: "cards-count" }, A$ = { class: "cards" }, O$ = {
  key: 1,
  class: "cards-note"
}, T$ = {
  key: 2,
  class: "cards-note"
}, I$ = ["data-row", "onClick"], R$ = { class: "card-head" }, B$ = { class: "card-title" }, L$ = { class: "card-foot" }, N$ = {
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
    return (a, s) => (c(), f("div", M$, [
      p("div", C$, [
        p("span", E$, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        T(de, De({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            T(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", A$, [
        e.loaded ? e.failure ? (c(), f("p", O$, v(e.failure), 1)) : e.rows.length ? w("", !0) : (c(), f("p", T$, "No " + v(e.noun) + "s yet", 1)) : (c(), F(Ze, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), f(j, null, te(e.rows, (o) => (c(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          p("span", R$, [
            T(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + v(e.head(o)), 1),
            T(Je, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", B$, v(e.title(o)), 1),
          p("span", L$, v(e.foot(o)), 1)
        ], 8, I$))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Q6 = /* @__PURE__ */ V(N$, [["__scopeId", "data-v-990e6b37"]]), dl = "newest";
function X6(e, { title: t, isOpen: n = null }) {
  var d;
  const a = (d = Te(Pe, null)) == null ? void 0 : d.search, s = C(""), o = C(dl), l = C("all"), r = R(() => {
    const u = s.value.trim().toLowerCase(), h = e.value.filter((m) => S$(m, u, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === dl ? h : [...h].sort((m, y) => t(m).localeCompare(t(y)));
  }), i = R(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const D$ = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, q$ = 40, P$ = "top", j$ = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var h;
    const n = e, a = (h = Te(Pe, null)) == null ? void 0 : h.autoScroll, s = R(() => a === P$), o = C(null), l = C(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function u() {
      l.value = r(o.value) >= q$;
    }
    return pe(() => n.rowCount, async () => {
      await Xe(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, y) => (c(), f("div", D$, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: u
      }, [
        me(m.$slots, "default", {}, void 0, !0)
      ], 34),
      T(Ht, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: D(() => [
          qe(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            T(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ee(" Newest ", -1))
          ], 512), [
            [wl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Z6 = /* @__PURE__ */ V(j$, [["__scopeId", "data-v-3accb764"]]), F$ = ["aria-selected", "data-tab", "onClick"], W$ = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, H$ = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Te(Pe, null), o = R(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = C(null), r = C({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function d(m) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: y.offsetLeft, width: y.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const u = () => Xe(() => d(!0));
    let h = null;
    return Ee(() => {
      var m;
      d(!1), h = new ResizeObserver(() => d(!1)), h.observe(l.value), (m = document.fonts) == null || m.ready.then(() => d(!1));
    }), Be(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, u), pe(() => n.answer, u, { deep: !0 }), (m, y) => (c(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), f(j, null, te(o.value, (b) => {
        var S, A;
        return c(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((S = e.active) == null ? void 0 : S.key) === b.key }]),
          "aria-selected": ((A = e.active) == null ? void 0 : A.key) === b.key,
          "data-tab": b.key,
          onClick: (M) => a("choose", b)
        }, [
          ee(v(b.label) + " ", 1),
          i(b) ? (c(), f("span", W$, v(e.answer[b.count_field]), 1)) : w("", !0)
        ], 10, F$);
      }), 128)),
      p("i", {
        class: Y(["inner-tabs-line", { slides: r.value.slides }]),
        style: ve({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, e_ = /* @__PURE__ */ V(H$, [["__scopeId", "data-v-63fcd326"]]), U$ = {
  class: "tab-body",
  "data-tab-body": ""
}, z$ = { "data-tab-content": "" }, V$ = {
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
      n.value = !0, Ss(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), f("div", U$, [
      n.value ? (c(), F(Ze, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      qe(p("div", z$, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [wl, !n.value]
      ])
    ]));
  }
}, t_ = /* @__PURE__ */ V(V$, [["__scopeId", "data-v-63876533"]]), G$ = {}, K$ = { class: "menu-label" };
function Y$(e, t) {
  return c(), f("span", K$, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ws = /* @__PURE__ */ V(G$, [["render", Y$], ["__scopeId", "data-v-aa955b3e"]]), J$ = {
  class: "search-bar",
  "data-search-bar": ""
}, Q$ = { class: "search-bar-control" }, X$ = ["value", "placeholder", "aria-label"], Z$ = ["aria-expanded"], e4 = {
  key: 0,
  "data-menu-count": ""
}, t4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var M;
    const a = e, s = n, o = zi(), l = ((M = Te(Pe, null)) == null ? void 0 : M.search) ?? {}, r = R(() => l.placeholder || a.placeholder), i = l.context ?? [], d = C(null), u = C(null), h = C([]), m = R(() => h.value.length ? h.value[h.value.length - 1].next : i), y = R(() => !!o.menu || i.length > 0), b = (q) => {
      h.value = [], u.value = u.value ? null : q.currentTarget;
    };
    function S(q) {
      if (q.next.length) {
        h.value = [...h.value, q];
        return;
      }
      u.value = null, s("pick", q.click);
    }
    function A() {
      var q;
      s("update:modelValue", ""), (q = d.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = d.value) == null ? void 0 : q.focus();
    } }), (q, U) => {
      var P;
      return c(), f("div", J$, [
        p("div", Q$, [
          T(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          p("input", {
            ref_key: "field",
            ref: d,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: U[0] || (U[0] = (L) => s("update:modelValue", L.target.value)),
            onKeydown: qt(A, ["esc"])
          }, null, 40, X$),
          e.modelValue ? (c(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: A
          }, [
            T(ye, {
              name: "close",
              size: 12
            })
          ])) : w("", !0),
          y.value ? (c(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!u.value,
            onClick: b
          }, [
            e.menuCount ? (c(), f("span", e4, v(e.menuCount), 1)) : w("", !0),
            T(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Z$)) : w("", !0)
        ]),
        (P = N(l).button) != null && P.title ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (L) => s("pick", N(l).button.click))
        }, v(N(l).button.title), 1)) : w("", !0),
        me(q.$slots, "default", {}, void 0, !0),
        u.value ? (c(), F(ia, {
          key: 1,
          anchor: u.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = $e(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (L) => u.value = null)
        }, {
          default: D(() => [
            h.value.length ? (c(), F(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (L) => h.value = h.value.slice(0, -1))
            }, {
              default: D(() => [
                ee("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (c(!0), f(j, null, te(m.value, (L) => (c(), F(Mt, {
              key: L.title,
              description: L.subtext,
              "data-search-entry": L.title,
              onClick: (W) => S(L)
            }, {
              default: D(() => [
                ee(v(L.title) + v(L.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? w("", !0) : me(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, n4 = /* @__PURE__ */ V(t4, [["__scopeId", "data-v-45374bed"]]), a4 = {
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
    return (o, l) => (c(), F(n4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: D(() => [
        T(ws, null, {
          default: D(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (c(), f(j, null, te(a, (r) => T(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: D(() => [
            ee(v(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), f(j, { key: 0 }, [
          T(ws, null, {
            default: D(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), f(j, null, te(s, (r) => T(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: D(() => [
              ee(v(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : w("", !0)
      ]),
      default: D(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, n_ = /* @__PURE__ */ V(a4, [["__scopeId", "data-v-dab0064d"]]);
function a_() {
  const e = C(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const s_ = (e) => import(
  /* @vite-ignore */
  e
), s4 = 86400, $s = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function o4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round(($s(t) - $s(e)) / s4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function o_(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = $s(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: o4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ya = 280, Ja = 240, Qa = 120, l4 = 6, r4 = 14, hn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function i4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Ti(e, t) {
  const n = Math.max(0, i4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function c4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${r4}px)` }), e.offsetHeight, e.style.transition = `height ${Ya}ms ${hn}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, d = !1;
  const u = () => {
    d || (d = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (d) return;
    n() && (t.scrollTop = Ti(t, e));
    const m = s() - r;
    if (!i && m >= Ya && (i = !0, e.style.transition = `opacity ${Ja}ms ease-out, transform ${Ja}ms ${hn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ya + Ja) return a(h);
    u();
  };
  return a(h), u;
}
function l_(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${l4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Qa}ms ease-out, transform ${Qa}ms ${hn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Ti(t, e)), s() - l < Qa) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const u4 = 140, qn = 220, fl = 5;
function r_({ gap: e = u4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(u, h) {
    a.add(u), u.cancel = u.arrival(u.el, u.options, () => {
      a.delete(u), u.done(), h();
    });
  }
  function i() {
    const u = n.splice(0, fl);
    if (s = u.length > 0, !s) return;
    let h = u.length;
    for (const m of u)
      m.el.style.display = m.display, r(m, () => {
        h -= 1, h || (o = t(i, e));
      });
  }
  const d = (u, h, m, y = c4) => {
    if (l || !h.pane || !h.follows()) return m();
    const b = { el: u, options: h, done: m, arrival: y, display: u.style.display || "" };
    if (!s)
      return s = !0, r(b, () => o = t(i, e));
    u.style.display = "none", n.push(b), n.length >= fl && d.flush();
  };
  return d.flush = () => {
    var u;
    l = !0, queueMicrotask(() => l = !1);
    for (const h of [...a]) (u = h.cancel) == null || u.call(h);
    clearTimeout(o), s = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, d;
}
function i_(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${qn}ms ${hn}, opacity ${qn}ms ease-in, margin ${qn}ms ${hn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, qn);
}
const Ii = "chat.pins.minimised", Un = C(zn(Ii, !1));
function hl(e) {
  Un.value = e, Bs(Ii, e);
}
function d4(e) {
  const t = R(() => e()), n = R(() => Un.value ? [] : e()), a = () => hl(!Un.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && hl(!1)
  ), { pins: t, visible: n, minimised: Un, toggle: a };
}
const f4 = ["title"], h4 = {
  key: 0,
  class: "pins-count"
}, m4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = d4(() => t.pinRows);
    return (o, l) => N(n).length ? (c(), f("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: N(a), inline: e.inline }]),
      title: N(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...r) => N(s) && N(s)(...r), ["stop"]))
    }, [
      T(ye, {
        name: N(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      N(a) ? (c(), f("span", h4, v(N(n).length), 1)) : w("", !0)
    ], 10, f4)) : w("", !0);
  }
}, c_ = /* @__PURE__ */ V(m4, [["__scopeId", "data-v-d073c504"]]), p4 = ["title"], g4 = ["title"], v4 = { class: "diff-card-dir" }, y4 = { class: "diff-card-name" }, b4 = ["title"], k4 = ["title"], w4 = {
  key: 0,
  class: "diff-card-note"
}, $4 = ["href"], x4 = ["src", "alt"], S4 = { class: "diff-card-rows" }, _4 = { class: "diff-row-num" }, M4 = { class: "diff-row-sign" }, C4 = { class: "diff-row-code" }, E4 = {
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
    function o(k) {
      (k.metaKey || k.ctrlKey) && (k.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), d = R(() => n.path.slice(0, i.value)), u = R(() => n.path.slice(i.value)), h = R(() => n.change === "deleted"), m = R(() => l[n.change]), y = R(() => new Set(n.rows.filter((k) => k.line_type === "add").map((k) => k.line))), b = C("after"), S = R(() => b.value === "before" ? n.whole.old : n.whole.text), A = R(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((k, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: k })) : n.rows.filter(
      (k) => !(n.editsOnly && ["ctx", "fold"].includes(k.line_type)) && !(n.hideRemovals && k.line_type === "del")
    )), M = C(!1), q = R(() => n.lines && !M.value && !n.whole), U = R(() => q.value ? A.value.slice(0, n.lines) : A.value), P = R(() => A.value.length - U.value.length), L = (k) => k.line === null || k.line_type === "del" ? "" : k.line, W = (k) => k.line_type === "fold" ? k.hidden ? `⋯ ${k.hidden} lines` : "⋯" : k.text, O = C(null), I = C(null);
    let x = null;
    return Ee(() => {
      if (!I.value) return;
      let k = !0;
      x = new ResizeObserver(() => {
        !O.value || !I.value || (O.value.style.transition = k ? "none" : "", O.value.style.height = `${I.value.offsetHeight}px`, k = !1);
      }), x.observe(I.value);
    }), Be(() => x && x.disconnect()), (k, $) => (c(), f("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: $[2] || ($[2] = (g) => !h.value && a("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${N(s)}-click to open it`,
          onClick: o
        }, [
          p("span", v4, v(d.value), 1),
          p("span", y4, v(u.value), 1),
          m.value ? (c(), f("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(m.value), 3)) : w("", !0)
        ], 8, g4),
        p("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        p("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        T(Je, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = $e((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, b4)) : w("", !0),
        h.value ? w("", !0) : (c(), f("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = $e((g) => a("whole"), ["stop"]))
        }, [
          T(ye, {
            name: "file",
            size: 12
          })
        ], 10, k4))
      ], 8, p4),
      e.whole && e.whole.error ? (c(), f("p", w4, v(e.whole.error), 1)) : w("", !0),
      !h.value && !e.folded ? (c(), f(j, { key: 1 }, [
        e.picture ? (c(), f("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          p("img", {
            src: e.picture,
            alt: u.value,
            loading: "lazy"
          }, null, 8, x4)
        ], 8, $4)) : (c(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: I,
            class: "diff-card-diff"
          }, [
            p("div", S4, [
              (c(!0), f(j, null, te(U.value, (g, _) => (c(), f("div", {
                key: _,
                class: Y(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                p("span", _4, v(L(g)), 1),
                p("span", M4, v(r[g.line_type]), 1),
                p("span", C4, v(W(g)), 1)
              ], 2))), 128)),
              P.value > 0 ? (c(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = $e((g) => M.value = !0, ["stop"]))
              }, v(P.value) + " more " + v(P.value === 1 ? "line" : "lines"), 1)) : w("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : w("", !0)
    ], 2));
  }
}, u_ = /* @__PURE__ */ V(E4, [["__scopeId", "data-v-23581cbb"]]), A4 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), F(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: D(() => [
        T(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, O4 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, T4 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, I4 = { class: "ask-text" }, R4 = ["placeholder", "aria-label"], B4 = ["placeholder", "aria-label"], L4 = {
  key: 3,
  class: "moves"
}, N4 = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => ew(a.noun, a.row)), l = C(""), r = C(null), i = C(""), d = C("");
    pe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function u(y, b = "") {
      const S = await a.read([y.noun ?? a.noun, y.word, String(a.id), ...y.flag ? [y.flag, b] : y.positional ? [b] : [], ...y.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      l.value = S.ok ? "" : S.error, S.ok && (r.value = null, i.value = "", d.value = "", s("done"));
    }
    const h = (y) => y.confirm ? r.value = y : y.said ? u(y, y.said) : y.flag || y.positional ? (r.value = y, i.value = "") : u(y), m = () => i.value.trim() && u(r.value, i.value.trim());
    return t({ moves: o, press: h }), (y, b) => o.value.length ? (c(), F(jr, {
      key: 0,
      inline: e.inline
    }, {
      default: D(() => {
        var S;
        return [
          l.value ? (c(), f("p", O4, v(l.value), 1)) : w("", !0),
          (S = r.value) != null && S.confirm ? (c(), f("div", T4, [
            p("span", I4, v(r.value.confirm), 1),
            T(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Y({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: b[0] || (b[0] = (A) => u(r.value))
            }, {
              default: D(() => [
                ee(v(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            T(de, {
              small: "",
              variant: "ghost",
              onClick: b[1] || (b[1] = (A) => r.value = null)
            }, {
              default: D(() => [...b[7] || (b[7] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (c(), f("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: $e(m, ["prevent"])
          }, [
            qe(p("input", {
              "onUpdate:modelValue": b[2] || (b[2] = (A) => i.value = A),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: b[3] || (b[3] = qt($e((A) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, R4), [
              [_t, i.value]
            ]),
            r.value.opener ? qe((c(), f("input", {
              key: 0,
              "onUpdate:modelValue": b[4] || (b[4] = (A) => d.value = A),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: b[5] || (b[5] = qt($e((A) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, B4)), [
              [_t, d.value]
            ]) : w("", !0),
            T(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: D(() => [
                ee(v(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            T(de, {
              small: "",
              variant: "ghost",
              onClick: b[6] || (b[6] = (A) => r.value = null)
            }, {
              default: D(() => [...b[8] || (b[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), f("div", L4, [
            (c(!0), f(j, null, te(o.value, (A) => (c(), F(de, {
              key: A.word,
              small: !A.bordered,
              bordered: A.bordered,
              icon: A.icon,
              variant: A.main ? "primary" : "ghost",
              class: Y({ danger: A.danger }),
              "data-move": A.word,
              onClick: (M) => h(A)
            }, {
              default: D(() => [
                ee(v(A.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : w("", !0);
  }
}, D4 = /* @__PURE__ */ V(N4, [["__scopeId", "data-v-bdac0207"]]), q4 = { class: "facts" }, P4 = { class: "fact wide" }, j4 = ["title"], F4 = {
  key: 1,
  class: "fact-value"
}, W4 = {
  key: 0,
  class: "fact"
}, H4 = { class: "fact-value" }, U4 = { class: "fact" }, z4 = { class: "fact-label" }, V4 = ["title"], G4 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, K4 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Y4 = {
  key: 2,
  class: "fact"
}, J4 = { class: "fact-value" }, Q4 = { class: "fact wide" }, X4 = { class: "fact wide" }, Z4 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, ex = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Qn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, d;
      return c(), f("div", q4, [
        p("div", P4, [
          r[4] || (r[4] = p("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (u) => N(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, j4)) : (c(), f("span", F4, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (c(), f("div", W4, [
          r[5] || (r[5] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", H4, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (c(), f(j, { key: 1 }, [
          p("div", U4, [
            p("span", z4, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            p("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (u) => N(Ne)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, V4)
          ]),
          N(o).has(e.task.state) ? (c(), f("p", G4, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), f("p", K4, v(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), f("div", Y4, [
          r[6] || (r[6] = p("span", { class: "fact-label" }, "Assigned to", -1)),
          p("span", J4, "Agent " + v(e.task.holder_id), 1)
        ])) : w("", !0),
        p("div", Q4, [
          r[7] || (r[7] = p("span", { class: "fact-label" }, "Complexity", -1)),
          T(Pt, {
            options: N(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (u) => s("complexity", u))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = p("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        p("div", X4, [
          r[9] || (r[9] = p("span", { class: "fact-label" }, "Priority", -1)),
          T(Pt, {
            options: N(n),
            value: String(N(Pr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), f("p", Z4, v(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, tx = /* @__PURE__ */ V(ex, [["__scopeId", "data-v-81d598cf"]]);
function nx(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, d]) => d === i).map(([d]) => d), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((d) => !s.has(d)))
    i.forEach((d) => s.add(d)), o.push(i.map((d) => n.get(d)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([d]) => d === e); i && !r.has(i[1]); i = t.edges.find(([d]) => d === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const ax = { class: "number" }, sx = { class: "title" }, ox = { class: "word" }, lx = {
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
    return (a, s) => (c(), F(gt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: D(() => [
        T(vn, { status: e.status }, null, 8, ["status"]),
        p("span", ax, v(e.number), 1),
        p("span", sx, v(e.title), 1),
        p("span", ox, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Xa = /* @__PURE__ */ V(lx, [["__scopeId", "data-v-f6417ae8"]]), rx = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, ix = { class: "level" }, cx = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = R(() => nx(n.task.id, n.graph)), l = R(() => s.value ? o.value.above : o.value.above.slice(-1)), r = R(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = R(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), d = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), u = (h, m = !1) => ({ status: ln(h.state), number: h.id, title: h.title, word: m ? "This task" : d(h.state), current: m });
    return (h, m) => o.value.above.length || o.value.below.length ? (c(), f("section", rx, [
      m[5] || (m[5] = p("h4", null, "What waits on what", -1)),
      (c(!0), f(j, null, te(l.value, (y) => (c(), f(j, {
        key: y.map((b) => b.id).join()
      }, [
        p("div", ix, [
          (c(!0), f(j, null, te(y, (b) => (c(), F(Xa, De({
            key: b.id,
            ref_for: !0
          }, u(b), {
            onSelect: m[0] || (m[0] = (S) => a("select", S))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = p("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      T(Xa, Vi(Gi(u(e.task, !0))), null, 16),
      (c(!0), f(j, null, te(r.value, (y) => (c(), f(j, {
        key: y.id
      }, [
        m[4] || (m[4] = p("div", { class: "waits" }, "↓ waits on", -1)),
        T(Xa, De({ ref_for: !0 }, u(y), {
          onSelect: m[1] || (m[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : w("", !0)
    ])) : w("", !0);
  }
}, ux = /* @__PURE__ */ V(cx, [["__scopeId", "data-v-db05c4b2"]]), dx = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, fx = ["datetime"], hx = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), f("section", dx, [
      n[0] || (n[0] = p("h3", null, "Block history", -1)),
      (c(!0), f(j, null, te(e.renewals, (a) => (c(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        p("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, fx),
        p("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, mx = /* @__PURE__ */ V(hx, [["__scopeId", "data-v-b41f213b"]]), px = {
  class: "part",
  "data-resource-waits": ""
}, gx = ["onClick"], vx = { class: "wait-id" }, yx = { class: "wait-title" }, bx = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), f("section", px, [
      p("h4", null, v(e.title), 1),
      (c(!0), f(j, null, te(e.waits, (o) => (c(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        T(vn, {
          status: N(ln)(o.state),
          size: 12
        }, null, 8, ["status"]),
        p("span", vx, v(o.id), 1),
        p("span", yx, v(o.title), 1)
      ], 8, gx))), 128))
    ]));
  }
}, ml = /* @__PURE__ */ V(bx, [["__scopeId", "data-v-8fb2e251"]]), kx = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, wx = { class: "text" }, $x = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, xx = 180, Sx = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = C(!1), l = R(() => a.task.waits.filter((i) => !n.has(i.state))), r = R(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, d) => (c(), f(j, null, [
      l.value.length ? (c(), F(ml, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: d[0] || (d[0] = (u) => s("select", u))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), f("section", kx, [
        d[3] || (d[3] = p("h4", null, "How it was done", -1)),
        p("p", wx, v(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (c(), f("section", $x, [
        d[4] || (d[4] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > xx && !o.value ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: d[1] || (d[1] = (u) => o.value = !0)
        }, "Show the whole brief")) : w("", !0)
      ])) : w("", !0),
      r.value.length ? (c(), F(ml, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: d[2] || (d[2] = (u) => s("select", u))
      }, null, 8, ["waits"])) : w("", !0)
    ], 64));
  }
}, _x = /* @__PURE__ */ V(Sx, [["__scopeId", "data-v-4a3f1e79"]]), Mx = {
  class: "task-details",
  "data-task-details": ""
}, Cx = { class: "since" }, Ex = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Ax = { class: "text" }, Ox = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Tx = {
  key: 1,
  class: "note"
}, Ix = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Rx = { class: "text" }, Bx = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), f("div", Mx, [
        p("div", {
          class: Y(["state-line", N(ln)(e.task.state)])
        }, [
          p("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            T(vn, {
              status: N(ln)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + v(a(e.task.state)), 1)
          ]),
          p("span", Cx, [
            o[5] || (o[5] = ee(" since ", -1)),
            T(Je, {
              at: N(fr)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), f("section", Ex, [
          o[6] || (o[6] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
          p("p", Ax, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), f("p", Ox, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (c(), f("p", Tx, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), f("section", Ix, [
          o[7] || (o[7] = p("span", { class: "label" }, "Why it was cancelled", -1)),
          p("p", Rx, v(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (c(), F(ux, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : w("", !0),
        T(tx, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        T(_x, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        T(mx, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Lx = /* @__PURE__ */ V(Bx, [["__scopeId", "data-v-7e73fa21"]]), Nx = 50, Dx = { messages: 25 }, qx = (e) => Dx[e] || Nx, Px = {
  class: "task-log",
  "aria-label": "Task log"
}, jx = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Fx = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Wx = { class: "entries" }, Hx = ["data-task-log-important"], Ux = ["datetime"], zx = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Vx = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = C([]), a = C(1), s = C(!0), o = C(!0), l = C("");
    let r = 0;
    async function i(d = 1) {
      const u = ++r;
      a.value = d, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(qx("task_logs")),
        "--page",
        String(d)
      ]);
      u === r && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), Qe(() => {
      r += 1;
    }), (d, u) => (c(), f("section", Px, [
      o.value ? (c(), F(Ze, { key: 0 })) : l.value ? (c(), f(j, { key: 1 }, [
        p("p", jx, v(l.value), 1),
        T(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: u[0] || (u[0] = (h) => i(a.value))
        }, {
          default: D(() => [...u[3] || (u[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), f(j, { key: 2 }, [
        n.value.length ? w("", !0) : (c(), f("p", Fx, "No log entries yet.")),
        p("ol", Wx, [
          (c(!0), f(j, null, te(n.value, (h) => (c(), f("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            p("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, Ux),
            p("p", null, v(h.line), 1)
          ], 10, Hx))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), f("nav", zx, [
          T(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: u[1] || (u[1] = (h) => i(a.value - 1))
          }, {
            default: D(() => [...u[4] || (u[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          p("span", null, "Page " + v(a.value), 1),
          T(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: u[2] || (u[2] = (h) => i(a.value + 1))
          }, {
            default: D(() => [...u[5] || (u[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : w("", !0)
      ], 64))
    ]));
  }
}, Gx = /* @__PURE__ */ V(Vx, [["__scopeId", "data-v-cfa43bf1"]]), Kx = {
  class: "task-tags",
  "aria-label": "Task tags"
}, Yx = { class: "tags" }, Jx = ["aria-label", "data-remove-tag", "onClick"], Qx = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = C("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), f("section", Kx, [
      p("div", Yx, [
        (c(!0), f(j, null, te(e.tags, (r) => (c(), f("span", {
          key: r,
          class: "tag",
          "data-task-tag": ""
        }, [
          ee(v(r) + " ", 1),
          p("button", {
            type: "button",
            "aria-label": `Remove tag ${r}`,
            "data-remove-tag": r,
            onClick: (i) => n("remove", r)
          }, "×", 8, Jx)
        ]))), 128))
      ]),
      p("form", {
        class: "add-tag",
        onSubmit: $e(s, ["prevent"])
      }, [
        qe(p("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (r) => a.value = r),
          "aria-label": "New tag",
          placeholder: "New tag",
          pattern: "[a-z0-9-]+",
          "data-task-tag-input": ""
        }, null, 512), [
          [_t, a.value]
        ]),
        T(de, {
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
}, Xx = /* @__PURE__ */ V(Qx, [["__scopeId", "data-v-1d720cf2"]]), Zx = { class: "comment-side-head" }, e8 = {
  key: 0,
  class: "comment-none"
}, t8 = { key: 0 }, n8 = {
  key: 1,
  class: "comment-none"
}, a8 = {
  class: "comment",
  "data-comment": ""
}, s8 = {
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
    return (t, n) => (c(), f("aside", {
      class: Y(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", Zx, [
        n[2] || (n[2] = p("h3", null, "Comments", -1)),
        T(ua, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), f("p", e8, "No comments yet")) : w("", !0),
      (c(!0), f(j, null, te(e.comments, (a) => (c(), f("section", {
        key: a.id
      }, [
        a.quote ? (c(), f("blockquote", t8, v(a.quote), 1)) : w("", !0),
        a.revision ? (c(), f("span", n8, "Revision " + v(a.revision), 1)) : w("", !0),
        p("p", a8, v(e.words(a)), 1)
      ]))), 128)),
      T(mn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, o8 = /* @__PURE__ */ V(s8, [["__scopeId", "data-v-276284a3"]]), l8 = ["placeholder"], r8 = { class: "actions" }, i8 = { class: "error" }, c8 = {
  key: 1,
  class: "card closed"
}, u8 = { class: "mark" }, d8 = { class: "prompt" }, f8 = {
  key: 0,
  class: "draft"
}, h8 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Dt({
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
  emits: /* @__PURE__ */ Dt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = an(e, "draft"), l = an(e, "error"), r = C(!!l.value), i = C(!1), d = C(!1), u = C(null);
    async function h() {
      var b, S;
      r.value = !0, i.value = !1, await Xe(), (S = ((b = u.value) == null ? void 0 : b.querySelector("input")) || u.value) == null || S.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || d.value)) {
        l.value = "", d.value = !0, o.value = "";
        try {
          await a.send(b), r.value = !1, i.value = !0;
        } catch (S) {
          o.value = b, l.value = S.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, S) => (c(), f("div", {
      class: Y(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: qt(m, ["esc"])
      }, [
        me(b.$slots, "who", {}, void 0, !0),
        qe(p("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": S[0] || (S[0] = (A) => o.value = A),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: S[1] || (S[1] = qt((A) => N(Mr)(A, y), ["enter"]))
        }, null, 40, l8), [
          [_t, o.value]
        ]),
        p("div", r8, [
          p("span", i8, v(l.value), 1),
          T(de, {
            small: "",
            onClick: m
          }, {
            default: D(() => [...S[3] || (S[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          T(de, {
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
      ], 32)) : (c(), f("div", c8, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          p("span", u8, [
            T(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", d8, v(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), f("span", f8, "Draft kept")) : w("", !0)
        ]),
        e.count ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: S[2] || (S[2] = (A) => s("show"))
        }, [
          p("span", null, v(N(Wu)(e.count, "comment")), 1),
          T(ye, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, m8 = /* @__PURE__ */ V(h8, [["__scopeId", "data-v-b68baddd"]]), p8 = { class: "top" }, g8 = {
  class: "crumb",
  "data-task-crumb": ""
}, v8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, y8 = {
  key: 1,
  class: "body"
}, b8 = { class: "summary" }, k8 = { class: "stamp" }, w8 = {
  class: "title",
  "data-resource-title": ""
}, $8 = {
  class: "tabs",
  "data-task-tabs": ""
}, x8 = { class: "panels" }, S8 = {
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
    const a = e, s = n, o = C(null), l = C(null), r = C(null), i = C(""), d = C(""), u = C(null), h = C(null), m = C("details"), y = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], b = Rr(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (W) => a.read(W)
    );
    let S = 0;
    const A = R(() => {
      var W;
      return (W = l.value) != null && W.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function M() {
      const W = ++S, [O, I, x] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      W === S && (i.value = O.ok ? "" : O.error, o.value = O.ok ? O.value : null, l.value = I.ok ? I.value : null, r.value = x.ok ? x.value : null);
    }
    pe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, u.value = null, m.value = "details", M();
      },
      { immediate: !0 }
    ), pe(() => a.changes, M), pe(b.open, (W) => {
      W && (m.value = "comments");
    });
    async function q(W, O) {
      const I = o.value[W];
      o.value[W] = Number(O);
      const x = await a.read(["task", "edit", String(a.id), `--${W}`, O]);
      if (d.value = x.ok ? "" : x.error, x.ok) return M();
      o.value[W] = I;
    }
    async function U(W, O) {
      const I = await a.read(["task", W, String(a.id), O]);
      d.value = I.ok ? "" : I.error, I.ok && await M();
    }
    function P(W) {
      u.value = null, h.value.press(W);
    }
    const L = (W) => {
      var O;
      return ((O = h.value) == null ? void 0 : O.moves.length) && (u.value = W);
    };
    return t({ openStatus: L }), (W, O) => (c(), f("aside", {
      class: Y(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", p8, [
        e.backed ? (c(), F(A4, {
          key: 0,
          onBack: O[0] || (O[0] = (I) => s("back"))
        })) : w("", !0),
        p("span", g8, v(A.value), 1),
        O[14] || (O[14] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), f(j, { key: 1 }, [
          T(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: O[1] || (O[1] = (I) => s("step", -1))
          }, {
            default: D(() => [
              T(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          T(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: O[2] || (O[2] = (I) => s("step", 1))
          }, {
            default: D(() => [
              T(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : w("", !0),
        T(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: O[3] || (O[3] = (I) => s("close"))
        }, {
          default: D(() => [
            T(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), f("p", v8, v(i.value), 1)) : o.value ? (c(), f(j, { key: 2 }, [
        T(D4, {
          ref_key: "actions",
          ref: h,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: M
        }, null, 8, ["id", "row", "read"]),
        p("header", b8, [
          p("div", k8, [
            ee(" Task " + v(o.value.id) + " · updated ", 1),
            T(Je, {
              at: N(fr)(o.value)
            }, null, 8, ["at"])
          ]),
          p("h3", w8, v(o.value.title), 1),
          T(Xx, {
            tags: o.value.tags,
            onAdd: O[4] || (O[4] = (I) => U("tag", I)),
            onRemove: O[5] || (O[5] = (I) => U("untag", I))
          }, null, 8, ["tags"])
        ]),
        p("div", $8, [
          T(Pt, {
            options: y,
            value: m.value,
            onPick: O[6] || (O[6] = (I) => m.value = I)
          }, null, 8, ["value"])
        ]),
        p("div", x8, [
          T(Ut, { value: m.value }, {
            details: D(() => [
              T(Lx, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: d.value,
                onStatus: L,
                onPriority: O[7] || (O[7] = (I) => q("priority", I)),
                onComplexity: O[8] || (O[8] = (I) => q("complexity", I)),
                onSelect: O[9] || (O[9] = (I) => s("select", I))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              T(Ir, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              T(ju, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: O[10] || (O[10] = (I) => s("select", I))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: D(() => [
              T(o8, {
                below: "",
                comments: N(b).comments.value,
                words: N(b).words,
                more: !!N(b).nextPage.value,
                loading: N(b).loading.value,
                failure: N(b).failure.value,
                onMore: N(b).loadMore,
                onClose: O[11] || (O[11] = (I) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: D(() => [
              T(Gx, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        T(m8, {
          send: N(b).send,
          count: N(b).total.value,
          onShow: O[12] || (O[12] = (I) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), f("div", y8, [
        T(Ze)
      ])),
      u.value ? (c(), F(ia, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: O[13] || (O[13] = (I) => u.value = null)
      }, {
        default: D(() => [
          T(ws, null, {
            default: D(() => [
              ee("Change the status of task " + v(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), f(j, null, te(h.value.moves, (I) => (c(), F(Mt, {
            key: I.word,
            onClick: (x) => P(I)
          }, {
            default: D(() => [
              ee(v(I.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : w("", !0)
    ], 2));
  }
}, d_ = /* @__PURE__ */ V(S8, [["__scopeId", "data-v-d8c2872e"]]);
function _8(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Za = { exports: {} }, pl;
function M8() {
  return pl || (pl = 1, (function(e, t) {
    var n = (function() {
      var a = function(L, W) {
        var O = 236, I = 17, x = L, k = o[W], $ = null, g = 0, _ = null, E = [], B = {}, H = function(G, K) {
          g = x * 4 + 17, $ = (function(z) {
            for (var J = new Array(z), Q = 0; Q < z; Q += 1) {
              J[Q] = new Array(z);
              for (var ne = 0; ne < z; ne += 1)
                J[Q][ne] = null;
            }
            return J;
          })(g), X(0, 0), X(g - 7, 0), X(0, g - 7), ge(), ie(), fe(G, K), x >= 7 && Ae(G), _ == null && (_ = oe(x, k, E)), Z(_, K);
        }, X = function(G, K) {
          for (var z = -1; z <= 7; z += 1)
            if (!(G + z <= -1 || g <= G + z))
              for (var J = -1; J <= 7; J += 1)
                K + J <= -1 || g <= K + J || (0 <= z && z <= 6 && (J == 0 || J == 6) || 0 <= J && J <= 6 && (z == 0 || z == 6) || 2 <= z && z <= 4 && 2 <= J && J <= 4 ? $[G + z][K + J] = !0 : $[G + z][K + J] = !1);
        }, se = function() {
          for (var G = 0, K = 0, z = 0; z < 8; z += 1) {
            H(!0, z);
            var J = r.getLostPoint(B);
            (z == 0 || G > J) && (G = J, K = z);
          }
          return K;
        }, ie = function() {
          for (var G = 8; G < g - 8; G += 1)
            $[G][6] == null && ($[G][6] = G % 2 == 0);
          for (var K = 8; K < g - 8; K += 1)
            $[6][K] == null && ($[6][K] = K % 2 == 0);
        }, ge = function() {
          for (var G = r.getPatternPosition(x), K = 0; K < G.length; K += 1)
            for (var z = 0; z < G.length; z += 1) {
              var J = G[K], Q = G[z];
              if ($[J][Q] == null)
                for (var ne = -2; ne <= 2; ne += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    ne == -2 || ne == 2 || ce == -2 || ce == 2 || ne == 0 && ce == 0 ? $[J + ne][Q + ce] = !0 : $[J + ne][Q + ce] = !1;
            }
        }, Ae = function(G) {
          for (var K = r.getBCHTypeNumber(x), z = 0; z < 18; z += 1) {
            var J = !G && (K >> z & 1) == 1;
            $[Math.floor(z / 3)][z % 3 + g - 8 - 3] = J;
          }
          for (var z = 0; z < 18; z += 1) {
            var J = !G && (K >> z & 1) == 1;
            $[z % 3 + g - 8 - 3][Math.floor(z / 3)] = J;
          }
        }, fe = function(G, K) {
          for (var z = k << 3 | K, J = r.getBCHTypeInfo(z), Q = 0; Q < 15; Q += 1) {
            var ne = !G && (J >> Q & 1) == 1;
            Q < 6 ? $[Q][8] = ne : Q < 8 ? $[Q + 1][8] = ne : $[g - 15 + Q][8] = ne;
          }
          for (var Q = 0; Q < 15; Q += 1) {
            var ne = !G && (J >> Q & 1) == 1;
            Q < 8 ? $[8][g - Q - 1] = ne : Q < 9 ? $[8][15 - Q - 1 + 1] = ne : $[8][15 - Q - 1] = ne;
          }
          $[g - 8][8] = !G;
        }, Z = function(G, K) {
          for (var z = -1, J = g - 1, Q = 7, ne = 0, ce = r.getMaskFunction(K), re = g - 1; re > 0; re -= 2)
            for (re == 6 && (re -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if ($[J][re - xe] == null) {
                  var Me = !1;
                  ne < G.length && (Me = (G[ne] >>> Q & 1) == 1);
                  var he = ce(J, re - xe);
                  he && (Me = !Me), $[J][re - xe] = Me, Q -= 1, Q == -1 && (ne += 1, Q = 7);
                }
              if (J += z, J < 0 || g <= J) {
                J -= z, z = -z;
                break;
              }
            }
        }, ae = function(G, K) {
          for (var z = 0, J = 0, Q = 0, ne = new Array(K.length), ce = new Array(K.length), re = 0; re < K.length; re += 1) {
            var xe = K[re].dataCount, Me = K[re].totalCount - xe;
            J = Math.max(J, xe), Q = Math.max(Q, Me), ne[re] = new Array(xe);
            for (var he = 0; he < ne[re].length; he += 1)
              ne[re][he] = 255 & G.getBuffer()[he + z];
            z += xe;
            var je = r.getErrorCorrectPolynomial(Me), Fe = d(ne[re], je.getLength() - 1), Xs = Fe.mod(je);
            ce[re] = new Array(je.getLength() - 1);
            for (var he = 0; he < ce[re].length; he += 1) {
              var Zs = he + Xs.getLength() - ce[re].length;
              ce[re][he] = Zs >= 0 ? Xs.getAt(Zs) : 0;
            }
          }
          for (var eo = 0, he = 0; he < K.length; he += 1)
            eo += K[he].totalCount;
          for (var ba = new Array(eo), xn = 0, he = 0; he < J; he += 1)
            for (var re = 0; re < K.length; re += 1)
              he < ne[re].length && (ba[xn] = ne[re][he], xn += 1);
          for (var he = 0; he < Q; he += 1)
            for (var re = 0; re < K.length; re += 1)
              he < ce[re].length && (ba[xn] = ce[re][he], xn += 1);
          return ba;
        }, oe = function(G, K, z) {
          for (var J = u.getRSBlocks(G, K), Q = h(), ne = 0; ne < z.length; ne += 1) {
            var ce = z[ne];
            Q.put(ce.getMode(), 4), Q.put(ce.getLength(), r.getLengthInBits(ce.getMode(), G)), ce.write(Q);
          }
          for (var re = 0, ne = 0; ne < J.length; ne += 1)
            re += J[ne].dataCount;
          if (Q.getLengthInBits() > re * 8)
            throw "code length overflow. (" + Q.getLengthInBits() + ">" + re * 8 + ")";
          for (Q.getLengthInBits() + 4 <= re * 8 && Q.put(0, 4); Q.getLengthInBits() % 8 != 0; )
            Q.putBit(!1);
          for (; !(Q.getLengthInBits() >= re * 8 || (Q.put(O, 8), Q.getLengthInBits() >= re * 8)); )
            Q.put(I, 8);
          return ae(Q, J);
        };
        B.addData = function(G, K) {
          K = K || "Byte";
          var z = null;
          switch (K) {
            case "Numeric":
              z = m(G);
              break;
            case "Alphanumeric":
              z = y(G);
              break;
            case "Byte":
              z = b(G);
              break;
            case "Kanji":
              z = S(G);
              break;
            default:
              throw "mode:" + K;
          }
          E.push(z), _ = null;
        }, B.isDark = function(G, K) {
          if (G < 0 || g <= G || K < 0 || g <= K)
            throw G + "," + K;
          return $[G][K];
        }, B.getModuleCount = function() {
          return g;
        }, B.make = function() {
          if (x < 1) {
            for (var G = 1; G < 40; G++) {
              for (var K = u.getRSBlocks(G, k), z = h(), J = 0; J < E.length; J++) {
                var Q = E[J];
                z.put(Q.getMode(), 4), z.put(Q.getLength(), r.getLengthInBits(Q.getMode(), G)), Q.write(z);
              }
              for (var ne = 0, J = 0; J < K.length; J++)
                ne += K[J].dataCount;
              if (z.getLengthInBits() <= ne * 8)
                break;
            }
            x = G;
          }
          H(!1, se());
        }, B.createTableTag = function(G, K) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var z = "";
          z += '<table style="', z += " border-width: 0px; border-style: none;", z += " border-collapse: collapse;", z += " padding: 0px; margin: " + K + "px;", z += '">', z += "<tbody>";
          for (var J = 0; J < B.getModuleCount(); J += 1) {
            z += "<tr>";
            for (var Q = 0; Q < B.getModuleCount(); Q += 1)
              z += '<td style="', z += " border-width: 0px; border-style: none;", z += " border-collapse: collapse;", z += " padding: 0px; margin: 0px;", z += " width: " + G + "px;", z += " height: " + G + "px;", z += " background-color: ", z += B.isDark(J, Q) ? "#000000" : "#ffffff", z += ";", z += '"/>';
            z += "</tr>";
          }
          return z += "</tbody>", z += "</table>", z;
        }, B.createSvgTag = function(G, K, z, J) {
          var Q = {};
          typeof arguments[0] == "object" && (Q = arguments[0], G = Q.cellSize, K = Q.margin, z = Q.alt, J = Q.title), G = G || 2, K = typeof K > "u" ? G * 4 : K, z = typeof z == "string" ? { text: z } : z || {}, z.text = z.text || null, z.id = z.text ? z.id || "qrcode-description" : null, J = typeof J == "string" ? { text: J } : J || {}, J.text = J.text || null, J.id = J.text ? J.id || "qrcode-title" : null;
          var ne = B.getModuleCount() * G + K * 2, ce, re, xe, Me, he = "", je;
          for (je = "l" + G + ",0 0," + G + " -" + G + ",0 0,-" + G + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += Q.scalable ? "" : ' width="' + ne + 'px" height="' + ne + 'px"', he += ' viewBox="0 0 ' + ne + " " + ne + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += J.text || z.text ? ' role="img" aria-labelledby="' + et([J.id, z.id].join(" ").trim()) + '"' : "", he += ">", he += J.text ? '<title id="' + et(J.id) + '">' + et(J.text) + "</title>" : "", he += z.text ? '<description id="' + et(z.id) + '">' + et(z.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', xe = 0; xe < B.getModuleCount(); xe += 1)
            for (Me = xe * G + K, ce = 0; ce < B.getModuleCount(); ce += 1)
              B.isDark(xe, ce) && (re = ce * G + K, he += "M" + re + "," + Me + je);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, B.createDataURL = function(G, K) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var z = B.getModuleCount() * G + K * 2, J = K, Q = z - K;
          return P(z, z, function(ne, ce) {
            if (J <= ne && ne < Q && J <= ce && ce < Q) {
              var re = Math.floor((ne - J) / G), xe = Math.floor((ce - J) / G);
              return B.isDark(xe, re) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(G, K, z) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var J = B.getModuleCount() * G + K * 2, Q = "";
          return Q += "<img", Q += ' src="', Q += B.createDataURL(G, K), Q += '"', Q += ' width="', Q += J, Q += '"', Q += ' height="', Q += J, Q += '"', z && (Q += ' alt="', Q += et(z), Q += '"'), Q += "/>", Q;
        };
        var et = function(G) {
          for (var K = "", z = 0; z < G.length; z += 1) {
            var J = G.charAt(z);
            switch (J) {
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
                K += J;
                break;
            }
          }
          return K;
        }, Ri = function(G) {
          var K = 1;
          G = typeof G > "u" ? K * 2 : G;
          var z = B.getModuleCount() * K + G * 2, J = G, Q = z - G, ne, ce, re, xe, Me, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, je = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Fe = "";
          for (ne = 0; ne < z; ne += 2) {
            for (re = Math.floor((ne - J) / K), xe = Math.floor((ne + 1 - J) / K), ce = 0; ce < z; ce += 1)
              Me = "█", J <= ce && ce < Q && J <= ne && ne < Q && B.isDark(re, Math.floor((ce - J) / K)) && (Me = " "), J <= ce && ce < Q && J <= ne + 1 && ne + 1 < Q && B.isDark(xe, Math.floor((ce - J) / K)) ? Me += " " : Me += "█", Fe += G < 1 && ne + 1 >= Q ? je[Me] : he[Me];
            Fe += `
`;
          }
          return z % 2 && G > 0 ? Fe.substring(0, Fe.length - z - 1) + Array(z + 1).join("▀") : Fe.substring(0, Fe.length - 1);
        };
        return B.createASCII = function(G, K) {
          if (G = G || 1, G < 2)
            return Ri(K);
          G -= 1, K = typeof K > "u" ? G * 2 : K;
          var z = B.getModuleCount() * G + K * 2, J = K, Q = z - K, ne, ce, re, xe, Me = Array(G + 1).join("██"), he = Array(G + 1).join("  "), je = "", Fe = "";
          for (ne = 0; ne < z; ne += 1) {
            for (re = Math.floor((ne - J) / G), Fe = "", ce = 0; ce < z; ce += 1)
              xe = 1, J <= ce && ce < Q && J <= ne && ne < Q && B.isDark(re, Math.floor((ce - J) / G)) && (xe = 0), Fe += xe ? Me : he;
            for (re = 0; re < G; re += 1)
              je += Fe + `
`;
          }
          return je.substring(0, je.length - 1);
        }, B.renderTo2dContext = function(G, K) {
          K = K || 2;
          for (var z = B.getModuleCount(), J = 0; J < z; J++)
            for (var Q = 0; Q < z; Q++)
              G.fillStyle = B.isDark(J, Q) ? "black" : "white", G.fillRect(J * K, Q * K, K, K);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(L) {
          for (var W = [], O = 0; O < L.length; O += 1) {
            var I = L.charCodeAt(O);
            W.push(I & 255);
          }
          return W;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(L, W) {
        var O = (function() {
          for (var x = q(L), k = function() {
            var ie = x.read();
            if (ie == -1) throw "eof";
            return ie;
          }, $ = 0, g = {}; ; ) {
            var _ = x.read();
            if (_ == -1) break;
            var E = k(), B = k(), H = k(), X = String.fromCharCode(_ << 8 | E), se = B << 8 | H;
            g[X] = se, $ += 1;
          }
          if ($ != W)
            throw $ + " != " + W;
          return g;
        })(), I = 63;
        return function(x) {
          for (var k = [], $ = 0; $ < x.length; $ += 1) {
            var g = x.charCodeAt($);
            if (g < 128)
              k.push(g);
            else {
              var _ = O[x.charAt($)];
              typeof _ == "number" ? (_ & 255) == _ ? k.push(_) : (k.push(_ >>> 8), k.push(_ & 255)) : k.push(I);
            }
          }
          return k;
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
        ], W = 1335, O = 7973, I = 21522, x = {}, k = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return x.getBCHTypeInfo = function($) {
          for (var g = $ << 10; k(g) - k(W) >= 0; )
            g ^= W << k(g) - k(W);
          return ($ << 10 | g) ^ I;
        }, x.getBCHTypeNumber = function($) {
          for (var g = $ << 12; k(g) - k(O) >= 0; )
            g ^= O << k(g) - k(O);
          return $ << 12 | g;
        }, x.getPatternPosition = function($) {
          return L[$ - 1];
        }, x.getMaskFunction = function($) {
          switch ($) {
            case l.PATTERN000:
              return function(g, _) {
                return (g + _) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, _) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, _) {
                return _ % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, _) {
                return (g + _) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, _) {
                return (Math.floor(g / 2) + Math.floor(_ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, _) {
                return g * _ % 2 + g * _ % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, _) {
                return (g * _ % 2 + g * _ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, _) {
                return (g * _ % 3 + (g + _) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + $;
          }
        }, x.getErrorCorrectPolynomial = function($) {
          for (var g = d([1], 0), _ = 0; _ < $; _ += 1)
            g = g.multiply(d([1, i.gexp(_)], 0));
          return g;
        }, x.getLengthInBits = function($, g) {
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
        }, x.getLostPoint = function($) {
          for (var g = $.getModuleCount(), _ = 0, E = 0; E < g; E += 1)
            for (var B = 0; B < g; B += 1) {
              for (var H = 0, X = $.isDark(E, B), se = -1; se <= 1; se += 1)
                if (!(E + se < 0 || g <= E + se))
                  for (var ie = -1; ie <= 1; ie += 1)
                    B + ie < 0 || g <= B + ie || se == 0 && ie == 0 || X == $.isDark(E + se, B + ie) && (H += 1);
              H > 5 && (_ += 3 + H - 5);
            }
          for (var E = 0; E < g - 1; E += 1)
            for (var B = 0; B < g - 1; B += 1) {
              var ge = 0;
              $.isDark(E, B) && (ge += 1), $.isDark(E + 1, B) && (ge += 1), $.isDark(E, B + 1) && (ge += 1), $.isDark(E + 1, B + 1) && (ge += 1), (ge == 0 || ge == 4) && (_ += 3);
            }
          for (var E = 0; E < g; E += 1)
            for (var B = 0; B < g - 6; B += 1)
              $.isDark(E, B) && !$.isDark(E, B + 1) && $.isDark(E, B + 2) && $.isDark(E, B + 3) && $.isDark(E, B + 4) && !$.isDark(E, B + 5) && $.isDark(E, B + 6) && (_ += 40);
          for (var B = 0; B < g; B += 1)
            for (var E = 0; E < g - 6; E += 1)
              $.isDark(E, B) && !$.isDark(E + 1, B) && $.isDark(E + 2, B) && $.isDark(E + 3, B) && $.isDark(E + 4, B) && !$.isDark(E + 5, B) && $.isDark(E + 6, B) && (_ += 40);
          for (var Ae = 0, B = 0; B < g; B += 1)
            for (var E = 0; E < g; E += 1)
              $.isDark(E, B) && (Ae += 1);
          var fe = Math.abs(100 * Ae / g / g - 50) / 5;
          return _ += fe * 10, _;
        }, x;
      })(), i = (function() {
        for (var L = new Array(256), W = new Array(256), O = 0; O < 8; O += 1)
          L[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          L[O] = L[O - 4] ^ L[O - 5] ^ L[O - 6] ^ L[O - 8];
        for (var O = 0; O < 255; O += 1)
          W[L[O]] = O;
        var I = {};
        return I.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return W[x];
        }, I.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return L[x];
        }, I;
      })();
      function d(L, W) {
        if (typeof L.length > "u")
          throw L.length + "/" + W;
        var O = (function() {
          for (var x = 0; x < L.length && L[x] == 0; )
            x += 1;
          for (var k = new Array(L.length - x + W), $ = 0; $ < L.length - x; $ += 1)
            k[$] = L[$ + x];
          return k;
        })(), I = {};
        return I.getAt = function(x) {
          return O[x];
        }, I.getLength = function() {
          return O.length;
        }, I.multiply = function(x) {
          for (var k = new Array(I.getLength() + x.getLength() - 1), $ = 0; $ < I.getLength(); $ += 1)
            for (var g = 0; g < x.getLength(); g += 1)
              k[$ + g] ^= i.gexp(i.glog(I.getAt($)) + i.glog(x.getAt(g)));
          return d(k, 0);
        }, I.mod = function(x) {
          if (I.getLength() - x.getLength() < 0)
            return I;
          for (var k = i.glog(I.getAt(0)) - i.glog(x.getAt(0)), $ = new Array(I.getLength()), g = 0; g < I.getLength(); g += 1)
            $[g] = I.getAt(g);
          for (var g = 0; g < x.getLength(); g += 1)
            $[g] ^= i.gexp(i.glog(x.getAt(g)) + k);
          return d($, 0).mod(x);
        }, I;
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
        ], W = function(x, k) {
          var $ = {};
          return $.totalCount = x, $.dataCount = k, $;
        }, O = {}, I = function(x, k) {
          switch (k) {
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
        return O.getRSBlocks = function(x, k) {
          var $ = I(x, k);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + k;
          for (var g = $.length / 3, _ = [], E = 0; E < g; E += 1)
            for (var B = $[E * 3 + 0], H = $[E * 3 + 1], X = $[E * 3 + 2], se = 0; se < B; se += 1)
              _.push(W(H, X));
          return _;
        }, O;
      })(), h = function() {
        var L = [], W = 0, O = {};
        return O.getBuffer = function() {
          return L;
        }, O.getAt = function(I) {
          var x = Math.floor(I / 8);
          return (L[x] >>> 7 - I % 8 & 1) == 1;
        }, O.put = function(I, x) {
          for (var k = 0; k < x; k += 1)
            O.putBit((I >>> x - k - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return W;
        }, O.putBit = function(I) {
          var x = Math.floor(W / 8);
          L.length <= x && L.push(0), I && (L[x] |= 128 >>> W % 8), W += 1;
        }, O;
      }, m = function(L) {
        var W = s.MODE_NUMBER, O = L, I = {};
        I.getMode = function() {
          return W;
        }, I.getLength = function($) {
          return O.length;
        }, I.write = function($) {
          for (var g = O, _ = 0; _ + 2 < g.length; )
            $.put(x(g.substring(_, _ + 3)), 10), _ += 3;
          _ < g.length && (g.length - _ == 1 ? $.put(x(g.substring(_, _ + 1)), 4) : g.length - _ == 2 && $.put(x(g.substring(_, _ + 2)), 7));
        };
        var x = function($) {
          for (var g = 0, _ = 0; _ < $.length; _ += 1)
            g = g * 10 + k($.charAt(_));
          return g;
        }, k = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return I;
      }, y = function(L) {
        var W = s.MODE_ALPHA_NUM, O = L, I = {};
        I.getMode = function() {
          return W;
        }, I.getLength = function(k) {
          return O.length;
        }, I.write = function(k) {
          for (var $ = O, g = 0; g + 1 < $.length; )
            k.put(
              x($.charAt(g)) * 45 + x($.charAt(g + 1)),
              11
            ), g += 2;
          g < $.length && k.put(x($.charAt(g)), 6);
        };
        var x = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          if ("A" <= k && k <= "Z")
            return k.charCodeAt(0) - 65 + 10;
          switch (k) {
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
              throw "illegal char :" + k;
          }
        };
        return I;
      }, b = function(L) {
        var W = s.MODE_8BIT_BYTE, O = a.stringToBytes(L), I = {};
        return I.getMode = function() {
          return W;
        }, I.getLength = function(x) {
          return O.length;
        }, I.write = function(x) {
          for (var k = 0; k < O.length; k += 1)
            x.put(O[k], 8);
        }, I;
      }, S = function(L) {
        var W = s.MODE_KANJI, O = a.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(k, $) {
          var g = O(k);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var I = O(L), x = {};
        return x.getMode = function() {
          return W;
        }, x.getLength = function(k) {
          return ~~(I.length / 2);
        }, x.write = function(k) {
          for (var $ = I, g = 0; g + 1 < $.length; ) {
            var _ = (255 & $[g]) << 8 | 255 & $[g + 1];
            if (33088 <= _ && _ <= 40956)
              _ -= 33088;
            else if (57408 <= _ && _ <= 60351)
              _ -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + _;
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), k.put(_, 13), g += 2;
          }
          if (g < $.length)
            throw "illegal char at " + (g + 1);
        }, x;
      }, A = function() {
        var L = [], W = {};
        return W.writeByte = function(O) {
          L.push(O & 255);
        }, W.writeShort = function(O) {
          W.writeByte(O), W.writeByte(O >>> 8);
        }, W.writeBytes = function(O, I, x) {
          I = I || 0, x = x || O.length;
          for (var k = 0; k < x; k += 1)
            W.writeByte(O[k + I]);
        }, W.writeString = function(O) {
          for (var I = 0; I < O.length; I += 1)
            W.writeByte(O.charCodeAt(I));
        }, W.toByteArray = function() {
          return L;
        }, W.toString = function() {
          var O = "";
          O += "[";
          for (var I = 0; I < L.length; I += 1)
            I > 0 && (O += ","), O += L[I];
          return O += "]", O;
        }, W;
      }, M = function() {
        var L = 0, W = 0, O = 0, I = "", x = {}, k = function(g) {
          I += String.fromCharCode($(g & 63));
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
        return x.writeByte = function(g) {
          for (L = L << 8 | g & 255, W += 8, O += 1; W >= 6; )
            k(L >>> W - 6), W -= 6;
        }, x.flush = function() {
          if (W > 0 && (k(L << 6 - W), L = 0, W = 0), O % 3 != 0)
            for (var g = 3 - O % 3, _ = 0; _ < g; _ += 1)
              I += "=";
        }, x.toString = function() {
          return I;
        }, x;
      }, q = function(L) {
        var W = L, O = 0, I = 0, x = 0, k = {};
        k.read = function() {
          for (; x < 8; ) {
            if (O >= W.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var g = W.charAt(O);
            if (O += 1, g == "=")
              return x = 0, -1;
            if (g.match(/^\s$/))
              continue;
            I = I << 6 | $(g.charCodeAt(0)), x += 6;
          }
          var _ = I >>> x - 8 & 255;
          return x -= 8, _;
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
        return k;
      }, U = function(L, W) {
        var O = L, I = W, x = new Array(L * W), k = {};
        k.setPixel = function(E, B, H) {
          x[B * O + E] = H;
        }, k.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(O), E.writeShort(I), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(O), E.writeShort(I), E.writeByte(0);
          var B = 2, H = g(B);
          E.writeByte(B);
          for (var X = 0; H.length - X > 255; )
            E.writeByte(255), E.writeBytes(H, X, 255), X += 255;
          E.writeByte(H.length - X), E.writeBytes(H, X, H.length - X), E.writeByte(0), E.writeString(";");
        };
        var $ = function(E) {
          var B = E, H = 0, X = 0, se = {};
          return se.write = function(ie, ge) {
            if (ie >>> ge)
              throw "length over";
            for (; H + ge >= 8; )
              B.writeByte(255 & (ie << H | X)), ge -= 8 - H, ie >>>= 8 - H, X = 0, H = 0;
            X = ie << H | X, H = H + ge;
          }, se.flush = function() {
            H > 0 && B.writeByte(X);
          }, se;
        }, g = function(E) {
          for (var B = 1 << E, H = (1 << E) + 1, X = E + 1, se = _(), ie = 0; ie < B; ie += 1)
            se.add(String.fromCharCode(ie));
          se.add(String.fromCharCode(B)), se.add(String.fromCharCode(H));
          var ge = A(), Ae = $(ge);
          Ae.write(B, X);
          var fe = 0, Z = String.fromCharCode(x[fe]);
          for (fe += 1; fe < x.length; ) {
            var ae = String.fromCharCode(x[fe]);
            fe += 1, se.contains(Z + ae) ? Z = Z + ae : (Ae.write(se.indexOf(Z), X), se.size() < 4095 && (se.size() == 1 << X && (X += 1), se.add(Z + ae)), Z = ae);
          }
          return Ae.write(se.indexOf(Z), X), Ae.write(H, X), Ae.flush(), ge.toByteArray();
        }, _ = function() {
          var E = {}, B = 0, H = {};
          return H.add = function(X) {
            if (H.contains(X))
              throw "dup key:" + X;
            E[X] = B, B += 1;
          }, H.size = function() {
            return B;
          }, H.indexOf = function(X) {
            return E[X];
          }, H.contains = function(X) {
            return typeof E[X] < "u";
          }, H;
        };
        return k;
      }, P = function(L, W, O) {
        for (var I = U(L, W), x = 0; x < W; x += 1)
          for (var k = 0; k < L; k += 1)
            I.setPixel(k, x, O(k, x));
        var $ = A();
        I.write($);
        for (var g = M(), _ = $.toByteArray(), E = 0; E < _.length; E += 1)
          g.writeByte(_[E]);
        return g.flush(), "data:image/gif;base64," + g;
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
  })(Za)), Za.exports;
}
var C8 = M8();
const E8 = /* @__PURE__ */ _8(C8), A8 = ["width", "height", "viewBox"], O8 = ["width", "height"], T8 = ["d"], I8 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = E8(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (c(), f("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      p("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, O8),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, T8)
    ], 8, A8));
  }
}, f_ = /* @__PURE__ */ V(I8, [["__scopeId", "data-v-489f0852"]]), R8 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, h_ = /* @__PURE__ */ V(R8, [["__scopeId", "data-v-47e67f04"]]);
function m_(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const p_ = Ki(() => import("./VoiceFigure-CkRBH8J5.js").then((e) => e.V)), g_ = "1.2.0", v_ = "3.5";
export {
  bf as $,
  Ce as A,
  Ie as B,
  pa as C,
  rt as D,
  $6 as E,
  q5 as F,
  fS as G,
  y6 as H,
  y5 as I,
  z5 as J,
  At as K,
  D8 as L,
  Vs as M,
  Q5 as N,
  U5 as O,
  ma as P,
  qS as Q,
  z3 as R,
  Hn as S,
  HS as T,
  D3 as U,
  Oe as V,
  Zn as W,
  N3 as X,
  L3 as Y,
  yf as Z,
  V as _,
  C3 as a,
  l6 as a$,
  Y5 as a0,
  V3 as a1,
  G3 as a2,
  Pe as a3,
  sS as a4,
  aS as a5,
  Ct as a6,
  K3 as a7,
  gS as a8,
  g3 as a9,
  XS as aA,
  LS as aB,
  r5 as aC,
  kS as aD,
  wS as aE,
  x6 as aF,
  pi as aG,
  WS as aH,
  bn as aI,
  $3 as aJ,
  b3 as aK,
  f6 as aL,
  kn as aM,
  g6 as aN,
  dS as aO,
  NS as aP,
  DS as aQ,
  BS as aR,
  un as aS,
  xt as aT,
  v3 as aU,
  Qw as aV,
  IS as aW,
  H3 as aX,
  hi as aY,
  Ft as aZ,
  Vt as a_,
  r6 as aa,
  m6 as ab,
  _3 as ac,
  q3 as ad,
  P3 as ae,
  tS as af,
  nS as ag,
  oS as ah,
  T3 as ai,
  rl as aj,
  Y3 as ak,
  pS as al,
  C6 as am,
  ES as an,
  MS as ao,
  _S as ap,
  lS as aq,
  Z3 as ar,
  X3 as as,
  eS as at,
  FS as au,
  mS as av,
  vS as aw,
  O6 as ax,
  en as ay,
  yS as az,
  i$ as b,
  A6 as b$,
  B5 as b0,
  p6 as b1,
  VS as b2,
  zS as b3,
  w2 as b4,
  ei as b5,
  a6 as b6,
  hS as b7,
  ya as b8,
  dt as b9,
  KS as bA,
  e6 as bB,
  mt as bC,
  US as bD,
  t6 as bE,
  bS as bF,
  AS as bG,
  $S as bH,
  Re as bI,
  uS as bJ,
  n6 as bK,
  q6 as bL,
  P6 as bM,
  m3 as bN,
  e2 as bO,
  iS as bP,
  YS as bQ,
  E3 as bR,
  M6 as bS,
  GS as bT,
  JS as bU,
  QS as bV,
  rS as bW,
  i5 as bX,
  cS as bY,
  SS as bZ,
  _6 as b_,
  ZS as ba,
  ja as bb,
  dr as bc,
  I6 as bd,
  L6 as be,
  jS as bf,
  d6 as bg,
  p3 as bh,
  CS as bi,
  R6 as bj,
  J3 as bk,
  Q3 as bl,
  R3 as bm,
  U3 as bn,
  w3 as bo,
  c6 as bp,
  A3 as bq,
  O3 as br,
  B3 as bs,
  TS as bt,
  Vw as bu,
  v6 as bv,
  H5 as bw,
  I3 as bx,
  x3 as by,
  OS as bz,
  k2 as c,
  Q6 as c$,
  k3 as c0,
  y3 as c1,
  xS as c2,
  N6 as c3,
  Qs as c4,
  D6 as c5,
  Oi as c6,
  u6 as c7,
  F3 as c8,
  j3 as c9,
  St as cA,
  Md as cB,
  ye as cC,
  e_ as cD,
  V8 as cE,
  g_ as cF,
  v_ as cG,
  a3 as cH,
  n_ as cI,
  hs as cJ,
  c3 as cK,
  Bk as cL,
  Mt as cM,
  ws as cN,
  ia as cO,
  Z8 as cP,
  s3 as cQ,
  du as cR,
  pk as cS,
  c_ as cT,
  G8 as cU,
  K8 as cV,
  Y8 as cW,
  t3 as cX,
  f_ as cY,
  Cr as cZ,
  ju as c_,
  Jw as ca,
  S3 as cb,
  F5 as cc,
  RS as cd,
  Hs as ce,
  n5 as cf,
  PS as cg,
  tn as ch,
  Nt as ci,
  J8 as cj,
  X8 as ck,
  Z6 as cl,
  de as cm,
  ef as cn,
  Jl as co,
  ua as cp,
  Fg as cq,
  da as cr,
  u_ as cs,
  h3 as ct,
  Q8 as cu,
  Ug as cv,
  Sr as cw,
  sn as cx,
  j6 as cy,
  L8 as cz,
  Ve as d,
  z8 as d$,
  i0 as d0,
  W8 as d1,
  d3 as d2,
  n4 as d3,
  Pt as d4,
  o3 as d5,
  Ze as d6,
  vt as d7,
  Q1 as d8,
  Ku as d9,
  i_ as dA,
  f3 as dB,
  u3 as dC,
  i3 as dD,
  W6 as dE,
  Uh as dF,
  F6 as dG,
  j8 as dH,
  s_ as dI,
  Ek as dJ,
  S$ as dK,
  U8 as dL,
  n3 as dM,
  z6 as dN,
  G6 as dO,
  Ne as dP,
  rp as dQ,
  e3 as dR,
  hu as dS,
  Hr as dT,
  U6 as dU,
  kc as dV,
  F8 as dW,
  P8 as dX,
  ca as dY,
  Ts as dZ,
  sd as d_,
  r3 as da,
  H8 as db,
  Ut as dc,
  t_ as dd,
  d_ as de,
  vn as df,
  Ed as dg,
  at as dh,
  l3 as di,
  Je as dj,
  p_ as dk,
  h_ as dl,
  Ps as dm,
  V6 as dn,
  Ss as dp,
  op as dq,
  Co as dr,
  qs as ds,
  ad as dt,
  r_ as du,
  l_ as dv,
  As as dw,
  nd as dx,
  Cs as dy,
  um as dz,
  W3 as e,
  ht as e0,
  m_ as e1,
  _$ as e2,
  N8 as e3,
  q8 as e4,
  H6 as e5,
  X6 as e6,
  kr as e7,
  a_ as e8,
  Zb as e9,
  Bl as ea,
  d4 as eb,
  _s as ec,
  K6 as ed,
  es as ee,
  Y6 as ef,
  J6 as eg,
  Ue as eh,
  o_ as ei,
  os as ej,
  zw as f,
  T6 as g,
  dn as h,
  b6 as i,
  B6 as j,
  k6 as k,
  i6 as l,
  h$ as m,
  Gs as n,
  h6 as o,
  M3 as p,
  w6 as q,
  Ei as r,
  Ai as s,
  _e as t,
  x2 as u,
  s6 as v,
  E6 as w,
  o6 as x,
  $n as y,
  S6 as z
};
