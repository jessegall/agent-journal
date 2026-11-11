from typing import ClassVar

from engine.listener.event_rows import EventRows
from engine.model.assignable import Assignable
from core.modules.assignments.errors.listener_subject_error import ListenerSubjectError


class SubjectListener:
    """What the listeners of assignments share: the assignable model whose rows a listener hears about, which
    each listener that is not itself a base must name, and the rows it reads them from."""

    subject: ClassVar[type[Assignable]]

    def __init_subclass__(cls, **options: object) -> None:
        super().__init_subclass__(**options)
        if SubjectListener not in cls.__bases__ and not hasattr(cls, "subject"):
            raise ListenerSubjectError(cls.__name__)

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows
