import json
import sys

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.checkout_stories import (
    CHANGED_ORDER_TEXT, ORDER, ORDER_TEXT, checkout_of, checkout_story, delivery_changes, edit_event, edit_events, file_of, moved_worktree_row, real)
from tests.stories.core.modules.plugins.support.event_stories import event_data, plugin_row
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, DISPATCH, FIRST_PROOF
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

NEW_FILE = "src/new.py"
SALE = "src/sale.py"
LIBRARY_FILE = "node_modules/x.js"
RELEASE_REASON = "the story released it"
HELPER_START = 'helper start journal-researcher --brief "Read src/order.py" --environment main'
UNKNOWN_COMMIT = "0123456789012345678901234567890123456789"
JOINS_ON_RELATIVE = f"""'{sys.executable}' -c '
import json, sys
entries = {{"src/order.py": "order entry found"}}
print(json.dumps({{"v": 1, "tell": entries[json.loads(sys.argv[1])["data"]["file"]["relative"]]}}))
' "$line" """


def test_s45_an_edit_in_a_worktree_gives_its_relative_name_real_path_kind_and_branch(new_story):
    story = checkout_story(new_story)
    call = edit_event(story, story.worker_session)
    checkout, file = checkout_of(call), file_of(call)
    story.expect_rows(checkout["kind"] == "worktree", checkout["branch"] == story.repository.worker_branch(story.worker.id), checkout["root"] == real(story.worktree))
    story.expect_rows(file["relative"] == ORDER, file["path"] == real(story.worktree / ORDER))


def test_s45_a_plugin_that_joins_on_relative_finds_its_entry(new_story):
    story = checkout_story(new_story, scripts={"join.sh": JOINS_ON_RELATIVE}, program="join.sh")
    scanned_edit(story, story.worker_session, ORDER, folder=story.worktree)
    story.run_listeners()
    story.expect_hook_allowed(story.worker_session, LISTING_SAMPLE, "[plugin events] order entry found")


def test_s46_an_edit_in_the_main_checkout_gives_the_same_path_twice_and_kind_main(new_story):
    story = checkout_story(new_story)
    call = edit_event(story, "s-1", folder=story.repository.folder)
    checkout, file = checkout_of(call), file_of(call)
    story.expect_rows(checkout["kind"] == "main", checkout["root"] == checkout["project_root"], file["path"] == file["project_path"], file["relative"] == ORDER)


def test_s47_a_worktree_inside_the_project_folder_gives_the_relative_name_of_the_checkout(new_story):
    story = checkout_story(new_story)
    file = file_of(edit_event(story, story.worker_session))
    story.expect_rows(story.worktree.is_relative_to(story.repository.folder), file["relative"] == ORDER, ".journal" not in str(file["relative"]))


def test_s47_a_worktree_cut_beside_the_project_gives_the_same_event(new_story):
    story = checkout_story(new_story)
    beside = story.repository.folder.parent / "beside-the-project"
    story.repository.git("worktree", "move", str(story.worktree), str(beside))
    moved_worktree_row(story, story.worker.id, beside)
    call = edit_event(story, story.worker_session, folder=beside)
    story.expect_rows(file_of(call)["relative"] == ORDER, checkout_of(call)["root"] == real(beside), file_of(call)["project_path"] == real(story.repository.folder / ORDER))


def test_s47_an_environment_folder_whose_name_appears_twice_in_the_path_gives_the_same_event(new_story):
    story = checkout_story(new_story, project="project/project")
    call = edit_event(story, story.worker_session)
    story.expect_rows(file_of(call)["relative"] == ORDER, file_of(call)["project_path"] == real(story.repository.folder / ORDER), checkout_of(call)["project_root"] == real(story.repository.folder))


def test_s48_a_project_behind_a_link_gives_real_paths_and_the_same_event_for_both_names(new_story):
    story = checkout_story(new_story, linked=True)
    linked_worktree = story.home.folder.parent / "linked-project" / story.worktree.relative_to(story.repository.folder)
    by_link = edit_event(story, story.worker_session, folder=linked_worktree)
    by_real_path = edit_event(story, story.worker_session, folder=story.worktree.resolve())
    story.expect_rows(checkout_of(by_link)["root"] == real(story.worktree), checkout_of(by_link)["project_root"] == real(story.repository.folder), file_of(by_link)["relative"] == ORDER)
    story.expect_rows(checkout_of(by_link) == checkout_of(by_real_path), file_of(by_link) == file_of(by_real_path))


def test_s49_an_edit_under_a_linked_library_is_linked_and_stays_with_the_worktree(new_story):
    story = checkout_story(new_story, dispatch=f"{DISPATCH} --library-link node_modules", before_dispatch=lambda story: story.repository.library("node_modules", "x.js", "A\n"))
    call = edit_event(story, story.worker_session, name=LIBRARY_FILE)
    story.expect_rows(file_of(call)["relative"] == LIBRARY_FILE, file_of(call)["linked"] is True, checkout_of(call)["kind"] == "worktree", checkout_of(call)["root"] == real(story.worktree))


def released_with_an_edit(new_story):
    story = checkout_story(new_story)
    scanned_edit(story, story.worker_session, ORDER, folder=story.worktree)
    story.expect_success(f'worker release {story.worker.id} "{RELEASE_REASON}"', actor=story.agent)
    return story


def test_s50_a_delivery_after_the_worktree_is_removed_names_the_branch_and_says_it_is_gone(new_story):
    story = released_with_an_edit(new_story)
    story.run_listeners()
    calls = edit_events(story)
    story.expect_rows(len(calls) == 1, plugin_row(story).fault_count == 0)
    story.expect_rows(checkout_of(calls[0])["exists"] is False, checkout_of(calls[0])["branch"] == story.repository.worker_branch(story.worker.id))


def test_s50_plugin_file_refuses_a_removed_worktree_and_offers_the_base(new_story):
    story = released_with_an_edit(new_story)
    story.expect_refusal(f"plugin file {ORDER} --agent {story.worker.id}", "--from base", actor=story.user)


def test_s50_plugin_run_refuses_a_removed_worktree(new_story):
    story = released_with_an_edit(new_story)
    story.expect_refusal(f"plugin run --agent {story.worker.id} -- true", "removed", actor=story.user)


def test_s50_from_base_reads_from_the_merged_branch(new_story):
    story = checkout_story(new_story)
    story.repository.changed(story.worker.id, ORDER, CHANGED_ORDER_TEXT)
    story.expect_success(FIRST_PROOF, "point: 1", actor=story.worker)
    story.expect_success(DELIVERY, actor=story.worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {story.worker.id}", actor=story.agent)
    story.expect_text(f"plugin file {ORDER} --agent {story.worker.id} --from base", CHANGED_ORDER_TEXT.strip(), actor=story.user)


def test_s50_from_base_after_a_discard_says_the_commit_is_gone(new_story):
    story = released_with_an_edit(new_story)
    repository = story.repository
    repository.git("branch", "-f", ENVIRONMENT_BRANCH, repository.tip("main"))
    repository.git("reflog", "expire", "--expire=now", "--all")
    repository.git("gc", "--prune=now")
    story.expect_refusal(f"plugin file {ORDER} --agent {story.worker.id} --from base", "gone", actor=story.user)


def test_s51_a_file_only_in_the_worktree_is_added_and_not_in_the_base_and_not_in_the_project(new_story):
    story = checkout_story(new_story)
    story.repository.changed(story.worker.id, NEW_FILE, "NEW = 1\n")
    file = file_of(edit_event(story, story.worker_session, name=NEW_FILE, existed=False))
    story.expect_rows(file["status"] == "added", file["in_base"] is False, file["project_path"] == real(story.repository.folder / NEW_FILE), not (story.repository.folder / NEW_FILE).exists())


def test_s51_plugin_file_from_the_project_says_it_is_not_there_with_a_distinct_code(new_story):
    story = checkout_story(new_story)
    story.repository.changed(story.worker.id, NEW_FILE, "NEW = 1\n")
    outcome = story.run(f"plugin file {NEW_FILE} --agent {story.worker.id} --from project", actor=story.user)
    story.expect_rows(outcome.code not in (0, 1, 2), "not there" in outcome.output_text)


def renamed_in_worktree(story) -> None:
    story.repository.git("mv", ORDER, SALE, folder=story.worktree)
    story.expect_success(FIRST_PROOF, "point: 1", actor=story.worker)


def expect_renamed(story) -> None:
    rows = [row for row in delivery_changes(story) if row["relative"] == SALE]
    story.expect_rows(len(rows) == 1)
    story.expect_rows(rows[0]["status"] == "renamed", rows[0]["renamed_from"] == ORDER)


def test_s54_a_rename_at_hand_in_holds_both_names(new_story):
    story = checkout_story(new_story)
    renamed_in_worktree(story)
    story.run(DELIVERY, actor=story.worker)
    expect_renamed(story)


def test_s54_a_rename_with_changes_in_the_file_holds_both_names(new_story):
    story = checkout_story(new_story)
    renamed_in_worktree(story)
    (story.worktree / SALE).write_text(ORDER_TEXT + "SALE = 1\n")
    story.run(DELIVERY, actor=story.worker)
    expect_renamed(story)


def test_s54_a_single_edit_event_for_a_move_says_added_and_the_hand_in_is_still_right(new_story):
    story = checkout_story(new_story)
    renamed_in_worktree(story)
    file = file_of(edit_event(story, story.worker_session, name=SALE, existed=False))
    story.expect_rows(file["status"] == "added", file["renamed_from"] == "")
    story.run(DELIVERY, actor=story.worker)
    expect_renamed(story)


def test_s55_a_deleted_file_is_named_though_nothing_is_there(new_story):
    story = checkout_story(new_story)
    (story.worktree / ORDER).unlink()
    file = file_of(edit_event(story, story.worker_session))
    story.expect_rows(file["status"] == "deleted", file["path"] == real(story.worktree.resolve() / ORDER), not (story.worktree / ORDER).exists(), plugin_row(story).fault_count == 0)


def test_s56_a_helper_of_a_worker_gets_the_checkout_of_the_worker(new_story):
    story = checkout_story(new_story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(HELPER_START, actor=story.worker)
    story.run_listeners()
    launcher.thread.join(timeout=5)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    helper = story.container.get(Queries).query(Agent).filter(parent_id=story.worker.id, role="helper").first()
    call = edit_event(story, helper.session)
    story.expect_rows(call["agent"] == helper.id, checkout_of(call)["root"] == real(story.worktree), checkout_of(call)["kind"] == "worktree")


def test_s57_the_main_agent_editing_inside_a_worktree_gets_that_worktree_and_is_named(new_story):
    story = checkout_story(new_story)
    call = edit_event(story, "s-1", folder=story.worktree)
    story.expect_rows(call["agent"] == story.agent.id, checkout_of(call)["kind"] == "worktree", checkout_of(call)["root"] == real(story.worktree), file_of(call)["relative"] == ORDER)


def test_s59_the_checkout_call_and_the_checkout_of_an_event_are_equal_behind_a_link(new_story):
    story = checkout_story(new_story, linked=True)
    outcome = story.run("plugin checkout --json", actor=story.worker)
    story.expect_rows(outcome.code == 0)
    story.expect_rows(json.loads(outcome.output_text) == checkout_of(edit_event(story, story.worker_session)))


def test_s60_the_full_line_of_a_file_edited_for_a_worker_does_not_move(new_story):
    story = checkout_story(new_story)
    call = edit_event(story, story.worker_session)
    worktree, project = real(story.worktree), real(story.repository.folder)
    data = event_data(call)
    story.expect_rows(set(call) == {"v", "event", "at", "environment", "agent", "skills", "checkout", "data"})
    story.expect_rows(call["v"] == 1, call["event"] == "file_edited", call["environment"] == "main", call["agent"] == story.worker.id)
    assert call["checkout"] == {"kind": "worktree", "root": worktree, "project_root": project, "branch": story.repository.worker_branch(story.worker.id), "base_branch": ENVIRONMENT_BRANCH,
                                "base_commit": story.repository.tip(ENVIRONMENT_BRANCH), "exists": True}, call["checkout"]
    story.expect_rows(data["path"] == ORDER, data["cwd"] == str(story.worktree))
    assert data["file"] == {"relative": ORDER, "path": f"{worktree}/{ORDER}", "project_path": f"{project}/{ORDER}", "status": "changed", "renamed_from": "", "in_base": True, "linked": False}, data["file"]


def test_s62_changes_since_a_commit_names_what_differs_with_files_not_yet_committed_and_new_ones(new_story):
    story = checkout_story(new_story)
    base = story.repository.tip(ENVIRONMENT_BRANCH)
    story.repository.changed(story.worker.id, ORDER, CHANGED_ORDER_TEXT)
    story.repository.changed(story.worker.id, NEW_FILE, "NEW = 1\n")
    story.expect_text(f"plugin changes --agent {story.worker.id} --since {base} --json", f'"relative": "{ORDER}"', f'"relative": "{NEW_FILE}"', actor=story.user)


def test_s62_changes_since_a_commit_git_does_not_know_says_so(new_story):
    story = checkout_story(new_story)
    story.expect_refusal(f"plugin changes --agent {story.worker.id} --since {UNKNOWN_COMMIT}", "does not know", actor=story.user)
