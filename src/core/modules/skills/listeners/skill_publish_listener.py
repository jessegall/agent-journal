from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from core.base.registry.registry import Registry
from core.modules.skills.support.skill_files import SkillFiles
from engine.change.file_publishing import FilePublishing
from engine.change.upgrade_finished import UpgradeFinished



class SkillPublishListener(CommitListener[FilePublishing | UpgradeFinished]):
    """Replaces generated journal skills when modules change, the server starts or an upgrade finishes."""

    name = "skills.publish"

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def handle(self, event: FilePublishing | UpgradeFinished, logged: LoggedEvent) -> None:
        self.files.remove_all()
        self.files.write_all(self.registry.skills)
