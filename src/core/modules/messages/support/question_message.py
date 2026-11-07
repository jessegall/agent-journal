import re


class QuestionMessage:
    """Finds unanswered choice questions in message text."""

    CHOICE = re.compile(r"\b(?:do you want|would you (?:like|prefer)|should I|shall I|can I|which|choose|pick)\b", re.IGNORECASE)
    ALTERNATIVE = re.compile(r"\bor\b", re.IGNORECASE)
    OPTION = re.compile(r"^\s*(?:[-*]|\d+[.)]|[A-Za-z][.)])\s+\S")

    @classmethod
    def is_choice(cls, text: str) -> bool:
        text = text.strip()
        if not text:
            return False
        question_index = text.rfind("?")
        if question_index < 0:
            return bool(cls.CHOICE.match(text.splitlines()[-1]))
        suffix = [line for line in text[question_index + 1:].splitlines() if line.strip()]
        if suffix and not all(cls.OPTION.match(line) for line in suffix):
            return False
        question = text[:question_index].rsplit("?", 1)[-1].rsplit("\n", 1)[-1]
        return bool(cls.CHOICE.search(question) or cls.ALTERNATIVE.search(question))
