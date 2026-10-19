from journal.features.dumps.filing import Filing
from journal.http.request import Request
from journal.http.v3.action_body import ActionBody
from journal.http.v3.attachments import Attachments
from journal.models.actor import Actor
from journal.models.dump import Dump
from journal.repositories.dumps import Dumps


class DumpActions:
    """What the viewer does to a dump: drop one, add files to it, answer its question, pick or decline its next steps, name it, stop or remove it."""

    def __init__(self, filing: Filing, dumps: Dumps, attachments: Attachments) -> None:
        self.filing, self.dumps, self.attachments = filing, dumps, attachments

    def create(self, body: ActionBody, by: Actor) -> Dump:
        return self.filing.create(body.brief, by)

    def upload(self, n: int, request: Request) -> Dump:
        """The files a request carried, stored beside the dump and named on it."""
        self.dumps.find(n)
        for name, data in request.files.items():
            self.filing.attach(n, self.attachments.store("dump", n, name, data), request.actor)
        return self.dumps.find(n)

    def read(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.dumps.find(n)

    def choose(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.choose(n, body.pick, by)

    def decline(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.decline(n, body.pick, by)

    def direct(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.direct(n, body.how, by)

    def answer(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.answer(n, body.text, by)

    def name(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.name(n, body.title, by)

    def dismiss(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.dismiss(n, by)

    def stop(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.stop(n, by)

    def remove(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.remove(n, by)

    def reopen(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.reopen(n, by)

    def split(self, n: int, body: ActionBody, by: Actor) -> Dump:
        return self.filing.split(n, body.value, by)
