from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.link import Link
from journal.models.plan import Plan
from journal.models.ref import Ref
from journal.models.task import Task
from journal.repositories.links import Links
from journal.repositories.not_found import NotFound
from journal.repositories.plans import IN_PLAN, Plans
from journal.repositories.tasks import Tasks


class PlanController(Controller[Plan]):
    def __init__(self, plans: Plans, tasks: Tasks, links: Links) -> None:
        self.repository, self.tasks, self.links = plans, tasks, links

    def tasks_of(self, request: Request) -> Response:
        try:
            return Response.json(self.repository.tasks_of(self.repository.find(request.number("id"))))
        except NotFound as missing:
            return Response.missing(missing)

    def add_task(self, request: Request) -> Response:
        try:
            plan = self.repository.find(request.number("id"))
        except NotFound as missing:
            return Response.missing(missing)
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=request.body.get("title", ""), brief=request.body.get("brief", "")), request.actor)
        self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=IN_PLAN), request.actor)
        return Response.json(task, 201)
