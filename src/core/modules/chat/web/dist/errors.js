if (!document.getElementById("window-styles-15b18a450d05")) { const style = document.createElement("style"); style.id = "window-styles-15b18a450d05"; style.textContent = ".error[data-v-8bb70fe3]{padding:10px 16px;border-bottom:1px solid var(--border-inner)}.head[data-v-8bb70fe3]{display:flex;gap:10px;align-items:center;font-size:12.5px}.place[data-v-8bb70fe3]{flex:1;min-width:0;overflow:hidden;color:var(--text-3);text-overflow:ellipsis;white-space:nowrap}.message[data-v-8bb70fe3]{margin:4px 0 0;color:var(--text-2);font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.failure[data-v-8bb70fe3]{padding:10px 16px;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as p, unref as e, withCtx as u, createElementBlock as m, toDisplayString as n, createTextVNode as f, createCommentVNode as h, Fragment as y, renderList as x, createElementVNode as d, createVNode as v } from "vue";
import { useWindow as E, WindowRoom as N, Skeleton as S, EmptyState as B, TimeAgo as C, Btn as V, removed as R } from "@journal/window-kit";
const T = (l, c) => {
  const o = l.__vccOpts || l;
  for (const [s, i] of c)
    o[s] = i;
  return o;
}, b = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-errors-failure": ""
}, j = ["data-error-id"], W = { class: "head" }, w = {
  class: "place",
  "data-error-place": ""
}, A = {
  class: "message",
  "data-error-message": ""
}, D = {
  __name: "ErrorRows",
  setup(l) {
    const c = E(), { rows: o, failure: s, loaded: i, act: g } = c.props.errors, k = (_) => g(["journal-exception", "solve", String(_.id)], R(_.id));
    return (_, a) => (t(), p(e(N), { padding: "0" }, {
      default: u(() => [
        e(s) ? (t(), m("p", b, n(e(s)), 1)) : e(i) ? e(o).length ? h("", !0) : (t(), p(e(B), {
          key: 2,
          title: "No errors"
        }, {
          default: u(() => [...a[0] || (a[0] = [
            f("The journal has recorded no error that is not solved.", -1)
          ])]),
          _: 1
        })) : (t(), p(e(S), {
          key: 1,
          shape: "rows"
        })),
        (t(!0), m(y, null, x(e(o), (r) => (t(), m("div", {
          key: r.id,
          class: "error",
          "data-error": "",
          "data-error-id": r.id
        }, [
          d("div", W, [
            d("strong", null, "Error " + n(r.id), 1),
            d("span", w, n(r.source), 1),
            v(e(C), {
              at: r.created_at
            }, null, 8, ["at"]),
            v(e(V), {
              small: "",
              "data-error-solved": "",
              onClick: (F) => k(r)
            }, {
              default: u(() => [...a[1] || (a[1] = [
                f("Solved", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          d("p", A, n(r.message), 1)
        ], 8, j))), 128))
      ]),
      _: 1
    }));
  }
}, O = /* @__PURE__ */ T(D, [["__scopeId", "data-v-8bb70fe3"]]);
export {
  O as default
};
