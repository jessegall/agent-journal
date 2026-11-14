from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.driver.loaded_actor import LoadedActor
from engine.driver.open_row import OpenRow


class ActorLoader:
    """Loads an agent once for a hook: its suite and driver as both hook paths choose them, and the row its default
    states stand on, its launch, else its process start, else its creation."""

    def __init__(self, choice: SuiteChoice) -> None:
        self.choice = choice

    def loaded(self, agent: Agent) -> LoadedActor:
        suite, driver = self.choice.suite(), self.choice.driver(agent.role)
        anchored_at = agent.launched_at or agent.process_started_at or agent.creation_timestamp()
        return LoadedActor(agent.id, agent.environment_id, agent.role, agent.access, suite.name if suite is not None else "", driver.name if driver is not None else "",
                           OpenRow("agent", agent.id, anchored_at))
