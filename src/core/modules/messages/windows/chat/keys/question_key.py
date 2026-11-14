from engine.viewer.window_key import WindowKey


class QuestionKey(WindowKey):
    """The question.* data of the messages.chat window."""

    name = "question.*"
    read = "question show {id}"
