import time as timing

from journal.support.held_line import HeldLine
from journal.engine.support.typed_line import TypedLine

RECENT = 60.0
BATCH_SECONDS = 5.0
MARK = "[journal]"


class TypedLines:
    """The lines typed to the agents and not yet seen back as a prompt: a line is confirmed by the prompt that carries its words, and until then it may have been lost. A line for an agent with one still unconfirmed is held, since a line typed while the agent holds another in its queue lands in its prompt box and its Enter only breaks the line. An environment paused queues every line until it is resumed; one disabled drops every line until it is enabled; clear empties its queue: what the agent missed, the look at its next start tells it."""

    def __init__(self) -> None:
        self._waiting: list[TypedLine] = []
        self._held: list[HeldLine] = []
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

    def is_within_window(self, environment_id: int, seconds: float) -> bool:
        return timing.time() - self._sent_at.get(environment_id, 0.0) < seconds

    def is_waiting(self, environment_id: int) -> bool:
        return any(t.environment_id == environment_id for t in self._waiting)

    def hold(self, line: HeldLine) -> None:
        self._held.append(line)

    def held_as_one(self, environment_id: int) -> HeldLine | None:
        held = [h for h in self._held if h.environment_id == environment_id]
        if not held:
            return None
        self._held = [h for h in self._held if h.environment_id != environment_id]
        lines = [h.line.removeprefix(MARK).strip() for h in held]
        return HeldLine(environment_id, f"{MARK} {' | '.join(lines)}", max(h.after for h in held))

    def typed(self, environment_id: int, line: str) -> None:
        moment = timing.time()
        self._sent_at[environment_id] = moment
        self._waiting.append(TypedLine(environment_id, line, moment))
        self._recent = [t for t in self._recent if moment - t.time < RECENT] + [TypedLine(environment_id, line, moment)]

    def carries(self, environment_id: int, prompt: str) -> bool:
        return any(t.environment_id == environment_id and t.holds(prompt) for t in self._recent if timing.time() - t.time < RECENT)

    def confirm(self, environment_id: int, prompt: str) -> bool:
        for typed in self._waiting:
            if typed.environment_id == environment_id and typed.holds(prompt):
                self._waiting.remove(typed)
                return True
        return False

    def confirm_naming(self, environment_id: int, message_id: int) -> bool:
        named = [t for t in self._waiting if t.environment_id == environment_id and message_id in t.messages_named()]
        for typed in named:
            self._waiting.remove(typed)
        return bool(named)

    def overdue(self, environment_id: int, before: float) -> list[TypedLine]:
        return [t for t in self._waiting if t.environment_id == environment_id and t.time <= before]

    def tried_again(self, typed: TypedLine, time: float) -> TypedLine:
        again = TypedLine(typed.environment_id, typed.line, time, typed.tries + 1)
        self._waiting[self._waiting.index(typed)] = again
        self._recent = [t for t in self._recent if time - t.time < RECENT] + [again]
        return again

    def given_up(self, typed: TypedLine) -> None:
        self._waiting.remove(typed)
