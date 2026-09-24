import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from features.message_buttons.shaping import Button, LABEL, one
import json
import time

from features.dumps.resource import ENTRY, ITEM, Dump
from resources.base import AGENT, Refused, titled

TEXT = "text"
LOG_KEPT = 20
OFFERED = 4
OWN_WORDS = -2


class Dumps(Controller):
    resource = Dump

    def create(self, title: str = "", abstract: str = "", brief: str = "", **data):
        with self.record.locked():
            dump = super().create(f"Dump {(self.numbers() or [0])[-1] + 1}", abstract, brief, queued_at=time.time(), **data)
        self._collect(dump, [dump.ref])
        return self.load(dump.n)

    def attach(self, n: int, path: str, description: str = ""):
        if self.load(int(n)).completed:
            self._refuse(f"dump {n} is already filed: start a new dump for more")
        return super().attach(n, path, description)

    def _collections(self):
        return CONTROLLERS["collection"](self.record, actor=self.actor)

    def _collection(self, dump) -> int:
        return next((int(ref.split(":")[1]) for ref in dump.refs if ref.startswith("collection:")), 0)

    def _collect(self, dump, refs: list[str]):
        collections = self._collections()
        found = self._collection(dump)
        collection = collections.load(found) if found else collections.create(dump.title, abstract=f"Everything dump {dump.n} was filed into")
        collections.add(collection.n, refs)
        if not found:
            self.link(dump.n, collection.ref)

    def _controller(self, ref: str, actor: str = ""):
        type_, n = ref.split(":")
        return CONTROLLERS[type_](self.record, actor=actor or self.actor), int(n)

    def _made(self, dump) -> list[str]:
        items = (dump.data.get("items") or {}).values()
        refs = [ref for i in items for ref in i.get(ITEM.refs) or []] + [e.get(ENTRY.on) for e in dump.data.get("log") or [] if e.get(ENTRY.on)]
        return [ref for ref in dict.fromkeys(refs) if not ref.startswith("collection:")]

    def remove(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user removes what a dump filed")
        dump = self.load(int(n))
        if dump.data.get("removed"):
            self._refuse(f"dump {dump.n} was already removed")
        if not dump.completed:
            self.stop(dump.n)
        gone = []
        for ref in self._made(dump):
            try:
                controller, m = self._controller(ref)
                row = controller.load(m)
            except (KeyError, ValueError, Refused):
                continue
            if row.created >= dump.created and not row.deleted:
                controller.delete(m, why=f"removed with dump {dump.n}")
                gone.append(ref)
        found = self._collection(dump)
        if found and not self._collections().load(found).deleted:
            self._collections().delete(found, why=f"removed with dump {dump.n}")
        return self.update(dump.n, removed=time.time(), removed_refs=gone)

    def offer(self, n: int, options: str, summary: str = ""):
        r = self.load(int(n))
        try:
            given = json.loads(options or "[]")
        except ValueError:
            self._refuse("options is a JSON list of {ask, label} or {ask, label, type, n, action}")
        steps = []
        for raw in (o for o in (given[:OFFERED] if isinstance(given, list) else []) if isinstance(o, dict)):
            option, label = Button.from_payload(raw), str(raw.get("label") or "").strip()
            if not label:
                continue
            action = one(self.record, option.to_json()) if option.action else {}
            if option.action and not action:
                self._refuse(f"{label}: {option.type} {option.action} is not a command")
            ask = str(raw.get("ask") or "").strip()
            steps.append({**action, "label": label, **({"ask": ask} if ask else {})})
        if not steps and not summary.strip():
            self._refuse("sum up what you filed with --summary, and offer a next step only where one is worth taking")
        summed = {"summary": summary.strip()} if summary.strip() else {}
        return self.update(r.n, options=steps, chosen={}, taken={}, declined=[], **summed)

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

    def decline(self, n: int, pick: int):
        r = self._choosing(n)
        if not str(pick).isdigit() or int(pick) >= len(r.data.get("options") or []):
            self._refuse(f"dump {r.n} has no option {pick}: pick is the number of an offered step")
        return self.update(r.n, declined=sorted({*(r.data.get("declined") or []), int(pick)}))

    def direct(self, n: int, how: str):
        if not how.strip():
            self._refuse("say what should happen next: journal dump direct <n> \"<what to do>\"")
        r = self._choosing(n)
        said = {"label": how.strip(), "pick": OWN_WORDS, ENTRY.at: time.time()}
        types_module.CONTROLLERS["message"](self.record, actor=self.actor, session=self.session, agent=self.agent).create(
            titled(how), brief=how.strip(), about=r.ref)
        return self.update(r.n, chosen=said, said=[*(r.data.get("said") or []), said][-LOG_KEPT:])

    def _choosing(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user chooses what a dump does next")
        return self.load(int(n))

    def split(self, n: int, parts: str):
        r = self.load(int(n))
        if not r.brief.strip():
            self._refuse(f"dump {r.n} has no pasted text to split")
        found = list(dict.fromkeys(part.strip()[:LABEL] for part in parts.split(",") if part.strip()))
        if not found or set(found) & set(r.files):
            self._refuse("name the parts of the pasted text, comma separated, none named like a dropped file")
        return self.update(r.n, parts=found)

    def name(self, n: int, title: str):
        if not title.strip():
            raise Refused("say the name")
        found = self._collection(self.load(int(n)))
        if not found:
            raise Refused(f"dump {n} has no collection")
        self.update(int(n), title=title.strip())
        return self._collections().update(found, title=title.strip())

    def _names(self, r) -> list[str]:
        return ((r.data.get("parts") or [TEXT]) if r.brief.strip() else []) + sorted(r.files)

    def _item(self, r, item: str) -> dict:
        if item not in self._names(r):
            raise Refused(f"dump {r.n} has no item {item!r}; its items are {', '.join(self._names(r)) or 'none yet'}")
        return dict((r.data.get("items") or {}).get(item) or {})

    def _write(self, n: int, item: str, **values):
        r = self.load(int(n))
        items = {**(r.data.get("items") or {}), item: {**self._item(r, item), **values}}
        written = self.update(r.n, items=items)
        settled = [items.get(name, {}) for name in self._names(written)]
        if not written.completed and settled and all(i.get(ITEM.outcome) or i.get(ITEM.failed) for i in settled):
            failed = sum(bool(i.get(ITEM.failed)) for i in settled)
            return self.complete(r.n, how=f"{len(settled) - failed} filed" + (f", {failed} failed" if failed else ""))
        return written

    def note(self, n: int, item: str, insight: str):
        return self._write(n, item, **{ITEM.insight: insight.strip()})

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
            self._collect(self.load(int(n)), found)
        return self._write(n, item, **{ITEM.outcome: how.strip(), ITEM.refs: found, ITEM.added: own, ITEM.failed: ""})

    def stop(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user stops a dump")
        r = self.load(int(n))
        if r.completed:
            self._refuse(f"dump {r.n} is already closed")
        names = self._names(r)
        items = r.data.get("items") or {}
        filed = sum(1 for name in names if (items.get(name) or {}).get(ITEM.outcome))
        self.update(r.n, stopped=True)
        return self.complete(r.n, how=f"stopped, {filed} filed, {len(names) - filed} left out")

    def failed(self, n: int, item: str, why: str):
        if not why.strip():
            raise Refused("say why it could not be filed")
        return self._write(n, item, **{ITEM.failed: why.strip()})

    def log(self, n: int, status: str, on: str = "", making: str = "", detail: str = ""):
        r = self.load(int(n))
        if not status.strip():
            raise Refused("say what you are doing")
        if len(status.strip()) > LABEL:
            raise Refused(f"a status is a short title of at most {LABEL} characters, like Adding files; the sentence goes in --detail")
        if r.completed and not r.data.get("options") and not r.data.get("chosen"):
            raise Refused(f"dump {r.n} is closed")
        entries = [*(r.data.get("log") or []), {ENTRY.at: time.time(), ENTRY.text: status.strip(), ENTRY.on: on.strip(), ENTRY.making: making.strip(), ENTRY.detail: detail.strip()}]
        return self.update(r.n, log=entries[-LOG_KEPT:])

    def ask(self, n: int, question: str, guesses: str = ""):
        r = self.load(int(n))
        if not question.strip():
            raise Refused("say what you need to know")
        if r.completed:
            raise Refused(f"dump {r.n} is closed")
        found = [g.strip()[:LABEL] for g in guesses.split("|") if g.strip()][:OFFERED]
        return self.update(r.n, question={ENTRY.at: time.time(), ENTRY.text: question.strip(), "guesses": found})

    def answer(self, n: int, text: str):
        if self.actor == AGENT:
            self._refuse("only the user answers a question on a dump")
        r = self.load(int(n))
        asked = r.data.get("question") or {}
        if not asked:
            self._refuse(f"dump {r.n} has no question waiting")
        if not text.strip():
            self._refuse("say the answer")
        answers = [*(r.data.get("answers") or []), {"question": asked.get(ENTRY.text, ""), "answer": text.strip(), ENTRY.at: time.time()}]
        return self.update(r.n, question={}, answers=answers)

    def reopen(self, n: int, why: str):
        super().reopen(n, why)
        return self.update(int(n), queued_at=time.time(), stopped=False)

    def _in_hand(self):
        return min(self._standing(), key=lambda r: (r.data.get("queued_at") or r.created, r.n), default=None)

    def items(self, n: int) -> list[str]:
        r = self.load(int(n))
        return [f"{name}: {standing(self._item(r, name))}" for name in self._names(r)]


def standing(item: dict) -> str:
    if item.get(ITEM.failed):
        return f"failed - {item[ITEM.failed]}"
    if item.get(ITEM.outcome):
        return f"filed - {item[ITEM.outcome]}"
    return f"noted - {item[ITEM.insight]}" if item.get(ITEM.insight) else "not read yet"


resources_module.register(Dump)
types_module.register(Dumps)
