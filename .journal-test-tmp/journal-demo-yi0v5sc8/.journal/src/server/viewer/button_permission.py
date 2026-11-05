from dataclasses import dataclass


@dataclass(frozen=True)
class ButtonPermission:
    label: str
    line: str
