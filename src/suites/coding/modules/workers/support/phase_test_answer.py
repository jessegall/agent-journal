from dataclasses import dataclass
from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class PhaseTestAnswer:
    """What a worker's test runs get between two commits: the refusal once the allowance is spent, or a line for each
    run with the runs left and the commands that count them."""

    refusal: AgentMessage | None = None
    agent_messages: tuple[AgentMessage, ...] = ()
    records: tuple[Command[object], ...] = ()
