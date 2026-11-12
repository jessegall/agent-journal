from engine.actor.actor import Actor
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.pass_behind_check.pass_behind_check import PassBehindCheck
from suites.coding.modules.workers.models.behind_facts import BehindFacts
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.behind_facts_reader import BehindFactsReader
from suites.coding.modules.workers.support.behind_nudges import BEHIND_PASSED, BEHIND_SOURCE
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class PassBehindCheckHandler(Handler[PassBehindCheck, None]):
    """Hands a worker behind its base to the main agent: reads the facts before the transaction opens, since git runs,
    moves the check to passed with the merger and the reason, touches no state of the worktree, closes the merger
    visit and tells the main agent how far behind, how much overlaps, the model and why."""

    command = PassBehindCheck
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, reader: BehindFactsReader, queries: Queries, repository: Repository, visits: MergerVisits,
                 main_line: MainAgentLine, numbers: RowNumbers) -> None:
        self.agents, self.decisions, self.reader, self.queries, self.repository = agents, decisions, reader, queries, repository
        self.visits, self.main_line, self.numbers = visits, main_line, numbers
        self.facts = BehindFacts("", 0, (), (), (), (), 0, False, "", "")

    def prepare(self, command: PassBehindCheck, actor: Actor) -> None:
        worktree, _ = self.decisions.decidable(command.worker_id)
        self.facts = self.reader.read(worktree, self.queries.query(Agent).find(command.worker_id))

    def handle(self, command: PassBehindCheck, context: Context) -> None:
        merger = require_merger(self.agents, context)
        _, check = self.decisions.decidable(command.worker_id)
        self.repository.save_change(check, check.passed(merger.id, command.reason), context)
        self.visits.close_newest(context)
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        nudge = BEHIND_PASSED.nudge(worker=worker, count=self.facts.behind, base=self.facts.base_branch, overlap=len(self.facts.overlap), model=self.facts.model, reason=command.reason)
        self.main_line.send_nudge(nudge, BEHIND_SOURCE, context)
