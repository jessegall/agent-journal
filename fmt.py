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

WIDTH = 88


def _tty() -> bool:
    try:
        return sys.stdout.isatty()
    except Exception:
        return False


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


def block(text: str, width: int = WIDTH) -> str:
    """What the hook hands the harness, made readable: paragraphs wrapped, commands kept.

    A hold, a denial, a start block, a hint — each is text the agent (and, in the
    terminal, the user) reads. A paragraph longer than the width is wrapped; a line that
    is indented, or is a command or a list item, is kept as it is, because wrapping a
    command breaks it and wrapping a column breaks the column.
    """
    import re
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


def say(text="", *, error: bool = False) -> None:
    """THE ONE WAY OUT OF EVERY COMMAND. Whatever a command has to say passes through here.

    So the house style is enforced in one place: an error is one line with `!` in front
    on stderr, a plain paragraph longer than the width is wrapped, and a line that is
    already shaped — indented, in columns, a command — is printed as it is. A command
    that formats its own output is a command whose output nobody checked.
    """
    text = "" if text is None else str(text)
    if error:
        lines = text.split("\n")
        if lines and lines[0].strip() and not lines[0].lstrip().startswith("!"):
            lines[0] = "  ! " + lines[0].strip()
        text = "\n".join(lines)
    print(block(text), file=sys.stderr if error else sys.stdout)


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
