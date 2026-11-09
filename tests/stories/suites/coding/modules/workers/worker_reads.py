import os
from pathlib import Path

from core.base.driver.tool_type import ToolType
from core.testing.expect_reply import expect_reply_allowed
from core.testing.hook_samples import HookSamples
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


def expect_read(story, worker, path):
    expect_reply_allowed(story.hook(worker_session(story, worker), read_row(path)))


def started(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    return story, dispatched_worker(story)


def test_a_worker_reads_a_file_in_its_worktree(new_story):
    story, worker = started(new_story)
    expect_read(story, worker, read_worktree(story, worker) / "src" / "cart.py")


def test_a_relative_path_is_read_from_the_worktree(new_story):
    story, worker = started(new_story)
    expect_read(story, worker, "src/cart.py")


def test_a_worker_cannot_read_a_file_of_the_main_checkout(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, story.home.folder.parent / "src" / "cart.py")


def test_a_path_that_climbs_out_of_the_worktree_is_refused(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, read_worktree(story, worker) / ".." / ".." / "secrets.txt")


def test_a_relative_path_that_climbs_out_is_refused(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, "../../../../src/cart.py")


def test_a_folder_that_starts_with_the_worktree_name_is_outside_it(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, f"{read_worktree(story, worker)}-other/cart.py")


def test_a_worker_cannot_read_a_private_file_of_the_person(new_story):
    story, worker = started(new_story)
    expect_refused(story, worker, "/Users/someone/.ssh/id_rsa")


def test_a_worker_reads_the_temporary_folder(new_story):
    story, worker = started(new_story)
    expect_read(story, worker, "/tmp/notes.txt")


def test_a_worker_reads_its_program_s_own_home(new_story):
    story, worker = started(new_story)
    expect_read(story, worker, Path(os.environ["CLAUDE_CONFIG_DIR"]) / "projects" / "tool-results" / "output.txt")


def test_the_main_agent_reads_any_file(new_story):
    story, worker = started(new_story)
    expect_reply_allowed(story.hook("s-1", read_row(read_worktree(story, worker) / "src" / "cart.py")))


def test_a_read_with_no_file_named_passes(new_story):
    story, worker = started(new_story)
    expect_reply_allowed(story.hook(worker_session(story, worker), HookSamples.tool_use("Grep", ToolType.READ, [], None)))
