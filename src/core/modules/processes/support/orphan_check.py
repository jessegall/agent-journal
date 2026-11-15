from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from engine.driver.span_queries import SpanQueries
from engine.request.request_values import RequestValues
from engine.time.clock import Clock
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process import Process
from core.modules.processes.nudges.process_missing_nudge import ProcessMissingNudge
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.rules.support.run_folder_ends import RunFolderEnds
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings

RUNNING_RUNS_REASON = "every run the agent started and still has running is checked for an orphan"
TICK_INTERVAL_SECONDS = 150


@dataclass(frozen=True)
class OrphanedRuns:
    """The runs of one agent found ended or lost: the lines that tell it of the lost ones, and the commands that end
    them."""

    nudges: tuple[Nudge, ...]
    commands: tuple[Command[object], ...]


class OrphanCheck:
    """At each minute step, a run the agent started whose shell has given no sign of life for longer than the limit,
    or whose runner pid is gone for the lost runner seconds, is ended lost and the agent is told; a run whose folder
    holds an end the server never heard of is ended from the folder. The first step after a long gap, a machine that
    slept, ends nothing lost, since no heartbeat could have been written either. Read once a step, so the lines and
    the commands agree."""

    def __init__(self, processes: ProcessQuery, ends: RunFolderEnds, folder: OutputFolder, settings: ProcessSettings, spans: SpanQueries, clock: Clock, request_values: RequestValues) -> None:
        self.processes, self.ends, self.folder, self.settings, self.spans, self.clock, self.request_values = processes, ends, folder, settings, spans, clock, request_values

    def orphaned(self, event: HookEvent | None, agent_id: int) -> OrphanedRuns:
        firing = event.firing if event is not None else "step"
        return self.request_values.read(f"processes.orphans:{agent_id}:{firing}", lambda: firing, lambda: self.found(agent_id))

    def found(self, agent_id: int) -> OrphanedRuns:
        now = self.clock.timestamp()
        restarted = self.folder.tick_interval_seconds(agent_id, now) > TICK_INTERVAL_SECONDS
        nudges: list[Nudge] = []
        commands: list[Command[object]] = []
        for process in tuple(self.processes.agent_started(agent_id).running().every_row(RUNNING_RUNS_REASON)):
            ended = self.ends.commands(process)
            if ended:
                commands.extend(ended)
            elif self.is_lost(process, agent_id, restarted):
                nudges.append(ProcessMissingNudge.declared().nudge(process=process.id))
                commands.append(OrphanProcess(process.id))
        return OrphanedRuns(tuple(nudges), tuple(commands))

    def is_lost(self, process: Process, agent_id: int, restarted: bool) -> bool:
        last_sign = self.folder.heartbeat(process.id) or process.created_at
        pid_missing = self.folder.pid(process.id) is not None and not self.folder.has_leader_process(process.id)
        limit = Interval(self.settings.seconds(ProcessSetting.MISSING_RUNNER_SECONDS if pid_missing else ProcessSetting.ORPHAN_SECONDS))
        return not restarted and last_sign is not None and limit.has_passed(self.spans, agent_id, last_sign, self.clock.timestamp())
