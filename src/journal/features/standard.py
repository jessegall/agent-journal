from journal.features.aliases.feature import AliasesFeature
from journal.features.briefing.feature import Briefing
from journal.features.checks.feature import Checks
from journal.features.edits.feature import EditsFeature
from journal.features.etiquette.feature import Etiquette
from journal.features.faults.feature import Faults
from journal.features.phone.feature import PhoneFeature
from journal.features.git.feature import Git
from journal.features.workers.feature import Workers
from journal.features.laws.feature import Laws
from journal.features.delivery.feature import Delivery
from journal.features.mcp.feature import Mcp
from journal.features.secrets.feature import Secrets
from journal.features.mentions.feature import MentionsFeature
from journal.features.search.feature import SearchFeature
from journal.features.migration.feature import MigrationFeature
from journal.features.pausing.feature import PausingFeature
from journal.features.usage.feature import Usage
from journal.features.pins.feature import Pins
from journal.features.docs.feature import DocsFeature
from journal.features.reports.feature import ReportsFeature
from journal.features.collections.feature import CollectionsFeature
from journal.features.dumps.feature import DumpsFeature
from journal.features.templates.feature import TemplatesFeature
from journal.features.memory.feature import Memory
from journal.features.messages.feature import Messages
from journal.features.plans.feature import Plans
from journal.features.plugins.feature import PluginsFeature
from journal.features.profiles.feature import Profiles
from journal.features.questions.feature import Questions
from journal.features.sequences.feature import Sequences
from journal.features.sharing.feature import Sharing
from journal.features.shell.feature import Shell
from journal.features.skills.feature import Skills
from journal.features.tasks.feature import Tasks
from journal.features.thinking.feature import Thinking
from journal.features.triggers.feature import Triggers
from journal.features.updates.feature import Updates
from journal.features.suggestions.feature import SuggestionsFeature
from journal.features.record.feature import Record
from journal.features.voices.feature import Voices
from journal.features.team.feature import TeamFeature


class Standard:
    """The features the journal ships with, in the order they register."""

    FEATURES = (Skills, Briefing, Memory, Tasks, Messages, Questions, Plans, Sequences, PausingFeature, Usage, Workers, Laws, Triggers, Checks, Shell, AliasesFeature, Thinking, Mcp, Secrets, Sharing, Delivery, TemplatesFeature, ReportsFeature, DocsFeature, CollectionsFeature, DumpsFeature, Pins, Etiquette, Voices, Profiles, Git, EditsFeature, PluginsFeature, Faults, PhoneFeature, MigrationFeature, MentionsFeature, SearchFeature, Updates, SuggestionsFeature, TeamFeature, Record)

