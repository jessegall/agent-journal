from journal.features.briefing.feature import Briefing
from journal.features.checks.feature import Checks
from journal.features.long_runs.feature import LongRuns
from journal.features.etiquette.feature import Etiquette
from journal.features.workers.feature import Workers
from journal.features.laws.feature import Laws
from journal.features.memory.feature import Memory
from journal.features.messages.feature import Messages
from journal.features.plans.feature import Plans
from journal.features.questions.feature import Questions
from journal.features.sequences.feature import Sequences
from journal.features.skills.feature import Skills
from journal.features.tasks.feature import Tasks
from journal.features.triggers.feature import Triggers


class Standard:
    """The features the journal ships with, in the order they register."""

    FEATURES = (Briefing, Memory, Tasks, Messages, Questions, Plans, Sequences, Workers, Laws, Skills, Triggers, Checks, LongRuns, Etiquette)

    @classmethod
    def registry(cls) -> Registry: ...
