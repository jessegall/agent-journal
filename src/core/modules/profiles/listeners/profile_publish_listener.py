from engine.change.file_publishing import FilePublishing
from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.profiles.support.profile_folder_move import ProfileFolderMove


class ProfilePublishListener(CommitListener[FilePublishing]):
    """Copies personal native profiles before publishing the module profiles needed by native agents."""

    name = "profiles.publish"

    def __init__(self, move: ProfileFolderMove) -> None:
        self.move = move

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.move.publish()
