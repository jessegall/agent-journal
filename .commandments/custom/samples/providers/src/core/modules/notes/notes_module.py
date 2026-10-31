from core.base.module.module import Module
from core.modules.sample_program.providers.sample_provider import SampleProvider


# @sin architecture_providers_ProvidersOnlyInStandaloneModulesDetector
class NotesModule(Module):
    """A module sample that provides an agent program while it depends on other modules."""
    move_reason = "it is a sample with no version 4 table"

    name = "journal.core.notes"
    dependencies = ["journal.core.agents"]
    providers = [SampleProvider]
