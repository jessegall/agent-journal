from framework.parts import Command, Context
from resources.status_bar import current


class ShowBar(Command):
    name = "bar"

    def run(self, context: Context, agents):
        return current(agents.record)
