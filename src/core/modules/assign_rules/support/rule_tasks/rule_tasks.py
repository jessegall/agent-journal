from engine.query.conditions.is_null import IsNull
from engine.query.conditions.metadata_equal import MetadataEqual
from engine.query.queries import Queries
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.support.task_facts import TaskFacts
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

    def applied(self, rule: AssignRule, batch: DecisionBatch) -> tuple[RuleTask, ...]:
        free = self.tasks.free().oldest().take(MOST_LISTED_TASKS)
        listed = [RuleTask(task, facts, rule.target_name) for task, facts in zip(free, self.rules.keep_tasks(free))]
        return tuple(rule_task for rule_task in listed if self.is_first_rule(rule_task, rule, batch))

    def is_first_rule(self, rule_task: RuleTask, rule: AssignRule, batch: DecisionBatch) -> bool:
        first_rule = self.rules.choose_rule(rule_task.task, rule_task.facts, batch)
        return first_rule is not None and first_rule.id == rule.id

    def moved(self, rule: AssignRule, actor_id: int) -> tuple[RuleTask, ...]:
        return tuple(RuleTask(task, facts, rule.target_name) for task, facts in self.given(rule.id) if actor_id not in self.assignments.actors(task))

    def returned(self, rule_id: int) -> tuple[RuleTask, ...]:
        return tuple(RuleTask(task, facts, RETURNED_TARGET) for task, facts in self.given(rule_id))

    def given(self, rule_id: int) -> list[tuple[Task, TaskFacts]]:
        rule_task_ids = self.queries.query(Assignment).filter(subject_model=Task.model_name).matching(MetadataEqual(RULES_MODULE, RULE_KEY, rule_id)).select_columns("subject_id")
        given = self.tasks.unstarted().matching(IsNull("holder_id")).where_in("id", rule_task_ids).oldest().take(MOST_LISTED_TASKS)
        return list(zip(given, self.rules.keep_tasks(given)))
