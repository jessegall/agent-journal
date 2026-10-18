from dataclasses import dataclass, field


@dataclass(frozen=True)
class WalkStop:
    """Where one path of a walk ended: the workflow, the node and the port, a check's No with no line after it being where the workflow waits, and the counts the workflow kept as the walk left them."""

    workflow: int
    node: int
    port: str
    counts: dict[str, int] = field(default_factory=dict)

    def waits_at(self, workflow: int) -> bool:
        return self.workflow == workflow
