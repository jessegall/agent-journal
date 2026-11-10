from pathlib import Path

from engine.enums.tool_type import ToolType
from engine.testing.expectations.expect_reply import expect_reply_allowed
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_nudges import WORKER_READ_REFUSAL
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

REFUSAL = WORKER_READ_REFUSAL.nudge().text


def read_row(path):
    return HookSamples.tool_use("Read", ToolType.READ, [str(path)], None)


def read_worktree(story, worker):
    details = story.run(f"worker-worktree list --agent {worker.id} --columns folder", actor=story.user).output_text
    return Path(details.strip().splitlines()[0].strip())


def expect_refused(story, worker, path):
    story.expect_hook_refusal(worker_session(story, worker), read_row(path), REFUSAL)


def started(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    return story, dispatched_worker(story)


def test_a_folder_that_starts_with_the_worktree_name_is_outside_it(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, f"{read_worktree(story, worker)}-other/cart.py")


def test_the_main_agent_reads_any_file(new_story):
    story, worker = started(new_story)
    expect_reply_allowed(story.hook("s-1", read_row(read_worktree(story, worker) / "src" / "cart.py")))
