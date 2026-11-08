from pathlib import Path

import pytest

from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from core.modules.drivers.support.search_kind import CODE, SearchKind

PROJECT = Path("/work/project")


def search_of(*files: str) -> Tool:
    return Tool("Grep", ToolType.SEARCH, files, None, None)


def test_a_search_naming_no_path_searches_the_code_of_the_folder_it_runs_in():
    assert SearchKind.of(search_of(), "/work/project", PROJECT) == CODE
    assert SearchKind.of(search_of(), "", PROJECT) == CODE


@pytest.mark.parametrize("path", ["src", "/work/project/src/cart.py", "../project/tests", ".journal/worktrees/development/worker-1/src"])
def test_a_search_inside_the_project_searches_the_code(path):
    assert SearchKind.of(search_of(path), "/work/project", PROJECT) == CODE


@pytest.mark.parametrize("path", ["/var/log/system.log", "../other/src", ".journal/outputs/12", ".journal/log.txt", "/work/project/.journal"])
def test_a_search_of_logs_outputs_or_another_folder_is_not_counted(path):
    assert SearchKind.of(search_of(path), "/work/project", PROJECT) == ""


def test_a_tool_that_does_not_search_is_not_counted():
    assert SearchKind.of(Tool("Edit", ToolType.EDIT, tuple(["src/cart.py"]), None, None), "/work/project", PROJECT) == ""
    assert SearchKind.of(None, "/work/project", PROJECT) == ""

