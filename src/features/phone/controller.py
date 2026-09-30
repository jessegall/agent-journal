import hashlib
import secrets
import time
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.marks import internal
from controllers.messages import Messages
from controllers.notices import Notices
from engine.record import Record
from engine.sessions import Sessions
from features.format import VIEWER
from features.phone.resource import Phone
from features.shaping import shaped
from features.sharing.controller import Shares
from resources.base import PROJECT, SYSTEM, USER, Refused, titled

CODE_SECONDS = 600
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "short", "code_until", "expires", "environment", "days")
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
FEED = 40
SAID = ("message", "question")
READABLE = ("question", "report", "doc", "plan")
WAITING = ("question", "plan", "report", "doc")


class Waiting(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    created: float


class Feed(TypedDict):
    items: list[dict]
    waiting: list[Waiting]
    agent: bool


class Code(TypedDict):
    n: int
    link: str
    short: str
    code_until: float
    address: str


class Stale(Refused):
    pass


def typed(code: str) -> str:
    return "".join(letter for letter in code.upper() if letter in SHORT_LETTERS)


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
        active = self._active()
        if active is not None:
            raise Refused(f"{active.title} is connected: stop that session first, one phone at a time")
        for row in self.summaries():
            if not row.get("key") and row.get("code") and not row["completed"] and not row["deleted"]:
                self.complete(row["n"], how="a newer code replaced it")
        code = secrets.token_urlsafe(24)
        short = "".join(secrets.choice(SHORT_LETTERS) for _ in range(SHORT_LENGTH))
        made = super().create("A phone, not yet connected", environment=self.record.env, code=hashed(code), short=hashed(short),
                              code_until=time.time() + CODE_SECONDS, days=int(days))
        address = Shares(self.record, actor=SYSTEM)._address()
        return Code(n=made.n, link=f"https://{address}/p/#{code}", short=f"{short[:4]}-{short[4:]}", code_until=made.code_until, address=address)

    def _pair(self, code: str, device: str) -> tuple[Phone, str] | None:
        now = time.time()
        with self.record.locked(PROJECT):
            given = {hashed(code), hashed(typed(code))}
            found = next((row["n"] for row in self.summaries() if given & {row.get("code"), row.get("short")} - {"", None}
                          and not row["completed"] and not row["deleted"]), None)
            if found is None:
                return None
            phone = self.load(found)
            if phone.code_until < now or self._active() is not None:
                return None
            key = secrets.token_urlsafe(32)
            named = titled(" ".join(str(device).split())[:DEVICE_LONGEST] or "A phone")
            paired = super().update(phone.n, title=named, key=hashed(key), code="", short="", code_until=0, expires=now + phone.days * 86400, last_seen=now)
        Notices(Record(self.record.root, paired.environment), actor=SYSTEM).create(
            f"A phone connected, {named}", brief="If that was not you, disconnect it from the phone button in the top bar.", tone="warn")
        return paired, key

    def _active(self) -> Phone | None:
        now = time.time()
        found = next((row["n"] for row in self.summaries() if row.get("key") and row.get("expires", 0) > now and not row["completed"] and not row["deleted"]), None)
        return self.load(found) if found else None

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

    def _feed(self, phone: Phone) -> Feed:
        home = self._home(phone)
        said = [self._said(home, kind, row) for kind in SAID for row in self._latest(home, kind)]
        return Feed(items=sorted((item for item in said if item), key=lambda item: item["created"])[-FEED:], waiting=self._waiting(phone),
                    agent=bool(Sessions(self.record.root).holder(phone.environment)))

    def _latest(self, home: Record, kind: str) -> list:
        rows = [row for row in CONTROLLERS[kind](home, actor=SYSTEM).summaries() if not row["deleted"]]
        return [CONTROLLERS[kind](home, actor=SYSTEM).load(row["n"]) for row in rows[-FEED:]]

    def _said(self, home: Record, kind: str, row) -> dict | None:
        if kind == "message" and row.data.get("window"):
            return None
        return {**shaped(row, home, VIEWER), "who": row.seen[0] if kind == "message" and row.seen else "agent"}

    def _waiting(self, phone: Phone) -> list[Waiting]:
        home = self._home(phone)
        found = []
        for kind in WAITING:
            controller = CONTROLLERS[kind](home, actor=SYSTEM)
            for n in [row["n"] for row in controller.summaries() if not row["deleted"] and not row["completed"]]:
                row = controller.load(n)
                if self._reaches(phone, row) and self._owed(row):
                    found.append(Waiting(ref=row.ref, type=kind, n=row.n, title=row.title, created=row.created))
        return found

    def _owed(self, row) -> bool:
        if row.type == "question":
            return True
        if row.type == "plan":
            return row.status == "ready"
        return USER not in row.seen

    def _reaches(self, phone: Phone, row) -> bool:
        return row.data.get("environment") in (phone.environment, None, "")

    def _read(self, phone: Phone, ref: str) -> dict:
        kind, _, n = ref.partition(":")
        if kind not in READABLE or not n.isdigit():
            raise Refused(f"a phone opens a question, a report, a document or a plan, not {ref!r}")
        home = self._home(phone)
        row = CONTROLLERS[kind](home, actor=SYSTEM).load(int(n))
        if row.deleted or not self._reaches(phone, row):
            raise Refused(f"{kind} {n} is not in this phone's environment")
        return shaped(CONTROLLERS[kind](home, actor=USER).read(row.n), home, VIEWER)

    def _answer(self, phone: Phone, chosen):
        questions = CONTROLLERS["question"](self._home(phone), actor=USER)
        if questions.load(chosen.n).completed:
            raise Stale(f"question {chosen.n} was already answered")
        if not chosen.answer.strip():
            raise Refused("an answer needs words")
        return questions.complete(chosen.n, how=chosen.answer.strip(), via=f"phone:{phone.n}")

    def _approve(self, phone: Phone, approval):
        plans = CONTROLLERS["plan"](self._home(phone), actor=USER)
        plan = plans.load(approval.n)
        if plan.updated != approval.updated or plan.status != "ready":
            raise Stale(f"plan {approval.n} changed since you opened it: look at it again")
        return plans.approve(plan.n)

    def _live(self) -> list[dict]:
        now = time.time()
        return [row for row in self.summaries() if not row["completed"] and not row["deleted"]
                and ((row.get("key") and row.get("expires", 0) > now) or row.get("code_until", 0) > now)]


resources_module.register(Phone)
types_module.register(Phones)
