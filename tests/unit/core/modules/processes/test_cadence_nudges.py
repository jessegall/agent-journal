import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.notice_kind import NoticeKind
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_nudges import CadenceNudges
from core.modules.processes.support.process_nudges import RUN_FROZEN, RUN_SPARSE, SILENT_RUN, SILENT_SAVED_PACKAGES, SILENT_SAVED_RUN, STALLED_RUN
from core.modules.processes.support.streaming_hints import StreamingHints

RUN = Process(id=9, version=1, session_agent_id=7, creator_id=7, line="pytest -q", folder="/work", shell="zsh", category=CommandCategory.TEST_RUN, limit_seconds=30)


def part(text: str, category: CommandCategory = CommandCategory.TEST_RUN) -> ProcessPart:
    return ProcessPart(id=1, version=1, process_id=9, position=1, text=text, program=text.split()[0], category=category)


@pytest.mark.parametrize("kind, declaration", [(NoticeKind.NO_OUTPUT, SILENT_RUN), (NoticeKind.STOPPED_WRITING, STALLED_RUN), (NoticeKind.SPARSE, RUN_SPARSE)])
def test_each_kind_has_its_declaration_with_the_output_the_seconds_and_the_tools_hint(kind, declaration):
    notice = CadenceNudges.notice(kind, RUN, part("pytest -q"), 30, 300)
    assert notice.declaration is declaration
    assert dict(notice.fields) == {"output": 9, "seconds": 30, "hint": StreamingHints.hint("pytest -q")}


def test_a_silent_saved_command_names_its_alias():
    notice = CadenceNudges.notice(NoticeKind.NO_OUTPUT, RUN, part("journal build-npm --tail 5", CommandCategory.BUILD), 30, 300)
    assert (notice.declaration, dict(notice.fields)) == (SILENT_SAVED_RUN, {"name": "build-npm", "seconds": 30})


def test_a_silent_saved_go_test_over_several_packages_gets_the_packages_text():
    saved = ProcessPart(id=1, version=1, process_id=9, position=1, text="journal go-tests --tail 5", program="journal", category=CommandCategory.TEST_RUN,
                        command="go test ./...")
    assert CadenceNudges.notice(NoticeKind.NO_OUTPUT, RUN, saved, 30, 300).declaration is SILENT_SAVED_PACKAGES


def test_the_stuck_warning_names_the_seconds_and_the_stop_limit():
    notice = CadenceNudges.notice(NoticeKind.FROZEN, RUN, part("pytest -q"), 150, 300)
    assert (notice.declaration, dict(notice.fields)) == (RUN_FROZEN, {"output": 9, "seconds": 150, "limit": 300})
