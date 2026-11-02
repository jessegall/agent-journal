from core.base.change.event_log import JOURNAL_BOOTING_EVENT, REGISTRY_SYNC_EVENT
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.registry.registry import Registry
from core.modules.skills.support.skill_files import SkillFiles


PUBLISHING_EVENTS = (JOURNAL_BOOTING_EVENT, REGISTRY_SYNC_EVENT)


class SkillPublishListener(CommitListener):
    """As the journal starts or an update changes its modules, removes the skill folders no module declares and
    republishes every declared skill."""

    name = "skills.publish"
    event = "*.*"

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in PUBLISHING_EVENTS:
            return
        self.files.clear(self.registry.skills)
        for skill in self.registry.skills:
            self.files.write(skill)
