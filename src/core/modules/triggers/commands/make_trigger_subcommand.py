from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.triggers.commands.make_trigger import MakeTrigger
from core.modules.triggers.commands.support.trigger_line_subcommand import TriggerLineSubcommand
from core.modules.triggers.models.enums.trigger_action import TriggerAction


class MakeTriggerSubcommand(TriggerLineSubcommand[MakeTrigger]):
    """`journal trigger make "deploy, release" "<text>" [--do nudge|instruct|deny]`."""

    cli_name = "trigger"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phrases")
        parser.add_argument("text")
        parser.add_argument("--do", type=TriggerAction, choices=list(TriggerAction), default=TriggerAction.NUDGE)

    def command(self, arguments: Namespace, caller: Caller) -> MakeTrigger:
        return MakeTrigger(tuple(phrase.strip() for phrase in arguments.phrases.split(",") if phrase.strip()), arguments.text, arguments.do)
