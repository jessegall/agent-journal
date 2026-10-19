import os
import time

from journal.config import Config
from journal.http.agents.agent_activity import AgentActivity
from journal.http.agents.bar_row import BarRow
from journal.http.agents.current_work import CurrentWork
from journal.http.journal.environment_standing import EnvironmentStanding
from journal.http.journal.held_task import HeldTask
from journal.http.journal.manifest import Manifest
from journal.http.request import Request
from journal.http.response import Response
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.version import VERSION

COLOR = "#5e64c9"
STARTED = time.time()
SILENT_AFTER = 900.0
"""Seconds a busy agent may send nothing before the viewer says it is not responding."""
BAR_SHOWN = 8


class JournalController:
    """The journal as a whole: what the viewer boots from, who and where it is, how each environment stands, and what the live agent is doing this moment."""

    def __init__(self, config: Config, manifest: Manifest, environments: Environments, agents: Agents, activity: AgentActivity, current: CurrentWork,
                 entries: Entries, messages: Messages, questions: Questions, tasks: Tasks, scope: Scope) -> None:
        self.config, self.boot, self.environments, self.agents, self.activity, self.current = config, manifest, environments, agents, activity, current
        self.entries, self.messages, self.questions, self.tasks, self.scope = entries, messages, questions, tasks, scope

    def manifest(self, request: Request) -> Response:
        return Response.json(self.boot.of(self.first().name))

    def identity(self, request: Request) -> Response:
        return Response.json({"project": self.config.root.name, "color": COLOR, "root": str(self.config.home), "version": VERSION, "pid": os.getpid(),
                              "environments": [e.name for e in self.environments.all()] or ["main"]})

    def health(self, request: Request) -> Response:
        return Response.json({"answering": True})

    def journals(self, request: Request) -> Response:
        return Response.json([{"port": self.config.port, "project": self.config.root.name, "version": VERSION, "root": str(self.config.home), "current": True}])

    def summary(self, request: Request) -> Response:
        """How each environment stands: its live agent and the task it holds, what waits for the user, and whether a busy agent went quiet."""
        return Response.json({"project": self.config.root.name, "root": str(self.config.home), "version": VERSION, "started": STARTED, "color": COLOR,
                              "environments": [self.standing(e) for e in (self.environments.all() or [self.environments.named("main")])]})

    def standing(self, environment: Environment) -> EnvironmentStanding:
        with self.scope.of(environment.id):
            live = self.agents.live()
            agent = self.activity.page([live])[0] if live else None
            held = self.current.of(live) if live else None
            task = HeldTask(held.task.id, held.task.title, held.awaiting) if held else None
            silent = bool(agent) and agent["status"] in ("busy", "working") and time.time() - agent["heard_at"].timestamp() > SILENT_AFTER
            return EnvironmentStanding(environment, agent, task, len(self.questions.open()), len(self.messages.unread()), self.tasks.unfinished_count(), silent)

    def bar(self, request: Request) -> Response:
        """The status bar's queue: each tool call and each shell part the live agent ran, as it opened and as it closed."""
        live = self.agents.live()
        if not live:
            return Response.json([])
        recent = [e for e in reversed(self.entries.of_kind_in(60)) if e.actor and e.actor.id == live.session and BarRow.is_shown(e)]
        queue, open_ = [], {}
        for row in map(BarRow.of, recent):
            if not row.ended:
                open_[row.key] = row.item()
                queue.append(open_[row.key])
            elif row.key in open_:
                open_[row.key].update(done=True, **{"for": max(0.0, row.at - open_[row.key]["at"])})
        return Response.json(queue[-BAR_SHOWN:])

    def first(self) -> Environment:
        return (self.environments.all() or [self.environments.named("main")])[0]
