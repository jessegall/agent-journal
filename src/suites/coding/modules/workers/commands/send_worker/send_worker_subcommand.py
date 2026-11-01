from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker


class SendWorkerSubcommand(Subcommand[SendWorker, AgentLine]):
    """`journal worker send <n> "<job>"`: a worker that reported takes its next job, with its memory of the last."""

    cli_name = "worker"
    name = "send"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("job")

    def command(self, arguments: Namespace, caller: Caller) -> SendWorker:
        return SendWorker(arguments.worker_id, arguments.job)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentLine):
            output.line(f"worker {value.agent_id} takes the job")
