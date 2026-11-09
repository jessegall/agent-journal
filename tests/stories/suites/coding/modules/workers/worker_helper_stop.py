from core.modules.messages.models.message import Message
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.expect_reply import expect_reply_allowed
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

START = 'helper start journal-researcher --brief "Read src/cart.py" --environment main'


def worker_with_helper(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.run(START, actor=worker)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return story, worker


def read_helper(story, worker):
    return story.container.get(Queries).query(Agent).filter(parent_id=worker.id, role="helper").first()


def test_a_worker_may_stop_while_its_helper_works(new_story):
    story, worker = worker_with_helper(new_story)
    expect_reply_allowed(story.hook(worker_session(story, worker), HookSamples.stop()))


def test_a_worker_with_no_helper_running_is_held_to_its_task(new_story):
    story, worker = worker_with_helper(new_story)
    story.expect_success(f"helper stop {read_helper(story, worker).id}", actor=worker)
    story.expect_hook_refusal(worker_session(story, worker), HookSamples.stop(), "task:1")


def test_a_helpers_report_keeps_the_workers_task_and_worktree(new_story):
    story, worker = worker_with_helper(new_story)
    stop = HookSamples.stop()
    story.hook(read_helper(story, worker).session, stop.with_raw({**stop.body["raw"], "last_assistant_message": "The cart adds tax twice."}))
    story.expect_text(f"agent-line list --agent {worker.id}", f"agent:{read_helper(story, worker).id} reports in message:")
    story.expect_rows(story.container.get(Queries).query(Message).newest().first().text == "The cart adds tax twice.")
    story.expect_text("worker-worktree show 1", "state: cut")
    story.expect_text("task show 1", "state: started")


def test_a_workers_release_stops_its_helpers_first(new_story):
    story, worker = worker_with_helper(new_story)
    story.expect_success(f'worker release {worker.id} "No longer needed"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(read_helper(story, worker).ended_at is not None)
