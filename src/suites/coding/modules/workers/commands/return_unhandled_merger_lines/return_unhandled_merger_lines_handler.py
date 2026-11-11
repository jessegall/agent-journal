from engine.command.context import Context
from engine.command.handler import Handler
from suites.coding.modules.workers.commands.return_unhandled_merger_lines.return_unhandled_merger_lines import ReturnUnhandledMergerLines
from suites.coding.modules.workers.support.merger_visits import MergerVisits
from engine.command.bus import Bus
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions import ForwardWorkerQuestions
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_settings import QUESTION_VISITS_LIMIT


class ReturnUnhandledMergerLinesHandler(Handler[ReturnUnhandledMergerLines, None]):
    """Makes the lines an ended merger read and did nothing about unread again, and forwards the questions of a
    worker that are due by then to the main agent at once, without waiting for the watch."""

    command = ReturnUnhandledMergerLines

    def __init__(self, visits: MergerVisits, questions: WorkerQuestions, settings: SettingValues, bus: Bus) -> None:
        self.visits, self.questions, self.settings, self.bus = visits, questions, settings, bus

    def handle(self, command: ReturnUnhandledMergerLines, context: Context) -> None:
        self.visits.return_unhandled_lines(context)
        for worker_id in self.questions.due_workers(self.settings.number(QUESTION_VISITS_LIMIT), context.timestamp):
            self.bus.dispatch(ForwardWorkerQuestions(worker_id), context)
