from journal.engine.machine import Machine
from journal.events.state_entered import StateEntered
from journal.features.listener import Listener
from journal.features.skills.requiring import Requiring
from journal.features.skills.states.loading_skill import LoadingSkill


class RequireOnEntering(Listener[StateEntered]):
    """An agent that enters a state owes that state's feature's skill; it is held there until it has read it, and told so in the command's own output."""

    def __init__(self, machine: Machine, requiring: Requiring) -> None:
        self.machine, self.requiring = machine, requiring

    def handle(self, event: StateEntered) -> None:
        if event.entered == LoadingSkill.name:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        for line in self.requiring.hold(agent, self.requiring.owed(agent, self.requiring.for_state(state))):
            print(line)
