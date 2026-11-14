from engine.viewer.window_key import WindowKey


class QuestionsKey(WindowKey):
    """The questions data of the questions.questions window."""

    name = "questions"
    read = "question list --all"
    tab = "list"
    events = ["question.*"]
