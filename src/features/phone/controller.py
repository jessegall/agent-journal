import hashlib
import secrets
import time
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import internal
from controllers.messages import Messages
from controllers.notices import Notices
from engine.record import Record
from features.phone.resource import Phone
from features.sharing.controller import Shares
from resources.base import PROJECT, SYSTEM, USER, Refused, titled

CODE_SECONDS = 600
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "code_until", "expires", "environment", "days")


class Code(TypedDict):
    n: int
    link: str
    code_until: float
    address: str


def hashed(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


class Phones(Controller):
    resource = Phone

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        self._untouched(data)
        return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        self._untouched(data)
        return super().update(n, title, abstract, brief, outcome, **data)

    def _untouched(self, data: dict) -> None:
        if set(data) & set(KEPT):
            raise Refused(f"a phone's {', '.join(sorted(set(data) & set(KEPT)))} are set only by scanning the code in the viewer's Connect your phone dialog")

    @internal
    def connect(self, days: int = 7) -> Code:
        if self.actor != USER:
            raise Refused("only the user connects a phone, from the viewer's Connect your phone dialog")
        if int(days) not in DAYS:
            raise Refused(f"a phone stays connected for {', '.join(map(str, DAYS))} days, not {days}")
        code = secrets.token_urlsafe(24)
        made = super().create("A phone, not yet connected", environment=self.record.env, code=hashed(code), code_until=time.time() + CODE_SECONDS,
                              days=int(days))
        address = Shares(self.record, actor=SYSTEM)._address()
        return Code(n=made.n, link=f"https://{address}/p/#{code}", code_until=made.code_until, address=address)

    def _pair(self, code: str, device: str) -> tuple[Phone, str] | None:
        now = time.time()
        with self.record.locked(PROJECT):
            found = next((row["n"] for row in self.summaries() if row.get("code") == hashed(code) and not row["completed"] and not row["deleted"]), None)
            if found is None:
                return None
            phone = self.load(found)
            if phone.code_until < now:
                return None
            key = secrets.token_urlsafe(32)
            named = titled(" ".join(str(device).split())[:DEVICE_LONGEST] or "A phone")
            paired = super().update(phone.n, title=named, key=hashed(key), code="", code_until=0, expires=now + phone.days * 86400, last_seen=now)
        Notices(Record(self.record.root, paired.environment), actor=SYSTEM).create(
            f"A phone connected, {named}", brief="If that was not you, disconnect it from the phone button in the top bar.", tone="warn")
        return paired, key

    def _by_key(self, key: str) -> Phone | None:
        found = next((row["n"] for row in self.summaries() if key and row.get("key") == hashed(key) and not row["deleted"]), None)
        if found is None:
            return None
        phone = self.load(found)
        if phone.connected and time.time() - phone.last_seen > SEEN_EVERY:
            return super().update(phone.n, last_seen=time.time())
        return phone

    def _home(self, phone: Phone) -> Record:
        return Record(self.record.root, phone.environment)

    def _say(self, phone: Phone, said):
        text = said.brief.strip()
        if not text:
            raise Refused("a message needs words")
        return Messages(self._home(phone), actor=USER).create(titled(text), brief=text, idempotency=said.idempotency, about=said.about,
                                                             via=f"phone:{phone.n}")

    def _live(self) -> list[dict]:
        now = time.time()
        return [row for row in self.summaries() if not row["completed"] and not row["deleted"]
                and ((row.get("key") and row.get("expires", 0) > now) or row.get("code_until", 0) > now)]


resources_module.register(Phone)
types_module.register(Phones)
