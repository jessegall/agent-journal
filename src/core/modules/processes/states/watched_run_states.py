from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.row_reference import RowReference
from engine.enums.wait_mode import WaitMode
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.watch import Watch

OPEN_WATCHES_REASON = "the open watches of the agents one step reads, a few each"
WATCH_TEXT = "the run it watches"


class WatchedRunStates(StateSource):
    """Waiting for each run an agent watches (doc 1310 section 4.4): its stop rests until the run ends, and the watch
    ending, as the processes module writes it, takes the stacked state away."""

    state_type = Waiting
    rank = ""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        watches = self.queries.query(Watch).matching(Among("session_agent_id", [agent.agent_id for agent in agents])).filter(state=WatchState.OPEN).every_row(OPEN_WATCHES_REASON)
        states: dict[int, list[RequiredState | BlockPlan]] = {}
        for watch in watches:
            subject = RowReference("processes", watch.process_id)
            states.setdefault(watch.session_agent_id, []).append(RequiredState(Waiting(tuple([subject]), WaitMode.ANY, True, WATCH_TEXT), self.rank,
                                                                     StateKey("Waiting", subject, f"watch:{watch.id}")))
        return states
