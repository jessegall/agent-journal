from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

PROOF = 'proof make 1 "cart.py:1, the cart story" --test "pytest tests/cart.py"'


def recording_launch(monkeypatch) -> list[int]:
    started: list[int] = []
    monkeypatch.setattr(WorkerTestLaunch, "start", lambda _launch, process_id, _line, _folder, _session: started.append(process_id))
    return started


def queued_story(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    return story, repository, worker, started


def ended(story, process_id: int, code: int) -> None:
    story.container.get(Bus).run(EndProcess(process_id, code, 0, 0), story.agent, environment_id=1)
    story.run_listeners()


def test_the_last_delivery_queues_the_tests_and_the_journal_starts_them(new_story, monkeypatch):
    story, _, _, started = queued_story(new_story, monkeypatch)
    assert len(started) == 1
    story.expect_text("proof show 1", "state: running", "test_command: pytest tests/cart.py", actor=story.agent)
    assert "queued" in marks_text(story), marks_text(story)


def test_all_tests_passing_checks_the_proofs_and_tells_the_main_agent_and_the_merge_goes_through(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    assert "passed" in marks_text(story), marks_text(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the tests of worker:{worker.id} all pass", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_a_failed_test_goes_back_to_the_worker_and_its_next_delivery_runs_it_again(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    ended(story, started[0], 1)
    story.expect_text("proof show 1", "state: short", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "your tests failed: pytest tests/cart.py")
    story.expect_text("worker-worktree show 1", "state: cut", actor=story.agent)
    repository.changed(worker.id, "cart.py", "TOTAL = 4\n")
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    assert len(started) == 2
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def test_a_proof_with_no_test_still_waits_for_the_main_agents_check(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, looked at it"', actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    assert not started
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
