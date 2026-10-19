from typing import TYPE_CHECKING

import os
from pathlib import Path

from supervisor.inbox import PROTOCOL
from supervisor.reply import Reply
from supervisor.request import Request
from supervisor.service import Service

if TYPE_CHECKING:
    from supervisor.supervisor import Supervisor

VERBS = ("hello", "start", "stop", "restart", "list", "keys", "type", "send", "band")
"""The verbs this supervisor takes; a later protocol adds verbs and never changes one."""


class Verbs:
    """The protocol's verbs, each a method by its name: a request names one, with what it needs, and gets its answer."""

    def __init__(self, supervisor: "Supervisor") -> None:
        self.supervisor = supervisor

    def handle(self, request: Request) -> Reply:
        if request.verb not in VERBS:
            return Reply.refused(f"unknown verb {request.verb!r}: hello names the verbs this supervisor takes")
        try:
            return getattr(self, request.verb)(request)
        except LookupError as unknown:
            return Reply.refused(str(unknown))

    def hello(self, request: Request) -> Reply:
        return Reply.done(protocol=PROTOCOL, verbs=list(VERBS))

    def start(self, request: Request) -> Reply:
        """A service started under its name, with its command, folder, environment and log, and whether it is started again when it dies; one already running under the name is left as it is. With inherit false it gets the environment it is given and nothing of the supervisor's. One whose program cannot be run dies at once, as its log says."""
        request.needs("name", "command")
        was_running = self.supervisor.services.runs(request.name)
        inherited = os.environ if request.inherit else {}
        self.supervisor.services.add(Service(request.name, list(request.command), Path(request.folder), {**inherited, **request.env}, Path(request.log), request.keep))
        return Reply.done(started=not was_running)

    def list(self, request: Request) -> Reply:
        return Reply.done(processes=self.supervisor.described())

    def keys(self, request: Request) -> Reply:
        self.supervisor.terminal_named(request.needs("name", "keys").name).write(request.keys.encode())
        return Reply.done()

    def type(self, request: Request) -> Reply:
        self.supervisor.terminal_named(request.needs("name", "line").name).type(request.line, request.after)
        return Reply.done()

    def send(self, request: Request) -> Reply:
        """Text carried to a named process's input, as it is."""
        self.supervisor.send(request.needs("name", "data").name, request.data.encode())
        return Reply.done()

    def band(self, request: Request) -> Reply:
        """The words of the line at the top of the screen, left, middle and right."""
        request.needs("left", "middle", "right")
        self.supervisor.say(request.words)
        return Reply.done()

    def restart(self, request: Request) -> Reply:
        self.supervisor.restart(request.needs("name").name, request.resume)
        return Reply.done()

    def stop(self, request: Request) -> Reply:
        self.supervisor.stop_named(request.needs("name").name)
        return Reply.done()
