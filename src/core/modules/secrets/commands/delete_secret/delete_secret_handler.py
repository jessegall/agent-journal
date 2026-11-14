from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.person_check import PersonCheck
from engine.private.secret_values import SecretValues
from engine.repository.repository import Repository
from core.modules.secrets.commands.delete_secret.delete_secret import DeleteSecret
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery


class DeleteSecretHandler(Handler[DeleteSecret, Secret]):
    """Erases a secret's values from the values file, with their replaced copies, and deletes its row; only a user
    erases one, since nothing brings it back."""

    command = DeleteSecret

    def __init__(self, secrets: SecretQuery, repository: Repository, values: SecretValues) -> None:
        self.secrets, self.repository, self.values = secrets, repository, values

    def handle(self, command: DeleteSecret, context: Context) -> Secret:
        PersonCheck.require(context, "only a user deletes a secret, since a deleted secret cannot be restored")
        secret = self.secrets.find(command.secret_id)
        self.values.erase(tuple(field.variable for field in secret.secret_fields()))
        self.repository.delete(secret, context)
        return secret
