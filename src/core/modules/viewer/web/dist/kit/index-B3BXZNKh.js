/* @code-commandments-generated */
import { openBlock as u, createElementBlock as h, normalizeStyle as ge, unref as j, renderSlot as ue, createElementVNode as b, normalizeClass as Z, Fragment as K, renderList as ee, defineComponent as ri, Comment as ii, h as Kn, cloneVNode as ci, createBlock as H, withCtx as P, createVNode as N, toDisplayString as w, createCommentVNode as A, ref as B, onMounted as Re, onBeforeUnmount as ft, reactive as Yn, shallowRef as Ke, watch as fe, onUnmounted as Be, inject as Oe, useAttrs as Jn, computed as O, resolveDynamicComponent as ht, mergeProps as Fe, useId as ds, resolveDirective as ui, withDirectives as tt, createTextVNode as te, Teleport as fs, nextTick as mt, Transition as Dt, withModifiers as xe, TransitionGroup as el, shallowReactive as di, isRef as Hs, onScopeDispose as hs, resolveComponent as fi, useModel as qa, getCurrentInstance as hi, mergeModels as Fa, getCurrentScope as tl, provide as nl, onErrorCaptured as mi, toHandlers as pi, createSlots as gi, vShow as al, useSlots as vi, withKeys as Zt, vModelText as Wa, normalizeProps as yi, guardReactiveProps as bi, defineAsyncComponent as wi } from "vue";
function sl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ki = 1600, xi = {
  __name: "Shimmer",
  setup(e) {
    const t = sl(ki);
    return (n, a) => (u(), h("span", {
      class: "shimmer",
      style: ge(j(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ J(xi, [["__scopeId", "data-v-6c018b03"]]), $i = { class: "skeleton-line" }, Mi = 2e3, Si = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = sl(Mi);
    return (n, a) => (u(), h("span", $i, [
      ue(n.$slots, "default", {}, void 0, !0),
      b("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (u(!0), h(K, null, ee(e.bars, (s) => (u(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...j(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ J(Si, [["__scopeId", "data-v-484fe8a0"]]), jt = ri({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ii);
      return a.length !== 1 ? Kn(K, { key: n }, a) : a[0].key == null ? ci(a[0], { key: n }) : a[0];
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
    return (i, c) => (u(), H(jt, { value: e.shape }, {
      messages: P(() => [
        b("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), h(K, null, ee(t, (d) => N(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, _i)
      ]),
      older: P(() => [
        b("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(t.slice(0, 3), (d) => (u(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ei)
      ]),
      cards: P(() => [
        b("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), h(K, null, ee(n, (f) => N(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ai)
      ]),
      file: P(() => [
        b("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), h(K, null, ee(s, (f) => N(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ci)
      ]),
      page: P(() => [
        b("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), h(K, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Oi)
      ]),
      text: P(() => [
        b("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ti)
      ]),
      default: P(() => [
        b("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Ri)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ J(Ii, [["__scopeId", "data-v-ef519c5f"]]), Bi = {
  key: 1,
  class: "empty-state titled"
}, Li = { class: "empty-state-title" }, Ni = { class: "empty-state-text" }, Di = {
  key: 2,
  class: "empty-state"
}, ji = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), h("div", Bi, [
      b("p", Li, w(e.title), 1),
      b("p", Ni, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), h("p", Di, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ J(ji, [["__scopeId", "data-v-b27e89b0"]]), Pi = { class: "fold-group" }, qi = ["aria-expanded"], Fi = { class: "fold-label" }, Wi = {
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
    return (a, s) => (u(), h("div", Pi, [
      b("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        b("span", Fi, w(e.label), 1),
        e.count !== "" ? (u(), h("span", Wi, w(e.count), 1)) : A("", !0),
        b("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, qi),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, j5 = /* @__PURE__ */ J(Hi, [["__scopeId", "data-v-9ef1865c"]]), zi = 150, Ui = () => zi;
function ms(e, t, n = Ui(), a = performance.now()) {
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
const zs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function P5(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ha(t.read, t.events) : Ha("", []);
}
function ol(e, t, n, a) {
  const s = B([]), o = B(null), l = B(""), r = B(!1), i = performance.now(), c = B(!1), d = B(""), f = B(null);
  async function m(y) {
    const E = k, x = await t({ "before-id": y + 1, limit: 1 });
    if (E !== k) return;
    if (!x.ok) return W();
    const R = x.value.rows.find(($) => $.id === y);
    s.value = R ? s.value.map(($) => $.id === y ? R : $) : s.value.filter(($) => $.id !== y);
  }
  async function g(y) {
    if (a() && String((y == null ? void 0 : y.event) ?? "").endsWith(".delete")) return void (s.value = s.value.filter((_) => _.id !== y.row_id));
    if (a() && (y != null && y.row_id) && !String(y.event ?? "").endsWith(".create") && s.value.some((_) => _.id === y.row_id)) return m(y.row_id);
    if (!(a() && s.value.length && String((y == null ? void 0 : y.event) ?? "").endsWith(".create"))) return W();
    const x = Math.max(...s.value.map((_) => _.id)), R = k, $ = await t({ "after-id": x });
    if (R !== k) return;
    if (!$.ok) return W();
    const v = new Set(s.value.map((_) => _.id));
    s.value = [...$.value.rows.filter((_) => !v.has(_.id)), ...s.value];
  }
  async function p() {
    if (!c.value || !s.value.length) return !1;
    const y = k, E = Math.min(...s.value.map(($) => $.id)), x = await t({ "before-id": E });
    if (y !== k) return !1;
    if (!x.ok || !x.value.rows.length) return c.value = !1;
    c.value = zs(x.value, n());
    const R = new Set(s.value.map(($) => $.id));
    return s.value = [...s.value, ...x.value.rows.filter(($) => !R.has($.id))], !0;
  }
  let k = 0;
  function S(y, E) {
    var $, v;
    const x = y.ok ? e.shared ? [y.value] : (($ = y.value) == null ? void 0 : $.rows) ?? [] : [];
    y.ok && (s.value = E(x)), o.value = y.ok ? y.value : null;
    const R = x.length ? Math.min(...x.map((_) => _.id)) : 0;
    y.ok && ((v = y.value) != null && v.rows) && !s.value.some((_) => _.id < R) && (c.value = !e.shared && zs(y.value, n())), l.value = y.ok ? "" : y.error, ms(i, () => r.value = !0);
  }
  async function T(y) {
    const E = ++k, x = await t({});
    E === k && S(x, y);
  }
  const q = (y) => {
    if (!a() || !y.length) return y;
    const E = Math.min(...y.map((R) => R.id)), x = Math.max(...y.map((R) => R.id));
    return [...s.value.filter((R) => R.id > x), ...y, ...s.value.filter((R) => R.id < E)];
  }, W = () => T(q), I = (y) => S(y, q), M = () => T((y) => y);
  async function C(y, E = null) {
    const x = await Vi(E && { target: s, fields: { value: E(s.value) } }, y, e.run);
    return d.value = x.ok ? "" : x.error, f.value = x.ok ? x.value : null, await W(), x;
  }
  return { rows: s, listing: o, failure: l, loaded: r, more: c, load: W, loadLatest: M, older: p, act: C, actionFailure: d, answer: f, context: e, heard: g, showFirst: I };
}
const Gi = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ha(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = ol(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Gi(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Ki = 2e3;
function ps(e, t, n = Ki) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
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
  }, c = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Re(async () => {
    document.addEventListener("visibilitychange", c), await l(e), i();
  }), ft(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const ll = typeof document < "u" && document.documentElement.classList.contains("phone"), rl = 120;
var Qo;
const ia = globalThis[Qo = Symbol.for("journal.pressed")] ?? (globalThis[Qo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Yi(e = 0) {
  const t = ia.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ia.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ia.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function za(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function il(e = window) {
  if (!za(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    za(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ua = "journal.stale-build-reload", Ji = 'script[type="module"][src*="/assets/index-"]', Us = (e) => {
  var t;
  return ((t = e.querySelector(Ji)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Zi(e = document, t = (a, s) => Me.quietRead(a, s), n = () => il(window)) {
  const a = Us(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Us(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function Qi(e, t = () => il(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const Xi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function ec(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ua) === e.message) return !1;
    t.setItem(Ua, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function tc(e = window.sessionStorage) {
  try {
    e.removeItem(Ua);
  } catch {
    return;
  }
}
const nc = 2e3, ac = 3e4, ze = Yn({ starting: !1, external: !1, late: !1, offline: !1 }), cl = () => ze.starting, sc = 3;
let vn = 0, Va = 0, ul = 0, dl = [];
async function oc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let Vs = null;
const lc = () => Vs ?? (Vs = oc().finally(() => Vs = null));
function rc() {
  clearTimeout(Va), clearTimeout(ul), Va = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), dl.splice(0).forEach((e) => e()), Zi();
}
async function ic() {
  ze.offline = !navigator.onLine;
  const e = await lc();
  if (ze.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < sc) return;
  vn = 0, (!Qi(e.started_at) || za()) && rc();
}
function fl() {
  Va = setTimeout(async () => {
    await ic(), ze.starting && fl();
  }, nc);
}
function cc() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, fl(), ul = setTimeout(() => ze.late = !0, ac));
}
const uc = () => ze.starting ? new Promise((e) => dl.push(e)) : Promise.resolve();
function hl(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, r = () => {
    a = null;
    const c = e();
    n = Date.now(), c instanceof Promise && (s = !0, c.catch(() => {
    }).finally(l));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const c = t - (Date.now() - n);
    c <= 0 ? r() : a = setTimeout(r, c);
  };
  return i.cancel = () => {
    clearTimeout(a), a = null, o = !1;
  }, i;
}
function dc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class fc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = hl(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = dc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", yn = 2e4, hc = 4, Gs = "/api/read-lines", mc = 5e3, pc = 403, Ks = "/api/repeated-lines", gc = 10, vc = 2e3, yc = 3e5, q5 = 6e5, bn = 6, bc = 500, wc = "/journal/summary", Ys = "/api/server-state", kc = 2e4, wn = ll ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, xc = (e) => e.split("?")[0].endsWith(wc), Ga = (e, t) => Object.assign(new Error(t), { status: e });
async function $c(e, t, n = Ga) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Mc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Sc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Js = (e) => e.split(" ").slice(0, 2).join(" "), Ze = "read", Tt = "write", _c = "stream";
class Ec {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Js(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < vc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < gc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ks, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Ks, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Yi(n ? rl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Sc(n.signal, s) } : n;
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
      throw o instanceof TypeError && cc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= hc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Gs, { headers: wn }, [{ window: st, line: Gs, kind: Ze }], mc).then(async (t) => {
      if (t.status === pc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ga(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new fc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Js(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Mc(a) }, c = s || (r ? yc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Ze }], c)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, bc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return $c(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Ze }], yn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: wn });
    if (!n.ok) throw Ga(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : cl() && !xc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: _c }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ys, { cache: "no-store" }, [{ window: st, line: Ys, kind: Ze }], kc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Ze : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Ec());
class Ac {
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
      n.patterns.some((a) => gs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function gs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Cc = 50, Oc = "refresh", Tc = 1e3, Rc = "requested", Ic = "after_window", Bc = 50, Lc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Nc(e) {
  const t = {}, n = Yn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null };
  let l = {}, r = 0;
  function i(W) {
    const I = () => l[W] ?? {}, M = B(void 0), C = ol(e, async (y) => {
      const E = await f(W, y);
      return E.ok && !Object.keys(y).length && (M.value = E.value), E;
    }, () => I().page_size || Bc, () => !!I().page_size);
    return t[W] = { ...C, data: M, readAt: 0 };
  }
  const c = new Proxy({}, { get: (W, I) => typeof I != "string" || I.startsWith("__v") ? void 0 : t[I] ?? i(I) }), d = (W) => l[W].loading !== Rc && (!l[W].tab || l[W].tab === n.tab);
  function f(W, I = {}) {
    return new Promise((M) => {
      a.push({ name: W, flags: I, resolve: M }), a.length === 1 && setTimeout(m);
    });
  }
  async function m() {
    const W = /* @__PURE__ */ new Map(), I = a.splice(0).filter((y) => {
      const E = JSON.stringify(y.flags);
      return W.has(y.name) || W.set(y.name, E), W.get(y.name) === E ? !0 : (a.push(y), !1);
    });
    a.length && setTimeout(m);
    const M = Object.fromEntries(I.flatMap(({ name: y, flags: E }) => Object.entries(E).map(([x, R]) => [`${y}.${x}`, R]))), C = await e.readKeys({ only: [...new Set(I.map(({ name: y }) => y))], state: { ...n, ...M } });
    I.forEach(({ name: y, resolve: E }) => E(C.ok ? C.value.keys[y] : C));
  }
  async function g(W) {
    const I = await e.readKeys({ only: W, state: { ...n } });
    return I.ok ? (T(I.value.declared), Object.entries(I.value.keys).forEach(([M, C]) => {
      c[M].readAt = Date.now(), C.ok && (c[M].data.value = C.value), c[M].showFirst(C);
    }), !0) : (I.failure !== "cancelled" && (W.length ? W : Object.keys(t)).forEach((M) => c[M].showFirst(I)), !1);
  }
  function p(W) {
    const I = Lc(W);
    return I.length ? (I.forEach((M) => o.names.add(M)), o.answer ?? (o.answer = new Promise((M) => setTimeout(() => {
      const C = [...o.names];
      o.names.clear(), o.answer = null, M(g(C));
    })))) : g([]);
  }
  function k(W) {
    W.forEach((I) => s.add(I)), clearTimeout(r), r = setTimeout(() => {
      const I = [...s];
      s.clear(), I.length && g(I);
    }, Cc);
  }
  function S(W) {
    const I = Object.keys(l).filter((C) => W.event === Oc || l[C].events.some((y) => gs(y, W.event)));
    I.filter((C) => l[C].page_size).forEach((C) => c[C].heard(W));
    const M = I.filter((C) => !l[C].page_size);
    M.filter((C) => !d(C)).forEach((C) => c[C].readAt = 0), k(M.filter(d));
  }
  function T(W) {
    if (Object.keys(l).length) return;
    l = W;
    const I = [...new Set(Object.values(W).flatMap((C) => C.events))];
    I.length && e.follow(I, S);
    const M = Object.keys(W).filter((C) => W[C].loading === Ic);
    M.length && g(M);
  }
  fe(() => n.tab, () => {
    const W = Object.keys(l).filter((I) => d(I) && !c[I].readAt);
    W.length && g(W);
  }), Be(() => clearTimeout(r));
  function q() {
    const W = Date.now(), I = Object.keys(l).filter((M) => l[M].reload_seconds > 0 && d(M) && W - c[M].readAt >= l[M].reload_seconds * 1e3);
    I.length && k(I);
  }
  return ps(q, () => e.visible.value, Tc), queueMicrotask(() => g([])), { props: c, state: n, reload: p, readKey: f };
}
const Dc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), ml = Symbol("dock-card");
function jc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Nc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function We() {
  const e = Oe(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return jc(e);
}
const Pc = (e, t) => e(ml, t), F5 = () => Oe(ml), qc = ["stroke-width", "innerHTML"], ye = {
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
    return (o, l) => (u(), h("svg", {
      class: "ico",
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
    }, null, 12, qc));
  }
}, Fc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Wc = /* @__PURE__ */ J(Fc, [["__scopeId", "data-v-eb453d6f"]]), Hc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Jn(), a = O(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = B(!1), o = O(() => t.busy || s.value), l = Oe(Le, null), r = O(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(c) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(c)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, rl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (c, d) => (u(), H(ht(e.href ? "a" : "button"), Fe(a.value, {
      type: e.href ? void 0 : j(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: P(() => [
        b("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), H(Wc, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ J(Hc, [["__scopeId", "data-v-ededdadf"]]), zc = ["aria-checked", "aria-haspopup", "onClick"], Uc = {
  key: 0,
  class: "segmented-dot"
}, Vc = {
  key: 1,
  class: "segmented-note"
}, Gc = {
  key: 2,
  class: "segmented-count"
}, Kc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ds();
    return (s, o) => {
      const l = ui("tip");
      return u(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), h(K, null, ee(e.options, (r) => tt((u(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (u(), h("span", Uc)) : A("", !0),
          te(" " + w(r.label) + " ", 1),
          r.note ? (u(), h("small", Vc, w(r.note), 1)) : A("", !0),
          r.count !== void 0 ? (u(), h("em", Gc, w(r.count), 1)) : A("", !0)
        ], 10, zc)), [
          [l, r.tip || r.title, `${j(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, rn = /* @__PURE__ */ J(Kc, [["__scopeId", "data-v-c89bc92d"]]), Yc = {
  key: 0,
  class: "more-items"
}, Jc = {
  key: 0,
  role: "alert"
}, Zc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), h("div", Yc, [
      e.failure ? (u(), h("p", Jc, w(e.failure), 1)) : A("", !0),
      e.more ? (u(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          te(w(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : A("", !0)
    ])) : A("", !0);
  }
}, Zn = /* @__PURE__ */ J(Zc, [["__scopeId", "data-v-10464014"]]), Qc = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, Xc = ["disabled", "onClick"], eu = { class: "title" }, tu = { class: "relations" }, nu = { key: 1 }, au = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    outsidePlan: Boolean,
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B([]), o = B({}), l = B(0), r = B(""), i = B(null), c = B(!1), d = B("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (y) => m[y] || `${y.replaceAll("_", " ").replace(/^./, (E) => E.toUpperCase())}s`, p = O(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((y, E) => y + E, 0) },
      ...Object.entries(o.value).map(([y, E]) => ({ key: y, label: g(y), count: E }))
    ]), k = (y) => y.endpoint.unavailable || !y.endpoint.open_ref, S = (y) => ({ [n.linkAttribute]: !0, "data-link-model": y.endpoint.model, "data-link-id": y.endpoint.id }), T = (y) => `${y.endpoint.model === "doc" && y.endpoint.id === n.documentId ? "Design document" : y.endpoint.model.replaceAll("_", " ").replace(/^./, (E) => E.toUpperCase())} ${y.endpoint.id}, ${y.relations.map((E) => E.replaceAll("_", " ")).join(", ")}`;
    async function q(y = 1) {
      const E = ++f;
      c.value = !0, d.value = "";
      const x = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(y), "--page-size", String(n.pageSize)];
      n.outsidePlan && x.push("--outside-plan"), n.documentId && x.push("--first-counterpart", `doc:${n.documentId}`), r.value && x.push("--kind", r.value);
      try {
        const R = await n.read(x);
        if (E !== f) return;
        if (!R.ok) {
          d.value = R.error;
          return;
        }
        const $ = R.value.counterparts ?? [], v = y === 1 ? $ : [...s.value, ...$];
        s.value = [...new Map(v.map((_) => [`${_.endpoint.model}:${_.endpoint.id}`, _])).values()], o.value = R.value.kinds ?? {}, l.value = R.value.total, i.value = R.value.next_page ?? null;
      } catch (R) {
        E === f && (d.value = R.message);
      } finally {
        E === f && (c.value = !1);
      }
    }
    function W(y) {
      if (k(y)) return;
      const [E, x] = y.endpoint.open_ref.split(":");
      a("open", { table: E, id: Number(x) });
    }
    function I(y) {
      r.value = y, q();
    }
    const M = () => !c.value && i.value && q(i.value), C = O(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", q();
    }, { immediate: !0 }), (y, E) => s.value.length || c.value || d.value || e.empty ? (u(), h("section", Qc, [
      p.value.length > 2 ? (u(), H(rn, {
        key: 0,
        options: p.value,
        value: r.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : A("", !0),
      (u(!0), h(K, null, ee(s.value, (x) => (u(), h("button", Fe({
        key: `${x.endpoint.model}:${x.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, S(x), {
        disabled: k(x),
        onClick: (R) => W(x)
      }), [
        b("span", eu, w(x.endpoint.title), 1),
        b("span", tu, [
          te(w(T(x)), 1),
          k(x) ? (u(), h(K, { key: 0 }, [
            te(" · Unavailable")
          ], 64)) : A("", !0)
        ])
      ], 16, Xc))), 128)),
      !s.value.length && !c.value && !d.value && e.empty ? (u(), h("p", nu, w(e.empty), 1)) : A("", !0),
      N(Zn, {
        more: !!i.value,
        loading: c.value,
        failure: d.value,
        label: C.value,
        onMore: M
      }, null, 8, ["more", "loading", "failure", "label"])
    ])) : A("", !0);
  }
}, su = /* @__PURE__ */ J(au, [["__scopeId", "data-v-466876c9"]]), ou = (e, t, n) => Math.max(t, Math.min(n, e)), lu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, pl = /* @__PURE__ */ new WeakMap(), ru = (e, t) => pl.set(e, t);
function iu(e, t) {
  for (let n = t; n; n = pl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function gl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !iu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, cu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = B(null), o = (v) => v ? `${v}px` : void 0, l = O(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = B({ w: 0, h: 0 }), i = B(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), f = (v) => {
      const _ = v.closest(".pane, .float-window");
      return _ ? d(_.getBoundingClientRect()) : c();
    }, m = (v, _) => `${Math.max(0, v ? Math.min(v, _) : _)}px`;
    function g(v, _) {
      return {
        below: v.bottom - _.bottom - a.gap - Ct,
        above: _.top - v.top - a.gap - Ct,
        across: v.right - v.left - 2 * Ct
      };
    }
    function p(v) {
      const _ = f(a.anchor), D = g(_, v);
      return r.value.w <= D.across && r.value.h <= Math.max(D.below, D.above) ? _ : c();
    }
    const k = O(() => {
      if (!i.value) return l.value;
      const v = i.value, _ = p(v), D = g(_, v), { w: L, h: z } = r.value, X = a.align === "auto" ? v.left + v.right > _.left + _.right : a.align === "right", re = ou(X ? v.right - L : v.left, _.left + Ct, Math.max(_.left + Ct, _.right - L - Ct)), he = z > D.below && D.above > D.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: m(a.maxHeight, D.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: m(a.maxHeight, D.below) };
      return { ...l.value, ...he, left: `${re}px`, maxWidth: m(a.maxWidth, D.across) };
    }), S = n, T = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(v) {
      const _ = T(), D = _.indexOf(document.activeElement);
      _[(D + v + _.length) % _.length].focus();
    }
    const W = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => S("close") }, I = (v) => W[v.key] && (v.preventDefault(), W[v.key]()), M = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let C = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(C), C = requestAnimationFrame(M);
    });
    gl(s, (v) => a.anchor && !a.anchor.contains(v.target) && S("close"));
    const E = (v, _) => ["top", "left", "right", "bottom"].some((D) => Math.abs(v[D] - _[D]) > 1), x = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let R = 0;
    function $() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(v)) return S("close");
        E(v, i.value) && (i.value = v);
      }
      R = requestAnimationFrame($);
    }
    return Re(() => {
      a.anchor && s.value && ru(s.value, a.anchor), M(), s.value && y.observe(s.value), !a.plain && T()[0] && T()[0].focus(), $();
    }), Be(() => {
      y.disconnect(), cancelAnimationFrame(R), cancelAnimationFrame(C);
    }), t({ element: s }), (v, _) => (u(), H(fs, {
      to: "body",
      disabled: !e.anchor
    }, [
      b("div", Fe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: I
      }), [
        ue(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Qn = /* @__PURE__ */ J(cu, [["__scopeId", "data-v-3d203970"]]), uu = { class: "split-button" }, du = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = B(null), s = B(!1), o = () => s.value = !1;
    return (l, r) => (u(), h("span", uu, [
      N(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: P(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      b("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        N(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: P(() => [
            N(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), H(Qn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, fu = /* @__PURE__ */ J(du, [["__scopeId", "data-v-c258494d"]]), hu = 0, mu = "/api/lines", pu = "/api/line", Zs = 5e3, Qs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Xs = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), da = (e) => JSON.stringify(e.line), eo = () => new DOMException("cancelled", "AbortError");
class gu {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(da(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), hu));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(eo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(eo()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(mu, Qs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Xs(r.body, Ze)), Zs);
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
    await this.alone(t, Ze), Date.now() - n < Zs ? this.slow.delete(da(t.body)) : this.slow.add(da(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(pu, Qs(t.body, t.signal), [Xs(t.body, n)], n === Ze ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const vl = new gu(), vu = "/api/window";
function yu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${vu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: Ze }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const yl = /* @__PURE__ */ new Map();
class bu {
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
function W5(e, t) {
  const n = new bu(e, t);
  return yl.set(e, n), n.load().catch(() => {
  }), n;
}
const vs = (e) => yl.get(e);
function wu(e, t, n) {
  const a = vs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function ku(e, t) {
  if (!e) return !0;
  const n = vs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const xu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let bl = {};
async function H5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (bl = (await t.json()).states);
}
const ys = (e, t) => {
  var n;
  return (n = bl[e]) == null ? void 0 : n[t];
}, wl = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.label) ?? xu(t);
}, kl = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, $u = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Mu = Symbol("pane-page"), Su = Symbol("inspector-host"), xl = { 1: "refused", 2: "usage", 3: "fault" }, _u = 100, Eu = 50, Au = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Cu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Ou({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = B({}), declared: c = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: p = [], links: k = {}, search: S = {}, readOnly: T = !1, shared: q = null }) {
  const W = /* @__PURE__ */ new Map(), I = new AbortController(), M = B(!1), C = performance.now();
  let y = 0, E = 0, x = () => {
  };
  const R = new Promise((z) => x = z);
  I.signal.addEventListener("abort", x, { once: !0 });
  const $ = () => {
    clearTimeout(E), E = setTimeout(() => {
      y === 0 && ms(C, () => {
        M.value = !0, x();
      });
    }, Eu);
  }, v = (z, X) => (y += 1, Rt(e, z, t, I.signal, X).finally(() => {
    y -= 1, $();
  })), _ = (z, X) => ($(), R.then(() => I.signal.aborted ? nt : Rt(e, z, t, I.signal, X))), D = ({ only: z = [], state: X = {} } = {}) => (y += 1, Ru(() => yu(e, t, z, X, I.signal), I.signal).finally(() => {
    y -= 1, $();
  })), L = (z, { unbatched: X = !1, deferred: re = !1 } = {}) => {
    const ie = W.get(z);
    if (ie && performance.now() - ie.at < _u) return ie.answer;
    const he = re && !M.value ? _(z, X) : v(z, X);
    return W.set(z, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: M,
    settle: $,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: O(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: p,
    links: k,
    search: S,
    readOnly: T,
    shared: q,
    read: L,
    readKeys: D,
    run: (z) => Rt(e, z, t, I.signal),
    upload: (z) => Bu(z, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (z, X) => l.follow(e, [z].flat().filter((re) => o.some((ie) => gs(ie, re))), (re) => {
      W.clear(), X(re);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (z) => O(() => {
      var X;
      return i.value[z] ?? ((X = c.find((re) => re.key === z)) == null ? void 0 : X.default);
    }),
    setting: async (z, X) => {
      const re = await L(`window setting ${e} ${z}`);
      return re.ok ? re.value.value : X;
    },
    setOption: f,
    keep: (z, X) => Rt(e, ["window", "save-setting", e, z, JSON.stringify(X)], t, I.signal)
  };
}
function $l(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, bs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Ml(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: xl[n.code] || "fault", error: $l(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: bs };
  }
}
const Tu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: xl[e.code] || "fault", error: $l(e.error) };
async function Ru(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Tu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: bs };
  }
}
async function Sl(e, t, n) {
  const a = await Ml(() => vl.read(e, t, n), t);
  return a.failure !== "unreachable" || !cl() ? a : (await uc(), t.aborted ? nt : Sl(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Iu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ws(t)));
}
async function Iu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ws(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => Sl({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : Ml(() => vl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Bu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: bs };
  }
}
function ws(e) {
  return [...e.matchAll(Au)].map(([t]) => t.replace(Cu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Lu = (e) => `show-${e}`, z5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Lu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), _l = "messages.chat", Nu = {
  key: 0,
  class: "template-brief"
}, Du = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, ju = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B([]), o = B(""), l = O(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = O(() => s.value.find((c) => String(c.id) === n.value));
    async function i() {
      const c = await Rt(_l, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (c, d) => (u(), h(K, null, [
      N(rn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), h("p", Nu, w(r.value.brief), 1)) : A("", !0),
      o.value ? (u(), h("p", Du, w(o.value), 1)) : A("", !0)
    ], 64));
  }
}, Pu = /* @__PURE__ */ J(ju, [["__scopeId", "data-v-14be8a5c"]]), qu = { class: "form-field" }, Fu = { class: "form-field-head" }, Wu = ["for"], Hu = {
  key: 0,
  class: "form-field-aside"
}, zu = {
  key: 0,
  class: "form-field-help"
}, Uu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", qu, [
      b("div", Fu, [
        b("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Wu),
        t.$slots.aside ? (u(), h("span", Hu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (u(), h("p", zu, w(e.help), 1)) : A("", !0)
    ]));
  }
}, Vu = /* @__PURE__ */ J(Uu, [["__scopeId", "data-v-dd7cdcff"]]), Ka = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Gu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Jn(), n = O(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((u(), h("textarea", Fe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [j(Ka), j(t).value]
    ]);
  }
}), Ku = /* @__PURE__ */ J(Gu, [["__scopeId", "data-v-e130a5b9"]]), Yu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ds(), o = O(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), H(Vu, {
      label: e.field.label,
      for: j(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        N(jt, { value: o.value }, {
          choice: P(() => [
            N(rn, {
              id: j(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            N(Pu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            N(Ku, {
              id: j(s),
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
}, ks = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        N(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Ju(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Zu = (e, t = () => !0) => Ju("keydown", (n) => n.key === "Escape" && t() && e());
function El(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = B(!1), s = O(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Zu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Qu = 80, Ot = Yn([]);
function Al(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), O(() => Qu + Math.max(0, Ot.indexOf(t)));
}
let Cl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Cl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Xu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ed(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Xu)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Re(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Cl, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const td = ["aria-modal", "aria-label", "aria-labelledby"], nd = {
  key: 0,
  class: "dialog-head"
}, ad = ["id", "tabindex"], sd = {
  key: 1,
  class: "dialog-foot"
}, od = 500, ld = 400, rd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = El(a, n), r = Al(s), i = B(null), c = B(null), d = B(null), f = ds(), m = B(!1), g = Date.now();
    n.modal && ed(c, () => a("escape"), d);
    function p() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, ld);
    }
    function k(q) {
      !n.modal || Date.now() - g >= od || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const S = () => i.value && (i.value.scrollTop = i.value.scrollHeight), T = new MutationObserver(S);
    return fe(i, (q) => {
      T.disconnect(), q && n.follow && (T.observe(q, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Be(() => T.disconnect()), (q, W) => (u(), H(fs, { to: "body" }, [
      N(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (u(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: j(r) }),
            onClick: xe(p, ["self"])
          }, [
            b("section", {
              ref_key: "panel",
              ref: c,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? j(f) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? A("", !0) : (u(), h("header", nd, [
                b("h3", {
                  id: j(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, ad),
                e.closable ? (u(), H(ks, {
                  key: 0,
                  onClick: j(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              b("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (u(), h("footer", sd, [
                ue(q.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, td)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ol = /* @__PURE__ */ J(rd, [["__scopeId", "data-v-6d1ecd98"]]), id = (e, t, n = {}) => ws(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  try {
    return await ku(e.module, n) ? Rt(_l, id(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const cd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fa = [
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
}), Xn = {
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
    filters: fa
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: fa
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
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: fa }),
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
}, ud = ["secrets", "plugins"], Tl = Object.keys(Xn).filter((e) => !(ll && ud.includes(e)));
O(() => Tl.map((e) => ({ name: e, ...Xn[e] })));
const Pt = (e) => Xn[e], Rl = new Map(Tl.flatMap((e) => [e, e.replace(/s$/, ""), Xn[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Rl.get(String(e).toLowerCase()) || "", Il = [...Rl.keys()].sort((e, t) => t.length - e.length).join("|"), dd = {
  class: "button-form",
  "data-button-form": ""
}, fd = {
  key: 0,
  class: "button-form-title"
}, hd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, md = { class: "button-form-actions" }, pd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = B(!1), l = B(""), r = O(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = O(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Pt(ct(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (u(), H(Ol, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: P(() => {
        var m;
        return [
          b("div", dd, [
            (m = e.row) != null && m.title ? (u(), h("p", fd, w(e.row.title), 1)) : A("", !0),
            (u(!0), h(K, null, ee(e.button.fields, (g) => (u(), H(Yu, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (p) => s.value[g.name] = p
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), h("p", hd, w(l.value), 1)) : A("", !0),
            b("div", md, [
              N(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: P(() => [...f[2] || (f[2] = [
                  te("Cancel", -1)
                ])]),
                _: 1
              }),
              N(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...f[3] || (f[3] = [
                  te("Send", -1)
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
}, gd = /* @__PURE__ */ J(pd, [["__scopeId", "data-v-f26c27a7"]]), vd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, yd = {
  key: 1,
  class: "menu-item-text"
}, bd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), h("span", vd, w(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (u(), h("span", yd, [
        b("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, w(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ J(bd, [["__scopeId", "data-v-fec99974"]]), wd = ["aria-busy"], kd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, xd = {
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
    const n = e, a = t, s = O(() => vs(n.environment)), o = O(
      () => {
        var p;
        return !n.readOnly && ((p = s.value) == null ? void 0 : p.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = O(() => {
      var p;
      return !n.readOnly && ((p = s.value) == null ? void 0 : p.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = O(() => n.readOnly ? [] : wu(n.environment, n.name, n.row)), c = B(null), d = B(""), f = B(!1), m = (p) => [p.from ? `From ${p.from}` : "", p.tip].filter(Boolean).join(" · ");
    async function g(p) {
      if (f.value || n.readOnly) return;
      if (p.fields.length) {
        c.value = p;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const k = await cn(p, n.row, n.environment);
      f.value = !1, d.value = k.ok ? "" : k.error;
      const S = p.label.toLowerCase() + (n.objectName && !p.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", k.ok ? "" : `Could not ${S}: ${k.error}`), k.ok && a("done");
    }
    return (p, k) => (u(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), h(K, { key: 0 }, [
        k[3] || (k[3] = b("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(de, {
          small: "",
          onClick: r
        }, {
          default: P(() => [...k[2] || (k[2] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (u(), h(K, { key: 1 }, [
        (u(!0), h(K, null, ee(i.value, (S) => (u(), h(K, {
          key: S.name
        }, [
          S.menu.length ? (u(), H(fu, {
            key: 0,
            small: "",
            variant: S.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": S.menu_label || "More ways",
            title: m(S),
            "data-button": S.name,
            onMain: (T) => g(S)
          }, {
            menu: P(({ close: T }) => [
              (u(!0), h(K, null, ee(S.menu, (q) => (u(), H(Mt, {
                key: q.label,
                description: q.description,
                onClick: (W) => (T(), g({ ...S, ...q, menu: [] }))
              }, {
                default: P(() => [
                  te(w(q.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              te(w(S.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), H(de, {
            key: 1,
            small: "",
            variant: S.primary ? "primary" : "ghost",
            bordered: !S.primary,
            icon: S.icon,
            disabled: f.value,
            title: m(S),
            "data-button": S.name,
            onClick: (T) => g(S)
          }, {
            default: P(() => [
              te(w(S.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (u(), h("span", kd, w(d.value), 1)) : A("", !0),
        c.value && !e.readOnly ? (u(), H(gd, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: k[0] || (k[0] = (S) => c.value = null),
          onDone: k[1] || (k[1] = (S) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, wd));
  }
}, $d = /* @__PURE__ */ J(xd, [["__scopeId", "data-v-a07b49a4"]]), Md = {
  class: "running",
  "data-running-command": ""
}, Sd = ["title"], _d = {
  key: "idle",
  class: "running-idle"
}, Ed = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), h("span", Md, [
      N(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (u(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, Sd)) : (u(), h("span", _d, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, U5 = /* @__PURE__ */ J(Ed, [["__scopeId", "data-v-d3240219"]]), Ad = ["aria-checked", "aria-label", "title"], Cd = {
  key: 0,
  class: "switch-inner"
}, Od = {
  key: 0,
  class: "switch-word"
}, Td = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      b("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), h("span", Cd, w(e.word), 1)) : A("", !0),
        s[1] || (s[1] = b("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), h("span", Od, w(e.word), 1)) : A("", !0)
    ], 10, Ad));
  }
}, V5 = /* @__PURE__ */ J(Td, [["__scopeId", "data-v-1bfb90f3"]]);
function Bl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Nn(e, t) {
  return Bl(() => localStorage, e, t);
}
function Ll(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function xs(e, t) {
  return Ll(() => localStorage, e, t);
}
function Nl(e, t) {
  fe(t, (n) => xs(e, n), { deep: !0 });
}
function Rd(e, t) {
  return Bl(() => sessionStorage, e, t);
}
function Id(e, t) {
  return Ll(() => sessionStorage, e, t);
}
const Dn = "journal.environment", Dl = B(Rd(Dn, Nn(Dn, "")));
function Bd(e) {
  Dl.value = e, Id(Dn, e), xs(Dn, e);
}
const jn = B(location.hash), to = Ke(null), no = { integrations: "mcp", library: "team" };
function Ld() {
  if (!to.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (no[n]) {
    location.replace(`#/${[no[n], ...a].join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash;
    return;
  }
  !n || to.value(n) || (Bd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  jn.value = location.hash, Ld();
});
const Ya = O(() => {
  const [e, t = ""] = jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [c = "", d = "", f = ""] = r.split(":");
    return { table: c, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Dl.value,
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
}), $s = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${$s.page(e)}?open=${t}`
};
function Nd(e = "", t = 0, n = "") {
  location.hash = $s.page(e, t, n);
}
const Dd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function jl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Dd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function G5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Pl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ya.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  jl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function jd(e, t, n, a = 0, s = "") {
  if (e === Ya.value.env) return Pl(t, n, a, s);
  const o = Ya.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  jl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? jd(a, s, Number(o), 0, t) : Pl(s, Number(o), 0, t);
}
function Pd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Pd(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function K5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const qd = { class: "inspector-part" }, Fd = { class: "inspector-part-title" }, Wd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("section", qd, [
      b("h4", Fd, w(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Y5 = /* @__PURE__ */ J(Wd, [["__scopeId", "data-v-0da7fa52"]]), Hd = {
  key: 1,
  class: "row-list-failure"
}, zd = ["data-row"], Ud = {
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
    const t = e, n = O(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = B(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), h("p", Hd, w(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        te(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), h(K, { key: 3 }, [
      (u(), H(ht(e.arrival ? el : "ul"), Fe(n.value, { class: "row-list" }), {
        default: P(() => [
          (u(!0), h(K, null, ee(e.rows, (r) => (u(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, zd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : A("", !0)
    ], 64));
  }
}, Vd = /* @__PURE__ */ J(Ud, [["__scopeId", "data-v-6c7ba696"]]), Gd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Kd = {
  key: 1,
  class: "agent-rows-note"
}, Yd = {
  key: 2,
  class: "agent-rows-note"
}, Jd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Zd = ["data-agent-row", "onClick"], Qd = { class: "agent-row-name" }, Xd = { class: "agent-row-state" }, ef = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = O(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), h("div", Gd, [
      e.loaded ? e.failure ? (u(), h("p", Kd, w(e.failure), 1)) : e.rows.length ? (u(), h(K, { key: 3 }, [
        b("p", Jd, w(a.value) + " running", 1),
        (u(!0), h(K, null, ee(n.value, (l) => (u(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => j(qe)(`agents:${l.id}`)
        }, [
          b("span", Qd, "#" + w(l.id) + " " + w(l.session), 1),
          b("span", Xd, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Zd))), 128))
      ], 64)) : (u(), h("p", Yd, w(e.none), 1)) : (u(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, J5 = /* @__PURE__ */ J(ef, [["__scopeId", "data-v-a01e5a17"]]), tf = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, ql = /* @__PURE__ */ J(tf, [["__scopeId", "data-v-9e7e1157"]]), nf = ["aria-valuenow", "aria-valuemax"], af = {
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
    const t = e, n = O(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (u(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      b("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, nf));
  }
}, sf = /* @__PURE__ */ J(af, [["__scopeId", "data-v-9eba6a85"]]), of = { class: "bars" }, lf = { class: "bar-name" }, rf = { class: "bar-value" }, cf = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = O(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), h("div", of, [
      (u(!0), h(K, null, ee(e.items, (i, c) => (u(), H(ht(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          b("span", lf, w(i.label), 1),
          N(sf, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          b("span", rf, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, uf = /* @__PURE__ */ J(cf, [["__scopeId", "data-v-663427f4"]]), df = { class: "bars" }, ff = {
  key: 0,
  class: "bars-title"
}, hf = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", df, [
      e.node.title ? (u(), h("span", ff, w(e.node.title), 1)) : A("", !0),
      N(uf, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, mf = /* @__PURE__ */ J(hf, [["__scopeId", "data-v-7135bb11"]]), pf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = O(() => n[a.node.type](a.node));
    return (l, r) => (u(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (u(!0), h(K, null, ee(e.node.children || [], (i, c) => (u(), H(tr, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, On = /* @__PURE__ */ J(pf, [["__scopeId", "data-v-d142a3f4"]]), gf = {
  key: 0,
  class: "card-head"
}, vf = { class: "card-title" }, yf = {
  key: 0,
  class: "card-note"
}, bf = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), h("header", gf, [
        b("span", vf, w(e.node.title), 1),
        e.node.note ? (u(), h("span", yf, w(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      N(On, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, wf = /* @__PURE__ */ J(bf, [["__scopeId", "data-v-67b72d40"]]), kf = { processes: "process", memories: "memory", replies: "reply" }, Pn = (e) => (kf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ja = [], xf = 2e3, lt = /* @__PURE__ */ new Map(), $f = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Mf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Ja.unshift(e) : Ja.push(e), lt.clear();
}
function Fl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Sf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, _f = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ef(e, t) {
  const n = [{ type: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const a of Ja)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function Xt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Af(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Af(e) {
  return e.split(Mf).map((t, n) => n % 2 ? t : t.replace($f, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function ao(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Cf = 24;
function Of(e) {
  const [t, , ...n] = e, a = ao(t), s = n.map(ao), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > Cf) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${Xt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, d) => `<td${o(d)}>${Xt(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Wl = /^\s*(?:[-*+]|\d+[.)])\s+/, Za = /^\s*(\d+)[.)]\s/, so = (e) => e.match(/^\s*/)[0].length;
function Hl(e) {
  const t = e[0].match(Za), n = so(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && so(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Xt(o.text)}${o.nested.length ? Hl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Tf(e, t) {
  const n = Za.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Wl.test(e[s]) && Za.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const oo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
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
      const r = t.findIndex((c, d) => d > a && /^(```|~~~)/.test(c)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${Xt(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (oo(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Of(t.slice(a, r))), a = r;
      continue;
    }
    if (Wl.test(s)) {
      const r = Tf(t, a);
      n.push(Hl(t.slice(a, r))), a = r;
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
    for (; l < t.length && t[l].trim() && !oo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Xt(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Rf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, If = (e) => e.type !== "text" && !Rf.test(e.html);
function Bf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(zl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : If(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Lf(e, t = { env: "" }) {
  const n = _f(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => Sf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Bf(Ef(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > xf && lt.delete(lt.keys().next().value), o;
}
const ha = /* @__PURE__ */ new WeakMap();
function Nf(e) {
  if (ha.has(e)) return ha.get(e);
  const t = di(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const f = s(c, d), m = e.read(`${Pn(c)} show ${d}`);
    n.set(f, m), m.then((g) => {
      n.get(f) === m && (n.delete(f), t.set(f, g.ok ? { ...g.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Pn(c).replace(/-/g, "_")}.*`], (d) => {
      const f = `${c}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const g = Number(m.slice(f.length));
        (!d.row_id || d.row_id === g) && o(c, g);
      }
    }));
  }
  function r(c, d) {
    l(c);
    const f = s(c, d);
    return !t.has(f) && !n.has(f) && o(c, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return ha.set(e, i), i;
}
function Ul() {
  const e = Oe(Le, null), t = e ? Nf(e) : null;
  return (n, a = {}) => Lf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Vl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Vl, (t, n, a, s) => s), Df = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), kn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, jf = /^Traceback \(most recent call last\):/m, Pf = 8;
function Gl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Pf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function qf(e) {
  const t = [...e.matchAll(Df)].map((a) => a.index);
  if (kn.lastIndex = 0, !t.length || !kn.test(e)) return null;
  kn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(kn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Gl(n), tail: "" } : null;
}
function Ff(e) {
  const t = jf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Gl([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = un(e), n = Ff(t) || qf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Wf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Hf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, zf = /[\w\]]\(/, Uf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Vf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Gf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Kf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Yf = /[[({,]$/, Jf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Zf = /^(\t|\s{2,})\S/, Qf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Xf = /`[^`]+`/, eh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, th = /[{}()[\];=<>$&|*\\@+^~%]/g, Kl = /^\s*(?:[-*+]|\d+[.)])\s/, nh = /^\s*>/, ah = /^\s*\|/, sh = 0.6, oh = 0.4, lh = 5, rh = 0.03, Yl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= lh && t.every((n) => eh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(th) ?? []).length / e.length < rh;
}, ma = (e) => {
  const t = e.trim();
  return Xf.test(t) ? !1 : [Wf, Hf, zf, Uf, Vf, Gf, Kf, Yf, Jf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Zf.test(e) && !Kl.test(e) && !Yl(e);
};
function ih(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Kl.test(t[0]) || t.every((o) => nh.test(o) || ah.test(o))) return "text";
  const n = t.filter((o) => !Qf.test(o.trim()));
  if (t.length === 1) return !n.length || ma(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ma).length, s = n.filter((o) => !ma(o) && Yl(o)).length;
  return a >= n.length * sh && s <= n.length * oh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", ch = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", uh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, dh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", fh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", lo = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: ch, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: uh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: dh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: fh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, hh = {
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
function ro(e, t, n) {
  return n && e.startsWith(n, t);
}
function mh(e, t) {
  const n = lo[hh[t] ?? t] || lo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const c = e.indexOf(`
`, o), d = e.slice(o, c < 0 ? e.length : c);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", c < 0 ? "" : `
`), o = c < 0 ? e.length : c + 1;
      continue;
    }
    if (ro(e, o, n.line) || n.hash && r === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && ro(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), d = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((c) => e.startsWith(c, o));
    if (i) {
      const c = e.indexOf(i, o + 3), d = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let c = o + 1;
      for (; c < e.length && e[c] !== r && (r === "`" || e[c] !== `
`); ) c += e[c] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(c + 1)) ? "property" : "string", e.slice(o, c + 1)), o = c + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const c = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", c[0]), o += c[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const c = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", c[0]), o += c[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const c = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + c)), o += c;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function ph(e, t) {
  const n = [""];
  for (const { type: a, value: s } of mh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? et(l) : `<span class="tok-${a}">${et(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function gh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const vh = 1500, io = /* @__PURE__ */ new WeakMap();
async function yh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await gh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(io.get(t)), io.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, vh)
  )));
}
typeof document < "u" && document.addEventListener("click", yh, !0);
const bh = /\n\s*\n/, wh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, kh = /^\s*(`{3,}|~{3,})\s*$/, xh = /^\s{4,}\S/, $h = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Xa = /^\s*(?:[-*+]|\d+[.)])\s/, Jl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Mh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ms(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Sh(e) {
  const t = Ms(e.join(`
`));
  return (Mh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const _h = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Jl.test(t) && !Xa.test(t);
}, Eh = (e, t) => Xa.test(t) || Xa.test([...e].reverse().find((n) => n.trim()) || "");
function Ss(e, t) {
  const n = t || Sh(e), a = ph(Ms(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Ah(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && kh.test(s));
  return a < 0 ? e.length : a;
}
function Ch(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ss(a.map(un), n ? n.toLowerCase() : "");
}
function Oh(e) {
  const t = e.split(bh).map((l) => ({ paragraph: l, type: ih(Ms(l).split(`
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
      s(), n.push(Ss(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(un), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Th(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Oh(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(wh);
    if (r) {
      const c = Ah(n, l, r[2]);
      o(), a.push(Ch(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = _h(s) ? $h : xh;
    if (!t && i.test(n[l]) && !Eh(s, n[l])) {
      let c = l;
      for (; c < n.length && (i.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Jl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Ss([...d, ...n.slice(l, c)].map(un), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => Th(e, t.document));
const qn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Zl = (e) => `${e.table}:${e.id}`, co = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", pa = 80;
function uo(e) {
  return e.length <= pa ? e : `${e.slice(0, pa + 1).replace(/\s+\S*$/, "") || e.slice(0, pa)}…`;
}
const fo = {
  messages: (e) => uo(co(e.text)),
  comments: (e) => uo(co(e.text)),
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
}, Rh = (e) => (fo[e.table] ? fo[e.table](e) : e.title || "") || "", St = (e) => qn(e.created_at), Ql = (e) => qn(e.updated_at) || St(e), Ih = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Bh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Lh(e) {
  const t = Ih.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = Bh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Nh(e, t, n, a) {
  const s = Fl(a, e, t), o = un(s ? Rh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${et(Pt(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = Lh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Nh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dh = /\.(png|jpe?g|gif|webp|svg)$/i, jh = (e) => Dh.test(e), Ph = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, qh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Fh(e, t) {
  const n = Ph.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), c = i && Fl(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${c.id} · ${et(r)}`, m = jh(r) ? `<img class="file-card-image" src="${d}" alt="${et(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Wh(e) {
  const t = qh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Fh(e, t) || Wh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hh = /`([^`\n]+)`/g;
Et((e) => e.replace(Hh, (t, n) => `<code>${n}</code>`));
const ho = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${$s.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Vl, (n, a, s, o) => ho[a] ? ho[a](s, o, t) : o)
);
const zh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Xl = new RegExp(`\\b(${Il}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), er = new RegExp(`\\b(${Il}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Uh = new RegExp(`<code>((?:${Xl.source}|${er.source}))</code>`, "gi"), Vh = (e) => e.replace(Uh, "$1"), Gh = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Kh = (e) => e.replace(er, (t, n, a) => a.replace(/\d+/g, (s) => Gh(n.replace(/s$/i, ""), s))), Yh = (e) => Kh(e).replace(
  Xl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Vh(e).split(zh).map((n, a) => a % 2 ? n : Yh(n)).join("")
);
const Jh = ["innerHTML"], Zh = ["innerHTML"], Qh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ul(), a = O(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Jh)) : (u(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Zh));
  }
}, kt = /* @__PURE__ */ J(Qh, [["__scopeId", "data-v-d8e75741"]]), Xh = { class: "fact" }, em = { class: "fact-label" }, tm = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", Xh, [
      b("span", em, w(e.label), 1),
      N(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, nm = /* @__PURE__ */ J(tm, [["__scopeId", "data-v-3a88ecf8"]]), am = { class: "list" }, sm = { class: "list-label" }, om = {
  key: 1,
  class: "list-note"
}, lm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", am, [
      (u(!0), h(K, null, ee(e.items, (o, l) => (u(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          b("span", sm, w(o.label), 1),
          o.badge ? (u(), H(ql, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (u(), h("span", om, w(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, rm = /* @__PURE__ */ J(lm, [["__scopeId", "data-v-ebe2ae0a"]]), im = { class: "table" }, cm = {
  key: 0,
  class: "table-row empty"
}, um = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), h("div", im, [
      b("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (u(!0), h(K, null, ee(e.columns, (r) => (u(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (u(!0), h(K, null, ee(e.rows, (r, i) => (u(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: P(() => [
          (u(!0), h(K, null, ee(r.cells, (c, d) => (u(), h("span", {
            key: d,
            class: "cell"
          }, w(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), h("div", cm, w(e.empty), 1)) : A("", !0)
    ]));
  }
}, dm = /* @__PURE__ */ J(um, [["__scopeId", "data-v-9326a52e"]]), fm = { class: "stat-value" }, hm = { class: "stat-label" }, mm = {
  key: 0,
  class: "stat-note"
}, pm = {
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
    return (a, s) => (u(), H(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        b("span", fm, w(e.value), 1),
        b("span", hm, w(e.label), 1),
        e.note ? (u(), h("span", mm, w(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, gm = /* @__PURE__ */ J(pm, [["__scopeId", "data-v-ad0db6d6"]]), vm = { class: "code" }, ym = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), H(jt, {
      value: e.node.type
    }, {
      stack: P(() => [
        N(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        N(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        N(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        N(wf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        b("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: P(() => [...l[2] || (l[2] = [
        b("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        N(gm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        N(mf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        N(dm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        N(rm, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        N(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        N(nm, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        N(ql, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        b("pre", vm, [
          b("code", null, w(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        b("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), tr = /* @__PURE__ */ J(ym, [["__scopeId", "data-v-cbdcf540"]]), bm = { class: "dashboard" }, wm = { class: "trail" }, km = ["onClick"], xm = {
  key: 0,
  class: "gone",
  role: "status"
}, $m = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = B(!!n.page && !s(n.page)), l = B(n.page && !o.value ? [n.page] : []), r = O(() => l.value.at(-1) || n.document.start), i = O(() => (n.document.pages || {})[r.value] || null), c = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (u(), h("div", bm, [
      e.document.broken ? (u(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          te(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          te(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), h(K, { key: 2 }, [
        b("nav", wm, [
          b("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (p) => f(0))
          }, w(c(e.document.start)), 3),
          (u(!0), h(K, null, ee(l.value, (p, k) => (u(), h(K, {
            key: `${k}-${p}`
          }, [
            g[2] || (g[2] = b("span", { class: "sep" }, "/", -1)),
            b("button", {
              type: "button",
              class: Z(["step", { current: k === l.value.length - 1 }]),
              onClick: (S) => f(k + 1)
            }, w(c(p)), 11, km)
          ], 64))), 128))
        ]),
        o.value ? (u(), h("p", xm, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        N(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (u(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(tr, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (p) => a("file", p))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, Mm = /* @__PURE__ */ J($m, [["__scopeId", "data-v-fbe83734"]]), nr = {
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
function Sm(e, t) {
  const n = We(), a = hl(e, nr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const _m = {
  key: 0,
  class: "window-failure"
}, Em = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = B(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Sm(l, n.events) : ps(l, () => !0, nr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), h("p", _m, w(o.value.error), 1)) : o.value ? (u(), H(Mm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : A("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Am = 6;
function _s(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Cm = (e) => {
  const t = _s(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Om(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Tm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Rm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), c = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, g) => m + g, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => c(d) - c(f));
  };
  for (let l = 0; l < Am; l++) {
    const r = l % 2 === 0, i = a.map((c, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Im(e, t) {
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
function Bm(e) {
  const t = [...new Set(e.flatMap(([I, M]) => [I, M]))], n = new Set(e.map(([, I]) => I)), a = t.filter((I) => !n.has(I)), s = Om(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((I, M) => !s.has(M)), l = Tm(t, o), r = Rm(t, o, l), i = new Map(t.map((I) => [I, Cm(I)])), c = r.map((I) => I.reduce((M, C) => M + i.get(C).width, 0) + je.across * (I.length - 1)), d = Math.max(...c) + je.margin * 2, f = Nm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = je.margin;
  r.forEach((I, M) => {
    let C = (d - c[M]) / 2;
    const y = Math.max(...I.map((E) => i.get(E).height));
    I.forEach((E) => {
      const x = i.get(E);
      m.set(E, { ...x, x: C, y: g + (y - x.height) / 2 }), C += x.width + je.across;
    }), g += y + (f[M] ?? je.down);
  });
  const p = e.map(([I, M, C], y) => ({ from: I, to: M, label: C || "", back: s.has(y) || l.get(M) <= l.get(I) }));
  Im(p, m);
  const k = p.map((I) => Dm(I, m.get(I.from), m.get(I.to))), S = [...m.values()], T = Fm(k, S), q = Math.max(g - je.down, ...T.filter((I) => I.label).map((I) => I.label.y + I.label.height));
  return { width: Math.max(d - je.margin, ...T.filter((I) => I.label).map((I) => I.label.x + I.label.width)) + je.margin, height: q + je.margin, nodes: S, arrows: T };
}
const Lm = (e) => e ? _s(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function Nm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Lm(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function Dm(e, t, n) {
  const a = e.label ? _s(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: c - d }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${c - d} ${i} ${c}` };
}
const jm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Pm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], qm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function Fm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const d = jm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = qm.flatMap((i) => Pm.map((c) => s(c, i))).find((i) => !n.some((c) => mo(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => mo(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const mo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Wm = { class: "flowchart-tools" }, Hm = ["width", "height", "viewBox", "aria-label"], zm = ["d"], Um = ["x", "y", "width", "height"], Vm = ["x", "y"], Gm = ["x", "dy"], Km = {
  key: 0,
  class: "flowchart-label"
}, Ym = ["x", "y", "width", "height"], Jm = ["x", "y"], Zm = ["x", "dy"], Qm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(() => Bm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = B(null), r = B({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var T;
      const k = (T = l.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const S = Math.min(k.width / s.value.width, k.height / s.value.height, 1.5);
      r.value = { zoom: S, x: (k.width - s.value.width * S) / 2, y: (k.height - s.value.height * S) / 2 };
    }
    function d(k, S, T) {
      const { zoom: q, x: W, y: I } = r.value, M = Math.min(o.most, Math.max(o.least, q * k));
      r.value = { zoom: M, x: S - (S - W) * M / q, y: T - (T - I) * M / q };
    }
    function f(k) {
      const S = l.value.getBoundingClientRect();
      d(k, S.width / 2, S.height / 2);
    }
    function m(k) {
      const S = l.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? d(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - S.left, k.clientY - S.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function g(k) {
      var S, T, q;
      k.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), i = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (q = (T = l.value).setPointerCapture) == null || q.call(T, k.pointerId);
    }
    function p(k) {
      i && (r.value = { ...r.value, x: k.clientX - i.x, y: k.clientY - i.y });
    }
    return Re(c), (k, S) => (u(), H(Ol, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (T) => a("close"))
    }, {
      default: P(() => [
        b("div", Wm, [
          N(de, {
            small: "",
            onClick: S[0] || (S[0] = (T) => f(o.step))
          }, {
            default: P(() => [...S[5] || (S[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: S[1] || (S[1] = (T) => f(1 / o.step))
          }, {
            default: P(() => [...S[6] || (S[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...S[7] || (S[7] = [
              te("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        b("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: g,
          onPointermove: p,
          onPointerup: S[2] || (S[2] = (T) => Hs(i) ? i.value = null : i = null),
          onPointercancel: S[3] || (S[3] = (T) => Hs(i) ? i.value = null : i = null)
        }, [
          (u(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            S[8] || (S[8] = b("defs", null, [
              b("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                b("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (u(!0), h(K, null, ee(s.value.arrows, (T, q) => (u(), h("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, zm))), 128)),
            (u(!0), h(K, null, ee(s.value.nodes, (T) => (u(), h("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              b("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, Um),
              b("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (u(!0), h(K, null, ee(T.lines, (q, W) => (u(), h("tspan", {
                  key: W,
                  x: T.x + T.width / 2,
                  dy: W ? T.line : 0
                }, w(q), 9, Gm))), 128))
              ], 8, Vm)
            ]))), 128)),
            (u(!0), h(K, null, ee(s.value.arrows, (T, q) => (u(), h(K, {
              key: `label-${q}`
            }, [
              T.label ? (u(), h("g", Km, [
                b("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, Ym),
                b("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (u(!0), h(K, null, ee(T.label.lines, (W, I) => (u(), h("tspan", {
                    key: I,
                    x: T.label.x + T.label.width / 2,
                    dy: I ? T.label.line : 0
                  }, w(W), 9, Zm))), 128))
                ], 8, Jm)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, Hm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Xm = /* @__PURE__ */ J(Qm, [["__scopeId", "data-v-51d24cfe"]]), po = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', go = {
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
  agent: po,
  worker: po,
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
}, e1 = ["innerHTML"], t1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => go[t.name] || go.dot);
    return (a, s) => (u(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, e1));
  }
}, dt = /* @__PURE__ */ J(t1, [["__scopeId", "data-v-beb5935c"]]), n1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(dt, { name: "fold" })
    ], 2));
  }
}, $t = /* @__PURE__ */ J(n1, [["__scopeId", "data-v-d03899bb"]]), a1 = ["data-tip", "aria-label"], s1 = {
  key: 0,
  class: "mact-word"
}, o1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(dt, { name: "open" }),
      e.open ? (u(), h("span", s1, w(e.label), 1)) : A("", !0),
      n[0] || (n[0] = b("span", { class: "hit" }, null, -1))
    ], 10, a1));
  }
}, ar = /* @__PURE__ */ J(o1, [["__scopeId", "data-v-3b292e09"]]), sr = 120, Tn = 280, or = 160, l1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, r1 = ["leaving", "resizing", "entering"];
function es(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function i1(e) {
  const t = r1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = es(e);
  return e.classList.add(...t), n;
}
function lr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = B(t()), s = B("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = i1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function c(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let g = m.offsetHeight;
    const p = new ResizeObserver(() => {
      m.offsetHeight !== g && (g = m.offsetHeight, i(f, es(f)));
    });
    return p.observe(m), p;
  }
  async function d(f) {
    const m = e.value, g = ++o;
    if (!m || !m.offsetWidth || l1()) {
      a.value = f;
      return;
    }
    const p = es(m);
    if (l(m, p), s.value = "leaving", await n(sr), g !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, p);
    const k = c(m);
    await n(Tn), k == null || k.disconnect(), g === o && (r(m), s.value = "entering", await n(or), g === o && (s.value = ""));
  }
  return fe(t, (f) => d(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const c1 = { class: "growing-card-top" }, u1 = ["aria-expanded"], d1 = { class: "growing-card-avatar" }, f1 = { class: "growing-card-title" }, h1 = { class: "growing-card-more" }, m1 = { class: "growing-card-body" }, p1 = {
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
    const n = e, a = t, s = B(!1), o = B(null), { folded: l, phase: r } = lr(o, () => !s.value), i = O(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = O(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (u(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", j(r), { open: !j(l), bad: e.bad, incoming: e.incoming }])
    }, [
      b("div", c1, [
        b("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          b("span", d1, [
            e.bad ? (u(), H(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), h(K, { key: 1 }, [
              te(w(i.value), 1)
            ], 64)) : (u(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          b("span", f1, w(e.title), 1),
          N($t, { open: s.value }, null, 8, ["open"])
        ], 8, u1),
        e.action ? (u(), H(ar, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (u(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          N(ye, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      b("div", h1, [
        b("div", m1, [
          (u(!0), h(K, null, ee(c.value, (m, g) => (u(), h("p", {
            key: g,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, g1 = /* @__PURE__ */ J(p1, [["__scopeId", "data-v-f2b4930d"]]), v1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, y1 = { class: "md inline" }, b1 = ["disabled", "title", "onClick"], w1 = {
  key: 1,
  class: "message-links-many"
}, k1 = ["aria-expanded"], x1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, $1 = ["disabled", "onClick"], M1 = { class: "row-pill message-links-chip" }, S1 = { class: "message-links-title" }, _1 = { key: 0 }, ga = 3, E1 = "task", A1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(() => n.total || n.links.length), o = O(() => n.links.every((m) => m.endpoint.model === E1) ? "tasks" : "items"), l = B(!1), r = B(null);
    gl(r, () => l.value = !1);
    const i = () => l.value = !l.value, c = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      c(m) || (l.value = !1, qe(m.endpoint.open_ref));
    }
    return (m, g) => (u(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ga, three: s.value === ga, open: l.value }]),
      "data-message-links": ""
    }, [
      N(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), h("span", v1, [
        b("span", y1, [
          g[1] || (g[1] = te("Linked: ", -1)),
          (u(!0), h(K, null, ee(e.links, (p) => (u(), h("button", {
            key: `${p.endpoint.model}:${p.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(p),
            title: p.endpoint.title,
            onClick: (k) => f(p)
          }, [
            te(w(p.endpoint.model.replaceAll("_", " ")) + " " + w(p.endpoint.id), 1),
            d(p) ? (u(), h(K, { key: 0 }, [
              te(" (" + w(d(p)) + ")", 1)
            ], 64)) : A("", !0),
            c(p) ? (u(), h(K, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : A("", !0)
          ], 8, b1))), 128))
        ])
      ])) : A("", !0),
      s.value >= ga ? (u(), h("span", w1, [
        b("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          te(w(s.value) + " linked " + w(o.value) + " ", 1),
          N($t, { open: l.value }, null, 8, ["open"])
        ], 8, k1)
      ])) : A("", !0),
      l.value ? (u(), h("div", x1, [
        (u(!0), h(K, null, ee(e.links, (p) => (u(), h("button", {
          key: `${p.endpoint.model}:${p.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(p),
          onClick: (k) => f(p)
        }, [
          b("span", M1, w(p.endpoint.model.replaceAll("_", " ")) + " " + w(p.endpoint.id), 1),
          b("span", S1, w(p.endpoint.title), 1),
          b("span", null, w(d(p)), 1),
          c(p) ? (u(), h("span", _1, "Unavailable")) : A("", !0)
        ], 8, $1))), 128))
      ])) : A("", !0),
      N(Zn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (p) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, C1 = /* @__PURE__ */ J(A1, [["__scopeId", "data-v-e9bc783c"]]), O1 = ["title", "aria-label"], T1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, R1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, I1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = O(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), h("svg", T1, [
        o[0] || (o[0] = b("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), h("path", R1)) : A("", !0)
      ]))
    ], 10, O1));
  }
}, B1 = /* @__PURE__ */ J(I1, [["__scopeId", "data-v-6dc92808"]]);
function L1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function rr(e, t = Date.now()) {
  const n = L1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const N1 = 36e5;
function Z5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / N1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ir(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function vo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const va = (e) => String(e).padStart(2, "0");
function D1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${va(t % 60)}s` : `${Math.floor(t / 3600)}h ${va(Math.floor(t % 3600 / 60))}m ${va(t % 60)}s`;
}
const j1 = "img,pre,table";
function P1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function q1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function F1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(j1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = P1(q1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function W1(e, t) {
  let n = null;
  const a = () => e.value && F1(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const H1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function z1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ht = "sent", U1 = 50, yo = () => ({ rows: B([]), total: B(0), next: B(null), loading: B(!1), failure: B(""), version: 0 });
function V1(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((p) => p.visible);
  };
  async function o(m, g, p = 1) {
    const k = m[g], S = ++k.version;
    k.loading.value = !0, k.failure.value = "";
    const T = g === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", q = `link list --source message:${m.id} ${T} --page ${p} --page-size ${g === Ge ? 10 : 25}`;
    try {
      const W = await e.read(q);
      if (t.get(m.id) !== m || k.version !== S) return;
      if (!W.ok) {
        k.failure.value = W.error;
        return;
      }
      const I = g === Ge ? W.value.counterparts ?? [] : W.value.rows ?? [], M = p === 1 ? I : [...k.rows.value, ...I], C = g === Ge ? (y) => `${y.endpoint.model}:${y.endpoint.id}` : (y) => y.id ?? y.target_id;
      k.rows.value = [...new Map(M.map((y) => [C(y), y])).values()], k.total.value = W.value.total ?? k.rows.value.length, k.next.value = W.value.next_page ?? null;
    } catch (W) {
      k.version === S && (k.failure.value = W.message);
    } finally {
      k.version === S && (k.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const p = [...g.dirty];
      g.dirty.clear();
      for (const k of p) o(g, k);
    }
  }
  function r(m, g = [Ge, Ht]) {
    for (const p of g) m.dirty.add(p);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), p = m.link_types ?? (m.link_type ? [m.link_type] : []), k = p.length ? [Ge, Ht].filter((T) => T === Ge ? p.some((q) => ["about", "edited"].includes(q)) : p.includes("sent_to")) : [Ge, Ht];
    if (!k.length) return;
    const S = g.length ? [...new Set(g.filter((T) => T.model === "message").map((T) => T.id))].map((T) => t.get(T)).filter(Boolean) : [...t.values()].filter(s).slice(0, U1);
    for (const T of S) r(T, k);
  }
  const c = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let p = t.get(m);
      return p || (p = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ht]), work: yo(), sent: yo() }, t.set(m, p)), p.views.add(g), p.dirty.size && r(p, [...p.dirty]), p;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), c == null || c(), xn.delete(e));
    },
    more(m, g) {
      const p = m == null ? void 0 : m[g];
      if (p != null && p.next.value && !p.loading.value) return o(m, g, p.next.value);
    }
  };
  return xn.set(e, d), d;
}
function G1(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = V1(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((p) => p.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = fe(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return hs(o), {
    links: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: O(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: O(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: O(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: O(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const K1 = ["data-incoming", "data-ref"], Y1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], J1 = { class: "message-body" }, Z1 = ["title"], Q1 = ["innerHTML"], X1 = ["title"], ep = ["innerHTML"], tp = {
  class: "message-faces",
  "data-message-faces": ""
}, np = ["title", "data-face", "onClick"], ap = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, sp = ["title", "data-reaction", "onClick"], op = {
  key: 0,
  class: "message-reaction-count"
}, lp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, rp = ["href", "title"], ip = ["src", "alt"], cp = ["href"], up = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, dp = ["disabled", "data-sent-worker", "title", "onClick"], fp = { class: "message-foot" }, hp = { class: "message-time" }, mp = {
  class: "message-id",
  "data-message-id": ""
}, pp = 140, gp = 2, vp = 1500, yp = "An earlier message", bp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(!1), o = B(null), l = O(() => ["user", "comment"].includes(n.message.type)), r = O(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), ae = ct(ve);
      return ae ? { ref: `${ae}:${me}`, label: `${Pt(ae).title.toLowerCase()} ${me}` } : null;
    }), i = O(() => n.message.worker_id ?? null), c = B(!1), d = O(() => i.value !== null && ((n.message.text ?? "").length > pp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > gp)), f = O(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, vp);
    }
    const g = Ul(), p = O(() => g(n.message.text ?? "")), k = O(() => JSON.parse(n.message.flowchart_edges || "[]")), S = B(!1), T = O(() => g(n.quote || yp));
    function q() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    W1(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, I = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, M = O(() => JSON.parse(n.message.captions || "{}")), C = O(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: I(ve), isImage: W.test(ve), title: M.value[ve] || ve }))), y = O(() => ir(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Oe(Le, null), { links: x, total: R, more: $, loading: v, failure: _, sentTo: D, sentMore: L, sentLoading: z, sentFailure: X, loadMore: re, loadSent: ie } = G1(E, () => l.value && !n.message.local ? n.message.id : null, o), he = B(!1), Ae = O(() => z1(n.message.reactions));
    function He(ve) {
      he.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (u(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      N(g1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, K1)) : (u(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      b("div", J1, [
        b("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...ae) => j(It) && j(It)(...ae))
        }, [
          r.value ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = xe((ae) => j(qe)(r.value.ref), ["stop"]))
          }, [
            N(ye, {
              name: "bubble",
              size: 12
            }),
            b("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, Z1)) : A("", !0),
          e.message.parent_id ? (u(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(q, ["stop"]),
            innerHTML: T.value
          }, null, 8, Q1)) : A("", !0),
          i.value !== null ? (u(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = xe((ae) => j(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, X1)) : A("", !0),
          b("div", {
            class: Z({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: p.value
          }, null, 10, ep),
          d.value ? (u(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = xe((ae) => c.value = !c.value, ["stop"]))
          }, w(c.value ? "Show less" : "Show more"), 1)) : A("", !0),
          k.value.length ? (u(), h(K, { key: 4 }, [
            b("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (ae) => S.value = !0)
            }, "Open the flowchart"),
            S.value ? (u(), H(Xm, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: me[5] || (me[5] = (ae) => S.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        b("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (u(), h(K, { key: 0 }, [
            b("div", tp, [
              (u(!0), h(K, null, ee(j(H1), (ae) => (u(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ye) => He(ae)
              }, w(ae), 9, np))), 128))
            ]),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (ae) => he.value = !1)
            }, [
              N(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), h(K, { key: 1 }, [
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: me[8] || (me[8] = (ae) => he.value = !0)
            }, "React"),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: me[9] || (me[9] = (ae) => a("reply", e.message))
            }, "Reply"),
            b("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, w(s.value ? "Copied" : "Copy"), 1),
            f.value ? (u(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: me[10] || (me[10] = (ae) => a("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (u(), h("div", ap, [
        (u(!0), h(K, null, ee(Ae.value, (ae) => (u(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ye) => a("react", e.message, ae.emoji)
        }, [
          te(w(ae.emoji) + " ", 1),
          ae.count > 1 ? (u(), h("span", op, w(ae.count), 1)) : A("", !0)
        ], 10, sp))), 128))
      ])) : A("", !0),
      C.value.length ? (u(), h("div", lp, [
        (u(!0), h(K, null, ee(C.value, (ae) => (u(), h(K, {
          key: ae.name
        }, [
          ae.isImage ? (u(), h("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            b("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, ip)
          ], 8, rp)) : (u(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, w(ae.name), 9, cp))
        ], 64))), 128))
      ])) : A("", !0),
      j(D).length ? (u(), h("div", up, [
        N(ye, {
          name: "send",
          size: 12
        }),
        (u(!0), h(K, null, ee(j(D), (ae) => (u(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ye) => ae.open_ref && j(qe)(ae.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + w(ae.id), 1),
          ae.unavailable ? (u(), h(K, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : A("", !0)
        ], 8, dp))), 128))
      ])) : A("", !0),
      N(Zn, {
        more: j(L),
        loading: j(z),
        failure: j(X),
        label: "More recipients",
        onMore: j(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      b("div", fp, [
        b("time", hp, w(y.value), 1),
        Number.isInteger(e.message.id) ? (u(), h(K, { key: 0 }, [
          me[11] || (me[11] = b("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          b("span", mp, "message " + w(e.message.id), 1)
        ], 64)) : A("", !0),
        l.value ? (u(), H(B1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      j(x).length || j(_) ? (u(), H(C1, {
        key: 3,
        links: j(x),
        total: j(R),
        more: j($),
        loading: j(v),
        failure: j(_),
        onMore: j(re)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : A("", !0)
    ], 8, Y1));
  }
}, Q5 = /* @__PURE__ */ J(bp, [["__scopeId", "data-v-0be1107c"]]), wp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = fi("SkeletonParts", !0);
      return u(!0), h(K, null, ee(e.parts, (i, c) => (u(), h(K, { key: c }, [
        (u(!0), h(K, null, ee(i.count, (d) => (u(), H(jt, {
          key: d,
          value: i.shape
        }, {
          line: P(() => [
            N(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            N(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            N(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            b("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            b("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            b("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            b("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            b("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), kp = /* @__PURE__ */ J(wp, [["__scopeId", "data-v-fa8baeaf"]]), xp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, $p = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), h("div", xp, [
      N(kp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Es = /* @__PURE__ */ J($p, [["__scopeId", "data-v-52f66b64"]]), Fn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ya = 200, cr = (e) => {
  var t;
  return ((t = Fn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Fn[0].key;
}, X5 = (e) => {
  var t;
  return ((t = Fn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Mp = ["aria-label"], Sp = 300, bo = 400, _p = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ya } },
  setup(e) {
    const t = e, n = O(() => cr(t.value)), a = O(() => n.value < ya ? [1, 0.25, 0.25] : n.value === ya ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= bo, high: n.value >= Sp && n.value < bo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      b("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      b("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      b("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Mp));
  }
}, e4 = /* @__PURE__ */ J(_p, [["__scopeId", "data-v-b10e610f"]]), wo = (e) => [...new Set(e.agents.map((t) => t.name))], t4 = (e) => wo(e).length === 1 ? `Worker: ${wo(e)[0]}` : "Delegated", Ep = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, ko = (e) => Ep[e.card.state] || "idle", Ap = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), xo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, $o = (e, t) => xo[ko(e)] - xo[ko(t)], Mo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, n4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => $o(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Ap(a, s)) : [...e].sort((a, s) => $o(a, s) || (Mo[t] || Mo.state)(a, s)), Cp = { class: "list-row" }, Op = {
  key: 0,
  class: "list-row-type"
}, Tp = { class: "list-row-main" }, Rp = {
  key: 0,
  class: "list-row-title"
}, Ip = { class: "list-row-body" }, Bp = {
  key: 1,
  class: "list-row-end"
}, Lp = {
  key: 1,
  class: "list-row-text"
}, Np = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", Cp, [
      e.type ? (u(), h("span", Op, w(e.type), 1)) : A("", !0),
      b("div", Tp, [
        e.title ? (u(), h("span", Rp, w(e.title), 1)) : A("", !0),
        b("div", Ip, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), h("div", Bp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (u(), h("span", Lp, w(e.text), 1)) : A("", !0)
    ]));
  }
}, a4 = /* @__PURE__ */ J(Np, [["__scopeId", "data-v-dfc8c3a7"]]), Dp = {
  claude: [
    { key: "haiku", label: "haiku", note: "fast, for mechanical work" },
    { key: "sonnet", label: "sonnet", note: "careful work without invention" },
    { key: "opus", label: "opus", note: "judgement" },
    { key: "fable", label: "fable", note: "the most demanding work, for rare occasions" }
  ],
  codex: [
    { key: "gpt-6-luna", label: "gpt-6-luna", note: "fast, for mechanical work" },
    { key: "gpt-6.1-terra", label: "gpt-6.1-terra", note: "careful work without invention" },
    { key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "judgement" },
    { key: "gpt-6-astra", label: "gpt-6-astra", note: "the most demanding work, for rare occasions" }
  ]
}, jp = { claude: "Claude Code", codex: "Codex" }, Pp = ["aria-expanded"], qp = { class: "drop-label" }, Fp = ["value"], Wp = {
  key: 1,
  class: "drop-lead"
}, Hp = { class: "drop-item-text" }, zp = {
  key: 2,
  class: "drop-note"
}, Up = {
  key: 1,
  class: "drop-none"
}, Vp = {
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
    const n = e, a = t, s = B(!1), o = B(null), l = B(""), r = O(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      b("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (u(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        b("span", qp, w(e.label), 1),
        N(ye, {
          name: "down",
          size: 11
        })
      ], 10, Pp),
      s.value ? (u(), H(Qn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (u(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Fp)) : A("", !0),
          (u(!0), h(K, null, ee(r.value, (f) => (u(), H(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: P(() => [
              f.running !== void 0 ? (u(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (u(), h("span", Wp, w(f.lead), 1)) : A("", !0),
              b("span", Hp, w(f.label), 1),
              f.note ? (u(), h("span", zp, w(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? A("", !0) : (u(), h("p", Up, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Gp = /* @__PURE__ */ J(Vp, [["__scopeId", "data-v-29dfcce5"]]), s4 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(() => [
      ...Dp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = O(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), H(Gp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${j(jp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Kp = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: Z(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, ur = /* @__PURE__ */ J(Kp, [["__scopeId", "data-v-978e0921"]]), Yp = ["aria-label"], Jp = { class: "head" }, Zp = { class: "names" }, Qp = { class: "body" }, Xp = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = El(a, n), r = Al(s);
    return (i, c) => (u(), H(fs, { to: "body" }, [
      N(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: P(() => [
          j(s) ? (u(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: j(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => j(o) && j(o)(...d), ["self"]))
          }, [
            b("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), h(K, { key: 0 }, [
                b("header", Jp, [
                  b("div", Zp, [
                    b("h2", null, w(e.title), 1),
                    e.abstract ? (u(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  N(ks, {
                    title: e.closeLabel,
                    onClick: j(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), H(ur, { key: 0 }, {
                  default: P(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : A("", !0),
                b("div", Qp, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Yp)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, o4 = /* @__PURE__ */ J(Xp, [["__scopeId", "data-v-f276f055"]]), eg = {
  key: 1,
  class: "text-field-label"
}, tg = {
  key: 2,
  class: "text-field-end"
}, ng = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Fa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = qa(e, "modelValue"), a = Jn(), s = "onUpdate:modelValue" in (((d = hi()) == null ? void 0 : d.vnode.props) || {}), o = O(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = O(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = O(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), c = B(null);
    return t({ focus: () => c.value && c.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (u(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, j(a).class]),
      style: ge(j(a).style)
    }, [
      e.icon ? (u(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (u(), h("span", eg, w(e.label), 1)) : A("", !0),
      tt(b("input", Fe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [j(Ka), o.value]
      ]),
      f.$slots.end ? (u(), h("span", tg, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : tt((u(), h("input", Fe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [j(Ka), o.value]
    ]);
  }
}), l4 = /* @__PURE__ */ J(ng, [["__scopeId", "data-v-d9c38ca8"]]), ag = { class: "title" }, sg = { class: "state" }, og = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ha(t.line, t.events);
    return (o, l) => (u(), H(Vd, {
      rows: j(n),
      failure: j(a),
      loaded: j(s),
      empty: e.empty
    }, {
      default: P(({ row: r }) => [
        b("span", ag, w(r.title), 1),
        b("span", sg, w(j(wl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, r4 = /* @__PURE__ */ J(og, [["__scopeId", "data-v-9191a6f0"]]);
function lg(e = 1e3, t = null) {
  const n = B(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ba = B(Date.now() / 1e3);
let So = 0, $n = 0;
function dr() {
  return $n || (ba.value = Date.now() / 1e3, So = setInterval(() => ba.value = Date.now() / 1e3, 1e3)), $n += 1, tl() && hs(() => {
    $n -= 1, $n || clearInterval(So);
  }), ba;
}
const rg = 200, ig = sr + Tn + or + rg;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function cg(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Ft(e),
    top: Ft(e.querySelector(".top")),
    title: Ft(e.querySelector(".title")),
    contents: Ft(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, c;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((c = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }))(getComputedStyle(e)),
    parent: Ft(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function ug(e, t, n, a) {
  fe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(cg(o, l, n.value)), performance.now() - l < ig) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const dg = ["title", "data-figure-mark", "data-folded", "data-open"], fg = {
  key: 2,
  class: "worker"
}, hg = { class: "head" }, mg = { key: 0 }, pg = {
  key: 3,
  class: "status"
}, gg = {
  key: 0,
  class: "figure"
}, vg = {
  key: 1,
  class: "ran-for"
}, yg = { key: 2 }, bg = {
  key: 3,
  class: "news"
}, wg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, kg = {
  key: 6,
  class: "settled"
}, xg = {
  key: 1,
  class: "bar"
}, $g = {
  key: 3,
  class: "detail body"
}, Mg = {
  key: 0,
  class: "body-label"
}, Sg = ["title"], _g = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Jn(), a = ["onClick", "onAct"], s = O(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = B(!1), l = O(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = O(() => t.open !== void 0), i = O(() => r.value || l.value), c = O(() => r.value ? t.open : o.value), d = O(() => r.value ? !t.open : l.value && !o.value), f = O(() => !!(t.mark.action && n.onAct)), m = O(() => i.value || f.value || !!n.onClick), g = B(null), p = B(null), { folded: k, phase: S } = lr(g, () => d.value);
    ug(g, d, S, Oe(Le, null));
    function T(ie) {
      var he, Ae;
      if (!(ie.target !== g.value && !p.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const q = (ie) => n.onAct(ie), W = ["failed", "unfinished"], I = O(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), M = O(() => t.mark.color ? t.mark.color : I.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : I.value ? `var(--tone-${I.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), C = O(() => M.value || "var(--tone-work)"), y = O(() => !t.mark.ending && !t.mark.ended && I.value !== "stopped"), E = dr(), x = O(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? D1(E.value - t.mark.began_at) : ""
    ), R = O(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${vo(he - ie, !0)}` : vo(E.value - ie, !0) : x.value;
    }), $ = ["bad", "danger", "warn"], v = O(() => $.includes(I.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], D = O(() => _.includes(I.value)), L = O(() => v.value === "process" ? "running" : D.value ? "cross" : I.value === "stopped" ? "stopped" : I.value === "good" ? "tick" : ""), z = O(
      () => !!(t.mark.figure || R.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), X = O(() => [t.mark.title, t.mark.time ? ir(t.mark.time) : ""].filter(Boolean).join(" · ")), re = O(() => ({
      ...M.value ? { "--mark": M.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (u(), h("div", Fe(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${v.value}`,
        j(S),
        {
          open: c.value,
          folding: r.value && d.value,
          live: m.value,
          failed: D.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: M.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: re.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": j(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: T
    }), [
      (u(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: p,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.markIcon ? (u(), H(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), h("span", fg, w(e.mark.worker), 1)) : A("", !0),
          b("span", hg, [
            N(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), h("strong", mg, w(e.mark.name), 1)) : A("", !0),
            i.value ? (u(), H($t, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          z.value ? (u(), h("span", pg, [
            e.mark.figure ? (u(), h("span", gg, w(e.mark.figure), 1)) : A("", !0),
            R.value ? (u(), h("span", vg, w(R.value), 1)) : A("", !0),
            e.mark.stopping ? (u(), h("span", yg, "Stopping")) : A("", !0),
            e.mark.news ? (u(), h("span", bg, w(e.mark.news), 1)) : A("", !0),
            L.value === "running" ? (u(), h("span", wg)) : L.value ? (u(), H(dt, {
              key: 5,
              class: Z(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (u(), h("span", kg, w(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (u(), H(ar, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(q, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (u(), h("span", xg, [
        b("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: C.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !j(k) ? (u(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !j(k) ? (u(), h("div", $g, [
        e.mark.bodyLabel ? (u(), h("p", Mg, w(e.mark.bodyLabel), 1)) : A("", !0),
        N(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !j(k) ? (u(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Sg)) : A("", !0),
      e.mark.card ? (u(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ue(ie.$slots, "default", {
        shown: !j(k)
      }, void 0, !0)
    ], 16, dg));
  }
}), fr = /* @__PURE__ */ J(_g, [["__scopeId", "data-v-2aa9c496"]]), Eg = 60, hr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Ag(e, t) {
  const n = B([]), a = B(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return r();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? r() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function c(d) {
    if (l || a.value <= 0 || d.scrollTop > Eg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: c };
}
const Cg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function mr(e) {
  var n;
  const t = Cg[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Og = (e) => mr(String(e).split(":")[0]), pr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Tg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Rg = { good: "good", warn: "warn", danger: "danger" }, _o = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Nd(e.target_model, e.target_id || 0)
}, Ig = { "open row": (e) => Og(e.target_model), "open page": () => mr("pages") };
function Bg(e, t) {
  const n = t || {}, a = _o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Tg[e.outcome] || "" : Rg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Ig[a](e) : "",
    handlers: a ? { onAct: () => _o[a](e) } : {}
  };
}
const Lg = 24, Ng = 1e3, Eo = 2e3, Dg = 0.25, jg = 5e3;
function Pg(e, t = Lg, n = () => !0) {
  const a = B(!1), s = B(0), o = B(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const I = c();
    return I ? I.scrollHeight - I.scrollTop - I.clientHeight : 0;
  }, f = () => !c() || d() <= t;
  function m(I) {
    if (clearTimeout(l), !I) {
      o.value = !1, i = Date.now();
      return;
    }
    const M = Date.now() - i < Eo ? Eo : Ng;
    l = setTimeout(() => o.value = a.value, M);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function p(I = !1) {
    const M = c();
    M && I && M.scrollTo ? M.scrollTo({ top: M.scrollHeight, behavior: "smooth" }) : M && (M.scrollTop = M.scrollHeight), g();
  }
  function k() {
    T(), !a.value && (a.value = !0, m(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * Dg;
  function T() {
    clearTimeout(r), S() && (r = setTimeout(() => a.value && S() && n() && p(!0), jg));
  }
  function q() {
    f() ? g() : k();
  }
  function W(I = 1, M = !1) {
    a.value ? s.value += Math.max(0, I) : p(M);
  }
  return tl() && hs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: p, left: k, scrolled: q, arrived: W };
}
const qg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Fg = (e) => String(e ?? "").replace(qg, ""), Wg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Pg(s);
    fe(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function c(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (u(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      te(w(j(Fg)(e.lines.join(`
`)) || e.empty), 1),
      j(o) ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => j(i)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, Hg = /* @__PURE__ */ J(Wg, [["__scopeId", "data-v-c2fb1783"]]), zg = 1e4;
class Ug {
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
const Vg = {
  key: 0,
  class: "frame-note"
}, Gg = {
  key: 0,
  class: "frame-note"
}, Kg = ["src", "title"], Yg = 1e3, Jg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = B(null), s = B(!1), o = B(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new Ug(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Yg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), h("p", Vg, "This window was closed because it stopped answering.")) : (u(), h(K, { key: 1 }, [
      s.value ? (u(), h("div", Gg, [
        c[2] || (c[2] = b("p", null, "This window has not answered for ten seconds.", -1)),
        N(de, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            te("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      b("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: j(n).window
      }, null, 8, Kg)
    ], 64));
  }
}, Zg = /* @__PURE__ */ J(Jg, [["__scopeId", "data-v-32a49046"]]), Mn = (e) => e ? e.split(", ") : [];
function Qg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Xg(e, t) {
  return {
    reads: Mn(e.reads_allowed),
    runs: Mn(e.runs_allowed),
    missing: [...Mn(e.reads_missing), ...Mn(e.runs_missing)],
    ask: t
  };
}
const ev = {
  class: "allowance-prompt",
  role: "dialog"
}, tv = { class: "allowance-prompt-text" }, nv = { class: "allowance-prompt-buttons" }, av = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", ev, [
      b("p", tv, w(j(Qg)(e.request)), 1),
      b("div", nv, [
        N(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        N(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            te("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, sv = /* @__PURE__ */ J(av, [["__scopeId", "data-v-cad69fe2"]]), wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        te(w(e.reason) + " ", 1),
        e.retry ? (u(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (u(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            te("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ov = ["data-window", "data-agent"], lv = {
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
    const n = e, a = t, s = B(""), o = B(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(Dc, null), i = Ou({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: O(() => n.options),
      declared: n.declared,
      page: Oe(Mu, null),
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
    nl(Le, i), fe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), mi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const c = () => Kn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (u(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), H(sv, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (u(), H(wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), H(wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), h(K, { key: 4 }, [
        (u(), H(c, { key: o.value })),
        e.skeleton.length && !j(i).answered.value ? (u(), H(Es, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (u(), H(wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, ov));
  }
}, Gt = /* @__PURE__ */ J(lv, [["__scopeId", "data-v-c4443e2b"]]), gr = {
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
    const n = e, a = t, s = { render: () => Kn(Zg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), H(Gt, {
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
}, rv = ["data-window"], vr = {
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
    const n = e, a = t, s = Ke(null), o = B("");
    return fe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, tc();
          } catch (r) {
            if (Xi(r) && ec(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      N(Es, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, rv)) : (u(), H(Gt, {
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
      onOption: r[0] || (r[0] = (i, c) => a("option", i, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, iv = "*.*", cv = {
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
    const t = e, n = Oe(Le, null), a = new Ac();
    fe(
      () => a.patterns,
      (i, c, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = O(() => !!(t.declaration.shipped || t.declaration.trusted)), r = O(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [iv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), H(vr, {
      key: 0,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), H(gr, {
      key: 1,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, uv = { class: "mark-more-inner" }, dv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, fv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, hv = {
  key: 3,
  class: "mark-lines"
}, mv = "process", Ao = "task", pv = {
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
    const t = e, n = We(), a = O(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = O(() => pr.has(t.mark.variant) && t.mark.detail || ""), o = O(() => t.mark.target_model === Ao ? t.mark.target_id : 0), l = Ag(
      hr(n),
      () => t.mark.target_id
    ), r = l.lines, i = B(!1), c = B(""), d = O(() => !t.declaration.body_url && t.mark.target_model === mv && !!t.mark.target_id);
    async function f(g = l.follow) {
      const p = await g();
      i.value = !0, c.value = p.ok ? "" : p.error;
    }
    const m = O(() => t.shown && d.value);
    return fe(m, (g) => g && f()), ps(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, p) => (u(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: p[1] || (p[1] = xe(() => {
      }, ["stop"]))
    }, [
      b("div", uv, [
        e.declaration.body_url ? (u(), H(cv, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (u(), h(K, { key: 1 }, [
          s.value ? (u(), h(K, { key: 0 }, [
            p[2] || (p[2] = b("p", { class: "mark-label" }, "Why it stopped", -1)),
            b("p", dv, w(s.value), 1)
          ], 64)) : A("", !0),
          d.value && c.value ? (u(), h("p", fv, w(c.value), 1)) : d.value && i.value ? (u(), h(K, { key: 2 }, [
            p[3] || (p[3] = b("p", { class: "mark-label" }, "Output", -1)),
            N(Hg, {
              class: "mark-terminal",
              lines: j(r),
              onOlder: j(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), h("p", hv, w(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (u(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: p[0] || (p[0] = xe((k) => j(qe)(`${Ao}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ts = /* @__PURE__ */ J(pv, [["__scopeId", "data-v-bfc56dfc"]]), gv = ["title", "aria-label", "onClick"], vv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, yv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = O(() => cd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = B(""), s = Oe(Le);
    async function o(l) {
      const r = await cn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (u(), h(K, null, [
      (u(!0), h(K, null, ee(n.value, (i) => (u(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((c) => o(i), ["stop"])
      }, [
        N(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, gv))), 128)),
      a.value ? (u(), h("span", vv, w(a.value), 1)) : A("", !0)
    ], 64));
  }
}, bv = /* @__PURE__ */ J(yv, [["__scopeId", "data-v-7a62c88e"]]);
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
const br = yr("/api/marks", "marks"), i4 = br.fetchAll, wv = br.find, kv = ["data-ref"], xv = ["data-ref"], $v = { class: "mark-row" }, Mv = "dock add", Sv = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = O(() => wv(a.mark.type)), o = O(() => Bg(a.mark, s.value)), l = O(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && pr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = B(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const c = O(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Mv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (u(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(ts, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, kv)) : (u(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        b("span", $v, [
          N(fr, Fe({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, pi(o.value.handlers), { onClick: i }), gi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: p }) => [
                N(ts, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: p
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(bv, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, xv));
    };
  }
}, _v = /* @__PURE__ */ J(Sv, [["__scopeId", "data-v-8196402d"]]), Ev = ["data-ref"], Av = ["inert"], Cv = { class: "group-fold" }, Ov = { class: "thread-group" }, Tv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = B(!1), a = B(!1), s = B(!1), o = B(null);
    fe(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = O(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (u(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      N(fr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        b("div", Cv, [
          b("div", Ov, [
            (u(!0), h(K, null, ee(e.group.marks, (c) => (u(), H(_v, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Av)) : A("", !0)
    ], 8, Ev));
  }
}, c4 = /* @__PURE__ */ J(Tv, [["__scopeId", "data-v-45b58b9b"]]);
function Rv(e) {
  const t = B(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Iv = { class: "chat-dock-fold" }, Bv = ["aria-label"], Lv = { class: "chat-dock-head" }, Nv = { class: "chat-dock-inner" }, Dv = { class: "chat-dock-foot" }, wr = 700, jv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = B(null), a = B(null), s = Rv(a), o = B(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, wr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      b("div", Iv, [
        b("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          b("header", Lv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          b("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            b("div", Nv, [
              b("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(j(s) === null ? null : { height: `${j(s)}px` })
              }, [
                b("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          b("footer", Dv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Bv)
      ])
    ], 2));
  }
}, kr = /* @__PURE__ */ J(jv, [["__scopeId", "data-v-74d44b19"]]), Pv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ka = 5, qv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ka, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ka}s`, animationDelay: `${(n - ka).toFixed(2)}s` };
    return (s, o) => (u(), h("span", Pv, [
      b("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ J(qv, [["__scopeId", "data-v-2a7bc150"]]), Fv = { reviewing: "Under review" }, Wv = (e, t) => e || Fv[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Hv = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, zv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Uv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Vv = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Gv = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Kv = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Yv = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Jv = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Zv(e, t) {
  const n = { plan: Hv, task: zv }[e], a = t != null && t.state ? $u(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[kl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Qv = (e, t) => e === "doc" || e === "report" ? Jv(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Gv(t), ...Vv(t)] : e === "check" ? Yv(t) : e === "question" ? Uv(t) : e === "memory" ? Kv(t) : Zv(e, t), $r = yr("/api/docks", "docks"), u4 = $r.fetchAll, zt = $r.find, Xv = 6, e0 = 3, xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), t0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < ea(e) || n.has(e.id)), n0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => t0(a, t, n)).sort((a, s) => a.id - s.id);
function a0(e, t, n = Xv) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const s0 = (e, t, n = e) => n < 2 ? !1 : e >= e0 ? !0 : t, o0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ns = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), l0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), r0 = (e) => ({ ...e.kept ? ns("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ns("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), i0 = ["pins"], c0 = (e) => ({ ...e, iconOnly: i0.includes(e.icon) });
function u0(e, t) {
  var n;
  return [
    ...l0(e, t) ? [r0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ns("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(c0);
}
function d0(e, t) {
  const n = u0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: o0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const f0 = ["title"], h0 = {
  key: 2,
  class: "dock-controls"
}, m0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, p0 = { class: "dock-facts" }, g0 = { key: 1 }, v0 = {
  key: 2,
  class: "dock-kept"
}, y0 = { class: "dock-acts" }, b0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = O(() => zt(a.item.type)), o = dr(), l = O(() => rr(a.item.created_at, o.value * 1e3)), r = B(null), i = B(null), c = B(null), d = B(null), f = O(() => d0(a.item, s.value)), m = We(), g = O(() => `dock.${a.item.id}`), p = O(() => m.props[g.value].data.value), k = O(() => Pn(a.item.target_model ?? "")), S = O(() => ({ ...p.value, id: a.item.target_id, noun: k.value })), T = () => {
      var E, x;
      return ((x = (E = s.value) == null ? void 0 : E.reads) == null ? void 0 : x.length) && m.reload(g.value);
    };
    Pc(nl, { data: p, reload: T, readOutput: hr(m) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (E, x, R) => {
        var v;
        T();
        const $ = (v = m.subscriptions) == null ? void 0 : v.follow(`dock ${a.item.id}`, [`${k.value.replaceAll("-", "_")}.*`], (_) => {
          (!_.row_id || _.row_id === a.item.target_id) && T();
        });
        R(() => $ == null ? void 0 : $());
      },
      { immediate: !0 }
    );
    const q = B(/* @__PURE__ */ new Set()), W = B("");
    async function I(E) {
      if (E.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      E.action === "declared" && (q.value = /* @__PURE__ */ new Set([...q.value, E.label])), W.value = "";
      const R = await cn(E, { id: a.item.target_id }, m.environment);
      (R == null ? void 0 : R.ok) === !1 && (q.value = new Set([...q.value].filter(($) => $ !== E.label)), W.value = `Could not ${E.label.toLowerCase()}: ${R.error}`);
    }
    const M = O(() => f.value.actions.filter((E) => E.action !== "undock" && !q.value.has(E.label))), C = O(() => {
      var E;
      return Wv((E = s.value) == null ? void 0 : E.badge, S.value);
    }), y = O(() => f.value.buttons.find((E) => E.action === "undock"));
    return (E, x) => {
      var R, $, v, _;
      return u(), H(kr, {
        label: f.value.title + ((R = s.value) != null && R.needs_user ? ", waiting for you" : ""),
        type: ($ = s.value) != null && $.needs_user ? "waiting" : "",
        folded: !!((v = s.value) != null && v.folds) && e.folded,
        body: !!((_ = s.value) != null && _.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: x[3] || (x[3] = (D) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (u(), H(xr, {
            key: 0,
            "ends-at": j(ea)(e.item)
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: P(() => {
          var D, L;
          return [
            (D = s.value) != null && D.draws_head && !e.collapsed ? (u(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), h(K, { key: 1 }, [
              N(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              b("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, f0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (u(), h("span", h0, [
              (u(!0), h(K, null, ee(f.value.controls, (z) => {
                var X, re;
                return u(), h(K, {
                  key: z.action + z.runs
                }, [
                  !q.value.has(z.label) && (!((X = z.variants) != null && X.length) || !((re = S.value) != null && re.state) || z.variants.includes(S.value.state)) ? (u(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: z.pressed }),
                    "aria-pressed": z.pressed,
                    "aria-label": z.label,
                    title: z.label,
                    "data-dock-action": z.action,
                    onClick: (ie) => I(z)
                  }, {
                    default: P(() => [
                      N(ye, {
                        name: z.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : A("", !0)
                ], 64);
              }), 128))
            ])) : A("", !0),
            b("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (L = s.value) != null && L.leaves_after_seconds ? A("", !0) : (u(), h(K, { key: 0 }, [
                te(w(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: P(() => [
          W.value || e.refusal ? (u(), h("p", m0, w(W.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: P(() => {
          var D, L;
          return [
            b("span", p0, [
              C.value ? (u(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(C.value), 3)) : A("", !0),
              (D = s.value) != null && D.word ? (u(), h("span", g0, w(s.value.word), 1)) : A("", !0),
              b("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (u(), h("span", v0, "Kept")) : A("", !0)
            ]),
            (L = s.value) != null && L.folds ? (u(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: x[0] || (x[0] = (z) => n("fold"))
            }, {
              default: P(() => [
                te(w(s.value.folds) + " ", 1),
                N($t, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            b("span", y0, [
              b("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              N($d, {
                name: `dock.${e.item.type}`,
                row: S.value,
                environment: j(m).environment,
                "read-only": j(m).readOnly,
                "object-name": j(Pn)(e.item.target_model),
                "external-failure": "",
                onFailure: x[1] || (x[1] = (z) => W.value = z),
                onDone: E.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), h(K, null, ee(M.value, (z) => (u(), H(de, {
                key: z.action + z.runs,
                small: "",
                variant: z.primary ? "primary" : "ghost",
                bordered: !z.primary,
                "data-dock-action": z.action,
                onClick: (X) => I(z)
              }, {
                default: P(() => [
                  te(w(z.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(de, {
                small: "",
                bordered: "",
                title: y.value.label,
                "data-dock-action": "undock",
                onClick: x[2] || (x[2] = (z) => n("undock", y.value))
              }, {
                default: P(() => [...x[4] || (x[4] = [
                  te("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: P(() => {
          var D;
          return [
            (D = s.value) != null && D.body_url ? (u(), H(ts, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: c.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : A("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Co = /* @__PURE__ */ J(b0, [["__scopeId", "data-v-28eea3b5"]]), w0 = ["title", "aria-label"], k0 = { class: "run-chip-in" }, x0 = {
  key: 0,
  class: "run-chip-ring"
}, $0 = { class: "run-chip-name" }, M0 = { class: "run-chip-bar" }, S0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = O(() => `run.${a.item.target_id}`), l = O(() => s.props[o.value].data.value), r = O(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = O(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), c = O(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), ft(() => f == null ? void 0 : f()), (m, g) => {
      var p;
      return u(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": c.value })
      }, [
        j(wt)(e.item) ? (u(), H(xr, {
          key: 0,
          "ends-at": j(ea)(e.item)
        }, null, 8, ["ends-at"])) : A("", !0),
        b("span", k0, [
          r.value ? (u(), h("span", x0)) : (u(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          b("span", $0, w(i.value), 1)
        ]),
        b("span", M0, [
          b("i", {
            style: ge({ width: r.value ? `${((p = l.value) == null ? void 0 : p.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, w0);
    };
  }
}, _0 = /* @__PURE__ */ J(S0, [["__scopeId", "data-v-df62d8b3"]]), E0 = 24, A0 = 8, d4 = 420;
function f4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= E0 ? !0 : e < t && s > A0 ? !1 : null;
}
const C0 = (e, t) => e === void 0 ? t : e, O0 = { me: 1, people: [] }, Wn = Yn({
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
  people: O0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Nn("journal.activity", !0),
  wide: !1,
  sideMini: Nn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Nl("journal.activity", () => Wn.activity);
Nl("journal.side.mini", () => Wn.sideMini);
const Mr = "journal.viewer.";
function T0(e, t, n) {
  try {
    const a = n.getItem(Mr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function R0(e, t, n) {
  try {
    n.setItem(Mr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Oo(e, t, n = window.localStorage) {
  const a = B(T0(e, t, n));
  return fe(a, (s) => R0(e, s, n), { deep: !0 }), a;
}
const I0 = {
  key: "dock-all",
  class: "dock-all"
}, B0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, L0 = { class: "dock-runs-title" }, N0 = { class: "dock-runs-chips" }, D0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var $, v;
    const t = e, n = lg(500), a = B(/* @__PURE__ */ new Set()), s = B(!1), o = B(!1), l = Oe(Le), r = B(/* @__PURE__ */ new Set()), i = B({});
    async function c(_, D) {
      i.value = { ...i.value, [_.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, _.id]);
      const L = await cn(D, { id: _.target_id }, l.environment);
      (L == null ? void 0 : L.ok) === !1 && (r.value = new Set([...r.value].filter((z) => z !== _.id)), i.value = { ...i.value, [_.id]: `Could not close this card: ${L.error}` });
    }
    const d = O(
      () => n0(
        t.items.filter((_) => !r.value.has(_.id)),
        n.value,
        a.value
      )
    ), f = O(
      () => a0(
        d.value.filter((_) => xa(_, zt)),
        n.value
      )
    ), m = O(() => d.value.filter((_) => !f.value.includes(_) && !xa(_, zt))), g = O(() => f.value.filter((_) => !wt(_))), p = Oo(`dock-size:${(($ = Wn.identity) == null ? void 0 : $.root) || location.host}`, null), k = (_) => p.value ? p.value.collapsed && !p.value.opened.includes(_.id) : t.collapsed, S = O(() => d.value.some(k)), T = O(() => (s.value = s0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(k));
    function q() {
      p.value = { collapsed: !S.value, opened: [] };
    }
    function W(_) {
      var L;
      if (!k(_)) return;
      const D = (L = p.value) != null && L.collapsed ? p.value.opened : [];
      p.value = { collapsed: !0, opened: [...D, _.id] };
    }
    const I = Oo(`dock-folded:${((v = Wn.identity) == null ? void 0 : v.root) || location.host}`, {}), M = (_) => {
      var D;
      return !!((D = zt(_.type)) != null && D.folds) && C0(I.value[_.id], xa(_, zt) || t.folded);
    };
    function C(_) {
      I.value = { ...I.value, [_.id]: !M(_) };
    }
    function y(_) {
      I.value = { ...I.value, ...Object.fromEntries(f.value.map((D) => [D.id, D.id !== _.id])) }, o.value = !0;
    }
    function E() {
      I.value = Object.fromEntries(Object.entries(I.value).filter(([_]) => !f.value.some((D) => String(D.id) === _))), o.value = !1;
    }
    function x(_) {
      a.value = /* @__PURE__ */ new Set([...a.value, _.id]);
    }
    function R(_) {
      a.value = new Set([...a.value].filter((D) => D !== _.id));
    }
    return (_, D) => (u(), H(el, {
      tag: "div",
      name: "dock",
      duration: j(wr),
      class: "dock-stack"
    }, {
      default: P(() => [
        d.value.length > 1 ? (u(), h("div", I0, [
          N(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": S.value ? "Open all" : "Collapse all",
            onClick: q
          }, {
            default: P(() => [
              N($t, {
                open: !S.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : A("", !0),
        (u(!0), h(K, null, ee(m.value, (L) => (u(), H(Co, {
          key: L.id,
          item: L,
          class: Z({ timed: j(wt)(L) }),
          leaving: j(wt)(L) && !a.value.has(L.id),
          folded: M(L),
          collapsed: k(L),
          refusal: i.value[L.id],
          onOpen: (z) => W(L),
          onFold: (z) => C(L),
          onUndock: (z) => c(L, z),
          onMouseenter: (z) => x(L),
          onMouseleave: (z) => R(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !S.value ? (u(), h("div", B0, [
          b("span", null, w(f.value.length) + " runs", 1),
          N(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: E
          }, {
            default: P(() => [
              D[1] || (D[1] = te(" Runs ", -1)),
              N($t, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (u(!0), h(K, null, ee(T.value ? [] : f.value, (L) => (u(), H(Co, {
          key: L.id,
          item: L,
          class: Z({ timed: j(wt)(L) }),
          leaving: j(wt)(L) && !a.value.has(L.id),
          folded: M(L),
          collapsed: k(L),
          refusal: i.value[L.id],
          onOpen: (z) => W(L),
          onFold: (z) => C(L),
          onUndock: (z) => c(L, z),
          onMouseenter: (z) => x(L),
          onMouseleave: (z) => R(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        T.value ? (u(), H(kr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: P(() => [
            N(ye, {
              name: "runs",
              size: 14
            }),
            b("span", L0, w(f.value.length) + " runs", 1)
          ]),
          foot: P(() => [
            b("span", N0, [
              (u(!0), h(K, null, ee(f.value, (L) => (u(), H(_0, {
                key: L.id,
                item: L,
                onClick: (z) => y(L)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: D[0] || (D[0] = (L) => o.value = !0)
            }, {
              default: P(() => [
                D[2] || (D[2] = te(" Runs ", -1)),
                N($t)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, h4 = /* @__PURE__ */ J(D0, [["__scopeId", "data-v-d078676b"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Rn = (e) => Math.min(Math.max(e, 0), 1), j0 = (e) => {
  const t = Rn(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => j0((e - t) / (n - t));
function m4(e) {
  const t = Rn(e), n = Rn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), c = Math.sin(Math.PI * Rn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function p4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const To = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, g4 = (e) => To[e] ?? To.butler, As = 2400, P0 = 0.05;
function q0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, P0), l = Math.min(t + As * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function v4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function F0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function y4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const b4 = (e, t) => ({ ...e, stretch: t.stretch }), w4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Sr = (e, t) => t >= (e.least ?? 0);
function k4(e, t, n) {
  if (!Sr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const x4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), W0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ro = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), H0 = (e) => e.right > e.left && e.bottom > e.top;
function $4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(W0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Ro(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Ro(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), H0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function _r(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const p = (o[f] - e[d]) / g, k = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(p, k)), r = Math.min(r, Math.max(p, k));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: c, on: "surface", surface: s.id, dx: i - s.left, dy: c - s.top };
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
}, en = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), z0 = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => z0(en(e, t, n)), U0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Sn = ([e, t], n) => e + n() * (t - e);
function V0(e) {
  return U0.map(() => {
    const t = Sn(it.speed, e), n = Sn(it.angle, e) * Math.PI / 180, a = Sn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Sn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const G0 = V0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function K0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function M4(e, t, n = G0) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = K0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((d, f) => d + o.velocity[f] * i);
  return c[2] -= it.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const S4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function _4(e, t) {
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
const E4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function A4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), c = i - o - e, d = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function C4(e, t, n) {
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
function O4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = q0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function T4(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function as(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ie.margin, l = ((e.along - Ie.margin + e.way * Ie.speed * n / a) / s % 2 + 2) % 2, r = Ie.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Y0(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = F0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function R4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = Y0(n, e.length), c = e.map((T, q) => ({ ...as(T, t, Math.min(n / o.fps, In(q).shot)), shot: q < i })), d = Ee(l / o.frames, o.aim), [f, m] = [c[Math.max(r - 1, 0)], c[r]], g = e.map((T, q) => ({ bug: T, index: q, seconds: n / o.fps - In(q).shot, spot: as(T, t, In(q).shot) })).filter((T) => T.seconds >= 0), p = g.flatMap((T) => {
    const q = (s == null ? void 0 : s.get(T.index)) ?? ey(T.bug, t, T.spot, s ? [] : a);
    return s == null || s.set(T.index, q), s && ty(q, T.seconds, a), ny(q, T.seconds, a);
  }), k = g.filter((T) => Q0(T.bug)).map((T) => ({ seconds: T.seconds, from: T.spot })), S = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: S }, slush: p, camera: k };
}
function In(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function I4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, d) => {
    const f = In(d), m = as(c, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), p = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), k = Math.abs(m.x - i) >= g ? i : m.x + p * g, S = p > 0 ? Math.max(i, Math.min(k, r)) : Math.min(i, Math.max(k, l)), T = { from: i, to: S, begin: f.walk, end: f.aim };
    return i = S, T;
  });
}
function B4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, J0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Z0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Q0 = (e) => e.along * 97 % 1 < $e.camera, tn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function X0(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let r = e.from;
  for (let c = 0; c < l.t; c += $e.step) {
    const d = Math.min(c + $e.step, l.t), f = tn(e, d), m = _r(r, f, n);
    if (m) return { ...m, t: c + (d - c) * m.share };
    r = f;
  }
  const i = tn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function ey(e, t, n, a = []) {
  const s = Z0(e.along + 1), [o, l] = J0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), c = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...X0(d, t, a) };
  });
}
function ty(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = _r(tn(a, o), tn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function ny(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...tn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function L4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, c]), m = Ee(e, [c, c + d]);
  return l.map((g) => {
    const p = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (p.x - n.x) * f,
      y: n.y + (p.y - n.y) * f,
      r: g.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function N4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (k) => {
    const [S, T] = [k.x - e.at.x, k.y - e.at.y];
    return { x: r.x + S * c - T * d, y: r.y + S * d + T * c };
  }, [m, g] = [...n].sort((k, S) => k.x - S.x), p = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: p.map((k, S) => ({ from: k, to: S < p.length / 2 ? m : g })) };
}
const D4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: en(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: en(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function j4(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Hn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Hn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * en(s, ...n.springs)) * (1 - en(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const P4 = (e) => e === "pack_box";
function q4(e) {
  const { into: t, out: n } = Hn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function F4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Hn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const ay = { after: 3 }, Cs = 10, sy = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, oy = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, ly = { weight: 19 }, Er = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, ry = { every: 120 }, Ar = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Cr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, iy = {
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
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Cs }), ne = (e, t, n = {}) => dn(e, "clip", t, n), $a = (e, t, n = {}) => dn(e, "look", t, n), Io = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), cy = 120, uy = 300, Ma = (e, t) => ({ ...ne(e, t), cooldown: uy }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), dy = () => [ne("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: sy[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: oy[e.name] }), ta = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...le("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), we(1)]),
  ...le("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...le("sin_fixed", { cooldown: 300 }, [ne("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...le("sin_committed", { cooldown: 300 }, [ne("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...le("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), we(7)]),
  ...le("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...le("reported", { cooldown: 90 }, [Io("read", 3), ne("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [Io("read", 3), we(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), we(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, dy()),
  ...le("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...le("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...le("launched", { cooldown: 300 }, [ne("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...le("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), we(69)]),
  ...le("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), we(2)]),
  ...le("refused", { cooldown: 20 }, [ne("shake", 1), we(1)]),
  ...le("work_done", { cooldown: 120 }, [ne("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...le("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...le("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...le("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...le("answered", { cooldown: 15 }, [$a("amused", 3), we(2)]),
  ...le("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...le("long_walk", { cooldown: 90 }, [ne("stumble", 3), we(22)]),
  ...le("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), we(13)]),
  ...le("typing", { cooldown: 60 }, [$a("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(iy).flatMap(([e, t]) => le(`reacted:${e}`, {}, [$a(t, 1)])),
  ...Object.entries(Ar).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Cr).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
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
    { ...Wt(yt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(yt(ne("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: cy }, [Ma("search", 3), { ...Ma("binoculars", 2), when: { home: !0 } }, { ...Ma("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...le("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...yt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ne("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [Wt(yt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: Er.build.cooldown }, [pe("unit", ly.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: ry.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...le("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...le("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Wt(pe("bubble", 15, {}, { stay: [30, 80] })),
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
    Wt(yt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...le("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...le("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...le("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Or = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Tr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), fy = (e) => Array.isArray(e) ? e[0] : e, hy = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, my = (e) => ta.some((t) => t.when.moment === e);
function py(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Tr(d).every(([f, m]) => n(f) >= fy(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => Or(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= ay.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ue(e, t) {
  const n = py(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Rr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Rr(e, t, n) {
  var a;
  for (const [s, o] of Tr(t)) (a = e.memory) == null || a.set(s, e.now + hy(o, n));
}
function W4(e, t, n) {
  Rr(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const H4 = (e) => Object.values(Er).find((t) => Or(t.when, e)) ?? null, gy = (e, t, n) => n - t <= (e.lifetime ?? Cs), z4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Sr(e.clip, t));
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
const ss = {
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
}, U4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Br = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), V4 = {
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
}, G4 = 120, vy = 20, K4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < vy), yy = (e) => ss[e] || ss.idle, Y4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Lr = "airborne", by = "landing", wy = "travelling", Nr = "grounded", J4 = ({ airborne: e, landing: t, trip: n }) => e ? Lr : t ? by : n != null && n.started ? wy : Nr;
function Z4(e, t) {
  var s;
  const n = ky(e, t);
  return e.mode === Nr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function ky(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Lr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...xy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : yy(c), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function xy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const os = (e) => e.outcome, $y = "plugin:code-commandments:sins:", Bo = (e) => e.type === "plugins.card" && e.markKey.startsWith($y), My = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Bo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Bo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], Q4 = (e, t) => e.filter((n) => n.author === "user" && qn(n.read_at) > t).map((n) => ({ beat: "read_message", time: qn(n.read_at), card: Zl(n) })).sort((n, a) => n.time - a.time), Lo = { user: "reacted", agent: "agent_reacted" };
function X4(e, t) {
  return e.filter((n) => Lo[n.author] && St(n) > t).map((n) => ({ beat: `${Lo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Sy = [.../* @__PURE__ */ new Set([...Object.values(Ar).flatMap((e) => Object.keys(e)), ...Object.keys(Cr)])];
function ex(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Sy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Zl(n) })).sort((n, a) => n.time - a.time);
}
const _y = (e) => new Ir(e).isTest(), zn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[os(e)] || "";
}, Ey = 1800, Ay = (e, t) => {
  if (zn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && zn(n) !== "finished" && Number(e.time) - Number(n.time) <= Ey ? "tests_fixed" : "tests_passed";
};
function tx(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(_y), s = a.filter((r) => zn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, zn(r))), o.map((r) => ({ beat: Ay(r, s), time: Number(r.time), card: r.key }));
}
function nx(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(os(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: os(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const ax = (e) => e.map((t) => {
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
function sx(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function ox(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function lx(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = My.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Os(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const No = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Cy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Os(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function rx(e, t, n, a = {}) {
  const s = Ue({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : my(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function ix(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const Do = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function cx(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, c = Do((r - i) / Te.returnSeconds), d = r <= i ? Do(r / i) : 1 - c, f = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const jo = 3, Dr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Po = 12, ux = (e, t) => ({ mood: e, began: t, seen: 0 });
function dx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Dr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= jo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Po) / Po, lasts: jo } };
}
const fx = (e) => e.posture === "hang" && !Dr(e.face), Oy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Ty = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function hx(e, t, n) {
  return Oy.has(e) ? 1 / 0 : !Ty.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(jr(n - t.began, t.share) - Xe.lead, 0);
}
const Ry = 5;
function mx(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Ry ? { beat: "long_walk", time: n } : null };
}
const Iy = 30, _n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function px(e, t, n, a, s = null) {
  if (t && n < t.until || !_n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ue({ moment: "spell", state: e, tally: s }, a), [l, r] = _n.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + _n.every } : { state: e, began: 0, until: 0, next: n + _n.every };
}
const gx = (e, t, n) => t && n < t.until && Br.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, jr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function vx(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = jr(o, e.share);
  return s ? { eager: By(t, l), moment: null } : l > Xe.lead ? { eager: t, moment: null } : l < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ue({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function By(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Ly = 1, Ny = { look: "look", gaze: "gaze" };
function Dy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ue({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Ny[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const jy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ue({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Py = (e, t, n, a, s, o = 0) => Ue({ moment: "jump", high: e > Ly * t, memory: a, now: s, room: o }, n).name === "backflip", qy = { work: ["building"], idle: ["standing"] };
function yx(e, t, n, a) {
  const s = ss[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(qy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Br.has(e) ? { moments: o, began: n || a } : (n && a - n >= Iy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Fy(e, t, n) {
  return !Ue({ moment: "pondering", memory: e, now: t }, n) || !Ue({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ue({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const qo = { pondering: Fy };
function bx(e, t, n, a, s, o) {
  if (qo[e.beat]) {
    const r = qo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Dy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Cs && { lifetime: l.lifetime } } } : null;
}
function wx(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = jy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const kx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function xx(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function $x(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Mx = (e, t) => !!(e != null && e.watches) && !t.once, Sx = 10, _x = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || gy(a, a.queuedAt, n)), Ex = (e, t) => t ? null : e[0] ?? null;
function Ax(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Cx = (e, t) => !t.during || !e.some((n) => n.during === t.during), Wy = 2 * Math.PI, Hy = 500;
function Ox(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Hy, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, d = t && !c ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Wy * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, k = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Uy(g, t, n, m, s) : Gy(g, t, n, m) : t) ?? g, S = k != null && k.behind && k.mood === "reading" ? zy(e.point, k, n, l, s) : k;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: f, at: a };
}
function zy(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, p = g + l(c - g), k = Math.min(Math.max(a / 1e3, 0), 0.1), S = Te.turnSpeed * k, T = f ? g + Math.min(Math.max(p - g, -S), S) : p, q = f ? e.readingFollow + m : T, W = q + (T - q) * (1 - Math.exp(-k / Te.followSeconds)), I = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, M = o(Os(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), C = Math.min(Math.max(M, -I.up), I.down), y = Te.tipSpeed * k, E = f ? e.readingPitch + Math.min(Math.max(C - e.readingPitch, -y), y) : C;
  return { ...t, readingYaw: T, readingFollow: W, readingPitch: E, readingFacing: r };
}
function Uy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (q) => {
    const { yaw: W, pitch: I } = Os(q.x - n.x, s, n.y - q.y, o);
    return { yaw: W, pitch: Math.min(Math.max(I, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [No(r(e)), No(r(t))], d = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [p, k, S] = i.map((q, W) => m * q + g * c[W]), T = s * p / k;
  return { ...t, x: n.x + T, y: n.y - Cy(T, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Vy = 0.15;
function Tx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Vy;
}
function Gy(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Ky = (e) => !(e != null && e.on);
function Rx(e, t, n) {
  if (Ky(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const nn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Sa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Fo = (e) => e * e * (3 - 2 * e);
function Yy(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Sa(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, a = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Fo(Sa(e, ...Je.fade)), lit: a, white: e < Je.flash[0] ? 0 : 1 - Fo(Sa(e, ...Je.flash)) };
}
const Ix = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Bx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Yy(t - e.at);
  return a && { colour: nn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...a } };
}
function Lx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Nx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= nn.looks || a === null && n - e.since >= nn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function Dx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, jx = { behind: 39, figure: 40, ahead: 41 }, Jy = "[data-figure-pile]", Zy = { amber: [1, 0.69, 0.125], good: nn.colours.good, bad: nn.colours.bad }, Bn = { phases: 4, ms: 230, dim: 0.25 }, Px = (e, t, n) => e !== "amber" || (t + n) % Bn.phases < Bn.phases / 2 ? 1 : Bn.dim, qx = (e) => e === "amber" ? Bn.phases : 1;
function Fx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Wx = Object.keys(Zy), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function Hx(e) {
  const t = Ve.least + Math.floor(e() * (Ve.most - Ve.least + 1));
  return Array.from({ length: Math.min(t, Ve.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ve.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Ut(Ve.start, e), l = Ut(Ve.reach, e);
    return {
      text: Ue({ moment: "digit" }, e).name,
      x: a * o,
      y: Ve.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Ut(Ve.moveMs, e)),
      fadeMs: Math.round(Ut(Ve.fadeMs, e))
    };
  });
}
const _a = { high: 3, gap: 1 };
function zx(e) {
  const t = Math.floor(e / _a.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + _a.gap)), up: e % _a.high * (rt.height - rt.top) };
}
const Qy = (e, t, n) => Ue({ moment: "unit", memory: e, now: t }, n) !== null, Xy = { after: 5 }, eb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ir(t).isBuild());
function Ux(e, t, n) {
  const a = eb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Xy.after ? s : null;
}
function Vx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Qy(n, a, s) } : null;
}
const Wo = { ahead: 140, up: 70 };
function Gx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Wo.ahead, y: a - Wo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ea = { least: 4e3, most: 1e4 }, tb = (e) => Ea.least + e() * (Ea.most - Ea.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Kx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = tb(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const Yx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Jx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Zx = new Set(ta.filter((e) => Pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), nb = (e) => e.some((t) => t.state === "built"), Qx = (e, t) => nb(t) ? e.filter((n) => !Pr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, ab = (e, t) => t <= e - ut.reach + 2, Xx = (e, t, n) => ab(e, n) ? t - ut.reach : e - ut.reach - ut.room, e$ = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Aa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, t$ = (e) => Ut(e() < Aa.longShare ? Aa.long : Aa.short, e), sb = 2 * rt.width;
function n$(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= sb ? o : e + (o - e + s / 2) % s;
}
const ob = 60, a$ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= ob, Ho = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Ho);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ho)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, lb = "[data-figure-docked-bars]", rb = "[data-figure-chat-foot]", ib = [0.85, 0.6, 0.35, 0.15], cb = ["question", "waiting", "suggestion"], s$ = (e, t) => cb.find((n) => e[n] > 0 && t[n] === "behind") || null;
function o$() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const ub = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", db = "[data-figure-newest]";
function qr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(db), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ts(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function an(e, t, n = qr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ce.top * t.size, bottom: a.top + Ce.bottom * t.size }, l = xt.gap;
  return !na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function l$(e, t, n, a = qr()) {
  if (!a || an(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Is * e.size : Kr * e.size, c = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= c && m.x <= d && an(m, e, a) && qb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Ca = 0.26, Fr = 0.54, fb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ca, travels: "stand" },
  lounge: { drop: Ca, travels: "stand" },
  composed: { drop: Ca, travels: "stand" },
  hang: { drop: Fr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, r$ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * fb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fr
}), Kt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), hb = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), i$ = (e, t) => (e === "sit" ? hb.has(t) : Kt.has(e)) ? e : "stand";
function c$(e, t) {
  return e.facing === t.facing || !Kt.has(e.posture) && !Kt.has(t.posture) ? t : { posture: "stand", facing: Kt.has(e.posture) ? e.facing : t.facing };
}
const u$ = 0.25, d$ = (e, t) => Kt.has(e) && hn[t].drop === 0, Wr = 2, mb = 90, pb = 180, gb = 140, vb = 280, yb = 420, bb = 0.25, wb = 290, kb = 600, xb = "cubic-bezier(0.2, 0.7, 0.4, 1)", $b = "cubic-bezier(0.55, 0, 0.9, 0.6)", Oa = 5;
function Un(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Oa) return null;
  (l || r) && (o = Math.max(o, Wr));
  const g = o > 1, p = Math.abs(t.x - e.x), k = p < Oa ? 0 : p / (mb * o) * 1e3, S = Math.min(k, g ? gb : pb), T = Math.abs(t.y - e.y), q = t.y < e.y, W = q && !m && Py(T, n, i, c, d, f), I = q ? yb + Math.min(T, 400) * bb : Math.sqrt(2 * T / As) * 1e3, M = {
    x: t.x,
    y: t.y,
    ms: T > Oa ? W ? kb : I : 0,
    lead: W ? wb : q ? vb : 0,
    easing: q ? xb : $b,
    hopping: !0,
    clip: W ? "backflip" : q ? "jump" : "fall"
  }, C = { x: t.x, y: t.y, ms: k + S, lead: 0, easing: "linear", ramp: S, ...g ? { clip: "run" } : {} }, y = m ? Mb(t, n) : M, E = q && !a ? [{ ...C, y: e.y }, y] : [{ ...M, x: e.x }, C];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: g };
}
const Mb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Sb = (e, t) => e.postures.includes(t) ? t : e.postures[0], f$ = (e, t, n) => e.posture === "walk" && n ? "walk" : Sb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - hn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ts = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const En = 0.5, zo = 20;
function h$(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + zo && a.right <= n.right - zo;
}
function Rs(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - En && r <= n.right + En && a.top >= n.top - En && i <= n.bottom + En;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, _b = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + _b * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Eb(e, { size: t }, n = At()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Is = (Ce.right - Ce.left) / 2 + 0.08;
function m$(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Ab = "[data-figure-agent]";
function Hr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Ts(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[i].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, i), c.setEnd(o, i + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Bs(e, t, n = "") {
  if (!an(e, t)) return Vn.length * Gn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(ub)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Ts(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return zr(s).filter(([r, i]) => l(r, i) || Hr(r, i, n)).length;
}
function Cb(e, t) {
  const n = at(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Hr(a, s, "", Ab)).length;
}
const Uo = 4;
function p$(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Uo; o <= s; o += Uo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Cb(r, e) && an(r, e)) return r;
    }
  return null;
}
function sn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Rs(l, t, a) && an(l, t)).map((l) => ({ spot: l, covered: Bs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Ur = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Ob = [0.5, 0.25, 0.75], Tb = (e) => Ur(e.getBoundingClientRect(), Ob), Vr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Rb = Is, Ib = (e, t, { size: n }, a = Rb) => Gr(e, Vr[t], a * n, "stand");
function Gr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Bb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Kr = 0.1, Lb = (e, t, { size: n }) => Gr(e, Bb[t], Kr * n, "sit"), Nb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ta = 60;
function g$(e, t) {
  const n = Nb(t);
  return !e.aside || Math.abs(n) >= Ta ? t : n < 0 ? 360 - Ta : Ta;
}
const Yt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Db = (e) => [.../* @__PURE__ */ new Set([e, ...Yt.turns.map((t) => (t + 360) % 360)])];
function v$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Db(t), l = Yt.every[0] + a() * (Yt.every[1] - Yt.every[0]);
  return { face: t, from: s ? jb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function jb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Yt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function y$(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => mn(Lb(a, r, e), e)).filter((r) => n && Rs(r, e) && !Bs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function b$(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Yr } : e;
}
const Yr = 7;
function Jr() {
  const e = [...document.querySelectorAll(Jy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Pb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function qb(e, t) {
  const n = Jr();
  return !n || !na(Pb(e, t), n);
}
const Fb = 4;
function sa() {
  const e = pn(), t = Jr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Fb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yr - n, 0) } };
}
const w$ = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Eb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ls = (e, t) => Object.keys(Vr).map((n) => mn(Ib(e, n, t), t)), Ls = (e, t) => Ur(e, ib).map((n) => mn(n, t)), Zr = (e, t, n) => sn(e, t, n) ?? e[0];
function k$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Zr(ls(a, e), e, t), view: null, on: n };
}
function x$(e, t, n, a) {
  const { element: s, edge: o } = sa(), l = (a ? ls(o, t) : [...ls(o, t), ...Ls(o, t)]).filter(
    (c) => !na(at(c, t), e)
  ), r = sn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Bs(r, t) ? r : sn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(lb);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Vo = { within: 2 };
function $$(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Vo.within || a.left + a.width < s.left + s.width - Vo.within;
}
const Wb = "[data-figure-closing]";
function M$() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Wb));
}
const Qr = "[data-figure-progress]";
function S$(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function _$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Hb = { across: 300, above: 380, below: 60 };
function E$(e) {
  const { across: t, above: n, below: a } = Hb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: zb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const zb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Xr = "[data-figure-bar]", rs = { back: 144, along: 0.4 };
function A$(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(Xr) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function C$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < rs.along * a.size ? t.x + rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function O$(e) {
  const t = e.querySelector(Xr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function oa() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function T$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Ub(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Ub(e, t, n, a, s) {
  const o = Ls(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return sn(r.length ? r : o, t, n);
}
const Vb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function R$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Wr));
  const g = (W) => {
    const I = at(W, n, hn[W.posture].travels);
    return { x: I.left, y: I.top };
  }, p = t.ladder ?? e.ladder;
  if (p && !(t.ladder && e.ladder)) return Gb(g(e), g(t), g({ ...p.foot, posture: "stand" }), p.way, !!t.ladder, n, s);
  const [k, ...S] = [e, ...i, t].map(g), T = Un(k, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: d, room: f, pogo: m }), q = S.slice(1).map((W, I) => {
    var M;
    return (M = Un(S[I], W, n.size, { random: r, memory: c, now: d, room: f })) == null ? void 0 : M.legs.find((C) => C.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...q.filter(Boolean)] };
}
function Gb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Vb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Un(e, n, o.size, { pace: l }) : Un(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function I$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function B$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && sn(Tb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Zr(Ls(s, t), t, n), view: null, on: a };
}
const Kb = "[data-figure-bubble]", Yb = 250;
let Jt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ei = 0;
const qt = () => Jt, Ra = /* @__PURE__ */ new WeakMap();
let Jb = 0;
function Ns(e) {
  return Ra.has(e) || Ra.set(e, `floor-${++Jb}`), Ra.get(e);
}
const Zb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Qb = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Xb(e, t) {
  var a;
  const n = (a = e.querySelector(rb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function ew(e, t) {
  const n = e && Xb(e, t), a = e ? [...e.querySelectorAll(Kb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Zb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ns(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const tw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Yb ? (t.top - a.top) / s * 1e3 : 0;
};
function ti(e = Jt, t = performance.now()) {
  const n = At(), a = Qb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = oa();
  return c.element && i.push({ id: Ns(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...ew(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: tw(e, d, t) }))) });
}
const is = /* @__PURE__ */ new Set();
function nw(e) {
  return is.add(e), () => is.delete(e);
}
function aw() {
  ni();
  const e = () => {
    ei = requestAnimationFrame(e), !document.hidden && (Jt = ti(Jt), is.forEach((t) => t(Jt)));
  };
  e();
}
function ni() {
  cancelAnimationFrame(ei);
}
const Ds = 5, sw = 56, ow = { share: 0.6 }, lw = (e) => -Math.sqrt(2 * As * ow.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function L$(e, t = ti().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ns(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function ai({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const c = Nt(i, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || rw(c, d, o)) && iw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const js = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, rw = (e, t, n) => !js({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function N$(e, t = qt().floors) {
  if (!js(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ds && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function iw(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Rs(e, t);
}
function D$(e, t, n, a = qt().floors) {
  const s = ai(e, n, a);
  if (!e.home) return cw(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Ds ? "dropping" : -l > sw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function cw(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: lw(e.risen) };
  if (!n) return null;
  if (js(t) && n.y - t.y > Ds) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function j$(e, t, n) {
  const a = Is * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function P$(e, t, n, a = qt().floors) {
  const s = t && ai(t, n, a);
  return s ? { ...e, ...s } : e;
}
const uw = ["data-type"], dw = { class: "figure-floor-name" }, fw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      b("span", dw, w(e.floor.type), 1)
    ], 12, uw));
  }
}, hw = /* @__PURE__ */ J(fw, [["__scopeId", "data-v-4e0f1e2e"]]), mw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, pw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(qt().floors);
    let n = () => {
    };
    return Re(() => {
      n = nw((a) => t.value = a.floors), aw();
    }), Be(() => {
      n(), ni();
    }), (a, s) => (u(), h("div", mw, [
      (u(!0), h(K, null, ee(t.value, (o) => (u(), H(hw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, q$ = /* @__PURE__ */ J(pw, [["__scopeId", "data-v-e519168b"]]), Ia = (e) => typeof e == "number" ? e : Date.parse(e);
function F$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ia(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ia(s.row.created_at) - Ia(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const gw = 3, Ba = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function vw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ba[n.grouping]) == null ? void 0 : a.call(Ba, e.row, n)) || "";
}
function yw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function W$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= gw ? [yw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = vw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const bw = 1e3;
function ww() {
  const e = B(Date.now()), t = setInterval(() => e.value = Date.now(), bw);
  return ft(() => clearInterval(t)), e;
}
const kw = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = ww(), a = O(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(j(rr)(e.at, j(n))), 9, kw));
  }
};
function H$(e) {
  const t = We(), n = t.option("row"), a = B(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function xw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const z$ = (e) => (t) => t.filter((n) => n.id !== e), U$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), V$ = (e) => (t) => [...t, e], G$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function K$(e, t = {}) {
  const n = We(), a = B(null), s = B("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function Y$(e) {
  const t = We(), n = B("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const An = /* @__PURE__ */ new Map();
function $w(e, t) {
  if (An.has(e)) return An.get(e);
  const n = t().finally(() => An.delete(e));
  return An.set(e, n), n;
}
function J$() {
  const e = We(), t = B(null), n = B("");
  async function a() {
    const s = await $w(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Mw = { class: "cards-page" }, Sw = { class: "cards-bar" }, _w = { class: "cards-count" }, Ew = { class: "cards" }, Aw = {
  key: 1,
  class: "cards-note"
}, Cw = {
  key: 2,
  class: "cards-note"
}, Ow = ["data-row", "onClick"], Tw = { class: "card-head" }, Rw = { class: "card-title" }, Iw = { class: "card-foot" }, Bw = {
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
    return (a, s) => (u(), h("div", Mw, [
      b("div", Sw, [
        b("span", _w, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(de, Fe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            N(ye, {
              name: "plus",
              size: 12
            }),
            te(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      b("div", Ew, [
        e.loaded ? e.failure ? (u(), h("p", Aw, w(e.failure), 1)) : e.rows.length ? A("", !0) : (u(), h("p", Cw, "No " + w(e.noun) + "s yet", 1)) : (u(), H(_t, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), h(K, null, ee(e.rows, (o) => (u(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          b("span", Tw, [
            N(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + w(e.head(o)), 1),
            N(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          b("span", Rw, w(e.title(o)), 1),
          b("span", Iw, w(e.foot(o)), 1)
        ], 8, Ow))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Z$ = /* @__PURE__ */ J(Bw, [["__scopeId", "data-v-990e6b37"]]), Go = "newest";
function Q$(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Oe(Le, null)) == null ? void 0 : c.search, s = B(""), o = B(Go), l = B("all"), r = O(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => xw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Go ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = O(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Lw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Nw = 40, Dw = "top", jw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Le, null)) == null ? void 0 : f.autoScroll, s = O(() => a === Dw), o = B(null), l = B(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Nw;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (u(), h("div", Lw, [
      b("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      N(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: P(() => [
          tt(b("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            N(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = te(" Newest ", -1))
          ], 512), [
            [al, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, X$ = /* @__PURE__ */ J(jw, [["__scopeId", "data-v-3accb764"]]), Pw = ["aria-selected", "data-tab", "onClick"], qw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Fw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Le, null), o = O(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = B(null), r = B({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function c(m) {
      var p;
      const g = (p = l.value) == null ? void 0 : p.querySelector(".inner-tab.on");
      if (!g) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: g.offsetLeft, width: g.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => mt(() => c(!0));
    let f = null;
    return Re(() => {
      var m;
      c(!1), f = new ResizeObserver(() => c(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => c(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), fe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), fe(() => n.answer, d, { deep: !0 }), (m, g) => (u(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), h(K, null, ee(o.value, (p) => {
        var k, S;
        return u(), h("button", {
          key: p.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((k = e.active) == null ? void 0 : k.key) === p.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === p.key,
          "data-tab": p.key,
          onClick: (T) => a("choose", p)
        }, [
          te(w(p.label) + " ", 1),
          i(p) ? (u(), h("span", qw, w(e.answer[p.count_field]), 1)) : A("", !0)
        ], 10, Pw);
      }), 128)),
      b("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, e8 = /* @__PURE__ */ J(Fw, [["__scopeId", "data-v-63fcd326"]]), Ww = {
  class: "tab-body",
  "data-tab-body": ""
}, Hw = { "data-tab-content": "" }, zw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = B(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ms(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), h("div", Ww, [
      n.value ? (u(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      tt(b("div", Hw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [al, !n.value]
      ])
    ]));
  }
}, t8 = /* @__PURE__ */ J(zw, [["__scopeId", "data-v-63876533"]]), Uw = {}, Vw = { class: "menu-label" };
function Gw(e, t) {
  return u(), h("span", Vw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const cs = /* @__PURE__ */ J(Uw, [["render", Gw], ["__scopeId", "data-v-aa955b3e"]]), Kw = {
  class: "search-bar",
  "data-search-bar": ""
}, Yw = { class: "search-bar-control" }, Jw = ["value", "placeholder", "aria-label"], Zw = ["aria-expanded"], Qw = {
  key: 0,
  "data-menu-count": ""
}, Xw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var T;
    const a = e, s = n, o = vi(), l = ((T = Oe(Le, null)) == null ? void 0 : T.search) ?? {}, r = O(() => l.placeholder || a.placeholder), i = l.context ?? [], c = B(null), d = B(null), f = B([]), m = O(() => f.value.length ? f.value[f.value.length - 1].next : i), g = O(() => !!o.menu || i.length > 0), p = (q) => {
      f.value = [], d.value = d.value ? null : q.currentTarget;
    };
    function k(q) {
      if (q.next.length) {
        f.value = [...f.value, q];
        return;
      }
      d.value = null, s("pick", q.click);
    }
    function S() {
      var q;
      s("update:modelValue", ""), (q = c.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = c.value) == null ? void 0 : q.focus();
    } }), (q, W) => {
      var I;
      return u(), h("div", Kw, [
        b("div", Yw, [
          N(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          b("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: W[0] || (W[0] = (M) => s("update:modelValue", M.target.value)),
            onKeydown: Zt(S, ["esc"])
          }, null, 40, Jw),
          e.modelValue ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            N(ye, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          g.value ? (u(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: p
          }, [
            e.menuCount ? (u(), h("span", Qw, w(e.menuCount), 1)) : A("", !0),
            N(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Zw)) : A("", !0)
        ]),
        (I = j(l).button) != null && I.title ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (M) => s("pick", j(l).button.click))
        }, w(j(l).button.title), 1)) : A("", !0),
        ue(q.$slots, "default", {}, void 0, !0),
        d.value ? (u(), H(Qn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = xe(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (M) => d.value = null)
        }, {
          default: P(() => [
            f.value.length ? (u(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (M) => f.value = f.value.slice(0, -1))
            }, {
              default: P(() => [
                te("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (u(!0), h(K, null, ee(m.value, (M) => (u(), H(Mt, {
              key: M.title,
              description: M.subtext,
              "data-search-entry": M.title,
              onClick: (C) => k(M)
            }, {
              default: P(() => [
                te(w(M.title) + w(M.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ue(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, ek = /* @__PURE__ */ J(Xw, [["__scopeId", "data-v-45374bed"]]), tk = {
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
    return (o, l) => (u(), H(ek, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: P(() => [
        N(cs, null, {
          default: P(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), h(K, null, ee(a, (r) => N(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: P(() => [
            te(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), h(K, { key: 0 }, [
          N(cs, null, {
            default: P(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), h(K, null, ee(s, (r) => N(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: P(() => [
              te(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: P(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, n8 = /* @__PURE__ */ J(tk, [["__scopeId", "data-v-dab0064d"]]);
function a8() {
  const e = B(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const s8 = (e) => import(
  /* @vite-ignore */
  e
), nk = 86400, us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function ak(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((us(t) - us(e)) / nk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function o8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = us(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: ak(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const La = 280, Na = 240, Da = 120, sk = 6, ok = 14, on = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function lk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function si(e, t) {
  const n = Math.max(0, lk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function rk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${ok}px)` }), e.offsetHeight, e.style.transition = `height ${La}ms ${on}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (c) return;
    n() && (t.scrollTop = si(t, e));
    const m = s() - r;
    if (!i && m >= La && (i = !0, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${on}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < La + Na) return a(f);
    d();
  };
  return a(f), d;
}
function l8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${sk}px)` }), e.offsetHeight, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${on}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = si(t, e)), s() - l < Da) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const ik = 140, Cn = 220, Ko = 5;
function r8({ gap: e = ik, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Ko);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const c = (d, f, m, g = rk) => {
    if (l || !f.pane || !f.follows()) return m();
    const p = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, r(p, () => o = t(i, e));
    d.style.display = "none", n.push(p), n.length >= Ko && c.flush();
  };
  return c.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, c;
}
function i8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Cn}ms ${on}, opacity ${Cn}ms ease-in, margin ${Cn}ms ${on}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Cn);
}
const oi = "chat.pins.minimised", Ln = B(Nn(oi, !1));
function Yo(e) {
  Ln.value = e, xs(oi, e);
}
function ck(e) {
  const t = O(() => e()), n = O(() => Ln.value ? [] : e()), a = () => Yo(!Ln.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Yo(!1)
  ), { pins: t, visible: n, minimised: Ln, toggle: a };
}
const uk = ["title"], dk = {
  key: 0,
  class: "pins-count"
}, fk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = ck(() => t.pinRows);
    return (o, l) => j(n).length ? (u(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: j(a), inline: e.inline }]),
      title: j(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => j(s) && j(s)(...r), ["stop"]))
    }, [
      N(ye, {
        name: j(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      j(a) ? (u(), h("span", dk, w(j(n).length), 1)) : A("", !0)
    ], 10, uk)) : A("", !0);
  }
}, c8 = /* @__PURE__ */ J(fk, [["__scopeId", "data-v-d073c504"]]), hk = ["title"], mk = ["title"], pk = { class: "diff-card-dir" }, gk = { class: "diff-card-name" }, vk = ["title"], yk = ["title"], bk = {
  key: 0,
  class: "diff-card-note"
}, wk = ["href"], kk = ["src", "alt"], xk = { class: "diff-card-rows" }, $k = { class: "diff-row-num" }, Mk = { class: "diff-row-sign" }, Sk = { class: "diff-row-code" }, _k = {
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
    function o(R) {
      (R.metaKey || R.ctrlKey) && (R.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = O(() => n.path.lastIndexOf("/") + 1), c = O(() => n.path.slice(0, i.value)), d = O(() => n.path.slice(i.value)), f = O(() => n.change === "deleted"), m = O(() => l[n.change]), g = O(() => new Set(n.rows.filter((R) => R.line_type === "add").map((R) => R.line))), p = B("after"), k = O(() => p.value === "before" ? n.whole.old : n.whole.text), S = O(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((R, $) => ({ line_type: p.value === "after" && g.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: R })) : n.rows.filter(
      (R) => !(n.editsOnly && ["ctx", "fold"].includes(R.line_type)) && !(n.hideRemovals && R.line_type === "del")
    )), T = B(!1), q = O(() => n.lines && !T.value && !n.whole), W = O(() => q.value ? S.value.slice(0, n.lines) : S.value), I = O(() => S.value.length - W.value.length), M = (R) => R.line === null || R.line_type === "del" ? "" : R.line, C = (R) => R.line_type === "fold" ? R.hidden ? `⋯ ${R.hidden} lines` : "⋯" : R.text, y = B(null), E = B(null);
    let x = null;
    return Re(() => {
      if (!E.value) return;
      let R = !0;
      x = new ResizeObserver(() => {
        !y.value || !E.value || (y.value.style.transition = R ? "none" : "", y.value.style.height = `${E.value.offsetHeight}px`, R = !1);
      }), x.observe(E.value);
    }), Be(() => x && x.disconnect()), (R, $) => (u(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      b("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: $[2] || ($[2] = (v) => !f.value && a("fold"))
      }, [
        b("span", {
          class: "diff-card-path",
          title: `${e.path} · ${j(s)}-click to open it`,
          onClick: o
        }, [
          b("span", pk, w(c.value), 1),
          b("span", gk, w(d.value), 1),
          m.value ? (u(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : A("", !0)
        ], 8, mk),
        b("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        b("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        N(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: p.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = xe((v) => p.value = p.value === "after" ? "before" : "after", ["stop"]))
        }, w(p.value === "after" ? "After" : "Before"), 9, vk)) : A("", !0),
        f.value ? A("", !0) : (u(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = xe((v) => a("whole"), ["stop"]))
        }, [
          N(ye, {
            name: "file",
            size: 12
          })
        ], 10, yk))
      ], 8, hk),
      e.whole && e.whole.error ? (u(), h("p", bk, w(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (u(), h(K, { key: 1 }, [
        e.picture ? (u(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          b("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, kk)
        ], 8, wk)) : (u(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          b("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            b("div", xk, [
              (u(!0), h(K, null, ee(W.value, (v, _) => (u(), h("div", {
                key: _,
                class: Z(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                b("span", $k, w(M(v)), 1),
                b("span", Mk, w(r[v.line_type]), 1),
                b("span", Sk, w(C(v)), 1)
              ], 2))), 128)),
              I.value > 0 ? (u(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = xe((v) => T.value = !0, ["stop"]))
              }, w(I.value) + " more " + w(I.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, u8 = /* @__PURE__ */ J(_k, [["__scopeId", "data-v-23581cbb"]]), Ek = {
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
    const n = t, a = e, s = O(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = O(() => s.value && { render: () => Kn(Em, { line: s.value.line, events: s.value.events }) }), l = B(null), r = O(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = O(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = O(
      () => {
        var m, g;
        return l.value ? Xg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return fe(
      () => {
        var m, g;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), c.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, g) => {
      var p, k;
      return !s.value && ((p = e.catalogue.loaded) == null ? void 0 : p.value) === !1 ? (u(), H(Es, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((k = s.value) == null ? void 0 : k.shows) === "one-agent" && e.agent === null ? (u(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), H(Gt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), H(vr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (S, T) => n("option", S, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), H(gr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (S, T) => n("option", S, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), H(Gt, {
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
        onOption: g[2] || (g[2] = (S, T) => n("option", S, T))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), H(Gt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (S) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ak = ["data-section"], Ck = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Su, null), a = O(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = O(() => ({ row: t.row }));
    return (o, l) => (u(!0), h(K, null, ee(a.value, (r) => (u(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(Ek, {
        name: r.name,
        catalogue: j(n).catalogue,
        subscriptions: j(n).subscriptions,
        environment: j(n).environment,
        prompts: j(n).prompts,
        "shell-read": j(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Ak))), 128));
  }
}, Ok = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: P(() => [
        N(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Tk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Rk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Ik = { class: "ask-text" }, Bk = ["placeholder", "aria-label"], Lk = ["placeholder", "aria-label"], Nk = {
  key: 3,
  class: "moves"
}, Dk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = O(() => Qv(a.noun, a.row)), l = B(""), r = B(null), i = B(""), c = B("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, p = "") {
      const k = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, p] : g.positional ? [p] : [], ...g.opener && c.value.trim() ? ["--on", c.value.trim()] : []]);
      l.value = k.ok ? "" : k.error, k.ok && (r.value = null, i.value = "", c.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, p) => o.value.length ? (u(), H(ur, {
      key: 0,
      inline: e.inline
    }, {
      default: P(() => {
        var k;
        return [
          l.value ? (u(), h("p", Tk, w(l.value), 1)) : A("", !0),
          (k = r.value) != null && k.confirm ? (u(), h("div", Rk, [
            b("span", Ik, w(r.value.confirm), 1),
            N(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: p[0] || (p[0] = (S) => d(r.value))
            }, {
              default: P(() => [
                te(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            N(de, {
              small: "",
              variant: "ghost",
              onClick: p[1] || (p[1] = (S) => r.value = null)
            }, {
              default: P(() => [...p[7] || (p[7] = [
                te("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (u(), h("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: xe(m, ["prevent"])
          }, [
            tt(b("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (S) => i.value = S),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: p[3] || (p[3] = Zt(xe((S) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Bk), [
              [Wa, i.value]
            ]),
            r.value.opener ? tt((u(), h("input", {
              key: 0,
              "onUpdate:modelValue": p[4] || (p[4] = (S) => c.value = S),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: p[5] || (p[5] = Zt(xe((S) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Lk)), [
              [Wa, c.value]
            ]) : A("", !0),
            N(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: P(() => [
                te(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            N(de, {
              small: "",
              variant: "ghost",
              onClick: p[6] || (p[6] = (S) => r.value = null)
            }, {
              default: P(() => [...p[8] || (p[8] = [
                te("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (u(), h("div", Nk, [
            (u(!0), h(K, null, ee(o.value, (S) => (u(), H(de, {
              key: S.word,
              small: !S.bordered,
              bordered: S.bordered,
              icon: S.icon,
              variant: S.main ? "primary" : "ghost",
              class: Z({ danger: S.danger }),
              "data-move": S.word,
              onClick: (T) => f(S)
            }, {
              default: P(() => [
                te(w(S.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : A("", !0);
  }
}, jk = /* @__PURE__ */ J(Dk, [["__scopeId", "data-v-bdac0207"]]), Pk = /* @__PURE__ */ new Set(["completed", "cancelled"]), qk = (e) => Pk.has(e), ln = (e) => qk(e) ? "done" : e, Fk = { class: "facts" }, Wk = { class: "fact wide" }, Hk = ["title"], zk = {
  key: 1,
  class: "fact-value"
}, Uk = {
  key: 0,
  class: "fact"
}, Vk = { class: "fact-value" }, Gk = { class: "fact" }, Kk = { class: "fact-label" }, Yk = ["title"], Jk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Zk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Qk = {
  key: 2,
  class: "fact"
}, Xk = { class: "fact-value" }, e2 = { class: "fact wide" }, t2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, n2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Fn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return u(), h("div", Fk, [
        b("div", Wk, [
          l[3] || (l[3] = b("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (c) => j(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + w(e.place.plan_id) + ": " + w(e.place.plan_title), 9, Hk)) : (u(), h("span", zk, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (u(), h("div", Uk, [
          l[4] || (l[4] = b("span", { class: "fact-label" }, "Phase", -1)),
          b("span", Vk, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (u(), h(K, { key: 1 }, [
          b("div", Gk, [
            b("span", Kk, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            b("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (c) => j(qe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Yk)
          ]),
          j(s).has(e.task.state) ? (u(), h("p", Jk, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), h("p", Zk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), h("div", Qk, [
          l[5] || (l[5] = b("span", { class: "fact-label" }, "Assigned to", -1)),
          b("span", Xk, "Agent " + w(e.task.holder_id), 1)
        ])) : A("", !0),
        b("div", e2, [
          l[6] || (l[6] = b("span", { class: "fact-label" }, "Priority", -1)),
          N(rn, {
            options: j(n),
            value: String(j(cr)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (c) => a("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), h("p", t2, w(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, a2 = /* @__PURE__ */ J(n2, [["__scopeId", "data-v-fa2fd03f"]]);
function s2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const o2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, l2 = { ...o2, done: "Completed" }, r2 = { class: "task-status-icon" }, i2 = ["width", "height", "aria-label"], c2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = O(() => kl("task", ln(t.status))), a = O(() => n.value === "testing" ? "started" : n.value), s = O(() => l2[t.status] ?? wl("task", t.status));
    return (o, l) => (u(), h("span", r2, [
      N(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (u(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            N(jt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
                b("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                b("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: P(() => [...l[1] || (l[1] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                b("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: P(() => [...l[2] || (l[2] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: P(() => [...l[3] || (l[3] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                b("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: P(() => [...l[4] || (l[4] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                b("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                b("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: P(() => [...l[5] || (l[5] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                b("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, i2))
        ]),
        _: 1
      })
    ]));
  }
}, Ps = /* @__PURE__ */ J(c2, [["__scopeId", "data-v-ae24a63f"]]), u2 = { class: "number" }, d2 = { class: "title" }, f2 = { class: "word" }, h2 = {
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
    return (a, s) => (u(), H(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        N(Ps, { status: e.status }, null, 8, ["status"]),
        b("span", u2, w(e.number), 1),
        b("span", d2, w(e.title), 1),
        b("span", f2, w(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ja = /* @__PURE__ */ J(h2, [["__scopeId", "data-v-f6417ae8"]]), m2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, p2 = { class: "level" }, g2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = O(() => s2(n.task.id, n.graph)), l = O(() => s.value ? o.value.above : o.value.above.slice(-1)), r = O(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = O(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: ln(f.state), number: f.id, title: f.title, word: m ? "This task" : c(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (u(), h("section", m2, [
      m[5] || (m[5] = b("h4", null, "What waits on what", -1)),
      (u(!0), h(K, null, ee(l.value, (g) => (u(), h(K, {
        key: g.map((p) => p.id).join()
      }, [
        b("div", p2, [
          (u(!0), h(K, null, ee(g, (p) => (u(), H(ja, Fe({
            key: p.id,
            ref_for: !0
          }, d(p), {
            onSelect: m[0] || (m[0] = (k) => a("select", k))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = b("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      N(ja, yi(bi(d(e.task, !0))), null, 16),
      (u(!0), h(K, null, ee(r.value, (g) => (u(), h(K, {
        key: g.id
      }, [
        m[4] || (m[4] = b("div", { class: "waits" }, "↓ waits on", -1)),
        N(ja, Fe({ ref_for: !0 }, d(g), {
          onSelect: m[1] || (m[1] = (p) => a("select", p))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (g) => s.value = !s.value)
      }, w(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : A("", !0)
    ])) : A("", !0);
  }
}, v2 = /* @__PURE__ */ J(g2, [["__scopeId", "data-v-db05c4b2"]]), y2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, b2 = ["datetime"], w2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), h("section", y2, [
      n[0] || (n[0] = b("h3", null, "Block history", -1)),
      (u(!0), h(K, null, ee(e.renewals, (a) => (u(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        b("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, b2),
        b("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, k2 = /* @__PURE__ */ J(w2, [["__scopeId", "data-v-b41f213b"]]), x2 = {
  class: "part",
  "data-resource-waits": ""
}, $2 = ["onClick"], M2 = { class: "wait-id" }, S2 = { class: "wait-title" }, _2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", x2, [
      b("h4", null, w(e.title), 1),
      (u(!0), h(K, null, ee(e.waits, (o) => (u(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Ps, {
          status: j(ln)(o.state),
          size: 12
        }, null, 8, ["status"]),
        b("span", M2, w(o.id), 1),
        b("span", S2, w(o.title), 1)
      ], 8, $2))), 128))
    ]));
  }
}, Jo = /* @__PURE__ */ J(_2, [["__scopeId", "data-v-8fb2e251"]]), E2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, A2 = { class: "text" }, C2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, O2 = 180, T2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = B(!1), l = O(() => a.task.waits.filter((i) => !n.has(i.state))), r = O(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), h(K, null, [
      l.value.length ? (u(), H(Jo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), h("section", E2, [
        c[3] || (c[3] = b("h4", null, "How it was done", -1)),
        b("p", A2, w(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (u(), h("section", C2, [
        c[4] || (c[4] = b("h4", null, "The brief", -1)),
        b("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > O2 && !o.value ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0),
      r.value.length ? (u(), H(Jo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0)
    ], 64));
  }
}, R2 = /* @__PURE__ */ J(T2, [["__scopeId", "data-v-4a3f1e79"]]), I2 = {
  class: "task-details",
  "data-task-details": ""
}, B2 = { class: "since" }, L2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, N2 = { class: "text" }, D2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, j2 = {
  key: 1,
  class: "note"
}, P2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, q2 = { class: "text" }, F2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), h("div", I2, [
        b("div", {
          class: Z(["state-line", j(ln)(e.task.state)])
        }, [
          b("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Ps, {
              status: j(ln)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + w(a(e.task.state)), 1)
          ]),
          b("span", B2, [
            o[4] || (o[4] = te(" since ", -1)),
            N(la, {
              at: j(Ql)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), h("section", L2, [
          o[5] || (o[5] = b("span", { class: "label" }, "Blocked, waiting on", -1)),
          b("p", N2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), h("p", D2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (u(), h("p", j2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), h("section", P2, [
          o[6] || (o[6] = b("span", { class: "label" }, "Why it was cancelled", -1)),
          b("p", q2, w(e.task.reason), 1)
        ])) : A("", !0),
        e.graph ? (u(), H(v2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : A("", !0),
        N(a2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(R2, {
          task: e.task,
          onSelect: o[3] || (o[3] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(k2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, W2 = /* @__PURE__ */ J(F2, [["__scopeId", "data-v-7ce5b829"]]), H2 = 50, z2 = { messages: 25 }, U2 = (e) => z2[e] || H2, V2 = {
  class: "task-log",
  "aria-label": "Task log"
}, G2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, K2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Y2 = { class: "entries" }, J2 = ["datetime"], Z2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Q2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = B([]), a = B(1), s = B(!0), o = B(!0), l = B("");
    let r = 0;
    async function i(c = 1) {
      const d = ++r;
      a.value = c, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(U2("task_logs")),
        "--page",
        String(c)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return fe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), ft(() => {
      r += 1;
    }), (c, d) => (u(), h("section", V2, [
      o.value ? (u(), H(_t, { key: 0 })) : l.value ? (u(), h(K, { key: 1 }, [
        b("p", G2, w(l.value), 1),
        N(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: P(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), h(K, { key: 2 }, [
        n.value.length ? A("", !0) : (u(), h("p", K2, "No log entries yet.")),
        b("ol", Y2, [
          (u(!0), h(K, null, ee(n.value, (f) => (u(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            b("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, J2),
            b("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), h("nav", Z2, [
          N(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: P(() => [...d[4] || (d[4] = [
              te("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          b("span", null, "Page " + w(a.value), 1),
          N(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: P(() => [...d[5] || (d[5] = [
              te("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, X2 = /* @__PURE__ */ J(Q2, [["__scopeId", "data-v-98b3a6b1"]]), e5 = { class: "comment-side-head" }, t5 = {
  key: 0,
  class: "comment-none"
}, n5 = { key: 0 }, a5 = {
  key: 1,
  class: "comment-none"
}, s5 = {
  class: "comment",
  "data-comment": ""
}, o5 = {
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
    return (t, n) => (u(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      b("header", e5, [
        n[2] || (n[2] = b("h3", null, "Comments", -1)),
        N(ks, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), h("p", t5, "No comments yet")) : A("", !0),
      (u(!0), h(K, null, ee(e.comments, (a) => (u(), h("section", {
        key: a.id
      }, [
        a.quote ? (u(), h("blockquote", n5, w(a.quote), 1)) : A("", !0),
        a.revision ? (u(), h("span", a5, "Revision " + w(a.revision), 1)) : A("", !0),
        b("p", s5, w(e.words(a)), 1)
      ]))), 128)),
      N(Zn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, l5 = /* @__PURE__ */ J(o5, [["__scopeId", "data-v-276284a3"]]);
var Xo;
/Mac|iPhone|iPad/.test(((Xo = navigator.userAgentData) == null ? void 0 : Xo.platform) || navigator.platform);
function r5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const i5 = ["placeholder"], c5 = { class: "actions" }, u5 = { class: "error" }, d5 = {
  key: 1,
  class: "card closed"
}, f5 = { class: "mark" }, h5 = { class: "prompt" }, m5 = {
  key: 0,
  class: "draft"
}, p5 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Fa({
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
  emits: /* @__PURE__ */ Fa(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = qa(e, "draft"), l = qa(e, "error"), r = B(!!l.value), i = B(!1), c = B(!1), d = B(null);
    async function f() {
      var p, k;
      r.value = !0, i.value = !1, await mt(), (k = ((p = d.value) == null ? void 0 : p.querySelector("input")) || d.value) == null || k.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const p = o.value.trim();
      if (!(!p || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(p), r.value = !1, i.value = !0;
        } catch (k) {
          o.value = p, l.value = k.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: f }), (p, k) => (u(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Zt(m, ["esc"])
      }, [
        ue(p.$slots, "who", {}, void 0, !0),
        tt(b("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": k[0] || (k[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: k[1] || (k[1] = Zt((S) => j(r5)(S, g), ["enter"]))
        }, null, 40, i5), [
          [Wa, o.value]
        ]),
        b("div", c5, [
          b("span", u5, w(l.value), 1),
          N(de, {
            small: "",
            onClick: m
          }, {
            default: P(() => [...k[3] || (k[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          N(de, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: P(() => [...k[4] || (k[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), h("div", d5, [
        b("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          b("span", f5, [
            N(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          b("span", h5, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), h("span", m5, "Draft kept")) : A("", !0)
        ]),
        e.count ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[2] || (k[2] = (S) => s("show"))
        }, [
          b("span", null, w(j(lu)(e.count, "comment")), 1),
          N(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, g5 = /* @__PURE__ */ J(p5, [["__scopeId", "data-v-b68baddd"]]);
function v5(e, t) {
  const n = B([]), a = B(!1), s = B(null), o = B(0), l = B(!1), r = B("");
  let i = 0, c = 0;
  const d = (p) => {
    if (typeof p.body == "string") return p.body;
    const { noun: k, id: S, title: T } = e(), q = `On ${k} ${S}, ${T}: `;
    return p.text.startsWith(q) ? p.text.slice(q.length) : p.text;
  };
  async function f(p = 1) {
    const { noun: k, id: S } = e();
    if (!S) return;
    const T = ++c;
    l.value = !0, r.value = "";
    try {
      const q = await t([k, "comments", String(S), "--page", String(p), "--page-size", "25"]);
      if (T !== c) return;
      if (!q.ok) {
        r.value = q.error;
        return;
      }
      const W = q.value.rows ?? [], I = p === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(I.map((M) => [M.id, M])).values()], o.value = q.value.total ?? n.value.length, s.value = q.value.next_page ?? null;
    } catch (q) {
      T === c && (r.value = q.message);
    } finally {
      T === c && (l.value = !1);
    }
  }
  async function m(p) {
    var M;
    const { noun: k, id: S } = e(), T = `${k}:${S}`, q = { id: `sending-${++i}`, text: p };
    n.value = [...n.value, q], o.value++, a.value = !0;
    const W = await t([k, "comment", String(S), p]);
    if (T !== `${e().noun}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((C) => C.id !== q.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await f();
    const I = (M = W.value) == null ? void 0 : M.id;
    I && !n.value.some((C) => C.id === I) && (n.value = [...n.value, { ...q, id: I }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const y5 = { class: "top" }, b5 = {
  class: "crumb",
  "data-task-crumb": ""
}, w5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, k5 = {
  key: 1,
  class: "body"
}, x5 = { class: "summary" }, $5 = { class: "stamp" }, M5 = {
  class: "title",
  "data-resource-title": ""
}, S5 = {
  class: "tabs",
  "data-task-tabs": ""
}, _5 = { class: "panels" }, E5 = {
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
    const a = e, s = n, o = B(null), l = B(null), r = B(null), i = B(""), c = B(""), d = B(null), f = B(null), m = B("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], p = v5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (M) => a.read(M)
    );
    let k = 0;
    const S = O(() => {
      var M;
      return (M = l.value) != null && M.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function T() {
      const M = ++k, [C, y, E] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      M === k && (i.value = C.ok ? "" : C.error, o.value = C.ok ? C.value : null, l.value = y.ok ? y.value : null, r.value = E.ok ? E.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", T();
      },
      { immediate: !0 }
    ), fe(() => a.changes, T), fe(p.open, (M) => {
      M && (m.value = "comments");
    });
    async function q(M) {
      const C = o.value.priority;
      o.value.priority = Number(M);
      const y = await a.read(["task", "edit", String(a.id), "--priority", M]);
      if (c.value = y.ok ? "" : y.error, y.ok) return T();
      o.value.priority = C;
    }
    function W(M) {
      d.value = null, f.value.press(M);
    }
    const I = (M) => {
      var C;
      return ((C = f.value) == null ? void 0 : C.moves.length) && (d.value = M);
    };
    return t({ openStatus: I }), (M, C) => (u(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      b("div", y5, [
        e.backed ? (u(), H(Ok, {
          key: 0,
          onBack: C[0] || (C[0] = (y) => s("back"))
        })) : A("", !0),
        b("span", b5, w(S.value), 1),
        C[10] || (C[10] = b("span", { class: "grow" }, null, -1)),
        e.stepped ? (u(), h(K, { key: 1 }, [
          N(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: C[1] || (C[1] = (y) => s("step", -1))
          }, {
            default: P(() => [
              N(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          N(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: C[2] || (C[2] = (y) => s("step", 1))
          }, {
            default: P(() => [
              N(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        N(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: C[3] || (C[3] = (y) => s("close"))
        }, {
          default: P(() => [
            N(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (u(), h("p", w5, w(i.value), 1)) : o.value ? (u(), h(K, { key: 2 }, [
        N(jk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: T
        }, null, 8, ["id", "row", "read"]),
        b("header", x5, [
          b("div", $5, [
            te(" Task " + w(o.value.id) + " · updated ", 1),
            N(la, {
              at: j(Ql)(o.value)
            }, null, 8, ["at"])
          ]),
          b("h3", M5, w(o.value.title), 1)
        ]),
        b("div", S5, [
          N(rn, {
            options: g,
            value: m.value,
            onPick: C[4] || (C[4] = (y) => m.value = y)
          }, null, 8, ["value"])
        ]),
        b("div", _5, [
          N(jt, { value: m.value }, {
            details: P(() => [
              N(W2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: c.value,
                onStatus: I,
                onPriority: q,
                onSelect: C[5] || (C[5] = (y) => s("select", y))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              N(Ck, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              N(su, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: C[6] || (C[6] = (y) => s("select", y))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: P(() => [
              N(l5, {
                below: "",
                comments: j(p).comments.value,
                words: j(p).words,
                more: !!j(p).nextPage.value,
                loading: j(p).loading.value,
                failure: j(p).failure.value,
                onMore: j(p).loadMore,
                onClose: C[7] || (C[7] = (y) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: P(() => [
              N(X2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(g5, {
          send: j(p).send,
          count: j(p).total.value,
          onShow: C[8] || (C[8] = (y) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (u(), h("div", k5, [
        N(_t)
      ])),
      d.value ? (u(), H(Qn, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: C[9] || (C[9] = (y) => d.value = null)
      }, {
        default: P(() => [
          N(cs, null, {
            default: P(() => [
              te("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (u(!0), h(K, null, ee(f.value.moves, (y) => (u(), H(Mt, {
            key: y.word,
            onClick: (E) => W(y)
          }, {
            default: P(() => [
              te(w(y.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, d8 = /* @__PURE__ */ J(E5, [["__scopeId", "data-v-93316116"]]);
function A5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Pa = { exports: {} }, Zo;
function C5() {
  return Zo || (Zo = 1, (function(e, t) {
    var n = (function() {
      var a = function(M, C) {
        var y = 236, E = 17, x = M, R = o[C], $ = null, v = 0, _ = null, D = [], L = {}, z = function(U, V) {
          v = x * 4 + 17, $ = (function(F) {
            for (var G = new Array(F), Y = 0; Y < F; Y += 1) {
              G[Y] = new Array(F);
              for (var Q = 0; Q < F; Q += 1)
                G[Y][Q] = null;
            }
            return G;
          })(v), X(0, 0), X(v - 7, 0), X(0, v - 7), he(), ie(), He(U, V), x >= 7 && Ae(U), _ == null && (_ = ae(x, R, D)), ve(_, V);
        }, X = function(U, V) {
          for (var F = -1; F <= 7; F += 1)
            if (!(U + F <= -1 || v <= U + F))
              for (var G = -1; G <= 7; G += 1)
                V + G <= -1 || v <= V + G || (0 <= F && F <= 6 && (G == 0 || G == 6) || 0 <= G && G <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= G && G <= 4 ? $[U + F][V + G] = !0 : $[U + F][V + G] = !1);
        }, re = function() {
          for (var U = 0, V = 0, F = 0; F < 8; F += 1) {
            z(!0, F);
            var G = r.getLostPoint(L);
            (F == 0 || U > G) && (U = G, V = F);
          }
          return V;
        }, ie = function() {
          for (var U = 8; U < v - 8; U += 1)
            $[U][6] == null && ($[U][6] = U % 2 == 0);
          for (var V = 8; V < v - 8; V += 1)
            $[6][V] == null && ($[6][V] = V % 2 == 0);
        }, he = function() {
          for (var U = r.getPatternPosition(x), V = 0; V < U.length; V += 1)
            for (var F = 0; F < U.length; F += 1) {
              var G = U[V], Y = U[F];
              if ($[G][Y] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? $[G + Q][Y + oe] = !0 : $[G + Q][Y + oe] = !1;
            }
        }, Ae = function(U) {
          for (var V = r.getBCHTypeNumber(x), F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            $[Math.floor(F / 3)][F % 3 + v - 8 - 3] = G;
          }
          for (var F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            $[F % 3 + v - 8 - 3][Math.floor(F / 3)] = G;
          }
        }, He = function(U, V) {
          for (var F = R << 3 | V, G = r.getBCHTypeInfo(F), Y = 0; Y < 15; Y += 1) {
            var Q = !U && (G >> Y & 1) == 1;
            Y < 6 ? $[Y][8] = Q : Y < 8 ? $[Y + 1][8] = Q : $[v - 15 + Y][8] = Q;
          }
          for (var Y = 0; Y < 15; Y += 1) {
            var Q = !U && (G >> Y & 1) == 1;
            Y < 8 ? $[8][v - Y - 1] = Q : Y < 9 ? $[8][15 - Y - 1 + 1] = Q : $[8][15 - Y - 1] = Q;
          }
          $[v - 8][8] = !U;
        }, ve = function(U, V) {
          for (var F = -1, G = v - 1, Y = 7, Q = 0, oe = r.getMaskFunction(V), se = v - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if ($[G][se - ke] == null) {
                  var Se = !1;
                  Q < U.length && (Se = (U[Q] >>> Y & 1) == 1);
                  var ce = oe(G, se - ke);
                  ce && (Se = !Se), $[G][se - ke] = Se, Y -= 1, Y == -1 && (Q += 1, Y = 7);
                }
              if (G += F, G < 0 || v <= G) {
                G -= F, F = -F;
                break;
              }
            }
        }, me = function(U, V) {
          for (var F = 0, G = 0, Y = 0, Q = new Array(V.length), oe = new Array(V.length), se = 0; se < V.length; se += 1) {
            var ke = V[se].dataCount, Se = V[se].totalCount - ke;
            G = Math.max(G, ke), Y = Math.max(Y, Se), Q[se] = new Array(ke);
            for (var ce = 0; ce < Q[se].length; ce += 1)
              Q[se][ce] = 255 & U.getBuffer()[ce + F];
            F += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = c(Q[se], Ne.getLength() - 1), qs = De.mod(Ne);
            oe[se] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < oe[se].length; ce += 1) {
              var Fs = ce + qs.getLength() - oe[se].length;
              oe[se][ce] = Fs >= 0 ? qs.getAt(Fs) : 0;
            }
          }
          for (var Ws = 0, ce = 0; ce < V.length; ce += 1)
            Ws += V[ce].totalCount;
          for (var ra = new Array(Ws), gn = 0, ce = 0; ce < G; ce += 1)
            for (var se = 0; se < V.length; se += 1)
              ce < Q[se].length && (ra[gn] = Q[se][ce], gn += 1);
          for (var ce = 0; ce < Y; ce += 1)
            for (var se = 0; se < V.length; se += 1)
              ce < oe[se].length && (ra[gn] = oe[se][ce], gn += 1);
          return ra;
        }, ae = function(U, V, F) {
          for (var G = d.getRSBlocks(U, V), Y = f(), Q = 0; Q < F.length; Q += 1) {
            var oe = F[Q];
            Y.put(oe.getMode(), 4), Y.put(oe.getLength(), r.getLengthInBits(oe.getMode(), U)), oe.write(Y);
          }
          for (var se = 0, Q = 0; Q < G.length; Q += 1)
            se += G[Q].dataCount;
          if (Y.getLengthInBits() > se * 8)
            throw "code length overflow. (" + Y.getLengthInBits() + ">" + se * 8 + ")";
          for (Y.getLengthInBits() + 4 <= se * 8 && Y.put(0, 4); Y.getLengthInBits() % 8 != 0; )
            Y.putBit(!1);
          for (; !(Y.getLengthInBits() >= se * 8 || (Y.put(y, 8), Y.getLengthInBits() >= se * 8)); )
            Y.put(E, 8);
          return me(Y, G);
        };
        L.addData = function(U, V) {
          V = V || "Byte";
          var F = null;
          switch (V) {
            case "Numeric":
              F = m(U);
              break;
            case "Alphanumeric":
              F = g(U);
              break;
            case "Byte":
              F = p(U);
              break;
            case "Kanji":
              F = k(U);
              break;
            default:
              throw "mode:" + V;
          }
          D.push(F), _ = null;
        }, L.isDark = function(U, V) {
          if (U < 0 || v <= U || V < 0 || v <= V)
            throw U + "," + V;
          return $[U][V];
        }, L.getModuleCount = function() {
          return v;
        }, L.make = function() {
          if (x < 1) {
            for (var U = 1; U < 40; U++) {
              for (var V = d.getRSBlocks(U, R), F = f(), G = 0; G < D.length; G++) {
                var Y = D[G];
                F.put(Y.getMode(), 4), F.put(Y.getLength(), r.getLengthInBits(Y.getMode(), U)), Y.write(F);
              }
              for (var Q = 0, G = 0; G < V.length; G++)
                Q += V[G].dataCount;
              if (F.getLengthInBits() <= Q * 8)
                break;
            }
            x = U;
          }
          z(!1, re());
        }, L.createTableTag = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + V + "px;", F += '">', F += "<tbody>";
          for (var G = 0; G < L.getModuleCount(); G += 1) {
            F += "<tr>";
            for (var Y = 0; Y < L.getModuleCount(); Y += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + U + "px;", F += " height: " + U + "px;", F += " background-color: ", F += L.isDark(G, Y) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, L.createSvgTag = function(U, V, F, G) {
          var Y = {};
          typeof arguments[0] == "object" && (Y = arguments[0], U = Y.cellSize, V = Y.margin, F = Y.alt, G = Y.title), U = U || 2, V = typeof V > "u" ? U * 4 : V, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-title" : null;
          var Q = L.getModuleCount() * U + V * 2, oe, se, ke, Se, ce = "", Ne;
          for (Ne = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += Y.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += G.text || F.text ? ' role="img" aria-labelledby="' + Ye([G.id, F.id].join(" ").trim()) + '"' : "", ce += ">", ce += G.text ? '<title id="' + Ye(G.id) + '">' + Ye(G.text) + "</title>" : "", ce += F.text ? '<description id="' + Ye(F.id) + '">' + Ye(F.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < L.getModuleCount(); ke += 1)
            for (Se = ke * U + V, oe = 0; oe < L.getModuleCount(); oe += 1)
              L.isDark(ke, oe) && (se = oe * U + V, ce += "M" + se + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, L.createDataURL = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = L.getModuleCount() * U + V * 2, G = V, Y = F - V;
          return I(F, F, function(Q, oe) {
            if (G <= Q && Q < Y && G <= oe && oe < Y) {
              var se = Math.floor((Q - G) / U), ke = Math.floor((oe - G) / U);
              return L.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(U, V, F) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var G = L.getModuleCount() * U + V * 2, Y = "";
          return Y += "<img", Y += ' src="', Y += L.createDataURL(U, V), Y += '"', Y += ' width="', Y += G, Y += '"', Y += ' height="', Y += G, Y += '"', F && (Y += ' alt="', Y += Ye(F), Y += '"'), Y += "/>", Y;
        };
        var Ye = function(U) {
          for (var V = "", F = 0; F < U.length; F += 1) {
            var G = U.charAt(F);
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
          var F = L.getModuleCount() * V + U * 2, G = U, Y = F - U, Q, oe, se, ke, Se, ce = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ne = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, De = "";
          for (Q = 0; Q < F; Q += 2) {
            for (se = Math.floor((Q - G) / V), ke = Math.floor((Q + 1 - G) / V), oe = 0; oe < F; oe += 1)
              Se = "█", G <= oe && oe < Y && G <= Q && Q < Y && L.isDark(se, Math.floor((oe - G) / V)) && (Se = " "), G <= oe && oe < Y && G <= Q + 1 && Q + 1 < Y && L.isDark(ke, Math.floor((oe - G) / V)) ? Se += " " : Se += "█", De += U < 1 && Q + 1 >= Y ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return F % 2 && U > 0 ? De.substring(0, De.length - F - 1) + Array(F + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return L.createASCII = function(U, V) {
          if (U = U || 1, U < 2)
            return li(V);
          U -= 1, V = typeof V > "u" ? U * 2 : V;
          var F = L.getModuleCount() * U + V * 2, G = V, Y = F - V, Q, oe, se, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), Ne = "", De = "";
          for (Q = 0; Q < F; Q += 1) {
            for (se = Math.floor((Q - G) / U), De = "", oe = 0; oe < F; oe += 1)
              ke = 1, G <= oe && oe < Y && G <= Q && Q < Y && L.isDark(se, Math.floor((oe - G) / U)) && (ke = 0), De += ke ? Se : ce;
            for (se = 0; se < U; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, L.renderTo2dContext = function(U, V) {
          V = V || 2;
          for (var F = L.getModuleCount(), G = 0; G < F; G++)
            for (var Y = 0; Y < F; Y++)
              U.fillStyle = L.isDark(G, Y) ? "black" : "white", U.fillRect(G * V, Y * V, V, V);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(M) {
          for (var C = [], y = 0; y < M.length; y += 1) {
            var E = M.charCodeAt(y);
            C.push(E & 255);
          }
          return C;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(M, C) {
        var y = (function() {
          for (var x = q(M), R = function() {
            var ie = x.read();
            if (ie == -1) throw "eof";
            return ie;
          }, $ = 0, v = {}; ; ) {
            var _ = x.read();
            if (_ == -1) break;
            var D = R(), L = R(), z = R(), X = String.fromCharCode(_ << 8 | D), re = L << 8 | z;
            v[X] = re, $ += 1;
          }
          if ($ != C)
            throw $ + " != " + C;
          return v;
        })(), E = 63;
        return function(x) {
          for (var R = [], $ = 0; $ < x.length; $ += 1) {
            var v = x.charCodeAt($);
            if (v < 128)
              R.push(v);
            else {
              var _ = y[x.charAt($)];
              typeof _ == "number" ? (_ & 255) == _ ? R.push(_) : (R.push(_ >>> 8), R.push(_ & 255)) : R.push(E);
            }
          }
          return R;
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
        var M = [
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
        ], C = 1335, y = 7973, E = 21522, x = {}, R = function($) {
          for (var v = 0; $ != 0; )
            v += 1, $ >>>= 1;
          return v;
        };
        return x.getBCHTypeInfo = function($) {
          for (var v = $ << 10; R(v) - R(C) >= 0; )
            v ^= C << R(v) - R(C);
          return ($ << 10 | v) ^ E;
        }, x.getBCHTypeNumber = function($) {
          for (var v = $ << 12; R(v) - R(y) >= 0; )
            v ^= y << R(v) - R(y);
          return $ << 12 | v;
        }, x.getPatternPosition = function($) {
          return M[$ - 1];
        }, x.getMaskFunction = function($) {
          switch ($) {
            case l.PATTERN000:
              return function(v, _) {
                return (v + _) % 2 == 0;
              };
            case l.PATTERN001:
              return function(v, _) {
                return v % 2 == 0;
              };
            case l.PATTERN010:
              return function(v, _) {
                return _ % 3 == 0;
              };
            case l.PATTERN011:
              return function(v, _) {
                return (v + _) % 3 == 0;
              };
            case l.PATTERN100:
              return function(v, _) {
                return (Math.floor(v / 2) + Math.floor(_ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(v, _) {
                return v * _ % 2 + v * _ % 3 == 0;
              };
            case l.PATTERN110:
              return function(v, _) {
                return (v * _ % 2 + v * _ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(v, _) {
                return (v * _ % 3 + (v + _) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + $;
          }
        }, x.getErrorCorrectPolynomial = function($) {
          for (var v = c([1], 0), _ = 0; _ < $; _ += 1)
            v = v.multiply(c([1, i.gexp(_)], 0));
          return v;
        }, x.getLengthInBits = function($, v) {
          if (1 <= v && v < 10)
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
          else if (v < 27)
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
          else if (v < 41)
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
            throw "type:" + v;
        }, x.getLostPoint = function($) {
          for (var v = $.getModuleCount(), _ = 0, D = 0; D < v; D += 1)
            for (var L = 0; L < v; L += 1) {
              for (var z = 0, X = $.isDark(D, L), re = -1; re <= 1; re += 1)
                if (!(D + re < 0 || v <= D + re))
                  for (var ie = -1; ie <= 1; ie += 1)
                    L + ie < 0 || v <= L + ie || re == 0 && ie == 0 || X == $.isDark(D + re, L + ie) && (z += 1);
              z > 5 && (_ += 3 + z - 5);
            }
          for (var D = 0; D < v - 1; D += 1)
            for (var L = 0; L < v - 1; L += 1) {
              var he = 0;
              $.isDark(D, L) && (he += 1), $.isDark(D + 1, L) && (he += 1), $.isDark(D, L + 1) && (he += 1), $.isDark(D + 1, L + 1) && (he += 1), (he == 0 || he == 4) && (_ += 3);
            }
          for (var D = 0; D < v; D += 1)
            for (var L = 0; L < v - 6; L += 1)
              $.isDark(D, L) && !$.isDark(D, L + 1) && $.isDark(D, L + 2) && $.isDark(D, L + 3) && $.isDark(D, L + 4) && !$.isDark(D, L + 5) && $.isDark(D, L + 6) && (_ += 40);
          for (var L = 0; L < v; L += 1)
            for (var D = 0; D < v - 6; D += 1)
              $.isDark(D, L) && !$.isDark(D + 1, L) && $.isDark(D + 2, L) && $.isDark(D + 3, L) && $.isDark(D + 4, L) && !$.isDark(D + 5, L) && $.isDark(D + 6, L) && (_ += 40);
          for (var Ae = 0, L = 0; L < v; L += 1)
            for (var D = 0; D < v; D += 1)
              $.isDark(D, L) && (Ae += 1);
          var He = Math.abs(100 * Ae / v / v - 50) / 5;
          return _ += He * 10, _;
        }, x;
      })(), i = (function() {
        for (var M = new Array(256), C = new Array(256), y = 0; y < 8; y += 1)
          M[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          M[y] = M[y - 4] ^ M[y - 5] ^ M[y - 6] ^ M[y - 8];
        for (var y = 0; y < 255; y += 1)
          C[M[y]] = y;
        var E = {};
        return E.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return C[x];
        }, E.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return M[x];
        }, E;
      })();
      function c(M, C) {
        if (typeof M.length > "u")
          throw M.length + "/" + C;
        var y = (function() {
          for (var x = 0; x < M.length && M[x] == 0; )
            x += 1;
          for (var R = new Array(M.length - x + C), $ = 0; $ < M.length - x; $ += 1)
            R[$] = M[$ + x];
          return R;
        })(), E = {};
        return E.getAt = function(x) {
          return y[x];
        }, E.getLength = function() {
          return y.length;
        }, E.multiply = function(x) {
          for (var R = new Array(E.getLength() + x.getLength() - 1), $ = 0; $ < E.getLength(); $ += 1)
            for (var v = 0; v < x.getLength(); v += 1)
              R[$ + v] ^= i.gexp(i.glog(E.getAt($)) + i.glog(x.getAt(v)));
          return c(R, 0);
        }, E.mod = function(x) {
          if (E.getLength() - x.getLength() < 0)
            return E;
          for (var R = i.glog(E.getAt(0)) - i.glog(x.getAt(0)), $ = new Array(E.getLength()), v = 0; v < E.getLength(); v += 1)
            $[v] = E.getAt(v);
          for (var v = 0; v < x.getLength(); v += 1)
            $[v] ^= i.gexp(i.glog(x.getAt(v)) + R);
          return c($, 0).mod(x);
        }, E;
      }
      var d = (function() {
        var M = [
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
        ], C = function(x, R) {
          var $ = {};
          return $.totalCount = x, $.dataCount = R, $;
        }, y = {}, E = function(x, R) {
          switch (R) {
            case o.L:
              return M[(x - 1) * 4 + 0];
            case o.M:
              return M[(x - 1) * 4 + 1];
            case o.Q:
              return M[(x - 1) * 4 + 2];
            case o.H:
              return M[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(x, R) {
          var $ = E(x, R);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + R;
          for (var v = $.length / 3, _ = [], D = 0; D < v; D += 1)
            for (var L = $[D * 3 + 0], z = $[D * 3 + 1], X = $[D * 3 + 2], re = 0; re < L; re += 1)
              _.push(C(z, X));
          return _;
        }, y;
      })(), f = function() {
        var M = [], C = 0, y = {};
        return y.getBuffer = function() {
          return M;
        }, y.getAt = function(E) {
          var x = Math.floor(E / 8);
          return (M[x] >>> 7 - E % 8 & 1) == 1;
        }, y.put = function(E, x) {
          for (var R = 0; R < x; R += 1)
            y.putBit((E >>> x - R - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return C;
        }, y.putBit = function(E) {
          var x = Math.floor(C / 8);
          M.length <= x && M.push(0), E && (M[x] |= 128 >>> C % 8), C += 1;
        }, y;
      }, m = function(M) {
        var C = s.MODE_NUMBER, y = M, E = {};
        E.getMode = function() {
          return C;
        }, E.getLength = function($) {
          return y.length;
        }, E.write = function($) {
          for (var v = y, _ = 0; _ + 2 < v.length; )
            $.put(x(v.substring(_, _ + 3)), 10), _ += 3;
          _ < v.length && (v.length - _ == 1 ? $.put(x(v.substring(_, _ + 1)), 4) : v.length - _ == 2 && $.put(x(v.substring(_, _ + 2)), 7));
        };
        var x = function($) {
          for (var v = 0, _ = 0; _ < $.length; _ += 1)
            v = v * 10 + R($.charAt(_));
          return v;
        }, R = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return E;
      }, g = function(M) {
        var C = s.MODE_ALPHA_NUM, y = M, E = {};
        E.getMode = function() {
          return C;
        }, E.getLength = function(R) {
          return y.length;
        }, E.write = function(R) {
          for (var $ = y, v = 0; v + 1 < $.length; )
            R.put(
              x($.charAt(v)) * 45 + x($.charAt(v + 1)),
              11
            ), v += 2;
          v < $.length && R.put(x($.charAt(v)), 6);
        };
        var x = function(R) {
          if ("0" <= R && R <= "9")
            return R.charCodeAt(0) - 48;
          if ("A" <= R && R <= "Z")
            return R.charCodeAt(0) - 65 + 10;
          switch (R) {
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
              throw "illegal char :" + R;
          }
        };
        return E;
      }, p = function(M) {
        var C = s.MODE_8BIT_BYTE, y = a.stringToBytes(M), E = {};
        return E.getMode = function() {
          return C;
        }, E.getLength = function(x) {
          return y.length;
        }, E.write = function(x) {
          for (var R = 0; R < y.length; R += 1)
            x.put(y[R], 8);
        }, E;
      }, k = function(M) {
        var C = s.MODE_KANJI, y = a.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(R, $) {
          var v = y(R);
          if (v.length != 2 || (v[0] << 8 | v[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var E = y(M), x = {};
        return x.getMode = function() {
          return C;
        }, x.getLength = function(R) {
          return ~~(E.length / 2);
        }, x.write = function(R) {
          for (var $ = E, v = 0; v + 1 < $.length; ) {
            var _ = (255 & $[v]) << 8 | 255 & $[v + 1];
            if (33088 <= _ && _ <= 40956)
              _ -= 33088;
            else if (57408 <= _ && _ <= 60351)
              _ -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + _;
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), R.put(_, 13), v += 2;
          }
          if (v < $.length)
            throw "illegal char at " + (v + 1);
        }, x;
      }, S = function() {
        var M = [], C = {};
        return C.writeByte = function(y) {
          M.push(y & 255);
        }, C.writeShort = function(y) {
          C.writeByte(y), C.writeByte(y >>> 8);
        }, C.writeBytes = function(y, E, x) {
          E = E || 0, x = x || y.length;
          for (var R = 0; R < x; R += 1)
            C.writeByte(y[R + E]);
        }, C.writeString = function(y) {
          for (var E = 0; E < y.length; E += 1)
            C.writeByte(y.charCodeAt(E));
        }, C.toByteArray = function() {
          return M;
        }, C.toString = function() {
          var y = "";
          y += "[";
          for (var E = 0; E < M.length; E += 1)
            E > 0 && (y += ","), y += M[E];
          return y += "]", y;
        }, C;
      }, T = function() {
        var M = 0, C = 0, y = 0, E = "", x = {}, R = function(v) {
          E += String.fromCharCode($(v & 63));
        }, $ = function(v) {
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
        return x.writeByte = function(v) {
          for (M = M << 8 | v & 255, C += 8, y += 1; C >= 6; )
            R(M >>> C - 6), C -= 6;
        }, x.flush = function() {
          if (C > 0 && (R(M << 6 - C), M = 0, C = 0), y % 3 != 0)
            for (var v = 3 - y % 3, _ = 0; _ < v; _ += 1)
              E += "=";
        }, x.toString = function() {
          return E;
        }, x;
      }, q = function(M) {
        var C = M, y = 0, E = 0, x = 0, R = {};
        R.read = function() {
          for (; x < 8; ) {
            if (y >= C.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var v = C.charAt(y);
            if (y += 1, v == "=")
              return x = 0, -1;
            if (v.match(/^\s$/))
              continue;
            E = E << 6 | $(v.charCodeAt(0)), x += 6;
          }
          var _ = E >>> x - 8 & 255;
          return x -= 8, _;
        };
        var $ = function(v) {
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
        return R;
      }, W = function(M, C) {
        var y = M, E = C, x = new Array(M * C), R = {};
        R.setPixel = function(D, L, z) {
          x[L * y + D] = z;
        }, R.write = function(D) {
          D.writeString("GIF87a"), D.writeShort(y), D.writeShort(E), D.writeByte(128), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(255), D.writeByte(255), D.writeByte(255), D.writeString(","), D.writeShort(0), D.writeShort(0), D.writeShort(y), D.writeShort(E), D.writeByte(0);
          var L = 2, z = v(L);
          D.writeByte(L);
          for (var X = 0; z.length - X > 255; )
            D.writeByte(255), D.writeBytes(z, X, 255), X += 255;
          D.writeByte(z.length - X), D.writeBytes(z, X, z.length - X), D.writeByte(0), D.writeString(";");
        };
        var $ = function(D) {
          var L = D, z = 0, X = 0, re = {};
          return re.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; z + he >= 8; )
              L.writeByte(255 & (ie << z | X)), he -= 8 - z, ie >>>= 8 - z, X = 0, z = 0;
            X = ie << z | X, z = z + he;
          }, re.flush = function() {
            z > 0 && L.writeByte(X);
          }, re;
        }, v = function(D) {
          for (var L = 1 << D, z = (1 << D) + 1, X = D + 1, re = _(), ie = 0; ie < L; ie += 1)
            re.add(String.fromCharCode(ie));
          re.add(String.fromCharCode(L)), re.add(String.fromCharCode(z));
          var he = S(), Ae = $(he);
          Ae.write(L, X);
          var He = 0, ve = String.fromCharCode(x[He]);
          for (He += 1; He < x.length; ) {
            var me = String.fromCharCode(x[He]);
            He += 1, re.contains(ve + me) ? ve = ve + me : (Ae.write(re.indexOf(ve), X), re.size() < 4095 && (re.size() == 1 << X && (X += 1), re.add(ve + me)), ve = me);
          }
          return Ae.write(re.indexOf(ve), X), Ae.write(z, X), Ae.flush(), he.toByteArray();
        }, _ = function() {
          var D = {}, L = 0, z = {};
          return z.add = function(X) {
            if (z.contains(X))
              throw "dup key:" + X;
            D[X] = L, L += 1;
          }, z.size = function() {
            return L;
          }, z.indexOf = function(X) {
            return D[X];
          }, z.contains = function(X) {
            return typeof D[X] < "u";
          }, z;
        };
        return R;
      }, I = function(M, C, y) {
        for (var E = W(M, C), x = 0; x < C; x += 1)
          for (var R = 0; R < M; R += 1)
            E.setPixel(R, x, y(R, x));
        var $ = S();
        E.write($);
        for (var v = T(), _ = $.toByteArray(), D = 0; D < _.length; D += 1)
          v.writeByte(_[D]);
        return v.flush(), "data:image/gif;base64," + v;
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
  })(Pa)), Pa.exports;
}
var O5 = C5();
const T5 = /* @__PURE__ */ A5(O5), R5 = ["width", "height", "viewBox"], I5 = ["width", "height"], B5 = ["d"], L5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = O(() => {
      const a = T5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), h("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      b("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, I5),
      b("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, B5)
    ], 8, R5));
  }
}, f8 = /* @__PURE__ */ J(L5, [["__scopeId", "data-v-489f0852"]]), N5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, h8 = /* @__PURE__ */ J(N5, [["__scopeId", "data-v-47e67f04"]]);
function m8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const p8 = wi(() => import("./VoiceFigure-BAfyATX_.js").then((e) => e.V)), g8 = "1.2.0", v8 = "3.5";
export {
  Id as $,
  _e as A,
  Ce as B,
  na as C,
  at as D,
  x$ as E,
  Ib as F,
  fx as G,
  y$ as H,
  hb as I,
  qb as J,
  At as K,
  q5 as L,
  Is as M,
  Vb as N,
  Pb as O,
  ta as P,
  jx as Q,
  U4 as R,
  Bn as S,
  Hx as T,
  D4 as U,
  Ee as V,
  Hn as W,
  N4 as X,
  L4 as Y,
  Rd as Z,
  J as _,
  E4 as a,
  l$ as a$,
  zb as a0,
  V4 as a1,
  G4 as a2,
  Le as a3,
  sx as a4,
  ax as a5,
  St as a6,
  K4 as a7,
  gx as a8,
  g4 as a9,
  Qx as aA,
  Lx as aB,
  nb as aC,
  wx as aD,
  kx as aE,
  $$ as aF,
  Wr as aG,
  Wx as aH,
  fn as aI,
  x4 as aJ,
  b4 as aK,
  f$ as aL,
  hn as aM,
  g$ as aN,
  dx as aO,
  Nx as aP,
  Dx as aQ,
  Bx as aR,
  nn as aS,
  xt as aT,
  v4 as aU,
  V0 as aV,
  Rx as aW,
  H4 as aX,
  qr as aY,
  Nt as aZ,
  qt as a_,
  r$ as aa,
  m$ as ab,
  S4 as ac,
  j4 as ad,
  P4 as ae,
  tx as af,
  nx as ag,
  ox as ah,
  T4 as ai,
  Ho as aj,
  Y4 as ak,
  px as al,
  E$ as am,
  Ax as an,
  _x as ao,
  Sx as ap,
  lx as aq,
  X4 as ar,
  Q4 as as,
  ex as at,
  Fx as au,
  mx as av,
  vx as aw,
  O$ as ax,
  Kt as ay,
  yx as az,
  aw as b,
  C$ as b$,
  Cb as b0,
  p$ as b1,
  Vx as b2,
  Ux as b3,
  gy as b4,
  Er as b5,
  a$ as b6,
  hx as b7,
  oa as b8,
  rt as b9,
  Kx as bA,
  e$ as bB,
  ut as bC,
  zx as bD,
  t$ as bE,
  bx as bF,
  Cx as bG,
  xx as bH,
  Te as bI,
  ux as bJ,
  n$ as bK,
  j$ as bL,
  P$ as bM,
  m4 as bN,
  Y0 as bO,
  ix as bP,
  Yx as bQ,
  A4 as bR,
  _$ as bS,
  Gx as bT,
  Jx as bU,
  Zx as bV,
  rx as bW,
  ab as bX,
  cx as bY,
  Mx as bZ,
  S$ as b_,
  Xx as ba,
  _a as bb,
  Zl as bc,
  R$ as bd,
  L$ as be,
  qx as bf,
  d$ as bg,
  p4 as bh,
  Ex as bi,
  I$ as bj,
  J4 as bk,
  Z4 as bl,
  I4 as bm,
  z4 as bn,
  k4 as bo,
  c$ as bp,
  C4 as bq,
  O4 as br,
  B4 as bs,
  Tx as bt,
  F0 as bu,
  v$ as bv,
  jb as bw,
  R4 as bx,
  $4 as by,
  Ox as bz,
  py as c,
  rn as c$,
  w4 as c0,
  y4 as c1,
  $x as c2,
  N$ as c3,
  js as c4,
  D$ as c5,
  ai as c6,
  u$ as c7,
  F4 as c8,
  q4 as c9,
  ye as cA,
  e8 as cB,
  Y5 as cC,
  g8 as cD,
  v8 as cE,
  a4 as cF,
  n8 as cG,
  ts as cH,
  c4 as cI,
  _v as cJ,
  Mt as cK,
  cs as cL,
  Qn as cM,
  Q5 as cN,
  s4 as cO,
  Dc as cP,
  Hg as cQ,
  c8 as cR,
  e4 as cS,
  f8 as cT,
  nr as cU,
  su as cV,
  Z$ as cW,
  Vd as cX,
  U5 as cY,
  d4 as cZ,
  ek as c_,
  U0 as ca,
  M4 as cb,
  Nb as cc,
  Ix as cd,
  Os as ce,
  Zy as cf,
  Px as cg,
  Yt as ch,
  Lt as ci,
  J5 as cj,
  X$ as ck,
  de as cl,
  gd as cm,
  $d as cn,
  ks as co,
  Mm as cp,
  Ol as cq,
  u8 as cr,
  h4 as cs,
  Em as ct,
  Gp as cu,
  Qt as cv,
  q$ as cw,
  j5 as cx,
  $t as cy,
  Vu as cz,
  Ue as d,
  H$ as d$,
  o4 as d0,
  _t as d1,
  pt as d2,
  kp as d3,
  fu as d4,
  r4 as d5,
  V5 as d6,
  jt as d7,
  t8 as d8,
  d8 as d9,
  ph as dA,
  F$ as dB,
  H5 as dC,
  s8 as dD,
  wv as dE,
  xw as dF,
  G5 as dG,
  n4 as dH,
  U$ as dI,
  G$ as dJ,
  qe as dK,
  Z5 as dL,
  X5 as dM,
  Pc as dN,
  z$ as dO,
  Vi as dP,
  z5 as dQ,
  W5 as dR,
  wl as dS,
  kl as dT,
  $u as dU,
  K5 as dV,
  ct as dW,
  m8 as dX,
  $w as dY,
  P5 as dZ,
  F5 as d_,
  Ps as da,
  Ku as db,
  kt as dc,
  l4 as dd,
  la as de,
  p8 as df,
  h8 as dg,
  Es as dh,
  V$ as di,
  ms as dj,
  L1 as dk,
  wo as dl,
  rr as dm,
  ku as dn,
  r8 as dp,
  l8 as dq,
  vs as dr,
  wu as ds,
  hl as dt,
  t4 as du,
  i8 as dv,
  f4 as dw,
  u4 as dx,
  i4 as dy,
  W$ as dz,
  W4 as e,
  Q$ as e0,
  ww as e1,
  a8 as e2,
  Ag as e3,
  gl as e4,
  ck as e5,
  ps as e6,
  K$ as e7,
  Ha as e8,
  Y$ as e9,
  J$ as ea,
  We as eb,
  o8 as ec,
  xu as ed,
  q0 as f,
  T$ as g,
  an as h,
  b$ as i,
  B$ as j,
  w$ as k,
  i$ as l,
  iw as m,
  Bs as n,
  h$ as o,
  _4 as p,
  k$ as q,
  ti as r,
  ni as s,
  Me as t,
  yy as u,
  s$ as v,
  A$ as w,
  o$ as x,
  pn as y,
  M$ as z
};
