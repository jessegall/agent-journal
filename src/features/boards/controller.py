import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from controllers.types import Messages, Questions
from features.boards.resource import DONE, MEANINGS, Board
from resources.base import REQUESTED, REVISED, Refused, Resource, titled


STAGES = ("To do", "Doing", "Review", "Done")
START_OVER = "Start over"



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
        return self.update(board.n, drafting={})

    def request(self, n: int, text: str, idempotency: str = ""):
        board = self.load(int(n))
        self.cancel(board.n)
        made = Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).create(
            titled(text), brief=text.strip(), about=board.ref, new_work=True, idempotency=idempotency)
        self.update(board.n, expected=0, drafting={"since": made.created, "idempotency": made.idempotency})
        self.record.emit("message", made.n, REQUESTED, self.actor)
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
        made = Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).create(
            titled(text), brief=text.strip(), about=board.ref, new_work=True, idempotency=idempotency)
        self.record.emit("message", made.n, REVISED, self.actor)
        return made

    def meaning(self, n: int, stage: str, meaning: str = ""):
        board = self.load(int(n))
        return self.update(board.n, meanings=with_meaning(board.meanings, stage, meaning))


resources_module.register(Board)
types_module.register(Boards)
