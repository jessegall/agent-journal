import hashlib
import os
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JOURNAL_FOLDER, JournalHome
from engine.process.process_ids import ProcessIds
from engine.time.clock import Clock
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder

MACHINE_FOLDER_VARIABLE = "JOURNAL_MACHINE_FOLDER"
MACHINE_RUNS_FOLDER = "machine-runs"
PROJECT_MARK_CHARACTERS = 12
START_GRACE_SECONDS = 60


class MachineRuns:
    """The runs of a plugin's kind that hold a place anywhere on this machine: one file for each, in the user's
    own journal folder or the folder JOURNAL_MACHINE_FOLDER names, holding the path of the pid file its runner
    writes. A run counts while that runner lives, or for a minute after its place was given while its runner
    starts; a file of a run that counts no more is removed."""

    def __init__(self, home: JournalHome, outputs: OutputFolder, clock: Clock) -> None:
        self.home, self.outputs, self.clock = home, outputs, clock

    @staticmethod
    def kind_folder(plugin: str, category: str) -> Path:
        machine = Path(os.environ[MACHINE_FOLDER_VARIABLE]) if MACHINE_FOLDER_VARIABLE in os.environ else Path.home() / JOURNAL_FOLDER
        return machine / MACHINE_RUNS_FOLDER / plugin / category

    def run_file(self, process: Process) -> Path:
        project = hashlib.sha256(str(self.home.folder.resolve()).encode()).hexdigest()[:PROJECT_MARK_CHARACTERS]
        return self.kind_folder(process.plugin, process.kind) / f"{project}-{process.id}"

    def claim(self, process: Process) -> None:
        path = self.run_file(process)
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, str(self.outputs.pid_path(process.id)))

    def release(self, process: Process) -> None:
        self.run_file(process).unlink(missing_ok=True)

    def count(self, plugin: str, category: str) -> int:
        folder = self.kind_folder(plugin, category)
        if not folder.is_dir():
            return 0
        counted = 0
        for path in folder.iterdir():
            if self.is_held(path):
                counted += 1
            else:
                path.unlink(missing_ok=True)
        return counted

    def is_held(self, run_file: Path) -> bool:
        pid_file = Path(FileAccess.shared().read(run_file).strip())
        if pid_file.is_file():
            return ProcessIds.text_exists(FileAccess.shared().read(pid_file).strip())
        return self.clock.epoch_seconds() - run_file.stat().st_mtime < START_GRACE_SECONDS
