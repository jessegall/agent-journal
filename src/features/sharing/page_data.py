from dataclasses import asdict
from pathlib import Path

from controllers.base import row_of
from controllers.described import described_types
from engine.markers import MARKER
from engine.record import Record
from features.format import SHARED, formatted, shape
from features.plans.controller import Plans
from features.sharing.views import shared_view
from features.tickets.controller import Tickets
from features.tickets.resource import CONFIRMED
from resources.base import SYSTEM, Ref, Refused

SHARED_FIELDS = {"plan": ("status", "stage", "phases", "current", "goal"), "todo": ("struck", "blocked", "status"),
                 "ticket": ("stage", "dependencies")}


def shared_fields(row, record: Record) -> dict:
    """The fields of a row a share carries; a ticket shares only the waits its owner confirmed."""
    data = {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data}
    if "dependencies" in data:
        data["dependencies"] = {ref: stance for ref, stance in data["dependencies"].items() if stance == CONFIRMED}
    if row.type == "ticket":
        data["status"] = Tickets(Record(record.root, row.home_env or record.env), actor=SYSTEM).status(row.n)
    return data


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
        """The shared row and every row it holds, and what those rows hold in turn, such as the to-dos of a plan in a shared collection."""
        target = self._shared_row(share, share.target)
        if target.deleted:
            return set()
        scope, waiting = {share.target}, [target]
        while waiting:
            for member in self._members(share, waiting.pop()):
                if member.ref not in scope:
                    scope.add(member.ref)
                    waiting.append(member)
        return scope

    def _shared_file(self, share, ref: str, name: str) -> Path | None:
        row = self._shared_row(share, ref)
        if name not in row.files:
            return None
        folder = Record(self._home(share).root, row.home_env or self._home(share).env).folder(row.type, row.scope).joinpath(f"{row.n:03d}").resolve()
        found = folder.joinpath(name).resolve()
        return found if found.parent == folder and found.is_file() else None

    def _shared_data(self, share) -> dict:
        if share.view:
            return {"share": {"target": f"view:{share.view}", "expires": share.expires, "comments": False}, "rows": {}, "comments": [], "timelines": {}, "types": {},
                    "view": shared_view(self._home(share), share.view)}
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
                "completed": row.completed, "data": shared_fields(row, record),
            }
        described = described_types()
        kinds = {Ref.parse(ref).type for ref in rows}
        return {"share": {"target": share.target, "expires": share.expires, "comments": bool(share.comments)}, "rows": rows,
                "comments": [asdict(c) for c in self._shared_comments(share, scope)] if share.comments else [],
                "timelines": self._timelines(share, scope),
                "types": {kind: described[kind] for kind in kinds if kind in described}}

    def _timelines(self, share, scope: set[str]) -> dict[str, list[dict]]:
        """Each shared plan's timeline, keyed by the plan's ref, holding the moments of its to-dos the share shows."""
        home = self._home(share)
        return {ref: self._timeline(home, Ref.parse(ref), scope) for ref in scope if Ref.parse(ref).type == "plan"}

    def _timeline(self, home: Record, plan: Ref, scope: set[str]) -> list[dict]:
        record = Record(home.root, plan.env) if plan.env else home
        todo = lambda n: str(Ref("todo", n, plan.env))
        return [{**moment, "text": scoped(formatted(moment["text"], record, SHARED), scope)}
                for moment in Plans(record, actor=SYSTEM).timeline(plan.n) if todo(moment["todo"]) in scope]
