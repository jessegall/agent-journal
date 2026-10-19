from journal.features.checks.support.check_runner import CheckRunner
from journal.http.controllers.controller import Controller
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.check import Check
from journal.repositories.checks import Checks


class CheckController(Controller[Check]):
    """Checks the journal runs, with their last run; one is run now from here, and its command and how often it runs are changed by an update."""

    def __init__(self, checks: Checks, runner: CheckRunner) -> None:
        self.repository, self.runner = checks, runner

    def run(self, request: Request) -> Response:
        return Response.json(self.runner.start(self.repository.find(request.number("id")), request.actor))
