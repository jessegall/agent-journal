from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_label import AgentLabel
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions_handler import FORWARDED_TEXT
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.support.worker_questions import CLOCK_FORMAT, WorkerQuestions
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.ask_main_agent.ask_main_agent import AskMainAgent
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.support.main_agent_question import MainAgentQuestion
from suites.coding.modules.workers.support.worker_ask_facts_query import WorkerAskFactsQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class AskMainAgentHandler(Handler[AskMainAgent, None]):
    """Writes the merger's question as one message to the main agent, with the facts of a worker it names, and
    records the open questions of that worker as forwarded. A second question about a worker the main agent
    already has is refused."""

    command = AskMainAgent
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, guidance: WorkerGuidance, facts_query: WorkerAskFactsQuery, bus: Bus, visits: MergerVisits, questions: WorkerQuestions, escalations: Escalations,
                 numbers: RowNumbers) -> None:
        self.agents, self.guidance, self.facts_query, self.bus, self.visits = agents, guidance, facts_query, bus, visits
        self.questions, self.escalations, self.numbers = questions, escalations, numbers

    def handle(self, command: AskMainAgent, context: Context) -> None:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        if command.worker_id is not None:
            self.refuse_repeated(command.worker_id)
        question = MainAgentQuestion(command.problem, command.tried, command.options, command.recommendation, tuple(self.worker_lines(command.worker_id)))
        self.bus.dispatch(SendMergerReport(question.text()), context)
        if command.worker_id is not None:
            for line in self.questions.worker_lines(command.worker_id):
                self.questions.close(line, AskOutcome.FORWARDED, FORWARDED_TEXT, context)

    def refuse_repeated(self, worker_id: int) -> None:
        line = self.escalations.open_line(worker_id)
        if line is not None and line.closed_at is not None:
            worker = AgentLabel.from_row_id(worker_id, self.numbers, "worker").text
            raise Refusal(f"{worker} is with the main agent since {line.closed_at.value.strftime(CLOCK_FORMAT)} (line {line.id}): you need not tell it again")

    def worker_lines(self, worker_id: int | None) -> list[str]:
        if worker_id is None:
            return []
        point = self.guidance.point(worker_id)
        if point.round.has_no_work():
            return []
        return [self.facts_query.read(point, self.guidance.current_task(point.round)).text()]
