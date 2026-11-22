<?php

declare(strict_types=1);

namespace App\Hooks\Inputs\Contracts;

use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolRequested;

/**
 * Whatever answers hooks, one method per hook; the agent states implement it. A method returns nothing to pass, a
 * decision, a context or message line, or yields lines with at most one decision, last.
 */
interface HookAnswerer
{
    public function onSessionStart(SessionStarted $input): mixed;

    public function onPrompt(PromptSubmitted $input): mixed;

    public function onShellCommand(ShellCommandRequested $input): mixed;

    public function onToolRequested(ToolRequested $input): mixed;

    public function onFileEdit(FileEditRequested $input): mixed;

    public function onStop(StopRequested $input): mixed;

    public function onCompaction(ContextCompacted $input): mixed;

    public function onToolFinished(ToolFinished $input): mixed;

    public function onSessionEnd(SessionEnded $input): mixed;
}
