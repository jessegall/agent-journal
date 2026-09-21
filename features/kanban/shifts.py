from dataclasses import dataclass

from features.kanban.lanes import ASKED, DOING, DONE, HELD, LANES, TODO, Sources, lane_of
from resources.base import Refused

WHY, HOW = "why", "how"


@dataclass(frozen=True)
class Shift:
    source: tuple[str, ...]
    target: str
    needs: str = ""

    def refusal(self, sources: Sources, todo) -> str:
        return ""

    def run(self, todos, todo, why: str, how: str):
        raise NotImplementedError


class Block(Shift):
    def run(self, todos, todo, why: str, how: str):
        return todos.block(todo.n, why)


class Unblock(Shift):
    def refusal(self, sources: Sources, todo) -> str:
        waits = sources.todos.waits(todo)
        if waits:
            other = waits[0].split(":")[1]
            return f"todo {todo.n} waits on {waits[0].replace(':', ' ')}: journal todo after {todo.n} {other} --off drops the wait"
        placement = sources.placement(todo)
        if placement and placement.holds:
            return f"plan {placement.n} holds todo {todo.n} until its phase {placement.phase}"
        return ""

    def run(self, todos, todo, why: str, how: str):
        return todos.unblock(todo.n)


class Close(Shift):
    def refusal(self, sources: Sources, todo) -> str:
        waits = sources.todos.waits(todo)
        return f"todo {todo.n} waits on {', '.join(w.replace(':', ' ') for w in waits)}: close that first" if waits else ""

    def run(self, todos, todo, why: str, how: str):
        return todos.complete(todo.n, how or "closed on the board")


class Reopen(Shift):
    def run(self, todos, todo, why: str, how: str):
        return todos.reopen(todo.n, why)


class Start(Shift):
    def run(self, todos, todo, why: str, how: str):
        return todos.start(todo.n)


SHIFTS = (Block((TODO,), HELD, WHY), Unblock((HELD,), TODO), Close((TODO, HELD), DONE), Reopen((DONE,), TODO, WHY), Start((TODO,), DOING))
LANE_KEYS = tuple(lane.key for lane in LANES)


def found(lane: str, target: str) -> Shift | None:
    return next((s for s in SHIFTS if lane in s.source and s.target == target), None)


def refused(sources: Sources, todo, lane: str, target: str) -> str:
    if target not in LANE_KEYS:
        return f"a lane is one of {', '.join(LANE_KEYS)}"
    if lane == DOING:
        work = sources.works[todo.n]
        return f"work {work.n} is open on todo {todo.n}: the agent ends it with journal work end or parks it with journal work park"
    if lane == ASKED:
        return f"question {sources.questions[todo.n]} waits on you: answer it and the card moves by itself"
    if target == ASKED:
        return f"a question puts a card in Needs you: journal question ask \"<question>\" --set about=todo:{todo.n}"
    shift = found(lane, target)
    if not shift:
        return f"todo {todo.n} cannot go from {lane} to {target}"
    if lane == HELD and target == TODO and not todo.blocked and not shift.refusal(sources, todo):
        return f"todo {todo.n} is held by nothing that can be lifted here"
    return shift.refusal(sources, todo)


def targets(sources: Sources, todo) -> list[str]:
    lane = lane_of(sources, todo)
    return [key for key in LANE_KEYS if key != lane and not refused(sources, todo, lane, key)]


def shift(sources: Sources, todos, todo, target: str, why: str = "", how: str = ""):
    lane = lane_of(sources, todo)
    if target == lane:
        return todo
    reason = refused(sources, todo, lane, target)
    if reason:
        raise Refused(reason)
    move = found(lane, target)
    if move.needs == WHY and not why.strip():
        raise Refused(f"moving todo {todo.n} to {target} needs --why \"<why>\"")
    return move.run(todos, todo, why, how)
