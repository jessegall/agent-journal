from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from suites.coding.modules.workers.commands.merger.require_merger import require_merger_or_main_agent
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.behind_facts_reader import BehindFactsReader
from suites.coding.modules.workers.support.behind_nudges import BEHIND_SOURCE, UPDATE_ORDERED
from suites.coding.modules.workers.support.merger_visits import MergerVisits

NO_SHARED_FILES = "no file"


class OrderWorkerUpdateHandler(Handler[OrderWorkerUpdate, None]):
    """Orders the update: reads which files the new base commits share with the worker before the transaction
    opens, since git runs, moves the check to ordered with who and why, closes the merger visit so the handled line
    does not come back, and wakes the worker in its session with what moved and what to run."""

    command = OrderWorkerUpdate
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, reader: BehindFactsReader, queries: Queries, repository: Repository, visits: MergerVisits, nudger: Nudger) -> None:
        self.agents, self.decisions, self.reader, self.queries, self.repository, self.visits, self.nudger = agents, decisions, reader, queries, repository, visits, nudger
        self.shared: tuple[str, ...] = ()

    def prepare(self, command: OrderWorkerUpdate, actor: Actor) -> None:
        worktree, _ = self.decisions.decidable(command.worker_id)
        self.shared = self.reader.read(worktree, self.queries.query(Agent).find(command.worker_id)).overlap

    def handle(self, command: OrderWorkerUpdate, context: Context) -> None:
        deciding = require_merger_or_main_agent(self.agents, context)
        worktree, check = self.decisions.decidable(command.worker_id)
        self.repository.save_change(check, check.ordered(deciding.id, command.why), context)
        self.visits.close_newest(context)
        self.nudger.send(worktree.session_agent_id, UPDATE_ORDERED, BEHIND_SOURCE, context, count=check.behind, files=", ".join(self.shared) or NO_SHARED_FILES)
