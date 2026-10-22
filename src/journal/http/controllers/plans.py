from datetime import datetime, timezone

from journal.features.plans.support.review_rounds import ReviewRounds
from journal.features.tasks.active_task import ActiveTask
from journal.http.controllers.controller import Controller
from journal.http.plans.plan_outline import PlanOutline
from journal.http.plans.plan_timeline import PlanTimeline
from journal.http.support.request import Request
from journal.support.caller import Caller
from journal.support.response import Response
from journal.models.link import Link
from journal.models.plan import Plan
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.repositories.links import Links
from journal.repositories.plans import PLAN_LINK, Plans
from journal.repositories.tasks import Tasks


class PlanController(Controller[Plan]):
    """Plans in outline, and the user's moves on one: approve, start, park, finish and abandon."""

    repository: Plans

    def __init__(self, plans: Plans, tasks: Tasks, links: Links, outline: PlanOutline, timeline: PlanTimeline, taking: ActiveTask, rounds: ReviewRounds) -> None:
        self.repository, self.tasks, self.links, self.outline, self.moments, self.taking, self.rounds = plans, tasks, links, outline, timeline, taking, rounds

    def rows(self) -> list[Plan]:
        return self.repository.scoped()

    def is_open(self, row: Plan) -> bool:
        return not row.state.is_closed()

    def shown_page(self, rows: list[Plan]) -> list[dict]:
        return [self.outline.build(plan) for plan in rows]

    def timeline(self, request: Request) -> Response:
        return Response.json(self.moments.build(self.repository.find(request.number("id"))))

    def plan_tasks(self, request: Request) -> Response:
        return Response.json(self.repository.plan_tasks(self.repository.find(request.number("id"))))

    def add_task(self, request: Request) -> Response:
        plan = self.repository.find(request.number("id"))
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=request.body.get("title", ""), brief=request.body.get("brief", "")), request.actor)
        self.links.save(Link(source=Ref.build(task), target=Ref.build(plan), kind=PLAN_LINK), request.actor)
        return Response.json(task, 201)

    def review(self, request: Request) -> Response:
        return Response.json(self.shown(self.rounds.begin(self.repository.find(request.number("id")), request.actor)))

    def approve(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.approve(self.repository.find(request.number("id")), request.actor)))

    def start(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.start(self.repository.find(request.number("id")), self.taking.holder(Caller.user(request.environment)), request.actor)))

    def suspend(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.postpone(self.repository.find(request.number("id")), request.actor)))

    def finish(self, request: Request) -> Response:
        return self.moved(request, lambda plan: plan.finished(datetime.now(timezone.utc).timestamp()))

    def abandon(self, request: Request) -> Response:
        plan = self.repository.find(request.number("id"))
        self.repository.cancel(plan, request.actor)
        return Response.json(self.shown(self.repository.find(plan.row_id)))

    def moved(self, request: Request, move) -> Response:
        return Response.json(self.shown(self.repository.save(move(self.repository.find(request.number("id"))), request.actor)))
