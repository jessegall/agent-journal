from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs import ReadWorkerLogs


class ReadWorkerLogsSubcommand(Subcommand[ReadWorkerLogs, str]):
    cli_name = "worker"
    name = "logs"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("--task", type=int, help="print this task's lines whole")

    def command(self, arguments: Namespace, caller: Caller) -> ReadWorkerLogs:
        return ReadWorkerLogs(arguments.worker_id, arguments.task, caller.process_id, arguments.json)

