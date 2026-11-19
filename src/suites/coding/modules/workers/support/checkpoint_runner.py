import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.checkpoint_checkout import CheckpointCheckout
from suites.coding.modules.workers.support.checkpoint_folders import FOLDER_NAME, CheckpointFolders
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.support.worker_run_starts import WorkerRunStarts
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.phase_test_deferrals import PhaseTestDeferrals
from suites.coding.modules.workers.support.worker_settings import AFFECTED_TESTS_COMMAND, PROJECT_TEST_COMMAND
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_test_start import WorkerTestStart

COMMITTED_PROOFS_REASON = "a checkpoint runs the tests of every committed proof of its tasks"


class CheckpointRunner(CheckpointRuns[CheckpointCheckout]):
    """Starts the tests of a reached checkpoint in the background runner proof tests use, in the checkout
    CheckpointFolders names, made whenever a proof or a test is to run: each committed proof of the window by
    its own command, the checkpoint's own test once as its command is written, with the test paths a merger deferred left out or added, and
    the selected run over the files the window changed. An early run starts only the committed proofs. A reach
    whose tests were started is not started again. With no owner the own test and the selected run are not
    run. A run with no test passes at once, as the core's runs do. The checkout and the diff are made before the
    write that starts the run, so no other write waits on git."""

    def __init__(self, proofs: ProofQuery, repository: Repository, bus: Bus, git: WorktreeGit, environments: EnvironmentRows, settings: SettingValues, rows: EventRows,
                 results: CheckpointResults, deferrals: PhaseTestDeferrals, folders: CheckpointFolders, starts: WorkerRunStarts) -> None:
        self.results, self.deferrals, self.folders, self.starts = results, deferrals, folders, starts
        super().__init__(repository, bus)
        self.proofs, self.git = proofs, git
        self.environments, self.settings, self.rows = environments, settings, rows

    def notes(self, phases: tuple[Phase, ...]) -> tuple[str, ...]:
        return self.deferrals.notes(phases)

    def prepared(self, reach: CheckpointReach) -> CheckpointCheckout:
        if self.results.is_started(reach):
            return CheckpointCheckout(reach.id, is_started=True)
        owner_id = self.folders.owner_id(reach)
        proof_ids = tuple(proof.id for proof in self.proofs.committed_proofs(reach.tasks()).every_row(COMMITTED_PROOFS_REASON))
        tests = self.planned_tests(reach, owner_id)
        if not proof_ids and not tests:
            return CheckpointCheckout(reach.id)
        try:
            folder = self.folders.checkout(reach)
        except Refusal:
            if self.folders.link(reach) is None:
                raise
            return CheckpointCheckout(reach.id, unstarted_worker_id=owner_id)
        return CheckpointCheckout(reach.id, proof_ids=proof_ids, tests=self.with_changed_files(reach, tests, folder), folder=folder)

    def start(self, reach: CheckpointReach, preparation: CheckpointCheckout, context: Context) -> None:
        if preparation.is_started:
            return
        if preparation.unstarted_worker_id is not None:
            self.starts.unstarted(reach, preparation.unstarted_worker_id, context)
            return
        if not preparation.has_work:
            super().start(reach, preparation, context)
            return
        for test in preparation.tests:
            self.start_test(test, preparation.folder, context)
        for proof_id in preparation.proof_ids:
            proof = self.rows.required(Proof, proof_id)
            self.repository.save_change(proof, proof.moved(ProofLifecycle.queue), context)

    def folder(self, environment: Environment, plan_id: int) -> str:
        return self.git.base_folder(environment, FOLDER_NAME.format(plan=plan_id))

    # the checkpoint's own test and the selected run; the selected run's picker gets the changed files once the checkout is made
    def planned_tests(self, reach: CheckpointReach, owner_id: int | None) -> tuple[CheckpointTest, ...]:
        if owner_id is None or reach.source is CheckpointReachSource.EARLY:
            return ()
        tests = tuple(self.phase_test(reach, owner_id, command) for command in self.deferrals.run_commands(self.rows.required(Phase, reach.phase_id)))
        picker, selected_command = self.settings.text(AFFECTED_TESTS_COMMAND).strip(), self.settings.text(PROJECT_TEST_COMMAND).strip()
        if not (picker and selected_command and self.folders.compare_commit(reach)):
            return tests
        return (*tests, CheckpointTest(reach_id=reach.id, owner_agent_id=owner_id, picker_command=picker, test_command=selected_command, state=AffectedTestState.PICKING, process_id=0))

    def with_changed_files(self, reach: CheckpointReach, tests: tuple[CheckpointTest, ...], folder: str) -> tuple[CheckpointTest, ...]:
        if not any(test.state is AffectedTestState.PICKING for test in tests):
            return tests
        files = [change.relative for change in self.git.file_changes(folder, self.folders.compare_commit(reach))]
        return tuple(replace(test, picker_command=shlex.join([*shlex.split(test.picker_command), *files])) if test.state is AffectedTestState.PICKING else test for test in tests)

    # the checkpoint's own test runs once, as its command is written, never split into parts that each repeat its setup
    @staticmethod
    def phase_test(reach: CheckpointReach, owner_id: int, phase_command: str) -> CheckpointTest:
        return CheckpointTest(reach_id=reach.id, owner_agent_id=owner_id, picker_command="", test_command=phase_command, state=AffectedTestState.TESTING, process_id=0)

    def start_test(self, test: CheckpointTest, folder: str, context: Context) -> None:
        start = WorkerTestStart.started_as_full_run(test.owner_agent_id, test.picker_command or test.test_command, folder)
        process = self.bus.dispatch(replace(start, owner_agent_id=test.owner_agent_id), context)
        self.repository.save(replace(test, process_id=process.id), context)
