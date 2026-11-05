from enum import StrEnum
from typing import ClassVar


class SessionPrivate:
    """A model whose new row is hidden when one session makes it for another."""

    hidden_state: ClassVar[StrEnum]
    session_agent_id: int
