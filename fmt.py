"""How every command prints: plain terminal text, one house style.

THE TERMINAL DOES NOT RENDER MARKDOWN. A `#` heading is a hash on screen, a backtick is
a backtick, and a question folded into a metadata line is a paragraph nobody can find the
start of. Measured: `journal todos 13` opened with a title behind a hash, then "written 4h
ago · line 4874 · waiting on the user: The old /definitions…" running for nine lines. The
question was there and the user could not see it.

So: a title is a plain line, bold when stdout is a terminal. Facts sit behind labels.
Anything longer than a line — a question, a brief — gets a section of its own. Commands
are printed as they are typed, in a column with what they do. Nothing is decorated.
"""
from __future__ import annotations

import sys
import re
import textwrap
from typing import NamedTuple

WIDTH = 88


def _tty() -> bool:
    try:
        return sys.stdout.isatty()
    except Exception:
        return False


#: HOW THE CLI IS SPELLED TO A READER, and it is not a constant because it depends on where
#: the reader is standing.
#:
#: `.journal/journal.py` IS ONLY RIGHT FROM THE FOLDER THAT HOLDS THE JOURNAL. The layout
#: this broke on is ordinary and in daily use: a root that is not a repository, holding the
#: journal and several repositories under it. An agent working in `chronos/`, or in
#: `chronos/.claude/worktrees/x/`, ran the command every one of these lines told it to run
#: and got "No such file or directory" — from a system whose entire job is telling an agent
#: what to run.
#:
#: SO IT IS COMPUTED, ONCE, AGAINST THE JOURNAL'S REAL LOCATION AND THE READER'S CWD. The
#: relative spelling survives while it is honest — it is what a person recognises and what
#: every doc says — and the absolute path takes over the moment the relative one would lie.
_CLI: list = []


def cli(root=None) -> str:
    """The prefix every printed path needs to start with, to resolve from where we are.

    `.journal/` when that is honest, and the journal's absolute location when it is not.
    """
    if _CLI:
        return _CLI[0]
    import os
    from pathlib import Path as _P
    if root is None:
        return CANON
    here = _P(root)
    try:
        rel = os.path.relpath(here, _P.cwd())
    except (OSError, ValueError):
        rel = str(here)
    rel = rel.rstrip("/") + "/"
    # A PATH THAT CLIMBS OUT OF THE CURRENT DIRECTORY IS NOT WORTH THE PRETTINESS. `../../..`
    # is correct and unreadable, and it stops being correct the moment the reader cds.
    _CLI.append(rel if not rel.startswith("..") else str(here).rstrip("/") + "/")
    return _CLI[0]


def bold(text: str) -> str:
    return f"\033[1m{text}\033[0m" if _tty() else text


def dim(text: str) -> str:
    return f"\033[2m{text}\033[0m" if _tty() else text


def title(text: str, *, sub: str = "") -> str:
    """The first line of an output: what this is, and the one fact that scopes it."""
    line = bold(text)
    return line + (f"  {dim(sub)}" if sub else "")


def section(name: str) -> str:
    return "\n" + bold(name.upper())


#: A COMMAND IS NOT PROSE AND MUST NOT BE BROKEN ACROSS LINES. `\u00a0` is a space to the
#: reader and not a break point to `textwrap`, so a backticked run survives the fill whole
#: and can be copied out of the terminal in one go. Measured the hard way: "`work update`"
#: came back as "`work" on one line and "update`" on the next.
def _knit(text: str) -> str:
    return re.sub(r"`[^`\n]+`", lambda m: m.group(0).replace(" ", "\u00a0"), text)


def _unknit(text: str) -> str:
    return text.replace("\u00a0", " ")


def wrap(text: str, indent: int = 2, width: int = WIDTH) -> str:
    """A paragraph, or several, at an indent. Blank lines between paragraphs survive.

    THEY DID NOT SURVIVE. This split on the blank line, wrapped each paragraph, and then
    joined them with ONE newline — so every multi-paragraph message this package prints
    arrived as a single block with the breaks its author put in silently removed. The
    docstring above has claimed otherwise since the function was written, which is why
    nobody looked: the separator was read once, believed, and never measured against what
    came out. It is the funnel every command's prose goes through, so it is also the
    reason the same complaint kept coming back about different screens.
    """
    pad = " " * indent
    paras = [_knit(" ".join(p.split())) for p in (text or "").split("\n\n") if p.strip()]
    return _unknit("\n\n".join(
        textwrap.fill(p, width=width, initial_indent=pad, subsequent_indent=pad)
        for p in paras))


def numbered(n: int, text: str, meta: str = "", *, struck: bool = False, width: int = WIDTH) -> str:
    """One entry of a list: the number, the text wrapped under it, the facts beneath."""
    num = f"{n:>3}  "
    pad = " " * len(num)
    body = " ".join(text.split())
    if struck:
        body = "~~" + body + "~~"
    out = textwrap.fill(body, width=width, initial_indent=num, subsequent_indent=pad)
    if meta:
        out += "\n" + textwrap.fill(meta, width=width, initial_indent=pad, subsequent_indent=pad)
    return out


def commands(rows: list[tuple[str, str]], indent: int = 2, width: int = WIDTH) -> str:
    """Commands as they are typed, in a column, with what each does — inside `width`.

    IT USED TO BOUND NOTHING. `wrap`, `numbered` and `table` all keep to the width; this one
    took no width at all and never wrapped a description, so six of the eight trailing
    command lists in the CLI ran past 88 columns — `journal tools` to 131 characters — and
    the two that fitted did so because their descriptions happened to be short. A guarantee
    that holds by accident of content is not a guarantee.

    THE COMMAND ITSELF IS NEVER BROKEN. It is what the reader copies, so a line that cannot
    fit puts its description underneath rather than wrapping the command mid-flag.
    """
    pad = " " * indent
    w = max((len(c) for c, _ in rows), default=0)
    out = []
    for c, what in rows:
        if not what:
            out.append(f"{pad}{c}")
            continue
        head = f"{pad}{c:<{w}}   "
        if len(head) + len(what) <= width:
            out.append(head + dim(what))
        elif len(head) < width - 20:
            out.append(_unknit(textwrap.fill(_knit(what), width=width, initial_indent=head,
                                             subsequent_indent=" " * len(head))))
            out[-1] = dim_body(out[-1], len(head))
        else:
            out.append(f"{pad}{c}")
            out.append(textwrap.fill(what, width=width, initial_indent=pad + "    ",
                                     subsequent_indent=pad + "    "))
            out[-1] = dim(out[-1])
    return "\n".join(out)


def dim_body(line: str, head: int) -> str:
    """Dim everything after the command column, keeping the command bright."""
    return line[:head] + dim(line[head:]) if _tty() else line


def facts(rows: list[tuple[str, str, str]], indent: int = 2, width: int = WIDTH) -> str:
    """label   value   command — the status page's shape, inside `width`.

    IT BOUNDED THE VALUE AND NOTHING ELSE. The value column was capped at 58 and the label
    and trailing command were not, so the bare `journal` screen ran to 97 characters — a
    second renderer with the same defect `commands` had, which the known one did not
    explain. The value is what gives now, because it is the only column that can be cut
    without taking away something the reader has to type.
    """
    pad = " " * indent
    lw = max((len(l) for l, _, _ in rows), default=0)
    cw = max((len(c) for _, _, c in rows), default=0)
    room = width - indent - lw - cw - 6
    vw = min(max(room, 12), max((len(v) for _, v, _ in rows), default=0))
    out = []
    for label, value, cmd in rows:
        if len(value) > vw:
            value = value[:vw - 1] + "…"
        out.append(f"{pad}{label:<{lw}}   {value:<{vw}}   {dim(cmd)}".rstrip())
    return "\n".join(out)


def table(rows: list[tuple[str, str]], indent: int = 2, gap: int = 3, col: int = 26, width: int = WIDTH) -> str:
    """Two columns: a name on the left, what it is on the right, wrapped in its column.

    A row whose name is empty continues the row above: metadata, a path, a file inside a
    folder — anything that belongs under the name without repeating it. The left column
    is as wide as the widest name, up to `col`; a longer name gets its own line.
    """
    pad = " " * indent
    w = min(col, max((len(n) for n, _ in rows if n), default=0))
    out = []
    for name, text in rows:
        body = " ".join((text or "").split())
        if len(name) > w:
            out.append(f"{pad}{name}")
            name = ""
        first = f"{pad}{name:<{w}}{' ' * gap}"
        rest = " " * len(first)
        if not body:
            out.append(first.rstrip())
            continue
        out.append(_unknit(textwrap.fill(_knit(body), width=width,
                                         initial_indent=first, subsequent_indent=rest)))
    return "\n".join(out)


#: THE PREFIX EVERY PATH IS AUTHORED WITH. Rewritten as the text leaves, to whatever
#: resolves from where the reader is standing — see `cli`. Doing it here rather than at each
#: of the sites that spell it is the difference between a rule and a habit: a line written
#: tomorrow is right without its author knowing there was a question.
#:
#: THE WHOLE PREFIX, NOT JUST THE EXECUTABLE. The first version rewrote `.journal/journal.py`
#: alone, and a dogfood agent three directories down found the gap the same afternoon: a
#: to-do's brief ends with the FILE it was written to —
#: `.journal/environments/x/todo/001-….md` — and that path resolved only from the project
#: root. Every path this package prints starts with the same four characters, so every one
#: of them was wrong from the same places, and fixing only the one that happened to be a
#: command would have left the rest to be found one at a time.
CANON = ".journal/"


def block(text: str, width: int = WIDTH) -> str:
    """What the hook hands the harness, made readable: paragraphs wrapped, commands kept.

    A hold, a denial, a start block, a hint — each is text the agent (and, in the
    terminal, the user) reads. A paragraph longer than the width is wrapped; a line that
    is indented, or is a command or a list item, is kept as it is, because wrapping a
    command breaks it and wrapping a column breaks the column.
    """
    import re
    said = cli()
    if said != CANON:
        text = (text or "").replace(CANON, said)
    out = []
    for para in (text or "").split("\n"):
        # a `journal:` line is the hook's one-liner, one line by ruling: the user sees it
        # in the terminal as a single notice and opens `journal next` for the rest
        if len(para) <= width or para.startswith((" ", "\t", "|", "journal:")):
            out.append(para)
            continue
        item = re.match(r"^(\d+\.\s+|[-•]\s+)", para)
        if item:
            out.append(textwrap.fill(para, width=width, subsequent_indent=" " * len(item.group(1))))
        else:
            out.append(textwrap.fill(para, width=width))
    return "\n".join(out)


class Item(NamedTuple):
    """ONE ROW, WHATEVER KIND OF ROW IT IS. The renderer decides how it looks.

    Every list this package prints is one of four things, and they differed only in which
    fields were filled — so they are one shape, and the four renderers that used to be
    chosen by the CALLER are chosen here instead:

        Item(n=2, text="the claim", meta="3h ago")        a pin, a to-do, a reminder
        Item(title='journal pins add "<x>"', text="…")    a command and what it does
        Item(title="context_window", text="1000000")      a setting and its value
        Item(text="a paragraph")                          prose

    That is the whole vocabulary. A caller that wants a number gives a number; one that
    wants a column gives a title; one that wants prose gives neither.
    """
    text: str = ""
    n: int = 0
    title: str = ""
    meta: str = ""
    struck: bool = False

    @property
    def layout(self) -> str:
        """Which of the four shapes this row is — from what was filled in, not from a flag.

        A caller that wants a column gives a title; one that wants a number gives a number;
        one that wants prose gives neither. There is no way to ask for a shape and no way to
        ask for one the fields do not support, which is what keeps the vocabulary at four.
        """
        return COLUMN if self.title else NUMBERED if self.n else PROSE


class Out(NamedTuple):
    """WHAT A COMMAND RETURNS, AND THE ONLY THING `say` ACCEPTS.

    THE HOUSE STYLE USED TO LIVE IN 546 DECISIONS. `say` was the one exit, but every one of
    its callers assembled its own string first — a `title`, a `\n\n`, a `commands` block,
    another `\n\n`, a footer — so the blank lines, the order, the indent and the trimming
    were re-decided at every site. That is why the same complaint about a wall of text kept
    coming back in a different screen each time: there was no place to fix it once.

    So a command describes WHAT it is saying and never how. `render` below is the only code
    in the package that decides what a heading looks like, where the air goes, and how a row
    is laid out — and `say` is the only thing that writes to a stream.

    `items` may hold an `Out` as well as an `Item`: that is a section, rendered by the same
    function one level in, which is how a page with several groups is built without any
    caller joining two rendered strings together.
    """
    lead: str = ""              # the paragraph under the heading — or the whole message
    title: str = ""             # "PINS"
    sub: str = ""               # "environment reminders · 7 standing"
    items: tuple = ()           # Item | Out
    footer: str = ""            # the prose or the commands under the body
    error: bool = False         # the marker and the stream. Nothing else.


#: THE FOUR SHAPES A ROW CAN TAKE, and the function that lays each one out. A dispatch
#: table rather than a chain of `if`s: adding a shape is adding an entry, the signatures
#: are uniform, and no caller can reach a half-applied branch. Which shape a row is comes
#: from `Item.layout` — decided by what the caller filled in, never asked for by name.
COLUMN, NUMBERED, PROSE = "column", "numbered", "prose"

#: The narrowest a value column may be before its group stacks instead.
_ROOM = 34


def _column(i: "Item", width: int) -> str:
    """A name, its value beside it in a column, its facts beneath.

    COLUMNS ARE A PROPERTY OF THE GROUP. `width` is the widest title in the group, passed
    in rather than measured here, so every row of one group aligns and no caller can get
    half a table. The name itself is never broken: it is what the reader copies.
    """
    if not i.text:
        return f"  {i.title}"
    # STACKED WHEN THE COLUMN WOULD NOT LEAVE ROOM TO READ. `width` is 0 when the group
    # decided that — see `_rows`. The name keeps its own line whole, because it is what the
    # reader copies, and the value goes underneath it.
    if not width:
        return f"  {i.title}\n" + dim(_fill(i.text, "      ")) + (
            f"\n      {dim(i.meta)}" if i.meta else "")
    head = f"  {i.title:<{width}}   "
    body = dim_body(_fill(i.text, head), len(head))
    return body + (f"\n{' ' * len(head)}{dim(i.meta)}" if i.meta else "")


def _numbered(i: "Item", width: int) -> str:
    """A numbered entry: a pin, a to-do, a reminder. The number is what commands take."""
    return numbered(i.n, i.text, i.meta, struck=i.struck)


def _prose(i: "Item", width: int) -> str:
    """A paragraph, with anything qualifying it indented beneath."""
    return wrap(i.text) + (f"\n{wrap(i.meta, indent=4)}" if i.meta else "")


_LAYOUTS = {COLUMN: _column, NUMBERED: _numbered, PROSE: _prose}

#: HOW MUCH AIR GOES BETWEEN TWO ROWS, and it is a property of the rows, not of the caller.
#: A column group is a table and reads as one block; numbered entries and paragraphs each
#: need a line of their own to be findable. So: two columns sit together, and anything else
#: is separated. One rule, applied between every adjacent pair, with no run-detection and
#: nothing for a caller to pass in.
def _air(a, b) -> str:
    return "\n" if getattr(a, "layout", None) == COLUMN == getattr(b, "layout", None) else "\n\n"


def _fill(text: str, head: str) -> str:
    """One paragraph wrapped under a hanging indent, with backticked runs kept whole."""
    return _unknit(textwrap.fill(_knit(" ".join((text or "").split())), width=WIDTH,
                                 initial_indent=head, subsequent_indent=" " * len(head)))


def _rows(items) -> str:
    """A group of items as text, with one blank line between them.

    The only branch here is structural: an `Out` among the items is a SECTION, and it is
    rendered by the same function one level in. Everything else is a row, and which kind
    of row it is was decided when it was written.
    """
    rows = [i for i in items if i is not None]
    width = max((len(i.title) for i in rows if isinstance(i, Item)), default=0)
    # THE GROUP DECIDES, ONCE, FOR ALL OF ITS ROWS. One 58-character command in
    # `journal reminders` left 20 columns for every description in the group and turned each
    # into a four-line sliver. Below `_ROOM`, the whole group stacks instead — a table that
    # is unreadable in the columns it needs is not a table, and a group where some rows are
    # columns and others are stacked is worse than either.
    if width and WIDTH - width - 5 < _ROOM:
        width = 0
    laid = [(i, render(i) if isinstance(i, Out) else _LAYOUTS[i.layout](i, width))
            for i in rows]
    laid = [(i, t) for i, t in laid if t]
    out = laid[0][1] if laid else ""
    for (prev, _), (this, text) in zip(laid, laid[1:]):
        out += _air(prev, this) + text
    return out


def render(out) -> str:
    """AN `Out` AS TEXT. The only code that decides where the air goes.

    One blank line after a heading, one between groups, none at the ends. A refusal is
    marked once — `say(error=True)` puts `!` on the first line of whatever it is given, so
    a refusal built from five calls announced itself five times, and a marker repeated down
    a page means nothing.
    """
    if isinstance(out, str):
        out = Out(lead=out)
    parts = []
    if out.title:
        parts.append(title(out.title, sub=out.sub))
    if out.lead:
        parts.append(wrap(out.lead))
    body = _rows(out.items)
    if body:
        parts.append(body)
    if out.footer:
        parts.append(wrap(out.footer))
    return block(_marked("\n\n".join(p for p in parts if p).rstrip(), out.error))


def _marked(text: str, error: bool) -> str:
    """A refusal announces itself ONCE, on its first line, BEFORE the text is wrapped.

    Both halves of that matter and both were learned by breaking them. Marking every call
    made a refusal built from five `say`s announce itself five times. Marking AFTER the
    wrap shifts the first line by four characters without re-wrapping it, so the break
    points move and a command splits across two lines — which is the one thing this
    package will not do to a command.
    """
    if not error:
        return text
    lines = text.split("\n")
    if lines and lines[0].strip() and not lines[0].lstrip().startswith("!"):
        lines[0] = "  ! " + lines[0].strip()
    return "\n".join(lines)


def say(out="", *, error: bool = False) -> None:
    """THE ONE WAY OUT OF EVERY COMMAND, and the one SHAPE for everything migrated to it.

    An `Out` is DESCRIBED — a title, rows, a footer — and `render` decides where the air
    goes. That is the destination for every caller.

    A BARE STRING IS A SITE NOT YET MIGRATED, and it is passed through `block` exactly as
    it always was, because a string arriving here is already shaped: it has been through
    `commands` or `table` or `numbered` at the call site, and wrapping it as prose would
    reflow a column into a paragraph. Both forms end at `block`, which is the one gate that
    decides what a line may look like — so this is one funnel with a queue behind it, not
    two paths.
    """
    if isinstance(out, Out):
        out = out._replace(error=out.error or error)
        text, error = render(out), out.error
    else:
        text = block(_marked("" if out is None else str(out), error))
    print(text, file=sys.stderr if error else sys.stdout)


def notice(text: str) -> None:
    """`journal: <text>` — one line, always to stderr, for something that happened off to
    the side of whatever a command is answering: a mark that could not be filed because
    there was no transcript to file it under, a lock that timed out and was proceeded
    past, a tool that failed to run.

    SIX PLACES SPELLED THIS DIFFERENTLY. Most wrote `journal: ...` to stderr by hand, each
    with its own idea of the wording; `tools.py` wrote the `  ! ` error marker instead —
    a second implementation of what `say(error=True)` already does, for a message that was
    never part of any command's `Out`. Both are the same thing: a warning, one line, aside
    from the command's own output. This is its one shape now.

    `block` is still the gate — a `journal:` line is kept whole rather than wrapped, same as
    every other line this package marks that way — so a long interpolated reason still
    reads as one notice instead of breaking across two.
    """
    print(block(f"journal: {text}"), file=sys.stderr)


DESC, ASC = "desc", "asc"
ORDERS = (DESC, ASC)


def ordered(rows: list, order: str = DESC) -> list:
    """The rows as they should be READ: newest first unless asked otherwise.

    EVERY LIST HERE IS APPEND-ONLY, so its natural order is oldest first — which is the
    order nobody wants. A reader opening `journal pins` or `journal docs` is looking for
    what happened recently, and with a cap they were being handed the oldest page and told
    there were more. The store's order is not touched: only the reading is reversed, and
    the NUMBER travels with the row, so `pin 3` is pin 3 on either setting.
    """
    return list(rows) if order == ASC else list(reversed(rows))


def paged(rows: list, cap: int | None, page: int = 1, order: str = DESC) -> tuple[list, int]:
    """(the slice to show, how many are left after it). Order first, then cut."""
    rows = ordered(rows, order)
    total = len(rows)
    if not cap:
        return rows, 0
    return rows[(page - 1) * cap: page * cap], max(0, total - page * cap)


def cut(shown: int, total: int, command: str) -> str:
    """The line that says what an injected block left out — "" when it left out nothing.

    NOTHING IS DROPPED, AND THIS IS THE SENTENCE THAT KEEPS THAT TRUE. What crosses a
    compaction used to be uncapped on principle: `pins.py` swears that a tier which
    silently forgets is the failure the whole system exists to prevent. Then a real record
    grew to 125 rules and 194 pins, the assembled block hit 120,360 characters against a
    documented 10,000-character ceiling, and the harness replaced the whole thing with a
    path to a file nobody was told to open. The uncapped rule did not protect the record;
    it lost it.

    So the store is still never trimmed — only one injection is, and the trim SAYS SO,
    counts both halves, and names the command that reads the rest in full. The reader is
    never left to infer that something is missing.
    """
    if shown >= total:
        return ""
    return (f"\n  … and {total - shown} more of {total} — none dropped: "
            f"`{command}` reads every one, in full, right now.")


def more(noun: str, left: int, page: int, order: str = DESC) -> str:
    """The one line that says a page was cut, carrying the order so the next page keeps it."""
    if left <= 0:
        return ""
    flag = f" --order={order}" if order != DESC else ""
    return f"\n\n  … and {left} more; `journal {noun} --page={page + 1}{flag}` shows the rest."
