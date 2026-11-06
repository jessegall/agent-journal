from core.base.refusal import Refusal
from core.base.request_queue_status import RequestQueueStatus


class RequestQueue:
    def read(self) -> RequestQueueStatus:
        raise Refusal("the server queue is unavailable", "start the server to read the queue")
