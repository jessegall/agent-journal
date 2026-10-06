from features.base import FeatureDetails
from features.groups import Group


class FileFeedDetails(FeatureDetails):
    explains = 'The chat shows files as the agent edits them. You can open a file card to inspect the change.'
    name = "file_feed"
    group = Group.CHAT
    label = "Show file edits as they happen"
    has_skill = False

    title = "File edits"

    abstract = "The chat shows each file the agent edits as a card with the change."

    help = """
        The chat's strip switches between the chat, the file feed and the terminal. After every tool call
        that writes, the engine compares the project's files with how they stood before and raises file.edited
        for each one that changed, with its path, whether it was created, edited or deleted, the lines added
        and removed, and its git object before and after; any feature or plugin can listen to it. The file
        feed keeps the last 500 and shows each as a small diff, newest at the bottom, whatever made the change:
        an edit tool, a shell command, a subagent or an editor. It shows edits only: no messages, commands or
        thinking.
    """
