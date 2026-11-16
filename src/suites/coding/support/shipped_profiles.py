from engine.enums.occupant import Occupant
from engine.enums.model_tier import ModelTier
from engine.profile.agent_profile import AgentProfile
from core.modules.helpers.types.reader_commands import ReaderCommands
from suites.coding.support.profile_commands import READ_COMMANDS, DOCUMENT_COMMANDS, REPORT_COMMANDS, PLAN_COMMANDS, PLAN_REVIEW_COMMANDS, WORKER_COMMANDS
from suites.coding.support.shipped_texts import ShippedTexts

HELPER_SKILLS = ("journal", "journal-messages", "journal-memory", "journal-shell", "journal-tasks", "journal-helpers", "journal-documents")
PLANNER_SKILLS = (*HELPER_SKILLS, "journal-plans", "journal-planning", "journal-plan-review-applying", "journal-task-cleanup", "journal-sequences")
DESIGN_SKILLS = (*HELPER_SKILLS, "journal-functional-design", "journal-user-stories", "journal-sequences")
PLAN_REVIEW_SKILLS = (*HELPER_SKILLS, "journal-plans", "journal-planning")
MERGER_SKILLS = (*HELPER_SKILLS, "journal-dispatching-workers", "journal-merger")
WORKER_SKILLS = ("journal", "journal-messages", "journal-memory", "journal-shell", "journal-tasks", "journal-worker", "journal-documents", "journal-sequences")

DESIGN_TOOLS = tuple(f"mcp__claude_design__{name}" for name in ("get_claude_design_prompt", "list_projects", "create_project", "get_project", "list_files", "read_file", "write_files", "copy_files", "delete_files", "render_preview",
                                                                  "list_design_systems", "read_design_skill", "finalize_plan", "list_comments", "ack_comments"))

# a designer saves its designs and publishes them as artifacts itself (user 125268)
ARTIFACT_TOOL = "Artifact"
DESIGN_FOLDER = "docs/designs"
READER_RULES = ShippedTexts.rule("reader")
REPORT_RULES = ShippedTexts.rule("report")
DOCUMENT_RULES = ShippedTexts.rule("document")
WORKER_EDIT_RULES = ShippedTexts.rule("worker-edit")
WORKER_UNIT_RULES = ShippedTexts.rule("worker-unit")
WORKER_RULES = WORKER_EDIT_RULES + WORKER_UNIT_RULES
TEXT_VALUES = {"READ_COMMANDS": READ_COMMANDS, "DOCUMENT_COMMANDS": DOCUMENT_COMMANDS, "REPORT_COMMANDS": REPORT_COMMANDS, "PLAN_COMMANDS": PLAN_COMMANDS, "PLAN_REVIEW_COMMANDS": PLAN_REVIEW_COMMANDS,
               "WORKER_COMMANDS": WORKER_COMMANDS, "READER_RULES": READER_RULES, "REPORT_RULES": REPORT_RULES, "DOCUMENT_RULES": DOCUMENT_RULES, "WORKER_EDIT_RULES": WORKER_EDIT_RULES, "WORKER_UNIT_RULES": WORKER_UNIT_RULES, "WORKER_RULES": WORKER_RULES}
RESEARCHER_PROFILE = AgentProfile("journal-researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with evidence. It reads, and files its findings as a report.",
                                  ShippedTexts.profile("journal-researcher", TEXT_VALUES), title="Researcher", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", skills=HELPER_SKILLS)
PLANNER_PROFILE = AgentProfile("journal-planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and the risks. It reads, and files its design as a document or a plan.",
                               ShippedTexts.profile("journal-planner", TEXT_VALUES), title="Planner", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", skills=PLANNER_SKILLS)
FUNCTIONAL_DESIGNER_PROFILE = AgentProfile("journal-functional-designer", "Investigates what a change should do and files a functional design: user stories, code examples and the phases in order. A planner turns it into a plan. It changes no code.",
                                           ShippedTexts.profile("journal-functional-designer", TEXT_VALUES), title="Functional designer", agent_type="helper", tier=ModelTier.STRONGEST, model="opus", codex_model="gpt-6.1-sol", skills=DESIGN_SKILLS, required_skills=("journal-functional-design", "journal-user-stories"))
DEBUGGER_PROFILE = AgentProfile("journal-debugger", "Traces a fault to where it starts and states the fix that belongs there. Read-only.",
                                ShippedTexts.profile("journal-debugger", TEXT_VALUES), title="Debugger", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", skills=HELPER_SKILLS, commands=ReaderCommands())
MERGER_PROFILE = AgentProfile("journal-merger", "Merges workers whose tests passed: reads their proofs and logs, merges, runs the judge and sends findings back, and passes on what the main agent must judge. It edits no code.",
                              ShippedTexts.profile("journal-merger", TEXT_VALUES), title="Merger", agent_type="merger", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-sol", has_parent_report=False, messages_siblings=True, occupant=Occupant.LAUNCH_ROTATION, skills=MERGER_SKILLS)
DESIGNER_PROFILE = AgentProfile("journal-designer", "Designs a screen or a flow, saves it under docs/designs and publishes it as an artifact. It changes no code; a design that needs project files changed goes to a worker.",
                                ShippedTexts.profile("journal-designer", TEXT_VALUES), title="Designer", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", skills=HELPER_SKILLS, mcp_tools=(*DESIGN_TOOLS, ARTIFACT_TOOL), writable_folders=tuple([DESIGN_FOLDER]))
CODE_REVIEWER_PROFILE = AgentProfile("journal-code-reviewer", "Reviews a range of changes, or the code of a project, for faults and for what the user asked against what exists, and files its findings as critical tasks. Read-only.",
                                     ShippedTexts.profile("journal-code-reviewer", TEXT_VALUES), title="Code reviewer", agent_type="helper", tier=ModelTier.STRONGEST, model="opus", codex_model="gpt-6.1-sol", skills=HELPER_SKILLS, commands=ReaderCommands())
PLAN_REVIEWER_PROFILE = AgentProfile("journal-plan-reviewer", "Reviews a plan before it is approved: whether its phases and tasks reach its goal and nothing more, and what must change. Read-only.",
                                     ShippedTexts.profile("journal-plan-reviewer", TEXT_VALUES), title="Plan reviewer", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", occupant=Occupant.LAUNCH_ROTATION, skills=PLAN_REVIEW_SKILLS, commands=ReaderCommands())
WORKER_SENIOR_PROFILE = AgentProfile("journal-worker-senior", "A worker for a job that needs judgement: a design inside the code, a hard fault, a change across many files. Writes, on Opus.",
                                     ShippedTexts.profile("journal-worker-senior", TEXT_VALUES),
                                     base="journal-worker", title="Senior", agent_type="worker", tier=ModelTier.STRONGEST, model="opus", codex_model="gpt-6.1-sol")
WORKER_MEDIOR_PROFILE = AgentProfile("journal-worker-medior", "A worker for a job whose shape is defined: a change the brief states, tests to write, a rename. Writes, on Sonnet.",
                                     ShippedTexts.profile("journal-worker-medior", TEXT_VALUES),
                                     base="journal-worker", title="Medior", agent_type="worker", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra")
WORKER_PROFILE = AgentProfile("journal-worker", "Works the task, the tasks or the plan assigned to it", ShippedTexts.profile("journal-worker", TEXT_VALUES),
                              title="Worker", agent_type="worker", is_base=True, tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra", skills=WORKER_SKILLS)

HELPER_PROFILES = [RESEARCHER_PROFILE, PLANNER_PROFILE, FUNCTIONAL_DESIGNER_PROFILE, DEBUGGER_PROFILE, MERGER_PROFILE, DESIGNER_PROFILE, CODE_REVIEWER_PROFILE, PLAN_REVIEWER_PROFILE]

WORKER_PROFILES = [WORKER_SENIOR_PROFILE, WORKER_MEDIOR_PROFILE, WORKER_PROFILE]
