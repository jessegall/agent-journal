import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.rules.silent_run_rule import SilentRunRule
from core.base.driver.nudge_declaration import LONGEST_FIELD_CHARACTERS
from core.modules.processes.support.streaming_hints import GENERAL_HINT, STREAMING_HINTS, StreamingHints


@pytest.mark.parametrize("command,part_of_hint", [
    ("npx vitest run", "--reporter=verbose"),
    ("npm test -- --watch=false | head", GENERAL_HINT),
    ("CI=1 go test ./...", "go test with -v"),
    ("./gradlew build", "--console=plain"),
    ("cargo test", "--no-capture"),
    ("vendor/bin/phpunit", "--testdox"),
    ("python3 -m pytest tests", "without -q"),
    ("python3 tools/deploy.py", "python3 -u"),
    ("npm run build", "read the script"),
    ("./deploy.sh staging", GENERAL_HINT),
])
def test_a_command_gets_the_hint_of_its_tool(command, part_of_hint):
    assert part_of_hint in StreamingHints.hint(command)


def test_every_hint_fits_a_nudge_field_whole():
    assert [hint for _, hint in STREAMING_HINTS if len(hint) > LONGEST_FIELD_CHARACTERS] == []
    assert len(GENERAL_HINT) <= LONGEST_FIELD_CHARACTERS


@pytest.mark.parametrize("category,program,is_watched", [
    (CommandCategory.TEST_RUN, "npx", True),
    (CommandCategory.BUILD, "./deploy.sh", True),
    (CommandCategory.PROCESS, "/usr/bin/python3", True),
    (CommandCategory.PROCESS, "node", False),
])
def test_tests_builds_and_python_are_watched_for_silence(category, program, is_watched):
    part = ProcessPart(id=1, version=1, process_id=1, position=1, text=program, program=program, category=category)
    assert SilentRunRule.is_watched(part) is is_watched
