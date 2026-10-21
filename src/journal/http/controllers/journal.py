import os
import time as timing

from journal.config import Config
from journal.features.updates.support.update_card import UpdateCard
from journal.http.agents.agent_activity import AgentActivity
from journal.http.agents.bar_row import BarRow
from journal.http.agents.current_work import CurrentWork
from journal.http.journal.answer_time import AnswerTime
from journal.http.journal.environment_data import EnvironmentData
from journal.http.journal.task_block import TaskBlock
from journal.http.journal.manifest import Manifest
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.repositories.statistics import Statistics
from journal.repositories.timings import Timings
from journal.support.scope import Scope
from journal.repositories.tasks import Tasks
from journal.version import VERSION

COLOR = "#5e64c9"
STARTED = timing.time()
SILENCE_LIMIT_SECONDS = 900.0
ACTIVITY_ROW_LENGTH = 8
LOGGED_SHOWN = 100


class JournalController:
    """The journal as a whole: what the viewer boots from, who and where it is, how each environment stands, and what the current agent is doing this moment."""

    def __init__(self, config: Config, manifest: Manifest, environments: Environments, agents: Agents, activity: AgentActivity, current: CurrentWork,
                 entries: Entries, messages: Messages, questions: Questions, tasks: Tasks, scope: Scope, mark: UpdateCard, statistics: Statistics, timings: Timings) -> None:
        self.statistics, self.timings = statistics, timings
        self.config, self.boot, self.environments, self.agents, self.activity, self.current = config, manifest, environments, agents, activity, current
        self.entries, self.messages, self.questions, self.tasks, self.scope, self.mark = entries, messages, questions, tasks, scope, mark

    def manifest(self, request: Request) -> Response:
        return Response.json(self.boot.of(self.first().name))

    def identity(self, request: Request) -> Response:
        return Response.json({"project": self.config.root.name, "color": COLOR, "root": str(self.config.home), "version": VERSION, "pid": os.getpid(),
                              "environments": [e.name for e in self.environments.all()] or ["main"]})

    def health(self, request: Request) -> Response:
        return Response.json({"answering": True})

    def journals(self, request: Request) -> Response:
        return Response.json([{"port": self.config.port, "project": self.config.root.name, "version": VERSION, "root": str(self.config.home), "current": True}])

    def developer(self, request: Request) -> Response:
        numbers = self.statistics.under("developer.")
        kinds = sorted({key.split(".")[2] for key in numbers if key.startswith("developer.hooks.") and key.count(".") == 3})
        times = {"hooks": AnswerTime.read(numbers, "developer.hooks"), "requests": AnswerTime.read(numbers, "developer.requests")}
        by_kind = {kind: AnswerTime.read(numbers, f"developer.hooks.{kind}").as_data() for kind in kinds}
        as_rows = lambda timings: [{"method": t.method, "route": t.route, "ms": t.ms, "time": t.time} for t in timings]
        return Response.json({**{key: answer.as_data() for key, answer in times.items()}, "by_kind": by_kind, "recent": as_rows(self.timings.recent(LOGGED_SHOWN)), "slowest": as_rows(self.timings.slowest(LOGGED_SHOWN))})

    def developer_reset(self, request: Request) -> Response:
        self.statistics.cleared("developer.", request.actor)
        self.timings.cleared(request.actor)
        return self.developer(request)

    def summary(self, request: Request) -> Response:
        held = self.mark.held()
        return Response.json({"project": self.config.root.name, "root": str(self.config.home), "version": VERSION, "started": STARTED, "color": COLOR,
                              "updating": held.to if held else "", "step": held.step if held else "",
                              "environments": [self.data(e) for e in (self.environments.all() or [self.environments.named("main")])]})

    def data(self, environment: Environment) -> EnvironmentData:
        with self.scope.of(environment.id):
            agent = self.agents.current()
            activity = self.activity.page([agent])[0] if agent else None
            work = self.current.of(agent) if agent else None
            task = TaskBlock(work.task.id, work.task.title, work.awaiting) if work else None
            silent = bool(activity) and activity["status"] in ("busy", "working") and timing.time() - activity["heard_at"].timestamp() > SILENCE_LIMIT_SECONDS
            return EnvironmentData(environment, activity, task, len(self.questions.open()), len(self.messages.unread()), self.tasks.unfinished_count(), silent)

    def bar(self, request: Request) -> Response:
        agent = self.agents.current()
        if not agent:
            return Response.json([])
        recent = [e for e in reversed(self.entries.of_kind_in(60)) if e.actor and e.actor.id == agent.session and BarRow.is_shown(e)]
        queue, open_ = [], {}
        for row in map(BarRow.of, recent):
            if not row.ended:
                open_[row.key] = row.item()
                queue.append(open_[row.key])
            elif row.key in open_:
                open_[row.key].update(done=True, **{"for": max(0.0, row.time - open_[row.key]["time"])})
        return Response.json(queue[-ACTIVITY_ROW_LENGTH:])

    def first(self) -> Environment:
        return (self.environments.all() or [self.environments.named("main")])[0]
