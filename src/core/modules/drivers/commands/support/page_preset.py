from dataclasses import dataclass


@dataclass(frozen=True)
class PagePreset:
    """One preset of a viewer page as the picker lists it: its key, name and line, and its stored shape."""

    key: str
    name: str
    text: str
    shape: object
