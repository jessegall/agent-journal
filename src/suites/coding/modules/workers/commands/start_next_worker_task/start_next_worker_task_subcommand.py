from engine.command.command import Command
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from suites.coding.modules.workers.support.worker_run_answer import WorkerRunAnswer
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.support.delivery_differences import differences_flag, required_differences
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck


class StartNextWorkerTaskSubcommand(Subcommand[Command[object], Task]):
    """`journal worker next`: the worker's task is done, with a proof for every point of its brief. Inside
    a phase or batch it goes straight on to its next task; at the end the plugins judge all its tasks
    together, and once their tests pass, or at once with none, the next task in its queue starts."""

    cli_name = "worker"
    name = "next"
    outward = True

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, phases: WorkerPhases, requests: WorkerCommandRequest, next_task: WorkerNextTask, guidance: WorkerGuidance, run_answer: WorkerRunAnswer) -> None:
        self.run_answer = run_answer
        self.guidance = guidance
        self.requests, self.next_task = requests, next_task
        self.worktrees, self.step_check, self.phases = worktrees, step_check, phases

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        differences_flag(parser)

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        differences = required_differences(arguments)
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None and not self.phases.continues_with(worktree, self.next_task.following(caller.actor.id)):
            self.step_check.check(worktree, DELIVERY_EVENTS, "fix each of these in your worktree, then run journal worker next again")
        return self.requests.command(StartNextWorkerTask(differences), caller.actor.id,
                                     ["worker", "next", "--differences", differences], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if self.run_answer.write(value, output):
            return
        if isinstance(value, Task) and value.state is TaskState.STARTED:
            output.line(f"your next task, task {value.id}: {value.title}\n{value.brief}\n{self.guidance.task_line(value)}")
        elif isinstance(value, Task):
            output.line(self.guidance.task_line(value))
