import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from controllers.types import Messages, Questions
from features.boards.resource import DONE, MEANINGS, Board
from resources.base import COMMISSIONED, REQUESTED, REVISED, Refused, Resource, titled


STAGES = ("To do", "Doing", "Review", "Done")
START_OVER = "Start over"
CANCEL_HOLDS = 600
BUILD_LOG = 40
SECTION_STATES = ("now", "read", "out", "asked")



def with_meaning(meanings: dict, stage: str, meaning: str) -> dict:
    kept = {name: marked for name, marked in meanings.items() if name != stage}
    if meaning:
        kept[stage] = meaning
    return kept

class Boards(Controller):
    resource = Board

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        opening = {} if "stages" in data else {"stages": list(STAGES), "meanings": {STAGES[-1]: DONE}}
        return super().create(title, abstract, brief, **{**opening, **data})

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        stages = [str(stage) for stage in r.stages]
        if len(set(stages)) != len(stages):
            raise Refused("a board names each stage once")
        unknown = {stage: meaning for stage, meaning in r.meanings.items() if stage not in stages or meaning not in MEANINGS}
        if unknown:
            raise Refused(f"a stage of this board is marked {', '.join(MEANINGS)}; not {unknown}")
        return super().save(r, action, **event)

    def stage(self, n: int, name: str, meaning: str = ""):
        board = self.load(int(n))
        return self.update(board.n, stages=[*board.stages, name.strip()], meanings=with_meaning(board.meanings, name.strip(), meaning))

    def ask(self, n: int, question: str, abstract: str = "", **data):
        board = self.load(int(n))
        asking = Questions(self.record, actor=self.actor, session=self.session, agent=self.agent)
        return asking.create(question, abstract, about=board.ref, hidden=True, **data)

    def cancel(self, n: int):
        board = self.load(int(n))
        asking = Questions(self.record, actor=self.actor, session=self.session, agent=self.agent)
        for open_question in asking.about(board.ref):
            if not open_question.completed:
                asking.complete(open_question.n, how=START_OVER, reason="The request on the board was cancelled")
        self._stop_drafting(board)
        return self.update(board.n, drafting={"cancelled": time.time()} if board.drafting.get("since") else {})

    @internal
    def cancelled_lately(self, n: int) -> bool:
        return time.time() - self.load(int(n)).drafting.get("cancelled", 0) < CANCEL_HOLDS

    def _stop_drafting(self, board) -> None:
        from features.sequences.controller import Sequences
        from features.tickets.controller import Tickets
        sequences = Sequences(self.record, actor=self.actor, session=self.session, agent=self.agent)
        for about in board.drafting.get("asked") or []:
            sequences.give_up(about, why="The request on the board was cancelled")
        tickets = Tickets(self.record, actor=self.actor, session=self.session, agent=self.agent)
        since = board.drafting.get("since")
        for left in [t for t in tickets._standing() if since and t.draft and int(t.board) == board.n and t.created >= since]:
            tickets.delete(left.n, why="The request on the board was cancelled")

    def request(self, n: int, text: str, idempotency: str = ""):
        return self._opened(self.load(int(n)), REQUESTED, text, idempotency)

    def hand(self, n: int, document: str, text: str = "", idempotency: str = ""):
        board = self.load(int(n))
        if document not in board.files:
            raise Refused(f"board {board.n} holds no file {document!r}; attach it first")
        return self._opened(board, COMMISSIONED, text.strip() or f"Draft tickets from {document}", idempotency, document=document)

    def outline(self, n: int, sections: str):
        board = self._drafting(n)
        titles = [title.strip() for title in sections.split("|") if title.strip()]
        if not titles:
            raise Refused("name the document's sections in order, split by |, like Background|Who can invite|Roles")
        return self.update(board.n, drafting={**board.drafting, "outline": [{"title": title, "state": "", "drafts": 0} for title in titles]})

    def progress(self, n: int, section: str, state: str, drafts: str = ""):
        board = self._drafting(n)
        if state not in SECTION_STATES:
            raise Refused(f"a section is marked {', '.join(SECTION_STATES)}; not {state!r}")
        outline = board.drafting.get("outline") or []
        if section not in [part["title"] for part in outline]:
            raise Refused(f"the outline has no section {section!r}; it has {', '.join(part['title'] for part in outline)}")
        marked = [{**part, "state": state, "drafts": int(drafts or part["drafts"])} if part["title"] == section else part for part in outline]
        return self.update(board.n, drafting={**board.drafting, "outline": marked})

    def group(self, n: int, name: str, tickets: str):
        board = self._drafting(n)
        groups = {**(board.drafting.get("groups") or {}), name.strip(): self._drafted(board, tickets)}
        return self.update(board.n, drafting={**board.drafting, "groups": groups})

    def pick(self, n: int, tickets: str):
        board = self._drafting(n)
        return self.update(board.n, drafting={**board.drafting, "picks": {"tickets": self._drafted(board, tickets), "at": time.time()}})

    def _drafted(self, board, tickets: str) -> list[int]:
        from features.tickets.controller import Tickets
        numbers = [int(t.lstrip("#")) for t in tickets.replace(",", " ").split() if t.lstrip("#").isdigit()]
        drafts = {t.n for t in Tickets(self.record, actor=self.actor)._standing() if t.draft and int(t.board) == board.n}
        stray = [n for n in numbers if n not in drafts]
        if not numbers or stray:
            raise Refused(f"name drafts on board {board.n}, like \"12, 13\"; not {stray or tickets!r}")
        return numbers

    def say(self, n: int, line: str):
        board = self._drafting(n)
        asked = board.drafting.get("asked") or []
        if not asked:
            raise Refused(f"nothing was asked on board {board.n} to answer")
        return Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).comment(int(asked[-1].split(":")[1]), line.strip())

    def _drafting(self, n: int):
        board = self.load(int(n))
        if not board.drafting.get("since"):
            raise Refused(f"nothing is being drafted on board {board.n}")
        return board

    def _opened(self, board, moment: str, text: str, idempotency: str, **data):
        self.cancel(board.n)
        made = self._filed(board, text, idempotency, **data)
        self.update(board.n, expected=0, drafting={"since": made.created, "idempotency": made.idempotency, "asked": [made.ref]})
        self.record.emit("message", made.n, moment, self.actor)
        return made

    def expect(self, n: int, count: str):
        if not str(count).isdigit():
            raise Refused(f"the count is how many tickets you will draft, a whole number like 3; not {count!r}")
        shown = self.load(int(n)).expected
        if int(count) < shown:
            raise Refused(f"{shown} placeholders already show; the count only grows, so draft them or leave it at {shown}")
        return self.update(int(n), expected=int(count))

    def revise(self, n: int, text: str, idempotency: str = ""):
        board = self.load(int(n))
        made = self.follow_up(board.n, text, idempotency)
        self.record.emit("message", made.n, REVISED, self.actor)
        return made

    def follow_up(self, n: int, text: str, idempotency: str = ""):
        board = self.load(int(n))
        made = self._filed(board, text, idempotency)
        if board.drafting.get("since"):
            self.update(board.n, drafting={**board.drafting, "asked": [*(board.drafting.get("asked") or []), made.ref]})
        return made

    def _filed(self, board, text: str, idempotency: str, **data):
        return Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).create(
            titled(text), brief=text.strip(), about=board.ref, new_work=True, idempotency=idempotency, **data)

    def build(self, n: int, name: str = "", steer: str = ""):
        board = self.load(int(n))
        if not board.files:
            raise Refused(f"board {board.n} holds no document to build from; attach one first")
        if name.strip():
            self.update(board.n, title=name.strip())
        self.update(board.n, building={"since": time.time(), "document": next(iter(board.files)), "steer": steer.strip(),
                                       "name_it": not name.strip(), "log": []})
        self.record.emit("board", board.n, COMMISSIONED, self.actor)
        return self.load(board.n)

    def log(self, n: int, line: str):
        board = self._being_built(n)
        entry = {"at": time.time(), "text": line.strip()}
        return self.update(board.n, building={**board.building, "log": [*board.building["log"], entry][-BUILD_LOG:]})

    def built(self, n: int, summary: str):
        board = self._being_built(n)
        return self.update(board.n, building={**board.building, "done": time.time(), "summary": summary.strip()})

    def keep(self, n: int):
        return self.update(self.load(int(n)).n, building={})

    def discard(self, n: int, why: str = "The user removed the board built from a document"):
        from features.sequences.controller import Sequences
        from features.tickets.controller import Tickets
        board = self.load(int(n))
        Sequences(self.record, actor=self.actor, session=self.session, agent=self.agent).give_up(board.ref, why=why)
        tickets = Tickets(self.record, actor=self.actor, session=self.session, agent=self.agent)
        for ticket in [t for t in tickets._standing() if int(t.board) == board.n]:
            tickets.delete(ticket.n, why=why)
        return self.delete(board.n, why=why)

    def _being_built(self, n: int):
        board = self.load(int(n))
        if not board.building.get("since") or board.building.get("done"):
            raise Refused(f"board {board.n} is not being built from a document")
        return board

    def meaning(self, n: int, stage: str, meaning: str = ""):
        board = self.load(int(n))
        return self.update(board.n, meanings=with_meaning(board.meanings, stage, meaning))


resources_module.register(Board)
types_module.register(Boards)
