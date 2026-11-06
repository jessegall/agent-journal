/* @code-commandments-generated */
import { openBlock as u, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as y, normalizeClass as Z, Fragment as K, renderList as ee, defineComponent as ri, Comment as ii, h as Kn, cloneVNode as ci, createBlock as z, withCtx as q, createVNode as D, toDisplayString as w, createCommentVNode as A, ref as L, onMounted as Re, onBeforeUnmount as ft, reactive as Yn, shallowRef as Ke, watch as fe, onUnmounted as Be, inject as Oe, useAttrs as Jn, computed as I, resolveDynamicComponent as ht, mergeProps as Fe, useId as ds, resolveDirective as ui, withDirectives as tt, createTextVNode as te, Teleport as fs, nextTick as mt, Transition as Dt, withModifiers as xe, TransitionGroup as el, shallowReactive as di, isRef as Hs, onScopeDispose as hs, resolveComponent as fi, useModel as qa, getCurrentInstance as hi, mergeModels as Fa, getCurrentScope as tl, provide as nl, onErrorCaptured as mi, toHandlers as pi, createSlots as gi, vShow as al, useSlots as vi, withKeys as Zt, vModelText as Wa, normalizeProps as yi, guardReactiveProps as bi, defineAsyncComponent as wi } from "vue";
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
      style: ge(P(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ J(xi, [["__scopeId", "data-v-6c018b03"]]), $i = { class: "skeleton-line" }, Mi = 2e3, Si = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = sl(Mi);
    return (n, a) => (u(), h("span", $i, [
      ue(n.$slots, "default", {}, void 0, !0),
      y("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (u(!0), h(K, null, ee(e.bars, (s) => (u(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
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
    return (i, c) => (u(), z(jt, { value: e.shape }, {
      messages: q(() => [
        y("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), h(K, null, ee(t, (d) => D(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, _i)
      ]),
      older: q(() => [
        y("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(t.slice(0, 3), (d) => (u(), z(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ei)
      ]),
      cards: q(() => [
        y("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), h(K, null, ee(n, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ai)
      ]),
      file: q(() => [
        y("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), h(K, null, ee(s, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ci)
      ]),
      page: q(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), h(K, null, ee(e.count, (d) => (u(), z(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Oi)
      ]),
      text: q(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), z(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ti)
      ]),
      default: q(() => [
        y("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(K, null, ee(e.count, (d) => (u(), z(pt, {
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
    return (t, n) => e.loading ? (u(), z(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), h("div", Bi, [
      y("p", Li, w(e.title), 1),
      y("p", Ni, [
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
      y("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        y("span", Fi, w(e.label), 1),
        e.count !== "" ? (u(), h("span", Wi, w(e.count), 1)) : A("", !0),
        y("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, qi),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, P5 = /* @__PURE__ */ J(Hi, [["__scopeId", "data-v-9ef1865c"]]), zi = 150, Ui = () => zi;
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
const Gi = 50, zs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function q5(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ha(t.read, t.events) : Ha("", []);
}
function ol(e, t, n, a, s = () => !1) {
  const o = L([]), l = L(null), r = L(""), i = L(!1), c = performance.now(), d = L(!1), f = L(""), m = L(null), g = /* @__PURE__ */ new Set();
  let v = null;
  function k(p) {
    return s() ? (g.add(p), v ?? (v = new Promise((M) => setTimeout(() => M($()), Gi)))) : B(p);
  }
  async function $() {
    const p = new Set(g);
    g.clear(), v = null;
    const M = C, E = await t({ ids: [...p].join(","), limit: p.size });
    if (M !== C) return;
    if (!E.ok) return R();
    const O = new Map(E.value.rows.map((j) => [j.id, j]));
    o.value = o.value.flatMap((j) => p.has(j.id) ? O.has(j.id) ? [O.get(j.id)] : [] : [j]);
  }
  async function B(p) {
    const M = C, E = await t({ "before-id": p + 1, limit: 1 });
    if (M !== C) return;
    if (!E.ok) return R();
    const O = E.value.rows.find((j) => j.id === p);
    o.value = O ? o.value.map((j) => j.id === p ? O : j) : o.value.filter((j) => j.id !== p);
  }
  async function F(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return k(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return R();
    const E = Math.max(...o.value.map((ne) => ne.id)), O = C, j = await t({ "after-id": E });
    if (O !== C) return;
    if (!j.ok) return R();
    const Q = new Set(o.value.map((ne) => ne.id));
    o.value = [...j.value.rows.filter((ne) => !Q.has(ne.id)), ...o.value];
  }
  async function H() {
    if (!d.value || !o.value.length) return !1;
    const p = C, M = Math.min(...o.value.map((j) => j.id)), E = await t({ "before-id": M });
    if (p !== C) return !1;
    if (!E.ok || !E.value.rows.length) return d.value = !1;
    d.value = zs(E.value, n());
    const O = new Set(o.value.map((j) => j.id));
    return o.value = [...o.value, ...E.value.rows.filter((j) => !O.has(j.id))], !0;
  }
  let C = 0;
  function x(p, M) {
    var j, Q;
    const E = p.ok ? e.shared ? [p.value] : ((j = p.value) == null ? void 0 : j.rows) ?? [] : [];
    p.ok && (o.value = M(E)), l.value = p.ok ? p.value : null;
    const O = E.length ? Math.min(...E.map((ne) => ne.id)) : 0;
    p.ok && ((Q = p.value) != null && Q.rows) && !o.value.some((ne) => ne.id < O) && (d.value = !e.shared && zs(p.value, n())), r.value = p.ok ? "" : p.error, ms(c, () => i.value = !0);
  }
  async function T(p) {
    const M = ++C, E = await t({});
    M === C && x(E, p);
  }
  const b = (p) => {
    if (!a() || !p.length) return p;
    const M = Math.min(...p.map((O) => O.id)), E = Math.max(...p.map((O) => O.id));
    return [...o.value.filter((O) => O.id > E), ...p, ...o.value.filter((O) => O.id < M)];
  }, R = () => T(b), S = (p) => x(p, b), N = () => T((p) => p);
  async function _(p, M = null) {
    const E = await Vi(M && { target: o, fields: { value: M(o.value) } }, p, e.run);
    return f.value = E.ok ? "" : E.error, m.value = E.ok ? E.value : null, await R(), E;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: R, loadLatest: N, older: H, act: _, actionFailure: f, answer: m, context: e, heard: F, showFirst: S };
}
const Ki = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ha(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = ol(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Ki(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Yi = 2e3;
function ps(e, t, n = Yi) {
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
function Ji(e = 0) {
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
const Ua = "journal.stale-build-reload", Zi = 'script[type="module"][src*="/assets/index-"]', Us = (e) => {
  var t;
  return ((t = e.querySelector(Zi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Qi(e = document, t = (a, s) => Me.quietRead(a, s), n = () => il(window)) {
  const a = Us(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Us(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function Xi(e, t = () => il(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const ec = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function tc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ua) === e.message) return !1;
    t.setItem(Ua, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function nc(e = window.sessionStorage) {
  try {
    e.removeItem(Ua);
  } catch {
    return;
  }
}
const ac = 2e3, sc = 3e4, ze = Yn({ starting: !1, external: !1, late: !1, offline: !1 }), cl = () => ze.starting, oc = 3;
let vn = 0, Va = 0, ul = 0, dl = [];
async function lc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let Vs = null;
const rc = () => Vs ?? (Vs = lc().finally(() => Vs = null));
function ic() {
  clearTimeout(Va), clearTimeout(ul), Va = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), dl.splice(0).forEach((e) => e()), Qi();
}
async function cc() {
  ze.offline = !navigator.onLine;
  const e = await rc();
  if (ze.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < oc) return;
  vn = 0, (!Xi(e.started_at) || za()) && ic();
}
function fl() {
  Va = setTimeout(async () => {
    await cc(), ze.starting && fl();
  }, ac);
}
function uc() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, fl(), ul = setTimeout(() => ze.late = !0, sc));
}
const dc = () => ze.starting ? new Promise((e) => dl.push(e)) : Promise.resolve();
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
function fc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class hc {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = fc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", yn = 2e4, mc = 4, Gs = "/api/read-lines", pc = 5e3, gc = 403, Ks = "/api/repeated-lines", vc = 10, yc = 2e3, bc = 3e5, F5 = 6e5, bn = 6, wc = 500, kc = "/journal/summary", Ys = "/api/server-state", xc = 2e4, wn = ll ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, $c = (e) => e.split("?")[0].endsWith(kc), Ga = (e, t) => Object.assign(new Error(t), { status: e });
async function Mc(e, t, n = Ga) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Sc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), _c = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Js = (e) => e.split(" ").slice(0, 2).join(" "), Ze = "read", Tt = "write", Ec = "stream";
class Ac {
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < yc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < vc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ks, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Ks, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ji(n ? rl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: _c(n.signal, s) } : n;
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
      throw o instanceof TypeError && uc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= mc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Gs, { headers: wn }, [{ window: st, line: Gs, kind: Ze }], pc).then(async (t) => {
      if (t.status === gc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ga(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new hc(
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
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Sc(a) }, c = s || (r ? bc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Ze }], c)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, wc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Mc(r, `${r.status} ${r.statusText}`).catch((i) => {
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
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : cl() && !$c(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Ec }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ys, { cache: "no-store" }, [{ window: st, line: Ys, kind: Ze }], xc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Ze : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Ac());
class Cc {
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
const Oc = 50, Tc = "refresh", Rc = 1e3, Ic = "requested", Bc = "after_window", Lc = 50, Nc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Dc(e) {
  const t = {}, n = Yn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null };
  let l = {}, r = 0;
  function i(H) {
    const C = () => l[H] ?? {}, x = L(void 0), T = ol(e, async (b) => {
      const R = await f(H, b);
      return R.ok && !Object.keys(b).length && (x.value = R.value), R;
    }, () => C().page_size || Lc, () => !!C().page_size, () => !!C().reads_ids);
    return t[H] = { ...T, data: x, readAt: 0 };
  }
  const c = new Proxy({}, { get: (H, C) => typeof C != "string" || C.startsWith("__v") ? void 0 : t[C] ?? i(C) }), d = (H) => !H.endsWith(".*") && l[H].loading !== Ic && (!l[H].tab || l[H].tab === n.tab);
  function f(H, C = {}) {
    return new Promise((x) => {
      a.push({ name: H, flags: C, resolve: x }), a.length === 1 && setTimeout(m);
    });
  }
  async function m() {
    const H = /* @__PURE__ */ new Map(), C = a.splice(0).filter((b) => {
      const R = JSON.stringify(b.flags);
      return H.has(b.name) || H.set(b.name, R), H.get(b.name) === R ? !0 : (a.push(b), !1);
    });
    a.length && setTimeout(m);
    const x = Object.fromEntries(C.flatMap(({ name: b, flags: R }) => Object.entries(R).map(([S, N]) => [`${b}.${S}`, N]))), T = await e.readKeys({ only: [...new Set(C.map(({ name: b }) => b))], state: { ...n, ...x } });
    C.forEach(({ name: b, resolve: R }) => R(T.ok ? T.value.keys[b] : T));
  }
  async function g(H) {
    const C = await e.readKeys({ only: H, state: { ...n } });
    return C.ok ? (B(C.value.declared), Object.entries(C.value.keys).forEach(([x, T]) => {
      c[x].readAt = Date.now(), T.ok && (c[x].data.value = T.value), c[x].showFirst(T);
    }), !0) : (C.failure !== "cancelled" && (H.length ? H : Object.keys(t)).forEach((x) => c[x].showFirst(C)), !1);
  }
  function v(H) {
    const C = Nc(H);
    return C.length ? (C.forEach((x) => o.names.add(x)), o.answer ?? (o.answer = new Promise((x) => setTimeout(() => {
      const T = [...o.names];
      o.names.clear(), o.answer = null, x(g(T));
    })))) : g([]);
  }
  function k(H) {
    H.forEach((C) => s.add(C)), clearTimeout(r), r = setTimeout(() => {
      const C = [...s];
      s.clear(), C.length && g(C);
    }, Oc);
  }
  function $(H) {
    const C = Object.keys(l).filter((T) => H.event === Tc || l[T].events.some((b) => gs(b, H.event)));
    C.filter((T) => l[T].page_size).forEach((T) => c[T].heard(H));
    const x = C.filter((T) => !l[T].page_size);
    x.filter((T) => !d(T)).forEach((T) => c[T].readAt = 0), k(x.filter(d));
  }
  function B(H) {
    if (Object.keys(l).length) return;
    l = H;
    const C = [...new Set(Object.values(H).flatMap((T) => T.events))];
    C.length && e.follow(C, $);
    const x = Object.keys(H).filter((T) => H[T].loading === Bc);
    x.length && g(x);
  }
  fe(() => n.tab, () => {
    const H = Object.keys(l).filter((C) => d(C) && !c[C].readAt);
    H.length && g(H);
  }), Be(() => clearTimeout(r));
  function F() {
    const H = Date.now(), C = Object.keys(l).filter((x) => l[x].reload_seconds > 0 && d(x) && H - c[x].readAt >= l[x].reload_seconds * 1e3);
    C.length && k(C);
  }
  return ps(F, () => e.visible.value, Rc), queueMicrotask(() => g([])), { props: c, state: n, reload: v, readKey: f };
}
const jc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), ml = Symbol("dock-card");
function Pc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Dc(e));
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
  return Pc(e);
}
const qc = (e, t) => e(ml, t), W5 = () => Oe(ml), Fc = ["stroke-width", "innerHTML"], ye = {
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
    }, null, 12, Fc));
  }
}, Wc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Hc = /* @__PURE__ */ J(Wc, [["__scopeId", "data-v-eb453d6f"]]), zc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Jn(), a = I(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = L(!1), o = I(() => t.busy || s.value), l = Oe(Le, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
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
    return (c, d) => (u(), z(ht(e.href ? "a" : "button"), Fe(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: q(() => [
        y("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), z(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), z(Hc, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ J(zc, [["__scopeId", "data-v-ededdadf"]]), Uc = ["aria-checked", "aria-haspopup", "onClick"], Vc = {
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
          r.dot ? (u(), h("span", Vc)) : A("", !0),
          te(" " + w(r.label) + " ", 1),
          r.note ? (u(), h("small", Gc, w(r.note), 1)) : A("", !0),
          r.count !== void 0 ? (u(), h("em", Kc, w(r.count), 1)) : A("", !0)
        ], 10, Uc)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, rn = /* @__PURE__ */ J(Yc, [["__scopeId", "data-v-c89bc92d"]]), Jc = {
  key: 0,
  class: "more-items"
}, Zc = {
  key: 0,
  role: "alert"
}, Qc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), h("div", Jc, [
      e.failure ? (u(), h("p", Zc, w(e.failure), 1)) : A("", !0),
      e.more ? (u(), z(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          te(w(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : A("", !0)
    ])) : A("", !0);
  }
}, Zn = /* @__PURE__ */ J(Qc, [["__scopeId", "data-v-10464014"]]), Xc = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, eu = ["disabled", "onClick"], tu = { class: "title" }, nu = { class: "relations" }, au = { key: 1 }, su = {
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
    const n = e, a = t, s = L([]), o = L({}), l = L(0), r = L(""), i = L(null), c = L(!1), d = L("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (b) => m[b] || `${b.replaceAll("_", " ").replace(/^./, (R) => R.toUpperCase())}s`, v = I(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((b, R) => b + R, 0) },
      ...Object.entries(o.value).map(([b, R]) => ({ key: b, label: g(b), count: R }))
    ]), k = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, $ = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id }), B = (b) => `${b.endpoint.model === "doc" && b.endpoint.id === n.documentId ? "Design document" : b.endpoint.model.replaceAll("_", " ").replace(/^./, (R) => R.toUpperCase())} ${b.endpoint.id}, ${b.relations.map((R) => R.replaceAll("_", " ")).join(", ")}`;
    async function F(b = 1) {
      const R = ++f;
      c.value = !0, d.value = "";
      const S = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.outsidePlan && S.push("--outside-plan"), n.documentId && S.push("--first-counterpart", `doc:${n.documentId}`), r.value && S.push("--kind", r.value);
      try {
        const N = await n.read(S);
        if (R !== f) return;
        if (!N.ok) {
          d.value = N.error;
          return;
        }
        const _ = N.value.counterparts ?? [], p = b === 1 ? _ : [...s.value, ..._];
        s.value = [...new Map(p.map((M) => [`${M.endpoint.model}:${M.endpoint.id}`, M])).values()], o.value = N.value.kinds ?? {}, l.value = N.value.total, i.value = N.value.next_page ?? null;
      } catch (N) {
        R === f && (d.value = N.message);
      } finally {
        R === f && (c.value = !1);
      }
    }
    function H(b) {
      if (k(b)) return;
      const [R, S] = b.endpoint.open_ref.split(":");
      a("open", { table: R, id: Number(S) });
    }
    function C(b) {
      r.value = b, F();
    }
    const x = () => !c.value && i.value && F(i.value), T = I(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", F();
    }, { immediate: !0 }), (b, R) => s.value.length || c.value || d.value || e.empty ? (u(), h("section", Xc, [
      v.value.length > 2 ? (u(), z(rn, {
        key: 0,
        options: v.value,
        value: r.value,
        wrap: "",
        onPick: C
      }, null, 8, ["options", "value"])) : A("", !0),
      (u(!0), h(K, null, ee(s.value, (S) => (u(), h("button", Fe({
        key: `${S.endpoint.model}:${S.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, $(S), {
        disabled: k(S),
        onClick: (N) => H(S)
      }), [
        y("span", tu, w(S.endpoint.title), 1),
        y("span", nu, [
          te(w(B(S)), 1),
          k(S) ? (u(), h(K, { key: 0 }, [
            te(" · Unavailable")
          ], 64)) : A("", !0)
        ])
      ], 16, eu))), 128)),
      !s.value.length && !c.value && !d.value && e.empty ? (u(), h("p", au, w(e.empty), 1)) : A("", !0),
      D(Zn, {
        more: !!i.value,
        loading: c.value,
        failure: d.value,
        label: T.value,
        onMore: x
      }, null, 8, ["more", "loading", "failure", "label"])
    ])) : A("", !0);
  }
}, ou = /* @__PURE__ */ J(su, [["__scopeId", "data-v-466876c9"]]), lu = (e, t, n) => Math.max(t, Math.min(n, e)), ru = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, pl = /* @__PURE__ */ new WeakMap(), iu = (e, t) => pl.set(e, t);
function cu(e, t) {
  for (let n = t; n; n = pl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function gl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !cu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, uu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = L(null), o = (p) => p ? `${p}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = L({ w: 0, h: 0 }), i = L(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const M = p.closest(".pane, .float-window");
      return M ? d(M.getBoundingClientRect()) : c();
    }, m = (p, M) => `${Math.max(0, p ? Math.min(p, M) : M)}px`;
    function g(p, M) {
      return {
        below: p.bottom - M.bottom - a.gap - Ct,
        above: M.top - p.top - a.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function v(p) {
      const M = f(a.anchor), E = g(M, p);
      return r.value.w <= E.across && r.value.h <= Math.max(E.below, E.above) ? M : c();
    }
    const k = I(() => {
      if (!i.value) return l.value;
      const p = i.value, M = v(p), E = g(M, p), { w: O, h: j } = r.value, Q = a.align === "auto" ? p.left + p.right > M.left + M.right : a.align === "right", ne = lu(Q ? p.right - O : p.left, M.left + Ct, Math.max(M.left + Ct, M.right - O - Ct)), he = j > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...l.value, ...he, left: `${ne}px`, maxWidth: m(a.maxWidth, E.across) };
    }), $ = n, B = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(p) {
      const M = B(), E = M.indexOf(document.activeElement);
      M[(E + p + M.length) % M.length].focus();
    }
    const H = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => $("close") }, C = (p) => H[p.key] && (p.preventDefault(), H[p.key]()), x = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let T = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(T), T = requestAnimationFrame(x);
    });
    gl(s, (p) => a.anchor && !a.anchor.contains(p.target) && $("close"));
    const R = (p, M) => ["top", "left", "right", "bottom"].some((E) => Math.abs(p[E] - M[E]) > 1), S = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let N = 0;
    function _() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || S(p)) return $("close");
        R(p, i.value) && (i.value = p);
      }
      N = requestAnimationFrame(_);
    }
    return Re(() => {
      a.anchor && s.value && iu(s.value, a.anchor), x(), s.value && b.observe(s.value), !a.plain && B()[0] && B()[0].focus(), _();
    }), Be(() => {
      b.disconnect(), cancelAnimationFrame(N), cancelAnimationFrame(T);
    }), t({ element: s }), (p, M) => (u(), z(fs, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", Fe({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: C
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Qn = /* @__PURE__ */ J(uu, [["__scopeId", "data-v-3d203970"]]), du = { class: "split-button" }, fu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = L(null), s = L(!1), o = () => s.value = !1;
    return (l, r) => (u(), h("span", du, [
      D(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: q(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      y("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        D(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: q(() => [
            D(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), z(Qn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, hu = /* @__PURE__ */ J(fu, [["__scopeId", "data-v-c258494d"]]), mu = 0, pu = "/api/lines", gu = "/api/line", Zs = 5e3, Qs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Xs = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), da = (e) => JSON.stringify(e.line), eo = () => new DOMException("cancelled", "AbortError");
class vu {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), mu));
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
      const o = await Me.sent(pu, Qs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Xs(r.body, Ze)), Zs);
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
      const a = await Me.sent(gu, Qs(t.body, t.signal), [Xs(t.body, n)], n === Ze ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const vl = new vu(), yu = "/api/window";
function bu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${yu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: Ze }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const yl = /* @__PURE__ */ new Map();
class wu {
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
function H5(e, t) {
  const n = new wu(e, t);
  return yl.set(e, n), n.load().catch(() => {
  }), n;
}
const vs = (e) => yl.get(e);
function ku(e, t, n) {
  const a = vs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function xu(e, t) {
  if (!e) return !0;
  const n = vs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const $u = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let bl = {};
async function z5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (bl = (await t.json()).states);
}
const ys = (e, t) => {
  var n;
  return (n = bl[e]) == null ? void 0 : n[t];
}, wl = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.label) ?? $u(t);
}, kl = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Mu = (e, t) => {
  var n;
  return ((n = ys(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Su = Symbol("pane-page"), _u = Symbol("inspector-host"), xl = { 1: "refused", 2: "usage", 3: "fault" }, Eu = 100, Au = 50, Cu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Ou = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Tu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = L({}), declared: c = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: v = [], links: k = {}, search: $ = {}, readOnly: B = !1, shared: F = null }) {
  const H = /* @__PURE__ */ new Map(), C = new AbortController(), x = L(!1), T = performance.now();
  let b = 0, R = 0, S = () => {
  };
  const N = new Promise((j) => S = j);
  C.signal.addEventListener("abort", S, { once: !0 });
  const _ = () => {
    clearTimeout(R), R = setTimeout(() => {
      b === 0 && ms(T, () => {
        x.value = !0, S();
      });
    }, Au);
  }, p = (j, Q) => (b += 1, Rt(e, j, t, C.signal, Q).finally(() => {
    b -= 1, _();
  })), M = (j, Q) => (_(), N.then(() => C.signal.aborted ? nt : Rt(e, j, t, C.signal, Q))), E = ({ only: j = [], state: Q = {} } = {}) => (b += 1, Iu(() => bu(e, t, j, Q, C.signal), C.signal).finally(() => {
    b -= 1, _();
  })), O = (j, { unbatched: Q = !1, deferred: ne = !1 } = {}) => {
    const ie = H.get(j);
    if (ie && performance.now() - ie.at < Eu) return ie.answer;
    const he = ne && !x.value ? M(j, Q) : p(j, Q);
    return H.set(j, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: x,
    settle: _,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: v,
    links: k,
    search: $,
    readOnly: B,
    shared: F,
    read: O,
    readKeys: E,
    run: (j) => Rt(e, j, t, C.signal),
    upload: (j) => Lu(j, e, C.signal),
    cancel: () => C.abort(),
    signal: C.signal,
    subscriptions: l,
    follow: (j, Q) => l.follow(e, [j].flat().filter((ne) => o.some((ie) => gs(ie, ne))), (ne) => {
      H.clear(), Q(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (j) => I(() => {
      var Q;
      return i.value[j] ?? ((Q = c.find((ne) => ne.key === j)) == null ? void 0 : Q.default);
    }),
    setting: async (j, Q) => {
      const ne = await O(`window setting ${e} ${j}`);
      return ne.ok ? ne.value.value : Q;
    },
    setOption: f,
    keep: (j, Q) => Rt(e, ["window", "save-setting", e, j, JSON.stringify(Q)], t, C.signal)
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
const Ru = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: xl[e.code] || "fault", error: $l(e.error) };
async function Iu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Ru(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: bs };
  }
}
async function Sl(e, t, n) {
  const a = await Ml(() => vl.read(e, t, n), t);
  return a.failure !== "unreachable" || !cl() ? a : (await dc(), t.aborted ? nt : Sl(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Bu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ws(t)));
}
async function Bu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ws(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => Sl({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : Ml(() => vl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Lu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: bs };
  }
}
function ws(e) {
  return [...e.matchAll(Cu)].map(([t]) => t.replace(Ou, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Nu = (e) => `show-${e}`, U5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Nu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), _l = "messages.chat", Du = {
  key: 0,
  class: "template-brief"
}, ju = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Pu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L([]), o = L(""), l = I(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = I(() => s.value.find((c) => String(c.id) === n.value));
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
      D(rn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), h("p", Du, w(r.value.brief), 1)) : A("", !0),
      o.value ? (u(), h("p", ju, w(o.value), 1)) : A("", !0)
    ], 64));
  }
}, qu = /* @__PURE__ */ J(Pu, [["__scopeId", "data-v-14be8a5c"]]), Fu = { class: "form-field" }, Wu = { class: "form-field-head" }, Hu = ["for"], zu = {
  key: 0,
  class: "form-field-aside"
}, Uu = {
  key: 0,
  class: "form-field-help"
}, Vu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", Fu, [
      y("div", Wu, [
        y("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Hu),
        t.$slots.aside ? (u(), h("span", zu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (u(), h("p", Uu, w(e.help), 1)) : A("", !0)
    ]));
  }
}, Gu = /* @__PURE__ */ J(Vu, [["__scopeId", "data-v-dd7cdcff"]]), Ka = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Ku = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Jn(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((u(), h("textarea", Fe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ka), P(t).value]
    ]);
  }
}), Yu = /* @__PURE__ */ J(Ku, [["__scopeId", "data-v-e130a5b9"]]), Ju = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ds(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), z(Gu, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        D(jt, { value: o.value }, {
          choice: q(() => [
            D(rn, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            D(qu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            D(Yu, {
              id: P(s),
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
    return (t, n) => (u(), z(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: q(() => [
        D(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Zu(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Qu = (e, t = () => !0) => Zu("keydown", (n) => n.key === "Escape" && t() && e());
function El(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = L(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Qu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Xu = 80, Ot = Yn([]);
function Al(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), I(() => Xu + Math.max(0, Ot.indexOf(t)));
}
let Cl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Cl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ed = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function td(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(ed)];
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
const nd = ["aria-modal", "aria-label", "aria-labelledby"], ad = {
  key: 0,
  class: "dialog-head"
}, sd = ["id", "tabindex"], od = {
  key: 1,
  class: "dialog-foot"
}, ld = 500, rd = 400, id = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = El(a, n), r = Al(s), i = L(null), c = L(null), d = L(null), f = ds(), m = L(!1), g = Date.now();
    n.modal && td(c, () => a("escape"), d);
    function v() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, rd);
    }
    function k(F) {
      !n.modal || Date.now() - g >= ld || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const $ = () => i.value && (i.value.scrollTop = i.value.scrollHeight), B = new MutationObserver($);
    return fe(i, (F) => {
      B.disconnect(), F && n.follow && (B.observe(F, { childList: !0, subtree: !0, characterData: !0 }), $());
    }), Be(() => B.disconnect()), (F, H) => (u(), z(fs, { to: "body" }, [
      D(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (u(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: xe(v, ["self"])
          }, [
            y("section", {
              ref_key: "panel",
              ref: c,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? A("", !0) : (u(), h("header", ad, [
                y("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, sd),
                e.closable ? (u(), z(ks, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              y("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (u(), h("footer", od, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, nd)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ol = /* @__PURE__ */ J(id, [["__scopeId", "data-v-6d1ecd98"]]), cd = (e, t, n = {}) => ws(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  try {
    return await xu(e.module, n) ? Rt(_l, cd(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const ud = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fa = [
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
}, dd = ["secrets", "plugins"], Tl = Object.keys(Xn).filter((e) => !(ll && dd.includes(e)));
I(() => Tl.map((e) => ({ name: e, ...Xn[e] })));
const Pt = (e) => Xn[e], Rl = new Map(Tl.flatMap((e) => [e, e.replace(/s$/, ""), Xn[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Rl.get(String(e).toLowerCase()) || "", Il = [...Rl.keys()].sort((e, t) => t.length - e.length).join("|"), fd = {
  class: "button-form",
  "data-button-form": ""
}, hd = {
  key: 0,
  class: "button-form-title"
}, md = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, pd = { class: "button-form-actions" }, gd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = L(!1), l = L(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
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
    return (d, f) => (u(), z(Ol, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: q(() => {
        var m;
        return [
          y("div", fd, [
            (m = e.row) != null && m.title ? (u(), h("p", hd, w(e.row.title), 1)) : A("", !0),
            (u(!0), h(K, null, ee(e.button.fields, (g) => (u(), z(Ju, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (v) => s.value[g.name] = v
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), h("p", md, w(l.value), 1)) : A("", !0),
            y("div", pd, [
              D(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: q(() => [...f[2] || (f[2] = [
                  te("Cancel", -1)
                ])]),
                _: 1
              }),
              D(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: q(() => [...f[3] || (f[3] = [
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
}, vd = /* @__PURE__ */ J(gd, [["__scopeId", "data-v-f26c27a7"]]), yd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, bd = {
  key: 1,
  class: "menu-item-text"
}, wd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), h("span", yd, w(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (u(), h("span", bd, [
        y("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, w(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ J(wd, [["__scopeId", "data-v-fec99974"]]), kd = ["aria-busy"], xd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, $d = {
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
    const n = e, a = t, s = I(() => vs(n.environment)), o = I(
      () => {
        var v;
        return !n.readOnly && ((v = s.value) == null ? void 0 : v.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var v;
      return !n.readOnly && ((v = s.value) == null ? void 0 : v.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : ku(n.environment, n.name, n.row)), c = L(null), d = L(""), f = L(!1), m = (v) => [v.from ? `From ${v.from}` : "", v.tip].filter(Boolean).join(" · ");
    async function g(v) {
      if (f.value || n.readOnly) return;
      if (v.fields.length) {
        c.value = v;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const k = await cn(v, n.row, n.environment);
      f.value = !1, d.value = k.ok ? "" : k.error;
      const $ = v.label.toLowerCase() + (n.objectName && !v.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", k.ok ? "" : `Could not ${$}: ${k.error}`), k.ok && a("done");
    }
    return (v, k) => (u(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), h(K, { key: 0 }, [
        k[3] || (k[3] = y("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        D(de, {
          small: "",
          onClick: r
        }, {
          default: q(() => [...k[2] || (k[2] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (u(), h(K, { key: 1 }, [
        (u(!0), h(K, null, ee(i.value, ($) => (u(), h(K, {
          key: $.name
        }, [
          $.menu.length ? (u(), z(hu, {
            key: 0,
            small: "",
            variant: $.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": $.menu_label || "More ways",
            title: m($),
            "data-button": $.name,
            onMain: (B) => g($)
          }, {
            menu: q(({ close: B }) => [
              (u(!0), h(K, null, ee($.menu, (F) => (u(), z(Mt, {
                key: F.label,
                description: F.description,
                onClick: (H) => (B(), g({ ...$, ...F, menu: [] }))
              }, {
                default: q(() => [
                  te(w(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              te(w($.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), z(de, {
            key: 1,
            small: "",
            variant: $.primary ? "primary" : "ghost",
            bordered: !$.primary,
            icon: $.icon,
            disabled: f.value,
            title: m($),
            "data-button": $.name,
            onClick: (B) => g($)
          }, {
            default: q(() => [
              te(w($.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (u(), h("span", xd, w(d.value), 1)) : A("", !0),
        c.value && !e.readOnly ? (u(), z(vd, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: k[0] || (k[0] = ($) => c.value = null),
          onDone: k[1] || (k[1] = ($) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, kd));
  }
}, Md = /* @__PURE__ */ J($d, [["__scopeId", "data-v-a07b49a4"]]), Sd = {
  class: "running",
  "data-running-command": ""
}, _d = ["title"], Ed = {
  key: "idle",
  class: "running-idle"
}, Ad = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), h("span", Sd, [
      D(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (u(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, _d)) : (u(), h("span", Ed, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, V5 = /* @__PURE__ */ J(Ad, [["__scopeId", "data-v-d3240219"]]), Cd = ["aria-checked", "aria-label", "title"], Od = {
  key: 0,
  class: "switch-inner"
}, Td = {
  key: 0,
  class: "switch-word"
}, Rd = {
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
      y("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), h("span", Od, w(e.word), 1)) : A("", !0),
        s[1] || (s[1] = y("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), h("span", Td, w(e.word), 1)) : A("", !0)
    ], 10, Cd));
  }
}, G5 = /* @__PURE__ */ J(Rd, [["__scopeId", "data-v-1bfb90f3"]]);
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
function Id(e, t) {
  return Bl(() => sessionStorage, e, t);
}
function Bd(e, t) {
  return Ll(() => sessionStorage, e, t);
}
const Dn = "journal.environment", Dl = L(Id(Dn, Nn(Dn, "")));
function Ld(e) {
  Dl.value = e, Bd(Dn, e), xs(Dn, e);
}
const jn = L(location.hash), to = Ke(null), no = { integrations: "mcp", library: "team" };
function Nd() {
  if (!to.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (no[n]) {
    location.replace(`#/${[no[n], ...a].join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash;
    return;
  }
  !n || to.value(n) || (Ld(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  jn.value = location.hash, Nd();
});
const Ya = I(() => {
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
function Dd(e = "", t = 0, n = "") {
  location.hash = $s.page(e, t, n);
}
const jd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function jl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(jd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function K5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Pl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ya.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  jl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Pd(e, t, n, a = 0, s = "") {
  if (e === Ya.value.env) return Pl(t, n, a, s);
  const o = Ya.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  jl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Pd(a, s, Number(o), 0, t) : Pl(s, Number(o), 0, t);
}
function qd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = qd(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function Y5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Fd = { class: "inspector-part" }, Wd = { class: "inspector-part-title" }, Hd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("section", Fd, [
      y("h4", Wd, w(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, J5 = /* @__PURE__ */ J(Hd, [["__scopeId", "data-v-0da7fa52"]]), zd = {
  key: 1,
  class: "row-list-failure"
}, Ud = ["data-row"], Vd = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = L(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), z(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), h("p", zd, w(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), z(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        te(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), h(K, { key: 3 }, [
      (u(), z(ht(e.arrival ? el : "ul"), Fe(n.value, { class: "row-list" }), {
        default: q(() => [
          (u(!0), h(K, null, ee(e.rows, (r) => (u(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Ud))), 128))
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
}, Gd = /* @__PURE__ */ J(Vd, [["__scopeId", "data-v-6c7ba696"]]), Kd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Yd = {
  key: 1,
  class: "agent-rows-note"
}, Jd = {
  key: 2,
  class: "agent-rows-note"
}, Zd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Qd = ["data-agent-row", "onClick"], Xd = { class: "agent-row-name" }, ef = { class: "agent-row-state" }, tf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), h("div", Kd, [
      e.loaded ? e.failure ? (u(), h("p", Yd, w(e.failure), 1)) : e.rows.length ? (u(), h(K, { key: 3 }, [
        y("p", Zd, w(a.value) + " running", 1),
        (u(!0), h(K, null, ee(n.value, (l) => (u(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(qe)(`agents:${l.id}`)
        }, [
          y("span", Xd, "#" + w(l.id) + " " + w(l.session), 1),
          y("span", ef, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Qd))), 128))
      ], 64)) : (u(), h("p", Jd, w(e.none), 1)) : (u(), z(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Z5 = /* @__PURE__ */ J(tf, [["__scopeId", "data-v-a01e5a17"]]), nf = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, ql = /* @__PURE__ */ J(nf, [["__scopeId", "data-v-9e7e1157"]]), af = ["aria-valuenow", "aria-valuemax"], sf = {
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
    const t = e, n = I(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (u(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      y("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, af));
  }
}, of = /* @__PURE__ */ J(sf, [["__scopeId", "data-v-9eba6a85"]]), lf = { class: "bars" }, rf = { class: "bar-name" }, cf = { class: "bar-value" }, uf = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), h("div", lf, [
      (u(!0), h(K, null, ee(e.items, (i, c) => (u(), z(ht(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: q(() => [
          y("span", rf, w(i.label), 1),
          D(of, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          y("span", cf, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, df = /* @__PURE__ */ J(uf, [["__scopeId", "data-v-663427f4"]]), ff = { class: "bars" }, hf = {
  key: 0,
  class: "bars-title"
}, mf = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", ff, [
      e.node.title ? (u(), h("span", hf, w(e.node.title), 1)) : A("", !0),
      D(df, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, pf = /* @__PURE__ */ J(mf, [["__scopeId", "data-v-7135bb11"]]), gf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (u(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (u(!0), h(K, null, ee(e.node.children || [], (i, c) => (u(), z(tr, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, On = /* @__PURE__ */ J(gf, [["__scopeId", "data-v-d142a3f4"]]), vf = {
  key: 0,
  class: "card-head"
}, yf = { class: "card-title" }, bf = {
  key: 0,
  class: "card-note"
}, wf = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), h("header", vf, [
        y("span", yf, w(e.node.title), 1),
        e.node.note ? (u(), h("span", bf, w(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      D(On, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, kf = /* @__PURE__ */ J(wf, [["__scopeId", "data-v-67b72d40"]]), xf = { processes: "process", memories: "memory", replies: "reply" }, Pn = (e) => (xf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ja = [], $f = 2e3, lt = /* @__PURE__ */ new Map(), Mf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Sf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Ja.unshift(e) : Ja.push(e), lt.clear();
}
function Fl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const _f = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Ef = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Af(e, t) {
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
  return Cf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Cf(e) {
  return e.split(Sf).map((t, n) => n % 2 ? t : t.replace(Mf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function ao(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Of = 24;
function Tf(e) {
  const [t, , ...n] = e, a = ao(t), s = n.map(ao), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > Of) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${Xt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, d) => `<td${o(d)}>${Xt(c)}</td>`).join("")}</tr>`).join("");
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
function Rf(e, t) {
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
      n.push(Tf(t.slice(a, r))), a = r;
      continue;
    }
    if (Wl.test(s)) {
      const r = Rf(t, a);
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
const If = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Bf = (e) => e.type !== "text" && !If.test(e.html);
function Lf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(zl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Bf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Nf(e, t = { env: "" }) {
  const n = Ef(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => _f(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Lf(Af(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > $f && lt.delete(lt.keys().next().value), o;
}
const ha = /* @__PURE__ */ new WeakMap();
function Df(e) {
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
  const e = Oe(Le, null), t = e ? Df(e) : null;
  return (n, a = {}) => Nf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Vl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Vl, (t, n, a, s) => s), jf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), kn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Pf = /^Traceback \(most recent call last\):/m, qf = 8;
function Gl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, qf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Ff(e) {
  const t = [...e.matchAll(jf)].map((a) => a.index);
  if (kn.lastIndex = 0, !t.length || !kn.test(e)) return null;
  kn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(kn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Gl(n), tail: "" } : null;
}
function Wf(e) {
  const t = Pf.exec(e);
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
  const t = un(e), n = Wf(t) || Ff(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Hf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, zf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Uf = /[\w\]]\(/, Vf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Gf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Kf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Yf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Jf = /[[({,]$/, Zf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Qf = /^(\t|\s{2,})\S/, Xf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, eh = /`[^`]+`/, th = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, nh = /[{}()[\];=<>$&|*\\@+^~%]/g, Kl = /^\s*(?:[-*+]|\d+[.)])\s/, ah = /^\s*>/, sh = /^\s*\|/, oh = 0.6, lh = 0.4, rh = 5, ih = 0.03, Yl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= rh && t.every((n) => th.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(nh) ?? []).length / e.length < ih;
}, ma = (e) => {
  const t = e.trim();
  return eh.test(t) ? !1 : [Hf, zf, Uf, Vf, Gf, Kf, Yf, Jf, Zf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Qf.test(e) && !Kl.test(e) && !Yl(e);
};
function ch(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Kl.test(t[0]) || t.every((o) => ah.test(o) || sh.test(o))) return "text";
  const n = t.filter((o) => !Xf.test(o.trim()));
  if (t.length === 1) return !n.length || ma(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ma).length, s = n.filter((o) => !ma(o) && Yl(o)).length;
  return a >= n.length * oh && s <= n.length * lh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", uh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", dh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, fh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", hh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", lo = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: uh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: dh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: fh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: hh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, mh = {
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
function ph(e, t) {
  const n = lo[mh[t] ?? t] || lo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function gh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of ph(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? et(l) : `<span class="tok-${a}">${et(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function vh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const yh = 1500, io = /* @__PURE__ */ new WeakMap();
async function bh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await vh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(io.get(t)), io.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, yh)
  )));
}
typeof document < "u" && document.addEventListener("click", bh, !0);
const wh = /\n\s*\n/, kh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, xh = /^\s*(`{3,}|~{3,})\s*$/, $h = /^\s{4,}\S/, Mh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Xa = /^\s*(?:[-*+]|\d+[.)])\s/, Jl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Sh = [
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
function _h(e) {
  const t = Ms(e.join(`
`));
  return (Sh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Eh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Jl.test(t) && !Xa.test(t);
}, Ah = (e, t) => Xa.test(t) || Xa.test([...e].reverse().find((n) => n.trim()) || "");
function Ss(e, t) {
  const n = t || _h(e), a = gh(Ms(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Ch(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && xh.test(s));
  return a < 0 ? e.length : a;
}
function Oh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ss(a.map(un), n ? n.toLowerCase() : "");
}
function Th(e) {
  const t = e.split(wh).map((l) => ({ paragraph: l, type: ch(Ms(l).split(`
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
function Rh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Th(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(kh);
    if (r) {
      const c = Ch(n, l, r[2]);
      o(), a.push(Oh(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = Eh(s) ? Mh : $h;
    if (!t && i.test(n[l]) && !Ah(s, n[l])) {
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
Et((e, t) => Rh(e, t.document));
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
}, Ih = (e) => (fo[e.table] ? fo[e.table](e) : e.title || "") || "", St = (e) => qn(e.created_at), Ql = (e) => qn(e.updated_at) || St(e), Bh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Lh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Nh(e) {
  const t = Bh.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = Lh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Dh(e, t, n, a) {
  const s = Fl(a, e, t), o = un(s ? Ih(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${et(Pt(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = Nh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Dh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const jh = /\.(png|jpe?g|gif|webp|svg)$/i, Ph = (e) => jh.test(e), qh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Fh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Wh(e, t) {
  const n = qh.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), c = i && Fl(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${c.id} · ${et(r)}`, m = Ph(r) ? `<img class="file-card-image" src="${d}" alt="${et(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Hh(e) {
  const t = Fh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Wh(e, t) || Hh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const zh = /`([^`\n]+)`/g;
Et((e) => e.replace(zh, (t, n) => `<code>${n}</code>`));
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
const Uh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Xl = new RegExp(`\\b(${Il}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), er = new RegExp(`\\b(${Il}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Vh = new RegExp(`<code>((?:${Xl.source}|${er.source}))</code>`, "gi"), Gh = (e) => e.replace(Vh, "$1"), Kh = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Yh = (e) => e.replace(er, (t, n, a) => a.replace(/\d+/g, (s) => Kh(n.replace(/s$/i, ""), s))), Jh = (e) => Yh(e).replace(
  Xl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Gh(e).split(Uh).map((n, a) => a % 2 ? n : Jh(n)).join("")
);
const Zh = ["innerHTML"], Qh = ["innerHTML"], Xh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ul(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Zh)) : (u(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Qh));
  }
}, kt = /* @__PURE__ */ J(Xh, [["__scopeId", "data-v-d8e75741"]]), em = { class: "fact" }, tm = { class: "fact-label" }, nm = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", em, [
      y("span", tm, w(e.label), 1),
      D(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, am = /* @__PURE__ */ J(nm, [["__scopeId", "data-v-3a88ecf8"]]), sm = { class: "list" }, om = { class: "list-label" }, lm = {
  key: 1,
  class: "list-note"
}, rm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", sm, [
      (u(!0), h(K, null, ee(e.items, (o, l) => (u(), z(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          y("span", om, w(o.label), 1),
          o.badge ? (u(), z(ql, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (u(), h("span", lm, w(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, im = /* @__PURE__ */ J(rm, [["__scopeId", "data-v-ebe2ae0a"]]), cm = { class: "table" }, um = {
  key: 0,
  class: "table-row empty"
}, dm = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), h("div", cm, [
      y("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (u(!0), h(K, null, ee(e.columns, (r) => (u(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (u(!0), h(K, null, ee(e.rows, (r, i) => (u(), z(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: q(() => [
          (u(!0), h(K, null, ee(r.cells, (c, d) => (u(), h("span", {
            key: d,
            class: "cell"
          }, w(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), h("div", um, w(e.empty), 1)) : A("", !0)
    ]));
  }
}, fm = /* @__PURE__ */ J(dm, [["__scopeId", "data-v-9326a52e"]]), hm = { class: "stat-value" }, mm = { class: "stat-label" }, pm = {
  key: 0,
  class: "stat-note"
}, gm = {
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
    return (a, s) => (u(), z(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        y("span", hm, w(e.value), 1),
        y("span", mm, w(e.label), 1),
        e.note ? (u(), h("span", pm, w(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, vm = /* @__PURE__ */ J(gm, [["__scopeId", "data-v-ad0db6d6"]]), ym = { class: "code" }, bm = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), z(jt, {
      value: e.node.type
    }, {
      stack: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        D(kf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        y("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: q(() => [...l[2] || (l[2] = [
        y("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        D(vm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        D(pf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        D(fm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        D(im, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        D(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        D(am, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        D(ql, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        y("pre", ym, [
          y("code", null, w(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        y("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), tr = /* @__PURE__ */ J(bm, [["__scopeId", "data-v-cbdcf540"]]), wm = { class: "dashboard" }, km = { class: "trail" }, xm = ["onClick"], $m = {
  key: 0,
  class: "gone",
  role: "status"
}, Mm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = L(!!n.page && !s(n.page)), l = L(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), c = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (u(), h("div", wm, [
      e.document.broken ? (u(), z(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          te(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), z(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          te(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), h(K, { key: 2 }, [
        y("nav", km, [
          y("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (v) => f(0))
          }, w(c(e.document.start)), 3),
          (u(!0), h(K, null, ee(l.value, (v, k) => (u(), h(K, {
            key: `${k}-${v}`
          }, [
            g[2] || (g[2] = y("span", { class: "sep" }, "/", -1)),
            y("button", {
              type: "button",
              class: Z(["step", { current: k === l.value.length - 1 }]),
              onClick: ($) => f(k + 1)
            }, w(c(v)), 11, xm)
          ], 64))), 128))
        ]),
        o.value ? (u(), h("p", $m, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        D(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (u(), h("div", {
              key: r.value,
              class: "page"
            }, [
              D(tr, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (v) => a("file", v))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, Sm = /* @__PURE__ */ J(Mm, [["__scopeId", "data-v-fbe83734"]]), nr = {
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
function _m(e, t) {
  const n = We(), a = hl(e, nr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const Em = {
  key: 0,
  class: "window-failure"
}, Am = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = L(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? _m(l, n.events) : ps(l, () => !0, nr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), h("p", Em, w(o.value.error), 1)) : o.value ? (u(), z(Sm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : A("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Cm = 6;
function _s(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Om = (e) => {
  const t = _s(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Tm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Rm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Im(e, t, n) {
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
  for (let l = 0; l < Cm; l++) {
    const r = l % 2 === 0, i = a.map((c, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Bm(e, t) {
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
function Lm(e) {
  const t = [...new Set(e.flatMap(([C, x]) => [C, x]))], n = new Set(e.map(([, C]) => C)), a = t.filter((C) => !n.has(C)), s = Tm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((C, x) => !s.has(x)), l = Rm(t, o), r = Im(t, o, l), i = new Map(t.map((C) => [C, Om(C)])), c = r.map((C) => C.reduce((x, T) => x + i.get(T).width, 0) + je.across * (C.length - 1)), d = Math.max(...c) + je.margin * 2, f = Dm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = je.margin;
  r.forEach((C, x) => {
    let T = (d - c[x]) / 2;
    const b = Math.max(...C.map((R) => i.get(R).height));
    C.forEach((R) => {
      const S = i.get(R);
      m.set(R, { ...S, x: T, y: g + (b - S.height) / 2 }), T += S.width + je.across;
    }), g += b + (f[x] ?? je.down);
  });
  const v = e.map(([C, x, T], b) => ({ from: C, to: x, label: T || "", back: s.has(b) || l.get(x) <= l.get(C) }));
  Bm(v, m);
  const k = v.map((C) => jm(C, m.get(C.from), m.get(C.to))), $ = [...m.values()], B = Wm(k, $), F = Math.max(g - je.down, ...B.filter((C) => C.label).map((C) => C.label.y + C.label.height));
  return { width: Math.max(d - je.margin, ...B.filter((C) => C.label).map((C) => C.label.x + C.label.width)) + je.margin, height: F + je.margin, nodes: $, arrows: B };
}
const Nm = (e) => e ? _s(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function Dm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Nm(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function jm(e, t, n) {
  const a = e.label ? _s(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: c - d }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${c - d} ${i} ${c}` };
}
const Pm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, qm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Fm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function Wm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const d = Pm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = Fm.flatMap((i) => qm.map((c) => s(c, i))).find((i) => !n.some((c) => mo(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => mo(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const mo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Hm = { class: "flowchart-tools" }, zm = ["width", "height", "viewBox", "aria-label"], Um = ["d"], Vm = ["x", "y", "width", "height"], Gm = ["x", "y"], Km = ["x", "dy"], Ym = {
  key: 0,
  class: "flowchart-label"
}, Jm = ["x", "y", "width", "height"], Zm = ["x", "y"], Qm = ["x", "dy"], Xm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Lm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = L(null), r = L({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var B;
      const k = (B = l.value) == null ? void 0 : B.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const $ = Math.min(k.width / s.value.width, k.height / s.value.height, 1.5);
      r.value = { zoom: $, x: (k.width - s.value.width * $) / 2, y: (k.height - s.value.height * $) / 2 };
    }
    function d(k, $, B) {
      const { zoom: F, x: H, y: C } = r.value, x = Math.min(o.most, Math.max(o.least, F * k));
      r.value = { zoom: x, x: $ - ($ - H) * x / F, y: B - (B - C) * x / F };
    }
    function f(k) {
      const $ = l.value.getBoundingClientRect();
      d(k, $.width / 2, $.height / 2);
    }
    function m(k) {
      const $ = l.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? d(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - $.left, k.clientY - $.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function g(k) {
      var $, B, F;
      k.preventDefault(), ($ = window.getSelection()) == null || $.removeAllRanges(), i = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (F = (B = l.value).setPointerCapture) == null || F.call(B, k.pointerId);
    }
    function v(k) {
      i && (r.value = { ...r.value, x: k.clientX - i.x, y: k.clientY - i.y });
    }
    return Re(c), (k, $) => (u(), z(Ol, {
      title: e.title,
      large: "",
      onClose: $[4] || ($[4] = (B) => a("close"))
    }, {
      default: q(() => [
        y("div", Hm, [
          D(de, {
            small: "",
            onClick: $[0] || ($[0] = (B) => f(o.step))
          }, {
            default: q(() => [...$[5] || ($[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: $[1] || ($[1] = (B) => f(1 / o.step))
          }, {
            default: q(() => [...$[6] || ($[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: c
          }, {
            default: q(() => [...$[7] || ($[7] = [
              te("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        y("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: g,
          onPointermove: v,
          onPointerup: $[2] || ($[2] = (B) => Hs(i) ? i.value = null : i = null),
          onPointercancel: $[3] || ($[3] = (B) => Hs(i) ? i.value = null : i = null)
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
            $[8] || ($[8] = y("defs", null, [
              y("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                y("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (u(!0), h(K, null, ee(s.value.arrows, (B, F) => (u(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: B.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Um))), 128)),
            (u(!0), h(K, null, ee(s.value.nodes, (B) => (u(), h("g", {
              key: B.name,
              class: "flowchart-node"
            }, [
              y("rect", {
                x: B.x,
                y: B.y,
                width: B.width,
                height: B.height,
                rx: "8"
              }, null, 8, Vm),
              y("text", {
                x: B.x + B.width / 2,
                y: B.y + B.padY + B.line / 2
              }, [
                (u(!0), h(K, null, ee(B.lines, (F, H) => (u(), h("tspan", {
                  key: H,
                  x: B.x + B.width / 2,
                  dy: H ? B.line : 0
                }, w(F), 9, Km))), 128))
              ], 8, Gm)
            ]))), 128)),
            (u(!0), h(K, null, ee(s.value.arrows, (B, F) => (u(), h(K, {
              key: `label-${F}`
            }, [
              B.label ? (u(), h("g", Ym, [
                y("rect", {
                  x: B.label.x,
                  y: B.label.y,
                  width: B.label.width,
                  height: B.label.height,
                  rx: "4"
                }, null, 8, Jm),
                y("text", {
                  x: B.label.x + B.label.width / 2,
                  y: B.label.y + B.label.pad + B.label.line / 2
                }, [
                  (u(!0), h(K, null, ee(B.label.lines, (H, C) => (u(), h("tspan", {
                    key: C,
                    x: B.label.x + B.label.width / 2,
                    dy: C ? B.label.line : 0
                  }, w(H), 9, Qm))), 128))
                ], 8, Zm)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, zm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, e1 = /* @__PURE__ */ J(Xm, [["__scopeId", "data-v-51d24cfe"]]), po = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', go = {
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
}, t1 = ["innerHTML"], n1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => go[t.name] || go.dot);
    return (a, s) => (u(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, t1));
  }
}, dt = /* @__PURE__ */ J(n1, [["__scopeId", "data-v-beb5935c"]]), a1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      D(dt, { name: "fold" })
    ], 2));
  }
}, $t = /* @__PURE__ */ J(a1, [["__scopeId", "data-v-d03899bb"]]), s1 = ["data-tip", "aria-label"], o1 = {
  key: 0,
  class: "mact-word"
}, l1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      D(dt, { name: "open" }),
      e.open ? (u(), h("span", o1, w(e.label), 1)) : A("", !0),
      n[0] || (n[0] = y("span", { class: "hit" }, null, -1))
    ], 10, s1));
  }
}, ar = /* @__PURE__ */ J(l1, [["__scopeId", "data-v-3b292e09"]]), sr = 120, Tn = 280, or = 160, r1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, i1 = ["leaving", "resizing", "entering"];
function es(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function c1(e) {
  const t = i1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = es(e);
  return e.classList.add(...t), n;
}
function lr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = L(t()), s = L("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = c1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function c(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let g = m.offsetHeight;
    const v = new ResizeObserver(() => {
      m.offsetHeight !== g && (g = m.offsetHeight, i(f, es(f)));
    });
    return v.observe(m), v;
  }
  async function d(f) {
    const m = e.value, g = ++o;
    if (!m || !m.offsetWidth || r1()) {
      a.value = f;
      return;
    }
    const v = es(m);
    if (l(m, v), s.value = "leaving", await n(sr), g !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, v);
    const k = c(m);
    await n(Tn), k == null || k.disconnect(), g === o && (r(m), s.value = "entering", await n(or), g === o && (s.value = ""));
  }
  return fe(t, (f) => d(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const u1 = { class: "growing-card-top" }, d1 = ["aria-expanded"], f1 = { class: "growing-card-avatar" }, h1 = { class: "growing-card-title" }, m1 = { class: "growing-card-more" }, p1 = { class: "growing-card-body" }, g1 = {
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
    const n = e, a = t, s = L(!1), o = L(null), { folded: l, phase: r } = lr(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (u(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      y("div", u1, [
        y("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          y("span", f1, [
            e.bad ? (u(), z(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), h(K, { key: 1 }, [
              te(w(i.value), 1)
            ], 64)) : (u(), z(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          y("span", h1, w(e.title), 1),
          D($t, { open: s.value }, null, 8, ["open"])
        ], 8, d1),
        e.action ? (u(), z(ar, {
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
          D(ye, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      y("div", m1, [
        y("div", p1, [
          (u(!0), h(K, null, ee(c.value, (m, g) => (u(), h("p", {
            key: g,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, v1 = /* @__PURE__ */ J(g1, [["__scopeId", "data-v-f2b4930d"]]), y1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, b1 = { class: "md inline" }, w1 = ["disabled", "title", "onClick"], k1 = {
  key: 1,
  class: "message-links-many"
}, x1 = ["aria-expanded"], $1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, M1 = ["disabled", "onClick"], S1 = { class: "row-pill message-links-chip" }, _1 = { class: "message-links-title" }, E1 = { key: 0 }, ga = 3, A1 = "task", C1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === A1) ? "tasks" : "items"), l = L(!1), r = L(null);
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
      D(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), h("span", y1, [
        y("span", b1, [
          g[1] || (g[1] = te("Linked: ", -1)),
          (u(!0), h(K, null, ee(e.links, (v) => (u(), h("button", {
            key: `${v.endpoint.model}:${v.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(v),
            title: v.endpoint.title,
            onClick: (k) => f(v)
          }, [
            te(w(v.endpoint.model.replaceAll("_", " ")) + " " + w(v.endpoint.id), 1),
            d(v) ? (u(), h(K, { key: 0 }, [
              te(" (" + w(d(v)) + ")", 1)
            ], 64)) : A("", !0),
            c(v) ? (u(), h(K, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : A("", !0)
          ], 8, w1))), 128))
        ])
      ])) : A("", !0),
      s.value >= ga ? (u(), h("span", k1, [
        y("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          te(w(s.value) + " linked " + w(o.value) + " ", 1),
          D($t, { open: l.value }, null, 8, ["open"])
        ], 8, x1)
      ])) : A("", !0),
      l.value ? (u(), h("div", $1, [
        (u(!0), h(K, null, ee(e.links, (v) => (u(), h("button", {
          key: `${v.endpoint.model}:${v.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(v),
          onClick: (k) => f(v)
        }, [
          y("span", S1, w(v.endpoint.model.replaceAll("_", " ")) + " " + w(v.endpoint.id), 1),
          y("span", _1, w(v.endpoint.title), 1),
          y("span", null, w(d(v)), 1),
          c(v) ? (u(), h("span", E1, "Unavailable")) : A("", !0)
        ], 8, M1))), 128))
      ])) : A("", !0),
      D(Zn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (v) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, O1 = /* @__PURE__ */ J(C1, [["__scopeId", "data-v-e9bc783c"]]), T1 = ["title", "aria-label"], R1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, I1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, B1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), h("svg", R1, [
        o[0] || (o[0] = y("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), h("path", I1)) : A("", !0)
      ]))
    ], 10, T1));
  }
}, L1 = /* @__PURE__ */ J(B1, [["__scopeId", "data-v-6dc92808"]]);
function N1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function rr(e, t = Date.now()) {
  const n = N1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const D1 = 36e5;
function Q5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / D1;
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
function j1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${va(t % 60)}s` : `${Math.floor(t / 3600)}h ${va(Math.floor(t % 3600 / 60))}m ${va(t % 60)}s`;
}
const P1 = "img,pre,table";
function q1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function F1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function W1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(P1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = q1(F1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function H1(e, t) {
  let n = null;
  const a = () => e.value && W1(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const z1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function U1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ht = "sent", V1 = 50, yo = () => ({ rows: L([]), total: L(0), next: L(null), loading: L(!1), failure: L(""), version: 0 });
function G1(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((v) => v.visible);
  };
  async function o(m, g, v = 1) {
    const k = m[g], $ = ++k.version;
    k.loading.value = !0, k.failure.value = "";
    const B = g === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${B} --page ${v} --page-size ${g === Ge ? 10 : 25}`;
    try {
      const H = await e.read(F);
      if (t.get(m.id) !== m || k.version !== $) return;
      if (!H.ok) {
        k.failure.value = H.error;
        return;
      }
      const C = g === Ge ? H.value.counterparts ?? [] : H.value.rows ?? [], x = v === 1 ? C : [...k.rows.value, ...C], T = g === Ge ? (b) => `${b.endpoint.model}:${b.endpoint.id}` : (b) => b.id ?? b.target_id;
      k.rows.value = [...new Map(x.map((b) => [T(b), b])).values()], k.total.value = H.value.total ?? k.rows.value.length, k.next.value = H.value.next_page ?? null;
    } catch (H) {
      k.version === $ && (k.failure.value = H.message);
    } finally {
      k.version === $ && (k.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const v = [...g.dirty];
      g.dirty.clear();
      for (const k of v) o(g, k);
    }
  }
  function r(m, g = [Ge, Ht]) {
    for (const v of g) m.dirty.add(v);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), v = m.link_types ?? (m.link_type ? [m.link_type] : []), k = v.length ? [Ge, Ht].filter((B) => B === Ge ? v.some((F) => ["about", "edited"].includes(F)) : v.includes("sent_to")) : [Ge, Ht];
    if (!k.length) return;
    const $ = g.length ? [...new Set(g.filter((B) => B.model === "message").map((B) => B.id))].map((B) => t.get(B)).filter(Boolean) : [...t.values()].filter(s).slice(0, V1);
    for (const B of $) r(B, k);
  }
  const c = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let v = t.get(m);
      return v || (v = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ht]), work: yo(), sent: yo() }, t.set(m, v)), v.views.add(g), v.dirty.size && r(v, [...v.dirty]), v;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), c == null || c(), xn.delete(e));
    },
    more(m, g) {
      const v = m == null ? void 0 : m[g];
      if (v != null && v.next.value && !v.loading.value) return o(m, g, v.next.value);
    }
  };
  return xn.set(e, d), d;
}
function K1(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = G1(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((v) => v.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = fe(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return hs(o), {
    links: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: I(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: I(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: I(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const Y1 = ["data-incoming", "data-ref"], J1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Z1 = { class: "message-body" }, Q1 = ["title"], X1 = ["innerHTML"], ep = ["title"], tp = ["innerHTML"], np = {
  class: "message-faces",
  "data-message-faces": ""
}, ap = ["title", "data-face", "onClick"], sp = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, op = ["title", "data-reaction", "onClick"], lp = {
  key: 0,
  class: "message-reaction-count"
}, rp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, ip = ["href", "title"], cp = ["src", "alt"], up = ["href"], dp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, fp = ["disabled", "data-sent-worker", "title", "onClick"], hp = { class: "message-foot" }, mp = { class: "message-time" }, pp = {
  class: "message-id",
  "data-message-id": ""
}, gp = 140, vp = 2, yp = 1500, bp = "An earlier message", wp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1), o = L(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${Pt(se).title.toLowerCase()} ${me}` } : null;
    }), i = I(() => n.message.worker_id ?? null), c = L(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > gp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > vp)), f = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, yp);
    }
    const g = Ul(), v = I(() => g(n.message.text ?? "")), k = I(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = L(!1), B = I(() => g(n.quote || bp));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    H1(o, () => `${n.message.text} ${n.quote}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, C = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, x = I(() => JSON.parse(n.message.captions || "{}")), T = I(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: C(ve), isImage: H.test(ve), title: x.value[ve] || ve }))), b = I(() => ir(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), R = Oe(Le, null), { links: S, total: N, more: _, loading: p, failure: M, sentTo: E, sentMore: O, sentLoading: j, sentFailure: Q, loadMore: ne, loadSent: ie } = K1(R, () => l.value && !n.message.local ? n.message.id : null, o), he = L(!1), Ae = I(() => U1(n.message.reactions));
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
      D(v1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Y1)) : (u(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      y("div", Z1, [
        y("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => P(It) && P(It)(...se))
        }, [
          r.value ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = xe((se) => P(qe)(r.value.ref), ["stop"]))
          }, [
            D(ye, {
              name: "bubble",
              size: 12
            }),
            y("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, Q1)) : A("", !0),
          e.message.parent_id ? (u(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: B.value
          }, null, 8, X1)) : A("", !0),
          i.value !== null ? (u(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = xe((se) => P(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, ep)) : A("", !0),
          y("div", {
            class: Z({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, tp),
          d.value ? (u(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = xe((se) => c.value = !c.value, ["stop"]))
          }, w(c.value ? "Show less" : "Show more"), 1)) : A("", !0),
          k.value.length ? (u(), h(K, { key: 4 }, [
            y("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (u(), z(e1, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: me[5] || (me[5] = (se) => $.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        y("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (u(), h(K, { key: 0 }, [
            y("div", np, [
              (u(!0), h(K, null, ee(P(z1), (se) => (u(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Ye) => He(se)
              }, w(se), 9, ap))), 128))
            ]),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (se) => he.value = !1)
            }, [
              D(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), h(K, { key: 1 }, [
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: me[8] || (me[8] = (se) => he.value = !0)
            }, "React"),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: me[9] || (me[9] = (se) => a("reply", e.message))
            }, "Reply"),
            y("button", {
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
              onClick: me[10] || (me[10] = (se) => a("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (u(), h("div", sp, [
        (u(!0), h(K, null, ee(Ae.value, (se) => (u(), h("button", {
          key: se.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Ye) => a("react", e.message, se.emoji)
        }, [
          te(w(se.emoji) + " ", 1),
          se.count > 1 ? (u(), h("span", lp, w(se.count), 1)) : A("", !0)
        ], 10, op))), 128))
      ])) : A("", !0),
      T.value.length ? (u(), h("div", rp, [
        (u(!0), h(K, null, ee(T.value, (se) => (u(), h(K, {
          key: se.name
        }, [
          se.isImage ? (u(), h("a", {
            key: 0,
            href: se.address,
            target: "_blank",
            class: "message-image",
            title: se.title
          }, [
            y("img", {
              src: se.address,
              alt: se.name,
              "data-figure-picture": ""
            }, null, 8, cp)
          ], 8, ip)) : (u(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, w(se.name), 9, up))
        ], 64))), 128))
      ])) : A("", !0),
      P(E).length ? (u(), h("div", dp, [
        D(ye, {
          name: "send",
          size: 12
        }),
        (u(!0), h(K, null, ee(P(E), (se) => (u(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: xe((Ye) => se.open_ref && P(qe)(se.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + w(se.id), 1),
          se.unavailable ? (u(), h(K, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : A("", !0)
        ], 8, fp))), 128))
      ])) : A("", !0),
      D(Zn, {
        more: P(O),
        loading: P(j),
        failure: P(Q),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      y("div", hp, [
        y("time", mp, w(b.value), 1),
        Number.isInteger(e.message.id) ? (u(), h(K, { key: 0 }, [
          me[11] || (me[11] = y("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          y("span", pp, "message " + w(e.message.id), 1)
        ], 64)) : A("", !0),
        l.value ? (u(), z(L1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      P(S).length || P(M) ? (u(), z(O1, {
        key: 3,
        links: P(S),
        total: P(N),
        more: P(_),
        loading: P(p),
        failure: P(M),
        onMore: P(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : A("", !0)
    ], 8, J1));
  }
}, X5 = /* @__PURE__ */ J(wp, [["__scopeId", "data-v-0be1107c"]]), kp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = fi("SkeletonParts", !0);
      return u(!0), h(K, null, ee(e.parts, (i, c) => (u(), h(K, { key: c }, [
        (u(!0), h(K, null, ee(i.count, (d) => (u(), z(jt, {
          key: d,
          value: i.shape
        }, {
          line: q(() => [
            D(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            D(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            D(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            y("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            y("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            y("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
            y("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: q(() => [
            y("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), xp = /* @__PURE__ */ J(kp, [["__scopeId", "data-v-fa8baeaf"]]), $p = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Mp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), h("div", $p, [
      D(xp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Es = /* @__PURE__ */ J(Mp, [["__scopeId", "data-v-52f66b64"]]), Fn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ya = 200, cr = (e) => {
  var t;
  return ((t = Fn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Fn[0].key;
}, e4 = (e) => {
  var t;
  return ((t = Fn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Sp = ["aria-label"], _p = 300, bo = 400, Ep = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ya } },
  setup(e) {
    const t = e, n = I(() => cr(t.value)), a = I(() => n.value < ya ? [1, 0.25, 0.25] : n.value === ya ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= bo, high: n.value >= _p && n.value < bo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      y("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      y("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      y("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Sp));
  }
}, t4 = /* @__PURE__ */ J(Ep, [["__scopeId", "data-v-b10e610f"]]), wo = (e) => [...new Set(e.agents.map((t) => t.name))], n4 = (e) => wo(e).length === 1 ? `Worker: ${wo(e)[0]}` : "Delegated", Ap = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, ko = (e) => Ap[e.card.state] || "idle", Cp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), xo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, $o = (e, t) => xo[ko(e)] - xo[ko(t)], Mo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, a4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => $o(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Cp(a, s)) : [...e].sort((a, s) => $o(a, s) || (Mo[t] || Mo.state)(a, s)), Op = { class: "list-row" }, Tp = {
  key: 0,
  class: "list-row-type"
}, Rp = { class: "list-row-main" }, Ip = {
  key: 0,
  class: "list-row-title"
}, Bp = { class: "list-row-body" }, Lp = {
  key: 1,
  class: "list-row-end"
}, Np = {
  key: 1,
  class: "list-row-text"
}, Dp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", Op, [
      e.type ? (u(), h("span", Tp, w(e.type), 1)) : A("", !0),
      y("div", Rp, [
        e.title ? (u(), h("span", Ip, w(e.title), 1)) : A("", !0),
        y("div", Bp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), h("div", Lp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (u(), h("span", Np, w(e.text), 1)) : A("", !0)
    ]));
  }
}, s4 = /* @__PURE__ */ J(Dp, [["__scopeId", "data-v-dfc8c3a7"]]), jp = {
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
}, Pp = { claude: "Claude Code", codex: "Codex" }, qp = ["aria-expanded"], Fp = { class: "drop-label" }, Wp = ["value"], Hp = {
  key: 1,
  class: "drop-lead"
}, zp = { class: "drop-item-text" }, Up = {
  key: 2,
  class: "drop-note"
}, Vp = {
  key: 1,
  class: "drop-none"
}, Gp = {
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
    const n = e, a = t, s = L(!1), o = L(null), l = L(""), r = I(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      y("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (u(), z(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        y("span", Fp, w(e.label), 1),
        D(ye, {
          name: "down",
          size: 11
        })
      ], 10, qp),
      s.value ? (u(), z(Qn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (u(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Wp)) : A("", !0),
          (u(!0), h(K, null, ee(r.value, (f) => (u(), z(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: q(() => [
              f.running !== void 0 ? (u(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (u(), h("span", Hp, w(f.lead), 1)) : A("", !0),
              y("span", zp, w(f.label), 1),
              f.note ? (u(), h("span", Up, w(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? A("", !0) : (u(), h("p", Vp, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, Kp = /* @__PURE__ */ J(Gp, [["__scopeId", "data-v-29dfcce5"]]), o4 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...jp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), z(Kp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${P(Pp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Yp = {
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
}, ur = /* @__PURE__ */ J(Yp, [["__scopeId", "data-v-978e0921"]]), Jp = ["aria-label"], Zp = { class: "head" }, Qp = { class: "names" }, Xp = { class: "body" }, eg = {
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
    return (i, c) => (u(), z(fs, { to: "body" }, [
      D(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (u(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            y("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), h(K, { key: 0 }, [
                y("header", Zp, [
                  y("div", Qp, [
                    y("h2", null, w(e.title), 1),
                    e.abstract ? (u(), z(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  D(ks, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), z(ur, { key: 0 }, {
                  default: q(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : A("", !0),
                y("div", Xp, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Jp)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, l4 = /* @__PURE__ */ J(eg, [["__scopeId", "data-v-f276f055"]]), tg = {
  key: 1,
  class: "text-field-label"
}, ng = {
  key: 2,
  class: "text-field-end"
}, ag = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Fa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = qa(e, "modelValue"), a = Jn(), s = "onUpdate:modelValue" in (((d = hi()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), c = L(null);
    return t({ focus: () => c.value && c.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (u(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (u(), z(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (u(), h("span", tg, w(e.label), 1)) : A("", !0),
      tt(y("input", Fe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ka), o.value]
      ]),
      f.$slots.end ? (u(), h("span", ng, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : tt((u(), h("input", Fe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ka), o.value]
    ]);
  }
}), r4 = /* @__PURE__ */ J(ag, [["__scopeId", "data-v-d9c38ca8"]]), sg = { class: "title" }, og = { class: "state" }, lg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ha(t.line, t.events);
    return (o, l) => (u(), z(Gd, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: q(({ row: r }) => [
        y("span", sg, w(r.title), 1),
        y("span", og, w(P(wl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, i4 = /* @__PURE__ */ J(lg, [["__scopeId", "data-v-9191a6f0"]]);
function rg(e = 1e3, t = null) {
  const n = L(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ba = L(Date.now() / 1e3);
let So = 0, $n = 0;
function dr() {
  return $n || (ba.value = Date.now() / 1e3, So = setInterval(() => ba.value = Date.now() / 1e3, 1e3)), $n += 1, tl() && hs(() => {
    $n -= 1, $n || clearInterval(So);
  }), ba;
}
const ig = 200, cg = sr + Tn + or + ig;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function ug(e, t, n) {
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
function dg(e, t, n, a) {
  fe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(ug(o, l, n.value)), performance.now() - l < cg) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const fg = ["title", "data-figure-mark", "data-folded", "data-open"], hg = {
  key: 2,
  class: "worker"
}, mg = { class: "head" }, pg = { key: 0 }, gg = {
  key: 3,
  class: "status"
}, vg = {
  key: 0,
  class: "figure"
}, yg = {
  key: 1,
  class: "ran-for"
}, bg = { key: 2 }, wg = {
  key: 3,
  class: "news"
}, kg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, xg = {
  key: 6,
  class: "settled"
}, $g = {
  key: 1,
  class: "bar"
}, Mg = {
  key: 3,
  class: "detail body"
}, Sg = {
  key: 0,
  class: "body-label"
}, _g = ["title"], Eg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Jn(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = L(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), c = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || f.value || !!n.onClick), g = L(null), v = L(null), { folded: k, phase: $ } = lr(g, () => d.value);
    dg(g, d, $, Oe(Le, null));
    function B(ie) {
      var he, Ae;
      if (!(ie.target !== g.value && !v.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const F = (ie) => n.onAct(ie), H = ["failed", "unfinished"], C = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), x = I(() => t.mark.color ? t.mark.color : C.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : C.value ? `var(--tone-${C.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), T = I(() => x.value || "var(--tone-work)"), b = I(() => !t.mark.ending && !t.mark.ended && C.value !== "stopped"), R = dr(), S = I(
      () => t.mark.began_at && b.value && !t.mark.figure && !t.mark.counting ? j1(R.value - t.mark.began_at) : ""
    ), N = I(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${vo(he - ie, !0)}` : vo(R.value - ie, !0) : S.value;
    }), _ = ["bad", "danger", "warn"], p = I(() => _.includes(C.value) || t.mark.asks ? "attention" : b.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], E = I(() => M.includes(C.value)), O = I(() => p.value === "process" ? "running" : E.value ? "cross" : C.value === "stopped" ? "stopped" : C.value === "good" ? "tick" : ""), j = I(
      () => !!(t.mark.figure || N.value || t.mark.docked || t.mark.stopping || O.value || t.mark.settled || t.mark.news)
    ), Q = I(() => [t.mark.title, t.mark.time ? ir(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = I(() => ({
      ...x.value ? { "--mark": x.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (u(), h("div", Fe(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        P($),
        {
          open: c.value,
          folding: r.value && d.value,
          live: m.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: x.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: Q.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: B
    }), [
      (u(), z(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: v,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: q(() => [
          e.mark.markIcon ? (u(), z(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), z(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), h("span", hg, w(e.mark.worker), 1)) : A("", !0),
          y("span", mg, [
            D(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), h("strong", pg, w(e.mark.name), 1)) : A("", !0),
            i.value ? (u(), z($t, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          j.value ? (u(), h("span", gg, [
            e.mark.figure ? (u(), h("span", vg, w(e.mark.figure), 1)) : A("", !0),
            N.value ? (u(), h("span", yg, w(N.value), 1)) : A("", !0),
            e.mark.stopping ? (u(), h("span", bg, "Stopping")) : A("", !0),
            e.mark.news ? (u(), h("span", wg, w(e.mark.news), 1)) : A("", !0),
            O.value === "running" ? (u(), h("span", kg)) : O.value ? (u(), z(dt, {
              key: 5,
              class: Z(["sign", O.value]),
              name: O.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (u(), h("span", xg, w(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (u(), z(ar, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && b.value ? (u(), h("span", $g, [
        y("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: T.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !P(k) ? (u(), z(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !P(k) ? (u(), h("div", Mg, [
        e.mark.bodyLabel ? (u(), h("p", Sg, w(e.mark.bodyLabel), 1)) : A("", !0),
        D(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !P(k) ? (u(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, _g)) : A("", !0),
      e.mark.card ? (u(), z(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ue(ie.$slots, "default", {
        shown: !P(k)
      }, void 0, !0)
    ], 16, fg));
  }
}), fr = /* @__PURE__ */ J(Eg, [["__scopeId", "data-v-2aa9c496"]]), Ag = 60, hr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Cg(e, t) {
  const n = L([]), a = L(0);
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
    if (l || a.value <= 0 || d.scrollTop > Ag) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: c };
}
const Og = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function mr(e) {
  var n;
  const t = Og[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Tg = (e) => mr(String(e).split(":")[0]), pr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Rg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ig = { good: "good", warn: "warn", danger: "danger" }, _o = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Dd(e.target_model, e.target_id || 0)
}, Bg = { "open row": (e) => Tg(e.target_model), "open page": () => mr("pages") };
function Lg(e, t) {
  const n = t || {}, a = _o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Rg[e.outcome] || "" : Ig[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Bg[a](e) : "",
    handlers: a ? { onAct: () => _o[a](e) } : {}
  };
}
const Ng = 24, Dg = 1e3, Eo = 2e3, jg = 0.25, Pg = 5e3;
function qg(e, t = Ng, n = () => !0) {
  const a = L(!1), s = L(0), o = L(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const C = c();
    return C ? C.scrollHeight - C.scrollTop - C.clientHeight : 0;
  }, f = () => !c() || d() <= t;
  function m(C) {
    if (clearTimeout(l), !C) {
      o.value = !1, i = Date.now();
      return;
    }
    const x = Date.now() - i < Eo ? Eo : Dg;
    l = setTimeout(() => o.value = a.value, x);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function v(C = !1) {
    const x = c();
    x && C && x.scrollTo ? x.scrollTo({ top: x.scrollHeight, behavior: "smooth" }) : x && (x.scrollTop = x.scrollHeight), g();
  }
  function k() {
    B(), !a.value && (a.value = !0, m(!0));
  }
  const $ = () => !!c() && d() <= c().clientHeight * jg;
  function B() {
    clearTimeout(r), $() && (r = setTimeout(() => a.value && $() && n() && v(!0), Pg));
  }
  function F() {
    f() ? g() : k();
  }
  function H(C = 1, x = !1) {
    a.value ? s.value += Math.max(0, C) : v(x);
  }
  return tl() && hs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: v, left: k, scrolled: F, arrived: H };
}
const Fg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Wg = (e) => String(e ?? "").replace(Fg, ""), Hg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(null), { away: o, scrolled: l, arrived: r, toBottom: i } = qg(s);
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
      te(w(P(Wg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, zg = /* @__PURE__ */ J(Hg, [["__scopeId", "data-v-c2fb1783"]]), Ug = 1e4;
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
    return this.heardAt !== null && t - this.heardAt > Ug;
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
}, Yg = ["src", "title"], Jg = 1e3, Zg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = L(null), s = L(!1), o = L(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new Vg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Jg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), h("p", Gg, "This window was closed because it stopped answering.")) : (u(), h(K, { key: 1 }, [
      s.value ? (u(), h("div", Kg, [
        c[2] || (c[2] = y("p", null, "This window has not answered for ten seconds.", -1)),
        D(de, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: q(() => [...c[1] || (c[1] = [
            te("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      y("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: P(n).window
      }, null, 8, Yg)
    ], 64));
  }
}, Qg = /* @__PURE__ */ J(Zg, [["__scopeId", "data-v-32a49046"]]), Mn = (e) => e ? e.split(", ") : [];
function Xg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function ev(e, t) {
  return {
    reads: Mn(e.reads_allowed),
    runs: Mn(e.runs_allowed),
    missing: [...Mn(e.reads_missing), ...Mn(e.runs_missing)],
    ask: t
  };
}
const tv = {
  class: "allowance-prompt",
  role: "dialog"
}, nv = { class: "allowance-prompt-text" }, av = { class: "allowance-prompt-buttons" }, sv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", tv, [
      y("p", nv, w(P(Xg)(e.request)), 1),
      y("div", av, [
        D(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        D(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            te("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, ov = /* @__PURE__ */ J(sv, [["__scopeId", "data-v-cad69fe2"]]), wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), z(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        te(w(e.reason) + " ", 1),
        e.retry ? (u(), z(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (u(), z(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            te("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lv = ["data-window", "data-agent"], rv = {
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
    const n = e, a = t, s = L(""), o = L(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(jc, null), i = Tu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: Oe(Su, null),
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
      d() ? (u(), z(ov, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (u(), z(wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), z(wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), h(K, { key: 4 }, [
        (u(), z(c, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (u(), z(Es, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (u(), z(wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, lv));
  }
}, Gt = /* @__PURE__ */ J(rv, [["__scopeId", "data-v-c4443e2b"]]), gr = {
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
    const n = e, a = t, s = { render: () => Kn(Qg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), z(Gt, {
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
}, iv = ["data-window"], vr = {
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
    const n = e, a = t, s = Ke(null), o = L("");
    return fe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, nc();
          } catch (r) {
            if (ec(r) && tc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(Es, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, iv)) : (u(), z(Gt, {
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
}, cv = "*.*", uv = {
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
    const t = e, n = Oe(Le, null), a = new Cc();
    fe(
      () => a.patterns,
      (i, c, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [cv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), z(vr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), z(gr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, dv = { class: "mark-more-inner" }, fv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, hv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, mv = {
  key: 3,
  class: "mark-lines"
}, pv = "process", Ao = "task", gv = {
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
    const t = e, n = We(), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => pr.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Ao ? t.mark.target_id : 0), l = Cg(
      hr(n),
      () => t.mark.target_id
    ), r = l.lines, i = L(!1), c = L(""), d = I(() => !t.declaration.body_url && t.mark.target_model === pv && !!t.mark.target_id);
    async function f(g = l.follow) {
      const v = await g();
      i.value = !0, c.value = v.ok ? "" : v.error;
    }
    const m = I(() => t.shown && d.value);
    return fe(m, (g) => g && f()), ps(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, v) => (u(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: v[1] || (v[1] = xe(() => {
      }, ["stop"]))
    }, [
      y("div", dv, [
        e.declaration.body_url ? (u(), z(uv, {
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
            v[2] || (v[2] = y("p", { class: "mark-label" }, "Why it stopped", -1)),
            y("p", fv, w(s.value), 1)
          ], 64)) : A("", !0),
          d.value && c.value ? (u(), h("p", hv, w(c.value), 1)) : d.value && i.value ? (u(), h(K, { key: 2 }, [
            v[3] || (v[3] = y("p", { class: "mark-label" }, "Output", -1)),
            D(zg, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), h("p", mv, w(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (u(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: v[0] || (v[0] = xe((k) => P(qe)(`${Ao}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ts = /* @__PURE__ */ J(gv, [["__scopeId", "data-v-bfc56dfc"]]), vv = ["title", "aria-label", "onClick"], yv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, bv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => ud(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = L(""), s = Oe(Le);
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
        D(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, vv))), 128)),
      a.value ? (u(), h("span", yv, w(a.value), 1)) : A("", !0)
    ], 64));
  }
}, wv = /* @__PURE__ */ J(bv, [["__scopeId", "data-v-7a62c88e"]]);
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
const br = yr("/api/marks", "marks"), c4 = br.fetchAll, kv = br.find, xv = ["data-ref"], $v = ["data-ref"], Mv = { class: "mark-row" }, Sv = "dock add", _v = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => kv(a.mark.type)), o = I(() => Lg(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && pr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = L(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const c = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Sv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (u(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(ts, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, xv)) : (u(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        y("span", Mv, [
          D(fr, Fe({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, pi(o.value.handlers), { onClick: i }), gi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: v }) => [
                D(ts, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: v
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(wv, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, $v));
    };
  }
}, Ev = /* @__PURE__ */ J(_v, [["__scopeId", "data-v-8196402d"]]), Av = ["data-ref"], Cv = ["inert"], Ov = { class: "group-fold" }, Tv = { class: "thread-group" }, Rv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = L(!1), a = L(!1), s = L(!1), o = L(null);
    fe(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = I(() => ({
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
      D(fr, {
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
        y("div", Ov, [
          y("div", Tv, [
            (u(!0), h(K, null, ee(e.group.marks, (c) => (u(), z(Ev, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Cv)) : A("", !0)
    ], 8, Av));
  }
}, u4 = /* @__PURE__ */ J(Rv, [["__scopeId", "data-v-45b58b9b"]]);
function Iv(e) {
  const t = L(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Bv = { class: "chat-dock-fold" }, Lv = ["aria-label"], Nv = { class: "chat-dock-head" }, Dv = { class: "chat-dock-inner" }, jv = { class: "chat-dock-foot" }, wr = 700, Pv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = L(null), a = L(null), s = Iv(a), o = L(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, wr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      y("div", Bv, [
        y("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          y("header", Nv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          y("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            y("div", Dv, [
              y("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(P(s) === null ? null : { height: `${P(s)}px` })
              }, [
                y("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          y("footer", jv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Lv)
      ])
    ], 2));
  }
}, kr = /* @__PURE__ */ J(Pv, [["__scopeId", "data-v-74d44b19"]]), qv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ka = 5, Fv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ka, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ka}s`, animationDelay: `${(n - ka).toFixed(2)}s` };
    return (s, o) => (u(), h("span", qv, [
      y("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ J(Fv, [["__scopeId", "data-v-2a7bc150"]]), Wv = { reviewing: "Under review" }, Hv = (e, t) => e || Wv[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, zv = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, Uv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Vv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Gv = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Kv = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Yv = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Jv = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Zv = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Qv(e, t) {
  const n = { plan: zv, task: Uv }[e], a = t != null && t.state ? Mu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[kl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Xv = (e, t) => e === "doc" || e === "report" ? Zv(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Kv(t), ...Gv(t)] : e === "check" ? Jv(t) : e === "question" ? Vv(t) : e === "memory" ? Yv(t) : Qv(e, t), $r = yr("/api/docks", "docks"), d4 = $r.fetchAll, zt = $r.find, e0 = 6, t0 = 3, xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), n0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < ea(e) || n.has(e.id)), a0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => n0(a, t, n)).sort((a, s) => a.id - s.id);
function s0(e, t, n = e0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const o0 = (e, t, n = e) => n < 2 ? !1 : e >= t0 ? !0 : t, l0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ns = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), r0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), i0 = (e) => ({ ...e.kept ? ns("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ns("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), c0 = ["pins"], u0 = (e) => ({ ...e, iconOnly: c0.includes(e.icon) });
function d0(e, t) {
  var n;
  return [
    ...r0(e, t) ? [i0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ns("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(u0);
}
function f0(e, t) {
  const n = d0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: l0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const h0 = ["title"], m0 = {
  key: 2,
  class: "dock-controls"
}, p0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, g0 = { class: "dock-facts" }, v0 = { key: 1 }, y0 = {
  key: 2,
  class: "dock-kept"
}, b0 = { class: "dock-acts" }, w0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => zt(a.item.type)), o = dr(), l = I(() => rr(a.item.created_at, o.value * 1e3)), r = L(null), i = L(null), c = L(null), d = L(null), f = I(() => f0(a.item, s.value)), m = We(), g = I(() => `dock.${a.item.id}`), v = I(() => m.props[g.value].data.value), k = I(() => Pn(a.item.target_model ?? "")), $ = I(() => ({ ...v.value, id: a.item.target_id, noun: k.value })), B = () => {
      var R, S;
      return ((S = (R = s.value) == null ? void 0 : R.reads) == null ? void 0 : S.length) && m.reload(g.value);
    };
    qc(nl, { data: v, reload: B, readOutput: hr(m) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (R, S, N) => {
        var p;
        B();
        const _ = (p = m.subscriptions) == null ? void 0 : p.follow(`dock ${a.item.id}`, [`${k.value.replaceAll("-", "_")}.*`], (M) => {
          (!M.row_id || M.row_id === a.item.target_id) && B();
        });
        N(() => _ == null ? void 0 : _());
      },
      { immediate: !0 }
    );
    const F = L(/* @__PURE__ */ new Set()), H = L("");
    async function C(R) {
      if (R.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      R.action === "declared" && (F.value = /* @__PURE__ */ new Set([...F.value, R.label])), H.value = "";
      const N = await cn(R, { id: a.item.target_id }, m.environment);
      (N == null ? void 0 : N.ok) === !1 && (F.value = new Set([...F.value].filter((_) => _ !== R.label)), H.value = `Could not ${R.label.toLowerCase()}: ${N.error}`);
    }
    const x = I(() => f.value.actions.filter((R) => R.action !== "undock" && !F.value.has(R.label))), T = I(() => {
      var R;
      return Hv((R = s.value) == null ? void 0 : R.badge, $.value);
    }), b = I(() => f.value.buttons.find((R) => R.action === "undock"));
    return (R, S) => {
      var N, _, p, M;
      return u(), z(kr, {
        label: f.value.title + ((N = s.value) != null && N.needs_user ? ", waiting for you" : ""),
        type: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((p = s.value) != null && p.folds) && e.folded,
        body: !!((M = s.value) != null && M.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[3] || (S[3] = (E) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (u(), z(xr, {
            key: 0,
            "ends-at": P(ea)(e.item)
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: q(() => {
          var E, O;
          return [
            (E = s.value) != null && E.draws_head && !e.collapsed ? (u(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), h(K, { key: 1 }, [
              D(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              y("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, h0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (u(), h("span", m0, [
              (u(!0), h(K, null, ee(f.value.controls, (j) => {
                var Q, ne;
                return u(), h(K, {
                  key: j.action + j.runs
                }, [
                  !F.value.has(j.label) && (!((Q = j.variants) != null && Q.length) || !((ne = $.value) != null && ne.state) || j.variants.includes($.value.state)) ? (u(), z(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: j.pressed }),
                    "aria-pressed": j.pressed,
                    "aria-label": j.label,
                    title: j.label,
                    "data-dock-action": j.action,
                    onClick: (ie) => C(j)
                  }, {
                    default: q(() => [
                      D(ye, {
                        name: j.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : A("", !0)
                ], 64);
              }), 128))
            ])) : A("", !0),
            y("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (O = s.value) != null && O.leaves_after_seconds ? A("", !0) : (u(), h(K, { key: 0 }, [
                te(w(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: q(() => [
          H.value || e.refusal ? (u(), h("p", p0, w(H.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: q(() => {
          var E, O;
          return [
            y("span", g0, [
              T.value ? (u(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(T.value), 3)) : A("", !0),
              (E = s.value) != null && E.word ? (u(), h("span", v0, w(s.value.word), 1)) : A("", !0),
              y("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (u(), h("span", y0, "Kept")) : A("", !0)
            ]),
            (O = s.value) != null && O.folds ? (u(), z(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[0] || (S[0] = (j) => n("fold"))
            }, {
              default: q(() => [
                te(w(s.value.folds) + " ", 1),
                D($t, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            y("span", b0, [
              y("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              D(Md, {
                name: `dock.${e.item.type}`,
                row: $.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Pn)(e.item.target_model),
                "external-failure": "",
                onFailure: S[1] || (S[1] = (j) => H.value = j),
                onDone: R.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), h(K, null, ee(x.value, (j) => (u(), z(de, {
                key: j.action + j.runs,
                small: "",
                variant: j.primary ? "primary" : "ghost",
                bordered: !j.primary,
                "data-dock-action": j.action,
                onClick: (Q) => C(j)
              }, {
                default: q(() => [
                  te(w(j.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              D(de, {
                small: "",
                bordered: "",
                title: b.value.label,
                "data-dock-action": "undock",
                onClick: S[2] || (S[2] = (j) => n("undock", b.value))
              }, {
                default: q(() => [...S[4] || (S[4] = [
                  te("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: q(() => {
          var E;
          return [
            (E = s.value) != null && E.body_url ? (u(), z(ts, {
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
}, Co = /* @__PURE__ */ J(w0, [["__scopeId", "data-v-28eea3b5"]]), k0 = ["title", "aria-label"], x0 = { class: "run-chip-in" }, $0 = {
  key: 0,
  class: "run-chip-ring"
}, M0 = { class: "run-chip-name" }, S0 = { class: "run-chip-bar" }, _0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = I(() => `run.${a.item.target_id}`), l = I(() => s.props[o.value].data.value), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), c = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), ft(() => f == null ? void 0 : f()), (m, g) => {
      var v;
      return u(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": c.value })
      }, [
        P(wt)(e.item) ? (u(), z(xr, {
          key: 0,
          "ends-at": P(ea)(e.item)
        }, null, 8, ["ends-at"])) : A("", !0),
        y("span", x0, [
          r.value ? (u(), h("span", $0)) : (u(), z(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          y("span", M0, w(i.value), 1)
        ]),
        y("span", S0, [
          y("i", {
            style: ge({ width: r.value ? `${((v = l.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, k0);
    };
  }
}, E0 = /* @__PURE__ */ J(_0, [["__scopeId", "data-v-df62d8b3"]]), A0 = 24, C0 = 8, f4 = 420;
function h4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= A0 ? !0 : e < t && s > C0 ? !1 : null;
}
const O0 = (e, t) => e === void 0 ? t : e, T0 = { me: 1, people: [] }, Wn = Yn({
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
  people: T0,
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
function R0(e, t, n) {
  try {
    const a = n.getItem(Mr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function I0(e, t, n) {
  try {
    n.setItem(Mr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Oo(e, t, n = window.localStorage) {
  const a = L(R0(e, t, n));
  return fe(a, (s) => I0(e, s, n), { deep: !0 }), a;
}
const B0 = {
  key: "dock-all",
  class: "dock-all"
}, L0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, N0 = { class: "dock-runs-title" }, D0 = { class: "dock-runs-chips" }, j0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var _, p;
    const t = e, n = rg(500), a = L(/* @__PURE__ */ new Set()), s = L(!1), o = L(!1), l = Oe(Le), r = L(/* @__PURE__ */ new Set()), i = L({});
    async function c(M, E) {
      i.value = { ...i.value, [M.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, M.id]);
      const O = await cn(E, { id: M.target_id }, l.environment);
      (O == null ? void 0 : O.ok) === !1 && (r.value = new Set([...r.value].filter((j) => j !== M.id)), i.value = { ...i.value, [M.id]: `Could not close this card: ${O.error}` });
    }
    const d = I(
      () => a0(
        t.items.filter((M) => !r.value.has(M.id)),
        n.value,
        a.value
      )
    ), f = I(
      () => s0(
        d.value.filter((M) => xa(M, zt)),
        n.value
      )
    ), m = I(() => d.value.filter((M) => !f.value.includes(M) && !xa(M, zt))), g = I(() => f.value.filter((M) => !wt(M))), v = Oo(`dock-size:${((_ = Wn.identity) == null ? void 0 : _.root) || location.host}`, null), k = (M) => v.value ? v.value.collapsed && !v.value.opened.includes(M.id) : t.collapsed, $ = I(() => d.value.some(k)), B = I(() => (s.value = o0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(k));
    function F() {
      v.value = { collapsed: !$.value, opened: [] };
    }
    function H(M) {
      var O;
      if (!k(M)) return;
      const E = (O = v.value) != null && O.collapsed ? v.value.opened : [];
      v.value = { collapsed: !0, opened: [...E, M.id] };
    }
    const C = Oo(`dock-folded:${((p = Wn.identity) == null ? void 0 : p.root) || location.host}`, {}), x = (M) => {
      var E;
      return !!((E = zt(M.type)) != null && E.folds) && O0(C.value[M.id], xa(M, zt) || t.folded);
    };
    function T(M) {
      C.value = { ...C.value, [M.id]: !x(M) };
    }
    function b(M) {
      C.value = { ...C.value, ...Object.fromEntries(f.value.map((E) => [E.id, E.id !== M.id])) }, o.value = !0;
    }
    function R() {
      C.value = Object.fromEntries(Object.entries(C.value).filter(([M]) => !f.value.some((E) => String(E.id) === M))), o.value = !1;
    }
    function S(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function N(M) {
      a.value = new Set([...a.value].filter((E) => E !== M.id));
    }
    return (M, E) => (u(), z(el, {
      tag: "div",
      name: "dock",
      duration: P(wr),
      class: "dock-stack"
    }, {
      default: q(() => [
        d.value.length > 1 ? (u(), h("div", B0, [
          D(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": $.value ? "Open all" : "Collapse all",
            onClick: F
          }, {
            default: q(() => [
              D($t, {
                open: !$.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : A("", !0),
        (u(!0), h(K, null, ee(m.value, (O) => (u(), z(Co, {
          key: O.id,
          item: O,
          class: Z({ timed: P(wt)(O) }),
          leaving: P(wt)(O) && !a.value.has(O.id),
          folded: x(O),
          collapsed: k(O),
          refusal: i.value[O.id],
          onOpen: (j) => H(O),
          onFold: (j) => T(O),
          onUndock: (j) => c(O, j),
          onMouseenter: (j) => S(O),
          onMouseleave: (j) => N(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !$.value ? (u(), h("div", L0, [
          y("span", null, w(f.value.length) + " runs", 1),
          D(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: R
          }, {
            default: q(() => [
              E[1] || (E[1] = te(" Runs ", -1)),
              D($t, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (u(!0), h(K, null, ee(B.value ? [] : f.value, (O) => (u(), z(Co, {
          key: O.id,
          item: O,
          class: Z({ timed: P(wt)(O) }),
          leaving: P(wt)(O) && !a.value.has(O.id),
          folded: x(O),
          collapsed: k(O),
          refusal: i.value[O.id],
          onOpen: (j) => H(O),
          onFold: (j) => T(O),
          onUndock: (j) => c(O, j),
          onMouseenter: (j) => S(O),
          onMouseleave: (j) => N(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        B.value ? (u(), z(kr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: q(() => [
            D(ye, {
              name: "runs",
              size: 14
            }),
            y("span", N0, w(f.value.length) + " runs", 1)
          ]),
          foot: q(() => [
            y("span", D0, [
              (u(!0), h(K, null, ee(f.value, (O) => (u(), z(E0, {
                key: O.id,
                item: O,
                onClick: (j) => b(O)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            D(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: E[0] || (E[0] = (O) => o.value = !0)
            }, {
              default: q(() => [
                E[2] || (E[2] = te(" Runs ", -1)),
                D($t)
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
}, m4 = /* @__PURE__ */ J(j0, [["__scopeId", "data-v-d078676b"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Rn = (e) => Math.min(Math.max(e, 0), 1), P0 = (e) => {
  const t = Rn(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => P0((e - t) / (n - t));
function p4(e) {
  const t = Rn(e), n = Rn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), c = Math.sin(Math.PI * Rn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function g4(e, t, n, a, s) {
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
}, v4 = (e) => To[e] ?? To.butler, As = 2400, q0 = 0.05;
function F0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, q0), l = Math.min(t + As * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function y4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function W0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function b4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const w4 = (e, t) => ({ ...e, stretch: t.stretch }), k4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Sr = (e, t) => t >= (e.least ?? 0);
function x4(e, t, n) {
  if (!Sr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const $4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), H0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ro = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), z0 = (e) => e.right > e.left && e.bottom > e.top;
function M4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(H0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Ro(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Ro(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), z0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
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
        const v = (o[f] - e[d]) / g, k = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(v, k)), r = Math.min(r, Math.max(v, k));
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
}, en = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), U0 = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => U0(en(e, t, n)), V0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Sn = ([e, t], n) => e + n() * (t - e);
function G0(e) {
  return V0.map(() => {
    const t = Sn(it.speed, e), n = Sn(it.angle, e) * Math.PI / 180, a = Sn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Sn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const K0 = G0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Y0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function S4(e, t, n = K0) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Y0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((d, f) => d + o.velocity[f] * i);
  return c[2] -= it.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const _4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function E4(e, t) {
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
const A4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function C4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), c = i - o - e, d = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function O4(e, t, n) {
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
function T4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = F0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function R4(e) {
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
function J0(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = W0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function I4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = J0(n, e.length), c = e.map((B, F) => ({ ...as(B, t, Math.min(n / o.fps, In(F).shot)), shot: F < i })), d = Ee(l / o.frames, o.aim), [f, m] = [c[Math.max(r - 1, 0)], c[r]], g = e.map((B, F) => ({ bug: B, index: F, seconds: n / o.fps - In(F).shot, spot: as(B, t, In(F).shot) })).filter((B) => B.seconds >= 0), v = g.flatMap((B) => {
    const F = (s == null ? void 0 : s.get(B.index)) ?? ty(B.bug, t, B.spot, s ? [] : a);
    return s == null || s.set(B.index, F), s && ny(F, B.seconds, a), ay(F, B.seconds, a);
  }), k = g.filter((B) => X0(B.bug)).map((B) => ({ seconds: B.seconds, from: B.spot })), $ = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: $ }, slush: v, camera: k };
}
function In(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function B4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, d) => {
    const f = In(d), m = as(c, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), v = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), k = Math.abs(m.x - i) >= g ? i : m.x + v * g, $ = v > 0 ? Math.max(i, Math.min(k, r)) : Math.min(i, Math.max(k, l)), B = { from: i, to: $, begin: f.walk, end: f.aim };
    return i = $, B;
  });
}
function L4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Z0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Q0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const X0 = (e) => e.along * 97 % 1 < $e.camera, tn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function ey(e, t, n) {
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
function ty(e, t, n, a = []) {
  const s = Q0(e.along + 1), [o, l] = Z0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), c = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...ey(d, t, a) };
  });
}
function ny(e, t, n) {
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
function ay(e, t, n = []) {
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
function N4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, c]), m = Ee(e, [c, c + d]);
  return l.map((g) => {
    const v = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (v.x - n.x) * f,
      y: n.y + (v.y - n.y) * f,
      r: g.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function D4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (k) => {
    const [$, B] = [k.x - e.at.x, k.y - e.at.y];
    return { x: r.x + $ * c - B * d, y: r.y + $ * d + B * c };
  }, [m, g] = [...n].sort((k, $) => k.x - $.x), v = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: v.map((k, $) => ({ from: k, to: $ < v.length / 2 ? m : g })) };
}
const j4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: en(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: en(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function P4(e, t) {
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
const q4 = (e) => e === "pack_box";
function F4(e) {
  const { into: t, out: n } = Hn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function W4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Hn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const sy = { after: 3 }, Cs = 10, oy = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, ly = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, ry = { weight: 19 }, Er = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, iy = { every: 120 }, Ar = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Cr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, cy = {
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
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Cs }), ae = (e, t, n = {}) => dn(e, "clip", t, n), $a = (e, t, n = {}) => dn(e, "look", t, n), Io = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), uy = 120, dy = 300, Ma = (e, t) => ({ ...ae(e, t), cooldown: dy }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), fy = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: oy[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: ly[e.name] }), ta = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...re("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), we(1)]),
  ...re("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...re("sin_fixed", { cooldown: 300 }, [ae("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...re("sin_committed", { cooldown: 300 }, [ae("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...re("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), we(7)]),
  ...re("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...re("reported", { cooldown: 90 }, [Io("read", 3), ae("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [Io("read", 3), we(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), we(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, fy()),
  ...re("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...re("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...re("launched", { cooldown: 300 }, [ae("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...re("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), we(69)]),
  ...re("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), we(2)]),
  ...re("refused", { cooldown: 20 }, [ae("shake", 1), we(1)]),
  ...re("work_done", { cooldown: 120 }, [ae("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...re("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...re("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...re("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...re("answered", { cooldown: 15 }, [$a("amused", 3), we(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), we(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), we(13)]),
  ...re("typing", { cooldown: 60 }, [$a("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(cy).flatMap(([e, t]) => re(`reacted:${e}`, {}, [$a(t, 1)])),
  ...Object.entries(Ar).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Cr).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...re("pastime", {}, [
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
    { ...Wt(yt(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(yt(ae("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: uy }, [Ma("search", 3), { ...Ma("binoculars", 2), when: { home: !0 } }, { ...Ma("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...re("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...yt(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ae("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [Wt(yt(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: Er.build.cooldown }, [pe("unit", ry.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: iy.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
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
  ...re("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...re("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...re("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Or = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Tr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), hy = (e) => Array.isArray(e) ? e[0] : e, my = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, py = (e) => ta.some((t) => t.when.moment === e);
function gy(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Tr(d).every(([f, m]) => n(f) >= hy(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => Or(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= sy.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ue(e, t) {
  const n = gy(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Rr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Rr(e, t, n) {
  var a;
  for (const [s, o] of Tr(t)) (a = e.memory) == null || a.set(s, e.now + my(o, n));
}
function H4(e, t, n) {
  Rr(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const z4 = (e) => Object.values(Er).find((t) => Or(t.when, e)) ?? null, vy = (e, t, n) => n - t <= (e.lifetime ?? Cs), U4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Sr(e.clip, t));
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
}, V4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Br = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), G4 = {
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
}, K4 = 120, yy = 20, Y4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < yy), by = (e) => ss[e] || ss.idle, J4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Lr = "airborne", wy = "landing", ky = "travelling", Nr = "grounded", Z4 = ({ airborne: e, landing: t, trip: n }) => e ? Lr : t ? wy : n != null && n.started ? ky : Nr;
function Q4(e, t) {
  var s;
  const n = xy(e, t);
  return e.mode === Nr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function xy(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Lr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...$y(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : by(c), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function $y(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const os = (e) => e.outcome, My = "plugin:code-commandments:sins:", Bo = (e) => e.type === "plugins.card" && e.markKey.startsWith(My), Sy = [
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
], X4 = (e, t) => e.filter((n) => n.author === "user" && qn(n.read_at) > t).map((n) => ({ beat: "read_message", time: qn(n.read_at), card: Zl(n) })).sort((n, a) => n.time - a.time), Lo = { user: "reacted", agent: "agent_reacted" };
function ex(e, t) {
  return e.filter((n) => Lo[n.author] && St(n) > t).map((n) => ({ beat: `${Lo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const _y = [.../* @__PURE__ */ new Set([...Object.values(Ar).flatMap((e) => Object.keys(e)), ...Object.keys(Cr)])];
function tx(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = _y.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Zl(n) })).sort((n, a) => n.time - a.time);
}
const Ey = (e) => new Ir(e).isTest(), zn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[os(e)] || "";
}, Ay = 1800, Cy = (e, t) => {
  if (zn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && zn(n) !== "finished" && Number(e.time) - Number(n.time) <= Ay ? "tests_fixed" : "tests_passed";
};
function nx(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Ey), s = a.filter((r) => zn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, zn(r))), o.map((r) => ({ beat: Cy(r, s), time: Number(r.time), card: r.key }));
}
function ax(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(os(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: os(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const sx = (e) => e.map((t) => {
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
function ox(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function lx(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function rx(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Sy.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Os(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const No = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Oy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Os(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function ix(e, t, n, a = {}) {
  const s = Ue({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : py(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function cx(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const Do = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function ux(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, c = Do((r - i) / Te.returnSeconds), d = r <= i ? Do(r / i) : 1 - c, f = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const jo = 3, Dr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Po = 12, dx = (e, t) => ({ mood: e, began: t, seen: 0 });
function fx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Dr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= jo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Po) / Po, lasts: jo } };
}
const hx = (e) => e.posture === "hang" && !Dr(e.face), Ty = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Ry = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function mx(e, t, n) {
  return Ty.has(e) ? 1 / 0 : !Ry.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(jr(n - t.began, t.share) - Xe.lead, 0);
}
const Iy = 5;
function px(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Iy ? { beat: "long_walk", time: n } : null };
}
const By = 30, _n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function gx(e, t, n, a, s = null) {
  if (t && n < t.until || !_n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ue({ moment: "spell", state: e, tally: s }, a), [l, r] = _n.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + _n.every } : { state: e, began: 0, until: 0, next: n + _n.every };
}
const vx = (e, t, n) => t && n < t.until && Br.has(e.state) ? { state: t.state, since: t.began } : e, Xe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, jr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function yx(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = jr(o, e.share);
  return s ? { eager: Ly(t, l), moment: null } : l > Xe.lead ? { eager: t, moment: null } : l < Xe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Xe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Xe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ue({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Ly(e, t) {
  return e.on && t > Xe.lead + Xe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Xe.lead && t >= Xe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Ny = 1, Dy = { look: "look", gaze: "gaze" };
function jy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ue({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Dy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Py = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ue({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), qy = (e, t, n, a, s, o = 0) => Ue({ moment: "jump", high: e > Ny * t, memory: a, now: s, room: o }, n).name === "backflip", Fy = { work: ["building"], idle: ["standing"] };
function bx(e, t, n, a) {
  const s = ss[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Fy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Br.has(e) ? { moments: o, began: n || a } : (n && a - n >= By && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Wy(e, t, n) {
  return !Ue({ moment: "pondering", memory: e, now: t }, n) || !Ue({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ue({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const qo = { pondering: Wy };
function wx(e, t, n, a, s, o) {
  if (qo[e.beat]) {
    const r = qo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = jy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Cs && { lifetime: l.lifetime } } } : null;
}
function kx(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Py(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const xx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function $x(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Mx(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Sx = (e, t) => !!(e != null && e.watches) && !t.once, _x = 10, Ex = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || vy(a, a.queuedAt, n)), Ax = (e, t) => t ? null : e[0] ?? null;
function Cx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Ox = (e, t) => !t.during || !e.some((n) => n.during === t.during), Hy = 2 * Math.PI, zy = 500;
function Tx(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / zy, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, d = t && !c ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Hy * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, k = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Vy(g, t, n, m, s) : Ky(g, t, n, m) : t) ?? g, $ = k != null && k.behind && k.mood === "reading" ? Uy(e.point, k, n, l, s) : k;
  return { point: $ ?? null, toward: $ ? { x: $.x - n.x, y: $.y - n.y } : null, amount: f, at: a };
}
function Uy(e, t, n, a, s) {
  const o = (S) => S * 180 / Math.PI, l = (S) => o(Math.atan2(Math.sin(S * Math.PI / 180), Math.cos(S * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, v = g + l(c - g), k = Math.min(Math.max(a / 1e3, 0), 0.1), $ = Te.turnSpeed * k, B = f ? g + Math.min(Math.max(v - g, -$), $) : v, F = f ? e.readingFollow + m : B, H = F + (B - F) * (1 - Math.exp(-k / Te.followSeconds)), C = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, x = o(Os(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), T = Math.min(Math.max(x, -C.up), C.down), b = Te.tipSpeed * k, R = f ? e.readingPitch + Math.min(Math.max(T - e.readingPitch, -b), b) : T;
  return { ...t, readingYaw: B, readingFollow: H, readingPitch: R, readingFacing: r };
}
function Vy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: H, pitch: C } = Os(F.x - n.x, s, n.y - F.y, o);
    return { yaw: H, pitch: Math.min(Math.max(C, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [No(r(e)), No(r(t))], d = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [v, k, $] = i.map((F, H) => m * F + g * c[H]), B = s * v / k;
  return { ...t, x: n.x + B, y: n.y - Oy(B, s, -Math.asin(Math.min(Math.max($, -1), 1)), o) };
}
const Gy = 0.15;
function Rx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Gy;
}
function Ky(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Yy = (e) => !(e != null && e.on);
function Ix(e, t, n) {
  if (Yy(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const nn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Sa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Fo = (e) => e * e * (3 - 2 * e);
function Jy(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Sa(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, a = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Fo(Sa(e, ...Je.fade)), lit: a, white: e < Je.flash[0] ? 0 : 1 - Fo(Sa(e, ...Je.flash)) };
}
const Bx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Lx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Jy(t - e.at);
  return a && { colour: nn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...a } };
}
function Nx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Dx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= nn.looks || a === null && n - e.since >= nn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function jx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Px = { behind: 39, figure: 40, ahead: 41 }, Zy = "[data-figure-pile]", Qy = { amber: [1, 0.69, 0.125], good: nn.colours.good, bad: nn.colours.bad }, Bn = { phases: 4, ms: 230, dim: 0.25 }, qx = (e, t, n) => e !== "amber" || (t + n) % Bn.phases < Bn.phases / 2 ? 1 : Bn.dim, Fx = (e) => e === "amber" ? Bn.phases : 1;
function Wx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Hx = Object.keys(Qy), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function zx(e) {
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
function Ux(e) {
  const t = Math.floor(e / _a.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + _a.gap)), up: e % _a.high * (rt.height - rt.top) };
}
const Xy = (e, t, n) => Ue({ moment: "unit", memory: e, now: t }, n) !== null, eb = { after: 5 }, tb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ir(t).isBuild());
function Vx(e, t, n) {
  const a = tb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= eb.after ? s : null;
}
function Gx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Xy(n, a, s) } : null;
}
const Wo = { ahead: 140, up: 70 };
function Kx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Wo.ahead, y: a - Wo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ea = { least: 4e3, most: 1e4 }, nb = (e) => Ea.least + e() * (Ea.most - Ea.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Yx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = nb(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const Jx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Zx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Qx = new Set(ta.filter((e) => Pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), ab = (e) => e.some((t) => t.state === "built"), Xx = (e, t) => ab(t) ? e.filter((n) => !Pr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, sb = (e, t) => t <= e - ut.reach + 2, e$ = (e, t, n) => sb(e, n) ? t - ut.reach : e - ut.reach - ut.room, t$ = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Aa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, n$ = (e) => Ut(e() < Aa.longShare ? Aa.long : Aa.short, e), ob = 2 * rt.width;
function a$(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= ob ? o : e + (o - e + s / 2) % s;
}
const lb = 60, s$ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= lb, Ho = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Ho);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ho)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, rb = "[data-figure-docked-bars]", ib = "[data-figure-chat-foot]", cb = [0.85, 0.6, 0.35, 0.15], ub = ["question", "waiting", "suggestion"], o$ = (e, t) => ub.find((n) => e[n] > 0 && t[n] === "behind") || null;
function l$() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const db = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", fb = "[data-figure-newest]";
function qr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(fb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function r$(e, t, n, a = qr()) {
  if (!a || an(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Is * e.size : Kr * e.size, c = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= c && m.x <= d && an(m, e, a) && Fb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Ca = 0.26, Fr = 0.54, hb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ca, travels: "stand" },
  lounge: { drop: Ca, travels: "stand" },
  composed: { drop: Ca, travels: "stand" },
  hang: { drop: Fr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, i$ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * hb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fr
}), Kt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), mb = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), c$ = (e, t) => (e === "sit" ? mb.has(t) : Kt.has(e)) ? e : "stand";
function u$(e, t) {
  return e.facing === t.facing || !Kt.has(e.posture) && !Kt.has(t.posture) ? t : { posture: "stand", facing: Kt.has(e.posture) ? e.facing : t.facing };
}
const d$ = 0.25, f$ = (e, t) => Kt.has(e) && hn[t].drop === 0, Wr = 2, pb = 90, gb = 180, vb = 140, yb = 280, bb = 420, wb = 0.25, kb = 290, xb = 600, $b = "cubic-bezier(0.2, 0.7, 0.4, 1)", Mb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Oa = 5;
function Un(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Oa) return null;
  (l || r) && (o = Math.max(o, Wr));
  const g = o > 1, v = Math.abs(t.x - e.x), k = v < Oa ? 0 : v / (pb * o) * 1e3, $ = Math.min(k, g ? vb : gb), B = Math.abs(t.y - e.y), F = t.y < e.y, H = F && !m && qy(B, n, i, c, d, f), C = F ? bb + Math.min(B, 400) * wb : Math.sqrt(2 * B / As) * 1e3, x = {
    x: t.x,
    y: t.y,
    ms: B > Oa ? H ? xb : C : 0,
    lead: H ? kb : F ? yb : 0,
    easing: F ? $b : Mb,
    hopping: !0,
    clip: H ? "backflip" : F ? "jump" : "fall"
  }, T = { x: t.x, y: t.y, ms: k + $, lead: 0, easing: "linear", ramp: $, ...g ? { clip: "run" } : {} }, b = m ? Sb(t, n) : x, R = F && !a ? [{ ...T, y: e.y }, b] : [{ ...x, x: e.x }, T];
  return { way: Math.sign(t.x - e.x) || 1, legs: R, lands: !s, pace: o, running: g };
}
const Sb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), _b = (e, t) => e.postures.includes(t) ? t : e.postures[0], h$ = (e, t, n) => e.posture === "walk" && n ? "walk" : _b(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
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
function m$(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + zo && a.right <= n.right - zo;
}
function Rs(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - En && r <= n.right + En && a.top >= n.top - En && i <= n.bottom + En;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, Eb = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Eb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Ab(e, { size: t }, n = At()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Is = (Ce.right - Ce.left) / 2 + 0.08;
function p$(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Cb = "[data-figure-agent]";
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
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(db)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Ts(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return zr(s).filter(([r, i]) => l(r, i) || Hr(r, i, n)).length;
}
function Ob(e, t) {
  const n = at(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Hr(a, s, "", Cb)).length;
}
const Uo = 4;
function g$(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Uo; o <= s; o += Uo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Ob(r, e) && an(r, e)) return r;
    }
  return null;
}
function sn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Rs(l, t, a) && an(l, t)).map((l) => ({ spot: l, covered: Bs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Ur = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Tb = [0.5, 0.25, 0.75], Rb = (e) => Ur(e.getBoundingClientRect(), Tb), Vr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Ib = Is, Bb = (e, t, { size: n }, a = Ib) => Gr(e, Vr[t], a * n, "stand");
function Gr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Lb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Kr = 0.1, Nb = (e, t, { size: n }) => Gr(e, Lb[t], Kr * n, "sit"), Db = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ta = 60;
function v$(e, t) {
  const n = Db(t);
  return !e.aside || Math.abs(n) >= Ta ? t : n < 0 ? 360 - Ta : Ta;
}
const Yt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, jb = (e) => [.../* @__PURE__ */ new Set([e, ...Yt.turns.map((t) => (t + 360) % 360)])];
function y$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = jb(t), l = Yt.every[0] + a() * (Yt.every[1] - Yt.every[0]);
  return { face: t, from: s ? Pb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Pb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Yt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function b$(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => mn(Nb(a, r, e), e)).filter((r) => n && Rs(r, e) && !Bs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function w$(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Yr } : e;
}
const Yr = 7;
function Jr() {
  const e = [...document.querySelectorAll(Zy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function qb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function Fb(e, t) {
  const n = Jr();
  return !n || !na(qb(e, t), n);
}
const Wb = 4;
function sa() {
  const e = pn(), t = Jr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Wb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yr - n, 0) } };
}
const k$ = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Ab(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ls = (e, t) => Object.keys(Vr).map((n) => mn(Bb(e, n, t), t)), Ls = (e, t) => Ur(e, cb).map((n) => mn(n, t)), Zr = (e, t, n) => sn(e, t, n) ?? e[0];
function x$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Zr(ls(a, e), e, t), view: null, on: n };
}
function $$(e, t, n, a) {
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
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(rb);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Vo = { within: 2 };
function M$(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Vo.within || a.left + a.width < s.left + s.width - Vo.within;
}
const Hb = "[data-figure-closing]";
function S$() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Hb));
}
const Qr = "[data-figure-progress]";
function _$(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function E$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const zb = { across: 300, above: 380, below: 60 };
function A$(e) {
  const { across: t, above: n, below: a } = zb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Ub(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Ub = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Xr = "[data-figure-bar]", rs = { back: 144, along: 0.4 };
function C$(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(Xr) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function O$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < rs.along * a.size ? t.x + rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function T$(e) {
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
function R$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Vb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Vb(e, t, n, a, s) {
  const o = Ls(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return sn(r.length ? r : o, t, n);
}
const Gb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function I$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Wr));
  const g = (H) => {
    const C = at(H, n, hn[H.posture].travels);
    return { x: C.left, y: C.top };
  }, v = t.ladder ?? e.ladder;
  if (v && !(t.ladder && e.ladder)) return Kb(g(e), g(t), g({ ...v.foot, posture: "stand" }), v.way, !!t.ladder, n, s);
  const [k, ...$] = [e, ...i, t].map(g), B = Un(k, $[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: d, room: f, pogo: m }), F = $.slice(1).map((H, C) => {
    var x;
    return (x = Un($[C], H, n.size, { random: r, memory: c, now: d, room: f })) == null ? void 0 : x.legs.find((T) => T.hopping);
  });
  return B && { ...B, legs: [...B.legs, ...F.filter(Boolean)] };
}
function Kb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Gb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Un(e, n, o.size, { pace: l }) : Un(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function B$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function L$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && sn(Rb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Zr(Ls(s, t), t, n), view: null, on: a };
}
const Yb = "[data-figure-bubble]", Jb = 250;
let Jt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ei = 0;
const qt = () => Jt, Ra = /* @__PURE__ */ new WeakMap();
let Zb = 0;
function Ns(e) {
  return Ra.has(e) || Ra.set(e, `floor-${++Zb}`), Ra.get(e);
}
const Qb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Xb = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function ew(e, t) {
  var a;
  const n = (a = e.querySelector(ib)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function tw(e, t) {
  const n = e && ew(e, t), a = e ? [...e.querySelectorAll(Yb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Qb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ns(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const nw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Jb ? (t.top - a.top) / s * 1e3 : 0;
};
function ti(e = Jt, t = performance.now()) {
  const n = At(), a = Xb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = oa();
  return c.element && i.push({ id: Ns(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...tw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: nw(e, d, t) }))) });
}
const is = /* @__PURE__ */ new Set();
function aw(e) {
  return is.add(e), () => is.delete(e);
}
function sw() {
  ni();
  const e = () => {
    ei = requestAnimationFrame(e), !document.hidden && (Jt = ti(Jt), is.forEach((t) => t(Jt)));
  };
  e();
}
function ni() {
  cancelAnimationFrame(ei);
}
const Ds = 5, ow = 56, lw = { share: 0.6 }, rw = (e) => -Math.sqrt(2 * As * lw.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function N$(e, t = ti().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ns(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function ai({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const c = Nt(i, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || iw(c, d, o)) && cw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const js = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, iw = (e, t, n) => !js({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function D$(e, t = qt().floors) {
  if (!js(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ds && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function cw(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Rs(e, t);
}
function j$(e, t, n, a = qt().floors) {
  const s = ai(e, n, a);
  if (!e.home) return uw(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Ds ? "dropping" : -l > ow ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function uw(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: rw(e.risen) };
  if (!n) return null;
  if (js(t) && n.y - t.y > Ds) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function P$(e, t, n) {
  const a = Is * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function q$(e, t, n, a = qt().floors) {
  const s = t && ai(t, n, a);
  return s ? { ...e, ...s } : e;
}
const dw = ["data-type"], fw = { class: "figure-floor-name" }, hw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      y("span", fw, w(e.floor.type), 1)
    ], 12, dw));
  }
}, mw = /* @__PURE__ */ J(hw, [["__scopeId", "data-v-4e0f1e2e"]]), pw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, gw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(qt().floors);
    let n = () => {
    };
    return Re(() => {
      n = aw((a) => t.value = a.floors), sw();
    }), Be(() => {
      n(), ni();
    }), (a, s) => (u(), h("div", pw, [
      (u(!0), h(K, null, ee(t.value, (o) => (u(), z(mw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, F$ = /* @__PURE__ */ J(gw, [["__scopeId", "data-v-e519168b"]]), Ia = (e) => typeof e == "number" ? e : Date.parse(e);
function W$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ia(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ia(s.row.created_at) - Ia(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const vw = 3, Ba = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function yw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ba[n.grouping]) == null ? void 0 : a.call(Ba, e.row, n)) || "";
}
function bw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function H$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= vw ? [bw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = yw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const ww = 1e3;
function kw() {
  const e = L(Date.now()), t = setInterval(() => e.value = Date.now(), ww);
  return ft(() => clearInterval(t)), e;
}
const xw = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = kw(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(P(rr)(e.at, P(n))), 9, xw));
  }
};
function z$(e) {
  const t = We(), n = t.option("row"), a = L(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function $w(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const U$ = (e) => (t) => t.filter((n) => n.id !== e), V$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), G$ = (e) => (t) => [...t, e], K$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function Y$(e, t = {}) {
  const n = We(), a = L(null), s = L("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function J$(e) {
  const t = We(), n = L("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const An = /* @__PURE__ */ new Map();
function Mw(e, t) {
  if (An.has(e)) return An.get(e);
  const n = t().finally(() => An.delete(e));
  return An.set(e, n), n;
}
function Z$() {
  const e = We(), t = L(null), n = L("");
  async function a() {
    const s = await Mw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Sw = { class: "cards-page" }, _w = { class: "cards-bar" }, Ew = { class: "cards-count" }, Aw = { class: "cards" }, Cw = {
  key: 1,
  class: "cards-note"
}, Ow = {
  key: 2,
  class: "cards-note"
}, Tw = ["data-row", "onClick"], Rw = { class: "card-head" }, Iw = { class: "card-title" }, Bw = { class: "card-foot" }, Lw = {
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
    return (a, s) => (u(), h("div", Sw, [
      y("div", _w, [
        y("span", Ew, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(de, Fe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            D(ye, {
              name: "plus",
              size: 12
            }),
            te(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      y("div", Aw, [
        e.loaded ? e.failure ? (u(), h("p", Cw, w(e.failure), 1)) : e.rows.length ? A("", !0) : (u(), h("p", Ow, "No " + w(e.noun) + "s yet", 1)) : (u(), z(_t, {
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
          y("span", Rw, [
            D(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + w(e.head(o)), 1),
            D(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          y("span", Iw, w(e.title(o)), 1),
          y("span", Bw, w(e.foot(o)), 1)
        ], 8, Tw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Q$ = /* @__PURE__ */ J(Lw, [["__scopeId", "data-v-990e6b37"]]), Go = "newest";
function X$(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Oe(Le, null)) == null ? void 0 : c.search, s = L(""), o = L(Go), l = L("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => $w(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Go ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Nw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Dw = 40, jw = "top", Pw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Le, null)) == null ? void 0 : f.autoScroll, s = I(() => a === jw), o = L(null), l = L(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Dw;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (u(), h("div", Nw, [
      y("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: q(() => [
          tt(y("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            D(ye, {
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
}, e8 = /* @__PURE__ */ J(Pw, [["__scopeId", "data-v-3accb764"]]), qw = ["aria-selected", "data-tab", "onClick"], Fw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Ww = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Le, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = L(null), r = L({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function c(m) {
      var v;
      const g = (v = l.value) == null ? void 0 : v.querySelector(".inner-tab.on");
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
      (u(!0), h(K, null, ee(o.value, (v) => {
        var k, $;
        return u(), h("button", {
          key: v.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((k = e.active) == null ? void 0 : k.key) === v.key }]),
          "aria-selected": (($ = e.active) == null ? void 0 : $.key) === v.key,
          "data-tab": v.key,
          onClick: (B) => a("choose", v)
        }, [
          te(w(v.label) + " ", 1),
          i(v) ? (u(), h("span", Fw, w(e.answer[v.count_field]), 1)) : A("", !0)
        ], 10, qw);
      }), 128)),
      y("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, t8 = /* @__PURE__ */ J(Ww, [["__scopeId", "data-v-63fcd326"]]), Hw = {
  class: "tab-body",
  "data-tab-body": ""
}, zw = { "data-tab-content": "" }, Uw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = L(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ms(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), h("div", Hw, [
      n.value ? (u(), z(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      tt(y("div", zw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [al, !n.value]
      ])
    ]));
  }
}, n8 = /* @__PURE__ */ J(Uw, [["__scopeId", "data-v-63876533"]]), Vw = {}, Gw = { class: "menu-label" };
function Kw(e, t) {
  return u(), h("span", Gw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const cs = /* @__PURE__ */ J(Vw, [["render", Kw], ["__scopeId", "data-v-aa955b3e"]]), Yw = {
  class: "search-bar",
  "data-search-bar": ""
}, Jw = { class: "search-bar-control" }, Zw = ["value", "placeholder", "aria-label"], Qw = ["aria-expanded"], Xw = {
  key: 0,
  "data-menu-count": ""
}, ek = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var B;
    const a = e, s = n, o = vi(), l = ((B = Oe(Le, null)) == null ? void 0 : B.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], c = L(null), d = L(null), f = L([]), m = I(() => f.value.length ? f.value[f.value.length - 1].next : i), g = I(() => !!o.menu || i.length > 0), v = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function k(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, s("pick", F.click);
    }
    function $() {
      var F;
      s("update:modelValue", ""), (F = c.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = c.value) == null ? void 0 : F.focus();
    } }), (F, H) => {
      var C;
      return u(), h("div", Yw, [
        y("div", Jw, [
          D(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          y("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: H[0] || (H[0] = (x) => s("update:modelValue", x.target.value)),
            onKeydown: Zt($, ["esc"])
          }, null, 40, Zw),
          e.modelValue ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: $
          }, [
            D(ye, {
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
            onClick: v
          }, [
            e.menuCount ? (u(), h("span", Xw, w(e.menuCount), 1)) : A("", !0),
            D(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Qw)) : A("", !0)
        ]),
        (C = P(l).button) != null && C.title ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (x) => s("pick", P(l).button.click))
        }, w(P(l).button.title), 1)) : A("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        d.value ? (u(), z(Qn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = xe(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (x) => d.value = null)
        }, {
          default: q(() => [
            f.value.length ? (u(), z(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (x) => f.value = f.value.slice(0, -1))
            }, {
              default: q(() => [
                te("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (u(!0), h(K, null, ee(m.value, (x) => (u(), z(Mt, {
              key: x.title,
              description: x.subtext,
              "data-search-entry": x.title,
              onClick: (T) => k(x)
            }, {
              default: q(() => [
                te(w(x.title) + w(x.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ue(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, tk = /* @__PURE__ */ J(ek, [["__scopeId", "data-v-45374bed"]]), nk = {
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
    return (o, l) => (u(), z(tk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: q(() => [
        D(cs, null, {
          default: q(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), h(K, null, ee(a, (r) => D(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: q(() => [
            te(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), h(K, { key: 0 }, [
          D(cs, null, {
            default: q(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), h(K, null, ee(s, (r) => D(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: q(() => [
              te(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: q(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, a8 = /* @__PURE__ */ J(nk, [["__scopeId", "data-v-dab0064d"]]);
function s8() {
  const e = L(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const o8 = (e) => import(
  /* @vite-ignore */
  e
), ak = 86400, us = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function sk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((us(t) - us(e)) / ak);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function l8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = us(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: sk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const La = 280, Na = 240, Da = 120, ok = 6, lk = 14, on = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function rk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function si(e, t) {
  const n = Math.max(0, rk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ik(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${lk}px)` }), e.offsetHeight, e.style.transition = `height ${La}ms ${on}`, e.style.height = `${l}px`;
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
function r8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${ok}px)` }), e.offsetHeight, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${on}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = si(t, e)), s() - l < Da) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const ck = 140, Cn = 220, Ko = 5;
function i8({ gap: e = ck, later: t = setTimeout } = {}) {
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
  const c = (d, f, m, g = ik) => {
    if (l || !f.pane || !f.follows()) return m();
    const v = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, r(v, () => o = t(i, e));
    d.style.display = "none", n.push(v), n.length >= Ko && c.flush();
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
function c8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Cn}ms ${on}, opacity ${Cn}ms ease-in, margin ${Cn}ms ${on}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Cn);
}
const oi = "chat.pins.minimised", Ln = L(Nn(oi, !1));
function Yo(e) {
  Ln.value = e, xs(oi, e);
}
function uk(e) {
  const t = I(() => e()), n = I(() => Ln.value ? [] : e()), a = () => Yo(!Ln.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Yo(!1)
  ), { pins: t, visible: n, minimised: Ln, toggle: a };
}
const dk = ["title"], fk = {
  key: 0,
  class: "pins-count"
}, hk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = uk(() => t.pinRows);
    return (o, l) => P(n).length ? (u(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      D(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (u(), h("span", fk, w(P(n).length), 1)) : A("", !0)
    ], 10, dk)) : A("", !0);
  }
}, u8 = /* @__PURE__ */ J(hk, [["__scopeId", "data-v-d073c504"]]), mk = ["title"], pk = ["title"], gk = { class: "diff-card-dir" }, vk = { class: "diff-card-name" }, yk = ["title"], bk = ["title"], wk = {
  key: 0,
  class: "diff-card-note"
}, kk = ["href"], xk = ["src", "alt"], $k = { class: "diff-card-rows" }, Mk = { class: "diff-row-num" }, Sk = { class: "diff-row-sign" }, _k = { class: "diff-row-code" }, Ek = {
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
    function o(N) {
      (N.metaKey || N.ctrlKey) && (N.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), c = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.change === "deleted"), m = I(() => l[n.change]), g = I(() => new Set(n.rows.filter((N) => N.line_type === "add").map((N) => N.line))), v = L("after"), k = I(() => v.value === "before" ? n.whole.old : n.whole.text), $ = I(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((N, _) => ({ line_type: v.value === "after" && g.value.has(_ + 1) ? "add" : "ctx", line: _ + 1, text: N })) : n.rows.filter(
      (N) => !(n.editsOnly && ["ctx", "fold"].includes(N.line_type)) && !(n.hideRemovals && N.line_type === "del")
    )), B = L(!1), F = I(() => n.lines && !B.value && !n.whole), H = I(() => F.value ? $.value.slice(0, n.lines) : $.value), C = I(() => $.value.length - H.value.length), x = (N) => N.line === null || N.line_type === "del" ? "" : N.line, T = (N) => N.line_type === "fold" ? N.hidden ? `⋯ ${N.hidden} lines` : "⋯" : N.text, b = L(null), R = L(null);
    let S = null;
    return Re(() => {
      if (!R.value) return;
      let N = !0;
      S = new ResizeObserver(() => {
        !b.value || !R.value || (b.value.style.transition = N ? "none" : "", b.value.style.height = `${R.value.offsetHeight}px`, N = !1);
      }), S.observe(R.value);
    }), Be(() => S && S.disconnect()), (N, _) => (u(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      y("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: _[2] || (_[2] = (p) => !f.value && a("fold"))
      }, [
        y("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          y("span", gk, w(c.value), 1),
          y("span", vk, w(d.value), 1),
          m.value ? (u(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : A("", !0)
        ], 8, pk),
        y("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        y("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        D(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: v.value === "after" ? "Show the file before" : "Show the file after",
          onClick: _[0] || (_[0] = xe((p) => v.value = v.value === "after" ? "before" : "after", ["stop"]))
        }, w(v.value === "after" ? "After" : "Before"), 9, yk)) : A("", !0),
        f.value ? A("", !0) : (u(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: _[1] || (_[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          D(ye, {
            name: "file",
            size: 12
          })
        ], 10, bk))
      ], 8, mk),
      e.whole && e.whole.error ? (u(), h("p", wk, w(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (u(), h(K, { key: 1 }, [
        e.picture ? (u(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          y("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, xk)
        ], 8, kk)) : (u(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: b,
          class: "diff-card-grow"
        }, [
          y("div", {
            ref_key: "body",
            ref: R,
            class: "diff-card-diff"
          }, [
            y("div", $k, [
              (u(!0), h(K, null, ee(H.value, (p, M) => (u(), h("div", {
                key: M,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                y("span", Mk, w(x(p)), 1),
                y("span", Sk, w(r[p.line_type]), 1),
                y("span", _k, w(T(p)), 1)
              ], 2))), 128)),
              C.value > 0 ? (u(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: _[3] || (_[3] = xe((p) => B.value = !0, ["stop"]))
              }, w(C.value) + " more " + w(C.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, d8 = /* @__PURE__ */ J(Ek, [["__scopeId", "data-v-23581cbb"]]), Ak = {
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
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => Kn(Am, { line: s.value.line, events: s.value.events }) }), l = L(null), r = I(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = I(
      () => {
        var m, g;
        return l.value ? ev(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
      var v, k;
      return !s.value && ((v = e.catalogue.loaded) == null ? void 0 : v.value) === !1 ? (u(), z(Es, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((k = s.value) == null ? void 0 : k.shows) === "one-agent" && e.agent === null ? (u(), z(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), z(Gt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), z(vr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = ($, B) => n("option", $, B))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), z(gr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = ($, B) => n("option", $, B))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), z(Gt, {
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
        onOption: g[2] || (g[2] = ($, B) => n("option", $, B))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), z(Gt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = ($) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ck = ["data-section"], Ok = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(_u, null), a = I(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = I(() => ({ row: t.row }));
    return (o, l) => (u(!0), h(K, null, ee(a.value, (r) => (u(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      D(Ak, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Ck))), 128));
  }
}, Tk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), z(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: q(() => [
        D(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Rk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Ik = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Bk = { class: "ask-text" }, Lk = ["placeholder", "aria-label"], Nk = ["placeholder", "aria-label"], Dk = {
  key: 3,
  class: "moves"
}, jk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => Xv(a.noun, a.row)), l = L(""), r = L(null), i = L(""), c = L("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, v = "") {
      const k = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, v] : g.positional ? [v] : [], ...g.opener && c.value.trim() ? ["--on", c.value.trim()] : []]);
      l.value = k.ok ? "" : k.error, k.ok && (r.value = null, i.value = "", c.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, v) => o.value.length ? (u(), z(ur, {
      key: 0,
      inline: e.inline
    }, {
      default: q(() => {
        var k;
        return [
          l.value ? (u(), h("p", Rk, w(l.value), 1)) : A("", !0),
          (k = r.value) != null && k.confirm ? (u(), h("div", Ik, [
            y("span", Bk, w(r.value.confirm), 1),
            D(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: v[0] || (v[0] = ($) => d(r.value))
            }, {
              default: q(() => [
                te(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            D(de, {
              small: "",
              variant: "ghost",
              onClick: v[1] || (v[1] = ($) => r.value = null)
            }, {
              default: q(() => [...v[7] || (v[7] = [
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
            tt(y("input", {
              "onUpdate:modelValue": v[2] || (v[2] = ($) => i.value = $),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: v[3] || (v[3] = Zt(xe(($) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Lk), [
              [Wa, i.value]
            ]),
            r.value.opener ? tt((u(), h("input", {
              key: 0,
              "onUpdate:modelValue": v[4] || (v[4] = ($) => c.value = $),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: v[5] || (v[5] = Zt(xe(($) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Nk)), [
              [Wa, c.value]
            ]) : A("", !0),
            D(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: q(() => [
                te(w(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            D(de, {
              small: "",
              variant: "ghost",
              onClick: v[6] || (v[6] = ($) => r.value = null)
            }, {
              default: q(() => [...v[8] || (v[8] = [
                te("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (u(), h("div", Dk, [
            (u(!0), h(K, null, ee(o.value, ($) => (u(), z(de, {
              key: $.word,
              small: !$.bordered,
              bordered: $.bordered,
              icon: $.icon,
              variant: $.main ? "primary" : "ghost",
              class: Z({ danger: $.danger }),
              "data-move": $.word,
              onClick: (B) => f($)
            }, {
              default: q(() => [
                te(w($.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : A("", !0);
  }
}, Pk = /* @__PURE__ */ J(jk, [["__scopeId", "data-v-bdac0207"]]), qk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Fk = (e) => qk.has(e), ln = (e) => Fk(e) ? "done" : e, Wk = { class: "facts" }, Hk = { class: "fact wide" }, zk = ["title"], Uk = {
  key: 1,
  class: "fact-value"
}, Vk = {
  key: 0,
  class: "fact"
}, Gk = { class: "fact-value" }, Kk = { class: "fact" }, Yk = { class: "fact-label" }, Jk = ["title"], Zk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Qk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Xk = {
  key: 2,
  class: "fact"
}, e2 = { class: "fact-value" }, t2 = { class: "fact wide" }, n2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, a2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Fn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return u(), h("div", Wk, [
        y("div", Hk, [
          l[3] || (l[3] = y("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (c) => P(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + w(e.place.plan_id) + ": " + w(e.place.plan_title), 9, zk)) : (u(), h("span", Uk, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (u(), h("div", Vk, [
          l[4] || (l[4] = y("span", { class: "fact-label" }, "Phase", -1)),
          y("span", Gk, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (u(), h(K, { key: 1 }, [
          y("div", Kk, [
            y("span", Yk, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            y("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (c) => P(qe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Jk)
          ]),
          P(s).has(e.task.state) ? (u(), h("p", Zk, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), h("p", Qk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), h("div", Xk, [
          l[5] || (l[5] = y("span", { class: "fact-label" }, "Assigned to", -1)),
          y("span", e2, "Agent " + w(e.task.holder_id), 1)
        ])) : A("", !0),
        y("div", t2, [
          l[6] || (l[6] = y("span", { class: "fact-label" }, "Priority", -1)),
          D(rn, {
            options: P(n),
            value: String(P(cr)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (c) => a("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), h("p", n2, w(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, s2 = /* @__PURE__ */ J(a2, [["__scopeId", "data-v-fa2fd03f"]]);
function o2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const l2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, r2 = { ...l2, done: "Completed" }, i2 = { class: "task-status-icon" }, c2 = ["width", "height", "aria-label"], u2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => kl("task", ln(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => r2[t.status] ?? wl("task", t.status));
    return (o, l) => (u(), h("span", i2, [
      D(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
          (u(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            D(jt, { value: a.value }, {
              blocked: q(() => [...l[0] || (l[0] = [
                y("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                y("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: q(() => [...l[1] || (l[1] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                y("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: q(() => [...l[2] || (l[2] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: q(() => [...l[3] || (l[3] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                y("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: q(() => [...l[4] || (l[4] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                y("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: q(() => [...l[5] || (l[5] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, c2))
        ]),
        _: 1
      })
    ]));
  }
}, Ps = /* @__PURE__ */ J(u2, [["__scopeId", "data-v-ae24a63f"]]), d2 = { class: "number" }, f2 = { class: "title" }, h2 = { class: "word" }, m2 = {
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
    return (a, s) => (u(), z(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: q(() => [
        D(Ps, { status: e.status }, null, 8, ["status"]),
        y("span", d2, w(e.number), 1),
        y("span", f2, w(e.title), 1),
        y("span", h2, w(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ja = /* @__PURE__ */ J(m2, [["__scopeId", "data-v-f6417ae8"]]), p2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, g2 = { class: "level" }, v2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = I(() => o2(n.task.id, n.graph)), l = I(() => s.value ? o.value.above : o.value.above.slice(-1)), r = I(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = I(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: ln(f.state), number: f.id, title: f.title, word: m ? "This task" : c(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (u(), h("section", p2, [
      m[5] || (m[5] = y("h4", null, "What waits on what", -1)),
      (u(!0), h(K, null, ee(l.value, (g) => (u(), h(K, {
        key: g.map((v) => v.id).join()
      }, [
        y("div", g2, [
          (u(!0), h(K, null, ee(g, (v) => (u(), z(ja, Fe({
            key: v.id,
            ref_for: !0
          }, d(v), {
            onSelect: m[0] || (m[0] = (k) => a("select", k))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = y("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      D(ja, yi(bi(d(e.task, !0))), null, 16),
      (u(!0), h(K, null, ee(r.value, (g) => (u(), h(K, {
        key: g.id
      }, [
        m[4] || (m[4] = y("div", { class: "waits" }, "↓ waits on", -1)),
        D(ja, Fe({ ref_for: !0 }, d(g), {
          onSelect: m[1] || (m[1] = (v) => a("select", v))
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
}, y2 = /* @__PURE__ */ J(v2, [["__scopeId", "data-v-db05c4b2"]]), b2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, w2 = ["datetime"], k2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), h("section", b2, [
      n[0] || (n[0] = y("h3", null, "Block history", -1)),
      (u(!0), h(K, null, ee(e.renewals, (a) => (u(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        y("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, w2),
        y("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, x2 = /* @__PURE__ */ J(k2, [["__scopeId", "data-v-b41f213b"]]), $2 = {
  class: "part",
  "data-resource-waits": ""
}, M2 = ["onClick"], S2 = { class: "wait-id" }, _2 = { class: "wait-title" }, E2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", $2, [
      y("h4", null, w(e.title), 1),
      (u(!0), h(K, null, ee(e.waits, (o) => (u(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        D(Ps, {
          status: P(ln)(o.state),
          size: 12
        }, null, 8, ["status"]),
        y("span", S2, w(o.id), 1),
        y("span", _2, w(o.title), 1)
      ], 8, M2))), 128))
    ]));
  }
}, Jo = /* @__PURE__ */ J(E2, [["__scopeId", "data-v-8fb2e251"]]), A2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, C2 = { class: "text" }, O2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, T2 = 180, R2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = L(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), h(K, null, [
      l.value.length ? (u(), z(Jo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), h("section", A2, [
        c[3] || (c[3] = y("h4", null, "How it was done", -1)),
        y("p", C2, w(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (u(), h("section", O2, [
        c[4] || (c[4] = y("h4", null, "The brief", -1)),
        y("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > T2 && !o.value ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0),
      r.value.length ? (u(), z(Jo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : A("", !0)
    ], 64));
  }
}, I2 = /* @__PURE__ */ J(R2, [["__scopeId", "data-v-4a3f1e79"]]), B2 = {
  class: "task-details",
  "data-task-details": ""
}, L2 = { class: "since" }, N2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, D2 = { class: "text" }, j2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, P2 = {
  key: 1,
  class: "note"
}, q2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, F2 = { class: "text" }, W2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), h("div", B2, [
        y("div", {
          class: Z(["state-line", P(ln)(e.task.state)])
        }, [
          y("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            D(Ps, {
              status: P(ln)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + w(a(e.task.state)), 1)
          ]),
          y("span", L2, [
            o[4] || (o[4] = te(" since ", -1)),
            D(la, {
              at: P(Ql)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), h("section", N2, [
          o[5] || (o[5] = y("span", { class: "label" }, "Blocked, waiting on", -1)),
          y("p", D2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), h("p", j2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (u(), h("p", P2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), h("section", q2, [
          o[6] || (o[6] = y("span", { class: "label" }, "Why it was cancelled", -1)),
          y("p", F2, w(e.task.reason), 1)
        ])) : A("", !0),
        e.graph ? (u(), z(y2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : A("", !0),
        D(s2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        D(I2, {
          task: e.task,
          onSelect: o[3] || (o[3] = (r) => n("select", r))
        }, null, 8, ["task"]),
        D(x2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, H2 = /* @__PURE__ */ J(W2, [["__scopeId", "data-v-7ce5b829"]]), z2 = 50, U2 = { messages: 25 }, V2 = (e) => U2[e] || z2, G2 = {
  class: "task-log",
  "aria-label": "Task log"
}, K2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Y2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, J2 = { class: "entries" }, Z2 = ["datetime"], Q2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, X2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = L([]), a = L(1), s = L(!0), o = L(!0), l = L("");
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
        String(V2("task_logs")),
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
    }), (c, d) => (u(), h("section", G2, [
      o.value ? (u(), z(_t, { key: 0 })) : l.value ? (u(), h(K, { key: 1 }, [
        y("p", K2, w(l.value), 1),
        D(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: q(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), h(K, { key: 2 }, [
        n.value.length ? A("", !0) : (u(), h("p", Y2, "No log entries yet.")),
        y("ol", J2, [
          (u(!0), h(K, null, ee(n.value, (f) => (u(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            y("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, Z2),
            y("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), h("nav", Q2, [
          D(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: q(() => [...d[4] || (d[4] = [
              te("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          y("span", null, "Page " + w(a.value), 1),
          D(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: q(() => [...d[5] || (d[5] = [
              te("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, e5 = /* @__PURE__ */ J(X2, [["__scopeId", "data-v-98b3a6b1"]]), t5 = { class: "comment-side-head" }, n5 = {
  key: 0,
  class: "comment-none"
}, a5 = { key: 0 }, s5 = {
  key: 1,
  class: "comment-none"
}, o5 = {
  class: "comment",
  "data-comment": ""
}, l5 = {
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
      y("header", t5, [
        n[2] || (n[2] = y("h3", null, "Comments", -1)),
        D(ks, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), h("p", n5, "No comments yet")) : A("", !0),
      (u(!0), h(K, null, ee(e.comments, (a) => (u(), h("section", {
        key: a.id
      }, [
        a.quote ? (u(), h("blockquote", a5, w(a.quote), 1)) : A("", !0),
        a.revision ? (u(), h("span", s5, "Revision " + w(a.revision), 1)) : A("", !0),
        y("p", o5, w(e.words(a)), 1)
      ]))), 128)),
      D(Zn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, r5 = /* @__PURE__ */ J(l5, [["__scopeId", "data-v-276284a3"]]);
var Xo;
/Mac|iPhone|iPad/.test(((Xo = navigator.userAgentData) == null ? void 0 : Xo.platform) || navigator.platform);
function i5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const c5 = ["placeholder"], u5 = { class: "actions" }, d5 = { class: "error" }, f5 = {
  key: 1,
  class: "card closed"
}, h5 = { class: "mark" }, m5 = { class: "prompt" }, p5 = {
  key: 0,
  class: "draft"
}, g5 = {
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
    const a = e, s = n, o = qa(e, "draft"), l = qa(e, "error"), r = L(!!l.value), i = L(!1), c = L(!1), d = L(null);
    async function f() {
      var v, k;
      r.value = !0, i.value = !1, await mt(), (k = ((v = d.value) == null ? void 0 : v.querySelector("input")) || d.value) == null || k.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const v = o.value.trim();
      if (!(!v || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(v), r.value = !1, i.value = !0;
        } catch (k) {
          o.value = v, l.value = k.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: f }), (v, k) => (u(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Zt(m, ["esc"])
      }, [
        ue(v.$slots, "who", {}, void 0, !0),
        tt(y("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": k[0] || (k[0] = ($) => o.value = $),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: k[1] || (k[1] = Zt(($) => P(i5)($, g), ["enter"]))
        }, null, 40, c5), [
          [Wa, o.value]
        ]),
        y("div", u5, [
          y("span", d5, w(l.value), 1),
          D(de, {
            small: "",
            onClick: m
          }, {
            default: q(() => [...k[3] || (k[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          D(de, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: q(() => [...k[4] || (k[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), h("div", f5, [
        y("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          y("span", h5, [
            D(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          y("span", m5, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), h("span", p5, "Draft kept")) : A("", !0)
        ]),
        e.count ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[2] || (k[2] = ($) => s("show"))
        }, [
          y("span", null, w(P(ru)(e.count, "comment")), 1),
          D(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, v5 = /* @__PURE__ */ J(g5, [["__scopeId", "data-v-b68baddd"]]);
function y5(e, t) {
  const n = L([]), a = L(!1), s = L(null), o = L(0), l = L(!1), r = L("");
  let i = 0, c = 0;
  const d = (v) => {
    if (typeof v.body == "string") return v.body;
    const { noun: k, id: $, title: B } = e(), F = `On ${k} ${$}, ${B}: `;
    return v.text.startsWith(F) ? v.text.slice(F.length) : v.text;
  };
  async function f(v = 1) {
    const { noun: k, id: $ } = e();
    if (!$) return;
    const B = ++c;
    l.value = !0, r.value = "";
    try {
      const F = await t([k, "comments", String($), "--page", String(v), "--page-size", "25"]);
      if (B !== c) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const H = F.value.rows ?? [], C = v === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(C.map((x) => [x.id, x])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      B === c && (r.value = F.message);
    } finally {
      B === c && (l.value = !1);
    }
  }
  async function m(v) {
    var x;
    const { noun: k, id: $ } = e(), B = `${k}:${$}`, F = { id: `sending-${++i}`, text: v };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const H = await t([k, "comment", String($), v]);
    if (B !== `${e().noun}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((T) => T.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await f();
    const C = (x = H.value) == null ? void 0 : x.id;
    C && !n.value.some((T) => T.id === C) && (n.value = [...n.value, { ...F, id: C }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const b5 = { class: "top" }, w5 = {
  class: "crumb",
  "data-task-crumb": ""
}, k5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, x5 = {
  key: 1,
  class: "body"
}, $5 = { class: "summary" }, M5 = { class: "stamp" }, S5 = {
  class: "title",
  "data-resource-title": ""
}, _5 = {
  class: "tabs",
  "data-task-tabs": ""
}, E5 = { class: "panels" }, A5 = {
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
    const a = e, s = n, o = L(null), l = L(null), r = L(null), i = L(""), c = L(""), d = L(null), f = L(null), m = L("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = y5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (x) => a.read(x)
    );
    let k = 0;
    const $ = I(() => {
      var x;
      return (x = l.value) != null && x.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function B() {
      const x = ++k, [T, b, R] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      x === k && (i.value = T.ok ? "" : T.error, o.value = T.ok ? T.value : null, l.value = b.ok ? b.value : null, r.value = R.ok ? R.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", B();
      },
      { immediate: !0 }
    ), fe(() => a.changes, B), fe(v.open, (x) => {
      x && (m.value = "comments");
    });
    async function F(x) {
      const T = o.value.priority;
      o.value.priority = Number(x);
      const b = await a.read(["task", "edit", String(a.id), "--priority", x]);
      if (c.value = b.ok ? "" : b.error, b.ok) return B();
      o.value.priority = T;
    }
    function H(x) {
      d.value = null, f.value.press(x);
    }
    const C = (x) => {
      var T;
      return ((T = f.value) == null ? void 0 : T.moves.length) && (d.value = x);
    };
    return t({ openStatus: C }), (x, T) => (u(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      y("div", b5, [
        e.backed ? (u(), z(Tk, {
          key: 0,
          onBack: T[0] || (T[0] = (b) => s("back"))
        })) : A("", !0),
        y("span", w5, w($.value), 1),
        T[10] || (T[10] = y("span", { class: "grow" }, null, -1)),
        e.stepped ? (u(), h(K, { key: 1 }, [
          D(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: T[1] || (T[1] = (b) => s("step", -1))
          }, {
            default: q(() => [
              D(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: T[2] || (T[2] = (b) => s("step", 1))
          }, {
            default: q(() => [
              D(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        D(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: T[3] || (T[3] = (b) => s("close"))
        }, {
          default: q(() => [
            D(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (u(), h("p", k5, w(i.value), 1)) : o.value ? (u(), h(K, { key: 2 }, [
        D(Pk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: B
        }, null, 8, ["id", "row", "read"]),
        y("header", $5, [
          y("div", M5, [
            te(" Task " + w(o.value.id) + " · updated ", 1),
            D(la, {
              at: P(Ql)(o.value)
            }, null, 8, ["at"])
          ]),
          y("h3", S5, w(o.value.title), 1)
        ]),
        y("div", _5, [
          D(rn, {
            options: g,
            value: m.value,
            onPick: T[4] || (T[4] = (b) => m.value = b)
          }, null, 8, ["value"])
        ]),
        y("div", E5, [
          D(jt, { value: m.value }, {
            details: q(() => [
              D(H2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: c.value,
                onStatus: C,
                onPriority: F,
                onSelect: T[5] || (T[5] = (b) => s("select", b))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              D(Ok, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              D(ou, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: T[6] || (T[6] = (b) => s("select", b))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: q(() => [
              D(r5, {
                below: "",
                comments: P(v).comments.value,
                words: P(v).words,
                more: !!P(v).nextPage.value,
                loading: P(v).loading.value,
                failure: P(v).failure.value,
                onMore: P(v).loadMore,
                onClose: T[7] || (T[7] = (b) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: q(() => [
              D(e5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(v5, {
          send: P(v).send,
          count: P(v).total.value,
          onShow: T[8] || (T[8] = (b) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (u(), h("div", x5, [
        D(_t)
      ])),
      d.value ? (u(), z(Qn, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: T[9] || (T[9] = (b) => d.value = null)
      }, {
        default: q(() => [
          D(cs, null, {
            default: q(() => [
              te("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (u(!0), h(K, null, ee(f.value.moves, (b) => (u(), z(Mt, {
            key: b.word,
            onClick: (R) => H(b)
          }, {
            default: q(() => [
              te(w(b.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, f8 = /* @__PURE__ */ J(A5, [["__scopeId", "data-v-93316116"]]);
function C5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Pa = { exports: {} }, Zo;
function O5() {
  return Zo || (Zo = 1, (function(e, t) {
    var n = (function() {
      var a = function(x, T) {
        var b = 236, R = 17, S = x, N = o[T], _ = null, p = 0, M = null, E = [], O = {}, j = function(U, V) {
          p = S * 4 + 17, _ = (function(W) {
            for (var G = new Array(W), Y = 0; Y < W; Y += 1) {
              G[Y] = new Array(W);
              for (var X = 0; X < W; X += 1)
                G[Y][X] = null;
            }
            return G;
          })(p), Q(0, 0), Q(p - 7, 0), Q(0, p - 7), he(), ie(), He(U, V), S >= 7 && Ae(U), M == null && (M = se(S, N, E)), ve(M, V);
        }, Q = function(U, V) {
          for (var W = -1; W <= 7; W += 1)
            if (!(U + W <= -1 || p <= U + W))
              for (var G = -1; G <= 7; G += 1)
                V + G <= -1 || p <= V + G || (0 <= W && W <= 6 && (G == 0 || G == 6) || 0 <= G && G <= 6 && (W == 0 || W == 6) || 2 <= W && W <= 4 && 2 <= G && G <= 4 ? _[U + W][V + G] = !0 : _[U + W][V + G] = !1);
        }, ne = function() {
          for (var U = 0, V = 0, W = 0; W < 8; W += 1) {
            j(!0, W);
            var G = r.getLostPoint(O);
            (W == 0 || U > G) && (U = G, V = W);
          }
          return V;
        }, ie = function() {
          for (var U = 8; U < p - 8; U += 1)
            _[U][6] == null && (_[U][6] = U % 2 == 0);
          for (var V = 8; V < p - 8; V += 1)
            _[6][V] == null && (_[6][V] = V % 2 == 0);
        }, he = function() {
          for (var U = r.getPatternPosition(S), V = 0; V < U.length; V += 1)
            for (var W = 0; W < U.length; W += 1) {
              var G = U[V], Y = U[W];
              if (_[G][Y] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var le = -2; le <= 2; le += 1)
                    X == -2 || X == 2 || le == -2 || le == 2 || X == 0 && le == 0 ? _[G + X][Y + le] = !0 : _[G + X][Y + le] = !1;
            }
        }, Ae = function(U) {
          for (var V = r.getBCHTypeNumber(S), W = 0; W < 18; W += 1) {
            var G = !U && (V >> W & 1) == 1;
            _[Math.floor(W / 3)][W % 3 + p - 8 - 3] = G;
          }
          for (var W = 0; W < 18; W += 1) {
            var G = !U && (V >> W & 1) == 1;
            _[W % 3 + p - 8 - 3][Math.floor(W / 3)] = G;
          }
        }, He = function(U, V) {
          for (var W = N << 3 | V, G = r.getBCHTypeInfo(W), Y = 0; Y < 15; Y += 1) {
            var X = !U && (G >> Y & 1) == 1;
            Y < 6 ? _[Y][8] = X : Y < 8 ? _[Y + 1][8] = X : _[p - 15 + Y][8] = X;
          }
          for (var Y = 0; Y < 15; Y += 1) {
            var X = !U && (G >> Y & 1) == 1;
            Y < 8 ? _[8][p - Y - 1] = X : Y < 9 ? _[8][15 - Y - 1 + 1] = X : _[8][15 - Y - 1] = X;
          }
          _[p - 8][8] = !U;
        }, ve = function(U, V) {
          for (var W = -1, G = p - 1, Y = 7, X = 0, le = r.getMaskFunction(V), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (_[G][oe - ke] == null) {
                  var Se = !1;
                  X < U.length && (Se = (U[X] >>> Y & 1) == 1);
                  var ce = le(G, oe - ke);
                  ce && (Se = !Se), _[G][oe - ke] = Se, Y -= 1, Y == -1 && (X += 1, Y = 7);
                }
              if (G += W, G < 0 || p <= G) {
                G -= W, W = -W;
                break;
              }
            }
        }, me = function(U, V) {
          for (var W = 0, G = 0, Y = 0, X = new Array(V.length), le = new Array(V.length), oe = 0; oe < V.length; oe += 1) {
            var ke = V[oe].dataCount, Se = V[oe].totalCount - ke;
            G = Math.max(G, ke), Y = Math.max(Y, Se), X[oe] = new Array(ke);
            for (var ce = 0; ce < X[oe].length; ce += 1)
              X[oe][ce] = 255 & U.getBuffer()[ce + W];
            W += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = c(X[oe], Ne.getLength() - 1), qs = De.mod(Ne);
            le[oe] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Fs = ce + qs.getLength() - le[oe].length;
              le[oe][ce] = Fs >= 0 ? qs.getAt(Fs) : 0;
            }
          }
          for (var Ws = 0, ce = 0; ce < V.length; ce += 1)
            Ws += V[ce].totalCount;
          for (var ra = new Array(Ws), gn = 0, ce = 0; ce < G; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < X[oe].length && (ra[gn] = X[oe][ce], gn += 1);
          for (var ce = 0; ce < Y; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < le[oe].length && (ra[gn] = le[oe][ce], gn += 1);
          return ra;
        }, se = function(U, V, W) {
          for (var G = d.getRSBlocks(U, V), Y = f(), X = 0; X < W.length; X += 1) {
            var le = W[X];
            Y.put(le.getMode(), 4), Y.put(le.getLength(), r.getLengthInBits(le.getMode(), U)), le.write(Y);
          }
          for (var oe = 0, X = 0; X < G.length; X += 1)
            oe += G[X].dataCount;
          if (Y.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + Y.getLengthInBits() + ">" + oe * 8 + ")";
          for (Y.getLengthInBits() + 4 <= oe * 8 && Y.put(0, 4); Y.getLengthInBits() % 8 != 0; )
            Y.putBit(!1);
          for (; !(Y.getLengthInBits() >= oe * 8 || (Y.put(b, 8), Y.getLengthInBits() >= oe * 8)); )
            Y.put(R, 8);
          return me(Y, G);
        };
        O.addData = function(U, V) {
          V = V || "Byte";
          var W = null;
          switch (V) {
            case "Numeric":
              W = m(U);
              break;
            case "Alphanumeric":
              W = g(U);
              break;
            case "Byte":
              W = v(U);
              break;
            case "Kanji":
              W = k(U);
              break;
            default:
              throw "mode:" + V;
          }
          E.push(W), M = null;
        }, O.isDark = function(U, V) {
          if (U < 0 || p <= U || V < 0 || p <= V)
            throw U + "," + V;
          return _[U][V];
        }, O.getModuleCount = function() {
          return p;
        }, O.make = function() {
          if (S < 1) {
            for (var U = 1; U < 40; U++) {
              for (var V = d.getRSBlocks(U, N), W = f(), G = 0; G < E.length; G++) {
                var Y = E[G];
                W.put(Y.getMode(), 4), W.put(Y.getLength(), r.getLengthInBits(Y.getMode(), U)), Y.write(W);
              }
              for (var X = 0, G = 0; G < V.length; G++)
                X += V[G].dataCount;
              if (W.getLengthInBits() <= X * 8)
                break;
            }
            S = U;
          }
          j(!1, ne());
        }, O.createTableTag = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var W = "";
          W += '<table style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: " + V + "px;", W += '">', W += "<tbody>";
          for (var G = 0; G < O.getModuleCount(); G += 1) {
            W += "<tr>";
            for (var Y = 0; Y < O.getModuleCount(); Y += 1)
              W += '<td style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: 0px;", W += " width: " + U + "px;", W += " height: " + U + "px;", W += " background-color: ", W += O.isDark(G, Y) ? "#000000" : "#ffffff", W += ";", W += '"/>';
            W += "</tr>";
          }
          return W += "</tbody>", W += "</table>", W;
        }, O.createSvgTag = function(U, V, W, G) {
          var Y = {};
          typeof arguments[0] == "object" && (Y = arguments[0], U = Y.cellSize, V = Y.margin, W = Y.alt, G = Y.title), U = U || 2, V = typeof V > "u" ? U * 4 : V, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-description" : null, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-title" : null;
          var X = O.getModuleCount() * U + V * 2, le, oe, ke, Se, ce = "", Ne;
          for (Ne = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += Y.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ce += ' viewBox="0 0 ' + X + " " + X + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += G.text || W.text ? ' role="img" aria-labelledby="' + Ye([G.id, W.id].join(" ").trim()) + '"' : "", ce += ">", ce += G.text ? '<title id="' + Ye(G.id) + '">' + Ye(G.text) + "</title>" : "", ce += W.text ? '<description id="' + Ye(W.id) + '">' + Ye(W.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < O.getModuleCount(); ke += 1)
            for (Se = ke * U + V, le = 0; le < O.getModuleCount(); le += 1)
              O.isDark(ke, le) && (oe = le * U + V, ce += "M" + oe + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, O.createDataURL = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var W = O.getModuleCount() * U + V * 2, G = V, Y = W - V;
          return C(W, W, function(X, le) {
            if (G <= X && X < Y && G <= le && le < Y) {
              var oe = Math.floor((X - G) / U), ke = Math.floor((le - G) / U);
              return O.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, O.createImgTag = function(U, V, W) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var G = O.getModuleCount() * U + V * 2, Y = "";
          return Y += "<img", Y += ' src="', Y += O.createDataURL(U, V), Y += '"', Y += ' width="', Y += G, Y += '"', Y += ' height="', Y += G, Y += '"', W && (Y += ' alt="', Y += Ye(W), Y += '"'), Y += "/>", Y;
        };
        var Ye = function(U) {
          for (var V = "", W = 0; W < U.length; W += 1) {
            var G = U.charAt(W);
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
          var W = O.getModuleCount() * V + U * 2, G = U, Y = W - U, X, le, oe, ke, Se, ce = {
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
          for (X = 0; X < W; X += 2) {
            for (oe = Math.floor((X - G) / V), ke = Math.floor((X + 1 - G) / V), le = 0; le < W; le += 1)
              Se = "█", G <= le && le < Y && G <= X && X < Y && O.isDark(oe, Math.floor((le - G) / V)) && (Se = " "), G <= le && le < Y && G <= X + 1 && X + 1 < Y && O.isDark(ke, Math.floor((le - G) / V)) ? Se += " " : Se += "█", De += U < 1 && X + 1 >= Y ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return W % 2 && U > 0 ? De.substring(0, De.length - W - 1) + Array(W + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return O.createASCII = function(U, V) {
          if (U = U || 1, U < 2)
            return li(V);
          U -= 1, V = typeof V > "u" ? U * 2 : V;
          var W = O.getModuleCount() * U + V * 2, G = V, Y = W - V, X, le, oe, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < W; X += 1) {
            for (oe = Math.floor((X - G) / U), De = "", le = 0; le < W; le += 1)
              ke = 1, G <= le && le < Y && G <= X && X < Y && O.isDark(oe, Math.floor((le - G) / U)) && (ke = 0), De += ke ? Se : ce;
            for (oe = 0; oe < U; oe += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, O.renderTo2dContext = function(U, V) {
          V = V || 2;
          for (var W = O.getModuleCount(), G = 0; G < W; G++)
            for (var Y = 0; Y < W; Y++)
              U.fillStyle = O.isDark(G, Y) ? "black" : "white", U.fillRect(G * V, Y * V, V, V);
        }, O;
      };
      a.stringToBytesFuncs = {
        default: function(x) {
          for (var T = [], b = 0; b < x.length; b += 1) {
            var R = x.charCodeAt(b);
            T.push(R & 255);
          }
          return T;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(x, T) {
        var b = (function() {
          for (var S = F(x), N = function() {
            var ie = S.read();
            if (ie == -1) throw "eof";
            return ie;
          }, _ = 0, p = {}; ; ) {
            var M = S.read();
            if (M == -1) break;
            var E = N(), O = N(), j = N(), Q = String.fromCharCode(M << 8 | E), ne = O << 8 | j;
            p[Q] = ne, _ += 1;
          }
          if (_ != T)
            throw _ + " != " + T;
          return p;
        })(), R = 63;
        return function(S) {
          for (var N = [], _ = 0; _ < S.length; _ += 1) {
            var p = S.charCodeAt(_);
            if (p < 128)
              N.push(p);
            else {
              var M = b[S.charAt(_)];
              typeof M == "number" ? (M & 255) == M ? N.push(M) : (N.push(M >>> 8), N.push(M & 255)) : N.push(R);
            }
          }
          return N;
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
        var x = [
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
        ], T = 1335, b = 7973, R = 21522, S = {}, N = function(_) {
          for (var p = 0; _ != 0; )
            p += 1, _ >>>= 1;
          return p;
        };
        return S.getBCHTypeInfo = function(_) {
          for (var p = _ << 10; N(p) - N(T) >= 0; )
            p ^= T << N(p) - N(T);
          return (_ << 10 | p) ^ R;
        }, S.getBCHTypeNumber = function(_) {
          for (var p = _ << 12; N(p) - N(b) >= 0; )
            p ^= b << N(p) - N(b);
          return _ << 12 | p;
        }, S.getPatternPosition = function(_) {
          return x[_ - 1];
        }, S.getMaskFunction = function(_) {
          switch (_) {
            case l.PATTERN000:
              return function(p, M) {
                return (p + M) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, M) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, M) {
                return M % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, M) {
                return (p + M) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, M) {
                return (Math.floor(p / 2) + Math.floor(M / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, M) {
                return p * M % 2 + p * M % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, M) {
                return (p * M % 2 + p * M % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, M) {
                return (p * M % 3 + (p + M) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + _;
          }
        }, S.getErrorCorrectPolynomial = function(_) {
          for (var p = c([1], 0), M = 0; M < _; M += 1)
            p = p.multiply(c([1, i.gexp(M)], 0));
          return p;
        }, S.getLengthInBits = function(_, p) {
          if (1 <= p && p < 10)
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
          else if (p < 27)
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
          else if (p < 41)
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
            throw "type:" + p;
        }, S.getLostPoint = function(_) {
          for (var p = _.getModuleCount(), M = 0, E = 0; E < p; E += 1)
            for (var O = 0; O < p; O += 1) {
              for (var j = 0, Q = _.isDark(E, O), ne = -1; ne <= 1; ne += 1)
                if (!(E + ne < 0 || p <= E + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    O + ie < 0 || p <= O + ie || ne == 0 && ie == 0 || Q == _.isDark(E + ne, O + ie) && (j += 1);
              j > 5 && (M += 3 + j - 5);
            }
          for (var E = 0; E < p - 1; E += 1)
            for (var O = 0; O < p - 1; O += 1) {
              var he = 0;
              _.isDark(E, O) && (he += 1), _.isDark(E + 1, O) && (he += 1), _.isDark(E, O + 1) && (he += 1), _.isDark(E + 1, O + 1) && (he += 1), (he == 0 || he == 4) && (M += 3);
            }
          for (var E = 0; E < p; E += 1)
            for (var O = 0; O < p - 6; O += 1)
              _.isDark(E, O) && !_.isDark(E, O + 1) && _.isDark(E, O + 2) && _.isDark(E, O + 3) && _.isDark(E, O + 4) && !_.isDark(E, O + 5) && _.isDark(E, O + 6) && (M += 40);
          for (var O = 0; O < p; O += 1)
            for (var E = 0; E < p - 6; E += 1)
              _.isDark(E, O) && !_.isDark(E + 1, O) && _.isDark(E + 2, O) && _.isDark(E + 3, O) && _.isDark(E + 4, O) && !_.isDark(E + 5, O) && _.isDark(E + 6, O) && (M += 40);
          for (var Ae = 0, O = 0; O < p; O += 1)
            for (var E = 0; E < p; E += 1)
              _.isDark(E, O) && (Ae += 1);
          var He = Math.abs(100 * Ae / p / p - 50) / 5;
          return M += He * 10, M;
        }, S;
      })(), i = (function() {
        for (var x = new Array(256), T = new Array(256), b = 0; b < 8; b += 1)
          x[b] = 1 << b;
        for (var b = 8; b < 256; b += 1)
          x[b] = x[b - 4] ^ x[b - 5] ^ x[b - 6] ^ x[b - 8];
        for (var b = 0; b < 255; b += 1)
          T[x[b]] = b;
        var R = {};
        return R.glog = function(S) {
          if (S < 1)
            throw "glog(" + S + ")";
          return T[S];
        }, R.gexp = function(S) {
          for (; S < 0; )
            S += 255;
          for (; S >= 256; )
            S -= 255;
          return x[S];
        }, R;
      })();
      function c(x, T) {
        if (typeof x.length > "u")
          throw x.length + "/" + T;
        var b = (function() {
          for (var S = 0; S < x.length && x[S] == 0; )
            S += 1;
          for (var N = new Array(x.length - S + T), _ = 0; _ < x.length - S; _ += 1)
            N[_] = x[_ + S];
          return N;
        })(), R = {};
        return R.getAt = function(S) {
          return b[S];
        }, R.getLength = function() {
          return b.length;
        }, R.multiply = function(S) {
          for (var N = new Array(R.getLength() + S.getLength() - 1), _ = 0; _ < R.getLength(); _ += 1)
            for (var p = 0; p < S.getLength(); p += 1)
              N[_ + p] ^= i.gexp(i.glog(R.getAt(_)) + i.glog(S.getAt(p)));
          return c(N, 0);
        }, R.mod = function(S) {
          if (R.getLength() - S.getLength() < 0)
            return R;
          for (var N = i.glog(R.getAt(0)) - i.glog(S.getAt(0)), _ = new Array(R.getLength()), p = 0; p < R.getLength(); p += 1)
            _[p] = R.getAt(p);
          for (var p = 0; p < S.getLength(); p += 1)
            _[p] ^= i.gexp(i.glog(S.getAt(p)) + N);
          return c(_, 0).mod(S);
        }, R;
      }
      var d = (function() {
        var x = [
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
        ], T = function(S, N) {
          var _ = {};
          return _.totalCount = S, _.dataCount = N, _;
        }, b = {}, R = function(S, N) {
          switch (N) {
            case o.L:
              return x[(S - 1) * 4 + 0];
            case o.M:
              return x[(S - 1) * 4 + 1];
            case o.Q:
              return x[(S - 1) * 4 + 2];
            case o.H:
              return x[(S - 1) * 4 + 3];
            default:
              return;
          }
        };
        return b.getRSBlocks = function(S, N) {
          var _ = R(S, N);
          if (typeof _ > "u")
            throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + N;
          for (var p = _.length / 3, M = [], E = 0; E < p; E += 1)
            for (var O = _[E * 3 + 0], j = _[E * 3 + 1], Q = _[E * 3 + 2], ne = 0; ne < O; ne += 1)
              M.push(T(j, Q));
          return M;
        }, b;
      })(), f = function() {
        var x = [], T = 0, b = {};
        return b.getBuffer = function() {
          return x;
        }, b.getAt = function(R) {
          var S = Math.floor(R / 8);
          return (x[S] >>> 7 - R % 8 & 1) == 1;
        }, b.put = function(R, S) {
          for (var N = 0; N < S; N += 1)
            b.putBit((R >>> S - N - 1 & 1) == 1);
        }, b.getLengthInBits = function() {
          return T;
        }, b.putBit = function(R) {
          var S = Math.floor(T / 8);
          x.length <= S && x.push(0), R && (x[S] |= 128 >>> T % 8), T += 1;
        }, b;
      }, m = function(x) {
        var T = s.MODE_NUMBER, b = x, R = {};
        R.getMode = function() {
          return T;
        }, R.getLength = function(_) {
          return b.length;
        }, R.write = function(_) {
          for (var p = b, M = 0; M + 2 < p.length; )
            _.put(S(p.substring(M, M + 3)), 10), M += 3;
          M < p.length && (p.length - M == 1 ? _.put(S(p.substring(M, M + 1)), 4) : p.length - M == 2 && _.put(S(p.substring(M, M + 2)), 7));
        };
        var S = function(_) {
          for (var p = 0, M = 0; M < _.length; M += 1)
            p = p * 10 + N(_.charAt(M));
          return p;
        }, N = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          throw "illegal char :" + _;
        };
        return R;
      }, g = function(x) {
        var T = s.MODE_ALPHA_NUM, b = x, R = {};
        R.getMode = function() {
          return T;
        }, R.getLength = function(N) {
          return b.length;
        }, R.write = function(N) {
          for (var _ = b, p = 0; p + 1 < _.length; )
            N.put(
              S(_.charAt(p)) * 45 + S(_.charAt(p + 1)),
              11
            ), p += 2;
          p < _.length && N.put(S(_.charAt(p)), 6);
        };
        var S = function(N) {
          if ("0" <= N && N <= "9")
            return N.charCodeAt(0) - 48;
          if ("A" <= N && N <= "Z")
            return N.charCodeAt(0) - 65 + 10;
          switch (N) {
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
              throw "illegal char :" + N;
          }
        };
        return R;
      }, v = function(x) {
        var T = s.MODE_8BIT_BYTE, b = a.stringToBytes(x), R = {};
        return R.getMode = function() {
          return T;
        }, R.getLength = function(S) {
          return b.length;
        }, R.write = function(S) {
          for (var N = 0; N < b.length; N += 1)
            S.put(b[N], 8);
        }, R;
      }, k = function(x) {
        var T = s.MODE_KANJI, b = a.stringToBytesFuncs.SJIS;
        if (!b)
          throw "sjis not supported.";
        (function(N, _) {
          var p = b(N);
          if (p.length != 2 || (p[0] << 8 | p[1]) != _)
            throw "sjis not supported.";
        })("友", 38726);
        var R = b(x), S = {};
        return S.getMode = function() {
          return T;
        }, S.getLength = function(N) {
          return ~~(R.length / 2);
        }, S.write = function(N) {
          for (var _ = R, p = 0; p + 1 < _.length; ) {
            var M = (255 & _[p]) << 8 | 255 & _[p + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), N.put(M, 13), p += 2;
          }
          if (p < _.length)
            throw "illegal char at " + (p + 1);
        }, S;
      }, $ = function() {
        var x = [], T = {};
        return T.writeByte = function(b) {
          x.push(b & 255);
        }, T.writeShort = function(b) {
          T.writeByte(b), T.writeByte(b >>> 8);
        }, T.writeBytes = function(b, R, S) {
          R = R || 0, S = S || b.length;
          for (var N = 0; N < S; N += 1)
            T.writeByte(b[N + R]);
        }, T.writeString = function(b) {
          for (var R = 0; R < b.length; R += 1)
            T.writeByte(b.charCodeAt(R));
        }, T.toByteArray = function() {
          return x;
        }, T.toString = function() {
          var b = "";
          b += "[";
          for (var R = 0; R < x.length; R += 1)
            R > 0 && (b += ","), b += x[R];
          return b += "]", b;
        }, T;
      }, B = function() {
        var x = 0, T = 0, b = 0, R = "", S = {}, N = function(p) {
          R += String.fromCharCode(_(p & 63));
        }, _ = function(p) {
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
        return S.writeByte = function(p) {
          for (x = x << 8 | p & 255, T += 8, b += 1; T >= 6; )
            N(x >>> T - 6), T -= 6;
        }, S.flush = function() {
          if (T > 0 && (N(x << 6 - T), x = 0, T = 0), b % 3 != 0)
            for (var p = 3 - b % 3, M = 0; M < p; M += 1)
              R += "=";
        }, S.toString = function() {
          return R;
        }, S;
      }, F = function(x) {
        var T = x, b = 0, R = 0, S = 0, N = {};
        N.read = function() {
          for (; S < 8; ) {
            if (b >= T.length) {
              if (S == 0)
                return -1;
              throw "unexpected end of file./" + S;
            }
            var p = T.charAt(b);
            if (b += 1, p == "=")
              return S = 0, -1;
            if (p.match(/^\s$/))
              continue;
            R = R << 6 | _(p.charCodeAt(0)), S += 6;
          }
          var M = R >>> S - 8 & 255;
          return S -= 8, M;
        };
        var _ = function(p) {
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
        return N;
      }, H = function(x, T) {
        var b = x, R = T, S = new Array(x * T), N = {};
        N.setPixel = function(E, O, j) {
          S[O * b + E] = j;
        }, N.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(b), E.writeShort(R), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(b), E.writeShort(R), E.writeByte(0);
          var O = 2, j = p(O);
          E.writeByte(O);
          for (var Q = 0; j.length - Q > 255; )
            E.writeByte(255), E.writeBytes(j, Q, 255), Q += 255;
          E.writeByte(j.length - Q), E.writeBytes(j, Q, j.length - Q), E.writeByte(0), E.writeString(";");
        };
        var _ = function(E) {
          var O = E, j = 0, Q = 0, ne = {};
          return ne.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; j + he >= 8; )
              O.writeByte(255 & (ie << j | Q)), he -= 8 - j, ie >>>= 8 - j, Q = 0, j = 0;
            Q = ie << j | Q, j = j + he;
          }, ne.flush = function() {
            j > 0 && O.writeByte(Q);
          }, ne;
        }, p = function(E) {
          for (var O = 1 << E, j = (1 << E) + 1, Q = E + 1, ne = M(), ie = 0; ie < O; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(O)), ne.add(String.fromCharCode(j));
          var he = $(), Ae = _(he);
          Ae.write(O, Q);
          var He = 0, ve = String.fromCharCode(S[He]);
          for (He += 1; He < S.length; ) {
            var me = String.fromCharCode(S[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), Q), ne.size() < 4095 && (ne.size() == 1 << Q && (Q += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), Q), Ae.write(j, Q), Ae.flush(), he.toByteArray();
        }, M = function() {
          var E = {}, O = 0, j = {};
          return j.add = function(Q) {
            if (j.contains(Q))
              throw "dup key:" + Q;
            E[Q] = O, O += 1;
          }, j.size = function() {
            return O;
          }, j.indexOf = function(Q) {
            return E[Q];
          }, j.contains = function(Q) {
            return typeof E[Q] < "u";
          }, j;
        };
        return N;
      }, C = function(x, T, b) {
        for (var R = H(x, T), S = 0; S < T; S += 1)
          for (var N = 0; N < x; N += 1)
            R.setPixel(N, S, b(N, S));
        var _ = $();
        R.write(_);
        for (var p = B(), M = _.toByteArray(), E = 0; E < M.length; E += 1)
          p.writeByte(M[E]);
        return p.flush(), "data:image/gif;base64," + p;
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
var T5 = O5();
const R5 = /* @__PURE__ */ C5(T5), I5 = ["width", "height", "viewBox"], B5 = ["width", "height"], L5 = ["d"], N5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = R5(0, "M");
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
      y("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, B5),
      y("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, L5)
    ], 8, I5));
  }
}, h8 = /* @__PURE__ */ J(N5, [["__scopeId", "data-v-489f0852"]]), D5 = {
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
}, m8 = /* @__PURE__ */ J(D5, [["__scopeId", "data-v-47e67f04"]]);
function p8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const g8 = wi(() => import("./VoiceFigure-BuRJADnf.js").then((e) => e.V)), v8 = "1.2.0", y8 = "3.5";
export {
  Bd as $,
  _e as A,
  Ce as B,
  na as C,
  at as D,
  $$ as E,
  Bb as F,
  hx as G,
  b$ as H,
  mb as I,
  Fb as J,
  At as K,
  F5 as L,
  Is as M,
  Gb as N,
  qb as O,
  ta as P,
  Px as Q,
  V4 as R,
  Bn as S,
  zx as T,
  j4 as U,
  Ee as V,
  Hn as W,
  D4 as X,
  N4 as Y,
  Id as Z,
  J as _,
  A4 as a,
  r$ as a$,
  Ub as a0,
  G4 as a1,
  K4 as a2,
  Le as a3,
  ox as a4,
  sx as a5,
  St as a6,
  Y4 as a7,
  vx as a8,
  v4 as a9,
  Xx as aA,
  Nx as aB,
  ab as aC,
  kx as aD,
  xx as aE,
  M$ as aF,
  Wr as aG,
  Hx as aH,
  fn as aI,
  $4 as aJ,
  w4 as aK,
  h$ as aL,
  hn as aM,
  v$ as aN,
  fx as aO,
  Dx as aP,
  jx as aQ,
  Lx as aR,
  nn as aS,
  xt as aT,
  y4 as aU,
  G0 as aV,
  Ix as aW,
  z4 as aX,
  qr as aY,
  Nt as aZ,
  qt as a_,
  i$ as aa,
  p$ as ab,
  _4 as ac,
  P4 as ad,
  q4 as ae,
  nx as af,
  ax as ag,
  lx as ah,
  R4 as ai,
  Ho as aj,
  J4 as ak,
  gx as al,
  A$ as am,
  Cx as an,
  Ex as ao,
  _x as ap,
  rx as aq,
  ex as ar,
  X4 as as,
  tx as at,
  Wx as au,
  px as av,
  yx as aw,
  T$ as ax,
  Kt as ay,
  bx as az,
  sw as b,
  O$ as b$,
  Ob as b0,
  g$ as b1,
  Gx as b2,
  Vx as b3,
  vy as b4,
  Er as b5,
  s$ as b6,
  mx as b7,
  oa as b8,
  rt as b9,
  Yx as bA,
  t$ as bB,
  ut as bC,
  Ux as bD,
  n$ as bE,
  wx as bF,
  Ox as bG,
  $x as bH,
  Te as bI,
  dx as bJ,
  a$ as bK,
  P$ as bL,
  q$ as bM,
  p4 as bN,
  J0 as bO,
  cx as bP,
  Jx as bQ,
  C4 as bR,
  E$ as bS,
  Kx as bT,
  Zx as bU,
  Qx as bV,
  ix as bW,
  sb as bX,
  ux as bY,
  Sx as bZ,
  _$ as b_,
  e$ as ba,
  _a as bb,
  Zl as bc,
  I$ as bd,
  N$ as be,
  Fx as bf,
  f$ as bg,
  g4 as bh,
  Ax as bi,
  B$ as bj,
  Z4 as bk,
  Q4 as bl,
  B4 as bm,
  U4 as bn,
  x4 as bo,
  u$ as bp,
  O4 as bq,
  T4 as br,
  L4 as bs,
  Rx as bt,
  W0 as bu,
  y$ as bv,
  Pb as bw,
  I4 as bx,
  M4 as by,
  Tx as bz,
  gy as c,
  rn as c$,
  k4 as c0,
  b4 as c1,
  Mx as c2,
  D$ as c3,
  js as c4,
  j$ as c5,
  ai as c6,
  d$ as c7,
  W4 as c8,
  F4 as c9,
  ye as cA,
  t8 as cB,
  J5 as cC,
  v8 as cD,
  y8 as cE,
  s4 as cF,
  a8 as cG,
  ts as cH,
  u4 as cI,
  Ev as cJ,
  Mt as cK,
  cs as cL,
  Qn as cM,
  X5 as cN,
  o4 as cO,
  jc as cP,
  zg as cQ,
  u8 as cR,
  t4 as cS,
  h8 as cT,
  nr as cU,
  ou as cV,
  Q$ as cW,
  Gd as cX,
  V5 as cY,
  f4 as cZ,
  tk as c_,
  V0 as ca,
  S4 as cb,
  Db as cc,
  Bx as cd,
  Os as ce,
  Qy as cf,
  qx as cg,
  Yt as ch,
  Lt as ci,
  Z5 as cj,
  e8 as ck,
  de as cl,
  vd as cm,
  Md as cn,
  ks as co,
  Sm as cp,
  Ol as cq,
  d8 as cr,
  m4 as cs,
  Am as ct,
  Kp as cu,
  Qt as cv,
  F$ as cw,
  P5 as cx,
  $t as cy,
  Gu as cz,
  Ue as d,
  z$ as d$,
  l4 as d0,
  _t as d1,
  pt as d2,
  xp as d3,
  hu as d4,
  i4 as d5,
  G5 as d6,
  jt as d7,
  n8 as d8,
  f8 as d9,
  gh as dA,
  W$ as dB,
  z5 as dC,
  o8 as dD,
  kv as dE,
  $w as dF,
  K5 as dG,
  a4 as dH,
  V$ as dI,
  K$ as dJ,
  qe as dK,
  Q5 as dL,
  e4 as dM,
  qc as dN,
  U$ as dO,
  Vi as dP,
  U5 as dQ,
  H5 as dR,
  wl as dS,
  kl as dT,
  Mu as dU,
  Y5 as dV,
  ct as dW,
  p8 as dX,
  Mw as dY,
  q5 as dZ,
  W5 as d_,
  Ps as da,
  Yu as db,
  kt as dc,
  r4 as dd,
  la as de,
  g8 as df,
  m8 as dg,
  Es as dh,
  G$ as di,
  ms as dj,
  N1 as dk,
  wo as dl,
  rr as dm,
  xu as dn,
  i8 as dp,
  r8 as dq,
  vs as dr,
  ku as ds,
  hl as dt,
  n4 as du,
  c8 as dv,
  h4 as dw,
  d4 as dx,
  c4 as dy,
  H$ as dz,
  H4 as e,
  X$ as e0,
  kw as e1,
  s8 as e2,
  Cg as e3,
  gl as e4,
  uk as e5,
  ps as e6,
  Y$ as e7,
  Ha as e8,
  J$ as e9,
  Z$ as ea,
  We as eb,
  l8 as ec,
  $u as ed,
  F0 as f,
  R$ as g,
  an as h,
  w$ as i,
  L$ as j,
  k$ as k,
  c$ as l,
  cw as m,
  Bs as n,
  m$ as o,
  E4 as p,
  x$ as q,
  ti as r,
  ni as s,
  Me as t,
  by as u,
  o$ as v,
  C$ as w,
  l$ as x,
  pn as y,
  S$ as z
};
