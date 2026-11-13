from engine.file.file_access import FileAccess
import hashlib
from dataclasses import dataclass
from pathlib import Path

HOME_VARIABLE = "JOURNAL_HOME"
JOURNAL_FOLDER = ".journal"

SOCKET_PATH_LIMIT_CHARACTERS = 100
SHORT_SOCKET_FOLDER = Path("/tmp")
SERVER_SOCKET = "server"
LAUNCHER_SOCKET = "launcher"
ENDED_STATUS_FOLDER = "ended"


@dataclass(frozen=True)
class JournalHome:
    """The folder where the journal keeps its files, and the paths inside it."""

    folder: Path

    @property
    def project_folder(self) -> Path:
        return self.folder.resolve().parent

    @property
    def database(self) -> Path:
        return self.folder / "version-5.db"

    @property
    def panic_file(self) -> Path:
        return self.folder / "panic"

    @property
    def panic_announced(self) -> Path:
        return self.folder / "runtime" / "panic-announced"

    @property
    def panic_count(self) -> Path:
        return self.folder / "runtime" / "panic-count"

    @property
    def bypass_log(self) -> Path:
        return self.folder / "runtime" / "bypass.log"

    @property
    def newest_release_file(self) -> Path:
        return self.folder / "runtime" / "newest-release.json"

    @property
    def library_failure_file(self) -> Path:
        return self.folder / "runtime" / "library-failure.json"

    @property
    def alias_file(self) -> Path:
        return self.folder / "runtime" / "aliases.json"

    @property
    def saved_command_file(self) -> Path:
        return self.folder / "runtime" / "saved-commands.json"

    @property
    def alias_category_file(self) -> Path:
        return self.folder / "runtime" / "alias-categories.json"

    @property
    def command_type_file(self) -> Path:
        return self.folder / "runtime" / "command-types.json"

    @property
    def hook_wait_file(self) -> Path:
        return self.folder / "runtime" / "hook-wait-seconds"

    @property
    def system_log(self) -> Path:
        return self.folder / "runtime" / "server.log"

    @property
    def timing_log(self) -> Path:
        return self.folder / "runtime" / "timing.log"

    @property
    def plugin_socket_folder(self) -> Path:
        return SHORT_SOCKET_FOLDER / f"journal-{hashlib.sha256(str(self.folder.resolve()).encode()).hexdigest()[:12]}"

    @property
    def viewer_port_file(self) -> Path:
        return self.folder / "viewer-port"

    @property
    def restart_mark(self) -> Path:
        return self.folder / "server-restarting"

    @property
    def run_lock(self) -> Path:
        return self.folder / "run-lock"

    @property
    def run_queue_halt_file(self) -> Path:
        return self.folder / "run-queue-halted"

    @property
    def pending_files(self) -> Path:
        return self.folder / "files" / "pending"

    def message_files(self, message_id: int) -> Path:
        return self.folder / "files" / "message" / str(message_id)

    @property
    def viewer_sessions_file(self) -> Path:
        return self.folder / "viewer-sessions.json"

    @property
    def module_list(self) -> Path:
        return self.folder / "modules.json"

    @property
    def modules_folder(self) -> Path:
        return self.folder / "modules"

    @property
    def stacks_file(self) -> Path:
        return self.folder / "runtime" / "stacks.log"

    @property
    def status_folder(self) -> Path:
        return self.folder / "runtime" / "status"

    def status_file(self, session: str) -> Path:
        running = self.status_folder / f"{session}.json"
        return running if FileAccess.is_file(running) else self.status_folder / ENDED_STATUS_FOLDER / f"{session}.json"

    @property
    def program_table(self) -> Path:
        return self.folder / "programs.json"

    @property
    def managed_hooks_file(self) -> Path:
        return self.folder / "hooks" / "managed.json"

    @property
    def hook_runner(self) -> Path:
        return self.folder / "bin" / "journal-hook"

    @property
    def hook_runner_choice(self) -> Path:
        return self.folder / "hooks" / "runner"

    @property
    def programs_folder(self) -> Path:
        return self.folder / "programs"

    def program_folder(self, program: str) -> Path:
        return self.programs_folder / program

    def program_settings_file(self, program: str) -> Path:
        return self.program_folder(program) / "settings.json"

    @property
    def program_settings_switch(self) -> Path:
        return self.programs_folder / "switched-at"

    @property
    def program_settings_backups(self) -> Path:
        return self.folder / "backups" / "program-settings"

    @property
    def program_settings_digests(self) -> Path:
        return self.folder / "runtime" / "program-settings.json"

    def terminal_file(self, agent_id: int) -> Path:
        return self.folder / "runtime" / "terminals" / f"{agent_id}.log"

    def socket(self, name: str) -> Path:
        path = self.folder.resolve() / f"{name}.sock"
        if len(str(path)) <= SOCKET_PATH_LIMIT_CHARACTERS:
            return path
        return SHORT_SOCKET_FOLDER / f"journal-{hashlib.sha256(str(path).encode()).hexdigest()[:16]}.sock"
