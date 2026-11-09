from collections.abc import Mapping
from dataclasses import dataclass, replace

from core.base.library.library_hit import LibraryHit
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


@dataclass(frozen=True)
class ItemSummary:
    """One line of the server's list: an item without its text, an excerpt where a search matched, and the number of
    the local copy that follows it, when there is one."""

    share: str
    item_id: int
    version: int
    title: str
    abstract: str
    excerpt: str
    creator: str
    author: str
    changed_at: str
    copy_id: int | None = None

    @classmethod
    def parsed(cls, body: object) -> "ItemSummary":
        fields = LibraryAnswer.fields(body)
        try:
            return cls(str(fields["kind"]), LibraryAnswer.number(fields["id"]), LibraryAnswer.number(fields["version"]), str(fields["title"]), str(fields.get("abstract", "")),
                       str(fields.get("excerpt", "")), str(fields.get("creator", "")), str(fields.get("updated_by", "")), str(fields.get("updated_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    def hit(self) -> LibraryHit:
        return LibraryHit(self.share, self.item_id, self.title, self.excerpt)

    def with_copy(self, copy_id: int | None) -> "ItemSummary":
        return replace(self, copy_id=copy_id)

    def lines(self) -> list[str]:
        copy = "" if self.copy_id is None else f"  copy {self.copy_id}"
        head = f"{self.share} {self.item_id}  v{self.version}  {self.title}  {self.author}  {self.changed_at[:10]}{copy}"
        return [head, f"    {self.excerpt}"] if self.excerpt else [head]

    def json(self) -> Mapping[str, object]:
        return {"share": self.share, "id": self.item_id, "version": self.version, "title": self.title, "abstract": self.abstract, "excerpt": self.excerpt,
                "creator": self.creator, "updated_by": self.author, "updated_at": self.changed_at, "copy_id": self.copy_id}
