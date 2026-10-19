from dataclasses import dataclass, field
from typing import Callable

from journal.engine.agent_state import AgentState
from journal.engine.machine import Machine
from journal.events.event import Event
from journal.models.agent import Agent
from journal.support.walk_stop import WalkStop
from journal.providers.provider import Provider
from journal.providers.providers import Providers
from journal.repositories.environments import Environments


@dataclass(frozen=True)
class Context:
    """Where a walk stands: the agent it is about, if any, the event that set it off, and whether a hook waits for the answer, which is when a hold or a blocked stop can be answered at all."""

    event: Event
    session: str = ""
    environment_id: int = 0
    provider: str = "claude"
    answers_hook: bool = False
    state: AgentState | None = None
    """The agent's state as the walk found it, read once after the machine and the engine's holds have answered the event, so every check and filler reads the same state; None when the walk is about no agent."""
    spoken: set = field(default_factory=set)
    """The lines this event already put in the terminal: a row event walks about every agent of the environment, and a walk about a second agent does not repeat a line the first one typed."""
    moves: list = field(default_factory=list)
    """The moves made in this event, each the node that made it and the state it left the agent in: one per event, a second is refused."""
    held: list = field(default_factory=list)
    """The node whose hold answers this event, the first to hold; empty while nothing holds."""
    stopped: list = field(default_factory=list)
    """The Stop the later workflows node that ended this event's walk, when one did: nothing after it ran, in its workflow or a later one."""
    unanswered: list = field(default_factory=list)
    """The holds that came after the first in this event: the first hold wins, the rest are recorded here and not answered."""
    read: dict = field(default_factory=dict)
    """What each count check read on this walk, by node: the value the check compared."""
    walked: list = field(default_factory=list)
    """The workflows walked, in order, by id."""
    stops: list[WalkStop] = field(default_factory=list)
    """Where each path of this walk ended: the workflow, the node and the port it ended at, a check's No with no line after it being where the workflow waits."""
    calling: list = field(default_factory=list)
    """The workflows a Run a workflow step is running now, innermost last, so a call into one already running is refused."""

    @property
    def workflow(self) -> int:
        """The workflow being walked: the one a Run a workflow step called, else the event's."""
        if self.calling:
            return self.calling[-1]
        return self.walked[-1] if self.walked else 0

    def agent_in(self, machine: Machine) -> Agent:
        """The agent the walk is about, as the machine holds it now."""
        return machine.agent(self.session, self.environment_id)

    def provider_in(self, providers: Providers) -> Provider:
        return providers.named(self.provider)

    def environment_name_in(self, environments: Environments) -> str:
        """The name of the environment the walk is in; empty for a walk in none."""
        return environments.find(self.environment_id).name if self.environment_id else ""

    def stops_counted(self, counts_kept: Callable[[str, int], dict[str, int]]) -> tuple[WalkStop, ...]:
        """Each stop of this walk with its workflow's counts for the agent as the walk left them."""
        return tuple(stop.with_counts(counts_kept(self.session, stop.workflow)) for stop in self.stops)

    def keeps_count(self, text: str) -> bool:
        """A count step's text names a count, and there is an agent to keep it for."""
        return bool(self.session and text.strip())

    def counted(self, name: str) -> str:
        """A count's name as kept for the workflow being walked: each workflow keeps its own counts."""
        return f"charts:{self.workflow}:{name}"
