<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use App\Core\Hooks\Contracts\HookAnswerer;
use App\Core\Hooks\Contracts\HookInput;
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
 * One state on an agent's stack. Every hook method delegates to the state below until a state overrides it, and
 * before() may answer any hook first, as a Laravel policy's before does.
 */
abstract class AgentState implements HookAnswerer
{
    /**
     * Whether the work this state stands for is done, so the state may leave the stack.
     */
    public function isFinished(): bool
    {
        return false;
    }

    /**
     * Asked before the hook's own method: a decision answers the hook and the method is not asked; null, the default,
     * goes on to the method.
     */
    public function before(HookInput $input): Decision|null
    {
        return null;
    }

    public function onSessionStart(SessionStarted $input): Decision
    {
        return Decision::delegate();
    }

    public function onPrompt(PromptSubmitted $input): Decision
    {
        return Decision::delegate();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return Decision::delegate();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::delegate();
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::delegate();
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        return Decision::delegate();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        return Decision::delegate();
    }

    public function onSessionEnd(SessionEnded $input): Decision
    {
        return Decision::delegate();
    }
}
