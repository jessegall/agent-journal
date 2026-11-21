
from journal.engine.agent_launcher import AgentLauncher
from journal.features.hydration.support.session_hydration import SessionHydration
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.environment import Environment
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink
from journal.config import Config
from journal.http.support.model_fields import ModelFields
from journal.support.worktree import Worktree
from journal.support.rejection import Rejection
from journal.features.git.support.start_rule import StartRule
from journal.features.git.support.worktree_removal import WorktreeRemoval


class EnvironmentController(Controller[Environment]):
    """The project's environments; one is made here, its chat filled from a conversation an agent program stored for the project when one is named, an agent is started in one from here, stopped, or removed with everything in it; the project's stored conversations are listed for the form."""

    repository: Environments

    def __init__(self, environments: Environments, launcher: AgentLauncher, supervisor: SupervisorLink, config: Config, starts: StartRule,
                 hydration: SessionHydration, removal: WorktreeRemoval) -> None:
        self.repository, self.launcher, self.supervisor, self.config = environments, launcher, supervisor, config
        self.starts, self.hydration, self.removal = starts, hydration, removal

    def index_page(self, rows: list[Environment]) -> list[dict]:
        return self.shown_page(rows)

    def shown_page(self, rows: list[Environment]) -> list[dict]:
        return [{**ModelFields.build(row), "worktree": self.worktree_badge(row)} for row in rows]

    def worktree_badge(self, environment: Environment) -> str:
        return next(iter(Worktree(self.config.root, environment.name).badges()), "")

    def store(self, request: Request) -> Response:
        name, session = request.body.get("name", "").strip(), request.body.get("session", "")
        if not name:
            raise Rejection("an environment needs a name")
        environment = self.hydration.created(name, request.body.get("provider", "claude"), session, request.actor) if session else self.repository.lookup(name)
        return Response.json(environment, 201)

    def sessions(self, request: Request) -> Response:
        return Response.json(self.hydration.past_sessions())

    def filling(self, request: Request) -> Response:
        return Response.json({"percent": self.hydration.filled_percent(request.query.get("name", ""))})

    def launch(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        refusal = self.starts.refusal(environment)
        if refusal:
            raise Rejection(refusal)
        self.launcher.start(environment.name, request.body.get("agent", "claude"))
        return Response.json(environment)

    def stop(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.supervisor.stop(environment.row_id)
        return Response.json(environment)

    def worktree_removal(self, request: Request) -> Response:
        return Response.json({"line": self.removal.removed(self.repository.find(request.number("id")).name)})

    def remove(self, request: Request) -> Response:
        environment = self.repository.find(request.number("id"))
        self.repository.wipe(environment, request.actor)
        return Response.json({"worktree": Worktree(self.config.root, environment.name).worktree_note()})
