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
        self._working_ids: set[int] = set()
        self._refused_stop_ids: set[int] = set()

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

    def work(self, environment_id: int) -> None:
        self._working_ids.add(environment_id)
        self._refused_stop_ids.discard(environment_id)

    def refuse_stop(self, environment_id: int) -> None:
        self._working_ids.add(environment_id)
        self._refused_stop_ids.add(environment_id)

    def is_stop_refused(self, environment_id: int) -> bool:
        return environment_id in self._refused_stop_ids

    def rest(self, environment_id: int) -> None:
        self._working_ids.discard(environment_id)
        self._refused_stop_ids.discard(environment_id)

    def is_working(self, environment_id: int) -> bool:
        return environment_id in self._working_ids

    def queue_start(self, environment_id: int) -> float | None:
        return min((h.line_at for h in self._held if h.environment_id == environment_id), default=None)

    def pending_lines(self, environment_id: int) -> list[str]:
        lines = [h.line.removeprefix(JOURNAL_PREFIX).strip() for h in self._held if h.environment_id == environment_id]
        self._held = [h for h in self._held if h.environment_id != environment_id]
        return lines

    def clear(self, environment_id: int) -> None:
        self._held = [h for h in self._held if h.environment_id != environment_id]

    def is_recent(self, environment_id: int, seconds: float) -> bool:
        return timing.time() - self._sent_at.get(environment_id, 0.0) < seconds

    def is_waiting(self, environment_id: int) -> bool:
        return any(t.environment_id == environment_id for t in self._waiting)

    def queue(self, line: QueuedLine) -> None:
        if any(h.environment_id == line.environment_id and h.line == line.line for h in self._held):
            return
        self._held.append(line)

    def batched(self, environment_id: int) -> QueuedLine | None:
        blocked = [h for h in self._held if h.environment_id == environment_id and not h.is_remark]
        if not blocked:
            return None
        self._held = [h for h in self._held if h not in blocked]
        lines = [h.line.removeprefix(JOURNAL_PREFIX).strip() for h in blocked]
        return QueuedLine(environment_id, f"{JOURNAL_PREFIX} {TypedLine.SEPARATOR.join(lines)}", max(h.delay_seconds for h in blocked))

    def typed(self, environment_id: int, line: str) -> None:
        moment = timing.time()
        self._sent_at[environment_id] = moment
        self._waiting.append(TypedLine(environment_id, line, moment))
        self._recent = [t for t in self._recent if moment - t.time < RECENT_SECONDS] + [TypedLine(environment_id, line, moment)]

    def contains(self, environment_id: int, prompt: str) -> bool:
        return any(t.matches_prompt(environment_id, prompt) for t in self._recent if timing.time() - t.time < RECENT_SECONDS)

    def confirm(self, environment_id: int, prompt: str) -> bool:
        matches = [t for t in self._waiting if t.matches_prompt(environment_id, prompt)]
        self._waiting = [t for t in self._waiting if t not in matches]
        return bool(matches)

    def confirm_naming(self, environment_id: int, message_id: int) -> bool:
        matched = [t for t in self._waiting if t.environment_id == environment_id and message_id in t.message_numbers()]
        for keystrokes in matched:
            self._waiting.remove(keystrokes)
        return bool(matched)

    def waiting_count(self, environment_id: int) -> int:
        return sum(1 for t in self._waiting if t.environment_id == environment_id)

    def overdue(self, environment_id: int, previous: float) -> list[TypedLine]:
        return [t for t in self._waiting if t.environment_id == environment_id and t.time <= previous]

    def retry(self, keystrokes: TypedLine, time: float) -> TypedLine:
        queued = self.batched(keystrokes.environment_id)
        line = keystrokes.line if queued is None else f"{keystrokes.line}{TypedLine.SEPARATOR}{queued.line.removeprefix(JOURNAL_PREFIX).strip()}"
        repeat = TypedLine(keystrokes.environment_id, line, time, keystrokes.tries + 1)
        self._waiting[self._waiting.index(keystrokes)] = repeat
        self._recent = [t for t in self._recent if time - t.time < RECENT_SECONDS] + [repeat]
        return repeat

    def abandon(self, keystrokes: TypedLine) -> None:
        self._waiting.remove(keystrokes)
