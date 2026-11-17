<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

use App\Domain\Hooks\Decisions\Decision;

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
