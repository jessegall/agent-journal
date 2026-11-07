from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.drivers.rules.denied_tools_rule import DeniedToolsRule
from core.modules.drivers.support.access_nudges import NATIVE_SUBAGENT, NATIVE_SUBAGENT_WITHOUT_LAUNCH

SPAWN_SUFFIX = "spawn_agent"
COLLABORATION_PREFIX = "collaboration"


class NativeSubagentRule(DeniedToolsRule):
    """A program's own subagent tool runs a child no rule sees, so it is refused on every program and under
    every overlay, with the line that starts a helper instead, and so is any tool such a child calls; with
    no launcher running the agent keeps the work."""

    name = "drivers.native-subagent"
    drivers = ["*"]
    overlay_proof = True
    denied_tools = tuple([ToolType.AGENT])

    def __init__(self, launcher: LauncherLink) -> None:
        self.launcher = launcher

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not (hook.event.child_agent or self.is_spawn_tool(tool)):
            return RuleAnswer.allowed()
        return RuleAnswer.refused((NATIVE_SUBAGENT if self.launcher.is_running else NATIVE_SUBAGENT_WITHOUT_LAUNCH).nudge())

    def is_spawn_tool(self, tool: Tool) -> bool:
        return tool.category in self.denied_tools or tool.name.endswith(SPAWN_SUFFIX) or tool.name.startswith(COLLABORATION_PREFIX)
