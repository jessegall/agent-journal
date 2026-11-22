<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Values\StackVerdict;
use PhpOption\None;
use PhpOption\Option;

/**
 * One state on an agent's stack, asked from the top down. Every hook method delegates to the state below until a state
 * overrides it, and the first deny answers the hook. A state only answers: its hook methods, its listeners and its
 * ticks never perform an external effect themselves; what they return is run by their one caller.
 */
abstract class AgentState implements HookAnswerer
{
    /**
     * Whether the work this state stands for is done. A finished frame stays stored but a walk passes over it, as if it
     * were transparent; it leaves only when an explicit pop exposes it at the top.
     */
    public function isFinished(): bool
    {
        return false;
    }

    public function workPermission(): StackVerdict
    {
        return StackVerdict::allow();
    }

    /**
     * The instruction the agent is shown while this is the top live state that has one; none by default.
     *
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return None::create();
    }

    /**
     * The link type of the record this state's subject is, read as the agent's current work while it is the top live
     * state that names one; none by default.
     *
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return None::create();
    }

    public function onSessionStart(SessionStarted $input): mixed
    {
        return null;
    }

    public function onPrompt(PromptSubmitted $input): mixed
    {
        return null;
    }

    public function onShellCommand(ShellCommandRequested $input): mixed
    {
        return null;
    }

    public function onFileEdit(FileEditRequested $input): mixed
    {
        return null;
    }

    public function onToolRequested(ToolRequested $input): mixed
    {
        return null;
    }

    public function onStop(StopRequested $input): mixed
    {
        return null;
    }

    public function onCompaction(ContextCompacted $input): mixed
    {
        return null;
    }

    public function onToolFinished(ToolFinished $input): mixed
    {
        return null;
    }

    public function onSessionEnd(SessionEnded $input): mixed
    {
        return null;
    }
}
