<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\PromptSubmitted;
use App\Core\Hooks\Inputs\SessionEnded;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Inputs\ToolFinished;

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
