from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.database.statement import Statement
from engine.query.queries import Queries
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.commands.return_unhandled_merger_lines.return_unhandled_merger_lines import ReturnUnhandledMergerLines
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_questions import CLOCK_FORMAT
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.merger_cases import MergerCase, case  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.support.merger_launcher import expect_refused_with, merger_can_start, running_launcher
from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from suites.coding.modules.workers.ticks.merger_retry import MergerRetry
from tests.stories.suites.coding.modules.workers.worker_ask import asking, asking_with_merger_running, merger_disabled_worker  # noqa: F401
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from core.modules.asks.support.ask_settings import ASK_ANSWER_MINUTES, ASK_PASS_ON_MINUTES, ASK_VISITS_LIMIT
from suites.coding.support.shipped_profiles import MERGER_PROFILE

TEST_ROWS_REASON = "the test reads every row it checks"

QUESTION = "The sandbox has no compiler"
SECOND_QUESTION = "The fixture file is empty"
ANSWER = "Use the compiler in tools/bin"
ANSWER_MINUTES = f"{ASK_ANSWER_MINUTES}"
VISITS_LIMIT = f"{ASK_VISITS_LIMIT}"
HELP_REQUEST_LINE = 'wait stuck "the build tool is missing"'
READ_OF_A_FILE = HookSamples.tool_use("Read", ToolType.READ, ["cart.py"], None)


def questions(story) -> tuple[MergerLine, ...]:
    return tuple(line for line in story.story_rows(MergerLine) if line.worker_id is not None)


def waits_of(story, worker: Actor) -> tuple[Wait, ...]:
    return tuple(story.container.get(Queries).query(Wait).filter(session_agent_id=worker.id).every_row(TEST_ROWS_REASON))


def ask(case: MergerCase, text: str = QUESTION, topic: AskTopic = AskTopic.TOOL):
    outcome = case.story.run(f'worker ask "{text}" --about {topic}', actor=case.worker)
    assert outcome.code == 0, outcome.output_text
    return outcome


def end_unanswered_visit(case: MergerCase) -> None:
    case.story.expect_success("merger next", actor=case.merger)
    case.story.container.get(Bus).run(ReturnUnhandledMergerLines(), Actor.core(), environment_id=1)


def test_an_ask_is_one_line_with_its_wait_task_and_due_time_and_the_same_ask_again_or_a_changed_setting_moves_nothing(asking):
    outcome = asking.post_question(topic=AskTopic.TOOL)
    line, wait = questions(asking.story)[0], waits_of(asking.story, asking.worker)[0]
    asking.story.expect_rows(len(questions(asking.story)) == 1, line.worker_id == asking.worker.id, line.topic is AskTopic.TOOL, line.facts_json is not None,
                             line.wait_id == wait.id, line.task_id == 1, line.outcome is None, line.visit_count == 0, detail=str(line))
    asking.story.expect_rows(f"the merger has your question; an answer is due by {line.due_at.value.strftime(CLOCK_FORMAT)}, after that the main agent gets it" in outcome.output_text,
                             AskTopic.TOOL.waiting_work() in outcome.output_text, line.due_at.value - line.created_at.value == timedelta(minutes=asking.story.number_default(ASK_ANSWER_MINUTES)),
                             line.forward_at.value - line.created_at.value == timedelta(minutes=asking.story.number_default(ASK_PASS_ON_MINUTES)), detail=outcome.output_text)
    due_at = line.due_at
    asking.story.advance(timedelta(minutes=3))
    asking.story.expect_success(f"setting set {ANSWER_MINUTES} 25 --project", actor=asking.story.user or asking.story.agent)
    asking.post_question(topic=AskTopic.TOOL)
    asking.story.expect_rows(len(questions(asking.story)) == 1, questions(asking.story)[0].due_at == due_at, len(waits_of(asking.story, asking.worker)) == 1, detail=str(questions(asking.story)))


def test_with_the_merger_off_the_ask_reaches_the_main_agent_once_and_is_recorded_as_passed_on(merger_disabled_worker):
    merger_disabled_worker.post_question()
    line = questions(merger_disabled_worker.story)[0]
    lines = merger_disabled_worker.main_lines()
    merger_disabled_worker.story.expect_rows(line.outcome is AskOutcome.FORWARDED, line.closed_at is not None, lines.count(MERGER_LINE_AVAILABLE.nudge(line=line.id).text) == 1, QUESTION in line.text, detail=lines)


def test_two_asks_while_the_merger_runs_are_read_in_one_visit_of_one_merger_and_both_answered_in_it(case):
    ask(case)
    ask(case, SECOND_QUESTION, AskTopic.TESTS)
    case.story.run_listeners()
    case.story.expect_text("merger next", QUESTION, SECOND_QUESTION, actor=case.merger)
    mergers = case.story.run("agent list --json --environment main", actor=case.story.agent).output_text.count(f'"profile": "{MERGER_PROFILE.name}"')
    case.story.expect_rows(mergers == 1, detail=f"{mergers} mergers")
    first, second = questions(case.story)
    case.story.expect_rows([first.visit_count, second.visit_count] == [1, 1], first.visit_id == second.visit_id, detail=str(questions(case.story)))
    case.story.expect_success(f'merger answer {first.id} "{ANSWER}"', actor=case.merger)
    case.story.expect_success(f'merger answer {second.id} "Fill the fixture from the sample"', actor=case.merger)
    case.story.expect_rows(all(line.outcome is AskOutcome.ANSWERED for line in questions(case.story)), detail=str(questions(case.story)))


def test_a_merger_that_read_an_ask_and_did_nothing_gets_it_again_and_after_the_second_reading_it_is_forwarded_at_once(case):
    ask(case)
    end_unanswered_visit(case)
    first = questions(case.story)[0]
    case.story.expect_rows(first.read_at is None, first.visit_count == 1, first.outcome is None, detail=str(first))
    AskWatch()(case.story.container)
    case.story.expect_rows(questions(case.story)[0].outcome is None, detail="one reading is under the limit of two")
    case.story.expect_text("merger next", QUESTION, "task 1", actor=case.merger)
    case.story.container.get(Bus).run(ReturnUnhandledMergerLines(), Actor.core(), environment_id=1)
    second = questions(case.story)[0]
    case.story.expect_rows(second.visit_count == 2, second.outcome is AskOutcome.FORWARDED, detail=str(second))


def test_the_mergers_answer_reaches_the_worker_ends_its_wait_and_a_second_answer_is_refused(case):
    ask(case)
    line = questions(case.story)[0]
    case.story.expect_success(f'merger answer {line.id} "{ANSWER}"', f"answer sent to worker {agent_number(case.story, case.worker.id)}", actor=case.merger)
    answered = questions(case.story)[0]
    case.story.expect_rows(answered.outcome is AskOutcome.ANSWERED, waits_of(case.story, case.worker)[0].state is not WaitState.OPEN, ANSWER in case.worker_messages(), detail=case.worker_messages())
    expect_refused_with(case.story, f'merger answer {line.id} "{ANSWER}"', f"line {line.id} is settled: answered at {answered.closed_at.value.strftime(CLOCK_FORMAT)}", actor=case.merger)
    case.story.expect_text("task-log list --task 1", "ended as answered", actor=case.story.agent)


def test_only_a_line_that_is_a_workers_question_can_be_answered(case):
    expect_refused_with(case.story, f'merger answer 999 "{ANSWER}"', "line 999 is not a worker's question", actor=case.merger)
    expect_refused_with(case.story, f'merger answer 999 "{ANSWER}"', "only the merger runs this", actor=case.story.agent)


def test_a_worker_that_asks_then_stops_then_works_again_keeps_its_ask_and_still_gets_the_answer(case):
    ask(case)
    case.story.expect_hook_allowed(worker_session(case.story, case.worker), HookSamples.stop())
    case.story.run_listeners()
    line = questions(case.story)[0]
    case.story.expect_rows(line.outcome is None, detail="the end of a turn closes no question")
    case.story.hook(worker_session(case.story, case.worker), READ_OF_A_FILE)
    case.story.expect_rows(waits_of(case.story, case.worker)[0].state is not WaitState.OPEN, questions(case.story)[0].outcome is None, detail="working ends the wait and leaves the question open")
    case.story.expect_success(f'merger answer {line.id} "{ANSWER}"', actor=case.merger)
    case.story.expect_rows(ANSWER in case.worker_messages(), questions(case.story)[0].outcome is AskOutcome.ANSWERED, detail=case.worker_messages())


def test_an_ask_about_a_cancelled_task_closes_as_moot_with_a_line_in_the_tasks_log(case):
    ask(case)
    case.story.expect_success('task cancel 1 --reason "not needed"', actor=case.story.agent)
    case.story.run_listeners()
    line = questions(case.story)[0]
    case.story.expect_rows(line.outcome is AskOutcome.MOOT, line.closed_at is not None, detail=str(line))
    case.story.expect_text("task-log list --task 1", "ended as moot: task 1 is cancelled", actor=case.story.agent)
    expect_refused_with(case.story, f'merger answer {line.id} "{ANSWER}"', f"line {line.id} is settled: moot at", actor=case.merger)


def test_the_asks_of_a_released_worker_close_as_moot(case):
    ask(case, SECOND_QUESTION, AskTopic.TESTS)
    ask(case)
    case.story.expect_success(f'worker release {agent_number(case.story, case.worker.id)} "the worker left"', actor=case.story.agent)
    case.story.run_listeners()
    case.story.expect_rows(all(line.outcome is AskOutcome.MOOT for line in questions(case.story)), detail=str(questions(case.story)))


def test_an_ask_carries_the_phase_its_checkpoint_test_and_the_unfinished_tasks_with_what_each_waits_on(case):
    case.story.expect_success('plan make "The rebuild" --brief "all of it" --environment main', actor=case.story.agent)
    case.story.expect_success('phase make --plan 1 "First" --goal "the cart works" --checkpoint --test "pytest tests/cart"', actor=case.story.agent)
    case.story.expect_success("phase place 1 --phase 1", actor=case.story.agent)
    case.story.expect_success('task make "Check the totals" --brief "after the cart" --phase 1 --environment main', actor=case.story.agent)
    case.story.expect_success("task depend 2 --on 1", actor=case.story.agent)
    ask(case)
    text = questions(case.story)[0].text
    case.story.expect_rows("phase: First, its test: pytest tests/cart" in text, "task 1 (started) waits on nothing" in text, "task 2 (blocked) waits on task 1" in text, detail=text)


def test_a_help_request_is_a_question_like_any_other_with_its_wait_and_its_due_time(case):
    case.story.expect_success(HELP_REQUEST_LINE, actor=case.worker)
    case.story.run_listeners()
    line = questions(case.story)[0]
    case.story.expect_rows(line.topic is AskTopic.GENERAL, line.wait_id == waits_of(case.story, case.worker)[0].id, line.outcome is None,
                           line.due_at.value - line.created_at.value == timedelta(minutes=case.story.number_default(ASK_ANSWER_MINUTES)), detail=str(line))
    case.story.expect_success(f'merger answer {line.id} "{ANSWER}"', actor=case.merger)
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.ANSWERED, ANSWER in case.worker_messages(), detail=case.worker_messages())


def test_worker_status_names_the_open_ask_with_its_due_time_and_then_how_it_ended(case):
    ask(case)
    line = questions(case.story)[0]
    due = line.due_at.value.strftime(CLOCK_FORMAT)
    case.story.expect_text("worker status", f"ask {line.id} open since", f"answer due {due}, with the merger", actor=case.worker)
    case.story.expect_success(f'merger answer {line.id} "{ANSWER}"', actor=case.merger)
    case.story.expect_text("worker status", f"ask {line.id} was answered", actor=case.worker)
    case.story.expect_absent("worker status", "open since", actor=case.worker)


def test_an_ask_made_with_the_merger_off_starts_no_merger_when_the_merger_is_switched_on_later(merger_disabled_worker, monkeypatch):
    merger_can_start(monkeypatch)
    story = merger_disabled_worker.story
    merger_disabled_worker.post_question()
    story.expect_success(f"setting set {MERGER_ENABLED} true --project", actor=story.user)
    with running_launcher(story):
        MergerRetry()(story.container)
        AskWatch()(story.container)
        story.run_listeners()
        story.expect_rows(questions(story)[0].outcome is AskOutcome.FORWARDED, merger_agent(story) is None, detail="a question the main agent already has wakes no merger")


def test_a_person_retiring_a_worker_with_tasks_left_leaves_the_merger_one_line_and_closes_its_asks(case):
    story = case.story
    for number in range(2, 6):
        story.expect_success(f'task make "Job {number}" --brief "Do job {number}" --environment main', actor=story.agent)
        story.expect_success(f"worker send --wait {agent_number(story, case.worker.id)} --task {number}", actor=story.agent)
    ask(case)
    story.expect_success(f"agent end {case.worker.id}", actor=case.worker)
    story.expect_success(f'agent retire {agent_number(story, case.worker.id)} --reason "no longer needed"', actor=story.user)
    story.run_listeners()
    lines = [line.text for line in story.story_rows(MergerLine) if "ended with" in line.text]
    story.expect_rows(len(lines) == 1, all(f"task:{number}" in lines[0] for number in range(1, 4)), "and 2 more tasks" in lines[0], questions(story)[0].outcome is AskOutcome.MOOT,
                      "ended with" not in case.main_lines(), detail=f"{lines} | {case.main_lines()}")


def test_an_overdue_ask_of_a_worker_whose_worktree_is_gone_closes_as_moot_and_wakes_nobody(case):
    ask(case)
    case.story.container.get(Database).update(Statement("UPDATE worker_worktrees SET removed_at = created_at, version = version + 1 WHERE session_agent_id = ?", [case.worker.id]))
    case.story.advance(timedelta(minutes=11))
    merger_lines = case.story.run(f"agent-line list --agent {case.merger.id}").output_text
    AskWatch()(case.story.container)
    case.story.run_listeners()
    case.story.expect_rows(questions(case.story)[0].outcome is AskOutcome.MOOT, QUESTION not in case.main_lines(),
                           case.story.run(f"agent-line list --agent {case.merger.id}").output_text == merger_lines, detail=str(questions(case.story)[0]))
