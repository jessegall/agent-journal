from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.codex.providers.codex_provider import CodexProvider
from engine.enums.answer_encoding import AnswerEncoding
from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.hook_event_name import HookEventName


def test_codex_refuses_a_tool_on_stderr_and_falls_back_to_the_runner_only_when_its_rewrite_is_refused() -> None:
    table = CodexProvider.capabilities()
    denial = table.capability(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE)
    rewrite = table.capability(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE)
    assert (denial.encoding, table.supports(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE), rewrite.fallback) == (
        AnswerEncoding.STDERR_EXIT_TWO, True, CapabilityFallback.PROCESS_RUN_REFUSAL)


def test_no_new_capability_is_used_before_its_proof() -> None:
    assert not CodexProvider.capabilities().supports(CapabilityPart.COMPACTION_END, HookEventName.COMPACT)


def test_both_programs_carry_a_refusal_at_a_tool_call_and_at_a_stop() -> None:
    for provider in (ClaudeCodeProvider, CodexProvider):
        table = provider.capabilities()
        assert table.supports(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE) and table.supports(CapabilityPart.STOP_REFUSAL, HookEventName.STOP)
