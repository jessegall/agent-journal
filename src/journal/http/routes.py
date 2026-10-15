from journal.container import Container
from journal.http.controllers.agents import AgentController
from journal.http.controllers.cli import CliController
from journal.http.controllers.entries import EntryController
from journal.http.controllers.environments import EnvironmentController
from journal.http.controllers.hooks import HookController
from journal.http.controllers.mcp import McpController
from journal.http.controllers.messages import MessageController
from journal.http.controllers.plans import PlanController
from journal.http.controllers.questions import QuestionController
from journal.http.controllers.resource_controller import ResourceController
from journal.http.controllers.settings import SettingController
from journal.http.controllers.tasks import TaskController
from journal.http.router import Router
from journal.http.v3.v3_routes import V3Routes
from journal.repositories.docs import Docs
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.workers import Workers

API = "/journal"
"""Version 4's own API, apart from the version 3 one the viewer speaks under /api."""


class Routes:
    """Every path, in one place. The hook and the shim post to the root; everything the viewer reads is under /api."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        get = self.container.get
        router.post("/hooks/{agent}", get(HookController).receive)
        router.post("/cli", get(CliController).run)
        self.resource(router, "tasks", get(TaskController))
        router.post(f"{API}/tasks/{{id}}/start", get(TaskController).start)
        router.post(f"{API}/tasks/{{id}}/log", get(TaskController).log)
        router.post(f"{API}/tasks/{{id}}/finish", get(TaskController).finish)
        self.resource(router, "messages", get(MessageController))
        router.post(f"{API}/messages/{{id}}/read", get(MessageController).read)
        self.resource(router, "questions", get(QuestionController))
        router.post(f"{API}/questions/{{id}}/answer", get(QuestionController).answer)
        self.resource(router, "plans", get(PlanController))
        router.get(f"{API}/plans/{{id}}/tasks", get(PlanController).tasks_of)
        router.post(f"{API}/plans/{{id}}/tasks", get(PlanController).add_task)
        for name, repository in (("facts", Facts), ("reminders", Reminders), ("reports", Reports), ("docs", Docs), ("workers", Workers)):
            self.resource(router, name, ResourceController(get(repository), get(Environments)))
        router.get(f"{API}/mcp", get(McpController).index)
        router.post(f"{API}/mcp/install", get(McpController).install)
        router.post(f"{API}/mcp/check", get(McpController).check)
        router.post(f"{API}/mcp/{{name}}/key", get(McpController).key)
        router.post(f"{API}/mcp/{{name}}/remove", get(McpController).remove)
        router.get(f"{API}/rules", lambda request: self.rules(request))
        router.get(f"{API}/agents", get(AgentController).index)
        router.post(f"{API}/agents/type", get(AgentController).type)
        router.get(f"{API}/environments", get(EnvironmentController).index)
        router.post(f"{API}/environments", get(EnvironmentController).store)
        router.get(f"{API}/entries", get(EntryController).index)
        router.get(f"{API}/entries/since", get(EntryController).since)
        router.get(f"{API}/settings", get(SettingController).index)
        router.post(f"{API}/settings", get(SettingController).store)
        V3Routes(self.container).mount(router)
        router.get(f"{API}/settings/voice", get(SettingController).voice)
        router.get(f"{API}/settings/values", get(SettingController).values)
        return router

    @staticmethod
    def resource(router: Router, name: str, controller) -> None:
        router.get(f"{API}/{name}", controller.index)
        router.get(f"{API}/{name}/{{id}}", controller.show)
        router.post(f"{API}/{name}", controller.store)
        router.post(f"{API}/{name}/{{id}}", controller.update)

    def rules(self, request):
        from journal.http.response import Response
        from journal.repositories.rules import Rules
        return Response.json(self.container.get(Rules).page(500))
