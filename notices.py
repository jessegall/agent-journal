from __future__ import annotations

from pathlib import Path

import state
from pins import age
from templates import render

KEY = "notices"

#: what a notice LOOKS like, and nothing more: the agent picks the tone, the viewer picks the colour
TONES = ("note", "good", "warn")

MESSAGES = {
    "needs_text": 'a notice needs its line: journal notice "<what the user should see>"',
    "bad_tone": "{tone} is not a tone; use note, good or warn",
    "too_long": "a notice is one line the user reads at a glance — {n} characters is a message, not a notice",
    "pinned": "notice {n} is at the top of the chat until the user closes it",
    "no_notice": "there is no notice {n}. `journal notices` numbers them.",
    "already_gone": "notice {n} is already down",
    "took_down": "notice {n} is down",
    "fact_up": "up",
    "fact_down": "closed[ {age}]",
    "fact_tone": "{tone}",
}

#: one line, read at a glance over the conversation — anything longer is a message in the thread
TEXT_MAX = 160


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def standing(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    """What is on the chat right now: pinned, not yet closed by the user."""
    return [(n, x) for n, x in enumerate(_all(root, track), 1) if not x.get("closed_at")]


def add(root: Path, text: str, at: str, tone: str = "note", link: str = "", label: str = "",
        source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    text = " ".join((text or "").split())
    if not text:
        return False, say("needs_text")
    if len(text) > TEXT_MAX:
        return False, say("too_long", n=len(text))
    tone = (tone or "note").strip().lower()
    if tone not in TONES:
        return False, say("bad_tone", tone=repr(tone))
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "tone": tone, "link": (link or "").strip(),
                      # THE BUTTON SAYS WHAT IT DOES. A bare "open" beside a link is a link with a
                      # worse name; the agent says "Open the PR", "See the preview", "Read the report".
                      "label": " ".join((label or "").split())[:32] or "open",
                      "source": source, "closed_at": None, "closed_by": ""})
        _put(root, items, track)
        n = len(items)
    return True, say("pinned", n=n)


def close(root: Path, n: int, at: str, by: str = "user", track: str | None = None) -> tuple[bool, str]:
    """Take it down. THE USER'S X IS THE NORMAL WAY; the agent can retire its own when it stops being true."""
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_notice", n=n)
        if items[n - 1].get("closed_at"):
            return False, say("already_gone", n=n)
        items[n - 1]["closed_at"], items[n - 1]["closed_by"] = at, by
        _put(root, items, track)
    return True, say("took_down", n=n)


def facts(x: dict) -> list[str]:
    out = [say("fact_down", age=age(x.get("closed_at") or "")) if x.get("closed_at") else say("fact_up")]
    out.append(say("fact_tone", tone=x.get("tone") or "note"))
    if age(x.get("at", "")):
        out.append(age(x["at"]))
    return out


def row_response(n: int, x: dict) -> dict:
    return {"n": n, "text": x.get("text") or "", "tone": x.get("tone") or "note",
            "link": x.get("link") or "", "label": x.get("label") or "open", "at": x.get("at") or "",
            "closed": bool(x.get("closed_at")), "closed_at": x.get("closed_at") or "",
            "meta": " · ".join(facts(x))}
