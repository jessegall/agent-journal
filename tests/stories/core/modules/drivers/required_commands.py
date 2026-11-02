from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

EDIT_HOOK = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": ["a.py"], "shell": None, "diff": None})
TITLE_LINE = "journal output title {process}"


def journal_line(line):
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))
    return sample.with_fields(event="pre_tool_use", raw={"tool_input": {"command": line}})


def story_with_required_command(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": f"journal output monitor {process.id}"}}).with_raw({"tool_input": {"command": f"journal output monitor {process.id}"}}))
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.expect_text("required-command list", TITLE_LINE.format(process=process.id), actor=story.agent)
    return story, process


def spend(story, count):
    return [story.hook("s-1", EDIT_HOOK) for _ in range(count)]


def test_a_line_that_names_its_command_opens_one_required_command_however_often_it_is_said(new_story):
    story, process = story_with_required_command(new_story)
    story.hook("s-1", HookSamples.stop())
    story.expect_text("required-command show 1", TITLE_LINE.format(process=process.id), actor=story.agent)
    story.expect_refusal("required-command show 2", "no required-command 2", actor=story.agent)


def test_the_tool_uses_count_down_and_the_last_three_say_so(new_story):
    story, _ = story_with_required_command(new_story)
    hooks = spend(story, 5)
    countdown_lines = [[line for line in hook.lines if "due:" in line] for hook in hooks]
    assert [bool(lines) for lines in countdown_lines] == [False, False, True, True, True]
    assert "title output 1 due: 2 tool uses" in countdown_lines[2][0]
    assert "title output 1 due: 0 tool uses" in countdown_lines[4][0]
    assert not any(hook.refusal for hook in hooks)


def test_past_the_fifth_a_write_is_refused_with_the_line_and_how_to_skip(new_story):
    story, process = story_with_required_command(new_story)
    spend(story, 5)
    refusal = story.hook("s-1", EDIT_HOOK).refusal
    assert f"title output {process.id} is due" in refusal
    assert "journal required-command skip 1 --reason" in refusal


def test_while_held_reads_and_journal_commands_still_run_so_the_agent_is_never_stuck(new_story):
    story, _ = story_with_required_command(new_story)
    spend(story, 6)
    assert not story.hook("s-1", READ).refusal
    assert not story.hook("s-1", journal_line("journal task list")).refusal
    assert not story.hook("s-1", journal_line("journal required-command list")).refusal


def test_running_the_command_settles_it_and_writes_run_again(new_story):
    story, process = story_with_required_command(new_story)
    spend(story, 6)
    assert not story.hook("s-1", journal_line(f'journal output title {process.id} "Deploy staging"')).refusal
    assert not story.hook("s-1", EDIT_HOOK).refusal
    story.expect_text("required-command show 1", "closed_at:", actor=story.agent)


def test_a_skip_needs_a_reason_settles_it_and_shows_in_the_chat(new_story):
    story, _ = story_with_required_command(new_story)
    spend(story, 6)
    story.expect_usage_error("required-command skip 1", actor=story.agent)
    story.expect_refusal('required-command skip 1 --reason "  "', "say why", actor=story.agent)
    story.expect_success('required-command skip 1 --reason "a one-off command"', actor=story.agent)
    assert not story.hook("s-1", EDIT_HOOK).refusal
    story.run_listeners()
    assert "a one-off command" in marks_text(story)


def test_a_line_that_names_no_command_opens_no_debt(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("required-command list", "journal", actor=story.agent)
