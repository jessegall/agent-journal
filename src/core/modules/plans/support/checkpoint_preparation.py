from dataclasses import dataclass


@dataclass(frozen=True)
class CheckpointPreparation:
    """What was decided and made for the run of a reach before the write that starts it, since a suite's checkout
    or diff never runs while every other write waits. The core's runs need nothing but the reach."""

    reach_id: int
