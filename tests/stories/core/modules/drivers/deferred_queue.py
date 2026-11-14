import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.models.hook_call import HookCall
from tests.stories.core.modules.drivers.support.deferred_states import LINE, NOTES, PATH
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords

GUARD = "journal.core.settings.guard."
LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")
LONG_LISTING = HookSamples.shell("ls -l", ShellPart("ls", CommandCategory.READ, ["-l"])).with_fields(event="post_tool_use")


class JoinedAgent(StoryFixture):
    """The started builder with the sample module of one deferred state joined to the coding suite."""

    parent = BuilderStartedWithoutPlainWords
    module = ""

    def steps(self, story):
        story.expect_sync_success(f"{PATH}:{self.module}")


class QueueAgent(JoinedAgent):
    module = "QueueModuleJoining"


class LineAgent(JoinedAgent):
    module = "LineModuleJoining"


class RaisingAgent(JoinedAgent):
    module = "RaisingModuleJoining"


@pytest.fixture(autouse=True)
def no_notes():
    NOTES.clear()


def test_the_answer_of_a_hook_is_stored_before_its_deferred_command_runs(new_story):
    story = new_story(fixture=QueueAgent)
    reply = story.hook("s-1", LISTING)
    stored = story.container.get(Queries).query(HookCall).find(reply.hook_call_id)
    logged_previous = list(NOTES)
    story.run_listeners()
    story.expect_rows(stored.hook == HookEventName.POST_TOOL_USE, logged_previous == [], NOTES == ["noted"], detail=f"{logged_previous} {NOTES}")


def test_a_deferred_command_stored_before_a_restart_runs_once_after_it(new_story):
    story = new_story(fixture=QueueAgent)
    story.hook("s-1", LONG_LISTING)
    story.release_listeners()
    story.run_listeners()
    story.run_listeners()
    story.expect_rows(NOTES == ["noted"], detail=str(NOTES))


def test_a_deferred_rule_that_answers_a_line_is_recorded_as_raised_and_nothing_of_it_reaches_the_agent(new_story):
    story = new_story(fixture=LineAgent)
    reply = story.hook("s-1", LISTING)
    story.run_listeners()
    next_reply = story.hook("s-1", LONG_LISTING)
    story.expect_rows("deferred rules only run commands" in story.system_log_text(), LINE not in str(reply.lines), LINE not in str(next_reply.lines),
                      detail=f"{reply.lines} {next_reply.lines}")


def test_a_deferred_rule_that_raises_is_passed_by_and_the_other_rules_still_run(new_story):
    story = new_story(fixture=RaisingAgent)
    story.hook("s-1", LISTING)
    story.run_listeners()
    story.expect_rows("the sample rule broke" in story.system_log_text(), NOTES == ["noted"], detail=str(NOTES))


def test_driver_state_types_lists_a_deferred_state_with_its_deferred_rules(new_story):
    story = new_story(fixture=QueueAgent)
    story.expect_text("driver state-types", "acme.queue", "deferred", "acme.note", actor=story.agent)


def test_a_deferred_rule_switched_off_by_name_runs_no_command(new_story):
    story = new_story(fixture=QueueAgent)
    story.use_fixture_environment(None)
    story.expect_success(f"setting make {GUARD}acme.note false")
    story.hook("s-1", LISTING)
    story.run_listeners()
    story.expect_rows(NOTES == [], detail=str(NOTES))


def test_a_deferred_rule_that_declares_a_refusal_is_refused_at_sync(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_refusal(f"{PATH}:RefusingModuleJoining", "declares a refusal")
