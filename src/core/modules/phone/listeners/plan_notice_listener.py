from core.modules.phone.listeners.phone_notice_listener import PhoneNoticeListener


class PlanNoticeListener(PhoneNoticeListener):
    """When a plan becomes ready for the user's approval, the subscribed phones are pushed."""

    name = "phone.plan-notice"
    event = "plan.ready"
