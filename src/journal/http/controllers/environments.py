from journal.engine.agent_launcher import AgentLauncher
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.environment import Environment
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink


class EnvironmentController(Controller[Environment]):
    """The project's environments; an agent is started in one from here, stopped, or the environment removed with everything in it."""

    def __init__(self, environments: Environments, launcher: AgentLauncher, supervisor: SupervisorLink) -> None:
        self.repository, self.launcher, self.supervisor = environments, launcher, supervisor

    def rows(self) -> list[Environment]:
        return self.repository.all() or [self.repository.named("main")]

    def store(self, request: Request) -> Response:
        return Response.json(self.repository.named(request.body.get("name", "main")), 201)

    def launch(self, request: Request) -> Response:
        """An agent started from the viewer runs detached under its own supervisor; the viewer sees it once its start hook arrives."""
        environment = self.repository.find(request.number("id"))
        self.launcher.start(environment.name, request.body.get("agent", "claude"))
        return Response.json(environment)

    def stop(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.supervisor.stop(environment.id)
        return Response.json(environment)

    def remove(self, request: Request) -> Response:
        self.repository.wipe(self.repository.find(request.number("id")), request.actor)
        return Response.json({})
