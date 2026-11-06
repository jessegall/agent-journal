/* @code-commandments-generated */
import { openBlock as n, createElementBlock as s, normalizeStyle as we, normalizeClass as ne, toDisplayString as m, createCommentVNode as y, createElementVNode as S, renderSlot as fe, computed as g, createVNode as w, withCtx as T, createTextVNode as k, Fragment as q, renderList as ce, onUnmounted as ye, ref as z, onMounted as Se, createBlock as j, Teleport as Re, mergeProps as Le, watch as he, toRef as Be, unref as b, withModifiers as ge, defineAsyncComponent as Oe, withKeys as ke, createSlots as Ee, resolveDynamicComponent as je, nextTick as be } from "vue";
import { peekRef as ze, Icon as Me, RunningCommand as Ie, FoldGroup as Ve, TaskStatusIcon as qe, useNow as Ne, age as We, perHour as De, useWindow as He, loadWindowComponent as Fe, TimeAgo as xe, Btn as Pe, InnerTabs as Ze, TabBody as Ke, SwitchCase as Ue, EmptyState as Ge, useRows as Ye, useDeclaredRows as $e, SearchBar as Je, Segmented as Qe, RowList as Xe } from "@journal/window-kit";
import { _ as oe, T as _e } from "./TranscriptRows-DCpyNUhv.mjs";
const et = ["stroke-width", "innerHTML"], F = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const v = e, c = { right: 0, down: 90, left: 180, up: 270 }, i = {
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
    }, t = {
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
    return (p, x) => (n(), s("svg", {
      class: "ico",
      style: we({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...v.facing === "right" ? {} : { transform: `rotate(${c[v.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[i[e.name] || e.name] || t.dot
    }, null, 12, et));
  }
}, tt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, at = {
  key: 1,
  class: "menu-item-text"
}, nt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (v, c) => (n(), s("button", {
      type: "button",
      class: ne(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", tt, m(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (n(), s("span", at, [
        S("span", null, [
          fe(v.$slots, "default", {}, void 0, !0)
        ]),
        S("small", null, m(e.description), 1)
      ])) : fe(v.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ue = /* @__PURE__ */ oe(nt, [["__scopeId", "data-v-9c67fe37"]]), ot = {}, lt = { class: "menu-label" };
function st(e, v) {
  return n(), s("span", lt, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ve = /* @__PURE__ */ oe(ot, [["render", st], ["__scopeId", "data-v-71c11156"]]), rt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, it = {
  key: 0,
  class: "skills-none"
}, ct = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: v }) {
    const c = e, i = v, t = g(() => c.skills.filter((x) => x.state === "loaded")), p = g(() => c.skills.filter((x) => x.state !== "loaded"));
    return (x, C) => (n(), s("div", rt, [
      w(ve, null, {
        default: T(() => [...C[1] || (C[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? y("", !0) : (n(), s("p", it, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(q, null, ce(t.value, (h) => (n(), s("p", {
        key: h.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        w(F, {
          name: "book",
          size: 12
        }),
        k(m(h.skill), 1)
      ]))), 128)),
      p.value.length ? (n(), s(q, { key: 1 }, [
        w(ve, null, {
          default: T(() => [...C[2] || (C[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(q, null, ce(p.value, (h) => (n(), s("p", {
          key: h.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          w(F, {
            name: "book",
            size: 12
          }),
          k(m(h.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      w(ue, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (h) => i("browse"))
      }, {
        default: T(() => [...C[3] || (C[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, dt = /* @__PURE__ */ oe(ct, [["__scopeId", "data-v-27140adf"]]), ut = (e, v, c) => Math.max(v, Math.min(c, e)), Ae = /* @__PURE__ */ new WeakMap(), ht = (e, v) => Ae.set(e, v);
function pt(e, v) {
  for (let c = v; c; c = Ae.get(c) ?? c.parentElement) if (c === e) return !0;
  return !1;
}
function gt(e, v) {
  const c = (i) => {
    var p, x;
    const t = ((p = e.value) == null ? void 0 : p.element) || ((x = e.value) == null ? void 0 : x.$el) || e.value;
    t && !pt(t, i.target) && v(i);
  };
  window.addEventListener("click", c), ye(() => window.removeEventListener("click", c));
}
const de = 8, vt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: v, emit: c }) {
    const i = e, t = z(null), p = (r) => r ? `${r}px` : void 0, x = g(() => ({
      minWidth: p(i.minWidth),
      maxWidth: p(i.maxWidth),
      maxHeight: p(i.maxHeight),
      height: p(i.height)
    })), C = z({ w: 0, h: 0 }), h = z(i.anchor ? i.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), E = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), Z = (r) => {
      const f = r.closest(".pane, .float-window");
      return f ? E(f.getBoundingClientRect()) : L();
    }, N = (r, f) => `${Math.max(0, r ? Math.min(r, f) : f)}px`;
    function G(r, f) {
      return {
        below: r.bottom - f.bottom - i.gap - de,
        above: f.top - r.top - i.gap - de,
        across: r.right - r.left - 2 * de
      };
    }
    function K(r) {
      const f = Z(i.anchor), H = G(f, r);
      return C.value.w <= H.across && C.value.h <= Math.max(H.below, H.above) ? f : L();
    }
    const V = g(() => {
      if (!h.value) return x.value;
      const r = h.value, f = K(r), H = G(f, r), { w: Q, h: pe } = C.value, ee = i.align === "auto" ? r.left + r.right > f.left + f.right : i.align === "right", le = ut(ee ? r.right - Q : r.left, f.left + de, Math.max(f.left + de, f.right - Q - de)), M = pe > H.below && H.above > H.below ? { bottom: `${window.innerHeight - r.top + i.gap}px`, maxHeight: N(i.maxHeight, H.above) } : { top: `${r.bottom + i.gap}px`, maxHeight: N(i.maxHeight, H.below) };
      return { ...x.value, ...M, left: `${le}px`, maxWidth: N(i.maxWidth, H.across) };
    }), B = c, R = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function I(r) {
      const f = R(), H = f.indexOf(document.activeElement);
      f[(H + r + f.length) % f.length].focus();
    }
    const U = { ArrowDown: () => I(1), ArrowUp: () => I(-1), Escape: () => B("close") }, W = (r) => U[r.key] && (r.preventDefault(), U[r.key]()), _ = () => t.value && (C.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let Y = 0;
    const l = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(_);
    });
    gt(t, (r) => i.anchor && !i.anchor.contains(r.target) && B("close"));
    const o = (r, f) => ["top", "left", "right", "bottom"].some((H) => Math.abs(r[H] - f[H]) > 1), d = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let O = 0;
    function J() {
      if (i.anchor) {
        const r = i.anchor.getBoundingClientRect();
        if (!i.anchor.isConnected || d(r)) return B("close");
        o(r, h.value) && (h.value = r);
      }
      O = requestAnimationFrame(J);
    }
    return Se(() => {
      i.anchor && t.value && ht(t.value, i.anchor), _(), t.value && l.observe(t.value), !i.plain && R()[0] && R()[0].focus(), J();
    }), ye(() => {
      l.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(Y);
    }), v({ element: t }), (r, f) => (n(), j(Re, {
      to: "body",
      disabled: !e.anchor
    }, [
      S("div", Le({
        ref_key: "panel",
        ref: t
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: W
      }), [
        fe(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ft = /* @__PURE__ */ oe(vt, [["__scopeId", "data-v-7f046e0d"]]);
async function mt(e, v, c) {
  if (!e) return c(v);
  const { target: i, fields: t } = e, p = Object.fromEntries(Object.keys(t).map((h) => [h, i[h]])), x = () => Object.assign(i, p);
  Object.assign(i, t);
  let C = !1;
  try {
    const h = await c(v);
    return C = h.ok, h;
  } finally {
    C || x();
  }
}
function yt(e, v, c) {
  const i = z([]), t = z([]), p = z({}), x = z(""), C = z(!1), h = g(() => !!e.value && !e.value.ended_at), L = g(() => h.value && !!e.value.paused_at);
  async function E() {
    if (h.value) {
      const B = await v(["agent", "controls", String(e.value.id)]);
      i.value = B.ok ? B.value.groups : [];
      return;
    }
    const V = await v(["agent", "programs"]);
    t.value = V.ok ? V.value.rows : [];
  }
  async function Z(V, B = null) {
    x.value = "";
    const R = await mt(B, V, v);
    return x.value = R.ok ? "" : R.error, c(), R;
  }
  const N = (V, B) => Z(["agent", "control", String(e.value.id), V, B.value], { target: p, fields: { value: { ...p.value, [V]: B.label } } }), G = () => (C.value = !1, Z(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), K = (V) => Z(["agent", "launch", V.name]);
  return Se(E), he(h, E), { groups: i, programs: t, chosen: p, failure: x, asking: C, running: h, paused: L, choose: N, stop: G, start: K };
}
const Te = { claude: "Claude Code", codex: "Codex" };
Object.entries(Te).map(([e, v]) => ({ key: e, label: v }));
function wt(e, v = "agent") {
  return Te[e] || v;
}
const Mt = ["disabled", "title"], kt = ["title"], bt = { class: "gauge usage" }, xt = ["disabled", "title"], $t = { class: "gauge" }, Ct = ["disabled", "title"], St = ["disabled"], zt = ["disabled"], Vt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ht = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, At = ["title"], Tt = 75, Rt = {
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
  setup(e, { emit: v }) {
    const c = e, i = v, t = yt(Be(c, "agent"), c.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => i("changed")), p = z(null), x = z(""), C = g(() => t.groups.value.find((l) => l.key === x.value));
    function h(l, o) {
      p.value = l.currentTarget, x.value = o;
    }
    function L() {
      p.value = null, x.value = "", t.asking.value = !1;
    }
    const E = z([]), Z = g(() => E.value.filter((l) => l.state === "loaded"));
    async function N() {
      const l = c.agent && c.run ? await c.run(["agent-skill", "list", "--agent", String(c.agent.id)]) : null;
      E.value = l != null && l.ok ? l.value.rows ?? [] : [];
    }
    function G(l) {
      h(l, "skills"), N();
    }
    he(() => {
      var l;
      return (l = c.agent) == null ? void 0 : l.id;
    }, N, { immediate: !0 });
    const K = (l) => t.groups.value.some((o) => o.key === l), V = g(() => {
      var l;
      return t.chosen.value.model ?? ((l = R.value) == null ? void 0 : l.model) ?? "";
    }), B = g(() => {
      var l;
      return t.chosen.value.effort ?? ((l = R.value) == null ? void 0 : l.effort) ?? "";
    });
    g(() => !!c.agent && !c.agent.ended_at);
    const R = g(() => {
      var l;
      return ((l = c.usage.agents) == null ? void 0 : l.find((o) => {
        var d;
        return o.id === ((d = c.agent) == null ? void 0 : d.id);
      })) ?? null;
    }), I = g(() => {
      var l;
      return ((l = c.usage.windows) == null ? void 0 : l[0]) ?? null;
    }), U = g(() => I.value ? Math.max(0, Math.min(100, Math.round(I.value.used_percent))) : null), W = g(() => {
      var l;
      return ((l = R.value) == null ? void 0 : l.context_percent) == null ? null : Math.round(R.value.context_percent);
    }), _ = g(() => {
      var l;
      return (l = R.value) != null && l.cost_dollars ? `$${R.value.cost_dollars.toFixed(2)}` : "";
    }), Y = g(() => {
      var d;
      const l = (d = c.agent) != null && d.process_started_at ? new Date(c.agent.process_started_at).getTime() : 0;
      if (!l) return "";
      const o = Math.max(0, Math.floor((c.now - l) / 6e4));
      return o >= 60 ? `${Math.floor(o / 60)}h ${o % 60}m` : `${o}m`;
    });
    return (l, o) => (n(), s("div", {
      class: ne(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (n(), s(q, { key: 0 }, [
        S("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: o[0] || (o[0] = (d) => h(d, "agent"))
        }, [
          w(F, {
            name: "agents",
            size: 12
          }),
          k(" " + m(b(wt)(e.agent.program)), 1)
        ], 8, Mt),
        U.value !== null ? (n(), s("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${U.value}% of the plan's ${I.value.title} allowance used`,
          onClick: o[1] || (o[1] = (d) => i("open", "usage", d.currentTarget))
        }, [
          w(F, {
            name: "clock",
            size: 12
          }),
          o[14] || (o[14] = k()),
          S("span", bt, [
            S("span", {
              style: we({ width: `${U.value}%` })
            }, null, 4)
          ]),
          k(" " + m(U.value) + "% ", 1)
        ], 8, kt)) : y("", !0),
        W.value !== null ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${W.value}% full: clear or compact it`,
          onClick: o[2] || (o[2] = (d) => K("context") ? h(d, "context") : i("open", "context", d.currentTarget))
        }, [
          w(F, {
            name: "gauge",
            size: 12
          }),
          o[15] || (o[15] = k()),
          S("span", $t, [
            S("span", {
              style: we({ width: `${W.value}%` })
            }, null, 4)
          ]),
          k(" " + m(W.value) + "% ", 1)
        ], 8, xt)) : y("", !0),
        V.value ? (n(), s("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${V.value}: change the model`,
          onClick: o[3] || (o[3] = (d) => K("model") ? h(d, "model") : null)
        }, [
          w(F, {
            name: "model",
            size: 12
          }),
          k(" " + m(V.value), 1)
        ], 8, Ct)) : y("", !0),
        K("effort") || e.card && B.value ? (n(), s("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: o[4] || (o[4] = (d) => h(d, "effort"))
        }, [
          w(F, {
            name: "bolt",
            size: 12
          }),
          k(" " + m(B.value), 1)
        ], 8, St)) : y("", !0),
        _.value ? (n(), s("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: o[5] || (o[5] = (d) => i("open", "cost", d.currentTarget))
        }, m(_.value), 9, zt)) : y("", !0),
        Y.value ? (n(), s("span", Vt, [
          w(F, {
            name: "reminders",
            size: 12
          }),
          k(" " + m(Y.value), 1)
        ])) : y("", !0),
        e.branch ? (n(), s("span", Ht, [
          w(F, {
            name: "branch",
            size: 12
          }),
          k(" " + m(e.branch), 1)
        ])) : y("", !0),
        e.card ? y("", !0) : (n(), s("button", {
          key: 7,
          type: "button",
          class: ne(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: o[6] || (o[6] = (d) => i("open", "jobs", d.currentTarget))
        }, [
          w(F, {
            name: "clock",
            size: 12
          }),
          k(" " + m(e.jobs), 1)
        ], 2)),
        e.run ? (n(), s("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: G
        }, [
          w(F, {
            name: "book",
            size: 12
          }),
          k(" " + m(Z.value.length), 1)
        ])) : y("", !0),
        e.fitness ? (n(), s(q, { key: 9 }, [
          S("button", {
            type: "button",
            class: ne(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Tt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: o[7] || (o[7] = (d) => i("open", "fitness", d.currentTarget))
          }, [
            w(F, {
              name: "heart",
              size: 12
            }),
            k(" " + m(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          S("button", {
            type: "button",
            class: ne(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: o[8] || (o[8] = (d) => i("open", "load", d.currentTarget))
          }, [
            w(F, {
              name: "weight",
              size: 12
            }),
            k(" " + m(e.fitness.workload), 1)
          ], 2)
        ], 64)) : y("", !0)
      ], 64)) : e.run && !e.loading ? (n(), s("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: o[9] || (o[9] = (d) => h(d, "start"))
      }, [
        w(F, {
          name: "agents",
          size: 12
        }),
        o[16] || (o[16] = k(" Start an agent", -1))
      ])) : y("", !0),
      o[22] || (o[22] = S("span", { class: "space" }, null, -1)),
      b(t).failure.value ? (n(), s("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: b(t).failure.value
      }, m(b(t).failure.value), 9, At)) : y("", !0),
      fe(l.$slots, "default", {}, void 0, !0),
      p.value ? (n(), j(ft, {
        key: 3,
        anchor: p.value,
        "min-width": 190,
        onClose: L
      }, {
        default: T(() => [
          x.value === "agent" ? (n(), s(q, { key: 0 }, [
            b(t).asking.value ? (n(), s(q, { key: 0 }, [
              w(ve, { "data-agent-stop-ask": "" }, {
                default: T(() => [...o[17] || (o[17] = [
                  k("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              w(ue, {
                "data-agent-stop-confirm": "",
                onClick: o[10] || (o[10] = (d) => (L(), b(t).stop()))
              }, {
                default: T(() => [...o[18] || (o[18] = [
                  k("Stop it", -1)
                ])]),
                _: 1
              }),
              w(ue, {
                onClick: o[11] || (o[11] = (d) => b(t).asking.value = !1)
              }, {
                default: T(() => [...o[19] || (o[19] = [
                  k("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (n(), j(ue, {
              key: 1,
              "data-agent-stop": "",
              onClick: o[12] || (o[12] = (d) => b(t).asking.value = !0)
            }, {
              default: T(() => [...o[20] || (o[20] = [
                k("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : x.value === "start" ? (n(), s(q, { key: 1 }, [
            w(ve, null, {
              default: T(() => [...o[21] || (o[21] = [
                k("Start an agent", -1)
              ])]),
              _: 1
            }),
            (n(!0), s(q, null, ce(b(t).programs.value, (d) => (n(), j(ue, {
              key: d.name,
              "data-agent-program": d.name,
              onClick: (O) => (L(), b(t).start(d))
            }, {
              default: T(() => [
                k(m(d.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : x.value === "skills" ? (n(), j(dt, {
            key: 2,
            skills: E.value,
            onBrowse: o[13] || (o[13] = (d) => (L(), i("open", "skills", null)))
          }, null, 8, ["skills"])) : C.value ? (n(), s(q, { key: 3 }, [
            w(ve, null, {
              default: T(() => [
                k(m(C.value.label), 1)
              ]),
              _: 1
            }),
            (n(!0), s(q, null, ce(C.value.choices, (d) => (n(), j(ue, {
              key: d.value,
              "data-agent-choice": d.value,
              onClick: (O) => (b(t).choose(C.value.key, d), L())
            }, {
              default: T(() => [
                k(m(d.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : y("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : y("", !0)
    ], 2));
  }
}, Lt = /* @__PURE__ */ oe(Rt, [["__scopeId", "data-v-9b2b9486"]]), Bt = {
  class: "agent-command",
  "data-agent-command": ""
}, Ot = {
  key: 1,
  "data-agent-stopped": ""
}, Et = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (v, c) => (n(), s("span", Bt, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: c[0] || (c[0] = ge((i) => b(ze)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + m(e.waitReason) + " ", 1),
        w(b(Me), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ot, "Waiting")) : (n(), j(b(Ie), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ce = /* @__PURE__ */ oe(Et, [["__scopeId", "data-v-bb905922"]]), jt = ["data-agent-delegated", "onClick"], It = { class: "agent-task-number" }, qt = { class: "agent-task-title" }, Nt = ["title"], Wt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: v }) {
    const c = v;
    return (i, t) => (n(), j(b(Ve), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (p) => c("toggle"))
    }, {
      default: T(() => [
        (n(!0), s(q, null, ce(e.section.tasks, (p) => (n(), s("button", {
          key: p.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": p.id,
          onClick: (x) => b(ze)(`tasks:${p.id}`)
        }, [
          w(b(qe), {
            status: p.state
          }, null, 8, ["status"]),
          S("span", It, m(p.id), 1),
          S("span", qt, m(p.title), 1),
          p.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${p.plan_id}: ${p.plan_title}`
          }, "Plan " + m(p.plan_id) + ": " + m(p.plan_title), 9, Nt)) : y("", !0)
        ], 8, jt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Dt = /* @__PURE__ */ oe(Wt, [["__scopeId", "data-v-acc154a9"]]), Ft = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Pt = { class: "agent-head" }, Zt = ["data-state"], Kt = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ut = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Gt = { class: "agent-times" }, Yt = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Jt = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Qt = { class: "agent-line" }, Xt = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, _t = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ea = {
  key: 0,
  class: "agent-line agent-work-start"
}, ta = ["title"], aa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, na = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, oa = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, la = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, sa = {
  key: 0,
  class: "agent-helper-brief"
}, ra = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ia = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ca = "It ended without a report", da = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: v }) {
    const c = { helper: "Helper", reviewer: "Reviewer" }, i = ["started", "blocked", "open", "completed"], t = e, p = v, x = Ne(), C = g(() => {
      var u;
      const a = ((u = t.facts) == null ? void 0 : u.profile) || c[t.row.role] || t.row.role;
      return a.slice(0, 1).toUpperCase() + a.slice(1);
    }), h = g(() => {
      var a;
      return ((a = t.facts) == null ? void 0 : a.tasks) ?? [];
    }), L = g(() => h.value.filter((a) => a.state === "open")), E = g(() => {
      var a, u, D;
      return (a = t.facts) != null && a.job_enabled && (((u = t.facts) == null ? void 0 : u.task_title) || ((D = L.value[0]) == null ? void 0 : D.title)) || "";
    }), Z = g(() => {
      var a, u;
      return [t.row.program, (a = t.facts) == null ? void 0 : a.model, (u = t.facts) == null ? void 0 : u.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), N = g(() => {
      var a, u;
      return t.row.ended_at && ((u = (a = t.facts) == null ? void 0 : a.job_returned) != null && u.startsWith(ca)) ? t.facts.job_returned : "";
    }), G = g(() => We(t.row.process_started_at || t.row.created_at, x.value)), K = /* @__PURE__ */ new Set(["open", "started", "testing"]), V = g(() => !!t.row.ended_at && t.row.role !== "main" && h.value.some((a) => K.has(a.state))), B = g(() => {
      var a;
      return t.waitReason || V.value ? "waiting" : t.row.state === "running" && ((a = t.facts) == null ? void 0 : a.state) || t.row.state;
    }), R = g(() => {
      var a;
      return ((a = t.progress) == null ? void 0 : a.completed_count) ?? h.value.filter((u) => u.state === "completed").length;
    }), I = g(() => {
      var a;
      return ((a = t.progress) == null ? void 0 : a.task_count) ?? h.value.length;
    }), U = g(() => `${R.value} of ${I.value} ${I.value === 1 ? "task" : "tasks"}`), W = g(() => {
      var u;
      const a = De(R.value, ((u = t.progress) == null ? void 0 : u.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, x.value);
      return t.row.role !== "main" && a ? `${a} per hour` : "";
    }), _ = g(() => h.value.length ? i.map((a) => ({ state: a, label: a.slice(0, 1).toUpperCase() + a.slice(1), tasks: h.value.filter((u) => u.state === a || a === "started" && u.state === "testing" || a === "completed" && u.state === "cancelled") })) : []), Y = /* @__PURE__ */ new Set(["completed"]), l = z({}), o = (a) => !(l.value[a] ?? Y.has(a)), d = (a) => l.value = { ...l.value, [a]: o(a) }, O = He(), J = g(() => t.row.access === "read-only"), r = g(() => J.value ? O.tabs.filter((a) => ["transcript", "terminal"].includes(a.key)) : O.tabs), f = z(r.value[0]);
    he(() => t.open, (a) => {
      a && (f.value = r.value[0]);
    });
    const H = Object.fromEntries(O.tabs.filter((a) => a.component).map((a) => [a.key, Oe(() => Fe(a.component))])), Q = g(() => t.row.role === "helper" && !t.row.ended_at), pe = () => O.run(["helper", "stop", String(t.row.id)]), ee = z(!1), le = z(""), se = z(""), M = g(() => t.row.role !== "main" && (!t.row.ended_at || V.value || t.waitReason));
    async function $() {
      if (!M.value) return;
      const a = await O.read(`usage tool --agent ${t.row.id}`);
      le.value = a.ok ? a.value.tool : "", se.value = a.ok ? a.value.note : "";
    }
    const A = O.follow(["hook_call.*", "process_part.*"], $);
    return ye(() => A == null ? void 0 : A()), $(), (a, u) => {
      var D, P, re, te;
      return n(), s("div", {
        class: ne(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: u[4] || (u[4] = (X) => !e.open && p("toggle")),
        onKeydown: [
          u[5] || (u[5] = ke(ge((X) => !e.open && p("toggle"), ["self", "prevent"]), ["enter"])),
          u[6] || (u[6] = ke(ge((X) => !e.open && p("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        S("span", Pt, [
          e.open ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: u[0] || (u[0] = ge((X) => p("toggle"), ["stop"]))
          }, [
            w(b(Me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          S("span", {
            class: "agent-dot",
            "data-state": B.value,
            "data-agent-motion": ""
          }, null, 8, Zt),
          S("span", Kt, m(C.value), 1),
          S("span", Ut, m(((D = e.facts) == null ? void 0 : D.given_name) || e.row.id), 1),
          e.open ? y("", !0) : (n(), j(b(Me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          S("span", Gt, [
            e.row.ended_at && !V.value ? (n(), j(b(xe), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (n(), s("span", Yt, m(G.value), 1)),
            (P = e.facts) != null && P.last_activity ? (n(), s("span", Jt, [
              u[7] || (u[7] = k("Last heard: ", -1)),
              w(b(xe), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : y("", !0)
          ])
        ]),
        S("span", Qt, [
          S("span", Xt, m(Z.value), 1),
          I.value && !E.value ? (n(), s("span", _t, m(U.value), 1)) : y("", !0)
        ]),
        E.value ? (n(), s("span", ea, [
          S("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: E.value
          }, m(E.value), 9, ta),
          I.value ? (n(), s("span", aa, m(U.value), 1)) : y("", !0)
        ])) : y("", !0),
        !e.open && (M.value || I.value && W.value) ? (n(), s("span", {
          key: 1,
          class: ne(["agent-foot", { "agent-work-start": !E.value }]),
          "data-agent-foot": ""
        }, [
          M.value ? (n(), j(Ce, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: V.value,
            command: le.value,
            note: se.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
          I.value && W.value ? (n(), s("span", na, m(W.value), 1)) : y("", !0)
        ], 2)) : y("", !0),
        e.open ? (n(), s("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: u[3] || (u[3] = ge(() => {
          }, ["stop"]))
        }, [
          w(Lt, {
            agent: e.row,
            branch: (re = e.progress) == null ? void 0 : re.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: T(() => [
              Q.value ? (n(), j(b(Pe), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: pe
              }, {
                default: T(() => [...u[8] || (u[8] = [
                  k("Stop", -1)
                ])]),
                _: 1
              })) : y("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          M.value ? (n(), j(Ce, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: V.value,
            command: le.value,
            note: se.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
          N.value ? (n(), s("p", oa, m(N.value), 1)) : y("", !0),
          w(b(Ze), {
            class: "agent-tabs",
            tabs: r.value,
            active: f.value,
            answer: { tasks: h.value.length },
            onChoose: u[1] || (u[1] = (X) => f.value = X)
          }, null, 8, ["tabs", "active", "answer"]),
          w(b(Ke), {
            class: "agent-tab-body",
            tab: f.value,
            "data-agent-tab-body": (te = f.value) == null ? void 0 : te.key
          }, {
            default: T(() => {
              var X;
              return [
                w(b(Ue), {
                  value: (X = f.value) == null ? void 0 : X.key
                }, Ee({
                  tasks: T(() => {
                    var ae;
                    return [
                      h.value.length ? y("", !0) : (n(), j(b(Ge), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: T(() => [...u[9] || (u[9] = [
                          k("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (n(!0), s(q, null, ce(_.value, (ie) => (n(), j(Dt, {
                        key: ie.state,
                        section: ie,
                        open: o(ie.state),
                        onToggle: (ga) => d(ie.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (ae = e.facts) != null && ae.instruction ? (n(), s(q, { key: 1 }, [
                        u[10] || (u[10] = S("p", { class: "agent-label" }, "Instruction", -1)),
                        S("div", la, m(e.facts.instruction), 1)
                      ], 64)) : y("", !0)
                    ];
                  }),
                  transcript: T(() => {
                    var ae;
                    return [
                      J.value ? (n(), s(q, { key: 0 }, [
                        (ae = e.facts) != null && ae.instruction ? (n(), s("div", sa, [
                          w(b(Ve), {
                            label: "Instruction",
                            open: ee.value,
                            "data-agent-section": "instruction",
                            onToggle: u[2] || (u[2] = (ie) => ee.value = !ee.value)
                          }, {
                            default: T(() => [
                              S("div", ra, m(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (n(), s("p", ia, "No job recorded")) : y("", !0)
                      ], 64)) : y("", !0),
                      w(_e, {
                        line: `agent transcript ${e.row.id}`,
                        agent: J.value ? Q.value ? e.row.id : null : e.row.id,
                        helper: J.value && Q.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  ce(b(H), (ae, ie) => ({
                    name: ie,
                    fn: T(() => [
                      (n(), j(je(ae), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : y("", !0)
      ], 42, Ft);
    };
  }
}, ua = /* @__PURE__ */ oe(da, [["__scopeId", "data-v-fc2155e0"]]), ha = ["data-agent-row"], me = "cubic-bezier(0.2, 0.9, 0.25, 1)", pa = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const v = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], c = e, { rows: i } = Ye("usage agents --closed", ["agent.*", "task.*", "hook_call.*"]), { rows: t } = $e("waits"), { rows: p } = $e("progress"), x = (M) => p.value.find(($) => $.agent_id === M.id) ?? null, C = (M) => {
      var $;
      return (($ = t.value.find((A) => A.agent_id === M.id)) == null ? void 0 : $.reason) ?? "";
    }, h = z("running"), L = z(""), E = He(), Z = z([]), N = z(""), G = z(!1), K = z(!1), V = z(25);
    let B = 0;
    async function R() {
      const M = ++B, $ = await E.read(`${c.line} --show ${h.value} --search ${JSON.stringify(L.value)} --limit ${V.value}`);
      M === B && (Z.value = $.ok ? $.value.rows : [], N.value = $.ok ? "" : $.error, K.value = $.ok && $.value.page * $.value.size < $.value.total, G.value = !0);
    }
    async function I() {
      return V.value += 25, await R(), !0;
    }
    he([h, L], () => {
      V.value = 25, R();
    }), E.follow(["agent.*", "task.*", ...E.sources.flatMap((M) => M.events)], R), R();
    const U = (M) => i.value.find(($) => $.id === M.id) ?? null, W = Z, _ = g(() => !!L.value.trim()), Y = g(() => c.texts[h.value] ?? { title: c.empty, hint: "" }), l = z(null), o = z(null), d = z(null), O = g(() => W.value.find((M) => M.id === l.value) ?? null), J = g(() => O.value ? [O.value] : W.value), r = g(() => W.value.length - J.value.length), f = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let H = !1, Q = 0;
    async function pe(M) {
      if (H) return;
      H = !0, Q = d.value.scrollTop;
      const $ = o.value.querySelector(`[data-agent-open="${M.id}"]`);
      if (!f()) {
        const D = [...o.value.querySelectorAll(".agent-row")].filter((P) => !P.contains($));
        await Promise.all(D.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const A = [...$.querySelectorAll(".agent-head, .agent-line")], a = [...A, ...$.querySelectorAll("[data-agent-motion]")], u = a.map((D) => D.getBoundingClientRect());
      if (l.value = M.id, await be(), !f()) {
        const D = a.map((P) => P.getBoundingClientRect());
        a.forEach((P, re) => {
          const te = A.indexOf(P.parentElement), X = u[re].left - D[re].left - (te < 0 ? 0 : u[te].left - D[te].left), ae = u[re].top - D[re].top - (te < 0 ? 0 : u[te].top - D[te].top);
          P.animate([{ transform: `translate(${X}px, ${ae}px)` }, { transform: "none" }], { duration: 280, easing: me });
        }), o.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((P) => {
          P.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: me, fill: "backwards" });
        });
      }
      H = !1;
    }
    async function ee() {
      if (H || !O.value) return;
      H = !0;
      const M = o.value.querySelector(`[data-agent-open="${l.value}"]`), $ = [...M.children, ...o.value.querySelectorAll(".agents-held")], A = f() ? [] : $.map((a) => a.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(A.map((a) => a.finished)), l.value = null, await be(), d.value.scrollTop = Q, A.forEach((a) => a.cancel()), f() || (M.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: me }), o.value.querySelectorAll(".agent-row").forEach((a) => {
        a.contains(M) || a.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: me });
      })), H = !1;
    }
    const le = (M) => l.value === M.id ? ee() : pe(M);
    he(L, (M) => M.trim() && (l.value = null)), he(h, () => {
      l.value = null;
    });
    const se = (M) => {
      M.key === "Escape" && ee();
    };
    return window.addEventListener("keydown", se), ye(() => window.removeEventListener("keydown", se)), (M, $) => (n(), s("div", {
      ref_key: "agents",
      ref: o,
      class: ne(["agents", { focused: O.value }])
    }, [
      w(b(Je), {
        modelValue: L.value,
        "onUpdate:modelValue": $[1] || ($[1] = (A) => L.value = A),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: T(() => [
          w(b(Qe), {
            options: v,
            value: h.value,
            onPick: $[0] || ($[0] = (A) => h.value = A)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      S("div", {
        ref_key: "list",
        ref: d,
        class: ne(["agents-view", { "agents-view-open": O.value }])
      }, [
        w(b(Xe), {
          rows: J.value,
          failure: N.value,
          loaded: G.value,
          more: !O.value && K.value,
          older: I,
          empty: Y.value.title,
          hint: Y.value.hint,
          searching: _.value
        }, {
          default: T(({ row: A }) => [
            S("div", {
              class: "agent-row",
              "data-agent-row": A.id
            }, [
              w(ua, {
                row: A,
                facts: U(A),
                progress: x(A),
                "wait-reason": C(A),
                open: A.id === l.value,
                onToggle: (a) => le(A)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ha)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      O.value && r.value ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: ee
      }, m(r.value) + " more", 1)) : y("", !0)
    ], 2));
  }
}, ya = /* @__PURE__ */ oe(pa, [["__scopeId", "data-v-8a9667a8"]]);
export {
  ya as A
};
