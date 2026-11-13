from tests.stories.core.modules.tasks.assigned_reads import TwoWorkersFourTasks, assign, worker_w
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_the_tasks_window_shows_each_assignee_with_its_icon_and_a_click_opens_an_agent_but_not_a_person(new_story):
    story = new_story(fixture=TwoWorkersFourTasks)
    story.run(f"setting set {TOUR_COMPLETED} true --project")
    assign(story, 1, story.agent)
    assign(story, 2, worker_w(story))
    assign(story, 3, story.user)
    with server_story(story) as server:
        expect_browser(server, "taskAssignee.browser.mjs", ["/tmp/journal-task-assignee", str(worker_w(story).id)])
