from dataclasses import dataclass
from enum import Enum, StrEnum
from typing import TypedDict


class Section(StrEnum):
    GENERAL = "General"
    AGENT = "Agent"
    WORK = "Work"
    MEMORY = "Memory and records"
    MORE = "More"


class Described(TypedDict):
    key: str
    title: str
    line: str
    section: str
    lead: str


@dataclass(frozen=True)
class Grouping:
    title: str
    line: str
    section: Section
    lead: str = ""


class Group(Enum):
    JOURNAL = Grouping("Journal", "For the whole project, every environment", Section.GENERAL)
    VIEWER = Grouping("Viewer", "For this browser only", Section.GENERAL)
    CHAT = Grouping("Chat", "What the chat shows", Section.GENERAL)
    AGENT = Grouping("Agent", "How the agent works and talks to you", Section.AGENT)
    SESSIONS = Grouping("Sessions and helpers", "Agent sessions, subagents and helpers", Section.AGENT)
    LONG_COMMANDS = Grouping("Long commands", "Move a command that holds the terminal to the background", Section.AGENT, "long_commands")
    LAWS = Grouping("Laws", "Dispatch and reading rules every agent follows", Section.AGENT, "journal_laws")
    SKILLS = Grouping("Skills", "Which skills load, and when", Section.AGENT, "skill_loading")
    WORK_TRACKING = Grouping("Work tracking", "The agent opens work before it edits and logs it on its to-do", Section.WORK, "work_tracking")
    PLANS = Grouping("Plans", "How the agent moves through a plan", Section.WORK, "plans")
    QUESTIONS = Grouping("Questions", "Choices only you can make are asked as questions", Section.WORK, "ask_questions")
    MESSAGES = Grouping("Messages", "How the agent handles the messages you send", Section.WORK, "messages")
    SEQUENCES = Grouping("Sequences", "Steps the agent follows in order", Section.WORK, "sequences")
    BOARDS = Grouping("Boards", "Ticket boards and the agents that fill them", Section.WORK, "boards")
    TICKETS = Grouping("Tickets", "Each ticket runs in an environment of its own", Section.WORK, "tickets")
    MEMORY = Grouping("Memory", "Facts, rules and reminders said again to the agent", Section.MEMORY)
    RECORDS = Grouping("Records", "Documents, collections and checks on the record", Section.MEMORY)
    ARCHIVE = Grouping("Archive and cleanup", "How long finished rows and runtime files stay", Section.MEMORY)
    SHARING = Grouping("Sharing", "Share one item through a tunler link", Section.MEMORY, "sharing")
    DEVELOPER = Grouping("Developer", "For working on the journal itself", Section.MORE)

    @property
    def key(self) -> str:
        return self.name.lower()

    def describe(self) -> Described:
        g = self.value
        return Described(key=self.key, title=g.title, line=g.line, section=g.section.value, lead=g.lead)


def describe() -> list[Described]:
    return [group.describe() for group in Group]
