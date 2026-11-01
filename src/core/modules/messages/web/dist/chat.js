/* @code-commandments-generated */
if (!document.getElementById("window-styles-b7a484bc28e6")) { const style = document.createElement("style"); style.id = "window-styles-b7a484bc28e6"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-1c7f5db5]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-1c7f5db5]{flex:1;min-height:0;overflow-y:auto}.history[data-v-1c7f5db5] .row-list-row{padding:1px 8px}.history[data-v-1c7f5db5] .mark.w-event{color:var(--text-3)}.notices[data-v-1c7f5db5]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-1c7f5db5]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-1c7f5db5]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-1c7f5db5]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-1c7f5db5]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-1c7f5db5]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-1c7f5db5]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-1c7f5db5]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-1c7f5db5]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-1c7f5db5]{visibility:hidden}.composer[data-v-1c7f5db5]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-1c7f5db5]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-1c7f5db5]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-1c7f5db5]{border:0;background:none;color:var(--text-3)}.composer-send[data-v-1c7f5db5]{margin-left:auto}.composer-failure[data-v-1c7f5db5]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as r, createElementBlock as m, withModifiers as F, withDirectives as q, createElementVNode as a, vModelText as W, toDisplayString as g, createCommentVNode as $, createVNode as v, unref as s, withCtx as R, createTextVNode as O, computed as K, onMounted as Z, onUnmounted as ee, Fragment as te, renderList as oe, createBlock as M, normalizeClass as se, withKeys as le } from "vue";
import { Btn as A, useRows as S, shownMarks as ae, markDeclaration as ne, interleaved as re, fetchMarkDeclarations as ie, fetchDockDeclarations as ue, SHORT_CHAT as ce, Icon as L, RowList as de, MarkHost as me, MessageCard as pe, DockStack as ve, dockOpening as fe } from "@journal/window-kit";
const G = (_, y) => {
  const p = _.__vccOpts || _;
  for (const [w, d] of y)
    p[w] = d;
  return p;
}, ke = {
  key: 0,
  class: "dump-files"
}, he = { class: "dump-row" }, ge = {
  key: 1,
  class: "dump-failure"
}, _e = 60, ye = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(_, { emit: y }) {
    const p = y, w = _, d = i(""), u = i([]), b = i(""), C = () => [...d.value.split(/\n\s*\n/).map((n) => n.trim()).filter(Boolean), ...u.value.map((n) => `${n.name}: ${n.text.trim()}`)], B = () => (C()[0] ?? "").replace(/\s+/g, " ").slice(0, _e);
    async function E(n) {
      var c;
      const l = [...((c = n.dataTransfer) == null ? void 0 : c.files) ?? []];
      u.value = [...u.value, ...await Promise.all(l.map(async (f) => ({ name: f.name, text: await f.text() })))];
    }
    async function T() {
      const n = await w.run(["dump", "make", B(), "--parts", C().join(" | ")]);
      b.value = n.ok ? "" : n.error, n.ok && (d.value = "", u.value = [], p("made"));
    }
    return (n, l) => (r(), m("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(T, ["prevent"]),
      onDragover: l[2] || (l[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(E, ["prevent"])
    }, [
      q(a("textarea", {
        "onUpdate:modelValue": l[0] || (l[0] = (c) => d.value = c),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [W, d.value]
      ]),
      u.value.length ? (r(), m("p", ke, g(u.value.map((c) => c.name).join(", ")), 1)) : $("", !0),
      a("div", he, [
        v(s(A), {
          kind: "primary",
          small: "",
          disabled: !C().length,
          "data-dump-make": "",
          onClick: T
        }, {
          default: R(() => [...l[3] || (l[3] = [
            O("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(s(A), {
          small: "",
          onClick: l[1] || (l[1] = (c) => p("close"))
        }, {
          default: R(() => [...l[4] || (l[4] = [
            O("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      b.value ? (r(), m("p", ge, g(b.value), 1)) : $("", !0)
    ], 32));
  }
}, we = /* @__PURE__ */ G(ye, [["__scopeId", "data-v-d2c5a833"]]), be = {
  "data-notices": "",
  class: "notices"
}, Ce = { class: "notice-text" }, Te = ["href", "target"], xe = ["onClick"], De = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Me = { class: "composer-row" }, Se = {
  type: "button",
  "data-attach": "",
  class: "composer-attach",
  disabled: "",
  title: "A message holds text only, so there is nothing to attach a file to; Dump files takes files",
  "aria-label": "Attach a file"
}, $e = {
  key: 1,
  class: "composer-failure"
}, Re = 180, Oe = {
  __name: "Chat",
  setup(_) {
    const { rows: y, failure: p, loaded: w, load: d, context: u } = S("message list", ["message.*"]), { rows: b } = S("chat-mark list", ["chat_mark.*"]), { rows: C } = S("dock-item list", ["dock_item.*"]), { rows: B, act: E } = S("notice list", ["notice.*"]), { rows: T } = S("hook-call list --limit 1", ["hook_call.*"]), n = K(() => ae(b.value, ne, (e) => u.option(e).value)), l = K(() => re(y.value, n.value)), c = K(() => {
      var e;
      return ((e = T.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? T.value[0].tool : "";
    }), f = i(null), H = i(!0), P = i(!1);
    let U = 0, N = 0, x = null;
    Z(() => {
      Promise.all([ie(), ue()]), f.value && typeof ResizeObserver < "u" && (x = new ResizeObserver(([e]) => P.value = e.contentRect.height < ce), x.observe(f.value));
    }), ee(() => {
      x == null || x.disconnect(), clearTimeout(N);
    });
    const k = i(""), V = i(""), h = i(null), j = i(!0), D = i(!1);
    async function z() {
      const e = await u.run(["message", "send", k.value]);
      V.value = e.ok ? "" : e.error, e.ok && (k.value = ""), d();
    }
    const J = (e) => !e.shiftKey && (e.preventDefault(), k.value.trim() && z());
    function Q() {
      if (j.value = !h.value || h.value.scrollTop < 8, !h.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: o } = h.value, I = fe({ top: e, before: U, height: t, shown: o });
      U = e, I !== null && (clearTimeout(N), I ? H.value = !0 : N = setTimeout(() => H.value = !1, Re));
    }
    const X = () => {
      var e;
      return (e = h.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, Y = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (r(), m("div", {
      ref_key: "chat",
      ref: f,
      class: "chat"
    }, [
      a("div", be, [
        (r(!0), m(te, null, oe(s(B), (o) => (r(), m("div", {
          key: o.id,
          class: "notice"
        }, [
          t[4] || (t[4] = a("span", { class: "notice-dot" }, null, -1)),
          a("span", Ce, g(o.title), 1),
          a("a", {
            class: "notice-link",
            href: Y(o),
            target: o.link.startsWith("http") ? "_blank" : void 0
          }, g(o.label), 9, Te),
          a("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (I) => s(E)(["notice", "close", String(o.id)])
          }, [
            v(s(L), {
              name: "close",
              size: 12
            })
          ], 8, xe)
        ]))), 128))
      ]),
      a("div", {
        ref_key: "scroller",
        ref: h,
        class: "history",
        onScroll: Q
      }, [
        v(s(de), {
          rows: l.value,
          failure: s(p),
          loaded: s(w),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: R(({ row: o }) => [
            o.kind === "mark" ? (r(), M(s(me), {
              key: 0,
              mark: o.row
            }, null, 8, ["mark"])) : (r(), M(s(pe), {
              key: 1,
              message: o.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        c.value ? (r(), m("p", De, [
          t[5] || (t[5] = a("span", { class: "running-dot" }, null, -1)),
          O(g(c.value), 1)
        ])) : $("", !0)
      ], 544),
      a("button", {
        type: "button",
        "data-scroll-top": "",
        class: se(["scroll-top", { hidden: j.value }]),
        "aria-label": "Scroll to the top",
        onClick: X
      }, [
        v(s(L), {
          name: "up",
          size: 14
        })
      ], 2),
      v(s(ve), {
        items: s(C),
        folded: P.value || !H.value
      }, null, 8, ["items", "folded"]),
      D.value ? (r(), M(we, {
        key: 0,
        run: s(u).run,
        onMade: t[0] || (t[0] = (o) => D.value = !1),
        onClose: t[1] || (t[1] = (o) => D.value = !1)
      }, null, 8, ["run"])) : $("", !0),
      a("form", {
        class: "composer",
        onSubmit: F(z, ["prevent"])
      }, [
        q(a("textarea", {
          "onUpdate:modelValue": t[2] || (t[2] = (o) => k.value = o),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: le(J, ["enter"])
        }, null, 544), [
          [W, k.value]
        ]),
        a("div", Me, [
          a("button", Se, [
            v(s(L), {
              name: "clip",
              size: 16
            })
          ]),
          k.value.trim() ? (r(), M(s(A), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: z
          }, {
            default: R(() => [...t[6] || (t[6] = [
              O("Send", -1)
            ])]),
            _: 1
          })) : (r(), M(s(A), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[3] || (t[3] = (o) => D.value = !D.value)
          }, {
            default: R(() => [...t[7] || (t[7] = [
              O("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 32),
      V.value ? (r(), m("p", $e, g(V.value), 1)) : $("", !0)
    ], 512));
  }
}, Be = /* @__PURE__ */ G(Oe, [["__scopeId", "data-v-1c7f5db5"]]);
export {
  Be as default
};
