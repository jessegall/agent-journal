import time

from controllers.base import Controller, discarding
from controllers.boards.building import BuildingBoards
from controllers.boards.requests import DraftingBoards, numbers_in
from resources.boards import DONE, MEANINGS, Board
from controllers.boards.running import RunningBoards
from resources.base import FINISHED, PROJECT, RESUMED, Ref, Refused, Resource, SYSTEM
from controllers.marks import action
from declaring.registries import CARD_STORE

STAGES = ("To do", "Doing", "Review", "Done")
BUILD_LOG = 40


def with_meaning(meanings: dict, stage: str, meaning: str) -> dict:
    kept = {name: marked for name, marked in meanings.items() if name != stage}
    if meaning:
        kept[stage] = meaning
    return kept


class Boards(DraftingBoards, BuildingBoards, RunningBoards, Controller):
    resource = Board

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        opening = {} if "stages" in data else {"stages": list(STAGES), "meanings": {STAGES[-1]: DONE}}
        return super().create(title, abstract, brief, **{**opening, **data})

    @discarding
    def save(self, r: Resource, action: str, **event) -> Resource:
        stages = [str(stage) for stage in r.stages]
        if len(set(stages)) != len(stages):
            raise Refused("a board names each stage once")
        unknown = {stage: meaning for stage, meaning in r.meanings.items() if stage not in stages or meaning not in MEANINGS}
        if unknown:
            raise Refused(f"a stage of this board is marked {', '.join(MEANINGS)}; not {unknown}")
        return super().save(r, action, **event)

    @action
    def stage(self, n: int, name: str, meaning: str = ""):
        board = self.load(n)
        return self.update(board.n, stages=[*board.stages, name.strip()], meanings=with_meaning(board.meanings, name.strip(), meaning))

    @action
    def unstage(self, n: int, name: str):
        """Takes a stage off the board with its meaning; refused while a ticket stands on it, so no ticket is left on a stage its board no longer has."""
        board, stage = self.load(n), name.strip()
        if stage not in board.stages:
            raise Refused(f"board {board.n} has no stage {stage}; its stages are {', '.join(board.stages)}")
        tickets = self._cards(SYSTEM)
        standing = [t.n for t in (tickets.load(row.n) for row in tickets.rows.standing()) if t.board == board.n and t.stage == stage]
        if standing:
            raise Refused(f"ticket {', '.join(map(str, standing))} still stands on {stage}: move it to another stage of board {board.n} first")
        return self.update(board.n, stages=[kept for kept in board.stages if kept != stage], meanings=with_meaning(board.meanings, stage, ""))

    @action
    def meaning(self, n: int, stage: str, meaning: str = ""):
        board = self.load(n)
        return self.update(board.n, meanings=with_meaning(board.meanings, stage, meaning))

    def paused(self) -> set[int]:
        return {board.n for board in self.rows.standing() if board.paused}

    def of_message(self, message) -> int:
        return next(iter(Ref.numbers_of(Board.type, message.refs)), 0)

    def finish(self, n: int) -> None:
        self.update(n, finished=time.time())
        self.record.emit("board", n, FINISHED, SYSTEM, scope=PROJECT)

    def unfinish(self, n: int) -> None:
        self.update(n, finished=0)
        self.record.emit("board", n, RESUMED, SYSTEM, scope=PROJECT)

    @action
    def added(self, n: int, tickets: str):
        board = self.peek(n)
        numbers = numbers_in(tickets)
        if not numbers:
            raise Refused("name the tickets that were added, like \"12, 13\"")
        return self.update(board.n, added={"tickets": numbers, "at": time.time()})

    @action
    def log(self, n: int, line: str):
        board = self.load(n)
        entry = {"at": time.time(), "text": line.strip()}
        if board.being_built or not board.drafting_since:
            board = self._being_built(n)
            return self._merged(board, "building", log=[*board.building["log"], entry][-BUILD_LOG:])
        return self._merged(board, "drafting", log=[*(board.drafting.get("log") or []), entry][-BUILD_LOG:])

    def _cards(self, actor: str):
        store = next(iter(CARD_STORE.each()), None)
        if store is None:
            raise Refused("boards keep their cards as tickets, and the tickets feature is not loaded")
        return store(self.record, actor=actor, session=self.session, agent=self.agent)

    def _merged(self, board, field: str, **changes):
        return self.update(board.n, **{field: {**getattr(board, field), **changes}})

    def uncovered(self, board) -> list[str]:
        tickets = self._cards(SYSTEM)
        present = {row.n for row in tickets.rows.summaries() if not row.deleted}
        kept = {int(number) for t in board.added.get("tickets") or [] if int(t) in present for number in tickets.load(t).covers if str(number).isdigit()}
        return [clause for number, clause in enumerate(board.done_when, 1) if number not in kept]
