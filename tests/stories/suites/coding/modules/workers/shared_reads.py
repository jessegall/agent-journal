from typing import NamedTuple

import pytest

from core.base.actor import Actor
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from suites.coding.modules.workers.bindings.worker_agent_work import WorkerAgentWork
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import (
    DELIVERY, dispatched_worker, repository_environment,
)
from tests.stories.suites.coding.modules.workers.support.program_split import SplitViewer


class WorkerReadsStory(NamedTuple):
    story: Story
    workers: tuple[Actor, ...]


@pytest.fixture
def pending_workers(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_success('actor make user "Ada"')
    repository = repository_environment(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 3 --environment main")
    workers = []
    for number in range(3):
        task_id = 1 if number == 0 else story.new_row_id(
            f'task make "Cart change {number}" --brief "Change the cart total"', actor=story.agent)
        worker = dispatched_worker(story, f"worker dispatch {task_id} --model sonnet")
        repository.changed(worker.id, "cart.py", f"TOTAL = {number + 1}\n")
        story.expect_success(f'proof make 1 --task {task_id} "cart.py:1, the total story"', actor=worker)
        story.expect_success(DELIVERY, actor=worker)
        story.expect_success(f"agent end {worker.id}", actor=story.agent)
        workers.append(worker)
    return WorkerReadsStory(story, tuple(workers))


@pytest.fixture
def pending_viewer(pending_workers):
    with server_story(pending_workers.story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield SplitViewer(server, cookie)


@pytest.mark.parametrize("filter_name", ["running", "all", "idle"])
def test_agent_cards_share_pending_work_through_the_viewer_route(pending_workers, pending_viewer, monkeypatch, filter_name):
    story, workers = pending_workers
    reads = []
    original_read = WorkerAgentWork.read

    def counted_read(work):
        reads.append(work)
        return original_read(work)

    monkeypatch.setattr(WorkerAgentWork, "read", counted_read)
    cards = pending_viewer.value("agents.agents", ["agent", "cards", "--show", filter_name])
    expected = set() if filter_name == "idle" else {worker.id for worker in workers}
    story.expect_rows({row["id"] for row in cards["rows"]} == expected,
                      len(reads) <= 1, not pending_viewer.server.context.reported_findings.keys)


def test_an_approved_plan_stop_shares_several_pending_workers(pending_workers, pending_viewer):
    story, workers = pending_workers
    story.expect_success(f"setting set journal.suites.coding.workers.worker-kept-limit {len(workers)} --environment main")
    plan_id = story.new_row_id('plan make "Next cart work" --brief "Finish the cart"', actor=story.agent)
    phase_id = story.new_row_id(f'phase make --plan {plan_id} "Cart" --goal "The cart is finished"', actor=story.agent)
    story.expect_success(f'task make "Finish" --phase {phase_id}', actor=story.agent)
    story.expect_success(f'task make "Verify" --phase {phase_id}', actor=story.agent)
    story.expect_success(f"plan ready {plan_id}", actor=story.agent)
    pending_viewer.value("messages.chat", ["plan", "approve", str(plan_id)])
    sample = HookSamples.stop().with_fields(session="s-1", environment="main")
    pending_viewer.server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    records = pending_viewer.value("drivers.hook-calls", ["hook-call", "stops", "--session-agent-id", str(story.agent.id)])
    checks = {check["rule"]: check for check in records["rows"][0]["stop_checks"]}
    story.expect_rows(checks["workers.approved-plan-at-stop"]["reason"] == "no new worker can start",
                      not pending_viewer.server.context.reported_findings.keys)
