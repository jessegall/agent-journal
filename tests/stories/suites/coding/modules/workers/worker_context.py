from tests.stories.core.support.agent_labels import agent_number
import pytest
from dataclasses import dataclass
import base64
import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.documents.support.trail_fixtures import IMAGE_BYTES, SelectedTrail, Scenario, feature, attach_image
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.enums.tool_type import ToolType


@dataclass(frozen=True)
class WorkerTrail(Scenario):
    repository: GitRepository


@dataclass(frozen=True)
class AssignedWorker:
    scenario: WorkerTrail
    worker: Actor


@pytest.fixture
def worker_scenario(new_story):
    story = new_story(fixture=SelectedTrail)
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main")
    repository = repository_environment(story)
    return WorkerTrail(story, repository)


def dispatch(scenario: Scenario, tasks: str = "1") -> Actor:
    return Actor(scenario.story.new_row_id(f"worker dispatch --test-command python=pytest --model sonnet {tasks}", actor=scenario.story.agent), ActorType.AGENT)


@pytest.fixture
def assigned_worker(worker_scenario):
    return AssignedWorker(worker_scenario, dispatch(worker_scenario))


def commit_and_go_on(scenario: WorkerTrail, worker: Actor, task_id: int) -> None:
    """The worker starts the task named beside its own, proves the one it had and commits that one."""
    scenario.repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    worktree = scenario.story.container.get(WorktreeQuery).worker_worktree(worker.id)
    assert worktree is not None
    scenario.story.expect_success(f'proof make 1 "cart.py:1, assignment completed" --task {worktree.task_id}', actor=worker)
    scenario.story.expect_success(f"task start {task_id}", actor=worker)
    scenario.story.expect_success(COMMIT, actor=worker)


def test_dispatch_uses_task_overview_context(worker_scenario):
    worker_scenario.story.container.get(TaskBriefRequirement).is_required = True
    outcome = worker_scenario.command("worker dispatch --test-command python=pytest --model sonnet 1")
    feature("journal task overview 1" in outcome.output_text, outcome.output_text)
    worktree = worker_scenario.story.container.get(WorktreeQuery).open_worktrees()[0]
    worker = Actor(worktree.session_agent_id, ActorType.AGENT)
    session = worker_session(worker_scenario.story, worker)
    worker_scenario.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "Read task 1 first")
    overview = worker_scenario.story.run("task overview 1", actor=worker)
    feature(overview.code == 0 and "Implement the cart request" in overview.output_text, overview.output_text)
    worker_scenario.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_worker_context_excludes_unrelated_messages(assigned_worker):
    worker_scenario, worker = assigned_worker.scenario, assigned_worker.worker
    worker_scenario.person("messages.chat", "message", "send", "Unrelated confidential message")
    outcome = worker_scenario.story.run("task overview 1", actor=worker)
    worker_scenario.story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    feature("Implement the cart request" in outcome.output_text, outcome.output_text)
    feature("Unrelated confidential message" not in outcome.output_text, outcome.output_text)


def test_worker_queued_tasks_use_their_own_sources(worker_scenario):
    worker_scenario.switch(1)
    worker_scenario.make_task("Second queued assignment")
    worker_scenario.switch(2)
    worker = dispatch(worker_scenario, "1 2")
    worker_scenario.story.expect_success("task overview 1", actor=worker)
    worker_scenario.story.expect_success('task make "From first job" --environment main', actor=worker)
    worker_scenario.expect_link("message:2", "task:3", "about")
    commit_and_go_on(worker_scenario, worker, 2)
    worker_scenario.story.expect_success("task overview 2", actor=worker)
    worker_scenario.story.expect_success('task make "From second job" --environment main', actor=worker)
    worker_scenario.expect_link("message:1", "task:4", "about")
    worker_scenario.expect_no_link("message:2", "task:4")


def test_worker_followup_changes_source_only_after_delivery(assigned_worker):
    scenario, worker = assigned_worker.scenario, assigned_worker.worker
    scenario.switch(1)
    scenario.command(f'worker send --wait {agent_number(scenario.story, worker.id)} "Handle the original request next"')
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_success('task make "Work already running" --environment main', actor=worker)
    scenario.expect_link("message:2", "task:2", "about")
    reply = scenario.story.hook(worker_session(scenario.story, worker), HookSamples.tool_use("Read", ToolType.READ, [], None))
    line_id = next(line.split(":", 1)[1].split(":", 1)[0] for line in reply.lines if line.startswith("agent-line:"))
    scenario.story.expect_text(f"agent-line show {line_id}", "Handle the original request next", actor=worker)
    scenario.story.expect_success('task make "Work from delivered followup" --environment main', actor=worker)
    scenario.expect_link("message:1", "task:3", "about")
    scenario.expect_no_link("message:2", "task:3")


def test_resumed_worker_does_not_keep_the_old_job_source(assigned_worker):
    scenario, worker = assigned_worker.scenario, assigned_worker.worker
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_success('task make "First sourced worker output" --environment main', actor=worker)
    scenario.expect_link("message:2", "task:2", "about")
    scenario.story.container.get(TaskBriefRequirement).is_required = True
    scenario.command(f"agent end {worker.id}")
    scenario.command("message clear-work-source")
    launcher = FakeLauncher.listening(scenario.story.home.socket("launcher"))
    scenario.command(f'worker send --wait {agent_number(scenario.story, worker.id)} "A separate unsourced job"')
    scenario.story.run_listeners()
    launcher.expect_started(worker.id, worker_session(scenario.story, worker), scenario.repository.worktree_folder(worker.id))
    scenario.story.home.socket("launcher").unlink()
    scenario.story.hook(worker_session(scenario.story, worker), HookSamples.session_start())
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_success('task make "Unsourced resumed output" --environment main', actor=worker)
    scenario.expect_no_link("message:2", "task:3")


def test_deleted_worker_source_is_not_a_reused_message_number(worker_scenario):
    scenario = worker_scenario
    original = scenario.person("messages.chat", "message", "send", "Temporary worker request")
    scenario.switch(original["id"])
    worker = dispatch(scenario)
    scenario.person("messages.chat", "message", "delete", str(original["id"]))
    replacement = scenario.person("messages.chat", "message", "send", "A different worker request")
    scenario.story.expect_rows(replacement["id"] == original["id"])
    scenario.switch(replacement["id"])
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_success('task make "Old unavailable assignment output" --environment main', actor=worker)
    scenario.expect_no_link(f'message:{replacement["id"]}', "task:2")
    scenario.command(f'worker send --wait {agent_number(scenario.story, worker.id)} "Now handle the replacement request"')
    scenario.story.hook(worker_session(scenario.story, worker), HookSamples.tool_use("Read", ToolType.READ, [], None))
    scenario.story.expect_success('task make "New assignment output" --environment main', actor=worker)
    scenario.expect_link(f'message:{replacement["id"]}', "task:3", "about")


def test_queued_and_resumed_workers_read_their_current_context(worker_scenario):
    worker_scenario.story.container.get(TaskBriefRequirement).is_required = True
    worker_scenario.make_task("Queued cart assignment")
    worker = dispatch(worker_scenario, "1 2")
    worker_scenario.story.expect_success("task overview 1", actor=worker)
    commit_and_go_on(worker_scenario, worker, 2)
    worker_scenario.story.expect_hook_refusal(worker_session(worker_scenario.story, worker), HookSamples.edit("src/cart.py"), "Read task 2 first")
    outcome = worker_scenario.story.run("task overview 2", actor=worker)
    worker_scenario.story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    feature("Implement the cart request" in outcome.output_text and "Queued cart assignment" in outcome.output_text, outcome.output_text)
    worker_scenario.story.expect_hook_allowed(worker_session(worker_scenario.story, worker), HookSamples.edit("src/cart.py"))


def test_worker_compaction_requires_current_task_context(assigned_worker):
    worker_scenario, worker = assigned_worker.scenario, assigned_worker.worker
    worker_scenario.story.container.get(TaskBriefRequirement).is_required = True
    worker_scenario.story.expect_success("task overview 1", actor=worker)
    session = worker_session(worker_scenario.story, worker)
    worker_scenario.story.hook(session, HookSamples.sample("compact"))
    worker_scenario.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "Read task 1 first")
    outcome = worker_scenario.story.run("task overview 1", actor=worker)
    worker_scenario.story.expect_rows(outcome.code == 0, detail=outcome.output_text)
    feature("Implement the cart request" in outcome.output_text, outcome.output_text)
    worker_scenario.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_resumed_launch_requires_current_overview(assigned_worker):
    scenario, worker = assigned_worker.scenario, assigned_worker.worker
    scenario.story.container.get(TaskBriefRequirement).is_required = True
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_success(f"agent end {worker.id}", actor=scenario.story.agent)
    scenario.story.advance(timedelta(seconds=1))
    launcher = FakeLauncher.listening(scenario.story.home.socket("launcher"))
    scenario.command(f'worker send --wait {agent_number(scenario.story, worker.id)} "Continue the cart assignment"')
    scenario.story.run_listeners()
    launcher.expect_started(worker.id, worker_session(scenario.story, worker), scenario.repository.worktree_folder(worker.id))
    scenario.story.home.socket("launcher").unlink()
    prompt = " ".join(launcher.requests[0]["command"])
    feature("journal task overview 1" in prompt, "resumed launch omits the current task overview")
    session = worker_session(scenario.story, worker)
    scenario.story.hook(session, HookSamples.session_start())
    scenario.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "Read task 1 first")
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))


def test_legacy_unsourced_task_uses_only_its_captured_assignment_request(worker_scenario):
    scenario = worker_scenario
    feature(not any(row["link_type"] == "about" and row["target_model"] == "task" and row["target_id"] == 1
                    for row in scenario.links("message:2")), "the legacy fixture already has a source link")
    source = scenario.person("messages.chat", "message", "send", "Captured assignment request")
    scenario.switch(source["id"])
    worker = dispatch(scenario)
    scenario.switch(1)
    scenario.person("messages.chat", "message", "send", "Unrelated parent-only request")
    outcome = scenario.story.run("task overview 1", actor=worker)
    feature(outcome.code == 0 and "Captured assignment request" in outcome.output_text, outcome.output_text)
    feature("Unrelated parent-only request" not in outcome.output_text, outcome.output_text)
    feature(not any(row["link_type"] == "about" and row["target_model"] == "task" and row["target_id"] == 1
                    for row in scenario.links(f'message:{source["id"]}')), "dispatch wrote a lifecycle subject link")


def test_worker_overview_inherits_its_plan_comments(worker_scenario):
    scenario = worker_scenario
    scenario.command('phase make --plan 1 "Worker context" --goal "Keep the scope"')
    scenario.command('phase place 1 --phase 1')
    scenario.person("viewer.shell", "plan", "comment", "1", "Assigned plan detail")
    worker = dispatch(scenario)
    outcome = scenario.story.run("task overview 1", actor=worker)
    feature(outcome.code == 0 and "Assigned plan detail" in outcome.output_text, outcome.output_text)
    plan = json.loads(scenario.command("plan show 1 --json").output_text)
    feature(plan["state"] == "draft", "dispatch bypassed plan approval")


def test_rework_requires_current_overview_before_writes(assigned_worker):
    scenario, worker = assigned_worker.scenario, assigned_worker.worker
    scenario.story.container.get(TaskBriefRequirement).is_required = True
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.repository.changed(worker.id, "cart.py", "TOTAL = 2\n")
    scenario.story.expect_success('proof make 1 "cart.py:1, assignment completed" --task 1', actor=worker)
    scenario.story.expect_success("worker commit --wait --differences none", actor=worker)
    scenario.command(f'worker send --wait {agent_number(scenario.story, worker.id)} "Recheck the cart assignment"')
    session = worker_session(scenario.story, worker)
    scenario.story.hook(session, HookSamples.tool_use("Read", ToolType.READ, [], None))
    scenario.story.expect_hook_refusal(session, HookSamples.edit("src/cart.py"), "Read task 1 first")
    scenario.story.expect_success("task overview 1", actor=worker)
    scenario.story.expect_hook_allowed(session, HookSamples.edit("src/cart.py"))
