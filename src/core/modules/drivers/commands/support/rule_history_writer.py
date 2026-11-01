from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.driver.rule_outcome import SILENCED
from core.base.driver.rule_record import RuleRecord
from core.base.repository.repository import Repository
from core.modules.drivers.bindings.table_hook_history import TableHookHistory
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome

ANSWERED_OUTCOMES = ("lines", "refused")


class RuleHistoryWriter:
    """Keeps, per agent, rule and layer, whether a rule with history was asked or silenced, and when any rule last
    answered with lines or a refusal; a rule that only allowed the hook leaves no row."""

    def __init__(self, repository: Repository, rows: TableHookHistory) -> None:
        self.repository, self.rows = repository, rows

    def record(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        for record in answers.rules:
            if record.history or record.outcome in ANSWERED_OUTCOMES:
                self.write(agent_id, record, context)
        self.rows.forget()

    def write(self, agent_id: int, record: RuleRecord, context: Context) -> None:
        found = self.rows.history(RuleHistoryKey(agent_id, record.name, record.layer))
        current = found or RuleHistory(agent_id=agent_id, creator_id=context.actor.id, rule=record.name, layer=record.layer)
        due_outcome = RuleDueOutcome.SILENCED if record.outcome == SILENCED else RuleDueOutcome.CONSULTED
        answer_at = context.timestamp if record.outcome in ANSWERED_OUTCOMES else current.last_answer_at
        if found is not None and found.last_due_outcome == due_outcome and found.last_answer_at == answer_at:
            return
        self.repository.save(replace(current, last_due_outcome=due_outcome, last_answer_at=answer_at), context)
