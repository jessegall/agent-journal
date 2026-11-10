from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.tasks.models.task import Task


class AssignRules:
    """Judges a task against the enabled rules of its environment in position order and records the one decision
    about it; the first rule whose conditions all hold is recorded as a dry run, and nothing is assigned yet."""

    def __init__(self, queries: Queries, facts_reader: TaskFactsReader, repository: Repository) -> None:
        self.queries, self.facts_reader, self.repository = queries, facts_reader, repository

    def decide(self, task: Task, context: Context) -> AssignDecision:
        rule = self.first_match(task)
        if rule is None:
            return self.record(task, DecisionOutcome.UNMATCHED, None, "no rule matches", context)
        return self.record(task, DecisionOutcome.DRY_RUN, rule, f"rule {rule.id} matches, target {rule.target}", context)

    def first_match(self, task: Task) -> AssignRule | None:
        facts = self.facts_reader.read(task)
        conditions: dict[int, list[AssignRuleCondition]] = {}
        for condition in self.queries.query(AssignRuleCondition).all_rows():
            conditions.setdefault(condition.rule_id, []).append(condition)
        rules = self.queries.query(AssignRule).filter(enabled=True).ordered("position").all_rows()
        return next((rule for rule in rules if self.meets_all(conditions.get(rule.id, []), facts)), None)

    @staticmethod
    def meets_all(conditions: list[AssignRuleCondition], facts: TaskFacts) -> bool:
        return all(condition.matches(facts) for condition in conditions)

    def record(self, task: Task, outcome: DecisionOutcome, rule: AssignRule | None, reason: str, context: Context) -> AssignDecision:
        rule_id = None if rule is None else rule.id
        actor_id = None if rule is None else rule.agent_id
        stored = self.queries.query(AssignDecision).filter(task_id=task.id).first()
        if stored is None:
            return self.repository.save(AssignDecision(task_id=task.id, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason), context)
        return self.repository.update(stored, context, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason)
