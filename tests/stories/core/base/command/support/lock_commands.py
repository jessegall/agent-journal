from argparse import ArgumentParser, Namespace
from dataclasses import dataclass
from typing import ClassVar

from engine.caller.caller import Caller
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.module.module import Module
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.pins.models.pin import Pin


@dataclass(frozen=True)
class WritePins(Command[Pin]):
    first: str
    second: str


@dataclass(frozen=True)
class WriteUnlockedPins(WritePins):
    lock = False


class WritePinsHandler(Handler[WritePins, Pin]):
    command = WritePins

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: WritePins, context: Context) -> Pin:
        self.repository.save(Pin(title=command.first, creator_id=context.actor.id, link="https://example.com"), context)
        return self.repository.save(Pin(title=command.second, creator_id=context.actor.id, link="https://example.com"), context)


@dataclass(frozen=True)
class WriteNestedPins(Command[Pin]):
    child: ClassVar[type[WritePins]] = WriteUnlockedPins


@dataclass(frozen=True)
class WriteUnlockedNestedPins(WriteNestedPins):
    lock = False
    child = WritePins


class WriteNestedPinsHandler(Handler[WriteNestedPins, Pin]):
    command = WriteNestedPins

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: WriteNestedPins, context: Context) -> Pin:
        return self.bus.dispatch(command.child("First pin", "Second pin"), context)


@dataclass(frozen=True)
class ReadUnlockedPins(Command[int]):
    lock = False


class ReadUnlockedPinsHandler(Handler[ReadUnlockedPins, int]):
    command = ReadUnlockedPins

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def handle(self, command: ReadUnlockedPins, context: Context) -> int:
        return self.queries.query(Pin).count()


class WritePinsSubcommand(Subcommand[WritePins, Pin]):
    cli_name = "lock-sample"
    name = "write"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> WritePins:
        return WritePins("First pin", "Second pin")

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Pin):
            output.line(value.title)


class WriteUnlockedPinsSubcommand(WritePinsSubcommand):
    name = "write-unlocked"

    def command(self, arguments: Namespace, caller: Caller) -> WritePins:
        return WriteUnlockedPins("First pin", "Second pin")


class WriteNestedPinsSubcommand(WritePinsSubcommand):
    name = "write-nested"

    def command(self, arguments: Namespace, caller: Caller) -> WriteNestedPins:
        return WriteNestedPins()


class WriteUnlockedNestedPinsSubcommand(WritePinsSubcommand):
    name = "write-unlocked-nested"

    def command(self, arguments: Namespace, caller: Caller) -> WriteNestedPins:
        return WriteUnlockedNestedPins()


class ReadUnlockedPinsSubcommand(Subcommand[ReadUnlockedPins, int]):
    cli_name = "lock-sample"
    name = "read"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> ReadUnlockedPins:
        return ReadUnlockedPins()

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))


class LockCommandsModule(Module):
    name = "sample.lock-commands"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.pins"]
    handlers = [WritePinsHandler, WriteNestedPinsHandler, ReadUnlockedPinsHandler]
    subcommands = [WritePinsSubcommand, WriteUnlockedPinsSubcommand, WriteNestedPinsSubcommand, WriteUnlockedNestedPinsSubcommand, ReadUnlockedPinsSubcommand]
