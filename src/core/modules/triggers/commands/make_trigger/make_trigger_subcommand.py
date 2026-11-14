from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.triggers.commands.make_trigger.make_trigger import MakeTrigger
from core.modules.triggers.commands.support.show_trigger_line_subcommand import ShowTriggerLineSubcommand
from core.modules.triggers.commands.support.trigger_details import TriggerDetails
from core.modules.triggers.models.enums.trigger_action import TriggerAction


class MakeTriggerSubcommand(ShowTriggerLineSubcommand[MakeTrigger]):
    """Makes a phrase trigger that gives text, refuses a call or requires a skill."""

    cli_name = "trigger"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phrases")
        parser.add_argument("text", nargs="?", default="")
        parser.add_argument("--do", type=TriggerAction, choices=list(TriggerAction), default=TriggerAction.NUDGE)
        TriggerDetails.add_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> MakeTrigger:
        return MakeTrigger(tuple(phrase.strip() for phrase in arguments.phrases.split(",") if phrase.strip()), arguments.text, arguments.do, TriggerDetails.parsed(arguments))
