from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from engine.driver.part import Part
from core.modules.drivers.nudges.private_corpus_message import PrivateCorpusMessage

CORPUS_FOLDER = ".journal/corpus"
SANDBOXED_TEST = re.compile(r"^(?:\S+=\S+\s+)*go\s+(?:-C\s+\S+\s+)?test\b")
SANDBOXED_TEST_ALIAS = re.compile(r"^journal\s+alias\s+add\s+\S+\s+[\"']?(?:\S+=\S+\s+)*go\s+(?:-C\s+\S+\s+)?test\b[^;&|<>]*[\"']?(?:\s+--category\s+[\"']?[\w ]+[\"']?)?$")


class PrivateCorpusPolicy(EventPolicy):
    """The private command corpus under .journal/corpus is never named by a shell line, whoever runs it, except to
    hand its path to a go test, which the corpus tests run in a sandbox; the refusal has no skip."""

    key = "drivers.private-corpus"
    rank = "safety.all"
    is_safety = True
    grant_types = []


    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return None
        names_corpus = any(CORPUS_FOLDER in redirect for redirect in shell.redirects) or any(self.has_private_corpus(part) for part in shell.parts)
        return PrivateCorpusMessage.declared().nudge() if names_corpus else None

    @staticmethod
    def has_private_corpus(part: Part) -> bool:
        return CORPUS_FOLDER in part.text and not (SANDBOXED_TEST.match(part.text.strip()) or SANDBOXED_TEST_ALIAS.match(part.text.strip()))
