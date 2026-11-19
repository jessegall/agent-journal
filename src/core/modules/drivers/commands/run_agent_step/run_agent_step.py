from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RunAgentStep(Command[None]):
    """Steps the agent of one open step request outside a hook: the step is worked out with no lock held and saved,
    with the request marked served, in one short write; a step whose basis moved raises and the request waits for
    the next round (doc 1310 section 6.2)."""

    request_id: int
