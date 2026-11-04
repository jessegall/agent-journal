/* @code-commandments-generated */
if (!document.getElementById("window-styles-66ec22d7c6dc")) { const style = document.createElement("style"); style.id = "window-styles-66ec22d7c6dc"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-d9e1bce4]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-d9e1bce4]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as m, unref as e, withCtx as n, createElementVNode as i, toDisplayString as b, createVNode as r, ref as h } from "vue";
import { useRows as p, RowList as v, peekRef as y, TimeAgo as g, useWindow as x, WindowRoom as R, InnerTabs as W, TabBody as C, SwitchCase as N, AgentRowList as $ } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = ["onClick"], D = { class: "worker-moment-text" }, I = {
  __name: "WorkerRecent",
  setup(k) {
    const { rows: s, failure: t, loaded: l, older: d, more: c } = p("chat-mark main --type workers.worker", ["chat_mark.*"], { incremental: !0 });
    return (_, f) => (u(), m(e(v), {
      rows: e(s),
      failure: e(t),
      loaded: e(l),
      older: e(d),
      more: e(c),
      empty: "No worker has done anything noteworthy yet"
    }, {
      default: n(({ row: o }) => [
        i("button", {
          type: "button",
          class: "worker-moment",
          "data-worker-moment": "",
          onClick: (a) => e(y)(`${o.target_model}:${o.target_id}`)
        }, [
          i("span", D, b(o.text), 1),
          r(e(g), {
            at: o.created_at
          }, null, 8, ["at"])
        ], 8, B)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "more"]));
  }
}, T = /* @__PURE__ */ w(I, [["__scopeId", "data-v-d9e1bce4"]]), A = {
  __name: "WorkerDropdown",
  setup(k) {
    var _;
    const s = x(), t = h((_ = s.tabs) == null ? void 0 : _[0]), { rows: l, failure: d, loaded: c } = p("agent list --role worker", ["agent.*"]);
    return (f, o) => (u(), m(e(R), { padding: "0" }, {
      default: n(() => [
        r(e(W), {
          active: t.value,
          onChoose: o[0] || (o[0] = (a) => t.value = a)
        }, null, 8, ["active"]),
        r(e(C), {
          class: "worker-tab-body",
          tab: t.value
        }, {
          default: n(() => {
            var a;
            return [
              r(e(N), {
                value: (a = t.value) == null ? void 0 : a.key
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
}, E = /* @__PURE__ */ w(A, [["__scopeId", "data-v-4596a516"]]);
export {
  E as default
};
