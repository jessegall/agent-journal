from events import Fact
from events.notifications import NotificationCreated
from events.runtime_cleanup import UpdateInstalled
from features.auto_update.announcing import KIND
from receiving import Listener
from resources.types import Notification
from serving import ReadRows


class SpotUpdateAnnounced(Listener[NotificationCreated]):
    def listen(self, event: NotificationCreated, notifications: ReadRows[Notification]) -> list[Fact]:
        return [UpdateInstalled(notification=event.n)] if notifications.load(event.n).data.get("kind") == KIND else []
