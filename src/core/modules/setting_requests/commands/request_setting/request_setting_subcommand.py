from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.setting_requests.commands.request_setting.request_setting import RequestSetting
from core.modules.approvals.models.approval_request import ApprovalRequest


class RequestSettingSubcommand(Subcommand[RequestSetting, ApprovalRequest]):
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
        if isinstance(value, ApprovalRequest):
            output.write(f"A person was asked in the dock: approval {value.id}", {"approval_id": value.id, "id": value.id})
