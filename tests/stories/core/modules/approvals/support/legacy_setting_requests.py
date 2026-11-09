from argparse import ArgumentParser, Namespace
from dataclasses import dataclass

from core.base.caller.caller import Caller
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.module.module import Module
from core.base.repository.repository import Repository
from core.base.subcommand.subcommand import Subcommand
from core.modules.questions.commands.ask_question.ask_question import AskQuestion
from core.modules.setting_requests.commands.request_setting.request_setting_handler import APPROVE_OPTION, REFUSE_OPTION
from core.modules.setting_requests.models.setting_request import SettingRequest
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

SETTING = "journal.core.project-rules.agents-make-rules"
MODULE = "tests.stories.core.modules.approvals.support.legacy_setting_requests:LegacySettingRequestsModule"
UPGRADE = "tests.stories.core.modules.approvals.support.legacy_setting_requests:ApprovalUpgradeModule"


@dataclass(frozen=True)
class MakeLegacySettingRequest(Command[SettingRequest]):
    """Creates the setting question that older version 5 installations kept."""


class MakeLegacySettingRequestHandler(Handler[MakeLegacySettingRequest, SettingRequest]):
    command = MakeLegacySettingRequest

    def __init__(self, bus: Bus, repository: Repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, command: MakeLegacySettingRequest, context: Context) -> SettingRequest:
        asking = AskQuestion("Allow agents to make rules?", "The old request needs rules without individual approval.",
                             (APPROVE_OPTION, REFUSE_OPTION), APPROVE_OPTION)
        question = self.bus.dispatch(asking, context.nested(asking))
        return self.repository.save(SettingRequest(creator_id=context.actor.id, question_id=question.id,
                                                  key=SETTING, value="true", project=True), context)


class MakeLegacySettingRequestSubcommand(Subcommand[MakeLegacySettingRequest, SettingRequest]):
    cli_name = "legacy-setting-request"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> MakeLegacySettingRequest:
        return MakeLegacySettingRequest()


class LegacySettingRequestsModule(Module):
    name = "tests.legacy-setting-requests"
    requires_core = ">=5,<6"
    handlers = [MakeLegacySettingRequestHandler]
    subcommands = [MakeLegacySettingRequestSubcommand]


class ApprovalUpgradeModule(Module):
    name = "tests.approval-upgrade"
    requires_core = ">=5,<6"


class LegacySettingQuestion(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.expect_success("legacy-setting-request make --environment main", actor=story.agent)

    def expect(self, story):
        story.expect_text("question show 1", "state: open")
        story.expect_text("setting-request show 1", "value: true")
