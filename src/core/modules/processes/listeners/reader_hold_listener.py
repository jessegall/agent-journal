from dataclasses import replace

from core.base.change.change import Change
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.driver.block_until import BlockUntil
from core.base.driver.conditions.time_reached import TimeReached
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.block_conditions.reader_request_settled import ReaderRequestSettled
from core.modules.processes.support.process_nudges import READER_HOLD


class ReaderHoldListener(SaveListener):
    """Holds a worker until its requested reader is saved or the hold expires."""

    name = "processes.reader-hold"
    event = "process_part.create"

    def __init__(self, queries: Queries, bus: Bus, clock: Clock) -> None:
        self.queries, self.bus, self.clock = queries, bus, clock

    def handle(self, change: Change[Model]) -> None:
        part = change.new_row
        if not isinstance(part, ProcessPart) or part.reader_request_id is None:
            return
        request = self.queries.query(ReaderRequest).find(part.reader_request_id)
        if request.settled_at is not None or request.hold_until <= self.clock.timestamp():
            return
        process = self.queries.query(Process).find(part.process_id)
        nudge = READER_HOLD.nudge(command=request.command)
        ends = AnyCondition(ReaderRequestSettled(request.id), TimeReached(request.hold_until.text))
        self.bus.dispatch(BlockUntil(process.agent_id, replace(nudge, key=f"{nudge.key}.{request.id}"), ends), change.context)
