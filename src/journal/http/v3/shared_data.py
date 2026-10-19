from journal.http.v3.shapers.shapers import Shapers
from journal.http.v3.shapers.todos_shaper import TodosShaper
from journal.http.v3.share_targets import ShareTargets
from journal.http.v3.v3_row import V3Row, seconds, viewer_ref
from journal.models.share import Share
from journal.repositories.plans import Plans
from journal.repositories.scope import Scope

SHOWN = ("title", "abstract", "brief", "sections", "created", "updated", "completed", "data")


class SharedData:
    """What the share page reads of a link: the row it opens, and a plan's tasks, each with only the fields a visitor sees."""

    def __init__(self, shapers: Shapers, targets: ShareTargets, plans: Plans, scope: Scope) -> None:
        self.shapers, self.targets, self.plans, self.scope = shapers, targets, plans, scope

    def of(self, share: Share) -> dict:
        target = self.targets.of(share)
        with self.scope.of(share.environment_id):
            rows = self.rows(target) if target else []
        refs = [row.ref for row in rows]
        return {"share": {"target": viewer_ref(target) if target else "", "expires": seconds(share.expires_at), "comments": False},
                "rows": {row.ref: self.shown(row, refs) for row in rows}, "comments": [], "timelines": {}, "types": {}}

    def rows(self, target) -> list[V3Row]:
        """The target's row, and for a plan the rows of its tasks."""
        kind = viewer_ref(target).split(":")[0]
        row = next((r for r in self.shapers.named(kind).rows() if r.n == target.id), None)
        if row is None:
            return []
        if kind != "plan":
            return [row]
        return [row, *(TodosShaper.row(task) for task in self.plans.tasks_of(self.plans.find(target.id)))]

    @staticmethod
    def shown(row: V3Row, refs: list[str]) -> dict:
        whole = row.to_json()
        return {**{name: whole[name] for name in SHOWN}, "files": [], "pictures": {}, "members": [ref for ref in row.refs if ref in refs]}
