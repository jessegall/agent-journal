from argparse import ArgumentParser, Namespace
from dataclasses import dataclass
from enum import StrEnum

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.command.command import Command
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.subcommand.subcommand import Subcommand
from core.modules.chat.models.chat_mark import ChatMark
from engine.chat.mark_button import MarkButton
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.module.module import Module
from core.testing.story import Story

SAMPLE = "tests.stories.core.modules.chat.support.mark_samples:ChatSampleModule"
FAMILY = MarkFamily("sample", "Samples", "words", MarkGroup.WORK)


class SampleMarkType(StrEnum):
    EVENT_TYPE = "chatsample.moment"
    PROCESS = "chatsample.process"
    UNKNOWN_TYPE = "chatsample.ghost"


class SampleMarkVariant(StrEnum):
    PLAIN = "plain"


class ChatSampleModule(Module):
    """A sample module the journal does not ship: a moment mark with a button and a process mark; its ghost
    type is declared by none."""

    name = "chatsample"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.chat", "journal.core.tasks", "journal.core.memories", "journal.core.viewer"]
    marks = [MarkDeclaration(SampleMarkType.EVENT_TYPE, SampleMarkVariant, FAMILY, "Sample moment", "words", buttons=[MarkButton("words", "Edit", "task edit {row_id}")]),
             MarkDeclaration(SampleMarkType.PROCESS, SampleMarkVariant, FAMILY, "Sample process", "words", process=True)]


def module_actor(story: Story, name: str) -> Actor:
    row = story.container.get(Database).rows(Statement("SELECT id FROM actors WHERE type = 'module' AND name = ?", [name]))[0]
    return Actor(row["id"], ActorType.MODULE)


def mark_count(story: Story) -> int:
    return story.container.get(Database).rows(Statement("SELECT count(*) FROM chat_marks"))[0][0]


class StrangeVariant(StrEnum):
    UNKNOWN = "strange"


def marks_text(story: Story) -> str:
    return story.run("chat-mark list --environment 1 --oldest").output_text


EXCEPTION_SAMPLE = "tests.stories.core.modules.chat.support.mark_samples:ExceptionSampleModule"


@dataclass(frozen=True)
class FailingCommand(Command[ChatMark]):
    """A sample command whose handler always fails."""


class FailingCommandHandler(Handler[FailingCommand, ChatMark]):
    """A sample handler that raises an error nobody expects."""

    command = FailingCommand

    def handle(self, command: FailingCommand, context: Context) -> ChatMark:
        raise RuntimeError("the sample command broke")


class FailingCommandSubcommand(Subcommand[FailingCommand, ChatMark]):
    """`journal chat-mark fail`: runs the failing sample command."""

    cli_name = "chat-mark"
    name = "fail"

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def command(self, arguments: Namespace, caller: Caller) -> FailingCommand:
        return FailingCommand()


class ExceptionSampleModule(Module):
    """A sample module with one command that fails."""

    name = "exceptionsample"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.chat"]
    handlers = [FailingCommandHandler]
    subcommands = [FailingCommandSubcommand]


def expect_marks_text(story: Story, expected) -> None:
    actual = marks_text(story)
    assert expected in actual, actual


def expect_absent_marks_text(story: Story, expected) -> None:
    actual = marks_text(story)
    assert expected not in actual, actual


def expect_mark_count(story: Story, expected) -> None:
    actual = mark_count(story)
    assert actual == expected, actual
