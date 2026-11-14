from core.modules.transcriptions.windows.transcriptions_windows import TRANSCRIPTIONS_WINDOWS
from core.modules.transcriptions.skills.declarations.transcriptions_skills import TRANSCRIPTIONS_SKILLS
from core.modules.transcriptions.migrations.m002_environment_index import TranscriptionsEnvironmentIndexMigration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.transcriptions.commands.request_transcription_fetch.request_transcription_fetch_handler import RequestTranscriptionFetchHandler
from core.modules.transcriptions.commands.request_transcription_fetch.request_transcription_fetch_subcommand import RequestTranscriptionFetchSubcommand
from core.modules.transcriptions.commands.add_transcription_link.add_transcription_link_handler import AddTranscriptionLinkHandler
from core.modules.transcriptions.commands.add_transcription_link.add_transcription_link_subcommand import AddTranscriptionLinkSubcommand
from core.modules.transcriptions.commands.transcription_sources.transcription_sources_subcommand import TranscriptionSourcesSubcommand
from core.modules.transcriptions.listeners.transcription_task_listener import TranscriptionTaskListener
from core.modules.transcriptions.migrations.m001_transcriptions import TranscriptionsTableMigration
from core.modules.transcriptions.models.transcription import Transcription
from core.modules.transcriptions.seeders.transcriptions_seeder import TranscriptionsSeeder
from core.modules.transcriptions.support.transcription_nudges import TRANSCRIPTION_NUDGES


class TranscriptionsModule(Module):
    """Adds transcriptions: transcripts kept in the project, pasted or fetched, which an agent turns into summaries
    and other rows linked back to them, and the Transcriptions page."""

    name = "journal.core.transcriptions"
    move_reason = "version 4 had no transcriptions"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.documents", "journal.core.mcp"]
    skills = TRANSCRIPTIONS_SKILLS
    models = [ModelDeclaration(Transcription)]
    migrations = [TranscriptionsTableMigration, TranscriptionsEnvironmentIndexMigration]
    handlers = [AddTranscriptionLinkHandler, RequestTranscriptionFetchHandler]
    subcommands = [AddTranscriptionLinkSubcommand, RequestTranscriptionFetchSubcommand, TranscriptionSourcesSubcommand]
    nudges = TRANSCRIPTION_NUDGES
    listeners = [TranscriptionTaskListener]
    seeders = [TranscriptionsSeeder]
    windows = TRANSCRIPTIONS_WINDOWS
