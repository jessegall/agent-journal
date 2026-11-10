from tests.stories.core.support.agent_labels import agent_number
import pytest

import json
import sys

from engine.agent.agent_checkouts import AgentCheckouts
from engine.checkout.checkout import Checkout
from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.notices import expect_plugin_notice
from tests.stories.core.modules.plugins.support.checkout_stories import (
    CHANGED_ORDER_TEXT, ORDER, ORDER_TEXT, checkout_row, checkout_story, delivery_changes, edit_event, edit_events, read_file, moved_worktree_row, real)
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, DISPATCH, FIRST_PROOF
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

NEW_FILE = "src/new.py"
SALE = "src/sale.py"
ODD_NAMES = ("with a space.py", 'with"quote.py', "with\ttab.py", "naïve.py")
RENAMED_ODD_NAME = "src/sale order.py"
LIBRARY_FILE = "node_modules/x.js"
RELEASE_REASON = "the story released it"
HELPER_START = 'helper start journal-researcher --brief "Read src/order.py" --environment main'
UNKNOWN_COMMIT = "0123456789012345678901234567890123456789"
RELATIVE_JOIN = f"""'{sys.executable}' -c '
import json, sys
entries = {{"src/order.py": "order entry found"}}
print(json.dumps({{"v": 1, "tell": entries[json.loads(sys.argv[1])["data"]["file"]["relative"]]}}))
' "$line" """


def read_checkout(story, agent_id: int) -> Checkout:
    return story.container.get(AgentCheckouts).checkout(agent_id)


def test_s45_a_plugin_that_joins_on_relative_finds_its_entry(new_story):
    story = checkout_story(new_story, scripts={"join.sh": RELATIVE_JOIN}, program="join.sh")
    scanned_edit(story, story.worker_session, ORDER, folder=story.worktree)
    story.run_listeners()
    expect_plugin_notice(story, LISTING_SAMPLE, "[plugin events] order entry found", session=story.worker_session, agent_id=story.worker.id)


def test_s49_an_edit_under_a_linked_library_is_linked_and_stays_with_the_worktree(new_story):
    story = checkout_story(new_story, dispatch=f"{DISPATCH} --library-link node_modules", setup_repository=lambda story: story.repository.library("node_modules", "x.js", "A\n"))
    call = edit_event(story, story.worker_session, name=LIBRARY_FILE)
    story.expect_rows(read_file(call)["relative"] == LIBRARY_FILE, read_file(call)["linked"] is True, checkout_row(call)["type"] == "worktree", checkout_row(call)["root"] == real(story.worktree))


def edited_release(new_story):
    story = checkout_story(new_story)
    story.expect_success(f'worker release {agent_number(story, story.worker.id)} "{RELEASE_REASON}"', actor=story.agent)
    scanned_edit(story, story.worker_session, ORDER, folder=story.worktree)
    return story


def test_s50_from_base_reads_from_the_merged_branch(new_story):
    story = checkout_story(new_story)
    story.repository.changed(story.worker.id, ORDER, CHANGED_ORDER_TEXT)
    story.expect_success(FIRST_PROOF, "point: 1", actor=story.worker)
    story.expect_success(DELIVERY, actor=story.worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, story.worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, story.worker.id)}", actor=story.agent)
    story.expect_text(f"plugin file {ORDER} --agent {story.worker.id} --from base", CHANGED_ORDER_TEXT.strip(), actor=story.user)


def test_s50_from_base_after_a_discard_says_the_commit_is_gone(new_story):
    story = edited_release(new_story)
    repository = story.repository
    repository.git("branch", "-f", ENVIRONMENT_BRANCH, repository.tip("main"))
    for reference in repository.git("for-each-ref", "--format=%(refname)", "refs/worker-tips").stdout.split():
        repository.git("update-ref", "-d", reference)
    repository.git("branch", "-D", repository.worker_branch(story.worker.id))
    repository.git("reflog", "expire", "--expire=now", "--all")
    repository.git("gc", "--prune=now")
    story.expect_refusal(f"plugin file {ORDER} --agent {story.worker.id} --from base", "gone", actor=story.user)


def worktree_rename(story) -> None:
    story.repository.git("mv", ORDER, SALE, folder=story.worktree)
    story.expect_success(FIRST_PROOF, "point: 1", actor=story.worker)


def expect_renamed(story) -> None:
    rows = [row for row in delivery_changes(story) if row["relative"] == SALE]
    story.expect_rows(len(rows) == 1)
    story.expect_rows(rows[0]["status"] == "renamed", rows[0]["renamed_from"] == ORDER)


def test_s54_a_single_edit_event_for_a_move_says_added_and_the_hand_in_is_still_right(new_story):
    story = checkout_story(new_story)
    worktree_rename(story)
    file = read_file(edit_event(story, story.worker_session, name=SALE, existed=False))
    story.expect_rows(file["status"] == "added", file["renamed_from"] == "")
    story.run(DELIVERY, actor=story.worker)
    expect_renamed(story)


@pytest.fixture
def prepared_checkout(new_story):
    return checkout_story(new_story)



def test_s62_changes_since_a_commit_names_what_differs_with_files_not_yet_committed_and_new_ones(prepared_checkout):
    story = prepared_checkout
    base = story.repository.tip(ENVIRONMENT_BRANCH)
    story.repository.changed(story.worker.id, ORDER, CHANGED_ORDER_TEXT)
    story.repository.changed(story.worker.id, NEW_FILE, "NEW = 1\n")
    story.expect_text(f"plugin changes --agent {story.worker.id} --since {base} --json", f'"relative": "{ORDER}"', f'"relative": "{NEW_FILE}"', actor=story.user)


def test_s62_changes_since_a_commit_git_does_not_know_says_so(prepared_checkout):
    story = prepared_checkout
    story.expect_refusal(f"plugin changes --agent {story.worker.id} --since {UNKNOWN_COMMIT}", "does not know", actor=story.user)


def test_s62_changes_since_base_reads_the_commit_the_worktree_was_cut_from(new_story):
    story = checkout_story(new_story)
    story.repository.changed(story.worker.id, ORDER, CHANGED_ORDER_TEXT)
    story.expect_text(f"plugin changes --agent {story.worker.id} --since base --json", f'"relative": "{ORDER}"', actor=story.user)


def test_a_path_in_a_worktree_or_in_the_project_names_its_relative_name_and_checkout(new_story):
    story = checkout_story(new_story)
    story.expect_text(f"plugin path {story.worktree.resolve() / ORDER} --agent {story.worker.id}", f"relative: {ORDER}", "type: worktree", actor=story.user)
    story.expect_text(f"plugin path {story.repository.folder.resolve() / ORDER} --agent {story.worker.id}", f"relative: {ORDER}", "type: main", actor=story.user)
    story.expect_refusal(f"plugin path /tmp/elsewhere.py --agent {story.worker.id}", "is in no checkout of this project", actor=story.user)


def test_an_alias_run_by_a_worker_is_told_its_checkout(new_story):
    story = checkout_story(new_story)
    story.expect_success('alias add checkout-facts "printenv" --category check --agents --environment main', actor=story.user)
    story.expect_text("checkout-facts JOURNAL_CHECKOUT_TYPE", "worktree", actor=story.worker)
    story.expect_text("checkout-facts JOURNAL_BASE_COMMIT", read_checkout(story, story.worker.id).base_commit, actor=story.worker)
    story.expect_text("checkout-facts JOURNAL_PROJECT_ROOT", str(story.repository.folder.resolve()), actor=story.worker)
