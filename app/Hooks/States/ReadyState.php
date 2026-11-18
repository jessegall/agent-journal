<?php

declare(strict_types=1);

namespace App\Hooks\States;

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
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states.
 */
class ReadyState extends AgentState
{
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
        return Decision::allow();
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
