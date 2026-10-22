from journal.features.updates.support.release_message import ReleaseMessage
from journal.features.updates.support.session_restart import SessionRestart

MESSAGES = {
    "4.6.0": "a worker's worktree can now be set up your project's way. `journal settings set workers.preparation_commands \"<commands, one per line>\"` runs commands in the project just before a worker's worktree is made, `workers.completion_commands` runs them inside it once it is made, and `journal settings set workers.worktree_step off` leaves the making to those commands; each is told JOURNAL_WORKTREE, JOURNAL_BRANCH, JOURNAL_PROJECT, JOURNAL_REPOSITORIES, JOURNAL_LIBRARIES and JOURNAL_COPIES. If this project already prepares its worktrees or environments its own way, such as make env, set it now with those settings, and tell the user what you set",
}


class ReleaseMessages:
    """The messages releases carry for the agent, one place for all of them, and those an update crossed: every release after the version the journal ran before, up to the one it runs now."""

    @staticmethod
    def crossed(previous: str, current: str) -> tuple[ReleaseMessage, ...]:
        if not previous:
            return ()
        low, high = SessionRestart.numbers(previous), SessionRestart.numbers(current)
        return tuple(ReleaseMessage(version, text) for version, text in sorted(MESSAGES.items(), key=lambda item: SessionRestart.numbers(item[0])) if low < SessionRestart.numbers(version) <= high)
