/* @code-commandments-generated */
import { openBlock as a, createElementBlock as o, normalizeStyle as je, normalizeClass as re, toDisplayString as y, createCommentVNode as k, createElementVNode as j, renderSlot as Me, computed as M, createVNode as x, withCtx as $, createTextVNode as g, Fragment as E, renderList as oe, onUnmounted as Se, ref as A, onMounted as Ee, createBlock as H, Teleport as Ke, mergeProps as Ze, watch as ue, toRef as Ge, unref as c, withModifiers as ne, withDirectives as Ye, vModelSelect as Qe, defineAsyncComponent as Xe, withKeys as ze, createSlots as et, resolveDynamicComponent as tt, nextTick as Re } from "vue";
import { peekRef as Ce, Icon as Ae, RunningCommand as at, FoldGroup as Ne, TaskStatusIcon as nt, useWindow as Ve, Btn as ae, SwitchCase as qe, TextInput as lt, TextArea as He, useNow as ot, age as st, perHour as rt, loadWindowComponent as it, coalesced as We, READ_RATES as _e, TimeAgo as Le, InnerTabs as dt, TabBody as ut, EmptyState as Fe, useRows as ct, useDeclaredRows as Oe, SearchBar as vt, Segmented as pt, MenuLabel as Te, MenuItem as xe, RowList as gt, toggleFilter as ht } from "@journal/window-kit";
import { _ as ie, T as ft } from "./TranscriptRows-DCpyNUhv.mjs";
const mt = ["stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const p = e, f = { right: 0, down: 90, left: 180, up: 270 }, u = {
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
    return (w, V) => (a(), o("svg", {
      class: "ico",
      style: je({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...p.facing === "right" ? {} : { transform: `rotate(${f[p.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[u[e.name] || e.name] || t.dot
    }, null, 12, mt));
  }
}, yt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, kt = {
  key: 1,
  class: "menu-item-text"
}, wt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (p, f) => (a(), o("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), o("span", yt, y(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), o("span", kt, [
        j("span", null, [
          Me(p.$slots, "default", {}, void 0, !0)
        ]),
        j("small", null, y(e.description), 1)
      ])) : Me(p.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ ie(wt, [["__scopeId", "data-v-9c67fe37"]]), bt = {}, Mt = { class: "menu-label" };
function xt(e, p) {
  return a(), o("span", Mt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ ie(bt, [["render", xt], ["__scopeId", "data-v-71c11156"]]), $t = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ct = {
  key: 0,
  class: "skills-none"
}, St = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: p }) {
    const f = e, u = p, t = M(() => f.skills.filter((V) => V.state === "loaded")), w = M(() => f.skills.filter((V) => V.state !== "loaded"));
    return (V, S) => (a(), o("div", $t, [
      x(be, null, {
        default: $(() => [...S[1] || (S[1] = [
          g("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (a(), o("p", Ct, "None yet. Compacting the conversation empties this list.")),
      (a(!0), o(E, null, oe(t.value, (m) => (a(), o("p", {
        key: m.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        x(ee, {
          name: "book",
          size: 12
        }),
        g(y(m.skill), 1)
      ]))), 128)),
      w.value.length ? (a(), o(E, { key: 1 }, [
        x(be, null, {
          default: $(() => [...S[2] || (S[2] = [
            g("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), o(E, null, oe(w.value, (m) => (a(), o("p", {
          key: m.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          x(ee, {
            name: "book",
            size: 12
          }),
          g(y(m.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      x(ke, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (m) => u("browse"))
      }, {
        default: $(() => [...S[3] || (S[3] = [
          g("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Tt = /* @__PURE__ */ ie(St, [["__scopeId", "data-v-27140adf"]]), jt = (e, p, f) => Math.max(p, Math.min(f, e)), De = /* @__PURE__ */ new WeakMap(), At = (e, p) => De.set(e, p);
function Vt(e, p) {
  for (let f = p; f; f = De.get(f) ?? f.parentElement) if (f === e) return !0;
  return !1;
}
function zt(e, p) {
  const f = (u) => {
    var w, V;
    const t = ((w = e.value) == null ? void 0 : w.element) || ((V = e.value) == null ? void 0 : V.$el) || e.value;
    t && !Vt(t, u.target) && p(u);
  };
  window.addEventListener("click", f), Se(() => window.removeEventListener("click", f));
}
const ye = 8, Rt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: p, emit: f }) {
    const u = e, t = A(null), w = (s) => s ? `${s}px` : void 0, V = M(() => ({
      minWidth: w(u.minWidth),
      maxWidth: w(u.maxWidth),
      maxHeight: w(u.maxHeight),
      height: w(u.height)
    })), S = A({ w: 0, h: 0 }), m = A(u.anchor ? u.anchor.getBoundingClientRect() : null), F = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), C = (s) => ({
      left: Math.max(0, s.left),
      top: Math.max(0, s.top),
      right: Math.min(window.innerWidth, s.right),
      bottom: Math.min(window.innerHeight, s.bottom)
    }), T = (s) => {
      const z = s.closest(".pane, .float-window");
      return z ? C(z.getBoundingClientRect()) : F();
    }, I = (s, z) => `${Math.max(0, s ? Math.min(s, z) : z)}px`;
    function W(s, z) {
      return {
        below: s.bottom - z.bottom - u.gap - ye,
        above: z.top - s.top - u.gap - ye,
        across: s.right - s.left - 2 * ye
      };
    }
    function J(s) {
      const z = T(u.anchor), q = W(z, s);
      return S.value.w <= q.across && S.value.h <= Math.max(q.below, q.above) ? z : F();
    }
    const L = M(() => {
      if (!m.value) return V.value;
      const s = m.value, z = J(s), q = W(z, s), { w: Y, h: Q } = S.value, X = u.align === "auto" ? s.left + s.right > z.left + z.right : u.align === "right", le = jt(X ? s.right - Y : s.left, z.left + ye, Math.max(z.left + ye, z.right - Y - ye)), ge = Q > q.below && q.above > q.below ? { bottom: `${window.innerHeight - s.top + u.gap}px`, maxHeight: I(u.maxHeight, q.above) } : { top: `${s.bottom + u.gap}px`, maxHeight: I(u.maxHeight, q.below) };
      return { ...V.value, ...ge, left: `${le}px`, maxWidth: I(u.maxWidth, q.across) };
    }), N = f, O = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function B(s) {
      const z = O(), q = z.indexOf(document.activeElement);
      z[(q + s + z.length) % z.length].focus();
    }
    const K = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => N("close") }, U = (s) => K[s.key] && (s.preventDefault(), K[s.key]()), _ = () => t.value && (S.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let Z = 0;
    const h = new ResizeObserver(() => {
      cancelAnimationFrame(Z), Z = requestAnimationFrame(_);
    });
    zt(t, (s) => u.anchor && !u.anchor.contains(s.target) && N("close"));
    const i = (s, z) => ["top", "left", "right", "bottom"].some((q) => Math.abs(s[q] - z[q]) > 1), r = (s) => s.bottom < 0 || s.top > window.innerHeight;
    let d = 0;
    function G() {
      if (u.anchor) {
        const s = u.anchor.getBoundingClientRect();
        if (!u.anchor.isConnected || r(s)) return N("close");
        i(s, m.value) && (m.value = s);
      }
      d = requestAnimationFrame(G);
    }
    return Ee(() => {
      u.anchor && t.value && At(t.value, u.anchor), _(), t.value && h.observe(t.value), !u.plain && O()[0] && O()[0].focus(), G();
    }), Se(() => {
      h.disconnect(), cancelAnimationFrame(d), cancelAnimationFrame(Z);
    }), p({ element: t }), (s, z) => (a(), H(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      j("div", Ze({
        ref_key: "panel",
        ref: t
      }, s.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: U
      }), [
        Me(s.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ht = /* @__PURE__ */ ie(Rt, [["__scopeId", "data-v-7f046e0d"]]);
async function Lt(e, p, f) {
  if (!e) return f(p);
  const { target: u, fields: t } = e, w = Object.fromEntries(Object.keys(t).map((m) => [m, u[m]])), V = () => Object.assign(u, w);
  Object.assign(u, t);
  let S = !1;
  try {
    const m = await f(p);
    return S = m.ok, m;
  } finally {
    S || V();
  }
}
function Ot(e, p, f) {
  const u = A([]), t = A([]), w = A({}), V = A(""), S = A(!1), m = M(() => !!e.value && !e.value.ended_at), F = M(() => m.value && !!e.value.paused_at);
  async function C() {
    if (m.value) {
      const N = await p(["agent", "controls", String(e.value.id)]);
      u.value = N.ok ? N.value.groups : [];
      return;
    }
    const L = await p(["agent", "programs"]);
    t.value = L.ok ? L.value.rows : [];
  }
  async function T(L, N = null) {
    V.value = "";
    const O = await Lt(N, L, p);
    return V.value = O.ok ? "" : O.error, f(), O;
  }
  const I = (L, N) => T(["agent", "control", String(e.value.id), L, N.value], { target: w, fields: { value: { ...w.value, [L]: N.label } } }), W = () => (S.value = !1, T(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), J = (L) => T(["agent", "launch", L.name]);
  return Ee(C), ue(m, C), { groups: u, programs: t, chosen: w, failure: V, asking: S, running: m, paused: F, choose: I, stop: W, start: J };
}
const Pe = { claude: "Claude Code", codex: "Codex" };
Object.entries(Pe).map(([e, p]) => ({ key: e, label: p }));
function Bt(e, p = "agent") {
  return Pe[e] || p;
}
const It = ["disabled", "title"], Et = ["title"], Nt = { class: "gauge usage" }, qt = ["disabled", "title"], Wt = { class: "gauge" }, _t = ["disabled", "title"], Ft = ["disabled"], Dt = ["disabled"], Pt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Jt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ut = ["title"], Kt = 75, Zt = {
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
  setup(e, { emit: p }) {
    const f = e, u = p, t = Ot(Ge(f, "agent"), f.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => u("changed")), w = A(null), V = A(""), S = M(() => t.groups.value.find((h) => h.key === V.value));
    function m(h, i) {
      w.value = h.currentTarget, V.value = i;
    }
    function F() {
      w.value = null, V.value = "", t.asking.value = !1;
    }
    const C = A([]), T = M(() => C.value.filter((h) => h.state === "loaded"));
    async function I() {
      const h = f.agent && f.run ? await f.run(["agent-skill", "list", "--agent", String(f.agent.id)]) : null;
      C.value = h != null && h.ok ? h.value.rows ?? [] : [];
    }
    function W(h) {
      m(h, "skills"), I();
    }
    ue(() => {
      var h;
      return (h = f.agent) == null ? void 0 : h.id;
    }, I, { immediate: !0 });
    const J = (h) => t.groups.value.some((i) => i.key === h), L = M(() => {
      var h;
      return t.chosen.value.model ?? ((h = O.value) == null ? void 0 : h.model) ?? "";
    }), N = M(() => {
      var h;
      return t.chosen.value.effort ?? ((h = O.value) == null ? void 0 : h.effort) ?? "";
    });
    M(() => !!f.agent && !f.agent.ended_at);
    const O = M(() => {
      var h;
      return ((h = f.usage.agents) == null ? void 0 : h.find((i) => {
        var r;
        return i.id === ((r = f.agent) == null ? void 0 : r.id);
      })) ?? null;
    }), B = M(() => {
      var h;
      return ((h = f.usage.windows) == null ? void 0 : h[0]) ?? null;
    }), K = M(() => B.value ? Math.max(0, Math.min(100, Math.round(B.value.used_percent))) : null), U = M(() => {
      var h;
      return ((h = O.value) == null ? void 0 : h.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), _ = M(() => {
      var h;
      return (h = O.value) != null && h.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    }), Z = M(() => {
      var r;
      const h = (r = f.agent) != null && r.process_started_at ? new Date(f.agent.process_started_at).getTime() : 0;
      if (!h) return "";
      const i = Math.max(0, Math.floor((f.now - h) / 6e4));
      return i >= 60 ? `${Math.floor(i / 60)}h ${i % 60}m` : `${i}m`;
    });
    return (h, i) => (a(), o("div", {
      class: re(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), o(E, { key: 0 }, [
        j("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: i[0] || (i[0] = (r) => m(r, "agent"))
        }, [
          x(ee, {
            name: "agents",
            size: 12
          }),
          g(" " + y(c(Bt)(e.agent.program)), 1)
        ], 8, It),
        K.value !== null ? (a(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${K.value}% of the plan's ${B.value.title} allowance used`,
          onClick: i[1] || (i[1] = (r) => u("open", "usage", r.currentTarget))
        }, [
          x(ee, {
            name: "clock",
            size: 12
          }),
          i[14] || (i[14] = g()),
          j("span", Nt, [
            j("span", {
              style: je({ width: `${K.value}%` })
            }, null, 4)
          ]),
          g(" " + y(K.value) + "% ", 1)
        ], 8, Et)) : k("", !0),
        U.value !== null ? (a(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${U.value}% full: clear or compact it`,
          onClick: i[2] || (i[2] = (r) => J("context") ? m(r, "context") : u("open", "context", r.currentTarget))
        }, [
          x(ee, {
            name: "gauge",
            size: 12
          }),
          i[15] || (i[15] = g()),
          j("span", Wt, [
            j("span", {
              style: je({ width: `${U.value}%` })
            }, null, 4)
          ]),
          g(" " + y(U.value) + "% ", 1)
        ], 8, qt)) : k("", !0),
        L.value ? (a(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${L.value}: change the model`,
          onClick: i[3] || (i[3] = (r) => J("model") ? m(r, "model") : null)
        }, [
          x(ee, {
            name: "model",
            size: 12
          }),
          g(" " + y(L.value), 1)
        ], 8, _t)) : k("", !0),
        J("effort") || e.card && N.value ? (a(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: i[4] || (i[4] = (r) => m(r, "effort"))
        }, [
          x(ee, {
            name: "bolt",
            size: 12
          }),
          g(" " + y(N.value), 1)
        ], 8, Ft)) : k("", !0),
        _.value ? (a(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: i[5] || (i[5] = (r) => u("open", "cost", r.currentTarget))
        }, y(_.value), 9, Dt)) : k("", !0),
        Z.value ? (a(), o("span", Pt, [
          x(ee, {
            name: "reminders",
            size: 12
          }),
          g(" " + y(Z.value), 1)
        ])) : k("", !0),
        e.branch ? (a(), o("span", Jt, [
          x(ee, {
            name: "branch",
            size: 12
          }),
          g(" " + y(e.branch), 1)
        ])) : k("", !0),
        e.card ? k("", !0) : (a(), o("button", {
          key: 7,
          type: "button",
          class: re(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: i[6] || (i[6] = (r) => u("open", "jobs", r.currentTarget))
        }, [
          x(ee, {
            name: "clock",
            size: 12
          }),
          g(" " + y(e.jobs), 1)
        ], 2)),
        e.run ? (a(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: W
        }, [
          x(ee, {
            name: "book",
            size: 12
          }),
          g(" " + y(T.value.length), 1)
        ])) : k("", !0),
        e.fitness ? (a(), o(E, { key: 9 }, [
          j("button", {
            type: "button",
            class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Kt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: i[7] || (i[7] = (r) => u("open", "fitness", r.currentTarget))
          }, [
            x(ee, {
              name: "heart",
              size: 12
            }),
            g(" " + y(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          j("button", {
            type: "button",
            class: re(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: i[8] || (i[8] = (r) => u("open", "load", r.currentTarget))
          }, [
            x(ee, {
              name: "weight",
              size: 12
            }),
            g(" " + y(e.fitness.workload), 1)
          ], 2)
        ], 64)) : k("", !0)
      ], 64)) : e.run && !e.loading ? (a(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: i[9] || (i[9] = (r) => m(r, "start"))
      }, [
        x(ee, {
          name: "agents",
          size: 12
        }),
        i[16] || (i[16] = g(" Start an agent", -1))
      ])) : k("", !0),
      i[22] || (i[22] = j("span", { class: "space" }, null, -1)),
      c(t).failure.value ? (a(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: c(t).failure.value
      }, y(c(t).failure.value), 9, Ut)) : k("", !0),
      Me(h.$slots, "default", {}, void 0, !0),
      w.value ? (a(), H(Ht, {
        key: 3,
        anchor: w.value,
        "min-width": 190,
        onClose: F
      }, {
        default: $(() => [
          V.value === "agent" ? (a(), o(E, { key: 0 }, [
            c(t).asking.value ? (a(), o(E, { key: 0 }, [
              x(be, { "data-agent-stop-ask": "" }, {
                default: $(() => [...i[17] || (i[17] = [
                  g("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              x(ke, {
                "data-agent-stop-confirm": "",
                onClick: i[10] || (i[10] = (r) => (F(), c(t).stop()))
              }, {
                default: $(() => [...i[18] || (i[18] = [
                  g("Stop it", -1)
                ])]),
                _: 1
              }),
              x(ke, {
                onClick: i[11] || (i[11] = (r) => c(t).asking.value = !1)
              }, {
                default: $(() => [...i[19] || (i[19] = [
                  g("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), H(ke, {
              key: 1,
              "data-agent-stop": "",
              onClick: i[12] || (i[12] = (r) => c(t).asking.value = !0)
            }, {
              default: $(() => [...i[20] || (i[20] = [
                g("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : V.value === "start" ? (a(), o(E, { key: 1 }, [
            x(be, null, {
              default: $(() => [...i[21] || (i[21] = [
                g("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), o(E, null, oe(c(t).programs.value, (r) => (a(), H(ke, {
              key: r.name,
              "data-agent-program": r.name,
              onClick: (d) => (F(), c(t).start(r))
            }, {
              default: $(() => [
                g(y(r.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : V.value === "skills" ? (a(), H(Tt, {
            key: 2,
            skills: C.value,
            onBrowse: i[13] || (i[13] = (r) => (F(), u("open", "skills", null)))
          }, null, 8, ["skills"])) : S.value ? (a(), o(E, { key: 3 }, [
            x(be, null, {
              default: $(() => [
                g(y(S.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), o(E, null, oe(S.value.choices, (r) => (a(), H(ke, {
              key: r.value,
              "data-agent-choice": r.value,
              onClick: (d) => (c(t).choose(S.value.key, r), F())
            }, {
              default: $(() => [
                g(y(r.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : k("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 2));
  }
}, Gt = /* @__PURE__ */ ie(Zt, [["__scopeId", "data-v-cada4ffe"]]), Yt = {
  class: "agent-command",
  "data-agent-command": ""
}, Qt = {
  key: 1,
  "data-agent-stopped": ""
}, Xt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (p, f) => (a(), o("span", Yt, [
      e.waitReason ? (a(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: f[0] || (f[0] = ne((u) => c(Ce)("test_queue:0"), ["stop"]))
      }, [
        g("Waiting: " + y(e.waitReason) + " ", 1),
        x(c(Ae), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), o("span", Qt, "Waiting")) : (a(), H(c(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Be = /* @__PURE__ */ ie(Xt, [["__scopeId", "data-v-bb905922"]]), ea = ["data-agent-delegated", "onClick"], ta = { class: "agent-task-number" }, aa = { class: "agent-task-title" }, na = ["title"], la = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: p }) {
    const f = p;
    return (u, t) => (a(), H(c(Ne), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (w) => f("toggle"))
    }, {
      default: $(() => [
        (a(!0), o(E, null, oe(e.section.tasks, (w) => (a(), o("button", {
          key: w.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": w.id,
          onClick: (V) => c(Ce)(`tasks:${w.id}`)
        }, [
          x(c(nt), {
            status: w.state
          }, null, 8, ["status"]),
          j("span", ta, y(w.id), 1),
          j("span", aa, y(w.title), 1),
          w.plan_id ? (a(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${w.plan_id}: ${w.plan_title}`
          }, "Plan " + y(w.plan_id) + ": " + y(w.plan_title), 9, na)) : k("", !0)
        ], 8, ea))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, oa = /* @__PURE__ */ ie(la, [["__scopeId", "data-v-acc154a9"]]), sa = { class: "action-buttons" }, ra = { class: "action-field" }, ia = ["disabled"], da = ["value"], ua = { key: 1 }, ca = {
  key: 1,
  class: "action-field"
}, va = { class: "action-buttons" }, pa = { class: "action-field" }, ga = { class: "action-buttons" }, ha = { class: "action-buttons" }, fa = {
  key: 0,
  role: "alert"
}, ma = {
  key: 1,
  role: "status"
}, ya = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const p = e, f = Ve(), u = A(""), t = A(""), w = A(""), V = A(""), S = A([]), m = A(0), F = A(!1), C = A(!1), T = A(!1), I = A(""), W = A(""), J = M(() => !!p.row.retired_at || p.row.state === "retired"), L = M(() => !J.value && !!p.row.ended_at), N = M(() => {
      var r;
      return L.value && ((r = p.row.job_command) == null ? void 0 : r.length) && !p.row.resume_reason;
    }), O = M(() => N.value && !C.value && (p.row.job_task_flag ? S.value.some((r) => String(r.id) === V.value) : !!t.value.trim()));
    function B(r) {
      u.value = r, t.value = "", w.value = "", V.value = "", I.value = "", W.value = "";
    }
    async function K() {
      B("job"), p.row.job_task_flag && (S.value = [], m.value = 0, F.value = !1, await U());
    }
    async function U() {
      if (!C.value) {
        C.value = !0;
        try {
          const r = await f.read(`task list --state open --limit 100 --page ${m.value + 1}`);
          I.value = r.ok ? "" : r.error, r.ok && (S.value = [...S.value, ...r.value.rows], m.value = r.value.page, F.value = r.value.page * r.value.size < r.value.total);
        } finally {
          C.value = !1;
        }
      }
    }
    async function _(r, d) {
      if (!T.value) {
        T.value = !0, I.value = "";
        try {
          const G = await f.run(r);
          I.value = G.ok ? "" : G.error, G.ok && (B(""), W.value = d);
        } finally {
          T.value = !1;
        }
      }
    }
    async function Z() {
      if (!O.value) return;
      const r = p.row.job_task_flag ? [p.row.job_task_flag, V.value] : [t.value.trim()];
      await _([...p.row.job_command, String(p.row.id), ...r], "Job sent.");
    }
    async function h() {
      J.value || L.value || !t.value.trim() || await _(["message", "send", t.value.trim(), "--target-agent", String(p.row.id)], "Message sent.");
    }
    async function i() {
      !L.value || u.value !== "retire" || !w.value.trim() || await _(["agent", "retire", String(p.row.id), "--reason", w.value.trim()], "Agent retired permanently.");
    }
    return (r, d) => {
      var G;
      return J.value ? k("", !0) : (a(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: d[9] || (d[9] = ne(() => {
        }, ["stop"])),
        onKeydown: d[10] || (d[10] = ne(() => {
        }, ["stop"]))
      }, [
        j("div", sa, [
          L.value ? (a(), o(E, { key: 0 }, [
            (G = e.row.job_command) != null && G.length ? (a(), H(c(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: T.value || C.value || !N.value,
              onClick: K
            }, {
              default: $(() => [...d[11] || (d[11] = [
                g("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), H(c(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: T.value || C.value,
              onClick: d[0] || (d[0] = (s) => B("retire"))
            }, {
              default: $(() => [...d[12] || (d[12] = [
                g("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : (a(), H(c(ae), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: T.value,
            onClick: d[1] || (d[1] = (s) => B("message"))
          }, {
            default: $(() => [...d[13] || (d[13] = [
              g("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        x(c(qe), { value: u.value }, {
          job: $(() => [
            j("form", {
              onSubmit: ne(Z, ["prevent"])
            }, [
              e.row.job_task_flag ? (a(), o(E, { key: 0 }, [
                j("label", ra, [
                  d[15] || (d[15] = g("Task ", -1)),
                  Ye(j("select", {
                    "onUpdate:modelValue": d[2] || (d[2] = (s) => V.value = s),
                    disabled: T.value || C.value,
                    "data-agent-job-task": ""
                  }, [
                    d[14] || (d[14] = j("option", { value: "" }, "Choose an open task", -1)),
                    (a(!0), o(E, null, oe(S.value, (s) => (a(), o("option", {
                      key: s.id,
                      value: String(s.id)
                    }, y(s.id) + ": " + y(s.title), 9, da))), 128))
                  ], 8, ia), [
                    [Qe, V.value]
                  ])
                ]),
                F.value ? (a(), H(c(ae), {
                  key: 0,
                  small: "",
                  disabled: T.value || C.value,
                  "data-agent-more-tasks": "",
                  onClick: U
                }, {
                  default: $(() => [...d[16] || (d[16] = [
                    g("More tasks", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : k("", !0),
                !C.value && !S.value.length && !I.value ? (a(), o("p", ua, "No open tasks.")) : k("", !0)
              ], 64)) : (a(), o("label", ca, [
                d[17] || (d[17] = g("Job", -1)),
                x(c(He), {
                  value: t.value,
                  disabled: T.value,
                  "data-agent-job-text": "",
                  onInput: d[3] || (d[3] = (s) => t.value = s.target.value)
                }, null, 8, ["value", "disabled"])
              ])),
              j("div", va, [
                x(c(ae), {
                  type: "submit",
                  small: "",
                  disabled: T.value || !O.value,
                  "data-agent-submit-job": ""
                }, {
                  default: $(() => [...d[18] || (d[18] = [
                    g("Send the job", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                x(c(ae), {
                  small: "",
                  disabled: T.value,
                  onClick: d[4] || (d[4] = (s) => B(""))
                }, {
                  default: $(() => [...d[19] || (d[19] = [
                    g("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          message: $(() => [
            j("form", {
              onSubmit: ne(h, ["prevent"])
            }, [
              j("label", pa, [
                d[20] || (d[20] = g("Message", -1)),
                x(c(He), {
                  value: t.value,
                  disabled: T.value,
                  "data-agent-message-text": "",
                  onInput: d[5] || (d[5] = (s) => t.value = s.target.value)
                }, null, 8, ["value", "disabled"])
              ]),
              j("div", ga, [
                x(c(ae), {
                  type: "submit",
                  small: "",
                  disabled: T.value || !t.value.trim(),
                  "data-agent-submit-message": ""
                }, {
                  default: $(() => [...d[21] || (d[21] = [
                    g("Send the message", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                x(c(ae), {
                  small: "",
                  disabled: T.value,
                  onClick: d[6] || (d[6] = (s) => B(""))
                }, {
                  default: $(() => [...d[22] || (d[22] = [
                    g("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          retire: $(() => [
            j("form", {
              "data-agent-retire-confirm": "",
              onSubmit: ne(i, ["prevent"])
            }, [
              d[25] || (d[25] = j("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
              x(c(lt), {
                modelValue: w.value,
                "onUpdate:modelValue": d[7] || (d[7] = (s) => w.value = s),
                label: "Reason",
                disabled: T.value,
                "data-agent-retire-reason": ""
              }, null, 8, ["modelValue", "disabled"]),
              j("div", ha, [
                x(c(ae), {
                  type: "submit",
                  small: "",
                  disabled: T.value || !w.value.trim(),
                  "data-agent-confirm-retire": ""
                }, {
                  default: $(() => [...d[23] || (d[23] = [
                    g("Retire permanently", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                x(c(ae), {
                  small: "",
                  disabled: T.value,
                  onClick: d[8] || (d[8] = (s) => B(""))
                }, {
                  default: $(() => [...d[24] || (d[24] = [
                    g("Cancel", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 32)
          ]),
          _: 1
        }, 8, ["value"]),
        I.value ? (a(), o("p", fa, y(I.value), 1)) : k("", !0),
        W.value ? (a(), o("p", ma, y(W.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, ka = /* @__PURE__ */ ie(ya, [["__scopeId", "data-v-90d49ad2"]]), wa = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], ba = { class: "agent-head" }, Ma = ["data-state"], xa = {
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
}, Ta = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, ja = { class: "agent-line" }, Aa = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Va = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, za = {
  key: 0,
  class: "agent-line agent-work-start"
}, Ra = ["data-peek"], Ha = ["title"], La = ["data-peek"], Oa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ba = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, Ia = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ea = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Na = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, qa = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Wa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, _a = {
  key: 0,
  class: "agent-helper-brief"
}, Fa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Da = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Pa = "It ended without a report", Ja = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: p }) {
    const f = { helper: "Helper", reviewer: "Reviewer" }, u = ["started", "blocked", "open", "completed"], t = e, w = p, V = ot(), S = M(() => {
      var n, b;
      if ((n = t.facts) != null && n.profile_title) return t.facts.profile_title;
      if ((b = t.facts) != null && b.profile) return t.facts.profile;
      const l = f[t.row.role] || t.row.role;
      return l.slice(0, 1).toUpperCase() + l.slice(1);
    }), m = M(() => {
      var l;
      return ((l = t.facts) == null ? void 0 : l.tasks) ?? [];
    }), F = M(() => m.value.filter((l) => l.state === "open")), C = M(() => {
      const l = m.value.find((n) => {
        var b;
        return n.id === ((b = t.facts) == null ? void 0 : b.task_id);
      });
      return l != null && l.plan_id ? l : F.value.find((n) => n.plan_id);
    }), T = M(() => {
      var l, n, b, v, R;
      return t.row.role === "helper" ? ((l = t.facts) == null ? void 0 : l.helper_job) || "" : (n = t.facts) != null && n.job_enabled && (((b = t.facts) == null ? void 0 : b.task_title) || ((v = F.value[0]) == null ? void 0 : v.title) || ((R = m.value.at(-1)) == null ? void 0 : R.title)) || "";
    }), I = M(() => {
      var l;
      return ((l = t.facts) == null ? void 0 : l.job_returned) || t.row.job_returned || "";
    }), W = M(() => {
      const l = T.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return l ? `${l[1].toLowerCase() === "plan" ? "plans" : "docs"}:${l[2]}` : "";
    }), J = M(() => {
      var l, n;
      return [t.row.program, (l = t.facts) == null ? void 0 : l.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), L = M(() => {
      var l, n;
      return t.row.ended_at && ((n = (l = t.facts) == null ? void 0 : l.job_returned) != null && n.startsWith(Pa)) ? t.facts.job_returned : "";
    }), N = M(() => st(t.row.process_started_at || t.row.created_at, V.value)), O = /* @__PURE__ */ new Set(["open", "started", "testing"]), B = M(() => !!t.row.ended_at && t.row.role !== "main" && m.value.some((l) => O.has(l.state))), K = M(() => {
      var l;
      return t.waitReason || B.value ? "waiting" : t.row.state === "running" && ((l = t.facts) == null ? void 0 : l.state) || t.row.state;
    }), U = M(() => {
      var l;
      return ((l = t.progress) == null ? void 0 : l.completed_count) ?? m.value.filter((n) => n.state === "completed").length;
    }), _ = M(() => {
      var l;
      return ((l = t.progress) == null ? void 0 : l.task_count) ?? m.value.length;
    }), Z = M(() => `${U.value} of ${_.value} ${_.value === 1 ? "task" : "tasks"}`), h = M(() => {
      var n;
      const l = rt(U.value, ((n = t.progress) == null ? void 0 : n.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, V.value);
      return t.row.role !== "main" && l ? `${l} per hour` : "";
    }), i = M(() => m.value.length ? u.map((l) => ({ state: l, label: l.slice(0, 1).toUpperCase() + l.slice(1), tasks: m.value.filter((n) => n.state === l || l === "started" && n.state === "testing" || l === "completed" && n.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), d = A({}), G = (l) => !(d.value[l] ?? r.has(l)), s = (l) => d.value = { ...d.value, [l]: G(l) }, z = Ve(), q = M(() => t.row.access === "read-only"), Y = M(() => !!t.row.retired_at || t.row.state === "retired"), Q = M(() => Y.value ? z.tabs.filter((l) => l.key === "transcript") : q.value ? z.tabs.filter((l) => ["transcript", "terminal"].includes(l.key)) : z.tabs), X = A(Q.value[0]);
    ue(Q, (l) => {
      l.some((n) => {
        var b;
        return n.key === ((b = X.value) == null ? void 0 : b.key);
      }) || (X.value = l[0]);
    }), ue(() => t.open, (l) => {
      l && (X.value = Q.value[0]);
    });
    const le = Object.fromEntries(z.tabs.filter((l) => l.component).map((l) => [l.key, Xe(() => it(l.component))])), pe = M(() => t.row.role === "helper" && !t.row.ended_at), ge = () => z.run(["helper", "stop", String(t.row.id)]), de = A(!1), se = A(""), he = A(""), fe = M(() => t.row.role !== "main" && (!t.row.ended_at || B.value || t.waitReason));
    async function me() {
      if (!fe.value) return;
      const l = await z.read(`usage tool --agent ${t.row.id}`, { deferred: !0 });
      se.value = l.ok ? l.value.tool : "", he.value = l.ok ? l.value.note : "";
    }
    const we = z.follow(["hook_call.*", "process_part.*"], We(me, _e.agentCommand));
    return Se(() => we == null ? void 0 : we()), me(), (l, n) => {
      var b, v, R, ce;
      return a(), o("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: n[6] || (n[6] = (D) => !e.open && w("toggle")),
        onKeydown: [
          n[7] || (n[7] = ze(ne((D) => !e.open && w("toggle"), ["self", "prevent"]), ["enter"])),
          n[8] || (n[8] = ze(ne((D) => !e.open && w("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        j("span", ba, [
          e.open ? (a(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = ne((D) => w("toggle"), ["stop"]))
          }, [
            x(c(Ae), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          j("span", {
            class: "agent-dot",
            "data-state": K.value,
            "data-agent-motion": ""
          }, null, 8, Ma),
          j("span", xa, y(S.value), 1),
          j("span", $a, y(((b = e.facts) == null ? void 0 : b.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (a(), H(c(Ae), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          j("span", Ca, [
            e.row.ended_at && !B.value ? (a(), H(c(Le), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), o("span", Sa, y(N.value), 1)),
            (v = e.facts) != null && v.last_activity ? (a(), o("span", Ta, [
              n[9] || (n[9] = g("Last heard: ", -1)),
              x(c(Le), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : k("", !0)
          ])
        ]),
        j("span", ja, [
          j("span", Aa, y(J.value), 1),
          _.value && !T.value ? (a(), o("span", Va, y(Z.value), 1)) : k("", !0)
        ]),
        C.value ? (a(), o("span", za, [
          j("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${C.value.plan_id}`,
            onClick: n[1] || (n[1] = ne((D) => c(Ce)(`plans:${C.value.plan_id}`), ["stop"]))
          }, "Plan " + y(C.value.plan_id) + ": " + y(C.value.plan_title), 9, Ra)
        ])) : k("", !0),
        T.value ? (a(), o("span", {
          key: 1,
          class: re(["agent-line", { "agent-work-start": !C.value }])
        }, [
          j("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: T.value
          }, [
            W.value ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": W.value,
              onClick: n[2] || (n[2] = ne((D) => c(Ce)(W.value), ["stop"]))
            }, y(T.value), 9, La)) : (a(), o(E, { key: 1 }, [
              g(y(T.value), 1)
            ], 64))
          ], 8, Ha),
          _.value ? (a(), o("span", Oa, y(Z.value), 1)) : k("", !0)
        ], 2)) : k("", !0),
        I.value ? (a(), o("p", Ba, [
          n[10] || (n[10] = j("span", null, "Last report: ", -1)),
          g(y(I.value), 1)
        ])) : k("", !0),
        e.row.retirement_reason ? (a(), o("p", Ia, "Retirement reason: " + y(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (a(), o("p", Ea, y(e.row.resume_reason), 1)) : k("", !0),
        x(ka, { row: e.row }, null, 8, ["row"]),
        !e.open && (fe.value || _.value && h.value) ? (a(), o("span", {
          key: 5,
          class: re(["agent-foot", { "agent-work-start": !T.value && !C.value }]),
          "data-agent-foot": ""
        }, [
          fe.value ? (a(), H(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: B.value,
            command: se.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
          _.value && h.value ? (a(), o("span", Na, y(h.value), 1)) : k("", !0)
        ], 2)) : k("", !0),
        e.open ? (a(), o("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[5] || (n[5] = ne(() => {
          }, ["stop"]))
        }, [
          x(Gt, {
            agent: e.row,
            branch: (R = e.progress) == null ? void 0 : R.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: $(() => [
              pe.value ? (a(), H(c(ae), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: ge
              }, {
                default: $(() => [...n[11] || (n[11] = [
                  g("Stop", -1)
                ])]),
                _: 1
              })) : k("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          fe.value ? (a(), H(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: B.value,
            command: se.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
          L.value ? (a(), o("p", qa, y(L.value), 1)) : k("", !0),
          x(c(dt), {
            class: "agent-tabs",
            tabs: Q.value,
            active: X.value,
            answer: { tasks: m.value.length },
            onChoose: n[3] || (n[3] = (D) => X.value = D)
          }, null, 8, ["tabs", "active", "answer"]),
          x(c(ut), {
            class: "agent-tab-body",
            tab: X.value,
            "data-agent-tab-body": (ce = X.value) == null ? void 0 : ce.key
          }, {
            default: $(() => {
              var D;
              return [
                x(c(qe), {
                  value: (D = X.value) == null ? void 0 : D.key
                }, et({
                  tasks: $(() => {
                    var P;
                    return [
                      m.value.length ? k("", !0) : (a(), H(c(Fe), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: $(() => [...n[12] || (n[12] = [
                          g("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), o(E, null, oe(i.value, (te) => (a(), H(oa, {
                        key: te.state,
                        section: te,
                        open: G(te.state),
                        onToggle: (ve) => s(te.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (P = e.facts) != null && P.instruction ? (a(), o(E, { key: 1 }, [
                        n[13] || (n[13] = j("p", { class: "agent-label" }, "Instruction", -1)),
                        j("div", Wa, y(e.facts.instruction), 1)
                      ], 64)) : k("", !0)
                    ];
                  }),
                  transcript: $(() => {
                    var P;
                    return [
                      q.value ? (a(), o(E, { key: 0 }, [
                        (P = e.facts) != null && P.instruction ? (a(), o("div", _a, [
                          x(c(Ne), {
                            label: "Instruction",
                            open: de.value,
                            "data-agent-section": "instruction",
                            onToggle: n[4] || (n[4] = (te) => de.value = !de.value)
                          }, {
                            default: $(() => [
                              j("div", Fa, y(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), o("p", Da, "No job recorded")) : k("", !0)
                      ], 64)) : k("", !0),
                      x(ft, {
                        line: `agent transcript ${e.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ];
                  }),
                  _: 2
                }, [
                  oe(c(le), (P, te) => ({
                    name: te,
                    fn: $(() => [
                      (a(), H(tt(P), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : k("", !0)
      ], 42, wa);
    };
  }
}, Ua = /* @__PURE__ */ ie(Ja, [["__scopeId", "data-v-8e803cad"]]), Ka = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Za = ["data-agent-row"], Ie = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", Ga = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const p = e, { rows: f } = ct("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: u } = Oe("waits"), { rows: t } = Oe("progress"), w = (n) => t.value.find((b) => b.agent_id === n.id) ?? null, V = (n) => {
      var b;
      return ((b = u.value.find((v) => v.agent_id === n.id)) == null ? void 0 : b.reason) ?? "";
    }, S = A("running"), m = A(""), F = JSON.parse(localStorage.getItem(Ie) || '{"roles":[],"profiles":[],"programs":[]}'), C = A(F), T = A({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), I = A([]), W = M(() => C.value.roles.length + C.value.profiles.length + C.value.programs.length), J = (n, b) => {
      C.value = ht(C.value, n, b);
    }, L = () => {
      C.value = { roles: [], profiles: [], programs: [] };
    }, N = (n) => n.slice(0, 1).toUpperCase() + n.slice(1);
    ue(C, (n) => localStorage.setItem(Ie, JSON.stringify(n)));
    const O = Ve();
    async function B() {
      const [n, b] = await Promise.all([O.read("agent cards --options"), O.read("agent programs")]);
      n.ok && (T.value = n.value), b.ok && (I.value = b.value.rows);
    }
    O.follow(["agent.*"], B), B();
    const K = A([]), U = A(""), _ = A(!1), Z = A(!1), h = A(25);
    let i = 0;
    async function r() {
      const n = ++i, b = [
        ...C.value.roles.map((R) => `--role ${JSON.stringify(R)}`),
        ...C.value.profiles.map((R) => `--profile ${JSON.stringify(R)}`),
        ...C.value.programs.map((R) => `--program ${JSON.stringify(R)}`)
      ].join(" "), v = await O.read(`${p.line} --show ${S.value} --search ${JSON.stringify(m.value)} --limit ${h.value} ${b}`);
      n === i && (K.value = v.ok ? v.value.rows : [], U.value = v.ok ? "" : v.error, Z.value = v.ok && v.value.page * v.value.size < v.value.total, _.value = !0);
    }
    async function d() {
      return h.value += 25, await r(), !0;
    }
    ue([S, m, C], () => {
      h.value = 25, r();
    }), O.follow(["agent.*", "task.*", ...O.sources.flatMap((n) => n.events)], We(r, _e.pageOfAgents)), r();
    const G = (n) => f.value.find((b) => b.id === n.id) ?? n.facts ?? null, s = K, z = M(() => !!m.value.trim() || W.value > 0), q = M(() => p.texts[S.value] ?? { title: p.empty, hint: "" }), Y = A(null), Q = A(null), X = A(null), le = M(() => s.value.find((n) => n.id === Y.value) ?? null), pe = M(() => le.value ? [le.value] : s.value), ge = M(() => s.value.length - pe.value.length), de = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let se = !1, he = 0;
    async function fe(n) {
      if (se) return;
      se = !0, he = X.value.scrollTop;
      const b = Q.value.querySelector(`[data-agent-open="${n.id}"]`);
      if (!de()) {
        const D = [...Q.value.querySelectorAll(".agent-row")].filter((P) => !P.contains(b));
        await Promise.all(D.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const v = [...b.querySelectorAll(".agent-head, .agent-line")], R = [...v, ...b.querySelectorAll("[data-agent-motion]")], ce = R.map((D) => D.getBoundingClientRect());
      if (Y.value = n.id, await Re(), !de()) {
        const D = R.map((P) => P.getBoundingClientRect());
        R.forEach((P, te) => {
          const ve = v.indexOf(P.parentElement), Je = ce[te].left - D[te].left - (ve < 0 ? 0 : ce[ve].left - D[ve].left), Ue = ce[te].top - D[te].top - (ve < 0 ? 0 : ce[ve].top - D[ve].top);
          P.animate([{ transform: `translate(${Je}px, ${Ue}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((P) => {
          P.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      se = !1;
    }
    async function me() {
      if (se || !le.value) return;
      se = !0;
      const n = Q.value.querySelector(`[data-agent-open="${Y.value}"]`), b = [...n.children, ...Q.value.querySelectorAll(".agents-held")], v = de() ? [] : b.map((R) => R.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(v.map((R) => R.finished)), Y.value = null, await Re(), X.value.scrollTop = he, v.forEach((R) => R.cancel()), de() || (n.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), Q.value.querySelectorAll(".agent-row").forEach((R) => {
        R.contains(n) || R.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), se = !1;
    }
    const we = (n) => Y.value === n.id ? me() : fe(n);
    ue(m, (n) => n.trim() && (Y.value = null)), ue(S, () => {
      Y.value = null;
    });
    const l = (n) => {
      n.key === "Escape" && me();
    };
    return window.addEventListener("keydown", l), Se(() => window.removeEventListener("keydown", l)), (n, b) => (a(), o("div", {
      ref_key: "agents",
      ref: Q,
      class: re(["agents", { focused: le.value }])
    }, [
      x(c(vt), {
        modelValue: m.value,
        "onUpdate:modelValue": b[1] || (b[1] = (v) => m.value = v),
        placeholder: "Search agents",
        "menu-count": W.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          x(c(Te), null, {
            default: $(() => [...b[2] || (b[2] = [
              g("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(E, null, oe(T.value.roles, (v) => (a(), H(c(xe), {
            key: v,
            role: "menuitemcheckbox",
            "aria-checked": C.value.roles.includes(v),
            checked: C.value.roles.includes(v),
            "data-filter-role": v,
            onClick: (R) => J("roles", v)
          }, {
            default: $(() => [
              g(y(N(v)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          T.value.profiles.length ? (a(), H(c(Te), { key: 0 }, {
            default: $(() => [...b[3] || (b[3] = [
              g("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), o(E, null, oe(T.value.profiles, (v) => (a(), H(c(xe), {
            key: v.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.profiles.includes(v.name),
            checked: C.value.profiles.includes(v.name),
            "data-filter-profile": v.name,
            onClick: (R) => J("profiles", v.name)
          }, {
            default: $(() => [
              g(y(v.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          x(c(Te), null, {
            default: $(() => [...b[4] || (b[4] = [
              g("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(E, null, oe(I.value, (v) => (a(), H(c(xe), {
            key: v.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.programs.includes(v.name),
            checked: C.value.programs.includes(v.name),
            "data-filter-program": v.name,
            onClick: (R) => J("programs", v.name)
          }, {
            default: $(() => [
              g(y(v.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          W.value ? (a(), H(c(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: L
          }, {
            default: $(() => [...b[5] || (b[5] = [
              g("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: $(() => [
          x(c(pt), {
            options: T.value.states,
            value: S.value,
            onPick: b[0] || (b[0] = (v) => S.value = v)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      S.value === "retired" && T.value.upgrade_retired ? (a(), o("p", Ka, "Retired during the upgrade: " + y(T.value.upgrade_retired), 1)) : k("", !0),
      j("div", {
        ref_key: "list",
        ref: X,
        class: re(["agents-view", { "agents-view-open": le.value }])
      }, [
        _.value && !U.value && !pe.value.length && W.value ? (a(), H(c(Fe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            x(c(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: L
            }, {
              default: $(() => [...b[6] || (b[6] = [
                g("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), H(c(gt), {
          key: 1,
          rows: pe.value,
          failure: U.value,
          loaded: _.value,
          more: !le.value && Z.value,
          older: d,
          empty: q.value.title,
          hint: q.value.hint,
          searching: z.value
        }, {
          default: $(({ row: v }) => [
            j("div", {
              class: "agent-row",
              "data-agent-row": v.id
            }, [
              x(Ua, {
                row: v,
                facts: G(v),
                progress: w(v),
                "wait-reason": V(v),
                open: v.id === Y.value,
                onToggle: (R) => we(v)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Za)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      le.value && ge.value ? (a(), o("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: me
      }, y(ge.value) + " more", 1)) : k("", !0)
    ], 2));
  }
}, en = /* @__PURE__ */ ie(Ga, [["__scopeId", "data-v-f31dbe01"]]);
export {
  en as A
};
