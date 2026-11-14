from engine.viewer.window import Window
from core.modules.agents.support.skeletons import AGENTS_TRANSCRIPT_SKELETON
from engine.enums.auto_scroll import AutoScroll
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from core.modules.agents.windows.transcript.keys.transcript_key import TranscriptKey


class TranscriptWindow(Window):
    """The Transcript window."""

    name = "agents.transcript"
    title = "Transcript"
    entry = "transcript.js"
    loading = WindowLoading.COMPONENT
    skeleton = AGENTS_TRANSCRIPT_SKELETON
    icon = WindowIcon.DOCUMENT
    shows = WindowShows.SELECTED_AGENT
    auto_scroll = AutoScroll.BOTTOM
    reads = ["agent transcript", "hook-call feed"]
    runs = ["message send", "helper send"]
    events = ["hook_call.*"]
    keys = [TranscriptKey]
