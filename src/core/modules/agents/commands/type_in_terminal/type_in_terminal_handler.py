from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.commands.type_in_terminal.type_in_terminal import TypeInTerminal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping


class TypeInTerminalHandler(Handler[TypeInTerminal, Agent]):
    """Hands the launcher a line for a running agent's terminal; only a person types there, and never an empty line."""

    command = TypeInTerminal

    def __init__(self, queries: Queries, typing: TerminalTyping) -> None:
        self.queries, self.typing = queries, typing

    def handle(self, command: TypeInTerminal, context: Context) -> Agent:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person types in an agent's terminal", "ask the user to type it in the Terminal window")
        if not command.line.strip():
            raise Refusal("give the line to type")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended, so it has no terminal to type in")
        self.typing.type_line(agent.terminal_id, command.line)
        return agent
