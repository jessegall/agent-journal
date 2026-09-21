from features.kanban.board import build
from features.parts import Command, Context


class ShowBoard(Command):
    name = "board"

    def run(self, context: Context, todos, plan: int = 0, agent: str = ""):
        return build(context.journal, context.settings.done_days, plan, agent).shaped()
