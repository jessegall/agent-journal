from argparse import ArgumentTypeError


class InvalidTextList(ArgumentTypeError):
    @classmethod
    def for_text(cls, text: str) -> "InvalidTextList":
        return cls(f"{text!r} is not a JSON list of strings")
