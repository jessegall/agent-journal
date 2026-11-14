from core.modules.processes.models.enums.pressure_level import PressureLevel


class ExitlessDecisionError(ValueError):
    @classmethod
    def level_error(cls, level: PressureLevel) -> "ExitlessDecisionError":
        return cls(f"a decision at level {level.name} needs an exit the agent takes on its own")
