from dataclasses import replace

from journal.engine.state_machine import StateMachine
from journal.engine.resume import Resume
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.dumps.states.sorting_dump import SortingDump
from journal.models.dump import Dump
from journal.repositories.agents import Agents
from journal.repositories.dumps import Dumps


class FollowDump(Listener[Updated]):
    """The agent sorting a dump follows it: free to stop while the user's answer is awaited, and back where it was once the dump is filed, or on to the next dump waiting."""

    def __init__(self, agents: Agents, machine: StateMachine, dumps: Dumps) -> None:
        self.agents, self.machine, self.dumps = agents, machine, dumps

    def handle(self, event: Updated) -> None:
        dump = event.model
        agent = self.agents.live()
        if not isinstance(dump, Dump) or agent is None or agent.state != SortingDump.name:
            return
        state = self.machine.current(agent.session)
        if state.dump_id != dump.id:
            return
        if not dump.is_completed:
            self.machine.move(agent.session, dump.environment_id, replace(state, asking=bool(dump.question)))
            return
        following = self.dumps.in_hand()
        back = Resume(state=state.resume.get("state", "idle"), data=state.resume.get("data", {}))
        self.machine.move(agent.session, dump.environment_id, replace(state, dump_id=following.id, asking=False) if following else back)
