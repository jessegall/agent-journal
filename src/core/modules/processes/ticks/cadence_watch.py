from collections.abc import Sequence

from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_log import CadenceLog
from core.modules.processes.support.cadence.judged_runs import JudgedRuns


class CadenceWatch:
    """Keeps, for each judged run, the times the output of its running part last grew, so its cadence can be
    judged; it sends nothing yet. A run whose folder cannot be read is written to the system log and the others
    go on."""

    def __call__(self, container: Container) -> bool:
        now = container.get(Clock).timestamp().value.timestamp()
        changed = [self.watched(container, process, parts, now) for process, parts in container.get(JudgedRuns).running()]
        return any(changed)

    @staticmethod
    def running_part(parts: Sequence[ProcessPart]) -> ProcessPart:
        return next((part for part in parts if part.state is PartState.RUNNING), parts[-1])

    def watched(self, container: Container, process: Process, parts: Sequence[ProcessPart], now: float) -> bool:
        log = container.get(CadenceLog)
        try:
            before = log.growths(process.id)
            return log.record(process.id, log.figure(process.id, self.running_part(parts).position), now) != before
        except OSError as error:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"cadence watch: output {process.id} could not be read: {error}")
            return False
