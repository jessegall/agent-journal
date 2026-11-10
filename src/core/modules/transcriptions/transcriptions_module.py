from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from core.modules.transcriptions.support.transcription_searcher import TranscriptionSearcher
from engine.skill.skill_declaration import SkillDeclaration
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
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
from core.modules.transcriptions.support.skeletons import TRANSCRIPTIONS_TRANSCRIPTIONS_SKELETON


class TranscriptionsModule(Module):
    """Adds transcriptions: transcripts kept in the project, pasted or fetched, which an agent turns into summaries
    and other rows linked back to them, and the Transcriptions page."""

    name = "journal.core.transcriptions"
    move_reason = "version 4 had no transcriptions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.documents", "journal.core.mcp"]
    skills = [SkillDeclaration("journal-transcriptions", "Turn a transcript into summaries, notes, documents, tasks or plans linked back to it; read it when a transcription arrives or is edited",
                               keywords=("transcription", "transcriptions", "transcript"), commands=["transcription"], types=["main"])]
    models = [ModelDeclaration(Transcription)]
    migrations = [TranscriptionsTableMigration]
    handlers = [AddTranscriptionLinkHandler, RequestTranscriptionFetchHandler]
    subcommands = [AddTranscriptionLinkSubcommand, RequestTranscriptionFetchSubcommand, TranscriptionSourcesSubcommand]
    nudges = TRANSCRIPTION_NUDGES
    listeners = [TranscriptionTaskListener]
    seeders = [TranscriptionsSeeder]
    windows = [WindowDeclaration("transcriptions.transcriptions", "Transcriptions", "transcriptions.js", WindowLoading.COMPONENT, skeleton=TRANSCRIPTIONS_TRANSCRIPTIONS_SKELETON, search=WindowSearch(TranscriptionSearcher, "Search the transcriptions"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.FILED,
                                 reads=["transcription list", "transcription sources", "link list"], runs=["transcription make", "transcription edit", "transcription fetch"], events=["transcription.*"],
                                 keys=[WindowKey("transcriptions", "transcription list", events=["transcription.*"]),
                                       WindowKey("sources", "transcription sources"),
                                       WindowKey("links.*", "link list --row transcription:{id} --group-counterparts", arguments=["page", "page-size", "kind"], loading=KeyLoading.REQUESTED)])]
