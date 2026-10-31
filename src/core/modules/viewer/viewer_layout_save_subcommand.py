from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.viewer_layout import ViewerLayout
from core.modules.viewer.viewer_layout_save import ViewerLayoutSave


class ViewerLayoutSaveSubcommand(Subcommand[ViewerLayoutSave, ViewerLayout]):
    """`journal viewer-layout save --suite <suite> --page <page> [--driver <driver>] --layout <json>`: the caller's
    layout of a page."""

    cli_name = "viewer-layout"
    name = "save"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--suite", required=True)
        parser.add_argument("--page", required=True)
        parser.add_argument("--driver", default="")
        parser.add_argument("--layout", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> ViewerLayoutSave:
        return ViewerLayoutSave(arguments.suite, arguments.page, arguments.driver, arguments.layout)
