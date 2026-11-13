import re
from pathlib import Path

from engine.cli.errors.usage_error import UsageError
from engine.cli.line_parser import LineParser
from engine.journal.journal_home import JournalHome
from engine.module.module_finder import ModuleFinder
from engine.viewer.window_key import WindowKey
from tests.stories.core.support.fixtures import UserJoined

PLACEHOLDER = re.compile(r"\{[^}]*\}")
PLANTED = WindowKey("planted", "journal-exception list --no-such-flag")


def line_terms(line: str) -> list[str]:
    return [PLACEHOLDER.sub("1", word) for word in line.split()]


def full_line(key: WindowKey) -> str:
    flags = "".join(f" --{name} 1" for name in key.arguments) + "".join(f" --{name}" for name in key.switches)
    return f"{key.read}{flags}" + (f" --limit {key.page_size}" if key.page_size and "--limit" not in key.read else "")


def key_fails(parser: LineParser, key: WindowKey) -> bool:
    argv = line_terms(full_line(key))
    try:
        _, command_parser = parser.parser(argv)
    except UsageError:
        return True
    recognized = set(command_parser._option_string_actions)
    return any(word.startswith("--") and word not in recognized for word in argv[2:])


def read_fails(parser: LineParser, line: str) -> bool:
    try:
        parser.parser(line_terms(line)[:2])
    except UsageError:
        return True
    return False


def declared() -> tuple[list[tuple[str, WindowKey]], list[tuple[str, str]]]:
    keys, reads = [], []
    for module in ModuleFinder(JournalHome(Path("/nonexistent-journal"))).default_modules():
        for window in module.windows:
            keys += [(window.name, key) for key in window.keys]
            reads += [(window.name, read) for read in (*window.reads, *(tab.read for tab in window.tabs)) if read]
        for extension in module.window_extensions:
            keys += [(extension.window, key) for key in extension.keys]
            reads += [(extension.window, read) for read in extension.reads]
    return keys, reads


def test_every_read_line_a_window_declares_parses_and_a_removed_flag_fails_the_check(new_story):
    story = new_story(fixture=UserJoined)
    parser = story.container.get(LineParser)
    keys, reads = declared()
    broken = [f"{window}: {full_line(key)}" for window, key in keys if key_fails(parser, key)] + [f"{window}: {line}" for window, line in reads if read_fails(parser, line)]
    story.expect_rows(broken == [], detail="\n".join(broken))
    story.expect_rows(key_fails(parser, PLANTED), detail="a planted key with an unknown flag was accepted")
