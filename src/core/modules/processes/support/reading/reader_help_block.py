from dataclasses import dataclass
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted


@dataclass(frozen=True)
class ReaderHelpBlock:
    """The hold that asks the main agent to help with one reader request: its line, the request's completion that
    lifts it, and the command the request is for."""

    agent_message: AgentMessage
    condition: ReaderRequestCompleted
    command: str
