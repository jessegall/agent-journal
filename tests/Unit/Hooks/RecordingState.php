<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\States\AgentState;

/**
 * A test state that allows every hook and remembers which hook methods it was asked.
 */
final class RecordingState extends AgentState
{
    /**
     * @var list<string>
     */
    public array $askedMethods = [];

    public function onSessionStart(SessionStarted $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onPrompt(PromptSubmitted $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onStop(StopRequested $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    public function onSessionEnd(SessionEnded $input): Decision
    {
        return $this->answer(__FUNCTION__);
    }

    private function answer(string $method): Decision
    {
        $this->askedMethods[] = $method;

        return Decision::allow();
    }
}
