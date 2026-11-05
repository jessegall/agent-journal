from core.modules.phone.listeners.phone_notice_listener import PhoneNoticeListener
from core.base.change.created import Created
from core.modules.questions.models.question import Question


class QuestionNoticeListener(PhoneNoticeListener[Created[Question]]):
    """When an agent asks the user a question, the subscribed phones are pushed."""

    name = "phone.question-notice"
