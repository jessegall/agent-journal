import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from features.groups.resource import Group
from resources.base import SYSTEM, Refused


class Groups(Controller):
    resource = Group

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if any(row["title"].lower() == title.strip().lower() for row in self.summaries() if not row["deleted"] and not row["completed"]):
            raise Refused(f"a group called {title.strip()!r} is already open")
        return super().create(title, abstract, brief, **data)

    def add(self, n: int, refs: list[str]):
        group = self.load(int(n))
        for ref in refs:
            self._member(ref)
            group = self.link(group.n, ref)
        return group

    def remove(self, n: int, ref: str):
        return self.unlink(int(n), ref)

    def members(self, n: int) -> list[str]:
        found = []
        for ref in self.load(int(n)).refs:
            try:
                row = self._member(ref)
            except Refused:
                continue
            if not row.deleted:
                found.append(f"{row.type} {row.n}  {row.title}")
        return found

    def _member(self, ref: str):
        kind, _, number = ref.partition(":")
        if kind not in CONTROLLERS or not number.isdigit():
            raise Refused(f"{ref!r} is not a row: write it as type:number, like todo:785")
        return CONTROLLERS[kind](self.record, actor=SYSTEM).load(int(number))


resources_module.register(Group)
types_module.register(Groups)
