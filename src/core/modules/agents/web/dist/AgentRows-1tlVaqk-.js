/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, normalizeStyle as Ce, normalizeClass as re, toDisplayString as u, createCommentVNode as m, createElementVNode as b, renderSlot as Me, computed as S, createVNode as h, withCtx as A, createTextVNode as p, Fragment as I, renderList as ae, onUnmounted as Ae, ref as R, onMounted as Ee, createBlock as _, Teleport as Ze, mergeProps as Ge, watch as de, toRef as Ye, unref as g, withModifiers as oe, defineAsyncComponent as Qe, withKeys as Le, createSlots as Xe, resolveDynamicComponent as et, nextTick as Ve } from "vue";
import { peekRef as Se, Icon as Te, RunningCommand as tt, FoldGroup as Ne, TaskStatusIcon as at, Btn as ne, TextArea as _e, TextInput as ze, useWindow as je, SwitchCase as qe, useNow as nt, age as lt, perHour as ot, loadWindowComponent as st, coalesced as Fe, READ_RATES as We, TimeAgo as He, InnerTabs as it, TabBody as rt, EmptyState as De, useRows as ut, useDeclaredRows as Oe, SearchBar as dt, Segmented as ct, MenuLabel as Re, MenuItem as xe, RowList as gt, toggleFilter as vt } from "@journal/window-kit";
import { _ as te, T as pt } from "./TranscriptRows-ByPSYos4.js";
const mt = ["stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const s = e, n = { right: 0, down: 90, left: 180, up: 270 }, i = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, a = {
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (f, z) => (t(), o("svg", {
      class: "ico",
      style: Ce({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...s.facing === "right" ? {} : { transform: `rotate(${n[s.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[i[e.name] || e.name] || a.dot
    }, null, 12, mt));
  }
}, ht = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ft = {
  key: 1,
  class: "menu-item-text"
}, kt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (s, n) => (t(), o("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), o("span", ht, u(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (t(), o("span", ft, [
        b("span", null, [
          Me(s.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, u(e.description), 1)
      ])) : Me(s.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ te(kt, [["__scopeId", "data-v-fec99974"]]), yt = {}, bt = { class: "menu-label" };
function wt(e, s) {
  return t(), o("span", bt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ te(yt, [["render", wt], ["__scopeId", "data-v-aa955b3e"]]), Mt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, xt = {
  key: 0,
  class: "skills-none"
}, $t = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: s }) {
    const n = e, i = s, a = S(() => n.skills.filter((z) => z.state === "loaded")), f = S(() => n.skills.filter((z) => z.state !== "loaded"));
    return (z, T) => (t(), o("div", Mt, [
      h(we, null, {
        default: A(() => [...T[1] || (T[1] = [
          p("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? m("", !0) : (t(), o("p", xt, "None yet. Compacting the conversation empties this list.")),
      (t(!0), o(I, null, ae(a.value, (k) => (t(), o("p", {
        key: k.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        h(ee, {
          name: "book",
          size: 12
        }),
        p(u(k.skill), 1)
      ]))), 128)),
      f.value.length ? (t(), o(I, { key: 1 }, [
        h(we, null, {
          default: A(() => [...T[2] || (T[2] = [
            p("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), o(I, null, ae(f.value, (k) => (t(), o("p", {
          key: k.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          h(ee, {
            name: "book",
            size: 12
          }),
          p(u(k.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      h(ye, {
        "data-agent-skills-browse": "",
        onClick: T[0] || (T[0] = (k) => i("browse"))
      }, {
        default: A(() => [...T[3] || (T[3] = [
          p("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ct = /* @__PURE__ */ te($t, [["__scopeId", "data-v-be514d47"]]), St = (e, s, n) => Math.max(s, Math.min(n, e)), Pe = /* @__PURE__ */ new WeakMap(), At = (e, s) => Pe.set(e, s);
function jt(e, s) {
  for (let n = s; n; n = Pe.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Rt(e, s) {
  const n = (i) => {
    var f, z;
    const a = ((f = e.value) == null ? void 0 : f.element) || ((z = e.value) == null ? void 0 : z.$el) || e.value;
    a && !jt(a, i.target) && s(i);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ke = 8, Tt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: s, emit: n }) {
    const i = e, a = R(null), f = (d) => d ? `${d}px` : void 0, z = S(() => ({
      minWidth: f(i.minWidth),
      maxWidth: f(i.maxWidth),
      maxHeight: f(i.maxHeight),
      height: f(i.height)
    })), T = R({ w: 0, h: 0 }), k = R(i.anchor ? i.anchor.getBoundingClientRect() : null), q = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), j = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), V = (d) => {
      const H = d.closest(".pane, .float-window");
      return H ? j(H.getBoundingClientRect()) : q();
    }, O = (d, H) => `${Math.max(0, d ? Math.min(d, H) : H)}px`;
    function L(d, H) {
      return {
        below: d.bottom - H.bottom - i.gap - ke,
        above: H.top - d.top - i.gap - ke,
        across: d.right - d.left - 2 * ke
      };
    }
    function x(d) {
      const H = V(i.anchor), W = L(H, d);
      return T.value.w <= W.across && T.value.h <= Math.max(W.below, W.above) ? H : q();
    }
    const $ = S(() => {
      if (!k.value) return z.value;
      const d = k.value, H = x(d), W = L(H, d), { w: Y, h: Q } = T.value, X = i.align === "auto" ? d.left + d.right > H.left + H.right : i.align === "right", se = St(X ? d.right - Y : d.left, H.left + ke, Math.max(H.left + ke, H.right - Y - ke)), pe = Q > W.below && W.above > W.below ? { bottom: `${window.innerHeight - d.top + i.gap}px`, maxHeight: O(i.maxHeight, W.above) } : { top: `${d.bottom + i.gap}px`, maxHeight: O(i.maxHeight, W.below) };
      return { ...z.value, ...pe, left: `${se}px`, maxWidth: O(i.maxWidth, W.across) };
    }), E = n, B = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function F(d) {
      const H = B(), W = H.indexOf(document.activeElement);
      H[(W + d + H.length) % H.length].focus();
    }
    const Z = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => E("close") }, U = (d) => Z[d.key] && (d.preventDefault(), Z[d.key]()), D = () => a.value && (T.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let G = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(D);
    });
    Rt(a, (d) => i.anchor && !i.anchor.contains(d.target) && E("close"));
    const c = (d, H) => ["top", "left", "right", "bottom"].some((W) => Math.abs(d[W] - H[W]) > 1), v = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let M = 0;
    function K() {
      if (i.anchor) {
        const d = i.anchor.getBoundingClientRect();
        if (!i.anchor.isConnected || v(d)) return E("close");
        c(d, k.value) && (k.value = d);
      }
      M = requestAnimationFrame(K);
    }
    return Ee(() => {
      i.anchor && a.value && At(a.value, i.anchor), D(), a.value && w.observe(a.value), !i.plain && B()[0] && B()[0].focus(), K();
    }), Ae(() => {
      w.disconnect(), cancelAnimationFrame(M), cancelAnimationFrame(G);
    }), s({ element: a }), (d, H) => (t(), _(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      b("div", Ge({
        ref_key: "panel",
        ref: a
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: U
      }), [
        Me(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), zt = /* @__PURE__ */ te(Tt, [["__scopeId", "data-v-3d203970"]]);
async function Lt(e, s, n) {
  if (!e) return n(s);
  const { target: i, fields: a } = e, f = Object.fromEntries(Object.keys(a).map((k) => [k, i[k]])), z = () => Object.assign(i, f);
  Object.assign(i, a);
  let T = !1;
  try {
    const k = await n(s);
    return T = k.ok, k;
  } finally {
    T || z();
  }
}
function Vt(e, s, n) {
  const i = R([]), a = R([]), f = R({}), z = R(""), T = R(!1), k = S(() => !!e.value && !e.value.ended_at), q = S(() => k.value && !!e.value.paused_at);
  async function j() {
    if (k.value) {
      const E = await s(["agent", "controls", String(e.value.id)]);
      i.value = E.ok ? E.value.groups : [];
      return;
    }
    const $ = await s(["agent", "programs"]);
    a.value = $.ok ? $.value.rows : [];
  }
  async function V($, E = null) {
    z.value = "";
    const B = await Lt(E, $, s);
    return z.value = B.ok ? "" : B.error, n(), B;
  }
  const O = ($, E) => V(["agent", "control", String(e.value.id), $, E.value], { target: f, fields: { value: { ...f.value, [$]: E.label } } }), L = () => (T.value = !1, V(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), x = ($) => V(["agent", "launch", $.name]);
  return Ee(j), de(k, j), { groups: i, programs: a, chosen: f, failure: z, asking: T, running: k, paused: q, choose: O, stop: L, start: x };
}
const Ue = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ue).map(([e, s]) => ({ key: e, label: s }));
function Ht(e, s = "agent") {
  return Ue[e] || s;
}
function Ot(e) {
  if (!e) return "Not compacted yet";
  const s = new Date(e.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.from_percent === null ? `Last compacted ${s}` : e.to_percent === null ? `Last compacted ${s}, from ${e.from_percent}%` : `Last compacted ${s}, from ${e.from_percent}% to ${e.to_percent}%, ${e.from_percent - e.to_percent}% taken off`;
}
const Bt = ["disabled", "title"], It = ["title"], Et = { class: "gauge usage" }, Nt = ["disabled", "title"], _t = { class: "gauge" }, qt = ["disabled", "title"], Ft = ["disabled"], Wt = ["disabled"], Dt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Pt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ut = ["title"], Jt = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Kt = { class: "gauge" }, Zt = { class: "context-used" }, Gt = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Yt = 75, Qt = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed"],
  setup(e, { emit: s }) {
    const n = e, i = s, a = Vt(Ye(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => i("changed")), f = R(null), z = R(""), T = S(() => a.groups.value.find((w) => w.key === z.value));
    function k(w, c) {
      f.value = w.currentTarget, z.value = c;
    }
    function q() {
      f.value = null, z.value = "", a.asking.value = !1;
    }
    const j = R([]), V = S(() => j.value.filter((w) => w.state === "loaded"));
    async function O() {
      const w = n.agent && n.run ? await n.run(["agent-skill", "list", "--agent", String(n.agent.id)]) : null;
      j.value = w != null && w.ok ? w.value.rows ?? [] : [];
    }
    function L(w) {
      k(w, "skills"), O();
    }
    de(() => {
      var w;
      return (w = n.agent) == null ? void 0 : w.id;
    }, O, { immediate: !0 });
    const x = (w) => a.groups.value.some((c) => c.key === w), $ = S(() => {
      var w;
      return a.chosen.value.model ?? ((w = B.value) == null ? void 0 : w.model) ?? "";
    }), E = S(() => {
      var w;
      return a.chosen.value.effort ?? ((w = B.value) == null ? void 0 : w.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const B = S(() => {
      var w;
      return ((w = n.usage.agents) == null ? void 0 : w.find((c) => {
        var v;
        return c.id === ((v = n.agent) == null ? void 0 : v.id);
      })) ?? null;
    }), F = S(() => {
      var w;
      return ((w = n.usage.windows) == null ? void 0 : w[0]) ?? null;
    }), Z = S(() => F.value ? Math.max(0, Math.min(100, Math.round(F.value.used_percent))) : null), U = S(() => {
      var w;
      return ((w = B.value) == null ? void 0 : w.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), D = S(() => {
      var w;
      return (w = B.value) != null && w.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    }), G = S(() => {
      var v;
      const w = (v = n.agent) != null && v.process_started_at ? new Date(n.agent.process_started_at).getTime() : 0;
      if (!w) return "";
      const c = Math.max(0, Math.floor((n.now - w) / 6e4));
      return c >= 60 ? `${Math.floor(c / 60)}h ${c % 60}m` : `${c}m`;
    });
    return (w, c) => (t(), o("div", {
      class: re(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), o(I, { key: 0 }, [
        b("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: c[0] || (c[0] = (v) => k(v, "agent"))
        }, [
          h(ee, {
            name: "agents",
            size: 12
          }),
          p(" " + u(g(Ht)(e.agent.program)), 1)
        ], 8, Bt),
        Z.value !== null ? (t(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${Z.value}% of the plan's ${F.value.title} allowance used`,
          onClick: c[1] || (c[1] = (v) => i("open", "usage", v.currentTarget))
        }, [
          h(ee, {
            name: "clock",
            size: 12
          }),
          c[14] || (c[14] = p()),
          b("span", Et, [
            b("span", {
              style: Ce({ width: `${Z.value}%` })
            }, null, 4)
          ]),
          p(" " + u(Z.value) + "% ", 1)
        ], 8, It)) : m("", !0),
        U.value !== null ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${U.value}% full: clear or compact it`,
          onClick: c[2] || (c[2] = (v) => x("context") ? k(v, "context") : i("open", "context", v.currentTarget))
        }, [
          h(ee, {
            name: "gauge",
            size: 12
          }),
          c[15] || (c[15] = p()),
          b("span", _t, [
            b("span", {
              style: Ce({ width: `${U.value}%` })
            }, null, 4)
          ]),
          p(" " + u(U.value) + "% ", 1)
        ], 8, Nt)) : m("", !0),
        $.value ? (t(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${$.value}: change the model`,
          onClick: c[3] || (c[3] = (v) => x("model") ? k(v, "model") : null)
        }, [
          h(ee, {
            name: "model",
            size: 12
          }),
          p(" " + u($.value), 1)
        ], 8, qt)) : m("", !0),
        x("effort") || e.card && E.value ? (t(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: c[4] || (c[4] = (v) => k(v, "effort"))
        }, [
          h(ee, {
            name: "bolt",
            size: 12
          }),
          p(" " + u(E.value), 1)
        ], 8, Ft)) : m("", !0),
        D.value ? (t(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: c[5] || (c[5] = (v) => i("open", "cost", v.currentTarget))
        }, u(D.value), 9, Wt)) : m("", !0),
        G.value ? (t(), o("span", Dt, [
          h(ee, {
            name: "reminders",
            size: 12
          }),
          p(" " + u(G.value), 1)
        ])) : m("", !0),
        e.branch ? (t(), o("span", Pt, [
          h(ee, {
            name: "branch",
            size: 12
          }),
          p(" " + u(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (t(), o("button", {
          key: 7,
          type: "button",
          class: re(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: c[6] || (c[6] = (v) => i("open", "jobs", v.currentTarget))
        }, [
          h(ee, {
            name: "clock",
            size: 12
          }),
          p(" " + u(e.jobs), 1)
        ], 2)),
        e.run ? (t(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: L
        }, [
          h(ee, {
            name: "book",
            size: 12
          }),
          p(" " + u(V.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (t(), o(I, { key: 9 }, [
          b("button", {
            type: "button",
            class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Yt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: c[7] || (c[7] = (v) => i("open", "fitness", v.currentTarget))
          }, [
            h(ee, {
              name: "heart",
              size: 12
            }),
            p(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          b("button", {
            type: "button",
            class: re(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: c[8] || (c[8] = (v) => i("open", "load", v.currentTarget))
          }, [
            h(ee, {
              name: "weight",
              size: 12
            }),
            p(" " + u(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (t(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: c[9] || (c[9] = (v) => k(v, "start"))
      }, [
        h(ee, {
          name: "agents",
          size: 12
        }),
        c[16] || (c[16] = p(" Start an agent", -1))
      ])) : m("", !0),
      c[22] || (c[22] = b("span", { class: "space" }, null, -1)),
      g(a).failure.value ? (t(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: g(a).failure.value
      }, u(g(a).failure.value), 9, Ut)) : m("", !0),
      Me(w.$slots, "default", {}, void 0, !0),
      f.value ? (t(), _(zt, {
        key: 3,
        anchor: f.value,
        "min-width": 190,
        onClose: q
      }, {
        default: A(() => {
          var v;
          return [
            z.value === "agent" ? (t(), o(I, { key: 0 }, [
              g(a).asking.value ? (t(), o(I, { key: 0 }, [
                h(we, { "data-agent-stop-ask": "" }, {
                  default: A(() => [...c[17] || (c[17] = [
                    p("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                h(ye, {
                  "data-agent-stop-confirm": "",
                  onClick: c[10] || (c[10] = (M) => (q(), g(a).stop()))
                }, {
                  default: A(() => [...c[18] || (c[18] = [
                    p("Stop it", -1)
                  ])]),
                  _: 1
                }),
                h(ye, {
                  onClick: c[11] || (c[11] = (M) => g(a).asking.value = !1)
                }, {
                  default: A(() => [...c[19] || (c[19] = [
                    p("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), _(ye, {
                key: 1,
                "data-agent-stop": "",
                onClick: c[12] || (c[12] = (M) => g(a).asking.value = !0)
              }, {
                default: A(() => [...c[20] || (c[20] = [
                  p("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : z.value === "start" ? (t(), o(I, { key: 1 }, [
              h(we, null, {
                default: A(() => [...c[21] || (c[21] = [
                  p("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), o(I, null, ae(g(a).programs.value, (M) => (t(), _(ye, {
                key: M.name,
                "data-agent-program": M.name,
                onClick: (K) => (q(), g(a).start(M))
              }, {
                default: A(() => [
                  p(u(M.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : z.value === "skills" ? (t(), _(Ct, {
              key: 2,
              skills: j.value,
              onBrowse: c[13] || (c[13] = (M) => (q(), i("open", "skills", null)))
            }, null, 8, ["skills"])) : T.value ? (t(), o(I, { key: 3 }, [
              h(we, null, {
                default: A(() => [
                  p(u(T.value.label), 1)
                ]),
                _: 1
              }),
              z.value === "context" ? (t(), o(I, { key: 0 }, [
                b("div", Jt, [
                  b("span", Kt, [
                    b("span", {
                      style: Ce({ width: `${U.value}%` })
                    }, null, 4)
                  ]),
                  b("span", Zt, u(U.value) + "%", 1)
                ]),
                b("p", Gt, u(g(Ot)(((v = B.value) == null ? void 0 : v.last_compaction) ?? null)), 1)
              ], 64)) : m("", !0),
              (t(!0), o(I, null, ae(T.value.choices, (M) => (t(), _(ye, {
                key: M.value,
                "data-agent-choice": M.value,
                onClick: (K) => (g(a).choose(T.value.key, M), q())
              }, {
                default: A(() => [
                  p(u(M.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : m("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : m("", !0)
    ], 2));
  }
}, Xt = /* @__PURE__ */ te(Qt, [["__scopeId", "data-v-58c7f8ed"]]), ea = {
  class: "agent-command",
  "data-agent-command": ""
}, ta = {
  key: 1,
  "data-agent-stopped": ""
}, aa = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (s, n) => (t(), o("span", ea, [
      e.waitReason ? (t(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: n[0] || (n[0] = oe((i) => g(Se)("test_queue:0"), ["stop"]))
      }, [
        p("Waiting: " + u(e.waitReason) + " ", 1),
        h(g(Te), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), o("span", ta, "Waiting")) : (t(), _(g(tt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Be = /* @__PURE__ */ te(aa, [["__scopeId", "data-v-1b371fb5"]]), na = ["data-agent-delegated", "onClick"], la = { class: "agent-task-number" }, oa = { class: "agent-task-title" }, sa = ["title"], ia = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = s;
    return (i, a) => (t(), _(g(Ne), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (f) => n("toggle"))
    }, {
      default: A(() => [
        (t(!0), o(I, null, ae(e.section.tasks, (f) => (t(), o("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (z) => g(Se)(`tasks:${f.id}`)
        }, [
          h(g(at), {
            status: f.state
          }, null, 8, ["status"]),
          b("span", la, u(f.id), 1),
          b("span", oa, u(f.title), 1),
          f.plan_id ? (t(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + u(f.plan_id) + ": " + u(f.plan_title), 9, sa)) : m("", !0)
        ], 8, na))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ra = /* @__PURE__ */ te(ia, [["__scopeId", "data-v-238ff959"]]), ua = { class: "action-field" }, da = ["value", "disabled"], ca = ["value"], ga = { key: 1 }, va = {
  key: 1,
  class: "action-field"
}, pa = { class: "action-buttons" }, ma = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (s, n) => (t(), o("form", {
      onSubmit: n[4] || (n[4] = oe((i) => s.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), o(I, { key: 0 }, [
        b("label", ua, [
          n[6] || (n[6] = p("Task ", -1)),
          b("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: n[0] || (n[0] = (i) => s.$emit("update:task", i.target.value))
          }, [
            n[5] || (n[5] = b("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), o(I, null, ae(e.tasks, (i) => (t(), o("option", {
              key: i.id,
              value: String(i.id)
            }, u(i.id) + ": " + u(i.title), 9, ca))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (t(), _(g(ne), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: n[1] || (n[1] = (i) => s.$emit("more"))
        }, {
          default: A(() => [...n[7] || (n[7] = [
            p("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), o("p", ga, "No open tasks.")) : m("", !0)
      ], 64)) : (t(), o("label", va, [
        n[8] || (n[8] = p("Job", -1)),
        h(g(_e), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: n[2] || (n[2] = (i) => s.$emit("update:text", i.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      b("div", pa, [
        h(g(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: A(() => [...n[9] || (n[9] = [
            p("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(g(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[3] || (n[3] = (i) => s.$emit("cancel"))
        }, {
          default: A(() => [...n[10] || (n[10] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ha = /* @__PURE__ */ te(ma, [["__scopeId", "data-v-adde4158"]]), fa = { class: "action-field" }, ka = { class: "action-buttons" }, ya = {
  __name: "AgentMessageForm",
  props: { text: String, pending: Boolean },
  emits: ["submit", "cancel", "update:text"],
  setup(e) {
    return (s, n) => (t(), o("form", {
      onSubmit: n[2] || (n[2] = oe((i) => s.$emit("submit"), ["prevent"]))
    }, [
      b("label", fa, [
        n[3] || (n[3] = p("Message", -1)),
        h(g(_e), {
          value: e.text,
          disabled: e.pending,
          "data-agent-message-text": "",
          onInput: n[0] || (n[0] = (i) => s.$emit("update:text", i.target.value))
        }, null, 8, ["value", "disabled"])
      ]),
      b("div", ka, [
        h(g(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.text.trim(),
          "data-agent-submit-message": ""
        }, {
          default: A(() => [...n[4] || (n[4] = [
            p("Send the message", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(g(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[1] || (n[1] = (i) => s.$emit("cancel"))
        }, {
          default: A(() => [...n[5] || (n[5] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ba = /* @__PURE__ */ te(ya, [["__scopeId", "data-v-5620d063"]]), wa = { class: "action-buttons" }, Ma = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (s, n) => (t(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: n[2] || (n[2] = oe((i) => s.$emit("submit"), ["prevent"]))
    }, [
      n[5] || (n[5] = b("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      h(g(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": n[0] || (n[0] = (i) => s.$emit("update:reason", i))
      }, null, 8, ["model-value", "disabled"]),
      b("div", wa, [
        h(g(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...n[3] || (n[3] = [
            p("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(g(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[1] || (n[1] = (i) => s.$emit("cancel"))
        }, {
          default: A(() => [...n[4] || (n[4] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, xa = /* @__PURE__ */ te(Ma, [["__scopeId", "data-v-23a905c0"]]), $a = { class: "action-buttons" }, Ca = {
  key: 0,
  role: "alert"
}, Sa = {
  key: 1,
  role: "status"
}, Aa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, n = je(), i = R(""), a = R(""), f = R(""), z = R(""), T = R([]), k = R(0), q = R(!1), j = R(!1), V = R(!1), O = R(""), L = R(""), x = S(() => !!s.row.retired_at || s.row.state === "retired"), $ = S(() => !x.value && !!s.row.ended_at), E = S(() => {
      var v;
      return $.value && ((v = s.row.job_command) == null ? void 0 : v.length) && !s.row.resume_reason;
    }), B = S(() => E.value && !j.value && (s.row.job_task_flag ? T.value.some((v) => String(v.id) === z.value) : !!a.value.trim()));
    function F(v) {
      i.value = v, a.value = "", f.value = "", z.value = "", O.value = "", L.value = "";
    }
    async function Z() {
      F("job"), s.row.job_task_flag && (T.value = [], k.value = 0, q.value = !1, await U());
    }
    async function U() {
      if (!j.value) {
        j.value = !0;
        try {
          const v = await n.read(`task list --state open --limit 100 --page ${k.value + 1}`);
          O.value = v.ok ? "" : v.error, v.ok && (T.value = [...T.value, ...v.value.rows], k.value = v.value.page, q.value = v.value.page * v.value.size < v.value.total);
        } finally {
          j.value = !1;
        }
      }
    }
    async function D(v, M) {
      if (!V.value) {
        V.value = !0, O.value = "";
        try {
          const K = await n.run(v);
          O.value = K.ok ? "" : K.error, K.ok && (F(""), L.value = M);
        } finally {
          V.value = !1;
        }
      }
    }
    async function G() {
      if (!B.value) return;
      const v = s.row.job_task_flag ? [s.row.job_task_flag, z.value] : [a.value.trim()];
      await D([...s.row.job_command, String(s.row.id), ...v], "Job sent.");
    }
    async function w() {
      x.value || $.value || !a.value.trim() || await D(["message", "send", a.value.trim(), "--target-agent", String(s.row.id)], "Message sent.");
    }
    async function c() {
      !$.value || i.value !== "retire" || !f.value.trim() || await D(["agent", "retire", String(s.row.id), "--reason", f.value.trim()], "Agent retired permanently.");
    }
    return (v, M) => {
      var K;
      return x.value ? m("", !0) : (t(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: M[9] || (M[9] = oe(() => {
        }, ["stop"])),
        onKeydown: M[10] || (M[10] = oe(() => {
        }, ["stop"]))
      }, [
        b("div", $a, [
          $.value ? (t(), o(I, { key: 0 }, [
            (K = e.row.job_command) != null && K.length ? (t(), _(g(ne), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: V.value || j.value || !E.value,
              onClick: Z
            }, {
              default: A(() => [...M[11] || (M[11] = [
                p("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (t(), _(g(ne), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: V.value || j.value,
              onClick: M[0] || (M[0] = (d) => F("retire"))
            }, {
              default: A(() => [...M[12] || (M[12] = [
                p("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : (t(), _(g(ne), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: V.value,
            onClick: M[1] || (M[1] = (d) => F("message"))
          }, {
            default: A(() => [...M[13] || (M[13] = [
              p("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        h(g(qe), { value: i.value }, {
          job: A(() => [
            h(ha, {
              task: z.value,
              "onUpdate:task": M[2] || (M[2] = (d) => z.value = d),
              text: a.value,
              "onUpdate:text": M[3] || (M[3] = (d) => a.value = d),
              row: e.row,
              tasks: T.value,
              pending: V.value,
              loading: j.value,
              "more-tasks": q.value,
              failure: O.value,
              "job-ready": B.value,
              onSubmit: G,
              onMore: U,
              onCancel: M[4] || (M[4] = (d) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          message: A(() => [
            h(ba, {
              text: a.value,
              "onUpdate:text": M[5] || (M[5] = (d) => a.value = d),
              pending: V.value,
              onSubmit: w,
              onCancel: M[6] || (M[6] = (d) => F(""))
            }, null, 8, ["text", "pending"])
          ]),
          retire: A(() => [
            h(xa, {
              reason: f.value,
              "onUpdate:reason": M[7] || (M[7] = (d) => f.value = d),
              pending: V.value,
              onSubmit: c,
              onCancel: M[8] || (M[8] = (d) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        O.value ? (t(), o("p", Ca, u(O.value), 1)) : m("", !0),
        L.value ? (t(), o("p", Sa, u(L.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, ja = /* @__PURE__ */ te(Aa, [["__scopeId", "data-v-8e1cadf9"]]), Ra = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ta = { class: "agent-head" }, za = ["data-state"], La = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Va = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ha = { class: "agent-times" }, Oa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ba = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ia = { class: "agent-line" }, Ea = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Na = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, _a = {
  key: 0,
  class: "agent-line agent-work-start"
}, qa = ["data-peek"], Fa = ["title"], Wa = ["data-peek"], Da = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Pa = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, Ua = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ja = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ka = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Za = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Ga = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ya = {
  key: 0,
  class: "agent-helper-brief"
}, Qa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Xa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, en = "It ended without a report", tn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = { helper: "Helper", reviewer: "Reviewer" }, i = ["started", "blocked", "open", "completed"], a = e, f = s, z = nt(), T = S(() => {
      var l, C;
      if ((l = a.facts) != null && l.profile_title) return a.facts.profile_title;
      if ((C = a.facts) != null && C.profile) return a.facts.profile;
      const r = n[a.row.role] || a.row.role;
      return r.slice(0, 1).toUpperCase() + r.slice(1);
    }), k = S(() => {
      var r;
      return ((r = a.facts) == null ? void 0 : r.tasks) ?? [];
    }), q = S(() => k.value.filter((r) => r.state === "open")), j = S(() => {
      const r = k.value.find((l) => {
        var C;
        return l.id === ((C = a.facts) == null ? void 0 : C.task_id);
      });
      return r != null && r.plan_id ? r : q.value.find((l) => l.plan_id);
    }), V = S(() => {
      var r, l, C, y, N;
      return a.row.role === "helper" ? ((r = a.facts) == null ? void 0 : r.helper_job) || "" : (l = a.facts) != null && l.job_enabled && (((C = a.facts) == null ? void 0 : C.task_title) || ((y = q.value[0]) == null ? void 0 : y.title) || ((N = k.value.at(-1)) == null ? void 0 : N.title)) || "";
    }), O = S(() => {
      var r;
      return ((r = a.facts) == null ? void 0 : r.job_returned) || a.row.job_returned || "";
    }), L = S(() => {
      const r = V.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return r ? `${r[1].toLowerCase() === "plan" ? "plans" : "docs"}:${r[2]}` : "";
    }), x = S(() => {
      var r, l;
      return [a.row.program, (r = a.facts) == null ? void 0 : r.model, (l = a.facts) == null ? void 0 : l.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role, a.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), $ = S(() => {
      var r, l;
      return a.row.ended_at && ((l = (r = a.facts) == null ? void 0 : r.job_returned) != null && l.startsWith(en)) ? a.facts.job_returned : "";
    }), E = S(() => lt(a.row.process_started_at || a.row.created_at, z.value)), B = /* @__PURE__ */ new Set(["open", "started", "testing"]), F = S(() => !!a.row.ended_at && a.row.role !== "main" && k.value.some((r) => B.has(r.state))), Z = S(() => {
      var r;
      return a.waitReason || F.value ? "waiting" : a.row.state === "running" && ((r = a.facts) == null ? void 0 : r.state) || a.row.state;
    }), U = S(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.completed_count) ?? k.value.filter((l) => l.state === "completed").length;
    }), D = S(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.task_count) ?? k.value.length;
    }), G = S(() => `${U.value} of ${D.value} ${D.value === 1 ? "task" : "tasks"}`), w = S(() => {
      var l;
      const r = ot(U.value, ((l = a.progress) == null ? void 0 : l.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, z.value);
      return a.row.role !== "main" && r ? `${r} per hour` : "";
    }), c = S(() => k.value.length ? i.map((r) => ({ state: r, label: r.slice(0, 1).toUpperCase() + r.slice(1), tasks: k.value.filter((l) => l.state === r || r === "started" && l.state === "testing" || r === "completed" && l.state === "cancelled") })) : []), v = /* @__PURE__ */ new Set(["completed"]), M = R({}), K = (r) => !(M.value[r] ?? v.has(r)), d = (r) => M.value = { ...M.value, [r]: K(r) }, H = je(), W = S(() => a.row.access === "read-only"), Y = S(() => !!a.row.retired_at || a.row.state === "retired"), Q = S(() => Y.value ? H.tabs.filter((r) => r.key === "transcript") : W.value ? H.tabs.filter((r) => ["transcript", "terminal"].includes(r.key)) : H.tabs), X = R(Q.value[0]);
    de(Q, (r) => {
      r.some((l) => {
        var C;
        return l.key === ((C = X.value) == null ? void 0 : C.key);
      }) || (X.value = r[0]);
    }), de(() => a.open, (r) => {
      r && (X.value = Q.value[0]);
    });
    const se = Object.fromEntries(H.tabs.filter((r) => r.component).map((r) => [r.key, Qe(() => st(r.component))])), ve = S(() => a.row.role === "helper" && !a.row.ended_at), pe = () => H.run(["helper", "stop", String(a.row.id)]), ue = R(!1), ie = R(""), me = R(""), he = S(() => a.row.role !== "main" && (!a.row.ended_at || F.value || a.waitReason));
    async function fe() {
      if (!he.value) return;
      const r = await H.read(`usage tool --agent ${a.row.id}`, { deferred: !0 });
      ie.value = r.ok ? r.value.tool : "", me.value = r.ok ? r.value.note : "";
    }
    const be = H.follow(["hook_call.*", "process_part.*"], Fe(fe, We.agentCommand));
    return Ae(() => be == null ? void 0 : be()), fe(), (r, l) => {
      var C, y, N, ce;
      return t(), o("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: l[6] || (l[6] = (P) => !e.open && f("toggle")),
        onKeydown: [
          l[7] || (l[7] = Le(oe((P) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          l[8] || (l[8] = Le(oe((P) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        b("span", Ta, [
          e.open ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: l[0] || (l[0] = oe((P) => f("toggle"), ["stop"]))
          }, [
            h(g(Te), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          b("span", {
            class: "agent-dot",
            "data-state": Z.value,
            "data-agent-motion": ""
          }, null, 8, za),
          b("span", La, u(T.value), 1),
          b("span", Va, u(((C = e.facts) == null ? void 0 : C.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (t(), _(g(Te), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          b("span", Ha, [
            e.row.ended_at && !F.value ? (t(), _(g(He), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (t(), o("span", Oa, u(E.value), 1)),
            (y = e.facts) != null && y.last_activity ? (t(), o("span", Ba, [
              l[9] || (l[9] = p("Last heard: ", -1)),
              h(g(He), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : m("", !0)
          ])
        ]),
        b("span", Ia, [
          b("span", Ea, u(x.value), 1),
          D.value && !V.value ? (t(), o("span", Na, u(G.value), 1)) : m("", !0)
        ]),
        j.value ? (t(), o("span", _a, [
          b("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${j.value.plan_id}`,
            onClick: l[1] || (l[1] = oe((P) => g(Se)(`plans:${j.value.plan_id}`), ["stop"]))
          }, "Plan " + u(j.value.plan_id) + ": " + u(j.value.plan_title), 9, qa)
        ])) : m("", !0),
        V.value ? (t(), o("span", {
          key: 1,
          class: re(["agent-line", { "agent-work-start": !j.value }])
        }, [
          b("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: V.value
          }, [
            L.value ? (t(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": L.value,
              onClick: l[2] || (l[2] = oe((P) => g(Se)(L.value), ["stop"]))
            }, u(V.value), 9, Wa)) : (t(), o(I, { key: 1 }, [
              p(u(V.value), 1)
            ], 64))
          ], 8, Fa),
          D.value ? (t(), o("span", Da, u(G.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        O.value ? (t(), o("p", Pa, [
          l[10] || (l[10] = b("span", null, "Last report: ", -1)),
          p(u(O.value), 1)
        ])) : m("", !0),
        e.row.retirement_reason ? (t(), o("p", Ua, "Retirement reason: " + u(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (t(), o("p", Ja, u(e.row.resume_reason), 1)) : m("", !0),
        h(ja, { row: e.row }, null, 8, ["row"]),
        !e.open && (he.value || D.value && w.value) ? (t(), o("span", {
          key: 5,
          class: re(["agent-foot", { "agent-work-start": !V.value && !j.value }]),
          "data-agent-foot": ""
        }, [
          he.value ? (t(), _(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: F.value,
            command: ie.value,
            note: me.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          D.value && w.value ? (t(), o("span", Ka, u(w.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (t(), o("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: l[5] || (l[5] = oe(() => {
          }, ["stop"]))
        }, [
          h(Xt, {
            agent: e.row,
            branch: (N = e.progress) == null ? void 0 : N.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: A(() => [
              ve.value ? (t(), _(g(ne), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: pe
              }, {
                default: A(() => [...l[11] || (l[11] = [
                  p("Stop", -1)
                ])]),
                _: 1
              })) : m("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          he.value ? (t(), _(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: F.value,
            command: ie.value,
            note: me.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          $.value ? (t(), o("p", Za, u($.value), 1)) : m("", !0),
          h(g(it), {
            class: "agent-tabs",
            tabs: Q.value,
            active: X.value,
            answer: { tasks: k.value.length },
            onChoose: l[3] || (l[3] = (P) => X.value = P)
          }, null, 8, ["tabs", "active", "answer"]),
          h(g(rt), {
            class: "agent-tab-body",
            tab: X.value,
            "data-agent-tab-body": (ce = X.value) == null ? void 0 : ce.key
          }, {
            default: A(() => {
              var P;
              return [
                h(g(qe), {
                  value: (P = X.value) == null ? void 0 : P.key
                }, Xe({
                  tasks: A(() => {
                    var J;
                    return [
                      k.value.length ? m("", !0) : (t(), _(g(De), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: A(() => [...l[12] || (l[12] = [
                          p("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (t(!0), o(I, null, ae(c.value, (le) => (t(), _(ra, {
                        key: le.state,
                        section: le,
                        open: K(le.state),
                        onToggle: (ge) => d(le.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (J = e.facts) != null && J.instruction ? (t(), o(I, { key: 1 }, [
                        l[13] || (l[13] = b("p", { class: "agent-label" }, "Instruction", -1)),
                        b("div", Ga, u(e.facts.instruction), 1)
                      ], 64)) : m("", !0)
                    ];
                  }),
                  transcript: A(() => {
                    var J;
                    return [
                      W.value ? (t(), o(I, { key: 0 }, [
                        (J = e.facts) != null && J.instruction ? (t(), o("div", Ya, [
                          h(g(Ne), {
                            label: "Instruction",
                            open: ue.value,
                            "data-agent-section": "instruction",
                            onToggle: l[4] || (l[4] = (le) => ue.value = !ue.value)
                          }, {
                            default: A(() => [
                              b("div", Qa, u(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (t(), o("p", Xa, "No job recorded")) : m("", !0)
                      ], 64)) : m("", !0),
                      h(pt, {
                        line: `agent transcript ${e.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ];
                  }),
                  _: 2
                }, [
                  ae(g(se), (J, le) => ({
                    name: le,
                    fn: A(() => [
                      (t(), _(et(J), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : m("", !0)
      ], 42, Ra);
    };
  }
}, an = /* @__PURE__ */ te(tn, [["__scopeId", "data-v-4312b32d"]]), nn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, ln = { class: "limits-head" }, on = ["data-agent-limit-type"], sn = { class: "limits-counts" }, rn = { key: 0 }, un = { key: 1 }, dn = { key: 0 }, cn = ["data-agent-limit-profile"], gn = { class: "limit-fields" }, vn = { class: "limit-field" }, pn = { class: "limit-field" }, mn = {
  key: 1,
  role: "alert"
}, hn = {
  key: 2,
  role: "status"
}, fn = {
  __name: "AgentLimits",
  setup(e) {
    const s = je(), n = R([]), i = R({}), a = R(!1), f = R(!1), z = R(""), T = R(""), k = (O) => O === 0 ? "no limit" : String(O);
    let q = 0;
    async function j() {
      const O = ++q, L = await s.read("agent limits");
      if (O !== q || (n.value = L.ok ? L.value.rows : [], z.value = L.ok ? "" : L.error, !L.ok)) return;
      const x = await Promise.all(n.value.flatMap(($) => [$.run_setting, $.kept_setting]).map(async ($) => {
        const E = await s.read(`setting show ${$}`);
        return [$, E.ok ? E.value.source : ""];
      }));
      O === q && (i.value = Object.fromEntries(x));
    }
    async function V(O, L, x, $) {
      if (f.value || s.readOnly) return;
      const E = Number($.target.value);
      if (!Number.isInteger(E) || E < 0 || !$.target.value.trim()) {
        z.value = "Use a whole number of 0 or more.", $.target.value = String(x);
        return;
      }
      f.value = !0, T.value = "";
      try {
        const B = await s.run(["setting", "set", L, String(E), "--environment", s.environment]);
        if (z.value = B.ok ? "" : B.error, !B.ok) {
          $.target.value = String(x);
          return;
        }
        await j(), T.value = `${O.label} limits saved.`;
      } finally {
        f.value = !1;
      }
    }
    return s.follow(["agent.*", "setting.*"], j), j(), (O, L) => (t(), o("section", nn, [
      n.value.length ? (t(), o(I, { key: 0 }, [
        b("div", ln, [
          L[1] || (L[1] = b("strong", null, "Agent limits", -1)),
          h(g(ne), {
            small: "",
            disabled: f.value || g(s).readOnly,
            "data-agent-limits-edit": "",
            onClick: L[0] || (L[0] = (x) => a.value = !a.value)
          }, {
            default: A(() => [
              p(u(a.value ? "Done" : "Edit limits"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        (t(!0), o(I, null, ae(n.value, (x) => (t(), o("div", {
          key: x.key,
          class: "type-limits",
          "data-agent-limit-type": x.key
        }, [
          b("div", sn, [
            b("strong", null, u(x.label), 1),
            x.per_profile ? (t(), o("span", rn, "Running: " + u(x.running) + " · Kept: " + u(x.kept), 1)) : (t(), o("span", un, "Running: " + u(x.running) + " of " + u(x.run_limit) + " · Kept: " + u(x.kept) + " of " + u(k(x.kept_limit)), 1))
          ]),
          x.per_profile ? (t(), o("p", dn, "Limits per profile: running " + u(x.run_limit) + ", kept " + u(k(x.kept_limit)) + ".", 1)) : m("", !0),
          (t(!0), o(I, null, ae(x.profiles, ($) => (t(), o("p", {
            key: $.profile,
            class: "profile-limits",
            "data-agent-limit-profile": $.profile
          }, u($.title) + ": running " + u($.running) + " of " + u($.run_limit) + " · kept " + u($.kept) + " of " + u(k($.kept_limit)), 9, cn))), 128)),
          a.value ? (t(), o(I, { key: 1 }, [
            b("div", gn, [
              b("label", vn, [
                b("span", null, [
                  L[2] || (L[2] = p("Running", -1)),
                  x.per_profile ? (t(), o(I, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                h(g(ze), {
                  type: "number",
                  min: "0",
                  value: String(x.run_limit),
                  disabled: f.value || g(s).readOnly,
                  "data-agent-run-limit": x.key,
                  onChange: ($) => V(x, x.run_setting, x.run_limit, $)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                b("small", null, u(i.value[x.run_setting]), 1)
              ]),
              b("label", pn, [
                b("span", null, [
                  L[3] || (L[3] = p("Kept", -1)),
                  x.per_profile ? (t(), o(I, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                h(g(ze), {
                  type: "number",
                  min: "0",
                  value: String(x.kept_limit),
                  disabled: f.value || g(s).readOnly,
                  "data-agent-kept-limit": x.key,
                  onChange: ($) => V(x, x.kept_setting, x.kept_limit, $)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                b("small", null, u(i.value[x.kept_setting]), 1)
              ])
            ]),
            b("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + u(g(s).environment) + ".", 1)
          ], 64)) : m("", !0)
        ], 8, on))), 128))
      ], 64)) : m("", !0),
      z.value ? (t(), o("p", mn, u(z.value), 1)) : m("", !0),
      T.value ? (t(), o("p", hn, u(T.value), 1)) : m("", !0)
    ]));
  }
}, kn = /* @__PURE__ */ te(fn, [["__scopeId", "data-v-92094f1b"]]), yn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, bn = ["data-agent-row"], Ie = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", wn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const s = e, { rows: n } = ut("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: i } = Oe("waits"), { rows: a } = Oe("progress"), f = (l) => a.value.find((C) => C.agent_id === l.id) ?? null, z = (l) => {
      var C;
      return ((C = i.value.find((y) => y.agent_id === l.id)) == null ? void 0 : C.reason) ?? "";
    }, T = R("running"), k = R(""), q = JSON.parse(localStorage.getItem(Ie) || '{"roles":[],"profiles":[],"programs":[]}'), j = R(q), V = R({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), O = R([]), L = S(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), x = (l, C) => {
      j.value = vt(j.value, l, C);
    }, $ = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, E = (l) => l.slice(0, 1).toUpperCase() + l.slice(1);
    de(j, (l) => localStorage.setItem(Ie, JSON.stringify(l)));
    const B = je();
    async function F() {
      const [l, C] = await Promise.all([B.read("agent cards --options"), B.read("agent programs")]);
      l.ok && (V.value = l.value), C.ok && (O.value = C.value.rows);
    }
    B.follow(["agent.*"], F), F();
    const Z = R([]), U = R(""), D = R(!1), G = R(!1), w = R(25);
    let c = 0;
    async function v() {
      const l = ++c, C = [
        ...j.value.roles.map((N) => `--role ${JSON.stringify(N)}`),
        ...j.value.profiles.map((N) => `--profile ${JSON.stringify(N)}`),
        ...j.value.programs.map((N) => `--program ${JSON.stringify(N)}`)
      ].join(" "), y = await B.read(`${s.line} --show ${T.value} --search ${JSON.stringify(k.value)} --limit ${w.value} ${C}`);
      l === c && (Z.value = y.ok ? y.value.rows : [], U.value = y.ok ? "" : y.error, G.value = y.ok && y.value.page * y.value.size < y.value.total, D.value = !0);
    }
    async function M() {
      return w.value += 25, await v(), !0;
    }
    de([T, k, j], () => {
      w.value = 25, v();
    }), B.follow(["agent.*", "task.*", ...B.sources.flatMap((l) => l.events)], Fe(v, We.pageOfAgents)), v();
    const K = (l) => n.value.find((C) => C.id === l.id) ?? l.facts ?? null, d = Z, H = S(() => !!k.value.trim() || L.value > 0), W = S(() => s.texts[T.value] ?? { title: s.empty, hint: "" }), Y = R(null), Q = R(null), X = R(null), se = S(() => d.value.find((l) => l.id === Y.value) ?? null), ve = S(() => se.value ? [se.value] : d.value), pe = S(() => d.value.length - ve.value.length), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ie = !1, me = 0;
    async function he(l) {
      if (ie) return;
      ie = !0, me = X.value.scrollTop;
      const C = Q.value.querySelector(`[data-agent-open="${l.id}"]`);
      if (!ue()) {
        const P = [...Q.value.querySelectorAll(".agent-row")].filter((J) => !J.contains(C));
        await Promise.all(P.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const y = [...C.querySelectorAll(".agent-head, .agent-line")], N = [...y, ...C.querySelectorAll("[data-agent-motion]")], ce = N.map((P) => P.getBoundingClientRect());
      if (Y.value = l.id, await Ve(), !ue()) {
        const P = N.map((J) => J.getBoundingClientRect());
        N.forEach((J, le) => {
          const ge = y.indexOf(J.parentElement), Je = ce[le].left - P[le].left - (ge < 0 ? 0 : ce[ge].left - P[ge].left), Ke = ce[le].top - P[le].top - (ge < 0 ? 0 : ce[ge].top - P[ge].top);
          J.animate([{ transform: `translate(${Je}px, ${Ke}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((J) => {
          J.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      ie = !1;
    }
    async function fe() {
      if (ie || !se.value) return;
      ie = !0;
      const l = Q.value.querySelector(`[data-agent-open="${Y.value}"]`), C = [...l.children, ...Q.value.querySelectorAll(".agents-held")], y = ue() ? [] : C.map((N) => N.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(y.map((N) => N.finished)), Y.value = null, await Ve(), X.value.scrollTop = me, y.forEach((N) => N.cancel()), ue() || (l.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), Q.value.querySelectorAll(".agent-row").forEach((N) => {
        N.contains(l) || N.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), ie = !1;
    }
    const be = (l) => Y.value === l.id ? fe() : he(l);
    de(k, (l) => l.trim() && (Y.value = null)), de(T, () => {
      Y.value = null;
    });
    const r = (l) => {
      l.key === "Escape" && fe();
    };
    return window.addEventListener("keydown", r), Ae(() => window.removeEventListener("keydown", r)), (l, C) => (t(), o("div", {
      ref_key: "agents",
      ref: Q,
      class: re(["agents", { focused: se.value }])
    }, [
      h(kn),
      h(g(dt), {
        modelValue: k.value,
        "onUpdate:modelValue": C[1] || (C[1] = (y) => k.value = y),
        placeholder: "Search agents",
        "menu-count": L.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          h(g(Re), null, {
            default: A(() => [...C[2] || (C[2] = [
              p("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(I, null, ae(V.value.roles, (y) => (t(), _(g(xe), {
            key: y,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(y),
            checked: j.value.roles.includes(y),
            "data-filter-role": y,
            onClick: (N) => x("roles", y)
          }, {
            default: A(() => [
              p(u(E(y)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (t(), _(g(Re), { key: 0 }, {
            default: A(() => [...C[3] || (C[3] = [
              p("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (t(!0), o(I, null, ae(V.value.profiles, (y) => (t(), _(g(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(y.name),
            checked: j.value.profiles.includes(y.name),
            "data-filter-profile": y.name,
            onClick: (N) => x("profiles", y.name)
          }, {
            default: A(() => [
              p(u(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          h(g(Re), null, {
            default: A(() => [...C[4] || (C[4] = [
              p("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(I, null, ae(O.value, (y) => (t(), _(g(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(y.name),
            checked: j.value.programs.includes(y.name),
            "data-filter-program": y.name,
            onClick: (N) => x("programs", y.name)
          }, {
            default: A(() => [
              p(u(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          L.value ? (t(), _(g(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: $
          }, {
            default: A(() => [...C[5] || (C[5] = [
              p("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: A(() => [
          h(g(ct), {
            options: V.value.states,
            value: T.value,
            onPick: C[0] || (C[0] = (y) => T.value = y)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      T.value === "retired" && V.value.upgrade_retired ? (t(), o("p", yn, "Retired during the upgrade: " + u(V.value.upgrade_retired), 1)) : m("", !0),
      b("div", {
        ref_key: "list",
        ref: X,
        class: re(["agents-view", { "agents-view-open": se.value }])
      }, [
        D.value && !U.value && !ve.value.length && L.value ? (t(), _(g(De), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            h(g(ne), {
              small: "",
              "data-empty-clear": "",
              onClick: $
            }, {
              default: A(() => [...C[6] || (C[6] = [
                p("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), _(g(gt), {
          key: 1,
          rows: ve.value,
          failure: U.value,
          loaded: D.value,
          more: !se.value && G.value,
          older: M,
          empty: W.value.title,
          hint: W.value.hint,
          searching: H.value
        }, {
          default: A(({ row: y }) => [
            b("div", {
              class: "agent-row",
              "data-agent-row": y.id
            }, [
              h(an, {
                row: y,
                facts: K(y),
                progress: f(y),
                "wait-reason": z(y),
                open: y.id === Y.value,
                onToggle: (N) => be(y)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, bn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      se.value && pe.value ? (t(), o("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: fe
      }, u(pe.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, Cn = /* @__PURE__ */ te(wn, [["__scopeId", "data-v-980c141c"]]);
export {
  Cn as A
};
