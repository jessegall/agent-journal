import shlex
from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.run_worker_test.run_worker_test import RunWorkerTest
from suites.coding.modules.workers.support.worker_test_run import WorkerTestRun
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_test_arguments import WorkerTestArguments
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.modules.workers.support.worktree_libraries import WorktreeLibraries
from suites.coding.modules.workers.support.worker_settings import TEST_LIMIT_SECONDS


class RunWorkerTestHandler(Handler[RunWorkerTest, WorkerTestRun]):
    """Starts a worker's named test command as a queued test run in its worktree."""

    command = RunWorkerTest
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, names: WorkerTestNames, bus: Bus, libraries: WorktreeLibraries) -> None:
        self.worktrees, self.names, self.bus, self.libraries = worktrees, names, bus, libraries

    def handle(self, command: RunWorkerTest, context: Context) -> WorkerTestRun:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            raise Refusal("only a worker with a worktree out runs a named test", "journal worker dispatch gives a worker its test commands")
        missing = self.libraries.missing(worktree)
        if missing:
            raise Refusal(f"{', '.join(missing)} is missing from your worktree", AskTopic.TOOL.hint("the merger can relink it"))
        test_arguments = tuple(command.test_arguments)
        line = self.names.line(worktree.session_agent_id, command.name, test_arguments)
        WorkerTestArguments.check(test_arguments, shlex.split(line))
        start = StartProcess.single_part(worktree.session_agent_id, line, worktree.folder, CommandCategory.TEST_RUN, TEST_LIMIT_SECONDS)
        return WorkerTestRun(self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=worktree.task_id), context), command.piped)
