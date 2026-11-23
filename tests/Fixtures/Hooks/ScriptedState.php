<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\AgentState;

/**
 * A test state that gives the same answer to every hook, a decision or a delegate to pass, and counts how often a hook
 * method was asked.
 */
final class ScriptedState extends AgentState
{
    public int $askedCount = 0;

    public function __construct(
        private readonly Decision $decision,
        private readonly bool $finished = false,
    ) {}

    public static function passing(): self
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
