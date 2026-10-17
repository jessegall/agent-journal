from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.sequences.running import Running
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.models.sequence_run import SequenceRun
from journal.repositories.entries import Entries

RUN = "sequence_run"
"""The entry kind of a change to an agent's runs: started, moved on, finished or ended early."""


class RecordRunChanges(Listener[Updated]):
    """Every change to an agent's runs is kept as an entry, so the agent's panel can show what its sequences did."""

    def __init__(self, running: Running, entries: Entries) -> None:
        self.running, self.entries = running, entries

    def handle(self, event: Updated) -> None:
        agent = event.model
        if not isinstance(agent, Agent) or "sequence_runs" not in event.changed():
            return
        before = {run.sequence_id: run for run in self.running.runs(event.was)}
        after = {run.sequence_id: run for run in self.running.runs(agent)}
        for n, run in after.items():
            was = before.get(n)
            if was is None:
                self.kept(agent, run, "started")
            elif run.step != was.step:
                self.kept(agent, run, f"moved on to step {run.step + 1}")
        for n, run in before.items():
            if n not in after:
                self.kept(agent, run, "finished" if run.last else f"ended at step {run.step + 1}")

    def kept(self, agent: Agent, run: SequenceRun, what: str) -> None:
        data = {"session": agent.session, "n": run.sequence_id, "title": run.title, "what": what}
        self.entries.save(Entry(environment_id=agent.environment_id, kind=RUN, actor=Actor.system(), data=data), Actor.system())
