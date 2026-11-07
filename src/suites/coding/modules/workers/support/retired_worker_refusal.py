from core.base.refusal import Refusal


class RetiredWorkerRefusal(Refusal):
    exit_code = 5

    @classmethod
    def create(cls, worker_id: int) -> "RetiredWorkerRefusal":
        return cls(f"worker {worker_id} is retired, for good", "journal worker dispatch <task> starts a new one")
