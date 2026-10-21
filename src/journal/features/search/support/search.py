from journal.config import Config
from journal.features.search.support.found import Found
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.repositories.docs import Docs
from journal.repositories.dumps import Dumps
from journal.repositories.facts import Facts
from journal.repositories.messages import Messages
from journal.repositories.notices import Notices
from journal.repositories.phases import Phases
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.repository import Repository
from journal.repositories.rules import Rules
from journal.repositories.secrets import Secrets
from journal.repositories.sequences import Sequences
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.templates import Templates
from journal.repositories.triggers import Triggers
from journal.repositories.workers import Workers

CONVERSATIONS = 5
CONVERSATION = "conversation"


class Search:
    """Words looked for in every model with words of its own here, newest first, or only in the models named, and in the agents' conversations when asked; the command and the viewer both ask it, so they find the same."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, questions: Questions, facts: Facts, rules: Rules, reminders: Reminders, reports: Reports,
                 docs: Docs, task_logs: TaskLogs, phases: Phases, checks: Checks, sequences: Sequences, workers: Workers, templates: Templates, dumps: Dumps,
                 triggers: Triggers, notices: Notices, secrets: Secrets, agents: Agents, providers: Providers, config: Config) -> None:
        self.kinds: tuple[Repository, ...] = (tasks, plans, phases, task_logs, messages, questions, facts, rules, reminders, reports, docs, checks, sequences,
                                              workers, templates, dumps, triggers, notices, secrets)
        self.agents, self.providers, self.config = agents, providers, config

    def models(self) -> list[str]:
        return [self.named(kind) for kind in self.kinds]

    def found(self, terms: list[str]) -> list[Found]:
        return self.rows(terms, self.kinds)

    def found_in(self, terms: list[str], names: list[str]) -> list[Found]:
        wanted = [kind for kind in self.kinds if self.named(kind) in names]
        return self.rows(terms, wanted) + (self.said(terms) if CONVERSATION in names else [])

    def rows(self, terms: list[str], kinds) -> list[Found]:
        return [Found.of(row, terms) for kind in kinds for row in kind.search(terms)]

    @staticmethod
    def named(kind: Repository) -> str:
        return kind.model.table().removesuffix("s")

    def said(self, terms: list[str]) -> list[Found]:
        found = []
        for agent in reversed([agent for agent in self.agents.in_() if agent.has_program()][-CONVERSATIONS:]):
            path = self.providers.named(agent.provider).transcript(self.config.root, agent.session)
            if path is None:
                continue
            turns = [turn for turn in self.providers.named(agent.provider).turns(path) if all(word.lower() in turn.text.lower() for word in terms)]
            found += [Found(f"conversation {agent.session[:8]}, line {turn.line}", Found.around(turn.text, terms)) for turn in reversed(turns)]
        return found
