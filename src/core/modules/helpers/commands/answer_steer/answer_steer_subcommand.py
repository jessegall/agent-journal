from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.answer_steer.answer_steer import AnswerSteer
from core.modules.helpers.models.helper_steer import HelperSteer


class AnswerSteerSubcommand(Subcommand[AnswerSteer, HelperSteer]):
    """`journal helper answer-steer <steer> "<what you change in your work>"`."""

    cli_name = "helper"
    name = "answer-steer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("steer_id", type=int)
        parser.add_argument("answer")

    def command(self, arguments: Namespace, caller: Caller) -> AnswerSteer:
        return AnswerSteer(arguments.steer_id, arguments.answer)
