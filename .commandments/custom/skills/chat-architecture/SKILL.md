---
name: ChatArchitecture
description: Load it before writing a chat mark, a docked item, a mark listener or a module's mark declarations in version 5, so every module declares and shows marks and docks the same way, through enums, listeners and commands.
summary: A mark is shown by a commit listener of the module that declares it, named by enum members kept in models/enums, a dock is written only by the docking commands, and no code branches on what kind of module declared a mark.
tier: mandatory
languages: [python]
---

# The chat architecture

Version 5 draws the chat from marks and the dock from docked items, and every module, core or third party, declares
its own (doc 1103). The chat module stores the marks and the docking module holds the dock. That only holds while
each piece keeps to its place.

## When it fires

- **`mark-shown-outside-a-listener`** - a command handler, a rule or another class runs `ShowMark` itself. A mark is
  a consequence of a change: the module that declares the type shows it from a commit listener on its own event,
  after the commit, as `MarkListener` does.
- **`raw-mark-type`** - a `MarkDeclaration`, `DockDeclaration`, `ShowMark` or `AddDockItem` names its type or variant
  with a string literal. Name it by the member of the module's own enum, `MemoryMarkType.MEMORY`.
- **`mark-enum-outside-enums`** - the enum of a module's mark types, mark variants or dock types sits outside the
  module's `models/enums/` folder. Keep each in its own file there, beside the module's other enums.
- **`dock-written-outside-docking`** - a module builds a `Dock` or a `DockItem` itself. Dock a row by running
  `AddDockItem` and take it out with `RemoveDockItem`; only the docking module builds and saves the rows, so every
  item passes the dock's guards.
- **`module-kind-path`** - code that declares, stores or lists marks and docks reads whether a module is core, a
  suite's or a third party's. Every module declares marks and docks the same way; only the trust rule, which
  decides how a body file loads, may read whether the journal ships a module.
- **`mark-type-in-the-viewer`** - the viewer's chat code (`src/viewer/src/chat/`, `domain/thread.js`) names the type
  of a module's mark or dock. The viewer takes a mark's type, family, icons and words from its declaration in
  `/api/marks` and draws every mark with the one template; it names no module's type.
