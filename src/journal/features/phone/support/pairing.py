import hashlib
import secrets
from datetime import datetime, timedelta

from journal.features.phone.support.paired_phone import PairedPhone
from journal.features.phone.support.pairing_offer import PairingOffer
from journal.features.sharing.support.tunnel import Tunnel
from journal.models.pairing_code import PairingCode
from journal.models.phone import Phone
from journal.repositories.pairing_codes import PairingCodes
from journal.repositories.phones import Phones
from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.support.cards import Cards
from journal.support.refused import Refused
from journal.support.chat_mark import ChatMark

CODE_MINUTES = 10
DAYS = (1, 7, 30)
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
DEVICE_LONGEST = 60


class Pairing:
    """How a phone pairs, as version 3 did: the user asks for a code on the desk, the phone hands it back once within minutes and is given a key it keeps; one phone at a time, a newer code replacing an older one, too many wrong codes voiding it."""

    def __init__(self, phones: Phones, codes: PairingCodes, tunnel: Tunnel, cards: Cards) -> None:
        self.phones, self.codes, self.tunnel, self.cards = phones, codes, tunnel, cards

    def offer(self, days: int, actor: Actor, now: datetime) -> PairingOffer:
        if actor.kind != ActorKind.USER:
            raise Refused("only the user pairs a phone, from the viewer's Connect your phone dialog")
        if days not in DAYS:
            raise Refused(f"a phone stays paired for {', '.join(map(str, DAYS))} days, not {days}")
        address = self.tunnel.address()
        if not address:
            raise Refused("a phone pairs through the tunnel's address, and this journal has none yet: log tunler in under Settings, Share links, then try again")
        self.refuse_a_second(now)
        for older in self.codes.open(now):
            self.codes.save(older.closed(now), actor)
        code, short = secrets.token_urlsafe(24), "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        pairing = self.codes.save(PairingCode(code=self.hashed(code), short=self.hashed(short), days=days, until=now + timedelta(minutes=CODE_MINUTES)), actor)
        self.tunnel.settle()
        return PairingOffer(link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", address=address, until=pairing.until)

    def pair(self, given: str, device: str, now: datetime) -> PairedPhone:
        hashes = {self.hashed(given), self.hashed(self.typed(given))}
        rows = next((code for code in self.codes.open(now) if hashes & {code.code, code.short}), None)
        if rows is None:
            self.missed(now)
            raise Refused("that code pairs no phone: ask for a new one on the computer")
        self.refuse_a_second(now)
        key = secrets.token_urlsafe(32)
        self.codes.save(rows.closed(now), Actor.system())
        name = " ".join(device.split())[:DEVICE_LONGEST] or "A phone"
        phone = self.phones.save(Phone(environment_id=rows.environment_id, name=name, key=self.hashed(key), expires_at=now + timedelta(days=rows.days), last_seen_at=now), Actor.system())
        self.cards.show(rows.environment_id, "", f"A phone paired: {name}", "phone", shows=ChatMark.PHONES)
        self.tunnel.settle()
        return PairedPhone(phone, key)

    def disconnect(self, phone: Phone, actor: Actor, now: datetime) -> Phone:
        if not actor.is_the_user():
            raise Refused("only the user disconnects a phone")
        ended = self.phones.save(phone.ended(now), actor)
        self.tunnel.settle()
        return ended

    def refuse_a_second(self, now: datetime) -> None:
        live = self.phones.live(now)
        if live:
            raise Refused(f"{live[0].name} is paired: disconnect it first, one phone at a time")

    def missed(self, now: datetime) -> None:
        for code in self.codes.open(now):
            self.codes.save(code.tried(now), Actor.system())

    @staticmethod
    def hashed(secret: str) -> str:
        return hashlib.sha256(secret.encode()).hexdigest()

    @staticmethod
    def typed(code: str) -> str:
        return "".join(letter for letter in code.upper() if letter in SHORT_LETTERS)
