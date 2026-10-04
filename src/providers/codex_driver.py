import re
import time
from pathlib import Path

from providers.base import Asking
from providers.drivers import ANSI, Driver


class CodexDriver(Driver):
    PRODUCT = "the Codex CLI"
    AUTO_ARGS = ("--approve-for-me",)
    SKIP_ARGS = ("--dangerously-bypass-approvals-and-sandbox",)
    APPROVAL_FLAGS = frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})
    TRUSTS_HOOKS = "--dangerously-bypass-hook-trust"
    READY = b"AskCodextodoanything"
    BUSY = b"esctointerrupt"
    ASKING = (b"Wouldyouliketorun", b"Yes,proceed", b"Allowcommand", b"Approve")
    ASKED_COMMAND = re.compile(r"Would you like to run the following command\?.*\$ (.+?)\s*›\s*1\.\s*Yes, proceed", re.S)
    ALLOW = b"y"
    ASKS_ON_SCREEN = True
    QUEUED = b"Messagestobesubmittedafternexttoolcall"
    RUNNING = b"backgroundterminalrunning"
    SEND_NOW = b"\x1b"
    TRUSTING = re.compile(rb"(?:Doyoutrustthecontentsofthisdirectory|Trustthisfolder\?).*?(\d)\.(?:Yes,continue|Trustandcontinue)", re.S)
    UPDATING = re.compile(rb"Updateavailable.*?(\d)\.Skip(?!until)", re.S)
    SCREEN_TAIL = 8192
    OPENING = "The journal started this session."
    CONFIRM_AFTER = 3.0
    RESUME = "resume"
    CONTINUING = ("continue", "--continue")
    name = "codex"

    @classmethod
    def opening(cls, printed: bytes) -> str:
        plain = b"".join(ANSI.sub(b"", printed).split())
        return cls.OPENING if cls.READY in plain and not cls.consent(printed) else ""

    @classmethod
    def consent(cls, printed: bytes) -> bytes:
        plain = b"".join(ANSI.sub(b"", printed).split())
        asked = max((*cls.TRUSTING.finditer(plain), *cls.UPDATING.finditer(plain)), key=lambda match: match.start(), default=None)
        return asked.group(1) + b"\r" if asked and asked.start() > plain.rfind(cls.READY) else b""

    def at_prompt(self) -> bool:
        plain = self._screen()
        return plain.rfind(self.READY) > plain.rfind(self.BUSY) and self.quiet_for() >= self.QUIET

    def asking(self) -> bool:
        plain = self._screen()
        return max(plain.rfind(phrase) for phrase in self.ASKING) > max(plain.rfind(self.READY), plain.rfind(self.BUSY))

    def asked(self) -> Asking | None:
        if not self.asking():
            return None
        found = list(self.ASKED_COMMAND.finditer(self._screen_text()))
        return Asking("exec_command", found[-1][1].strip()[:300] if found else "a command", time.time())

    def _screen_text(self) -> str:
        return self._printed_tail().decode(errors="replace")

    def _screen(self) -> bytes:
        return b"".join(self._printed_tail().split())

    def _printed_tail(self) -> bytes:
        try:
            tail = self.printed.read_bytes()[-self.SCREEN_TAIL:]
        except OSError:
            return b""
        return ANSI.sub(b"", tail)

    def command(self, args: list[str], cwd: Path | None = None) -> list[str]:
        trusted = ["-c", f'projects."{Path(cwd).resolve()}".trust_level="trusted"'] if cwd else []
        trust = [] if self.TRUSTS_HOOKS in args else [self.TRUSTS_HOOKS]
        return ["codex", *trust, *trusted, *self.carried_on(args)]

    @classmethod
    def carried_on(cls, args: list[str]) -> list[str]:
        rest = [arg for arg in args if arg not in cls.CONTINUING]
        if len(rest) < len(args):
            return [cls.RESUME, "--last", *rest]
        if "--resume" in args[:-1]:
            at = args.index("--resume")
            return [cls.RESUME, args[at + 1], *args[:at], *args[at + 2:]]
        return args

    @classmethod
    def resuming(cls, args: list[str]) -> bool:
        return cls.carried_on(args)[:1] == [cls.RESUME]

    @classmethod
    def resumed(cls, args: list[str], conversation: str) -> list[str]:
        if not conversation:
            return args
        rest = cls.carried_on(args)
        if rest[:1] == [cls.RESUME]:
            rest = rest[2:] if len(rest) > 1 and (rest[1] == "--last" or not rest[1].startswith("-")) else rest[1:]
        return [cls.RESUME, conversation, *rest]
