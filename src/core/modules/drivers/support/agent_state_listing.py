from dataclasses import dataclass, replace

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.driver.hook_event import HookEvent
from engine.driver.state_boards import StateBoards
from engine.enums.hook_event_name import HookEventName
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.actor_loader import ActorLoader

NONE = "(none)"
TIER_LABELS = ((StateTier.CRITICAL, "critical"), (StateTier.STACK, "stack"), (StateTier.IN_PLACE, "in place"), (None, "defaults"), (StateTier.DEFERRED, "deferred"))


@dataclass(frozen=True)
class AgentStates:
    """What journal driver states prints for an agent: its driver and role, and the open states of each tier, each
    with the rows that hold it open and since when."""

    agent: str
    driver: str
    role: str
    critical: str
    stack: str
    in_place: str
    defaults: str
    deferred: str


@dataclass(frozen=True)
class OpenState:
    """One state an agent is in, for a screen: its tier, its name and the rows that hold it open, with since when."""

    tier: str
    name: str
    rows: tuple[str, ...]
    since: str


@dataclass(frozen=True)
class StateType:
    """One registered state as journal driver state-types prints it."""

    name: str
    owner: str
    shape: str
    tier: str
    drivers: str
    roles: str
    rules: str
    deferred: str
    substates: str


class AgentStateListing:
    """Lists the states an agent is in and the kinds of state the journal knows, read from the registry and the agent's
    state board, so a tier a later phase fills is listed from the registry and never from a fixed list."""

    def __init__(self, registry: Registry, boards: StateBoards, loader: ActorLoader) -> None:
        self.registry, self.boards, self.loader = registry, boards, loader

    def states(self, agent: Agent, now: Timestamp) -> AgentStates:
        actor = self.loader.loaded(agent)
        open_states = self.open_states(agent, now)
        lines = [self.tier_line([state for state in open_states if state.tier == label]) if tier is not None else NONE for tier, label in TIER_LABELS]
        return AgentStates(f"agent {agent.number}", actor.driver, actor.role, *lines)

    # The open states of an agent as a hook of now finds them, tier by tier in the order of the tiers, each state in its place.
    def open_states(self, agent: Agent, now: Timestamp) -> list[OpenState]:
        actor = self.loader.loaded(agent)
        tick = HookEvent.tick(agent.program, agent.session, "", 0, str(agent.id), "")
        board = self.boards.for_hook(AgentHook.of_actor(replace(tick, event=HookEventName.PRE_TOOL_USE), actor, now))
        matched: list[OpenState] = []
        for tier, label in TIER_LABELS:
            for entry in self.registry.tier_states(actor.driver, int(tier)) if tier is not None else []:
                rows = board.open_rows(entry)
                if rows:
                    matched.append(OpenState(label, entry.name, tuple(row.ref for row in rows), min(row.opened_at.text for row in rows)))
        return matched

    @staticmethod
    def tier_line(states: list[OpenState]) -> str:
        parts = [f"{state.name} ({', '.join(f'{ref} since {state.since}' for ref in state.rows)})" for state in states]
        return ", ".join(parts) if parts else NONE

    def types(self) -> list[StateType]:
        return [self.type_of(entry) for entry in sorted(self.registry.agent_states, key=lambda entry: entry.position)]

    def type_of(self, entry: AgentStateEntry) -> StateType:
        state = entry.path.checked_class(AgentState)
        rules = [self.rule_label(name) for name in entry.rules]
        substates = [substate.name for substate in self.registry.agent_states if substate.parent == entry.name]
        return StateType(entry.name, entry.owner, state.__mro__[1].__name__, self.tier_label(entry.tier), ", ".join(entry.drivers), state.role_group.name.lower(),
                         ", ".join(rules) or NONE, ", ".join(entry.deferred) or NONE, ", ".join(substates) or NONE)

    def rule_label(self, name: str) -> str:
        rule = next((rule for rule in self.registry.rules if rule.name == name), None)
        return name if rule is None else f"{name} on {rule.hook}"

    @staticmethod
    def tier_label(tier: int) -> str:
        return next((label for member, label in TIER_LABELS if member is not None and int(member) == tier), str(tier))
