import re
from collections.abc import Iterator
from pathlib import Path

from core.modules.developer.support.private_data_finding import PrivateDataFinding
from core.modules.developer.support.private_data_kind import PrivateDataKind

PLACEHOLDER_NAMES = frozenset({"user", "username", "you", "name", "me", "example", "someone", "person", "runner", "yourname", "your-name", "shared", "home", "a", "ada", "alice", "bob", "carol", "ci", "test",
                               "processes", "coding.builder", "marketing.lead"})
EMAIL_ENDINGS = frozenset({"com", "org", "net", "edu", "gov", "io", "co", "dev", "ai", "app", "me", "info"})
FILE_ENDINGS = frozenset({"md", "py", "js", "ts", "sh", "go", "rs", "rb", "cs"})
SKIPPED_PATHS = ("/web/dist/", "tools/journal-hook/testdata/", "tools/journal-hook/programs/testdata/", "tools/journal-hook/anonymise/")
FAKE_DOMAINS = ("example.com", "example.org", "example.net", "localhost", "invalid", "test", "users.noreply.github.com", "anthropic.com")
RECORDING_SUFFIXES = (".cast", ".rec", ".recording", ".har")
SANITISED_MARKS = ("sanitised", "sanitized")
TEXT_SUFFIX_LIMIT = 1_000_000

EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})")
HOME_PATH = re.compile(r"(?:/Users|/home)/([A-Za-z0-9_-][A-Za-z0-9._-]*)/")
SESSION_ID = re.compile(r"session[_ -]?id[\"']?\s*[:=]\s*[\"']?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.IGNORECASE)
TOKEN = re.compile(r"\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,})")
KEY = re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")
TRANSCRIPT = re.compile(r"^\s*\{.*\"sessionId\".*\"(?:message|content)\"")


class PrivateDataScan:
    """Looks through one file for private data and says where, by line and kind: an email address, the home folder of a real
    user, a session id, a token or key shape, the journal's own message or transcript text, a recording not marked sanitised.
    Built files and the anonymised hook recordings are left out."""

    def scan(self, file: Path, text: str) -> list[PrivateDataFinding]:
        shown = str(file)
        if any(part in f"/{shown}" for part in SKIPPED_PATHS):
            return []
        if file.suffix in RECORDING_SUFFIXES and not any(mark in text.lower() for mark in SANITISED_MARKS):
            return [PrivateDataFinding(shown, 1, PrivateDataKind.RECORDING)]
        return [PrivateDataFinding(shown, number, kind) for number, line in enumerate(text.splitlines(), 1) for kind in self.kinds(line)]

    @staticmethod
    def is_real_email_domain(domain: str) -> bool:
        ending = domain.rsplit(".", 1)[-1]
        return not domain.endswith(FAKE_DOMAINS) and ending not in FILE_ENDINGS and (ending in EMAIL_ENDINGS or len(ending) == 2)

    def kinds(self, line: str) -> Iterator[PrivateDataKind]:
        if any(self.is_real_email_domain(match.group(1).lower()) for match in EMAIL.finditer(line)):
            yield PrivateDataKind.EMAIL
        if any(match.group(1).lower() not in PLACEHOLDER_NAMES for match in HOME_PATH.finditer(line)):
            yield PrivateDataKind.HOME_PATH
        for kind, pattern in ((PrivateDataKind.SESSION_ID, SESSION_ID), (PrivateDataKind.TOKEN, TOKEN), (PrivateDataKind.KEY, KEY), (PrivateDataKind.TRANSCRIPT, TRANSCRIPT)):
            if pattern.search(line):
                yield kind
