from features.base import FeatureDetails


class CommitsDetails(FeatureDetails):
    name = "commits"

    title = "Closing rows from commits"

    abstract = "A commit whose message carries Journal: todos done <n> closes that row"

    help = "The trailer starts at column 0; prose and indented examples close nothing."
