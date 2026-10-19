from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.engine.telling import Telling
from journal.models.dump import Dump
from journal.repositories.agents import Agents
from journal.repositories.dumps import Dumps
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope


class CarryOnFiling(Listener[ClockTicked]):
    """An agent idle with items of the dump in hand still to settle, and no question waiting, is told to carry on."""

    def __init__(self, environments: Environments, scope: Scope, agents: Agents, dumps: Dumps, telling: Telling) -> None:
        self.environments, self.scope, self.agents, self.dumps, self.telling = environments, scope, agents, dumps, telling

    def handle(self, event: ClockTicked) -> None:
        from journal.features.dumps.feature import DumpsFeature
        for environment in self.environments.all():
            with self.scope.of(environment.id):
                agent, dump = self.agents.live(), self.dumps.in_hand()
                left = dump.unsettled() if dump else []
                if agent and agent.state == "idle" and left and not dump.question:
                    self.telling.tell(DumpsFeature.CARRY_ON.about(n=dump.id, count=Dump.items_in(left)))
