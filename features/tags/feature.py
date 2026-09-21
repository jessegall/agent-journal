import io
import re

from controllers.types import Agents, Messages, Nudges
from features.base import Behaviour, Feature, event, formats, interceptor, Line
from resources.base import AGENT, SYSTEM, titled

TAGS = ("discovery", "correction", "blocked", "info", "reply")
RUNS = {"reply": "message reply {n} {text}", "log": "work log {text} --n {n}", "end": "work end {n} --how {text}",
        "todo": "todo create {name} --brief {text}", "fact": "fact create {name} --brief {text}"}
PLACES = {"info": "bar"}
LEVEL = "info"
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
    lines = {"untagged": Line("your last message has no tag", "open every message with one of {{tags}} - a message without one does not reach the chat; just add the tag, never mention tags to the user", lead=True),
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

    def settings_view(self, record) -> dict:
        return {"names": self.names(record), "places": self.places(record), "verbosity": self.verbosity(record), "levels": list(SHOWN)}

    def verbosity(self, record) -> str:
        chosen = self.setting(record, self.VERBOSITY, LEVEL)
        return chosen if chosen in SHOWN else LEVEL

    def names(self, record) -> list[str]:
        return [str(name).strip().lstrip("[!").rstrip("]") for name in self.setting(record, self.NAMES, TAGS) if str(name).strip()] or list(TAGS)

    def reader(self, record) -> re.Pattern:
        return pattern(self.names(record))

    @event("agent.said")
    def said(self, event, record) -> None:
        agent, text = self.agent(event, record), str(event.data.get("text") or "")
        if agent and text.strip():
            self.check(record, agent, text)
            self.expand(record, agent, text)

    def check(self, record, agent, text: str) -> None:
        if not self.reader(record).match(text) and not self.already(record, agent.title, "untagged", text) and not self.waiting(record, agent):
            self.journal.say(record, agent, "untagged", tags=" ".join(written(self.names(record))))

    def waiting(self, record, agent) -> bool:
        title = self.lines["untagged"].title
        return any(n.title == title and n.data.get("session") == agent.title and AGENT not in n.seen for n in self.standing(record, Nudges))

    @formats
    def without_tags(self, text, record):
        return (self.reader(record) if record else ANY).sub(lambda found: found.group(1) or "", str(text or ""))

    def runs(self, record) -> dict:
        return {**RUNS, **self.setting(record, self.RUNS, {})}

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]

    def expand(self, record, agent, text: str) -> None:
        if CARRIED.search(text) and not self.already(record, agent.title, "tagged", text):
            self.carried(record, agent, text)
        leading = LEADING.match(text)
        if leading and not CARRIED.match(text) and leading.group(1) in SHOWN[self.verbosity(record)] and not self.already(record, agent.title, "shown", text):
            self.show(record, leading.group(1), text)

    def show(self, record, tag: str, said: str) -> None:
        text = LEADING.sub("", said, count=1).strip()
        if text:
            Messages(record, actor=AGENT).create(titled(text), brief=text, tag=tag)

    def carried(self, record, agent, said: str) -> None:
        from commands.cli import run
        runs, text = self.runs(record), CARRIED.sub("", self.reader(record).sub("", said)).strip()
        for name, n, argument in CARRIED.findall(said):
            if name not in runs:
                continue
            out, err = io.StringIO(), io.StringIO()
            code = run(["--root", str(record.root), "--env", record.env, "--session", agent.title, "--as", AGENT,
                        *self.argv(runs[name], n, argument, text)], out=out, err=err)
            if code:
                self.journal.whisper(record, agent, "refused", tag=name, on=n or argument, said=(err.getvalue() or out.getvalue()).strip())

    @interceptor
    def replied(self, provider, record, hook, session) -> str:
        found = REPLIED.search(hook.tool.command) if self.on(record, "replying") and "--file" not in hook.tool.command else None
        if found:
            self.journal.whisper(record, Agents(record, actor=SYSTEM).by_session(session), "by tag", n=found.group(1))
        return ""

    def places(self, record) -> dict:
        return {**PLACES, **self.setting(record, self.PLACES, {})}

    def place(self, text: str, record) -> str:
        found = LEADING.match(str(text or ""))
        return self.places(record).get(found.group(1), "chat") if found else "chat"
