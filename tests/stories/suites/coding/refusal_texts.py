from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderWithUser

AUTO = "journal.suites.coding.auto-mode"
HELPERS = "journal.suites.coding.builder-starts-helpers"
DISPATCHES = "journal.suites.coding.workers.builder-dispatches-workers"
HELPER_START = HookSamples.shell("journal helper start journal-researcher", ShellPart("journal", "journal", ["helper", "start", "journal-researcher"]))
WORKER_DISPATCH = HookSamples.shell("journal worker dispatch 1", ShellPart("journal", "journal", ["worker", "dispatch", "1"]))


def test_helper_ban_with_auto_on_tells_the_main_agent_it_may_do_the_work_or_send_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
    story.expect_hook_refusal("s-1", HELPER_START, "starts no ordinary helpers here: do the work yourself or send it to a worker")


def test_helper_ban_with_auto_off_tells_the_main_agent_only_to_send_the_work(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
    story.expect_hook_refusal("s-1", HELPER_START, "starts no ordinary helpers here: send the work to a worker")


def test_dispatch_ban_with_auto_on_tells_the_main_agent_to_do_the_task(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {DISPATCHES} off --environment main", actor=story.user)
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "builder-dispatches-workers is off, so do the task yourself")


def test_dispatch_ban_with_auto_off_says_nothing_can_be_done_until_a_person_allows_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {DISPATCHES} off --environment main", actor=story.user)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "auto mode is off too: ask a person to allow workers")
