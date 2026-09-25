from features.base import FeatureDetails, Line


class UpdateReportsDetails(FeatureDetails):
    name = "update_reports"
    when = "the user asks for an update, a TLDR or what happened while they were away"
    keywords = ("update", "tldr", "recap")

    title = "Update reports"

    abstract = "When the user asks for an update, the agent writes a report of what happened since they last looked, shown in the chat as a card"

    help = """
        An update report sums up what happened since the user last opened one: what waits on them,
        what got done, what is under way, which plans moved, the commits, and what else changed.
        The sequence Writing an update starts by itself when the user asks for one.

        journal report changes lists those rows under need, done, doing, plans, commits and also.
        journal report recap "<one or two sentences>" writes the update with them, in that order;
        its sentence is the first thing the user reads, so say what got done, what is under way and
        what waits on them. Then journal report note <n> <ref> "<line>" gives a row a short note,
        journal report item <n> <section> <ref> "<title>" adds one the list missed, and journal
        report drop <n> <ref> takes out noise. Answer in one short line that the update is pinned at
        the bottom of the chat, without the report's reference: the pinned card is how it is opened.

        You may also write one on your own when a meaningful piece of work has landed, such as a
        feature finished or a release out, so the user can catch up without asking; it is pinned at
        the bottom of the chat. After a commit you are reminded of this at most once an hour, and
        never while an update the user has not read is still waiting.
    """

    lines = [
        Line(
            name="offer",
            title="you committed work - if a meaningful piece landed, write an update",
            brief="""
                journal report changes, then journal report recap "<one or two sentences>"; it is
                pinned at the bottom of the chat. Skip it when the work is small.
            """,
        ),
    ]
