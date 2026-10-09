from agents.control import permit
from controllers.types import Environments
from engine.record import Record
from engine.sessions import Sessions
from features.parts import Command, Context
from features.permission_prompts.routing import orchestrator_of
from resources.base import Refused, SYSTEM

DECISIONS = {"allow": True, "deny": False}


class AnswerPermission(Command):
    name = "permit"

    def run(self, context: Context, agents, env: str, decision: str):
        if decision not in DECISIONS:
            raise Refused("answer allow or deny: journal agent permit <environment> allow")
        place = Environments(agents.record, actor=SYSTEM).rows.by_title(env)
        asking = Record(agents.record.root, env)
        if not place or place.launched_from != agents.record.env or orchestrator_of(asking) is None:
            raise Refused(f"the permissions of {env} are not yours to answer: only the orchestrating agent of the environment that launched it answers them")
        session = Sessions(agents.record.root).holder(env)
        if not session:
            raise Refused(f"no agent is running in {env}")
        return permit(agents.record.root, env, session, DECISIONS[decision])
