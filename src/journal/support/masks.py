import time

from journal.support.secret_values import AT, RETIRED, SecretValues

SHORTEST = 8


class Masks:
    """The secret values no write may carry: each one found in text about to be written becomes [secret VARIABLE], and the leak is noted for the alarm. The values are read again when their file changes."""

    def __init__(self, values: SecretValues) -> None:
        self.values = values
        self._read_at = -1.0
        self._masks: dict[str, str] = {}
        self.leaks: list[tuple[str, float]] = []

    def masked(self, text: str) -> str:
        for value, variable in self.current().items():
            if value not in text:
                continue
            text = text.replace(value, f"[secret {variable}]")
            self.leaks.append((variable, time.time()))
        return text

    def current(self) -> dict[str, str]:
        path = self.values.path
        changed = path.stat().st_mtime if path.is_file() else 0.0
        if changed != self._read_at:
            self._read_at = changed
            self._masks = {value: variable.removeprefix(RETIRED).rsplit(AT, 1)[0] for variable, value in self.values.values().items() if len(value) >= SHORTEST}
        return self._masks
