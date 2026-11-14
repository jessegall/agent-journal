from engine.viewer.window import Window
from core.modules.questions.support.question_searcher import QuestionSearcher
from core.modules.questions.support.skeletons import QUESTIONS_QUESTIONS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.questions.windows.questions.keys.questions_key import QuestionsKey
from core.modules.questions.windows.questions.keys.question_key import QuestionKey


class QuestionsWindow(Window):
    """The Questions window."""

    name = "questions.questions"
    title = "Questions"
    entry = "questions.js"
    loading = WindowLoading.COMPONENT
    skeleton = QUESTIONS_QUESTIONS_SKELETON
    icon = WindowIcon.QUESTION
    reads = ["question list", "question show"]
    runs = ["question answer", "question close", "message send"]
    events = ["question.*"]
    search = WindowSearch(QuestionSearcher, "Search the questions")
    keys = [QuestionsKey, QuestionKey]
