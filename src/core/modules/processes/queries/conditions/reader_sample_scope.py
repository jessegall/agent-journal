from dataclasses import dataclass

from engine.database.statement import Statement

from engine.query.conditions.equal import Equal
from engine.query.select import Select
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.conditions.conjunction import Conjunction
from core.modules.processes.queries.conditions.command_matches import PART_COMMAND


@dataclass(frozen=True)
class ReaderSampleScope:
    """Matches one agent's runs of one exact command in an environment."""

    agent_id: int
    command: str

    def statement(self) -> Statement:
        runs = Select("processes").matching(Equal("session_agent_id", self.agent_id)).column("id")
        return Conjunction([SubqueryMatch("process_id", runs), Equal(PART_COMMAND, self.command)]).statement()
