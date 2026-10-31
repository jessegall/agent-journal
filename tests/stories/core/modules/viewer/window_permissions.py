from tests.stories.core.modules.viewer.support.window_samples import GRANTING_NOTES, NOTES, WIDER_NOTES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

ALLOW_READS = "window allow notes.board --type reads --environment main"
PERMISSIONS = "window permissions notes.board --environment main"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(NOTES, fixture=UserJoined))


def test_a_person_who_allows_a_window_its_reads_lets_it_read(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW_READS, actor=window.story.user)
    window.expect_window_allowed("notes.board", "task list")


def test_an_allowance_of_reads_gives_no_runs(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW_READS, actor=window.story.user)
    window.expect_window_refusal("notes.board", "task start 1", "notes.board may run task start once you allow it")


def test_an_agent_cannot_give_a_window_permission(new_story):
    window = window_story(new_story)
    window.story.expect_refusal(ALLOW_READS, "only the person a window permission is for may give it", actor=window.story.agent)


def test_a_person_cannot_give_a_window_permission_for_another(new_story):
    window = window_story(new_story)
    bob = window.new_person("Bob")
    line = f"window-permission make {bob.id} notes.board reads --lines '[\"task list\"]' --environment main"
    window.story.expect_refusal(line, "only the person a window permission is for may give it", actor=window.story.user)


def test_an_allowance_another_person_gave_lets_the_window_read_nothing_for_you(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW_READS, actor=window.new_person("Bob"))
    window.expect_window_refusal("notes.board", "task list", "notes.board may run task list once you allow it")


def test_an_allowance_in_another_environment_lets_the_window_read_nothing_here(new_story):
    window = window_story(new_story)
    window.story.expect_success("environment make staging /work/staging")
    window.story.expect_success("window allow notes.board --type reads --environment staging", actor=window.story.user)
    window.expect_window_refusal("notes.board", "task list", "notes.board may run task list once you allow it")


def test_a_module_that_declares_another_read_asks_only_for_that_line(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW_READS, actor=window.story.user)
    window.module_upgraded(NOTES, WIDER_NOTES)
    window.story.expect_success(PERMISSIONS, "reads_allowed: task list", "reads_missing: plan list", actor=window.story.user)
    window.expect_window_allowed("notes.board", "task list")


def test_a_page_trust_stops_holding_when_the_module_code_changes(new_story):
    window = window_story(new_story)
    window.story.expect_success("window trust notes --environment main", actor=window.story.user)
    window.story.expect_success(PERMISSIONS, "component_trusted: True", actor=window.story.user)
    with window.module_code_changed():
        window.story.expect_success(PERMISSIONS, "component_trusted: False", actor=window.story.user)


def test_removing_a_module_deletes_the_permissions_given_to_its_windows(new_story):
    window = window_story(new_story)
    window.story.expect_success(ALLOW_READS, actor=window.story.user)
    window.story.expect_success("window trust notes --environment main", actor=window.story.user)
    window.module_removed("notes")
    window.expect_row_count("window_permissions", 0)


def test_a_window_the_journal_does_not_ship_never_runs_the_lines_that_give_rights_or_change_settings(new_story):
    window = WindowStory(new_story(GRANTING_NOTES, fixture=UserJoined))
    window.story.expect_success("window allow notes.board --type runs --environment main", actor=window.story.user)
    window.expect_window_refusal("notes.board", "window allow notes.board --type reads", "notes.board may never run window allow")
    window.expect_window_refusal("notes.board", "window trust notes", "notes.board may never run window trust")
    window.expect_window_refusal("notes.board", "setting make drivers.suite '\"notes\"'", "notes.board may never run setting make")
    window.expect_window_refusal("notes.board", "setting edit 1 --value 1", "notes.board may never run setting edit")
    window.expect_window_refusal("notes.board", "viewer-layout save --suite notes --page home --layout {}", "notes.board may never run viewer-layout save")
