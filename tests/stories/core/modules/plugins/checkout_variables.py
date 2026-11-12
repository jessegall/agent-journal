import shlex

from tests.stories.core.modules.plugins.hooks import LISTING_SAMPLE
from tests.stories.core.modules.plugins.support.checkout_stories import FILE_EDITED, checkout_story, real
from tests.stories.core.modules.plugins.support.event_stories import plugin_data
from tests.stories.core.modules.plugins.support.runner_binaries import recording_runner_at
from tests.stories.core.support.scanned_edits import scanned_edit

ENV_SCRIPT = 'echo "$JOURNAL_CHECKOUT_ROOT $JOURNAL_PROJECT_ROOT" > "$JOURNAL_PLUGIN_DATA/roots.txt"'
ROOTS_LINE = 'echo "$JOURNAL_CHECKOUT_ROOT $JOURNAL_PROJECT_ROOT" > roots.txt'


def test_a_shell_line_a_plugin_hook_and_a_plugin_run_of_a_worker_each_see_the_roots_of_its_checkout_and_project(new_story):
    story = checkout_story(new_story, scripts={"roots.sh": ENV_SCRIPT}, program="roots.sh", hears=[FILE_EDITED])
    roots = f"{real(story.worktree)} {real(story.repository.folder)}"
    variables = shlex.split(str(story.hook(story.worker_session, LISTING_SAMPLE).updated_input["command"]))
    scanned_edit(story, story.worker_session, "src/order.py", folder=story.worktree)
    story.run_listeners()
    recording_runner_at(story.home)
    story.expect_success(f"plugin run --agent {story.worker.id} -- sh -c {shlex.quote(ROOTS_LINE)}", actor=story.user)
    story.expect_rows(f"JOURNAL_CHECKOUT_ROOT={real(story.worktree)}" in variables, f"JOURNAL_PROJECT_ROOT={real(story.repository.folder)}" in variables, detail=str(variables))
    story.expect_rows(plugin_data(story, "roots.txt").read_text().strip() == roots, detail=plugin_data(story, "roots.txt").read_text())
    story.expect_rows((story.worktree / "roots.txt").read_text().strip() == roots, detail=(story.worktree / "roots.txt").read_text())
