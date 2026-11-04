import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.base.query.queries import Queries
from core.modules.processes.commands.end_process.end_process import EndProcess
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
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
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    return story, repository, worker, started


def ended(story, process_id: int, code: int) -> None:
    owner = Actor(story.container.get(Queries).query(Process).find(process_id).agent_id, ActorType.AGENT)
    story.container.get(Bus).run(EndProcess(process_id, code, 0, 0), owner, environment_id=1)
    story.run_listeners()


def test_the_last_delivery_queues_the_tests_and_the_journal_starts_them(new_story, monkeypatch):
    story, _, worker, started = queued_story(new_story, monkeypatch)
    assert len(started) == 1
    story.expect_text("proof show 1", "state: running", "test_command: pytest tests/cart.py", actor=story.agent)
    assert "queued" in marks_text(story), marks_text(story)
    queue = json.loads(story.run("queue list --environment-id 1 --json").output_text)
    story.expect_rows(queue["total"] == 1, queue["rows"][0]["owner_agent_id"] == worker.id,
                      queue["rows"][0]["output_id"] == started[0])
    story.expect_rows(queue["running"][0]["owner_agent_id"] == worker.id, queue["running"][0]["task_id"] == 1)


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
    story.expect_text(f"agent-line list --agent {worker.id}", f"your tests failed: journal output read {started[0]} --summary")
    story.expect_text("worker-worktree show 1", "state: cut", actor=story.agent)
    repository.changed(worker.id, "cart.py", "TOTAL = 4\n")
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    assert len(started) == 2
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def mixed_proof_story(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task edit 1 --brief "- the total\n- the tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success('proof make 2 "cart.py:1, looked at it"', actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    return story, repository, worker, started


def test_passed_tests_with_a_proof_with_no_test_ask_for_the_check_not_the_merge(new_story, monkeypatch):
    story, repository, worker, started = mixed_proof_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    lines = story.run(f"agent-line list --agent {story.agent.id}").output_text
    assert PROOF_CHECK.nudge(worker=worker.id, task=1, proofs="2").text in lines
    assert f"journal worker merge {worker.id}" not in lines
    assert "passed" in marks_text(story), marks_text(story)
    story.expect_success("proof check 2", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)


def test_a_task_with_an_unchecked_proof_stays_in_testing_after_its_tests_pass(new_story, monkeypatch):
    story, _, _, started = mixed_proof_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    story.expect_text("task show 1", "state: testing", actor=story.agent)


def test_a_proof_with_no_test_still_waits_for_the_main_agents_check(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, looked at it"', actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    assert not started
    story.expect_text("proof show 1", "state: shown", actor=story.agent)


def test_a_worker_test_starts_through_the_runner_in_the_worktree(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    calls = []
    monkeypatch.setattr("subprocess.Popen", lambda command, **options: calls.append((command, options)))
    story.container.get(WorkerTestLaunch).start(7, "pytest tests/cart.py", "/work/worktree", "s-1")
    command, options = calls[0]
    assert "--process 7" in command and "--background" in command and options["cwd"] == "/work/worktree"


def test_picked_tests_run_after_proof_tests_on_the_rebased_worktree(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main', actor=story.agent)
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("base.txt", "rebased\n", "Base change")
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    picker = story.container.get(Queries).query(Process).find(started[1])
    story.expect_rows("pick.py" in picker.line, "cart.py" in picker.line,
                      (repository.worktree_folder(worker.id) / "base.txt").read_text() == "rebased\n")
    story.container.get(OutputFolder).write_output(picker.id, 1, "tests/other test.py\n")
    ended(story, picker.id, 0)
    selected = story.container.get(Queries).query(Process).find(started[2])
    story.expect_rows(selected.line == "python3 -m pytest -q 'tests/other test.py'")
    ended(story, selected.id, 0)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
