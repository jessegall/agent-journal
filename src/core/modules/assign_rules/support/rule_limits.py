from engine.errors.refusal import Refusal
from core.modules.assign_rules.models.support.task_words import split_terms

MOST_RULES = 50
MOST_CONDITIONS = 8
MOST_WORD_CHARACTERS = 40
MOST_PHRASE_WORDS = 5


class RuleLimits:
    """The limits of the assign rules: rules in an environment, conditions in a rule, and the words a
    condition looks for."""

    @staticmethod
    def check_rule_count(count: int) -> None:
        if count >= MOST_RULES:
            raise Refusal(f"an environment has at most {MOST_RULES} rules", "delete a rule, or join two rules into one")

    @staticmethod
    def check_condition_count(count: int) -> None:
        if count == 0:
            raise Refusal("a rule needs at least one condition", "give the condition any to match every task")
        if count > MOST_CONDITIONS:
            raise Refusal(f"a rule has at most {MOST_CONDITIONS} conditions", "split it into two rules")

    @staticmethod
    def check_phrase(phrase: str) -> None:
        if not phrase:
            raise Refusal("the word to look for is empty", "give a word or a phrase")
        if not any(character.isalnum() for character in phrase):
            raise Refusal(f"{phrase!r} has no letter or digit", "give a word with letters or digits")
        terms = split_terms(phrase)
        if len(terms) > MOST_PHRASE_WORDS:
            raise Refusal(f"a phrase has at most {MOST_PHRASE_WORDS} words, not {len(terms)}", "use a shorter phrase, or two conditions")
        long_terms = [term for term in terms if len(term) > MOST_WORD_CHARACTERS]
        if long_terms:
            raise Refusal(f"a word has at most {MOST_WORD_CHARACTERS} characters: {long_terms[0]!r} has {len(long_terms[0])}", "use a shorter word")
