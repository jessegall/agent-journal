from dataclasses import asdict
from pathlib import Path

from controllers.base import CONTROLLERS
from controllers.described import described_types
from engine.markers import MARKER
from engine.record import Record
from features.format import SHARED, formatted, shape
from features.plans.controller import Plans
from resources.base import SYSTEM, Refused

SHARED_FIELDS = {"plan": ("status", "stage", "phases", "current", "goal"), "todo": ("struck", "blocked", "status")}


def scoped(text: str, scope: set[str]) -> str:
    return MARKER.sub(lambda m: m.group(0) if m.group(1) == "chip" and m.group(2) in scope else m.group(3), text)


class SharePages:
    def _shared_row(self, share, ref: str):
        kind, _, n = ref.partition(":")
        return CONTROLLERS[kind](self._home(share), actor=SYSTEM).load(n)

    def _loaded_members(self, record: Record, row) -> list:
        members = []
        for ref in row.member_refs():
            kind, _, n = ref.partition(":")
            if kind not in CONTROLLERS or not n.isdigit():
                continue
            try:
                row = CONTROLLERS[kind](record, actor=SYSTEM).load(n)
            except Refused:
                continue
            if not row.deleted and not row.data.get("system"):
                members.append(row)
        return members

    def _members(self, share, collection) -> list:
        return self._loaded_members(self._home(share), collection)

    def _scope(self, share) -> set[str]:
        target = self._shared_row(share, share.target)
        if target.deleted:
            return set()
        return {share.target, *(f"{m.type}:{m.n}" for m in self._members(share, target))}

    def _shared_file(self, share, ref: str, name: str) -> Path | None:
        row = self._shared_row(share, ref)
        if name not in row.files:
            return None
        folder = self._home(share).folder(row.type, row.scope).joinpath(f"{row.n:03d}").resolve()
        found = folder.joinpath(name).resolve()
        return found if found.parent == folder and found.is_file() else None

    def _shared_data(self, share) -> dict:
        scope = self._scope(share)
        record = self._home(share)
        rows = {}
        for ref in scope:
            row = self._shared_row(share, ref)
            shaped = shape(row, record, SHARED)
            rows[ref] = {
                "type": row.type, "n": row.n, "created": row.created, "updated": row.updated,
                "title": scoped(shaped.get("title", ""), scope), "abstract": scoped(shaped.get("abstract", ""), scope), "brief": scoped(shaped.get("brief", ""), scope),
                "sections": [{"title": scoped(s.get("title", ""), scope), "body": scoped(s.get("body", ""), scope)} for s in shaped.get("sections") or []],
                "files": sorted(row.files), "pictures": dict(getattr(row, "pictures", {}) or {}),
                "members": [f"{m.type}:{m.n}" for m in self._members(share, row) if f"{m.type}:{m.n}" in scope],
                "completed": row.completed, "data": {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data},
            }
        described = described_types()
        kinds = {ref.partition(":")[0] for ref in rows}
        return {"share": {"target": share.target, "expires": share.expires, "comments": bool(share.comments)}, "rows": rows,
                "comments": [asdict(c) for c in self._shared_comments(share, scope)] if share.comments else [],
                "timeline": self._timeline(share, scope),
                "types": {kind: described[kind] for kind in kinds if kind in described}}

    def _timeline(self, share, scope: set[str]) -> list[dict]:
        kind, _, n = share.target.partition(":")
        if kind != "plan":
            return []
        record = self._home(share)
        return [{**moment, "text": scoped(formatted(moment["text"], record, SHARED), scope)}
                for moment in Plans(record, actor=SYSTEM).timeline(int(n)) if f"todo:{moment['todo']}" in scope]
