from datetime import timedelta

from core.modules.waits.models.enums.wait_state import WaitState
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.ask_ledger import QUESTION, SECOND_QUESTION, ask, end_unanswered_visit, questions, waits_of
from tests.stories.suites.coding.modules.workers.merger_cases import case  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with

MERGER_QUESTION_LINE = 'merger tell "The worker cannot build" --tried "I read its facts" --option "answer the worker" --option "release the worker" --recommend "answer the worker"'
FORWARD_MINUTES = "journal.suites.coding.workers.ask-pass-on-minutes"
ANSWER_MINUTES = "journal.suites.coding.workers.ask-answer-minutes"
FORWARDED_LINE = "Your question went to the main agent"
MESSAGES = "message list --json --limit 20 --environment main"


def watch(case) -> None:
    AskWatch()(case.story.container)
    case.story.run_listeners()


def messages(case) -> str:
    return case.story.run(MESSAGES, actor=case.story.agent).output_text


def test_a_merger_that_asks_the_main_agent_about_a_worker_forwards_its_asks_and_a_second_time_is_refused(case):
    ask(case)
    case.story.expect_success("merger next", actor=case.merger)
    case.story.expect_success(f"{MERGER_QUESTION_LINE} --worker {agent_number(case.story, case.worker.id)}", actor=case.merger)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.FORWARDED, "What: The worker cannot build" in messages(case), detail=messages(case))
    expect_refused_with(case.story, f"{MERGER_QUESTION_LINE} --worker {agent_number(case.story, case.worker.id)}", "is with the main agent since", "you need not tell it again", actor=case.merger)


def test_a_forwarded_ask_is_said_to_the_worker_and_leaves_its_wait_open_so_it_may_stop(case):
    ask(case)
    case.story.advance(timedelta(minutes=31))
    watch(case)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.FORWARDED, waits_of(case.story, case.worker)[0].state is WaitState.OPEN, FORWARDED_LINE in case.worker_lines(), detail=case.worker_lines())


def test_only_after_the_forward_time_the_journal_writes_the_question_itself_even_while_the_merger_reads(case):
    ask(case)
    case.story.advance(timedelta(minutes=29))
    watch(case)
    case.story.expect_rows(questions(case.story)[0].outcome is None, detail="29 minutes after the ask nothing is forwarded")
    case.story.expect_success("merger next", actor=case.merger)
    case.story.advance(timedelta(minutes=2))
    watch(case)
    text = messages(case)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.FORWARDED, "the merger read it 1 times and settled nothing" in text,
                           "answer the worker" in text and "release the worker" in text, "read the worker's facts first" in text, QUESTION in text, detail=text)


def test_an_ask_the_merger_read_twice_without_an_outcome_is_forwarded_at_once(case):
    ask(case)
    end_unanswered_visit(case)
    watch(case)
    case.story.expect_rows(questions(case.story)[0].outcome is None, detail="one reading is under the limit of two")
    end_unanswered_visit(case)
    watch(case)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.FORWARDED, detail=str(questions(case.story)[0]))


def test_several_open_asks_of_one_worker_are_forwarded_as_one_message(case):
    ask(case)
    ask(case, SECOND_QUESTION, AskTopic.TESTS)
    case.story.advance(timedelta(minutes=31))
    watch(case)
    text = messages(case)
    case.story.expect_rows(all(line.outcome is AskOutcome.FORWARDED for line in questions(case.story)), text.count("What: ") == 1, QUESTION in text, SECOND_QUESTION in text, detail=text)


def test_a_message_of_the_main_agent_to_the_worker_ends_the_escalation_so_a_later_ask_reaches_the_main_agent_again(case):
    ask(case)
    case.story.advance(timedelta(minutes=31))
    watch(case)
    case.story.expect_success(f'message send "Use the compiler in tools/bin" --to agent:{agent_number(case.story, case.worker.id)}', actor=case.story.agent)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.FORWARDED, "Use the compiler in tools/bin" in case.worker_lines(), detail=case.worker_lines())
    ask(case, SECOND_QUESTION, AskTopic.TESTS)
    case.story.advance(timedelta(minutes=31))
    watch(case)
    case.story.expect_rows(messages(case).count("What: ") == 2, SECOND_QUESTION in messages(case), detail=messages(case))


def test_the_sixth_ask_of_a_group_is_saved_and_forwarded_with_its_own_words_and_the_worker_hears_it(case):
    for number in range(1, 6):
        ask(case, f"Question {number} about the build")
    sixth = case.story.run('worker ask "Question 6 about the build" --about tool', actor=case.worker)
    lines = questions(case.story)
    case.story.expect_rows(sixth.code == 0, len(lines) == 6, all(line.outcome is AskOutcome.FORWARDED for line in lines), "Question 6 about the build" in messages(case),
                           "the main agent has your question now" in sixth.output_text, detail=sixth.output_text + messages(case))


def test_the_forward_time_cannot_be_set_below_the_answer_time(case):
    expect_refused_with(case.story, f"setting set {FORWARD_MINUTES} 5 --project", "after 5 minutes", "before the 10 minutes", actor=case.story.agent)
    expect_refused_with(case.story, f"setting set {ANSWER_MINUTES} 45 --project", "after 30 minutes", "before the 45 minutes", actor=case.story.agent)
    case.story.expect_success(f"setting set {FORWARD_MINUTES} 60 --project", actor=case.story.agent)
    case.story.expect_success(f"setting set {ANSWER_MINUTES} 45 --project", actor=case.story.agent)
