from core.modules.agents.support.agent_rows import AgentRows
from engine.enums.agent_role import AgentRole
from core.modules.plans.commands.assign_plan.assign_plan import AssignPlan
from suites.coding.modules.workers.support.work_units import WorkUnits
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.commands.record_worktree_release.record_worktree_release import RecordWorktreeRelease
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_own_changes import WorktreeOwnChanges
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME


class ReleaseWorkerHandler(Handler[ReleaseWorker, ReleaseOutcome]):
    """Releases a worker's tasks and removes its worktree, keeping a branch with commits. Git runs outside any
    transaction; a release whose git failed goes on from the abandoned worktree."""

    runs_once = True
    command = ReleaseWorker

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, environments: EnvironmentRows, bus: Bus, numbers: RowNumbers, units: WorkUnits, agents: AgentRows, worker_changes: WorktreeOwnChanges) -> None:
        self.numbers, self.units, self.agents, self.own_changes = numbers, units, agents, worker_changes
        self.worktrees, self.git, self.environments, self.bus = worktrees, git, environments, bus

    def handle(self, command: ReleaseWorker, context: Context) -> ReleaseOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.labelled_row(command.worker_id, self.numbers, "worker").text} has no worktree out", "journal worker-worktree list shows the worktrees")
        if worktree.commit_count and worktree.state is WorktreeState.CUT and not command.abandons_commits:
            number = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
            raise Refusal(f"worker {number} has committed work", f'merge it with journal worker merge {number} --up-to <task>, or release with --abandon "<why>"')
        if worktree.state is WorktreeState.CUT and not command.abandons_commits and self.own_changes.has_worker_changes(self.agents.find(command.worker_id), worktree):
            number = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
            raise Refusal(f"worker {number} has uncommitted files in {worktree.folder}", 'commit or remove them, or release with --abandon "<why>"')
        folder = self.environments.find(worktree.environment_id).folder
        self.unassign_plan(worktree, context)
        if worktree.state is WorktreeState.NEW:
            unmerged = self.git.remove(folder, worktree)
            self.bus.run_with_context(CancelWorkerOpening(worktree.id), context)
            return ReleaseOutcome(worktree, worktree.branch if unmerged else "")
        abandoned = self.abandoned(worktree, command, context)
        unmerged = self.git.remove(folder, abandoned)
        removed = self.bus.run_with_context(RecordWorktreeRemoval(abandoned.id), context)
        return ReleaseOutcome(removed, removed.branch if unmerged else "")

    def unassign_plan(self, worktree: Worktree, context: Context) -> None:
        plan = self.units.unit(worktree.session_agent_id).plan
        if plan is None or worktree.commit_count:
            return
        if self.agents.running(AgentRole.MAIN):
            self.bus.run_with_context(AssignPlan(plan.id), context)

    def abandoned(self, worktree: Worktree, command: ReleaseWorker, context: Context) -> Worktree:
        if worktree.state is WorktreeState.ABANDONED:
            return worktree
        return self.bus.run_with_context(RecordWorktreeRelease(worktree.id, command.reason), context)
