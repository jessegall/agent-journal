from __future__ import annotations

import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Protocol, runtime_checkable

import state
from templates import render

MESSAGES = {
    "no_action": "{resource} has no action {action}",
    "needs_id": "{resource} {action} needs a number",
    "bad_id": "{resource} {action} wants a number, got {id}",
    "no_item": "there is no {noun} {id}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class Payload:
    """What a controller is asked to do with, whichever door the ask came through."""
    __slots__ = ("env", "id", "fields", "source", "at")

    def __init__(self, env: str, id=None, fields: dict | None = None, source: str = "cli", at: str = ""):
        self.env = env
        self.id = id
        self.fields = dict(fields or {})
        self.source = source
        self.at = at or datetime.now(timezone.utc).isoformat(timespec="seconds")

    def has(self, name: str) -> bool:
        return self.fields.get(name) is not None

    def get(self, name: str, default=None):
        value = self.fields.get(name)
        return default if value is None else value

    def text(self, name: str) -> str:
        return " ".join(str(self.fields.get(name) or "").split())


@runtime_checkable
class PayloadSource(Protocol):
    """A parsed CLI command and an HTTP request are both this."""
    def payload(self) -> Payload: ...


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

    def count(self, root: Path) -> int:
        return 0

    def exists(self, root: Path, ident: int) -> bool:
        return 1 <= ident <= self.count(root)

    def guard(self, root: Path, action: str, payload: Payload) -> Result | None:
        return None

    def call(self, root: Path, action: str, payload: Payload) -> Result:
        if action not in self.actions:
            return Result("missing", say("no_action", resource=self.resource, action=repr(action)))
        with bound(payload.env):
            if action in self.numbered:
                if payload.id in (None, ""):
                    return Result("refused", say("needs_id", resource=self.resource, action=action))
                if not str(payload.id).isdigit():
                    return Result("refused", say("bad_id", resource=self.resource, action=action, id=repr(payload.id)))
                payload.id = int(payload.id)
                if not self.exists(root, payload.id):
                    return Result("missing", say("no_item", noun=self.noun, id=payload.id))
            return self.guard(root, action, payload) or getattr(self, action)(root, payload)
