from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType


def is_agent(tool: Tool) -> bool:
    # @sin architecture_drivers_CategoryByMemberDetector
    return tool.category == "agent"


def is_agent_tool(tool: Tool) -> bool:
    # @righteous architecture_drivers_CategoryByMemberDetector
    return tool.category is ToolType.AGENT
