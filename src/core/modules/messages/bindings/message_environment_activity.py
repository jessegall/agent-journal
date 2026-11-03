from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.messages.queries.message_query import MessageQuery


class MessageEnvironmentActivity(EnvironmentActivity):
    """Counts an environment's messages for shared-folder selection."""

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def count(self, environment_id: int) -> int:
        return self.messages.filter(environment_id=environment_id).count()
