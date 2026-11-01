/* @code-commandments-generated */
if (!document.getElementById("window-styles-a015c4df640c")) { const style = document.createElement("style"); style.id = "window-styles-a015c4df640c"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-1ee4fe55]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-1ee4fe55]{flex:1;min-height:0;overflow-y:auto}.history[data-v-1ee4fe55] .row-list-row{padding:1px 8px}.history[data-v-1ee4fe55] .mark.w-event{color:var(--text-3)}.notices[data-v-1ee4fe55]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-1ee4fe55]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-1ee4fe55]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-1ee4fe55]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-1ee4fe55]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-1ee4fe55]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-1ee4fe55]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-1ee4fe55]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-1ee4fe55]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-1ee4fe55]{visibility:hidden}.composer[data-v-1ee4fe55]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-1ee4fe55]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-1ee4fe55]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-1ee4fe55]{border:0;background:none;color:var(--text-3)}.composer-send[data-v-1ee4fe55]{margin-left:auto}.composer-failure[data-v-1ee4fe55]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as r, createElementBlock as p, withModifiers as R, withDirectives as W, createElementVNode as a, vModelText as X, toDisplayString as _, createCommentVNode as $, createVNode as f, unref as s, withCtx as O, createTextVNode as F, computed as L, onMounted as ee, onUnmounted as te, watch as oe, nextTick as se, Fragment as le, renderList as ae, createBlock as S, normalizeClass as ne, withKeys as re } from "vue";
import { Btn as E, useRows as M, shownMarks as ie, markDeclaration as ue, interleaved as ce, fetchMarkDeclarations as de, fetchDockDeclarations as me, SHORT_CHAT as pe, Icon as P, RowList as ve, MarkHost as fe, MessageCard as ke, DockStack as he, dockOpening as ge } from "@journal/window-kit";
const G = (y, w) => {
  const v = y.__vccOpts || y;
  for (const [k, m] of w)
    v[k] = m;
  return v;
}, _e = {
  key: 0,
  class: "dump-files"
}, ye = { class: "dump-row" }, we = {
  key: 1,
  class: "dump-failure"
}, be = 60, Te = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(y, { emit: w }) {
    const v = w, k = y, m = i(""), u = i([]), b = i(""), T = () => [...m.value.split(/\n\s*\n/).map((n) => n.trim()).filter(Boolean), ...u.value.map((n) => `${n.name}: ${n.text.trim()}`)], H = () => (T()[0] ?? "").replace(/\s+/g, " ").slice(0, be);
    async function A(n) {
      var c;
      const l = [...((c = n.dataTransfer) == null ? void 0 : c.files) ?? []];
      u.value = [...u.value, ...await Promise.all(l.map(async (h) => ({ name: h.name, text: await h.text() })))];
    }
    async function C() {
      const n = await k.run(["dump", "make", H(), "--parts", T().join(" | ")]);
      b.value = n.ok ? "" : n.error, n.ok && (m.value = "", u.value = [], v("made"));
    }
    return (n, l) => (r(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: R(C, ["prevent"]),
      onDragover: l[2] || (l[2] = R(() => {
      }, ["prevent"])),
      onDrop: R(A, ["prevent"])
    }, [
      W(a("textarea", {
        "onUpdate:modelValue": l[0] || (l[0] = (c) => m.value = c),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [X, m.value]
      ]),
      u.value.length ? (r(), p("p", _e, _(u.value.map((c) => c.name).join(", ")), 1)) : $("", !0),
      a("div", ye, [
        f(s(E), {
          kind: "primary",
          small: "",
          disabled: !T().length,
          "data-dump-make": "",
          onClick: C
        }, {
          default: O(() => [...l[3] || (l[3] = [
            F("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(s(E), {
          small: "",
          onClick: l[1] || (l[1] = (c) => v("close"))
        }, {
          default: O(() => [...l[4] || (l[4] = [
            F("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      b.value ? (r(), p("p", we, _(b.value), 1)) : $("", !0)
    ], 32));
  }
}, Ce = /* @__PURE__ */ G(Te, [["__scopeId", "data-v-d2c5a833"]]), xe = {
  "data-notices": "",
  class: "notices"
}, De = { class: "notice-text" }, Se = ["href", "target"], Me = ["onClick"], $e = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Oe = { class: "composer-row" }, Fe = {
  type: "button",
  "data-attach": "",
  class: "composer-attach",
  disabled: "",
  title: "A message holds text only, so there is nothing to attach a file to; Dump files takes files",
  "aria-label": "Attach a file"
}, Re = {
  key: 1,
  class: "composer-failure"
}, Ee = 180, He = 40, Ae = {
  __name: "Chat",
  setup(y) {
    const { rows: w, failure: v, loaded: k, load: m, context: u } = M("message list", ["message.*"]), { rows: b } = M("chat-mark list", ["chat_mark.*"]), { rows: T } = M("dock-item list", ["dock_item.*"]), { rows: H, act: A } = M("notice list", ["notice.*"]), { rows: C } = M("hook-call list --limit 1", ["hook_call.*"]), n = L(() => ie(b.value, ue, (e) => u.option(e).value)), l = L(() => ce(w.value, n.value)), c = L(() => {
      var e;
      return ((e = C.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? C.value[0].tool : "";
    }), h = i(null), B = i(!0), K = i(!1);
    let U = 0, j = !0, N = 0, x = null;
    ee(() => {
      Promise.all([de(), me()]), h.value && typeof ResizeObserver < "u" && (x = new ResizeObserver(([e]) => K.value = e.contentRect.height < pe), x.observe(h.value));
    }), te(() => {
      x == null || x.disconnect(), clearTimeout(N);
    });
    const g = i(""), V = i(""), d = i(null), q = i(!0), D = i(!1);
    async function z() {
      const e = await u.run(["message", "send", g.value]);
      V.value = e.ok ? "" : e.error, e.ok && (g.value = ""), m();
    }
    const J = (e) => !e.shiftKey && (e.preventDefault(), g.value.trim() && z());
    function Q() {
      if (q.value = !d.value || d.value.scrollTop < 8, !d.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: o } = d.value;
      j = t - e - o < He;
      const I = ge({ top: e, before: U, height: t, shown: o });
      U = e, I !== null && (clearTimeout(N), I ? B.value = !0 : N = setTimeout(() => B.value = !1, Ee));
    }
    oe([l, k], async () => {
      await se(), j && d.value && (d.value.scrollTop = d.value.scrollHeight);
    });
    const Y = () => {
      var e;
      return (e = d.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, Z = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (r(), p("div", {
      ref_key: "chat",
      ref: h,
      class: "chat"
    }, [
      a("div", xe, [
        (r(!0), p(le, null, ae(s(H), (o) => (r(), p("div", {
          key: o.id,
          class: "notice"
        }, [
          t[4] || (t[4] = a("span", { class: "notice-dot" }, null, -1)),
          a("span", De, _(o.title), 1),
          a("a", {
            class: "notice-link",
            href: Z(o),
            target: o.link.startsWith("http") ? "_blank" : void 0
          }, _(o.label), 9, Se),
          a("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (I) => s(A)(["notice", "close", String(o.id)])
          }, [
            f(s(P), {
              name: "close",
              size: 12
            })
          ], 8, Me)
        ]))), 128))
      ]),
      a("div", {
        ref_key: "scroller",
        ref: d,
        class: "history",
        onScroll: Q
      }, [
        f(s(ve), {
          rows: l.value,
          failure: s(v),
          loaded: s(k),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: O(({ row: o }) => [
            o.kind === "mark" ? (r(), S(s(fe), {
              key: 0,
              mark: o.row
            }, null, 8, ["mark"])) : (r(), S(s(ke), {
              key: 1,
              message: o.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        c.value ? (r(), p("p", $e, [
          t[5] || (t[5] = a("span", { class: "running-dot" }, null, -1)),
          F(_(c.value), 1)
        ])) : $("", !0)
      ], 544),
      a("button", {
        type: "button",
        "data-scroll-top": "",
        class: ne(["scroll-top", { hidden: q.value }]),
        "aria-label": "Scroll to the top",
        onClick: Y
      }, [
        f(s(P), {
          name: "up",
          size: 14
        })
      ], 2),
      f(s(he), {
        items: s(T),
        folded: K.value || !B.value
      }, null, 8, ["items", "folded"]),
      D.value ? (r(), S(Ce, {
        key: 0,
        run: s(u).run,
        onMade: t[0] || (t[0] = (o) => D.value = !1),
        onClose: t[1] || (t[1] = (o) => D.value = !1)
      }, null, 8, ["run"])) : $("", !0),
      a("form", {
        class: "composer",
        onSubmit: R(z, ["prevent"])
      }, [
        W(a("textarea", {
          "onUpdate:modelValue": t[2] || (t[2] = (o) => g.value = o),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: re(J, ["enter"])
        }, null, 544), [
          [X, g.value]
        ]),
        a("div", Oe, [
          a("button", Fe, [
            f(s(P), {
              name: "clip",
              size: 16
            })
          ]),
          g.value.trim() ? (r(), S(s(E), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: z
          }, {
            default: O(() => [...t[6] || (t[6] = [
              F("Send", -1)
            ])]),
            _: 1
          })) : (r(), S(s(E), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[3] || (t[3] = (o) => D.value = !D.value)
          }, {
            default: O(() => [...t[7] || (t[7] = [
              F("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 32),
      V.value ? (r(), p("p", Re, _(V.value), 1)) : $("", !0)
    ], 512));
  }
}, Ve = /* @__PURE__ */ G(Ae, [["__scopeId", "data-v-1ee4fe55"]]);
export {
  Ve as default
};
