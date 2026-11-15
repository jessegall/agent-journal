from collections.abc import Mapping, Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.hook_event_name import HookEventName
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES
from core.modules.triggers.support.phrase_trigger_match import PHRASE_TRIGGER_KEY, PhraseTriggerMatch

PHRASE_SKILL_RANK = "triggers.skill"


class PhraseTriggerNeeds(NeedSource):
    """A tool call whose words a skill trigger watches holds the agent's tools, after the skill countdown's uses,
    until it has read that skill."""

    replaced_rules = tuple([PHRASE_TRIGGER_KEY])
    state_type = Blocked
    rank = PHRASE_SKILL_RANK
    role_group = RoleGroup.PROMPT

    def __init__(self, match: PhraseTriggerMatch) -> None:
        self.match = match

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        event = question.event
        if event is None or event.event is not HookEventName.PRE_TOOL_USE:
            return {}
        holds = {agent.agent_id: self.match.answer(event, agent.agent_id).skill_block for agent in agents}
        return {agent_id: [BlockPlan(hold[0], SkillLoaded(hold[1]), PHRASE_TRIGGER_KEY, PHRASE_SKILL_RANK, tool_grace_uses=SKILL_TOOL_USES, scope_tools=True, scope_stop=False)]
                for agent_id, hold in holds.items() if hold is not None}
