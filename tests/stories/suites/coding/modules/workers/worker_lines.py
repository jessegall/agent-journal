from core.base.query.queries import Queries
from core.modules.tasks.rules.log_request_rule import LOG_REQUEST_WRITES
from core.modules.tasks.rules.unlogged_write_rule import UNLOGGED_WRITES_CEILING
from core.modules.drivers.models.nudge_record import NudgeRecord
from suites.coding.modules.workers.support.worker_nudges import WORKER_LOG_DUE
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


def test_the_main_agent_edits_no_file_in_a_workers_worktree(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    folder = story.container.get(WorktreeQuery).worker_worktree(worker.id).folder
    story.expect_hook_refusal("s-1", HookSamples.edit(f"{folder}/cart.py"), f"that file is in worker {worker.id}'s worktree")
    story.expect_hook_allowed("s-1", HookSamples.edit("/elsewhere/cart.py"))


def test_a_line_on_a_clock_waits_out_its_time_though_the_number_in_it_changes(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    finished = HookSamples.edit("cart.py").with_fields(event="post_tool_use")
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed(session, finished, "you logged nothing for 31 min")
    story.advance(timedelta(minutes=1))
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=30))
    story.expect_hook_allowed(session, finished, "you logged nothing for 62 min")
    records = list(story.container.get(Queries).query(NudgeRecord).filter(session_agent_id=worker.id, key=WORKER_LOG_DUE.key).all_rows())
    story.expect_rows(len(records) == 1, records[0].delivery_count == 2)


def test_a_worker_silent_for_thirty_minutes_is_told_to_log(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    finished = HookSamples.edit("cart.py").with_fields(event="post_tool_use")
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed(session, finished, "you logged nothing for 31 min")


def test_a_workers_writes_wait_past_the_hold_count_until_it_logs_its_task(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    edit = HookSamples.edit("cart.py")
    for _ in range(LOG_REQUEST_WRITES - 1):
        story.hook(session, edit)
    story.expect_hook_allowed(session, edit, f"log task 1 due: {LOG_REQUEST_WRITES} writes")
    for _ in range(UNLOGGED_WRITES_CEILING - LOG_REQUEST_WRITES - 1):
        story.hook(session, edit)
    story.expect_hook_refusal(session, edit, "log task 1 due: 0 writes")
    story.advance(timedelta(minutes=1))
    story.expect_success("task log 1 'the cart total is worked out'", actor=worker)
    story.expect_hook_allowed(session, edit)


def test_a_workers_build_goes_in_the_queue_and_its_read_does_not(new_story):
    story = install_runner(new_story(fixture=OpenTaskOrchestrator))
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    build = HookSamples.shell("make build", ShellPart("make", "build", ["build"]))
    read = HookSamples.shell("cat notes.txt", ShellPart("cat", "read", ["notes.txt"]))
    expect_updated_input_hook_with_2(story, session, build, "--queue")
    expect_updated_input_hook_without_2(story, session, read, "--queue")
    expect_updated_input_hook_with_2(story, "s-1", build, "--queue")


def expect_updated_input_hook_without_2(story, text, build, expected) -> None:
    actual = str(story.hook(text, build).updated_input)
    assert expected not in actual, actual


def expect_updated_input_hook_with_2(story, session, build, expected) -> None:
    actual = str(story.hook(session, build).updated_input)
    assert expected in actual, actual
