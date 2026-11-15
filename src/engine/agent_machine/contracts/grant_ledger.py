from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence

from engine.agent_machine.contracts.admission_receipt import AdmissionReceipt
from engine.agent_machine.contracts.grant import Grant
from engine.agent_machine.needs.agent_reference import AgentReference


class GrantLedger(ABC):
    """The one ledger of grants and admission receipts, bound by the module that keeps their rows."""

    @abstractmethod
    def usable_grants(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Grant]]: ...

    @abstractmethod
    def open_receipt(self, agent_id: int, command_fingerprint: str, policy_key: str) -> AdmissionReceipt | None: ...
