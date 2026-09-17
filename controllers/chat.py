from __future__ import annotations

from pathlib import Path

import tags
from controller import Controller, Payload, Result

#: how many turns the thread hands back at once, newest last
TURNS = 120

#: a turn's text is a bubble, not a document: longer than this and the thread reads as a wall
TEXT_MAX = 1200


def trim(text: str, limit: int = TEXT_MAX) -> str:
    text = (text or "").strip()
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def said(root: Path, env: str) -> list[dict]:
    """What the agent SAID on this environment: its tagged replies, in the order it said them.

    WHAT IT SAID AND WHAT IT DID ARE TWO RECORDS, AND ONLY ONE OF THEM IS A CONVERSATION. Every edit,
    command and journal write is already in the command log, which is what the Activity column draws;
    none of it belongs here. The filter is not a heuristic over that log — it is a different source.
    A reply is a turn when it opens with a tag, and the tag is a field the agent already writes, so
    nothing has to be classified and a message that merely MENTIONS a tag is not one (`tags.found`
    matches the start of the message, never the start of a line).
    """
    import tracks
    import transcript
    out = []
    for stem, info in tracks.live(root).items():
        if info["track"] != env:
            continue
        path = transcript.find(root.parent, stem)
        if path is None:
            continue
        out.extend(_turns(path, env, tracks.marks(root).get(stem)))
    return out


#: path -> (file size, the turns read out of it): the thread polls every few seconds and a
#: transcript only grows, so re-reading megabytes to find the same tagged replies costs ~0.9s a poll
_READ: dict = {}


def _turns(path, env: str, marks) -> list[dict]:
    import transcript
    size = path.stat().st_size
    held = _READ.get(str(path))
    if held and held[0] == size:
        return held[1]
    out = []
    lines, _ = transcript.read(path)
    for line in transcript.on_track(lines, env, marks):
        if line.role != "assistant" or line.kind != "text":
            continue
        got = tags.found(line.text)
        if not got:
            continue
        out.append({"at": line.ts or "", "who": "agent", "kind": "said", "tag": got[0],
                    "text": trim(tags.strip(line.text)), "n": None, "ref": ""})
    _READ[str(path)] = (size, out)
    return out


def wrote(root: Path, env: str) -> list[dict]:
    """What the user wrote, and what was said back under it: the messages and their replies.

    Both halves come from the inbox, which is already the record of everything sent from the viewer
    and answered from the terminal — so a thread is a reading of what is there, not a second store
    that has to be kept level with it.
    """
    import inbox
    out = []
    for n, m in enumerate(inbox._all(root, env), 1):
        if m.get("archived"):
            continue
        out.append({"at": m.get("at") or "", "who": "you", "kind": "message", "tag": "",
                    "text": trim(m.get("text") or ""), "n": n,
                    "ref": ", ".join(f["name"] for f in (m.get("files") or []) if not f.get("removed"))})
        for r in m.get("replies") or []:
            out.append({"at": r.get("at") or "", "who": "you" if r.get("source") == "web" else "agent",
                        "kind": "reply", "tag": "", "text": trim(r.get("text") or ""), "n": n,
                        "ref": r.get("part") or ""})
    return out


class ChatController(Controller):
    """The conversation on an environment: what the agent said and what the user said back, and nothing else."""
    resource = "chat"
    noun = "chat"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        turns = said(root, p.env) + wrote(root, p.env)
        turns.sort(key=lambda t: t["at"])
        left = max(0, len(turns) - TURNS)
        return Result("ok", "", {"turns": turns[left:], "more": left})
