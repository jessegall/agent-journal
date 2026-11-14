if (!document.getElementById("window-styles-0b4ecba2d0cc")) { const style = document.createElement("style"); style.id = "window-styles-0b4ecba2d0cc"; style.textContent = ".inspector[data-v-7f374e1d]{display:flex;flex-direction:column;min-height:0;height:100%;overflow-y:auto;background:var(--bg)}header[data-v-7f374e1d]{display:flex;align-items:center;gap:8px;padding:14px;border-bottom:1px solid var(--border)}header h1[data-v-7f374e1d]{flex:1;margin:0;font-size:14px}.empty[data-v-7f374e1d]{margin:0;padding:14px;color:var(--text-3);font-size:12px}.detail-head[data-v-360e14b0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-360e14b0]{margin:0;color:var(--text);font-size:14px}.slow[data-v-360e14b0]{color:#c58b35}.refused[data-v-360e14b0]{color:#d76b6b}.heading[data-v-360e14b0]{margin:0 0 8px;font-size:12px}pre[data-v-360e14b0]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}.note[data-v-360e14b0]{margin:0;color:var(--text-3);font-size:12px}.message[data-v-360e14b0]{padding:16px;line-height:1.6}.toolbar[data-v-c0c54f64]{display:flex;justify-content:space-between;padding:8px 12px}.queue-veil[data-v-c0c54f64]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-c0c54f64]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-c0c54f64]{position:relative;display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-c0c54f64]{display:flex;flex-direction:column;min-height:0;min-width:0}.note[data-v-c0c54f64]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-c0c54f64]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-c0c54f64]{background:var(--border)}.message[data-v-c0c54f64]{padding:16px;line-height:1.6}.detail-head[data-v-c0c54f64]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-c0c54f64]{margin:0;color:var(--text);font-size:14px}.heading[data-v-c0c54f64]{margin:0 0 8px;font-size:12px}pre[data-v-c0c54f64]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.queue-button[data-v-c0c54f64]{align-self:flex-end;margin:8px 12px}.queue-veil[data-v-c0c54f64]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-c0c54f64]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-c0c54f64]{position:relative;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-23ad5fa1]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-23ad5fa1]{margin:0;color:var(--text-3);font-size:12.5px}.logs[data-v-25c9b82f]{display:flex;flex-direction:column;height:100%;min-height:0}.toolbar[data-v-25c9b82f],nav[data-v-25c9b82f]{display:flex;align-items:center;gap:12px;padding:10px 12px;flex:none}.toolbar[data-v-25c9b82f]{border-bottom:1px solid var(--border)}.toolbar label[data-v-25c9b82f]{display:flex;align-items:center;gap:6px}.toolbar button[data-v-25c9b82f]{margin-left:auto}.scroll[data-v-25c9b82f]{flex:1;min-height:0}nav[data-v-25c9b82f]{justify-content:center;border-top:1px solid var(--border)}\n"; document.head.appendChild(style); }
import { ref as w, computed as C, openBlock as r, createBlock as i, unref as t, withCtx as a, createElementVNode as d, createVNode as m, createTextVNode as _, toDisplayString as b, createElementBlock as p } from "vue";
import { useWindow as g, WindowRoom as N, Btn as k, TableLayout as B } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const H = {
  class: "numbers",
  "data-hook-numbers": ""
}, S = { class: "numbers-tools" }, V = {
  key: 0,
  class: "numbers-note",
  role: "alert"
}, E = {
  key: 1,
  class: "numbers-note"
}, L = {
  __name: "HookNumbers",
  setup(M) {
    const o = g(), s = w(!1), { data: f, failure: n } = o.props.numbers, l = () => o.reload("numbers"), u = C(() => {
      var e;
      return ((e = f.value) == null ? void 0 : e.rows) ?? [];
    }), v = [{ key: "hook", label: "Hook, reader or route" }, { key: "count", label: "Count" }, { key: "average_points", label: "Average points" }, { key: "most_points", label: "Most points" }];
    function y() {
      s.value = !s.value, o.state["numbers.costliest"] = String(s.value), l();
    }
    async function h() {
      const e = await o.run(["developer", "reset-numbers"]);
      n.value = e.ok ? "" : e.error, l();
    }
    return (e, c) => (r(), i(t(N), null, {
      default: a(() => [
        d("div", H, [
          d("div", S, [
            m(t(k), {
              small: "",
              bordered: "",
              "data-numbers-sort": "",
              onClick: y
            }, {
              default: a(() => [
                _(b(s.value ? "By name" : "Costliest first"), 1)
              ]),
              _: 1
            }),
            m(t(k), {
              small: "",
              bordered: "",
              "data-numbers-reset": "",
              onClick: h
            }, {
              default: a(() => [...c[0] || (c[0] = [
                _("Reset the counts", -1)
              ])]),
              _: 1
            })
          ]),
          t(n) ? (r(), p("p", V, b(t(n)), 1)) : u.value.length ? (r(), i(t(B), {
            key: 2,
            columns: v,
            rows: u.value,
            "data-numbers-table": ""
          }, null, 8, ["rows"])) : (r(), p("p", E, "Nothing counted yet. Call costs in the developer settings turns the counts on."))
        ])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ x(L, [["__scopeId", "data-v-23ad5fa1"]]);
export {
  A as default
};
