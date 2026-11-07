from dataclasses import dataclass


@dataclass(frozen=True)
class PluginCardAnswer:
    """The cards of a queued plugin answer, as JSON text, and the agent they are for."""

    agent_id: int
    output: str
