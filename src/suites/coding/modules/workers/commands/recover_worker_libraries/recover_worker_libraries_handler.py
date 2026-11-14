from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.recover_worker_libraries.recover_worker_libraries import RecoverWorkerLibraries
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIBRARIES_LINKED
from suites.coding.modules.workers.support.worktree_libraries import WorktreeLibraries
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class RecoverWorkerLibrariesHandler(Handler[RecoverWorkerLibraries, str]):
    """Links a worktree's missing libraries here in the journal, so the merger's sandbox does not matter, and
    tells the worker when something came back."""

    command = RecoverWorkerLibraries
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, libraries: WorktreeLibraries, nudger: Nudger, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.agents, self.worktrees, self.libraries, self.nudger = agents, worktrees, libraries, nudger

    def handle(self, command: RecoverWorkerLibraries, context: Context) -> str:
        require_merger(self.agents, context)
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.labelled_row(command.worker_id, self.numbers, "worker").text} has no worktree", "journal worker-worktree list shows the worktrees")
        names = self.libraries.repair(worktree)
        if not names:
            return "nothing missing"
        self.nudger.send(command.worker_id, WORKER_LIBRARIES_LINKED, WORKER_JOB_SOURCE, context)
        return f"linked: {', '.join(names)}"
