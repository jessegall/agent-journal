from journal.repositories.agents import Agents
from journal.support.caller import Caller
from journal.support.caller_kind import CallerKind
from journal.repositories.environments import Environments
from journal.support.announced_commands import AnnouncedCommands
from journal.repositories.scope import Scope
from journal.sync.environment_names import EnvironmentNames

SUB_AGENT = "sub-agent"
CODEX = "codex"


class SubagentCommands:
    """Tells a subagent's journal command from its agent's: the shim says so, a Claude subagent's PreToolUse hook announced it from the agent's session, or a command in the main agent's Codex shell comes from a thread other than the one the session started with; a worker's own thread is its own."""

    def __init__(self, announced: AnnouncedCommands, agents: Agents, environments: Environments, scope: Scope, names: EnvironmentNames) -> None:
        self.names = names
        self.announced, self.agents, self.environments, self.scope = announced, agents, environments, scope

    def runs(self, caller: Caller, argv: list[str], actor: str | None, thread: str | None) -> bool:
        main_thread = caller.kind == CallerKind.MAIN_AGENT and self.other_thread(caller.environment, thread)
        return actor == SUB_AGENT or self.announced.claim(caller.environment, caller.session, argv) or main_thread

    def other_thread(self, environment: str, thread: str | None) -> bool:
        if not thread:
            return False
        with self.scope.environment(self.names.resolved(environment).row_id):
            agent = self.agents.current()
        return agent is not None and agent.provider == CODEX and agent.session != thread
