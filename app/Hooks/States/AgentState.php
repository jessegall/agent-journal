<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Lifecycle\LifecycleContext;

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
     * Runs after a committed stack change put this frame on the stack.
     */
    public function onEnter(LifecycleContext $context): void {}

    /**
     * Runs after a committed stack change made this frame the top again, when the frames above it left.
     */
    public function onResume(LifecycleContext $context): void {}

    /**
     * Runs after a committed stack change took this frame off the stack.
     */
    public function onExit(LifecycleContext $context): void {}

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
