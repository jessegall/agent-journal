from dataclasses import replace

from engine.driver.agent_message import AgentMessage
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.agent_messages.reader_request_message import ReaderRequestMessage


class ReaderRequestText:
    """Builds the line of one reader request; its blocks are made by the reading enforcer."""

    def line(self, request: ReaderRequest) -> AgentMessage:
        agent_message = ReaderRequestMessage.declared().agent_message(request=request.id, agent=request.creator_id, command=request.command, output=request.sample_process_id)
        return replace(agent_message, key=f"{agent_message.key}.{request.id}")
