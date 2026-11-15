from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.driver.loaded_actor import LoadedActor


class ActorLoader:
    """Loads an agent once for a hook: its suite and driver as the hook path chooses them."""

    def __init__(self, choice: SuiteChoice) -> None:
        self.choice = choice

    def loaded(self, agent: Agent) -> LoadedActor:
        suite, driver = self.choice.suite(), self.choice.driver(agent.role)
        return LoadedActor(agent.id, agent.environment_id, agent.role, agent.access, suite.name if suite is not None else "", driver.name if driver is not None else "")
