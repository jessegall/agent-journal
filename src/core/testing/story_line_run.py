from collections.abc import Callable
from typing import TextIO

from core.base.caller.caller import Caller
from core.base.cli.line_run import LineRun
from core.base.container import Container
from core.base.database.database import Database
from core.base.deadline import Deadline
from core.base.timing import Timing
from core.base.database.repeated_work import OPEN_REQUEST, RepeatedWork


class StoryLineRun(LineRun):
    """Checks repeated work in each viewer command run by an in-process story server."""

    def run_as(self, argv: list[str], checked_caller: Callable[[Container], Caller], stream: TextIO) -> int:
        with RepeatedWork().request():
            return super().run_as(argv, checked_caller, stream)

    def synced(self, deadline: Deadline | None, timing: Timing | None) -> Container:
        container = super().synced(deadline, timing)
        request = OPEN_REQUEST.get()
        if request is None:
            request = RepeatedWork(container.get(Database))
        request.database = container.get(Database)
        request.add(request.database.repeated_work.points())
        request.database.repeated_work = request
        return container
