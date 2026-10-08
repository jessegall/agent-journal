import hashlib
import secrets
import time
from dataclasses import asdict, replace
from pathlib import Path
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from controllers.notices import Notices
from controllers.requests import request
from engine.outbox import Request
from engine import runtime
from engine.record import Record
from features.phone.feed import waiting
from features.phone.guard import RecordGuard, guard_of
from features.phone.passkey import CREATE, GET, Assertion, Challenge, Creating, Enrolment, Getting, Passkey, PendingPasskey, Relying, Unlock, Unverified, creating
from features.phone.places import Place, place_at, places
from features.phone.push import Keys, allowed, send, unpadded
from features.phone.resource import Phone
from features.phone.surface import CARDS
from features.sharing.controller import Shares
from features.trigger import DAY
from resources.base import PROJECT, SYSTEM, USER, Refused, titled

CODE_SECONDS = 600
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "short", "code_until", "expires", "environment", "journal", "days", "push", "pushed", "home", "tries", "passkey", "challenge", "unlock", "pending_passkey")
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
WAITING_CARD = "waiting"
MOST_TRIES = 10
CHALLENGE_SECONDS = 120
UNLOCK_SECONDS = 60
ALLOW_SECONDS = 120
PASSKEY_NOTICE = "passkey"


class Code(TypedDict):
    n: int
    link: str
    short: str
    code_until: float
    address: str


def typed(code: str) -> str:
    return "".join(letter for letter in code.upper() if letter in SHORT_LETTERS)


def hashed(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


class Phones(Controller):
    resource = Phone

    def _guard(self) -> RecordGuard:
        return guard_of(self.record)

    def _phone(self, n: int) -> Phone:
        """The phone with what its guard keeps, which on a journal on a server is the login page's alone to read."""
        phone = self.load(n)
        return replace(phone, data={**phone.data, **self._guard().read(phone.n)})

    def _summaries(self) -> list[dict]:
        guard = self._guard()
        return [{**row, **guard.read(row["n"])} for row in self.rows.summaries()]

    def _kept(self, n: int, **fields) -> Phone:
        super().update(n, **self._guard().kept(n, fields))
        return self._phone(n)

    @action
    def complete(self, n: int, how: str = "", **data):
        done = super().complete(n, how, **data)
        self._guard().drop(int(n))
        return done

    def connected(self) -> list[Phone]:
        return [phone for phone in (self._phone(row["n"]) for row in self._summaries() if not row["deleted"]) if phone.connected]

    def stand_in(self, key: str, expires: float) -> Phone:
        return Phone(n=0, title="A phone", data={"environment": self.record.env, "key": key, "expires": expires})

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        self._untouched(data)
        return super().create(title, abstract, brief, **data)

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        self._untouched(data)
        return super().update(n, title, abstract, brief, outcome, **data)

    def _untouched(self, data: dict) -> None:
        if set(data) & set(KEPT):
            raise Refused(f"a phone's {', '.join(sorted(set(data) & set(KEPT)))} are set only by scanning the code in the viewer's Connect your phone dialog")

    @action
    def connect(self, days: int = 7) -> Code:
        if self.actor != USER:
            raise Refused("only the user connects a phone, from the viewer's Connect your phone dialog")
        if int(days) not in DAYS:
            raise Refused(f"a phone stays connected for {', '.join(map(str, DAYS))} days, not {days}")
        address = Shares(self.record, actor=SYSTEM)._address()
        if not address:
            raise Refused("a phone connects through the tunnel address, and this journal has none yet: log tunler in under Settings, Sharing, then connect again")
        active = self._active()
        if active is not None:
            raise Refused(f"{active.title} is connected: stop that session first, one phone at a time")
        for row in self._summaries():
            if not row.get("key") and row.get("code") and not row["completed"] and not row["deleted"]:
                self.complete(row["n"], how="a newer code replaced it")
        code = secrets.token_urlsafe(24)
        short = "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        made = self._kept(super().create("A phone, not yet connected").n, environment=self.record.env, code=hashed(code), short=hashed(short),
                          code_until=time.time() + CODE_SECONDS, days=int(days))
        return Code(n=made.n, link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", code_until=made.code_until, address=address)

    def _pair(self, code: str, device: str) -> tuple[Phone, str] | None:
        now = time.time()
        with self.record.locked(PROJECT):
            given = {hashed(code), hashed(typed(code))}
            found = next((row["n"] for row in self._summaries() if given & {row.get("code"), row.get("short")} - {"", None}
                          and not row["completed"] and not row["deleted"]), None)
            if found is None:
                self._missed()
                return None
            phone = self._phone(found)
            if phone.code_until < now or self._active() is not None:
                return None
            key = secrets.token_urlsafe(32)
            named = titled(" ".join(str(device).split())[:DEVICE_LONGEST] or "A phone")
            paired = self._kept(phone.n, title=named, key=hashed(key), code="", short="", code_until=0, expires=now + phone.days * DAY, last_seen=now)
        self._warn_desk(paired.environment, f"A phone connected, {named}")
        return paired, key

    def _missed(self) -> None:
        for row in self._summaries():
            if not row.get("code") or row["completed"] or row["deleted"]:
                continue
            tries = self._phone(row["n"]).tries + 1
            self._kept(row["n"], tries=tries)
            if tries >= MOST_TRIES:
                self.complete(row["n"], how=f"{MOST_TRIES} wrong codes were tried, so this code no longer works")

    def _active(self) -> Phone | None:
        now = time.time()
        found = next((row["n"] for row in self._summaries() if row.get("key") and row.get("expires", 0) > now and not row["completed"] and not row["deleted"]), None)
        return self._phone(found) if found else None

    def _by_key(self, key: str) -> Phone | None:
        found = next((row["n"] for row in self._summaries() if key and row.get("key") == hashed(key) and not row["deleted"]), None)
        if found is None:
            return None
        phone = self._phone(found)
        if phone.connected and time.time() - phone.last_seen > SEEN_EVERY:
            return self._kept(phone.n, last_seen=time.time())
        return phone

    def _home(self, phone: Phone) -> Record:
        return Record(self.record.root if phone.journal is None else Path(phone.journal), phone.environment, memo=True)

    def _places(self) -> list[Place]:
        return places(self.record.root)

    def _start(self, phone: Phone, starting) -> Phone:
        place_at(self.record.root, starting.journal).start(starting.environment, starting.agent)
        return self._switch(phone, starting)

    def _switch(self, phone: Phone, moving) -> Phone:
        found = next((place for place in self._places() if place.root == moving.journal), None)
        if found is None or moving.environment not in found.environments:
            raise Refused(f"no running journal at {moving.journal!r} with an environment {moving.environment!r} on this machine")
        journal = None if Path(found.root) == self.record.root.resolve() else found.root
        return self._kept(phone.n, journal=journal, environment=moving.environment, picked={**phone.picked, found.root: time.time()})

    def _picked(self, phone: Phone) -> list[Place]:
        return sorted(self._places(), key=lambda place: -phone.picked.get(place.root, 0.0))

    def _arrange(self, phone: Phone, cards: list[str]) -> Phone:
        unknown = [card for card in cards if card not in (*CARDS, WAITING_CARD)]
        if unknown:
            raise Refused(f"no home screen card called {', '.join(unknown)}")
        return self._kept(phone.n, home=list(dict.fromkeys(cards)))

    def _push_key(self) -> str:
        return unpadded(Keys.kept(self.record.root).public)

    def _subscribe(self, phone: Phone, endpoint: str) -> Phone:
        if not allowed(endpoint):
            raise Refused("a phone's notifications come only through Apple's, Google's, Mozilla's or Microsoft's push service")
        return self._kept(phone.n, push=endpoint, pushed=[item["ref"] for item in waiting(self._home(phone), phone)])

    def _notify(self) -> None:
        phone = self._active()
        if phone is None or phone.push is None:
            return
        address = Shares(self.record, actor=SYSTEM)._address()
        if not address:
            return
        owed = [item["ref"] for item in waiting(self._home(phone), phone)]
        if set(owed) - set(phone.pushed):
            send(Keys.kept(self.record.root), phone.push, f"https://{address}")
        if owed != phone.pushed:
            self._kept(phone.n, pushed=owed)

    def _enrolling(self, phone: Phone, relying: Relying) -> Creating:
        if phone.passkey:
            raise Refused("this phone already has its passkey: connect the phone again to make a new one")
        return creating(self._challenged(phone, CREATE, ""), relying, f"phone-{phone.n}".encode(), phone.title)

    def _enrol(self, phone: Phone, relying: Relying, given: Enrolment) -> PendingPasskey:
        """The passkey the phone made, held until the user allows it on the computer within ALLOW_SECONDS."""
        with self.record.locked(PROJECT):
            challenge = self._taken(phone)
            current = self._phone(phone.n)
            if current.passkey:
                raise Refused("this phone already has its passkey: connect the phone again to make a new one")
            if current.waiting_passkey.waits(time.time()):
                raise Refused("Face ID for this phone already waits for Allow on your computer")
            if current.waiting_passkey.passkey:
                self._cleared(current, "the phone asked again")
            passkey = given.passkey(challenge, relying, time.time())
            desk = self._desk(current)
            notice = Notices(desk, actor=SYSTEM).create(
                f"Set up Face ID for phone {current.title}?", tone="warn", action=PASSKEY_NOTICE, phone=current.n,
                brief="The phone asks to run commands after Face ID or its passcode. Allow it only if you asked for this on your phone just now.")
            pending = PendingPasskey(asdict(passkey), desk.env, notice.n, time.time() + ALLOW_SECONDS)
            self._kept(phone.n, pending_passkey=asdict(pending))
        return pending

    @action
    def allow_passkey(self, n: int) -> Phone:
        """Keeps the passkey the phone asked to set up, so it runs commands after Face ID or its passcode."""
        self._require_user()
        with self.record.locked(PROJECT):
            phone = self._phone(int(n))
            pending = self._cleared(phone, "allowed on the computer")
            if not phone.connected or not pending.waits(time.time()):
                raise Refused("the phone's request ran out: ask again from the phone")
            allowed = self._kept(phone.n, passkey=pending.passkey)
        self._warn_desk(pending.environment, f"Face ID was set up for phone {phone.title}")
        return allowed

    @action
    def refuse_passkey(self, n: int) -> Phone:
        """Drops the passkey the phone asked to set up."""
        self._require_user()
        with self.record.locked(PROJECT):
            phone = self._phone(int(n))
            self._cleared(phone, "refused on the computer")
        return self._phone(phone.n)

    def _require_user(self) -> None:
        if self.actor != USER:
            raise Refused("only the user answers a phone's Face ID, with Allow or Refuse in the viewer on the computer")

    def _cleared(self, phone: Phone, how: str) -> PendingPasskey:
        """The passkey the phone asked to set up, cleared with the notice that asks about it."""
        pending = phone.waiting_passkey
        if not pending.passkey:
            raise Refused(f"phone {phone.n} has not asked to set up Face ID")
        self._kept(phone.n, pending_passkey={})
        request(self.record.root, Request(pending.environment, Notices.resource.type, "complete", [pending.notice], {"how": how}))
        return pending

    def _warn_desk(self, environment: str, title: str) -> None:
        brief = "If that was not you, disconnect it from the phone button in the top bar."
        request(self.record.root, Request(environment, Notices.resource.type, "create", [title], {"brief": brief, "tone": "warn"}))

    def _desk(self, phone: Phone) -> Record:
        """The environment on this computer whose chat asks about this phone."""
        return Record(self.record.root, phone.environment if phone.journal is None else self.record.env)

    def _unlocking(self, phone: Phone, relying: Relying, request: str) -> Getting:
        if not phone.passkey:
            raise Unverified.because("this phone has no passkey yet")
        return Passkey.from_json(phone.passkey).asked(self._challenged(phone, GET, request), relying)

    def _unlock(self, phone: Phone, relying: Relying, given: Assertion) -> str:
        """A one-use unlock for the request the challenge named, good for a minute on this phone alone."""
        with self.record.locked(PROJECT):
            challenge = self._taken(phone)
            passkey = given.counted(Passkey.from_json(self._phone(phone.n).passkey), challenge, relying, time.time())
            unlock = secrets.token_urlsafe(32)
            self._kept(phone.n, passkey=asdict(passkey), unlock=asdict(Unlock(hashed(unlock), challenge.request, time.time() + UNLOCK_SECONDS)))
        return unlock

    def _spend(self, phone: Phone, unlock: str, request: str) -> bool:
        """Whether this unlock opens this request; a matching unlock is spent whether or not it does."""
        if not unlock:
            return False
        with self.record.locked(PROJECT):
            kept = Unlock.from_json(self._phone(phone.n).unlock)
            if not kept.fits(hashed(unlock)):
                return False
            self._kept(phone.n, unlock={})
        return kept.opens(request, time.time())

    def _challenged(self, phone: Phone, kind: str, request: str) -> Challenge:
        challenge = Challenge(secrets.token_urlsafe(32), kind, time.time() + CHALLENGE_SECONDS, request)
        self._kept(phone.n, challenge=asdict(challenge))
        return challenge

    def _taken(self, phone: Phone) -> Challenge:
        """The challenge this phone was given, cleared so it answers one attempt only."""
        kept = self._phone(phone.n).challenge
        self._kept(phone.n, challenge={})
        if not kept:
            raise Unverified.because("ask again, the last request has run out")
        return Challenge.from_json(kept)

    def _live(self) -> list[dict]:
        now = time.time()
        guard = self._guard()
        return [row for row in ({**row, **guard.read(row["n"])} for row in self.rows.standing_summaries())
                if ((row.get("key") and row.get("expires", 0) > now) or row.get("code_until", 0) > now)]


def phones_live(root) -> bool:
    return bool(Phones(Record(root, runtime.env(root)), actor=SYSTEM)._live())


def phones_paired(root) -> bool:
    return Phones(Record(root, runtime.env(root)), actor=SYSTEM)._active() is not None


def phones_told(shares) -> None:
    Phones(shares.record, actor=SYSTEM)._notify()


resources_module.register(Phone)
types_module.register(Phones)
