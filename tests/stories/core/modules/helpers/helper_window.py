from engine.database.database import Database
from engine.viewer.person_lines import PERSON_LINES
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT
from core.testing.fake_launcher import FakeLauncher
from core.modules.viewer.migrations.m003_helpers_window_key import HelpersWindowKeyMigration
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, helper_agent
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

MARKS = "chat-mark list --environment 1"
OLD_LAYOUT = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"agents.subagents\"]}' --environment main"
LAYOUT = "viewer-layout current --suite coding --page home --environment main"


def test_a_person_stops_a_runaway_helper_from_its_card(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    WindowStory(story).expect_window_allowed("agents.helpers", f"helper stop {helper.id}")
    story.expect_success(f"helper stop {helper.id}", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_job_shows_one_mark_that_says_it_started(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_text(MARKS, "Started journal-researcher")


def test_a_finished_job_ends_its_mark_in_place(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_text(MARKS, "reported back")
    story.expect_no_text(MARKS, "Started journal-researcher")


def test_a_saved_layout_moves_to_the_helpers_window(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(OLD_LAYOUT, actor=story.user)
    HelpersWindowKeyMigration().run(story.container.get(Database))
    story.expect_text(LAYOUT, "agents.helpers", actor=story.user)
    story.expect_no_text(LAYOUT, "agents.subagents", actor=story.user)


def test_the_profiles_window_may_start_a_helper_and_read_whether_it_can(new_story):
    window = WindowStory(new_story(fixture=StartedHelper))
    window.expect_window_allowed("profiles.profiles", 'helper start journal-researcher --brief "x"')
    window.expect_window_allowed("profiles.profiles", "helper availability")


def test_a_start_with_no_launcher_says_what_to_do(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("helper availability --environment main", "journal launch", actor=story.user)


def test_a_start_with_no_main_agent_says_what_to_do(new_story):
    story = new_story(fixture=UserJoined)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.expect_text("helper availability --environment main", "main agent", actor=story.user)
    launcher.server.close()


def test_a_start_at_the_limit_says_so(new_story):
    story = new_story(fixture=StartedHelper)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run(f"setting set {HELPER_RUN_LIMIT} 1 --project", actor=story.user)
    story.expect_text("helper availability --profile journal-researcher --environment main", "1 of journal-researcher run", actor=story.user)
    launcher.server.close()


def test_helper_start_is_a_persons_line():
    assert_person_line()


def assert_person_line():
    assert "helper start" in PERSON_LINES
