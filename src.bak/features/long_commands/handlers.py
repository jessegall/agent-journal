from events import Fact
from events.long_commands import CallsLost, LongCommandHeld, LongCommandKept, MoveNotTaken, MovedCommandEnded, PartRunning, TaskFound
from features.long_commands.details import KEPT, MOVED
from features.long_commands.listeners import memory
from receiving import Handler
from resources.types import AgentRow
from serving import Chat, Clock, Providers, Remembered, Rows, Terminal


class CloseLostCalls(Handler[CallsLost]):
    def handle(self, event: CallsLost, agents: Rows[AgentRow], clock: Clock) -> list[Fact]:
        row, gone, now = agents.load(event.agent), set(event.gone), clock.now()
        closed = {"commands": [{**kept, "done": now} if (kept.get("at"), kept.get("id", "")) in gone and not kept.get("done") else kept for kept in row.commands]}
        if row.running and not row.running.get("done") and (row.running.get("at"), row.running.get("id", "")) in gone:
            closed["running"] = {**row.running, "done": now}
        agents.update(row.n, **closed)
        return []


class SayLongCommandKept(Handler[LongCommandKept]):
    def handle(self, event: LongCommandKept, chat: Chat) -> list[Fact]:
        chat.say(KEPT, reason=event.reason)
        return []


class MoveToTheBackground(Handler[LongCommandHeld]):
    def handle(self, event: LongCommandHeld, chat: Chat, terminal: Terminal, remembered: Remembered, agents: Rows[AgentRow], providers: Providers, clock: Clock) -> list[Fact]:
        remembered.set(memory("moved", event.agent), event.started)
        remembered.set(memory("task", event.agent), "")
        remembered.set(memory("pressed", event.agent), clock.now())
        terminal.move_to_background(event.started)
        if not providers.of(event.provider).result_names_move:
            chat.say(MOVED, seconds=int(clock.now() - float(event.started)))
        agents.moved_to_background(event.agent, float(event.started), event.command, state="running", started=float(event.started))
        return []


class PressMoveAgain(Handler[MoveNotTaken]):
    def handle(self, event: MoveNotTaken, terminal: Terminal, remembered: Remembered, clock: Clock) -> list[Fact]:
        remembered.set(memory("retried", event.agent), event.started)
        remembered.set(memory("pressed", event.agent), clock.now())
        terminal.move_to_background(event.started)
        return []


class KeepTheTask(Handler[TaskFound]):
    def handle(self, event: TaskFound, remembered: Remembered) -> list[Fact]:
        remembered.set(memory("task", event.agent), event.task)
        return []


class ShowThePartRunning(Handler[PartRunning]):
    def handle(self, event: PartRunning, remembered: Remembered, agents: Rows[AgentRow]) -> list[Fact]:
        remembered.set(memory("part", event.agent), event.part)
        agents.card(event.agent, key=f"command:{event.started}", command=event.part)
        return []


class CloseTheMovedCommand(Handler[MovedCommandEnded]):
    def handle(self, event: MovedCommandEnded, remembered: Remembered, agents: Rows[AgentRow]) -> list[Fact]:
        remembered.set(memory("ended", event.agent), event.started)
        agents.card(event.agent, key=f"command:{event.started}", state=event.state, ended=event.ended)
        return []
