from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.base.cli.alias_options import AliasOptions


def is_agent(tool: Tool) -> bool:
    # @sin architecture_drivers_tool_category_compared_with_a_string
    return tool.category == "agent"


def is_agent_tool(tool: Tool) -> bool:
    # @righteous architecture_drivers_tool_category_compared_with_a_string
    return tool.category is ToolType.AGENT


def has_category(options: AliasOptions) -> bool:
    # @righteous architecture_drivers_tool_category_compared_with_a_string
    return options.category is not None


def is_category_missing(options: AliasOptions) -> bool:
    # @righteous architecture_drivers_tool_category_compared_with_a_string
    return options.category is None
