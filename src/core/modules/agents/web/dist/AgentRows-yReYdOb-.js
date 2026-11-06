/* @code-commandments-generated */
import { openBlock as a, createElementBlock as l, normalizeStyle as Me, normalizeClass as te, toDisplayString as f, createCommentVNode as m, createElementVNode as z, renderSlot as fe, computed as g, createVNode as y, withCtx as A, createTextVNode as k, Fragment as q, renderList as de, onUnmounted as we, ref as V, onMounted as Ve, createBlock as N, Teleport as Le, mergeProps as je, watch as ge, toRef as Be, unref as b, withModifiers as he, defineAsyncComponent as Oe, withKeys as xe, createSlots as Ee, resolveDynamicComponent as Ie, nextTick as $e } from "vue";
import { peekRef as be, Icon as ke, RunningCommand as qe, FoldGroup as He, TaskStatusIcon as Ne, useNow as We, age as De, perHour as Fe, useWindow as Ae, loadWindowComponent as Pe, TimeAgo as Ce, Btn as Ze, InnerTabs as Ke, TabBody as Ue, SwitchCase as Ge, EmptyState as Ye, useRows as Je, useDeclaredRows as Se, SearchBar as Qe, Segmented as Xe, RowList as _e } from "@journal/window-kit";
import { _ as ae, T as et } from "./TranscriptRows-ByPSYos4.js";
const tt = ["stroke-width", "innerHTML"], F = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const v = e, d = { right: 0, down: 90, left: 180, up: 270 }, c = {
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
    return (p, $) => (a(), l("svg", {
      class: "ico",
      style: Me({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...v.facing === "right" ? {} : { transform: `rotate(${d[v.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[c[e.name] || e.name] || t.dot
    }, null, 12, tt));
  }
}, at = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, nt = {
  key: 1,
  class: "menu-item-text"
}, ot = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (v, d) => (a(), l("button", {
      type: "button",
      class: te(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", at, f(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (a(), l("span", nt, [
        z("span", null, [
          fe(v.$slots, "default", {}, void 0, !0)
        ]),
        z("small", null, f(e.description), 1)
      ])) : fe(v.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, pe = /* @__PURE__ */ ae(ot, [["__scopeId", "data-v-fec99974"]]), lt = {}, st = { class: "menu-label" };
function rt(e, v) {
  return a(), l("span", st, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ve = /* @__PURE__ */ ae(lt, [["render", rt], ["__scopeId", "data-v-aa955b3e"]]), it = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ct = {
  key: 0,
  class: "skills-none"
}, dt = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: v }) {
    const d = e, c = v, t = g(() => d.skills.filter(($) => $.state === "loaded")), p = g(() => d.skills.filter(($) => $.state !== "loaded"));
    return ($, S) => (a(), l("div", it, [
      y(ve, null, {
        default: A(() => [...S[1] || (S[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? m("", !0) : (a(), l("p", ct, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(q, null, de(t.value, (h) => (a(), l("p", {
        key: h.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(F, {
          name: "book",
          size: 12
        }),
        k(f(h.skill), 1)
      ]))), 128)),
      p.value.length ? (a(), l(q, { key: 1 }, [
        y(ve, null, {
          default: A(() => [...S[2] || (S[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(q, null, de(p.value, (h) => (a(), l("p", {
          key: h.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(F, {
            name: "book",
            size: 12
          }),
          k(f(h.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      y(pe, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (h) => c("browse"))
      }, {
        default: A(() => [...S[3] || (S[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ut = /* @__PURE__ */ ae(dt, [["__scopeId", "data-v-be514d47"]]), ht = (e, v, d) => Math.max(v, Math.min(d, e)), Te = /* @__PURE__ */ new WeakMap(), pt = (e, v) => Te.set(e, v);
function gt(e, v) {
  for (let d = v; d; d = Te.get(d) ?? d.parentElement) if (d === e) return !0;
  return !1;
}
function vt(e, v) {
  const d = (c) => {
    var p, $;
    const t = ((p = e.value) == null ? void 0 : p.element) || (($ = e.value) == null ? void 0 : $.$el) || e.value;
    t && !gt(t, c.target) && v(c);
  };
  window.addEventListener("click", d), we(() => window.removeEventListener("click", d));
}
const ue = 8, ft = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: v, emit: d }) {
    const c = e, t = V(null), p = (s) => s ? `${s}px` : void 0, $ = g(() => ({
      minWidth: p(c.minWidth),
      maxWidth: p(c.maxWidth),
      maxHeight: p(c.maxHeight),
      height: p(c.height)
    })), S = V({ w: 0, h: 0 }), h = V(c.anchor ? c.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), j = (s) => ({
      left: Math.max(0, s.left),
      top: Math.max(0, s.top),
      right: Math.min(window.innerWidth, s.right),
      bottom: Math.min(window.innerHeight, s.bottom)
    }), W = (s) => {
      const w = s.closest(".pane, .float-window");
      return w ? j(w.getBoundingClientRect()) : B();
    }, P = (s, w) => `${Math.max(0, s ? Math.min(s, w) : w)}px`;
    function K(s, w) {
      return {
        below: s.bottom - w.bottom - c.gap - ue,
        above: w.top - s.top - c.gap - ue,
        across: s.right - s.left - 2 * ue
      };
    }
    function U(s) {
      const w = W(c.anchor), C = K(w, s);
      return S.value.w <= C.across && S.value.h <= Math.max(C.below, C.above) ? w : B();
    }
    const R = g(() => {
      if (!h.value) return $.value;
      const s = h.value, w = U(s), C = K(w, s), { w: ne, h: oe } = S.value, le = c.align === "auto" ? s.left + s.right > w.left + w.right : c.align === "right", se = ht(le ? s.right - ne : s.left, w.left + ue, Math.max(w.left + ue, w.right - ne - ue)), M = oe > C.below && C.above > C.below ? { bottom: `${window.innerHeight - s.top + c.gap}px`, maxHeight: P(c.maxHeight, C.above) } : { top: `${s.bottom + c.gap}px`, maxHeight: P(c.maxHeight, C.below) };
      return { ...$.value, ...M, left: `${se}px`, maxWidth: P(c.maxWidth, C.across) };
    }), H = d, L = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function Y(s) {
      const w = L(), C = w.indexOf(document.activeElement);
      w[(C + s + w.length) % w.length].focus();
    }
    const E = { ArrowDown: () => Y(1), ArrowUp: () => Y(-1), Escape: () => H("close") }, Z = (s) => E[s.key] && (s.preventDefault(), E[s.key]()), J = () => t.value && (S.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let Q = 0;
    const r = new ResizeObserver(() => {
      cancelAnimationFrame(Q), Q = requestAnimationFrame(J);
    });
    vt(t, (s) => c.anchor && !c.anchor.contains(s.target) && H("close"));
    const n = (s, w) => ["top", "left", "right", "bottom"].some((C) => Math.abs(s[C] - w[C]) > 1), u = (s) => s.bottom < 0 || s.top > window.innerHeight;
    let D = 0;
    function G() {
      if (c.anchor) {
        const s = c.anchor.getBoundingClientRect();
        if (!c.anchor.isConnected || u(s)) return H("close");
        n(s, h.value) && (h.value = s);
      }
      D = requestAnimationFrame(G);
    }
    return Ve(() => {
      c.anchor && t.value && pt(t.value, c.anchor), J(), t.value && r.observe(t.value), !c.plain && L()[0] && L()[0].focus(), G();
    }), we(() => {
      r.disconnect(), cancelAnimationFrame(D), cancelAnimationFrame(Q);
    }), v({ element: t }), (s, w) => (a(), N(Le, {
      to: "body",
      disabled: !e.anchor
    }, [
      z("div", je({
        ref_key: "panel",
        ref: t
      }, s.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: R.value,
        onKeydown: Z
      }), [
        fe(s.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), mt = /* @__PURE__ */ ae(ft, [["__scopeId", "data-v-3d203970"]]);
async function yt(e, v, d) {
  if (!e) return d(v);
  const { target: c, fields: t } = e, p = Object.fromEntries(Object.keys(t).map((h) => [h, c[h]])), $ = () => Object.assign(c, p);
  Object.assign(c, t);
  let S = !1;
  try {
    const h = await d(v);
    return S = h.ok, h;
  } finally {
    S || $();
  }
}
function wt(e, v, d) {
  const c = V([]), t = V([]), p = V({}), $ = V(""), S = V(!1), h = g(() => !!e.value && !e.value.ended_at), B = g(() => h.value && !!e.value.paused_at);
  async function j() {
    if (h.value) {
      const H = await v(["agent", "controls", String(e.value.id)]);
      c.value = H.ok ? H.value.groups : [];
      return;
    }
    const R = await v(["agent", "programs"]);
    t.value = R.ok ? R.value.rows : [];
  }
  async function W(R, H = null) {
    $.value = "";
    const L = await yt(H, R, v);
    return $.value = L.ok ? "" : L.error, d(), L;
  }
  const P = (R, H) => W(["agent", "control", String(e.value.id), R, H.value], { target: p, fields: { value: { ...p.value, [R]: H.label } } }), K = () => (S.value = !1, W(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), U = (R) => W(["agent", "launch", R.name]);
  return Ve(j), ge(h, j), { groups: c, programs: t, chosen: p, failure: $, asking: S, running: h, paused: B, choose: P, stop: K, start: U };
}
const Re = { claude: "Claude Code", codex: "Codex" };
Object.entries(Re).map(([e, v]) => ({ key: e, label: v }));
function Mt(e, v = "agent") {
  return Re[e] || v;
}
const kt = ["disabled", "title"], bt = ["title"], xt = { class: "gauge usage" }, $t = ["disabled", "title"], Ct = { class: "gauge" }, St = ["disabled", "title"], zt = ["disabled"], Vt = ["disabled"], Ht = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, At = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Tt = ["title"], Rt = 75, Lt = {
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
    const d = e, c = v, t = wt(Be(d, "agent"), d.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => c("changed")), p = V(null), $ = V(""), S = g(() => t.groups.value.find((r) => r.key === $.value));
    function h(r, n) {
      p.value = r.currentTarget, $.value = n;
    }
    function B() {
      p.value = null, $.value = "", t.asking.value = !1;
    }
    const j = V([]), W = g(() => j.value.filter((r) => r.state === "loaded"));
    async function P() {
      const r = d.agent && d.run ? await d.run(["agent-skill", "list", "--agent", String(d.agent.id)]) : null;
      j.value = r != null && r.ok ? r.value.rows ?? [] : [];
    }
    function K(r) {
      h(r, "skills"), P();
    }
    ge(() => {
      var r;
      return (r = d.agent) == null ? void 0 : r.id;
    }, P, { immediate: !0 });
    const U = (r) => t.groups.value.some((n) => n.key === r), R = g(() => {
      var r;
      return t.chosen.value.model ?? ((r = L.value) == null ? void 0 : r.model) ?? "";
    }), H = g(() => {
      var r;
      return t.chosen.value.effort ?? ((r = L.value) == null ? void 0 : r.effort) ?? "";
    });
    g(() => !!d.agent && !d.agent.ended_at);
    const L = g(() => {
      var r;
      return ((r = d.usage.agents) == null ? void 0 : r.find((n) => {
        var u;
        return n.id === ((u = d.agent) == null ? void 0 : u.id);
      })) ?? null;
    }), Y = g(() => {
      var r;
      return ((r = d.usage.windows) == null ? void 0 : r[0]) ?? null;
    }), E = g(() => Y.value ? Math.max(0, Math.min(100, Math.round(Y.value.used_percent))) : null), Z = g(() => {
      var r;
      return ((r = L.value) == null ? void 0 : r.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), J = g(() => {
      var r;
      return (r = L.value) != null && r.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), Q = g(() => {
      var u;
      const r = (u = d.agent) != null && u.process_started_at ? new Date(d.agent.process_started_at).getTime() : 0;
      if (!r) return "";
      const n = Math.max(0, Math.floor((d.now - r) / 6e4));
      return n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`;
    });
    return (r, n) => (a(), l("div", {
      class: te(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), l(q, { key: 0 }, [
        z("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: n[0] || (n[0] = (u) => h(u, "agent"))
        }, [
          y(F, {
            name: "agents",
            size: 12
          }),
          k(" " + f(b(Mt)(e.agent.program)), 1)
        ], 8, kt),
        E.value !== null ? (a(), l("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${E.value}% of the plan's ${Y.value.title} allowance used`,
          onClick: n[1] || (n[1] = (u) => c("open", "usage", u.currentTarget))
        }, [
          y(F, {
            name: "clock",
            size: 12
          }),
          n[14] || (n[14] = k()),
          z("span", xt, [
            z("span", {
              style: Me({ width: `${E.value}%` })
            }, null, 4)
          ]),
          k(" " + f(E.value) + "% ", 1)
        ], 8, bt)) : m("", !0),
        Z.value !== null ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${Z.value}% full: clear or compact it`,
          onClick: n[2] || (n[2] = (u) => U("context") ? h(u, "context") : c("open", "context", u.currentTarget))
        }, [
          y(F, {
            name: "gauge",
            size: 12
          }),
          n[15] || (n[15] = k()),
          z("span", Ct, [
            z("span", {
              style: Me({ width: `${Z.value}%` })
            }, null, 4)
          ]),
          k(" " + f(Z.value) + "% ", 1)
        ], 8, $t)) : m("", !0),
        R.value ? (a(), l("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${R.value}: change the model`,
          onClick: n[3] || (n[3] = (u) => U("model") ? h(u, "model") : null)
        }, [
          y(F, {
            name: "model",
            size: 12
          }),
          k(" " + f(R.value), 1)
        ], 8, St)) : m("", !0),
        U("effort") || e.card && H.value ? (a(), l("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: n[4] || (n[4] = (u) => h(u, "effort"))
        }, [
          y(F, {
            name: "bolt",
            size: 12
          }),
          k(" " + f(H.value), 1)
        ], 8, zt)) : m("", !0),
        J.value ? (a(), l("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: n[5] || (n[5] = (u) => c("open", "cost", u.currentTarget))
        }, f(J.value), 9, Vt)) : m("", !0),
        Q.value ? (a(), l("span", Ht, [
          y(F, {
            name: "reminders",
            size: 12
          }),
          k(" " + f(Q.value), 1)
        ])) : m("", !0),
        e.branch ? (a(), l("span", At, [
          y(F, {
            name: "branch",
            size: 12
          }),
          k(" " + f(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (a(), l("button", {
          key: 7,
          type: "button",
          class: te(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: n[6] || (n[6] = (u) => c("open", "jobs", u.currentTarget))
        }, [
          y(F, {
            name: "clock",
            size: 12
          }),
          k(" " + f(e.jobs), 1)
        ], 2)),
        e.run ? (a(), l("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: K
        }, [
          y(F, {
            name: "book",
            size: 12
          }),
          k(" " + f(W.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (a(), l(q, { key: 9 }, [
          z("button", {
            type: "button",
            class: te(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Rt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: n[7] || (n[7] = (u) => c("open", "fitness", u.currentTarget))
          }, [
            y(F, {
              name: "heart",
              size: 12
            }),
            k(" " + f(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          z("button", {
            type: "button",
            class: te(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: n[8] || (n[8] = (u) => c("open", "load", u.currentTarget))
          }, [
            y(F, {
              name: "weight",
              size: 12
            }),
            k(" " + f(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (a(), l("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: n[9] || (n[9] = (u) => h(u, "start"))
      }, [
        y(F, {
          name: "agents",
          size: 12
        }),
        n[16] || (n[16] = k(" Start an agent", -1))
      ])) : m("", !0),
      n[22] || (n[22] = z("span", { class: "space" }, null, -1)),
      b(t).failure.value ? (a(), l("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: b(t).failure.value
      }, f(b(t).failure.value), 9, Tt)) : m("", !0),
      fe(r.$slots, "default", {}, void 0, !0),
      p.value ? (a(), N(mt, {
        key: 3,
        anchor: p.value,
        "min-width": 190,
        onClose: B
      }, {
        default: A(() => [
          $.value === "agent" ? (a(), l(q, { key: 0 }, [
            b(t).asking.value ? (a(), l(q, { key: 0 }, [
              y(ve, { "data-agent-stop-ask": "" }, {
                default: A(() => [...n[17] || (n[17] = [
                  k("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              y(pe, {
                "data-agent-stop-confirm": "",
                onClick: n[10] || (n[10] = (u) => (B(), b(t).stop()))
              }, {
                default: A(() => [...n[18] || (n[18] = [
                  k("Stop it", -1)
                ])]),
                _: 1
              }),
              y(pe, {
                onClick: n[11] || (n[11] = (u) => b(t).asking.value = !1)
              }, {
                default: A(() => [...n[19] || (n[19] = [
                  k("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), N(pe, {
              key: 1,
              "data-agent-stop": "",
              onClick: n[12] || (n[12] = (u) => b(t).asking.value = !0)
            }, {
              default: A(() => [...n[20] || (n[20] = [
                k("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : $.value === "start" ? (a(), l(q, { key: 1 }, [
            y(ve, null, {
              default: A(() => [...n[21] || (n[21] = [
                k("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), l(q, null, de(b(t).programs.value, (u) => (a(), N(pe, {
              key: u.name,
              "data-agent-program": u.name,
              onClick: (D) => (B(), b(t).start(u))
            }, {
              default: A(() => [
                k(f(u.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : $.value === "skills" ? (a(), N(ut, {
            key: 2,
            skills: j.value,
            onBrowse: n[13] || (n[13] = (u) => (B(), c("open", "skills", null)))
          }, null, 8, ["skills"])) : S.value ? (a(), l(q, { key: 3 }, [
            y(ve, null, {
              default: A(() => [
                k(f(S.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), l(q, null, de(S.value.choices, (u) => (a(), N(pe, {
              key: u.value,
              "data-agent-choice": u.value,
              onClick: (D) => (b(t).choose(S.value.key, u), B())
            }, {
              default: A(() => [
                k(f(u.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : m("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : m("", !0)
    ], 2));
  }
}, jt = /* @__PURE__ */ ae(Lt, [["__scopeId", "data-v-cce150b4"]]), Bt = {
  class: "agent-command",
  "data-agent-command": ""
}, Ot = {
  key: 1,
  "data-agent-stopped": ""
}, Et = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (v, d) => (a(), l("span", Bt, [
      e.waitReason ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: d[0] || (d[0] = he((c) => b(be)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + f(e.waitReason) + " ", 1),
        y(b(ke), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Ot, "Waiting")) : (a(), N(b(qe), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ze = /* @__PURE__ */ ae(Et, [["__scopeId", "data-v-1b371fb5"]]), It = ["data-agent-delegated", "onClick"], qt = { class: "agent-task-number" }, Nt = { class: "agent-task-title" }, Wt = ["title"], Dt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: v }) {
    const d = v;
    return (c, t) => (a(), N(b(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (p) => d("toggle"))
    }, {
      default: A(() => [
        (a(!0), l(q, null, de(e.section.tasks, (p) => (a(), l("button", {
          key: p.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": p.id,
          onClick: ($) => b(be)(`tasks:${p.id}`)
        }, [
          y(b(Ne), {
            status: p.state
          }, null, 8, ["status"]),
          z("span", qt, f(p.id), 1),
          z("span", Nt, f(p.title), 1),
          p.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${p.plan_id}: ${p.plan_title}`
          }, "Plan " + f(p.plan_id) + ": " + f(p.plan_title), 9, Wt)) : m("", !0)
        ], 8, It))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ft = /* @__PURE__ */ ae(Dt, [["__scopeId", "data-v-238ff959"]]), Pt = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Zt = { class: "agent-head" }, Kt = ["data-state"], Ut = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Gt = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Yt = { class: "agent-times" }, Jt = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Qt = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Xt = { class: "agent-line" }, _t = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ea = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ta = {
  key: 0,
  class: "agent-line agent-work-start"
}, aa = ["title"], na = ["data-peek"], oa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, la = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, sa = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, ra = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ia = {
  key: 0,
  class: "agent-helper-brief"
}, ca = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, da = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ua = "It ended without a report", ha = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: v }) {
    const d = { helper: "Helper", reviewer: "Reviewer" }, c = ["started", "blocked", "open", "completed"], t = e, p = v, $ = We(), S = g(() => {
      var i;
      const o = ((i = t.facts) == null ? void 0 : i.profile) || d[t.row.role] || t.row.role;
      return o.slice(0, 1).toUpperCase() + o.slice(1);
    }), h = g(() => {
      var o;
      return ((o = t.facts) == null ? void 0 : o.tasks) ?? [];
    }), B = g(() => h.value.filter((o) => o.state === "open")), j = g(() => {
      var o, i, I, _;
      return t.row.role === "helper" ? ((o = t.facts) == null ? void 0 : o.helper_job) || "" : (i = t.facts) != null && i.job_enabled && (((I = t.facts) == null ? void 0 : I.task_title) || ((_ = B.value[0]) == null ? void 0 : _.title)) || "";
    }), W = g(() => {
      const o = j.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return o ? `${o[1].toLowerCase() === "plan" ? "plans" : "docs"}:${o[2]}` : "";
    }), P = g(() => {
      var o, i;
      return [t.row.program, (o = t.facts) == null ? void 0 : o.model, (i = t.facts) == null ? void 0 : i.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), K = g(() => {
      var o, i;
      return t.row.ended_at && ((i = (o = t.facts) == null ? void 0 : o.job_returned) != null && i.startsWith(ua)) ? t.facts.job_returned : "";
    }), U = g(() => De(t.row.process_started_at || t.row.created_at, $.value)), R = /* @__PURE__ */ new Set(["open", "started", "testing"]), H = g(() => !!t.row.ended_at && t.row.role !== "main" && h.value.some((o) => R.has(o.state))), L = g(() => {
      var o;
      return t.waitReason || H.value ? "waiting" : t.row.state === "running" && ((o = t.facts) == null ? void 0 : o.state) || t.row.state;
    }), Y = g(() => {
      var o;
      return ((o = t.progress) == null ? void 0 : o.completed_count) ?? h.value.filter((i) => i.state === "completed").length;
    }), E = g(() => {
      var o;
      return ((o = t.progress) == null ? void 0 : o.task_count) ?? h.value.length;
    }), Z = g(() => `${Y.value} of ${E.value} ${E.value === 1 ? "task" : "tasks"}`), J = g(() => {
      var i;
      const o = Fe(Y.value, ((i = t.progress) == null ? void 0 : i.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, $.value);
      return t.row.role !== "main" && o ? `${o} per hour` : "";
    }), Q = g(() => h.value.length ? c.map((o) => ({ state: o, label: o.slice(0, 1).toUpperCase() + o.slice(1), tasks: h.value.filter((i) => i.state === o || o === "started" && i.state === "testing" || o === "completed" && i.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), n = V({}), u = (o) => !(n.value[o] ?? r.has(o)), D = (o) => n.value = { ...n.value, [o]: u(o) }, G = Ae(), s = g(() => t.row.access === "read-only"), w = g(() => s.value ? G.tabs.filter((o) => ["transcript", "terminal"].includes(o.key)) : G.tabs), C = V(w.value[0]);
    ge(() => t.open, (o) => {
      o && (C.value = w.value[0]);
    });
    const ne = Object.fromEntries(G.tabs.filter((o) => o.component).map((o) => [o.key, Oe(() => Pe(o.component))])), oe = g(() => t.row.role === "helper" && !t.row.ended_at), le = () => G.run(["helper", "stop", String(t.row.id)]), se = V(!1), re = V(""), M = V(""), x = g(() => t.row.role !== "main" && (!t.row.ended_at || H.value || t.waitReason));
    async function T() {
      if (!x.value) return;
      const o = await G.read(`usage tool --agent ${t.row.id}`);
      re.value = o.ok ? o.value.tool : "", M.value = o.ok ? o.value.note : "";
    }
    const O = G.follow(["hook_call.*", "process_part.*"], T);
    return we(() => O == null ? void 0 : O()), T(), (o, i) => {
      var I, _, ee, me;
      return a(), l("div", {
        class: te(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: i[5] || (i[5] = (X) => !e.open && p("toggle")),
        onKeydown: [
          i[6] || (i[6] = xe(he((X) => !e.open && p("toggle"), ["self", "prevent"]), ["enter"])),
          i[7] || (i[7] = xe(he((X) => !e.open && p("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        z("span", Zt, [
          e.open ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = he((X) => p("toggle"), ["stop"]))
          }, [
            y(b(ke), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          z("span", {
            class: "agent-dot",
            "data-state": L.value,
            "data-agent-motion": ""
          }, null, 8, Kt),
          z("span", Ut, f(S.value), 1),
          z("span", Gt, f(((I = e.facts) == null ? void 0 : I.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (a(), N(b(ke), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          z("span", Yt, [
            e.row.ended_at && !H.value ? (a(), N(b(Ce), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), l("span", Jt, f(U.value), 1)),
            (_ = e.facts) != null && _.last_activity ? (a(), l("span", Qt, [
              i[8] || (i[8] = k("Last heard: ", -1)),
              y(b(Ce), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : m("", !0)
          ])
        ]),
        z("span", Xt, [
          z("span", _t, f(P.value), 1),
          E.value && !j.value ? (a(), l("span", ea, f(Z.value), 1)) : m("", !0)
        ]),
        j.value ? (a(), l("span", ta, [
          z("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: j.value
          }, [
            W.value ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": W.value,
              onClick: i[1] || (i[1] = he((X) => b(be)(W.value), ["stop"]))
            }, f(j.value), 9, na)) : (a(), l(q, { key: 1 }, [
              k(f(j.value), 1)
            ], 64))
          ], 8, aa),
          E.value ? (a(), l("span", oa, f(Z.value), 1)) : m("", !0)
        ])) : m("", !0),
        !e.open && (x.value || E.value && J.value) ? (a(), l("span", {
          key: 1,
          class: te(["agent-foot", { "agent-work-start": !j.value }]),
          "data-agent-foot": ""
        }, [
          x.value ? (a(), N(ze, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: H.value,
            command: re.value,
            note: M.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          E.value && J.value ? (a(), l("span", la, f(J.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (a(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[4] || (i[4] = he(() => {
          }, ["stop"]))
        }, [
          y(jt, {
            agent: e.row,
            branch: (ee = e.progress) == null ? void 0 : ee.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: A(() => [
              oe.value ? (a(), N(b(Ze), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: le
              }, {
                default: A(() => [...i[9] || (i[9] = [
                  k("Stop", -1)
                ])]),
                _: 1
              })) : m("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          x.value ? (a(), N(ze, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: H.value,
            command: re.value,
            note: M.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          K.value ? (a(), l("p", sa, f(K.value), 1)) : m("", !0),
          y(b(Ke), {
            class: "agent-tabs",
            tabs: w.value,
            active: C.value,
            answer: { tasks: h.value.length },
            onChoose: i[2] || (i[2] = (X) => C.value = X)
          }, null, 8, ["tabs", "active", "answer"]),
          y(b(Ue), {
            class: "agent-tab-body",
            tab: C.value,
            "data-agent-tab-body": (me = C.value) == null ? void 0 : me.key
          }, {
            default: A(() => {
              var X;
              return [
                y(b(Ge), {
                  value: (X = C.value) == null ? void 0 : X.key
                }, Ee({
                  tasks: A(() => {
                    var ie;
                    return [
                      h.value.length ? m("", !0) : (a(), N(b(Ye), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: A(() => [...i[10] || (i[10] = [
                          k("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), l(q, null, de(Q.value, (ce) => (a(), N(Ft, {
                        key: ce.state,
                        section: ce,
                        open: u(ce.state),
                        onToggle: (fa) => D(ce.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (ie = e.facts) != null && ie.instruction ? (a(), l(q, { key: 1 }, [
                        i[11] || (i[11] = z("p", { class: "agent-label" }, "Instruction", -1)),
                        z("div", ra, f(e.facts.instruction), 1)
                      ], 64)) : m("", !0)
                    ];
                  }),
                  transcript: A(() => {
                    var ie;
                    return [
                      s.value ? (a(), l(q, { key: 0 }, [
                        (ie = e.facts) != null && ie.instruction ? (a(), l("div", ia, [
                          y(b(He), {
                            label: "Instruction",
                            open: se.value,
                            "data-agent-section": "instruction",
                            onToggle: i[3] || (i[3] = (ce) => se.value = !se.value)
                          }, {
                            default: A(() => [
                              z("div", ca, f(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), l("p", da, "No job recorded")) : m("", !0)
                      ], 64)) : m("", !0),
                      y(et, {
                        line: `agent transcript ${e.row.id}`,
                        agent: s.value ? oe.value ? e.row.id : null : e.row.id,
                        helper: s.value && oe.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  de(b(ne), (ie, ce) => ({
                    name: ce,
                    fn: A(() => [
                      (a(), N(Ie(ie), {
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
      ], 42, Pt);
    };
  }
}, pa = /* @__PURE__ */ ae(ha, [["__scopeId", "data-v-c63d1d9c"]]), ga = ["data-agent-row"], ye = "cubic-bezier(0.2, 0.9, 0.25, 1)", va = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const v = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], d = e, { rows: c } = Je("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: t } = Se("waits"), { rows: p } = Se("progress"), $ = (M) => p.value.find((x) => x.agent_id === M.id) ?? null, S = (M) => {
      var x;
      return ((x = t.value.find((T) => T.agent_id === M.id)) == null ? void 0 : x.reason) ?? "";
    }, h = V("running"), B = V(""), j = Ae(), W = V([]), P = V(""), K = V(!1), U = V(!1), R = V(25);
    let H = 0;
    async function L() {
      const M = ++H, x = await j.read(`${d.line} --show ${h.value} --search ${JSON.stringify(B.value)} --limit ${R.value}`);
      M === H && (W.value = x.ok ? x.value.rows : [], P.value = x.ok ? "" : x.error, U.value = x.ok && x.value.page * x.value.size < x.value.total, K.value = !0);
    }
    async function Y() {
      return R.value += 25, await L(), !0;
    }
    ge([h, B], () => {
      R.value = 25, L();
    }), j.follow(["agent.*", "task.*", ...j.sources.flatMap((M) => M.events)], L), L();
    const E = (M) => c.value.find((x) => x.id === M.id) ?? null, Z = W, J = g(() => !!B.value.trim()), Q = g(() => d.texts[h.value] ?? { title: d.empty, hint: "" }), r = V(null), n = V(null), u = V(null), D = g(() => Z.value.find((M) => M.id === r.value) ?? null), G = g(() => D.value ? [D.value] : Z.value), s = g(() => Z.value.length - G.value.length), w = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let C = !1, ne = 0;
    async function oe(M) {
      if (C) return;
      C = !0, ne = u.value.scrollTop;
      const x = n.value.querySelector(`[data-agent-open="${M.id}"]`);
      if (!w()) {
        const i = [...n.value.querySelectorAll(".agent-row")].filter((I) => !I.contains(x));
        await Promise.all(i.map((I) => I.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const T = [...x.querySelectorAll(".agent-head, .agent-line")], O = [...T, ...x.querySelectorAll("[data-agent-motion]")], o = O.map((i) => i.getBoundingClientRect());
      if (r.value = M.id, await $e(), !w()) {
        const i = O.map((I) => I.getBoundingClientRect());
        O.forEach((I, _) => {
          const ee = T.indexOf(I.parentElement), me = o[_].left - i[_].left - (ee < 0 ? 0 : o[ee].left - i[ee].left), X = o[_].top - i[_].top - (ee < 0 ? 0 : o[ee].top - i[ee].top);
          I.animate([{ transform: `translate(${me}px, ${X}px)` }, { transform: "none" }], { duration: 280, easing: ye });
        }), n.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((I) => {
          I.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: ye, fill: "backwards" });
        });
      }
      C = !1;
    }
    async function le() {
      if (C || !D.value) return;
      C = !0;
      const M = n.value.querySelector(`[data-agent-open="${r.value}"]`), x = [...M.children, ...n.value.querySelectorAll(".agents-held")], T = w() ? [] : x.map((O) => O.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(T.map((O) => O.finished)), r.value = null, await $e(), u.value.scrollTop = ne, T.forEach((O) => O.cancel()), w() || (M.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: ye }), n.value.querySelectorAll(".agent-row").forEach((O) => {
        O.contains(M) || O.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: ye });
      })), C = !1;
    }
    const se = (M) => r.value === M.id ? le() : oe(M);
    ge(B, (M) => M.trim() && (r.value = null)), ge(h, () => {
      r.value = null;
    });
    const re = (M) => {
      M.key === "Escape" && le();
    };
    return window.addEventListener("keydown", re), we(() => window.removeEventListener("keydown", re)), (M, x) => (a(), l("div", {
      ref_key: "agents",
      ref: n,
      class: te(["agents", { focused: D.value }])
    }, [
      y(b(Qe), {
        modelValue: B.value,
        "onUpdate:modelValue": x[1] || (x[1] = (T) => B.value = T),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: A(() => [
          y(b(Xe), {
            options: v,
            value: h.value,
            onPick: x[0] || (x[0] = (T) => h.value = T)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      z("div", {
        ref_key: "list",
        ref: u,
        class: te(["agents-view", { "agents-view-open": D.value }])
      }, [
        y(b(_e), {
          rows: G.value,
          failure: P.value,
          loaded: K.value,
          more: !D.value && U.value,
          older: Y,
          empty: Q.value.title,
          hint: Q.value.hint,
          searching: J.value
        }, {
          default: A(({ row: T }) => [
            z("div", {
              class: "agent-row",
              "data-agent-row": T.id
            }, [
              y(pa, {
                row: T,
                facts: E(T),
                progress: $(T),
                "wait-reason": S(T),
                open: T.id === r.value,
                onToggle: (O) => se(T)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ga)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      D.value && s.value ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: le
      }, f(s.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, Ma = /* @__PURE__ */ ae(va, [["__scopeId", "data-v-0e32b923"]]);
export {
  Ma as A
};
