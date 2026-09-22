import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from controllers.stored import DRAFT_OF
from features.message_buttons.shaping import LABEL, one
import json
import time

from features.dumps.resource import ENTRY, ITEM, Dump
from resources.base import AGENT, Refused

TEXT = "text"
LOG_KEPT = 20
OFFERED = 4


class Dumps(Controller):
    resource = Dump

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        dump = super().create(title, abstract, brief, queued_at=time.time(), **data)
        self._collect(dump, [dump.ref])
        return self.load(dump.n)

    def _collections(self):
        return CONTROLLERS["collection"](self.record, actor=self.actor)

    def _collection(self, dump) -> int:
        return next((int(ref.split(":")[1]) for ref in dump.refs if ref.startswith("collection:")), 0)

    def _collect(self, dump, refs: list[str]):
        collections = self._collections()
        found = self._collection(dump)
        collection = collections.load(found) if found else collections.create(f"Dump {dump.n}, {dump.title}"[:80], abstract=f"Everything dump {dump.n} was filed into",
                                                                              **{DRAFT_OF: dump.ref})
        collections.add(collection.n, refs)
        if not found:
            self.link(dump.n, collection.ref)

    def _controller(self, ref: str):
        type_, n = ref.split(":")
        return CONTROLLERS[type_](self.record, actor=self.actor), int(n)

    def _hold(self, dump, refs: list[str]) -> None:
        for ref in refs:
            try:
                controller, n = self._controller(ref)
                row = controller.load(n)
            except (KeyError, ValueError, Refused):
                continue
            if row.created >= dump.created and not row.data.get(DRAFT_OF) and not dump.data.get("confirmed"):
                controller.update(n, **{DRAFT_OF: dump.ref})

    def _made(self, dump) -> list[str]:
        items = (dump.data.get("items") or {}).values()
        refs = [ref for i in items for ref in i.get(ITEM.refs) or []] + [e.get(ENTRY.on) for e in dump.data.get("log") or [] if e.get(ENTRY.on)]
        found = self._collection(dump)
        return list(dict.fromkeys(refs + ([f"collection:{found}"] if found else [])))

    def confirm(self, n: int):
        if self.actor == AGENT:
            self._refuse("only the user confirms a dump: they do it in the dump window")
        dump = self.load(int(n))
        if not dump.completed:
            self._refuse(f"dump {dump.n} is still being filed")
        left = dump.data.get("left_out") or {}
        for ref in left:
            try:
                controller, m, _ = self._drafted(dump, ref)
                controller.delete(m, why=f"left out of dump {dump.n}")
            except (KeyError, ValueError, Refused):
                continue
        for ref in self._made(dump):
            if ref in left:
                continue
            controller, m = self._controller(ref)
            try:
                if controller.load(m).data.get(DRAFT_OF) == dump.ref:
                    controller.update(m, **{DRAFT_OF: ""})
            except Refused:
                continue
        return self.update(dump.n, confirmed=time.time())

    def _drafted(self, dump, ref: str):
        controller, m = self._controller(ref)
        row = controller.load(m)
        if row.data.get(DRAFT_OF) != dump.ref:
            self._refuse(f"{ref} is not waiting in dump {dump.n}")
        return controller, m, row

    def offer(self, n: int, options: str):
        r = self.load(int(n))
        try:
            given = json.loads(options)
        except ValueError:
            self._refuse("options is a JSON list of {label} or {label, type, n, action}")
        steps = []
        for option in given[:OFFERED] if isinstance(given, list) else []:
            label = str((option or {}).get("label") or "").strip()[:LABEL] if isinstance(option, dict) else ""
            if not label:
                continue
            action = one(self.record, option) if option.get("action") else {}
            if option.get("action") and not action:
                self._refuse(f"{label}: {option.get('type')} {option.get('action')} is not a command")
            steps.append(action or {"label": label})
        if not steps:
            self._refuse("offer at least one next step with a label")
        return self.update(r.n, options=steps, chosen={})

    def choose(self, n: int, pick: int):
        if self.actor == AGENT:
            self._refuse("only the user chooses what a dump does next")
        r = self.load(int(n))
        options = r.data.get("options") or []
        if not str(pick).lstrip("-").isdigit() or int(pick) >= len(options):
            self._refuse(f"dump {r.n} has no option {pick}: pick is the number of an offered step, or -1 for You decide")
        if r.completed and not r.data.get("confirmed"):
            self.confirm(r.n)
        step = options[int(pick)] if int(pick) >= 0 else {"label": "You decide"}
        if step.get("action"):
            controller = CONTROLLERS[step["type"]](self.record, actor=self.actor)
            controller.action(step["action"])(*([step["n"]] if "n" in step else []), **(step.get("body") or {}))
        return self.update(r.n, chosen={"label": step["label"], "pick": int(pick), ENTRY.at: time.time()})

    def leave(self, n: int, ref: str):
        dump = self.load(int(n))
        _, _, row = self._drafted(dump, ref)
        return self.update(dump.n, left_out={**(dump.data.get("left_out") or {}), ref: row.title})

    def keep(self, n: int, ref: str):
        dump = self.load(int(n))
        left = dict(dump.data.get("left_out") or {})
        if left.pop(ref, None) is None:
            self._refuse(f"{ref} was not left out of dump {dump.n}")
        return self.update(dump.n, left_out=left)

    def split(self, n: int, parts: str):
        r = self.load(int(n))
        if not r.brief.strip():
            self._refuse(f"dump {r.n} has no pasted text to split")
        found = list(dict.fromkeys(part.strip()[:LABEL] for part in parts.split(",") if part.strip()))
        if not found or set(found) & set(r.files):
            self._refuse("name the parts of the pasted text, comma separated, none named like a dropped file")
        return self.update(r.n, parts=found)

    def name(self, n: int, title: str):
        found = self._collection(self.load(int(n)))
        if not found:
            raise Refused(f"dump {n} has no collection")
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

    def filed(self, n: int, item: str, how: str, refs: str = ""):
        if not how.strip():
            raise Refused("say what was done with it")
        found = [ref.strip() for ref in refs.split(",") if ref.strip()]
        self._hold(self.load(int(n)), found)
        for ref in found:
            self.link(int(n), ref)
        if found:
            self._collect(self.load(int(n)), found)
        return self._write(n, item, **{ITEM.outcome: how.strip(), ITEM.refs: found, ITEM.failed: ""})

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
        if r.completed:
            raise Refused(f"dump {r.n} is closed")
        if on.strip():
            self._hold(r, [on.strip()])
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
        return self.update(int(n), queued_at=time.time(), stopped=False, confirmed=0)

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
