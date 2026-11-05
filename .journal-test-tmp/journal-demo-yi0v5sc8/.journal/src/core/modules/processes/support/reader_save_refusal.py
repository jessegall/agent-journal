from core.base.refusal import Refusal


class ReaderSaveRefusal(Refusal):
    """A failed reader save tied to the request it tried to answer."""

    @staticmethod
    def prefix(request_id: int) -> str:
        return f"reader request {request_id} save failed: "

    @classmethod
    def failed_save(cls, request_id: int, refusal: Refusal) -> "ReaderSaveRefusal":
        return cls(cls.prefix(request_id) + refusal.text)
