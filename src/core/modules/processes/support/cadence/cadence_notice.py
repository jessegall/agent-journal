from collections.abc import Mapping
from dataclasses import dataclass

from engine.driver.message_template import MessageTemplate


@dataclass(frozen=True)
class CadenceNotice:
    """The declaration of one cadence notice and the values it is sent with."""

    declaration: MessageTemplate
    fields: Mapping[str, object]
