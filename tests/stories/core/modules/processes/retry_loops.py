import pytest

from tests.stories.core.modules.aliases.saved_commands import read_hook
from tests.stories.core.support.coding_fixtures import BuilderStarted

REFUSAL = "No retry loops"


@pytest.fixture
def hook(new_story):
    yield from read_hook(new_story(fixture=BuilderStarted), {})


@pytest.mark.parametrize("line", ["for i in 1 2 3; do git status && break; sleep 2; done",
                                  "for i in 1 2 3; do git status && break; python3 -c 'import time; time.sleep(2)'; done; git log -1",
                                  "until git status; do sleep 1; done"])
def test_a_line_that_retries_is_refused(hook, line):
    hook.expect_denied(line, REFUSAL)


def test_a_loop_over_files_runs(hook):
    hook.expect_allowed('for file in a b; do wc -l "$file"; done')
