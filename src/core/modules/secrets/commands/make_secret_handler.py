from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.send_message import SendMessage
from core.modules.secrets.commands.make_secret import MakeSecret
from core.modules.secrets.models.enums.secret_type import SecretType
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.models.secret_field import SecretField


class MakeSecretHandler(Handler[MakeSecret, Secret]):
    """Saves a new secret with the fields its kind has, or a custom one's named fields; a requested one also
    sends the chat message that asks the user to fill it."""

    command = MakeSecret

    def __init__(self, repository: Repository, bus: Bus) -> None:
        self.repository, self.bus = repository, bus

    def handle(self, command: MakeSecret, context: Context) -> Secret:
        named = tuple((name, True) for name in command.field_names)
        if command.secret_type is SecretType.CUSTOM and not named:
            raise Refusal("a custom secret names its fields", "--field <name>, once for each")
        fields = tuple(SecretField.made(command.title, name, hidden).stored() for name, hidden in (*command.secret_type.first_fields(), *named))
        secret = self.repository.save(Secret(creator_id=context.actor.id, title=command.title, brief=command.brief, secret_type=command.secret_type, fields=fields), context)
        if command.reason:
            asking = SendMessage(f"Please fill in the secret {secret.title} on the Secrets window, never in the chat: I need it {command.reason}.\n\nsecret {secret.id}")
            self.bus.dispatch(asking, context.nested(asking))
        return secret
