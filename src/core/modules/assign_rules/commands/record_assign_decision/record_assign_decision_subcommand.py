from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.models.assign_decision import AssignDecision


class RecordAssignDecisionSubcommand(Subcommand[RecordAssignDecision, AssignDecision]):
    """`journal assign-decision record <task>`: judges one waiting task against the rules by hand and records the decision."""

    cli_name = "assign-decision"
    name = "record"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RecordAssignDecision:
        return RecordAssignDecision(arguments.task_id)
