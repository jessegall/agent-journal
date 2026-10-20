import time

from journal.support.held_line import HeldLine
from journal.engine.support.typed_line import TypedLine

RECENT = 60.0
"""How long a line the journal typed is known as its own, so a piece of one the terminal split is never taken for the user's words."""


class TypedLines:
    """The lines typed to the agents and not yet seen back as a prompt: a line is confirmed by the prompt that carries its words, and until then it may have been lost. A line for an agent with one still unconfirmed is held, since a line typed while the agent holds another in its queue lands in its prompt box and its Enter only breaks the line."""

    def __init__(self) -> None:
        self._waiting: list[TypedLine] = []
        self._held: list[HeldLine] = []
        self._recent: list[TypedLine] = []

    def is_waiting(self, environment_id: int) -> bool:
        """Whether a line typed to the environment's agent is not yet seen back."""
        return any(t.environment_id == environment_id for t in self._waiting)

    def hold(self, line: HeldLine) -> None:
        self._held.append(line)

    def next_held(self, environment_id: int) -> HeldLine | None:
        """The oldest line held for the environment, taken from the hold; none when nothing waits."""
        held = next((h for h in self._held if h.environment_id == environment_id), None)
        if held is not None:
            self._held.remove(held)
        return held

    def typed(self, environment_id: int, line: str) -> None:
        now = time.time()
        self._waiting.append(TypedLine(environment_id, line, now))
        self._recent = [t for t in self._recent if now - t.at < RECENT] + [TypedLine(environment_id, line, now)]

    def carries(self, environment_id: int, prompt: str) -> bool:
        """Whether the prompt is a line the journal typed lately, or a piece of one, the terminal's line breaks aside."""
        return any(t.environment_id == environment_id and t.holds(prompt) for t in self._recent if time.time() - t.at < RECENT)

    def confirm(self, environment_id: int, prompt: str) -> bool:
        """The oldest waiting line the prompt is, or a piece of, is confirmed: a piece arrived means the line did, and typing it again would only bring another piece; False when none was waiting."""
        for typed in self._waiting:
            if typed.environment_id == environment_id and typed.holds(prompt):
                self._waiting.remove(typed)
                return True
        return False

    def overdue(self, environment_id: int, before: float) -> list[TypedLine]:
        return [t for t in self._waiting if t.environment_id == environment_id and t.at <= before]

    def tried_again(self, typed: TypedLine, at: float) -> TypedLine:
        """The line typed once more, known again as the journal's own from now, so a piece of it the terminal split later is never the user's."""
        again = TypedLine(typed.environment_id, typed.line, at, typed.tries + 1)
        self._waiting[self._waiting.index(typed)] = again
        self._recent = [t for t in self._recent if at - t.at < RECENT] + [again]
        return again

    def given_up(self, typed: TypedLine) -> None:
        self._waiting.remove(typed)
