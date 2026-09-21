import io
import re
import time

from features import trigger
from engine.stored import read_json, write_json
from features.base import Behaviour, Feature, event, formats, Line
from resources.base import AGENT
from engine.transcript import last_said, last_turn

TAGS = ("discovery", "correction", "blocked", "info", "reply")
RUNS = {"reply": "message reply {n} {text}", "log": "work log {text} --n {n}", "end": "work end {n} --how {text}",
        "todo": "todo create {name} --brief {text}", "fact": "fact create {name} --brief {text}"}
PLACES = {"info": "bar"}
ARGUMENT = r'(?::[^\]\s]+|="[^"]*")?'
LEADING = re.compile(r"^[ \t]*(?:>\s?)?(?:\*\*)?\[!([a-z]+)" + ARGUMENT + r"\]")
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
    lines = {"untagged": Line("your last message has no tag", "open every message with exactly one of {{tags}}"),
             "refused": Line("the {{tag}} tag on {{on}} did not run", "{{said}}")}
    title_ = "Tagging"
    abstract_ = "A message opens with one tag, and a tag carrying a number runs the command it stands for"
    help_ = "The tags are settings. tags.names lists them and tags.runs maps a tag to the command it stands for, so [!reply:12] runs journal message reply 12 with the turn as its text, and [!todo=\"the title\"] files a to-do with that title and the turn as its brief. A tag runs once, keyed to the turn it came from; two tags in one turn run in the order they appear; and a refusal comes back as a nudge on the next turn rather than at the moment of acting."
    behaviours = {"naming": Behaviour("Name a message that opens without a tag",
                                      "Said at the end of the turn, every turn, until one is used",
                                      trigger={"on": trigger.IDLE}),
                  "running": Behaviour("Run the command a tag stands for",
                                       "A tag carrying a number runs its command with the turn as the text",
                                       trigger={"on": trigger.IDLE})}
    NAMES = "names"
    RUNS = "runs"
    PLACES = "places"

    def settings_view(self, record) -> dict:
        return {"names": self.names(record), "places": self.places(record)}

    def names(self, record) -> list[str]:
        return [str(name).strip().lstrip("[!").rstrip("]") for name in self.setting(record, self.NAMES, TAGS) if str(name).strip()] or list(TAGS)

    def reader(self, record) -> re.Pattern:
        return pattern(self.names(record))

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        if not self.due(record, agent, "naming"):
            return
        said = last_said(record, agent)
        if said and not self.reader(record).match(said):
            self.say(record, agent, "untagged", tags=" ".join(written(self.names(record))))

    @formats
    def without_tags(self, text, record):
        return (self.reader(record) if record else ANY).sub(lambda found: found.group(1) or "", str(text or ""))

    def runs(self, record) -> dict:
        return {**RUNS, **self.setting(record, self.RUNS, {})}

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]

    def already(self, record, agent, turn) -> bool:
        f = record.root / "runtime" / f"tagged-{agent.title}.json"
        done = read_json(f, {})
        key = f"{agent.transcript}:{turn.line}"
        if key in done:
            return True
        write_json(f, {**done, key: time.time()})
        return False

    @event("agent.updated")
    def expand(self, event, record) -> None:
        from commands.cli import run
        agent = self.agent(event, record)
        if not agent or not self.due(record, agent, "running"):
            return
        turn = last_turn(record, agent)
        carried = CARRIED.findall(turn.text) if turn else []
        if not carried or self.already(record, agent, turn):
            return
        runs, text = self.runs(record), CARRIED.sub("", self.reader(record).sub("", turn.text)).strip()
        for name, n, argument in carried:
            if name not in runs:
                continue
            said, wrong = io.StringIO(), io.StringIO()
            code = run(["--root", str(record.root), "--env", record.env, "--session", agent.title, "--as", AGENT,
                        *self.argv(runs[name], n, argument, text)], out=said, err=wrong)
            if code:
                self.say(record, agent, "refused", private=True, tag=name, on=n or argument, said=(wrong.getvalue() or said.getvalue()).strip())

    def places(self, record) -> dict:
        return {**PLACES, **self.setting(record, self.PLACES, {})}

    def place(self, text: str, record) -> str:
        found = LEADING.match(str(text or ""))
        return self.places(record).get(found.group(1), "chat") if found else "chat"
