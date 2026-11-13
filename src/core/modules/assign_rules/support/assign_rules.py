from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.row.metadata import Metadata
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.assign_rules_mode import AssignRulesMode
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assign_rules.support.targets.rule_targets import RuleTargets
from core.modules.assign_rules.support.targets.usable import Usable
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.enums.task_state import UNSTARTED_STATES
from core.modules.tasks.models.task import Task

RULES_REASON = "a task is judged against every enabled rule of its environment"
RULES_MODULE = "journal.core.assign_rules"


class AssignRules:
    """Judges a task against the enabled rules of its environment in position order and records the one
    decision about it. The first matching rule whose target can take the task gives it to that target, by the
    journal, with the rule named on the assignment; a rule whose target cannot, or whose assignment is refused,
    is skipped with the reason. A task is given by a rule once in its life, only while it is open or blocked and
    has no assignee. A task in a plan goes with its plan, unless a rule names the plan. While the mode does not
    assign, the winner is recorded as a dry run."""

    def __init__(self, queries: Queries, facts_reader: TaskFactsReader, repository: Repository, mode: AssignRulesMode, targets: RuleTargets,
                 conditions: RuleConditions, assignments: Assignments) -> None:
        self.queries, self.facts_reader, self.repository, self.mode, self.targets = queries, facts_reader, repository, mode, targets
        self.conditions, self.assignments = conditions, assignments

    def has_enabled_rules(self) -> bool:
        return self.queries.query(AssignRule).filter(enabled=True).exists()

    def decide(self, task: Task, batch: DecisionBatch, context: Context) -> AssignDecision:
        stored = self.queries.query(AssignDecision).filter(task_id=task.id).first()
        if stored is not None and stored.outcome is DecisionOutcome.ASSIGNED:
            return stored
        if self.assignments.actor(task) is not None:
            return self.record(task, stored, DecisionOutcome.HAS_ASSIGNEE, None, None, "the task has an assignee", context)
        if task.state not in UNSTARTED_STATES:
            return self.record(task, stored, DecisionOutcome.SKIPPED, None, None, f"the task is {task.state}", context)
        facts = self.facts_reader.read(task)
        rules = self.matching_rules(facts)
        if not rules and facts.plan_id is not None:
            return self.record(task, stored, DecisionOutcome.PLANNED, None, None, f"in plan {facts.plan_id}: assign the plan", context)
        skipped_rules: list[AssignRule] = []
        skipped: list[str] = []
        for place, rule in enumerate(rules):
            usable = self.targets.usable(rule, batch)
            refusal = usable.reason if usable.actor_id is None else self.assignment_refusal(task, rule, usable.actor_id, context)
            if refusal is not None:
                skipped_rules.append(rule)
                skipped.append(f"rule {rule.id} skipped: {refusal}")
                continue
            batch.give(usable.actor_id)
            return self.matched(task, stored, rule, usable, skipped, rules[place + 1:], context)
        if skipped_rules:
            return self.record(task, stored, DecisionOutcome.SKIPPED, skipped_rules[0], None, "; ".join(skipped), context)
        return self.record(task, stored, DecisionOutcome.UNMATCHED, None, None, "no rule matches", context)

    def assignment_refusal(self, task: Task, rule: AssignRule, actor_id: int, context: Context) -> str | None:
        if not self.mode.assigns():
            return None
        try:
            self.assignments.assign(task, actor_id, context, cascade=False)
        except Refusal as refusal:
            return refusal.reason
        given = next(assignment for assignment in self.assignments.assignments(task) if assignment.actor_id == actor_id)
        self.repository.save_metadata(given, Metadata({**given.metadata.values, RULES_MODULE: {"rule": rule.id}}), context)
        return None

    def matched(self, task: Task, stored: AssignDecision | None, rule: AssignRule, usable: Usable, skipped: list[str], later: list[AssignRule],
                context: Context) -> AssignDecision:
        note = f" ({usable.reason})" if usable.reason else ""
        also = [f"also matched: {', '.join(f'rule {other.id}' for other in later)}"] if later else []
        if not self.mode.assigns():
            return self.record(task, stored, DecisionOutcome.DRY_RUN, rule, usable.actor_id, "; ".join([*skipped, f"rule {rule.id} matches, target {rule.target_name}{note}", *also]), context)
        return self.record(task, stored, DecisionOutcome.ASSIGNED, rule, usable.actor_id, "; ".join([*skipped, f"rule {rule.id} applied: given to {rule.target_name}{note}", *also]), context)

    def matching_rules(self, facts: TaskFacts) -> list[AssignRule]:
        rules = sorted(self.queries.query(AssignRule).filter(enabled=True).every_row(RULES_REASON), key=lambda rule: rule.position)
        lines = self.conditions.lines_by_rule(rules)
        return [rule for rule in rules if all(line.matches(facts) for line in lines[rule.id]) and (facts.plan_id is None or any(line.names_plan for line in lines[rule.id]))]

    def record(self, task: Task, stored: AssignDecision | None, outcome: DecisionOutcome, rule: AssignRule | None, actor_id: int | None, reason: str,
               context: Context) -> AssignDecision:
        rule_id = None if rule is None else rule.id
        if stored is None:
            return self.repository.save(AssignDecision(task_id=task.id, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason), context)
        if (stored.rule_id, stored.outcome, stored.actor_id, stored.reason) == (rule_id, outcome, actor_id, reason):
            return stored
        return self.repository.update(stored, context, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason)
