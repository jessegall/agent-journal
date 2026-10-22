from journal.models.release_message import ReleaseMessage
from journal.features.updates.support.session_restart import SessionRestart

MESSAGES = {
    "4.6.0": "a worker's worktree can now be set up your project's way. `journal settings set workers.preparation_commands \"<commands, one per line>\"` runs commands in the project just before a worker's worktree is made, `workers.completion_commands` runs them inside it once it is made, and `journal settings set workers.worktree_step off` leaves the making to those commands; each is told JOURNAL_WORKTREE, JOURNAL_BRANCH, JOURNAL_PROJECT, JOURNAL_REPOSITORIES, JOURNAL_LIBRARIES and JOURNAL_COPIES. If this project already prepares its worktrees or environments its own way, such as make env, set it now with those settings, and tell the user what you set",
    "4.13.0": "a worker's worktree can be set up your project's way, and these settings may be new to this project. Before a worker's worktree is made, `journal settings set workers.preparation_commands \"<commands, one per line>\"` runs commands in the project; `workers.completion_commands` runs commands inside the worktree once it is made; `journal settings set workers.worktree_step off` leaves making the worktree to those commands. Each command gets JOURNAL_WORKTREE, JOURNAL_BRANCH, JOURNAL_PROJECT, JOURNAL_REPOSITORIES, JOURNAL_LIBRARIES and JOURNAL_COPIES. A worktree dispatch names its library folders: `--libraries <folders>` links the main checkout's, `--copies <folders>` gives the worker its own copy, such as composer's vendor, and `--no-libraries` gives none. If this project prepares its worktrees or environments its own way, such as make env, set these settings now and tell the user what you set",
}


class ReleaseTexts:
    """The messages releases carry for the agent, one place for all of them, and those an update crossed: every release after the version the journal ran before, up to the one it runs now, as rows not yet kept."""

    @staticmethod
    def crossed(previous: str, current: str) -> tuple[ReleaseMessage, ...]:
        if not previous:
            return ()
        low, high = SessionRestart.numbers(previous), SessionRestart.numbers(current)
        return tuple(ReleaseMessage(version=version, text=text) for version, text in sorted(MESSAGES.items(), key=lambda item: SessionRestart.numbers(item[0])) if low < SessionRestart.numbers(version) <= high)
