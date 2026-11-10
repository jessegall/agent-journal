import json

from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, StartedHelper, helper_agent
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_running_helper_job_is_in_the_agents_window(new_story, tmp_path):
    story = new_story(fixture=StartedHelper)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    helper = helper_agent(story)
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job"] == "Read src/cart.py")
    with server_story(story) as server:
        expect_browser(server, "helperJob.browser.mjs", [str(helper.id), str(tmp_path / "helper-job.png")])


def test_ended_helper_keeps_its_last_job(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job"] == "Read src/cart.py")


def test_resumed_helper_shows_its_new_job(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "Review plan 1093"', actor=story.agent)
    launcher.drain_requests()
    launcher.server.close()
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job"] == "Review plan 1093")


def test_a_title_given_when_a_helper_is_started_is_saved_and_shown(new_story):
    story = new_story(fixture=StartedHelper)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success('helper start journal-researcher --brief "Read src/cart.py and its tests" --title "Cart review" --fresh "another file" --environment main', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    titled = [row for row in rows if row["role"] == "helper" and row["helper_job_title"] == "Cart review"]
    story.expect_rows(len(titled) == 1, titled[0]["helper_job"] == "Read src/cart.py and its tests")
    untitled = next(row for row in rows if row["id"] == helper_agent(story).id)
    story.expect_rows(untitled["helper_job_title"] == "")


def test_a_title_given_with_a_new_job_replaces_the_title_of_the_helper(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "Review plan 1093" --title "Plan review"', actor=story.agent)
    launcher.drain_requests()
    launcher.server.close()
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(next(row for row in rows if row["id"] == helper.id)["helper_job_title"] == "Plan review")
