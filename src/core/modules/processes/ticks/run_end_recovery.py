from engine.actor.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.container import Container
from engine.errors.refusal import Refusal
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.rules.support.run_folder_ends import RunFolderEnds
from core.modules.processes.support.output_folder import OutputFolder
from core.base.scope.scopes import Scopes
from core.modules.processes.support.process_settings import ProcessSettings


class RunEndRecovery:
    """Ends each run whose shell is gone and whose end the server never heard of, any agent that ran it, so a
    run that ended during a restart, or one no runner ever started, releases its queue slot while its agent
    sends no ticks. A run whose folder holds its end is ended from it at once, with no waiting, and the
    tick runs as the server takes over, so a command that ended while the server restarted shows as ended.
    A run the runner reported first is skipped; one run's refusal leaves the others to go on."""

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
        if folder.has_leader_process(process.id):
            return []
        ends = container.get(RunFolderEnds).commands(process)
        if ends:
            return ends
        last_sign = folder.heartbeat(process.id) or process.created_at
        has_pid = folder.pid(process.id) is not None
        with container.get(Scopes).read_scope((), None, process.environment_id):
            limit = container.get(ProcessSettings).seconds(ProcessSetting.LOST_RUNNER_SECONDS if has_pid else ProcessSetting.ORPHAN_SECONDS)
        if last_sign is None or not limit.has_elapsed(last_sign, container.get(Clock).timestamp()):
            return []
        return [OrphanProcess(process.id)]
