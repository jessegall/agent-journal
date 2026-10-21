from journal.features.sharing.support.recent_counts import RecentCounts


class SentComments(RecentCounts):
    """Visitors' comments counted per link, so a link cannot fill the chat."""

    LIMIT = 10
    WINDOW_SECONDS = 10 * 60
