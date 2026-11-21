from journal.repositories.agents import Agents
from journal.support.caller import Caller
from journal.repositories.environments import Environments
from journal.support.announced_commands import AnnouncedCommands
from journal.repositories.scope import Scope

SUB_AGENT = "sub-agent"
CODEX = "codex"


class SubagentCommands:
    """Tells a subagent's journal command from its agent's, and which subagent's it is when that is known: the shim says so, a Claude subagent's PreToolUse hook announced it from the agent's session, or a command in the main agent's Codex shell comes from a thread other than the one the session started with; a worker's own thread is its own."""

    def __init__(self, announced: AnnouncedCommands, agents: Agents, environments: Environments, scope: Scope) -> None:
        self.announced, self.agents, self.environments, self.scope = announced, agents, environments, scope

    def subagent_session(self, caller: Caller, argv: list[str], actor: str | None, thread: str | None) -> str | None:
        claimed = self.announced.claim(caller.environment, caller.session, argv)
        if claimed is not None:
            return claimed
        if actor == SUB_AGENT:
            return ""
        return thread if caller.is_main_agent() and self.other_thread(caller.environment, thread) else None

    def other_thread(self, environment: str, thread: str | None) -> bool:
        if not thread:
            return False
        with self.scope.environment(self.environments.lookup(environment).row_id):
            agent = self.agents.current()
        return agent is not None and agent.provider == CODEX and agent.session != thread
