from core.base.actor import Actor
from core.base.actor_type import ActorType
import pytest

from core.testing.story_fixture import StoryFixture
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail, Trail, feature, pending
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.modules.helpers.helper_jobs import the_helper


class PlannerStarted(StoryFixture):
    parent = SelectedTrail

    def steps(self, story) -> None:
        started(story, 'helper start journal-planner --brief "Plan the cart request" --model sonnet --environment main')


@pytest.fixture
def trail(new_story):
    return Trail(new_story(fixture=PlannerStarted))


def helper_plan(trail, helper_id: int, title: str) -> None:
    actor = Actor(helper_id, ActorType.AGENT)
    trail.story.expect_success(f'plan make "{title}" --environment main', actor=actor)
    trail.story.run_listeners()


@pending(6887)
def test_planner_helper_creates_plan_for_parent_comment(trail):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "Planned by the helper")
    trail.expect_link("message:2", "plan:2", "about")


@pending(6887)
def test_parent_changes_do_not_change_dispatched_source(trail):
    helper_id = the_helper(trail.story).id
    trail.switch(1)
    helper_plan(trail, helper_id, "Original helper assignment")
    trail.expect_link("message:2", "plan:2", "about")
    trail.expect_no_link("message:1", "plan:2")


@pending(6887)
def test_helper_followups_keep_separate_request_boundaries(trail):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "First helper job")
    trail.switch(1)
    trail.command(f'helper send {helper_id} "Now plan the original request"')
    trail.story.tick(the_helper(trail.story).session)
    helper_plan(trail, helper_id, "Second helper job")
    trail.expect_link("message:2", "plan:2", "about")
    trail.expect_link("message:1", "plan:3", "about")
    trail.expect_no_link("message:1", "plan:2")


@pending(6887)
def test_resumed_helper_does_not_reuse_previous_request(trail):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "First sourced helper assignment")
    trail.expect_link("message:2", "plan:2", "about")
    trail.story.expect_success(f"agent end {helper_id}")
    trail.requested_command("message clear-work-source")
    trail.command(f'helper send {helper_id} "A separate unsourced job"')
    trail.story.hook(the_helper(trail.story).session, HookSamples.session_start())
    helper_plan(trail, helper_id, "Unrelated resumed work")
    trail.expect_no_link("message:2", "plan:3")


@pending(6887)
def test_delegated_context_does_not_expose_unrelated_messages(trail):
    helper_id = the_helper(trail.story).id
    trail.person("messages.chat", "message", "send", "Private unrelated request")
    helper_plan(trail, helper_id, "Scoped helper plan")
    trail.expect_link("message:2", "plan:2", "about")
    result = trail.story.run("message read 3", actor=Actor(helper_id, ActorType.AGENT))
    feature(result.code == 1 and "Private unrelated request" not in result.output_text, result.output_text)
