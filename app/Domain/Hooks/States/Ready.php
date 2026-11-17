<?php

declare(strict_types=1);

namespace App\Domain\Hooks\States;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionEnded;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;

/**
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states.
 */
class Ready extends AgentState
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
