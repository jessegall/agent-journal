from controllers.types import Agents
from framework.parts import Command, Context
from serving import SERVED, Providers
from resources.base import SYSTEM


class Round(Command):
    name = "round"

    def run(self, context: Context, critiques, what: str, critics: int = 0, lenses: str = "", model: str = "sonnet"):
        caller = Agents(context.record, actor=SYSTEM).rows.by_title(critiques.session) if critiques.session else None
        return critiques.begin(what, SERVED.given(Providers).model_for(caller.provider, model) if caller else model, critics, lenses)
