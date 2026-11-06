/* @code-commandments-generated */
import { openBlock as a, createElementBlock as s, normalizeStyle as ze, normalizeClass as se, toDisplayString as m, createCommentVNode as x, createElementVNode as A, renderSlot as Me, computed as f, createVNode as M, withCtx as C, createTextVNode as w, Fragment as I, renderList as ae, onUnmounted as Ce, ref as H, onMounted as Be, createBlock as O, Teleport as Ke, mergeProps as Ue, watch as pe, toRef as Ze, unref as y, withModifiers as fe, defineAsyncComponent as Je, withKeys as Te, createSlots as Ge, resolveDynamicComponent as Ye, nextTick as Ae } from "vue";
import { peekRef as He, Icon as Ve, RunningCommand as Qe, FoldGroup as Ie, TaskStatusIcon as Xe, useNow as _e, age as et, perHour as tt, useWindow as Ee, loadWindowComponent as at, TimeAgo as Re, Btn as Ne, InnerTabs as nt, TabBody as lt, SwitchCase as ot, EmptyState as qe, useRows as st, useDeclaredRows as Le, SearchBar as rt, Segmented as it, MenuLabel as Se, MenuItem as xe, RowList as ct } from "@journal/window-kit";
import { _ as re, T as dt } from "./TranscriptRows-DCpyNUhv.mjs";
const ut = ["stroke-width", "innerHTML"], K = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const b = e, c = { right: 0, down: 90, left: 180, up: 270 }, i = {
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
    return (v, z) => (a(), s("svg", {
      class: "ico",
      style: ze({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...b.facing === "right" ? {} : { transform: `rotate(${c[b.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[i[e.name] || e.name] || t.dot
    }, null, 12, ut));
  }
}, ht = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, pt = {
  key: 1,
  class: "menu-item-text"
}, gt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (b, c) => (a(), s("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", ht, m(e.checked ? "✓" : ""), 1)) : x("", !0),
      e.description ? (a(), s("span", pt, [
        A("span", null, [
          Me(b.$slots, "default", {}, void 0, !0)
        ]),
        A("small", null, m(e.description), 1)
      ])) : Me(b.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ re(gt, [["__scopeId", "data-v-9c67fe37"]]), vt = {}, ft = { class: "menu-label" };
function mt(e, b) {
  return a(), s("span", ft, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ re(vt, [["render", mt], ["__scopeId", "data-v-71c11156"]]), yt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, kt = {
  key: 0,
  class: "skills-none"
}, wt = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: b }) {
    const c = e, i = b, t = f(() => c.skills.filter((z) => z.state === "loaded")), v = f(() => c.skills.filter((z) => z.state !== "loaded"));
    return (z, T) => (a(), s("div", yt, [
      M(we, null, {
        default: C(() => [...T[1] || (T[1] = [
          w("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? x("", !0) : (a(), s("p", kt, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(I, null, ae(t.value, (g) => (a(), s("p", {
        key: g.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        M(K, {
          name: "book",
          size: 12
        }),
        w(m(g.skill), 1)
      ]))), 128)),
      v.value.length ? (a(), s(I, { key: 1 }, [
        M(we, null, {
          default: C(() => [...T[2] || (T[2] = [
            w("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(I, null, ae(v.value, (g) => (a(), s("p", {
          key: g.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          M(K, {
            name: "book",
            size: 12
          }),
          w(m(g.skill), 1)
        ]))), 128))
      ], 64)) : x("", !0),
      M(me, {
        "data-agent-skills-browse": "",
        onClick: T[0] || (T[0] = (g) => i("browse"))
      }, {
        default: C(() => [...T[3] || (T[3] = [
          w("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Mt = /* @__PURE__ */ re(wt, [["__scopeId", "data-v-27140adf"]]), bt = (e, b, c) => Math.max(b, Math.min(c, e)), We = /* @__PURE__ */ new WeakMap(), xt = (e, b) => We.set(e, b);
function $t(e, b) {
  for (let c = b; c; c = We.get(c) ?? c.parentElement) if (c === e) return !0;
  return !1;
}
function Ct(e, b) {
  const c = (i) => {
    var v, z;
    const t = ((v = e.value) == null ? void 0 : v.element) || ((z = e.value) == null ? void 0 : z.$el) || e.value;
    t && !$t(t, i.target) && b(i);
  };
  window.addEventListener("click", c), Ce(() => window.removeEventListener("click", c));
}
const ve = 8, St = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: b, emit: c }) {
    const i = e, t = H(null), v = (r) => r ? `${r}px` : void 0, z = f(() => ({
      minWidth: v(i.minWidth),
      maxWidth: v(i.maxWidth),
      maxHeight: v(i.maxHeight),
      height: v(i.height)
    })), T = H({ w: 0, h: 0 }), g = H(i.anchor ? i.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), E = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), V = (r) => {
      const $ = r.closest(".pane, .float-window");
      return $ ? E($.getBoundingClientRect()) : B();
    }, F = (r, $) => `${Math.max(0, r ? Math.min(r, $) : $)}px`;
    function Z(r, $) {
      return {
        below: r.bottom - $.bottom - i.gap - ve,
        above: $.top - r.top - i.gap - ve,
        across: r.right - r.left - 2 * ve
      };
    }
    function D(r) {
      const $ = V(i.anchor), R = Z($, r);
      return T.value.w <= R.across && T.value.h <= Math.max(R.below, R.above) ? $ : B();
    }
    const j = f(() => {
      if (!g.value) return z.value;
      const r = g.value, $ = D(r), R = Z($, r), { w: ie, h: P } = T.value, _ = i.align === "auto" ? r.left + r.right > $.left + $.right : i.align === "right", ne = bt(_ ? r.right - ie : r.left, $.left + ve, Math.max($.left + ve, $.right - ie - ve)), le = P > R.below && R.above > R.below ? { bottom: `${window.innerHeight - r.top + i.gap}px`, maxHeight: F(i.maxHeight, R.above) } : { top: `${r.bottom + i.gap}px`, maxHeight: F(i.maxHeight, R.below) };
      return { ...z.value, ...le, left: `${ne}px`, maxWidth: F(i.maxWidth, R.across) };
    }), L = c, N = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function W(r) {
      const $ = N(), R = $.indexOf(document.activeElement);
      $[(R + r + $.length) % $.length].focus();
    }
    const q = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => L("close") }, J = (r) => q[r.key] && (r.preventDefault(), q[r.key]()), U = () => t.value && (T.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let G = 0;
    const d = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(U);
    });
    Ct(t, (r) => i.anchor && !i.anchor.contains(r.target) && L("close"));
    const n = (r, $) => ["top", "left", "right", "bottom"].some((R) => Math.abs(r[R] - $[R]) > 1), u = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let Q = 0;
    function X() {
      if (i.anchor) {
        const r = i.anchor.getBoundingClientRect();
        if (!i.anchor.isConnected || u(r)) return L("close");
        n(r, g.value) && (g.value = r);
      }
      Q = requestAnimationFrame(X);
    }
    return Be(() => {
      i.anchor && t.value && xt(t.value, i.anchor), U(), t.value && d.observe(t.value), !i.plain && N()[0] && N()[0].focus(), X();
    }), Ce(() => {
      d.disconnect(), cancelAnimationFrame(Q), cancelAnimationFrame(G);
    }), b({ element: t }), (r, $) => (a(), O(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      A("div", Ue({
        ref_key: "panel",
        ref: t
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: j.value,
        onKeydown: J
      }), [
        Me(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), zt = /* @__PURE__ */ re(St, [["__scopeId", "data-v-7f046e0d"]]);
async function Vt(e, b, c) {
  if (!e) return c(b);
  const { target: i, fields: t } = e, v = Object.fromEntries(Object.keys(t).map((g) => [g, i[g]])), z = () => Object.assign(i, v);
  Object.assign(i, t);
  let T = !1;
  try {
    const g = await c(b);
    return T = g.ok, g;
  } finally {
    T || z();
  }
}
function Ht(e, b, c) {
  const i = H([]), t = H([]), v = H({}), z = H(""), T = H(!1), g = f(() => !!e.value && !e.value.ended_at), B = f(() => g.value && !!e.value.paused_at);
  async function E() {
    if (g.value) {
      const L = await b(["agent", "controls", String(e.value.id)]);
      i.value = L.ok ? L.value.groups : [];
      return;
    }
    const j = await b(["agent", "programs"]);
    t.value = j.ok ? j.value.rows : [];
  }
  async function V(j, L = null) {
    z.value = "";
    const N = await Vt(L, j, b);
    return z.value = N.ok ? "" : N.error, c(), N;
  }
  const F = (j, L) => V(["agent", "control", String(e.value.id), j, L.value], { target: v, fields: { value: { ...v.value, [j]: L.label } } }), Z = () => (T.value = !1, V(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), D = (j) => V(["agent", "launch", j.name]);
  return Be(E), pe(g, E), { groups: i, programs: t, chosen: v, failure: z, asking: T, running: g, paused: B, choose: F, stop: Z, start: D };
}
const Fe = { claude: "Claude Code", codex: "Codex" };
Object.entries(Fe).map(([e, b]) => ({ key: e, label: b }));
function Tt(e, b = "agent") {
  return Fe[e] || b;
}
const At = ["disabled", "title"], Rt = ["title"], Lt = { class: "gauge usage" }, Ot = ["disabled", "title"], jt = { class: "gauge" }, Bt = ["disabled", "title"], It = ["disabled"], Et = ["disabled"], Nt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, qt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Wt = ["title"], Ft = 75, Dt = {
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
  setup(e, { emit: b }) {
    const c = e, i = b, t = Ht(Ze(c, "agent"), c.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => i("changed")), v = H(null), z = H(""), T = f(() => t.groups.value.find((d) => d.key === z.value));
    function g(d, n) {
      v.value = d.currentTarget, z.value = n;
    }
    function B() {
      v.value = null, z.value = "", t.asking.value = !1;
    }
    const E = H([]), V = f(() => E.value.filter((d) => d.state === "loaded"));
    async function F() {
      const d = c.agent && c.run ? await c.run(["agent-skill", "list", "--agent", String(c.agent.id)]) : null;
      E.value = d != null && d.ok ? d.value.rows ?? [] : [];
    }
    function Z(d) {
      g(d, "skills"), F();
    }
    pe(() => {
      var d;
      return (d = c.agent) == null ? void 0 : d.id;
    }, F, { immediate: !0 });
    const D = (d) => t.groups.value.some((n) => n.key === d), j = f(() => {
      var d;
      return t.chosen.value.model ?? ((d = N.value) == null ? void 0 : d.model) ?? "";
    }), L = f(() => {
      var d;
      return t.chosen.value.effort ?? ((d = N.value) == null ? void 0 : d.effort) ?? "";
    });
    f(() => !!c.agent && !c.agent.ended_at);
    const N = f(() => {
      var d;
      return ((d = c.usage.agents) == null ? void 0 : d.find((n) => {
        var u;
        return n.id === ((u = c.agent) == null ? void 0 : u.id);
      })) ?? null;
    }), W = f(() => {
      var d;
      return ((d = c.usage.windows) == null ? void 0 : d[0]) ?? null;
    }), q = f(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), J = f(() => {
      var d;
      return ((d = N.value) == null ? void 0 : d.context_percent) == null ? null : Math.round(N.value.context_percent);
    }), U = f(() => {
      var d;
      return (d = N.value) != null && d.cost_dollars ? `$${N.value.cost_dollars.toFixed(2)}` : "";
    }), G = f(() => {
      var u;
      const d = (u = c.agent) != null && u.process_started_at ? new Date(c.agent.process_started_at).getTime() : 0;
      if (!d) return "";
      const n = Math.max(0, Math.floor((c.now - d) / 6e4));
      return n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`;
    });
    return (d, n) => (a(), s("div", {
      class: se(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), s(I, { key: 0 }, [
        A("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: n[0] || (n[0] = (u) => g(u, "agent"))
        }, [
          M(K, {
            name: "agents",
            size: 12
          }),
          w(" " + m(y(Tt)(e.agent.program)), 1)
        ], 8, At),
        q.value !== null ? (a(), s("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${q.value}% of the plan's ${W.value.title} allowance used`,
          onClick: n[1] || (n[1] = (u) => i("open", "usage", u.currentTarget))
        }, [
          M(K, {
            name: "clock",
            size: 12
          }),
          n[14] || (n[14] = w()),
          A("span", Lt, [
            A("span", {
              style: ze({ width: `${q.value}%` })
            }, null, 4)
          ]),
          w(" " + m(q.value) + "% ", 1)
        ], 8, Rt)) : x("", !0),
        J.value !== null ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${J.value}% full: clear or compact it`,
          onClick: n[2] || (n[2] = (u) => D("context") ? g(u, "context") : i("open", "context", u.currentTarget))
        }, [
          M(K, {
            name: "gauge",
            size: 12
          }),
          n[15] || (n[15] = w()),
          A("span", jt, [
            A("span", {
              style: ze({ width: `${J.value}%` })
            }, null, 4)
          ]),
          w(" " + m(J.value) + "% ", 1)
        ], 8, Ot)) : x("", !0),
        j.value ? (a(), s("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${j.value}: change the model`,
          onClick: n[3] || (n[3] = (u) => D("model") ? g(u, "model") : null)
        }, [
          M(K, {
            name: "model",
            size: 12
          }),
          w(" " + m(j.value), 1)
        ], 8, Bt)) : x("", !0),
        D("effort") || e.card && L.value ? (a(), s("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: n[4] || (n[4] = (u) => g(u, "effort"))
        }, [
          M(K, {
            name: "bolt",
            size: 12
          }),
          w(" " + m(L.value), 1)
        ], 8, It)) : x("", !0),
        U.value ? (a(), s("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: n[5] || (n[5] = (u) => i("open", "cost", u.currentTarget))
        }, m(U.value), 9, Et)) : x("", !0),
        G.value ? (a(), s("span", Nt, [
          M(K, {
            name: "reminders",
            size: 12
          }),
          w(" " + m(G.value), 1)
        ])) : x("", !0),
        e.branch ? (a(), s("span", qt, [
          M(K, {
            name: "branch",
            size: 12
          }),
          w(" " + m(e.branch), 1)
        ])) : x("", !0),
        e.card ? x("", !0) : (a(), s("button", {
          key: 7,
          type: "button",
          class: se(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: n[6] || (n[6] = (u) => i("open", "jobs", u.currentTarget))
        }, [
          M(K, {
            name: "clock",
            size: 12
          }),
          w(" " + m(e.jobs), 1)
        ], 2)),
        e.run ? (a(), s("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: Z
        }, [
          M(K, {
            name: "book",
            size: 12
          }),
          w(" " + m(V.value.length), 1)
        ])) : x("", !0),
        e.fitness ? (a(), s(I, { key: 9 }, [
          A("button", {
            type: "button",
            class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ft }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: n[7] || (n[7] = (u) => i("open", "fitness", u.currentTarget))
          }, [
            M(K, {
              name: "heart",
              size: 12
            }),
            w(" " + m(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          A("button", {
            type: "button",
            class: se(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: n[8] || (n[8] = (u) => i("open", "load", u.currentTarget))
          }, [
            M(K, {
              name: "weight",
              size: 12
            }),
            w(" " + m(e.fitness.workload), 1)
          ], 2)
        ], 64)) : x("", !0)
      ], 64)) : e.run && !e.loading ? (a(), s("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: n[9] || (n[9] = (u) => g(u, "start"))
      }, [
        M(K, {
          name: "agents",
          size: 12
        }),
        n[16] || (n[16] = w(" Start an agent", -1))
      ])) : x("", !0),
      n[22] || (n[22] = A("span", { class: "space" }, null, -1)),
      y(t).failure.value ? (a(), s("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: y(t).failure.value
      }, m(y(t).failure.value), 9, Wt)) : x("", !0),
      Me(d.$slots, "default", {}, void 0, !0),
      v.value ? (a(), O(zt, {
        key: 3,
        anchor: v.value,
        "min-width": 190,
        onClose: B
      }, {
        default: C(() => [
          z.value === "agent" ? (a(), s(I, { key: 0 }, [
            y(t).asking.value ? (a(), s(I, { key: 0 }, [
              M(we, { "data-agent-stop-ask": "" }, {
                default: C(() => [...n[17] || (n[17] = [
                  w("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              M(me, {
                "data-agent-stop-confirm": "",
                onClick: n[10] || (n[10] = (u) => (B(), y(t).stop()))
              }, {
                default: C(() => [...n[18] || (n[18] = [
                  w("Stop it", -1)
                ])]),
                _: 1
              }),
              M(me, {
                onClick: n[11] || (n[11] = (u) => y(t).asking.value = !1)
              }, {
                default: C(() => [...n[19] || (n[19] = [
                  w("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), O(me, {
              key: 1,
              "data-agent-stop": "",
              onClick: n[12] || (n[12] = (u) => y(t).asking.value = !0)
            }, {
              default: C(() => [...n[20] || (n[20] = [
                w("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : z.value === "start" ? (a(), s(I, { key: 1 }, [
            M(we, null, {
              default: C(() => [...n[21] || (n[21] = [
                w("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), s(I, null, ae(y(t).programs.value, (u) => (a(), O(me, {
              key: u.name,
              "data-agent-program": u.name,
              onClick: (Q) => (B(), y(t).start(u))
            }, {
              default: C(() => [
                w(m(u.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : z.value === "skills" ? (a(), O(Mt, {
            key: 2,
            skills: E.value,
            onBrowse: n[13] || (n[13] = (u) => (B(), i("open", "skills", null)))
          }, null, 8, ["skills"])) : T.value ? (a(), s(I, { key: 3 }, [
            M(we, null, {
              default: C(() => [
                w(m(T.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), s(I, null, ae(T.value.choices, (u) => (a(), O(me, {
              key: u.value,
              "data-agent-choice": u.value,
              onClick: (Q) => (y(t).choose(T.value.key, u), B())
            }, {
              default: C(() => [
                w(m(u.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : x("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : x("", !0)
    ], 2));
  }
}, Pt = /* @__PURE__ */ re(Dt, [["__scopeId", "data-v-9b2b9486"]]), Kt = {
  class: "agent-command",
  "data-agent-command": ""
}, Ut = {
  key: 1,
  "data-agent-stopped": ""
}, Zt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (b, c) => (a(), s("span", Kt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: c[0] || (c[0] = fe((i) => y(He)("test_queue:0"), ["stop"]))
      }, [
        w("Waiting: " + m(e.waitReason) + " ", 1),
        M(y(Ve), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Ut, "Waiting")) : (a(), O(y(Qe), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Oe = /* @__PURE__ */ re(Zt, [["__scopeId", "data-v-bb905922"]]), Jt = ["data-agent-delegated", "onClick"], Gt = { class: "agent-task-number" }, Yt = { class: "agent-task-title" }, Qt = ["title"], Xt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: b }) {
    const c = b;
    return (i, t) => (a(), O(y(Ie), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (v) => c("toggle"))
    }, {
      default: C(() => [
        (a(!0), s(I, null, ae(e.section.tasks, (v) => (a(), s("button", {
          key: v.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": v.id,
          onClick: (z) => y(He)(`tasks:${v.id}`)
        }, [
          M(y(Xe), {
            status: v.state
          }, null, 8, ["status"]),
          A("span", Gt, m(v.id), 1),
          A("span", Yt, m(v.title), 1),
          v.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${v.plan_id}: ${v.plan_title}`
          }, "Plan " + m(v.plan_id) + ": " + m(v.plan_title), 9, Qt)) : x("", !0)
        ], 8, Jt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, _t = /* @__PURE__ */ re(Xt, [["__scopeId", "data-v-acc154a9"]]), ea = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], ta = { class: "agent-head" }, aa = ["data-state"], na = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, la = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, oa = { class: "agent-times" }, sa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, ra = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, ia = { class: "agent-line" }, ca = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, da = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ua = {
  key: 0,
  class: "agent-line agent-work-start"
}, ha = ["title"], pa = ["data-peek"], ga = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, va = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, fa = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, ma = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ya = {
  key: 0,
  class: "agent-helper-brief"
}, ka = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, wa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ma = "It ended without a report", ba = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: b }) {
    const c = { helper: "Helper", reviewer: "Reviewer" }, i = ["started", "blocked", "open", "completed"], t = e, v = b, z = _e(), T = f(() => {
      var h;
      const l = ((h = t.facts) == null ? void 0 : h.profile) || c[t.row.role] || t.row.role;
      return l.slice(0, 1).toUpperCase() + l.slice(1);
    }), g = f(() => {
      var l;
      return ((l = t.facts) == null ? void 0 : l.tasks) ?? [];
    }), B = f(() => g.value.filter((l) => l.state === "open")), E = f(() => {
      var l, h, oe, he;
      return t.row.role === "helper" ? ((l = t.facts) == null ? void 0 : l.helper_job) || "" : (h = t.facts) != null && h.job_enabled && (((oe = t.facts) == null ? void 0 : oe.task_title) || ((he = B.value[0]) == null ? void 0 : he.title)) || "";
    }), V = f(() => {
      const l = E.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return l ? `${l[1].toLowerCase() === "plan" ? "plans" : "docs"}:${l[2]}` : "";
    }), F = f(() => {
      var l, h;
      return [t.row.program, (l = t.facts) == null ? void 0 : l.model, (h = t.facts) == null ? void 0 : h.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), Z = f(() => {
      var l, h;
      return t.row.ended_at && ((h = (l = t.facts) == null ? void 0 : l.job_returned) != null && h.startsWith(Ma)) ? t.facts.job_returned : "";
    }), D = f(() => et(t.row.process_started_at || t.row.created_at, z.value)), j = /* @__PURE__ */ new Set(["open", "started", "testing"]), L = f(() => !!t.row.ended_at && t.row.role !== "main" && g.value.some((l) => j.has(l.state))), N = f(() => {
      var l;
      return t.waitReason || L.value ? "waiting" : t.row.state === "running" && ((l = t.facts) == null ? void 0 : l.state) || t.row.state;
    }), W = f(() => {
      var l;
      return ((l = t.progress) == null ? void 0 : l.completed_count) ?? g.value.filter((h) => h.state === "completed").length;
    }), q = f(() => {
      var l;
      return ((l = t.progress) == null ? void 0 : l.task_count) ?? g.value.length;
    }), J = f(() => `${W.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), U = f(() => {
      var h;
      const l = tt(W.value, ((h = t.progress) == null ? void 0 : h.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, z.value);
      return t.row.role !== "main" && l ? `${l} per hour` : "";
    }), G = f(() => g.value.length ? i.map((l) => ({ state: l, label: l.slice(0, 1).toUpperCase() + l.slice(1), tasks: g.value.filter((h) => h.state === l || l === "started" && h.state === "testing" || l === "completed" && h.state === "cancelled") })) : []), d = /* @__PURE__ */ new Set(["completed"]), n = H({}), u = (l) => !(n.value[l] ?? d.has(l)), Q = (l) => n.value = { ...n.value, [l]: u(l) }, X = Ee(), r = f(() => t.row.access === "read-only"), $ = f(() => r.value ? X.tabs.filter((l) => ["transcript", "terminal"].includes(l.key)) : X.tabs), R = H($.value[0]);
    pe(() => t.open, (l) => {
      l && (R.value = $.value[0]);
    });
    const ie = Object.fromEntries(X.tabs.filter((l) => l.component).map((l) => [l.key, Je(() => at(l.component))])), P = f(() => t.row.role === "helper" && !t.row.ended_at), _ = () => X.run(["helper", "stop", String(t.row.id)]), ne = H(!1), Y = H(""), le = H(""), de = f(() => t.row.role !== "main" && (!t.row.ended_at || L.value || t.waitReason));
    async function ue() {
      if (!de.value) return;
      const l = await X.read(`usage tool --agent ${t.row.id}`);
      Y.value = l.ok ? l.value.tool : "", le.value = l.ok ? l.value.note : "";
    }
    const ee = X.follow(["hook_call.*", "process_part.*"], ue);
    return Ce(() => ee == null ? void 0 : ee()), ue(), (l, h) => {
      var oe, he, ye, k;
      return a(), s("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: h[5] || (h[5] = (p) => !e.open && v("toggle")),
        onKeydown: [
          h[6] || (h[6] = Te(fe((p) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          h[7] || (h[7] = Te(fe((p) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        A("span", ta, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: h[0] || (h[0] = fe((p) => v("toggle"), ["stop"]))
          }, [
            M(y(Ve), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : x("", !0),
          A("span", {
            class: "agent-dot",
            "data-state": N.value,
            "data-agent-motion": ""
          }, null, 8, aa),
          A("span", na, m(T.value), 1),
          A("span", la, m(((oe = e.facts) == null ? void 0 : oe.given_name) || e.row.id), 1),
          e.open ? x("", !0) : (a(), O(y(Ve), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          A("span", oa, [
            e.row.ended_at && !L.value ? (a(), O(y(Re), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), s("span", sa, m(D.value), 1)),
            (he = e.facts) != null && he.last_activity ? (a(), s("span", ra, [
              h[8] || (h[8] = w("Last heard: ", -1)),
              M(y(Re), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : x("", !0)
          ])
        ]),
        A("span", ia, [
          A("span", ca, m(F.value), 1),
          q.value && !E.value ? (a(), s("span", da, m(J.value), 1)) : x("", !0)
        ]),
        E.value ? (a(), s("span", ua, [
          A("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: E.value
          }, [
            V.value ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": V.value,
              onClick: h[1] || (h[1] = fe((p) => y(He)(V.value), ["stop"]))
            }, m(E.value), 9, pa)) : (a(), s(I, { key: 1 }, [
              w(m(E.value), 1)
            ], 64))
          ], 8, ha),
          q.value ? (a(), s("span", ga, m(J.value), 1)) : x("", !0)
        ])) : x("", !0),
        !e.open && (de.value || q.value && U.value) ? (a(), s("span", {
          key: 1,
          class: se(["agent-foot", { "agent-work-start": !E.value }]),
          "data-agent-foot": ""
        }, [
          de.value ? (a(), O(Oe, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: L.value,
            command: Y.value,
            note: le.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : x("", !0),
          q.value && U.value ? (a(), s("span", va, m(U.value), 1)) : x("", !0)
        ], 2)) : x("", !0),
        e.open ? (a(), s("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: h[4] || (h[4] = fe(() => {
          }, ["stop"]))
        }, [
          M(Pt, {
            agent: e.row,
            branch: (ye = e.progress) == null ? void 0 : ye.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: C(() => [
              P.value ? (a(), O(y(Ne), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: _
              }, {
                default: C(() => [...h[9] || (h[9] = [
                  w("Stop", -1)
                ])]),
                _: 1
              })) : x("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          de.value ? (a(), O(Oe, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: L.value,
            command: Y.value,
            note: le.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : x("", !0),
          Z.value ? (a(), s("p", fa, m(Z.value), 1)) : x("", !0),
          M(y(nt), {
            class: "agent-tabs",
            tabs: $.value,
            active: R.value,
            answer: { tasks: g.value.length },
            onChoose: h[2] || (h[2] = (p) => R.value = p)
          }, null, 8, ["tabs", "active", "answer"]),
          M(y(lt), {
            class: "agent-tab-body",
            tab: R.value,
            "data-agent-tab-body": (k = R.value) == null ? void 0 : k.key
          }, {
            default: C(() => {
              var p;
              return [
                M(y(ot), {
                  value: (p = R.value) == null ? void 0 : p.key
                }, Ge({
                  tasks: C(() => {
                    var o;
                    return [
                      g.value.length ? x("", !0) : (a(), O(y(qe), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: C(() => [...h[10] || (h[10] = [
                          w("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), s(I, null, ae(G.value, (S) => (a(), O(_t, {
                        key: S.state,
                        section: S,
                        open: u(S.state),
                        onToggle: (ke) => Q(S.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (o = e.facts) != null && o.instruction ? (a(), s(I, { key: 1 }, [
                        h[11] || (h[11] = A("p", { class: "agent-label" }, "Instruction", -1)),
                        A("div", ma, m(e.facts.instruction), 1)
                      ], 64)) : x("", !0)
                    ];
                  }),
                  transcript: C(() => {
                    var o;
                    return [
                      r.value ? (a(), s(I, { key: 0 }, [
                        (o = e.facts) != null && o.instruction ? (a(), s("div", ya, [
                          M(y(Ie), {
                            label: "Instruction",
                            open: ne.value,
                            "data-agent-section": "instruction",
                            onToggle: h[3] || (h[3] = (S) => ne.value = !ne.value)
                          }, {
                            default: C(() => [
                              A("div", ka, m(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), s("p", wa, "No job recorded")) : x("", !0)
                      ], 64)) : x("", !0),
                      M(dt, {
                        line: `agent transcript ${e.row.id}`,
                        agent: r.value ? P.value ? e.row.id : null : e.row.id,
                        helper: r.value && P.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  ae(y(ie), (o, S) => ({
                    name: S,
                    fn: C(() => [
                      (a(), O(Ye(o), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : x("", !0)
      ], 42, ea);
    };
  }
}, xa = /* @__PURE__ */ re(ba, [["__scopeId", "data-v-1c5533dd"]]), $a = ["data-agent-row"], je = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", Ca = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const b = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], c = e, { rows: i } = st("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: t } = Le("waits"), { rows: v } = Le("progress"), z = (k) => v.value.find((p) => p.agent_id === k.id) ?? null, T = (k) => {
      var p;
      return ((p = t.value.find((o) => o.agent_id === k.id)) == null ? void 0 : p.reason) ?? "";
    }, g = H("running"), B = H(""), E = JSON.parse(localStorage.getItem(je) || '{"roles":[],"profiles":[],"programs":[]}'), V = H(E), F = H({ roles: [], profiles: [] }), Z = H([]), D = f(() => V.value.roles.length + V.value.profiles.length + V.value.programs.length), j = (k, p) => {
      const o = V.value[k];
      V.value = { ...V.value, [k]: o.includes(p) ? o.filter((S) => S !== p) : [...o, p] };
    }, L = () => {
      V.value = { roles: [], profiles: [], programs: [] };
    }, N = (k) => k.slice(0, 1).toUpperCase() + k.slice(1);
    pe(V, (k) => localStorage.setItem(je, JSON.stringify(k)));
    const W = Ee();
    async function q() {
      const [k, p] = await Promise.all([W.read("agent cards --options"), W.read("agent programs")]);
      k.ok && (F.value = k.value), p.ok && (Z.value = p.value.rows);
    }
    W.follow(["agent.*"], q), q();
    const J = H([]), U = H(""), G = H(!1), d = H(!1), n = H(25);
    let u = 0;
    async function Q() {
      const k = ++u, p = [
        ...V.value.roles.map((S) => `--role ${JSON.stringify(S)}`),
        ...V.value.profiles.map((S) => `--profile ${JSON.stringify(S)}`),
        ...V.value.programs.map((S) => `--program ${JSON.stringify(S)}`)
      ].join(" "), o = await W.read(`${c.line} --show ${g.value} --search ${JSON.stringify(B.value)} --limit ${n.value} ${p}`);
      k === u && (J.value = o.ok ? o.value.rows : [], U.value = o.ok ? "" : o.error, d.value = o.ok && o.value.page * o.value.size < o.value.total, G.value = !0);
    }
    async function X() {
      return n.value += 25, await Q(), !0;
    }
    pe([g, B, V], () => {
      n.value = 25, Q();
    }), W.follow(["agent.*", "task.*", ...W.sources.flatMap((k) => k.events)], Q), Q();
    const r = (k) => i.value.find((p) => p.id === k.id) ?? null, $ = J, R = f(() => !!B.value.trim() || D.value > 0), ie = f(() => c.texts[g.value] ?? { title: c.empty, hint: "" }), P = H(null), _ = H(null), ne = H(null), Y = f(() => $.value.find((k) => k.id === P.value) ?? null), le = f(() => Y.value ? [Y.value] : $.value), de = f(() => $.value.length - le.value.length), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ee = !1, l = 0;
    async function h(k) {
      if (ee) return;
      ee = !0, l = ne.value.scrollTop;
      const p = _.value.querySelector(`[data-agent-open="${k.id}"]`);
      if (!ue()) {
        const ce = [..._.value.querySelectorAll(".agent-row")].filter((te) => !te.contains(p));
        await Promise.all(ce.map((te) => te.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const o = [...p.querySelectorAll(".agent-head, .agent-line")], S = [...o, ...p.querySelectorAll("[data-agent-motion]")], ke = S.map((ce) => ce.getBoundingClientRect());
      if (P.value = k.id, await Ae(), !ue()) {
        const ce = S.map((te) => te.getBoundingClientRect());
        S.forEach((te, be) => {
          const ge = o.indexOf(te.parentElement), De = ke[be].left - ce[be].left - (ge < 0 ? 0 : ke[ge].left - ce[ge].left), Pe = ke[be].top - ce[be].top - (ge < 0 ? 0 : ke[ge].top - ce[ge].top);
          te.animate([{ transform: `translate(${De}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), _.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((te) => {
          te.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      ee = !1;
    }
    async function oe() {
      if (ee || !Y.value) return;
      ee = !0;
      const k = _.value.querySelector(`[data-agent-open="${P.value}"]`), p = [...k.children, ..._.value.querySelectorAll(".agents-held")], o = ue() ? [] : p.map((S) => S.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(o.map((S) => S.finished)), P.value = null, await Ae(), ne.value.scrollTop = l, o.forEach((S) => S.cancel()), ue() || (k.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), _.value.querySelectorAll(".agent-row").forEach((S) => {
        S.contains(k) || S.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), ee = !1;
    }
    const he = (k) => P.value === k.id ? oe() : h(k);
    pe(B, (k) => k.trim() && (P.value = null)), pe(g, () => {
      P.value = null;
    });
    const ye = (k) => {
      k.key === "Escape" && oe();
    };
    return window.addEventListener("keydown", ye), Ce(() => window.removeEventListener("keydown", ye)), (k, p) => (a(), s("div", {
      ref_key: "agents",
      ref: _,
      class: se(["agents", { focused: Y.value }])
    }, [
      M(y(rt), {
        modelValue: B.value,
        "onUpdate:modelValue": p[1] || (p[1] = (o) => B.value = o),
        placeholder: "Search agents",
        "menu-count": D.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          M(y(Se), null, {
            default: C(() => [...p[2] || (p[2] = [
              w("Kind", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(I, null, ae(F.value.roles, (o) => (a(), O(y(xe), {
            key: o,
            role: "menuitemcheckbox",
            "aria-checked": V.value.roles.includes(o),
            checked: V.value.roles.includes(o),
            "data-filter-role": o,
            onClick: (S) => j("roles", o)
          }, {
            default: C(() => [
              w(m(N(o)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          M(y(Se), null, {
            default: C(() => [...p[3] || (p[3] = [
              w("Profile", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(I, null, ae(F.value.profiles, (o) => (a(), O(y(xe), {
            key: o,
            role: "menuitemcheckbox",
            "aria-checked": V.value.profiles.includes(o),
            checked: V.value.profiles.includes(o),
            "data-filter-profile": o,
            onClick: (S) => j("profiles", o)
          }, {
            default: C(() => [
              w(m(o), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          M(y(Se), null, {
            default: C(() => [...p[4] || (p[4] = [
              w("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(I, null, ae(Z.value, (o) => (a(), O(y(xe), {
            key: o.name,
            role: "menuitemcheckbox",
            "aria-checked": V.value.programs.includes(o.name),
            checked: V.value.programs.includes(o.name),
            "data-filter-program": o.name,
            onClick: (S) => j("programs", o.name)
          }, {
            default: C(() => [
              w(m(o.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          D.value ? (a(), O(y(xe), {
            key: 0,
            "data-filter-clear": "",
            onClick: L
          }, {
            default: C(() => [...p[5] || (p[5] = [
              w("Clear filters", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ]),
        default: C(() => [
          M(y(it), {
            options: b,
            value: g.value,
            onPick: p[0] || (p[0] = (o) => g.value = o)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      A("div", {
        ref_key: "list",
        ref: ne,
        class: se(["agents-view", { "agents-view-open": Y.value }])
      }, [
        G.value && !U.value && !le.value.length && D.value ? (a(), O(y(qe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            M(y(Ne), {
              small: "",
              "data-empty-clear": "",
              onClick: L
            }, {
              default: C(() => [...p[6] || (p[6] = [
                w("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), O(y(ct), {
          key: 1,
          rows: le.value,
          failure: U.value,
          loaded: G.value,
          more: !Y.value && d.value,
          older: X,
          empty: ie.value.title,
          hint: ie.value.hint,
          searching: R.value
        }, {
          default: C(({ row: o }) => [
            A("div", {
              class: "agent-row",
              "data-agent-row": o.id
            }, [
              M(xa, {
                row: o,
                facts: r(o),
                progress: z(o),
                "wait-reason": T(o),
                open: o.id === P.value,
                onToggle: (S) => he(o)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, $a)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Y.value && de.value ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: oe
      }, m(de.value) + " more", 1)) : x("", !0)
    ], 2));
  }
}, Ha = /* @__PURE__ */ re(Ca, [["__scopeId", "data-v-20c0b9d9"]]);
export {
  Ha as A
};
