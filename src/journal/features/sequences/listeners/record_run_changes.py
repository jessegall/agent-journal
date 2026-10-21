from journal.support.cards import Cards
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.support.run_tracker import RunTracker
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.support.sequence_run import SequenceRun
from journal.repositories.entries import Entries
from journal.support.card_kind import CardKind

RUN = "sequence_run"


class RecordRunChanges(Listener[Updated]):
    """Every change to an agent's runs is kept as an entry for the agent's panel and shown as a card in the chat."""

    def __init__(self, active: RunTracker, entries: Entries, cards: Cards) -> None:
        self.running, self.entries, self.cards = active, entries, cards

    def handle(self, event: Updated) -> None:
        agent = event.model
        if not isinstance(agent, Agent) or "sequence_runs" not in event.changed():
            return
        previous = {run.sequence_id: run for run in self.running.runs(event.previous)}
        following = {run.sequence_id: run for run in self.running.runs(agent)}
        for n, run in following.items():
            prior_row = previous.get(n)
            if prior_row is None:
                self.stored(agent, run, "started", CardKind.SEQUENCES)
            elif run.step != prior_row.step:
                self.stored(agent, run, f"moved on to step {run.step + 1}", CardKind.SEQUENCE_STEPS)
            elif run.suspension_reason and not prior_row.suspension_reason:
                self.stored(agent, run, f"parked at step {run.step + 1}: {run.suspension_reason}", CardKind.SEQUENCE_STEPS)
            elif prior_row.suspension_reason and not run.suspension_reason:
                self.stored(agent, run, f"followed again at step {run.step + 1}", CardKind.SEQUENCE_STEPS)
        for n, run in previous.items():
            if n not in following:
                self.stored(agent, run, "finished" if run.last else f"ended at step {run.step + 1}", CardKind.SEQUENCES)

    def stored(self, agent: Agent, run: SequenceRun, subject: str, shows: CardKind) -> None:
        data = {"session": agent.session, "n": run.sequence_id, "title": run.title, "what": subject}
        self.entries.save(Entry(environment_id=agent.environment_id, kind=RUN, actor=Actor.system(), data=data), Actor.system())
        self.cards.show(agent.environment_id, agent.session, f"Sequence {run.sequence_id}, {run.title}: {subject}", "list", "sequence", row=f"sequences:{run.sequence_id}", shows=shows)
