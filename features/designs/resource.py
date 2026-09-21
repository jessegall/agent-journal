from typing import ClassVar

from resources.base import DOCUMENT, LAZY, PROJECT, Resource
from resources.shapes import Field, Shape


class Design(Shape, Resource):
    loading = LAZY
    type = "design"
    event_labels = {"created": "Design started", "updated": "Design revised", "completed": "Design settled"}
    status_labels = {"complete": "settling", "section": "revising", "update": "revising", "cut": "revising", "keep": "keeping"}
    revisions: ClassVar[Field] = Field(default=list)
    open_until: ClassVar[Field] = Field(default=0)
    needs_attention = True
    icon = "revisions"
    command_names = {"complete": "settle"}
    scope = PROJECT
    title_ = "Design"
    abstract_ = "A document rewritten in place: every edit is a new revision, and every revision stays readable"
    help_ = ("A design always reads as it stands now. Its latest revision stays open while it is worked on: edits change it in place. "
             "It is kept when the user keeps it in the viewer or journal design keep <n> runs, or by itself after 30 minutes without an edit; "
             "the next edit opens a new revision copied from the kept one. journal design section <n> \"<part>\" \"<body>\" writes or rewrites a part, "
             "journal design cut <n> \"<part>\" removes one, journal design update <n> --title/--abstract/--brief rewords the top, "
             "journal design revisions <n> lists them and journal design revision <n> <k> shows one.")
    view = DOCUMENT
