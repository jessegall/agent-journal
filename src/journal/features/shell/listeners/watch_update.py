from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.shell.support.output_process_card import OutputProcessCard
from journal.repositories.command_outputs import CommandOutputs
from journal.support.actor import Actor


class WatchUpdate(AgentListener[ToolFinished]):
    """After every tool use the card of the agent's watched output is read again from its files; once the card has shown how its command ended, and the shell conduct has said so, the watch ends."""

    def __init__(self, outputs: CommandOutputs, card: OutputProcessCard) -> None:
        self.outputs, self.card = outputs, card

    def handle(self, event: ToolFinished) -> None:
        for output in self.outputs.watched(event.session):
            if self.card.card_view(output).ending:
                self.outputs.save(output.unwatched(), Actor.system())
                continue
            self.card.show(output)
