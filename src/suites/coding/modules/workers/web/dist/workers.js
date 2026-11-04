/* @code-commandments-generated */
if (!document.getElementById("window-styles-5f64c5956d52")) { const style = document.createElement("style"); style.id = "window-styles-5f64c5956d52"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-d9e1bce4]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-d9e1bce4]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as m, createBlock as u, unref as e, withCtx as a, createElementVNode as _, toDisplayString as h, createVNode as r, ref as v } from "vue";
import { useRows as p, RowList as x, peekRef as g, TimeAgo as y, useWindow as b, WindowRoom as R, InnerTabs as C, SwitchCase as W, AgentRowList as N } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const A = ["onClick"], B = { class: "worker-moment-text" }, D = {
  __name: "WorkerRecent",
  setup(w) {
    const { rows: n, failure: t, loaded: s, older: l, more: c } = p("chat-mark main --type workers.worker", ["chat_mark.*"], { incremental: !0 });
    return (d, k) => (m(), u(e(x), {
      rows: e(n),
      failure: e(t),
      loaded: e(s),
      older: e(l),
      more: e(c),
      empty: "No worker has done anything noteworthy yet"
    }, {
      default: a(({ row: o }) => [
        _("button", {
          type: "button",
          class: "worker-moment",
          "data-worker-moment": "",
          onClick: (i) => e(g)(`${o.target_model}:${o.target_id}`)
        }, [
          _("span", B, h(o.text), 1),
          r(e(y), {
            at: o.created_at
          }, null, 8, ["at"])
        ], 8, A)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "more"]));
  }
}, I = /* @__PURE__ */ $(D, [["__scopeId", "data-v-d9e1bce4"]]), V = {
  __name: "WorkerDropdown",
  setup(w) {
    var d;
    const n = b(), t = v((d = n.tabs) == null ? void 0 : d[0]), { rows: s, failure: l, loaded: c } = p("agent list --role worker", ["agent.*"]);
    return (k, o) => (m(), u(e(R), { padding: "14px 16px" }, {
      default: a(() => {
        var i;
        return [
          r(e(C), {
            active: t.value,
            onChoose: o[0] || (o[0] = (f) => t.value = f)
          }, null, 8, ["active"]),
          r(e(W), {
            value: (i = t.value) == null ? void 0 : i.key
          }, {
            workers: a(() => [
              r(e(N), {
                rows: e(s),
                failure: e(l),
                loaded: e(c),
                none: "No workers have been sent from here"
              }, null, 8, ["rows", "failure", "loaded"])
            ]),
            recent: a(() => [
              r(I)
            ]),
            _: 1
          }, 8, ["value"])
        ];
      }),
      _: 1
    }));
  }
};
export {
  V as default
};
