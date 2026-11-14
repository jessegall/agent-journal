from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.phone.commands.send_phone_notices.send_phone_notices import SendPhoneNotices
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.phone import Phone
from core.modules.phone.support.push_service import PushService

UNKNOWN_STATUSES = (404, 410)


class SendPhoneNoticesHandler(Handler[SendPhoneNotices, int]):
    """Pushes each paired phone whose notice waits, once, and clears the mark; a phone the push service no
    longer knows loses its subscription. Only the journal itself, in the ticker's round, sends."""

    command = SendPhoneNotices

    def __init__(self, queries: Queries, repository: Repository, service: PushService) -> None:
        self.queries, self.repository, self.service = queries, repository, service

    def handle(self, command: SendPhoneNotices, context: Context) -> int:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the journal's own round sends notices to phones")
        phones = self.queries.query(Phone).filter(state=PhoneState.PAIRED, notice_waiting=True).get()
        for phone in phones:
            endpoint = phone.endpoint
            unknown = endpoint is not None and self.service.send(endpoint) in UNKNOWN_STATUSES
            self.repository.save(phone.changed(notice_waiting=False, subscription=None if unknown else phone.subscription), context)
        return len(phones)
