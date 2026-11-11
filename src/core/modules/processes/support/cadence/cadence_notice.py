from collections.abc import Mapping
from dataclasses import dataclass

from engine.driver.nudge_declaration import NudgeDeclaration


@dataclass(frozen=True)
class CadenceNotice:
    """The declaration of one cadence notice and the values it is sent with."""

    declaration: NudgeDeclaration
    fields: Mapping[str, object]
