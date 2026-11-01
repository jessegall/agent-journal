/* @code-commandments-generated */
if (!document.getElementById("window-styles-e46adbd32c81")) { const style = document.createElement("style"); style.id = "window-styles-e46adbd32c81"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-a96c0cad]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-a96c0cad]{flex:1;min-height:0;overflow-y:auto}.history[data-v-a96c0cad] .row-list-row{padding:1px 8px}.history[data-v-a96c0cad] .mark.w-event{color:var(--text-3)}.notices[data-v-a96c0cad]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-a96c0cad]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-a96c0cad]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-a96c0cad]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-a96c0cad]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-a96c0cad]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-a96c0cad]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-a96c0cad]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-a96c0cad]{background:var(--text-4)}.jump-holder[data-v-a96c0cad]{position:relative;flex:none;height:0}.jump[data-v-a96c0cad]{position:absolute;z-index:2;bottom:8px;left:50%;padding:4px 12px;border:1px solid var(--border-2);border-radius:13px;background:var(--raised);color:var(--text-2);font:inherit;font-size:12px;cursor:pointer;transform:translate(-50%)}.jump[data-v-a96c0cad]:hover{color:var(--text)}.jump.hidden[data-v-a96c0cad]{visibility:hidden}.composer-quote[data-v-a96c0cad]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-a96c0cad]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-a96c0cad]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-a96c0cad]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-a96c0cad]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-a96c0cad]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-a96c0cad]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-a96c0cad]{border-color:var(--accent)}.attached[data-v-a96c0cad]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-a96c0cad]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-a96c0cad]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-a96c0cad]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-a96c0cad]{color:var(--text-3)}.composer-send[data-v-a96c0cad]{margin-left:auto}.composer-failure[data-v-a96c0cad]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as v, withModifiers as M, withDirectives as _e, createElementVNode as l, vModelText as ye, toDisplayString as w, createCommentVNode as T, createVNode as b, unref as s, withCtx as N, createTextVNode as K, computed as A, onMounted as Be, onUnmounted as Ie, nextTick as ae, watch as ke, Fragment as ge, renderList as he, createBlock as B, normalizeClass as z, withKeys as U } from "vue";
import { Btn as W, useRows as I, shownMarks as Ne, markDeclaration as je, interleaved as Le, fetchMarkDeclarations as Pe, fetchDockDeclarations as Ve, SHORT_CHAT as qe, Icon as le, RowList as ze, MarkHost as Ue, MessageCard as Ke, RunningCommand as We, DockStack as Xe, dockOpening as Ge } from "@journal/window-kit";
const we = (S, h) => {
  const C = S.__vccOpts || S;
  for (const [x, p] of h)
    C[x] = p;
  return C;
}, Je = {
  key: 0,
  class: "dump-files"
}, Qe = { class: "dump-row" }, Ye = {
  key: 1,
  class: "dump-failure"
}, Ze = 60, et = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(S, { emit: h }) {
    const C = h, x = S, p = o(""), _ = o([]), m = o(""), R = () => [...p.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ..._.value.map((i) => `${i.name}: ${i.text.trim()}`)], X = () => (R()[0] ?? "").replace(/\s+/g, " ").slice(0, Ze);
    async function G(i) {
      var g;
      const r = [...((g = i.dataTransfer) == null ? void 0 : g.files) ?? []];
      _.value = [..._.value, ...await Promise.all(r.map(async (y) => ({ name: y.name, text: await y.text() })))];
    }
    async function j() {
      const i = await x.run(["dump", "make", X(), "--parts", R().join(" | ")]);
      m.value = i.ok ? "" : i.error, i.ok && (p.value = "", _.value = [], C("made"));
    }
    return (i, r) => (n(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: M(j, ["prevent"]),
      onDragover: r[2] || (r[2] = M(() => {
      }, ["prevent"])),
      onDrop: M(G, ["prevent"])
    }, [
      _e(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (g) => p.value = g),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [ye, p.value]
      ]),
      _.value.length ? (n(), v("p", Je, w(_.value.map((g) => g.name).join(", ")), 1)) : T("", !0),
      l("div", Qe, [
        b(s(W), {
          kind: "primary",
          small: "",
          disabled: !R().length,
          "data-dump-make": "",
          onClick: j
        }, {
          default: N(() => [...r[3] || (r[3] = [
            K("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(s(W), {
          small: "",
          onClick: r[1] || (r[1] = (g) => C("close"))
        }, {
          default: N(() => [...r[4] || (r[4] = [
            K("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      m.value ? (n(), v("p", Ye, w(m.value), 1)) : T("", !0)
    ], 32));
  }
}, tt = /* @__PURE__ */ we(et, [["__scopeId", "data-v-d2c5a833"]]), at = {
  "data-notices": "",
  class: "notices"
}, lt = { class: "notice-text" }, ot = ["href", "target"], st = ["onClick"], nt = { class: "running-strip" }, rt = { class: "jump-holder" }, ut = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, it = { class: "composer-quote-text" }, ct = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, dt = ["title"], vt = {
  key: 0,
  class: "attached-wait"
}, pt = ["onClick"], mt = { class: "composer-row" }, ft = {
  key: 2,
  class: "composer-failure"
}, kt = 180, gt = 2e3, ht = 40, _t = {
  __name: "Chat",
  setup(S) {
    const { rows: h, failure: C, loaded: x, load: p, older: _, context: m } = I("message list", ["message.*"], { incremental: !0 }), { rows: R, older: X } = I("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: G } = I("dock-item list", ["dock_item.*"]), { rows: j, act: i } = I("notice list", ["notice.*"]), { rows: r } = I("hook-call list --limit 10", ["hook_call.*"]), g = A(() => Ne(R.value, je, (e) => m.option(e).value)), y = o([]), be = A(() => y.value.filter((e) => !h.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - gt))), oe = A(() => Le([...h.value, ...be.value], g.value)), se = A(() => {
      const e = r.value.find((t) => ["pre_tool_use", "stop", "prompt", "session_start"].includes(t.hook));
      return (e == null ? void 0 : e.hook) === "pre_tool_use" ? [e.tool, e.summary].filter(Boolean).join(" ") : "";
    }), J = o(null), Q = o(!0), ne = o(!1);
    let re = 0, F = !0, Y = 0, O = null;
    Be(() => {
      P(), Promise.all([Pe(), Ve()]), J.value && typeof ResizeObserver < "u" && (O = new ResizeObserver(([e]) => ne.value = e.contentRect.height < qe), O.observe(J.value));
    }), Ie(() => {
      O == null || O.disconnect(), clearTimeout(Y);
    });
    const f = o(""), $ = o(""), u = o(null), ue = o(!0), ie = o(!1), L = o(0), E = o(!1), c = o([]), ce = o(null), de = o(null), P = () => ae(() => {
      var e;
      return (e = de.value) == null ? void 0 : e.focus();
    }), V = o(!1);
    async function Z(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        c.value = [...c.value, a];
        const d = await m.upload(t);
        a.pending = d.ok ? d.value : "", a.failure = d.ok ? "" : d.error, c.value = [...c.value];
      }
      P();
    }
    const Ce = (e) => {
      Z([...e.target.files]), e.target.value = "";
    }, xe = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), Z(t));
    }, De = (e) => {
      var t;
      V.value = !1, Z([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Te = (e) => c.value = c.value.filter((t) => t !== e), ve = A(() => (f.value.trim() || c.value.length) && c.value.every((e) => e.pending)), D = o(null), k = o(null);
    function $e(e) {
      k.value = null, D.value = e, P();
    }
    async function Me(e) {
      const t = await m.run(["message", "delete", String(e.id)]);
      $.value = t.ok ? "" : t.error, p();
    }
    const pe = () => h.value.find((e) => e.type === "user" && !e.read_at);
    function Se(e) {
      f.value || !pe() || (e.preventDefault(), k.value = pe(), D.value = null, f.value = k.value.text);
    }
    function q() {
      k.value && (k.value = null, f.value = "");
    }
    async function Re() {
      const e = await m.run(["message", "edit", String(k.value.id), "--text", f.value]);
      $.value = e.ok ? "" : e.error, e.ok && q(), p();
    }
    async function ee() {
      if (k.value) return Re();
      const e = { text: f.value, attached: c.value }, t = e.attached.flatMap((H) => ["--file", H.pending]), a = e.text || e.attached.map((H) => H.name).join(", "), d = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      y.value = [...y.value, d], f.value = "", c.value = [], $.value = "", P();
      const me = D.value;
      D.value = null;
      const fe = await m.run(me && !t.length ? ["message", "reply", String(me.id), a] : ["message", "send", a, ...t]);
      fe.ok || ($.value = fe.error, f.value = e.text, c.value = e.attached), y.value = y.value.filter((H) => H !== d), await p();
    }
    const Fe = (e) => !e.shiftKey && (e.preventDefault(), ve.value && ee());
    let te = !1;
    async function Oe() {
      if (te || !x.value) return;
      te = !0;
      const e = u.value.scrollHeight, [t, a] = await Promise.all([_(), X()]);
      (t || a) && (await ae(), u.value.scrollTop += u.value.scrollHeight - e), te = !1;
    }
    function Ee() {
      if (ue.value = !u.value || u.value.scrollTop < 8, ue.value && u.value && Oe(), !u.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = u.value;
      F = t - e - a < ht, ie.value = !F, F && (L.value = 0);
      const d = Ge({ top: e, before: re, height: t, shown: a });
      re = e, d !== null && (clearTimeout(Y), d ? Q.value = !0 : Y = setTimeout(() => Q.value = !1, kt));
    }
    ke(() => {
      var e;
      return (e = h.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !F && (L.value += 1);
    }), ke([oe, x], async () => {
      await ae(), F && u.value && (u.value.scrollTop = u.value.scrollHeight);
    });
    const He = () => {
      var e;
      return (e = u.value) == null ? void 0 : e.scrollTo({ top: u.value.scrollHeight, behavior: "smooth" });
    }, Ae = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), v("div", {
      ref_key: "chat",
      ref: J,
      class: "chat"
    }, [
      l("div", at, [
        (n(!0), v(ge, null, he(s(j), (a) => (n(), v("div", {
          key: a.id,
          class: "notice"
        }, [
          t[8] || (t[8] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", lt, w(a.title), 1),
          l("a", {
            class: "notice-link",
            href: Ae(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, w(a.label), 9, ot),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (d) => s(i)(["notice", "close", String(a.id)])
          }, [
            b(s(le), {
              name: "close",
              size: 12
            })
          ], 8, st)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: u,
        class: "history",
        onScroll: Ee
      }, [
        b(s(ze), {
          rows: oe.value,
          failure: s(C),
          loaded: s(x),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: N(({ row: a }) => [
            a.kind === "mark" ? (n(), B(s(Ue), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), B(s(Ke), {
              key: 1,
              message: a.row,
              onReply: $e,
              onDelete: Me
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("p", nt, [
        l("span", {
          class: z(["running-dot", { idle: !se.value }])
        }, null, 2),
        b(s(We), {
          text: se.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      l("div", rt, [
        l("button", {
          type: "button",
          "data-scroll-foot": "",
          class: z(["jump", { hidden: !ie.value }]),
          onClick: He
        }, w(L.value ? `${L.value} new` : "Newest"), 3)
      ]),
      b(s(Xe), {
        items: s(G),
        folded: ne.value || !Q.value
      }, null, 8, ["items", "folded"]),
      E.value ? (n(), B(tt, {
        key: 0,
        run: s(m).run,
        onMade: t[0] || (t[0] = (a) => E.value = !1),
        onClose: t[1] || (t[1] = (a) => E.value = !1)
      }, null, 8, ["run"])) : T("", !0),
      D.value || k.value ? (n(), v("p", ut, [
        l("span", it, w(k.value ? `Editing message ${k.value.id}` : `Reply to: ${D.value.text}`), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (D.value = null, q()))
        }, "×")
      ])) : T("", !0),
      l("form", {
        class: z(["composer", { dragging: V.value }]),
        onSubmit: M(ee, ["prevent"]),
        onDragover: t[6] || (t[6] = M((a) => V.value = !0, ["prevent"])),
        onDragleave: t[7] || (t[7] = (a) => V.value = !1),
        onDrop: M(De, ["prevent"])
      }, [
        c.value.length ? (n(), v("ul", ct, [
          (n(!0), v(ge, null, he(c.value, (a) => (n(), v("li", {
            key: a.name + a.pending,
            class: z(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, w(a.name), 1),
            !a.pending && !a.failure ? (n(), v("span", vt, "sending")) : T("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (d) => Te(a)
            }, [
              b(s(le), {
                name: "close",
                size: 10
              })
            ], 8, pt)
          ], 10, dt))), 128))
        ])) : T("", !0),
        _e(l("textarea", {
          ref_key: "composerInput",
          ref: de,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => f.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            U(Fe, ["enter"]),
            U(Se, ["up"]),
            U(q, ["down"]),
            U(q, ["esc"])
          ],
          onPaste: xe
        }, null, 544), [
          [ye, f.value]
        ]),
        l("div", mt, [
          l("input", {
            ref_key: "picker",
            ref: ce,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: Ce
          }, null, 544),
          l("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[4] || (t[4] = (a) => ce.value.click())
          }, [
            b(s(le), {
              name: "clip",
              size: 16
            })
          ]),
          ve.value ? (n(), B(s(W), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: ee
          }, {
            default: N(() => [...t[9] || (t[9] = [
              K("Send", -1)
            ])]),
            _: 1
          })) : (n(), B(s(W), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => E.value = !E.value)
          }, {
            default: N(() => [...t[10] || (t[10] = [
              K("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      $.value ? (n(), v("p", ft, w($.value), 1)) : T("", !0)
    ], 512));
  }
}, bt = /* @__PURE__ */ we(_t, [["__scopeId", "data-v-a96c0cad"]]);
export {
  bt as default
};
