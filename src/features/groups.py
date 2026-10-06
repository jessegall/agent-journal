from dataclasses import dataclass
from enum import Enum, StrEnum
from typing import TypedDict


class Tab(StrEnum):
    FEATURES = "features"
    SYSTEM = "system"
    SHARING = "sharing"
    DEVELOPER = "developer"


class Section(StrEnum):
    AGENT = "The agent"
    WORK = "Work"
    MEMORY = "Memory and records"
    CHAT = "Chat and viewer"
    SYSTEM = "System"
    SHARING = "Sharing"
    DEVELOPER = "Developer"


class Described(TypedDict):
    key: str
    title: str
    line: str
    section: str
    tab: str
    lead: str


@dataclass(frozen=True)
class Grouping:
    title: str
    line: str
    section: Section
    tab: Tab = Tab.FEATURES
    lead: str = ""


class Group(Enum):
    AGENT = Grouping("Agent", "How the agent works and talks to you", Section.AGENT)
    SESSIONS = Grouping("Sessions and helpers", "Agent sessions, subagents and helpers", Section.AGENT)
    LONG_COMMANDS = Grouping(
        "Long commands", "Moves a command that blocks the agent's terminal to the background", Section.AGENT, lead="long_commands"
    )
    LAWS = Grouping(
        "Built-in rules", "Rules the journal gives every agent: how it starts subagents and how much it reads", Section.AGENT, lead="journal_laws"
    )
    SKILLS = Grouping("Skills", "When the agent loads skills", Section.AGENT, lead="skill_loading")
    WORK_TRACKING = Grouping(
        "Work tracking", "The agent opens work before it changes files, and logs it on its to-do", Section.WORK, lead="work_tracking"
    )
    PLANS = Grouping("Plans", "How the agent moves through a plan", Section.WORK, lead="plans")
    QUESTIONS = Grouping("Questions", "Choices only you can make are asked as questions", Section.WORK, lead="ask_questions")
    MESSAGES = Grouping("Messages", "How the agent handles the messages you send", Section.WORK, lead="messages")
    SEQUENCES = Grouping("Sequences", "Steps the agent follows in order", Section.WORK, lead="sequences")
    BOARDS = Grouping("Boards", "Ticket boards and the agents that fill them", Section.WORK, lead="boards")
    TICKETS = Grouping("Tickets", "Each ticket runs in an environment of its own", Section.WORK, lead="tickets")
    MEMORY = Grouping("Memory", "Facts, rules and reminders repeated to the agent", Section.MEMORY)
    RECORDS = Grouping("Documents and checks", "Documents, collections, checks and other things the agent files", Section.MEMORY)
    ARCHIVE = Grouping("Archive and cleanup", "How long closed items and runtime files are kept", Section.MEMORY)
    CHAT = Grouping("Chat", "What the chat shows", Section.CHAT)
    VIEWER = Grouping("Viewer", "What the viewer shows, and when it opens", Section.CHAT)
    UPDATES = Grouping("Updates", "How new versions of the journal are installed", Section.SYSTEM, Tab.SYSTEM)
    PROJECT = Grouping("This project", "For the whole project, in every environment", Section.SYSTEM, Tab.SYSTEM)
    BROWSER = Grouping("This browser", "Saved in this browser only", Section.SYSTEM, Tab.SYSTEM)
    STOP = Grouping("Stop the journal", "Closes the viewer, the engine and every plugin. Nothing is deleted.", Section.SYSTEM, Tab.SYSTEM)
    SHARING = Grouping(
        "Share links",
        "Share one document, report, collection or plan with someone outside the journal. The link opens that item and nothing else.",
        Section.SHARING,
        Tab.SHARING,
        "sharing",
    )
    DEVELOPER = Grouping("Developer", "For working on the journal itself", Section.DEVELOPER, Tab.DEVELOPER)

    @property
    def key(self) -> str:
        return self.name.lower()

    def describe(self) -> Described:
        g = self.value
        return Described(key=self.key, title=g.title, line=g.line, section=g.section.value, tab=g.tab.value, lead=g.lead)


def describe() -> list[Described]:
    return [group.describe() for group in Group]
