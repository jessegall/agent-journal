# Kit components

The measures and behaviour of the shared kit components in `resources/js/components/kit`, as the design draws them.

## WindowHeader

The header of a pane or a floating window, 34 high on --side with a --border line below, padding 0 5 0 12 and no text
selection. The strip variant holds Tabs in the default slot. The bar variant holds the leading slot (an Icon), the title
in --text-badge with .03em spacing and an ellipsis (--text-3, or --text when active), and the actions slot
(IconButtons); it shows a grab cursor and takes focus with a ring at offset -1.

## DialogFooter

The bottom row of a Dialog: a row under a --line border with padding 10 12 10 16. The secondary slot holds the secondary
actions on the left, a spacer follows, and the default slot holds Cancel and the primary action on the right; a default
slot that brings its own spacer places its actions on both sides itself.

## Tabs

A tab list bound to its panels: tablist, tab and tabpanel roles with aria-controls and aria-labelledby. Left and Right
move and choose the tab, round the ends, and Home and End go to the first and last (roving tabindex). The caller gives
the tabs as data (with a panel slot per tab key) or draws its own Tab parts in the tabs slot. Variants: inline (margin
10 0 6, a --line rule), pagehead (52 px high, no rule), filters (padding 0 12, a --line rule) and toolbar (inside a
toolbar that draws the rule: 14 px apart, no rule, no padding, no space above an empty panel). The other variants are a
record's or a page's tabs, 16 px apart and each as wide as its label; a toolbar's tabs are a window's tab strip, each at
least 56 px wide. The chosen line is the brand colour or quiet.

## ListBox

A list with one active option, driven from a field that keeps the focus: the default slot holds MenuItems in option mode
(each with an id) and MenuGroups. The field passes its keydown to controlKeys: Down, Up, Home and End move the active
option and wrap, Enter chooses it, and with no option they do nothing. The field names the list in aria-controls and the
active option in aria-activedescendant, which is the activeId model. The first option is active until another is chosen,
and the active row scrolls into view. It is 340px high at most as a popover and 420px as a palette, with padding 6.

## Popover

An anchored surface that is not modal and has no scrim: --raised, a --border-2 border, radius --radius-menu and
--shadow-pop. It sits 4 px below its anchor, aligned to the anchor's left or right edge (or at a point), stays 6 px
inside its frame (the nearest positioned parent) and flips above the anchor when it would pass the bottom. It is a
dialog with a label; Escape or a press outside closes it and focus returns to the anchor.

## DialogContent

The shell of a Dialog: a role dialog with aria-modal, named by its title, in --raised with a --border-2 border, radius
--radius-card and --shadow-window. It is 460 wide as sm, 540 as md and 560 as lg, and at most the frame minus 96 high. A
DialogHeader (the title and a close button) comes first unless header is off or the header slot replaces it; the default
slot is the DialogBody; a DialogFooter follows when the footer slot is given, with its secondary actions in the
secondary slot. Without a header the dialog is named by aria-label.

## ActivityItem

One action an agent took. Row (the activity panel): the time (38 wide), a level glyph 10 (● reaches the chat, ○ the
panel, · only detail), the kind's Icon 14, and who and what, padding 5 12 in --text-small --text-2; level 3 reads in
--text and level 1 in --text-3. Line (the chat): a QuietLine. An item with found lines is a button with aria-expanded
that shows its FoundList; hover takes --hover and the ring sits inside at offset -2.

## Tab

One tab of a Tabs list: --text-badge with .03em spacing, --text-3, padding 7 0, and in a window's tab strip a least
width of 56 px; a long label shrinks and ends in an ellipsis. The chosen tab is --text with an inset 1px bottom line
(--brand for a page or an active pane, --border-3 otherwise). Only the chosen tab is a tab stop. A closable tab shows a
close button on hover, selection or focus, and closes on Delete, Backspace or a middle click.

## SettingRow

One setting in a SettingGroup: a title with its hint on one side and its control (a Field, Toggle, SegmentedControl,
Button, Status or text) from the slot on the other. Padding 12 14, gap 16, a --line rule below it that the last row
drops. A block row stacks the control below the title. The slot receives titleId and hintId, so a control can name
itself with aria-labelledby and aria-describedby.

## DropCompass

Five targets (centre, left, right, up, down) in a 3 by 3 grid of 26px cells with a gap of 3, centred on a pane while a
window is dragged over it. A cell is --raised with a 1px --text-4 border, radius --radius-control and --shadow-pop; the
one the pointer aims at fills with --brand. The pointer aims at a cell when it is within 14px of the cell's point, 29px
from the centre for a side (compassTargetAt). The aimed cell is sent through aim. The compass has no keyboard path:
every target is also a menu item (compassTargets holds its label) on the window bar and tab menus.

## ListRow

One row of a list, full width, with a gap of 10, --text-field text and a --line border below: a lead slot (a number 40
wide, a DriverMark or an Icon), a NameBlock fed by the title and subline slots, and a trail slot whose cells have fixed
widths so they line up from row to row. Single has padding 7 12, two has 8 12 and shows the subline, and grid (accounts)
has padding 8 12 and four columns of 16, a flexible one, 84 and 96 with a gap of 12, where the trail holds the last two
cells. A static row is a plain div with the default cursor, unless it opens: then the whole row is the pointer target
and takes the hover, while its own link stays the control a keyboard reaches. Hover takes --hover, selected takes --sel,
and focus draws the ring at offset -2. In a listbox the row is an option and selected is aria-selected, and Up and Down
move between the options; in a list of links the selected row is aria-current. Enter opens it.

## Meter

A thin share bar from 0 to its maximum (100 unless given): role meter with its value, maximum and a label such as "72%
used", and a spoken value that keeps its unit when one is given. Its width is fixed in pixels, or fluid: it fills its
container up to 220 px and shrinks with a narrow one, such as a phone's. Its track turns --border-3 inside a selected
row, whether the row is an option or the current row of a list.

## MemoryRow

One memory: a grid of the weight (18 wide, tabular) and the text, padding 9 14 and a --line rule below. An expandable
row is a button with aria-expanded that shows its detail (where it came from, its keywords, how it fades) under the
text; hover takes --hover and the ring sits inside at offset -2. A row that is not expandable shows its detail at once.
A MemoryList moves between the buttons with Up and Down.

## QuietLine

One clickable line in the chat: an icon, its text and a chevron, in --text-badge --text-3 with no border or padding.
Bold parts of the text (b or strong) take --text-2 at 500. Hover takes --text-2 and focus draws the ring at offset 2. A
line that opens something says whether it is open: the chevron turns a quarter when it is, and stands still under
reduced motion.

## CommentBar

The bar where a comment on some lines is written: a raised Card with a --border-3 border, radius 12 and padding 8 10. It
holds a caption ("Comment on lines a–b · “quote”"), a borderless Textarea (at least 54 high) and a footer with "To", the
recipient chooser from the slot (a field MenuTrigger), Cancel and a primary Send. Command or Control with Enter sends;
Escape closes it and the page keeps the draft for those lines. The Textarea has the focus at once.

## DockedCard

A card pinned to a chat: a --border-3 border, radius --radius-card on --raised, padding 8 8 8 12, focusable and labelled
"<title>, docked"; Enter on the card opens the item. It shows its icon, title and subline, or what the default slot
draws in their place; the trail slot holds what the kind shows (a state, or Answer), and Open, when the item opens, and
Undock sit at the end. It enters from 8px below over 240 ms, and without motion under reduced motion.

## DocumentBar

A document in a chat, on a plain Card with the field radius: one button with the docs Icon 14, the title, and a small
line (its revision and, until it is handed over, "Drag onto an agent"). The bar can be dragged. The button is labelled
"Doc N: title. Enter opens it; Shift+Enter hands it to an agent."; Enter opens it, and Shift+Enter or the Menu key asks
to hand it to an agent. Hover takes --border-3, focus the ring at offset 1, lifting scales it down.

## PaneTabs

The pane tab strip: 34 px on the sidebar colour, each tab with its icon, label, count and a close cross whose slot is
always kept so no tab changes width. A middle click or Delete closes a tab, a right click opens its menu, and a strip
too tight for every label shows only the icon of its inactive tabs. Only the chosen tab is in the Tab order: Left and
Right choose its neighbours and Home and End the ends. The pane's own buttons come in the slot at the right. The tab's
menu offers Dock left, right, above and below as well as Detach and the closes, and opens by the Menu key or Shift and
F10 as well as a right click.

## CodeLine

One line of a read-only file: a gutter 50 wide with the right-aligned number (padding-right 14, the theme's gutter
colour) and the code in the slot, mono --text-small at line height 20 with padding-right 80. A selected line takes the
theme's selection fill. A 6px dot at left 10, top 7 marks a comment (the theme's marker) or a draft (hollow). The theme
comes from the --code-gutter, --code-selection and --code-marker variables of the file around it. The gutter is a
button: a click picks the line (Shift extends), Up and Down move the line cursor (Shift extends the selection) and C
asks to comment. Only the cursor line is in the tab order.

## ChipButton

A chip that acts or toggles: a reaction, a sequence run, a window chip, a docked card beside the composer, a suggested
answer, a graph link. Sizes xs 20, sm 22, md 24 and lg 28; square (radius 5 at 20 and 22, 7 at 24 and 28) or pill. The
leading slot holds an icon, a dot or a spinner; count trails in tabular numbers. A toggle takes pressed (aria-pressed);
`own` gives the viewer's own reaction the brand border; `selected` marks the active window's chip.

## Panel

A panel that belongs to the page beside it, open over it and not modal: a PanelHeader (the leading slot, title, count
and a close button) over a scrolling PanelBody (the default slot), in a --raised box with a --border-2 border, radius
--radius-card and --shadow-pop. The chat placement sits at top 8, right 4 and bottom 8 and is 380 wide at most; the side
placement fills the height of its container at its right edge. It is a role dialog named by its title. It opens with the
focus on its close button, Escape closes it from anywhere inside, fields included, and the focus returns to what had it
before it opened. It slides in from 24px over 240ms with its opacity and leaves over 180ms, and without motion under
reduced motion.

## MenuItem

One row of a Menu: a leading slot (an Icon at 14, an Avatar sm, or nothing), the label and subline in the default slot,
and a trailing slot (a bare Kbd). It is a link when it has an href, otherwise a button that a form around it may submit,
and the caller listens to its click. A ticked item (checked is true or false) is a menuitemcheckbox, or a menuitemradio
when it is one of a choice, and draws a tick while it is checked. A pending item shows a spinner and cannot be chosen
twice. The Menu above it moves focus between items and skips a disabled one. In a ListBox it is an option (option is
set, with an id): it has role option, aria-selected while it is the ListBox's active id, and the active look.

## TreeItem

One row of a Tree, 24 high, in --text-field --text-2: a chevron 12 (or a spacer for a leaf), an Icon 14 and the label
with an ellipsis, indented 8 plus 14 per level. Hover --hover; selected --sel and --text; the ring at offset -2. It is a
treeitem with aria-level, aria-selected and, for a folder, aria-expanded; only one item of the Tree is in the tab order.
Up and Down walk, Right opens a folder and then enters it, Left closes it and then goes to the parent, Enter opens the
item. The chevron turns 90 degrees over 120 ms, and not at all under reduced motion.

## ContextMenu

A menu at the pointer for whatever sits under it: the default slot is the host, the menu slot holds the MenuItems the
target has. A right click, the Menu key or Shift+F10 on the host opens it (the keys at the focused element) on its first
enabled item. It does not open over selected text, so Copy works there, nor over a field. It sits 6px inside the window
and flips above the point when it would pass the bottom. Escape closes it and gives the focus back to what had it, Tab
closes it and moves on, choosing an item closes it. It enters over 180ms with a 4px rise, and without motion under
reduced motion.

## Block

One block of a document a reader can comment on: a paragraph, a heading, a list item or a code block, with radius 6.
Code is mono 12 on --code-bg with a 1px --line border, radius 8 and padding 10 12. A selected block takes a 9% --brand
wash; a block with a comment shows a 2px --border-3 bar in the margin to its left, so its text does not move. The line
number goes on data-line for the LineCommentable that selects it. A click picks the block (Shift extends), Up and Down
move the cursor (Shift extends the selection) and C asks to comment; only the cursor block is in the tab order.

## SplitButton

A create action whose second way sits behind a chevron: a main Button (an Icon and the label) and a chevron that opens a
Menu of the other ways, which are the default slot's MenuGroup and MenuItems. Both halves have a --border-2 border on
--bg in --text; the main half is round on its left (7px), the chevron on its right with no left border and a padding of
6, and each has its own hover and its own focus ring, raised above its neighbour. The hint, when given, is the main
half's Tooltip (the plain way, spelled out). The chevron has aria-haspopup menu and the name "More ways to create a
<noun>". A disabled button disables both halves.

## MenuTrigger

A button that shows what is chosen and opens a Menu, in three variants. The pill is 26px high and round, with a
--border-2 border on --raised, for an Icon or AvatarStack, a name and a Spinner while its agent works. The field is 24px
high with a --line border and medium weight, for an sm Avatar and a name. The who is bare, for a large Avatar or
AvatarStack, a name and a subline of --text-badge --text-3 that ends in an ellipsis; it takes --hover on hover. Each
ends in a caret. A drop target takes --hover with a 2px --focus outline at offset 1. The leading slot holds the Icon or
Avatar, the default slot the Menu's items. It opens with Enter, Space and Down (aria-haspopup menu and aria-expanded,
from the Menu).

## Menu

A button that opens a labelled menu of MenuItems, MenuGroups and MenuSeparators. Enter, Space or Down opens it on its
first enabled item and Up on its last; Down and Up then move and wrap, Home and End jump, and typing letters moves to
the item that starts with them. Enter and Space run an item, Escape closes the menu and gives the focus back to the
button, Tab closes it and moves on, and choosing an item closes it. The items stay mounted, so a form keeps its state.
The button holds a three-dot icon unless the trigger slot fills it. When the item in focus goes, the first item left
takes the focus; when none is left, the menu closes and the button takes it. The menu enters over 180ms with a 4px rise,
and without motion under reduced motion.

## Dialog

A modal task over a Scrim, above everything else: the title, the body in the default slot and the footer in its slots
sit in a DialogContent (size sm, md or lg). It is placed in the middle or 64 or 72 from the top, or as pane in the
middle of the positioned part it stands in, such as one pane, covering only that part. It opens with the focus on
initialFocus (a selector inside it), else on its first field, else on the dialog itself; Tab and Shift+Tab loop inside
it; Escape and a click on the Scrim ask the owner to close it through close; and when it closes the focus returns to
returnFocus, else to what had it before it opened. It enters over 180ms with a 4px rise and its opacity, and without
motion under reduced motion.

## IconButton

Renders its default slot as it is, with no tooltip around it and nothing to describe it.

## Button

A text action: ghost (default), bordered, primary, quiet-to-primary (muted until `filled` says there is content, then
primary; the Send button), plus danger and icon for existing callers, and word: a word, with or without an icon, that
has no border and no fill, as the hover controls on a message's name line are drawn. Sizes: md is 28 px, sm is 24 px
(small and normal are the same two, and large is 36 px). A leading icon goes in the icon slot; pressed shows
aria-pressed. A pending button keeps its width, hides its label behind a spinner and cannot be pressed twice. A disabled
button takes no pointer, so a reason goes on a Tooltip around it.

## UsageMeter

How much of an allowance is used, in three forms. Row: a md Meter 84 wide with both numbers in its Tooltip, or the
amount left in --text-2 for a key with no windows. Group: a SettingRow per window with "Resets …" and a lg Meter 220
with "n% used", which turns --text at 500 from 90%. Spend: "Left to spend" with the amount in bold, and "Spent" with a
SegmentedControl of periods and a sentence. Each form reads only the props named for it. A row with no reading says
Usage unavailable instead of falling back to zero; a measured zero is drawn with its unit.

## Input

A one-line text input in the shared input look: md is 30 px high, sm is 28 px; a --border-2 border, radius
--radius-field, --bg fill, --text-field; the focus ring at offset 1; invalid (aria-invalid) turns the border --danger.
`bare` drops the box for an input that sits inside another control, such as the search field. A parent that holds it by
ref can focus() it.
