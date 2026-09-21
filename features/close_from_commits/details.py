from features.base import FeatureDetails


class CommitsDetails(FeatureDetails):
    name = "close_from_commits"

    title = "Close to-dos from commits"

    aliases = ("commits",)

    abstract = "A commit whose message carries Journal: todos done <n> closes that row"

    help = "The trailer starts at column 0; prose and indented examples close nothing."
