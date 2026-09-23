from features.hosting.apps import address
from features.hosting.files import HOSTING, hosting_of
from features.organization.files import FOLDER
from features.parts import Command, Context


class HostApp(Command):
    name = "host"

    def run(self, context: Context, tickets, n: int):
        if not hosting_of(context.record.root.parent):
            tickets._refuse(f"the project names no app to host: add {FOLDER}/{HOSTING} with run, ready and idle_minutes")
        ticket = tickets.bind(int(n))
        return tickets.update(ticket.n, hosted=True, idle_since=0.0)


class StopApp(Command):
    name = "unhost"

    def run(self, context: Context, tickets, n: int):
        return tickets.update(int(n), hosted=False)


class ShowApp(Command):
    name = "app"

    def run(self, context: Context, tickets, n: int):
        return address(context.record.root, tickets.load(int(n)))
