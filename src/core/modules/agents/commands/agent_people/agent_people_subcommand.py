from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_people import AgentPeople


class AgentPeopleSubcommand(ReadSubcommand[AgentPeople]):
    """`journal agent people [--creator <actor>] [--owner <agent>]`: who made a row and which agent it belongs
    to, in one read."""

    cli_name = "agent"
    name = "people"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--creator", type=int)
        parser.add_argument("--owner", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> AgentPeople:
        creator: int | None = arguments.creator
        owner: int | None = arguments.owner
        rows = {agent.id: agent for agent in self.queries.query(Agent).matching(Among("id", tuple(number for number in (creator, owner) if number is not None))).all_rows()}
        return AgentPeople(self.queries.query(ActorRecord).filter(id=creator).first() if creator is not None else None, rows.get(creator) if creator is not None else None, rows.get(owner) if owner is not None else None)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentPeople):
            output.write(value.line(), {"actor": output.values(value.actor) if value.actor else None,
                                        "creator_agent": output.values(value.creator_agent) if value.creator_agent else None,
                                        "owner": output.values(value.owner) if value.owner else None})
