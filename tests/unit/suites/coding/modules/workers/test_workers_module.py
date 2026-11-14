from suites.coding.coding_suite import CodingSuite
from suites.coding.coding_module import CodingModule
from suites.coding.modules.workers.commands.answer_worker_ask.answer_worker_ask_handler import AnswerWorkerAskHandler
from suites.coding.modules.workers.commands.answer_worker_ask.answer_worker_ask_subcommand import AnswerWorkerAskSubcommand
from suites.coding.modules.workers.migrations.m063_merger_line_ledger import MergerLineLedgerMigration
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions_handler import ForwardWorkerQuestionsHandler
from core.modules.asks.asks_module import AsksModule
from core.modules.asks.guards.question_times_guard import QuestionTimesGuard
from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from suites.coding.modules.workers.workers_module import WorkersModule


def test_workers_module_order():
    assert WorkersModule.name == "journal.suites.coding.workers"
    assert CodingSuite.modules.index(WorkersModule) > CodingSuite.modules.index(CodingModule) == 0


def test_the_merger_answers_a_question_through_a_registered_command():
    assert AnswerWorkerAskSubcommand in WorkersModule.subcommands
    assert AnswerWorkerAskHandler in WorkersModule.handlers
    assert MergerLineLedgerMigration in WorkersModule.migrations


def test_unanswered_questions_are_watched_and_forwarded_by_registered_parts():
    assert ForwardWorkerQuestionsHandler in WorkersModule.handlers
    assert QuestionTimesGuard in AsksModule.guards
    assert any(isinstance(tick.handler, AskWatch) for tick in WorkersModule.tick_handlers)


def test_the_two_ticks_of_waiting_test_runs_are_named_for_test_runs():
    names = {type(tick.handler).__name__ for tick in WorkersModule.tick_handlers}
    assert {"StalledWorkerTestRuns", "UnlaunchedWorkerTestRuns"} <= names and not {"StalledWorkerTests", "UnlaunchedWorkerTests"} & names
