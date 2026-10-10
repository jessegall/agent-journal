import json
import threading
import time
from dataclasses import asdict
from pathlib import Path

from controllers.base import row_of
from engine import bus
from controllers.described import described_types
from engine.markers import MARKER
from engine.record import Record
from features.collections.files import collected_files
from features.format import SHARED, formatted, shape
from features.plans.controller import Plans
from features.sharing.views import shared_view
from features.tickets.controller import Tickets
from features.tickets.resource import CONFIRMED
from resources.base import SYSTEM, Ref, Refused

KEPT_FOR = 10.0
REACHED: dict[str, tuple[float, tuple]] = {}
BUILT: dict[str, tuple[float, bytes]] = {}
BUILDING = threading.Lock()
ORIGINS: dict[str, tuple[float, dict]] = {}


def forget(token: str) -> None:
    """Drops what was kept of a share, as a comment on it makes what a visitor sees out of date."""
    REACHED.pop(token, None)
    BUILT.pop(token, None)


def fresh(kept) -> bool:
    """Whether what was kept is recent enough to send again; where work runs in the caller's thread, as in a test, nothing is kept."""
    return bool(kept) and bus.BACKGROUND and time.monotonic() - kept[0] < KEPT_FOR


SHARED_FIELDS = {"plan": ("status", "stage", "phases", "current", "goal"), "todo": ("struck", "blocked", "status"),
                 "ticket": ("stage", "dependencies", "board"),
                 "board": ("stages", "goal", "done_when", "meanings")}


def origin_of(record: Record, environment: str) -> str:
    """Where a member from another environment comes from: the ticket whose work environment it is, by number and title, or the environment's own name."""
    kept = ORIGINS.get(str(record.root))
    if not fresh(kept):
        owners: dict[str, object] = {}
        for ticket in Tickets(record, actor=SYSTEM).rows.standing():
            owners.setdefault(ticket.work_environment, ticket)
        kept = ORIGINS[str(record.root)] = (time.monotonic(), owners)
    ticket = kept[1].get(environment)
    return f"Ticket {ticket.n} · {ticket.title}" if ticket else environment


def shared_fields(row, record: Record) -> dict:
    """The fields of a row a share carries; a ticket shares only the waits its owner confirmed."""
    data = {key: row.data[key] for key in SHARED_FIELDS.get(row.type, ()) if key in row.data}
    if "dependencies" in data:
        data["dependencies"] = {ref: stance for ref, stance in data["dependencies"].items() if stance == CONFIRMED}
    if row.type == "ticket":
        data["status"] = Tickets(Record(record.root, row.home_env or record.env), actor=SYSTEM).status(row.n)
    if row.home_env:
        data["origin"] = origin_of(record, row.home_env)
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

    @staticmethod
    def _member_refs(row) -> list[str]:
        """What a row holds in a share: its own members, and for a ticket the plan of its work environment, which its card opens."""
        if row.type == "ticket" and row.work_environment and row.plan:
            return [f"{row.work_environment}/plan:{row.plan}"]
        return row.member_refs()

    def _loaded_members(self, record: Record, row) -> list:
        if row.type == "board":
            return [ticket for ticket in Tickets(record, actor=SYSTEM).rows.standing() if ticket.board == row.n]
        members = []
        for ref in self._member_refs(row):
            try:
                member = row_of(record, self._placed(row, ref))
            except Refused:
                continue
            if not member.deleted and not member.data.get("system"):
                members.append(member)
        return members

    def _members(self, share, collection) -> list:
        return self._loaded_members(self._home(share), collection)

    def _reach(self, share) -> tuple[set[str], dict, dict]:
        """The refs a share shows, each row it reaches loaded once, and what each holds: the shared row, every row it holds, and what those hold in turn, such as the to-dos of a plan in a shared collection. Kept for a few seconds, since a visitor's page asks for it again for each file."""
        kept = REACHED.get(share.token)
        if fresh(kept):
            return kept[1]
        target = self._shared_row(share, share.target)
        if target.deleted:
            return set(), {}, {}
        rows, members, waiting = {share.target: target}, {}, [target]
        while waiting:
            row = waiting.pop()
            members[row.ref] = self._members(share, row)
            for member in members[row.ref]:
                if member.ref in rows:
                    continue
                rows[member.ref] = member
                waiting.append(member)
        REACHED[share.token] = (time.monotonic(), (set(rows), rows, members))
        return REACHED[share.token][1]

    def _scope(self, share) -> set[str]:
        return self._reach(share)[0]

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
        scope, loaded, held = self._reach(share)
        record = self._home(share)
        rows = {}
        for ref in scope:
            row = loaded[ref]
            shaped = shape(row, record, SHARED)
            rows[ref] = {
                "type": row.type, "n": row.n, "created": row.created, "updated": row.updated,
                "title": scoped(shaped.get("title", ""), scope), "abstract": scoped(shaped.get("abstract", ""), scope), "brief": scoped(shaped.get("brief", ""), scope),
                "sections": [{"title": scoped(s.get("title", ""), scope), "body": scoped(s.get("body", ""), scope)} for s in shaped.get("sections") or []],
                "files": sorted(row.files), "pictures": dict(getattr(row, "pictures", {}) or {}),
                "members": [m.ref for m in held[ref] if m.ref in scope],
                "completed": row.completed, "data": shared_fields(row, record),
            }
            if row.type == "collection":
                rows[ref]["held_files"] = collected_files(record, [row, *(m for m in held[ref] if m.ref in scope)])
        described = described_types()
        kinds = {Ref.parse(ref).type for ref in rows}
        return {"share": {"target": share.target, "expires": share.expires, "comments": bool(share.comments)}, "rows": rows,
                "comments": [asdict(c) for c in self._shared_comments(share, scope)] if share.comments else [],
                "timelines": self._timelines(share, scope),
                "types": {kind: described[kind] for kind in kinds if kind in described}}

    def _shared_body(self, share) -> bytes:
        """The page's data as it is sent, built once for every request that comes while it is being built or in the next few seconds."""
        kept = BUILT.get(share.token)
        if fresh(kept):
            return kept[1]
        with BUILDING:
            kept = BUILT.get(share.token)
            if fresh(kept):
                return kept[1]
            body = json.dumps(self._shared_data(share)).encode()
            BUILT[share.token] = (time.monotonic(), body)
        return body

    def _timelines(self, share, scope: set[str]) -> dict[str, list[dict]]:
        """Each shared plan's timeline, keyed by the plan's ref, holding the moments of its to-dos the share shows."""
        home = self._home(share)
        return {ref: self._timeline(home, Ref.parse(ref), scope) for ref in scope if Ref.parse(ref).type == "plan"}

    def _timeline(self, home: Record, plan: Ref, scope: set[str]) -> list[dict]:
        record = Record(home.root, plan.env) if plan.env else home
        todo = lambda n: str(Ref("todo", n, plan.env))
        return [{**moment, "text": scoped(formatted(moment["text"], record, SHARED), scope)}
                for moment in Plans(record, actor=SYSTEM).timeline(plan.n) if todo(moment["todo"]) in scope]
