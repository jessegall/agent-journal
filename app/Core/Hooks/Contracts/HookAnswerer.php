<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

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
