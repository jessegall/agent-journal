from __future__ import annotations

from pathlib import Path

import plans
import reports
import state
from controller import Controller, Payload, Result
from payloads import reports as report_payloads
from payloads.common import ListingPayload, WhyPayload


class ReportsController(Controller):
    resource = "reports"
    noun = "report"
    actions = ("index", "show", "store", "destroy", "keep", "todoc", "seen")
    numbered = ("show", "destroy", "todoc", "seen")
    payloads = {"index": ListingPayload, "store": report_payloads.StorePayload, "destroy": WhyPayload,
                "keep": report_payloads.KeepPayload}

    def repository(self, root: Path, p: Payload):
        from resources import Reports
        return Reports(root, p.env)

    def _row(self, root: Path, p: Payload, n: int) -> dict:
        days = reports.archive_days(root, p.env or state.current_track(root))
        return reports.row_response(n, self.repository(root, p).find(n).raw, body=True, days=days)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action == "destroy" and self.repository(root, p).find(p.id).archived:
            return Result("refused", reports.say("already_archived", n=p.id))
        return None

    def seen(self, root: Path, p: Payload) -> Result:
        # the user opened it in the viewer: the home stops asking them to read it
        from datetime import datetime, timezone
        at = p.at or datetime.now(timezone.utc).isoformat(timespec="seconds")
        return Result.of(reports.seen(root, p.id, at, p.env or None), self._row(root, p, p.id))

    def index(self, root: Path, p: ListingPayload) -> Result:
        reports.prune(root, p.env or None)
        repo = self.repository(root, p)
        days = reports.archive_days(root, p.env or state.current_track(root))
        # a report an unfinished plan links does not age out; archiving it by hand still does
        linked = plans.linked_reports(root, p.env or state.current_track(root))
        aging = lambda r: 0 if r.n in linked else days  # noqa: E731
        gone = lambda r: bool(reports.archived_why(r.raw, aging(r)))  # noqa: E731
        present = repo.query().where(lambda r: not r.raw.get("removed"))
        query = present if p.all else present.where(lambda r: not gone(r))
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [reports.row_response(r.n, r.raw, days=aging(r)) for r in page.rows],
                      {"left": page.left, "archived": len([r for r in repo.all() if gone(r)]), "archive_days": days})

    def show(self, root: Path, p: Payload) -> Result:
        days = reports.archive_days(root, p.env or state.current_track(root))
        return Result("ok", "", reports.row_response(p.id, self.repository(root, p).find(p.id).raw, body=True, days=days))

    def todoc(self, root: Path, p: Payload) -> Result:
        outcome = reports.to_doc(root, p.id, p.at, track=p.env or None)
        doc = self.repository(root, p).find(p.id).raw.get("doc") if outcome[0] else None
        return Result.of(outcome, {"doc": doc} if doc else None)

    def keep(self, root: Path, p: report_payloads.KeepPayload) -> Result:
        return Result.of(reports.set_archive_days(root, p.env or state.current_track(root), p.days))

    def store(self, root: Path, p: report_payloads.StorePayload) -> Result:
        outcome = reports.add(root, p.title, p.body, p.at, p.about, source=p.source, track=p.env or None)
        data = reports.row_response(self.repository(root, p).count(), self.repository(root, p).all()[-1].raw) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(reports.archive(root, p.id, p.why, p.at, track=p.env or None))
