from core.base.actor_type import ActorType
from core.base.caller.caller_request import CallerRequest
from core.base.caller.caller_resolver import CallerResolver
from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from server.viewer.viewer_key import ViewerKey
from server.viewer.viewer_login import ViewerLogin


class ViewerKeyRoute:
    """Answers POST /viewer/key on the journal's socket: a one-time login key for the person who asks,
    found the way a command line's caller is found, with the environment of the folder they asked from;
    an agent or a caller who is no person gets none."""

    def __init__(self, home: JournalHome, login: ViewerLogin) -> None:
        self.home, self.login = home, login

    def key(self, request: CallerRequest) -> ViewerKey:
        container = synced_container(self.home)
        try:
            caller = container.get(CallerResolver).caller(request)
            environment = container.get(Queries).query(Environment).find(caller.environment_id).name if caller.environment_id is not None else ""
        finally:
            container.get(Database).close()
        if caller.actor.type is not ActorType.USER:
            raise Refusal("only a person opens the viewer", "run journal viewer yourself, in your own terminal")
        return ViewerKey(self.login.new_key(caller.actor.id), environment)
