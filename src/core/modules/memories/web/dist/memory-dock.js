if (!document.getElementById("window-styles-578b9bd60f5e")) { const style = document.createElement("style"); style.id = "window-styles-578b9bd60f5e"; style.textContent = ".memory[data-v-f43e8f70]{display:flex;flex-direction:column;gap:3px;width:100%;padding:9px 0;border:0;border-bottom:1px solid var(--border-inner);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.memory:hover .memory-weight[data-v-f43e8f70]{display:inline-flex;gap:6px;align-items:center}.steps[data-v-f43e8f70]{display:inline-flex;gap:2px}.steps i[data-v-f43e8f70]{width:4px;height:8px;border-radius:1px;background:var(--border-2)}.steps i.on[data-v-f43e8f70]{background:var(--text-3)}.memory-title[data-v-f43e8f70]{color:var(--accent-text)}.memory[data-v-f43e8f70]:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.memory.removed .memory-title[data-v-f43e8f70]{color:var(--text-3)}.memory-text[data-v-f43e8f70]{max-width:74ch;color:var(--text-3);font-size:12px}.memory-meta[data-v-f43e8f70]{display:flex;flex-wrap:wrap;gap:2px 12px;color:var(--text-3);font-size:12px}@media(max-width:720px){.memory[data-v-f43e8f70]{min-height:44px}}.agent-memories[data-v-dc10c24b]{display:flex;flex-direction:column;min-width:0}.band[data-v-dc10c24b]{margin:0;padding:8px 14px 4px;color:var(--text-3);font-size:12px}.agent-memories .row[data-v-dc10c24b]{padding:8px 14px}.notice[data-v-dc10c24b]{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:12px 14px;padding:8px 11px;border:1px solid var(--border-2);border-radius:7px;color:var(--danger);font-size:12.5px}.memory-facts[data-v-09dd9f4c]{display:flex;flex-direction:column;gap:6px}.memory-none[data-v-09dd9f4c]{margin:0;color:var(--text-2);font-size:12.5px}.memory-words[data-v-09dd9f4c],.memory-add[data-v-09dd9f4c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.memory-word-input[data-v-09dd9f4c]{flex:1 1 140px}.memory-word[data-v-09dd9f4c]{display:inline-flex;gap:4px;align-items:center;padding:1px 8px;border:1px solid var(--border);border-radius:10px;font-size:12.5px}.memory-word-off[data-v-09dd9f4c]{padding:0;border:0;background:none;color:var(--text-3);cursor:pointer}.memory-refusal[data-v-09dd9f4c]{margin:0;color:var(--danger);font-size:12.5px}.task[data-v-d2a32902]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums}.failure[data-v-d2a32902]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.memory-round[data-v-4910a3d9]{margin:0 0 0 20px}.memory-round-rows[data-v-4910a3d9]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-4910a3d9]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-4910a3d9]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-4910a3d9]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { unref as e, openBlock as a, createBlock as c, Teleport as p, createElementVNode as n, createTextVNode as s, toDisplayString as l, createCommentVNode as m } from "vue";
import { useDockCard as u, useWindow as i } from "@journal/window-kit";
const g = {
  __name: "MemoryDock",
  setup(d) {
    const o = u().data, t = i().option("foot");
    return (f, r) => e(e(t)) && e(o) ? (a(), c(p, {
      key: 0,
      to: e(e(t))
    }, [
      n("span", null, [
        r[0] || (r[0] = s("Weight: ", -1)),
        n("b", null, l(e(o).weight), 1)
      ])
    ], 8, ["to"])) : m("", !0);
  }
};
export {
  g as default
};
