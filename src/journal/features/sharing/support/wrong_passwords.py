from journal.features.sharing.support.recent_counts import RecentCounts


class WrongPasswords(RecentCounts):
    """Wrong passwords sent to links, counted per place they come from, so a link's password cannot be guessed without limit."""

    MAXIMUM_COUNT = 5
    WINDOW_SECONDS = 15 * 60
