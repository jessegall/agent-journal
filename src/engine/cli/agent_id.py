from typing import Self

AGENT_MODEL_NAME = "agent"
HIGHEST_AGENT_ID = 10 ** 19 - 1


class AgentId(int):
    """An agent as written on a command line: its id, a whole number from 1 up to 19 digits, the same id the
    viewer shows."""

    def __new__(cls, text: str | int) -> Self:
        if isinstance(text, str) and not text.isdigit():
            raise ValueError(f"{text} is no agent id")
        agent_id = super().__new__(cls, text)
        if not 1 <= agent_id <= HIGHEST_AGENT_ID:
            raise ValueError(f"{text} is no agent id")
        return agent_id


def row_argument_type(holds_agents: bool) -> type[int]:
    return AgentId if holds_agents else int
