from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import state

REMOVE_DAYS = 30

# store key: (when the item closed, the fields that hold its content). Status fields stay, so nothing reopens.
STORES = {
    "work": (lambda x: x.get("ended"), {"subject": "", "notes": []}),
    "inbox": (lambda x: x.get("processed") or x.get("archived_at"), {"text": "", "parts": [], "replies": [], "files": []}),
    "questions": (lambda x: x.get("answered_at") or x.get("withdrawn_at") or (x.get("withdrawn") and x.get("at")),
                  {"text": "", "description": "", "options": [], "answer": "", "earlier_answers": []}),
    "comments": (lambda x: x.get("done_at"), {"text": ""}),
    "notifications": (lambda x: x.get("read_at"), {"text": ""}),
    "suggestions": (lambda x: x.get("decided_at") or x.get("withdrawn_at"), {"title": "", "body": "", "change": "", "note": ""}),
}


def _days_since(at: str, now: datetime) -> float | None:
    try:
        when = datetime.fromisoformat(str(at).replace("Z", "+00:00"))
    except ValueError:
        return None
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return (now - when).total_seconds() / 86400


def sweep(root: Path, track: str, now: datetime | None = None) -> dict[str, int]:
    import shutil
    import inbox
    import todo
    now = now or datetime.now(timezone.utc)
    stamp = now.isoformat(timespec="seconds")
    out: dict[str, int] = {}
    with state.locked(root):
        for key, (closed, fields) in STORES.items():
            items = state.tracked(root, key, track, [])
            if not isinstance(items, list):
                continue
            gone = 0
            for n, item in enumerate(items, 1):
                if not isinstance(item, dict) or item.get("removed"):
                    continue
                when = closed(item)
                days = _days_since(when, now) if when else None
                if days is None or days <= REMOVE_DAYS:
                    continue
                if key == "inbox":
                    shutil.rmtree(inbox.files_dir(root, track, n), ignore_errors=True)
                    inbox.transcript_path(root, track, n).unlink(missing_ok=True)
                item.update({k: (type(v)(v) if isinstance(v, list) else v) for k, v in fields.items()})
                item["removed"] = stamp
                gone += 1
            if gone:
                state.put_tracked(root, key, track, items)
                out[key] = gone
    done = [t for t in todo._all(root, track) if t.get("done") and (_days_since(t["done"], now) or 0) > REMOVE_DAYS]
    if done:
        ok, _ = todo.prune(root, track, f"{REMOVE_DAYS}d", stamp, force=True)
        if ok:
            out["todos"] = len(done)
    archived = todo.auto_archive(root, track, stamp)
    if archived:
        out["todos_archived"] = archived
    return out
