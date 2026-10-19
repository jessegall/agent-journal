from journal.features.sharing.recent_counts import RecentCounts


class SentComments(RecentCounts):
    """Visitors' comments counted per link, so a link cannot fill the chat."""

    MOST = 10
    WITHIN = 10 * 60
