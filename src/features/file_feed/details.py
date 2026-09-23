from features.base import FeatureDetails


class FileFeedDetails(FeatureDetails):
    name = "file_feed"
    has_skill = False

    title = "File feed"

    abstract = "The chat can show the agent's file edits as they land, one diff card per file"

    help = """
        The chat's strip switches between the chat, the file feed and the terminal. After every tool call
        that writes, the engine compares the project's files with how they stood before and raises file.edit
        for each one that changed, with its path, whether it was created, edited or deleted, the lines added
        and removed, and its git object before and after; any feature or plugin can listen to it. The file
        feed keeps the last 500 and shows each as a small diff, newest at the bottom, whatever made the change:
        an edit tool, a shell command, a subagent or an editor. It shows edits only: no messages, commands or
        thinking.
    """
