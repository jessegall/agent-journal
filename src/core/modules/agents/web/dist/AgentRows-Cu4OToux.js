/* @code-commandments-generated */
import { openBlock as a, createElementBlock as s, normalizeStyle as ze, normalizeClass as ie, toDisplayString as v, createCommentVNode as M, createElementVNode as A, renderSlot as Me, computed as g, createVNode as x, withCtx as S, createTextVNode as k, Fragment as E, renderList as ne, onUnmounted as Se, ref as V, onMounted as Be, createBlock as R, Teleport as Ke, mergeProps as Ue, watch as pe, toRef as Ze, unref as m, withModifiers as he, defineAsyncComponent as _e, withKeys as He, createSlots as Je, resolveDynamicComponent as Ge, nextTick as Ae } from "vue";
import { peekRef as Ce, Icon as Ve, RunningCommand as Ye, FoldGroup as Ie, TaskStatusIcon as Qe, useNow as Xe, age as et, perHour as tt, useWindow as Ee, loadWindowComponent as at, TimeAgo as Re, Btn as Ne, InnerTabs as nt, TabBody as lt, SwitchCase as ot, EmptyState as qe, useRows as st, useDeclaredRows as Le, SearchBar as rt, Segmented as it, MenuLabel as Te, MenuItem as xe, RowList as ct } from "@journal/window-kit";
import { _ as ce, T as dt } from "./TranscriptRows-ByPSYos4.js";
const ut = ["stroke-width", "innerHTML"], K = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const b = e, d = { right: 0, down: 90, left: 180, up: 270 }, c = {
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
    return (f, z) => (a(), s("svg", {
      class: "ico",
      style: ze({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...b.facing === "right" ? {} : { transform: `rotate(${d[b.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[c[e.name] || e.name] || t.dot
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
    return (b, d) => (a(), s("button", {
      type: "button",
      class: ie(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", ht, v(e.checked ? "✓" : ""), 1)) : M("", !0),
      e.description ? (a(), s("span", pt, [
        A("span", null, [
          Me(b.$slots, "default", {}, void 0, !0)
        ]),
        A("small", null, v(e.description), 1)
      ])) : Me(b.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ ce(gt, [["__scopeId", "data-v-fec99974"]]), vt = {}, ft = { class: "menu-label" };
function mt(e, b) {
  return a(), s("span", ft, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ ce(vt, [["render", mt], ["__scopeId", "data-v-aa955b3e"]]), yt = {
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
    const d = e, c = b, t = g(() => d.skills.filter((z) => z.state === "loaded")), f = g(() => d.skills.filter((z) => z.state !== "loaded"));
    return (z, H) => (a(), s("div", yt, [
      x(we, null, {
        default: S(() => [...H[1] || (H[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? M("", !0) : (a(), s("p", kt, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(E, null, ne(t.value, (p) => (a(), s("p", {
        key: p.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        x(K, {
          name: "book",
          size: 12
        }),
        k(v(p.skill), 1)
      ]))), 128)),
      f.value.length ? (a(), s(E, { key: 1 }, [
        x(we, null, {
          default: S(() => [...H[2] || (H[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(E, null, ne(f.value, (p) => (a(), s("p", {
          key: p.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          x(K, {
            name: "book",
            size: 12
          }),
          k(v(p.skill), 1)
        ]))), 128))
      ], 64)) : M("", !0),
      x(ke, {
        "data-agent-skills-browse": "",
        onClick: H[0] || (H[0] = (p) => c("browse"))
      }, {
        default: S(() => [...H[3] || (H[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Mt = /* @__PURE__ */ ce(wt, [["__scopeId", "data-v-be514d47"]]), bt = (e, b, d) => Math.max(b, Math.min(d, e)), We = /* @__PURE__ */ new WeakMap(), xt = (e, b) => We.set(e, b);
function $t(e, b) {
  for (let d = b; d; d = We.get(d) ?? d.parentElement) if (d === e) return !0;
  return !1;
}
function Ct(e, b) {
  const d = (c) => {
    var f, z;
    const t = ((f = e.value) == null ? void 0 : f.element) || ((z = e.value) == null ? void 0 : z.$el) || e.value;
    t && !$t(t, c.target) && b(c);
  };
  window.addEventListener("click", d), Se(() => window.removeEventListener("click", d));
}
const ye = 8, St = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: b, emit: d }) {
    const c = e, t = V(null), f = (r) => r ? `${r}px` : void 0, z = g(() => ({
      minWidth: f(c.minWidth),
      maxWidth: f(c.maxWidth),
      maxHeight: f(c.maxHeight),
      height: f(c.height)
    })), H = V({ w: 0, h: 0 }), p = V(c.anchor ? c.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), C = (r) => {
      const $ = r.closest(".pane, .float-window");
      return $ ? q($.getBoundingClientRect()) : B();
    }, N = (r, $) => `${Math.max(0, r ? Math.min(r, $) : $)}px`;
    function ee(r, $) {
      return {
        below: r.bottom - $.bottom - c.gap - ye,
        above: $.top - r.top - c.gap - ye,
        across: r.right - r.left - 2 * ye
      };
    }
    function F(r) {
      const $ = C(c.anchor), j = ee($, r);
      return H.value.w <= j.across && H.value.h <= Math.max(j.below, j.above) ? $ : B();
    }
    const O = g(() => {
      if (!p.value) return z.value;
      const r = p.value, $ = F(r), j = ee($, r), { w: Z, h: Y } = H.value, _ = c.align === "auto" ? r.left + r.right > $.left + $.right : c.align === "right", ue = bt(_ ? r.right - Z : r.left, $.left + ye, Math.max($.left + ye, $.right - Z - ye)), le = Y > j.below && j.above > j.below ? { bottom: `${window.innerHeight - r.top + c.gap}px`, maxHeight: N(c.maxHeight, j.above) } : { top: `${r.bottom + c.gap}px`, maxHeight: N(c.maxHeight, j.below) };
      return { ...z.value, ...le, left: `${ue}px`, maxWidth: N(c.maxWidth, j.across) };
    }), I = d, L = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function P(r) {
      const $ = L(), j = $.indexOf(document.activeElement);
      $[(j + r + $.length) % $.length].focus();
    }
    const U = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => I("close") }, W = (r) => U[r.key] && (r.preventDefault(), U[r.key]()), J = () => t.value && (H.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let D = 0;
    const h = new ResizeObserver(() => {
      cancelAnimationFrame(D), D = requestAnimationFrame(J);
    });
    Ct(t, (r) => c.anchor && !c.anchor.contains(r.target) && I("close"));
    const l = (r, $) => ["top", "left", "right", "bottom"].some((j) => Math.abs(r[j] - $[j]) > 1), u = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let G = 0;
    function ge() {
      if (c.anchor) {
        const r = c.anchor.getBoundingClientRect();
        if (!c.anchor.isConnected || u(r)) return I("close");
        l(r, p.value) && (p.value = r);
      }
      G = requestAnimationFrame(ge);
    }
    return Be(() => {
      c.anchor && t.value && xt(t.value, c.anchor), J(), t.value && h.observe(t.value), !c.plain && L()[0] && L()[0].focus(), ge();
    }), Se(() => {
      h.disconnect(), cancelAnimationFrame(G), cancelAnimationFrame(D);
    }), b({ element: t }), (r, $) => (a(), R(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      A("div", Ue({
        ref_key: "panel",
        ref: t
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: W
      }), [
        Me(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Tt = /* @__PURE__ */ ce(St, [["__scopeId", "data-v-3d203970"]]);
async function zt(e, b, d) {
  if (!e) return d(b);
  const { target: c, fields: t } = e, f = Object.fromEntries(Object.keys(t).map((p) => [p, c[p]])), z = () => Object.assign(c, f);
  Object.assign(c, t);
  let H = !1;
  try {
    const p = await d(b);
    return H = p.ok, p;
  } finally {
    H || z();
  }
}
function Vt(e, b, d) {
  const c = V([]), t = V([]), f = V({}), z = V(""), H = V(!1), p = g(() => !!e.value && !e.value.ended_at), B = g(() => p.value && !!e.value.paused_at);
  async function q() {
    if (p.value) {
      const I = await b(["agent", "controls", String(e.value.id)]);
      c.value = I.ok ? I.value.groups : [];
      return;
    }
    const O = await b(["agent", "programs"]);
    t.value = O.ok ? O.value.rows : [];
  }
  async function C(O, I = null) {
    z.value = "";
    const L = await zt(I, O, b);
    return z.value = L.ok ? "" : L.error, d(), L;
  }
  const N = (O, I) => C(["agent", "control", String(e.value.id), O, I.value], { target: f, fields: { value: { ...f.value, [O]: I.label } } }), ee = () => (H.value = !1, C(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), F = (O) => C(["agent", "launch", O.name]);
  return Be(q), pe(p, q), { groups: c, programs: t, chosen: f, failure: z, asking: H, running: p, paused: B, choose: N, stop: ee, start: F };
}
const Fe = { claude: "Claude Code", codex: "Codex" };
Object.entries(Fe).map(([e, b]) => ({ key: e, label: b }));
function Ht(e, b = "agent") {
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
}, Wt = ["title"], Ft = 75, Pt = {
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
    const d = e, c = b, t = Vt(Ze(d, "agent"), d.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => c("changed")), f = V(null), z = V(""), H = g(() => t.groups.value.find((h) => h.key === z.value));
    function p(h, l) {
      f.value = h.currentTarget, z.value = l;
    }
    function B() {
      f.value = null, z.value = "", t.asking.value = !1;
    }
    const q = V([]), C = g(() => q.value.filter((h) => h.state === "loaded"));
    async function N() {
      const h = d.agent && d.run ? await d.run(["agent-skill", "list", "--agent", String(d.agent.id)]) : null;
      q.value = h != null && h.ok ? h.value.rows ?? [] : [];
    }
    function ee(h) {
      p(h, "skills"), N();
    }
    pe(() => {
      var h;
      return (h = d.agent) == null ? void 0 : h.id;
    }, N, { immediate: !0 });
    const F = (h) => t.groups.value.some((l) => l.key === h), O = g(() => {
      var h;
      return t.chosen.value.model ?? ((h = L.value) == null ? void 0 : h.model) ?? "";
    }), I = g(() => {
      var h;
      return t.chosen.value.effort ?? ((h = L.value) == null ? void 0 : h.effort) ?? "";
    });
    g(() => !!d.agent && !d.agent.ended_at);
    const L = g(() => {
      var h;
      return ((h = d.usage.agents) == null ? void 0 : h.find((l) => {
        var u;
        return l.id === ((u = d.agent) == null ? void 0 : u.id);
      })) ?? null;
    }), P = g(() => {
      var h;
      return ((h = d.usage.windows) == null ? void 0 : h[0]) ?? null;
    }), U = g(() => P.value ? Math.max(0, Math.min(100, Math.round(P.value.used_percent))) : null), W = g(() => {
      var h;
      return ((h = L.value) == null ? void 0 : h.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), J = g(() => {
      var h;
      return (h = L.value) != null && h.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), D = g(() => {
      var u;
      const h = (u = d.agent) != null && u.process_started_at ? new Date(d.agent.process_started_at).getTime() : 0;
      if (!h) return "";
      const l = Math.max(0, Math.floor((d.now - h) / 6e4));
      return l >= 60 ? `${Math.floor(l / 60)}h ${l % 60}m` : `${l}m`;
    });
    return (h, l) => (a(), s("div", {
      class: ie(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), s(E, { key: 0 }, [
        A("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: l[0] || (l[0] = (u) => p(u, "agent"))
        }, [
          x(K, {
            name: "agents",
            size: 12
          }),
          k(" " + v(m(Ht)(e.agent.program)), 1)
        ], 8, At),
        U.value !== null ? (a(), s("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${U.value}% of the plan's ${P.value.title} allowance used`,
          onClick: l[1] || (l[1] = (u) => c("open", "usage", u.currentTarget))
        }, [
          x(K, {
            name: "clock",
            size: 12
          }),
          l[14] || (l[14] = k()),
          A("span", Lt, [
            A("span", {
              style: ze({ width: `${U.value}%` })
            }, null, 4)
          ]),
          k(" " + v(U.value) + "% ", 1)
        ], 8, Rt)) : M("", !0),
        W.value !== null ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${W.value}% full: clear or compact it`,
          onClick: l[2] || (l[2] = (u) => F("context") ? p(u, "context") : c("open", "context", u.currentTarget))
        }, [
          x(K, {
            name: "gauge",
            size: 12
          }),
          l[15] || (l[15] = k()),
          A("span", jt, [
            A("span", {
              style: ze({ width: `${W.value}%` })
            }, null, 4)
          ]),
          k(" " + v(W.value) + "% ", 1)
        ], 8, Ot)) : M("", !0),
        O.value ? (a(), s("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${O.value}: change the model`,
          onClick: l[3] || (l[3] = (u) => F("model") ? p(u, "model") : null)
        }, [
          x(K, {
            name: "model",
            size: 12
          }),
          k(" " + v(O.value), 1)
        ], 8, Bt)) : M("", !0),
        F("effort") || e.card && I.value ? (a(), s("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: l[4] || (l[4] = (u) => p(u, "effort"))
        }, [
          x(K, {
            name: "bolt",
            size: 12
          }),
          k(" " + v(I.value), 1)
        ], 8, It)) : M("", !0),
        J.value ? (a(), s("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: l[5] || (l[5] = (u) => c("open", "cost", u.currentTarget))
        }, v(J.value), 9, Et)) : M("", !0),
        D.value ? (a(), s("span", Nt, [
          x(K, {
            name: "reminders",
            size: 12
          }),
          k(" " + v(D.value), 1)
        ])) : M("", !0),
        e.branch ? (a(), s("span", qt, [
          x(K, {
            name: "branch",
            size: 12
          }),
          k(" " + v(e.branch), 1)
        ])) : M("", !0),
        e.card ? M("", !0) : (a(), s("button", {
          key: 7,
          type: "button",
          class: ie(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: l[6] || (l[6] = (u) => c("open", "jobs", u.currentTarget))
        }, [
          x(K, {
            name: "clock",
            size: 12
          }),
          k(" " + v(e.jobs), 1)
        ], 2)),
        e.run ? (a(), s("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: ee
        }, [
          x(K, {
            name: "book",
            size: 12
          }),
          k(" " + v(C.value.length), 1)
        ])) : M("", !0),
        e.fitness ? (a(), s(E, { key: 9 }, [
          A("button", {
            type: "button",
            class: ie(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ft }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: l[7] || (l[7] = (u) => c("open", "fitness", u.currentTarget))
          }, [
            x(K, {
              name: "heart",
              size: 12
            }),
            k(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          A("button", {
            type: "button",
            class: ie(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: l[8] || (l[8] = (u) => c("open", "load", u.currentTarget))
          }, [
            x(K, {
              name: "weight",
              size: 12
            }),
            k(" " + v(e.fitness.workload), 1)
          ], 2)
        ], 64)) : M("", !0)
      ], 64)) : e.run && !e.loading ? (a(), s("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: l[9] || (l[9] = (u) => p(u, "start"))
      }, [
        x(K, {
          name: "agents",
          size: 12
        }),
        l[16] || (l[16] = k(" Start an agent", -1))
      ])) : M("", !0),
      l[22] || (l[22] = A("span", { class: "space" }, null, -1)),
      m(t).failure.value ? (a(), s("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: m(t).failure.value
      }, v(m(t).failure.value), 9, Wt)) : M("", !0),
      Me(h.$slots, "default", {}, void 0, !0),
      f.value ? (a(), R(Tt, {
        key: 3,
        anchor: f.value,
        "min-width": 190,
        onClose: B
      }, {
        default: S(() => [
          z.value === "agent" ? (a(), s(E, { key: 0 }, [
            m(t).asking.value ? (a(), s(E, { key: 0 }, [
              x(we, { "data-agent-stop-ask": "" }, {
                default: S(() => [...l[17] || (l[17] = [
                  k("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              x(ke, {
                "data-agent-stop-confirm": "",
                onClick: l[10] || (l[10] = (u) => (B(), m(t).stop()))
              }, {
                default: S(() => [...l[18] || (l[18] = [
                  k("Stop it", -1)
                ])]),
                _: 1
              }),
              x(ke, {
                onClick: l[11] || (l[11] = (u) => m(t).asking.value = !1)
              }, {
                default: S(() => [...l[19] || (l[19] = [
                  k("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), R(ke, {
              key: 1,
              "data-agent-stop": "",
              onClick: l[12] || (l[12] = (u) => m(t).asking.value = !0)
            }, {
              default: S(() => [...l[20] || (l[20] = [
                k("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : z.value === "start" ? (a(), s(E, { key: 1 }, [
            x(we, null, {
              default: S(() => [...l[21] || (l[21] = [
                k("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), s(E, null, ne(m(t).programs.value, (u) => (a(), R(ke, {
              key: u.name,
              "data-agent-program": u.name,
              onClick: (G) => (B(), m(t).start(u))
            }, {
              default: S(() => [
                k(v(u.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : z.value === "skills" ? (a(), R(Mt, {
            key: 2,
            skills: q.value,
            onBrowse: l[13] || (l[13] = (u) => (B(), c("open", "skills", null)))
          }, null, 8, ["skills"])) : H.value ? (a(), s(E, { key: 3 }, [
            x(we, null, {
              default: S(() => [
                k(v(H.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), s(E, null, ne(H.value.choices, (u) => (a(), R(ke, {
              key: u.value,
              "data-agent-choice": u.value,
              onClick: (G) => (m(t).choose(H.value.key, u), B())
            }, {
              default: S(() => [
                k(v(u.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : M("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : M("", !0)
    ], 2));
  }
}, Dt = /* @__PURE__ */ ce(Pt, [["__scopeId", "data-v-cce150b4"]]), Kt = {
  class: "agent-command",
  "data-agent-command": ""
}, Ut = {
  key: 1,
  "data-agent-stopped": ""
}, Zt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (b, d) => (a(), s("span", Kt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: d[0] || (d[0] = he((c) => m(Ce)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + v(e.waitReason) + " ", 1),
        x(m(Ve), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Ut, "Waiting")) : (a(), R(m(Ye), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Oe = /* @__PURE__ */ ce(Zt, [["__scopeId", "data-v-1b371fb5"]]), _t = ["data-agent-delegated", "onClick"], Jt = { class: "agent-task-number" }, Gt = { class: "agent-task-title" }, Yt = ["title"], Qt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: b }) {
    const d = b;
    return (c, t) => (a(), R(m(Ie), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (f) => d("toggle"))
    }, {
      default: S(() => [
        (a(!0), s(E, null, ne(e.section.tasks, (f) => (a(), s("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (z) => m(Ce)(`tasks:${f.id}`)
        }, [
          x(m(Qe), {
            status: f.state
          }, null, 8, ["status"]),
          A("span", Jt, v(f.id), 1),
          A("span", Gt, v(f.title), 1),
          f.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + v(f.plan_id) + ": " + v(f.plan_title), 9, Yt)) : M("", !0)
        ], 8, _t))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Xt = /* @__PURE__ */ ce(Qt, [["__scopeId", "data-v-238ff959"]]), ea = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], ta = { class: "agent-head" }, aa = ["data-state"], na = {
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
  class: "agent-line"
}, fa = ["data-peek"], ma = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, ya = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, ka = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, wa = {
  key: 0,
  class: "agent-helper-brief"
}, Ma = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ba = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, xa = "It ended without a report", $a = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: b }) {
    const d = { helper: "Helper", reviewer: "Reviewer" }, c = ["started", "blocked", "open", "completed"], t = e, f = b, z = Xe(), H = g(() => {
      var i;
      const n = ((i = t.facts) == null ? void 0 : i.profile) || d[t.row.role] || t.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), p = g(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.tasks) ?? [];
    }), B = g(() => p.value.filter((n) => n.state === "open")), q = g(() => {
      const n = p.value.find((i) => {
        var te;
        return i.id === ((te = t.facts) == null ? void 0 : te.task_id);
      });
      return n != null && n.plan_id ? n : B.value.find((i) => i.plan_id);
    }), C = g(() => {
      var n, i, te, de;
      return t.row.role === "helper" ? ((n = t.facts) == null ? void 0 : n.helper_job) || "" : (i = t.facts) != null && i.job_enabled && (((te = t.facts) == null ? void 0 : te.task_title) || ((de = B.value[0]) == null ? void 0 : de.title)) || "";
    }), N = g(() => {
      const n = C.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), ee = g(() => {
      var n, i;
      return [t.row.program, (n = t.facts) == null ? void 0 : n.model, (i = t.facts) == null ? void 0 : i.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), F = g(() => {
      var n, i;
      return t.row.ended_at && ((i = (n = t.facts) == null ? void 0 : n.job_returned) != null && i.startsWith(xa)) ? t.facts.job_returned : "";
    }), O = g(() => et(t.row.process_started_at || t.row.created_at, z.value)), I = /* @__PURE__ */ new Set(["open", "started", "testing"]), L = g(() => !!t.row.ended_at && t.row.role !== "main" && p.value.some((n) => I.has(n.state))), P = g(() => {
      var n;
      return t.waitReason || L.value ? "waiting" : t.row.state === "running" && ((n = t.facts) == null ? void 0 : n.state) || t.row.state;
    }), U = g(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.completed_count) ?? p.value.filter((i) => i.state === "completed").length;
    }), W = g(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.task_count) ?? p.value.length;
    }), J = g(() => `${U.value} of ${W.value} ${W.value === 1 ? "task" : "tasks"}`), D = g(() => {
      var i;
      const n = tt(U.value, ((i = t.progress) == null ? void 0 : i.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, z.value);
      return t.row.role !== "main" && n ? `${n} per hour` : "";
    }), h = g(() => p.value.length ? c.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: p.value.filter((i) => i.state === n || n === "started" && i.state === "testing" || n === "completed" && i.state === "cancelled") })) : []), l = /* @__PURE__ */ new Set(["completed"]), u = V({}), G = (n) => !(u.value[n] ?? l.has(n)), ge = (n) => u.value = { ...u.value, [n]: G(n) }, r = Ee(), $ = g(() => t.row.access === "read-only"), j = g(() => $.value ? r.tabs.filter((n) => ["transcript", "terminal"].includes(n.key)) : r.tabs), Z = V(j.value[0]);
    pe(() => t.open, (n) => {
      n && (Z.value = j.value[0]);
    });
    const Y = Object.fromEntries(r.tabs.filter((n) => n.component).map((n) => [n.key, _e(() => at(n.component))])), _ = g(() => t.row.role === "helper" && !t.row.ended_at), ue = () => r.run(["helper", "stop", String(t.row.id)]), Q = V(!1), le = V(""), ve = V(""), oe = g(() => t.row.role !== "main" && (!t.row.ended_at || L.value || t.waitReason));
    async function se() {
      if (!oe.value) return;
      const n = await r.read(`usage tool --agent ${t.row.id}`);
      le.value = n.ok ? n.value.tool : "", ve.value = n.ok ? n.value.note : "";
    }
    const fe = r.follow(["hook_call.*", "process_part.*"], se);
    return Se(() => fe == null ? void 0 : fe()), se(), (n, i) => {
      var te, de, y, w;
      return a(), s("div", {
        class: ie(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: i[6] || (i[6] = (o) => !e.open && f("toggle")),
        onKeydown: [
          i[7] || (i[7] = He(he((o) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          i[8] || (i[8] = He(he((o) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        A("span", ta, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = he((o) => f("toggle"), ["stop"]))
          }, [
            x(m(Ve), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : M("", !0),
          A("span", {
            class: "agent-dot",
            "data-state": P.value,
            "data-agent-motion": ""
          }, null, 8, aa),
          A("span", na, v(H.value), 1),
          A("span", la, v(((te = e.facts) == null ? void 0 : te.given_name) || e.row.id), 1),
          e.open ? M("", !0) : (a(), R(m(Ve), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          A("span", oa, [
            e.row.ended_at && !L.value ? (a(), R(m(Re), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), s("span", sa, v(O.value), 1)),
            (de = e.facts) != null && de.last_activity ? (a(), s("span", ra, [
              i[9] || (i[9] = k("Last heard: ", -1)),
              x(m(Re), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : M("", !0)
          ])
        ]),
        A("span", ia, [
          A("span", ca, v(ee.value), 1),
          W.value && !C.value ? (a(), s("span", da, v(J.value), 1)) : M("", !0)
        ]),
        C.value ? (a(), s("span", ua, [
          A("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: C.value
          }, [
            N.value ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": N.value,
              onClick: i[1] || (i[1] = he((o) => m(Ce)(N.value), ["stop"]))
            }, v(C.value), 9, pa)) : (a(), s(E, { key: 1 }, [
              k(v(C.value), 1)
            ], 64))
          ], 8, ha),
          W.value ? (a(), s("span", ga, v(J.value), 1)) : M("", !0)
        ])) : M("", !0),
        q.value ? (a(), s("span", va, [
          A("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${q.value.plan_id}`,
            onClick: i[2] || (i[2] = he((o) => m(Ce)(`plans:${q.value.plan_id}`), ["stop"]))
          }, "Plan " + v(q.value.plan_id) + ": " + v(q.value.plan_title), 9, fa)
        ])) : M("", !0),
        !e.open && (oe.value || W.value && D.value) ? (a(), s("span", {
          key: 2,
          class: ie(["agent-foot", { "agent-work-start": !C.value }]),
          "data-agent-foot": ""
        }, [
          oe.value ? (a(), R(Oe, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: L.value,
            command: le.value,
            note: ve.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : M("", !0),
          W.value && D.value ? (a(), s("span", ma, v(D.value), 1)) : M("", !0)
        ], 2)) : M("", !0),
        e.open ? (a(), s("div", {
          key: 3,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[5] || (i[5] = he(() => {
          }, ["stop"]))
        }, [
          x(Dt, {
            agent: e.row,
            branch: (y = e.progress) == null ? void 0 : y.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: S(() => [
              _.value ? (a(), R(m(Ne), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: ue
              }, {
                default: S(() => [...i[10] || (i[10] = [
                  k("Stop", -1)
                ])]),
                _: 1
              })) : M("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          oe.value ? (a(), R(Oe, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: L.value,
            command: le.value,
            note: ve.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : M("", !0),
          F.value ? (a(), s("p", ya, v(F.value), 1)) : M("", !0),
          x(m(nt), {
            class: "agent-tabs",
            tabs: j.value,
            active: Z.value,
            answer: { tasks: p.value.length },
            onChoose: i[3] || (i[3] = (o) => Z.value = o)
          }, null, 8, ["tabs", "active", "answer"]),
          x(m(lt), {
            class: "agent-tab-body",
            tab: Z.value,
            "data-agent-tab-body": (w = Z.value) == null ? void 0 : w.key
          }, {
            default: S(() => {
              var o;
              return [
                x(m(ot), {
                  value: (o = Z.value) == null ? void 0 : o.key
                }, Je({
                  tasks: S(() => {
                    var T;
                    return [
                      p.value.length ? M("", !0) : (a(), R(m(qe), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: S(() => [...i[11] || (i[11] = [
                          k("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), s(E, null, ne(h.value, (X) => (a(), R(Xt, {
                        key: X.state,
                        section: X,
                        open: G(X.state),
                        onToggle: (re) => ge(X.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (T = e.facts) != null && T.instruction ? (a(), s(E, { key: 1 }, [
                        i[12] || (i[12] = A("p", { class: "agent-label" }, "Instruction", -1)),
                        A("div", ka, v(e.facts.instruction), 1)
                      ], 64)) : M("", !0)
                    ];
                  }),
                  transcript: S(() => {
                    var T;
                    return [
                      $.value ? (a(), s(E, { key: 0 }, [
                        (T = e.facts) != null && T.instruction ? (a(), s("div", wa, [
                          x(m(Ie), {
                            label: "Instruction",
                            open: Q.value,
                            "data-agent-section": "instruction",
                            onToggle: i[4] || (i[4] = (X) => Q.value = !Q.value)
                          }, {
                            default: S(() => [
                              A("div", Ma, v(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), s("p", ba, "No job recorded")) : M("", !0)
                      ], 64)) : M("", !0),
                      x(dt, {
                        line: `agent transcript ${e.row.id}`,
                        agent: $.value ? _.value ? e.row.id : null : e.row.id,
                        helper: $.value && _.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  ne(m(Y), (T, X) => ({
                    name: X,
                    fn: S(() => [
                      (a(), R(Ge(T), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : M("", !0)
      ], 42, ea);
    };
  }
}, Ca = /* @__PURE__ */ ce($a, [["__scopeId", "data-v-a9a8328a"]]), Sa = ["data-agent-row"], je = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", Ta = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const b = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], d = e, { rows: c } = st("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: t } = Le("waits"), { rows: f } = Le("progress"), z = (y) => f.value.find((w) => w.agent_id === y.id) ?? null, H = (y) => {
      var w;
      return ((w = t.value.find((o) => o.agent_id === y.id)) == null ? void 0 : w.reason) ?? "";
    }, p = V("running"), B = V(""), q = JSON.parse(localStorage.getItem(je) || '{"roles":[],"profiles":[],"programs":[]}'), C = V(q), N = V({ roles: [], profiles: [] }), ee = V([]), F = g(() => C.value.roles.length + C.value.profiles.length + C.value.programs.length), O = (y, w) => {
      const o = C.value[y];
      C.value = { ...C.value, [y]: o.includes(w) ? o.filter((T) => T !== w) : [...o, w] };
    }, I = () => {
      C.value = { roles: [], profiles: [], programs: [] };
    }, L = (y) => y.slice(0, 1).toUpperCase() + y.slice(1);
    pe(C, (y) => localStorage.setItem(je, JSON.stringify(y)));
    const P = Ee();
    async function U() {
      const [y, w] = await Promise.all([P.read("agent cards --options"), P.read("agent programs")]);
      y.ok && (N.value = y.value), w.ok && (ee.value = w.value.rows);
    }
    P.follow(["agent.*"], U), U();
    const W = V([]), J = V(""), D = V(!1), h = V(!1), l = V(25);
    let u = 0;
    async function G() {
      const y = ++u, w = [
        ...C.value.roles.map((T) => `--role ${JSON.stringify(T)}`),
        ...C.value.profiles.map((T) => `--profile ${JSON.stringify(T)}`),
        ...C.value.programs.map((T) => `--program ${JSON.stringify(T)}`)
      ].join(" "), o = await P.read(`${d.line} --show ${p.value} --search ${JSON.stringify(B.value)} --limit ${l.value} ${w}`);
      y === u && (W.value = o.ok ? o.value.rows : [], J.value = o.ok ? "" : o.error, h.value = o.ok && o.value.page * o.value.size < o.value.total, D.value = !0);
    }
    async function ge() {
      return l.value += 25, await G(), !0;
    }
    pe([p, B, C], () => {
      l.value = 25, G();
    }), P.follow(["agent.*", "task.*", ...P.sources.flatMap((y) => y.events)], G), G();
    const r = (y) => c.value.find((w) => w.id === y.id) ?? null, $ = W, j = g(() => !!B.value.trim() || F.value > 0), Z = g(() => d.texts[p.value] ?? { title: d.empty, hint: "" }), Y = V(null), _ = V(null), ue = V(null), Q = g(() => $.value.find((y) => y.id === Y.value) ?? null), le = g(() => Q.value ? [Q.value] : $.value), ve = g(() => $.value.length - le.value.length), oe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let se = !1, fe = 0;
    async function n(y) {
      if (se) return;
      se = !0, fe = ue.value.scrollTop;
      const w = _.value.querySelector(`[data-agent-open="${y.id}"]`);
      if (!oe()) {
        const re = [..._.value.querySelectorAll(".agent-row")].filter((ae) => !ae.contains(w));
        await Promise.all(re.map((ae) => ae.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const o = [...w.querySelectorAll(".agent-head, .agent-line")], T = [...o, ...w.querySelectorAll("[data-agent-motion]")], X = T.map((re) => re.getBoundingClientRect());
      if (Y.value = y.id, await Ae(), !oe()) {
        const re = T.map((ae) => ae.getBoundingClientRect());
        T.forEach((ae, be) => {
          const me = o.indexOf(ae.parentElement), Pe = X[be].left - re[be].left - (me < 0 ? 0 : X[me].left - re[me].left), De = X[be].top - re[be].top - (me < 0 ? 0 : X[me].top - re[me].top);
          ae.animate([{ transform: `translate(${Pe}px, ${De}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), _.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((ae) => {
          ae.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      se = !1;
    }
    async function i() {
      if (se || !Q.value) return;
      se = !0;
      const y = _.value.querySelector(`[data-agent-open="${Y.value}"]`), w = [...y.children, ..._.value.querySelectorAll(".agents-held")], o = oe() ? [] : w.map((T) => T.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(o.map((T) => T.finished)), Y.value = null, await Ae(), ue.value.scrollTop = fe, o.forEach((T) => T.cancel()), oe() || (y.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), _.value.querySelectorAll(".agent-row").forEach((T) => {
        T.contains(y) || T.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), se = !1;
    }
    const te = (y) => Y.value === y.id ? i() : n(y);
    pe(B, (y) => y.trim() && (Y.value = null)), pe(p, () => {
      Y.value = null;
    });
    const de = (y) => {
      y.key === "Escape" && i();
    };
    return window.addEventListener("keydown", de), Se(() => window.removeEventListener("keydown", de)), (y, w) => (a(), s("div", {
      ref_key: "agents",
      ref: _,
      class: ie(["agents", { focused: Q.value }])
    }, [
      x(m(rt), {
        modelValue: B.value,
        "onUpdate:modelValue": w[1] || (w[1] = (o) => B.value = o),
        placeholder: "Search agents",
        "menu-count": F.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          x(m(Te), null, {
            default: S(() => [...w[2] || (w[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(E, null, ne(N.value.roles, (o) => (a(), R(m(xe), {
            key: o,
            role: "menuitemcheckbox",
            "aria-checked": C.value.roles.includes(o),
            checked: C.value.roles.includes(o),
            "data-filter-role": o,
            onClick: (T) => O("roles", o)
          }, {
            default: S(() => [
              k(v(L(o)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          N.value.profiles.length ? (a(), R(m(Te), { key: 0 }, {
            default: S(() => [...w[3] || (w[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : M("", !0),
          (a(!0), s(E, null, ne(N.value.profiles, (o) => (a(), R(m(xe), {
            key: o,
            role: "menuitemcheckbox",
            "aria-checked": C.value.profiles.includes(o),
            checked: C.value.profiles.includes(o),
            "data-filter-profile": o,
            onClick: (T) => O("profiles", o)
          }, {
            default: S(() => [
              k(v(o), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          x(m(Te), null, {
            default: S(() => [...w[4] || (w[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(E, null, ne(ee.value, (o) => (a(), R(m(xe), {
            key: o.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.programs.includes(o.name),
            checked: C.value.programs.includes(o.name),
            "data-filter-program": o.name,
            onClick: (T) => O("programs", o.name)
          }, {
            default: S(() => [
              k(v(o.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          F.value ? (a(), R(m(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: I
          }, {
            default: S(() => [...w[5] || (w[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : M("", !0)
        ]),
        default: S(() => [
          x(m(it), {
            options: b,
            value: p.value,
            onPick: w[0] || (w[0] = (o) => p.value = o)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      A("div", {
        ref_key: "list",
        ref: ue,
        class: ie(["agents-view", { "agents-view-open": Q.value }])
      }, [
        D.value && !J.value && !le.value.length && F.value ? (a(), R(m(qe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            x(m(Ne), {
              small: "",
              "data-empty-clear": "",
              onClick: I
            }, {
              default: S(() => [...w[6] || (w[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), R(m(ct), {
          key: 1,
          rows: le.value,
          failure: J.value,
          loaded: D.value,
          more: !Q.value && h.value,
          older: ge,
          empty: Z.value.title,
          hint: Z.value.hint,
          searching: j.value
        }, {
          default: S(({ row: o }) => [
            A("div", {
              class: "agent-row",
              "data-agent-row": o.id
            }, [
              x(Ca, {
                row: o,
                facts: r(o),
                progress: z(o),
                "wait-reason": H(o),
                open: o.id === Y.value,
                onToggle: (T) => te(o)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Sa)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Q.value && ve.value ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: i
      }, v(ve.value) + " more", 1)) : M("", !0)
    ], 2));
  }
}, Aa = /* @__PURE__ */ ce(Ta, [["__scopeId", "data-v-96523613"]]);
export {
  Aa as A
};
