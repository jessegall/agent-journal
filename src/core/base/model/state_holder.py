from collections.abc import Sequence
from typing import ClassVar

from core.base.model.move import Move


class StateHolder:
    """A trait of a model with a lifecycle: it accepts states that modules add at boot. added_state_moves lists the
    moves of its lifecycle that any added state may also take, so a row can always be cancelled."""

    added_state_moves: ClassVar[Sequence[Move]] = ()
