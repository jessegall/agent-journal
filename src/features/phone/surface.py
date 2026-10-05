import math
import tempfile
from pathlib import Path
from typing import TypedDict

from agents.control import pause, permit, resume
from controllers.messages import Messages
from controllers.notices import Notices
from controllers.questions import Questions
from controllers.types import CONTROLLERS, Environments, Nudges
from engine.project_files import read_source
from engine.sessions import Sessions
from features import FEATURES
from features.format import VIEWER, shaped
from features.helpers.controller import Helpers
from features.message_buttons.pressing import press
from features.phone.export import Export, export
from features.phone.feed import Feed, feed, helper, reaches
from features.plans.controller import Plans
from features.plans.resource import READY, WAITING
from features.sharing.controller import Shares
from features.status_bar.bar import current
from features.work_modes.modes import pick
from features.work_tracking.auto import automatic
from resources.base import AGENT, SYSTEM, USER, Refused, titled
from resources.shapes import level_named

CARDS = ("todo", "question", "suggestion", "plan", "report", "doc", "work", "agent")
LISTED = 20
REACTED = ("message", "comment")
HIDDEN = ("phone", "share", "plugin")


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


class Stale(Refused):
    pass


def readable(kind: str) -> bool:
    return kind in CONTROLLERS and kind not in HIDDEN


class PhoneSurface:
    def __init__(self, phones, phone) -> None:
        self.phone = phone
        self.home = phones._home(phone)

    @property
    def via(self) -> str:
        return f"phone:{self.phone.n}"

    def reached(self, ref: str, refusal: str = "a phone opens any row of its environment except phones, shared links and plugins"):
        kind, _, n = ref.partition(":")
        if not readable(kind) or not n.isdigit():
            raise Refused(f"{refusal}, not {ref!r}")
        row = CONTROLLERS[kind](self.home, actor=SYSTEM).load(int(n))
        if row.deleted or not reaches(self.home, self.phone, row):
            raise Refused(f"{kind} {n} is not in this phone's environment")
        return row

    def holder(self, place: str, nothing: str) -> str:
        found = Sessions(self.home.root).holder(place)
        if not found:
            raise Refused(f"No agent is running in {place}, so there is {nothing}")
        return found

    def feed(self, before: float = math.inf) -> Feed:
        return feed(self.home, self.phone, before)

    def helper(self, n: int) -> dict:
        return helper(self.home, self.phone, n)

    def bar(self) -> dict:
        return current(self.home)

    def listing(self, kind: str) -> Listing:
        if kind not in CARDS:
            raise Refused(f"a phone's home screen shows {', '.join(CARDS)}, not {kind!r}")
        rows = CONTROLLERS[kind](self.home, actor=SYSTEM).rows.summaries()
        kept = [row for row in rows if not row["deleted"] and not row["completed"] and row.get("environment") in (self.phone.environment, None, "")]
        newest = sorted(kept, key=lambda row: row["updated"], reverse=True)[:LISTED]
        return Listing(rows=[Listed(ref=f"{kind}:{row['n']}", type=kind, n=row["n"], title=row["title"], updated=row["updated"]) for row in newest],
                       total=len(kept))

    def source(self, asked: str) -> Source:
        found = read_source(self.home.root.parent.resolve(), asked)
        return Source(path=found.path, kind=found.kind, text=found.text, lines=found.lines)

    def read(self, ref: str) -> dict:
        row = self.reached(ref)
        rows = CONTROLLERS[row.type](self.home, actor=USER)
        comments = [{**shaped(made, self.home, VIEWER), "who": made.author or AGENT} for made in rows.comments(row.n)]
        return {**shaped(rows.read(row.n), self.home, VIEWER), "comments": comments, "priority_name": level_named(row.data.get("priority"))}

    def export(self, ref: str) -> Export:
        return export(self.reached(ref), self.home)

    def share(self, ref: str) -> str:
        row = self.reached(ref)
        return Shares(self.home, actor=USER).create(row.ref).abstract

    def file(self, ref: str, name: str) -> Path:
        row = self.reached(ref, "a phone opens files of messages and of the rows it can read")
        folder = CONTROLLERS[row.type](self.home, actor=SYSTEM).folder(row.n).resolve()
        found = (folder / Path(name).name).resolve()
        if name not in row.files or found.parent != folder or not found.is_file():
            raise Refused(f"no file {name!r} on {ref}")
        return found

    def press(self, pressing):
        row = self.reached(pressing.ref, "a phone presses buttons only on the rows it can read")
        return press(self.home, row, pressing.label, USER, self.via)

    def say(self, message):
        text = message.brief.strip()
        if not text:
            raise Refused("a message needs words")
        return Messages(self.home, actor=USER).create(titled(text), brief=text, idempotency=message.idempotency, about=message.about, via=self.via)

    def react(self, reacting):
        if reacting.type not in REACTED:
            raise Refused(f"the phone reacts to {' and '.join(REACTED)}s, not to a {reacting.type}")
        rows = CONTROLLERS[reacting.type](self.home, actor=USER)
        rows.react(reacting.n, reacting.face)
        return rows.load(reacting.n)

    def comment(self, commenting):
        row = self.reached(commenting.ref)
        if not row.takes_comments:
            raise Refused(f"a {row.type} takes no comments")
        if not commenting.text.strip():
            raise Refused("a comment needs words")
        return CONTROLLERS[row.type](self.home, actor=USER).comment(row.n, commenting.text)

    def answer(self, chosen):
        questions = Questions(self.home, actor=USER)
        if questions.load(chosen.n).completed:
            raise Stale(f"question {chosen.n} was already answered")
        if not chosen.answer.strip():
            raise Refused("an answer needs words")
        return questions.complete(chosen.n, how=chosen.answer.strip(), via=self.via)

    def dismiss(self, n: int):
        questions = Questions(self.home, actor=USER)
        if questions.load(n).completed:
            raise Stale(f"question {n} was already answered")
        return questions.dismiss(n)

    def approve(self, approval):
        plans = Plans(self.home, actor=USER)
        return plans.approve(self.unchanged(plans, approval, READY).n)

    def continue_plan(self, approval):
        plans = Plans(self.home, actor=USER)
        return plans.resume(self.unchanged(plans, approval, WAITING).n)

    def unchanged(self, plans, approval, status: str):
        plan = plans.load(approval.n)
        if plan.updated != approval.updated or plan.status != status:
            raise Stale(f"plan {approval.n} changed since you opened it: look at it again")
        return plan

    def close(self, n: int):
        notices = Notices(self.home, actor=USER)
        if notices.load(n).data.get("agent"):
            raise Refused(f"notice {n} belongs to a subagent's chat, not the phone's")
        return notices.complete(n, how="closed on the phone")

    def attach(self, n: int, name: str, data: bytes):
        messages = Messages(self.home, actor=USER)
        message = messages.load(n)
        if message.deleted or message.data.get("via") != self.via:
            raise Refused(f"message {n} was not sent from this phone")
        named = Path(name).name.strip() or "file"
        with tempfile.TemporaryDirectory() as folder:
            kept = Path(folder) / named
            kept.write_bytes(data)
            return messages.attach(message.n, str(kept))

    def auto(self, on: bool) -> bool:
        if automatic(self.home) != on:
            FEATURES["work_tracking"].choose(self.home, "auto", on)
            Nudges(self.home, actor=USER)._to_primary(f"the user turned auto {'on' if on else 'off'}", "journal settings shows every switch")
        return on

    def mode(self, mode: str) -> str:
        return pick(self.home, mode, USER)

    def permit(self, helper: int | None, allow: bool) -> dict:
        place = self.phone.environment if helper is None else Helpers(self.home, actor=USER).load(helper).environment
        return permit(self.home.root, place, self.holder(place, "no permission to answer"), allow)

    def stop_helper(self, n: int) -> None:
        Helpers(self.home, actor=USER).stop(n)

    def pause(self) -> dict:
        return self.control(pause)

    def resume(self) -> dict:
        return self.control(resume)

    def control(self, pressed) -> dict:
        environment = self.phone.environment
        try:
            return pressed(self.home.root, environment, self.holder(environment, "nothing to pause or stop"))
        except Refused as refused:
            raise Refused(f"The agent in {environment} isn't running right now, so there is nothing to pause or resume") from refused

    def stop(self):
        self.holder(self.phone.environment, "nothing to pause or stop")
        environments = Environments(self.home, actor=USER)
        return environments.stop(environments.find(self.phone.environment).n)
