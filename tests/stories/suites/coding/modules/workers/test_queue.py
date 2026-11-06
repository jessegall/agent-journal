import json
import subprocess
import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.base.query.queries import Queries
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from tests.stories.core.modules.chat.support.mark_samples import marks_text, expect_marks_text
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_absent_value, expect_answers, expect_value_with

PROOF = 'proof make 1 --task 1 "cart.py:1, the cart story" --test "pytest tests/cart.py"'
PIPED_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart story" --test "pytest tests/cart.py | tail -3"'
REDIRECTED_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart story" --test "pytest tests/cart.py > out.txt"'
TAILED_PROOF = 'proof make 1 --task 1 "cart.py:1, the cart story" --test "journal pytest-run tests/cart.py --tail 5"'


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
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    return story, repository, worker, started


def ended(story, process_id: int, code: int) -> None:
    owner = Actor(story.container.get(Queries).query(Process).find(process_id).session_agent_id, ActorType.AGENT)
    story.container.get(Bus).run(EndProcess(process_id, code, 0, 0), owner, environment_id=1)
    story.run_listeners()


def test_a_proof_refuses_a_test_with_a_pipe_or_a_redirect(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    recording_launch(monkeypatch)
    repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    story.expect_refusal(PIPED_PROOF, "without a pipe, a redirect or a reading flag", actor=worker)
    story.expect_refusal(REDIRECTED_PROOF, "without a pipe, a redirect or a reading flag", actor=worker)
    story.expect_refusal(TAILED_PROOF, "without a pipe, a redirect or a reading flag", actor=worker)


def test_the_last_delivery_queues_the_tests_and_the_journal_starts_them(new_story, monkeypatch):
    story, _, worker, started = queued_story(new_story, monkeypatch)
    expect_answers(started, 1)
    story.expect_text("proof show 1", "state: running", "test_command: pytest tests/cart.py", actor=story.agent)
    expect_marks_text(story, "queued")
    queue = json.loads(story.run("queue list --environment 1 --json").output_text)
    story.expect_rows(queue["total"] == 1, queue["rows"][0]["owner_agent_id"] == worker.id,
                      queue["rows"][0]["output_id"] == started[0])
    story.expect_rows(queue["running"][0]["owner_agent_id"] == worker.id, queue["running"][0]["task_id"] == 1)


def test_all_tests_passing_checks_the_proofs_and_tells_the_main_agent_and_the_merge_goes_through(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    expect_marks_text(story, "passed")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the tests of worker:{worker.id} all pass", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_a_failed_test_goes_back_to_the_worker_and_its_next_delivery_runs_it_again(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    ended(story, started[0], 1)
    story.expect_text("proof show 1", "state: short", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", f"your tests failed: journal output read {started[0]} --summary")
    story.expect_text("worker-worktree show 1", "state: cut", actor=story.agent)
    repository.changed(worker.id, "cart.py", "TOTAL = 4\n")
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    expect_answers(started, 2)
    story.expect_text("proof show 1", "state: running", actor=story.agent)



def test_an_orphaned_proof_returns_to_the_worker_and_runs_again_at_delivery(new_story, monkeypatch):
    story, _, worker, started = queued_story(new_story, monkeypatch)
    orphaned_process_id = started[0]
    story.container.get(Bus).run(OrphanProcess(orphaned_process_id), Actor.core(), environment_id=1)
    story.run_listeners()
    story.expect_text("proof show 1", "state: short", actor=story.agent)
    story.expect_text("task show 1", "state: started", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", f"your tests failed: journal output read {orphaned_process_id} --summary")
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    expect_answers(started, 2)
    story.expect_rows(started[1] != orphaned_process_id)
    story.expect_text("proof show 1", "state: running", f"process_id: {started[1]}", actor=story.agent)
    ended(story, started[1], 0)
    story.expect_text("proof show 1", "state: checked", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)

def mixed_proof_story(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task edit 1 --brief "- the total\n- the tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success('proof make 2 --task 1 "cart.py:1, looked at it"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    return story, repository, worker, started


def test_passed_tests_with_a_proof_with_no_test_ask_for_the_check_not_the_merge(new_story, monkeypatch):
    story, repository, worker, started = mixed_proof_story(new_story, monkeypatch)
    ended(story, started[0], 0)
    lines = story.run(f"agent-line list --agent {story.agent.id}")
    lines.expect_text(PROOF_CHECK.nudge(worker=worker.id, task=1, proofs="2").text)
    lines.expect_no_text(f"journal worker merge {worker.id}")
    expect_marks_text(story, "passed")
    story.expect_success("proof check 2", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
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
    story.expect_success('proof make 1 --task 1 "cart.py:1, looked at it"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    expect_absent_value(started)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)


def test_a_worker_test_starts_through_the_runner_in_the_worktree(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    calls = []
    monkeypatch.setattr("subprocess.Popen", lambda command, **options: calls.append((command, options)))
    story.container.get(WorkerTestLaunch).start(7, "pytest tests/cart.py", "/work/worktree", "s-1")
    command, options = calls[0]
    expect_value_with(command, "--process 7")
    expect_value_with(command, "--background")
    expect_cwd_options(options, "/work/worktree")


def test_picked_tests_run_after_proof_tests_on_the_rebased_worktree(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("pick.py", "import sys\nfrom pathlib import Path\nassert 'cart.py' in sys.argv\nassert Path('base.txt').read_text() == 'rebased\\n'\nprint('tests/other test.py')\n", "Picker")
    repository.committed("run_tests.py", "import sys\nfrom pathlib import Path\nassert sys.argv[1:] == ['tests/other test.py']\nassert Path('base.txt').read_text() == 'rebased\\n'\n", "Tests")
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main', actor=story.agent)
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 run_tests.py" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("base.txt", "rebased\n", "Base change")
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story" --test "python3 -c \'from pathlib import Path; assert Path(\\\"base.txt\\\").exists()\'"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    run_test_process(story, started[0])
    picker = story.container.get(Queries).query(Process).find(started[1])
    story.expect_rows("pick.py" in picker.line, "cart.py" in picker.line,
                      (repository.worktree_folder(worker.id) / "base.txt").read_text() == "rebased\n")
    run_test_process(story, picker.id)
    first_answer = story.container.get(Queries).query(Process).find(started[2])
    story.expect_rows(first_answer.line == "python3 run_tests.py 'tests/other test.py'")
    run_test_process(story, first_answer.id)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def run_test_process(story, process_id):
    process = story.container.get(Queries).query(Process).find(process_id)
    completed = subprocess.run(process.line, shell=True, cwd=process.folder, capture_output=True, text=True, timeout=30, check=False)
    story.container.get(OutputFolder).write_output(process_id, 1, completed.stdout)
    ended(story, process_id, completed.returncode)


def affected_test_story(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main', actor=story.agent)
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    return story, repository, worker, started


def test_a_failed_picker_returns_the_work_with_its_output(new_story, monkeypatch):
    story, _, worker, started = affected_test_story(new_story, monkeypatch)
    ended(story, started[1], 1)
    story.expect_text("worker-worktree show 1", "state: cut", actor=story.agent)
    story.expect_text("task show 1", "state: started", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", f"journal output read {started[1]} --summary")


def test_a_failed_picked_test_returns_the_work_with_its_output(new_story, monkeypatch):
    story, _, worker, started = affected_test_story(new_story, monkeypatch)
    story.container.get(OutputFolder).write_output(started[1], 1, "tests/other.py\n")
    ended(story, started[1], 0)
    ended(story, started[2], 1)
    story.expect_text("worker-worktree show 1", "state: cut", actor=story.agent)
    story.expect_text("task show 1", "state: started", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", f"journal output read {started[2]} --summary")


def test_a_failed_picker_runs_again_at_the_next_hand_in(new_story, monkeypatch):
    story, repository, worker, started = affected_test_story(new_story, monkeypatch)
    ended(story, started[1], 1)
    repository.changed(worker.id, "cart.py", "TOTAL = 4\n")
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    story.expect_rows(len(started) == 3)
    story.container.get(OutputFolder).write_output(started[2], 1, "tests/other.py\n")
    ended(story, started[2], 0)
    ended(story, started[3], 0)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_an_empty_picker_result_finishes_without_an_extra_test(new_story, monkeypatch):
    story, _, _, started = affected_test_story(new_story, monkeypatch)
    ended(story, started[1], 0)
    story.expect_rows(len(started) == 2)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def test_picked_tests_run_when_the_proof_has_no_test_command(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main', actor=story.agent)
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, checked the cart"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    story.expect_rows(len(started) == 1)
    story.container.get(OutputFolder).write_output(started[0], 1, "tests/cart.py\n")
    ended(story, started[0], 0)
    ended(story, started[1], 0)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)


@pytest.mark.parametrize("setting", ("affected-tests-command", "project-test-command"))
def test_a_single_setting_does_not_run_the_picker(new_story, monkeypatch, setting):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success(f'setting set journal.suites.coding.workers.{setting} "python3 command.py" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    story.expect_rows(len(started) == 1)
    story.expect_text("task show 1", "state: completed", actor=story.agent)


def expect_cwd_options(options, expected) -> None:
    actual = options['cwd']
    assert actual == expected, actual


def test_three_failed_hand_ins_of_a_task_give_the_main_agent_a_line_the_worker_never_sees(new_story, monkeypatch):
    story, repository, worker, started = queued_story(new_story, monkeypatch)
    for attempt in range(2):
        ended(story, started[attempt], 1)
        repository.changed(worker.id, "cart.py", f"TOTAL = {attempt + 10}\n")
        story.expect_success("worker deliver --differences none", actor=worker)
        story.run_listeners()
    ended(story, started[2], 1)
    story.expect_rows("failed 3 hand-ins" not in story.run("task overview 1", actor=worker).output_text)
    repository.changed(worker.id, "cart.py", "TOTAL = 9\n")
    story.expect_success("worker deliver --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[3], 0)
    story.expect_text(f"worker logs {worker.id}", "! failed 3 hand-ins", actor=story.agent)
