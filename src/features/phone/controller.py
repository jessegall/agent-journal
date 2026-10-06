import hashlib
import secrets
import time
from pathlib import Path
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from controllers.notices import Notices
from controllers.types import Environments
from engine import runtime
from engine.record import Record
from features.phone.feed import waiting
from features.phone.places import MAIN, Place, places
from features.phone.push import Keys, allowed, send, unpadded
from features.phone.resource import Phone
from features.phone.surface import CARDS
from features.sharing.controller import Shares
from features.trigger import DAY
from resources.base import PROJECT, SYSTEM, USER, Refused, Stale, titled

CODE_SECONDS = 600
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "short", "code_until", "expires", "environment", "journal", "days", "push", "pushed", "home", "tries")
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
WAITING_CARD = "waiting"
MOST_TRIES = 10


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

    def connected(self) -> list[Phone]:
        return [phone for phone in (self.load(row["n"]) for row in self.rows.summaries() if not row["deleted"]) if phone.connected]

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
        for row in self.rows.summaries():
            if not row.get("key") and row.get("code") and not row["completed"] and not row["deleted"]:
                self.complete(row["n"], how="a newer code replaced it")
        code = secrets.token_urlsafe(24)
        short = "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        made = super().create("A phone, not yet connected", environment=self.record.env, code=hashed(code), short=hashed(short),
                              code_until=time.time() + CODE_SECONDS, days=int(days))
        return Code(n=made.n, link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", code_until=made.code_until, address=address)

    def _pair(self, code: str, device: str) -> tuple[Phone, str] | None:
        now = time.time()
        with self.record.locked(PROJECT):
            given = {hashed(code), hashed(typed(code))}
            found = next((row["n"] for row in self.rows.summaries() if given & {row.get("code"), row.get("short")} - {"", None}
                          and not row["completed"] and not row["deleted"]), None)
            if found is None:
                self._missed()
                return None
            phone = self.load(found)
            if phone.code_until < now or self._active() is not None:
                return None
            key = secrets.token_urlsafe(32)
            named = titled(" ".join(str(device).split())[:DEVICE_LONGEST] or "A phone")
            paired = super().update(phone.n, title=named, key=hashed(key), code="", short="", code_until=0, expires=now + phone.days * DAY, last_seen=now)
        Notices(Record(self.record.root, paired.environment), actor=SYSTEM).create(
            f"A phone connected, {named}", brief="If that was not you, disconnect it from the phone button in the top bar.", tone="warn")
        return paired, key

    def _missed(self) -> None:
        for row in self.rows.summaries():
            if not row.get("code") or row["completed"] or row["deleted"]:
                continue
            tries = self.load(row["n"]).tries + 1
            super().update(row["n"], tries=tries)
            if tries >= MOST_TRIES:
                self.complete(row["n"], how=f"{MOST_TRIES} wrong codes were tried, so this code no longer works")

    def _active(self) -> Phone | None:
        now = time.time()
        found = next((row["n"] for row in self.rows.summaries() if row.get("key") and row.get("expires", 0) > now and not row["completed"] and not row["deleted"]), None)
        return self.load(found) if found else None

    def _by_key(self, key: str) -> Phone | None:
        found = next((row["n"] for row in self.rows.summaries() if key and row.get("key") == hashed(key) and not row["deleted"]), None)
        if found is None:
            return None
        phone = self.load(found)
        if phone.connected and time.time() - phone.last_seen > SEEN_EVERY:
            return super().update(phone.n, last_seen=time.time())
        return phone

    def _home(self, phone: Phone) -> Record:
        return Record(self.record.root if phone.journal is None else Path(phone.journal), phone.environment, memo=True)

    def _places(self) -> list[Place]:
        return places(self.record.root)

    def _start(self, phone: Phone, starting) -> Phone:
        found = next((place for place in self._places() if place.root == starting.journal), None)
        if found is None or starting.environment not in found.environments:
            raise Refused(f"no journal at {starting.journal!r} with an environment {starting.environment!r} on this machine")
        if starting.environment in found.working:
            raise Stale(f"an agent is already working in {starting.environment}")
        Environments(Record(Path(found.root), MAIN), actor=USER).action("launch")(found.row(starting.environment), agent=starting.agent)
        return self._switch(phone, starting)

    def _switch(self, phone: Phone, moving) -> Phone:
        found = next((place for place in self._places() if place.root == moving.journal), None)
        if found is None or moving.environment not in found.environments:
            raise Refused(f"no running journal at {moving.journal!r} with an environment {moving.environment!r} on this machine")
        journal = None if Path(found.root) == self.record.root.resolve() else found.root
        return super().update(phone.n, journal=journal, environment=moving.environment, picked={**phone.picked, found.root: time.time()})

    def _picked(self, phone: Phone) -> list[Place]:
        return sorted(self._places(), key=lambda place: -phone.picked.get(place.root, 0.0))

    def _arrange(self, phone: Phone, cards: list[str]) -> Phone:
        unknown = [card for card in cards if card not in (*CARDS, WAITING_CARD)]
        if unknown:
            raise Refused(f"no home screen card called {', '.join(unknown)}")
        return super().update(phone.n, home=list(dict.fromkeys(cards)))

    def _push_key(self) -> str:
        return unpadded(Keys.kept(self.record.root).public)

    def _subscribe(self, phone: Phone, endpoint: str) -> Phone:
        if not allowed(endpoint):
            raise Refused("a phone's notifications come only through Apple's, Google's, Mozilla's or Microsoft's push service")
        return super().update(phone.n, push=endpoint, pushed=[item["ref"] for item in waiting(self._home(phone), phone)])

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
            super().update(phone.n, pushed=owed)

    def _live(self) -> list[dict]:
        now = time.time()
        return [row for row in self.rows.summaries() if not row["completed"] and not row["deleted"]
                and ((row.get("key") and row.get("expires", 0) > now) or row.get("code_until", 0) > now)]


def phones_live(root) -> bool:
    return bool(Phones(Record(root, runtime.env(root)), actor=SYSTEM)._live())


def phones_told(shares) -> None:
    Phones(shares.record, actor=SYSTEM)._notify()


resources_module.register(Phone)
types_module.register(Phones)
