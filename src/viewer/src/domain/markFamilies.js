// Show in chat: one switch per mark family on the chat window, kept on the pane as the window's other options are

export const CHAT_WINDOW = "messages.chat";
export const familyKey = (family) => `show-${family}`;

// a toggle per family the modules declare, shown until the person hides it
export function familyOptions(declarations) {
    const families = new Map(declarations.map((declaration) => [declaration.family, declaration.family_title]));
    return [...families].map(([family, title]) => ({control: "toggle", key: familyKey(family), label: title, default: true}));
}

// the catalogue's windows with the chat window's options followed by the families'
export const withFamilyOptions = (windows, declarations) =>
    windows.map((window) => (window.name === CHAT_WINDOW ? {...window, options: [...(window.options || []), ...familyOptions(declarations)]} : window));

// the marks whose family the pane has not switched off; `option` reads a pane option by its key, undefined when never set
export const shownMarks = (marks, declarationOf, option) =>
    marks.filter((mark) => option(familyKey(declarationOf(mark.type)?.family)) !== false);
