/* @code-commandments-generated */
if (!document.getElementById("window-styles-5d8af9c9ee85")) { const style = document.createElement("style"); style.id = "window-styles-5d8af9c9ee85"; style.textContent = ".output-dock-more[data-v-18d9c7ba]{display:grid;grid-template-rows:1fr;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-18d9c7ba]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-18d9c7ba]{min-height:0;overflow:hidden}.output-dock-state[data-v-18d9c7ba]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-label[data-v-18d9c7ba]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-ring[data-v-18d9c7ba]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-18d9c7ba .9s linear infinite}@keyframes output-spin-18d9c7ba{to{transform:rotate(360deg)}}.output-dock-title[data-v-18d9c7ba]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-18d9c7ba]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-18d9c7ba]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-18d9c7ba]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-18d9c7ba]{height:100%;transition:width .4s ease}.output[data-v-97d5a832]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-97d5a832]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-97d5a832]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-97d5a832]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-97d5a832]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-4486ac26]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-4486ac26]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-4486ac26],.state.lost[data-v-4486ac26]{color:var(--red, #d4574b)}.line[data-v-4486ac26]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-4486ac26]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as M, computed as u, unref as a, watch as G, openBlock as d, createElementBlock as S, createBlock as g, Teleport as y, createElementVNode as n, normalizeStyle as C, toDisplayString as f, createCommentVNode as k, createTextVNode as R, nextTick as X } from "vue";
import { useWindow as q, useOutputPages as J, useNow as K, usePoll as Q, Icon as U } from "@journal/window-kit";
import { _ as Y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Z = {
  class: "output-dock",
  "data-output-dock": ""
}, tt = ["data-state"], et = {
  key: 0,
  class: "output-dock-ring"
}, ot = ["title"], at = ["data-figure-bar", "data-figure-began"], st = ["data-figure-progress"], nt = { "data-output-steps": "" }, lt = { class: "output-dock-figure" }, ut = { class: "output-dock-more" }, rt = { class: "output-dock-inner" }, dt = 2e3, it = 5e3, ct = 24, pt = {
  __name: "OutputDock",
  setup(vt) {
    const N = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--danger)", stopped: "var(--text-3)" }, P = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, B = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, l = q(), m = l.option("row"), p = l.option("head"), D = l.option("foot"), O = l.option("time"), H = l.option("folded"), e = M(null), h = J((t) => l.read(t.join(" ")), () => {
      var t;
      return (t = m.value) == null ? void 0 : t.target_id;
    }), V = h.lines, w = u(() => !a(H)), i = M(null), j = K(), r = u(() => {
      var t;
      return B[(t = e.value) == null ? void 0 : t.state] ?? "running";
    }), E = () => r.value === "running", v = u(() => r.value !== "running"), x = u(() => {
      var t;
      return Number(((t = e.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), z = u(() => v.value ? "100%" : `${Math.round(x.value * 100)}%`), F = u(() => {
      var t;
      return (t = e.value) != null && t.created_at ? Date.parse(e.value.created_at) / 1e3 : 0;
    }), I = u(() => {
      var t, o;
      return !((t = e.value) != null && t.steps_passed) && !((o = e.value) != null && o.steps_failed) ? "" : e.value.steps_failed ? `${e.value.steps_passed} passed, ${e.value.steps_failed} failed` : `${e.value.steps_passed} passed`;
    }), W = u(() => {
      var s;
      if (!((s = e.value) != null && s.created_at)) return "";
      const t = e.value.ended_at ? Date.parse(e.value.ended_at) : j.value, o = Math.max(0, Math.round((t - Date.parse(e.value.created_at)) / 1e3));
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function b() {
      var c;
      const t = (c = m.value) == null ? void 0 : c.target_id;
      if (!t) return;
      const o = await l.read(`process card ${t}`);
      if (e.value = o.ok ? o.value : null, !w.value) return;
      const s = i.value, _ = !s || s.scrollHeight - s.scrollTop - s.clientHeight < ct;
      await h.follow(), await X(), _ && i.value && (i.value.scrollTop = i.value.scrollHeight);
    }
    return G(w, (t) => t && b()), l.follow(["process.*"], (t) => {
      var o;
      return t.row_id === ((o = m.value) == null ? void 0 : o.target_id) && b();
    }), Q(b, E, () => w.value ? dt : it), (t, o) => {
      var s, _, c, L, $, T;
      return d(), S("div", Z, [
        ((s = a(p)) == null ? void 0 : s.value) ?? a(p) ? (d(), g(y, {
          key: 0,
          to: ((_ = a(p)) == null ? void 0 : _.value) ?? a(p)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": r.value,
            style: C({ "--tone": N[r.value] })
          }, [
            E() ? (d(), S("span", et)) : (d(), g(a(U), {
              key: 1,
              name: P[r.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, tt),
          n("span", {
            class: "output-dock-title",
            title: ((c = e.value) == null ? void 0 : c.title) || ((L = e.value) == null ? void 0 : L.line)
          }, f((($ = e.value) == null ? void 0 : $.title) || ((T = e.value) == null ? void 0 : T.line)), 9, ot),
          x.value > 0 || v.value ? (d(), S("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": v.value ? r.value : "",
            "data-figure-began": F.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: C({ width: z.value, background: N[r.value] }),
              "data-figure-progress": v.value ? null : ""
            }, null, 12, st)
          ], 8, at)) : k("", !0)
        ], 8, ["to"])) : k("", !0),
        a(a(D)) && I.value ? (d(), g(y, {
          key: 1,
          to: a(a(D))
        }, [
          n("span", nt, [
            o[1] || (o[1] = R("Steps: ", -1)),
            n("b", null, f(I.value), 1)
          ])
        ], 8, ["to"])) : k("", !0),
        a(a(O)) ? (d(), g(y, {
          key: 2,
          to: a(a(O))
        }, [
          n("span", lt, f(W.value), 1)
        ], 8, ["to"])) : k("", !0),
        n("div", ut, [
          n("div", rt, [
            n("pre", {
              ref_key: "terminal",
              ref: i,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (A) => a(h).loadEarlier(A.target))
            }, f(a(V).join(`
`)), 545)
          ])
        ])
      ]);
    };
  }
}, kt = /* @__PURE__ */ Y(pt, [["__scopeId", "data-v-18d9c7ba"]]);
export {
  kt as default
};
