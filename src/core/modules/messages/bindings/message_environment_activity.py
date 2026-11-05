from core.base.scope.scopes import Scopes
from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.messages.queries.message_query import MessageQuery


class MessageEnvironmentActivity(EnvironmentActivity):
    """Counts an environment's messages for shared-folder selection."""

    def __init__(self, messages: MessageQuery, scopes: Scopes) -> None:
        self.messages, self.scopes = messages, scopes

    def count(self, environment_id: int) -> int:
        with self.scopes.opened(None, environment_id):
            return self.messages.count()
