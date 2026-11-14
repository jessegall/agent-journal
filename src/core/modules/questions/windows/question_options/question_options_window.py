from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class QuestionOptionsWindow(Window):
    """The Answers offered window."""

    name = "questions.question-options"
    title = "Answers offered"
    entry = "question-options.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.QUESTION
    skeleton = [SkeletonPart.line()]
    reads = ["question show"]
    runs = ["question answer"]
    events = ["question.*"]
