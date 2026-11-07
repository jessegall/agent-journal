import json
from pathlib import Path

from tests.stories.core.base.module.support.sample_programs import PATH
from tests.stories.core.support.fixtures import MainEnvironment

SHIPPED_TABLE = Path(__file__).resolve().parents[5] / "tools" / "journal-hook" / "programs" / "programs.json"


def project_table(story) -> dict[str, object]:
    return json.loads((story.home.folder / "programs.json").read_text())


def test_sync_writes_the_program_table_of_every_registered_program(new_story):
    story = new_story(fixture=MainEnvironment)
    table = project_table(story)
    story.expect_rows(set(table["programs"]) == {"claude", "codex"}, table["programs"]["claude"]["events"]["PreToolUse"] == "pre_tool_use",
                      table["programs"]["codex"]["decoder"] == "codex", "pre_tool_use" in table["programs"]["claude"]["line_events"])


def test_the_shipped_program_table_is_the_table_of_the_built_in_programs(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_rows(json.loads(SHIPPED_TABLE.read_text()) == project_table(story))


def test_a_module_that_adds_a_program_gets_its_row_in_the_project_table(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:SampleProgramModule")
    story.expect_rows(project_table(story)["programs"]["sample"]["events"] == {"Start": "session_start", "BeforeTool": "pre_tool_use", "End": "stop"})
