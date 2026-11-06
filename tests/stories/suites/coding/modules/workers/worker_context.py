import pytest
from dataclasses import dataclass
import base64
import json
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.testing.hook_samples import HookSamples
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.documents.support.trail_fixtures import IMAGE_BYTES, SelectedTrail, Trail, feature, pending, send_picture
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository


@dataclass(frozen=True)
class WorkerTrail(Trail):
    repository: GitRepository


@dataclass(frozen=True)
class AssignedWorker:
    trail: WorkerTrail
    worker: Actor


@pytest.fixture
def worker_trail(new_story):
    story = new_story(fixture=SelectedTrail)
    story.expect_success("driver choose coding.orchestrator --environment main")
    repository = repository_environment(story)
    return WorkerTrail(story, repository)


def dispatch(trail: Trail, tasks: str = "1") -> Actor:
    return Actor(trail.story.new_row_id(f"worker dispatch --model sonnet {tasks}", actor=trail.story.agent), ActorType.AGENT)


@pytest.fixture
def assigned_worker(worker_trail):
    return AssignedWorker(worker_trail, dispatch(worker_trail))


def advance(trail: WorkerTrail, worker: Actor) -> None:
    trail.repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    trail.story.expect_success('proof make 1 "cart.py:1, assignment completed"', actor=worker)
    trail.story.expect_success("worker next", actor=worker)


@pending(6892)
def test_dispatch_uses_task_overview_context(worker_trail):
    result = worker_trail.command("worker dispatch --model sonnet 1")
    feature("journal task overview 1" in result.output_text, result.output_text)


@pending(6892)
def test_worker_context_excludes_unrelated_messages(assigned_worker):
    worker_trail, worker = assigned_worker.trail, assigned_worker.worker
    worker_trail.person("messages.chat", "message", "send", "Unrelated confidential message")
    result = worker_trail.story.run("task overview 1", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text, result.output_text)
    feature("Unrelated confidential message" not in result.output_text, result.output_text)


@pending(6887)
def test_worker_queued_tasks_use_their_own_sources(worker_trail):
    worker_trail.switch(1)
    worker_trail.make_task("Second queued assignment")
    worker_trail.switch(2)
    worker = dispatch(worker_trail, "1 2")
    worker_trail.story.expect_success("task overview 1", actor=worker)
    worker_trail.story.expect_success('task make "From first job" --environment main', actor=worker)
    worker_trail.expect_link("message:2", "task:3", "about")
    advance(worker_trail, worker)
    worker_trail.story.expect_success("task overview 2", actor=worker)
    worker_trail.story.expect_success('task make "From second job" --environment main', actor=worker)
    worker_trail.expect_link("message:1", "task:4", "about")
    worker_trail.expect_no_link("message:2", "task:4")


@pending(6892)
def test_queued_and_resumed_workers_read_their_current_context(worker_trail):
    worker_trail.make_task("Queued cart assignment")
    worker = dispatch(worker_trail, "1 2")
    worker_trail.story.expect_success("task overview 1", actor=worker)
    advance(worker_trail, worker)
    result = worker_trail.story.run("task overview 2", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text and "Queued cart assignment" in result.output_text, result.output_text)


@pending(6892)
def test_worker_compaction_requires_current_task_context(assigned_worker):
    worker_trail, worker = assigned_worker.trail, assigned_worker.worker
    worker_trail.story.container.get(TaskBriefRequirement).is_required = True
    worker_trail.story.expect_success("task overview 1", actor=worker)
    session = worker_session(worker_trail.story, worker)
    worker_trail.story.hook(session, HookSamples.sample("compact"))
    result = worker_trail.story.run("task overview 1", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text, result.output_text)


@pending(6892)
def test_worker_can_open_its_source_attachment(worker_trail):
    message_id = send_picture(worker_trail)
    worker_trail.switch(message_id)
    worker = dispatch(worker_trail)
    result = worker_trail.story.run(f"task context 1 --message {message_id} --attachment cart.png --json", actor=worker)
    feature(result.code == 0, result.output_text)
    value = json.loads(result.output_text)
    feature(base64.b64decode(value["attachment"]["content_base64"]) == IMAGE_BYTES, "worker could not open its assigned source attachment")
    refused = worker_trail.story.run("task context 999 --message 1 --attachment private.png --json", actor=worker)
    feature(refused.code == 1 and "content_base64" not in refused.output_text, refused.output_text)


@pending(6892)
def test_resumed_launch_requires_current_overview(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    trail.story.expect_success(f"agent end {worker.id}", actor=trail.story.agent)
    trail.story.advance(timedelta(seconds=1))
    launcher = FakeLauncher(trail.story.home.socket("launcher"))
    trail.command(f'worker send {worker.id} "Continue the cart assignment"')
    trail.story.run_listeners()
    launcher.expect_started(worker.id, worker_session(trail.story, worker), trail.repository.worktree_folder(worker.id))
    trail.story.home.socket("launcher").unlink()
    prompt = " ".join(launcher.requests[0]["command"])
    feature("journal task overview 1" in prompt, "resumed launch omits the current task overview")
