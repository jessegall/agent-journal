from __future__ import annotations

from pathlib import Path

import state
from templates import render

KEY = "retention"
RESOURCES = ("todos", "reports", "plans", "inbox", "questions", "suggestions", "notifications", "comments", "work")
LABELS = {"todos": "To-dos", "reports": "Reports", "plans": "Plans", "inbox": "Messages", "questions": "Questions",
          "suggestions": "Suggestions", "notifications": "Notifications", "comments": "Comments", "work": "Work"}
#: (days a closed item stays listed, days it stays archived before it is deleted; 0 is never)
DEFAULTS = {"reports": (7, 30), "plans": (3, 0)}
DEFAULT = (7, 0)
#: the resources whose archived items are deleted on a schedule today; the rest keep their delete days at 0
DELETES = {"reports"}
#: to-dos and reports already keep their archive days under these keys; retention reads and writes them there
LEGACY = {"todos": "todos_archive_days", "reports": "reports_archive_days"}

MESSAGES = {
    "no_resource": "{name} is not kept on a schedule; the resources are {names}",
    "bad_days": "days are a whole number, 0 or more",
    "kept": "{label} on `{env}`: archived {archive}, deleted {delete}",
    "after": "after {n} day(s)",
    "never": "never",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def days(root: Path, track: str, resource: str) -> dict:
    """{"archive": days listed once closed, "delete": days archived before deletion} for one resource here."""
    archive, delete = DEFAULTS.get(resource, DEFAULT)
    if resource in LEGACY:
        got = state.get(root, LEGACY[resource], {})
        value = got.get(track) if isinstance(got, dict) else None
        archive = archive if value is None else int(value)
    got = state.get(root, KEY, {})
    mine = ((got.get(track) or {}).get(resource) or {}) if isinstance(got, dict) else {}
    return {"archive": int(mine.get("archive", archive)) if resource not in LEGACY else archive,
            "delete": int(mine.get("delete", delete))}


def table(root: Path, track: str) -> dict:
    return {r: {**days(root, track, r), "label": LABELS[r], "deletes": r in DELETES} for r in RESOURCES}


def set_days(root: Path, track: str, resource: str, archive: int | None = None, delete: int | None = None) -> tuple[bool, str]:
    if resource not in RESOURCES:
        return False, say("no_resource", name=repr(resource), names=", ".join(RESOURCES))
    if any(v is not None and (not isinstance(v, int) or v < 0) for v in (archive, delete)):
        return False, say("bad_days")
    with state.locked(root):
        if archive is not None and resource in LEGACY:
            got = state.get(root, LEGACY[resource], {})
            got = got if isinstance(got, dict) else {}
            got[track] = archive
            state.put(root, LEGACY[resource], got)
        got = state.get(root, KEY, {})
        got = got if isinstance(got, dict) else {}
        mine = got.setdefault(track, {}).setdefault(resource, {})
        if archive is not None and resource not in LEGACY:
            mine["archive"] = archive
        if delete is not None:
            mine["delete"] = delete
        state.put(root, KEY, got)
    now = days(root, track, resource)
    return True, say("kept", label=LABELS[resource], env=track,
                     archive=say("after", n=now["archive"]) if now["archive"] else say("never"),
                     delete=say("after", n=now["delete"]) if now["delete"] else say("never"))
