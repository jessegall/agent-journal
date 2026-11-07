import json
import os
import subprocess
from pathlib import Path
from uuid import uuid4

import pytest

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.providers import Providers
from core.base.provider.session_start import SessionStart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_4

pytestmark = pytest.mark.real_program

BRIEF = "Answer with the single word ok and do nothing else."
TIME_LIMIT_SECONDS = 180


def launched(new_story, tmp_path: Path, program: str) -> tuple[str, str, subprocess.CompletedProcess[str]]:
    provider = new_story(fixture=BuilderStarted).container.get(Providers).provider(program)
    model, session = provider.models[0].name, str(uuid4())
    launch = HelperLaunch(root=tmp_path, folder=tmp_path, model=model, launch="", session=SessionStart(session), variables={}, brief=BRIEF)
    command = provider.helper_command(launch)
    return model, session, subprocess.run(command.arguments, cwd=tmp_path, env={**os.environ, **command.variables}, capture_output=True, text=True, timeout=TIME_LIMIT_SECONDS, check=True)


def transcript_models(path: Path) -> set[str]:
    return {line.split('"model":"', 1)[1].split('"', 1)[0] for line in path.read_text().splitlines() if '"model":"' in line}


def test_a_real_claude_code_runs_on_the_cheapest_model_it_was_given(new_story, tmp_path):
    model, session, _ = launched(new_story, tmp_path, "claude")
    transcripts = list((Path.home() / ".claude" / "projects").rglob(f"{session}.jsonl"))
    expect_value_4(transcripts)
    expect_transcript_models(transcripts[0], model)


def test_a_real_codex_runs_on_the_cheapest_model_it_was_given(new_story, tmp_path):
    model, _, finished = launched(new_story, tmp_path, "codex")
    thread = next(json.loads(line)["thread_id"] for line in finished.stdout.splitlines() if '"thread_id"' in line)
    transcripts = list((Path.home() / ".codex" / "sessions").rglob(f"*{thread}.jsonl"))
    expect_value_4(transcripts)
    expect_transcripts_with(transcripts, model)


def expect_transcript_models(path: Path, expected) -> None:
    actual = transcript_models(path)
    assert expected in actual, actual


def expect_transcripts_with(transcripts, expected) -> None:
    actual = transcripts[0].read_text()
    assert expected in actual, actual
