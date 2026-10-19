import re
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.checks import COUNT_ACTIONS, COUNT_CHECKS, READINGS
from journal.features.chart.fault import Fault
from journal.support.states_catalogue import StatesCatalogue
from journal.models.chart import Chart
from journal.support.drawn_line import NO, THEN, YES, DrawnLine
from journal.support.drawn_node import DrawnNode
from journal.models.node_kind import NodeKind
from journal.support.workflow_at import WorkflowAt
from journal.repositories.charts import Charts

TEXT_LIMIT = 500
"""A node's text becomes a prompt or a typed line: this many characters at most."""

HOLDS = ("hold", "block_stop")
LOCK_WHY = "it ships with the journal"
LOCK_RULE = "a locked step cannot be taken out, reworded or turned off, and you cannot put a check or Run no later workflows before it; you can add steps after it, change its numbers, and Reset to default brings it back"
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

    def order_faults(self, event: str, given: list[WorkflowAt]) -> list[Fault]:
        """An order names every workflow of the event once, each at the revision it was read, so a drag over a stale list is refused naming who saved first; the locked ones keep the head of the list."""
        standing = {c.id: c for c in self.charts.for_event(event)}
        if not standing:
            return [Fault(f"no workflow answers {event}")]
        ids = [row.id for row in given]
        if sorted(ids) != sorted(standing):
            return [Fault(f"the order names {', '.join(str(i) for i in ids) or 'nothing'}, but the workflows of {event} are {', '.join(str(i) for i in standing)}: name each once")]
        locked = [i for i, c in standing.items() if c.locked]
        if ids[:len(locked)] != locked:
            return [Fault(f"workflow {locked[0]} is locked, {LOCK_WHY}: the locked ones run first and keep the head of the list")]
        stale = [standing[row.id] for row in given if row.revision != standing[row.id].revision]
        if stale:
            who = stale[0].updated_by.stamp if stale[0].updated_by else "someone"
            return [Fault(f"workflow {stale[0].id} changed since you read it: {who} saved it first, read the list again")]
        return []

    def faults(self, chart: Chart, nodes: list[DrawnNode], lines: list[DrawnLine]) -> list[Fault]:
        by_id = {n.id: n for n in nodes}
        faults = [Fault(f"node {n.id} names no catalogue entry: {n.kind} {n.key}", n.id) for n in nodes if not self.catalogue.has(n.kind, n.key)]
        faults += [Fault(f"node {n.id}'s text is longer than {TEXT_LIMIT} characters", n.id) for n in nodes if len(n.text) > TEXT_LIMIT]
        faults += self.trigger_faults(chart, nodes)
        faults += self.action_faults(nodes)
        faults += self.call_faults(chart, nodes)
        for line in lines:
            source, target = by_id.get(line.source), by_id.get(line.target)
            if not source or not target:
                faults.append(Fault(f"a line from {line.source} to {line.target} leads to or from no node"))
                continue
            faults += self.port_fault(source, target, line.port)
        faults += self.check_faults(nodes, lines)
        faults += self.port_twice_faults(lines)
        faults += self.hold_faults(nodes, lines)
        faults += self.cycle_faults(nodes, lines)
        faults += self.lock_faults(chart, nodes, lines)
        return faults

    def lock_faults(self, chart: Chart, nodes: list[DrawnNode], lines: list[DrawnLine]) -> list[Fault]:
        """A locked node stays as it is: present, its law words unchanged, and reached from the trigger through shipped or locked nodes only, so nothing the user adds decides whether it runs."""
        standing = {n.id: n for n in self.charts.nodes_of(chart)}
        locked = {i: n for i, n in standing.items() if n.locked}
        if not locked:
            return []
        given = {n.number: n for n in nodes if n.number}
        faults = [Fault(f"step {i} is locked, {LOCK_WHY}: {LOCK_RULE}", str(i)) for i in locked if i not in given]
        faults += [Fault(f"step {i} is locked, {LOCK_WHY}, and its words stay: {LOCK_RULE}", str(i)) for i, n in locked.items() if i in given and (given[i].key != n.key or law_words(given[i].text) != law_words(n.text))]
        untouched = {str(i) for i, n in standing.items() if i in given and given[i].key == n.key and given[i].text == n.text and (n.shipped or n.locked)}
        before = self.before(lines, {str(i) for i in locked})
        for node in nodes:
            own = node.id
            if own in before and own not in untouched and (node.kind == NodeKind.CHECK or node.key == "stop_here"):
                faults.append(Fault(f"step {own} would come before a locked step, {LOCK_WHY}: {LOCK_RULE}", own))
        return faults

    @staticmethod
    def before(lines: list[DrawnLine], targets: set) -> set:
        """Every node a path runs through on its way to one of the targets."""
        leads_to = {}
        for line in lines:
            leads_to.setdefault(line.target, []).append(line.source)
        seen, queue = set(), list(targets)
        while queue:
            for source in leads_to.get(queue.pop(), []):
                if source in seen:
                    continue
                seen.add(source)
                queue.append(source)
        return seen

    def warnings(self, chart: Chart) -> list[str]:
        """What a saved workflow should still hear about: a hold at a tool use that no check narrows, a Run no later workflows that skips the workflows after it in the event's order, and a state that waits on something outside with nothing in any of its workflows to release the agent."""
        return self.hold_warnings(chart) + self.stop_warnings(chart) + self.wait_warnings(chart) + self.count_warnings(chart)

    def hold_warnings(self, chart: Chart) -> list[str]:
        """A Hold the tool at Pre tool use with neither Tool changes files? nor Journal command? on its path holds every tool, reads included; the engine still lets a journal command and the read of a skill's file through, the rest waits."""
        if chart.event != "tool_starting":
            return []
        nodes = [DrawnNode.of(n) for n in self.charts.nodes_of(chart)]
        lines = [DrawnLine.of(l) for l in self.charts.lines_of(chart)]
        narrowing = {n.id for n in nodes if n.kind == NodeKind.CHECK and n.key in ("tool_writes", "journal_command")}
        return [f"Hold the tool at step {n.id} holds every tool, reads included: put Tool changes files? or Journal command? before it; a journal command and the read of a skill's file go through regardless" for n in nodes if n.kind == NodeKind.ACTION and n.key == "hold" and not narrowing & self.before(lines, {n.id})]

    def count_warnings(self, chart: Chart) -> list[str]:
        """A count check reading a count that nothing in this workflow starts or counts, which stays at nought."""
        nodes = self.charts.nodes_of(chart)
        kept = {n.text.strip().partition(" ")[0] for n in nodes if n.key in COUNT_ACTIONS}
        read = sorted({n.text.strip().partition(" ")[0] for n in nodes if n.key in COUNT_CHECKS} - kept - set(READINGS) - {""})
        return [f"nothing in this workflow starts or counts {name}, so it stays at nought" for name in read]

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
        return [f"Run no later workflows in this workflow skips what comes after it at {chart.event}: {', '.join(skipped)}"] if skipped else []

    def wait_warnings(self, chart: Chart) -> list[str]:
        if chart.state not in self.states.waits():
            return []
        own = [c for c in self.charts.all() if c.state == chart.state]
        if any(n.kind == NodeKind.ACTION and n.key in RELEASES for c in own for n in self.charts.nodes_of(c)):
            return []
        title = self.states.title_of(chart.state)
        return [f"nothing ends this wait: no workflow of {title} releases the agent or changes its state, so an agent {title.lower()} stays so until you release it by hand"]

    @staticmethod
    def hold_faults(nodes: list[DrawnNode], lines: list[DrawnLine]) -> list[Fault]:
        """A hold that a trigger reaches through no check would hold the agent at every one of that event: the agent never gets past it."""
        by_id = {n.id: n for n in nodes}
        then = {}
        for line in lines:
            if line.port == THEN:
                then.setdefault(line.source, []).append(line.target)
        faults = []
        for trigger in (n for n in nodes if n.kind == NodeKind.TRIGGER):
            ahead, seen = list(then.get(trigger.id, [])), set()
            while ahead:
                node = by_id.get(ahead.pop())
                if not node or node.id in seen or node.kind != NodeKind.ACTION:
                    continue
                seen.add(node.id)
                if node.key in HOLDS:
                    faults.append(Fault(f"action {node.id} holds the agent at every {trigger.key}: put a check before it, or the agent never gets past", node.id))
                ahead += then.get(node.id, [])
        return faults

    def call_faults(self, chart: Chart, nodes: list[DrawnNode]) -> list[Fault]:
        """A Run a workflow step names a workflow there is, and no workflow runs itself, directly or through another."""
        titles = {c.title: c for c in self.charts.all()}
        calls = {c.id: [n.text.strip() for n in self.charts.nodes_of(c) if n.key == "run_workflow"] for c in self.charts.all() if c.id != chart.id}
        calls[chart.id] = [n.text.strip() for n in nodes if n.key == "run_workflow"]
        faults = []
        for n in (n for n in nodes if n.key == "run_workflow"):
            title = n.text.strip()
            if title not in titles:
                faults.append(Fault(f"node {n.id} runs no workflow: none is titled {title or 'nothing'}", n.id))
            elif self.reaches(titles[title].id, chart.id, calls, titles, set()):
                faults.append(Fault(f"node {n.id} runs {title}, which runs this workflow again: a workflow cannot run itself, directly or through another", n.id))
        return faults

    def reaches(self, start: int, target: int, calls: dict, titles: dict, seen: set) -> bool:
        if start == target:
            return True
        if start in seen:
            return False
        seen.add(start)
        return any(self.reaches(titles[t].id, target, calls, titles, seen) for t in calls.get(start, []) if t in titles)

    def action_faults(self, nodes: list[DrawnNode]) -> list[Fault]:
        """A wait names what for and being stuck why; a count node names its count, and a count check the number after it."""
        faults = []
        for n in (n for n in nodes if n.key in (*COUNT_ACTIONS, *COUNT_CHECKS)):
            words = n.text.split()
            if not words:
                faults.append(Fault(f"node {n.id} names no count: its text is the count's name", n.id))
            elif n.key in COUNT_ACTIONS and words[0] in READINGS:
                faults.append(Fault(f"{words[0]} is a reading of the journal's record, not a count a workflow keeps: name the count something else", n.id))
            elif n.kind == NodeKind.CHECK and len(words) < 2:
                faults.append(Fault(f"node {n.id} names no number: its text is the count's name, then N or a setting's name", n.id))
        for n in (n for n in nodes if n.kind == NodeKind.ACTION and n.key in ("wait_outside", "mark_stuck") and not n.text.strip()):
            faults.append(Fault(f"node {n.id} says nothing: {'what the agent waits for' if n.key == 'wait_outside' else 'why the agent is stuck'} goes in its text", n.id))
        return faults

    @staticmethod
    def trigger_faults(chart: Chart, nodes: list[DrawnNode]) -> list[Fault]:
        """A workflow holds one trigger per event it answers, its first event's among them."""
        keys = [n.key for n in nodes if n.kind == NodeKind.TRIGGER]
        twice = sorted({k for k in keys if keys.count(k) > 1})
        faults = [Fault(f"a workflow holds one trigger of each event; this one has {keys.count(k)} of {k}") for k in twice]
        return faults + ([Fault(f"this workflow is for {chart.event} but holds no trigger of it")] if keys and chart.event not in keys else [])

    @staticmethod
    def port_fault(source: DrawnNode, target: DrawnNode, port: str) -> list[Fault]:
        if target.kind == NodeKind.TRIGGER:
            return [Fault(f"a line leads into trigger {target.id}: a trigger only starts a path", target.id)]
        if source.key == "stop_here":
            return [Fault(f"a line leads out of Run no later workflows {source.id}: it ends the walk, nothing follows it", source.id)]
        if source.kind == NodeKind.CHECK and port not in (YES, NO):
            return [Fault(f"check {source.id} leaves by yes or no, not {port}", source.id)]
        if source.kind != NodeKind.CHECK and port != THEN:
            return [Fault(f"{source.kind} {source.id} leaves by then, not {port}", source.id)]
        return []

    @staticmethod
    def port_twice_faults(lines: list[DrawnLine]) -> list[Fault]:
        """A node leaves each port by one line, so a workflow runs in one order: a trigger and an action lead on to one step, a check to one on yes and one on no."""
        seen: dict[tuple[str, str], int] = {}
        for line in lines:
            seen[(line.source, line.port)] = seen.get((line.source, line.port), 0) + 1
        return [Fault(f"node {source} leaves by {port} {n} times: one line per port, the next step leads on", source) for (source, port), n in seen.items() if n > 1]

    @staticmethod
    def check_faults(nodes: list[DrawnNode], lines: list[DrawnLine]) -> list[Fault]:
        sources = {line.source for line in lines}
        return [Fault(f"check {n.id} has no line out: neither yes nor no", n.id) for n in nodes if n.kind == NodeKind.CHECK and n.id not in sources]

    @staticmethod
    def cycle_faults(nodes: list[DrawnNode], lines: list[DrawnLine]) -> list[Fault]:
        """A path that comes back to a node it passed would walk for ever: an action's then may lead on, so the whole graph is walked."""
        after: dict[str, list[str]] = {n.id: [] for n in nodes}
        for line in lines:
            after.setdefault(line.source, []).append(line.target)
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
