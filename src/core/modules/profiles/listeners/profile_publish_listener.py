from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.change.file_publishing import FilePublishing


class ProfilePublishListener(CommitListener[FilePublishing]):
    """As the journal starts or an update changes its modules, writes its own agent profiles again, as it does
    its skills."""

    name = "profiles.publish"

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.files.publish()
