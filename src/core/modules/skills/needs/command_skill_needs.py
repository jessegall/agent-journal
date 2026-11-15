from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.enums.closer_role import CloserRole
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.nudges.read_command_skill_first_nudge import ReadCommandSkillFirstNudge
from core.modules.skills.support.block_conditions.skill_loaded import SkillLoaded
from core.modules.skills.support.missing_command_skill import MissingCommandSkill
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES

COMMAND_SKILL_RANK = "skills.command"
COMMAND_RULE = "skills.command"
SKILL_COMMAND = "journal skill read"


class CommandSkillNeeds(NeedSource):
    """Plans, from the tool call under judgement, the strict block of a journal command whose subject a skill covers and
    the agent has not loaded: three tool uses, then only that skill's read passes (doc 1310 section 4.6)."""

    replaced_rules = tuple([COMMAND_RULE])
    state_type = Blocked
    rank = COMMAND_SKILL_RANK

    def __init__(self, missing: MissingCommandSkill, files: SkillFiles, agents: AgentRows) -> None:
        self.missing, self.files, self.agents = missing, files, agents

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        tool = question.tool()
        if tool is None or not tool.journal_commands:
            return {}
        plans = {agent.agent_id: self.plan(agent.agent_id, tool.journal_commands) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent_id: int, commands: tuple[str, ...]) -> BlockPlan | None:
        folder = self.missing.first(agent_id, commands)
        if folder is None:
            return None
        nudge = ReadCommandSkillFirstNudge.declared().nudge(instruction=self.files.agent_instruction(folder, self.agents.find(agent_id)))
        return BlockPlan(nudge, SkillLoaded(folder), COMMAND_RULE, COMMAND_SKILL_RANK, tool_grace_uses=SKILL_TOOL_USES, is_strict=True,
                         closer_roles=tuple([CloserRole.AGENT]), lifting_lines=tuple([f"{SKILL_COMMAND} {folder}"]))
