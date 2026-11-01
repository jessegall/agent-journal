/* @code-commandments-generated */
if (!document.getElementById("window-styles-2912cc1a9415")) { const style = document.createElement("style"); style.id = "window-styles-2912cc1a9415"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-2e5792ee]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-2e5792ee]{flex:1;min-height:0;overflow-y:auto}.history[data-v-2e5792ee] .row-list-row{padding:1px 8px}.history[data-v-2e5792ee] .mark.w-event{color:var(--text-3)}.notices[data-v-2e5792ee]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-2e5792ee]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-2e5792ee]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-2e5792ee]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-2e5792ee]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-2e5792ee]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-2e5792ee]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-2e5792ee]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-2e5792ee]{background:var(--text-4)}.jump-holder[data-v-2e5792ee]{position:relative;flex:none;height:0}.jump[data-v-2e5792ee]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-2e5792ee]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-2e5792ee]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-2e5792ee]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-2e5792ee],.rise-leave-to[data-v-2e5792ee]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-2e5792ee]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-2e5792ee]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-2e5792ee]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-2e5792ee]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-2e5792ee]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-2e5792ee]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-2e5792ee]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-2e5792ee]{border-color:var(--accent)}.attached[data-v-2e5792ee]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-2e5792ee]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-2e5792ee]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-2e5792ee]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-2e5792ee]{color:var(--text-3)}.composer-send[data-v-2e5792ee]{margin-left:auto}.composer-failure[data-v-2e5792ee]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as m, withModifiers as M, withDirectives as se, createElementVNode as l, vModelText as we, toDisplayString as w, createCommentVNode as D, createVNode as h, unref as s, withCtx as S, createTextVNode as I, computed as q, onMounted as Be, onUnmounted as Ie, nextTick as le, watch as he, Fragment as ye, renderList as _e, createBlock as B, Transition as Ne, vShow as Le, normalizeClass as oe, withKeys as z } from "vue";
import { Btn as W, useRows as U, shownMarks as Pe, markDeclaration as Ve, interleaved as je, fetchMarkDeclarations as qe, fetchDockDeclarations as ze, SHORT_CHAT as Ue, Icon as K, RowList as Ke, MarkHost as We, MessageCard as Xe, RunningCommand as Ge, DockStack as Je, dockOpening as Qe } from "@journal/window-kit";
const be = (R, y) => {
  const b = R.__vccOpts || R;
  for (const [x, f] of y)
    b[x] = f;
  return b;
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
  setup(R, { emit: y }) {
    const b = y, x = R, f = o(""), _ = o([]), v = o(""), F = () => [...f.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ..._.value.map((i) => `${i.name}: ${i.text.trim()}`)], X = () => (F()[0] ?? "").replace(/\s+/g, " ").slice(0, tt);
    async function G(i) {
      var c;
      const r = [...((c = i.dataTransfer) == null ? void 0 : c.files) ?? []];
      _.value = [..._.value, ...await Promise.all(r.map(async (L) => ({ name: L.name, text: await L.text() })))];
    }
    async function N() {
      const i = await x.run(["dump", "make", X(), "--parts", F().join(" | ")]);
      v.value = i.ok ? "" : i.error, i.ok && (f.value = "", _.value = [], b("made"));
    }
    return (i, r) => (n(), m("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: M(N, ["prevent"]),
      onDragover: r[2] || (r[2] = M(() => {
      }, ["prevent"])),
      onDrop: M(G, ["prevent"])
    }, [
      se(l("textarea", {
        "onUpdate:modelValue": r[0] || (r[0] = (c) => f.value = c),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [we, f.value]
      ]),
      _.value.length ? (n(), m("p", Ye, w(_.value.map((c) => c.name).join(", ")), 1)) : D("", !0),
      l("div", Ze, [
        h(s(W), {
          kind: "primary",
          small: "",
          disabled: !F().length,
          "data-dump-make": "",
          onClick: N
        }, {
          default: S(() => [...r[3] || (r[3] = [
            I("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(s(W), {
          small: "",
          onClick: r[1] || (r[1] = (c) => b("close"))
        }, {
          default: S(() => [...r[4] || (r[4] = [
            I("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      v.value ? (n(), m("p", et, w(v.value), 1)) : D("", !0)
    ], 32));
  }
}, lt = /* @__PURE__ */ be(at, [["__scopeId", "data-v-d2c5a833"]]), ot = {
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
}, yt = 180, _t = 2e3, wt = 40, bt = {
  __name: "Chat",
  setup(R) {
    const { rows: y, failure: b, loaded: x, load: f, older: _, context: v } = U("message list", ["message.*"], { incremental: !0 }), { rows: F, older: X } = U("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: G } = U("dock-item list", ["dock_item.*"]), { rows: N, act: i } = U("notice list", ["notice.*"]), r = q(() => Pe(F.value, Ve, (e) => v.option(e).value)), c = o([]), L = q(() => c.value.filter((e) => !y.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - _t))), ne = q(() => je([...y.value, ...L.value], r.value)), J = o("");
    async function re() {
      const e = await v.read("usage tool");
      J.value = e.ok ? e.value.tool : "";
    }
    v.follow(["hook_call.*"], re), re();
    const Q = o(null), Y = o(!0), ue = o(!1);
    let ie = 0, O = !0, Z = 0, E = null;
    Be(() => {
      P(), Promise.all([qe(), ze()]), Q.value && typeof ResizeObserver < "u" && (E = new ResizeObserver(([e]) => ue.value = e.contentRect.height < Ue), E.observe(Q.value));
    }), Ie(() => {
      E == null || E.disconnect(), clearTimeout(Z);
    });
    const k = o(""), T = o(""), u = o(null), ce = o(!0), de = o(!1), $ = o(0), H = o(!1), d = o([]), ve = o(null), pe = o(null), P = () => le(() => {
      var e;
      return (e = pe.value) == null ? void 0 : e.focus();
    }), V = o(!1);
    async function ee(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        d.value = [...d.value, a];
        const p = await v.upload(t);
        a.pending = p.ok ? p.value : "", a.failure = p.ok ? "" : p.error, d.value = [...d.value];
      }
      P();
    }
    const xe = (e) => {
      ee([...e.target.files]), e.target.value = "";
    }, Ce = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), ee(t));
    }, De = (e) => {
      var t;
      V.value = !1, ee([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Te = (e) => d.value = d.value.filter((t) => t !== e), me = q(() => (k.value.trim() || d.value.length) && d.value.every((e) => e.pending)), C = o(null), g = o(null);
    function $e(e) {
      g.value = null, C.value = e, P();
    }
    async function Se(e) {
      const t = await v.run(["message", "delete", String(e.id)]);
      T.value = t.ok ? "" : t.error, f();
    }
    const fe = () => y.value.find((e) => e.type === "user" && !e.read_at);
    function Me(e) {
      k.value || !fe() || (e.preventDefault(), g.value = fe(), C.value = null, k.value = g.value.text);
    }
    function j() {
      g.value && (g.value = null, k.value = "");
    }
    async function Re() {
      const e = await v.run(["message", "edit", String(g.value.id), "--text", k.value]);
      T.value = e.ok ? "" : e.error, e.ok && j(), f();
    }
    async function te() {
      if (g.value) return Re();
      const e = { text: k.value, attached: d.value }, t = e.attached.flatMap((A) => ["--file", A.pending]), a = e.text || e.attached.map((A) => A.name).join(", "), p = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      c.value = [...c.value, p], k.value = "", d.value = [], T.value = "", P();
      const ke = C.value;
      C.value = null;
      const ge = await v.run(ke && !t.length ? ["message", "reply", String(ke.id), a] : ["message", "send", a, ...t]);
      ge.ok || (T.value = ge.error, k.value = e.text, d.value = e.attached), c.value = c.value.filter((A) => A !== p), await f();
    }
    const Fe = (e) => !e.shiftKey && (e.preventDefault(), me.value && te());
    let ae = !1;
    async function Oe() {
      if (ae || !x.value) return;
      ae = !0;
      const e = u.value.scrollHeight, [t, a] = await Promise.all([_(), X()]);
      (t || a) && (await le(), u.value.scrollTop += u.value.scrollHeight - e), ae = !1;
    }
    function Ee() {
      if (ce.value = !u.value || u.value.scrollTop < 8, ce.value && u.value && Oe(), !u.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = u.value;
      O = t - e - a < wt, de.value = !O, O && ($.value = 0);
      const p = Qe({ top: e, before: ie, height: t, shown: a });
      ie = e, p !== null && (clearTimeout(Z), p ? Y.value = !0 : Z = setTimeout(() => Y.value = !1, yt));
    }
    he(() => {
      var e;
      return (e = y.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !O && ($.value += 1);
    }), he([ne, x], async () => {
      await le(), O && u.value && (u.value.scrollTop = u.value.scrollHeight);
    });
    const He = () => {
      var e;
      return (e = u.value) == null ? void 0 : e.scrollTo({ top: u.value.scrollHeight, behavior: "smooth" });
    }, Ae = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), m("div", {
      ref_key: "chat",
      ref: Q,
      class: "chat"
    }, [
      l("div", ot, [
        (n(!0), m(ye, null, _e(s(N), (a) => (n(), m("div", {
          key: a.id,
          class: "notice"
        }, [
          t[8] || (t[8] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", st, w(a.title), 1),
          l("a", {
            class: "notice-link",
            href: Ae(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, w(a.label), 9, nt),
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
          ], 8, rt)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: u,
        class: "history",
        onScroll: Ee
      }, [
        h(s(Ke), {
          rows: ne.value,
          failure: s(b),
          loaded: s(x),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: S(({ row: a }) => [
            a.kind === "mark" ? (n(), B(s(We), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), B(s(Xe), {
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
        h(Ne, { name: "rise" }, {
          default: S(() => [
            se(l("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: $.value ? `${$.value} arrived while you were reading` : "Back to the newest",
              onClick: He
            }, [
              h(s(K), { name: "down" }),
              I(" " + w($.value ? `${$.value} new` : "Newest"), 1)
            ], 8, it), [
              [Le, de.value]
            ])
          ]),
          _: 1
        })
      ]),
      l("p", ct, [
        l("span", {
          class: oe(["running-dot", { idle: !J.value }])
        }, null, 2),
        h(s(Ge), {
          text: J.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      h(s(Je), {
        items: s(G),
        folded: ue.value || !Y.value
      }, null, 8, ["items", "folded"]),
      H.value ? (n(), B(lt, {
        key: 0,
        run: s(v).run,
        onMade: t[0] || (t[0] = (a) => H.value = !1),
        onClose: t[1] || (t[1] = (a) => H.value = !1)
      }, null, 8, ["run"])) : D("", !0),
      C.value || g.value ? (n(), m("p", dt, [
        l("span", vt, w(g.value ? `Editing message ${g.value.id}` : `Reply to: ${C.value.text}`), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (C.value = null, j()))
        }, "×")
      ])) : D("", !0),
      l("form", {
        class: oe(["composer", { dragging: V.value }]),
        onSubmit: M(te, ["prevent"]),
        onDragover: t[6] || (t[6] = M((a) => V.value = !0, ["prevent"])),
        onDragleave: t[7] || (t[7] = (a) => V.value = !1),
        onDrop: M(De, ["prevent"])
      }, [
        d.value.length ? (n(), m("ul", pt, [
          (n(!0), m(ye, null, _e(d.value, (a) => (n(), m("li", {
            key: a.name + a.pending,
            class: oe(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, w(a.name), 1),
            !a.pending && !a.failure ? (n(), m("span", ft, "sending")) : D("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (p) => Te(a)
            }, [
              h(s(K), {
                name: "close",
                size: 10
              })
            ], 8, kt)
          ], 10, mt))), 128))
        ])) : D("", !0),
        se(l("textarea", {
          ref_key: "composerInput",
          ref: pe,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => k.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            z(Fe, ["enter"]),
            z(Me, ["up"]),
            z(j, ["down"]),
            z(j, ["esc"])
          ],
          onPaste: Ce
        }, null, 544), [
          [we, k.value]
        ]),
        l("div", gt, [
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
          me.value ? (n(), B(s(W), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: te
          }, {
            default: S(() => [...t[9] || (t[9] = [
              I("Send", -1)
            ])]),
            _: 1
          })) : (n(), B(s(W), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => H.value = !H.value)
          }, {
            default: S(() => [...t[10] || (t[10] = [
              I("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      T.value ? (n(), m("p", ht, w(T.value), 1)) : D("", !0)
    ], 512));
  }
}, Dt = /* @__PURE__ */ be(bt, [["__scopeId", "data-v-2e5792ee"]]);
export {
  Dt as default
};
