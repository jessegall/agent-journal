from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.support.announced_commands import AnnouncedCommands
from journal.repositories.scope import Scope

SUB_AGENT = "sub-agent"
CODEX = "codex"
REFUSAL = "a subagent runs no journal command and writes nothing\n"


class SubagentCommands:
    """Tells a subagent's journal command from its agent's: the shim says so, a Claude subagent's PreToolUse hook announced it, or a Codex command comes from a thread other than the one the session started with."""

    def __init__(self, announced: AnnouncedCommands, agents: Agents, environments: Environments, scope: Scope) -> None:
        self.announced, self.agents, self.environments, self.scope = announced, agents, environments, scope

    def runs(self, environment: str, session: str | None, argv: list[str], actor: str | None, thread: str | None) -> bool:
        return actor == SUB_AGENT or self.announced.claim(environment, session, argv) or self.other_thread(environment, thread)

    def other_thread(self, environment: str, thread: str | None) -> bool:
        if not thread:
            return False
        with self.scope.environment(self.environments.lookup(environment).row_id):
            agent = self.agents.current()
        return agent is not None and agent.provider == CODEX and agent.session != thread
