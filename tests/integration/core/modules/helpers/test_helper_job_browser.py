from tests.stories.core.support.agent_labels import agent_number
import json

from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.integration.core.modules.helpers.test_helper_jobs import EndedHelper, StartedHelper, helper_agent, resumable_session
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE






def test_resumed_helper_shows_its_new_job(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "Review plan 1093"', actor=story.agent)
    launcher.drain_requests()
    launcher.server.close()
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job"] == "Review plan 1093")




def test_a_title_given_with_a_new_job_replaces_the_title_of_the_helper(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "Review plan 1093" --title "Plan review"', actor=story.agent)
    launcher.drain_requests()
    launcher.server.close()
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job_title"] == "Plan review")
