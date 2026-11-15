from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.tool import Tool
from engine.enums.tool_type import ToolType
from engine.provider.providers import Providers
from core.modules.agents.support.agent_standing import AgentStanding
from core.modules.drivers.nudges.native_subagent_message import NativeSubagentMessage
from core.modules.drivers.nudges.unlaunched_native_subagent_message import UnlaunchedNativeSubagentMessage

SPAWN_SUFFIX = "spawn_agent"
COLLABORATION_PREFIX = "collaboration"


class NativeSubagentPolicy(EventPolicy):
    """A program's own subagent tool runs a child no policy sees, so it is refused on every program, with the
    line that starts a helper instead, and so is any tool such a child calls; with no launcher running the agent
    keeps the work. A program's agent that only reads a web page is not refused."""

    key = "drivers.native-subagent"
    rank = "access.all"

    def __init__(self, standings: AgentStanding, providers: Providers) -> None:
        self.standings, self.providers = standings, providers

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or not (event.child_agent or self.is_spawn_tool(tool)) or self.providers.provider(event.program).uses_web_reader(event):
            return None
        return (NativeSubagentMessage.declared() if self.standings.is_launcher_running else UnlaunchedNativeSubagentMessage.declared()).nudge()

    @staticmethod
    def is_spawn_tool(tool: Tool) -> bool:
        return tool.category is ToolType.AGENT or tool.name.endswith(SPAWN_SUFFIX) or tool.name.startswith(COLLABORATION_PREFIX)
