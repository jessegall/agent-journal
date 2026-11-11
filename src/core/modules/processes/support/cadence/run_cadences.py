from engine.container.container import Container
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.support.cadence.cadence_limits_reader import CadenceLimitsReader
from core.modules.processes.support.cadence.cadence_log import CadenceLog
from core.modules.processes.support.cadence.run_cadence import RunCadence


class RunCadences:
    """The one builder of a run's cadence: its age since it started or since the watching resumed after a break,
    the present time, the growth times its log keeps and the cadence limits of its environment. The cadence watch
    and the facts of the reading engine both build it here."""

    def __init__(self, container: Container, log: CadenceLog) -> None:
        self.container, self.log = container, log

    def for_process(self, process: Process, current: Timestamp) -> RunCadence:
        now = current.value.timestamp()
        started = (process.started_at or process.creation_timestamp()).value.timestamp()
        limits = CadenceLimitsReader.limits(self.container, process.environment_id)
        return RunCadence(now - max(started, self.log.resumed(process.id)), now, self.log.growths(process.id), limits)
