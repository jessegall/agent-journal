from dataclasses import asdict
from pathlib import Path

from controllers.base import row_of
from controllers.described import described_types
from engine.markers import MARKER
from engine.record import Record
from features.format import SHARED, formatted, shape
from features.plans.controller import Plans
from resources.base import SYSTEM, Ref, Refused

SHARED_FIELDS = {"plan": ("status", "stage", "phases", "current", "goal"), "todo": ("struck", "blocked", "status")}


def scoped(text: str, scope: set[str]) -> str:
    return MARKER.sub(lambda m: m.group(0) if m.group(1) == "chip" and m.group(2) in scope else m.group(3), text)


class SharePages:
    def _shared_row(self, share, ref: str):
        return row_of(self._home(share), ref)

    def _placed(self, row, ref: str) -> Ref:
        """A member ref spelled bare belongs to the environment its row came from."""
        found = Ref.parse(ref)
        return found if found.env else Ref(found.type, found.n, row.home_env)

    def _loaded_members(self, record: Record, row) -> list:
        members = []
        for ref in row.member_refs():
            try:
                member = row_of(record, self._placed(row, ref))
            except Refused:
                continue
            if not member.deleted and not member.data.get("system"):
                members.append(member)
        return members

    def _members(self, share, collection) -> list:
        return self._loaded_members(self._home(share), collection)

    def _scope(self, share) -> set[str]:
        target = self._shared_row(share, share.target)
        if target.deleted:
            return set()
        return {share.target, *(m.ref for m in self._members(share, target))}

    def _shared_file(self, share, ref: str, name: str) -> Path | None:
        row = self._shared_row(share, ref)
        if name not in row.files:
            return None
        folder = Record(self._home(share).root, row.home_env or self._home(share).env).folder(row.type, row.scope).joinpath(f"{row.n:03d}").resolve()
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
                "members": [m.ref for m in self._members(share, row) if m.ref in scope],
                "completed": row.completed, "data": {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data},
            }
        described = described_types()
        kinds = {Ref.parse(ref).type for ref in rows}
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
