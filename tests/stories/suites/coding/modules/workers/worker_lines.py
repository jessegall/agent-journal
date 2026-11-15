from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.support.agent_labels import agent_number
from core.modules.tasks.support.task_agent_messages import LOG_REQUEST_WRITES
from core.modules.tasks.states.unlogged_write_states import UNLOGGED_WRITES_CEILING
from core.modules.drivers.models.message_record import MessageRecord
from suites.coding.modules.workers.agent_messages.worker_log_due_message import WorkerLogDueMessage
from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from core.modules.tasks.agent_messages.unlogged_writes_message import UnloggedWritesMessage
from engine.testing.expectations.expected_message import expected_agent_message
from suites.coding.modules.workers.agent_messages.worker_file_message import WorkerFileMessage
from suites.coding.modules.workers.agent_messages.worker_log_due_message import WorkerLogDueMessage



def test_the_main_agent_edits_no_file_in_a_workers_worktree(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    folder = story.first_row(Worktree, session_agent_id=worker.id).folder
    story.expect_hook_refusal("s-1", HookSamples.edit(f"{folder}/cart.py"), expected_agent_message(WorkerFileMessage.declared()))
    story.expect_hook_allowed("s-1", HookSamples.edit("/elsewhere/cart.py"))


def test_a_line_on_a_clock_waits_out_its_time_though_the_number_in_it_changes(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    finished = HookSamples.edit("cart.py").with_fields(event="post_tool_use")
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed(session, finished, expected_agent_message(WorkerLogDueMessage.declared()))
    story.advance(timedelta(minutes=1))
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=30))
    story.expect_hook_allowed(session, finished, expected_agent_message(WorkerLogDueMessage.declared()))
    records = list(story.story_rows(MessageRecord, session_agent_id=worker.id, key=WorkerLogDueMessage.declared().key))
    story.expect_rows(len(records) == 1, records[0].delivery_count == 2)


def test_a_worker_silent_for_thirty_minutes_is_told_to_log(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    finished = HookSamples.edit("cart.py").with_fields(event="post_tool_use")
    story.expect_absent_hook_line(session, finished, "you logged nothing")
    story.advance(timedelta(minutes=31))
    story.expect_hook_allowed(session, finished, expected_agent_message(WorkerLogDueMessage.declared()))


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
    story.expect_hook_refusal(session, edit, expected_agent_message(UnloggedWritesMessage.declared(), task=1))
    story.advance(timedelta(minutes=1))
    story.expect_success("task log 1 'the cart total is worked out'", actor=worker)
    story.expect_hook_allowed(session, edit)
