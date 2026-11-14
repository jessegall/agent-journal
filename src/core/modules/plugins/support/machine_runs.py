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
    def category_folder(plugin: str, category: str) -> Path:
        machine = Path(os.environ[MACHINE_FOLDER_VARIABLE]) if MACHINE_FOLDER_VARIABLE in os.environ else Path.home() / JOURNAL_FOLDER
        return machine / MACHINE_RUNS_FOLDER / plugin / category

    def run_file(self, process: Process) -> Path:
        project = hashlib.sha256(str(self.home.folder.resolve()).encode()).hexdigest()[:PROJECT_MARK_CHARACTERS]
        return self.category_folder(process.plugin, process.run_name) / f"{project}-{process.id}"

    def claim(self, process: Process) -> None:
        path = self.run_file(process)
        FileAccess.mkdir(path.parent, parents=True, exist_ok=True)
        FileAccess.write(path, str(self.outputs.pid_path(process.id)))

    def release(self, process: Process) -> None:
        FileAccess.unlink(self.run_file(process), missing_ok=True)

    def count(self, plugin: str, category: str) -> int:
        folder = self.category_folder(plugin, category)
        if not FileAccess.is_dir(folder):
            return 0
        counted = 0
        for path in FileAccess.iterdir(folder):
            if self.is_blocked(path):
                counted += 1
            else:
                FileAccess.unlink(path, missing_ok=True)
        return counted

    def is_blocked(self, run_file: Path) -> bool:
        pid_file = Path(FileAccess.read(run_file).strip())
        if FileAccess.is_file(pid_file):
            return ProcessIds.text_exists(FileAccess.read(pid_file).strip())
        return self.clock.epoch_seconds() - FileAccess.stat(run_file).st_mtime < START_GRACE_SECONDS
