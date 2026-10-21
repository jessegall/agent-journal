from journal.features.briefing.support.briefing_data import BriefingData
from journal.features.briefing.support.start_lines import StartLines
from journal.models.agent import Agent
from journal.repositories.environments import Environments
from journal.repositories.rules import Rules


class BriefingDataReader:
    """Reads the briefing feature's part of the feature data for an agent."""

    def __init__(self, start: StartLines, environments: Environments, rules: Rules) -> None:
        self.start, self.environments, self.rules = start, environments, rules

    def read(self, agent: Agent) -> BriefingData:
        return BriefingData(oriented=agent.oriented, environment=self.environments.find(agent.environment_id).name, last_other_session_at=self.start.other_session_time(agent.session), rules=self.start.rules_numbered(), rules_count=len(self.rules.all()), facts=self.start.facts_numbered(), reminders=self.start.reminders_numbered(), waiting=self.start.waiting())
