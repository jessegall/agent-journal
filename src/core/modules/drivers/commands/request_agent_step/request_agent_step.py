from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RequestAgentStep(Command[None]):
    """Writes or joins each agent's one open step request with a cause, so a step decides again within one
    round (doc 1310 section 6.2). It locks, since it joins a request it read while a hook may serve that request."""

    lock = True

    agent_ids: tuple[int, ...]
    cause: str
