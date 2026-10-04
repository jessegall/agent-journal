import time

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from features.boards.building import BuildingBoards
from features.boards.requests import DraftingBoards, numbers_in
from features.boards.resource import DONE, MEANINGS, Board
from features.boards.running import RunningBoards
from resources.base import FINISHED, Ref, Refused, Resource, SYSTEM

STAGES = ("To do", "Doing", "Review", "Done")
BUILD_LOG = 40


def with_meaning(meanings: dict, stage: str, meaning: str) -> dict:
    kept = {name: marked for name, marked in meanings.items() if name != stage}
    if meaning:
        kept[stage] = meaning
    return kept


class Boards(DraftingBoards, BuildingBoards, RunningBoards, Controller):
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
        board = self.load(n)
        return self.update(board.n, stages=[*board.stages, name.strip()], meanings=with_meaning(board.meanings, name.strip(), meaning))

    def meaning(self, n: int, stage: str, meaning: str = ""):
        board = self.load(n)
        return self.update(board.n, meanings=with_meaning(board.meanings, stage, meaning))

    @internal
    def paused(self) -> set[int]:
        return {board.n for board in self._standing() if board.paused}

    @internal
    def of_message(self, message) -> int:
        return next((ref.n for ref in map(Ref.parse, message.refs) if ref.type == Board.type), 0)

    @internal
    def finish(self, n: int) -> None:
        self.update(n, finished=time.time())
        self.record.emit("board", n, FINISHED, SYSTEM)

    def added(self, n: int, tickets: str):
        board = self.load(n)
        numbers = numbers_in(tickets)
        if not numbers:
            raise Refused("name the tickets that were added, like \"12, 13\"")
        return self.update(board.n, added={"tickets": numbers, "at": time.time()})

    def log(self, n: int, line: str):
        board = self.load(n)
        entry = {"at": time.time(), "text": line.strip()}
        if board.being_built or not board.drafting_since:
            board = self._being_built(n)
            return self._merged(board, "building", log=[*board.building["log"], entry][-BUILD_LOG:])
        return self._merged(board, "drafting", log=[*(board.drafting.get("log") or []), entry][-BUILD_LOG:])

    def _cards(self, actor: str):
        from features.tickets.controller import Tickets
        return Tickets(self.record, actor=actor, session=self.session, agent=self.agent)

    def _merged(self, board, field: str, **changes):
        return self.update(board.n, **{field: {**getattr(board, field), **changes}})

    def _uncovered(self, board) -> list[str]:
        tickets = self._cards(SYSTEM)
        present = {row["n"] for row in tickets.summaries() if not row["deleted"]}
        kept = {int(number) for t in board.added.get("tickets") or [] if int(t) in present for number in tickets.load(t).covers if str(number).isdigit()}
        return [clause for number, clause in enumerate(board.done_when, 1) if number not in kept]


resources_module.register(Board)
types_module.register(Boards)
