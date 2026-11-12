from pathlib import Path
from types import SimpleNamespace

from engine.errors.run_time_limit_error import RunTimeLimitError
from suites.coding.support.project_git import ProjectGit


class TimedOutExecutor:
    def execute(self, request):
        raise RunTimeLimitError.passed(" ".join(request.line), request.limit_seconds)


class OneEnvironment:
    def query(self, model):
        return self

    def find(self, environment_id):
        return SimpleNamespace(folder=str(Path.cwd()))


def test_a_git_read_past_its_limit_gives_no_output():
    git = ProjectGit(OneEnvironment(), SimpleNamespace(environment_id=1), TimedOutExecutor())
    assert git.output("git", "status") is None
