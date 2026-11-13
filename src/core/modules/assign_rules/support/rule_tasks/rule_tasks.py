from engine.query.conditions.is_null import IsNull
from engine.query.conditions.metadata_equal import MetadataEqual
from engine.query.queries import Queries
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.rule_mark import RULE_KEY, RULES_MODULE
from core.modules.assign_rules.support.rule_tasks.rule_task import RuleTask
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

MOST_LISTED_TASKS = 100
RETURNED_TARGET = "given back, free"


class RuleTasks:
    """Finds the tasks a person's change to a rule reaches, at most a hundred, oldest first: the free tasks the
    rule would give now, and the unstarted tasks it gave that nobody holds, read from the rule named on their
    assignment, so a deleted rule's tasks are found too."""

    def __init__(self, queries: Queries, tasks: TaskQuery, rules: AssignRules, assignments: Assignments) -> None:
        self.queries, self.tasks, self.rules, self.assignments = queries, tasks, rules, assignments

    def applied(self, rule: AssignRule) -> tuple[RuleTask, ...]:
        batch = DecisionBatch()
        listed: list[RuleTask] = []
        for task in self.tasks.free().oldest().take(MOST_LISTED_TASKS):
            first_rule = self.rules.choose_rule(task, batch)
            if first_rule is not None and first_rule.id == rule.id:
                listed.append(RuleTask(task, rule.target_name))
        return tuple(listed)

    def moved(self, rule: AssignRule, actor_id: int) -> tuple[RuleTask, ...]:
        return tuple(RuleTask(task, rule.target_name) for task in self.given(rule.id) if actor_id not in self.assignments.actors(task))

    def returned(self, rule_id: int) -> tuple[RuleTask, ...]:
        return tuple(RuleTask(task, RETURNED_TARGET) for task in self.given(rule_id))

    def given(self, rule_id: int) -> list[Task]:
        rule_task_ids = self.queries.query(Assignment).filter(subject_model=Task.model_name).matching(MetadataEqual(RULES_MODULE, RULE_KEY, rule_id)).select_columns("subject_id")
        return self.tasks.unstarted().matching(IsNull("holder_id")).where_in("id", rule_task_ids).oldest().take(MOST_LISTED_TASKS)
