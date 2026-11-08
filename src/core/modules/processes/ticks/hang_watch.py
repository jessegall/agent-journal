from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.scope.scopes import Scopes
from core.modules.processes.commands.stop_hung_process.stop_hung_process import StopHungProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings

CPU_FILE = "cpu"


class HangWatch:
    """Stops each running command whose process tree printed nothing and used no processor time for the hang
    seconds, and tells the agent that started it. The tree's processor time and the moment it last changed
    are kept in the run's folder, so a command that is busy without printing is left alone."""

    def __call__(self, container: Container) -> bool:
        stopped = [process for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()) if self.stopped(container, process)]
        return bool(stopped)

    def stopped(self, container: Container, process: Process) -> bool:
        folder, current = container.get(OutputFolder), container.get(Clock).timestamp()
        group = process.pid or folder.pid(process.id)
        cpu = container.get(GroupCpuTime).seconds(group) if group is not None else None
        if cpu is None:
            return False
        recorded = folder.text(process.id, CPU_FILE).split()
        if len(recorded) != 2 or float(recorded[0]) != cpu:
            folder.write(process.id, CPU_FILE, f"{cpu} {current.value.timestamp()}")
            return False
        idle = int(current.value.timestamp() - float(recorded[1]))
        silent = folder.run_silent_seconds(process.id, current) if folder.total_bytes(process.id) else int(process.creation_timestamp().elapsed_seconds(current))
        seconds = min(idle, silent)
        with container.get(Scopes).read_scope((), None, process.environment_id):
            limit = container.get(ProcessSettings).integer(ProcessSetting.HANG_SECONDS)
        if seconds < limit:
            return False
        container.get(Bus).run(StopHungProcess(process.id, seconds), Actor.core(), environment_id=process.environment_id)
        return True
