import threading


class AgentLanes:
    """One lock for each agent, so an agent has one command in flight at a time and no agent waits on another's."""

    def __init__(self):
        self.guard = threading.Lock()
        self.locks: dict[str, threading.Lock] = {}

    def of(self, agent: str) -> threading.Lock:
        with self.guard:
            return self.locks.setdefault(agent, threading.Lock())


LANES = AgentLanes()


def agent_of(args: list[str]) -> str:
    """The session a command names with --session, or nothing for a command nobody in a session sent."""
    return next((given for flag, given in zip(args, args[1:]) if flag == "--session"), "")
