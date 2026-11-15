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
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.wait_target import WaitTarget

OPEN_WAITS_REASON = "the open waits of the agents one step reads, and their rows, a few each"


class WaitNeeds(NeedSource):
    """Waiting for each open wait of an agent (doc 1310 section 4.4): a question it asked, a help request, a
    merger's answer or rows it chose to wait on. A wait ends once none of its rows is left open, so it waits
    on all of them; the wait module's own writes end it, and the frame goes with it."""

    state_type = Waiting
    rank = ""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        waits = list(self.queries.query(Wait).matching(Among("session_agent_id", [agent.agent_id for agent in agents])).filter(state=WaitState.OPEN).every_row(OPEN_WAITS_REASON))
        targets = list(self.queries.query(WaitTarget).matching(Among("wait_id", [wait.id for wait in waits])).filter(resolved_at=None).every_row(OPEN_WAITS_REASON)) if waits else []
        needs: dict[int, list[Need | BlockPlan]] = {}
        for wait in waits:
            subjects = tuple(SubjectReference(target.row_table, target.row_id) for target in targets if target.wait_id == wait.id)
            needs.setdefault(wait.session_agent_id, []).append(Need(Waiting(subjects, WaitMode.ALL, True, wait.focus), self.rank, NeedKey("Waiting", SubjectReference("waits", wait.id), f"wait:{wait.id}")))
        return needs
