import json

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.type_guards import is_mapping
from core.modules.phone.commands.subscribe_phone import SubscribePhone
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.phone import Phone


class SubscribePhoneHandler(Handler[SubscribePhone, Phone]):
    """Keeps a subscription on the paired phone whose session token has the digest; a subscription is a JSON object
    that names an endpoint. Only the viewer, as the journal itself, subscribes a phone."""

    command = SubscribePhone

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: SubscribePhone, context: Context) -> Phone:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer subscribes a phone to notices")
        phones = list(self.queries.query(Phone).filter(token_digest=command.token_digest, state=PhoneState.PAIRED).all_rows())
        if not phones:
            raise Refusal("no paired phone has this session")
        if command.subscription is not None and not self.names_endpoint(command.subscription):
            raise Refusal("a subscription is a JSON object with an endpoint", "send what the push manager gave")
        return self.repository.save(phones[0].changed(subscription=command.subscription), context)

    def names_endpoint(self, text: str) -> bool:
        try:
            parsed: object = json.loads(text)
        except ValueError:
            return False
        return is_mapping(parsed) and isinstance(parsed.get("endpoint"), str)
