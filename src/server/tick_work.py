import time
from collections.abc import Callable
from datetime import timedelta

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.driver.hook_event import HookEvent
from core.base.error_log import ErrorLog
from core.base.module.performance_tools import PerformanceTools
from core.modules.developer.support.slow_tick_tool import SlowTickTool
from core.base.driver.hook_route import HookRoute
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls
from core.modules.environments.models.environment import Environment
from core.modules.phone.commands.send_phone_notices.send_phone_notices import SendPhoneNotices
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.grown_outputs import GrownOutputs
from server.round_work import RoundWork

PRUNE_PERIOD = timedelta(days=1)
MINUTE_SECONDS = 60
MAIN_ACTOR = "agent"
THREAD_NAME = "ticker"


class TickWork(RoundWork):
    """The journal's clock, a tick each second: every running output that grew goes through its reader, which
    writes its lines to their file and what it found on the output row, and wakes the listeners. Once a minute
    each open agent other than a subagent gets a tick hook through the hook route, so rules that keep time
    speak on their own, and the notices that wait on paired phones are pushed; once a day the old hook calls
    are pruned and the temp folders of ended sessions removed. Reading the outputs too slowly goes to the slow
    tick tool, at most once a minute; a fault in that reading is logged and does not stop the minute's work."""

    def __init__(self, wake_listeners: Callable[[], None], seconds: Callable[[], float] = time.monotonic) -> None:
        self.wake_listeners, self.seconds = wake_listeners, seconds
        self.pruned_at: Timestamp | None = None
        self.minute_at: Timestamp | None = None
        self.warned_at: Timestamp | None = None

    def run(self, container: Container) -> None:
        started = self.seconds()
        try:
            self.read_running_outputs(container)
        except Exception as error:
            container.get(ErrorLog).reported([THREAD_NAME], error)
        read_seconds = self.seconds() - started
        clock_time = container.get(Clock).timestamp()
        if self.minute_at is None or self.minute_at.elapsed_seconds(clock_time) >= MINUTE_SECONDS:
            self.minute_at = clock_time
            self.run_minute(container, clock_time)
        self.warn_slow_tick(container, read_seconds, clock_time)

    def warn_slow_tick(self, container: Container, tick_seconds: float, clock_time: Timestamp) -> None:
        recently_warned = self.warned_at is not None and self.warned_at.elapsed_seconds(clock_time) < MINUTE_SECONDS
        if not recently_warned and container.get(PerformanceTools).run(SlowTickTool, tick_seconds):
            self.warned_at = clock_time

    def read_running_outputs(self, container: Container) -> None:
        bus, grown = container.get(Bus), container.get(GrownOutputs)
        grown_runs = [process for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()) if grown.has_new_bytes(process.id)]
        for process in grown_runs:
            bus.run(ReadNewOutput(process.id), Actor.core(), environment_id=process.environment_id)
        if grown_runs:
            self.wake_listeners()

    def run_minute(self, container: Container, clock_time: Timestamp) -> None:
        queries, route = container.get(Queries), container.get(HookRoute)
        for agent in tuple(queries.query(Agent).matching(IsNull("ended_at")).all_rows()):
            if agent.role != AgentRole.SUBAGENT:
                route.answer(self.tick(agent, queries.query(Environment).find(agent.environment_id).name, clock_time))
        if self.pruned_at is None or self.pruned_at.elapsed_seconds(clock_time) >= PRUNE_PERIOD.total_seconds():
            container.get(Bus).run(PruneHookCalls(), Actor.core())
            container.get(Bus).run(PruneTempFolders(), Actor.core())
            self.pruned_at = clock_time
        container.get(Bus).run(SendPhoneNotices(), Actor.core())

    @staticmethod
    def tick(agent: Agent, environment: str, clock_time: Timestamp) -> HookEvent:
        seconds = clock_time.value.timestamp()
        actor = MAIN_ACTOR if agent.role == AgentRole.MAIN else f"{agent.role}:{agent.id}"
        return HookEvent.tick(agent.program, agent.session, f"tick-{agent.id}-{int(seconds // MINUTE_SECONDS)}", int(seconds * 1000), actor, environment)
