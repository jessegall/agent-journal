import pytest

from engine.enums.command_category import CommandCategory
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.models.hook_call import HookCall
from tests.stories.core.modules.drivers.support.substate_states import OPENED, PARENT_OPEN, PATH
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords

LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


class SubstateAgent(StoryFixture):
    """The started builder with the sample parent state and its substate joined to the coding suite."""

    parent = BuilderStartedWithoutPlainWords

    def steps(self, story):
        story.expect_sync_success(f"{PATH}:SubstateModuleJoining")


@pytest.fixture(autouse=True)
def parent_closed():
    PARENT_OPEN[0] = False
    OPENED.clear()


def recorded(story, sample) -> dict[str, dict]:
    reply = story.hook("s-1", sample)
    rows = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    return {row["rule"]: row for row in rows}


def test_a_substates_rule_is_asked_when_its_parent_is_open(new_story):
    story = new_story(fixture=SubstateAgent)
    PARENT_OPEN[0] = True
    rows = recorded(story, LISTING)
    story.expect_rows("milliseconds" in rows["acme.child-rule"], "milliseconds" in rows["acme.parent-rule"], OPENED.count("acme.child") == 1, detail=f"{rows} {OPENED}")


def test_a_closed_parent_silences_its_substate_whose_opener_does_not_run(new_story):
    story = new_story(fixture=SubstateAgent)
    rows = recorded(story, LISTING)
    story.expect_rows(rows["acme.child-rule"]["outcome"] == "allowed", "milliseconds" not in rows["acme.child-rule"], "acme.child" not in OPENED, "acme.parent" in OPENED, detail=f"{rows} {OPENED}")
