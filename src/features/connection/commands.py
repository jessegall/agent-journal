from dataclasses import asdict

from controllers.types import Environments
from engine.machines import this_machine
from features.connection.code import pull, push
from features.connection.linking import hand, join, leave, sync, view
from features.connection.transport import HttpTransport, Transport
from features.parts import Command, Context
from resources.base import Refused


def transport_for(address: str) -> Transport:
    return HttpTransport(address)


def server_of(context: Context, address: str = "") -> Transport:
    named = address or str(context.settings.address)
    if not named:
        raise Refused("name the server first: journal environment connect <address>, or its address in Settings")
    return transport_for(named)


class ConnectToServer(Command):
    name = "connect"

    def run(self, context: Context, environments: Environments, address: str = "") -> str:
        welcome = join(context.record, server_of(context, address))
        if address:
            context.record.change_setting("connection", {"address": address})
        return f"connected: this journal is {welcome.release.value} of the server's release, and its record must {welcome.comparison.step.value} before it syncs"


class HandEnvironment(Command):
    name = "hand"

    def run(self, context: Context, environments: Environments, env: str, to: str) -> str:
        lease = hand(context.record.root, env, to, server_of(context))
        return f"{env} is written by {'this machine' if to == 'here' else 'the server'} from epoch {lease.epoch}"


class SyncWithServer(Command):
    name = "sync"
    network = True

    def run(self, context: Context, environments: Environments) -> str:
        done = sync(context.record, server_of(context))
        return f"sent {done['sent']} writes that waited, took in {done['pulled']} events from the server"


class PushCode(Command):
    name = "code_push"
    network = True

    def run(self, context: Context, environments: Environments) -> str:
        done = push(context.record.root.resolve().parent, this_machine()[:12])
        return f"pushed {len(done.pushed)} repositories" + (f", skipped {', '.join(done.skipped)} (no git remote called hosted)" if done.skipped else "")


class PullCode(Command):
    name = "code_pull"
    network = True

    def run(self, context: Context, environments: Environments, name: str) -> str:
        written = pull(context.record.root.resolve().parent, name)
        return f"wrote {len(written)} files from {name}"


class ShowConnection(Command):
    name = "connection"

    def run(self, context: Context, environments: Environments) -> dict:
        return asdict(view(context.record, str(context.settings.address)))


class DisconnectFromServer(Command):
    name = "disconnect"

    def run(self, context: Context, environments: Environments) -> str:
        leave(context.record)
        return "disconnected: nothing more is sent to the server, and what it already has stays there"
