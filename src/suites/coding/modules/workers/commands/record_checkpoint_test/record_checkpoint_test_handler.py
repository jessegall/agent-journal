import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.commands.record_checkpoint_test.record_checkpoint_test import RecordCheckpointTest
from suites.coding.modules.workers.models.affected_test import AffectedTestState
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults
from suites.coding.modules.workers.support.worker_settings import TEST_LIMIT_SECONDS


class RecordCheckpointTestHandler(Handler[RecordCheckpointTest, None]):
    """Records the end of a test of a checkpoint run. A picker that passed starts the selected run over the
    tests it printed, in the folder the picker ran in; a picker that printed none has passed. The run of the
    checkpoint is then ended if this was its last test."""

    command = RecordCheckpointTest
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository, bus: Bus, output: OutputFolder, results: CheckpointResults) -> None:
        self.rows, self.repository, self.bus, self.output, self.results = rows, repository, bus, output, results

    def handle(self, command: RecordCheckpointTest, context: Context) -> None:
        test = self.rows.required(CheckpointTest, command.test_id)
        ended = self.picked(test, context) if command.passed else test.changed(state=AffectedTestState.FAILED)
        self.repository.save_change(test, ended, context)
        self.results.finish(self.rows.required(CheckpointReach, test.reach_id), context)

    def picked(self, test: CheckpointTest, context: Context) -> CheckpointTest:
        test_names = [line.strip() for line in self.output.all_output(test.process_id).splitlines() if line.strip()] if test.state is AffectedTestState.PICKING else []
        if not test_names:
            return test.changed(state=AffectedTestState.PASSED)
        folder = self.rows.required(Process, test.process_id).folder
        start = StartProcess.single_part(test.owner_agent_id, f"{test.test_command} {shlex.join(test_names)}", folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        process = self.bus.dispatch(replace(start, owner_agent_id=test.owner_agent_id), context)
        return test.changed(state=AffectedTestState.TESTING, process_id=process.id)
