"""handoff — the two prompts that make an environment ready, and run it, by agents.

THE MAIN AGENT DISPATCHES TWICE AND DOES NOTHING ELSE. A hand-off is a HAND-OFF AGENT that
fetches the source, writes the brief, plans (dispatching a planner and a critic if it can),
pins what must hold, writes the to-dos in order and validates the page — then says READY.
Then a RUNNER works the to-dos. Both are subagents of the session that asked, on an
environment the session delegated, so their journal lands there under the hooks.

WHAT A HAND-OFF MEANS IS A FILE. `handoff.default.md` ships with the package;
`.journal/handoff.md` is the project's own and wins when it exists, and an update never
touches it. Two sections, one per agent; placeholders {name}, {source}, {page}.
"""
from __future__ import annotations

import re
from pathlib import Path

DEFAULT = "handoff.default.md"
PROJECT = "handoff.md"
SECTIONS = ("handoff agent", "runner agent")


def template(root: Path) -> tuple[str, str]:
    """(the template text, where it came from)."""
    own = root / PROJECT
    if own.is_file():
        return own.read_text(), f".journal/{PROJECT}"
    return (root / DEFAULT).read_text(), f".journal/{DEFAULT} (the shipped one; copy it to .journal/{PROJECT} to change it)"


def section(text: str, name: str) -> str:
    """The body under `# <name>`, up to the next top-level heading, reflowed.

    THE FILE IS WRAPPED FOR AN EDITOR, THE PROMPT FOR A READER. Line breaks inside a
    paragraph or a list item are the file's; joined here, so the printer wraps each at its
    own width instead of breaking a sentence twice. A blank line still separates
    paragraphs, and a `{page}` placeholder stays on a line of its own.
    """
    m = re.search(rf"^# {re.escape(name)}\s*$(.*?)(?=^# |\Z)", text, re.S | re.M)
    return reflow((m.group(1) if m else "").strip())


_ITEM = re.compile(r"^(\d+\.\s+|[-•]\s+)")


def reflow(text: str) -> str:
    out: list[str] = []
    for para in re.split(r"\n\s*\n", text):
        lines = [ln.rstrip() for ln in para.splitlines() if ln.strip()]
        if not lines:
            continue
        if lines[0].strip() == "{page}":
            out.append("{page}")
            continue
        items: list[str] = []
        for ln in lines:
            if _ITEM.match(ln) or not items:
                items.append(ln.strip())
            else:
                items[-1] += " " + ln.strip()
        out.append("\n".join(items))
    return "\n\n".join(out)


def prompt(root: Path, which: str, name: str, source: str = "", page: str = "") -> tuple[str, str]:
    """(the filled prompt for `which` agent, the template's origin)."""
    text, origin = template(root)
    body = section(text, which)
    if not body:
        return "", origin
    return body.replace("{name}", name).replace("{source}", source or "(none given — ask the user)").replace("{page}", page), origin
