from dataclasses import asdict

from features.kanban.board import build, card_of, sources_of
from features.kanban.shifts import shift
from features.parts import Command, Context


class ShowBoard(Command):
    name = "board"

    def run(self, context: Context, todos, plan: int = 0, agent: str = ""):
        return build(context.journal, context.settings.done_days, plan, agent).shaped()


class ShiftCard(Command):
    name = "shift"

    def run(self, context: Context, todos, n: int, lane: str, why: str = "", how: str = ""):
        shift(sources_of(context.journal), todos, todos.load(int(n)), lane, why, how)
        return asdict(card_of(sources_of(context.journal), todos.load(int(n))))
