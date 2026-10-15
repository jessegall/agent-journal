import time

from journal.engine.typed_line import TypedLine


class TypedLines:
    """The lines typed to the agents and not yet seen back as a prompt: a line is confirmed by the prompt that carries its words, and until then it may have been lost."""

    def __init__(self) -> None:
        self._waiting: list[TypedLine] = []

    def typed(self, environment_id: int, line: str) -> None:
        self._waiting.append(TypedLine(environment_id, line, time.time()))

    def confirm(self, environment_id: int, prompt: str) -> bool:
        """The oldest waiting line with these words is confirmed; False when none was waiting."""
        words = prompt.strip()
        for typed in self._waiting:
            if typed.environment_id == environment_id and typed.line.strip() == words:
                self._waiting.remove(typed)
                return True
        return False

    def overdue(self, environment_id: int, before: float) -> list[TypedLine]:
        return [t for t in self._waiting if t.environment_id == environment_id and t.at <= before]

    def tried_again(self, typed: TypedLine, at: float) -> TypedLine:
        again = TypedLine(typed.environment_id, typed.line, at, typed.tries + 1)
        self._waiting[self._waiting.index(typed)] = again
        return again

    def given_up(self, typed: TypedLine) -> None:
        self._waiting.remove(typed)
