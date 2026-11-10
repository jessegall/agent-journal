from engine.command.context import Context
from engine.command.handler import Handler
from engine.provider.providers import Providers
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.context_change_requests import CONTEXT_CONTROL_KEY, ContextChangeRequests


class ChooseAgentControlHandler(Handler[ChooseAgentControl, Agent]):
    """Finds the line of a choice its program offers and types it into the agent's terminal; a choice it does
    not offer is refused. A choice that compacts or clears the context is recorded first, which refuses it while
    a compaction of that agent is open."""

    command = ChooseAgentControl
    runs_once = True

    def __init__(self, queries: Queries, providers: Providers, typing: TerminalTyping, context_changes: ContextChangeRequests) -> None:
        self.queries, self.providers, self.typing, self.context_changes = queries, providers, typing, context_changes

    def handle(self, command: ChooseAgentControl, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        choices = [choice for group in self.providers.provider(agent.program).controls if group.key == command.key for choice in group.choices if choice.value == command.value]
        if not choices:
            raise Refusal(f"{command.key} {command.value} is not a choice the agent bar offers", f"journal agent controls {agent.number} lists them")
        if agent.ended_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} has ended")
        if command.key == CONTEXT_CONTROL_KEY:
            self.context_changes.record(agent, command.value, command.reason, choices[0].line, context)
        self.typing.type_line(agent, choices[0].line)
        return agent
