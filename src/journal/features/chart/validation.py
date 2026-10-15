from journal.features.chart.catalogue import Catalogue
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES

TEXT_LIMIT = 500
"""A node's text becomes a prompt or a typed line: this many characters at most."""


class Validation:
    """What makes a workflow wrong, found before it is saved: a node the catalogue does not know, more than one trigger, a line to nowhere or into a trigger, a check with no line out at all, a port that does not fit the node it leaves, a cycle of checks. A check with one line ends the path on the other answer."""

    def __init__(self, catalogue: Catalogue) -> None:
        self.catalogue = catalogue

    def faults(self, nodes: list[dict], lines: list[dict]) -> list[str]:
        by_id = {str(n.get("id", "")): n for n in nodes}
        faults = [f"node {n.get('id')} names no catalogue entry: {n.get('kind')} {n.get('key')}" for n in nodes if not self.catalogue.has(n.get("kind", ""), n.get("key", ""))]
        faults += [f"node {n.get('id')}'s text is longer than {TEXT_LIMIT} characters" for n in nodes if len(n.get("text", "")) > TEXT_LIMIT]
        triggers = [n for n in nodes if n.get("kind") == NodeKind.TRIGGER]
        if len(triggers) > 1:
            faults.append(f"a workflow holds one trigger; this one has {len(triggers)}")
        for line in lines:
            source, target = by_id.get(str(line.get("from"))), by_id.get(str(line.get("to")))
            if not source or not target:
                faults.append(f"a line from {line.get('from')} to {line.get('to')} leads to or from no node")
                continue
            faults += self.port_fault(source, target, line.get("port", THEN))
        faults += self.check_faults(nodes, lines)
        faults += self.cycle_faults(nodes, lines)
        return faults

    @staticmethod
    def port_fault(source: dict, target: dict, port: str) -> list[str]:
        if target.get("kind") == NodeKind.TRIGGER:
            return [f"a line leads into trigger {target.get('id')}: a trigger only starts a path"]
        if source.get("kind") == NodeKind.CHECK and port not in (YES, NO):
            return [f"check {source.get('id')} leaves by yes or no, not {port}"]
        if source.get("kind") != NodeKind.CHECK and port != THEN:
            return [f"{source.get('kind')} {source.get('id')} leaves by then, not {port}"]
        return []

    @staticmethod
    def check_faults(nodes: list[dict], lines: list[dict]) -> list[str]:
        sources = {str(line.get("from")) for line in lines}
        return [f"check {n.get('id')} has no line out: neither yes nor no" for n in nodes if n.get("kind") == NodeKind.CHECK and str(n.get("id", "")) not in sources]

    @staticmethod
    def cycle_faults(nodes: list[dict], lines: list[dict]) -> list[str]:
        """A path that comes back to a node it passed would walk for ever: an action's then may lead on, so the whole graph is walked."""
        after: dict[str, list[str]] = {str(n.get("id", "")): [] for n in nodes}
        for line in lines:
            after.setdefault(str(line.get("from")), []).append(str(line.get("to")))
        seen, on_path = set(), []

        def walk(node: str) -> bool:
            if node in on_path:
                return True
            if node in seen:
                return False
            seen.add(node)
            on_path.append(node)
            looped = any(walk(following) for following in after.get(node, []))
            on_path.pop()
            return looped

        return [f"the lines loop back through node {start}" for start in after if start not in seen and walk(start)]
