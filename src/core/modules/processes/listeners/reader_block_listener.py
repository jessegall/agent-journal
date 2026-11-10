from dataclasses import replace

from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.time_reached import TimeReached
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.process_nudges import READER_BLOCK
from engine.change.created import Created
from engine.command.context import Context


class ReaderBlockListener(SaveListener[Created[ProcessPart]]):
    """Blocks an agent until its requested reader is saved or the block expires."""

    name = "processes.reader-block"

    def __init__(self, queries: Queries, bus: Bus, clock: Clock) -> None:
        self.queries, self.bus, self.clock = queries, bus, clock

    def handle(self, event: Created[ProcessPart], context: Context) -> None:
        part = event.row
        if part.reader_request_id is None:
            return
        request = self.queries.query(ReaderRequest).find(part.reader_request_id)
        if request.completed_at is not None or request.expires_at <= self.clock.timestamp():
            return
        process = self.queries.query(Process).find(part.process_id)
        nudge = READER_BLOCK.nudge(output=part.process_id, request=request.id)
        ends = AnyCondition(ReaderRequestCompleted(request.id), TimeReached(request.expires_at.text))
        self.bus.dispatch(BlockUntil(process.session_agent_id, replace(nudge, key=f"{nudge.key}.{request.id}"), ends), context)
