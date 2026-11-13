from collections.abc import Callable

from engine.container.container import Container
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.support.agent_rows import AgentRows

GRACE_SECONDS = 300


class IdleServerExit:
    """Ends the server once no agent session of its project has been alive for the grace time: a session is alive
    while its agent row is open, and the agents module ends a row whose program has gone. The time starts at
    the server's start, so a server a new session's first hook started has the whole grace before its row is
    seen."""

    def __init__(self, clock: Clock, stop: Callable[[str], None]) -> None:
        self.clock, self.stop = clock, stop
        self.alive_at: Timestamp = clock.timestamp()

    def follow(self, container: Container) -> None:
        now = self.clock.timestamp()
        if container.get(AgentRows).running():
            self.alive_at = now
            return
        if self.alive_at.elapsed_seconds(now) >= GRACE_SECONDS:
            self.stop(f"no agent session has been alive for {GRACE_SECONDS} seconds, so the server ends")
