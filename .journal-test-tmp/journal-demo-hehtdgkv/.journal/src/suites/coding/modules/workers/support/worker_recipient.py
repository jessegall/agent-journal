RECIPIENT_PREFIX = "worker "


class WorkerRecipient:
    """How a message names the worker it is for: the word worker and its agent number."""

    @staticmethod
    def text(worker_id: int) -> str:
        return f"{RECIPIENT_PREFIX}{worker_id}"

    @staticmethod
    def worker_id(recipient: str) -> int:
        return int(recipient.removeprefix(RECIPIENT_PREFIX))

    @staticmethod
    def matches_worker(recipient: str) -> bool:
        return recipient.startswith(RECIPIENT_PREFIX) and recipient.removeprefix(RECIPIENT_PREFIX).isdigit()
