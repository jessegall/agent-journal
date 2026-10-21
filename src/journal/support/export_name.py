import re
import shutil

UNSAFE = re.compile(r"[^\w .,()-]+")
LONGEST = 80
CONVERTER = "textutil"


class ExportName:
    """The file a row is downloaded as: its title with the characters a file name cannot hold removed, .docx where textutil can make one, else .html."""

    @classmethod
    def build(cls, title: str, fallback: str) -> str:
        return f"{cls.stem(title) or fallback}.{cls.extension()}"

    @staticmethod
    def stem(title: str) -> str:
        return UNSAFE.sub("", title).strip()[:LONGEST]

    @staticmethod
    def extension() -> str:
        return "docx" if shutil.which(CONVERTER) else "html"
