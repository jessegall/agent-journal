import os
import shlex
import shutil
import subprocess
from dataclasses import replace
from pathlib import Path

from engine.time.clock import Clock
from core.base.git.hook_files_git import GIT_LIMIT_SECONDS
from engine.errors.refusal import Refusal
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tools.support.graph_files import FAILED_FILE, RUNNING_FILE, GraphFiles
from core.modules.tools.support.graph_status import GraphStatus
from core.modules.tools.support.tool_setting import ToolSetting

INSTALL_LIMIT_SECONDS = 600
# Runs Graphify's incremental update, which re-extracts code with no LLM, then stamps the commit it ran for; the
# claim is released whatever happens, and a failure is recorded for its commit so a tick does not start it again.
REFRESH_SCRIPT = (
    'commit="$1"; shift; '
    'if "$@" update .; then '
    'printf "%s %s\\n" "$commit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > graphify-out/.journal-refresh; rm -f graphify-out/.journal-failed; '
    'else printf "%s\\n" "$commit" > graphify-out/.journal-failed; fi; '
    "rm -f graphify-out/.journal-running"
)


class GraphifyTool:
    """Graphify as the journal runs it: installed with its install command, and refreshing one folder's graph
    in the background with its incremental update, never two at once for the folder."""

    def __init__(self, settings: SettingValues, clock: Clock) -> None:
        self.settings, self.clock = settings, clock

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

    @staticmethod
    def run_install(line: list[str], folder: Path) -> None:
        try:
            outcome = subprocess.run(line, cwd=folder, capture_output=True, text=True, timeout=INSTALL_LIMIT_SECONDS, check=False)
        except (OSError, subprocess.TimeoutExpired) as error:
            raise Refusal(f"installing Graphify failed: {error}") from error
        if outcome.returncode != 0:
            detail = (outcome.stderr or outcome.stdout).strip().splitlines()
            raise Refusal(f"installing Graphify failed: {detail[-1] if detail else f'exit code {outcome.returncode}'}")

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
        skips_refresh = not self.is_installed() or not status.commit or status.is_current or status.is_running or self.is_failed(folder)
        if skips_refresh:
            return status
        return self.after_start(folder, status)

    def after_start(self, folder: Path, status: GraphStatus) -> GraphStatus:
        return replace(status, is_running=True, is_started=True) if self.started(folder, status.commit) else status

    def started(self, folder: Path, commit: str) -> bool:
        files = GraphFiles(folder)
        if not files.claim():
            return False
        try:
            process = subprocess.Popen(["sh", "-c", REFRESH_SCRIPT, "sh", commit, *self.command()], cwd=folder, env=os.environ.copy(), stdin=subprocess.DEVNULL,
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        except OSError:
            files.release()
            return False
        files.record_owner(process.pid)
        return True

    @staticmethod
    def copy_graph(source: Path, target: Path) -> None:
        graph = GraphFiles(source).output
        if graph.is_dir():
            shutil.copytree(graph, GraphFiles(target).output, ignore=shutil.ignore_patterns(RUNNING_FILE, FAILED_FILE), dirs_exist_ok=True)

    @staticmethod
    def checked_folder(folder: Path) -> None:
        if not folder.is_dir():
            raise Refusal(f"{folder} is not a folder")
