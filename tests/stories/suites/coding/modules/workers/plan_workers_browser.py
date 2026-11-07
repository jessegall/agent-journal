from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story
from tests.stories.suites.coding.modules.workers.test_queue import recording_launch


def test_a_delegated_plan_shows_its_agent_on_the_plan_bar_the_plan_page_the_tasks_and_the_agent_card(new_story, monkeypatch):
    story = planned_story(new_story)
    recording_launch(monkeypatch)
    worker = Actor(story.new_row_id('worker dispatch --model sonnet --plan 1 --phase 1 --name "Lady Lovelace"', actor=story.agent), ActorType.AGENT)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "planWorkers.browser.mjs", [str(worker.id), "/tmp/journal-worker-530-plan-workers"])
