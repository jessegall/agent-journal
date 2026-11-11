import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.silent_runs import SilentRuns
from engine.driver.nudge_declaration import LONGEST_FIELD_CHARACTERS
from core.modules.processes.support.streaming_hints import GENERAL_HINT, STREAMING_HINTS, StreamingHints


@pytest.mark.parametrize("command,hint_part", [
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
def test_a_command_gets_the_hint_of_its_tool(command, hint_part):
    assert hint_part in StreamingHints.hint(command)


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
    assert SilentRuns.is_watched(part) is is_watched


@pytest.mark.parametrize("command,is_delayed", [
    ("go test ./...", True),
    ("CI=1 go test -v ./internal/a ./internal/b", True),
    ("go test ./internal/a", False),
    ("go test -p 1 ./...", False),
    ("go test -p=1 ./...", False),
    ("cd tools && go test ./... | tee out", True),
    ("npm test", False),
])
def test_go_test_over_several_packages_holds_back_the_output_of_each(command, is_delayed):
    assert StreamingHints.is_serial_packages_run(command) is is_delayed


def test_an_unknown_tool_gets_the_general_hint():
    assert StreamingHints.hint("frobnicate --all") == GENERAL_HINT


def test_the_text_of_a_command_never_comes_into_a_hint():
    command = "custom-tool {output}\nrm -rf /tmp/x"
    hint = StreamingHints.hint(command)
    assert "{output}" not in hint and "rm -rf" not in hint and "\n" not in hint
