from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.models.process import Process
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderWithUser

MARKS = "chat-mark list --environment 1 --oldest"


class SavedRun(StoryFixture):
    """A run the agent started that the runner has not begun yet."""

    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        start_process(story, "make package", category=CommandCategory.BUILD)
        story.run_listeners()


def saved_run(new_story):
    story = install_runner(new_story(fixture=SavedRun))
    return story, story.row(Process, 1)


def part_started(story, process, position: int = 1) -> None:
    story.container.get(Bus).run(StartProcessPart(process.id, position), story.agent, environment_id=1)
    story.run_listeners()


def test_a_run_that_is_saved_shows_no_mark_until_its_part_starts(new_story):
    story, process = saved_run(new_story)
    story.expect_absent(MARKS, "processes.command", actor=story.user)
    part_started(story, process)
    story.expect_text(MARKS, "processes.command", "process:1", "running", actor=story.user)


def test_a_queued_run_shows_no_mark_until_its_part_starts(new_story):
    story, _ = saved_run(new_story)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    waiting = start_process(story, "make second", category=CommandCategory.BUILD)
    story.run_listeners()
    story.expect_absent(MARKS, "process:2", actor=story.user)
    part_started(story, waiting)
    story.expect_text(MARKS, "process:2", actor=story.user)
    story.expect_absent(MARKS, "Queued", actor=story.user)


def test_a_run_stopped_before_it_starts_never_shows_a_mark(new_story):
    story, process = saved_run(new_story)
    story.expect_success(f"output stop {process.id} --environment main", actor=story.user)
    story.run_listeners()
    story.expect_absent(MARKS, "processes.command", actor=story.user)


def test_a_line_shows_its_mark_when_its_named_part_starts_not_its_first(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    process = start_process(story, "cd cart && make package", category=CommandCategory.BUILD)
    story.expect_text(f"process-part list --process {process.id} --environment main", "make package", actor=story.user)
    part_started(story, process, 1)
    story.expect_absent(MARKS, "processes.command", actor=story.user)
    part_started(story, process, 2)
    story.expect_text(MARKS, "processes.command", actor=story.user)


def test_a_started_run_that_ends_keeps_one_mark_with_its_outcome(new_story):
    story, process = saved_run(new_story)
    part_started(story, process)
    end_run(story, process, "done\n")
    story.run_listeners()
    story.expect_text(MARKS, "process:1", "ended", actor=story.user)
    story.expect_absent(MARKS, "process:2", actor=story.user)


def test_a_run_whose_start_report_was_lost_still_shows_its_end(new_story):
    story, process = saved_run(new_story)
    story.expect_text(f"process show {process.id}", "state: running", actor=story.user)
    end_run(story, process, "done\n")
    story.run_listeners()
    story.expect_text(MARKS, "process:1", "ended", actor=story.user)
