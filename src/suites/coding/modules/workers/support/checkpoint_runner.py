from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.command_category import CommandCategory
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.phase import Phase
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from suites.coding.modules.workers.support.checkpoint_folders import FOLDER_NAME, CheckpointFolders
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.models.affected_test import AffectedTestState
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.phase_test_deferrals import PhaseTestDeferrals
from suites.coding.modules.workers.support.worker_settings import AFFECTED_TESTS_COMMAND, PROJECT_TEST_COMMAND, TEST_LIMIT_SECONDS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

class CheckpointRunner(CheckpointRuns):
    """Starts the tests of a reached checkpoint in the background runner proof tests use, in the checkout
    CheckpointFolders names, made whenever a proof or a test is to run: each committed proof of the window by its
    own command, the checkpoint's own test, with the test paths a merger deferred left out or added, and the
    selected run over the files the window changed. An early
    run starts only the committed proofs. A reach whose tests were started is not started again. With no owner
    the own test and the selected run are not run. A run with no test passes at once, as the core's runs do."""

    def __init__(self, proofs: ProofQuery, repository: Repository, bus: Bus, git: WorktreeGit, environments: EnvironmentRows, settings: SettingValues, rows: EventRows,
                 results: CheckpointResults, deferrals: PhaseTestDeferrals, folders: CheckpointFolders) -> None:
        self.results, self.deferrals, self.folders = results, deferrals, folders
        super().__init__(repository, bus)
        self.proofs, self.git = proofs, git
        self.environments, self.settings, self.rows = environments, settings, rows

    def notes(self, phases: tuple[Phase, ...]) -> tuple[str, ...]:
        return self.deferrals.notes(phases)

    def start(self, reach: CheckpointReach, context: Context) -> None:
        if self.results.is_started(reach):
            return
        committed = tuple(self.proofs.committed_proofs(reach.tasks()).oldest().all_rows())
        test_count = 0 if reach.source is CheckpointReachSource.EARLY else self.start_tests(reach, context)
        if committed and not test_count:
            self.folders.checkout(reach)
        for proof in committed:
            self.repository.save_change(proof, proof.moved(ProofLifecycle.queue), context)
        if not committed and not test_count:
            super().start(reach, context)

    def folder(self, environment: Environment, plan_id: int) -> str:
        return self.git.base_folder(environment, FOLDER_NAME.format(plan=plan_id))

    def start_tests(self, reach: CheckpointReach, context: Context) -> int:
        owner_id, compare_commit = self.folders.owner_id(reach), self.folders.compare_commit(reach)
        phase_commands = self.deferrals.run_commands(self.rows.required(Phase, reach.phase_id))
        picker, selected_command = self.settings.text(AFFECTED_TESTS_COMMAND).strip(), self.settings.text(PROJECT_TEST_COMMAND).strip()
        is_selected_run_due = bool(picker and selected_command and compare_commit)
        if owner_id is None or not (phase_commands or is_selected_run_due):
            return 0
        folder = self.folders.checkout(reach)
        tests = [CheckpointTest(reach_id=reach.id, owner_agent_id=owner_id, test_command=phase_command, state=AffectedTestState.TESTING, process_id=0) for phase_command in phase_commands]
        if is_selected_run_due:
            files = [change.relative for change in self.git.file_changes(folder, compare_commit)]
            tests.append(CheckpointTest(reach_id=reach.id, owner_agent_id=owner_id, picker_command=shlex.join([*shlex.split(picker), *files]), test_command=selected_command,
                                        state=AffectedTestState.PICKING, process_id=0))
        for test in tests:
            self.start_test(test, folder, context)
        return len(tests)

    def start_test(self, test: CheckpointTest, folder: str, context: Context) -> None:
        start = StartProcess.single_part(test.owner_agent_id, test.picker_command or test.test_command, folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=test.owner_agent_id), context)
        self.repository.save(replace(test, process_id=process.id), context)
