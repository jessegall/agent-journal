from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence

from engine.agent_machine.stepping.admission_receipt import AdmissionReceipt
from engine.agent_machine.stepping.grant import Grant
from engine.command.context import Context
from engine.agent_machine.needs.agent_reference import AgentReference


class GrantLedger(ABC):
    """The one ledger of grants and admission receipts, bound by the module that keeps their rows."""

    @abstractmethod
    def usable_grants(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Grant]]: ...

    @abstractmethod
    def open_receipt(self, agent_id: int, command_fingerprint: str, policy_key: str) -> AdmissionReceipt | None: ...

    # spends the grant in the step's own write; a grant no longer usable raises, which withdraws the admission
    @abstractmethod
    def spend(self, grant: Grant, firing: str, command_fingerprint: str, context: Context) -> None: ...
