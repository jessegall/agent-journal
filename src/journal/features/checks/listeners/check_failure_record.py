from journal.events.agent.line_delivered import LineDelivered
from journal.events.agent_listener import AgentListener
from journal.repositories.checks import Checks
from journal.support.actor import Actor


class CheckFailureRecord(AgentListener[LineDelivered]):
    """A failing check told to the agent is marked on its row with the time it was reported, so it is told again only once the set minutes have passed."""

    def __init__(self, checks: Checks) -> None:
        self.checks = checks

    def handle(self, event: LineDelivered) -> None:
        from journal.features.checks.feature import Checks as Feature
        if event.nudge not in (Feature.CHECK_FAILED.key, Feature.CHECK_FAILURE_REPEAT.key):
            return
        self.checks.save(self.checks.find(int(event.values["n"])).failure_reported(event.time), Actor.system())
