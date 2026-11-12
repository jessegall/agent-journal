if (!document.getElementById("window-styles-6f6a7e7311bc")) { const style = document.createElement("style"); style.id = "window-styles-6f6a7e7311bc"; style.textContent = ".error[data-v-961e9275]{padding:10px 16px;border-bottom:1px solid var(--border-inner)}.head[data-v-961e9275]{display:flex;gap:10px;align-items:center;font-size:12.5px}.place[data-v-961e9275]{flex:1;min-width:0;overflow:hidden;color:var(--text-3);text-overflow:ellipsis;white-space:nowrap}.message[data-v-961e9275]{margin:4px 0 0;color:var(--text-2);font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.failure[data-v-961e9275]{padding:10px 16px;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as o, createBlock as m, unref as e, withCtx as u, createElementBlock as p, toDisplayString as d, createTextVNode as f, createCommentVNode as h, Fragment as x, renderList as y, createElementVNode as n, createVNode as v } from "vue";
import { useWindow as E, WindowRoom as N, EmptyState as B, TimeAgo as C, Btn as S, removed as V } from "@journal/window-kit";
const R = (l, c) => {
  const t = l.__vccOpts || l;
  for (const [s, i] of c)
    t[s] = i;
  return t;
}, T = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-errors-failure": ""
}, j = ["data-error-id"], W = { class: "head" }, A = {
  class: "place",
  "data-error-place": ""
}, D = {
  class: "message",
  "data-error-message": ""
}, F = {
  __name: "ErrorRows",
  setup(l) {
    const c = E(), { rows: t, failure: s, loaded: i, act: g } = c.props.errors, k = (_) => g(["journal-exception", "solve", String(_.id)], V(_.id));
    return (_, a) => (o(), m(e(N), { padding: "0" }, {
      default: u(() => [
        e(s) ? (o(), p("p", T, d(e(s)), 1)) : e(i) && !e(t).length ? (o(), m(e(B), {
          key: 1,
          title: "No errors"
        }, {
          default: u(() => [...a[0] || (a[0] = [
            f("The journal has recorded no error that is not solved.", -1)
          ])]),
          _: 1
        })) : h("", !0),
        (o(!0), p(x, null, y(e(t), (r) => (o(), p("div", {
          key: r.id,
          class: "error",
          "data-error": "",
          "data-error-id": r.id
        }, [
          n("div", W, [
            n("strong", null, "Error " + d(r.id), 1),
            n("span", A, d(r.source), 1),
            v(e(C), {
              at: r.created_at
            }, null, 8, ["at"]),
            v(e(S), {
              small: "",
              "data-error-solved": "",
              onClick: (I) => k(r)
            }, {
              default: u(() => [...a[1] || (a[1] = [
                f("Solved", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          n("p", D, d(r.message), 1)
        ], 8, j))), 128))
      ]),
      _: 1
    }));
  }
}, $ = /* @__PURE__ */ R(F, [["__scopeId", "data-v-961e9275"]]);
export {
  $ as default
};
