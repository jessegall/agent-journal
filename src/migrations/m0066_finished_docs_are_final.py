from pathlib import Path

from controllers.docs import Docs
from controllers.types import environment_records
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    records = list(environment_records(Path(root)))
    if not records:
        return []
    docs = Docs(records[0], actor=SYSTEM)
    changed = []
    for doc in docs.all():
        if doc.completed or doc.status not in ("", "draft"):
            continue
        buttons = doc.data.get("buttons") or []
        pressed = set(doc.data.get("pressed") or [])
        choices = {button["choice"] for button in buttons if button.get("choice")}
        waiting = any(not any(button.get("choice") == choice and button.get("label") in pressed for button in buttons) for choice in choices)
        if not doc.data.get("answered_own") and waiting:
            docs.update(doc.n, status="draft")
            continue
        docs.update(doc.n, status="final")
        changed.append(f"document {doc.n} is final")
    return changed
