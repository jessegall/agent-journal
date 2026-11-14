from engine.viewer.window import Window
from core.modules.questions.support.skeletons import QUESTIONS_WAITING_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.questions.windows.waiting.keys.waits_key import WaitsKey


class WaitingWindow(Window):
    """The Waiting window."""

    name = "questions.waiting"
    title = "Waiting"
    entry = "waiting.js"
    loading = WindowLoading.COMPONENT
    skeleton = QUESTIONS_WAITING_SKELETON
    icon = WindowIcon.HALT
    reads = ["wait waiting"]
    events = ["wait.*"]
    keys = [WaitsKey]
