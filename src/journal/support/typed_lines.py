import time

from journal.support.held_line import HeldLine
from journal.engine.support.typed_line import TypedLine

RECENT = 60.0
BATCH_SECONDS = 5.0
MARK = "[journal]"


class TypedLines:
    """The lines typed to the agents and not yet seen back as a prompt: a line is confirmed by the prompt that carries its words, and until then it may have been lost. A line for an agent with one still unconfirmed is held, since a line typed while the agent holds another in its queue lands in its prompt box and its Enter only breaks the line."""

    def __init__(self) -> None:
        self._waiting: list[TypedLine] = []
        self._held: list[HeldLine] = []
        self._recent: list[TypedLine] = []
        self._sent_at: dict[int, float] = {}

    def is_within_window(self, environment_id: int, seconds: float) -> bool:
        return time.time() - self._sent_at.get(environment_id, 0.0) < seconds

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
        return HeldLine(environment_id, TypedLine.cut(f"{MARK} {' | '.join(lines)}"), max(h.after for h in held))

    def typed(self, environment_id: int, line: str) -> None:
        now = time.time()
        self._sent_at[environment_id] = now
        self._waiting.append(TypedLine(environment_id, line, now))
        self._recent = [t for t in self._recent if now - t.at < RECENT] + [TypedLine(environment_id, line, now)]

    def carries(self, environment_id: int, prompt: str) -> bool:
        return any(t.environment_id == environment_id and t.holds(prompt) for t in self._recent if time.time() - t.at < RECENT)

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
        return [t for t in self._waiting if t.environment_id == environment_id and t.at <= before]

    def tried_again(self, typed: TypedLine, at: float) -> TypedLine:
        again = TypedLine(typed.environment_id, typed.line, at, typed.tries + 1)
        self._waiting[self._waiting.index(typed)] = again
        self._recent = [t for t in self._recent if at - t.at < RECENT] + [again]
        return again

    def given_up(self, typed: TypedLine) -> None:
        self._waiting.remove(typed)
