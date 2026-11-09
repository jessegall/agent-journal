if (!document.getElementById("window-styles-228cf601261e")) { const style = document.createElement("style"); style.id = "window-styles-228cf601261e"; style.textContent = ".worker-models[data-v-f2e1dbd2]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-f2e1dbd2]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-f2e1dbd2]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-f2e1dbd2]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-f2e1dbd2]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-f2e1dbd2]{display:flex;gap:8px;align-items:center}.number[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-d52c1a26]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-dca1eb21]{flex:1}.note[data-v-dca1eb21]{color:var(--text-3);font-size:12px}.worker-moment[data-v-774d56be]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-774d56be]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-dbeb4641]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-dbeb4641]{display:flex;align-items:center;gap:8px}input[data-v-dbeb4641]{min-width:0;flex:1}output[data-v-dbeb4641]{min-width:36px;text-align:right}small[data-v-dbeb4641]{color:var(--text-3)}p[data-v-dbeb4641]{margin:0}.actions[data-v-dbeb4641]{display:flex;gap:6px}.route[data-v-de22f389]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-de22f389]{margin:0}small[data-v-de22f389]{color:var(--text-3)}.actions[data-v-de22f389]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-0362f63d]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-0362f63d]{margin:0}label[data-v-0362f63d]{display:flex;align-items:center;gap:8px}select[data-v-0362f63d],input[type=number][data-v-0362f63d]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-7ea51616]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-7ea51616]{display:flex;gap:8px}input[data-v-7ea51616]{min-width:0;flex:1}.split[data-v-ab331a12]{display:flex;flex-direction:column;gap:8px}p[data-v-ab331a12],h3[data-v-ab331a12]{margin:0}p[data-v-ab331a12]{color:var(--text-3);font-size:12px}h3[data-v-ab331a12]{margin-top:12px;font-size:13px}label[data-v-ab331a12]{display:flex;align-items:center;gap:8px}input[data-v-ab331a12]{width:54px}[role=alert][data-v-ab331a12]{color:var(--danger)}.worker-tab-body[data-v-8fe373bc]{padding:14px 16px}.worktree[data-v-a10f9f34]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a10f9f34]{flex:1;min-width:0}.worktree-holder[data-v-a10f9f34]{font-weight:500}.worktree-folder[data-v-a10f9f34]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a10f9f34]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as w, computed as g, openBlock as c, createBlock as v, unref as r, withCtx as m, createElementVNode as l, createElementBlock as b, toDisplayString as i, createCommentVNode as x, createVNode as y, createTextVNode as L } from "vue";
import { useWindow as N, WindowRoom as W, RowList as A, patched as C } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = { class: "worker-models" }, V = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, j = ["data-worker-model"], B = { class: "worker-model-program" }, D = { class: "worker-model-name" }, M = ["checked", "disabled", "title", "onChange"], O = "journal.core.helpers.allowed-models", R = {
  __name: "WorkerModels",
  setup(I) {
    const p = N(), { rows: s, failure: u, loaded: _, act: f } = p.props.models, d = w(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, h = g(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function k(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await f(["setting", "set", O, t.join(","), "--project"], C(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), v(r(W), null, {
      default: m(() => [
        l("div", S, [
          t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the model its profile names when that model is ticked. A model that is not ticked is refused, and you name another with --model.", -1)),
          d.value ? (c(), b("p", V, i(d.value), 1)) : x("", !0),
          y(r(A), {
            rows: r(s),
            failure: r(u),
            loaded: r(_),
            empty: "No agent programs",
            hint: "Available agent programs and their models appear here."
          }, {
            default: m(({ row: e }) => [
              l("div", {
                class: "worker-model",
                "data-worker-model": e.id
              }, [
                l("span", B, i(h.value.has(e.id) ? e.title : ""), 1),
                l("label", D, [
                  l("input", {
                    type: "checkbox",
                    checked: e.allowed,
                    disabled: n(e),
                    title: n(e) ? "Keep at least one model enabled" : "",
                    onChange: (a) => k(e)
                  }, null, 40, M),
                  L(" " + i(e.model), 1)
                ])
              ], 8, j)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, q = /* @__PURE__ */ E(R, [["__scopeId", "data-v-f2e1dbd2"]]);
export {
  q as default
};
