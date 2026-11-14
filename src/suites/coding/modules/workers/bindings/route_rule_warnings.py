from collections.abc import Sequence

from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.support.condition_line import ConditionLine
from core.modules.assign_rules.support.rule_warnings import RuleWarnings
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes

COMPLEXITY_OPERATORS = (ConditionOperator.EQUALS, ConditionOperator.MINIMUM)


class RouteRuleWarnings(RuleWarnings):
    """Names the first route a rule's tasks match, by the tags and the complexity its conditions ask for, when
    that route sends them to another program than the rule's target runs on: the route wins over the rule."""

    def __init__(self, routes: WorkerRoutes) -> None:
        self.routes = routes

    def warning(self, program: str, lines: Sequence[ConditionLine]) -> str:
        tags = [line.value for line in lines if line.field is ConditionField.TAG and line.operator is ConditionOperator.HAS]
        complexity = next((TaskComplexity(int(line.value)) for line in lines if line.field is ConditionField.COMPLEXITY and line.operator in COMPLEXITY_OPERATORS), None)
        route = next((route for route in self.routes.listed() if route.matches(tags, complexity)), None)
        if route is None or not route.program or route.program == program:
            return ""
        return f"route {route.id} sends these tasks to {route.program}"
