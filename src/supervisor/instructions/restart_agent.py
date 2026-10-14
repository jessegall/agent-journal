from dataclasses import dataclass

from supervisor.instructions.instruction import Instruction


@dataclass(frozen=True)
class RestartAgent(Instruction):
    """Stop the agent and start it again on the same conversation, as after an MCP server or a hook is installed."""

    resume: tuple[str, ...]
