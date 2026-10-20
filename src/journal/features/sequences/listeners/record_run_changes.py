from journal.support.cards import Cards
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.support.running import Running
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.support.sequence_run import SequenceRun
from journal.repositories.entries import Entries
from journal.support.chat_mark import ChatMark

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
                self.kept(agent, run, "started", ChatMark.SEQUENCES)
            elif run.step != was.step:
                self.kept(agent, run, f"moved on to step {run.step + 1}", ChatMark.SEQUENCE_STEPS)
            elif run.parked_why and not was.parked_why:
                self.kept(agent, run, f"parked at step {run.step + 1}: {run.parked_why}", ChatMark.SEQUENCE_STEPS)
            elif was.parked_why and not run.parked_why:
                self.kept(agent, run, f"followed again at step {run.step + 1}", ChatMark.SEQUENCE_STEPS)
        for n, run in before.items():
            if n not in after:
                self.kept(agent, run, "finished" if run.last else f"ended at step {run.step + 1}", ChatMark.SEQUENCES)

    def kept(self, agent: Agent, run: SequenceRun, what: str, shows: ChatMark) -> None:
        data = {"session": agent.session, "n": run.sequence_id, "title": run.title, "what": what}
        self.entries.save(Entry(environment_id=agent.environment_id, kind=RUN, actor=Actor.system(), data=data), Actor.system())
        self.cards.show(agent.environment_id, agent.session, f"Sequence {run.sequence_id}, {run.title}: {what}", "list", "sequence", row=f"sequences:{run.sequence_id}", shows=shows)
