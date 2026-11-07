/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ve, unref as N, renderSlot as me, createElementVNode as g, normalizeClass as J, Fragment as W, renderList as te, defineComponent as Ri, Comment as Ii, h as aa, cloneVNode as Bi, createBlock as H, withCtx as D, createVNode as B, toDisplayString as y, createCommentVNode as S, ref as A, onMounted as Te, onBeforeUnmount as Xe, reactive as Ht, shallowRef as Ye, watch as pe, onUnmounted as Le, inject as Oe, useAttrs as sa, computed as I, resolveDynamicComponent as gt, mergeProps as Ne, useId as ws, resolveDirective as Li, withDirectives as De, createTextVNode as ee, Teleport as oa, nextTick as Qe, Transition as Ut, withModifiers as xe, createApp as Ni, onScopeDispose as la, useModel as sn, mergeModels as qt, withKeys as jt, vModelText as _t, resolveComponent as Di, shallowReactive as qi, provide as gl, onErrorCaptured as ji, TransitionGroup as vl, isRef as eo, getCurrentInstance as Pi, getCurrentScope as yl, toHandlers as Fi, createSlots as Wi, vShow as bl, useSlots as Hi, normalizeProps as Ui, guardReactiveProps as zi, defineAsyncComponent as Vi } from "vue";
function kl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const V = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Gi = 1600, Ki = {
  __name: "Shimmer",
  setup(e) {
    const t = kl(Gi);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ve(N(t))
    }, null, 4));
  }
}, Zt = /* @__PURE__ */ V(Ki, [["__scopeId", "data-v-6c018b03"]]), Yi = { class: "skeleton-line" }, Ji = 2e3, Xi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = kl(Ji);
    return (n, a) => (u(), f("span", Yi, [
      me(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(W, null, te(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: ve({ ...N(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, vt = /* @__PURE__ */ V(Xi, [["__scopeId", "data-v-484fe8a0"]]), zt = Ri({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Ii);
      return a.length !== 1 ? aa(W, { key: n }, a) : a[0].key == null ? Bi(a[0], { key: n }) : a[0];
    };
  }
}), Qi = ["aria-label"], Zi = ["aria-label"], eu = ["aria-label"], tu = ["aria-label"], nu = ["aria-label"], au = ["aria-label"], su = ["aria-label"], ou = {
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
    return (i, c) => (u(), H(zt, { value: e.shape }, {
      messages: D(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(W, null, te(t, (d) => B(Zt, {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Qi)
      ]),
      older: D(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(W, null, te(t.slice(0, 3), (d) => (u(), H(Zt, {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Zi)
      ]),
      cards: D(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(W, null, te(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(W, null, te(n, (h) => B(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, eu)
      ]),
      file: D(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(W, null, te(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            B(vt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(W, null, te(s, (h) => B(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, tu)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          B(vt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), f(W, null, te(e.count, (d) => (u(), H(vt, {
            key: d,
            bars: N(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, nu)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(W, null, te(e.count, (d) => (u(), H(vt, {
            key: d,
            bars: N(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, au)
      ]),
      default: D(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(W, null, te(e.count, (d) => (u(), H(vt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, su)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, lt = /* @__PURE__ */ V(ou, [["__scopeId", "data-v-ef519c5f"]]), lu = {
  key: 1,
  class: "empty-state titled"
}, ru = { class: "empty-state-title" }, iu = { class: "empty-state-text" }, uu = {
  key: 2,
  class: "empty-state"
}, cu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), H(lt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", lu, [
      g("p", ru, y(e.title), 1),
      g("p", iu, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", uu, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, on = /* @__PURE__ */ V(cu, [["__scopeId", "data-v-b27e89b0"]]), du = { class: "fold-group" }, fu = ["aria-expanded"], hu = { class: "fold-label" }, mu = {
  key: 0,
  class: "fold-count"
}, pu = {
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
    return (a, s) => (u(), f("div", du, [
      g("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", hu, y(e.label), 1),
        e.count !== "" ? (u(), f("span", mu, y(e.count), 1)) : S("", !0),
        g("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, fu),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : S("", !0)
    ]));
  }
}, zx = /* @__PURE__ */ V(pu, [["__scopeId", "data-v-9ef1865c"]]), gu = 150, vu = () => gu;
function $s(e, t, n = vu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function yu(e, t, n) {
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
const bu = 50, to = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Vx(e) {
  const t = Ue().sources.find((n) => n.key === e);
  return t ? Qa(t.read, t.events) : Qa("", []);
}
function wl(e, t, n, a, s = () => !1) {
  const o = A([]), l = A(null), r = A(""), i = A(!1), c = performance.now(), d = A(!1), h = A(""), m = A(null), v = /* @__PURE__ */ new Set();
  let b = null;
  function x(p) {
    return s() ? (v.add(p), b ?? (b = new Promise((M) => setTimeout(() => M(E()), bu)))) : _(p);
  }
  async function E() {
    const p = new Set(v);
    v.clear(), b = null;
    const M = j, C = await t({ ids: [...p].join(","), limit: p.size });
    if (M !== j) return;
    if (!C.ok) return T();
    const R = new Map(C.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => p.has(F.id) ? R.has(F.id) ? [R.get(F.id)] : [] : [F]);
  }
  async function _(p) {
    const M = j, C = await t({ "before-id": p + 1, limit: 1 });
    if (M !== j) return;
    if (!C.ok) return T();
    const R = C.value.rows.find((F) => F.id === p);
    o.value = R ? o.value.map((F) => F.id === p ? R : F) : o.value.filter((F) => F.id !== p);
  }
  async function q(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((se) => se.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((se) => se.id === p.row_id)) return x(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return T();
    const C = Math.max(...o.value.map((se) => se.id)), R = j, F = await t({ "after-id": C });
    if (R !== j) return;
    if (!F.ok) return T();
    const Q = new Set(o.value.map((se) => se.id));
    o.value = [...F.value.rows.filter((se) => !Q.has(se.id)), ...o.value];
  }
  async function U() {
    if (!d.value || !o.value.length) return !1;
    const p = j, M = Math.min(...o.value.map((F) => F.id)), C = await t({ "before-id": M });
    if (p !== j) return !1;
    if (!C.ok || !C.value.rows.length) return d.value = !1;
    d.value = to(C.value, n());
    const R = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...C.value.rows.filter((F) => !R.has(F.id))], !0;
  }
  let j = 0;
  function L(p, M) {
    var F, Q;
    const C = p.ok ? e.shared ? [p.value] : ((F = p.value) == null ? void 0 : F.rows) ?? [] : [];
    p.ok && (o.value = M(C)), l.value = p.ok ? p.value : null;
    const R = C.length ? Math.min(...C.map((se) => se.id)) : 0;
    p.ok && ((Q = p.value) != null && Q.rows) && !o.value.some((se) => se.id < R) && (d.value = !e.shared && to(p.value, n())), r.value = p.ok ? "" : p.error, $s(c, () => i.value = !0);
  }
  async function P(p) {
    const M = ++j, C = await t({});
    M === j && L(C, p);
  }
  const O = (p) => {
    if (!a() || !p.length) return p;
    const M = Math.min(...p.map((R) => R.id)), C = Math.max(...p.map((R) => R.id));
    return [...o.value.filter((R) => R.id > C), ...p, ...o.value.filter((R) => R.id < M)];
  }, T = () => P(O), $ = (p) => L(p, O), k = () => P((p) => p);
  async function w(p, M = null) {
    const C = await yu(M && { target: o, fields: { value: M(o.value) } }, p, e.run);
    return h.value = C.ok ? "" : C.error, m.value = C.ok ? C.value : null, await T(), C;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: T, loadLatest: k, older: U, act: w, actionFailure: h, answer: m, context: e, heard: q, showFirst: $ };
}
const ku = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Qa(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = Ue(), l = wl(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${ku(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const wu = 2e3;
function xs(e, t, n = wu) {
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
  Te(async () => {
    document.addEventListener("visibilitychange", c), await l(e), i();
  }), Xe(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const $l = typeof document < "u" && document.documentElement.classList.contains("phone"), xl = 120;
var ml;
const ya = globalThis[ml = Symbol.for("journal.pressed")] ?? (globalThis[ml] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function $u(e = 0) {
  const t = ya.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ya.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ya.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function Za(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Sl(e = window) {
  if (!Za(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Za(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const es = "journal.stale-build-reload", xu = 'script[type="module"][src*="/assets/index-"]', no = (e) => {
  var t;
  return ((t = e.querySelector(xu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Su(e = document, t = (a, s) => Me.quietRead(a, s), n = () => Sl(window)) {
  const a = no(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = no(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ba = "";
function Mu(e, t = () => Sl(window)) {
  if (!e) return !1;
  const n = !!ba && ba !== e;
  return ba = e, n && t(), n;
}
const _u = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Cu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(es) === e.message) return !1;
    t.setItem(es, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Eu(e = window.sessionStorage) {
  try {
    e.removeItem(es);
  } catch {
    return;
  }
}
const Au = 2e3, Ou = 3e4, ze = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), Ss = () => ze.starting, Tu = 3;
let Sn = 0, ts = 0, Ml = 0, _l = [];
async function Ru() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let ao = null;
const Iu = () => ao ?? (ao = Ru().finally(() => ao = null));
function Bu() {
  clearTimeout(ts), clearTimeout(Ml), ts = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), _l.splice(0).forEach((e) => e()), Su();
}
async function Lu() {
  ze.offline = !navigator.onLine;
  const e = await Iu();
  if (ze.external = e.updating, Sn = !e.restarting && !e.updating && e.reachable ? Sn + 1 : 0, Sn < Tu) return;
  Sn = 0, (!Mu(e.started_at) || Za()) && Bu();
}
function Cl() {
  ts = setTimeout(async () => {
    await Lu(), ze.starting && Cl();
  }, Au);
}
function Nu() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Cl(), Ml = setTimeout(() => ze.late = !0, Ou));
}
const El = () => ze.starting ? new Promise((e) => _l.push(e)) : Promise.resolve();
function Ms(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const r = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, i = () => {
    s = null;
    const d = e();
    a = Date.now(), d instanceof Promise && (o = !0, d.catch(() => {
    }).finally(r));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const d = t - (Date.now() - a);
    d <= 0 ? i() : s = setTimeout(i, d);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function Du(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class qu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Ms(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Du(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const it = "viewer.shell", Mn = 2e4, ju = 4, so = "/api/read-lines", Pu = 5e3, Fu = 403, oo = "/api/repeated-lines", Wu = 10, Hu = 2e3, Uu = 3e5, Gx = 6e5, _n = 6, zu = 500, Vu = "/journal/summary", lo = "/api/server-state", Gu = 2e4, Cn = $l ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ku = (e) => e.split("?")[0].endsWith(Vu), ns = (e, t) => Object.assign(new Error(t), { status: e });
async function Yu(e, t, n = ns) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Ju = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Xu = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), ro = (e) => e.split(" ").slice(0, 2).join(" "), tt = "read", It = "write", Qu = "stream";
class Zu {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = _n;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = ro(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < Hu));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Wu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(oo, { method: "POST", headers: { ...Cn, "Content-Type": "application/json" }, body: r }, [{ window: it, line: oo, kind: It }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = $u(n ? xl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Xu(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === It ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = Mn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Nu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= ju ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(so, { headers: Cn }, [{ window: it, line: so, kind: tt }], Pu).then(async (t) => {
      if (t.status === Fu) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ns(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new qu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = ro(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = _n;
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
    const r = a instanceof FormData, i = { method: t, headers: { ...Cn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Ju(a) }, c = s || (r ? Uu : Mn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: it, line: n, kind: tt }], c)) : await this.sent(n, i, [{ window: it, line: n, kind: It }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, zu)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = _n, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Yu(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: it, line: t, kind: tt }], Mn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Cn });
    if (!n.ok) throw ns(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, _n, o).then((r) => (this.written(n), r)) : Ss() && !Ku(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: it, line: t, kind: Qu }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(lo, { cache: "no-store" }, [{ window: it, line: lo, kind: tt }], Gu);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = it, line: s = t, limit: o = Mn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? tt : It;
    return l === It ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ka = Symbol.for("journal.transport"), Me = globalThis[ka] ?? (globalThis[ka] = new Zu());
class Al {
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
    Me.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => _s(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function _s(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const ec = 50, tc = "refresh", nc = 1e3, ac = 3e4, sc = "requested", oc = "after_window", lc = 50, En = ".*", rc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function ic(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, c = 0, d = 0, h = !1;
  function m($) {
    const k = () => i[$] ?? i[`${$.slice(0, $.lastIndexOf("."))}.*`] ?? {}, w = A(void 0), p = wl(e, async (M) => {
      const C = await x($, M);
      return C.ok && !Object.keys(M).length && (w.value = C.value), C;
    }, () => k().page_size || lc, () => !!k().page_size, () => !!k().reads_ids);
    return t[$] = { ...p, data: w, readAt: 0 };
  }
  const v = new Proxy({}, { get: ($, k) => typeof k != "string" || k.startsWith("__v") ? void 0 : t[k] ?? m(k) }), b = ($) => (i[$].loading !== sc || $.endsWith(En)) && (!i[$].tab || i[$].tab === n.tab);
  function x($, k = {}) {
    return new Promise((w) => {
      a.push({ name: $, flags: k, resolve: w }), a.length === 1 && setTimeout(E);
    });
  }
  async function E() {
    const $ = /* @__PURE__ */ new Map(), k = a.splice(0).filter((M) => {
      const C = JSON.stringify(M.flags);
      return $.has(M.name) || $.set(M.name, C), $.get(M.name) === C ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(E);
    const w = Object.fromEntries(k.flatMap(({ name: M, flags: C }) => Object.entries(C).map(([R, F]) => [`${M}.${R}`, F]))), p = await e.readKeys({ only: [...new Set(k.map(({ name: M }) => M))], state: { ...n, ...w } });
    k.forEach(({ name: M, resolve: C }) => C(p.ok ? p.value.keys[M] : p));
  }
  async function _($) {
    var M;
    const k = ++d;
    ($.length ? $ : Object.keys(i).filter((C) => !C.endsWith(En) && i[C].loading === "first" && b(C))).forEach((C) => l[C] = k);
    const p = await e.readKeys({ only: $, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const C = ($.length ? $ : Object.keys(t)).filter((F) => (l[F] ?? 0) <= k);
      C.forEach((F) => {
        v[F].readAt = Date.now(), p.failure === "unreachable" ? r.add(F) : r.delete(F), v[F].showFirst(p);
      });
      const R = p.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const F = C.filter((Q) => l[Q] === k);
        (F.length || !$.length && !C.length && d === k) && _(F);
      }), !1;
    }
    return O(p.value.declared), Object.entries(p.value.keys).forEach(([C, R]) => {
      (l[C] ?? 0) > k || (l[C] = k, v[C].readAt = Date.now(), r.delete(C), R.ok && (v[C].data.value = R.value), v[C].showFirst(R));
    }), !0;
  }
  function q($) {
    const k = rc($);
    return k.length ? (k.forEach((w) => o.names.add(w)), o.answer ?? (o.answer = new Promise((w) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, w(_(p));
    })))) : _([]);
  }
  function U($) {
    $.forEach((k) => s.add(k)), clearTimeout(c), c = setTimeout(() => {
      const k = [...s];
      s.clear(), k.length && _(k);
    }, ec);
  }
  const j = ($) => $.endsWith(En) ? Object.keys(t).filter((k) => k.startsWith($.slice(0, -1)) && t[k].readAt) : [$], L = ($) => (i[$] ?? i[`${$.split(".")[0]}.*`]).reload_seconds;
  function P($) {
    const k = Object.keys(i).filter((p) => $.event === tc || i[p].events.some((M) => _s(M, $.event)));
    k.filter((p) => i[p].page_size).forEach((p) => v[p].heard($));
    const w = k.filter((p) => !i[p].page_size);
    w.filter((p) => !b(p)).forEach((p) => v[p].readAt = 0), U(w.filter(b).flatMap(j));
  }
  function O($) {
    if (Object.keys(i).length) return;
    i = $;
    const k = [...new Set(Object.values($).flatMap((p) => p.events))];
    k.length && e.follow(k, P);
    const w = Object.keys($).filter((p) => $[p].loading === oc);
    w.length && _(w);
  }
  pe(() => n.tab, () => {
    const $ = Object.keys(i).filter((k) => !k.endsWith(En) && b(k) && !v[k].readAt);
    $.length && _($);
  }), Le(() => {
    h = !0, clearTimeout(c);
  });
  function T() {
    const $ = Date.now(), k = Object.keys(i).filter((w) => i[w].reload_seconds > 0 && b(w)).flatMap(j).filter((w) => $ - v[w].readAt >= (r.has(w) ? Math.min(L(w) * 1e3, ac) : L(w) * 1e3));
    k.length && U(k);
  }
  return xs(T, () => e.visible.value, nc), queueMicrotask(() => _([])), { props: v, state: n, reload: q, readKey: x };
}
const uc = Symbol("open-view"), qe = Symbol.for("journal.window-context"), Ol = Symbol("dock-card");
function cc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = ic(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function Ue() {
  const e = Oe(qe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return cc(e);
}
const dc = (e, t) => e(Ol, t), Kx = () => Oe(Ol), fc = ["data-icon", "stroke-width", "innerHTML"], ye = {
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
    return (o, l) => (u(), f("svg", {
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
    }, null, 12, fc));
  }
}, hc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, mc = /* @__PURE__ */ V(hc, [["__scopeId", "data-v-eb453d6f"]]), pc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = sa(), a = I(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = A(!1), o = I(() => t.busy || s.value), l = Oe(qe, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(c) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(c)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, xl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), H(gt(e.href ? "a" : "button"), Ne(a.value, {
      type: e.href ? void 0 : N(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: D(() => [
        g("span", {
          class: J(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : S("", !0),
          me(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), H(mc, {
          key: 0,
          class: "btn-spinner"
        })) : S("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ V(pc, [["__scopeId", "data-v-ededdadf"]]), gc = ["aria-checked", "aria-haspopup", "onClick"], vc = {
  key: 0,
  class: "segmented-dot"
}, yc = {
  key: 1,
  class: "segmented-note"
}, bc = {
  key: 2,
  class: "segmented-count"
}, kc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ws();
    return (s, o) => {
      const l = Li("tip");
      return u(), f("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(W, null, te(e.options, (r) => De((u(), f("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: J(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (u(), f("span", vc)) : S("", !0),
          ee(" " + y(r.label) + " ", 1),
          r.note ? (u(), f("small", yc, y(r.note), 1)) : S("", !0),
          r.count !== void 0 ? (u(), f("em", bc, y(r.count), 1)) : S("", !0)
        ], 10, gc)), [
          [l, r.tip || r.title, `${N(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Pt = /* @__PURE__ */ V(kc, [["__scopeId", "data-v-c89bc92d"]]), wc = {
  key: 0,
  class: "more-items"
}, $c = {
  key: 0,
  role: "alert"
}, xc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", wc, [
      e.failure ? (u(), f("p", $c, y(e.failure), 1)) : S("", !0),
      e.more ? (u(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: D(() => [
          ee(y(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : S("", !0)
    ])) : S("", !0);
  }
}, pn = /* @__PURE__ */ V(xc, [["__scopeId", "data-v-10464014"]]), Sc = { class: "link-group" }, Mc = {
  class: "group-label",
  "data-link-kind": ""
}, _c = ["disabled", "onClick"], Cc = { class: "title" }, Ec = { class: "relations" }, Ac = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = I(() => s.value ? n.rows : n.rows.slice(0, 3)), l = I(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), r = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, i = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Sc, [
      g("div", Mc, y(l.value), 1),
      (u(!0), f(W, null, te(o.value, (m) => (u(), f("button", Ne({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (v) => a("open", m)
      }), [
        g("span", Cc, y(m.endpoint.title), 1),
        g("span", Ec, [
          ee(y(c(m)), 1),
          r(m) ? (u(), f(W, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : S("", !0)
        ])
      ], 16, _c))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (m) => s.value = !0)
      }, "Show more")) : S("", !0)
    ]));
  }
}, Oc = /* @__PURE__ */ V(Ac, [["__scopeId", "data-v-be6f079c"]]), Tc = ["data-loaded"], Rc = { class: "rows" }, Ic = ["disabled", "onClick"], Bc = { class: "title" }, Lc = { class: "relations" }, Nc = { key: 2 }, Dc = {
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
    const n = e, a = t, s = A([]), o = A({}), l = A(0), r = A(""), i = A(null), c = A(!1), d = A("");
    let h = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, v = (T) => m[T] || `${T.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())}s`, b = I(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((T, $) => T + $, 0) },
      ...Object.entries(o.value).filter(([T]) => !n.onlyKinds.length || n.onlyKinds.includes(T)).map(([T, $]) => ({ key: T, label: v(T), count: $ }))
    ]), x = I(() => {
      const T = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((k) => k.endpoint.model))].map((k) => [k, s.value.filter((w) => w.endpoint.model === k).length])), $ = { doc: 0, task: 1, message: 2 };
      return Object.entries(T).sort(([k], [w]) => ($[k] ?? 3) - ($[w] ?? 3)).map(([k, w]) => ({ model: k, count: w, rows: s.value.filter((p) => p.endpoint.model === k) }));
    }), E = (T) => T.endpoint.unavailable || !T.endpoint.open_ref, _ = (T) => ({ [n.linkAttribute]: !0, "data-link-model": T.endpoint.model, "data-link-id": T.endpoint.id }), q = (T) => `${T.endpoint.model === "doc" && T.endpoint.id === n.documentId ? "Design document" : T.endpoint.model.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())} ${T.endpoint.id}, ${T.relations.map(($) => $.replaceAll("_", " ")).join(", ")}`;
    async function U(T = 1) {
      const $ = ++h;
      c.value = !0, d.value = "";
      const k = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(T), "--page-size", String(n.pageSize)];
      n.outsidePlan && k.push("--outside-plan"), n.documentId && k.push("--first-counterpart", `doc:${n.documentId}`), r.value && k.push("--kind", r.value);
      try {
        const w = await n.read(k);
        if ($ !== h) return;
        if (!w.ok) {
          d.value = w.error;
          return;
        }
        const p = w.value.counterparts ?? [], M = T === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(M.map((C) => [`${C.endpoint.model}:${C.endpoint.id}`, C])).values()], o.value = w.value.kinds ?? {}, l.value = w.value.total, i.value = w.value.next_page ?? null;
      } catch (w) {
        $ === h && (d.value = w.message);
      } finally {
        $ === h && (c.value = !1);
      }
    }
    function j(T) {
      if (E(T)) return;
      const [$, k] = T.endpoint.open_ref.split(":");
      a("open", { table: $, id: Number(k) });
    }
    function L(T) {
      r.value = T, U();
    }
    const P = () => !c.value && i.value && U(i.value), O = I(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", U();
    }, { immediate: !0 }), (T, $) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: J(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), H(Pt, {
        key: 0,
        options: b.value,
        value: r.value,
        wrap: "",
        onPick: L
      }, null, 8, ["options", "value"])) : S("", !0),
      g("div", Rc, [
        e.grouped ? (u(!0), f(W, { key: 0 }, te(x.value, (k) => (u(), H(Oc, {
          key: k.model,
          model: k.model,
          count: k.count,
          rows: k.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: j
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(W, { key: 1 }, te(s.value, (k) => (u(), f("button", Ne({
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, _(k), {
          disabled: E(k),
          onClick: (w) => j(k)
        }), [
          g("span", Bc, y(k.endpoint.title), 1),
          g("span", Lc, [
            ee(y(q(k)), 1),
            E(k) ? (u(), f(W, { key: 0 }, [
              ee(" · Unavailable")
            ], 64)) : S("", !0)
          ])
        ], 16, Ic))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Nc, y(e.empty), 1)) : S("", !0),
        B(pn, {
          more: !!i.value,
          loading: c.value,
          failure: d.value,
          label: O.value,
          onMore: P
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Tc)) : S("", !0);
  }
}, qc = /* @__PURE__ */ V(Dc, [["__scopeId", "data-v-29b9c31b"]]), jc = (e, t, n) => Math.max(t, Math.min(n, e)), Pc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Tl = /* @__PURE__ */ new WeakMap(), Fc = (e, t) => Tl.set(e, t);
function Wc(e, t) {
  for (let n = t; n; n = Tl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Rl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Wc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Tt = 8, Hc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = A(null), o = (p) => p ? `${p}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = A({ w: 0, h: 0 }), i = A(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), h = (p) => {
      const M = p.closest(".pane, .float-window");
      return M ? d(M.getBoundingClientRect()) : c();
    }, m = (p, M) => `${Math.max(0, p ? Math.min(p, M) : M)}px`;
    function v(p, M) {
      return {
        below: p.bottom - M.bottom - a.gap - Tt,
        above: M.top - p.top - a.gap - Tt,
        across: p.right - p.left - 2 * Tt
      };
    }
    function b(p) {
      const M = h(a.anchor), C = v(M, p);
      return r.value.w <= C.across && r.value.h <= Math.max(C.below, C.above) ? M : c();
    }
    const x = I(() => {
      if (!i.value) return l.value;
      const p = i.value, M = b(p), C = v(M, p), { w: R, h: F } = r.value, Q = a.align === "auto" ? p.left + p.right > M.left + M.right : a.align === "right", se = jc(Q ? p.right - R : p.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), ge = F > C.below && C.above > C.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, C.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, C.below) };
      return { ...l.value, ...ge, left: `${se}px`, maxWidth: m(a.maxWidth, C.across) };
    }), E = n, _ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(p) {
      const M = _(), C = M.indexOf(document.activeElement);
      M[(C + p + M.length) % M.length].focus();
    }
    const U = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => E("close") }, j = (p) => U[p.key] && (p.preventDefault(), U[p.key]()), L = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let P = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(P), P = requestAnimationFrame(L);
    });
    Rl(s, (p) => a.anchor && !a.anchor.contains(p.target) && E("close"));
    const T = (p, M) => ["top", "left", "right", "bottom"].some((C) => Math.abs(p[C] - M[C]) > 1), $ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let k = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || $(p)) return E("close");
        T(p, i.value) && (i.value = p);
      }
      k = requestAnimationFrame(w);
    }
    return Te(() => {
      a.anchor && s.value && Fc(s.value, a.anchor), L(), s.value && O.observe(s.value), !a.plain && _()[0] && _()[0].focus(), w();
    }), Le(() => {
      O.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(P);
    }), t({ element: s }), (p, M) => (u(), H(oa, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ne({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: j
      }), [
        me(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ra = /* @__PURE__ */ V(Hc, [["__scopeId", "data-v-3d203970"]]), Uc = { class: "split-button" }, zc = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = A(null), s = A(!1), o = () => s.value = !1;
    return (l, r) => (u(), f("span", Uc, [
      B(de, {
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
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        B(de, {
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
            B(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), H(ra, {
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
      }, 8, ["anchor"])) : S("", !0)
    ]));
  }
}, Vc = /* @__PURE__ */ V(zc, [["__scopeId", "data-v-c258494d"]]), Gc = 0, Kc = "/api/lines", Yc = "/api/line", io = 5e3, uo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), co = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), wa = (e) => JSON.stringify(e.line), fo = () => new DOMException("cancelled", "AbortError");
class Jc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(wa(t))) {
        Me.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), Gc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(fo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(fo()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(Kc, uo({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => co(r.body, tt)), io);
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
    await this.alone(t, tt), Date.now() - n < io ? this.slow.delete(wa(t.body)) : this.slow.add(wa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(Yc, uo(t.body, t.signal), [co(t.body, n)], n === tt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Il = new Jc(), Xc = "/api/window";
function Qc(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Xc}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: tt }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const Bl = /* @__PURE__ */ new Map();
class Zc {
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
function Yx(e, t) {
  const n = new Zc(e, t);
  return Bl.set(e, n), n.load().catch(() => {
  }), n;
}
const Cs = (e) => Bl.get(e);
function ed(e, t, n) {
  const a = Cs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function td(e, t) {
  if (!e) return !0;
  const n = Cs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const as = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ll = {};
async function Jx(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ll = (await t.json()).states);
}
const Es = (e, t) => {
  var n;
  return (n = Ll[e]) == null ? void 0 : n[t];
}, As = (e, t) => {
  var n;
  return ((n = Es(e, t)) == null ? void 0 : n.label) ?? as(t);
}, Nl = (e, t) => {
  var n;
  return ((n = Es(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, nd = (e, t) => {
  var n;
  return ((n = Es(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, ad = Symbol("pane-page"), Dl = Symbol("inspector-host"), ql = { 1: "refused", 2: "usage", 3: "fault" }, sd = 100, od = 50, ld = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, rd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function id({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = A({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: m = "", tabs: v = [], sources: b = [], links: x = {}, search: E = {}, readOnly: _ = !1, shared: q = null }) {
  const U = /* @__PURE__ */ new Map(), j = new AbortController(), L = A(!1), P = performance.now();
  let O = 0, T = 0, $ = () => {
  };
  const k = new Promise((F) => $ = F);
  j.signal.addEventListener("abort", $, { once: !0 });
  const w = () => {
    clearTimeout(T), T = setTimeout(() => {
      O === 0 && $s(P, () => {
        L.value = !0, $();
      });
    }, od);
  }, p = (F, Q) => (O += 1, Bt(e, F, t, j.signal, Q).finally(() => {
    O -= 1, w();
  })), M = (F, Q) => (w(), k.then(() => j.signal.aborted ? ot : Bt(e, F, t, j.signal, Q))), C = ({ only: F = [], state: Q = {} } = {}) => (O += 1, cd(() => Qc(e, t, F, Q, j.signal), j.signal).finally(() => {
    O -= 1, w();
  })), R = (F, { unbatched: Q = !1, deferred: se = !1 } = {}) => {
    const ie = U.get(F);
    if (ie && performance.now() - ie.at < sd) return ie.answer;
    const ge = se && !L.value ? M(F, Q) : p(F, Q);
    return U.set(F, { answer: ge, at: performance.now() }), ge;
  };
  return {
    answered: L,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: b,
    links: x,
    search: E,
    readOnly: _,
    shared: q,
    read: R,
    readKeys: C,
    waitForServer: () => Ss() ? El() : null,
    run: (F) => Bt(e, F, t, j.signal),
    upload: (F) => fd(F, e, j.signal),
    cancel: () => j.abort(),
    signal: j.signal,
    subscriptions: l,
    follow: (F, Q) => l.follow(e, [F].flat().filter((se) => o.some((ie) => _s(ie, se))), (se) => {
      U.clear(), Q(se);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (F) => I(() => {
      var Q;
      return i.value[F] ?? ((Q = c.find((se) => se.key === F)) == null ? void 0 : Q.default);
    }),
    setting: async (F, Q) => {
      const se = await R(`window setting ${e} ${F}`);
      return se.ok ? se.value.value : Q;
    },
    setOption: h,
    keep: (F, Q) => Bt(e, ["window", "save-setting", e, F, JSON.stringify(Q)], t, j.signal)
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
const ot = { ok: !1, failure: "cancelled", error: "" }, Os = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Pl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ot : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ql[n.code] || "fault", error: jl(n.error) };
  } catch {
    return t != null && t.aborted ? ot : { ok: !1, failure: "unreachable", error: Os };
  }
}
const ud = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: ql[e.code] || "fault", error: jl(e.error) };
async function cd(e, t) {
  try {
    const n = await e();
    return t.aborted ? ot : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, ud(s)])) } };
  } catch {
    return t.aborted ? ot : { ok: !1, failure: "unreachable", error: Os };
  }
}
async function Fl(e, t, n) {
  const a = await Pl(() => Il.read(e, t, n), t);
  return a.failure !== "unreachable" || !Ss() ? a : (await El(), t.aborted ? ot : Fl(e, t, n));
}
function Bt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => dd(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : Ts(t)));
}
async function dd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Ts(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => Fl({ ...o, attribution: r }, l, s), a, o).catch(() => ot) : Pl(() => Il.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function fd(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ot : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ot : { ok: !1, failure: "unreachable", error: Os };
  }
}
function Ts(e) {
  return [...e.matchAll(ld)].map(([t]) => t.replace(rd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const hd = (e) => `show-${e}`, Xx = (e, t, n) => e.filter((a) => {
  var s;
  return n(hd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Wl = "messages.chat", md = {
  key: 0,
  class: "template-brief"
}, pd = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, gd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A([]), o = A(""), l = I(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = I(() => s.value.find((c) => String(c.id) === n.value));
    async function i() {
      const c = await Bt(Wl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((m) => m.title === d);
      h && a("pick", String(h.id));
    }
    return i(), (c, d) => (u(), f(W, null, [
      B(Pt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), f("p", md, y(r.value.brief), 1)) : S("", !0),
      o.value ? (u(), f("p", pd, y(o.value), 1)) : S("", !0)
    ], 64));
  }
}, vd = /* @__PURE__ */ V(gd, [["__scopeId", "data-v-14be8a5c"]]), yd = { class: "form-field" }, bd = { class: "form-field-head" }, kd = ["for"], wd = {
  key: 0,
  class: "form-field-aside"
}, $d = {
  key: 0,
  class: "form-field-help"
}, xd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", yd, [
      g("div", bd, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, y(e.label), 9, kd),
        t.$slots.aside ? (u(), f("span", wd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : S("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (u(), f("p", $d, y(e.help), 1)) : S("", !0)
    ]));
  }
}, Sd = /* @__PURE__ */ V(xd, [["__scopeId", "data-v-dd7cdcff"]]), ss = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Md = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = sa(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => De((u(), f("textarea", Ne({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [N(ss), N(t).value]
    ]);
  }
}), _d = /* @__PURE__ */ V(Md, [["__scopeId", "data-v-e130a5b9"]]), Cd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ws(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), H(Sd, {
      label: e.field.label,
      for: N(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        B(zt, { value: o.value }, {
          choice: D(() => [
            B(Pt, {
              id: N(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            B(vd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            B(_d, {
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
}, ia = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        B(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Ed(e, t, n, a = () => window) {
  Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Ad = (e, t = () => !0) => Ed("keydown", (n) => n.key === "Escape" && t() && e());
function Hl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = A(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Ad(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Od = 80, Rt = Ht([]);
function Ul(e) {
  const t = Symbol("layer"), n = () => Rt.includes(t) && Rt.splice(Rt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Rt.includes(t) && Rt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), I(() => Od + Math.max(0, Rt.indexOf(t)));
}
let zl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return zl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Td = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Rd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Td)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Te(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : zl, document.addEventListener("keydown", s), Qe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Le(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Id = ["aria-modal", "aria-label", "aria-labelledby"], Bd = {
  key: 0,
  class: "dialog-head"
}, Ld = ["id", "tabindex"], Nd = {
  key: 1,
  class: "dialog-foot"
}, Dd = 500, qd = 400, jd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Hl(a, n), r = Ul(s), i = A(null), c = A(null), d = A(null), h = ws(), m = A(!1), v = Date.now();
    n.modal && Rd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, qd);
    }
    function x(q) {
      !n.modal || Date.now() - v >= Dd || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const E = () => i.value && (i.value.scrollTop = i.value.scrollHeight), _ = new MutationObserver(E);
    return pe(i, (q) => {
      _.disconnect(), q && n.follow && (_.observe(q, { childList: !0, subtree: !0, characterData: !0 }), E());
    }), Le(() => _.disconnect()), (q, U) => (u(), H(oa, { to: "body" }, [
      B(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: N(l)
      }, {
        default: D(() => [
          N(s) ? (u(), f("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: N(r) }),
            onClick: xe(b, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: c,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? N(h) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? S("", !0) : (u(), f("header", Bd, [
                g("h3", {
                  id: N(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, y(e.title), 9, Ld),
                e.closable ? (u(), H(ia, {
                  key: 0,
                  onClick: N(o)
                }, null, 8, ["onClick"])) : S("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                me(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (u(), f("footer", Nd, [
                me(q.$slots, "foot", {}, void 0, !0)
              ])) : S("", !0)
            ], 42, Id)
          ], 6)) : S("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ua = /* @__PURE__ */ V(jd, [["__scopeId", "data-v-6d1ecd98"]]), Pd = {
  class: "action-output",
  "data-action-output": ""
}, Fd = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(ua, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: D(() => [
        g("pre", Pd, y(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Wd = /* @__PURE__ */ V(Fd, [["__scopeId", "data-v-423a045c"]]);
function Hd(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Ni(Wd, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Ud = (e, t, n = {}) => Ts(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function gn(e, t, n, a = {}) {
  var s;
  try {
    if (!await td(e.module, n)) return { ok: !1, error: "" };
    const o = await Bt(Wl, Ud(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Hd(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const zd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, $a = [
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
}), ca = {
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
    filters: $a
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: $a
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: $a }),
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
}, Vd = ["secrets", "plugins"], Vl = Object.keys(ca).filter((e) => !($l && Vd.includes(e)));
I(() => Vl.map((e) => ({ name: e, ...ca[e] })));
const Vt = (e) => ca[e], Gl = new Map(Vl.flatMap((e) => [e, e.replace(/s$/, ""), ca[e].title.toLowerCase()].map((t) => [t, e]))), ht = (e) => Gl.get(String(e).toLowerCase()) || "", Kl = [...Gl.keys()].sort((e, t) => t.length - e.length).join("|"), Gd = {
  class: "button-form",
  "data-button-form": ""
}, Kd = {
  key: 0,
  class: "button-form-title"
}, Yd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Jd = { class: "button-form-actions" }, Xd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = A(!1), l = A(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Vt(ht(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await gn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), H(ua, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          g("div", Gd, [
            (m = e.row) != null && m.title ? (u(), f("p", Kd, y(e.row.title), 1)) : S("", !0),
            (u(!0), f(W, null, te(e.button.fields, (v) => (u(), H(Cd, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (b) => s.value[v.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", Yd, y(l.value), 1)) : S("", !0),
            g("div", Jd, [
              B(de, {
                small: "",
                onClick: h[0] || (h[0] = (v) => a("close"))
              }, {
                default: D(() => [...h[2] || (h[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              B(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
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
}, Qd = /* @__PURE__ */ V(Xd, [["__scopeId", "data-v-f26c27a7"]]), Zd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ef = {
  key: 1,
  class: "menu-item-text"
}, tf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", Zd, y(e.checked ? "✓" : ""), 1)) : S("", !0),
      e.description ? (u(), f("span", ef, [
        g("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, y(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ct = /* @__PURE__ */ V(tf, [["__scopeId", "data-v-fec99974"]]), nf = ["aria-busy"], af = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, sf = { class: "button-slot-confirm-text" }, of = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, lf = {
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
    const n = e, a = t, s = I(() => Cs(n.environment)), o = I(
      () => {
        var _;
        return !n.readOnly && ((_ = s.value) == null ? void 0 : _.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var _;
      return !n.readOnly && ((_ = s.value) == null ? void 0 : _.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : ed(n.environment, n.name, n.row)), c = A(null), d = A(null), h = A(""), m = A(!1), v = (_) => [_.from ? `From ${_.from}` : "", _.tip, _.warning].filter(Boolean).join(" · "), b = (_) => _.icon || (_.warning ? "dot" : "");
    function x(_) {
      if (!(m.value || n.readOnly)) {
        if (_.fields.length) {
          c.value = _;
          return;
        }
        if (_.confirm) {
          d.value = _;
          return;
        }
        return E(_);
      }
    }
    async function E(_) {
      d.value = null, h.value = "", a("failure", ""), m.value = !0;
      const q = await gn(_, n.row, n.environment);
      m.value = !1, h.value = q.ok ? "" : q.error;
      const U = _.label.toLowerCase() + (n.objectName && !_.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", q.ok ? "" : `Could not ${U}: ${q.error}`), q.ok && a("done");
    }
    return (_, q) => (u(), f("span", {
      class: J(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(W, { key: 0 }, [
        q[5] || (q[5] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        B(de, {
          small: "",
          onClick: r
        }, {
          default: D(() => [...q[4] || (q[4] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", af, [
        g("span", sf, y(d.value.confirm), 1),
        B(de, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: J({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: q[0] || (q[0] = (U) => E(d.value))
        }, {
          default: D(() => [
            ee(y(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        B(de, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: q[1] || (q[1] = (U) => d.value = null)
        }, {
          default: D(() => [...q[6] || (q[6] = [
            ee("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? S("", !0) : (u(), f(W, { key: 2 }, [
        (u(!0), f(W, null, te(i.value, (U) => (u(), f(W, {
          key: U.name
        }, [
          U.menu.length ? (u(), H(Vc, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: m.value,
            "menu-label": U.menu_label || "More ways",
            title: v(U),
            "data-button": U.name,
            onMain: (j) => x(U)
          }, {
            menu: D(({ close: j }) => [
              (u(!0), f(W, null, te(U.menu, (L) => (u(), H(Ct, {
                key: L.label,
                description: L.description,
                onClick: (P) => (j(), x({ ...U, ...L, menu: [] }))
              }, {
                default: D(() => [
                  ee(y(L.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              ee(y(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), H(de, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: J({ danger: U.danger }),
            icon: b(U),
            disabled: m.value,
            title: v(U),
            "data-button": U.name,
            onClick: (j) => x(U)
          }, {
            default: D(() => [
              ee(y(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", of, y(h.value), 1)) : S("", !0),
        c.value && !e.readOnly ? (u(), H(Qd, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: q[2] || (q[2] = (U) => c.value = null),
          onDone: q[3] || (q[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : S("", !0)
      ], 64))
    ], 10, nf));
  }
}, Yl = /* @__PURE__ */ V(lf, [["__scopeId", "data-v-a4b6f174"]]), rf = {
  class: "running",
  "data-running-command": ""
}, uf = ["title"], cf = {
  key: "idle",
  class: "running-idle"
}, df = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", rf, [
      B(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, y(e.text), 9, uf)) : (u(), f("span", cf, y(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Qx = /* @__PURE__ */ V(df, [["__scopeId", "data-v-d3240219"]]), ff = ["aria-checked", "aria-label", "title"], hf = {
  key: 0,
  class: "switch-inner"
}, mf = {
  key: 0,
  class: "switch-word"
}, pf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("button", {
      type: "button",
      class: J(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), f("span", hf, y(e.word), 1)) : S("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", mf, y(e.word), 1)) : S("", !0)
    ], 10, ff));
  }
}, Zx = /* @__PURE__ */ V(pf, [["__scopeId", "data-v-1bfb90f3"]]);
function Jl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Un(e, t) {
  return Jl(() => localStorage, e, t);
}
function Xl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Rs(e, t) {
  return Xl(() => localStorage, e, t);
}
function Ql(e, t) {
  pe(t, (n) => Rs(e, n), { deep: !0 });
}
function gf(e, t) {
  return Jl(() => sessionStorage, e, t);
}
function vf(e, t) {
  return Xl(() => sessionStorage, e, t);
}
const zn = "journal.environment", Zl = A(gf(zn, Un(zn, "")));
function yf(e) {
  Zl.value = e, vf(zn, e), Rs(zn, e);
}
const Vn = A(location.hash), ho = Ye(null), mo = { integrations: "mcp", library: "team" };
function bf() {
  if (!ho.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (mo[n]) {
    location.replace(`#/${[mo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Vn.value = location.hash;
    return;
  }
  !n || ho.value(n) || (yf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Vn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Vn.value = location.hash, bf();
});
const os = I(() => {
  const [e, t = ""] = Vn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [c = "", d = "", h = ""] = r.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: i };
  });
  return {
    env: Zl.value,
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
}), Is = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Is.page(e)}?open=${t}`
};
function kf(e = "", t = 0, n = "") {
  location.hash = Is.page(e, t, n);
}
const wf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function er(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(wf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Nt = {};
function e8(e, t) {
  return Nt[e] = t, () => Nt[e] === t && delete Nt[e];
}
function Ft(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Nt[e]) != null && l.call(Nt, t))) return;
  const s = os.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  er([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function $f(e, t, n, a = 0, s = "") {
  if (e === os.value.env) return Ft(t, n, a, s);
  const o = os.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  er([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function He(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? $f(a, s, Number(o), 0, t) : Ft(s, Number(o), 0, t);
}
function xf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Lt(e) {
  const t = xf(e);
  t && He(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function t8(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Sf = { class: "inspector-part" }, Mf = { class: "inspector-part-title" }, _f = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Sf, [
      g("h4", Mf, y(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, n8 = /* @__PURE__ */ V(_f, [["__scopeId", "data-v-0da7fa52"]]);
function Cf(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Bs(e, t = Date.now()) {
  const n = Cf(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Ef = 36e5;
function Af(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Ef;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function po(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function tr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function go(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const xa = (e) => String(e).padStart(2, "0");
function nr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${xa(t % 60)}s` : `${Math.floor(t / 3600)}h ${xa(Math.floor(t % 3600 / 60))}m ${xa(t % 60)}s`;
}
const Of = 1e3;
function ar() {
  const e = A(Date.now()), t = setInterval(() => e.value = Date.now(), Of);
  return Xe(() => clearInterval(t)), e;
}
const Tf = Symbol("resource-subscriptions");
function Rf(e, t) {
  const n = Oe(Tf, () => new Al(), !0), a = Ms(t, 100), s = n.follow("resources", e, a);
  la(() => {
    s(), a.cancel();
  });
}
const If = "Not known", Bf = 80, Lf = 1e3, Nf = "worker", Df = "main", qf = /* @__PURE__ */ new Set(["waiting", "blocked"]), sr = (e) => e.ok ? e.value.rows : [], vo = (e) => e.ok ? e.value.total : 0, or = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), jf = (e, t) => (t == null ? void 0 : t.given_name) || or((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Pf = (e, t) => e.ended_at ? "ended" : e.paused_at || qf.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ff = (e, t) => [(t == null ? void 0 : t.profile) && or(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), lr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Wf({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Lf, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: nr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Bf }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? If : `$${t.cost_dollars.toFixed(2)}` }), e.role === Nf && l.push({ key: "pace", label: "Tasks an hour", value: String(Af(lr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Df && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Hf(e) {
  const t = lr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Uf(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", po(e.created_at)]), e.ended_at && n.push(["Ended", po(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const zf = { class: "band" }, Vf = { key: 0 }, Gf = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", zf, [
      B(ye, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      me(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Vf, y(e.count), 1)) : S("", !0)
    ]));
  }
}, Gn = /* @__PURE__ */ V(Gf, [["__scopeId", "data-v-1758914f"]]), Kf = { class: "number" }, Yf = { class: "text" }, Jf = 150, Xf = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = A(!1), a = I(() => t.text.length > Jf), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(W, null, [
      e.text ? (u(), f(W, { key: 0 }, [
        B(Gn, { icon: "file" }, {
          default: D(() => [
            ee(y(e.label), 1)
          ]),
          _: 1
        }),
        g("div", {
          class: J(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, y(e.text), 3),
        a.value && !n.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (r) => n.value = !0)
        }, "Show all")) : S("", !0)
      ], 64)) : S("", !0),
      e.points.length ? (u(), f(W, { key: 1 }, [
        B(Gn, { icon: "points" }, {
          default: D(() => [...l[1] || (l[1] = [
            ee("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(W, null, te(e.points, (r) => {
          var i;
          return u(), f("p", {
            key: r.id,
            class: "point",
            "data-agent-point": ""
          }, [
            g("span", Kf, y(r.id), 1),
            g("span", Yf, [
              ee(y(r.text), 1),
              g("span", {
                class: J(["proof", { checked: ((i = r.proof) == null ? void 0 : i.state) === "checked" }])
              }, y(s(r)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : S("", !0)
    ], 64));
  }
}, Qf = /* @__PURE__ */ V(Xf, [["__scopeId", "data-v-c99de22c"]]), Zf = ["aria-expanded"], eh = { class: "count" }, th = {
  key: 0,
  "data-agent-fold-body": ""
}, nh = {
  __name: "AgentFold",
  props: /* @__PURE__ */ qt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = sn(e, "open");
    return (n, a) => (u(), f(W, null, [
      g("button", {
        type: "button",
        class: J(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        B(ye, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        ee(y(e.label), 1),
        g("span", eh, y(e.count), 1),
        B(ye, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Zf),
      t.value ? (u(), f("div", th, [
        me(n.$slots, "default", {}, void 0, !0)
      ])) : S("", !0)
    ], 64));
  }
}, Sa = /* @__PURE__ */ V(nh, [["__scopeId", "data-v-7f93d8d9"]]), ah = ["onClick"], sh = { class: "text" }, oh = { class: "aside" }, lh = {
  key: 0,
  class: "none"
}, rh = {
  class: "skills",
  "data-agent-skills": ""
}, ih = {
  key: 0,
  class: "none-inline"
}, uh = { class: "label" }, ch = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = A([]), s = A([]), o = async (r) => sr(await t.read(r));
    pe(() => [n.helpers, t.loads], async ([r]) => {
      r && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([r]) => {
      r && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (r) => r.given_name || `${as(r.role)} ${r.id}`;
    return (r, i) => (u(), f(W, null, [
      B(Sa, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: D(() => [
          (u(!0), f(W, null, te(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => N(Ft)("agents", c.id)
          }, [
            g("span", sh, y(l(c)), 1),
            g("span", oh, y(N(as)(c.role)) + " " + y(c.id), 1)
          ], 8, ah))), 128)),
          a.value.length ? S("", !0) : (u(), f("p", lh, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      B(Sa, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: D(() => [
          g("p", rh, [
            (u(!0), f(W, null, te(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, y(c.skill), 1))), 128)),
            s.value.length ? S("", !0) : (u(), f("span", ih, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      B(Sa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: D(() => [
          (u(!0), f(W, null, te(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            g("span", uh, y(c) + ":", 1),
            g("span", {
              class: J(["value", h])
            }, y(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, dh = /* @__PURE__ */ V(ch, [["__scopeId", "data-v-358a0300"]]), fh = ["datetime", "title"], Je = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = ar(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, y(N(Bs)(e.at, N(n))), 9, fh));
  }
}, hh = {
  class: "now",
  "data-agent-now": ""
}, mh = {
  key: 1,
  class: "muted"
}, ph = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, gh = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, vh = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, yh = { class: "line" }, bh = { class: "detail" }, kh = { class: "bar" }, wh = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = I(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(W, null, [
      B(Gn, { icon: "play" }, {
        default: D(() => [...o[2] || (o[2] = [
          ee("Doing now", -1)
        ])]),
        _: 1
      }),
      g("div", hh, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => N(Ft)("tasks", e.inspection.task.id))
        }, "Task " + y(e.inspection.task.id) + ": " + y(e.inspection.task.title), 1)) : (u(), f("span", mh, y(e.nothing), 1)),
        n.value ? (u(), f("span", ph, y(n.value), 1)) : S("", !0),
        e.inspection.last_activity ? (u(), f("span", gh, [
          o[3] || (o[3] = ee("Last heard: ", -1)),
          B(Je, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : S("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", vh, [
        g("div", yh, [
          g("span", null, "Plan " + y(e.inspection.plan.id) + ", phase " + y(e.inspection.plan.phase), 1),
          g("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => N(Ft)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        g("span", bh, y(e.inspection.plan.done) + " of " + y(e.inspection.plan.total) + " tasks done", 1),
        g("div", kh, [
          g("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : S("", !0)
    ], 64));
  }
}, $h = /* @__PURE__ */ V(wh, [["__scopeId", "data-v-cbe6a9f7"]]), xh = ["onClick"], Sh = { class: "text" }, Mh = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, _h = { class: "text" }, Ch = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Eh = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(W, null, [
      B(Gn, { icon: "clock" }, {
        default: D(() => [...n[0] || (n[0] = [
          ee("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(W, null, te(e.moves, (a) => (u(), f(W, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => N(Ft)(a.table, a.id)
        }, [
          g("i", {
            class: J(["dot", a.tone])
          }, null, 2),
          g("span", Sh, y(a.text), 1),
          B(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, xh)) : (u(), f("div", Mh, [
          g("i", {
            class: J(["dot", a.tone])
          }, null, 2),
          g("span", _h, y(a.text), 1),
          B(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? S("", !0) : (u(), f("p", Ch, "Nothing yet."))
    ], 64));
  }
}, Ah = /* @__PURE__ */ V(Eh, [["__scopeId", "data-v-58f0db57"]]), Oh = {
  class: "strip",
  "data-agent-strip": ""
}, Th = ["data-agent-cell"], Rh = {
  key: 0,
  class: "meter"
}, Ih = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", Oh, [
      (u(!0), f(W, null, te(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        g("small", null, y(a.label), 1),
        g("b", {
          class: J({ bad: a.bad })
        }, y(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", Rh, [
          g("i", {
            class: J({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : S("", !0)
      ], 8, Th))), 128))
    ]));
  }
}, Bh = /* @__PURE__ */ V(Ih, [["__scopeId", "data-v-b6657ab7"]]), Lh = {
  class: "who",
  "data-agent-who": ""
}, Nh = { class: "name" }, Dh = ["data-agent-state"], qh = {
  class: "sub",
  "data-agent-identity": ""
}, jh = {
  class: "sub",
  "data-agent-started-by": ""
}, Ph = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", Lh, [
      g("h2", Nh, [
        g("i", {
          class: J(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, Dh),
        ee(y(e.name), 1)
      ]),
      g("p", qh, y(e.parts.join(" · ")), 1),
      g("p", jh, "Started by: " + y(e.startedBy), 1)
    ]));
  }
}, Fh = /* @__PURE__ */ V(Ph, [["__scopeId", "data-v-cf32a62c"]]), Wh = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Hh = { class: "scroll" }, Uh = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, zh = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Vh = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ar(), a = A(null), s = A(null), o = A(null), l = A({}), r = A({ helpers: 0, skills: 0 }), i = A(0), c = A([]), d = A("");
    let h = 0;
    const m = I(() => {
      var b;
      return a.value.ended_at ? Hf(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function v() {
      const b = ++h, x = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!x.ok) return void (d.value = x.error);
      const E = String(t.id), _ = x.value.role === "worker", [q, U, j, L, P, O] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", E, "--environment", t.environment]),
        t.read(["usage", "agent", E]),
        x.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", E]),
        t.read(["agent", "list", "--parent", E, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", E, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        _ ? t.read(["worker-worktree", "points", "--agent", E]) : { ok: !1 }
      ]);
      b === h && (d.value = U.ok ? "" : U.error, a.value = x.value, s.value = sr(q).find((T) => T.id === t.id) ?? null, o.value = U.ok ? U.value : null, l.value = j.ok ? j.value : {}, r.value = { helpers: vo(L), skills: vo(P) }, c.value = O.ok ? O.value.points : [], i.value += 1);
    }
    return Rf(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], v), Te(v), (b, x) => {
      var E;
      return u(), f("article", Wh, [
        g("div", Hh, [
          d.value ? (u(), f("p", Uh, y(d.value), 1)) : a.value && o.value ? (u(), f(W, { key: 1 }, [
            B(Fh, {
              name: N(jf)(a.value, s.value),
              state: N(Pf)(a.value, s.value),
              parts: N(Ff)(a.value, s.value),
              "started-by": o.value.started_by
            }, null, 8, ["name", "state", "parts", "started-by"]),
            B(Bh, {
              cells: N(Wf)({ row: a.value, facts: s.value, inspection: o.value, now: N(n) })
            }, null, 8, ["cells"]),
            B($h, {
              inspection: o.value,
              tool: l.value,
              nothing: m.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            B(Qf, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((E = s.value) == null ? void 0 : E.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            B(Ah, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            B(dh, {
              id: e.id,
              read: e.read,
              counts: r.value,
              loads: i.value,
              details: N(Uf)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", zh, "Ended " + y(N(Bs)(a.value.ended_at, N(n))) + ". It takes no more actions.", 1)) : S("", !0)
          ], 64)) : (u(), H(lt, { key: 2 }))
        ])
      ]);
    };
  }
}, a8 = /* @__PURE__ */ V(Vh, [["__scopeId", "data-v-40345b29"]]), ls = [], Gh = 2e3, ct = /* @__PURE__ */ new Map(), Kh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Yh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? ls.unshift(e) : ls.push(e), ct.clear();
}
function rr(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Jh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Xh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function st(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Qh(e, t) {
  const n = [{ type: "text", text: st(e).replace(/\r\n/g, `
`) }];
  for (const a of ls)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function ln(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Zh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Zh(e) {
  return e.split(Yh).map((t, n) => n % 2 ? t : t.replace(Kh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function yo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const em = 24;
function tm(e) {
  const [t, , ...n] = e, a = yo(t), s = n.map(yo), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > em) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${ln(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, d) => `<td${o(d)}>${ln(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const ir = /^\s*(?:[-*+]|\d+[.)])\s+/, rs = /^\s*(\d+)[.)]\s/, bo = (e) => e.match(/^\s*/)[0].length;
function ur(e) {
  const t = e[0].match(rs), n = bo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && bo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${ln(o.text)}${o.nested.length ? ur(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function nm(e, t) {
  const n = rs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (ir.test(e[s]) && rs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const ko = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function cr(e) {
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
      n.push(`<h${r}>${ln(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (ko(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(tm(t.slice(a, r))), a = r;
      continue;
    }
    if (ir.test(s)) {
      const r = nm(t, a);
      n.push(ur(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${cr(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !ko(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${ln(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const am = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, sm = (e) => e.type !== "text" && !am.test(e.html);
function om(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(cr(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : sm(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function dr(e, t = { env: "" }) {
  const n = Xh(e, t), a = ct.get(n);
  if (ct.delete(n), a && a.source === t.source && a.reads.every((l) => Jh(l, t)))
    return ct.set(n, a), a.html;
  const s = [], o = om(Qh(e, { ...t, reads: s }));
  return ct.set(n, { html: o, reads: s, source: t.source }), ct.size > Gh && ct.delete(ct.keys().next().value), o;
}
const lm = ["aria-expanded"], rm = { class: "drop-label" }, im = ["value"], um = {
  key: 1,
  class: "drop-lead"
}, cm = { class: "drop-item-text" }, dm = {
  key: 2,
  class: "drop-note"
}, fm = {
  key: 1,
  class: "drop-none"
}, hm = {
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
    const n = e, a = t, s = A(!1), o = A(null), l = A(""), r = I(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), f("div", {
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (u(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : S("", !0),
        g("span", rm, y(e.label), 1),
        B(ye, {
          name: "down",
          size: 11
        })
      ], 10, lm),
      s.value ? (u(), H(ra, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (h) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (u(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (h) => l.value = h.target.value)
          }, null, 40, im)) : S("", !0),
          (u(!0), f(W, null, te(r.value, (h) => (u(), H(Ct, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (m) => i(h)
          }, {
            default: D(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: J(["drop-dot", { live: h.running }])
              }, null, 2)) : S("", !0),
              h.lead ? (u(), f("span", um, y(h.lead), 1)) : S("", !0),
              g("span", cm, y(h.label), 1),
              h.note ? (u(), f("span", dm, y(h.note), 1)) : S("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? S("", !0) : (u(), f("p", fm, y(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : S("", !0)
    ], 2));
  }
}, fr = /* @__PURE__ */ V(hm, [["__scopeId", "data-v-29dfcce5"]]);
function mm(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Te(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Xe(() => n.disconnect()), t;
}
const pm = ["data-comment-id"], gm = {
  key: 0,
  class: "comment-top"
}, vm = { class: "comment-mark" }, ym = {
  class: "comment-body",
  "data-comment": ""
}, bm = { class: "comment-foot" }, km = {
  key: 1,
  "data-comment-lost": ""
}, wm = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (u(), f("article", {
      class: J(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), f("div", gm, [
        g("span", vm, y(e.comment.number), 1),
        g("span", {
          class: J(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, y(e.comment.quote), 3)
      ])) : S("", !0),
      g("p", ym, y(e.comment.body), 1),
      g("div", bm, [
        e.comment.created_at ? (u(), H(Je, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : S("", !0),
        e.lost ? (u(), f("span", km, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : S("", !0)
      ])
    ], 10, pm));
  }
}, hr = /* @__PURE__ */ V(wm, [["__scopeId", "data-v-a37d4507"]]);
var pl;
/Mac|iPhone|iPad/.test(((pl = navigator.userAgentData) == null ? void 0 : pl.platform) || navigator.platform);
function mr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const $m = {
  class: "comment-box",
  "data-comment-box": ""
}, xm = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Sm = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Mm = { class: "comment-row" }, _m = ["placeholder"], Cm = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ qt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ qt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = A(""), r = A(!1), i = A(null), c = I(() => {
      var v;
      return ((v = a.selection) == null ? void 0 : v.selection_type) === "code";
    }), d = I(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      i.value.style.height = "auto", i.value.style.height = `${i.value.scrollHeight + 2}px`;
    }
    async function m() {
      const v = o.value.trim();
      if (!(!v || r.value)) {
        l.value = "", r.value = !0;
        try {
          await a.send(v), o.value = "", await Qe(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          r.value = !1;
        }
      }
    }
    return t({ focus: () => i.value.focus() }), (v, b) => (u(), f("div", $m, [
      e.selection ? (u(), f("div", xm, [
        b[3] || (b[3] = g("span", { class: "comment-on-label" }, "On this selection", -1)),
        g("span", {
          class: J(["comment-on-words", { mono: c.value }])
        }, y(e.selection.quote), 3),
        B(ia, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (x) => s("clear"))
        })
      ])) : S("", !0),
      l.value ? (u(), f("p", Sm, y(l.value), 1)) : S("", !0),
      g("div", Mm, [
        De(g("textarea", {
          ref_key: "box",
          ref: i,
          "onUpdate:modelValue": b[1] || (b[1] = (x) => o.value = x),
          rows: "1",
          maxlength: "2000",
          class: J({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = jt((x) => N(mr)(x, m), ["enter"]))
        }, null, 42, _m), [
          [_t, o.value]
        ]),
        B(de, {
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
}, Em = /* @__PURE__ */ V(Cm, [["__scopeId", "data-v-41d2081c"]]), An = (e) => e ? e.split(", ") : [];
function Am({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Om(e, t) {
  return {
    reads: An(e.reads_allowed),
    runs: An(e.runs_allowed),
    missing: [...An(e.reads_missing), ...An(e.runs_missing)],
    ask: t
  };
}
const Tm = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = Di("SkeletonParts", !0);
      return u(!0), f(W, null, te(e.parts, (i, c) => (u(), f(W, { key: c }, [
        (u(!0), f(W, null, te(i.count, (d) => (u(), H(zt, {
          key: d,
          value: i.shape
        }, {
          line: D(() => [
            B(Zt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            B(Zt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            B(Zt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            g("div", {
              class: "skeleton-row",
              style: ve(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: ve(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: ve(s(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Rm = /* @__PURE__ */ V(Tm, [["__scopeId", "data-v-fa8baeaf"]]), Im = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Bm = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", Im, [
      B(Rm, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ls = /* @__PURE__ */ V(Bm, [["__scopeId", "data-v-52f66b64"]]), pr = {
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
}, Lm = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: J(["badge", e.tone])
    }, y(e.text), 3));
  }
}, gr = /* @__PURE__ */ V(Lm, [["__scopeId", "data-v-9e7e1157"]]), Nm = ["aria-valuenow", "aria-valuemax"], Dm = {
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
    return (a, s) => (u(), f("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, Nm));
  }
}, qm = /* @__PURE__ */ V(Dm, [["__scopeId", "data-v-9eba6a85"]]), jm = { class: "bars" }, Pm = { class: "bar-name" }, Fm = { class: "bar-value" }, Wm = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), f("div", jm, [
      (u(!0), f(W, null, te(e.items, (i, c) => (u(), H(gt(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: J(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", Pm, y(i.label), 1),
          B(qm, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Fm, y(i.value) + y(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Hm = /* @__PURE__ */ V(Wm, [["__scopeId", "data-v-663427f4"]]), Um = { class: "bars" }, zm = {
  key: 0,
  class: "bars-title"
}, Vm = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Um, [
      e.node.title ? (u(), f("span", zm, y(e.node.title), 1)) : S("", !0),
      B(Hm, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Gm = /* @__PURE__ */ V(Vm, [["__scopeId", "data-v-7135bb11"]]), Km = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (u(), f("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (u(!0), f(W, null, te(e.node.children || [], (i, c) => (u(), H(Cr, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, qn = /* @__PURE__ */ V(Km, [["__scopeId", "data-v-d142a3f4"]]), Ym = {
  key: 0,
  class: "card-head"
}, Jm = { class: "card-title" }, Xm = {
  key: 0,
  class: "card-note"
}, Qm = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Ym, [
        g("span", Jm, y(e.node.title), 1),
        e.node.note ? (u(), f("span", Xm, y(e.node.note), 1)) : S("", !0)
      ])) : S("", !0),
      B(qn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Zm = /* @__PURE__ */ V(Qm, [["__scopeId", "data-v-67b72d40"]]), ep = { processes: "process", memories: "memory", replies: "reply" }, Kn = (e) => (ep[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ma = /* @__PURE__ */ new WeakMap();
function tp(e) {
  if (Ma.has(e)) return Ma.get(e);
  const t = qi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), m = e.read(`${Kn(c)} show ${d}`);
    n.set(h, m), m.then((v) => {
      n.get(h) === m && (n.delete(h), t.set(h, v.ok ? { ...v.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Kn(c).replace(/-/g, "_")}.*`], (d) => {
      const h = `${c}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(h)) continue;
        const v = Number(m.slice(h.length));
        (!d.row_id || d.row_id === v) && o(c, v);
      }
    }));
  }
  function r(c, d) {
    l(c);
    const h = s(c, d);
    return !t.has(h) && !n.has(h) && o(c, d), t.get(h);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return Ma.set(e, i), i;
}
function vr() {
  const e = Oe(qe, null), t = e ? tp(e) : null;
  return (n, a = {}) => dr(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const yr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, vn = (e) => String(e || "").replace(yr, (t, n, a, s) => s), np = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), On = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ap = /^Traceback \(most recent call last\):/m, sp = 8;
function br(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, sp).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function op(e) {
  const t = [...e.matchAll(np)].map((a) => a.index);
  if (On.lastIndex = 0, !t.length || !On.test(e)) return null;
  On.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(On)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: br(n), tail: "" } : null;
}
function lp(e) {
  const t = ap.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: br([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = vn(e), n = lp(t) || op(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Yn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, kr = (e) => `${e.table}:${e.id}`, wo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", _a = 80;
function $o(e) {
  return e.length <= _a ? e : `${e.slice(0, _a + 1).replace(/\s+\S*$/, "") || e.slice(0, _a)}…`;
}
const xo = {
  messages: (e) => $o(wo(e.text)),
  comments: (e) => $o(wo(e.text)),
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
}, rp = (e) => (xo[e.table] ? xo[e.table](e) : e.title || "") || "", Et = (e) => Yn(e.created_at), wr = (e) => Yn(e.updated_at) || Et(e), ip = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, up = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function cp(e) {
  const t = ip.exec(e);
  if (t && ht(t[1])) return { at: t.index, length: t[0].length, table: ht(t[1]), id: Number(t[2]), label: t[3] };
  const n = up.exec(e), a = n && ht(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function dp(e, t, n, a) {
  const s = rr(a, e, t), o = vn(s ? rp(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${st(Vt(e).title)} ${t}</span><span class="row-card-title">${st(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = cp(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: dp(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const fp = /\.(png|jpe?g|gif|webp|svg)$/i, hp = (e) => fp.test(e), mp = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, pp = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function gp(e, t) {
  const n = mp.exec(e), [, a, s, o, l, r] = n || [], i = n && ht(a || o), c = i && rr(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, h = `${Vt(i).title} ${c.id} · ${st(r)}`, m = hp(r) ? `<img class="file-card-image" src="${d}" alt="${st(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${st(r)}">${m}<span class="file-card-name">${h}</span></a>` };
}
function vp(e) {
  const t = pp.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${st(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = gp(e, t) || vp(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const yp = /`([^`\n]+)`/g;
At((e) => e.replace(yp, (t, n) => `<code>${n}</code>`));
const So = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Is.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(yr, (n, a, s, o) => So[a] ? So[a](s, o, t) : o)
);
const bp = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, $r = new RegExp(`\\b(${Kl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), xr = new RegExp(`\\b(${Kl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), kp = new RegExp(`<code>((?:${$r.source}|${xr.source}))</code>`, "gi"), wp = (e) => e.replace(kp, "$1"), $p = (e, t) => `<a class="row-pill" href="#" data-peek="${ht(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, xp = (e) => e.replace(xr, (t, n, a) => a.replace(/\d+/g, (s) => $p(n.replace(/s$/i, ""), s))), Sp = (e) => xp(e).replace(
  $r,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ht(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : wp(e).split(bp).map((n, a) => a % 2 ? n : Sp(n)).join("")
);
const Mp = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, _p = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Cp = /[\w\]]\(/, Ep = /^[\w$.[\]'"]+\s*=\s*[^=]/, Ap = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Op = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Tp = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Rp = /[[({,]$/, Ip = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Bp = /^(\t|\s{2,})\S/, Lp = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Np = /`[^`]+`/, Dp = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, qp = /[{}()[\];=<>$&|*\\@+^~%]/g, Sr = /^\s*(?:[-*+]|\d+[.)])\s/, jp = /^\s*>/, Pp = /^\s*\|/, Fp = 0.6, Wp = 0.4, Hp = 5, Up = 0.03, Mr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Hp && t.every((n) => Dp.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(qp) ?? []).length / e.length < Up;
}, Ca = (e) => {
  const t = e.trim();
  return Np.test(t) ? !1 : [Mp, _p, Cp, Ep, Ap, Op, Tp, Rp, Ip].some((n) => n.test(t)) || /[;{}]$/.test(t) || Bp.test(e) && !Sr.test(e) && !Mr(e);
};
function zp(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Sr.test(t[0]) || t.every((o) => jp.test(o) || Pp.test(o))) return "text";
  const n = t.filter((o) => !Lp.test(o.trim()));
  if (t.length === 1) return !n.length || Ca(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ca).length, s = n.filter((o) => !Ca(o) && Mr(o)).length;
  return a >= n.length * Fp && s <= n.length * Wp ? "code" : "text";
}
const is = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Vp = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Gp = `${is} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Kp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Yp = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Mo = {
  js: { keywords: is, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Vp, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Gp, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: is, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Kp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Yp, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Jp = {
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
function Xp(e, t) {
  const n = Mo[Jp[t] ?? t] || Mo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (_o(e, o, n.line) || n.hash && r === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && _o(e, o, n.block[0])) {
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
      const d = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(h) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function Qp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Xp(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? st(l) : `<span class="tok-${a}">${st(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Zp(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const e1 = 1500, Co = /* @__PURE__ */ new WeakMap();
async function t1(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Zp(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Co.get(t)), Co.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, e1)
  )));
}
typeof document < "u" && document.addEventListener("click", t1, !0);
const n1 = /\n\s*\n/, a1 = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, s1 = /^\s*(`{3,}|~{3,})\s*$/, o1 = /^\s{4,}\S/, l1 = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, us = /^\s*(?:[-*+]|\d+[.)])\s/, _r = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, r1 = [
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
function i1(e) {
  const t = Ns(e.join(`
`));
  return (r1.find(([, n]) => n.test(t)) || ["text"])[0];
}
const u1 = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && _r.test(t) && !us.test(t);
}, c1 = (e, t) => us.test(t) || us.test([...e].reverse().find((n) => n.trim()) || "");
function Ds(e, t) {
  const n = t || i1(e), a = Qp(Ns(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function d1(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && s1.test(s));
  return a < 0 ? e.length : a;
}
function f1(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ds(a.map(vn), n ? n.toLowerCase() : "");
}
function h1(e) {
  const t = e.split(n1).map((l) => ({ paragraph: l, type: zp(Ns(l).split(`
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
`).map(vn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function m1(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : h1(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(a1);
    if (r) {
      const c = d1(n, l, r[2]);
      o(), a.push(f1(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = u1(s) ? l1 : o1;
    if (!t && i.test(n[l]) && !c1(s, n[l])) {
      let c = l;
      for (; c < n.length && (i.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && _r.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Ds([...d, ...n.slice(l, c)].map(vn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => m1(e, t.document), { first: !0 });
const p1 = ["innerHTML"], g1 = ["innerHTML"], v1 = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = vr(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => N(Lt) && N(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, p1)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => N(Lt) && N(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, g1));
  }
}, xt = /* @__PURE__ */ V(v1, [["__scopeId", "data-v-d8e75741"]]), y1 = { class: "fact" }, b1 = { class: "fact-label" }, k1 = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", y1, [
      g("span", b1, y(e.label), 1),
      B(xt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, w1 = /* @__PURE__ */ V(k1, [["__scopeId", "data-v-3a88ecf8"]]), $1 = { class: "list" }, x1 = { class: "list-label" }, S1 = {
  key: 1,
  class: "list-note"
}, M1 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", $1, [
      (u(!0), f(W, null, te(e.items, (o, l) => (u(), H(gt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", x1, y(o.label), 1),
          o.badge ? (u(), H(gr, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : S("", !0),
          o.note ? (u(), f("span", S1, y(o.note), 1)) : S("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, _1 = /* @__PURE__ */ V(M1, [["__scopeId", "data-v-ebe2ae0a"]]), C1 = { class: "table" }, E1 = {
  key: 0,
  class: "table-row empty"
}, A1 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", C1, [
      g("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (u(!0), f(W, null, te(e.columns, (r) => (u(), f("span", {
          key: r,
          class: "cell"
        }, y(r), 1))), 128))
      ], 4),
      (u(!0), f(W, null, te(e.rows, (r, i) => (u(), H(gt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: J(["table-row", r.tone, { opens: r.open }]),
        style: ve(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: D(() => [
          (u(!0), f(W, null, te(r.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, y(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", E1, y(e.empty), 1)) : S("", !0)
    ]));
  }
}, O1 = /* @__PURE__ */ V(A1, [["__scopeId", "data-v-9326a52e"]]), T1 = { class: "stat-value" }, R1 = { class: "stat-label" }, I1 = {
  key: 0,
  class: "stat-note"
}, B1 = {
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
    return (a, s) => (u(), H(gt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        g("span", T1, y(e.value), 1),
        g("span", R1, y(e.label), 1),
        e.note ? (u(), f("span", I1, y(e.note), 1)) : S("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, L1 = /* @__PURE__ */ V(B1, [["__scopeId", "data-v-ad0db6d6"]]), N1 = { class: "code" }, D1 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), H(zt, {
      value: e.node.type
    }, {
      stack: D(() => [
        B(qn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        B(qn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        B(qn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        B(Zm, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        g("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, y(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        B(L1, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        B(Gm, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        B(O1, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        B(_1, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        B(xt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        B(w1, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        B(gr, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", N1, [
          g("code", null, y(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, y(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Cr = /* @__PURE__ */ V(D1, [["__scopeId", "data-v-cbdcf540"]]), q1 = { class: "dashboard" }, j1 = { class: "trail" }, P1 = ["onClick"], F1 = {
  key: 0,
  class: "gone",
  role: "status"
}, W1 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = A(!!n.page && !s(n.page)), l = A(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), c = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, h = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (u(), f("div", q1, [
      e.document.broken ? (u(), H(on, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ee(y(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), H(on, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ee(y(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), f(W, { key: 2 }, [
        g("nav", j1, [
          g("button", {
            type: "button",
            class: J(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (b) => h(0))
          }, y(c(e.document.start)), 3),
          (u(!0), f(W, null, te(l.value, (b, x) => (u(), f(W, {
            key: `${x}-${b}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: J(["step", { current: x === l.value.length - 1 }]),
              onClick: (E) => h(x + 1)
            }, y(c(b)), 11, P1)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", F1, "What you opened is no longer in this dashboard. Here is its start page.")) : S("", !0),
        B(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (u(), f("div", {
              key: r.value,
              class: "page"
            }, [
              B(Cr, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : S("", !0)
    ]));
  }
}, H1 = /* @__PURE__ */ V(W1, [["__scopeId", "data-v-fbe83734"]]);
function U1(e, t) {
  const n = Ue(), a = Ms(e, pr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Te(e), Xe(() => {
    s(), a.cancel();
  });
}
const z1 = {
  key: 0,
  class: "window-failure"
}, V1 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ue(), o = A(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? U1(l, n.events) : xs(l, () => !0, pr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), f("p", z1, y(o.value.error), 1)) : o.value ? (u(), H(H1, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : S("", !0);
  }
}, G1 = 1e4;
class K1 {
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
    return this.heardAt !== null && t - this.heardAt > G1;
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
const Y1 = {
  key: 0,
  class: "frame-note"
}, J1 = {
  key: 0,
  class: "frame-note"
}, X1 = ["src", "title"], Q1 = 1e3, Z1 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ue(), a = A(null), s = A(!1), o = A(!1);
    let l = null, r = 0;
    return Te(() => {
      l = new K1(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Q1);
    }), Le(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), f("p", Y1, "This window was closed because it stopped answering.")) : (u(), f(W, { key: 1 }, [
      s.value ? (u(), f("div", J1, [
        c[2] || (c[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        B(de, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: D(() => [...c[1] || (c[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : S("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: N(n).window
      }, null, 8, X1)
    ], 64));
  }
}, eg = /* @__PURE__ */ V(Z1, [["__scopeId", "data-v-32a49046"]]), tg = {
  class: "allowance-prompt",
  role: "dialog"
}, ng = { class: "allowance-prompt-text" }, ag = { class: "allowance-prompt-buttons" }, sg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", tg, [
      g("p", ng, y(N(Am)(e.request)), 1),
      g("div", ag, [
        B(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        B(de, {
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
}, og = /* @__PURE__ */ V(sg, [["__scopeId", "data-v-cad69fe2"]]), Ea = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(on, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        ee(y(e.reason) + " ", 1),
        e.retry ? (u(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : S("", !0),
        e.removable ? (u(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : S("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lg = ["data-window", "data-agent"], rg = {
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
    const n = e, a = t, s = A(""), o = A(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(uc, null), i = id({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: Oe(ad, null),
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
    gl(qe, i), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Te(i.settle), Le(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), ji((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => aa(n.component), d = () => {
      var h, m;
      return ((m = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, m) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), H(og, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : S("", !0),
      e.unavailableReason ? (u(), H(Ea, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), H(Ea, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(W, { key: 4 }, [
        (u(), H(c, { key: o.value })),
        e.skeleton.length && !N(i).answered.value ? (u(), H(Ls, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : S("", !0)
      ], 64)) : (u(), H(Ea, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, lg));
  }
}, en = /* @__PURE__ */ V(rg, [["__scopeId", "data-v-c4443e2b"]]), Er = {
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
    const n = e, a = t, s = { render: () => aa(eg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), H(en, {
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
}, ig = ["data-window"], Ar = {
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
    const n = e, a = t, s = Ye(null), o = A("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Eu();
          } catch (r) {
            if (_u(r) && Cu(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      B(Ls, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, ig)) : (u(), H(en, {
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
}, ug = {
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
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => aa(V1, { line: s.value.line, events: s.value.events }) }), l = A(null), r = I(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = I(
      () => {
        var m, v;
        return l.value ? Om(l.value, h) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function h() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return pe(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), c.value.missing.length && !r.value && h();
      },
      { immediate: !0 }
    ), (m, v) => {
      var b, x;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), H(Ls, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((x = s.value) == null ? void 0 : x.shows) === "one-agent" && e.agent === null ? (u(), H(on, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), H(en, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), H(Ar, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (E, _) => n("option", E, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), H(Er, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (E, _) => n("option", E, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), H(en, {
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
        onOption: v[2] || (v[2] = (E, _) => n("option", E, _))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), H(en, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (E) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, cg = ["data-section"], dg = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, fg = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Dl, null), a = I(() => {
      const o = t.names.map((r) => ({ name: r, offered: !!(n != null && n.catalogue.window(r)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((r) => !t.names.includes(r.name));
      return [...o, ...l.map((r) => ({ name: r.name, offered: !0 }))];
    }), s = I(() => ({ row: t.row }));
    return (o, l) => N(n) ? (u(!0), f(W, { key: 0 }, te(a.value, (r) => (u(), f("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      r.offered ? (u(), H(ug, {
        key: 0,
        name: r.name,
        catalogue: N(n).catalogue,
        subscriptions: N(n).subscriptions,
        environment: N(n).environment,
        prompts: N(n).prompts,
        "shell-read": N(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", dg, y(r.name) + " is not available", 1))
    ], 8, cg))), 128)) : S("", !0);
  }
}, Or = /* @__PURE__ */ V(fg, [["__scopeId", "data-v-a47d36b7"]]), hg = { class: "rail-head" }, mg = { key: 0 }, pg = {
  key: 1,
  class: "rail-none"
}, gg = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: J(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      g("div", hg, [
        n[0] || (n[0] = g("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", mg, y(e.total || e.comments.length), 1)) : S("", !0)
      ]),
      e.comments.length ? (u(!0), f(W, { key: 0 }, te(e.comments, (a) => (u(), H(hr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", pg, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, vg = /* @__PURE__ */ V(gg, [["__scopeId", "data-v-4d684649"]]), yg = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, bg = ["aria-pressed"], kg = ["aria-pressed"], wg = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, $g = {
  key: 0,
  role: "alert"
}, xg = {
  key: 1,
  class: "sidebar-none"
}, Sg = ["data-question-id"], Mg = { class: "question-state" }, _g = ["data-question-show", "onClick"], Cg = {
  key: 0,
  class: "sidebar-none"
}, Eg = {
  key: 1,
  class: "question-answer"
}, Ag = {
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
    const t = Oe(Dl, null);
    return (n, a) => (u(), f("div", {
      class: J(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      g("nav", yg, [
        g("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, bg),
        g("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, kg)
      ]),
      e.mode === "comments" ? (u(), f(W, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), H(vg, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : S("", !0),
        B(pn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", wg, [
        e.failure ? (u(), f("p", $g, y(e.failure), 1)) : e.questions.length ? S("", !0) : (u(), f("p", xg, "No questions about this text yet.")),
        (u(!0), f(W, null, te(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: J(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            g("span", Mg, y(N(As)("question", s.state)), 1),
            g("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, y(s.text), 9, _g),
            s.quote ? (u(), f(W, { key: 0 }, [
              g("blockquote", null, y(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Cg, "The quoted text has changed.")) : S("", !0)
            ], 64)) : S("", !0),
            s.answer ? (u(), f("p", Eg, "Answered: " + y(s.answer), 1)) : S("", !0),
            B(Or, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            B(Yl, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = N(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Sg);
        }), 128))
      ]))
    ], 2));
  }
}, Eo = /* @__PURE__ */ V(Ag, [["__scopeId", "data-v-2718a08d"]]), Og = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Tg = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = A("");
    async function l() {
      const r = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = r.ok ? "" : r.error, r.ok && a("saved");
    }
    return (r, i) => (u(), H(ua, {
      title: "Edit the document",
      wide: "",
      onClose: i[3] || (i[3] = (c) => a("close"))
    }, {
      foot: D(() => [
        g("span", Og, y(o.value), 1),
        B(de, {
          onClick: i[2] || (i[2] = (c) => a("close"))
        }, {
          default: D(() => [...i[6] || (i[6] = [
            ee("Cancel", -1)
          ])]),
          _: 1
        }),
        B(de, {
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
        g("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: xe(l, ["prevent"])
        }, [
          g("label", null, [
            i[4] || (i[4] = g("span", null, "Abstract", -1)),
            De(g("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (c) => s.abstract = c)
            }, null, 512), [
              [_t, s.abstract]
            ])
          ]),
          g("label", null, [
            i[5] || (i[5] = g("span", null, "Text", -1)),
            De(g("textarea", {
              "onUpdate:modelValue": i[1] || (i[1] = (c) => s.body = c),
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
}, Rg = /* @__PURE__ */ V(Tg, [["__scopeId", "data-v-e99f14e0"]]);
function Tr(e, t) {
  const n = A([]), a = A(!1), s = A(null), o = A(0), l = A(!1), r = A("");
  let i = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: x, id: E, title: _ } = e(), q = `On ${x} ${E}, ${_}: `;
    return b.text.startsWith(q) ? b.text.slice(q.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: x, id: E } = e();
    if (!E) return;
    const _ = ++c;
    l.value = !0, r.value = "";
    try {
      const q = await t([x, "comments", String(E), "--page", String(b), "--page-size", "25"]);
      if (_ !== c) return;
      if (!q.ok) {
        r.value = q.error;
        return;
      }
      const U = q.value.rows ?? [], j = b === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(j.map((L) => [L.id, L])).values()], o.value = q.value.total ?? n.value.length, s.value = q.value.next_page ?? null;
    } catch (q) {
      _ === c && (r.value = q.message);
    } finally {
      _ === c && (l.value = !1);
    }
  }
  async function m(b) {
    var L;
    const { noun: x, id: E } = e(), _ = `${x}:${E}`, q = { id: `sending-${++i}`, text: b };
    n.value = [...n.value, q], o.value++, a.value = !0;
    const U = await t([x, "comment", String(E), b]);
    if (_ !== `${e().noun}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((P) => P.id !== q.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await h();
    const j = (L = U.value) == null ? void 0 : L.id;
    j && !n.value.some((P) => P.id === j) && (n.value = [...n.value, { ...q, id: j }]);
  }
  const v = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: h, loadMore: v, nextPage: s, total: o, loading: l, failure: r };
}
function Ig(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let i = n.length - 1; i >= 0; i -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[i][c] = n[i] === a[c] ? s[i + 1][c + 1] + 1 : Math.max(s[i + 1][c], s[i][c + 1]);
  const o = [];
  let l = 0, r = 0;
  for (; l < n.length || r < a.length; )
    l < n.length && r < a.length && n[l] === a[r] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, r += 1) : r < a.length && (l === n.length || s[l][r + 1] >= s[l + 1][r]) ? (o.push({ key: `new:${r}`, type: "added", text: a[r] }), r += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const Bg = {
  class: "document-tab",
  "data-document-revisions": ""
}, Lg = ["datetime"], Ng = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Dg = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, qg = {
  key: 2,
  class: "document-none"
}, jg = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), o = A(""), l = I(() => s.value ? Ig(s.value.body, n.text) : []);
    async function r(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function i() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Bg, [
      e.editing ? (u(), H(de, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: D(() => [...d[1] || (d[1] = [
          ee("Close the open revision", -1)
        ])]),
        _: 1
      })) : S("", !0),
      e.revisions.length ? (u(), f(W, { key: 1 }, [
        (u(!0), f(W, null, te(e.revisions, (h) => (u(), H(de, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (m) => r(h)
        }, {
          default: D(() => [
            ee("Revision " + y(h.number) + ": " + y(h.change) + " · " + y(h.author_name) + " · ", 1),
            g("time", {
              datetime: h.created_at
            }, y(h.created_at.slice(0, 16).replace("T", " ")), 9, Lg)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", Ng, y(o.value), 1)) : S("", !0),
        s.value ? (u(), f(W, { key: 1 }, [
          B(de, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: i
          }, {
            default: D(() => [...d[2] || (d[2] = [
              ee("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          g("div", Dg, [
            (u(!0), f(W, null, te(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: J(["revision-line", h.type])
            }, y(h.text || " "), 3))), 128))
          ])
        ], 64)) : S("", !0)
      ], 64)) : (u(), f("p", qg, "No revisions"))
    ]));
  }
}, Pg = /* @__PURE__ */ V(jg, [["__scopeId", "data-v-3a381aa4"]]), Fg = "button, [data-comment-number]", Wg = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Rr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Fg) || n.push(t.currentNode);
  return n;
}
function Ao(e, t, n) {
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
const Hg = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Ug(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Rr(e), s = a.map((c) => c.data).join(""), o = Ao(a, n.startContainer, n.startOffset), l = s.slice(o, Ao(a, n.endContainer, n.endOffset)), r = l.trim();
  if (!r) return null;
  const i = n.commonAncestorContainer;
  return { quote: r, position: o + l.indexOf(r), selection_type: Hg(i.nodeType === Node.TEXT_NODE ? i.parentElement : i) };
}
function zg(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Vg(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), r = Math.min(n - s, o.data.length);
    l < r && a.push({ node: o, from: l, to: r }), s += o.data.length;
  }
  return a;
}
function Aa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Gg({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Kg(e, t) {
  const n = Rr(e), a = zg(n.map((r) => r.data).join(""), t);
  if (a < 0) return !1;
  const s = Vg(n, a, a + t.quote.length), o = (r) => r.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Gg).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const r of l)
    r.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && r.classList.add("hot"), t.id && (r.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Aa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Aa(t.number, t.id, t.label)) : l.at(-1).append(Aa(t.number, t.id, t.label))), !0;
}
function Yg(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Kg(e, a) && a.id && n.push(a.id);
  return n;
}
const Jg = (e) => e.closest(Wg) ?? e;
function Oo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Xg = {
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
    const a = e, s = n, o = A(null), l = A(null), r = A(null), i = A(!1), c = A(null);
    function d() {
      if (!l.value || i.value) return;
      l.value.innerHTML = a.html;
      const x = a.comments.filter((U) => U.quote).map((U) => ({ ...U, label: a.annotationLabel, hot: U.id === a.hot })), E = Yg(l.value, a.pending ? [...x, { ...a.pending, pending: !0 }] : x);
      s("lost", E);
      const _ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!_) {
        c.value = null;
        return;
      }
      const q = document.createElement("div");
      q.className = "inline-comment", Jg(_).after(q), c.value = q;
    }
    function h() {
      if (!l.value) return;
      const x = Ug(l.value);
      if (i.value = !!x, !x) {
        r.value = null;
        return;
      }
      const E = window.getSelection().getRangeAt(0).getBoundingClientRect(), _ = o.value.getBoundingClientRect();
      r.value = { left: `${Math.max(E.left - _.left, 0)}px`, top: `${E.top - _.top + o.value.scrollTop}px` }, s("select", x);
    }
    function m(x) {
      const E = x.target.closest("[data-comment-number]");
      E ? s("number", Number(E.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function v(x) {
      var E;
      (E = l.value.querySelector(`[data-comment="${x}"]`)) == null || E.scrollIntoView({ block: "center" });
    }
    function b(x) {
      var E;
      (E = l.value.querySelectorAll("h3, h4, h5, h6")[x]) == null || E.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, i.value, a.pending], d, { flush: "post" }), Te(() => {
      d(), document.addEventListener("selectionchange", h);
    }), Xe(() => document.removeEventListener("selectionchange", h)), t({ show: v, showHeading: b, nextTick: Qe }), (x, E) => (u(), f("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      g("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: m
      }, null, 512),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ve(r.value),
        "data-comment-pill": "",
        onMousedown: E[0] || (E[0] = xe(() => {
        }, ["prevent"])),
        onClick: E[1] || (E[1] = (_) => s("write"))
      }, [
        B(ye, {
          name: "chat",
          size: 13
        }),
        E[2] || (E[2] = ee("Comment on this", -1))
      ], 36)) : S("", !0),
      c.value ? (u(), H(oa, {
        key: 1,
        to: c.value
      }, [
        me(x.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : S("", !0),
      me(x.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Qg = /* @__PURE__ */ V(Xg, [["__scopeId", "data-v-548d0aaa"]]), Zg = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, ev = { class: "document-tabs" }, tv = { class: "document-body" }, nv = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, av = {
  key: 1,
  class: "document-loading"
}, sv = {
  class: "document-details",
  "data-resource-fields": ""
}, ov = 760, lv = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = mm(n), s = I(() => a.value !== null && a.value < ov), o = A(null), l = A(""), r = A([]), i = A([]), c = A(""), d = A("comments"), h = A("text"), m = A(0), v = A(0), b = A([]), x = A(null), E = A(""), _ = A(!1), q = A(null), U = A(null);
    let j = 0;
    const L = Tr(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), P = I(() => Oo(L.comments.value)), O = I(() => d.value === "questions" ? Oo(i.value) : P.value), T = I(() => d.value === "questions" ? O.value.length : L.total.value), $ = I(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? dr(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), k = I(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, ae) => ({ key: String(ae), value: ae, label: Z.replace(/^#+ /, "") }));
    }), w = I(() => P.value.find((fe) => fe.id === v.value)), p = I(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), M = I(() => h.value === "comments" && !s.value ? "text" : h.value), C = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function R() {
      const fe = ++j, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== j) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), oe = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === j && (i.value = C(ae), c.value = ae.ok ? "" : ae.error, r.value = oe ? C(oe) : []);
    }
    async function F(fe) {
      const Z = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], ae = await t.read([t.noun, "comment", String(t.id), ...Z, "--", fe]);
      if (!ae.ok) throw new Error(ae.error);
      x.value = null, await Promise.all([R(), L.load()]);
    }
    async function Q() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await R();
    }
    function se() {
      E.value.trim() || (x.value = null);
    }
    function ie(fe) {
      var Z;
      if (m.value = fe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? v.value = v.value === fe ? 0 : fe : (Z = n.value.querySelector(d.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function ge(fe) {
      var Z, ae;
      h.value = "text", m.value = fe, await ((Z = q.value) == null ? void 0 : Z.nextTick()), (ae = q.value) == null || ae.show(fe);
    }
    function Ee() {
      _.value = !1, R();
    }
    return pe(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", m.value = 0, v.value = 0, x.value = null, i.value = [], c.value = "", R();
    }, { immediate: !0 }), pe(d, () => {
      m.value = 0, v.value = 0;
    }), (fe, Z) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", Zg, [
        B(de, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (ae) => _.value = !0)
        }, {
          default: D(() => [...Z[14] || (Z[14] = [
            ee("Edit", -1)
          ])]),
          _: 1
        })
      ])) : S("", !0),
      g("nav", ev, [
        g("button", {
          type: "button",
          class: J(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (ae) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: J(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (ae) => h.value = "comments")
        }, [
          ee(y(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          g("em", null, y(T.value || ""), 1)
        ], 2)) : S("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: J(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (ae) => h.value = "revisions")
        }, [
          Z[15] || (Z[15] = ee("Revisions ", -1)),
          g("em", null, y(r.value.length || ""), 1)
        ], 2)) : S("", !0),
        Z[16] || (Z[16] = g("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && k.value.length > 1 ? (u(), H(fr, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: k.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (ae) => {
            var oe;
            return (oe = q.value) == null ? void 0 : oe.showHeading(ae.value);
          })
        }, null, 8, ["label", "items"])) : S("", !0)
      ]),
      g("div", tv, [
        l.value ? (u(), f("p", nv, y(l.value), 1)) : o.value ? M.value === "revisions" ? (u(), H(Pg, {
          key: 2,
          id: e.id,
          revisions: r.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Q,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (u(), H(Eo, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": Z[5] || (Z[5] = (ae) => d.value = ae),
          tab: "",
          comments: P.value,
          questions: i.value,
          hot: m.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!N(L).nextPage.value,
          "comment-loading": N(L).loading.value,
          "comment-failure": N(L).failure.value,
          "comment-total": N(L).total.value,
          onMore: N(L).loadMore,
          onShow: ge,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(W, { key: 4 }, [
          B(Qg, {
            ref_key: "words",
            ref: q,
            html: $.value,
            comments: O.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: m.value,
            pending: x.value,
            inline: v.value,
            onSelect: Z[7] || (Z[7] = (ae) => x.value = ae),
            onClear: se,
            onNumber: ie,
            onWrite: Z[8] || (Z[8] = (ae) => {
              var oe;
              return (oe = U.value) == null ? void 0 : oe.focus();
            }),
            onLost: Z[9] || (Z[9] = (ae) => b.value = ae)
          }, {
            inline: D(() => [
              w.value ? (u(), H(hr, {
                key: 0,
                comment: w.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (ae) => ge(w.value.id))
              }, null, 8, ["comment"])) : S("", !0)
            ]),
            default: D(() => [
              g("dl", sv, [
                Z[18] || (Z[18] = g("h4", null, "Details", -1)),
                Z[19] || (Z[19] = g("dt", null, "State", -1)),
                g("dd", null, y(p.value), 1),
                o.value.close_reason ? (u(), f(W, { key: 0 }, [
                  Z[17] || (Z[17] = g("dt", null, "Why closed", -1)),
                  g("dd", null, y(o.value.close_reason), 1)
                ], 64)) : S("", !0),
                Z[20] || (Z[20] = g("dt", null, "Created", -1)),
                g("dd", null, [
                  B(Je, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = g("dt", null, "Updated", -1)),
                g("dd", null, [
                  B(Je, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? S("", !0) : (u(), H(Eo, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": Z[10] || (Z[10] = (ae) => d.value = ae),
            comments: P.value,
            questions: i.value,
            hot: m.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!N(L).nextPage.value,
            "comment-loading": N(L).loading.value,
            "comment-failure": N(L).failure.value,
            "comment-total": N(L).total.value,
            onMore: N(L).loadMore,
            onShow: ge,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", av, [
          B(lt)
        ]))
      ]),
      o.value ? (u(), H(Em, {
        key: 1,
        ref_key: "composer",
        ref: U,
        draft: E.value,
        "onUpdate:draft": Z[11] || (Z[11] = (ae) => E.value = ae),
        selection: x.value,
        send: F,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (ae) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : S("", !0),
      _.value ? (u(), H(Rg, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (ae) => _.value = !1),
        onSaved: Ee
      }, null, 8, ["noun", "id", "row", "read"])) : S("", !0)
    ], 512));
  }
}, s8 = /* @__PURE__ */ V(lv, [["__scopeId", "data-v-784faf41"]]), rv = {
  key: 1,
  class: "row-list-failure"
}, iv = ["data-row"], uv = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = A(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), H(lt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", rv, y(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), H(on, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        ee(y(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(W, { key: 3 }, [
      (u(), H(gt(e.arrival ? vl : "ul"), Ne(n.value, { class: "row-list" }), {
        default: D(() => [
          (u(!0), f(W, null, te(e.rows, (r) => (u(), f("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            me(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, iv))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : S("", !0)
    ], 64));
  }
}, cv = /* @__PURE__ */ V(uv, [["__scopeId", "data-v-6c7ba696"]]), dv = {
  class: "agent-rows",
  "data-agent-rows": ""
}, fv = {
  key: 1,
  class: "agent-rows-note"
}, hv = {
  key: 2,
  class: "agent-rows-note"
}, mv = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, pv = ["data-agent-row", "onClick"], gv = { class: "agent-row-name" }, vv = { class: "agent-row-state" }, yv = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", dv, [
      e.loaded ? e.failure ? (u(), f("p", fv, y(e.failure), 1)) : e.rows.length ? (u(), f(W, { key: 3 }, [
        g("p", mv, y(a.value) + " running", 1),
        (u(!0), f(W, null, te(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => N(He)(`agents:${l.id}`)
        }, [
          g("span", gv, "#" + y(l.id) + " " + y(l.session), 1),
          g("span", vv, y(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, pv))), 128))
      ], 64)) : (u(), f("p", hv, y(e.none), 1)) : (u(), H(lt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, o8 = /* @__PURE__ */ V(yv, [["__scopeId", "data-v-a01e5a17"]]), ut = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, We = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Fe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, bv = 6;
function qs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const kv = (e) => {
  const t = qs(e, ut.lineChars), n = Math.max(ut.minWidth, Math.max(...t.map((a) => a.length)) * ut.charWidth + ut.padX * 2);
  return { name: e, lines: t, line: ut.line, padY: ut.padY, width: n, height: t.length * ut.line + ut.padY * 2 };
};
function wv(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function $v(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function xv(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), c = (d) => {
      const h = r(d).map((m) => i.get(m));
      return h.length ? h.reduce((m, v) => m + v, 0) / h.length : i.get(d);
    };
    return [...l].sort((d, h) => c(d) - c(h));
  };
  for (let l = 0; l < bv; l++) {
    const r = l % 2 === 0, i = a.map((c, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((m) => m[r ? 1 : 0] === h).map((m) => m[r ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Sv(e, t) {
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
function Mv(e) {
  const t = [...new Set(e.flatMap(([j, L]) => [j, L]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = wv(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, L) => !s.has(L)), l = $v(t, o), r = xv(t, o, l), i = new Map(t.map((j) => [j, kv(j)])), c = r.map((j) => j.reduce((L, P) => L + i.get(P).width, 0) + Fe.across * (j.length - 1)), d = Math.max(...c) + Fe.margin * 2, h = Cv(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Fe.margin;
  r.forEach((j, L) => {
    let P = (d - c[L]) / 2;
    const O = Math.max(...j.map((T) => i.get(T).height));
    j.forEach((T) => {
      const $ = i.get(T);
      m.set(T, { ...$, x: P, y: v + (O - $.height) / 2 }), P += $.width + Fe.across;
    }), v += O + (h[L] ?? Fe.down);
  });
  const b = e.map(([j, L, P], O) => ({ from: j, to: L, label: P || "", back: s.has(O) || l.get(L) <= l.get(j) }));
  Sv(b, m);
  const x = b.map((j) => Ev(j, m.get(j.from), m.get(j.to))), E = [...m.values()], _ = Rv(x, E), q = Math.max(v - Fe.down, ..._.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(d - Fe.margin, ..._.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Fe.margin, height: q + Fe.margin, nodes: E, arrows: _ };
}
const _v = (e) => e ? qs(e, We.lineChars).length * We.line + We.pad * 2 : 0;
function Cv(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Fe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += _v(l) + Fe.labelSpace);
  }), a.map((s) => Math.max(Fe.down, s));
}
function Ev(e, t, n) {
  const a = e.label ? qs(e.label, We.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * We.charWidth + We.pad * 2 : 0, o = a.length * We.line + (a.length ? We.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - r) / 2, h = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: c - d }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${r} C${l} ${r + d} ${i} ${c - d} ${i} ${c}` };
}
const Av = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Ov = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Tv = [0, -1, 1, -2, 2, -3, 3].map((e) => e * We.line);
function Rv(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const d = Av(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = Tv.flatMap((i) => Ov.map((c) => s(c, i))).find((i) => !n.some((c) => To(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => To(r, i)); ) r.y += We.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: We.line, pad: We.pad } };
  });
}
const To = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Iv = { class: "flowchart-tools" }, Bv = ["width", "height", "viewBox", "aria-label"], Lv = ["d"], Nv = ["x", "y", "width", "height"], Dv = ["x", "y"], qv = ["x", "dy"], jv = {
  key: 0,
  class: "flowchart-label"
}, Pv = ["x", "y", "width", "height"], Fv = ["x", "y"], Wv = ["x", "dy"], Hv = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Mv(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = A(null), r = A({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var _;
      const x = (_ = l.value) == null ? void 0 : _.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const E = Math.min(x.width / s.value.width, x.height / s.value.height, 1.5);
      r.value = { zoom: E, x: (x.width - s.value.width * E) / 2, y: (x.height - s.value.height * E) / 2 };
    }
    function d(x, E, _) {
      const { zoom: q, x: U, y: j } = r.value, L = Math.min(o.most, Math.max(o.least, q * x));
      r.value = { zoom: L, x: E - (E - U) * L / q, y: _ - (_ - j) * L / q };
    }
    function h(x) {
      const E = l.value.getBoundingClientRect();
      d(x, E.width / 2, E.height / 2);
    }
    function m(x) {
      const E = l.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - E.left, x.clientY - E.top) : r.value = { ...r.value, x: r.value.x - x.deltaX, y: r.value.y - x.deltaY };
    }
    function v(x) {
      var E, _, q;
      x.preventDefault(), (E = window.getSelection()) == null || E.removeAllRanges(), i = { x: x.clientX - r.value.x, y: x.clientY - r.value.y }, (q = (_ = l.value).setPointerCapture) == null || q.call(_, x.pointerId);
    }
    function b(x) {
      i && (r.value = { ...r.value, x: x.clientX - i.x, y: x.clientY - i.y });
    }
    return Te(c), (x, E) => (u(), H(ua, {
      title: e.title,
      large: "",
      onClose: E[4] || (E[4] = (_) => a("close"))
    }, {
      default: D(() => [
        g("div", Iv, [
          B(de, {
            small: "",
            onClick: E[0] || (E[0] = (_) => h(o.step))
          }, {
            default: D(() => [...E[5] || (E[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          B(de, {
            small: "",
            onClick: E[1] || (E[1] = (_) => h(1 / o.step))
          }, {
            default: D(() => [...E[6] || (E[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          B(de, {
            small: "",
            onClick: c
          }, {
            default: D(() => [...E[7] || (E[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: b,
          onPointerup: E[2] || (E[2] = (_) => eo(i) ? i.value = null : i = null),
          onPointercancel: E[3] || (E[3] = (_) => eo(i) ? i.value = null : i = null)
        }, [
          (u(), f("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ve({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            E[8] || (E[8] = g("defs", null, [
              g("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                g("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (u(!0), f(W, null, te(s.value.arrows, (_, q) => (u(), f("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: _.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Lv))), 128)),
            (u(!0), f(W, null, te(s.value.nodes, (_) => (u(), f("g", {
              key: _.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: _.x,
                y: _.y,
                width: _.width,
                height: _.height,
                rx: "8"
              }, null, 8, Nv),
              g("text", {
                x: _.x + _.width / 2,
                y: _.y + _.padY + _.line / 2
              }, [
                (u(!0), f(W, null, te(_.lines, (q, U) => (u(), f("tspan", {
                  key: U,
                  x: _.x + _.width / 2,
                  dy: U ? _.line : 0
                }, y(q), 9, qv))), 128))
              ], 8, Dv)
            ]))), 128)),
            (u(!0), f(W, null, te(s.value.arrows, (_, q) => (u(), f(W, {
              key: `label-${q}`
            }, [
              _.label ? (u(), f("g", jv, [
                g("rect", {
                  x: _.label.x,
                  y: _.label.y,
                  width: _.label.width,
                  height: _.label.height,
                  rx: "4"
                }, null, 8, Pv),
                g("text", {
                  x: _.label.x + _.label.width / 2,
                  y: _.label.y + _.label.pad + _.label.line / 2
                }, [
                  (u(!0), f(W, null, te(_.label.lines, (U, j) => (u(), f("tspan", {
                    key: j,
                    x: _.label.x + _.label.width / 2,
                    dy: j ? _.label.line : 0
                  }, y(U), 9, Wv))), 128))
                ], 8, Fv)
              ])) : S("", !0)
            ], 64))), 128))
          ], 12, Bv))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Uv = /* @__PURE__ */ V(Hv, [["__scopeId", "data-v-51d24cfe"]]), Ro = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Io = {
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
  agent: Ro,
  worker: Ro,
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
}, zv = ["innerHTML"], Vv = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Io[t.name] || Io.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, zv));
  }
}, pt = /* @__PURE__ */ V(Vv, [["__scopeId", "data-v-beb5935c"]]), Gv = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      B(pt, { name: "fold" })
    ], 2));
  }
}, Mt = /* @__PURE__ */ V(Gv, [["__scopeId", "data-v-d03899bb"]]), Kv = ["data-tip", "aria-label"], Yv = {
  key: 0,
  class: "mact-word"
}, Jv = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      B(pt, { name: "open" }),
      e.open ? (u(), f("span", Yv, y(e.label), 1)) : S("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Kv));
  }
}, Ir = /* @__PURE__ */ V(Jv, [["__scopeId", "data-v-3b292e09"]]), Br = 120, jn = 280, Lr = 160, Xv = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Qv = ["leaving", "resizing", "entering"];
function cs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Zv(e) {
  const t = Qv.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = cs(e);
  return e.classList.add(...t), n;
}
function Nr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = A(t()), s = A("");
  let o = 0;
  const l = (h, m) => Object.assign(h.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function i(h, m) {
    r(h);
    const v = Zv(h);
    l(h, m), h.offsetWidth, h.style.transition = `width ${jn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${jn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, v);
  }
  function c(h) {
    const m = h.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const b = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(h, cs(h)));
    });
    return b.observe(m), b;
  }
  async function d(h) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || Xv()) {
      a.value = h;
      return;
    }
    const b = cs(m);
    if (l(m, b), s.value = "leaving", await n(Br), v !== o) return;
    a.value = h, s.value = "resizing", await Qe(), i(m, b);
    const x = c(m);
    await n(jn), x == null || x.disconnect(), v === o && (r(m), s.value = "entering", await n(Lr), v === o && (s.value = ""));
  }
  return pe(t, (h) => d(h)), Xe(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const e0 = { class: "growing-card-top" }, t0 = ["aria-expanded"], n0 = { class: "growing-card-avatar" }, a0 = { class: "growing-card-title" }, s0 = { class: "growing-card-more" }, o0 = { class: "growing-card-body" }, l0 = {
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
    const n = e, a = t, s = A(!1), o = A(null), { folded: l, phase: r } = Nr(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", N(r), { open: !N(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", e0, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (m) => s.value = !s.value)
        }, [
          g("span", n0, [
            e.bad ? (u(), H(pt, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), f(W, { key: 1 }, [
              ee(y(i.value), 1)
            ], 64)) : (u(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", a0, y(e.title), 1),
          B(Mt, { open: s.value }, null, 8, ["open"])
        ], 8, t0),
        e.action ? (u(), H(Ir, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : S("", !0),
        e.commentable ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (m) => a("comment"))
        }, [
          B(ye, {
            name: "bubble",
            size: 13
          })
        ])) : S("", !0)
      ]),
      g("div", s0, [
        g("div", o0, [
          (u(!0), f(W, null, te(c.value, (m, v) => (u(), f("p", {
            key: v,
            class: "growing-card-text"
          }, y(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, r0 = /* @__PURE__ */ V(l0, [["__scopeId", "data-v-f2b4930d"]]), i0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, u0 = { class: "md inline" }, c0 = ["disabled", "title", "onClick"], d0 = {
  key: 1,
  class: "message-links-many"
}, f0 = ["aria-expanded"], h0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, m0 = ["disabled", "onClick"], p0 = { class: "row-pill message-links-chip" }, g0 = { class: "message-links-title" }, v0 = { key: 0 }, Oa = 3, y0 = "task", b0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === y0) ? "tasks" : "items"), l = A(!1), r = A(null);
    Rl(r, () => l.value = !1);
    const i = () => l.value = !l.value, c = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(m) {
      c(m) || (l.value = !1, He(m.endpoint.open_ref));
    }
    return (m, v) => (u(), f("div", {
      ref_key: "line",
      ref: r,
      class: J(["message-links", { many: s.value > Oa, three: s.value === Oa, open: l.value }]),
      "data-message-links": ""
    }, [
      B(pt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", i0, [
        g("span", u0, [
          v[1] || (v[1] = ee("Linked: ", -1)),
          (u(!0), f(W, null, te(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (x) => h(b)
          }, [
            ee(y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
            d(b) ? (u(), f(W, { key: 0 }, [
              ee(" (" + y(d(b)) + ")", 1)
            ], 64)) : S("", !0),
            c(b) ? (u(), f(W, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : S("", !0)
          ], 8, c0))), 128))
        ])
      ])) : S("", !0),
      s.value >= Oa ? (u(), f("span", d0, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee(y(s.value) + " linked " + y(o.value) + " ", 1),
          B(Mt, { open: l.value }, null, 8, ["open"])
        ], 8, f0)
      ])) : S("", !0),
      l.value ? (u(), f("div", h0, [
        (u(!0), f(W, null, te(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (x) => h(b)
        }, [
          g("span", p0, y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
          g("span", g0, y(b.endpoint.title), 1),
          g("span", null, y(d(b)), 1),
          c(b) ? (u(), f("span", v0, "Unavailable")) : S("", !0)
        ], 8, m0))), 128))
      ])) : S("", !0),
      B(pn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: v[0] || (v[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, k0 = /* @__PURE__ */ V(b0, [["__scopeId", "data-v-e9bc783c"]]), w0 = ["title", "aria-label"], $0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, x0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, S0 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: J(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", $0, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", x0)) : S("", !0)
      ]))
    ], 10, w0));
  }
}, M0 = /* @__PURE__ */ V(S0, [["__scopeId", "data-v-6dc92808"]]), _0 = "img,pre,table";
function C0(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function E0(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function A0(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(_0)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = C0(E0(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function O0(e, t) {
  let n = null;
  const a = () => e.value && A0(e.value);
  Te(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const T0 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function R0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Tn = /* @__PURE__ */ new WeakMap(), Ke = "work", Jt = "sent", I0 = 50, Bo = () => ({ rows: A([]), total: A(0), next: A(null), loading: A(!1), failure: A(""), version: 0 });
function B0(e) {
  var h;
  if (Tn.has(e)) return Tn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var v;
    return ((v = e.visible) == null ? void 0 : v.value) !== !1 && [...m.views].some((b) => b.visible);
  };
  async function o(m, v, b = 1) {
    const x = m[v], E = ++x.version;
    x.loading.value = !0, x.failure.value = "";
    const _ = v === Ke ? "--type about --type edited --group-counterparts" : "--type sent_to", q = `link list --source message:${m.id} ${_} --page ${b} --page-size ${v === Ke ? 10 : 25}`;
    try {
      const U = await e.read(q);
      if (t.get(m.id) !== m || x.version !== E) return;
      if (!U.ok) {
        x.failure.value = U.error;
        return;
      }
      const j = v === Ke ? U.value.counterparts ?? [] : U.value.rows ?? [], L = b === 1 ? j : [...x.rows.value, ...j], P = v === Ke ? (O) => `${O.endpoint.model}:${O.endpoint.id}` : (O) => O.id ?? O.target_id;
      x.rows.value = [...new Map(L.map((O) => [P(O), O])).values()], x.total.value = U.value.total ?? x.rows.value.length, x.next.value = U.value.next_page ?? null;
    } catch (U) {
      x.version === E && (x.failure.value = U.message);
    } finally {
      x.version === E && (x.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((v) => t.get(v)).filter((v) => v && s(v));
    n.clear();
    for (const v of m) {
      const b = [...v.dirty];
      v.dirty.clear();
      for (const x of b) o(v, x);
    }
  }
  function r(m, v = [Ke, Jt]) {
    for (const b of v) m.dirty.add(b);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const v = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), b = m.link_types ?? (m.link_type ? [m.link_type] : []), x = b.length ? [Ke, Jt].filter((_) => _ === Ke ? b.some((q) => ["about", "edited"].includes(q)) : b.includes("sent_to")) : [Ke, Jt];
    if (!x.length) return;
    const E = v.length ? [...new Set(v.filter((_) => _.model === "message").map((_) => _.id))].map((_) => t.get(_)).filter(Boolean) : [...t.values()].filter(s).slice(0, I0);
    for (const _ of E) r(_, x);
  }
  const c = (h = e.follow) == null ? void 0 : h.call(e, ["link.*"], i), d = {
    attach(m, v) {
      let b = t.get(m);
      return b || (b = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ke, Jt]), work: Bo(), sent: Bo() }, t.set(m, b)), b.views.add(v), b.dirty.size && r(b, [...b.dirty]), b;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, v) {
      m.views.delete(v), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), c == null || c(), Tn.delete(e));
    },
    more(m, v) {
      const b = m == null ? void 0 : m[v];
      if (b != null && b.next.value && !b.loading.value) return o(m, v, b.next.value);
    }
  };
  return Tn.set(e, d), d;
}
function L0(e, t, n) {
  const a = Ye(null);
  let s = null;
  const o = pe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = B0(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((v) => {
      c.visible = v.some((b) => b.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = pe(n, (v) => {
      h == null || h.disconnect(), v && (h == null || h.observe(v));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), h == null || h.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return la(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Ke),
    loadSent: () => s == null ? void 0 : s.more(a.value, Jt)
  };
}
const N0 = ["data-incoming", "data-ref"], D0 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], q0 = { class: "message-body" }, j0 = ["title"], P0 = ["innerHTML"], F0 = ["title"], W0 = ["innerHTML"], H0 = {
  class: "message-faces",
  "data-message-faces": ""
}, U0 = ["title", "data-face", "onClick"], z0 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, V0 = ["title", "data-reaction", "onClick"], G0 = {
  key: 0,
  class: "message-reaction-count"
}, K0 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Y0 = ["href", "title"], J0 = ["src", "alt"], X0 = ["href"], Q0 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Z0 = ["disabled", "data-sent-worker", "title", "onClick"], ey = { class: "message-foot" }, ty = { class: "message-time" }, ny = {
  class: "message-id",
  "data-message-id": ""
}, ay = 140, sy = 2, oy = 1500, ly = "An earlier message", ry = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [Z, ae] = (n.message.commented_row || ":").split(":"), oe = ht(Z);
      return oe ? { ref: `${oe}:${ae}`, label: `${Vt(oe).title.toLowerCase()} ${ae}` } : null;
    }), i = I(() => n.message.worker_id ?? null), c = A(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > ay || (n.message.text ?? "").split(`
`).filter((Z) => Z.trim()).length > sy)), h = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, oy);
    }
    const v = vr(), b = I(() => v(n.message.text ?? "")), x = I(() => JSON.parse(n.message.flowchart_edges || "[]")), E = A(!1), _ = I(() => v(n.quote || ly));
    function q() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : He(`messages:${n.message.parent_id}`);
    }
    O0(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, L = I(() => JSON.parse(n.message.captions || "{}")), P = I(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: j(Z), isImage: U.test(Z), title: L.value[Z] || Z }))), O = I(() => tr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), T = Oe(qe, null), { links: $, total: k, more: w, loading: p, failure: M, sentTo: C, sentMore: R, sentLoading: F, sentFailure: Q, loadMore: se, loadSent: ie } = L0(T, () => l.value && !n.message.local ? n.message.id : null, o), ge = A(!1), Ee = I(() => R0(n.message.reactions));
    function fe(Z) {
      ge.value = !1, a("react", n.message, Z);
    }
    return (Z, ae) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      B(r0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ae[0] || (ae[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, N0)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", q0, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: r.value }]),
          onClick: ae[6] || (ae[6] = (...oe) => N(Lt) && N(Lt)(...oe))
        }, [
          r.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: ae[1] || (ae[1] = xe((oe) => N(He)(r.value.ref), ["stop"]))
          }, [
            B(ye, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + y(r.value.label), 1)
          ], 8, j0)) : S("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(q, ["stop"]),
            innerHTML: _.value
          }, null, 8, P0)) : S("", !0),
          i.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: ae[2] || (ae[2] = xe((oe) => N(He)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + y(i.value), 9, F0)) : S("", !0),
          g("div", {
            class: J({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 10, W0),
          d.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ae[3] || (ae[3] = xe((oe) => c.value = !c.value, ["stop"]))
          }, y(c.value ? "Show less" : "Show more"), 1)) : S("", !0),
          x.value.length ? (u(), f(W, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ae[4] || (ae[4] = (oe) => E.value = !0)
            }, "Open the flowchart"),
            E.value ? (u(), H(Uv, {
              key: 0,
              title: e.message.text,
              edges: x.value,
              onClose: ae[5] || (ae[5] = (oe) => E.value = !1)
            }, null, 8, ["title", "edges"])) : S("", !0)
          ], 64)) : S("", !0)
        ], 2),
        g("div", {
          class: J(["message-tools", { picking: ge.value }]),
          "data-message-tools": ""
        }, [
          ge.value ? (u(), f(W, { key: 0 }, [
            g("div", H0, [
              (u(!0), f(W, null, te(N(T0), (oe) => (u(), f("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (Ze) => fe(oe)
              }, y(oe), 9, U0))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ae[7] || (ae[7] = (oe) => ge.value = !1)
            }, [
              B(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(W, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ae[8] || (ae[8] = (oe) => ge.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ae[9] || (ae[9] = (oe) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, y(s.value ? "Copied" : "Copy"), 1),
            h.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ae[10] || (ae[10] = (oe) => a("delete", e.message))
            }, "Delete")) : S("", !0)
          ], 64))
        ], 2)
      ]),
      Ee.value.length ? (u(), f("div", z0, [
        (u(!0), f(W, null, te(Ee.value, (oe) => (u(), f("button", {
          key: oe.emoji,
          type: "button",
          class: J(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (Ze) => a("react", e.message, oe.emoji)
        }, [
          ee(y(oe.emoji) + " ", 1),
          oe.count > 1 ? (u(), f("span", G0, y(oe.count), 1)) : S("", !0)
        ], 10, V0))), 128))
      ])) : S("", !0),
      P.value.length ? (u(), f("div", K0, [
        (u(!0), f(W, null, te(P.value, (oe) => (u(), f(W, {
          key: oe.name
        }, [
          oe.isImage ? (u(), f("a", {
            key: 0,
            href: oe.address,
            target: "_blank",
            class: "message-image",
            title: oe.title
          }, [
            g("img", {
              src: oe.address,
              alt: oe.name,
              "data-figure-picture": ""
            }, null, 8, J0)
          ], 8, Y0)) : (u(), f("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, y(oe.name), 9, X0))
        ], 64))), 128))
      ])) : S("", !0),
      N(C).length ? (u(), f("div", Q0, [
        B(ye, {
          name: "send",
          size: 12
        }),
        (u(!0), f(W, null, te(N(C), (oe) => (u(), f("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: xe((Ze) => oe.open_ref && N(He)(oe.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + y(oe.id), 1),
          oe.unavailable ? (u(), f(W, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : S("", !0)
        ], 8, Z0))), 128))
      ])) : S("", !0),
      B(pn, {
        more: N(R),
        loading: N(F),
        failure: N(Q),
        label: "More recipients",
        onMore: N(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      g("div", ey, [
        g("time", ty, y(O.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(W, { key: 0 }, [
          ae[11] || (ae[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", ny, "message " + y(e.message.id), 1)
        ], 64)) : S("", !0),
        l.value ? (u(), H(M0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : S("", !0)
      ]),
      N($).length || N(M) ? (u(), H(k0, {
        key: 3,
        links: N($),
        total: N(k),
        more: N(w),
        loading: N(p),
        failure: N(M),
        onMore: N(se)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : S("", !0)
    ], 8, D0));
  }
}, l8 = /* @__PURE__ */ V(ry, [["__scopeId", "data-v-0be1107c"]]), Jn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ta = 200, Dr = (e) => {
  var t;
  return ((t = Jn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Jn[0].key;
}, r8 = (e) => {
  var t;
  return ((t = Jn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, iy = ["aria-label"], uy = 300, Lo = 400, cy = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ta } },
  setup(e) {
    const t = e, n = I(() => Dr(t.value)), a = I(() => n.value < Ta ? [1, 0.25, 0.25] : n.value === Ta ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: J(["ico", "prio", { hot: n.value >= Lo, high: n.value >= uy && n.value < Lo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      g("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ve({ opacity: a.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ve({ opacity: a.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ve({ opacity: a.value[2] })
      }, null, 4)
    ], 10, iy));
  }
}, i8 = /* @__PURE__ */ V(cy, [["__scopeId", "data-v-b10e610f"]]), No = (e) => [...new Set(e.agents.map((t) => t.name))], u8 = (e) => No(e).length === 1 ? `Worker: ${No(e)[0]}` : "Delegated", dy = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Do = (e) => dy[e.card.state] || "idle", fy = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), qo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, jo = (e, t) => qo[Do(e)] - qo[Do(t)], Po = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, c8 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => jo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || fy(a, s)) : [...e].sort((a, s) => jo(a, s) || (Po[t] || Po.state)(a, s)), hy = { class: "list-row" }, my = {
  key: 0,
  class: "list-row-type"
}, py = { class: "list-row-main" }, gy = {
  key: 0,
  class: "list-row-title"
}, vy = { class: "list-row-body" }, yy = {
  key: 1,
  class: "list-row-end"
}, by = {
  key: 1,
  class: "list-row-text"
}, ky = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", hy, [
      e.type ? (u(), f("span", my, y(e.type), 1)) : S("", !0),
      g("div", py, [
        e.title ? (u(), f("span", gy, y(e.title), 1)) : S("", !0),
        g("div", vy, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", yy, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : S("", !0)
      ]),
      e.text ? (u(), f("span", by, y(e.text), 1)) : S("", !0)
    ]));
  }
}, d8 = /* @__PURE__ */ V(ky, [["__scopeId", "data-v-dfc8c3a7"]]), f8 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), H(fr, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, wy = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: J(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, qr = /* @__PURE__ */ V(wy, [["__scopeId", "data-v-978e0921"]]), $y = ["aria-label"], xy = { class: "head" }, Sy = { class: "names" }, My = { class: "body" }, _y = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Hl(a, n), r = Ul(s);
    return (i, c) => (u(), H(oa, { to: "body" }, [
      B(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: N(l)
      }, {
        default: D(() => [
          N(s) ? (u(), f("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: N(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => N(o) && N(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(W, { key: 0 }, [
                g("header", xy, [
                  g("div", Sy, [
                    g("h2", null, y(e.title), 1),
                    e.abstract ? (u(), H(xt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : S("", !0)
                  ]),
                  me(i.$slots, "actions", {}, void 0, !0),
                  B(ia, {
                    title: e.closeLabel,
                    onClick: N(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), H(qr, { key: 0 }, {
                  default: D(() => [
                    me(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : S("", !0),
                g("div", My, [
                  me(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, $y)
          ], 6)) : S("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, h8 = /* @__PURE__ */ V(_y, [["__scopeId", "data-v-f276f055"]]), Cy = {
  key: 1,
  class: "text-field-label"
}, Ey = {
  key: 2,
  class: "text-field-end"
}, Ay = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = sn(e, "modelValue"), a = sa(), s = "onUpdate:modelValue" in (((d = Pi()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = A(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, m) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: h.$slots.end }, N(a).class]),
      style: ve(N(a).style)
    }, [
      e.icon ? (u(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : S("", !0),
      e.label ? (u(), f("span", Cy, y(e.label), 1)) : S("", !0),
      De(g("input", Ne({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [N(ss), o.value]
      ]),
      h.$slots.end ? (u(), f("span", Ey, [
        me(h.$slots, "end", {}, void 0, !0)
      ])) : S("", !0)
    ], 6)) : De((u(), f("input", Ne({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [N(ss), o.value]
    ]);
  }
}), m8 = /* @__PURE__ */ V(Ay, [["__scopeId", "data-v-d9c38ca8"]]), Oy = { class: "title" }, Ty = { class: "state" }, Ry = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Qa(t.line, t.events);
    return (o, l) => (u(), H(cv, {
      rows: N(n),
      failure: N(a),
      loaded: N(s),
      empty: e.empty
    }, {
      default: D(({ row: r }) => [
        g("span", Oy, y(r.title), 1),
        g("span", Ty, y(N(As)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, p8 = /* @__PURE__ */ V(Ry, [["__scopeId", "data-v-9191a6f0"]]);
function Iy(e = 1e3, t = null) {
  const n = A(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const Ra = A(Date.now() / 1e3);
let Fo = 0, Rn = 0;
function jr() {
  return Rn || (Ra.value = Date.now() / 1e3, Fo = setInterval(() => Ra.value = Date.now() / 1e3, 1e3)), Rn += 1, yl() && la(() => {
    Rn -= 1, Rn || clearInterval(Fo);
  }), Ra;
}
const By = 200, Ly = Br + jn + Lr + By;
function Kt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ny(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Kt(e),
    top: Kt(e.querySelector(".top")),
    title: Kt(e.querySelector(".title")),
    contents: Kt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, c;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((c = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }))(getComputedStyle(e)),
    parent: Kt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Dy(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Ny(o, l, n.value)), performance.now() - l < Ly) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const qy = ["title", "data-figure-mark", "data-folded", "data-open"], jy = {
  key: 2,
  class: "worker"
}, Py = { class: "head" }, Fy = { key: 0 }, Wy = {
  key: 3,
  class: "status"
}, Hy = {
  key: 0,
  class: "figure"
}, Uy = {
  key: 1,
  class: "ran-for"
}, zy = { key: 2 }, Vy = {
  key: 3,
  class: "news"
}, Gy = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Ky = {
  key: 6,
  class: "settled"
}, Yy = {
  key: 1,
  class: "bar"
}, Jy = {
  key: 3,
  class: "detail body"
}, Xy = {
  key: 0,
  class: "body-label"
}, Qy = ["title"], Zy = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = sa(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = A(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), c = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), h = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || h.value || !!n.onClick), v = A(null), b = A(null), { folded: x, phase: E } = Nr(v, () => d.value);
    Dy(v, d, E, Oe(qe, null));
    function _(ie) {
      var ge, Ee;
      if (!(ie.target !== v.value && !b.value.contains(ie.target))) {
        if (r.value) return (ge = n.onClick) == null ? void 0 : ge.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(ie);
      }
    }
    const q = (ie) => n.onAct(ie), U = ["failed", "unfinished"], j = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), L = I(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), P = I(() => L.value || "var(--tone-work)"), O = I(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), T = jr(), $ = I(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? nr(T.value - t.mark.began_at) : ""
    ), k = I(() => {
      const { started: ie, ended: ge } = t.mark;
      return ie ? ge ? `ran ${go(ge - ie, !0)}` : go(T.value - ie, !0) : $.value;
    }), w = ["bad", "danger", "warn"], p = I(() => w.includes(j.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], C = I(() => M.includes(j.value)), R = I(() => p.value === "process" ? "running" : C.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), F = I(
      () => !!(t.mark.figure || k.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Q = I(() => [t.mark.title, t.mark.time ? tr(t.mark.time) : ""].filter(Boolean).join(" · ")), se = I(() => ({
      ...L.value ? { "--mark": L.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ge) => (u(), f("div", Ne(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        N(E),
        {
          open: c.value,
          folding: r.value && d.value,
          live: m.value,
          failed: C.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: L.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: se.value,
      title: Q.value,
      "data-figure-mark": e.mark.key,
      "data-folded": N(x) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: _
    }), [
      (u(), H(gt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (u(), H(pt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", jy, y(e.mark.worker), 1)) : S("", !0),
          g("span", Py, [
            B(xt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", Fy, y(e.mark.name), 1)) : S("", !0),
            i.value ? (u(), H(Mt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : S("", !0)
          ]),
          F.value ? (u(), f("span", Wy, [
            e.mark.figure ? (u(), f("span", Hy, y(e.mark.figure), 1)) : S("", !0),
            k.value ? (u(), f("span", Uy, y(k.value), 1)) : S("", !0),
            e.mark.stopping ? (u(), f("span", zy, "Stopping")) : S("", !0),
            e.mark.news ? (u(), f("span", Vy, y(e.mark.news), 1)) : S("", !0),
            R.value === "running" ? (u(), f("span", Gy)) : R.value ? (u(), H(pt, {
              key: 5,
              class: J(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : S("", !0),
            e.mark.settled ? (u(), f("span", Ky, y(e.mark.settled), 1)) : S("", !0)
          ])) : S("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), H(Ir, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(q, ["stop"])
      }, null, 8, ["label", "open"])) : S("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (u(), f("span", Yy, [
        g("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: P.value })
        }, null, 4)
      ])) : S("", !0),
      e.mark.detail && !N(x) ? (u(), H(xt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : S("", !0),
      e.mark.body && !N(x) ? (u(), f("div", Jy, [
        e.mark.bodyLabel ? (u(), f("p", Xy, y(e.mark.bodyLabel), 1)) : S("", !0),
        B(xt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : S("", !0),
      e.mark.command && !N(x) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, y(e.mark.command), 9, Qy)) : S("", !0),
      e.mark.card ? (u(), H(xt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : S("", !0),
      me(ie.$slots, "default", {
        shown: !N(x)
      }, void 0, !0)
    ], 16, qy));
  }
}), Pr = /* @__PURE__ */ V(Zy, [["__scopeId", "data-v-2aa9c496"]]), eb = 60, Fr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function tb(e, t) {
  const n = A([]), a = A(0);
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
    if (l || a.value <= 0 || d.scrollTop > eb) return;
    l = !0;
    const h = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await Qe(), d.scrollTop += d.scrollHeight - h);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: c };
}
const nb = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Wr(e) {
  var n;
  const t = nb[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const ab = (e) => Wr(String(e).split(":")[0]), sb = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), ob = { passed: "good", failed: "danger", warned: "warn", running: "" }, lb = { good: "good", warn: "warn", danger: "danger" }, Wo = {
  "open row": (e) => He(`${e.target_model}:${e.target_id}`),
  "open page": (e) => kf(e.target_model, e.target_id || 0)
}, rb = { "open row": (e) => ab(e.target_model), "open page": () => Wr("pages") };
function ib(e, t) {
  const n = t || {}, a = Wo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? ob[e.outcome] || "" : lb[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? rb[a](e) : "",
    handlers: a ? { onAct: () => Wo[a](e) } : {}
  };
}
const ub = 24, cb = 1e3, Ho = 2e3, db = 0.25, fb = 5e3;
function hb(e, t = ub, n = () => !0) {
  const a = A(!1), s = A(0), o = A(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const j = c();
    return j ? j.scrollHeight - j.scrollTop - j.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function m(j) {
    if (clearTimeout(l), !j) {
      o.value = !1, i = Date.now();
      return;
    }
    const L = Date.now() - i < Ho ? Ho : cb;
    l = setTimeout(() => o.value = a.value, L);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function b(j = !1) {
    const L = c();
    L && j && L.scrollTo ? L.scrollTo({ top: L.scrollHeight, behavior: "smooth" }) : L && (L.scrollTop = L.scrollHeight), v();
  }
  function x() {
    _(), !a.value && (a.value = !0, m(!0));
  }
  const E = () => !!c() && d() <= c().clientHeight * db;
  function _() {
    clearTimeout(r), E() && (r = setTimeout(() => a.value && E() && n() && b(!0), fb));
  }
  function q() {
    h() ? v() : x();
  }
  function U(j = 1, L = !1) {
    a.value ? s.value += Math.max(0, j) : b(L);
  }
  return yl() && la(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: v, toBottom: b, left: x, scrolled: q, arrived: U };
}
const mb = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, pb = (e) => String(e ?? "").replace(mb, ""), gb = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), { away: o, scrolled: l, arrived: r, toBottom: i } = hb(s);
    pe(
      () => n.lines.length,
      () => Qe(() => r()),
      { immediate: !0 }
    );
    function c(d) {
      l(), a("older", d.target);
    }
    return (d, h) => (u(), f("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      ee(y(N(pb)(e.lines.join(`
`)) || e.empty), 1),
      N(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (m) => N(i)(!0))
      }, "Follow")) : S("", !0)
    ], 544));
  }
}, vb = /* @__PURE__ */ V(gb, [["__scopeId", "data-v-c2fb1783"]]), yb = "*.*", bb = {
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
    const t = e, n = Oe(qe, null), a = new Al();
    pe(
      () => a.patterns,
      (i, c, d) => {
        var m;
        const h = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [yb] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), H(Ar, {
      key: 0,
      entry: r.value,
      subscriptions: N(a),
      environment: N(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), H(Er, {
      key: 1,
      entry: r.value,
      subscriptions: N(a),
      environment: N(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, kb = { class: "mark-more-inner" }, wb = {
  class: "mark-lines",
  "data-mark-reason": ""
}, $b = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, xb = {
  key: 3,
  class: "mark-lines"
}, Sb = "process", Uo = "task", Mb = {
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
    const t = e, n = Ue(), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => sb.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Uo ? t.mark.target_id : 0), l = tb(
      Fr(n),
      () => t.mark.target_id
    ), r = l.lines, i = A(!1), c = A(""), d = I(() => !t.declaration.body_url && t.mark.target_model === Sb && !!t.mark.target_id);
    async function h(v = l.follow) {
      const b = await v();
      i.value = !0, c.value = b.ok ? "" : b.error;
    }
    const m = I(() => t.shown && d.value);
    return pe(m, (v) => v && h()), xs(() => m.value && h(), () => m.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (v) => v && m.value && h(l.newest)
    ), (v, b) => (u(), f("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      g("div", kb, [
        e.declaration.body_url ? (u(), H(bb, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (u(), f(W, { key: 1 }, [
          s.value ? (u(), f(W, { key: 0 }, [
            b[2] || (b[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", wb, y(s.value), 1)
          ], 64)) : S("", !0),
          d.value && c.value ? (u(), f("p", $b, y(c.value), 1)) : d.value && i.value ? (u(), f(W, { key: 2 }, [
            b[3] || (b[3] = g("p", { class: "mark-label" }, "Output", -1)),
            B(vb, {
              class: "mark-terminal",
              lines: N(r),
              onOlder: N(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", xb, y(a.value.join(`
`)), 1)) : S("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((x) => N(He)(`${Uo}:${o.value}`), ["stop"]))
          }, " Open task " + y(o.value) + " and its proofs ", 1)) : S("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ds = /* @__PURE__ */ V(Mb, [["__scopeId", "data-v-2f996108"]]), _b = ["title", "aria-label", "onClick"], Cb = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Eb = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => zd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = A(""), s = Oe(qe);
    async function o(l) {
      const r = await gn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (u(), f(W, null, [
      (u(!0), f(W, null, te(n.value, (i) => (u(), f("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((c) => o(i), ["stop"])
      }, [
        B(pt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, _b))), 128)),
      a.value ? (u(), f("span", Cb, y(a.value), 1)) : S("", !0)
    ], 64));
  }
}, Ab = /* @__PURE__ */ V(Eb, [["__scopeId", "data-v-7a62c88e"]]);
function Hr(e, t) {
  const n = Ye(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Ur = Hr("/api/marks", "marks"), g8 = Ur.fetchAll, Ob = Ur.find, Tb = ["data-ref"], Rb = ["data-ref"], Ib = { class: "mark-row" }, Bb = "dock add", Lb = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => Ob(a.mark.type)), o = I(() => ib(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = A(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const c = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((h) => {
        var m;
        return !a.docked || !((m = h.runs) != null && m.startsWith(Bb));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (d, h) => {
      var m, v;
      return (m = s.value) != null && m.card ? (u(), f("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": N(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        B(ds, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Tb)) : (u(), f("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": N(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Ib, [
          B(Pr, Ne({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Fi(o.value.handlers), { onClick: i }), Wi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: b }) => [
                B(ds, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          B(Ab, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Rb));
    };
  }
}, Nb = /* @__PURE__ */ V(Lb, [["__scopeId", "data-v-afd7d6b1"]]), Db = ["data-ref"], qb = ["inert"], jb = { class: "group-fold" }, Pb = { class: "thread-group" }, Fb = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = A(!1), a = A(!1), s = A(!1), o = A(null);
    pe(n, async (r) => {
      var i;
      a.value = !0, await Qe(), (i = o.value) == null || i.offsetHeight, s.value = r;
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
    return (r, i) => (u(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      B(Pr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: J(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", jb, [
          g("div", Pb, [
            (u(!0), f(W, null, te(e.group.marks, (c) => (u(), H(Nb, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, qb)) : S("", !0)
    ], 8, Db));
  }
}, v8 = /* @__PURE__ */ V(Fb, [["__scopeId", "data-v-45b58b9b"]]);
function Wb(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Te(() => n.observe(e.value)), Xe(() => n.disconnect()), t;
}
const Hb = { class: "chat-dock-fold" }, Ub = ["aria-label"], zb = { class: "chat-dock-head" }, Vb = { class: "chat-dock-inner" }, Gb = { class: "chat-dock-foot" }, zr = 700, Kb = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = A(null), a = A(null), s = Wb(a), o = A(!1);
    let l = 0;
    return Te(() => l = setTimeout(() => o.value = !0, zr)), Xe(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), f("div", {
      class: J(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Hb, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(r.$slots, "edge", {}, void 0, !0),
          g("header", zb, [
            me(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Vb, [
              g("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: ve(N(s) === null ? null : { height: `${N(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  me(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          me(r.$slots, "still", {}, void 0, !0),
          g("footer", Gb, [
            me(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Ub)
      ])
    ], 2));
  }
}, Vr = /* @__PURE__ */ V(Kb, [["__scopeId", "data-v-74d44b19"]]), Yb = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ia = 5, Jb = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ia, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ia}s`, animationDelay: `${(n - Ia).toFixed(2)}s` };
    return (s, o) => (u(), f("span", Yb, [
      g("i", { style: a })
    ]));
  }
}, Gr = /* @__PURE__ */ V(Jb, [["__scopeId", "data-v-2a7bc150"]]), Xb = { reviewing: "Under review" }, Qb = (e, t) => e || Xb[t == null ? void 0 : t.state] || "", nt = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Zb = {
  draft: [{ word: "ready", label: "Mark ready" }, nt],
  ready: [nt],
  approved: [{ word: "start", label: "Start", main: !0 }, nt],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, nt],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, nt],
  completed: [],
  cancelled: []
}, ek = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, nt],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, nt],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, nt],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, nt],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, tk = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function nk(e, t) {
  const n = { plan: Zb, task: ek }[e], a = t != null && t.state ? nd(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Nl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const ak = (e, t) => e === "doc" || e === "report" ? tk(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : nk(e, t), Kr = Hr("/api/docks", "docks"), y8 = Kr.fetchAll, Xt = Kr.find, sk = 6, ok = 3, Ba = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, da = (e) => Date.parse(e.leaves_at) / 1e3, $t = (e) => !!(e.leaves_at && !e.kept), lk = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!$t(e) || t < da(e) || n.has(e.id)), rk = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => lk(a, t, n)).sort((a, s) => a.id - s.id);
function ik(e, t, n = sk) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(da(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const uk = (e, t, n = e) => n < 2 ? !1 : e >= ok ? !0 : t, ck = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), fs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), dk = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), fk = (e) => ({ ...e.kept ? fs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : fs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), hk = ["keep", "unkeep", "open", "undock"], mk = (e) => ({ ...e, iconOnly: hk.includes(e.action) });
function pk(e, t) {
  var n;
  return [
    ...dk(e, t) ? [fk(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    fs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(mk);
}
function gk(e, t) {
  const n = pk(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: ck(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const vk = { class: "dock-text" }, yk = ["title"], bk = {
  class: "dock-facts",
  "data-dock-facts": ""
}, kk = { "data-dock-row": "" }, wk = {
  key: 1,
  class: "dock-kept"
}, $k = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, xk = { class: "dock-facts" }, Sk = { "data-dock-row": "" }, Mk = {
  key: 1,
  class: "dock-kept"
}, _k = { class: "dock-acts" }, Ck = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => Xt(a.item.type)), o = jr(), l = I(() => Bs(a.item.created_at, o.value * 1e3)), r = A(null), i = A(null), c = A(null), d = A(null), h = I(() => gk(a.item, s.value)), m = Ue(), v = I(() => `dock.${a.item.id}`), b = I(() => m.props[v.value].data.value), x = I(() => Kn(a.item.target_model ?? "")), E = I(() => {
      var k;
      return (((k = s.value) == null ? void 0 : k.word) || x.value.replaceAll("-", " ")).replace(/^./, (w) => w.toUpperCase());
    }), _ = I(() => ({ ...b.value, id: a.item.target_id, noun: x.value })), q = () => {
      var k, w;
      return ((w = (k = s.value) == null ? void 0 : k.reads) == null ? void 0 : w.length) && m.reload(v.value);
    };
    dc(gl, { data: b, reload: q, readOutput: Fr(m) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (k, w, p) => {
        var C;
        q();
        const M = (C = m.subscriptions) == null ? void 0 : C.follow(`dock ${a.item.id}`, [`${x.value.replaceAll("-", "_")}.*`], (R) => {
          (!R.row_id || R.row_id === a.item.target_id) && q();
        });
        p(() => M == null ? void 0 : M());
      },
      { immediate: !0 }
    );
    const U = A(/* @__PURE__ */ new Set()), j = A("");
    async function L(k) {
      if (k.action === "undock") return n("undock", k);
      if (k.action === "open") return He(`${a.item.target_model}:${a.item.target_id}`);
      k.action === "declared" && (U.value = /* @__PURE__ */ new Set([...U.value, k.label])), j.value = "";
      const p = await gn(k, { id: a.item.target_id }, m.environment);
      (p == null ? void 0 : p.ok) === !1 && (U.value = new Set([...U.value].filter((M) => M !== k.label)), j.value = `Could not ${k.label.toLowerCase()}: ${p.error}`);
    }
    const P = I(() => h.value.actions.filter((k) => !U.value.has(k.label))), O = I(() => {
      var k;
      return Qb((k = s.value) == null ? void 0 : k.badge, _.value);
    }), T = I(() => h.value.controls.filter((k) => !(a.collapsed && ["keep", "unkeep"].includes(k.action)))), $ = I(() => {
      var k;
      return !!((k = s.value) != null && k.draws_head) && !a.collapsed;
    });
    return (k, w) => {
      var p, M, C, R;
      return u(), H(Vr, {
        label: h.value.title + ((p = s.value) != null && p.needs_user ? ", waiting for you" : ""),
        type: (M = s.value) != null && M.needs_user ? "waiting" : "",
        folded: !!((C = s.value) != null && C.folds) && e.folded,
        body: !!((R = s.value) != null && R.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: w[3] || (w[3] = (F) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (u(), H(Gr, {
            key: 0,
            "ends-at": N(da)(e.item)
          }, null, 8, ["ends-at"])) : S("", !0)
        ]),
        head: D(() => {
          var F;
          return [
            $.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(W, { key: 1 }, [
              B(ye, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", vk, [
                g("span", {
                  class: "dock-title",
                  title: h.value.title
                }, y(h.value.title), 9, yk),
                g("span", bk, [
                  O.value ? (u(), f("span", {
                    key: 0,
                    class: J(["dock-badge", e.item.type.split(".")[1]]),
                    "data-dock-badge": ""
                  }, y(O.value), 3)) : S("", !0),
                  g("span", kk, y(E.value) + " " + y(e.item.target_id), 1),
                  e.item.kept ? (u(), f("span", wk, "Kept")) : S("", !0)
                ])
              ])
            ], 64)),
            T.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: w[0] || (w[0] = xe(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(W, null, te(T.value, (Q) => {
                var se, ie;
                return u(), f(W, {
                  key: Q.action + Q.runs
                }, [
                  !U.value.has(Q.label) && (!((se = Q.variants) != null && se.length) || !((ie = _.value) != null && ie.state) || Q.variants.includes(_.value.state)) ? (u(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: J({ kept: Q.pressed }),
                    "aria-pressed": Q.pressed,
                    "aria-label": Q.label,
                    title: Q.label,
                    "data-dock-action": Q.action,
                    onClick: (ge) => L(Q)
                  }, {
                    default: D(() => [
                      B(ye, {
                        name: Q.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : S("", !0)
                ], 64);
              }), 128))
            ])) : S("", !0),
            g("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (F = s.value) != null && F.leaves_after_seconds ? S("", !0) : (u(), f(W, { key: 0 }, [
                ee(y(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: D(() => [
          j.value || e.refusal ? (u(), f("p", $k, y(j.value || e.refusal), 1)) : S("", !0)
        ]),
        foot: D(() => {
          var F;
          return [
            g("span", xk, [
              $.value ? (u(), f(W, { key: 0 }, [
                O.value ? (u(), f("span", {
                  key: 0,
                  class: J(["dock-badge", e.item.type.split(".")[1]]),
                  "data-dock-badge": ""
                }, y(O.value), 3)) : S("", !0),
                g("span", Sk, y(E.value) + " " + y(e.item.target_id), 1),
                e.item.kept ? (u(), f("span", Mk, "Kept")) : S("", !0)
              ], 64)) : S("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (F = s.value) != null && F.folds ? (u(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: w[1] || (w[1] = (Q) => n("fold"))
            }, {
              default: D(() => [
                ee(y(s.value.folds) + " ", 1),
                B(Mt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : S("", !0),
            g("span", _k, [
              g("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              B(Yl, {
                name: `dock.${e.item.type}`,
                row: _.value,
                environment: N(m).environment,
                "read-only": N(m).readOnly,
                "object-name": N(Kn)(e.item.target_model),
                "external-failure": "",
                onFailure: w[2] || (w[2] = (Q) => j.value = Q),
                onDone: k.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(W, null, te(P.value, (Q) => (u(), H(de, {
                key: Q.action + Q.runs,
                small: "",
                variant: Q.primary ? "primary" : "ghost",
                bordered: !Q.primary,
                "data-dock-action": Q.action,
                onClick: (se) => L(Q)
              }, {
                default: D(() => [
                  ee(y(Q.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: D(() => {
          var F;
          return [
            (F = s.value) != null && F.body_url ? (u(), H(ds, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: c.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : S("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, zo = /* @__PURE__ */ V(Ck, [["__scopeId", "data-v-973f5d66"]]), Ek = ["title", "aria-label"], Ak = { class: "run-chip-in" }, Ok = {
  key: 0,
  class: "run-chip-ring"
}, Tk = { class: "run-chip-name" }, Rk = { class: "run-chip-bar" }, Ik = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ue(), o = I(() => `run.${a.item.target_id}`), l = I(() => s.props[o.value].data.value), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), c = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let h = null;
    return Te(() => {
      var m;
      d(), h = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), Xe(() => h == null ? void 0 : h()), (m, v) => {
      var b;
      return u(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ve({ "--tone": c.value })
      }, [
        N($t)(e.item) ? (u(), H(Gr, {
          key: 0,
          "ends-at": N(da)(e.item)
        }, null, 8, ["ends-at"])) : S("", !0),
        g("span", Ak, [
          r.value ? (u(), f("span", Ok)) : (u(), H(pt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", Tk, y(i.value), 1)
        ]),
        g("span", Rk, [
          g("i", {
            style: ve({ width: r.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, Ek);
    };
  }
}, Bk = /* @__PURE__ */ V(Ik, [["__scopeId", "data-v-226ac6c8"]]), Lk = 24, Nk = 8, b8 = 420;
function k8({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Lk ? !0 : e < t && s > Nk ? !1 : null;
}
const Dk = (e, t) => e === void 0 ? t : e, qk = { me: 1, people: [] }, Xn = Ht({
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
  people: qk,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Un("journal.activity", !0),
  wide: !1,
  sideMini: Un("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ql("journal.activity", () => Xn.activity);
Ql("journal.side.mini", () => Xn.sideMini);
const Yr = "journal.viewer.";
function jk(e, t, n) {
  try {
    const a = n.getItem(Yr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Pk(e, t, n) {
  try {
    n.setItem(Yr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Vo(e, t, n = window.localStorage) {
  const a = A(jk(e, t, n));
  return pe(a, (s) => Pk(e, s, n), { deep: !0 }), a;
}
const Fk = {
  key: "dock-all",
  class: "dock-all"
}, Wk = {
  key: "runs-head",
  class: "dock-runs-head"
}, Hk = { class: "dock-runs-title" }, Uk = { class: "dock-runs-chips" }, zk = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = Iy(500), a = A(/* @__PURE__ */ new Set()), s = A(!1), o = A(!1), l = Oe(qe), r = A(/* @__PURE__ */ new Set()), i = A({});
    async function c(M, C) {
      i.value = { ...i.value, [M.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, M.id]);
      const R = await gn(C, { id: M.target_id }, l.environment);
      (R == null ? void 0 : R.ok) === !1 && (r.value = new Set([...r.value].filter((F) => F !== M.id)), i.value = { ...i.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const d = I(
      () => rk(
        t.items.filter((M) => !r.value.has(M.id)),
        n.value,
        a.value
      )
    ), h = I(
      () => ik(
        d.value.filter((M) => Ba(M, Xt)),
        n.value
      )
    ), m = I(() => d.value.filter((M) => !h.value.includes(M) && !Ba(M, Xt))), v = I(() => h.value.filter((M) => !$t(M))), b = Vo(`dock-size:${((w = Xn.identity) == null ? void 0 : w.root) || location.host}`, null), x = (M) => b.value ? b.value.collapsed && !b.value.opened.includes(M.id) : t.collapsed, E = I(() => d.value.some(x)), _ = I(() => (s.value = uk(h.value.length, s.value, v.value.length)) && !o.value && !d.value.some(x));
    function q() {
      b.value = { collapsed: !E.value, opened: [] };
    }
    function U(M) {
      var R;
      if (!x(M)) return;
      const C = (R = b.value) != null && R.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...C, M.id] };
    }
    const j = Vo(`dock-folded:${((p = Xn.identity) == null ? void 0 : p.root) || location.host}`, {}), L = (M) => {
      var C;
      return !!((C = Xt(M.type)) != null && C.folds) && Dk(j.value[M.id], Ba(M, Xt) || t.folded);
    };
    function P(M) {
      j.value = { ...j.value, [M.id]: !L(M) };
    }
    function O(M) {
      j.value = { ...j.value, ...Object.fromEntries(h.value.map((C) => [C.id, C.id !== M.id])) }, o.value = !0;
    }
    function T() {
      j.value = Object.fromEntries(Object.entries(j.value).filter(([M]) => !h.value.some((C) => String(C.id) === M))), o.value = !1;
    }
    function $(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function k(M) {
      a.value = new Set([...a.value].filter((C) => C !== M.id));
    }
    return (M, C) => (u(), H(vl, {
      tag: "div",
      name: "dock",
      duration: N(zr),
      class: "dock-stack"
    }, {
      default: D(() => [
        d.value.length > 1 ? (u(), f("div", Fk, [
          B(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": E.value ? "Open all" : "Collapse all",
            onClick: q
          }, {
            default: D(() => [
              B(Mt, {
                open: !E.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : S("", !0),
        (u(!0), f(W, null, te(m.value, (R) => (u(), H(zo, {
          key: R.id,
          item: R,
          class: J({ timed: N($t)(R) }),
          leaving: N($t)(R) && !a.value.has(R.id),
          folded: L(R),
          collapsed: x(R),
          refusal: i.value[R.id],
          onOpen: (F) => U(R),
          onFold: (F) => P(R),
          onUndock: (F) => c(R, F),
          onMouseenter: (F) => $(R),
          onMouseleave: (F) => k(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !E.value ? (u(), f("div", Wk, [
          g("span", null, y(h.value.length) + " runs", 1),
          B(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: T
          }, {
            default: D(() => [
              C[1] || (C[1] = ee(" Runs ", -1)),
              B(Mt, { open: "" })
            ]),
            _: 1
          })
        ])) : S("", !0),
        (u(!0), f(W, null, te(_.value ? [] : h.value, (R) => (u(), H(zo, {
          key: R.id,
          item: R,
          class: J({ timed: N($t)(R) }),
          leaving: N($t)(R) && !a.value.has(R.id),
          folded: L(R),
          collapsed: x(R),
          refusal: i.value[R.id],
          onOpen: (F) => U(R),
          onFold: (F) => P(R),
          onUndock: (F) => c(R, F),
          onMouseenter: (F) => $(R),
          onMouseleave: (F) => k(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        _.value ? (u(), H(Vr, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            B(ye, {
              name: "runs",
              size: 14
            }),
            g("span", Hk, y(h.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            g("span", Uk, [
              (u(!0), f(W, null, te(h.value, (R) => (u(), H(Bk, {
                key: R.id,
                item: R,
                onClick: (F) => O(R)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            B(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: C[0] || (C[0] = (R) => o.value = !0)
            }, {
              default: D(() => [
                C[2] || (C[2] = ee(" Runs ", -1)),
                B(Mt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : S("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, w8 = /* @__PURE__ */ V(zk, [["__scopeId", "data-v-990baf5f"]]), St = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Pn = (e) => Math.min(Math.max(e, 0), 1), Vk = (e) => {
  const t = Pn(e);
  return t * t * (3 - 2 * t);
}, yt = (e, t, n) => Vk((e - t) / (n - t));
function $8(e) {
  const t = Pn(e), n = Pn((t - 0.12) / 0.76) * St.shuffles, a = Math.min(Math.floor(n), St.shuffles - 1), s = n - a, o = yt(s, 0.26, 0.38) * (1 - yt(s, 0.76, 0.96)), l = yt(s, 0.38, 0.76), r = yt(t, 0, 0.12) * (1 - yt(t, 0.88, 1)), i = yt(s, 0.2, 0.34) * (1 - yt(s, 0.84, 1)), c = Math.sin(Math.PI * Pn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / St.shuffles, lift: St.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function x8(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Go = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, S8 = (e) => Go[e] ?? Go.butler, js = 2400, Gk = 0.05;
function Kk({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, Gk), l = Math.min(t + js * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function M8(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Yk(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function _8(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const C8 = (e, t) => ({ ...e, stretch: t.stretch }), E8 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Jr = (e, t) => t >= (e.least ?? 0);
function A8(e, t, n) {
  if (!Jr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const O8 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Jk = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ko = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Xk = (e) => e.right > e.left && e.bottom > e.top;
function T8(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Jk)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Ko(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Ko(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Xk(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Xr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, h, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[h] || e[d] > o[m]) && (r = -1);
      else {
        const b = (o[h] - e[d]) / v, x = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(b, x)), r = Math.min(r, Math.max(b, x));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: c, on: "surface", surface: s.id, dx: i - s.left, dy: c - s.top };
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
}, rn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Qk = (e) => e * e * (3 - 2 * e), Ae = (e, [t, n]) => Qk(rn(e, t, n)), Zk = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, In = ([e, t], n) => e + n() * (t - e);
function ew(e) {
  return Zk.map(() => {
    const t = In(ft.speed, e), n = In(ft.angle, e) * Math.PI / 180, a = In(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [In(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const tw = ew(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function nw(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function R8(e, t, n = tw) {
  const a = Ce.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = nw(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * i);
  return c[2] -= ft.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const I8 = (e, t) => e && Ce[e.name] ? { name: e.name, u: t / e.frames } : null;
function B8(e, t) {
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
const L8 = () => Array.from({ length: Ce.pogo.count }, (e, t) => Ce.pogo.bounce * (t + 1) / Ce.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function N8(e, t, n) {
  const { away: a, side: s } = Ce.bug_smash, o = s * a * n, [l, r] = [t.left + Dt.margin * n, t.right - Dt.margin * n], i = Math.min(Math.max(e + o + s * Dt.reach * n, l), r), c = i - o - e, d = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function D8(e, t, n) {
  const a = Ce.bug_smash, s = Ae(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Dt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Dt.tall * n * (1 - Ae(t, a.emerge)),
      turn: 90 * (1 - Ae(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ae(t, a.gone)
    }
  };
}
function q8(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = Kk({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Be = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function j8(e) {
  const t = Be.least + Math.floor(e() * (Be.most - Be.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Be.walls[Math.floor(e() * Be.walls.length)],
    along: Be.margin + e() * (1 - 2 * Be.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function hs(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Be.margin, l = ((e.along - Be.margin + e.way * Be.speed * n / a) / s % 2 + 2) % 2, r = Be.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Be.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Be.inset : t.right - Be.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function aw(e, t) {
  const n = Ce.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Yk(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function P8(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ce.bug_shot, { frame: l, bug: r, shot: i } = aw(n, e.length), c = e.map((_, q) => ({ ...hs(_, t, Math.min(n / o.fps, Fn(q).shot)), shot: q < i })), d = Ae(l / o.frames, o.aim), [h, m] = [c[Math.max(r - 1, 0)], c[r]], v = e.map((_, q) => ({ bug: _, index: q, seconds: n / o.fps - Fn(q).shot, spot: hs(_, t, Fn(q).shot) })).filter((_) => _.seconds >= 0), b = v.flatMap((_) => {
    const q = (s == null ? void 0 : s.get(_.index)) ?? iw(_.bug, t, _.spot, s ? [] : a);
    return s == null || s.set(_.index, q), s && uw(q, _.seconds, a), cw(q, _.seconds, a);
  }), x = v.filter((_) => lw(_.bug)).map((_) => ({ seconds: _.seconds, from: _.spot })), E = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (m.x - h.x) * d, y: h.y + (m.y - h.y) * d, back: E }, slush: b, camera: x };
}
function Fn(e) {
  const t = Ce.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function F8(e, t, n, a) {
  const { limit: s, margin: o } = Ce.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, d) => {
    const h = Fn(d), m = hs(c, t, h.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), b = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), x = Math.abs(m.x - i) >= v ? i : m.x + b * v, E = b > 0 ? Math.max(i, Math.min(x, r)) : Math.min(i, Math.max(x, l)), _ = { from: i, to: E, begin: h.walk, end: h.aim };
    return i = E, _;
  });
}
function W8(e, t, n) {
  var o;
  const a = Ce.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Ae(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Se = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, sw = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function ow(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const lw = (e) => e.along * 97 % 1 < Se.camera, un = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Se.gravity * t * t });
function rw(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Se.gravity * (t.bottom - e.from.y))) / Se.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Se.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Se.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let r = e.from;
  for (let c = 0; c < l.t; c += Se.step) {
    const d = Math.min(c + Se.step, l.t), h = un(e, d), m = Xr(r, h, n);
    if (m) return { ...m, t: c + (d - c) * m.share };
    r = h;
  }
  const i = un(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function iw(e, t, n, a = []) {
  const s = ow(e.along + 1), [o, l] = sw[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: Se.count }, () => {
    const i = r + (s() - 0.5) * 2 * (Se.spread * Math.PI / 180), c = Se.speed[0] + s() * (Se.speed[1] - Se.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: Se.radius[0] + s() * (Se.radius[1] - Se.radius[0]) };
    return { ...d, ...rw(d, t, a) };
  });
}
function uw(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Se.step) {
      const l = Math.min(o + Se.step, s), r = Xr(un(a, o), un(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function cw(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...un(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Se.hold) / Se.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function H8(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = Ce.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, h = Ae(e, [0, c]), m = Ae(e, [c, c + d]);
  return l.map((v) => {
    const b = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * h,
      y: n.y + (b.y - n.y) * h,
      r: v.size * t * (0.15 + 0.85 * h * h),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: h >= 1
    };
  });
}
function U8(e, t, n, a, s) {
  const { sway: o, above: l } = Ce.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], h = (x) => {
    const [E, _] = [x.x - e.at.x, x.y - e.at.y];
    return { x: r.x + E * c - _ * d, y: r.y + E * d + _ * c };
  }, [m, v] = [...n].sort((x, E) => x.x - E.x), b = e.ends.map(h);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: b.map((x, E) => ({ from: x, to: E < b.length / 2 ? m : v })) };
}
const z8 = (e, t) => Ae(t, e.grows) * (1 - Ae(t, e.sinks));
function Qn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: rn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: rn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function V8(e, t) {
  const n = Ce[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Qn(n, t), l = 1 - (1 - n.small) * Ae(a, n.shrinks) * (1 - Ae(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Qn(n, t), o = n.flat * Ae(a, n.squashes) * (1 - Ae(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * rn(s, ...n.springs)) * (1 - rn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const G8 = (e) => e === "pack_box";
function K8(e) {
  const { into: t, out: n } = Qn(Ce.rope_swing, e);
  return 1 - Ae(t, [0, 1]) * (1 - Ae(n, [0, 1]));
}
function Y8(e) {
  const t = Ce.rope_swing, { into: n, out: a } = Qn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ae(n, [0, 1]) * (1 - Ae(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const dw = { after: 3 }, Ps = 10, fw = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, hw = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, mw = { weight: 19 }, Qr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, pw = { every: 120 }, Zr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ei = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, gw = {
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
}, yn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ps }), le = (e, t, n = {}) => yn(e, "clip", t, n), La = (e, t, n = {}) => yn(e, "look", t, n), Yo = (e, t, n = {}) => yn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...yn(e, "pick", t, n), ...a }), we = (e) => yn("nothing", "nothing", e, {}), vw = 120, yw = 300, Na = (e, t) => ({ ...le(e, t), cooldown: yw }), ce = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), bw = () => [le("joy", 2)], bt = (e, t, n, a, s = {}) => ({ ...le(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), kt = (e) => ({ ...e, cooldown: fw[e.name] }), Yt = (e) => ({ ...e, shenanigan: !0, lasts: hw[e.name] }), fa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ce("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [le("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ce("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...kt(le("bug_shot", 3)), toward: "", onto: !1 },
    { ...kt(le("bug_smash", 2)), toward: "", onto: !1 },
    le("nod", 2)
  ]),
  ...ce("tests_failed", { cooldown: 20, toward: "card" }, [le("startled", 2), le("dismay", 1), le("tantrum", 3), we(1)]),
  ...ce("committed", { cooldown: 30, toward: "card", onto: !0 }, [le("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ce("sin_fixed", { cooldown: 300 }, [le("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ce("sin_committed", { cooldown: 300 }, [le("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...ce("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [le("nod", 4), le("hand_rub", 4), we(7)]),
  ...ce("question_asked", { cooldown: 60 }, [le("ask_sign", 9), le("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ce("reported", { cooldown: 90 }, [Yo("read", 3), le("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ce("read_message", { cooldown: 30 }, [Yo("read", 3), we(1)]),
  ...ce("fact_filed", { cooldown: 120 }, [le("file_card", 3), le("nod", 1), we(6)]),
  ...ce("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [le("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ce("bar_done", { holds: !0 }, bw()),
  ...ce("bar_failed", { holds: !0 }, [le("fume", 1), le("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ce("standing", { cooldown: 12 }, [le("look_left", 2), le("look_right", 2), le("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ce("launched", { cooldown: 300 }, [le("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...ce("building", { cooldown: 30 }, [le("wipe_brow", 4), le("look_left", 1), le("look_right", 1), we(69)]),
  ...ce("failed", { cooldown: 20, toward: "card" }, [le("shake", 3), le("tantrum", 2), we(2)]),
  ...ce("refused", { cooldown: 20 }, [le("shake", 1), we(1)]),
  ...ce("work_done", { cooldown: 120 }, [le("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ce("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...ce("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...ce("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...ce("answered", { cooldown: 15 }, [La("amused", 3), we(2)]),
  ...ce("heard", { cooldown: 30 }, [
    le("bow", 1, { voices: ["butler"] }),
    le("salute", 1, { voices: ["squire"] }),
    le("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...ce("long_walk", { cooldown: 90 }, [le("stumble", 3), we(22)]),
  ...ce("card_arrived", { cooldown: 20, toward: "card" }, [le("glance", 7), we(13)]),
  ...ce("typing", { cooldown: 60 }, [La("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(gw).flatMap(([e, t]) => ce(`reacted:${e}`, {}, [La(t, 1)])),
  ...Object.entries(Zr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => ce(`agent_reacted:${n}`, {}, [le(a, 1, { voices: [e] })])[0])),
  ...Object.entries(ei).flatMap(([e, t]) => ce(`agent_reacted:${e}`, {}, [le(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ce("pastime", {}, [
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
    { ...Yt(kt(le("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Yt(kt(le("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ce("held:search", { cooldown: vw }, [Na("search", 3), { ...Na("binoculars", 2), when: { home: !0 } }, { ...Na("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ce("held:type", {}, [le("type", 3), le("type_ponder", 1)]),
  ...ce("held:compacting", {}, [le("pack_box", 3), le("vacuum", 2), le("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ce("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ce("tickled", {}, [{ ...kt(le("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ce("eager", {}, [le("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ce("jump", {}, [Yt(kt(le("backflip", 7, { high: !0 }))), le("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ce("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ce("unit", { cooldown: Qr.build.cooldown }, [be("unit", mw.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ce("progress_jump", { cooldown: 6 }, [le("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ce("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: pw.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...ce("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ce("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    Yt(be("bubble", 15, {}, { stay: [30, 80] })),
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
    Yt(kt(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ce("laptop", {}, [be("seat", 6, {}, { stay: [60, 150] }), be("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ce("ledge_at", {}, [be("middle", 2, {}, { along: 1 / 2 }), be("third", 1, {}, { along: 1 / 3 }), be("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ce("composed_as", {}, [
    be("facing", 4, {}, { turn: 0, leans: 0 }),
    be("turned_left", 1, {}, { turn: 335, leans: 0 }),
    be("turned_right", 1, {}, { turn: 25, leans: 0 }),
    be("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    be("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], ti = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), ni = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), kw = (e) => Array.isArray(e) ? e[0] : e, ww = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, $w = (e) => fa.some((t) => t.when.moment === e);
function xw(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || ni(d).every(([h, m]) => n(h) >= kw(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = fa.filter((d) => ti(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= dw.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ve(e, t) {
  const n = xw(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (ai(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function ai(e, t, n) {
  var a;
  for (const [s, o] of ni(t)) (a = e.memory) == null || a.set(s, e.now + ww(o, n));
}
function J8(e, t, n) {
  ai(e, fa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const X8 = (e) => Object.values(Qr).find((t) => ti(t.when, e)) ?? null, Sw = (e, t, n) => n - t <= (e.lifetime ?? Ps), Q8 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Jr(e.clip, t));
class si {
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
const ms = {
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
}, Z8 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), oi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), e3 = {
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
}, t3 = 120, Mw = 20, n3 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Mw), _w = (e) => ms[e] || ms.idle, a3 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, li = "airborne", Cw = "landing", Ew = "travelling", ri = "grounded", s3 = ({ airborne: e, landing: t, trip: n }) => e ? li : t ? Cw : n != null && n.started ? Ew : ri;
function o3(e, t) {
  var s;
  const n = Aw(e, t);
  return e.mode === ri && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Aw(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: d, doingFacing: h = 0, readingFacing: m = null } = e;
  if (n === li && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Ow(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : _w(c), facing: v ? m : r.posture === "sit" ? r.face : h };
}
function Ow(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ps = (e) => e.outcome, Tw = "plugin:code-commandments:sins:", Jo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Tw), Rw = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Jo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Jo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], l3 = (e, t) => e.filter((n) => n.author === "user" && Yn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Yn(n.read_at), card: kr(n) })).sort((n, a) => n.time - a.time), Xo = { user: "reacted", agent: "agent_reacted" };
function r3(e, t) {
  return e.filter((n) => Xo[n.author] && Et(n) > t).map((n) => ({ beat: `${Xo[n.author]}:${n.emoji}`, time: Et(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Iw = [.../* @__PURE__ */ new Set([...Object.values(Zr).flatMap((e) => Object.keys(e)), ...Object.keys(ei)])];
function i3(e, t) {
  return e.filter((n) => n.author === "agent" && Et(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Iw.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Et(n), card: kr(n) })).sort((n, a) => n.time - a.time);
}
const Bw = (e) => new si(e).isTest(), Zn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ps(e)] || "";
}, Lw = 1800, Nw = (e, t) => {
  if (Zn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Zn(n) !== "finished" && Number(e.time) - Number(n.time) <= Lw ? "tests_fixed" : "tests_passed";
};
function u3(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Bw), s = a.filter((r) => Zn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Zn(r))), o.map((r) => ({ beat: Nw(r, s), time: Number(r.time), card: r.key }));
}
function c3(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ps(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ps(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const d3 = (e) => e.map((t) => {
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
function f3(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function h3(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function m3(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Rw.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Fs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Qo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Dw(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Fs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function p3(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : $w(`held:${e}`) ? "idle" : e;
}
const Ie = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function g3(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ie.ahead * n ? 180 : Math.sign(a) * Ie.turn;
}
const Zo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function v3(e, t) {
  const n = Math.min(Ie.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ie.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ie.lines, Math.floor((e.bottom - e.top - 2 * a) / Ie.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ie.sweep) % s, r = o % Ie.sweep, i = Ie.sweep - Ie.returnSeconds, c = Zo((r - i) / Ie.returnSeconds), d = r <= i ? Zo(r / i) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Ie.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const el = 3, ii = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, tl = 12, y3 = (e, t) => ({ mood: e, began: t, seen: 0 });
function b3(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!ii(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= el ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * tl) / tl, lasts: el } };
}
const k3 = (e) => e.posture === "hang" && !ii(e.face), qw = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), jw = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function w3(e, t, n) {
  return qw.has(e) ? 1 / 0 : !jw.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(ui(n - t.began, t.share) - at.lead, 0);
}
const Pw = 5;
function $3(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Pw ? { beat: "long_walk", time: n } : null };
}
const Fw = 30, Bn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function x3(e, t, n, a, s = null) {
  if (t && n < t.until || !Bn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, r] = Bn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Bn.every } : { state: e, began: 0, until: 0, next: n + Bn.every };
}
const S3 = (e, t, n) => t && n < t.until && oi.has(e.state) ? { state: t.state, since: t.began } : e, at = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, ui = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function M3(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = ui(o, e.share);
  return s ? { eager: Ww(t, l), moment: null } : l > at.lead ? { eager: t, moment: null } : l < at.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > at.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < at.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Ww(e, t) {
  return e.on && t > at.lead + at.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= at.lead && t >= at.least ? { ...e, on: !0, calm: !1 } : e;
}
const Hw = 1, Uw = { look: "look", gaze: "gaze" };
function zw(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Uw[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Vw = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Gw = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > Hw * t, memory: a, now: s, room: o }, n).name === "backflip", Kw = { work: ["building"], idle: ["standing"] };
function _3(e, t, n, a) {
  const s = ms[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Kw[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), oi.has(e) ? { moments: o, began: n || a } : (n && a - n >= Fw && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Yw(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const nl = { pondering: Yw };
function C3(e, t, n, a, s, o) {
  if (nl[e.beat]) {
    const r = nl[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = zw(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ps && { lifetime: l.lifetime } } } : null;
}
function E3(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Vw(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const A3 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function O3(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function T3(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const R3 = (e, t) => !!(e != null && e.watches) && !t.once, I3 = 10, B3 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Sw(a, a.queuedAt, n)), L3 = (e, t) => t ? null : e[0] ?? null;
function N3(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const D3 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Jw = 2 * Math.PI, Xw = 500;
function q3(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Xw, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Jw * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (c ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Zw(v, t, n, m, s) : t2(v, t, n, m) : t) ?? v, E = x != null && x.behind && x.mood === "reading" ? Qw(e.point, x, n, l, s) : x;
  return { point: E ?? null, toward: E ? { x: E.x - n.x, y: E.y - n.y } : null, amount: h, at: a };
}
function Qw(e, t, n, a, s) {
  const o = ($) => $ * 180 / Math.PI, l = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = h ? l(e.readingFacing - r) : 0, v = h ? e.readingYaw + m : d, b = v + l(c - v), x = Math.min(Math.max(a / 1e3, 0), 0.1), E = Ie.turnSpeed * x, _ = h ? v + Math.min(Math.max(b - v, -E), E) : b, q = h ? e.readingFollow + m : _, U = q + (_ - q) * (1 - Math.exp(-x / Ie.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, L = o(Fs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), P = Math.min(Math.max(L, -j.up), j.down), O = Ie.tipSpeed * x, T = h ? e.readingPitch + Math.min(Math.max(P - e.readingPitch, -O), O) : P;
  return { ...t, readingYaw: _, readingFollow: U, readingPitch: T, readingFacing: r };
}
function Zw(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (q) => {
    const { yaw: U, pitch: j } = Fs(q.x - n.x, s, n.y - q.y, o);
    return { yaw: U, pitch: Math.min(Math.max(j, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [Qo(r(e)), Qo(r(t))], d = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [m, v] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, x, E] = i.map((q, U) => m * q + v * c[U]), _ = s * b / x;
  return { ...t, x: n.x + _, y: n.y - Dw(_, s, -Math.asin(Math.min(Math.max(E, -1), 1)), o) };
}
const e2 = 0.15;
function j3(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= e2;
}
function t2(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const n2 = (e) => !(e != null && e.on);
function P3(e, t, n) {
  if (n2(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const cn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, et = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Da = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), al = (e) => e * e * (3 - 2 * e);
function a2(e) {
  if (e < 0 || e >= et.seconds) return null;
  const t = Da(e, ...et.flicker), n = Math.floor(t * et.flickers * 2) % 2 === 0, a = e < et.flicker[1] ? n ? 0.35 + 0.5 * t : et.dim : 1;
  return { strength: 1 - al(Da(e, ...et.fade)), lit: a, white: e < et.flash[0] ? 0 : 1 - al(Da(e, ...et.flash)) };
}
const F3 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function W3(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = a2(t - e.at);
  return a && { colour: cn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: et.signs[e.tone], ...a } };
}
function H3(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function U3(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= cn.looks || a === null && n - e.since >= cn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function z3(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const dt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, V3 = { behind: 39, figure: 40, ahead: 41 }, s2 = "[data-figure-pile]", o2 = { amber: [1, 0.69, 0.125], good: cn.colours.good, bad: cn.colours.bad }, Wn = { phases: 4, ms: 230, dim: 0.25 }, G3 = (e, t, n) => e !== "amber" || (t + n) % Wn.phases < Wn.phases / 2 ? 1 : Wn.dim, K3 = (e) => e === "amber" ? Wn.phases : 1;
function Y3(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const J3 = Object.keys(o2), Ge = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Qt = ([e, t], n) => e + n() * (t - e);
function X3(e) {
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
const qa = { high: 3, gap: 1 };
function Q3(e) {
  const t = Math.floor(e / qa.high);
  return { left: -(dt.inside + dt.width / 2 + t * (dt.width + qa.gap)), up: e % qa.high * (dt.height - dt.top) };
}
const l2 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, r2 = { after: 5 }, i2 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new si(t).isBuild());
function Z3(e, t, n) {
  const a = i2(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= r2.after ? s : null;
}
function eS(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: l2(n, a, s) } : null;
}
const sl = { ahead: 140, up: 70 };
function tS(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * sl.ahead, y: a - sl.up } } : o ? { at: { x: n(o), y: a - o.up - dt.height } } : t ? { at: null } : null;
}
const ja = { least: 4e3, most: 1e4 }, u2 = (e) => ja.least + e() * (ja.most - ja.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function nS(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = u2(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), a = o + wt.ms;
  }
}
const aS = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), sS = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), ci = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), oS = new Set(fa.filter((e) => ci.has(e.when.moment) && e.type === "clip").map((e) => e.name)), c2 = (e) => e.some((t) => t.state === "built"), lS = (e, t) => c2(t) ? e.filter((n) => !ci.has(n.beat)) : e, mt = { reach: 40, room: 6 }, d2 = (e, t) => t <= e - mt.reach + 2, rS = (e, t, n) => d2(e, n) ? t - mt.reach : e - mt.reach - mt.room, iS = (e, t, n, a) => a > 0 && t < e && t + mt.reach >= e - 2 ? Math.min(n, Math.max(e, t + mt.reach)) : e, Pa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, uS = (e) => Qt(e() < Pa.longShare ? Pa.long : Pa.short, e), f2 = 2 * dt.width;
function cS(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= f2 ? o : e + (o - e + s / 2) % s;
}
const h2 = 60, dS = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= h2, ol = "[data-figure-home]", bn = () => {
  var t;
  const e = document.querySelector(ol);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ol)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, m2 = "[data-figure-docked-bars]", p2 = "[data-figure-chat-foot]", g2 = [0.85, 0.6, 0.35, 0.15], v2 = ["question", "waiting", "suggestion"], fS = (e, t) => v2.find((n) => e[n] > 0 && t[n] === "behind") || null;
function hS() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const y2 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", b2 = "[data-figure-newest]";
function di() {
  var a, s;
  const e = (a = bn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(b2), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ws(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function dn(e, t, n = di()) {
  if (!e || !n) return !0;
  const a = rt(e, t), s = ma(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Re.top * t.size, bottom: a.top + Re.bottom * t.size }, l = St.gap;
  return !ha(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function mS(e, t, n, a = di()) {
  if (!a || dn(t, e, a)) return null;
  const s = ma(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ot(), i = t.posture === "stand" ? Us * e.size : bi * e.size, c = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - St.gap - l, a.right + St.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= c && m.x <= d && dn(m, e, a) && K2(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Fa = 0.26, fi = 0.54, k2 = 1.25 / 5.4, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Fa, travels: "stand" },
  lounge: { drop: Fa, travels: "stand" },
  composed: { drop: Fa, travels: "stand" },
  hang: { drop: fi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, pS = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * k2 * Math.cos(t * Math.PI / 180),
  y: 1 - n - fi
}), tn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), w2 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), gS = (e, t) => (e === "sit" ? w2.has(t) : tn.has(e)) ? e : "stand";
function vS(e, t) {
  return e.facing === t.facing || !tn.has(e.posture) && !tn.has(t.posture) ? t : { posture: "stand", facing: tn.has(e.posture) ? e.facing : t.facing };
}
const yS = 0.25, bS = (e, t) => tn.has(e) && kn[t].drop === 0, hi = 2, $2 = 90, x2 = 180, S2 = 140, M2 = 280, _2 = 420, C2 = 0.25, E2 = 290, A2 = 600, O2 = "cubic-bezier(0.2, 0.7, 0.4, 1)", T2 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Wa = 5;
function ea(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Wa) return null;
  (l || r) && (o = Math.max(o, hi));
  const v = o > 1, b = Math.abs(t.x - e.x), x = b < Wa ? 0 : b / ($2 * o) * 1e3, E = Math.min(x, v ? S2 : x2), _ = Math.abs(t.y - e.y), q = t.y < e.y, U = q && !m && Gw(_, n, i, c, d, h), j = q ? _2 + Math.min(_, 400) * C2 : Math.sqrt(2 * _ / js) * 1e3, L = {
    x: t.x,
    y: t.y,
    ms: _ > Wa ? U ? A2 : j : 0,
    lead: U ? E2 : q ? M2 : 0,
    easing: q ? O2 : T2,
    hopping: !0,
    clip: U ? "backflip" : q ? "jump" : "fall"
  }, P = { x: t.x, y: t.y, ms: x + E, lead: 0, easing: "linear", ramp: E, ...v ? { clip: "run" } : {} }, O = m ? R2(t, n) : L, T = q && !a ? [{ ...P, y: e.y }, O] : [{ ...L, x: e.x }, P];
  return { way: Math.sign(t.x - e.x) || 1, legs: T, lands: !s, pace: o, running: v };
}
const R2 = (e, t) => ({ x: e.x, y: e.y, ms: Ce.pogo.frames / Ce.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), I2 = (e, t) => e.postures.includes(t) ? t : e.postures[0], kS = (e, t, n) => e.posture === "walk" && n ? "walk" : I2(e.clip, t), rt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - kn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ha = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ws = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = bn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Ln = 0.5, ll = 20;
function wS(e, t, n = Ot()) {
  const a = rt(e, t);
  return a.left >= n.left + ll && a.right <= n.right - ll;
}
function Hs(e, t, n = Ot()) {
  const a = rt(e, t), s = a.right - a.left, o = ma(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Ln && r <= n.right + Ln && a.top >= n.top - Ln && i <= n.bottom + Ln;
}
const ta = [0.35, 0.5, 0.65], na = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Re = { left: ta[0], right: ta.at(-1), top: na[0], bottom: na.at(-1) }, B2 = 0.24;
function ma(e) {
  if (e.posture === "stand") return { left: Re.left, right: Re.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + B2 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Re.left, t), right: Math.max(Re.right, t) };
}
function L2(e, { size: t }, n = Ot()) {
  const a = ma(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Us = (Re.right - Re.left) / 2 + 0.08;
function $S(e, t) {
  return e === "hang" ? Re : { ...Re, bottom: Math.min(Re.bottom, 1 - t - kn[e].drop) };
}
const N2 = "[data-figure-agent]";
function mi(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Ws(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[i].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, i), c.setEnd(o, i + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const pi = (e) => na.flatMap(
  (t) => ta.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function zs(e, t, n = "") {
  if (!dn(e, t)) return ta.length * na.length;
  const a = rt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(y2)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && ha(s, i) && Ws(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return pi(s).filter(([r, i]) => l(r, i) || mi(r, i, n)).length;
}
function D2(e, t) {
  const n = rt(e, t);
  return pi({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => mi(a, s, "", N2)).length;
}
const rl = 4;
function xS(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = rl; o <= s; o += rl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!D2(r, e) && dn(r, e)) return r;
    }
  return null;
}
function fn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Hs(l, t, a) && dn(l, t)).map((l) => ({ spot: l, covered: zs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const gi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), q2 = [0.5, 0.25, 0.75], j2 = (e) => gi(e.getBoundingClientRect(), q2), vi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, P2 = Us, F2 = (e, t, { size: n }, a = P2) => yi(e, vi[t], a * n, "stand");
function yi(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const W2 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, bi = 0.1, H2 = (e, t, { size: n }) => yi(e, W2[t], bi * n, "sit"), U2 = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ha = 60;
function SS(e, t) {
  const n = U2(t);
  return !e.aside || Math.abs(n) >= Ha ? t : n < 0 ? 360 - Ha : Ha;
}
const nn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, z2 = (e) => [.../* @__PURE__ */ new Set([e, ...nn.turns.map((t) => (t + 360) % 360)])];
function MS(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = z2(t), l = nn.every[0] + a() * (nn.every[1] - nn.every[0]);
  return { face: t, from: s ? V2(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function V2(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / nn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function _S(e, t) {
  const { element: n, edge: a } = pa(), s = ["left", "right"].map((r) => wn(H2(a, r, e), e)).filter((r) => n && Hs(r, e) && !zs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function CS(e, t, { size: n }) {
  const a = (Re.right - Re.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - ki } : e;
}
const ki = 7;
function wi() {
  const e = [...document.querySelectorAll(s2)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function G2(e, t) {
  const n = rt(e, t), a = n.right - n.left;
  return { left: n.left + Re.left * a, right: n.left + Re.right * a, top: n.top + Re.top * a, bottom: n.bottom };
}
function K2(e, t) {
  const n = wi();
  return !n || !ha(G2(e, t), n);
}
const Y2 = 4;
function pa() {
  const e = $n(), t = wi(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Y2 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - ki - n, 0) } };
}
const ES = ({ size: e, below: t }) => (1 - t) * e;
function wn(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = kn[e.posture].drop * a;
  return { ...L2(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const gs = (e, t) => Object.keys(vi).map((n) => wn(F2(e, n, t), t)), Vs = (e, t) => gi(e, g2).map((n) => wn(n, t)), $i = (e, t, n) => fn(e, t, n) ?? e[0];
function AS(e, t) {
  const { element: n, edge: a } = pa();
  return { ...$i(gs(a, e), e, t), view: null, on: n };
}
function OS(e, t, n, a) {
  const { element: s, edge: o } = pa(), l = (a ? gs(o, t) : [...gs(o, t), ...Vs(o, t)]).filter(
    (c) => !ha(rt(c, t), e)
  ), r = fn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !zs(r, t) ? r : fn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function $n() {
  var a;
  const e = bn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(m2);
  if (!t) return { ...ga(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const il = { within: 2 };
function TS(e) {
  const { element: t, docked: n, edge: a } = $n();
  if (!n || e.on !== t) return !0;
  const s = ga().edge;
  return a.left > s.left + il.within || a.left + a.width < s.left + s.width - il.within;
}
const J2 = "[data-figure-closing]";
function RS() {
  var n;
  const { element: e, docked: t } = $n();
  return t && !!((n = e.firstElementChild) != null && n.matches(J2));
}
const xi = "[data-figure-progress]";
function IS(e) {
  const t = e.querySelector(xi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function BS(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const X2 = { across: 300, above: 380, below: 60 };
function LS(e) {
  const { across: t, above: n, below: a } = X2;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Q2(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Q2 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Si = "[data-figure-bar]", vs = { back: 144, along: 0.4 };
function NS(e) {
  const { element: t, docked: n, edge: a } = $n(), s = n ? t.querySelector(Si) : null;
  if (!(s != null && s.querySelector(xi))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...wn({ x: o - vs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function DS(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < vs.along * a.size ? t.x + vs.along * a.size : e.x, y: e.y, behind: !0 };
}
function qS(e) {
  const t = e.querySelector(Si), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ga() {
  const e = bn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function jS(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ga(), i = n === null ? Z2(r, e, o === null ? t : { x: o, y: r.top }, a, s) : wn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Z2(e, t, n, a, s) {
  const o = Vs(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + dt.width < s && i.x + a - mt.reach - mt.room >= l);
  return fn(r.length ? r : o, t, n);
}
const e5 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function PS(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: d = 0, room: h = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, hi));
  const v = (U) => {
    const j = rt(U, n, kn[U.posture].travels);
    return { x: j.left, y: j.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return t5(v(e), v(t), v({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [x, ...E] = [e, ...i, t].map(v), _ = ea(x, E[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: d, room: h, pogo: m }), q = E.slice(1).map((U, j) => {
    var L;
    return (L = ea(E[j], U, n.size, { random: r, memory: c, now: d, room: h })) == null ? void 0 : L.legs.find((P) => P.hopping);
  });
  return _ && { ..._, legs: [..._.legs, ...q.filter(Boolean)] };
}
function t5(e, t, n, a, s, o, l) {
  const r = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / e5.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? ea(e, n, o.size, { pace: l }) : ea(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function FS(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function WS(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && fn(j2(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = pa();
  return { ...$i(Vs(s, t), t, n), view: null, on: a };
}
const n5 = "[data-figure-bubble]", a5 = 250;
let an = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Mi = 0;
const Gt = () => an, Ua = /* @__PURE__ */ new WeakMap();
let s5 = 0;
function Gs(e) {
  return Ua.has(e) || Ua.set(e, `floor-${++s5}`), Ua.get(e);
}
const o5 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, l5 = () => {
  var e, t;
  return ((t = (e = bn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function r5(e, t) {
  var a;
  const n = (a = e.querySelector(p2)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function i5(e, t) {
  const n = e && r5(e, t), a = e ? [...e.querySelectorAll(n5)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || o5(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Gs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const u5 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= a5 ? (t.top - a.top) / s * 1e3 : 0;
};
function _i(e = an, t = performance.now()) {
  const n = Ot(), a = l5(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = $n(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = ga();
  return c.element && i.push({ id: Gs(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...i5(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: u5(e, d, t) }))) });
}
const ys = /* @__PURE__ */ new Set();
function c5(e) {
  return ys.add(e), () => ys.delete(e);
}
function d5() {
  Ci();
  const e = () => {
    Mi = requestAnimationFrame(e), !document.hidden && (an = _i(an), ys.forEach((t) => t(an)));
  };
  e();
}
function Ci() {
  cancelAnimationFrame(Mi);
}
const Ks = 5, f5 = 56, h5 = { share: 0.6 }, m5 = (e) => -Math.sqrt(2 * js * h5.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function HS(e, t = _i().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Gs(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Ei({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Gt().floors) {
  const c = Wt(i, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || p5(c, d, o)) && g5(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ys = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, p5 = (e, t, n) => !Ys({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function US(e, t = Gt().floors) {
  if (!Ys(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ks && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function g5(e, t, n = Gt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && rt(e, t).bottom >= a.top ? !1 : Hs(e, t);
}
function zS(e, t, n, a = Gt().floors) {
  const s = Ei(e, n, a);
  if (!e.home) return v5(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, r = l > Ks ? "dropping" : -l > f5 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function v5(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: m5(e.risen) };
  if (!n) return null;
  if (Ys(t) && n.y - t.y > Ks) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function VS(e, t, n) {
  const a = Us * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function GS(e, t, n, a = Gt().floors) {
  const s = t && Ei(t, n, a);
  return s ? { ...e, ...s } : e;
}
const y5 = ["data-type"], b5 = { class: "figure-floor-name" }, k5 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", b5, y(e.floor.type), 1)
    ], 12, y5));
  }
}, w5 = /* @__PURE__ */ V(k5, [["__scopeId", "data-v-4e0f1e2e"]]), $5 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, x5 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ye(Gt().floors);
    let n = () => {
    };
    return Te(() => {
      n = c5((a) => t.value = a.floors), d5();
    }), Le(() => {
      n(), Ci();
    }), (a, s) => (u(), f("div", $5, [
      (u(!0), f(W, null, te(t.value, (o) => (u(), H(w5, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, KS = /* @__PURE__ */ V(x5, [["__scopeId", "data-v-e519168b"]]), za = (e) => typeof e == "number" ? e : Date.parse(e);
function YS(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: za(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => za(s.row.created_at) - za(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const S5 = 3, Va = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function M5(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Va[n.grouping]) == null ? void 0 : a.call(Va, e.row, n)) || "";
}
function _5(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function JS(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= S5 ? [_5(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = M5(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function XS(e) {
  const t = Ue(), n = t.option("row"), a = A(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), pe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function C5(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const QS = (e) => (t) => t.filter((n) => n.id !== e), ZS = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), e6 = (e) => (t) => [...t, e], t6 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function n6(e, t = {}) {
  const n = Ue(), a = A(null), s = A("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function a6(e) {
  const t = Ue(), n = A("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Nn = /* @__PURE__ */ new Map();
function E5(e, t) {
  if (Nn.has(e)) return Nn.get(e);
  const n = t().finally(() => Nn.delete(e));
  return Nn.set(e, n), n;
}
function s6() {
  const e = Ue(), t = A(null), n = A("");
  async function a() {
    const s = await E5(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const A5 = { class: "cards-page" }, O5 = { class: "cards-bar" }, T5 = { class: "cards-count" }, R5 = { class: "cards" }, I5 = {
  key: 1,
  class: "cards-note"
}, B5 = {
  key: 2,
  class: "cards-note"
}, L5 = ["data-row", "onClick"], N5 = { class: "card-head" }, D5 = { class: "card-title" }, q5 = { class: "card-foot" }, j5 = {
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
    return (a, s) => (u(), f("div", A5, [
      g("div", O5, [
        g("span", T5, y(e.rows.length) + " " + y(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        B(de, Ne({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            B(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + y(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", R5, [
        e.loaded ? e.failure ? (u(), f("p", I5, y(e.failure), 1)) : e.rows.length ? S("", !0) : (u(), f("p", B5, "No " + y(e.noun) + "s yet", 1)) : (u(), H(lt, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(W, null, te(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          g("span", N5, [
            B(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + y(e.head(o)), 1),
            B(Je, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", D5, y(e.title(o)), 1),
          g("span", q5, y(e.foot(o)), 1)
        ], 8, L5))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, o6 = /* @__PURE__ */ V(j5, [["__scopeId", "data-v-990e6b37"]]), ul = "newest";
function l6(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Oe(qe, null)) == null ? void 0 : c.search, s = A(""), o = A(ul), l = A("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((m) => C5(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === ul ? h : [...h].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const P5 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, F5 = 40, W5 = "top", H5 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var h;
    const n = e, a = (h = Oe(qe, null)) == null ? void 0 : h.autoScroll, s = I(() => a === W5), o = A(null), l = A(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= F5;
    }
    return pe(() => n.rowCount, async () => {
      await Qe(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (u(), f("div", P5, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(m.$slots, "default", {}, void 0, !0)
      ], 34),
      B(Ut, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: D(() => [
          De(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            B(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ee(" Newest ", -1))
          ], 512), [
            [bl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, r6 = /* @__PURE__ */ V(H5, [["__scopeId", "data-v-3accb764"]]), U5 = ["aria-selected", "data-tab", "onClick"], z5 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, V5 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(qe, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = A(null), r = A({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function c(m) {
      var b;
      const v = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => Qe(() => c(!0));
    let h = null;
    return Te(() => {
      var m;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (m = document.fonts) == null || m.ready.then(() => c(!1));
    }), Le(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), pe(() => n.answer, d, { deep: !0 }), (m, v) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(W, null, te(o.value, (b) => {
        var x, E;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: J(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === b.key }]),
          "aria-selected": ((E = e.active) == null ? void 0 : E.key) === b.key,
          "data-tab": b.key,
          onClick: (_) => a("choose", b)
        }, [
          ee(y(b.label) + " ", 1),
          i(b) ? (u(), f("span", z5, y(e.answer[b.count_field]), 1)) : S("", !0)
        ], 10, U5);
      }), 128)),
      g("i", {
        class: J(["inner-tabs-line", { slides: r.value.slides }]),
        style: ve({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, i6 = /* @__PURE__ */ V(V5, [["__scopeId", "data-v-63fcd326"]]), G5 = {
  class: "tab-body",
  "data-tab-body": ""
}, K5 = { "data-tab-content": "" }, Y5 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = A(!1);
    let a = 0;
    return pe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, $s(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", G5, [
      n.value ? (u(), H(lt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : S("", !0),
      De(g("div", K5, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [bl, !n.value]
      ])
    ]));
  }
}, u6 = /* @__PURE__ */ V(Y5, [["__scopeId", "data-v-63876533"]]), J5 = {}, X5 = { class: "menu-label" };
function Q5(e, t) {
  return u(), f("span", X5, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const bs = /* @__PURE__ */ V(J5, [["render", Q5], ["__scopeId", "data-v-aa955b3e"]]), Z5 = {
  class: "search-bar",
  "data-search-bar": ""
}, e$ = { class: "search-bar-control" }, t$ = ["value", "placeholder", "aria-label"], n$ = ["aria-expanded"], a$ = {
  key: 0,
  "data-menu-count": ""
}, s$ = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var _;
    const a = e, s = n, o = Hi(), l = ((_ = Oe(qe, null)) == null ? void 0 : _.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], c = A(null), d = A(null), h = A([]), m = I(() => h.value.length ? h.value[h.value.length - 1].next : i), v = I(() => !!o.menu || i.length > 0), b = (q) => {
      h.value = [], d.value = d.value ? null : q.currentTarget;
    };
    function x(q) {
      if (q.next.length) {
        h.value = [...h.value, q];
        return;
      }
      d.value = null, s("pick", q.click);
    }
    function E() {
      var q;
      s("update:modelValue", ""), (q = c.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = c.value) == null ? void 0 : q.focus();
    } }), (q, U) => {
      var j;
      return u(), f("div", Z5, [
        g("div", e$, [
          B(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          g("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: U[0] || (U[0] = (L) => s("update:modelValue", L.target.value)),
            onKeydown: jt(E, ["esc"])
          }, null, 40, t$),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: E
          }, [
            B(ye, {
              name: "close",
              size: 12
            })
          ])) : S("", !0),
          v.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: b
          }, [
            e.menuCount ? (u(), f("span", a$, y(e.menuCount), 1)) : S("", !0),
            B(ye, {
              name: "caret",
              size: 12
            })
          ], 8, n$)) : S("", !0)
        ]),
        (j = N(l).button) != null && j.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (L) => s("pick", N(l).button.click))
        }, y(N(l).button.title), 1)) : S("", !0),
        me(q.$slots, "default", {}, void 0, !0),
        d.value ? (u(), H(ra, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = xe(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (L) => d.value = null)
        }, {
          default: D(() => [
            h.value.length ? (u(), H(Ct, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (L) => h.value = h.value.slice(0, -1))
            }, {
              default: D(() => [
                ee("‹ " + y(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : S("", !0),
            (u(!0), f(W, null, te(m.value, (L) => (u(), H(Ct, {
              key: L.title,
              description: L.subtext,
              "data-search-entry": L.title,
              onClick: (P) => x(L)
            }, {
              default: D(() => [
                ee(y(L.title) + y(L.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? S("", !0) : me(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : S("", !0)
      ]);
    };
  }
}, o$ = /* @__PURE__ */ V(s$, [["__scopeId", "data-v-45374bed"]]), l$ = {
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
    return (o, l) => (u(), H(o$, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: D(() => [
        B(bs, null, {
          default: D(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(W, null, te(a, (r) => B(Ct, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: D(() => [
            ee(y(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(W, { key: 0 }, [
          B(bs, null, {
            default: D(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(W, null, te(s, (r) => B(Ct, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: D(() => [
              ee(y(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : S("", !0)
      ]),
      default: D(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, c6 = /* @__PURE__ */ V(l$, [["__scopeId", "data-v-dab0064d"]]);
function d6() {
  const e = A(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const f6 = (e) => import(
  /* @vite-ignore */
  e
), r$ = 86400, ks = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function i$(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ks(t) - ks(e)) / r$);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function h6(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ks(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: i$(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ga = 280, Ka = 240, Ya = 120, u$ = 6, c$ = 14, hn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function d$(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Ai(e, t) {
  const n = Math.max(0, d$(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function f$(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${c$}px)` }), e.offsetHeight, e.style.transition = `height ${Ga}ms ${hn}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Ai(t, e));
    const m = s() - r;
    if (!i && m >= Ga && (i = !0, e.style.transition = `opacity ${Ka}ms ease-out, transform ${Ka}ms ${hn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ga + Ka) return a(h);
    d();
  };
  return a(h), d;
}
function m6(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${u$}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ya}ms ease-out, transform ${Ya}ms ${hn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Ai(t, e)), s() - l < Ya) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const h$ = 140, Dn = 220, cl = 5;
function p6({ gap: e = h$, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function i() {
    const d = n.splice(0, cl);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        h -= 1, h || (o = t(i, e));
      });
  }
  const c = (d, h, m, v = f$) => {
    if (l || !h.pane || !h.follows()) return m();
    const b = { el: d, options: h, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(b, () => o = t(i, e));
    d.style.display = "none", n.push(b), n.length >= cl && c.flush();
  };
  return c.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const h of [...a]) (d = h.cancel) == null || d.call(h);
    clearTimeout(o), s = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, c;
}
function g6(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Dn}ms ${hn}, opacity ${Dn}ms ease-in, margin ${Dn}ms ${hn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Dn);
}
const Oi = "chat.pins.minimised", Hn = A(Un(Oi, !1));
function dl(e) {
  Hn.value = e, Rs(Oi, e);
}
function m$(e) {
  const t = I(() => e()), n = I(() => Hn.value ? [] : e()), a = () => dl(!Hn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => Et(o) > s).length,
    (o, l) => o > l && dl(!1)
  ), { pins: t, visible: n, minimised: Hn, toggle: a };
}
const p$ = ["title"], g$ = {
  key: 0,
  class: "pins-count"
}, v$ = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = m$(() => t.pinRows);
    return (o, l) => N(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: N(a), inline: e.inline }]),
      title: N(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => N(s) && N(s)(...r), ["stop"]))
    }, [
      B(ye, {
        name: N(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      N(a) ? (u(), f("span", g$, y(N(n).length), 1)) : S("", !0)
    ], 10, p$)) : S("", !0);
  }
}, v6 = /* @__PURE__ */ V(v$, [["__scopeId", "data-v-d073c504"]]), y$ = ["title"], b$ = ["title"], k$ = { class: "diff-card-dir" }, w$ = { class: "diff-card-name" }, $$ = ["title"], x$ = ["title"], S$ = {
  key: 0,
  class: "diff-card-note"
}, M$ = ["href"], _$ = ["src", "alt"], C$ = { class: "diff-card-rows" }, E$ = { class: "diff-row-num" }, A$ = { class: "diff-row-sign" }, O$ = { class: "diff-row-code" }, T$ = {
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
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), c = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), h = I(() => n.change === "deleted"), m = I(() => l[n.change]), v = I(() => new Set(n.rows.filter((k) => k.line_type === "add").map((k) => k.line))), b = A("after"), x = I(() => b.value === "before" ? n.whole.old : n.whole.text), E = I(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((k, w) => ({ line_type: b.value === "after" && v.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: k })) : n.rows.filter(
      (k) => !(n.editsOnly && ["ctx", "fold"].includes(k.line_type)) && !(n.hideRemovals && k.line_type === "del")
    )), _ = A(!1), q = I(() => n.lines && !_.value && !n.whole), U = I(() => q.value ? E.value.slice(0, n.lines) : E.value), j = I(() => E.value.length - U.value.length), L = (k) => k.line === null || k.line_type === "del" ? "" : k.line, P = (k) => k.line_type === "fold" ? k.hidden ? `⋯ ${k.hidden} lines` : "⋯" : k.text, O = A(null), T = A(null);
    let $ = null;
    return Te(() => {
      if (!T.value) return;
      let k = !0;
      $ = new ResizeObserver(() => {
        !O.value || !T.value || (O.value.style.transition = k ? "none" : "", O.value.style.height = `${T.value.offsetHeight}px`, k = !1);
      }), $.observe(T.value);
    }), Le(() => $ && $.disconnect()), (k, w) => (u(), f("section", {
      class: J(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (p) => !h.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${N(s)}-click to open it`,
          onClick: o
        }, [
          g("span", k$, y(c.value), 1),
          g("span", w$, y(d.value), 1),
          m.value ? (u(), f("span", {
            key: 0,
            class: J(["diff-card-badge", e.change])
          }, y(m.value), 3)) : S("", !0)
        ], 8, b$),
        g("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + y(e.added), 3),
        g("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + y(e.removed), 3),
        B(Je, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = xe((p) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, y(b.value === "after" ? "After" : "Before"), 9, $$)) : S("", !0),
        h.value ? S("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          B(ye, {
            name: "file",
            size: 12
          })
        ], 10, x$))
      ], 8, y$),
      e.whole && e.whole.error ? (u(), f("p", S$, y(e.whole.error), 1)) : S("", !0),
      !h.value && !e.folded ? (u(), f(W, { key: 1 }, [
        e.picture ? (u(), f("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          g("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, _$)
        ], 8, M$)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            g("div", C$, [
              (u(!0), f(W, null, te(U.value, (p, M) => (u(), f("div", {
                key: M,
                class: J(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", E$, y(L(p)), 1),
                g("span", A$, y(r[p.line_type]), 1),
                g("span", O$, y(P(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = xe((p) => _.value = !0, ["stop"]))
              }, y(j.value) + " more " + y(j.value === 1 ? "line" : "lines"), 1)) : S("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : S("", !0)
    ], 2));
  }
}, y6 = /* @__PURE__ */ V(T$, [["__scopeId", "data-v-23581cbb"]]), R$ = {
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
      default: D(() => [
        B(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, I$ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, B$ = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, L$ = { class: "ask-text" }, N$ = ["placeholder", "aria-label"], D$ = ["placeholder", "aria-label"], q$ = {
  key: 3,
  class: "moves"
}, j$ = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => ak(a.noun, a.row)), l = A(""), r = A(null), i = A(""), c = A("");
    pe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, b = "") {
      const x = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, b] : v.positional ? [b] : [], ...v.opener && c.value.trim() ? ["--on", c.value.trim()] : []]);
      l.value = x.ok ? "" : x.error, x.ok && (r.value = null, i.value = "", c.value = "", s("done"));
    }
    const h = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: h }), (v, b) => o.value.length ? (u(), H(qr, {
      key: 0,
      inline: e.inline
    }, {
      default: D(() => {
        var x;
        return [
          l.value ? (u(), f("p", I$, y(l.value), 1)) : S("", !0),
          (x = r.value) != null && x.confirm ? (u(), f("div", B$, [
            g("span", L$, y(r.value.confirm), 1),
            B(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: J({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: b[0] || (b[0] = (E) => d(r.value))
            }, {
              default: D(() => [
                ee(y(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            B(de, {
              small: "",
              variant: "ghost",
              onClick: b[1] || (b[1] = (E) => r.value = null)
            }, {
              default: D(() => [...b[7] || (b[7] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (u(), f("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: xe(m, ["prevent"])
          }, [
            De(g("input", {
              "onUpdate:modelValue": b[2] || (b[2] = (E) => i.value = E),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: b[3] || (b[3] = jt(xe((E) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, N$), [
              [_t, i.value]
            ]),
            r.value.opener ? De((u(), f("input", {
              key: 0,
              "onUpdate:modelValue": b[4] || (b[4] = (E) => c.value = E),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: b[5] || (b[5] = jt(xe((E) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, D$)), [
              [_t, c.value]
            ]) : S("", !0),
            B(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: D(() => [
                ee(y(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            B(de, {
              small: "",
              variant: "ghost",
              onClick: b[6] || (b[6] = (E) => r.value = null)
            }, {
              default: D(() => [...b[8] || (b[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (u(), f("div", q$, [
            (u(!0), f(W, null, te(o.value, (E) => (u(), H(de, {
              key: E.word,
              small: !E.bordered,
              bordered: E.bordered,
              icon: E.icon,
              variant: E.main ? "primary" : "ghost",
              class: J({ danger: E.danger }),
              "data-move": E.word,
              onClick: (_) => h(E)
            }, {
              default: D(() => [
                ee(y(E.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : S("", !0);
  }
}, P$ = /* @__PURE__ */ V(j$, [["__scopeId", "data-v-bdac0207"]]), F$ = /* @__PURE__ */ new Set(["completed", "cancelled"]), W$ = (e) => F$.has(e), mn = (e) => W$(e) ? "done" : e, H$ = { class: "facts" }, U$ = { class: "fact wide" }, z$ = ["title"], V$ = {
  key: 1,
  class: "fact-value"
}, G$ = {
  key: 0,
  class: "fact"
}, K$ = { class: "fact-value" }, Y$ = { class: "fact" }, J$ = { class: "fact-label" }, X$ = ["title"], Q$ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Z$ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, e4 = {
  key: 2,
  class: "fact"
}, t4 = { class: "fact-value" }, n4 = { class: "fact wide" }, a4 = { class: "fact wide" }, s4 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, o4 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Jn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, c;
      return u(), f("div", H$, [
        g("div", U$, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (d) => N(He)(`plans:${e.place.plan_id}`))
          }, "Plan " + y(e.place.plan_id) + ": " + y(e.place.plan_title), 9, z$)) : (u(), f("span", V$, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", G$, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", K$, y(e.place.phase_number) + " of " + y(e.place.phase_total) + ": " + y(e.place.phase_title), 1)
        ])) : S("", !0),
        e.task.helper_id ? (u(), f(W, { key: 1 }, [
          g("div", Y$, [
            g("span", J$, y(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (d) => N(He)(`agents:${e.task.helper_id}`))
            }, y(e.task.helper_name), 9, X$)
          ]),
          N(o).has(e.task.state) ? (u(), f("p", Q$, y(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", Z$, y(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : S("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", e4, [
          r[6] || (r[6] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", t4, "Agent " + y(e.task.holder_id), 1)
        ])) : S("", !0),
        g("div", n4, [
          r[7] || (r[7] = g("span", { class: "fact-label" }, "Complexity", -1)),
          B(Pt, {
            options: N(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = g("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        g("div", a4, [
          r[9] || (r[9] = g("span", { class: "fact-label" }, "Priority", -1)),
          B(Pt, {
            options: N(n),
            value: String(N(Dr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", s4, y(e.refusal), 1)) : S("", !0)
        ])
      ]);
    };
  }
}, l4 = /* @__PURE__ */ V(o4, [["__scopeId", "data-v-81d598cf"]]);
function r4(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const i4 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, u4 = { ...i4, done: "Completed" }, c4 = { class: "task-status-icon" }, d4 = ["width", "height", "aria-label"], f4 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => Nl("task", mn(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => u4[t.status] ?? As("task", t.status));
    return (o, l) => (u(), f("span", c4, [
      B(Ut, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (u(), f("svg", {
            key: n.value,
            class: J(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            B(zt, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
                g("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: D(() => [...l[1] || (l[1] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                g("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: D(() => [...l[2] || (l[2] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: D(() => [...l[3] || (l[3] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: D(() => [...l[4] || (l[4] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                g("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: D(() => [...l[5] || (l[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, d4))
        ]),
        _: 1
      })
    ]));
  }
}, Js = /* @__PURE__ */ V(f4, [["__scopeId", "data-v-ae24a63f"]]), h4 = { class: "number" }, m4 = { class: "title" }, p4 = { class: "word" }, g4 = {
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
    return (a, s) => (u(), H(gt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: J(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: D(() => [
        B(Js, { status: e.status }, null, 8, ["status"]),
        g("span", h4, y(e.number), 1),
        g("span", m4, y(e.title), 1),
        g("span", p4, y(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ja = /* @__PURE__ */ V(g4, [["__scopeId", "data-v-f6417ae8"]]), v4 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, y4 = { class: "level" }, b4 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = I(() => r4(n.task.id, n.graph)), l = I(() => s.value ? o.value.above : o.value.above.slice(-1)), r = I(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = I(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, m = !1) => ({ status: mn(h.state), number: h.id, title: h.title, word: m ? "This task" : c(h.state), current: m });
    return (h, m) => o.value.above.length || o.value.below.length ? (u(), f("section", v4, [
      m[5] || (m[5] = g("h4", null, "What waits on what", -1)),
      (u(!0), f(W, null, te(l.value, (v) => (u(), f(W, {
        key: v.map((b) => b.id).join()
      }, [
        g("div", y4, [
          (u(!0), f(W, null, te(v, (b) => (u(), H(Ja, Ne({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: m[0] || (m[0] = (x) => a("select", x))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = g("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      B(Ja, Ui(zi(d(e.task, !0))), null, 16),
      (u(!0), f(W, null, te(r.value, (v) => (u(), f(W, {
        key: v.id
      }, [
        m[4] || (m[4] = g("div", { class: "waits" }, "↓ waits on", -1)),
        B(Ja, Ne({ ref_for: !0 }, d(v), {
          onSelect: m[1] || (m[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (v) => s.value = !s.value)
      }, y(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : S("", !0)
    ])) : S("", !0);
  }
}, k4 = /* @__PURE__ */ V(b4, [["__scopeId", "data-v-db05c4b2"]]), w4 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, $4 = ["datetime"], x4 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", w4, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (u(!0), f(W, null, te(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, y(new Date(a.created_at).toLocaleString()), 9, $4),
        g("p", null, y(a.reason), 1)
      ]))), 128))
    ])) : S("", !0);
  }
}, S4 = /* @__PURE__ */ V(x4, [["__scopeId", "data-v-b41f213b"]]), M4 = {
  class: "part",
  "data-resource-waits": ""
}, _4 = ["onClick"], C4 = { class: "wait-id" }, E4 = { class: "wait-title" }, A4 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", M4, [
      g("h4", null, y(e.title), 1),
      (u(!0), f(W, null, te(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        B(Js, {
          status: N(mn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", C4, y(o.id), 1),
        g("span", E4, y(o.title), 1)
      ], 8, _4))), 128))
    ]));
  }
}, fl = /* @__PURE__ */ V(A4, [["__scopeId", "data-v-8fb2e251"]]), O4 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, T4 = { class: "text" }, R4 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, I4 = 180, B4 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = A(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), f(W, null, [
      l.value.length ? (u(), H(fl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : S("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", O4, [
        c[3] || (c[3] = g("h4", null, "How it was done", -1)),
        g("p", T4, y(e.task.outcome), 1)
      ])) : S("", !0),
      e.task.brief ? (u(), f("section", R4, [
        c[4] || (c[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: J(["text", { clamped: !o.value }])
        }, y(e.task.brief), 3),
        e.task.brief.length > I4 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : S("", !0)
      ])) : S("", !0),
      r.value.length ? (u(), H(fl, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : S("", !0)
    ], 64));
  }
}, L4 = /* @__PURE__ */ V(B4, [["__scopeId", "data-v-4a3f1e79"]]), N4 = {
  class: "task-details",
  "data-task-details": ""
}, D4 = { class: "since" }, q4 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, j4 = { class: "text" }, P4 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, F4 = {
  key: 1,
  class: "note"
}, W4 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, H4 = { class: "text" }, U4 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", N4, [
        g("div", {
          class: J(["state-line", N(mn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            B(Js, {
              status: N(mn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + y(a(e.task.state)), 1)
          ]),
          g("span", D4, [
            o[5] || (o[5] = ee(" since ", -1)),
            B(Je, {
              at: N(wr)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", q4, [
          o[6] || (o[6] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", j4, y(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", P4, "Opens by itself when " + y(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", F4, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", W4, [
          o[7] || (o[7] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", H4, y(e.task.reason), 1)
        ])) : S("", !0),
        e.graph ? (u(), H(k4, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : S("", !0),
        B(l4, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        B(L4, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        B(S4, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, z4 = /* @__PURE__ */ V(U4, [["__scopeId", "data-v-7e73fa21"]]), V4 = 50, G4 = { messages: 25 }, K4 = (e) => G4[e] || V4, Y4 = {
  class: "task-log",
  "aria-label": "Task log"
}, J4 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, X4 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Q4 = { class: "entries" }, Z4 = ["data-task-log-important"], ex = ["datetime"], tx = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, nx = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = A([]), a = A(1), s = A(!0), o = A(!0), l = A("");
    let r = 0;
    async function i(c = 1) {
      const d = ++r;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(K4("task_logs")),
        "--page",
        String(c)
      ]);
      d === r && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), Xe(() => {
      r += 1;
    }), (c, d) => (u(), f("section", Y4, [
      o.value ? (u(), H(lt, { key: 0 })) : l.value ? (u(), f(W, { key: 1 }, [
        g("p", J4, y(l.value), 1),
        B(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => i(a.value))
        }, {
          default: D(() => [...d[3] || (d[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(W, { key: 2 }, [
        n.value.length ? S("", !0) : (u(), f("p", X4, "No log entries yet.")),
        g("ol", Q4, [
          (u(!0), f(W, null, te(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: J(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            g("time", {
              datetime: h.created_at
            }, y(new Date(h.created_at).toLocaleString()), 9, ex),
            g("p", null, y(h.line), 1)
          ], 10, Z4))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", tx, [
          B(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => i(a.value - 1))
          }, {
            default: D(() => [...d[4] || (d[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + y(a.value), 1),
          B(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => i(a.value + 1))
          }, {
            default: D(() => [...d[5] || (d[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : S("", !0)
      ], 64))
    ]));
  }
}, ax = /* @__PURE__ */ V(nx, [["__scopeId", "data-v-cfa43bf1"]]), sx = {
  class: "task-tags",
  "aria-label": "Task tags"
}, ox = { class: "tags" }, lx = ["aria-label", "data-remove-tag", "onClick"], rx = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = A("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (u(), f("section", sx, [
      g("div", ox, [
        (u(!0), f(W, null, te(e.tags, (r) => (u(), f("span", {
          key: r,
          class: "tag",
          "data-task-tag": ""
        }, [
          ee(y(r) + " ", 1),
          g("button", {
            type: "button",
            "aria-label": `Remove tag ${r}`,
            "data-remove-tag": r,
            onClick: (i) => n("remove", r)
          }, "×", 8, lx)
        ]))), 128))
      ]),
      g("form", {
        class: "add-tag",
        onSubmit: xe(s, ["prevent"])
      }, [
        De(g("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (r) => a.value = r),
          "aria-label": "New tag",
          placeholder: "New tag",
          pattern: "[a-z0-9-]+",
          "data-task-tag-input": ""
        }, null, 512), [
          [_t, a.value]
        ]),
        B(de, {
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
}, ix = /* @__PURE__ */ V(rx, [["__scopeId", "data-v-1d720cf2"]]), ux = { class: "comment-side-head" }, cx = {
  key: 0,
  class: "comment-none"
}, dx = { key: 0 }, fx = {
  key: 1,
  class: "comment-none"
}, hx = {
  class: "comment",
  "data-comment": ""
}, mx = {
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
    return (t, n) => (u(), f("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", ux, [
        n[2] || (n[2] = g("h3", null, "Comments", -1)),
        B(ia, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", cx, "No comments yet")) : S("", !0),
      (u(!0), f(W, null, te(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", dx, y(a.quote), 1)) : S("", !0),
        a.revision ? (u(), f("span", fx, "Revision " + y(a.revision), 1)) : S("", !0),
        g("p", hx, y(e.words(a)), 1)
      ]))), 128)),
      B(pn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, px = /* @__PURE__ */ V(mx, [["__scopeId", "data-v-276284a3"]]), gx = ["placeholder"], vx = { class: "actions" }, yx = { class: "error" }, bx = {
  key: 1,
  class: "card closed"
}, kx = { class: "mark" }, wx = { class: "prompt" }, $x = {
  key: 0,
  class: "draft"
}, xx = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ qt({
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
  emits: /* @__PURE__ */ qt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = sn(e, "error"), r = A(!!l.value), i = A(!1), c = A(!1), d = A(null);
    async function h() {
      var b, x;
      r.value = !0, i.value = !1, await Qe(), (x = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || x.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), r.value = !1, i.value = !0;
        } catch (x) {
          o.value = b, l.value = x.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, x) => (u(), f("div", {
      class: J(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(v, ["prevent"]),
        onKeydown: jt(m, ["esc"])
      }, [
        me(b.$slots, "who", {}, void 0, !0),
        De(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = jt((E) => N(mr)(E, v), ["enter"]))
        }, null, 40, gx), [
          [_t, o.value]
        ]),
        g("div", vx, [
          g("span", yx, y(l.value), 1),
          B(de, {
            small: "",
            onClick: m
          }, {
            default: D(() => [...x[3] || (x[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          B(de, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: D(() => [...x[4] || (x[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", bx, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          g("span", kx, [
            B(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", wx, y(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", $x, "Draft kept")) : S("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (E) => s("show"))
        }, [
          g("span", null, y(N(Pc)(e.count, "comment")), 1),
          B(ye, {
            name: "down",
            size: 12
          })
        ])) : S("", !0)
      ]))
    ], 2));
  }
}, Sx = /* @__PURE__ */ V(xx, [["__scopeId", "data-v-b68baddd"]]), Mx = { class: "top" }, _x = {
  class: "crumb",
  "data-task-crumb": ""
}, Cx = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Ex = {
  key: 1,
  class: "body"
}, Ax = { class: "summary" }, Ox = { class: "stamp" }, Tx = {
  class: "title",
  "data-resource-title": ""
}, Rx = {
  class: "tabs",
  "data-task-tabs": ""
}, Ix = { class: "panels" }, Bx = {
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
    const a = e, s = n, o = A(null), l = A(null), r = A(null), i = A(""), c = A(""), d = A(null), h = A(null), m = A("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], b = Tr(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (P) => a.read(P)
    );
    let x = 0;
    const E = I(() => {
      var P;
      return (P = l.value) != null && P.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const P = ++x, [O, T, $] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      P === x && (i.value = O.ok ? "" : O.error, o.value = O.ok ? O.value : null, l.value = T.ok ? T.value : null, r.value = $.ok ? $.value : null);
    }
    pe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", _();
      },
      { immediate: !0 }
    ), pe(() => a.changes, _), pe(b.open, (P) => {
      P && (m.value = "comments");
    });
    async function q(P, O) {
      const T = o.value[P];
      o.value[P] = Number(O);
      const $ = await a.read(["task", "edit", String(a.id), `--${P}`, O]);
      if (c.value = $.ok ? "" : $.error, $.ok) return _();
      o.value[P] = T;
    }
    async function U(P, O) {
      const T = await a.read(["task", P, String(a.id), O]);
      c.value = T.ok ? "" : T.error, T.ok && await _();
    }
    function j(P) {
      d.value = null, h.value.press(P);
    }
    const L = (P) => {
      var O;
      return ((O = h.value) == null ? void 0 : O.moves.length) && (d.value = P);
    };
    return t({ openStatus: L }), (P, O) => (u(), f("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", Mx, [
        e.backed ? (u(), H(R$, {
          key: 0,
          onBack: O[0] || (O[0] = (T) => s("back"))
        })) : S("", !0),
        g("span", _x, y(E.value), 1),
        O[14] || (O[14] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (u(), f(W, { key: 1 }, [
          B(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: O[1] || (O[1] = (T) => s("step", -1))
          }, {
            default: D(() => [
              B(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          B(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: O[2] || (O[2] = (T) => s("step", 1))
          }, {
            default: D(() => [
              B(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : S("", !0),
        B(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: O[3] || (O[3] = (T) => s("close"))
        }, {
          default: D(() => [
            B(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (u(), f("p", Cx, y(i.value), 1)) : o.value ? (u(), f(W, { key: 2 }, [
        B(P$, {
          ref_key: "actions",
          ref: h,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        g("header", Ax, [
          g("div", Ox, [
            ee(" Task " + y(o.value.id) + " · updated ", 1),
            B(Je, {
              at: N(wr)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", Tx, y(o.value.title), 1),
          B(ix, {
            tags: o.value.tags,
            onAdd: O[4] || (O[4] = (T) => U("tag", T)),
            onRemove: O[5] || (O[5] = (T) => U("untag", T))
          }, null, 8, ["tags"])
        ]),
        g("div", Rx, [
          B(Pt, {
            options: v,
            value: m.value,
            onPick: O[6] || (O[6] = (T) => m.value = T)
          }, null, 8, ["value"])
        ]),
        g("div", Ix, [
          B(zt, { value: m.value }, {
            details: D(() => [
              B(z4, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: c.value,
                onStatus: L,
                onPriority: O[7] || (O[7] = (T) => q("priority", T)),
                onComplexity: O[8] || (O[8] = (T) => q("complexity", T)),
                onSelect: O[9] || (O[9] = (T) => s("select", T))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              B(Or, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              B(qc, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: O[10] || (O[10] = (T) => s("select", T))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: D(() => [
              B(px, {
                below: "",
                comments: N(b).comments.value,
                words: N(b).words,
                more: !!N(b).nextPage.value,
                loading: N(b).loading.value,
                failure: N(b).failure.value,
                onMore: N(b).loadMore,
                onClose: O[11] || (O[11] = (T) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: D(() => [
              B(ax, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        B(Sx, {
          send: N(b).send,
          count: N(b).total.value,
          onShow: O[12] || (O[12] = (T) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (u(), f("div", Ex, [
        B(lt)
      ])),
      d.value ? (u(), H(ra, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: O[13] || (O[13] = (T) => d.value = null)
      }, {
        default: D(() => [
          B(bs, null, {
            default: D(() => [
              ee("Change the status of task " + y(e.id), 1)
            ]),
            _: 1
          }),
          (u(!0), f(W, null, te(h.value.moves, (T) => (u(), H(Ct, {
            key: T.word,
            onClick: ($) => j(T)
          }, {
            default: D(() => [
              ee(y(T.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : S("", !0)
    ], 2));
  }
}, b6 = /* @__PURE__ */ V(Bx, [["__scopeId", "data-v-d8c2872e"]]);
function Lx(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xa = { exports: {} }, hl;
function Nx() {
  return hl || (hl = 1, (function(e, t) {
    var n = (function() {
      var a = function(L, P) {
        var O = 236, T = 17, $ = L, k = o[P], w = null, p = 0, M = null, C = [], R = {}, F = function(G, K) {
          p = $ * 4 + 17, w = (function(z) {
            for (var Y = new Array(z), X = 0; X < z; X += 1) {
              Y[X] = new Array(z);
              for (var ne = 0; ne < z; ne += 1)
                Y[X][ne] = null;
            }
            return Y;
          })(p), Q(0, 0), Q(p - 7, 0), Q(0, p - 7), ge(), ie(), fe(G, K), $ >= 7 && Ee(G), M == null && (M = oe($, k, C)), Z(M, K);
        }, Q = function(G, K) {
          for (var z = -1; z <= 7; z += 1)
            if (!(G + z <= -1 || p <= G + z))
              for (var Y = -1; Y <= 7; Y += 1)
                K + Y <= -1 || p <= K + Y || (0 <= z && z <= 6 && (Y == 0 || Y == 6) || 0 <= Y && Y <= 6 && (z == 0 || z == 6) || 2 <= z && z <= 4 && 2 <= Y && Y <= 4 ? w[G + z][K + Y] = !0 : w[G + z][K + Y] = !1);
        }, se = function() {
          for (var G = 0, K = 0, z = 0; z < 8; z += 1) {
            F(!0, z);
            var Y = r.getLostPoint(R);
            (z == 0 || G > Y) && (G = Y, K = z);
          }
          return K;
        }, ie = function() {
          for (var G = 8; G < p - 8; G += 1)
            w[G][6] == null && (w[G][6] = G % 2 == 0);
          for (var K = 8; K < p - 8; K += 1)
            w[6][K] == null && (w[6][K] = K % 2 == 0);
        }, ge = function() {
          for (var G = r.getPatternPosition($), K = 0; K < G.length; K += 1)
            for (var z = 0; z < G.length; z += 1) {
              var Y = G[K], X = G[z];
              if (w[Y][X] == null)
                for (var ne = -2; ne <= 2; ne += 1)
                  for (var ue = -2; ue <= 2; ue += 1)
                    ne == -2 || ne == 2 || ue == -2 || ue == 2 || ne == 0 && ue == 0 ? w[Y + ne][X + ue] = !0 : w[Y + ne][X + ue] = !1;
            }
        }, Ee = function(G) {
          for (var K = r.getBCHTypeNumber($), z = 0; z < 18; z += 1) {
            var Y = !G && (K >> z & 1) == 1;
            w[Math.floor(z / 3)][z % 3 + p - 8 - 3] = Y;
          }
          for (var z = 0; z < 18; z += 1) {
            var Y = !G && (K >> z & 1) == 1;
            w[z % 3 + p - 8 - 3][Math.floor(z / 3)] = Y;
          }
        }, fe = function(G, K) {
          for (var z = k << 3 | K, Y = r.getBCHTypeInfo(z), X = 0; X < 15; X += 1) {
            var ne = !G && (Y >> X & 1) == 1;
            X < 6 ? w[X][8] = ne : X < 8 ? w[X + 1][8] = ne : w[p - 15 + X][8] = ne;
          }
          for (var X = 0; X < 15; X += 1) {
            var ne = !G && (Y >> X & 1) == 1;
            X < 8 ? w[8][p - X - 1] = ne : X < 9 ? w[8][15 - X - 1 + 1] = ne : w[8][15 - X - 1] = ne;
          }
          w[p - 8][8] = !G;
        }, Z = function(G, K) {
          for (var z = -1, Y = p - 1, X = 7, ne = 0, ue = r.getMaskFunction(K), re = p - 1; re > 0; re -= 2)
            for (re == 6 && (re -= 1); ; ) {
              for (var $e = 0; $e < 2; $e += 1)
                if (w[Y][re - $e] == null) {
                  var _e = !1;
                  ne < G.length && (_e = (G[ne] >>> X & 1) == 1);
                  var he = ue(Y, re - $e);
                  he && (_e = !_e), w[Y][re - $e] = _e, X -= 1, X == -1 && (ne += 1, X = 7);
                }
              if (Y += z, Y < 0 || p <= Y) {
                Y -= z, z = -z;
                break;
              }
            }
        }, ae = function(G, K) {
          for (var z = 0, Y = 0, X = 0, ne = new Array(K.length), ue = new Array(K.length), re = 0; re < K.length; re += 1) {
            var $e = K[re].dataCount, _e = K[re].totalCount - $e;
            Y = Math.max(Y, $e), X = Math.max(X, _e), ne[re] = new Array($e);
            for (var he = 0; he < ne[re].length; he += 1)
              ne[re][he] = 255 & G.getBuffer()[he + z];
            z += $e;
            var je = r.getErrorCorrectPolynomial(_e), Pe = c(ne[re], je.getLength() - 1), Xs = Pe.mod(je);
            ue[re] = new Array(je.getLength() - 1);
            for (var he = 0; he < ue[re].length; he += 1) {
              var Qs = he + Xs.getLength() - ue[re].length;
              ue[re][he] = Qs >= 0 ? Xs.getAt(Qs) : 0;
            }
          }
          for (var Zs = 0, he = 0; he < K.length; he += 1)
            Zs += K[he].totalCount;
          for (var va = new Array(Zs), xn = 0, he = 0; he < Y; he += 1)
            for (var re = 0; re < K.length; re += 1)
              he < ne[re].length && (va[xn] = ne[re][he], xn += 1);
          for (var he = 0; he < X; he += 1)
            for (var re = 0; re < K.length; re += 1)
              he < ue[re].length && (va[xn] = ue[re][he], xn += 1);
          return va;
        }, oe = function(G, K, z) {
          for (var Y = d.getRSBlocks(G, K), X = h(), ne = 0; ne < z.length; ne += 1) {
            var ue = z[ne];
            X.put(ue.getMode(), 4), X.put(ue.getLength(), r.getLengthInBits(ue.getMode(), G)), ue.write(X);
          }
          for (var re = 0, ne = 0; ne < Y.length; ne += 1)
            re += Y[ne].dataCount;
          if (X.getLengthInBits() > re * 8)
            throw "code length overflow. (" + X.getLengthInBits() + ">" + re * 8 + ")";
          for (X.getLengthInBits() + 4 <= re * 8 && X.put(0, 4); X.getLengthInBits() % 8 != 0; )
            X.putBit(!1);
          for (; !(X.getLengthInBits() >= re * 8 || (X.put(O, 8), X.getLengthInBits() >= re * 8)); )
            X.put(T, 8);
          return ae(X, Y);
        };
        R.addData = function(G, K) {
          K = K || "Byte";
          var z = null;
          switch (K) {
            case "Numeric":
              z = m(G);
              break;
            case "Alphanumeric":
              z = v(G);
              break;
            case "Byte":
              z = b(G);
              break;
            case "Kanji":
              z = x(G);
              break;
            default:
              throw "mode:" + K;
          }
          C.push(z), M = null;
        }, R.isDark = function(G, K) {
          if (G < 0 || p <= G || K < 0 || p <= K)
            throw G + "," + K;
          return w[G][K];
        }, R.getModuleCount = function() {
          return p;
        }, R.make = function() {
          if ($ < 1) {
            for (var G = 1; G < 40; G++) {
              for (var K = d.getRSBlocks(G, k), z = h(), Y = 0; Y < C.length; Y++) {
                var X = C[Y];
                z.put(X.getMode(), 4), z.put(X.getLength(), r.getLengthInBits(X.getMode(), G)), X.write(z);
              }
              for (var ne = 0, Y = 0; Y < K.length; Y++)
                ne += K[Y].dataCount;
              if (z.getLengthInBits() <= ne * 8)
                break;
            }
            $ = G;
          }
          F(!1, se());
        }, R.createTableTag = function(G, K) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var z = "";
          z += '<table style="', z += " border-width: 0px; border-style: none;", z += " border-collapse: collapse;", z += " padding: 0px; margin: " + K + "px;", z += '">', z += "<tbody>";
          for (var Y = 0; Y < R.getModuleCount(); Y += 1) {
            z += "<tr>";
            for (var X = 0; X < R.getModuleCount(); X += 1)
              z += '<td style="', z += " border-width: 0px; border-style: none;", z += " border-collapse: collapse;", z += " padding: 0px; margin: 0px;", z += " width: " + G + "px;", z += " height: " + G + "px;", z += " background-color: ", z += R.isDark(Y, X) ? "#000000" : "#ffffff", z += ";", z += '"/>';
            z += "</tr>";
          }
          return z += "</tbody>", z += "</table>", z;
        }, R.createSvgTag = function(G, K, z, Y) {
          var X = {};
          typeof arguments[0] == "object" && (X = arguments[0], G = X.cellSize, K = X.margin, z = X.alt, Y = X.title), G = G || 2, K = typeof K > "u" ? G * 4 : K, z = typeof z == "string" ? { text: z } : z || {}, z.text = z.text || null, z.id = z.text ? z.id || "qrcode-description" : null, Y = typeof Y == "string" ? { text: Y } : Y || {}, Y.text = Y.text || null, Y.id = Y.text ? Y.id || "qrcode-title" : null;
          var ne = R.getModuleCount() * G + K * 2, ue, re, $e, _e, he = "", je;
          for (je = "l" + G + ",0 0," + G + " -" + G + ",0 0,-" + G + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += X.scalable ? "" : ' width="' + ne + 'px" height="' + ne + 'px"', he += ' viewBox="0 0 ' + ne + " " + ne + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += Y.text || z.text ? ' role="img" aria-labelledby="' + Ze([Y.id, z.id].join(" ").trim()) + '"' : "", he += ">", he += Y.text ? '<title id="' + Ze(Y.id) + '">' + Ze(Y.text) + "</title>" : "", he += z.text ? '<description id="' + Ze(z.id) + '">' + Ze(z.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', $e = 0; $e < R.getModuleCount(); $e += 1)
            for (_e = $e * G + K, ue = 0; ue < R.getModuleCount(); ue += 1)
              R.isDark($e, ue) && (re = ue * G + K, he += "M" + re + "," + _e + je);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(G, K) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var z = R.getModuleCount() * G + K * 2, Y = K, X = z - K;
          return j(z, z, function(ne, ue) {
            if (Y <= ne && ne < X && Y <= ue && ue < X) {
              var re = Math.floor((ne - Y) / G), $e = Math.floor((ue - Y) / G);
              return R.isDark($e, re) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(G, K, z) {
          G = G || 2, K = typeof K > "u" ? G * 4 : K;
          var Y = R.getModuleCount() * G + K * 2, X = "";
          return X += "<img", X += ' src="', X += R.createDataURL(G, K), X += '"', X += ' width="', X += Y, X += '"', X += ' height="', X += Y, X += '"', z && (X += ' alt="', X += Ze(z), X += '"'), X += "/>", X;
        };
        var Ze = function(G) {
          for (var K = "", z = 0; z < G.length; z += 1) {
            var Y = G.charAt(z);
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
        }, Ti = function(G) {
          var K = 1;
          G = typeof G > "u" ? K * 2 : G;
          var z = R.getModuleCount() * K + G * 2, Y = G, X = z - G, ne, ue, re, $e, _e, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, je = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Pe = "";
          for (ne = 0; ne < z; ne += 2) {
            for (re = Math.floor((ne - Y) / K), $e = Math.floor((ne + 1 - Y) / K), ue = 0; ue < z; ue += 1)
              _e = "█", Y <= ue && ue < X && Y <= ne && ne < X && R.isDark(re, Math.floor((ue - Y) / K)) && (_e = " "), Y <= ue && ue < X && Y <= ne + 1 && ne + 1 < X && R.isDark($e, Math.floor((ue - Y) / K)) ? _e += " " : _e += "█", Pe += G < 1 && ne + 1 >= X ? je[_e] : he[_e];
            Pe += `
`;
          }
          return z % 2 && G > 0 ? Pe.substring(0, Pe.length - z - 1) + Array(z + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return R.createASCII = function(G, K) {
          if (G = G || 1, G < 2)
            return Ti(K);
          G -= 1, K = typeof K > "u" ? G * 2 : K;
          var z = R.getModuleCount() * G + K * 2, Y = K, X = z - K, ne, ue, re, $e, _e = Array(G + 1).join("██"), he = Array(G + 1).join("  "), je = "", Pe = "";
          for (ne = 0; ne < z; ne += 1) {
            for (re = Math.floor((ne - Y) / G), Pe = "", ue = 0; ue < z; ue += 1)
              $e = 1, Y <= ue && ue < X && Y <= ne && ne < X && R.isDark(re, Math.floor((ue - Y) / G)) && ($e = 0), Pe += $e ? _e : he;
            for (re = 0; re < G; re += 1)
              je += Pe + `
`;
          }
          return je.substring(0, je.length - 1);
        }, R.renderTo2dContext = function(G, K) {
          K = K || 2;
          for (var z = R.getModuleCount(), Y = 0; Y < z; Y++)
            for (var X = 0; X < z; X++)
              G.fillStyle = R.isDark(Y, X) ? "black" : "white", G.fillRect(Y * K, X * K, K, K);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(L) {
          for (var P = [], O = 0; O < L.length; O += 1) {
            var T = L.charCodeAt(O);
            P.push(T & 255);
          }
          return P;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(L, P) {
        var O = (function() {
          for (var $ = q(L), k = function() {
            var ie = $.read();
            if (ie == -1) throw "eof";
            return ie;
          }, w = 0, p = {}; ; ) {
            var M = $.read();
            if (M == -1) break;
            var C = k(), R = k(), F = k(), Q = String.fromCharCode(M << 8 | C), se = R << 8 | F;
            p[Q] = se, w += 1;
          }
          if (w != P)
            throw w + " != " + P;
          return p;
        })(), T = 63;
        return function($) {
          for (var k = [], w = 0; w < $.length; w += 1) {
            var p = $.charCodeAt(w);
            if (p < 128)
              k.push(p);
            else {
              var M = O[$.charAt(w)];
              typeof M == "number" ? (M & 255) == M ? k.push(M) : (k.push(M >>> 8), k.push(M & 255)) : k.push(T);
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
        ], P = 1335, O = 7973, T = 21522, $ = {}, k = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return $.getBCHTypeInfo = function(w) {
          for (var p = w << 10; k(p) - k(P) >= 0; )
            p ^= P << k(p) - k(P);
          return (w << 10 | p) ^ T;
        }, $.getBCHTypeNumber = function(w) {
          for (var p = w << 12; k(p) - k(O) >= 0; )
            p ^= O << k(p) - k(O);
          return w << 12 | p;
        }, $.getPatternPosition = function(w) {
          return L[w - 1];
        }, $.getMaskFunction = function(w) {
          switch (w) {
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
              throw "bad maskPattern:" + w;
          }
        }, $.getErrorCorrectPolynomial = function(w) {
          for (var p = c([1], 0), M = 0; M < w; M += 1)
            p = p.multiply(c([1, i.gexp(M)], 0));
          return p;
        }, $.getLengthInBits = function(w, p) {
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
        }, $.getLostPoint = function(w) {
          for (var p = w.getModuleCount(), M = 0, C = 0; C < p; C += 1)
            for (var R = 0; R < p; R += 1) {
              for (var F = 0, Q = w.isDark(C, R), se = -1; se <= 1; se += 1)
                if (!(C + se < 0 || p <= C + se))
                  for (var ie = -1; ie <= 1; ie += 1)
                    R + ie < 0 || p <= R + ie || se == 0 && ie == 0 || Q == w.isDark(C + se, R + ie) && (F += 1);
              F > 5 && (M += 3 + F - 5);
            }
          for (var C = 0; C < p - 1; C += 1)
            for (var R = 0; R < p - 1; R += 1) {
              var ge = 0;
              w.isDark(C, R) && (ge += 1), w.isDark(C + 1, R) && (ge += 1), w.isDark(C, R + 1) && (ge += 1), w.isDark(C + 1, R + 1) && (ge += 1), (ge == 0 || ge == 4) && (M += 3);
            }
          for (var C = 0; C < p; C += 1)
            for (var R = 0; R < p - 6; R += 1)
              w.isDark(C, R) && !w.isDark(C, R + 1) && w.isDark(C, R + 2) && w.isDark(C, R + 3) && w.isDark(C, R + 4) && !w.isDark(C, R + 5) && w.isDark(C, R + 6) && (M += 40);
          for (var R = 0; R < p; R += 1)
            for (var C = 0; C < p - 6; C += 1)
              w.isDark(C, R) && !w.isDark(C + 1, R) && w.isDark(C + 2, R) && w.isDark(C + 3, R) && w.isDark(C + 4, R) && !w.isDark(C + 5, R) && w.isDark(C + 6, R) && (M += 40);
          for (var Ee = 0, R = 0; R < p; R += 1)
            for (var C = 0; C < p; C += 1)
              w.isDark(C, R) && (Ee += 1);
          var fe = Math.abs(100 * Ee / p / p - 50) / 5;
          return M += fe * 10, M;
        }, $;
      })(), i = (function() {
        for (var L = new Array(256), P = new Array(256), O = 0; O < 8; O += 1)
          L[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          L[O] = L[O - 4] ^ L[O - 5] ^ L[O - 6] ^ L[O - 8];
        for (var O = 0; O < 255; O += 1)
          P[L[O]] = O;
        var T = {};
        return T.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return P[$];
        }, T.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return L[$];
        }, T;
      })();
      function c(L, P) {
        if (typeof L.length > "u")
          throw L.length + "/" + P;
        var O = (function() {
          for (var $ = 0; $ < L.length && L[$] == 0; )
            $ += 1;
          for (var k = new Array(L.length - $ + P), w = 0; w < L.length - $; w += 1)
            k[w] = L[w + $];
          return k;
        })(), T = {};
        return T.getAt = function($) {
          return O[$];
        }, T.getLength = function() {
          return O.length;
        }, T.multiply = function($) {
          for (var k = new Array(T.getLength() + $.getLength() - 1), w = 0; w < T.getLength(); w += 1)
            for (var p = 0; p < $.getLength(); p += 1)
              k[w + p] ^= i.gexp(i.glog(T.getAt(w)) + i.glog($.getAt(p)));
          return c(k, 0);
        }, T.mod = function($) {
          if (T.getLength() - $.getLength() < 0)
            return T;
          for (var k = i.glog(T.getAt(0)) - i.glog($.getAt(0)), w = new Array(T.getLength()), p = 0; p < T.getLength(); p += 1)
            w[p] = T.getAt(p);
          for (var p = 0; p < $.getLength(); p += 1)
            w[p] ^= i.gexp(i.glog($.getAt(p)) + k);
          return c(w, 0).mod($);
        }, T;
      }
      var d = (function() {
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
        ], P = function($, k) {
          var w = {};
          return w.totalCount = $, w.dataCount = k, w;
        }, O = {}, T = function($, k) {
          switch (k) {
            case o.L:
              return L[($ - 1) * 4 + 0];
            case o.M:
              return L[($ - 1) * 4 + 1];
            case o.Q:
              return L[($ - 1) * 4 + 2];
            case o.H:
              return L[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return O.getRSBlocks = function($, k) {
          var w = T($, k);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + k;
          for (var p = w.length / 3, M = [], C = 0; C < p; C += 1)
            for (var R = w[C * 3 + 0], F = w[C * 3 + 1], Q = w[C * 3 + 2], se = 0; se < R; se += 1)
              M.push(P(F, Q));
          return M;
        }, O;
      })(), h = function() {
        var L = [], P = 0, O = {};
        return O.getBuffer = function() {
          return L;
        }, O.getAt = function(T) {
          var $ = Math.floor(T / 8);
          return (L[$] >>> 7 - T % 8 & 1) == 1;
        }, O.put = function(T, $) {
          for (var k = 0; k < $; k += 1)
            O.putBit((T >>> $ - k - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return P;
        }, O.putBit = function(T) {
          var $ = Math.floor(P / 8);
          L.length <= $ && L.push(0), T && (L[$] |= 128 >>> P % 8), P += 1;
        }, O;
      }, m = function(L) {
        var P = s.MODE_NUMBER, O = L, T = {};
        T.getMode = function() {
          return P;
        }, T.getLength = function(w) {
          return O.length;
        }, T.write = function(w) {
          for (var p = O, M = 0; M + 2 < p.length; )
            w.put($(p.substring(M, M + 3)), 10), M += 3;
          M < p.length && (p.length - M == 1 ? w.put($(p.substring(M, M + 1)), 4) : p.length - M == 2 && w.put($(p.substring(M, M + 2)), 7));
        };
        var $ = function(w) {
          for (var p = 0, M = 0; M < w.length; M += 1)
            p = p * 10 + k(w.charAt(M));
          return p;
        }, k = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return T;
      }, v = function(L) {
        var P = s.MODE_ALPHA_NUM, O = L, T = {};
        T.getMode = function() {
          return P;
        }, T.getLength = function(k) {
          return O.length;
        }, T.write = function(k) {
          for (var w = O, p = 0; p + 1 < w.length; )
            k.put(
              $(w.charAt(p)) * 45 + $(w.charAt(p + 1)),
              11
            ), p += 2;
          p < w.length && k.put($(w.charAt(p)), 6);
        };
        var $ = function(k) {
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
        return T;
      }, b = function(L) {
        var P = s.MODE_8BIT_BYTE, O = a.stringToBytes(L), T = {};
        return T.getMode = function() {
          return P;
        }, T.getLength = function($) {
          return O.length;
        }, T.write = function($) {
          for (var k = 0; k < O.length; k += 1)
            $.put(O[k], 8);
        }, T;
      }, x = function(L) {
        var P = s.MODE_KANJI, O = a.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(k, w) {
          var p = O(k);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var T = O(L), $ = {};
        return $.getMode = function() {
          return P;
        }, $.getLength = function(k) {
          return ~~(T.length / 2);
        }, $.write = function(k) {
          for (var w = T, p = 0; p + 1 < w.length; ) {
            var M = (255 & w[p]) << 8 | 255 & w[p + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), k.put(M, 13), p += 2;
          }
          if (p < w.length)
            throw "illegal char at " + (p + 1);
        }, $;
      }, E = function() {
        var L = [], P = {};
        return P.writeByte = function(O) {
          L.push(O & 255);
        }, P.writeShort = function(O) {
          P.writeByte(O), P.writeByte(O >>> 8);
        }, P.writeBytes = function(O, T, $) {
          T = T || 0, $ = $ || O.length;
          for (var k = 0; k < $; k += 1)
            P.writeByte(O[k + T]);
        }, P.writeString = function(O) {
          for (var T = 0; T < O.length; T += 1)
            P.writeByte(O.charCodeAt(T));
        }, P.toByteArray = function() {
          return L;
        }, P.toString = function() {
          var O = "";
          O += "[";
          for (var T = 0; T < L.length; T += 1)
            T > 0 && (O += ","), O += L[T];
          return O += "]", O;
        }, P;
      }, _ = function() {
        var L = 0, P = 0, O = 0, T = "", $ = {}, k = function(p) {
          T += String.fromCharCode(w(p & 63));
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
        return $.writeByte = function(p) {
          for (L = L << 8 | p & 255, P += 8, O += 1; P >= 6; )
            k(L >>> P - 6), P -= 6;
        }, $.flush = function() {
          if (P > 0 && (k(L << 6 - P), L = 0, P = 0), O % 3 != 0)
            for (var p = 3 - O % 3, M = 0; M < p; M += 1)
              T += "=";
        }, $.toString = function() {
          return T;
        }, $;
      }, q = function(L) {
        var P = L, O = 0, T = 0, $ = 0, k = {};
        k.read = function() {
          for (; $ < 8; ) {
            if (O >= P.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var p = P.charAt(O);
            if (O += 1, p == "=")
              return $ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            T = T << 6 | w(p.charCodeAt(0)), $ += 6;
          }
          var M = T >>> $ - 8 & 255;
          return $ -= 8, M;
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
        return k;
      }, U = function(L, P) {
        var O = L, T = P, $ = new Array(L * P), k = {};
        k.setPixel = function(C, R, F) {
          $[R * O + C] = F;
        }, k.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(O), C.writeShort(T), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(O), C.writeShort(T), C.writeByte(0);
          var R = 2, F = p(R);
          C.writeByte(R);
          for (var Q = 0; F.length - Q > 255; )
            C.writeByte(255), C.writeBytes(F, Q, 255), Q += 255;
          C.writeByte(F.length - Q), C.writeBytes(F, Q, F.length - Q), C.writeByte(0), C.writeString(";");
        };
        var w = function(C) {
          var R = C, F = 0, Q = 0, se = {};
          return se.write = function(ie, ge) {
            if (ie >>> ge)
              throw "length over";
            for (; F + ge >= 8; )
              R.writeByte(255 & (ie << F | Q)), ge -= 8 - F, ie >>>= 8 - F, Q = 0, F = 0;
            Q = ie << F | Q, F = F + ge;
          }, se.flush = function() {
            F > 0 && R.writeByte(Q);
          }, se;
        }, p = function(C) {
          for (var R = 1 << C, F = (1 << C) + 1, Q = C + 1, se = M(), ie = 0; ie < R; ie += 1)
            se.add(String.fromCharCode(ie));
          se.add(String.fromCharCode(R)), se.add(String.fromCharCode(F));
          var ge = E(), Ee = w(ge);
          Ee.write(R, Q);
          var fe = 0, Z = String.fromCharCode($[fe]);
          for (fe += 1; fe < $.length; ) {
            var ae = String.fromCharCode($[fe]);
            fe += 1, se.contains(Z + ae) ? Z = Z + ae : (Ee.write(se.indexOf(Z), Q), se.size() < 4095 && (se.size() == 1 << Q && (Q += 1), se.add(Z + ae)), Z = ae);
          }
          return Ee.write(se.indexOf(Z), Q), Ee.write(F, Q), Ee.flush(), ge.toByteArray();
        }, M = function() {
          var C = {}, R = 0, F = {};
          return F.add = function(Q) {
            if (F.contains(Q))
              throw "dup key:" + Q;
            C[Q] = R, R += 1;
          }, F.size = function() {
            return R;
          }, F.indexOf = function(Q) {
            return C[Q];
          }, F.contains = function(Q) {
            return typeof C[Q] < "u";
          }, F;
        };
        return k;
      }, j = function(L, P, O) {
        for (var T = U(L, P), $ = 0; $ < P; $ += 1)
          for (var k = 0; k < L; k += 1)
            T.setPixel(k, $, O(k, $));
        var w = E();
        T.write(w);
        for (var p = _(), M = w.toByteArray(), C = 0; C < M.length; C += 1)
          p.writeByte(M[C]);
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
  })(Xa)), Xa.exports;
}
var Dx = Nx();
const qx = /* @__PURE__ */ Lx(Dx), jx = ["width", "height", "viewBox"], Px = ["width", "height"], Fx = ["d"], Wx = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = qx(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), f("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      g("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, Px),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Fx)
    ], 8, jx));
  }
}, k6 = /* @__PURE__ */ V(Wx, [["__scopeId", "data-v-489f0852"]]), Hx = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, w6 = /* @__PURE__ */ V(Hx, [["__scopeId", "data-v-47e67f04"]]);
function $6(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const x6 = Vi(() => import("./VoiceFigure-EYMNjo-2.js").then((e) => e.V)), S6 = "1.2.0", M6 = "3.5";
export {
  vf as $,
  Ce as A,
  Re as B,
  ha as C,
  rt as D,
  OS as E,
  F2 as F,
  k3 as G,
  _S as H,
  w2 as I,
  K2 as J,
  Ot as K,
  Gx as L,
  Us as M,
  e5 as N,
  G2 as O,
  fa as P,
  V3 as Q,
  Z8 as R,
  Wn as S,
  X3 as T,
  z8 as U,
  Ae as V,
  Qn as W,
  U8 as X,
  H8 as Y,
  gf as Z,
  V as _,
  L8 as a,
  mS as a$,
  Q2 as a0,
  e3 as a1,
  t3 as a2,
  qe as a3,
  f3 as a4,
  d3 as a5,
  Et as a6,
  n3 as a7,
  S3 as a8,
  S8 as a9,
  lS as aA,
  H3 as aB,
  c2 as aC,
  E3 as aD,
  A3 as aE,
  TS as aF,
  hi as aG,
  J3 as aH,
  bn as aI,
  O8 as aJ,
  C8 as aK,
  kS as aL,
  kn as aM,
  SS as aN,
  b3 as aO,
  U3 as aP,
  z3 as aQ,
  W3 as aR,
  cn as aS,
  St as aT,
  M8 as aU,
  ew as aV,
  P3 as aW,
  X8 as aX,
  di as aY,
  Wt as aZ,
  Gt as a_,
  pS as aa,
  $S as ab,
  I8 as ac,
  V8 as ad,
  G8 as ae,
  u3 as af,
  c3 as ag,
  h3 as ah,
  j8 as ai,
  ol as aj,
  a3 as ak,
  x3 as al,
  LS as am,
  N3 as an,
  B3 as ao,
  I3 as ap,
  m3 as aq,
  r3 as ar,
  l3 as as,
  i3 as at,
  Y3 as au,
  $3 as av,
  M3 as aw,
  qS as ax,
  tn as ay,
  _3 as az,
  d5 as b,
  DS as b$,
  D2 as b0,
  xS as b1,
  eS as b2,
  Z3 as b3,
  Sw as b4,
  Qr as b5,
  dS as b6,
  w3 as b7,
  ga as b8,
  dt as b9,
  nS as bA,
  iS as bB,
  mt as bC,
  Q3 as bD,
  uS as bE,
  C3 as bF,
  D3 as bG,
  O3 as bH,
  Ie as bI,
  y3 as bJ,
  cS as bK,
  VS as bL,
  GS as bM,
  $8 as bN,
  aw as bO,
  g3 as bP,
  aS as bQ,
  N8 as bR,
  BS as bS,
  tS as bT,
  sS as bU,
  oS as bV,
  p3 as bW,
  d2 as bX,
  v3 as bY,
  R3 as bZ,
  IS as b_,
  rS as ba,
  qa as bb,
  kr as bc,
  PS as bd,
  HS as be,
  K3 as bf,
  bS as bg,
  x8 as bh,
  L3 as bi,
  FS as bj,
  s3 as bk,
  o3 as bl,
  F8 as bm,
  Q8 as bn,
  A8 as bo,
  vS as bp,
  D8 as bq,
  q8 as br,
  W8 as bs,
  j3 as bt,
  Yk as bu,
  MS as bv,
  V2 as bw,
  P8 as bx,
  T8 as by,
  q3 as bz,
  xw as c,
  b8 as c$,
  E8 as c0,
  _8 as c1,
  T3 as c2,
  US as c3,
  Ys as c4,
  zS as c5,
  Ei as c6,
  yS as c7,
  Y8 as c8,
  K8 as c9,
  Mt as cA,
  Sd as cB,
  ye as cC,
  i6 as cD,
  n8 as cE,
  S6 as cF,
  M6 as cG,
  d8 as cH,
  c6 as cI,
  ds as cJ,
  v8 as cK,
  Nb as cL,
  Ct as cM,
  bs as cN,
  ra as cO,
  l8 as cP,
  f8 as cQ,
  uc as cR,
  vb as cS,
  v6 as cT,
  i8 as cU,
  k6 as cV,
  pr as cW,
  qc as cX,
  o6 as cY,
  cv as cZ,
  Qx as c_,
  Zk as ca,
  R8 as cb,
  U2 as cc,
  F3 as cd,
  Fs as ce,
  o2 as cf,
  G3 as cg,
  nn as ch,
  Dt as ci,
  a8 as cj,
  o8 as ck,
  r6 as cl,
  de as cm,
  Qd as cn,
  Yl as co,
  ia as cp,
  H1 as cq,
  ua as cr,
  y6 as cs,
  w8 as ct,
  s8 as cu,
  V1 as cv,
  fr as cw,
  on as cx,
  KS as cy,
  zx as cz,
  Ve as d,
  E5 as d$,
  o$ as d0,
  Pt as d1,
  h8 as d2,
  lt as d3,
  vt as d4,
  Rm as d5,
  Vc as d6,
  p8 as d7,
  Zx as d8,
  zt as d9,
  g8 as dA,
  JS as dB,
  Qp as dC,
  YS as dD,
  Jx as dE,
  f6 as dF,
  Ob as dG,
  C5 as dH,
  e8 as dI,
  c8 as dJ,
  ZS as dK,
  t6 as dL,
  He as dM,
  Af as dN,
  r8 as dO,
  dc as dP,
  Fr as dQ,
  QS as dR,
  yu as dS,
  Xx as dT,
  Yx as dU,
  As as dV,
  Nl as dW,
  nd as dX,
  t8 as dY,
  ht as dZ,
  $6 as d_,
  u6 as da,
  b6 as db,
  Js as dc,
  _d as dd,
  xt as de,
  m8 as df,
  Je as dg,
  x6 as dh,
  w6 as di,
  Ls as dj,
  e6 as dk,
  $s as dl,
  Cf as dm,
  No as dn,
  Bs as dp,
  td as dq,
  p6 as dr,
  m6 as ds,
  Cs as dt,
  ed as du,
  Ms as dv,
  u8 as dw,
  g6 as dx,
  k8 as dy,
  y8 as dz,
  J8 as e,
  Vx as e0,
  Kx as e1,
  XS as e2,
  l6 as e3,
  ar as e4,
  d6 as e5,
  tb as e6,
  Rl as e7,
  m$ as e8,
  xs as e9,
  n6 as ea,
  Qa as eb,
  a6 as ec,
  s6 as ed,
  Ue as ee,
  h6 as ef,
  as as eg,
  Kk as f,
  jS as g,
  dn as h,
  CS as i,
  WS as j,
  ES as k,
  gS as l,
  g5 as m,
  zs as n,
  wS as o,
  B8 as p,
  AS as q,
  _i as r,
  Ci as s,
  Me as t,
  _w as u,
  fS as v,
  NS as w,
  hS as x,
  $n as y,
  RS as z
};
