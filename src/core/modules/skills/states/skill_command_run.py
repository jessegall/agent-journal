from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.driver.states.hook_triggered_state import HOOK_TABLE
from engine.enums.state_tier import StateTier
from core.modules.skills.rules.command_skill_rule import CommandSkillRule
from core.modules.skills.support.skill_requirement import SkillRequirement


class SkillCommandRun(AgentState):
    """The agent's tool runs a journal command while skills are required: the rule that asks for the skill of the
    command's subject is asked in its own place only then. It reads no row: the tool is the whole of what opens it."""

    name = "skills.command-run"
    tier = StateTier.IN_PLACE
    role_group = RoleGroup.PROMPT
    rules = [CommandSkillRule]

    def __init__(self, requirement: SkillRequirement) -> None:
        self.requirement = requirement

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        tool = hook.event.tool
        if tool is None or not tool.journal_commands or not self.requirement.is_required:
            return []
        return [OpenRow(HOOK_TABLE, 0, hook.timestamp)]
