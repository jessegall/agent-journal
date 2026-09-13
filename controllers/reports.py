from __future__ import annotations

from pathlib import Path

import reports
from controller import Controller, Payload, Result
from payloads import reports as report_payloads
from payloads.common import ListingPayload, WhyPayload


class ReportsController(Controller):
    resource = "reports"
    noun = "report"
    actions = ("index", "show", "store", "destroy")
    numbered = ("show", "destroy")
    payloads = {"index": ListingPayload, "store": report_payloads.StorePayload, "destroy": WhyPayload}

    def repository(self, root: Path, p: Payload):
        from resources import Reports
        return Reports(root, p.env)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action == "destroy" and self.repository(root, p).find(p.id).archived:
            return Result("refused", reports.say("already_archived", n=p.id))
        return None

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        query = repo.query() if p.all else repo.query().where(lambda r: not r.archived)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [reports.row_response(r.n, r.raw) for r in page.rows],
                      {"left": page.left, "archived": len([r for r in repo.all() if r.archived])})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", reports.row_response(p.id, self.repository(root, p).find(p.id).raw, body=True))

    def store(self, root: Path, p: report_payloads.StorePayload) -> Result:
        outcome = reports.add(root, p.title, p.body, p.at, p.about, source=p.source, track=p.env or None)
        data = reports.row_response(self.repository(root, p).count(), self.repository(root, p).all()[-1].raw) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(reports.archive(root, p.id, p.why, p.at, track=p.env or None))
