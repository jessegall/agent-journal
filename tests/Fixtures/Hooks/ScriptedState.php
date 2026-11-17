<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionEnded;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;
use App\Domain\Hooks\States\AgentState;

/**
 * A test state that gives the same decision to every hook and counts how often it was asked.
 */
final class ScriptedState extends AgentState
{
    public int $askedCount = 0;

    public function __construct(
        private readonly Decision $decision,
        private readonly bool $finished = false,
    ) {}

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
