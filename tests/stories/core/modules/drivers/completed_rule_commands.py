from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.drivers.support.hook_rule_answers import HookRuleAnswers
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.queries.process_query import ProcessQuery
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted


class BuildWithWatch(StoryFixture):
    """A background build whose agent has an open watch."""

    parent = BuilderStarted

    def steps(self, story):
        moved_run(story, "make test", category=CommandCategory.BUILD)


@pytest.fixture
def running_process(new_story):
    story = install_runner(new_story(fixture=BuildWithWatch))
    return story, story.container.get(ProcessQuery).find(1)


def move_after_answers(story, monkeypatch, expected_commands, move):
    original_read = HookRuleAnswers.asked

    def read_then_move(reader, event, agent):
        answers = original_read(reader, event, agent)
        assert set(expected_commands) <= {type(command).__name__ for _, command in answers.commands}
        move()
        return answers

    monkeypatch.setattr(HookRuleAnswers, "asked", read_then_move)


def expect_command_not_refused(story, reply, *command_names):
    assert not reply.refusal
    output = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    for name in command_names:
        assert f"the journal could not run {name}" not in str(reply.lines)
        assert f"the journal could not run {name}" not in output


def finish_run(story, process, exit_code):
    story.expect_success(f"process part-end {process.id} --position 1 --exit-code {exit_code}", actor=story.agent)
    story.expect_success(f"process end {process.id} --exit-code {exit_code} --bytes 0 --lines 0", actor=story.agent)


@pytest.mark.parametrize("exit_code", [0, 4])
def test_a_runner_finishing_between_ask_and_record_makes_the_rules_end_commands_unnecessary(running_process, monkeypatch, exit_code):
    story, process = running_process
    folder = story.container.get(OutputFolder)
    folder.write_status(process.id, 1, exit_code)
    folder.write_end(process.id, exit_code)
    move_after_answers(story, monkeypatch, ["EndProcessPart", "EndProcess"], lambda: finish_run(story, process, exit_code))
    expect_command_not_refused(story, story.tick("s-1"), "EndProcessPart", "EndProcess")
    story.expect_text(f"process show {process.id}", f"exit_code: {exit_code}")


def test_a_watch_ending_between_ask_and_record_needs_no_progress_update(running_process, monkeypatch):
    story, process = running_process
    move_after_answers(story, monkeypatch, ["RecordGivenPercent"], lambda: end_run(story, process, "done\n"))
    expect_command_not_refused(story, story.hook("s-1", HookSamples.sample("post_tool_use")), "RecordGivenPercent")
    story.expect_text("watch show 1", "state: ended")


def test_a_run_docked_between_ask_and_record_needs_no_second_dock_item(running_process, monkeypatch):
    story, process = running_process
    story.advance(timedelta(seconds=6))
    move_after_answers(story, monkeypatch, ["AddDockItem"], lambda: story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent))
    expect_command_not_refused(story, story.hook("s-1", HookSamples.sample("post_tool_use")), "AddDockItem")
    story.expect_text("dock-item list --environment main", "processes.output")
