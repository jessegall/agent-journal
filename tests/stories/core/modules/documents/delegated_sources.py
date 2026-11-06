from core.base.actor import Actor
from core.base.actor_type import ActorType
import pytest
import json

from core.testing.story_fixture import StoryFixture
from core.testing.hook_samples import HookSamples
from core.base.driver.tool_type import ToolType
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail, Trail, feature
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.modules.helpers.helper_jobs import resumable_session, the_helper


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


def test_planner_helper_creates_plan_for_parent_comment(trail):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "Planned by the helper")
    trail.expect_link("message:2", "plan:2", "about")


def test_parent_changes_do_not_change_dispatched_source(trail):
    helper_id = the_helper(trail.story).id
    trail.switch(1)
    helper_plan(trail, helper_id, "Original helper assignment")
    trail.expect_link("message:2", "plan:2", "about")
    trail.expect_no_link("message:1", "plan:2")


def test_helper_followups_keep_separate_request_boundaries(trail):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "First helper job")
    trail.switch(1)
    trail.command(f'helper send {helper_id} "Now plan the original request"')
    helper_plan(trail, helper_id, "Work already in flight")
    trail.expect_link("message:2", "plan:3", "about")
    reply = trail.story.hook(the_helper(trail.story).session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    assert any("Now plan the original request" in line for line in reply.lines), reply.lines
    helper_plan(trail, helper_id, "Second helper job")
    trail.expect_link("message:2", "plan:2", "about")
    trail.expect_link("message:1", "plan:4", "about")
    trail.expect_no_link("message:1", "plan:2")


def test_resumed_helper_does_not_reuse_previous_request(trail, monkeypatch):
    helper_id = the_helper(trail.story).id
    helper_plan(trail, helper_id, "First sourced helper assignment")
    trail.expect_link("message:2", "plan:2", "about")
    trail.story.expect_success(f"agent end {helper_id}")
    resumable_session(trail.story, the_helper(trail.story), monkeypatch)
    trail.requested_command("message clear-work-source")
    trail.command(f'helper send {helper_id} "A separate unsourced job"')
    trail.story.hook(the_helper(trail.story).session, HookSamples.session_start())
    helper_plan(trail, helper_id, "Unrelated resumed work")
    trail.expect_no_link("message:2", "plan:3")


def test_delegated_context_does_not_expose_unrelated_messages(trail):
    helper_id = the_helper(trail.story).id
    trail.person("messages.chat", "message", "send", "Private unrelated request")
    helper_plan(trail, helper_id, "Scoped helper plan")
    trail.expect_link("message:2", "plan:2", "about")
    result = trail.story.run("message read 3", actor=Actor(helper_id, ActorType.AGENT))
    feature(result.code == 1 and "Private unrelated request" not in result.output_text, result.output_text)


def test_deleted_helper_source_is_not_a_new_message_reusing_its_number(new_story):
    trail = Trail(new_story(fixture=SelectedTrail))
    original = trail.person("messages.chat", "message", "send", "Temporary helper request")
    trail.switch(original["id"])
    started(trail.story, 'helper start journal-planner --brief "Plan the temporary request" --model sonnet --environment main')
    helper_id = the_helper(trail.story).id
    trail.person("messages.chat", "message", "delete", str(original["id"]))
    replacement = trail.person("messages.chat", "message", "send", "A different helper request")
    assert replacement["id"] == original["id"]
    trail.switch(replacement["id"])
    helper_plan(trail, helper_id, "Output from the deleted assignment")
    trail.expect_no_link(f'message:{replacement["id"]}', "plan:2")
    trail.command(f'helper send {helper_id} "Now handle the replacement request"')
    trail.story.hook(the_helper(trail.story).session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    helper_plan(trail, helper_id, "Output from the new assignment")
    trail.expect_link(f'message:{replacement["id"]}', "plan:3", "about")


def test_helper_context_cannot_read_a_replacement_for_its_deleted_source(new_story):
    trail = Trail(new_story(fixture=PlannerStarted))
    helper_id = the_helper(trail.story).id
    trail.story.expect_success('task make "Helper context" --environment main', actor=Actor(helper_id, ActorType.AGENT))
    trail.person("messages.chat", "message", "delete", "2")
    replacement = trail.person("messages.chat", "message", "send", "A private replacement request")
    assert replacement["id"] == 2
    trail.switch(2)
    trail.command('task edit 2 --brief "A new request now links to this task"')
    answer = trail.story.run("task context 2 --json", actor=Actor(helper_id, ActorType.AGENT))
    assert answer.code == 0, answer.output_text
    page = json.loads(answer.output_text)
    assert "A private replacement request" not in answer.output_text
    assert any(row["model"] == "message" and row["id"] == 2 and row["unavailable"] for row in page["references"])
    refused = trail.story.run("task context 2 --message 2 --text-offset 0 --json", actor=Actor(helper_id, ActorType.AGENT))
    assert refused.code == 1 and "A private replacement request" not in refused.output_text
