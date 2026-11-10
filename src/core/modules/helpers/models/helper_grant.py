from collections.abc import Sequence
from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model

ALTERNATIVE_SEPARATOR = "|"
ANY_VALUE_MARK = "=*"


@dataclass(frozen=True, kw_only=True)
class HelperGrant(EnvironmentScoped, Model):
    """What one helper may run: a program, its allowed subcommands and its allowed arguments and values."""

    model_name = "helper_grant"
    cli_name = "helper-grant"

    environment_id: int = 0
    helper_id: int
    program: str
    subcommands: str
    arguments: str

    def allows(self, command_parts: Sequence[str]) -> bool:
        if len(command_parts) < 2 or command_parts[0] != self.program or command_parts[1] not in self.subcommands.split(ALTERNATIVE_SEPARATOR):
            return False
        allowed = self.arguments.split(ALTERNATIVE_SEPARATOR)
        flags_with_any_value = {argument.removesuffix(ANY_VALUE_MARK) for argument in allowed if argument.endswith(ANY_VALUE_MARK)}
        place = 2
        while place < len(command_parts):
            word = command_parts[place]
            if word.partition("=")[0] in flags_with_any_value:
                place += 1 if "=" in word else 2
                continue
            if word not in allowed:
                return False
            place += 1
        return True
