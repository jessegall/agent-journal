from journal.features.briefing.support.briefing_standing import BriefingStanding
from journal.features.briefing.support.start_lines import StartLines
from journal.models.agent import Agent
from journal.repositories.environments import Environments
from journal.repositories.rules import Rules


class BriefingStandingReader:
    """Reads the briefing feature's part of the Standing for an agent."""

    def __init__(self, start: StartLines, environments: Environments, rules: Rules) -> None:
        self.start, self.environments, self.rules = start, environments, rules

    def read(self, agent: Agent) -> BriefingStanding:
        return BriefingStanding(oriented=agent.oriented, environment=self.environments.find(agent.environment_id).name, others_lately_at=self.start.others_lately_at(agent.session), rules=self.start.rules_said(), rules_count=len(self.rules.all()), facts=self.start.facts_said(), reminders=self.start.reminders_said(), waiting=self.start.waiting())
