from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.assign_rules.commands.move_assign_rule.move_assign_rule import MoveAssignRule
from core.modules.assign_rules.models.assign_rule import ENVIRONMENT_COLUMN, AssignRule
from core.modules.plans.support.positions import Positions


class MoveAssignRuleHandler(Handler[MoveAssignRule, AssignRule]):
    """Moves a rule to a place in its environment's order; the rules between move by one, without gaps."""

    command = MoveAssignRule

    def __init__(self, rows: EventRows, positions: Positions) -> None:
        self.rows, self.positions = rows, positions

    def handle(self, command: MoveAssignRule, context: Context) -> AssignRule:
        rule = self.rows.required(AssignRule, command.rule_id)
        return self.positions.move(rule, ENVIRONMENT_COLUMN, rule.environment_id, command.position, context)
