from argparse import ArgumentParser, Namespace

from engine.cli.agent_number import AgentNumber
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.support.condition_line import ConditionLine

REVISION_HELP = "the revision of the rules the change was made from; a change from an older one is refused"
CONDITION_HELP = "a condition as <field> <operator> <value>, such as 'complexity minimum 4' or 'any'; repeat it for more"


class RuleArguments:
    """The flags of a rule shared by make and edit: its target and its conditions."""

    @staticmethod
    def add(parser: ArgumentParser, target_required: bool) -> None:
        parser.add_argument("--target", type=RuleTarget, choices=tuple(RuleTarget), required=target_required)
        parser.add_argument("--agent", dest="agent_id", type=AgentNumber)
        parser.add_argument("--program")
        parser.add_argument("--model", dest="program_model")
        parser.add_argument("--queue-limit", type=int, help="the most open tasks the target may hold for the rule to give it one; 0 holds no limit")
        RuleArguments.add_revision(parser)
        parser.add_argument("--condition", dest="conditions", action="append", help=CONDITION_HELP)

    @staticmethod
    def add_revision(parser: ArgumentParser) -> None:
        parser.add_argument("--revision", default="", help=REVISION_HELP)

    @staticmethod
    def conditions(arguments: Namespace) -> tuple[ConditionLine, ...]:
        return tuple(ConditionLine.parsed(line) for line in arguments.conditions or ())
