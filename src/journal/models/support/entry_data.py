from dataclasses import asdict


class EntryData:
    """A record an entry holds as its data, with when it was recorded read from the entry and never stored in the data."""

    def to_data(self) -> dict:
        return {name: value for name, value in asdict(self).items() if name != "at"}
