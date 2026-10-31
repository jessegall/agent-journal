from core.base.actor import Actor
from core.base.caller.caller_request import CallerRequest
from core.base.caller.caller import Caller


class CallerResolver:
    """Works out who runs a command line and where from what the run knows of its caller; with no module to name
    callers, every line runs as the core."""

    def caller(self, request: CallerRequest) -> Caller:
        return Caller(Actor.core())
