# Home v6 component library

Merged from the four inventories of the Home v6 design (users 15751 and 15782): report 329 (pages), report 330 (chat), report 331 (window system) and report 332 (shell, tokens, primitives). The design itself is doc 101 and docs/designs/home-v6/index.html. Where two reports named the same thing twice, or the design draws it several times, it is one component here, and the entry says what it replaces.

The document holds two trees (user 15798):

- **The library tree:** every reusable component, nested as they compose.
- **The usage tree:** every page, window and screen, with the library components it is built from.

After them comes, for every page and window, whether it can be a backend-declared layout (the typed layouts of plan 53, doc 89) or needs its own frontend component. Then the entries follow, primitives first and composites by area: shell, window system, chat, pages. The gaps come last, each as a fix.

Each entry gives: what it is for, props and slots, variants and sizes, states with tokens and pixel values, keyboard and ARIA, motion, and where it is used. A component that holds others has a composition tree. Values are read from the design's CSS; none were measured in a browser (no report could run one).

Conventions used in every entry:

- **Focus ring.** 2px solid --focus. Offset 1px on buttons, chips, fields and icon buttons; 2px on toggles, text links and quiet lines; -2px (inside) on full-width rows, nav items, tree items and segmented buttons; 1px at -1px on tabs and window bars. A menu item uses an inset 2px box-shadow instead.
- **Hover** is --hover, **selected** is --sel, a quiet hairline is --line, strong borders are --border-2 and --border-3.
- **Reduced motion** (prefers-reduced-motion) turns off every glide, slide, grow and fan. The spinner only slows to 3s.
- **Focus return.** Every overlay (Menu, Popover, Dialog, ChatPanel) returns focus to the control that opened it. In the library this lives inside the component, not in global focus ids as in the prototype.

## Tokens

### Type

| Token | px | Used for |
|---|---|---|
| --text-reader | 17 | long reading |
| --text-title | 16 | page and reader titles (h2, h3) |
| --text-empty | 14 | empty states |
| --text-card | 13.5 | document body, card titles |
| --text-body | 13 | app body |
| --text-field | 12.5 | fields, rows, md buttons |
| --text-small | 12 | sm buttons, hints, status |
| --text-badge | 11.5 | chips, tabs, meta lines |
| --text-meta | 11 | counts, initials, shortcuts |
| --text-group | 10.5 | group labels (caps) |

Fonts: --font-sans is Geist with the system stack; --font-mono is Geist Mono with ui-monospace.

### Radius

| Token | px | Used for |
|---|---|---|
| --radius-badge | 4 | Chip, small avatar, Kbd |
| --radius-seg | 5 | segmented buttons, window chips |
| --radius-control | 6 | IconButton, MenuItem, compass cells |
| --radius-button | 7 | Button, NavItem, Picker |
| --radius-field | 8 | Field, DocumentBar, large avatar |
| --radius-menu | 9 | Menu, Popover, Toast, Caption |
| --radius-bubble | 10 | Message bubble |
| --radius-card | 12 | Card, Dialog, FloatingWindow, AppFrame |
| --radius-composer | 14 | Composer |

Pills and dots use 999px or 50%, which is not a token.

### Motion

- Easing: --ease-journal, cubic-bezier(0.2, 0, 0, 1).
- --duration-hover is 120ms: colour, knob, chevron.
- --duration-pop is 180ms: grow in, lift, fold in, close fade.
- --duration-view is 240ms: glides, panel slide, sidebar width, fan out.
- --duration-panel is 340ms. It is declared and never used, so drop it or give it a use.

### Colour

| Token | Light | Dark | Used for |
|---|---|---|---|
| --bg | #ffffff | #141312 | page, panes, fields |
| --bg-2 | #fbfaf9 | #11100f | quiet surface |
| --side | #f6f5f3 | #0e0d0c | sidebar, window headers |
| --raised | #f7f6f4 | #1a1817 | menus, cards, dialogs |
| --hover | #efedea | #201e1c | hover fill |
| --sel | #e8e5e1 | #252220 | selected or pressed fill, meter track |
| --chip | #edeae6 | #282523 | declared, unused |
| --bubble | #f4f2ef | #1c1a18 | your messages |
| --code-bg | #f6f5f2 | #131211 | code, inline code |
| --term | #181715 | #0b0a0a | terminal, process output (always dark) |
| --border | #e9e6e2 | #282523 | topbar, strips |
| --border-2 | #dcd8d3 | #33302d | buttons, menus, windows |
| --border-3 | #ccc7c1 | #3f3b37 | fields, strong edges |
| --line | #e9e6e2 | #252220 | hairlines between rows |
| --text | #1c1a18 | #e9e6e2 | primary text |
| --text-2 | #4a4540 | #b0aaa3 | secondary text |
| --text-3 | #625c56 | #a09a93 | muted text |
| --text-4 | #6f6962 | #9a948d | placeholders, gutters, edges |
| --brand | #262422 | #e8e6e3 | primary fill, selection, marks |
| --on-brand | #ffffff | #100f0e | text on brand |
| --danger | #bf4f3d | #df8b7e | errors, failed |
| --focus | #262422 | #e8e6e3 | focus ring |

Dark mode is the .dark class on the app frame. No component has dark-only rules except the Scrim.

### Elevation, layers and names to add

- **Shadows.** --shadow-window is for floating windows, the palette and dialogs. --shadow-pop is for menus, popovers, the toast, tooltips, compass cells and drag ghosts. Both are proposed tokens, not yet in resources/css/app.css.
- **Z ladder inside the app.** Window strip 6; FloatingWindow 20 plus its place in the stack; ChatPanel 30; Comment button 70; DropPreview 80; DropCompass 82; Sidebar 100; Menu and Popover 150; ReactionPicker 155; Scrim 160; Palette, KeyboardHelp and Dialog 170; Toast 180; DragGhost 190; Caption 195.
- **New token names for values the design hard-codes:**
  - --scrim: rgba(0,0,0,.18) light, .45 dark.
  - --mark-claude: #D97757.
  - --term-text #e9e6e2, --term-dim #a09a93, --term-out #d9d5d0, --term-error #f0a294.
  - --icon-sm 13, --icon-md 14, --icon-lg 16.
  - The code themes' palettes (see CodeView).

## The library tree

Every reusable component, nested as it composes. A name in brackets is a component listed elsewhere in the tree, used as a part here.

```text
Library
├── Primitives
│   ├── Icon
│   ├── ProgramMark
│   ├── Logo
│   ├── Dot
│   ├── Spinner
│   ├── Kbd (boxed | bare)
│   ├── TextLink (inline | quiet)
│   ├── Button (ghost | bordered | primary | quiet-to-primary; md | sm)
│   │   └── [Icon] leading
│   ├── Badge
│   ├── IconButton (md | sm | xs)
│   │   ├── [Icon]
│   │   └── [Badge]
│   ├── Chip (default | faint)
│   ├── ChipButton (xs | sm | md | lg; square | pill)
│   │   ├── [Icon] | [Dot] | [Spinner] leading
│   │   ├── label
│   │   └── count
│   ├── Status
│   │   ├── [Dot] | [Spinner] | [Icon]
│   │   └── word
│   ├── Avatar (agent | person | you | journal; sm | lg)
│   │   └── [ProgramMark] | initials | "J"
│   ├── AvatarStack
│   │   ├── [Avatar] × n
│   │   └── [Chip] "+N"
│   ├── Meter (sm | md | lg)
│   ├── Toggle
│   ├── SegmentedControl
│   │   └── SegmentedItem × n
│   ├── Tabs (inline | pagehead | filters)
│   │   └── Tab
│   │       ├── [Icon]
│   │       ├── label
│   │       ├── count
│   │       └── [IconButton] xs close
│   ├── Field (md | sm)
│   │   ├── FieldLabel
│   │   ├── Input | Textarea
│   │   ├── FieldHint
│   │   └── FieldError
│   ├── SearchField
│   │   ├── [Icon] search
│   │   └── Input
│   ├── GroupLabel
│   ├── EmptyState
│   │   ├── title
│   │   ├── text
│   │   └── [Button] action
│   ├── Card (raised | plain; active)
│   ├── Tooltip
│   ├── Scrim
│   ├── Toast
│   │   ├── text
│   │   └── [Button] Undo
│   ├── Popover
│   ├── Menu
│   │   ├── MenuGroup ([GroupLabel])
│   │   ├── MenuItem
│   │   │   ├── [Icon] | [Avatar] | spacer
│   │   │   ├── MenuItemLabel
│   │   │   ├── MenuItemSub
│   │   │   └── tick | [Kbd] bare
│   │   └── MenuSeparator
│   ├── ContextMenu → [Menu] at a point
│   ├── ListBox
│   │   ├── [MenuGroup]
│   │   └── [MenuItem] role=option
│   ├── Dialog (sm | md | lg)
│   │   ├── [Scrim]
│   │   └── DialogContent
│   │       ├── DialogHeader
│   │       │   ├── [Avatar] leading
│   │       │   ├── DialogTitle
│   │       │   ├── trailing slot
│   │       │   └── [IconButton] close
│   │       ├── DialogBody
│   │       └── DialogFooter
│   │           └── [Button] × n
│   ├── MenuTrigger (pill | field | who)
│   │   ├── [Avatar] | [AvatarStack] | [Icon]
│   │   ├── label + subline
│   │   ├── [Spinner]
│   │   ├── [Icon] caret
│   │   └── [Menu]
│   ├── SplitButton
│   │   ├── [Button] main
│   │   ├── [Button] chevron
│   │   └── [Menu]
│   ├── ListRow (single | two | grid | static)
│   │   ├── lead: num | [ProgramMark] | [Icon]
│   │   ├── NameBlock
│   │   │   ├── title
│   │   │   └── subline
│   │   └── trail: meta | [Status] | [Meter] | [Chip] | amount
│   ├── Splitter
│   └── ResizeGrip
└── Composites
    ├── Panel
    │   ├── PanelHeader ([Avatar] | [Icon], title, count, [IconButton] close)
    │   └── PanelBody
    ├── PanelToolbar
    │   └── [Tabs] | [Status] | [Button] × n
    ├── WindowHeader (strip | bar)
    │   ├── [Tabs] | [Icon] + title
    │   └── [IconButton] × n
    ├── QuietLine
    │   ├── [Icon]
    │   ├── text
    │   └── [Icon] chevron
    ├── Notice (centred | origin)
    ├── FactList
    │   └── term + value ([TextLink] | [ChipButton] xs)
    ├── ItemCard → [Card]
    │   ├── [Icon]
    │   ├── title + subline + [Meter]
    │   ├── [Status] | [Button]
    │   └── [IconButton] × n
    │   (variants: QuestionCard, DockedCard, DocumentBar)
    ├── ProcessCard → [Card]
    │   ├── ProcessHeader ([Icon], command, [Status], duration, [Button] × 2)
    │   └── ProcessOutput
    ├── UsageMeter (row | group | spend)
    │   ├── [Meter]
    │   ├── text
    │   └── [SegmentedControl]
    ├── SettingGroup → [Card]
    │   └── SettingRow
    │       ├── title + hint
    │       └── control: [Field] | [Toggle] | [SegmentedControl] | [Button] | [Status]
    ├── SettingsSection
    │   ├── SectionHead ([GroupLabel], [Button] Reset, [Toggle])
    │   ├── help line
    │   └── [SettingGroup]
    ├── Tree
    │   └── TreeItem ([Icon] chevron, [Icon], label)
    ├── MemoryList
    │   └── MemoryRow (weight, text, detail)
    ├── ActivityItem (row | line)
    │   ├── time, level glyph, [Icon], who + text
    │   └── FoundList
    ├── LineCommentable
    │   ├── Block | CodeLine
    │   ├── CommentButton ([Button] primary)
    │   ├── CommentBar ([Textarea], [MenuTrigger] field, [Button] × 2)
    │   └── CommentThread ([Status], replies, [Button] × 2)
    ├── DragGhost
    ├── DropPreview
    ├── DropCompass
    └── Caption
```

## The usage tree: the whole app

Every page, window and screen, and the library components it is built from.

```text
App
├── Shell (on every page)
│   ├── AppFrame
│   ├── Sidebar: Logo, NavItem × n (Icon, label), Tooltip (rail), ContextMenu (page menu)
│   ├── Topbar: Breadcrumb, MenuTrigger pill, IconButton × 4 (bell + Badge, rail, colour scheme, sign out), Menu (NotificationsMenu, colour scheme)
│   └── Toast
├── Home (page)
│   ├── AgentBar: MenuTrigger who (Avatar | AvatarStack) > ConversationMenu, Button members > Menu, IconButton add someone > Menu, Status, Button Stop, IconButton layouts > LayoutsMenu, IconButton add a window > AddWindowPopover, IconButton hide
│   ├── InfoBar: ChipButton sm × n, IconButton layouts
│   └── Desk: Pane (WindowHeader strip, Tabs, PaneTab), Splitter, FloatingWindow (WindowHeader bar, ResizeGrip), DropPreview, DropCompass, DragGhost, Caption, EmptyState
│       ├── Chat window: ChatColumn
│       │   ├── ChatLog: Notice, Message (ReplyLink, Avatar, TextLink, DocumentBar, JournalChip, SourcesLine (QuietLine, SourceItem), Reactions (ChipButton md pill), MessageActions (Button)), QuietLine, ProcessCard, TypingLine
│       │   ├── DockArea: Button Fold, DockedCard (ItemCard, Meter, Status, IconButton × 2)
│       │   ├── Composer: ComposerNotice (IconButton sm), Textarea, IconButton Attach, Chip model, ChipButton sm, Button Send
│       │   ├── ChatPanel: Panel > MemoryList | SequenceView
│       │   └── ReactionPicker: Popover, EmojiButton, IconButton
│       ├── Conversation window (a helper or group chat): ChatColumn, as above
│       ├── Tasks window: ListRow, Status
│       ├── Questions window: QuestionCard (ItemCard, Button)
│       ├── Plans window: ListRow, Meter
│       ├── Documents window: ListRow
│       ├── Helpers window: ListRow two, Status
│       ├── Project window: Tabs, Tree (TreeItem)
│       ├── Activity window: PanelToolbar (Tabs, Button > Menu), ActivityItem row
│       ├── Reminders window: EmptyState
│       ├── Memories window: MemoryList
│       ├── Task window, Plan window: DetailReader (FactList, TextLink, Status, Tabs)
│       ├── Document window: DocumentReader (Tabs, LineCommentable, Menu)
│       ├── File window: CodeView (Button > Menu, LineCommentable) | DocumentReader (Markdown)
│       ├── Terminal window: TerminalWindow (PanelToolbar, Status, Button × 3)
│       └── Sequence window: SequenceView (ChipButton md, StepList)
├── Tasks (page): PageShell (Tabs views, SplitButton), ListFilters (Tabs filters), ListRow, Status, EmptyState
│   ├── List view detail: TaskDetail (DetailReader, FactList, TextLink, Status)
│   └── Graph view: Tabs (plan picker), TaskGraph (Button pressed, GraphNode, GraphEdge, Panel side, FactList, ChipButton xs, GraphCompare)
├── Plans (page): PageShell (SplitButton), ListRow (Meter), EmptyState
│   └── PlanDetail: Tabs (Tasks | Graph), ListRow, TaskGraph, InPlaceDetail (Button Back, TaskDetail)
├── Documents (page): PageShell (SearchField, SplitButton), ListRow, EmptyState
│   └── DocumentReader: Button > Menu "Ask for feedback from", Tabs (Text | History | Links), LineCommentable (CommentButton, CommentBar, CommentThread), ListRow static
├── Sequences (page): PageShell (SplitButton), ListRow two, EmptyState (SplitButton)
│   ├── SequenceView: Button "Edit steps", ChipButton md (runs), StepList (StepMark, ChipButton "here")
│   └── SequenceEditor: Button × 2, DraftedBanner (Card, Avatar), StepEditor (Field sm × 3, IconButton × 3), Button "Add a step"
├── Profiles (page): PageShell, ListRow two
│   └── ProfileDetail: DetailReader, SettingGroup (SettingRow, Chip faint), GroupLabel
├── Accounts (page): PageShell (SplitButton), AccountRow (ListRow grid, ProgramMark, UsageMeter row, Status)
│   └── AccountDetail: DetailReader, SettingGroup (Field, Toggle, Status, Button), UsageMeter group | spend (Meter, SegmentedControl)
├── Settings (page): PageHeader, SettingsSection × n (GroupLabel, Button Reset, Toggle, SettingGroup, SettingRow, Field + FieldError)
│   └── ConnectProject: SettingRow block, CommandBox (Button × 2), ConnectStatus (Status, Spinner, Button), ProjectRow (Status, Button)
└── Screens over any page
    ├── CommandPalette: Dialog lg, SearchField, ListBox (MenuGroup, MenuItem, Kbd)
    ├── AddWindowPopover: Popover, SearchField, ListBox (MenuItem, Kbd)
    ├── KeyboardHelp: Dialog sm, Kbd boxed
    ├── CreateDialog: Dialog md, Field × n, DraftedBanner, Button × 3
    ├── GuidedChatDialog: Dialog md, Avatar, GuideDots, AgentQuestion, UserAnswer, ChipButton lg pill, Field, Button, Status, DraftSummary (Card)
    ├── Menus: NotificationsMenu, LayoutsMenu, ConversationMenu, MembersMenu, SplitButton menu, code theme menu (all Menu)
    └── ContextMenu: Menu, built by what is under the pointer
```

## Declared layout or its own component

Plan 53 (doc 89) lets the backend declare a page or window from typed layout parts, with no frontend code for that page. Those parts are:

- the wire tags box, text, icon, body, action, form, field, collection, tabs, menu, disclosure, notice and progress;
- the recipes ListPage, DetailPage, PublicationPage, SettingsRow and RecordCard;
- a nativeSlot, for a registered native component inside a declared page.

Doc 89 keeps some things native: the shell's pane tabs, the command palette, file selection, rich editing, streaming, the terminal and authentication.

The rule used below: a page is declared when every part maps to those tags and its changes are request and response. It needs its own component when it holds live state, drag, a canvas or text selection. A declared page can still mount one native part through a nativeSlot.

| Page, window or screen | Verdict | Why |
|---|---|---|
| Shell (Sidebar, Topbar, AgentBar, InfoBar) | Native | Shell contribution records, not a page. The agent bar shows live state, and the pill and who trigger open live menus. Pages contribute nav items as records. |
| Home and the Desk | Native | The pane grid, docking, floating, drag and FLIP motion are local interaction with no wire tag. Doc 89 keeps pane tabs native. |
| Chat window and conversation windows | Native | Streaming messages, typing, the composer with drafts, reactions, dragging a document, the panel over the chat. |
| ChatPanel: memories | Declared | A collection list of rows with a disclosure fold for the detail. It mounts inside the native chat as a declared layout. |
| ChatPanel: sequence | Declared | Same as the SequenceView below. |
| Tasks window, Plans window, Documents window, Helpers window | Declared | The Window recipe with a collection list: number, title, a badge text for the status, progress for plans. Opening an item is an action destination. |
| Questions window | Declared | RecordCard: icon, title, badge, timestamp, and the Answer action as a local intent that focuses the chat's composer. |
| Reminders window, Memories window | Declared | A collection list, or notice empty. |
| Task window, Plan window | Declared | DetailPage: header, facts with link actions, tabs. The plan's Graph tab mounts TaskGraph through a nativeSlot. |
| Activity window | Native | A live feed that updates while open, with level tabs and an in-chat level menu. It could be declared as collection.log if refreshing it on a poll were acceptable; the live feed is the reason it is native. |
| Project window | Native | A tree with roving focus, open and close by arrow keys, and opening as a window. There is no tree tag; collection has no nesting. |
| Document window | Declared, with one native slot | PublicationPage: header, tabs, trusted body. Commenting on selected lines needs text selection, a floating button and a composer, so LineCommentable is a nativeSlot. |
| File window (CodeView) | Native | File viewing with line selection, comment anchors and colour themes. Doc 89 keeps file selection native. A Markdown file opens as the declared document reader. |
| Terminal window | Native | Doc 89 keeps the terminal native: live keys and streamed output. |
| Sequence window | Declared | Same as the SequenceView below. |
| Tasks page, List view | Declared | ListPage: header with a count, the filters as tabs, a collection list, a pager. The detail is a DetailPage with facts and link actions. The split button composes action and menu. |
| Tasks page, Graph view | Declared, with one native slot | The header and plan picker are tabs. The graph is an SVG layout with a lit chain, bottlenecks, a before-and-after compare and auto-scroll, which no tag represents. TaskGraph is a nativeSlot. |
| Plans page | Declared, with one native slot | ListPage plus DetailPage with tabs. The Graph tab is the TaskGraph nativeSlot. A task opened in a plan becomes its own address, with a Back action to the plan, instead of an in-place swap held in local state. |
| Documents page | Declared, with one native slot | ListPage with a search field. The reader is the PublicationPage with the LineCommentable nativeSlot. |
| Sequences page: list and viewer | Declared | ListPage with two-line rows. The viewer is a header with an Edit action; runs are a segmented field or tabs; steps are a collection timeline with badges for the state; "here" is a badge text. |
| Sequences page: editor | Native | Reordering steps by drag, and moving focus with the step while it moves, need local state. A declared form could add, remove and move steps with one server round trip per move, but dragging cannot be declared. Keep SequenceEditor native, registered as a nativeSlot in the declared page. |
| Profiles page | Declared | ListPage with two-line rows. A read-only DetailPage: facts, badge texts for the models, text.code for scripts. |
| Accounts page | Declared | ListPage with a row of mark, name and type text, a progress for usage, and a badge for sign-in. The detail is facts, a text field, a toggle field, a segmented field for the period, and progress rows. Sign in is an action to the sign-in flow, which stays native as authentication. |
| Settings page | Declared | SettingsRow recipes: label, help, a changed flag, a form with a field (text or toggle) and a notice for the error; a Reset action per group. |
| Settings: Connect a project | Declared, live part refreshed | text.code for the command, a secret field for the masked token, a Copy action as a local intent, a notice for the state. "Waiting, then connected" is shown on the next refresh. A live status would need a small nativeSlot. |
| CommandPalette | Native | Doc 89 keeps it native. Pages add commands as records. |
| AddWindowPopover, KeyboardHelp | Native | Part of the shell's window system, filled from the registered windows and shortcuts. |
| CreateDialog | Declared | disclosure.dialog with a form: registered submission, fields, footer actions. Its focus trap is the dialog variant's. |
| GuidedChatDialog | Native | A short chat with suggested answers, a typed answer, a drafting state and a draft that opens the form filled. Its turn-by-turn state is local. It could become declared if each answer were a server form step, but the chat feel and the draft hand-off would be lost. |
| Menus on pages (SplitButton, Ask for feedback, code theme) | Declared where the page is | The menu tag with dropdown items and permitted operations. Shell menus stay native. |
| ContextMenu | Native | Built from what is under the pointer across shell, panes and chat. Pages may contribute items as records. |

In short:

- **Declared:** every list, detail, settings and record page, and the simple windows.
- **Native:** the shell, Home and the Desk, the chat, the terminal, the code view, the project tree, the live activity feed, the guided chat and the sequence editor.
- **Mounted as nativeSlots inside declared pages:** the task graph and line comments.

## Primitives

### Icon

- **For:** every pictogram. An SVG sprite, stroke 1.4, round caps, no fill.
- **Props:** name, size sm 13, md 14 or lg 16 (default 16). It is always aria-hidden: the label goes on the control that holds it.
- **Used:** everywhere.

### ProgramMark and Logo

- **ProgramMark:** the agent's program. Claude is a spark in --mark-claude; Codex is a knot in --text; anything else is the users icon. Sizes 11 (in a small avatar), 16 (rows, large avatar).
- **Logo:** a 20px square, radius 6, --brand fill, a "J" in --on-brand at --text-meta. It appears only in the BrandRow.
- **Used:** Avatar, AccountRow, BrandRow.

### Button

- **For:** a text action.
- **Props:** variant, size, icon (leading slot), pressed, disabled. Slot: the label.
- **Variants:**
  - ghost (default): no border, --text-2.
  - bordered: --border-2 border, --bg fill, --text.
  - primary: --brand fill and border, --on-brand text.
  - quiet-to-primary, for Send: --border-2 border and --text-3 until a prop says there is content, then primary. This replaces the parent class the prototype uses.
- **Sizes:**
  - md: 28px high, padding 0 11, --text-field.
  - sm: 24px high, padding 0 9, --text-small.
  - Both: radius --radius-button, a 14px icon, gap 6, nowrap. Every button in the design is sm; md is declared only.
- **States:**
  - Hover: --hover fill and --text. On primary, brightness 1.12 and the fill stays --brand.
  - Pressed (aria-pressed): --sel fill, --border-3 border, --text.
  - Disabled: opacity .45 and no pointer events. Put the disabled reason on a wrapping Tooltip, because a disabled button takes no hover.
  - Focus: the ring at offset 1.
  - Not drawn: loading and danger.
- **Keyboard and ARIA:** a native button; Enter and Space work. Pressed uses aria-pressed.
- **Motion:** background over 120ms.
- **Used:** Send, Answer, Open, Stop, dialog footers, page tools (Show bottlenecks, Apply these waits), settings (Reset, Sign in), the terminal (Interrupt, Restart, End), the sequence editor, Undo in the toast.

### IconButton

- **For:** an icon-only action.
- **Props:** icon, label (required; it becomes aria-label, and Tooltip text rather than a title attribute), size, pressed, disabled, badge (a slot for Badge), haspopup (menu or dialog).
- **Sizes:**
  - md: 26 × 26, icon 14 (13 in the topbar, tab strip and InfoBar).
  - sm: 20 × 20, icon 14. It replaces the inline 20px style on "Stop replying", "Stop answering", "Not now" and the dock buttons.
  - xs: 18 × 18, icon 13, for a tab's close.
  - All: radius --radius-control.
- **States:**
  - Rest: transparent, --text-3.
  - Hover: --hover and --text.
  - Pressed: --sel and --text.
  - Disabled: opacity .4.
  - Focus: the ring at offset 1.
- **Keyboard and ARIA:** a native button with aria-label; menu triggers add aria-haspopup.
- **Used:** topbar, agent bar, window headers, tab close, dock cards, ChatPanel close, the sequence editor's move and remove, the composer's Attach (today a span; see the gaps).

### TextLink

- **For:** an action that reads as part of the text.
- **Look:** a button or link in --text, underline in --border-3, offset 2px. Hover --text-2 on the quiet kind.
- **Variants:** inline (task numbers in a message or a fact list), quiet (the ReplyLink: --text-badge, --text-3). It replaces a.lk, button.lk, the JournalChip link and the reply link.
- **Keyboard and ARIA:** a native button when it acts, an anchor when it goes somewhere. Ring at offset 2.

### Kbd

- **For:** a shortcut.
- **Variants:**
  - boxed (KeyboardHelp): mono 11, padding 0 5, radius 4, border at 28% of the text colour.
  - bare (MenuItem trailing slot): mono 11, --text-3.
- **ARIA:** the kbd element; the trailing menu shortcut is aria-hidden when the item's label already names it.

### Chip

- **For:** a small static label.
- **Look:** inline-flex, gap 4, --text-badge, line-height 17, padding 0 6, radius --radius-badge, --border-2 border, --text-2.
- **Variants:** faint (--line border, --text-3).
- **Used:** the model "Opus" in the composer, the "To" recipient in a CommentThread, Profiles' model lists.

### ChipButton

- **For:** a chip that acts or toggles. It folds seven drawings into one:
  - .rx, the reaction;
  - .run, the sequence run;
  - .wchip, the InfoBar window chip;
  - .bchip, a card docked beside the composer;
  - .gchip, a suggested answer;
  - the graph panel's .lst buttons;
  - the sequence "here" pill.
- **Props:** label, icon or dot (leading slot), count (trailing, tabular numbers), pressed, tone (quiet --text-3 or normal --text-2), shape, size.
- **Sizes:** xs 20 (graph links), sm 22 (window and docked chips), md 24 (runs, reactions, here), lg 28 (suggested answers).
- **Shapes:** square, with radius --radius-seg 5 at 22 and --radius-button 7 at 24; pill, with radius 999 (reactions, suggested answers).
- **States:**
  - Rest: --line border, transparent or --bg fill. The lg size uses --border-2.
  - Hover: --border-3 and --text (lg also takes a --hover fill).
  - Pressed: --sel fill with --border-3; the reaction you added takes a --brand border.
  - Selected (the active window's chip): --text with --border-3.
  - Focus: the ring at offset 1. The suggested answers have none today, and must get one.
- **Keyboard and ARIA:** a native button. A toggle uses aria-pressed. A reaction's aria-label reads "👍 2, including yours".
- **Used:** InfoBar, Composer row, Reactions, SequenceView runs, GuidedChatDialog, TaskGraph side panel.

### Badge

- **For:** a count on an IconButton.
- **Look:** absolute at top -2, right -2; min-width 14, height 14, radius 7; --brand fill, --on-brand text; --text-meta, weight 600, padding 0 3.
- **Props:** count, max (default 99, shows "99+"). It hides at 0.
- **ARIA:** the number is repeated in the button's label ("Notifications, 2 unread").
- **Used:** the bell.

### Dot and Spinner

- **Dot:** 6px round.
  - Tones: default --text-4, brand, solid --text-3.
  - hollow: 7px, transparent, with a 1.5px --text-4 ring.
- **Spinner:** 11px, a 1.5px ring at 30% of currentColor with a solid top; it turns once per 0.9s, linear (3s under reduced motion).
- **ARIA:** both are aria-hidden; the Status word carries the meaning.

### Status

- **For:** a state as a mark plus a word.
- **Look:** inline-flex, gap 6, --text-small, --text-3, nowrap; strong is --text at weight 500.
- **Props:** state, label (overrides the word), strong, live (wraps it in role status).
- **States and marks:**
  - Work: Working (Spinner, --text-2); Done (tick 14); Open (hollow Dot); Waits on you (brand Dot, strong); Testing (solid Dot); Failed (alert icon, --danger).
  - Accounts: Signed in (solid Dot); Not signed in and Expired (hollow Dot).
  - Commands: Waiting to start (hollow), Running (Spinner), Passed (tick), Failed.
  - Terminal: Connecting and Restarting (Spinner), Live (brand Dot), Ended (hollow).
  - Agent bar: Stopped and Interrupted (hollow Dot).
- **Sizes:** in a ListRow it takes a fixed 112px column.
- **Used:** rows, the agent bar, dock cards, ProcessCard, TerminalWindow, TaskGraph side panel, ConnectProject.

### Avatar

- **For:** a participant. Agents are rounded squares holding their ProgramMark; people are circles with initials. The journal is a square holding "J".
- **Props:** participant (kind agent, person, you or journal; program; initials; name; role), size, label (needed only when the avatar stands alone).
- **Sizes:**
  - sm 16: radius 4, --border-2 border, mark 11. A person is a circle with a --border-3 border, --raised fill and initials in --text-meta 600 --text-2.
  - lg 26: radius 8, --bg fill, mark 16. A person's initials are in --text-badge.
  - It replaces .av, .avs, .ini, .ini.lg and the journal mark .jm.
- **ARIA:** aria-hidden beside a visible name; otherwise aria-label is "Name · role". Today there is only a title.
- **Used:** MenuTrigger who, MessageHead, menus, comment threads, GuidedChatDialog, the drafted banner, TypingLine.

### AvatarStack

- **For:** a group's members.
- **Look:** lg avatars overlapping by -7px, each with a 2px --bg ring.
- **Props:** members, max (default 4), overflow (a "+N" sm Chip, not drawn today).
- **Used:** the AgentBar in a group chat.

### Meter

- **For:** a thin share bar.
- **Props:** value (0 to 100), size, width (default 56), label.
- **Sizes:** sm 4 (radius 2), md 5 (radius 3), lg 6 (radius 3).
- **Look:** track --sel, fill --brand. In a selected row the track becomes --border-3.
- **ARIA:** role meter with aria-valuenow, valuemin and valuemax, and an aria-label ("72% used"). Today only the account row has a label, as role img.
- **Used:** Plans rows (sm, 56), dock cards (sm, 140), AccountRow (md, 84), UsageMeter (lg, 220).

### Toggle

- **For:** on or off.
- **Look:** 30 × 18, radius 9. Off track --border-3, on track --brand. A 14px knob inset 2px, --bg; when on, --on-brand at left 14.
- **Props:** checked, label, disabled (opacity .45, not drawn today).
- **Keyboard and ARIA:** role switch with aria-checked and aria-label; Space and Enter. Ring at offset 2.
- **Motion:** the knob moves over 120ms.
- **Used:** Settings group switches, Make default on an account.

### SegmentedControl

- **For:** one of a few short settings.
- **Look:**
  - Container: inline-flex, --border-2 border, radius 7, padding 2.
  - Buttons: --text-small, --text-3, padding 2 10, radius --radius-seg. Pressed: --sel and --text.
- **Props:** modelValue, items, label.
- **Keyboard and ARIA:** role radiogroup with role radio and aria-checked (today a group of aria-pressed buttons). Left and Right move and choose. Ring at offset -2.
- **Used:** Theme, Activities in the chat, the per-kind chat level, the Spent period.

### Tabs and Tab

- **For:** choosing a view. It folds the pane strip tabs (.tab), the page tabs (.ftab), the Activity filters and the Project Files and Journal row into one.
- **Props:**
  - Tabs: modelValue, label, line (brand, or quiet for panes that are not active), gap (12 in a strip, 16 on pages), variant (inline with margin 10 0 6 and a bottom --line; pagehead, 52px high with no border; filters, padding 0 12 with a bottom --line).
  - Tab: value, label, icon, count, closable, draggable.
- **Look:**
  - Text: --text-badge, letter-spacing .03em, --text-3, padding 7 0. Hover --text-2.
  - Selected: --text with an inset 1px bottom line; --brand when it is an active pane or a page, --border-3 otherwise.
  - Min-width 56; a long label shrinks and ellipsises.
- **Keyboard and ARIA:**
  - role tablist, tab with aria-selected, and tabpanel with aria-controls (the last two are missing today).
  - Roving tabindex. Left and Right move and choose, wrapping; Home and End.
  - A closable tab: Delete or Backspace closes it, and so does a middle click.
  - Ring at offset -1.
- **Motion:** colour over 120ms.
- **Used:** PaneStrip, PageHeader views, ListFilters, PlanDetail, DocumentReader, ActivityPanel, ProjectTree, the graph's plan picker.

### Field

- **For:** typed input. It folds .field, .fld, the guide input and the sequence step input into one.
- **Parts:** FieldLabel, Input or Textarea, FieldHint, FieldError.
- **Props:** label, hint, error, size, width, multiline, rows.
- **Sizes:** md 30, padding 0 10; sm 28, padding 0 9 (the sequence editor). Textarea minimum 70, vertical resize.
- **Look:** --border-2 border (one token instead of today's two), radius --radius-field, --bg fill, --text-field. The label above is --text-badge --text-3, 4px gap.
- **States:**
  - Focus: the ring at offset 1.
  - Invalid: --danger border, with FieldError below in --text-small --danger, 5px gap. The typed value is kept.
- **Keyboard and ARIA:** aria-invalid, and aria-describedby pointing at the hint and error. In a dialog form, Enter submits from a one-line field, and Command or Control with Enter from a textarea.
- **Used:** settings, account name, create dialogs, guided answer, sequence editor, Documents search.

### SearchField

- **For:** filtering a list from a field at its top.
- **Look:** a row with a 14px search Icon and a borderless input, padding 9 12, bottom --line; placeholder --text-4.
- **Props:** value, placeholder, controls (the list's id), activeDescendant.
- **Keyboard and ARIA:** the input holds focus; Up and Down move the active row; Enter runs it; Escape closes. Link it with aria-controls and aria-activedescendant (missing today).
- **Used:** CommandPalette, AddWindowPopover, Documents search (as a page Field, which has no behaviour yet).

### GroupLabel

- **For:** a heading for a group.
- **Look:** --text-group, caps, letter-spacing .06em, weight 600, --text-3. Margin by place: section 18 0 8; menu 8 8 3; graph 0.
- **Replaces:** .sec, .mgroup and .ghead.

### EmptyState

- **For:** nothing here yet.
- **Props:** title, text, fill (covers its parent, absolutely, for an empty Desk). Slot: action.
- **Look:** padding 48 24, centred, --text-empty, --text-3; the title in --text-2 weight 500, 4px above the text; the action is a bordered sm Button 12px below. No icon.
- **Used:** every empty list and detail, the Desk ("Nothing on Home"), memories, reminders, graphs, sequences (with a SplitButton).

### Card

- **For:** a bordered surface. Its shape underlies QuestionCard, DockedCard, ProcessCard, DocumentBar, the TaskGraph side panel, CommentBar, CommentThread, DraftSummary, the drafted banner and SettingGroup.
- **Props:** tone (raised: --raised; plain: --bg), active (--border-3 instead of --line), radius (card 12, or field 8 for bars and banners), padding (md 10 12, sm 8 8 8 12), draggable, interactive.
- **States:** hover on an interactive card: --border-3. Focus: the ring at offset 1. Lifting (a drag): scale .96 and opacity .45 over 180ms.

### Tooltip

- **For:** a short label on hover and on keyboard focus. It replaces the title attributes.
- **Look:** --raised, --border-2 border, radius 6, padding 3 8, --text-small, --text, --shadow-pop, nowrap. Side: right of the rail, otherwise above.
- **Props:** text, side, delay (300ms in, 0 out; the design has no delay).
- **Keyboard and ARIA:** it shows on focus-visible, hides on Escape, and is linked with aria-describedby. It never holds the only name of a control.
- **Used:** sidebar rail, every IconButton, disabled buttons (the reason), meters (both numbers).

### Toast

- **For:** an Undo after an action. The design's rule is that a toast exists to offer Undo; a message with nothing to undo shows no Undo button.
- **Look:** right 16, bottom 104 (above the composer), width 360; --raised, --border-2 border, radius --radius-menu, padding 9 12, --text-small --text-2, --shadow-pop; a flex row with gap 10 and a bordered sm Undo Button.
- **Props:** text, undo (optional).
- **Behaviour:**
  - One at a time: a new toast replaces the old one.
  - It closes after 6000ms. Undo closes it and runs the undo.
  - It closes when the step or page changes.
- **ARIA:** role status.
- **Motion:** none today; propose 180ms in from 8px below.
- **Used:** close window, save layout, back to just the chat, undocked, created, disconnected, applied waits, stopped.

### Scrim

- **For:** the backdrop under a modal Dialog.
- **Look:** absolute inset 0, --scrim. A click on it closes the dialog.

### Popover

- **For:** an anchored surface that is not modal and has no scrim.
- **Look:** --raised, --border-2 border, radius --radius-menu, --shadow-pop.
- **Placement:** 4px below the anchor, aligned to its left or right edge; or at a point. It is clamped 6px inside the app and flips above when it would pass the bottom.
- **Props:** anchor or point, align, width, label.
- **Keyboard and ARIA:** role dialog with aria-label. Escape and an outside press close it, and focus returns to the trigger.
- **Used:** AddWindowPopover, ReactionPicker.

### Menu

```text
Menu
├── MenuGroup (header)
├── MenuItem
│   ├── leading: Icon 14 | Avatar sm | spacer 14
│   ├── MenuItemLabel + MenuItemSub
│   └── trailing: tick | Kbd bare
└── MenuSeparator
```

- **For:** a list of actions from a trigger.
- **Props:** items (head, sep, or an item with label, sub, icon or avatar, checked, keys, disabled, run), anchor or point, trigger, dropTarget.
- **Look:**
  - Menu: min-width 220, max 330, --raised, --border-2 border, radius --radius-menu, padding 6, --shadow-pop.
  - MenuItem: padding 6 8, gap 9, radius --radius-control, --text-small, --text-2; its sub line is --text-badge --text-3 with an ellipsis.
  - MenuGroup: a GroupLabel. MenuSeparator: 1px --line, margin 4 2.
- **States:**
  - Hover: --hover and --text.
  - Active (Enter runs it), shown on focus-visible and on the keyboard's row: --sel with an inset 2px --focus ring.
  - Disabled: opacity .45; skipped by the arrow keys.
  - Drop target (a document held over a conversation row): the active look.
- **Placement:** as Popover.
- **Keyboard and ARIA:**
  - role menu with menuitem. A ticked item is menuitemradio or menuitemcheckbox with aria-checked (only drawn today).
  - It opens on the first enabled item. Down and Up move, wrapping; Home and End; type-ahead (the last two are to add).
  - Enter and Space run the item; Escape closes; Tab closes and moves on.
  - After an item runs, focus goes back to the trigger.
- **Motion:** none.
- **Used:** NotificationsMenu, the colour scheme, LayoutsMenu, ConversationMenu, MembersMenu, add someone, a member's menu, the sidebar page menu, the chat level, SplitButton, the code theme, Ask for feedback, the comment recipient picker.

### ContextMenu

- **For:** a Menu at the pointer, built by what is under it.
- **Targets and their items:**
  - Document bar: Open; Hand it to an agent.
  - Graph node: Show its waits; Open task.
  - Agent message: quick reactions; More reactions; Reply; Copy text; the agent's memories; Open in its own window.
  - List row on Home: Open; Open in its own window; Open its chat.
  - Tab, window or pane: Fill Home or Restore; Float; Dock left, right or bottom; Close.
  - Docked card: Open; Move beside the composer or under the conversation; Undock.
  - Empty desk: Add a window here; Make the chat a window; Save layout; Back to just the chat.
  - Sidebar item: Open the page; Open as a window on Home; Show or Hide the page names.
- **Rules:** it does not open over selected text in a chat, code, document or terminal (so Copy works), nor over fields.
- **Keyboard:** the Menu key or Shift+F10 opens it at the focused element.

### ListBox

- **For:** a list with one active option driven from a SearchField.
- **Parts:** MenuGroup and MenuItem with role option and aria-selected.
- **Look:** max-height 340 (popover) or 420 (palette), padding 6. The active row uses the MenuItem active look and scrolls into view.
- **Used:** CommandPalette, AddWindowPopover.

### Dialog

```text
Dialog
├── Scrim
└── DialogContent (role dialog, aria-modal)
    ├── DialogHeader
    │   ├── leading (Avatar, optional)
    │   ├── DialogTitle
    │   ├── trailing (GuideDots, optional)
    │   └── IconButton close
    ├── DialogBody (scrolls)
    └── DialogFooter
        ├── secondary actions (left)
        ├── spacer
        └── Cancel + primary action
```

- **For:** a modal task.
- **Props:** open, title, size, placement (top 64, top 72, or centred), header (a boolean or a slot), initialFocus, returnFocus.
- **Sizes:** sm 460 (KeyboardHelp), md 540 (CreateDialog), lg 560 (CommandPalette). The max height is the frame minus 96.
- **Look:**
  - Shell: --raised, --border-2 border, radius --radius-card, --shadow-window.
  - Header: 48px high, padding 0 8 0 16, bottom --line; the title in weight 600 takes the free width.
  - Body: padding 14 16. Footer: padding 10 12 10 16, top --line.
- **Keyboard and ARIA:**
  - role dialog, aria-modal true, aria-labelledby on the title.
  - Tab and Shift+Tab loop inside it. Escape and a click on the Scrim close it.
  - It opens on its first field, or on the dialog itself. On close, focus returns to the opener.
  - Today only CreateDialog does all of this; the palette and KeyboardHelp must get it too.
- **Motion:** none today; propose an opacity fade with scale from .98 over 180ms.
- **Used:** CreateDialog, GuidedChatDialog, CommandPalette (no header, top 72), KeyboardHelp (centred, no footer).

### MenuTrigger

- **For:** a button that shows what is chosen and opens a Menu. It folds the Pill, the Picker, the WhoButton and Button with a caret into one.
- **Props:** variant, avatar, label, subline, caret (always), dropTarget.
- **Variants:**
  - pill: 26px high, radius 999, --border-2 border, --raised fill, --text-small --text-2, padding 0 10 0 8, gap 7. It holds an Icon or AvatarStack, a name, a Spinner while the agent works, and the caret. Hover: --text with --border-3.
  - field: 24px high, radius 7, --line border, weight 500, an sm Avatar, the name and the caret (the comment recipient).
  - who: bare; a lg Avatar or an AvatarStack, a name with a subline (--text-badge --text-3, max 340, ellipsis) and the caret; padding 3 6 3 3, radius 8. Hover --hover. Drop target: --hover with a 2px --focus outline at offset 1.
- **Keyboard and ARIA:** aria-haspopup menu, aria-expanded. Enter, Space and Down open it.
- **Used:** Topbar (pill), AgentBar (who), CommentBar (field).

### SplitButton

```text
SplitButton
├── Button bordered sm (main: Icon plus + label)
├── Button bordered sm (chevron: Icon caret)
└── Menu
    ├── MenuGroup (the create title)
    ├── MenuItem plain way (plus)
    └── MenuItem agent way (chat, sub "Agent 1 asks three short questions and drafts it")
```

- **For:** a create action whose second way sits behind a chevron.
- **Props:** label, icon, hint (the plain way, as a Tooltip), noun, items, disabled (both halves; not drawn).
- **Look:** inline-flex. Both halves: --border-2 border, --bg fill, --text. The main half has radius 7 0 0 7; the chevron has 0 7 7 0, no left border, padding 0 6. Hover --hover per half. Each half has its own ring, raised above its neighbour with z-index on focus.
- **Keyboard and ARIA:** the chevron has aria-haspopup menu and aria-label "More ways to create a <noun>".
- **Used:** the headers of Tasks, Plans, Documents, Accounts and Sequences, the empty Sequences state, and the palette (as two commands).

### ListRow

```text
ListRow
├── lead (num 40 | ProgramMark 16 | Icon)
├── NameBlock
│   ├── title (ellipsis, dim)
│   └── subline (small, one line)
└── trail (fixed width: meta 92 | Status 112 | Meter | Chip | amount)
```

- **For:** one row of a list.
- **Props:** variant, selected, static, dim. Slots: lead, title, subline, trail.
- **Variants:**
  - single: padding 7 12.
  - two: padding 8 12, with the NameBlock subline in --text-small --text-3.
  - grid, for accounts: columns 16, minmax(0,1fr), 84 and 96, gap 12.
  - static: not interactive, cursor default (history revisions, the Links row, "No runs yet").
- **Look:** full width, gap 10, --text-field, bottom --line. Every trailing cell has a fixed width so the cells line up from row to row.
- **States:** hover --hover; selected --sel; focus the ring at offset -2. No disabled, loading or drag state.
- **Keyboard and ARIA:**
  - A list that keeps a selection is a listbox with options (aria-selected). A list of links uses aria-current. Today buttons carry aria-selected.
  - Up and Down move in a listbox; Enter opens.
- **Used:** the Tasks, Plans, Documents, Accounts, Profiles, Sequences and Helpers pages and windows, plan task rows, and document history.

### Splitter

- **For:** the shared edge between two panes.
- **Props:** axis, ratio, span (px).
- **Look:** an 8px hit strip centred on the edge. A 2px line shows on hover, on focus and while dragging: --border-3, or --focus when focused from the keyboard. Cursor col-resize or row-resize.
- **Limits:** the ratio is clamped so that each pane keeps at least 140px (today 10 to 90% plus a separate 140px floor, which leaves a dead zone).
- **Keyboard and ARIA:** role separator with aria-orientation, aria-valuenow, valuemin and valuemax, and aria-label "Resize panes"; tabindex 0. The arrows along its axis move it 5%; a double click resets it to 50%. A pointer drag starts after 5px.
- **Motion:** the line fades in over 120ms; the panes do not glide while it is dragged.

### ResizeGrip

- **For:** resizing a FloatingWindow.
- **Look:** 16 × 16 at the bottom right; a 7 × 7 corner mark with 1.5px right and bottom borders in --border-3, 4px from the corner; cursor nwse-resize.
- **Limits:** minimum 260 × 180, at most the Desk.
- **Keyboard:** none today; see the gaps.

## Composites: the shell

### AppFrame

```text
AppFrame
├── Sidebar
├── Main
│   ├── Topbar
│   └── HomeView (AgentBar, InfoBar, Desk) | PageShell
├── OverlayLayer (Menu, ContextMenu, Popover, Dialog, CommandPalette, KeyboardHelp)
└── Toast
```

- **For:** the whole app.
- **Props:** theme (light or dark; the dark class), railed.
- **Look:** a flex row that fills the viewport (760 high in the design), --bg, --text, body 13px, overflow hidden, position relative. In the design it has a 1px --border-2 border and radius 12; the built app has none.
- **Rule:** overlays are positioned against the frame, not the main area, so they can cross the sidebar and the panes.
- **Desk height:** the frame minus the topbar (40), the agent bar (54, when shown) and the InfoBar (30, when shown). Propose that the InfoBar overlays the Desk instead, so the Desk never jumps.

### Sidebar

```text
Sidebar
├── BrandRow
│   ├── Logo
│   └── "Journal" (hidden in the rail)
└── Nav "Pages"
    └── NavItem × n
        ├── Icon 16
        ├── label (hidden in the rail)
        └── Tooltip (rail only)
```

- **Props:** pages, current, railed.
- **Look:**
  - Sidebar: width 216, or 56 in the rail; padding 12 8, gap 1, --side, right border --line.
  - BrandRow: padding 2 8 14, weight 600.
- **NavItem:**
  - Look: padding 6 8 (in the rail 7 0, centred), gap 9, radius 7, --text-3. Hover --hover and --text-2.
  - Current (aria-current page): --sel, --text, weight 500, and a 2px --brand bar at left -8 from top 8 to bottom 8, radius 2.
  - Focus: the ring at offset -2.
- **Keyboard and ARIA:** nav with aria-label "Pages"; aria-label on every item. Up and Down move with a roving tabindex (to add; today every item is a tab stop). A right-click or the Menu key opens the page menu.
- **Motion:** the width changes over 240ms.
- **Used:** every page. The rail toggle is in the Topbar and in the palette.

### Topbar

```text
Topbar
├── Breadcrumb
│   ├── brand square 8
│   ├── "Journal"
│   ├── "/" (aria-hidden)
│   └── page title (aria-current page)
└── TopbarActions
    ├── MenuTrigger pill (Home, when the agent bar is hidden)
    ├── IconButton bell + Badge
    ├── IconButton rail
    ├── IconButton colour scheme
    ├── "You"
    └── IconButton sign out
```

- **Look:** min-height 40, bottom --border, padding 0 10 0 16, --text-2. The actions sit at the right, gap 4. The page title is --text at weight 500.
- **Behaviour:** the pill shows the agent bar again and moves focus to its who trigger.
- **Gap:** Sign out has no action in the design.

### AgentBar

```text
AgentBar
├── MenuTrigger who > ConversationMenu
├── Button "N in this chat" > MembersMenu (groups only)
├── IconButton add someone > Menu
├── Status (live)
└── AgentBarActions
    ├── extra buttons (Terminal ...)
    ├── Button bordered sm Stop <agent> (not in groups)
    ├── IconButton layouts > LayoutsMenu
    ├── IconButton add a window > AddWindowPopover
    └── IconButton hide the bar
```

- **Props:** conversation, members, state, actions.
- **Look:** 54 high, padding 0 12, bottom --line, gap 8, overflow hidden.
- **States:**
  - Working: Spinner and the state words.
  - Waiting: the state ends in "waits for you" with a hollow Dot (Stopped, Interrupted, Ended).
  - After Stop, the Stop button is disabled and a Toast offers Undo.
- **Keyboard and ARIA:** the Status is role status, so a change is announced (to add).
- **Used:** Home.

### InfoBar

```text
InfoBar
├── label "Floating"
├── ChipButton sm × n (Icon 13, title, " · bar only")
├── spacer
└── IconButton layouts (when the agent bar is hidden)
```

- **For:** finding floating windows, and Layouts when the agent bar is hidden. It shows only when it has something.
- **Look:** min-height 30, bottom --border, padding 0 5 0 14, --text-small, --text-3, gap 8.
- **Chips:** the active window's chip is selected. Their tooltip is "Bring to front", or "Show the whole window" when the window is minimised.

### CommandPalette

```text
CommandPalette (Dialog lg, top 72, no header)
├── SearchField "Type a command, a page, a window, a task, a document or a file"
├── ListBox
│   ├── MenuGroup × n (Commands, Pages, Windows, Conversations, Go to, Ask)
│   └── MenuItem role=option × n (Icon, label, sub, Kbd bare)
└── footer "↑ ↓ choose · Enter runs it · Esc closes"
```

- **For:** every command by name.
- **Props:** commands (from every section, each with its group), query.
- **Look:**
  - Dialog: width 560, radius --radius-card, --shadow-window.
  - List: max-height 420. Footer: --text-meta --text-3.
- **Behaviour:**
  - The match is a substring of the label and sub, case-insensitive; highlight the match (to add).
  - "Go to" and "Ask" appear only after typing. Ask sends the text to the main agent.
  - It never empties, because Ask is always there.
- **Keyboard and ARIA:**
  - Command or Control with K toggles it (by key code). Up and Down move; Enter runs; Escape closes.
  - It is a Dialog with aria-modal and a focus trap (to add). The input carries aria-activedescendant.
- **Motion:** none.

### AddWindowPopover

```text
AddWindowPopover (Popover 320)
├── SearchField
├── ListBox (max-height 340)
│   └── MenuItem role=option × n
│       ├── Icon
│       ├── label + sub ("open · brings it forward")
│       └── Kbd bare (Option 1, Option 2)
└── footer "Enter opens it floating · drag a row onto Home to dock it · Esc closes"
```

- **For:** opening a window. The windows are Chat, Tasks, Questions, Plans, Documents, Helpers, Project, Activity, Reminders and the helper chats.
- **Placement:** right-aligned to the + button and 4px below it; or at the point of "Add a window here". It is clamped inside the frame.
- **Behaviour:** typing filters. Enter opens the window floating, at the point if there is one. A row can be dragged onto Home to dock it; the popover fades while it is dragged.
- **Empty:** "No window matches". The arrow keys do nothing then (today they make an index of NaN).
- **Keyboard:** as SearchField. Focus returns to the + button.

### KeyboardHelp

```text
KeyboardHelp (Dialog sm, centred, no footer)
├── DialogTitle "Keyboard shortcuts"
└── ShortcutList (dl: Kbd boxed | description)
```

- **For:** the list of shortcuts.
- **Look:** width 460, padding 14 16. A two-column list with gap 6 16, --text-field; descriptions in --text-2.
- **Opens:** with "?" outside a field or the terminal, or from the palette. Escape or the Scrim closes it.
- **Entries:**
  - Command K.
  - Option 1, Option 2, and Option with the backtick key.
  - The arrow keys on tabs, edges and window bars.
  - Drag past an edge; drag onto the compass.
  - Right-click; Command Enter; Esc; ?.
  - Add: resizing a window by keys, and the Menu key.

### NotificationsMenu, LayoutsMenu, ConversationMenu

- **NotificationsMenu:** header Notifications; one row per note (bell or tick, label, sub); a separator; "Mark all as read" (disabled when nothing is unread). With no notes there is one disabled row, "Nothing needs you".
- **LayoutsMenu:** header Layouts; the layouts (Just the chat, A first window, Docked, Windows only, IDE, then "My layout n"), the current one ticked; "Save this layout" (a Toast with Undo); "Back to just the chat"; a separator; "Hide the agent bar". Choosing a layout changes only the arrangement and keeps the conversation.
- **ConversationMenu:** header Conversations; one row per chat (Avatar or the users icon, name, sub, a tick on the current one; each row is a drop target for a dragged document); then the agent's memories and who is in the chat.

## Composites: the window system

### Desk

```text
Desk
├── Pane × n
├── Splitter × (n - 1)
├── FloatingWindow × n
├── DropPreview
├── DropCompass (on the pane under the pointer)
├── DragGhost
├── Caption (demo)
└── EmptyState fill "Nothing on Home"
```

- **For:** where windows live.
- **Props:**
  - layout: a tree whose nodes are a split (axis, ratio, a, b) or a pane (tabs, act, framed).
  - floats: key, x, y, w, h, minimised.
  - zoom, active.
- **States:**
  - Zoomed: only that pane is drawn and no drop targets exist. Docking anything clears the zoom.
  - Empty: "Add a window with the + in the agent bar, or press ⌘K. The chat is one of them."
- **Docking:**
  - Past an edge: 8px outside the left; the last 12px inside the right and the bottom; 8 to 90px above the top.
  - The new pane takes 30% of the width or height (38% for a chat, a document or a terminal). Use one share helper for both the preview and the result.
- **Motion:** when the layout changes, each pane and window glides from its old box to its new one over 240ms. A new window grows from scale .97 and opacity 0 over 180ms. Dragging a splitter or resizing by keys does not glide.

### Pane

```text
Pane (section, aria-label = active window title)
├── WindowHeader variant=strip (PaneStrip)
│   ├── Tabs
│   │   └── PaneTab × n
│   │       ├── Icon 13
│   │       ├── title
│   │       ├── count
│   │       └── IconButton xs close
│   └── WindowHeaderActions
│       ├── IconButton zoom ("Fill Home with this pane" / "Restore the layout")
│       └── IconButton float ("Float this window")
└── PaneBody (scrolls)
    └── window body
```

- **For:** one rectangle of the grid, holding windows as tabs.
- **Props:** tabs, active, framed, selected, zoomed, dropTarget.
- **Variants:**
  - framed (with the strip).
  - plain: the chat alone in a one-pane grid, with no strip and no own scroll. It is a div labelled "Chat with <name>". It becomes framed when it is joined or made a window.
- **Look:** absolute, --bg, isolation isolate (so its own panels stay under floating windows). An inset 1px --line on the left and top where the pane does not start at 0. No outer border.
- **States:**
  - Selected: the tab line turns --brand.
  - Drop target: a 2px --focus outline at -3.
- **Keyboard:** Option with the backtick key moves to the next pane or window; Option 1 and Option 2 show or hide Project (left) and Activity (bottom).

### PaneTab

- **For:** a Tab in a PaneStrip.
- **Close button:** hidden (opacity 0) until hover, selection or focus. It has tabindex -1 and the label "Close <title>".
- **Keyboard:** Left and Right; Enter and Space; Delete or Backspace closes it with an Undo toast ("Closed <title>"). Focus then goes to the pane's new active tab.
- **Pointer:** a drag starts after 5px and shows the DragGhost and the DropCompass. A tab dropped on its own pane lands where it was dropped; a pane's only tab dropped on its own pane stays.
- **Context menu:** Fill Home or Restore, Float, Dock along the bottom, Close.

### WindowHeader

- **For:** the header of a pane or a floating window. It folds .strip and .wbar into one.
- **Look:** 34 high, --side, bottom --border, padding 0 5 0 12, no text selection.
- **Variants:**
  - strip: holds Tabs.
  - bar: holds an Icon, a title (--text-badge, .03em, ellipsis; --text-3, or --text when active) and actions; cursor grab; ring at offset -1.

### FloatingWindow

```text
FloatingWindow (section, aria-label = title)
├── WindowHeader variant=bar
│   ├── Icon
│   ├── title
│   ├── spacer
│   ├── IconButton minimise ("Show only this bar" / "Show the whole window")
│   ├── IconButton dock ("Dock it on the right")
│   └── IconButton close ("Close <title>")
├── body (hidden when minimised)
└── ResizeGrip (hidden when minimised)
```

- **For:** a window above the Desk.
- **Props:** key, x, y, w, h, minimised, active.
- **Sizes:**
  - Each opens at its own size, capped at the Desk minus 40: Chat 480 × 520, Tasks 420 × 330, Questions 360 × 200, Plans 360 × 300, Documents 380 × 280, Helpers 340 × 220, Project 280 × 460, Activity 520 × 300, Reminders 320 × 190, conversation 440 × 520, document 600 × 520, task or plan 380 × 280, file 640 × 460, memories 420 × 360.
  - Windows cascade by 24px.
- **Look:** absolute, --bg, --border-2 border (--border-3 when active), radius --radius-card, --shadow-window, min-width 260. Minimised it is 36 high.
- **Stacking:** 20 plus its place in the stack. A click brings it to the front without moving it in the DOM, so its scroll and selection are kept.
- **Keyboard:**
  - On the bar, the arrows move it 12px and Shift with the arrows 48px. At least 48px of the bar stays on Home.
  - Resizing by keys is to add: Option with the arrows, 12px, or 48px with Shift.
- **Pointer:** dragging the bar moves it and shows the drop targets. It docks only on a compass cell, a tab strip or past an edge. Holding Option forces a float.
- **Motion:** closing fades and scales to .97 over 180ms.

### DropCompass, DropPreview, DragGhost, Caption

- **DropCompass:** five cells (centre, left, right, up, down) in a 3 × 3 grid of 26px cells with gap 3, centred on the pane.
  - Each cell: --raised, a 1px --text-4 border, radius --radius-control, --shadow-pop. The aimed cell fills with --brand.
  - Hit test: within 14px of a point 29px from the centre.
  - The centre joins the pane as a tab; a side splits it 50/50. There is no keyboard path (the context menu and buttons cover docking).
- **DropPreview:** the result, drawn before the drop.
  - Look: --brand at 10%, a 1px border of --brand at 40%. Its box moves over 180ms.
  - Shape: an edge gets 30% of Home; a strip gets 34px; the centre gets the whole pane; a side gets half the pane.
- **DragGhost:** a 28px chip that follows the pointer at an offset of 12, 10: --raised, --border-3 border, radius --radius-button, --shadow-pop, a 13px Icon and the title. It folds the window ghost and the dragged-document chip into one.
- **Caption:** the demo's centred pill, 22px from the bottom of the Desk; max-width 520, padding 8 14, --raised, --border-3 border, radius --radius-menu, --shadow-pop, --text-small; role status.

### ListWindow and QuestionsWindow

- **ListWindow:** ListRows for Tasks (num, title, Status), Plans (num, title, Meter 80, percent), Documents (num, title, meta) and Helpers (two-line rows with Status). Enter, a click or a double click opens the item as a window.
- **QuestionsWindow:** padding 10, holding one QuestionCard per open question.

### ActivityPanel

```text
ActivityPanel
├── PanelToolbar (32)
│   ├── Tabs (Important | Normal and up | Everything)
│   └── Button sm "In the chat: <level>" > Menu
└── list (role list)
    └── ActivityItem density=row × n
        ├── time 38
        ├── level glyph 10 (● reaches the chat, ○ panel, · detail)
        ├── Icon 14 (kind)
        ├── who + text
        └── FoundList (when expanded)
```

- **For:** what agents did, each item with an importance.
- **PanelToolbar:** 32 high, bottom --line, padding 0 10 0 12. It folds .acthead, .ttool and .seg3 into one, with a height of 30 or 32.
- **ActivityItem:**
  - Densities: row (padding 5 12, --text-small, --text-2; level 3 in --text, level 1 in --text-3) or line (the chat's QuietLine).
  - aria-expanded when it has found lines, which show indented at 69 with a left --line.
  - Hover --hover; the ring at offset -2.

### MemoryList

```text
MemoryList
├── header "<n> memories · the number is its weight, heaviest first"
└── MemoryRow × n
    ├── weight (18, tabular)
    ├── text
    └── detail (from, keywords, how it fades) when expanded
```

- **Props:** memories, expandable (the panel version), and the window version (always shows its source).
- **MemoryRow:**
  - Look: a grid of 18px and 1fr, padding 9 14, bottom --line. Hover --hover; the ring at offset -2.
  - Keyboard: aria-expanded; Up and Down move, wrapping.
- **Empty:** EmptyState "No memories yet".

### ProjectTree

```text
ProjectTree
├── Tabs (Files | Journal), toolbar 30
└── Tree (role tree)
    └── TreeItem × n
        ├── chevron 12 | spacer 12
        ├── Icon 14
        └── label (ellipsis)
```

- **TreeItem:**
  - Look: 24 high; padding-left 8 plus 14 per level; --text-field --text-2. Hover --hover; selected --sel and --text; the ring at offset -2.
  - ARIA: treeitem with aria-level, aria-selected and aria-expanded; roving tabindex.
- **Keyboard:** Up and Down walk. Right opens a folder, then enters it; Left closes it, then goes to the parent. Enter opens the item as a window.
- **Motion:** the chevron turns 90° over 120ms.

### CodeView

```text
CodeView (region, aria-label = file name)
├── CodeHeader (sticky) > Button sm "Theme: <name>" > Menu "Colour theme for code"
├── CodeLine × n
│   ├── CodeGutter (number, comment dot)
│   └── CodeText (tokens k, s, nu, cm, ty, tg, fn)
├── CommentBar | CommentThread (after the line they belong to)
└── CodeFooter "The first n lines of <path>. Select lines by their numbers, or select text, then Comment."
```

- **For:** a read-only file with line numbers, colour themes and comments. A Markdown file opens as a DocumentReader instead.
- **Props:** path, text, language, theme, selection, comments.
- **Look:**
  - Mono at --text-small, line-height 20, padding 8 0; text pre with padding-right 80.
  - Gutter: 50 wide, right-aligned, padding-right 14, in the theme's gutter colour. A selected line takes the theme's selection fill.
  - A 6px dot at left 10, top 7 marks a comment (the theme's marker) or a draft (hollow).
  - CodeHeader: padding 0 0 6 50. CodeFooter: sans, --text-badge.
- **Themes:** remembered on the machine (default Darcula). Each brings its own surface, so it reads the same in the light and the dark app. A comment under a line keeps the app's colours.

| Theme | Surface | Text | Gutter | Selection | Marker | Keyword | String | Number | Comment | Function | Tag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Darcula | #2b2b2b | #a9b7c6 | #606366 | #32363a | #bbb529 | #cc7832 bold | #6a8759 | #6897bb | #808080 | #ffc66d | #e8bf6a |
| Islands Dark | #191a1c | #bcbec4 | #4b5059 | #26282e | #56a8f5 | #cf8e6d | #6aab73 | #2aacb8 | #7a7e85 | #56a8f5 | #d5b778 |
| Light | #ffffff | #080808 | #9aa0ae | #edf2fc | #3574f0 | #0033b3 | #067d17 | #1750eb | #8c8c8c | #00627a | #0033b3 |
| Plain | --code-bg | --text-2 | --text-4 | --brand 10% | --brand | --text bold | --text-3 | --text-3 | --text-3 italic | --text-2 | --text bold |

- **Keyboard:** the Theme button and the gutter can be reached. A click or drag on the gutter selects lines; Shift with a click extends. Selecting lines by keys is to add (see the gaps).

### TerminalWindow

```text
TerminalWindow
├── PanelToolbar (32)
│   ├── Status
│   ├── size "96×24" (Tooltip "Columns × rows; follows the pane's size")
│   ├── spacer
│   └── Button sm Interrupt, Restart, End
├── TerminalScreen (role log)
└── TerminalOverlay (connecting, restarting, ended)
```

- **For:** the live terminal of an agent that runs in one.
- **States:**
  - Connecting: Spinner "Connecting…"; all three buttons disabled.
  - Live: a brand Dot.
  - Restarting: an overlay.
  - Ended: an overlay with "The session ended." and a bordered Restart, which gets focus.
  - The overlay covers the screen from 32px down: --term at 82%, centred, gap 8.
- **TerminalScreen:**
  - Look: --term with --term-text, mono 12/18, padding 10 12, wrapping. The prompt "›" is bold; dim lines are --term-dim.
  - Cursor: a 7 × 14 block that blinks once per 1.1s while focused; a hollow box otherwise.
  - Focus: an inset 2px --focus.
  - It follows the newest line unless it was scrolled up. Its size is the width over 7.2 and the height over 18, at least 20 × 5.
- **Keyboard:** typing sends keys; Enter sends the line; Backspace deletes; Control C interrupts. The Option shortcuts are not caught inside the terminal; Tab and Command K leave it.
- **Motion:** the cursor blink, which reduced motion turns off.

## Composites: the chat

### ChatColumn

```text
ChatColumn
├── ChatLog (role log, aria-live polite)
│   ├── Notice (day, system, origin) × n
│   ├── Message × n
│   ├── QuietLine (activity, sequence) × n
│   ├── ProcessCard × n
│   └── TypingLine
├── DockArea
├── Composer
└── ChatPanel (optional, over the column)
```

- **For:** one conversation.
- **Props:** conversation, readWidth (760 plus 48), panel. Slots: log, aboveComposer, composer, panel.
- **Look:** a centred column, max-width 808, side padding clamp(16px, 4%, 24px). The log is a column with gap 14 and padding 22 0 18. The scroll area takes margin 0 -8 and padding 0 8, so focus rings are not cut.
- **Scroll:** new lines keep the reader pinned only when they were within 40px of the end. Opening sources or adding a reaction keeps the line where it is.
- **Drop target:** for a document from another chat; the pane shows the drop-target look. A document never drops on its own chat.
- **Empty:** a chat with no lines shows EmptyState "Write to <agent> to start" (not drawn today).
- **Used:** the main chat, helper chats, group chats, chat windows.

### Message

```text
Message
├── ReplyLink (when it answers an earlier line)
├── MessageHead (agent only: Avatar sm, name, "· 13:42")
├── MessageBody (rich text, inline code, TextLink)
├── DocumentBar (inside your bubble, or a full-width row under an agent message)
├── JournalChip
├── SourcesLine > SourceList
├── Reactions
└── MessageActions
```

- **For:** one line someone wrote.
- **Props:** speaker, time, text, replyTo, reactions, sources, document, chip, showHead.
- **Variants:**
  - own: aligned to the end, max-width 78%, --bubble fill, padding 8 12, radius 10 10 4 10. It has no head, time, reactions or sources.
  - agent: max-width 92%, no bubble. The head is --text-badge --text-3, gap 5, margin-bottom 2; the name is --text-2 at 500.
  - In a group the head shows once per run of the same speaker, and the time moves into MessageActions.
- **States:**
  - Hover or focus inside: MessageActions show.
  - Flash (after a reply jump): a 2px --focus outline at offset 4, radius --radius-field, for 900ms.
  - Sending and failed to send are not drawn (see the gaps).
- **Keyboard:** the actions take Tab. Moving between messages is to add (see the gaps).
- **Context menu:** see ContextMenu.

### MessageActions

- **For:** React and Reply on a message.
- **Look:**
  - Agent messages: a group at top -12, right -4, gap 4. It holds the time (groups only), React and Reply.
  - Own messages: Reply only, at left -72, or under the bubble's corner when the column is narrower than 320.
  - Each action: 24 high, padding 0 8, --text-badge --text-2, --raised fill, --border-2 border, radius --radius-control; Icon 14 and a word.
- **States:** opacity 0, shown on hover, on focus inside and for the last message. Ring at offset 1.
- **ARIA:** "React to <name>'s message" (aria-haspopup dialog); "Reply to <name>".
- **Motion:** opacity over 120ms.

### ReplyLink

- **For:** the "↩ Name" line above a message that answers something further up.
- **Look:** a quiet TextLink, margin 0 0 3. It shows only when the answered line is not directly above.
- **ARIA:** aria-label "Answers <name>: <snippet>. Show it".
- **Behaviour:** a click scrolls the target to the centre and flashes it.
- **Not drawn:** the state where the target is gone.

### Reactions and ReactionPicker

```text
Reactions (role group "Reactions")
├── ChipButton md pill × n (emoji, count, pressed when yours)
└── ChipButton md pill "add" (smile, "+") > ReactionPicker

ReactionPicker (Popover, role dialog "Add a reaction")
├── QuickRow: EmojiButton 32 × 6 (👍 ❤️ 🎉 😄 👀 ✅) + IconButton "More emoji" (aria-expanded)
└── EmojiGrid: 8 columns × 32, gap 2, top --line (when expanded)
```

- **Reactions:** a wrapping row, gap 4, margin-top 6, drawn only when a reaction exists. A chip's Tooltip lists who reacted. A click toggles yours.
- **ReactionPicker:**
  - Opens with focus on the first emoji. Left and Right move, wrapping; Enter or Space picks and closes; Escape or an outside press closes. Focus returns to the trigger.
  - EmojiButton states: hover, focus and yours take --sel; yours also gets the ring.
  - Every emoji has an aria-label (today only four do).

### SourcesLine

```text
SourcesLine
├── QuietLine "Looked at N sources" + chevron 12 (aria-expanded)
└── SourceList (ul)
    └── li > SourceItem × n
        ├── Icon 14 (search, memory, doc, file)
        ├── title
        ├── sub
        └── FoundList (search, when open)
```

- **For:** what the agent looked at for a message.
- **SourceList:** a left --line, padding 2 0 2 12, gap 2.
- **SourceItem:**
  - Look: padding 3 4, radius --radius-control, --text-small --text-2, wrapping; its sub is --text-badge --text-3. Hover --hover; the ring at offset 1.
  - A search toggles its found list. A memory opens the ChatPanel. A doc opens it. A file opens it, or says "<file> is not on this machine".
- **Motion:** the chevron turns 90° over 120ms.
- **Naming:** the library uses .srclist and .srcitem. The code view's .src is a different thing.

### QuietLine, Notice and TypingLine

- **QuietLine:** one clickable line in the chat.
  - Look: flex, gap 7, --text-badge, --text-3, no border or padding. Hover --text-2; the ring at offset 2.
  - Props: icon, text (slot, bold parts in --text-2 500), expanded.
  - Kinds: activity (opens the ActivityPanel), sequence (opens the ChatPanel; aria-expanded), sources (above).
- **Notice:** a quiet line that is not a message.
  - Variants: centred (day and system lines, max-width 86%); origin (users Icon plus "Started by Agent 1 for plan 54 · 14:01").
- **TypingLine:** an sm Avatar and "<name> is writing…", in --text-badge --text-3; it is announced (to add).

### JournalChip

```text
JournalChip
├── Avatar sm journal ("J", Tooltip "From the journal")
├── "Open"
├── TextLink × n ("Designer 262's chat"), joined with " · "
└── IconButton sm "Not now"
```

- **For:** the journal's offer to open the chat of a helper that was just started.
- **Look:** a flex row of fit-content width, 26 high, gap 6, margin-top 8 under the text; padding 0 4 0 6, --line border, radius --radius-button, --text-small --text-2.
- **States:**
  - Offered.
  - Opened: "<name>'s chat is open", with the links gone.
  - Declined: the chip is removed and focus goes to the composer.
- **ARIA:** announced as new content (to add).

### DocumentBar

```text
DocumentBar (Card plain, radius field, draggable)
├── Icon docs 14
├── title "Doc 101 · Design: Home, version 6"
│   └── small "Revision 12 · today"
└── Button sm "Open"
```

- **For:** a document in a chat, which can be opened or handed to an agent.
- **Look:** gap 10, margin-top 8, padding 7 8 7 10. Hover --border-3; the ring at offset 1; cursor grab. A handed-over bar in your own bubble drops the "drag onto an agent" hint.
- **States:** lifting while dragged (scale .96, opacity .45, over 180ms); flash.
- **Drag:** a DragGhost follows the pointer.
  - Over the agent's name, the ConversationMenu opens; resting on a row for 450ms switches the chat.
  - A drop on another chat hands the document over ("Read this, please.").
  - A drop elsewhere restores the chat you were in. A click without moving opens the document.
- **Keyboard and ARIA:** one focusable element: the bar is a button labelled "Doc N: title. Enter opens it; Shift+Enter hands it to an agent." Its Open is not a second button inside it. Shift+Enter or the Menu key opens a "Hand it to" menu.

### ItemCard: QuestionCard, DockedCard and ProcessCard

```text
ItemCard (Card raised)
├── lead: Icon 16
├── body: title (500, ellipsis) + subline (small) + Meter sm 140 (optional)
├── trail: Status | Button bordered sm Answer
└── actions: IconButton sm Open + IconButton sm Undock (docked only)

ProcessCard (Card raised, max-width 92%, role group "Command <cmd>")
├── ProcessHeader
│   ├── Icon term 14
│   ├── command (mono, ellipsis, Tooltip full command)
│   ├── Status
│   ├── duration (m:ss, tabular)
│   ├── Button sm Stop (running only)
│   └── Button sm "Show output" / "Hide output" (aria-expanded)
└── ProcessOutput (role log)
```

- **QuestionCard:** padding 10 12. A question icon, the question, "Question · asked 13:44", and Answer. Answer puts a ComposerNotice above the composer and focuses the composer. Its label is "Answer: <question>". A question is shown once: in the chat or docked, never both.
- **DockedCard:**
  - Look: padding 8 8 8 12; tabindex 0 with aria-label "<title>, docked". Enter opens the item.
  - Kinds: task (holder and step, Meter, Status), plan (done count, Meter), question (Answer), report.
  - Motion: it enters from 8px below with opacity 0 over 240ms.
- **ProcessCard:**
  - Header: padding 7 8 7 12, gap 8.
  - Output: mono 11.5/17 on --term with --term-out, padding 8 12, pre.
  - Collapsed: a running command shows its last 3 lines (max-height 67); a passed one its last 2 (50); a failed or idle one none. Open shows all, up to max-height 240, and follows the end.
  - States: idle "Waiting to start"; running (Spinner "Running"; the time and the lines update every 380ms in place); passed; failed (--danger); stopped by you (the output stays as it was).

### DockArea

```text
DockArea
├── DockHeader
│   ├── Icon pin
│   ├── "N docked"
│   └── Button sm "Fold" / "Show all N" (aria-expanded)
├── DockStack (folded, more than one)
│   ├── DockedCard (newest, --border-3)
│   └── DockLayer × 2 (8 and 16 in, 24 high, --hover and --sel)
└── DockList (open, gap 6, max-height 40vh, scrolls)
    └── DockedCard × n
```

- **For:** items pinned to a chat, under the conversation. An item docked beside the composer becomes an sm ChipButton in the composer row.
- **Motion:**
  - Hovering the folded stack lifts its layers 2px and 4px over 120ms.
  - Show all fans each card out over 240ms plus 40ms per card; Fold folds them back over 180ms plus 30ms per card.
  - Undock fades the card and closes its height over 240ms.
- **Focus:** after a fold or fan, focus goes to the Fold button. After an undock, focus goes to the next card or the Fold button, and a Toast offers Undo.

### Composer

```text
Composer
├── ComposerNotice (optional: Icon reply | question, text, IconButton sm stop)
├── Textarea (22 to 140, "Message <agent>")
└── ComposerRow
    ├── IconButton Attach
    ├── spacer
    ├── Chip model "Opus"
    ├── ChipButton sm × n (docked beside)
    └── Button sm Send (quiet to primary, arrow icon)
```

- **For:** writing a message.
- **Props:** conversation, draft, replyTo, answering, model, dockedBeside.
- **Look:** margin 0 0 14, --border-3 border, radius --radius-composer, padding 10 10 8 12, --bg. The row: margin-top 8, gap 6. The textarea is borderless with no resize; its placeholder is --text-4.
- **States:**
  - Focus inside: a --text-4 border, or the ring (to add; today the shell does not change).
  - Has text: Send turns primary. With no text, Send is aria-disabled.
- **ComposerNotice:**
  - Look: --text-badge --text-3, padding 0 0 7, margin-bottom 6, bottom --line; the name is --text-2 500.
  - Variants: "Replying to <name> · “snippet”" and "Answering <question>".
  - Closing it returns focus to the textarea.
- **Keyboard:** Enter sends; Shift+Enter makes a new line. A draft is kept per chat.
- **Motion:** the textarea grows with its text.

### ChatPanel

```text
ChatPanel (role dialog, not modal)
├── PanelHeader (44)
│   ├── Avatar | Icon
│   ├── title (600)
│   ├── small count
│   └── IconButton close
└── PanelBody (scrolls)
    └── MemoryList | SequenceView
```

- **For:** something that belongs to the chat, open over it: memories or a sequence. Opening one replaces the other.
- **Look:** absolute at top 8, right 4, bottom 8; width min(380px, 100% - 8px); --raised, --border-2 border, radius --radius-card, --shadow-pop. Header padding 0 6 0 12, bottom --line.
- **Placement:** it must end above the composer and the DockArea, which must stay usable. In a column wider than 700 the log takes a right padding of the panel's width while it is open.
- **Keyboard:** it opens with focus on its close button. Escape closes it from anywhere inside, fields included. Focus returns to the opener. Choosing another chat closes it.
- **Motion:** it slides in from 24px over 240ms with opacity; it should leave the same way over 180ms.
- **Shares its shape with** the TaskGraph side panel: one Panel with a placement prop.

### SequenceView

```text
SequenceView
├── SeqHeader
│   ├── h2 (16, 600)
│   ├── Button bordered sm "Edit steps"
│   └── about (small)
├── RunList (role group "Runs")
│   └── ChipButton md × n (tick | hollow dot | Spinner, "Run 41 · task 1702 · at step 2 of 4")
└── StepList (ol)
    └── Step × n
        ├── StepMark (20, number | tick | Spinner | stop)
        ├── rail (1px --border-2)
        └── StepBody
            ├── title "2 · Run the tests"
            ├── rule "Runs when … · Done when … · Waits for …"
            └── ChipButton md "here" × runs at this step
```

- **For:** a sequence, its runs and its steps. It appears in the ChatPanel and on the Sequences page.
- **StepMark:** 20px with a 1.5px --border-3 ring and --bg fill.
  - States: future (the number), now (a --brand ring with a Spinner, or a stop icon when the run waits), done (filled --text-3 with a --bg tick).
  - The state is also given in hidden text ("done", "now", "waits"). Steps after the current one fade to .55.
- **Empty:** "No runs yet." as a static ListRow.

### SequenceEditor

```text
SequenceEditor
├── EditorHeader
│   ├── "Edit · <name>"
│   ├── Button sm Cancel
│   ├── Button primary sm Save
│   └── hint "A step starts at its Runs when and ends at its Done when."
├── DraftedBanner (Card plain radius field: Avatar + sentence), when drafted
├── StepEditor × n
│   ├── handle (list icon, grab, Tooltip "Drag to move")
│   ├── Field sm "Step n"
│   ├── Field sm "Runs when"
│   ├── Field sm "Done when"
│   └── ops
│       ├── IconButton Move up
│       ├── IconButton Move down
│       └── IconButton Remove
└── Button bordered sm "Add a step"
```

- **StepEditor:** a grid of 22, 1fr and auto, gap 6 8, padding 10 0, bottom --line. While lifted: --hover with --shadow-pop, and the other rows make room.
- **Keyboard:**
  - Edit steps focuses the first title. A move keeps focus on the moved step's arrow (the other arrow at an end). Remove focuses the next row, or Add a step. Add focuses the new title.
  - Save focuses Edit steps. Cancel focuses the sequence's row.
- **Behaviour:** Save drops steps with an empty title and offers Undo. Cancel on a sequence that was never saved removes it. Choosing another sequence while editing offers Undo.

## Composites: the pages

### PageShell

```text
PageShell
├── PageHeader (52)
│   ├── h3 title (16, 600)
│   ├── count (small, --text-3)
│   ├── Tabs variant=pagehead (views)
│   └── PageActions (right, gap 6): SearchField, SplitButton
└── ListDetailLayout
    ├── PageList (430, right --line, scrolls; region labelled with the page)
    │   ├── ListFilters (Tabs variant=filters)
    │   └── ListRow × n | EmptyState
    └── PageDetail (flex 1, scrolls)
        └── DetailReader | TaskGraph | DocumentReader | SequenceView | EmptyState "Nothing selected"
```

- **For:** every sidebar page except Home.
- **Props:** title, count (the list's length), listWidth (430). Slots: views, actions, list, detail.
- **Look:** the header has padding 0 16, gap 10, bottom --line.
- **Variants:**
  - list and detail (Tasks, Plans, Documents, Accounts, Profiles, Sequences).
  - header with one detail area (the task graph view).
  - header with a reader column (Settings, max-width 720).
- **Behaviour:** the list, detail and graph keep their scroll per page. Changing page closes any create dialog.

### DetailReader

```text
DetailReader
├── meta (badge, --text-3)
├── h2 (16, 600)
├── abstract (--text-2)
└── body: FactList | Tabs + panels | SettingGroup × n
```

- **Look:** padding 18 22, max-width 760 (none for a plan).
- **FactList:** a dl in a grid of auto and 1fr, gap 4 16, --text-field; dt is --text-3. An empty value reads "Nobody yet" or "nothing". Waits for and Holds up are TextLinks. The graph's side panel uses the same FactList.
- **Variants:**
  - TaskDetail: "Task N · plan P", the title, Status, and the facts Holder, Waits for, Holds up and Brief.
  - PlanDetail: "Plan N · P%", the title, Tabs (Tasks or Graph), then task rows or the TaskGraph. With no tasks: "No tasks in this plan yet".
  - AccountDetail: the name and "type · expires…", a SettingGroup (Name Field, Make default Toggle, Sign-in Status or a "Sign in" Button), then UsageMeter groups.
  - ProfileDetail: read-only SettingGroups with right-aligned text or faint Chips (Program, Model, Models it may use, Driver, Answers to, How many run), then "Rules it works under".

### InPlaceDetail

```text
InPlaceDetail
├── BackBar (gap 8, padding 10 22 0) > Button sm "Back to plan N" (reply icon)
└── TaskDetail
```

- **For:** opening an item of a list inside a reader without leaving it. The design uses it for a task opened in a plan.
- **Behaviour:** opening scrolls to the top and focuses Back. Back restores the tab, the list's scroll and focus on the opened row. Choosing another item in the page list clears it.
- **Use for** documents and sequences too.

### TaskGraph

```text
TaskGraph
├── GraphToolbar (padding 8 14, bottom --line)
│   ├── "N tasks · each arrow points from what a task waits for"
│   ├── Button bordered sm pressed "Show bottlenecks"
│   └── Button bordered sm pressed "Suggest improvement" (disabled with a Tooltip saying why)
├── GraphSplit
│   ├── GraphCanvas (svg, role group "Plan N: what waits on what", scrolls both ways)
│   │   ├── GraphEdge × n
│   │   └── GraphNode × n (role button, aria-pressed)
│   │       ├── rect 178 × 46
│   │       ├── "number · holder"
│   │       ├── title
│   │       ├── state dot
│   │       └── badge "holds up N"
│   └── GraphSidePanel (Panel: beside at 280, or under on a page with a list, max-height 45%)
│       ├── h4 "N · title"
│       ├── Status
│       ├── FactList
│       │   ├── Holder
│       │   ├── Waits for: ChipButton xs × n
│       │   ├── Holds up: ChipButton xs × n
│       │   └── Everything it holds up
│       └── Button bordered sm "Open task" + Button sm "Close"
└── GraphCompare (Suggest improvement)
    ├── GraphSummary (padding 10 14, gap 18)
    │   ├── "Longest chain 7 → 5"
    │   ├── "At most 3 → 4 at once"
    │   ├── Button sm Discard
    │   └── Button primary sm "Apply these waits"
    ├── GroupLabel "Now · …" + GraphCanvas
    └── GroupLabel "Suggested · …" + GraphCanvas
```

- **For:** what waits on what in a plan.
- **Props:** plan, selected, showBottlenecks, suggestion.
- **Layout:** layered by depth. Nodes are 178 × 46 with gaps of 58 across and 14 down, and 20 of padding.
- **GraphNode:**
  - Look: radius 8, --raised fill (--bg when done), a 1px --border-3 stroke. The number line is 10.5 --text-3; the title is 11.5, cut at 25 characters. The state dot is r 3.5: filled --text-3 when done, --brand while working or waiting on you, a ring otherwise.
  - Selected: a --brand stroke of 1.6 and a scale of 1.07 over 240ms.
  - Bottleneck: a --text stroke of 2 and a "holds up N" badge; other nodes go to opacity .6.
  - Outside the lit chain: opacity .22.
  - Changed in a suggestion: a --text stroke dashed 4 2.
  - Focus: a --focus stroke of 2.
- **GraphEdge:**
  - Look: a curve from the right of the source to the left of the target, with an arrowhead. The stroke is --text-4 at 1.2.
  - States: met dashed 3 3; on the chain --text at 1.6; added --text at 1.8; removed --text-3 dotted 2 4; faded .22. Changes take 240ms.
- **Behaviour:**
  - A click lights the task's whole chain; a second click, empty space or Escape clears it.
  - The canvas scrolls the chain into view, but only when the selection changes.
  - Apply shows a Toast with Undo.
- **Keyboard and ARIA:** each node has the label "Task N: title, state, holds up n". Tab reaches it; Enter and Space toggle it; Escape clears and focuses the node.
- **Empty:** "No waits yet" and "No tasks in this plan yet".
- **Not drawn:** zoom, pan, a legend, dragging nodes.

### DocumentReader

```text
DocumentReader
├── ReaderHeader
│   ├── meta "Doc N · revision R · date"
│   ├── h2
│   └── abstract
├── Button bordered sm "Ask for feedback" > Menu "Ask for feedback from"
├── Tabs (Text | History | Links)
└── LineCommentable
    ├── DocBody (13.5 / 1.65)
    │   └── Block × n (paragraph, h3, list item, pre)
    ├── CommentButton (Button primary sm, floating at the selection's end)
    ├── CommentBar
    │   ├── caption "Comment on lines a–b · “quote”"
    │   ├── Textarea (borderless, min 54)
    │   └── footer: "To" + MenuTrigger field + Button sm Cancel + Button primary sm Send
    └── CommentThread
        ├── head "You → Name · lines" + Status (Sending | Read by Name)
        ├── text
        ├── replies
        └── Button sm "Reply" + Button sm "<Name>'s chat"
```

- **For:** reading a document and commenting on its lines. LineCommentable is shared with CodeView.
- **Block:**
  - Look: radius 6. A pre is mono 12 on --code-bg with a 1px --line border, radius 8 and padding 10 12.
  - Selected: a 9% --brand wash.
  - Has a comment: a 2px --border-3 bar at the left, drawn in the margin so the text does not move.
- **CommentButton:** placed from the text's right edge; it goes away on scroll.
- **CommentBar:** --raised, a 1px --border-3 border, radius 12, padding 8 10. Command or Control with Enter sends. Escape closes it and keeps a draft on those lines.
- **CommentThread:** --bg, a 1px --line border, radius 12.
- **History:** a static ListRow per revision.
- **Links:** "Made from message N, for plan P and task T", as TextLinks.
- **Keyboard:** a "Comment on this document" button is the keyboard path; and after a keyboard selection with Shift and the arrows, the CommentButton takes focus with Tab.

### AccountRow and UsageMeter

- **AccountRow:**
  - A grid ListRow: ProgramMark; NameBlock (the name, then the type with " · default" in small muted text); UsageMeter row; Status.
  - The states are Signed in, Not signed in and Expired.
- **UsageMeter:**
  - row: a md Meter 84 wide at the larger of week and session, with both numbers in its Tooltip. An API key shows the amount left instead (--text-2, tabular).
  - group: a SettingRow per window ("This week", "This session, the last 5 hours"), each with "Resets …" and a lg Meter 220 with "n% used". At 90% or more the number turns --text at 500.
  - spend: "Left to spend" with the amount in bold, and "Spent" with a SegmentedControl (Today, This week, This month) and a sentence.

### SettingGroup and SettingRow

```text
SettingsSection
├── SectionHead
│   ├── GroupLabel
│   ├── Button sm Reset (only when changed)
│   └── Toggle (a domain switch)
├── help line (small, --text-3)
└── SettingGroup (Card plain, radius 12)
    └── SettingRow × n
        ├── title + hint
        └── control: Field | Toggle | SegmentedControl | Button | Status | text
```

- **SettingGroup:** a 1px --line border, radius 12, bottom margin 18, clipped.
- **SettingRow:** padding 12 14, gap 16, bottom --line (none on the last). A row can stack its content below its title (block), as Connect does.
- **SettingsPage:** General (Journal name, which shows in the topbar and the browser's tab), Connected projects, then one section per domain (Tasks, Plans, Documents, Sequences, Memory, Reminders, Helpers). A Reset offers Undo.

### ConnectProject

```text
ConnectProject (SettingRow block)
├── title "Connect a project" + hint
├── CommandBox
│   ├── code (mono 12, wraps, break-all, min 30)
│   ├── Button sm "Show" / "Hide" (aria-pressed)
│   └── Button bordered sm "Copy" (disabled with a Tooltip once used)
├── ConnectStatus
│   ├── idle "The token works once and expires in 30 minutes."
│   ├── waiting: Spinner "Waiting for the command to run…"
│   ├── connected: tick, strong "Connected: <name>"
│   └── Button sm "Make a new one"
└── ProjectRow × n | "No projects connected yet"
    ├── "name · path"
    ├── subline
    ├── Status (Connected | Offline)
    └── Button sm "Disconnect" (Undo)
```

- **For:** connecting a project on another machine with one command.
- **Behaviour:** the token is masked until Show. Copy copies the real token; it is a one-time token.

### CreateDialog

```text
CreateDialog (Dialog md)
├── DialogHeader > DialogTitle "New task" + IconButton close
├── DialogBody
│   ├── DraftedBanner (when it came from the guided chat)
│   └── Field × n (by kind)
└── DialogFooter
    ├── Button sm "<agent way> instead" (not when drafted)
    ├── spacer
    ├── Button sm Cancel
    └── Button primary sm "Create <noun>" | "Add account"
```

- **For:** the plain way to create a task, plan, document or account. A sequence uses the SequenceEditor on a new sequence instead.
- **Fields:**
  - task: Title, Plan, Waits for, Done when (textarea).
  - plan: Title, Goal, Phases, one per line.
  - document: Title, One line about it, Text (7 rows).
  - account: Program, Name, Type.
- **Behaviour:** Create adds the row, selects and focuses it, updates the count, and offers Undo. Leaving the page closes the dialog.
- **Keyboard:** as Dialog. Focus starts on the first field and returns to the opener.

### GuidedChatDialog

```text
GuidedChatDialog (Dialog md)
├── DialogHeader
│   ├── Avatar
│   ├── DialogTitle "Plan it with an agent"
│   ├── GuideDots ("Question n of 3")
│   └── IconButton close
├── DialogBody > GuideChat (aria-live polite, gap 12)
│   ├── AgentQuestion × n (Avatar + bubble: --bg, --line, radius 10, max 92%)
│   ├── UserAnswer × n (right, --bubble, radius 10 10 4 10, max 80%)
│   ├── SuggestedAnswers (role group, 34 in) > ChipButton lg pill × n
│   ├── AnswerInput: Field "Or say it in your own words" + Button bordered sm Answer
│   ├── Drafting: Status Spinner "Drafting the <noun>…"
│   └── DraftSummary (Card plain, --border-3, radius 12, 34 in)
└── DialogFooter
    ├── Button sm "Change the last answer" | "<plain way> instead"
    ├── spacer
    ├── Button sm Cancel
    └── Button primary sm "Open the draft" | "Open in the editor"
```

- **For:** the agent way. Three questions, each with ready answers, then a draft to accept or change.
- **GuideDots:** 6px dots, one per question plus one for the draft; filled once answered.
- **Keyboard:**
  - Focus starts on the first suggested answer.
  - After a typed answer it stays in the answer field; while drafting it is on the dialog; then it moves to Open the draft.
  - Enter in the field answers.
- **Motion:** none beyond the redraw; drafting takes 900ms.

## Gaps, each as a fix for the design

1. **Attach is not a control.** Make the composer's Attach an IconButton labelled "Attach", or leave it out until attaching is designed.
2. **Only one dialog is modal.** Give CommandPalette and KeyboardHelp the Dialog behaviour: aria-modal, a Tab trap, Escape and focus return.
3. **Palette and popover hide the active row.** Link the CommandPalette and AddWindowPopover inputs to their lists with aria-controls and aria-activedescendant. Make the arrow keys do nothing on an empty popover list.
4. **Live changes are silent.** Make the agent bar's Status a live region. Make ChatLog a log with aria-live polite. Announce TypingLine and a new JournalChip.
5. **Hints live in title attributes.** Add a Tooltip that shows on hover and focus, and use it for every IconButton, disabled button and meter. Keep the aria-label as the name.
6. **Selection uses the wrong roles.** Put a list's aria-selected on role option inside a listbox, or use aria-current; tabs get tabpanel with aria-controls; a SegmentedControl becomes a radiogroup; a ticked MenuItem gets aria-checked.
7. **Meters have no value for assistive tech.** Give every Meter role meter with its value and a label.
8. **Floating windows cannot be resized by keys.** Add Option with the arrows on the window bar (12px, or 48px with Shift), and list it in KeyboardHelp.
9. **Docking needs a pointer.** Add the Desk's docking moves to the window bar's and tab's context menu (Dock left, right, top, bottom; Join pane) and open it with the Menu key, so every compass target can be reached by keys.
10. **Code lines cannot be selected by keys.** Make the gutter focusable: Up and Down move a line cursor, and Shift with Up and Down extends the selection; then C opens the CommentBar.
11. **Documents have no keyboard path to Comment.** Add a "Comment on this document" button, and let the CommentButton take focus after a keyboard selection.
12. **A document is handed over only by dragging.** Let Shift+Enter or the Menu key on a DocumentBar open "Hand it to"; the bar becomes one button with no nested Open.
13. **The ChatPanel hides the composer and Send.** End the panel above the composer and the DockArea, and pad the log while it is open in a wide column.
14. **Message states are missing.** Draw sending (a muted bubble with a Spinner in its corner), failed to send (a --danger line "Not sent · Try again"), a reply whose target is gone ("The message it answers was removed"), and moving between messages with Up and Down once focus is in the log.
15. **There are no loading or error states.** Design a list loading state (three ListRow skeletons in --sel) and a load error (EmptyState "Could not load the tasks" with a Try again Button) for every page. On declared pages these are the notice skeleton and the notice error.
16. **Chips are drawn seven times and avatars five.** Build ChipButton, Avatar, Field, Meter, Tabs, WindowHeader, PanelToolbar, Card, GroupLabel, EmptyState and DragGhost once each, as above, and delete the duplicate classes.
17. **The InfoBar moves the Desk.** Draw it over the Desk's top edge instead of in the flow, so the chat does not jump by 30px when the first window floats.
18. **The drop preview lies for chats.** Compute the edge share in one place, so a chat, document or terminal previews at 38% as it docks.
19. **The separator has a dead zone.** Clamp it by the 140px pane floor, not by 10 to 90%, and refuse a split drop on a pane narrower than 280.
20. **The chat jumps when sources or reactions open.** Keep the clicked line in place instead of pinning the chat to its end.
21. **A helper's start is said three times.** Keep the agent's message and the JournalChip; send the "started" line to Activity at level 2.
22. **Some focus is lost.** After closing a tab, focus the pane's new active tab or the next window. After "Not now", focus the composer. After removing the only reaction, focus the message's React action. After a right-click reaction, focus the message.
23. **The Escape and Option keys stop short.** Escape in the ChatPanel closes it from inside its fields; the Option shortcuts and Escape work from inside the terminal through a "leave the terminal" key (Option with the backtick key), shown in its label.
24. **Reaction emoji are unnamed.** Give every emoji in the ReactionPicker an aria-label, and the focused emoji a ring, not only --sel.
25. **Old code is still in the file.** Remove the old Settings body, the unreachable usage word pill, .dstack, .stp.fade (or use it for steps after the current one), and --duration-panel (or give it a use).
26. **Documents search does nothing.** Filter the list by title and number as the user types, and show EmptyState "No document matches" with "Clear the search".
27. **Placeholders are unmarked.** Mark Sign in and Sign out as not designed, or design them.
28. **Sizes are inline styles.** Make the Field widths (90, 180, 200), the Meter widths and the reader widths (720, 760) props with named defaults.
29. **Overlays have no motion.** Give the Menu, Popover, Toast and Dialog the same entrance (opacity and 4px over 180ms), turned off under reduced motion.
30. **Icon button sizes clash with plan 53.** The typed layouts set action icon buttons at 28, 36 and 44px with 14, 18 and 22px glyphs (doc 89). This design uses 26, 20 and 18. Decide one scale. The proposal: 28 for md (the declared small), 20 and 18 only inside native strips and chips.
31. **Not checked.** Nothing in this library was measured in a browser: every value comes from the CSS. Contrast was checked only from the token values (report 323), so it is worth a measured pass in both modes. The verdicts on declared layouts are read from doc 89's wire tags, not tried against the built code of plan 53.
