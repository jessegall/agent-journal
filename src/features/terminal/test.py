from engine.hooks import handle
from features.terminal.log import COMMANDS, JOURNAL, MOST_LINES, lines
from providers import PROVIDERS
from tests.conftest import fresh


def ran(record, command: str, printed: str) -> None:
    claude, call = PROVIDERS["claude"](), {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}}
    handle(claude, record.root, record.env, {**call, "hook_event_name": "PreToolUse"})
    handle(claude, record.root, record.env, {**call, "hook_event_name": "PostToolUse", "tool_response": {"stdout": printed}})


def test_shell_commands_are_kept_with_their_output_and_journal_calls_are_left_out():
    record = fresh()
    ran(record, "seq 100", "\n".join(map(str, range(1, 101))))
    ran(record, "cd /tmp && journal message read 12", "done")
    ran(record, "journal todo all | head", "rows")
    ran(record, "tail -3 .journal/runtime/engine.log", "log")
    kept = lines(record, "claude-1", COMMANDS)
    assert [line["command"] for line in kept] == ["seq 100"], "only the shell command is kept, not the journal's own calls or reads of its folder"
    assert [line["command"] for line in lines(record, "claude-1", JOURNAL)][1:] == ["cd /tmp && journal message read 12", "journal todo all | head",
                                                                              "tail -3 .journal/runtime/engine.log"], "the journal level adds them back"
    printed = kept[0]["output"].splitlines()
    assert (printed[0], len(printed), printed[-1]) == ("1", MOST_LINES + 1, f"… {100 - MOST_LINES} more lines were not kept"), "the output is cut to its first lines"
