from core.modules.phone.listeners.phone_notice_listener import PhoneNoticeListener
from engine.event.moved import Moved
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


class PlanNoticeListener(PhoneNoticeListener[Moved[Plan]]):
    """When a plan becomes ready for the user's approval, the subscribed phones are pushed."""

    name = "phone.plan-notice"
    moves = tuple([PlanLifecycle.ready])
