from pathlib import Path

import pytest

from engine.driver.tool import Tool
from engine.enums.tool_type import ToolType
from engine.driver.search_category import CODE, SearchCategory

PROJECT = Path("/work/project")


def read_search(*files: str) -> Tool:
    return Tool("Grep", ToolType.SEARCH, files, None, None)


def test_a_search_naming_no_path_searches_the_code_of_the_folder_it_runs_in():
    assert SearchCategory.classify(read_search(), "/work/project", PROJECT) == CODE
    assert SearchCategory.classify(read_search(), "", PROJECT) == CODE


@pytest.mark.parametrize("path", ["src", "/work/project/src/cart.py", "../project/tests", ".journal/worktrees/development/worker-1/src"])
def test_a_search_inside_the_project_searches_the_code(path):
    assert SearchCategory.classify(read_search(path), "/work/project", PROJECT) == CODE


@pytest.mark.parametrize("path", ["/var/log/system.log", "../other/src", ".journal/outputs/12", ".journal/log.txt", "/work/project/.journal"])
def test_a_search_of_logs_outputs_or_another_folder_is_not_counted(path):
    assert SearchCategory.classify(read_search(path), "/work/project", PROJECT) == ""


def test_a_tool_that_does_not_search_is_not_counted():
    assert SearchCategory.classify(Tool("Edit", ToolType.EDIT, tuple(["src/cart.py"]), None, None), "/work/project", PROJECT) == ""
    assert SearchCategory.classify(None, "/work/project", PROJECT) == ""

