from core.modules.transcriptions.declarations.transcriptions_dependencies import TRANSCRIPTIONS_DEPENDENCIES
from core.modules.transcriptions.declarations.transcriptions_subcommands import TRANSCRIPTIONS_SUBCOMMANDS
from core.modules.transcriptions.windows.transcriptions_windows import TRANSCRIPTIONS_WINDOWS
from core.modules.transcriptions.skills.declarations.transcriptions_skills import TRANSCRIPTIONS_SKILLS
from core.modules.transcriptions.migrations.m002_environment_index import TranscriptionsEnvironmentIndexMigration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.transcriptions.commands.request_transcription_fetch.request_transcription_fetch_handler import RequestTranscriptionFetchHandler
from core.modules.transcriptions.commands.add_transcription_link.add_transcription_link_handler import AddTranscriptionLinkHandler
from core.modules.transcriptions.listeners.transcription_task_listener import TranscriptionTaskListener
from core.modules.transcriptions.migrations.m001_transcriptions import TranscriptionsTableMigration
from core.modules.transcriptions.models.transcription import Transcription
from core.modules.transcriptions.seeders.transcriptions_seeder import TranscriptionsSeeder
from core.modules.transcriptions.support.transcription_agent_messages import TRANSCRIPTION_AGENT_MESSAGES


class TranscriptionsModule(Module):
    """Adds transcriptions: transcripts kept in the project, pasted or fetched, which an agent turns into summaries
    and other rows linked back to them, and the Transcriptions page."""

    name = "journal.core.transcriptions"
    move_reason = "version 4 had no transcriptions"
    requires_engine = ">=5,<6"
    dependencies = TRANSCRIPTIONS_DEPENDENCIES
    skills = TRANSCRIPTIONS_SKILLS
    models = [ModelDeclaration(Transcription)]
    migrations = [TranscriptionsTableMigration, TranscriptionsEnvironmentIndexMigration]
    handlers = [AddTranscriptionLinkHandler, RequestTranscriptionFetchHandler]
    subcommands = TRANSCRIPTIONS_SUBCOMMANDS
    agent_messages = TRANSCRIPTION_AGENT_MESSAGES
    listeners = [TranscriptionTaskListener]
    seeders = [TranscriptionsSeeder]
    windows = TRANSCRIPTIONS_WINDOWS
