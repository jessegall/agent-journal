from pathlib import PurePath

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.skills.support.due_skills import DueSkills
from core.modules.skills.support.skill_files import SkillFiles


class SkillReadFirstRule(DriverRule):
    """While a skill is due, every tool call is refused but a read of a due skill's file and a journal command; the
    refusal lists each due skill with the path to read."""

    name = "skills.read-first"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, due: DueSkills, files: SkillFiles) -> None:
        self.due, self.files = due, files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        folders = self.due.folders(hook.agent_id)
        tool = hook.event.tool
        if not folders or tool is None or tool.is_journal_line or self.reads_due(tool, folders):
            return RuleAnswer.allowed()
        return RuleAnswer.refused("; ".join(f"read {folder} first: {self.files.readable(folder)}" for folder in folders))

    def reads_due(self, tool: Tool, folders: list[str]) -> bool:
        paths = [PurePath(path) for path in tool.files]
        return tool.category is ToolType.READ and any(path.name == SKILL_FILE and path.parent.name in folders for path in paths)
