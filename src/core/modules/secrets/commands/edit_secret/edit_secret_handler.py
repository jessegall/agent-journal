from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.secrets.commands.edit_secret.edit_secret import EditSecret
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class EditSecretHandler(Handler[EditSecret, Secret]):
    """Saves a secret's new title or how it is used; its fields keep their variables."""

    command = EditSecret

    def __init__(self, secrets: SecretQuery, repository: Repository) -> None:
        self.secrets, self.repository = secrets, repository

    def handle(self, command: EditSecret, context: Context) -> Secret:
        secret = self.secrets.find(command.secret_id)
        return self.repository.save(secret.changed(title=command.title or secret.title, brief=command.brief or secret.brief), context)
