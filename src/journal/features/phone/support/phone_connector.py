import hashlib
import secrets
from datetime import datetime, timedelta

from journal.features.phone.support.paired_phone import PairedPhone
from journal.features.phone.support.connection_proposal import ConnectionProposal
from journal.features.sharing.support.tunnel import Tunnel
from journal.models.pairing_code import PairingCode
from journal.models.phone import Phone
from journal.repositories.pairing_codes import PairingCodes
from journal.repositories.phones import Phones
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.support.cards import Cards
from journal.support.rejection import Rejection
from journal.support.card_kind import CardKind

CODE_MINUTES = 10
DAYS = (1, 7, 30)
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
DEVICE_LONGEST = 60


class PhoneConnector:
    """How a phone pairs, as version 3 did: the user asks for a code on the desk, the phone hands it back once within minutes and is given a key it keeps; one phone at a time, a newer code replacing an older one, too many wrong codes voiding it."""

    def __init__(self, phones: Phones, codes: PairingCodes, tunnel: Tunnel, cards: Cards) -> None:
        self.phones, self.codes, self.tunnel, self.cards = phones, codes, tunnel, cards

    def proposal(self, days: int, actor: Actor, time: datetime) -> ConnectionProposal:
        if actor.kind != ActorKind.USER:
            raise Rejection("only the user pairs a phone, from the viewer's Connect your phone dialog")
        if days not in DAYS:
            raise Rejection(f"a phone stays paired for {', '.join(map(str, DAYS))} days, not {days}")
        address = self.tunnel.address()
        if not address:
            raise Rejection("a phone pairs through the tunnel's address, and this journal has none yet: log tunler in under Settings, Share links, then try again")
        self.refuse_duplicate(time)
        for older in self.codes.open(time):
            self.codes.save(older.closed(time), actor)
        code, short = secrets.token_urlsafe(24), "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        pairing = self.codes.save(PairingCode(code=self.hashed(code), short=self.hashed(short), days=days, until=time + timedelta(minutes=CODE_MINUTES)), actor)
        self.tunnel.reconcile()
        return ConnectionProposal(link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", address=address, until=pairing.until)

    def pair(self, given: str, device: str, time: datetime) -> PairedPhone:
        hashes = {self.hashed(given), self.hashed(self.typed(given))}
        rows = next((code for code in self.codes.open(time) if hashes & {code.code, code.short}), None)
        if rows is None:
            self.missed(time)
            raise Rejection("that code pairs no phone: ask for a new one on the computer")
        self.refuse_duplicate(time)
        key = secrets.token_urlsafe(32)
        self.codes.save(rows.closed(time), Actor.system())
        name = " ".join(device.split())[:DEVICE_LONGEST] or "A phone"
        phone = self.phones.save(Phone(environment_id=rows.environment_id, name=name, key=self.hashed(key), expires_at=time + timedelta(days=rows.days), last_seen_at=time), Actor.system())
        self.cards.show(rows.environment_id, "", f"A phone paired: {name}", "phone", shows=CardKind.PHONES)
        self.tunnel.reconcile()
        return PairedPhone(phone, key)

    def disconnect(self, phone: Phone, actor: Actor, time: datetime) -> Phone:
        if not actor.is_user():
            raise Rejection("only the user disconnects a phone")
        ended = self.phones.save(phone.ended(time), actor)
        self.tunnel.reconcile()
        return ended

    def refuse_duplicate(self, time: datetime) -> None:
        live = self.phones.active(time)
        if live:
            raise Rejection(f"{live[0].name} is paired: disconnect it first, one phone at a time")

    def missed(self, time: datetime) -> None:
        for code in self.codes.open(time):
            self.codes.save(code.tried(time), Actor.system())

    @staticmethod
    def hashed(secret: str) -> str:
        return hashlib.sha256(secret.encode()).hexdigest()

    @staticmethod
    def typed(code: str) -> str:
        return "".join(letter for letter in code.upper() if letter in SHORT_LETTERS)
