/* @code-commandments-generated */
if (!document.getElementById("window-styles-43f28005cf6c")) { const style = document.createElement("style"); style.id = "window-styles-43f28005cf6c"; style.textContent = ".worker-models[data-v-f2e1dbd2]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-f2e1dbd2]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-f2e1dbd2]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-f2e1dbd2]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-f2e1dbd2]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-f2e1dbd2]{display:flex;gap:8px;align-items:center}.number[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-d52c1a26]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-dca1eb21]{flex:1}.note[data-v-dca1eb21]{color:var(--text-3);font-size:12px}.worker-moment[data-v-774d56be]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-774d56be]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-ac3caed9]{padding:14px 16px}.worktree[data-v-a10f9f34]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a10f9f34]{flex:1;min-width:0}.worktree-holder[data-v-a10f9f34]{font-weight:500}.worktree-folder[data-v-a10f9f34]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a10f9f34]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as m, unref as e, withCtx as n, createElementVNode as u, toDisplayString as b, createVNode as a, computed as v } from "vue";
import { useWindow as k, RowList as h, peekRef as y, TimeAgo as g, WindowRoom as x, InnerTabs as W, TabBody as R, SwitchCase as C, AgentRowList as N } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = ["onClick"], B = { class: "worker-moment-text" }, D = {
  __name: "WorkerRecent",
  setup(f) {
    const o = k(), { rows: r, failure: l, loaded: c, older: i, more: d } = o.props.recent;
    return (s, _) => (p(), m(e(h), {
      rows: e(r),
      failure: e(l),
      loaded: e(c),
      older: e(i),
      more: e(d),
      empty: "No worker has done anything noteworthy yet",
      hint: "Worker activity appears here as work starts and finishes."
    }, {
      default: n(({ row: t }) => [
        u("button", {
          type: "button",
          class: "worker-moment",
          "data-worker-moment": "",
          onClick: (A) => e(y)(`${t.target_model}:${t.target_id}`)
        }, [
          u("span", B, b(t.text), 1),
          a(e(g), {
            at: t.created_at
          }, null, 8, ["at"])
        ], 8, $)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "more"]));
  }
}, I = /* @__PURE__ */ w(D, [["__scopeId", "data-v-774d56be"]]), T = {
  __name: "WorkerDropdown",
  setup(f) {
    var d;
    const o = k();
    o.state.tab = ((d = o.tabs[0]) == null ? void 0 : d.key) ?? "workers";
    const r = v({ get: () => o.tabs.find((s) => s.key === o.state.tab), set: (s) => o.state.tab = s.key }), { rows: l, failure: c, loaded: i } = o.props.workers;
    return (s, _) => (p(), m(e(x), { padding: "0" }, {
      default: n(() => [
        a(e(W), {
          active: r.value,
          onChoose: _[0] || (_[0] = (t) => r.value = t)
        }, null, 8, ["active"]),
        a(e(R), {
          class: "worker-tab-body",
          tab: r.value
        }, {
          default: n(() => {
            var t;
            return [
              a(e(C), {
                value: (t = r.value) == null ? void 0 : t.key
              }, {
                workers: n(() => [
                  a(e(N), {
                    rows: e(l),
                    failure: e(c),
                    loaded: e(i),
                    none: "No workers have been sent from here"
                  }, null, 8, ["rows", "failure", "loaded"])
                ]),
                recent: n(() => [
                  a(I)
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
}, E = /* @__PURE__ */ w(T, [["__scopeId", "data-v-ac3caed9"]]);
export {
  E as default
};
