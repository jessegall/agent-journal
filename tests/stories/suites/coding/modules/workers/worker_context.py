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
from tests.stories.core.modules.documents.support.trail_fixtures import IMAGE_BYTES, SelectedTrail, Trail, feature, send_picture
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.base.driver.tool_type import ToolType


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
    worktree = trail.story.container.get(WorktreeQuery).worker_worktree(worker.id)
    assert worktree is not None
    trail.story.expect_success(f'proof make 1 "cart.py:1, assignment completed" --task {worktree.task_id}', actor=worker)
    trail.story.expect_success("worker next", actor=worker)


def test_dispatch_uses_task_overview_context(worker_trail):
    worker_trail.story.container.get(TaskBriefRequirement).is_required = True
    result = worker_trail.command("worker dispatch --model sonnet 1")
    feature("journal task overview 1" in result.output_text, result.output_text)
    worktree = worker_trail.story.container.get(WorktreeQuery).open_worktrees()[0]
    worker = Actor(worktree.session_agent_id, ActorType.AGENT)
    session = worker_session(worker_trail.story, worker)
    worker_trail.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "journal task overview 1")
    overview = worker_trail.story.run("task overview 1", actor=worker)
    feature(overview.code == 0 and "Implement the cart request" in overview.output_text, overview.output_text)
    worker_trail.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_worker_context_excludes_unrelated_messages(assigned_worker):
    worker_trail, worker = assigned_worker.trail, assigned_worker.worker
    worker_trail.person("messages.chat", "message", "send", "Unrelated confidential message")
    result = worker_trail.story.run("task overview 1", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text, result.output_text)
    feature("Unrelated confidential message" not in result.output_text, result.output_text)


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


def test_worker_followup_changes_source_only_after_delivery(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    trail.switch(1)
    trail.command(f'worker send {worker.id} "Handle the original request next"')
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_success('task make "Work already running" --environment main', actor=worker)
    trail.expect_link("message:2", "task:2", "about")
    reply = trail.story.hook(worker_session(trail.story, worker), HookSamples.tool_use("Read", ToolType.READ, [], None))
    assert any("Handle the original request next" in line for line in reply.lines), reply.lines
    trail.story.expect_success('task make "Work from delivered followup" --environment main', actor=worker)
    trail.expect_link("message:1", "task:3", "about")
    trail.expect_no_link("message:2", "task:3")


def test_resumed_worker_does_not_keep_the_old_job_source(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_success('task make "First sourced worker output" --environment main', actor=worker)
    trail.expect_link("message:2", "task:2", "about")
    trail.command(f"agent end {worker.id}")
    trail.command("message clear-work-source")
    launcher = FakeLauncher(trail.story.home.socket("launcher"))
    trail.command(f'worker send {worker.id} "A separate unsourced job"')
    trail.story.run_listeners()
    launcher.expect_started(worker.id, worker_session(trail.story, worker), trail.repository.worktree_folder(worker.id))
    trail.story.home.socket("launcher").unlink()
    trail.story.hook(worker_session(trail.story, worker), HookSamples.session_start())
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_success('task make "Unsourced resumed output" --environment main', actor=worker)
    trail.expect_no_link("message:2", "task:3")


def test_deleted_worker_source_is_not_a_reused_message_number(worker_trail):
    trail = worker_trail
    original = trail.person("messages.chat", "message", "send", "Temporary worker request")
    trail.switch(original["id"])
    worker = dispatch(trail)
    trail.person("messages.chat", "message", "delete", str(original["id"]))
    replacement = trail.person("messages.chat", "message", "send", "A different worker request")
    assert replacement["id"] == original["id"]
    trail.switch(replacement["id"])
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_success('task make "Old unavailable assignment output" --environment main', actor=worker)
    trail.expect_no_link(f'message:{replacement["id"]}', "task:2")
    trail.command(f'worker send {worker.id} "Now handle the replacement request"')
    trail.story.hook(worker_session(trail.story, worker), HookSamples.tool_use("Read", ToolType.READ, [], None))
    trail.story.expect_success('task make "New assignment output" --environment main', actor=worker)
    trail.expect_link(f'message:{replacement["id"]}', "task:3", "about")


def test_queued_and_resumed_workers_read_their_current_context(worker_trail):
    worker_trail.story.container.get(TaskBriefRequirement).is_required = True
    worker_trail.make_task("Queued cart assignment")
    worker = dispatch(worker_trail, "1 2")
    worker_trail.story.expect_success("task overview 1", actor=worker)
    advance(worker_trail, worker)
    worker_trail.story.expect_hook_refusal(worker_session(worker_trail.story, worker), HookSamples.edit("src/cart.py"), "journal task overview 2")
    result = worker_trail.story.run("task overview 2", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text and "Queued cart assignment" in result.output_text, result.output_text)
    worker_trail.story.expect_hook_allowed(worker_session(worker_trail.story, worker), HookSamples.edit("src/cart.py"))


def test_worker_compaction_requires_current_task_context(assigned_worker):
    worker_trail, worker = assigned_worker.trail, assigned_worker.worker
    worker_trail.story.container.get(TaskBriefRequirement).is_required = True
    worker_trail.story.expect_success("task overview 1", actor=worker)
    session = worker_session(worker_trail.story, worker)
    worker_trail.story.hook(session, HookSamples.sample("compact"))
    worker_trail.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "journal task overview 1")
    result = worker_trail.story.run("task overview 1", actor=worker)
    assert result.code == 0, result.output_text
    feature("Implement the cart request" in result.output_text, result.output_text)
    worker_trail.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


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


def test_resumed_launch_requires_current_overview(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    trail.story.container.get(TaskBriefRequirement).is_required = True
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_success(f"agent end {worker.id}", actor=trail.story.agent)
    trail.story.advance(timedelta(seconds=1))
    launcher = FakeLauncher(trail.story.home.socket("launcher"))
    trail.command(f'worker send {worker.id} "Continue the cart assignment"')
    trail.story.run_listeners()
    launcher.expect_started(worker.id, worker_session(trail.story, worker), trail.repository.worktree_folder(worker.id))
    trail.story.home.socket("launcher").unlink()
    prompt = " ".join(launcher.requests[0]["command"])
    feature("journal task overview 1" in prompt, "resumed launch omits the current task overview")
    session = worker_session(trail.story, worker)
    trail.story.hook(session, HookSamples.session_start())
    trail.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "journal task overview 1")
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_legacy_unsourced_task_uses_only_its_captured_assignment_request(worker_trail):
    trail = worker_trail
    feature(not any(row["link_type"] == "about" and row["target_model"] == "task" and row["target_id"] == 1
                    for row in trail.links("message:2")), "the legacy fixture already has a source link")
    source = trail.person("messages.chat", "message", "send", "Captured assignment request")
    trail.switch(source["id"])
    worker = dispatch(trail)
    trail.switch(1)
    trail.person("messages.chat", "message", "send", "Unrelated parent-only request")
    result = trail.story.run("task overview 1", actor=worker)
    feature(result.code == 0 and "Captured assignment request" in result.output_text, result.output_text)
    feature("Unrelated parent-only request" not in result.output_text, result.output_text)
    feature(not any(row["link_type"] == "about" and row["target_model"] == "task" and row["target_id"] == 1
                    for row in trail.links(f'message:{source["id"]}')), "dispatch wrote a lifecycle subject link")


def test_worker_overview_inherits_its_plan_comments(worker_trail):
    trail = worker_trail
    trail.command('phase make --plan 1 "Worker context" --goal "Keep the scope"')
    trail.command('phase place 1 --phase 1')
    trail.person("viewer.shell", "plan", "comment", "1", "Assigned plan detail")
    worker = dispatch(trail)
    result = trail.story.run("task overview 1", actor=worker)
    feature(result.code == 0 and "Assigned plan detail" in result.output_text, result.output_text)
    plan = json.loads(trail.command("plan show 1 --json").output_text)
    feature(plan["state"] == "draft", "dispatch bypassed plan approval")


def test_rework_requires_current_overview_before_writes(assigned_worker):
    trail, worker = assigned_worker.trail, assigned_worker.worker
    trail.story.container.get(TaskBriefRequirement).is_required = True
    trail.story.expect_success("task overview 1", actor=worker)
    trail.repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    trail.story.expect_success('proof make 1 "cart.py:1, assignment completed" --task 1', actor=worker)
    trail.story.expect_success("worker deliver", actor=worker)
    trail.command(f'worker send {worker.id} "Recheck the cart assignment"')
    session = worker_session(trail.story, worker)
    trail.story.hook(session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    trail.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "journal task overview 1")
    trail.story.expect_success("task overview 1", actor=worker)
    trail.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))
