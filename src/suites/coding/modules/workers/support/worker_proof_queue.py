from core.base.command.context import Context
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_nudges import PROOF_WAITS
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.support.worker_settings import AFFECTED_TESTS_COMMAND, PROJECT_TEST_COMMAND
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
import shlex

PROOF_WAITS_SOURCE = "workers.proof-waits"
GOING_AFFECTED_STATES = (AffectedTestState.QUEUED, AffectedTestState.PICKING, AffectedTestState.TESTING)


class WorkerProofQueue:
    """Queues the test of every proof of a worktree that has not passed, says how many it queued, and tells the
    main agent of the proofs with no test, which wait for its check."""

    def __init__(self, proofs: ProofQuery, repository: Repository, main_agent_line: MainAgentLine, settings: SettingValues, git: WorktreeGit, queries: Queries) -> None:
        self.proofs, self.repository, self.main_agent_line, self.queries = proofs, repository, main_agent_line, queries
        self.settings, self.git = settings, git

    def has_tests_going(self, worktree: Worktree) -> bool:
        affected = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).matching(Among("state", GOING_AFFECTED_STATES)).exists()
        return affected or self.proofs.tests_waiting(worktree.id)

    def queue_proofs(self, worktree: Worktree, context: Context) -> int:
        queued_count = 0
        for proof in tuple(self.proofs.worktree_proofs(worktree.id).oldest().all_rows()):
            if not proof.test_command:
                continue
            if proof.state is ProofState.SHORT:
                proof = self.repository.save_change(proof, proof.revise(context.timestamp, context.actor, proof.text), context)
            if proof.state is ProofState.SHOWN:
                self.repository.save_change(proof, proof.moved(ProofLifecycle.queue), context)
                queued_count += 1
        return queued_count

    def queue_delivered(self, worktree: Worktree, context: Context) -> None:
        for proof in tuple(self.proofs.delivered_proofs(worktree.id).all_rows()):
            if proof.test_command:
                self.repository.save_change(proof, proof.moved(ProofLifecycle.queue), context)

    def queue(self, worktree: Worktree, context: Context) -> int:
        queued_count = self.queue_proofs(worktree, context)
        self.send_untested_line(worktree, context)
        picker = self.settings.text(AFFECTED_TESTS_COMMAND).strip()
        test = self.settings.text(PROJECT_TEST_COMMAND).strip()
        if picker and test:
            line = shlex.join([*shlex.split(picker), *self.git.changed_files(worktree)])
            self.repository.save(AffectedTest(worktree_id=worktree.id, task_id=worktree.task_id, picker_command=line, test_command=test), context)
            queued_count += 1
        return queued_count

    def send_untested_line(self, worktree: Worktree, context: Context) -> None:
        proofs = [str(proof.id) for proof in self.proofs.untested_proofs(worktree.id).oldest().all_rows()]
        if proofs:
            self.main_agent_line.send(PROOF_WAITS.nudge(worker=worktree.session_agent_id, proofs=" ".join(proofs)).text, PROOF_WAITS_SOURCE, context)
