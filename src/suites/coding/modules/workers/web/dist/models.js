/* @code-commandments-generated */
if (!document.getElementById("window-styles-03de2fe40d59")) { const style = document.createElement("style"); style.id = "window-styles-03de2fe40d59"; style.textContent = ".worker-models[data-v-8506c219]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-8506c219]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-8506c219]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-8506c219]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-8506c219]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-8506c219]{display:flex;gap:8px;align-items:center}.number[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-6eb6af04]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-a11fd403]{flex:1}.note[data-v-a11fd403]{color:var(--text-3);font-size:12px}.worker-moment[data-v-826dfb51]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-826dfb51]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-62d088fe]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-62d088fe]{display:flex;align-items:center;gap:8px}input[data-v-62d088fe]{min-width:0;flex:1}output[data-v-62d088fe]{min-width:36px;text-align:right}small[data-v-62d088fe]{color:var(--text-3)}p[data-v-62d088fe]{margin:0}.actions[data-v-62d088fe]{display:flex;gap:6px}.route[data-v-3d35bb1a]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-3d35bb1a]{margin:0}small[data-v-3d35bb1a]{color:var(--text-3)}.actions[data-v-3d35bb1a]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-1c28c310]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-1c28c310]{margin:0}label[data-v-1c28c310]{display:flex;align-items:center;gap:8px}select[data-v-1c28c310],input[type=number][data-v-1c28c310]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-079b94a1]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-079b94a1]{display:flex;gap:8px}input[data-v-079b94a1]{min-width:0;flex:1}.split[data-v-793964c0]{display:flex;flex-direction:column;gap:8px}p[data-v-793964c0],h3[data-v-793964c0]{margin:0}p[data-v-793964c0]{color:var(--text-3);font-size:12px}h3[data-v-793964c0]{margin-top:12px;font-size:13px}label[data-v-793964c0]{display:flex;align-items:center;gap:8px}input[data-v-793964c0]{width:54px}[role=alert][data-v-793964c0]{color:var(--danger)}.worker-tab-body[data-v-f8b83cb6]{padding:14px 16px}.worktree[data-v-158c53fa]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-158c53fa]{flex:1;min-width:0}.worktree-holder[data-v-158c53fa]{font-weight:500}.worktree-folder[data-v-158c53fa]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-158c53fa]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as w, computed as g, openBlock as c, createBlock as v, unref as r, withCtx as m, createElementVNode as l, createElementBlock as b, toDisplayString as i, createCommentVNode as x, createVNode as y, createTextVNode as L } from "vue";
import { useWindow as N, WindowRoom as W, RowList as A, patched as C } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const S = { class: "worker-models" }, V = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, j = ["data-worker-model"], B = { class: "worker-model-program" }, D = { class: "worker-model-name" }, M = ["checked", "disabled", "title", "onChange"], O = "journal.core.helpers.allowed-models", R = {
  __name: "WorkerModels",
  setup(I) {
    const p = N(), { rows: s, failure: u, loaded: _, act: h } = p.props.models, d = w(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, f = g(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function k(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await h(["setting", "set", O, t.join(","), "--project"], C(o.id, { allowed: !o.allowed }));
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
                l("span", B, i(f.value.has(e.id) ? e.title : ""), 1),
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
}, q = /* @__PURE__ */ E(R, [["__scopeId", "data-v-8506c219"]]);
export {
  q as default
};
