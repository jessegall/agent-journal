from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from tests.stories.core.modules.helpers.kept_agents import helper_form_server
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.core.support.agent_labels import agent_number

TEST_ROWS_REASON = "the test reads every row it checks"


def agent_line(server, cookie, line):
    return server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": line})


def test_an_idle_helper_takes_its_next_job_through_the_agents_window(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    agent_line(server, cookie, ["helper", "send", str(agent_number(server.story, helper.id)), "Read the rounding calculation"])
    jobs = tuple(server.story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).every_row(TEST_ROWS_REASON))
    server.story.expect_rows(jobs[-1].brief == "Read the rounding calculation")
    server.story.expect_rows({job.helper_id for job in jobs} == {helper.id})


def test_an_idle_helper_is_retired_with_its_reason_through_the_agents_window(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    agent_line(server, cookie, ["agent", "retire", str(agent_number(server.story, helper.id)), "--reason", "Its question is answered"])
    agent = server.story.container.get(Queries).query(Agent).find(helper.id)
    server.story.expect_rows(agent.retired_at is not None and agent.retirement_reason == "Its question is answered")


def test_an_idle_helper_and_a_retired_agent_open_the_same_view_without_a_row_of_buttons(helper_form_server):
    server, helper = helper_form_server
    story = server.story
    retired = story.new_row_id("agent start finished-reviewer claude reviewer --environment main")
    story.expect_success(f"agent end {retired}", actor=story.user)
    story.expect_success(f'agent retire {agent_number(story, retired)} --reason "Its question is answered"', actor=story.user)
    expect_browser(server, "agentActions.browser.mjs", [str(helper.id), str(retired), "/tmp/worker-675-agent-actions"])
