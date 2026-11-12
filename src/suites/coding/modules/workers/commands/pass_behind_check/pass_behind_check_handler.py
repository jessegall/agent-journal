from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.pass_behind_check.pass_behind_check import PassBehindCheck
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.behind_nudges import BEHIND_PASSED, BEHIND_SOURCE
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class PassBehindCheckHandler(Handler[PassBehindCheck, None]):
    """Hands a worker behind its base to the main agent: moves the check to passed with the merger and the
    reason, touches no state of the worktree, closes the merger visit and names the check to the main agent,
    whose show gives the reason and whose merger behind gives the facts."""

    command = PassBehindCheck
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, repository: Repository, visits: MergerVisits, main_line: MainAgentLine, numbers: RowNumbers) -> None:
        self.agents, self.decisions, self.repository, self.visits, self.main_line, self.numbers = agents, decisions, repository, visits, main_line, numbers

    def handle(self, command: PassBehindCheck, context: Context) -> None:
        merger = require_merger(self.agents, context)
        _, check = self.decisions.passable(command.worker_id)
        self.repository.save_change(check, check.passed(merger.id, command.reason), context)
        self.visits.close_newest(context)
        worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
        self.main_line.send_nudge(BEHIND_PASSED.nudge(worker=worker, check=check.id), BEHIND_SOURCE, context)
