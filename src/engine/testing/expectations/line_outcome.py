from dataclasses import dataclass
from engine.testing.expectations.text_match import ExpectedText, contains_line, contains_text


@dataclass(frozen=True)
class LineOutcome:
    """What one command line gave back: its exit code and what it printed."""

    line: str
    code: int
    output_text: str

    def expect_code(self, code: int) -> None:
        assert self.code == code, f"{self.line} gave {self.code}, not {code}: {self.output_text}"

    def expect_text(self, *texts: ExpectedText) -> None:
        missing = [text for text in texts if not contains_text(self.output_text, text)]
        assert not missing, f"{self.line} printed none of {missing}:\n{self.output_text}"

    def expect_no_text(self, *texts: ExpectedText) -> None:
        matching = [text for text in texts if contains_text(self.output_text, text)]
        assert not matching, f"{self.line} printed {matching}:\n{self.output_text}"
