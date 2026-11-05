from dataclasses import dataclass

MAIN_AGENT = "__main__"


@dataclass(frozen=True)
class RowOwner:
    """The agent that work is scoped on and its environment. Every main agent of an environment is one agent,
    named main, whichever session runs it, and a row of the main agent stores no agent id."""

    agent: int | str
    environment_id: int

    @property
    def is_main(self) -> bool:
        return self.agent == MAIN_AGENT

    @property
    def stored_agent_id(self) -> int | None:
        return self.agent if isinstance(self.agent, int) else None
