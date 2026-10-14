import time
from pathlib import Path
from typing import Callable

from controllers.types import Notifications, Secrets
from resources.base import SYSTEM

TOLD_EVERY = 600


class LeakAlarm:
    known: dict[str, tuple[float, dict[str, str]]] = {}
    told: dict[tuple[str, str], float] = {}

    def __call__(self, record) -> Callable[[str], str]:
        names = self.names(record)
        return lambda text: self.masked(record, names, text) if text and isinstance(text, str) else text

    def names(self, record) -> dict[str, str]:
        secrets = Secrets(record, actor=SYSTEM)
        path, stamp = secrets.values_stamp()
        held = self.known.get(path)
        if held is None or held[0] != stamp:
            held = (stamp, secrets.hidden_values())
            self.known[path] = held
        return held[1]

    def masked(self, record, names: dict[str, str], text: str) -> str:
        for value, title in names.items():
            if value not in text:
                continue
            text = text.replace(value, f"[secret {title}]")
            self.tell(record, title)
        return text

    def tell(self, record, title: str) -> None:
        key = (str(Path(record.root)), title)
        if time.time() - self.told.get(key, 0.0) < TOLD_EVERY:
            return
        self.told[key] = time.time()
        Notifications(record, actor=SYSTEM).create(f"The value of the secret {title} was written into the journal",
                                                   brief=f"It was replaced with [secret {title}] before it was saved, but it was seen: rotate it, then fill in the new value on the Secrets page.")
