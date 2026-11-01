from core.modules.secrets.models.secret_field import SecretField
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.secrets.commands.edit_secret.edit_secret import EditSecret
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class EditSecretHandler(Handler[EditSecret, Secret]):
    """Saves a secret's new title or how it is used; its fields keep their variables, and fields can be added or removed."""

    command = EditSecret

    def __init__(self, secrets: SecretQuery, repository: Repository) -> None:
        self.secrets, self.repository = secrets, repository

    def handle(self, command: EditSecret, context: Context) -> Secret:
        secret = self.secrets.find(command.secret_id)
        title = command.title or secret.title
        kept = tuple(field for field in secret.fields if field["name"] not in command.removed_fields)
        added = tuple(SecretField.made(title, name, True).stored() for name in command.added_fields if name not in {field["name"] for field in kept})
        filled = tuple(name for name in secret.filled if name not in command.removed_fields)
        return self.repository.save(secret.changed(title=title, brief=command.brief or secret.brief, fields=(*kept, *added), filled=filled), context)
