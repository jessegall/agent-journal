import time
from pathlib import Path

from journal.support.secret_values import EMAIL_SIGN_TOKEN, RETIRED, SecretValues

SHORTEST_CHARACTERS = 8


class Masks:
    """The secret values no write may carry: each one found in text about to be written becomes [secret VARIABLE], and the leak is noted for the alarm. A field shown while typing is no secret and never masks. The values are read again when the values file or the list of shown fields changes, by time and size, looked at once per statement, so two writes in one clock tick are both seen."""

    def __init__(self, values: SecretValues) -> None:
        self.values = values
        self._stamp: tuple = ()
        self._masks: dict[str, str] = {}
        self.leaks: list[tuple[str, float]] = []

    def masked(self, params: tuple) -> tuple:
        masks = self.current()
        return tuple(self.replaced(param, masks) if isinstance(param, str) and masks else param for param in params)

    def replaced(self, text: str, masks: dict[str, str]) -> str:
        for value, variable in masks.items():
            if value not in text:
                continue
            text = text.replace(value, f"[secret {variable}]")
            self.leaks.append((variable, time.time()))
        return text

    def current(self) -> dict[str, str]:
        stamp = (self.stamp(self.values.path), self.stamp(self.values.shown_path))
        if stamp != self._stamp:
            self._stamp = stamp
            plain = self.values.shown()
            self._masks = {value: variable.removeprefix(RETIRED).rsplit(EMAIL_SIGN_TOKEN, 1)[0] for variable, value in self.values.values().items() if len(value) >= SHORTEST_CHARACTERS and variable not in plain}
        return self._masks

    @staticmethod
    def stamp(path: Path) -> tuple:
        try:
            status = path.stat()
        except FileNotFoundError:
            return ()
        return status.st_mtime_ns, status.st_size
