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
from journal.repositories.statistics import Statistics
from journal.repositories.setting_rows import SettingRows
from journal.supervisor_link import SupervisorLink
from journal.support.scope import Scope
from journal.support.chat_mark import ChatMark

SETTLING_SECONDS = 60.0
STARTING = "journal.starting"
TESTS_RUNNING = "tests.running"


HOOK = "HOOK"


class SlowRequests:
    """Measures each request against its budget where the journal develops itself, and reports one over it: a mark in the chat per route, settled in place with its worst time and count, and a line to the agent the first time."""

    def __init__(self, config: Config, settings: SettingRows, cards: Cards, messages: Messages, agents: Agents, environments: Environments, scope: Scope, nudger: Nudger, supervisor: SupervisorLink, deferred: Deferred, statistics: Statistics) -> None:
        self.config, self.settings, self.cards, self.messages, self.agents, self.environments, self.scope, self.nudger, self.supervisor, self.deferred = config, settings, cards, messages, agents, environments, scope, nudger, supervisor, deferred
        self.statistics = statistics
        self.started = time.monotonic()

    def measured(self, method: str, path: str, ms: float) -> None:
        self.deferred.add(lambda: self.counted(method, path, round(ms)))
        if not self.judging():
            return
        budget = self.budget(method)
        if not budget or ms <= budget:
            return
        route = re.sub(r"/\d+(?=/|$)", "/{n}", path)
        self.deferred.add(lambda: self.reported(method, route, round(ms), budget))

    def counted(self, method: str, path: str, ms: int) -> None:
        self.statistics.measured("developer.hooks" if method == HOOK else "developer.requests", ms, Actor.system())
        if method == HOOK:
            self.statistics.measured(f"developer.hooks.{path.rsplit('/', 1)[-1]}", ms, Actor.system())

    def budget(self, method: str) -> int:
        return int(self.settings.option(Faults.WRITE if method == "POST" else Faults.REQUEST))

    def judging(self) -> bool:
        starting = self.config.home / "runtime" / STARTING
        if starting.is_file():
            self.started = time.monotonic()
            return False
        settled = time.monotonic() - self.started > SETTLING_SECONDS
        busy = os.getloadavg()[0] > (os.cpu_count() or 1)
        return bool(self.settings.option(Faults.REPORT)) and settled and not busy and not self.is_testing()

    def is_testing(self) -> bool:
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
        line = self.nudger.say(agent, Faults.SLOW_REQUEST_TO_FIX.create(method=method, route=route, ms=ms, budget=budget))
        if line:
            self.supervisor.type(agent.environment_id, line)
