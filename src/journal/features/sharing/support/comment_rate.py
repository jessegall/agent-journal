from journal.features.sharing.support.recent_counts import RecentCounts


class CommentRate(RecentCounts):
    """Visitors' comments counted per link, so a link cannot fill the chat."""

    MAXIMUM_COUNT = 10
    WINDOW_SECONDS = 10 * 60
