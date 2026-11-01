/* @code-commandments-generated */
if (!document.getElementById("window-styles-fb3151fedfba")) { const style = document.createElement("style"); style.id = "window-styles-fb3151fedfba"; style.textContent = ".shares[data-v-710b224e]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-710b224e],.shares-waiting[data-v-710b224e],.shares-opens[data-v-710b224e],.shares-open[data-v-710b224e]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-710b224e],.shares-waiting[data-v-710b224e],.shares-opens[data-v-710b224e]{align-items:flex-start}.shares-target[data-v-710b224e]{width:100%;min-width:0}.shares-option[data-v-710b224e],.shares-row[data-v-710b224e]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-710b224e]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-710b224e]{flex:1;min-width:0}.shares-link[data-v-710b224e],.shares-comment[data-v-710b224e]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-710b224e],.shares-failure[data-v-710b224e]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { onMounted as H, onUnmounted as J, computed as O, ref as v, openBlock as t, createElementBlock as o, createElementVNode as n, withModifiers as Q, withDirectives as W, vModelText as F, createVNode as i, unref as r, createCommentVNode as d, Fragment as _, renderList as E, toDisplayString as l, withCtx as c, createTextVNode as h, createBlock as K } from "vue";
import { useWindow as X, useRows as Z, useListTools as ee, Segmented as se, Switch as ae, Btn as m, ListTools as te, RowList as ne } from "@journal/window-kit";
const oe = (x, N) => {
  const k = x.__vccOpts || x;
  for (const [S, L] of N)
    k[S] = L;
  return k;
}, le = { class: "shares" }, re = { class: "shares-option" }, ie = { class: "shares-option" }, de = {
  key: 0,
  class: "shares-hint"
}, ue = { class: "shares-option" }, ve = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, ce = {
  class: "shares-link",
  "data-share-address": ""
}, he = { class: "shares-hint" }, pe = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, me = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, ke = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, fe = ["data-share-row"], we = { class: "shares-name" }, ye = ["data-share-row"], _e = { class: "shares-row" }, ge = { class: "shares-name" }, Ce = {
  key: 0,
  class: "shares-hint"
}, Se = {
  key: 0,
  class: "shares-row"
}, be = 1e4, $e = {
  __name: "ShareRows",
  setup(x) {
    const N = [
      { key: "1d", label: "1 day" },
      { key: "7d", label: "7 days" },
      { key: "30d", label: "30 days" },
      { key: "never", label: "Never" }
    ], k = X(), { rows: S, failure: L, loaded: Y, load: M } = Z("share list", []);
    let P = 0;
    H(() => P = setInterval(M, be)), J(() => clearInterval(P));
    const T = O(() => S.value.filter((a) => a.state === "waiting")), V = O(() => S.value.filter((a) => a.state === "active")), A = ee(V, { title: (a) => `${a.row_model} ${a.row_id}` }), w = v(new URLSearchParams(window.location.search).get("share") ?? ""), R = v("7d"), y = v(""), B = v(!1), b = v(null), f = v(null), g = v(""), p = v({}), $ = v(!1), D = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function C(a) {
      const e = await k.run(a);
      return g.value = e.ok ? "" : e.error, e.ok && M(), e;
    }
    async function U(a) {
      const e = await k.read(["tunnel", "status"]), s = e.ok && e.value.address ? e.value.address : window.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e.ok && e.value.address) };
    }
    async function I() {
      const a = await k.read(["share", "opens", w.value.trim()]);
      g.value = a.ok ? "" : a.error, b.value = a.ok ? a.value.rows : null;
    }
    w.value && I();
    async function j() {
      const a = await C(["share", "make", w.value.trim(), "--ends", R.value, ...y.value ? [`--password=${y.value}`] : [], ...B.value ? ["--comments"] : []]);
      a.ok && (f.value = await U(a), y.value = "", b.value = null);
    }
    async function q(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (f.value = await U(e));
    }
    async function z() {
      for (const a of V.value) await C(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function G(a) {
      if (p.value[a.id]) {
        const { [a.id]: s, ...u } = p.value;
        return void (p.value = u);
      }
      const e = await k.read(["share", "comments", String(a.id)]);
      g.value = e.ok ? "" : e.error, e.ok && (p.value = { ...p.value, [a.id]: e.value.rows });
    }
    return (a, e) => (t(), o("div", le, [
      n("form", {
        class: "shares-make",
        "data-share-form": "",
        onSubmit: Q(j, ["prevent"])
      }, [
        W(n("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (s) => w.value = s),
          class: "shares-target",
          placeholder: "plans:2, docs:12 or reports:4",
          "aria-label": "What to share",
          onChange: I
        }, null, 544), [
          [F, w.value]
        ]),
        n("div", re, [
          e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
          i(r(se), {
            options: N,
            value: R.value,
            "data-share-ends": "",
            onPick: e[1] || (e[1] = (s) => R.value = s)
          }, null, 8, ["value"])
        ]),
        n("div", ie, [
          e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
          W(n("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (s) => y.value = s),
            class: "shares-password",
            type: "password",
            autocomplete: "new-password",
            placeholder: "None",
            "aria-label": "Password"
          }, null, 512), [
            [F, y.value]
          ]),
          y.value ? (t(), o("span", de, "Visitors enter any name and this password.")) : d("", !0)
        ]),
        n("div", ue, [
          e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
          i(r(ae), {
            on: B.value,
            title: "Let visitors comment under a name of their own",
            onChange: e[3] || (e[3] = (s) => B.value = s)
          }, null, 8, ["on"])
        ]),
        b.value ? (t(), o("div", ve, [
          e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
          (t(!0), o(_, null, E(b.value, (s) => (t(), o("span", {
            key: s.id
          }, l(s.line), 1))), 128))
        ])) : d("", !0),
        i(r(m), {
          kind: "primary",
          type: "submit",
          disabled: !w.value.trim()
        }, {
          default: c(() => [...e[10] || (e[10] = [
            h("Make a link", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      f.value ? (t(), o(_, { key: 0 }, [
        n("p", ce, l(f.value.address), 1),
        n("p", he, "This link is shown once. Anyone who has it can read it" + l(f.value.expires_at ? ` until ${f.value.expires_at}` : "") + ".", 1),
        f.value.outside ? d("", !0) : (t(), o("p", pe, "No tunnel is connected, so this address works only from this computer."))
      ], 64)) : d("", !0),
      g.value ? (t(), o("p", me, l(g.value), 1)) : d("", !0),
      T.value.length ? (t(), o("section", ke, [
        e[13] || (e[13] = n("h3", { class: "shares-label" }, "Needs you", -1)),
        (t(!0), o(_, null, E(T.value, (s) => (t(), o("div", {
          key: s.id,
          class: "shares-row",
          "data-share-row": s.id
        }, [
          n("span", we, "An agent asks to share " + l(s.row_model) + " " + l(s.row_id) + ", " + l(D(s)) + l(s.locked ? ", with a password" : "") + l(s.comments ? ", with comments" : ""), 1),
          i(r(m), {
            small: "",
            kind: "primary",
            "data-share-accept": "",
            onClick: (u) => q(s)
          }, {
            default: c(() => [...e[11] || (e[11] = [
              h("Accept", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          i(r(m), {
            small: "",
            "data-share-deny": "",
            onClick: (u) => C(["share", "deny", String(s.id)])
          }, {
            default: c(() => [...e[12] || (e[12] = [
              h("Deny", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ], 8, fe))), 128))
      ])) : d("", !0),
      i(r(te), {
        tools: r(A),
        placeholder: "Search the links"
      }, null, 8, ["tools"]),
      i(r(ne), {
        rows: r(A).shown.value,
        failure: r(L),
        loaded: r(Y),
        empty: "No link is open"
      }, {
        default: c(({ row: s }) => [
          n("div", {
            class: "shares-open",
            "data-share-row": s.id
          }, [
            n("div", _e, [
              n("span", ge, l(s.row_model) + " " + l(s.row_id) + ", " + l(D(s)) + ", " + l(s.view_count) + " " + l(s.view_count === 1 ? "view" : "views") + l(s.locked ? ", with a password" : ""), 1),
              s.comments ? (t(), K(r(m), {
                key: 0,
                small: "",
                "data-share-comments-open": "",
                onClick: (u) => G(s)
              }, {
                default: c(() => [...e[14] || (e[14] = [
                  h("Comments", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : d("", !0),
              i(r(m), {
                small: "",
                "data-share-stop": "",
                onClick: (u) => C(["share", "revoke", String(s.id)])
              }, {
                default: c(() => [...e[15] || (e[15] = [
                  h("Stop sharing", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ]),
            p.value[s.id] ? (t(), o(_, { key: 0 }, [
              p.value[s.id].length ? d("", !0) : (t(), o("p", Ce, "No comments yet")),
              (t(!0), o(_, null, E(p.value[s.id], (u) => (t(), o("p", {
                key: u.id,
                class: "shares-comment",
                "data-share-comment": ""
              }, [
                n("strong", null, l(u.visitor_name), 1),
                h(" " + l(u.text), 1)
              ]))), 128))
            ], 64)) : d("", !0)
          ], 8, ye)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      V.value.length > 1 ? (t(), o(_, { key: 3 }, [
        $.value ? (t(), o("div", Se, [
          i(r(m), {
            small: "",
            onClick: e[4] || (e[4] = (s) => $.value = !1)
          }, {
            default: c(() => [...e[16] || (e[16] = [
              h("Keep them", -1)
            ])]),
            _: 1
          }),
          i(r(m), {
            small: "",
            kind: "danger",
            "data-share-stop-every-confirm": "",
            onClick: z
          }, {
            default: c(() => [...e[17] || (e[17] = [
              h("Yes, stop every share", -1)
            ])]),
            _: 1
          })
        ])) : (t(), K(r(m), {
          key: 1,
          small: "",
          "data-share-stop-every": "",
          onClick: e[5] || (e[5] = (s) => $.value = !0)
        }, {
          default: c(() => [...e[18] || (e[18] = [
            h("Stop every share", -1)
          ])]),
          _: 1
        }))
      ], 64)) : d("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ oe($e, [["__scopeId", "data-v-710b224e"]]);
export {
  Le as default
};
