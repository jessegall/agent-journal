from dataclasses import dataclass
from pathlib import Path

from core.modules.messages.models.message import Message
from engine.enums.tool_type import ToolType
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.line_outcome import LineOutcome
from suites.coding.modules.workers.models.merger_advice import MergerAdvice
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.merger_cases import MergerCase
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.support.story_checks import expect_value, expect_value_without
import suites.coding.modules.workers as workers_package

TEST_ROWS_REASON = "the test reads every row it checks"
ADVICES = (
    "Check the rounding rule in the cart",
    "Read the failing assertion before the fixture",
    "The tax table has moved to another module",
    "Run only the totals story next",
    "Keep the currency symbol out of the model",
    "Stop and wait for the base branch to settle",
)
MERGER_ROLE_REFUSAL = "only the merger runs this"
MERGER_MESSAGE_LIMIT_LINE = "5 of 5 used since the worker's last commit"
MAIN_AGENT_HAS_IT = "the main agent has your question now"
MERGER_HAS_IT = "the merger has your question"
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
        return tuple(self.story.container.get(Queries).query(MergerAdvice).filter(worker_id=self.worker.id).every_row(TEST_ROWS_REASON))

    def messages(self) -> tuple[Message, ...]:
        return tuple(self.story.container.get(Queries).query(Message).filter(session_agent_id=self.merger.id, target_agent_id=self.worker.id).every_row(TEST_ROWS_REASON))

    def question_lines(self) -> tuple[MergerLine, ...]:
        rows = self.story.story_rows(MergerLine)
        return tuple(row for row in rows if row.topic is not None)

    def delivered(self) -> None:
        self.case.repository.changed(self.worker.id, "cart.py", CART_CHANGE)
        self.story.expect_success(FIRST_PROOF, actor=self.worker)
        self.story.expect_success(COMMIT, actor=self.worker)
        self.story.expect_success("proof check 1", "state: checked", actor=self.story.agent)
        self.story.expect_success(f"worker logs {agent_number(self.story, self.worker.id)}", actor=self.story.agent)
        self.case.repository.checkout(ENVIRONMENT_BRANCH)

    def merged(self) -> None:
        request_merge(self.story, self.worker)
        self.story.expect_success(f"worker merge --wait {agent_number(self.story, self.worker.id)}", actor=self.story.agent)

    def given_new_work(self) -> None:
        task = self.story.new_row_id('task make "Add the shipping line" --environment main')
        self.story.expect_success(f"worker send --wait {agent_number(self.story, self.worker.id)} --task {task}", actor=self.story.agent)


def test_the_merger_profile_and_skill_name_advise_and_its_limits():
    profile = next(row.body for row in HELPER_PROFILES if row.name == f"{MERGER_PROFILE.name}")
    skill = (Path(workers_package.__file__).parent / "skills" / f"{MERGER_PROFILE.name}" / "SKILL.md").read_text()
    for text in (profile, skill):
        expect_value(ADVISE_COMMAND in text and "five between two commits of the worker" in text and "one per visit" in text and "the point changed" in text, True)
        expect_value_without(text, "journal message send")
