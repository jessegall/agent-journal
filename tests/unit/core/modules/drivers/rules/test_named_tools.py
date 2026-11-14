from core.modules.drivers.rules.access_rule import is_named_tool
from engine.driver.tool import Tool
from engine.enums.tool_type import ToolType

DESIGNER_TOOLS = ("mcp__claude_design__write_files", "Artifact", "Write")


def tool(name: str, category: ToolType) -> Tool:
    return Tool(name, category, (), None, None)


def test_a_designer_may_publish_an_artifact_and_use_its_design_tools():
    assert is_named_tool(tool("Artifact", ToolType.UNCATEGORISED), DESIGNER_TOOLS)
    assert is_named_tool(tool("mcp__claude_design__write_files", ToolType.UNCATEGORISED), DESIGNER_TOOLS)


def test_a_named_program_tool_that_writes_files_is_never_let_through_by_its_name():
    assert not is_named_tool(tool("Write", ToolType.NEW_FILE), DESIGNER_TOOLS)


def test_a_tool_the_profile_does_not_name_is_not_let_through():
    assert not is_named_tool(tool("AskUserQuestion", ToolType.QUESTION), DESIGNER_TOOLS)
