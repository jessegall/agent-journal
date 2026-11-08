from dataclasses import dataclass


@dataclass(frozen=True)
class WorkField:
    """One setting of the Tests or Advanced tab: its group, title, description and type, the value it holds,
    where it comes from and the badge it carries."""

    key: str
    group: str
    title: str
    description: str
    type: str
    value: object
    source: str
    choices: tuple[int | str, ...] = ()
    badge: str = ""
