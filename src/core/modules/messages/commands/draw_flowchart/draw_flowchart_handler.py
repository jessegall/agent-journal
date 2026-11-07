import json
import re
from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.draw_flowchart.draw_flowchart import DrawFlowchart
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message

ARROW = re.compile(r"\s*([^:]+?)\s*->\s*([^:]+?)\s*(?::\s*(.*?))?\s*")


class DrawFlowchartHandler(Handler[DrawFlowchart, Message]):
    """Reads each arrow, `From -> To` or `From -> To: label`, and saves the flowchart on a message titled by
    it."""

    command = DrawFlowchart

    def __init__(self, bus: Bus, repository: Repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, command: DrawFlowchart, context: Context) -> Message:
        if not command.edges:
            raise Refusal("a flowchart needs at least one arrow", "--edge 'From -> To'")
        edges = [self.arrow(line) for line in command.edges]
        message = self.bus.dispatch(SendMessage(command.title), context)
        return self.repository.save(replace(message, flowchart_edges=json.dumps(edges)), context)

    @staticmethod
    def arrow(line: str) -> list[str]:
        match = ARROW.fullmatch(line)
        if match is None:
            raise Refusal(f"{line!r} is not an arrow", "write it as 'From -> To' or 'From -> To: label'")
        return list(match.groups(default=""))
