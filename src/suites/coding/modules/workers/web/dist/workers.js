/* @code-commandments-generated */
if (!document.getElementById("window-styles-1f71a4068992")) { const style = document.createElement("style"); style.id = "window-styles-1f71a4068992"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-7b462dac]{flex:1}.note[data-v-7b462dac]{color:var(--text-3);font-size:12px}.worker-moment[data-v-4889fbf7]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-4889fbf7]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as m, unref as e, withCtx as n, createElementVNode as _, toDisplayString as h, createVNode as r, ref as v } from "vue";
import { useRows as p, RowList as b, peekRef as y, TimeAgo as g, useWindow as x, WindowRoom as R, InnerTabs as W, TabBody as C, SwitchCase as N, AgentRowList as $ } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = ["onClick"], D = { class: "worker-moment-text" }, I = {
  __name: "WorkerRecent",
  setup(w) {
    const { rows: s, failure: o, loaded: l, older: d, more: c } = p("chat-mark main --type workers.worker", ["chat_mark.*"], { incremental: !0 });
    return (i, f) => (u(), m(e(b), {
      rows: e(s),
      failure: e(o),
      loaded: e(l),
      older: e(d),
      more: e(c),
      empty: "No worker has done anything noteworthy yet",
      hint: "Worker activity appears here as work starts and finishes."
    }, {
      default: n(({ row: t }) => [
        _("button", {
          type: "button",
          class: "worker-moment",
          "data-worker-moment": "",
          onClick: (a) => e(y)(`${t.target_model}:${t.target_id}`)
        }, [
          _("span", D, h(t.text), 1),
          r(e(g), {
            at: t.created_at
          }, null, 8, ["at"])
        ], 8, B)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "more"]));
  }
}, T = /* @__PURE__ */ k(I, [["__scopeId", "data-v-4889fbf7"]]), A = {
  __name: "WorkerDropdown",
  setup(w) {
    var i;
    const s = x(), o = v((i = s.tabs) == null ? void 0 : i[0]), { rows: l, failure: d, loaded: c } = p("agent list --role worker", ["agent.*"]);
    return (f, t) => (u(), m(e(R), { padding: "0" }, {
      default: n(() => [
        r(e(W), {
          active: o.value,
          onChoose: t[0] || (t[0] = (a) => o.value = a)
        }, null, 8, ["active"]),
        r(e(C), {
          class: "worker-tab-body",
          tab: o.value
        }, {
          default: n(() => {
            var a;
            return [
              r(e(N), {
                value: (a = o.value) == null ? void 0 : a.key
              }, {
                workers: n(() => [
                  r(e($), {
                    rows: e(l),
                    failure: e(d),
                    loaded: e(c),
                    none: "No workers have been sent from here"
                  }, null, 8, ["rows", "failure", "loaded"])
                ]),
                recent: n(() => [
                  r(T)
                ]),
                _: 1
              }, 8, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab"])
      ]),
      _: 1
    }));
  }
}, E = /* @__PURE__ */ k(A, [["__scopeId", "data-v-4596a516"]]);
export {
  E as default
};
