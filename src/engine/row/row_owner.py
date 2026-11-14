from dataclasses import dataclass

MAIN_AGENT = "__main__"


@dataclass(frozen=True)
class RowOwner:
    """The agent and environment that work is scoped on; a user's request has no agent. Every main agent of an
    environment is one agent, named __main__, no matter which session runs it, and its rows store no agent id."""

    agent: int | str | None
    environment_id: int | None

    @property
    def is_main(self) -> bool:
        return self.agent == MAIN_AGENT

    @property
    def stored_agent_id(self) -> int | None:
        return self.agent if isinstance(self.agent, int) else None
