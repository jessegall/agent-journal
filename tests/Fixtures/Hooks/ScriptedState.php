<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

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
 * A test state that gives the same answer to every hook, a decision or nothing to pass, and counts how often a hook
 * method was asked.
 */
final class ScriptedState extends AgentState
{
    public int $askedCount = 0;

    public function __construct(
        private readonly Decision|null $decision,
        private readonly bool $finished = false,
    ) {}

    public static function passing(): self
    {
        return new self(null);
    }

    public function isFinished(): bool
    {
        return $this->finished;
    }

    public function onSessionStart(SessionStarted $input): Decision|null
    {
        return $this->answer();
    }

    public function onPrompt(PromptSubmitted $input): Decision|null
    {
        return $this->answer();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision|null
    {
        return $this->answer();
    }

    public function onFileEdit(FileEditRequested $input): Decision|null
    {
        return $this->answer();
    }

    public function onToolRequested(ToolRequested $input): Decision|null
    {
        return $this->answer();
    }

    public function onStop(StopRequested $input): Decision|null
    {
        return $this->answer();
    }

    public function onCompaction(ContextCompacted $input): Decision|null
    {
        return $this->answer();
    }

    public function onToolFinished(ToolFinished $input): Decision|null
    {
        return $this->answer();
    }

    public function onSessionEnd(SessionEnded $input): Decision|null
    {
        return $this->answer();
    }

    private function answer(): Decision|null
    {
        $this->askedCount++;

        return $this->decision;
    }
}
