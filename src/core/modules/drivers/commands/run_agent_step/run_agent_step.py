from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RunAgentStep(Command[None]):
    """Steps the agent of one open step request outside a hook, in one write of its own, and marks it served; a
    step whose basis moved raises and the request waits for the next round (doc 1310 section 6.2)."""

    lock = True

    request_id: int
