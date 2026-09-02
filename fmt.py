"""How every command prints: plain terminal text, one house style.

THE TERMINAL DOES NOT RENDER MARKDOWN. A `#` heading is a hash on screen, a backtick is
a backtick, and a question folded into a metadata line is a paragraph nobody can find the
start of. Measured: `journal todo 13` opened with a title behind a hash, then "written 4h
ago · line 4874 · waiting on the user: The old /definitions…" running for nine lines. The
question was there and the user could not see it.

So: a title is a plain line, bold when stdout is a terminal. Facts sit behind labels.
Anything longer than a line — a question, a brief — gets a section of its own. Commands
are printed as they are typed, in a column with what they do. Nothing is decorated.
"""
from __future__ import annotations

import sys
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


def wrap(text: str, indent: int = 2, width: int = WIDTH) -> str:
    """A paragraph, or several, at an indent. Blank lines between paragraphs survive."""
    pad = " " * indent
    paras = [" ".join(p.split()) for p in (text or "").split("\n\n") if p.strip()]
    return "\n".join(textwrap.fill(p, width=width, initial_indent=pad, subsequent_indent=pad)
                     for p in paras)


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


def commands(rows: list[tuple[str, str]], indent: int = 2) -> str:
    """Commands as they are typed, in a column, with what each does."""
    pad = " " * indent
    w = max((len(c) for c, _ in rows), default=0)
    return "\n".join(f"{pad}{c:<{w}}   {dim(what)}" if what else f"{pad}{c}" for c, what in rows)


def facts(rows: list[tuple[str, str, str]], indent: int = 2) -> str:
    """label   value   command — the status page's shape."""
    pad = " " * indent
    lw = max((len(l) for l, _, _ in rows), default=0)
    vw = min(58, max((len(v) for _, v, _ in rows), default=0))
    out = []
    for label, value, cmd in rows:
        if len(value) > vw:
            value = value[:vw - 1] + "…"
        out.append(f"{pad}{label:<{lw}}   {value:<{vw}}   {dim(cmd)}".rstrip())
    return "\n".join(out)
