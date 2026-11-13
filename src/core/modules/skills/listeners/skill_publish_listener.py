from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.registry.registry import Registry
from core.modules.skills.support.skill_files import SkillFiles
from engine.event.file_publishing import FilePublishing
from engine.event.upgrade_finished import UpgradeFinished



class SkillPublishListener(CommitListener[FilePublishing | UpgradeFinished]):
    """Writes every declared journal skill when modules change, the server starts or an upgrade finishes, and only then
    removes the ones no module declares any more, so a project never has fewer skills than before."""

    name = "skills.publish"

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def handle(self, event: FilePublishing | UpgradeFinished, logged: LoggedEvent) -> None:
        self.files.write_all(self.registry.skills)
        self.files.clear(self.registry.skills)
