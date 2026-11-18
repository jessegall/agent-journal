# The rules: every state and every line, and who carries each

The journal's conduct toward the agent is the states on its stack and the conducts folded into every state. Only a state moves the agent, and every line the journal says, holds or types is said by one listener: a state's own, a feature's conduct in every state, or the engine where no state may change it (delivering the user's messages, running commands, holding every tool while the context compacts, ending the session). This document is generated from the source: a state is its file, a line is a Nudge on its feature, and the sayer is the class and method that creates it.

## Every state, and who holds its conduct

| State | Title | Class | Extends | File | Answers | What it is |
|---|---|---|---|---|---|---|
| compacting | Compacting | Compacting | BaseState | journal/engine/states/compacting.py | tool_starting, prompt_submitted, stop, session_started | The context is being compacted, until the agent shows it is not: the session starting again, a tool call, a prompt or a stop pops it and hands that event to the state beneath; every journal start pops it too. |
| locked_out | Locked out of the journal | LockedOut | BaseState | journal/engine/states/locked_out.py | tool_starting, compacting, ticked | A worker whose journal stopped answering, pushed by the engine's safety conduct when the journal answers again: every tool is held and nothing is pushed over it, a compaction included; it pops once the journal has answered steadily, or, when the silence outlasted the grace the Settings page sets, ends the worker with every tool held and its stop let through. |
| void | Not at work | Void | BaseState | journal/engine/states/void.py | tool_starting, helper_assignment | Every helper's floor, the bottom of its stack, never popped and never changed by a work mode: no feature's conduct reaches it, every tool but a journal command is refused with the jobless line, and the journal puts the helper to work by an assignment, which it answers by pushing the state the assignment carries. |
| delegating | Delegating a task | Delegating | Working | journal/features/workers/states/delegating.py | stop | A task in hand as the orchestrator: handed to a worker and its report reviewed, never done by the agent itself; a stop names the task to hand over and the open tasks to dispatch. |
| orchestrating | Orchestrating | Orchestrating | Idle | journal/features/workers/states/orchestrating.py | stop, ticked, worker_back | The orchestrator's floor: its task assigner, OrchestratorTaskAssigner, names the tasks to delegate in round robin over the running plans and starts none on the agent; a stop asks about the blocked tasks it can move, then names those tasks to dispatch, and a long quiet or a worker's report names the same; it pushes Orchestrating a plan and Delegating a task where the builder's floor pushes Following a plan and Working. |
| orchestrating_plan | Orchestrating a plan | OrchestratingPlan | FollowingPlan | journal/features/workers/states/orchestrating_plan.py | stop | Following a plan as the orchestrator: the task in hand is handed to a worker and its report reviewed, never done by the agent itself; a stop names the task to hand over and the open tasks to dispatch. |
| soloing | Working alone | Soloing | Idle | journal/features/workers/states/soloing.py | tool_starting | The solo floor: the agent does everything itself, and a worker's dispatch is refused. |
| ended | Ended | Ended | BaseState | journal/engine/states/ended.py | session_started, prompt_submitted, tool_starting, session_ended | The session is over: nothing is allowed and nothing is said until it shows it lives again, by starting, taking a prompt or using a tool; then it is popped. |
| demand_block | DemandBlock | Demand block | BaseState | journal/engine/states/demand_block.py | tool_starting | The agent let a demand's span run out: every tool in the demand's block scope is refused with its refusal until the requirement is met, and then it is popped. |
| panicking | Panicking | Held stops in a loop | BaseState | journal/engine/states/panicking.py | tool_starting, prompt_submitted | The agent's stop was held five times in a row with nothing between: no feature's conduct is heard, so the next stop goes through; the agent is asked to set its state with journal panic and file a report; a tool use or the user's message pops it. |
| sorting_dump | Sorting a dump | SortingDump | BaseState | journal/features/dumps/states/sorting_dump.py | idle, prompt_submitted, dump_arrived_dumps, dump_asked, dump_answered, dump_chosen, dump_filed | The agent files the dump the user dropped: the stop is held until every item is filed or failed, save while it waits on the user's answer; what arrives on the dump, the user's answer and the user's choice of a next step are typed to it; it pops when the dump is filed, told to sum it up, or moves on to the next dump waiting. |
| reading_overview | Reading the overview | ReadingOverview | BaseState | journal/features/briefing/states/reading_overview.py | session_started (after a compaction), tool_starting, overview_read | After a compaction the agent reads the overview before anything else: every tool use and every journal command is refused, but a read of a skill it owes and journal environment overview itself; it pops once the overview has run. |
| weighing_memories | Weighing memories | WeighingMemories | BaseState | journal/features/memory/states/weighing_memories.py | tool_starting, stop, context_decided, resume | At a mark of the context window the agent weighs its memories: writes wait and a stop is refused, reads and journal commands go through; journal memory add, weigh, remove or skip pops it, and so does the end of a compaction over it once the mark owed is cleared. |
| following_sequence | Following a sequence | FollowingSequence | BaseState | journal/features/sequences/states/following_sequence.py | resume, sequence_step_followed, sequence_step_finished, sequence_step_skipped, plan_reviewed, plan_readied, sequence_run_paused, sequence_run_abandoned, sequence_run_cancelled, sequence_run_cannot_finish, tool_starting, stop, session_started, ticked | A sequence in hand, pushed by the sequences conduct when a run starts or a new session takes one over, and popped when it ends, is abandoned, cancelled or cannot finish; one started inside another is pushed over it. Until its step is taken up a write or a run of anything but reads and journal commands waits, while a subagent's dispatch goes through; a step whose file edits wait refuses every write but the commands it lets through. A stop with the step open is refused with the step; a quiet agent is typed the step again; nothing while the run is paused, a question is open or the agent owes the journal something. |
| paused | Paused by you | PausedByUser | Wait | journal/features/pausing/states/paused_by_user.py | tool_starting, user_resumed | The user paused the agent from the viewer: every tool call but a read of the user's messages is held until the user resumes it, by the resume button, which pops it with the carry-on line, or by writing to it; a stop goes through, so a message left meanwhile never deadlocks the agent between the hold and the stop. |
| limited | Usage limit reached | UsageLimited | Wait | journal/features/usage/states/usage_limited.py | ticked, message_arrived, turn_failed | The agent's provider refused its turns on a usage limit: the journal types nothing into its terminal, a message from the user pops it with the inbox line so the message is typed at once, and every so many minutes (usage.check_minutes) it pops to try a turn, which pushes it again while the limit holds. |
| following_plan | Following a plan | FollowingPlan | Working | journal/features/plans/states/following_plan.py | stop, session_started, tool_starting, task_started, task_closed, plan_done, plan_postponed, plan_abandoned | Working with a plan in hand, for the plan's whole life. Its task assigner, PlanTaskAssigner, starts the plan's next task when the task in hand closes and the state keeps the top as that task. At a checkpoint the state has no task in hand: the stop waits for the user, or in auto mode is refused and the agent told to go on. Popped when the plan is done, postponed or abandoned, and on resume when the plan is no longer the one started here. |
| naming_test_commands | Naming the test commands | NamingTestCommands | BaseState | journal/features/plans/states/naming_test_commands.py | push, tool_starting, stop, task_closed, plan_postponed, plan_abandoned, plan_finished | Pushed over the plan's task when it starts while the setting plans.test_commands is empty. Its push tells the agent to name the project's test commands with journal settings set; reads and journal commands go through, every other tool and a stop are held with that line. It leaves once the setting holds a line, and hands its task's close and the plan's pause, cancel or end down to the plan state beneath. |
| waiting | Waiting on a question | Waiting | Wait | journal/features/questions/states/waiting.py | question_answered | The agent asked the user something. Idle is fine; the answer pops it and names the question to read, a prompt from the user is the answer in other words, and beneath another state it pops on resume once its question is answered. Pushed by the questions conduct on QuestionPosed. |
| awaiting | Waiting | Awaiting | Wait | journal/features/tasks/states/awaiting.py | tool_starting, ticked, row_settled, worker_dispatched_workers, worker_back_workers, worker_stopped_workers | The agent waits on something outside its hands, named in words and by the rows that end it, table:id each: workers, outputs, checks, tasks or questions. Each row settling is told and the last pops the wait with what each came to. A wait on workers stands through the agent's own tool use, since it works on meanwhile and is widened by each dispatch; any other wait is lifted when the agent works again. Stopping is fine; in auto mode the next task is named once after a minute, and every five quiet minutes the agent is asked to look. |
| choosing_plan_return | Choosing whether to return to the plan | ChoosingPlanReturn | BaseState | journal/features/plans/states/choosing_plan_return.py | tool_starting, stop, plan_return_answer | Pushed when the agent paused its plan itself and took up a task outside it: until it says with journal plan return whether it goes back to the plan once that task is done, every tool but a journal command and every stop waits; its answer pops it. |
| idle | Idle | Idle | AgentState | journal/features/tasks/states/idle.py | session_started, task_started, plan_started, prompt_submitted, tool_starting, stop, ticked | Nothing in hand: the floor of the stack, never popped. Its task assigner (DefaultTaskAssigner, PlanStartTaskAssigner with plans) starts the next task at a stop in auto mode: an approved plan, then the first open task, a blocked task among them as soon as its block ends. A stop here is held only by a blocked task whose check cannot run. The quiet is measured from the agent's last doing. |
| stuck | Stuck | Stuck | Wait | journal/features/tasks/states/stuck.py |  | The agent said it is truly stuck. Nothing is said until it works again or the user speaks: its own next tool use or a word from the user pops it. |
| working | Working | Working | AgentState | journal/features/tasks/states/working.py | tool_starting, stop, session_started, prompt_submitted, ticked, task_logged, task_closed, task_started, plan_started | On one task. Writes are counted since the last log line: after the first N the log is asked for, every M the task is named back, and past the limit the next write waits for the log line. A stop with the task in hand is told to carry on, with the log line first when it is old; a session resumed with it is told where it stands; a quiet quarter hour is told it is still open. Pushed by journal task start, popped by done and pause. |
| working_task | At work on its task | WorkingTask | BaseState | journal/features/workers/states/working_task.py | tool_starting, stop, command_ended, wait_request, impasse_report, task_closed, worker_delivered, worker_review_requested | A worker at work on its task, pushed over Void when it clocks in: its writes wait while the journal rebases its worktree, it never runs git, it runs tests only as the setting says, its stop waits for an output of its own still running and is told the to-do items still open, it is told the end of each of its outputs, its own journal await and journal stuck push the wait and the stuck state over its work, and it pops back to Void when its work is delivered, sent to review, or its task is closed by the user. |
| researching | Researching | Researching | BaseState | journal/features/workers/states/researching.py | subagent_ended | A Claude Code subagent at work on its own row (its main session and agent id), over Void from its start: its tool uses are answered and recorded as its own, never the main agent's, and its end pops it back to Void before the row ends. |
| verifying | Verifying a dismissal | Verifying | BaseState | journal/features/verification/states/verifying.py | tool_starting, reader_report_judged | The verifier the journal sends to judge a dismissed reader report: every tool but its verdict is refused and no feature's conduct reaches it, so it cannot leave; its verdict ends its session. |
| reviewing | Reviewing a worker's work | Reviewing | BaseState | journal/features/reviewing/states/reviewing.py | tool_starting, stop, worker_reviewed | The reviewer the journal sends, in orchestrator mode with the reviewer on, to review a clocked-out worker's work: it reads and runs the tests, but every file edit is refused, a stop is refused until it gives its report with journal review, and no feature's conduct reaches it, so it cannot leave; its report ends its session. |

## Every line, by feature

One row per line the journal may say: the feature, the nudge key, its words with their values in braces, and the listeners that say it; a line with no sayer is said by a command's output or kept for a state to come.

| Feature | Line (nudge key) | Words | Said by |
|---|---|---|---|
| briefing | briefing.journal_ready | the journal is ready on {{env}} | BriefingConduct.on_stop_briefing |
| briefing | briefing.rules_in_force | {{count}} rules in force: {{rows}} | BriefingConduct.on_stop_briefing |
| briefing | briefing.facts_here | facts about this environment: {{rows}} | BriefingConduct.on_stop_briefing |
| briefing | briefing.reminders_here | reminders here: {{rows}} | BriefingConduct.on_stop_briefing |
| briefing | briefing.handle_the_journal_quietly | handle the journal quietly | BriefingConduct.on_stop_briefing |
| briefing | briefing.the_laws_apply | the journal's laws L1 to L9 in AGENTS.md apply to you | BriefingConduct.on_stop_briefing |
| briefing | briefing.you_took_over | another agent worked this environment until {{at}}, and you took it over | BriefingConduct.on_stop_briefing |
| briefing | briefing.waiting_for_you | waiting for you here: {{rows}} | BriefingConduct.on_stop_briefing |
| briefing | briefing.brief_and_log_after_compaction | after the compaction, the work stands here: {{task}}, its last log {{last_log}}; uncommitted files: {{uncommitted}} | Working.on_session_started |
| briefing | briefing.look_before_the_first_write | before your first write, run `journal environment overview`: it lists the task in hand, the open tasks, the facts and the reminders | BriefingConduct.on_session_started_briefing, BriefingConduct.on_tool_starting_briefing |
| briefing | briefing.stopped_unoriented | you stopped while the journal awaits a look at what is in flight here | BriefingConduct.on_stop_briefing |
| checks | checks.check_failed | check {{n}}, {{title}}, failed | ChecksConduct.on_check_completed_checks |
| checks | checks.check_still_failing | check {{n}}, {{title}}, is still failing | ChecksConduct.on_check_completed_checks |
| dumps | dumps.dump_arrived_file_it | dump {{n}} has {{count}} to file - journal dump items {{n}} | DumpsConduct.on_dump_arrived_dumps, SortingDump.on_dump_arrived_dumps, SortingDump.on_dump_sorted |
| dumps | dumps.dump_still_open_carry_on | dump {{n}} is not filed yet: carry on filing it | SortingDump.on_stop |
| dumps | dumps.the_user_answered_on_the_dump | the user answered your question on dump {{n}} - {{answer}} | SortingDump.on_dump_answered |
| dumps | dumps.dump_filed_sum_it_up | dump {{n}} is filed ({{outcome}}) - sum it up for the user | SortingDump.on_dump_sorted |
| dumps | dumps.the_user_chose_a_step | the user chose {{label}} for dump {{n}} | SortingDump.on_dump_choice |
| dumps | dumps.dump_left_to_you_finish_it | the user left dump {{n}} to you - finish it | SortingDump.on_dump_choice |
| etiquette | etiquette.no_shop_talk | your message talks about the journal's commands | EtiquetteConduct.on_turn_displayed_etiquette |
| etiquette | etiquette.say_you_not_the_user | in the chat you are speaking to the user | EtiquetteConduct.on_turn_displayed_etiquette |
| etiquette | etiquette.no_em_dashes | your chat used em dashes | EtiquetteConduct.on_turn_displayed_etiquette |
| etiquette | etiquette.blank_lines_between_paragraphs | your last message had no blank lines between paragraphs | EtiquetteConduct.on_turn_displayed_etiquette |
| etiquette | etiquette.a_line_is_an_instruction | chat etiquette: a line from the journal is an instruction, not a message | EtiquetteDataReader.read, EtiquetteConduct.on_tool_finished_etiquette |
| faults | faults.slow_request_to_fix | {{method}} {{route}} took {{ms}} ms, over its budget of {{budget}} ms: find what made it slow and fix it at its source | RequestTimeRecorder.flagged |
| laws | laws.name_the_model | the dispatch names no model | LawsConduct.on_tool_starting_laws |
| laws | laws.name_a_profile | the dispatch names no profile of this project: {{asked}} | LawsConduct.on_tool_starting_laws |
| laws | laws.bind_the_job | the dispatch binds the agent to no concrete job | LawsConduct.on_tool_starting_laws |
| laws | laws.cap_the_output | that result was {{lines}} lines, and every line stays in the context | LawsConduct.on_tool_finished_laws |
| memory | memory.decide_at_the_mark | context {{percent}}% full: decide what to keep from it | MemoryConduct.on_anything_memory_threshold |
| memory | memory.write_held_until_decided | writes wait until you decide what to keep from the context | MemoryConduct.on_tool_starting_memory |
| memory | memory.stopped_at_mark | you stopped while the journal awaits a decision at the context mark, {{percent}}% full | MemoryConduct.on_stop_memory |
| memory | memory.check_stale_memory | these are {{stale_after}} days old or more, check they still hold: {{stale}} | MemoryConduct.on_session_started_memory |
| memory | memory.does_the_rule_apply_project_wide | does rule {{n}} apply to the whole project? | MemoryConduct.on_rule_created_memory |
| memory | memory.memory_whispered_back | {{noun}} {{n}}: {{text}} | MemoryConduct.on_anything_memory_hint, MemoryDataReader.read, MemoryRow.line, MemoryHintCard.handle |
| memory | memory.memories_shown_at_clock_in | your memories from your earlier jobs, heaviest first: {{memories}} | WorkerMemoryConduct.on_tool_finished |
| messages | messages.new_message_to_answer | new message {{n}} | DeliverMessage.handle |
| messages | messages.new_messages_to_answer | new messages {{ns}} | nothing yet |
| messages | messages.unread_messages_to_read | {{count}} messages unread: `journal message unread` | nothing yet |
| messages | messages.the_user_reacted | the user put {{face}} on message {{n}} | MessagesConduct.on_reaction_added_messages |
| messages | messages.reply_was_only_a_face | your reply was only {{face}}, so it was not posted | RecordTurn.handle |
| messages | messages.write_held_until_read | you have {{count}} unread messages | MessagesConduct.on_tool_starting_messages_unread |
| messages | messages.answer_before_anything_else | you have not answered message {{messages}} yet | MessagesConduct.on_tool_starting_messages_unanswered |
| messages | messages.tools_held_until_answered | answer or react to message {{messages}} first | MessagesConduct.on_tool_starting_messages_unanswered |
| messages | messages.read_the_words_whole | read the user's words whole: no pipe after `journal message read` or `journal question show` | MessagesConduct.on_tool_starting_messages_read_whole |
| messages | messages.reply_kept_out_as_replied_already | message {{n}} already has your reply {{reply}}, so this one was kept out of the chat | RecordTurn.unanswered |
| messages | messages.closing_words_kept_out_as_repeated | your closing words said again what your reply {{reply}} to message {{n}} said, so they were kept out of the chat | RecordTurn.is_repeat_reply |
| messages | messages.reply_by_tag | a reply needs no command | MessagesConduct.on_tool_finished_messages |
| pins | pins.pin_the_link | {{url}} is not pinned; if the user will come back to it, pin it | PinsDataReader.read, PinsConduct.on_tool_finished_pins |
| plans | plans.next_task_of_the_plan | plan {{n}}: task {{task}}, {{title}} is next. {{briefing}} | PlansConduct.on_task_started_plans |
| plans | plans.plan_done | plan {{n}} is done: its last task closed | FollowingPlan.on_plan_finished |
| plans | plans.plan_waits_on_its_tasks | plan {{n}}: no task can start now; {{left}} blocked or waiting | PlansConduct.on_plan_started_plans, PlansConduct.on_task_closed_plans |
| plans | plans.the_user_postponed_the_plan | the user postponed plan {{n}} | FollowingPlan.on_plan_postponed |
| plans | plans.the_user_abandoned_the_plan | the user abandoned plan {{n}} | FollowingPlan.on_plan_abandoned |
| plans | plans.the_user_approved_the_plan | the user approved plan {{n}} | PlansConduct.on_plan_approved_plans |
| plans | plans.phase_complete_at_a_checkpoint | plan {{n}}: phase {{phase}} is complete and a checkpoint | FollowingPlan.on_stop, FollowingPlan.on_session_started |
| plans | plans.phase_complete_go_on | plan {{n}}: phase {{phase}} is complete, and in auto mode it does not stop you | FollowingPlan.on_stop |
| plans | plans.plan_blocked | plan {{n}} is blocked: {{why}} | PlansConduct.on_plan_blocked_plans |
| plans | plans.plan_reopened | plan {{n}} is open again: {{why}} | PlansConduct.on_plan_reopened_plans |
| plans | plans.plan_not_approved | plan {{n}} is not approved, so it cannot be followed | FollowingPlan.on_push |
| plugins | plugins.plugin_files_are_the_users | an installed plugin's files are the user's to change | PluginsConduct.on_tool_starting_plugins |
| profiles | profiles.worker_profile_is_not_a_subagent | {{name}} is a worker profile: it writes | ProfilesConduct.on_tool_starting_profiles |
| questions | questions.question_answered | question {{n}} is answered | Waiting.on_question_answered, Waiting.on_resume |
| questions | questions.ask_through_the_journal | a question goes through the journal, not your own question tool | QuestionsConduct.on_tool_starting_questions |
| reviewing | reviewing.review_failed | the reviewer of worker {{n}} ended without a report: task {{task}} waits for your own check | ReviewingConduct.on_worker_review_failed_reviewing |
| reviewing | reviewing.reviewer_changes_no_file | you are a reviewer: you change no file and merge nothing | Reviewing.on_tool_starting |
| reviewing | reviewing.reviewer_could_not_decide | reviewer {{reviewer}} could not decide worker {{n}} on task {{task}}: {{report}} | ReviewingConduct.on_worker_review_undecided_reviewing |
| reviewing | reviewing.reviewer_gives_its_report | your review is not given yet | Reviewing.on_stop |
| reviewing | reviewing.reviews_wait_for_a_reviewer | reviews waiting for a reviewer: {{waiting}}; reviewers: {{reviewers}} | ReviewingConduct.on_stop_reviewing, ReviewingConduct.on_ticked_reviewing |
| secrets | secrets.secrets_out_of_reach | the secrets and the MCP keys in the private folder are out of your reach | SecretsConduct.on_tool_starting_secrets |
| secrets | secrets.secret_allowed_for_programs | the user let secret {{n}}, {{title}}, go to {{programs}} | SecretsConduct.on_secret_allowed_secrets |
| sequences | sequences.step_to_follow | sequence {{n}}, step {{step}}: {{text}} | RunTracker.step, SequencesConduct.on_stop_sequences, SequencesConduct.on_ticked_sequences |
| sequences | sequences.following_the_step | following sequence {{n}}, step {{step}}: {{text}} | SequenceCommand.follow |
| sequences | sequences.write_held_for_the_step | a write waits for sequence {{n}}, step {{step}}: {{text}} | SequencesConduct.on_tool_starting_sequences |
| sequences | sequences.sequence_paused | sequence {{n}} is paused at step {{step}}: {{why}} | RunTracker.reminder, SequencesConduct.on_ticked_sequences |
| sequences | sequences.sequence_ended | sequence {{n}} ran its last step | RunTracker.next, RunTracker.skip |
| sequences | sequences.sequence_abandoned | sequence {{n}} abandoned | RunTracker.abandon |
| sequences | sequences.sequence_cannot_finish | sequence {{n}} ended: {{why}} | RunTracker.finish_matching |
| sequences | sequences.the_user_skipped_a_step | the user skipped step {{step}} of sequence {{n}} | RunTracker.skip |
| sequences | sequences.the_user_ended_the_sequence | the user ended sequence {{n}} | RunTracker.end |
| shell | shell.moved_to_the_background | moved to the background as output {{n}} | ShellRunner.foreground |
| shell | shell.outputs_ended | {{outputs}} | ShellConduct.on_ticked_shell_ended |
| shell | shell.use_the_reader | reader {{reader}} already reads this: {{about}} | ShellDataReader.read, ShellConduct.on_tool_starting_shell_readers |
| shell | shell.draft_a_reader | no reader reads {{part}} yet | ReaderDrafts.drafts, ShellConduct.on_ticked (with outputs_ended), ShellConduct.on_tool_finished (with watched_output_ended) |
| shell | shell.read_the_file_in_parts | the file has {{lines}} lines, more than the {{cap}} shown at each end of a command's output | ShellConduct.on_tool_starting_shell_read_in_parts |
| shell | shell.journal_command_runs_alone | a journal command runs on its own, or chained only with other journal commands | ShellConduct.on_tool_starting_shell_journal_alone |
| shell | shell.check_the_background | output {{background_outputs}} still running | ShellConduct.on_ticked_shell_background |
| skills | skills.read_the_skill_first | read the {{skill}} skill before anything else: {{path}} | Requirements.require, SkillsConduct.on_stop_skills |
| skills | skills.stopped_owing | you stopped while the journal awaits the {{skills}} skill to be read | SkillsConduct.on_stop_skills |
| tasks | tasks.carry_on | {{name}} is in hand, {{logged}}: carry on | Working.continue_nudge |
| tasks | tasks.log_first_at_stop | {{name}}, {{logged}}: log where it stands first | Working.on_stop |
| tasks | tasks.task_still_open | {{name}} is still open: log where it stands or finish it | Working.on_ticked |
| tasks | tasks.task_open_with_nothing_logged | task {{n}} is open with nothing logged | nothing yet |
| tasks | tasks.next_task_started | task {{n}} is started next | GitConduct.on_commit_detected |
| tasks | tasks.deferred_work_is_a_task | work deferred in words, not filed: `journal task create` it | nothing yet |
| tasks | tasks.closed_by_commit | commit {{sha}} closed {{tasks}} | GitConduct.on_commit_detected_git |
| tasks | tasks.stop_polling | you ran the same check {{times}} times in a row: {{command}} | TasksConduct.on_tool_starting_tasks |
| tasks | tasks.log_where_it_stands | {{edits}} edits since you logged {{name}}: say where it stands | Working.on_tool_starting |
| tasks | tasks.write_held_until_logged | {{edits}} edits since you logged {{name}} | Working.on_tool_starting |
| tasks | tasks.task_in_hand_repeated | {{name}} in hand, {{edits}} edits | Working.on_tool_starting |
| tasks | tasks.check_the_wait | check {{what}} now: you have waited {{minutes}} min | ExternalWait.on_ticked |
| tasks | tasks.check_in_after_quiet | nothing has happened for half an hour: is there anything left for you to do? | Stop.on_ticked |
| tasks | tasks.wait_over | the wait for {{what}} is over: {{outcome}} | ExternalWait.resolution |
| tasks | tasks.next_task_while_waiting | while you wait for {{what}}, task {{n}}, {{title}} is next | ExternalWait.on_ticked |
| tasks | tasks.task_reopened | task {{n}} is open again: {{on}} is answered or closed | TasksConduct.on_task_reopened_tasks |
| tasks | tasks.fix_the_broken_wait | {{waits}} | Stop.on_stop |
| tasks | tasks.blocked_tasks_without_wait | blocked with no wait: {{tasks}} | TasksConduct.on_ticked_tasks, TasksConduct.on_task_closed_tasks |
| triggers | triggers.nudge | {{title}} | Trigger, bring_triggers, TriggersConduct.on_tool_starting_triggers, TriggerCommand.arguments |
| triggers | triggers.instruct | do this now: {{title}} | bring_triggers, TriggersConduct.on_tool_starting_triggers |
| triggers | triggers.denied | a trigger denies this: {{title}} | TriggersConduct.on_tool_starting_triggers |
| voices | voices.how_to_talk_to_the_user | how to talk to the user | VoicesConduct.on_session_started_voices |
| voices | voices.introduce_yourself | introduce yourself to the user in the chat | VoicesConduct.on_session_started_voices_introduce |
| voices | voices.the_voice_changed | the user changed how you talk to them | VoicesConduct.on_setting_changed_voices |
| voices | voices.say_you_are_back | you are back in a conversation that went on before: say so to the user in a line, in your voice | VoicesConduct.on_session_started_voices_introduce |
| workers | workers.release_waits_for_the_user | {{line}} waits for the user: Orchestrator may release is off | WorkersConduct.on_tool_starting_workers |
| workers | workers.worker_has_no_work_left | worker {{n}} has no work left | WorkersConduct.on_worker_queue_empty_workers |
| workers | workers.worker_reported | worker {{n}}, {{name}}, reported in the chat | WorkersConduct.on_worker_reported_workers, ExternalWait.on_worker_reported_workers |
| workers | workers.worker_stopped_unreported | worker {{n}}, {{name}}, stopped before it reported | ExternalWait.on_worker_stopped_workers |
| workers | workers.too_many_subagents | {{running}} subagents are running, the most at once | WorkersConduct.on_tool_starting_workers_limit |
| workers | workers.too_many_workers | {{out}} workers are out, the most at once | WorkerCommand.dispatch |
| workers | workers.file_is_the_workers | that file is in worker {{n}}'s worktree | WorkersConduct.on_tool_starting_workers_worktrees |
| workers | workers.act_on_the_reports | {{reports_waiting}} reported and you have not acted on it yet | WorkersConduct.on_worker_reported_workers |
| workers | workers.send_the_job_to_the_subagent | subagent {{session}} ({{task}}) already worked on the files this job names | WorkersConduct.on_tool_starting_workers_known |

## Kept in code, by design

- Delivering the user's messages to the agent (DeliverMessage, TellInbox), running the agent's commands, the shell runner and its limits, holding every tool while the context compacts (Compacting), ending a session (Ended) and the one session per environment rule are the engine's: no state may change them.
- What the agent owes the journal, the journal skill to read, the look at what is in flight and the decision at a context mark, is a fact on its row set by a feature's recording listener and held by that feature's conduct; SkillRead, LookTaken and MarkDecided pay the debt.
- The stories under tests/stories are the record of what the states say: every behaviour that drives the agent is a story, written before its code.
