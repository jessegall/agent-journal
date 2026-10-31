import hashlib
from dataclasses import dataclass
from pathlib import Path

SOCKET_PATH_LIMIT_CHARACTERS = 100
SHORT_SOCKET_FOLDER = Path("/tmp")
SERVER_SOCKET = "server"
LAUNCHER_SOCKET = "launcher"


@dataclass(frozen=True)
class JournalHome:
    """The folder where the journal keeps its files, and the paths inside it."""

    folder: Path

    @property
    def project_folder(self) -> Path:
        return self.folder.resolve().parent

    @property
    def database(self) -> Path:
        return self.folder / "journal.db"

    @property
    def error_log(self) -> Path:
        return self.folder / "runtime" / "errors.log"

    @property
    def timing_log(self) -> Path:
        return self.folder / "runtime" / "timing.log"

    @property
    def module_list(self) -> Path:
        return self.folder / "modules.json"

    @property
    def status_folder(self) -> Path:
        return self.folder / "runtime" / "status"

    @property
    def program_table(self) -> Path:
        return self.folder / "programs.json"

    def terminal_file(self, agent_id: int) -> Path:
        return self.folder / "runtime" / "terminals" / f"{agent_id}.log"

    def socket(self, name: str) -> Path:
        path = self.folder.resolve() / f"{name}.sock"
        if len(str(path)) <= SOCKET_PATH_LIMIT_CHARACTERS:
            return path
        return SHORT_SOCKET_FOLDER / f"journal-{hashlib.sha256(str(path).encode()).hexdigest()[:16]}.sock"
