from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.resume_run_queue.resume_run_queue import ResumeRunQueue


class ResumeRunQueueSubcommand(Subcommand[ResumeRunQueue, str]):
    """`journal queue resume`: the halted queue of test runs gives the waiting runs their spots again, oldest
    first."""

    cli_name = "queue"
    name = "resume"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> ResumeRunQueue:
        return ResumeRunQueue()
