from core.base.driver.stop_blockers import StopBlockers
from core.base.driver.watched_runs import WatchedRuns
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery


class SequenceStopBlockers(StopBlockers):
    """An agent's running sequence holds its stop, unless the agent is waiting on the answer to its question, a
    run it watches or its helper."""

    def __init__(self, runs: SequenceRunQuery, queries: Queries, watched: WatchedRuns, agents: AgentRows) -> None:
        self.runs, self.queries, self.watched, self.agents = runs, queries, watched, agents

    def blocking_run(self, agent_id: int) -> SequenceRun | None:
        run = self.runs.current(agent_id)
        return None if run is None or self.is_waiting(agent_id) else run

    def is_running(self, agent_id: int) -> bool:
        return self.runs.current(agent_id) is not None

    def is_waiting(self, agent_id: int) -> bool:
        return (self.watched.is_watching(agent_id) or bool(self.agents.running(parent_id=agent_id))
                or self.queries.query(Question).filter(session_agent_id=agent_id, state=QuestionState.OPEN).exists())
