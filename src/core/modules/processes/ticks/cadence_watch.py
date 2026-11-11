from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.processes.commands.warn_cadence.warn_cadence import WarnCadence
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_limits_reader import CadenceLimitsReader
from core.modules.processes.support.cadence.cadence_log import CadenceLog
from core.modules.processes.support.cadence.judged_runs import JudgedRuns
from core.modules.processes.support.cadence.run_cadence import RunCadence
from core.modules.processes.support.cadence.run_notices import RunNotices


class CadenceWatch:
    """Keeps, for each judged run, the times the output of its running part last grew, judges how the run prints,
    and tells its agent once in a while when it prints nothing, stopped printing or prints too seldom. A run
    whose folder cannot be read is written to the system log and the others go on."""

    def __call__(self, container: Container) -> bool:
        now = container.get(Clock).timestamp().value.timestamp()
        changed = [self.watched(container, process, parts, now) for process, parts in container.get(JudgedRuns).running()]
        return any(changed)

    @staticmethod
    def running_part(parts: Sequence[ProcessPart]) -> ProcessPart:
        return next((part for part in parts if part.state is PartState.RUNNING), parts[-1])

    def watched(self, container: Container, process: Process, parts: Sequence[ProcessPart], now: float) -> bool:
        log = container.get(CadenceLog)
        part = self.running_part(parts)
        try:
            before = log.growths(process.id)
            growths = log.record(process.id, log.figure(process.id, part.position), now)
        except OSError as error:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"cadence watch: output {process.id} could not be read: {error}")
            return False
        self.judged(container, process, part, RunCadence(self.age(process, now), now, growths, CadenceLimitsReader.limits(container, process.environment_id)))
        return growths != before

    @staticmethod
    def age(process: Process, now: float) -> float:
        started = process.started_at or process.creation_timestamp()
        return now - started.value.timestamp()

    def judged(self, container: Container, process: Process, part: ProcessPart, cadence: RunCadence) -> None:
        notices = container.get(RunNotices)
        state = cadence.state()
        kind = NoticeKind.of(state)
        if kind is None:
            notices.cleared(process.id)
            return
        if not notices.allowed(process.id, kind, cadence.now):
            return
        notices.recorded(process.id, kind, cadence.now)
        command = WarnCadence(process.id, part.position, kind, self.seconds(state, cadence))
        container.get(Bus).run(command, Actor.core(), environment_id=process.environment_id)

    @staticmethod
    def seconds(state: CadenceState, cadence: RunCadence) -> int:
        match state:
            case CadenceState.STOPPED_WRITING:
                return int(cadence.now - cadence.growths[-1])
            case CadenceState.SPARSE:
                return int(cadence.average_pause())
            case CadenceState.NO_OUTPUT | CadenceState.STREAMING:
                return int(cadence.age)
