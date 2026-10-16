import re
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.checks import COUNT_CHECKS
from journal.features.chart.fault import Fault
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.chart import Chart
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts

TEXT_LIMIT = 500
"""A node's text becomes a prompt or a typed line: this many characters at most."""

HOLDS = ("hold", "block_stop")
LOCK_WHY = "it ships with the journal"
LOCK_RULE = "a locked step cannot be taken out, reworded or turned off, and you cannot put a check or Stop here before it; you can add steps after it, change its numbers, and Reset to default brings it back"
"""What a user can and cannot do around a locked node, said in every refusal."""
"""The actions that stop the agent until what their message names is done."""

RELEASES = ("release", "wait_outside", "mark_stuck", "go_idle")
"""The actions that take a waiting agent out of its wait."""


def law_words(text: str) -> str:
    """A locked node's text without its numbers: the words are the law, the numbers are the user's to tune."""
    return re.sub(r"\d+", "", text)


class Validation:
    """What makes a workflow wrong, found before it is saved: a node the catalogue does not know, more than one trigger, a line to nowhere or into a trigger, a check with no line out at all, a port that does not fit the node it leaves, a cycle of checks. A check with one line ends the path on the other answer."""

    def __init__(self, catalogue: Catalogue, charts: Charts, states: StatesCatalogue) -> None:
        self.catalogue, self.charts, self.states = catalogue, charts, states

    def binding_faults(self, chart: Chart) -> list[Fault]:
        """A workflow answers an event the catalogue has, bound to a state the engine knows or to none, which means always; a state or event nobody has heard of is refused."""
        if chart.state and not self.states.known(chart.state):
            return [Fault(f"no state is called {chart.state}: one of {', '.join(self.states.names())}, or none for a workflow that always runs")]
        if not self.catalogue.has(NodeKind.TRIGGER, chart.event):
            return [Fault(f"no event is called {chart.event}: journal chart catalogue lists them")]
        return []

    def order_faults(self, event: str, given: list[dict]) -> list[Fault]:
        """An order names every workflow of the event once, each at the revision it was read, so a drag over a stale list is refused naming who saved first; the locked ones keep the head of the list."""
        standing = {c.id: c for c in self.charts.for_event(event)}
        if not standing:
            return [Fault(f"no workflow answers {event}")]
        ids = [row["id"] for row in given]
        if sorted(ids) != sorted(standing):
            return [Fault(f"the order names {', '.join(str(i) for i in ids) or 'nothing'}, but the workflows of {event} are {', '.join(str(i) for i in standing)}: name each once")]
        locked = [i for i, c in standing.items() if c.locked]
        if ids[:len(locked)] != locked:
            return [Fault(f"workflow {locked[0]} is locked, {LOCK_WHY}: the locked ones run first and keep the head of the list")]
        stale = [standing[row["id"]] for row in given if row["revision"] != standing[row["id"]].revision]
        if stale:
            who = stale[0].updated_by.stamp if stale[0].updated_by else "someone"
            return [Fault(f"workflow {stale[0].id} changed since you read it: {who} saved it first, read the list again")]
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
        faults += self.lock_faults(chart, nodes, lines)
        return faults

    def lock_faults(self, chart: Chart, nodes: list[dict], lines: list[dict]) -> list[Fault]:
        """A locked node stays as it is: present, its law words unchanged, and reached from the trigger through shipped or locked nodes only, so nothing the user adds decides whether it runs."""
        standing = {n.id: n for n in self.charts.nodes_of(chart)}
        locked = {i: n for i, n in standing.items() if n.locked}
        if not locked:
            return []
        given = {int(n["id"]): n for n in nodes if str(n.get("id", "")).isdigit()}
        faults = [Fault(f"step {i} is locked, {LOCK_WHY}: {LOCK_RULE}", str(i)) for i in locked if i not in given]
        faults += [Fault(f"step {i} is locked, {LOCK_WHY}, and its words stay: {LOCK_RULE}", str(i)) for i, n in locked.items() if i in given and (given[i].get("key") != n.key or law_words(given[i].get("text", "")) != law_words(n.text))]
        untouched = {str(i) for i, n in standing.items() if i in given and given[i].get("key") == n.key and given[i].get("text", "") == n.text and (n.shipped or n.locked)}
        before = self.before(lines, {str(i) for i in locked})
        for node in nodes:
            own = str(node.get("id", ""))
            if own in before and own not in untouched and (node.get("kind") == NodeKind.CHECK or node.get("key") == "stop_here"):
                faults.append(Fault(f"step {own} would come before a locked step, {LOCK_WHY}: {LOCK_RULE}", own))
        return faults

    @staticmethod
    def before(lines: list[dict], targets: set) -> set:
        """Every node a path runs through on its way to one of the targets."""
        leads_to = {}
        for line in lines:
            leads_to.setdefault(str(line.get("to")), []).append(str(line.get("from")))
        seen, queue = set(), list(targets)
        while queue:
            for source in leads_to.get(queue.pop(), []):
                if source not in seen:
                    seen.add(source)
                    queue.append(source)
        return seen

    def warnings(self, chart: Chart) -> list[str]:
        """What a saved workflow should still hear about: a hold at a tool use that no check narrows, a Stop here that skips the workflows after it in the event's order, and a state that waits on something outside with nothing in any of its workflows to release the agent."""
        return self.hold_warnings(chart) + self.stop_warnings(chart) + self.wait_warnings(chart)

    def hold_warnings(self, chart: Chart) -> list[str]:
        """A Hold the tool at Tool about to run with neither Tool changes files? nor Journal command? on its path holds every tool, reads included; the engine still lets a journal command and the read of a skill's file through, the rest waits."""
        if chart.event != "tool_starting":
            return []
        nodes = self.charts.nodes_of(chart)
        lines = [{"from": l.source.id, "to": l.target.id, "port": l.kind} for l in self.charts.lines_of(chart)]
        narrowing = {str(n.id) for n in nodes if n.kind == NodeKind.CHECK and n.key in ("tool_writes", "journal_command")}
        return [f"Hold the tool at step {n.id} holds every tool, reads included: put Tool changes files? or Journal command? before it; a journal command and the read of a skill's file go through regardless" for n in nodes if n.kind == NodeKind.ACTION and n.key == "hold" and not narrowing & self.before(lines, {str(n.id)})]

    def off_fault(self, chart: Chart) -> list[Fault]:
        """A locked workflow, or one holding a locked step, is not turned off: that would switch off the journal's law."""
        if chart.locked:
            return [Fault(f"workflow {chart.id} is locked, {LOCK_WHY}: it cannot be turned off")]
        guards = [n for n in self.charts.nodes_of(chart) if n.locked]
        if guards:
            return [Fault(f"workflow {chart.id} holds locked step {guards[0].id}, {LOCK_WHY}: turning it off would switch the law off; {LOCK_RULE}")]
        return []

    def stop_warnings(self, chart: Chart) -> list[str]:
        if not any(n.key == "stop_here" for n in self.charts.nodes_of(chart)):
            return []
        skipped = [c.title for c in self.charts.for_event(chart.event) if c.place > chart.place]
        return [f"Stop here in this workflow skips what comes after it at {chart.event}: {', '.join(skipped)}"] if skipped else []

    def wait_warnings(self, chart: Chart) -> list[str]:
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
        """A wait names what for and being stuck why; a count node names its count, and a count check the number after it."""
        faults = []
        for n in (n for n in nodes if n.get("key") in ("count_start", "count_one", *COUNT_CHECKS)):
            words = n.get("text", "").split()
            if not words:
                faults.append(Fault(f"node {n.get('id')} names no count: its text is the count's name", str(n.get("id", ""))))
            elif n.get("kind") == NodeKind.CHECK and len(words) < 2:
                faults.append(Fault(f"node {n.get('id')} names no number: its text is the count's name, then N or a setting's name", str(n.get("id", ""))))
        for n in (n for n in nodes if n.get("kind") == NodeKind.ACTION and n.get("key") in ("wait_outside", "mark_stuck") and not n.get("text", "").strip()):
            faults.append(Fault(f"node {n.get('id')} says nothing: {'what the agent waits for' if n.get('key') == 'wait_outside' else 'why the agent is stuck'} goes in its text", str(n.get("id", ""))))
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
        if source.get("key") == "stop_here":
            return [Fault(f"a line leads out of Stop here {source.get('id')}: it ends the walk, nothing follows it", str(source.get("id", "")))]
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
