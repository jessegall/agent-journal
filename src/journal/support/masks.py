import time

from journal.support.secret_values import EMAIL_SIGN_TOKEN, RETIRED, SecretValues

SHORTEST_CHARACTERS = 8


class Masks:
    """The secret values no write may carry: each one found in text about to be written becomes [secret VARIABLE], and the leak is noted for the alarm. A field shown while typing is no secret and never masks. The values are read again when the values file or the list of shown fields changes, by time and size, so two writes in one clock tick are both seen."""

    def __init__(self, values: SecretValues) -> None:
        self.values = values
        self._stamp: tuple = ()
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
        stamp = tuple((path.stat().st_mtime_ns, path.stat().st_size) if path.is_file() else () for path in (self.values.path, self.values.shown_path))
        if stamp != self._stamp:
            self._stamp = stamp
            plain = self.values.shown()
            self._masks = {value: variable.removeprefix(RETIRED).rsplit(EMAIL_SIGN_TOKEN, 1)[0] for variable, value in self.values.values().items() if len(value) >= SHORTEST_CHARACTERS and variable not in plain}
        return self._masks
