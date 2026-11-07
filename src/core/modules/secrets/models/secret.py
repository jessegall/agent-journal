from collections.abc import Mapping
from dataclasses import dataclass

from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.support.secret_field import SecretField


@dataclass(frozen=True, kw_only=True)
class Secret(Model):
    """A key or a login the agent may use without seeing it: its fields, which are filled, the programs it may
    go to and those proposed; its values live in the values file outside the project, never in a row."""

    model_name = "secret"
    cli_name = "secret"

    creator_id: int
    title: str
    brief: str = ""
    secret_type: SecretType
    fields: tuple[Mapping[str, object], ...] = ()
    filled: tuple[str, ...] = ()
    programs: tuple[str, ...] = ()
    proposed: tuple[str, ...] = ()
    helpers: bool = False
    deleted_at: Timestamp | None = None

    def secret_fields(self) -> tuple[SecretField, ...]:
        return tuple(SecretField.parsed(raw) for raw in self.fields)

    def field(self, name: str) -> SecretField:
        secret_field = next((field for field in self.secret_fields() if field.name == name), None)
        if secret_field is None:
            raise Refusal(f"secret {self.id} has no field {name}", f"its fields are {', '.join(field.name for field in self.secret_fields()) or 'none'}")
        return secret_field

    def is_waiting(self) -> bool:
        return any(field.name not in self.filled for field in self.secret_fields())

    def with_filled(self, name: str) -> "Secret":
        return self.changed(filled=tuple(dict.fromkeys((*self.filled, self.field(name).name))))

    def with_program(self, program: str) -> "Secret":
        return self.changed(programs=tuple(dict.fromkeys((*self.programs, program))), proposed=tuple(name for name in self.proposed if name != program))
