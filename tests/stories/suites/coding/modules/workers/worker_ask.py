import json
from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.testing.hook_samples import HookSamples
from core.testing.line_outcome import LineOutcome
from core.testing.story import Story
from suites.coding.modules.workers.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.support.coding_helper_role import CodingHelperRole
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, DELIVERY, FIRST_PROOF, dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with, merger_can_start, running_launcher

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

    def asked(self, text: str = QUESTION, topic: AskTopic | None = None) -> LineOutcome:
        outcome = self.ask(text, topic)
        assert outcome.code == 0, outcome.output_text
        return outcome

    def merger_lines(self) -> tuple[MergerLine, ...]:
        rows = self.story.container.get(Queries).query(MergerLine).oldest().all_rows()
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
        self.story.expect_success(f"agent edit {self.worker.id} --pid 700 --process-started-at {PROCESS_START}", "pid: 700")
        self.story.use_processes()
        self.story.tick("s-1")


def asking_worker(story: Story) -> AskingWorker:
    repository = repository_environment(story)
    return AskingWorker(story, repository, dispatched_worker(story))


@pytest.fixture
def asking(new_story):
    return asking_worker(new_story(fixture=OpenTaskOrchestrator))


@pytest.fixture
def asking_with_merger_off(new_story):
    return asking_worker(new_story(fixture=MergerOffOrchestrator))


@pytest.fixture
def asking_with_merger_running(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    questioning_worker = asking_worker(new_story(fixture=OpenTaskOrchestrator))
    with running_launcher(questioning_worker.story):
        yield questioning_worker


@pytest.fixture
def open_question(asking):
    asking.asked()
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
    story.expect_refusal(DELIVERY, "cart.py has a sin", actor=questioning_worker.worker)
    return questioning_worker


@pytest.mark.parametrize("topic", list(AskTopic))
def test_an_ask_for_each_topic_reaches_the_merger_with_its_facts_and_gives_the_meanwhile_line(asking, topic):
    outcome = asking.asked(topic=topic)
    line = asking.merger_lines()[0]
    asking.story.expect_rows(topic.waiting_work() in outcome.output_text, line.topic is topic, QUESTION in line.text, f"worker {asking.worker.id}" in line.text, f"task 1" in line.text, detail=outcome.output_text + line.text)
    facts = asking.facts()
    asking.story.expect_rows(facts["point"] == "build", facts["task"] == 1, facts["refusal"] is None, facts["outputs"] == [], facts["files"] == [], detail=str(facts))


def test_the_answer_of_an_ask_also_says_what_to_do_now(open_question):
    outcome = open_question.asked(FIXTURE_QUESTION)
    open_question.story.expect_rows("Now:" in outcome.output_text, "Then:" in outcome.output_text, detail=outcome.output_text)


def test_an_ask_without_a_topic_is_about_other(asking):
    outcome = asking.asked()
    asking.story.expect_rows(asking.merger_lines()[0].topic is AskTopic.GENERAL, AskTopic.GENERAL.waiting_work() in outcome.output_text, detail=outcome.output_text)


def test_an_unknown_topic_is_refused_with_the_list_of_topics(asking):
    expect_refused_with(asking.story, f'worker ask "{QUESTION}" --about weather', "weather", ALL_TOPICS, actor=asking.worker)
    asking.story.expect_rows(asking.merger_lines() == ())


def test_an_empty_ask_is_refused(asking):
    asking.story.expect_refusal('worker ask "   "', "say what you need", actor=asking.worker)
    asking.story.expect_rows(asking.merger_lines() == ())


def test_the_ask_is_logged_on_the_task(open_question):
    open_question.story.expect_text("task-log list --task 1", f"worker {open_question.worker.id} asked the merger", QUESTION, actor=open_question.story.agent)


def test_the_facts_holds_the_files_the_worker_changed(changed_worker):
    changed_worker.asked()
    changed_worker.story.expect_rows(changed_worker.facts()["files"] == ["cart.py"], detail=str(changed_worker.facts()))


def test_the_facts_holds_the_last_three_outputs_of_the_worker(asking):
    main = asking.story.agent
    asking.story.agent = asking.worker
    processes = [start_process(asking.story, f"echo step{number}") for number in range(4)]
    asking.story.agent = main
    asking.asked()
    outputs = asking.facts()["outputs"]
    asking.story.expect_rows(len(outputs) == 3, all(f"output {process.id}" in text for process, text in zip(reversed(processes[1:]), outputs, strict=True)), "step3" in outputs[0], not any("step0" in text for text in outputs), detail=str(outputs))


@pytest.mark.real_git
def test_the_facts_holds_the_last_refusal_of_the_worker(judged):
    judged.asked(topic=AskTopic.JUDGE)
    judged.story.expect_rows("cart.py has a sin" in judged.facts()["refusal"], detail=str(judged.facts()))


@pytest.mark.real_git
def test_a_refusal_that_a_later_hand_in_cleared_is_not_in_the_facts(judged):
    judged.repository.changed(judged.worker.id, "cart.py", CART_CHANGE)
    judged.story.expect_success(DELIVERY, actor=judged.worker)
    judged.asked()
    judged.story.expect_rows(judged.facts()["refusal"] is None, judged.facts()["point"] == "wait", detail=str(judged.facts()))


def test_a_worker_that_handed_in_may_still_ask(changed_worker):
    changed_worker.story.expect_success(DELIVERY, actor=changed_worker.worker)
    changed_worker.asked(topic=AskTopic.TESTS)
    changed_worker.story.expect_rows(changed_worker.facts()["point"] == "wait", changed_worker.facts()["files"] == ["cart.py"], detail=str(changed_worker.facts()))


def test_a_worker_with_an_open_ask_is_at_the_question_point(open_question):
    open_question.story.expect_rows(OPEN_QUESTION_LINE in open_question.status_line(), detail=open_question.status_line())


def test_a_worker_with_an_open_ask_may_stop_and_is_not_resumed(open_question):
    open_question.story.expect_hook_allowed(open_question.session(), HookSamples.stop())
    open_question.program_ended()
    open_question.story.expect_no_text(f"agent-line list --agent {open_question.worker.id}", "you ended with tasks left")


def test_going_on_working_closes_the_question_and_the_stop_is_refused_again(open_question):
    open_question.worked_on()
    open_question.story.expect_rows(OPEN_QUESTION_LINE not in open_question.status_line(), detail=open_question.status_line())
    open_question.story.expect_hook_refusal(open_question.session(), HookSamples.stop(), AskTopic.GENERAL.question_line())


def test_asking_the_same_twice_sends_one_line_and_gives_the_same_answer(asking):
    first = asking.asked()
    second = asking.asked()
    asking.story.expect_rows(len(asking.merger_lines()) == 1, second.output_text == first.output_text, detail=second.output_text)


def test_the_same_text_about_another_topic_is_a_new_ask(asking):
    asking.asked(topic=AskTopic.TOOL)
    asking.asked(topic=AskTopic.JUDGE)
    asking.story.expect_rows([line.topic for line in asking.merger_lines()] == [AskTopic.TOOL, AskTopic.JUDGE])


def test_another_question_while_one_is_open_is_a_new_line_and_work_closes_both(asking):
    asking.asked()
    asking.asked(FIXTURE_QUESTION)
    asking.story.expect_rows(len(asking.merger_lines()) == 2)
    asking.worked_on()
    asking.story.expect_rows(OPEN_QUESTION_LINE not in asking.status_line(), detail=asking.status_line())


def test_asking_again_after_going_on_is_a_new_line(open_question):
    open_question.worked_on()
    open_question.asked()
    open_question.story.expect_rows(len(open_question.merger_lines()) == 2)


def test_the_main_agent_hears_nothing_of_an_ask_and_sees_no_stuck_mark(asking_with_merger_running):
    asking_with_merger_running.asked()
    lines = asking_with_merger_running.main_lines()
    marks = asking_with_merger_running.story.run("chat-mark list --environment 1").output_text
    asking_with_merger_running.story.expect_rows("is stuck" not in lines, QUESTION not in lines, "merger-line" not in lines, "is stuck" not in marks, detail=lines + marks)


def test_an_ask_wakes_the_merger_which_reads_it_with_its_facts_once(asking_with_merger_running):
    asking_with_merger_running.asked(topic=AskTopic.TOOL)
    asking_with_merger_running.story.run_listeners()
    merger = Actor(merger_agent(asking_with_merger_running.story).id, ActorType.AGENT)
    asking_with_merger_running.story.expect_text("merger next", QUESTION, "tool", "point build", "task 1", actor=merger)
    asking_with_merger_running.story.expect_no_text("merger next", QUESTION, actor=merger)


def test_with_the_merger_off_an_ask_reaches_the_main_agent_and_the_worker_may_stop(asking_with_merger_off):
    outcome = asking_with_merger_off.asked(topic=AskTopic.BUILT)
    line = asking_with_merger_off.merger_lines()[0]
    asking_with_merger_off.story.expect_rows(AskTopic.BUILT.waiting_work() in outcome.output_text, f"merger-line:{line.id}" in asking_with_merger_off.main_lines(), detail=asking_with_merger_off.main_lines())
    asking_with_merger_off.story.expect_text(f"merger-line show {line.id}", QUESTION, "point build", actor=asking_with_merger_off.story.agent)
    asking_with_merger_off.story.expect_hook_allowed(asking_with_merger_off.session(), HookSamples.stop())


def test_a_job_sent_to_a_worker_that_asked_gets_through(open_question):
    open_question.story.expect_hook_allowed(open_question.session(), HookSamples.stop())
    open_question.story.expect_success(f'worker send {open_question.worker.id} "Use clang" --wait', actor=open_question.story.agent)


def test_the_main_agent_cannot_ask(asking):
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "only a worker asks", actor=asking.story.agent)
    asking.story.expect_rows(asking.merger_lines() == ())


def test_a_person_cannot_ask(asking):
    person = Actor(asking.story.new_row_id('actor make user "Ada"'), ActorType.USER)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "only a worker asks", actor=person)


def test_a_helper_cannot_ask(asking):
    helper = asking.story.container.get(Bus).run(StartAgent("s-helper", "claude", CodingHelperRole.HELPER, asking.story.agent.id, profile="journal-researcher"), Actor.core(), environment_id=1)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "only a worker asks", actor=Actor(helper.id, ActorType.AGENT))


def test_a_worker_with_no_task_cannot_ask(asking):
    asking.story.expect_success(f'worker release {asking.worker.id} "not needed"', actor=asking.story.agent)
    asking.story.expect_refusal(f'worker ask "{QUESTION}"', "no task", actor=asking.worker)
    asking.story.expect_rows(asking.merger_lines() == ())
