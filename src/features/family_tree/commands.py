from features.family_tree.tree import family
from features.parts import Command, Context


class ShowFamily(Command):
    name = "family"

    def run(self, context: Context, agents):
        return family(agents.record)
