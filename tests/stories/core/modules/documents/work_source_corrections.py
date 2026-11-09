from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.event_log import EventLog
from core.base.command.bus import Bus
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
import json
import pytest

from tests.stories.core.modules.documents.delegated_sources import PlannerStarted
from tests.stories.core.modules.documents.support.trail_fixtures import Scenario, viewer_answer, LinkedTrail
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.documents.support.trail_fixtures import SelectedTrail
from tests.stories.core.modules.documents.support.trail_fixtures import feature, selected_scenario as scenario


class AttributedTask(StoryFixture):
    parent = SelectedTrail

    def steps(self, story):
        story.expect_success('task make "Correction target" --environment main', actor=story.agent)


class CorrectedTask(StoryFixture):
    parent = AttributedTask

    def steps(self, story):
        scenario = Scenario(story)
        edge = next(row for row in scenario.links("message:2") if row["link_type"] == "about")
        scenario.requested_command(f'link remove {edge["id"]}')


@pytest.fixture
def attributed(new_story):
    return Scenario(new_story(fixture=AttributedTask))


def test_work_source_display_is_read_only(scenario):
    first = scenario.requested_command("message work-source --json")
    second = scenario.requested_command("message work-source --json")
    feature(first.output_text == second.output_text, "reading source changes its version or origin")
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")


def test_source_changes_are_observable(scenario):
    first = scenario.requested_command("message work-from 2")
    second = scenario.requested_command("message work-from 1")
    feature("2" in first.output_text and "1" in second.output_text, "selection did not name its new source")
    cleared = scenario.requested_command("message clear-work-source")
    feature("clear" in cleared.output_text.lower() or "none" in cleared.output_text.lower(), cleared.output_text)


def test_authorized_link_correction_keeps_other_relations(scenario):
    scenario.command('task edit 1 --brief "message 2"')
    scenario.expect_link("message:2", "task:1", "edited")
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "edited")
    scenario.requested_command(f'link remove {edge["id"]}')
    scenario.expect_link("message:2", "task:1", "about")
    scenario.expect_link("task:1", "message:2", "mentions")


def test_link_removal_does_not_reappear_on_retry(scenario):
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")
    edge = next(row for row in scenario.links("message:2") if row["target_model"] == "task" and row["target_id"] == 2)
    scenario.requested_command(f'link remove {edge["id"]}')
    scenario.requested_command(f'link remove {edge["id"]}')
    scenario.command('task edit 2 --brief "A repeated automatic attribution attempt"')
    scenario.story.run_listeners()
    feature(not any(row["target_model"] == "task" and row["target_id"] == 2 and row["link_type"] == "about" for row in scenario.links("message:2")), "a corrected automatic identity reappeared")
    scenario.switch(2)
    scenario.command('task edit 2 --brief "Explicit attribution after correction"')
    scenario.expect_link("message:2", "task:2", "about")


def test_unauthorized_link_correction_changes_nothing(scenario):
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "comments_on")
    helper_id = scenario.story.new_row_id(f"agent start correction-helper claude helper --parent {scenario.story.agent.id} --environment main")
    outcome = scenario.story.run(f'link remove {edge["id"]}', actor=Actor(helper_id, ActorType.AGENT))
    feature(outcome.code == 1, outcome.output_text)
    scenario.expect_link("message:2", "message:1", "comments_on")


def test_helper_display_names_its_job_source_without_reading_private_text(new_story):
    helper_scenario = Scenario(new_story(fixture=PlannerStarted))
    helper_scenario.switch(1)
    helper = helper_agent(helper_scenario.story)
    answer = helper_scenario.story.run("message work-source --json", actor=Actor(helper.id, ActorType.AGENT))
    helper_scenario.story.expect_rows(answer.code == 0, detail=answer.output_text)
    source = json.loads(answer.output_text)
    helper_scenario.story.expect_rows(source["message_id"] == 2)
    helper_scenario.story.expect_rows(source["selecting_actor_id"] == helper_scenario.story.agent.id)
    helper_scenario.story.expect_rows(source["origin"] == "job snapshot")
    helper_scenario.story.expect_rows(source["environment_id"] == 1)
    helper_scenario.story.expect_rows("Implement the cart request" not in answer.output_text)


def test_another_agent_cannot_remove_an_automatic_link(attributed):
    scenario = attributed
    helper_id = scenario.story.new_row_id(f"agent start correction-helper claude helper --parent {scenario.story.agent.id} --environment main")
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "about")
    answer = scenario.story.run(f'link remove {edge["id"]}', actor=Actor(helper_id, ActorType.AGENT))
    scenario.story.expect_rows(answer.code == 1)
    scenario.expect_link("message:2", "task:2", "about")


@pytest.mark.parametrize("relation", ["comments_on", "mentions"])
def test_correction_refuses_non_attribution_relations(scenario, relation):
    scenario.command('task edit 1 --brief "A reference to message 2"')
    reference = "message:2" if relation == "comments_on" else "task:1"
    edge = next(row for row in scenario.links(reference) if row["link_type"] == relation)
    answer = scenario.story.run(f'link remove {edge["id"]}', actor=scenario.story.agent)
    scenario.story.expect_rows(answer.code == 1)
    scenario.story.expect_rows("about" in answer.output_text, "edited" in answer.output_text)
    scenario.story.expect_rows(any(row["id"] == edge["id"] for row in scenario.links(reference)))


def test_correction_does_not_block_a_different_target_or_relation(attributed):
    scenario = attributed
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "about")
    scenario.requested_command(f'link remove {edge["id"]}')
    scenario.command('task edit 2 --brief "Changed after correction"')
    scenario.expect_link("message:2", "task:2", "edited")
    scenario.command('plan make "Another resource" --environment main')
    scenario.expect_link("message:2", "plan:2", "about")


def test_clearing_source_keeps_historical_attribution(attributed):
    scenario = attributed
    scenario.requested_command("message clear-work-source")
    scenario.expect_link("message:2", "task:2", "about")
    scenario.command('task edit 2 --brief "Unsourced change"')
    scenario.story.expect_rows(not any(row["link_type"] == "edited" for row in scenario.links("message:2")))


def test_correction_survives_the_deferred_subject_writer(new_story):
    scenario = Scenario(new_story(fixture=CorrectedTask))
    scenario.story.container.get(Bus).run(RecordSubjectLink(2, "task", 2), scenario.story.agent, environment_id=1)
    scenario.expect_no_link("message:2", "task:2")
    events = [event for event in scenario.story.container.get(EventLog).events_after(0) if event.event == "link.delete"]
    scenario.story.expect_rows(sum(event.event == "link.delete" for event in events) == 1)


def test_repeated_explicit_selection_allows_attribution_even_before_first_use(new_story):
    scenario = Scenario(new_story(fixture=LinkedTrail))
    scenario.switch(2)
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "about")
    scenario.requested_command(f'link remove {edge["id"]}')
    scenario.switch(2)
    scenario.command('task edit 1 --brief "Deliberately attribute this change"')
    scenario.expect_link("message:2", "task:1", "about")


def test_correction_commands_explain_their_limits(scenario):
    source = scenario.story.run("message work-source --help", actor=scenario.story.agent)
    scenario.story.expect_rows(source.code == 0, "without changing" in source.output_text)
    correction = scenario.story.run("link remove --help", actor=scenario.story.agent)
    scenario.story.expect_rows(correction.code == 0, "about" in correction.output_text, "edited" in correction.output_text)


def test_attributed_resource_exposes_its_source_reference(scenario):
    created = scenario.command('task make "An observable attribution" --environment main')
    scenario.story.expect_rows("link:" in created.output_text)
    shown = scenario.command("task show 2")
    scenario.story.expect_rows("message:2" in shown.output_text)
    scenario.story.expect_rows("Implement the cart request" not in shown.output_text)


def test_correction_cannot_reach_another_environment(attributed, tmp_path):
    scenario = attributed
    scenario.person("viewer.shell", "environment", "make", "side", str(tmp_path))
    edge = next(row for row in scenario.links("message:2") if row["link_type"] == "about")
    answer = viewer_answer(scenario.story, "viewer.shell", ["link", "remove", str(edge["id"])], "side")
    scenario.story.expect_rows(answer.code == 1)
    scenario.expect_link("message:2", "task:2", "about")


def test_corrected_link_number_cannot_be_reused_by_another_attribution(attributed):
    scenario = attributed
    scenario.command('task edit 2 --brief "The attribution to correct"')
    removed = next(row for row in scenario.links("message:2") if row["link_type"] == "edited")
    scenario.requested_command(f'link remove {removed["id"]}')
    scenario.command('plan make "A separate attribution" --environment main')
    replacement = next(row for row in scenario.links("message:2") if row["target_model"] == "plan")
    scenario.story.expect_rows(replacement["id"] != removed["id"])
    scenario.requested_command(f'link remove {removed["id"]}')
    scenario.expect_link("message:2", "plan:2", "about")
    scenario.requested_command(f'link remove {replacement["id"]}')
    scenario.expect_no_link("message:2", "plan:2")
