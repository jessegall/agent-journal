from journal.events.agent.turn_displayed import TurnDisplayed
from journal.events.bus import Bus
from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.hooks.support.transcript_turns import TranscriptTurns
from journal.repositories.agents import Agents
from journal.support.scope import Scope
from journal.repositories.setting_rows import SettingRows


class TranscriptScan(Listener[ClockTicked]):
    """At every tick the words each live agent wrote, and the messages other sessions sent it, that no hook has brought, once they are past the seconds the hooks have, reach the chat as a turn; the hooks' own reading of the transcript is moved on past them, so nothing is read twice."""

    def __init__(self, agents: Agents, turns: TranscriptTurns, bus: Bus, scope: Scope, settings: SettingRows) -> None:
        self.agents, self.turns, self.bus, self.scope, self.settings = agents, turns, bus, scope, settings

    def handle(self, event: ClockTicked) -> None:
        from journal.features.messages.feature import Messages
        until = event.time - float(self.settings.option(Messages.TRANSCRIPT_SCAN_DELAY))
        for agent in [agent for agent in self.agents.everywhere() if agent.has_program() and agent.state != "ended"]:
            with self.scope.of(agent.environment_id):
                written = self.turns.missed(agent.session, agent.provider, until)
                turns = [TurnDisplayed(text=text, delta=text, turn_id=f"swept:{agent.session}:{event.time}:{i}", final=True) for i, text in enumerate(written.texts)]
                for swept in [*written.crossed, *turns]:
                    self.bus.dispatch(swept.placed(agent.session, agent.environment_id, agent.provider, None, event.time))
