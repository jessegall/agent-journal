from dataclasses import asdict

from controllers.stored import PAGE

from features.kanban.board import build, card_of, main_agent, sources_of
from features.kanban.shifts import shift
from features.parts import Command, Context


class ShowBoard(Command):
    name = "board"

    def run(self, context: Context, todos, plan: int = 0, agent: str = "", lane: str | None = None, after: str | None = None, size: int = PAGE, query: str | None = None, only: int = 0):
        return build(context.journal, context.settings.done_days, plan, agent, lane, after, size, query, only).shaped()


class ShiftCard(Command):
    name = "shift"

    def run(self, context: Context, todos, n: int, lane: str, why: str = "", how: str = ""):
        shift(sources_of(context.journal), todos, todos.load(n), lane, why, how)
        return asdict(card_of(sources_of(context.journal), todos.load(n), main_agent(context.journal)))
