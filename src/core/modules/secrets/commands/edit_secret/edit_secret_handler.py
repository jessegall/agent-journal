from core.modules.secrets.models.support.secret_field import SecretField
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.secrets.commands.edit_secret.edit_secret import EditSecret
from core.modules.secrets.models.secret import Secret
from core.modules.agents.support.person_check import PersonCheck
from core.modules.secrets.queries.secret_query import SecretQuery
from engine.private.secret_values import SecretValues


class EditSecretHandler(Handler[EditSecret, Secret]):
    """Saves a secret's new title or how it is used; its fields keep their variables, and fields can be added,
    or removed by a person, whose hidden value then stays only to be masked."""

    command = EditSecret

    def __init__(self, secrets: SecretQuery, repository: Repository, values: SecretValues) -> None:
        self.secrets, self.repository, self.values = secrets, repository, values

    def handle(self, command: EditSecret, context: Context) -> Secret:
        if command.removed_fields:
            PersonCheck.require(context, "only a person removes a field of a secret")
        secret = self.secrets.find(command.secret_id)
        title = command.title or secret.title
        kept = tuple(field for field in secret.fields if field["name"] not in command.removed_fields)
        added = tuple(SecretField.made(title, name, True).stored() for name in command.added_fields if name not in {field["name"] for field in kept})
        filled = tuple(name for name in secret.filled if name not in command.removed_fields)
        saved = self.repository.save(secret.changed(title=title, brief=command.brief or secret.brief, fields=(*kept, *added), filled=filled), context)
        for field in (field for field in secret.fields if field["name"] in command.removed_fields):
            self.values.retire(str(field["variable"]), int(context.timestamp.value.timestamp()))
        return saved
