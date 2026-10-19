from journal.config import Config
from journal.features.search.found import Found
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.docs import Docs
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.rules import Rules
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks

CONVERSATIONS = 5
"""The latest agents of the environment whose conversations are searched."""


class Search:
    """Words looked for in every kind of row with words of its own and in the agents' conversations here, newest first; the command and the viewer both ask it, so they find the same."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, questions: Questions, facts: Facts, rules: Rules, reminders: Reminders,
                 reports: Reports, docs: Docs, task_logs: TaskLogs, agents: Agents, providers: Providers, config: Config) -> None:
        self.kinds = (tasks, plans, task_logs, messages, questions, facts, rules, reminders, reports, docs)
        self.agents, self.providers, self.config = agents, providers, config

    def found(self, words: list[str]) -> list[Found]:
        return [Found.of(row, words) for kind in self.kinds for row in kind.search(words)] + self.said(words)

    def said(self, words: list[str]) -> list[Found]:
        """What the agents here wrote or were told in their conversations that holds every word, newest first."""
        found = []
        for agent in reversed([agent for agent in self.agents.in_() if agent.has_program()][-CONVERSATIONS:]):
            path = self.providers.named(agent.provider).transcript(self.config.root, agent.session)
            if path is None:
                continue
            turns = [turn for turn in self.providers.named(agent.provider).turns(path) if all(word.lower() in turn.text.lower() for word in words)]
            found += [Found(f"conversation {agent.session[:8]}, line {turn.line}", Found.around(turn.text, words)) for turn in reversed(turns)]
        return found
