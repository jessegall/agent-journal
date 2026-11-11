from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.answer_worker_ask.answer_worker_ask import AnswerWorkerAsk


class AnswerWorkerAskSubcommand(Subcommand[AnswerWorkerAsk, str]):
    """`journal merger answer <line> "<text>"`: the merger's words to the worker that asked."""

    cli_name = "merger"
    name = "answer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("line_id", type=int)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> AnswerWorkerAsk:
        if not arguments.text.strip():
            raise Refusal("an answer needs its words", 'journal merger answer <line> "<text>"')
        return AnswerWorkerAsk(arguments.line_id, arguments.text)
