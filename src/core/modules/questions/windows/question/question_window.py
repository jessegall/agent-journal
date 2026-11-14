from engine.viewer.window import Window
from core.modules.questions.support.skeletons import QUESTIONS_QUESTION_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.questions.windows.question.keys.question_key import QuestionKey


class QuestionWindow(Window):
    """The Question window."""

    name = "questions.question"
    title = "Question"
    entry = "question-card.js"
    loading = WindowLoading.COMPONENT
    skeleton = QUESTIONS_QUESTION_SKELETON
    place = WindowPlace.DROPDOWN
    icon = WindowIcon.QUESTION
    reads = ["question show"]
    runs = ["question answer", "question close", "message send"]
    events = ["question.*"]
    keys = [QuestionKey]
