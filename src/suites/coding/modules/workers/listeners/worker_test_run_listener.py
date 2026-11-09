from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.driver.command_category import CommandCategory
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch


class WorkerTestRunListener(CommitListener[Created[Process]]):
    """Starts a test a worker asked for by its test command, in the worker's worktree. A test run from a shell
    line is started by that line, and the test of a proof or an affected-test pick by WorkerTestListener."""

    name = "workers.test-run-launch"

    def __init__(self, launch: WorkerTestLaunch, rows: EventRows, worktrees: WorktreeQuery, queries: Queries) -> None:
        self.launch, self.rows, self.worktrees, self.queries = launch, rows, worktrees, queries

    def handle(self, event: Created[Process], logged: LoggedEvent) -> None:
        process = event.row
        if process.category is not CommandCategory.TEST_RUN or process.shell:
            return
        worktree = self.worktrees.worker_worktree(process.session_agent_id)
        if worktree is None or worktree.folder != process.folder or self.is_launched_elsewhere(process):
            return
        self.launch.start_waited(process, process.line, self.rows.required(Agent, process.session_agent_id).session)

    def is_launched_elsewhere(self, process: Process) -> bool:
        return any(self.queries.query(model).filter(process_id=process.id).exists() for model in (Proof, AffectedTest))
