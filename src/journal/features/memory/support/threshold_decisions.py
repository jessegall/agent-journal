from datetime import datetime, timezone

from journal.engine.support.session_agents import SessionAgents
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.support.caller import Caller


class ThresholdDecisions:
    """The agent's decision at a context threshold, kept when it records a fact, a rule or a reminder or says nothing needs recording, which lifts the threshold's hold."""

    def __init__(self, sessions: SessionAgents, scope: Scope, agents: Agents) -> None:
        self.sessions, self.scope, self.agents = sessions, scope, agents

    def decided(self, caller: Caller) -> None:
        if caller.session is None:
            return
        agent = self.sessions.agent(caller.session, self.scope.id)
        if agent.threshold_due:
            self.agents.save(agent.context_decided(datetime.now(timezone.utc).timestamp()), caller.actor)
