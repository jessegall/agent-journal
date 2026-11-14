from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from core.modules.drivers.rules.compaction_instructions_rule import INSTRUCTIONS_LIMIT, CompactionInstructionsRule
from engine.driver.agent_hook import AgentHook
from engine.driver.hook_event import HookEvent
from engine.driver.rule_outcome import RuleOutcome
from engine.enums.hook_event_name import HookEventName
from engine.provider.errors.unknown_program_error import UnknownProgramError
from engine.provider.providers import Providers
from engine.time.timestamp import Timestamp

TIMESTAMP = Timestamp(datetime(2026, 11, 14, 9, tzinfo=timezone.utc))


class ProgramInstructions(Providers):
    """The providers of one program whose compaction instructions are the given text."""

    def __init__(self, instructions: str) -> None:
        self.instructions = instructions

    def provider(self, program: str):  # type: ignore[override]
        return SimpleNamespace(compaction_instructions=self.instructions)


class NoProgram(Providers):
    """Providers that know no program, so reading the provider's text fails."""

    def __init__(self) -> None:
        pass

    def provider(self, program: str):  # type: ignore[override]
        raise UnknownProgramError(f"no module provides the agent program {program!r}")


def compaction(custom_instructions: object = None) -> AgentHook:
    event = HookEvent(1, "claude", HookEventName.COMPACT, "s1", "f1", 1, "agent", "main", None, None,
                      {"trigger": "manual", "custom_instructions": custom_instructions})
    return AgentHook(event, 3, 1, "worker", "coding.worker", TIMESTAMP)


def answered_lines(instructions: str, hook: AgentHook) -> tuple[str, ...]:
    return CompactionInstructionsRule(ProgramInstructions(instructions)).answer(hook).lines


def test_it_answers_with_the_providers_text():
    assert answered_lines("Keep the task and the request.", compaction()) == ("Keep the task and the request.",)


def test_an_empty_text_adds_no_line():
    assert answered_lines("", compaction()) == ()


def test_it_cuts_a_long_text_at_10000_characters():
    assert [len(line) for line in answered_lines("k" * 12_000, compaction())] == [INSTRUCTIONS_LIMIT] == [10_000]


def test_it_never_refuses():
    assert not CompactionInstructionsRule(ProgramInstructions("Keep the task.")).answer(compaction()).refusal
    assert not CompactionInstructionsRule(ProgramInstructions("")).answer(compaction()).refusal


def test_the_persons_own_text_is_kept_as_p5_decides():
    # report 1456: Claude Code joins the person's /compact text with the hook's stdout, so the rule adds only its own
    assert answered_lines("Keep the task.", compaction("keep the word BANANA")) == ("Keep the task.",)


def test_a_fault_reading_the_providers_text_never_refuses_the_compaction():
    # the rule raises and the rule walk passes it by with an allowed answer that holds only a notice line
    with pytest.raises(UnknownProgramError):
        CompactionInstructionsRule(NoProgram()).answer(compaction())
    passed_by = RuleOutcome.raised("the journal's rule drivers.compaction-instructions failed and was passed by").answer
    assert passed_by.refusal == "" and not passed_by.updated_input


def test_the_instructions_never_pass_10000_characters():
    assert all(len(line) <= 10_000 for line in answered_lines("word " * 20_000, compaction()))
