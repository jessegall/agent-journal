/* @code-commandments-generated */
import { openBlock as a, createElementBlock as l, normalizeStyle as je, normalizeClass as re, toDisplayString as i, createCommentVNode as h, createElementVNode as x, renderSlot as Me, computed as S, createVNode as w, withCtx as A, createTextVNode as p, Fragment as E, renderList as ae, onUnmounted as Se, ref as T, onMounted as Ee, createBlock as N, Teleport as Ze, mergeProps as Ge, watch as de, toRef as Ye, unref as v, withModifiers as le, withDirectives as Qe, vModelSelect as Xe, defineAsyncComponent as et, withKeys as Ve, createSlots as tt, resolveDynamicComponent as at, nextTick as ze } from "vue";
import { peekRef as Ce, Icon as Te, RunningCommand as nt, FoldGroup as Ne, TaskStatusIcon as lt, useWindow as _e, Btn as te, SwitchCase as qe, TextInput as Re, TextArea as He, useNow as ot, age as st, perHour as it, loadWindowComponent as rt, coalesced as We, READ_RATES as De, TimeAgo as Oe, InnerTabs as ut, TabBody as dt, EmptyState as Fe, useRows as ct, useDeclaredRows as Le, SearchBar as vt, Segmented as gt, MenuLabel as Ae, MenuItem as xe, RowList as pt, toggleFilter as ht } from "@journal/window-kit";
import { _ as se, T as ft } from "./TranscriptRows-ByPSYos4.js";
const mt = ["stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const d = e, f = { right: 0, down: 90, left: 180, up: 270 }, g = {
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
    return (m, V) => (a(), l("svg", {
      class: "ico",
      style: je({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...d.facing === "right" ? {} : { transform: `rotate(${f[d.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[g[e.name] || e.name] || t.dot
    }, null, 12, mt));
  }
}, kt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, yt = {
  key: 1,
  class: "menu-item-text"
}, bt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (d, f) => (a(), l("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", kt, i(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), l("span", yt, [
        x("span", null, [
          Me(d.$slots, "default", {}, void 0, !0)
        ]),
        x("small", null, i(e.description), 1)
      ])) : Me(d.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ se(bt, [["__scopeId", "data-v-fec99974"]]), wt = {}, Mt = { class: "menu-label" };
function xt(e, d) {
  return a(), l("span", Mt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ se(wt, [["render", xt], ["__scopeId", "data-v-aa955b3e"]]), $t = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ct = {
  key: 0,
  class: "skills-none"
}, St = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: d }) {
    const f = e, g = d, t = S(() => f.skills.filter((V) => V.state === "loaded")), m = S(() => f.skills.filter((V) => V.state !== "loaded"));
    return (V, j) => (a(), l("div", $t, [
      w(we, null, {
        default: A(() => [...j[1] || (j[1] = [
          p("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? h("", !0) : (a(), l("p", Ct, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(E, null, ae(t.value, (k) => (a(), l("p", {
        key: k.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        w(ee, {
          name: "book",
          size: 12
        }),
        p(i(k.skill), 1)
      ]))), 128)),
      m.value.length ? (a(), l(E, { key: 1 }, [
        w(we, null, {
          default: A(() => [...j[2] || (j[2] = [
            p("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(E, null, ae(m.value, (k) => (a(), l("p", {
          key: k.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          w(ee, {
            name: "book",
            size: 12
          }),
          p(i(k.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      w(ye, {
        "data-agent-skills-browse": "",
        onClick: j[0] || (j[0] = (k) => g("browse"))
      }, {
        default: A(() => [...j[3] || (j[3] = [
          p("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, _t = /* @__PURE__ */ se(St, [["__scopeId", "data-v-be514d47"]]), At = (e, d, f) => Math.max(d, Math.min(f, e)), Pe = /* @__PURE__ */ new WeakMap(), jt = (e, d) => Pe.set(e, d);
function Tt(e, d) {
  for (let f = d; f; f = Pe.get(f) ?? f.parentElement) if (f === e) return !0;
  return !1;
}
function Rt(e, d) {
  const f = (g) => {
    var m, V;
    const t = ((m = e.value) == null ? void 0 : m.element) || ((V = e.value) == null ? void 0 : V.$el) || e.value;
    t && !Tt(t, g.target) && d(g);
  };
  window.addEventListener("click", f), Se(() => window.removeEventListener("click", f));
}
const ke = 8, Vt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: d, emit: f }) {
    const g = e, t = T(null), m = (s) => s ? `${s}px` : void 0, V = S(() => ({
      minWidth: m(g.minWidth),
      maxWidth: m(g.maxWidth),
      maxHeight: m(g.maxHeight),
      height: m(g.height)
    })), j = T({ w: 0, h: 0 }), k = T(g.anchor ? g.anchor.getBoundingClientRect() : null), q = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), _ = (s) => ({
      left: Math.max(0, s.left),
      top: Math.max(0, s.top),
      right: Math.min(window.innerWidth, s.right),
      bottom: Math.min(window.innerHeight, s.bottom)
    }), R = (s) => {
      const H = s.closest(".pane, .float-window");
      return H ? _(H.getBoundingClientRect()) : q();
    }, O = (s, H) => `${Math.max(0, s ? Math.min(s, H) : H)}px`;
    function z(s, H) {
      return {
        below: s.bottom - H.bottom - g.gap - ke,
        above: H.top - s.top - g.gap - ke,
        across: s.right - s.left - 2 * ke
      };
    }
    function M(s) {
      const H = R(g.anchor), D = z(H, s);
      return j.value.w <= D.across && j.value.h <= Math.max(D.below, D.above) ? H : q();
    }
    const $ = S(() => {
      if (!k.value) return V.value;
      const s = k.value, H = M(s), D = z(H, s), { w: Y, h: Q } = j.value, X = g.align === "auto" ? s.left + s.right > H.left + H.right : g.align === "right", oe = At(X ? s.right - Y : s.left, H.left + ke, Math.max(H.left + ke, H.right - Y - ke)), pe = Q > D.below && D.above > D.below ? { bottom: `${window.innerHeight - s.top + g.gap}px`, maxHeight: O(g.maxHeight, D.above) } : { top: `${s.bottom + g.gap}px`, maxHeight: O(g.maxHeight, D.below) };
      return { ...V.value, ...pe, left: `${oe}px`, maxWidth: O(g.maxWidth, D.across) };
    }), I = f, L = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function W(s) {
      const H = L(), D = H.indexOf(document.activeElement);
      H[(D + s + H.length) % H.length].focus();
    }
    const U = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => I("close") }, J = (s) => U[s.key] && (s.preventDefault(), U[s.key]()), F = () => t.value && (j.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let Z = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(Z), Z = requestAnimationFrame(F);
    });
    Rt(t, (s) => g.anchor && !g.anchor.contains(s.target) && I("close"));
    const u = (s, H) => ["top", "left", "right", "bottom"].some((D) => Math.abs(s[D] - H[D]) > 1), r = (s) => s.bottom < 0 || s.top > window.innerHeight;
    let c = 0;
    function G() {
      if (g.anchor) {
        const s = g.anchor.getBoundingClientRect();
        if (!g.anchor.isConnected || r(s)) return I("close");
        u(s, k.value) && (k.value = s);
      }
      c = requestAnimationFrame(G);
    }
    return Ee(() => {
      g.anchor && t.value && jt(t.value, g.anchor), F(), t.value && b.observe(t.value), !g.plain && L()[0] && L()[0].focus(), G();
    }), Se(() => {
      b.disconnect(), cancelAnimationFrame(c), cancelAnimationFrame(Z);
    }), d({ element: t }), (s, H) => (a(), N(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      x("div", Ge({
        ref_key: "panel",
        ref: t
      }, s.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: J
      }), [
        Me(s.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), zt = /* @__PURE__ */ se(Vt, [["__scopeId", "data-v-3d203970"]]);
async function Ht(e, d, f) {
  if (!e) return f(d);
  const { target: g, fields: t } = e, m = Object.fromEntries(Object.keys(t).map((k) => [k, g[k]])), V = () => Object.assign(g, m);
  Object.assign(g, t);
  let j = !1;
  try {
    const k = await f(d);
    return j = k.ok, k;
  } finally {
    j || V();
  }
}
function Ot(e, d, f) {
  const g = T([]), t = T([]), m = T({}), V = T(""), j = T(!1), k = S(() => !!e.value && !e.value.ended_at), q = S(() => k.value && !!e.value.paused_at);
  async function _() {
    if (k.value) {
      const I = await d(["agent", "controls", String(e.value.id)]);
      g.value = I.ok ? I.value.groups : [];
      return;
    }
    const $ = await d(["agent", "programs"]);
    t.value = $.ok ? $.value.rows : [];
  }
  async function R($, I = null) {
    V.value = "";
    const L = await Ht(I, $, d);
    return V.value = L.ok ? "" : L.error, f(), L;
  }
  const O = ($, I) => R(["agent", "control", String(e.value.id), $, I.value], { target: m, fields: { value: { ...m.value, [$]: I.label } } }), z = () => (j.value = !1, R(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), M = ($) => R(["agent", "launch", $.name]);
  return Ee(_), de(k, _), { groups: g, programs: t, chosen: m, failure: V, asking: j, running: k, paused: q, choose: O, stop: z, start: M };
}
const Ke = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ke).map(([e, d]) => ({ key: e, label: d }));
function Lt(e, d = "agent") {
  return Ke[e] || d;
}
const It = ["disabled", "title"], Bt = ["title"], Et = { class: "gauge usage" }, Nt = ["disabled", "title"], qt = { class: "gauge" }, Wt = ["disabled", "title"], Dt = ["disabled"], Ft = ["disabled"], Pt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Kt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Jt = ["title"], Ut = 75, Zt = {
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
  setup(e, { emit: d }) {
    const f = e, g = d, t = Ot(Ye(f, "agent"), f.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => g("changed")), m = T(null), V = T(""), j = S(() => t.groups.value.find((b) => b.key === V.value));
    function k(b, u) {
      m.value = b.currentTarget, V.value = u;
    }
    function q() {
      m.value = null, V.value = "", t.asking.value = !1;
    }
    const _ = T([]), R = S(() => _.value.filter((b) => b.state === "loaded"));
    async function O() {
      const b = f.agent && f.run ? await f.run(["agent-skill", "list", "--agent", String(f.agent.id)]) : null;
      _.value = b != null && b.ok ? b.value.rows ?? [] : [];
    }
    function z(b) {
      k(b, "skills"), O();
    }
    de(() => {
      var b;
      return (b = f.agent) == null ? void 0 : b.id;
    }, O, { immediate: !0 });
    const M = (b) => t.groups.value.some((u) => u.key === b), $ = S(() => {
      var b;
      return t.chosen.value.model ?? ((b = L.value) == null ? void 0 : b.model) ?? "";
    }), I = S(() => {
      var b;
      return t.chosen.value.effort ?? ((b = L.value) == null ? void 0 : b.effort) ?? "";
    });
    S(() => !!f.agent && !f.agent.ended_at);
    const L = S(() => {
      var b;
      return ((b = f.usage.agents) == null ? void 0 : b.find((u) => {
        var r;
        return u.id === ((r = f.agent) == null ? void 0 : r.id);
      })) ?? null;
    }), W = S(() => {
      var b;
      return ((b = f.usage.windows) == null ? void 0 : b[0]) ?? null;
    }), U = S(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), J = S(() => {
      var b;
      return ((b = L.value) == null ? void 0 : b.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), F = S(() => {
      var b;
      return (b = L.value) != null && b.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), Z = S(() => {
      var r;
      const b = (r = f.agent) != null && r.process_started_at ? new Date(f.agent.process_started_at).getTime() : 0;
      if (!b) return "";
      const u = Math.max(0, Math.floor((f.now - b) / 6e4));
      return u >= 60 ? `${Math.floor(u / 60)}h ${u % 60}m` : `${u}m`;
    });
    return (b, u) => (a(), l("div", {
      class: re(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), l(E, { key: 0 }, [
        x("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: u[0] || (u[0] = (r) => k(r, "agent"))
        }, [
          w(ee, {
            name: "agents",
            size: 12
          }),
          p(" " + i(v(Lt)(e.agent.program)), 1)
        ], 8, It),
        U.value !== null ? (a(), l("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${U.value}% of the plan's ${W.value.title} allowance used`,
          onClick: u[1] || (u[1] = (r) => g("open", "usage", r.currentTarget))
        }, [
          w(ee, {
            name: "clock",
            size: 12
          }),
          u[14] || (u[14] = p()),
          x("span", Et, [
            x("span", {
              style: je({ width: `${U.value}%` })
            }, null, 4)
          ]),
          p(" " + i(U.value) + "% ", 1)
        ], 8, Bt)) : h("", !0),
        J.value !== null ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${J.value}% full: clear or compact it`,
          onClick: u[2] || (u[2] = (r) => M("context") ? k(r, "context") : g("open", "context", r.currentTarget))
        }, [
          w(ee, {
            name: "gauge",
            size: 12
          }),
          u[15] || (u[15] = p()),
          x("span", qt, [
            x("span", {
              style: je({ width: `${J.value}%` })
            }, null, 4)
          ]),
          p(" " + i(J.value) + "% ", 1)
        ], 8, Nt)) : h("", !0),
        $.value ? (a(), l("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${$.value}: change the model`,
          onClick: u[3] || (u[3] = (r) => M("model") ? k(r, "model") : null)
        }, [
          w(ee, {
            name: "model",
            size: 12
          }),
          p(" " + i($.value), 1)
        ], 8, Wt)) : h("", !0),
        M("effort") || e.card && I.value ? (a(), l("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: u[4] || (u[4] = (r) => k(r, "effort"))
        }, [
          w(ee, {
            name: "bolt",
            size: 12
          }),
          p(" " + i(I.value), 1)
        ], 8, Dt)) : h("", !0),
        F.value ? (a(), l("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: u[5] || (u[5] = (r) => g("open", "cost", r.currentTarget))
        }, i(F.value), 9, Ft)) : h("", !0),
        Z.value ? (a(), l("span", Pt, [
          w(ee, {
            name: "reminders",
            size: 12
          }),
          p(" " + i(Z.value), 1)
        ])) : h("", !0),
        e.branch ? (a(), l("span", Kt, [
          w(ee, {
            name: "branch",
            size: 12
          }),
          p(" " + i(e.branch), 1)
        ])) : h("", !0),
        e.card ? h("", !0) : (a(), l("button", {
          key: 7,
          type: "button",
          class: re(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: u[6] || (u[6] = (r) => g("open", "jobs", r.currentTarget))
        }, [
          w(ee, {
            name: "clock",
            size: 12
          }),
          p(" " + i(e.jobs), 1)
        ], 2)),
        e.run ? (a(), l("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: z
        }, [
          w(ee, {
            name: "book",
            size: 12
          }),
          p(" " + i(R.value.length), 1)
        ])) : h("", !0),
        e.fitness ? (a(), l(E, { key: 9 }, [
          x("button", {
            type: "button",
            class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ut }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: u[7] || (u[7] = (r) => g("open", "fitness", r.currentTarget))
          }, [
            w(ee, {
              name: "heart",
              size: 12
            }),
            p(" " + i(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          x("button", {
            type: "button",
            class: re(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: u[8] || (u[8] = (r) => g("open", "load", r.currentTarget))
          }, [
            w(ee, {
              name: "weight",
              size: 12
            }),
            p(" " + i(e.fitness.workload), 1)
          ], 2)
        ], 64)) : h("", !0)
      ], 64)) : e.run && !e.loading ? (a(), l("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: u[9] || (u[9] = (r) => k(r, "start"))
      }, [
        w(ee, {
          name: "agents",
          size: 12
        }),
        u[16] || (u[16] = p(" Start an agent", -1))
      ])) : h("", !0),
      u[22] || (u[22] = x("span", { class: "space" }, null, -1)),
      v(t).failure.value ? (a(), l("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: v(t).failure.value
      }, i(v(t).failure.value), 9, Jt)) : h("", !0),
      Me(b.$slots, "default", {}, void 0, !0),
      m.value ? (a(), N(zt, {
        key: 3,
        anchor: m.value,
        "min-width": 190,
        onClose: q
      }, {
        default: A(() => [
          V.value === "agent" ? (a(), l(E, { key: 0 }, [
            v(t).asking.value ? (a(), l(E, { key: 0 }, [
              w(we, { "data-agent-stop-ask": "" }, {
                default: A(() => [...u[17] || (u[17] = [
                  p("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              w(ye, {
                "data-agent-stop-confirm": "",
                onClick: u[10] || (u[10] = (r) => (q(), v(t).stop()))
              }, {
                default: A(() => [...u[18] || (u[18] = [
                  p("Stop it", -1)
                ])]),
                _: 1
              }),
              w(ye, {
                onClick: u[11] || (u[11] = (r) => v(t).asking.value = !1)
              }, {
                default: A(() => [...u[19] || (u[19] = [
                  p("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), N(ye, {
              key: 1,
              "data-agent-stop": "",
              onClick: u[12] || (u[12] = (r) => v(t).asking.value = !0)
            }, {
              default: A(() => [...u[20] || (u[20] = [
                p("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : V.value === "start" ? (a(), l(E, { key: 1 }, [
            w(we, null, {
              default: A(() => [...u[21] || (u[21] = [
                p("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), l(E, null, ae(v(t).programs.value, (r) => (a(), N(ye, {
              key: r.name,
              "data-agent-program": r.name,
              onClick: (c) => (q(), v(t).start(r))
            }, {
              default: A(() => [
                p(i(r.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : V.value === "skills" ? (a(), N(_t, {
            key: 2,
            skills: _.value,
            onBrowse: u[13] || (u[13] = (r) => (q(), g("open", "skills", null)))
          }, null, 8, ["skills"])) : j.value ? (a(), l(E, { key: 3 }, [
            w(we, null, {
              default: A(() => [
                p(i(j.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), l(E, null, ae(j.value.choices, (r) => (a(), N(ye, {
              key: r.value,
              "data-agent-choice": r.value,
              onClick: (c) => (v(t).choose(j.value.key, r), q())
            }, {
              default: A(() => [
                p(i(r.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : h("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : h("", !0)
    ], 2));
  }
}, Gt = /* @__PURE__ */ se(Zt, [["__scopeId", "data-v-a3401630"]]), Yt = {
  class: "agent-command",
  "data-agent-command": ""
}, Qt = {
  key: 1,
  "data-agent-stopped": ""
}, Xt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (d, f) => (a(), l("span", Yt, [
      e.waitReason ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: f[0] || (f[0] = le((g) => v(Ce)("test_queue:0"), ["stop"]))
      }, [
        p("Waiting: " + i(e.waitReason) + " ", 1),
        w(v(Te), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Qt, "Waiting")) : (a(), N(v(nt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ie = /* @__PURE__ */ se(Xt, [["__scopeId", "data-v-1b371fb5"]]), ea = ["data-agent-delegated", "onClick"], ta = { class: "agent-task-number" }, aa = { class: "agent-task-title" }, na = ["title"], la = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const f = d;
    return (g, t) => (a(), N(v(Ne), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (m) => f("toggle"))
    }, {
      default: A(() => [
        (a(!0), l(E, null, ae(e.section.tasks, (m) => (a(), l("button", {
          key: m.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": m.id,
          onClick: (V) => v(Ce)(`tasks:${m.id}`)
        }, [
          w(v(lt), {
            status: m.state
          }, null, 8, ["status"]),
          x("span", ta, i(m.id), 1),
          x("span", aa, i(m.title), 1),
          m.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${m.plan_id}: ${m.plan_title}`
          }, "Plan " + i(m.plan_id) + ": " + i(m.plan_title), 9, na)) : h("", !0)
        ], 8, ea))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, oa = /* @__PURE__ */ se(la, [["__scopeId", "data-v-238ff959"]]), sa = { class: "action-buttons" }, ia = { class: "action-field" }, ra = ["disabled"], ua = ["value"], da = { key: 1 }, ca = {
  key: 1,
  class: "action-field"
}, va = { class: "action-buttons" }, ga = { class: "action-field" }, pa = { class: "action-buttons" }, ha = { class: "action-buttons" }, fa = {
  key: 0,
  role: "alert"
}, ma = {
  key: 1,
  role: "status"
}, ka = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const d = e, f = _e(), g = T(""), t = T(""), m = T(""), V = T(""), j = T([]), k = T(0), q = T(!1), _ = T(!1), R = T(!1), O = T(""), z = T(""), M = S(() => !!d.row.retired_at || d.row.state === "retired"), $ = S(() => !M.value && !!d.row.ended_at), I = S(() => {
      var r;
      return $.value && ((r = d.row.job_command) == null ? void 0 : r.length) && !d.row.resume_reason;
    }), L = S(() => I.value && !_.value && (d.row.job_task_flag ? j.value.some((r) => String(r.id) === V.value) : !!t.value.trim()));
    function W(r) {
      g.value = r, t.value = "", m.value = "", V.value = "", O.value = "", z.value = "";
    }
    async function U() {
      W("job"), d.row.job_task_flag && (j.value = [], k.value = 0, q.value = !1, await J());
    }
    async function J() {
      if (!_.value) {
        _.value = !0;
        try {
          const r = await f.read(`task list --state open --limit 100 --page ${k.value + 1}`);
          O.value = r.ok ? "" : r.error, r.ok && (j.value = [...j.value, ...r.value.rows], k.value = r.value.page, q.value = r.value.page * r.value.size < r.value.total);
        } finally {
          _.value = !1;
        }
      }
    }
    async function F(r, c) {
      if (!R.value) {
        R.value = !0, O.value = "";
        try {
          const G = await f.run(r);
          O.value = G.ok ? "" : G.error, G.ok && (W(""), z.value = c);
        } finally {
          R.value = !1;
        }
      }
    }
    async function Z() {
      if (!L.value) return;
      const r = d.row.job_task_flag ? [d.row.job_task_flag, V.value] : [t.value.trim()];
      await F([...d.row.job_command, String(d.row.id), ...r], "Job sent.");
    }
    async function b() {
      M.value || $.value || !t.value.trim() || await F(["message", "send", t.value.trim(), "--target-agent", String(d.row.id)], "Message sent.");
    }
    async function u() {
      !$.value || g.value !== "retire" || !m.value.trim() || await F(["agent", "retire", String(d.row.id), "--reason", m.value.trim()], "Agent retired permanently.");
    }
    return (r, c) => {
      var G;
      return M.value ? h("", !0) : (a(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: c[9] || (c[9] = le(() => {
        }, ["stop"])),
        onKeydown: c[10] || (c[10] = le(() => {
        }, ["stop"]))
      }, [
        x("div", sa, [
          $.value ? (a(), l(E, { key: 0 }, [
            (G = e.row.job_command) != null && G.length ? (a(), N(v(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: R.value || _.value || !I.value,
              onClick: U
            }, {
              default: A(() => [...c[11] || (c[11] = [
                p("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(v(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: R.value || _.value,
              onClick: c[0] || (c[0] = (s) => W("retire"))
            }, {
              default: A(() => [...c[12] || (c[12] = [
                p("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : (a(), N(v(te), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: R.value,
            onClick: c[1] || (c[1] = (s) => W("message"))
          }, {
            default: A(() => [...c[13] || (c[13] = [
              p("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        w(v(qe), { value: g.value }, {
          job: A(() => [
            x("form", {
              onSubmit: le(Z, ["prevent"])
            }, [
              e.row.job_task_flag ? (a(), l(E, { key: 0 }, [
                x("label", ia, [
                  c[15] || (c[15] = p("Task ", -1)),
                  Qe(x("select", {
                    "onUpdate:modelValue": c[2] || (c[2] = (s) => V.value = s),
                    disabled: R.value || _.value,
                    "data-agent-job-task": ""
                  }, [
                    c[14] || (c[14] = x("option", { value: "" }, "Choose an open task", -1)),
                    (a(!0), l(E, null, ae(j.value, (s) => (a(), l("option", {
                      key: s.id,
                      value: String(s.id)
                    }, i(s.id) + ": " + i(s.title), 9, ua))), 128))
                  ], 8, ra), [
                    [Xe, V.value]
                  ])
                ]),
                q.value ? (a(), N(v(te), {
                  key: 0,
                  small: "",
                  disabled: R.value || _.value,
                  "data-agent-more-tasks": "",
                  onClick: J
                }, {
                  default: A(() => [...c[16] || (c[16] = [
                    p("More tasks", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : h("", !0),
                !_.value && !j.value.length && !O.value ? (a(), l("p", da, "No open tasks.")) : h("", !0)
              ], 64)) : (a(), l("label", ca, [
                c[17] || (c[17] = p("Job", -1)),
                w(v(He), {
                  value: t.value,
                  disabled: R.value,
                  "data-agent-job-text": "",
                  onInput: c[3] || (c[3] = (s) => t.value = s.target.value)
                }, null, 8, ["value", "disabled"])
              ])),
              x("div", va, [
                w(v(te), {
                  type: "submit",
                  small: "",
                  disabled: R.value || !L.value,
                  "data-agent-submit-job": ""
                }, {
                  default: A(() => [...c[18] || (c[18] = [
                    p("Send the job", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                w(v(te), {
                  small: "",
                  disabled: R.value,
                  onClick: c[4] || (c[4] = (s) => W(""))
                }, {
                  default: A(() => [...c[19] || (c[19] = [
                    p("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          message: A(() => [
            x("form", {
              onSubmit: le(b, ["prevent"])
            }, [
              x("label", ga, [
                c[20] || (c[20] = p("Message", -1)),
                w(v(He), {
                  value: t.value,
                  disabled: R.value,
                  "data-agent-message-text": "",
                  onInput: c[5] || (c[5] = (s) => t.value = s.target.value)
                }, null, 8, ["value", "disabled"])
              ]),
              x("div", pa, [
                w(v(te), {
                  type: "submit",
                  small: "",
                  disabled: R.value || !t.value.trim(),
                  "data-agent-submit-message": ""
                }, {
                  default: A(() => [...c[21] || (c[21] = [
                    p("Send the message", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                w(v(te), {
                  small: "",
                  disabled: R.value,
                  onClick: c[6] || (c[6] = (s) => W(""))
                }, {
                  default: A(() => [...c[22] || (c[22] = [
                    p("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          retire: A(() => [
            x("form", {
              "data-agent-retire-confirm": "",
              onSubmit: le(u, ["prevent"])
            }, [
              c[25] || (c[25] = x("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
              w(v(Re), {
                modelValue: m.value,
                "onUpdate:modelValue": c[7] || (c[7] = (s) => m.value = s),
                label: "Reason",
                disabled: R.value,
                "data-agent-retire-reason": ""
              }, null, 8, ["modelValue", "disabled"]),
              x("div", ha, [
                w(v(te), {
                  type: "submit",
                  small: "",
                  disabled: R.value || !m.value.trim(),
                  "data-agent-confirm-retire": ""
                }, {
                  default: A(() => [...c[23] || (c[23] = [
                    p("Retire permanently", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                w(v(te), {
                  small: "",
                  disabled: R.value,
                  onClick: c[8] || (c[8] = (s) => W(""))
                }, {
                  default: A(() => [...c[24] || (c[24] = [
                    p("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          _: 1
        }, 8, ["value"]),
        O.value ? (a(), l("p", fa, i(O.value), 1)) : h("", !0),
        z.value ? (a(), l("p", ma, i(z.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, ya = /* @__PURE__ */ se(ka, [["__scopeId", "data-v-05d593dd"]]), ba = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], wa = { class: "agent-head" }, Ma = ["data-state"], xa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, $a = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ca = { class: "agent-times" }, Sa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Aa = { class: "agent-line" }, ja = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ta = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ra = {
  key: 0,
  class: "agent-line agent-work-start"
}, Va = ["data-peek"], za = ["title"], Ha = ["data-peek"], Oa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, La = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, Ia = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ba = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ea = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Na = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, qa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Wa = {
  key: 0,
  class: "agent-helper-brief"
}, Da = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Fa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Pa = "It ended without a report", Ka = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const f = { helper: "Helper", reviewer: "Reviewer" }, g = ["started", "blocked", "open", "completed"], t = e, m = d, V = ot(), j = S(() => {
      var n, C;
      if ((n = t.facts) != null && n.profile_title) return t.facts.profile_title;
      if ((C = t.facts) != null && C.profile) return t.facts.profile;
      const o = f[t.row.role] || t.row.role;
      return o.slice(0, 1).toUpperCase() + o.slice(1);
    }), k = S(() => {
      var o;
      return ((o = t.facts) == null ? void 0 : o.tasks) ?? [];
    }), q = S(() => k.value.filter((o) => o.state === "open")), _ = S(() => {
      const o = k.value.find((n) => {
        var C;
        return n.id === ((C = t.facts) == null ? void 0 : C.task_id);
      });
      return o != null && o.plan_id ? o : q.value.find((n) => n.plan_id);
    }), R = S(() => {
      var o, n, C, y, B;
      return t.row.role === "helper" ? ((o = t.facts) == null ? void 0 : o.helper_job) || "" : (n = t.facts) != null && n.job_enabled && (((C = t.facts) == null ? void 0 : C.task_title) || ((y = q.value[0]) == null ? void 0 : y.title) || ((B = k.value.at(-1)) == null ? void 0 : B.title)) || "";
    }), O = S(() => {
      var o;
      return ((o = t.facts) == null ? void 0 : o.job_returned) || t.row.job_returned || "";
    }), z = S(() => {
      const o = R.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return o ? `${o[1].toLowerCase() === "plan" ? "plans" : "docs"}:${o[2]}` : "";
    }), M = S(() => {
      var o, n;
      return [t.row.program, (o = t.facts) == null ? void 0 : o.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), $ = S(() => {
      var o, n;
      return t.row.ended_at && ((n = (o = t.facts) == null ? void 0 : o.job_returned) != null && n.startsWith(Pa)) ? t.facts.job_returned : "";
    }), I = S(() => st(t.row.process_started_at || t.row.created_at, V.value)), L = /* @__PURE__ */ new Set(["open", "started", "testing"]), W = S(() => !!t.row.ended_at && t.row.role !== "main" && k.value.some((o) => L.has(o.state))), U = S(() => {
      var o;
      return t.waitReason || W.value ? "waiting" : t.row.state === "running" && ((o = t.facts) == null ? void 0 : o.state) || t.row.state;
    }), J = S(() => {
      var o;
      return ((o = t.progress) == null ? void 0 : o.completed_count) ?? k.value.filter((n) => n.state === "completed").length;
    }), F = S(() => {
      var o;
      return ((o = t.progress) == null ? void 0 : o.task_count) ?? k.value.length;
    }), Z = S(() => `${J.value} of ${F.value} ${F.value === 1 ? "task" : "tasks"}`), b = S(() => {
      var n;
      const o = it(J.value, ((n = t.progress) == null ? void 0 : n.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, V.value);
      return t.row.role !== "main" && o ? `${o} per hour` : "";
    }), u = S(() => k.value.length ? g.map((o) => ({ state: o, label: o.slice(0, 1).toUpperCase() + o.slice(1), tasks: k.value.filter((n) => n.state === o || o === "started" && n.state === "testing" || o === "completed" && n.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), c = T({}), G = (o) => !(c.value[o] ?? r.has(o)), s = (o) => c.value = { ...c.value, [o]: G(o) }, H = _e(), D = S(() => t.row.access === "read-only"), Y = S(() => !!t.row.retired_at || t.row.state === "retired"), Q = S(() => Y.value ? H.tabs.filter((o) => o.key === "transcript") : D.value ? H.tabs.filter((o) => ["transcript", "terminal"].includes(o.key)) : H.tabs), X = T(Q.value[0]);
    de(Q, (o) => {
      o.some((n) => {
        var C;
        return n.key === ((C = X.value) == null ? void 0 : C.key);
      }) || (X.value = o[0]);
    }), de(() => t.open, (o) => {
      o && (X.value = Q.value[0]);
    });
    const oe = Object.fromEntries(H.tabs.filter((o) => o.component).map((o) => [o.key, et(() => rt(o.component))])), ge = S(() => t.row.role === "helper" && !t.row.ended_at), pe = () => H.run(["helper", "stop", String(t.row.id)]), ue = T(!1), ie = T(""), he = T(""), fe = S(() => t.row.role !== "main" && (!t.row.ended_at || W.value || t.waitReason));
    async function me() {
      if (!fe.value) return;
      const o = await H.read(`usage tool --agent ${t.row.id}`, { deferred: !0 });
      ie.value = o.ok ? o.value.tool : "", he.value = o.ok ? o.value.note : "";
    }
    const be = H.follow(["hook_call.*", "process_part.*"], We(me, De.agentCommand));
    return Se(() => be == null ? void 0 : be()), me(), (o, n) => {
      var C, y, B, ce;
      return a(), l("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: n[6] || (n[6] = (P) => !e.open && m("toggle")),
        onKeydown: [
          n[7] || (n[7] = Ve(le((P) => !e.open && m("toggle"), ["self", "prevent"]), ["enter"])),
          n[8] || (n[8] = Ve(le((P) => !e.open && m("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        x("span", wa, [
          e.open ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = le((P) => m("toggle"), ["stop"]))
          }, [
            w(v(Te), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          x("span", {
            class: "agent-dot",
            "data-state": U.value,
            "data-agent-motion": ""
          }, null, 8, Ma),
          x("span", xa, i(j.value), 1),
          x("span", $a, i(((C = e.facts) == null ? void 0 : C.given_name) || e.row.id), 1),
          e.open ? h("", !0) : (a(), N(v(Te), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          x("span", Ca, [
            e.row.ended_at && !W.value ? (a(), N(v(Oe), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), l("span", Sa, i(I.value), 1)),
            (y = e.facts) != null && y.last_activity ? (a(), l("span", _a, [
              n[9] || (n[9] = p("Last heard: ", -1)),
              w(v(Oe), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : h("", !0)
          ])
        ]),
        x("span", Aa, [
          x("span", ja, i(M.value), 1),
          F.value && !R.value ? (a(), l("span", Ta, i(Z.value), 1)) : h("", !0)
        ]),
        _.value ? (a(), l("span", Ra, [
          x("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${_.value.plan_id}`,
            onClick: n[1] || (n[1] = le((P) => v(Ce)(`plans:${_.value.plan_id}`), ["stop"]))
          }, "Plan " + i(_.value.plan_id) + ": " + i(_.value.plan_title), 9, Va)
        ])) : h("", !0),
        R.value ? (a(), l("span", {
          key: 1,
          class: re(["agent-line", { "agent-work-start": !_.value }])
        }, [
          x("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, [
            z.value ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": z.value,
              onClick: n[2] || (n[2] = le((P) => v(Ce)(z.value), ["stop"]))
            }, i(R.value), 9, Ha)) : (a(), l(E, { key: 1 }, [
              p(i(R.value), 1)
            ], 64))
          ], 8, za),
          F.value ? (a(), l("span", Oa, i(Z.value), 1)) : h("", !0)
        ], 2)) : h("", !0),
        O.value ? (a(), l("p", La, [
          n[10] || (n[10] = x("span", null, "Last report: ", -1)),
          p(i(O.value), 1)
        ])) : h("", !0),
        e.row.retirement_reason ? (a(), l("p", Ia, "Retirement reason: " + i(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (a(), l("p", Ba, i(e.row.resume_reason), 1)) : h("", !0),
        w(ya, { row: e.row }, null, 8, ["row"]),
        !e.open && (fe.value || F.value && b.value) ? (a(), l("span", {
          key: 5,
          class: re(["agent-foot", { "agent-work-start": !R.value && !_.value }]),
          "data-agent-foot": ""
        }, [
          fe.value ? (a(), N(Ie, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: W.value,
            command: ie.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
          F.value && b.value ? (a(), l("span", Ea, i(b.value), 1)) : h("", !0)
        ], 2)) : h("", !0),
        e.open ? (a(), l("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[5] || (n[5] = le(() => {
          }, ["stop"]))
        }, [
          w(Gt, {
            agent: e.row,
            branch: (B = e.progress) == null ? void 0 : B.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: A(() => [
              ge.value ? (a(), N(v(te), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: pe
              }, {
                default: A(() => [...n[11] || (n[11] = [
                  p("Stop", -1)
                ])]),
                _: 1
              })) : h("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          fe.value ? (a(), N(Ie, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: W.value,
            command: ie.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
          $.value ? (a(), l("p", Na, i($.value), 1)) : h("", !0),
          w(v(ut), {
            class: "agent-tabs",
            tabs: Q.value,
            active: X.value,
            answer: { tasks: k.value.length },
            onChoose: n[3] || (n[3] = (P) => X.value = P)
          }, null, 8, ["tabs", "active", "answer"]),
          w(v(dt), {
            class: "agent-tab-body",
            tab: X.value,
            "data-agent-tab-body": (ce = X.value) == null ? void 0 : ce.key
          }, {
            default: A(() => {
              var P;
              return [
                w(v(qe), {
                  value: (P = X.value) == null ? void 0 : P.key
                }, tt({
                  tasks: A(() => {
                    var K;
                    return [
                      k.value.length ? h("", !0) : (a(), N(v(Fe), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: A(() => [...n[12] || (n[12] = [
                          p("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), l(E, null, ae(u.value, (ne) => (a(), N(oa, {
                        key: ne.state,
                        section: ne,
                        open: G(ne.state),
                        onToggle: (ve) => s(ne.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (K = e.facts) != null && K.instruction ? (a(), l(E, { key: 1 }, [
                        n[13] || (n[13] = x("p", { class: "agent-label" }, "Instruction", -1)),
                        x("div", qa, i(e.facts.instruction), 1)
                      ], 64)) : h("", !0)
                    ];
                  }),
                  transcript: A(() => {
                    var K;
                    return [
                      D.value ? (a(), l(E, { key: 0 }, [
                        (K = e.facts) != null && K.instruction ? (a(), l("div", Wa, [
                          w(v(Ne), {
                            label: "Instruction",
                            open: ue.value,
                            "data-agent-section": "instruction",
                            onToggle: n[4] || (n[4] = (ne) => ue.value = !ue.value)
                          }, {
                            default: A(() => [
                              x("div", Da, i(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), l("p", Fa, "No job recorded")) : h("", !0)
                      ], 64)) : h("", !0),
                      w(ft, {
                        line: `agent transcript ${e.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ];
                  }),
                  _: 2
                }, [
                  ae(v(oe), (K, ne) => ({
                    name: ne,
                    fn: A(() => [
                      (a(), N(at(K), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : h("", !0)
      ], 42, ba);
    };
  }
}, Ja = /* @__PURE__ */ se(Ka, [["__scopeId", "data-v-4312b32d"]]), Ua = {
  class: "agent-limits",
  "data-agent-limits": ""
}, Za = { class: "limits-head" }, Ga = ["data-agent-limit-type"], Ya = { class: "limits-counts" }, Qa = { key: 0 }, Xa = { key: 1 }, en = { key: 0 }, tn = ["data-agent-limit-profile"], an = { class: "limit-fields" }, nn = { class: "limit-field" }, ln = { class: "limit-field" }, on = {
  key: 1,
  role: "alert"
}, sn = {
  key: 2,
  role: "status"
}, rn = {
  __name: "AgentLimits",
  setup(e) {
    const d = _e(), f = T([]), g = T({}), t = T(!1), m = T(!1), V = T(""), j = T(""), k = (O) => O === 0 ? "no limit" : String(O);
    let q = 0;
    async function _() {
      const O = ++q, z = await d.read("agent limits");
      if (O !== q || (f.value = z.ok ? z.value.rows : [], V.value = z.ok ? "" : z.error, !z.ok)) return;
      const M = await Promise.all(f.value.flatMap(($) => [$.run_setting, $.kept_setting]).map(async ($) => {
        const I = await d.read(`setting show ${$}`);
        return [$, I.ok ? I.value.source : ""];
      }));
      O === q && (g.value = Object.fromEntries(M));
    }
    async function R(O, z, M, $) {
      if (m.value || d.readOnly) return;
      const I = Number($.target.value);
      if (!Number.isInteger(I) || I < 0 || !$.target.value.trim()) {
        V.value = "Use a whole number of 0 or more.", $.target.value = String(M);
        return;
      }
      m.value = !0, j.value = "";
      try {
        const L = await d.run(["setting", "set", z, String(I), "--environment", d.environment]);
        if (V.value = L.ok ? "" : L.error, !L.ok) {
          $.target.value = String(M);
          return;
        }
        await _(), j.value = `${O.label} limits saved.`;
      } finally {
        m.value = !1;
      }
    }
    return d.follow(["agent.*", "setting.*"], _), _(), (O, z) => (a(), l("section", Ua, [
      f.value.length ? (a(), l(E, { key: 0 }, [
        x("div", Za, [
          z[1] || (z[1] = x("strong", null, "Agent limits", -1)),
          w(v(te), {
            small: "",
            disabled: m.value || v(d).readOnly,
            "data-agent-limits-edit": "",
            onClick: z[0] || (z[0] = (M) => t.value = !t.value)
          }, {
            default: A(() => [
              p(i(t.value ? "Done" : "Edit limits"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        (a(!0), l(E, null, ae(f.value, (M) => (a(), l("div", {
          key: M.key,
          class: "type-limits",
          "data-agent-limit-type": M.key
        }, [
          x("div", Ya, [
            x("strong", null, i(M.label), 1),
            M.per_profile ? (a(), l("span", Qa, "Running: " + i(M.running) + " · Kept: " + i(M.kept), 1)) : (a(), l("span", Xa, "Running: " + i(M.running) + " of " + i(M.run_limit) + " · Kept: " + i(M.kept) + " of " + i(k(M.kept_limit)), 1))
          ]),
          M.per_profile ? (a(), l("p", en, "Limits per profile: running " + i(M.run_limit) + ", kept " + i(k(M.kept_limit)) + ".", 1)) : h("", !0),
          (a(!0), l(E, null, ae(M.profiles, ($) => (a(), l("p", {
            key: $.profile,
            class: "profile-limits",
            "data-agent-limit-profile": $.profile
          }, i($.title) + ": running " + i($.running) + " of " + i($.run_limit) + " · kept " + i($.kept) + " of " + i(k($.kept_limit)), 9, tn))), 128)),
          t.value ? (a(), l(E, { key: 1 }, [
            x("div", an, [
              x("label", nn, [
                x("span", null, [
                  z[2] || (z[2] = p("Running", -1)),
                  M.per_profile ? (a(), l(E, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : h("", !0)
                ]),
                w(v(Re), {
                  type: "number",
                  min: "0",
                  value: String(M.run_limit),
                  disabled: m.value || v(d).readOnly,
                  "data-agent-run-limit": M.key,
                  onChange: ($) => R(M, M.run_setting, M.run_limit, $)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                x("small", null, i(g.value[M.run_setting]), 1)
              ]),
              x("label", ln, [
                x("span", null, [
                  z[3] || (z[3] = p("Kept", -1)),
                  M.per_profile ? (a(), l(E, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : h("", !0)
                ]),
                w(v(Re), {
                  type: "number",
                  min: "0",
                  value: String(M.kept_limit),
                  disabled: m.value || v(d).readOnly,
                  "data-agent-kept-limit": M.key,
                  onChange: ($) => R(M, M.kept_setting, M.kept_limit, $)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                x("small", null, i(g.value[M.kept_setting]), 1)
              ])
            ]),
            x("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + i(v(d).environment) + ".", 1)
          ], 64)) : h("", !0)
        ], 8, Ga))), 128))
      ], 64)) : h("", !0),
      V.value ? (a(), l("p", on, i(V.value), 1)) : h("", !0),
      j.value ? (a(), l("p", sn, i(j.value), 1)) : h("", !0)
    ]));
  }
}, un = /* @__PURE__ */ se(rn, [["__scopeId", "data-v-92094f1b"]]), dn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, cn = ["data-agent-row"], Be = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", vn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const d = e, { rows: f } = ct("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: g } = Le("waits"), { rows: t } = Le("progress"), m = (n) => t.value.find((C) => C.agent_id === n.id) ?? null, V = (n) => {
      var C;
      return ((C = g.value.find((y) => y.agent_id === n.id)) == null ? void 0 : C.reason) ?? "";
    }, j = T("running"), k = T(""), q = JSON.parse(localStorage.getItem(Be) || '{"roles":[],"profiles":[],"programs":[]}'), _ = T(q), R = T({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), O = T([]), z = S(() => _.value.roles.length + _.value.profiles.length + _.value.programs.length), M = (n, C) => {
      _.value = ht(_.value, n, C);
    }, $ = () => {
      _.value = { roles: [], profiles: [], programs: [] };
    }, I = (n) => n.slice(0, 1).toUpperCase() + n.slice(1);
    de(_, (n) => localStorage.setItem(Be, JSON.stringify(n)));
    const L = _e();
    async function W() {
      const [n, C] = await Promise.all([L.read("agent cards --options"), L.read("agent programs")]);
      n.ok && (R.value = n.value), C.ok && (O.value = C.value.rows);
    }
    L.follow(["agent.*"], W), W();
    const U = T([]), J = T(""), F = T(!1), Z = T(!1), b = T(25);
    let u = 0;
    async function r() {
      const n = ++u, C = [
        ..._.value.roles.map((B) => `--role ${JSON.stringify(B)}`),
        ..._.value.profiles.map((B) => `--profile ${JSON.stringify(B)}`),
        ..._.value.programs.map((B) => `--program ${JSON.stringify(B)}`)
      ].join(" "), y = await L.read(`${d.line} --show ${j.value} --search ${JSON.stringify(k.value)} --limit ${b.value} ${C}`);
      n === u && (U.value = y.ok ? y.value.rows : [], J.value = y.ok ? "" : y.error, Z.value = y.ok && y.value.page * y.value.size < y.value.total, F.value = !0);
    }
    async function c() {
      return b.value += 25, await r(), !0;
    }
    de([j, k, _], () => {
      b.value = 25, r();
    }), L.follow(["agent.*", "task.*", ...L.sources.flatMap((n) => n.events)], We(r, De.pageOfAgents)), r();
    const G = (n) => f.value.find((C) => C.id === n.id) ?? n.facts ?? null, s = U, H = S(() => !!k.value.trim() || z.value > 0), D = S(() => d.texts[j.value] ?? { title: d.empty, hint: "" }), Y = T(null), Q = T(null), X = T(null), oe = S(() => s.value.find((n) => n.id === Y.value) ?? null), ge = S(() => oe.value ? [oe.value] : s.value), pe = S(() => s.value.length - ge.value.length), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ie = !1, he = 0;
    async function fe(n) {
      if (ie) return;
      ie = !0, he = X.value.scrollTop;
      const C = Q.value.querySelector(`[data-agent-open="${n.id}"]`);
      if (!ue()) {
        const P = [...Q.value.querySelectorAll(".agent-row")].filter((K) => !K.contains(C));
        await Promise.all(P.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const y = [...C.querySelectorAll(".agent-head, .agent-line")], B = [...y, ...C.querySelectorAll("[data-agent-motion]")], ce = B.map((P) => P.getBoundingClientRect());
      if (Y.value = n.id, await ze(), !ue()) {
        const P = B.map((K) => K.getBoundingClientRect());
        B.forEach((K, ne) => {
          const ve = y.indexOf(K.parentElement), Je = ce[ne].left - P[ne].left - (ve < 0 ? 0 : ce[ve].left - P[ve].left), Ue = ce[ne].top - P[ne].top - (ve < 0 ? 0 : ce[ve].top - P[ve].top);
          K.animate([{ transform: `translate(${Je}px, ${Ue}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((K) => {
          K.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      ie = !1;
    }
    async function me() {
      if (ie || !oe.value) return;
      ie = !0;
      const n = Q.value.querySelector(`[data-agent-open="${Y.value}"]`), C = [...n.children, ...Q.value.querySelectorAll(".agents-held")], y = ue() ? [] : C.map((B) => B.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(y.map((B) => B.finished)), Y.value = null, await ze(), X.value.scrollTop = he, y.forEach((B) => B.cancel()), ue() || (n.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), Q.value.querySelectorAll(".agent-row").forEach((B) => {
        B.contains(n) || B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), ie = !1;
    }
    const be = (n) => Y.value === n.id ? me() : fe(n);
    de(k, (n) => n.trim() && (Y.value = null)), de(j, () => {
      Y.value = null;
    });
    const o = (n) => {
      n.key === "Escape" && me();
    };
    return window.addEventListener("keydown", o), Se(() => window.removeEventListener("keydown", o)), (n, C) => (a(), l("div", {
      ref_key: "agents",
      ref: Q,
      class: re(["agents", { focused: oe.value }])
    }, [
      w(un),
      w(v(vt), {
        modelValue: k.value,
        "onUpdate:modelValue": C[1] || (C[1] = (y) => k.value = y),
        placeholder: "Search agents",
        "menu-count": z.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          w(v(Ae), null, {
            default: A(() => [...C[2] || (C[2] = [
              p("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(E, null, ae(R.value.roles, (y) => (a(), N(v(xe), {
            key: y,
            role: "menuitemcheckbox",
            "aria-checked": _.value.roles.includes(y),
            checked: _.value.roles.includes(y),
            "data-filter-role": y,
            onClick: (B) => M("roles", y)
          }, {
            default: A(() => [
              p(i(I(y)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (a(), N(v(Ae), { key: 0 }, {
            default: A(() => [...C[3] || (C[3] = [
              p("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), l(E, null, ae(R.value.profiles, (y) => (a(), N(v(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": _.value.profiles.includes(y.name),
            checked: _.value.profiles.includes(y.name),
            "data-filter-profile": y.name,
            onClick: (B) => M("profiles", y.name)
          }, {
            default: A(() => [
              p(i(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          w(v(Ae), null, {
            default: A(() => [...C[4] || (C[4] = [
              p("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(E, null, ae(O.value, (y) => (a(), N(v(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": _.value.programs.includes(y.name),
            checked: _.value.programs.includes(y.name),
            "data-filter-program": y.name,
            onClick: (B) => M("programs", y.name)
          }, {
            default: A(() => [
              p(i(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          z.value ? (a(), N(v(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: $
          }, {
            default: A(() => [...C[5] || (C[5] = [
              p("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: A(() => [
          w(v(gt), {
            options: R.value.states,
            value: j.value,
            onPick: C[0] || (C[0] = (y) => j.value = y)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      j.value === "retired" && R.value.upgrade_retired ? (a(), l("p", dn, "Retired during the upgrade: " + i(R.value.upgrade_retired), 1)) : h("", !0),
      x("div", {
        ref_key: "list",
        ref: X,
        class: re(["agents-view", { "agents-view-open": oe.value }])
      }, [
        F.value && !J.value && !ge.value.length && z.value ? (a(), N(v(Fe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            w(v(te), {
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
        })) : (a(), N(v(pt), {
          key: 1,
          rows: ge.value,
          failure: J.value,
          loaded: F.value,
          more: !oe.value && Z.value,
          older: c,
          empty: D.value.title,
          hint: D.value.hint,
          searching: H.value
        }, {
          default: A(({ row: y }) => [
            x("div", {
              class: "agent-row",
              "data-agent-row": y.id
            }, [
              w(Ja, {
                row: y,
                facts: G(y),
                progress: m(y),
                "wait-reason": V(y),
                open: y.id === Y.value,
                onToggle: (B) => be(y)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, cn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      oe.value && pe.value ? (a(), l("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: me
      }, i(pe.value) + " more", 1)) : h("", !0)
    ], 2));
  }
}, fn = /* @__PURE__ */ se(vn, [["__scopeId", "data-v-980c141c"]]);
export {
  fn as A
};
