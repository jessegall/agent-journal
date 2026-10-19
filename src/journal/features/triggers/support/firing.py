from journal.support.cards import Cards
from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.support.running import Running
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction
from journal.repositories.sequences import Sequences


class Firing:
    """What met triggers do, wherever the words came up: a card for each, a nudge or an instruction said, a sequence started at its first step. The lines to give the agent come back."""

    def __init__(self, machine: Machine, nudger: Nudger, cards: Cards, running: Running, sequences: Sequences) -> None:
        self.machine, self.nudger, self.cards, self.running, self.sequences = machine, nudger, cards, running, sequences

    def lines(self, met: list[Trigger], session: str, environment_id: int) -> list[str]:
        agent = self.machine.agent(session, environment_id)
        lines = []
        for trigger in met:
            self.cards.show(environment_id, session, f"Trigger {trigger.text}", "bolt", "", ", ".join(trigger.words), f"triggers:{trigger.id}")
            line = self.started(trigger, session, environment_id) if trigger.action == TriggerAction.SEQUENCE else self.nudger.say(agent, self.said(trigger))
            if line:
                lines.append(line)
        return lines

    def started(self, trigger: Trigger, session: str, environment_id: int) -> str:
        """The sequence the trigger names, by its title, started unless it runs already; its first step is the line."""
        for sequence in self.sequences.all():
            if sequence.title == trigger.text:
                return self.running.start(sequence, session, environment_id)
        return ""

    @staticmethod
    def said(trigger: Trigger):
        from journal.features.triggers.feature import Triggers as TriggersFeature
        return (TriggersFeature.INSTRUCT if trigger.action == TriggerAction.INSTRUCT else TriggersFeature.NUDGE).about(title=trigger.text)
