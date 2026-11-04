from dataclasses import replace

from core.base.driver.block_until import BlockUntil
from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.process_nudges import READER_REQUEST, READER_REQUEST_COUNTDOWN, READER_REQUEST_REFUSAL


class ReaderRequestText:
    """Builds the notice and block for one reader request."""

    def line(self, request: ReaderRequest) -> Nudge:
        nudge = READER_REQUEST.nudge(request=request.id, agent=request.creator_id, command=request.command, output=request.sample_process_id)
        return replace(nudge, key=f"{nudge.key}.{request.id}")

    def block(self, agent_id: int, request: ReaderRequest) -> BlockUntil:
        refusal = READER_REQUEST_REFUSAL.nudge(request=request.id, command=request.command, block="{block}")
        countdown = READER_REQUEST_COUNTDOWN.nudge("{left}", command=request.command)
        return BlockUntil(agent_id, replace(refusal, key=f"{refusal.key}.{request.id}"), ReaderRequestCompleted(request.id),
                          after=Interval(READER_REQUEST_COUNTDOWN.span), countdown=countdown)
