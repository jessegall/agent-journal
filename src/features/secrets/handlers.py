import time

from engine.events.engine import ClockTicked
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from features.secrets.controller import Secrets
from resources.base import SYSTEM

PURGE_EVERY = 3600


class PurgeDeletedSecrets(Handler):
    behaviour = WHOLE_FEATURE
    purged: dict[str, float] = {}

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        place = str(context.record.root)
        if time.time() - self.purged.get(place, 0.0) < PURGE_EVERY:
            return
        self.purged[place] = time.time()
        Secrets(context.record, actor=SYSTEM)._purge()
