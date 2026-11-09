from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.driver.command_category import CommandCategory
from core.base.scope.scopes import Scopes
from core.modules.processes.commands.ask_agent_to_look.ask_agent_to_look import AskAgentToLook
from core.modules.processes.commands.stop_hung_process.stop_hung_process import StopHungProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.hang_limits import HangLimits
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings

CPU_FILE = "cpu"
LOOK_FILE = "look"
LOOKS_BEFORE_STOP = 3


class HangWatch:
    """Stops each running command whose process tree printed nothing and used no processor time for the hang
    seconds, and tells the agent that started it. A test run that prints nothing for the look seconds while it
    uses processor time may be working or may spin, so its agent is asked to read its output and decide, again
    after each hang seconds, and the run is stopped when the agent has been asked three times and it still prints
    nothing. The tree's processor time and the moment it last changed are kept in the run's folder, with the
    asks made. One listing of the machine's processes serves every run of a tick."""

    def __call__(self, container: Container) -> bool:
        running = tuple(container.get(ProcessQuery).running().oldest().all_rows())
        listing = container.get(GroupCpuTime).listing() if running else None
        if listing is None:
            return False
        limits = {environment_id: self.limits(container, environment_id) for environment_id in {process.environment_id for process in running}}
        acted = [process for process in running if self.acted(container, process, listing, limits[process.environment_id])]
        return bool(acted)

    @staticmethod
    def limits(container: Container, environment_id: int) -> HangLimits:
        with container.get(Scopes).read_scope((), None, environment_id):
            settings = container.get(ProcessSettings)
            return HangLimits(settings.integer(ProcessSetting.HANG_SECONDS), settings.integer(ProcessSetting.LOOK_SECONDS))

    def acted(self, container: Container, process: Process, listing: str, limits: HangLimits) -> bool:
        folder, current = container.get(OutputFolder), container.get(Clock).timestamp()
        group = process.pid or folder.pid(process.id)
        cpu = container.get(GroupCpuTime).seconds(listing, group) if group is not None else None
        if cpu is None:
            return False
        now = current.value.timestamp()
        recorded = folder.text(process.id, CPU_FILE).split()
        moved = len(recorded) != 2 or float(recorded[0]) != cpu
        if moved:
            folder.write(process.id, CPU_FILE, f"{cpu} {now}")
        silent = folder.run_silent_seconds(process.id, current) if folder.total_bytes(process.id) else int(process.creation_timestamp().elapsed_seconds(current))
        if moved:
            return self.looked(container, process, silent, now, limits)
        seconds = min(int(now - float(recorded[1])), silent)
        if seconds < limits.hang:
            return False
        self.stop(container, process, seconds)
        return True

    def looked(self, container: Container, process: Process, silent: int, now: float, limits: HangLimits) -> bool:
        folder = container.get(OutputFolder)
        asks, last = self.asks(folder, process)
        if process.category is not CommandCategory.TEST_RUN or silent < limits.look:
            if asks:
                folder.write(process.id, LOOK_FILE, "")
            return False
        if asks and now - last < limits.hang:
            return False
        if asks >= LOOKS_BEFORE_STOP:
            self.stop(container, process, silent)
            return True
        folder.write(process.id, LOOK_FILE, f"{asks + 1} {now}")
        container.get(Bus).run(AskAgentToLook(process.id, silent), Actor.core(), environment_id=process.environment_id)
        return True

    @staticmethod
    def asks(folder: OutputFolder, process: Process) -> tuple[int, float]:
        recorded = folder.text(process.id, LOOK_FILE).split()
        return (int(recorded[0]), float(recorded[1])) if len(recorded) == 2 else (0, 0.0)

    @staticmethod
    def stop(container: Container, process: Process, seconds: int) -> None:
        container.get(Bus).run(StopHungProcess(process.id, seconds), Actor.core(), environment_id=process.environment_id)
