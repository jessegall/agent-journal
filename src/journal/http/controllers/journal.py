import os
import time as timing

from journal.config import Config
from journal.features.faults.support.developer_numbers import DeveloperNumbers
from journal.features.updates.support.update_card import UpdateCard
from journal.http.agents.agent_activity import AgentActivity
from journal.http.agents.bar_row import BarRow
from journal.http.agents.current_work import CurrentWork
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
from journal.repositories.scope import Scope
from journal.repositories.tasks import Tasks
from journal.version import VERSION

COLOR = "#5e64c9"
STARTED = timing.time()
SILENCE_LIMIT_SECONDS = 900.0
ACTIVITY_ENTRIES = 8


class JournalController:
    """The journal as a whole: what the viewer boots from, who and where it is, how each environment stands, and what the current agent is doing this moment."""

    def __init__(self, config: Config, manifest: Manifest, environments: Environments, agents: Agents, activity: AgentActivity, current: CurrentWork,
                 entries: Entries, messages: Messages, questions: Questions, tasks: Tasks, scope: Scope, threshold: UpdateCard, numbers: DeveloperNumbers) -> None:
        self.numbers = numbers
        self.config, self.boot, self.environments, self.agents, self.activity, self.current = config, manifest, environments, agents, activity, current
        self.entries, self.messages, self.questions, self.tasks, self.scope, self.mark = entries, messages, questions, tasks, scope, threshold

    def manifest(self, request: Request) -> Response:
        return Response.json(self.boot.assembled(self.first().name))

    def identity(self, request: Request) -> Response:
        return Response.json({"project": self.config.root.name, "color": COLOR, "root": str(self.config.home), "version": VERSION, "pid": os.getpid(),
                              "environments": [e.name for e in self.environments.all()] or ["main"]})

    def health(self, request: Request) -> Response:
        return Response.json({"answering": True})

    def journals(self, request: Request) -> Response:
        return Response.json([{"port": self.config.port, "project": self.config.root.name, "version": VERSION, "root": str(self.config.home), "current": True}])

    def developer(self, request: Request) -> Response:
        as_rows = lambda timings: [{"method": t.method, "route": t.route, "ms": t.ms, "time": t.time} for t in timings]
        return Response.json({"hooks": self.numbers.hook_time().as_data(), "requests": self.numbers.request_time().as_data(),
                              "by_kind": {kind: answer.as_data() for kind, answer in self.numbers.hook_averages().items()},
                              "recent": as_rows(self.numbers.recent()), "slowest": as_rows(self.numbers.slowest()),
                              "loads": [{"time": t.time, "label": t.label(), "ms": t.ms, "loads": t.loads.line()} for t in self.numbers.loaded()],
                              "models": [{"model": total.model, "rows": total.rows} for total in self.numbers.model_totals()]})

    def developer_reset(self, request: Request) -> Response:
        self.numbers.reset(request.actor)
        return self.developer(request)

    def summary(self, request: Request) -> Response:
        blocked = self.mark.running()
        return Response.json({"project": self.config.root.name, "root": str(self.config.home), "version": VERSION, "started": STARTED, "color": COLOR,
                              "updating": blocked.target if blocked else "", "step": blocked.step if blocked else "",
                              "environments": [self.data(e) for e in (self.environments.all() or [self.environments.lookup("main")])]})

    def data(self, environment: Environment) -> EnvironmentData:
        with self.scope.environment(environment.row_id):
            agent = self.agents.current()
            activity = self.activity.page([agent])[0] if agent else None
            work = self.current.work(agent) if agent else None
            task = TaskBlock(work.task.row_id, work.task.title, work.wait_text) if work else None
            silent = activity is not None and activity["status"] in ("busy", "working") and timing.time() - activity["heard_at"].timestamp() > SILENCE_LIMIT_SECONDS
            return EnvironmentData(environment, activity, task, len(self.questions.open()), len(self.messages.unread()), self.tasks.unfinished_count(), silent)

    def bar(self, request: Request) -> Response:
        agent = self.agents.current()
        if not agent:
            return Response.json([])
        recent = [e for e in reversed(self.entries.kind_entries_scoped(60)) if e.actor and e.actor.id == agent.session and BarRow.is_shown(e)]
        queue, open_ = [], {}
        for row in (BarRow.build(entry).relative(str(self.config.root)) for entry in recent):
            if not row.ended:
                open_[row.key] = row.item()
                queue.append(open_[row.key])
            elif row.key in open_:
                open_[row.key].update(done=True, parts=[*open_[row.key]["parts"], *row.counts()], hold=max(open_[row.key]["hold"], row.display_seconds()), **{"for": max(0.0, row.time - open_[row.key]["time"])})
                queue.extend(row.file_items())
        return Response.json(queue[-ACTIVITY_ENTRIES:])

    def first(self) -> Environment:
        return (self.environments.all() or [self.environments.lookup("main")])[0]
