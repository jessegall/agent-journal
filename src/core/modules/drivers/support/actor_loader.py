from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.driver.loaded_actor import LoadedActor
from engine.driver.open_row import OpenRow
from engine.enums.agent_role import AgentRole
from engine.guard.guard_switches import GuardSwitches
from engine.registry.default_state_entry import DefaultStateEntry
from engine.registry.registry import Registry


class ActorLoader:
    """Loads an agent once for a hook: its suite and driver as both hook paths choose them, the row its
    default states stand on, its launch, else its process start, else its creation, and the default states
    its suite gives an agent of its role, driver and helper type, without one switched off or named in its profile's
    removed states, each with the state that takes it away while open."""

    def __init__(self, choice: SuiteChoice, registry: Registry, switches: GuardSwitches, profiles: ProfileFiles) -> None:
        self.choice, self.registry, self.switches, self.profiles = choice, registry, switches, profiles

    def loaded(self, agent: Agent) -> LoadedActor:
        suite, driver = self.choice.suite(), self.choice.driver(agent.role)
        suite_name, driver_name = suite.name if suite is not None else "", driver.name if driver is not None else ""
        anchored_at = agent.launched_at or agent.process_started_at or agent.creation_timestamp()
        defaults = self.defaults(agent, suite_name, driver_name)
        return LoadedActor(agent.id, agent.environment_id, agent.role, agent.access, suite_name, driver_name, OpenRow("agent", agent.id, anchored_at),
                           tuple(dict.fromkeys(default.state for default in defaults)),
                           {default.state: default.removed_while for default in defaults if default.removed_while})

    def defaults(self, agent: Agent, suite_name: str, driver_name: str) -> tuple[DefaultStateEntry, ...]:
        is_main = agent.role == AgentRole.MAIN
        role, helper_type = (AgentRole.MAIN.value, "") if is_main else (AgentRole.HELPER.value, agent.role)
        given = self.registry.default_states(suite_name, role, driver_name, helper_type)
        removed = self.removed_states(agent)
        return tuple(default for default in given if self.switches.enabled(default.state) and default.state not in removed)

    # the defaults the agent's profile file takes away; an agent started without a profile keeps them all
    def removed_states(self, agent: Agent) -> tuple[str, ...]:
        if not agent.profile:
            return ()
        return self.profiles.effective(agent.profile).removed_states
