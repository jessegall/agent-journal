from engine.command.context import Context
from engine.enums.hook_event_name import HookEventName
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall


class InterruptClearListener(SaveListener[Changed[HookCall]]):
    """A prompt of an interrupted agent starts its next turn, so it clears the interrupt in the prompt's own
    write; an interrupt kept past that turn would hold every later wake of the agent back."""

    name = "drivers.interrupt-clear"

    def __init__(self, agents: AgentRows, repository: Repository) -> None:
        self.agents, self.repository = agents, repository

    def handle(self, event: Changed[HookCall], context: Context) -> None:
        if event.old_row is not None or event.row.hook != HookEventName.PROMPT:
            return
        agent = self.agents.find(event.row.session_agent_id)
        if agent.interrupted_at is not None:
            self.repository.update(agent, context, interrupted_at=None)
