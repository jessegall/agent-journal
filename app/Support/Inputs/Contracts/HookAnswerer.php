<?php

declare(strict_types=1);

namespace App\Support\Inputs\Contracts;

use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;

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
