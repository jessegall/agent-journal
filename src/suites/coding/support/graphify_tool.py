from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.processes.support.queued_process_start import QueuedProcessStart
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.agents.support.agent_rows import AgentRows
from engine.command.bus import Bus
from engine.actor.actor import Actor
from engine.file.file_access import FileAccess
import shlex
import shutil
import subprocess
from engine.enums.process_type import ProcessType
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
from engine.journal.journal_home import JournalHome
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_runner import ToolRunner
from core.modules.tools.support.tool_status import ToolStatus
from suites.coding.support.worktree_checkouts import WorktreeCheckouts

INSTALL_LIMIT_SECONDS = 600
UPDATE_LIMIT_SECONDS = 3600
# Runs Graphify's incremental update, which re-extracts code with no LLM, with or without grouping the code into
# communities as its first argument says, then stamps the commit it ran for and, after a grouping, when it grouped;
# the running mark is removed whatever happens, and a failure is recorded for its commit so a tick does not start it again.
REFRESH_SCRIPT = (
    'grouping="$1"; commit="$2"; shift 2; '
    'if [ "$grouping" = cluster ]; then set -- "$@" update .; else set -- "$@" update . --no-cluster; fi; '
    'if "$@"; then '
    'printf "%s %s\\n" "$commit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > graphify-out/.journal-refresh; rm -f graphify-out/.journal-failed; '
    'if [ "$grouping" = cluster ]; then touch graphify-out/.journal-clustered; fi; '
    'else printf "%s\\n" "$commit" > graphify-out/.journal-failed; fi; '
    'rm -f graphify-out/.journal-running'
)
CLUSTER = "cluster"
UNCLUSTERED = "no-cluster"


SHORT_COMMIT = 7
GRAPHIFY = ToolDefinition("graphify", "Graphify", "Keeps a graph of the project's code in graphify-out, refreshed after each new commit without an LLM, so agents read it warm.",
                          GRAPHIFY_SETTINGS, GRAPHIFY_GROUP)


class GraphifyTool(ToolRunner):
    """Graphify as the journal runs it: installed with its install command, and refreshing one folder's graph
    in the background with its incremental update, a run of the Graphify class that waits in the long lane, so one
    update runs at a time across the project. A tick updates the main checkout's graph only; a worktree takes that
    graph by copy."""

    def __init__(self, settings: SettingValues, clock: Clock, home: JournalHome, executor: ProcessExecutor, bus: Bus, agents: AgentRows, launch: QueuedProcessLaunch,
                 queries: Queries) -> None:
        self.settings, self.clock, self.home, self.executor = settings, clock, home, executor
        self.bus, self.agents, self.launch, self.queries = bus, agents, launch, queries

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
            outcome = self.executor.execute(ExecutionRequest(line, folder, ProcessType.SHELL, INSTALL_LIMIT_SECONDS))
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
        is_worktree = WorktreeCheckouts(self.home).contains(folder)
        skips_refresh = is_worktree or not self.is_installed() or not status.commit or status.is_current or status.is_running or self.is_failed(folder)
        if skips_refresh or self.is_recently_refreshed(folder):
            return status
        return self.after_start(folder, status)

    def is_recently_refreshed(self, folder: Path) -> bool:
        elapsed = GraphFiles(folder).refresh_age_seconds(self.clock)
        return elapsed is not None and elapsed < self.settings.project.number(GRAPHIFY_REFRESH_MINUTES) * MINUTE_SECONDS

    def grouping(self, folder: Path) -> str:
        elapsed = GraphFiles(folder).clustering_age_seconds(self.clock)
        due = elapsed is None or elapsed >= self.settings.project.number(GRAPHIFY_CLUSTER_MINUTES) * MINUTE_SECONDS
        return CLUSTER if due else UNCLUSTERED

    def after_start(self, folder: Path, status: ToolStatus) -> ToolStatus:
        if not self.started(folder, status.commit):
            return status
        return self.stated(folder, status.commit, status.graph_commit, status.refreshed_at, True, True)

    # the update is a process row of the main agent that the runner starts once the long lane grants it
    def started(self, folder: Path, commit: str) -> bool:
        main_agent = self.agents.main_agent()
        files = GraphFiles(folder)
        if main_agent is None or self.has_open_update() or not files.claim():
            return False
        line = shlex.join(["sh", "-c", REFRESH_SCRIPT, "sh", self.grouping(folder), commit, *self.command()])
        try:
            start = StartProcess.single_part(main_agent.id, line, str(folder), ProcessType.GRAPHIFY.category, UPDATE_LIMIT_SECONDS, part_category=ProcessType.GRAPHIFY.value)
            process = self.bus.run(start, Actor.core(), environment_id=main_agent.environment_id)
            files.record_owner(self.launch.start(QueuedProcessStart(process, line, main_agent.session), ForegroundRun.queued_background()))
        except (OSError, Refusal):
            files.release()
            return False
        return True

    # an update that waits for its place or runs is the one update of the project, so no second one waits behind it
    def has_open_update(self) -> bool:
        return self.queries.query(Process).filter(run_name=ProcessType.GRAPHIFY.value).matching(Among("state", RUNNING_STATES)).exists()

    def copy_output(self, source: Path, target: Path) -> list[str]:
        self.copy_graph(source, target)
        return [OUTPUT_FOLDER]

    @staticmethod
    def copy_graph(source: Path, target: Path) -> None:
        graph = GraphFiles(source).output
        if not FileAccess.is_dir(graph):
            return
        copied = GraphFiles(target).output
        FileAccess.mkdir(copied, parents=True, exist_ok=True)
        for file in FileAccess.iterdir(graph):
            if FileAccess.is_file(file) and file.name not in (RUNNING_FILE, FAILED_FILE, REBUILD_LOCK_FILE):
                FileAccess.copy(file, copied / file.name)

    @staticmethod
    def checked_folder(folder: Path) -> None:
        if not FileAccess.is_dir(folder):
            raise Refusal(f"{folder} is not a folder")
