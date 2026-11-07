from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.driver.rule_outcome import SILENCED
from core.base.driver.rule_record import RuleRecord
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.driver.hook_history import HookHistory
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome

ANSWERED_OUTCOMES = ("lines", "refused")


class RuleHistoryWriter:
    """Keeps, per agent, rule and layer, whether a rule with history was asked or silenced, and when any rule
    last answered with lines or a refusal; a rule that only allowed the hook leaves no row. It reads the rows it
    changes when it writes, so a row another writer changed after the rules read it is not saved over."""

    def __init__(self, repository: Repository, history: HookHistory, queries: Queries) -> None:
        self.repository, self.history, self.queries = repository, history, queries

    def record(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        written = [record for record in answers.rules if record.history or record.outcome in ANSWERED_OUTCOMES]
        stored = {(row.rule, row.layer): row for row in self.queries.query(RuleHistory).filter(session_agent_id=agent_id).all_rows()} if written else {}
        for record in written:
            self.write(agent_id, record, stored.get((record.name, record.layer)), context)
        self.history.clear()

    def write(self, agent_id: int, record: RuleRecord, stored_history: RuleHistory | None, context: Context) -> None:
        current = stored_history or RuleHistory(session_agent_id=agent_id, creator_id=context.actor.id, rule=record.name, layer=record.layer)
        due_outcome = RuleDueOutcome.SILENCED if record.outcome == SILENCED else RuleDueOutcome.CONSULTED
        answer_at = context.timestamp if record.outcome in ANSWERED_OUTCOMES else current.last_answer_at
        if stored_history is not None and stored_history.last_due_outcome == due_outcome and stored_history.last_answer_at == answer_at:
            return
        self.repository.save(replace(current, last_due_outcome=due_outcome, last_answer_at=answer_at), context)
