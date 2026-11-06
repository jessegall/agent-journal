import pytest

from core.base.command.bus import Bus
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test import AskWorkerTest
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test import UseWorkerTest
from tests.stories.suites.coding.modules.workers.support.phase_steps import OTHER_TEST_LINE, TEST_LINE, RunRequest, worker_on_plan

WHY = "the rounding only shows in a real run"
ALLOW = "worker allow-test 1"
ASKED = RunRequest(1, TEST_LINE, WHY, "asked")


def ask(worker, line: str = TEST_LINE) -> None:
    worker.story.container.get(Bus).run(AskWorkerTest(worker.worker.id, 1, line, WHY), worker.worker, environment_id=1)


@pytest.fixture
def asked(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    ask(worker)
    return worker


def test_asking_saves_one_request_logs_it_on_the_task_and_tells_the_main_agent_once(asked):
    ask(asked)
    assert asked.run_requests() == (ASKED,), asked.run_requests()
    asked.story.expect_text("task inspect 1 --json", TEST_LINE, WHY, actor=asked.story.agent)
    lines = asked.main_agent_lines()
    assert len(lines) == 1 and TEST_LINE in lines[0] and WHY in lines[0] and ALLOW in lines[0], lines


def test_asking_for_another_command_saves_its_own_request(asked):
    ask(asked, OTHER_TEST_LINE)
    assert asked.run_requests() == (ASKED, RunRequest(2, OTHER_TEST_LINE, WHY, "asked")), asked.run_requests()


def test_allow_test_is_refused_for_a_request_that_does_not_exist(asked):
    asked.story.expect_refusal("worker allow-test 9", "9", actor=asked.story.agent)


def test_a_worker_cannot_allow_its_own_request_through_the_command(asked):
    asked.story.expect_refusal(ALLOW, "main agent", actor=asked.worker)
    assert asked.run_requests() == (ASKED,), asked.run_requests()


def test_allow_test_allows_once_and_tells_the_worker(asked):
    asked.story.expect_success(ALLOW, actor=asked.story.agent)
    assert any("request 1" in line and TEST_LINE in line for line in asked.worker_lines()), asked.worker_lines()
    asked.story.expect_refusal(ALLOW, "already allowed", actor=asked.story.agent)


def test_a_person_can_allow_a_request(asked):
    asked.story.expect_success(ALLOW, actor=asked.story.user)
    asked.story.expect_text("task inspect 1 --json", "allowed the run of request 1", actor=asked.story.agent)


def test_allow_test_is_refused_for_a_request_already_used(asked):
    asked.story.expect_success(ALLOW, actor=asked.story.user)
    asked.story.container.get(Bus).run(UseWorkerTest(1), asked.worker, environment_id=1)
    asked.story.expect_refusal(ALLOW, "already used", actor=asked.story.agent)
    asked.story.expect_text("task inspect 1 --json", "ran request 1", actor=asked.story.agent)
