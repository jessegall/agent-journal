/* @code-commandments-generated */
if (!document.getElementById("window-styles-993e04482ee9")) { const style = document.createElement("style"); style.id = "window-styles-993e04482ee9"; style.textContent = ".open-questions-icon[data-v-bb9f2ba6]{flex:none;color:var(--text-3)}.open-questions-text[data-v-bb9f2ba6]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.open-questions-space[data-v-bb9f2ba6]{flex:1}.question[data-v-38203f52]{display:flex;flex:1;flex-direction:column;gap:8px;width:100%;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-head[data-v-38203f52]{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.question-time[data-v-38203f52]{flex:none;color:var(--text-3);font-size:11.5px}.question-label[data-v-38203f52]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-38203f52]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-38203f52]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-38203f52]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-38203f52]:hover{border-color:var(--accent)}.question-option[data-v-38203f52]:active{transform:scale(.98)}.question-option.recommended[data-v-38203f52]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-38203f52]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-38203f52]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-38203f52]{margin:0;color:var(--danger);font-size:12.5px}.question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.waiting-heading[data-v-f7cafce3]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-f7cafce3]{flex:1}.detail[data-v-f7cafce3]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as d, computed as m, unref as e, openBlock as f, createBlock as q, Teleport as _, createVNode as l, createElementVNode as p, toDisplayString as v, withCtx as w, createTextVNode as k, createCommentVNode as x } from "vue";
import { useWindow as N, Icon as O, Btn as b } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const I = {
  class: "open-questions-text",
  "data-open-questions": ""
}, V = "questions.questions", g = {
  __name: "OpenQuestionsDock",
  setup(y) {
    const t = N(), n = t.option("head"), s = d(0), c = m(() => `Agent asked ${s.value} ${s.value === 1 ? "question" : "questions"}`);
    async function u() {
      const a = await t.read("question list");
      a.ok && (s.value = a.value.rows.length);
    }
    return t.follow(["question.*"], u), u(), (a, o) => {
      var i, r;
      return ((i = e(n)) == null ? void 0 : i.value) ?? e(n) ? (f(), q(_, {
        key: 0,
        to: ((r = e(n)) == null ? void 0 : r.value) ?? e(n)
      }, [
        l(e(O), {
          name: "question",
          class: "open-questions-icon"
        }),
        p("span", I, v(c.value), 1),
        o[2] || (o[2] = p("span", { class: "open-questions-space" }, null, -1)),
        l(e(b), {
          small: "",
          bordered: "",
          "data-open-questions-window": "",
          onClick: o[0] || (o[0] = (B) => e(t).open(V))
        }, {
          default: w(() => [...o[1] || (o[1] = [
            k("Open", -1)
          ])]),
          _: 1
        })
      ], 8, ["to"])) : x("", !0);
    };
  }
}, T = /* @__PURE__ */ D(g, [["__scopeId", "data-v-bb9f2ba6"]]);
export {
  T as default
};
