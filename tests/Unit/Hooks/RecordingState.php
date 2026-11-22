<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

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
 * A test state that passes every hook and remembers which hook methods it was asked.
 */
final class RecordingState extends AgentState
{
    /**
     * @var list<string>
     */
    public array $askedMethods = [];

    public function onSessionStart(SessionStarted $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onPrompt(PromptSubmitted $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onShellCommand(ShellCommandRequested $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onFileEdit(FileEditRequested $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onToolRequested(ToolRequested $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onStop(StopRequested $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onCompaction(ContextCompacted $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onToolFinished(ToolFinished $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    public function onSessionEnd(SessionEnded $input): null
    {
        return $this->answer(__FUNCTION__);
    }

    private function answer(string $method): null
    {
        $this->askedMethods[] = $method;

        return null;
    }
}
