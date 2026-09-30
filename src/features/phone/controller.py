import hashlib
from itertools import islice
import mimetypes
import math
import re
from dataclasses import dataclass
import secrets
import tempfile
import time
from pathlib import Path
from typing import TypedDict

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.marks import internal
from controllers.messages import Messages
from controllers.types import Agents, Environments
from controllers.notices import Notices
from engine.record import Record
from engine.sessions import Sessions
from features.format import VIEWER
from features.message_buttons.shaping import Button, spent
from engine.project_files import matching
from features.phone.places import MAIN, Place, places
from features.phone.push import Keys, allowed, send, unpadded
from features.phone.resource import Phone
from features.shaping import shaped
from features.sharing.controller import Shares
from features.status_bar.bar import current
from resources.base import PROJECT, SYSTEM, USER, Refused, titled
from resources.types import BUSY, WORKING

CODE_SECONDS = 600
DAYS = (1, 7, 30)
SEEN_EVERY = 60
DEVICE_LONGEST = 60
KEPT = ("key", "code", "short", "code_until", "expires", "environment", "journal", "days", "push", "pushed", "home", "tries")
SHORT_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SHORT_LENGTH = 8
FEED = 40
SOURCE_LIMIT = 400000
SECRET = re.compile(r"^id_(rsa|dsa|ecdsa|ed25519)|credential|secret|password|token|\.(pem|key|p12|pfx|keystore|jks|kdbx|env)$", re.I)
CARDS = ("todo", "question", "suggestion", "plan", "report", "doc", "work", "agent")
WAITING_CARD = "waiting"
LISTED = 20
MOST_TRIES = 10
OFFLINE, IDLE_STATE, WORKING_STATE = "offline", "idle", "working"
SAID = ("message", "question", "comment")
REPLIED = "message:"
HIDDEN = ("phone", "share", "plugin")
WAITING = ("question", "plan", "report", "doc")


def readable(kind: str) -> bool:
    return kind in CONTROLLERS and kind not in HIDDEN


class Marked(TypedDict):
    type: str
    n: str
    ref: str
    who: str
    created: float
    label: str


class Mark(Marked, total=False):
    name: str
    detail: str
    icon: str
    tone: str
    color: str
    state: str
    command: str


@dataclass(frozen=True)
class Session:
    n: int
    thoughts: list
    cards: list
    subagents: list
    skill_loads: list
    compactions: list
    whispers: list

    @classmethod
    def from_view(cls, view: dict) -> "Session":
        data = view["data"]
        return cls(view["n"], data.get("thoughts") or [], data.get("cards") or [], data.get("subagent_rows") or [], data.get("skill_loads") or [],
                   data.get("compactions") or [], data.get("whispers") or [])

    def mark(self, at: float, label: str, kind: str = "card", **shown: str | None) -> Mark:
        return Mark(type=kind, n=f"{self.n}-{at}", ref=f"{kind}:{self.n}-{at}", who="agent", created=at, label=label,
                    **{key: value for key, value in shown.items() if value is not None})

    def marks(self) -> list[Mark]:
        return [
            *(self.mark(t["at"], t["text"], kind="thought") for t in self.thoughts),
            *(self.mark(c["at"], c["label"], icon=c.get("icon"), name=c.get("name", c.get("plugin")), detail=c.get("detail"), tone=c.get("tone"),
                        color=c.get("color"), state=c.get("state"), command=c.get("command")) for c in self.cards),
            *(self.mark(sub["at"], "Refused a subagent" if sub.get("refusal") else "Dispatched a subagent", icon="agents", name=sub["task"],
                        detail=sub["refusal"] if sub.get("refusal") else sub.get("model"), tone="danger" if sub.get("refusal") else None)
              for sub in self.subagents if "at" in sub),
            *(self.mark(sub["ended"], f"Subagent {sub.get('status', 'finished')}", icon="agents", name=sub["task"], tone="good")
              for sub in self.subagents if sub.get("ended") and not sub.get("refusal")),
            *(self.mark(load["at"], "Loaded skill", icon="book", name=load["skill"], tone="good") for load in self.skill_loads),
            *(self.mark(done["at"], "The agent compacted its context", icon="activity", tone="warn") for done in self.compactions),
            *(self.mark(w["at"], w["title"], icon="reminders") for w in self.whispers),
        ]


class Listed(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    updated: float


class Listing(TypedDict):
    rows: list[Listed]
    total: int


class Source(TypedDict):
    path: str
    kind: str
    text: str
    lines: int


class Waiting(TypedDict):
    ref: str
    type: str
    n: int
    title: str
    created: float


class Feed(TypedDict):
    items: list[dict]
    waiting: list[Waiting]
    agent: str


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
                self._missed()
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

    def _missed(self) -> None:
        for row in self.summaries():
            if not row.get("code") or row["completed"] or row["deleted"]:
                continue
            tries = self.load(row["n"]).tries + 1
            super().update(row["n"], tries=tries)
            if tries >= MOST_TRIES:
                self.complete(row["n"], how=f"{MOST_TRIES} wrong codes were tried, so this code no longer works")

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
        return Record(self.record.root if phone.journal is None else Path(phone.journal), phone.environment)

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
        return super().update(phone.n, journal=journal, environment=moving.environment)

    def _list(self, phone: Phone, kind: str) -> Listing:
        if kind not in CARDS:
            raise Refused(f"a phone's home screen shows {', '.join(CARDS)}, not {kind!r}")
        rows = CONTROLLERS[kind](self._home(phone), actor=SYSTEM).summaries()
        kept = [row for row in rows if not row["deleted"] and not row["completed"] and row.get("environment") in (phone.environment, None, "")]
        newest = sorted(kept, key=lambda row: row["updated"], reverse=True)[:LISTED]
        return Listing(rows=[Listed(ref=f"{kind}:{row['n']}", type=kind, n=row["n"], title=row["title"], updated=row["updated"]) for row in newest],
                       total=len(kept))

    def _arrange(self, phone: Phone, cards: list[str]) -> Phone:
        unknown = [card for card in cards if card not in (*CARDS, WAITING_CARD)]
        if unknown:
            raise Refused(f"no home screen card called {', '.join(unknown)}")
        return super().update(phone.n, home=list(dict.fromkeys(cards)))

    def _source(self, phone: Phone, asked: str) -> Source:
        project = self._home(phone).root.parent.resolve()
        target = (project / asked).resolve()
        if not target.is_file():
            found = matching(project, asked)
            if len(found) != 1:
                raise Refused(f"{len(found)} files in the project are called {asked!r}" if found else f"no file {asked!r} in the project")
            target = (project / found[0]).resolve()
        if project not in target.parents or any(part.startswith(".") for part in target.relative_to(project).parts) or SECRET.search(target.name):
            raise Refused(f"{asked!r} is not a file the phone may read")
        kind = mimetypes.guess_type(target.name)[0] or ""
        text = "" if kind.startswith("image/") else target.read_bytes()[:SOURCE_LIMIT].decode("utf-8", errors="replace")
        return Source(path=str(target.relative_to(project)), kind=kind, text=text, lines=len(text.splitlines()))

    def _push_key(self) -> str:
        return unpadded(Keys.kept(self.record.root).public)

    def _subscribe(self, phone: Phone, endpoint: str) -> Phone:
        if not allowed(endpoint):
            raise Refused("a phone's notifications come only through Apple's, Google's, Mozilla's or Microsoft's push service")
        return super().update(phone.n, push=endpoint, pushed=[waiting["ref"] for waiting in self._waiting(phone)])

    def _notify(self) -> None:
        phone = self._active()
        if phone is None or phone.push is None:
            return
        waiting = [item["ref"] for item in self._waiting(phone)]
        if set(waiting) - set(phone.pushed):
            send(Keys.kept(self.record.root), phone.push, f"https://{Shares(self.record, actor=SYSTEM)._address()}")
        if waiting != phone.pushed:
            super().update(phone.n, pushed=waiting)

    def _press(self, phone: Phone, pressing):
        kind, _, n = pressing.ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"no buttons on {pressing.ref!r}")
        home = self._home(phone)
        rows = CONTROLLERS[kind](home, actor=USER)
        row = rows.load(int(n))
        if row.deleted or not self._reaches(phone, row):
            raise Refused(f"{pressing.ref} is not in this phone's environment")
        buttons = [Button.from_payload(given) for given in row.data.get("buttons") or []]
        pressed = list(row.data.get("pressed") or [])
        button = next((one for one in buttons if one.label == pressing.label and not spent(one, buttons, pressed)), None)
        if button is None:
            raise Stale(f"{pressing.label!r} is no longer on {pressing.ref}")
        if button.say:
            Messages(home, actor=USER).create(titled(button.say), brief=button.say, about=pressing.ref, via=f"phone:{phone.n}")
        elif button.n is None:
            CONTROLLERS[button.type](home, actor=USER).action(button.action)(**(button.body or {}))
        else:
            CONTROLLERS[button.type](home, actor=USER).action(button.action)(button.n, **(button.body or {}))
        return rows.action("set")(row.n, key="pressed", value=list(dict.fromkeys([*pressed, button.label])))

    def _say(self, phone: Phone, said):
        text = said.brief.strip()
        if not text:
            raise Refused("a message needs words")
        return Messages(self._home(phone), actor=USER).create(titled(text), brief=text, idempotency=said.idempotency, about=said.about,
                                                             via=f"phone:{phone.n}")

    def _feed(self, phone: Phone, before: float = math.inf) -> Feed:
        home = self._home(phone)
        said = [self._said(home, kind, row) for kind in SAID for row in self._latest(home, kind, before)]
        items = sorted((item for item in said if item), key=lambda item: item["created"])[-FEED:]
        faces = self._faces(home, {item["ref"] for item in items})
        items = [{**item, "reactions": faces.get(item["ref"], [])} for item in items]
        since = items[0]["created"] if items else before
        marks = [mark for mark in self._marks(home, since) if mark["created"] < before]
        items = sorted([*items, *marks], key=lambda item: item["created"])
        return Feed(items=items, waiting=self._waiting(phone), agent=self._agent(home, phone.environment))

    def _agent(self, home: Record, environment: str) -> str:
        holder = Sessions(home.root).holder(environment)
        if not holder:
            return OFFLINE
        row = Agents(home, actor=SYSTEM)._titled(holder)
        return WORKING_STATE if row is not None and row.data.get("status") in (BUSY, WORKING) else IDLE_STATE

    def _marks(self, home: Record, since: float) -> list[Mark]:
        agents = CONTROLLERS["agent"](home, actor=SYSTEM)
        rows = [shaped(agents.load(row["n"]), home, VIEWER) for row in agents.summaries() if not row["deleted"] and row["updated"] >= since]
        found = [made for row in rows if not row["data"].get("parent") for made in Session.from_view(row).marks()]
        return [made for made in found if made["created"] >= since]

    def _bar(self, phone: Phone) -> dict:
        return current(self._home(phone))

    def _faces(self, home: Record, refs: set[str]) -> dict[str, list[dict]]:
        reactions = CONTROLLERS["reaction"](home, actor=SYSTEM)
        found: dict[str, list[dict]] = {}
        for n in [row["n"] for row in reactions.summaries() if not row["deleted"] and set(row.get("refs", [])) & refs]:
            made = reactions.load(n)
            for ref in set(made.refs) & refs:
                found.setdefault(ref, []).append({"face": made.face, "who": made.seen[0] if made.seen else ""})
        return found

    def _react(self, phone: Phone, reacting):
        messages = Messages(self._home(phone), actor=USER)
        messages.react(reacting.n, reacting.face)
        return messages.load(reacting.n)

    def _latest(self, home: Record, kind: str, before: float) -> list:
        rows = CONTROLLERS[kind](home, actor=SYSTEM)
        loaded = (rows.load(row["n"]) for row in reversed(rows.summaries()) if not row["deleted"])
        return list(islice((row for row in loaded if row.created < before), FEED))[::-1]

    def _said(self, home: Record, kind: str, row) -> dict | None:
        if kind == "message" and row.data.get("window"):
            return None
        if kind == "comment" and not any(ref.startswith(REPLIED) for ref in row.refs):
            return None
        return {**shaped(row, home, VIEWER), "who": row.seen[0] if kind != "question" and row.seen else "agent", "files": dict(row.files)}

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
        buttons = [Button.from_payload(given) for given in row.data.get("buttons") or []]
        pressed = list(row.data.get("pressed") or [])
        return USER not in row.seen or any(not spent(button, buttons, pressed) for button in buttons)

    def _reaches(self, phone: Phone, row) -> bool:
        return row.data.get("environment") in (phone.environment, None, "")

    def _file(self, phone: Phone, ref: str, name: str) -> Path:
        kind, _, n = ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"a phone opens files of messages and of the rows it can read, not {ref!r}")
        controller = CONTROLLERS[kind](self._home(phone), actor=SYSTEM)
        row = controller.load(int(n))
        folder = controller.folder(row.n).resolve()
        found = (folder / Path(name).name).resolve()
        if row.deleted or not self._reaches(phone, row) or name not in row.files or found.parent != folder or not found.is_file():
            raise Refused(f"no file {name!r} on {ref}")
        return found

    def _read(self, phone: Phone, ref: str) -> dict:
        kind, _, n = ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"a phone opens any row of its environment except phones, shared links and plugins, not {ref!r}")
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

    def _attach(self, phone: Phone, n: int, name: str, data: bytes):
        messages = Messages(self._home(phone), actor=USER)
        message = messages.load(n)
        if message.deleted or message.data.get("via") != f"phone:{phone.n}":
            raise Refused(f"message {n} was not sent from this phone")
        named = Path(name).name.strip() or "file"
        with tempfile.TemporaryDirectory() as folder:
            kept = Path(folder) / named
            kept.write_bytes(data)
            return messages.attach(message.n, str(kept))

    def _dismiss(self, phone: Phone, n: int):
        questions = CONTROLLERS["question"](self._home(phone), actor=USER)
        if questions.load(n).completed:
            raise Stale(f"question {n} was already answered")
        return questions.dismiss(n)

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
