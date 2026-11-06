from core.base.actor import Actor
from core.base.actor_type import ActorType
import json
import pytest

from tests.stories.core.modules.documents.delegated_sources import PlannerStarted
from tests.stories.core.modules.documents.support.trail_fixtures import Trail, viewer_answer
from tests.stories.core.modules.helpers.helper_jobs import the_helper
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail
from tests.stories.core.modules.documents.support.trail_fixtures import feature, pending, selected_trail as trail


class AttributedTask(StoryFixture):
    parent = SelectedTrail

    def steps(self, story):
        story.expect_success('task make "Correction target" --environment main')


@pytest.fixture
def attributed(new_story):
    return Trail(new_story(fixture=AttributedTask))


@pending(6888)
def test_work_source_display_is_read_only(trail):
    first = trail.requested_command("message work-source --json")
    second = trail.requested_command("message work-source --json")
    feature(first.output_text == second.output_text, "reading source changes its version or origin")
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")


@pending(6888)
def test_source_changes_are_observable(trail):
    first = trail.requested_command("message work-from 2")
    second = trail.requested_command("message work-from 1")
    feature("2" in first.output_text and "1" in second.output_text, "selection did not name its new source")
    cleared = trail.requested_command("message clear-work-source")
    feature("clear" in cleared.output_text.lower() or "none" in cleared.output_text.lower(), cleared.output_text)


@pending(6888)
def test_authorized_link_correction_keeps_other_relations(trail):
    trail.command('task edit 1 --brief "message 2"')
    trail.expect_link("message:2", "task:1", "edited")
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "edited")
    trail.requested_command(f'link remove {edge["id"]}')
    trail.expect_link("message:2", "task:1", "about")
    trail.expect_link("task:1", "message:2", "mentions")


@pending(6888)
def test_link_removal_does_not_reappear_on_retry(trail):
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")
    edge = next(row for row in trail.links("message:2") if row["target_model"] == "task" and row["target_id"] == 2)
    trail.requested_command(f'link remove {edge["id"]}')
    trail.requested_command(f'link remove {edge["id"]}')
    trail.command('task edit 2 --brief "A repeated automatic attribution attempt"')
    trail.story.run_listeners()
    feature(not any(row["target_model"] == "task" and row["target_id"] == 2 and row["link_type"] == "about" for row in trail.links("message:2")), "a corrected automatic identity reappeared")
    trail.switch(2)
    trail.command('task edit 2 --brief "Explicit attribution after correction"')
    trail.expect_link("message:2", "task:2", "about")


@pending(6888)
def test_unauthorized_link_correction_changes_nothing(trail):
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "comments_on")
    helper_id = trail.story.new_row_id(f"agent start correction-helper claude helper --parent {trail.story.agent.id} --environment main")
    result = trail.story.run(f'link remove {edge["id"]}', actor=Actor(helper_id, ActorType.AGENT))
    feature(result.code == 1, result.output_text)
    trail.expect_link("message:2", "message:1", "comments_on")


def test_helper_display_names_its_job_source_without_reading_private_text(new_story):
    helper_trail = Trail(new_story(fixture=PlannerStarted))
    helper_trail.switch(1)
    helper = the_helper(helper_trail.story)
    answer = helper_trail.story.run("message work-source --json", actor=Actor(helper.id, ActorType.AGENT))
    assert answer.code == 0, answer.output_text
    source = json.loads(answer.output_text)
    assert source["message_id"] == 2
    assert source["selecting_actor_id"] == helper_trail.story.agent.id
    assert source["origin"] == "job snapshot"
    assert source["environment_id"] == 1
    assert "Implement the cart request" not in answer.output_text


def test_another_agent_cannot_remove_an_automatic_link(attributed):
    trail = attributed
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "about")
    helper_id = trail.story.new_row_id(f"agent start correction-helper claude helper --parent {trail.story.agent.id} --environment main")
    answer = trail.story.run(f'link remove {edge["id"]}', actor=Actor(helper_id, ActorType.AGENT))
    assert answer.code == 1
    trail.expect_link("message:2", "task:2", "about")


def test_person_can_correct_an_automatic_link_through_chat_permission(attributed):
    trail = attributed
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "about")
    answer = viewer_answer(trail.story, "messages.chat", ["link", "remove", str(edge["id"])])
    assert answer.code == 0, answer.error
    trail.expect_no_link("message:2", "task:2")


@pytest.mark.parametrize("relation", ["comments_on", "mentions"])
def test_correction_refuses_non_attribution_relations(trail, relation):
    trail.command('task edit 1 --brief "A reference to message 2"')
    reference = "message:2" if relation == "comments_on" else "task:1"
    edge = next(row for row in trail.links(reference) if row["link_type"] == relation)
    answer = trail.story.run(f'link remove {edge["id"]}')
    assert answer.code == 1
    assert "about" in answer.output_text and "edited" in answer.output_text
    assert any(row["id"] == edge["id"] for row in trail.links(reference))


def test_correction_does_not_block_a_different_target_or_relation(attributed):
    trail = attributed
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "about")
    trail.requested_command(f'link remove {edge["id"]}')
    trail.command('task edit 2 --brief "Changed after correction"')
    trail.expect_link("message:2", "task:2", "edited")
    trail.command('plan make "Another resource" --environment main')
    trail.expect_link("message:2", "plan:2", "about")


def test_clearing_source_keeps_historical_attribution(attributed):
    trail = attributed
    trail.requested_command("message clear-work-source")
    trail.expect_link("message:2", "task:2", "about")
    trail.command('task edit 2 --brief "Unsourced change"')
    assert not any(row["link_type"] == "edited" for row in trail.links("message:2"))
