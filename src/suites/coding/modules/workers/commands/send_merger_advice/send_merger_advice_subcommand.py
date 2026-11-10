from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.send_merger_advice.send_merger_advice import SendMergerAdvice


class SendMergerAdviceSubcommand(Subcommand[SendMergerAdvice, str]):
    """`journal merger advise <worker> "<text>"`: the merger's one way to talk to a worker."""

    cli_name = "merger"
    name = "advise"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> SendMergerAdvice:
        if not arguments.text.strip():
            raise Refusal("the advice has no words", "say what the worker should do")
        return SendMergerAdvice(arguments.worker_id, arguments.text)
