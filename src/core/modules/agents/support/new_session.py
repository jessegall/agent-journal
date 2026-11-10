from dataclasses import dataclass

NEW_SESSION_TEXT = "You are a new session of {agent}. Your memories, your open tasks ({tasks}) and your last report ({report}) are carried"
KEPT_CONVERSATION_ENDING = "; the earlier conversation is not."
MISSING_CONVERSATION_ENDING = ". The earlier conversation is unavailable."


@dataclass(frozen=True)
class NewSession:
    """What a new session of an agent is told at its start: the agent's name, the tasks and the report it
    carries from the session before it, and whether that session's conversation is missing."""

    agent: str
    tasks: str
    report: str
    is_conversation_missing: bool

    @property
    def line(self) -> str:
        ending = MISSING_CONVERSATION_ENDING if self.is_conversation_missing else KEPT_CONVERSATION_ENDING
        return NEW_SESSION_TEXT.format(agent=self.agent, tasks=self.tasks, report=self.report) + ending
