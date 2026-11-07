from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.conditions.agent_family import AgentFamily
import pytest

from core.base.command.bus import Bus
from suites.coding.modules.workers.commands.ask_worker_test.ask_worker_test import AskWorkerTest
from suites.coding.modules.workers.commands.use_worker_test.use_worker_test import UseWorkerTest
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, TEST_LINE, RunRequest, worker_on_plan

WHY = "the rounding only shows in a real run"
ALLOW = "worker allow-test 1"
REQUESTED = RunRequest(1, TEST_LINE, WHY, "requested")


def ask(worker, line: str = TEST_LINE) -> None:
    worker.story.container.get(Bus).run(AskWorkerTest(worker.worker.id, 1, line, WHY), worker.worker, environment_id=1)


@pytest.fixture
def requested(new_story, monkeypatch):
    worker = worker_on_plan(new_story, monkeypatch)
    ask(worker)
    return worker


def test_asking_saves_one_request_logs_it_on_the_task_and_tells_the_main_agent_once(requested):
    ask(requested)
    requested.story.expect_rows(requested.run_requests() == tuple([REQUESTED]))
    requested.story.expect_text("task inspect 1 --json", TEST_LINE, WHY, actor=requested.story.agent)
    lines = requested.main_agent_lines()
    requested.story.expect_text("worker-test-request show 1", TEST_LINE, WHY, actor=requested.story.agent)
    requested.story.expect_rows(len(lines) == 1 and TEST_LINE not in lines[0] and WHY not in lines[0] and "request:1" in lines[0])


def test_asking_for_another_command_saves_its_own_request(requested):
    ask(requested, SECOND_TEST_LINE)
    requested.story.expect_rows(requested.run_requests() == (REQUESTED, RunRequest(2, SECOND_TEST_LINE, WHY, "requested")))


def test_allow_test_is_refused_for_a_request_that_does_not_exist(requested):
    requested.story.expect_refusal("worker allow-test 9", "9", actor=requested.story.agent)


def test_a_worker_cannot_allow_its_own_request_through_the_command(requested):
    requested.story.expect_refusal(ALLOW, "main agent", actor=requested.worker)
    requested.story.expect_rows(requested.run_requests() == tuple([REQUESTED]))


def test_allow_test_allows_once_and_tells_the_worker(requested):
    requested.story.expect_success(ALLOW, actor=requested.story.agent)
    requested.story.expect_rows(any("request 1" in line and "worker-test-request show 1" in line for line in requested.worker_lines()))
    requested.story.expect_refusal(ALLOW, "already allowed", actor=requested.story.agent)


def test_a_person_can_allow_a_request(requested):
    requested.story.expect_success(ALLOW, actor=requested.story.user)
    requested.story.expect_text("task inspect 1 --json", "allowed the run of request 1", actor=requested.story.agent)


def test_allow_test_is_refused_for_a_request_already_used(requested):
    requested.story.expect_success(ALLOW, actor=requested.story.user)
    requested.story.container.get(Bus).run(UseWorkerTest(1), requested.worker, environment_id=1)
    requested.story.expect_refusal(ALLOW, "already used", actor=requested.story.agent)
    requested.story.expect_text("task inspect 1 --json", "ran request 1", actor=requested.story.agent)


@pytest.fixture
def requested_of_ended_main(requested):
    story = requested.story
    launcher = story.new_row_id("agent start s-launcher claude main --environment main")
    story.expect_success(f"agent end {launcher}", actor=story.user)
    story.run_listeners()
    story.expect_text(f"agent show {requested.worker.id}", f"parent_id: {launcher}", actor=story.user)
    return requested


def test_the_main_agent_of_the_environment_allows_a_request_of_a_worker_whose_parent_is_a_main_agent_that_ended(requested_of_ended_main):
    requested_of_ended_main.story.expect_success(ALLOW, actor=requested_of_ended_main.story.agent)


def test_the_family_of_a_main_agent_holds_a_worker_whose_parent_is_a_main_agent_that_ended(requested_of_ended_main):
    story = requested_of_ended_main.story
    family = story.container.get(Queries).query(Agent).matching(AgentFamily(story.agent.id)).all_rows()
    story.expect_rows(requested_of_ended_main.worker.id in {agent.id for agent in family})
