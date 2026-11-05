from core.base.database.database import Database
from core.modules.viewer.migrations.m003_helpers_window_key import HelpersWindowKeyMigration
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, the_helper
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

MARKS = "chat-mark list --environment 1"
OLD_LAYOUT = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"agents.subagents\"]}' --environment main"
LAYOUT = "viewer-layout current --suite coding --page home --environment main"


def test_a_person_stops_a_runaway_helper_from_its_card(new_story):
    story = new_story(fixture=StartedHelper)
    helper = the_helper(story)
    WindowStory(story).expect_window_allowed("agents.helpers", f"helper stop {helper.id}")
    story.expect_success(f"helper stop {helper.id}", actor=story.user)
    story.expect_rows(the_helper(story).ended_at is not None)


def test_a_person_sends_a_job_to_a_helper_from_its_card(new_story):
    story = new_story(fixture=StartedHelper)
    helper = the_helper(story)
    WindowStory(story).expect_window_allowed("agents.helpers", f'helper send {helper.id} "{JOB}"')
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.user)


def test_a_job_shows_one_mark_that_says_it_started(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_text(MARKS, "Started journal-researcher")


def test_a_finished_job_ends_its_mark_in_place(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_text(MARKS, "Finished journal-researcher")
    story.expect_no_text(MARKS, "Started journal-researcher")


def test_a_saved_layout_moves_to_the_helpers_window(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(OLD_LAYOUT, actor=story.user)
    HelpersWindowKeyMigration().run(story.container.get(Database))
    story.expect_text(LAYOUT, "agents.helpers", actor=story.user)
    story.expect_no_text(LAYOUT, "agents.subagents", actor=story.user)
