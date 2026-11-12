import { openBlock as r, createElementBlock as d, normalizeStyle as ve, unref as R, renderSlot as ue, createElementVNode as m, normalizeClass as Y, Fragment as P, renderList as ne, defineComponent as su, Comment as ou, h as ha, cloneVNode as lu, createBlock as F, withCtx as D, createVNode as O, toDisplayString as v, createCommentVNode as b, ref as C, inject as Se, watch as pe, onMounted as Me, onBeforeUnmount as nt, reactive as Ut, shallowRef as Ze, onUnmounted as Re, useAttrs as ma, computed as S, resolveDynamicComponent as Ke, mergeProps as De, useId as Ds, resolveDirective as iu, withDirectives as et, createTextVNode as K, Teleport as kn, nextTick as Fe, Transition as Gt, withModifiers as $e, createApp as ru, shallowReactive as uu, withKeys as Ct, createSlots as Hl, onScopeDispose as pa, useModel as rn, mergeModels as jt, toRef as Ca, vModelText as ea, resolveComponent as cu, provide as Ps, onErrorCaptured as du, TransitionGroup as js, isRef as Ao, getCurrentInstance as fu, getCurrentScope as zl, normalizeProps as cs, guardReactiveProps as Ul, vShow as Gl, useSlots as hu, defineAsyncComponent as mu } from "vue";
function Vl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
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
}, tn = /* @__PURE__ */ U(gu, [["__scopeId", "data-v-6c018b03"]]), vu = { class: "skeleton-line" }, yu = 2e3, bu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Vl(yu);
    return (n, a) => (r(), d("span", vu, [
      ue(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(P, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ve({ ...R(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ U(bu, [["__scopeId", "data-v-484fe8a0"]]), Vt = su({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ou);
      return a.length !== 1 ? ha(P, { key: n }, a) : a[0].key == null ? lu(a[0], { key: n }) : a[0];
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
    return (u, c) => (r(), F(Vt, { value: e.shape }, {
      messages: D(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(P, null, ne(t, (f) => O(tn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ku)
      ]),
      older: D(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(t.slice(0, 3), (f) => (r(), F(tn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, wu)
      ]),
      cards: D(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(P, null, ne(n, (h) => O(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, $u)
      ]),
      file: D(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            O(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(P, null, ne(s, (h) => O(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, xu)
      ]),
      page: D(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          O(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Su)
      ]),
      text: D(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Mu)
      ]),
      default: D(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, _u)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Qe = /* @__PURE__ */ U(Cu, [["__scopeId", "data-v-ef519c5f"]]), Au = {
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
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Tu, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, un = /* @__PURE__ */ U(Iu, [["__scopeId", "data-v-b27e89b0"]]), Bu = { class: "fold-group" }, Ru = ["aria-expanded"], Lu = { class: "fold-label" }, Nu = {
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
        e.count !== "" ? (r(), d("span", Nu, v(e.count), 1)) : b("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ru),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : b("", !0)
    ]));
  }
}, k6 = /* @__PURE__ */ U(qu, [["__scopeId", "data-v-9ef1865c"]]), Du = 150, Pu = () => Du;
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
function w6(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? ds(t.read, t.events) : ds("", []);
}
function Yl(e, t, n, a, s = () => !1) {
  const o = C([]), l = C(null), i = C(""), u = C(!1), c = performance.now(), f = C(!1), h = C(""), g = C(null), y = /* @__PURE__ */ new Set();
  let k = null;
  function _(p) {
    return s() ? (y.add(p), k ?? (k = new Promise(($) => setTimeout(() => $(x()), ju)))) : M(p);
  }
  async function x() {
    const p = new Set(y);
    y.clear(), k = null;
    const $ = W, A = await t({ ids: [...p].join(","), limit: p.size });
    if ($ !== W) return;
    if (!A.ok) return E();
    const B = new Map(A.value.rows.map((j) => [j.id, j]));
    o.value = o.value.flatMap((j) => p.has(j.id) ? B.has(j.id) ? [B.get(j.id)] : [] : [j]);
  }
  async function M(p) {
    const $ = W, A = await t({ "before-id": p + 1, limit: 1 });
    if ($ !== W) return;
    if (!A.ok) return E();
    const B = A.value.rows.find((j) => j.id === p);
    o.value = B ? o.value.map((j) => j.id === p ? B : j) : o.value.filter((j) => j.id !== p);
  }
  async function T(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((J) => J.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((J) => J.id === p.row_id)) return _(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return E();
    const A = Math.max(...o.value.map((J) => J.id)), B = W, j = await t({ "after-id": A });
    if (B !== W) return;
    if (!j.ok) return E();
    const V = new Set(o.value.map((J) => J.id));
    o.value = [...j.value.rows.filter((J) => !V.has(J.id)), ...o.value];
  }
  async function H() {
    if (!f.value || !o.value.length) return !1;
    const p = W, $ = Math.min(...o.value.map((j) => j.id)), A = await t({ "before-id": $ });
    if (p !== W) return !1;
    if (!A.ok || !A.value.rows.length) return f.value = !1;
    f.value = Eo(A.value, n());
    const B = new Set(o.value.map((j) => j.id));
    return o.value = [...o.value, ...A.value.rows.filter((j) => !B.has(j.id))], !0;
  }
  let W = 0;
  function I(p, $) {
    var j, V;
    const A = p.ok ? e.shared ? [p.value] : ((j = p.value) == null ? void 0 : j.rows) ?? [] : [];
    p.ok && (o.value = $(A)), l.value = p.ok ? p.value : null;
    const B = A.length ? Math.min(...A.map((J) => J.id)) : 0;
    p.ok && ((V = p.value) != null && V.rows) && !o.value.some((J) => J.id < B) && (f.value = !e.shared && Eo(p.value, n())), i.value = p.ok ? "" : p.error, Fs(c, () => u.value = !0);
  }
  async function z(p) {
    const $ = ++W, A = await t({});
    $ === W && I(A, p);
  }
  const N = (p) => {
    if (!a() || !p.length) return p;
    const $ = Math.min(...p.map((B) => B.id)), A = Math.max(...p.map((B) => B.id));
    return [...o.value.filter((B) => B.id > A), ...p, ...o.value.filter((B) => B.id < $)];
  }, E = () => z(N), L = (p) => I(p, N), q = () => z((p) => p);
  async function w(p, $ = null) {
    const A = await Kl($ && { target: o, fields: { value: $(o.value) } }, p, e.run);
    return h.value = A.ok ? "" : A.error, g.value = A.ok ? A.value : null, await E(), A;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: E, loadLatest: q, older: H, act: w, actionFailure: h, answer: g, context: e, heard: T, showFirst: L, pageSize: n };
}
const Fu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ds(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = Yl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Fu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Wu = 2e3;
function Ws(e, t, n = Wu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), u = () => {
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
  }, k = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), g();
    }
  };
  pe(() => {
    var _;
    return (_ = i == null ? void 0 : i.visible) == null ? void 0 : _.value;
  }, k), Me(async () => {
    document.addEventListener("visibilitychange", k), u() || await y();
  }), nt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", k);
  });
}
const Ql = typeof document < "u" && document.documentElement.classList.contains("phone"), Jl = 120;
var Fl;
const Aa = globalThis[Fl = Symbol.for("journal.pressed")] ?? (globalThis[Fl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Hu(e = 0) {
  const t = Aa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Aa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Aa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function fs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Xl(e = window) {
  if (!fs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    fs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const hs = "journal.stale-build-reload", zu = 'script[type="module"][src*="/assets/index-"]', Oo = (e) => {
  var t;
  return ((t = e.querySelector(zu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Uu(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => Xl(window)) {
  const a = Oo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Oo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ea = "";
function Gu(e, t = () => Xl(window)) {
  if (!e) return !1;
  const n = !!Ea && Ea !== e;
  return Ea = e, n && t(), n;
}
const Vu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ku(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(hs) === e.message) return !1;
    t.setItem(hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Yu(e = window.sessionStorage) {
  try {
    e.removeItem(hs);
  } catch {
    return;
  }
}
const Qu = 2e3, Ju = 3e4, Ve = Ut({ starting: !1, external: !1, late: !1, offline: !1 }), Hs = () => Ve.starting, Xu = 3;
let In = 0, ms = 0, Zl = 0, ei = [];
async function Zu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ve.external };
  }
}
let To = null;
const ec = () => To ?? (To = Zu().finally(() => To = null));
function tc() {
  clearTimeout(ms), clearTimeout(Zl), ms = 0, Object.assign(Ve, { starting: !1, external: !1, late: !1, offline: !1 }), ei.splice(0).forEach((e) => e()), Uu();
}
async function nc() {
  Ve.offline = !navigator.onLine;
  const e = await ec();
  if (Ve.external = e.updating, In = !e.restarting && !e.updating && e.reachable ? In + 1 : 0, In < Xu) return;
  In = 0, (!Gu(e.started_at) || fs()) && tc();
}
function ti() {
  ms = setTimeout(async () => {
    await nc(), Ve.starting && ti();
  }, Qu);
}
function ac() {
  Ve.starting || (Ve.starting = !0, Ve.offline = !navigator.onLine, ti(), Zl = setTimeout(() => Ve.late = !0, Ju));
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
const dt = "viewer.shell", Bn = 2e4, lc = 4, Io = "/api/read-lines", ic = 5e3, rc = 403, Bo = "/api/repeated-lines", uc = 10, cc = 2e3, dc = 3e5, $6 = 6e5, Rn = 6, fc = 500, hc = "/journal/summary", Ro = "/api/server-state", mc = 2e4, Ln = Ql ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, pc = (e) => e.split("?")[0].endsWith(hc), ps = (e, t) => Object.assign(new Error(t), { status: e });
async function gc(e, t, n = ps) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const vc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), yc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Lo = (e) => e.split(" ").slice(0, 2).join(" "), ot = "read", Rt = "write", bc = "stream";
class kc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Rn;
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
    this.out(Bo, { method: "POST", headers: { ...Ln, "Content-Type": "application/json" }, body: i }, [{ window: dt, line: Bo, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Hu(n ? Jl : 0);
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
      return await fetch(t, a[0].kind === Rt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = Bn) {
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
    return this.out(Io, { headers: Ln }, [{ window: dt, line: Io, kind: ot }], ic).then(async (t) => {
      if (t.status === rc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ps(t.status, "The read lines did not answer");
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
      this.tries = Rn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Ln, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: vc(a) }, c = s || (i ? dc : Bn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: dt, line: n, kind: ot }], c)) : await this.sent(n, u, [{ window: dt, line: n, kind: Rt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, fc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Rn, l = {}) {
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
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: ot }], Bn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Ln });
    if (!n.ok) throw ps(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Rn, o).then((i) => (this.written(n), i)) : Hs() && !pc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: bc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ro, { cache: "no-store" }, [{ window: dt, line: Ro, kind: ot }], mc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = Bn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ot : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Oa = Symbol.for("journal.transport"), Ce = globalThis[Oa] ?? (globalThis[Oa] = new kc());
class ai {
  constructor() {
    this.following = Ze([]), this.held = /* @__PURE__ */ new Set();
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
    Ce.readsOutdated();
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
}, xc = 50, Sc = "refresh", Mc = 1e3, _c = 3e4, Cc = "requested", Ac = "after_window", Ec = 50, Nn = ".*", Oc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Tc(e) {
  const t = {}, n = Ut({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  const g = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const p = () => g(w), $ = C(void 0), A = Yl(e, async (B) => {
      const j = await x(w, B);
      return j.ok && !Object.keys(B).length && ($.value = j.value), j;
    }, () => p().page_size || Ec, () => !!p().page_size, () => !!p().reads_ids);
    return t[w] = { ...A, data: $, readAt: 0 };
  }
  const k = new Proxy({}, { get: (w, p) => typeof p != "string" || p.startsWith("__v") ? void 0 : t[p] ?? y(p) }), _ = (w) => (u[w].loading !== Cc || w.endsWith(Nn)) && (!u[w].tab || u[w].tab === n.tab);
  function x(w, p = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: p, resolve: $ }), a.length === 1 && setTimeout(M);
    });
  }
  async function M() {
    const w = /* @__PURE__ */ new Map(), p = a.splice(0).filter((B) => {
      const j = JSON.stringify(B.flags);
      return w.has(B.name) || w.set(B.name, j), w.get(B.name) === j ? !0 : (a.push(B), !1);
    });
    a.length && setTimeout(M);
    const $ = Object.fromEntries(p.flatMap(({ name: B, flags: j }) => Object.entries(j).map(([V, J]) => [`${B}.${V}`, J]))), A = await e.readKeys({ only: [...new Set(p.map(({ name: B }) => B))], state: { ...n, ...$ } });
    p.forEach(({ name: B, resolve: j }) => j(A.ok ? A.value.keys[B] : A));
  }
  async function T(w) {
    var B;
    const p = ++f;
    (w.length ? w : Object.keys(u).filter((j) => !j.endsWith(Nn) && u[j].loading === "first" && _(j))).forEach((j) => l[j] = p);
    const A = await e.readKeys({ only: w, state: { ...n } });
    if (!A.ok) {
      if (A.failure === "cancelled") return !1;
      const j = (w.length ? w : Object.keys(t)).filter((J) => (l[J] ?? 0) <= p);
      j.forEach((J) => {
        k[J].readAt = Date.now(), A.failure === "unreachable" ? i.add(J) : i.delete(J), k[J].showFirst(A);
      });
      const V = A.failure === "unreachable" && ((B = e.waitForServer) == null ? void 0 : B.call(e));
      return V && V.then(() => {
        if (h) return;
        const J = j.filter((oe) => l[oe] === p);
        (J.length || !w.length && !j.length && f === p) && T(J);
      }), !1;
    }
    return L(A.value.declared), Object.entries(A.value.keys).forEach(([j, V]) => {
      (l[j] ?? 0) > p || (l[j] = p, k[j].readAt = Date.now(), i.delete(j), V.ok && (k[j].data.value = V.value), k[j].showFirst(V));
    }), !0;
  }
  function H(w) {
    const p = Oc(w);
    return p.length ? (p.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const A = [...o.names];
      o.names.clear(), o.answer = null, $(T(A));
    })))) : T([]);
  }
  function W(w) {
    w.forEach((p) => s.add(p)), clearTimeout(c), c = setTimeout(() => {
      const p = [...s];
      s.clear(), p.length && H(p);
    }, xc);
  }
  const I = (w) => w.endsWith(Nn) ? Object.keys(t).filter((p) => p.startsWith(w.slice(0, -1)) && t[p].readAt) : [w], z = (w, p) => {
    const $ = g(w).event_column;
    return !$ || $c(p, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, N = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function E(w) {
    const p = Object.keys(u).filter((A) => w.event === Sc || u[A].events.some((B) => Us(B, w.event)));
    p.filter((A) => u[A].page_size).forEach((A) => k[A].heard(w));
    const $ = p.filter((A) => !u[A].page_size);
    $.filter((A) => !_(A)).forEach((A) => k[A].readAt = 0), W($.filter(_).flatMap(I).filter((A) => z(A, w)));
  }
  function L(w) {
    if (Object.keys(u).length) return;
    u = w;
    const p = [...new Set(Object.values(w).flatMap((A) => A.events))];
    p.length && e.follow(p, E);
    const $ = Object.keys(w).filter((A) => w[A].loading === Ac);
    $.length && T($);
  }
  pe(() => n.tab, () => {
    const w = Object.keys(u).filter((p) => !p.endsWith(Nn) && _(p) && !k[p].readAt);
    w.length && T(w);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const w = Date.now(), p = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && _($)).flatMap(I).filter(($) => w - k[$].readAt >= (i.has($) ? Math.min(N($) * 1e3, _c) : N($) * 1e3));
    p.length && W(p);
  }
  return Ws(q, () => e.visible.value, Mc), queueMicrotask(() => T([])), { props: k, state: n, reload: H, readKey: x };
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
function at() {
  const e = Se(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Bc(e);
}
const Rc = (e, t) => e(oi, t), x6 = () => Se(oi), gs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', No = {
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
  agent: gs,
  worker: gs,
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
}, Lc = ["data-icon", "stroke-width", "innerHTML"], ie = {
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
      agent: gs,
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
}, qc = /* @__PURE__ */ U(Nc, [["__scopeId", "data-v-eb453d6f"]]), Dc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ma(), a = S(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = C(!1), o = S(() => t.busy || s.value), l = Se(Le, null), i = S(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((g) => g(c)).filter((g) => g instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Jl);
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
      default: D(() => [
        m("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), F(ie, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : b("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), F(qc, {
          key: 0,
          class: "btn-spinner"
        })) : b("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ U(Dc, [["__scopeId", "data-v-ededdadf"]]), Pc = ["aria-checked", "aria-haspopup", "onClick"], jc = {
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
        (r(!0), d(P, null, ne(e.options, (i) => et((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", jc)) : b("", !0),
          K(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Fc, v(i.note), 1)) : b("", !0),
          i.count !== void 0 ? (r(), d("em", Wc, v(i.count), 1)) : b("", !0)
        ], 10, Pc)), [
          [l, i.tip || i.title, `${R(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ft = /* @__PURE__ */ U(Hc, [["__scopeId", "data-v-c89bc92d"]]), zc = {
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
      e.failure ? (r(), d("p", Uc, v(e.failure), 1)) : b("", !0),
      e.more ? (r(), F(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: D(() => [
          K(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : b("", !0)
    ])) : b("", !0);
  }
}, wn = /* @__PURE__ */ U(Gc, [["__scopeId", "data-v-10464014"]]), Vc = { class: "link-group" }, Kc = {
  class: "group-label",
  "data-link-kind": ""
}, Yc = ["disabled", "onClick"], Qc = { class: "title" }, Jc = { class: "relations" }, Xc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = S(() => s.value ? n.rows : n.rows.slice(0, 3)), l = S(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", Vc, [
      m("div", Kc, v(l.value), 1),
      (r(!0), d(P, null, ne(o.value, (g) => (r(), d("button", De({
        key: `${g.endpoint.model}:${g.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(g), {
        disabled: i(g),
        onClick: (y) => a("open", g)
      }), [
        m("span", Qc, v(g.endpoint.title), 1),
        m("span", Jc, [
          K(v(c(g)), 1),
          i(g) ? (r(), d(P, { key: 0 }, [
            K(" · Unavailable")
          ], 64)) : b("", !0)
        ])
      ], 16, Yc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (g) => s.value = !0)
      }, "Show more")) : b("", !0)
    ]));
  }
}, Zc = /* @__PURE__ */ U(Xc, [["__scopeId", "data-v-be6f079c"]]), ed = ["data-loaded"], td = { class: "rows" }, nd = ["disabled", "onClick"], ad = { class: "title" }, sd = { class: "relations" }, od = { key: 2 }, ld = {
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
    const g = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (E) => g[E] || `${E.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())}s`, k = S(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((E, L) => E + L, 0) },
      ...Object.entries(o.value).filter(([E]) => !n.onlyKinds.length || n.onlyKinds.includes(E)).map(([E, L]) => ({ key: E, label: y(E), count: L }))
    ]), _ = S(() => {
      const E = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((q) => q.endpoint.model))].map((q) => [q, s.value.filter((w) => w.endpoint.model === q).length])), L = { doc: 0, task: 1, message: 2 };
      return Object.entries(E).sort(([q], [w]) => (L[q] ?? 3) - (L[w] ?? 3)).map(([q, w]) => ({ model: q, count: w, rows: s.value.filter((p) => p.endpoint.model === q) }));
    }), x = (E) => E.endpoint.unavailable || !E.endpoint.open_ref, M = (E) => ({ [n.linkAttribute]: !0, "data-link-model": E.endpoint.model, "data-link-id": E.endpoint.id }), T = (E) => `${E.endpoint.model === "doc" && E.endpoint.id === n.documentId ? "Design document" : E.endpoint.model.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())} ${E.endpoint.id}, ${E.relations.map((L) => L.replaceAll("_", " ")).join(", ")}`;
    async function H(E = 1) {
      const L = ++h;
      c.value = !0, f.value = "";
      const q = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(E), "--page-size", String(n.pageSize)];
      n.outsidePlan && q.push("--outside-plan"), n.documentId && q.push("--first-counterpart", `doc:${n.documentId}`), i.value && q.push("--kind", i.value);
      try {
        const w = await n.read(q);
        if (L !== h) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const p = w.value.counterparts ?? [], $ = E === 1 ? p : [...s.value, ...p];
        s.value = [...new Map($.map((A) => [`${A.endpoint.model}:${A.endpoint.id}`, A])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        L === h && (f.value = w.message);
      } finally {
        L === h && (c.value = !1);
      }
    }
    function W(E) {
      if (x(E)) return;
      const [L, q] = E.endpoint.open_ref.split(":");
      a("open", { table: L, id: Number(q) });
    }
    function I(E) {
      i.value = E, H();
    }
    const z = () => !c.value && u.value && H(u.value), N = S(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", H();
    }, { immediate: !0 }), (E, L) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      k.value.length > 2 ? (r(), F(Ft, {
        key: 0,
        options: k.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : b("", !0),
      m("div", td, [
        e.grouped ? (r(!0), d(P, { key: 0 }, ne(_.value, (q) => (r(), F(Zc, {
          key: q.model,
          model: q.model,
          count: q.count,
          rows: q.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(P, { key: 1 }, ne(s.value, (q) => (r(), d("button", De({
          key: `${q.endpoint.model}:${q.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, M(q), {
          disabled: x(q),
          onClick: (w) => W(q)
        }), [
          m("span", ad, v(q.endpoint.title), 1),
          m("span", sd, [
            K(v(T(q)), 1),
            x(q) ? (r(), d(P, { key: 0 }, [
              K(" · Unavailable")
            ], 64)) : b("", !0)
          ])
        ], 16, nd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", od, v(e.empty), 1)) : b("", !0),
        O(wn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: N.value,
          onMore: z
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, ed)) : b("", !0);
  }
}, id = /* @__PURE__ */ U(ld, [["__scopeId", "data-v-3b23de37"]]), rd = (e, t, n) => Math.max(t, Math.min(n, e)), ud = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ii = /* @__PURE__ */ new WeakMap(), cd = (e, t) => ii.set(e, t);
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
const It = 8, fd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
        below: p.bottom - $.bottom - a.gap - It,
        above: $.top - p.top - a.gap - It,
        across: p.right - p.left - 2 * It
      };
    }
    function k(p) {
      const $ = h(a.anchor), A = y($, p);
      return i.value.w <= A.across && i.value.h <= Math.max(A.below, A.above) ? $ : c();
    }
    const _ = S(() => {
      if (!u.value) return l.value;
      const p = u.value, $ = k(p), A = y($, p), { w: B, h: j } = i.value, V = a.align === "auto" ? p.left + p.right > $.left + $.right : a.align === "right", J = rd(V ? p.right - B : p.left, $.left + It, Math.max($.left + It, $.right - B - It)), ce = j > A.below && A.above > A.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: g(a.maxHeight, A.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: g(a.maxHeight, A.below) };
      return { ...l.value, ...ce, left: `${J}px`, maxWidth: g(a.maxWidth, A.across) };
    }), x = n, M = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(p) {
      const $ = M(), A = $.indexOf(document.activeElement);
      $[(A + p + $.length) % $.length].focus();
    }
    const H = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => x("close") }, W = (p) => H[p.key] && (p.preventDefault(), H[p.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let z = 0;
    const N = new ResizeObserver(() => {
      cancelAnimationFrame(z), z = requestAnimationFrame(I);
    });
    ri(s, (p) => a.anchor && !a.anchor.contains(p.target) && x("close"));
    const E = (p, $) => ["top", "left", "right", "bottom"].some((A) => Math.abs(p[A] - $[A]) > 1), L = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let q = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || L(p)) return x("close");
        E(p, u.value) && (u.value = p);
      }
      q = requestAnimationFrame(w);
    }
    return Me(() => {
      a.anchor && s.value && cd(s.value, a.anchor), I(), s.value && N.observe(s.value), !a.plain && M()[0] && M()[0].focus(), w();
    }), Re(() => {
      N.disconnect(), cancelAnimationFrame(q), cancelAnimationFrame(z);
    }), t({ element: s }), (p, $) => (r(), F(kn, {
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
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ U(fd, [["__scopeId", "data-v-3d203970"]]), hd = { class: "split-button" }, md = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = C(null), s = C(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", hd, [
      O(ge, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: D(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        O(ge, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: D(() => [
            O(ie, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), F(ga, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: D(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : b("", !0)
    ]));
  }
}, pd = /* @__PURE__ */ U(md, [["__scopeId", "data-v-c258494d"]]), gd = {
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
      e.checked !== null ? (r(), d("span", gd, v(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (r(), d("span", vd, [
        m("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ue = /* @__PURE__ */ U(yd, [["__scopeId", "data-v-fec99974"]]), bd = ["aria-expanded"], kd = { class: "drop-label" }, wd = ["value"], $d = {
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
        e.icon ? (r(), F(ie, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : b("", !0),
        m("span", kd, v(e.label), 1),
        O(ie, {
          name: "down",
          size: 11
        })
      ], 10, bd),
      s.value ? (r(), F(ga, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, wd)) : b("", !0),
          (r(!0), d(P, null, ne(i.value, (h) => (r(), F(Ue, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (g) => u(h)
          }, {
            default: D(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : b("", !0),
              h.lead ? (r(), d("span", $d, v(h.lead), 1)) : b("", !0),
              m("span", xd, v(h.label), 1),
              h.note ? (r(), d("span", Sd, v(h.note), 1)) : b("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? b("", !0) : (r(), d("p", Md, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : b("", !0)
    ], 2));
  }
}, Gs = /* @__PURE__ */ U(_d, [["__scopeId", "data-v-29dfcce5"]]), Cd = 0, Ad = "/api/lines", Ed = "/api/line", qo = 5e3, Do = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Po = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ta = (e) => JSON.stringify(e.line), jo = () => new DOMException("cancelled", "AbortError");
class Od {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ta(t))) {
        Ce.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Rt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), Cd));
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
      const o = await Ce.sent(Ad, Do({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Po(i.body, ot)), qo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ce.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, ot), Date.now() - n < qo ? this.slow.delete(Ta(t.body)) : this.slow.add(Ta(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(Ed, Do(t.body, t.signal), [Po(t.body, n)], n === ot ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ui = new Od(), Td = "/api/window";
function Id(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Td}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ce.whenFree(async () => {
    const f = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: ot }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const ci = /* @__PURE__ */ new Map();
class Bd {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ze({ buttons: [], missing: {} }), this.loading = Ze(!1), this.loaded = Ze(!1), this.failed = Ze(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ce.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function S6(e, t) {
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
async function M6(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (di = (await t.json()).states);
}
const Ks = (e, t) => {
  var n;
  return (n = di[e]) == null ? void 0 : n[t];
}, cn = (e, t) => {
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
}, autoScroll: g = "", tabs: y = [], sources: k = [], links: _ = {}, search: x = {}, readOnly: M = !1, shared: T = null }) {
  const H = /* @__PURE__ */ new Map(), W = (V, J) => l.follow(e, V, (oe) => {
    H.clear(), J(oe);
  }, a), I = new AbortController(), z = C(!1), N = performance.now();
  let E = 0, L = 0, q = () => {
  };
  const w = new Promise((V) => q = V);
  I.signal.addEventListener("abort", q, { once: !0 });
  const p = () => {
    clearTimeout(L), L = setTimeout(() => {
      E === 0 && Fs(N, () => {
        z.value = !0, q();
      });
    }, jd);
  }, $ = (V, J) => (E += 1, St(e, V, t, I.signal, J).finally(() => {
    E -= 1, p();
  })), A = (V, J) => (p(), w.then(() => I.signal.aborted ? ut : St(e, V, t, I.signal, J))), B = ({ only: V = [], state: J = {} } = {}) => (E += 1, Ud(() => Id(e, t, V, J, I.signal), I.signal).finally(() => {
    E -= 1, p();
  })), j = (V, { unbatched: J = !1, deferred: oe = !1 } = {}) => {
    const ce = H.get(V);
    if (ce && performance.now() - ce.at < Pd) return ce.answer;
    const be = oe && !z.value ? A(V, J) : $(V, J);
    return H.set(V, { answer: be, at: performance.now() }), be;
  };
  return {
    answered: z,
    settle: p,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: S(() => a()),
    permissions: s,
    autoScroll: g,
    tabs: y,
    sources: k,
    links: _,
    search: x,
    readOnly: M,
    shared: T,
    read: j,
    readKeys: B,
    waitForServer: () => Hs() ? ni() : null,
    run: (V) => St(e, V, t, I.signal),
    upload: (V) => Vd(V, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (V, J) => W([V].flat().filter((oe) => o.some((ce) => Us(ce, oe))), J),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => S(() => {
      var J;
      return u.value[V] ?? ((J = c.find((oe) => oe.key === V)) == null ? void 0 : J.default);
    }),
    setting: async (V, J) => {
      const oe = await j(`window setting ${e} ${V}`);
      return oe.ok ? oe.value.value : J;
    },
    setOption: h,
    keep: (V, J) => St(e, ["window", "save-setting", e, V, JSON.stringify(J)], t, I.signal)
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
const ut = { ok: !1, failure: "cancelled", error: "" }, Qs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function pi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ut : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: hi[n.code] || "fault", error: mi(n.error) };
  } catch {
    return t != null && t.aborted ? ut : { ok: !1, failure: "unreachable", error: Qs };
  }
}
const zd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: hi[e.code] || "fault", error: mi(e.error) };
async function Ud(e, t) {
  try {
    const n = await e();
    return t.aborted ? ut : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, zd(s)])) } };
  } catch {
    return t.aborted ? ut : { ok: !1, failure: "unreachable", error: Qs };
  }
}
async function gi(e, t, n) {
  const a = await pi(() => ui.read(e, t, n), t);
  return a.failure !== "unreachable" || !Hs() ? a : (await ni(), t.aborted ? ut : gi(e, t, n));
}
function St(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => Gd(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : Js(t)));
}
async function Gd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Js(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => gi({ ...o, attribution: i }, l, s), a, o).catch(() => ut) : pi(() => ui.write({ ...o, attribution: {
    client_id: Ce.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Vd(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ut : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ut : { ok: !1, failure: "unreachable", error: Qs };
  }
}
function Js(e) {
  return [...e.matchAll(Fd)].map(([t]) => t.replace(Wd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Kd = (e) => `show-${e}`, _6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Kd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Xs = "messages.chat", Zs = "main", vi = "Main agent", Yd = { main: vi, worker: "Worker", helper: "Helper" }, vs = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Qd = (e, t, n, a) => e.role === Zs ? t : n ? `${t} ${a}` : `${t} ${e.number}`, Jd = (e) => `${e.role} ${e.number}`, Xd = (e) => e.role === Zs ? vi : `${vs(e.role)} ${e.number}`;
function Wt(e, t = e.facts) {
  const n = Yd[e.role] ?? vs(e.role), a = (t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.profile_title || e.profile || "", s = e.role === Zs ? "" : [a ? vs(a) : "", Jd(e)].filter(Boolean).join(" · ");
  return { title: n, subtext: s, text: Qd(e, n, a, s), name: Xd(e) };
}
const Zd = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, ef = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = S(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Wt(c).title, note: Wt(c).subtext }))), i = S(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await St(Xs, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(P, null, [
      O(Gs, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (h) => a("pick", h.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Zd, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, tf = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-d2ea58f1"]]), nf = {
  key: 0,
  class: "template-brief"
}, af = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, sf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = S(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = S(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await St(Xs, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((g) => g.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(P, null, [
      O(Ft, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", nf, v(i.value.brief), 1)) : b("", !0),
      o.value ? (r(), d("p", af, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, of = /* @__PURE__ */ U(sf, [["__scopeId", "data-v-14be8a5c"]]), lf = { class: "info-tip" }, rf = ["aria-label"], uf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, cf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", lf, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        O(ie, {
          name: "info",
          size: 13
        })
      ], 8, rf),
      m("span", uf, [
        (r(!0), d(P, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, yi = /* @__PURE__ */ U(cf, [["__scopeId", "data-v-a2fe5ff1"]]), df = { class: "form-field" }, ff = { class: "form-field-head" }, hf = ["for"], mf = {
  key: 1,
  class: "form-field-aside"
}, pf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", df, [
      m("div", ff, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, hf),
        e.help ? (r(), F(yi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : b("", !0),
        t.$slots.aside ? (r(), d("span", mf, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, gf = /* @__PURE__ */ U(pf, [["__scopeId", "data-v-302c40bf"]]), ys = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, vf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ma(), n = S(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => et((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [R(ys), R(t).value]
    ]);
  }
}), yf = /* @__PURE__ */ U(vf, [["__scopeId", "data-v-e130a5b9"]]), bf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ds(), o = S(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), F(gf, {
      label: e.field.label,
      for: R(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        O(Vt, { value: o.value }, {
          choice: D(() => [
            O(Ft, {
              id: R(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            O(of, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: D(() => [
            O(tf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            O(yf, {
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
}, va = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), F(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        O(ie, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function kf(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const wf = (e, t = () => !0) => kf("keydown", (n) => n.key === "Escape" && t() && e());
function bi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = C(!1), s = S(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return wf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const $f = 80, Bt = Ut([]);
function ki(e) {
  const t = Symbol("layer"), n = () => Bt.includes(t) && Bt.splice(Bt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Bt.includes(t) && Bt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), S(() => $f + Math.max(0, Bt.indexOf(t)));
}
let wi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return wi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const xf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Sf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(xf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : wi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Mf = ["aria-modal", "aria-label", "aria-labelledby"], _f = {
  key: 0,
  class: "dialog-head"
}, Cf = ["id", "tabindex"], Af = {
  key: 1,
  class: "dialog-foot"
}, Ef = 500, Of = 400, Tf = {
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
    n.modal && Sf(c, () => a("escape"), f);
    function k() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Of);
    }
    function _(T) {
      !n.modal || Date.now() - y >= Ef || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const x = () => u.value && (u.value.scrollTop = u.value.scrollHeight), M = new MutationObserver(x);
    return pe(u, (T) => {
      M.disconnect(), T && n.follow && (M.observe(T, { childList: !0, subtree: !0, characterData: !0 }), x());
    }), Re(() => M.disconnect()), (T, H) => (r(), F(kn, { to: "body" }, [
      O(Gt, {
        name: "dialog",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: D(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: R(i) }),
            onClick: $e(k, ["self"])
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
              e.bare ? b("", !0) : (r(), d("header", _f, [
                m("h3", {
                  id: R(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Cf),
                e.closable ? (r(), F(va, {
                  key: 0,
                  onClick: R(o)
                }, null, 8, ["onClick"])) : b("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ue(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", Af, [
                ue(T.$slots, "foot", {}, void 0, !0)
              ])) : b("", !0)
            ], 42, Mf)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ya = /* @__PURE__ */ U(Tf, [["__scopeId", "data-v-089c42bc"]]), If = {
  class: "action-output",
  "data-action-output": ""
}, Bf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(ya, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: D(() => [
        m("pre", If, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Rf = /* @__PURE__ */ U(Bf, [["__scopeId", "data-v-b32f94a4"]]);
function Lf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = ru(Rf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Nf = (e, t, n = {}) => Js(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function $n(e, t, n, a = {}) {
  var s;
  try {
    if (!await Ld(e.module, n)) return { ok: !1, error: "" };
    const o = await St(Xs, Nf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Lf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const qf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ia = [
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
}), ba = {
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
    filters: Ia
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ia
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Ia }),
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
}, Df = ["secrets", "plugins"], $i = Object.keys(ba).filter((e) => !(Ql && Df.includes(e)));
S(() => $i.map((e) => ({ name: e, ...ba[e] })));
const Kt = (e) => ba[e], xi = new Map($i.flatMap((e) => [e, e.replace(/s$/, ""), ba[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => xi.get(String(e).toLowerCase()) || "", Si = [...xi.keys()].sort((e, t) => t.length - e.length).join("|"), Pf = {
  class: "button-form",
  "data-button-form": ""
}, jf = {
  key: 0,
  class: "button-form-title"
}, Ff = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Wf = { class: "button-form-actions" }, Hf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = C(!1), l = C(""), i = S(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = S(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Kt(gt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await $n(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (r(), F(ya, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (g) => a("close"))
    }, {
      default: D(() => {
        var g;
        return [
          m("div", Pf, [
            (g = e.row) != null && g.title ? (r(), d("p", jf, v(e.row.title), 1)) : b("", !0),
            (r(!0), d(P, null, ne(e.button.fields, (y) => (r(), F(bf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (k) => s.value[y.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", Ff, v(l.value), 1)) : b("", !0),
            m("div", Wf, [
              O(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: D(() => [...h[2] || (h[2] = [
                  K("Cancel", -1)
                ])]),
                _: 1
              }),
              O(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: D(() => [...h[3] || (h[3] = [
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
}, zf = /* @__PURE__ */ U(Hf, [["__scopeId", "data-v-e3f0d786"]]), Uf = ["aria-busy"], Gf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Vf = { class: "button-slot-confirm-text" }, Kf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Yf = {
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
        var M;
        return !n.readOnly && ((M = s.value) == null ? void 0 : M.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = S(() => {
      var M;
      return !n.readOnly && ((M = s.value) == null ? void 0 : M.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = S(() => n.readOnly ? [] : Rd(n.environment, n.name, n.row)), c = C(null), f = C(null), h = C(""), g = C(!1), y = (M) => [M.from ? `From ${M.from}` : "", M.tip, M.warning].filter(Boolean).join(" · "), k = (M) => M.icon || (M.warning ? "dot" : "");
    function _(M) {
      if (!(g.value || n.readOnly)) {
        if (M.fields.length) {
          c.value = M;
          return;
        }
        if (M.confirm) {
          f.value = M;
          return;
        }
        return x(M);
      }
    }
    async function x(M) {
      f.value = null, h.value = "", a("failure", ""), g.value = !0;
      const T = await $n(M, n.row, n.environment);
      g.value = !1, h.value = T.ok ? "" : T.error;
      const H = M.label.toLowerCase() + (n.objectName && !M.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${H}: ${T.error}`), T.ok && a("done");
    }
    return (M, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(P, { key: 0 }, [
        T[5] || (T[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        O(ge, {
          small: "",
          onClick: i
        }, {
          default: D(() => [...T[4] || (T[4] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Gf, [
        m("span", Vf, v(f.value.confirm), 1),
        O(ge, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (H) => x(f.value))
        }, {
          default: D(() => [
            K(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        O(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (H) => f.value = null)
        }, {
          default: D(() => [...T[6] || (T[6] = [
            K("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? b("", !0) : (r(), d(P, { key: 2 }, [
        (r(!0), d(P, null, ne(u.value, (H) => (r(), d(P, {
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
            menu: D(({ close: W }) => [
              (r(!0), d(P, null, ne(H.menu, (I) => (r(), F(Ue, {
                key: I.label,
                description: I.description,
                onClick: (z) => (W(), _({ ...H, ...I, menu: [] }))
              }, {
                default: D(() => [
                  K(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              K(v(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), F(ge, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: Y({ danger: H.danger }),
            icon: k(H),
            disabled: g.value,
            title: y(H),
            "data-button": H.name,
            onClick: (W) => _(H)
          }, {
            default: D(() => [
              K(v(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Kf, v(h.value), 1)) : b("", !0),
        c.value && !e.readOnly ? (r(), F(zf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (H) => c.value = null),
          onDone: T[3] || (T[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : b("", !0)
      ], 64))
    ], 10, Uf));
  }
}, eo = /* @__PURE__ */ U(Yf, [["__scopeId", "data-v-a4b6f174"]]), Qf = {
  class: "running",
  "data-running-command": ""
}, Jf = ["title"], Xf = {
  key: "idle",
  class: "running-idle"
}, Zf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Qf, [
      O(Gt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Jf)) : (r(), d("span", Xf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, C6 = /* @__PURE__ */ U(Zf, [["__scopeId", "data-v-d3240219"]]), eh = ["aria-checked", "disabled", "aria-label", "title"], th = {
  key: 0,
  class: "switch-inner"
}, nh = {
  key: 0,
  class: "switch-word"
}, ah = {
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
        e.labelled ? (r(), d("span", th, v(e.word), 1)) : b("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", nh, v(e.word), 1)) : b("", !0)
    ], 10, eh));
  }
}, A6 = /* @__PURE__ */ U(ah, [["__scopeId", "data-v-92ae7767"]]), sh = { class: "notice-text" }, oh = {
  key: 1,
  class: "notice-actions"
}, lh = {
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
      e.icon ? (r(), F(ie, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : b("", !0),
      m("span", sh, [
        ue(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", oh, [
        ue(n.$slots, "actions", {}, void 0, !0)
      ])) : b("", !0)
    ], 2));
  }
}, E6 = /* @__PURE__ */ U(lh, [["__scopeId", "data-v-445bd8a6"]]);
function Mi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function ta(e, t) {
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
function ih(e, t) {
  return Mi(() => sessionStorage, e, t);
}
function rh(e, t) {
  return _i(() => sessionStorage, e, t);
}
const na = "journal.environment", Ai = C(ih(na, ta(na, "")));
function uh(e) {
  Ai.value = e, rh(na, e), to(na, e);
}
const aa = C(location.hash), Fo = Ze(null), Wo = { integrations: "mcp", library: "team" };
function ch() {
  if (!Fo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Wo[n]) {
    location.replace(`#/${[Wo[n], ...a].join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash;
    return;
  }
  !n || Fo.value(n) || (uh(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  aa.value = location.hash, ch();
});
const bs = S(() => {
  const [e, t = ""] = aa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
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
function dh(e = "", t = 0, n = "") {
  location.hash = no.page(e, t, n);
}
function fh(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const hh = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ei(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(hh).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function O6(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = bs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ei([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function mh(e, t, n, a = 0, s = "") {
  if (e === bs.value.env) return yt(t, n, a, s);
  const o = bs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ei([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? mh(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function ph(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = ph(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function T6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const gh = { class: "inspector-part" }, vh = { class: "inspector-part-title" }, yh = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", gh, [
      m("h4", vh, v(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, I6 = /* @__PURE__ */ U(yh, [["__scopeId", "data-v-5175e4a3"]]), Ho = /* @__PURE__ */ new Map(), bh = {
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
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(P, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ue(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : b("", !0)
    ], 64));
  }
}, Oi = /* @__PURE__ */ U(bh, [["__scopeId", "data-v-4d2235ba"]]), kh = ["aria-valuenow", "aria-valuemax"], wh = {
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
    ], 10, kh));
  }
}, Ti = /* @__PURE__ */ U(wh, [["__scopeId", "data-v-9eba6a85"]]), $h = { processes: "process", memories: "memory", replies: "reply" }, sa = (e) => ($h[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ks = [], xh = 2e3, ht = /* @__PURE__ */ new Map(), Sh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Mh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ot(e, { first: t = !1 } = {}) {
  t ? ks.unshift(e) : ks.push(e), ht.clear();
}
function Ii(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const _h = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Ch = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function rt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ah(e, t) {
  const n = [{ type: "text", text: rt(e).replace(/\r\n/g, `
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
function dn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Eh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Eh(e) {
  return e.split(Mh).map((t, n) => n % 2 ? t : t.replace(Sh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function zo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Oh = 24;
function Th(e) {
  const [t, , ...n] = e, a = zo(t), s = n.map(zo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > Oh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${dn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${dn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Bi = /^\s*(?:[-*+]|\d+[.)])\s+/, ws = /^\s*(\d+)[.)]\s/, Uo = (e) => e.match(/^\s*/)[0].length;
function Ri(e) {
  const t = e[0].match(ws), n = Uo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Uo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${dn(o.text)}${o.nested.length ? Ri(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Ih(e, t) {
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
      n.push(`<h${i}>${dn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Go(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Th(t.slice(a, i))), a = i;
      continue;
    }
    if (Bi.test(s)) {
      const i = Ih(t, a);
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
    n.push(`<p>${dn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Bh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Rh = (e) => e.type !== "text" && !Bh.test(e.html);
function Lh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Li(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Rh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ao(e, t = { env: "" }) {
  const n = Ch(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => _h(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = Lh(Ah(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > xh && ht.delete(ht.keys().next().value), o;
}
const Ba = /* @__PURE__ */ new WeakMap();
function Nh(e) {
  if (Ba.has(e)) return Ba.get(e);
  const t = uu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), g = e.read(`${sa(c)} show ${f}`);
    n.set(h, g), g.then((y) => {
      n.get(h) === g && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${sa(c).replace(/-/g, "_")}.*`], (f) => {
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
  return Ba.set(e, u), u;
}
function Ni() {
  const e = Se(Le, null), t = e ? Nh(e) : null;
  return (n, a = {}) => ao(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const qi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, xn = (e) => String(e || "").replace(qi, (t, n, a, s) => s), qh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), qn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Dh = /^Traceback \(most recent call last\):/m, Ph = 8;
function Di(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Ph).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function jh(e) {
  const t = [...e.matchAll(qh)].map((a) => a.index);
  if (qn.lastIndex = 0, !t.length || !qn.test(e)) return null;
  qn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(qn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Di(n), tail: "" } : null;
}
function Fh(e) {
  const t = Dh.exec(e);
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
Ot((e) => {
  const t = xn(e), n = Fh(t) || jh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const oa = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Pi = (e) => `${e.table}:${e.id}`, $s = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ra = 80;
function Vo(e) {
  return e.length <= Ra ? e : `${e.slice(0, Ra + 1).replace(/\s+\S*$/, "") || e.slice(0, Ra)}…`;
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
}, Wh = (e) => (Ko[e.table] ? Ko[e.table](e) : e.title || "") || "", At = (e) => oa(e.created_at), Hh = (e) => oa(e.updated_at) || At(e), zh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Uh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Gh(e) {
  const t = zh.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Uh.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Vh(e, t, n, a) {
  const s = Ii(a, e, t), o = xn(s ? Wh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${rt(Kt(e).title)} ${t}</span><span class="row-card-title">${rt(o)}</span></a>`;
}
Ot(
  (e, t) => {
    const n = Gh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Vh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Kh = /\.(png|jpe?g|gif|webp|svg)$/i, Yh = (e) => Kh.test(e), Qh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Jh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Xh(e, t) {
  const n = Qh.exec(e), [, a, s, o, l, i] = n || [], u = n && gt(a || o), c = u && Ii(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Kt(u).title} ${c.id} · ${rt(i)}`, g = Yh(i) ? `<img class="file-card-image" src="${f}" alt="${rt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${rt(i)}">${g}<span class="file-card-name">${h}</span></a>` };
}
function Zh(e) {
  const t = Jh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${rt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ot(
  (e, t) => {
    if (t.inline) return null;
    const n = Xh(e, t) || Zh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const em = /`([^`\n]+)`/g;
Ot((e) => e.replace(em, (t, n) => `<code>${n}</code>`));
const Yo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${no.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ot(
  (e, t) => e.replace(qi, (n, a, s, o) => Yo[a] ? Yo[a](s, o, t) : o)
);
const tm = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, ji = new RegExp(`\\b(${Si}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Fi = new RegExp(`\\b(${Si}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), nm = new RegExp(`<code>((?:${ji.source}|${Fi.source}))</code>`, "gi"), am = (e) => e.replace(nm, "$1"), sm = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, om = (e) => e.replace(Fi, (t, n, a) => a.replace(/\d+/g, (s) => sm(n.replace(/s$/i, ""), s))), lm = (e) => om(e).replace(
  ji,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Ot(
  (e, t) => t.rowNames === !1 ? e : am(e).split(tm).map((n, a) => a % 2 ? n : lm(n)).join("")
);
const im = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, rm = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, um = /[\w\]]\(/, cm = /^[\w$.[\]'"]+\s*=\s*[^=]/, dm = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, fm = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, hm = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, mm = /[[({,]$/, pm = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, gm = /^(\t|\s{2,})\S/, vm = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, ym = /`[^`]+`/, bm = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, km = /[{}()[\];=<>$&|*\\@+^~%]/g, Wi = /^\s*(?:[-*+]|\d+[.)])\s/, wm = /^\s*>/, $m = /^\s*\|/, xm = 0.6, Sm = 0.4, Mm = 5, _m = 0.03, Hi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Mm && t.every((n) => bm.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(km) ?? []).length / e.length < _m;
}, La = (e) => {
  const t = e.trim();
  return ym.test(t) ? !1 : [im, rm, um, cm, dm, fm, hm, mm, pm].some((n) => n.test(t)) || /[;{}]$/.test(t) || gm.test(e) && !Wi.test(e) && !Hi(e);
};
function Cm(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Wi.test(t[0]) || t.every((o) => wm.test(o) || $m.test(o))) return "text";
  const n = t.filter((o) => !vm.test(o.trim()));
  if (t.length === 1) return !n.length || La(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(La).length, s = n.filter((o) => !La(o) && Hi(o)).length;
  return a >= n.length * xm && s <= n.length * Sm ? "code" : "text";
}
const xs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Am = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Em = `${xs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Om = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Tm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Qo = {
  js: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Am, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Em, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Om, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Tm, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Im = {
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
function Jo(e, t, n) {
  return n && e.startsWith(n, t);
}
function Bm(e, t) {
  const n = Qo[Im[t] ?? t] || Qo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Jo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Jo(e, o, n.block[0])) {
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
function Rm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Bm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? rt(l) : `<span class="tok-${a}">${rt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Lm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Nm = 1500, Xo = /* @__PURE__ */ new WeakMap();
async function qm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Lm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Xo.get(t)), Xo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Nm)
  )));
}
typeof document < "u" && document.addEventListener("click", qm, !0);
const Dm = /\n\s*\n/, Pm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, jm = /^\s*(`{3,}|~{3,})\s*$/, Fm = /^\s{4,}\S/, Wm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ss = /^\s*(?:[-*+]|\d+[.)])\s/, zi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Hm = [
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
function zm(e) {
  const t = so(e.join(`
`));
  return (Hm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Um = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && zi.test(t) && !Ss.test(t);
}, Gm = (e, t) => Ss.test(t) || Ss.test([...e].reverse().find((n) => n.trim()) || "");
function oo(e, t) {
  const n = t || zm(e), a = Rm(so(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Vm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && jm.test(s));
  return a < 0 ? e.length : a;
}
function Km(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return oo(a.map(xn), n ? n.toLowerCase() : "");
}
function Ym(e) {
  const t = e.split(Dm).map((l) => ({ paragraph: l, type: Cm(so(l).split(`
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
`).map(xn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Qm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Ym(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Pm);
    if (i) {
      const c = Vm(n, l, i[2]);
      o(), a.push(Km(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Um(s) ? Wm : Fm;
    if (!t && u.test(n[l]) && !Gm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && zi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(oo([...f, ...n.slice(l, c)].map(xn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Ot((e, t) => Qm(e, t.document), { first: !0 });
const Jm = ["innerHTML"], Xm = ["innerHTML"], Zm = {
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
      onClick: o[0] || (o[0] = (...l) => R(Nt) && R(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Jm)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => R(Nt) && R(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Xm));
  }
}, lt = /* @__PURE__ */ U(Zm, [["__scopeId", "data-v-d8e75741"]]), B6 = (e) => [...new Set(e.agents.map((t) => t.name))], Na = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, ep = "main agent", lo = (e, t) => t ? ep : e, tp = ["data-agent-main"], np = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, ap = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, sp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = S(() => lo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", np, [...s[0] || (s[0] = [
        m("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        m("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), F(ie, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? b("", !0) : (r(), d("span", ap, v(n.value), 1))
    ], 10, tp));
  }
}, Dt = /* @__PURE__ */ U(sp, [["__scopeId", "data-v-a4c3d1e5"]]), op = ["aria-expanded"], lp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, ip = {
  key: 0,
  class: "tip-failure"
}, rp = { key: 1 }, up = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = S(() => qd(t.type, t.state)), s = C(!1), o = C([]), l = C("");
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
      onKeydown: Ct(u, ["escape"])
    }, [
      K(v(R(cn)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", lp, [
        l.value ? (r(), d("span", ip, v(l.value), 1)) : b("", !0),
        (r(!0), d(P, null, ne(o.value, (g) => (r(), d("span", {
          key: g,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : b("", !0)
    ], 40, op)) : (r(), d("span", rp, v(R(cn)(e.type, e.state)), 1));
  }
}, cp = /* @__PURE__ */ U(up, [["__scopeId", "data-v-bf9353d9"]]), dp = {
  class: "plan-details",
  "data-plan-details": ""
}, fp = { class: "state-line" }, hp = {
  key: 0,
  class: "phase-count"
}, mp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, pp = { class: "text" }, gp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, vp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, yp = { class: "overall" }, bp = { class: "overall-figure" }, kp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, wp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, $p = {
  key: 5,
  class: "part"
}, xp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", dp, [
        m("div", fp, [
          O(cp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", R(fi)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", hp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : b("", !0)
        ]),
        e.plan.reason ? (r(), d("section", mp, [
          m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          m("p", pp, v(e.plan.reason), 1)
        ])) : b("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", gp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : b("", !0),
        e.plan.total ? (r(), d("section", vp, [
          n[0] || (n[0] = m("h4", null, "Progress", -1)),
          m("div", yp, [
            O(Ti, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            m("span", bp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : b("", !0),
        e.plan.assignee ? (r(), d("p", kp, [
          O(Dt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", wp, [
          R(Na)(e.plan) ? (r(), F(Dt, {
            key: 0,
            name: R(Na)(e.plan).name,
            main: R(Na)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(P, { key: 1 }, [
            K(" Delegated ")
          ], 64))
        ])) : b("", !0),
        e.plan.brief ? (r(), d("section", $p, [
          n[1] || (n[1] = m("h4", null, "The brief", -1)),
          O(Oi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: D(() => [
              O(lt, {
                class: "text",
                "data-resource-text": "",
                text: e.plan.brief
              }, null, 8, ["text"])
            ]),
            _: 1
          }, 8, ["name"])
        ])) : b("", !0)
      ]);
    };
  }
}, R6 = /* @__PURE__ */ U(xp, [["__scopeId", "data-v-8c7a9053"]]), Sp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), F(Ke(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: D(() => [
        ue(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          ue(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Mp = /* @__PURE__ */ U(Sp, [["__scopeId", "data-v-683e1839"]]), Ui = (e) => `row:${e}`, _p = 5e3, Cp = "cancelled", qa = /* @__PURE__ */ new Map();
async function Ap(e, t) {
  const n = `${e.environment}:${t}`, a = qa.get(n);
  if (a && performance.now() - a.at < _p) {
    const o = await a.answer;
    if (o.failure !== Cp) return o;
    qa.delete(n);
  }
  const s = e.read(`agent tip ${Ui(t)}`);
  return qa.set(n, { answer: s, at: performance.now() }), s;
}
function Ep(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Sn(e, t = Date.now()) {
  const n = Ep(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Op = 36e5;
function Tp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Op;
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
const Da = (e) => String(e).padStart(2, "0");
function Vi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Da(t % 60)}s` : `${Math.floor(t / 3600)}h ${Da(Math.floor(t % 3600 / 60))}m ${Da(t % 60)}s`;
}
const Ip = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, Bp = { state: "retired", words: "Retired" }, Rp = (e) => e.retired ? Bp : Ip[e.activity], Lp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), Np = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${Sn(e, t)}` : "", qp = (e, t) => e ? `Seen: ${Sn(e, t)}` : "", Dp = {
  class: "line head",
  "data-agent-tip-head": ""
}, Pp = { key: 0 }, jp = {
  class: "line",
  "data-agent-tip-identity": ""
}, Fp = {
  class: "line status",
  "data-agent-tip-status": ""
}, Wp = ["data-state"], Hp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, zp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, Up = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, Gp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, Vp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Se(Le, null), a = C(!1), s = C(null), o = C(""), l = C(Date.now()), i = S(() => Rp(s.value)), u = S(() => Np(s.value.since, l.value)), c = S(() => qp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await Ap(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, g) => (r(), F(Mp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Hl({
      default: D(() => [
        ue(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: D(() => [
          s.value ? (r(), d(P, { key: 0 }, [
            m("span", Dp, [
              m("b", null, v(s.value.title), 1),
              g[0] || (g[0] = K()),
              s.value.name ? (r(), d("span", Pp, v(s.value.name), 1)) : b("", !0)
            ]),
            m("span", jp, v(R(Lp)(s.value)), 1),
            m("span", Fp, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, Wp),
              K(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", Hp, v(u.value), 1)) : b("", !0),
            c.value ? (r(), d("span", zp, v(c.value), 1)) : b("", !0)
          ], 64)) : (r(), d("b", Up, v(e.label), 1)),
          o.value ? (r(), d("span", Gp, v(o.value), 1)) : b("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, fn = /* @__PURE__ */ U(Vp, [["__scopeId", "data-v-71d17663"]]), Kp = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Yp = { class: "agent-word" }, Qp = {
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
    return (o, l) => s.value.length ? (r(), d("div", Kp, [
      (r(!0), d(P, null, ne(s.value, (i) => (r(), F(fn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: R(lo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => R(je)(`agents:${i.id}`)
      }, {
        default: D(() => [
          m("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          O(Dt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", Yp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : b("", !0);
  }
}, Jp = /* @__PURE__ */ U(Qp, [["__scopeId", "data-v-619caeed"]]), Xp = { class: "phases" }, Zp = { class: "phead" }, e1 = { class: "mark" }, t1 = { class: "ptitle" }, n1 = { class: "phead-end" }, a1 = {
  key: 0,
  class: "checkpoint"
}, s1 = { class: "progress" }, o1 = {
  key: 0,
  class: "when"
}, l1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", Xp, [
      (r(!0), d(P, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", Zp, [
          m("span", e1, [
            O(ie, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", t1, v(i + 1) + ". " + v(l.title), 1),
          m("span", n1, [
            l.checkpoint ? (r(), d("span", a1, "checkpoint")) : b("", !0),
            m("span", s1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", o1, v(l.goal), 1)) : b("", !0),
        O(Jp, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(P, null, ne(l.tasks, (u) => ue(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, L6 = /* @__PURE__ */ U(l1, [["__scopeId", "data-v-05aaa685"]]), i1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, r1 = { ...i1, done: "Completed" }, u1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), c1 = (e) => u1.has(e), hn = (e) => c1(e) ? "done" : e, d1 = { class: "task-status-icon" }, f1 = ["width", "height", "aria-label"], h1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = S(() => fi("task", hn(t.status))), a = S(() => n.value === "testing" ? "started" : n.value), s = S(() => r1[t.status] ?? cn("task", t.status));
    return (o, l) => (r(), d("span", d1, [
      O(Gt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (r(), d("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            O(Vt, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
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
              done: D(() => [...l[1] || (l[1] = [
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
              started: D(() => [...l[2] || (l[2] = [
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
              asked: D(() => [...l[3] || (l[3] = [
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
              paused: D(() => [...l[4] || (l[4] = [
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
              planned: D(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, f1))
        ]),
        _: 1
      })
    ]));
  }
}, ka = /* @__PURE__ */ U(h1, [["__scopeId", "data-v-ae24a63f"]]), m1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, p1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, g1 = {
  key: 2,
  class: "empty"
}, v1 = { class: "day" }, y1 = { class: "events" }, b1 = { class: "mark" }, k1 = { class: "what" }, w1 = { class: "head" }, $1 = { class: "word" }, x1 = ["title", "onClick"], S1 = { class: "at" }, M1 = {
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
    return pe(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", m1, [
      l.value ? (r(), d("p", p1, v(l.value), 1)) : o.value === null ? (r(), F(Qe, { key: 1 })) : o.value.length ? b("", !0) : (r(), d("p", g1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(P, null, ne(i.value, (g) => (r(), d(P, {
        key: g.day
      }, [
        m("h3", v1, v(g.day), 1),
        m("ol", y1, [
          (r(!0), d(P, null, ne(g.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", b1, [
              n[y.event_type].state ? (r(), F(ka, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), F(ie, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", k1, [
              m("div", w1, [
                m("span", $1, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (k) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, x1),
                m("span", S1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), F(lt, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : b("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, N6 = /* @__PURE__ */ U(M1, [["__scopeId", "data-v-9e511133"]]), _1 = 1e3;
function Ki() {
  const e = C(Date.now()), t = setInterval(() => e.value = Date.now(), _1);
  return nt(() => clearInterval(t)), e;
}
const C1 = Symbol("resource-subscriptions");
function Mn(e, t, n = () => !0) {
  const a = Se(C1, () => new ai(), !0), s = zs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  pa(() => {
    o(), s.cancel();
  });
}
function A1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Yi = { compact: "Compaction", clear: "Clear" }, E1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, O1 = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function T1(e) {
  return e != null && e.is_open ? `${Yi[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function I1(e) {
  if (!e) return [];
  const t = [["Last context change", `${Yi[e.change]}: ${O1[e.state]}`], ["Asked by", E1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const B1 = "Not known", R1 = 80, L1 = 1e3, N1 = "worker", q1 = "main", D1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), P1 = (e) => e.ok ? e.value.rows : [], j1 = (e, t) => e.ended_at ? "ended" : e.paused_at || D1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Qi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function F1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / L1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Vi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > R1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? B1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === N1 && l.push({ key: "pace", label: "Tasks an hour", value: String(Tp(Qi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === q1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function W1(e) {
  const t = Qi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function H1(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", Zo(e.created_at)]), e.ended_at && a.push(["Ended", Zo(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...I1(n)), a;
}
const z1 = { class: "band" }, U1 = { key: 0 }, G1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", z1, [
      O(ie, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", U1, v(e.count), 1)) : b("", !0)
    ]));
  }
}, Ht = /* @__PURE__ */ U(G1, [["__scopeId", "data-v-1758914f"]]), V1 = { class: "number" }, K1 = { class: "text" }, Y1 = 150, Q1 = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = C(!1), a = S(() => t.text.length > Y1), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(P, null, [
      e.text ? (r(), d(P, { key: 0 }, [
        O(Ht, { icon: "file" }, {
          default: D(() => [
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
        }, "Show all")) : b("", !0)
      ], 64)) : b("", !0),
      e.points.length ? (r(), d(P, { key: 1 }, [
        O(Ht, { icon: "points" }, {
          default: D(() => [...l[1] || (l[1] = [
            K("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(P, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", V1, v(i.id), 1),
            m("span", K1, [
              K(v(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : b("", !0)
    ], 64));
  }
}, J1 = /* @__PURE__ */ U(Q1, [["__scopeId", "data-v-c99de22c"]]), X1 = ["aria-expanded"], Z1 = { class: "count" }, eg = {
  key: 0,
  "data-agent-fold-body": ""
}, tg = {
  __name: "AgentFold",
  props: /* @__PURE__ */ jt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = rn(e, "open");
    return (n, a) => (r(), d(P, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        O(ie, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        K(v(e.label), 1),
        m("span", Z1, v(e.count), 1),
        O(ie, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, X1),
      t.value ? (r(), d("div", eg, [
        ue(n.$slots, "default", {}, void 0, !0)
      ])) : b("", !0)
    ], 64));
  }
}, Pa = /* @__PURE__ */ U(tg, [["__scopeId", "data-v-7f93d8d9"]]), ng = ["onClick"], ag = { class: "text" }, sg = { class: "aside" }, og = {
  key: 0,
  class: "none"
}, lg = {
  class: "skills",
  "data-agent-skills": ""
}, ig = {
  key: 0,
  class: "none-inline"
}, rg = { class: "label" }, ug = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ut({ helpers: !1, skills: !1 }), a = C([]), s = C([]), o = async (l) => P1(await t.read(l));
    return pe(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(P, null, [
      O(Pa, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => R(yt)("agents", u.id)
          }, [
            m("span", ag, v(R(Wt)(u).title), 1),
            m("span", sg, v(R(Wt)(u).subtext), 1)
          ], 8, ng))), 128)),
          a.value.length ? b("", !0) : (r(), d("p", og, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      O(Pa, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: D(() => [
          m("p", lg, [
            (r(!0), d(P, null, ne(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? b("", !0) : (r(), d("span", ig, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      O(Pa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", rg, v(u) + ":", 1),
            m("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, cg = /* @__PURE__ */ U(ug, [["__scopeId", "data-v-1281605f"]]), dg = ["datetime", "title"], tt = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ki(), a = S(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(R(Sn)(e.at, R(n))), 9, dg));
  }
}, fg = {
  class: "now",
  "data-agent-now": ""
}, hg = {
  key: 1,
  class: "muted"
}, mg = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, pg = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, gg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, vg = { class: "line" }, yg = { class: "detail" }, bg = { class: "bar" }, kg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = S(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(P, null, [
      O(Ht, { icon: "play" }, {
        default: D(() => [...o[2] || (o[2] = [
          K("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", fg, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => R(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", hg, v(e.nothing), 1)),
        n.value ? (r(), d("span", mg, v(n.value), 1)) : b("", !0),
        e.inspection.last_activity ? (r(), d("span", pg, [
          o[3] || (o[3] = K("Seen: ", -1)),
          O(tt, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : b("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", gg, [
        m("div", vg, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => R(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", yg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", bg, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : b("", !0)
    ], 64));
  }
}, wg = /* @__PURE__ */ U(kg, [["__scopeId", "data-v-ff25c609"]]), $g = ["onClick"], xg = { class: "text" }, Sg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Mg = { class: "text" }, _g = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Cg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(P, null, [
      O(Ht, { icon: "clock" }, {
        default: D(() => [...n[0] || (n[0] = [
          K("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(P, null, ne(e.moves, (a) => (r(), d(P, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => R(yt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", xg, v(a.text), 1),
          O(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, $g)) : (r(), d("div", Sg, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", Mg, v(a.text), 1),
          O(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? b("", !0) : (r(), d("p", _g, "Nothing yet."))
    ], 64));
  }
}, Ag = /* @__PURE__ */ U(Cg, [["__scopeId", "data-v-58f0db57"]]), Eg = {
  class: "strip",
  "data-agent-strip": ""
}, Og = ["data-agent-cell"], Tg = {
  key: 0,
  class: "meter"
}, Ig = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Eg, [
      (r(!0), d(P, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Tg, [
          m("i", {
            class: Y({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : b("", !0)
      ], 8, Og))), 128))
    ]));
  }
}, Bg = /* @__PURE__ */ U(Ig, [["__scopeId", "data-v-b6657ab7"]]), Rg = {}, Lg = { class: "menu-label" };
function Ng(e, t) {
  return r(), d("span", Lg, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const _t = /* @__PURE__ */ U(Rg, [["render", Ng], ["__scopeId", "data-v-aa955b3e"]]), qg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Dg = {
  key: 0,
  class: "skills-none"
}, Pg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.skills.filter((l) => l.state === "loaded")), o = S(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", qg, [
      O(_t, null, {
        default: D(() => [...i[1] || (i[1] = [
          K("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? b("", !0) : (r(), d("p", Dg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(P, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        O(ie, {
          name: "book",
          size: 12
        }),
        K(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(P, { key: 1 }, [
        O(_t, null, {
          default: D(() => [...i[2] || (i[2] = [
            K("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(P, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          O(ie, {
            name: "book",
            size: 12
          }),
          K(v(u.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      O(Ue, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: D(() => [...i[3] || (i[3] = [
          K("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, jg = /* @__PURE__ */ U(Pg, [["__scopeId", "data-v-be514d47"]]), Fg = ["disabled", "title"], Wg = { class: "gauge usage" }, Hg = {
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
      O(ie, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = K()),
      m("span", Wg, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      K(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Fg)) : b("", !0);
  }
}, zg = /* @__PURE__ */ U(Hg, [["__scopeId", "data-v-a36f09dc"]]), Ug = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["badge", e.tone])
    }, v(e.text), 3));
  }
}, io = /* @__PURE__ */ U(Ug, [["__scopeId", "data-v-9e7e1157"]]);
function Gg(e, t, n, { groups: a, programs: s }) {
  const o = C({}), l = C(""), i = C(!1), u = S(() => !!e.value && !e.value.ended_at), c = S(() => u.value && !!e.value.paused_at);
  async function f(k, _ = null) {
    l.value = "";
    const x = await Kl(_, k, t);
    return l.value = x.ok ? "" : x.error, n(), x;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (k, _) => f(["agent", "control", String(e.value.number), k, _.value], { target: o, fields: { value: { ...o.value, [k]: _.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (k) => f(["agent", "launch", k.name]) };
}
const Vg = ["disabled", "title"], Kg = ["disabled", "title"], Yg = { class: "gauge" }, Qg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Jg = ["disabled", "title"], Xg = ["disabled"], Zg = ["disabled"], ev = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, tv = ["title"], nv = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, av = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, sv = { class: "gauge" }, ov = { class: "context-used" }, lv = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, iv = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, rv = 75, uv = {
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
    const n = e, a = t, s = Gg(Ca(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ca(n, "controlGroups"), programs: Ca(n, "agentPrograms") }), o = C(null), l = C(""), i = S(() => s.groups.value.find((N) => N.key === l.value));
    function u(N, E) {
      o.value = N.currentTarget, l.value = E;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = S(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      u(N, "skills"), a("skills");
    }
    const g = (N) => s.groups.value.some((E) => E.key === N), y = S(() => {
      var N;
      return s.chosen.value.model ?? ((N = _.value) == null ? void 0 : N.model) ?? "";
    }), k = S(() => {
      var N;
      return s.chosen.value.effort ?? ((N = _.value) == null ? void 0 : N.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const _ = S(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((E) => {
        var L;
        return E.id === ((L = n.agent) == null ? void 0 : L.id);
      })) ?? null;
    }), x = S(() => {
      var N;
      return ((N = _.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(_.value.context_percent);
    }), M = S(() => {
      var N;
      return T1(((N = _.value) == null ? void 0 : N.context_change) ?? null);
    }), T = (N) => `${Math.round(N / 1e3)}k`, H = S(() => {
      var N;
      return !!((N = _.value) != null && N.context_limit_tokens);
    }), W = S(() => {
      var N, E;
      return ((N = _.value) == null ? void 0 : N.context_limit_tokens) || ((E = _.value) == null ? void 0 : E.context_window_tokens) || 0;
    }), I = S(() => W.value ? `${T(_.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), z = S(() => {
      var N;
      return (N = _.value) != null && N.cost_dollars ? `$${_.value.cost_dollars.toFixed(2)}` : "";
    });
    return (N, E) => {
      var L, q;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(P, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: E[0] || (E[0] = (w) => u(w, "agent"))
          }, [
            O(ie, {
              name: "agents",
              size: 12
            }),
            K(" " + v(((L = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : L.title) || e.agent.program), 1)
          ], 8, Vg),
          O(zg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: E[1] || (E[1] = (w) => a("open", "usage", w))
          }, null, 8, ["windows", "disabled"]),
          x.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${x.value}% full: clear or compact it`,
            onClick: E[2] || (E[2] = (w) => g("context") ? u(w, "context") : a("open", "context", w.currentTarget))
          }, [
            O(ie, {
              name: "gauge",
              size: 12
            }),
            E[14] || (E[14] = K()),
            m("span", Yg, [
              m("span", {
                style: ve({ width: `${x.value}%` })
              }, null, 4)
            ]),
            K(" " + v(x.value) + "% ", 1)
          ], 8, Kg)) : (q = _.value) != null && q.context_unknown ? (r(), d("span", Qg, [
            O(ie, {
              name: "gauge",
              size: 12
            }),
            E[15] || (E[15] = K(" Context: unknown", -1))
          ])) : b("", !0),
          y.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: E[3] || (E[3] = (w) => g("model") ? u(w, "model") : null)
          }, [
            O(ie, {
              name: "model",
              size: 12
            }),
            K(" " + v(y.value), 1)
          ], 8, Jg)) : b("", !0),
          g("effort") || e.card && k.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: E[4] || (E[4] = (w) => u(w, "effort"))
          }, [
            O(ie, {
              name: "bolt",
              size: 12
            }),
            K(" " + v(k.value), 1)
          ], 8, Xg)) : b("", !0),
          z.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: E[5] || (E[5] = (w) => a("open", "cost", w.currentTarget))
          }, v(z.value), 9, Zg)) : b("", !0),
          e.branch ? (r(), d("span", ev, [
            O(ie, {
              name: "branch",
              size: 12
            }),
            K(" " + v(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: E[6] || (E[6] = (w) => a("open", "jobs", w.currentTarget))
          }, [
            O(ie, {
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
            O(ie, {
              name: "book",
              size: 12
            }),
            K(" " + v(f.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (r(), d(P, { key: 8 }, [
            m("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < rv }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: E[7] || (E[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              O(ie, {
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
              onClick: E[8] || (E[8] = (w) => a("open", "load", w.currentTarget))
            }, [
              O(ie, {
                name: "weight",
                size: 12
              }),
              K(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: E[9] || (E[9] = (w) => u(w, "start"))
        }, [
          O(ie, {
            name: "agents",
            size: 12
          }),
          E[16] || (E[16] = K(" Start an agent", -1))
        ])) : b("", !0),
        E[22] || (E[22] = m("span", { class: "space" }, null, -1)),
        R(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: R(s).failure.value
        }, v(R(s).failure.value), 9, tv)) : b("", !0),
        ue(N.$slots, "default", {}, void 0, !0),
        o.value ? (r(), F(ga, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: D(() => {
            var w;
            return [
              l.value === "agent" ? (r(), d(P, { key: 0 }, [
                R(s).asking.value ? (r(), d(P, { key: 0 }, [
                  O(_t, { "data-agent-stop-ask": "" }, {
                    default: D(() => [...E[17] || (E[17] = [
                      K("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  O(Ue, {
                    "data-agent-stop-confirm": "",
                    onClick: E[10] || (E[10] = (p) => (c(), R(s).stop()))
                  }, {
                    default: D(() => [...E[18] || (E[18] = [
                      K("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  O(Ue, {
                    onClick: E[11] || (E[11] = (p) => R(s).asking.value = !1)
                  }, {
                    default: D(() => [...E[19] || (E[19] = [
                      K("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), F(Ue, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: E[12] || (E[12] = (p) => R(s).asking.value = !0)
                }, {
                  default: D(() => [...E[20] || (E[20] = [
                    K("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(P, { key: 1 }, [
                O(_t, null, {
                  default: D(() => [...E[21] || (E[21] = [
                    K("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(P, null, ne(R(s).programs.value, (p) => (r(), F(Ue, {
                  key: p.name,
                  "data-agent-program": p.name,
                  onClick: ($) => (c(), R(s).start(p))
                }, {
                  default: D(() => [
                    K(v(p.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), F(jg, {
                key: 2,
                skills: e.skills,
                onBrowse: E[13] || (E[13] = (p) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(P, { key: 3 }, [
                O(_t, null, {
                  default: D(() => [
                    K(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(P, { key: 0 }, [
                  m("p", nv, v(R(A1)(((w = _.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  m("div", av, [
                    m("span", sv, [
                      m("span", {
                        style: ve({ width: `${x.value}%` })
                      }, null, 4)
                    ]),
                    m("span", ov, v(x.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", lv, [
                    K(v(I.value) + " ", 1),
                    H.value ? (r(), F(io, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : b("", !0)
                  ])) : b("", !0)
                ], 64)) : b("", !0),
                l.value === "context" && M.value ? (r(), d("p", iv, v(M.value), 1)) : (r(!0), d(P, { key: 2 }, ne(i.value.choices, (p) => (r(), F(Ue, {
                  key: p.value,
                  "data-agent-choice": p.value,
                  onClick: ($) => (R(s).choose(i.value.key, p), c())
                }, {
                  default: D(() => [
                    K(v(p.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : b("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : b("", !0)
      ], 2);
    };
  }
}, cv = /* @__PURE__ */ U(uv, [["__scopeId", "data-v-d7113347"]]), dv = {
  class: "who",
  "data-agent-who": ""
}, fv = { class: "name" }, hv = ["data-agent-state"], mv = {
  class: "sub",
  "data-agent-started-by": ""
}, pv = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", dv, [
      m("h2", fv, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, hv),
        K(v(e.name), 1)
      ]),
      O(cv, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", mv, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, gv = /* @__PURE__ */ U(pv, [["__scopeId", "data-v-83bd4a9d"]]), vv = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, yv = { class: "scroll" }, bv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, kv = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, wv = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ki(), a = C(null), s = C(null), o = C(null), l = C(null), i = C({}), u = C({ helpers: 0, skills: 0 }), c = C(0), f = C([]), h = C([]), g = C("");
    let y = 0;
    const k = S(() => {
      var T;
      return a.value.ended_at ? W1(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function _() {
      const T = ++y, H = await t.read(["usage", "inspector", Ui(t.id), "--environment", t.environment]);
      T === y && (g.value = H.ok ? "" : H.error, H.ok && (a.value = H.value.agent, s.value = H.value.facts, o.value = H.value.inspection, l.value = H.value.compaction ?? null, i.value = H.value.tool, u.value = { helpers: H.value.helpers, skills: H.value.skills }, f.value = H.value.points, h.value = H.value.programs, c.value += 1));
    }
    const x = S(() => /* @__PURE__ */ new Set([t.id])), M = {
      agent: (T) => si(T, x.value),
      hook_call: (T) => wc(T, "session_agent_id", x.value)
    };
    return Mn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], _, (T) => {
      var H;
      return ((H = M[T.event.split(".")[0]]) == null ? void 0 : H.call(M, T)) ?? !0;
    }), Me(_), (T, H) => {
      var W, I;
      return r(), d("article", vv, [
        m("div", yv, [
          g.value ? (r(), d("p", bv, v(g.value), 1)) : a.value && o.value ? (r(), d(P, { key: 1 }, [
            O(gv, {
              name: R(Wt)(a.value, s.value).text,
              state: R(j1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: h.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            O(Bg, {
              cells: R(F1)({ row: a.value, facts: s.value, inspection: o.value, now: R(n) })
            }, null, 8, ["cells"]),
            O(wg, {
              inspection: o.value,
              tool: i.value,
              nothing: k.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            O(J1, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((I = s.value) == null ? void 0 : I.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            O(Ag, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            O(cg, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: R(H1)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", kv, "Ended " + v(R(Sn)(a.value.ended_at, R(n))) + ". It takes no more actions.", 1)) : b("", !0)
          ], 64)) : (r(), F(Qe, { key: 2 }))
        ])
      ]);
    };
  }
}, q6 = /* @__PURE__ */ U(wv, [["__scopeId", "data-v-b88512f5"]]);
function $v(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), nt(() => n.disconnect()), t;
}
const xv = ["data-comment-id"], Sv = {
  key: 0,
  class: "comment-top"
}, Mv = { class: "comment-mark" }, _v = {
  class: "comment-body",
  "data-comment": ""
}, Cv = { class: "comment-foot" }, Av = {
  key: 1,
  "data-comment-lost": ""
}, Ev = {
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
      e.comment.quote ? (r(), d("div", Sv, [
        m("span", Mv, v(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : b("", !0),
      m("p", _v, v(e.comment.body), 1),
      m("div", Cv, [
        e.comment.created_at ? (r(), F(tt, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : b("", !0),
        e.lost ? (r(), d("span", Av, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : b("", !0)
      ])
    ], 10, xv));
  }
}, Ji = /* @__PURE__ */ U(Ev, [["__scopeId", "data-v-a37d4507"]]);
var Wl;
/Mac|iPhone|iPad/.test(((Wl = navigator.userAgentData) == null ? void 0 : Wl.platform) || navigator.platform);
function Xi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Ov = {
  class: "comment-box",
  "data-comment-box": ""
}, Tv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Iv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Bv = { class: "comment-row" }, Rv = ["placeholder"], Lv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ jt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ jt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = rn(e, "draft"), l = C(""), i = C(!1), u = C(null), c = S(() => {
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
        } catch (k) {
          l.value = k.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, k) => (r(), d("div", Ov, [
      e.selection ? (r(), d("div", Tv, [
        k[3] || (k[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        O(va, {
          title: "Comment on the whole document instead",
          onClick: k[0] || (k[0] = (_) => s("clear"))
        })
      ])) : b("", !0),
      l.value ? (r(), d("p", Iv, v(l.value), 1)) : b("", !0),
      m("div", Bv, [
        et(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": k[1] || (k[1] = (_) => o.value = _),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: k[2] || (k[2] = Ct((_) => R(Xi)(_, g), ["enter"]))
        }, null, 42, Rv), [
          [ea, o.value]
        ]),
        O(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: g
        }, {
          default: D(() => [...k[4] || (k[4] = [
            K("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Nv = /* @__PURE__ */ U(Lv, [["__scopeId", "data-v-41d2081c"]]), Dn = (e) => e ? e.split(", ") : [];
function qv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Dv(e, t) {
  return {
    reads: Dn(e.reads_allowed),
    runs: Dn(e.runs_allowed),
    missing: [...Dn(e.reads_missing), ...Dn(e.runs_missing)],
    ask: t
  };
}
const Pv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = cu("SkeletonParts", !0);
      return r(!0), d(P, null, ne(e.parts, (u, c) => (r(), d(P, { key: c }, [
        (r(!0), d(P, null, ne(u.count, (f) => (r(), F(Vt, {
          key: f,
          value: u.shape
        }, {
          line: D(() => [
            O(tn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            O(tn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            O(tn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), jv = /* @__PURE__ */ U(Pv, [["__scopeId", "data-v-fa8baeaf"]]), Fv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Wv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Fv, [
      O(jv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ro = /* @__PURE__ */ U(Wv, [["__scopeId", "data-v-52f66b64"]]), Zi = {
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
}, Hv = { class: "bars" }, zv = { class: "bar-name" }, Uv = { class: "bar-value" }, Gv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = S(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Hv, [
      (r(!0), d(P, null, ne(e.items, (u, c) => (r(), F(Ke(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: D(() => [
          m("span", zv, v(u.label), 1),
          O(Ti, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Uv, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Vv = /* @__PURE__ */ U(Gv, [["__scopeId", "data-v-663427f4"]]), Kv = { class: "bars" }, Yv = {
  key: 0,
  class: "bars-title"
}, Qv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Kv, [
      e.node.title ? (r(), d("span", Yv, v(e.node.title), 1)) : b("", !0),
      O(Vv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Jv = /* @__PURE__ */ U(Qv, [["__scopeId", "data-v-7135bb11"]]), Xv = {
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
      (r(!0), d(P, null, ne(e.node.children || [], (u, c) => (r(), F(er, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Vn = /* @__PURE__ */ U(Xv, [["__scopeId", "data-v-d142a3f4"]]), Zv = {
  key: 0,
  class: "card-head"
}, ey = { class: "card-title" }, ty = {
  key: 0,
  class: "card-note"
}, ny = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Zv, [
        m("span", ey, v(e.node.title), 1),
        e.node.note ? (r(), d("span", ty, v(e.node.note), 1)) : b("", !0)
      ])) : b("", !0),
      O(Vn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ay = /* @__PURE__ */ U(ny, [["__scopeId", "data-v-67b72d40"]]), sy = { class: "fact" }, oy = { class: "fact-label" }, ly = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", sy, [
      m("span", oy, v(e.label), 1),
      O(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, iy = /* @__PURE__ */ U(ly, [["__scopeId", "data-v-3a88ecf8"]]), ry = { class: "list" }, uy = { class: "list-label" }, cy = {
  key: 1,
  class: "list-note"
}, dy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", ry, [
      (r(!0), d(P, null, ne(e.items, (o, l) => (r(), F(Ke(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          m("span", uy, v(o.label), 1),
          o.badge ? (r(), F(io, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : b("", !0),
          o.note ? (r(), d("span", cy, v(o.note), 1)) : b("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, fy = /* @__PURE__ */ U(dy, [["__scopeId", "data-v-ebe2ae0a"]]), hy = { class: "table" }, my = {
  key: 0,
  class: "table-row empty"
}, py = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", hy, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (r(!0), d(P, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(P, null, ne(e.rows, (i, u) => (r(), F(Ke(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", my, v(e.empty), 1)) : b("", !0)
    ]));
  }
}, gy = /* @__PURE__ */ U(py, [["__scopeId", "data-v-9326a52e"]]), vy = { class: "stat-value" }, yy = { class: "stat-label" }, by = {
  key: 0,
  class: "stat-note"
}, ky = {
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
      default: D(() => [
        m("span", vy, v(e.value), 1),
        m("span", yy, v(e.label), 1),
        e.note ? (r(), d("span", by, v(e.note), 1)) : b("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, wy = /* @__PURE__ */ U(ky, [["__scopeId", "data-v-ad0db6d6"]]), $y = { class: "code" }, xy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (r(), F(Vt, {
      value: e.node.type
    }, {
      stack: D(() => [
        O(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        O(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        O(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        O(ay, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        O(wy, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        O(Jv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        O(gy, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        O(fy, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        O(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        O(iy, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        O(io, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        m("pre", $y, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), er = /* @__PURE__ */ U(xy, [["__scopeId", "data-v-cbdcf540"]]), Sy = { class: "dashboard" }, My = { class: "trail" }, _y = ["onClick"], Cy = {
  key: 0,
  class: "gone",
  role: "status"
}, Ay = {
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
    ), (g, y) => (r(), d("div", Sy, [
      e.document.broken ? (r(), F(un, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          K(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), F(un, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          K(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(P, { key: 2 }, [
        m("nav", My, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (k) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(P, null, ne(l.value, (k, _) => (r(), d(P, {
            key: `${_}-${k}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: _ === l.value.length - 1 }]),
              onClick: (x) => h(_ + 1)
            }, v(c(k)), 11, _y)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Cy, "What you opened is no longer in this dashboard. Here is its start page.")) : b("", !0),
        O(Gt, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              O(er, {
                node: u.value.view,
                onOpen: f,
                onFile: y[1] || (y[1] = (k) => a("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : b("", !0)
    ]));
  }
}, Ey = /* @__PURE__ */ U(Ay, [["__scopeId", "data-v-fbe83734"]]);
function Oy(e, t) {
  const n = at(), a = zs(e, Zi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), nt(() => {
    s(), a.cancel();
  });
}
const Ty = {
  key: 0,
  class: "window-failure"
}, Iy = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = C(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Oy(l, n.events) : Ws(l, () => !0, Zi.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", Ty, v(o.value.error), 1)) : o.value ? (r(), F(Ey, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : b("", !0);
  }
}, By = 1e4;
class Ry {
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
    return this.heardAt !== null && t - this.heardAt > By;
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
const Ly = {
  key: 0,
  class: "frame-note"
}, Ny = {
  key: 0,
  class: "frame-note"
}, qy = ["src", "title"], Dy = 1e3, Py = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = C(null), s = C(!1), o = C(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new Ry(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Dy);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", Ly, "This window was closed because it stopped answering.")) : (r(), d(P, { key: 1 }, [
      s.value ? (r(), d("div", Ny, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        O(ge, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: D(() => [...c[1] || (c[1] = [
            K("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : b("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: R(n).window
      }, null, 8, qy)
    ], 64));
  }
}, jy = /* @__PURE__ */ U(Py, [["__scopeId", "data-v-32a49046"]]), Fy = {
  class: "allowance-prompt",
  role: "dialog"
}, Wy = { class: "allowance-prompt-text" }, Hy = { class: "allowance-prompt-buttons" }, zy = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Fy, [
      m("p", Wy, v(R(qv)(e.request)), 1),
      m("div", Hy, [
        O(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            K("Allow", -1)
          ])]),
          _: 1
        }),
        O(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            K("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Uy = /* @__PURE__ */ U(zy, [["__scopeId", "data-v-cad69fe2"]]), ja = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(un, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        K(v(e.reason) + " ", 1),
        e.retry ? (r(), F(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            K("Retry", -1)
          ])]),
          _: 1
        })) : b("", !0),
        e.removable ? (r(), F(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            K("Remove tab", -1)
          ])]),
          _: 1
        })) : b("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Gy = ["data-window", "data-agent"], Vy = {
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
    const i = Se(Ic, null), u = Hd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: S(() => n.options),
      declared: n.declared,
      page: Se(Dd, null),
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
    Ps(Le, u), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Me(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), du((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ha(n.component), f = () => {
      var h, g;
      return ((g = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, g) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), F(Uy, {
        key: 0,
        request: f(),
        onAnswer: g[0] || (g[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : b("", !0),
      e.unavailableReason ? (r(), F(ja, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), F(ja, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(P, { key: 4 }, [
        (r(), F(c, { key: o.value })),
        e.skeleton.length && !R(u).answered.value ? (r(), F(ro, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : b("", !0)
      ], 64)) : (r(), F(ja, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Gy));
  }
}, nn = /* @__PURE__ */ U(Vy, [["__scopeId", "data-v-c4443e2b"]]), tr = {
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
    const n = e, a = t, s = { render: () => ha(jy, { src: n.entry.entry_url }) };
    return (o, l) => (r(), F(nn, {
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
}, Ky = ["data-window"], nr = {
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
    const n = e, a = t, s = Ze(null), o = C("");
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
      O(ro, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Ky)) : (r(), F(nn, {
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
}, Yy = {
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
    const n = t, a = e, s = S(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = S(() => s.value && { render: () => ha(Iy, { line: s.value.line, events: s.value.events }) }), l = C(null), i = S(() => {
      var g, y;
      return ((g = s.value) == null ? void 0 : g.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = S(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = S(
      () => {
        var g, y;
        return l.value ? Dv(l.value, h) : { reads: ((g = s.value) == null ? void 0 : g.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var k, _;
      return !s.value && ((k = e.catalogue.loaded) == null ? void 0 : k.value) === !1 ? (r(), F(ro, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((_ = s.value) == null ? void 0 : _.shows) === "one-agent" && e.agent === null ? (r(), F(un, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), F(nn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), F(nr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (x, M) => n("option", x, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), F(tr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (x, M) => n("option", x, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), F(nn, {
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
        onOption: y[2] || (y[2] = (x, M) => n("option", x, M))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), F(nn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (x) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Qy = ["data-section"], Jy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Xy = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(Ys, null), a = S(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = S(() => ({ row: t.row }));
    return (o, l) => R(n) ? (r(!0), d(P, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), F(Yy, {
        key: 0,
        name: i.name,
        catalogue: R(n).catalogue,
        subscriptions: R(n).subscriptions,
        environment: R(n).environment,
        prompts: R(n).prompts,
        "shell-read": R(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", Jy, v(i.name) + " is not available", 1))
    ], 8, Qy))), 128)) : b("", !0);
  }
}, Ms = /* @__PURE__ */ U(Xy, [["__scopeId", "data-v-a47d36b7"]]), Zy = { class: "rail-head" }, e0 = { key: 0 }, t0 = {
  key: 1,
  class: "rail-none"
}, n0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Zy, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", e0, v(e.total || e.comments.length), 1)) : b("", !0)
      ]),
      e.comments.length ? (r(!0), d(P, { key: 0 }, ne(e.comments, (a) => (r(), F(Ji, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", t0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, a0 = /* @__PURE__ */ U(n0, [["__scopeId", "data-v-4d684649"]]), s0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, o0 = ["aria-pressed"], l0 = ["aria-pressed"], i0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, r0 = {
  key: 0,
  role: "alert"
}, u0 = {
  key: 1,
  class: "sidebar-none"
}, c0 = ["data-question-id"], d0 = { class: "question-state" }, f0 = ["data-question-show", "onClick"], h0 = {
  key: 0,
  class: "sidebar-none"
}, m0 = {
  key: 1,
  class: "question-answer"
}, p0 = {
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
    const t = Se(Ys, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", s0, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, o0),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, l0)
      ]),
      e.mode === "comments" ? (r(), d(P, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), F(a0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : b("", !0),
        O(wn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", i0, [
        e.failure ? (r(), d("p", r0, v(e.failure), 1)) : e.questions.length ? b("", !0) : (r(), d("p", u0, "No questions about this text yet.")),
        (r(!0), d(P, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", d0, v(R(cn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, f0),
            s.quote ? (r(), d(P, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", h0, "The quoted text has changed.")) : b("", !0)
            ], 64)) : b("", !0),
            s.answer ? (r(), d("p", m0, "Answered: " + v(s.answer), 1)) : b("", !0),
            O(Ms, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            O(eo, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = R(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, c0);
        }), 128))
      ]))
    ], 2));
  }
}, tl = /* @__PURE__ */ U(p0, [["__scopeId", "data-v-660e5c85"]]), g0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, v0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ut({ abstract: n.row.abstract, body: n.row.body }), o = C("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), F(ya, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: D(() => [
        m("span", g0, v(o.value), 1),
        O(ge, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: D(() => [...u[6] || (u[6] = [
            K("Cancel", -1)
          ])]),
          _: 1
        }),
        O(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: D(() => [...u[7] || (u[7] = [
            K("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: D(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: $e(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            et(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [ea, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            et(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [ea, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, y0 = /* @__PURE__ */ U(v0, [["__scopeId", "data-v-464d77a8"]]);
function ar(e, t) {
  const n = C([]), a = C(!1), s = C(null), o = C(0), l = C(!1), i = C("");
  let u = 0, c = 0;
  const f = (k) => {
    if (typeof k.body == "string") return k.body;
    const { term: _, id: x, title: M } = e(), T = `On ${_} ${x}, ${M}: `;
    return k.text.startsWith(T) ? k.text.slice(T.length) : k.text;
  };
  async function h(k = 1) {
    const { term: _, id: x } = e();
    if (!x) return;
    const M = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([_, "comments", String(x), "--page", String(k), "--page-size", "25"]);
      if (M !== c) return;
      if (!T.ok) {
        i.value = T.error;
        return;
      }
      const H = T.value.rows ?? [], W = k === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(W.map((I) => [I.id, I])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      M === c && (i.value = T.message);
    } finally {
      M === c && (l.value = !1);
    }
  }
  async function g(k) {
    var I;
    const { term: _, id: x } = e(), M = `${_}:${x}`, T = { id: `sending-${++u}`, text: k };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const H = await t([_, "comment", String(x), k]);
    if (M !== `${e().term}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((z) => z.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await h();
    const W = (I = H.value) == null ? void 0 : I.id;
    W && !n.value.some((z) => z.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: g, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function b0(e, t) {
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
const k0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, w0 = ["datetime"], $0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, x0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, S0 = {
  key: 2,
  class: "document-none"
}, M0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), o = C(""), l = S(() => s.value ? b0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", k0, [
      e.editing ? (r(), F(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: D(() => [...f[1] || (f[1] = [
          K("Close the open revision", -1)
        ])]),
        _: 1
      })) : b("", !0),
      e.revisions.length ? (r(), d(P, { key: 1 }, [
        (r(!0), d(P, null, ne(e.revisions, (h) => (r(), F(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (g) => i(h)
        }, {
          default: D(() => [
            K("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, w0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", $0, v(o.value), 1)) : b("", !0),
        s.value ? (r(), d(P, { key: 1 }, [
          O(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: D(() => [...f[2] || (f[2] = [
              K("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", x0, [
            (r(!0), d(P, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : b("", !0)
      ], 64)) : (r(), d("p", S0, "No revisions"))
    ]));
  }
}, _0 = /* @__PURE__ */ U(M0, [["__scopeId", "data-v-3a381aa4"]]), C0 = "button, [data-comment-number]", A0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function sr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(C0) || n.push(t.currentNode);
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
const E0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function O0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = sr(e), s = a.map((c) => c.data).join(""), o = nl(a, n.startContainer, n.startOffset), l = s.slice(o, nl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: E0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function T0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function I0(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Fa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function B0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function R0(e, t) {
  const n = sr(e), a = T0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = I0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(B0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Fa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Fa(t.number, t.id, t.label)) : l.at(-1).append(Fa(t.number, t.id, t.label))), !0;
}
function L0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !R0(e, a) && a.id && n.push(a.id);
  return n;
}
const N0 = (e) => e.closest(A0) ?? e;
function al(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const q0 = {
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
      const _ = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), x = L0(l.value, a.pending ? [..._, { ...a.pending, pending: !0 }] : _);
      s("lost", x);
      const M = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!M) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", N0(M).after(T), c.value = T;
    }
    function h() {
      if (!l.value) return;
      const _ = O0(l.value);
      if (u.value = !!_, !_) {
        i.value = null;
        return;
      }
      const x = window.getSelection().getRangeAt(0).getBoundingClientRect(), M = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(x.left - M.left, 0)}px`, top: `${x.top - M.top + o.value.scrollTop}px` }, s("select", _);
    }
    function g(_) {
      const x = _.target.closest("[data-comment-number]");
      x ? s("number", Number(x.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(_) {
      var x;
      (x = l.value.querySelector(`[data-comment="${_}"]`)) == null || x.scrollIntoView({ block: "center" });
    }
    function k(_) {
      var x;
      (x = l.value.querySelectorAll("h3, h4, h5, h6")[_]) == null || x.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Me(() => {
      f(), document.addEventListener("selectionchange", h);
    }), nt(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: k, nextTick: Fe }), (_, x) => (r(), d("div", {
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
        onMousedown: x[0] || (x[0] = $e(() => {
        }, ["prevent"])),
        onClick: x[1] || (x[1] = (M) => s("write"))
      }, [
        O(ie, {
          name: "chat",
          size: 13
        }),
        x[2] || (x[2] = K("Comment on this", -1))
      ], 36)) : b("", !0),
      c.value ? (r(), F(kn, {
        key: 1,
        to: c.value
      }, [
        ue(_.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : b("", !0),
      ue(_.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, D0 = /* @__PURE__ */ U(q0, [["__scopeId", "data-v-548d0aaa"]]), P0 = { class: "document-tabs" }, j0 = { class: "document-body" }, F0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, W0 = {
  key: 1,
  class: "document-loading"
}, H0 = {
  class: "document-details",
  "data-resource-fields": ""
}, z0 = 760, U0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Se(li, C(null)), a = C(null), s = $v(a), o = S(() => s.value !== null && s.value < z0), l = C(null), i = C(""), u = C([]), c = C([]), f = C(""), h = C("comments"), g = C("text"), y = C(0), k = C(0), _ = C([]), x = C(null), M = C(""), T = C(!1), H = C(null), W = C(null);
    let I = 0;
    const z = ar(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (le) => t.read(le)), N = S(() => al(z.comments.value)), E = S(() => h.value === "questions" ? al(c.value) : N.value), L = S(() => h.value === "questions" ? E.value.length : z.total.value), q = S(() => {
      var le;
      return (le = l.value) != null && le.body ? ao(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), w = S(() => {
      var le;
      return (((le = l.value) == null ? void 0 : le.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, ae) => ({ key: String(ae), value: ae, label: te.replace(/^#+ /, "") }));
    }), p = S(() => N.value.find((le) => le.id === k.value)), $ = S(() => {
      var le;
      return (le = l.value) != null && le.close_reason ? "Closed" : "Open";
    }), A = S(() => g.value === "comments" && !o.value ? "text" : g.value), B = (le) => le.ok ? le.value.rows ?? [] : [];
    async function j() {
      const le = ++I, te = await t.read([t.term, "inspect", String(t.id)]);
      if (le !== I) return;
      i.value = te.ok ? "" : te.error, l.value = te.ok ? te.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Oe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      le === I && (c.value = B(ae), f.value = ae.ok ? "" : ae.error, u.value = Oe ? B(Oe) : []);
    }
    async function V(le) {
      const te = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], ae = await t.read([t.term, "comment", String(t.id), ...te, "--", le]);
      if (!ae.ok) throw new Error(ae.error);
      x.value = null, await Promise.all([j(), z.load()]);
    }
    async function J() {
      const le = await t.read(["doc", "close", String(t.id)]);
      i.value = le.ok ? "" : le.error, le.ok && await j();
    }
    function oe() {
      M.value.trim() || (x.value = null);
    }
    function ce(le) {
      var te;
      if (y.value = le, o.value && h.value === "questions") {
        g.value = "comments";
        return;
      }
      o.value ? k.value = k.value === le ? 0 : le : (te = a.value.querySelector(h.value === "questions" ? `[data-question-id="${le}"]` : `[data-comment-id="${le}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function be(le) {
      var te, ae;
      g.value = "text", y.value = le, await ((te = H.value) == null ? void 0 : te.nextTick()), (ae = H.value) == null || ae.show(le);
    }
    function Ie() {
      T.value = !1, j();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      l.value = null, g.value = "text", y.value = 0, k.value = 0, x.value = null, c.value = [], f.value = "", j();
    }, { immediate: !0 }), pe(h, () => {
      y.value = 0, k.value = 0;
    }), (le, te) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), F(kn, {
        key: 0,
        to: R(n),
        disabled: !R(n)
      }, [
        m("span", {
          class: Y(["document-actions", { placed: R(n) }]),
          "data-document-actions": ""
        }, [
          O(ge, {
            bordered: "",
            "data-text-edit": "",
            onClick: te[0] || (te[0] = (ae) => T.value = !0)
          }, {
            default: D(() => [...te[14] || (te[14] = [
              K("Edit", -1)
            ])]),
            _: 1
          }),
          A.value === "text" && w.value.length > 1 ? (r(), F(Gs, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: w.value,
            "data-text-chapters": "",
            onPick: te[1] || (te[1] = (ae) => {
              var Oe;
              return (Oe = H.value) == null ? void 0 : Oe.showHeading(ae.value);
            })
          }, null, 8, ["label", "items"])) : b("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : b("", !0),
      m("nav", P0, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: A.value === "text" }]),
          "data-document-tab": "text",
          onClick: te[2] || (te[2] = (ae) => g.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: A.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: te[3] || (te[3] = (ae) => g.value = "comments")
        }, [
          K(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(L.value || ""), 1)
        ], 2)) : b("", !0),
        e.term === "doc" ? (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: A.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[4] || (te[4] = (ae) => g.value = "revisions")
        }, [
          te[15] || (te[15] = K("Revisions ", -1)),
          m("em", null, v(u.value.length || ""), 1)
        ], 2)) : b("", !0)
      ]),
      m("div", j0, [
        i.value ? (r(), d("p", F0, v(i.value), 1)) : l.value ? A.value === "revisions" ? (r(), F(_0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: J,
          onRestored: j
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : A.value === "comments" ? (r(), F(tl, {
          key: 3,
          mode: h.value,
          "onUpdate:mode": te[5] || (te[5] = (ae) => h.value = ae),
          tab: "",
          comments: N.value,
          questions: c.value,
          hot: y.value,
          lost: _.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!R(z).nextPage.value,
          "comment-loading": R(z).loading.value,
          "comment-failure": R(z).failure.value,
          "comment-total": R(z).total.value,
          onMore: R(z).loadMore,
          onShow: be,
          onChanged: j
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(P, { key: 4 }, [
          O(D0, {
            ref_key: "words",
            ref: H,
            html: q.value,
            comments: E.value,
            "annotation-label": h.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: x.value,
            inline: k.value,
            onSelect: te[7] || (te[7] = (ae) => x.value = ae),
            onClear: oe,
            onNumber: ce,
            onWrite: te[8] || (te[8] = (ae) => {
              var Oe;
              return (Oe = W.value) == null ? void 0 : Oe.focus();
            }),
            onLost: te[9] || (te[9] = (ae) => _.value = ae)
          }, {
            inline: D(() => [
              p.value ? (r(), F(Ji, {
                key: 0,
                comment: p.value,
                hot: "",
                onShow: te[6] || (te[6] = (ae) => be(p.value.id))
              }, null, 8, ["comment"])) : b("", !0)
            ]),
            default: D(() => [
              m("dl", H0, [
                te[17] || (te[17] = m("h4", null, "Details", -1)),
                te[18] || (te[18] = m("dt", null, "State", -1)),
                m("dd", null, v($.value), 1),
                l.value.close_reason ? (r(), d(P, { key: 0 }, [
                  te[16] || (te[16] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(l.value.close_reason), 1)
                ], 64)) : b("", !0),
                te[19] || (te[19] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  O(tt, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                te[20] || (te[20] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  O(tt, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          o.value ? b("", !0) : (r(), F(tl, {
            key: 0,
            mode: h.value,
            "onUpdate:mode": te[10] || (te[10] = (ae) => h.value = ae),
            comments: N.value,
            questions: c.value,
            hot: y.value,
            lost: _.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!R(z).nextPage.value,
            "comment-loading": R(z).loading.value,
            "comment-failure": R(z).failure.value,
            "comment-total": R(z).total.value,
            onMore: R(z).loadMore,
            onShow: be,
            onChanged: j
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (r(), d("div", W0, [
          O(Qe)
        ]))
      ]),
      l.value ? (r(), F(Nv, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: M.value,
        "onUpdate:draft": te[11] || (te[11] = (ae) => M.value = ae),
        selection: x.value,
        send: V,
        narrow: o.value,
        onClear: te[12] || (te[12] = (ae) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : b("", !0),
      T.value ? (r(), F(y0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: te[13] || (te[13] = (ae) => T.value = !1),
        onSaved: Ie
      }, null, 8, ["term", "id", "row", "read"])) : b("", !0)
    ], 512));
  }
}, D6 = /* @__PURE__ */ U(U0, [["__scopeId", "data-v-c33a5a33"]]), G0 = {
  key: 1,
  class: "row-list-failure"
}, V0 = ["data-row"], K0 = {
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
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", G0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), F(un, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        K(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(P, { key: 3 }, [
      (r(), F(Ke(e.arrival || e.moves ? js : "ul"), De(n.value, { class: "row-list" }), {
        default: D(() => [
          (r(!0), d(P, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ue(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, V0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : b("", !0)
    ], 64));
  }
}, Y0 = /* @__PURE__ */ U(K0, [["__scopeId", "data-v-e9f251f3"]]), Q0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, J0 = {
  key: 1,
  class: "agent-rows-note"
}, X0 = {
  key: 2,
  class: "agent-rows-note"
}, Z0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, eb = ["data-agent-row", "onClick"], tb = { class: "agent-row-name" }, nb = { class: "agent-row-state" }, ab = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = S(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", Q0, [
      e.loaded ? e.failure ? (r(), d("p", J0, v(e.failure), 1)) : e.rows.length ? (r(), d(P, { key: 3 }, [
        m("p", Z0, v(a.value) + " running", 1),
        (r(!0), d(P, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => R(je)(`agents:${l.id}`)
        }, [
          m("span", tb, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", nb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, eb))), 128))
      ], 64)) : (r(), d("p", X0, v(e.none), 1)) : (r(), F(Qe, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, P6 = /* @__PURE__ */ U(ab, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, ze = { across: 48, down: 110, margin: 32, labelSpace: 14 }, sb = 6;
function uo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const ob = (e) => {
  const t = uo(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function lb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function ib(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function rb(e, t, n) {
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
  for (let l = 0; l < sb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((g) => g[i ? 1 : 0] === h).map((g) => g[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function ub(e, t) {
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
function cb(e) {
  const t = [...new Set(e.flatMap(([W, I]) => [W, I]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = lb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, I) => !s.has(I)), l = ib(t, o), i = rb(t, o, l), u = new Map(t.map((W) => [W, ob(W)])), c = i.map((W) => W.reduce((I, z) => I + u.get(z).width, 0) + ze.across * (W.length - 1)), f = Math.max(...c) + ze.margin * 2, h = fb(e, l, i.length), g = /* @__PURE__ */ new Map();
  let y = ze.margin;
  i.forEach((W, I) => {
    let z = (f - c[I]) / 2;
    const N = Math.max(...W.map((E) => u.get(E).height));
    W.forEach((E) => {
      const L = u.get(E);
      g.set(E, { ...L, x: z, y: y + (N - L.height) / 2 }), z += L.width + ze.across;
    }), y += N + (h[I] ?? ze.down);
  });
  const k = e.map(([W, I, z], N) => ({ from: W, to: I, label: z || "", back: s.has(N) || l.get(I) <= l.get(W) }));
  ub(k, g);
  const _ = k.map((W) => hb(W, g.get(W.from), g.get(W.to))), x = [...g.values()], M = vb(_, x), T = Math.max(y - ze.down, ...M.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - ze.margin, ...M.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + ze.margin, height: T + ze.margin, nodes: x, arrows: M };
}
const db = (e) => e ? uo(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function fb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => ze.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += db(l) + ze.labelSpace);
  }), a.map((s) => Math.max(ze.down, s));
}
function hb(e, t, n) {
  const a = e.label ? uo(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((g) => g.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const mb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, pb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], gb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function vb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = mb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = gb.flatMap((u) => pb.map((c) => s(c, u))).find((u) => !n.some((c) => sl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => sl(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const sl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, yb = { class: "flowchart-tools" }, bb = ["width", "height", "viewBox", "aria-label"], kb = ["d"], wb = ["x", "y", "width", "height"], $b = ["x", "y"], xb = ["x", "dy"], Sb = {
  key: 0,
  class: "flowchart-label"
}, Mb = ["x", "y", "width", "height"], _b = ["x", "y"], Cb = ["x", "dy"], Ab = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => cb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = C(null), i = C({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var M;
      const _ = (M = l.value) == null ? void 0 : M.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const x = Math.min(_.width / s.value.width, _.height / s.value.height, 1.5);
      i.value = { zoom: x, x: (_.width - s.value.width * x) / 2, y: (_.height - s.value.height * x) / 2 };
    }
    function f(_, x, M) {
      const { zoom: T, x: H, y: W } = i.value, I = Math.min(o.most, Math.max(o.least, T * _));
      i.value = { zoom: I, x: x - (x - H) * I / T, y: M - (M - W) * I / T };
    }
    function h(_) {
      const x = l.value.getBoundingClientRect();
      f(_, x.width / 2, x.height / 2);
    }
    function g(_) {
      const x = l.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? f(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - x.left, _.clientY - x.top) : i.value = { ...i.value, x: i.value.x - _.deltaX, y: i.value.y - _.deltaY };
    }
    function y(_) {
      var x, M, T;
      _.preventDefault(), (x = window.getSelection()) == null || x.removeAllRanges(), u = { x: _.clientX - i.value.x, y: _.clientY - i.value.y }, (T = (M = l.value).setPointerCapture) == null || T.call(M, _.pointerId);
    }
    function k(_) {
      u && (i.value = { ...i.value, x: _.clientX - u.x, y: _.clientY - u.y });
    }
    return Me(c), (_, x) => (r(), F(ya, {
      padded: "",
      title: e.title,
      large: "",
      onClose: x[4] || (x[4] = (M) => a("close"))
    }, {
      default: D(() => [
        m("div", yb, [
          O(ge, {
            small: "",
            onClick: x[0] || (x[0] = (M) => h(o.step))
          }, {
            default: D(() => [...x[5] || (x[5] = [
              K("Zoom in", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            small: "",
            onClick: x[1] || (x[1] = (M) => h(1 / o.step))
          }, {
            default: D(() => [...x[6] || (x[6] = [
              K("Zoom out", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            small: "",
            onClick: c
          }, {
            default: D(() => [...x[7] || (x[7] = [
              K("Fit the whole chart", -1)
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
          onPointermove: k,
          onPointerup: x[2] || (x[2] = (M) => Ao(u) ? u.value = null : u = null),
          onPointercancel: x[3] || (x[3] = (M) => Ao(u) ? u.value = null : u = null)
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
            x[8] || (x[8] = m("defs", null, [
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
            (r(!0), d(P, null, ne(s.value.arrows, (M, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: M.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, kb))), 128)),
            (r(!0), d(P, null, ne(s.value.nodes, (M) => (r(), d("g", {
              key: M.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: M.x,
                y: M.y,
                width: M.width,
                height: M.height,
                rx: "8"
              }, null, 8, wb),
              m("text", {
                x: M.x + M.width / 2,
                y: M.y + M.padY + M.line / 2
              }, [
                (r(!0), d(P, null, ne(M.lines, (T, H) => (r(), d("tspan", {
                  key: H,
                  x: M.x + M.width / 2,
                  dy: H ? M.line : 0
                }, v(T), 9, xb))), 128))
              ], 8, $b)
            ]))), 128)),
            (r(!0), d(P, null, ne(s.value.arrows, (M, T) => (r(), d(P, {
              key: `label-${T}`
            }, [
              M.label ? (r(), d("g", Sb, [
                m("rect", {
                  x: M.label.x,
                  y: M.label.y,
                  width: M.label.width,
                  height: M.label.height,
                  rx: "4"
                }, null, 8, Mb),
                m("text", {
                  x: M.label.x + M.label.width / 2,
                  y: M.label.y + M.label.pad + M.label.line / 2
                }, [
                  (r(!0), d(P, null, ne(M.label.lines, (H, W) => (r(), d("tspan", {
                    key: W,
                    x: M.label.x + M.label.width / 2,
                    dy: W ? M.label.line : 0
                  }, v(H), 9, Cb))), 128))
                ], 8, _b)
              ])) : b("", !0)
            ], 64))), 128))
          ], 12, bb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Eb = /* @__PURE__ */ U(Ab, [["__scopeId", "data-v-e98799dc"]]), Ob = ["innerHTML"], Tb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => No[t.name] || No.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Ob));
  }
}, Et = /* @__PURE__ */ U(Tb, [["__scopeId", "data-v-beb5935c"]]), Ib = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      O(Et, { name: "fold" })
    ], 2));
  }
}, Yt = /* @__PURE__ */ U(Ib, [["__scopeId", "data-v-d03899bb"]]), Bb = ["data-tip", "aria-label"], Rb = {
  key: 0,
  class: "mact-word"
}, Lb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      O(Et, { name: "open" }),
      e.open ? (r(), d("span", Rb, v(e.label), 1)) : b("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Bb));
  }
}, or = /* @__PURE__ */ U(Lb, [["__scopeId", "data-v-3b292e09"]]), lr = 120, Kn = 280, ir = 160, Nb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, qb = ["leaving", "resizing", "entering"];
function _s(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Db(e) {
  const t = qb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = _s(e);
  return e.classList.add(...t), n;
}
function rr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = C(t()), s = C("");
  let o = 0;
  const l = (h, g) => Object.assign(h.style, { width: `${g.width}px`, height: `${g.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, g) {
    i(h);
    const y = Db(h);
    l(h, g), h.offsetWidth, h.style.transition = `width ${Kn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Kn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const g = h.querySelector(":scope > :not(.top)");
    if (!g || typeof ResizeObserver > "u") return null;
    let y = g.offsetHeight;
    const k = new ResizeObserver(() => {
      g.offsetHeight !== y && (y = g.offsetHeight, u(h, _s(h)));
    });
    return k.observe(g), k;
  }
  async function f(h) {
    const g = e.value, y = ++o;
    if (!g || !g.offsetWidth || Nb()) {
      a.value = h;
      return;
    }
    const k = _s(g);
    if (l(g, k), s.value = "leaving", await n(lr), y !== o) return;
    a.value = h, s.value = "resizing", await Fe(), u(g, k);
    const _ = c(g);
    await n(Kn), _ == null || _.disconnect(), y === o && (i(g), s.value = "entering", await n(ir), y === o && (s.value = ""));
  }
  return pe(t, (h) => f(h)), nt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Pb = { class: "growing-card-top" }, jb = ["aria-expanded"], Fb = { class: "growing-card-avatar" }, Wb = { class: "growing-card-title" }, Hb = { class: "growing-card-more" }, zb = { class: "growing-card-body" }, Ub = {
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
    const n = e, a = t, s = C(!1), o = C(null), { folded: l, phase: i } = rr(o, () => !s.value), u = S(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = S(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", R(i), { open: !R(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", Pb, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (g) => s.value = !s.value)
        }, [
          m("span", Fb, [
            e.bad ? (r(), F(Et, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(P, { key: 1 }, [
              K(v(u.value), 1)
            ], 64)) : (r(), F(ie, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Wb, v(e.title), 1),
          O(Yt, { open: s.value }, null, 8, ["open"])
        ], 8, jb),
        e.action ? (r(), F(or, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (g) => a("act"))
        }, null, 8, ["label", "open"])) : b("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (g) => a("comment"))
        }, [
          O(ie, {
            name: "bubble",
            size: 13
          })
        ])) : b("", !0)
      ]),
      m("div", Hb, [
        m("div", zb, [
          (r(!0), d(P, null, ne(c.value, (g, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Gb = /* @__PURE__ */ U(Ub, [["__scopeId", "data-v-f2b4930d"]]), Vb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Kb = { class: "md inline" }, Yb = ["disabled", "title", "onClick"], Qb = {
  key: 1,
  class: "message-links-many"
}, Jb = ["aria-expanded"], Xb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Zb = ["disabled", "onClick"], ek = { class: "row-pill message-links-chip" }, tk = { class: "message-links-title" }, nk = { key: 0 }, Wa = 3, ak = "task", sk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.total || n.links.length), o = S(() => n.links.every((g) => g.endpoint.model === ak) ? "tasks" : "items"), l = C(!1), i = C(null);
    ri(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (g) => g.endpoint.unavailable || !g.endpoint.open_ref, f = (g) => g.relations.includes("edited") ? g.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(g) {
      c(g) || (l.value = !1, je(g.endpoint.open_ref));
    }
    return (g, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Wa, three: s.value === Wa, open: l.value }]),
      "data-message-links": ""
    }, [
      O(Et, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Vb, [
        m("span", Kb, [
          y[1] || (y[1] = K("Linked: ", -1)),
          (r(!0), d(P, null, ne(e.links, (k) => (r(), d("button", {
            key: `${k.endpoint.model}:${k.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(k),
            title: k.endpoint.title,
            onClick: (_) => h(k)
          }, [
            K(v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
            f(k) ? (r(), d(P, { key: 0 }, [
              K(" (" + v(f(k)) + ")", 1)
            ], 64)) : b("", !0),
            c(k) ? (r(), d(P, { key: 1 }, [
              K(" (unavailable)")
            ], 64)) : b("", !0)
          ], 8, Yb))), 128))
        ])
      ])) : b("", !0),
      s.value >= Wa ? (r(), d("span", Qb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          K(v(s.value) + " linked " + v(o.value) + " ", 1),
          O(Yt, { open: l.value }, null, 8, ["open"])
        ], 8, Jb)
      ])) : b("", !0),
      l.value ? (r(), d("div", Xb, [
        (r(!0), d(P, null, ne(e.links, (k) => (r(), d("button", {
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(k),
          onClick: (_) => h(k)
        }, [
          m("span", ek, v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
          m("span", tk, v(k.endpoint.title), 1),
          m("span", null, v(f(k)), 1),
          c(k) ? (r(), d("span", nk, "Unavailable")) : b("", !0)
        ], 8, Zb))), 128))
      ])) : b("", !0),
      O(wn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (k) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ok = /* @__PURE__ */ U(sk, [["__scopeId", "data-v-843fc3bd"]]), lk = ["title", "aria-label"], ik = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, rk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, uk = {
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
      (r(), d("svg", ik, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", rk)) : b("", !0)
      ]))
    ], 10, lk));
  }
}, ck = /* @__PURE__ */ U(uk, [["__scopeId", "data-v-6dc92808"]]), dk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, fk = (e) => e.worker_id != null ? "report" : "message", hk = (e) => dk[fk(e)], mk = "img,pre,table";
function pk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function gk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function vk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(mk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = pk(gk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function yk(e, t) {
  let n = null;
  const a = () => e.value && vk(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const bk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function kk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Pn = /* @__PURE__ */ new WeakMap(), Ne = "work", Xe = "sent", wk = 50, ol = 50, ll = () => ({ rows: C([]), total: C(0), next: C(null), loading: C(!1), failure: C(""), version: 0 });
function $k(e) {
  var _;
  if (Pn.has(e)) return Pn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (x) => {
    var M;
    return ((M = e.visible) == null ? void 0 : M.value) !== !1 && [...x.views].some((T) => T.visible);
  };
  function o(x, M) {
    const T = x[M], H = ++T.version;
    return T.loading.value = !0, T.failure.value = "", H;
  }
  function l(x, M, T, H, W) {
    const I = x[M];
    if (t.get(x.id) !== x || I.version !== T) return;
    if (I.loading.value = !1, !W.ok) {
      I.failure.value = W.error;
      return;
    }
    const z = M === Ne ? W.value.counterparts ?? [] : W.value.rows ?? [], N = H === 1 ? z : [...I.rows.value, ...z], E = M === Ne ? (L) => `${L.endpoint.model}:${L.endpoint.id}` : (L) => L.id ?? L.target_id;
    I.rows.value = [...new Map(N.map((L) => [E(L), L])).values()], I.total.value = W.value.total ?? I.rows.value.length, I.next.value = W.value.next_page ?? null;
  }
  function i(x, M, T, H) {
    const W = x[M];
    W.version === T && (W.failure.value = H.message, W.loading.value = !1);
  }
  async function u(x, M, T) {
    const H = o(x, M), W = M === Ne ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(x, M, H, T, await e.read(`link list --source message:${x.id} ${W} --page ${T} --page-size ${M === Ne ? 10 : 25}`));
    } catch (I) {
      i(x, M, H, I);
    }
  }
  async function c(x) {
    const M = x.map((T) => ({ [Ne]: o(T, Ne), [Xe]: o(T, Xe) }));
    try {
      const T = await e.read(`link receipts --messages ${x.map((H) => H.id).join(",")}`);
      x.forEach((H, W) => {
        const I = T.ok ? T.value.messages[String(H.id)] : null;
        l(H, Ne, M[W][Ne], 1, T.ok ? { ok: !0, value: I.named } : T), l(H, Xe, M[W][Xe], 1, T.ok ? { ok: !0, value: I.sent } : T);
      });
    } catch (T) {
      x.forEach((H, W) => [Ne, Xe].forEach((I) => i(H, I, M[W][I], T)));
    }
  }
  function f() {
    a = null;
    const x = [...n].map((M) => t.get(M)).filter((M) => M && s(M));
    n.clear(), x.forEach((M) => M.dirty.clear());
    for (let M = 0; M < x.length; M += ol) c(x.slice(M, M + ol));
  }
  function h(x, M = [Ne, Xe]) {
    for (const T of M) x.dirty.add(T);
    s(x) && (n.add(x.id), a ?? (a = setTimeout(f, 0)));
  }
  function g(x) {
    const M = x.sources ?? (x.source_model && Number.isInteger(x.source_id) ? [{ model: x.source_model, id: x.source_id }] : []), T = x.link_types ?? (x.link_type ? [x.link_type] : []), H = T.length ? [Ne, Xe].filter((I) => I === Ne ? T.some((z) => ["about", "edited"].includes(z)) : T.includes("sent_to")) : [Ne, Xe];
    if (!H.length) return;
    const W = M.length ? [...new Set(M.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, wk);
    for (const I of W) h(I, H);
  }
  const y = (_ = e.follow) == null ? void 0 : _.call(e, ["link.*"], g), k = {
    attach(x, M) {
      let T = t.get(x);
      return T || (T = { id: x, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ne, Xe]), work: ll(), sent: ll() }, t.set(x, T)), T.views.add(M), T.dirty.size && h(T, [...T.dirty]), T;
    },
    shown(x) {
      x.dirty.size && h(x, [...x.dirty]);
    },
    detach(x, M) {
      x.views.delete(M), x.views.size || t.delete(x.id), t.size || (clearTimeout(a), y == null || y(), Pn.delete(e));
    },
    more(x, M) {
      const T = x == null ? void 0 : x[M];
      if (T != null && T.next.value && !T.loading.value) return u(x, M, T.next.value);
    }
  };
  return Pn.set(e, k), k;
}
function xk(e, t, n) {
  const a = Ze(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = $k(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((k) => k.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), g = pe(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      g(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return pa(o), {
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
    loadSent: () => s == null ? void 0 : s.more(a.value, Xe)
  };
}
const Sk = ["data-incoming", "data-ref"], Mk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], _k = { class: "message-body" }, Ck = ["title"], Ak = ["innerHTML"], Ek = ["innerHTML"], Ok = {
  class: "message-faces",
  "data-message-faces": ""
}, Tk = ["title", "data-face", "onClick"], Ik = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Bk = ["title", "data-reaction", "onClick"], Rk = {
  key: 0,
  class: "message-reaction-count"
}, Lk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Nk = ["href", "title"], qk = ["src", "alt"], Dk = ["href"], Pk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, jk = { class: "message-foot" }, Fk = { class: "message-time" }, Wk = {
  class: "message-id",
  "data-message-id": ""
}, Hk = 1500, zk = "An earlier message", Uk = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = C(null), l = S(() => ["user", "comment"].includes(n.message.type)), i = S(() => {
      const [le, te] = (n.message.commented_row || ":").split(":"), ae = gt(le);
      return ae ? { ref: `${ae}:${te}`, label: `${Kt(ae).title.toLowerCase()} ${te}` } : null;
    }), u = S(() => n.message.worker_id ?? null), c = S(() => hk(n.message)), f = S(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var le;
      await ((le = navigator.clipboard) == null ? void 0 : le.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Hk);
    }
    const g = Ni(), y = S(() => g(n.message.text ?? "")), k = S(() => JSON.parse(n.message.flowchart_edges || "[]")), _ = C(!1), x = S(() => $s(n.quote)), M = S(() => g(x.value || zk));
    function T() {
      const le = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      le ? le.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    yk(o, () => `${n.message.text} ${x.value}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (le) => `/api/files/message/${n.message.id}/${encodeURIComponent(le)}`, I = S(() => JSON.parse(n.message.captions || "{}")), z = S(() => (n.message.files ?? []).map((le) => ({ name: le, address: W(le), isImage: H.test(le), title: I.value[le] || le }))), N = S(() => Gi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Se(Le, null), { links: L, total: q, more: w, loading: p, failure: $, sentTo: A, sentMore: B, sentLoading: j, sentFailure: V, loadMore: J, loadSent: oe } = xk(E, () => l.value && !n.message.local ? n.message.id : null, o), ce = C(!1), be = S(() => kk(n.message.reactions));
    function Ie(le) {
      ce.value = !1, a("react", n.message, le);
    }
    return (le, te) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      O(Gb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: te[0] || (te[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Sk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", _k, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: te[5] || (te[5] = (...ae) => R(Nt) && R(Nt)(...ae))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: te[1] || (te[1] = $e((ae) => R(je)(i.value.ref), ["stop"]))
          }, [
            O(ie, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Ck)) : b("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(T, ["stop"]),
            innerHTML: M.value
          }, null, 8, Ak)) : b("", !0),
          u.value !== null ? (r(), F(fn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: te[2] || (te[2] = $e((ae) => R(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: D(() => [
              K("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : b("", !0),
          O(Oi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: D(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Ek)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          k.value.length ? (r(), d(P, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: te[3] || (te[3] = (ae) => _.value = !0)
            }, "Open the flowchart"),
            _.value ? (r(), F(Eb, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: te[4] || (te[4] = (ae) => _.value = !1)
            }, null, 8, ["title", "edges"])) : b("", !0)
          ], 64)) : b("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ce.value }]),
          "data-message-tools": ""
        }, [
          ce.value ? (r(), d(P, { key: 0 }, [
            m("div", Ok, [
              (r(!0), d(P, null, ne(R(bk), (ae) => (r(), d("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Oe) => Ie(ae)
              }, v(ae), 9, Tk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: te[6] || (te[6] = (ae) => ce.value = !1)
            }, [
              O(ie, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(P, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: te[7] || (te[7] = (ae) => ce.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: te[8] || (te[8] = (ae) => a("reply", e.message))
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
              onClick: te[9] || (te[9] = (ae) => a("delete", e.message))
            }, "Delete")) : b("", !0)
          ], 64))
        ], 2)
      ]),
      be.value.length ? (r(), d("div", Ik, [
        (r(!0), d(P, null, ne(be.value, (ae) => (r(), d("button", {
          key: ae.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Oe) => a("react", e.message, ae.emoji)
        }, [
          K(v(ae.emoji) + " ", 1),
          ae.count > 1 ? (r(), d("span", Rk, v(ae.count), 1)) : b("", !0)
        ], 10, Bk))), 128))
      ])) : b("", !0),
      z.value.length ? (r(), d("div", Lk, [
        (r(!0), d(P, null, ne(z.value, (ae) => (r(), d(P, {
          key: ae.name
        }, [
          ae.isImage ? (r(), d("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            m("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, qk)
          ], 8, Nk)) : (r(), d("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, v(ae.name), 9, Dk))
        ], 64))), 128))
      ])) : b("", !0),
      R(A).length ? (r(), d("div", Pk, [
        O(ie, {
          name: "send",
          size: 12
        }),
        (r(!0), d(P, null, ne(R(A), (ae) => (r(), F(fn, {
          key: ae.id,
          as: "button",
          "agent-id": ae.id,
          label: `Worker ${ae.id}`,
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          onClick: $e((Oe) => ae.open_ref && R(je)(ae.open_ref), ["stop"])
        }, {
          default: D(() => [
            K("Also sent to worker " + v(ae.id), 1),
            ae.unavailable ? (r(), d(P, { key: 0 }, [
              K(" (unavailable)")
            ], 64)) : b("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : b("", !0),
      O(wn, {
        more: R(B),
        loading: R(j),
        failure: R(V),
        label: "More recipients",
        onMore: R(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", jk, [
        m("time", Fk, v(N.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(P, { key: 0 }, [
          te[10] || (te[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Wk, "message " + v(e.message.id), 1)
        ], 64)) : b("", !0),
        l.value ? (r(), F(ck, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : b("", !0)
      ]),
      R(L).length || R($) ? (r(), F(ok, {
        key: 3,
        links: R(L),
        total: R(q),
        more: R(w),
        loading: R(p),
        failure: R($),
        onMore: R(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : b("", !0)
    ], 8, Mk));
  }
}, j6 = /* @__PURE__ */ U(Uk, [["__scopeId", "data-v-95d3070e"]]), la = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ha = 200, ur = (e) => {
  var t;
  return ((t = la.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? la[0].key;
}, F6 = (e) => {
  var t;
  return ((t = la.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Gk = ["aria-label"], Vk = 300, il = 400, Kk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ha } },
  setup(e) {
    const t = e, n = S(() => ur(t.value)), a = S(() => n.value < Ha ? [1, 0.25, 0.25] : n.value === Ha ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= il, high: n.value >= Vk && n.value < il }]),
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
    ], 10, Gk));
  }
}, W6 = /* @__PURE__ */ U(Kk, [["__scopeId", "data-v-b10e610f"]]), cr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], H6 = (e) => {
  const t = cr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Yk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, rl = (e) => Yk[e.card.state] || "idle", Qk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ul = { working: 0, waiting: 1, idle: 2, stopped: 3 }, cl = (e, t) => ul[rl(e)] - ul[rl(t)], dl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, z6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => cl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Qk(a, s)) : [...e].sort((a, s) => cl(a, s) || (dl[t] || dl.state)(a, s)), Jk = { class: "list-row" }, Xk = {
  key: 0,
  class: "list-row-type"
}, Zk = { class: "list-row-main" }, ew = {
  key: 0,
  class: "list-row-title"
}, tw = { class: "list-row-body" }, nw = {
  key: 1,
  class: "list-row-end"
}, aw = {
  key: 1,
  class: "list-row-text"
}, sw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Jk, [
      e.type ? (r(), d("span", Xk, v(e.type), 1)) : b("", !0),
      m("div", Zk, [
        e.title ? (r(), d("span", ew, v(e.title), 1)) : b("", !0),
        m("div", tw, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", nw, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      e.text ? (r(), d("span", aw, v(e.text), 1)) : b("", !0)
    ]));
  }
}, U6 = /* @__PURE__ */ U(sw, [["__scopeId", "data-v-dfc8c3a7"]]), G6 = {
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
}, ow = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Cs = /* @__PURE__ */ U(ow, [["__scopeId", "data-v-978e0921"]]), lw = ["aria-label"], iw = { class: "head" }, rw = { class: "names" }, uw = { class: "body" }, cw = {
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
    return (u, c) => (r(), F(kn, { to: "body" }, [
      O(Gt, {
        name: "side",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: D(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: R(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = $e((...f) => R(o) && R(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(P, { key: 0 }, [
                m("header", iw, [
                  m("div", rw, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), F(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : b("", !0),
                    ue(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ue(u.$slots, "actions", {}, void 0, !0),
                  O(va, {
                    title: e.closeLabel,
                    onClick: R(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), F(Cs, { key: 0 }, {
                  default: D(() => [
                    ue(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0),
                m("div", uw, [
                  ue(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), F(Cs, {
                  key: 1,
                  class: "below"
                }, {
                  default: D(() => [
                    ue(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0)
              ], 64)) : ue(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, lw)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, V6 = /* @__PURE__ */ U(cw, [["__scopeId", "data-v-d0a677ef"]]), dw = {
  key: 1,
  class: "text-field-label"
}, fw = {
  key: 2,
  class: "text-field-end"
}, hw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ jt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = rn(e, "modelValue"), a = ma(), s = "onUpdate:modelValue" in (((f = fu()) == null ? void 0 : f.vnode.props) || {}), o = S(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = S(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = S(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = C(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, g) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, R(a).class]),
      style: ve(R(a).style)
    }, [
      e.icon ? (r(), F(ie, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : b("", !0),
      e.label ? (r(), d("span", dw, v(e.label), 1)) : b("", !0),
      et(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [R(ys), o.value]
      ]),
      h.$slots.end ? (r(), d("span", fw, [
        ue(h.$slots, "end", {}, void 0, !0)
      ])) : b("", !0)
    ], 6)) : et((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [R(ys), o.value]
    ]);
  }
}), K6 = /* @__PURE__ */ U(hw, [["__scopeId", "data-v-d9c38ca8"]]), mw = { class: "title" }, pw = { class: "state" }, gw = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ds(t.line, t.events);
    return (o, l) => (r(), F(Y0, {
      rows: R(n),
      failure: R(a),
      loaded: R(s),
      empty: e.empty
    }, {
      default: D(({ row: i }) => [
        m("span", mw, v(i.title), 1),
        m("span", pw, v(R(cn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Y6 = /* @__PURE__ */ U(gw, [["__scopeId", "data-v-6be0c59e"]]);
function vw(e = 1e3, t = null) {
  const n = C(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const za = C(Date.now() / 1e3);
let fl = 0, jn = 0;
function co() {
  return jn || (za.value = Date.now() / 1e3, fl = setInterval(() => za.value = Date.now() / 1e3, 1e3)), jn += 1, zl() && pa(() => {
    jn -= 1, jn || clearInterval(fl);
  }), za;
}
const yw = 200, bw = lr + Kn + ir + yw, kw = 300, Fn = /* @__PURE__ */ new WeakMap();
function ww(e, t) {
  const n = Fn.get(e) ?? [];
  Fn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Fn.get(e);
    Fn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, kw);
}
function Jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function $w(e, t, n) {
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
function xw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push($w(o, l, n.value)), performance.now() - l < bw) return void requestAnimationFrame(u);
        ww(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const Sw = ["title", "data-figure-mark", "data-folded", "data-open"], Mw = {
  key: 2,
  class: "worker"
}, _w = { class: "head" }, Cw = { key: 0 }, Aw = {
  key: 3,
  class: "status"
}, Ew = {
  key: 0,
  class: "figure"
}, Ow = {
  key: 1,
  class: "ran-for"
}, Tw = { key: 2 }, Iw = {
  key: 3,
  class: "news"
}, Bw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Rw = {
  key: 6,
  class: "settled"
}, Lw = {
  key: 1,
  class: "bar"
}, Nw = {
  key: 3,
  class: "detail body"
}, qw = {
  key: 0,
  class: "body-label"
}, Dw = ["title"], Pw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ma(), a = ["onClick", "onAct"], s = S(() => Object.fromEntries(Object.entries(n).filter(([ce]) => !a.includes(ce)))), o = C(!1), l = S(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = S(() => t.open !== void 0), u = S(() => i.value || l.value), c = S(() => i.value ? t.open : o.value), f = S(() => i.value ? !t.open : l.value && !o.value), h = S(() => !!(t.mark.action && n.onAct)), g = S(() => u.value || h.value || !!n.onClick), y = C(null), k = C(null), { folded: _, phase: x } = rr(y, () => f.value);
    xw(y, f, x, Se(Le, null));
    function M(ce) {
      var be, Ie;
      if (!(ce.target !== y.value && !k.value.contains(ce.target))) {
        if (i.value) return (be = n.onClick) == null ? void 0 : be.call(n, ce);
        if (l.value) return void (o.value = !o.value);
        (Ie = n.onAct || n.onClick) == null || Ie(ce);
      }
    }
    const T = (ce) => n.onAct(ce), H = ["failed", "unfinished"], W = S(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), I = S(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), z = S(() => I.value || "var(--tone-work)"), N = S(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), E = co(), L = S(
      () => t.mark.began_at && N.value && !t.mark.figure && !t.mark.counting ? Vi(E.value - t.mark.began_at) : ""
    ), q = S(() => {
      const { started: ce, ended: be } = t.mark;
      return ce ? be ? `ran ${el(be - ce, !0)}` : el(E.value - ce, !0) : L.value;
    }), w = ["bad", "danger", "warn"], p = S(() => w.includes(W.value) || t.mark.asks ? "attention" : N.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], A = S(() => $.includes(W.value)), B = S(() => p.value === "process" ? "running" : A.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), j = S(
      () => !!(t.mark.figure || q.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), V = S(() => t.mark.markIcon ? { component: Et, props: { class: "ico", name: t.mark.markIcon } } : { component: ie, props: { name: t.mark.icon || "dot" } }), J = S(() => [t.mark.title, t.mark.time ? Gi(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = S(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ce, be) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        R(x),
        {
          open: c.value,
          folding: i.value && f.value,
          live: g.value,
          failed: A.value,
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
      onClick: M
    }), [
      (r(), F(Ke(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: D(() => [
          e.mark.agentId ? (r(), F(fn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: D(() => [
              (r(), F(Ke(V.value.component), cs(Ul(V.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), F(Ke(V.value.component), cs(De({ key: 1 }, V.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", Mw, v(e.mark.worker), 1)) : b("", !0),
          m("span", _w, [
            O(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", Cw, v(e.mark.name), 1)) : b("", !0),
            u.value ? (r(), F(Yt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : b("", !0)
          ]),
          j.value ? (r(), d("span", Aw, [
            e.mark.figure ? (r(), d("span", Ew, v(e.mark.figure), 1)) : b("", !0),
            q.value ? (r(), d("span", Ow, v(q.value), 1)) : b("", !0),
            e.mark.stopping ? (r(), d("span", Tw, "Stopping")) : b("", !0),
            e.mark.news ? (r(), d("span", Iw, v(e.mark.news), 1)) : b("", !0),
            B.value === "running" ? (r(), d("span", Bw)) : B.value ? (r(), F(Et, {
              key: 5,
              class: Y(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : b("", !0),
            e.mark.settled ? (r(), d("span", Rw, v(e.mark.settled), 1)) : b("", !0)
          ])) : b("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), F(or, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(T, ["stop"])
      }, null, 8, ["label", "open"])) : b("", !0),
      (e.mark.figure || e.mark.counting) && N.value ? (r(), d("span", Lw, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: z.value })
        }, null, 4)
      ])) : b("", !0),
      e.mark.detail && !R(_) ? (r(), F(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      e.mark.body && !R(_) ? (r(), d("div", Nw, [
        e.mark.bodyLabel ? (r(), d("p", qw, v(e.mark.bodyLabel), 1)) : b("", !0),
        O(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : b("", !0),
      e.mark.command && !R(_) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Dw)) : b("", !0),
      e.mark.card ? (r(), F(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      ue(ce.$slots, "default", {
        shown: !R(_)
      }, void 0, !0)
    ], 16, Sw));
  }
}), dr = /* @__PURE__ */ U(Pw, [["__scopeId", "data-v-6e839007"]]), jw = 8, Fw = 40, Ww = [];
class fo {
  constructor(t, n, { top: a = jw, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Ww.push(this);
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
    n > Fw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Hw = 60, zw = 300, fr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function hr(e, t) {
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
  const c = new fo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => zw, more: () => a.value > 0, previous: u }, { top: Hw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Uw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function mr(e) {
  var n;
  const t = Uw[e] || ((n = Kt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const Gw = (e) => mr(String(e).split(":")[0]), Vw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Kw = "agents", Yw = { passed: "good", failed: "danger", warned: "warn", running: "" }, Qw = { good: "good", warn: "warn", danger: "danger" }, hl = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => dh(e.target_model, e.target_id || 0)
}, Jw = { "open row": (e) => Gw(e.target_model), "open page": () => mr("pages") };
function Xw(e, t) {
  const n = t || {}, a = hl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Yw[e.outcome] || "" : Qw[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Kw ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Jw[a](e) : "",
    handlers: a ? { onAct: () => hl[a](e) } : {}
  };
}
const Zw = 24, e2 = 1e3, ml = 2e3, t2 = 0.25, n2 = 5e3;
function a2(e, t = Zw, n = () => !0) {
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
    const I = Date.now() - u < ml ? ml : e2;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, g(!1);
  }
  function k(W = !1) {
    const I = c();
    I && W && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function _() {
    M(), !a.value && (a.value = !0, g(!0));
  }
  const x = () => !!c() && f() <= c().clientHeight * t2;
  function M() {
    clearTimeout(i), x() && (i = setTimeout(() => a.value && x() && n() && k(!0), n2));
  }
  function T() {
    h() ? y() : _();
  }
  function H(W = 1, I = !1) {
    a.value ? s.value += Math.max(0, W) : k(I);
  }
  return zl() && pa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: k, left: _, scrolled: T, arrived: H };
}
const s2 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, o2 = (e) => String(e ?? "").replace(s2, ""), l2 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), { away: o, scrolled: l, arrived: i, toBottom: u } = a2(s);
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
      K(v(R(o2)(e.lines.join(`
`)) || e.empty), 1),
      R(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (g) => R(u)(!0))
      }, "Follow")) : b("", !0)
    ], 544));
  }
}, i2 = /* @__PURE__ */ U(l2, [["__scopeId", "data-v-89621acd"]]), r2 = "*.*", u2 = {
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
    const t = e, n = Se(Le, null), a = new ai();
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
      events: l.value ? [r2] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), F(nr, {
      key: 0,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), F(tr, {
      key: 1,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, c2 = { class: "mark-more-inner" }, d2 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, f2 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, h2 = {
  key: 3,
  class: "mark-lines"
}, m2 = "process", pl = "task", p2 = {
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
    const t = e, n = at(), a = S(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = S(() => Vw.has(t.mark.variant) && t.mark.detail || ""), o = S(() => t.mark.target_model === pl ? t.mark.target_id : 0), l = hr(
      fr(n),
      () => t.mark.target_id
    ), i = l.lines, u = C(!1), c = C(""), f = S(() => !t.declaration.body_url && t.mark.target_model === m2 && !!t.mark.target_id);
    async function h(y = l.follow) {
      const k = await y();
      u.value = !0, c.value = k.ok ? "" : k.error;
    }
    const g = S(() => t.shown && f.value);
    return pe(g, (y) => y && h()), Ws(() => g.value && h(), () => g.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && g.value && h(l.newest)
    ), (y, k) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: k[1] || (k[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", c2, [
        e.declaration.body_url ? (r(), F(u2, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(P, { key: 1 }, [
          s.value ? (r(), d(P, { key: 0 }, [
            k[2] || (k[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", d2, v(s.value), 1)
          ], 64)) : b("", !0),
          f.value && c.value ? (r(), d("p", f2, v(c.value), 1)) : f.value && u.value ? (r(), d(P, { key: 2 }, [
            k[3] || (k[3] = m("p", { class: "mark-label" }, "Output", -1)),
            O(i2, {
              class: "mark-terminal",
              lines: R(i),
              feed: R(l).feed,
              onOlder: R(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", h2, v(a.value.join(`
`)), 1)) : b("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: k[0] || (k[0] = $e((_) => R(je)(`${pl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : b("", !0)
        ], 64))
      ])
    ], 2));
  }
}, As = /* @__PURE__ */ U(p2, [["__scopeId", "data-v-df71b15a"]]), g2 = ["title", "aria-label", "onClick"], v2 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, y2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = S(() => qf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = C(""), s = Se(Le);
    async function o(l) {
      const i = await $n(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(P, null, [
      (r(!0), d(P, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: $e((c) => o(u), ["stop"])
      }, [
        O(Et, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, g2))), 128)),
      a.value ? (r(), d("span", v2, v(a.value), 1)) : b("", !0)
    ], 64));
  }
}, b2 = /* @__PURE__ */ U(y2, [["__scopeId", "data-v-7a62c88e"]]);
function pr(e, t) {
  const n = Ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const gr = pr("/api/marks", "marks"), Q6 = gr.fetchAll, k2 = gr.find, w2 = ["data-ref"], $2 = ["data-ref"], x2 = { class: "mark-row" }, S2 = "dock add", M2 = "questions.answer", _2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = S(() => k2(a.mark.type)), o = S(() => Xw(a.mark, s.value)), l = S(() => {
      var g;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (g = s.value) != null && g.body_url);
    }), i = S(() => l.value || !!o.value.handlers.onAct), u = S(() => a.mark.type === M2), c = C(!1);
    function f() {
      c.value = !c.value;
    }
    const h = S(() => {
      var g;
      return (((g = s.value) == null ? void 0 : g.buttons) || []).filter((y) => {
        var k;
        return !a.docked || !((k = y.runs) != null && k.startsWith(S2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (g, y) => {
      var k, _;
      return (k = s.value) != null && k.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": R(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        O(As, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, w2)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (_ = s.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": R(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", x2, [
          O(dr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Hl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: x }) => [
                O(As, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          O(b2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, $2));
    };
  }
}, C2 = /* @__PURE__ */ U(_2, [["__scopeId", "data-v-424ddb61"]]), A2 = ["data-ref"], E2 = ["inert"], O2 = { class: "group-fold" }, T2 = { class: "thread-group" }, I2 = {
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
      O(dr, {
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
        m("div", O2, [
          m("div", T2, [
            (r(!0), d(P, null, ne(e.group.marks, (c) => (r(), F(C2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, E2)) : b("", !0)
    ], 8, A2));
  }
}, J6 = /* @__PURE__ */ U(I2, [["__scopeId", "data-v-45b58b9b"]]);
function B2(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), nt(() => n.disconnect()), t;
}
const R2 = { class: "chat-dock-fold" }, L2 = ["aria-label"], N2 = { class: "chat-dock-head" }, q2 = { class: "chat-dock-inner" }, D2 = { class: "chat-dock-foot" }, vr = 700, P2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = C(null), a = C(null), s = B2(a), o = C(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, vr)), nt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", R2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(i.$slots, "edge", {}, void 0, !0),
          m("header", N2, [
            ue(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", q2, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ve(R(s) === null ? null : { height: `${R(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(i.$slots, "still", {}, void 0, !0),
          m("footer", D2, [
            ue(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, L2)
      ])
    ], 2));
  }
}, j2 = /* @__PURE__ */ U(P2, [["__scopeId", "data-v-cc05fdac"]]), F2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ua = 5, W2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ua, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ua}s`, animationDelay: `${(n - Ua).toFixed(2)}s` };
    return (s, o) => (r(), d("span", F2, [
      m("i", { style: a })
    ]));
  }
}, H2 = /* @__PURE__ */ U(W2, [["__scopeId", "data-v-2a7bc150"]]), z2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Es = (e) => e.charAt(0).toUpperCase() + e.slice(1), U2 = (e) => Es(e.replace(/_at$/, "").replaceAll("_", " ")), G2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, V2 = (e, t, n) => [Es(`${e} ${n}`), (t == null ? void 0 : t.state) && Es(t.state)].filter(Boolean).join(" · "), yr = (e) => Wt(e).text, K2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? yr(t) : (e == null ? void 0 : e.name) ?? "", Y2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? yr(t) : "", Q2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !z2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: U2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], J2 = { reviewing: "Under review" }, X2 = (e, t) => e || J2[t == null ? void 0 : t.state] || "", br = pr("/api/docks", "docks"), X6 = br.fetchAll, Lt = br.find, Z2 = 6, Ga = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ho = (e) => Date.parse(e.leaves_at) / 1e3, Zt = (e) => !!(e.leaves_at && !e.kept), e$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Zt(e) || t < ho(e) || n.has(e.id)), t$ = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => e$(a, t, n)).sort((a, s) => a.id - s.id);
function n$(e, t, n = Z2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ho(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const a$ = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Os = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), s$ = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), o$ = (e) => ({ ...e.kept ? Os("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Os("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), l$ = ["keep", "unkeep", "open", "undock"], i$ = (e) => ({ ...e, iconOnly: l$.includes(e.action) });
function r$(e, t) {
  var n;
  return [
    ...s$(e, t) ? [o$(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Kt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Os("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(i$);
}
function kr(e, t) {
  const n = r$(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: a$(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const u$ = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || kr(e, t).title, c$ = { class: "dock-text" }, d$ = ["title"], f$ = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, h$ = {
  class: "dock-facts",
  "data-dock-facts": ""
}, m$ = {
  key: 1,
  "data-dock-row": ""
}, p$ = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = S(() => Lt(a.item.type)), o = co(), l = S(() => Sn(a.item.created_at, o.value * 1e3)), i = C(null), u = C(null), c = C(null), f = C(null), h = S(() => kr(a.item, s.value)), g = at(), y = S(() => `dock.${a.item.id}`), k = S(() => g.props[y.value].data.value), _ = S(() => u$(a.item, s.value, k.value)), x = S(() => sa(a.item.target_model ?? "")), M = S(() => {
      var p;
      return ((p = s.value) == null ? void 0 : p.word) ?? "";
    }), T = S(() => ({ ...k.value, id: a.item.target_id, term: x.value })), H = () => {
      var p, $;
      return (($ = (p = s.value) == null ? void 0 : p.reads) == null ? void 0 : $.length) && g.reload(y.value);
    };
    Rc(Ps, { data: k, reload: H, readOutput: fr(g) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (p, $, A) => {
        var j;
        H();
        const B = (j = g.followUndeclared) == null ? void 0 : j.call(g, [`${x.value.replaceAll("-", "_")}.*`], (V) => {
          (!V.row_id || V.row_id === a.item.target_id) && H();
        });
        A(() => B == null ? void 0 : B());
      },
      { immediate: !0 }
    );
    const W = C(/* @__PURE__ */ new Set()), I = C("");
    async function z(p) {
      if (p.action === "undock") return n("undock", p);
      if (p.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      p.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, p.label])), I.value = "";
      const A = await $n(p, { id: a.item.target_id }, g.environment);
      (A == null ? void 0 : A.ok) === !1 && (W.value = new Set([...W.value].filter((B) => B !== p.label)), I.value = `Could not ${p.label.toLowerCase()}: ${A.error}`);
    }
    const N = S(() => h.value.actions.filter((p) => !W.value.has(p.label))), E = S(() => {
      var p;
      return X2((p = s.value) == null ? void 0 : p.badge, T.value);
    }), L = S(() => h.value.controls), q = S(() => {
      var p;
      return !((p = s.value) != null && p.folds && a.folded);
    }), w = S(() => {
      var p;
      return !!((p = s.value) != null && p.draws_head) && !a.collapsed;
    });
    return (p, $) => {
      var A, B, j, V;
      return r(), F(j2, {
        label: h.value.title + ((A = s.value) != null && A.needs_user ? ", waiting for you" : ""),
        type: (B = s.value) != null && B.needs_user ? "waiting" : "",
        folded: !!((j = s.value) != null && j.folds) && e.folded,
        body: !!((V = s.value) != null && V.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (J) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (r(), F(H2, {
            key: 0,
            "ends-at": R(ho)(e.item)
          }, null, 8, ["ends-at"])) : b("", !0)
        ]),
        head: D(() => {
          var J;
          return [
            w.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(P, { key: 1 }, [
              O(ie, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", c$, [
                m("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: _.value
                }, v(_.value), 11, d$)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? b("", !0) : (r(), d(P, { key: 0 }, [
                K(v(l.value), 1)
              ], 64))
            ], 512),
            L.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = $e(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(P, null, ne(L.value, (oe) => {
                var ce, be;
                return r(), d(P, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ce = oe.variants) != null && ce.length) || !((be = T.value) != null && be.state) || oe.variants.includes(T.value.state)) ? (r(), F(ge, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (Ie) => z(oe)
                  }, {
                    default: D(() => [
                      O(ie, {
                        name: oe.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : b("", !0)
                ], 64);
              }), 128))
            ])) : b("", !0)
          ];
        }),
        still: D(() => [
          I.value || e.refusal ? (r(), d("p", f$, v(I.value || e.refusal), 1)) : b("", !0)
        ]),
        foot: D(() => {
          var J;
          return [
            m("span", h$, [
              E.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(E.value), 3)) : b("", !0),
              M.value ? (r(), d("span", m$, v(M.value) + " " + v(e.item.target_id), 1)) : b("", !0),
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
              default: D(() => [
                K(v(s.value.folds) + " ", 1),
                O(Yt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : b("", !0),
            m("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = $e(() => {
              }, ["stop"]))
            }, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              q.value ? (r(), d(P, { key: 0 }, [
                O(eo, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: R(g).environment,
                  "read-only": R(g).readOnly,
                  "object-name": R(sa)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (oe) => I.value = oe),
                  onDone: p.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(P, null, ne(N.value, (oe) => (r(), F(ge, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (ce) => z(oe)
                }, {
                  default: D(() => [
                    K(v(oe.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : b("", !0)
            ])
          ];
        }),
        default: D(() => {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : b("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, gl = /* @__PURE__ */ U(p$, [["__scopeId", "data-v-4d692a2f"]]), g$ = 24, v$ = 8, Z6 = 420;
function eM({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= g$ ? !0 : e < t && s > v$ ? !1 : null;
}
const y$ = (e, t) => e === void 0 ? t : e, b$ = { me: 1, people: [] }, ia = Ut({
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
  people: b$,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: ta("journal.activity", !0),
  wide: !1,
  sideMini: ta("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ci("journal.activity", () => ia.activity);
Ci("journal.side.mini", () => ia.sideMini);
const wr = "journal.viewer.";
function k$(e, t, n) {
  try {
    const a = n.getItem(wr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function w$(e, t, n) {
  try {
    n.setItem(wr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function vl(e, t, n = window.localStorage) {
  const a = C(k$(e, t, n));
  return pe(a, (s) => w$(e, s, n), { deep: !0 }), a;
}
const $$ = {
  key: "dock-all",
  class: "dock-all"
}, x$ = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = vw(500), a = C(/* @__PURE__ */ new Set()), s = Se(Le), o = C(/* @__PURE__ */ new Set()), l = C({});
    async function i($, A) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const B = await $n(A, { id: $.target_id }, s.environment);
      (B == null ? void 0 : B.ok) === !1 && (o.value = new Set([...o.value].filter((j) => j !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${B.error}` });
    }
    const u = S(
      () => t$(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = S(
      () => n$(
        u.value.filter(($) => Ga($, Lt)),
        n.value
      )
    ), f = S(() => u.value.filter(($) => !c.value.includes($) && !Ga($, Lt))), h = vl(`dock-size:${((w = ia.identity) == null ? void 0 : w.root) || location.host}`, null), g = ($) => {
      var A;
      return !!((A = Lt($.type)) != null && A.needs_user);
    }, y = C(/* @__PURE__ */ new Set()), k = C(/* @__PURE__ */ new Set()), _ = S(() => u.value.length === 1), x = ($) => g($) || _.value, M = ($) => x($) ? y.value.has($.id) || k.value.has($.id) : h.value ? h.value.collapsed && !h.value.opened.includes($.id) : t.collapsed, T = S(() => u.value.some(M));
    pe(() => t.collapsed, ($) => {
      k.value = new Set($ ? u.value.filter(g).map((A) => A.id) : []);
    });
    function H() {
      const $ = !T.value;
      h.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(g).map((A) => A.id) : []), k.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var B;
      if (!M($)) return;
      if (x($)) {
        y.value = new Set([...y.value].filter((j) => j !== $.id)), k.value = new Set([...k.value].filter((j) => j !== $.id));
        return;
      }
      const A = (B = h.value) != null && B.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...A, $.id] };
    }
    const I = vl(`dock-folded:${((p = ia.identity) == null ? void 0 : p.root) || location.host}`, {}), z = ($) => {
      var A;
      return !!((A = Lt($.type)) != null && A.folds) && (t.insidesFolded || y$(I.value[$.id], Ga($, Lt) || t.folded));
    };
    function N($) {
      z($) && E($), I.value = { ...I.value, [$.id]: !z($) };
    }
    function E($) {
      var A;
      !((A = h.value) != null && A.collapsed) || h.value.opened.includes($.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, $.id] });
    }
    function L($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function q($) {
      a.value = new Set([...a.value].filter((A) => A !== $.id));
    }
    return ($, A) => (r(), F(js, {
      tag: "div",
      name: "dock",
      duration: R(vr),
      class: "dock-stack"
    }, {
      default: D(() => [
        u.value.length > 1 ? (r(), d("div", $$, [
          O(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: D(() => [
              O(Yt, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : b("", !0),
        (r(!0), d(P, null, ne(f.value, (B) => (r(), F(gl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(Zt)(B) }),
          leaving: R(Zt)(B) && !a.value.has(B.id),
          folded: z(B),
          collapsed: M(B),
          refusal: l.value[B.id],
          onOpen: (j) => W(B),
          onFold: (j) => N(B),
          onUndock: (j) => i(B, j),
          onMouseenter: (j) => L(B),
          onMouseleave: (j) => q(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(P, null, ne(c.value, (B) => (r(), F(gl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(Zt)(B) }),
          leaving: R(Zt)(B) && !a.value.has(B.id),
          folded: z(B),
          collapsed: M(B),
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
}, tM = /* @__PURE__ */ U(x$, [["__scopeId", "data-v-ab76ae18"]]), Mt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Yn = (e) => Math.min(Math.max(e, 0), 1), S$ = (e) => {
  const t = Yn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => S$((e - t) / (n - t));
function nM(e) {
  const t = Yn(e), n = Yn((t - 0.12) / 0.76) * Mt.shuffles, a = Math.min(Math.floor(n), Mt.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), u = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Yn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Mt.shuffles, lift: Mt.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function aM(e, t, n, a, s) {
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
}, sM = (e) => yl[e] ?? yl.butler, mo = 2400, M$ = 0.05;
function _$({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, M$), l = Math.min(t + mo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function oM(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function C$(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function lM(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const iM = (e, t) => ({ ...e, stretch: t.stretch }), rM = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, $r = (e, t) => t >= (e.least ?? 0);
function uM(e, t, n) {
  if (!$r(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const cM = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), A$ = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", bl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), E$ = (e) => e.right > e.left && e.bottom > e.top;
function dM(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(A$)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = bl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = bl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), E$(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function xr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[g]) && (i = -1);
      else {
        const k = (o[h] - e[f]) / y, _ = (o[g] - e[f]) / y;
        l = Math.max(l, Math.min(k, _)), i = Math.min(i, Math.max(k, _));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
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
}, mn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), O$ = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => O$(mn(e, t, n)), T$ = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Wn = ([e, t], n) => e + n() * (t - e);
function I$(e) {
  return T$.map(() => {
    const t = Wn(pt.speed, e), n = Wn(pt.angle, e) * Math.PI / 180, a = Wn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Wn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const B$ = I$(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function R$(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function fM(e, t, n = B$) {
  const a = Ee.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = R$(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= pt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const hM = (e, t) => e && Ee[e.name] ? { name: e.name, u: t / e.frames } : null;
function mM(e, t) {
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
const pM = () => Array.from({ length: Ee.pogo.count }, (e, t) => Ee.pogo.bounce * (t + 1) / Ee.pogo.count), Pt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function gM(e, t, n) {
  const { away: a, side: s } = Ee.bug_smash, o = s * a * n, [l, i] = [t.left + Pt.margin * n, t.right - Pt.margin * n], u = Math.min(Math.max(e + o + s * Pt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function vM(e, t, n) {
  const a = Ee.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Pt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Pt.tall * n * (1 - Te(t, a.emerge)),
      turn: 90 * (1 - Te(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Te(t, a.gone)
    }
  };
}
function yM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Pt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = _$({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Pe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function bM(e) {
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
function L$(e, t) {
  const n = Ee.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = C$(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function kM(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ee.bug_shot, { frame: l, bug: i, shot: u } = L$(n, e.length), c = e.map((M, T) => ({ ...Ts(M, t, Math.min(n / o.fps, Qn(T).shot)), shot: T < u })), f = Te(l / o.frames, o.aim), [h, g] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((M, T) => ({ bug: M, index: T, seconds: n / o.fps - Qn(T).shot, spot: Ts(M, t, Qn(T).shot) })).filter((M) => M.seconds >= 0), k = y.flatMap((M) => {
    const T = (s == null ? void 0 : s.get(M.index)) ?? j$(M.bug, t, M.spot, s ? [] : a);
    return s == null || s.set(M.index, T), s && F$(T, M.seconds, a), W$(T, M.seconds, a);
  }), _ = y.filter((M) => D$(M.bug)).map((M) => ({ seconds: M.seconds, from: M.spot })), x = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (g.x - h.x) * f, y: h.y + (g.y - h.y) * f, back: x }, slush: k, camera: _ };
}
function Qn(e) {
  const t = Ee.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function wM(e, t, n, a) {
  const { limit: s, margin: o } = Ee.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Qn(f), g = Ts(c, t, h.shot), y = Math.abs(g.y - n.y) / Math.tan(s * Math.PI / 180), k = g.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - g.x), _ = Math.abs(g.x - u) >= y ? u : g.x + k * y, x = k > 0 ? Math.max(u, Math.min(_, i)) : Math.min(u, Math.max(_, l)), M = { from: u, to: x, begin: h.walk, end: h.aim };
    return u = x, M;
  });
}
function $M(e, t, n) {
  var o;
  const a = Ee.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Te(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, N$ = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function q$(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const D$ = (e) => e.along * 97 % 1 < _e.camera, pn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function P$(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const f = Math.min(c + _e.step, l.t), h = pn(e, f), g = xr(i, h, n);
    if (g) return { ...g, t: c + (f - c) * g.share };
    i = h;
  }
  const u = pn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function j$(e, t, n, a = []) {
  const s = q$(e.along + 1), [o, l] = N$[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const u = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...f, ...P$(f, t, a) };
  });
}
function F$(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = xr(pn(a, o), pn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function W$(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...pn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - _e.hold) / _e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function xM(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Ee.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, h = Te(e, [0, c]), g = Te(e, [c, c + f]);
  return l.map((y) => {
    const k = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (k.x - n.x) * h,
      y: n.y + (k.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: h >= 1
    };
  });
}
function SM(e, t, n, a, s) {
  const { sway: o, above: l } = Ee.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (_) => {
    const [x, M] = [_.x - e.at.x, _.y - e.at.y];
    return { x: i.x + x * c - M * f, y: i.y + x * f + M * c };
  }, [g, y] = [...n].sort((_, x) => _.x - x.x), k = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: k.map((_, x) => ({ from: _, to: x < k.length / 2 ? g : y })) };
}
const MM = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function ra(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: mn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: mn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function _M(e, t) {
  const n = Ee[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ra(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ra(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * mn(s, ...n.springs)) * (1 - mn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const CM = (e) => e === "pack_box";
function AM(e) {
  const { into: t, out: n } = ra(Ee.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function EM(e) {
  const t = Ee.rope_swing, { into: n, out: a } = ra(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const H$ = { after: 3 }, po = 10, z$ = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, U$ = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, G$ = { weight: 19 }, Sr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, V$ = { every: 120 }, Mr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, _r = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, K$ = {
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
}, _n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: po }), re = (e, t, n = {}) => _n(e, "clip", t, n), Va = (e, t, n = {}) => _n(e, "look", t, n), kl = (e, t, n = {}) => _n(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ..._n(e, "pick", t, n), ...a }), we = (e) => _n("nothing", "nothing", e, {}), Y$ = 120, Q$ = 300, Ka = (e, t) => ({ ...re(e, t), cooldown: Q$ }), he = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), J$ = () => [re("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: z$[e.name] }), Xt = (e) => ({ ...e, shenanigan: !0, lasts: U$[e.name] }), wa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...he("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...he("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...he("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), we(1)]),
  ...he("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), we(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...he("sin_fixed", { cooldown: 300 }, [re("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...he("sin_committed", { cooldown: 300 }, [re("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...he("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), we(7)]),
  ...he("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...he("reported", { cooldown: 90 }, [kl("read", 3), re("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...he("read_message", { cooldown: 30 }, [kl("read", 3), we(1)]),
  ...he("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), we(6)]),
  ...he("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...he("bar_done", { holds: !0 }, J$()),
  ...he("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...he("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...he("launched", { cooldown: 300 }, [re("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...he("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), we(69)]),
  ...he("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), we(2)]),
  ...he("refused", { cooldown: 20 }, [re("shake", 1), we(1)]),
  ...he("work_done", { cooldown: 120 }, [re("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...he("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...he("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...he("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...he("answered", { cooldown: 15 }, [Va("amused", 3), we(2)]),
  ...he("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...he("long_walk", { cooldown: 90 }, [re("stumble", 3), we(22)]),
  ...he("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), we(13)]),
  ...he("typing", { cooldown: 60 }, [Va("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(K$).flatMap(([e, t]) => he(`reacted:${e}`, {}, [Va(t, 1)])),
  ...Object.entries(Mr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => he(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(_r).flatMap(([e, t]) => he(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...he("pastime", {}, [
    wt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    wt("rest", 3, 180, 120),
    wt("yawn", 2, 60, 60),
    wt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    wt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    wt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    wt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Xt($t(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Xt($t(re("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...he("held:search", { cooldown: Y$ }, [Ka("search", 3), { ...Ka("binoculars", 2), when: { home: !0 } }, { ...Ka("glass_bubble", 2), when: { bubble: !0 } }]),
  ...he("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...he("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...he("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...he("tickled", {}, [{ ...$t(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...he("eager", {}, [re("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...he("jump", {}, [Xt($t(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...he("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...he("unit", { cooldown: Sr.build.cooldown }, [ye("unit", G$.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...he("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...he("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: V$.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...he("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...he("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    Xt(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    Xt($t(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...he("laptop", {}, [ye("seat", 6, {}, { stay: [60, 150] }), ye("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...he("ledge_at", {}, [ye("middle", 2, {}, { along: 1 / 2 }), ye("third", 1, {}, { along: 1 / 3 }), ye("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...he("composed_as", {}, [
    ye("facing", 4, {}, { turn: 0, leans: 0 }),
    ye("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ye("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ye("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ye("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Cr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Ar = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), X$ = (e) => Array.isArray(e) ? e[0] : e, Z$ = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, e5 = (e) => wa.some((t) => t.when.moment === e);
function t5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Ar(f).every(([h, g]) => n(h) >= X$(g)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = wa.filter((f) => Cr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= H$.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ye(e, t) {
  const n = t5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Er(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Er(e, t, n) {
  var a;
  for (const [s, o] of Ar(t)) (a = e.memory) == null || a.set(s, e.now + Z$(o, n));
}
function OM(e, t, n) {
  Er(e, wa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const TM = (e) => Object.values(Sr).find((t) => Cr(t.when, e)) ?? null, n5 = (e, t, n) => n - t <= (e.lifetime ?? po), IM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || $r(e.clip, t));
class Or {
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
}, BM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Tr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), RM = {
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
}, LM = 120, a5 = 20, NM = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < a5), s5 = (e) => Is[e] || Is.idle, qM = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Ir = "airborne", o5 = "landing", l5 = "travelling", Br = "grounded", DM = ({ airborne: e, landing: t, trip: n }) => e ? Ir : t ? o5 : n != null && n.started ? l5 : Br;
function PM(e, t) {
  var s;
  const n = i5(e, t);
  return e.mode === Br && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function i5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: g = null } = e;
  if (n === Ir && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...r5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = g !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? g : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : s5(c), facing: y ? g : i.posture === "sit" ? i.face : h };
}
function r5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Bs = (e) => e.outcome, u5 = /^plugin:[^:]+:sins:/, wl = (e) => e.type === "plugins.card" && u5.test(e.markKey), c5 = [
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
], jM = (e, t) => e.filter((n) => n.author === "user" && oa(n.read_at) > t).map((n) => ({ beat: "read_message", time: oa(n.read_at), card: Pi(n) })).sort((n, a) => n.time - a.time), $l = { user: "reacted", agent: "agent_reacted" };
function FM(e, t) {
  return e.filter((n) => $l[n.author] && At(n) > t).map((n) => ({ beat: `${$l[n.author]}:${n.emoji}`, time: At(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const d5 = [.../* @__PURE__ */ new Set([...Object.values(Mr).flatMap((e) => Object.keys(e)), ...Object.keys(_r)])];
function WM(e, t) {
  return e.filter((n) => n.author === "agent" && At(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = d5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: At(n), card: Pi(n) })).sort((n, a) => n.time - a.time);
}
const f5 = (e) => new Or(e).isTest(), ua = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Bs(e)] || "";
}, h5 = 1800, m5 = (e, t) => {
  if (ua(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ua(n) !== "finished" && Number(e.time) - Number(n.time) <= h5 ? "tests_fixed" : "tests_passed";
};
function HM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(f5), s = a.filter((i) => ua(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ua(i))), o.map((i) => ({ beat: m5(i, s), time: Number(i.time), card: i.key }));
}
function zM(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Bs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Bs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const UM = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: At(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function GM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function VM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function KM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = c5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function go(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const xl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function p5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    go(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function YM(e, t, n, a = {}) {
  const s = Ye({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : e5(`held:${e}`) ? "idle" : e;
}
const qe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function QM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < qe.ahead * n ? 180 : Math.sign(a) * qe.turn;
}
const Sl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function JM(e, t) {
  const n = Math.min(qe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(qe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(qe.lines, Math.floor((e.bottom - e.top - 2 * a) / qe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / qe.sweep) % s, i = o % qe.sweep, u = qe.sweep - qe.returnSeconds, c = Sl((i - u) / qe.returnSeconds), f = i <= u ? Sl(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * qe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Ml = 3, Rr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, _l = 12, XM = (e, t) => ({ mood: e, began: t, seen: 0 });
function ZM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Rr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Ml ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * _l) / _l, lasts: Ml } };
}
const e_ = (e) => e.posture === "hang" && !Rr(e.face), g5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), v5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function t_(e, t, n) {
  return g5.has(e) ? 1 / 0 : !v5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Lr(n - t.began, t.share) - it.lead, 0);
}
const y5 = 5;
function n_(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= y5 ? { beat: "long_walk", time: n } : null };
}
const b5 = 30, Hn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function a_(e, t, n, a, s = null) {
  if (t && n < t.until || !Hn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ye({ moment: "spell", state: e, tally: s }, a), [l, i] = Hn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Hn.every } : { state: e, began: 0, until: 0, next: n + Hn.every };
}
const s_ = (e, t, n) => t && n < t.until && Tr.has(e.state) ? { state: t.state, since: t.began } : e, it = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Lr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function o_(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Lr(o, e.share);
  return s ? { eager: k5(t, l), moment: null } : l > it.lead ? { eager: t, moment: null } : l < it.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > it.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < it.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ye({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function k5(e, t) {
  return e.on && t > it.lead + it.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= it.lead && t >= it.least ? { ...e, on: !0, calm: !1 } : e;
}
const w5 = 1, $5 = { look: "look", gaze: "gaze" };
function x5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ye({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [$5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const S5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ye({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), M5 = (e, t, n, a, s, o = 0) => Ye({ moment: "jump", high: e > w5 * t, memory: a, now: s, room: o }, n).name === "backflip", _5 = { work: ["building"], idle: ["standing"] };
function l_(e, t, n, a) {
  const s = Is[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(_5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Tr.has(e) ? { moments: o, began: n || a } : (n && a - n >= b5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function C5(e, t, n) {
  return !Ye({ moment: "pondering", memory: e, now: t }, n) || !Ye({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ye({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Cl = { pondering: C5 };
function i_(e, t, n, a, s, o) {
  if (Cl[e.beat]) {
    const i = Cl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = x5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== po && { lifetime: l.lifetime } } } : null;
}
function r_(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = S5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const u_ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function c_(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function d_(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const f_ = (e, t) => !!(e != null && e.watches) && !t.once, h_ = 10, m_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || n5(a, a.queuedAt, n)), p_ = (e, t) => t ? null : e[0] ?? null;
function g_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const v_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), A5 = 2 * Math.PI, E5 = 500;
function y_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / E5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), g = A5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, _ = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? T5(y, t, n, g, s) : B5(y, t, n, g) : t) ?? y, x = _ != null && _.behind && _.mood === "reading" ? O5(e.point, _, n, l, s) : _;
  return { point: x ?? null, toward: x ? { x: x.x - n.x, y: x.y - n.y } : null, amount: h, at: a };
}
function O5(e, t, n, a, s) {
  const o = (L) => L * 180 / Math.PI, l = (L) => o(Math.atan2(Math.sin(L * Math.PI / 180), Math.cos(L * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + g : f, k = y + l(c - y), _ = Math.min(Math.max(a / 1e3, 0), 0.1), x = qe.turnSpeed * _, M = h ? y + Math.min(Math.max(k - y, -x), x) : k, T = h ? e.readingFollow + g : M, H = T + (M - T) * (1 - Math.exp(-_ / qe.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(go(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), z = Math.min(Math.max(I, -W.up), W.down), N = qe.tipSpeed * _, E = h ? e.readingPitch + Math.min(Math.max(z - e.readingPitch, -N), N) : z;
  return { ...t, readingYaw: M, readingFollow: H, readingPitch: E, readingFacing: i };
}
function T5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: H, pitch: W } = go(T.x - n.x, s, n.y - T.y, o);
    return { yaw: H, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [xl(i(e)), xl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [g, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [k, _, x] = u.map((T, H) => g * T + y * c[H]), M = s * k / _;
  return { ...t, x: n.x + M, y: n.y - p5(M, s, -Math.asin(Math.min(Math.max(x, -1), 1)), o) };
}
const I5 = 0.15;
function b_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= I5;
}
function B5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const R5 = (e) => !(e != null && e.on);
function k_(e, t, n) {
  if (R5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const gn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, st = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ya = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Al = (e) => e * e * (3 - 2 * e);
function L5(e) {
  if (e < 0 || e >= st.seconds) return null;
  const t = Ya(e, ...st.flicker), n = Math.floor(t * st.flickers * 2) % 2 === 0, a = e < st.flicker[1] ? n ? 0.35 + 0.5 * t : st.dim : 1;
  return { strength: 1 - Al(Ya(e, ...st.fade)), lit: a, white: e < st.flash[0] ? 0 : 1 - Al(Ya(e, ...st.flash)) };
}
const w_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function $_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = L5(t - e.at);
  return a && { colour: gn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: st.signs[e.tone], ...a } };
}
function x_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function S_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= gn.looks || a === null && n - e.since >= gn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function M_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, __ = { behind: 39, figure: 40, ahead: 41 }, N5 = "[data-figure-pile]", q5 = { amber: [1, 0.69, 0.125], good: gn.colours.good, bad: gn.colours.bad }, Jn = { phases: 4, ms: 230, dim: 0.25 }, C_ = (e, t, n) => e !== "amber" || (t + n) % Jn.phases < Jn.phases / 2 ? 1 : Jn.dim, A_ = (e) => e === "amber" ? Jn.phases : 1;
function E_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const O_ = Object.keys(q5), Je = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, en = ([e, t], n) => e + n() * (t - e);
function T_(e) {
  const t = Je.least + Math.floor(e() * (Je.most - Je.least + 1));
  return Array.from({ length: Math.min(t, Je.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Je.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = en(Je.start, e), l = en(Je.reach, e);
    return {
      text: Ye({ moment: "digit" }, e).name,
      x: a * o,
      y: Je.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(en(Je.moveMs, e)),
      fadeMs: Math.round(en(Je.fadeMs, e))
    };
  });
}
const Qa = { high: 3, gap: 1 };
function I_(e) {
  const t = Math.floor(e / Qa.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Qa.gap)), up: e % Qa.high * (mt.height - mt.top) };
}
const D5 = (e, t, n) => Ye({ moment: "unit", memory: e, now: t }, n) !== null, P5 = { after: 5 }, j5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Or(t).isBuild());
function B_(e, t, n) {
  const a = j5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= P5.after ? s : null;
}
function R_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: D5(n, a, s) } : null;
}
const El = { ahead: 140, up: 70 };
function L_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * El.ahead, y: a - El.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Ja = { least: 4e3, most: 1e4 }, F5 = (e) => Ja.least + e() * (Ja.most - Ja.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function N_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = F5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const q_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), D_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Nr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), P_ = new Set(wa.filter((e) => Nr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), W5 = (e) => e.some((t) => t.state === "built"), j_ = (e, t) => W5(t) ? e.filter((n) => !Nr.has(n.beat)) : e, vt = { reach: 40, room: 6 }, H5 = (e, t) => t <= e - vt.reach + 2, F_ = (e, t, n) => H5(e, n) ? t - vt.reach : e - vt.reach - vt.room, W_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Xa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, H_ = (e) => en(e() < Xa.longShare ? Xa.long : Xa.short, e), z5 = 2 * mt.width;
function z_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= z5 ? o : e + (o - e + s / 2) % s;
}
const U5 = 60, U_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= U5, Ol = "[data-figure-home]", Cn = () => {
  var t;
  const e = document.querySelector(Ol);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ol)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, G5 = "[data-figure-docked-bars]", V5 = "[data-figure-chat-foot]", K5 = [0.85, 0.6, 0.35, 0.15], Y5 = ["question", "waiting", "suggestion"], G_ = (e, t) => Y5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function V_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Q5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", J5 = "[data-figure-newest]";
function qr() {
  var a, s;
  const e = (a = Cn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(J5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function vn(e, t, n = qr()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = xa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Be.top * t.size, bottom: a.top + Be.bottom * t.size }, l = Mt.gap;
  return !$a(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function K_(e, t, n, a = qr()) {
  if (!a || vn(t, e, a)) return null;
  const s = xa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Tt(), u = t.posture === "stand" ? bo * e.size : Ur * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Mt.gap - l, a.right + Mt.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= c && g.x <= f && vn(g, e, a) && _4(g, e)).sort((g, y) => Math.abs(g.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Za = 0.26, Dr = 0.54, X5 = 1.25 / 5.4, An = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Za, travels: "stand" },
  lounge: { drop: Za, travels: "stand" },
  composed: { drop: Za, travels: "stand" },
  hang: { drop: Dr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Y_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * X5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Dr
}), an = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Z5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Q_ = (e, t) => (e === "sit" ? Z5.has(t) : an.has(e)) ? e : "stand";
function J_(e, t) {
  return e.facing === t.facing || !an.has(e.posture) && !an.has(t.posture) ? t : { posture: "stand", facing: an.has(e.posture) ? e.facing : t.facing };
}
const X_ = 0.25, Z_ = (e, t) => an.has(e) && An[t].drop === 0, Pr = 2, e4 = 90, t4 = 180, n4 = 140, a4 = 280, s4 = 420, o4 = 0.25, l4 = 290, i4 = 600, r4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", u4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", es = 5;
function ca(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < es) return null;
  (l || i) && (o = Math.max(o, Pr));
  const y = o > 1, k = Math.abs(t.x - e.x), _ = k < es ? 0 : k / (e4 * o) * 1e3, x = Math.min(_, y ? n4 : t4), M = Math.abs(t.y - e.y), T = t.y < e.y, H = T && !g && M5(M, n, u, c, f, h), W = T ? s4 + Math.min(M, 400) * o4 : Math.sqrt(2 * M / mo) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: M > es ? H ? i4 : W : 0,
    lead: H ? l4 : T ? a4 : 0,
    easing: T ? r4 : u4,
    hopping: !0,
    clip: H ? "backflip" : T ? "jump" : "fall"
  }, z = { x: t.x, y: t.y, ms: _ + x, lead: 0, easing: "linear", ramp: x, ...y ? { clip: "run" } : {} }, N = g ? c4(t, n) : I, E = T && !a ? [{ ...z, y: e.y }, N] : [{ ...I, x: e.x }, z];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: y };
}
const c4 = (e, t) => ({ x: e.x, y: e.y, ms: Ee.pogo.frames / Ee.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), d4 = (e, t) => e.postures.includes(t) ? t : e.postures[0], eC = (e, t, n) => e.posture === "walk" && n ? "walk" : d4(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - An[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, $a = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, vo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Tt() {
  var t;
  const e = (t = Cn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const zn = 0.5, Tl = 20;
function tC(e, t, n = Tt()) {
  const a = ct(e, t);
  return a.left >= n.left + Tl && a.right <= n.right - Tl;
}
function yo(e, t, n = Tt()) {
  const a = ct(e, t), s = a.right - a.left, o = xa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - zn && i <= n.right + zn && a.top >= n.top - zn && u <= n.bottom + zn;
}
const da = [0.35, 0.5, 0.65], fa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Be = { left: da[0], right: da.at(-1), top: fa[0], bottom: fa.at(-1) }, f4 = 0.24;
function xa(e) {
  if (e.posture === "stand") return { left: Be.left, right: Be.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + f4 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Be.left, t), right: Math.max(Be.right, t) };
}
function h4(e, { size: t }, n = Tt()) {
  const a = xa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bo = (Be.right - Be.left) / 2 + 0.08;
function nC(e, t) {
  return e === "hang" ? Be : { ...Be, bottom: Math.min(Be.bottom, 1 - t - An[e].drop) };
}
const m4 = "[data-figure-agent]";
function jr(e, t, n = "", a = "") {
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
const Fr = (e) => fa.flatMap(
  (t) => da.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ko(e, t, n = "") {
  if (!vn(e, t)) return da.length * fa.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Q5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && $a(s, u) && vo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Fr(s).filter(([i, u]) => l(i, u) || jr(i, u, n)).length;
}
function p4(e, t) {
  const n = ct(e, t);
  return Fr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => jr(a, s, "", m4)).length;
}
const Il = 4;
function aC(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Il; o <= s; o += Il)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!p4(i, e) && vn(i, e)) return i;
    }
  return null;
}
function yn(e, t, n) {
  const a = Tt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => yo(l, t, a) && vn(l, t)).map((l) => ({ spot: l, covered: ko(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Wr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), g4 = [0.5, 0.25, 0.75], v4 = (e) => Wr(e.getBoundingClientRect(), g4), Hr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, y4 = bo, b4 = (e, t, { size: n }, a = y4) => zr(e, Hr[t], a * n, "stand");
function zr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const k4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ur = 0.1, w4 = (e, t, { size: n }) => zr(e, k4[t], Ur * n, "sit"), $4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ts = 60;
function sC(e, t) {
  const n = $4(t);
  return !e.aside || Math.abs(n) >= ts ? t : n < 0 ? 360 - ts : ts;
}
const sn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, x4 = (e) => [.../* @__PURE__ */ new Set([e, ...sn.turns.map((t) => (t + 360) % 360)])];
function oC(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = x4(t), l = sn.every[0] + a() * (sn.every[1] - sn.every[0]);
  return { face: t, from: s ? S4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function S4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / sn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function lC(e, t) {
  const { element: n, edge: a } = Sa(), s = ["left", "right"].map((i) => En(w4(a, i, e), e)).filter((i) => n && yo(i, e) && !ko(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function iC(e, t, { size: n }) {
  const a = (Be.right - Be.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Gr } : e;
}
const Gr = 7;
function Vr() {
  const e = [...document.querySelectorAll(N5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function M4(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Be.left * a, right: n.left + Be.right * a, top: n.top + Be.top * a, bottom: n.bottom };
}
function _4(e, t) {
  const n = Vr();
  return !n || !$a(M4(e, t), n);
}
const C4 = 4;
function Sa() {
  const e = On(), t = Vr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > C4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Gr - n, 0) } };
}
const rC = ({ size: e, below: t }) => (1 - t) * e;
function En(e, t) {
  const n = Tt(), { size: a, below: s } = t, o = An[e.posture].drop * a;
  return { ...h4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Rs = (e, t) => Object.keys(Hr).map((n) => En(b4(e, n, t), t)), wo = (e, t) => Wr(e, K5).map((n) => En(n, t)), Kr = (e, t, n) => yn(e, t, n) ?? e[0];
function uC(e, t) {
  const { element: n, edge: a } = Sa();
  return { ...Kr(Rs(a, e), e, t), view: null, on: n };
}
function cC(e, t, n, a) {
  const { element: s, edge: o } = Sa(), l = (a ? Rs(o, t) : [...Rs(o, t), ...wo(o, t)]).filter(
    (c) => !$a(ct(c, t), e)
  ), i = yn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !ko(i, t) ? i : yn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function On() {
  var a;
  const e = Cn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(G5);
  if (!t) return { ...Ma(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Bl = { within: 2 };
function dC(e) {
  const { element: t, docked: n, edge: a } = On();
  if (!n || e.on !== t) return !0;
  const s = Ma().edge;
  return a.left > s.left + Bl.within || a.left + a.width < s.left + s.width - Bl.within;
}
const A4 = "[data-figure-closing]";
function fC() {
  var n;
  const { element: e, docked: t } = On();
  return t && !!((n = e.firstElementChild) != null && n.matches(A4));
}
const Yr = "[data-figure-progress]";
function hC(e) {
  const t = e.querySelector(Yr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function mC(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const E4 = { across: 300, above: 380, below: 60 };
function pC(e) {
  const { across: t, above: n, below: a } = E4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: O4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const O4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Qr = "[data-figure-bar]", Ls = { back: 144, along: 0.4 };
function gC(e) {
  const { element: t, docked: n, edge: a } = On(), s = n ? t.querySelector(Qr) : null;
  if (!(s != null && s.querySelector(Yr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...En({ x: o - Ls.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function vC(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ls.along * a.size ? t.x + Ls.along * a.size : e.x, y: e.y, behind: !0 };
}
function yC(e) {
  const t = e.querySelector(Qr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ma() {
  const e = Cn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function bC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ma(), u = n === null ? T4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : En({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function T4(e, t, n, a, s) {
  const o = wo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + mt.width < s && u.x + a - vt.reach - vt.room >= l);
  return yn(i.length ? i : o, t, n);
}
const I4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function kC(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  (o || l) && (s = Math.max(s, Pr));
  const y = (H) => {
    const W = ct(H, n, An[H.posture].travels);
    return { x: W.left, y: W.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return B4(y(e), y(t), y({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, s);
  const [_, ...x] = [e, ...u, t].map(y), M = ca(_, x[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: g }), T = x.slice(1).map((H, W) => {
    var I;
    return (I = ca(x[W], H, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : I.legs.find((z) => z.hopping);
  });
  return M && { ...M, legs: [...M.legs, ...T.filter(Boolean)] };
}
function B4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / I4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ca(e, n, o.size, { pace: l }) : ca(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function wC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function $C(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && yn(v4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Sa();
  return { ...Kr(wo(s, t), t, n), view: null, on: a };
}
const R4 = "[data-figure-bubble]", L4 = 250;
let on = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Jr = 0;
const Qt = () => on, ns = /* @__PURE__ */ new WeakMap();
let N4 = 0;
function $o(e) {
  return ns.has(e) || ns.set(e, `floor-${++N4}`), ns.get(e);
}
const q4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, D4 = () => {
  var e, t;
  return ((t = (e = Cn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function P4(e, t) {
  var a;
  const n = (a = e.querySelector(V5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function j4(e, t) {
  const n = e && P4(e, t), a = e ? [...e.querySelectorAll(R4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || q4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: $o(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const F4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= L4 ? (t.top - a.top) / s * 1e3 : 0;
};
function Xr(e = on, t = performance.now()) {
  const n = Tt(), a = D4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = On(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ma();
  return c.element && u.push({ id: $o(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...j4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: F4(e, f, t) }))) });
}
const Ns = /* @__PURE__ */ new Set();
function W4(e) {
  return Ns.add(e), () => Ns.delete(e);
}
function H4() {
  Zr();
  const e = () => {
    Jr = requestAnimationFrame(e), !document.hidden && (on = Xr(on), Ns.forEach((t) => t(on)));
  };
  e();
}
function Zr() {
  cancelAnimationFrame(Jr);
}
const xo = 5, z4 = 56, U4 = { share: 0.6 }, G4 = (e) => -Math.sqrt(2 * mo * U4.share * e), zt = (e, t) => e.find((n) => n.id === t) ?? null;
function xC(e, t = Xr().floors) {
  const n = zt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $o(e.on) : null, o = s && zt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function eu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Qt().floors) {
  const c = zt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || V4(c, f, o)) && K4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const So = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, V4 = (e, t, n) => !So({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function SC(e, t = Qt().floors) {
  if (!So(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= xo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function K4(e, t, n = Qt().floors) {
  const a = zt(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : yo(e, t);
}
function MC(e, t, n, a = Qt().floors) {
  const s = eu(e, n, a);
  if (!e.home) return Y4(e, t, s, a);
  if (!s) return null;
  const o = zt(a, "home"), l = s.y - t.y, i = l > xo ? "dropping" : -l > z4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Y4(e, t, n, a) {
  const s = n ? zt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: G4(e.risen) };
  if (!n) return null;
  if (So(t) && n.y - t.y > xo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function _C(e, t, n) {
  const a = bo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function CC(e, t, n, a = Qt().floors) {
  const s = t && eu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Q4 = ["data-type"], J4 = { class: "figure-floor-name" }, X4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", J4, v(e.floor.type), 1)
    ], 12, Q4));
  }
}, Z4 = /* @__PURE__ */ U(X4, [["__scopeId", "data-v-4e0f1e2e"]]), ex = {
  class: "figure-floors",
  "aria-hidden": "true"
}, tx = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ze(Qt().floors);
    let n = () => {
    };
    return Me(() => {
      n = W4((a) => t.value = a.floors), H4();
    }), Re(() => {
      n(), Zr();
    }), (a, s) => (r(), d("div", ex, [
      (r(!0), d(P, null, ne(t.value, (o) => (r(), F(Z4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, AC = /* @__PURE__ */ U(tx, [["__scopeId", "data-v-e519168b"]]), ln = (e) => typeof e == "number" ? e : Date.parse(e);
function EC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: ln(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => ln(s.row.created_at) - ln(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Rl = 20;
async function OC(e, t, n) {
  for (let a = 0; a < Rl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || ln(o.created_at) <= ln(s.created_at) || !await n()) return a;
  }
  return Rl;
}
const nx = 3, as = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function ax(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = as[n.grouping]) == null ? void 0 : a.call(as, e.row, n)) || "";
}
function sx(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function TC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= nx ? [sx(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = ax(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function ox(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const IC = (e) => (t) => t.filter((n) => n.id !== e), BC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), RC = (e) => (t) => [...t, e], LC = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function NC(e, t = {}) {
  const n = at(), a = C(null), s = C("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function qC(e) {
  const t = at(), n = C("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Un = /* @__PURE__ */ new Map();
function lx(e, t) {
  if (Un.has(e)) return Un.get(e);
  const n = t().finally(() => Un.delete(e));
  return Un.set(e, n), n;
}
function DC() {
  const e = at(), t = C(null), n = C("");
  async function a() {
    const s = await lx(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const ix = { class: "cards-page" }, rx = { class: "cards-bar" }, ux = { class: "cards-count" }, cx = { class: "cards" }, dx = {
  key: 1,
  class: "cards-note"
}, fx = {
  key: 2,
  class: "cards-note"
}, hx = ["data-row", "onClick"], mx = { class: "card-head" }, px = { class: "card-title" }, gx = { class: "card-foot" }, vx = {
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
    return (a, s) => (r(), d("div", ix, [
      m("div", rx, [
        m("span", ux, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        O(ge, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            O(ie, {
              name: "plus",
              size: 12
            }),
            K(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", cx, [
        e.loaded ? e.failure ? (r(), d("p", dx, v(e.failure), 1)) : e.rows.length ? b("", !0) : (r(), d("p", fx, "No " + v(e.term) + "s yet", 1)) : (r(), F(Qe, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(P, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", mx, [
            O(ie, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            K(" " + v(e.head(o)), 1),
            O(tt, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", px, v(e.title(o)), 1),
          m("span", gx, v(e.foot(o)), 1)
        ], 8, hx))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, PC = /* @__PURE__ */ U(vx, [["__scopeId", "data-v-b39fea5d"]]), Ll = "newest";
function jC(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = C(""), o = C(Ll), l = C("all"), i = S(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((g) => ox(g, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(g) === (l.value === "open")));
    return o.value === Ll ? h : [...h].sort((g, y) => t(g).localeCompare(t(y)));
  }), u = S(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const yx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, bx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, kx = 40, wx = "top", $x = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var g;
    const n = e, a = (g = Se(Le, null)) == null ? void 0 : g.autoScroll, s = S(() => a === wx), o = C(null), l = C(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= kx, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    pe(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await Fe(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return Me(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), nt(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, k) => (r(), d("div", yx, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ue(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", bx, [
        O(Gt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: D(() => [
            et(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              O(ie, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              k[0] || (k[0] = K(" Newest ", -1))
            ], 512), [
              [Gl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, FC = /* @__PURE__ */ U($x, [["__scopeId", "data-v-d704d7e3"]]), xx = ["aria-selected", "data-tab", "onClick"], Sx = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Mx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = S(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = C(null), i = C({ left: 0, width: 0, slides: !1 }), u = (g) => n.answer[g.count_field] !== void 0;
    function c(g) {
      var k;
      const y = (k = l.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: g }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => Fe(() => c(!0));
    let h = null;
    return Me(() => {
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
      (r(!0), d(P, null, ne(o.value, (k) => {
        var _, x;
        return r(), d("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((_ = e.active) == null ? void 0 : _.key) === k.key }]),
          "aria-selected": ((x = e.active) == null ? void 0 : x.key) === k.key,
          "data-tab": k.key,
          onClick: (M) => a("choose", k)
        }, [
          K(v(k.label) + " ", 1),
          u(k) ? (r(), d("span", Sx, v(e.answer[k.count_field]), 1)) : b("", !0)
        ], 10, xx);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, WC = /* @__PURE__ */ U(Mx, [["__scopeId", "data-v-63fcd326"]]), _x = { class: "task-bar" }, Cx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", _x, [
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
}, HC = /* @__PURE__ */ U(Cx, [["__scopeId", "data-v-a4fc52ae"]]), Ax = {
  class: "tab-body",
  "data-tab-body": ""
}, Ex = { "data-tab-content": "" }, Ox = {
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
    }), (s, o) => (r(), d("div", Ax, [
      n.value ? (r(), F(Qe, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : b("", !0),
      et(m("div", Ex, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Gl, !n.value]
      ])
    ]));
  }
}, zC = /* @__PURE__ */ U(Ox, [["__scopeId", "data-v-63876533"]]), Tx = {
  class: "search-bar",
  "data-search-bar": ""
}, Ix = { class: "search-bar-control" }, Bx = ["value", "placeholder", "aria-label"], Rx = ["aria-expanded"], Lx = {
  key: 0,
  "data-menu-count": ""
}, Nx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var M;
    const a = e, s = n, o = hu(), l = ((M = Se(Le, null)) == null ? void 0 : M.search) ?? {}, i = S(() => l.placeholder || a.placeholder), u = l.context ?? [], c = C(null), f = C(null), h = C([]), g = S(() => h.value.length ? h.value[h.value.length - 1].next : u), y = S(() => !!o.menu || u.length > 0), k = (T) => {
      h.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function _(T) {
      if (T.next.length) {
        h.value = [...h.value, T];
        return;
      }
      f.value = null, s("pick", T.click);
    }
    function x() {
      var T;
      s("update:modelValue", ""), (T = c.value) == null || T.focus();
    }
    return t({ focus: () => {
      var T;
      return (T = c.value) == null ? void 0 : T.focus();
    } }), (T, H) => {
      var W;
      return r(), d("div", Tx, [
        m("div", Ix, [
          O(ie, {
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
            onKeydown: Ct(x, ["esc"])
          }, null, 40, Bx),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: x
          }, [
            O(ie, {
              name: "close",
              size: 12
            })
          ])) : b("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: k
          }, [
            e.menuCount ? (r(), d("span", Lx, v(e.menuCount), 1)) : b("", !0),
            O(ie, {
              name: "caret",
              size: 12
            })
          ], 8, Rx)) : b("", !0)
        ]),
        (W = R(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (I) => s("pick", R(l).button.click))
        }, v(R(l).button.title), 1)) : b("", !0),
        ue(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), F(ga, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = $e(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (I) => f.value = null)
        }, {
          default: D(() => [
            h.value.length ? (r(), F(Ue, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (I) => h.value = h.value.slice(0, -1))
            }, {
              default: D(() => [
                K("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : b("", !0),
            (r(!0), d(P, null, ne(g.value, (I) => (r(), F(Ue, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (z) => _(I)
            }, {
              default: D(() => [
                K(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? b("", !0) : ue(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : b("", !0)
      ]);
    };
  }
}, qx = /* @__PURE__ */ U(Nx, [["__scopeId", "data-v-45374bed"]]), Dx = {
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
    return (o, l) => (r(), F(qx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: D(() => [
        O(_t, null, {
          default: D(() => [...l[2] || (l[2] = [
            K("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(P, null, ne(a, (i) => O(Ue, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: D(() => [
            K(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(P, { key: 0 }, [
          O(_t, null, {
            default: D(() => [...l[3] || (l[3] = [
              K("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(P, null, ne(s, (i) => O(Ue, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: D(() => [
              K(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : b("", !0)
      ]),
      default: D(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, UC = /* @__PURE__ */ U(Dx, [["__scopeId", "data-v-dab0064d"]]);
function GC() {
  const e = C(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const VC = (e) => import(
  /* @vite-ignore */
  e
), Px = 86400, qs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function jx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((qs(t) - qs(e)) / Px);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function KC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = qs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: jx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ss = 280, os = 240, ls = 120, Fx = 6, Wx = 14, bn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Hx(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function tu(e, t) {
  const n = Math.max(0, Hx(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function zx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Wx}px)` }), e.offsetHeight, e.style.transition = `height ${ss}ms ${bn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = tu(t, e));
    const g = s() - i;
    if (!u && g >= ss && (u = !0, e.style.transition = `opacity ${os}ms ease-out, transform ${os}ms ${bn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < ss + os) return a(h);
    f();
  };
  return a(h), f;
}
function YC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Fx}px)` }), e.offsetHeight, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${bn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = tu(t, e)), s() - l < ls) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Ux = 140, Gn = 220, Nl = 5;
function QC({ gap: e = Ux, later: t = setTimeout } = {}) {
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
  const c = (f, h, g, y = zx) => {
    if (l || !h.pane || !h.follows()) return g();
    const k = { el: f, options: h, done: g, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(k, () => o = t(u, e));
    f.style.display = "none", n.push(k), n.length >= Nl && c.flush();
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
function JC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Gn}ms ${bn}, opacity ${Gn}ms ease-in, margin ${Gn}ms ${bn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Gn);
}
const nu = "chat.pins.minimised", Xn = C(ta(nu, !1));
function ql(e) {
  Xn.value = e, to(nu, e);
}
function Gx(e) {
  const t = S(() => e()), n = S(() => Xn.value ? [] : e()), a = () => ql(!Xn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => At(o) > s).length,
    (o, l) => o > l && ql(!1)
  ), { pins: t, visible: n, minimised: Xn, toggle: a };
}
const Vx = ["title"], Kx = {
  key: 0,
  class: "pins-count"
}, Yx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Gx(() => t.pinRows);
    return (o, l) => R(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: R(a), inline: e.inline }]),
      title: R(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => R(s) && R(s)(...i), ["stop"]))
    }, [
      O(ie, {
        name: R(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      R(a) ? (r(), d("span", Kx, v(R(n).length), 1)) : b("", !0)
    ], 10, Vx)) : b("", !0);
  }
}, XC = /* @__PURE__ */ U(Yx, [["__scopeId", "data-v-d073c504"]]), Qx = ["title"], Jx = ["title"], Xx = { class: "diff-card-dir" }, Zx = { class: "diff-card-name" }, e8 = ["title"], t8 = ["title"], n8 = {
  key: 0,
  class: "diff-card-note"
}, a8 = ["href"], s8 = ["src", "alt"], o8 = { class: "diff-card-rows" }, l8 = { class: "diff-row-num" }, i8 = { class: "diff-row-sign" }, r8 = { class: "diff-row-code" }, u8 = {
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
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = S(() => n.path.lastIndexOf("/") + 1), c = S(() => n.path.slice(0, u.value)), f = S(() => n.path.slice(u.value)), h = S(() => n.change === "deleted"), g = S(() => l[n.change]), y = S(() => new Set(n.rows.filter((q) => q.line_type === "add").map((q) => q.line))), k = C("after"), _ = S(() => k.value === "before" ? n.whole.old : n.whole.text), x = S(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map((q, w) => ({ line_type: k.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: q })) : n.rows.filter(
      (q) => !(n.editsOnly && ["ctx", "fold"].includes(q.line_type)) && !(n.hideRemovals && q.line_type === "del")
    )), M = C(!1), T = S(() => n.lines && !M.value && !n.whole), H = S(() => T.value ? x.value.slice(0, n.lines) : x.value), W = S(() => x.value.length - H.value.length), I = (q) => q.line === null || q.line_type === "del" ? "" : q.line, z = (q) => q.line_type === "fold" ? q.hidden ? `⋯ ${q.hidden} lines` : "⋯" : q.text, N = C(null), E = C(null);
    let L = null;
    return Me(() => {
      if (!E.value) return;
      let q = !0;
      L = new ResizeObserver(() => {
        !N.value || !E.value || (N.value.style.transition = q ? "none" : "", N.value.style.height = `${E.value.offsetHeight}px`, q = !1);
      }), L.observe(E.value);
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
          m("span", Xx, v(c.value), 1),
          m("span", Zx, v(f.value), 1),
          g.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(g.value), 3)) : b("", !0)
        ], 8, Jx),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        O(tt, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((p) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, v(k.value === "after" ? "After" : "Before"), 9, e8)) : b("", !0),
        h.value ? b("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((p) => a("whole"), ["stop"]))
        }, [
          O(ie, {
            name: "file",
            size: 12
          })
        ], 10, t8))
      ], 8, Qx),
      e.whole && e.whole.error ? (r(), d("p", n8, v(e.whole.error), 1)) : b("", !0),
      !h.value && !e.folded ? (r(), d(P, { key: 1 }, [
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
          }, null, 8, s8)
        ], 8, a8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: N,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            m("div", o8, [
              (r(!0), d(P, null, ne(H.value, (p, $) => (r(), d("div", {
                key: $,
                class: Y(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", l8, v(I(p)), 1),
                m("span", i8, v(i[p.line_type]), 1),
                m("span", r8, v(z(p)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((p) => M.value = !0, ["stop"]))
              }, v(W.value) + " more " + v(W.value === 1 ? "line" : "lines"), 1)) : b("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : b("", !0)
    ], 2));
  }
}, ZC = /* @__PURE__ */ U(u8, [["__scopeId", "data-v-23581cbb"]]), c8 = { "data-queue-controls": "" }, d8 = { class: "counts" }, f8 = { "data-queue-spots": "" }, h8 = {
  class: "spots",
  "aria-label": "Places in use"
}, m8 = { "data-queue-waiting": "" }, p8 = { key: 0 }, g8 = { class: "control" }, v8 = { class: "stepper" }, y8 = ["disabled"], b8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, k8 = ["disabled"], w8 = ["for"], $8 = ["id", "value", "disabled", "onChange"], x8 = { class: "control" }, S8 = ["aria-checked", "disabled"], M8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, _8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, C8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, A8 = {
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
    return (i, u) => (r(), d("div", c8, [
      O(Ht, { icon: "gauge" }, {
        default: D(() => [...u[3] || (u[3] = [
          K("Now", -1)
        ])]),
        _: 1
      }),
      m("div", d8, [
        m("div", null, [
          m("strong", f8, [
            K(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", h8, [
            (r(!0), d(P, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", m8, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", p8, "The oldest goes first.")) : b("", !0)
        ])
      ]),
      m("div", g8, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", v8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, y8),
          m("output", b8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, k8)
        ])
      ]),
      (r(!0), d(P, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, w8),
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
        }, null, 40, $8)
      ]))), 128)),
      m("div", x8, [
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
        ])], 8, S8)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", M8, [
        O(ie, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = K("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", _8, [
        O(ie, {
          name: "pause",
          size: 13
        }),
        K("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : b("", !0),
      o.value ? (r(), d("p", C8, v(o.value), 1)) : b("", !0)
    ]));
  }
}, E8 = /* @__PURE__ */ U(A8, [["__scopeId", "data-v-975b4b89"]]), O8 = ["data-queue-row", "data-queue-process"], T8 = ["aria-expanded"], I8 = { class: "run-line" }, B8 = { class: "leading" }, R8 = {
  key: 0,
  "data-queue-position": ""
}, L8 = ["title"], N8 = { class: "command" }, q8 = {
  class: "time",
  "data-queue-time": ""
}, D8 = { class: "details" }, P8 = { "data-queue-type": "" }, j8 = { class: "failed" }, F8 = { class: "drop-inner" }, W8 = { class: "output" }, H8 = { class: "output-heading" }, z8 = ["href"], U8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(), o = hr((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = co(), u = S(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = S(() => {
      const g = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!g) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, k = Math.max(0, Math.floor((y - new Date(g).getTime()) / 1e3));
      return k < 60 ? `${k} s` : k < 3600 ? `${Math.floor(k / 60)} m ${k % 60} s` : `${Math.floor(k / 3600)} h ${String(Math.floor(k / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const g = s.value, y = g.scrollHeight - g.scrollTop - g.clientHeight < 2;
      await o.follow(), await Fe(), n.expanded && y && (g.scrollTop = g.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await Fe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return pe(() => n.expanded, h, { immediate: !0 }), Mn(["output.*"], f, (g) => si(g, /* @__PURE__ */ new Set([n.run.id]))), (g, y) => (r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (k) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = Ct($e((k) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Ct($e((k) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", I8, [
          m("span", B8, [
            e.run.section === "waiting" ? (r(), d("span", R8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, L8))
          ]),
          m("code", N8, v(e.run.line), 1),
          m("span", q8, v(c.value), 1),
          O(ie, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", D8, [
          m("span", P8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(P, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((k) => R(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(P, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : b("", !0),
          e.run.task_id ? (r(), d(P, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((k) => R(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : b("", !0),
          e.run.state === "failed" ? (r(), d(P, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", j8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : b("", !0)
        ])
      ], 40, T8),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", F8, [
          m("div", W8, [
            m("div", H8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, z8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (k) => e.expanded && R(o).loadEarlier(k.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              K(v(e.run.line), 1),
              R(l).length ? (r(), d(P, { key: 0 }, [
                K(v(`
` + R(l).join(`
`)), 1)
              ], 64)) : b("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, O8));
  }
}, G8 = /* @__PURE__ */ U(U8, [["__scopeId", "data-v-18099d0b"]]), V8 = {
  class: "process-queue",
  "data-test-queue": ""
}, K8 = {
  key: 0,
  class: "lead"
}, Y8 = { class: "scroll" }, Q8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, J8 = ["data-queue-empty"], is = 20, X8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = S(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = C(null), s = C(""), o = C([]), l = C(is), i = S(() => {
      var y, k;
      return (((y = a.value) == null ? void 0 : y.recent_total) ?? 0) > (((k = a.value) == null ? void 0 : k.recent.length) ?? 0);
    });
    let u = 0;
    const c = S(() => a.value ? [
      { type: "running", heading: "Running", icon: "start", rows: a.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: a.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: a.value.recent, empty: "Nothing has run yet." }
    ].flatMap((k) => [
      { key: `band:${k.type}`, section: k },
      ...k.rows.length ? k.rows.map((_, x) => ({ key: `run:${_.id}`, run: _, position: x + 1 })) : [{ key: `none:${k.type}`, section: k, empty: !0 }]
    ]) : []);
    function f(y) {
      o.value = o.value.includes(y) ? o.value.filter((k) => k !== y) : [...o.value, y];
    }
    async function h() {
      const y = ++u, k = await t.read([...l.value === is ? ["queue", "list"] : ["queue", "list", "--recent", String(l.value)], ...n.value]);
      y === u && (s.value = k.ok ? "" : k.error, k.ok && (a.value = k.value));
    }
    function g() {
      l.value += is, h();
    }
    return Mn(["process.*", "setting.*"], h), Me(h), (y, k) => (r(), d("article", V8, [
      e.agent ? b("", !0) : (r(), d("p", K8, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      m("div", Y8, [
        s.value ? (r(), d("p", Q8, v(s.value), 1)) : b("", !0),
        a.value ? (r(), d(P, { key: 1 }, [
          e.agent ? b("", !0) : (r(), F(E8, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: h
          }, null, 8, ["queue", "read"])),
          O(js, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: D(() => [
              (r(!0), d(P, null, ne(c.value, (_) => (r(), d(P, {
                key: _.key
              }, [
                _.run ? (r(), F(G8, {
                  key: 0,
                  run: _.run,
                  environment: a.value.environment_name,
                  position: _.position,
                  read: e.read,
                  expanded: o.value.includes(_.run.id),
                  onToggle: (x) => f(_.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : _.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": _.section.type
                }, v(_.section.empty), 9, J8)) : (r(), F(Ht, {
                  key: 2,
                  class: "sticky-band",
                  icon: _.section.icon,
                  count: _.section.rows.length,
                  "data-queue-heading": _.section.type
                }, {
                  default: D(() => [
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
          }, "Show older commands")) : b("", !0)
        ], 64)) : s.value ? b("", !0) : (r(), F(Qe, { key: 2 }))
      ])
    ]));
  }
}, eA = /* @__PURE__ */ U(X8, [["__scopeId", "data-v-3f01ced0"]]), Z8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, e3 = ["aria-expanded"], t3 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, n3 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, a3 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, s3 = {
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
    }, { immediate: !0 }), Mn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(P, null, [
      a.value ? (r(), d("section", Z8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", t3, v(a.value), 1),
          O(Yt, { open: n.value }, null, 8, ["open"])
        ], 8, e3),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", n3, [
            O(id, {
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
          ])) : b("", !0)
        ], 2)
      ])) : b("", !0),
      o.value ? (r(), d("p", a3, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, o3 = /* @__PURE__ */ U(s3, [["__scopeId", "data-v-a4550728"]]), l3 = ["placeholder"], i3 = { class: "actions" }, r3 = { class: "error" }, u3 = {
  key: 1,
  class: "card closed"
}, c3 = { class: "mark" }, d3 = { class: "prompt" }, f3 = {
  key: 0,
  class: "draft"
}, h3 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ jt({
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
  emits: /* @__PURE__ */ jt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = rn(e, "draft"), l = rn(e, "error"), i = C(!!l.value), u = C(!1), c = C(!1), f = C(null);
    async function h() {
      var k, _;
      i.value = !0, u.value = !1, await Fe(), (_ = ((k = f.value) == null ? void 0 : k.querySelector("input")) || f.value) == null || _.focus();
    }
    function g() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const k = o.value.trim();
      if (!(!k || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(k), i.value = !1, u.value = !0;
        } catch (_) {
          o.value = k, l.value = _.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (k, _) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: Ct(g, ["esc"])
      }, [
        ue(k.$slots, "who", {}, void 0, !0),
        et(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": _[0] || (_[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: _[1] || (_[1] = Ct((x) => R(Xi)(x, y), ["enter"]))
        }, null, 40, l3), [
          [ea, o.value]
        ]),
        m("div", i3, [
          m("span", r3, v(l.value), 1),
          O(ge, {
            small: "",
            onClick: g
          }, {
            default: D(() => [..._[3] || (_[3] = [
              K("Cancel", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: D(() => [..._[4] || (_[4] = [
              K("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", u3, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", c3, [
            O(ie, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", d3, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", f3, "Draft kept")) : b("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: _[2] || (_[2] = (x) => s("show"))
        }, [
          m("span", null, v(R(ud)(e.count, "comment")), 1),
          O(ie, {
            name: "down",
            size: 12
          })
        ])) : b("", !0)
      ]))
    ], 2));
  }
}, m3 = /* @__PURE__ */ U(h3, [["__scopeId", "data-v-b68baddd"]]), p3 = { wide: 1130 }, g3 = /\{([A-Za-z_]\w*)\}/g;
function Zn(e, t, n = {}) {
  return e.replace(g3, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const v3 = (e, t, n, a) => Zn(e.label, n, { row_id: a, id: a }) || V2(t, n, a), y3 = { class: "comment-side-head" }, b3 = {
  key: 0,
  class: "comment-none"
}, k3 = { key: 0 }, w3 = {
  key: 1,
  class: "comment-none"
}, $3 = {
  class: "comment",
  "data-comment": ""
}, x3 = {
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
      m("header", y3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        O(va, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", b3, "No comments yet")) : b("", !0),
      (r(!0), d(P, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", k3, v(a.quote), 1)) : b("", !0),
        a.revision ? (r(), d("span", w3, "Revision " + v(a.revision), 1)) : b("", !0),
        m("p", $3, v(e.words(a)), 1)
      ]))), 128)),
      O(wn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Dl = /* @__PURE__ */ U(x3, [["__scopeId", "data-v-276284a3"]]), S3 = { class: "resource-heading" }, M3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, _3 = {
  key: 1,
  class: "resource-abstract"
}, C3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", S3, [
      e.title ? (r(), d("h2", M3, v(e.title), 1)) : b("", !0),
      e.abstract ? (r(), d("p", _3, v(e.abstract), 1)) : b("", !0)
    ]));
  }
}, A3 = /* @__PURE__ */ U(C3, [["__scopeId", "data-v-d65ef53f"]]), E3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, O3 = { class: "inspector-icons" }, T3 = { class: "inspector-icons-start" }, I3 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, B3 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, R3 = { class: "inspector-icons-end" }, L3 = ["href"], N3 = {
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
    return (u, c) => (r(), d("header", E3, [
      m("div", O3, [
        m("span", T3, [
          e.backed ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: D(() => [
              O(ie, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          e.stepped ? (r(), d(P, { key: 1 }, [
            O(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: D(() => [
                O(ie, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            O(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: D(() => [
                O(ie, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : b("", !0)
        ]),
        l.value ? (r(), d("h2", I3, v(e.title), 1)) : (r(), d("p", B3, v(e.label), 1)),
        m("span", R3, [
          e.embedded ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => R(je)(s.value))
          }, {
            default: D(() => [
              O(ie, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: R(fh)(s.value)
          }, [
            O(ie, {
              name: "share",
              size: 13
            })
          ], 8, L3)) : b("", !0),
          e.embedded ? b("", !0) : (r(), F(ge, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: D(() => [
              O(ie, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      O(A3, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, q3 = /* @__PURE__ */ U(N3, [["__scopeId", "data-v-f7878e15"]]), D3 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, P3 = { class: "field-name" }, j3 = {
  key: 1,
  class: "field-value"
}, F3 = ["onClick"], W3 = {
  key: 2,
  class: "field-value"
}, H3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", D3, [
      (r(!0), d(P, null, ne(e.fields, (o) => (r(), d(P, {
        key: o.name
      }, [
        m("p", P3, v(o.label), 1),
        o.isTime ? (r(), F(tt, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", j3, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, F3)
        ])) : (r(), d("p", W3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, z3 = /* @__PURE__ */ U(H3, [["__scopeId", "data-v-7e45afb5"]]);
async function U3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: K2(s.value.actor, s.value.creator_agent), owner: a.length ? Y2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const G3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, V3 = {
  key: 1,
  class: "inspector-wait"
}, K3 = { class: "inspector-main" }, Y3 = { class: "inspector-column" }, Q3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, J3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, X3 = { class: "inspector-text" }, Z3 = ["innerHTML"], eS = {
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
    let k = 0;
    const _ = S(() => ({ row_id: n.id, id: n.id })), x = S(() => i.value ? Zn(l.value.title, i.value, _.value) || G2(n.term, i.value, n.id) : ""), M = S(() => i.value ? v3(l.value, n.term, i.value, n.id) : ""), T = S(() => M.value === x.value ? "" : M.value), H = S(() => i.value ? Zn(l.value.description, i.value, _.value) : ""), W = S(() => {
      var j, V, J;
      return ((j = i.value) == null ? void 0 : j.body) || ((V = i.value) == null ? void 0 : V.brief) || (o.has(n.term) ? (J = i.value) == null ? void 0 : J.text : "") || "";
    }), I = S(() => W.value ? ao(W.value, { env: "", rowNames: !1 }) : ""), z = S(() => Q2(i.value, W.value, u.value, c.value)), N = S(() => l.value.comments && y.value >= p3.wide), E = S(() => l.value.comments && !N.value), L = (j) => l.value.components.filter((V) => (V.tab || "") === j).map((V) => V.window), q = S(() => [...new Set(l.value.components.map((j) => j.tab).filter(Boolean))]), w = S(() => q.value.length || E.value ? [{ key: "details", label: "Details" }, ...q.value.map((j) => ({ key: j, label: j })), ...E.value ? [{ key: "comments", label: "Comments" }] : []] : []), p = S(() => {
      const j = l.value.links;
      return j ? { categories: j.categories, open: j.open, outsidePlan: j.excludes_plan, pageSize: j.page_size } : null;
    }), $ = ar(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (j) => n.read(j));
    async function A() {
      const j = ++k, V = await n.read(Zn(l.value.reads, null, _.value).split(/\s+/).filter(Boolean));
      if (j !== k || (f.value = V.ok ? "" : V.error, !V.ok)) return;
      i.value = V.value;
      const J = await U3(n.read, i.value);
      j === k && (u.value = J.creator, c.value = J.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", h.value = "details", A();
    }, { immediate: !0 }), Mn(l.value.events, A), pe($.open, (j) => j && E.value && (h.value = "comments"));
    let B = null;
    return Me(() => {
      var j;
      y.value = ((j = g.value) == null ? void 0 : j.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (B = new ResizeObserver(() => y.value = g.value.clientWidth), B.observe(g.value));
    }), Re(() => B == null ? void 0 : B.disconnect()), (j, V) => (r(), d("aside", {
      ref_key: "root",
      ref: g,
      class: "inspector",
      "data-inspector": ""
    }, [
      O(q3, {
        label: T.value,
        title: x.value,
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
      f.value ? (r(), d("p", G3, v(f.value), 1)) : i.value ? (r(), d(P, { key: 2 }, [
        O(Cs, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: D(() => [
            O(eo, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: A
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        m("div", K3, [
          m("div", Y3, [
            w.value.length ? (r(), d("div", Q3, [
              O(Ft, {
                options: w.value,
                value: h.value,
                onPick: V[3] || (V[3] = (J) => h.value = J)
              }, null, 8, ["options", "value"])
            ])) : b("", !0),
            m("div", J3, [
              O(Vt, { value: h.value }, {
                details: D(() => [
                  m("div", X3, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, Z3)) : b("", !0),
                    l.value.lists_fields ? (r(), F(z3, {
                      key: 1,
                      fields: z.value,
                      onPeek: V[4] || (V[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : b("", !0)
                  ]),
                  O(Ms, {
                    "slot-name": `inspector.${e.term}`,
                    names: L(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: D(() => [
                  O(Dl, {
                    below: "",
                    comments: R($).comments.value,
                    words: R($).words,
                    more: !!R($).nextPage.value,
                    loading: R($).loading.value,
                    failure: R($).failure.value,
                    onMore: R($).loadMore,
                    onClose: V[5] || (V[5] = (J) => h.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: D(() => [
                  O(Ms, {
                    names: L(h.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              p.value ? (r(), F(o3, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, p.value, {
                onOpen: V[6] || (V[6] = (J) => a("open", J))
              }), null, 16, ["model", "id", "read"])) : b("", !0)
            ]),
            l.value.comments ? (r(), F(m3, {
              key: 1,
              send: R($).send,
              count: R($).total.value,
              onShow: V[7] || (V[7] = (J) => E.value && (h.value = "comments"))
            }, null, 8, ["send", "count"])) : b("", !0)
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
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : b("", !0)
        ])
      ], 64)) : (r(), d("div", V3, [
        O(Qe)
      ]))
    ], 512));
  }
}, tS = /* @__PURE__ */ U(eS, [["__scopeId", "data-v-60363e95"]]), tA = {
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
    const t = Se(Ys);
    return (n, a) => (r(), F(tS, De(n.$props, {
      catalogue: R(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, nS = { class: "facts" }, aS = { class: "fact wide" }, sS = ["title"], oS = {
  key: 1,
  class: "fact-value"
}, lS = {
  key: 0,
  class: "fact"
}, iS = { class: "fact-value" }, rS = { class: "fact" }, uS = { class: "fact-label" }, cS = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, dS = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, fS = {
  key: 2,
  class: "fact"
}, hS = { class: "fact-value" }, mS = { class: "fact wide" }, pS = { class: "fact-label" }, gS = { class: "fact wide" }, vS = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, yS = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = la.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", nS, [
        m("div", aS, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => R(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, sS)) : (r(), d("span", oS, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", lS, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", iS, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : b("", !0),
        e.task.helper_id ? (r(), d(P, { key: 1 }, [
          m("div", rS, [
            m("span", uS, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            O(fn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: R(lo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => R(je)(`agents:${e.task.helper_id}`))
            }, {
              default: D(() => [
                O(Dt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          R(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", cS, [
            O(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = K(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", dS, [
            O(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = K(" takes it after the task it is on.", -1))
          ])) : b("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", fS, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", hS, "Agent " + v(e.task.holder_id), 1)
        ])) : b("", !0),
        m("div", mS, [
          m("span", pS, [
            i[9] || (i[9] = K(" Complexity ", -1)),
            O(yi, {
              lines: R(cr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          O(Ft, {
            options: R(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", gS, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          O(Ft, {
            options: R(n),
            value: String(R(ur)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", vS, v(e.refusal), 1)) : b("", !0)
        ])
      ]);
    };
  }
}, bS = /* @__PURE__ */ U(yS, [["__scopeId", "data-v-4bf27961"]]);
function kS(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const wS = { class: "number" }, $S = { class: "title" }, xS = { class: "word" }, SS = {
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
      default: D(() => [
        O(ka, { status: e.status }, null, 8, ["status"]),
        m("span", wS, v(e.number), 1),
        m("span", $S, v(e.title), 1),
        m("span", xS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, rs = /* @__PURE__ */ U(SS, [["__scopeId", "data-v-f6417ae8"]]), MS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, _S = { class: "level" }, CS = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = S(() => kS(n.task.id, n.graph)), l = S(() => s.value ? o.value.above : o.value.above.slice(-1)), i = S(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = S(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, g = !1) => ({ status: hn(h.state), number: h.id, title: h.title, word: g ? "This task" : c(h.state), current: g });
    return (h, g) => o.value.above.length || o.value.below.length ? (r(), d("section", MS, [
      g[5] || (g[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(P, null, ne(l.value, (y) => (r(), d(P, {
        key: y.map((k) => k.id).join()
      }, [
        m("div", _S, [
          (r(!0), d(P, null, ne(y, (k) => (r(), F(rs, De({
            key: k.id,
            ref_for: !0
          }, f(k), {
            onSelect: g[0] || (g[0] = (_) => a("select", _))
          }), null, 16))), 128))
        ]),
        g[3] || (g[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      O(rs, cs(Ul(f(e.task, !0))), null, 16),
      (r(!0), d(P, null, ne(i.value, (y) => (r(), d(P, {
        key: y.id
      }, [
        g[4] || (g[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        O(rs, De({ ref_for: !0 }, f(y), {
          onSelect: g[1] || (g[1] = (k) => a("select", k))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: g[2] || (g[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : b("", !0)
    ])) : b("", !0);
  }
}, AS = /* @__PURE__ */ U(CS, [["__scopeId", "data-v-79c52417"]]), ES = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, OS = ["datetime"], TS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", ES, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(P, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, OS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : b("", !0);
  }
}, IS = /* @__PURE__ */ U(TS, [["__scopeId", "data-v-b41f213b"]]), BS = {
  class: "part",
  "data-resource-waits": ""
}, RS = ["onClick"], LS = { class: "wait-id" }, NS = { class: "wait-title" }, qS = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", BS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(P, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        O(ka, {
          status: R(hn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", LS, v(o.id), 1),
        m("span", NS, v(o.title), 1)
      ], 8, RS))), 128))
    ]));
  }
}, Pl = /* @__PURE__ */ U(qS, [["__scopeId", "data-v-8fb2e251"]]), DS = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, PS = { class: "text" }, jS = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, FS = 180, WS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = C(!1), l = S(() => a.task.waits.filter((u) => !n.has(u.state))), i = S(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(P, null, [
      l.value.length ? (r(), F(Pl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", DS, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", PS, v(e.task.outcome), 1)
      ])) : b("", !0),
      e.task.brief ? (r(), d("section", jS, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > FS && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : b("", !0)
      ])) : b("", !0),
      i.value.length ? (r(), F(Pl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0)
    ], 64));
  }
}, HS = /* @__PURE__ */ U(WS, [["__scopeId", "data-v-4a3f1e79"]]), zS = {
  class: "task-details",
  "data-task-details": ""
}, US = { class: "since" }, GS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, VS = { class: "text" }, KS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, YS = {
  key: 1,
  class: "note"
}, QS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, JS = { class: "text" }, XS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", zS, [
        m("div", {
          class: Y(["state-line", R(hn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            O(ka, {
              status: R(hn)(e.task.state)
            }, null, 8, ["status"]),
            K(" " + v(a(e.task.state)), 1)
          ]),
          m("span", US, [
            o[5] || (o[5] = K(" since ", -1)),
            O(tt, {
              at: R(Hh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", GS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", VS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", KS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", YS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", QS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", JS, v(e.task.reason), 1)
        ])) : b("", !0),
        e.graph ? (r(), F(AS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : b("", !0),
        O(bS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        O(HS, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        O(IS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, nA = /* @__PURE__ */ U(XS, [["__scopeId", "data-v-7e73fa21"]]), ZS = 50, e6 = { messages: 25 }, t6 = (e) => e6[e] || ZS, n6 = {
  class: "task-log",
  "aria-label": "Task log"
}, a6 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, s6 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, o6 = { class: "entries" }, l6 = ["data-task-log-important"], i6 = ["datetime"], r6 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, u6 = {
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
        String(t6("task_logs")),
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
    ), nt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", n6, [
      o.value ? (r(), F(Qe, { key: 0 })) : l.value ? (r(), d(P, { key: 1 }, [
        m("p", a6, v(l.value), 1),
        O(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: D(() => [...f[3] || (f[3] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(P, { key: 2 }, [
        n.value.length ? b("", !0) : (r(), d("p", s6, "No log entries yet.")),
        m("ol", o6, [
          (r(!0), d(P, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, i6),
            m("p", null, v(h.line), 1)
          ], 10, l6))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", r6, [
          O(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: D(() => [...f[4] || (f[4] = [
              K("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          O(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: D(() => [...f[5] || (f[5] = [
              K("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : b("", !0)
      ], 64))
    ]));
  }
}, aA = /* @__PURE__ */ U(u6, [["__scopeId", "data-v-cfa43bf1"]]);
function c6(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var us = { exports: {} }, jl;
function d6() {
  return jl || (jl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, z) {
        var N = 236, E = 17, L = I, q = o[z], w = null, p = 0, $ = null, A = [], B = {}, j = function(Q, X) {
          p = L * 4 + 17, w = (function(G) {
            for (var Z = new Array(G), ee = 0; ee < G; ee += 1) {
              Z[ee] = new Array(G);
              for (var se = 0; se < G; se += 1)
                Z[ee][se] = null;
            }
            return Z;
          })(p), V(0, 0), V(p - 7, 0), V(0, p - 7), ce(), oe(), Ie(Q, X), L >= 7 && be(Q), $ == null && ($ = ae(L, q, A)), le($, X);
        }, V = function(Q, X) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Q + G <= -1 || p <= Q + G))
              for (var Z = -1; Z <= 7; Z += 1)
                X + Z <= -1 || p <= X + Z || (0 <= G && G <= 6 && (Z == 0 || Z == 6) || 0 <= Z && Z <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= Z && Z <= 4 ? w[Q + G][X + Z] = !0 : w[Q + G][X + Z] = !1);
        }, J = function() {
          for (var Q = 0, X = 0, G = 0; G < 8; G += 1) {
            j(!0, G);
            var Z = i.getLostPoint(B);
            (G == 0 || Q > Z) && (Q = Z, X = G);
          }
          return X;
        }, oe = function() {
          for (var Q = 8; Q < p - 8; Q += 1)
            w[Q][6] == null && (w[Q][6] = Q % 2 == 0);
          for (var X = 8; X < p - 8; X += 1)
            w[6][X] == null && (w[6][X] = X % 2 == 0);
        }, ce = function() {
          for (var Q = i.getPatternPosition(L), X = 0; X < Q.length; X += 1)
            for (var G = 0; G < Q.length; G += 1) {
              var Z = Q[X], ee = Q[G];
              if (w[Z][ee] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var fe = -2; fe <= 2; fe += 1)
                    se == -2 || se == 2 || fe == -2 || fe == 2 || se == 0 && fe == 0 ? w[Z + se][ee + fe] = !0 : w[Z + se][ee + fe] = !1;
            }
        }, be = function(Q) {
          for (var X = i.getBCHTypeNumber(L), G = 0; G < 18; G += 1) {
            var Z = !Q && (X >> G & 1) == 1;
            w[Math.floor(G / 3)][G % 3 + p - 8 - 3] = Z;
          }
          for (var G = 0; G < 18; G += 1) {
            var Z = !Q && (X >> G & 1) == 1;
            w[G % 3 + p - 8 - 3][Math.floor(G / 3)] = Z;
          }
        }, Ie = function(Q, X) {
          for (var G = q << 3 | X, Z = i.getBCHTypeInfo(G), ee = 0; ee < 15; ee += 1) {
            var se = !Q && (Z >> ee & 1) == 1;
            ee < 6 ? w[ee][8] = se : ee < 8 ? w[ee + 1][8] = se : w[p - 15 + ee][8] = se;
          }
          for (var ee = 0; ee < 15; ee += 1) {
            var se = !Q && (Z >> ee & 1) == 1;
            ee < 8 ? w[8][p - ee - 1] = se : ee < 9 ? w[8][15 - ee - 1 + 1] = se : w[8][15 - ee - 1] = se;
          }
          w[p - 8][8] = !Q;
        }, le = function(Q, X) {
          for (var G = -1, Z = p - 1, ee = 7, se = 0, fe = i.getMaskFunction(X), de = p - 1; de > 0; de -= 2)
            for (de == 6 && (de -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if (w[Z][de - xe] == null) {
                  var Ae = !1;
                  se < Q.length && (Ae = (Q[se] >>> ee & 1) == 1);
                  var me = fe(Z, de - xe);
                  me && (Ae = !Ae), w[Z][de - xe] = Ae, ee -= 1, ee == -1 && (se += 1, ee = 7);
                }
              if (Z += G, Z < 0 || p <= Z) {
                Z -= G, G = -G;
                break;
              }
            }
        }, te = function(Q, X) {
          for (var G = 0, Z = 0, ee = 0, se = new Array(X.length), fe = new Array(X.length), de = 0; de < X.length; de += 1) {
            var xe = X[de].dataCount, Ae = X[de].totalCount - xe;
            Z = Math.max(Z, xe), ee = Math.max(ee, Ae), se[de] = new Array(xe);
            for (var me = 0; me < se[de].length; me += 1)
              se[de][me] = 255 & Q.getBuffer()[me + G];
            G += xe;
            var We = i.getErrorCorrectPolynomial(Ae), He = c(se[de], We.getLength() - 1), Mo = He.mod(We);
            fe[de] = new Array(We.getLength() - 1);
            for (var me = 0; me < fe[de].length; me += 1) {
              var _o = me + Mo.getLength() - fe[de].length;
              fe[de][me] = _o >= 0 ? Mo.getAt(_o) : 0;
            }
          }
          for (var Co = 0, me = 0; me < X.length; me += 1)
            Co += X[me].totalCount;
          for (var _a = new Array(Co), Tn = 0, me = 0; me < Z; me += 1)
            for (var de = 0; de < X.length; de += 1)
              me < se[de].length && (_a[Tn] = se[de][me], Tn += 1);
          for (var me = 0; me < ee; me += 1)
            for (var de = 0; de < X.length; de += 1)
              me < fe[de].length && (_a[Tn] = fe[de][me], Tn += 1);
          return _a;
        }, ae = function(Q, X, G) {
          for (var Z = f.getRSBlocks(Q, X), ee = h(), se = 0; se < G.length; se += 1) {
            var fe = G[se];
            ee.put(fe.getMode(), 4), ee.put(fe.getLength(), i.getLengthInBits(fe.getMode(), Q)), fe.write(ee);
          }
          for (var de = 0, se = 0; se < Z.length; se += 1)
            de += Z[se].dataCount;
          if (ee.getLengthInBits() > de * 8)
            throw "code length overflow. (" + ee.getLengthInBits() + ">" + de * 8 + ")";
          for (ee.getLengthInBits() + 4 <= de * 8 && ee.put(0, 4); ee.getLengthInBits() % 8 != 0; )
            ee.putBit(!1);
          for (; !(ee.getLengthInBits() >= de * 8 || (ee.put(N, 8), ee.getLengthInBits() >= de * 8)); )
            ee.put(E, 8);
          return te(ee, Z);
        };
        B.addData = function(Q, X) {
          X = X || "Byte";
          var G = null;
          switch (X) {
            case "Numeric":
              G = g(Q);
              break;
            case "Alphanumeric":
              G = y(Q);
              break;
            case "Byte":
              G = k(Q);
              break;
            case "Kanji":
              G = _(Q);
              break;
            default:
              throw "mode:" + X;
          }
          A.push(G), $ = null;
        }, B.isDark = function(Q, X) {
          if (Q < 0 || p <= Q || X < 0 || p <= X)
            throw Q + "," + X;
          return w[Q][X];
        }, B.getModuleCount = function() {
          return p;
        }, B.make = function() {
          if (L < 1) {
            for (var Q = 1; Q < 40; Q++) {
              for (var X = f.getRSBlocks(Q, q), G = h(), Z = 0; Z < A.length; Z++) {
                var ee = A[Z];
                G.put(ee.getMode(), 4), G.put(ee.getLength(), i.getLengthInBits(ee.getMode(), Q)), ee.write(G);
              }
              for (var se = 0, Z = 0; Z < X.length; Z++)
                se += X[Z].dataCount;
              if (G.getLengthInBits() <= se * 8)
                break;
            }
            L = Q;
          }
          j(!1, J());
        }, B.createTableTag = function(Q, X) {
          Q = Q || 2, X = typeof X > "u" ? Q * 4 : X;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + X + "px;", G += '">', G += "<tbody>";
          for (var Z = 0; Z < B.getModuleCount(); Z += 1) {
            G += "<tr>";
            for (var ee = 0; ee < B.getModuleCount(); ee += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + Q + "px;", G += " height: " + Q + "px;", G += " background-color: ", G += B.isDark(Z, ee) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, B.createSvgTag = function(Q, X, G, Z) {
          var ee = {};
          typeof arguments[0] == "object" && (ee = arguments[0], Q = ee.cellSize, X = ee.margin, G = ee.alt, Z = ee.title), Q = Q || 2, X = typeof X > "u" ? Q * 4 : X, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, Z = typeof Z == "string" ? { text: Z } : Z || {}, Z.text = Z.text || null, Z.id = Z.text ? Z.id || "qrcode-title" : null;
          var se = B.getModuleCount() * Q + X * 2, fe, de, xe, Ae, me = "", We;
          for (We = "l" + Q + ",0 0," + Q + " -" + Q + ",0 0,-" + Q + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += ee.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', me += ' viewBox="0 0 ' + se + " " + se + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += Z.text || G.text ? ' role="img" aria-labelledby="' + Oe([Z.id, G.id].join(" ").trim()) + '"' : "", me += ">", me += Z.text ? '<title id="' + Oe(Z.id) + '">' + Oe(Z.text) + "</title>" : "", me += G.text ? '<description id="' + Oe(G.id) + '">' + Oe(G.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', xe = 0; xe < B.getModuleCount(); xe += 1)
            for (Ae = xe * Q + X, fe = 0; fe < B.getModuleCount(); fe += 1)
              B.isDark(xe, fe) && (de = fe * Q + X, me += "M" + de + "," + Ae + We);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, B.createDataURL = function(Q, X) {
          Q = Q || 2, X = typeof X > "u" ? Q * 4 : X;
          var G = B.getModuleCount() * Q + X * 2, Z = X, ee = G - X;
          return W(G, G, function(se, fe) {
            if (Z <= se && se < ee && Z <= fe && fe < ee) {
              var de = Math.floor((se - Z) / Q), xe = Math.floor((fe - Z) / Q);
              return B.isDark(xe, de) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(Q, X, G) {
          Q = Q || 2, X = typeof X > "u" ? Q * 4 : X;
          var Z = B.getModuleCount() * Q + X * 2, ee = "";
          return ee += "<img", ee += ' src="', ee += B.createDataURL(Q, X), ee += '"', ee += ' width="', ee += Z, ee += '"', ee += ' height="', ee += Z, ee += '"', G && (ee += ' alt="', ee += Oe(G), ee += '"'), ee += "/>", ee;
        };
        var Oe = function(Q) {
          for (var X = "", G = 0; G < Q.length; G += 1) {
            var Z = Q.charAt(G);
            switch (Z) {
              case "<":
                X += "&lt;";
                break;
              case ">":
                X += "&gt;";
                break;
              case "&":
                X += "&amp;";
                break;
              case '"':
                X += "&quot;";
                break;
              default:
                X += Z;
                break;
            }
          }
          return X;
        }, au = function(Q) {
          var X = 1;
          Q = typeof Q > "u" ? X * 2 : Q;
          var G = B.getModuleCount() * X + Q * 2, Z = Q, ee = G - Q, se, fe, de, xe, Ae, me = {
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
          for (se = 0; se < G; se += 2) {
            for (de = Math.floor((se - Z) / X), xe = Math.floor((se + 1 - Z) / X), fe = 0; fe < G; fe += 1)
              Ae = "█", Z <= fe && fe < ee && Z <= se && se < ee && B.isDark(de, Math.floor((fe - Z) / X)) && (Ae = " "), Z <= fe && fe < ee && Z <= se + 1 && se + 1 < ee && B.isDark(xe, Math.floor((fe - Z) / X)) ? Ae += " " : Ae += "█", He += Q < 1 && se + 1 >= ee ? We[Ae] : me[Ae];
            He += `
`;
          }
          return G % 2 && Q > 0 ? He.substring(0, He.length - G - 1) + Array(G + 1).join("▀") : He.substring(0, He.length - 1);
        };
        return B.createASCII = function(Q, X) {
          if (Q = Q || 1, Q < 2)
            return au(X);
          Q -= 1, X = typeof X > "u" ? Q * 2 : X;
          var G = B.getModuleCount() * Q + X * 2, Z = X, ee = G - X, se, fe, de, xe, Ae = Array(Q + 1).join("██"), me = Array(Q + 1).join("  "), We = "", He = "";
          for (se = 0; se < G; se += 1) {
            for (de = Math.floor((se - Z) / Q), He = "", fe = 0; fe < G; fe += 1)
              xe = 1, Z <= fe && fe < ee && Z <= se && se < ee && B.isDark(de, Math.floor((fe - Z) / Q)) && (xe = 0), He += xe ? Ae : me;
            for (de = 0; de < Q; de += 1)
              We += He + `
`;
          }
          return We.substring(0, We.length - 1);
        }, B.renderTo2dContext = function(Q, X) {
          X = X || 2;
          for (var G = B.getModuleCount(), Z = 0; Z < G; Z++)
            for (var ee = 0; ee < G; ee++)
              Q.fillStyle = B.isDark(Z, ee) ? "black" : "white", Q.fillRect(Z * X, ee * X, X, X);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var z = [], N = 0; N < I.length; N += 1) {
            var E = I.charCodeAt(N);
            z.push(E & 255);
          }
          return z;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, z) {
        var N = (function() {
          for (var L = T(I), q = function() {
            var oe = L.read();
            if (oe == -1) throw "eof";
            return oe;
          }, w = 0, p = {}; ; ) {
            var $ = L.read();
            if ($ == -1) break;
            var A = q(), B = q(), j = q(), V = String.fromCharCode($ << 8 | A), J = B << 8 | j;
            p[V] = J, w += 1;
          }
          if (w != z)
            throw w + " != " + z;
          return p;
        })(), E = 63;
        return function(L) {
          for (var q = [], w = 0; w < L.length; w += 1) {
            var p = L.charCodeAt(w);
            if (p < 128)
              q.push(p);
            else {
              var $ = N[L.charAt(w)];
              typeof $ == "number" ? ($ & 255) == $ ? q.push($) : (q.push($ >>> 8), q.push($ & 255)) : q.push(E);
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
        ], z = 1335, N = 7973, E = 21522, L = {}, q = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return L.getBCHTypeInfo = function(w) {
          for (var p = w << 10; q(p) - q(z) >= 0; )
            p ^= z << q(p) - q(z);
          return (w << 10 | p) ^ E;
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
          for (var p = w.getModuleCount(), $ = 0, A = 0; A < p; A += 1)
            for (var B = 0; B < p; B += 1) {
              for (var j = 0, V = w.isDark(A, B), J = -1; J <= 1; J += 1)
                if (!(A + J < 0 || p <= A + J))
                  for (var oe = -1; oe <= 1; oe += 1)
                    B + oe < 0 || p <= B + oe || J == 0 && oe == 0 || V == w.isDark(A + J, B + oe) && (j += 1);
              j > 5 && ($ += 3 + j - 5);
            }
          for (var A = 0; A < p - 1; A += 1)
            for (var B = 0; B < p - 1; B += 1) {
              var ce = 0;
              w.isDark(A, B) && (ce += 1), w.isDark(A + 1, B) && (ce += 1), w.isDark(A, B + 1) && (ce += 1), w.isDark(A + 1, B + 1) && (ce += 1), (ce == 0 || ce == 4) && ($ += 3);
            }
          for (var A = 0; A < p; A += 1)
            for (var B = 0; B < p - 6; B += 1)
              w.isDark(A, B) && !w.isDark(A, B + 1) && w.isDark(A, B + 2) && w.isDark(A, B + 3) && w.isDark(A, B + 4) && !w.isDark(A, B + 5) && w.isDark(A, B + 6) && ($ += 40);
          for (var B = 0; B < p; B += 1)
            for (var A = 0; A < p - 6; A += 1)
              w.isDark(A, B) && !w.isDark(A + 1, B) && w.isDark(A + 2, B) && w.isDark(A + 3, B) && w.isDark(A + 4, B) && !w.isDark(A + 5, B) && w.isDark(A + 6, B) && ($ += 40);
          for (var be = 0, B = 0; B < p; B += 1)
            for (var A = 0; A < p; A += 1)
              w.isDark(A, B) && (be += 1);
          var Ie = Math.abs(100 * be / p / p - 50) / 5;
          return $ += Ie * 10, $;
        }, L;
      })(), u = (function() {
        for (var I = new Array(256), z = new Array(256), N = 0; N < 8; N += 1)
          I[N] = 1 << N;
        for (var N = 8; N < 256; N += 1)
          I[N] = I[N - 4] ^ I[N - 5] ^ I[N - 6] ^ I[N - 8];
        for (var N = 0; N < 255; N += 1)
          z[I[N]] = N;
        var E = {};
        return E.glog = function(L) {
          if (L < 1)
            throw "glog(" + L + ")";
          return z[L];
        }, E.gexp = function(L) {
          for (; L < 0; )
            L += 255;
          for (; L >= 256; )
            L -= 255;
          return I[L];
        }, E;
      })();
      function c(I, z) {
        if (typeof I.length > "u")
          throw I.length + "/" + z;
        var N = (function() {
          for (var L = 0; L < I.length && I[L] == 0; )
            L += 1;
          for (var q = new Array(I.length - L + z), w = 0; w < I.length - L; w += 1)
            q[w] = I[w + L];
          return q;
        })(), E = {};
        return E.getAt = function(L) {
          return N[L];
        }, E.getLength = function() {
          return N.length;
        }, E.multiply = function(L) {
          for (var q = new Array(E.getLength() + L.getLength() - 1), w = 0; w < E.getLength(); w += 1)
            for (var p = 0; p < L.getLength(); p += 1)
              q[w + p] ^= u.gexp(u.glog(E.getAt(w)) + u.glog(L.getAt(p)));
          return c(q, 0);
        }, E.mod = function(L) {
          if (E.getLength() - L.getLength() < 0)
            return E;
          for (var q = u.glog(E.getAt(0)) - u.glog(L.getAt(0)), w = new Array(E.getLength()), p = 0; p < E.getLength(); p += 1)
            w[p] = E.getAt(p);
          for (var p = 0; p < L.getLength(); p += 1)
            w[p] ^= u.gexp(u.glog(L.getAt(p)) + q);
          return c(w, 0).mod(L);
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
        ], z = function(L, q) {
          var w = {};
          return w.totalCount = L, w.dataCount = q, w;
        }, N = {}, E = function(L, q) {
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
          var w = E(L, q);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + L + "/errorCorrectionLevel:" + q;
          for (var p = w.length / 3, $ = [], A = 0; A < p; A += 1)
            for (var B = w[A * 3 + 0], j = w[A * 3 + 1], V = w[A * 3 + 2], J = 0; J < B; J += 1)
              $.push(z(j, V));
          return $;
        }, N;
      })(), h = function() {
        var I = [], z = 0, N = {};
        return N.getBuffer = function() {
          return I;
        }, N.getAt = function(E) {
          var L = Math.floor(E / 8);
          return (I[L] >>> 7 - E % 8 & 1) == 1;
        }, N.put = function(E, L) {
          for (var q = 0; q < L; q += 1)
            N.putBit((E >>> L - q - 1 & 1) == 1);
        }, N.getLengthInBits = function() {
          return z;
        }, N.putBit = function(E) {
          var L = Math.floor(z / 8);
          I.length <= L && I.push(0), E && (I[L] |= 128 >>> z % 8), z += 1;
        }, N;
      }, g = function(I) {
        var z = s.MODE_NUMBER, N = I, E = {};
        E.getMode = function() {
          return z;
        }, E.getLength = function(w) {
          return N.length;
        }, E.write = function(w) {
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
        return E;
      }, y = function(I) {
        var z = s.MODE_ALPHA_NUM, N = I, E = {};
        E.getMode = function() {
          return z;
        }, E.getLength = function(q) {
          return N.length;
        }, E.write = function(q) {
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
        return E;
      }, k = function(I) {
        var z = s.MODE_8BIT_BYTE, N = a.stringToBytes(I), E = {};
        return E.getMode = function() {
          return z;
        }, E.getLength = function(L) {
          return N.length;
        }, E.write = function(L) {
          for (var q = 0; q < N.length; q += 1)
            L.put(N[q], 8);
        }, E;
      }, _ = function(I) {
        var z = s.MODE_KANJI, N = a.stringToBytesFuncs.SJIS;
        if (!N)
          throw "sjis not supported.";
        (function(q, w) {
          var p = N(q);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var E = N(I), L = {};
        return L.getMode = function() {
          return z;
        }, L.getLength = function(q) {
          return ~~(E.length / 2);
        }, L.write = function(q) {
          for (var w = E, p = 0; p + 1 < w.length; ) {
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
      }, x = function() {
        var I = [], z = {};
        return z.writeByte = function(N) {
          I.push(N & 255);
        }, z.writeShort = function(N) {
          z.writeByte(N), z.writeByte(N >>> 8);
        }, z.writeBytes = function(N, E, L) {
          E = E || 0, L = L || N.length;
          for (var q = 0; q < L; q += 1)
            z.writeByte(N[q + E]);
        }, z.writeString = function(N) {
          for (var E = 0; E < N.length; E += 1)
            z.writeByte(N.charCodeAt(E));
        }, z.toByteArray = function() {
          return I;
        }, z.toString = function() {
          var N = "";
          N += "[";
          for (var E = 0; E < I.length; E += 1)
            E > 0 && (N += ","), N += I[E];
          return N += "]", N;
        }, z;
      }, M = function() {
        var I = 0, z = 0, N = 0, E = "", L = {}, q = function(p) {
          E += String.fromCharCode(w(p & 63));
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
          for (I = I << 8 | p & 255, z += 8, N += 1; z >= 6; )
            q(I >>> z - 6), z -= 6;
        }, L.flush = function() {
          if (z > 0 && (q(I << 6 - z), I = 0, z = 0), N % 3 != 0)
            for (var p = 3 - N % 3, $ = 0; $ < p; $ += 1)
              E += "=";
        }, L.toString = function() {
          return E;
        }, L;
      }, T = function(I) {
        var z = I, N = 0, E = 0, L = 0, q = {};
        q.read = function() {
          for (; L < 8; ) {
            if (N >= z.length) {
              if (L == 0)
                return -1;
              throw "unexpected end of file./" + L;
            }
            var p = z.charAt(N);
            if (N += 1, p == "=")
              return L = 0, -1;
            if (p.match(/^\s$/))
              continue;
            E = E << 6 | w(p.charCodeAt(0)), L += 6;
          }
          var $ = E >>> L - 8 & 255;
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
      }, H = function(I, z) {
        var N = I, E = z, L = new Array(I * z), q = {};
        q.setPixel = function(A, B, j) {
          L[B * N + A] = j;
        }, q.write = function(A) {
          A.writeString("GIF87a"), A.writeShort(N), A.writeShort(E), A.writeByte(128), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(255), A.writeByte(255), A.writeByte(255), A.writeString(","), A.writeShort(0), A.writeShort(0), A.writeShort(N), A.writeShort(E), A.writeByte(0);
          var B = 2, j = p(B);
          A.writeByte(B);
          for (var V = 0; j.length - V > 255; )
            A.writeByte(255), A.writeBytes(j, V, 255), V += 255;
          A.writeByte(j.length - V), A.writeBytes(j, V, j.length - V), A.writeByte(0), A.writeString(";");
        };
        var w = function(A) {
          var B = A, j = 0, V = 0, J = {};
          return J.write = function(oe, ce) {
            if (oe >>> ce)
              throw "length over";
            for (; j + ce >= 8; )
              B.writeByte(255 & (oe << j | V)), ce -= 8 - j, oe >>>= 8 - j, V = 0, j = 0;
            V = oe << j | V, j = j + ce;
          }, J.flush = function() {
            j > 0 && B.writeByte(V);
          }, J;
        }, p = function(A) {
          for (var B = 1 << A, j = (1 << A) + 1, V = A + 1, J = $(), oe = 0; oe < B; oe += 1)
            J.add(String.fromCharCode(oe));
          J.add(String.fromCharCode(B)), J.add(String.fromCharCode(j));
          var ce = x(), be = w(ce);
          be.write(B, V);
          var Ie = 0, le = String.fromCharCode(L[Ie]);
          for (Ie += 1; Ie < L.length; ) {
            var te = String.fromCharCode(L[Ie]);
            Ie += 1, J.contains(le + te) ? le = le + te : (be.write(J.indexOf(le), V), J.size() < 4095 && (J.size() == 1 << V && (V += 1), J.add(le + te)), le = te);
          }
          return be.write(J.indexOf(le), V), be.write(j, V), be.flush(), ce.toByteArray();
        }, $ = function() {
          var A = {}, B = 0, j = {};
          return j.add = function(V) {
            if (j.contains(V))
              throw "dup key:" + V;
            A[V] = B, B += 1;
          }, j.size = function() {
            return B;
          }, j.indexOf = function(V) {
            return A[V];
          }, j.contains = function(V) {
            return typeof A[V] < "u";
          }, j;
        };
        return q;
      }, W = function(I, z, N) {
        for (var E = H(I, z), L = 0; L < z; L += 1)
          for (var q = 0; q < I; q += 1)
            E.setPixel(q, L, N(q, L));
        var w = x();
        E.write(w);
        for (var p = M(), $ = w.toByteArray(), A = 0; A < $.length; A += 1)
          p.writeByte($[A]);
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
  })(us)), us.exports;
}
var f6 = d6();
const h6 = /* @__PURE__ */ c6(f6), m6 = ["width", "height", "viewBox"], p6 = ["width", "height"], g6 = ["d"], v6 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = S(() => {
      const a = h6(0, "M");
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
      }, null, 8, p6),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, g6)
    ], 8, m6));
  }
}, sA = /* @__PURE__ */ U(v6, [["__scopeId", "data-v-489f0852"]]), y6 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, oA = /* @__PURE__ */ U(y6, [["__scopeId", "data-v-47e67f04"]]);
function lA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const iA = mu(() => import("./VoiceFigure-DfjmEcU3.js").then((e) => e.V)), rA = "1.2.0", uA = "3.5";
export {
  rh as $,
  Ee as A,
  Be as B,
  $a as C,
  ct as D,
  cC as E,
  b4 as F,
  e_ as G,
  lC as H,
  Z5 as I,
  _4 as J,
  Tt as K,
  $6 as L,
  bo as M,
  I4 as N,
  M4 as O,
  wa as P,
  __ as Q,
  BM as R,
  Jn as S,
  T_ as T,
  MM as U,
  Te as V,
  ra as W,
  SM as X,
  xM as Y,
  ih as Z,
  U as _,
  pM as a,
  K_ as a$,
  O4 as a0,
  RM as a1,
  LM as a2,
  Le as a3,
  GM as a4,
  UM as a5,
  At as a6,
  NM as a7,
  s_ as a8,
  sM as a9,
  j_ as aA,
  x_ as aB,
  W5 as aC,
  r_ as aD,
  u_ as aE,
  dC as aF,
  Pr as aG,
  O_ as aH,
  Cn as aI,
  cM as aJ,
  iM as aK,
  eC as aL,
  An as aM,
  sC as aN,
  ZM as aO,
  S_ as aP,
  M_ as aQ,
  $_ as aR,
  gn as aS,
  Mt as aT,
  oM as aU,
  I$ as aV,
  k_ as aW,
  TM as aX,
  qr as aY,
  zt as aZ,
  Qt as a_,
  Y_ as aa,
  nC as ab,
  hM as ac,
  _M as ad,
  CM as ae,
  HM as af,
  zM as ag,
  VM as ah,
  bM as ai,
  Ol as aj,
  qM as ak,
  a_ as al,
  pC as am,
  g_ as an,
  m_ as ao,
  h_ as ap,
  KM as aq,
  FM as ar,
  jM as as,
  WM as at,
  E_ as au,
  n_ as av,
  o_ as aw,
  yC as ax,
  an as ay,
  l_ as az,
  H4 as b,
  vC as b$,
  p4 as b0,
  aC as b1,
  R_ as b2,
  B_ as b3,
  n5 as b4,
  Sr as b5,
  U_ as b6,
  t_ as b7,
  Ma as b8,
  mt as b9,
  N_ as bA,
  W_ as bB,
  vt as bC,
  I_ as bD,
  H_ as bE,
  i_ as bF,
  v_ as bG,
  c_ as bH,
  qe as bI,
  XM as bJ,
  z_ as bK,
  _C as bL,
  CC as bM,
  nM as bN,
  L$ as bO,
  QM as bP,
  q_ as bQ,
  gM as bR,
  mC as bS,
  L_ as bT,
  D_ as bU,
  P_ as bV,
  YM as bW,
  H5 as bX,
  JM as bY,
  f_ as bZ,
  hC as b_,
  F_ as ba,
  Qa as bb,
  Pi as bc,
  kC as bd,
  xC as be,
  A_ as bf,
  Z_ as bg,
  aM as bh,
  p_ as bi,
  wC as bj,
  DM as bk,
  PM as bl,
  wM as bm,
  IM as bn,
  uM as bo,
  J_ as bp,
  vM as bq,
  yM as br,
  $M as bs,
  b_ as bt,
  C$ as bu,
  oC as bv,
  S4 as bw,
  kM as bx,
  dM as by,
  y_ as bz,
  t5 as c,
  la as c$,
  rM as c0,
  lM as c1,
  d_ as c2,
  SC as c3,
  So as c4,
  MC as c5,
  eu as c6,
  X_ as c7,
  EM as c8,
  AM as c9,
  fo as cA,
  AC as cB,
  k6 as cC,
  Yt as cD,
  gf as cE,
  tA as cF,
  Mp as cG,
  li as cH,
  ie as cI,
  yi as cJ,
  WC as cK,
  I6 as cL,
  rA as cM,
  uA as cN,
  U6 as cO,
  UC as cP,
  As as cQ,
  J6 as cR,
  C2 as cS,
  Ue as cT,
  _t as cU,
  ga as cV,
  j6 as cW,
  G6 as cX,
  E6 as cY,
  Ic as cZ,
  i2 as c_,
  T$ as ca,
  fM as cb,
  $4 as cc,
  w_ as cd,
  go as ce,
  q5 as cf,
  C_ as cg,
  sn as ch,
  Pt as ci,
  Dt as cj,
  q6 as ck,
  P6 as cl,
  fn as cm,
  FC as cn,
  ge as co,
  zf as cp,
  eo as cq,
  va as cr,
  Ey as cs,
  ya as ct,
  ZC as cu,
  tM as cv,
  D6 as cw,
  Iy as cx,
  Gs as cy,
  un as cz,
  Ye as d,
  Rm as d$,
  XC as d0,
  R6 as d1,
  L6 as d2,
  N6 as d3,
  W6 as d4,
  eA as d5,
  sA as d6,
  Zi as d7,
  id as d8,
  PC as d9,
  oA as dA,
  ro as dB,
  RC as dC,
  Fs as dD,
  Ep as dE,
  lo as dF,
  B6 as dG,
  Jd as dH,
  Ui as dI,
  Wt as dJ,
  Sn as dK,
  Ld as dL,
  QC as dM,
  YC as dN,
  Vs as dO,
  Rd as dP,
  zs as dQ,
  Zo as dR,
  JC as dS,
  eM as dT,
  si as dU,
  wc as dV,
  $c as dW,
  Ww as dX,
  X6 as dY,
  Q6 as dZ,
  TC as d_,
  Y0 as da,
  C6 as db,
  Z6 as dc,
  qx as dd,
  Ft as de,
  V6 as df,
  Qe as dg,
  bt as dh,
  jv as di,
  pd as dj,
  cp as dk,
  Y6 as dl,
  A6 as dm,
  Vt as dn,
  zC as dp,
  HC as dq,
  AS as dr,
  nA as ds,
  aA as dt,
  ka as du,
  yf as dv,
  lt as dw,
  K6 as dx,
  tt as dy,
  iA as dz,
  OM as e,
  EC as e0,
  M6 as e1,
  VC as e2,
  k2 as e3,
  ox as e4,
  ur as e5,
  O6 as e6,
  z6 as e7,
  BC as e8,
  LC as e9,
  hr as eA,
  ri as eB,
  Gx as eC,
  Ws as eD,
  NC as eE,
  ds as eF,
  qC as eG,
  DC as eH,
  at as eI,
  KC as eJ,
  Nd as eK,
  je as ea,
  Tp as eb,
  F6 as ec,
  Rc as ed,
  OC as ee,
  fr as ef,
  IC as eg,
  Kl as eh,
  H6 as ei,
  qp as ej,
  _6 as ek,
  Np as el,
  Na as em,
  S6 as en,
  cn as eo,
  fi as ep,
  qd as eq,
  T6 as er,
  gt as es,
  lA as et,
  lx as eu,
  w6 as ev,
  x6 as ew,
  jC as ex,
  Ki as ey,
  GC as ez,
  _$ as f,
  bC as g,
  vn as h,
  iC as i,
  $C as j,
  rC as k,
  Q_ as l,
  K4 as m,
  ko as n,
  tC as o,
  mM as p,
  uC as q,
  Xr as r,
  Zr as s,
  Ce as t,
  s5 as u,
  G_ as v,
  gC as w,
  V_ as x,
  On as y,
  fC as z
};
