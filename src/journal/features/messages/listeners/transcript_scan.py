from journal.events.agent.turn_displayed import TurnDisplayed
from journal.hooks.agent_event_post import AgentEventPost
from journal.events.clock_ticked import ClockTicked
from journal.events.listener import Listener
from journal.hooks.support.transcript_turns import TranscriptTurns
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows


class TranscriptScan(Listener[ClockTicked]):
    """At every tick the words each live agent wrote, and the messages other sessions sent it, that no hook has brought, once they are past the seconds the hooks have, reach the chat as a turn; the hooks' own reading of the transcript is moved on past them, so nothing is read twice."""

    def __init__(self, agents: Agents, turns: TranscriptTurns, events: AgentEventPost, scope: Scope, settings: SettingRows) -> None:
        self.agents, self.turns, self.events, self.scope, self.settings = agents, turns, events, scope, settings

    def handle(self, event: ClockTicked) -> None:
        from journal.features.messages.feature import Messages
        deadline = event.time - self.settings.decimal(Messages.TRANSCRIPT_SCAN_DELAY)
        for agent in [agent for agent in self.agents.main_agents() if agent.has_program() and agent.state != "ended"]:
            with self.scope.environment(agent.environment_id):
                saved = self.turns.missed(agent.session, agent.provider, deadline)
                turns = [TurnDisplayed(text=text, delta=text, turn_id=f"swept:{agent.session}:{event.time}:{i}", final=True) for i, text in enumerate(saved.texts)]
                for scanned in [*saved.boundary_paths, *turns]:
                    self.events.post(scanned.placed(agent.session, agent.environment_id, agent.provider, None, event.time))
