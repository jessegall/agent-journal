from core.modules.agents.models.agent import Agent


class ManagedFiles:
    """Says whether a file an agent changed is one the journal itself writes, so it is not the agent's edit;
    the suite knows of none, and a module that writes such files binds its own answer."""

    def has(self, agent: Agent, path: str) -> bool:
        return False
