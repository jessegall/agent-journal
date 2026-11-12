from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder

AUTO = "journal.suites.coding.auto-mode"
HELPERS = "journal.suites.coding.main-starts-read-only-helpers"
DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers"
HELPER_START = HookSamples.shell("journal helper start journal-researcher", ShellPart("journal", "journal", ["helper", "start", "journal-researcher"]))
WORKER_DISPATCH = HookSamples.shell("journal worker dispatch 1 --model sonnet", ShellPart("journal", "journal", ["worker", "dispatch", "1", "--model", "sonnet"]))


def test_dispatch_ban_while_writing_no_code_says_nothing_can_be_done_until_a_person_allows_it(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {DISPATCHES} off --environment main", actor=story.user)
    story.expect_success("setting set journal.suites.coding.main-writes-code off --environment main", actor=story.user)
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "writes no code here either: ask a user to allow workers")
