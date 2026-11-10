FORBIDDEN_PORTS = range(8420, 8430)
HOST = "127.0.0.1"


class DemoLink:
    """The link that logs a person into the viewer of a demo journal on its environment, on a port other than
    those of the journals the team runs itself."""

    @staticmethod
    def build(port: int, key: str, environment: str) -> str:
        return f"http://{HOST}:{port}/?key={key}&environment={environment}"

    @staticmethod
    def is_allowed(port: int) -> bool:
        return port not in FORBIDDEN_PORTS
