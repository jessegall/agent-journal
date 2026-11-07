from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType

C = CommandCategory


def members(group: str) -> set[CommandCategory]:
    return {category for category in CommandCategory if getattr(category, group)}


def test_each_group_of_categories_holds_the_categories_the_rules_used_to_list():
    assert members("reads_files") == {C.READ, C.SEARCH}
    assert members("accesses_files") == {C.READ, C.SEARCH, C.EDIT}
    assert members("is_readonly") == {C.READ, C.SEARCH, C.JOURNAL}
    assert members("is_short") == {C.READ, C.SEARCH, C.EDIT, C.JOURNAL}
    assert members("is_long_running") == {C.TEST_RUN, C.BUILD}
    assert members("is_watched") == {C.TEST_RUN, C.BUILD, C.CHECK, C.BACKGROUND_JOB}
    assert members("has_result_output") == {C.TEST_RUN, C.BUILD, C.CHECK, C.PACKAGE, C.BACKGROUND_JOB}


def test_the_tool_types_that_read_and_write_files_are_named_by_the_enum():
    assert {tool for tool in ToolType if tool.reads_files} == {ToolType.READ, ToolType.SEARCH}
    assert {tool for tool in ToolType if tool.writes_files} == {ToolType.EDIT, ToolType.NEW_FILE}
