from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.setting_requests.commands.request_setting.request_setting import RequestSetting
from core.modules.setting_requests.models.setting_request import SettingRequest


class RequestSettingSubcommand(Subcommand[RequestSetting, SettingRequest]):
    """`journal setting request <key> <value> --reason "<why>" [--project]`: asks a person to change a setting only
    a person may change."""

    cli_name = "setting"
    name = "request"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("value")
        parser.add_argument("--reason", required=True)
        parser.add_argument("--project", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> RequestSetting:
        return RequestSetting(arguments.key, arguments.value, arguments.reason, arguments.project)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SettingRequest):
            output.write(f"question {value.question_id} waits for the user's answer", {"question_id": value.question_id, "id": value.id})
