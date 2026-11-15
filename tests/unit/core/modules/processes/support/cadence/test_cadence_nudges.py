import pytest

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.notice_type import NoticeType
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_nudges import CadenceNudges
from core.modules.processes.nudges.run_frozen_nudge import RunFrozenNudge
from core.modules.processes.nudges.run_sparse_nudge import RunSparseNudge
from core.modules.processes.nudges.silent_run_nudge import SilentRunNudge
from core.modules.processes.nudges.silent_saved_packages_nudge import SilentSavedPackagesNudge
from core.modules.processes.nudges.silent_saved_run_nudge import SilentSavedRunNudge
from core.modules.processes.nudges.stalled_run_nudge import StalledRunNudge
from core.modules.processes.support.streaming_hints import StreamingHints

RUN = Process(id=9, version=1, session_agent_id=7, creator_id=7, line="pytest -q", folder="/work", category=CommandCategory.TEST_RUN, limit_seconds=30)


def part(text: str, category: CommandCategory = CommandCategory.TEST_RUN) -> ProcessPart:
    return ProcessPart(id=1, version=1, process_id=9, position=1, text=text, program=text.split()[0], category=category)


@pytest.mark.parametrize("category, declaration", [(NoticeType.SILENT, SilentRunNudge.declared()), (NoticeType.STOPPED_WRITING, StalledRunNudge.declared()), (NoticeType.SPARSE, RunSparseNudge.declared())])
def test_each_kind_has_its_declaration_with_the_output_the_seconds_and_the_tools_hint(category, declaration):
    notice = CadenceNudges.notice(category, RUN, part("pytest -q"), 30, 300)
    assert notice.declaration is declaration
    assert dict(notice.fields) == {"output": 9, "seconds": 30, "hint": StreamingHints.hint("pytest -q")}


def test_a_silent_saved_command_names_its_alias():
    notice = CadenceNudges.notice(NoticeType.SILENT, RUN, part("journal build-npm --tail 5", CommandCategory.BUILD), 30, 300)
    assert (notice.declaration, dict(notice.fields)) == (SilentSavedRunNudge.declared(), {"name": "build-npm", "seconds": 30})


def test_a_silent_saved_go_test_over_several_packages_gets_the_packages_text():
    saved = ProcessPart(id=1, version=1, process_id=9, position=1, text="journal go-tests --tail 5", program="journal", category=CommandCategory.TEST_RUN,
                        command="go test ./...")
    assert CadenceNudges.notice(NoticeType.SILENT, RUN, saved, 30, 300).declaration is SilentSavedPackagesNudge.declared()


def test_the_stuck_warning_names_the_seconds_and_the_stop_limit():
    notice = CadenceNudges.notice(NoticeType.FROZEN, RUN, part("pytest -q"), 150, 300)
    assert (notice.declaration, dict(notice.fields)) == (RunFrozenNudge.declared(), {"output": 9, "seconds": 150, "limit": 300})
