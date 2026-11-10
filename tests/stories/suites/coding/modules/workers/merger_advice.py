from tests.stories.core.support.agent_labels import agent_number
from dataclasses import dataclass
from pathlib import Path

import pytest

import suites.coding.modules.workers as workers_package
from engine.enums.tool_type import ToolType
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.line_outcome import LineOutcome
from suites.coding.modules.workers.models.merger_advice import MergerAdvice
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger_cases import MergerCase, merger_case, running_merger
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with, merger_can_start
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_without

ADVICES = (
    "Check the rounding rule in the cart",
    "Read the failing assertion before the fixture",
    "The tax table has moved to another module",
    "Run only the totals story next",
    "Keep the currency symbol out of the model",
    "Stop and wait for the base branch to settle",
)
MERGER_ROLE_REFUSAL = "only the merger runs this"
MERGER_MESSAGE_LIMIT_LINE = "5 of 5 used in this group"
QUESTION_LIMIT_LINE = "5 of 5 asks used in this group"
VISIT_LIMIT_LINE = "already advised"
UNCHANGED_POINT_LINE = "has not changed"
IDLE_WORKER_LINE = "has no open work"
ADVISE_COMMAND = "journal merger advise"
READ_OF_A_FILE = HookSamples.tool_use("Read", ToolType.READ, ["cart.py"], None)
SECOND_DISPATCH = "worker dispatch --test-command python=pytest --model sonnet 2"


@dataclass(frozen=True)
class AdvisedWorker:
    """A worker with the merger running, and the steps that give advice, move the worker and count the rows."""

    case: MergerCase

    @property
    def story(self):
        return self.case.story

    @property
    def worker(self):
        return self.case.worker

    @property
    def merger(self):
        return self.case.merger

    def advise(self, text: str = ADVICES[0]) -> LineOutcome:
        return self.story.run(f'merger advise {agent_number(self.story, self.worker.id)} "{text}"', actor=self.merger)

    def advised(self, text: str = ADVICES[0], used: int = 1) -> None:
        outcome = self.advise(text)
        assert outcome.code == 0 and f"{used} of 5" in outcome.output_text, outcome.output_text

    def visit(self) -> None:
        self.story.expect_success("merger next", actor=self.merger)

    def ask(self, number: int) -> LineOutcome:
        return self.story.run(f'worker ask "Question {number}"', actor=self.worker)

    def post_questions(self, number: int) -> None:
        outcome = self.ask(number)
        assert outcome.code == 0, outcome.output_text

    def worked_on(self) -> None:
        self.story.hook(worker_session(self.story, self.worker), READ_OF_A_FILE)

    def moved(self, number: int) -> None:
        if number % 2 == 0:
            self.post_questions(number)
        else:
            self.worked_on()

    def advised_five_times(self) -> None:
        self.advised(ADVICES[0], 1)
        for number in range(2, 6):
            self.moved(number)
            self.visit()
            self.advised(ADVICES[number - 1], number)

    def with_five_asks(self) -> "AdvisedWorker":
        for number in range(1, 6):
            self.post_questions(number)
        return self

    def merger_message_rows(self) -> tuple[MergerAdvice, ...]:
        return tuple(self.story.container.get(Queries).query(MergerAdvice).filter(worker_id=self.worker.id).oldest().all_rows())

    def messages(self) -> tuple[Message, ...]:
        return tuple(self.story.container.get(Queries).query(Message).filter(session_agent_id=self.merger.id, target_agent_id=self.worker.id).oldest().all_rows())

    def question_lines(self) -> tuple[MergerLine, ...]:
        rows = self.story.container.get(Queries).query(MergerLine).oldest().all_rows()
        return tuple(row for row in rows if row.topic is not None)

    def delivered(self) -> None:
        self.case.repository.changed(self.worker.id, "cart.py", CART_CHANGE)
        self.story.expect_success(FIRST_PROOF, actor=self.worker)
        self.story.expect_success(DELIVERY, actor=self.worker)
        self.story.expect_success("proof check 1", "state: checked", actor=self.story.agent)
        self.story.expect_success(f"worker logs {agent_number(self.story, self.worker.id)}", actor=self.story.agent)
        self.case.repository.checkout(ENVIRONMENT_BRANCH)

    def merged(self) -> None:
        self.story.expect_success(f"worker merge --wait {agent_number(self.story, self.worker.id)}", actor=self.story.agent)

    def given_new_work(self) -> None:
        task = self.story.new_row_id('task make "Add the shipping line" --environment main')
        self.story.expect_success(f"worker send --wait {agent_number(self.story, self.worker.id)} --task {task}", actor=self.story.agent)


@pytest.fixture
def advising(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    story = new_story(fixture=OpenTaskOrchestrator)
    return AdvisedWorker(merger_case(story, repository_environment(story)))


@pytest.fixture
def planned(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    worker: StoryWorker = start_planned_worker(new_story, monkeypatch)
    return worker, AdvisedWorker(MergerCase(worker.story, worker.repository, worker.worker, running_merger(worker.story, worker.worker)))


@pytest.fixture
def merger_disabled_plan(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository = repository_environment(story)
    return AdvisedWorker(MergerCase(story, repository, dispatched_worker(story), story.agent)).with_five_asks()


@pytest.fixture
def advised_and_delivered(advising):
    advising.advised(ADVICES[0], 1)
    advising.delivered()
    return advising


@pytest.fixture
def twice_advised_and_delivered(advised_and_delivered):
    advised_and_delivered.visit()
    advised_and_delivered.advised(ADVICES[1], 2)
    return advised_and_delivered


@pytest.fixture
def merged_worker(advising):
    advising.delivered()
    advising.merged()
    return advising


@pytest.fixture
def five_questions(advising):
    return advising.with_five_asks()


@pytest.fixture
def merged_after_five_asks(five_questions):
    five_questions.delivered()
    five_questions.merged()
    return five_questions


@pytest.fixture
def planned_with_three_asks(planned):
    worker, advised = planned
    for number in range(1, 4):
        advised.post_questions(number)
    return worker, advised


def test_advise_still_reaches_the_worker_as_a_message_from_the_merger(advising):
    advising.advised()
    advising.story.expect_rows([row.text for row in advising.messages()] == [ADVICES[0]], len(advising.merger_message_rows()) == 1, detail=str(advising.messages()))
    advising.story.expect_text(f"agent-line list --agent {advising.worker.id}", f"agent:{advising.merger.id} reports in message:", actor=advising.worker)


def test_a_burst_of_lines_about_one_worker_becomes_one_advice(advising):
    for line in ("The cart test fails", "The tax test fails too", "Now the totals test fails"):
        advising.story.expect_success(f'worker report "{line}"', actor=advising.worker)
    advising.visit()
    advising.advised(ADVICES[0], 1)
    expect_refused_with(advising.story, f'merger advise {agent_number(advising.story, advising.worker.id)} "{ADVICES[1]}"', VISIT_LIMIT_LINE, "one", actor=advising.merger)
    advising.story.expect_rows(len(advising.messages()) == 1, detail=str(advising.messages()))


def test_a_visit_with_nothing_waiting_is_still_a_new_visit(advising):
    advising.visit()
    advising.advised(ADVICES[0], 1)
    advising.moved(2)
    advising.visit()
    advising.story.expect_text("merger next", "", actor=advising.merger)
    advising.advised(ADVICES[1], 2)


def test_an_advice_at_an_unchanged_point_is_refused(advising):
    advising.advised(ADVICES[0], 1)
    advising.visit()
    expect_refused_with(advising.story, f'merger advise {agent_number(advising.story, advising.worker.id)} "{ADVICES[1]}"', UNCHANGED_POINT_LINE, actor=advising.merger)
    advising.story.expect_rows(len(advising.messages()) == 1, detail=str(advising.messages()))


def test_the_same_step_on_the_next_task_is_a_new_point(planned):
    worker, advised = planned
    advised.advised(ADVICES[0], 1)
    outcome = worker.prove_advance()
    expect_value(outcome.code, 0)
    advised.visit()
    advised.advised(ADVICES[1], 2)
    advised.story.expect_rows([row.task_id for row in advised.merger_message_rows()] == [1, 2], [row.step for row in advised.merger_message_rows()] == ["build", "build"], detail=str(advised.merger_message_rows()))


def test_the_first_advice_of_a_new_group_is_counted_from_one_at_an_unchanged_point(planned):
    _, advised = planned
    advised.advised(ADVICES[0], 1)
    advised.story.expect_success("phase place 1 --phase 2", actor=advised.story.agent)
    advised.visit()
    advised.advised(ADVICES[1], 1)


def test_each_worker_has_its_own_count_and_its_own_advice_in_a_visit(advising):
    advising.story.new_row_id('task make "Add the shipping line" --environment main')
    second = AdvisedWorker(MergerCase(advising.story, advising.case.repository, dispatched_worker(advising.story, SECOND_DISPATCH), advising.merger))
    advising.visit()
    advising.advised(ADVICES[0], 1)
    second.advised(ADVICES[1], 1)


@pytest.mark.parametrize("sender", ["worker", "main"])
def test_only_the_merger_advises(advising, sender):
    actor = advising.worker if sender == "worker" else advising.story.agent
    expect_refused_with(advising.story, f'merger advise {agent_number(advising.story, advising.worker.id)} "{ADVICES[0]}"', MERGER_ROLE_REFUSAL, actor=actor)
    advising.story.expect_rows(advising.merger_message_rows() == (), detail=str(advising.merger_message_rows()))


def test_a_merged_worker_cannot_be_advised_until_it_has_new_work(merged_worker):
    expect_refused_with(merged_worker.story, f'merger advise {agent_number(merged_worker.story, merged_worker.worker.id)} "{ADVICES[0]}"', IDLE_WORKER_LINE, actor=merged_worker.merger)


def test_the_count_resets_when_the_group_is_merged(twice_advised_and_delivered):
    twice_advised_and_delivered.merged()
    twice_advised_and_delivered.given_new_work()
    twice_advised_and_delivered.visit()
    twice_advised_and_delivered.advised(ADVICES[2], 1)


def test_a_failed_merge_does_not_reset_the_count(advised_and_delivered):
    advised_and_delivered.case.repository.uncommitted("cart.py", "TOTAL = 5\n")
    expect_refused_with(advised_and_delivered.story, f"worker merge --wait {agent_number(advised_and_delivered.story, advised_and_delivered.worker.id)}", "uncommitted changes to cart.py", actor=advised_and_delivered.story.agent)
    advised_and_delivered.visit()
    advised_and_delivered.advised(ADVICES[1], 2)


def test_the_journal_own_lines_do_not_count(advising):
    advising.story.expect_success('worker report "The cart needs a second look"', actor=advising.worker)
    advising.visit()
    advising.story.expect_success(f'merger findings {agent_number(advising.story, advising.worker.id)} "The total is off by one"', actor=advising.merger)
    advising.story.run_listeners()
    advising.story.expect_rows(advising.merger_message_rows() == (), detail=str(advising.merger_message_rows()))
    advising.advised(ADVICES[0], 1)


def test_the_merger_cannot_message_a_worker_directly_and_is_told_advise(advising):
    expect_refused_with(advising.story, f'message send "{ADVICES[0]}" --to agent:{agent_number(advising.story, advising.worker.id)}', "only through advise", ADVISE_COMMAND, actor=advising.merger)
    advising.story.expect_rows(advising.messages() == (), detail=str(advising.messages()))


def test_the_merger_can_still_message_the_main_agent(advising):
    advising.story.expect_success(f'message send "The merge waits on a clean checkout" --to agent:{agent_number(advising.story, advising.story.agent.id)}', actor=advising.merger)


def test_a_worker_message_to_the_merger_is_not_refused(advising):
    advising.story.expect_success(f'message send "Rebased on the branch" --to agent:{agent_number(advising.story, advising.merger.id)}', actor=advising.worker)


def test_the_sixth_ask_in_a_group_is_refused_and_the_first_of_the_next_group_goes_through(planned_with_three_asks):
    _, advised = planned_with_three_asks
    advised.post_questions(4)
    advised.post_questions(5)
    expect_refused_with(advised.story, 'worker ask "Question 6"', QUESTION_LIMIT_LINE, "wait for the merge", actor=advised.worker)
    advised.story.expect_rows(len(advised.question_lines()) == 5, detail=str(advised.question_lines()))
    advised.story.expect_success("phase place 1 --phase 2", actor=advised.story.agent)
    advised.post_questions(7)
    advised.story.expect_rows(len(advised.question_lines()) == 6, detail=str(advised.question_lines()))


def test_the_asks_count_starts_again_after_the_merge(merged_after_five_asks):
    merged_after_five_asks.given_new_work()
    merged_after_five_asks.post_questions(6)
    merged_after_five_asks.story.expect_rows(len(merged_after_five_asks.question_lines()) == 6, detail=str(merged_after_five_asks.question_lines()))


def test_a_refused_ask_writes_no_line_and_opens_no_wait(five_questions):
    expect_refused_with(five_questions.story, 'worker ask "Question 6"', QUESTION_LIMIT_LINE, actor=five_questions.worker)
    five_questions.story.expect_no_text("task-log list --task 1", "Question 6")
    five_questions.story.expect_no_text(f"wait list --agent {five_questions.worker.id}", "Question 6")


def test_the_ask_limit_holds_with_the_merger_off(merger_disabled_plan):
    expect_refused_with(merger_disabled_plan.story, 'worker ask "Question 6"', QUESTION_LIMIT_LINE, actor=merger_disabled_plan.worker)


def test_a_worker_that_answers_to_a_group_of_tasks_counts_asks_for_the_group_not_per_task(planned_with_three_asks):
    worker, advised = planned_with_three_asks
    advised.worked_on()
    outcome = worker.prove_advance()
    expect_value(outcome.code, 0)
    advised.post_questions(4)
    advised.post_questions(5)
    expect_refused_with(advised.story, 'worker ask "Question 6"', QUESTION_LIMIT_LINE, actor=advised.worker)


def test_the_merger_profile_and_skill_name_advise_and_its_limits():
    profile = next(row.body for row in HELPER_PROFILES if row.name == "journal-merger")
    skill = (Path(workers_package.__file__).parent / "skills" / "journal-merger" / "SKILL.md").read_text()
    for text in (profile, skill):
        expect_value(ADVISE_COMMAND in text and "five per group" in text and "one per visit" in text and "the point changed" in text, True)
        expect_value_without(text, "journal message send")
