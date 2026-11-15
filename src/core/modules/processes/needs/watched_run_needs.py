from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.subject_reference import SubjectReference
from engine.enums.wait_mode import WaitMode
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.watch import Watch

OPEN_WATCHES_REASON = "the open watches of the agents one step reads, a few each"
WATCH_TEXT = "the run it watches"


class WatchedRunNeeds(NeedSource):
    """Waiting for each run an agent watches (doc 1310 section 4.4): its stop rests until the run ends, and the watch
    ending, as the processes module writes it, takes the frame away."""

    state_type = Waiting
    rank = ""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        watches = self.queries.query(Watch).matching(Among("session_agent_id", [agent.agent_id for agent in agents])).filter(state=WatchState.OPEN).every_row(OPEN_WATCHES_REASON)
        needs: dict[int, list[Need | BlockPlan]] = {}
        for watch in watches:
            subject = SubjectReference("processes", watch.process_id)
            needs.setdefault(watch.session_agent_id, []).append(Need(Waiting(tuple([subject]), WaitMode.ANY, True, WATCH_TEXT), self.rank,
                                                                     NeedKey("Waiting", subject, f"watch:{watch.id}")))
        return needs
