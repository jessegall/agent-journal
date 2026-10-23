from pathlib import Path
import os
import re
import time
from journal.features.faults.support.request_timer import RequestTimer
from journal.features.faults.support.test_run_files import TestRunFiles

from journal.config import Config
from journal.features.faults.support.slow_request_process_card import SlowRequestProcessCard
from journal.support.listener_queue import ListenerQueue
from journal.engine.clock import Clock
from journal.features.faults.feature import Faults
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.features.faults.support.developer_tally import DeveloperTally
from journal.models.timing import Timing
from journal.features.faults.support.developer_numbers import LOADS_PREFIX
from journal.models.support.request_loads import RequestLoads
from journal.repositories.load_tally import LoadTally
from journal.repositories.setting_rows import SettingRows
from journal.engine.support.nudge_log import NudgeLog
from journal.support.timeout import Timeout
from journal.repositories.scope import Scope

STARTUP_GRACE_SECONDS = 60.0
STARTING = "journal.starting"


HOOK = "HOOK"
OUTWARD_ROUTES = ("/journal/plugins/preview", "/journal/plugins/{n}/remove", "/journal/plugins/{n}/upgrade", "/journal/plugins/{n}/enable", "/journal/plugins", "/journal/updates/install")
OUTWARD_COMMANDS = ("/cli/plugin install", "/cli/plugin upgrade", "/cli/plugin propose", "/cli/setup update", "/cli/update ", "/cli/worker dispatch", "/cli/check run", "/cli/mcp ")


class SlowRequests:
    """Measures each request against its budget, on the CPU time the journal's thread spent on it so a busy machine or a process it waits on is not the journal's fault, where the journal develops itself, every one but a route's first since the boot, which loads its code and a cold cache once, with the rows it loaded while load counting is on, and reports one over it: a mark in the chat per route, settled in place with its worst time and count, and a line to the agent the first time and again once the set minutes have passed since it was last told, the time it was told kept in the mark's data."""

    def __init__(self, config: Config, settings: SettingRows, card: SlowRequestProcessCard, messages: Messages, agents: Agents, environments: Environments, scope: Scope, nudges: NudgeLog, clock: Clock, deferred: ListenerQueue, tally: DeveloperTally, test_runs: TestRunFiles) -> None:
        self.config, self.settings, self.card, self.messages, self.agents, self.environments, self.scope, self.nudges, self.clock, self.deferred = config, settings, card, messages, agents, environments, scope, nudges, clock, deferred
        self.tally = tally
        self.test_runs = test_runs
        self.started = time.monotonic()
        self.measured_routes: set[str] = set()

    def begin(self) -> RequestTimer:
        if self.settings.option(Faults.LOADS):
            LoadTally.begin()
        return RequestTimer.started()

    def measured(self, method: str, path: str, ms: float, cpu_ms: float) -> None:
        loads = LoadTally.ended()
        self.counted(method, path, round(ms), loads)
        route = re.sub(r"/\d+(?=/|$)", "/{n}", path)
        if self.is_first(f"{method} {route}") or not self.judging() or self.is_outward(route):
            return
        budget = self.budget(method)
        if not budget or cpu_ms <= budget:
            return
        self.deferred.add(lambda: self.reported(method, route, round(cpu_ms), budget))

    def counted(self, method: str, path: str, ms: int, loads: RequestLoads) -> None:
        self.tally.measured("developer.hooks" if method == HOOK else "developer.requests", ms)
        self.tally.logged(Timing(method=method, route=path, ms=ms, time=self.clock.time(), loads=loads))
        for count in loads.counts:
            self.tally.added(f"{LOADS_PREFIX}{count.model}", count.rows)
        if method == HOOK:
            self.tally.measured(f"developer.hooks.{path.rsplit('/', 1)[-1]}", ms)

    def is_first(self, route: str) -> bool:
        first = route not in self.measured_routes
        self.measured_routes.add(route)
        return first

    @staticmethod
    def is_outward(route: str) -> bool:
        return route.startswith(OUTWARD_COMMANDS) or route in OUTWARD_ROUTES

    def budget(self, method: str) -> int:
        return self.settings.integer(Faults.EDIT_BUDGET if method == "POST" else Faults.REQUEST)

    def judging(self) -> bool:
        starting = self.config.home / "runtime" / STARTING
        if starting.is_file():
            self.started = time.monotonic()
            return False
        resolved = time.monotonic() - self.started > STARTUP_GRACE_SECONDS
        busy = os.getloadavg()[0] > (os.cpu_count() or 1)
        return bool(self.settings.option(Faults.REPORT)) and resolved and not busy and not self.test_runs.is_testing()

    def reported(self, method: str, route: str, ms: int, budget: int) -> None:
        agent = self.agents.all_current()
        with self.scope.environment(agent.environment_id if agent else self.environments.all()[0].row_id):
            self.flagged(method, route, ms, budget)

    def flagged(self, method: str, route: str, ms: int, budget: int) -> None:
        older = self.messages.keyed(SlowRequestProcessCard.key(method, route), Actor.system())
        previous = older[0].data if older else {}
        count, worst, moment = previous.get("count", 0) + 1, max(ms, previous.get("worst", 0)), self.clock.time()
        agent = self.agents.current()
        reported = agent if agent is not None and self.is_reportable(previous.get("reported_at", 0.0), moment) else None
        reported_at = previous.get("reported_at", 0.0) if reported is None else moment
        data = {"kind": "card", "icon": "gauge", "tone": "bad", "row": "", "count": count, "worst": worst, "reported_at": reported_at}
        detail = f"worst {worst} ms, {count} {'time' if count == 1 else 'times'}, budget {budget} ms"
        self.card.show(method, route, data, detail)
        if reported is not None:
            self.nudges.type_line(reported, Faults.SLOW_REQUEST.create(method=method, route=route, ms=ms, budget=budget))

    def is_reportable(self, reported_at: float, moment: float) -> bool:
        if not reported_at:
            return True
        minutes = self.settings.integer(Faults.REPEAT)
        return minutes > 0 and Timeout.minutes(minutes).started(reported_at).is_elapsed(moment)
