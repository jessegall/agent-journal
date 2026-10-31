from core.base.driver.suite import Suite


class CodingSuite(Suite):
    """Building software: the builder or the orchestrator drives the main agent, which starts workers, reviewers and
    verifiers, while the agent program's own subagents read for it."""

    name = "coding"
    defaults = {"main": "coding.builder", "worker": "coding.worker", "subagent": "coding.subagent", "reviewer": "coding.reviewer",
                "verifier": "coding.verifier"}
