import json
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_facts_list import AgentFactsList
from core.modules.usage.support.status_files import StatusFiles

CLOSED_AGENTS_SHOWN = 50
BLOCKED_STATE = "blocked"
WAITING_STATE = "waiting"


class UsageAgentsSubcommand(ReadSubcommand[AgentFactsList]):
    """`journal usage agents [--environment <name>]`: for each agent still running, its model, context, cost
    and the task it works on."""

    cli_name = "usage"
    name = "agents"

    def __init__(self, queries: Queries, files: StatusFiles, environment_names: EnvironmentNames) -> None:
        self.queries, self.files, self.environment_names = queries, files, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--closed", action="store_true", help="also the agents that ended most recently")

    def read(self, arguments: Namespace, caller: Caller) -> AgentFactsList:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the agents are shown for one environment", "name it with --environment")
        cards = self.queries.query(AgentCard).filter(environment_id=environment_id)
        running = tuple(cards.matching(IsNull("ended_at")).oldest().all_rows())
        ended = tuple(cards.matching(Greater("ended_at", "")).newest().page(1, CLOSED_AGENTS_SHOWN).rows) if arguments.closed else ()
        return AgentFactsList(tuple(self.facts(card) for card in (*running, *ended)))

    def facts(self, card: AgentCard) -> AgentFacts:
        status = self.files.status(card.session)
        return AgentFacts(card.id, status.model or card.program_model or card.dispatch_model, status.context_percent, status.cost_dollars, card.started_task_id, card.started_task_title,
                          tuple(json.loads(card.tasks)), self.waiting_state(card), card.profile or card.dispatch_profile, card.given_name or card.dispatch_description.split(",", 1)[0],
                          card.dispatch_instruction)

    @staticmethod
    def waiting_state(card: AgentCard) -> str:
        if card.is_blocked:
            return BLOCKED_STATE
        return WAITING_STATE if card.paused_at is not None else ""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFactsList):
            output.write(value.line(), {"rows": [facts.json() for facts in value.agents]})
