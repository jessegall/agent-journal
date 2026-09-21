import hashlib
import io
import re
import threading
import time

from controllers.types import Agents, Messages
from engine.stored import read_json, write_json
from features.base import Behaviour, Feature, event, formats, interceptor, Line
from resources.base import AGENT, SYSTEM, titled
from engine.transcript import Turn, last_said, turns

TAGS = ("discovery", "correction", "blocked", "info", "reply")
RECENT_TURNS, RECENT_SECONDS = 6, 1800.0
MARKING = threading.Lock()
RUNS = {"reply": "message reply {n} {text}", "log": "work log {text} --n {n}", "end": "work end {n} --how {text}",
        "todo": "todo create {name} --brief {text}", "fact": "fact create {name} --brief {text}"}
PLACES = {"info": "bar"}
SHOWN = {"replies": ("reply",), "info": ("reply", "info", "blocked"), "corrections": ("reply", "info", "blocked", "correction"),
         "discoveries": ("reply", "info", "blocked", "correction", "discovery")}
ARGUMENT = r'(?::[^\]\s]+|="[^"]*")?'
LEADING = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)" + ARGUMENT + r"\]")
REPLIED = re.compile(r"\bjournal\s+message\s+reply\s+(\d+)")
CARRIED = re.compile(r'^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)(?::([0-9]+)|="([^"]*)")\]', re.M)


def written(names) -> list[str]:
    return [f"[!{name}]" for name in names]


def pattern(names) -> re.Pattern:
    return re.compile(r"^[ \t]*(> ?)?(?:\*\*)?\[!(?:"
                      + "|".join(re.escape(name) for name in names)
                      + r")" + ARGUMENT + r"\](?:\*\*)?(?:[ \t]+|$)", re.M)


ANY = pattern(dict.fromkeys((*TAGS, *RUNS)))


def visible(text: str) -> str:
    return ANY.sub(lambda found: found.group(1) or "", str(text or ""))


class Tags(Feature):
    name = "tags"
    lines = {"untagged": Line("your last message has no tag", "open every message with one of {{tags}}", lead=True),
             "refused": Line("the {{tag}} tag on {{on}} did not run", "{{said}}"),
             "by tag": Line("reply to message {{n}} with the reply tag", "open your turn with [!reply:{{n}}] and the turn itself becomes the reply, so journal message reply is never needed")}
    title_ = "Tagging"
    abstract_ = "A message opens with one tag: one without is answered at once with a message from the journal, and a tag carrying a number runs the command it stands for"
    help_ = "The tags are settings. tags.names lists them and tags.runs maps a tag to the command it stands for, so [!reply:12] runs journal message reply 12 with the turn as its text, and [!todo=\"the title\"] files a to-do with that title and the turn as its brief. A tag runs once, keyed to the turn it came from; two tags in one turn run in the order they appear; and a refusal comes back as a nudge on the next turn rather than at the moment of acting."
    behaviours = {"replying": Behaviour("Remind the agent to reply by tag",
                                        "When the agent runs journal message reply, it is told the reply tag does the same")}
    NAMES = "names"
    RUNS = "runs"
    PLACES = "places"
    VERBOSITY = "verbosity"
    SINCE = "since"

    def settings_view(self, record) -> dict:
        return {"names": self.names(record), "places": self.places(record), "verbosity": self.verbosity(record), "levels": list(SHOWN)}

    def verbosity(self, record) -> str:
        chosen = self.setting(record, self.VERBOSITY, "replies")
        return chosen if chosen in SHOWN else "replies"

    def names(self, record) -> list[str]:
        return [str(name).strip().lstrip("[!").rstrip("]") for name in self.setting(record, self.NAMES, TAGS) if str(name).strip()] or list(TAGS)

    def reader(self, record) -> re.Pattern:
        return pattern(self.names(record))

    @event("agent.updated")
    @event("agent.said")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent:
            return
        for turn in self.written(record, agent):
            if not self.reader(record).match(turn.text) and not self.already(record, agent, turn, "untagged"):
                self.say(record, agent, "untagged", tags=" ".join(written(self.names(record))))

    @formats
    def without_tags(self, text, record):
        return (self.reader(record) if record else ANY).sub(lambda found: found.group(1) or "", str(text or ""))

    def runs(self, record) -> dict:
        return {**RUNS, **self.setting(record, self.RUNS, {})}

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]

    def already(self, record, agent, turn, kind: str = "tagged") -> bool:
        f = record.root / "runtime" / f"{kind}-{agent.title}.json"
        keys = (*([f"{agent.transcript}:{turn.line}"] if turn.line >= 0 else []), hashlib.sha1(turn.text.strip().encode()).hexdigest())
        with MARKING:
            done = read_json(f, {})
            if any(key in done for key in keys):
                return True
            write_json(f, {**done, **{key: time.time() for key in keys}})
        return False

    @event("agent.updated")
    @event("agent.said")
    def expand(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent:
            return
        shown, since = SHOWN[self.verbosity(record)], float(self.setting(record, self.SINCE, 0) or 0)
        for turn in self.written(record, agent):
            if CARRIED.search(turn.text) and not self.already(record, agent, turn):
                self.carried(record, agent, turn)
            leading = LEADING.match(turn.text)
            carried = CARRIED.match(turn.text)
            if leading and not carried and leading.group(1) in shown and turn.at >= since and not self.already(record, agent, turn, "shown"):
                self.show(record, leading.group(1), turn)

    def show(self, record, tag: str, turn) -> None:
        text = LEADING.sub("", turn.text, count=1).strip()
        if text:
            Messages(record, actor=AGENT).create(titled(text), brief=text, tag=tag)

    def written(self, record, agent) -> list:
        spoken = [Turn(line=-1, who="agent", text=agent.said, at=time.time())] if agent.said and agent.event == "Stop" else []
        recent = [t for t in (turns(record, agent)[-RECENT_TURNS:] if agent.transcript else []) if time.time() - t.at < RECENT_SECONDS]
        return [*recent, *spoken]

    def carried(self, record, agent, turn) -> None:
        from commands.cli import run
        runs, text = self.runs(record), CARRIED.sub("", self.reader(record).sub("", turn.text)).strip()
        for name, n, argument in CARRIED.findall(turn.text):
            if name not in runs:
                continue
            said, wrong = io.StringIO(), io.StringIO()
            code = run(["--root", str(record.root), "--env", record.env, "--session", agent.title, "--as", AGENT,
                        *self.argv(runs[name], n, argument, text)], out=said, err=wrong)
            if code:
                self.say(record, agent, "refused", private=True, tag=name, on=n or argument, said=(wrong.getvalue() or said.getvalue()).strip())

    @interceptor
    def replied(self, provider, record, hook, session) -> str:
        found = REPLIED.search(hook.tool.command) if self.on(record, "replying") and "--file" not in hook.tool.command else None
        if found:
            self.say(record, Agents(record, actor=SYSTEM).by_session(session), "by tag", private=True, n=found.group(1))
        return ""

    def places(self, record) -> dict:
        return {**PLACES, **self.setting(record, self.PLACES, {})}

    def place(self, text: str, record) -> str:
        found = LEADING.match(str(text or ""))
        return self.places(record).get(found.group(1), "chat") if found else "chat"
