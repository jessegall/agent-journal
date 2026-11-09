from core.base.private.secret_values import SecretValues
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.documents.support.mention_refs import MentionRefs
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.library_shares import LibraryShares
from core.modules.library.support.outgoing_item import OutgoingItem
from core.modules.secrets.guards.secret_value_guard import SHORTEST_GUARDED_CHARACTERS


class OutgoingItems:
    """Checks a local row before it is shared and gives what is sent: the row must exist, its share must allow it, it
    must follow no item yet, and no text of it may hold the value of a stored secret."""

    def __init__(self, shares: LibraryShares, queries: Queries, values: SecretValues, registry: Registry) -> None:
        self.shares, self.queries, self.values, self.registry = shares, queries, values, registry

    def checked(self, share_name: str, row_id: int) -> OutgoingItem:
        share = self.shares.lookup(share_name)
        row = self.queries.query(share.model).find(row_id)
        refusal = share.share_refusal(row)
        if refusal:
            raise Refusal(f"{share_name} {row_id} cannot be shared: {refusal}", f"journal {share_name} show {row_id} shows it")
        followed = self.queries.query(LibraryCopy).filter(share=share_name, row_id=row_id).first()
        if followed is not None:
            raise Refusal(f"{share_name} {row_id} already follows library {share_name} {followed.item_id}", "journal library copies shows what follows what")
        fields = share.fields(row)
        texts = [str(value) for value in fields.values()]
        self.require_no_secret(share_name, texts)
        return OutgoingItem(fields, share.digest(row), self.warning(texts))

    def require_no_secret(self, share_name: str, texts: list[str]) -> None:
        for value, variable in self.values.hidden_values().items():
            if len(value) >= SHORTEST_GUARDED_CHARACTERS and any(value in text for text in texts):
                raise Refusal(f"this {share_name} contains the value of {variable}", "name the secret, never its value")

    def warning(self, texts: list[str]) -> str:
        names = [f"{name} {number}" for name, number in MentionRefs.found("\n".join(texts), self.registry.models)]
        return f"this text names {' and '.join(names)}; those numbers mean something else in another journal" if names else ""
