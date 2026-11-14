from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.answer_worker_ask.answer_worker_ask import AnswerWorkerAsk
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class AnswerWorkerAskHandler(Handler[AnswerWorkerAsk, str]):
    """Sends the merger's answer to the worker that asked and closes the question as answered. The advice
    limits do not apply to an answer."""

    command = AnswerWorkerAsk
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, visits: MergerVisits, questions: WorkerQuestions, numbers: RowNumbers) -> None:
        self.agents, self.visits, self.questions, self.numbers = agents, visits, questions, numbers

    def handle(self, command: AnswerWorkerAsk, context: Context) -> str:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        line = self.questions.find_line(command.line_id)
        self.questions.close(line, AskOutcome.ANSWERED, command.text, context)
        return f"answer sent to {AgentLabel.labelled_row(line.worker_id, self.numbers, 'worker').text}"
