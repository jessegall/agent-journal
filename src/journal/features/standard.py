from journal.features.briefing.feature import Briefing
from journal.features.chart.feature import ChartFeature
from journal.features.checks.feature import Checks
from journal.features.etiquette.feature import Etiquette
from journal.features.git.feature import Git
from journal.features.workers.feature import Workers
from journal.features.laws.feature import Laws
from journal.features.delivery.feature import Delivery
from journal.features.mcp.feature import Mcp
from journal.features.pins.feature import Pins
from journal.features.reports.feature import ReportsFeature
from journal.features.templates.feature import TemplatesFeature
from journal.features.memory.feature import Memory
from journal.features.messages.feature import Messages
from journal.features.plans.feature import Plans
from journal.features.profiles.feature import Profiles
from journal.features.questions.feature import Questions
from journal.features.sequences.feature import Sequences
from journal.features.shell.feature import Shell
from journal.features.skills.feature import Skills
from journal.features.tasks.feature import Tasks
from journal.features.thinking.feature import Thinking
from journal.features.triggers.feature import Triggers
from journal.features.voices.feature import Voices


class Standard:
    """The features the journal ships with, in the order they register."""

    FEATURES = (ChartFeature, Briefing, Memory, Tasks, Messages, Questions, Plans, Sequences, Workers, Laws, Skills, Triggers, Checks, Shell, Thinking, Mcp, Delivery, TemplatesFeature, ReportsFeature, Pins, Etiquette, Voices, Profiles, Git)
    """The workflows walk first, right after the machine and before the engine's holds, so they read the state the machine left: a session start walks as the state the agent resumes in, and the briefing's hold comes after."""

    @classmethod
    def registry(cls) -> Registry: ...
