from journal.http.support.project_check import PROJECT_REFUSAL_PREFIX
import json
import re
from journal.engine.nudge import Nudge
from tests.stories.builder.story_agent import StoryAgent

# a hook duration as the terminal line shows it to the user
HOOK_DURATION = re.compile(r"\b[A-Za-z]+: \d+ ms\b")


class StepChecks:
    """The checks made on what one step brought: the lines the journal gave, the hook's verdict, the command's outcome, the shell's text and the viewer's answer."""

    def expect_refused_as_another_projects(self) -> None:
        refusal = (self.verdict.body.get("error", "") if self.verdict else "") or (self.command.error if self.command else "")
        assert PROJECT_REFUSAL_PREFIX in refusal, f"not refused as another project's: {self.verdict or self.command}"

    def expect_agent_told_words(self, agent: StoryAgent, nudge: Nudge, part: str) -> None:
        session = self.story.session_of(agent)
        lines = [nudge.create(**line.values).rendered() for line in self.said if line.key == nudge.key and line.session == session]
        assert any(part in line for line in lines), f"{session} not told {part!r} in {nudge.key}: {lines}"

    def expect_command_lines_holding(self, part: str, count: int) -> None:
        holding = [line for line in self.command.text.splitlines() if part in line] if self.command else []
        assert len(holding) == count, f"{len(holding)} lines of the command hold {part!r}, not {count}: {holding}"

    def account(self) -> str:
        return f"told {[(lines.session, lines.key, lines.values) for lines in self.said]}; stack {self.story.stack()}"

    def expect_agent_told(self, agent: StoryAgent, nudge: Nudge, **values) -> None:
        self.expect_told_to(self.story.session_of(agent), nudge, values)

    def expect_told_to(self, session: str, nudge: Nudge, values: dict) -> None:
        assert any(lines.matches(nudge.key, values) and lines.session == session for lines in self.said), f"{session} not told {nudge.key} {values}; {self.account()}"

    def expect_agent_not_told(self, agent: StoryAgent, nudge: Nudge, **values) -> None:
        self.expect_not_told_to(self.story.session_of(agent), nudge, values)

    def expect_not_told_to(self, session: str, nudge: Nudge, values: dict) -> None:
        assert not any(lines.matches(nudge.key, values) and lines.session == session for lines in self.said), f"{session} told {nudge.key} {values}; {self.account()}"

    def expect_agent_told_nothing(self, agent: StoryAgent) -> None:
        told = [line for line in self.said if line.session == self.story.session_of(agent)]
        assert not told, f"told something; {self.account()}"

    def expect_refused(self, agent: StoryAgent, nudge: Nudge, **values) -> None:
        assert self.verdict is not None and self.verdict.refused(), f"let through; {self.account()}"
        self.expect_agent_told(agent, nudge, **values)

    def expect_refused_by_anything(self) -> None:
        assert self.verdict is not None and self.verdict.refused(), f"let through; {self.account()}"

    def expect_refusal_text(self, part: str) -> None:
        said = str(self.verdict.body) if self.verdict else ""
        assert part in said, f"the refusal does not say {part!r}: {said}"

    def expect_refusal_without(self, part: str) -> None:
        said = str(self.verdict.body) if self.verdict else ""
        assert part not in said, f"the refusal says {part!r}: {said}"

    def expect_allowed(self) -> None:
        assert self.verdict is not None and not self.verdict.refused(), f"refused; {self.account()}"

    def expect_shell_text(self, *parts: str) -> None:
        assert all(part in self.shell_text for part in parts), f"the command showed {self.shell_text!r}, not {parts}"

    def expect_shell_text_without(self, part: str) -> None:
        assert part not in self.shell_text, f"the command showed {part!r}: {self.shell_text!r}"

    def expect_shell_exit(self, code: int) -> None:
        assert self.shell_exit == code, f"the command ended {self.shell_exit}, not {code}"

    def expect_command_passed(self) -> None:
        assert self.command is not None and self.command.code == 0, f"the command was refused: {self.command.error or self.command.text if self.command else ''}"

    def expect_command_text(self, part: str) -> None:
        printed = f"{self.command.text}{self.command.error}" if self.command else ""
        assert part in printed, f"the command printed {printed!r}, not {part!r}"

    def expect_command_text_without(self, part: str) -> None:
        printed = f"{self.command.text}{self.command.error}" if self.command else ""
        assert part not in printed, f"the command printed {part!r}: {printed!r}"

    def expect_command_lines_in_order(self, *parts: str) -> None:
        lines = self.command.text.splitlines()
        places = [next((k for k, line in enumerate(lines) if part in line), -1) for part in parts]
        assert -1 not in places and places == sorted(places), f"the command printed {', '.join(parts)} out of this order: {self.command.text}"

    def expect_command_line_count(self, count: int) -> None:
        lines = self.command.text.strip().splitlines()
        assert len(lines) == count, f"the command printed {len(lines)} lines, not {count}: {self.command.text}"

    def expect_viewer_passed(self) -> None:
        assert self.viewer_status < 300, f"the viewer's request was refused: {self.viewer_answer}"

    def expect_viewer_refused(self, part: str) -> None:
        assert self.viewer_status >= 300 and part in json.dumps(self.viewer_answer), f"the viewer's request answered {self.viewer_status} {self.viewer_answer}, not a refusal saying {part!r}"

    def expect_viewer_text(self, part: str) -> None:
        assert self.viewer_status < 300 and part in json.dumps(self.viewer_answer), f"the viewer's request answered {self.viewer_status} {self.viewer_answer}, not text holding {part!r}"

    def expect_viewer_never_says(self, part: str) -> None:
        assert part not in json.dumps(self.viewer_answer), f"the viewer's request answered with {part!r} in it: {self.viewer_answer}"

    def expect_viewer_shows(self, name: str, value: object) -> None:
        assert self.viewer_answer.get(name) == value, f"the viewer was given {name} {self.viewer_answer.get(name)!r}, not {value!r}"

    def expect_viewer_rows(self, key: str, field: str, values: list) -> None:
        shown = [row.get(field) for row in self.viewer_answer.get(key, [])]
        assert shown == values, f"the viewer was given {key} with {field} {shown}, not {values}"

    def expect_viewer_rows_count(self, count: int) -> None:
        assert len(self.viewer_answer) == count, f"the viewer was given {len(self.viewer_answer)} rows, not {count}: {self.viewer_answer}"

    def expect_viewer_list_field(self, field: str, values: list) -> None:
        shown = [row.get(field) for row in self.viewer_answer]
        assert shown == values, f"the viewer was given {field} {shown}, not {values}"

    def expect_viewer_rows_holding(self, key: str, field: str, value: object) -> None:
        shown = [row.get(field) for row in self.viewer_answer.get(key, [])]
        assert value in shown, f"the viewer was given {key} with {field} {shown}, none of them {value!r}"

    def expect_viewer_part(self, path: tuple, value: object) -> None:
        part = self.viewer_answer
        for key in path:
            part = part[key]
        assert part == value, f"the viewer was given {part!r} at {'/'.join(map(str, path))}, not {value!r}"

    def expect_viewer_count_at_most(self, key: str, count: int) -> None:
        shown = self.viewer_answer.get(key, [])
        assert len(shown) <= count, f"the viewer was given {len(shown)} {key}, more than {count}"

    def expect_viewer_rows_newer(self, key: str, n: int) -> None:
        older = [row["id"] for row in self.viewer_answer.get(key, []) if row["id"] <= n]
        assert not older, f"the viewer was given {key} {older}, not newer than {n}"

    def expect_viewer_rows_without(self, key: str, field: str) -> None:
        holding = [row["id"] for row in self.viewer_answer.get(key, []) if field in row]
        assert not holding, f"the viewer was given {key} {holding} with their {field}"

    def expect_viewer_rows_not_holding(self, key: str, field: str, value: object) -> None:
        shown = [row.get(field) for row in self.viewer_answer.get(key, [])]
        assert value not in shown, f"the viewer was given {key} with {field} {value!r}"

    def expect_viewer_first_hit(self, n: int, part: str) -> None:
        first = self.viewer_answer[0] if self.viewer_answer else {}
        assert first.get("id") == n and part in first.get("text", ""), f"the viewer's first hit is {first}, not {n} holding {part!r}"

    def expect_viewer_list_count(self, count: int) -> None:
        assert len(self.viewer_answer) == count, f"the viewer was given {len(self.viewer_answer)} rows, not {count}: {self.viewer_answer}"

    def expect_viewer_count(self, key: str, count: int) -> None:
        shown = self.viewer_answer.get(key, [])
        assert len(shown) == count, f"the viewer was given {len(shown)} {key}, not {count}"

    def expect_tool_input_changed(self, **fields) -> None:
        changed = (self.verdict.body.get("hookSpecificOutput") or {}).get("updatedInput") or {} if self.verdict else {}
        shown = {name: changed.get(name) for name in fields}
        assert shown == fields, f"the tool's input was changed to {changed}, not to hold {fields}"

    def expect_command_refused(self) -> None:
        assert self.command is not None and self.command.code != 0, f"the command passed: {self.command.text if self.command else ''}"

    def expect_hook_duration_shown(self) -> None:
        line = self.user_line()
        assert HOOK_DURATION.search(line), f"the hook's answer shows the user no duration: {self.verdict.body if self.verdict else None}"
        assert not HOOK_DURATION.search(self.agent_text()), f"the hook's duration reached the agent: {self.agent_text()}"

    def user_line(self) -> str:
        body = self.verdict.body if self.verdict else {}
        answer = body.get("answer", body) if isinstance(body, dict) else {}
        return str(answer.get("systemMessage", ""))

    def agent_text(self) -> str:
        body = self.verdict.body if self.verdict else {}
        answer = body.get("answer", body) if isinstance(body, dict) else {}
        specific = answer.get("hookSpecificOutput", {})
        return " ".join(str(part) for part in (specific.get("additionalContext", ""), specific.get("permissionDecisionReason", ""), answer.get("reason", ""), body.get("error", "")))

    def expect_command_line(self, *parts: str) -> str:
        lines = [line for line in self.command.text.splitlines() if all(part in line for part in parts)]
        assert lines, f"no line of the command says {', '.join(parts)}: {self.command.text}"
        return lines[0]
