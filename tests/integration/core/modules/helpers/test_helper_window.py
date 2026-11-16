from engine.database.database import Database
from engine.viewer.person_lines import PERSON_LINES
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.viewer.migrations.m003_helpers_window_key import HelpersWindowKeyMigration
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, helper_agent
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

MARKS = "chat-mark list --environment 1"
OLD_LAYOUT = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"agents.subagents\"]}' --environment main"
LAYOUT = "viewer-layout current --suite coding --page home --environment main"


def test_a_person_stops_a_runaway_helper_from_its_card(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    WindowStory(story).expect_window_allowed("agents.helpers", f"helper stop {helper.id}")
    story.expect_success(f"helper stop {helper.id}", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_job_shows_one_mark_that_says_it_started(played):
    story = played(StartedHelper)
    story.expect_text(MARKS, f"Started {RESEARCHER_PROFILE.name}")


def test_a_finished_job_ends_its_mark_in_place(played):
    story = played(EndedHelper)
    story.expect_text(MARKS, "reported back")
    story.expect_no_text(MARKS, f"Started {RESEARCHER_PROFILE.name}")


def test_a_saved_layout_moves_to_the_helpers_window(played):
    story = played(UserJoined)
    story.expect_success(OLD_LAYOUT, actor=story.user)
    HelpersWindowKeyMigration().run(story.container.get(Database))
    story.expect_text(LAYOUT, "agents.helpers", actor=story.user)
    story.expect_no_text(LAYOUT, "agents.subagents", actor=story.user)


def test_the_profiles_window_may_start_a_helper_and_read_whether_it_can(played):
    window = WindowStory(played(StartedHelper))
    window.expect_window_allowed("profiles.profiles", f'helper start {RESEARCHER_PROFILE.name} --brief "x"')
    window.expect_window_allowed("profiles.profiles", "helper availability")


def test_a_start_with_no_launcher_says_what_to_do(played):
    story = played(UserJoined)
    story.expect_text("helper availability --environment main", "journal launch", actor=story.user)


def test_a_start_with_no_main_agent_says_what_to_do(played):
    story = played(UserJoined)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.expect_text("helper availability --environment main", "main agent", actor=story.user)
    launcher.server.close()


def test_a_start_at_the_limit_says_so(played):
    story = played(StartedHelper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.run(f"setting set {HELPER_RUN_LIMIT} 1 --project", actor=story.user)
    story.expect_text(f"helper availability --profile {RESEARCHER_PROFILE.name} --environment main", f"1 of {RESEARCHER_PROFILE.name} run", actor=story.user)
    launcher.server.close()


def assert_person_line():
    assert "helper start" in PERSON_LINES
