from typing import ClassVar

from resources.base import DOCUMENT, LAZY, PROJECT, Resource
from resources.shapes import Field, Shape


class Design(Shape, Resource):
    loading = LAZY
    type = "design"
    event_labels = {"created": "Design started", "updated": "Design revised", "completed": "Design settled"}
    status_labels = {"complete": "settling", "section": "revising", "update": "revising", "cut": "revising"}
    revisions: ClassVar[Field] = Field(default=list)
    needs_attention = True
    icon = "revisions"
    command_names = {"complete": "settle"}
    scope = PROJECT
    title_ = "Design"
    abstract_ = "A document rewritten in place: every edit is a new revision, and every revision stays readable"
    help_ = ("A design always reads as it stands now. Every edit copies its latest revision and changes the copy, so the history is a row of revisions "
             "the viewer scrolls through, each showing what changed. journal design section <n> \"<part>\" \"<body>\" writes or rewrites a part, "
             "journal design cut <n> \"<part>\" removes one, journal design update <n> --title/--abstract/--brief rewords the top, "
             "journal design revisions <n> lists them and journal design revision <n> <k> shows one.")
    view = DOCUMENT
