from enum import StrEnum

from engine.profile.errors.unhandled_occupant_error import UnhandledOccupantError


class Occupant(StrEnum):
    """How long the program session of a kept agent lives: it continues, it is replaced when its prompt cache
    has gone cold, or every launch starts a new one."""

    CONTINUE = "continue"
    COLD_ROTATION = "when-cold"
    LAUNCH_ROTATION = "each-launch"

    def replaces(self, is_cold: bool) -> bool:
        match self:
            case Occupant.CONTINUE:
                return False
            case Occupant.COLD_ROTATION:
                return is_cold
            case Occupant.LAUNCH_ROTATION:
                return True
            case _:
                raise UnhandledOccupantError.detected(self)

    @property
    def may_change_program(self) -> bool:
        return self is Occupant.LAUNCH_ROTATION

    @property
    def continuation(self) -> "Occupant":
        return Occupant.CONTINUE if self is Occupant.LAUNCH_ROTATION else self


INDEPENDENT_OCCUPANTS = {True: Occupant.LAUNCH_ROTATION, False: Occupant.COLD_ROTATION}
