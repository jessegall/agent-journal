from __future__ import annotations

import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Protocol, runtime_checkable

import fmt
import state
from payloads.base import Payload, PayloadError
from templates import render

MESSAGES = {
    "no_action": "{resource} has no action {action}",
    "needs_id": "{resource} {action} needs a number",
    "bad_id": "{resource} {action} wants a number, got {id}",
    "no_item": "there is no {noun} {id}",
    "wrong_payload": "{resource} {action} takes a {kind}, not a {given}",
    "search_wants": "search for what? journal {resource} search <a word or phrase>",
}

# resource -> the fields `search` reads, first one names the item
SEARCHABLE = {"todos": ("title", "body"), "messages": ("text",), "questions": ("text", "answer"),
              "reports": ("title", "body"), "suggestions": ("title", "body"), "reminders": ("text",),
              "pins": ("fact",), "rules": ("fact",), "work": ("subject", "notes"), "comments": ("text",)}


def _is_open(m) -> bool:
    if hasattr(m, "state"):
        return m.state == "open"
    for name in ("open", "waiting", "standing"):
        if hasattr(m, name):
            return bool(getattr(m, name))
    if hasattr(m, "closed"):
        return not m.closed
    return not getattr(m, "archived", "")


def _lines(m, names: tuple) -> list[str]:
    out = []
    for name in names:
        value = getattr(m, name, "") or ""
        texts = [x.get("text", "") for x in value if isinstance(x, dict)] if isinstance(value, list) else [str(value)]
        for text in texts:
            out.extend(line for line in text.splitlines() if line.strip())
    return out


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


@runtime_checkable
class PayloadSource(Protocol):
    """A parsed CLI command and an HTTP request are both this: each builds the payload an action takes."""
    def payload(self, kind: type[Payload], extra: dict | None = None) -> Payload: ...


class Result:
    __slots__ = ("status", "message", "data", "meta")

    def __init__(self, status: str, message: str = "", data=None, meta: dict | None = None):
        self.status = status
        self.message = message
        self.data = data
        self.meta = meta or {}

    @property
    def ok(self) -> bool:
        return self.status in ("ok", "created")

    @classmethod
    def of(cls, outcome: tuple[bool, str], data=None, created: bool = False, meta: dict | None = None) -> "Result":
        ok, message = outcome
        return cls(("created" if created else "ok") if ok else "refused", message, data, meta)


# a server handles several environments at once, and the stores read the process's track
_BOUND = threading.RLock()


@contextmanager
def bound(env: str):
    with _BOUND:
        was = list(state._TRACK)
        if env:
            state.use_track(env)
        try:
            yield
        finally:
            state._TRACK[:] = was


class Controller:
    resource = ""
    noun = ""
    actions: tuple = ("index", "show", "store", "update", "destroy")
    numbered: tuple = ("show", "update", "destroy")
    payloads: dict = {}     # action -> the payload class it takes; Payload when it takes no fields

    default_sort = "n"
    default_direction = fmt.DESC
    scoped = True           # served under /api/env/<env>/; False for project-wide, None for both

    def payload_for(self, action: str) -> type[Payload] | None:
        if action == "search" and self.resource in SEARCHABLE:
            from payloads.docs import SearchPayload
            return SearchPayload
        return self.payloads.get(action, Payload) if action in self.actions else None

    def search(self, root: Path, p: Payload) -> Result:
        """Lines of this resource that mention the term, open items first; closed ones are counted unless --all."""
        needle = (p.term or "").lower()
        if not needle:
            return Result("refused", say("search_wants", resource=self.resource))
        names = SEARCHABLE[self.resource]
        hits, closed = [], 0
        for m in self.repository(root, p).query():
            live = _is_open(m)
            lines = _lines(m, names)
            title = " ".join((_lines(m, names[:1]) or [""])[0].split())[:80]
            for i, line in enumerate(lines, 1):
                if needle not in line.lower():
                    continue
                if live or p.all:
                    hits.append({"n": m.n, "title": title, "line": i, "text": line, "open": live})
                else:
                    closed += 1
        hits.sort(key=lambda h: (not h["open"], -h["n"], h["line"]))
        return Result("ok", "", hits, {"closed": closed})

    def repository(self, root: Path, payload: Payload):
        raise NotImplementedError

    def exists(self, root: Path, payload: Payload) -> bool:
        return self.repository(root, payload).exists(payload.id)

    def identify(self, root: Path, action: str, payload: Payload) -> Result | None:
        """Turn the payload's id into the one the actions use, or say why there is none."""
        if not str(payload.id).isdigit():
            return Result("refused", say("bad_id", resource=self.resource, action=action, id=repr(payload.id)))
        payload.id = int(payload.id)
        if not self.exists(root, payload):
            return Result("missing", say("no_item", noun=self.noun, id=payload.id))
        return None

    def sorted(self, query, payload: Payload):
        """The query in the order the payload asks for, or the refusal naming what it can sort by."""
        try:
            return query.order_by(payload.sort or self.default_sort,
                                  payload.direction or payload.order or self.default_direction)
        except ValueError as e:
            return Result("refused", str(e))

    @staticmethod
    def paged(query, payload: Payload):
        return query.page(payload.cap, payload.page or 1)

    def guard(self, root: Path, action: str, payload: Payload) -> Result | None:
        return None

    def call(self, root: Path, action: str, payload: Payload) -> Result:
        kind = self.payload_for(action)
        if kind is None:
            return Result("missing", say("no_action", resource=self.resource, action=repr(action)))
        if not isinstance(payload, kind):
            raise TypeError(say("wrong_payload", resource=self.resource, action=action, kind=kind.__name__,
                                given=type(payload).__name__))
        with bound(payload.env):
            if action in self.numbered:
                if payload.id in (None, ""):
                    return Result("refused", say("needs_id", resource=self.resource, action=action))
                refused = self.identify(root, action, payload)
                if refused:
                    return refused
            return self.guard(root, action, payload) or getattr(self, action)(root, payload)


def dispatch(root: Path, controller: Controller, action: str, source: PayloadSource,
             extra: dict | None = None) -> Result:
    """The one way into a controller: the source builds the payload the action takes, and the controller runs it."""
    kind = controller.payload_for(action)
    if kind is None:
        return Result("missing", say("no_action", resource=controller.resource, action=repr(action)))
    try:
        payload = source.payload(kind, extra)
    except PayloadError as e:
        return Result("refused", str(e))
    return controller.call(root, action, payload)
