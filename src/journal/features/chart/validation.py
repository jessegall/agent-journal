from journal.features.chart.catalogue import Catalogue
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.chart import BASE, Chart
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts

TEXT_LIMIT = 500
"""A node's text becomes a prompt or a typed line: this many characters at most."""

HOLDS = ("hold", "block_stop")
"""The actions that stop the agent until what their message names is done."""

RELEASES = ("release", "move_to")
"""The actions that take a waiting agent out of its wait."""


class Validation:
    """What makes a workflow wrong, found before it is saved: a node the catalogue does not know, more than one trigger, a line to nowhere or into a trigger, a check with no line out at all, a port that does not fit the node it leaves, a cycle of checks. A check with one line ends the path on the other answer."""

    def __init__(self, catalogue: Catalogue, charts: Charts, states: StatesCatalogue) -> None:
        self.catalogue, self.charts, self.states = catalogue, charts, states

    def binding_faults(self, chart: Chart) -> list[str]:
        """A workflow is bound to the base or to a state the engine knows, and a state has one workflow: a second on the same state, or a state nobody has heard of, is refused."""
        if not chart.bound_to_a_state:
            return []
        if chart.state != BASE and not self.states.known(chart.state):
            return [f"no state is called {chart.state}: base, or one of {', '.join(self.states.names())}"]
        other = self.charts.for_state(chart.state)
        if other and other.id != chart.id:
            return [f"workflow {other.id}, {other.title}, is already the workflow for {chart.state}: one workflow per state"]
        return []

    def faults(self, chart: Chart, nodes: list[dict], lines: list[dict]) -> list[str]:
        by_id = {str(n.get("id", "")): n for n in nodes}
        faults = [f"node {n.get('id')} names no catalogue entry: {n.get('kind')} {n.get('key')}" for n in nodes if not self.catalogue.has(n.get("kind", ""), n.get("key", ""))]
        faults += self.taken_faults(chart, nodes)
        faults += [f"node {n.get('id')}'s text is longer than {TEXT_LIMIT} characters" for n in nodes if len(n.get("text", "")) > TEXT_LIMIT]
        faults += self.trigger_faults(chart, nodes)
        faults += self.action_faults(nodes)
        for line in lines:
            source, target = by_id.get(str(line.get("from"))), by_id.get(str(line.get("to")))
            if not source or not target:
                faults.append(f"a line from {line.get('from')} to {line.get('to')} leads to or from no node")
                continue
            faults += self.port_fault(source, target, line.get("port", THEN))
        faults += self.check_faults(nodes, lines)
        faults += self.hold_faults(nodes, lines)
        faults += self.cycle_faults(nodes, lines)
        return faults

    def warnings(self, chart: Chart) -> list[str]:
        """What a saved workflow should still hear about: one for a state that waits on something outside, with nothing in it to release the agent."""
        if chart.state not in self.states.waits():
            return []
        if any(n.kind == NodeKind.ACTION and n.key in RELEASES for n in self.charts.nodes_of(chart)):
            return []
        return [f"nothing in this workflow releases the agent: without a release or a move, an agent {chart.state} stays so until you release it by hand"]

    @staticmethod
    def hold_faults(nodes: list[dict], lines: list[dict]) -> list[str]:
        """A hold that a trigger reaches through no check would hold the agent at every one of that event: the agent never gets past it."""
        by_id = {str(n.get("id", "")): n for n in nodes}
        then = {}
        for line in lines:
            if line.get("port", THEN) == THEN:
                then.setdefault(str(line.get("from")), []).append(str(line.get("to")))
        faults = []
        for trigger in (n for n in nodes if n.get("kind") == NodeKind.TRIGGER):
            ahead, seen = list(then.get(str(trigger.get("id", "")), [])), set()
            while ahead:
                node = by_id.get(ahead.pop())
                if not node or str(node.get("id", "")) in seen or node.get("kind") != NodeKind.ACTION:
                    continue
                seen.add(str(node.get("id", "")))
                if node.get("key") in HOLDS:
                    faults.append(f"action {node.get('id')} holds the agent at every {trigger.get('key')}: put a check before it, or the agent never gets past")
                ahead += then.get(str(node.get("id", "")), [])
        return faults

    @staticmethod
    def action_faults(nodes: list[dict]) -> list[str]:
        """A move names idle, the one state the machine enters with nothing in hand."""
        return [f"node {n.get('id')} moves the agent to {n.get('text', '').strip() or 'nowhere'}: a workflow moves the agent to idle only" for n in nodes if n.get("kind") == NodeKind.ACTION and n.get("key") == "move_to" and n.get("text", "").strip() != "idle"]

    @staticmethod
    def trigger_faults(chart: Chart, nodes: list[dict]) -> list[str]:
        """A workflow bound to a state holds one trigger per event it answers; one of the older shape holds one trigger."""
        keys = [n.get("key", "") for n in nodes if n.get("kind") == NodeKind.TRIGGER]
        if not chart.bound_to_a_state:
            return [f"a workflow holds one trigger; this one has {len(keys)}"] if len(keys) > 1 else []
        twice = sorted({k for k in keys if keys.count(k) > 1})
        return [f"a workflow holds one trigger per event; {k} is in this one {keys.count(k)} times" for k in twice]

    def taken_faults(self, chart: Chart, nodes: list[dict]) -> list[str]:
        """One workflow of the older shape per event: a trigger on an event another such workflow already answers is refused, since two on one event would both drive the agent."""
        faults = []
        if chart.bound_to_a_state:
            return faults
        for trigger in [n for n in nodes if n.get("kind") == NodeKind.TRIGGER]:
            other = self.charts.answering(trigger.get("key", ""))
            if other and other.id != chart.id:
                faults.append(f"workflow {other.id}, {other.title}, already answers {trigger.get('key')}: one workflow per event")
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
