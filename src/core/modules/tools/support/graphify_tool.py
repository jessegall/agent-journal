import os
import shlex
import shutil
import subprocess
from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from dataclasses import replace
from pathlib import Path

from engine.time.clock import Clock
from engine.git.hook_files_git import GIT_LIMIT_SECONDS
from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from core.modules.tools.support.graph.graph_files import FAILED_FILE, REBUILD_LOCK_FILE, RUNNING_FILE, GraphFiles
from core.modules.tools.support.graph.graph_status import GraphStatus
from core.modules.tools.support.graph.project_graph_claim import ProjectGraphClaim
from engine.journal.journal_home import JournalHome
from core.modules.tools.models.enums.tool_setting import ToolSetting

INSTALL_LIMIT_SECONDS = 600
CLAIM_VARIABLE = "JOURNAL_GRAPH_CLAIM"
# Runs Graphify's incremental update, which re-extracts code with no LLM, then stamps the commit it ran for; the
# claim is released whatever happens, and a failure is recorded for its commit so a tick does not start it again.
REFRESH_SCRIPT = (
    'commit="$1"; shift; '
    'if "$@" update .; then '
    'printf "%s %s\\n" "$commit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > graphify-out/.journal-refresh; rm -f graphify-out/.journal-failed; '
    'else printf "%s\\n" "$commit" > graphify-out/.journal-failed; fi; '
    'rm -f graphify-out/.journal-running "$JOURNAL_GRAPH_CLAIM"'
)


class GraphifyTool:
    """Graphify as the journal runs it: installed with its install command, and refreshing one folder's graph
    in the background with its incremental update, one update at a time across the project. A tick updates the
    main checkout's graph only; a worktree takes that graph by copy."""

    def __init__(self, settings: SettingValues, clock: Clock, home: JournalHome, executor: ProcessExecutor) -> None:
        self.settings, self.clock, self.home, self.executor = settings, clock, home, executor
        self.project_claim = ProjectGraphClaim(home)

    def command(self) -> list[str]:
        return shlex.split(self.settings.project.text(ToolSetting.GRAPHIFY_COMMAND.key))

    def is_installed(self) -> bool:
        command = self.command()
        return bool(command) and shutil.which(command[0]) is not None

    def install(self, folder: Path) -> None:
        line = shlex.split(self.settings.project.text(ToolSetting.GRAPHIFY_INSTALL_COMMAND.key))
        if not line:
            raise Refusal("the Graphify install command is empty", "set journal.core.tools.graphify-install-command")
        self.run_install(line, folder)
        self.run_install([*self.command(), "install"], folder)

    def run_install(self, line: list[str], folder: Path) -> None:
        try:
            outcome = self.executor.execute(ExecutionRequest(line, folder, ProcessKind.SHELL, INSTALL_LIMIT_SECONDS))
        except (OSError, RunTimeLimitError) as error:
            raise Refusal(f"installing Graphify failed: {error}") from error
        if not outcome.succeeded:
            detail = (outcome.stderr or outcome.stdout).strip().splitlines()
            raise Refusal(f"installing Graphify failed: {detail[-1] if detail else f'exit code {outcome.exit_code}'}")

    def head(self, folder: Path) -> str:
        try:
            outcome = subprocess.run(["git", "-C", str(folder), "rev-parse", "HEAD"], capture_output=True, text=True, timeout=GIT_LIMIT_SECONDS, check=False)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return outcome.stdout.strip() if outcome.returncode == 0 else ""

    def status(self, folder: Path, is_started: bool = False) -> GraphStatus:
        files = GraphFiles(folder)
        stamp = files.stamp()
        return GraphStatus(self.head(folder), stamp.commit if stamp else "", stamp.refreshed_at if stamp else "", files.is_running(self.clock), is_started)

    def is_failed(self, folder: Path) -> bool:
        commit = self.head(folder)
        return bool(commit) and GraphFiles(folder).failed_commit() == commit

    def refresh(self, folder: Path) -> GraphStatus:
        self.checked_folder(folder)
        if not self.is_installed():
            raise Refusal("Graphify is not installed", "install it on the Tools page or with journal tool install graphify")
        if not self.head(folder):
            raise Refusal(f"{folder} is not a git checkout with a commit")
        status = self.status(folder)
        return status if status.is_running else self.after_start(folder, status)

    def tick(self, folder: Path) -> GraphStatus:
        self.checked_folder(folder)
        status = self.status(folder)
        is_worktree = self.home.worktrees_folder.resolve() in folder.resolve().parents
        skips_refresh = is_worktree or not self.is_installed() or not status.commit or status.is_current or status.is_running or self.is_failed(folder)
        if skips_refresh:
            return status
        return self.after_start(folder, status)

    def after_start(self, folder: Path, status: GraphStatus) -> GraphStatus:
        return replace(status, is_running=True, is_started=True) if self.started(folder, status.commit) else status

    def started(self, folder: Path, commit: str) -> bool:
        files = GraphFiles(folder)
        if not self.project_claim.claim(self.clock):
            return False
        if not files.claim():
            self.project_claim.release()
            return False
        try:
            environment = {**os.environ, CLAIM_VARIABLE: str(self.project_claim.path)}
            process = subprocess.Popen(["sh", "-c", REFRESH_SCRIPT, "sh", commit, *self.command()], cwd=folder, env=environment, stdin=subprocess.DEVNULL,
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        except OSError:
            files.release()
            self.project_claim.release()
            return False
        files.record_owner(process.pid)
        self.project_claim.record_owner(process.pid)
        return True

    @staticmethod
    def copy_graph(source: Path, target: Path) -> None:
        """Copies the graph files at the top of the source's graph folder, such as graph.json, and none of its folders:
        the cache and the dated snapshots stay with the source, so a new worktree takes no copy of them."""
        graph = GraphFiles(source).output
        if not graph.is_dir():
            return
        copied = GraphFiles(target).output
        copied.mkdir(parents=True, exist_ok=True)
        for file in graph.iterdir():
            if file.is_file() and file.name not in (RUNNING_FILE, FAILED_FILE, REBUILD_LOCK_FILE):
                shutil.copy2(file, copied / file.name)

    @staticmethod
    def checked_folder(folder: Path) -> None:
        if not folder.is_dir():
            raise Refusal(f"{folder} is not a folder")
