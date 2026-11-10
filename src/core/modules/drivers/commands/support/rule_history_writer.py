from collections.abc import Mapping
from dataclasses import replace

from core.base.command.context import Context
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_outcome import SILENCED
from core.base.driver.rule_record import RuleRecord
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.repository.stale_row_error import StaleRowError
from core.base.driver.hook_history import HookHistory
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome
from core.modules.drivers.support.hook_rule_histories import HookRuleHistories

ANSWERED_OUTCOMES = ("lines", "refused")


class RuleHistoryWriter:
    """Keeps, per agent, rule and layer, whether a rule with history was asked or silenced, and when any rule
    last answered with lines or a refusal; a rule that only allowed the hook leaves no row. It saves
    against the rows the rules read, and reads a row again only when another writer changed it since, so
    that row is not saved over."""

    def __init__(self, repository: Repository, history: HookHistory, queries: Queries, histories: HookRuleHistories) -> None:
        self.repository, self.history, self.queries, self.histories = repository, history, queries, histories

    def record(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        answered = [record for record in answers.rules if record.history or record.outcome in ANSWERED_OUTCOMES]
        stored: Mapping[tuple[str, str], RuleHistory] = self.histories.rows(agent_id) if answered else {}
        for record in answered:
            self.write(agent_id, record, stored.get((record.name, record.layer)), context)
        self.history.clear()

    def write(self, agent_id: int, record: RuleRecord, stored_history: RuleHistory | None, context: Context) -> None:
        try:
            self.save(agent_id, record, stored_history, context)
        except StaleRowError:
            changed = self.queries.query(RuleHistory).filter(session_agent_id=agent_id, rule=record.name, layer=record.layer).first()
            self.save(agent_id, record, changed, context)

    def save(self, agent_id: int, record: RuleRecord, stored_history: RuleHistory | None, context: Context) -> None:
        current = stored_history or RuleHistory(session_agent_id=agent_id, creator_id=context.actor.id, rule=record.name, layer=record.layer)
        due_outcome = RuleDueOutcome.SILENCED if record.outcome == SILENCED else RuleDueOutcome.CONSULTED
        answer_at = context.timestamp if record.outcome in ANSWERED_OUTCOMES else current.last_answer_at
        if stored_history is not None and stored_history.last_due_outcome == due_outcome and stored_history.last_answer_at == answer_at:
            return
        self.repository.save(replace(current, last_due_outcome=due_outcome, last_answer_at=answer_at), context)
