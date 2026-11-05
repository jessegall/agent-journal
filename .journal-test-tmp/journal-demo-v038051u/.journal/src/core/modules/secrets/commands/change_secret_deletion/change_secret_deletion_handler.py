from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.secrets.commands.change_secret_deletion.change_secret_deletion import ChangeSecretDeletion
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class ChangeSecretDeletionHandler(Handler[ChangeSecretDeletion, Secret]):
    """Marks a secret deleted at this moment, or clears the mark."""

    command = ChangeSecretDeletion

    def __init__(self, secrets: SecretQuery, repository: Repository) -> None:
        self.secrets, self.repository = secrets, repository

    def handle(self, command: ChangeSecretDeletion, context: Context) -> Secret:
        secret = self.secrets.find(command.secret_id)
        return self.repository.save(secret.changed(deleted_at=context.timestamp if command.deleted else None), context)
