from __future__ import annotations

from pathlib import Path

import notifications
from controller import Controller, Payload, Result
from payloads import notifications as notification_payloads
from payloads.common import ListingPayload


class NotificationsController(Controller):
    resource = "notifications"
    noun = "notification"
    actions = ("index", "show", "store", "read", "readall")
    numbered = ("show", "read")
    payloads = {"index": ListingPayload, "store": notification_payloads.StorePayload}

    def repository(self, root: Path, p: Payload):
        from resources import Notifications
        return Notifications(root, p.env)

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        query = repo.query() if p.all else repo.query().where(lambda x: not x.read_at)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [notifications.row_response(x.n, x.raw) for x in page.rows],
                      {"left": page.left, "unread": len([x for x in repo.all() if not x.read_at])})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", notifications.row_response(p.id, self.repository(root, p).find(p.id).raw))

    def store(self, root: Path, p: notification_payloads.StorePayload) -> Result:
        return Result.of(notifications.add(root, p.text, p.at, p.about, source=p.source, track=p.env or None),
                         created=True)

    def read(self, root: Path, p: Payload) -> Result:
        return Result.of(notifications.read(root, p.id, p.at, track=p.env or None))

    def readall(self, root: Path, p: Payload) -> Result:
        return Result.of(notifications.read_all(root, p.at, track=p.env or None))
