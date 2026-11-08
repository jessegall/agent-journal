from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordHookTimeout(Command[None]):
    """Notes that the journal answered a hook of this agent after its program had given up, and tells the
    agent's main agent and the person's chat once, when the agent had three in ten minutes."""

    lock = False

    agent_id: int
