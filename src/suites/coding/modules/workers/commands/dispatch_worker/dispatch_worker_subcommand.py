from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
import shlex
import stat

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.subcommand.output import Output
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch


class DispatchWorkerSubcommand(Subcommand[DispatchWorker, WorkerLaunch]):
    """`journal worker dispatch <task> [<task> ...] --model <model> [--profile <profile>] [--name <name>]
    [--library-link <folder>] [--library-copy <folder>]`: a worker for the tasks, which it takes one by one."""

    cli_name = "worker"
    name = "dispatch"

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_ids", type=int, nargs="+")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into the worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into the worktree")
        parser.add_argument("--program", default="", help="the agent program the worker runs; the dispatching agent's own when not named")
        parser.add_argument("--model", default="", help="the model the worker runs on, required: journal worker models lists them")
        parser.add_argument("--profile", default="", help="the profile its card is titled with")
        parser.add_argument("--fresh", action="store_true", help="start a worker though an ended worker changed the same files")
        parser.add_argument("--name", default="", help="the worker's name on its card")

    def command(self, arguments: Namespace, caller: Caller) -> DispatchWorker:
        return DispatchWorker(arguments.task_ids[0], tuple(arguments.library_link), tuple(arguments.library_copy), arguments.program, tuple(arguments.task_ids[1:]), arguments.model, arguments.profile, arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerLaunch):
            return
        output.row(value.worker)
        if not self.launcher_runs():
            variables = " ".join(f"{name}={shlex.quote(text)}" for name, text in value.command.variables.items())
            output.line(f"start the worker with: cd {shlex.quote(str(value.command.folder))} && {variables} {shlex.join(value.command.arguments)}")

    def launcher_runs(self) -> bool:
        path = self.home.socket(LAUNCHER_SOCKET)
        return path.exists() and stat.S_ISSOCK(path.stat().st_mode)
