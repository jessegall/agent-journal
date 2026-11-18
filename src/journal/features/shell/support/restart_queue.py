from pathlib import Path

from journal.config import Config
from journal.engine.lifecycle import Lifecycle
from journal.models.command_output import CommandOutput
from journal.repositories.command_outputs import CommandOutputs
from journal.features.shell.support.unsupervised_journal import UnsupervisedJournal
from journal.supervisor_link import SupervisorLink

WAITING_FOLDER = "restart-waiting"


class RestartQueue:
    """A restart of an environment's journal, done at once while none of its commands runs, else marked as waiting on the commands running then and done by RestartWait once the last of those ends, so a restart never cuts a running command off and never waits on one started after it was asked; the command asking for the restart is not counted. A restart the supervisor refuses raises UnsupervisedJournal and leaves no restart marker."""

    def __init__(self, outputs: CommandOutputs, supervisor: SupervisorLink, config: Config, lifecycle: Lifecycle) -> None:
        self.outputs, self.supervisor, self.config, self.lifecycle = outputs, supervisor, config, lifecycle

    def restart(self, environment_id: int, asking_folder: str) -> list[CommandOutput]:
        outputs = self.outputs.active_outputs(environment_id, asking_folder)
        if outputs:
            self.record_wait(environment_id, [str(output.id) for output in outputs])
            return outputs
        self.restarted(environment_id)
        return []

    def record_wait(self, environment_id: int, entries: list[str]) -> None:
        self.waiting_folder().mkdir(parents=True, exist_ok=True)
        (self.waiting_folder() / str(environment_id)).write_text(" ".join(entries))

    def restarted(self, environment_id: int) -> None:
        (self.waiting_folder() / str(environment_id)).unlink(missing_ok=True)
        self.lifecycle.restarting()
        reply = self.supervisor.restart_journal(environment_id)
        if not reply.success:
            self.lifecycle.marker().unlink(missing_ok=True)
            raise UnsupervisedJournal(reply.error)

    def waiting(self) -> list[int]:
        return sorted(int(waiting_file.name) for waiting_file in self.waiting_folder().glob("*")) if self.waiting_folder().is_dir() else []

    def is_waiting(self, environment_id: int) -> bool:
        return (self.waiting_folder() / str(environment_id)).is_file()

    def release(self, environment_id: int) -> None:
        numbers = [int(entry) for entry in (self.waiting_folder() / str(environment_id)).read_text().split() if entry.isdigit()]
        if self.outputs.running_among(numbers):
            return
        self.restarted(environment_id)

    def waiting_folder(self) -> Path:
        return self.config.home / "runtime" / WAITING_FOLDER
