from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_label import AgentLabel
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions import ForwardWorkerQuestions
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.support.main_agent_question import MainAgentQuestion
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

OPTIONS = ("answer the worker", "change the plan", "release the worker")
RECOMMENDATION = "read the worker's facts first"
FORWARDED_TEXT = "the main agent has it now and answers you"
MISSING_WORKTREE_REASON = "the worker has no worktree any more"

JOURNAL_QUESTION_START = "the journal passes on: "

class ForwardWorkerQuestionsHandler(Handler[ForwardWorkerQuestions, None]):
    """Writes the open questions of one worker to the main agent as one message and records each as forwarded.
    While the main agent already has a question of the worker, the questions are only recorded: the main agent
    gets one message for one stuck worker. The questions of a worker that has no worktree any more are closed
    as moot and reach nobody. The message says the journal wrote it, and the worker's words are in
    it as quoted lines, never as lines of the journal."""

    command = ForwardWorkerQuestions
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions, escalations: Escalations, bus: Bus, numbers: RowNumbers) -> None:
        self.questions, self.escalations, self.bus, self.numbers = questions, escalations, bus, numbers

    def handle(self, command: ForwardWorkerQuestions, context: Context) -> None:
        lines = self.questions.worker_lines(command.worker_id)
        if not lines:
            return
        if self.escalations.worktrees.worker_worktree(command.worker_id) is None:
            self.questions.close_worker_lines(command.worker_id, MISSING_WORKTREE_REASON, context)
            return
        if not self.escalations.is_open(command.worker_id):
            self.bus.dispatch(SendMergerReport(self.question(command.worker_id, lines).text()), context)
        for line in lines:
            self.questions.close(line, AskOutcome.FORWARDED, FORWARDED_TEXT, context)

    def question(self, worker_id: int, lines: tuple[MergerLine, ...]) -> MainAgentQuestion:
        worker = AgentLabel.labelled_row(worker_id, self.numbers, "worker").text
        visits = max(line.visit_count for line in lines)
        quoted = tuple(f"> {text}" for line in lines for text in line.text.splitlines())
        return MainAgentQuestion(f"{JOURNAL_QUESTION_START}{worker} has {len(lines)} unanswered question(s)", f"the merger read it {visits} times and settled nothing", OPTIONS, RECOMMENDATION, quoted)
