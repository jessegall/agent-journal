from __future__ import annotations

from pathlib import Path

import inbox
import state
from pins import age
from templates import render

KEY = "browser"

#: what the agent may ask of the page the user is on; the extension runs each with the DevTools protocol
OPS = ("shot", "dom", "text", "url", "click", "type", "goto", "eval", "console", "scroll")
#: the ones that take words after the verb
WITH_ARGS = {"click": "a css selector", "type": 'a css selector and the text: journal browser type "input.search" "hello"',
             "goto": "a url", "eval": "javascript, whose value comes back", "scroll": "a css selector, or top|bottom"}

MESSAGES = {
    "bad_op": "{op} is not something the page can be asked; one of: {ops:, }",
    "needs_args": "journal browser {op} needs {what}",
    "no_driver": "no page is being driven: the user switches it on from the chat window (the wheel button)",
    "asked": "asked the page: {op}{args} — the answer comes back as a message (browser {n})",
    "no_ask": "there is no browser ask {n}",
    "done_twice": "browser ask {n} was already answered",
    "answered": "browser ask {n} answered",
    "result_text": "the page ({op}{args}):\n{text}",
    "result_failed": "the page could not ({op}{args}): {text}",
    "result_files": "saved: {paths:, }",
    "no_answer": "the page has not answered browser {n} in {seconds}s — the extension may be off that tab; "
                 "`journal browser show {n}` reads it once it has",
    "fact_open": "waiting for the page",
    "fact_done": "answered[ {age}]",
    "fact_failed": "failed[ {age}]",
}


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


def _argline(x: dict) -> str:
    return f" {' '.join(x.get('args') or [])}" if x.get("args") else ""


def driver(root: Path, track: str | None = None) -> dict | None:
    got = state.tracked(root, "browser_driver", track, None) if track else state.get(root, "browser_driver", None)
    return got if isinstance(got, dict) and got.get("on") else None


def set_driver(root: Path, on: bool, url: str, title: str, at: str, track: str | None = None) -> tuple[bool, str]:
    value = {"on": bool(on), "url": url or "", "title": title or "", "at": at}
    if track:
        state.put_tracked(root, "browser_driver", track, value)
    else:
        state.put(root, "browser_driver", value)
    return True, "driving" if on else "not driving"


def ask(root: Path, op: str, args: list[str], at: str, track: str | None = None) -> tuple[bool, str]:
    op = (op or "").strip().lower()
    if op not in OPS:
        return False, say("bad_op", op=repr(op), ops=list(OPS))
    args = [a for a in (args or []) if a is not None and str(a) != ""]
    if op in WITH_ARGS and not args:
        return False, say("needs_args", op=op, what=WITH_ARGS[op])
    if not driver(root, track):
        return False, say("no_driver")
    with state.locked(root):
        items = _all(root, track)
        items.append({"op": op, "args": [str(a) for a in args], "at": at, "done_at": None, "ok": None, "text": ""})
        _put(root, items, track)
        n = len(items)
    return True, say("asked", op=op, args=_argline(items[n - 1]), n=n)


def pending(root: Path, track: str | None = None) -> list[dict]:
    return [{"n": n, "op": x["op"], "args": x.get("args") or [], "at": x.get("at", "")}
            for n, x in enumerate(_all(root, track), 1) if not x.get("done_at")]


def finish(root: Path, n: int, ok: bool, text: str, at: str, track: str | None = None,
           files: list | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_ask", n=n)
        if items[n - 1].get("done_at"):
            return False, say("done_twice", n=n)
        text = (text or "").strip()
        items[n - 1].update({"done_at": at, "ok": bool(ok), "text": text[:20000]})
        _put(root, items, track)
        x = items[n - 1]
    # THE ANSWER IS THE ASK'S, NOT A MESSAGE. The agent's command waits for it and prints it; a
    # picture is written where the agent can open it, and its path is printed. Nothing reaches the
    # chat, the inbox or the launcher: it is a tool's result, not a thing the user said.
    got, why = inbox._read_files(files)
    paths = []
    if got:
        folder = files_dir(root, track, n)
        folder.mkdir(parents=True, exist_ok=True)
        for name, data in got:
            (folder / name).write_bytes(data)
            paths.append(str(folder / name))
    if paths:
        with state.locked(root):
            items = _all(root, track)
            items[n - 1]["files"] = paths
            _put(root, items, track)
    return True, say("answered", n=n)


def files_dir(root: Path, track: str | None, n: int) -> Path:
    return root / "environments" / (track or "default") / "browser-files" / str(n)


def wait(root: Path, n: int, track: str | None = None, seconds: float = 45.0) -> dict | None:
    import time
    deadline = time.time() + seconds
    while time.time() < deadline:
        items = _all(root, track)
        if 1 <= n <= len(items) and items[n - 1].get("done_at"):
            return items[n - 1]
        time.sleep(0.25)
    return None


def facts(x: dict) -> list[str]:
    if not x.get("done_at"):
        return [say("fact_open")]
    return [say("fact_done" if x.get("ok") else "fact_failed", age=age(x.get("done_at") or ""))]


def row_response(n: int, x: dict) -> dict:
    return {"n": n, "op": x.get("op") or "", "args": x.get("args") or [], "at": x.get("at") or "",
            "done": bool(x.get("done_at")), "ok": x.get("ok"), "text": x.get("text") or "", "files": x.get("files") or [],
            "meta": " · ".join(facts(x))}
