from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.assign_rules_mode import AssignRulesMode
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assign_rules.support.targets.rule_targets import RuleTargets
from core.modules.assign_rules.support.targets.usable import Usable
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.tasks.models.task import Task


CONDITIONS_REASON = "a task is judged against every condition of the enabled rules"
RULES_REASON = "a task is judged against every enabled rule of its environment"


class AssignRules:
    """Judges a task against the enabled rules of its environment in position order and records the one
    decision about it: the first matching rule whose target can take the task wins, and a rule whose target
    cannot is skipped with the reason. While the mode does not assign, the winner is recorded as a dry run; a task
    every matching rule skipped names the first of them."""

    def __init__(self, queries: Queries, facts_reader: TaskFactsReader, repository: Repository, mode: AssignRulesMode, targets: RuleTargets) -> None:
        self.queries, self.facts_reader, self.repository, self.mode, self.targets = queries, facts_reader, repository, mode, targets

    def decide(self, task: Task, batch: DecisionBatch, context: Context) -> AssignDecision:
        skipped_rules: list[AssignRule] = []
        skipped: list[str] = []
        for rule in self.matching_rules(task):
            usable = self.targets.usable(rule, batch)
            if usable.actor_id is None:
                skipped_rules.append(rule)
                skipped.append(f"rule {rule.id} skipped: {usable.reason}")
                continue
            batch.give(usable.actor_id)
            return self.matched(task, rule, usable, skipped, context)
        if skipped_rules:
            return self.record(task, DecisionOutcome.SKIPPED, skipped_rules[0], None, "; ".join(skipped), context)
        return self.record(task, DecisionOutcome.UNMATCHED, None, None, "no rule matches", context)

    def matched(self, task: Task, rule: AssignRule, usable: Usable, skipped: list[str], context: Context) -> AssignDecision:
        note = f" ({usable.reason})" if usable.reason else ""
        reason = "; ".join([*skipped, f"rule {rule.id} matches, target {rule.target_name}{note}"])
        if not self.mode.assigns():
            return self.record(task, DecisionOutcome.DRY_RUN, rule, usable.actor_id, reason, context)
        return self.record(task, DecisionOutcome.FAILED, rule, usable.actor_id, f"{reason}; assigning by rule is not built yet", context)

    def matching_rules(self, task: Task) -> list[AssignRule]:
        facts = self.facts_reader.read(task)
        conditions: dict[int, list[AssignRuleCondition]] = {}
        for condition in self.queries.query(AssignRuleCondition).every_row(CONDITIONS_REASON):
            conditions.setdefault(condition.rule_id, []).append(condition)
        rules = sorted(self.queries.query(AssignRule).filter(enabled=True).every_row(RULES_REASON), key=lambda rule: rule.position)
        return [rule for rule in rules if self.meets_all(conditions.get(rule.id, []), facts)]

    @staticmethod
    def meets_all(conditions: list[AssignRuleCondition], facts: TaskFacts) -> bool:
        return all(condition.matches(facts) for condition in conditions)

    def record(self, task: Task, outcome: DecisionOutcome, rule: AssignRule | None, actor_id: int | None, reason: str, context: Context) -> AssignDecision:
        rule_id = None if rule is None else rule.id
        stored = self.queries.query(AssignDecision).filter(task_id=task.id).first()
        if stored is None:
            return self.repository.save(AssignDecision(task_id=task.id, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason), context)
        return self.repository.update(stored, context, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason)
