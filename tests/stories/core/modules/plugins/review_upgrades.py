import json

import pytest

from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import READ_FOLDERS_VARIABLE, RunnerLine
from tests.stories.core.modules.plugins.support.event_modules import NOTES
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, script_calls
from pathlib import Path

CONTRACT_FILE = Path("tests/snapshots/plugin_event_contract.json")


def test_s79_the_runner_line_gives_read_folders_in_a_variable_and_no_flag(new_story):
    story = new_story()
    run = ForegroundRun(30, False, read_folders=tuple([Path("/project/.rules")]))
    line = RunnerLine.build(Path("/bin/journal-run"), 1, run, "true", "s-1")
    story.expect_rows(f"{READ_FOLDERS_VARIABLE}=/project/.rules" in line, "--read-folder" not in line)


def undeclared_read_marks(story) -> list[ChatMark]:
    story.expect_sync_success(NOTES)
    story.run_listeners()
    return [mark for mark in story.container.get(Queries).query(ChatMark).all_rows() if "project_reads" in mark.text]


def test_s80_a_plugin_with_aliases_and_no_project_reads_gets_one_mark_saying_what_to_declare(new_story):
    story = event_plugin_story(new_story, aliases=[{"name": "judge", "line": "see.sh"}])
    story.expect_rows(len(undeclared_read_marks(story)) == 1)


def test_s80_a_plugin_with_project_reads_gets_no_mark(new_story):
    story = event_plugin_story(new_story, project_reads=[".rules"], aliases=[{"name": "judge", "line": "see.sh"}])
    story.expect_rows(not undeclared_read_marks(story))


def test_s81_the_snapshot_a_test_holds_names_what_journal_event_keys_lists(new_story):
    story = event_plugin_story(new_story)
    contract_file = json.loads(CONTRACT_FILE.read_text())
    rows = {row["key"] for row in json.loads(story.run("event keys --json", actor=story.user).output_text)["rows"]}
    story.expect_rows(TASK_CREATED in contract_file, TASK_CREATED in rows, contract_file[TASK_CREATED]["fields"] != [])


@pytest.mark.parametrize("protocol", [None, 1])
def test_s82_a_manifest_with_protocol_one_or_none_works(new_story, protocol):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "see.sh"}, **({} if protocol is None else {"protocol": protocol}))
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)


def test_s82_a_manifest_with_protocol_two_installs_runs_nothing_and_says_so_on_the_card(event_page):
    story = event_page.story
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "see.sh"}, protocol=2)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.expect_rows(not script_calls(story, "see.sh"))
    story.expect_rows(any(row["state"] == "needs a newer journal" for row in event_page.card()))
