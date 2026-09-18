from __future__ import annotations

import sys
import re
import textwrap
from typing import NamedTuple
from templates import render as fill

WIDTH = 88
#: Below this a reflowed paragraph is worse than the hard wrap it replaced.
_FLOOR = 46


def room(width: int | None = None) -> int:
    want = WIDTH if width is None else width
    if not _tty():
        return want
    import shutil
    return max(_FLOOR, min(want, shutil.get_terminal_size((WIDTH, 24)).columns - 2))


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


#: THE FLAGS THIS INVOCATION CARRIED, put back on every command it prints. Empty for a
#: session, which is the common case and must stay clean.
_FLAGS: list = []


def acting_as(env: str = "", agent: str = "") -> str:
    bits = " ".join(x for x in (f'--env="{env}"' if env else "",
                                f'--as="{agent}"' if agent else "") if x)
    _FLAGS[:] = [bits] if bits else []
    return bits


def _flagged(text: str) -> str:
    if not _FLAGS:
        return text
    import re
    import help as _h
    verbs = set(_h.GROUPS) | set(_h.ALIAS)
    return re.sub(r"\bjournal (?=([a-z-]+))",
                  lambda m: f"journal {_FLAGS[0]} " if m.group(1) in verbs else m.group(0),
                  text)


def bold(text: str) -> str:
    return f"\033[1m{text}\033[0m" if _tty() else text


def dim(text: str) -> str:
    return f"\033[2m{text}\033[0m" if _tty() else text


def title(text: str, *, sub: str = "", width: int | None = None) -> str:
    width = room(width)
    if not sub:
        return bold(text)
    if len(text) + 2 + len(sub) <= width:
        return f"{bold(text)}  {dim(sub)}"
    return bold(text) + "\n" + dim(textwrap.fill(sub, width=width,
                                                 initial_indent="  ", subsequent_indent="  "))


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


def wrap(text: str, indent: int = 2, width: int | None = None) -> str:
    width = room(width)
    pad = " " * indent
    paras = [_knit(" ".join(p.split())) for p in (text or "").split("\n\n") if p.strip()]
    return _unknit("\n\n".join(
        textwrap.fill(p, width=width, initial_indent=pad, subsequent_indent=pad)
        for p in paras))


def numbered(n: int, text: str, meta: str = "", *, struck: bool = False, width: int | None = None) -> str:
    width = room(width)
    num = f"{n:>3}  "
    pad = " " * len(num)
    body = " ".join(text.split())
    if struck:
        body = "~~" + body + "~~"
    out = textwrap.fill(body, width=width, initial_indent=num, subsequent_indent=pad)
    if meta:
        out += "\n" + textwrap.fill(meta, width=width, initial_indent=pad, subsequent_indent=pad)
    return out


def commands(rows: list[tuple[str, str]], indent: int = 2, width: int | None = None) -> str:
    width = room(width)
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
    return line[:head] + dim(line[head:]) if _tty() else line


def facts(rows: list[tuple[str, str, str]], indent: int = 2, width: int | None = None) -> str:
    width = room(width)
    pad = " " * indent
    lw = max((len(l) for l, _, _ in rows), default=0)
    cw = max((len(c) for _, _, c in rows), default=0)
    spare = width - indent - lw - cw - 6
    vw = min(max(spare, 12), max((len(v) for _, v, _ in rows), default=0))
    out = []
    for label, value, cmd in rows:
        if len(value) > vw:
            value = value[:vw - 1] + "…"
        out.append(f"{pad}{label:<{lw}}   {value:<{vw}}   {dim(cmd)}".rstrip())
    return "\n".join(out)


def table(rows: list[tuple[str, str]], indent: int = 2, gap: int = 3, col: int = 26, width: int | None = None) -> str:
    width = room(width)
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


#: A LINE THAT MEANS SOMETHING BY ITS SHAPE, and so cannot be joined to its neighbour. An
#: indent is a quotation or a code block, a bullet or a number is a list, a pipe is a table,
#: a backtick fence is code, a `#` is a heading, and `journal:` is the hook's one-liner,
#: which is one line by ruling. Everything else is prose.
#: FOUR SPACES IS A CODE BLOCK, fewer is a quotation. Both are indented and only one may be
#: reflowed: a long command re-flowed at the reader's width is a command that no longer runs,
#: while a quoted paragraph left verbatim frays into stubs exactly like an un-indented one.
_CODE = re.compile(r"^(\s{4,}|\t)")
_KEEP = re.compile(r"^\s*(\||#|>|```|journal:|\d+\.\s|[-•*]\s)")


def _paragraphs(text: str):
    for para in re.split(r"\n\s*\n", text):
        lines = para.split("\n")
        if lines and any(l.strip() for l in lines):
            said = [l for l in lines if l.strip()]
            yield lines, not any(_KEEP.match(l) or _CODE.match(l) for l in said)


def _indent(lines: list) -> str:
    filled = [l for l in lines if l.strip()]
    common = min((len(l) - len(l.lstrip()) for l in filled), default=0)
    return " " * common


def block(text: str, width: int | None = None) -> str:
    said = cli()
    if said != CANON:
        text = (text or "").replace(CANON, said)
    text = _flagged(text or "")
    width = room(width)
    out = []
    for line in (text or "").split("\n"):
        if len(line) <= width or line.startswith((" ", "\t", "|", "journal:")):
            out.append(line)
            continue
        item = re.match(r"^(\d+\.\s+|[-•]\s+)", line)
        out.append(textwrap.fill(line, width=width,
                                 subsequent_indent=" " * len(item.group(1)) if item else ""))
    return "\n".join(out)


def prose(text: str, width: int | None = None) -> str:
    width = room(width)
    out = []
    for lines, flows in _paragraphs(text or ""):
        if not flows:
            # STRUCTURE IS PRINTED AS WRITTEN, AND ITS LINES STAY ADJACENT. Joining the whole
            # block with the paragraph separator put a blank line between every list item.
            out.append("\n".join(
                textwrap.fill(l, width=width, subsequent_indent=" " * len(m.group(0)))
                if (m := re.match(r"^(\s*(?:\d+\.|[-•*])\s+)", l)) and len(l) > width else l
                for l in lines))
            continue
        pad = _indent(lines)
        out.append(textwrap.fill(" ".join(l.strip() for l in lines), width=width,
                                 initial_indent=pad, subsequent_indent=pad))
    return "\n\n".join(out)


class Item(NamedTuple):
    text: str = ""
    n: int = 0
    title: str = ""
    meta: str = ""
    struck: bool = False

    @property
    def layout(self) -> str:
        return COLUMN if self.title else NUMBERED if self.n else PROSE


class Out(NamedTuple):
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
    return numbered(i.n, i.text, i.meta, struck=i.struck)


def _prose(i: "Item", width: int) -> str:
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
    return _unknit(textwrap.fill(_knit(" ".join((text or "").split())), width=WIDTH,
                                 initial_indent=head, subsequent_indent=" " * len(head)))


def _rows(items) -> str:
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
    if not error:
        return text
    lines = text.split("\n")
    if lines and lines[0].strip() and not lines[0].lstrip().startswith("!"):
        lines[0] = "  ! " + lines[0].strip()
    return "\n".join(lines)


def say(out="", *, error: bool = False) -> None:
    if isinstance(out, Out):
        out = out._replace(error=out.error or error)
        text, error = render(out), out.error
    else:
        text = block(_marked("" if out is None else str(out), error))
    print(text, file=sys.stderr if error else sys.stdout)


def notice(text: str) -> None:
    print(block(_said("notice", text=text)), file=sys.stderr)


MESSAGES = {
    "notice": "journal: {text}",
    "shortened": "\n  … shortened to a line each — `{command}` reads every one, in full, right now.",
    "cut": "\n  … and {left} more of {total}[{shortened}] — none dropped: `{command}` reads every one, in full, right now.",
    "cut_shortened": ", and these shortened to a line each",
    "order_flag": " --order={order}",
    "more": "\n\n  … and {left} more; `journal {noun} --page={page}{flag}` shows the rest.",
}

def _said(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


DESC, ASC = "desc", "asc"
ORDERS = (DESC, ASC)


def ordered(rows: list, order: str = DESC) -> list:
    return list(rows) if order == ASC else list(reversed(rows))


def paged(rows: list, cap: int | None, page: int = 1, order: str = DESC) -> tuple[list, int]:
    rows = ordered(rows, order)
    total = len(rows)
    if not cap:
        return rows, 0
    return rows[(page - 1) * cap: page * cap], max(0, total - page * cap)


def cut(shown: int, total: int, command: str, shortened: bool = False) -> str:
    # A LINE CUT SHORT NEEDS THE SAME SENTENCE AS AN ENTRY LEFT OUT. This named the reading
    # command only when the COUNT was trimmed, so a doorway showing three of three rules —
    # every one of them shortened to a line by `gist` — printed no command at all. The
    # reader was left holding three half-sentences and no way to finish them, which is the
    # silent-forgetting failure this function was written to make impossible, arrived at
    # through the other cap.
    if shown >= total:
        return _said("shortened", command=command) if shortened else ""
    return _said("cut", left=total - shown, total=total, command=command,
               shortened=_said("cut_shortened") if shortened else "")


GIST = 180


def gist(text: str, cap: int = GIST) -> str:
    text = " ".join(text.split())
    if len(text) <= cap:
        return text
    return text[:cap].rsplit(" ", 1)[0].rstrip(",;:—-") + "…"


def more(noun: str, left: int, page: int, order: str = DESC) -> str:
    if left <= 0:
        return ""
    flag = _said("order_flag", order=order) if order != DESC else ""
    return _said("more", left=left, noun=noun, page=page + 1, flag=flag)
