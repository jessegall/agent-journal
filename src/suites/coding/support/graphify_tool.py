import os
import shlex
import shutil
import subprocess
from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from pathlib import Path

from engine.time.clock import Clock
from engine.time.timestamp import MINUTE_SECONDS
from engine.git.hook_files_git import GIT_LIMIT_SECONDS
from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from suites.coding.support.graph_files import FAILED_FILE, OUTPUT_FOLDER, REBUILD_LOCK_FILE, RUNNING_FILE, GraphFiles
from suites.coding.support.graphify_settings import GRAPHIFY_CLUSTER_MINUTES, GRAPHIFY_COMMAND, GRAPHIFY_GROUP, GRAPHIFY_INSTALL_COMMAND, GRAPHIFY_REFRESH_MINUTES, GRAPHIFY_SETTINGS
from suites.coding.support.project_graph_claim import ProjectGraphClaim
from engine.journal.journal_home import JournalHome
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_runner import ToolRunner
from core.modules.tools.support.tool_status import ToolStatus
from suites.coding.support.worktree_checkouts import WorktreeCheckouts

INSTALL_LIMIT_SECONDS = 600
CLAIM_VARIABLE = "JOURNAL_GRAPH_CLAIM"
# Runs Graphify's incremental update, which re-extracts code with no LLM, with or without grouping the code into
# communities as its first argument says, then stamps the commit it ran for and, after a grouping, when it grouped;
# the claim is released whatever happens, and a failure is recorded for its commit so a tick does not start it again.
REFRESH_SCRIPT = (
    'grouping="$1"; commit="$2"; shift 2; '
    'if [ "$grouping" = cluster ]; then set -- "$@" update .; else set -- "$@" update . --no-cluster; fi; '
    'if "$@"; then '
    'printf "%s %s\\n" "$commit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > graphify-out/.journal-refresh; rm -f graphify-out/.journal-failed; '
    'if [ "$grouping" = cluster ]; then touch graphify-out/.journal-clustered; fi; '
    'else printf "%s\\n" "$commit" > graphify-out/.journal-failed; fi; '
    'rm -f graphify-out/.journal-running "$JOURNAL_GRAPH_CLAIM"'
)
CLUSTER = "cluster"
UNCLUSTERED = "no-cluster"


SHORT_COMMIT = 7
GRAPHIFY = ToolDefinition("graphify", "Graphify", "Keeps a graph of the project's code in graphify-out, refreshed after each new commit without an LLM, so agents read it warm.",
                          GRAPHIFY_SETTINGS, GRAPHIFY_GROUP)


class GraphifyTool(ToolRunner):
    """Graphify as the journal runs it: installed with its install command, and refreshing one folder's graph
    in the background with its incremental update, one update at a time across the project. A tick updates the
    main checkout's graph only; a worktree takes that graph by copy."""

    def __init__(self, settings: SettingValues, clock: Clock, home: JournalHome, executor: ProcessExecutor) -> None:
        self.settings, self.clock, self.home, self.executor = settings, clock, home, executor
        self.project_claim = ProjectGraphClaim(home)

    @property
    def definition(self) -> ToolDefinition:
        return GRAPHIFY

    def command(self) -> list[str]:
        return shlex.split(self.settings.project.text(GRAPHIFY_COMMAND))

    def is_installed(self) -> bool:
        command = self.command()
        return bool(command) and shutil.which(command[0]) is not None

    def install(self, folder: Path) -> None:
        line = shlex.split(self.settings.project.text(GRAPHIFY_INSTALL_COMMAND))
        if not line:
            raise Refusal("the Graphify install command is empty", f"set {GRAPHIFY_INSTALL_COMMAND}")
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

    def status(self, folder: Path) -> ToolStatus:
        files = GraphFiles(folder)
        stamp = files.stamp()
        return self.stated(folder, self.head(folder), stamp.commit if stamp else "", stamp.refreshed_at if stamp else "", files.is_running(self.clock), False)

    @staticmethod
    def stated(folder: Path, commit: str, graph_commit: str, refreshed_at: str, is_running: bool, is_started: bool) -> ToolStatus:
        stored = f"graphify-out holds the graph of commit {graph_commit[:SHORT_COMMIT]}" if graph_commit else "graphify-out has no graph yet"
        if is_running:
            line = f"Graphify is refreshing the graph for commit {commit[:SHORT_COMMIT]}: {stored}."
        elif graph_commit and graph_commit == commit:
            line = f"Graphify graph in graphify-out is current as of commit {commit[:SHORT_COMMIT]}."
        else:
            line = f"Graphify graph is not current for commit {commit[:SHORT_COMMIT]}: {stored}."
        return ToolStatus(commit, graph_commit, refreshed_at, is_running, is_started, line, str(GraphFiles(folder).running_path))

    def is_failed(self, folder: Path) -> bool:
        commit = self.head(folder)
        return bool(commit) and GraphFiles(folder).failed_commit() == commit

    def refresh(self, folder: Path) -> ToolStatus:
        self.checked_folder(folder)
        if not self.is_installed():
            raise Refusal("Graphify is not installed", "install it on the Tools page or with journal tool install graphify")
        if not self.head(folder):
            raise Refusal(f"{folder} is not a git checkout with a commit")
        status = self.status(folder)
        return status if status.is_running else self.after_start(folder, status)

    def tick(self, folder: Path) -> ToolStatus:
        self.checked_folder(folder)
        status = self.status(folder)
        is_worktree = WorktreeCheckouts(self.home).holds(folder)
        skips_refresh = is_worktree or not self.is_installed() or not status.commit or status.is_current or status.is_running or self.is_failed(folder)
        if skips_refresh or self.refreshed_lately(folder):
            return status
        return self.after_start(folder, status)

    def refreshed_lately(self, folder: Path) -> bool:
        elapsed = GraphFiles(folder).seconds_since_refresh(self.clock)
        return elapsed is not None and elapsed < self.settings.project.number(GRAPHIFY_REFRESH_MINUTES) * MINUTE_SECONDS

    def grouping(self, folder: Path) -> str:
        elapsed = GraphFiles(folder).seconds_since_clustering(self.clock)
        is_due = elapsed is None or elapsed >= self.settings.project.number(GRAPHIFY_CLUSTER_MINUTES) * MINUTE_SECONDS
        return CLUSTER if is_due else UNCLUSTERED

    def after_start(self, folder: Path, status: ToolStatus) -> ToolStatus:
        if not self.started(folder, status.commit):
            return status
        return self.stated(folder, status.commit, status.graph_commit, status.refreshed_at, True, True)

    def started(self, folder: Path, commit: str) -> bool:
        files = GraphFiles(folder)
        if not self.project_claim.claim(self.clock):
            return False
        if not files.claim():
            self.project_claim.release()
            return False
        try:
            environment = {**os.environ, CLAIM_VARIABLE: str(self.project_claim.path)}
            process = subprocess.Popen(["sh", "-c", REFRESH_SCRIPT, "sh", self.grouping(folder), commit, *self.command()], cwd=folder, env=environment, stdin=subprocess.DEVNULL,
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        except OSError:
            files.release()
            self.project_claim.release()
            return False
        files.record_owner(process.pid)
        self.project_claim.record_owner(process.pid)
        return True

    def copy_output(self, source: Path, target: Path) -> list[str]:
        self.copy_graph(source, target)
        return [OUTPUT_FOLDER]

    @staticmethod
    def copy_graph(source: Path, target: Path) -> None:
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
