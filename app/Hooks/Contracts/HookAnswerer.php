<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

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
 * Whatever answers hooks, one method per hook; the agent states implement it.
 */
interface HookAnswerer
{
    public function onSessionStart(SessionStarted $input): Decision;

    public function onPrompt(PromptSubmitted $input): Decision;

    public function onShellCommand(ShellCommandRequested $input): Decision;

    public function onFileEdit(FileEditRequested $input): Decision;

    public function onStop(StopRequested $input): Decision;

    public function onCompaction(ContextCompacted $input): Decision;

    public function onToolFinished(ToolFinished $input): Decision;

    public function onSessionEnd(SessionEnded $input): Decision;
}
