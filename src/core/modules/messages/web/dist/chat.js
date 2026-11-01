/* @code-commandments-generated */
if (!document.getElementById("window-styles-02c084762ac5")) { const style = document.createElement("style"); style.id = "window-styles-02c084762ac5"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-73f2b24b]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-73f2b24b]{flex:1;min-height:0;overflow-y:auto}.history[data-v-73f2b24b] .row-list-row{padding:1px 8px}.history[data-v-73f2b24b] .mark.w-event{color:var(--text-3)}.notices[data-v-73f2b24b]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-73f2b24b]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-73f2b24b]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-73f2b24b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-73f2b24b]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-73f2b24b]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-73f2b24b]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-73f2b24b]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-73f2b24b]{background:var(--text-4)}.jump-holder[data-v-73f2b24b]{position:relative;flex:none;height:0}.jump[data-v-73f2b24b]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-73f2b24b]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-73f2b24b]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-73f2b24b]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-73f2b24b],.rise-leave-to[data-v-73f2b24b]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-73f2b24b]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-73f2b24b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-73f2b24b]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-73f2b24b]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-73f2b24b]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-73f2b24b]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-73f2b24b]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-73f2b24b]{border-color:var(--accent)}.attached[data-v-73f2b24b]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-73f2b24b]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-73f2b24b]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-73f2b24b]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-73f2b24b]{color:var(--text-3)}.composer-send[data-v-73f2b24b]{margin-left:auto}.composer-failure[data-v-73f2b24b]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as v, withModifiers as R, withDirectives as se, createElementVNode as l, vModelText as we, toDisplayString as w, createCommentVNode as D, createVNode as k, unref as s, withCtx as M, createTextVNode as L, computed as N, onMounted as Ie, onUnmounted as Ne, nextTick as le, watch as he, Fragment as _e, renderList as ye, createBlock as j, Transition as je, vShow as Le, normalizeClass as oe, withKeys as K } from "vue";
import { Btn as X, useRows as S, shownMarks as Pe, markDeclaration as Ve, interleaved as qe, fetchMarkDeclarations as ze, fetchDockDeclarations as Ue, SHORT_CHAT as Ke, Icon as W, RowList as We, MarkHost as Xe, MessageCard as Ge, RunningCommand as Je, DockStack as Qe, dockOpening as Ye } from "@journal/window-kit";
const be = (F, _) => {
  const b = F.__vccOpts || F;
  for (const [C, p] of _)
    b[C] = p;
  return b;
}, Ze = {
  key: 0,
  class: "dump-files"
}, et = { class: "dump-row" }, tt = {
  key: 1,
  class: "dump-failure"
}, at = 60, lt = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(F, { emit: _ }) {
    const b = _, C = F, p = o(""), y = o([]), m = o(""), O = () => [...p.value.split(/\n\s*\n/).map((u) => u.trim()).filter(Boolean), ...y.value.map((u) => `${u.name}: ${u.text.trim()}`)], G = () => (O()[0] ?? "").replace(/\s+/g, " ").slice(0, at);
    async function J(u) {
      var h;
      const r = [...((h = u.dataTransfer) == null ? void 0 : h.files) ?? []];
      y.value = [...y.value, ...await Promise.all(r.map(async (V) => ({ name: V.name, text: await V.text() })))];
    }
    async function P() {
      const u = await C.run(["dump", "make", G(), "--parts", O().join(" | ")]);
      m.value = u.ok ? "" : u.error, u.ok && (p.value = "", y.value = [], b("made"));
    }
    return (u, r) => (n(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: R(P, ["prevent"]),
      onDragover: r[2] || (r[2] = R(() => {
      }, ["prevent"])),
      onDrop: R(J, ["prevent"])
    }, [
      se(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (h) => p.value = h),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [we, p.value]
      ]),
      y.value.length ? (n(), v("p", Ze, w(y.value.map((h) => h.name).join(", ")), 1)) : D("", !0),
      l("div", et, [
        k(s(X), {
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
        k(s(X), {
          small: "",
          onClick: r[1] || (r[1] = (h) => b("close"))
        }, {
          default: M(() => [...r[4] || (r[4] = [
            L("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      m.value ? (n(), v("p", tt, w(m.value), 1)) : D("", !0)
    ], 32));
  }
}, ot = /* @__PURE__ */ be(lt, [["__scopeId", "data-v-d2c5a833"]]), st = {
  "data-notices": "",
  class: "notices"
}, nt = { class: "notice-text" }, rt = ["href", "target"], it = ["onClick"], ut = { class: "jump-holder" }, ct = ["title"], dt = { class: "running-strip" }, vt = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, pt = { class: "composer-quote-text" }, mt = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, ft = ["title"], gt = {
  key: 0,
  class: "attached-wait"
}, kt = ["onClick"], ht = { class: "composer-row" }, _t = {
  key: 2,
  class: "composer-failure"
}, yt = 180, wt = 2e3, bt = 40, Ct = {
  __name: "Chat",
  setup(F) {
    const { rows: _, failure: b, loaded: C, load: p, older: y, context: m } = S("message list", ["message.*"], { incremental: !0 }), { rows: O, older: G } = S("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: J } = S("dock-item list", ["dock_item.*"]), { rows: P, act: u } = S("notice list", ["notice.*"]), { rows: r } = S("hook-call list --limit 25", ["hook_call.*"]), { rows: h } = S("agent list --role main --limit 5", ["agent.*"]), V = N(() => Pe(O.value, Ve, (e) => m.option(e).value)), E = o([]), Ce = N(() => E.value.filter((e) => !_.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - wt))), ne = N(() => qe([..._.value, ...Ce.value], V.value)), re = N(() => {
      const e = new Set(h.value.map((a) => a.id)), t = r.value.find((a) => e.has(a.agent_id) && ["pre_tool_use", "stop", "prompt", "session_start"].includes(a.hook));
      return (t == null ? void 0 : t.hook) === "pre_tool_use" ? [t.tool, t.summary].filter(Boolean).join(" ") : "";
    }), Q = o(null), Y = o(!0), ie = o(!1);
    let ue = 0, H = !0, Z = 0, A = null;
    Ie(() => {
      q(), Promise.all([ze(), Ue()]), Q.value && typeof ResizeObserver < "u" && (A = new ResizeObserver(([e]) => ie.value = e.contentRect.height < Ke), A.observe(Q.value));
    }), Ne(() => {
      A == null || A.disconnect(), clearTimeout(Z);
    });
    const f = o(""), T = o(""), i = o(null), ce = o(!0), de = o(!1), $ = o(0), B = o(!1), c = o([]), ve = o(null), pe = o(null), q = () => le(() => {
      var e;
      return (e = pe.value) == null ? void 0 : e.focus();
    }), z = o(!1);
    async function ee(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        c.value = [...c.value, a];
        const d = await m.upload(t);
        a.pending = d.ok ? d.value : "", a.failure = d.ok ? "" : d.error, c.value = [...c.value];
      }
      q();
    }
    const xe = (e) => {
      ee([...e.target.files]), e.target.value = "";
    }, De = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), ee(t));
    }, Te = (e) => {
      var t;
      z.value = !1, ee([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, $e = (e) => c.value = c.value.filter((t) => t !== e), me = N(() => (f.value.trim() || c.value.length) && c.value.every((e) => e.pending)), x = o(null), g = o(null);
    function Se(e) {
      g.value = null, x.value = e, q();
    }
    async function Me(e) {
      const t = await m.run(["message", "delete", String(e.id)]);
      T.value = t.ok ? "" : t.error, p();
    }
    const fe = () => _.value.find((e) => e.type === "user" && !e.read_at);
    function Re(e) {
      f.value || !fe() || (e.preventDefault(), g.value = fe(), x.value = null, f.value = g.value.text);
    }
    function U() {
      g.value && (g.value = null, f.value = "");
    }
    async function Fe() {
      const e = await m.run(["message", "edit", String(g.value.id), "--text", f.value]);
      T.value = e.ok ? "" : e.error, e.ok && U(), p();
    }
    async function te() {
      if (g.value) return Fe();
      const e = { text: f.value, attached: c.value }, t = e.attached.flatMap((I) => ["--file", I.pending]), a = e.text || e.attached.map((I) => I.name).join(", "), d = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      E.value = [...E.value, d], f.value = "", c.value = [], T.value = "", q();
      const ge = x.value;
      x.value = null;
      const ke = await m.run(ge && !t.length ? ["message", "reply", String(ge.id), a] : ["message", "send", a, ...t]);
      ke.ok || (T.value = ke.error, f.value = e.text, c.value = e.attached), E.value = E.value.filter((I) => I !== d), await p();
    }
    const Oe = (e) => !e.shiftKey && (e.preventDefault(), me.value && te());
    let ae = !1;
    async function Ee() {
      if (ae || !C.value) return;
      ae = !0;
      const e = i.value.scrollHeight, [t, a] = await Promise.all([y(), G()]);
      (t || a) && (await le(), i.value.scrollTop += i.value.scrollHeight - e), ae = !1;
    }
    function He() {
      if (ce.value = !i.value || i.value.scrollTop < 8, ce.value && i.value && Ee(), !i.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = i.value;
      H = t - e - a < bt, de.value = !H, H && ($.value = 0);
      const d = Ye({ top: e, before: ue, height: t, shown: a });
      ue = e, d !== null && (clearTimeout(Z), d ? Y.value = !0 : Z = setTimeout(() => Y.value = !1, yt));
    }
    he(() => {
      var e;
      return (e = _.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !H && ($.value += 1);
    }), he([ne, C], async () => {
      await le(), H && i.value && (i.value.scrollTop = i.value.scrollHeight);
    });
    const Ae = () => {
      var e;
      return (e = i.value) == null ? void 0 : e.scrollTo({ top: i.value.scrollHeight, behavior: "smooth" });
    }, Be = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), v("div", {
      ref_key: "chat",
      ref: Q,
      class: "chat"
    }, [
      l("div", st, [
        (n(!0), v(_e, null, ye(s(P), (a) => (n(), v("div", {
          key: a.id,
          class: "notice"
        }, [
          t[8] || (t[8] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", nt, w(a.title), 1),
          l("a", {
            class: "notice-link",
            href: Be(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, w(a.label), 9, rt),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (d) => s(u)(["notice", "close", String(a.id)])
          }, [
            k(s(W), {
              name: "close",
              size: 12
            })
          ], 8, it)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: i,
        class: "history",
        onScroll: He
      }, [
        k(s(We), {
          rows: ne.value,
          failure: s(b),
          loaded: s(C),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: M(({ row: a }) => [
            a.kind === "mark" ? (n(), j(s(Xe), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), j(s(Ge), {
              key: 1,
              message: a.row,
              onReply: Se,
              onDelete: Me
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("div", ut, [
        k(je, { name: "rise" }, {
          default: M(() => [
            se(l("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: $.value ? `${$.value} arrived while you were reading` : "Back to the newest",
              onClick: Ae
            }, [
              k(s(W), { name: "down" }),
              L(" " + w($.value ? `${$.value} new` : "Newest"), 1)
            ], 8, ct), [
              [Le, de.value]
            ])
          ]),
          _: 1
        })
      ]),
      l("p", dt, [
        l("span", {
          class: oe(["running-dot", { idle: !re.value }])
        }, null, 2),
        k(s(Je), {
          text: re.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      k(s(Qe), {
        items: s(J),
        folded: ie.value || !Y.value
      }, null, 8, ["items", "folded"]),
      B.value ? (n(), j(ot, {
        key: 0,
        run: s(m).run,
        onMade: t[0] || (t[0] = (a) => B.value = !1),
        onClose: t[1] || (t[1] = (a) => B.value = !1)
      }, null, 8, ["run"])) : D("", !0),
      x.value || g.value ? (n(), v("p", vt, [
        l("span", pt, w(g.value ? `Editing message ${g.value.id}` : `Reply to: ${x.value.text}`), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (x.value = null, U()))
        }, "×")
      ])) : D("", !0),
      l("form", {
        class: oe(["composer", { dragging: z.value }]),
        onSubmit: R(te, ["prevent"]),
        onDragover: t[6] || (t[6] = R((a) => z.value = !0, ["prevent"])),
        onDragleave: t[7] || (t[7] = (a) => z.value = !1),
        onDrop: R(Te, ["prevent"])
      }, [
        c.value.length ? (n(), v("ul", mt, [
          (n(!0), v(_e, null, ye(c.value, (a) => (n(), v("li", {
            key: a.name + a.pending,
            class: oe(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, w(a.name), 1),
            !a.pending && !a.failure ? (n(), v("span", gt, "sending")) : D("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (d) => $e(a)
            }, [
              k(s(W), {
                name: "close",
                size: 10
              })
            ], 8, kt)
          ], 10, ft))), 128))
        ])) : D("", !0),
        se(l("textarea", {
          ref_key: "composerInput",
          ref: pe,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => f.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            K(Oe, ["enter"]),
            K(Re, ["up"]),
            K(U, ["down"]),
            K(U, ["esc"])
          ],
          onPaste: De
        }, null, 544), [
          [we, f.value]
        ]),
        l("div", ht, [
          l("input", {
            ref_key: "picker",
            ref: ve,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: xe
          }, null, 544),
          l("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[4] || (t[4] = (a) => ve.value.click())
          }, [
            k(s(W), {
              name: "clip",
              size: 16
            })
          ]),
          me.value ? (n(), j(s(X), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: te
          }, {
            default: M(() => [...t[9] || (t[9] = [
              L("Send", -1)
            ])]),
            _: 1
          })) : (n(), j(s(X), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => B.value = !B.value)
          }, {
            default: M(() => [...t[10] || (t[10] = [
              L("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      T.value ? (n(), v("p", _t, w(T.value), 1)) : D("", !0)
    ], 512));
  }
}, Tt = /* @__PURE__ */ be(Ct, [["__scopeId", "data-v-73f2b24b"]]);
export {
  Tt as default
};
