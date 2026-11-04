from core.base.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.modules.profiles.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.profiles.support.profile_files import ProfileFiles

PROFILE_INPUT = "subagent_type"


class ProfileUseRule(DriverRule):
    """Counts a subagent started under a profile the project holds."""

    name = "profiles.use"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.DISPATCH

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT:
            return RuleAnswer.allowed()
        profile = str(hook.event.tool_input().get(PROFILE_INPUT, ""))
        return RuleAnswer.allowed().running(CountProfileUse(profile)) if profile and self.files.has(profile) else RuleAnswer.allowed()
