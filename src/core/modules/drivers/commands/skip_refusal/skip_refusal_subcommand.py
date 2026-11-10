from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.errors.skip_refusal import SkipRefusal
from core.modules.drivers.models.refusal_skip import RefusalSkip


class SkipRefusalSubcommand(Subcommand[SkipRefusal, RefusalSkip]):
    """`journal refusal skip <rule> --reason <why>`: asks to pass the refusal of a rule that just refused you, once;
    the skip is held until you confirm it with what you tried instead, or withdraw it."""

    cli_name = "refusal"
    name = "skip"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule")
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SkipRefusal:
        return SkipRefusal(arguments.rule, arguments.reason)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RefusalSkip):
            output.write(f"skip {value.id} of {value.name} held, {value.streak} in a row. Is there no other way? Do what the refusal asks "
                         f"and withdraw it (journal refusal withdraw {value.id}), or confirm it is wrong here and name what you tried instead "
                         f"(journal refusal confirm {value.id} --tried '<what you tried>')", {"id": value.id, "name": value.name, "streak": value.streak})
