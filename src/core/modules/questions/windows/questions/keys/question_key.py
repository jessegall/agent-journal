from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class QuestionKey(WindowKey):
    """The question.* data of the questions.questions window."""

    name = "question.*"
    read = "question show {id}"
    events = ["question.*"]
    loading = KeyLoading.REQUESTED
