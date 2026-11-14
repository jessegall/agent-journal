from engine.viewer.window import Window
from core.modules.transcriptions.support.skeletons import TRANSCRIPTIONS_TRANSCRIPTIONS_SKELETON
from core.modules.transcriptions.support.transcription_searcher import TranscriptionSearcher
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_search import WindowSearch
from core.modules.transcriptions.windows.transcriptions.keys.transcriptions_key import TranscriptionsKey
from core.modules.transcriptions.windows.transcriptions.keys.sources_key import SourcesKey
from core.modules.transcriptions.windows.transcriptions.keys.links_key import LinksKey


class TranscriptionsWindow(Window):
    """The Transcriptions window."""

    name = "transcriptions.transcriptions"
    title = "Transcriptions"
    entry = "transcriptions.js"
    loading = WindowLoading.COMPONENT
    skeleton = TRANSCRIPTIONS_TRANSCRIPTIONS_SKELETON
    search = WindowSearch(TranscriptionSearcher, "Search the transcriptions")
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.FILED
    reads = ["transcription list", "transcription sources", "link list"]
    runs = ["transcription make", "transcription edit", "transcription fetch"]
    events = ["transcription.*"]
    keys = [TranscriptionsKey, SourcesKey, LinksKey]
