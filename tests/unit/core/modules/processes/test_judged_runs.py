from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.enums.command_category import CommandCategory
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.judged_runs import JudgedRuns

STARTED = Timestamp(datetime(2026, 11, 11, 12, 0, tzinfo=timezone.utc))
BUILD_RUN = Process(id=1, version=1, session_agent_id=7, creator_id=7, line="make build", folder="/work", shell="zsh",
                    category=CommandCategory.BUILD, limit_seconds=30, started_at=STARTED)


def part(text: str, category: CommandCategory) -> ProcessPart:
    return ProcessPart(id=1, version=1, process_id=1, position=1, text=text, program=text.split()[0], category=category)


@pytest.mark.parametrize("process, parts, judged", [
    (BUILD_RUN, [part("make build", CommandCategory.BUILD)], True),
    (BUILD_RUN, [part("pytest -q", CommandCategory.TEST_RUN)], True),
    (BUILD_RUN, [part("python3 deploy.py", CommandCategory.READ)], True),
    (replace(BUILD_RUN, queued_at=STARTED), [part("make build", CommandCategory.BUILD)], False),
    (replace(BUILD_RUN, started_at=None), [part("make build", CommandCategory.BUILD)], False),
    (replace(BUILD_RUN, plugin="sample"), [part("make build", CommandCategory.BUILD)], False),
    (replace(BUILD_RUN, creator_id=3), [part("make build", CommandCategory.BUILD)], False),
    (BUILD_RUN, [part("grep -rn cart src", CommandCategory.SEARCH)], False),
    (BUILD_RUN, [part("cat notes", CommandCategory.READ)], False),
    (BUILD_RUN, [part("sed -i s/a/b/ notes", CommandCategory.EDIT)], False),
    (BUILD_RUN, [part("journal task list", CommandCategory.JOURNAL)], False),
], ids=["build", "test run", "python program", "queued", "not started", "plugin run", "started by a person", "search", "read", "edit", "journal"])
def test_which_runs_are_judged(process, parts, judged):
    assert JudgedRuns.is_judged(process, parts) is judged
