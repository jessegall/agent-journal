from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
import shlex
import stat

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.base.subcommand.output import Output
from suites.coding.modules.workers.commands.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.commands.worker_dispatch import WorkerDispatch


class DispatchWorkerSubcommand(Subcommand[DispatchWorker, WorkerDispatch]):
    """`journal worker dispatch <task> [--library-link <folder>] [--library-copy <folder>]`: a worker for the task."""

    cli_name = "worker"
    name = "dispatch"

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into the worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into the worktree")

    def command(self, arguments: Namespace, caller: Caller) -> DispatchWorker:
        return DispatchWorker(arguments.task_id, tuple(arguments.library_link), tuple(arguments.library_copy))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkerDispatch):
            return
        output.row(value.worker)
        if not self.launcher_runs():
            output.line(f"start the worker with: cd {shlex.quote(value.worktree.folder)} && {shlex.join(value.command)}")

    def launcher_runs(self) -> bool:
        path = self.home.socket(LAUNCHER_SOCKET)
        return path.exists() and stat.S_ISSOCK(path.stat().st_mode)
