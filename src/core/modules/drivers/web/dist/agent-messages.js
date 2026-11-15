if (!document.getElementById("window-styles-7685cd097e86")) { const style = document.createElement("style"); style.id = "window-styles-7685cd097e86"; style.textContent = ".agent-message[data-v-64679be0]{min-width:0;padding:6px 0}.agent-message-head[data-v-64679be0]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.agent-message-key[data-v-64679be0]{color:var(--text);font-weight:500}.agent-message-type[data-v-64679be0],.agent-message-count[data-v-64679be0]{color:var(--text-3)}.agent-message-type[data-type=refusal][data-v-64679be0]{color:var(--tone-bad)}.agent-message-type[data-type=steering][data-v-64679be0]{color:var(--accent-text)}.agent-message-text[data-v-64679be0]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}details[data-v-edc7aad3]{width:100%;font-size:12px}summary[data-v-edc7aad3]{cursor:pointer}.check[data-v-edc7aad3]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-edc7aad3]{margin-left:8px}.note[data-v-edc7aad3]{color:var(--text-3)}p[data-v-edc7aad3]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-b781af7b]{width:100%}.summary[data-v-b781af7b]{display:flex;gap:10px}.main[data-v-b781af7b]{flex:1}.note[data-v-b781af7b]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as l, unref as s, withCtx as o, createVNode as p, createElementVNode as t, toDisplayString as a } from "vue";
import { useWindow as g, WindowRoom as r, RowList as m } from "@journal/window-kit";
import { _ as u, a as y } from "./_plugin-vue_export-helper-CIxTtzM2.js";
const f = {
  class: "agent-message",
  "data-agent-message": ""
}, h = { class: "agent-message-head" }, v = { class: "agent-message-key" }, x = ["data-type"], b = { class: "agent-message-count" }, k = { class: "agent-message-text" }, L = {
  __name: "AgentMessageList",
  setup(w) {
    const n = g(), { rows: d, failure: c, loaded: i } = n.props.agent_messages;
    return (M, N) => (_(), l(s(r), null, {
      default: o(() => [
        p(s(m), {
          rows: s(d),
          failure: s(c),
          loaded: s(i),
          empty: "No module declares an agent message",
          hint: "Instructions available to agents appear here, grouped by module."
        }, {
          default: o(({ row: e }) => [
            t("div", f, [
              t("p", h, [
                t("span", v, a(e.key), 1),
                t("span", {
                  class: "agent-message-type",
                  "data-type": e.type
                }, a(s(y)(e.type)), 9, x),
                t("span", b, "said " + a(e.delivery_count) + " " + a(e.delivery_count === 1 ? "time" : "times"), 1)
              ]),
              t("p", k, a(e.text), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ u(L, [["__scopeId", "data-v-64679be0"]]);
export {
  R as default
};
