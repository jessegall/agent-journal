from datetime import datetime, timezone

from journal.http.controllers.controller import Controller
from journal.http.plans.plan_outline import PlanOutline
from journal.http.plans.plan_timeline import PlanTimeline
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.link import Link
from journal.models.plan import Plan
from journal.support.ref import Ref
from journal.models.task import Task
from journal.repositories.links import Links
from journal.repositories.plans import PLAN_LINK, Plans
from journal.repositories.tasks import Tasks


class PlanController(Controller[Plan]):
    """Plans in outline, and the user's moves on one: approve, start, park, finish and abandon."""

    def __init__(self, plans: Plans, tasks: Tasks, links: Links, outline: PlanOutline, timeline: PlanTimeline) -> None:
        self.repository, self.tasks, self.links, self.outline, self.timeline = plans, tasks, links, outline, timeline

    def rows(self) -> list[Plan]:
        return self.repository.in_()

    def is_open(self, row: Plan) -> bool:
        return not row.state.is_closed()

    def shown_page(self, rows: list[Plan]) -> list[dict]:
        return [self.outline.of(plan) for plan in rows]

    def timeline_of(self, request: Request) -> Response:
        return Response.json(self.timeline.of(self.repository.find(request.number("id"))))

    def tasks_of(self, request: Request) -> Response:
        return Response.json(self.repository.tasks_of(self.repository.find(request.number("id"))))

    def add_task(self, request: Request) -> Response:
        plan = self.repository.find(request.number("id"))
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=request.body.get("title", ""), brief=request.body.get("brief", "")), request.actor)
        self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=PLAN_LINK), request.actor)
        return Response.json(task, 201)

    def approve(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.approve(self.repository.find(request.number("id")), request.actor)))

    def start(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.start(self.repository.find(request.number("id")), request.actor)))

    def park(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.postpone(self.repository.find(request.number("id")), request.actor)))

    def finish(self, request: Request) -> Response:
        return self.moved(request, lambda plan: plan.finished(datetime.now(timezone.utc).timestamp()))

    def abandon(self, request: Request) -> Response:
        plan = self.repository.find(request.number("id"))
        self.repository.cancel(plan, request.actor)
        return Response.json(self.shown(self.repository.find(plan.id)))

    def moved(self, request: Request, move) -> Response:
        return Response.json(self.shown(self.repository.save(move(self.repository.find(request.number("id"))), request.actor)))
