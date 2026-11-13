import json

from engine.query.conditions.among import Among
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.agents.models.agent_fold import AgentFold

FOLDED_IDS_REASON = "the ids asked for are looked up among the folded main rows, which are few"
SESSION_WALK_REASON = "an old session is looked up among the folded main rows of one environment, which are few"


class FoldRecord:
    """Finds the agent a folded main row became: an old agent id, an old number in its environment or an old
    session each lead to the survivor, and every other agent stays itself."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def agent_id(self, agent_id: int) -> int:
        folds = self.queries.query(AgentFold).filter(folded_agent_id=agent_id)
        fold = self.kept.read(folds, folds.first, name="agents.folded_agent")
        return agent_id if fold is None else fold.survivor_id

    def agent_ids(self, agent_ids: set[int]) -> dict[int, int]:
        folds = self.queries.query(AgentFold).matching(Among("folded_agent_id", tuple(agent_ids))).every_row(FOLDED_IDS_REASON)
        survivors = {fold.folded_agent_id: fold.survivor_id for fold in folds}
        return {agent_id: survivors.get(agent_id, agent_id) for agent_id in agent_ids}

    def number_holder(self, environment_id: int, number: int) -> int | None:
        fold = self.queries.query(AgentFold).filter(environment_id=environment_id, folded_number=number).first()
        return None if fold is None else fold.survivor_id

    def session_holder(self, environment_id: int, session: str) -> int | None:
        folds = self.queries.query(AgentFold).filter(environment_id=environment_id).every_row(SESSION_WALK_REASON)
        return next((fold.survivor_id for fold in folds if session in FoldRecord.sessions(fold)), None)

    def highest_number(self) -> int | None:
        fold = self.queries.query(AgentFold).descending("folded_number").first()
        return None if fold is None else fold.folded_number

    @staticmethod
    def sessions(fold: AgentFold) -> set[str]:
        return {str(json.loads(fold.agent_row).get("session"))} | {str(row.get("session")) for row in json.loads(fold.sessions)}
