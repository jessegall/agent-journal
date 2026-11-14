// shared before every other script, whether or not the scripts share one scope
const escapeHtmlShared = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
Object.assign(window, {
  useState: React.useState, useEffect: React.useEffect, useRef: React.useRef, useMemo: React.useMemo, useCallback: React.useCallback, createContext: React.createContext, useContext: React.useContext,
  escapeHtml: escapeHtmlShared,
  // **bold** and `code` inside one line of text
  inline: (s) => escapeHtmlShared(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>"),
});
