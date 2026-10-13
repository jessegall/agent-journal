from events import Fact
from events.heavy_runs import HeavyRunHeld, HeavyRunStarted
from features.heavy_runs.details import WAITING
from features.heavy_runs.holding import queue_of
from features.heavy_runs.queue import Run
from receiving import Handler
from serving import Chat, Elsewhere, Settings


class QueueTheHeavyRun(Handler[HeavyRunHeld]):
    def handle(self, event: HeavyRunHeld, elsewhere: Elsewhere, settings: Settings, chat: Chat) -> list[Fact]:
        environment = elsewhere.here().record.env
        queue = queue_of(elsewhere.here().record, settings.forgotten_after)
        waiting = queue.joined(Run(event.command, environment, at=event.at))
        chat.nudge(WAITING, command=event.command, ahead=event.ahead, where=event.where, place=f"number {queue.place_of(environment)} of {len(waiting)}")
        return []


class LeaveTheQueue(Handler[HeavyRunStarted]):
    def handle(self, event: HeavyRunStarted, elsewhere: Elsewhere, settings: Settings) -> list[Fact]:
        record = elsewhere.here().record
        queue_of(record, settings.forgotten_after).left(record.env)
        return []
