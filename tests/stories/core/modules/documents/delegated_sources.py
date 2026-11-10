from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
import pytest
import json

from core.testing.story_fixture import StoryFixture
from core.testing.hook_samples import HookSamples
from core.base.driver.tool_type import ToolType
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail, Scenario, feature
from tests.stories.core.modules.helpers.start_helper import started
from tests.stories.core.modules.helpers.helper_jobs import resumable_session, helper_agent


class PlannerStarted(StoryFixture):
    parent = SelectedTrail

    def steps(self, story) -> None:
        started(story, 'helper start journal-planner --brief "Plan the cart request" --model sonnet --environment main')


@pytest.fixture
def scenario(new_story):
    return Scenario(new_story(fixture=PlannerStarted))


def helper_plan(scenario, helper_id: int, title: str) -> None:
    actor = Actor(helper_id, ActorType.AGENT)
    scenario.story.expect_success(f'plan make "{title}" --environment main', actor=actor)
    scenario.story.run_listeners()


def test_parent_changes_do_not_change_dispatched_source(scenario):
    helper_id = helper_agent(scenario.story).id
    scenario.switch(1)
    helper_plan(scenario, helper_id, "Original helper assignment")
    scenario.expect_link("message:2", "plan:2", "about")
    scenario.expect_no_link("message:1", "plan:2")


def test_helper_followups_keep_separate_request_boundaries(scenario):
    helper_id = helper_agent(scenario.story).id
    helper_plan(scenario, helper_id, "First helper job")
    scenario.switch(1)
    scenario.command(f'helper send {helper_id} "Now plan the original request" --steer')
    helper_plan(scenario, helper_id, "Work already in flight")
    scenario.expect_link("message:2", "plan:3", "about")
    reply = scenario.story.hook(helper_agent(scenario.story).session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    line_id = next(line.split(":", 1)[1].split(":", 1)[0] for line in reply.lines if line.startswith("agent-line:"))
    scenario.story.expect_text(f"agent-line show {line_id}", "Now plan the original request", actor=Actor(helper_id, ActorType.AGENT))
    helper_plan(scenario, helper_id, "Second helper job")
    scenario.expect_link("message:2", "plan:2", "about")
    scenario.expect_link("message:1", "plan:4", "about")
    scenario.expect_no_link("message:1", "plan:2")


def test_resumed_helper_does_not_reuse_previous_request(scenario, monkeypatch):
    helper_id = helper_agent(scenario.story).id
    helper_plan(scenario, helper_id, "First sourced helper assignment")
    scenario.expect_link("message:2", "plan:2", "about")
    scenario.story.expect_success(f"agent end {helper_id}")
    resumable_session(scenario.story, helper_agent(scenario.story), monkeypatch)
    scenario.requested_command("message clear-work-source")
    scenario.command(f'helper send {helper_id} "A separate unsourced job"')
    scenario.story.hook(helper_agent(scenario.story).session, HookSamples.session_start())
    helper_plan(scenario, helper_id, "Unrelated resumed work")
    scenario.expect_no_link("message:2", "plan:3")


def test_delegated_context_does_not_expose_unrelated_messages(scenario):
    helper_id = helper_agent(scenario.story).id
    scenario.person("messages.chat", "message", "send", "Private unrelated request")
    helper_plan(scenario, helper_id, "Scoped helper plan")
    scenario.expect_link("message:2", "plan:2", "about")
    outcome = scenario.story.run("message read 3", actor=Actor(helper_id, ActorType.AGENT))
    feature(outcome.code == 1 and "Private unrelated request" not in outcome.output_text, outcome.output_text)


def test_deleted_helper_source_is_not_a_new_message_reusing_its_number(new_story):
    scenario = Scenario(new_story(fixture=SelectedTrail))
    original = scenario.person("messages.chat", "message", "send", "Temporary helper request")
    scenario.switch(original["id"])
    started(scenario.story, 'helper start journal-planner --brief "Plan the temporary request" --model sonnet --environment main')
    helper_id = helper_agent(scenario.story).id
    scenario.person("messages.chat", "message", "delete", str(original["id"]))
    replacement = scenario.person("messages.chat", "message", "send", "A different helper request")
    scenario.story.expect_rows(replacement["id"] == original["id"])
    scenario.switch(replacement["id"])
    helper_plan(scenario, helper_id, "Output from the deleted assignment")
    scenario.expect_no_link(f'message:{replacement["id"]}', "plan:2")
    scenario.command(f'helper send {helper_id} "Now handle the replacement request" --steer')
    scenario.story.hook(helper_agent(scenario.story).session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    helper_plan(scenario, helper_id, "Output from the new assignment")
    scenario.expect_link(f'message:{replacement["id"]}', "plan:3", "about")


def test_helper_context_cannot_read_a_replacement_for_its_deleted_source(new_story):
    scenario = Scenario(new_story(fixture=PlannerStarted))
    helper_id = helper_agent(scenario.story).id
    scenario.story.expect_success('task make "Helper context" --environment main', actor=Actor(helper_id, ActorType.AGENT))
    scenario.person("messages.chat", "message", "delete", "2")
    replacement = scenario.person("messages.chat", "message", "send", "A private replacement request")
    scenario.story.expect_rows(replacement["id"] == 2)
    scenario.switch(2)
    scenario.command('task edit 2 --brief "A new request now links to this task"')
    answer = scenario.story.run("task context 2 --json", actor=Actor(helper_id, ActorType.AGENT))
    scenario.story.expect_rows(answer.code == 0, detail=answer.output_text)
    page = json.loads(answer.output_text)
    scenario.story.expect_rows("A private replacement request" not in answer.output_text)
    scenario.story.expect_rows(any(row["model"] == "message" and row["id"] == 2 and row["unavailable"] for row in page["references"]))
    refused = scenario.story.run("task context 2 --message 2 --text-offset 0 --json", actor=Actor(helper_id, ActorType.AGENT))
    scenario.story.expect_rows(refused.code == 1, "A private replacement request" not in refused.output_text)
