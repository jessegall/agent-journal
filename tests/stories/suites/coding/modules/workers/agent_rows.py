import json

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator, BuilderHelper
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_an_ended_worker_waiting_for_a_job_shows_in_the_idle_agents_list(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task cancel 1 --reason "Withdrawn"', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    idle = json.loads(story.run("agent cards --environment main --show idle --json", actor=story.agent).output_text)["rows"]
    expect_id_cards(idle, [worker.id])


def test_the_agent_cards_list_a_helper_and_never_the_main_agent(new_story):
    story = new_story(fixture=BuilderHelper)
    cards = json.loads(story.run("agent cards --environment main --show all --json", actor=story.agent).output_text)["rows"]
    expect_id_cards(cards, [story.helper.id])


def expect_id_cards(cards, expected) -> None:
    actual = [row['id'] for row in cards]
    assert actual == expected, actual
