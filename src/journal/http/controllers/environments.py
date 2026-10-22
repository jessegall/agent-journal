from journal.engine.agent_launcher import AgentLauncher
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.environment import Environment
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink
from journal.config import Config
from journal.http.support.model_fields import ModelFields
from journal.support.worktree import Worktree


class EnvironmentController(Controller[Environment]):
    """The project's environments; an agent is started in one from here, stopped, or the environment removed with everything in it."""

    repository: Environments

    def __init__(self, environments: Environments, launcher: AgentLauncher, supervisor: SupervisorLink, config: Config) -> None:
        self.repository, self.launcher, self.supervisor, self.config = environments, launcher, supervisor, config

    def rows(self) -> list[Environment]:
        return self.repository.all() or [self.repository.lookup("main")]

    def shown_page(self, rows: list[Environment]) -> list[dict]:
        return [{**ModelFields.build(row), "worktree": next(iter(Worktree(self.config.root, row.name).badges()), "")} for row in rows]

    def store(self, request: Request) -> Response:
        return Response.json(self.repository.lookup(request.body.get("name", "main")), 201)

    def launch(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.launcher.start(environment.name, request.body.get("agent", "claude"))
        return Response.json(environment)

    def stop(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.supervisor.stop(environment.row_id)
        return Response.json(environment)

    def remove(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.repository.wipe(environment, request.actor)
        return Response.json({"worktree": Worktree(self.config.root, environment.name).dropped()})
