from contextlib import nullcontext
from datetime import datetime, timezone
from types import SimpleNamespace

from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.time.timestamp import Timestamp
from core.modules.drivers.listeners.escalation_responder_listener import EscalationResponderListener
from core.modules.drivers.listeners.retired_responder_listener import RetiredResponderListener
from core.modules.drivers.models.driver_epoch import DriverEpoch
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters

BOOT = Timestamp(datetime(2026, 11, 15, 4, 0, tzinfo=timezone.utc))
LATER = Timestamp(datetime(2026, 11, 15, 9, 0, tzinfo=timezone.utc))


def escalation(responder: Responder, refusal_count: int) -> SimpleNamespace:
    return SimpleNamespace(id=3, session_agent_id=7, responder=responder, refusal_count=refusal_count, escalation_type=EscalationType.STOPS)


def woken_parents(row, old_row) -> list[int]:
    woken: list[int] = []
    nudger = SimpleNamespace(send=lambda agent_id, declaration, source, context, **values: woken.append(agent_id))
    agents = SimpleNamespace(find=lambda agent_id: SimpleNamespace(number=2, parent_id=1))
    EscalationResponderListener(agents, nudger).handle(SimpleNamespace(row=row, old_row=old_row), SimpleNamespace())
    return woken


def test_a_parent_responder_is_woken_when_the_escalation_opens_and_when_refusals_join_it():
    assert woken_parents(escalation(Responder.PARENT, 5), None) == [1]
    assert woken_parents(escalation(Responder.PARENT, 6), escalation(Responder.PARENT, 5)) == [1]
    assert woken_parents(escalation(Responder.PARENT, 5), escalation(Responder.PARENT, 5)) == []


def test_a_person_responder_gets_no_agent_line():
    assert woken_parents(escalation(Responder.PERSON, 5), None) == []


def test_a_retiring_parents_open_escalations_pass_to_the_person():
    saved: list[object] = []
    open_escalation = SimpleNamespace(changed=lambda **fields: fields)
    rows = {"Agent": [SimpleNamespace(id=7)], "AgentEscalation": [open_escalation]}
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(
        filter=lambda **fields: SimpleNamespace(every_row=lambda reason: rows[model.__name__],
                                                matching=lambda condition: SimpleNamespace(every_row=lambda reason: rows[model.__name__]))))
    listener = RetiredResponderListener(queries, SimpleNamespace(save=lambda row, context: saved.append(row)))
    listener.handle(SimpleNamespace(row=SimpleNamespace(id=1, retired_at=LATER), old_row=SimpleNamespace(retired_at=None)), SimpleNamespace())
    assert saved == [{"responder": Responder.PERSON}]


def test_a_driving_setting_moves_the_epoch_but_keeps_the_journals_start():
    saved: list[DriverEpoch] = []
    epoch = DriverEpoch(epoch=4, started_at=BOOT)
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(first=lambda: epoch))
    repository = SimpleNamespace(save_change=lambda old, new, context: saved.append(new))
    writers = AnswerBasisWriters(queries, repository, SimpleNamespace(), SimpleNamespace(command_scope=lambda *values: nullcontext()))
    writers.bump_environment(1, SimpleNamespace(actor=None, timestamp=LATER))
    assert (saved[0].epoch, saved[0].started_at) == (5, BOOT)
