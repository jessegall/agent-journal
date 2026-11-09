import json
from pathlib import Path

from core.base.database.database import Database
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from tests.stories.support.story_checks import expect_count_shown, expect_value, expect_greater, expect_visited_limit

PROMPT = HookSamples.prompt("go on")
REMINDERS = 12
REMINDER_READS_ALLOWED = 4
TRANSCRIPT_LINES = 4000


def envelope(text: str) -> str:
    return f'<cross-session-message from-name="shop-e6" from-mode="bypass">\n{text}\n</cross-session-message>'


def queued(text: str) -> str:
    return json.dumps({"type": "queue-operation", "operation": "enqueue", "timestamp": f"2026-11-03T05:00:{len(text):02d}Z", "content": envelope(text)}) + "\n"


class CountingFile:
    """A file opened for reading whose bytes are counted as they are read."""

    def __init__(self, wrapped, counts: list[int]) -> None:
        self.wrapped, self.counts = wrapped, counts

    def read(self, *arguments):
        data = self.wrapped.read(*arguments)
        self.counts.append(len(data))
        return data

    def __getattr__(self, name):
        return getattr(self.wrapped, name)

    def __enter__(self):
        self.wrapped.__enter__()
        return self

    def __exit__(self, *arguments):
        return self.wrapped.__exit__(*arguments)


def bytes_read_during(monkeypatch, path: Path, work) -> int:
    counts: list[int] = []
    opened = Path.open

    def counting(self, *arguments, **options):
        file = opened(self, *arguments, **options)
        return CountingFile(file, counts) if self == path and "b" in (arguments[0] if arguments else options.get("mode", "")) else file

    monkeypatch.setattr(Path, "open", counting)
    work()
    monkeypatch.setattr(Path, "open", opened)
    return sum(counts)


def selects_during(story, work) -> list[str]:
    connection = story.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    work()
    connection.set_trace_callback(None)
    return [statement for statement in statements if statement.lstrip().upper().startswith("SELECT") and ("reminders" in statement or "hook_calls" in statement)]


def test_a_hook_reads_the_open_reminders_and_counts_tool_uses_in_a_few_queries(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(REMINDERS):
        story.expect_success(f'reminder make "Log {number}" --every-tool-uses 1000 --every-tasks 1000 --environment main', actor=story.agent)
    story.hook("s-1", PROMPT)
    reads = selects_during(story, lambda: story.hook("s-1", PROMPT))
    expect_visited_limit(reads, REMINDER_READS_ALLOWED)


def transcript_story(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    path = tmp_path / "transcript.jsonl"
    filler = json.dumps({"type": "assistant", "message": "x" * 200}) + "\n"
    path.write_text(filler * TRANSCRIPT_LINES + queued("look at the cart"))
    return story, path, PROMPT.with_raw({"transcript_path": str(path)})


def test_a_second_hook_over_an_unchanged_transcript_reads_none_of_it(new_story, tmp_path, monkeypatch):
    story, path, hook = transcript_story(new_story, tmp_path)
    first = bytes_read_during(monkeypatch, path, lambda: story.hook("s-1", hook))
    second = bytes_read_during(monkeypatch, path, lambda: story.hook("s-1", hook))
    expect_greater(first, 0)
    expect_value(second, 0)


def test_a_hook_over_a_transcript_that_grew_reads_only_what_was_added(new_story, tmp_path, monkeypatch):
    story, path, hook = transcript_story(new_story, tmp_path)
    story.hook("s-1", hook)
    added = json.dumps({"type": "assistant", "message": "later"}) + "\n"
    with path.open("a") as transcript:
        transcript.write(added)
    read = bytes_read_during(monkeypatch, path, lambda: story.hook("s-1", hook))
    expect_value(read, len(added.encode()))
