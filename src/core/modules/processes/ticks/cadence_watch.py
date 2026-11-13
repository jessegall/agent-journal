from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.processes.commands.warn_cadence.warn_cadence import WarnCadence
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_log import CadenceLog
from core.modules.processes.support.cadence.judged_runs import JudgedRuns
from core.modules.processes.support.cadence.marked_commands import MarkedCommands
from core.modules.processes.support.cadence.run_cadence import RunCadence
from core.modules.processes.support.cadence.run_cadences import RunCadences
from core.modules.processes.support.cadence.run_notices import RunNotices
from core.modules.processes.support.cadence.run_silences import RunSilences
from core.modules.processes.support.output_folder import CPU_FILE, OutputFolder
from core.modules.processes.support.silent_start_runs import SilentStartRuns
from core.modules.processes.ticks.hang_watch import HangWatch


class CadenceWatch:
    """Keeps, for each judged run, the times the output of its running part last grew, judges how the run prints,
    and tells its agent once in a while when it prints nothing, stopped printing, prints too seldom, or seems
    stuck earlier_growths the hang watch stops it. A run whose folder cannot be read is written to the system
    log and the others go on."""

    def __call__(self, container: Container) -> bool:
        current = container.get(Clock).timestamp()
        changed = [self.watched(container, process, parts, current) for process, parts in container.get(JudgedRuns).running()]
        return any(changed)

    @staticmethod
    def running_part(parts: Sequence[ProcessPart]) -> ProcessPart:
        return next((part for part in parts if part.state is PartState.RUNNING), parts[-1])

    def watched(self, container: Container, process: Process, parts: Sequence[ProcessPart], current: Timestamp) -> bool:
        log, clock_seconds = container.get(CadenceLog), current.value.timestamp()
        part = self.running_part(parts)
        try:
            prior_growths = log.growths(process.id)
            growths = log.record(process.id, log.figure(process.id, part.position), clock_seconds)
        except OSError as error:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"cadence watch: output {process.id} could not be read: {error}")
            return False
        if growths != prior_growths:
            container.get(RunNotices).clear_frozen(process.id)
        hang = HangWatch.limits(container, process.environment_id).hang
        cadence = container.get(RunCadences).process_cadence(process, current)
        self.judged(container, process, part, cadence, hang)
        self.frozen(container, process, part, current, hang)
        return growths != prior_growths

    def judged(self, container: Container, process: Process, part: ProcessPart, cadence: RunCadence, hang: int) -> None:
        notices = container.get(RunNotices)
        state = cadence.state()
        notice = NoticeKind.cadence_notice(state)
        if notice is None:
            notices.cleared(process.id)
            return
        if container.get(MarkedCommands).skips(notice, SilentStartRuns.name(part.text, part.program, part.category)):
            return
        self.warned(container, process, part, notice, self.seconds(state, cadence), hang, cadence.clock_seconds)

    def frozen(self, container: Container, process: Process, part: ProcessPart, current: Timestamp, hang: int) -> None:
        recorded = container.get(OutputFolder).text(process.id, CPU_FILE).split()
        if len(recorded) != 2:
            return
        clock_seconds = current.value.timestamp()
        silence = container.get(RunSilences).seconds(process, current)
        if silence < hang // 2 or clock_seconds - float(recorded[1]) < hang // 2:
            return
        self.warned(container, process, part, NoticeKind.FROZEN, silence, hang, clock_seconds)

    @staticmethod
    def warned(container: Container, process: Process, part: ProcessPart, notice: NoticeKind, seconds: int, hang: int, clock_seconds: float) -> None:
        notices = container.get(RunNotices)
        if not notices.allowed(process.id, notice, clock_seconds):
            return
        notices.recorded(process.id, notice, clock_seconds)
        container.get(Bus).run(WarnCadence(process.id, part.position, notice, seconds, hang), Actor.core(), environment_id=process.environment_id)

    @staticmethod
    def seconds(state: CadenceState, cadence: RunCadence) -> int:
        match state:
            case CadenceState.STOPPED_WRITING:
                return int(cadence.clock_seconds - cadence.growths[-1])
            case CadenceState.SPARSE:
                return int(cadence.average_pause())
            case CadenceState.SILENT | CadenceState.STREAMING:
                return int(cadence.age)
