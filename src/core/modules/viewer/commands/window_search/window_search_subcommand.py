from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.container.container import Container
from core.base.model.model import Model
from engine.row.page import Page
from engine.errors.refusal import Refusal
from engine.dotted_path.dotted_path import DottedPath
from core.base.registry.registry import Registry
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.window_searcher import WindowSearcher


class WindowSearchSubcommand(ReadSubcommand[Page[Model]]):
    """`journal window search <window> [<words>...]`: the rows the search the window declares finds for the words."""

    cli_name = "window"
    name = "search"

    def __init__(self, registry: Registry, container: Container) -> None:
        self.registry, self.container = registry, container

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("words", nargs="*")

    def read(self, arguments: Namespace, caller: Caller) -> Page[Model]:
        if not self.registry.has_window(arguments.window):
            raise Refusal(f"no installed module declares the window {arguments.window}", "journal window permissions lists the windows")
        searcher = self.registry.window(arguments.window).search.get("searcher")
        if not isinstance(searcher, str):
            raise Refusal(f"{arguments.window} declares no search", "a window declares one with search=WindowSearch(...) on its WindowDeclaration")
        return self.container.get(DottedPath(searcher).checked_class(WindowSearcher)).found(arguments.words)
