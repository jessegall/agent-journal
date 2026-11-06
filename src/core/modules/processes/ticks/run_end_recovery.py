from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.container import Container
from core.base.refusal import Refusal
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.rules.support.run_folder_ends import RunFolderEnds
from core.modules.processes.support.output_folder import OutputFolder
from core.base.scope.scopes import Scopes
from core.modules.processes.support.process_settings import ProcessSettings

LEADER_MISSING_SECONDS = 10


class RunEndRecovery:
    """Ends each run whose shell is gone and whose end the server never heard of, any agent that ran it, so a
    run that ended during a restart, or one no runner ever started, releases its queue slot while its agent
    sends no ticks. A run the runner reported first is skipped; one run's refusal leaves the others to go on."""

    def __call__(self, container: Container) -> bool:
        results = [self.end_run(container, process) for process in tuple(container.get(ProcessQuery).running().oldest().all_rows())]
        return any(results)

    def end_run(self, container: Container, process: Process) -> bool:
        bus = container.get(Bus)
        try:
            commands = self.commands(container, process)
            for command in commands:
                bus.run(command, Actor.core(), environment_id=process.environment_id)
        except Refusal:
            return False
        return bool(commands)

    def commands(self, container: Container, process: Process) -> list[Command[object]]:
        folder = container.get(OutputFolder)
        last_sign = folder.heartbeat(process.id) or process.created_at
        has_pid = folder.pid(process.id) is not None
        with container.get(Scopes).read_scope((), None, process.environment_id):
            limit_seconds = LEADER_MISSING_SECONDS if has_pid else container.get(ProcessSettings).integer(ProcessSetting.ORPHAN_SECONDS)
        if last_sign is None or folder.has_leader_process(process.id):
            return []
        if last_sign.elapsed_seconds(container.get(Clock).timestamp()) <= limit_seconds:
            return []
        return container.get(RunFolderEnds).commands(process) or [OrphanProcess(process.id)]
