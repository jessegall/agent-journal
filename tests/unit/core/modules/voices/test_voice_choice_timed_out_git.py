from pathlib import Path
from types import SimpleNamespace

from engine.errors.run_time_limit_error import RunTimeLimitError
from core.modules.voices.support.voice_choice import VoiceChoice


class TimedOutExecutor:
    def execute(self, request):
        raise RunTimeLimitError.passed(" ".join(request.line), request.limit_seconds)


def test_a_git_name_read_past_its_limit_gives_no_first_name():
    choice = VoiceChoice(SimpleNamespace(), SimpleNamespace(project_folder=Path.cwd()), TimedOutExecutor())
    assert choice.git_first_name() == ""
