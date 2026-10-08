from features.parts import Command, Context
from features.status_bar.bar import current


class ShowBar(Command):
    name = "bar"

    def run(self, context: Context, agents):
        return current(agents.record)
