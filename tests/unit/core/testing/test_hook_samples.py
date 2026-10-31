from core.base.driver.command_category import CommandCategory
import json
import os
from pathlib import Path

import pytest

from core.base.driver.hook_event import HookEvent
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart

SCHEMA_EXAMPLES = Path(__file__).resolve().parents[4] / "tools" / "journal-hook" / "event" / "testdata" / "schema"
FREEZE_VARIABLE = "HOOK_SAMPLES_FREEZE"
SAMPLES = {
    "stop": HookSamples.stop(),
    "prompt": HookSamples.prompt("go on"),
    "session_start": HookSamples.session_start(),
    "edit": HookSamples.edit("src/cart.py", 3, 1),
    "shell": HookSamples.shell("git status && journal task show 1", ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"], subcommand="status"),
                               ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"])),
    "subagent": HookSamples.subagent(),
}


@pytest.mark.parametrize("name", sorted(SAMPLES))
def test_each_sample_is_kept_beside_the_go_examples_so_the_schema_test_there_checks_it(name):
    path = SCHEMA_EXAMPLES / f"story_{name}.json"
    if os.environ.get(FREEZE_VARIABLE):
        path.write_text(json.dumps(dict(SAMPLES[name].body), indent=2) + "\n")
    assert json.loads(path.read_text()) == SAMPLES[name].body, f"rewrite the kept samples with {FREEZE_VARIABLE}=1, then run go test ./tools/journal-hook/event"


@pytest.mark.parametrize("name", sorted(SAMPLES))
def test_each_sample_reads_as_a_hook_event(name):
    assert HookEvent.parsed(SAMPLES[name].body).event == SAMPLES[name].body["event"]
