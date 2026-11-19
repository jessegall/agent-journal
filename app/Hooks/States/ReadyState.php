<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Hooks\Contracts\FileEditPermission;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;

/**
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states. Whether it lets a
 * file change is what the agent's profile grants, never the agent's role.
 */
class ReadyState extends AgentState
{
    public const string TYPE_KEY = 'hooks.ready';

    public function __construct(private readonly FileEditPermission $permission) {}

    public function onSessionStart(SessionStarted $input): Decision
    {
        return Decision::allow();
    }

    public function onPrompt(PromptSubmitted $input): Decision
    {
        return Decision::allow();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return Decision::allow();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        if ($this->permission->mayEditFiles()) {
            return Decision::allow();
        }

        $paths = implode(', ', $input->changes->paths());

        return Decision::deny(
            "Your profile grants no changes to workspace files, so this edit of {$paths} is refused.",
        );
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::allow();
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        return Decision::allow();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        return Decision::allow();
    }

    public function onSessionEnd(SessionEnded $input): Decision
    {
        return Decision::allow();
    }
}
