from pathlib import PurePath

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_nudges import SKILL_ALREADY_LOADED


class SkillAlreadyLoadedRule(DriverRule):
    """Refuses a load of a skill the agent has loaded in its context already, with the very text the catalogue holds
    now: a compaction unloads the agent's skills, so the load passes again after it, and so does one of a skill whose
    text changed. The refusal is skipped like any other."""

    name = "skills.already-loaded"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, rows: AgentSkillRows, catalogue: SkillCatalogue) -> None:
        self.rows, self.catalogue = rows, catalogue

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_skill_read:
            return RuleAnswer.allowed()
        folders = {PurePath(path).parent.name for path in tool.files}
        loaded = [skill.folder for skill in self.catalogue.skills() if skill.folder in folders and self.rows.is_loaded(hook.agent_id, skill.folder, skill.digest)]
        if not loaded:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SKILL_ALREADY_LOADED.nudge(skill=loaded[0]))
