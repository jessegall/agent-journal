from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileText:
    fields: Mapping[str, str]
    body: str
