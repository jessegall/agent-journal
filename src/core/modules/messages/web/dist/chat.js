/* @code-commandments-generated */
if (!document.getElementById("window-styles-24cf2150760c")) { const style = document.createElement("style"); style.id = "window-styles-24cf2150760c"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-92f82a67]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-92f82a67]{flex:1;min-height:0;overflow-y:auto}.history[data-v-92f82a67] .row-list-row{padding:1px 8px}.history[data-v-92f82a67] .mark.w-event{color:var(--text-3)}.notices[data-v-92f82a67]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-92f82a67]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-92f82a67]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-92f82a67]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-92f82a67]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-92f82a67]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-92f82a67]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-92f82a67]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-92f82a67]{background:var(--text-4)}.jump-holder[data-v-92f82a67]{position:relative;flex:none;height:0}.jump[data-v-92f82a67]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-92f82a67]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-92f82a67]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-92f82a67]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-92f82a67],.rise-leave-to[data-v-92f82a67]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-92f82a67]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-92f82a67]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-92f82a67]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-92f82a67]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-92f82a67]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-92f82a67]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-92f82a67]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-92f82a67]{border-color:var(--accent)}.attached[data-v-92f82a67]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-92f82a67]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-92f82a67]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-92f82a67]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-92f82a67]{color:var(--text-3)}.composer-send[data-v-92f82a67]{margin-left:auto}.composer-failure[data-v-92f82a67]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as m, withModifiers as M, withDirectives as se, createElementVNode as l, vModelText as we, toDisplayString as w, createCommentVNode as D, createVNode as h, unref as s, withCtx as S, createTextVNode as N, computed as B, onMounted as Ie, onUnmounted as Ne, nextTick as le, watch as he, Fragment as ye, renderList as _e, createBlock as I, Transition as Le, vShow as Pe, normalizeClass as oe, withKeys as z } from "vue";
import { Btn as Q, useRows as U, shownMarks as Ve, markDeclaration as je, interleaved as qe, fetchMarkDeclarations as ze, fetchDockDeclarations as Ue, SHORT_CHAT as Ke, Icon as K, RowList as Qe, MarkHost as We, MessageCard as Xe, RunningCommand as Ge, DockStack as Je, dockOpening as Ye } from "@journal/window-kit";
const be = (R, y) => {
  const b = R.__vccOpts || R;
  for (const [x, f] of y)
    b[x] = f;
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
  setup(R, { emit: y }) {
    const b = y, x = R, f = o(""), _ = o([]), v = o(""), F = () => [...f.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ..._.value.map((i) => `${i.name}: ${i.text.trim()}`)], W = () => (F()[0] ?? "").replace(/\s+/g, " ").slice(0, at);
    async function X(i) {
      var c;
      const r = [...((c = i.dataTransfer) == null ? void 0 : c.files) ?? []];
      _.value = [..._.value, ...await Promise.all(r.map(async (P) => ({ name: P.name, text: await P.text() })))];
    }
    async function L() {
      const i = await x.run(["dump", "make", W(), "--parts", F().join(" | ")]);
      v.value = i.ok ? "" : i.error, i.ok && (f.value = "", _.value = [], b("made"));
    }
    return (i, r) => (n(), m("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: M(L, ["prevent"]),
      onDragover: r[2] || (r[2] = M(() => {
      }, ["prevent"])),
      onDrop: M(X, ["prevent"])
    }, [
      se(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (c) => f.value = c),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [we, f.value]
      ]),
      _.value.length ? (n(), m("p", Ze, w(_.value.map((c) => c.name).join(", ")), 1)) : D("", !0),
      l("div", et, [
        h(s(Q), {
          kind: "primary",
          small: "",
          disabled: !F().length,
          "data-dump-make": "",
          onClick: L
        }, {
          default: S(() => [...r[3] || (r[3] = [
            N("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(s(Q), {
          small: "",
          onClick: r[1] || (r[1] = (c) => b("close"))
        }, {
          default: S(() => [...r[4] || (r[4] = [
            N("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      v.value ? (n(), m("p", tt, w(v.value), 1)) : D("", !0)
    ], 32));
  }
}, ot = /* @__PURE__ */ be(lt, [["__scopeId", "data-v-d2c5a833"]]), st = {
  "data-notices": "",
  class: "notices"
}, nt = { class: "notice-text" }, rt = ["href", "target"], ut = ["onClick"], it = { class: "jump-holder" }, ct = ["title"], dt = { class: "running-strip" }, vt = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, pt = { class: "composer-quote-text" }, mt = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, ft = ["title"], kt = {
  key: 0,
  class: "attached-wait"
}, gt = ["onClick"], ht = { class: "composer-row" }, yt = {
  key: 2,
  class: "composer-failure"
}, _t = 180, wt = 2e3, bt = 40, xt = {
  __name: "Chat",
  setup(R) {
    const { rows: y, failure: b, loaded: x, load: f, older: _, context: v } = U("message list", ["message.*"], { incremental: !0 }), { rows: F, older: W } = U("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: X } = U("dock-item list", ["dock_item.*"]), { rows: L, act: i } = U("notice list", ["notice.*"]), r = B(() => Ve(F.value, je, (e) => v.option(e).value)), c = o([]), P = B(() => c.value.filter((e) => !y.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - wt))), ne = B(() => qe([...y.value, ...P.value], r.value)), G = o("");
    async function re() {
      const e = await v.read("usage tool");
      G.value = e.ok ? e.value.tool : "";
    }
    v.follow(["hook_call.*"], re), re();
    const J = o(null), Y = o(!0), ue = o(!1);
    let ie = 0, O = !0, Z = 0, E = null;
    Ie(() => {
      V(), Promise.all([ze(), Ue()]), J.value && typeof ResizeObserver < "u" && (E = new ResizeObserver(([e]) => ue.value = e.contentRect.height < Ke), E.observe(J.value));
    }), Ne(() => {
      E == null || E.disconnect(), clearTimeout(Z);
    });
    const k = o(""), T = o(""), u = o(null), ce = o(!0), de = o(!1), $ = o(0), H = o(!1), d = o([]), ve = o(null), pe = o(null), V = () => le(() => {
      var e;
      return (e = pe.value) == null ? void 0 : e.focus();
    }), j = o(!1);
    async function ee(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        d.value = [...d.value, a];
        const p = await v.upload(t);
        a.pending = p.ok ? p.value : "", a.failure = p.ok ? "" : p.error, d.value = [...d.value];
      }
      V();
    }
    const xe = (e) => {
      ee([...e.target.files]), e.target.value = "";
    }, Ce = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), ee(t));
    }, De = (e) => {
      var t;
      j.value = !1, ee([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Te = (e) => d.value = d.value.filter((t) => t !== e), me = B(() => (k.value.trim() || d.value.length) && d.value.every((e) => e.pending)), C = o(null), $e = B(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = C.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function Se(e) {
      g.value = null, C.value = e, V();
    }
    async function Me(e) {
      const t = await v.run(["message", "delete", String(e.id)]);
      T.value = t.ok ? "" : t.error, f();
    }
    const fe = () => y.value.find((e) => e.type === "user" && !e.read_at);
    function Re(e) {
      k.value || !fe() || (e.preventDefault(), g.value = fe(), C.value = null, k.value = g.value.text);
    }
    function q() {
      g.value && (g.value = null, k.value = "");
    }
    async function Fe() {
      const e = await v.run(["message", "edit", String(g.value.id), "--text", k.value]);
      T.value = e.ok ? "" : e.error, e.ok && q(), f();
    }
    async function te() {
      if (g.value) return Fe();
      const e = { text: k.value, attached: d.value }, t = e.attached.flatMap((A) => ["--file", A.pending]), a = e.text || e.attached.map((A) => A.name).join(", "), p = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      c.value = [...c.value, p], k.value = "", d.value = [], T.value = "", V();
      const ke = C.value;
      C.value = null;
      const ge = await v.run(ke && !t.length ? ["message", "reply", String(ke.id), a] : ["message", "send", a, ...t]);
      ge.ok || (T.value = ge.error, k.value = e.text, d.value = e.attached), c.value = c.value.filter((A) => A !== p), await f();
    }
    const Oe = (e) => !e.shiftKey && (e.preventDefault(), me.value && te());
    let ae = !1;
    async function Ee() {
      if (ae || !x.value) return;
      ae = !0;
      const e = u.value.scrollHeight, [t, a] = await Promise.all([_(), W()]);
      (t || a) && (await le(), u.value.scrollTop += u.value.scrollHeight - e), ae = !1;
    }
    function He() {
      if (ce.value = !u.value || u.value.scrollTop < 8, ce.value && u.value && Ee(), !u.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = u.value;
      O = t - e - a < bt, de.value = !O, O && ($.value = 0);
      const p = Ye({ top: e, before: ie, height: t, shown: a });
      ie = e, p !== null && (clearTimeout(Z), p ? Y.value = !0 : Z = setTimeout(() => Y.value = !1, _t));
    }
    he(() => {
      var e;
      return (e = y.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !O && ($.value += 1);
    }), he([ne, x], async () => {
      await le(), O && u.value && (u.value.scrollTop = u.value.scrollHeight);
    });
    const Ae = () => {
      var e;
      return (e = u.value) == null ? void 0 : e.scrollTo({ top: u.value.scrollHeight, behavior: "smooth" });
    }, Be = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), m("div", {
      ref_key: "chat",
      ref: J,
      class: "chat"
    }, [
      l("div", st, [
        (n(!0), m(ye, null, _e(s(L), (a) => (n(), m("div", {
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
            onClick: (p) => s(i)(["notice", "close", String(a.id)])
          }, [
            h(s(K), {
              name: "close",
              size: 12
            })
          ], 8, ut)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: u,
        class: "history",
        onScroll: He
      }, [
        h(s(Qe), {
          rows: ne.value,
          failure: s(b),
          loaded: s(x),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: S(({ row: a }) => [
            a.kind === "mark" ? (n(), I(s(We), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), I(s(Xe), {
              key: 1,
              message: a.row,
              onReply: Se,
              onDelete: Me
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("div", it, [
        h(Le, { name: "rise" }, {
          default: S(() => [
            se(l("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: $.value ? `${$.value} arrived while you were reading` : "Back to the newest",
              onClick: Ae
            }, [
              h(s(K), { name: "down" }),
              N(" " + w($.value ? `${$.value} new` : "Newest"), 1)
            ], 8, ct), [
              [Pe, de.value]
            ])
          ]),
          _: 1
        })
      ]),
      l("p", dt, [
        l("span", {
          class: oe(["running-dot", { idle: !G.value }])
        }, null, 2),
        h(s(Ge), {
          text: G.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      h(s(Je), {
        items: s(X),
        folded: ue.value || !Y.value
      }, null, 8, ["items", "folded"]),
      H.value ? (n(), I(ot, {
        key: 0,
        run: s(v).run,
        onMade: t[0] || (t[0] = (a) => H.value = !1),
        onClose: t[1] || (t[1] = (a) => H.value = !1)
      }, null, 8, ["run"])) : D("", !0),
      C.value || g.value ? (n(), m("p", vt, [
        l("span", pt, w($e.value), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (C.value = null, q()))
        }, "×")
      ])) : D("", !0),
      l("form", {
        class: oe(["composer", { dragging: j.value }]),
        onSubmit: M(te, ["prevent"]),
        onDragover: t[6] || (t[6] = M((a) => j.value = !0, ["prevent"])),
        onDragleave: t[7] || (t[7] = (a) => j.value = !1),
        onDrop: M(De, ["prevent"])
      }, [
        d.value.length ? (n(), m("ul", mt, [
          (n(!0), m(ye, null, _e(d.value, (a) => (n(), m("li", {
            key: a.name + a.pending,
            class: oe(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, w(a.name), 1),
            !a.pending && !a.failure ? (n(), m("span", kt, "sending")) : D("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (p) => Te(a)
            }, [
              h(s(K), {
                name: "close",
                size: 10
              })
            ], 8, gt)
          ], 10, ft))), 128))
        ])) : D("", !0),
        se(l("textarea", {
          ref_key: "composerInput",
          ref: pe,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => k.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            z(Oe, ["enter"]),
            z(Re, ["up"]),
            z(q, ["down"]),
            z(q, ["esc"])
          ],
          onPaste: Ce
        }, null, 544), [
          [we, k.value]
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
            h(s(K), {
              name: "clip",
              size: 16
            })
          ]),
          me.value ? (n(), I(s(Q), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: te
          }, {
            default: S(() => [...t[9] || (t[9] = [
              N("Send", -1)
            ])]),
            _: 1
          })) : (n(), I(s(Q), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => H.value = !H.value)
          }, {
            default: S(() => [...t[10] || (t[10] = [
              N("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      T.value ? (n(), m("p", yt, w(T.value), 1)) : D("", !0)
    ], 512));
  }
}, Tt = /* @__PURE__ */ be(xt, [["__scopeId", "data-v-92f82a67"]]);
export {
  Tt as default
};
