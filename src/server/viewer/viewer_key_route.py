from engine.database.write_turns import WriteTurns
from engine.enums.actor_type import ActorType
from engine.caller.caller_request import CallerRequest
from engine.caller.caller_resolver import CallerResolver
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.environments.models.environment import Environment
from server.viewer.viewer_key import ViewerKey
from server.enums.session_type import SessionType
from server.viewer.viewer_login import ViewerLogin


class ViewerKeyRoute:
    """Answers POST /viewer/key on the journal's socket: a one-time login key for the user who asks,
    found the way a command line's caller is found, with the environment of the folder they asked from. A
    running main agent gets a key for itself, so it can see the viewer; a helper, a worker or another caller
    who is no user gets none."""

    def __init__(self, home: JournalHome, login: ViewerLogin, turns: WriteTurns | None = None) -> None:
        self.home, self.login, self.turns = home, login, turns

    def key(self, request: CallerRequest) -> ViewerKey:
        container = synced_container(self.home, self.turns)
        try:
            caller = container.get(CallerResolver).caller(request)
            queries = container.get(Queries)
            environment = queries.query(Environment).find(caller.environment_id).name if caller.environment_id is not None else ""
            is_main_agent = caller.actor.type is ActorType.AGENT and MainAgentFinder.is_main(queries, caller.actor.id)
        finally:
            container.get(Database).close()
        if is_main_agent:
            return ViewerKey(self.login.new_key(caller.actor.id, SessionType.AGENT), environment)
        if caller.actor.type is not ActorType.USER:
            raise Refusal("an agent cannot receive a user's viewer credentials")
        return ViewerKey(self.login.new_key(caller.actor.id), environment)
