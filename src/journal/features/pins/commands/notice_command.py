from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.models.notice import Notice
from journal.repositories.environments import Environments
from journal.repositories.notices import Notices


class NoticeCommand(Command):
    noun = "notice"

    def __init__(self, notices: Notices, environments: Environments) -> None:
        self.notices, self.environments = notices, environments

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "pin a link above the chat")
        create.add_argument("title", help="what it is, in the user's words")
        create.add_argument("--link", required=True)
        create.add_argument("--label", default="Open", help="the words on its button, such as Open the design")
        create.add_argument("--tone", default="note", choices=("note", "good", "warn"))
        self.verb(verbs, "close", "take a pin down").add_argument("n", type=int)
        self.verb(verbs, "list", "the pins up here")

    def create(self, args: Namespace, where: Where) -> int:
        notice = self.notices.save(Notice(environment_id=self.environments.named(where.environment).id, title=args.title, link=args.link, label=args.label, tone=args.tone), where.actor)
        print(f"notice {notice.id} pinned: {notice.title} -> {notice.link}")
        return 0

    def close(self, args: Namespace, where: Where) -> int:
        notice = self.notices.save(self.notices.find(args.n).closed(datetime.now(timezone.utc)), where.actor)
        print(f"notice {notice.id} closed")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for notice in self.notices.open_in(self.environments.named(where.environment).id):
            print(f"{notice.id:>4}  {notice.title}: {notice.link}")
        return 0
