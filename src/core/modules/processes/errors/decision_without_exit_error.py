from core.modules.processes.models.enums.pressure_level import PressureLevel


class DecisionWithoutExitError(ValueError):
    @classmethod
    def at_level(cls, level: PressureLevel) -> "DecisionWithoutExitError":
        return cls(f"a decision at level {level.name} needs an exit the agent takes on its own")
