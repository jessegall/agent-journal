from engine.errors.refusal import Refusal
from engine.request.request_queue_status import RequestQueueStatus


class RequestQueue:
    def read(self) -> RequestQueueStatus:
        raise Refusal("the server queue is unavailable", "start the server to read the queue")
