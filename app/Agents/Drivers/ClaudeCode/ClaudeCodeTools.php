<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

/**
 * The tools of the pinned Claude Code a start runs with, those a turn runs without asking, and the routes to another
 * agent it denies by name.
 */
final readonly class ClaudeCodeTools
{
    /**
     * The evidence-checked tool inventory; it leaves out every tool that starts or reaches another agent.
     */
    public const array ALLOWED = [
        'Bash',
        'Read',
        'Edit',
        'Write',
        'NotebookEdit',
        'WebFetch',
        'WebSearch',
        'ToolSearch',
    ];

    /**
     * The native routes to another agent, denied by name on top of the explicit set.
     */
    public const array DELEGATION = [
        'Agent',
        'Task',
        'Workflow',
        'SendMessage',
        'ListAgents',
        'RemoteTrigger',
        'Skill',
    ];

    /**
     * The tools a headless turn runs without asking, as nobody is there to answer: files, the journal and read-only
     * git.
     */
    public const array ALLOWED_WITHOUT_ASKING = [
        'Read',
        'Edit',
        'Write',
        'NotebookEdit',
        'Bash(journal:*)',
        'Bash(ls:*)',
        'Bash(git status:*)',
        'Bash(git diff:*)',
        'Bash(git log:*)',
    ];

    /**
     * Agent drivers a shell command could start as an unseen child; Bash may not run them.
     */
    public const array NESTED_DRIVERS = [
        'Bash(claude:*)',
        'Bash(codex:*)',
        'Bash(*claude -p*)',
        'Bash(*codex exec*)',
    ];
}
