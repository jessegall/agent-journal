from collections.abc import Sequence
from typing import TypeGuard

from engine.command.context import Context
from engine.database.kept_rows import KeptRows
from engine.driver.nudger import Nudger
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.query.query import Query
from engine.repository.repository import Repository
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome
from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.assign_rules.support.assign_rules_mode import AssignRulesMode
from core.modules.assign_rules.support.assign_rules_nudges import RULE_NUDGE_SOURCE, RULE_TASK_NUDGE
from core.modules.assign_rules.support.decision_note import DecisionNote
from core.modules.assign_rules.support.enabled_rules import EnabledRules
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_mark import RuleMark
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assign_rules.support.targets.rule_targets import RuleTargets
from core.modules.assign_rules.support.targets.usable import Usable
from core.modules.assign_rules.support.task_facts_reader import TaskFactsReader
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.enums.task_state import UNSTARTED_STATES
from core.modules.tasks.models.task import Task

RULES_REASON = "a task is judged against every enabled rule of its environment"
DECISIONS_REASON = "the decisions about the tasks judged together are read in one query"


class AssignRules:
    """Judges a task against the enabled rules of its environment in position order and records the one decision
    about it. The first matching rule whose target can take the task gives it to that target, by the journal,
    with the rule named on the assignment; a rule whose target cannot, or whose assignment is refused, is
    skipped with the reason. A task is given by a rule once in its life, only while it is open or blocked and
    has no assignee. A task in a plan goes with its plan, unless a rule names the plan. A main agent given a
    task hears so. While the mode does not assign, the winner is recorded as a dry run."""

    def __init__(self, queries: Queries, facts_reader: TaskFactsReader, repository: Repository, mode: AssignRulesMode, targets: RuleTargets,
                 conditions: RuleConditions, assignments: Assignments, nudger: Nudger, kept: KeptRows) -> None:
        self.queries, self.facts_reader, self.repository, self.mode, self.targets = queries, facts_reader, repository, mode, targets
        self.conditions, self.assignments, self.nudger, self.kept = conditions, assignments, nudger, kept

    def has_enabled_rules(self) -> bool:
        return self.queries.query(AssignRule).filter(enabled=True).exists()

    def stored_decision(self, task: Task) -> AssignDecision | None:
        decision = self.queries.query(AssignDecision).filter(task_id=task.id)
        return self.kept.read(decision, decision.first, name="assign_rules.stored_decision")

    def keep_tasks(self, tasks: Sequence[Task]) -> list[TaskFacts]:
        task_ids = [task.id for task in tasks]
        self.assignments.keep_rows(Task, task_ids)
        loaded = tuple(self.queries.query(AssignDecision).where_in("task_id", task_ids).every_row(DECISIONS_REASON))
        for task in tasks:
            decision = self.queries.query(AssignDecision).filter(task_id=task.id)
            self.kept.read(decision, lambda task=task: next((row for row in loaded if row.task_id == task.id), None), name="assign_rules.stored_decision")
        return self.facts_reader.read_many(tasks)

    def decide(self, task: Task, batch: DecisionBatch, context: Context) -> AssignDecision:
        return self.decide_many([task], batch, context)[0]

    def decide_many(self, tasks: Sequence[Task], batch: DecisionBatch, context: Context) -> list[AssignDecision]:
        return [self.judged(task, facts, batch, context) for task, facts in zip(tasks, self.keep_tasks(tasks))]

    def judged(self, task: Task, facts: TaskFacts, batch: DecisionBatch, context: Context) -> AssignDecision:
        stored = self.stored_decision(task)
        if self.is_given(stored):
            return stored
        unfree = self.unfree(task)
        if unfree is not None:
            return self.record(task, stored, unfree.outcome, None, None, unfree.reason, context)
        rules = self.matching_rules(facts)
        if not rules and facts.plan_id is not None:
            return self.record(task, stored, DecisionOutcome.PLANNED, None, None, self.planned_reason(facts), context)
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

    def preview(self, task: Task, stored: AssignDecision | None) -> str:
        if self.is_given(stored):
            return "a rule gave the task already, and a rule gives a task once"
        unfree = self.unfree(task)
        if unfree is not None:
            return unfree.reason
        facts = self.facts_reader.read(task)
        rules = self.matching_rules(facts)
        if not rules:
            return "no rule matches" if facts.plan_id is None else self.planned_reason(facts)
        skipped: list[str] = []
        for rule in rules:
            usable = self.targets.usable(rule, DecisionBatch())
            if usable.actor_id is not None:
                return "; ".join([*skipped, f"rule {rule.id} would give it to {rule.target_name}"])
            skipped.append(f"rule {rule.id} would be skipped: {usable.reason}")
        return "; ".join(skipped)

    def unfree(self, task: Task) -> DecisionNote | None:
        if self.assignments.actor(task) is not None:
            return DecisionNote(DecisionOutcome.HAS_ASSIGNEE, "the task has an assignee")
        if task.state not in UNSTARTED_STATES:
            return DecisionNote(DecisionOutcome.SKIPPED, f"the task is {task.state}")
        return None

    @staticmethod
    def is_given(stored: AssignDecision | None) -> TypeGuard[AssignDecision]:
        return stored is not None and stored.outcome is DecisionOutcome.ASSIGNED

    @staticmethod
    def planned_reason(facts: TaskFacts) -> str:
        return f"in plan {facts.plan_id}: assign the plan"

    def assignment_refusal(self, task: Task, rule: AssignRule, actor_id: int, context: Context) -> str | None:
        if not self.mode.is_assigning():
            return None
        try:
            self.give(task, rule, actor_id, context)
        except Refusal as refusal:
            return refusal.reason
        return None

    def give(self, task: Task, rule: AssignRule, actor_id: int, context: Context) -> None:
        self.assignments.assign(task, actor_id, context, cascade=False)
        given = next(assignment for assignment in self.assignments.assignments(task) if assignment.actor_id == actor_id)
        self.repository.save_metadata(given, RuleMark(rule.id).stored_metadata(given.metadata), context)
        self.nudge_main_agent(task, rule, actor_id, context)

    def move(self, task: Task, rule: AssignRule, actor_id: int, context: Context) -> AssignDecision:
        self.assignments.unassign(task, context)
        self.give(task, rule, actor_id, context)
        return self.record(task, self.stored_decision(task), DecisionOutcome.ASSIGNED, rule, actor_id, f"rule {rule.id} moved it to {rule.target_name}", context)

    def choose_rule(self, task: Task, facts: TaskFacts, batch: DecisionBatch) -> AssignRule | None:
        if self.is_given(self.stored_decision(task)) or self.unfree(task) is not None:
            return None
        for rule in self.matching_rules(facts):
            usable = self.targets.usable(rule, batch)
            if usable.actor_id is not None:
                batch.give(usable.actor_id)
                return rule
        return None

    def nudge_main_agent(self, task: Task, rule: AssignRule, actor_id: int, context: Context) -> None:
        agent = self.assignments.agent_row(actor_id)
        if agent is not None and agent.role == AgentRole.MAIN:
            self.nudger.send(agent.id, RULE_TASK_NUDGE, RULE_NUDGE_SOURCE, context, task=task.id, rule=rule.id)

    def matched(self, task: Task, stored: AssignDecision | None, rule: AssignRule, usable: Usable, skipped: list[str], later_rules: list[AssignRule],
                context: Context) -> AssignDecision:
        target_note = "" if usable.reason is None else f" ({usable.reason})"
        later_matches = [f"also matched: {', '.join(f'rule {matched_rule.id}' for matched_rule in later_rules)}"] if later_rules else []
        if not self.mode.is_assigning():
            return self.record(task, stored, DecisionOutcome.DRY_RUN, rule, usable.actor_id, "; ".join([*skipped, f"rule {rule.id} matches, target {rule.target_name}{target_note}", *later_matches]), context)
        return self.record(task, stored, DecisionOutcome.ASSIGNED, rule, usable.actor_id, "; ".join([*skipped, f"rule {rule.id} applied: given to {rule.target_name}{target_note}", *later_matches]), context)

    def matching_rules(self, facts: TaskFacts) -> list[AssignRule]:
        return self.enabled_rules().matching(facts)

    def enabled_rules(self) -> EnabledRules:
        rules = self.queries.query(AssignRule).filter(enabled=True)
        conditions = self.queries.query(AssignRuleCondition).where_in("rule_id", self.queries.query(AssignRule).filter(enabled=True).select_columns("id"))
        return self.kept.read_spanning([rules, conditions], lambda: self.loaded_rules(rules), name="assign_rules.enabled")

    def loaded_rules(self, rules: Query[AssignRule]) -> EnabledRules:
        ordered = tuple(sorted(rules.every_row(RULES_REASON), key=lambda rule: rule.position))
        return EnabledRules(ordered, self.conditions.rule_lines(ordered))

    def record_failure(self, task: Task, reason: str, context: Context) -> AssignDecision:
        return self.record(task, self.stored_decision(task), DecisionOutcome.FAILED, None, None, reason, context)

    def record(self, task: Task, stored: AssignDecision | None, outcome: DecisionOutcome, rule: AssignRule | None, actor_id: int | None, reason: str,
               context: Context) -> AssignDecision:
        rule_id = None if rule is None else rule.id
        if stored is None:
            return self.repository.save(AssignDecision(task_id=task.id, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason), context)
        if (stored.rule_id, stored.outcome, stored.actor_id, stored.reason) == (rule_id, outcome, actor_id, reason):
            return stored
        return self.repository.update(stored, context, rule_id=rule_id, outcome=outcome, actor_id=actor_id, reason=reason)
