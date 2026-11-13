from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.secrets.commands.make_secret.make_secret import MakeSecret
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.models.support.secret_field import SecretField
from core.modules.secrets.queries.secret_query import SecretQuery


class MakeSecretHandler(Handler[MakeSecret, Secret]):
    """Saves a new secret with the fields its type has, or a custom one's named fields; a requested one also
    sends the chat message that asks the user to fill it."""

    command = MakeSecret

    def __init__(self, secrets: SecretQuery, repository: Repository, bus: Bus) -> None:
        self.secrets, self.repository, self.bus = secrets, repository, bus

    def handle(self, command: MakeSecret, context: Context) -> Secret:
        if command.secret_type is SecretType.CUSTOM and not command.field_names:
            raise Refusal("a custom secret needs at least one field", "--field <name>, once for each")
        field_specs = [*command.secret_type.first_fields(), *((field_name, True) for field_name in command.field_names)]
        names = [field_name for field_name, _ in field_specs]
        if len(set(names)) != len(names):
            raise Refusal(f"this secret repeats a field: {', '.join(names)}", "leave out a field the type of secret already has")
        stem = SecretField.free_stem(command.title, tuple(names), self.secrets.used_variables())
        fields = tuple(SecretField.made(stem, field_name, hidden).stored() for field_name, hidden in field_specs)
        secret = self.repository.save(Secret(creator_id=context.actor.id, title=command.title, brief=command.brief, secret_type=command.secret_type, fields=fields), context)
        if command.reason:
            asking = SendMessage(f"Please fill in the secret {secret.title} on the Secrets window, never in the chat: I need it {command.reason}.\n\nsecret {secret.id}")
            self.bus.dispatch(asking, context.nested(asking))
        return secret
