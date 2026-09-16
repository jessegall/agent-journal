from __future__ import annotations

from pathlib import Path

import plans
import state
from controller import Controller, Payload, Result
from payloads import plans as plan_payloads
from payloads.common import ListingPayload, WhyPayload


class PlansController(Controller):
    resource = "plans"
    noun = "plan"
    actions = ("index", "show", "store", "fromdoc", "phase", "todos", "activate", "proceed", "acknowledge", "park", "ready", "destroy", "link")
    numbered = ("show", "phase", "todos", "activate", "proceed", "acknowledge", "park", "ready", "destroy", "link")
    payloads = {"index": ListingPayload, "store": plan_payloads.StorePayload, "phase": plan_payloads.PhasePayload,
                "todos": plan_payloads.TodosPayload, "destroy": WhyPayload, "link": plan_payloads.LinkPayload,
                "fromdoc": plan_payloads.FromDocPayload, "park": WhyPayload}

    def repository(self, root: Path, p: Payload):
        from resources import Plans
        return Plans(root, p.env)

    @staticmethod
    def _env(root: Path, p: Payload) -> str:
        return p.env or state.current_track(root)

    def index(self, root: Path, p: ListingPayload) -> Result:
        env = self._env(root, p)
        query = self.repository(root, p).query()
        if not p.all:
            query = query.where(lambda r: r.raw.get("status") != plans.ABANDONED)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        rows = [plans.row_response(root, r.n, r.raw, env) for r in page.rows]
        if not p.all:
            rows = [r for r in rows if r["status"] != plans.DONE]
        abandoned = len([r for r in self.repository(root, p).all() if r.raw.get("status") == plans.ABANDONED])
        return Result("ok", "", rows, {"left": page.left, "abandoned": abandoned, "approval": plans.approval(root)})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", plans.row_response(root, p.id, self.repository(root, p).find(p.id).raw, self._env(root, p), full=True))

    def store(self, root: Path, p: plan_payloads.StorePayload) -> Result:
        outcome = plans.add(root, p.title, p.goal, p.body, p.at, source=p.source,
                            preparing=p.preparing, track=p.env or None)
        repo = self.repository(root, p)
        data = plans.row_response(root, repo.count(), repo.all()[-1].raw, self._env(root, p)) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def fromdoc(self, root: Path, p: plan_payloads.FromDocPayload) -> Result:
        outcome = plans.from_doc(root, p.doc, p.at, source=p.source, track=p.env or None)
        repo = self.repository(root, p)
        data = plans.row_response(root, repo.count(), repo.all()[-1].raw, self._env(root, p)) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def phase(self, root: Path, p: plan_payloads.PhasePayload) -> Result:
        return Result.of(plans.add_phase(root, p.id, p.title, p.when, p.at, p.checkpoint, track=p.env or None))

    def todos(self, root: Path, p: plan_payloads.TodosPayload) -> Result:
        return Result.of(plans.put_todos(root, p.id, p.phase, p.todos, p.at, off=p.off, reopen=p.reopen,
                                         move=p.move, track=p.env or None))

    def activate(self, root: Path, p: Payload) -> Result:
        return Result.of(plans.activate(root, p.id, p.at, source=p.source, track=p.env or None))

    def proceed(self, root: Path, p: Payload) -> Result:
        return Result.of(plans.proceed(root, p.id, p.at, source=p.source, track=p.env or None))

    def ready(self, root: Path, p: Payload) -> Result:
        return Result.of(plans.ready(root, p.id, p.at, track=p.env or None))

    def park(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(plans.park(root, p.id, p.why, p.at, source=p.source, track=p.env or None))

    def acknowledge(self, root: Path, p: Payload) -> Result:
        return Result.of(plans.acknowledge(root, p.id, p.at, source=p.source, track=p.env or None))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(plans.abandon(root, p.id, p.why, p.at, track=p.env or None))

    def link(self, root: Path, p: plan_payloads.LinkPayload) -> Result:
        return Result.of(plans.link(root, p.id, p.ref, track=p.env or None))
