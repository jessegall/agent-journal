import pytest

from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted

LINKED_TASKS = 12
COMMANDS = ["doc", "report"]


TASK_REFS = " ".join(f"task:{number}" for number in range(1, LINKED_TASKS + 1))
TEXT_OPTIONS = f'--abstract "The totals" --body "## Totals\\n- in cents\\nnothing else" --about {TASK_REFS}'


class LinkedTexts(StoryFixture):
    """Tasks 1 to 12 are open, and the first doc and the first report are each about all of them."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        for number in range(1, LINKED_TASKS + 1):
            story.run(f'task make "Task {number}" --environment main', actor=story.agent)
        story.run(f'doc make "The totals" {TEXT_OPTIONS}', actor=story.agent)
        story.run(f'report make "The totals" {TEXT_OPTIONS}', actor=story.agent)
        story.run_listeners()

    def expect(self, story: Story) -> None:
        story.expect_text("doc show 1 --all", "task:12", actor=story.agent)
        story.expect_text("report show 1 --all", "task:12", actor=story.agent)


def test_a_shown_row_lists_what_it_links_to_and_what_links_to_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.expect_success('report make "The totals" --abstract "The totals" --body "See task:1" --about tasks:1', "report 1: The totals, about task:1", actor=story.agent)
    story.run_listeners()
    story.expect_text("report show 1", "links: task:1", actor=story.agent)
    story.expect_text("task show 1", "links: report:1", actor=story.agent)


@pytest.mark.parametrize("command", COMMANDS)
@pytest.mark.parametrize("flags, read_text", [("--section 1", "1. Totals"), ("--section 1 --bullets", "- in cents"), ("--bullets", "1  Totals"), ("--grep cents", "1 Totals: - in cents")])
def test_reading_a_part_of_a_text_prints_no_links(new_story, command, flags, read_text):
    story = new_story(fixture=LinkedTexts)
    story.expect_text(f"{command} show 1 {flags}", read_text, actor=story.agent)
    story.expect_no_text(f"{command} show 1 {flags}", "links:", "more links", "task:1", actor=story.agent)


@pytest.mark.parametrize("command", COMMANDS)
def test_the_outline_prints_ten_links_and_how_many_more_there_are(new_story, command):
    story = new_story(fixture=LinkedTexts)
    story.expect_text(f"{command} show 1", "links: task:1, task:2, task:3, task:4, task:5, task:6, task:7, task:8, task:9, task:10\n", "2 more links: journal link list --row", actor=story.agent)
    story.expect_no_text(f"{command} show 1", "task:11", actor=story.agent)


@pytest.mark.parametrize("command", COMMANDS)
def test_all_prints_every_link(new_story, command):
    story = new_story(fixture=LinkedTexts)
    story.expect_text(f"{command} show 1 --all", "task:10, task:11, task:12", actor=story.agent)
    story.expect_no_text(f"{command} show 1 --all", "more links", actor=story.agent)


@pytest.mark.parametrize("command", COMMANDS)
def test_json_prints_the_row_without_link_lines(new_story, command):
    story = new_story(fixture=LinkedTexts)
    story.expect_no_text(f"{command} show 1 --json", "links:", "more links", actor=story.agent)


def test_a_new_report_and_a_new_plan_are_docked(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('report make "The totals" --abstract "The totals" --body "text"', "report 1: The totals", actor=story.agent)
    story.expect_success('plan make "The rebuild" --brief "all of it" --environment main', "state: draft", actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list", "documents.report", "plans.draft", actor=story.agent)
