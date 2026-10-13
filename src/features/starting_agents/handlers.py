from events import Fact
from events.starting_agents import WakeRequested
from receiving import Handler
from resources.types import Environment
from serving import Clock, Elsewhere, Processes, Providers, Rows


class CarryOnTheConversation(Handler[WakeRequested]):
    def handle(self, event: WakeRequested, processes: Processes, providers: Providers, environments: Rows[Environment], elsewhere: Elsewhere, clock: Clock) -> list[Fact]:
        root = elsewhere.here().record.root
        processes.start_detached(root, root.parent, event.environment, event.provider, [*providers.driver(event.provider).AUTO_ARGS], event.conversation)
        environments.update(event.n, launched=clock.now(), launched_agent=event.provider)
        return []
