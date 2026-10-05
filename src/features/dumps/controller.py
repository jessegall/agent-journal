import json
import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller, controller_of
from controllers.types import Messages
from engine.given import given
from features.collections.controller import Collections
from features.dumps.resource import ENTRY, ITEM, Dump, Offer, entry
from features.message_buttons.shaping import LABEL, one
from resources.base import AGENT, Ref, Refused, titled
from controllers.marks import action

LOG_KEPT = 20
ANSWER = 600
OFFERED = 4
OWN_WORDS = -2


class Dumps(Controller):
    resource = Dump

    @action
    def create(self, title: str = "", abstract: str = "", brief: str = "", **data):
        with self.record.locked():
            dump = super().create(f"Dump {(self.numbers() or [0])[-1] + 1}", abstract, brief, queued_at=time.time(), **data)
        self._collect(dump, [dump.ref])
        return self.load(dump.n)

    @action
    def attach(self, n: int, path: str, description: str = ""):
        if self.load(n).completed:
            self._refuse(f"dump {n} is already filed: start a new dump for more")
        return super().attach(n, path, description)

    def _collections(self):
        return Collections(self.record, actor=self.actor)

    def _collection(self, dump) -> int:
        return next((ref.n for ref in map(Ref.parse, dump.refs) if ref.type == Collections.resource.type), 0)

    def _collect(self, dump, refs: list[str]):
        collections = self._collections()
        found = self._collection(dump)
        collection = collections.load(found) if found else collections.create(dump.title, abstract=f"Everything dump {dump.n} was filed into", source=dump.ref)
        collections.add(collection.n, refs)
        if not found:
            self.link(dump.n, collection.ref)

    def _made(self, dump) -> list[str]:
        items = (dump.data.get("items") or {}).values()
        refs = [ref for i in items for ref in i.get(ITEM.refs) or []] + [e.get(ENTRY.on) for e in dump.data.get("log") or [] if e.get(ENTRY.on)]
        return [ref for ref in dict.fromkeys(refs) if not ref.startswith("collection:")]

    @action
    def remove(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user removes what a dump filed")
        dump = self.load(n)
        if dump.data.get("removed"):
            self._refuse(f"dump {dump.n} was already removed")
        if not dump.completed:
            self.stop(dump.n)
        gone = []
        for ref in self._made(dump):
            try:
                controller = controller_of(self.record, ref, self.actor)
                row = controller.load(Ref.parse(ref).n)
            except Refused:
                continue
            if row.created >= dump.created and not row.deleted:
                controller.delete(row.n, why=f"removed with dump {dump.n}")
                gone.append(ref)
        found = self._collection(dump)
        if found and not self._collections().load(found).deleted:
            self._collections().delete(found, why=f"removed with dump {dump.n}")
        return self.update(dump.n, removed=time.time(), removed_refs=gone)

    @action
    def offer(self, n: int, options: str, summary: str = ""):
        r = self.load(n)
        try:
            offered = json.loads(options or "[]")
        except ValueError:
            self._refuse("options is a JSON list of {ask, label} or {ask, label, type, n, action}")
        steps = []
        for raw in (o for o in (offered[:OFFERED] if isinstance(offered, list) else []) if isinstance(o, dict)):
            option = Offer.from_payload(raw)
            if not option.label:
                continue
            action = one(self.record, option.to_json()) if option.action else {}
            if option.action and not action:
                self._refuse(f"{option.label}: {option.type} {option.action} is not a command")
            steps.append({**action, "label": option.label, **given(ask=option.ask)})
        if not steps and not summary.strip():
            self._refuse("sum up what you filed with --summary, and offer a next step only where one is worth taking")
        return self.update(r.n, options=steps, chosen={}, taken={}, declined=[], **given(summary=summary.strip()))

    @action
    def choose(self, n: int, pick: int):
        r = self._choosing(n)
        options = r.data.get("options") or []
        if not str(pick).lstrip("-").isdigit() or int(pick) >= len(options):
            self._refuse(f"dump {r.n} has no option {pick}: pick is the number of an offered step, or -1 for You decide")
        taken = dict(r.data.get("taken") or {})
        if str(pick) in taken:
            self._refuse(f"{options[int(pick)]['label']} was already taken on dump {r.n}")
        step = options[int(pick)] if int(pick) >= 0 else {"label": "You decide"}
        if step.get("action"):
            controller = CONTROLLERS[step["type"]](self.record, actor=self.actor)
            numbers = [step["n"]] if "n" in step else []
            controller.action(step["action"])(*numbers, **(step.get("body") or {}))
        chosen = {"label": step["label"], "pick": int(pick), ENTRY.at: time.time()}
        if int(pick) >= 0:
            taken[str(pick)] = chosen
        return self.update(r.n, chosen=chosen, taken=taken)

    @action
    def decline(self, n: int, pick: int):
        r = self._choosing(n)
        if not str(pick).isdigit() or int(pick) >= len(r.data.get("options") or []):
            self._refuse(f"dump {r.n} has no option {pick}: pick is the number of an offered step")
        return self.update(r.n, declined=sorted({*(r.data.get("declined") or []), int(pick)}))

    @action
    def direct(self, n: int, how: str):
        if not how.strip():
            self._refuse("say what should happen next: journal dump direct <n> \"<what to do>\"")
        r = self._choosing(n)
        said = {"label": how.strip(), "pick": OWN_WORDS, ENTRY.at: time.time()}
        Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).create(titled(how), brief=how.strip(), about=r.ref, window=r.ref)
        return self._appended(r, "said", said, LOG_KEPT, chosen=said)

    def _choosing(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user chooses what a dump does next")
        return self.load(n)

    @action
    def split(self, n: int, parts: str):
        r = self.load(n)
        if not r.brief.strip():
            self._refuse(f"dump {r.n} has no pasted text to split")
        found = list(dict.fromkeys(part.strip()[:LABEL] for part in parts.split(",") if part.strip()))
        if not found or set(found) & set(r.files):
            self._refuse("name the parts of the pasted text, comma separated, none named like a dropped file")
        return self.update(r.n, parts=found)

    @action
    def dismiss(self, n: int):
        return self.update(int(n), dismissed=True)

    @action
    def name(self, n: int, title: str):
        if not title.strip():
            raise Refused("say the name")
        found = self._collection(self.load(n))
        if not found:
            raise Refused(f"dump {n} has no collection")
        self._retitle(n, title)
        return self._collections().update(found, title=title.strip())

    def _item(self, r, item: str) -> dict:
        if item not in r.item_names:
            raise Refused(f"dump {r.n} has no item {item!r}; its items are {', '.join(r.item_names) or 'none yet'}")
        return dict((r.data.get("items") or {}).get(item) or {})

    def _write(self, n: int, item: str, **values):
        r = self.load(n)
        written = self.update(r.n, items={**(r.data.get("items") or {}), item: {**self._item(r, item), **values}})
        settled = [written.item(name) for name in written.item_names]
        if not written.completed and settled and all(i.settled for i in settled):
            failed = sum(bool(i.failed) for i in settled)
            return self.complete(r.n, how=f"{len(settled) - failed} filed" + (f", {failed} failed" if failed else ""))
        return written

    @action
    def note(self, n: int, item: str, insight: str):
        return self._write(n, item, **{ITEM.insight: insight.strip()})

    @action
    def filed(self, n: int, item: str, how: str, refs: str = "", added: str = ""):
        if not how.strip():
            raise Refused("say what was done with it")
        found = [ref.strip() for ref in refs.split(",") if ref.strip()]
        own = [ref.strip() for ref in added.split(",") if ref.strip()]
        if set(own) - set(found):
            raise Refused("--added names rows you also list in refs")
        for ref in found:
            self.link(int(n), ref)
        if found:
            self._collect(self.load(n), found)
        return self._write(n, item, **{ITEM.outcome: how.strip(), ITEM.refs: found, ITEM.added: own, ITEM.failed: ""})

    @action
    def stop(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user stops a dump")
        r = self.load(n)
        if r.completed:
            self._refuse(f"dump {r.n} is already closed")
        filed = sum(1 for name in r.item_names if r.item(name).outcome)
        self.update(r.n, stopped=True)
        return self.complete(r.n, how=f"stopped, {filed} filed, {len(r.item_names) - filed} left out")

    @action
    def failed(self, n: int, item: str, why: str):
        if not why.strip():
            raise Refused("say why it could not be filed")
        return self._write(n, item, **{ITEM.failed: why.strip()})

    @action
    def log(self, n: int, status: str, on: str = "", making: str = "", detail: str = ""):
        r = self.load(n)
        if not status.strip():
            raise Refused("say what you are doing")
        if len(status.strip()) > LABEL:
            raise Refused(f"a status is a short title of at most {LABEL} characters, like Adding files; the sentence goes in --detail")
        if r.completed and not r.data.get("options") and not r.data.get("chosen"):
            raise Refused(f"dump {r.n} is closed")
        return self._appended(r, "log", entry(status, on, making, detail), LOG_KEPT)

    @action
    def say(self, n: int, text: str):
        r = self.load(n)
        if not text.strip():
            raise Refused("say the answer: journal dump say <n> \"<text>\"")
        if len(text.strip()) > ANSWER:
            raise Refused(f"an answer in the dump is at most {ANSWER} characters; this one is {len(text.strip())}")
        return self._appended(r, "log", entry(text, answer=True), LOG_KEPT)

    @action
    def ask(self, n: int, question: str, guesses: str = ""):
        r = self.load(n)
        if not question.strip():
            raise Refused("say what you need to know")
        if r.completed:
            raise Refused(f"dump {r.n} is closed")
        found = [g.strip()[:LABEL] for g in guesses.split("|") if g.strip()][:OFFERED]
        return self.update(r.n, question={ENTRY.at: time.time(), ENTRY.text: question.strip(), "guesses": found})

    @action
    def answer(self, n: int, text: str):
        if self.actor == AGENT:
            self._refuse("only the user answers a question on a dump")
        r = self.load(n)
        asked = r.data.get("question") or {}
        if not asked:
            self._refuse(f"dump {r.n} has no question waiting")
        if not text.strip():
            self._refuse("say the answer")
        answers = [*(r.data.get("answers") or []), {"question": asked.get(ENTRY.text, ""), "answer": text.strip(), ENTRY.at: time.time()}]
        return self.update(r.n, question={}, answers=answers)

    @action
    def reopen(self, n: int, why: str):
        super().reopen(n, why)
        return self.update(int(n), queued_at=time.time(), stopped=False)

    def _in_hand(self):
        return min(self._standing(), key=lambda r: (r.data.get("queued_at") or r.created, r.n), default=None)

    @action
    def items(self, n: int) -> list[str]:
        r = self.load(n)
        return [f"{name}: {r.item(name).standing}" for name in r.item_names]


resources_module.register(Dump)
types_module.register(Dumps)
