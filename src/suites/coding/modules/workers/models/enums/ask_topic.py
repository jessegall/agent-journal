from enum import StrEnum


class AskTopic(StrEnum):
    """What a worker asks the merger about, each with what it does while the answer comes."""

    JUDGE = "judge"
    TESTS = "tests"
    BUILT = "built"
    CONFLICT = "conflict"
    TOOL = "tool"
    GENERAL = "general"

    def waiting_work(self) -> str:
        return WAITING_WORK_LINES[self]

    def ask_line(self) -> str:
        return f'If you cannot go on: journal worker ask "<what>" --about {self.value}'

    def hint(self, fix: str) -> str:
        return f"{fix}. {self.ask_line()}"


WAITING_WORK_LINES = {
    AskTopic.JUDGE: "fix the sins in your own files, leave the rest, and go on",
    AskTopic.TESTS: "work on the next task or prove what you have while the answer comes",
    AskTopic.BUILT: "prove each point with where it is and hand in with --differences already built: <where>, then go on to the next task",
    AskTopic.CONFLICT: "settle what you can in the named files",
    AskTopic.TOOL: "do the part that needs no such tool",
    AskTopic.GENERAL: "go on with anything the task still holds, or stop",
}
