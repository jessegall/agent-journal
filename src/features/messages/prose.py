import re

from engine.events.agents import AgentReported
from engine.events.engine import AgentMessageSent
from features.parts import AgentContext, Handler
from providers.turns import last_text
from resources.base import AGENT, ENVIRONMENT
from resources.types import TYPES

RUN_ON, SENTENCES = 400, 3


class NameRunTogether(Handler):
    behaviour = "paragraphs"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        last = last_text(context.agent.row).strip()
        if len(last) >= RUN_ON and "\n\n" not in last and last.count(". ") >= SENTENCES:
            context.agent.whisper("paragraphs")


STANDALONE = re.compile(r"(?<![\w.,:/–—-])#?(\d+)(?![\w%:/–—-]|[.,]\d)")
QUOTED = re.compile(r"`[^`]*`|\"[^\"]*\"|“[^”]*”")
LISTED = re.compile(r"^\s*\d+[.)]\s", re.MULTILINE)
NAMING = {"to-do", "to-dos", "version", "v", "line", "lines", "phase", "step", "port", "revision", "revisions", "number", "page", "row", "rows",
          "commit", "id", "of", "and", "or", "under", "over", "than", "above", "below", "about", "around", "least", "most", "nearly",
          "only", "every", "first", "last", "top", "within", "past", "after"}
VERBS = {"waits", "needs", "holds", "runs", "goes", "shows", "stays", "keeps", "closes", "opens", "starts", "ends", "lands", "takes",
         "gets", "makes", "sits", "asks", "says", "works", "fails", "passes", "comes", "becomes", "belongs", "covers", "lists", "reads"}
COUNTING = {"passed", "failed", "more", "left", "of", "per", "out", "times", "ms", "kb", "mb", "px", "percent", "in"}


def typed_before(text: str) -> bool:
    words = re.findall(r"[\w-]+", text.lower())[-1:]
    return bool(words) and (words[0] in NAMING or words[0].rstrip("s") in TYPES)


def unit_after(text: str) -> bool:
    words = re.match(r"[ \t]*([a-z]+)(?:[ \t]+([a-z]+))?", text.lower())
    return bool(words) and (words.group(1) in COUNTING or any(len(w) > 3 and w.endswith("s") and w not in VERBS for w in words.groups() if w))


HANDLED = re.compile(r"\b(?:repl(?:y|ied|ying) to|answer(?:ed|ing)?|clos(?:ed|ing)|fil(?:ed|ing)|start(?:ed|ing)|park(?:ed|ing)|resum(?:ed|ing)|end(?:ed|ing)"
                     r"|finish(?:ed|ing)|struck|reopen(?:ed|ing)|process(?:ed|ing))\s+#?$", re.IGNORECASE)
SMALL = 100


def bare(text: str) -> list[int]:
    text = LISTED.sub("", QUOTED.sub("", text))
    return list(dict.fromkeys(int(m.group(1)) for m in STANDALONE.finditer(text)
                              if not typed_before(text[max(0, m.start() - 24):m.start()]) and not unit_after(text[m.end():m.end() + 16])
                              and (int(m.group(1)) >= SMALL or HANDLED.search(text[max(0, m.start() - 24):m.start()]))))


class NameBareNumbers(Handler):
    behaviour = "numbers"

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        found = bare(event.text)
        if not found:
            return
        known = numbers(context)
        named = [str(n) for n in found if n in known]
        sent = next((m for m in reversed(context.journal.messages.summaries()) if m["seen"][:1] == [AGENT]), None)
        if named and sent:
            context.agent.whisper("numbers", n=sent["n"], numbers=", ".join(named))


def numbers(context: AgentContext) -> set[int]:
    return {row["n"] for name, type_ in TYPES.items() if type_.scope == ENVIRONMENT for row in context.journal.of(name).summaries()}
