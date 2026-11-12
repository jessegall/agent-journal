from engine.enums.actor_type import ActorType
from engine.time.clock import Clock
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.phone.commands.support.phone_code_maker import PhoneCodeMaker
from core.modules.phone.commands.redeem_phone_code.redeem_phone_code import RedeemPhoneCode
from core.modules.phone.models.enums.phone_code_state import PhoneCodeState
from core.modules.phone.models.lifecycles.phone_code_lifecycle import PhoneCodeLifecycle
from core.modules.phone.models.phone_code import PhoneCode
from core.modules.phone.models.phone import Phone

UNKNOWN_CODE = "this code pairs no phone"


class RedeemPhoneCodeHandler(Handler[RedeemPhoneCode, Phone]):
    """Redeems an open, unexpired pairing code once and pairs a phone as the person who asked for it; only the
    viewer's listener redeems one, as the journal itself."""

    command = RedeemPhoneCode

    def __init__(self, repository: Repository, queries: Queries, clock: Clock, codes: PhoneCodeMaker) -> None:
        self.repository, self.queries, self.clock, self.codes = repository, queries, clock, codes

    def handle(self, command: RedeemPhoneCode, context: Context) -> Phone:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer redeems a pairing code", "open the pairing link on the phone")
        open_codes = self.queries.query(PhoneCode).filter(code_digest=self.codes.digest(command.code), state=PhoneCodeState.OPEN).get()
        if not open_codes or open_codes[0].expires_at <= self.clock.timestamp():
            raise Refusal(UNKNOWN_CODE, "ask for a new code with journal phone pair")
        code = self.repository.save(open_codes[0].moved(PhoneCodeLifecycle.spend), context)
        return self.repository.save(Phone(creator_id=code.person_id, person_id=code.person_id, name=command.name, token_digest=command.token_digest), context)
