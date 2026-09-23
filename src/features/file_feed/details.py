from features.base import FeatureDetails


class FileFeedDetails(FeatureDetails):
    name = "file_feed"
    has_skill = False

    title = "File feed"

    abstract = "The chat can show the agent's file edits as they land, one diff card per file"

    help = """
        The chat's strip switches between the chat, the file feed and the terminal. The file feed
        reads your edits from your session's transcript and shows each file you changed as a small
        diff, newest at the bottom. It shows edits only: no messages, commands or thinking.
    """
