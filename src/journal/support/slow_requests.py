from pathlib import Path
import os
import re
import time

from journal.config import Config
from journal.support.cards import Cards
from journal.support.deferred import Deferred
from journal.engine.nudger import Nudger
from journal.features.faults.feature import Faults
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.setting_rows import SettingRows
from journal.supervisor_link import SupervisorLink
from journal.support.scope import Scope
from journal.support.chat_mark import ChatMark

SETTLING_SECONDS = 60.0
"""After the journal starts, which an update is too, nothing is judged: a cold start is always slow."""
STARTING = "journal.starting"
"""The mark the journal keeps in its runtime folder while it starts, so nothing is measured until it has."""
TESTS_RUNNING = "tests.running"
"""The start of the name of the mark each test run keeps in the journal's runtime folder while it runs, ended by its own process number: runs side by side each keep their own, and their servers crowd the machine."""


class SlowRequests:
    """Measures each request against its budget where the journal develops itself, and reports one over it: a mark in the chat per route, settled in place with its worst time and count, and a line to the agent the first time."""

    def __init__(self, config: Config, settings: SettingRows, cards: Cards, messages: Messages, agents: Agents, environments: Environments, scope: Scope, nudger: Nudger, supervisor: SupervisorLink, deferred: Deferred) -> None:
        self.config, self.settings, self.cards, self.messages, self.agents, self.environments, self.scope, self.nudger, self.supervisor, self.deferred = config, settings, cards, messages, agents, environments, scope, nudger, supervisor, deferred
        self.started = time.monotonic()

    def measured(self, method: str, path: str, ms: float) -> None:
        """A request's time, by the path it asked for with its numbers folded, so /journal/plans and /journal/messages are each their own and every message's page is one."""
        if not self.judging():
            return
        budget = self.budget(method)
        if not budget or ms <= budget:
            return
        route = re.sub(r"/\d+(?=/|$)", "/{n}", path)
        self.deferred.add(lambda: self.reported(method, route, round(ms), budget))

    def budget(self, method: str) -> int:
        """The budget a request of this method has, in milliseconds: a write is given more than a read."""
        return int(self.settings.option(Faults.WRITE if method == "POST" else Faults.REQUEST))

    def judging(self) -> bool:
        """Only in the journal's own checkout, never while it starts and only once it has settled after, while no test run is on, and on a machine not busier than it has cores."""
        starting = self.config.home / "runtime" / STARTING
        if starting.is_file():
            self.started = time.monotonic()
            return False
        settled = time.monotonic() - self.started > SETTLING_SECONDS
        busy = os.getloadavg()[0] > (os.cpu_count() or 1)
        return Faults.applies_in(self.config.root) and settled and not busy and not self.is_testing()

    def is_testing(self) -> bool:
        """A test run is on: one of the marks the runs leave, each named by its own process, names a process still running; a mark left by a run that died is stale."""
        return any(self.is_running(mark) for mark in (self.config.home / "runtime").glob(f"{TESTS_RUNNING}.*"))

    @staticmethod
    def is_running(mark: Path) -> bool:
        pid = mark.suffix.lstrip(".")
        if not pid.isdigit():
            return False
        try:
            os.kill(int(pid), 0)
        except ProcessLookupError:
            return False
        return True

    def reported(self, method: str, route: str, ms: int, budget: int) -> None:
        """Marked in the live agent's environment, else the first: a request need not name one, and the report is the journal's own."""
        agent = self.agents.live_anywhere()
        with self.scope.of(agent.environment_id if agent else self.environments.all()[0].id):
            self.marked(method, route, ms, budget)

    def marked(self, method: str, route: str, ms: int, budget: int) -> None:
        key = f"slow:{method} {route}"
        earlier = self.messages.keyed(key, Actor.system())
        count = earlier[0].data.get("count", 0) + 1 if earlier else 1
        worst = max(ms, earlier[0].data.get("worst", 0)) if earlier else ms
        data = {"kind": "card", "session": "", "icon": "gauge", "tone": "bad", "detail": f"worst {worst} ms, {count} {'time' if count == 1 else 'times'}, budget {budget} ms", "row": "", "count": count, "worst": worst}
        self.cards.keyed(self.scope.id, key, f"Slow request: {method} {route}", data, Actor.system(), ChatMark.FAULTS)
        agent = self.agents.live()
        if earlier or agent is None:
            return
        line = self.nudger.say(agent, Faults.SLOW.about(method=method, route=route, ms=ms, budget=budget))
        if line:
            self.supervisor.type(agent.environment_id, line)
