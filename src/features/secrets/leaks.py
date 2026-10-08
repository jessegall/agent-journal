import time
from pathlib import Path
from typing import Callable

from controllers.notifications import Notifications
from features.secrets.resource import SecretField
from features.secrets.values import ValuesFile
from resources.base import SYSTEM

SHORTEST = 8
TOLD_EVERY = 600


class LeakAlarm:
    known: dict[str, tuple[float, dict[str, str]]] = {}
    told: dict[tuple[str, str], float] = {}

    def __call__(self, record) -> Callable[[str], str]:
        names = self.names(record)
        return lambda text: self.masked(record, names, text) if text and isinstance(text, str) else text

    def names(self, record) -> dict[str, str]:
        path = ValuesFile(record.root).path
        stamp = path.stat().st_mtime if path.is_file() else 0.0
        held = self.known.get(str(path))
        if held is None or held[0] != stamp:
            held = (stamp, self.loaded(record))
            self.known[str(path)] = held
        return held[1]

    def loaded(self, record) -> dict[str, str]:
        from features.secrets.controller import Secrets
        values = ValuesFile(record.root).values()
        fields = ((row.title, SecretField.from_json(raw)) for row in Secrets(record, actor=SYSTEM).rows.every() for raw in row.secret_fields)
        return {values[field.variable]: title for title, field in fields if field.hidden and len(values.get(field.variable, "")) >= SHORTEST}

    def masked(self, record, names: dict[str, str], text: str) -> str:
        for value, title in names.items():
            if value in text:
                text = text.replace(value, f"[secret {title}]")
                self.tell(record, title)
        return text

    def tell(self, record, title: str) -> None:
        key = (str(Path(record.root)), title)
        if time.time() - self.told.get(key, 0.0) < TOLD_EVERY:
            return
        self.told[key] = time.time()
        Notifications(record, actor=SYSTEM).create(f"The value of the secret {title} was written into the journal",
                                                   brief=f"It was replaced with [secret {title}] before it was saved, but it was seen: rotate it, then fill in the new value under Settings, Secrets.")
