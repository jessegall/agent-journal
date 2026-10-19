import re
from dataclasses import dataclass, replace

TRAILING_CUT = re.compile(r"\s*\|\s*tail(?:\s+(?:-[nc]\s*\+?\d+|-\d+))?\s*$")
"""A pipe into tail that ends a command, cutting what it printed; a head is left, since it may be what stops an endless command."""


@dataclass(frozen=True)
class Part:
    """One command of a chain: whether it is the agent's own, recorded, or the shell's own wrapping, run in silence; whether it runs whatever the part before it came to (after a ;) or only after a success (after a &&); and whether a && follows it, so that its failure must not end a shell under set -e."""

    text: str
    recorded: bool = True
    always: bool = True
    guarded: bool = False

    def kind(self) -> str:
        return ("R" if self.recorded else "S") + (";" if self.always else "&") + ("&" if self.guarded else ";")

    def cut(self) -> str:
        """The trailing | tail of the agent's own command, outside quotes and before any heredoc; empty when there is none."""
        found = TRAILING_CUT.search(self.text)
        if not self.recorded or found is None or "<<" in self.text:
            return ""
        before = self.text[:found.start()]
        return found.group(0).strip() if before.count("'") % 2 == 0 and before.count('"') % 2 == 0 else ""

    def uncut(self) -> "Part":
        """The command run whole: its output is kept as a numbered output, so a cut at its end only loses lines."""
        cut = self.cut()
        return replace(self, text=self.text[:self.text.rindex(cut)].rstrip()) if cut else self
