from datetime import timedelta

from core.modules.agents.support.person_check import PersonCheck
from engine.time.clock import Clock
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.phone.commands.pair_phone.pair_phone import PairPhone
from core.modules.phone.commands.support.phone_code_maker import PhoneCodeMaker
from core.modules.phone.commands.support.phone_invitation import PhoneInvitation
from core.modules.phone.models.phone_code import PhoneCode

CODE_LIFETIME_MINUTES = 10


class PairPhoneHandler(Handler[PairPhone, PhoneInvitation]):
    """Keeps the digest of a new pairing code for the calling person, valid for ten minutes, and gives the
    code."""

    command = PairPhone

    def __init__(self, repository: Repository, clock: Clock, codes: PhoneCodeMaker) -> None:
        self.repository, self.clock, self.codes = repository, clock, codes

    def handle(self, command: PairPhone, context: Context) -> PhoneInvitation:
        PersonCheck.require(context, "Create a phone pairing code?", returns_output=True)
        code = self.codes.code()
        expires_at = Timestamp(self.clock.timestamp().value + timedelta(minutes=CODE_LIFETIME_MINUTES))
        self.repository.save(PhoneCode(creator_id=context.actor.id, person_id=context.actor.id, code_digest=self.codes.digest(code), expires_at=expires_at), context)
        return PhoneInvitation(code, self.codes.link(code), expires_at)
