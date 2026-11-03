from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.container import Container
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_folder_ends import RunFolderEnds

RUNNER_MISSING_SECONDS = 10


class RunEndRecovery:
    """Ends each run whose runner is gone and whose end the server never heard of, whichever agent ran it, so
    a run that ended during a restart frees its queue spot while its agent is stopped and sends no ticks."""

    def __call__(self, container: Container) -> None:
        bus = container.get(Bus)
        folder = container.get(OutputFolder)
        for process in tuple(container.get(ProcessQuery).running().oldest().all_rows()):
            if folder.pid(process.id) is not None and not folder.has_runner_process(process.id):
                for command in self.commands(container, folder, process):
                    bus.run(command, Actor.core(), environment_id=process.environment_id)

    def commands(self, container: Container, folder: OutputFolder, process: Process) -> list[Command[object]]:
        ended = container.get(RunFolderEnds).commands(process)
        last_sign = folder.heartbeat(process.id) or process.created_at
        if ended or last_sign is None or last_sign.elapsed_seconds(container.get(Clock).timestamp()) <= RUNNER_MISSING_SECONDS:
            return ended
        return [OrphanProcess(process.id)]
