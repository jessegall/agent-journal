from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.core.support.agent_labels import agent_number
import json
from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.tool_type import ToolType
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.line_outcome import LineOutcome
from engine.testing.stories.story import Story
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with, merger_can_start, running_launcher
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE
from engine.testing.expectations.expected_nudge import expected_nudge
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

QUESTION = "The sandbox has no compiler"
FIXTURE_QUESTION = "The fixture file is empty"
ALL_TOPICS = "judge, tests, built, conflict, tool, general"
PROCESS_START = "2026-10-31T09:00:00+00:00"
OPEN_QUESTION_LINE = "Your question is open"
READ_OF_A_FILE = HookSamples.tool_use("Read", ToolType.READ, ["cart.py"], None)


@dataclass(frozen=True)
class AskingWorker:
    """A dispatched worker that asks the merger, with the rows the stories compare."""

    story: Story
    repository: GitRepository
    worker: Actor

    def session(self) -> str:
        return worker_session(self.story, self.worker)

    def ask(self, text: str = QUESTION, topic: AskTopic | None = None) -> LineOutcome:
        flag = "" if topic is None else f" --about {topic}"
        return self.story.run(f'worker ask "{text}"{flag}', actor=self.worker)

    def post_question(self, text: str = QUESTION, topic: AskTopic | None = None) -> LineOutcome:
        outcome = self.ask(text, topic)
        assert outcome.code == 0, outcome.output_text
        return outcome

    def merger_lines(self) -> tuple[MergerLine, ...]:
        rows = self.story.story_rows(MergerLine)
        return tuple(row for row in rows if row.topic is not None)

    def facts(self) -> dict[str, object]:
        return json.loads(self.merger_lines()[-1].facts_json)

    def main_lines(self) -> str:
        self.story.run_listeners()
        return self.story.run(f"agent-line list --agent {self.story.agent.id}", actor=self.story.agent).output_text

    def status_line(self) -> str:
        return self.story.run("worker status", actor=self.worker).output_text.splitlines()[0]

    def worked_on(self) -> None:
        self.story.hook(self.session(), READ_OF_A_FILE)

    def program_ended(self) -> None:
        self.story.expect_success(f"agent edit {agent_number(self.story, self.worker.id)} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
        self.story.use_processes()
        self.story.tick("s-1")


def asking_worker(story: Story) -> AskingWorker:
    repository = repository_environment(story)
    return AskingWorker(story, repository, dispatched_worker(story))


@pytest.fixture
def asking(new_story):
    return asking_worker(new_story(fixture=OpenTaskOrchestrator))


@pytest.fixture
def merger_disabled_worker(new_story):
    return asking_worker(new_story(fixture=MergerOffOrchestrator))


@pytest.fixture
def asking_with_merger_running(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    questioning_worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    with running_launcher(questioning_worker.story):
        yield questioning_worker


@pytest.fixture
def open_question(asking):
    asking.post_question()
    return asking


@pytest.fixture
def changed_worker(asking):
    asking.repository.changed(asking.worker.id, "cart.py", CART_CHANGE)
    asking.story.expect_success(FIRST_PROOF, actor=asking.worker)
    return asking


@pytest.fixture
def judged(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    questioning_worker = asking_worker(story)
    questioning_worker.repository.changed(questioning_worker.worker.id, "cart.py", SINFUL_TEXT)
    story.expect_success(FIRST_PROOF, actor=questioning_worker.worker)
    story.expect_refusal(COMMIT, "cart.py has a sin", actor=questioning_worker.worker)
    return questioning_worker


def test_an_unknown_topic_is_refused_with_the_list_of_topics(asking):
    expect_refused_with(asking.story, f'worker ask "{QUESTION}" --about weather', "weather", ALL_TOPICS, actor=asking.worker)
    asking.story.expect_rows(asking.merger_lines() == ())


def test_the_ask_is_logged_on_the_task(open_question):
    open_question.story.expect_text("task-log list --task 1", f"worker {agent_number(open_question.story, open_question.worker.id)} asked the merger", QUESTION, actor=open_question.story.agent)


@pytest.mark.real_git
def test_the_facts_holds_the_last_refusal_of_the_worker(judged):
    judged.post_question(topic=AskTopic.JUDGE)
    judged.story.expect_rows("cart.py has a sin" in judged.facts()["refusal"], detail=str(judged.facts()))


def test_a_refusal_that_a_later_hand_in_cleared_is_not_in_the_facts(judged):
    judged.repository.changed(judged.worker.id, "cart.py", CART_CHANGE)
    judged.story.expect_success(COMMIT, actor=judged.worker)
    judged.post_question()
    judged.story.expect_rows(judged.facts()["refusal"] is None, judged.facts()["point"] == "wait", detail=str(judged.facts()))


def test_a_worker_that_handed_in_may_still_ask(changed_worker):
    changed_worker.story.expect_success(COMMIT, actor=changed_worker.worker)
    changed_worker.post_question(topic=AskTopic.TESTS)
    changed_worker.story.expect_rows(changed_worker.facts()["point"] == "wait", changed_worker.facts()["files"] == ["cart.py"], detail=str(changed_worker.facts()))


def test_a_worker_with_an_open_ask_may_stop_and_is_not_resumed(open_question):
    open_question.story.expect_hook_allowed(open_question.session(), HookSamples.stop())
    open_question.program_ended()
    open_question.story.expect_no_text(f"agent-line list --agent {open_question.worker.id}", "You ended with tasks left")


def test_going_on_working_closes_the_question_and_the_stop_is_refused_again(open_question):
    open_question.worked_on()
    open_question.story.expect_rows(OPEN_QUESTION_LINE not in open_question.status_line(), detail=open_question.status_line())
    open_question.story.expect_hook_refusal(open_question.session(), HookSamples.stop(), AskTopic.GENERAL.question_line())


def test_another_question_while_one_is_open_is_a_new_line_and_work_closes_both(asking):
    asking.post_question()
    asking.post_question(FIXTURE_QUESTION)
    asking.story.expect_rows(len(asking.merger_lines()) == 2)
    asking.worked_on()
    asking.story.expect_rows(OPEN_QUESTION_LINE not in asking.status_line(), detail=asking.status_line())


def test_asking_again_after_going_on_is_a_new_line(open_question):
    open_question.worked_on()
    open_question.post_question()
    open_question.story.expect_rows(len(open_question.merger_lines()) == 2)


def test_the_main_agent_hears_nothing_of_an_ask_and_sees_no_stuck_mark(asking_with_merger_running):
    asking_with_merger_running.post_question()
    lines = asking_with_merger_running.main_lines()
    marks = asking_with_merger_running.story.run("chat-mark list --environment 1").output_text
    asking_with_merger_running.story.expect_rows("is stuck" not in lines, QUESTION not in lines, "merger-line" not in lines, "is stuck" not in marks, detail=lines + marks)


def test_with_the_merger_off_an_ask_reaches_the_main_agent_and_the_worker_may_stop(merger_disabled_worker):
    outcome = merger_disabled_worker.post_question(topic=AskTopic.BUILT)
    line = merger_disabled_worker.merger_lines()[0]
    merger_disabled_worker.story.expect_rows(AskTopic.BUILT.waiting_work() in outcome.output_text, expected_nudge(MERGER_LINE_AVAILABLE).is_in(merger_disabled_worker.main_lines()), detail=merger_disabled_worker.main_lines())
    merger_disabled_worker.story.expect_text(f"merger-line show {line.id}", QUESTION, "point build", actor=merger_disabled_worker.story.agent)
    merger_disabled_worker.story.expect_hook_allowed(merger_disabled_worker.session(), HookSamples.stop())


def test_a_job_sent_to_a_worker_that_asked_gets_through(open_question):
    open_question.story.expect_hook_allowed(open_question.session(), HookSamples.stop())
    open_question.story.expect_success(f'worker send {agent_number(open_question.story, open_question.worker.id)} "Use clang" --wait', actor=open_question.story.agent)


def test_the_main_agent_cannot_ask(asking):
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "journal worker ask is for workers", actor=asking.story.agent)
    asking.story.expect_rows(asking.merger_lines() == ())


def test_a_person_cannot_ask(asking):
    person = Actor(asking.story.new_row_id('actor make user "Ada"'), ActorType.USER)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "journal worker ask is for workers", actor=person)


def test_a_helper_cannot_ask(asking):
    helper = asking.story.container.get(Bus).run(StartAgent("s-helper", "claude", CodingHelperRole.HELPER, asking.story.agent.id, profile=f"{RESEARCHER_PROFILE.name}"), Actor.core(), environment_id=1)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "journal worker ask is for workers", actor=Actor(helper.id, ActorType.AGENT))


def test_a_worker_with_no_task_cannot_ask(asking):
    asking.story.expect_success(f'worker release {agent_number(asking.story, asking.worker.id)} "not needed"', actor=asking.story.agent)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "no task", actor=asking.worker)
    asking.story.expect_rows(asking.merger_lines() == ())
