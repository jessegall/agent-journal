from datetime import timedelta

from core.base.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.timestamp import Timestamp
from core.modules.phone.commands.pair_phone import PairPhone
from core.modules.phone.commands.phone_code_maker import PhoneCodeMaker
from core.modules.phone.commands.phone_invitation import PhoneInvitation
from core.modules.phone.models.phone_code import PhoneCode

CODE_LIFETIME_MINUTES = 10


class PairPhoneHandler(Handler[PairPhone, PhoneInvitation]):
    """Keeps the digest of a new pairing code for the calling person, valid for ten minutes, and gives the code."""

    command = PairPhone

    def __init__(self, repository: Repository, clock: Clock, codes: PhoneCodeMaker) -> None:
        self.repository, self.clock, self.codes = repository, clock, codes

    def handle(self, command: PairPhone, context: Context) -> PhoneInvitation:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person pairs a phone", "ask the user to pair it from the viewer")
        code = self.codes.code()
        expires_at = Timestamp(self.clock.timestamp().value + timedelta(minutes=CODE_LIFETIME_MINUTES))
        self.repository.save(PhoneCode(creator_id=context.actor.id, person_id=context.actor.id, code_digest=self.codes.digest(code), expires_at=expires_at), context)
        return PhoneInvitation(code, self.codes.link(code), expires_at)
