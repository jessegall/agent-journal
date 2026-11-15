import pytest

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.drivers.support.deferred_states import NOTES, PATH
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
