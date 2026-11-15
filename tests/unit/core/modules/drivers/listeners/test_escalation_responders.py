from contextlib import nullcontext
from datetime import datetime, timezone
from types import SimpleNamespace

from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.time.timestamp import Timestamp
from core.modules.drivers.listeners.escalation_responder_listener import EscalationResponderListener
from core.modules.drivers.listeners.retired_responder_listener import RetiredResponderListener
from core.modules.drivers.models.driver_epoch import DriverEpoch
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters

BOOT = Timestamp(datetime(2026, 11, 15, 4, 0, tzinfo=timezone.utc))
LATER = Timestamp(datetime(2026, 11, 15, 9, 0, tzinfo=timezone.utc))


def escalation(responder: Responder, refusal_count: int, block_ids: tuple[int, ...] = (4,)) -> SimpleNamespace:
    return SimpleNamespace(id=3, session_agent_id=7, responder=responder, refusal_count=refusal_count, escalation_type=EscalationType.STOPS,
                           block_ids=block_ids, work_keys=())


def woken_parents(row, old_row) -> list[int]:
    woken: list[int] = []
    nudger = SimpleNamespace(send=lambda agent_id, declaration, source, context, **values: woken.append(agent_id))
    agents = SimpleNamespace(find=lambda agent_id: SimpleNamespace(number=2, parent_id=1))
    EscalationResponderListener(agents, nudger).handle(SimpleNamespace(row=row, old_row=old_row), SimpleNamespace())
    return woken


def test_a_parent_responder_is_woken_when_the_escalation_opens_and_when_a_hold_joins_it_whatever_the_counts():
    assert woken_parents(escalation(Responder.PARENT, 5), None) == [1]
    assert woken_parents(escalation(Responder.PARENT, 5, (4, 9)), escalation(Responder.PARENT, 5)) == [1]
    assert woken_parents(escalation(Responder.PARENT, 6), escalation(Responder.PARENT, 5)) == []


def test_a_person_responder_gets_no_agent_line():
    assert woken_parents(escalation(Responder.PERSON, 5), None) == []


def test_a_retirement_cancels_the_agents_own_escalations_and_passes_its_childrens_to_the_person():
    saved: list[object] = []
    escalation_row = SimpleNamespace(changed=lambda **fields: fields)

    def rows(model, fields):
        if model.__name__ == "Agent":
            return [SimpleNamespace(id=7)]
        return [escalation_row]

    queries = SimpleNamespace(query=lambda model: SimpleNamespace(
        filter=lambda **fields: SimpleNamespace(every_row=lambda reason: rows(model, fields),
                                                matching=lambda condition: SimpleNamespace(every_row=lambda reason: rows(model, fields)))))
    listener = RetiredResponderListener(queries, SimpleNamespace(save=lambda row, context: saved.append(row)))
    listener.handle(SimpleNamespace(row=SimpleNamespace(id=1, retired_at=LATER), old_row=SimpleNamespace(retired_at=None)), SimpleNamespace(timestamp=LATER))
    assert saved == [{"state": EscalationState.CANCELLED, "ended_at": LATER}, {"responder": Responder.PERSON}]


def test_a_driving_setting_moves_the_epoch_but_keeps_the_journals_start():
    saved: list[DriverEpoch] = []
    epoch = DriverEpoch(epoch=4, started_at=BOOT)
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(first=lambda: epoch))
    repository = SimpleNamespace(save_change=lambda old, new, context: saved.append(new))
    writers = AnswerBasisWriters(queries, repository, SimpleNamespace(), SimpleNamespace(command_scope=lambda *values: nullcontext()))
    writers.bump_environment(1, SimpleNamespace(actor=None, timestamp=LATER))
    assert (saved[0].epoch, saved[0].started_at) == (5, BOOT)
