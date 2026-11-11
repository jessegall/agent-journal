from engine.event.file_publishing import FilePublishing
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.profiles.support.profile_folder_move import ProfileFolderMove


class ProfilePublishListener(CommitListener[FilePublishing]):
    """Copies personal native profiles before publishing the module profiles needed by native agents."""

    name = "profiles.publish"

    def __init__(self, move: ProfileFolderMove) -> None:
        self.move = move

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.move.publish()
