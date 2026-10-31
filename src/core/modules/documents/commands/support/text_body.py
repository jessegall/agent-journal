from argparse import Namespace
from pathlib import Path

from core.base.refusal import Refusal


class TextBody:
    """The text a document or report is given: --body as text_row, or the contents of --file."""

    @staticmethod
    def given(arguments: Namespace) -> str | None:
        if arguments.body is not None and arguments.file is not None:
            raise Refusal("give the text with --body or with --file, not both", "drop one of them")
        if arguments.file is not None:
            path = Path(arguments.file)
            if not path.is_file():
                raise Refusal(f"no such file: {arguments.file}", "name a markdown file")
            return path.read_text()
        return None if arguments.body is None else arguments.body.replace("\\n", "\n")
