from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.models.assign_decision import AssignDecision


class RecordAssignDecisionSubcommand(Subcommand[RecordAssignDecision, tuple[AssignDecision, ...]]):
    """`journal assign-decision record <task> [<task> ...]`: judges waiting tasks against the rules by hand,
    in one step, and records a decision for each."""

    cli_name = "assign-decision"
    name = "record"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_ids", type=int, nargs="+")

    def command(self, arguments: Namespace, caller: Caller) -> RecordAssignDecision:
        return RecordAssignDecision(tuple(arguments.task_ids))

    def write_output(self, value: object, output: Output) -> None:
        for decision in value if isinstance(value, tuple) else ():
            output.row(decision)
