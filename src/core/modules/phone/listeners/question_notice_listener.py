from core.modules.phone.listeners.phone_notice_listener import PhoneNoticeListener


class QuestionNoticeListener(PhoneNoticeListener):
    """When an agent asks the user a question, the subscribed phones are pushed."""

    name = "phone.question-notice"
    event = "question.create"
