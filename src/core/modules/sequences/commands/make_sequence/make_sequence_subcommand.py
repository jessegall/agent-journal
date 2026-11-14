from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.sequences.commands.make_sequence.make_sequence import MakeSequence
from core.modules.sequences.models.sequence import Sequence


class MakeSequenceSubcommand(Subcommand[MakeSequence, Sequence]):
    """`journal sequence make <title> --steps "first | second"`."""

    cli_name = "sequence"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--steps", default="")
        parser.add_argument("--triggers", default="[]")
        parser.add_argument("--step-guards", default="[]")

    def command(self, arguments: Namespace, caller: Caller) -> MakeSequence:
        return MakeSequence(arguments.title, tuple(step.strip() for step in arguments.steps.split("|") if step.strip()), arguments.triggers, arguments.step_guards)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Sequence):
            output.line(f"sequence {value.id}: {value.title}, {len(value.steps)} steps")
