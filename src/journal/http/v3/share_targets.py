from journal.http.v3.v3_row import viewer_ref
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.share import Share
from journal.refused import Refused
from journal.repositories.docs import Docs
from journal.repositories.links import Links
from journal.repositories.plans import Plans
from journal.repositories.reports import Reports

SHARES = "shares"
TABLES = {"doc": "docs", "report": "reports", "plan": "plans"}


class ShareTargets:
    """What a link opens, a document, a report or a plan, named the viewer's way as doc:12 and kept as a link from the share to its row."""

    def __init__(self, docs: Docs, reports: Reports, plans: Plans, links: Links) -> None:
        self.plans, self.links = plans, links
        self.repositories = {"docs": docs, "reports": reports, "plans": plans}

    def named(self, named: str) -> Ref:
        """The row a viewer's name points at, which must be there; anything else cannot be shared."""
        kind, _, number = named.strip().replace(" ", ":", 1).partition(":")
        if kind not in TABLES or not number.isdigit():
            raise Refused(f"only a document, a report or a plan can be shared: write it as doc:12, report:4 or plan:2, not {named!r}")
        ref = Ref(TABLES[kind], int(number))
        self.repositories[ref.type].find(ref.id)
        return ref

    def link(self, share: Share, target: Ref, by) -> None:
        self.links.save(Link(source=Ref.to(share), target=target, kind=SHARES), by)

    def of(self, share: Share) -> Ref | None:
        """The row the share opens; none when it was deleted with its links."""
        targets = self.links.targets(share, SHARES)
        return targets[0] if targets else None

    def viewer_ref(self, share: Share) -> str:
        target = self.of(share)
        return viewer_ref(target) if target else ""

    def shown(self, share: Share) -> list[Ref]:
        """The rows the link's page shows: the row, and for a plan its tasks."""
        target = self.of(share)
        if target is None:
            return []
        tasks = self.plans.tasks_of(self.plans.find(target.id)) if target.type == "plans" else []
        return [target, *(Ref.to(task) for task in tasks)]

    def opens(self, named: str) -> list[str]:
        """What a link to the row opens, one line each, as the share dialog lists it: the row, and for a plan its tasks."""
        ref = self.named(named)
        row = self.repositories[ref.type].find(ref.id)
        lines = [f"{row.title} ({viewer_ref(ref).replace(':', ' ')})"]
        if ref.type == "plans":
            lines += [f"{task.title} (todo {task.id})" for task in self.plans.tasks_of(row)]
        return lines
