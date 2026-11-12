from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from dataclasses import replace

from engine.driver.nudge import Nudge
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.process_nudges import READER_REQUEST


class ReaderRequestText:
    """Builds the line of one reader request; its blocks are made by the reading enforcer."""

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def line(self, request: ReaderRequest) -> Nudge:
        nudge = READER_REQUEST.nudge(request=request.id, agent=self.numbers.number(AGENT_MODEL_NAME, request.creator_id), command=request.command, output=request.sample_process_id)
        return replace(nudge, key=f"{nudge.key}.{request.id}")
