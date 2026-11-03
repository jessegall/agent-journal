from core.base.change.event_log import FILE_PUBLISHING_EVENTS, UPGRADE_FINISHED_EVENT
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.registry.registry import Registry
from core.modules.skills.support.skill_files import SkillFiles



class SkillPublishListener(CommitListener):
    """As the journal starts or an update changes its modules, removes every skill folder the journal gave out
    and writes each declared skill again, so the latest text is always there; a person's own skill stays."""

    name = "skills.publish"
    event = f"{FILE_PUBLISHING_EVENTS}|{UPGRADE_FINISHED_EVENT}"

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def handle(self, event: LoggedEvent) -> None:
        self.files.remove_all()
        self.files.write_all(self.registry.skills)
