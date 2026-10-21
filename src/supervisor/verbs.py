from typing import TYPE_CHECKING

import os
import traceback
from pathlib import Path

from supervisor.inbox import PROTOCOL
from supervisor.reply import Reply
from supervisor.request import Request
from supervisor.service import Service

if TYPE_CHECKING:
    from supervisor.supervisor import Supervisor

VERBS = ("hello", "start", "stop", "restart", "list", "keys", "type", "send", "band")


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
        except Exception as fault:
            self.supervisor.noted(traceback.format_exc())
            return Reply.refused(f"{request.verb} failed in the supervisor, which carries on: {fault}")

    def hello(self, request: Request) -> Reply:
        return Reply.success(protocol=PROTOCOL, verbs=list(VERBS))

    def start(self, request: Request) -> Reply:
        request.needs("name", "command")
        existing = self.supervisor.services.runs(request.name)
        inherited = os.environ if request.inherit else {}
        self.supervisor.services.add(Service(request.name, list(request.command), Path(request.folder), {**inherited, **request.environ}, Path(request.log), request.persistent))
        return Reply.success(started=not existing)

    def list(self, request: Request) -> Reply:
        return Reply.success(processes=self.supervisor.described())

    def keys(self, request: Request) -> Reply:
        self.supervisor.find_terminal(request.needs("name", "keys").name).write(request.keys.encode())
        return Reply.success()

    def type(self, request: Request) -> Reply:
        self.supervisor.find_terminal(request.needs("name", "line").name).type(request.line, request.delay_seconds)
        return Reply.success()

    def send(self, request: Request) -> Reply:
        self.supervisor.send(request.needs("name", "data").name, request.data.encode())
        return Reply.success()

    def band(self, request: Request) -> Reply:
        request.needs("left", "middle", "right")
        self.supervisor.display_band(request.labels)
        return Reply.success()

    def restart(self, request: Request) -> Reply:
        self.supervisor.restart(request.needs("name").name, request.resume)
        return Reply.success()

    def stop(self, request: Request) -> Reply:
        self.supervisor.stop_service(request.needs("name").name)
        return Reply.success()
