from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.record_todo_list_rule import RecordTodoListRule


class RecordTodoListEffect(RuleEffect):
    """The effect of RecordTodoListRule, as today's rule runs it."""

    rule = RecordTodoListRule
