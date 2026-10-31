from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_outcome import SILENCED
from core.base.driver.rule_record import RuleRecord
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome

ANSWERED_OUTCOMES = ("lines", "refused")


class RuleHistoryWriter:
    """Keeps, per agent, rule and layer, whether a rule with history was asked or silenced, and when any rule last
    answered with lines or a refusal; a rule that only allowed the hook leaves no row."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def record(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        for record in answers.rules:
            if record.history or record.outcome in ANSWERED_OUTCOMES:
                self.write(agent_id, record, context)

    def write(self, agent_id: int, record: RuleRecord, context: Context) -> None:
        rows = self.queries.query(RuleHistory).filter(agent_id=agent_id, rule=record.name, layer=record.layer).page(1, 1).rows
        current = rows[0] if rows else RuleHistory(agent_id=agent_id, creator_id=context.actor.id, rule=record.name, layer=record.layer)
        due_outcome = RuleDueOutcome.SILENCED if record.outcome == SILENCED else RuleDueOutcome.CONSULTED
        answer_at = context.timestamp if record.outcome in ANSWERED_OUTCOMES else current.last_answer_at
        self.repository.save(replace(current, last_due_outcome=due_outcome, last_answer_at=answer_at), context)
