from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.deliver_task.deliver_task import DeliverTask
from suites.coding.modules.workers.support.delivery_differences import differences_flag, required_differences


class DeliverTaskSubcommand(Subcommand[Command[object], Task]):
    """`journal worker deliver`: hands in all the worker's tasks, once none is queued and its last has a proof for
    every point of its brief."""

    cli_name = "worker"
    name = "deliver"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        differences_flag(parser)

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, phases: WorkerPhases, requests: WorkerCommandRequest, guidance: WorkerGuidance, run_answer: WorkerRunAnswer) -> None:
        self.guidance, self.run_answer = guidance, run_answer
        self.requests = requests
        self.worktrees, self.step_check, self.phases = worktrees, step_check, phases

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        differences = required_differences(arguments)
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, "fix each of these in your worktree, then run journal worker deliver again")
        return self.requests.command(DeliverTask(differences), caller.actor.id,
                                     ["worker", "deliver", "--differences", differences], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if not isinstance(value, Task):
            return
        if value.state is TaskState.TESTING and self.phases.is_grouped(value):
            output.line(self.guidance.task_line(value))
            return
        output.row(value)
