import time

from resources.base import COMMISSIONED, Refused
from controllers.marks import action


class BuildingBoards:
    @action
    def build(self, n: int, name: str = "", steer: str = ""):
        board = self.load(n)
        if not board.files:
            raise Refused(f"board {board.n} holds no document to build from; attach one first")
        if name.strip():
            self._retitle(board.n, name)
        self.update(board.n, building={"since": time.time(), "document": next(iter(board.files)), "steer": steer.strip(),
                                      "name_it": not name.strip(), "log": []})
        self.record.emit("board", board.n, COMMISSIONED, self.actor)
        return self.load(board.n)

    @action
    def built(self, n: int, summary: str):
        board = self._being_built(n)
        return self._merged(board, "building", done=time.time(), summary=summary.strip())

    @action
    def keep(self, n: int):
        return self.update(self.load(n).n, building={})

    @action
    def discard(self, n: int, why: str = "The user removed the board built from a document"):
        from features.sequences.controller import Sequences
        board = self.load(n)
        Sequences(self.record, actor=self.actor, session=self.session, agent=self.agent).give_up(board.ref, why=why)
        tickets = self._cards(self.actor)
        for ticket in [t for t in tickets._standing() if int(t.board) == board.n]:
            tickets.delete(ticket.n, why=why)
        return self.delete(board.n, why=why)

    def _being_built(self, n: int):
        board = self.load(n)
        if not board.being_built:
            raise Refused(f"board {board.n} is not being built from a document")
        return board
