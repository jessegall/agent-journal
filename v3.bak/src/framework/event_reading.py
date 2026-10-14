"""The events an environment's log holds past a place, as plain rows, for a process of its own that has no lane to ask a service of."""

from pathlib import Path

from engine.record import Record


class EventReading:
    def __init__(self, root: Path):
        self.root = root
        self.records: dict[str, Record] = {}

    def since(self, env: str, newest: int) -> list[dict]:
        """The events of an environment after the id given, oldest first."""
        record = self.records.setdefault(env, Record(self.root, env))
        return [event.to_json() for event in record.event_log.events(since=newest)]
