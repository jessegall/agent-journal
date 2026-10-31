from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_files import SkillFiles


class CommandSkillRule(DriverRule):
    """A journal command of a noun a skill covers is refused until the agent holds that skill loaded in its
    current text, and the refusal gives the path to read."""

    name = "skills.command"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, catalogue: SkillCatalogue, rows: AgentSkillRows, files: SkillFiles) -> None:
        self.catalogue, self.rows, self.files = catalogue, rows, files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        covered = {part.subcommand or part.arguments[0] for part in parts if part.classification.category is CommandCategory.JOURNAL and part.arguments}
        missing = [skill for skill in self.catalogue.skills() if covered.intersection(skill.commands) and not self.loaded(hook.agent_id, skill.folder, skill.digest)]
        if not missing:
            return RuleAnswer.allowed()
        return RuleAnswer.refused("; ".join(f"read {skill.folder} first: {self.files.readable(skill.folder)}" for skill in missing))

    def loaded(self, agent_id: int, folder: str, digest: str) -> bool:
        row = self.rows.find(agent_id, folder)
        return row is not None and row.state is AgentSkillState.LOADED and row.digest == digest
