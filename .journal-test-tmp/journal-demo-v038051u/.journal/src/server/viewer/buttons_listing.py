from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from server.viewer.button_permission import ButtonPermission


@dataclass(frozen=True)
class ButtonsListing:
    buttons: Sequence[Mapping[str, Any]]
    missing: Mapping[str, Sequence[ButtonPermission]]
