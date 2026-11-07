import json
from pathlib import Path

import pytest

from core.base.provider.provider import Provider
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.codex.providers.codex_provider import CodexProvider

RECORDED = Path("tools/journal-hook/testdata/recorded")


def recorded_tools(program: str) -> set[str]:
    bodies = [json.loads(line) for line in (RECORDED / program / "PreToolUse.jsonl").read_text().splitlines()]
    return {body["tool_name"] for body in bodies}


def expect_listed(program: str, provider: type[Provider], tools: set[str]) -> None:
    assert tools <= recorded_tools(program)
    assert tools - set(provider.tool_categories) <= set(provider.safe_tools)


def expect_apart(provider: type[Provider]) -> None:
    assert not set(provider.safe_tools) & set(provider.tool_categories)


@pytest.mark.parametrize("program, provider, tools", [("claude", ClaudeCodeProvider, {"WebFetch", "WebSearch", "ToolSearch"}),
                                                      ("codex", CodexProvider, {"webrun", "list_mcp_resources", "create_goal", "update_goal"})])
def test_each_program_really_called_the_tools_it_lists(program, provider, tools):
    expect_listed(program, provider, tools)


@pytest.mark.parametrize("provider", [ClaudeCodeProvider, CodexProvider])
def test_a_safe_tool_keeps_out_of_the_global_categories(provider):
    expect_apart(provider)
