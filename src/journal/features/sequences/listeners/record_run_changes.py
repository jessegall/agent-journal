from journal.engine.cards import Cards
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.sequences.running import Running
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.models.sequence_run import SequenceRun
from journal.repositories.entries import Entries

RUN = "sequence_run"
"""The entry kind of a change to an agent's runs: started, moved on, parked, followed again, finished or ended early."""


class RecordRunChanges(Listener[Updated]):
    """Every change to an agent's runs is kept as an entry for the agent's panel and shown as a card in the chat."""

    def __init__(self, running: Running, entries: Entries, cards: Cards) -> None:
        self.running, self.entries, self.cards = running, entries, cards

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
            elif run.parked_why and not was.parked_why:
                self.kept(agent, run, f"parked at step {run.step + 1}: {run.parked_why}")
            elif was.parked_why and not run.parked_why:
                self.kept(agent, run, f"followed again at step {run.step + 1}")
        for n, run in before.items():
            if n not in after:
                self.kept(agent, run, "finished" if run.last else f"ended at step {run.step + 1}")

    def kept(self, agent: Agent, run: SequenceRun, what: str) -> None:
        data = {"session": agent.session, "n": run.sequence_id, "title": run.title, "what": what}
        self.entries.save(Entry(environment_id=agent.environment_id, kind=RUN, actor=Actor.system(), data=data), Actor.system())
        detail = "\n".join(line for line in (run.text if what.startswith(("started", "moved")) else "", f"about {run.about}" if run.about else "") if line)
        self.cards.show(agent.environment_id, agent.session, f"Sequence {run.sequence_id}, {run.title}: {what}", "list", "", detail, f"sequences:{run.sequence_id}")
