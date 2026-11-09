import pytest

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.helpers.helper_jobs import resumable_session
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


@pytest.fixture
def agent_task_server(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main", actor=story.user)
    repository_environment(story)
    first = story.new_row_id('task make "First calculation" --brief "Check the cart calculation"', actor=story.agent)
    worker_id = story.new_row_id(f"worker dispatch --model sonnet {first}", actor=story.agent)
    story.expect_success(f"agent end {worker_id}", actor=story.user)
    task_id = story.new_row_id('task make "Check rounding" --brief "Check the rounding calculation"', actor=story.agent)
    worker = story.container.get(Queries).query(Agent).find(worker_id)
    resumable_session(story, worker, monkeypatch)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, cookie, worker_id, task_id


def test_an_idle_worker_takes_an_open_task_through_the_agents_window(agent_task_server):
    server, cookie, worker, task = agent_task_server
    def line(command):
        return server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": command})
    row = line(["agent", "cards", "--show", "idle"])["rows"][0]
    server.story.expect_rows(row["id"] == worker and row["job_command"] == ["worker", "send"])
    server.story.expect_rows(row["job_task_flag"] == "--task" and row["resume_reason"] is None)
    line(["worker", "send", str(worker), "--task", str(task)])
    assigned = server.story.container.get(Queries).query(Task).find(task)
    server.story.expect_rows(assigned.delegated_to == worker)


def test_the_worker_task_picker_in_light_and_dark(agent_task_server):
    server, _, worker, task = agent_task_server
    expect_browser(server, "agentTask.browser.mjs", [str(worker), str(task), "/tmp/worker-675-agent-task"])
    server.story.expect_rows(server.story.container.get(Queries).query(Task).find(task).delegated_to == worker)
