<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

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
 * A test state that passes every hook and remembers which hook methods it was asked.
 */
final class RecordState extends AgentState
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

    public function onToolRequested(ToolRequested $input): Decision
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

        return Decision::delegate();
    }
}
