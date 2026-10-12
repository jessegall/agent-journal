import re

from events.agents import AgentReported
from events.agents import AgentMessageSent
from framework.parts import AgentContext, Handler
from serving import SERVED, Providers
from resources.base import AGENT, ENVIRONMENT
from resources.types import TYPES
from controllers.types import CONTROLLERS, Messages

RUN_ON, SENTENCES = 400, 3


class NameRunTogether(Handler):
    behaviour = "paragraphs"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        last = SERVED.given(Providers).last_said(context.agent.row).strip()
        if len(last) >= RUN_ON and "\n\n" not in last and last.count(". ") >= SENTENCES:
            context.agent.whisper("paragraphs")


STANDALONE = re.compile(r"(?<![\w.,:/–—-])#?(\d+)(?![\w%:/–—-]|[.,]\d)")
QUOTED = re.compile(r"`[^`]*`|\"[^\"]*\"|“[^”]*”")
LISTED = re.compile(r"^\s*\d+[.)]\s", re.MULTILINE)
NAMING = {"all", "to-do", "to-dos", "version", "v", "line", "lines", "phase", "step", "port", "revision", "revisions", "number", "page", "row", "rows",
          "commit", "id", "pr", "request", "issue", "build", "of", "and", "or", "under", "over", "than", "above", "below", "about", "around", "least", "most", "nearly",
          "only", "every", "first", "last", "top", "within", "past", "after", "http", "status", "code", "exit", "average", "averages"}
VERBS = {"waits", "needs", "holds", "runs", "goes", "shows", "stays", "keeps", "closes", "opens", "starts", "ends", "lands", "takes",
         "gets", "makes", "sits", "asks", "says", "works", "fails", "passes", "comes", "becomes", "belongs", "covers", "lists", "reads"}
COUNTING = {"passed", "failed", "more", "left", "of", "per", "out", "times", "ms", "s", "sec", "min", "h", "kb", "mb", "gb", "px", "percent", "in"}


def typed_before(text: str) -> bool:
    words = re.findall(r"[\w-]+", text.lower())[-1:]
    return bool(words) and (words[0] in NAMING or words[0].rstrip("s") in TYPES)


def unit_after(text: str) -> bool:
    words = re.match(r"[ \t]*([a-z]+)(?:[ \t]+([a-z]+))?(?:[ \t]+([a-z]+))?", text.lower())
    return bool(words) and (words.group(1) in COUNTING or any(len(w) > 3 and w.endswith("s") and w not in VERBS for w in words.groups() if w))


HANDLED = re.compile(r"\b(?:repl(?:y|ied|ying) to|answer(?:ed|ing)?|clos(?:ed|ing)|fil(?:ed|ing)|start(?:ed|ing)|park(?:ed|ing)|resum(?:ed|ing)|end(?:ed|ing)"
                     r"|finish(?:ed|ing)|struck|reopen(?:ed|ing)|process(?:ed|ing))\s+#?$", re.IGNORECASE)
SMALL = 100
STATUS = re.compile(r"\b(?:answers?|answered|returns?|returned|responds?|responded|status|http|errors?|code|came back|comes back|come back|fails? with|failed with)"
                    r"\s+(?:with\s+)?(?:an?\s+)?(?:(?:http|status|error)\s+)*$", re.IGNORECASE)
STATUSES = range(100, 600)


def is_status(before: str, value: int) -> bool:
    """A number in the range of HTTP statuses right after a word that reports one, such as the server answered 500."""
    return value in STATUSES and bool(STATUS.search(before))


MEASURED = re.compile(r"\b(?:load|loads|average|averages|memory|cpu|size|width|height|depth|rate|budget|score|temperature)"
                      r"(?:\s+(?:of|was|were|is|are|at|hit|reached|around|about))*\s*:?\s*$", re.IGNORECASE)
AGAINST = re.compile(r"^[ \t]*(?:on|of|out of|against|over|per)[ \t]+\d", re.IGNORECASE)


def is_measurement(before: str, after: str) -> bool:
    """A number the sentence has already said what it measures, such as the load was 395, or one joined to a second number by on, of or against, as in 395 on 10 cores. Neither is a row the user can open."""
    return bool(MEASURED.search(before)) or bool(AGAINST.match(after))


def bare(text: str) -> list[int]:
    text = LISTED.sub("", QUOTED.sub("", text))
    return list(dict.fromkeys(int(m.group(1)) for m in STANDALONE.finditer(text)
                              if not typed_before(text[max(0, m.start() - 24):m.start()]) and not unit_after(text[m.end():m.end() + 28])
                              and not is_status(text[max(0, m.start() - 40):m.start()], int(m.group(1)))
                              and not is_measurement(text[max(0, m.start() - 40):m.start()], text[m.end():m.end() + 28])
                              and (int(m.group(1)) >= SMALL or HANDLED.search(text[max(0, m.start() - 24):m.start()]))))


class NameBareNumbers(Handler):
    behaviour = "numbers"

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        found = bare(event.text)
        if not found:
            return
        known = numbers(context)
        named = [str(n) for n in found if n in known]
        sent = next((m for m in reversed(context.journal.get(Messages).rows.summaries()) if m["seen"][:1] == [AGENT]), None)
        if named and sent:
            context.agent.whisper("numbers", n=sent["n"], numbers=", ".join(named))


NAMED_WITHIN = 3600.0
"""How lately a row must have been written for a bare number to be read as naming it. An older row's number is far more likely to be a quantity the agent is reporting - a count of tests, a size, a port - than a reference to the row."""


def numbers(context: AgentContext) -> set[int]:
    """The rows a bare number could be naming: those written within the hour before the record's newest row. Recency is read from the record rather than from the wall clock, so it answers the same in a replayed world as in a live one."""
    written = [(row["n"], row["updated"]) for name, type_ in TYPES.items() if type_.scope == ENVIRONMENT
               for row in context.journal.get(CONTROLLERS[name]).rows.summaries()]
    if not written:
        return set()
    since = max(at for _, at in written) - NAMED_WITHIN
    return {n for n, at in written if at >= since}
