import json

from engine.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_line import READ_FOLDERS_VARIABLE, RunnerLine
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, script_calls
from pathlib import Path

CONTRACT_FILE = Path("tests/snapshots/plugin_event_contract.json")


def test_s79_the_runner_line_gives_read_folders_in_a_variable_and_no_flag(new_story):
    story = new_story()
    run = ForegroundRun(30, False, read_folders=tuple([Path("/project/.rules")]))
    line = RunnerLine.build(Path("/bin/journal-run"), 1, run, "true", "s-1")
    story.expect_rows(f"{READ_FOLDERS_VARIABLE}=/project/.rules" in line, "--read-folder" not in line)


def test_s81_the_snapshot_a_test_holds_names_what_journal_event_keys_lists(new_story):
    story = event_plugin_story(new_story)
    contract_file = json.loads(CONTRACT_FILE.read_text())
    rows = {row["key"] for row in json.loads(story.run("event keys --json", actor=story.user).output_text)["rows"]}
    story.expect_rows(TASK_CREATED in contract_file, TASK_CREATED in rows, contract_file[TASK_CREATED]["fields"] != [])


def test_an_alias_of_a_switched_off_plugin_is_refused_and_runs_again_once_it_is_on(new_story):
    # the code-commandments plugin on 8 November: switched off, its sins alias still ran the judge for every worker
    story = event_plugin_story(new_story, scripts={"judge.sh": "#!/bin/sh\nexit 0\n"}, project_reads=[".rules"], aliases=[{"name": "judge", "line": "judge.sh"}])
    story.expect_success("plugin disable events", actor=story.user)
    story.expect_refusal("judge", "switched off", actor=story.agent)
    story.expect_refusal("judge", "switched off", actor=story.user)
    story.expect_success("plugin enable events", actor=story.user)
    story.expect_success("judge", actor=story.user)


def plugin_program_line(plugin, *text_parts):
    program = f"/project/.journal/plugins/{plugin}/bin/judge"
    return HookSamples.shell(" ".join((program, *text_parts)), ShellPart(program, CommandCategory.CHECK, list(text_parts)))


def test_a_program_of_a_switched_off_plugin_is_refused_and_runs_again_once_it_is_on(new_story):
    story = event_plugin_story(new_story)
    story.expect_success("plugin disable events", actor=story.user)
    story.expect_hook_refusal("s-1", plugin_program_line("events", "--changes"), "switched off or not installed")
    story.expect_success("plugin enable events", actor=story.user)
    story.expect_hook_allowed("s-1", plugin_program_line("events", "--changes"))


def test_a_program_of_a_plugin_that_is_not_installed_is_refused(new_story):
    story = event_plugin_story(new_story)
    story.expect_hook_refusal("s-1", plugin_program_line("gone"), "switched off or not installed")


def test_reading_a_file_of_a_switched_off_plugin_goes_on(new_story):
    story = event_plugin_story(new_story)
    story.expect_success("plugin disable events", actor=story.user)
    path = "/project/.journal/plugins/events/see.sh"
    story.expect_hook_allowed("s-1", HookSamples.shell(f"cat {path}", ShellPart("cat", CommandCategory.READ, [path])))
