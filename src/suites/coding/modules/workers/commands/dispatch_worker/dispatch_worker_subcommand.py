from argparse import ArgumentParser, Namespace

from core.base.profile.model_tier import ModelTier

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
import shlex
import stat

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.support.test_command_entry import TEST_COMMAND_EXAMPLE, TestCommandEntry
from suites.coding.modules.workers.support.plan_worker_tasks import PlanWorkerTasks
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch


class DispatchWorkerSubcommand(Subcommand[DispatchWorker, WorkerLaunch]):
    """`journal worker dispatch (<task> [<task> ...] | --plan <plan> [--phase <phase>]) [--model <model> |
    --tier <tier>] [--profile <profile>] [--name <name>] [--no-sandbox] [--library-link <folder>]
    [--library-copy <folder>]`: a worker for the tasks, or for the open tasks of a plan or of one of its
    phases, which it takes one by one."""

    cli_name = "worker"
    name = "dispatch"
    outward = True
    background = True

    def __init__(self, home: JournalHome, plan_tasks: PlanWorkerTasks) -> None:
        self.home, self.plan_tasks = home, plan_tasks

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_ids", type=int, nargs="*")
        parser.add_argument("--plan", type=int, default=None, help="hand the worker the open tasks of this plan, in its order, instead of listed tasks")
        parser.add_argument("--phase", type=int, default=None, help="with --plan, only the tasks of this phase")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into the worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into the worktree")
        parser.add_argument("--program", default="", help="the agent program the worker runs; the dispatching agent's own when not commands")
        parser.add_argument("--tier", type=ModelTier.automatic, choices=[ModelTier.FAST, ModelTier.GENERAL, ModelTier.STRONGEST], default=None)
        parser.add_argument("--model", default="", help="the model the worker runs on, else the profile's: journal worker models lists them")
        parser.add_argument("--profile", default="", help="the worker profile it starts from, else journal-worker")
        parser.add_argument("--fresh", default="", metavar="REASON", help="start a new worker though a stopped one could take the task, and why")
        parser.add_argument("--name", default="", help="the worker's name on its card")
        parser.add_argument("--no-program", action="store_true", help="a person only: cut the worktree and start no program")
        parser.add_argument("--session", default="", help="with --no-program, the session whose hooks are the worker's")
        parser.add_argument("--no-sandbox", action="store_true", help="the worker runs its shell lines outside the sandbox")
        parser.add_argument("--test-command", action="append", default=[], metavar="NAME=COMMAND", help="a test command the worker may run as journal worker test <name>; an agent gives at least one")

    def command(self, arguments: Namespace, caller: Caller) -> DispatchWorker:
        if arguments.session and not arguments.no_program:
            raise Refusal("--session is the session of a program that is not started", "add --no-program")
        task_ids = self.picked(arguments)
        commands = TestCommandEntry.parsed(arguments.test_command)
        if not commands and caller.actor.type is ActorType.AGENT:
            raise Refusal("a worker gets the test commands it may run", TEST_COMMAND_EXAMPLE)
        return DispatchWorker(task_ids[0], tuple(arguments.library_link), tuple(arguments.library_copy), arguments.program, task_ids[1:], arguments.model, arguments.profile, arguments.name, arguments.fresh, arguments.tier, arguments.plan, arguments.phase, session=arguments.session, starts_program=not arguments.no_program, sandboxed=not arguments.no_sandbox, test_commands=commands)

    def picked(self, arguments: Namespace) -> tuple[int, ...]:
        if arguments.plan is None:
            if arguments.phase is not None:
                raise Refusal("--phase needs --plan", "add --plan <plan>")
            if not arguments.task_ids:
                raise Refusal("a worker is dispatched to tasks or to a plan", "list the tasks, or add --plan <plan>")
            return tuple(arguments.task_ids)
        if arguments.task_ids:
            raise Refusal("a dispatch takes tasks or a plan, not both", "drop the task numbers or drop --plan")
        return self.plan_tasks.task_ids(arguments.plan, arguments.phase)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerLaunch):
            return
        output.row(value.worker)
        if value.worktree.starts_program and not self.launcher_runs():
            variables = " ".join(f"{name}={shlex.quote(text)}" for name, text in value.command.variables.items())
            output.line(f"start the worker with: cd {shlex.quote(str(value.command.folder))} && {variables} {shlex.join(value.command.arguments)}")

    def launcher_runs(self) -> bool:
        path = self.home.socket(LAUNCHER_SOCKET)
        return path.exists() and stat.S_ISSOCK(path.stat().st_mode)
