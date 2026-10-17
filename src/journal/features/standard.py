from journal.features.briefing.feature import Briefing
from journal.features.chart.feature import ChartFeature
from journal.features.checks.feature import Checks
from journal.features.edits.feature import EditsFeature
from journal.features.etiquette.feature import Etiquette
from journal.features.git.feature import Git
from journal.features.workers.feature import Workers
from journal.features.laws.feature import Laws
from journal.features.delivery.feature import Delivery
from journal.features.mcp.feature import Mcp
from journal.features.secrets.feature import Secrets
from journal.features.pins.feature import Pins
from journal.features.reports.feature import ReportsFeature
from journal.features.templates.feature import TemplatesFeature
from journal.features.memory.feature import Memory
from journal.features.messages.feature import Messages
from journal.features.plans.feature import Plans
from journal.features.plugins.feature import PluginsFeature
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

    FEATURES = (Skills, Briefing, Memory, Tasks, Messages, Questions, Plans, Sequences, Workers, Laws, Triggers, Checks, Shell, Thinking, Mcp, Secrets, Delivery, TemplatesFeature, ReportsFeature, Pins, Etiquette, Voices, Profiles, Git, EditsFeature, ChartFeature, PluginsFeature)
    """The engine's own listeners first, the skill, the look and the mark each owed and held by its feature, the workflows' walk after them, so a workflow reads the facts the engine set at this very event, and the plugins last, so the journal's own holds answer first."""

    @classmethod
    def registry(cls) -> Registry: ...
