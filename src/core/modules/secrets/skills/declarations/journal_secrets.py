from engine.skill.skill_declaration import SkillDeclaration


class JournalSecrets(SkillDeclaration):
    """The skill journal-secrets: use keys and logins without seeing them."""

    folder = "journal-secrets"
    description = "Use keys and logins without seeing them; read it when a task needs a key or a login"
    keywords = ("secret", "secrets", "api key", "token", "password", "login")
    commands = ["secret"]
