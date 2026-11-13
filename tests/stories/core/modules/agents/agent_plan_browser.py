import pytest
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.core.support.plan_steps import state_tasks_wait_on_nothing


@pytest.mark.real_git
def test_a_plan_workers_card_names_its_plan_in_place_of_its_tasks_and_opens_it(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('plan make "Release work" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "Build" --goal "Finish"', actor=story.user)
    task = story.new_row_id('task make "Build it" --brief "Build the release" --phase 1 --environment main')
    story.expect_success('task make "Check it" --brief "Check the release" --phase 1 --environment main')
    state_tasks_wait_on_nothing(story, story.agent, 1)
    story.expect_success("plan ready 1", actor=story.agent)
    story.expect_success("plan approve 1 --environment main", actor=story.user)
    story.expect_success("driver choose coding.main --environment main", actor=story.user)
    repository_environment(story)
    worker = story.new_row_id(f'worker dispatch --test-command python=pytest --model sonnet --name "Lady Lovelace" {task}', actor=story.agent)
    with server_story(story, listener_thread_started=False) as server:
        expect_browser(server, "agentPlan.browser.mjs", [str(worker), str(tmp_path / "agent-plan.png")])
