import ast
from collections import Counter
from pathlib import Path

STORY_FOLDERS = (Path(__file__).parent.parent / "modules", Path(__file__).parent.parent / "base")
STORY_CALLS = {"run", "expect_success", "expect_refusal", "expect_usage_error", "expect_absent", "new_row_id"}
REPEAT_LIMIT = 3


def story_line_counts() -> Counter[tuple[str, str]]:
    lines: Counter[tuple[str, str]] = Counter()
    for folder in STORY_FOLDERS:
        for path in folder.rglob("*.py"):
            for node in ast.walk(ast.parse(path.read_text())):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr in STORY_CALLS and node.args:
                    first = node.args[0]
                    if isinstance(first, ast.Constant) and isinstance(first.value, str):
                        lines[(first.value, path.name)] += 1
    return lines


def test_no_command_line_is_written_out_by_hand_more_than_three_times():
    totals: Counter[str] = Counter()
    files: dict[str, set[str]] = {}
    for (line, file_name), count in story_line_counts().items():
        totals[line] += count
        files.setdefault(line, set()).add(file_name)
    repeated = [f"{line!r} is written {count} times ({', '.join(sorted(files[line]))}): name it in tests/stories/core/support/story_lines.py, such as"
                f" story.run(lines.NEW_ENVIRONMENT), or move it into a fixture the stories start from"
                for line, count in totals.most_common() if count > REPEAT_LIMIT]
    assert not repeated, "\n".join(repeated)
