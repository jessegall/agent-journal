from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.commands.type_terminal_line.type_terminal_line import TypeTerminalLine
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping


class TypeTerminalLineHandler(Handler[TypeTerminalLine, Agent]):
    """Hands the launcher a line for a running agent's terminal, and never an empty
    line."""

    command = TypeTerminalLine
    runs_once = True

    def __init__(self, queries: Queries, typing: TerminalTyping) -> None:
        self.queries, self.typing = queries, typing

    def handle(self, command: TypeTerminalLine, context: Context) -> Agent:
        if not command.line.strip():
            raise Refusal("give the line to type")
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.ended_at is not None:
            raise Refusal(f"agent {agent.id} has ended, so it has no terminal to type in")
        self.typing.type_line(agent.terminal_id, command.line)
        return agent
