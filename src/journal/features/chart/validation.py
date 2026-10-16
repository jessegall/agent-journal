from journal.features.chart.catalogue import Catalogue
from journal.features.chart.fault import Fault
from journal.features.chart.moves import Moves
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.chart import Chart
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

    def binding_faults(self, chart: Chart) -> list[Fault]:
        """A workflow is bound to a state the engine knows at an event the catalogue has, and the pair has one workflow: a second on the same pair, or a state or event nobody has heard of, is refused."""
        if not self.states.known(chart.state):
            return [Fault(f"no state is called {chart.state}: one of {', '.join(self.states.names())}")]
        if not self.catalogue.has(NodeKind.TRIGGER, chart.event):
            return [Fault(f"no event is called {chart.event}: journal chart catalogue lists them")]
        other = self.charts.for_pair(chart.state, chart.event)
        if other and other.id != chart.id:
            return [Fault(f"workflow {other.id}, {other.title}, is already the workflow for {chart.state} at {chart.event}: one workflow per state per trigger")]
        return []

    def faults(self, chart: Chart, nodes: list[dict], lines: list[dict]) -> list[Fault]:
        by_id = {str(n.get("id", "")): n for n in nodes}
        faults = [Fault(f"node {n.get('id')} names no catalogue entry: {n.get('kind')} {n.get('key')}", str(n.get("id", ""))) for n in nodes if not self.catalogue.has(n.get("kind", ""), n.get("key", ""))]
        faults += [Fault(f"node {n.get('id')}'s text is longer than {TEXT_LIMIT} characters", str(n.get("id", ""))) for n in nodes if len(n.get("text", "")) > TEXT_LIMIT]
        faults += self.trigger_faults(chart, nodes)
        faults += self.action_faults(nodes)
        for line in lines:
            source, target = by_id.get(str(line.get("from"))), by_id.get(str(line.get("to")))
            if not source or not target:
                faults.append(Fault(f"a line from {line.get('from')} to {line.get('to')} leads to or from no node"))
                continue
            faults += self.port_fault(source, target, line.get("port", THEN))
        faults += self.check_faults(nodes, lines)
        faults += self.port_twice_faults(lines)
        faults += self.hold_faults(nodes, lines)
        faults += self.cycle_faults(nodes, lines)
        return faults

    def warnings(self, chart: Chart) -> list[str]:
        """What a saved workflow should still hear about: a state that waits on something outside with nothing in any of its workflows to release the agent."""
        if chart.state not in self.states.waits():
            return []
        own = [c for c in self.charts.all() if c.state == chart.state]
        if any(n.kind == NodeKind.ACTION and n.key in RELEASES for c in own for n in self.charts.nodes_of(c)):
            return []
        title = self.states.title_of(chart.state)
        return [f"nothing ends this wait: no workflow of {title} releases the agent or changes its state, so an agent {title.lower()} stays so until you release it by hand"]

    @staticmethod
    def hold_faults(nodes: list[dict], lines: list[dict]) -> list[Fault]:
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
                    faults.append(Fault(f"action {node.get('id')} holds the agent at every {trigger.get('key')}: put a check before it, or the agent never gets past", str(node.get("id", ""))))
                ahead += then.get(str(node.get("id", "")), [])
        return faults

    def action_faults(self, nodes: list[dict]) -> list[Fault]:
        """A move names idle, or a wait a workflow may make, expecting or stuck, with the words it waits for after the name; a count node names its count, and a count check the number after it."""
        faults = []
        for n in (n for n in nodes if n.get("key") in ("count_start", "count_one", "count_over", "count_at")):
            words = n.get("text", "").split()
            if not words:
                faults.append(Fault(f"node {n.get('id')} names no count: its text is the count's name", str(n.get("id", ""))))
            elif n.get("kind") == NodeKind.CHECK and len(words) < 2:
                faults.append(Fault(f"node {n.get('id')} names no number: its text is the count's name, then N or a setting's name", str(n.get("id", ""))))
        for n in (n for n in nodes if n.get("kind") == NodeKind.ACTION and n.get("key") == "move_to"):
            name = n.get("text", "").strip().partition(" ")[0]
            if not name or not self.states.known(name):
                faults.append(Fault(f"node {n.get('id')} moves the agent to {name or 'nowhere'}: no state is called that", str(n.get("id", ""))))
            elif name != "idle" and not Moves.words_field(self.states.named(name, {})):
                faults.append(Fault(f"node {n.get('id')} moves the agent to {name}: {Moves.refusal(name)}", str(n.get("id", ""))))
        return faults

    @staticmethod
    def trigger_faults(chart: Chart, nodes: list[dict]) -> list[Fault]:
        """A workflow holds one trigger, of the event it is for."""
        keys = [n.get("key", "") for n in nodes if n.get("kind") == NodeKind.TRIGGER]
        if len(keys) > 1:
            return [Fault(f"a workflow holds one trigger, of the event it is for; this one has {len(keys)}")]
        return [Fault(f"the trigger is {keys[0]}, but this workflow is for {chart.state} at {chart.event}") for k in keys[:1] if k != chart.event]

    @staticmethod
    def port_fault(source: dict, target: dict, port: str) -> list[Fault]:
        if target.get("kind") == NodeKind.TRIGGER:
            return [Fault(f"a line leads into trigger {target.get('id')}: a trigger only starts a path", str(target.get("id", "")))]
        if source.get("kind") == NodeKind.CHECK and port not in (YES, NO):
            return [Fault(f"check {source.get('id')} leaves by yes or no, not {port}", str(source.get("id", "")))]
        if source.get("kind") != NodeKind.CHECK and port != THEN:
            return [Fault(f"{source.get('kind')} {source.get('id')} leaves by then, not {port}", str(source.get("id", "")))]
        return []

    @staticmethod
    def port_twice_faults(lines: list[dict]) -> list[Fault]:
        """A node leaves each port by one line, so a workflow runs in one order: a trigger and an action lead on to one step, a check to one on yes and one on no."""
        seen: dict[tuple[str, str], int] = {}
        for line in lines:
            seen[(str(line.get("from")), line.get("port", THEN))] = seen.get((str(line.get("from")), line.get("port", THEN)), 0) + 1
        return [Fault(f"node {source} leaves by {port} {n} times: one line per port, the next step leads on", source) for (source, port), n in seen.items() if n > 1]

    @staticmethod
    def check_faults(nodes: list[dict], lines: list[dict]) -> list[Fault]:
        sources = {str(line.get("from")) for line in lines}
        return [Fault(f"check {n.get('id')} has no line out: neither yes nor no", str(n.get("id", ""))) for n in nodes if n.get("kind") == NodeKind.CHECK and str(n.get("id", "")) not in sources]

    @staticmethod
    def cycle_faults(nodes: list[dict], lines: list[dict]) -> list[Fault]:
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

        return [Fault(f"the lines loop back through node {start}", start) for start in after if start not in seen and walk(start)]
