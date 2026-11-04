from dataclasses import replace

import pytest

from core.base.metadata import Metadata
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_approval import MESSAGE_KEY, MODULE_KEY, PlanApproval
from core.modules.plans.support.plan_approval_error import PlanApprovalError


def test_the_approval_note_preserves_other_metadata():
    plan = Plan(id=1, environment_id=1, creator_id=1, title="Release",
                metadata=Metadata({MODULE_KEY: {"review": 3}, "acme.review": {"status": "done"}}))
    metadata = PlanApproval.with_message(plan, 7)
    assert metadata.module_part(MODULE_KEY) == {"review": 3, MESSAGE_KEY: 7}
    assert metadata.module_part("acme.review") == {"status": "done"}
    assert PlanApproval.message_id(replace(plan, metadata=metadata)) == 7
    assert PlanApproval.message_id(plan) is None


@pytest.mark.parametrize("value", [True, "7"])
def test_an_invalid_approval_note_is_reported(value):
    plan = Plan(id=1, environment_id=1, creator_id=1, title="Release",
                metadata=Metadata({MODULE_KEY: {MESSAGE_KEY: value}}))
    with pytest.raises(PlanApprovalError, match="plan 1 has an approval message number that is not an integer"):
        PlanApproval.message_id(plan)
