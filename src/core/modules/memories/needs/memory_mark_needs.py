from core.modules.memories.support.memory_nudges import WEIGH_COUNTDOWN
from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.enums.closer_role import CloserRole
from engine.setting.setting_values import SettingValues
from core.modules.memories.nudges.weigh_first_nudge import WeighFirstNudge
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.support.mark_tracker import MarkTracker
from core.modules.memories.support.memory_settings import MARK_TOOL_USES_SETTING, MARKS_SETTING

MARK_RANK = "memories.mark"
TOOL_RULE, STOP_RULE = "memories.open-mark", "memories.weigh-first-stop"
WEIGH_COMMANDS = ("journal memory weigh", "journal memory skip", "journal memory remove", "journal memory edit")


class MemoryMarkNeeds(NeedSource):
    """Plans the block of an open memory mark (doc 1310 section 4.6): its tools after the mark's uses, its stop at once,
    until the agent has weighed its memories; the mark itself is opened by the line that tells the agent of it."""

    replaced_rules = (TOOL_RULE, STOP_RULE)
    state_type = Blocked
    rank = MARK_RANK

    def __init__(self, marks: MarkTracker, settings: SettingValues) -> None:
        self.marks, self.settings = marks, settings

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        plans = {agent.agent_id: self.plan(agent.agent_id) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent_id: int) -> BlockPlan | None:
        marks = self.marks.open_marks(agent_id)
        if not marks:
            return None
        tool_uses = self.settings.numbers(MARK_TOOL_USES_SETTING)
        uses = dict(zip(self.settings.numbers(MARKS_SETTING), tool_uses)).get(marks[0].percent, tool_uses[-1])
        nudge = WeighFirstNudge.declared().nudge()
        return BlockPlan(nudge, MemoriesWeighed(), TOOL_RULE, MARK_RANK, stop_check_key=STOP_RULE, tool_grace_uses=uses, scope_stop=True,
                         closer_roles=tuple([CloserRole.AGENT]), lifting_lines=WEIGH_COMMANDS, stop_nudge=nudge, countdown=WEIGH_COUNTDOWN.nudge("{left}"))
