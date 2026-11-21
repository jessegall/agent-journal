<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolRequested;
use App\Hooks\States\AgentState;

/**
 * A test state that gives the same decision to every hook and counts how often a hook method was asked; it may also
 * answer every hook from before().
 */
final class ScriptedState extends AgentState
{
    public int $askedCount = 0;

    public function __construct(
        private readonly Decision $decision,
        private readonly bool $finished = false,
        private readonly Decision|null $beforeDecision = null,
    ) {}

    public function before(HookInput $input): Decision|null
    {
        return $this->beforeDecision;
    }

    public static function delegating(): self
    {
        return new self(Decision::delegate());
    }

    public function isFinished(): bool
    {
        return $this->finished;
    }

    public function onSessionStart(SessionStarted $input): Decision
    {
        return $this->answer();
    }

    public function onPrompt(PromptSubmitted $input): Decision
    {
        return $this->answer();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return $this->answer();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->answer();
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->answer();
    }

    public function onStop(StopRequested $input): Decision
    {
        return $this->answer();
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        return $this->answer();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        return $this->answer();
    }

    public function onSessionEnd(SessionEnded $input): Decision
    {
        return $this->answer();
    }

    private function answer(): Decision
    {
        $this->askedCount++;

        return $this->decision;
    }
}
