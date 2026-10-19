from dataclasses import dataclass


@dataclass(frozen=True)
class Profile:
    """A read-only subagent the journal writes for every provider: what it does, which tools it may use, what it says back."""

    REPORTS = ("You only read: change no file, run no tests and write nothing to the journal; the agent that started you does the writing. "
               "Read narrowly: search for the line, read the range you need, never a whole large file. Answer in a short report written to "
               "the agent that started you, with the files and lines that show each point and what you could not check.")

    name: str
    description: str
    tools: str
    body: str

    def claude_text(self, model: str) -> str:
        return f"---\nname: {self.name}\ndescription: {self.description}\ntools: {self.tools}\nkind: subagent\nmodel: {model}\n---\n\n{self.body} {self.REPORTS}\n"

    def codex_text(self, model: str) -> str:
        return (f'name = "{self.name}"\ndescription = "{self.description}"\nmodel = "{model}"\nsandbox_mode = "read-only"\n'
                f'developer_instructions = "{(self.body + " " + self.REPORTS).replace(chr(34), chr(39))}"\n')
