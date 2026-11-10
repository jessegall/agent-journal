import re

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.access_nudges import PRIVATE_CORPUS

CORPUS_FOLDER = ".journal/corpus"
SANDBOXED_TEST = re.compile(r"^(?:\S+=\S+\s+)*go\s+(?:-C\s+\S+\s+)?test\b")
SANDBOXED_TEST_ALIAS = re.compile(r"^journal\s+alias\s+add\s+\S+\s+[\"']?(?:\S+=\S+\s+)*go\s+(?:-C\s+\S+\s+)?test\b[^;&|<>]*[\"']?(?:\s+--category\s+[\"']?[\w ]+[\"']?)?$")


class PrivateCorpusRule(DriverRule):
    """The private command corpus under .journal/corpus is never named by a shell line, whoever runs it, except to
    hand its path to a go test, which the corpus tests run in a sandbox; the refusal has no skip."""

    name = "drivers.private-corpus"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    overlay_proof = True
    refuses_one_action = "The private command corpus is never named by a shell line, whoever runs it"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        names_corpus = any(CORPUS_FOLDER in redirect for redirect in shell.redirects) or any(self.has_private_corpus(part) for part in shell.parts)
        return RuleAnswer.refused(PRIVATE_CORPUS.nudge()) if names_corpus else RuleAnswer.allowed()

    @staticmethod
    def has_private_corpus(part: Part) -> bool:
        return CORPUS_FOLDER in part.text and not (SANDBOXED_TEST.match(part.text.strip()) or SANDBOXED_TEST_ALIAS.match(part.text.strip()))
