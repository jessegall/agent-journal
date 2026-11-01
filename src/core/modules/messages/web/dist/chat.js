/* @code-commandments-generated */
if (!document.getElementById("window-styles-283eff42cc67")) { const style = document.createElement("style"); style.id = "window-styles-283eff42cc67"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-a34b7a21]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-a34b7a21]{flex:1;min-height:0;overflow-y:auto}.history[data-v-a34b7a21] .row-list-row{padding:1px 8px}.history[data-v-a34b7a21] .mark.w-event{color:var(--text-3)}.notices[data-v-a34b7a21]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-a34b7a21]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-a34b7a21]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-a34b7a21]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-a34b7a21]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-a34b7a21]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-a34b7a21]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-a34b7a21]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-a34b7a21]{background:var(--text-4)}.jump-holder[data-v-a34b7a21]{position:relative;flex:none;height:0}.jump[data-v-a34b7a21]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-a34b7a21]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-a34b7a21]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-a34b7a21]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-a34b7a21],.rise-leave-to[data-v-a34b7a21]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-a34b7a21]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-a34b7a21]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-a34b7a21]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-a34b7a21]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-a34b7a21]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-a34b7a21]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-a34b7a21]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-a34b7a21]{border-color:var(--accent)}.attached[data-v-a34b7a21]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-a34b7a21]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-a34b7a21]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-a34b7a21]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-a34b7a21]{color:var(--text-3)}.composer-send[data-v-a34b7a21]{margin-left:auto}.composer-failure[data-v-a34b7a21]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as v, withModifiers as R, withDirectives as oe, createElementVNode as l, vModelText as ye, toDisplayString as b, createCommentVNode as T, createVNode as g, unref as s, withCtx as M, createTextVNode as L, computed as I, onMounted as Be, onUnmounted as Ie, nextTick as ae, watch as ge, Fragment as he, renderList as _e, createBlock as N, Transition as Ne, vShow as je, normalizeClass as le, withKeys as U } from "vue";
import { Btn as W, useRows as j, shownMarks as Le, markDeclaration as Pe, interleaved as Ve, fetchMarkDeclarations as qe, fetchDockDeclarations as ze, SHORT_CHAT as Ue, Icon as K, RowList as Ke, MarkHost as We, MessageCard as Xe, RunningCommand as Ge, DockStack as Je, dockOpening as Qe } from "@journal/window-kit";
const we = (F, _) => {
  const C = F.__vccOpts || F;
  for (const [x, p] of _)
    C[x] = p;
  return C;
}, Ye = {
  key: 0,
  class: "dump-files"
}, Ze = { class: "dump-row" }, et = {
  key: 1,
  class: "dump-failure"
}, tt = 60, at = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(F, { emit: _ }) {
    const C = _, x = F, p = o(""), y = o([]), m = o(""), O = () => [...p.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ...y.value.map((i) => `${i.name}: ${i.text.trim()}`)], X = () => (O()[0] ?? "").replace(/\s+/g, " ").slice(0, tt);
    async function G(i) {
      var h;
      const r = [...((h = i.dataTransfer) == null ? void 0 : h.files) ?? []];
      y.value = [...y.value, ...await Promise.all(r.map(async (w) => ({ name: w.name, text: await w.text() })))];
    }
    async function P() {
      const i = await x.run(["dump", "make", X(), "--parts", O().join(" | ")]);
      m.value = i.ok ? "" : i.error, i.ok && (p.value = "", y.value = [], C("made"));
    }
    return (i, r) => (n(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: R(P, ["prevent"]),
      onDragover: r[2] || (r[2] = R(() => {
      }, ["prevent"])),
      onDrop: R(G, ["prevent"])
    }, [
      oe(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (h) => p.value = h),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [ye, p.value]
      ]),
      y.value.length ? (n(), v("p", Ye, b(y.value.map((h) => h.name).join(", ")), 1)) : T("", !0),
      l("div", Ze, [
        g(s(W), {
          kind: "primary",
          small: "",
          disabled: !O().length,
          "data-dump-make": "",
          onClick: P
        }, {
          default: M(() => [...r[3] || (r[3] = [
            L("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(s(W), {
          small: "",
          onClick: r[1] || (r[1] = (h) => C("close"))
        }, {
          default: M(() => [...r[4] || (r[4] = [
            L("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      m.value ? (n(), v("p", et, b(m.value), 1)) : T("", !0)
    ], 32));
  }
}, lt = /* @__PURE__ */ we(at, [["__scopeId", "data-v-d2c5a833"]]), ot = {
  "data-notices": "",
  class: "notices"
}, st = { class: "notice-text" }, nt = ["href", "target"], rt = ["onClick"], ut = { class: "jump-holder" }, it = ["title"], ct = { class: "running-strip" }, dt = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, vt = { class: "composer-quote-text" }, pt = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, mt = ["title"], ft = {
  key: 0,
  class: "attached-wait"
}, kt = ["onClick"], gt = { class: "composer-row" }, ht = {
  key: 2,
  class: "composer-failure"
}, _t = 180, yt = 2e3, wt = 40, bt = {
  __name: "Chat",
  setup(F) {
    const { rows: _, failure: C, loaded: x, load: p, older: y, context: m } = j("message list", ["message.*"], { incremental: !0 }), { rows: O, older: X } = j("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: G } = j("dock-item list", ["dock_item.*"]), { rows: P, act: i } = j("notice list", ["notice.*"]), { rows: r } = j("hook-call list --limit 10", ["hook_call.*"]), h = I(() => Le(O.value, Pe, (e) => m.option(e).value)), w = o([]), be = I(() => w.value.filter((e) => !_.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - yt))), se = I(() => Ve([..._.value, ...be.value], h.value)), ne = I(() => {
      const e = r.value.find((t) => ["pre_tool_use", "stop", "prompt", "session_start"].includes(t.hook));
      return (e == null ? void 0 : e.hook) === "pre_tool_use" ? [e.tool, e.summary].filter(Boolean).join(" ") : "";
    }), J = o(null), Q = o(!0), re = o(!1);
    let ue = 0, E = !0, Y = 0, H = null;
    Be(() => {
      V(), Promise.all([qe(), ze()]), J.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => re.value = e.contentRect.height < Ue), H.observe(J.value));
    }), Ie(() => {
      H == null || H.disconnect(), clearTimeout(Y);
    });
    const f = o(""), $ = o(""), u = o(null), ie = o(!0), ce = o(!1), S = o(0), A = o(!1), c = o([]), de = o(null), ve = o(null), V = () => ae(() => {
      var e;
      return (e = ve.value) == null ? void 0 : e.focus();
    }), q = o(!1);
    async function Z(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        c.value = [...c.value, a];
        const d = await m.upload(t);
        a.pending = d.ok ? d.value : "", a.failure = d.ok ? "" : d.error, c.value = [...c.value];
      }
      V();
    }
    const Ce = (e) => {
      Z([...e.target.files]), e.target.value = "";
    }, xe = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), Z(t));
    }, De = (e) => {
      var t;
      q.value = !1, Z([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Te = (e) => c.value = c.value.filter((t) => t !== e), pe = I(() => (f.value.trim() || c.value.length) && c.value.every((e) => e.pending)), D = o(null), k = o(null);
    function $e(e) {
      k.value = null, D.value = e, V();
    }
    async function Se(e) {
      const t = await m.run(["message", "delete", String(e.id)]);
      $.value = t.ok ? "" : t.error, p();
    }
    const me = () => _.value.find((e) => e.type === "user" && !e.read_at);
    function Me(e) {
      f.value || !me() || (e.preventDefault(), k.value = me(), D.value = null, f.value = k.value.text);
    }
    function z() {
      k.value && (k.value = null, f.value = "");
    }
    async function Re() {
      const e = await m.run(["message", "edit", String(k.value.id), "--text", f.value]);
      $.value = e.ok ? "" : e.error, e.ok && z(), p();
    }
    async function ee() {
      if (k.value) return Re();
      const e = { text: f.value, attached: c.value }, t = e.attached.flatMap((B) => ["--file", B.pending]), a = e.text || e.attached.map((B) => B.name).join(", "), d = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      w.value = [...w.value, d], f.value = "", c.value = [], $.value = "", V();
      const fe = D.value;
      D.value = null;
      const ke = await m.run(fe && !t.length ? ["message", "reply", String(fe.id), a] : ["message", "send", a, ...t]);
      ke.ok || ($.value = ke.error, f.value = e.text, c.value = e.attached), w.value = w.value.filter((B) => B !== d), await p();
    }
    const Fe = (e) => !e.shiftKey && (e.preventDefault(), pe.value && ee());
    let te = !1;
    async function Oe() {
      if (te || !x.value) return;
      te = !0;
      const e = u.value.scrollHeight, [t, a] = await Promise.all([y(), X()]);
      (t || a) && (await ae(), u.value.scrollTop += u.value.scrollHeight - e), te = !1;
    }
    function Ee() {
      if (ie.value = !u.value || u.value.scrollTop < 8, ie.value && u.value && Oe(), !u.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = u.value;
      E = t - e - a < wt, ce.value = !E, E && (S.value = 0);
      const d = Qe({ top: e, before: ue, height: t, shown: a });
      ue = e, d !== null && (clearTimeout(Y), d ? Q.value = !0 : Y = setTimeout(() => Q.value = !1, _t));
    }
    ge(() => {
      var e;
      return (e = _.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !E && (S.value += 1);
    }), ge([se, x], async () => {
      await ae(), E && u.value && (u.value.scrollTop = u.value.scrollHeight);
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
      l("div", ot, [
        (n(!0), v(he, null, _e(s(P), (a) => (n(), v("div", {
          key: a.id,
          class: "notice"
        }, [
          t[8] || (t[8] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", st, b(a.title), 1),
          l("a", {
            class: "notice-link",
            href: Ae(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, b(a.label), 9, nt),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (d) => s(i)(["notice", "close", String(a.id)])
          }, [
            g(s(K), {
              name: "close",
              size: 12
            })
          ], 8, rt)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: u,
        class: "history",
        onScroll: Ee
      }, [
        g(s(Ke), {
          rows: se.value,
          failure: s(C),
          loaded: s(x),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: M(({ row: a }) => [
            a.kind === "mark" ? (n(), N(s(We), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), N(s(Xe), {
              key: 1,
              message: a.row,
              onReply: $e,
              onDelete: Se
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("div", ut, [
        g(Ne, { name: "rise" }, {
          default: M(() => [
            oe(l("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: S.value ? `${S.value} arrived while you were reading` : "Back to the newest",
              onClick: He
            }, [
              g(s(K), { name: "down" }),
              L(" " + b(S.value ? `${S.value} new` : "Newest"), 1)
            ], 8, it), [
              [je, ce.value]
            ])
          ]),
          _: 1
        })
      ]),
      l("p", ct, [
        l("span", {
          class: le(["running-dot", { idle: !ne.value }])
        }, null, 2),
        g(s(Ge), {
          text: ne.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      g(s(Je), {
        items: s(G),
        folded: re.value || !Q.value
      }, null, 8, ["items", "folded"]),
      A.value ? (n(), N(lt, {
        key: 0,
        run: s(m).run,
        onMade: t[0] || (t[0] = (a) => A.value = !1),
        onClose: t[1] || (t[1] = (a) => A.value = !1)
      }, null, 8, ["run"])) : T("", !0),
      D.value || k.value ? (n(), v("p", dt, [
        l("span", vt, b(k.value ? `Editing message ${k.value.id}` : `Reply to: ${D.value.text}`), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (D.value = null, z()))
        }, "×")
      ])) : T("", !0),
      l("form", {
        class: le(["composer", { dragging: q.value }]),
        onSubmit: R(ee, ["prevent"]),
        onDragover: t[6] || (t[6] = R((a) => q.value = !0, ["prevent"])),
        onDragleave: t[7] || (t[7] = (a) => q.value = !1),
        onDrop: R(De, ["prevent"])
      }, [
        c.value.length ? (n(), v("ul", pt, [
          (n(!0), v(he, null, _e(c.value, (a) => (n(), v("li", {
            key: a.name + a.pending,
            class: le(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, b(a.name), 1),
            !a.pending && !a.failure ? (n(), v("span", ft, "sending")) : T("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (d) => Te(a)
            }, [
              g(s(K), {
                name: "close",
                size: 10
              })
            ], 8, kt)
          ], 10, mt))), 128))
        ])) : T("", !0),
        oe(l("textarea", {
          ref_key: "composerInput",
          ref: ve,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => f.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            U(Fe, ["enter"]),
            U(Me, ["up"]),
            U(z, ["down"]),
            U(z, ["esc"])
          ],
          onPaste: xe
        }, null, 544), [
          [ye, f.value]
        ]),
        l("div", gt, [
          l("input", {
            ref_key: "picker",
            ref: de,
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
            onClick: t[4] || (t[4] = (a) => de.value.click())
          }, [
            g(s(K), {
              name: "clip",
              size: 16
            })
          ]),
          pe.value ? (n(), N(s(W), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: ee
          }, {
            default: M(() => [...t[9] || (t[9] = [
              L("Send", -1)
            ])]),
            _: 1
          })) : (n(), N(s(W), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => A.value = !A.value)
          }, {
            default: M(() => [...t[10] || (t[10] = [
              L("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      $.value ? (n(), v("p", ht, b($.value), 1)) : T("", !0)
    ], 512));
  }
}, Dt = /* @__PURE__ */ we(bt, [["__scopeId", "data-v-a34b7a21"]]);
export {
  Dt as default
};
