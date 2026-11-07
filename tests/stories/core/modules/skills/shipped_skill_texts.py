import re
from pathlib import Path

from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_absent_value

SOURCE = Path(__file__).parents[5] / "src"
COMMAND_IN_TEXT = re.compile(r"`journal ([a-z-]+)(?: ([a-z-]+))?([^`]*)`")
FLAG = re.compile(r"(?<![\w-])--[a-z][a-z-]*")
COMMANDS_OF_THE_CLIENT = {("output", "monitor"), ("module", "sync")}


def commands_in_skill_files() -> set[tuple[str, str, tuple[str, ...]]]:
    commands = set()
    for path in SOURCE.rglob("skills/*/SKILL.md"):
        for group, subcommand, arguments in COMMAND_IN_TEXT.findall(path.read_text()):
            if (group, subcommand) not in COMMANDS_OF_THE_CLIENT:
                commands.add((group, subcommand, tuple(FLAG.findall(arguments))))
    return commands


def faults_of(story, group: str, subcommand: str, flags: tuple[str, ...]) -> list[str]:
    outcome = story.run(f"{group} {subcommand} --help".replace("  ", " "))
    if outcome.code != 0:
        return [f"journal {group} {subcommand}: {outcome.output_text.strip()[:120]}"]
    return [f"journal {group} {subcommand} has no {flag}" for flag in flags if flag not in outcome.output_text]


def test_every_command_and_flag_a_shipped_skill_names_exists(new_story):
    story = new_story(fixture=BuilderStarted)
    # The code-commandments plugin supplies this alias in an installed journal.
    story.expect_success('alias add sins "printf ok" --category check --agents', actor=story.user)
    commands = commands_in_skill_files()
    expect_commands_count_greater(commands, 50)
    faults = sorted(fault for group, subcommand, flags in commands for fault in faults_of(story, group, subcommand, flags))
    expect_absent_value(faults)


def expect_commands_count_greater(commands, expected) -> None:
    actual = len(commands)
    assert actual > expected, actual
