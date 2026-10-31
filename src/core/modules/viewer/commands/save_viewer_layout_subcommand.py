from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.models.viewer_layout import ViewerLayout
from core.modules.viewer.commands.save_viewer_layout import SaveViewerLayout


class SaveViewerLayoutSubcommand(Subcommand[SaveViewerLayout, ViewerLayout]):
    """`journal viewer-layout save --suite <suite> --page <page> [--driver <driver>] --layout <json>
    [--base-version <n>]`: the caller's layout of a page, refused over a newer version than the one named."""

    cli_name = "viewer-layout"
    name = "save"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--suite", required=True)
        parser.add_argument("--page", required=True)
        parser.add_argument("--driver", default="")
        parser.add_argument("--layout", required=True)
        parser.add_argument("--base-version", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> SaveViewerLayout:
        return SaveViewerLayout(arguments.suite, arguments.page, arguments.driver, arguments.layout, arguments.base_version)
