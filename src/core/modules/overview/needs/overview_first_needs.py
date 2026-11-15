from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.enums.hook_event_name import HookEventName
from core.modules.overview.nudges.overview_refusal_message import OverviewRefusalMessage
from core.modules.overview.support.block_conditions.recent_overview_read import RecentOverviewRead
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.overview.support.overview_nudges import OVERVIEW_COMMAND

OVERVIEW_RANK = "overview.first"
OVERVIEW_RULE = "overview.overview-first"


class OverviewFirstNeeds(StateSource):
    """Plans the strict block of a main agent's session start that is no resume, which a compaction's end is too: nothing
    but a skill read and the lifting commands passes until the agent runs journal overview (doc 1310 section 4.6)."""
    state_type = Blocked
    rank = OVERVIEW_RANK
    agent_types = ["main"]

    def __init__(self, first: OverviewFirst) -> None:
        self.first = first

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        event = question.event
        if not self.first.is_required or event is None or event.event is not HookEventName.SESSION_START or event.is_resume:
            return {}
        plan = BlockPlan(OverviewRefusalMessage.declared().nudge(), RecentOverviewRead(OVERVIEW_COMMAND), OVERVIEW_RULE, OVERVIEW_RANK, is_strict=True,
                         lifting_lines=tuple([OVERVIEW_COMMAND]))
        return {agent.agent_id: [plan] for agent in agents}
