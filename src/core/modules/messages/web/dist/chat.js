/* @code-commandments-generated */
if (!document.getElementById("window-styles-9609edefbbeb")) { const style = document.createElement("style"); style.id = "window-styles-9609edefbbeb"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-320539ca]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-320539ca]{flex:1;min-height:0;overflow-y:auto}.history[data-v-320539ca] .row-list-row{padding:1px 8px}.history[data-v-320539ca] .mark.w-event{color:var(--text-3)}.notices[data-v-320539ca]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-320539ca]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-320539ca]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-320539ca]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-320539ca]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-320539ca]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-320539ca]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-320539ca]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-320539ca]{background:var(--text-4)}.jump-holder[data-v-320539ca]{position:relative;flex:none;height:0}.jump[data-v-320539ca]{position:absolute;z-index:2;bottom:8px;left:50%;padding:4px 12px;border:1px solid var(--border-2);border-radius:13px;background:var(--raised);color:var(--text-2);font:inherit;font-size:12px;cursor:pointer;transform:translate(-50%)}.jump[data-v-320539ca]:hover{color:var(--text)}.jump.hidden[data-v-320539ca]{visibility:hidden}.composer[data-v-320539ca]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-320539ca]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-320539ca]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-320539ca]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-320539ca]{border-color:var(--accent)}.attached[data-v-320539ca]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-320539ca]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-320539ca]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-320539ca]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-320539ca]{color:var(--text-3)}.composer-send[data-v-320539ca]{margin-left:auto}.composer-failure[data-v-320539ca]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as s, openBlock as n, createElementBlock as p, withModifiers as D, withDirectives as ve, createElementVNode as l, vModelText as me, toDisplayString as C, createCommentVNode as x, createVNode as h, unref as o, withCtx as E, createTextVNode as V, computed as R, onMounted as Te, onUnmounted as $e, nextTick as Y, watch as ce, Fragment as de, renderList as pe, createBlock as H, normalizeClass as P, withKeys as Me } from "vue";
import { Btn as z, useRows as A, shownMarks as Se, markDeclaration as Fe, interleaved as Oe, fetchMarkDeclarations as Re, fetchDockDeclarations as He, SHORT_CHAT as Ae, Icon as Z, RowList as Ee, MarkHost as Be, MessageCard as Ie, RunningCommand as Ne, DockStack as je, dockOpening as Pe } from "@journal/window-kit";
const fe = (T, _) => {
  const y = T.__vccOpts || T;
  for (const [w, m] of _)
    y[w] = m;
  return y;
}, Ve = {
  key: 0,
  class: "dump-files"
}, ze = { class: "dump-row" }, Le = {
  key: 1,
  class: "dump-failure"
}, Ke = 60, Ue = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(T, { emit: _ }) {
    const y = _, w = T, m = s(""), f = s([]), k = s(""), $ = () => [...m.value.split(/\n\s*\n/).map((u) => u.trim()).filter(Boolean), ...f.value.map((u) => `${u.name}: ${u.text.trim()}`)], L = () => ($()[0] ?? "").replace(/\s+/g, " ").slice(0, Ke);
    async function K(u) {
      var v;
      const r = [...((v = u.dataTransfer) == null ? void 0 : v.files) ?? []];
      f.value = [...f.value, ...await Promise.all(r.map(async (g) => ({ name: g.name, text: await g.text() })))];
    }
    async function B() {
      const u = await w.run(["dump", "make", L(), "--parts", $().join(" | ")]);
      k.value = u.ok ? "" : u.error, u.ok && (m.value = "", f.value = [], y("made"));
    }
    return (u, r) => (n(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: D(B, ["prevent"]),
      onDragover: r[2] || (r[2] = D(() => {
      }, ["prevent"])),
      onDrop: D(K, ["prevent"])
    }, [
      ve(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (v) => m.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [me, m.value]
      ]),
      f.value.length ? (n(), p("p", Ve, C(f.value.map((v) => v.name).join(", ")), 1)) : x("", !0),
      l("div", ze, [
        h(o(z), {
          kind: "primary",
          small: "",
          disabled: !$().length,
          "data-dump-make": "",
          onClick: B
        }, {
          default: E(() => [...r[3] || (r[3] = [
            V("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(o(z), {
          small: "",
          onClick: r[1] || (r[1] = (v) => y("close"))
        }, {
          default: E(() => [...r[4] || (r[4] = [
            V("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      k.value ? (n(), p("p", Le, C(k.value), 1)) : x("", !0)
    ], 32));
  }
}, qe = /* @__PURE__ */ fe(Ue, [["__scopeId", "data-v-d2c5a833"]]), We = {
  "data-notices": "",
  class: "notices"
}, Xe = { class: "notice-text" }, Ge = ["href", "target"], Je = ["onClick"], Qe = { class: "running-strip" }, Ye = { class: "jump-holder" }, Ze = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, et = ["title"], tt = {
  key: 0,
  class: "attached-wait"
}, at = ["onClick"], lt = { class: "composer-row" }, ot = {
  key: 1,
  class: "composer-failure"
}, st = 180, nt = 2e3, rt = 40, it = {
  __name: "Chat",
  setup(T) {
    const { rows: _, failure: y, loaded: w, load: m, older: f, context: k } = A("message list", ["message.*"], { incremental: !0 }), { rows: $, older: L } = A("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: K } = A("dock-item list", ["dock_item.*"]), { rows: B, act: u } = A("notice list", ["notice.*"]), { rows: r } = A("hook-call list --limit 10", ["hook_call.*"]), v = R(() => Se($.value, Fe, (e) => k.option(e).value)), g = s([]), ke = R(() => g.value.filter((e) => !_.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - nt))), ee = R(() => Oe([..._.value, ...ke.value], v.value)), te = R(() => {
      const e = r.value.find((t) => ["pre_tool_use", "stop", "prompt", "session_start"].includes(t.hook));
      return (e == null ? void 0 : e.hook) === "pre_tool_use" ? [e.tool, e.summary].filter(Boolean).join(" ") : "";
    }), U = s(null), q = s(!0), ae = s(!1);
    let le = 0, M = !0, W = 0, S = null;
    Te(() => {
      X(), Promise.all([Re(), He()]), U.value && typeof ResizeObserver < "u" && (S = new ResizeObserver(([e]) => ae.value = e.contentRect.height < Ae), S.observe(U.value));
    }), $e(() => {
      S == null || S.disconnect(), clearTimeout(W);
    });
    const b = s(""), I = s(""), i = s(null), oe = s(!0), se = s(!1), N = s(0), F = s(!1), c = s([]), ne = s(null), re = s(null), X = () => Y(() => {
      var e;
      return (e = re.value) == null ? void 0 : e.focus();
    }), j = s(!1);
    async function G(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        c.value = [...c.value, a];
        const d = await k.upload(t);
        a.pending = d.ok ? d.value : "", a.failure = d.ok ? "" : d.error, c.value = [...c.value];
      }
      X();
    }
    const ge = (e) => {
      G([...e.target.files]), e.target.value = "";
    }, he = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), G(t));
    }, _e = (e) => {
      var t;
      j.value = !1, G([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, ye = (e) => c.value = c.value.filter((t) => t !== e), ie = R(() => (b.value.trim() || c.value.length) && c.value.every((e) => e.pending));
    async function J() {
      const e = { text: b.value, attached: c.value }, t = e.attached.flatMap((O) => ["--file", O.pending]), a = e.text || e.attached.map((O) => O.name).join(", "), d = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      g.value = [...g.value, d], b.value = "", c.value = [], I.value = "", X();
      const ue = await k.run(["message", "send", a, ...t]);
      ue.ok || (I.value = ue.error, b.value = e.text, c.value = e.attached), g.value = g.value.filter((O) => O !== d), await m();
    }
    const we = (e) => !e.shiftKey && (e.preventDefault(), ie.value && J());
    let Q = !1;
    async function Ce() {
      if (Q || !w.value) return;
      Q = !0;
      const e = i.value.scrollHeight, [t, a] = await Promise.all([f(), L()]);
      (t || a) && (await Y(), i.value.scrollTop += i.value.scrollHeight - e), Q = !1;
    }
    function be() {
      if (oe.value = !i.value || i.value.scrollTop < 8, oe.value && i.value && Ce(), !i.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = i.value;
      M = t - e - a < rt, se.value = !M, M && (N.value = 0);
      const d = Pe({ top: e, before: le, height: t, shown: a });
      le = e, d !== null && (clearTimeout(W), d ? q.value = !0 : W = setTimeout(() => q.value = !1, st));
    }
    ce(() => {
      var e;
      return (e = _.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !M && (N.value += 1);
    }), ce([ee, w], async () => {
      await Y(), M && i.value && (i.value.scrollTop = i.value.scrollHeight);
    });
    const xe = () => {
      var e;
      return (e = i.value) == null ? void 0 : e.scrollTo({ top: i.value.scrollHeight, behavior: "smooth" });
    }, De = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), p("div", {
      ref_key: "chat",
      ref: U,
      class: "chat"
    }, [
      l("div", We, [
        (n(!0), p(de, null, pe(o(B), (a) => (n(), p("div", {
          key: a.id,
          class: "notice"
        }, [
          t[7] || (t[7] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", Xe, C(a.title), 1),
          l("a", {
            class: "notice-link",
            href: De(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, C(a.label), 9, Ge),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (d) => o(u)(["notice", "close", String(a.id)])
          }, [
            h(o(Z), {
              name: "close",
              size: 12
            })
          ], 8, Je)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: i,
        class: "history",
        onScroll: be
      }, [
        h(o(Ee), {
          rows: ee.value,
          failure: o(y),
          loaded: o(w),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: E(({ row: a }) => [
            a.kind === "mark" ? (n(), H(o(Be), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), H(o(Ie), {
              key: 1,
              message: a.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("p", Qe, [
        l("span", {
          class: P(["running-dot", { idle: !te.value }])
        }, null, 2),
        h(o(Ne), {
          text: te.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      l("div", Ye, [
        l("button", {
          type: "button",
          "data-scroll-foot": "",
          class: P(["jump", { hidden: !se.value }]),
          onClick: xe
        }, C(N.value ? `${N.value} new` : "Newest"), 3)
      ]),
      h(o(je), {
        items: o(K),
        folded: ae.value || !q.value
      }, null, 8, ["items", "folded"]),
      F.value ? (n(), H(qe, {
        key: 0,
        run: o(k).run,
        onMade: t[0] || (t[0] = (a) => F.value = !1),
        onClose: t[1] || (t[1] = (a) => F.value = !1)
      }, null, 8, ["run"])) : x("", !0),
      l("form", {
        class: P(["composer", { dragging: j.value }]),
        onSubmit: D(J, ["prevent"]),
        onDragover: t[5] || (t[5] = D((a) => j.value = !0, ["prevent"])),
        onDragleave: t[6] || (t[6] = (a) => j.value = !1),
        onDrop: D(_e, ["prevent"])
      }, [
        c.value.length ? (n(), p("ul", Ze, [
          (n(!0), p(de, null, pe(c.value, (a) => (n(), p("li", {
            key: a.name + a.pending,
            class: P(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, C(a.name), 1),
            !a.pending && !a.failure ? (n(), p("span", tt, "sending")) : x("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (d) => ye(a)
            }, [
              h(o(Z), {
                name: "close",
                size: 10
              })
            ], 8, at)
          ], 10, et))), 128))
        ])) : x("", !0),
        ve(l("textarea", {
          ref_key: "composerInput",
          ref: re,
          "onUpdate:modelValue": t[2] || (t[2] = (a) => b.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: Me(we, ["enter"]),
          onPaste: he
        }, null, 544), [
          [me, b.value]
        ]),
        l("div", lt, [
          l("input", {
            ref_key: "picker",
            ref: ne,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: ge
          }, null, 544),
          l("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[3] || (t[3] = (a) => ne.value.click())
          }, [
            h(o(Z), {
              name: "clip",
              size: 16
            })
          ]),
          ie.value ? (n(), H(o(z), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: J
          }, {
            default: E(() => [...t[8] || (t[8] = [
              V("Send", -1)
            ])]),
            _: 1
          })) : (n(), H(o(z), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[4] || (t[4] = (a) => F.value = !F.value)
          }, {
            default: E(() => [...t[9] || (t[9] = [
              V("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      I.value ? (n(), p("p", ot, C(I.value), 1)) : x("", !0)
    ], 512));
  }
}, dt = /* @__PURE__ */ fe(it, [["__scopeId", "data-v-320539ca"]]);
export {
  dt as default
};
