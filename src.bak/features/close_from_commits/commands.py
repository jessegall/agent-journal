from controllers.types import Todos, Works
from features.close_from_commits.trailers import closing, commits_of, landing_args
from framework.parts import Command, Context
from resources.base import SYSTEM, Refused
from serving import Git


class SweepLanded(Command):
    name = "sweep"

    def run(self, context: Context, todos: Todos):
        git = context.service(Git)
        checkout = git.checkout(context.record.root.resolve().parent)
        if not checkout or not checkout.landing:
            raise Refused("this project has no main branch from a remote to read trailers from")
        todos, works, closed = Todos(context.record, actor=SYSTEM), Works(context.record, actor=SYSTEM), []
        for commit in commits_of(git.run(checkout.top, *landing_args(checkout.landing))):
            closed += closing(todos, works, commit)[0]
        return f"closed {', '.join(closed)}" if closed else "no open to-do has its trailer on main"
