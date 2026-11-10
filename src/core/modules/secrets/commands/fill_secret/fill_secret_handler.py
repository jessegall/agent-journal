from core.base.file_access import FileAccess
from pathlib import Path

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.secrets.commands.fill_secret.fill_secret import FillSecret
from core.modules.secrets.commands.support.filled_field import FilledField
from core.modules.secrets.queries.secret_query import SecretQuery
from core.base.private.secret_values import SecretValues


class FillSecretHandler(Handler[FillSecret, FilledField]):
    """Stores a field's value in the values file, never in a row, and marks the field filled; only the user
    types a value, and a value from a file is read and the file deleted, an empty one too."""

    command = FillSecret
    runs_once = True

    def __init__(self, secrets: SecretQuery, repository: Repository, values: SecretValues) -> None:
        self.secrets, self.repository, self.values = secrets, repository, values

    def handle(self, command: FillSecret, context: Context) -> FilledField:
        secret = self.secrets.find(command.secret_id)
        field = secret.field(command.field_name)
        value = self.read_file(command.file) if command.file else self.typed(command.value, context)
        self.values.put(field.variable, value, field.hidden, int(context.timestamp.value.timestamp()))
        return FilledField(self.repository.save_change(secret, secret.with_filled(field.name), context), field.name, command.file)

    @staticmethod
    def typed(value: str, context: Context) -> str:
        if context.actor.type is not ActorType.USER:
            raise Refusal("credential values are entered by a person in the Secrets window")
        if not value.strip():
            raise Refusal("the value is blank", "type the value on the Secrets window")
        return value.strip()

    @staticmethod
    def read_file(name: str) -> str:
        file = Path(name)
        if not file.is_file():
            raise Refusal(f"no file at {name}", "write the value you made to a file, and the journal moves it into the secret")
        value = FileAccess.shared().read(file).strip()
        file.unlink()
        if not value:
            raise Refusal(f"{name} held no value; it is deleted all the same")
        return value
