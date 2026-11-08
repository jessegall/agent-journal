/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ve, unref as L, renderSlot as de, createElementVNode as m, normalizeClass as K, Fragment as P, renderList as ae, defineComponent as zr, Comment as Ur, h as ra, cloneVNode as Gr, createBlock as W, withCtx as j, createVNode as R, toDisplayString as v, createCommentVNode as k, ref as M, onMounted as xe, onBeforeUnmount as et, reactive as Wt, shallowRef as Xe, watch as he, onUnmounted as Ie, inject as Me, useAttrs as ua, computed as A, resolveDynamicComponent as it, mergeProps as Pe, useId as _s, resolveDirective as Vr, withDirectives as Je, createTextVNode as te, Teleport as ca, nextTick as je, Transition as Ht, withModifiers as $e, createApp as Kr, shallowReactive as Yr, withKeys as xt, onScopeDispose as da, useModel as sn, mergeModels as qt, vModelText as Kn, resolveComponent as Qr, provide as Ol, onErrorCaptured as Xr, TransitionGroup as Ms, isRef as co, getCurrentInstance as Jr, getCurrentScope as Tl, createSlots as Zr, vShow as Il, useSlots as eu, normalizeProps as tu, guardReactiveProps as nu, defineAsyncComponent as au } from "vue";
function Bl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, su = 1600, ou = {
  __name: "Shimmer",
  setup(e) {
    const t = Bl(su);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ve(L(t))
    }, null, 4));
  }
}, Jt = /* @__PURE__ */ z(ou, [["__scopeId", "data-v-6c018b03"]]), lu = { class: "skeleton-line" }, iu = 2e3, ru = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Bl(iu);
    return (n, a) => (u(), f("span", lu, [
      de(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: K(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(P, null, ae(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: K(["bar", { still: e.still }]),
          style: ve({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, vt = /* @__PURE__ */ z(ru, [["__scopeId", "data-v-484fe8a0"]]), zt = zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Ur);
      return a.length !== 1 ? ra(P, { key: n }, a) : a[0].key == null ? Gr(a[0], { key: n }) : a[0];
    };
  }
}), uu = ["aria-label"], cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], gu = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((r) => ({ width: r, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (r, c) => (u(), W(zt, { value: e.shape }, {
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(P, null, ae(t, (d) => R(Jt, {
            key: d.id,
            class: K(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, uu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(t.slice(0, 3), (d) => (u(), W(Jt, {
            key: d.id,
            class: K(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, cu)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(P, null, ae(n, (h) => R(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, du)
      ]),
      file: j(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            R(vt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(P, null, ae(s, (h) => R(vt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, fu)
      ]),
      page: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          R(vt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(P, null, ae(e.count, (d) => (u(), W(vt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, hu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), W(vt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), W(vt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, pu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ve = /* @__PURE__ */ z(gu, [["__scopeId", "data-v-ef519c5f"]]), vu = {
  key: 1,
  class: "empty-state titled"
}, yu = { class: "empty-state-title" }, bu = { class: "empty-state-text" }, wu = {
  key: 2,
  class: "empty-state"
}, ku = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), W(Ve, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", vu, [
      m("p", yu, v(e.title), 1),
      m("p", bu, [
        de(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", wu, [
      de(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, on = /* @__PURE__ */ z(ku, [["__scopeId", "data-v-b27e89b0"]]), $u = { class: "fold-group" }, xu = ["aria-expanded"], Su = { class: "fold-label" }, _u = {
  key: 0,
  class: "fold-count"
}, Mu = {
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
    return (a, s) => (u(), f("div", $u, [
      m("button", {
        type: "button",
        class: K(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Su, v(e.label), 1),
        e.count !== "" ? (u(), f("span", _u, v(e.count), 1)) : k("", !0),
        m("span", {
          class: K(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, xu),
      e.open ? de(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, sS = /* @__PURE__ */ z(Mu, [["__scopeId", "data-v-9ef1865c"]]), Cu = 150, Eu = () => Cu;
function Cs(e, t, n = Eu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Au(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((r) => [r, a[r]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let i = !1;
  try {
    const r = await n(t);
    return i = r.ok, r;
  } finally {
    i || l();
  }
}
const Ou = 50, fo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function oS(e) {
  const t = Ke().sources.find((n) => n.key === e);
  return t ? ts(t.read, t.events) : ts("", []);
}
function Rl(e, t, n, a, s = () => !1) {
  const o = M([]), l = M(null), i = M(""), r = M(!1), c = performance.now(), d = M(!1), h = M(""), g = M(null), y = /* @__PURE__ */ new Set();
  let w = null;
  function I(p) {
    return s() ? (y.add(p), w ?? (w = new Promise((x) => setTimeout(() => x(_()), Ou)))) : $(p);
  }
  async function _() {
    const p = new Set(y);
    y.clear(), w = null;
    const x = D, E = await t({ ids: [...p].join(","), limit: p.size });
    if (x !== D) return;
    if (!E.ok) return q();
    const O = new Map(E.value.rows.map((N) => [N.id, N]));
    o.value = o.value.flatMap((N) => p.has(N.id) ? O.has(N.id) ? [O.get(N.id)] : [] : [N]);
  }
  async function $(p) {
    const x = D, E = await t({ "before-id": p + 1, limit: 1 });
    if (x !== D) return;
    if (!E.ok) return q();
    const O = E.value.rows.find((N) => N.id === p);
    o.value = O ? o.value.map((N) => N.id === p ? O : N) : o.value.filter((N) => N.id !== p);
  }
  async function B(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return I(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return q();
    const E = Math.max(...o.value.map((ne) => ne.id)), O = D, N = await t({ "after-id": E });
    if (O !== D) return;
    if (!N.ok) return q();
    const J = new Set(o.value.map((ne) => ne.id));
    o.value = [...N.value.rows.filter((ne) => !J.has(ne.id)), ...o.value];
  }
  async function H() {
    if (!d.value || !o.value.length) return !1;
    const p = D, x = Math.min(...o.value.map((N) => N.id)), E = await t({ "before-id": x });
    if (p !== D) return !1;
    if (!E.ok || !E.value.rows.length) return d.value = !1;
    d.value = fo(E.value, n());
    const O = new Set(o.value.map((N) => N.id));
    return o.value = [...o.value, ...E.value.rows.filter((N) => !O.has(N.id))], !0;
  }
  let D = 0;
  function T(p, x) {
    var N, J;
    const E = p.ok ? e.shared ? [p.value] : ((N = p.value) == null ? void 0 : N.rows) ?? [] : [];
    p.ok && (o.value = x(E)), l.value = p.ok ? p.value : null;
    const O = E.length ? Math.min(...E.map((ne) => ne.id)) : 0;
    p.ok && ((J = p.value) != null && J.rows) && !o.value.some((ne) => ne.id < O) && (d.value = !e.shared && fo(p.value, n())), i.value = p.ok ? "" : p.error, Cs(c, () => r.value = !0);
  }
  async function G(p) {
    const x = ++D, E = await t({});
    x === D && T(E, p);
  }
  const F = (p) => {
    if (!a() || !p.length) return p;
    const x = Math.min(...p.map((O) => O.id)), E = Math.max(...p.map((O) => O.id));
    return [...o.value.filter((O) => O.id > E), ...p, ...o.value.filter((O) => O.id < x)];
  }, q = () => G(F), S = (p) => T(p, F), C = () => G((p) => p);
  async function b(p, x = null) {
    const E = await Au(x && { target: o, fields: { value: x(o.value) } }, p, e.run);
    return h.value = E.ok ? "" : E.error, g.value = E.ok ? E.value : null, await q(), E;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: q, loadLatest: C, older: H, act: b, actionFailure: h, answer: g, context: e, heard: B, showFirst: S, pageSize: n };
}
const Tu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ts(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = Ke(), l = Rl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Tu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Iu = 2e3;
function Es(e, t, n = Iu) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, i = () => l(async () => t() && await e()), r = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await i(), r();
      },
      typeof n == "function" ? n() : n
    ));
  }, c = async () => {
    s || document.hidden || o || (clearTimeout(a), await i(), r());
  };
  xe(async () => {
    document.addEventListener("visibilitychange", c), await l(e), r();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Ll = typeof document < "u" && document.documentElement.classList.contains("phone"), Nl = 120;
var El;
const ka = globalThis[El = Symbol.for("journal.pressed")] ?? (globalThis[El] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Bu(e = 0) {
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
function ns(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ql(e = window) {
  if (!ns(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    ns(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const as = "journal.stale-build-reload", Ru = 'script[type="module"][src*="/assets/index-"]', ho = (e) => {
  var t;
  return ((t = e.querySelector(Ru)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Lu(e = document, t = (a, s) => _e.quietRead(a, s), n = () => ql(window)) {
  const a = ho(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = ho(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let $a = "";
function Nu(e, t = () => ql(window)) {
  if (!e) return !1;
  const n = !!$a && $a !== e;
  return $a = e, n && t(), n;
}
const qu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Du(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(as) === e.message) return !1;
    t.setItem(as, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Pu(e = window.sessionStorage) {
  try {
    e.removeItem(as);
  } catch {
    return;
  }
}
const ju = 2e3, Fu = 3e4, Ue = Wt({ starting: !1, external: !1, late: !1, offline: !1 }), As = () => Ue.starting, Wu = 3;
let Cn = 0, ss = 0, Dl = 0, Pl = [];
async function Hu() {
  try {
    const e = await _e.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let mo = null;
const zu = () => mo ?? (mo = Hu().finally(() => mo = null));
function Uu() {
  clearTimeout(ss), clearTimeout(Dl), ss = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), Pl.splice(0).forEach((e) => e()), Lu();
}
async function Gu() {
  Ue.offline = !navigator.onLine;
  const e = await zu();
  if (Ue.external = e.updating, Cn = !e.restarting && !e.updating && e.reachable ? Cn + 1 : 0, Cn < Wu) return;
  Cn = 0, (!Nu(e.started_at) || ns()) && Uu();
}
function jl() {
  ss = setTimeout(async () => {
    await Gu(), Ue.starting && jl();
  }, ju);
}
function Vu() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, jl(), Dl = setTimeout(() => Ue.late = !0, Fu));
}
const Fl = () => Ue.starting ? new Promise((e) => Pl.push(e)) : Promise.resolve();
function Os(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const i = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, r = () => {
    s = null;
    const d = e();
    a = Date.now(), d instanceof Promise && (o = !0, d.catch(() => {
    }).finally(i));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const d = t - (Date.now() - a);
    d <= 0 ? r() : s = setTimeout(r, d);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function Ku(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Yu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Os(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Ku(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ut = "viewer.shell", En = 2e4, Qu = 4, po = "/api/read-lines", Xu = 5e3, Ju = 403, go = "/api/repeated-lines", Zu = 10, ec = 2e3, tc = 3e5, lS = 6e5, An = 6, nc = 500, ac = "/journal/summary", vo = "/api/server-state", sc = 2e4, On = Ll ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, oc = (e) => e.split("?")[0].endsWith(ac), os = (e, t) => Object.assign(new Error(t), { status: e });
async function lc(e, t, n = os) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const ic = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), rc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), yo = (e) => e.split(" ").slice(0, 2).join(" "), nt = "read", Tt = "write", uc = "stream";
class cc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = An;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = yo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < ec));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Zu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(go, { method: "POST", headers: { ...On, "Content-Type": "application/json" }, body: i }, [{ window: ut, line: go, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Bu(n ? Nl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: rc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Tt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = En) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Vu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Qu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(po, { headers: On }, [{ window: ut, line: po, kind: nt }], Xu).then(async (t) => {
      if (t.status === Ju) return /* @__PURE__ */ new Set();
      if (!t.ok) throw os(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Yu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = yo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = An;
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
    const i = a instanceof FormData, r = { method: t, headers: { ...On, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: ic(a) }, c = s || (i ? tc : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ut, line: n, kind: nt }], c)) : await this.sent(n, r, [{ window: ut, line: n, kind: Tt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, nc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = An, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return lc(i, `${i.status} ${i.statusText}`).catch((r) => {
      throw r.blocked && t !== "GET" && this.refused(r.message), r;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ut, line: t, kind: nt }], En)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: On });
    if (!n.ok) throw os(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, An, o).then((i) => (this.written(n), i)) : As() && !oc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ut, line: t, kind: uc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(vo, { cache: "no-store" }, [{ window: ut, line: vo, kind: nt }], sc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ut, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? nt : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const xa = Symbol.for("journal.transport"), _e = globalThis[xa] ?? (globalThis[xa] = new cc());
class Wl {
  constructor() {
    this.following = Xe([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => Ts(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ts(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const dc = 50, fc = "refresh", hc = 1e3, mc = 3e4, pc = "requested", gc = "after_window", vc = 50, Tn = ".*", yc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function bc(e) {
  const t = {}, n = Wt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function g(S) {
    const C = () => r[S] ?? r[`${S.slice(0, S.lastIndexOf("."))}.*`] ?? {}, b = M(void 0), p = Rl(e, async (x) => {
      const E = await I(S, x);
      return E.ok && !Object.keys(x).length && (b.value = E.value), E;
    }, () => C().page_size || vc, () => !!C().page_size, () => !!C().reads_ids);
    return t[S] = { ...p, data: b, readAt: 0 };
  }
  const y = new Proxy({}, { get: (S, C) => typeof C != "string" || C.startsWith("__v") ? void 0 : t[C] ?? g(C) }), w = (S) => (r[S].loading !== pc || S.endsWith(Tn)) && (!r[S].tab || r[S].tab === n.tab);
  function I(S, C = {}) {
    return new Promise((b) => {
      a.push({ name: S, flags: C, resolve: b }), a.length === 1 && setTimeout(_);
    });
  }
  async function _() {
    const S = /* @__PURE__ */ new Map(), C = a.splice(0).filter((x) => {
      const E = JSON.stringify(x.flags);
      return S.has(x.name) || S.set(x.name, E), S.get(x.name) === E ? !0 : (a.push(x), !1);
    });
    a.length && setTimeout(_);
    const b = Object.fromEntries(C.flatMap(({ name: x, flags: E }) => Object.entries(E).map(([O, N]) => [`${x}.${O}`, N]))), p = await e.readKeys({ only: [...new Set(C.map(({ name: x }) => x))], state: { ...n, ...b } });
    C.forEach(({ name: x, resolve: E }) => E(p.ok ? p.value.keys[x] : p));
  }
  async function $(S) {
    var x;
    const C = ++d;
    (S.length ? S : Object.keys(r).filter((E) => !E.endsWith(Tn) && r[E].loading === "first" && w(E))).forEach((E) => l[E] = C);
    const p = await e.readKeys({ only: S, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const E = (S.length ? S : Object.keys(t)).filter((N) => (l[N] ?? 0) <= C);
      E.forEach((N) => {
        y[N].readAt = Date.now(), p.failure === "unreachable" ? i.add(N) : i.delete(N), y[N].showFirst(p);
      });
      const O = p.failure === "unreachable" && ((x = e.waitForServer) == null ? void 0 : x.call(e));
      return O && O.then(() => {
        if (h) return;
        const N = E.filter((J) => l[J] === C);
        (N.length || !S.length && !E.length && d === C) && $(N);
      }), !1;
    }
    return F(p.value.declared), Object.entries(p.value.keys).forEach(([E, O]) => {
      (l[E] ?? 0) > C || (l[E] = C, y[E].readAt = Date.now(), i.delete(E), O.ok && (y[E].data.value = O.value), y[E].showFirst(O));
    }), !0;
  }
  function B(S) {
    const C = yc(S);
    return C.length ? (C.forEach((b) => o.names.add(b)), o.answer ?? (o.answer = new Promise((b) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, b($(p));
    })))) : $([]);
  }
  function H(S) {
    S.forEach((C) => s.add(C)), clearTimeout(c), c = setTimeout(() => {
      const C = [...s];
      s.clear(), C.length && $(C);
    }, dc);
  }
  const D = (S) => S.endsWith(Tn) ? Object.keys(t).filter((C) => C.startsWith(S.slice(0, -1)) && t[C].readAt) : [S], T = (S) => (r[S] ?? r[`${S.split(".")[0]}.*`]).reload_seconds;
  function G(S) {
    const C = Object.keys(r).filter((p) => S.event === fc || r[p].events.some((x) => Ts(x, S.event)));
    C.filter((p) => r[p].page_size).forEach((p) => y[p].heard(S));
    const b = C.filter((p) => !r[p].page_size);
    b.filter((p) => !w(p)).forEach((p) => y[p].readAt = 0), H(b.filter(w).flatMap(D));
  }
  function F(S) {
    if (Object.keys(r).length) return;
    r = S;
    const C = [...new Set(Object.values(S).flatMap((p) => p.events))];
    C.length && e.follow(C, G);
    const b = Object.keys(S).filter((p) => S[p].loading === gc);
    b.length && $(b);
  }
  he(() => n.tab, () => {
    const S = Object.keys(r).filter((C) => !C.endsWith(Tn) && w(C) && !y[C].readAt);
    S.length && $(S);
  }), Ie(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const S = Date.now(), C = Object.keys(r).filter((b) => r[b].reload_seconds > 0 && w(b)).flatMap(D).filter((b) => S - y[b].readAt >= (i.has(b) ? Math.min(T(b) * 1e3, mc) : T(b) * 1e3));
    C.length && H(C);
  }
  return Es(q, () => e.visible.value, hc), queueMicrotask(() => $([])), { props: y, state: n, reload: B, readKey: I };
}
const wc = Symbol("open-view"), qe = Symbol.for("journal.window-context"), Hl = Symbol("dock-card");
function kc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = bc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function Ke() {
  const e = Me(qe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return kc(e);
}
const $c = (e, t) => e(Hl, t), iS = () => Me(Hl), ls = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', bo = {
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
  agent: ls,
  worker: ls,
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
}, xc = ["data-icon", "stroke-width", "innerHTML"], me = {
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
      agent: ls,
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
    }, null, 12, xc));
  }
}, Sc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, _c = /* @__PURE__ */ z(Sc, [["__scopeId", "data-v-eb453d6f"]]), Mc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ua(), a = A(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = M(!1), o = A(() => t.busy || s.value), l = Me(qe, null), i = A(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((g) => g(c)).filter((g) => g instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Nl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), W(it(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: r
    }), {
      default: j(() => [
        m("span", {
          class: K(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), W(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          de(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), W(_c, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ z(Mc, [["__scopeId", "data-v-ededdadf"]]), Cc = ["aria-checked", "aria-haspopup", "onClick"], Ec = {
  key: 0,
  class: "segmented-dot"
}, Ac = {
  key: 1,
  class: "segmented-note"
}, Oc = {
  key: 2,
  class: "segmented-count"
}, Tc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = _s();
    return (s, o) => {
      const l = Vr("tip");
      return u(), f("span", {
        class: K(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(P, null, ae(e.options, (i) => Je((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: K(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Ec)) : k("", !0),
          te(" " + v(i.label) + " ", 1),
          i.note ? (u(), f("small", Ac, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (u(), f("em", Oc, v(i.count), 1)) : k("", !0)
        ], 10, Cc)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Dt = /* @__PURE__ */ z(Tc, [["__scopeId", "data-v-c89bc92d"]]), Ic = {
  key: 0,
  class: "more-items"
}, Bc = {
  key: 0,
  role: "alert"
}, Rc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Ic, [
      e.failure ? (u(), f("p", Bc, v(e.failure), 1)) : k("", !0),
      e.more ? (u(), W(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          te(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, gn = /* @__PURE__ */ z(Rc, [["__scopeId", "data-v-10464014"]]), Lc = { class: "link-group" }, Nc = {
  class: "group-label",
  "data-link-kind": ""
}, qc = ["disabled", "onClick"], Dc = { class: "title" }, Pc = { class: "relations" }, jc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = A(() => s.value ? n.rows : n.rows.slice(0, 3)), l = A(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Lc, [
      m("div", Nc, v(l.value), 1),
      (u(!0), f(P, null, ae(o.value, (g) => (u(), f("button", Pe({
        key: `${g.endpoint.model}:${g.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(g), {
        disabled: i(g),
        onClick: (y) => a("open", g)
      }), [
        m("span", Dc, v(g.endpoint.title), 1),
        m("span", Pc, [
          te(v(c(g)), 1),
          i(g) ? (u(), f(P, { key: 0 }, [
            te(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, qc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (g) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Fc = /* @__PURE__ */ z(jc, [["__scopeId", "data-v-be6f079c"]]), Wc = ["data-loaded"], Hc = { class: "rows" }, zc = ["disabled", "onClick"], Uc = { class: "title" }, Gc = { class: "relations" }, Vc = { key: 2 }, Kc = {
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
    const n = e, a = t, s = M([]), o = M({}), l = M(0), i = M(""), r = M(null), c = M(!1), d = M("");
    let h = 0;
    const g = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => g[q] || `${q.replaceAll("_", " ").replace(/^./, (S) => S.toUpperCase())}s`, w = A(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, S) => q + S, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, S]) => ({ key: q, label: y(q), count: S }))
    ]), I = A(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((C) => C.endpoint.model))].map((C) => [C, s.value.filter((b) => b.endpoint.model === C).length])), S = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([C], [b]) => (S[C] ?? 3) - (S[b] ?? 3)).map(([C, b]) => ({ model: C, count: b, rows: s.value.filter((p) => p.endpoint.model === C) }));
    }), _ = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, $ = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (S) => S.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((S) => S.replaceAll("_", " ")).join(", ")}`;
    async function H(q = 1) {
      const S = ++h;
      c.value = !0, d.value = "";
      const C = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && C.push("--outside-plan"), n.documentId && C.push("--first-counterpart", `doc:${n.documentId}`), i.value && C.push("--kind", i.value);
      try {
        const b = await n.read(C);
        if (S !== h) return;
        if (!b.ok) {
          d.value = b.error;
          return;
        }
        const p = b.value.counterparts ?? [], x = q === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(x.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = b.value.kinds ?? {}, l.value = b.value.total, r.value = b.value.next_page ?? null;
      } catch (b) {
        S === h && (d.value = b.message);
      } finally {
        S === h && (c.value = !1);
      }
    }
    function D(q) {
      if (_(q)) return;
      const [S, C] = q.endpoint.open_ref.split(":");
      a("open", { table: S, id: Number(C) });
    }
    function T(q) {
      i.value = q, H();
    }
    const G = () => !c.value && r.value && H(r.value), F = A(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", H();
    }, { immediate: !0 }), (q, S) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: K(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      w.value.length > 2 ? (u(), W(Dt, {
        key: 0,
        options: w.value,
        value: i.value,
        wrap: "",
        onPick: T
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", Hc, [
        e.grouped ? (u(!0), f(P, { key: 0 }, ae(I.value, (C) => (u(), W(Fc, {
          key: C.model,
          model: C.model,
          count: C.count,
          rows: C.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: D
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(P, { key: 1 }, ae(s.value, (C) => (u(), f("button", Pe({
          key: `${C.endpoint.model}:${C.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, $(C), {
          disabled: _(C),
          onClick: (b) => D(C)
        }), [
          m("span", Uc, v(C.endpoint.title), 1),
          m("span", Gc, [
            te(v(B(C)), 1),
            _(C) ? (u(), f(P, { key: 0 }, [
              te(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, zc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Vc, v(e.empty), 1)) : k("", !0),
        R(gn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: F.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Wc)) : k("", !0);
  }
}, Yc = /* @__PURE__ */ z(Kc, [["__scopeId", "data-v-29b9c31b"]]), Qc = (e, t, n) => Math.max(t, Math.min(n, e)), Xc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, zl = /* @__PURE__ */ new WeakMap(), Jc = (e, t) => zl.set(e, t);
function Zc(e, t) {
  for (let n = t; n; n = zl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ul(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Zc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const At = 8, ed = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = M(null), o = (p) => p ? `${p}px` : void 0, l = A(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = M({ w: 0, h: 0 }), r = M(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), h = (p) => {
      const x = p.closest(".pane, .float-window");
      return x ? d(x.getBoundingClientRect()) : c();
    }, g = (p, x) => `${Math.max(0, p ? Math.min(p, x) : x)}px`;
    function y(p, x) {
      return {
        below: p.bottom - x.bottom - a.gap - At,
        above: x.top - p.top - a.gap - At,
        across: p.right - p.left - 2 * At
      };
    }
    function w(p) {
      const x = h(a.anchor), E = y(x, p);
      return i.value.w <= E.across && i.value.h <= Math.max(E.below, E.above) ? x : c();
    }
    const I = A(() => {
      if (!r.value) return l.value;
      const p = r.value, x = w(p), E = y(x, p), { w: O, h: N } = i.value, J = a.align === "auto" ? p.left + p.right > x.left + x.right : a.align === "right", ne = Qc(J ? p.right - O : p.left, x.left + At, Math.max(x.left + At, x.right - O - At)), ge = N > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: g(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: g(a.maxHeight, E.below) };
      return { ...l.value, ...ge, left: `${ne}px`, maxWidth: g(a.maxWidth, E.across) };
    }), _ = n, $ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(p) {
      const x = $(), E = x.indexOf(document.activeElement);
      x[(E + p + x.length) % x.length].focus();
    }
    const H = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => _("close") }, D = (p) => H[p.key] && (p.preventDefault(), H[p.key]()), T = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const F = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(T);
    });
    Ul(s, (p) => a.anchor && !a.anchor.contains(p.target) && _("close"));
    const q = (p, x) => ["top", "left", "right", "bottom"].some((E) => Math.abs(p[E] - x[E]) > 1), S = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let C = 0;
    function b() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || S(p)) return _("close");
        q(p, r.value) && (r.value = p);
      }
      C = requestAnimationFrame(b);
    }
    return xe(() => {
      a.anchor && s.value && Jc(s.value, a.anchor), T(), s.value && F.observe(s.value), !a.plain && $()[0] && $()[0].focus(), b();
    }), Ie(() => {
      F.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(G);
    }), t({ element: s }), (p, x) => (u(), W(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: D
      }), [
        de(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Is = /* @__PURE__ */ z(ed, [["__scopeId", "data-v-3d203970"]]), td = { class: "split-button" }, nd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = M(null), s = M(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", td, [
      R(pe, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (r) => n("main"))
      }, {
        default: j(() => [
          de(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        R(pe, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (r) => s.value = !s.value)
        }, {
          default: j(() => [
            R(me, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), W(Is, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          de(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, ad = /* @__PURE__ */ z(nd, [["__scopeId", "data-v-c258494d"]]), sd = 0, od = "/api/lines", ld = "/api/line", wo = 5e3, ko = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), $o = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Sa = (e) => JSON.stringify(e.line), xo = () => new DOMException("cancelled", "AbortError");
class id {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Sa(t))) {
        _e.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => _e.whenFree(() => this.send()), sd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(xo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(xo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await _e.sent(od, ko({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => $o(i.body, nt)), wo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, r) => i.resolve(l[r]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => _e.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, nt), Date.now() - n < wo ? this.slow.delete(Sa(t.body)) : this.slow.add(Sa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await _e.sent(ld, ko(t.body, t.signal), [$o(t.body, n)], n === nt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Gl = new id(), rd = "/api/window";
function ud(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${rd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => _e.whenFree(async () => {
    const d = await _e.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: nt }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return _e.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Vl = /* @__PURE__ */ new Map();
class cd {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Xe({ buttons: [], missing: {} }), this.loading = Xe(!1), this.loaded = Xe(!1), this.failed = Xe(""), this.pending = null;
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
function rS(e, t) {
  const n = new cd(e, t);
  return Vl.set(e, n), n.load().catch(() => {
  }), n;
}
const Bs = (e) => Vl.get(e);
function dd(e, t, n) {
  const a = Bs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function fd(e, t) {
  if (!e) return !0;
  const n = Bs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Yn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Kl = {};
async function uS(e = (t) => _e.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Kl = (await t.json()).states);
}
const Rs = (e, t) => {
  var n;
  return (n = Kl[e]) == null ? void 0 : n[t];
}, ln = (e, t) => {
  var n;
  return ((n = Rs(e, t)) == null ? void 0 : n.label) ?? Yn(t);
}, Yl = (e, t) => {
  var n;
  return ((n = Rs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, hd = (e, t) => {
  var n;
  return ((n = Rs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, md = Symbol("pane-page"), Ls = Symbol("inspector-host"), Ql = { 1: "refused", 2: "usage", 3: "fault" }, pd = 100, gd = 50, vd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, yd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function bd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = M({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: g = "", tabs: y = [], sources: w = [], links: I = {}, search: _ = {}, readOnly: $ = !1, shared: B = null }) {
  const H = /* @__PURE__ */ new Map(), D = new AbortController(), T = M(!1), G = performance.now();
  let F = 0, q = 0, S = () => {
  };
  const C = new Promise((N) => S = N);
  D.signal.addEventListener("abort", S, { once: !0 });
  const b = () => {
    clearTimeout(q), q = setTimeout(() => {
      F === 0 && Cs(G, () => {
        T.value = !0, S();
      });
    }, gd);
  }, p = (N, J) => (F += 1, Bt(e, N, t, D.signal, J).finally(() => {
    F -= 1, b();
  })), x = (N, J) => (b(), C.then(() => D.signal.aborted ? lt : Bt(e, N, t, D.signal, J))), E = ({ only: N = [], state: J = {} } = {}) => (F += 1, kd(() => ud(e, t, N, J, D.signal), D.signal).finally(() => {
    F -= 1, b();
  })), O = (N, { unbatched: J = !1, deferred: ne = !1 } = {}) => {
    const le = H.get(N);
    if (le && performance.now() - le.at < pd) return le.answer;
    const ge = ne && !T.value ? x(N, J) : p(N, J);
    return H.set(N, { answer: ge, at: performance.now() }), ge;
  };
  return {
    answered: T,
    settle: b,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: A(() => a()),
    permissions: s,
    autoScroll: g,
    tabs: y,
    sources: w,
    links: I,
    search: _,
    readOnly: $,
    shared: B,
    read: O,
    readKeys: E,
    waitForServer: () => As() ? Fl() : null,
    run: (N) => Bt(e, N, t, D.signal),
    upload: (N) => xd(N, e, D.signal),
    cancel: () => D.abort(),
    signal: D.signal,
    subscriptions: l,
    follow: (N, J) => l.follow(e, [N].flat().filter((ne) => o.some((le) => Ts(le, ne))), (ne) => {
      H.clear(), J(ne);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (N) => A(() => {
      var J;
      return r.value[N] ?? ((J = c.find((ne) => ne.key === N)) == null ? void 0 : J.default);
    }),
    setting: async (N, J) => {
      const ne = await O(`window setting ${e} ${N}`);
      return ne.ok ? ne.value.value : J;
    },
    setOption: h,
    keep: (N, J) => Bt(e, ["window", "save-setting", e, N, JSON.stringify(J)], t, D.signal)
  };
}
function Xl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const lt = { ok: !1, failure: "cancelled", error: "" }, Ns = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Jl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? lt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ql[n.code] || "fault", error: Xl(n.error) };
  } catch {
    return t != null && t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
const wd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ql[e.code] || "fault", error: Xl(e.error) };
async function kd(e, t) {
  try {
    const n = await e();
    return t.aborted ? lt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, wd(s)])) } };
  } catch {
    return t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
async function Zl(e, t, n) {
  const a = await Jl(() => Gl.read(e, t, n), t);
  return a.failure !== "unreachable" || !As() ? a : (await Fl(), t.aborted ? lt : Zl(e, t, n));
}
function Bt(e, t, n, a = void 0, s = !1) {
  return _e.held(() => $d(e, t, n, a, s), _e.knownRead(Array.isArray(t) ? t : qs(t)));
}
async function $d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : qs(t), environment: n };
  return await _e.isRead(o.line) ? _e.joined(JSON.stringify(o), (l, i) => Zl({ ...o, attribution: i }, l, s), a, o).catch(() => lt) : Jl(() => Gl.write({ ...o, attribution: {
    client_id: _e.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function xd(e, t, n = void 0) {
  try {
    const a = await _e.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? lt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
function qs(e) {
  return [...e.matchAll(vd)].map(([t]) => t.replace(yd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Sd = (e) => `show-${e}`, cS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Sd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ei = "messages.chat", _d = {
  key: 0,
  class: "template-brief"
}, Md = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Cd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M([]), o = M(""), l = A(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = A(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Bt(ei, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((g) => g.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(P, null, [
      R(Dt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", _d, v(i.value.brief), 1)) : k("", !0),
      o.value ? (u(), f("p", Md, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Ed = /* @__PURE__ */ z(Cd, [["__scopeId", "data-v-14be8a5c"]]), Ad = { class: "info-tip" }, Od = ["aria-label"], Td = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Id = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Ad, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        R(me, {
          name: "info",
          size: 13
        })
      ], 8, Od),
      m("span", Td, [
        (u(!0), f(P, null, ae(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, ti = /* @__PURE__ */ z(Id, [["__scopeId", "data-v-a2fe5ff1"]]), Bd = { class: "form-field" }, Rd = { class: "form-field-head" }, Ld = ["for"], Nd = {
  key: 1,
  class: "form-field-aside"
}, qd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Bd, [
      m("div", Rd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Ld),
        e.help ? (u(), W(ti, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (u(), f("span", Nd, [
          de(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      de(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dd = /* @__PURE__ */ z(qd, [["__scopeId", "data-v-302c40bf"]]), is = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Pd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ua(), n = A(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), f("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(is), L(t).value]
    ]);
  }
}), jd = /* @__PURE__ */ z(Pd, [["__scopeId", "data-v-e130a5b9"]]), Fd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _s(), o = A(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), W(Dd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        R(zt, { value: o.value }, {
          choice: j(() => [
            R(Dt, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            R(Ed, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            R(jd, {
              id: L(s),
              value: e.value,
              onInput: i[2] || (i[2] = (r) => a("pick", r.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, fa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), W(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        R(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Wd(e, t, n, a = () => window) {
  xe(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Hd = (e, t = () => !0) => Wd("keydown", (n) => n.key === "Escape" && t() && e());
function ni(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = M(!1), s = A(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Hd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const zd = 80, Ot = Wt([]);
function ai(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Ie(n), A(() => zd + Math.max(0, Ot.indexOf(t)));
}
let si = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return si = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Ud = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Gd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Ud)];
    if (!l.length) return o.preventDefault();
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  xe(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : si, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Vd = ["aria-modal", "aria-label", "aria-labelledby"], Kd = {
  key: 0,
  class: "dialog-head"
}, Yd = ["id", "tabindex"], Qd = {
  key: 1,
  class: "dialog-foot"
}, Xd = 500, Jd = 400, Zd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ni(a, n), i = ai(s), r = M(null), c = M(null), d = M(null), h = _s(), g = M(!1), y = Date.now();
    n.modal && Gd(c, () => a("escape"), d);
    function w() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Jd);
    }
    function I(B) {
      !n.modal || Date.now() - y >= Xd || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const _ = () => r.value && (r.value.scrollTop = r.value.scrollHeight), $ = new MutationObserver(_);
    return he(r, (B) => {
      $.disconnect(), B && n.follow && ($.observe(B, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Ie(() => $.disconnect()), (B, H) => (u(), W(ca, { to: "body" }, [
      R(Ht, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), f("div", {
            key: 0,
            class: K(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: L(i) }),
            onClick: $e(w, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: K(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: g.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? L(h) : void 0,
              onKeydownCapture: I
            }, [
              e.bare ? k("", !0) : (u(), f("header", Kd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Yd),
                e.closable ? (u(), W(fa, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: K(["dialog-body", { bare: e.bare }])
              }, [
                de(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (u(), f("footer", Qd, [
                de(B.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Vd)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ha = /* @__PURE__ */ z(Zd, [["__scopeId", "data-v-6d1ecd98"]]), ef = {
  class: "action-output",
  "data-action-output": ""
}, tf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(ha, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", ef, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, nf = /* @__PURE__ */ z(tf, [["__scopeId", "data-v-423a045c"]]);
function af(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Kr(nf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const sf = (e, t, n = {}) => qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function vn(e, t, n, a = {}) {
  var s;
  try {
    if (!await fd(e.module, n)) return { ok: !1, error: "" };
    const o = await Bt(ei, sf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && af(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const of = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, _a = [
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
}), ma = {
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
    filters: _a
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: _a
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
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: _a }),
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
}, lf = ["secrets", "plugins"], oi = Object.keys(ma).filter((e) => !(Ll && lf.includes(e)));
A(() => oi.map((e) => ({ name: e, ...ma[e] })));
const Ut = (e) => ma[e], li = new Map(oi.flatMap((e) => [e, e.replace(/s$/, ""), ma[e].title.toLowerCase()].map((t) => [t, e]))), mt = (e) => li.get(String(e).toLowerCase()) || "", ii = [...li.keys()].sort((e, t) => t.length - e.length).join("|"), rf = {
  class: "button-form",
  "data-button-form": ""
}, uf = {
  key: 0,
  class: "button-form-title"
}, cf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, df = { class: "button-form-actions" }, ff = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = M(!1), l = M(""), i = A(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = A(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Ut(mt(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await vn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), W(ha, {
      title: r.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (g) => a("close"))
    }, {
      default: j(() => {
        var g;
        return [
          m("div", rf, [
            (g = e.row) != null && g.title ? (u(), f("p", uf, v(e.row.title), 1)) : k("", !0),
            (u(!0), f(P, null, ae(e.button.fields, (y) => (u(), W(Fd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (w) => s.value[y.name] = w
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", cf, v(l.value), 1)) : k("", !0),
            m("div", df, [
              R(pe, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  te("Cancel", -1)
                ])]),
                _: 1
              }),
              R(pe, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: j(() => [...h[3] || (h[3] = [
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
}, hf = /* @__PURE__ */ z(ff, [["__scopeId", "data-v-f26c27a7"]]), mf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, pf = {
  key: 1,
  class: "menu-item-text"
}, gf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: K(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", mf, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (u(), f("span", pf, [
        m("span", null, [
          de(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : de(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Pt = /* @__PURE__ */ z(gf, [["__scopeId", "data-v-fec99974"]]), vf = ["aria-busy"], yf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, bf = { class: "button-slot-confirm-text" }, wf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, kf = {
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
    const n = e, a = t, s = A(() => Bs(n.environment)), o = A(
      () => {
        var $;
        return !n.readOnly && (($ = s.value) == null ? void 0 : $.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = A(() => {
      var $;
      return !n.readOnly && (($ = s.value) == null ? void 0 : $.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = A(() => n.readOnly ? [] : dd(n.environment, n.name, n.row)), c = M(null), d = M(null), h = M(""), g = M(!1), y = ($) => [$.from ? `From ${$.from}` : "", $.tip, $.warning].filter(Boolean).join(" · "), w = ($) => $.icon || ($.warning ? "dot" : "");
    function I($) {
      if (!(g.value || n.readOnly)) {
        if ($.fields.length) {
          c.value = $;
          return;
        }
        if ($.confirm) {
          d.value = $;
          return;
        }
        return _($);
      }
    }
    async function _($) {
      d.value = null, h.value = "", a("failure", ""), g.value = !0;
      const B = await vn($, n.row, n.environment);
      g.value = !1, h.value = B.ok ? "" : B.error;
      const H = $.label.toLowerCase() + (n.objectName && !$.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", B.ok ? "" : `Could not ${H}: ${B.error}`), B.ok && a("done");
    }
    return ($, B) => (u(), f("span", {
      class: K(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(P, { key: 0 }, [
        B[5] || (B[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        R(pe, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...B[4] || (B[4] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", yf, [
        m("span", bf, v(d.value.confirm), 1),
        R(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: K({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: B[0] || (B[0] = (H) => _(d.value))
        }, {
          default: j(() => [
            te(v(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        R(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: B[1] || (B[1] = (H) => d.value = null)
        }, {
          default: j(() => [...B[6] || (B[6] = [
            te("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (u(), f(P, { key: 2 }, [
        (u(!0), f(P, null, ae(r.value, (H) => (u(), f(P, {
          key: H.name
        }, [
          H.menu.length ? (u(), W(ad, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: g.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (D) => I(H)
          }, {
            menu: j(({ close: D }) => [
              (u(!0), f(P, null, ae(H.menu, (T) => (u(), W(Pt, {
                key: T.label,
                description: T.description,
                onClick: (G) => (D(), I({ ...H, ...T, menu: [] }))
              }, {
                default: j(() => [
                  te(v(T.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              te(v(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), W(pe, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: K({ danger: H.danger }),
            icon: w(H),
            disabled: g.value,
            title: y(H),
            "data-button": H.name,
            onClick: (D) => I(H)
          }, {
            default: j(() => [
              te(v(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", wf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (u(), W(hf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (H) => c.value = null),
          onDone: B[3] || (B[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, vf));
  }
}, Ds = /* @__PURE__ */ z(kf, [["__scopeId", "data-v-a4b6f174"]]), $f = {
  class: "running",
  "data-running-command": ""
}, xf = ["title"], Sf = {
  key: "idle",
  class: "running-idle"
}, _f = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", $f, [
      R(Ht, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, xf)) : (u(), f("span", Sf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, dS = /* @__PURE__ */ z(_f, [["__scopeId", "data-v-d3240219"]]), Mf = ["aria-checked", "aria-label", "title"], Cf = {
  key: 0,
  class: "switch-inner"
}, Ef = {
  key: 0,
  class: "switch-word"
}, Af = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("button", {
      type: "button",
      class: K(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: K(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), f("span", Cf, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Ef, v(e.word), 1)) : k("", !0)
    ], 10, Mf));
  }
}, fS = /* @__PURE__ */ z(Af, [["__scopeId", "data-v-1bfb90f3"]]);
function ri(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Qn(e, t) {
  return ri(() => localStorage, e, t);
}
function ui(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ps(e, t) {
  return ui(() => localStorage, e, t);
}
function ci(e, t) {
  he(t, (n) => Ps(e, n), { deep: !0 });
}
function Of(e, t) {
  return ri(() => sessionStorage, e, t);
}
function Tf(e, t) {
  return ui(() => sessionStorage, e, t);
}
const Xn = "journal.environment", di = M(Of(Xn, Qn(Xn, "")));
function If(e) {
  di.value = e, Tf(Xn, e), Ps(Xn, e);
}
const Jn = M(location.hash), So = Xe(null), _o = { integrations: "mcp", library: "team" };
function Bf() {
  if (!So.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (_o[n]) {
    location.replace(`#/${[_o[n], ...a].join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash;
    return;
  }
  !n || So.value(n) || (If(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jn.value = location.hash, Bf();
});
const rs = A(() => {
  const [e, t = ""] = Jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: di.value,
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
}), js = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${js.page(e)}?open=${t}`
};
function Rf(e = "", t = 0, n = "") {
  location.hash = js.page(e, t, n);
}
function Lf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Nf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function fi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Nf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Lt = {};
function hS(e, t) {
  return Lt[e] = t, () => Lt[e] === t && delete Lt[e];
}
function gt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Lt[e]) != null && l.call(Lt, t))) return;
  const s = rs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  fi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function qf(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return gt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  fi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? qf(a, s, Number(o), 0, t) : gt(s, Number(o), 0, t);
}
function Df(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Rt(e) {
  const t = Df(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function mS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Pf = { class: "inspector-part" }, jf = { class: "inspector-part-title" }, Ff = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Pf, [
      m("h4", jf, v(e.title), 1),
      de(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, pS = /* @__PURE__ */ z(Ff, [["__scopeId", "data-v-5175e4a3"]]), Mo = /* @__PURE__ */ new Map(), Wf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = M(null), a = M(!1), s = M(t.name && Mo.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && Mo.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return xe(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ie(() => i.disconnect()), (r, c) => (u(), f(P, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: K(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (d) => o(!0))
      }, [
        de(r.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((d) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, hi = /* @__PURE__ */ z(Wf, [["__scopeId", "data-v-4d2235ba"]]), Hf = ["aria-valuenow", "aria-valuemax"], zf = {
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
    const t = e, n = A(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (u(), f("span", {
      class: K(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, Hf));
  }
}, mi = /* @__PURE__ */ z(zf, [["__scopeId", "data-v-9eba6a85"]]), Uf = { processes: "process", memories: "memory", replies: "reply" }, Zn = (e) => (Uf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), us = [], Gf = 2e3, dt = /* @__PURE__ */ new Map(), Vf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Kf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Mt(e, { first: t = !1 } = {}) {
  t ? us.unshift(e) : us.push(e), dt.clear();
}
function pi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Yf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Qf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ot(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Xf(e, t) {
  const n = [{ type: "text", text: ot(e).replace(/\r\n/g, `
`) }];
  for (const a of us)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function rn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Jf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Jf(e) {
  return e.split(Kf).map((t, n) => n % 2 ? t : t.replace(Vf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Co(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Zf = 24;
function eh(e) {
  const [t, , ...n] = e, a = Co(t), s = n.map(Co), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > Zf) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${rn(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${rn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const gi = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, Eo = (e) => e.match(/^\s*/)[0].length;
function vi(e) {
  const t = e[0].match(cs), n = Eo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Eo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${rn(o.text)}${o.nested.length ? vi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function th(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (gi.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Ao = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function yi(e) {
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
      const i = t.findIndex((c, d) => d > a && /^(```|~~~)/.test(c)), r = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(a + 1, r).join(`
`)}</code></pre>`), a = r + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${rn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Ao(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(eh(t.slice(a, i))), a = i;
      continue;
    }
    if (gi.test(s)) {
      const i = th(t, a);
      n.push(vi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${yi(
          t.slice(a, i).map((r) => r.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Ao(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${rn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const nh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ah = (e) => e.type !== "text" && !nh.test(e.html);
function sh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(yi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ah(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Qf(e, t), a = dt.get(n);
  if (dt.delete(n), a && a.source === t.source && a.reads.every((l) => Yf(l, t)))
    return dt.set(n, a), a.html;
  const s = [], o = sh(Xf(e, { ...t, reads: s }));
  return dt.set(n, { html: o, reads: s, source: t.source }), dt.size > Gf && dt.delete(dt.keys().next().value), o;
}
const Ma = /* @__PURE__ */ new WeakMap();
function oh(e) {
  if (Ma.has(e)) return Ma.get(e);
  const t = Yr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), g = e.read(`${Zn(c)} show ${d}`);
    n.set(h, g), g.then((y) => {
      n.get(h) === g && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Zn(c).replace(/-/g, "_")}.*`], (d) => {
      const h = `${c}:`;
      for (const g of t.keys()) {
        if (!g.startsWith(h)) continue;
        const y = Number(g.slice(h.length));
        (!d.row_id || d.row_id === y) && o(c, y);
      }
    }));
  }
  function i(c, d) {
    l(c);
    const h = s(c, d);
    return !t.has(h) && !n.has(h) && o(c, d), t.get(h);
  }
  const r = { id: Symbol("window text rows"), row: i };
  return Ma.set(e, r), r;
}
function bi() {
  const e = Me(qe, null), t = e ? oh(e) : null;
  return (n, a = {}) => Fs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const wi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, yn = (e) => String(e || "").replace(wi, (t, n, a, s) => s), lh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), In = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ih = /^Traceback \(most recent call last\):/m, rh = 8;
function ki(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, rh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function uh(e) {
  const t = [...e.matchAll(lh)].map((a) => a.index);
  if (In.lastIndex = 0, !t.length || !In.test(e)) return null;
  In.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(In)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ki(n), tail: "" } : null;
}
function ch(e) {
  const t = ih.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ki([o]), tail: n.slice(s).join(`
`) };
}
Mt((e) => {
  const t = yn(e), n = ch(t) || uh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ea = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, $i = (e) => `${e.table}:${e.id}`, Oo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ca = 80;
function To(e) {
  return e.length <= Ca ? e : `${e.slice(0, Ca + 1).replace(/\s+\S*$/, "") || e.slice(0, Ca)}…`;
}
const Io = {
  messages: (e) => To(Oo(e.text)),
  comments: (e) => To(Oo(e.text)),
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
}, dh = (e) => (Io[e.table] ? Io[e.table](e) : e.title || "") || "", St = (e) => ea(e.created_at), fh = (e) => ea(e.updated_at) || St(e), hh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, mh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ph(e) {
  const t = hh.exec(e);
  if (t && mt(t[1])) return { at: t.index, length: t[0].length, table: mt(t[1]), id: Number(t[2]), label: t[3] };
  const n = mh.exec(e), a = n && mt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function gh(e, t, n, a) {
  const s = pi(a, e, t), o = yn(s ? dh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ot(Ut(e).title)} ${t}</span><span class="row-card-title">${ot(o)}</span></a>`;
}
Mt(
  (e, t) => {
    const n = ph(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: gh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const vh = /\.(png|jpe?g|gif|webp|svg)$/i, yh = (e) => vh.test(e), bh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, wh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function kh(e, t) {
  const n = bh.exec(e), [, a, s, o, l, i] = n || [], r = n && mt(a || o), c = r && pi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Ut(r).title} ${c.id} · ${ot(i)}`, g = yh(i) ? `<img class="file-card-image" src="${d}" alt="${ot(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${ot(i)}">${g}<span class="file-card-name">${h}</span></a>` };
}
function $h(e) {
  const t = wh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ot(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Mt(
  (e, t) => {
    if (t.inline) return null;
    const n = kh(e, t) || $h(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const xh = /`([^`\n]+)`/g;
Mt((e) => e.replace(xh, (t, n) => `<code>${n}</code>`));
const Bo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Mt(
  (e, t) => e.replace(wi, (n, a, s, o) => Bo[a] ? Bo[a](s, o, t) : o)
);
const Sh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, xi = new RegExp(`\\b(${ii}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Si = new RegExp(`\\b(${ii}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), _h = new RegExp(`<code>((?:${xi.source}|${Si.source}))</code>`, "gi"), Mh = (e) => e.replace(_h, "$1"), Ch = (e, t) => `<a class="row-pill" href="#" data-peek="${mt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Eh = (e) => e.replace(Si, (t, n, a) => a.replace(/\d+/g, (s) => Ch(n.replace(/s$/i, ""), s))), Ah = (e) => Eh(e).replace(
  xi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${mt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Mt(
  (e, t) => t.rowNames === !1 ? e : Mh(e).split(Sh).map((n, a) => a % 2 ? n : Ah(n)).join("")
);
const Oh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Th = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ih = /[\w\]]\(/, Bh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Rh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Lh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Nh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, qh = /[[({,]$/, Dh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ph = /^(\t|\s{2,})\S/, jh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Fh = /`[^`]+`/, Wh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Hh = /[{}()[\];=<>$&|*\\@+^~%]/g, _i = /^\s*(?:[-*+]|\d+[.)])\s/, zh = /^\s*>/, Uh = /^\s*\|/, Gh = 0.6, Vh = 0.4, Kh = 5, Yh = 0.03, Mi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Kh && t.every((n) => Wh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Hh) ?? []).length / e.length < Yh;
}, Ea = (e) => {
  const t = e.trim();
  return Fh.test(t) ? !1 : [Oh, Th, Ih, Bh, Rh, Lh, Nh, qh, Dh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ph.test(e) && !_i.test(e) && !Mi(e);
};
function Qh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || _i.test(t[0]) || t.every((o) => zh.test(o) || Uh.test(o))) return "text";
  const n = t.filter((o) => !jh.test(o.trim()));
  if (t.length === 1) return !n.length || Ea(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ea).length, s = n.filter((o) => !Ea(o) && Mi(o)).length;
  return a >= n.length * Gh && s <= n.length * Vh ? "code" : "text";
}
const ds = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Xh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Jh = `${ds} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Zh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", em = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ro = {
  js: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Xh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Jh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Zh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: em, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, tm = {
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
function Lo(e, t, n) {
  return n && e.startsWith(n, t);
}
function nm(e, t) {
  const n = Ro[tm[t] ?? t] || Ro.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (i, r) => r && s.push({ type: i, value: r });
  for (; o < e.length; ) {
    const i = e[o];
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
    if (Lo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Lo(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), d = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const r = (n.triple || []).find((c) => e.startsWith(c, o));
    if (r) {
      const c = e.indexOf(r, o + 3), d = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, d)), o = d;
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
      const d = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? d.toLowerCase() : d, g = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(h) ? "keyword" : g ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function am(e, t) {
  const n = [""];
  for (const { type: a, value: s } of nm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ot(l) : `<span class="tok-${a}">${ot(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function sm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const om = 1500, No = /* @__PURE__ */ new WeakMap();
async function lm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await sm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(No.get(t)), No.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, om)
  )));
}
typeof document < "u" && document.addEventListener("click", lm, !0);
const im = /\n\s*\n/, rm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, um = /^\s*(`{3,}|~{3,})\s*$/, cm = /^\s{4,}\S/, dm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, fs = /^\s*(?:[-*+]|\d+[.)])\s/, Ci = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, fm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ws(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function hm(e) {
  const t = Ws(e.join(`
`));
  return (fm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const mm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ci.test(t) && !fs.test(t);
}, pm = (e, t) => fs.test(t) || fs.test([...e].reverse().find((n) => n.trim()) || "");
function Hs(e, t) {
  const n = t || hm(e), a = am(Ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function gm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && um.test(s));
  return a < 0 ? e.length : a;
}
function vm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Hs(a.map(yn), n ? n.toLowerCase() : "");
}
function ym(e) {
  const t = e.split(im).map((l) => ({ paragraph: l, type: Qh(Ws(l).split(`
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
    if (i.some(({ type: r }) => r === "code") || i.length > 1) {
      s(), n.push(Hs(i.map(({ paragraph: r }) => r).join(`

`).split(`
`).map(yn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function bm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : ym(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(rm);
    if (i) {
      const c = gm(n, l, i[2]);
      o(), a.push(vm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = mm(s) ? dm : cm;
    if (!t && r.test(n[l]) && !pm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ci.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Hs([...d, ...n.slice(l, c)].map(yn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Mt((e, t) => bm(e, t.document), { first: !0 });
const wm = ["innerHTML"], km = ["innerHTML"], $m = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = bi(), a = A(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Rt) && L(Rt)(...l)),
      innerHTML: a.value
    }, null, 8, wm)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Rt) && L(Rt)(...l)),
      innerHTML: a.value
    }, null, 8, km));
  }
}, at = /* @__PURE__ */ z($m, [["__scopeId", "data-v-d8e75741"]]), qo = (e) => [...new Set(e.agents.map((t) => t.name))], xm = (e) => qo(e).length === 1 ? `Worker: ${qo(e)[0]}` : "Delegated", Sm = ["aria-expanded"], _m = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Mm = {
  key: 0,
  class: "tip-failure"
}, Cm = { key: 1 }, Em = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(qe, null), a = A(() => hd(t.type, t.state)), s = M(!1), o = M([]), l = M("");
    async function i() {
      s.value = !0;
      const d = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = d.ok ? "" : d.error, d.ok && (o.value = d.value.lines ?? []);
    }
    const r = () => s.value = !1, c = () => s.value ? r() : i();
    return (d, h) => a.value ? (u(), f("span", {
      key: 0,
      class: "state-badge",
      tabindex: "0",
      role: "button",
      "aria-expanded": s.value,
      "data-state-badge": "",
      onMouseenter: i,
      onMouseleave: r,
      onFocus: i,
      onBlur: r,
      onClick: c,
      onKeydown: xt(r, ["escape"])
    }, [
      te(v(L(ln)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", _m, [
        l.value ? (u(), f("span", Mm, v(l.value), 1)) : k("", !0),
        (u(!0), f(P, null, ae(o.value, (g, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : k("", !0)
    ], 40, Sm)) : (u(), f("span", Cm, v(L(ln)(e.type, e.state)), 1));
  }
}, Am = /* @__PURE__ */ z(Em, [["__scopeId", "data-v-73ac4596"]]), Om = {
  class: "plan-details",
  "data-plan-details": ""
}, Tm = { class: "state-line" }, Im = {
  key: 0,
  class: "phase-count"
}, Bm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Rm = { class: "text" }, Lm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Nm = { class: "overall" }, qm = { class: "overall-figure" }, Dm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Pm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, jm = {
  key: 4,
  class: "part"
}, Fm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Om, [
      m("div", Tm, [
        R(Am, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: K(["status", L(Yl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Im, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Bm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Rm, v(e.plan.reason), 1)
      ])) : k("", !0),
      e.plan.total ? (u(), f("section", Lm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Nm, [
          R(mi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", qm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : k("", !0),
      e.plan.assignee ? (u(), f("p", Dm, "Agent: " + v(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", Pm, v(L(xm)(e.plan)), 1)) : k("", !0),
      e.plan.brief ? (u(), f("section", jm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        R(hi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: j(() => [
            R(at, {
              class: "text",
              "data-resource-text": "",
              text: e.plan.brief
            }, null, 8, ["text"])
          ]),
          _: 1
        }, 8, ["name"])
      ])) : k("", !0)
    ]));
  }
}, gS = /* @__PURE__ */ z(Fm, [["__scopeId", "data-v-c37da567"]]), Wm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Hm = { ...Wm, done: "Completed" }, zm = /* @__PURE__ */ new Set(["completed", "cancelled"]), Um = (e) => zm.has(e), un = (e) => Um(e) ? "done" : e, Gm = { class: "task-status-icon" }, Vm = ["width", "height", "aria-label"], Km = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = A(() => Yl("task", un(t.status))), a = A(() => n.value === "testing" ? "started" : n.value), s = A(() => Hm[t.status] ?? ln("task", t.status));
    return (o, l) => (u(), f("span", Gm, [
      R(Ht, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (u(), f("svg", {
            key: n.value,
            class: K(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            R(zt, { value: a.value }, {
              blocked: j(() => [...l[0] || (l[0] = [
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
              done: j(() => [...l[1] || (l[1] = [
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
              started: j(() => [...l[2] || (l[2] = [
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
              asked: j(() => [...l[3] || (l[3] = [
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
              paused: j(() => [...l[4] || (l[4] = [
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
              planned: j(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: j(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Vm))
        ]),
        _: 1
      })
    ]));
  }
}, bn = /* @__PURE__ */ z(Km, [["__scopeId", "data-v-ae24a63f"]]), Ym = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Qm = ["title", "onClick"], Xm = { class: "agent-word" }, Jm = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = A(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((r) => r.helper_id && !n.has(r.state))) {
        const r = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, held: r });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (u(), f("div", Ym, [
      (u(!0), f(P, null, ae(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => L(Ne)(`agents:${i.id}`)
      }, [
        m("span", {
          class: K(["agent-dot", { held: i.held }])
        }, null, 2),
        te(" " + v(i.name) + " ", 1),
        m("span", Xm, v(i.held ? "Working" : "Queued"), 1)
      ], 8, Qm))), 128))
    ])) : k("", !0);
  }
}, Zm = /* @__PURE__ */ z(Jm, [["__scopeId", "data-v-0c589695"]]), ep = { class: "phases" }, tp = { class: "phead" }, np = { class: "mark" }, ap = { class: "ptitle" }, sp = { class: "phead-end" }, op = {
  key: 0,
  class: "checkpoint"
}, lp = { class: "progress" }, ip = {
  key: 0,
  class: "when"
}, rp = ["onClick"], up = { class: "row-id" }, cp = { class: "row-title" }, dp = ["title"], fp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", ep, [
      (u(!0), f(P, null, ae(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: K(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", tp, [
          m("span", np, [
            R(me, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", ap, v(c + 1) + ". " + v(r.title), 1),
          m("span", sp, [
            r.checkpoint ? (u(), f("span", op, "checkpoint")) : k("", !0),
            m("span", lp, v(s(r)) + "/" + v(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", ip, v(r.goal), 1)) : k("", !0),
        R(Zm, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(P, null, ae(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: K(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          R(bn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", up, "#" + v(d.id), 1),
          m("span", cp, v(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, v(d.helper_name), 9, dp)) : k("", !0)
        ], 10, rp))), 128))
      ], 2))), 128))
    ]));
  }
}, vS = /* @__PURE__ */ z(fp, [["__scopeId", "data-v-6a600744"]]), hp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, mp = {
  key: 0,
  class: "empty",
  role: "alert"
}, pp = {
  key: 2,
  class: "empty"
}, gp = { class: "day" }, vp = { class: "events" }, yp = { class: "mark" }, bp = { class: "what" }, wp = { class: "head" }, kp = { class: "word" }, $p = ["title", "onClick"], xp = { class: "at" }, Sp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = M(null), l = M(""), i = A(() => {
      const d = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const g = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        d.set(g, [...d.get(g) ?? [], h]);
      }
      return [...d].map(([h, g]) => ({ day: h, items: g }));
    }), r = (d) => new Date(d).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const d = await a.read(["plan", "timeline", String(a.id)]);
      l.value = d.ok ? "" : d.error, o.value = d.ok ? d.value.events : [];
    }
    return he(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", hp, [
      l.value ? (u(), f("p", mp, v(l.value), 1)) : o.value === null ? (u(), W(Ve, { key: 1 })) : o.value.length ? k("", !0) : (u(), f("p", pp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(P, null, ae(i.value, (g) => (u(), f(P, {
        key: g.day
      }, [
        m("h3", gp, v(g.day), 1),
        m("ol", vp, [
          (u(!0), f(P, null, ae(g.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: K(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", yp, [
              n[y.event_type].state ? (u(), W(bn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), W(me, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", bp, [
              m("div", wp, [
                m("span", kp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (w) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, $p),
                m("span", xp, v(r(y.time)), 1)
              ]),
              y.text ? (u(), W(at, {
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
}, yS = /* @__PURE__ */ z(Sp, [["__scopeId", "data-v-9e511133"]]);
function _p(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function zs(e, t = Date.now()) {
  const n = _p(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Mp = 36e5;
function Cp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Mp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Do(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ei(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Po(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Aa = (e) => String(e).padStart(2, "0");
function Ai(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Aa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Aa(Math.floor(t % 3600 / 60))}m ${Aa(t % 60)}s`;
}
const Ep = 1e3;
function Oi() {
  const e = M(Date.now()), t = setInterval(() => e.value = Date.now(), Ep);
  return et(() => clearInterval(t)), e;
}
const Ap = Symbol("resource-subscriptions");
function wn(e, t) {
  const n = Me(Ap, () => new Wl(), !0), a = Os(t, 100), s = n.follow("resources", e, a);
  da(() => {
    s(), a.cancel();
  });
}
const Op = "Not known", Tp = 80, Ip = 1e3, Bp = "worker", Rp = "main", Lp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Ti = (e) => e.ok ? e.value.rows : [], jo = (e) => e.ok ? e.value.total : 0, Ii = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Np = (e, t) => (t == null ? void 0 : t.given_name) || Ii((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), qp = (e, t) => e.ended_at ? "ended" : e.paused_at || Lp.has(t == null ? void 0 : t.state) ? "waiting" : "running", Dp = (e, t) => [(t == null ? void 0 : t.profile) && Ii(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), Bi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Pp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Ip, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ai(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Tp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Op : `$${t.cost_dollars.toFixed(2)}` }), e.role === Bp && l.push({ key: "pace", label: "Tasks an hour", value: String(Cp(Bi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Rp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function jp(e) {
  const t = Bi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Fp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Do(e.created_at)]), e.ended_at && n.push(["Ended", Do(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Wp = { class: "band" }, Hp = { key: 0 }, zp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Wp, [
      R(me, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      de(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Hp, v(e.count), 1)) : k("", !0)
    ]));
  }
}, jt = /* @__PURE__ */ z(zp, [["__scopeId", "data-v-1758914f"]]), Up = { class: "number" }, Gp = { class: "text" }, Vp = 150, Kp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = M(!1), a = A(() => t.text.length > Vp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(P, null, [
      e.text ? (u(), f(P, { key: 0 }, [
        R(jt, { icon: "file" }, {
          default: j(() => [
            te(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: K(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (u(), f(P, { key: 1 }, [
        R(jt, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            te("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(P, null, ae(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Up, v(i.id), 1),
            m("span", Gp, [
              te(v(i.text), 1),
              m("span", {
                class: K(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Yp = /* @__PURE__ */ z(Kp, [["__scopeId", "data-v-c99de22c"]]), Qp = ["aria-expanded"], Xp = { class: "count" }, Jp = {
  key: 0,
  "data-agent-fold-body": ""
}, Zp = {
  __name: "AgentFold",
  props: /* @__PURE__ */ qt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = sn(e, "open");
    return (n, a) => (u(), f(P, null, [
      m("button", {
        type: "button",
        class: K(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        R(me, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        te(v(e.label), 1),
        m("span", Xp, v(e.count), 1),
        R(me, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Qp),
      t.value ? (u(), f("div", Jp, [
        de(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Oa = /* @__PURE__ */ z(Zp, [["__scopeId", "data-v-7f93d8d9"]]), e1 = ["onClick"], t1 = { class: "text" }, n1 = { class: "aside" }, a1 = {
  key: 0,
  class: "none"
}, s1 = {
  class: "skills",
  "data-agent-skills": ""
}, o1 = {
  key: 0,
  class: "none-inline"
}, l1 = { class: "label" }, i1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Wt({ helpers: !1, skills: !1 }), a = M([]), s = M([]), o = async (i) => Ti(await t.read(i));
    he(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), he(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Yn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(P, null, [
      R(Oa, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), f(P, null, ae(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => L(gt)("agents", c.id)
          }, [
            m("span", t1, v(l(c)), 1),
            m("span", n1, v(L(Yn)(c.role)) + " " + v(c.id), 1)
          ], 8, e1))), 128)),
          a.value.length ? k("", !0) : (u(), f("p", a1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      R(Oa, {
        open: n.skills,
        "onUpdate:open": r[1] || (r[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", s1, [
            (u(!0), f(P, null, ae(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (u(), f("span", o1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      R(Oa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: j(() => [
          (u(!0), f(P, null, ae(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", l1, v(c) + ":", 1),
            m("span", {
              class: K(["value", h])
            }, v(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, r1 = /* @__PURE__ */ z(i1, [["__scopeId", "data-v-358a0300"]]), u1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Oi(), a = A(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(zs)(e.at, L(n))), 9, u1));
  }
}, c1 = {
  class: "now",
  "data-agent-now": ""
}, d1 = {
  key: 1,
  class: "muted"
}, f1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, h1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, m1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, p1 = { class: "line" }, g1 = { class: "detail" }, v1 = { class: "bar" }, y1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = A(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(P, null, [
      R(jt, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          te("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", c1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(gt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (u(), f("span", d1, v(e.nothing), 1)),
        n.value ? (u(), f("span", f1, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (u(), f("span", h1, [
          o[3] || (o[3] = te("Last heard: ", -1)),
          R(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", m1, [
        m("div", p1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(gt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", g1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", v1, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, b1 = /* @__PURE__ */ z(y1, [["__scopeId", "data-v-cbe6a9f7"]]), w1 = ["onClick"], k1 = { class: "text" }, $1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, x1 = { class: "text" }, S1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, _1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(P, null, [
      R(jt, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          te("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(P, null, ae(e.moves, (a) => (u(), f(P, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => L(gt)(a.table, a.id)
        }, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", k1, v(a.text), 1),
          R(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, w1)) : (u(), f("div", $1, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", x1, v(a.text), 1),
          R(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (u(), f("p", S1, "Nothing yet."))
    ], 64));
  }
}, M1 = /* @__PURE__ */ z(_1, [["__scopeId", "data-v-58f0db57"]]), C1 = {
  class: "strip",
  "data-agent-strip": ""
}, E1 = ["data-agent-cell"], A1 = {
  key: 0,
  class: "meter"
}, O1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", C1, [
      (u(!0), f(P, null, ae(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: K({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", A1, [
          m("i", {
            class: K({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, E1))), 128))
    ]));
  }
}, T1 = /* @__PURE__ */ z(O1, [["__scopeId", "data-v-b6657ab7"]]), I1 = ["disabled", "title"], B1 = { class: "gauge usage" }, R1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => n.windows[0] ?? null), o = A(() => s.value ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = A(() => o.value !== null && o.value >= 100), i = A(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), r = A(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, d) => o.value !== null ? (u(), f("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: r.value,
      onClick: d[0] || (d[0] = (h) => a("open", h.currentTarget))
    }, [
      R(me, {
        name: "allowance",
        size: 12
      }),
      d[1] || (d[1] = te()),
      m("span", B1, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      te(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, I1)) : k("", !0);
  }
}, L1 = /* @__PURE__ */ z(R1, [["__scopeId", "data-v-1fff5e1b"]]), N1 = {
  class: "who",
  "data-agent-who": ""
}, q1 = { class: "name" }, D1 = ["data-agent-state"], P1 = { class: "identity" }, j1 = {
  class: "sub",
  "data-agent-identity": ""
}, F1 = {
  class: "sub",
  "data-agent-started-by": ""
}, W1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 }, windows: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", N1, [
      m("h2", q1, [
        m("i", {
          class: K(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, D1),
        te(v(e.name), 1)
      ]),
      m("div", P1, [
        m("p", j1, v(e.parts.join(" · ")), 1),
        R(L1, {
          windows: e.windows,
          disabled: ""
        }, null, 8, ["windows"])
      ]),
      m("p", F1, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, H1 = /* @__PURE__ */ z(W1, [["__scopeId", "data-v-1a74ce1a"]]), z1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, U1 = { class: "scroll" }, G1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, V1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, K1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Oi(), a = M(null), s = M(null), o = M(null), l = M({}), i = M({ helpers: 0, skills: 0 }), r = M(0), c = M([]), d = M("");
    let h = 0;
    const g = A(() => {
      var w;
      return a.value.ended_at ? jp(s.value) : `It has no task.${(w = s.value) != null && w.instruction ? " It was given an instruction." : ""}`;
    });
    async function y() {
      const w = ++h, I = await t.read(["agent", "show", String(t.id)]);
      if (w !== h) return;
      if (!I.ok) return void (d.value = I.error);
      const _ = String(t.id), $ = I.value.role === "worker", [B, H, D, T, G, F] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", _, "--environment", t.environment]),
        t.read(["usage", "agent", _]),
        I.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", _]),
        t.read(["agent", "list", "--parent", _, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", _, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        $ ? t.read(["worker-worktree", "points", "--agent", _]) : { ok: !1 }
      ]);
      w === h && (d.value = H.ok ? "" : H.error, a.value = I.value, s.value = Ti(B).find((q) => q.id === t.id) ?? null, o.value = H.ok ? H.value : null, l.value = D.ok ? D.value : {}, i.value = { helpers: jo(T), skills: jo(G) }, c.value = F.ok ? F.value.points : [], r.value += 1);
    }
    return wn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], y), xe(y), (w, I) => {
      var _, $;
      return u(), f("article", z1, [
        m("div", U1, [
          d.value ? (u(), f("p", G1, v(d.value), 1)) : a.value && o.value ? (u(), f(P, { key: 1 }, [
            R(H1, {
              name: L(Np)(a.value, s.value),
              state: L(qp)(a.value, s.value),
              parts: L(Dp)(a.value, s.value),
              "started-by": o.value.started_by,
              windows: ((_ = s.value) == null ? void 0 : _.windows) ?? []
            }, null, 8, ["name", "state", "parts", "started-by", "windows"]),
            R(T1, {
              cells: L(Pp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            R(b1, {
              inspection: o.value,
              tool: l.value,
              nothing: g.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            R(Yp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: (($ = s.value) == null ? void 0 : $.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            R(M1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            R(r1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: L(Fp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", V1, "Ended " + v(L(zs)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (u(), W(Ve, { key: 2 }))
        ])
      ]);
    };
  }
}, bS = /* @__PURE__ */ z(K1, [["__scopeId", "data-v-1f6cb5ee"]]), Y1 = ["aria-expanded"], Q1 = { class: "drop-label" }, X1 = ["value"], J1 = {
  key: 1,
  class: "drop-lead"
}, Z1 = { class: "drop-item-text" }, eg = {
  key: 2,
  class: "drop-note"
}, tg = {
  key: 1,
  class: "drop-none"
}, ng = {
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
    const n = e, a = t, s = M(!1), o = M(null), l = M(""), i = A(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function r(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), f("div", {
      class: K(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: K(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (u(), W(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", Q1, v(e.label), 1),
        R(me, {
          name: "down",
          size: 11
        })
      ], 10, Y1),
      s.value ? (u(), W(Is, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (h) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (u(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (h) => l.value = h.target.value)
          }, null, 40, X1)) : k("", !0),
          (u(!0), f(P, null, ae(i.value, (h) => (u(), W(Pt, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (g) => r(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: K(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (u(), f("span", J1, v(h.lead), 1)) : k("", !0),
              m("span", Z1, v(h.label), 1),
              h.note ? (u(), f("span", eg, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (u(), f("p", tg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Ri = /* @__PURE__ */ z(ng, [["__scopeId", "data-v-29dfcce5"]]);
function ag(e) {
  const t = M(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return xe(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const sg = ["data-comment-id"], og = {
  key: 0,
  class: "comment-top"
}, lg = { class: "comment-mark" }, ig = {
  class: "comment-body",
  "data-comment": ""
}, rg = { class: "comment-foot" }, ug = {
  key: 1,
  "data-comment-lost": ""
}, cg = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (u(), f("article", {
      class: K(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), f("div", og, [
        m("span", lg, v(e.comment.number), 1),
        m("span", {
          class: K(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", ig, v(e.comment.body), 1),
      m("div", rg, [
        e.comment.created_at ? (u(), W(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (u(), f("span", ug, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, sg));
  }
}, Li = /* @__PURE__ */ z(cg, [["__scopeId", "data-v-a37d4507"]]);
var Al;
/Mac|iPhone|iPad/.test(((Al = navigator.userAgentData) == null ? void 0 : Al.platform) || navigator.platform);
function Ni(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const dg = {
  class: "comment-box",
  "data-comment-box": ""
}, fg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, hg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, mg = { class: "comment-row" }, pg = ["placeholder"], gg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ qt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ qt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = M(""), i = M(!1), r = M(null), c = A(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), d = A(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      r.value.style.height = "auto", r.value.style.height = `${r.value.scrollHeight + 2}px`;
    }
    async function g() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await je(), h();
        } catch (w) {
          l.value = w.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => r.value.focus() }), (y, w) => (u(), f("div", dg, [
      e.selection ? (u(), f("div", fg, [
        w[3] || (w[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: K(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        R(fa, {
          title: "Comment on the whole document instead",
          onClick: w[0] || (w[0] = (I) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (u(), f("p", hg, v(l.value), 1)) : k("", !0),
      m("div", mg, [
        Je(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": w[1] || (w[1] = (I) => o.value = I),
          rows: "1",
          maxlength: "2000",
          class: K({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: w[2] || (w[2] = xt((I) => L(Ni)(I, g), ["enter"]))
        }, null, 42, pg), [
          [Kn, o.value]
        ]),
        R(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: g
        }, {
          default: j(() => [...w[4] || (w[4] = [
            te("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, vg = /* @__PURE__ */ z(gg, [["__scopeId", "data-v-41d2081c"]]), Bn = (e) => e ? e.split(", ") : [];
function yg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function bg(e, t) {
  return {
    reads: Bn(e.reads_allowed),
    runs: Bn(e.runs_allowed),
    missing: [...Bn(e.reads_missing), ...Bn(e.runs_missing)],
    ask: t
  };
}
const wg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Qr("SkeletonParts", !0);
      return u(!0), f(P, null, ae(e.parts, (r, c) => (u(), f(P, { key: c }, [
        (u(!0), f(P, null, ae(r.count, (d) => (u(), W(zt, {
          key: d,
          value: r.shape
        }, {
          line: j(() => [
            R(Jt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            R(Jt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            R(Jt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(r))
            }, [
              R(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(r))
            }, [
              R(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(r))
            }, [
              R(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(r))
            }, [
              R(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), kg = /* @__PURE__ */ z(wg, [["__scopeId", "data-v-fa8baeaf"]]), $g = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, xg = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", $g, [
      R(kg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Us = /* @__PURE__ */ z(xg, [["__scopeId", "data-v-52f66b64"]]), qi = {
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
}, Sg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: K(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Di = /* @__PURE__ */ z(Sg, [["__scopeId", "data-v-9e7e1157"]]), _g = { class: "bars" }, Mg = { class: "bar-name" }, Cg = { class: "bar-value" }, Eg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = A(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", _g, [
      (u(!0), f(P, null, ae(e.items, (r, c) => (u(), W(it(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: K(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", Mg, v(r.label), 1),
          R(mi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Cg, v(r.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ag = /* @__PURE__ */ z(Eg, [["__scopeId", "data-v-663427f4"]]), Og = { class: "bars" }, Tg = {
  key: 0,
  class: "bars-title"
}, Ig = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Og, [
      e.node.title ? (u(), f("span", Tg, v(e.node.title), 1)) : k("", !0),
      R(Ag, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Bg = /* @__PURE__ */ z(Ig, [["__scopeId", "data-v-7135bb11"]]), Rg = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = A(() => n[a.node.type](a.node));
    return (l, i) => (u(), f("div", {
      class: K([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (u(!0), f(P, null, ae(e.node.children || [], (r, c) => (u(), W(Pi, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Fn = /* @__PURE__ */ z(Rg, [["__scopeId", "data-v-d142a3f4"]]), Lg = {
  key: 0,
  class: "card-head"
}, Ng = { class: "card-title" }, qg = {
  key: 0,
  class: "card-note"
}, Dg = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: K(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Lg, [
        m("span", Ng, v(e.node.title), 1),
        e.node.note ? (u(), f("span", qg, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      R(Fn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Pg = /* @__PURE__ */ z(Dg, [["__scopeId", "data-v-67b72d40"]]), jg = { class: "fact" }, Fg = { class: "fact-label" }, Wg = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", jg, [
      m("span", Fg, v(e.label), 1),
      R(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Hg = /* @__PURE__ */ z(Wg, [["__scopeId", "data-v-3a88ecf8"]]), zg = { class: "list" }, Ug = { class: "list-label" }, Gg = {
  key: 1,
  class: "list-note"
}, Vg = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", zg, [
      (u(!0), f(P, null, ae(e.items, (o, l) => (u(), W(it(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: K(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", Ug, v(o.label), 1),
          o.badge ? (u(), W(Di, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (u(), f("span", Gg, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Kg = /* @__PURE__ */ z(Vg, [["__scopeId", "data-v-ebe2ae0a"]]), Yg = { class: "table" }, Qg = {
  key: 0,
  class: "table-row empty"
}, Xg = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", Yg, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (u(!0), f(P, null, ae(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (u(!0), f(P, null, ae(e.rows, (i, r) => (u(), W(it(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: K(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(P, null, ae(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", Qg, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, Jg = /* @__PURE__ */ z(Xg, [["__scopeId", "data-v-9326a52e"]]), Zg = { class: "stat-value" }, ev = { class: "stat-label" }, tv = {
  key: 0,
  class: "stat-note"
}, nv = {
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
    return (a, s) => (u(), W(it(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: K(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", Zg, v(e.value), 1),
        m("span", ev, v(e.label), 1),
        e.note ? (u(), f("span", tv, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, av = /* @__PURE__ */ z(nv, [["__scopeId", "data-v-ad0db6d6"]]), sv = { class: "code" }, ov = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), W(zt, {
      value: e.node.type
    }, {
      stack: j(() => [
        R(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        R(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        R(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        R(Pg, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        m("h3", {
          class: K(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        R(av, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        R(Bg, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        R(Jg, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        R(Kg, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        R(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        R(Hg, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        R(Di, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", sv, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Pi = /* @__PURE__ */ z(ov, [["__scopeId", "data-v-cbdcf540"]]), lv = { class: "dashboard" }, iv = { class: "trail" }, rv = ["onClick"], uv = {
  key: 0,
  class: "gone",
  role: "status"
}, cv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (g) => g in (n.document.pages || {}), o = M(!!n.page && !s(n.page)), l = M(n.page && !o.value ? [n.page] : []), i = A(() => l.value.at(-1) || n.document.start), r = A(() => (n.document.pages || {})[i.value] || null), c = (g) => ((n.document.pages || {})[g] || {}).title || g, d = (g) => {
      o.value = !1, l.value = [...l.value, g];
    }, h = (g) => {
      o.value = !1, l.value = l.value.slice(0, g);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (g, y) => (u(), f("div", lv, [
      e.document.broken ? (u(), W(on, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          te(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), W(on, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          te(v(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(P, { key: 2 }, [
        m("nav", iv, [
          m("button", {
            type: "button",
            class: K(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (w) => h(0))
          }, v(c(e.document.start)), 3),
          (u(!0), f(P, null, ae(l.value, (w, I) => (u(), f(P, {
            key: `${I}-${w}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: K(["step", { current: I === l.value.length - 1 }]),
              onClick: (_) => h(I + 1)
            }, v(c(w)), 11, rv)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", uv, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        R(Ht, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              R(Pi, {
                node: r.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (w) => a("file", w))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, dv = /* @__PURE__ */ z(cv, [["__scopeId", "data-v-fbe83734"]]);
function fv(e, t) {
  const n = Ke(), a = Os(e, qi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  xe(e), et(() => {
    s(), a.cancel();
  });
}
const hv = {
  key: 0,
  class: "window-failure"
}, mv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ke(), o = M(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? fv(l, n.events) : Es(l, () => !0, qi.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", hv, v(o.value.error), 1)) : o.value ? (u(), W(dv, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, pv = 1e4;
class gv {
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
    return this.heardAt !== null && t - this.heardAt > pv;
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
const vv = {
  key: 0,
  class: "frame-note"
}, yv = {
  key: 0,
  class: "frame-note"
}, bv = ["src", "title"], wv = 1e3, kv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ke(), a = M(null), s = M(!1), o = M(!1);
    let l = null, i = 0;
    return xe(() => {
      l = new gv(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, wv);
    }), Ie(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", vv, "This window was closed because it stopped answering.")) : (u(), f(P, { key: 1 }, [
      s.value ? (u(), f("div", yv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        R(pe, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            te("Close the window", -1)
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
        title: L(n).window
      }, null, 8, bv)
    ], 64));
  }
}, $v = /* @__PURE__ */ z(kv, [["__scopeId", "data-v-32a49046"]]), xv = {
  class: "allowance-prompt",
  role: "dialog"
}, Sv = { class: "allowance-prompt-text" }, _v = { class: "allowance-prompt-buttons" }, Mv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", xv, [
      m("p", Sv, v(L(yg)(e.request)), 1),
      m("div", _v, [
        R(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        R(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            te("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Cv = /* @__PURE__ */ z(Mv, [["__scopeId", "data-v-cad69fe2"]]), Ta = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(on, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        te(v(e.reason) + " ", 1),
        e.retry ? (u(), W(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (u(), W(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            te("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ev = ["data-window", "data-agent"], Av = {
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
    const i = Me(wc, null), r = bd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: A(() => n.options),
      declared: n.declared,
      page: Me(md, null),
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
    Ol(qe, r), he(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), xe(r.settle), Ie(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Xr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ra(n.component), d = () => {
      var h, g;
      return ((g = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, g) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), W(Cv, {
        key: 0,
        request: d(),
        onAnswer: g[0] || (g[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (u(), W(Ta, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), W(Ta, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(P, { key: 4 }, [
        (u(), W(c, { key: o.value })),
        e.skeleton.length && !L(r).answered.value ? (u(), W(Us, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (u(), W(Ta, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Ev));
  }
}, Zt = /* @__PURE__ */ z(Av, [["__scopeId", "data-v-c4443e2b"]]), ji = {
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
    const n = e, a = t, s = { render: () => ra($v, { src: n.entry.entry_url }) };
    return (o, l) => (u(), W(Zt, {
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
      onOption: l[0] || (l[0] = (i, r) => a("option", i, r))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, Ov = ["data-window"], Fi = {
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
    const n = e, a = t, s = Xe(null), o = M("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Pu();
          } catch (i) {
            if (qu(i) && Du(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      R(Us, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Ov)) : (u(), W(Zt, {
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
      onOption: i[0] || (i[0] = (r, c) => a("option", r, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Tv = {
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
    const n = t, a = e, s = A(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = A(() => s.value && { render: () => ra(mv, { line: s.value.line, events: s.value.events }) }), l = M(null), i = A(() => {
      var g, y;
      return ((g = s.value) == null ? void 0 : g.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = A(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = A(
      () => {
        var g, y;
        return l.value ? bg(l.value, h) : { reads: ((g = s.value) == null ? void 0 : g.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const g = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = g.ok ? g.value : null;
    }
    async function h() {
      const g = await a.prompts.ask(s.value.title, l.value);
      return await d(), g;
    }
    return he(
      () => {
        var g, y;
        return ((g = s.value) == null ? void 0 : g.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await d(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (g, y) => {
      var w, I;
      return !s.value && ((w = e.catalogue.loaded) == null ? void 0 : w.value) === !1 ? (u(), W(Us, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((I = s.value) == null ? void 0 : I.shows) === "one-agent" && e.agent === null ? (u(), W(on, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), W(Zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), W(Fi, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (_, $) => n("option", _, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), W(ji, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (_, $) => n("option", _, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), W(Zt, {
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
        onOption: y[2] || (y[2] = (_, $) => n("option", _, $))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), W(Zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (_) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Iv = ["data-section"], Bv = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Rv = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Ls, null), a = A(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = A(() => ({ row: t.row }));
    return (o, l) => L(n) ? (u(!0), f(P, { key: 0 }, ae(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), W(Tv, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", Bv, v(i.name) + " is not available", 1))
    ], 8, Iv))), 128)) : k("", !0);
  }
}, hs = /* @__PURE__ */ z(Rv, [["__scopeId", "data-v-a47d36b7"]]), Lv = { class: "rail-head" }, Nv = { key: 0 }, qv = {
  key: 1,
  class: "rail-none"
}, Dv = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: K(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Lv, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", Nv, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (u(!0), f(P, { key: 0 }, ae(e.comments, (a) => (u(), W(Li, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", qv, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Pv = /* @__PURE__ */ z(Dv, [["__scopeId", "data-v-4d684649"]]), jv = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Fv = ["aria-pressed"], Wv = ["aria-pressed"], Hv = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, zv = {
  key: 0,
  role: "alert"
}, Uv = {
  key: 1,
  class: "sidebar-none"
}, Gv = ["data-question-id"], Vv = { class: "question-state" }, Kv = ["data-question-show", "onClick"], Yv = {
  key: 0,
  class: "sidebar-none"
}, Qv = {
  key: 1,
  class: "question-answer"
}, Xv = {
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
    const t = Me(Ls, null);
    return (n, a) => (u(), f("div", {
      class: K(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", jv, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Fv),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Wv)
      ]),
      e.mode === "comments" ? (u(), f(P, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), W(Pv, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        R(gn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", Hv, [
        e.failure ? (u(), f("p", zv, v(e.failure), 1)) : e.questions.length ? k("", !0) : (u(), f("p", Uv, "No questions about this text yet.")),
        (u(!0), f(P, null, ae(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: K(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Vv, v(L(ln)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Kv),
            s.quote ? (u(), f(P, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Yv, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (u(), f("p", Qv, "Answered: " + v(s.answer), 1)) : k("", !0),
            R(hs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            R(Ds, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Gv);
        }), 128))
      ]))
    ], 2));
  }
}, Fo = /* @__PURE__ */ z(Xv, [["__scopeId", "data-v-2718a08d"]]), Jv = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Zv = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Wt({ abstract: n.row.abstract, body: n.row.body }), o = M("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), W(ha, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", Jv, v(o.value), 1),
        R(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: j(() => [...r[6] || (r[6] = [
            te("Cancel", -1)
          ])]),
          _: 1
        }),
        R(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...r[7] || (r[7] = [
            te("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: j(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: $e(l, ["prevent"])
        }, [
          m("label", null, [
            r[4] || (r[4] = m("span", null, "Abstract", -1)),
            Je(m("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Kn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
              "onUpdate:modelValue": r[1] || (r[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Kn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, ey = /* @__PURE__ */ z(Zv, [["__scopeId", "data-v-e99f14e0"]]);
function Wi(e, t) {
  const n = M([]), a = M(!1), s = M(null), o = M(0), l = M(!1), i = M("");
  let r = 0, c = 0;
  const d = (w) => {
    if (typeof w.body == "string") return w.body;
    const { noun: I, id: _, title: $ } = e(), B = `On ${I} ${_}, ${$}: `;
    return w.text.startsWith(B) ? w.text.slice(B.length) : w.text;
  };
  async function h(w = 1) {
    const { noun: I, id: _ } = e();
    if (!_) return;
    const $ = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([I, "comments", String(_), "--page", String(w), "--page-size", "25"]);
      if ($ !== c) return;
      if (!B.ok) {
        i.value = B.error;
        return;
      }
      const H = B.value.rows ?? [], D = w === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(D.map((T) => [T.id, T])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      $ === c && (i.value = B.message);
    } finally {
      $ === c && (l.value = !1);
    }
  }
  async function g(w) {
    var T;
    const { noun: I, id: _ } = e(), $ = `${I}:${_}`, B = { id: `sending-${++r}`, text: w };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const H = await t([I, "comment", String(_), w]);
    if ($ !== `${e().noun}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((G) => G.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await h();
    const D = (T = H.value) == null ? void 0 : T.id;
    D && !n.value.some((G) => G.id === D) && (n.value = [...n.value, { ...B, id: D }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return he(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: g, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function ty(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let r = n.length - 1; r >= 0; r -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[r][c] = n[r] === a[c] ? s[r + 1][c + 1] + 1 : Math.max(s[r + 1][c], s[r][c + 1]);
  const o = [];
  let l = 0, i = 0;
  for (; l < n.length || i < a.length; )
    l < n.length && i < a.length && n[l] === a[i] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, i += 1) : i < a.length && (l === n.length || s[l][i + 1] >= s[l + 1][i]) ? (o.push({ key: `new:${i}`, type: "added", text: a[i] }), i += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const ny = {
  class: "document-tab",
  "data-document-revisions": ""
}, ay = ["datetime"], sy = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, oy = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, ly = {
  key: 2,
  class: "document-none"
}, iy = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), o = M(""), l = A(() => s.value ? ty(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", ny, [
      e.editing ? (u(), W(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: j(() => [...d[1] || (d[1] = [
          te("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (u(), f(P, { key: 1 }, [
        (u(!0), f(P, null, ae(e.revisions, (h) => (u(), W(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (g) => i(h)
        }, {
          default: j(() => [
            te("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, ay)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", sy, v(o.value), 1)) : k("", !0),
        s.value ? (u(), f(P, { key: 1 }, [
          R(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: j(() => [...d[2] || (d[2] = [
              te("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", oy, [
            (u(!0), f(P, null, ae(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: K(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (u(), f("p", ly, "No revisions"))
    ]));
  }
}, ry = /* @__PURE__ */ z(iy, [["__scopeId", "data-v-3a381aa4"]]), uy = "button, [data-comment-number]", cy = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Hi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(uy) || n.push(t.currentNode);
  return n;
}
function Wo(e, t, n) {
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
const dy = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function fy(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Hi(e), s = a.map((c) => c.data).join(""), o = Wo(a, n.startContainer, n.startOffset), l = s.slice(o, Wo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: dy(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function hy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function my(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Ia(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function py({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function gy(e, t) {
  const n = Hi(e), a = hy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = my(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(py).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ia(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ia(t.number, t.id, t.label)) : l.at(-1).append(Ia(t.number, t.id, t.label))), !0;
}
function vy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !gy(e, a) && a.id && n.push(a.id);
  return n;
}
const yy = (e) => e.closest(cy) ?? e;
function Ho(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const by = {
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
    const a = e, s = n, o = M(null), l = M(null), i = M(null), r = M(!1), c = M(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const I = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), _ = vy(l.value, a.pending ? [...I, { ...a.pending, pending: !0 }] : I);
      s("lost", _);
      const $ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!$) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", yy($).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const I = fy(l.value);
      if (r.value = !!I, !I) {
        i.value = null;
        return;
      }
      const _ = window.getSelection().getRangeAt(0).getBoundingClientRect(), $ = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(_.left - $.left, 0)}px`, top: `${_.top - $.top + o.value.scrollTop}px` }, s("select", I);
    }
    function g(I) {
      const _ = I.target.closest("[data-comment-number]");
      _ ? s("number", Number(_.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(I) {
      var _;
      (_ = l.value.querySelector(`[data-comment="${I}"]`)) == null || _.scrollIntoView({ block: "center" });
    }
    function w(I) {
      var _;
      (_ = l.value.querySelectorAll("h3, h4, h5, h6")[I]) == null || _.scrollIntoView({ block: "start" });
    }
    return he(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), xe(() => {
      d(), document.addEventListener("selectionchange", h);
    }), et(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: w, nextTick: je }), (I, _) => (u(), f("div", {
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
      i.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ve(i.value),
        "data-comment-pill": "",
        onMousedown: _[0] || (_[0] = $e(() => {
        }, ["prevent"])),
        onClick: _[1] || (_[1] = ($) => s("write"))
      }, [
        R(me, {
          name: "chat",
          size: 13
        }),
        _[2] || (_[2] = te("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (u(), W(ca, {
        key: 1,
        to: c.value
      }, [
        de(I.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      de(I.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, wy = /* @__PURE__ */ z(by, [["__scopeId", "data-v-548d0aaa"]]), ky = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, $y = { class: "document-tabs" }, xy = { class: "document-body" }, Sy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, _y = {
  key: 1,
  class: "document-loading"
}, My = {
  class: "document-details",
  "data-resource-fields": ""
}, Cy = 760, Ey = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = M(null), a = ag(n), s = A(() => a.value !== null && a.value < Cy), o = M(null), l = M(""), i = M([]), r = M([]), c = M(""), d = M("comments"), h = M("text"), g = M(0), y = M(0), w = M([]), I = M(null), _ = M(""), $ = M(!1), B = M(null), H = M(null);
    let D = 0;
    const T = Wi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (oe) => t.read(oe)), G = A(() => Ho(T.comments.value)), F = A(() => d.value === "questions" ? Ho(r.value) : G.value), q = A(() => d.value === "questions" ? F.value.length : T.total.value), S = A(() => {
      var oe;
      return (oe = o.value) != null && oe.body ? Fs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), C = A(() => {
      var oe;
      return (((oe = o.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, ee) => ({ key: String(ee), value: ee, label: Z.replace(/^#+ /, "") }));
    }), b = A(() => G.value.find((oe) => oe.id === y.value)), p = A(() => {
      var oe;
      return (oe = o.value) != null && oe.close_reason ? "Closed" : "Open";
    }), x = A(() => h.value === "comments" && !s.value ? "text" : h.value), E = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function O() {
      const oe = ++D, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (oe !== D) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const ee = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), De = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === D && (r.value = E(ee), c.value = ee.ok ? "" : ee.error, i.value = De ? E(De) : []);
    }
    async function N(oe) {
      const Z = I.value ? ["--quote", I.value.quote, "--position", String(I.value.position), "--selection-type", I.value.selection_type] : [], ee = await t.read([t.noun, "comment", String(t.id), ...Z, "--", oe]);
      if (!ee.ok) throw new Error(ee.error);
      I.value = null, await Promise.all([O(), T.load()]);
    }
    async function J() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      l.value = oe.ok ? "" : oe.error, oe.ok && await O();
    }
    function ne() {
      _.value.trim() || (I.value = null);
    }
    function le(oe) {
      var Z;
      if (g.value = oe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === oe ? 0 : oe : (Z = n.value.querySelector(d.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function ge(oe) {
      var Z, ee;
      h.value = "text", g.value = oe, await ((Z = B.value) == null ? void 0 : Z.nextTick()), (ee = B.value) == null || ee.show(oe);
    }
    function Ae() {
      $.value = !1, O();
    }
    return he(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", g.value = 0, y.value = 0, I.value = null, r.value = [], c.value = "", O();
    }, { immediate: !0 }), he(d, () => {
      g.value = 0, y.value = 0;
    }), (oe, Z) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", ky, [
        R(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (ee) => $.value = !0)
        }, {
          default: j(() => [...Z[14] || (Z[14] = [
            te("Edit", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("nav", $y, [
        m("button", {
          type: "button",
          class: K(["document-tab-button", { on: x.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (ee) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: K(["document-tab-button", { on: x.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (ee) => h.value = "comments")
        }, [
          te(v(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : k("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: K(["document-tab-button", { on: x.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (ee) => h.value = "revisions")
        }, [
          Z[15] || (Z[15] = te("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : k("", !0),
        Z[16] || (Z[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        x.value === "text" && C.value.length > 1 ? (u(), W(Ri, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: C.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (ee) => {
            var De;
            return (De = B.value) == null ? void 0 : De.showHeading(ee.value);
          })
        }, null, 8, ["label", "items"])) : k("", !0)
      ]),
      m("div", xy, [
        l.value ? (u(), f("p", Sy, v(l.value), 1)) : o.value ? x.value === "revisions" ? (u(), W(ry, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: J,
          onRestored: O
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : x.value === "comments" ? (u(), W(Fo, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": Z[5] || (Z[5] = (ee) => d.value = ee),
          tab: "",
          comments: G.value,
          questions: r.value,
          hot: g.value,
          lost: w.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(T).nextPage.value,
          "comment-loading": L(T).loading.value,
          "comment-failure": L(T).failure.value,
          "comment-total": L(T).total.value,
          onMore: L(T).loadMore,
          onShow: ge,
          onChanged: O
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(P, { key: 4 }, [
          R(wy, {
            ref_key: "words",
            ref: B,
            html: S.value,
            comments: F.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: g.value,
            pending: I.value,
            inline: y.value,
            onSelect: Z[7] || (Z[7] = (ee) => I.value = ee),
            onClear: ne,
            onNumber: le,
            onWrite: Z[8] || (Z[8] = (ee) => {
              var De;
              return (De = H.value) == null ? void 0 : De.focus();
            }),
            onLost: Z[9] || (Z[9] = (ee) => w.value = ee)
          }, {
            inline: j(() => [
              b.value ? (u(), W(Li, {
                key: 0,
                comment: b.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (ee) => ge(b.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: j(() => [
              m("dl", My, [
                Z[18] || (Z[18] = m("h4", null, "Details", -1)),
                Z[19] || (Z[19] = m("dt", null, "State", -1)),
                m("dd", null, v(p.value), 1),
                o.value.close_reason ? (u(), f(P, { key: 0 }, [
                  Z[17] || (Z[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : k("", !0),
                Z[20] || (Z[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  R(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  R(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? k("", !0) : (u(), W(Fo, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": Z[10] || (Z[10] = (ee) => d.value = ee),
            comments: G.value,
            questions: r.value,
            hot: g.value,
            lost: w.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(T).nextPage.value,
            "comment-loading": L(T).loading.value,
            "comment-failure": L(T).failure.value,
            "comment-total": L(T).total.value,
            onMore: L(T).loadMore,
            onShow: ge,
            onChanged: O
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", _y, [
          R(Ve)
        ]))
      ]),
      o.value ? (u(), W(vg, {
        key: 1,
        ref_key: "composer",
        ref: H,
        draft: _.value,
        "onUpdate:draft": Z[11] || (Z[11] = (ee) => _.value = ee),
        selection: I.value,
        send: N,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (ee) => I.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      $.value ? (u(), W(ey, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (ee) => $.value = !1),
        onSaved: Ae
      }, null, 8, ["noun", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, wS = /* @__PURE__ */ z(Ey, [["__scopeId", "data-v-784faf41"]]), Ay = {
  key: 1,
  class: "row-list-failure"
}, Oy = ["data-row"], Ty = {
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
    const t = e, n = A(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = M(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), W(Ve, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", Ay, v(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), W(on, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        te(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(P, { key: 3 }, [
      (u(), W(it(e.arrival ? Ms : "ul"), Pe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(P, null, ae(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            de(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Oy))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : k("", !0)
    ], 64));
  }
}, Iy = /* @__PURE__ */ z(Ty, [["__scopeId", "data-v-6c7ba696"]]), By = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ry = {
  key: 1,
  class: "agent-rows-note"
}, Ly = {
  key: 2,
  class: "agent-rows-note"
}, Ny = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, qy = ["data-agent-row", "onClick"], Dy = { class: "agent-row-name" }, Py = { class: "agent-row-state" }, jy = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = A(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", By, [
      e.loaded ? e.failure ? (u(), f("p", Ry, v(e.failure), 1)) : e.rows.length ? (u(), f(P, { key: 3 }, [
        m("p", Ny, v(a.value) + " running", 1),
        (u(!0), f(P, null, ae(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(Ne)(`agents:${l.id}`)
        }, [
          m("span", Dy, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", Py, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, qy))), 128))
      ], 64)) : (u(), f("p", Ly, v(e.none), 1)) : (u(), W(Ve, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, kS = /* @__PURE__ */ z(jy, [["__scopeId", "data-v-a01e5a17"]]), ct = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, ze = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Fy = 6;
function Gs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Wy = (e) => {
  const t = Gs(e, ct.lineChars), n = Math.max(ct.minWidth, Math.max(...t.map((a) => a.length)) * ct.charWidth + ct.padX * 2);
  return { name: e, lines: t, line: ct.line, padY: ct.padY, width: n, height: t.length * ct.line + ct.padY * 2 };
};
function Hy(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function zy(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Uy(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, r) => [i, r]))), o = (l, i) => {
    const r = s(), c = (d) => {
      const h = i(d).map((g) => r.get(g));
      return h.length ? h.reduce((g, y) => g + y, 0) / h.length : r.get(d);
    };
    return [...l].sort((d, h) => c(d) - c(h));
  };
  for (let l = 0; l < Fy; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((g) => g[i ? 1 : 0] === h).map((g) => g[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Gy(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, i) => {
    const r = `${s[o]}:${l}`;
    (n.get(r) || n.set(r, []).get(r)).push({ arrow: s, end: o, other: i });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, i) => o[`${l}Share`] = (i + 1) / (s.length + 1));
}
function Vy(e) {
  const t = [...new Set(e.flatMap(([D, T]) => [D, T]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = Hy(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, T) => !s.has(T)), l = zy(t, o), i = Uy(t, o, l), r = new Map(t.map((D) => [D, Wy(D)])), c = i.map((D) => D.reduce((T, G) => T + r.get(G).width, 0) + He.across * (D.length - 1)), d = Math.max(...c) + He.margin * 2, h = Yy(e, l, i.length), g = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((D, T) => {
    let G = (d - c[T]) / 2;
    const F = Math.max(...D.map((q) => r.get(q).height));
    D.forEach((q) => {
      const S = r.get(q);
      g.set(q, { ...S, x: G, y: y + (F - S.height) / 2 }), G += S.width + He.across;
    }), y += F + (h[T] ?? He.down);
  });
  const w = e.map(([D, T, G], F) => ({ from: D, to: T, label: G || "", back: s.has(F) || l.get(T) <= l.get(D) }));
  Gy(w, g);
  const I = w.map((D) => Qy(D, g.get(D.from), g.get(D.to))), _ = [...g.values()], $ = e0(I, _), B = Math.max(y - He.down, ...$.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(d - He.margin, ...$.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + He.margin, height: B + He.margin, nodes: _, arrows: $ };
}
const Ky = (e) => e ? Gs(e, ze.lineChars).length * ze.line + ze.pad * 2 : 0;
function Yy(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += Ky(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function Qy(e, t, n) {
  const a = e.label ? Gs(e.label, ze.lineChars) : [], s = a.length ? Math.max(...a.map((g) => g.length)) * ze.charWidth + ze.pad * 2 : 0, o = a.length * ze.line + (a.length ? ze.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const Xy = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Jy = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Zy = [0, -1, 1, -2, 2, -3, 3].map((e) => e * ze.line);
function e0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = Xy(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Zy.flatMap((r) => Jy.map((c) => s(c, r))).find((r) => !n.some((c) => zo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => zo(i, r)); ) i.y += ze.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: ze.line, pad: ze.pad } };
  });
}
const zo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, t0 = { class: "flowchart-tools" }, n0 = ["width", "height", "viewBox", "aria-label"], a0 = ["d"], s0 = ["x", "y", "width", "height"], o0 = ["x", "y"], l0 = ["x", "dy"], i0 = {
  key: 0,
  class: "flowchart-label"
}, r0 = ["x", "y", "width", "height"], u0 = ["x", "y"], c0 = ["x", "dy"], d0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => Vy(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = M(null), i = M({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var $;
      const I = ($ = l.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(I != null && I.width)) return;
      const _ = Math.min(I.width / s.value.width, I.height / s.value.height, 1.5);
      i.value = { zoom: _, x: (I.width - s.value.width * _) / 2, y: (I.height - s.value.height * _) / 2 };
    }
    function d(I, _, $) {
      const { zoom: B, x: H, y: D } = i.value, T = Math.min(o.most, Math.max(o.least, B * I));
      i.value = { zoom: T, x: _ - (_ - H) * T / B, y: $ - ($ - D) * T / B };
    }
    function h(I) {
      const _ = l.value.getBoundingClientRect();
      d(I, _.width / 2, _.height / 2);
    }
    function g(I) {
      const _ = l.value.getBoundingClientRect();
      I.ctrlKey || I.metaKey ? d(I.deltaY < 0 ? o.step : 1 / o.step, I.clientX - _.left, I.clientY - _.top) : i.value = { ...i.value, x: i.value.x - I.deltaX, y: i.value.y - I.deltaY };
    }
    function y(I) {
      var _, $, B;
      I.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), r = { x: I.clientX - i.value.x, y: I.clientY - i.value.y }, (B = ($ = l.value).setPointerCapture) == null || B.call($, I.pointerId);
    }
    function w(I) {
      r && (i.value = { ...i.value, x: I.clientX - r.x, y: I.clientY - r.y });
    }
    return xe(c), (I, _) => (u(), W(ha, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = ($) => a("close"))
    }, {
      default: j(() => [
        m("div", t0, [
          R(pe, {
            small: "",
            onClick: _[0] || (_[0] = ($) => h(o.step))
          }, {
            default: j(() => [..._[5] || (_[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          R(pe, {
            small: "",
            onClick: _[1] || (_[1] = ($) => h(1 / o.step))
          }, {
            default: j(() => [..._[6] || (_[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          R(pe, {
            small: "",
            onClick: c
          }, {
            default: j(() => [..._[7] || (_[7] = [
              te("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(g, ["prevent"]),
          onPointerdown: y,
          onPointermove: w,
          onPointerup: _[2] || (_[2] = ($) => co(r) ? r.value = null : r = null),
          onPointercancel: _[3] || (_[3] = ($) => co(r) ? r.value = null : r = null)
        }, [
          (u(), f("svg", {
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
            (u(!0), f(P, null, ae(s.value.arrows, ($, B) => (u(), f("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, a0))), 128)),
            (u(!0), f(P, null, ae(s.value.nodes, ($) => (u(), f("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, s0),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (u(!0), f(P, null, ae($.lines, (B, H) => (u(), f("tspan", {
                  key: H,
                  x: $.x + $.width / 2,
                  dy: H ? $.line : 0
                }, v(B), 9, l0))), 128))
              ], 8, o0)
            ]))), 128)),
            (u(!0), f(P, null, ae(s.value.arrows, ($, B) => (u(), f(P, {
              key: `label-${B}`
            }, [
              $.label ? (u(), f("g", i0, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, r0),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (u(!0), f(P, null, ae($.label.lines, (H, D) => (u(), f("tspan", {
                    key: D,
                    x: $.label.x + $.label.width / 2,
                    dy: D ? $.label.line : 0
                  }, v(H), 9, c0))), 128))
                ], 8, u0)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, n0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, f0 = /* @__PURE__ */ z(d0, [["__scopeId", "data-v-51d24cfe"]]), h0 = ["innerHTML"], m0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => bo[t.name] || bo.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, h0));
  }
}, _t = /* @__PURE__ */ z(m0, [["__scopeId", "data-v-beb5935c"]]), p0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: K(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      R(_t, { name: "fold" })
    ], 2));
  }
}, Gt = /* @__PURE__ */ z(p0, [["__scopeId", "data-v-d03899bb"]]), g0 = ["data-tip", "aria-label"], v0 = {
  key: 0,
  class: "mact-word"
}, y0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: K(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      R(_t, { name: "open" }),
      e.open ? (u(), f("span", v0, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, g0));
  }
}, zi = /* @__PURE__ */ z(y0, [["__scopeId", "data-v-3b292e09"]]), Ui = 120, Wn = 280, Gi = 160, b0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, w0 = ["leaving", "resizing", "entering"];
function ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function k0(e) {
  const t = w0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ms(e);
  return e.classList.add(...t), n;
}
function Vi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = M(t()), s = M("");
  let o = 0;
  const l = (h, g) => Object.assign(h.style, { width: `${g.width}px`, height: `${g.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, g) {
    i(h);
    const y = k0(h);
    l(h, g), h.offsetWidth, h.style.transition = `width ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const g = h.querySelector(":scope > :not(.top)");
    if (!g || typeof ResizeObserver > "u") return null;
    let y = g.offsetHeight;
    const w = new ResizeObserver(() => {
      g.offsetHeight !== y && (y = g.offsetHeight, r(h, ms(h)));
    });
    return w.observe(g), w;
  }
  async function d(h) {
    const g = e.value, y = ++o;
    if (!g || !g.offsetWidth || b0()) {
      a.value = h;
      return;
    }
    const w = ms(g);
    if (l(g, w), s.value = "leaving", await n(Ui), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(g, w);
    const I = c(g);
    await n(Wn), I == null || I.disconnect(), y === o && (i(g), s.value = "entering", await n(Gi), y === o && (s.value = ""));
  }
  return he(t, (h) => d(h)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const $0 = { class: "growing-card-top" }, x0 = ["aria-expanded"], S0 = { class: "growing-card-avatar" }, _0 = { class: "growing-card-title" }, M0 = { class: "growing-card-more" }, C0 = { class: "growing-card-body" }, E0 = {
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
    const n = e, a = t, s = M(!1), o = M(null), { folded: l, phase: i } = Vi(o, () => !s.value), r = A(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = A(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: K(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", $0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (g) => s.value = !s.value)
        }, [
          m("span", S0, [
            e.bad ? (u(), W(_t, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(P, { key: 1 }, [
              te(v(r.value), 1)
            ], 64)) : (u(), W(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", _0, v(e.title), 1),
          R(Gt, { open: s.value }, null, 8, ["open"])
        ], 8, x0),
        e.action ? (u(), W(zi, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (g) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (g) => a("comment"))
        }, [
          R(me, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", M0, [
        m("div", C0, [
          (u(!0), f(P, null, ae(c.value, (g, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, v(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, A0 = /* @__PURE__ */ z(E0, [["__scopeId", "data-v-f2b4930d"]]), O0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, T0 = { class: "md inline" }, I0 = ["disabled", "title", "onClick"], B0 = {
  key: 1,
  class: "message-links-many"
}, R0 = ["aria-expanded"], L0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, N0 = ["disabled", "onClick"], q0 = { class: "row-pill message-links-chip" }, D0 = { class: "message-links-title" }, P0 = { key: 0 }, Ba = 3, j0 = "task", F0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => n.total || n.links.length), o = A(() => n.links.every((g) => g.endpoint.model === j0) ? "tasks" : "items"), l = M(!1), i = M(null);
    Ul(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (g) => g.endpoint.unavailable || !g.endpoint.open_ref, d = (g) => g.relations.includes("edited") ? g.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(g) {
      c(g) || (l.value = !1, Ne(g.endpoint.open_ref));
    }
    return (g, y) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: K(["message-links", { many: s.value > Ba, three: s.value === Ba, open: l.value }]),
      "data-message-links": ""
    }, [
      R(_t, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", O0, [
        m("span", T0, [
          y[1] || (y[1] = te("Linked: ", -1)),
          (u(!0), f(P, null, ae(e.links, (w) => (u(), f("button", {
            key: `${w.endpoint.model}:${w.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(w),
            title: w.endpoint.title,
            onClick: (I) => h(w)
          }, [
            te(v(w.endpoint.model.replaceAll("_", " ")) + " " + v(w.endpoint.id), 1),
            d(w) ? (u(), f(P, { key: 0 }, [
              te(" (" + v(d(w)) + ")", 1)
            ], 64)) : k("", !0),
            c(w) ? (u(), f(P, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, I0))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ba ? (u(), f("span", B0, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          te(v(s.value) + " linked " + v(o.value) + " ", 1),
          R(Gt, { open: l.value }, null, 8, ["open"])
        ], 8, R0)
      ])) : k("", !0),
      l.value ? (u(), f("div", L0, [
        (u(!0), f(P, null, ae(e.links, (w) => (u(), f("button", {
          key: `${w.endpoint.model}:${w.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(w),
          onClick: (I) => h(w)
        }, [
          m("span", q0, v(w.endpoint.model.replaceAll("_", " ")) + " " + v(w.endpoint.id), 1),
          m("span", D0, v(w.endpoint.title), 1),
          m("span", null, v(d(w)), 1),
          c(w) ? (u(), f("span", P0, "Unavailable")) : k("", !0)
        ], 8, N0))), 128))
      ])) : k("", !0),
      R(gn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (w) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, W0 = /* @__PURE__ */ z(F0, [["__scopeId", "data-v-e9bc783c"]]), H0 = ["title", "aria-label"], z0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, U0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, G0 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = A(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: K(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", z0, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", U0)) : k("", !0)
      ]))
    ], 10, H0));
  }
}, V0 = /* @__PURE__ */ z(G0, [["__scopeId", "data-v-6dc92808"]]), K0 = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Y0 = (e) => e.worker_id != null ? "report" : "message", Q0 = (e) => K0[Y0(e)], X0 = "img,pre,table";
function J0(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Z0(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function eb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(X0)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = J0(Z0(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function tb(e, t) {
  let n = null;
  const a = () => e.value && eb(e.value);
  xe(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const nb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function ab(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Rn = /* @__PURE__ */ new WeakMap(), Be = "work", Qe = "sent", sb = 50, Uo = 50, Go = () => ({ rows: M([]), total: M(0), next: M(null), loading: M(!1), failure: M(""), version: 0 });
function ob(e) {
  var I;
  if (Rn.has(e)) return Rn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (_) => {
    var $;
    return (($ = e.visible) == null ? void 0 : $.value) !== !1 && [..._.views].some((B) => B.visible);
  };
  function o(_, $) {
    const B = _[$], H = ++B.version;
    return B.loading.value = !0, B.failure.value = "", H;
  }
  function l(_, $, B, H, D) {
    const T = _[$];
    if (t.get(_.id) !== _ || T.version !== B) return;
    if (T.loading.value = !1, !D.ok) {
      T.failure.value = D.error;
      return;
    }
    const G = $ === Be ? D.value.counterparts ?? [] : D.value.rows ?? [], F = H === 1 ? G : [...T.rows.value, ...G], q = $ === Be ? (S) => `${S.endpoint.model}:${S.endpoint.id}` : (S) => S.id ?? S.target_id;
    T.rows.value = [...new Map(F.map((S) => [q(S), S])).values()], T.total.value = D.value.total ?? T.rows.value.length, T.next.value = D.value.next_page ?? null;
  }
  function i(_, $, B, H) {
    const D = _[$];
    D.version === B && (D.failure.value = H.message, D.loading.value = !1);
  }
  async function r(_, $, B) {
    const H = o(_, $), D = $ === Be ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(_, $, H, B, await e.read(`link list --source message:${_.id} ${D} --page ${B} --page-size ${$ === Be ? 10 : 25}`));
    } catch (T) {
      i(_, $, H, T);
    }
  }
  async function c(_) {
    const $ = _.map((B) => ({ [Be]: o(B, Be), [Qe]: o(B, Qe) }));
    try {
      const B = await e.read(`link receipts --messages ${_.map((H) => H.id).join(",")}`);
      _.forEach((H, D) => {
        const T = B.ok ? B.value.messages[String(H.id)] : null;
        l(H, Be, $[D][Be], 1, B.ok ? { ok: !0, value: T.named } : B), l(H, Qe, $[D][Qe], 1, B.ok ? { ok: !0, value: T.sent } : B);
      });
    } catch (B) {
      _.forEach((H, D) => [Be, Qe].forEach((T) => i(H, T, $[D][T], B)));
    }
  }
  function d() {
    a = null;
    const _ = [...n].map(($) => t.get($)).filter(($) => $ && s($));
    n.clear(), _.forEach(($) => $.dirty.clear());
    for (let $ = 0; $ < _.length; $ += Uo) c(_.slice($, $ + Uo));
  }
  function h(_, $ = [Be, Qe]) {
    for (const B of $) _.dirty.add(B);
    s(_) && (n.add(_.id), a ?? (a = setTimeout(d, 0)));
  }
  function g(_) {
    const $ = _.sources ?? (_.source_model && Number.isInteger(_.source_id) ? [{ model: _.source_model, id: _.source_id }] : []), B = _.link_types ?? (_.link_type ? [_.link_type] : []), H = B.length ? [Be, Qe].filter((T) => T === Be ? B.some((G) => ["about", "edited"].includes(G)) : B.includes("sent_to")) : [Be, Qe];
    if (!H.length) return;
    const D = $.length ? [...new Set($.filter((T) => T.model === "message").map((T) => T.id))].map((T) => t.get(T)).filter(Boolean) : [...t.values()].filter(s).slice(0, sb);
    for (const T of D) h(T, H);
  }
  const y = (I = e.follow) == null ? void 0 : I.call(e, ["link.*"], g), w = {
    attach(_, $) {
      let B = t.get(_);
      return B || (B = { id: _, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Be, Qe]), work: Go(), sent: Go() }, t.set(_, B)), B.views.add($), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(_) {
      _.dirty.size && h(_, [..._.dirty]);
    },
    detach(_, $) {
      _.views.delete($), _.views.size || t.delete(_.id), t.size || (clearTimeout(a), y == null || y(), Rn.delete(e));
    },
    more(_, $) {
      const B = _ == null ? void 0 : _[$];
      if (B != null && B.next.value && !B.loading.value) return r(_, $, B.next.value);
    }
  };
  return Rn.set(e, w), w;
}
function lb(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = he(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = ob(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((w) => w.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), g = he(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    r(() => {
      g(), h == null || h.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return da(o), {
    links: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: A(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: A(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: A(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Be),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qe)
  };
}
const ib = ["data-incoming", "data-ref"], rb = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], ub = { class: "message-body" }, cb = ["title"], db = ["innerHTML"], fb = ["title"], hb = ["innerHTML"], mb = {
  class: "message-faces",
  "data-message-faces": ""
}, pb = ["title", "data-face", "onClick"], gb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, vb = ["title", "data-reaction", "onClick"], yb = {
  key: 0,
  class: "message-reaction-count"
}, bb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, wb = ["href", "title"], kb = ["src", "alt"], $b = ["href"], xb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Sb = ["disabled", "data-sent-worker", "title", "onClick"], _b = { class: "message-foot" }, Mb = { class: "message-time" }, Cb = {
  class: "message-id",
  "data-message-id": ""
}, Eb = 1500, Ab = "An earlier message", Ob = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = M(null), l = A(() => ["user", "comment"].includes(n.message.type)), i = A(() => {
      const [oe, Z] = (n.message.commented_row || ":").split(":"), ee = mt(oe);
      return ee ? { ref: `${ee}:${Z}`, label: `${Ut(ee).title.toLowerCase()} ${Z}` } : null;
    }), r = A(() => n.message.worker_id ?? null), c = A(() => Q0(n.message)), d = A(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Eb);
    }
    const g = bi(), y = A(() => g(n.message.text ?? "")), w = A(() => JSON.parse(n.message.flowchart_edges || "[]")), I = M(!1), _ = A(() => g(n.quote || Ab));
    function $() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    tb(o, () => `${n.message.text} ${n.quote}`);
    const B = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, H = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, D = A(() => JSON.parse(n.message.captions || "{}")), T = A(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: H(oe), isImage: B.test(oe), title: D.value[oe] || oe }))), G = A(() => Ei(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), F = Me(qe, null), { links: q, total: S, more: C, loading: b, failure: p, sentTo: x, sentMore: E, sentLoading: O, sentFailure: N, loadMore: J, loadSent: ne } = lb(F, () => l.value && !n.message.local ? n.message.id : null, o), le = M(!1), ge = A(() => ab(n.message.reactions));
    function Ae(oe) {
      le.value = !1, a("react", n.message, oe);
    }
    return (oe, Z) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      R(A0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: Z[0] || (Z[0] = (ee) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ib)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", ub, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: K(["message-card", "md", { comment: i.value }]),
          onClick: Z[5] || (Z[5] = (...ee) => L(Rt) && L(Rt)(...ee))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Z[1] || (Z[1] = $e((ee) => L(Ne)(i.value.ref), ["stop"]))
          }, [
            R(me, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, cb)) : k("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e($, ["stop"]),
            innerHTML: _.value
          }, null, 8, db)) : k("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: Z[2] || (Z[2] = $e((ee) => L(Ne)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + v(r.value), 9, fb)) : k("", !0),
          R(hi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, hb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          w.value.length ? (u(), f(P, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Z[3] || (Z[3] = (ee) => I.value = !0)
            }, "Open the flowchart"),
            I.value ? (u(), W(f0, {
              key: 0,
              title: e.message.text,
              edges: w.value,
              onClose: Z[4] || (Z[4] = (ee) => I.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: K(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (u(), f(P, { key: 0 }, [
            m("div", mb, [
              (u(!0), f(P, null, ae(L(nb), (ee) => (u(), f("button", {
                key: ee,
                type: "button",
                class: "message-face",
                title: `React ${ee}`,
                "data-face": ee,
                onClick: (De) => Ae(ee)
              }, v(ee), 9, pb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Z[6] || (Z[6] = (ee) => le.value = !1)
            }, [
              R(me, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(P, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: Z[7] || (Z[7] = (ee) => le.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Z[8] || (Z[8] = (ee) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: h
            }, v(s.value ? "Copied" : "Copy"), 1),
            d.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Z[9] || (Z[9] = (ee) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      ge.value.length ? (u(), f("div", gb, [
        (u(!0), f(P, null, ae(ge.value, (ee) => (u(), f("button", {
          key: ee.emoji,
          type: "button",
          class: K(["message-reaction", { mine: ee.mine }]),
          title: ee.title,
          "data-reaction": ee.emoji,
          onClick: (De) => a("react", e.message, ee.emoji)
        }, [
          te(v(ee.emoji) + " ", 1),
          ee.count > 1 ? (u(), f("span", yb, v(ee.count), 1)) : k("", !0)
        ], 10, vb))), 128))
      ])) : k("", !0),
      T.value.length ? (u(), f("div", bb, [
        (u(!0), f(P, null, ae(T.value, (ee) => (u(), f(P, {
          key: ee.name
        }, [
          ee.isImage ? (u(), f("a", {
            key: 0,
            href: ee.address,
            target: "_blank",
            class: "message-image",
            title: ee.title
          }, [
            m("img", {
              src: ee.address,
              alt: ee.name,
              "data-figure-picture": ""
            }, null, 8, kb)
          ], 8, wb)) : (u(), f("a", {
            key: 1,
            href: ee.address,
            target: "_blank",
            class: "message-file"
          }, v(ee.name), 9, $b))
        ], 64))), 128))
      ])) : k("", !0),
      L(x).length ? (u(), f("div", xb, [
        R(me, {
          name: "send",
          size: 12
        }),
        (u(!0), f(P, null, ae(L(x), (ee) => (u(), f("button", {
          key: ee.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ee.unavailable || !ee.open_ref,
          "data-sent-worker": ee.id,
          title: `Open worker ${ee.id}`,
          onClick: $e((De) => ee.open_ref && L(Ne)(ee.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + v(ee.id), 1),
          ee.unavailable ? (u(), f(P, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : k("", !0)
        ], 8, Sb))), 128))
      ])) : k("", !0),
      R(gn, {
        more: L(E),
        loading: L(O),
        failure: L(N),
        label: "More recipients",
        onMore: L(ne)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", _b, [
        m("time", Mb, v(G.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(P, { key: 0 }, [
          Z[10] || (Z[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Cb, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (u(), W(V0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      L(q).length || L(p) ? (u(), W(W0, {
        key: 3,
        links: L(q),
        total: L(S),
        more: L(C),
        loading: L(b),
        failure: L(p),
        onMore: L(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, rb));
  }
}, $S = /* @__PURE__ */ z(Ob, [["__scopeId", "data-v-0293091f"]]), ta = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ra = 200, Ki = (e) => {
  var t;
  return ((t = ta.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ta[0].key;
}, xS = (e) => {
  var t;
  return ((t = ta.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Tb = ["aria-label"], Ib = 300, Vo = 400, Bb = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ra } },
  setup(e) {
    const t = e, n = A(() => Ki(t.value)), a = A(() => n.value < Ra ? [1, 0.25, 0.25] : n.value === Ra ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: K(["ico", "prio", { hot: n.value >= Vo, high: n.value >= Ib && n.value < Vo }]),
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
    ], 10, Tb));
  }
}, SS = /* @__PURE__ */ z(Bb, [["__scopeId", "data-v-b10e610f"]]), Yi = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], _S = (e) => {
  const t = Yi[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Rb = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Ko = (e) => Rb[e.card.state] || "idle", Lb = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Qo = (e, t) => Yo[Ko(e)] - Yo[Ko(t)], Xo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, MS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Qo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Lb(a, s)) : [...e].sort((a, s) => Qo(a, s) || (Xo[t] || Xo.state)(a, s)), Nb = { class: "list-row" }, qb = {
  key: 0,
  class: "list-row-type"
}, Db = { class: "list-row-main" }, Pb = {
  key: 0,
  class: "list-row-title"
}, jb = { class: "list-row-body" }, Fb = {
  key: 1,
  class: "list-row-end"
}, Wb = {
  key: 1,
  class: "list-row-text"
}, Hb = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Nb, [
      e.type ? (u(), f("span", qb, v(e.type), 1)) : k("", !0),
      m("div", Db, [
        e.title ? (u(), f("span", Pb, v(e.title), 1)) : k("", !0),
        m("div", jb, [
          de(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", Fb, [
          de(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (u(), f("span", Wb, v(e.text), 1)) : k("", !0)
    ]));
  }
}, CS = /* @__PURE__ */ z(Hb, [["__scopeId", "data-v-dfc8c3a7"]]), ES = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = A(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (u(), W(Ri, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, zb = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: K(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      de(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Qi = /* @__PURE__ */ z(zb, [["__scopeId", "data-v-978e0921"]]), Ub = ["aria-label"], Gb = { class: "head" }, Vb = { class: "names" }, Kb = { class: "body" }, Yb = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ni(a, n), i = ai(s);
    return (r, c) => (u(), W(ca, { to: "body" }, [
      R(Ht, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), f("div", {
            key: 0,
            class: K(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: L(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = $e((...d) => L(o) && L(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: K(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(P, { key: 0 }, [
                m("header", Gb, [
                  m("div", Vb, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (u(), W(at, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0)
                  ]),
                  de(r.$slots, "actions", {}, void 0, !0),
                  R(fa, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), W(Qi, { key: 0 }, {
                  default: j(() => [
                    de(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", Kb, [
                  de(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : de(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, Ub)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, AS = /* @__PURE__ */ z(Yb, [["__scopeId", "data-v-f276f055"]]), Qb = {
  key: 1,
  class: "text-field-label"
}, Xb = {
  key: 2,
  class: "text-field-end"
}, Jb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = sn(e, "modelValue"), a = ua(), s = "onUpdate:modelValue" in (((d = Jr()) == null ? void 0 : d.vnode.props) || {}), o = A(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = A(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = A(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = M(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, g) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: K(["text-field", { large: e.large, ended: h.$slots.end }, L(a).class]),
      style: ve(L(a).style)
    }, [
      e.icon ? (u(), W(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (u(), f("span", Qb, v(e.label), 1)) : k("", !0),
      Je(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(is), o.value]
      ]),
      h.$slots.end ? (u(), f("span", Xb, [
        de(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Je((u(), f("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [L(is), o.value]
    ]);
  }
}), OS = /* @__PURE__ */ z(Jb, [["__scopeId", "data-v-d9c38ca8"]]), Zb = { class: "title" }, ew = { class: "state" }, tw = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ts(t.line, t.events);
    return (o, l) => (u(), W(Iy, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", Zb, v(i.title), 1),
        m("span", ew, v(L(ln)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, TS = /* @__PURE__ */ z(tw, [["__scopeId", "data-v-9191a6f0"]]);
function nw(e = 1e3, t = null) {
  const n = M(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Ie(() => clearInterval(a)), n;
}
const La = M(Date.now() / 1e3);
let Jo = 0, Ln = 0;
function Vs() {
  return Ln || (La.value = Date.now() / 1e3, Jo = setInterval(() => La.value = Date.now() / 1e3, 1e3)), Ln += 1, Tl() && da(() => {
    Ln -= 1, Ln || clearInterval(Jo);
  }), La;
}
const aw = 200, sw = Ui + Wn + Gi + aw;
function Kt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function ow(e, t, n) {
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
      var l, i, r, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }))(getComputedStyle(e)),
    parent: Kt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function lw(e, t, n, a) {
  he(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(ow(o, l, n.value)), performance.now() - l < sw) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const iw = ["title", "data-figure-mark", "data-folded", "data-open"], rw = {
  key: 2,
  class: "worker"
}, uw = { class: "head" }, cw = { key: 0 }, dw = {
  key: 3,
  class: "status"
}, fw = {
  key: 0,
  class: "figure"
}, hw = {
  key: 1,
  class: "ran-for"
}, mw = { key: 2 }, pw = {
  key: 3,
  class: "news"
}, gw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, vw = {
  key: 6,
  class: "settled"
}, yw = {
  key: 1,
  class: "bar"
}, bw = {
  key: 3,
  class: "detail body"
}, ww = {
  key: 0,
  class: "body-label"
}, kw = ["title"], $w = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ua(), a = ["onClick", "onAct"], s = A(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = M(!1), l = A(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = A(() => t.open !== void 0), r = A(() => i.value || l.value), c = A(() => i.value ? t.open : o.value), d = A(() => i.value ? !t.open : l.value && !o.value), h = A(() => !!(t.mark.action && n.onAct)), g = A(() => r.value || h.value || !!n.onClick), y = M(null), w = M(null), { folded: I, phase: _ } = Vi(y, () => d.value);
    lw(y, d, _, Me(qe, null));
    function $(le) {
      var ge, Ae;
      if (!(le.target !== y.value && !w.value.contains(le.target))) {
        if (i.value) return (ge = n.onClick) == null ? void 0 : ge.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(le);
      }
    }
    const B = (le) => n.onAct(le), H = ["failed", "unfinished"], D = A(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), T = A(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = A(() => T.value || "var(--tone-work)"), F = A(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), q = Vs(), S = A(
      () => t.mark.began_at && F.value && !t.mark.figure && !t.mark.counting ? Ai(q.value - t.mark.began_at) : ""
    ), C = A(() => {
      const { started: le, ended: ge } = t.mark;
      return le ? ge ? `ran ${Po(ge - le, !0)}` : Po(q.value - le, !0) : S.value;
    }), b = ["bad", "danger", "warn"], p = A(() => b.includes(D.value) || t.mark.asks ? "attention" : F.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), x = ["bad", "danger"], E = A(() => x.includes(D.value)), O = A(() => p.value === "process" ? "running" : E.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), N = A(
      () => !!(t.mark.figure || C.value || t.mark.docked || t.mark.stopping || O.value || t.mark.settled || t.mark.news)
    ), J = A(() => [t.mark.title, t.mark.time ? Ei(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = A(() => ({
      ...T.value ? { "--mark": T.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ge) => (u(), f("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        L(_),
        {
          open: c.value,
          folding: i.value && d.value,
          live: g.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: T.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(I) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (u(), W(it(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: w,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (u(), W(_t, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), W(me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", rw, v(e.mark.worker), 1)) : k("", !0),
          m("span", uw, [
            R(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", cw, v(e.mark.name), 1)) : k("", !0),
            r.value ? (u(), W(Gt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          N.value ? (u(), f("span", dw, [
            e.mark.figure ? (u(), f("span", fw, v(e.mark.figure), 1)) : k("", !0),
            C.value ? (u(), f("span", hw, v(C.value), 1)) : k("", !0),
            e.mark.stopping ? (u(), f("span", mw, "Stopping")) : k("", !0),
            e.mark.news ? (u(), f("span", pw, v(e.mark.news), 1)) : k("", !0),
            O.value === "running" ? (u(), f("span", gw)) : O.value ? (u(), W(_t, {
              key: 5,
              class: K(["sign", O.value]),
              name: O.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (u(), f("span", vw, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), W(zi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(B, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && F.value ? (u(), f("span", yw, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !L(I) ? (u(), W(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !L(I) ? (u(), f("div", bw, [
        e.mark.bodyLabel ? (u(), f("p", ww, v(e.mark.bodyLabel), 1)) : k("", !0),
        R(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !L(I) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, kw)) : k("", !0),
      e.mark.card ? (u(), W(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      de(le.$slots, "default", {
        shown: !L(I)
      }, void 0, !0)
    ], 16, iw));
  }
}), Xi = /* @__PURE__ */ z($w, [["__scopeId", "data-v-2aa9c496"]]), xw = 8, Sw = 40, _w = [];
class Ks {
  constructor(t, n, { top: a = xw, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && _w.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Ks(t, {
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
    n > Sw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Mw = 60, Cw = 300, Ji = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Zi(e, t) {
  const n = M([]), a = M(0);
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
  async function r() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new Ks("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Cw, more: () => a.value > 0, previous: r }, { top: Mw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Ew = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function er(e) {
  var n;
  const t = Ew[e] || ((n = Ut(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Aw = (e) => er(String(e).split(":")[0]), Ow = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Tw = { passed: "good", failed: "danger", warned: "warn", running: "" }, Iw = { good: "good", warn: "warn", danger: "danger" }, Zo = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Rf(e.target_model, e.target_id || 0)
}, Bw = { "open row": (e) => Aw(e.target_model), "open page": () => er("pages") };
function Rw(e, t) {
  const n = t || {}, a = Zo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Tw[e.outcome] || "" : Iw[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Bw[a](e) : "",
    handlers: a ? { onAct: () => Zo[a](e) } : {}
  };
}
const Lw = 24, Nw = 1e3, el = 2e3, qw = 0.25, Dw = 5e3;
function Pw(e, t = Lw, n = () => !0) {
  const a = M(!1), s = M(0), o = M(!1);
  let l = 0, i = 0, r = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const D = c();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function g(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, r = Date.now();
      return;
    }
    const T = Date.now() - r < el ? el : Nw;
    l = setTimeout(() => o.value = a.value, T);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, g(!1);
  }
  function w(D = !1) {
    const T = c();
    T && D && T.scrollTo ? T.scrollTo({ top: T.scrollHeight, behavior: "smooth" }) : T && (T.scrollTop = T.scrollHeight), y();
  }
  function I() {
    $(), !a.value && (a.value = !0, g(!0));
  }
  const _ = () => !!c() && d() <= c().clientHeight * qw;
  function $() {
    clearTimeout(i), _() && (i = setTimeout(() => a.value && _() && n() && w(!0), Dw));
  }
  function B() {
    h() ? y() : I();
  }
  function H(D = 1, T = !1) {
    a.value ? s.value += Math.max(0, D) : w(T);
  }
  return Tl() && da(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: w, left: I, scrolled: B, arrived: H };
}
const jw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Fw = (e) => String(e ?? "").replace(jw, ""), Ww = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(null), { away: o, scrolled: l, arrived: i, toBottom: r } = Pw(s);
    he(
      () => n.lines.length,
      () => je(() => {
        var d;
        i(), s.value && ((d = n.feed) == null || d.drawn(s.value));
      }),
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
      te(v(L(Fw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (g) => L(r)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, Hw = /* @__PURE__ */ z(Ww, [["__scopeId", "data-v-5a8693fe"]]), zw = "*.*", Uw = {
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
    const t = e, n = Me(qe, null), a = new Wl();
    he(
      () => a.patterns,
      (r, c, d) => {
        var g;
        const h = (g = n == null ? void 0 : n.subscriptions) == null ? void 0 : g.follow(`body of ${t.declaration.type}`, r, (y) => a.dispatch(y));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = A(() => !!(t.declaration.shipped || t.declaration.trusted)), i = A(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [zw] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), W(Fi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), W(ji, {
      key: 1,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Gw = { class: "mark-more-inner" }, Vw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Kw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Yw = {
  key: 3,
  class: "mark-lines"
}, Qw = "process", tl = "task", Xw = {
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
    const t = e, n = Ke(), a = A(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = A(() => Ow.has(t.mark.variant) && t.mark.detail || ""), o = A(() => t.mark.target_model === tl ? t.mark.target_id : 0), l = Zi(
      Ji(n),
      () => t.mark.target_id
    ), i = l.lines, r = M(!1), c = M(""), d = A(() => !t.declaration.body_url && t.mark.target_model === Qw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const w = await y();
      r.value = !0, c.value = w.ok ? "" : w.error;
    }
    const g = A(() => t.shown && d.value);
    return he(g, (y) => y && h()), Es(() => g.value && h(), () => g.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (y) => y && g.value && h(l.newest)
    ), (y, w) => (u(), f("div", {
      class: K(["mark-more", { open: e.shown }]),
      onClick: w[1] || (w[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", Gw, [
        e.declaration.body_url ? (u(), W(Uw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), f(P, { key: 1 }, [
          s.value ? (u(), f(P, { key: 0 }, [
            w[2] || (w[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Vw, v(s.value), 1)
          ], 64)) : k("", !0),
          d.value && c.value ? (u(), f("p", Kw, v(c.value), 1)) : d.value && r.value ? (u(), f(P, { key: 2 }, [
            w[3] || (w[3] = m("p", { class: "mark-label" }, "Output", -1)),
            R(Hw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", Yw, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: w[0] || (w[0] = $e((I) => L(Ne)(`${tl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ps = /* @__PURE__ */ z(Xw, [["__scopeId", "data-v-df71b15a"]]), Jw = ["title", "aria-label", "onClick"], Zw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, ek = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = A(() => of(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = M(""), s = Me(qe);
    async function o(l) {
      const i = await vn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(P, null, [
      (u(!0), f(P, null, ae(n.value, (r) => (u(), f("button", {
        key: r.runs,
        type: "button",
        class: "mark-button",
        title: r.label,
        "aria-label": r.label,
        onClick: $e((c) => o(r), ["stop"])
      }, [
        R(_t, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, Jw))), 128)),
      a.value ? (u(), f("span", Zw, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, tk = /* @__PURE__ */ z(ek, [["__scopeId", "data-v-7a62c88e"]]);
function tr(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await _e.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const nr = tr("/api/marks", "marks"), IS = nr.fetchAll, nk = nr.find, ak = ["data-ref"], sk = ["data-ref"], ok = { class: "mark-row" }, lk = "dock add", ik = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = A(() => nk(a.mark.type)), o = A(() => Rw(a.mark, s.value)), l = A(() => {
      var h;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (h = s.value) != null && h.body_url);
    }), i = A(() => l.value || !!o.value.handlers.onAct), r = M(!1);
    function c() {
      r.value = !r.value;
    }
    const d = A(() => {
      var h;
      return (((h = s.value) == null ? void 0 : h.buttons) || []).filter((g) => {
        var y;
        return !a.docked || !((y = g.runs) != null && y.startsWith(lk));
      }).map((g) => ({ ...g, module: s.value.module }));
    });
    return (h, g) => {
      var y, w;
      return (y = s.value) != null && y.card ? (u(), f("div", {
        key: 0,
        class: K(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        R(ps, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, ak)) : (u(), f("div", {
        key: 1,
        class: K(["thread-turn", "card", { "full-width": (w = s.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", ok, [
          R(Xi, {
            mark: o.value,
            open: i.value ? r.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: c
          }, Zr({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: I }) => [
                R(ps, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: I
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          R(tk, {
            buttons: d.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, sk));
    };
  }
}, rk = /* @__PURE__ */ z(ik, [["__scopeId", "data-v-f1243ccb"]]), uk = ["data-ref"], ck = ["inert"], dk = { class: "group-fold" }, fk = { class: "thread-group" }, hk = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = M(!1), a = M(!1), s = M(!1), o = M(null);
    he(n, async (i) => {
      var r;
      a.value = !0, await je(), (r = o.value) == null || r.offsetHeight, s.value = i;
    });
    const l = A(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (i, r) => (u(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      R(Xi, {
        mark: l.value,
        open: n.value,
        onClick: r[0] || (r[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: K(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", dk, [
          m("div", fk, [
            (u(!0), f(P, null, ae(e.group.marks, (c) => (u(), W(rk, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, ck)) : k("", !0)
    ], 8, uk));
  }
}, BS = /* @__PURE__ */ z(hk, [["__scopeId", "data-v-45b58b9b"]]);
function mk(e) {
  const t = M(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return xe(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const pk = { class: "chat-dock-fold" }, gk = ["aria-label"], vk = { class: "chat-dock-head" }, yk = { class: "chat-dock-inner" }, bk = { class: "chat-dock-foot" }, ar = 700, wk = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = M(null), a = M(null), s = mk(a), o = M(!1);
    let l = 0;
    return xe(() => l = setTimeout(() => o.value = !0, ar)), et(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: K(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", pk, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: K(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          de(i.$slots, "edge", {}, void 0, !0),
          m("header", vk, [
            de(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: K(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", yk, [
              m("div", {
                class: K(["chat-dock-grow", { settled: o.value }]),
                style: ve(L(s) === null ? null : { height: `${L(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  de(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          de(i.$slots, "still", {}, void 0, !0),
          m("footer", bk, [
            de(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, gk)
      ])
    ], 2));
  }
}, kk = /* @__PURE__ */ z(wk, [["__scopeId", "data-v-574cba3d"]]), $k = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Na = 5, xk = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Na, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Na}s`, animationDelay: `${(n - Na).toFixed(2)}s` };
    return (s, o) => (u(), f("span", $k, [
      m("i", { style: a })
    ]));
  }
}, Sk = /* @__PURE__ */ z(xk, [["__scopeId", "data-v-2a7bc150"]]), _k = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), gs = (e) => e.charAt(0).toUpperCase() + e.slice(1), Mk = (e) => gs(e.replace(/_at$/, "").replaceAll("_", " ")), Ck = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Ek = (e, t, n) => [gs(`${e} ${n}`), (t == null ? void 0 : t.state) && gs(t.state)].filter(Boolean).join(" · "), sr = (e) => e.given_name || `${Yn(e.role)} ${e.id}`, Ak = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? sr(t) : (e == null ? void 0 : e.name) ?? "", Ok = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? sr(t) : "", Tk = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !_k.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Mk(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Ik = { reviewing: "Under review" }, Bk = (e, t) => e || Ik[t == null ? void 0 : t.state] || "", or = tr("/api/docks", "docks"), RS = or.fetchAll, It = or.find, Rk = 6, qa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Ys = (e) => Date.parse(e.leaves_at) / 1e3, Qt = (e) => !!(e.leaves_at && !e.kept), Lk = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Qt(e) || t < Ys(e) || n.has(e.id)), Nk = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Lk(a, t, n)).sort((a, s) => a.id - s.id);
function qk(e, t, n = Rk) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Ys(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Dk = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), vs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Pk = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), jk = (e) => ({ ...e.kept ? vs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : vs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Fk = ["keep", "unkeep", "open", "undock"], Wk = (e) => ({ ...e, iconOnly: Fk.includes(e.action) });
function Hk(e, t) {
  var n;
  return [
    ...Pk(e, t) ? [jk(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Ut(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    vs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(Wk);
}
function lr(e, t) {
  const n = Hk(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Dk(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const zk = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || lr(e, t).title, Uk = { class: "dock-text" }, Gk = ["title"], Vk = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Kk = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Yk = {
  key: 1,
  "data-dock-row": ""
}, Qk = { class: "dock-acts" }, Xk = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = A(() => It(a.item.type)), o = Vs(), l = A(() => zs(a.item.created_at, o.value * 1e3)), i = M(null), r = M(null), c = M(null), d = M(null), h = A(() => lr(a.item, s.value)), g = Ke(), y = A(() => `dock.${a.item.id}`), w = A(() => g.props[y.value].data.value), I = A(() => zk(a.item, s.value, w.value)), _ = A(() => Zn(a.item.target_model ?? "")), $ = A(() => {
      var b;
      return ((b = s.value) == null ? void 0 : b.word) ?? "";
    }), B = A(() => ({ ...w.value, id: a.item.target_id, noun: _.value })), H = () => {
      var b, p;
      return ((p = (b = s.value) == null ? void 0 : b.reads) == null ? void 0 : p.length) && g.reload(y.value);
    };
    $c(Ol, { data: w, reload: H, readOutput: Ji(g) }), he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (b, p, x) => {
        var O;
        H();
        const E = (O = g.subscriptions) == null ? void 0 : O.follow(`dock ${a.item.id}`, [`${_.value.replaceAll("-", "_")}.*`], (N) => {
          (!N.row_id || N.row_id === a.item.target_id) && H();
        });
        x(() => E == null ? void 0 : E());
      },
      { immediate: !0 }
    );
    const D = M(/* @__PURE__ */ new Set()), T = M("");
    async function G(b) {
      if (b.action === "undock") return n("undock", b);
      if (b.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      b.action === "declared" && (D.value = /* @__PURE__ */ new Set([...D.value, b.label])), T.value = "";
      const x = await vn(b, { id: a.item.target_id }, g.environment);
      (x == null ? void 0 : x.ok) === !1 && (D.value = new Set([...D.value].filter((E) => E !== b.label)), T.value = `Could not ${b.label.toLowerCase()}: ${x.error}`);
    }
    const F = A(() => h.value.actions.filter((b) => !D.value.has(b.label))), q = A(() => {
      var b;
      return Bk((b = s.value) == null ? void 0 : b.badge, B.value);
    }), S = A(() => h.value.controls), C = A(() => {
      var b;
      return !!((b = s.value) != null && b.draws_head) && !a.collapsed;
    });
    return (b, p) => {
      var x, E, O, N;
      return u(), W(kk, {
        label: h.value.title + ((x = s.value) != null && x.needs_user ? ", waiting for you" : ""),
        type: (E = s.value) != null && E.needs_user ? "waiting" : "",
        folded: !!((O = s.value) != null && O.folds) && e.folded,
        body: !!((N = s.value) != null && N.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: p[3] || (p[3] = (J) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), W(Sk, {
            key: 0,
            "ends-at": L(Ys)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: j(() => {
          var J;
          return [
            C.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(P, { key: 1 }, [
              R(me, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", Uk, [
                m("span", {
                  class: K(["dock-title", { strip: e.collapsed }]),
                  title: I.value
                }, v(I.value), 11, Gk)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? k("", !0) : (u(), f(P, { key: 0 }, [
                te(v(l.value), 1)
              ], 64))
            ], 512),
            S.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: p[0] || (p[0] = $e(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(P, null, ae(S.value, (ne) => {
                var le, ge;
                return u(), f(P, {
                  key: ne.action + ne.runs
                }, [
                  !D.value.has(ne.label) && (!((le = ne.variants) != null && le.length) || !((ge = B.value) != null && ge.state) || ne.variants.includes(B.value.state)) ? (u(), W(pe, {
                    key: 0,
                    variant: "icon",
                    class: K({ kept: ne.pressed }),
                    "aria-pressed": ne.pressed,
                    "aria-label": ne.label,
                    title: ne.label,
                    "data-dock-action": ne.action,
                    onClick: (Ae) => G(ne)
                  }, {
                    default: j(() => [
                      R(me, {
                        name: ne.icon,
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
        still: j(() => [
          T.value || e.refusal ? (u(), f("p", Vk, v(T.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: j(() => {
          var J;
          return [
            m("span", Kk, [
              q.value ? (u(), f("span", {
                key: 0,
                class: K(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : k("", !0),
              $.value ? (u(), f("span", Yk, v($.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (u(), W(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: p[1] || (p[1] = (ne) => n("fold"))
            }, {
              default: j(() => [
                te(v(s.value.folds) + " ", 1),
                R(Gt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", Qk, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              R(Ds, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(g).environment,
                "read-only": L(g).readOnly,
                "object-name": L(Zn)(e.item.target_model),
                "external-failure": "",
                onFailure: p[2] || (p[2] = (ne) => T.value = ne),
                onDone: b.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(P, null, ae(F.value, (ne) => (u(), W(pe, {
                key: ne.action + ne.runs,
                small: "",
                variant: ne.primary ? "primary" : "ghost",
                bordered: !ne.primary,
                "data-dock-action": ne.action,
                onClick: (le) => G(ne)
              }, {
                default: j(() => [
                  te(v(ne.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var J;
          return [
            (J = s.value) != null && J.body_url ? (u(), W(ps, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: i.value,
              foot: r.value,
              actions: c.value,
              time: d.value,
              folded: e.folded,
              collapsed: e.collapsed
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : k("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, nl = /* @__PURE__ */ z(Xk, [["__scopeId", "data-v-46615a02"]]), Jk = 24, Zk = 8, LS = 420;
function NS({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Jk ? !0 : e < t && s > Zk ? !1 : null;
}
const e2 = (e, t) => e === void 0 ? t : e, t2 = { me: 1, people: [] }, na = Wt({
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
  people: t2,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Qn("journal.activity", !0),
  wide: !1,
  sideMini: Qn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
ci("journal.activity", () => na.activity);
ci("journal.side.mini", () => na.sideMini);
const ir = "journal.viewer.";
function n2(e, t, n) {
  try {
    const a = n.getItem(ir + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function a2(e, t, n) {
  try {
    n.setItem(ir + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function al(e, t, n = window.localStorage) {
  const a = M(n2(e, t, n));
  return he(a, (s) => a2(e, s, n), { deep: !0 }), a;
}
const s2 = {
  key: "dock-all",
  class: "dock-all"
}, o2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var b, p;
    const t = e, n = nw(500), a = M(/* @__PURE__ */ new Set()), s = Me(qe), o = M(/* @__PURE__ */ new Set()), l = M({});
    async function i(x, E) {
      l.value = { ...l.value, [x.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, x.id]);
      const O = await vn(E, { id: x.target_id }, s.environment);
      (O == null ? void 0 : O.ok) === !1 && (o.value = new Set([...o.value].filter((N) => N !== x.id)), l.value = { ...l.value, [x.id]: `Could not dismiss this card: ${O.error}` });
    }
    const r = A(
      () => Nk(
        t.items.filter((x) => !o.value.has(x.id)),
        n.value,
        a.value
      )
    ), c = A(
      () => qk(
        r.value.filter((x) => qa(x, It)),
        n.value
      )
    ), d = A(() => r.value.filter((x) => !c.value.includes(x) && !qa(x, It))), h = al(`dock-size:${((b = na.identity) == null ? void 0 : b.root) || location.host}`, null), g = (x) => {
      var E;
      return !!((E = It(x.type)) != null && E.needs_user);
    }, y = M(/* @__PURE__ */ new Set()), w = M(/* @__PURE__ */ new Set()), I = A(() => r.value.length === 1), _ = (x) => g(x) || I.value, $ = (x) => _(x) ? y.value.has(x.id) || w.value.has(x.id) : h.value ? h.value.collapsed && !h.value.opened.includes(x.id) : t.collapsed, B = A(() => r.value.some($));
    he(() => t.collapsed, (x) => {
      w.value = new Set(x ? r.value.filter(g).map((E) => E.id) : []);
    });
    function H() {
      const x = !B.value;
      h.value = { collapsed: x, opened: [] }, y.value = new Set(x ? r.value.filter(g).map((E) => E.id) : []), w.value = /* @__PURE__ */ new Set();
    }
    function D(x) {
      var O;
      if (!$(x)) return;
      if (_(x)) {
        y.value = new Set([...y.value].filter((N) => N !== x.id)), w.value = new Set([...w.value].filter((N) => N !== x.id));
        return;
      }
      const E = (O = h.value) != null && O.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...E, x.id] };
    }
    const T = al(`dock-folded:${((p = na.identity) == null ? void 0 : p.root) || location.host}`, {}), G = (x) => {
      var E;
      return !!((E = It(x.type)) != null && E.folds) && (t.insidesFolded || e2(T.value[x.id], qa(x, It) || t.folded));
    };
    function F(x) {
      G(x) && q(x), T.value = { ...T.value, [x.id]: !G(x) };
    }
    function q(x) {
      var E;
      !((E = h.value) != null && E.collapsed) || h.value.opened.includes(x.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, x.id] });
    }
    function S(x) {
      a.value = /* @__PURE__ */ new Set([...a.value, x.id]);
    }
    function C(x) {
      a.value = new Set([...a.value].filter((E) => E !== x.id));
    }
    return (x, E) => (u(), W(Ms, {
      tag: "div",
      name: "dock",
      duration: L(ar),
      class: "dock-stack"
    }, {
      default: j(() => [
        r.value.length > 1 ? (u(), f("div", s2, [
          R(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: j(() => [
              R(Gt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (u(!0), f(P, null, ae(d.value, (O) => (u(), W(nl, {
          key: O.id,
          item: O,
          class: K({ timed: L(Qt)(O) }),
          leaving: L(Qt)(O) && !a.value.has(O.id),
          folded: G(O),
          collapsed: $(O),
          refusal: l.value[O.id],
          onOpen: (N) => D(O),
          onFold: (N) => F(O),
          onUndock: (N) => i(O, N),
          onMouseenter: (N) => S(O),
          onMouseleave: (N) => C(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (u(!0), f(P, null, ae(c.value, (O) => (u(), W(nl, {
          key: O.id,
          item: O,
          class: K({ timed: L(Qt)(O) }),
          leaving: L(Qt)(O) && !a.value.has(O.id),
          folded: G(O),
          collapsed: $(O),
          refusal: l.value[O.id],
          onOpen: (N) => D(O),
          onFold: (N) => F(O),
          onUndock: (N) => i(O, N),
          onMouseenter: (N) => S(O),
          onMouseleave: (N) => C(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, qS = /* @__PURE__ */ z(o2, [["__scopeId", "data-v-2c47a65e"]]), $t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Hn = (e) => Math.min(Math.max(e, 0), 1), l2 = (e) => {
  const t = Hn(e);
  return t * t * (3 - 2 * t);
}, yt = (e, t, n) => l2((e - t) / (n - t));
function DS(e) {
  const t = Hn(e), n = Hn((t - 0.12) / 0.76) * $t.shuffles, a = Math.min(Math.floor(n), $t.shuffles - 1), s = n - a, o = yt(s, 0.26, 0.38) * (1 - yt(s, 0.76, 0.96)), l = yt(s, 0.38, 0.76), i = yt(t, 0, 0.12) * (1 - yt(t, 0.88, 1)), r = yt(s, 0.2, 0.34) * (1 - yt(s, 0.84, 1)), c = Math.sin(Math.PI * Hn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / $t.shuffles, lift: $t.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function PS(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const sl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, jS = (e) => sl[e] ?? sl.butler, Qs = 2400, i2 = 0.05;
function r2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, i2), l = Math.min(t + Qs * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function FS(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function u2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function WS(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const HS = (e, t) => ({ ...e, stretch: t.stretch }), zS = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, rr = (e, t) => t >= (e.least ?? 0);
function US(e, t, n) {
  if (!rr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const GS = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), c2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ol = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), d2 = (e) => e.right > e.left && e.bottom > e.top;
function VS(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(c2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ol(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = ol(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), d2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function ur(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[h] || e[d] > o[g]) && (i = -1);
      else {
        const w = (o[h] - e[d]) / y, I = (o[g] - e[d]) / y;
        l = Math.max(l, Math.min(w, I)), i = Math.min(i, Math.max(w, I));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const r = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: r, y: c, on: "surface", surface: s.id, dx: r - s.left, dy: c - s.top };
  }
  return a;
}
const Ee = {
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
}, cn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), f2 = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => f2(cn(e, t, n)), h2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ht = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Nn = ([e, t], n) => e + n() * (t - e);
function m2(e) {
  return h2.map(() => {
    const t = Nn(ht.speed, e), n = Nn(ht.angle, e) * Math.PI / 180, a = Nn(ht.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Nn(ht.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const p2 = m2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function g2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ht.gravity * (t[2] - ht.floor))) / ht.gravity;
}
function KS(e, t, n = p2) {
  const a = Ee.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = g2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= ht.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const YS = (e, t) => e && Ee[e.name] ? { name: e.name, u: t / e.frames } : null;
function QS(e, t) {
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
const XS = () => Array.from({ length: Ee.pogo.count }, (e, t) => Ee.pogo.bounce * (t + 1) / Ee.pogo.count), Nt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function JS(e, t, n) {
  const { away: a, side: s } = Ee.bug_smash, o = s * a * n, [l, i] = [t.left + Nt.margin * n, t.right - Nt.margin * n], r = Math.min(Math.max(e + o + s * Nt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function ZS(e, t, n) {
  const a = Ee.bug_smash, s = Oe(t, a.walk), o = ([l, i]) => l + (i - l) * s;
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
function e6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Nt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = r2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function t6(e) {
  const t = Le.least + Math.floor(e() * (Le.most - Le.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Le.walls[Math.floor(e() * Le.walls.length)],
    along: Le.margin + e() * (1 - 2 * Le.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ys(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Le.margin, l = ((e.along - Le.margin + e.way * Le.speed * n / a) / s % 2 + 2) % 2, i = Le.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Le.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Le.inset : t.right - Le.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function v2(e, t) {
  const n = Ee.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = u2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function n6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ee.bug_shot, { frame: l, bug: i, shot: r } = v2(n, e.length), c = e.map(($, B) => ({ ...ys($, t, Math.min(n / o.fps, zn(B).shot)), shot: B < r })), d = Oe(l / o.frames, o.aim), [h, g] = [c[Math.max(i - 1, 0)], c[i]], y = e.map(($, B) => ({ bug: $, index: B, seconds: n / o.fps - zn(B).shot, spot: ys($, t, zn(B).shot) })).filter(($) => $.seconds >= 0), w = y.flatMap(($) => {
    const B = (s == null ? void 0 : s.get($.index)) ?? $2($.bug, t, $.spot, s ? [] : a);
    return s == null || s.set($.index, B), s && x2(B, $.seconds, a), S2(B, $.seconds, a);
  }), I = y.filter(($) => w2($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (g.x - h.x) * d, y: h.y + (g.y - h.y) * d, back: _ }, slush: w, camera: I };
}
function zn(e) {
  const t = Ee.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function a6(e, t, n, a) {
  const { limit: s, margin: o } = Ee.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = zn(d), g = ys(c, t, h.shot), y = Math.abs(g.y - n.y) / Math.tan(s * Math.PI / 180), w = g.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - g.x), I = Math.abs(g.x - r) >= y ? r : g.x + w * y, _ = w > 0 ? Math.max(r, Math.min(I, i)) : Math.min(r, Math.max(I, l)), $ = { from: r, to: _, begin: h.walk, end: h.aim };
    return r = _, $;
  });
}
function s6(e, t, n) {
  var o;
  const a = Ee.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Oe(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Se = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, y2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function b2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const w2 = (e) => e.along * 97 % 1 < Se.camera, dn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Se.gravity * t * t });
function k2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Se.gravity * (t.bottom - e.from.y))) / Se.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Se.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Se.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Se.step) {
    const d = Math.min(c + Se.step, l.t), h = dn(e, d), g = ur(i, h, n);
    if (g) return { ...g, t: c + (d - c) * g.share };
    i = h;
  }
  const r = dn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function $2(e, t, n, a = []) {
  const s = b2(e.along + 1), [o, l] = y2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Se.count }, () => {
    const r = i + (s() - 0.5) * 2 * (Se.spread * Math.PI / 180), c = Se.speed[0] + s() * (Se.speed[1] - Se.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: Se.radius[0] + s() * (Se.radius[1] - Se.radius[0]) };
    return { ...d, ...k2(d, t, a) };
  });
}
function x2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Se.step) {
      const l = Math.min(o + Se.step, s), i = ur(dn(a, o), dn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function S2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...dn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Se.hold) / Se.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function o6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Ee.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / r, d = (o[1] - o[0]) * i / r, h = Oe(e, [0, c]), g = Oe(e, [c, c + d]);
  return l.map((y) => {
    const w = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (w.x - n.x) * h,
      y: n.y + (w.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: h >= 1
    };
  });
}
function l6(e, t, n, a, s) {
  const { sway: o, above: l } = Ee.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (I) => {
    const [_, $] = [I.x - e.at.x, I.y - e.at.y];
    return { x: i.x + _ * c - $ * d, y: i.y + _ * d + $ * c };
  }, [g, y] = [...n].sort((I, _) => I.x - _.x), w = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: w.map((I, _) => ({ from: I, to: _ < w.length / 2 ? g : y })) };
}
const i6 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function aa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: cn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: cn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function r6(e, t) {
  const n = Ee[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = aa(n, t), l = 1 - (1 - n.small) * Oe(a, n.shrinks) * (1 - Oe(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = aa(n, t), o = n.flat * Oe(a, n.squashes) * (1 - Oe(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * cn(s, ...n.springs)) * (1 - cn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const u6 = (e) => e === "pack_box";
function c6(e) {
  const { into: t, out: n } = aa(Ee.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function d6(e) {
  const t = Ee.rope_swing, { into: n, out: a } = aa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const _2 = { after: 3 }, Xs = 10, M2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, C2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, E2 = { weight: 19 }, cr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, A2 = { every: 120 }, dr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, fr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, O2 = {
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
}, kn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Xs }), ie = (e, t, n = {}) => kn(e, "clip", t, n), Da = (e, t, n = {}) => kn(e, "look", t, n), ll = (e, t, n = {}) => kn(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...kn(e, "pick", t, n), ...a }), we = (e) => kn("nothing", "nothing", e, {}), T2 = 120, I2 = 300, Pa = (e, t) => ({ ...ie(e, t), cooldown: I2 }), ce = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), B2 = () => [ie("joy", 2)], bt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), wt = (e) => ({ ...e, cooldown: M2[e.name] }), Yt = (e) => ({ ...e, shenanigan: !0, lasts: C2[e.name] }), pa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ce("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ce("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...wt(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...wt(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...ce("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), we(1)]),
  ...ce("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ce("sin_fixed", { cooldown: 300 }, [ie("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ce("sin_committed", { cooldown: 300 }, [ie("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...ce("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), we(7)]),
  ...ce("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ce("reported", { cooldown: 90 }, [ll("read", 3), ie("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ce("read_message", { cooldown: 30 }, [ll("read", 3), we(1)]),
  ...ce("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), we(6)]),
  ...ce("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ce("bar_done", { holds: !0 }, B2()),
  ...ce("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ce("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ce("launched", { cooldown: 300 }, [ie("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...ce("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), we(69)]),
  ...ce("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), we(2)]),
  ...ce("refused", { cooldown: 20 }, [ie("shake", 1), we(1)]),
  ...ce("work_done", { cooldown: 120 }, [ie("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ce("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...ce("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...ce("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...ce("answered", { cooldown: 15 }, [Da("amused", 3), we(2)]),
  ...ce("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...ce("long_walk", { cooldown: 90 }, [ie("stumble", 3), we(22)]),
  ...ce("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), we(13)]),
  ...ce("typing", { cooldown: 60 }, [Da("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(O2).flatMap(([e, t]) => ce(`reacted:${e}`, {}, [Da(t, 1)])),
  ...Object.entries(dr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => ce(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(fr).flatMap(([e, t]) => ce(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
    { ...Yt(wt(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Yt(wt(ie("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ce("held:search", { cooldown: T2 }, [Pa("search", 3), { ...Pa("binoculars", 2), when: { home: !0 } }, { ...Pa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ce("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...ce("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ce("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ce("tickled", {}, [{ ...wt(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ce("eager", {}, [ie("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ce("jump", {}, [Yt(wt(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ce("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ce("unit", { cooldown: cr.build.cooldown }, [ye("unit", E2.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ce("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ce("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: A2.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...ce("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ce("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    Yt(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    Yt(wt(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ce("laptop", {}, [ye("seat", 6, {}, { stay: [60, 150] }), ye("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ce("ledge_at", {}, [ye("middle", 2, {}, { along: 1 / 2 }), ye("third", 1, {}, { along: 1 / 3 }), ye("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ce("composed_as", {}, [
    ye("facing", 4, {}, { turn: 0, leans: 0 }),
    ye("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ye("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ye("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ye("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], hr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), mr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), R2 = (e) => Array.isArray(e) ? e[0] : e, L2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, N2 = (e) => pa.some((t) => t.when.moment === e);
function q2(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || mr(d).every(([h, g]) => n(h) >= R2(g)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = pa.filter((d) => hr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= _2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ge(e, t) {
  const n = q2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (pr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function pr(e, t, n) {
  var a;
  for (const [s, o] of mr(t)) (a = e.memory) == null || a.set(s, e.now + L2(o, n));
}
function f6(e, t, n) {
  pr(e, pa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const h6 = (e) => Object.values(cr).find((t) => hr(t.when, e)) ?? null, D2 = (e, t, n) => n - t <= (e.lifetime ?? Xs), m6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || rr(e.clip, t));
class gr {
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
const bs = {
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
}, p6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), vr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), g6 = {
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
}, v6 = 120, P2 = 20, y6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < P2), j2 = (e) => bs[e] || bs.idle, b6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, yr = "airborne", F2 = "landing", W2 = "travelling", br = "grounded", w6 = ({ airborne: e, landing: t, trip: n }) => e ? yr : t ? F2 : n != null && n.started ? W2 : br;
function k6(e, t) {
  var s;
  const n = H2(e, t);
  return e.mode === br && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function H2(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: g = null } = e;
  if (n === yr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...z2(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = g !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? g : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : j2(c), facing: y ? g : i.posture === "sit" ? i.face : h };
}
function z2(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ws = (e) => e.outcome, U2 = "plugin:code-commandments:sins:", il = (e) => e.type === "plugins.card" && e.markKey.startsWith(U2), G2 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => il(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => il(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], $6 = (e, t) => e.filter((n) => n.author === "user" && ea(n.read_at) > t).map((n) => ({ beat: "read_message", time: ea(n.read_at), card: $i(n) })).sort((n, a) => n.time - a.time), rl = { user: "reacted", agent: "agent_reacted" };
function x6(e, t) {
  return e.filter((n) => rl[n.author] && St(n) > t).map((n) => ({ beat: `${rl[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const V2 = [.../* @__PURE__ */ new Set([...Object.values(dr).flatMap((e) => Object.keys(e)), ...Object.keys(fr)])];
function S6(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = V2.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: $i(n) })).sort((n, a) => n.time - a.time);
}
const K2 = (e) => new gr(e).isTest(), sa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ws(e)] || "";
}, Y2 = 1800, Q2 = (e, t) => {
  if (sa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && sa(n) !== "finished" && Number(e.time) - Number(n.time) <= Y2 ? "tests_fixed" : "tests_passed";
};
function _6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(K2), s = a.filter((i) => sa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, sa(i))), o.map((i) => ({ beat: Q2(i, s), time: Number(i.time), card: i.key }));
}
function M6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ws(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ws(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const C6 = (e) => e.map((t) => {
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
function E6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function A6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function O6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = G2.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function Js(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ul = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function X2(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Js(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function T6(e, t, n, a = {}) {
  const s = Ge({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : N2(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function I6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const cl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function B6(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, i = o % Re.sweep, r = Re.sweep - Re.returnSeconds, c = cl((i - r) / Re.returnSeconds), d = i <= r ? cl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const dl = 3, wr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, fl = 12, R6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function L6(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!wr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= dl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * fl) / fl, lasts: dl } };
}
const N6 = (e) => e.posture === "hang" && !wr(e.face), J2 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Z2 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function q6(e, t, n) {
  return J2.has(e) ? 1 / 0 : !Z2.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(kr(n - t.began, t.share) - st.lead, 0);
}
const e5 = 5;
function D6(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= e5 ? { beat: "long_walk", time: n } : null };
}
const t5 = 30, qn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function P6(e, t, n, a, s = null) {
  if (t && n < t.until || !qn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ge({ moment: "spell", state: e, tally: s }, a), [l, i] = qn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + qn.every } : { state: e, began: 0, until: 0, next: n + qn.every };
}
const j6 = (e, t, n) => t && n < t.until && vr.has(e.state) ? { state: t.state, since: t.began } : e, st = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, kr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function F6(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = kr(o, e.share);
  return s ? { eager: n5(t, l), moment: null } : l > st.lead ? { eager: t, moment: null } : l < st.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > st.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < st.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ge({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function n5(e, t) {
  return e.on && t > st.lead + st.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= st.lead && t >= st.least ? { ...e, on: !0, calm: !1 } : e;
}
const a5 = 1, s5 = { look: "look", gaze: "gaze" };
function o5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ge({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [s5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const l5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ge({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), i5 = (e, t, n, a, s, o = 0) => Ge({ moment: "jump", high: e > a5 * t, memory: a, now: s, room: o }, n).name === "backflip", r5 = { work: ["building"], idle: ["standing"] };
function W6(e, t, n, a) {
  const s = bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(r5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), vr.has(e) ? { moments: o, began: n || a } : (n && a - n >= t5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function u5(e, t, n) {
  return !Ge({ moment: "pondering", memory: e, now: t }, n) || !Ge({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ge({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const hl = { pondering: u5 };
function H6(e, t, n, a, s, o) {
  if (hl[e.beat]) {
    const i = hl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = o5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Xs && { lifetime: l.lifetime } } } : null;
}
function z6(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = l5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const U6 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function G6(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function V6(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const K6 = (e, t) => !!(e != null && e.watches) && !t.once, Y6 = 10, Q6 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || D2(a, a.queuedAt, n)), X6 = (e, t) => t ? null : e[0] ?? null;
function J6(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Z6 = (e, t) => !t.during || !e.some((n) => n.during === t.during), c5 = 2 * Math.PI, d5 = 500;
function e_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / d5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), g = c5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, I = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? h5(y, t, n, g, s) : p5(y, t, n, g) : t) ?? y, _ = I != null && I.behind && I.mood === "reading" ? f5(e.point, I, n, l, s) : I;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: h, at: a };
}
function f5(e, t, n, a, s) {
  const o = (S) => S * 180 / Math.PI, l = (S) => o(Math.atan2(Math.sin(S * Math.PI / 180), Math.cos(S * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + g : d, w = y + l(c - y), I = Math.min(Math.max(a / 1e3, 0), 0.1), _ = Re.turnSpeed * I, $ = h ? y + Math.min(Math.max(w - y, -_), _) : w, B = h ? e.readingFollow + g : $, H = B + ($ - B) * (1 - Math.exp(-I / Re.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, T = o(Js(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(T, -D.up), D.down), F = Re.tipSpeed * I, q = h ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -F), F) : G;
  return { ...t, readingYaw: $, readingFollow: H, readingPitch: q, readingFacing: i };
}
function h5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: H, pitch: D } = Js(B.x - n.x, s, n.y - B.y, o);
    return { yaw: H, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [ul(i(e)), ul(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [g, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [w, I, _] = r.map((B, H) => g * B + y * c[H]), $ = s * w / I;
  return { ...t, x: n.x + $, y: n.y - X2($, s, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const m5 = 0.15;
function t_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= m5;
}
function p5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const g5 = (e) => !(e != null && e.on);
function n_(e, t, n) {
  if (g5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const fn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, tt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ja = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ml = (e) => e * e * (3 - 2 * e);
function v5(e) {
  if (e < 0 || e >= tt.seconds) return null;
  const t = ja(e, ...tt.flicker), n = Math.floor(t * tt.flickers * 2) % 2 === 0, a = e < tt.flicker[1] ? n ? 0.35 + 0.5 * t : tt.dim : 1;
  return { strength: 1 - ml(ja(e, ...tt.fade)), lit: a, white: e < tt.flash[0] ? 0 : 1 - ml(ja(e, ...tt.flash)) };
}
const a_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function s_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = v5(t - e.at);
  return a && { colour: fn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: tt.signs[e.tone], ...a } };
}
function o_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function l_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= fn.looks || a === null && n - e.since >= fn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function i_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ft = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, r_ = { behind: 39, figure: 40, ahead: 41 }, y5 = "[data-figure-pile]", b5 = { amber: [1, 0.69, 0.125], good: fn.colours.good, bad: fn.colours.bad }, Un = { phases: 4, ms: 230, dim: 0.25 }, u_ = (e, t, n) => e !== "amber" || (t + n) % Un.phases < Un.phases / 2 ? 1 : Un.dim, c_ = (e) => e === "amber" ? Un.phases : 1;
function d_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const f_ = Object.keys(b5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Xt = ([e, t], n) => e + n() * (t - e);
function h_(e) {
  const t = Ye.least + Math.floor(e() * (Ye.most - Ye.least + 1));
  return Array.from({ length: Math.min(t, Ye.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ye.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Xt(Ye.start, e), l = Xt(Ye.reach, e);
    return {
      text: Ge({ moment: "digit" }, e).name,
      x: a * o,
      y: Ye.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Xt(Ye.moveMs, e)),
      fadeMs: Math.round(Xt(Ye.fadeMs, e))
    };
  });
}
const Fa = { high: 3, gap: 1 };
function m_(e) {
  const t = Math.floor(e / Fa.high);
  return { left: -(ft.inside + ft.width / 2 + t * (ft.width + Fa.gap)), up: e % Fa.high * (ft.height - ft.top) };
}
const w5 = (e, t, n) => Ge({ moment: "unit", memory: e, now: t }, n) !== null, k5 = { after: 5 }, $5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new gr(t).isBuild());
function p_(e, t, n) {
  const a = $5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= k5.after ? s : null;
}
function g_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: w5(n, a, s) } : null;
}
const pl = { ahead: 140, up: 70 };
function v_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * pl.ahead, y: a - pl.up } } : o ? { at: { x: n(o), y: a - o.up - ft.height } } : t ? { at: null } : null;
}
const Wa = { least: 4e3, most: 1e4 }, x5 = (e) => Wa.least + e() * (Wa.most - Wa.least), kt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function y_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = x5(t);
    if (n.length >= kt.most || t() >= kt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (kt.at[0] + t() * (kt.at[1] - kt.at[0]));
    n.push({ from: o, to: o + kt.ms }), a = o + kt.ms;
  }
}
const b_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), w_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), $r = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), k_ = new Set(pa.filter((e) => $r.has(e.when.moment) && e.type === "clip").map((e) => e.name)), S5 = (e) => e.some((t) => t.state === "built"), $_ = (e, t) => S5(t) ? e.filter((n) => !$r.has(n.beat)) : e, pt = { reach: 40, room: 6 }, _5 = (e, t) => t <= e - pt.reach + 2, x_ = (e, t, n) => _5(e, n) ? t - pt.reach : e - pt.reach - pt.room, S_ = (e, t, n, a) => a > 0 && t < e && t + pt.reach >= e - 2 ? Math.min(n, Math.max(e, t + pt.reach)) : e, Ha = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, __ = (e) => Xt(e() < Ha.longShare ? Ha.long : Ha.short, e), M5 = 2 * ft.width;
function M_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= M5 ? o : e + (o - e + s / 2) % s;
}
const C5 = 60, C_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= C5, gl = "[data-figure-home]", $n = () => {
  var t;
  const e = document.querySelector(gl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(gl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, E5 = "[data-figure-docked-bars]", A5 = "[data-figure-chat-foot]", O5 = [0.85, 0.6, 0.35, 0.15], T5 = ["question", "waiting", "suggestion"], E_ = (e, t) => T5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function A_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const I5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", B5 = "[data-figure-newest]";
function xr() {
  var a, s;
  const e = (a = $n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(B5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Zs(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function hn(e, t, n = xr()) {
  if (!e || !n) return !0;
  const a = rt(e, t), s = va(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Te.top * t.size, bottom: a.top + Te.bottom * t.size }, l = $t.gap;
  return !ga(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function O_(e, t, n, a = xr()) {
  if (!a || hn(t, e, a)) return null;
  const s = va(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ct(), r = t.posture === "stand" ? to * e.size : Tr * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - $t.gap - l, a.right + $t.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= c && g.x <= d && hn(g, e, a) && r$(g, e)).sort((g, y) => Math.abs(g.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const za = 0.26, Sr = 0.54, R5 = 1.25 / 5.4, xn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: za, travels: "stand" },
  lounge: { drop: za, travels: "stand" },
  composed: { drop: za, travels: "stand" },
  hang: { drop: Sr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, T_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * R5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Sr
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), L5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), I_ = (e, t) => (e === "sit" ? L5.has(t) : en.has(e)) ? e : "stand";
function B_(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const R_ = 0.25, L_ = (e, t) => en.has(e) && xn[t].drop === 0, _r = 2, N5 = 90, q5 = 180, D5 = 140, P5 = 280, j5 = 420, F5 = 0.25, W5 = 290, H5 = 600, z5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", U5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ua = 5;
function oa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ua) return null;
  (l || i) && (o = Math.max(o, _r));
  const y = o > 1, w = Math.abs(t.x - e.x), I = w < Ua ? 0 : w / (N5 * o) * 1e3, _ = Math.min(I, y ? D5 : q5), $ = Math.abs(t.y - e.y), B = t.y < e.y, H = B && !g && i5($, n, r, c, d, h), D = B ? j5 + Math.min($, 400) * F5 : Math.sqrt(2 * $ / Qs) * 1e3, T = {
    x: t.x,
    y: t.y,
    ms: $ > Ua ? H ? H5 : D : 0,
    lead: H ? W5 : B ? P5 : 0,
    easing: B ? z5 : U5,
    hopping: !0,
    clip: H ? "backflip" : B ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: I + _, lead: 0, easing: "linear", ramp: _, ...y ? { clip: "run" } : {} }, F = g ? G5(t, n) : T, q = B && !a ? [{ ...G, y: e.y }, F] : [{ ...T, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const G5 = (e, t) => ({ x: e.x, y: e.y, ms: Ee.pogo.frames / Ee.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), V5 = (e, t) => e.postures.includes(t) ? t : e.postures[0], N_ = (e, t, n) => e.posture === "walk" && n ? "walk" : V5(e.clip, t), rt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - xn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ga = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Zs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ct() {
  var t;
  const e = (t = $n()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Dn = 0.5, vl = 20;
function q_(e, t, n = Ct()) {
  const a = rt(e, t);
  return a.left >= n.left + vl && a.right <= n.right - vl;
}
function eo(e, t, n = Ct()) {
  const a = rt(e, t), s = a.right - a.left, o = va(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Dn && i <= n.right + Dn && a.top >= n.top - Dn && r <= n.bottom + Dn;
}
const la = [0.35, 0.5, 0.65], ia = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Te = { left: la[0], right: la.at(-1), top: ia[0], bottom: ia.at(-1) }, K5 = 0.24;
function va(e) {
  if (e.posture === "stand") return { left: Te.left, right: Te.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + K5 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Te.left, t), right: Math.max(Te.right, t) };
}
function Y5(e, { size: t }, n = Ct()) {
  const a = va(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const to = (Te.right - Te.left) / 2 + 0.08;
function D_(e, t) {
  return e === "hang" ? Te : { ...Te, bottom: Math.min(Te.bottom, 1 - t - xn[e].drop) };
}
const Q5 = "[data-figure-agent]";
function Mr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Zs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const r of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[r].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, r), c.setEnd(o, r + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Cr = (e) => ia.flatMap(
  (t) => la.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function no(e, t, n = "") {
  if (!hn(e, t)) return la.length * ia.length;
  const a = rt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(I5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ga(s, r) && Zs(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Cr(s).filter(([i, r]) => l(i, r) || Mr(i, r, n)).length;
}
function X5(e, t) {
  const n = rt(e, t);
  return Cr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Mr(a, s, "", Q5)).length;
}
const yl = 4;
function P_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = yl; o <= s; o += yl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!X5(i, e) && hn(i, e)) return i;
    }
  return null;
}
function mn(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => eo(l, t, a) && hn(l, t)).map((l) => ({ spot: l, covered: no(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Er = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), J5 = [0.5, 0.25, 0.75], Z5 = (e) => Er(e.getBoundingClientRect(), J5), Ar = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, e$ = to, t$ = (e, t, { size: n }, a = e$) => Or(e, Ar[t], a * n, "stand");
function Or(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const n$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Tr = 0.1, a$ = (e, t, { size: n }) => Or(e, n$[t], Tr * n, "sit"), s$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ga = 60;
function j_(e, t) {
  const n = s$(t);
  return !e.aside || Math.abs(n) >= Ga ? t : n < 0 ? 360 - Ga : Ga;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, o$ = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function F_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = o$(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? l$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function l$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function W_(e, t) {
  const { element: n, edge: a } = ya(), s = ["left", "right"].map((i) => Sn(a$(a, i, e), e)).filter((i) => n && eo(i, e) && !no(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function H_(e, t, { size: n }) {
  const a = (Te.right - Te.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Ir } : e;
}
const Ir = 7;
function Br() {
  const e = [...document.querySelectorAll(y5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function i$(e, t) {
  const n = rt(e, t), a = n.right - n.left;
  return { left: n.left + Te.left * a, right: n.left + Te.right * a, top: n.top + Te.top * a, bottom: n.bottom };
}
function r$(e, t) {
  const n = Br();
  return !n || !ga(i$(e, t), n);
}
const u$ = 4;
function ya() {
  const e = _n(), t = Br(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > u$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ir - n, 0) } };
}
const z_ = ({ size: e, below: t }) => (1 - t) * e;
function Sn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = xn[e.posture].drop * a;
  return { ...Y5(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ks = (e, t) => Object.keys(Ar).map((n) => Sn(t$(e, n, t), t)), ao = (e, t) => Er(e, O5).map((n) => Sn(n, t)), Rr = (e, t, n) => mn(e, t, n) ?? e[0];
function U_(e, t) {
  const { element: n, edge: a } = ya();
  return { ...Rr(ks(a, e), e, t), view: null, on: n };
}
function G_(e, t, n, a) {
  const { element: s, edge: o } = ya(), l = (a ? ks(o, t) : [...ks(o, t), ...ao(o, t)]).filter(
    (c) => !ga(rt(c, t), e)
  ), i = mn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !no(i, t) ? i : mn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function _n() {
  var a;
  const e = $n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(E5);
  if (!t) return { ...ba(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const bl = { within: 2 };
function V_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = ba().edge;
  return a.left > s.left + bl.within || a.left + a.width < s.left + s.width - bl.within;
}
const c$ = "[data-figure-closing]";
function K_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(c$));
}
const Lr = "[data-figure-progress]";
function Y_(e) {
  const t = e.querySelector(Lr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Q_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const d$ = { across: 300, above: 380, below: 60 };
function X_(e) {
  const { across: t, above: n, below: a } = d$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: f$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const f$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Nr = "[data-figure-bar]", $s = { back: 144, along: 0.4 };
function J_(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Nr) : null;
  if (!(s != null && s.querySelector(Lr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Sn({ x: o - $s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Z_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < $s.along * a.size ? t.x + $s.along * a.size : e.x, y: e.y, behind: !0 };
}
function eM(e) {
  const t = e.querySelector(Nr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ba() {
  const e = $n();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function tM(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = ba(), r = n === null ? h$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Sn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function h$(e, t, n, a, s) {
  const o = ao(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ft.width < s && r.x + a - pt.reach - pt.room >= l);
  return mn(i.length ? i : o, t, n);
}
const m$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function nM(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: g = !1 } = {}) {
  (o || l) && (s = Math.max(s, _r));
  const y = (H) => {
    const D = rt(H, n, xn[H.posture].travels);
    return { x: D.left, y: D.top };
  }, w = t.ladder ?? e.ladder;
  if (w && !(t.ladder && e.ladder)) return p$(y(e), y(t), y({ ...w.foot, posture: "stand" }), w.way, !!t.ladder, n, s);
  const [I, ..._] = [e, ...r, t].map(y), $ = oa(I, _[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: g }), B = _.slice(1).map((H, D) => {
    var T;
    return (T = oa(_[D], H, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : T.legs.find((G) => G.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...B.filter(Boolean)] };
}
function p$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / m$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? oa(e, n, o.size, { pace: l }) : oa(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function aM(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function sM(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && mn(Z5(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ya();
  return { ...Rr(ao(s, t), t, n), view: null, on: a };
}
const g$ = "[data-figure-bubble]", v$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), qr = 0;
const Vt = () => nn, Va = /* @__PURE__ */ new WeakMap();
let y$ = 0;
function so(e) {
  return Va.has(e) || Va.set(e, `floor-${++y$}`), Va.get(e);
}
const b$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, w$ = () => {
  var e, t;
  return ((t = (e = $n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function k$(e, t) {
  var a;
  const n = (a = e.querySelector(A5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function $$(e, t) {
  const n = e && k$(e, t), a = e ? [...e.querySelectorAll(g$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || b$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: so(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const x$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= v$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Dr(e = nn, t = performance.now()) {
  const n = Ct(), a = w$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = ba();
  return c.element && r.push({ id: so(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...$$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: x$(e, d, t) }))) });
}
const xs = /* @__PURE__ */ new Set();
function S$(e) {
  return xs.add(e), () => xs.delete(e);
}
function _$() {
  Pr();
  const e = () => {
    qr = requestAnimationFrame(e), !document.hidden && (nn = Dr(nn), xs.forEach((t) => t(nn)));
  };
  e();
}
function Pr() {
  cancelAnimationFrame(qr);
}
const oo = 5, M$ = 56, C$ = { share: 0.6 }, E$ = (e) => -Math.sqrt(2 * Qs * C$.share * e), Ft = (e, t) => e.find((n) => n.id === t) ?? null;
function oM(e, t = Dr().floors) {
  const n = Ft(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : so(e.on) : null, o = s && Ft(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function jr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Vt().floors) {
  const c = Ft(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || A$(c, d, o)) && O$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const lo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, A$ = (e, t, n) => !lo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function lM(e, t = Vt().floors) {
  if (!lo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= oo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function O$(e, t, n = Vt().floors) {
  const a = Ft(n, "home");
  return e.posture === "hang" && a && rt(e, t).bottom >= a.top ? !1 : eo(e, t);
}
function iM(e, t, n, a = Vt().floors) {
  const s = jr(e, n, a);
  if (!e.home) return T$(e, t, s, a);
  if (!s) return null;
  const o = Ft(a, "home"), l = s.y - t.y, i = l > oo ? "dropping" : -l > M$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function T$(e, t, n, a) {
  const s = n ? Ft(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: E$(e.risen) };
  if (!n) return null;
  if (lo(t) && n.y - t.y > oo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function rM(e, t, n) {
  const a = to * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function uM(e, t, n, a = Vt().floors) {
  const s = t && jr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const I$ = ["data-type"], B$ = { class: "figure-floor-name" }, R$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", B$, v(e.floor.type), 1)
    ], 12, I$));
  }
}, L$ = /* @__PURE__ */ z(R$, [["__scopeId", "data-v-4e0f1e2e"]]), N$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, q$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Vt().floors);
    let n = () => {
    };
    return xe(() => {
      n = S$((a) => t.value = a.floors), _$();
    }), Ie(() => {
      n(), Pr();
    }), (a, s) => (u(), f("div", N$, [
      (u(!0), f(P, null, ae(t.value, (o) => (u(), W(L$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, cM = /* @__PURE__ */ z(q$, [["__scopeId", "data-v-e519168b"]]), an = (e) => typeof e == "number" ? e : Date.parse(e);
function dM(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: an(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => an(s.row.created_at) - an(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const wl = 20;
async function fM(e, t, n) {
  for (let a = 0; a < wl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || an(o.created_at) <= an(s.created_at) || !await n()) return a;
  }
  return wl;
}
const D$ = 3, Ka = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function P$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ka[n.grouping]) == null ? void 0 : a.call(Ka, e.row, n)) || "";
}
function j$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function hM(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= D$ ? [j$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = P$(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function mM(e) {
  const t = Ke(), n = t.option("row"), a = M(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function F$(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const pM = (e) => (t) => t.filter((n) => n.id !== e), gM = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), vM = (e) => (t) => [...t, e], yM = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function bM(e, t = {}) {
  const n = Ke(), a = M(null), s = M("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function wM(e) {
  const t = Ke(), n = M("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Pn = /* @__PURE__ */ new Map();
function W$(e, t) {
  if (Pn.has(e)) return Pn.get(e);
  const n = t().finally(() => Pn.delete(e));
  return Pn.set(e, n), n;
}
function kM() {
  const e = Ke(), t = M(null), n = M("");
  async function a() {
    const s = await W$(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const H$ = { class: "cards-page" }, z$ = { class: "cards-bar" }, U$ = { class: "cards-count" }, G$ = { class: "cards" }, V$ = {
  key: 1,
  class: "cards-note"
}, K$ = {
  key: 2,
  class: "cards-note"
}, Y$ = ["data-row", "onClick"], Q$ = { class: "card-head" }, X$ = { class: "card-title" }, J$ = { class: "card-foot" }, Z$ = {
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
    return (a, s) => (u(), f("div", H$, [
      m("div", z$, [
        m("span", U$, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        R(pe, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            R(me, {
              name: "plus",
              size: 12
            }),
            te(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", G$, [
        e.loaded ? e.failure ? (u(), f("p", V$, v(e.failure), 1)) : e.rows.length ? k("", !0) : (u(), f("p", K$, "No " + v(e.noun) + "s yet", 1)) : (u(), W(Ve, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(P, null, ae(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", Q$, [
            R(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + v(e.head(o)), 1),
            R(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", X$, v(e.title(o)), 1),
          m("span", J$, v(e.foot(o)), 1)
        ], 8, Y$))), 128))
      ]),
      de(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, $M = /* @__PURE__ */ z(Z$, [["__scopeId", "data-v-990e6b37"]]), kl = "newest";
function xM(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(qe, null)) == null ? void 0 : c.search, s = M(""), o = M(kl), l = M("all"), i = A(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((g) => F$(g, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(g) === (l.value === "open")));
    return o.value === kl ? h : [...h].sort((g, y) => t(g).localeCompare(t(y)));
  }), r = A(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const e4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, t4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, n4 = 40, a4 = "top", s4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var g;
    const n = e, a = (g = Me(qe, null)) == null ? void 0 : g.autoScroll, s = A(() => a === a4), o = M(null), l = M(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= n4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    he(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return xe(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), et(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, w) => (u(), f("div", e4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: K(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        de(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", t4, [
        R(Ht, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: j(() => [
            Je(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              R(me, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              w[0] || (w[0] = te(" Newest ", -1))
            ], 512), [
              [Il, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, SM = /* @__PURE__ */ z(s4, [["__scopeId", "data-v-d704d7e3"]]), o4 = ["aria-selected", "data-tab", "onClick"], l4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, i4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(qe, null), o = A(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = M(null), i = M({ left: 0, width: 0, slides: !1 }), r = (g) => n.answer[g.count_field] !== void 0;
    function c(g) {
      var w;
      const y = (w = l.value) == null ? void 0 : w.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: g }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const d = () => je(() => c(!0));
    let h = null;
    return xe(() => {
      var g;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (g = document.fonts) == null || g.ready.then(() => c(!1));
    }), Ie(() => h == null ? void 0 : h.disconnect()), he(() => {
      var g;
      return (g = n.active) == null ? void 0 : g.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (g, y) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(P, null, ae(o.value, (w) => {
        var I, _;
        return u(), f("button", {
          key: w.key,
          type: "button",
          role: "tab",
          class: K(["inner-tab", { on: ((I = e.active) == null ? void 0 : I.key) === w.key }]),
          "aria-selected": ((_ = e.active) == null ? void 0 : _.key) === w.key,
          "data-tab": w.key,
          onClick: ($) => a("choose", w)
        }, [
          te(v(w.label) + " ", 1),
          r(w) ? (u(), f("span", l4, v(e.answer[w.count_field]), 1)) : k("", !0)
        ], 10, o4);
      }), 128)),
      m("i", {
        class: K(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, _M = /* @__PURE__ */ z(i4, [["__scopeId", "data-v-63fcd326"]]), r4 = {
  class: "tab-body",
  "data-tab-body": ""
}, u4 = { "data-tab-content": "" }, c4 = {
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
      n.value = !0, Cs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", r4, [
      n.value ? (u(), W(Ve, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Je(m("div", u4, [
        de(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Il, !n.value]
      ])
    ]));
  }
}, MM = /* @__PURE__ */ z(c4, [["__scopeId", "data-v-63876533"]]), d4 = {}, f4 = { class: "menu-label" };
function h4(e, t) {
  return u(), f("span", f4, [
    de(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $l = /* @__PURE__ */ z(d4, [["render", h4], ["__scopeId", "data-v-aa955b3e"]]), m4 = {
  class: "search-bar",
  "data-search-bar": ""
}, p4 = { class: "search-bar-control" }, g4 = ["value", "placeholder", "aria-label"], v4 = ["aria-expanded"], y4 = {
  key: 0,
  "data-menu-count": ""
}, b4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const a = e, s = n, o = eu(), l = (($ = Me(qe, null)) == null ? void 0 : $.search) ?? {}, i = A(() => l.placeholder || a.placeholder), r = l.context ?? [], c = M(null), d = M(null), h = M([]), g = A(() => h.value.length ? h.value[h.value.length - 1].next : r), y = A(() => !!o.menu || r.length > 0), w = (B) => {
      h.value = [], d.value = d.value ? null : B.currentTarget;
    };
    function I(B) {
      if (B.next.length) {
        h.value = [...h.value, B];
        return;
      }
      d.value = null, s("pick", B.click);
    }
    function _() {
      var B;
      s("update:modelValue", ""), (B = c.value) == null || B.focus();
    }
    return t({ focus: () => {
      var B;
      return (B = c.value) == null ? void 0 : B.focus();
    } }), (B, H) => {
      var D;
      return u(), f("div", m4, [
        m("div", p4, [
          R(me, {
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
            onInput: H[0] || (H[0] = (T) => s("update:modelValue", T.target.value)),
            onKeydown: xt(_, ["esc"])
          }, null, 40, g4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            R(me, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: w
          }, [
            e.menuCount ? (u(), f("span", y4, v(e.menuCount), 1)) : k("", !0),
            R(me, {
              name: "caret",
              size: 12
            })
          ], 8, v4)) : k("", !0)
        ]),
        (D = L(l).button) != null && D.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (T) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : k("", !0),
        de(B.$slots, "default", {}, void 0, !0),
        d.value ? (u(), W(Is, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = $e(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (T) => d.value = null)
        }, {
          default: j(() => [
            h.value.length ? (u(), W(Pt, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (T) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                te("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (u(!0), f(P, null, ae(g.value, (T) => (u(), W(Pt, {
              key: T.title,
              description: T.subtext,
              "data-search-entry": T.title,
              onClick: (G) => I(T)
            }, {
              default: j(() => [
                te(v(T.title) + v(T.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : de(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, w4 = /* @__PURE__ */ z(b4, [["__scopeId", "data-v-45374bed"]]), k4 = {
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
    return (o, l) => (u(), W(w4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        R($l, null, {
          default: j(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(P, null, ae(a, (i) => R(Pt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            te(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(P, { key: 0 }, [
          R($l, null, {
            default: j(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(P, null, ae(s, (i) => R(Pt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              te(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: j(() => [
        de(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, CM = /* @__PURE__ */ z(k4, [["__scopeId", "data-v-dab0064d"]]);
function EM() {
  const e = M(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const AM = (e) => import(
  /* @vite-ignore */
  e
), $4 = 86400, Ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function x4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ss(t) - Ss(e)) / $4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function OM(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ss(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: x4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ya = 280, Qa = 240, Xa = 120, S4 = 6, _4 = 14, pn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function M4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Fr(e, t) {
  const n = Math.max(0, M4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function C4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${_4}px)` }), e.offsetHeight, e.style.transition = `height ${Ya}ms ${pn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Fr(t, e));
    const g = s() - i;
    if (!r && g >= Ya && (r = !0, e.style.transition = `opacity ${Qa}ms ease-out, transform ${Qa}ms ${pn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < Ya + Qa) return a(h);
    d();
  };
  return a(h), d;
}
function TM(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${S4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Xa}ms ease-out, transform ${Xa}ms ${pn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Fr(t, e)), s() - l < Xa) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const E4 = 140, jn = 220, xl = 5;
function IM({ gap: e = E4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, xl);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const g of d)
      g.el.style.display = g.display, i(g, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, g, y = C4) => {
    if (l || !h.pane || !h.follows()) return g();
    const w = { el: d, options: h, done: g, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, i(w, () => o = t(r, e));
    d.style.display = "none", n.push(w), n.length >= xl && c.flush();
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
function BM(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${jn}ms ${pn}, opacity ${jn}ms ease-in, margin ${jn}ms ${pn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, jn);
}
const Wr = "chat.pins.minimised", Gn = M(Qn(Wr, !1));
function Sl(e) {
  Gn.value = e, Ps(Wr, e);
}
function A4(e) {
  const t = A(() => e()), n = A(() => Gn.value ? [] : e()), a = () => Sl(!Gn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Sl(!1)
  ), { pins: t, visible: n, minimised: Gn, toggle: a };
}
const O4 = ["title"], T4 = {
  key: 0,
  class: "pins-count"
}, I4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = A4(() => t.pinRows);
    return (o, l) => L(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: K(["pins-toggle", { minimised: L(a), inline: e.inline }]),
      title: L(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => L(s) && L(s)(...i), ["stop"]))
    }, [
      R(me, {
        name: L(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      L(a) ? (u(), f("span", T4, v(L(n).length), 1)) : k("", !0)
    ], 10, O4)) : k("", !0);
  }
}, RM = /* @__PURE__ */ z(I4, [["__scopeId", "data-v-d073c504"]]), B4 = ["title"], R4 = ["title"], L4 = { class: "diff-card-dir" }, N4 = { class: "diff-card-name" }, q4 = ["title"], D4 = ["title"], P4 = {
  key: 0,
  class: "diff-card-note"
}, j4 = ["href"], F4 = ["src", "alt"], W4 = { class: "diff-card-rows" }, H4 = { class: "diff-row-num" }, z4 = { class: "diff-row-sign" }, U4 = { class: "diff-row-code" }, G4 = {
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
    function o(C) {
      (C.metaKey || C.ctrlKey) && (C.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = A(() => n.path.lastIndexOf("/") + 1), c = A(() => n.path.slice(0, r.value)), d = A(() => n.path.slice(r.value)), h = A(() => n.change === "deleted"), g = A(() => l[n.change]), y = A(() => new Set(n.rows.filter((C) => C.line_type === "add").map((C) => C.line))), w = M("after"), I = A(() => w.value === "before" ? n.whole.old : n.whole.text), _ = A(() => n.whole && n.whole.text !== void 0 ? I.value.split(`
`).map((C, b) => ({ line_type: w.value === "after" && y.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: C })) : n.rows.filter(
      (C) => !(n.editsOnly && ["ctx", "fold"].includes(C.line_type)) && !(n.hideRemovals && C.line_type === "del")
    )), $ = M(!1), B = A(() => n.lines && !$.value && !n.whole), H = A(() => B.value ? _.value.slice(0, n.lines) : _.value), D = A(() => _.value.length - H.value.length), T = (C) => C.line === null || C.line_type === "del" ? "" : C.line, G = (C) => C.line_type === "fold" ? C.hidden ? `⋯ ${C.hidden} lines` : "⋯" : C.text, F = M(null), q = M(null);
    let S = null;
    return xe(() => {
      if (!q.value) return;
      let C = !0;
      S = new ResizeObserver(() => {
        !F.value || !q.value || (F.value.style.transition = C ? "none" : "", F.value.style.height = `${q.value.offsetHeight}px`, C = !1);
      }), S.observe(q.value);
    }), Ie(() => S && S.disconnect()), (C, b) => (u(), f("section", {
      class: K(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${L(s)}-click to open it`,
          onClick: o
        }, [
          m("span", L4, v(c.value), 1),
          m("span", N4, v(d.value), 1),
          g.value ? (u(), f("span", {
            key: 0,
            class: K(["diff-card-badge", e.change])
          }, v(g.value), 3)) : k("", !0)
        ], 8, R4),
        m("span", {
          class: K(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: K(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        R(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: w.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = $e((p) => w.value = w.value === "after" ? "before" : "after", ["stop"]))
        }, v(w.value === "after" ? "After" : "Before"), 9, q4)) : k("", !0),
        h.value ? k("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: K(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = $e((p) => a("whole"), ["stop"]))
        }, [
          R(me, {
            name: "file",
            size: 12
          })
        ], 10, D4))
      ], 8, B4),
      e.whole && e.whole.error ? (u(), f("p", P4, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (u(), f(P, { key: 1 }, [
        e.picture ? (u(), f("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, F4)
        ], 8, j4)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: F,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", W4, [
              (u(!0), f(P, null, ae(H.value, (p, x) => (u(), f("div", {
                key: x,
                class: K(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", H4, v(T(p)), 1),
                m("span", z4, v(i[p.line_type]), 1),
                m("span", U4, v(G(p)), 1)
              ], 2))), 128)),
              D.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = $e((p) => $.value = !0, ["stop"]))
              }, v(D.value) + " more " + v(D.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, LM = /* @__PURE__ */ z(G4, [["__scopeId", "data-v-23581cbb"]]), V4 = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (u(), W(it(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: j(() => [
        de(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: K(["tip", e.place]),
          role: "tooltip"
        }, [
          de(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, NM = /* @__PURE__ */ z(V4, [["__scopeId", "data-v-683e1839"]]), K4 = { "data-queue-controls": "" }, Y4 = { class: "counts" }, Q4 = { "data-queue-spots": "" }, X4 = {
  class: "spots",
  "aria-label": "Places in use"
}, J4 = { "data-queue-waiting": "" }, Z4 = { key: 0 }, ex = { class: "control" }, tx = { class: "stepper" }, nx = ["disabled"], ax = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, sx = ["disabled"], ox = ["for"], lx = ["id", "value", "disabled", "onChange"], ix = { class: "control" }, rx = ["aria-checked", "disabled"], ux = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, cx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, dx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, fx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1), o = M("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", K4, [
      R(jt, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          te("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Y4, [
        m("div", null, [
          m("strong", Q4, [
            te(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", X4, [
            (u(!0), f(P, null, ae(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: K({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", J4, v(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", Z4, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", ex, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", tx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, nx),
          m("output", ax, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, sx)
        ])
      ]),
      (u(!0), f(P, null, ae(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, ox),
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
          onChange: (d) => l(c.key, d.target.value)
        }, null, 40, lx)
      ]))), 128)),
      m("div", ix, [
        r[7] || (r[7] = m("div", null, [
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
          onClick: r[2] || (r[2] = (c) => l(e.queue.main_spots_setting, e.queue.count_main_runs ? "off" : "on"))
        }, [...r[6] || (r[6] = [
          m("span", null, null, -1)
        ])], 8, rx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", ux, [
        R(me, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = te("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", cx, [
        R(me, {
          name: "pause",
          size: 13
        }),
        te("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (u(), f("p", dx, v(o.value), 1)) : k("", !0)
    ]));
  }
}, hx = /* @__PURE__ */ z(fx, [["__scopeId", "data-v-b594afa3"]]), mx = ["data-queue-row", "data-queue-process"], px = ["aria-expanded"], gx = { class: "run-line" }, vx = { class: "leading" }, yx = {
  key: 0,
  "data-queue-position": ""
}, bx = ["title"], wx = { class: "command" }, kx = {
  class: "time",
  "data-queue-time": ""
}, $x = { class: "details" }, xx = { "data-queue-type": "" }, Sx = { class: "failed" }, _x = { class: "drop-inner" }, Mx = { class: "output" }, Cx = { class: "output-heading" }, Ex = ["href"], Ax = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(), o = Zi((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = Vs(), r = A(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = A(() => {
      const g = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!g) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, w = Math.max(0, Math.floor((y - new Date(g).getTime()) / 1e3));
      return w < 60 ? `${w} s` : w < 3600 ? `${Math.floor(w / 60)} m ${w % 60} s` : `${Math.floor(w / 3600)} h ${String(Math.floor(w / 60) % 60).padStart(2, "0")} m`;
    });
    async function d() {
      if (!n.expanded) return;
      const g = s.value, y = g.scrollHeight - g.scrollTop - g.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (g.scrollTop = g.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return he(() => n.expanded, h, { immediate: !0 }), wn(["output.*"], d), (g, y) => (u(), f("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (w) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = xt($e((w) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = xt($e((w) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", gx, [
          m("span", vx, [
            e.run.section === "waiting" ? (u(), f("span", yx, v(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: K(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, bx))
          ]),
          m("code", wx, v(e.run.line), 1),
          m("span", kx, v(c.value), 1),
          R(me, {
            class: K(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", $x, [
          m("span", xx, v(r.value), 1),
          e.run.owner_agent_id ? (u(), f(P, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((w) => L(gt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(P, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (u(), f(P, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((w) => L(gt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (u(), f(P, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Sx, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, px),
      m("div", {
        class: K(["drop", { open: e.expanded }])
      }, [
        m("div", _x, [
          m("div", Mx, [
            m("div", Cx, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Ex)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (w) => e.expanded && L(o).loadEarlier(w.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              te(v(e.run.line), 1),
              L(l).length ? (u(), f(P, { key: 0 }, [
                te(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, mx));
  }
}, Ox = /* @__PURE__ */ z(Ax, [["__scopeId", "data-v-001561c5"]]), Tx = {
  class: "process-queue",
  "data-test-queue": ""
}, Ix = { class: "scroll" }, Bx = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Rx = ["data-queue-empty"], Ja = 20, Lx = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = M(null), a = M(""), s = M([]), o = M(Ja), l = A(() => {
      var g, y;
      return (((g = n.value) == null ? void 0 : g.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const r = A(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((w, I) => ({ key: `run:${w.id}`, run: w, position: I + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
    ]) : []);
    function c(g) {
      s.value = s.value.includes(g) ? s.value.filter((y) => y !== g) : [...s.value, g];
    }
    async function d() {
      const g = ++i, y = await t.read(o.value === Ja ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      g === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += Ja, d();
    }
    return wn(["process.*", "setting.*"], d), xe(d), (g, y) => (u(), f("article", Tx, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Ix, [
        a.value ? (u(), f("p", Bx, v(a.value), 1)) : k("", !0),
        n.value ? (u(), f(P, { key: 1 }, [
          R(hx, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          R(Ms, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), f(P, null, ae(r.value, (w) => (u(), f(P, {
                key: w.key
              }, [
                w.run ? (u(), W(Ox, {
                  key: 0,
                  run: w.run,
                  environment: n.value.environment_name,
                  position: w.position,
                  read: e.read,
                  expanded: s.value.includes(w.run.id),
                  onToggle: (I) => c(w.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : w.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": w.section.type
                }, v(w.section.empty), 9, Rx)) : (u(), W(jt, {
                  key: 2,
                  icon: w.section.icon,
                  count: w.section.rows.length,
                  "data-queue-heading": w.section.type
                }, {
                  default: j(() => [
                    te(v(w.section.heading), 1)
                  ]),
                  _: 2
                }, 1032, ["icon", "count", "data-queue-heading"]))
              ], 64))), 128))
            ]),
            _: 1
          }),
          l.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "older",
            "data-queue-older": "",
            onClick: h
          }, "Show older commands")) : k("", !0)
        ], 64)) : a.value ? k("", !0) : (u(), W(Ve, { key: 2 }))
      ])
    ]));
  }
}, qM = /* @__PURE__ */ z(Lx, [["__scopeId", "data-v-d9b6ef6b"]]), Nx = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, qx = ["aria-expanded"], Dx = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Px = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, jx = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, Fx = {
  __name: "InspectorLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    kinds: { type: Array, default: () => [] },
    open: Boolean,
    outsidePlan: Boolean,
    pageSize: { type: Number, default: 10 }
  },
  emits: ["open"],
  setup(e) {
    const t = e, n = M(t.open), a = M(0), s = M(0), o = M("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return he(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), wn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(P, null, [
      a.value ? (u(), f("section", Nx, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", Dx, v(a.value), 1),
          R(Gt, { open: n.value }, null, 8, ["open"])
        ], 8, qx),
        m("div", {
          class: K(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", Px, [
            R(Yc, {
              pinned: "",
              model: e.model,
              id: e.id,
              "document-id": e.documentId,
              read: e.read,
              changes: s.value,
              "outside-plan": e.outsidePlan,
              "page-size": e.pageSize,
              "only-kinds": e.kinds,
              "link-attribute": "data-inspector-link",
              onOpen: c[1] || (c[1] = (d) => r.$emit("open", d))
            }, null, 8, ["model", "id", "document-id", "read", "changes", "outside-plan", "page-size", "only-kinds"])
          ])) : k("", !0)
        ], 2)
      ])) : k("", !0),
      o.value ? (u(), f("p", jx, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Wx = /* @__PURE__ */ z(Fx, [["__scopeId", "data-v-479ab50f"]]), Hx = ["placeholder"], zx = { class: "actions" }, Ux = { class: "error" }, Gx = {
  key: 1,
  class: "card closed"
}, Vx = { class: "mark" }, Kx = { class: "prompt" }, Yx = {
  key: 0,
  class: "draft"
}, Qx = {
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
    const a = e, s = n, o = sn(e, "draft"), l = sn(e, "error"), i = M(!!l.value), r = M(!1), c = M(!1), d = M(null);
    async function h() {
      var w, I;
      i.value = !0, r.value = !1, await je(), (I = ((w = d.value) == null ? void 0 : w.querySelector("input")) || d.value) == null || I.focus();
    }
    function g() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const w = o.value.trim();
      if (!(!w || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(w), i.value = !1, r.value = !0;
        } catch (I) {
          o.value = w, l.value = I.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (w, I) => (u(), f("div", {
      class: K(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: xt(g, ["esc"])
      }, [
        de(w.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": I[0] || (I[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: I[1] || (I[1] = xt((_) => L(Ni)(_, y), ["enter"]))
        }, null, 40, Hx), [
          [Kn, o.value]
        ]),
        m("div", zx, [
          m("span", Ux, v(l.value), 1),
          R(pe, {
            small: "",
            onClick: g
          }, {
            default: j(() => [...I[3] || (I[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          R(pe, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...I[4] || (I[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", Gx, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", Vx, [
            R(me, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Kx, v(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", Yx, "Draft kept")) : k("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: I[2] || (I[2] = (_) => s("show"))
        }, [
          m("span", null, v(L(Xc)(e.count, "comment")), 1),
          R(me, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, Xx = /* @__PURE__ */ z(Qx, [["__scopeId", "data-v-b68baddd"]]), Jx = { wide: 1130 }, Zx = /\{([A-Za-z_]\w*)\}/g;
function Vn(e, t, n = {}) {
  return e.replace(Zx, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const e8 = (e, t, n, a) => Vn(e.label, n, { row_id: a, id: a }) || Ek(t, n, a), t8 = { class: "comment-side-head" }, n8 = {
  key: 0,
  class: "comment-none"
}, a8 = { key: 0 }, s8 = {
  key: 1,
  class: "comment-none"
}, o8 = {
  class: "comment",
  "data-comment": ""
}, l8 = {
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
      class: K(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", t8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        R(fa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", n8, "No comments yet")) : k("", !0),
      (u(!0), f(P, null, ae(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", a8, v(a.quote), 1)) : k("", !0),
        a.revision ? (u(), f("span", s8, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", o8, v(e.words(a)), 1)
      ]))), 128)),
      R(gn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, _l = /* @__PURE__ */ z(l8, [["__scopeId", "data-v-276284a3"]]), i8 = { class: "resource-heading" }, r8 = { class: "resource-type" }, u8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, c8 = {
  key: 1,
  class: "resource-abstract"
}, d8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", i8, [
      m("p", r8, v(e.label), 1),
      e.title ? (u(), f("h2", u8, v(e.title), 1)) : k("", !0),
      e.abstract ? (u(), f("p", c8, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, f8 = /* @__PURE__ */ z(d8, [["__scopeId", "data-v-e70bb004"]]), h8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, m8 = { class: "inspector-icons" }, p8 = { class: "inspector-icons-start" }, g8 = { class: "inspector-icons-end" }, v8 = ["href"], y8 = {
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
    const n = e, a = t, s = A(() => `${n.opened.table}:${n.opened.id}`), o = A(() => n.shareable && !n.readOnly), l = A(() => n.backed ? "Close all rows" : "Close");
    return (i, r) => (u(), f("header", h8, [
      m("div", m8, [
        m("span", p8, [
          e.backed ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: j(() => [
              R(me, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (u(), f(P, { key: 1 }, [
            R(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                R(me, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            R(pe, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: r[2] || (r[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                R(me, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        m("span", g8, [
          e.embedded ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => L(Ne)(s.value))
          }, {
            default: j(() => [
              R(me, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          o.value ? (u(), f("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this row",
            "aria-label": "Share this row",
            "data-resource-share": "",
            href: L(Lf)(s.value)
          }, [
            R(me, {
              name: "share",
              size: 13
            })
          ], 8, v8)) : k("", !0),
          e.embedded ? k("", !0) : (u(), W(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: j(() => [
              R(me, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      R(f8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, b8 = /* @__PURE__ */ z(y8, [["__scopeId", "data-v-51401f06"]]), w8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, k8 = { class: "field-name" }, $8 = {
  key: 1,
  class: "field-value"
}, x8 = ["onClick"], S8 = {
  key: 2,
  class: "field-value"
}, _8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", w8, [
      (u(!0), f(P, null, ae(e.fields, (o) => (u(), f(P, {
        key: o.name
      }, [
        m("p", k8, v(o.label), 1),
        o.isTime ? (u(), W(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", $8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, x8)
        ])) : (u(), f("p", S8, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, M8 = /* @__PURE__ */ z(_8, [["__scopeId", "data-v-7e45afb5"]]);
async function C8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? Ok(t, n.value) : "";
}
async function E8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? Ak(n.value, a.ok ? a.value : null) : "";
}
const A8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, O8 = {
  key: 1,
  class: "inspector-wait"
}, T8 = { class: "inspector-main" }, I8 = { class: "inspector-column" }, B8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, R8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, L8 = { class: "inspector-text" }, N8 = ["innerHTML"], q8 = {
  __name: "Inspector",
  props: {
    noun: { type: String, required: !0 },
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = A(() => n.catalogue.inspector(n.noun) ?? {
      reads: `${n.noun} show {row_id}`,
      label: "",
      title: "{title}",
      description: "",
      width: "small",
      components: [],
      comments: !1,
      events: [],
      links: { kinds: [], open: !1, outside_plan: !1, page_size: 10 },
      shareable: !1,
      lists_fields: !0,
      draws_text: !1
    }), l = M(null), i = M(""), r = M(""), c = M(""), d = M("details"), h = M(null), g = M(0);
    let y = 0;
    const w = A(() => ({ row_id: n.id, id: n.id })), I = A(() => l.value ? Vn(o.value.title, l.value, w.value) || Ck(n.noun, l.value, n.id) : ""), _ = A(() => l.value ? e8(o.value, n.noun, l.value, n.id) : ""), $ = A(() => _.value === I.value ? "" : _.value), B = A(() => l.value ? Vn(o.value.description, l.value, w.value) : ""), H = A(() => {
      var O, N, J;
      return ((O = l.value) == null ? void 0 : O.body) || ((N = l.value) == null ? void 0 : N.brief) || (s.has(n.noun) ? (J = l.value) == null ? void 0 : J.text : "") || "";
    }), D = A(() => H.value ? Fs(H.value, { env: "", rowNames: !1 }) : ""), T = A(() => Tk(l.value, H.value, i.value, r.value)), G = A(() => o.value.comments && g.value >= Jx.wide), F = A(() => o.value.comments && !G.value), q = (O) => o.value.components.filter((N) => (N.tab || "") === O).map((N) => N.window), S = A(() => [...new Set(o.value.components.map((O) => O.tab).filter(Boolean))]), C = A(() => S.value.length || F.value ? [{ key: "details", label: "Details" }, ...S.value.map((O) => ({ key: O, label: O })), ...F.value ? [{ key: "comments", label: "Comments" }] : []] : []), b = Wi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (O) => n.read(O));
    async function p(O, N) {
      const J = await N;
      return O === y ? J : "";
    }
    async function x() {
      const O = ++y, N = await n.read(Vn(o.value.reads, null, w.value).split(/\s+/).filter(Boolean));
      O === y && (c.value = N.ok ? "" : N.error, N.ok && (l.value = N.value, l.value.creator_id && (i.value = await p(O, E8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await p(O, C8(n.read, l.value)))));
    }
    he(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", x();
    }, { immediate: !0 }), wn(o.value.events, x), he(b.open, (O) => O && F.value && (d.value = "comments"));
    let E = null;
    return xe(() => {
      var O;
      g.value = ((O = h.value) == null ? void 0 : O.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (E = new ResizeObserver(() => g.value = h.value.clientWidth), E.observe(h.value));
    }), Ie(() => E == null ? void 0 : E.disconnect()), (O, N) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      R(b8, {
        label: $.value,
        title: I.value,
        description: B.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: N[0] || (N[0] = (J) => a("close")),
        onBack: N[1] || (N[1] = (J) => a("back")),
        onStep: N[2] || (N[2] = (J) => a("step", J))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", A8, v(c.value), 1)) : l.value ? (u(), f(P, { key: 2 }, [
        R(Qi, null, {
          default: j(() => [
            R(Ds, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: x
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", T8, [
          m("div", I8, [
            C.value.length ? (u(), f("div", B8, [
              R(Dt, {
                options: C.value,
                value: d.value,
                onPick: N[3] || (N[3] = (J) => d.value = J)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", R8, [
              R(zt, { value: d.value }, {
                details: j(() => [
                  m("div", L8, [
                    D.value && !o.value.draws_text ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: D.value
                    }, null, 8, N8)) : k("", !0),
                    o.value.lists_fields ? (u(), W(M8, {
                      key: 1,
                      fields: T.value,
                      onPeek: N[4] || (N[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  R(hs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  R(_l, {
                    below: "",
                    comments: L(b).comments.value,
                    words: L(b).words,
                    more: !!L(b).nextPage.value,
                    loading: L(b).loading.value,
                    failure: L(b).failure.value,
                    onMore: L(b).loadMore,
                    onClose: N[5] || (N[5] = (J) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: j(() => [
                  R(hs, {
                    names: q(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), W(Wx, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: N[6] || (N[6] = (J) => a("open", J))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : k("", !0)
            ]),
            o.value.comments ? (u(), W(Xx, {
              key: 1,
              send: L(b).send,
              count: L(b).total.value,
              onShow: N[7] || (N[7] = (J) => F.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          G.value ? (u(), W(_l, {
            key: 0,
            comments: L(b).comments.value,
            words: L(b).words,
            more: !!L(b).nextPage.value,
            loading: L(b).loading.value,
            failure: L(b).failure.value,
            onMore: L(b).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (u(), f("div", O8, [
        R(Ve)
      ]))
    ], 512));
  }
}, D8 = /* @__PURE__ */ z(q8, [["__scopeId", "data-v-e194a998"]]), DM = {
  __name: "HostedInspector",
  props: {
    noun: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    environment: { type: String, required: !0 },
    stepped: Boolean,
    embedded: Boolean,
    readOnly: Boolean
  },
  emits: ["step", "open", "close", "back"],
  setup(e) {
    const t = Me(Ls);
    return (n, a) => (u(), W(D8, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, P8 = { class: "facts" }, j8 = { class: "fact wide" }, F8 = ["title"], W8 = {
  key: 1,
  class: "fact-value"
}, H8 = {
  key: 0,
  class: "fact"
}, z8 = { class: "fact-value" }, U8 = { class: "fact" }, G8 = { class: "fact-label" }, V8 = ["title"], K8 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Y8 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Q8 = {
  key: 2,
  class: "fact"
}, X8 = { class: "fact-value" }, J8 = { class: "fact wide" }, Z8 = { class: "fact-label" }, e3 = { class: "fact wide" }, t3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, n3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ta.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var r, c;
      return u(), f("div", P8, [
        m("div", j8, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (d) => L(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, F8)) : (u(), f("span", W8, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", H8, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", z8, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (u(), f(P, { key: 1 }, [
          m("div", U8, [
            m("span", G8, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (d) => L(Ne)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, V8)
          ]),
          L(o).has(e.task.state) ? (u(), f("p", K8, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", Y8, v(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", Q8, [
          i[6] || (i[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", X8, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", J8, [
          m("span", Z8, [
            i[7] || (i[7] = te(" Complexity ", -1)),
            R(ti, {
              lines: L(Yi).map((d, h) => `${h + 1}: ${d}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          R(Dt, {
            options: L(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"])
        ]),
        m("div", e3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          R(Dt, {
            options: L(n),
            value: String(L(Ki)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", t3, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, a3 = /* @__PURE__ */ z(n3, [["__scopeId", "data-v-a8bf3e2c"]]);
function s3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const o3 = { class: "number" }, l3 = { class: "title" }, i3 = { class: "word" }, r3 = {
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
    return (a, s) => (u(), W(it(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: K(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        R(bn, { status: e.status }, null, 8, ["status"]),
        m("span", o3, v(e.number), 1),
        m("span", l3, v(e.title), 1),
        m("span", i3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Za = /* @__PURE__ */ z(r3, [["__scopeId", "data-v-f6417ae8"]]), u3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, c3 = { class: "level" }, d3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(!1);
    he(() => n.task.id, () => s.value = !1);
    const o = A(() => s3(n.task.id, n.graph)), l = A(() => s.value ? o.value.above : o.value.above.slice(-1)), i = A(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = A(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, g = !1) => ({ status: un(h.state), number: h.id, title: h.title, word: g ? "This task" : c(h.state), current: g });
    return (h, g) => o.value.above.length || o.value.below.length ? (u(), f("section", u3, [
      g[5] || (g[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(P, null, ae(l.value, (y) => (u(), f(P, {
        key: y.map((w) => w.id).join()
      }, [
        m("div", c3, [
          (u(!0), f(P, null, ae(y, (w) => (u(), W(Za, Pe({
            key: w.id,
            ref_for: !0
          }, d(w), {
            onSelect: g[0] || (g[0] = (I) => a("select", I))
          }), null, 16))), 128))
        ]),
        g[3] || (g[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      R(Za, tu(nu(d(e.task, !0))), null, 16),
      (u(!0), f(P, null, ae(i.value, (y) => (u(), f(P, {
        key: y.id
      }, [
        g[4] || (g[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        R(Za, Pe({ ref_for: !0 }, d(y), {
          onSelect: g[1] || (g[1] = (w) => a("select", w))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: g[2] || (g[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, f3 = /* @__PURE__ */ z(d3, [["__scopeId", "data-v-79c52417"]]), h3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, m3 = ["datetime"], p3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", h3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(P, null, ae(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, m3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, g3 = /* @__PURE__ */ z(p3, [["__scopeId", "data-v-b41f213b"]]), v3 = {
  class: "part",
  "data-resource-waits": ""
}, y3 = ["onClick"], b3 = { class: "wait-id" }, w3 = { class: "wait-title" }, k3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", v3, [
      m("h4", null, v(e.title), 1),
      (u(!0), f(P, null, ae(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        R(bn, {
          status: L(un)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", b3, v(o.id), 1),
        m("span", w3, v(o.title), 1)
      ], 8, y3))), 128))
    ]));
  }
}, Ml = /* @__PURE__ */ z(k3, [["__scopeId", "data-v-8fb2e251"]]), $3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, x3 = { class: "text" }, S3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, _3 = 180, M3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = M(!1), l = A(() => a.task.waits.filter((r) => !n.has(r.state))), i = A(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(P, null, [
      l.value.length ? (u(), W(Ml, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", $3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", x3, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (u(), f("section", S3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: K(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > _3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (u(), W(Ml, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, C3 = /* @__PURE__ */ z(M3, [["__scopeId", "data-v-4a3f1e79"]]), E3 = {
  class: "task-details",
  "data-task-details": ""
}, A3 = { class: "since" }, O3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, T3 = { class: "text" }, I3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, B3 = {
  key: 1,
  class: "note"
}, R3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, L3 = { class: "text" }, N3 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", E3, [
        m("div", {
          class: K(["state-line", L(un)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            R(bn, {
              status: L(un)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + v(a(e.task.state)), 1)
          ]),
          m("span", A3, [
            o[5] || (o[5] = te(" since ", -1)),
            R(Ze, {
              at: L(fh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", O3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", T3, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", I3, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", B3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", R3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", L3, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (u(), W(f3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        R(a3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        R(C3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        R(g3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, PM = /* @__PURE__ */ z(N3, [["__scopeId", "data-v-7e73fa21"]]), q3 = 50, D3 = { messages: 25 }, P3 = (e) => D3[e] || q3, j3 = {
  class: "task-log",
  "aria-label": "Task log"
}, F3 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, W3 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, H3 = { class: "entries" }, z3 = ["data-task-log-important"], U3 = ["datetime"], G3 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, V3 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = M([]), a = M(1), s = M(!0), o = M(!0), l = M("");
    let i = 0;
    async function r(c = 1) {
      const d = ++i;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(P3("task_logs")),
        "--page",
        String(c)
      ]);
      d === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], r();
      },
      { immediate: !0 }
    ), et(() => {
      i += 1;
    }), (c, d) => (u(), f("section", j3, [
      o.value ? (u(), W(Ve, { key: 0 })) : l.value ? (u(), f(P, { key: 1 }, [
        m("p", F3, v(l.value), 1),
        R(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(P, { key: 2 }, [
        n.value.length ? k("", !0) : (u(), f("p", W3, "No log entries yet.")),
        m("ol", H3, [
          (u(!0), f(P, null, ae(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: K(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, U3),
            m("p", null, v(h.line), 1)
          ], 10, z3))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", G3, [
          R(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              te("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          R(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              te("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, jM = /* @__PURE__ */ z(V3, [["__scopeId", "data-v-cfa43bf1"]]);
function K3(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var es = { exports: {} }, Cl;
function Y3() {
  return Cl || (Cl = 1, (function(e, t) {
    var n = (function() {
      var a = function(T, G) {
        var F = 236, q = 17, S = T, C = o[G], b = null, p = 0, x = null, E = [], O = {}, N = function(V, Y) {
          p = S * 4 + 17, b = (function(U) {
            for (var Q = new Array(U), X = 0; X < U; X += 1) {
              Q[X] = new Array(U);
              for (var se = 0; se < U; se += 1)
                Q[X][se] = null;
            }
            return Q;
          })(p), J(0, 0), J(p - 7, 0), J(0, p - 7), ge(), le(), oe(V, Y), S >= 7 && Ae(V), x == null && (x = De(S, C, E)), Z(x, Y);
        }, J = function(V, Y) {
          for (var U = -1; U <= 7; U += 1)
            if (!(V + U <= -1 || p <= V + U))
              for (var Q = -1; Q <= 7; Q += 1)
                Y + Q <= -1 || p <= Y + Q || (0 <= U && U <= 6 && (Q == 0 || Q == 6) || 0 <= Q && Q <= 6 && (U == 0 || U == 6) || 2 <= U && U <= 4 && 2 <= Q && Q <= 4 ? b[V + U][Y + Q] = !0 : b[V + U][Y + Q] = !1);
        }, ne = function() {
          for (var V = 0, Y = 0, U = 0; U < 8; U += 1) {
            N(!0, U);
            var Q = i.getLostPoint(O);
            (U == 0 || V > Q) && (V = Q, Y = U);
          }
          return Y;
        }, le = function() {
          for (var V = 8; V < p - 8; V += 1)
            b[V][6] == null && (b[V][6] = V % 2 == 0);
          for (var Y = 8; Y < p - 8; Y += 1)
            b[6][Y] == null && (b[6][Y] = Y % 2 == 0);
        }, ge = function() {
          for (var V = i.getPatternPosition(S), Y = 0; Y < V.length; Y += 1)
            for (var U = 0; U < V.length; U += 1) {
              var Q = V[Y], X = V[U];
              if (b[Q][X] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ue = -2; ue <= 2; ue += 1)
                    se == -2 || se == 2 || ue == -2 || ue == 2 || se == 0 && ue == 0 ? b[Q + se][X + ue] = !0 : b[Q + se][X + ue] = !1;
            }
        }, Ae = function(V) {
          for (var Y = i.getBCHTypeNumber(S), U = 0; U < 18; U += 1) {
            var Q = !V && (Y >> U & 1) == 1;
            b[Math.floor(U / 3)][U % 3 + p - 8 - 3] = Q;
          }
          for (var U = 0; U < 18; U += 1) {
            var Q = !V && (Y >> U & 1) == 1;
            b[U % 3 + p - 8 - 3][Math.floor(U / 3)] = Q;
          }
        }, oe = function(V, Y) {
          for (var U = C << 3 | Y, Q = i.getBCHTypeInfo(U), X = 0; X < 15; X += 1) {
            var se = !V && (Q >> X & 1) == 1;
            X < 6 ? b[X][8] = se : X < 8 ? b[X + 1][8] = se : b[p - 15 + X][8] = se;
          }
          for (var X = 0; X < 15; X += 1) {
            var se = !V && (Q >> X & 1) == 1;
            X < 8 ? b[8][p - X - 1] = se : X < 9 ? b[8][15 - X - 1 + 1] = se : b[8][15 - X - 1] = se;
          }
          b[p - 8][8] = !V;
        }, Z = function(V, Y) {
          for (var U = -1, Q = p - 1, X = 7, se = 0, ue = i.getMaskFunction(Y), re = p - 1; re > 0; re -= 2)
            for (re == 6 && (re -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (b[Q][re - ke] == null) {
                  var Ce = !1;
                  se < V.length && (Ce = (V[se] >>> X & 1) == 1);
                  var fe = ue(Q, re - ke);
                  fe && (Ce = !Ce), b[Q][re - ke] = Ce, X -= 1, X == -1 && (se += 1, X = 7);
                }
              if (Q += U, Q < 0 || p <= Q) {
                Q -= U, U = -U;
                break;
              }
            }
        }, ee = function(V, Y) {
          for (var U = 0, Q = 0, X = 0, se = new Array(Y.length), ue = new Array(Y.length), re = 0; re < Y.length; re += 1) {
            var ke = Y[re].dataCount, Ce = Y[re].totalCount - ke;
            Q = Math.max(Q, ke), X = Math.max(X, Ce), se[re] = new Array(ke);
            for (var fe = 0; fe < se[re].length; fe += 1)
              se[re][fe] = 255 & V.getBuffer()[fe + U];
            U += ke;
            var Fe = i.getErrorCorrectPolynomial(Ce), We = c(se[re], Fe.getLength() - 1), io = We.mod(Fe);
            ue[re] = new Array(Fe.getLength() - 1);
            for (var fe = 0; fe < ue[re].length; fe += 1) {
              var ro = fe + io.getLength() - ue[re].length;
              ue[re][fe] = ro >= 0 ? io.getAt(ro) : 0;
            }
          }
          for (var uo = 0, fe = 0; fe < Y.length; fe += 1)
            uo += Y[fe].totalCount;
          for (var wa = new Array(uo), Mn = 0, fe = 0; fe < Q; fe += 1)
            for (var re = 0; re < Y.length; re += 1)
              fe < se[re].length && (wa[Mn] = se[re][fe], Mn += 1);
          for (var fe = 0; fe < X; fe += 1)
            for (var re = 0; re < Y.length; re += 1)
              fe < ue[re].length && (wa[Mn] = ue[re][fe], Mn += 1);
          return wa;
        }, De = function(V, Y, U) {
          for (var Q = d.getRSBlocks(V, Y), X = h(), se = 0; se < U.length; se += 1) {
            var ue = U[se];
            X.put(ue.getMode(), 4), X.put(ue.getLength(), i.getLengthInBits(ue.getMode(), V)), ue.write(X);
          }
          for (var re = 0, se = 0; se < Q.length; se += 1)
            re += Q[se].dataCount;
          if (X.getLengthInBits() > re * 8)
            throw "code length overflow. (" + X.getLengthInBits() + ">" + re * 8 + ")";
          for (X.getLengthInBits() + 4 <= re * 8 && X.put(0, 4); X.getLengthInBits() % 8 != 0; )
            X.putBit(!1);
          for (; !(X.getLengthInBits() >= re * 8 || (X.put(F, 8), X.getLengthInBits() >= re * 8)); )
            X.put(q, 8);
          return ee(X, Q);
        };
        O.addData = function(V, Y) {
          Y = Y || "Byte";
          var U = null;
          switch (Y) {
            case "Numeric":
              U = g(V);
              break;
            case "Alphanumeric":
              U = y(V);
              break;
            case "Byte":
              U = w(V);
              break;
            case "Kanji":
              U = I(V);
              break;
            default:
              throw "mode:" + Y;
          }
          E.push(U), x = null;
        }, O.isDark = function(V, Y) {
          if (V < 0 || p <= V || Y < 0 || p <= Y)
            throw V + "," + Y;
          return b[V][Y];
        }, O.getModuleCount = function() {
          return p;
        }, O.make = function() {
          if (S < 1) {
            for (var V = 1; V < 40; V++) {
              for (var Y = d.getRSBlocks(V, C), U = h(), Q = 0; Q < E.length; Q++) {
                var X = E[Q];
                U.put(X.getMode(), 4), U.put(X.getLength(), i.getLengthInBits(X.getMode(), V)), X.write(U);
              }
              for (var se = 0, Q = 0; Q < Y.length; Q++)
                se += Y[Q].dataCount;
              if (U.getLengthInBits() <= se * 8)
                break;
            }
            S = V;
          }
          N(!1, ne());
        }, O.createTableTag = function(V, Y) {
          V = V || 2, Y = typeof Y > "u" ? V * 4 : Y;
          var U = "";
          U += '<table style="', U += " border-width: 0px; border-style: none;", U += " border-collapse: collapse;", U += " padding: 0px; margin: " + Y + "px;", U += '">', U += "<tbody>";
          for (var Q = 0; Q < O.getModuleCount(); Q += 1) {
            U += "<tr>";
            for (var X = 0; X < O.getModuleCount(); X += 1)
              U += '<td style="', U += " border-width: 0px; border-style: none;", U += " border-collapse: collapse;", U += " padding: 0px; margin: 0px;", U += " width: " + V + "px;", U += " height: " + V + "px;", U += " background-color: ", U += O.isDark(Q, X) ? "#000000" : "#ffffff", U += ";", U += '"/>';
            U += "</tr>";
          }
          return U += "</tbody>", U += "</table>", U;
        }, O.createSvgTag = function(V, Y, U, Q) {
          var X = {};
          typeof arguments[0] == "object" && (X = arguments[0], V = X.cellSize, Y = X.margin, U = X.alt, Q = X.title), V = V || 2, Y = typeof Y > "u" ? V * 4 : Y, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-description" : null, Q = typeof Q == "string" ? { text: Q } : Q || {}, Q.text = Q.text || null, Q.id = Q.text ? Q.id || "qrcode-title" : null;
          var se = O.getModuleCount() * V + Y * 2, ue, re, ke, Ce, fe = "", Fe;
          for (Fe = "l" + V + ",0 0," + V + " -" + V + ",0 0,-" + V + "z ", fe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', fe += X.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', fe += ' viewBox="0 0 ' + se + " " + se + '" ', fe += ' preserveAspectRatio="xMinYMin meet"', fe += Q.text || U.text ? ' role="img" aria-labelledby="' + Et([Q.id, U.id].join(" ").trim()) + '"' : "", fe += ">", fe += Q.text ? '<title id="' + Et(Q.id) + '">' + Et(Q.text) + "</title>" : "", fe += U.text ? '<description id="' + Et(U.id) + '">' + Et(U.text) + "</description>" : "", fe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', fe += '<path d="', ke = 0; ke < O.getModuleCount(); ke += 1)
            for (Ce = ke * V + Y, ue = 0; ue < O.getModuleCount(); ue += 1)
              O.isDark(ke, ue) && (re = ue * V + Y, fe += "M" + re + "," + Ce + Fe);
          return fe += '" stroke="transparent" fill="black"/>', fe += "</svg>", fe;
        }, O.createDataURL = function(V, Y) {
          V = V || 2, Y = typeof Y > "u" ? V * 4 : Y;
          var U = O.getModuleCount() * V + Y * 2, Q = Y, X = U - Y;
          return D(U, U, function(se, ue) {
            if (Q <= se && se < X && Q <= ue && ue < X) {
              var re = Math.floor((se - Q) / V), ke = Math.floor((ue - Q) / V);
              return O.isDark(ke, re) ? 0 : 1;
            } else
              return 1;
          });
        }, O.createImgTag = function(V, Y, U) {
          V = V || 2, Y = typeof Y > "u" ? V * 4 : Y;
          var Q = O.getModuleCount() * V + Y * 2, X = "";
          return X += "<img", X += ' src="', X += O.createDataURL(V, Y), X += '"', X += ' width="', X += Q, X += '"', X += ' height="', X += Q, X += '"', U && (X += ' alt="', X += Et(U), X += '"'), X += "/>", X;
        };
        var Et = function(V) {
          for (var Y = "", U = 0; U < V.length; U += 1) {
            var Q = V.charAt(U);
            switch (Q) {
              case "<":
                Y += "&lt;";
                break;
              case ">":
                Y += "&gt;";
                break;
              case "&":
                Y += "&amp;";
                break;
              case '"':
                Y += "&quot;";
                break;
              default:
                Y += Q;
                break;
            }
          }
          return Y;
        }, Hr = function(V) {
          var Y = 1;
          V = typeof V > "u" ? Y * 2 : V;
          var U = O.getModuleCount() * Y + V * 2, Q = V, X = U - V, se, ue, re, ke, Ce, fe = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Fe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, We = "";
          for (se = 0; se < U; se += 2) {
            for (re = Math.floor((se - Q) / Y), ke = Math.floor((se + 1 - Q) / Y), ue = 0; ue < U; ue += 1)
              Ce = "█", Q <= ue && ue < X && Q <= se && se < X && O.isDark(re, Math.floor((ue - Q) / Y)) && (Ce = " "), Q <= ue && ue < X && Q <= se + 1 && se + 1 < X && O.isDark(ke, Math.floor((ue - Q) / Y)) ? Ce += " " : Ce += "█", We += V < 1 && se + 1 >= X ? Fe[Ce] : fe[Ce];
            We += `
`;
          }
          return U % 2 && V > 0 ? We.substring(0, We.length - U - 1) + Array(U + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return O.createASCII = function(V, Y) {
          if (V = V || 1, V < 2)
            return Hr(Y);
          V -= 1, Y = typeof Y > "u" ? V * 2 : Y;
          var U = O.getModuleCount() * V + Y * 2, Q = Y, X = U - Y, se, ue, re, ke, Ce = Array(V + 1).join("██"), fe = Array(V + 1).join("  "), Fe = "", We = "";
          for (se = 0; se < U; se += 1) {
            for (re = Math.floor((se - Q) / V), We = "", ue = 0; ue < U; ue += 1)
              ke = 1, Q <= ue && ue < X && Q <= se && se < X && O.isDark(re, Math.floor((ue - Q) / V)) && (ke = 0), We += ke ? Ce : fe;
            for (re = 0; re < V; re += 1)
              Fe += We + `
`;
          }
          return Fe.substring(0, Fe.length - 1);
        }, O.renderTo2dContext = function(V, Y) {
          Y = Y || 2;
          for (var U = O.getModuleCount(), Q = 0; Q < U; Q++)
            for (var X = 0; X < U; X++)
              V.fillStyle = O.isDark(Q, X) ? "black" : "white", V.fillRect(Q * Y, X * Y, Y, Y);
        }, O;
      };
      a.stringToBytesFuncs = {
        default: function(T) {
          for (var G = [], F = 0; F < T.length; F += 1) {
            var q = T.charCodeAt(F);
            G.push(q & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(T, G) {
        var F = (function() {
          for (var S = B(T), C = function() {
            var le = S.read();
            if (le == -1) throw "eof";
            return le;
          }, b = 0, p = {}; ; ) {
            var x = S.read();
            if (x == -1) break;
            var E = C(), O = C(), N = C(), J = String.fromCharCode(x << 8 | E), ne = O << 8 | N;
            p[J] = ne, b += 1;
          }
          if (b != G)
            throw b + " != " + G;
          return p;
        })(), q = 63;
        return function(S) {
          for (var C = [], b = 0; b < S.length; b += 1) {
            var p = S.charCodeAt(b);
            if (p < 128)
              C.push(p);
            else {
              var x = F[S.charAt(b)];
              typeof x == "number" ? (x & 255) == x ? C.push(x) : (C.push(x >>> 8), C.push(x & 255)) : C.push(q);
            }
          }
          return C;
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
        ], G = 1335, F = 7973, q = 21522, S = {}, C = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return S.getBCHTypeInfo = function(b) {
          for (var p = b << 10; C(p) - C(G) >= 0; )
            p ^= G << C(p) - C(G);
          return (b << 10 | p) ^ q;
        }, S.getBCHTypeNumber = function(b) {
          for (var p = b << 12; C(p) - C(F) >= 0; )
            p ^= F << C(p) - C(F);
          return b << 12 | p;
        }, S.getPatternPosition = function(b) {
          return T[b - 1];
        }, S.getMaskFunction = function(b) {
          switch (b) {
            case l.PATTERN000:
              return function(p, x) {
                return (p + x) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, x) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, x) {
                return x % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, x) {
                return (p + x) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, x) {
                return (Math.floor(p / 2) + Math.floor(x / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, x) {
                return p * x % 2 + p * x % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, x) {
                return (p * x % 2 + p * x % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, x) {
                return (p * x % 3 + (p + x) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, S.getErrorCorrectPolynomial = function(b) {
          for (var p = c([1], 0), x = 0; x < b; x += 1)
            p = p.multiply(c([1, r.gexp(x)], 0));
          return p;
        }, S.getLengthInBits = function(b, p) {
          if (1 <= p && p < 10)
            switch (b) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + b;
            }
          else if (p < 27)
            switch (b) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + b;
            }
          else if (p < 41)
            switch (b) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + b;
            }
          else
            throw "type:" + p;
        }, S.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), x = 0, E = 0; E < p; E += 1)
            for (var O = 0; O < p; O += 1) {
              for (var N = 0, J = b.isDark(E, O), ne = -1; ne <= 1; ne += 1)
                if (!(E + ne < 0 || p <= E + ne))
                  for (var le = -1; le <= 1; le += 1)
                    O + le < 0 || p <= O + le || ne == 0 && le == 0 || J == b.isDark(E + ne, O + le) && (N += 1);
              N > 5 && (x += 3 + N - 5);
            }
          for (var E = 0; E < p - 1; E += 1)
            for (var O = 0; O < p - 1; O += 1) {
              var ge = 0;
              b.isDark(E, O) && (ge += 1), b.isDark(E + 1, O) && (ge += 1), b.isDark(E, O + 1) && (ge += 1), b.isDark(E + 1, O + 1) && (ge += 1), (ge == 0 || ge == 4) && (x += 3);
            }
          for (var E = 0; E < p; E += 1)
            for (var O = 0; O < p - 6; O += 1)
              b.isDark(E, O) && !b.isDark(E, O + 1) && b.isDark(E, O + 2) && b.isDark(E, O + 3) && b.isDark(E, O + 4) && !b.isDark(E, O + 5) && b.isDark(E, O + 6) && (x += 40);
          for (var O = 0; O < p; O += 1)
            for (var E = 0; E < p - 6; E += 1)
              b.isDark(E, O) && !b.isDark(E + 1, O) && b.isDark(E + 2, O) && b.isDark(E + 3, O) && b.isDark(E + 4, O) && !b.isDark(E + 5, O) && b.isDark(E + 6, O) && (x += 40);
          for (var Ae = 0, O = 0; O < p; O += 1)
            for (var E = 0; E < p; E += 1)
              b.isDark(E, O) && (Ae += 1);
          var oe = Math.abs(100 * Ae / p / p - 50) / 5;
          return x += oe * 10, x;
        }, S;
      })(), r = (function() {
        for (var T = new Array(256), G = new Array(256), F = 0; F < 8; F += 1)
          T[F] = 1 << F;
        for (var F = 8; F < 256; F += 1)
          T[F] = T[F - 4] ^ T[F - 5] ^ T[F - 6] ^ T[F - 8];
        for (var F = 0; F < 255; F += 1)
          G[T[F]] = F;
        var q = {};
        return q.glog = function(S) {
          if (S < 1)
            throw "glog(" + S + ")";
          return G[S];
        }, q.gexp = function(S) {
          for (; S < 0; )
            S += 255;
          for (; S >= 256; )
            S -= 255;
          return T[S];
        }, q;
      })();
      function c(T, G) {
        if (typeof T.length > "u")
          throw T.length + "/" + G;
        var F = (function() {
          for (var S = 0; S < T.length && T[S] == 0; )
            S += 1;
          for (var C = new Array(T.length - S + G), b = 0; b < T.length - S; b += 1)
            C[b] = T[b + S];
          return C;
        })(), q = {};
        return q.getAt = function(S) {
          return F[S];
        }, q.getLength = function() {
          return F.length;
        }, q.multiply = function(S) {
          for (var C = new Array(q.getLength() + S.getLength() - 1), b = 0; b < q.getLength(); b += 1)
            for (var p = 0; p < S.getLength(); p += 1)
              C[b + p] ^= r.gexp(r.glog(q.getAt(b)) + r.glog(S.getAt(p)));
          return c(C, 0);
        }, q.mod = function(S) {
          if (q.getLength() - S.getLength() < 0)
            return q;
          for (var C = r.glog(q.getAt(0)) - r.glog(S.getAt(0)), b = new Array(q.getLength()), p = 0; p < q.getLength(); p += 1)
            b[p] = q.getAt(p);
          for (var p = 0; p < S.getLength(); p += 1)
            b[p] ^= r.gexp(r.glog(S.getAt(p)) + C);
          return c(b, 0).mod(S);
        }, q;
      }
      var d = (function() {
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
        ], G = function(S, C) {
          var b = {};
          return b.totalCount = S, b.dataCount = C, b;
        }, F = {}, q = function(S, C) {
          switch (C) {
            case o.L:
              return T[(S - 1) * 4 + 0];
            case o.M:
              return T[(S - 1) * 4 + 1];
            case o.Q:
              return T[(S - 1) * 4 + 2];
            case o.H:
              return T[(S - 1) * 4 + 3];
            default:
              return;
          }
        };
        return F.getRSBlocks = function(S, C) {
          var b = q(S, C);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + C;
          for (var p = b.length / 3, x = [], E = 0; E < p; E += 1)
            for (var O = b[E * 3 + 0], N = b[E * 3 + 1], J = b[E * 3 + 2], ne = 0; ne < O; ne += 1)
              x.push(G(N, J));
          return x;
        }, F;
      })(), h = function() {
        var T = [], G = 0, F = {};
        return F.getBuffer = function() {
          return T;
        }, F.getAt = function(q) {
          var S = Math.floor(q / 8);
          return (T[S] >>> 7 - q % 8 & 1) == 1;
        }, F.put = function(q, S) {
          for (var C = 0; C < S; C += 1)
            F.putBit((q >>> S - C - 1 & 1) == 1);
        }, F.getLengthInBits = function() {
          return G;
        }, F.putBit = function(q) {
          var S = Math.floor(G / 8);
          T.length <= S && T.push(0), q && (T[S] |= 128 >>> G % 8), G += 1;
        }, F;
      }, g = function(T) {
        var G = s.MODE_NUMBER, F = T, q = {};
        q.getMode = function() {
          return G;
        }, q.getLength = function(b) {
          return F.length;
        }, q.write = function(b) {
          for (var p = F, x = 0; x + 2 < p.length; )
            b.put(S(p.substring(x, x + 3)), 10), x += 3;
          x < p.length && (p.length - x == 1 ? b.put(S(p.substring(x, x + 1)), 4) : p.length - x == 2 && b.put(S(p.substring(x, x + 2)), 7));
        };
        var S = function(b) {
          for (var p = 0, x = 0; x < b.length; x += 1)
            p = p * 10 + C(b.charAt(x));
          return p;
        }, C = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return q;
      }, y = function(T) {
        var G = s.MODE_ALPHA_NUM, F = T, q = {};
        q.getMode = function() {
          return G;
        }, q.getLength = function(C) {
          return F.length;
        }, q.write = function(C) {
          for (var b = F, p = 0; p + 1 < b.length; )
            C.put(
              S(b.charAt(p)) * 45 + S(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && C.put(S(b.charAt(p)), 6);
        };
        var S = function(C) {
          if ("0" <= C && C <= "9")
            return C.charCodeAt(0) - 48;
          if ("A" <= C && C <= "Z")
            return C.charCodeAt(0) - 65 + 10;
          switch (C) {
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
              throw "illegal char :" + C;
          }
        };
        return q;
      }, w = function(T) {
        var G = s.MODE_8BIT_BYTE, F = a.stringToBytes(T), q = {};
        return q.getMode = function() {
          return G;
        }, q.getLength = function(S) {
          return F.length;
        }, q.write = function(S) {
          for (var C = 0; C < F.length; C += 1)
            S.put(F[C], 8);
        }, q;
      }, I = function(T) {
        var G = s.MODE_KANJI, F = a.stringToBytesFuncs.SJIS;
        if (!F)
          throw "sjis not supported.";
        (function(C, b) {
          var p = F(C);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var q = F(T), S = {};
        return S.getMode = function() {
          return G;
        }, S.getLength = function(C) {
          return ~~(q.length / 2);
        }, S.write = function(C) {
          for (var b = q, p = 0; p + 1 < b.length; ) {
            var x = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= x && x <= 40956)
              x -= 33088;
            else if (57408 <= x && x <= 60351)
              x -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + x;
            x = (x >>> 8 & 255) * 192 + (x & 255), C.put(x, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, S;
      }, _ = function() {
        var T = [], G = {};
        return G.writeByte = function(F) {
          T.push(F & 255);
        }, G.writeShort = function(F) {
          G.writeByte(F), G.writeByte(F >>> 8);
        }, G.writeBytes = function(F, q, S) {
          q = q || 0, S = S || F.length;
          for (var C = 0; C < S; C += 1)
            G.writeByte(F[C + q]);
        }, G.writeString = function(F) {
          for (var q = 0; q < F.length; q += 1)
            G.writeByte(F.charCodeAt(q));
        }, G.toByteArray = function() {
          return T;
        }, G.toString = function() {
          var F = "";
          F += "[";
          for (var q = 0; q < T.length; q += 1)
            q > 0 && (F += ","), F += T[q];
          return F += "]", F;
        }, G;
      }, $ = function() {
        var T = 0, G = 0, F = 0, q = "", S = {}, C = function(p) {
          q += String.fromCharCode(b(p & 63));
        }, b = function(p) {
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
          for (T = T << 8 | p & 255, G += 8, F += 1; G >= 6; )
            C(T >>> G - 6), G -= 6;
        }, S.flush = function() {
          if (G > 0 && (C(T << 6 - G), T = 0, G = 0), F % 3 != 0)
            for (var p = 3 - F % 3, x = 0; x < p; x += 1)
              q += "=";
        }, S.toString = function() {
          return q;
        }, S;
      }, B = function(T) {
        var G = T, F = 0, q = 0, S = 0, C = {};
        C.read = function() {
          for (; S < 8; ) {
            if (F >= G.length) {
              if (S == 0)
                return -1;
              throw "unexpected end of file./" + S;
            }
            var p = G.charAt(F);
            if (F += 1, p == "=")
              return S = 0, -1;
            if (p.match(/^\s$/))
              continue;
            q = q << 6 | b(p.charCodeAt(0)), S += 6;
          }
          var x = q >>> S - 8 & 255;
          return S -= 8, x;
        };
        var b = function(p) {
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
        return C;
      }, H = function(T, G) {
        var F = T, q = G, S = new Array(T * G), C = {};
        C.setPixel = function(E, O, N) {
          S[O * F + E] = N;
        }, C.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(F), E.writeShort(q), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(F), E.writeShort(q), E.writeByte(0);
          var O = 2, N = p(O);
          E.writeByte(O);
          for (var J = 0; N.length - J > 255; )
            E.writeByte(255), E.writeBytes(N, J, 255), J += 255;
          E.writeByte(N.length - J), E.writeBytes(N, J, N.length - J), E.writeByte(0), E.writeString(";");
        };
        var b = function(E) {
          var O = E, N = 0, J = 0, ne = {};
          return ne.write = function(le, ge) {
            if (le >>> ge)
              throw "length over";
            for (; N + ge >= 8; )
              O.writeByte(255 & (le << N | J)), ge -= 8 - N, le >>>= 8 - N, J = 0, N = 0;
            J = le << N | J, N = N + ge;
          }, ne.flush = function() {
            N > 0 && O.writeByte(J);
          }, ne;
        }, p = function(E) {
          for (var O = 1 << E, N = (1 << E) + 1, J = E + 1, ne = x(), le = 0; le < O; le += 1)
            ne.add(String.fromCharCode(le));
          ne.add(String.fromCharCode(O)), ne.add(String.fromCharCode(N));
          var ge = _(), Ae = b(ge);
          Ae.write(O, J);
          var oe = 0, Z = String.fromCharCode(S[oe]);
          for (oe += 1; oe < S.length; ) {
            var ee = String.fromCharCode(S[oe]);
            oe += 1, ne.contains(Z + ee) ? Z = Z + ee : (Ae.write(ne.indexOf(Z), J), ne.size() < 4095 && (ne.size() == 1 << J && (J += 1), ne.add(Z + ee)), Z = ee);
          }
          return Ae.write(ne.indexOf(Z), J), Ae.write(N, J), Ae.flush(), ge.toByteArray();
        }, x = function() {
          var E = {}, O = 0, N = {};
          return N.add = function(J) {
            if (N.contains(J))
              throw "dup key:" + J;
            E[J] = O, O += 1;
          }, N.size = function() {
            return O;
          }, N.indexOf = function(J) {
            return E[J];
          }, N.contains = function(J) {
            return typeof E[J] < "u";
          }, N;
        };
        return C;
      }, D = function(T, G, F) {
        for (var q = H(T, G), S = 0; S < G; S += 1)
          for (var C = 0; C < T; C += 1)
            q.setPixel(C, S, F(C, S));
        var b = _();
        q.write(b);
        for (var p = $(), x = b.toByteArray(), E = 0; E < x.length; E += 1)
          p.writeByte(x[E]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], i = 0; i < o.length; i++) {
            var r = o.charCodeAt(i);
            r < 128 ? l.push(r) : r < 2048 ? l.push(
              192 | r >> 6,
              128 | r & 63
            ) : r < 55296 || r >= 57344 ? l.push(
              224 | r >> 12,
              128 | r >> 6 & 63,
              128 | r & 63
            ) : (i++, r = 65536 + ((r & 1023) << 10 | o.charCodeAt(i) & 1023), l.push(
              240 | r >> 18,
              128 | r >> 12 & 63,
              128 | r >> 6 & 63,
              128 | r & 63
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
  })(es)), es.exports;
}
var Q3 = Y3();
const X3 = /* @__PURE__ */ K3(Q3), J3 = ["width", "height", "viewBox"], Z3 = ["width", "height"], eS = ["d"], tS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = A(() => {
      const a = X3(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let i = 0; i < s; i += 1)
          a.isDark(l, i) && o.push(`M${i + 4} ${l + 4}h1v1h-1z`);
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
      m("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, Z3),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, eS)
    ], 8, J3));
  }
}, FM = /* @__PURE__ */ z(tS, [["__scopeId", "data-v-489f0852"]]), nS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      de(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, WM = /* @__PURE__ */ z(nS, [["__scopeId", "data-v-47e67f04"]]);
function HM(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const zM = au(() => import("./VoiceFigure-pDJ1HjHU.js").then((e) => e.V)), UM = "1.2.0", GM = "3.5";
export {
  Tf as $,
  Ee as A,
  Te as B,
  ga as C,
  rt as D,
  G_ as E,
  t$ as F,
  N6 as G,
  W_ as H,
  L5 as I,
  r$ as J,
  Ct as K,
  lS as L,
  to as M,
  m$ as N,
  i$ as O,
  pa as P,
  r_ as Q,
  p6 as R,
  Un as S,
  h_ as T,
  i6 as U,
  Oe as V,
  aa as W,
  l6 as X,
  o6 as Y,
  Of as Z,
  z as _,
  XS as a,
  O_ as a$,
  f$ as a0,
  g6 as a1,
  v6 as a2,
  qe as a3,
  E6 as a4,
  C6 as a5,
  St as a6,
  y6 as a7,
  j6 as a8,
  jS as a9,
  $_ as aA,
  o_ as aB,
  S5 as aC,
  z6 as aD,
  U6 as aE,
  V_ as aF,
  _r as aG,
  f_ as aH,
  $n as aI,
  GS as aJ,
  HS as aK,
  N_ as aL,
  xn as aM,
  j_ as aN,
  L6 as aO,
  l_ as aP,
  i_ as aQ,
  s_ as aR,
  fn as aS,
  $t as aT,
  FS as aU,
  m2 as aV,
  n_ as aW,
  h6 as aX,
  xr as aY,
  Ft as aZ,
  Vt as a_,
  T_ as aa,
  D_ as ab,
  YS as ac,
  r6 as ad,
  u6 as ae,
  _6 as af,
  M6 as ag,
  A6 as ah,
  t6 as ai,
  gl as aj,
  b6 as ak,
  P6 as al,
  X_ as am,
  J6 as an,
  Q6 as ao,
  Y6 as ap,
  O6 as aq,
  x6 as ar,
  $6 as as,
  S6 as at,
  d_ as au,
  D6 as av,
  F6 as aw,
  eM as ax,
  en as ay,
  W6 as az,
  _$ as b,
  Z_ as b$,
  X5 as b0,
  P_ as b1,
  g_ as b2,
  p_ as b3,
  D2 as b4,
  cr as b5,
  C_ as b6,
  q6 as b7,
  ba as b8,
  ft as b9,
  y_ as bA,
  S_ as bB,
  pt as bC,
  m_ as bD,
  __ as bE,
  H6 as bF,
  Z6 as bG,
  G6 as bH,
  Re as bI,
  R6 as bJ,
  M_ as bK,
  rM as bL,
  uM as bM,
  DS as bN,
  v2 as bO,
  I6 as bP,
  b_ as bQ,
  JS as bR,
  Q_ as bS,
  v_ as bT,
  w_ as bU,
  k_ as bV,
  T6 as bW,
  _5 as bX,
  B6 as bY,
  K6 as bZ,
  Y_ as b_,
  x_ as ba,
  Fa as bb,
  $i as bc,
  nM as bd,
  oM as be,
  c_ as bf,
  L_ as bg,
  PS as bh,
  X6 as bi,
  aM as bj,
  w6 as bk,
  k6 as bl,
  a6 as bm,
  m6 as bn,
  US as bo,
  B_ as bp,
  ZS as bq,
  e6 as br,
  s6 as bs,
  t_ as bt,
  u2 as bu,
  F_ as bv,
  l$ as bw,
  n6 as bx,
  VS as by,
  e_ as bz,
  q2 as c,
  yS as c$,
  zS as c0,
  WS as c1,
  V6 as c2,
  lM as c3,
  lo as c4,
  iM as c5,
  jr as c6,
  R_ as c7,
  d6 as c8,
  c6 as c9,
  sS as cA,
  Gt as cB,
  Dd as cC,
  DM as cD,
  NM as cE,
  me as cF,
  ti as cG,
  _M as cH,
  pS as cI,
  UM as cJ,
  GM as cK,
  CS as cL,
  CM as cM,
  ps as cN,
  BS as cO,
  rk as cP,
  Pt as cQ,
  $l as cR,
  Is as cS,
  $S as cT,
  ES as cU,
  wc as cV,
  Hw as cW,
  ta as cX,
  RM as cY,
  gS as cZ,
  vS as c_,
  h2 as ca,
  KS as cb,
  s$ as cc,
  a_ as cd,
  Js as ce,
  b5 as cf,
  u_ as cg,
  tn as ch,
  Nt as ci,
  bS as cj,
  kS as ck,
  SM as cl,
  pe as cm,
  hf as cn,
  Ds as co,
  fa as cp,
  dv as cq,
  ha as cr,
  LM as cs,
  qS as ct,
  wS as cu,
  mv as cv,
  Ri as cw,
  on as cx,
  Ks as cy,
  cM as cz,
  Ge as d,
  Cp as d$,
  SS as d0,
  qM as d1,
  FM as d2,
  qi as d3,
  Yc as d4,
  $M as d5,
  Iy as d6,
  dS as d7,
  LS as d8,
  w4 as d9,
  qo as dA,
  zs as dB,
  fd as dC,
  IM as dD,
  TM as dE,
  Bs as dF,
  dd as dG,
  Os as dH,
  xm as dI,
  BM as dJ,
  NS as dK,
  _w as dL,
  RS as dM,
  IS as dN,
  hM as dO,
  am as dP,
  dM as dQ,
  uS as dR,
  AM as dS,
  nk as dT,
  F$ as dU,
  Ki as dV,
  hS as dW,
  MS as dX,
  gM as dY,
  yM as dZ,
  Ne as d_,
  Dt as da,
  AS as db,
  Ve as dc,
  vt as dd,
  kg as de,
  ad as df,
  Am as dg,
  TS as dh,
  fS as di,
  zt as dj,
  MM as dk,
  f3 as dl,
  PM as dm,
  jM as dn,
  bn as dp,
  jd as dq,
  at as dr,
  OS as ds,
  Ze as dt,
  zM as du,
  WM as dv,
  Us as dw,
  vM as dx,
  Cs as dy,
  _p as dz,
  f6 as e,
  xS as e0,
  $c as e1,
  fM as e2,
  Ji as e3,
  pM as e4,
  Au as e5,
  _S as e6,
  cS as e7,
  rS as e8,
  ln as e9,
  Yl as ea,
  hd as eb,
  mS as ec,
  mt as ed,
  HM as ee,
  W$ as ef,
  oS as eg,
  iS as eh,
  mM as ei,
  xM as ej,
  Oi as ek,
  EM as el,
  Zi as em,
  Ul as en,
  A4 as eo,
  Es as ep,
  bM as eq,
  ts as er,
  wM as es,
  kM as et,
  Ke as eu,
  OM as ev,
  Yn as ew,
  r2 as f,
  tM as g,
  hn as h,
  H_ as i,
  sM as j,
  z_ as k,
  I_ as l,
  O$ as m,
  no as n,
  q_ as o,
  QS as p,
  U_ as q,
  Dr as r,
  Pr as s,
  _e as t,
  j2 as u,
  E_ as v,
  J_ as w,
  A_ as x,
  _n as y,
  K_ as z
};
