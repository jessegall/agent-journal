import time as timing

from journal.support.option import Option
from journal.support.queued_line import QueuedLine
from journal.support.typed_line import TypedLine

RECENT_SECONDS = 60.0
BATCH_SECONDS = 5.0
BATCH_OPTION = Option("delivery.batch_seconds", "Type lines at most every", "Seconds after a line is typed before the next may go; lines that come meanwhile are held and typed together as one line. 0 types each at once", BATCH_SECONDS, unit="seconds")
JOURNAL_PREFIX = "[journal]"


class TypedLines:
    """The lines typed to the agents and not yet seen back as a prompt: a line is confirmed by the prompt that carries its words, and until then it may have been lost. A line for an agent with one still unconfirmed is held, since a line typed while the agent holds another in its queue lands in its prompt box and its Enter only breaks the line. An environment paused queues every line until it is resumed; one disabled drops every line until it is enabled; clear empties its queue: what the agent missed, the look at its next start tells it."""

    def __init__(self) -> None:
        self._waiting: list[TypedLine] = []
        self._held: list[QueuedLine] = []
        self._recent: list[TypedLine] = []
        self._sent_at: dict[int, float] = {}
        self._disabled_ids: set[int] = set()
        self._paused_ids: set[int] = set()

    def disable(self, environment_id: int) -> None:
        self._disabled_ids.add(environment_id)

    def enable(self, environment_id: int) -> None:
        self._disabled_ids.discard(environment_id)

    def is_disabled(self, environment_id: int) -> bool:
        return environment_id in self._disabled_ids

    def pause(self, environment_id: int) -> None:
        self._paused_ids.add(environment_id)

    def resume(self, environment_id: int) -> None:
        self._paused_ids.discard(environment_id)

    def is_paused(self, environment_id: int) -> bool:
        return environment_id in self._paused_ids

    def clear(self, environment_id: int) -> None:
        self._held = [h for h in self._held if h.environment_id != environment_id]

    def is_recent(self, environment_id: int, seconds: float) -> bool:
        return timing.time() - self._sent_at.get(environment_id, 0.0) < seconds

    def is_waiting(self, environment_id: int) -> bool:
        return any(t.environment_id == environment_id for t in self._waiting)

    def queue(self, line: QueuedLine) -> None:
        self._held.append(line)

    def batched(self, environment_id: int) -> QueuedLine | None:
        blocked = [h for h in self._held if h.environment_id == environment_id]
        if not blocked:
            return None
        self._held = [h for h in self._held if h.environment_id != environment_id]
        lines = [h.line.removeprefix(JOURNAL_PREFIX).strip() for h in blocked]
        return QueuedLine(environment_id, f"{JOURNAL_PREFIX} {' | '.join(lines)}", max(h.delay_seconds for h in blocked))

    def typed(self, environment_id: int, line: str) -> None:
        moment = timing.time()
        self._sent_at[environment_id] = moment
        self._waiting.append(TypedLine(environment_id, line, moment))
        self._recent = [t for t in self._recent if moment - t.time < RECENT_SECONDS] + [TypedLine(environment_id, line, moment)]

    def contains(self, environment_id: int, prompt: str) -> bool:
        return any(t.environment_id == environment_id and t.contains(prompt) for t in self._recent if timing.time() - t.time < RECENT_SECONDS)

    def confirm(self, environment_id: int, prompt: str) -> bool:
        for keystrokes in self._waiting:
            if keystrokes.environment_id == environment_id and keystrokes.contains(prompt):
                self._waiting.remove(keystrokes)
                return True
        return False

    def confirm_naming(self, environment_id: int, message_id: int) -> bool:
        matched = [t for t in self._waiting if t.environment_id == environment_id and message_id in t.message_numbers()]
        for keystrokes in matched:
            self._waiting.remove(keystrokes)
        return bool(matched)

    def overdue(self, environment_id: int, previous: float) -> list[TypedLine]:
        return [t for t in self._waiting if t.environment_id == environment_id and t.time <= previous]

    def retry(self, keystrokes: TypedLine, time: float) -> TypedLine:
        queued = self.batched(keystrokes.environment_id)
        line = keystrokes.line if queued is None else f"{keystrokes.line} | {queued.line.removeprefix(JOURNAL_PREFIX).strip()}"
        repeat = TypedLine(keystrokes.environment_id, line, time, keystrokes.tries + 1)
        self._waiting[self._waiting.index(keystrokes)] = repeat
        self._recent = [t for t in self._recent if time - t.time < RECENT_SECONDS] + [repeat]
        return repeat

    def abandon(self, keystrokes: TypedLine) -> None:
        self._waiting.remove(keystrokes)
