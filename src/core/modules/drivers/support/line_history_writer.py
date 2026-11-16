from collections.abc import Sequence
from dataclasses import replace

from engine.command.context import Context
from engine.driver.rule_answers import RuleAnswers
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line_history import AgentLineHistory
from core.modules.drivers.support.agent_line_histories import AgentLineHistories
from core.modules.drivers.support.machine_assembly import MachineAssembly

LINE_OUTCOMES = ("lines", "refused")


class LineHistoryWriter:
    """Notes, per agent and source key, when a hook's answer last said a line or a refusal under that key, for
    the line sources that read when they last spoke."""

    def __init__(self, repository: Repository, histories: AgentLineHistories, assembly: MachineAssembly) -> None:
        self.repository, self.histories, self.assembly = repository, histories, assembly

    def record(self, agent_id: int, answers: RuleAnswers, context: Context) -> None:
        self.record_given(agent_id, [record.name for record in answers.rules if record.outcome in LINE_OUTCOMES], context)

    def record_given(self, agent_id: int, source_keys: Sequence[str], context: Context) -> None:
        history_keys = self.assembly.history_keys()
        given_keys = [key for key in dict.fromkeys(source_keys) if key in history_keys]
        stored = self.histories.rows(agent_id, given_keys) if given_keys else {}
        for key in given_keys:
            row = stored.get(key)
            if row is None:
                self.repository.save(AgentLineHistory(session_agent_id=agent_id, source_key=key, last_given_at=context.timestamp), context)
            elif row.last_given_at != context.timestamp:
                self.repository.save(replace(row, last_given_at=context.timestamp), context)
